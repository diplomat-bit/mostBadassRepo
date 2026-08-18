// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/system/sandbox_simulate_error_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, Annotated, TypedDict

from ..._utils import PropertyInfo

__all__ = ["SandboxSimulateErrorParams"]


class SandboxSimulateErrorParams(TypedDict, total=False):
    error_code: Required[Annotated[int, PropertyInfo(alias="errorCode")]]
