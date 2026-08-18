// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/investments/performance_get_historical_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Literal, TypedDict

__all__ = ["PerformanceGetHistoricalParams"]


class PerformanceGetHistoricalParams(TypedDict, total=False):
    range: Literal["1m", "3m", "1y", "5y", "max"]
