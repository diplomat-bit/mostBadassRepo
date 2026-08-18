// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/integrations/codex/apiDiscoveryAgent.py
================================================================================

import requests
from bs4 import BeautifulSoup
import json
import yaml
from urllib.parse import urljoin, urlparse
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Configuration ---
DEFAULT_USER_AGENT = "API_Discovery_Agent/1.0 (+http://example.com/agent)"
MAX_THREADS = 10
REQUEST_TIMEOUT = 10  # seconds
MAX_DEPTH = 3
SEED_URLS = [
    "https://developer.github.com/v3/repos/",
    "https://developers.google.com/apis/api/design",
    "https://developer.twitter.com/en/docs/api-reference-index",
    "https://developer.spotify.com/documentation/web-api/reference/",
    "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-rest-api-examples.html",
    "https://learn.microsoft.com/en-us/rest/",
    "https://developer.mozilla.org/en-US/docs/Web/API", # Example of non-REST API docs to see how it handles
]
# List of known API spec file extensions to look for
SPEC_FILE_EXTENSIONS = ['.yaml', '.yml', '.json', '.swagger.json', '.openapi.json']

# --- Helper Functions ---

def is_valid_url(url):
    """Checks if a URL is valid and has a scheme."""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

def normalize_url(url, base_url):
    """Normalizes a URL, resolving relative paths and removing fragments."""
    try:
        absolute_url = urljoin(base_url, url)
        parsed_url = urlparse(absolute_url)
        return parsed_url._replace(fragment="").geturl()
    except ValueError:
        return None

def fetch_url(url, headers, timeout=REQUEST_TIMEOUT):
    """Fetches content from a URL with error handling."""
    try:
        response = requests.get(url, headers=headers, timeout=timeout, stream=True)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
        return response
    except requests.exceptions.RequestException as e:
        logging.warning(f"Failed to fetch {url}: {e}")
        return None

def analyze_api_spec(url, headers):
    """Attempts to analyze a URL as a potential API specification."""
    response = fetch_url(url, headers)
    if not response:
        return None

    content_type = response.headers.get('Content-Type', '').lower()
    url_lower = url.lower()

    spec_data = None
    spec_type = None

    try:
        if any(ext in url_lower for ext in ['.yaml', '.yml']):
            if 'yaml' in content_type or 'text' in content_type:
                spec_data = yaml.safe_load(response.content)
                spec_type = "YAML/OpenAPI"
        elif '.json' in url_lower:
            if 'json' in content_type or 'text' in content_type:
                spec_data = json.loads(response.content)
                spec_type = "JSON/OpenAPI"

        if spec_data and isinstance(spec_data, dict):
            # Basic validation for OpenAPI/Swagger structure
            if 'openapi' in spec_data or 'swagger' in spec_data:
                logging.info(f"Discovered valid OpenAPI/Swagger spec at: {url}")
                return {
                    "url": url,
                    "type": spec_type,
                    "spec": spec_data,
                    "discovered_at": time.time(),
                    "analysis_result": "valid_spec"
                }
            elif 'paths' in spec_data or 'info' in spec_data:
                # Heuristic: might be an API spec even if no explicit version field
                logging.warning(f"Discovered potential API spec (heuristic match) at: {url}")
                return {
                    "url": url,
                    "type": spec_type,
                    "spec": spec_data,
                    "discovered_at": time.time(),
                    "analysis_result": "potential_spec_heuristic"
                }
    except (yaml.YAMLError, json.JSONDecodeError) as e:
        logging.warning(f"Failed to parse {url} as API spec: {e}")
    except Exception as e:
        logging.error(f"Unexpected error analyzing spec at {url}: {e}")

    # If it's not a recognized spec, but we fetched it, return basic info
    return {
        "url": url,
        "type": content_type,
        "discovered_at": time.time(),
        "analysis_result": "fetched_but_not_spec"
    }

def extract_links(html_content, base_url, depth):
    """Extracts and normalizes links from HTML content."""
    links = set()
    if not html_content:
        return links

    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            normalized_href = normalize_url(href, base_url)
            if normalized_href and urlparse(normalized_href).netloc == urlparse(base_url).netloc:
                # Only follow links within the same domain for controlled crawling
                links.add(normalized_href)
            elif normalized_href and urlparse(normalized_href).netloc != urlparse(base_url).netloc:
                # Keep external links to spec files
                if any(normalized_href.lower().endswith(ext) for ext in SPEC_FILE_EXTENSIONS):
                    links.add(normalized_href)
    except Exception as e:
        logging.error(f"Error parsing HTML from {base_url}: {e}")
    return links

# --- Main Agent Class ---

