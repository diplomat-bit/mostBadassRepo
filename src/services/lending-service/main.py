// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/lending-service/main.py
================================================================================

"""
main.py

The main entry point for the Lending Service.

This service orchestrates the entire loan application lifecycle, from initial submission
to underwriting, offer generation, and acceptance. It is designed with a microservices
architecture in mind, integrating with a wide array of external and internal services
to provide a comprehensive and value-added lending platform.

Core Responsibilities:
- Expose a secure RESTful API for clients (web/mobile) to manage loan applications.
- Authenticate and authorize users via Auth0.
- Integrate with Plaid for secure financial data aggregation.
- Trigger and manage underwriting workflows (potentially via ML models on GCP/AWS).
- Interact with credit bureau APIs for credit history checks.
- Manage document uploads securely using cloud storage (AWS S3 / Google Cloud Storage).
- Store and retrieve application data from a central database (e.g., PostgreSQL).
- Communicate application status updates to users via notification services (e.g., Twilio, SendGrid).
- Provide robust logging, monitoring, and tracing for observability.
"""

import os
import uuid
from datetime import datetime, timedelta
from enum import Enum
from typing import List, Optional, Dict, Any

import boto3
import httpx
import uvicorn
from boto3.exceptions import Boto3Error
from fastapi import (FastAPI, Depends, HTTPException, status, Request, File,
                     UploadFile)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from pydantic import BaseModel, Field, HttpUrl, EmailStr, validator
from pydantic_settings import BaseSettings
from sqlalchemy import (create_engine, Column, String, Float, DateTime,
                        ForeignKey, Enum as SQLAlchemyEnum)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.exc import SQLAlchemyError

# ==============================================================================
# 1. Configuration Management (using Pydantic BaseSettings)
# ==============================================================================
# Loads configuration from environment variables. This is crucial for security
# and deployment flexibility across different environments (dev, staging, prod).

class Settings(BaseSettings):
    """Application configuration settings."""
    PROJECT_NAME: str = "Lending Service"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql://user:password@localhost/lending_db"
    
    # Security & Authentication (Auth0)
    AUTH0_DOMAIN: str
    AUTH0_API_AUDIENCE: str
    AUTH0_ALGORITHMS: str = "RS256"
    
    # Plaid Integration
    PLAID_CLIENT_ID: str
    PLAID_SECRET: str
    PLAID_ENVIRONMENT: str = "sandbox"  # sandbox, development, or production
    
    # AWS Integration (for S3 document storage)
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: str
    S3_PRESIGNED_URL_EXPIRATION: int = 3600  # in seconds
    
    # Credit Bureau API (Mocked for this example)
    CREDIT_BUREAU_API_KEY: str
    CREDIT_BUREAU_API_URL: str = "https://api.mockcreditbureau.com/v1/scores"
    
    # Notification Service (e.g., Twilio)
    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_PHONE_NUMBER: str
    
    # Celery for Background Tasks
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()

