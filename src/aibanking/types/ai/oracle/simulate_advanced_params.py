// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/oracle/simulate_advanced_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing import Iterable
from typing_extensions import Required, TypedDict

__all__ = ["SimulateAdvancedParams", "Scenario"]


class SimulateAdvancedParams(TypedDict, total=False):
    prompt: Required[str]

    scenarios: Required[Iterable[Scenario]]


class Scenario(TypedDict, total=False):
    name: Required[str]

    description: str
