import os
import sys
import textwrap
import time
import re
from theme_extractor import extract_themes_from_text
from problem_generator import generate_problem_statements
from search_engine import generate_search_queries, get_search_results
from storage import get_existing_problem_texts, save_tracks

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header():
    """Print the application header."""
    clear_screen()
    print("=" * 80)
    print("                         HACKATHON COMPANION                         ")
    print("=" * 80)
    print()

def read_brochure(file_path):
    """Read the content of the brochure file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_hackathon_name(brochure_text):
    """Extract the hackathon name from the brochure text."""
    # Try to find the hackathon name using regex patterns
    patterns = [
        r'(?:NATIONAL LEVEL HACKATHON|HACKATHON)\s*\n+\s*\d+\s*\n+\s*([^\n]+)',  # Pattern for "NATIONAL LEVEL HACKATHON" followed by numbers and then the name
        r'([A-Za-z]+\s*[A-Za-z]*\s*\d{4})\s*(?:HACKATHON|National Level Hackathon)',  # Pattern for name followed by year and "HACKATHON"
        r'([A-Za-z]+\s*[A-Za-z]*\s*\d{4})'  # Fallback pattern for just a name with a year
    ]
    
    for pattern in patterns:
        match = re.search(pattern, brochure_text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    # If no match found, return a default name
    return "Hackathon"

def display_themes(themes, hackathon_name="Hackathon"):
    """Display extracted themes in a user-friendly format."""
    print(f"\n{hackathon_name} Tracks:")
    print("=" * 80)
    for i, theme in enumerate(themes, 1):
        print(f"\n{i}. {theme['name']} ({theme['code']})")
        # Wrap description text at 60 characters
        desc_lines = textwrap.wrap(theme['description'], width=60)
        print("   Description:", desc_lines[0])
        for line in desc_lines[1:]:
            print("               ", line)
        print(f"   Keywords: {', '.join(theme['keywords'])}")
    print("\n" + "=" * 80)

def get_user_selection(themes):
    """Get user's theme selection."""
    while True:
        try:
            choice = input("\nSelect a track by entering its number (1-5): ")
            idx = int(choice) - 1
            if 0 <= idx < len(themes):
                return themes[idx]
            else:
                print(f"Please enter a number between 1 and {len(themes)}")
        except ValueError:
            print("Please enter a valid number")

def format_problem_statement(text):
    """Format a problem statement with proper line breaks and punctuation."""
    # Split into sentences and clean up
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    formatted_sentences = []
    
    for i, sentence in enumerate(sentences):
        # Add proper spacing after periods
        if i > 0:
            sentence = ' ' + sentence
        
        # Wrap the sentence
        wrapped = textwrap.fill(
            sentence,
            width=70,
            initial_indent='    ',
            subsequent_indent='    '
        )
        formatted_sentences.append(wrapped)
    
    # Join sentences with periods and proper spacing
    return '.\n\n'.join(formatted_sentences) + '.'

def display_search_results(search_results):
    """Display search results in a user-friendly format."""
    print("\nSearch Results:")
    print("=" * 80)
    
    for i, result in enumerate(search_results, 1):
        print(f"\n{i}. {result['title']}")
        # Wrap snippet text
        snippet_lines = textwrap.wrap(result['snippet'], width=70)
        for line in snippet_lines:
            print(f"   {line}")
        print(f"   Source: {result['link']}")
    
    print("\n" + "=" * 80)

def display_problem_statement(statement, number):
    """Display a single problem statement."""
    print(f"\nProblem Statement {number}:")
    print("-" * 80)
    print(format_problem_statement(statement))
    print("-" * 80)
    print("\nGenerating next problem statement...")

import concurrent.futures

import concurrent.futures

