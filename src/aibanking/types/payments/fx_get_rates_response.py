// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/payments/fx_get_rates_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional
from datetime import datetime

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["FxGetRatesResponse"]


class FxGetRatesResponse(BaseModel):
    mid_rate: Optional[float] = FieldInfo(alias="midRate", default=None)

    timestamp: Optional[datetime] = None
