// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/treasury/liquidity_optimize_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Annotated, TypedDict

from ...._utils import PropertyInfo

__all__ = ["LiquidityOptimizeParams"]


class LiquidityOptimizeParams(TypedDict, total=False):
    sweep_excess: Annotated[bool, PropertyInfo(alias="sweepExcess")]

    target_reserve: Annotated[float, PropertyInfo(alias="targetReserve")]
