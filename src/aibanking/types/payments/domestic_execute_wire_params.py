// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/payments/domestic_execute_wire_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, TypedDict

__all__ = ["DomesticExecuteWireParams"]


class DomesticExecuteWireParams(TypedDict, total=False):
    account: Required[str]

    amount: Required[float]

    routing: Required[str]
