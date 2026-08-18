// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/ai/oracle/simulate_run_advanced_simulation_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Annotated, TypedDict

from ...._utils import PropertyInfo

__all__ = ["SimulateRunAdvancedSimulationParams"]


class SimulateRunAdvancedSimulationParams(TypedDict, total=False):
    global_economic_factors: Annotated[object, PropertyInfo(alias="globalEconomicFactors")]
    """Optional: Global economic conditions to apply to all scenarios."""

    personal_assumptions: Annotated[object, PropertyInfo(alias="personalAssumptions")]
    """Optional: Personal financial assumptions to override defaults."""
