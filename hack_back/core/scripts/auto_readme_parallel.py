import requests
import json
import base64
import time
from time import sleep
import concurrent.futures
from tqdm import tqdm  # For progress bar

# Hardcoded GitHub token as per user request
GITHUB_TOKEN = "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"

# Maximum retries for API calls
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

def process_entries(entries):
    """Process entries recursively to get all files"""
    all_files = []
    for entry in entries:
        if entry['type'] == 'blob':
            all_files.append(entry)
        elif entry['type'] == 'tree' and 'object' in entry and entry['object'] and 'entries' in entry['object']:
            # Recursively process files in subdirectories
            all_files.extend(process_entries(entry['object']['entries']))
    return all_files

def handle_api_call(func):
    """Decorator to handle API calls with retries and rate limiting"""
    def wrapper(*args, **kwargs):
        for attempt in range(MAX_RETRIES):
            try:
                response = func(*args, **kwargs)
                
                # Handle rate limiting
                if response.status_code == 403 and 'X-RateLimit-Remaining' in response.headers:
                    if int(response.headers['X-RateLimit-Remaining']) == 0:
                        reset_time = int(response.headers['X-RateLimit-Reset'])
                        wait_time = reset_time - int(time.time()) + 1
                        print(f"Rate limit exceeded. Waiting {wait_time} seconds...")
                        time.sleep(wait_time)
                        continue
                
                # Handle other common status codes
                if response.status_code == 502:
                    print(f"Server error (502). Retrying in {RETRY_DELAY} seconds... (Attempt {attempt + 1}/{MAX_RETRIES})")
                    sleep(RETRY_DELAY)
                    continue
                    
                if response.status_code == 200:
                    return response
                    
                if response.status_code == 401:
                    raise ValueError("Invalid GitHub token. Please check your GITHUB_TOKEN.")
                    
                print(f"Error: {response.status_code} - {response.text}")
                sleep(RETRY_DELAY)
                
            except requests.exceptions.RequestException as e:
                print(f"Network error: {e}")
                if attempt < MAX_RETRIES - 1:
                    sleep(RETRY_DELAY)
                continue
                
        raise Exception(f"Failed after {MAX_RETRIES} attempts")
    return wrapper

@handle_api_call
def get_file_structure(repo_owner, repo_name, branch):
    """Get the file structure using GraphQL API"""
    query = """
    {
      repository(owner: "%s", name: "%s") {
        object(expression: "%s") {
          ... on Commit {
            tree {
              entries {
                name
                type
                path
                object {
                  ... on Tree {
                    entries {
                      name
                      type
                      path
                      object {
                        ... on Tree {
                          entries {
                            name
                            type
                            path
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    """ % (repo_owner, repo_name, branch)
    url = "https://api.github.com/graphql"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Content-Type": "application/json"
    }
    
    return requests.post(url, json={'query': query}, headers=headers)

def process_api_response(response):
    """Process the API response and extract file structure"""
    data = response.json()
    if 'data' in data and 'repository' in data['data'] and 'object' in data['data']['repository']:
        tree = data['data']['repository']['object']['tree']
        if tree and 'entries' in tree and tree['entries'] is not None:
            entries = tree['entries']
            return process_entries(entries)
        else:
            raise Exception("Repository tree or entries not found in API response.")
    else:
        print("No entries found in the response.")
        print("API Response:", data)
        return []

def is_relevant_file(file):
    """Check if file has a relevant extension"""
    relevant_extensions = ['.md', '.py', '.js', '.json', '.yml', '.txt', '.html', '.css', '.java', '.cpp', '.c', '.h', '.go', '.dart', '.xml', '.rb', '.php', '.swift', '.ts', '.sh', '.yaml', '.dat']
    return any(file['name'].endswith(ext) for ext in relevant_extensions)

@handle_api_call
def get_file_content(repo_owner, repo_name, file_path, branch):
    """Get content of a specific file"""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{file_path}?ref={branch}"
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}"}
    return requests.get(url, headers=headers)

def process_file_content(response):
    """Process the file content response"""
    try:
        content = response.json()['content']
        return base64.b64decode(content).decode('utf-8')
    except Exception as e:
        print(f"Error processing file content: {e}")
        return None

def process_single_file(repo_owner, repo_name, file, branch):
    """Process a single file and return its data"""
    try:
        response = get_file_content(repo_owner, repo_name, file['path'], branch)
        content = process_file_content(response)
        if content:
            return {
                "name": file['name'],
                "path": file['path'],
                "type": file['type'],
                "content": content
            }
    except Exception as e:
        print(f"Error processing file {file['path']}: {str(e)}")
    return None

def get_ai_generated_readme(repository_data, repo_owner, repo_name):
    """Get AI-generated README from the repository data"""
    url = "http://localhost:1234/v1/chat/completions"
    headers = {"Content-Type": "application/json"}
    
    # Prepare the system message to instruct the AI
    system_message = f"""You are an expert developer who creates comprehensive README.md files. 
    Given the repository data for {repo_owner}/{repo_name}, create a detailed README.md that includes:
    1. Project title and description (give a separate section describing the project in detail)
    2. Technologies used (based on file extensions and contents)
    3. Project structure
    4. Setup instructions
    5. Usage examples
    Please format the response in Markdown. Do not give any extra information or explanations. Directly start the response with file content, DO NOT USE Phrases like 'okay heres the info..' etc. Stick to formatting the response in Markdown."""
    
    # Convert repository data to a readable format for the AI
    repo_summary = f"Repository: {repo_owner}/{repo_name}\n\nFiles:\n"
    for file in repository_data["repository"]["files"]:
        repo_summary += f"\n{file['path']}:\n{file['content'][:500]}...\n"
    
    payload = {
        "model": "gemma-3-1b-it",
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": repo_summary}
        ],
        "temperature": 0.7,
        "max_tokens": -1,
        "stream": False
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error getting AI response: {str(e)}")
        return None

def generate_readme_for_repo(repo_owner, repo_name, branch='main'):
    try:
        # Sanitize repo_name to remove trailing '.git' if present
        if repo_name.endswith('.git'):
            repo_name = repo_name[:-4]
        
        # Get all files in repository
        response = get_file_structure(repo_owner, repo_name, branch)
        all_files = process_api_response(response)
        
        if not all_files:
            raise Exception("No files found in the repository or error accessing the repository.")
        
        # Filter relevant files
        relevant_files = [file for file in all_files if is_relevant_file(file)]
        
        # Limit to 200 files
        relevant_files = relevant_files[:200]
        
        # Create a dictionary to store file data
        repository_data = {
            "repository": {
                "owner": repo_owner,
                "name": repo_name,
                "branch": branch,
                "files": []
            }
        }
        
        # Collect data for each relevant file in parallel
        max_workers = 10
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {executor.submit(process_single_file, repo_owner, repo_name, file, branch): file for file in relevant_files}
            for future in concurrent.futures.as_completed(future_to_file):
                file_data = future.result()
                if file_data:
                    repository_data["repository"]["files"].append(file_data)
        
        # Get AI-generated README
        readme_content = get_ai_generated_readme(repository_data, repo_owner, repo_name)
        
        if not readme_content:
            raise Exception("Failed to generate README content from AI.")
        
        return readme_content
        
    except Exception as e:
        raise e

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python auto_readme_parallel.py <repo_owner> <repo_name> [branch]")
    else:
        owner = sys.argv[1]
        repo = sys.argv[2]
        branch = sys.argv[3] if len(sys.argv) > 3 else 'main'
        readme = generate_readme_for_repo(owner, repo, branch)
        if readme:
            print(readme)
