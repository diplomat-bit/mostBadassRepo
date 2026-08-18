// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/payments/fx_retrieve_rates_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["FxRetrieveRatesResponse"]


class FxRetrieveRatesResponse(BaseModel):
    current_rate: object = FieldInfo(alias="currentRate")
    """Real-time foreign exchange rates."""

    historical_volatility: Optional[object] = FieldInfo(alias="historicalVolatility", default=None)
