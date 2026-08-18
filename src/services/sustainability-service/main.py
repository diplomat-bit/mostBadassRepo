// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/sustainability-service/main.py
================================================================================

# Standard library imports
import os
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4

# Third-party imports
from fastapi import FastAPI, Depends, HTTPException, status, Request, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl
from sqlalchemy.orm import Session
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from prometheus_fastapi_instrumentator import Instrumentator

# Local application imports
# These would be in separate files in a real project structure,
# but for this single-file generation, we'll define them here.

# --- Configuration ---
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings."""
    APP_NAME: str = "Sustainability Service"
    APP_VERSION: str = "0.1.0"
    LOG_LEVEL: str = "INFO"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/sustainability_db")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "