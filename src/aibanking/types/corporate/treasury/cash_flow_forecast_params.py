// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/treasury/cash_flow_forecast_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Annotated, TypedDict

from ...._utils import PropertyInfo

__all__ = ["CashFlowForecastParams"]


class CashFlowForecastParams(TypedDict, total=False):
    horizon_days: Annotated[int, PropertyInfo(alias="horizonDays")]
