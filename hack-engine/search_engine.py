import time
import json
import requests
import random

def generate_search_queries(theme):
    """Generate search queries based on theme information using AI."""
    print(f"Generating search queries for {theme['name']}...")
    
    # Try to generate queries using AI
    ai_queries = generate_queries_with_ai(theme)
    if ai_queries:
        return ai_queries
    
    # Fallback to predefined queries if AI fails
    track_queries = {
        "Healthcare": [
            "patient data privacy security healthcare",
            "real-time patient monitoring alerts medical",
            "hospital resource optimization AI",
            "medical diagnosis automation challenges",
            "healthcare workflow integration problems"
        ],
        "Open Innovation": [
            "cross domain collaboration challenges",
            "innovation platform technical requirements",
            "knowledge sharing system architecture",
            "idea validation automation problems",
            "collaborative problem solving barriers"
        ],
        "FinTech": [
            "financial transaction security challenges",
            "fraud detection banking real-time",
            "regulatory compliance fintech problems",
            "blockchain integration banking issues",
            "payment processing optimization"
        ],
        "Logistics": [
            "supply chain optimization challenges",
            "last mile delivery automation",
            "warehouse management system problems",
            "route optimization algorithms",
            "inventory tracking real-time"
        ],
        "Sustainable Development": [
            "renewable energy management challenges",
            "environmental monitoring sensors",
            "waste reduction automation",
            "sustainable resource tracking",
            "green technology integration"
        ]
    }
    
    return track_queries.get(theme['name'], [
        f"technical challenges {theme['name']}",
        f"automation problems {theme['name']}",
        f"system integration {theme['name']}",
        f"optimization issues {theme['name']}",
        f"real-time monitoring {theme['name']}"
    ])

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
        "max_tokens": -1,
        "stream": False
    }
    
    try:
        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json=request_data,
            timeout=20
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
        
        print("AI query generation failed or produced insufficient results. Using fallback queries.")
        return None
            
    except Exception as e:
        print(f"Error generating queries with AI: {str(e)}")
        print("Using fallback queries.")
        return None

def get_search_results(theme):
    """Get search results for a theme."""
    print(f"\nGathering information about {theme['name']}...")
    
    # Generate search queries
    queries = generate_search_queries(theme)
    print(f"DEBUG: Generated search queries: {queries}")
    
    # Simulate web search for each query
    all_results = []
    for query in queries:
        print(f"Searching for: {query}")
        
        # Simulate search delay
        time.sleep(0.5)
        
        # Get results for this query
        results = simulate_web_search(query, theme)
        all_results.extend(results)
        
        # Avoid overwhelming the system
        if len(all_results) >= 10:
            break
    
    # Remove duplicates and limit results
    unique_results = []
    seen_titles = set()
    for result in all_results:
        if result['title'] not in seen_titles:
            seen_titles.add(result['title'])
            unique_results.append(result)
    
    print(f"Found {len(unique_results)} relevant search results.")
    return unique_results[:10]  # Limit to 10 results

import requests
import os

BING_SEARCH_API_KEY = os.getenv("BING_SEARCH_API_KEY")  # User must set this environment variable
BING_SEARCH_ENDPOINT = "https://api.bing.microsoft.com/v7.0/search"

