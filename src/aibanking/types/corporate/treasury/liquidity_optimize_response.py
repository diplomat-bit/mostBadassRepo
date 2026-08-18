// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/treasury/liquidity_optimize_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ...._models import BaseModel

__all__ = ["LiquidityOptimizeResponse"]


class LiquidityOptimizeResponse(BaseModel):
    projected_yield: Optional[float] = FieldInfo(alias="projectedYield", default=None)

    strategy_id: Optional[str] = FieldInfo(alias="strategyId", default=None)
