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
        
        # Step 2: Extract themes using AI
        print("Extracting hackathon tracks using AI...")
        themes = extract_themes_from_text(brochure_text)
        
        # Save tracks to tracks.json
        save_tracks(hackathon_name, themes)
        print(f"Saved {len(themes)} tracks to tracks.json")
        
        # Step 3: Display themes and get user selection
        display_themes(themes, hackathon_name)
        selected_theme = get_user_selection(themes)
        
        # Step 4: Generate search queries using AI
        print(f"\nGenerating search queries for {selected_theme['name']}...")
        
        # Step 5: Perform web search
        print("\nSearching for relevant information...")
        search_results = get_search_results(selected_theme)
        
        # Display search results
        display_search_results(search_results)
        print("\nUsing search results as context for problem statement generation...")
        time.sleep(2)
        
        # Step 6: Generate problem statements one by one
        print(f"\nGenerating problem statements for {selected_theme['name']}...")
        existing_problems = get_existing_problem_texts()
        
        # Generate problem statements (they are saved to storage automatically)
      
        
        # New step: Generate 10 problem statements for generated_ideas.json
        print(f"\nGenerating 10 problem statements for generated_ideas.json for {hackathon_name}...")
        generated_ideas = generate_problem_statements(
            selected_theme,
            search_results,
            [],
            max_ideas=10
        )
        
        # Save generated ideas to generated_ideas.json in detailed format
        from storage import save_generated_ideas_detailed, add_problem_statements
        print(f"DEBUG: Number of generated ideas before saving: {len(generated_ideas)}")
        print(f"DEBUG: Sample generated idea: {generated_ideas[0] if generated_ideas else 'No ideas generated'}")
        save_generated_ideas_detailed(hackathon_name, selected_theme['name'], generated_ideas)
        print(f"Saved {len(generated_ideas)} generated ideas to generated_ideas.json")
        
        # Also add generated ideas to problem_statements.json with theme name as topic
        add_problem_statements(selected_theme['name'], generated_ideas)
        
        # Step 7: Display final message
        print("\n" + "=" * 80)
        print("All statements have been saved to problem_statements.json")
        print("\nThank you for using the Hackathon Companion!")
        print("=" * 80)
        
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        print("Please try again. If the problem persists, check your configuration.")

if __name__ == "__main__":
    main()
