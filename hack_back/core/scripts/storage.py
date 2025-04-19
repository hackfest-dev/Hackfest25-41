import json
import os
from datetime import datetime

def load_problem_statements():
    """Load existing problem statements from JSON file."""
    try:
        with open('problem_statements.json', 'r') as f:
            data = json.load(f)
            return data
    except FileNotFoundError:
        return {
            "statements": [],
            "metadata": {
                "last_updated": "",
                "total_count": 0
            }
        }
    except json.JSONDecodeError:
        print("Error reading problem_statements.json. Creating new file...")
        return {
            "statements": [],
            "metadata": {
                "last_updated": "",
                "total_count": 0
            }
        }

def save_problem_statements(data):
    """Save problem statements to JSON file."""
    with open('problem_statements.json', 'w') as f:
        json.dump(data, f, indent=4)

def get_existing_problem_texts():
    """Get list of existing problem statement texts."""
    data = load_problem_statements()
    return [statement["text"] for statement in data["statements"]]

def is_duplicate_problem(problem_text, existing_problems):
    """Check if a problem statement is too similar to existing ones."""
    problem_text = problem_text.lower()
    for existing in existing_problems:
        if isinstance(existing, str):
            existing = existing.lower()
        elif isinstance(existing, dict):
            existing = existing.get("text", "").lower()
        
        # Simple similarity check
        if problem_text == existing:
            return True
    return False

def add_problem_statements(topic, new_statements):
    """Add new problem statements to storage."""
    data = load_problem_statements()
    
    added_count = 0
    for statement in new_statements:
        # Create new problem statement entry
        new_entry = {
            "id": len(data["statements"]) + 1,
            "topic": topic,
            "text": statement,
            "created_at": datetime.now().isoformat(),
            "metadata": {
                "source": "LM Studio",
                "model": "deepseek-r1-distill-llama-8b"
            }
        }
        
        # Add to statements list
        data["statements"].append(new_entry)
        added_count += 1
    
    # Update metadata
    data["metadata"]["last_updated"] = datetime.now().isoformat()
    data["metadata"]["total_count"] = len(data["statements"])
    
    # Save updated data
    save_problem_statements(data)
    
    return added_count

def save_tracks(hackathon_name, tracks):
    """Save hackathon tracks to tracks.json file."""
    data = {
        "hackathon_name": hackathon_name,
        "tracks": tracks,
        "metadata": {
            "last_updated": datetime.now().isoformat(),
            "total_count": len(tracks)
        }
    }
    
    with open('tracks.json', 'w') as f:
        json.dump(data, f, indent=4)
    
    return len(tracks)

def save_generated_ideas(hackathon_name, ideas):
    """Save generated ideas to generated_ideas.json file."""
    data = {
        "hackathon_name": hackathon_name,
        "generated_ideas": ideas,
        "metadata": {
            "last_updated": datetime.now().isoformat(),
            "total_count": len(ideas)
        }
    }
    
    with open('generated_ideas.json', 'w') as f:
        json.dump(data, f, indent=4)
    
    return len(ideas)

def save_generated_ideas_detailed(hackathon_name, theme_name, ideas):
    """Save generated ideas in detailed format similar to problem_statements.json."""
    data = {
        "hackathon_name": hackathon_name,
        "generated_ideas": [],
        "metadata": {
            "last_updated": datetime.now().isoformat(),
            "total_count": len(ideas)
        }
    }
    
    for idx, idea_text in enumerate(ideas, start=1):
        idea_entry = {
            "id": idx,
            "topic": theme_name,
            "text": idea_text,
            "created_at": datetime.now().isoformat(),
            "metadata": {
                "source": "LM Studio",
                "model": "deepseek-r1-distill-llama-8b"
            }
        }
        data["generated_ideas"].append(idea_entry)
    
    with open('generated_ideas.json', 'w') as f:
        json.dump(data, f, indent=4)
    
    return len(ideas)
