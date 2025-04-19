import time
import json
import requests
import random

def generate_search_queries(theme):
    """Generate search queries based on theme information using AI."""
    print(f"Generating search queries for {theme['name']}...")
    
    # Generate queries using AI only
    ai_queries = generate_queries_with_ai(theme)
    return ai_queries

def generate_queries_with_ai(theme):
    """Generate search queries using LM Studio API."""
    url = "http://localhost:1234/v1/chat/completions"
    
    # Prepare the system prompt
    system_prompt = """You are an AI specialized in generating effective search queries for research.
    For the given hackathon theme, generate 5 search queries that will help find relevant technical challenges, 
    innovations, and problem areas. Each query should be specific, use relevant technical terms, and be optimized 
    for search engines. Return ONLY the list of 5 search queries, one per line, without numbering or additional text.
    """
    
    # Prepare the user prompt
    user_prompt = f"""Generate 5 search queries for the hackathon theme: "{theme['name']}" ({theme['code']})
    
    Theme description: {theme['description']}
    Keywords: {', '.join(theme['keywords'])}
    
    The queries should help find technical challenges, innovations, and problem areas related to this theme.
    Each query should be specific and use relevant technical terms.
    """
    
    # Prepare the request
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
    
    response = requests.post(
        url,
        headers={"Content-Type": "application/json"},
        json=request_data,
        timeout=60
    )
    
    if response.status_code == 200:
        result = response.json()
        ai_response = result["choices"][0]["message"]["content"].strip()
        
        # Split the response into lines and clean
        queries = [line.strip() for line in ai_response.split('\n') if line.strip()]
        
        # Take up to 5 valid queries
        valid_queries = [q for q in queries if len(q) > 10 and len(q.split()) >= 2][:5]
        
        if len(valid_queries) >= 3:
            print(f"Successfully generated {len(valid_queries)} search queries using AI.")
            return valid_queries
    
    print("AI query generation failed or produced insufficient results.")
    return None

def get_search_results(theme):
    """Get search results for a theme."""
    print(f"\nGathering information about {theme['name']}...")
    
    # Generate search queries
    queries = generate_search_queries(theme)
    print(f"DEBUG: Generated search queries: {queries}")
    
    all_results = []
    for query in queries:
        print(f"Searching for: {query}")
        
        # Get results for this query
        results = perform_search(query)
        all_results.extend(results)
        
        # Limit to top 3 results per query
        if len(all_results) >= 3 * len(queries):
            break
    
    # Remove duplicates and limit results
    unique_results = []
    seen_titles = set()
    for result in all_results:
        if result['title'] not in seen_titles:
            seen_titles.add(result['title'])
            unique_results.append(result)
    
    print(f"Found {len(unique_results)} relevant search results.")
    return unique_results[:3 * len(queries)]  # Limit to 3 results per query

from duckduckgo_search import DDGS

def perform_search(query):
    """Perform real web search using DuckDuckGo Search."""
    ddgs = DDGS()
    clean_query = query.strip('"').strip("'")
    results = list(ddgs.text(clean_query, max_results=15))
    print(f"DuckDuckGo returned {len(results)} results for query: {clean_query}")
    
    formatted_results = []
    for item in results:
        formatted_results.append({
            "title": item.get("title", ""),
            "snippet": item.get("body", ""),
            "link": item.get("href", "")
        })
    return formatted_results[:3]  # Return top 3 results
