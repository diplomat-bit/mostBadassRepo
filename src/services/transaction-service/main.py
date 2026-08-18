// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/transaction-service/main.py
================================================================================

"""
main.py

The main entry point for the Hyper-Integrated Transaction Service.

This service acts as the central nervous system for all transaction-related data,
designed for extreme extensibility and integration with a multitude of third-party
services. It ingests raw transaction data, processes it through a pipeline of
enrichment services, and exposes powerful APIs for analytics and further use.

Core Architectural Principles:
- Asynchronous First: Built on FastAPI and Starlette for high-performance, non-blocking I/O.
- Extensible & Pluggable: Designed with clear interfaces for adding new data sources (e.g., Plaid, Stripe, Finicity),
  enrichment providers (e.g., Google Places, internal ML models), and cloud integrations (AWS, GCP, Azure).
- Secure by Design: Includes robust authentication and authorization hooks, ready for integration with
  providers like Auth0, Okta, or custom JWT solutions.
- Cloud-Native: Configuration-driven and ready for containerization and deployment on any cloud platform.
"""

import os
import logging
import uuid
from datetime import datetime
from typing import List, Optional, Any, Dict
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status, Request, BackgroundTasks, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from sqlalchemy import create_engine, Column, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError

# --- 1. Configuration Management ---
# Manages all environment variables for the service, providing a single source of truth.
# This is crucial for integrating with various services, as each will have its own set of credentials.

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # Service Configuration
    APP_NAME: str = "Hyper-Integrated Transaction Service"
    APP_VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    LOG_LEVEL: str = "INFO"

    # Database Configuration (using in-memory SQLite for demo, switch to PostgreSQL in production)
    # Example for PostgreSQL: "postgresql+asyncpg://user:password@host:port/dbname"
    DATABASE_URL: str = "sqlite:///./transactions.db"

    # Security & Authentication
    # In a real app, these would be complex secrets managed by a secret manager (e.g., AWS Secrets Manager, GCP Secret Manager)
    API_SECRET_KEY: str = "default_super_secret_key_change_me"
    AUTH0_DOMAIN: Optional[str] = None
    AUTH0_API_AUDIENCE: Optional[str] = None
    ALGORITHMS: List[str] = ["RS256"]

    # Plaid Integration (Example)
    PLAID_CLIENT_ID: Optional[str] = None
    PLAID_SECRET: Optional[str] = None
    PLAID_ENV: str = "sandbox"

    # AWS Integration (Example)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_TRANSACTION_ATTACHMENTS: str = "transaction-attachments-bucket"
    SQS_ENRICHMENT_QUEUE_URL: str = "https://sqs.us-east-1.amazonaws.com/123456789012/enrichment-queue"

    # GCP Integration (Example)
    GCP_PROJECT_ID: Optional[str] = None
    GCP_PUBSUB_TOPIC_TRANSACTION_EVENTS: str = "projects/my-gcp-project/topics/transaction-events"
    GCP_STORAGE_BUCKET_REPORTS: str = "gcp-transaction-reports-bucket"

    # CORS Origins
    CORS_ORIGINS: List[str] = ["*"] # Should be restricted in production

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra='ignore')

settings = Settings()

# --- 2. Logging Setup ---
# Centralized, structured logging is essential for observability in a distributed system.
logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

# --- 3. Database Setup ---
# Using SQLAlchemy for ORM. This setup is for a synchronous SQLite DB for simplicity.
# For production, this would be configured for an async driver like asyncpg for PostgreSQL.
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} # Needed for SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Model
class Transaction(Base):
    __tablename__ = "transactions"

    id: str = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: str = Column(String, index=True, nullable=False)
    account_id: str = Column(String, index=True, nullable=False)
    amount: float = Column(Float, nullable=False)
    currency: str = Column(String(3), nullable=False)
    description: str = Column(String, nullable=False)
    original_description: str = Column(String)
    merchant_name: Optional[str] = Column(String, index=True, nullable=True)
    category: Optional[str] = Column(String, index=True, nullable=True)
    transaction_date: datetime = Column(DateTime, nullable=False)
    created_at: datetime = Column(DateTime, default=datetime.utcnow)
    updated_at: datetime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    source: str = Column(String, nullable=False, default="manual") # e.g., "plaid", "stripe", "manual"
    metadata_: str = Column(Text, name="metadata", nullable=True) # JSON as string

