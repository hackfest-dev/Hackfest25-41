import json
import requests
import time
from .storage import is_duplicate_problem, add_problem_statements

def generate_problem_statements(theme, search_results, existing_problems, max_ideas=3):
    """Generate problem statements for the theme using AI."""
    print("\\nGenerating problem statements...")
    
    try:
        # Generate statements one by one using AI
        statements = []
        max_statements = max_ideas
        
        for i in range(max_statements):
            try:
                # Generate a single problem statement
                statement = generate_single_problem_statement(theme, search_results, existing_problems + statements)
                
                if statement and not is_duplicate_problem(statement, existing_problems + statements):
                    statements.append(statement)
                    
                    # Print the generated statement
                    print(f"\\nGenerated problem statement {len(statements)} of {max_statements}:")
                    print("-" * 80)
                    print(statement)
                    print("-" * 80)
                    
                    # Add the statement to storage immediately
                    add_problem_statements(theme['name'], [statement])
                    
                    # Small delay between generations to avoid overwhelming the API
                    time.sleep(1)
                else:
                    print("Generated statement was a duplicate or invalid. Retrying...")
            except Exception as e:
                print(f"Error generating statement: {e}")
                continue
        
        if not statements:
            print("No statements generated using AI. Using fallback statements...")
            statements = get_fallback_statements(theme)
            
            # Print and store fallback statements
            for i, statement in enumerate(statements, 1):
                print(f"\\nFallback problem statement {i} of {len(statements)}:")
                print("-" * 80)
                print(statement)
                print("-" * 80)
            
            add_problem_statements(theme['name'], statements)
        
        return statements
        
    except Exception as e:
        print(f"Error in problem generation: {e}")
        fallback = get_fallback_statements(theme)
        add_problem_statements(theme['name'], fallback)
        return fallback

def add_to_generated_ideas(statement, theme_name):
    """Add a generated idea to the generated_ideas.json file."""
    try:
        # Initialize generated_ideas.json if empty or missing keys
        try:
            with open('generated_ideas.json', 'r') as f:
                ideas_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            ideas_data = {
                "count": 0,
                "max_capacity": 100,
                "ideas": []
            }
        
        # Check if we need to reset the count
        if ideas_data['count'] >= ideas_data['max_capacity']:
            ideas_data['ideas'] = []
            ideas_data['count'] = 0
            print("\\nReset generated ideas count to 0 (reached max capacity).")
        
        # Add the new idea
        ideas_data['ideas'].append({
            "id": ideas_data['count'] + 1,
            "theme": theme_name,
            "text": statement,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })
        
        # Increment the count
        ideas_data['count'] += 1
        
        # Write back to the file
        with open('generated_ideas.json', 'w') as f:
            json.dump(ideas_data, f, indent=2)
        
        print(f"Idea added to generated_ideas.json (Idea #{ideas_data['count']} of {ideas_data['max_capacity']})")
    except Exception as e:
        print(f"Error adding to generated_ideas.json: {str(e)}")

def generate_single_problem_statement(theme, search_results, existing_problems):
    """Generate a single problem statement using LM Studio API."""
    url = "http://localhost:1234/v1/chat/completions"
    
    # Create context from search results
    context = ""
    if search_results:
        context = "Based on the following search results:\\n\\n"
        for i, result in enumerate(search_results[:5], 1):
            context += f"{i}. {result['title']}: {result['snippet']}\\n"
    
    # Create existing problems context to avoid duplicates
    existing_context = ""
    if existing_problems:
        existing_context = "Avoid generating problem statements similar to these existing ones:\\n\\n"
        for i, problem in enumerate(existing_problems[-5:], 1):
            if isinstance(problem, str):
                existing_context += f"{i}. {problem}\\n"
            elif isinstance(problem, dict) and 'text' in problem:
                existing_context += f"{i}. {problem['text']}\\n"
    
    # Prepare the system prompt
    system_prompt = f"""You are an AI specialized in creating unique and innovative problem statements for hackathons.

For the theme "{theme['name']}" ({theme['code']}), generate ONE unique problem statement that is:
1. Specific and actionable
2. Technically challenging but feasible within a 48-hour hackathon
3. Relevant to the theme description: "{theme['description']}"
4. Focused on keywords: {', '.join(theme['keywords'])}
5. Different from any existing problem statements

Your problem statement should:
- Start with "Develop a solution for..." or similar action-oriented phrase
- Include specific technical requirements and constraints
- Be implementable within 48 hours
- Provide clear deliverables
- Be 2-4 sentences long

DO NOT include any explanations, notes, or multiple options. Return ONLY the problem statement text.
"""
    
    # Prepare the user prompt
    user_prompt = f"""Generate ONE unique problem statement for the theme "{theme['name']}" ({theme['code']}).

Theme description: {theme['description']}
Keywords: {', '.join(theme['keywords'])}

{context}

{existing_context}

Remember to make it specific, technically feasible for a 48-hour hackathon, and different from existing problems.
"""
    
    # Prepare the request
    request_data = {
        "model": "gemma-3-4b-it",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "max_tokens": -1,
        "stream": False
    }
    
    try:
        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json=request_data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            statement = result["choices"][0]["message"]["content"].strip()
            
            # Clean up the statement if needed
            statement = statement.replace('"', '')
            if statement.startswith("Problem Statement:"):
                statement = statement[len("Problem Statement:"):].strip()
                
            return statement
        else:
            print(f"Error from LM Studio API: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Error calling LM Studio API: {str(e)}")
        return None

def get_fallback_statements(theme):
    """Get fallback statements for a theme."""
    keywords = [k for k in theme['keywords'] if k not in ['through', 'and', 'with', 'for', 'the']][:2]
    
    return [
        f"Develop a solution for {theme['name'].lower()} process automation. Create a system that automates key processes and improves efficiency. The solution must be implementable within 48 hours and focus on {' and '.join(keywords)}. The system should provide clear technical deliverables, including documentation, testing procedures, and a working prototype.",
        f"Develop a solution for {theme['name'].lower()} data management. Build a platform that securely handles data processing and analysis. The solution must be implementable within 48 hours and focus on {' and '.join(keywords)}. The system should provide clear technical deliverables, including documentation, testing procedures, and a working prototype.",
        f"Develop a solution for {theme['name'].lower()} resource optimization. Design a system that optimizes resource allocation and improves performance. The solution must be implementable within 48 hours and focus on {' and '.join(keywords)}. The system should provide clear technical deliverables, including documentation, testing procedures, and a working prototype."
    ]