# ==============================================================================
# 2. Database Setup (SQLAlchemy ORM)
# ==============================================================================
# Establishes connection to the database and defines data models.

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ApplicationStatus(str, Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDERWRITING = "UNDERWRITING"
    AWAITING_DOCUMENTS = "AWAITING_DOCUMENTS"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    FUNDS_DISBURSED = "FUNDS_DISBURSED"

class LoanApplication(Base):
    __tablename__ = "loan_applications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, index=True, nullable=False) # From Auth0 JWT 'sub'
    status = Column(SQLAlchemyEnum(ApplicationStatus), default=ApplicationStatus.DRAFT, nullable=False)
    amount_requested = Column(Float, nullable=False)
    loan_purpose = Column(String, nullable=False)
    plaid_item_id = Column(String, unique=True, index=True)
    plaid_access_token = Column(String) # Encrypt this in a real production system
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    offers = relationship("LoanOffer", back_populates="application")

class LoanOffer(Base):
    __tablename__ = "loan_offers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False)
    amount_offered = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    term_months = Column(Integer, nullable=False)
    monthly_payment = Column(Float, nullable=False)
    is_accepted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    application = relationship("LoanApplication", back_populates="offers")

# In a real project, run migrations (e.g., with Alembic) instead of this.
# Base.metadata.create_all(bind=engine)

def get_db():
    """FastAPI dependency to get a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==============================================================================
# 3. Pydantic Models (API Data Contracts)
# ==============================================================================

class TokenData(BaseModel):
    sub: str = Field(..., alias="sub")

class LoanApplicationCreate(BaseModel):
    amount_requested: float = Field(..., gt=0, description="The desired loan amount.")
    loan_purpose: str = Field(..., min_length=10, max_length=200, description="The purpose of the loan.")
    plaid_public_token: str = Field(..., description="The public token from Plaid Link.")

class LoanApplicationResponse(BaseModel):
    id: uuid.UUID
    user_id: str
    status: ApplicationStatus
    amount_requested: float
    loan_purpose: str
    created_at: datetime

    class Config:
        orm_mode = True

class LoanOfferResponse(BaseModel):
    id: uuid.UUID
    amount_offered: float
    interest_rate: float
    term_months: int
    monthly_payment: float
    
    class Config:
        orm_mode = True

class DocumentUploadResponse(BaseModel):
    file_id: str
    upload_url: HttpUrl
    bucket: str

# ==============================================================================
# 4. Security & Authentication (Auth0 Integration)
# ==============================================================================

class Auth0HTTPBearer:
    """Dependency to validate Auth0 JWTs."""
    def __init__(self, auto_error: bool = True):
        self.auto_error = auto_error
        self.jwks_client = jwt.PyJWKClient(f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json")

    async def __call__(self, request: Request) -> Optional[TokenData]:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            if self.auto_error:
                raise credentials_exception
            return None
        
        token = auth_header.split(" ")[1]
        
        try:
            signing_key = self.jwks_client.get_signing_key_from_jwt(token).key
            payload = jwt.decode(
                token,
                signing_key,
                algorithms=[settings.AUTH0_ALGORITHMS],
                audience=settings.AUTH0_API_AUDIENCE,
                issuer=f"https://{settings.AUTH0_DOMAIN}/"
            )
            user_id: str = payload.get("sub")
            if user_id is None:
                raise credentials_exception
            return TokenData(sub=user_id)
        except JWTError:
            raise credentials_exception

auth_scheme = Auth0HTTPBearer()

# ==============================================================================
# 5. External Service Integrations (Clients & Mocks)
# ==============================================================================

class PlaidClient:
    """Client for interacting with the Plaid API."""
    def __init__(self):
        self.base_url = f"https://{settings.PLAID_ENVIRONMENT}.plaid.com"
        self.client = httpx.AsyncClient()
        self.headers = {
            "Content-Type": "application/json",
            "PLAID-CLIENT-ID": settings.PLAID_CLIENT_ID,
            "PLAID-SECRET": settings.PLAID_SECRET,
        }

    async def exchange_public_token(self, public_token: str) -> Dict[str, str]:
        """Exchanges a public token for an access token and item ID."""
        payload = {"public_token": public_token}
        response = await self.client.post(
            f"{self.base_url}/item/public_token/exchange",
            json=payload,
            headers=self.headers
        )
        response.raise_for_status()
        data = response.json()
        return {"access_token": data["access_token"], "item_id": data["item_id"]}

    async def get_transactions(self, access_token: str, start_date: str, end_date: str) -> Dict:
        """Fetches transaction data for a given item."""
        payload = {
            "access_token": access_token,
            "start_date": start_date,
            "end_date": end_date,
        }
        response = await self.client.post(
            f"{self.base_url}/transactions/get",
            json=payload,
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

class S3Client:
    """Client for interacting with AWS S3."""
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )

    def create_presigned_post(self, object_name: str, fields=None, conditions=None) -> Dict[str, Any]:
        """Generates a presigned URL for uploading a file directly to S3."""
        try:
            response = self.s3.generate_presigned_post(
                Bucket=settings.S3_BUCKET_NAME,
                Key=object_name,
                Fields=fields,
                Conditions=conditions,
                ExpiresIn=settings.S3_PRESIGNED_URL_EXPIRATION
            )
            return response
        except Boto3Error as e:
            # In a real app, log this error properly
            print(f"Error generating presigned URL: {e}")
            raise HTTPException(status_code=500, detail="Could not generate document upload URL.")

# Mock clients for services not fully implemented here
class MockCreditBureauClient:
    async def get_credit_score(self, user_id: str) -> int:
        # In a real scenario, this would make an API call with user PII
        # and return a real credit score.
        print(f"MOCK: Fetching credit score for user {user_id}")
        return 720  # Return a sample score

class MockNotificationClient:
    def send_sms(self, to_phone: str, message: str):
        # Mock integration with Twilio
        print(f"MOCK SMS to {to_phone}: {message}")
        # Real implementation would use the Twilio client library
        
# ==============================================================================
# 6. Background Task Definitions (Celery)
# ==============================================================================
# These tasks would be defined in a separate worker file but are shown here for context.

# from celery import Celery
# celery_app = Celery('tasks', broker=settings.CELERY_BROKER_URL, backend=settings.CELERY_RESULT_BACKEND)
# @celery_app.task
def run_underwriting_process(application_id: str):
    """
    A background task to perform underwriting.
    1. Fetch application data.
    2. Fetch financial data from Plaid.
    3. Fetch credit score from a credit bureau.
    4. Run data through the underwriting model (rules engine or ML).
    5. Generate loan offers or reject the application.
    6. Update application status in the database.
    7. Notify the user.
    """
    print(f"Starting underwriting for application: {application_id}")
    # ... complex logic would go here ...
    print(f"Finished underwriting for application: {application_id}")
    # Example: Update status to APPROVED and create an offer
    # db = SessionLocal()
    # application = db.query(LoanApplication).filter(LoanApplication.id == application_id).first()
    # if application:
    #     application.status = ApplicationStatus.APPROVED
    #     new_offer = LoanOffer(...)
    #     db.add(new_offer)
    #     db.commit()
    #     MockNotificationClient().send_sms(to_phone="+15551234567", message=f"Good news! You have new loan offers for application {application_id}.")
    # db.close()

# ==============================================================================
# 7. FastAPI Application & API Endpoints
# ==============================================================================

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A comprehensive lending service with extensive integrations.",
    version="1.0.0",
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
api_router = APIRouter(prefix=settings.API_V1_STR)

@api_router.post("/applications", response_model=LoanApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_loan_application(
    application_in: LoanApplicationCreate,
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(auth_scheme)
):
    """
    Create a new loan application.
    - Authenticates the user via Auth0 JWT.
    - Exchanges a Plaid public token for an access token.
    - Stores the initial application data.
    - Triggers a background underwriting task.
    """
    plaid_client = PlaidClient()
    try:
        token_exchange = await plaid_client.exchange_public_token(application_in.plaid_public_token)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Plaid API error: {e.response.text}")

    new_application = LoanApplication(
        user_id=token_data.sub,
        amount_requested=application_in.amount_requested,
        loan_purpose=application_in.loan_purpose,
        plaid_item_id=token_exchange["item_id"],
        plaid_access_token=token_exchange["access_token"], # TODO: Encrypt this
        status=ApplicationStatus.SUBMITTED
    )
    
    try:
        db.add(new_application)
        db.commit()
        db.refresh(new_application)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

    # Trigger the background underwriting process
    # In a real system, this would use Celery:
    # run_underwriting_process.delay(str(new_application.id))
    print(f"Triggering background underwriting for application ID: {new_application.id}")
    run_underwriting_process(str(new_application.id)) # Simulating the call for now

    return new_application


@api_router.get("/applications/{application_id}", response_model=LoanApplicationResponse)
def get_application_status(
    application_id: uuid.UUID,
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(auth_scheme)
):
    """
    Retrieve the status and details of a specific loan application.
    Ensures the user requesting the data is the owner of the application.
    """
    application = db.query(LoanApplication).filter(LoanApplication.id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    if application.user_id != token_data.sub:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this application")
        
    return application


@api_router.post("/applications/{application_id}/documents/upload-url", response_model=DocumentUploadResponse)
def get_document_upload_url(
    application_id: uuid.UUID,
    file_name: str,
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(auth_scheme)
):
    """
    Generates a pre-signed URL for a client to upload a document directly to S3.
    This prevents large files from being proxied through our service.
    """
    application = db.query(LoanApplication).filter(LoanApplication.id == application_id).first()
    if not application or application.user_id != token_data.sub:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found or access denied.")

    s3_client = S3Client()
    object_key = f"documents/{application_id}/{uuid.uuid4()}_{file_name}"
    
    response = s3_client.create_presigned_post(object_key)
    
    return DocumentUploadResponse(
        file_id=object_key,
        upload_url=response['url'],
        bucket=settings.S3_BUCKET_NAME
    )


@api_router.get("/applications/{application_id}/offers", response_model=List[LoanOfferResponse])
def get_loan_offers(
    application_id: uuid.UUID,
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(auth_scheme)
):
    """
    Retrieve generated loan offers for an approved application.
    """
    application = db.query(LoanApplication).filter(LoanApplication.id == application_id).first()
    
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    if application.user_id != token_data.sub:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this application")
        
    if application.status != ApplicationStatus.APPROVED:
        return [] # Or raise an error if offers are not ready

    return application.offers


@api_router.post("/offers/{offer_id}/accept", status_code=status.HTTP_204_NO_CONTENT)
def accept_loan_offer(
    offer_id: uuid.UUID,
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(auth_scheme)
):
    """
    Accept a specific loan offer. This is the final step before fund disbursement.
    """
    offer = db.query(LoanOffer).join(LoanApplication).filter(
        LoanOffer.id == offer_id,
        LoanApplication.user_id == token_data.sub
    ).first()

    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found or access denied.")

    if offer.application.status != ApplicationStatus.APPROVED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Application is not in an approved state.")

    # Mark this offer as accepted and potentially others as void
    offer.is_accepted = True
    offer.application.status = ApplicationStatus.FUNDS_DISBURSED
    db.commit()

    # Trigger fund disbursement workflow (another background task)
    print(f"Triggering fund disbursement for application {offer.application_id}")
    
    # Notify user of acceptance
    MockNotificationClient().send_sms(
        to_phone="+15551234567", # Should be fetched from user profile service
        message=f"Congratulations! You've accepted your loan offer. Funds will be disbursed shortly."
    )

    return

app.include_router(api_router)

# ==============================================================================
# 8. Main Entry Point
# ==============================================================================

if __name__ == "__main__":
    # This is for local development. For production, use a Gunicorn/Uvicorn process manager.
    print("Starting Lending Service...")
    print(f"Auth0 Domain: {settings.AUTH0_DOMAIN}")
    print(f"Plaid Environment: {settings.PLAID_ENVIRONMENT}")
    print(f"S3 Bucket: {settings.S3_BUCKET_NAME}")
    uvicorn.run(app, host="0.0.0.0", port=8000)