// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/transaction_categorize_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, Annotated, TypedDict

from .._utils import PropertyInfo

__all__ = ["TransactionCategorizeParams"]


class TransactionCategorizeParams(TypedDict, total=False):
    category: Required[str]

    apply_to_future: Annotated[bool, PropertyInfo(alias="applyToFuture")]

    notes: str
