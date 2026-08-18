// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/transactions/insight_get_spending_trends_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["InsightGetSpendingTrendsResponse"]


class InsightGetSpendingTrendsResponse(BaseModel):
    ai_narrative: Optional[str] = FieldInfo(alias="aiNarrative", default=None)

    anomalies_detected: Optional[int] = FieldInfo(alias="anomaliesDetected", default=None)

    overall_trend: Optional[str] = FieldInfo(alias="overallTrend", default=None)
