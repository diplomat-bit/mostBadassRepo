// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/transaction-service/app/services/categorization_ai.py
================================================================================

"""
Contains the AI/ML logic for automatically categorizing transactions.

This service is responsible for interfacing with a dedicated, external machine learning
model to predict the category of a given financial transaction based on its details.
It is designed to be resilient, configurable, and asynchronous.
"""

import os
import logging
from typing import Optional, List, Dict, Any

import httpx
from pydantic import BaseModel, Field, ValidationError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Configuration ---
# Load configuration from environment variables for flexibility across environments.
ML_MODEL_ENDPOINT = os.getenv("CATEGORIZATION_MODEL_ENDPOINT")
ML_MODEL_API_KEY = os.getenv("CATEGORIZATION_MODEL_API_KEY")  # For secured endpoints
REQUEST_TIMEOUT = int(os.getenv("CATEGORIZATION_MODEL_TIMEOUT", 10))  # seconds
CONFIDENCE_THRESHOLD = float(os.getenv("CATEGORIZATION_CONFIDENCE_THRESHOLD", 0.70))
DEFAULT_CATEGORY = "Uncategorized"
RETRY_ATTEMPTS = int(os.getenv("CATEGORIZATION_RETRY_ATTEMPTS", 3))


# --- Pydantic Models for Data Validation ---
# These models ensure that the data sent to and received from the ML model is well-structured.

class ModelInputInstance(BaseModel):
    """
    Defines the structure of a single transaction instance sent to the ML model.
    The model is expected to perform better with more context.
    """
    transaction_id: str
    description: str
    merchant_name: Optional[str] = None
    amount: float


class ModelRequestPayload(BaseModel):
    """
    The full request body sent to the ML model's inference endpoint.
    The "instances" key is a common convention for many ML serving platforms (e.g., Vertex AI).
    """
    instances: List[ModelInputInstance]


class ModelPrediction(BaseModel):
    """
    Represents a single category prediction from the model.
    """
    category: str
    confidence: float = Field(..., ge=0.0, le=1.0)


class ModelResponse(BaseModel):
    """
    Represents the expected structure of the full response from the ML model.
    """
    predictions: List[ModelPrediction]


# --- Service Class ---

class TransactionCategorizationAI:
    """
    A service to interact with a remote ML model for transaction categorization.
    """

    def __init__(self):
        """
        Initializes the service, configuration, and the HTTP client.
        """
        if not ML_MODEL_ENDPOINT:
            logger.error("CATEGORIZATION_MODEL_ENDPOINT environment variable is not set.")
            raise ValueError("ML model endpoint is required.")

        self.model_endpoint = ML_MODEL_ENDPOINT
        self.confidence_threshold = CONFIDENCE_THRESHOLD
        self.default_category = DEFAULT_CATEGORY

        headers = {"Content-Type": "application/json"}
        if ML_MODEL_API_KEY:
            headers["Authorization"] = f"Bearer {ML_MODEL_API_KEY}"

        self.http_client = httpx.AsyncClient(
            headers=headers,
            timeout=REQUEST_TIMEOUT,
            http2=True  # Enable HTTP/2 for better performance if the server supports it
        )
        logger.info(f"TransactionCategorizationAI service initialized for endpoint: {self.model_endpoint}")

    @retry(
        stop=stop_after_attempt(RETRY_ATTEMPTS),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((httpx.RequestError, httpx.HTTPStatusError)),
        before_sleep=lambda retry_state: logger.warning(
            f"Retrying ML model request, attempt {retry_state.attempt_number}..."
        )
    )
    async def _make_inference_request(self, payload: ModelRequestPayload) -> Optional[ModelResponse]:
        """
        Makes the actual HTTP request to the ML model endpoint with retry logic.

        Args:
            payload: The request payload validated by Pydantic.

        Returns:
            A validated ModelResponse object or None if a persistent error occurs.
        """
        try:
            response = await self.http_client.post(self.model_endpoint, json=payload.dict())
            response.raise_for_status()  # Raises HTTPStatusError for 4xx/5xx responses

            response_data = response.json()
            return ModelResponse.parse_obj(response_data)

        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error calling ML model: {e.response.status_code} - {e.response.text}")
            # For client errors (4xx), retrying might not help. We could add specific logic here.
            # For server errors (5xx), retries are handled by tenacity.
            raise  # Re-raise to trigger tenacity retry
        except httpx.RequestError as e:
            logger.error(f"Network error calling ML model: {e}")
            raise  # Re-raise to trigger tenacity retry
        except (ValidationError, ValueError) as e:
            logger.error(f"Failed to parse or validate ML model response: {e}")
            return None # Don't retry on malformed response
        except Exception as e:
            logger.exception(f"An unexpected error occurred during ML model inference: {e}")
            return None # Don't retry on unknown errors

    async def categorize_transaction(
        self,
        transaction_id: str,
        description: str,
        amount: float,
        merchant_name: Optional[str] = None
    ) -> str:
        """
        Categorizes a single transaction by calling the ML model.

        Args:
            transaction_id: The unique ID of the transaction.
            description: The transaction description text.
            amount: The transaction amount.
            merchant_name: The name of the merchant, if available.

        Returns:
            The predicted category string, or the default category if prediction fails
            or confidence is too low.
        """
        logger.info(f"Requesting category for transaction_id: {transaction_id}")

        instance = ModelInputInstance(
            transaction_id=transaction_id,
            description=description,
            merchant_name=merchant_name,
            amount=amount
        )
        payload = ModelRequestPayload(instances=[instance])

        model_response = await self._make_inference_request(payload)

        if not model_response or not model_response.predictions:
            logger.warning(
                f"No valid predictions received for transaction_id: {transaction_id}. "
                f"Falling back to '{self.default_category}'."
            )
            return self.default_category

        # Assuming the model returns one prediction for each instance in the request
        top_prediction = model_response.predictions[0]

        if top_prediction.confidence >= self.confidence_threshold:
            logger.info(
                f"Successfully categorized transaction_id: {transaction_id} as "
                f"'{top_prediction.category}' with confidence {top_prediction.confidence:.2f}"
            )
            return top_prediction.category
        else:
            logger.info(
                f"Model confidence ({top_prediction.confidence:.2f}) for transaction_id: {transaction_id} "
                f"is below threshold ({self.confidence_threshold}). "
                f"Falling back to '{self.default_category}'."
            )
            return self.default_category

    async def close(self):
        """
        Gracefully closes the HTTP client. Should be called on application shutdown.
        """
        await self.http_client.aclose()
        logger.info("TransactionCategorizationAI HTTP client closed.")


