// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/transactions/recurring_create_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, TypedDict

__all__ = ["RecurringCreateParams"]


class RecurringCreateParams(TypedDict, total=False):
    amount: Required[float]

    category: Required[str]

    frequency: Required[str]
