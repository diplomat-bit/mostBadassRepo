// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/treasury/sweeping_configure_rules_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Literal, Required, Annotated, TypedDict

from ...._utils import PropertyInfo

__all__ = ["SweepingConfigureRulesParams"]


class SweepingConfigureRulesParams(TypedDict, total=False):
    source_account: Required[Annotated[str, PropertyInfo(alias="sourceAccount")]]

    target_account: Required[Annotated[str, PropertyInfo(alias="targetAccount")]]

    threshold: Required[float]

    frequency: Literal["daily", "weekly", "monthly"]
