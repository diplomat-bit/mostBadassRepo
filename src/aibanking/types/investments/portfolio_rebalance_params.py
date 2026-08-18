// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/investments/portfolio_rebalance_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Literal, Annotated, TypedDict

from ..._utils import PropertyInfo

__all__ = ["PortfolioRebalanceParams"]


class PortfolioRebalanceParams(TypedDict, total=False):
    execution_mode: Annotated[Literal["AUTO", "CONFIRM_ONLY"], PropertyInfo(alias="executionMode")]