# Pydantic Schemas (for API request/response validation)
class TransactionBase(BaseModel):
    user_id: str
    account_id: str
    amount: float
    currency: str = "USD"
    description: str
    transaction_date: datetime

class TransactionCreate(TransactionBase):
    source: Optional[str] = "manual"

class TransactionUpdate(BaseModel):
    description: Optional[str] = None
    category: Optional[str] = None
    merchant_name: Optional[str] = None

class TransactionRead(TransactionBase):
    id: str
    original_description: Optional[str] = None
    merchant_name: Optional[str] = None
    category: Optional[str] = None
    source: str
    created_at: datetime
    updated_at: datetime
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# --- 4. Lifespan Management & Dependencies ---

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info(f"Starting up {settings.APP_NAME} v{settings.APP_VERSION}...")
    logger.info("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    # Here you would initialize connections to other services:
    # - Plaid client
    # - AWS SDK clients (S3, SQS)
    # - GCP SDK clients (Pub/Sub, Storage)
    # - Redis cache connection pool
    yield
    # Shutdown logic
    logger.info("Shutting down service...")
    # Clean up connections here

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency for simple API Key authentication
# This is a placeholder for a more robust JWT-based system (e.g., with Auth0)
async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != settings.API_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
    return x_api_key

# --- 5. FastAPI Application Initialization ---

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="A hyper-extensible service for ingesting, enriching, and analyzing financial transactions.",
    lifespan=lifespan,
)

# --- 6. Middleware ---

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 7. Custom Exception Handlers ---

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error", "errors": exc.errors()},
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error on request {request.method} {request.url}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal database error occurred."},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on request {request.method} {request.url}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected internal server error occurred."},
    )

# --- 8. Background Task & Service Stubs ---
# These functions simulate interactions with external services.

async def trigger_aws_enrichment_pipeline(transaction_id: str):
    """
    Placeholder: Sends a message to an AWS SQS queue to trigger an enrichment workflow.
    This workflow could be a Lambda function or a Step Function that:
    1. Fetches transaction details.
    2. Calls a merchant identification service.
    3. Uses a machine learning model for categorization.
    4. Calls Google Places API for location data.
    5. Updates the transaction record in the database.
    """
    logger.info(f"[AWS SQS] Enqueuing transaction {transaction_id} for enrichment.")
    # In a real app:
    # import boto3
    # sqs = boto3.client('sqs', region_name=settings.AWS_REGION)
    # sqs.send_message(QueueUrl=settings.SQS_ENRICHMENT_QUEUE_URL, MessageBody={'transaction_id': transaction_id})
    await asyncio.sleep(0.1) # Simulate network latency
    logger.info(f"[AWS SQS] Successfully enqueued transaction {transaction_id}.")


async def publish_gcp_transaction_event(event_type: str, transaction_data: dict):
    """
    Placeholder: Publishes an event to a GCP Pub/Sub topic.
    This is useful for a fan-out architecture where multiple services might need to react
    to transaction events (e.g., fraud detection, real-time analytics, user notifications).
    """
    logger.info(f"[GCP Pub/Sub] Publishing event '{event_type}' for transaction {transaction_data.get('id')}.")
    # In a real app:
    # from google.cloud import pubsub_v1
    # publisher = pubsub_v1.PublisherClient()
    # topic_path = publisher.topic_path(settings.GCP_PROJECT_ID, settings.GCP_PUBSUB_TOPIC_TRANSACTION_EVENTS)
    # data = json.dumps({'event_type': event_type, 'payload': transaction_data}).encode("utf-8")
    # future = publisher.publish(topic_path, data)
    # future.result()
    await asyncio.sleep(0.1) # Simulate network latency
    logger.info(f"[GCP Pub/Sub] Successfully published event '{event_type}'.")


# --- 9. API Routers ---
# Splitting endpoints into routers makes the application more modular.

# --- Transactions Router (Core CRUD) ---
transactions_router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
    dependencies=[Depends(verify_api_key)],
)

