// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/ad_optimize_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["AdOptimizeResponse"]


class AdOptimizeResponse(BaseModel):
    suggested_changes: Optional[List[str]] = FieldInfo(alias="suggestedChanges", default=None)
