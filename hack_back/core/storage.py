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

def save_problem_statements(data, file_path='problem_statements.json'):
    """Save problem statements to JSON file."""
    with open(file_path, 'w') as f:
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

def add_problem_statements(topic, new_statements, file_path='problem_statements.json'):
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
    save_problem_statements(data, file_path)
    
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

def append_generated_ideas(hackathon_name, theme_name, new_ideas, session_id, file_path='generated_ideas.json'):
    """
    Append new generated ideas to existing generated_ideas.json for the same session.
    If session_id differs or file missing, reset and start fresh.
    Assign unique incremental ids continuing from existing ideas.
    """
    try:
        # Load existing data
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                data = json.load(f)
        else:
            data = None
    except (FileNotFoundError, json.JSONDecodeError):
        data = None

    # Initialize if no data or session_id changed
    if not data or data.get("metadata", {}).get("session_id") != session_id:
        data = {
            "hackathon_name": hackathon_name,
            "generated_ideas": [],
            "metadata": {
                "last_updated": datetime.now().isoformat(),
                "total_count": 0,
                "session_id": session_id
            }
        }

    existing_ideas = data.get("generated_ideas", [])
    last_id = existing_ideas[-1]["id"] if existing_ideas else 0

    # Append new ideas with unique ids
    for idx, idea_text in enumerate(new_ideas, start=last_id + 1):
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
        existing_ideas.append(idea_entry)

    # Update metadata
    data["generated_ideas"] = existing_ideas
    data["metadata"]["last_updated"] = datetime.now().isoformat()
    data["metadata"]["total_count"] = len(existing_ideas)
    data["metadata"]["session_id"] = session_id

    # Save back to file
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

    return len(new_ideas)
