// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/lending/decision_get_rationale_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["DecisionGetRationaleResponse"]


class DecisionGetRationaleResponse(BaseModel):
    approved: Optional[bool] = None

    next_steps: Optional[str] = FieldInfo(alias="nextSteps", default=None)

    reasoning_nodes: Optional[List[str]] = FieldInfo(alias="reasoningNodes", default=None)

    risk_vector_analysis: Optional[object] = FieldInfo(alias="riskVectorAnalysis", default=None)
