// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/anomaly_update_status_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Literal, Required, TypedDict

__all__ = ["AnomalyUpdateStatusParams"]


class AnomalyUpdateStatusParams(TypedDict, total=False):
    status: Required[Literal["dismissed", "investigating", "resolved"]]
