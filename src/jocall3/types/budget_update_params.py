// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/budget_update_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Annotated, TypedDict

from .._utils import PropertyInfo

__all__ = ["BudgetUpdateParams"]


class BudgetUpdateParams(TypedDict, total=False):
    alert_threshold: Annotated[int, PropertyInfo(alias="alertThreshold")]

    total_amount: Annotated[float, PropertyInfo(alias="totalAmount")]
