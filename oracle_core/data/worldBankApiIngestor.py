// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/oracle_core/data/worldBankApiIngestor.py
================================================================================

```python
import requests
import pandas as pd
import json
import os
from datetime import datetime

# Constants
DATA_DIR = 'data'  # Relative path to data directory. Ensure this exists.
BASE_URL = "https://api.worldbank.org/v2/country/all/indicator/"
API_FORMAT = "?format=json&per_page=20000"  # JSON format, large page size
INDICATORS = {
    "NY.GDP.MKTP.CD": "GDP_current_USD",  # GDP (Current USD)
    "SP.POP.TOTL": "population_total",    # Population, total
    "NE.GDI.FTOT.CD": "gross_capital_formation_USD", # Gross capital formation (current USD)
    "NY.GNP.PCAP.CD": "GNI_per_capita_USD", # GNI per capita (current USD)
    "SI.POV.GINI": "gini_index",           # GINI index (World Bank estimate)
    "FP.CPI.TOTL": "consumer_price_index" #Consumer Price Index
}

def fetch_world_bank_data(indicator_code):
    """
    Fetches data from the World Bank API for a given indicator.

    Args:
        indicator_code (str): The World Bank indicator code.

    Returns:
        list: A list of dictionaries containing the data, or None if an error occurs.
    """
    url = f"{BASE_URL}{indicator_code}{API_FORMAT}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        data = response.json()
        # The actual data is in the second element of the list
        return data[1] if len(data) > 1 else None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for {indicator_code}: {e}")
        return None

def normalize_world_bank_data(data, indicator_name):
    """
    Normalizes the data from the World Bank API into a consistent format.

    Args:
        data (list): A list of dictionaries containing the raw data.
        indicator_name (str): The name of the indicator.

    Returns:
        pandas.DataFrame: A DataFrame containing the normalized data.
    """
    normalized_data = []
    for entry in data:
        if entry['value'] is not None: # Only process entries with a value
            normalized_data.append({
                "country_code": entry['countryiso3code'],
                "country_name": entry['country']['value'],
                "year": int(entry['date']),
                indicator_name: entry['value'],
                "source": "World Bank API"
            })
    return pd.DataFrame(normalized_data)

def save_data_to_csv(df, indicator_code):
    """
    Saves the data to a CSV file.

    Args:
        df (pandas.DataFrame): The DataFrame to save.
        indicator_code (str): The World Bank indicator code (used for filename).
    """
    os.makedirs(DATA_DIR, exist_ok=True) # Ensure data directory exists
    filename = os.path.join(DATA_DIR, f"world_bank_{indicator_code}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv")
    df.to_csv(filename, index=False)
    print(f"Data saved to {filename}")

def load_existing_data(indicator_code):
    """
    Loads existing data for a specific indicator.  This function assumes
    consistent naming and directory structure from save_data_to_csv. It scans
    the `DATA_DIR` for CSV files matching the pattern
    "world_bank_{indicator_code}_*.csv" and loads them into a single DataFrame.

    Args:
        indicator_code (str): The World Bank indicator code.

    Returns:
        pandas.DataFrame: A DataFrame containing the combined existing data,
                         or an empty DataFrame if no files are found.
    """
    import glob

    search_pattern = os.path.join(DATA_DIR, f"world_bank_{indicator_code}_*.csv")
    files = glob.glob(search_pattern)

    if not files:
        print(f"No existing data files found for indicator {indicator_code}")
        return pd.DataFrame()  # Return an empty DataFrame if no files are found

    all_data = []
    for file in files:
        try:
            df = pd.read_csv(file)
            all_data.append(df)
        except Exception as e:
            print(f"Error loading existing data from {file}: {e}")
            # Optionally, remove the corrupt file or handle the error in another way
            continue

    if not all_data:
        print(f"No valid data found for indicator {indicator_code} after attempting to load existing files.")
        return pd.DataFrame()

    combined_df = pd.concat(all_data, ignore_index=True)
    print(f"Successfully loaded and combined existing data from {len(files)} files for indicator {indicator_code}.")
    return combined_df

def update_and_save_data(indicator_code, indicator_name):
    """
    Fetches, normalizes, combines with existing data, and saves World Bank data.

    Args:
        indicator_code (str): The World Bank indicator code.
        indicator_name (str): The name of the indicator.
    """
    print(f"Fetching data for {indicator_code}...")
    new_data = fetch_world_bank_data(indicator_code)

    if new_data:
        print(f"Normalizing data for {indicator_code}...")
        new_df = normalize_world_bank_data(new_data, indicator_name)

        print(f"Loading existing data for {indicator_code}...")
        existing_df = load_existing_data(indicator_code)

        if not existing_df.empty:
            print(f"Combining new and existing data for {indicator_code}...")
            combined_df = pd.concat([existing_df, new_df], ignore_index=True)

            # Deduplicate based on country, year, and indicator, keeping the latest entry
            combined_df = combined_df.sort_values(by=['year'], ascending=False).drop_duplicates(
                subset=['country_code', 'year', indicator_name], keep='first').sort_index()
        else:
            combined_df = new_df

        print(f"Saving combined data for {indicator_code}...")
        save_data_to_csv(combined_df, indicator_code)
    else:
        print(f"No new data fetched for {indicator_code}.  Existing data remains unchanged.")


def main():
    """
    Main function to fetch, normalize, and save data for all specified indicators.
    """
    print("Starting World Bank API data ingestion...")
    for indicator_code, indicator_name in INDICATORS.items():
        update_and_save_data(indicator_code, indicator_name)
    print("World Bank API data ingestion completed.")

if __name__ == "__main__":
    main()
```