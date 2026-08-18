// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/transaction_split_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing import Iterable
from typing_extensions import Required, TypedDict

__all__ = ["TransactionSplitParams", "Split"]


class TransactionSplitParams(TypedDict, total=False):
    splits: Required[Iterable[Split]]


class Split(TypedDict, total=False):
    amount: float

    category: str
