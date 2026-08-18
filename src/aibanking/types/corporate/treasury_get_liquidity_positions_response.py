// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/treasury_get_liquidity_positions_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from ..._models import BaseModel

__all__ = ["TreasuryGetLiquidityPositionsResponse"]


class TreasuryGetLiquidityPositionsResponse(BaseModel):
    positions: Optional[List[object]] = None

    total_liquidity: Optional[float] = None
