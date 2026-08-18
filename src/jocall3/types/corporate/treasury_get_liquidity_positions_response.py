// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/corporate/treasury_get_liquidity_positions_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["TreasuryGetLiquidityPositionsResponse"]


class TreasuryGetLiquidityPositionsResponse(BaseModel):
    ai_liquidity_assessment: object = FieldInfo(alias="aiLiquidityAssessment")
    """AI's overall assessment of liquidity."""

    short_term_investments: object = FieldInfo(alias="shortTermInvestments")
    """Details on short-term investments contributing to liquidity."""