@transactions_router.post("/", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction: TransactionCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Create a new transaction. This endpoint is the primary entry point for new data.

    Upon creation, it triggers background tasks for:
    - **Enrichment**: via an AWS SQS-based pipeline.
    - **Event Publishing**: via GCP Pub/Sub for downstream consumers.
    """
    db_transaction = Transaction(
        **transaction.model_dump(),
        id=str(uuid.uuid4()),
        original_description=transaction.description
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    logger.info(f"Created transaction {db_transaction.id} for user {db_transaction.user_id}")

    # Trigger asynchronous post-processing and integrations
    background_tasks.add_task(trigger_aws_enrichment_pipeline, db_transaction.id)
    background_tasks.add_task(publish_gcp_transaction_event, "TRANSACTION_CREATED", TransactionRead.from_orm(db_transaction).model_dump())

    return db_transaction

@transactions_router.get("/{transaction_id}", response_model=TransactionRead)
def read_transaction(transaction_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a single transaction by its ID.
    """
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

@transactions_router.get("/user/{user_id}", response_model=List[TransactionRead])
def read_user_transactions(user_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all transactions for a specific user, with pagination.
    """
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).offset(skip).limit(limit).all()
    return transactions

# --- Ingestion Router (For Webhooks from 3rd parties like Plaid) ---
ingestion_router = APIRouter(
    prefix="/ingest",
    tags=["Ingestion"],
)

@ingestion_router.post("/plaid-webhook")
async def handle_plaid_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Handles incoming webhooks from Plaid.
    This is a critical integration point for automatically syncing transaction data.
    It needs to be highly available and process data asynchronously.
    """
    # IMPORTANT: In production, you MUST verify the webhook signature.
    # https://plaid.com/docs/api/webhooks/#validating-webhooks

    payload = await request.json()
    webhook_type = payload.get("webhook_type")
    webhook_code = payload.get("webhook_code")

    logger.info(f"Received Plaid webhook: {webhook_type} - {webhook_code}")

    if webhook_type == "TRANSACTIONS":
        if webhook_code in ["INITIAL_UPDATE", "HISTORICAL_UPDATE", "DEFAULT_UPDATE"]:
            # Fetch new transactions from Plaid API and add them to the DB
            # This would be a background task to avoid blocking the webhook response
            item_id = payload.get("item_id")
            new_transactions_count = payload.get("new_transactions")
            logger.info(f"Processing {new_transactions_count} new transactions for item {item_id}")
            # background_tasks.add_task(sync_plaid_transactions, item_id)
        elif webhook_code == "TRANSACTIONS_REMOVED":
            # Handle removed transactions
            removed_transaction_ids = payload.get("removed_transactions", [])
            logger.info(f"Processing {len(removed_transaction_ids)} removed transactions.")
            # background_tasks.add_task(remove_plaid_transactions, removed_transaction_ids)

    return {"status": "received"}


# --- 10. Register Routers with the App ---

app.include_router(transactions_router, prefix=settings.API_V1_STR)
app.include_router(ingestion_router, prefix=settings.API_V1_STR)


# --- 11. Root and Health Check Endpoints ---

@app.get("/", tags=["Root"])
async def read_root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "documentation": "/docs",
        "message": "Welcome to the future of financial data integration."
    }

@app.get("/health", tags=["Health Check"], status_code=status.HTTP_200_OK)
async def health_check(db: Session = Depends(get_db)):
    """
    Performs a health check of the service and its dependencies.
    """
    try:
        # Check database connection
        db.execute('SELECT 1')
        db_status = "ok"
    except Exception as e:
        logger.error(f"Health check failed: Database connection error: {e}")
        db_status = "error"
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database connection failed")

    # In a real system, you'd also check connections to:
    # - Redis cache
    # - Plaid API
    # - AWS/GCP services
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "dependencies": {
            "database": db_status,
            "plaid_api": "not_checked", # Placeholder
            "aws_sqs": "not_checked",   # Placeholder
            "gcp_pubsub": "not_checked" # Placeholder
        }
    }

# --- 12. Main Execution Block ---

if __name__ == "__main__":
    # This block allows running the server directly for development.
    # For production, a process manager like Gunicorn or Uvicorn's CLI is used.
    # Example: uvicorn src.services.transaction-service.main:app --host 0.0.0.0 --port 8000 --reload
    import asyncio
    logger.info("Starting Uvicorn server for development...")
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")