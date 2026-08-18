// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/transaction-service/app/consumers/kafka_consumer.py
================================================================================

import json
import logging
import os
import sys
import signal
from typing import Dict, Any

from dotenv import load_dotenv
from kafka import KafkaConsumer
from kafka.errors import KafkaError
from pydantic import ValidationError

# Load environment variables from a .env file for local development
load_dotenv()

# Assuming a structured project layout, we import necessary components.
# These modules would be defined elsewhere in the service.
# For example:
# - app.core.config: Pydantic settings model for configuration management.
# - app.processing.pipeline: The main entry point for the transaction enrichment pipeline.
# - app.schemas.events: Pydantic models for validating incoming event data.
# - app.utils.dead_letter_queue: A utility to handle failed messages.
try:
    from app.core.config import settings
    from app.processing.pipeline import initiate_transaction_pipeline
    from app.schemas.events import TransactionCreatedEvent
    from app.utils.dead_letter_queue import send_to_dlq
except ImportError:
    # This allows the file to be linted and understood even if the full project structure isn't present.
    # In a real execution context, these imports must succeed.
    print("Error: Could not import project modules. Ensure the service is installed correctly.")
    sys.exit(1)


# Configure a structured logger
logging.basicConfig(
    level=settings.LOG_LEVEL.upper(),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


class TransactionEventConsumer:
    """
    A Kafka consumer that listens for new transaction events from the Account Service,
    validates them, and initiates the processing and enrichment pipeline.
    """

    def __init__(self):
        """Initializes the Kafka consumer with configuration from settings."""
        self.consumer = None
        self.running = True
        self._connect()
        self._setup_signal_handlers()

    def _connect(self):
        """Establishes a connection to the Kafka cluster."""
        try:
            self.consumer = KafkaConsumer(
                settings.KAFKA_TRANSACTION_TOPIC,
                bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
                group_id=settings.KAFKA_CONSUMER_GROUP,
                auto_offset_reset='earliest',
                enable_auto_commit=True,
                auto_commit_interval_ms=5000,
                value_deserializer=lambda m: m.decode('utf-8'),
                # Add security configurations if connecting to a secured Kafka cluster
                # security_protocol=settings.KAFKA_SECURITY_PROTOCOL,
                # sasl_mechanism=settings.KAFKA_SASL_MECHANISM,
                # sasl_plain_username=settings.KAFKA_USERNAME,
                # sasl_plain_password=settings.KAFKA_PASSWORD,
                # ssl_cafile=settings.KAFKA_SSL_CAFILE,
            )
            logger.info(
                f"Successfully connected to Kafka brokers at "
                f"{settings.KAFKA_BOOTSTRAP_SERVERS}."
            )
            logger.info(f"Subscribed to topic '{settings.KAFKA_TRANSACTION_TOPIC}' "
                        f"with group ID '{settings.KAFKA_CONSUMER_GROUP}'.")
        except KafkaError as e:
            logger.critical(f"Fatal error connecting to Kafka: {e}. Exiting.")
            sys.exit(1)

    def _setup_signal_handlers(self):
        """Sets up signal handlers for graceful shutdown."""
        signal.signal(signal.SIGINT, self._handle_shutdown)
        signal.signal(signal.SIGTERM, self._handle_shutdown)

    def _handle_shutdown(self, signum, frame):
        """Handles shutdown signals to stop the consumer loop gracefully."""
        logger.info(f"Received shutdown signal ({signal.Signals(signum).name}). Stopping consumer...")
        self.running = False

    def _process_message(self, message_value: str) -> None:
        """
        Deserializes, validates, and processes a single Kafka message.
        If processing fails, the message is sent to a Dead Letter Queue (DLQ).
        """
        try:
            # 1. Deserialize the message from JSON string to Python dict
            event_data: Dict[str, Any] = json.loads(message_value)
            logger.debug(f"Received raw event data: {event_data}")

            # 2. Validate the data structure using the Pydantic model
            transaction_event = TransactionCreatedEvent(**event_data)
            logger.info(f"Validated event for transaction_id: {transaction_event.transaction_id}")

            # 3. Initiate the transaction processing and enrichment pipeline
            # This is an asynchronous call to allow the consumer to continue polling
            # while the pipeline runs in the background (e.g., using Celery, asyncio, etc.).
            initiate_transaction_pipeline(transaction_event)

        except json.JSONDecodeError:
            error_reason = "JSONDecodeError"
            logger.error(f"Failed to decode JSON message: {message_value}")
            send_to_dlq(message_value, error_reason, "Invalid JSON format")
        except ValidationError as e:
            error_reason = "ValidationError"
            logger.error(f"Message validation failed for data: {message_value}. Errors: {e.errors()}")
            send_to_dlq(message_value, error_reason, str(e.errors()))
        except Exception as e:
            # Catch-all for any other unexpected errors during processing
            error_reason = "ProcessingError"
            logger.error(
                f"An unexpected error occurred while processing message: {message_value}. Error: {e}",
                exc_info=True  # Include stack trace in logs
            )
            send_to_dlq(message_value, error_reason, str(e))

    def consume_messages(self) -> None:
        """
        Starts the consumer loop to continuously poll for and process messages.
        The loop will terminate gracefully upon receiving a SIGINT or SIGTERM signal.
        """
        if not self.consumer:
            logger.error("Consumer not initialized. Cannot start consumption.")
            return

        logger.info("Starting transaction event consumer loop...")
        try:
            while self.running:
                # Poll for messages with a timeout to allow the loop to check the `running` flag
                messages = self.consumer.poll(timeout_ms=1000)
                if not messages:
                    continue

                for topic_partition, records in messages.items():
                    for message in records:
                        if not self.running:
                            break
                        self._process_message(message.value)
                    if not self.running:
                        break
        except Exception as e:
            logger.critical(f"Critical error in consumer loop: {e}", exc_info=True)
        finally:
            logger.info("Closing Kafka consumer.")
            self.consumer.close()
            logger.info("Consumer closed. Exiting.")

def main():
    """Main function to instantiate and run the Kafka consumer."""
    consumer = TransactionEventConsumer()
    consumer.consume_messages()

if __name__ == "__main__":
    main()