// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/payments/fx_retrieve_rates_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Annotated, TypedDict

from ..._utils import PropertyInfo

__all__ = ["FxRetrieveRatesParams"]


class FxRetrieveRatesParams(TypedDict, total=False):
    base_currency: Annotated[str, PropertyInfo(alias="baseCurrency")]
    """The base currency code (e.g., USD)."""

    forecast_days: Annotated[int, PropertyInfo(alias="forecastDays")]
    """Number of days into the future to provide an AI-driven prediction."""

    target_currency: Annotated[str, PropertyInfo(alias="targetCurrency")]
    """The target currency code (e.g., EUR)."""