def simulate_web_search(query, theme):
    """Perform real web search using Bing Search API."""
    if not BING_SEARCH_API_KEY:
        print("BING_SEARCH_API_KEY not set. Falling back to simulated search results.")
        return simulate_web_search_fallback(query, theme)
    
    headers = {"Ocp-Apim-Subscription-Key": BING_SEARCH_API_KEY}
    params = {"q": query, "count": 5, "textDecorations": True, "textFormat": "HTML"}
    
    try:
        response = requests.get(BING_SEARCH_ENDPOINT, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        results = []
        web_pages = data.get("webPages", {}).get("value", [])
        for item in web_pages:
            results.append({
                "title": item.get("name", ""),
                "snippet": item.get("snippet", ""),
                "link": item.get("url", "")
            })
        
        if not results:
            print("No results from Bing Search API, falling back to simulated results.")
            return simulate_web_search_fallback(query, theme)
        
        return results[:3]  # Return top 3 results
    
    except Exception as e:
        print(f"Error during Bing Search API call: {e}")
        print("Falling back to simulated search results.")
        return simulate_web_search_fallback(query, theme)

def simulate_web_search_fallback(query, theme):
    """Fallback simulated web search results."""
    # Get default context as a base
    base_results = get_default_context(theme)
    
    # Modify results to make them more relevant to the query
    import random
    results = []
    for result in base_results:
        query_terms = query.lower().split()
        title = result['title']
        snippet = result['snippet']
        
        for term in query_terms:
            if term not in snippet.lower() and random.random() < 0.7:
                snippet = snippet + f" This approach addresses {term} challenges effectively."
        
        if random.random() < 0.5:
            title = f"{title} - Related to {query_terms[0]}"
        
        results.append({
            "title": title,
            "snippet": snippet,
            "link": result['link']
        })
    
    import random
    random.shuffle(results)
    return results[:3]  # Return 3 results per query

def get_default_context(theme):
    """Get default context based on the theme."""
    defaults = {
        "Healthcare": [
            {
                "title": "Secure Patient Data Management",
                "snippet": "Healthcare providers need a system to securely store and share patient data while maintaining HIPAA compliance. The solution must handle real-time updates, access control, and audit logging.",
                "link": "example.com/healthcare/data"
            },
            {
                "title": "Real-time Patient Monitoring",
                "snippet": "Hospitals require a system to monitor patient vital signs in real-time and alert staff of critical changes. The solution should integrate with existing medical devices and provide mobile notifications.",
                "link": "example.com/healthcare/monitoring"
            },
            {
                "title": "Medical Resource Optimization",
                "snippet": "Healthcare facilities need to optimize staff scheduling and resource allocation based on patient demand. The system should use predictive analytics to prevent bottlenecks and improve efficiency.",
                "link": "example.com/healthcare/resources"
            },
            {
                "title": "Telemedicine Platform Integration",
                "snippet": "Healthcare systems need secure and reliable telemedicine platforms that integrate with existing electronic health records. The solution should support video consultations, secure messaging, and remote monitoring.",
                "link": "example.com/healthcare/telemedicine"
            },
            {
                "title": "Medical Diagnosis Assistance",
                "snippet": "Clinicians need AI-powered tools to assist with medical diagnoses. The system should analyze patient data, suggest possible conditions, and provide evidence-based recommendations.",
                "link": "example.com/healthcare/diagnosis"
            }
        ],
        "Open Innovation": [
            {
                "title": "Cross-domain Collaboration Platform",
                "snippet": "A system is needed to enable experts from different fields to collaborate on complex problems. The platform should include real-time communication and project management tools.",
                "link": "example.com/innovation/collaboration"
            },
            {
                "title": "Idea Validation System",
                "snippet": "Organizations need a way to automatically assess and validate innovative ideas. The system should use data analytics to evaluate feasibility and potential impact.",
                "link": "example.com/innovation/validation"
            },
            {
                "title": "Knowledge Sharing Network",
                "snippet": "A platform is needed to connect experts with problem solvers across industries. The system should include reputation tracking and skill verification features.",
                "link": "example.com/innovation/network"
            },
            {
                "title": "Open Innovation Marketplace",
                "snippet": "Companies need a digital marketplace to post challenges and connect with potential solution providers. The platform should facilitate secure information sharing and intellectual property protection.",
                "link": "example.com/innovation/marketplace"
            },
            {
                "title": "Collaborative Research Platform",
                "snippet": "Research institutions need a platform for collaborative research projects. The system should support data sharing, version control, and attribution tracking.",
                "link": "example.com/innovation/research"
            }
        ],
        "FinTech": [
            {
                "title": "Real-time Fraud Detection",
                "snippet": "Financial institutions need a system to detect and prevent fraudulent transactions across multiple channels. The solution should use machine learning for pattern recognition.",
                "link": "example.com/fintech/fraud"
            },
            {
                "title": "Regulatory Compliance Monitoring",
                "snippet": "Banks need to ensure compliance with financial regulations across jurisdictions. The system should automate compliance checking and reporting.",
                "link": "example.com/fintech/compliance"
            },
            {
                "title": "Secure Payment Processing",
                "snippet": "A system is needed to process payments securely while maintaining high performance. The solution should handle multiple payment methods and provide detailed transaction logs.",
                "link": "example.com/fintech/payments"
            },
            {
                "title": "Decentralized Finance Integration",
                "snippet": "Financial services companies need to integrate traditional systems with decentralized finance protocols. The solution should provide secure bridges between traditional and blockchain-based systems.",
                "link": "example.com/fintech/defi"
            },
            {
                "title": "Personalized Financial Advice",
                "snippet": "Consumers need personalized financial advice based on their spending patterns and goals. The system should analyze financial data and provide actionable recommendations.",
                "link": "example.com/fintech/advice"
            }
        ],
        "Logistics": [
            {
                "title": "Dynamic Route Optimization",
                "snippet": "Delivery companies need to optimize routes in real-time considering traffic, weather, and other constraints. The system should adapt to changing conditions.",
                "link": "example.com/logistics/routing"
            },
            {
                "title": "Smart Inventory Management",
                "snippet": "Warehouses need to optimize inventory levels using IoT sensors and predictive analytics. The solution should prevent stockouts while minimizing costs.",
                "link": "example.com/logistics/inventory"
            },
            {
                "title": "Last-mile Delivery Tracking",
                "snippet": "A system is needed to track and optimize last-mile delivery operations. The solution should provide real-time visibility and optimize resource allocation.",
                "link": "example.com/logistics/delivery"
            },
            {
                "title": "Supply Chain Transparency",
                "snippet": "Companies need to provide transparency in their supply chains. The system should track products from source to consumer and verify ethical and sustainable practices.",
                "link": "example.com/logistics/transparency"
            },
            {
                "title": "Autonomous Delivery Systems",
                "snippet": "Logistics companies need to integrate autonomous delivery vehicles into their operations. The solution should coordinate between human-operated and autonomous systems.",
                "link": "example.com/logistics/autonomous"
            }
        ],
        "Sustainable Development": [
            {
                "title": "Energy Usage Optimization",
                "snippet": "Organizations need to monitor and optimize energy consumption across facilities. The system should provide real-time monitoring and recommendations.",
                "link": "example.com/sustainability/energy"
            },
            {
                "title": "Waste Management Automation",
                "snippet": "Facilities need to automate waste sorting and tracking for improved recycling. The solution should use computer vision for classification.",
                "link": "example.com/sustainability/waste"
            },
            {
                "title": "Resource Consumption Tracking",
                "snippet": "A system is needed to track and optimize resource usage across operations. The solution should provide analytics and suggest efficiency improvements.",
                "link": "example.com/sustainability/resources"
            },
            {
                "title": "Carbon Footprint Monitoring",
                "snippet": "Companies need to monitor and reduce their carbon footprint. The system should track emissions across operations and suggest reduction strategies.",
                "link": "example.com/sustainability/carbon"
            },
            {
                "title": "Sustainable Supply Chain Verification",
                "snippet": "Organizations need to verify sustainability claims in their supply chains. The solution should track and verify environmental and social impact metrics.",
                "link": "example.com/sustainability/verification"
            }
        ]
    }
    
    return defaults.get(theme['name'], [
        {
            "title": f"{theme['name']} System Integration",
            "snippet": f"Organizations need to integrate {theme['name'].lower()} solutions with existing infrastructure. The system should ensure seamless data flow and maintain performance.",
            "link": f"example.com/{theme['name'].lower()}/integration"
        },
        {
            "title": f"{theme['name']} Process Automation",
            "snippet": f"A system is needed to automate {theme['name'].lower()} processes and reduce manual intervention. The solution should provide clear metrics and ensure reliability.",
            "link": f"example.com/{theme['name'].lower()}/automation"
        },
        {
            "title": f"{theme['name']} Data Management",
            "snippet": f"Organizations need to effectively manage and analyze {theme['name'].lower()} data. The system should provide insights and enable data-driven decisions.",
            "link": f"example.com/{theme['name'].lower()}/data"
        },
        {
            "title": f"{theme['name']} Real-time Monitoring",
            "snippet": f"A system is needed to monitor {theme['name'].lower()} operations in real-time. The solution should provide alerts and enable quick responses to issues.",
            "link": f"example.com/{theme['name'].lower()}/monitoring"
        },
        {
            "title": f"{theme['name']} Optimization Platform",
            "snippet": f"Organizations need to optimize their {theme['name'].lower()} processes. The system should use advanced algorithms to improve efficiency and reduce costs.",
            "link": f"example.com/{theme['name'].lower()}/optimization"
        }
    ])
