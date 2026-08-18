// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/compliance_screen_media_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Literal, Required, TypedDict

__all__ = ["ComplianceScreenMediaParams"]


class ComplianceScreenMediaParams(TypedDict, total=False):
    query: Required[str]

    depth: Literal["shallow", "deep"]
