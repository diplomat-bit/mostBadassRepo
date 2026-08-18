// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/compliance_screen_media_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["ComplianceScreenMediaResponse"]


class ComplianceScreenMediaResponse(BaseModel):
    negative_news_links: Optional[List[str]] = FieldInfo(alias="negativeNewsLinks", default=None)

    sentiment_score: Optional[float] = FieldInfo(alias="sentimentScore", default=None)
