// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/corporate/treasury/cash_flow_forecast_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from pydantic import Field as FieldInfo

from ...._models import BaseModel

__all__ = ["CashFlowForecastResponse"]


class CashFlowForecastResponse(BaseModel):
    inflow_forecast: object = FieldInfo(alias="inflowForecast")
    """Forecast of cash inflows by source."""

    outflow_forecast: object = FieldInfo(alias="outflowForecast")
    """Forecast of cash outflows by category."""
