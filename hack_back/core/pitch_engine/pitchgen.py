import os
import json
import requests
from .search_engine_pitch import perform_search

LM_STUDIO_API_URL = "http://localhost:1234/v1/chat/completions"

def call_lm_studio(system_prompt, user_prompt):
    request_data = {
        "model": "gemma-3-4b-it",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.5,
        "max_tokens": 256,
        "stream": False
    }
    try:
        response = requests.post(
            LM_STUDIO_API_URL,
            headers={"Content-Type": "application/json"},
            json=request_data,
            timeout=60
        )
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"Error calling LM Studio API: {e}")
        return None

def extract_json_from_response(response_text):
    import re
    try:
        cleaned = re.sub(r'^```json\s*', '', response_text)
        cleaned = re.sub(r'```$', '', cleaned)
        json_match = re.search(r'\{.*\}', cleaned, re.DOTALL)
        if not json_match:
            print("No JSON object found in LM Studio response.")
            return None
        json_str = json_match.group(0)
        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing JSON from LM Studio response: {e}")
        return None

def generate_pitch_from_readme(readme_content):
    idea_source = "readme"
    project_description = readme_content.strip()

    print("Generating search queries...")
    system_prompt_queries = (
        "You are a helpful assistant. Generate exactly 3 web search queries to research competitors and technical challenges. "
        "Return the result as a JSON object with a single key 'queries' which is a list of strings. "
        "Example: {\"queries\": [\"query1\", \"query2\", \"query3\"]}"
    )
    user_prompt_queries = f"Project: {project_description}"
    queries_response = call_lm_studio(system_prompt_queries, user_prompt_queries)
    if not queries_response:
        print("Failed to generate search queries.")
        return None
    queries_json = extract_json_from_response(queries_response)
    if not queries_json:
        print("Failed to parse search queries JSON.")
        return None
    search_queries = queries_json.get("queries", [])

    search_results = {}
    for query in search_queries:
        results = perform_search(query)
        urls = [res.get("link", "") for res in results[:3]]
        search_results[query] = urls
        print(f"Search results for query '{query}':")
        for url in urls:
            print(f" - {url}")

    print("Analyzing project...")
    system_prompt_analysis = (
        "You are a helpful assistant. Identify exactly 2 pros and 2 cons "
        "using these search results. Return the result as a JSON object with keys 'pros' and 'cons', "
        "each containing a list of strings."
    )
    user_prompt_analysis = f"Project: {project_description}\nResearch: {json.dumps(search_results)}"
    analysis_response = call_lm_studio(system_prompt_analysis, user_prompt_analysis)
    if not analysis_response:
        print("Failed to get analysis from LM Studio.")
        return None
    analysis_json = extract_json_from_response(analysis_response)
    if not analysis_json:
        print("Failed to parse analysis JSON.")
        return None
    pros = analysis_json.get("pros", [])
    cons = analysis_json.get("cons", [])

    print("Pros:")
    for pro in pros:
        print(f" - {pro}")
    print("Cons:")
    for con in cons:
        print(f" - {con}")

    system_prompt_pitch = (
        "You are a startup pitch expert. Create a detailed and compelling startup pitch that includes market research insights, "
        "competitor analysis, and highlights the problem, solution, differentiators, and market potential. "
        "Use the provided project description, search results, and analysis data to inform the pitch. "
        "The pitch should be clear, persuasive, and suitable for potential investors."
    )
    user_prompt_pitch = (
        f"Project Description: {project_description}\n"
        f"Search Results: {json.dumps(search_results)}\n"
        f"Analysis: {json.dumps(analysis_json)}"
    )
    pitch_response = call_lm_studio(system_prompt_pitch, user_prompt_pitch)
    if not pitch_response:
        print("Failed to generate pitch.")
        return None
    print("\nGenerated Pitch:\n")
    print(pitch_response)

    print("Generating possible judge questions...")
    system_prompt_questions = (
        "You are a helpful assistant. Generate exactly 5 possible questions judges might ask about this project idea. "
        "Return the questions as a JSON object with a single key 'questions' which is a list of strings."
    )
    user_prompt_questions = f"Project: {project_description}\nAnalysis: {json.dumps(analysis_json)}"
    questions_response = call_lm_studio(system_prompt_questions, user_prompt_questions)
    judge_questions = []
    if questions_response:
        questions_json = extract_json_from_response(questions_response)
        if questions_json:
            judge_questions = questions_json.get("questions", [])
        else:
            print("Failed to parse judge questions JSON.")
    else:
        print("Failed to generate judge questions.")

    print("\nPossible Judge Questions:")
    for question in judge_questions:
        print(f" - {question}")

    pitch_data = {
        "idea_source": idea_source,
        "content": project_description,
        "search_queries": search_queries,
        "search_results": search_results,
        "pros": pros,
        "cons": cons,
        "pitch": pitch_response,
        "judge_questions": judge_questions
    }

    # Optionally save to file if needed
    # with open("pitch_data.json", "w", encoding="utf-8") as f:
    #     json.dump(pitch_data, f, indent=2)

    print("\nFinal pitch data generated.")
    return pitch_data
