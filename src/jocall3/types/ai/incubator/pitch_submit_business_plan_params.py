// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/ai/incubator/pitch_submit_business_plan_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, Annotated, TypedDict

from ...._utils import PropertyInfo

__all__ = ["PitchSubmitBusinessPlanParams"]


class PitchSubmitBusinessPlanParams(TypedDict, total=False):
    financial_projections: Required[Annotated[object, PropertyInfo(alias="financialProjections")]]
    """Key financial metrics and projections for the next 3-5 years."""
