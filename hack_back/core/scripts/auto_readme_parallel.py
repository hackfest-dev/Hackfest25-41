import requests
import json
import base64
import os
import time
from time import sleep
import concurrent.futures
from tqdm import tqdm  # For progress bar

# Get GitHub token from environment variable
GITHUB_TOKEN = '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'
if not GITHUB_TOKEN:
    raise ValueError("Please set the GITHUB_TOKEN environment variable")

# Define the repository details
repo_owner = 'Wizhill05'  
repo_name = 'meals'  
branch = 'main'  

# Maximum retries for API calls
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

# GraphQL query to get the file tree recursively
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
def get_file_structure():
    """Get the file structure using GraphQL API"""
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
        entries = data['data']['repository']['object']['tree']['entries']
        return process_entries(entries)
    else:
        print("No entries found in the response.")
        print("API Response:", data)
        return []

def is_relevant_file(file):
    """Check if file has a relevant extension"""
    relevant_extensions = ['.md', '.py', '.js', '.json', '.yml', '.txt', '.html', '.css', '.java', '.cpp', '.c', '.h', '.go', '.dart', '.xml', '.rb', '.php', '.swift', '.ts', '.sh', '.yaml', '.dat']
    return any(file['name'].endswith(ext) for ext in relevant_extensions)

@handle_api_call
def get_file_content(file_path):
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

def process_single_file(file):
    """Process a single file and return its data"""
    try:
        response = get_file_content(file['path'])
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

def get_ai_generated_readme(repository_data):
    """Get AI-generated README from the repository data"""
    url = "http://localhost:1234/v1/chat/completions"
    headers = {"Content-Type": "application/json"}
    
    # Prepare the system message to instruct the AI
    system_message = """You are an expert developer who creates comprehensive README.md files. 
    Given the repository data, create a detailed README.md that includes:
    1. Project title and description (give a separate section describing the project in detail)
    2. Technologies used (based on file extensions and contents)
    3. Project structure
    4. Setup instructions
    5. Usage examples
    Please format the response in Markdown. DO not give any extra informartion or explanations. Stick to formatting the response in Markdown."""
    
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

def main():
    try:
        # Get all files in repository
        print("Fetching repository structure...")
        response = get_file_structure()
        all_files = process_api_response(response)
        
        if not all_files:
            print("No files found in the repository. This could mean:")
            print("1. The repository is empty")
            print("2. All files are in subdirectories")
            print("3. There was an error accessing the repository")
            return
        
        # Filter relevant files
        print(f"Found {len(all_files)} files in total")
        relevant_files = [file for file in all_files if is_relevant_file(file)]
        print(f"Found {len(relevant_files)} relevant files")
        print("Will process first 200 files only")
        
        # Create a dictionary to store file data
        repository_data = {
            "repository": {
                "owner": repo_owner,
                "name": repo_name,
                "branch": branch,
                "files": []
            }
        }
        
        # Limit to 200 files
        relevant_files = relevant_files[:200]
        
        # Collect data for each relevant file in parallel
        print("Collecting repository data in parallel...")
        
        # Number of workers (adjust based on your system and API rate limits)
        max_workers = 10
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks and create a mapping of futures to files
            future_to_file = {executor.submit(process_single_file, file): file for file in relevant_files}
            
            # Process results as they complete with a progress bar
            with tqdm(total=len(relevant_files), desc="Fetching files") as progress_bar:
                for future in concurrent.futures.as_completed(future_to_file):
                    file = future_to_file[future]
                    try:
                        file_data = future.result()
                        if file_data:
                            repository_data["repository"]["files"].append(file_data)
                    except Exception as e:
                        print(f"Error processing {file['path']}: {str(e)}")
                    finally:
                        progress_bar.update(1)
        
        print(f"Successfully processed {len(repository_data['repository']['files'])} files")
        
        # Get AI-generated README
        print("\nGenerating README using AI...")
        readme_content = get_ai_generated_readme(repository_data)
        
        if readme_content:
            # Save the README
            with open('README.md', 'w', encoding='utf-8') as f:
                f.write(readme_content)
            print("README.md has been generated successfully!")
            
            # Also save the repository data for reference
            with open('repository_data.json', 'w', encoding='utf-8') as f:
                json.dump(repository_data, f, indent=2, ensure_ascii=False)
            print("Repository data saved to repository_data.json")
        else:
            print("Failed to generate README.md")
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
