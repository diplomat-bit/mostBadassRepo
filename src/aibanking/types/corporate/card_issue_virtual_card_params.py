// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/card_issue_virtual_card_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, Annotated, TypedDict

from ..._utils import PropertyInfo

__all__ = ["CardIssueVirtualCardParams"]


class CardIssueVirtualCardParams(TypedDict, total=False):
    holder_name: Required[Annotated[str, PropertyInfo(alias="holderName")]]

    monthly_limit: Required[Annotated[float, PropertyInfo(alias="monthlyLimit")]]

    purpose: Required[str]

    metadata: object
