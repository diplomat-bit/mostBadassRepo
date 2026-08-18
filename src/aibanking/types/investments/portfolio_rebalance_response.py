// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/investments/portfolio_rebalance_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["PortfolioRebalanceResponse"]


class PortfolioRebalanceResponse(BaseModel):
    impact_summary: Optional[str] = FieldInfo(alias="impactSummary", default=None)

    rebalance_id: Optional[str] = FieldInfo(alias="rebalanceId", default=None)
