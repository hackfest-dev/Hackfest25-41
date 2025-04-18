import requests
import json
import re

def extract_themes_from_text(text):
    """Extract themes from brochure text using AI."""
    # First try to use AI to extract themes
    themes = extract_themes_with_ai(text)
    if themes:
        return themes
    
    # If AI extraction fails, try to find explicitly mentioned tracks
    themes = extract_explicit_themes(text)
    if themes:
        return themes
    
    # If no explicit themes found, use fallback
    return extract_themes_fallback(text)

def extract_themes_with_ai(text):
    """Use LM Studio API to extract themes from text."""
    print("Using AI to extract themes from the brochure...")
    
    url = "http://localhost:1234/v1/chat/completions"
    
    # Prepare the prompt for theme extraction
    system_prompt = """You are an AI assistant specialized in analyzing hackathon brochures and extracting themes or tracks.
    Extract the main hackathon tracks or themes from the provided text.
    For each theme, provide:
    1. The name of the theme/track
    2. A code name (if available, otherwise create a suitable one)
    3. A brief description
    4. 5 relevant keywords

    Format your response as a JSON array with objects containing "name", "code", "description", and "keywords" (array of strings).
    Example:
    [
        {
            "name": "Healthcare",
            "code": "APOLLO",
            "description": "Transforming healthcare through technology",
            "keywords": ["healthcare", "medical", "patient", "innovation", "technology"]
        }
    ]
    """
    
    # Prepare the request
    request_data = {
        "model": "gemma-3-4b-it",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Extract the hackathon themes/tracks from this brochure text:\n\n{text}"}
        ],
        "temperature": 0.3,
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
            ai_response = result["choices"][0]["message"]["content"]
            
            # Extract JSON from the response
            try:
                # Find JSON array in the response
                json_match = re.search(r'\[\s*\{.*\}\s*\]', ai_response, re.DOTALL)
                if json_match:
                    json_str = json_match.group(0)
                    themes = json.loads(json_str)
                    
                    # Validate the structure
                    valid_themes = []
                    for theme in themes:
                        if all(key in theme for key in ["name", "code", "description", "keywords"]):
                            # Ensure keywords is a list
                            if isinstance(theme["keywords"], list):
                                valid_themes.append(theme)
                    
                    if valid_themes:
                        print(f"Successfully extracted {len(valid_themes)} themes using AI.")
                        return valid_themes
            except json.JSONDecodeError:
                print("Failed to parse AI response as JSON.")
            except Exception as e:
                print(f"Error processing AI response: {str(e)}")
        
        print("AI theme extraction failed. Falling back to rule-based extraction.")
        return None
            
    except Exception as e:
        print(f"Error connecting to LM Studio API: {str(e)}")
        print("Falling back to rule-based extraction.")
        return None

def extract_explicit_themes(text):
    """Extract explicitly mentioned themes/tracks from text."""
    themes = []
    
    # Known track patterns from the brochure
    track_patterns = [
        (r'Healthcare.*?APOLLO.*?([^.]*(?:healthcare|medical|patient)[^.]*\.)',
         "Healthcare", "APOLLO"),
        (r'Open Innovation.*?ATHENA.*?([^.]*(?:innovation|ideas|solutions)[^.]*\.)',
         "Open Innovation", "ATHENA"),
        (r'FinTech.*?PLUTUS.*?([^.]*(?:finance|security|technology)[^.]*\.)',
         "FinTech", "PLUTUS"),
        (r'Logistics.*?HERMES.*?([^.]*(?:logistics|supply chain|movement)[^.]*\.)',
         "Logistics", "HERMES"),
        (r'Sustainable.*?DEMETER.*?([^.]*(?:sustainable|environmental|green)[^.]*\.)',
         "Sustainable Development", "DEMETER")
    ]
    
    for pattern, name, code in track_patterns:
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            description = match.group(1).strip() if match.group(1) else f"Projects and innovations in {name}"
            themes.append({
                "name": name,
                "code": code,
                "description": description,
                "keywords": extract_keywords(f"{name} {description}")
            })
    
    return themes

def extract_keywords(text):
    """Extract relevant keywords from text."""
    # Common words to exclude
    stop_words = {'and', 'the', 'to', 'of', 'in', 'for', 'with', 'by', 'on', 'at', 'from'}
    
    # Split text into words and clean
    words = re.findall(r'\w+', text.lower())
    
    # Filter words
    keywords = [
        word for word in words 
        if word not in stop_words 
        and len(word) > 2 
        and not word.isdigit()
    ]
    
    # Remove duplicates while preserving order
    seen = set()
    keywords = [x for x in keywords if not (x in seen or seen.add(x))]
    
    return keywords[:5]  # Return top 5 keywords

def extract_themes_fallback(text):
    """Fallback method for theme extraction."""
    return [
        {
            "name": "Healthcare",
            "code": "APOLL",
            "description": "Transforming healthcare through groundbreaking technologies that enhance patient care, streamline operations, and redefine medical innovation.",
            "keywords": ["healthcare", "medical", "patient", "innovation", "technology"]
        },
        {
            "name": "Open Innovation",
            "code": "ATHENA",
            "description": "Empowering bold ideas and creative solutions across diverse domains, breaking barriers to solve real-world challenges.",
            "keywords": ["innovation", "solutions", "creative", "challenges", "ideas"]
        },
        {
            "name": "FinTech",
            "code": "PLUTUS",
            "description": "Pioneering the future of finance by enhancing security, ensuring transparency, and fostering trust through cutting-edge technologies.",
            "keywords": ["fintech", "finance", "security", "technology", "trust"]
        },
        {
            "name": "Logistics",
            "code": "HERMES",
            "description": "Reimagining the movement of goods and services with smart, efficient, and tech-driven solutions to optimize supply chains.",
            "keywords": ["logistics", "supply", "chain", "optimization", "efficiency"]
        },
        {
            "name": "Sustainable Development",
            "code": "DEMETER",
            "description": "Driving sustainable change with innovative technologies that combat environmental challenges and promote renewable energy.",
            "keywords": ["sustainable", "environmental", "energy", "green", "innovation"]
        }
    ]
