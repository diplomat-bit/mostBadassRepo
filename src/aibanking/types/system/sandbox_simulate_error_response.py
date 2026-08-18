// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/system/sandbox_simulate_error_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional
from datetime import datetime

from ..._models import BaseModel

__all__ = ["SandboxSimulateErrorResponse"]


class SandboxSimulateErrorResponse(BaseModel):
    code: str

    message: str

    timestamp: Optional[datetime] = None
