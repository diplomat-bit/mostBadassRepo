// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/payments/international_get_status_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from ..._models import BaseModel

__all__ = ["InternationalGetStatusResponse"]


class InternationalGetStatusResponse(BaseModel):
    fx_rate: Optional[float] = None

    status: Optional[str] = None
