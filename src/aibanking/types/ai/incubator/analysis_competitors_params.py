// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/incubator/analysis_competitors_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, TypedDict

__all__ = ["AnalysisCompetitorsParams"]


class AnalysisCompetitorsParams(TypedDict, total=False):
    industry: Required[str]

    niche: Required[str]
