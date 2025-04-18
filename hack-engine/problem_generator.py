import json
import requests
import time
from storage import is_duplicate_problem, add_problem_statements

def generate_problem_statements(theme, search_results, existing_problems):
    """Generate problem statements for the theme using AI."""
    print("\nGenerating problem statements...")
    
    try:
        # Generate statements one by one using AI
        statements = []
        max_statements = 3
        
        for i in range(max_statements):
            try:
                # Generate a single problem statement
                statement = generate_single_problem_statement(theme, search_results, existing_problems + statements)
                
                if statement and not is_duplicate_problem(statement, existing_problems + statements):
                    statements.append(statement)
                    
                    # Print the generated statement
                    print(f"\nGenerated problem statement {len(statements)} of {max_statements}:")
                    print("-" * 80)
                    print(statement)
                    print("-" * 80)
                    
                    # Add the statement to storage immediately
                    add_problem_statements(theme['name'], [statement])
                    
                    # Also add to generated_ideas.json
                    add_to_generated_ideas(statement, theme['name'])
                    
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
                print(f"\nFallback problem statement {i} of {len(statements)}:")
                print("-" * 80)
                print(statement)
                print("-" * 80)
                
                # Add to generated_ideas.json
                add_to_generated_ideas(statement, theme['name'])
            
            add_problem_statements(theme['name'], statements)
        
        return statements
        
    except Exception as e:
        print(f"Error in problem generation: {e}")
        fallback = get_fallback_statements(theme)
        add_problem_statements(theme['name'], fallback)
        return fallback
