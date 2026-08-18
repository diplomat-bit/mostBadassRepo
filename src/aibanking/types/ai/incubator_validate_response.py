// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/incubator_validate_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["IncubatorValidateResponse"]


class IncubatorValidateResponse(BaseModel):
    critical_flaws: Optional[List[str]] = FieldInfo(alias="criticalFlaws", default=None)

    feasibility_score: Optional[float] = FieldInfo(alias="feasibilityScore", default=None)
