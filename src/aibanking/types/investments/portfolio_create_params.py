// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/investments/portfolio_create_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Literal, Required, Annotated, TypedDict

from ..._utils import PropertyInfo

__all__ = ["PortfolioCreateParams"]


class PortfolioCreateParams(TypedDict, total=False):
    name: Required[str]

    strategy: Required[Literal["GROWTH", "BALANCED", "INCOME", "ESG_FOCUSED"]]

    initial_allocation: Annotated[object, PropertyInfo(alias="initialAllocation")]