# --- Singleton Instance ---
# This pattern ensures that only one instance of the service (and its HTTP client)
# is created throughout the application's lifecycle.

_categorization_service_instance: Optional[TransactionCategorizationAI] = None

def get_categorization_service() -> TransactionCategorizationAI:
    """
    Provides a singleton instance of the TransactionCategorizationAI service.
    """
    global _categorization_service_instance
    if _categorization_service_instance is None:
        try:
            _categorization_service_instance = TransactionCategorizationAI()
        except ValueError as e:
            # This handles the case where the service cannot be initialized due to
            # missing configuration, preventing the app from starting.
            logger.critical(f"Failed to initialize TransactionCategorizationAI service: {e}")
            raise
    return _categorization_service_instance

# Example usage (for testing or demonstration)
if __name__ == '__main__':
    import asyncio

    async def main():
        # This block will only run if the script is executed directly.
        # It requires the CATEGORIZATION_MODEL_ENDPOINT env var to be set to a mock server.
        # You can use a simple Flask/FastAPI app as a mock server for testing.
        # Example mock server response:
        # {"predictions": [{"category": "Groceries", "confidence": 0.95}]}

        if not os.getenv("CATEGORIZATION_MODEL_ENDPOINT"):
            print("Please set the CATEGORIZATION_MODEL_ENDPOINT environment variable to run this example.")
            print("Example: export CATEGORIZATION_MODEL_ENDPOINT=http://127.0.0.1:8000/predict")
            return

        service = get_categorization_service()

        try:
            # Test case 1: High confidence
            category = await service.categorize_transaction(
                transaction_id="txn_1",
                description="TRADER JOE'S #123 PALO ALTO CA",
                amount=-45.50,
                merchant_name="Trader Joe's"
            )
            print(f"Test Case 1 Result: {category}")

            # Test case 2: Low confidence (mock server should return confidence < threshold)
            category_low_conf = await service.categorize_transaction(
                transaction_id="txn_2",
                description="RANDOM GIBBERISH INC",
                amount=-19.99,
                merchant_name="Random Gibberish"
            )
            print(f"Test Case 2 Result: {category_low_conf}")

            # Test case 3: Network error (if mock server is down)
            # To test this, stop the mock server and run the script.
            # print("\nTesting network error handling (stop the mock server now)...")
            # await asyncio.sleep(5)
            # category_error = await service.categorize_transaction(
            #     transaction_id="txn_3",
            #     description="SHOULD FAIL",
            #     amount=-10.00
            # )
            # print(f"Test Case 3 Result: {category_error}")

        finally:
            await service.close()

    asyncio.run(main())