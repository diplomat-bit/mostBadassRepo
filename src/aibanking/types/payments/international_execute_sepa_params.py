// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/payments/international_execute_sepa_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, TypedDict

__all__ = ["InternationalExecuteSepaParams"]


class InternationalExecuteSepaParams(TypedDict, total=False):
    amount: Required[float]

    iban: Required[str]
