// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/transaction_list_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Annotated, TypedDict

from .._utils import PropertyInfo

__all__ = ["TransactionListParams"]


class TransactionListParams(TypedDict, total=False):
    limit: int

    max_amount: Annotated[float, PropertyInfo(alias="maxAmount")]

    min_amount: Annotated[float, PropertyInfo(alias="minAmount")]

    offset: int

    type: str
