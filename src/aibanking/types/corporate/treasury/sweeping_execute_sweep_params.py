// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/treasury/sweeping_execute_sweep_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, Annotated, TypedDict

from ...._utils import PropertyInfo

__all__ = ["SweepingExecuteSweepParams"]


class SweepingExecuteSweepParams(TypedDict, total=False):
    rule_id: Required[Annotated[str, PropertyInfo(alias="ruleId")]]