class APIDiscoveryAgent:
    def __init__(self, seed_urls=SEED_URLS, max_threads=MAX_THREADS, max_depth=MAX_DEPTH, user_agent=DEFAULT_USER_AGENT):
        self.seed_urls = seed_urls
        self.max_threads = max_threads
        self.max_depth = max_depth
        self.user_agent = user_agent
        self.headers = {'User-Agent': self.user_agent}
        self.visited_urls = set()
        self.discovered_specs = []
        self.active_tasks = {} # url -> future

    def _process_url(self, url, current_depth):
        """Processes a single URL: fetches content, extracts links, or analyzes spec."""
        if url in self.visited_urls or current_depth > self.max_depth:
            return

        self.visited_urls.add(url)
        logging.info(f"Visiting URL (Depth {current_depth}): {url}")

        # Check if the URL looks like a spec file first
        if any(url.lower().endswith(ext) for ext in SPEC_FILE_EXTENSIONS):
            result = analyze_api_spec(url, self.headers)
            if result:
                self.discovered_specs.append(result)
            # Even if it's a spec, we might want to follow links *from* it if it's HTML containing links
            # For now, we'll assume spec files are not HTML pages with further links to crawl.
            # If it's not a spec, we'll treat it as regular content.

        response = fetch_url(url, self.headers)
        if not response:
            return

        content_type = response.headers.get('Content-Type', '').lower()

        if 'text/html' in content_type:
            try:
                html_content = response.text
                links = extract_links(html_content, url, current_depth + 1)
                for link in links:
                    if link not in self.visited_urls and current_depth + 1 <= self.max_depth:
                        self.submit_task(link, current_depth + 1)
            except Exception as e:
                logging.error(f"Failed to process HTML content for {url}: {e}")
        elif any(ext in url.lower() for ext in SPEC_FILE_EXTENSIONS):
            # Re-analyze if not caught by the initial check (e.g., content-type mismatch but URL suggests spec)
            result = analyze_api_spec(url, self.headers)
            if result:
                # Avoid duplicates if already added
                if not any(spec['url'] == url for spec in self.discovered_specs):
                    self.discovered_specs.append(result)
        else:
            logging.debug(f"Skipping non-HTML, non-spec content at: {url}")

    def submit_task(self, url, current_depth):
        """Submits a task to the thread pool."""
        if url in self.visited_urls or current_depth > self.max_depth:
            return

        future = self.active_tasks.get(url)
        if future and not future.done():
            return # Task already submitted and running

        logging.debug(f"Submitting task for {url} at depth {current_depth}")
        future = self.executor.submit(self._process_url, url, current_depth)
        self.active_tasks[url] = future

    def run(self):
        """Starts the API discovery process."""
        logging.info("Starting API Discovery Agent...")
        start_time = time.time()

        with ThreadPoolExecutor(max_workers=self.max_threads) as self.executor:
            # Submit initial seed URLs
            for url in self.seed_urls:
                if is_valid_url(url):
                    normalized_seed_url = normalize_url(url, url) # Normalize seed URLs
                    if normalized_seed_url:
                        self.submit_task(normalized_seed_url, 0)
                else:
                    logging.warning(f"Skipping invalid seed URL: {url}")

            # Monitor active tasks and submit new ones as links are found
            while self.active_tasks:
                done_tasks = set()
                for url, future in self.active_tasks.items():
                    if future.done():
                        try:
                            # If _process_url returned anything, it would be handled within _process_url
                            # We just need to catch exceptions here if any occurred
                            future.result()
                        except Exception as e:
                            logging.error(f"Task for {url} raised an exception: {e}")
                        done_tasks.add(url)

                for url in done_tasks:
                    del self.active_tasks[url]

                # Add a small delay to prevent busy-waiting
                if self.active_tasks:
                    time.sleep(0.1)

        end_time = time.time()
        logging.info(f"API Discovery Agent finished in {end_time - start_time:.2f} seconds.")
        logging.info(f"Visited {len(self.visited_urls)} URLs.")
        logging.info(f"Discovered {len(self.discovered_specs)} potential API specifications.")

        return self.discovered_specs

    def save_results(self, filename="discovered_apis.json"):
        """Saves the discovered API specifications to a JSON file."""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.discovered_specs, f, indent=4, ensure_ascii=False)
            logging.info(f"Discovered API specifications saved to {filename}")
        except IOError as e:
            logging.error(f"Error saving results to {filename}: {e}")

# --- Main Execution ---

if __name__ == "__main__":
    agent = APIDiscoveryAgent()
    results = agent.run()
    agent.save_results()

    # Example: Print details of the first few discovered specs
    print("\n--- Sample of Discovered APIs ---")
    for i, spec_info in enumerate(results[:5]):
        print(f"\n{i+1}. URL: {spec_info['url']}")
        print(f"   Type: {spec_info['type']}")
        print(f"   Analysis: {spec_info['analysis_result']}")
        if spec_info['spec']:
            title = spec_info['spec'].get('info', {}).get('title', 'N/A')
            version = spec_info['spec'].get('info', {}).get('version', 'N/A')
            print(f"   Title: {title}")
            print(f"   Version: {version}")
        print("-" * 20)

    # Example: Further analysis on a specific type of spec (e.g., OpenAPI)
    openapi_specs = [s for s in results if s['analysis_result'] == 'valid_spec' or s['analysis_result'] == 'potential_spec_heuristic']
    if openapi_specs:
        print(f"\nFound {len(openapi_specs)} potentially usable OpenAPI/Swagger specs.")
        # Here you could add more detailed analysis, like extracting endpoints, parameters, etc.
        # For brevity, we'll just log the count.
    else:
        print("\nNo valid OpenAPI/Swagger specs found in this run.")
```