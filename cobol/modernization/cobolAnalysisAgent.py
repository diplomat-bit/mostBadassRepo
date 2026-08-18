// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/cobol/modernization/cobolAnalysisAgent.py
================================================================================

```python
import os
import re
import yaml
import openai
from typing import List, Dict, Tuple, Any

# --- Configuration (Consider environment variables for security) ---
# Replace with actual API keys or secure configuration methods
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "YOUR_OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY not set.  Functionality will be limited.")
    # Consider raising an error or setting a default behavior

openai.api_key = OPENAI_API_KEY


class COBOLAnalysisAgent:
    """
    An AI agent for analyzing COBOL code, identifying business logic, and
    providing insights for modernization.
    """

    def __init__(self, openai_api_key: str = OPENAI_API_KEY,  model_name: str = "gpt-3.5-turbo"):  # Using gpt-3.5-turbo for cost
        self.openai_api_key = openai_api_key
        self.model_name = model_name  # Could be configurable, too
        openai.api_key = self.openai_api_key # Initialize OpenAI with API key

        #Load system prompt from file
        self.system_prompt = self._load_system_prompt()

    def _load_system_prompt(self, prompt_file="prompts/idgafai_full.txt"):
        """Loads the system prompt from the specified file."""
        try:
            with open(prompt_file, "r", encoding="utf-8") as f:
                return f.read().strip()
        except FileNotFoundError:
            print(f"System prompt file not found: {prompt_file}. Using default.")
            return "You are a helpful AI assistant."  # Default prompt
        except Exception as e:
            print(f"Error loading system prompt: {e}.  Using default.")
            return "You are a helpful AI assistant."

    def _get_openai_response(self, prompt: str,  temperature: float = 0.2, max_tokens: int = 2000) -> str:
        """
        Internal method to interact with the OpenAI API.  Handles API calls and retries.
        """
        try:
            messages = [
                {"role": "system", "content": self.system_prompt},  # Include the system prompt
                {"role": "user", "content": prompt}
            ]
            response = openai.ChatCompletion.create(
                model=self.model_name,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                # Add other OpenAI parameters here as needed.
            )
            return response.choices[0].message["content"].strip()

        except openai.error.RateLimitError as e:
            print(f"Rate limit hit: {e}.  Retrying after a delay...")
            # Implement retry logic with exponential backoff.
            import time
            time.sleep(5)  # Initial delay
            return self._get_openai_response(prompt, temperature, max_tokens) # Retry
            # Consider a maximum retry limit to avoid infinite loops.

        except openai.error.AuthenticationError as e:
            print(f"Authentication error: {e}.  Check your API key.")
            return "Authentication Error" # Or handle appropriately

        except openai.error.APIConnectionError as e:
            print(f"API Connection Error: {e}. Retrying after a delay...")
            import time
            time.sleep(10)
            return self._get_openai_response(prompt, temperature, max_tokens)  # Retry
            # Implement retry with exponential backoff and maximum attempts.

        except openai.error.OpenAIError as e:
            print(f"OpenAI Error: {e}. Please investigate.")
            return "OpenAI Error" # Or handle appropriately
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return "Unexpected Error"

    def analyze_cobol_file(self, cobol_file_path: str) -> Dict[str, Any]:
        """
        Analyzes a COBOL file and returns a dictionary of insights.

        Args:
            cobol_file_path: The path to the COBOL file.

        Returns:
            A dictionary containing analysis results, or an error message.
        """
        try:
            with open(cobol_file_path, "r", encoding="utf-8") as f: # Robust file handling
                cobol_code = f.read()

            if not cobol_code:
                return {"error": "The COBOL file is empty."}


            # --- Core Analysis and Prompt Engineering ---
            analysis_results = {}
            # 1. Identify Sections/Paragraphs and their Purpose
            section_analysis_prompt = f"""
            Analyze the following COBOL code and identify the purpose of each section or paragraph, 
            e.g., 'DATA DIVISION', 'PROCEDURE DIVISION', 'INPUT-OUTPUT SECTION', 'FILE STATUS', etc.  
            Provide a concise summary (1-2 sentences) of each section's function. Also provide line numbers and the code of each section, if possible.
            COBOL Code:\n\n{cobol_code}
            """
            section_analysis_response = self._get_openai_response(section_analysis_prompt)
            analysis_results["section_analysis"] = section_analysis_response

            # 2. Extract Business Logic Highlights
            business_logic_prompt = f"""
            Identify the key business rules and logic implemented within the provided COBOL code.
            Focus on critical processes such as data validation, calculations, data transformations, file I/O operations, and any decision-making logic.
            Summarize each identified business rule in a clear and concise manner. Provide line numbers if you can.
            COBOL Code:\n\n{cobol_code}
            """
            business_logic_response = self._get_openai_response(business_logic_prompt)
            analysis_results["business_logic"] = business_logic_response

            # 3. Assess Code Complexity and areas of risk
            complexity_prompt = f"""
            Assess the complexity of the following COBOL code.  
            Identify potential areas of technical debt, such as overly complex paragraphs, use of GOTO statements, or other indicators of code that might be difficult to maintain or modernize.
            Also, note any security risks or vulnerabilities you can detect.
            COBOL Code:\n\n{cobol_code}
            """
            complexity_response = self._get_openai_response(complexity_prompt)
            analysis_results["code_complexity"] = complexity_response

            # 4. Suggest Modernization Strategies (e.g., Java, Python)
            modernization_prompt = f"""
            Based on the analysis of this COBOL code, recommend potential modernization strategies,
            such as the target programming languages (e.g., Java, Python, C#), architectural patterns (e.g., microservices, REST APIs), and frameworks to consider.
            Also, suggest a phased approach, if appropriate. Consider also the use of automated refactoring tools.
            COBOL Code:\n\n{cobol_code}
            """
            modernization_response = self._get_openai_response(modernization_prompt)
            analysis_results["modernization_strategy"] = modernization_response

            # 5. Data Flow Analysis (If feasible and code allows)
            data_flow_prompt = f"""
            Analyze the provided COBOL code to identify how data flows through the program.
            Trace the movement of data between different sections of the code, including the DATA DIVISION and PROCEDURE DIVISION.
            Identify data sources (files, databases), data transformations, and data destinations.
            COBOL Code:\n\n{cobol_code}
            """
            data_flow_response = self._get_openai_response(data_flow_prompt)
            analysis_results["data_flow_analysis"] = data_flow_response

            # 6. File I/O Analysis
            file_io_prompt = f"""
            Analyze the following COBOL code and identify all file input/output operations.
            For each file operation, specify the file name, the type of operation (e.g., OPEN, READ, WRITE, CLOSE),
            and any associated data structures or record layouts involved.
            COBOL Code:\n\n{cobol_code}
            """
            file_io_response = self._get_openai_response(file_io_prompt)
            analysis_results["file_io_analysis"] = file_io_response


            # --- Further Enhancements (More prompts and agent capabilities) ---
            # 7. Generate Unit Test Cases (If not already included).  Careful about over-reliance on this.
            # unit_test_prompt = f"""...Prompt to generate unit tests...{cobol_code}"""
            # unit_test_response = self._get_openai_response(unit_test_prompt)
            # analysis_results["unit_tests"] = unit_test_response
            # 8.  Create a data dictionary from the DATA DIVISION.
            # 9.  Identify dependencies on external systems/libraries/databases.


            return analysis_results

        except FileNotFoundError:
            return {"error": f"COBOL file not found at {cobol_file_path}"}
        except Exception as e:
            return {"error": f"An error occurred during analysis: {e}"}

    def generate_modernization_report(self, analysis_results: Dict[str, Any], output_file_path: str = "modernization_report.txt"):
        """
        Generates a modernization report based on the analysis results.

        Args:
            analysis_results:  The dictionary of analysis results.
            output_file_path: The path to save the report.
        """
        try:
            with open(output_file_path, "w", encoding="utf-8") as f:
                f.write("COBOL Modernization Analysis Report\n")
                f.write("-" * 40 + "\n")

                if "error" in analysis_results:
                    f.write(f"Error: {analysis_results['error']}\n")
                    return

                for key, value in analysis_results.items():
                    f.write(f"\n--- {key.replace('_', ' ').title()} ---\n")
                    f.write(f"{value}\n")
                    f.write("-" * 20 + "\n")

                f.write("\nEnd of Report\n")
                print(f"Modernization report generated at: {output_file_path}")

        except Exception as e:
            print(f"Error generating the report: {e}")



# --- Example Usage ---
if __name__ == "__main__":
    # 1. Replace with the path to your COBOL file.
    cobol_file_path = "example.cob" #  Create a dummy file called example.cob to test.  Important!

    # Create a simple dummy example.cob file for testing:
    if not os.path.exists(cobol_file_path):
        with open(cobol_file_path, "w") as f:
            f.write("""
            IDENTIFICATION DIVISION.
            PROGRAM-ID. HELLO.
            DATA DIVISION.
            WORKING-STORAGE SECTION.
            01  WS-MESSAGE PIC X(15) VALUE 'Hello, World!'.
            PROCEDURE DIVISION.
            DISPLAY WS-MESSAGE.
            STOP RUN.
            """)

    # Initialize the agent.
    agent = COBOLAnalysisAgent()

    # 2. Analyze the COBOL file.
    analysis = agent.analyze_cobol_file(cobol_file_path)

    # 3.  Handle the results (check for errors)
    if "error" in analysis:
        print(f"Analysis failed: {analysis['error']}")
    else:
        # 4. Generate a report.
        agent.generate_modernization_report(analysis)
```