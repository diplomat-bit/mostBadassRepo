// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/accounts/overdraft_setting_update_overdraft_settings_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Annotated, TypedDict

from ..._utils import PropertyInfo

__all__ = ["OverdraftSettingUpdateOverdraftSettingsParams"]


class OverdraftSettingUpdateOverdraftSettingsParams(TypedDict, total=False):
    enabled: bool

    fee_preference: Annotated[str, PropertyInfo(alias="feePreference")]

    link_to_savings: Annotated[bool, PropertyInfo(alias="linkToSavings")]
