import asyncio
import json
from pyppeteer import launch
import logging
import argparse
import time
import requests
from urllib.parse import quote_plus

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Load Problem Statement Function ---
def load_problem_statement(file_path):
    """Loads the problem statement from a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        statement = data.get('problem_statement', '')
        if not statement:
            logging.warning(f"Problem statement is empty or not found in {file_path}.")
        return statement
    except FileNotFoundError:
        logging.error(f"Error: Problem statement file not found at {file_path}")
        return ""
    except json.JSONDecodeError:
        logging.error(f"Error: Could not decode JSON from {file_path}")
        return ""
    except Exception as e:
        logging.error(f"An unexpected error occurred loading {file_path}: {e}")
        return ""

# --- Generate Keywords Function ---
def generate_keywords(problem_statement):
    """Generates keywords from the problem statement using a local LLM."""
    if not problem_statement:
        logging.error("Cannot generate keywords: Problem statement is empty.")
        return []

    url = "http://localhost:1234/v1/chat/completions"
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "gemma-3-4b-it",
        "messages": [
            {"role": "system", "content": (
                "You are a helpful assistant that extracts concise keywords for Google Scholar search from a problem statement. "
                "Core Keyword Frameworks are: topicname , domain_name, subdomain_name."
                "Make sure to just generate only 5 keywords and print key words and not any other text."
            )},
            {"role": "user", "content": f"Extract keywords for Google Scholar search from the following problem statement:\n{problem_statement}"}
        ],
        "temperature": 0.7, "max_tokens": 100, "stream": False
    }

    try:
        logging.info("Sending request to local LLM for keyword generation...")
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        logging.info("Received response from local LLM.")
        content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
        if not content:
            logging.warning("LLM response did not contain expected content for keywords.")
            return []
        keywords_list = [kw.strip() for kw in content.replace('\n', ',').split(',') if kw.strip()]
        logging.info(f"Generated keywords: {keywords_list}")
        return keywords_list
    except requests.exceptions.RequestException as e:
        logging.error(f"Error connecting to or communicating with the local LLM for keywords at {url}: {e}")
        return []
    except Exception as e:
        logging.error(f"An unexpected error occurred during keyword generation: {e}")
        return []

# --- Relevance Check Function ---
def is_relevant(item, problem_statement):
    """Checks if a scraped item is relevant to the problem statement using a local LLM."""
    if not problem_statement:
        logging.warning("Cannot check relevance: Problem statement is empty.")
        return False

    title = item.get('title', 'N/A')
    snippet = item.get('snippet', 'N/A')
    abstract = item.get('abstract', 'Not available')

    if isinstance(abstract, str) and abstract.startswith("Error scraping abstract:"):
        abstract_text = "Abstract scraping failed."
    else:
        abstract_text = abstract or "Not available"

    input_text = f"Title: {title}\nSnippet: {snippet}\nAbstract: {abstract_text}"

    url = "http://localhost:1234/v1/chat/completions"
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "gemma-3-4b-it",
        "messages": [
            {"role": "system", "content": "You are an assistant that determines relevance. Answer only with 'Yes' or 'No'."},
            {"role": "user", "content": (
                f"Is the following text relevant to the problem statement provided below? Answer only 'Yes' or 'No'.\n\n"
                f"Text:\n{input_text}\n\n"
                f"Problem Statement:\n{problem_statement}"
            )}
        ],
        "temperature": 0.2, "max_tokens": 5, "stream": False
    }

    try:
        logging.debug(f"Sending request to local LLM for relevance check (Title: {title[:50]}...).")
        response = requests.post(url, headers=headers, json=payload, timeout=45)
        response.raise_for_status()
        result = response.json()
        content = result.get('choices', [{}])[0].get('message', {}).get('content', '').strip().lower()
        logging.debug(f"LLM relevance response: '{content}'")

        if content.startswith("yes"):
            return True
        elif content.startswith("no"):
            return False
        else:
            logging.warning(f"Unexpected LLM relevance response: '{content}'. Assuming not relevant.")
            return False
    except requests.exceptions.RequestException as e:
        logging.error(f"Error connecting to or communicating with the local LLM for relevance at {url}: {e}")
        return False
    except Exception as e:
        logging.error(f"An unexpected error occurred during relevance check: {e}")
        return False

# --- Pyppeteer Scraping Function (Modified for N results from page 1) ---
async def scrape_google_scholar_and_abstracts(keywords_query, num_results_per_keyword=2):
    """
    Uses pyppeteer to search the first page of Google Scholar for a query,
    get N results, visit links, and attempt to scrape abstracts.
    """
    single_page_results = []
    browser = None
    page = None
    try:
        logging.info(f"Launching browser for query: '{keywords_query}'")
        browser = await launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
        if not browser:
            logging.error("Failed to launch browser instance.")
            return single_page_results
        logging.info("Browser launched successfully.")

        page = await browser.newPage()
        if not page:
            logging.error("Failed to create a new page.")
            if browser: await browser.close() # Close browser if page creation fails
            return single_page_results
        logging.info("New page created successfully.")

        # --- Google Scholar Search - Page 1 Only ---
        start_index = 0
        encoded_query = quote_plus(keywords_query)
        search_url = f"https://scholar.google.com/scholar?start={start_index}&q={encoded_query}&hl=en&as_sdt=0,5"

        logging.info(f"Navigating to Scholar results page 1 for '{keywords_query}': {search_url}")
        await page.goto(search_url, waitUntil='networkidle2', timeout=30000)
        logging.info(f"Navigation to page 1 complete.")

        try:
            await page.waitForSelector('#gs_res_ccl_mid .gs_r.gs_or.gs_scl', timeout=15000)
            logging.info(f"Search results found on page 1.")

            logging.info(f"Extracting data from page 1 (limit: {num_results_per_keyword})...")
            single_page_results = await page.evaluate(f'''
                (num_results) => {{
                    const items = [];
                    const result_blocks = document.querySelectorAll('#gs_res_ccl_mid .gs_r.gs_or.gs_scl');
                    const count = Math.min(result_blocks.length, num_results);
                    for (let i = 0; i < count; i++) {{
                        const block = result_blocks[i];
                        const item = {{ abstract: null, keyword_source: '{keywords_query.replace("'", "\\'")}' }};
                        const titleElement = block.querySelector('.gs_rt a');
                        item.title = titleElement ? titleElement.innerText : null;
                        item.link = titleElement ? titleElement.href : null;
                        const authorElement = block.querySelector('.gs_a');
                        item.authors_publication = authorElement ? authorElement.innerText : null;
                        const snippetElement = block.querySelector('.gs_rs');
                        item.snippet = snippetElement ? snippetElement.innerText.replace(/\\n/g, ' ') : null;
                        if (item.title && item.link) {{ items.push(item); }}
                    }}
                    return items;
                }}
            ''', num_results_per_keyword)
            logging.info(f"Extracted {len(single_page_results)} results from page 1.")

        except Exception as page_err:
            logging.warning(f"Could not find or process results on page 1 for '{keywords_query}'. Error: {page_err}")
            try: await page.screenshot({'path': f'error_screenshot_page_1_{keywords_query}.png'})
            except: pass

        logging.info(f"Finished fetching results from Scholar page 1 for '{keywords_query}'. Total initial results: {len(single_page_results)}")

        # --- Abstract Scraping Loop ---
        if not single_page_results:
             logging.warning(f"No results found for query '{keywords_query}' to scrape abstracts from.")
        else:
            logging.info(f"Starting abstract scraping for {len(single_page_results)} results (query: '{keywords_query}')...")
            for i, item in enumerate(single_page_results):
                if not item.get('link'):
                    logging.warning(f"Skipping result {i+1} (query: '{keywords_query}') due to missing link.")
                    continue

                link_to_visit = item['link']
                logging.info(f"Processing {i+1}/{len(single_page_results)} (query: '{keywords_query}'): Navigating to {link_to_visit}")

                try:
                    await page.goto(link_to_visit, waitUntil='networkidle0', timeout=45000)
                    logging.info(f"Successfully navigated to {link_to_visit}")
                    current_url = page.url
                    abstract_text = None

                    if 'ieeexplore.ieee.org' in current_url:
                        logging.info("IEEE link detected...")
                        abstract_text = await page.evaluate('''() => {
                            const abstractElement = document.querySelector('div.abstract-text section');
                            return abstractElement ? abstractElement.innerText.trim() : null;
                        }''')
                        if abstract_text: logging.info("Scraped abstract from IEEE.")
                        else: logging.warning("Could not find abstract using IEEE selector.")

                    if not abstract_text:
                        logging.info("Attempting generic abstract scrape...")
                        abstract_text = await page.evaluate('''() => {
                            let abstract = null;
                            const commonSelectors = [ 'div[class*="abstract" i]', 'section[class*="abstract" i]', 'div[id*="abstract" i]', 'section[id*="abstract" i]', '.abstract-container', '.abstract-content' ];
                            for (const selector of commonSelectors) {
                                const element = document.querySelector(selector);
                                if (element && element.innerText && element.innerText.trim().length > 50) { abstract = element.innerText.trim(); break; }
                            }
                            if (!abstract) {
                                const metaDesc = document.querySelector('meta[name="description"]');
                                if (metaDesc && metaDesc.content && metaDesc.content.length > 50) { abstract = metaDesc.content.trim(); }
                            }
                            return abstract;
                        }''')
                        if abstract_text: logging.info("Scraped abstract using generic method.")
                        else: logging.warning("Could not find abstract using generic methods.")

                    item['abstract'] = abstract_text

                except Exception as nav_err:
                    logging.error(f"Error processing link {link_to_visit}: {nav_err}")
                    item['abstract'] = f"Error scraping abstract: {nav_err}"
                    try: await page.screenshot({'path': f'error_screenshot_abstract_{i+1}_{keywords_query}.png'})
                    except: pass

                logging.info(f"Finished {i+1}/{len(single_page_results)} (query: '{keywords_query}'). Sleeping...")
                await asyncio.sleep(2)

            logging.info(f"Abstract scraping finished for query '{keywords_query}'.")

    except Exception as e:
        logging.error(f"An critical error occurred during scraping for query '{keywords_query}': {e}")
        if page:
            try: await page.screenshot({'path': f'critical_error_screenshot_{keywords_query}.png'})
            except: pass
    finally:
        # Close page if it exists and is open
        if page and not page.isClosed():
            try:
                logging.info(f"Closing page for query: '{keywords_query}'")
                await page.close()
            except Exception as page_close_err:
                logging.error(f"Error closing page for query '{keywords_query}': {page_close_err}")
        # Close browser if it exists
        if browser: # Removed isConnected check
             try:
                logging.info(f"Closing browser for query: '{keywords_query}'")
                await browser.close()
             except Exception as browser_close_err:
                 logging.error(f"Error closing browser for query '{keywords_query}': {browser_close_err}")

    return single_page_results

# --- Utility Function ---
def save_results(data, filename="scholar_search_results_pyppeteer_relevant_2.json"):
    """Saves the scraped data to a JSON file."""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        logging.info(f"Saved {len(data)} results to {filename}")
    except Exception as e:
        logging.error(f"Error saving results to {filename}: {e}")

# --- Main Execution Block ---
if __name__ == "__main__":
    print("--- Script starting ---")
    parser = argparse.ArgumentParser(description="Generate keywords, scrape N Google Scholar results (page 1), check relevance, and scrape abstracts using Pyppeteer.")
    parser.add_argument("-p", "--problem_file", type=str, default="problem_statement.json", help="Path to the JSON file containing the problem statement.")
    parser.add_argument("-n", "--num_results_per_keyword", type=int, default=2, help="Number of results to fetch from Scholar page 1 per keyword (default: 2).")
    parser.add_argument("-o", "--output", type=str, default="scholar_search_results_pyppeteer_relevant_2.json", help="Output JSON file name for relevant results.")

    args = parser.parse_args()
    print(f"--- Arguments parsed: {args} ---")

    # 1. Load Problem Statement
    print(f"--- Loading problem statement from {args.problem_file} ---")
    problem_statement = load_problem_statement(args.problem_file)

    # 2. Generate Keywords
    keywords = []
    if problem_statement:
        print("--- Generating keywords ---")
        keywords = generate_keywords(problem_statement)
    else:
        print("--- Skipping keyword generation (no problem statement) ---")

    if not keywords:
        print("--- No keywords generated or found. Exiting. ---")
    else:
        # 3. Scrape N results for each keyword (page 1 only)
        all_results = []
        print(f"--- Starting scraping loop for {len(keywords)} keywords ({args.num_results_per_keyword} results each) ---")
        for i, keyword in enumerate(keywords):
            print(f"\n--- Processing keyword {i+1}/{len(keywords)}: '{keyword}' ---")
            results_for_keyword = asyncio.run(scrape_google_scholar_and_abstracts(keyword, args.num_results_per_keyword))
            all_results.extend(results_for_keyword)
            if i < len(keywords) - 1:
                print(f"--- Sleeping for 5 seconds before next keyword ---")
                time.sleep(5)

        # 4. Filter for Relevance using LLM
        relevant_results = []
        if problem_statement and all_results:
            print(f"\n--- Checking relevance of {len(all_results)} results using LLM ---")
            for i, item in enumerate(all_results):
                logging.info(f"Checking relevance for result {i+1}/{len(all_results)} (Title: {item.get('title', 'N/A')[:60]}...).")
                item['is_relevant'] = is_relevant(item, problem_statement)
                if item['is_relevant']:
                    relevant_results.append(item)
                time.sleep(0.5)
            print(f"--- Found {len(relevant_results)} relevant results ---")
        elif not problem_statement:
             print("\n--- Skipping relevance check (no problem statement loaded) ---")
             relevant_results = all_results
        else:
            print("\n--- No results found to check relevance for ---")
            relevant_results = []

        # 5. Deduplicate RELEVANT Results
        print("\n--- Deduplicating relevant results ---")
        unique_relevant_results = []
        seen_links = set()
        for res in relevant_results:
            link = res.get('link')
            if link and link not in seen_links:
                seen_links.add(link)
                unique_relevant_results.append(res)
        print(f"--- Found {len(unique_relevant_results)} unique relevant results from {len(relevant_results)} total relevant results ---")

        # 6. Save UNIQUE RELEVANT Results
        if unique_relevant_results:
            print(f"--- Saving {len(unique_relevant_results)} unique relevant results to {args.output} ---")
            save_results(unique_relevant_results, args.output)
        else:
            print("--- No unique relevant results found to save ---")

    print("--- Script finished ---")
