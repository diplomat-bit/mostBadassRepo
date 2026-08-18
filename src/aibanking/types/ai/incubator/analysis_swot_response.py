// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/incubator/analysis_swot_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from ...._models import BaseModel

__all__ = ["AnalysisSwotResponse"]


class AnalysisSwotResponse(BaseModel):
    strengths: Optional[List[str]] = None

    weaknesses: Optional[List[str]] = None