def process_themes(themes, hackathon_name):
    """Process an array of themes with parallel search and combined problem generation."""
    def search_theme(theme):
        try:
            print(f"Searching for relevant information for theme: {theme['name']}...")
            search_results = get_search_results(theme)
            return (theme, search_results)
        except Exception as e:
            print(f"Error searching theme {theme['name']}: {str(e)}")
            return (theme, [])

    # Save tracks to tracks.json once
    save_tracks(hackathon_name, themes)
    print(f"Saved {len(themes)} tracks to tracks.json")

    # Parallelize search queries
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_theme = {executor.submit(search_theme, theme): theme for theme in themes}
        theme_search_results = {}
        for future in concurrent.futures.as_completed(future_to_theme):
            theme, results = future.result()
            theme_search_results[theme['name']] = (theme, results)

    # Combine all search results
    combined_search_results = []
    combined_themes = []
    for theme_name in theme_search_results:
        theme, results = theme_search_results[theme_name]
        combined_themes.append(theme)
        combined_search_results.extend(results)

    # Load existing problem statements once
    existing_problems = get_existing_problem_texts()

    # Generate combined problem statements for all themes
    from storage import save_generated_ideas_detailed, add_problem_statements
    try:
        print(f"\nGenerating combined problem statements for all themes...")
        # Create a combined theme object
        combined_theme = {
            "name": "Combined Themes",
            "code": "COMBINED",
            "description": "Combined themes: " + ", ".join([theme['name'] for theme in combined_themes]),
            "keywords": list({kw for theme in combined_themes for kw in theme.get('keywords', [])})
        }
        generated_ideas = generate_problem_statements(
            combined_theme,
            combined_search_results,
            existing_problems,
            max_ideas=10
        )
        print(f"DEBUG: Number of generated ideas before saving: {len(generated_ideas)}")
        print(f"DEBUG: Sample generated idea: {generated_ideas[0] if generated_ideas else 'No ideas generated'}")
        save_generated_ideas_detailed(hackathon_name, combined_theme['name'], generated_ideas)
        print(f"Saved {len(generated_ideas)} generated ideas to generated_ideas.json")
        add_problem_statements(combined_theme['name'], generated_ideas)
    except Exception as e:
        print(f"Error generating combined problem statements: {str(e)}")

    print("\nAll themes have been processed.")

def convert_theme_names_to_objects(theme_names):
    """Convert a list of theme name strings to theme objects with default values."""
    default_descriptions = {
        "healthcare": "Transforming healthcare through technology",
        "education": "Innovating education with technology",
        "environment": "Promoting sustainable environmental solutions",
        "finance": "Pioneering the future of finance",
    }
    default_codes = {
        "healthcare": "APOLLO",
        "education": "ATHENA",
        "environment": "DEMETER",
        "finance": "PLUTUS",
    }
    default_keywords = {
        "healthcare": ["healthcare", "medical", "patient", "innovation", "technology"],
        "education": ["education", "learning", "technology", "innovation", "students"],
        "environment": ["environment", "sustainability", "green", "climate", "energy"],
        "finance": ["finance", "fintech", "security", "technology", "trust"],
    }
    theme_objects = []
    for name in theme_names:
        lname = name.lower()
        theme_objects.append({
            "name": name.title(),
            "code": default_codes.get(lname, "GENERIC"),
            "description": default_descriptions.get(lname, "Innovative solutions in " + name),
            "keywords": default_keywords.get(lname, [name.lower()]),
        })
    return theme_objects

def main():
    """Main function to run the hackathon companion."""
    try:
        print_header()
        print("Welcome to the Hackinator!")
        print("This tool will help you generate problem statements for your hackathon.")
        print()
        
        # Step 0: Wipe generated_ideas.json at start of run
        with open('generated_ideas.json', 'w') as f:
            f.write('{}')
        
        # Step 1: Read the test_hackathon.txt file
        brochure_path = "test_hackathon.txt"
        if not os.path.exists(brochure_path):
            print(f"Error: File '{brochure_path}' not found.")
            return
        
        print("\nReading hackathon brochure...")
        brochure_text = read_brochure(brochure_path)
        
        # Extract hackathon name from brochure
        hackathon_name = extract_hackathon_name(brochure_text)
        
        # Instead of extracting themes, user should pass an array of theme names (strings)
        # For demonstration, we define a sample array of theme names (can be replaced)
        sample_theme_names = [
            'healthcare',
            'education',
            'environment',
            'finance',
        ]
        
        # Convert theme names to theme objects
        sample_themes = convert_theme_names_to_objects(sample_theme_names)
        
        # Call the new function to process these themes
        process_themes(sample_themes, hackathon_name)
        
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        print("Please try again. If the problem persists, check your configuration.")


if __name__ == "__main__":
    main()
