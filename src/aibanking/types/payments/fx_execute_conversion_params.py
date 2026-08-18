// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/payments/fx_execute_conversion_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, Annotated, TypedDict

from ..._utils import PropertyInfo

__all__ = ["FxExecuteConversionParams"]


class FxExecuteConversionParams(TypedDict, total=False):
    amount: Required[float]

    from_: Required[Annotated[str, PropertyInfo(alias="from")]]

    to: Required[str]
