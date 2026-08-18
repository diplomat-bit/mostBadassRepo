// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/account_link_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, Annotated, TypedDict

from .._utils import PropertyInfo

__all__ = ["AccountLinkParams"]


class AccountLinkParams(TypedDict, total=False):
    institution_id: Required[Annotated[str, PropertyInfo(alias="institutionId")]]

    public_token: Required[Annotated[str, PropertyInfo(alias="publicToken")]]
