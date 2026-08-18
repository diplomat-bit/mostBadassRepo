// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/accounts/overdraft_setting_update_overdraft_settings_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import TypedDict

__all__ = ["OverdraftSettingUpdateOverdraftSettingsParams"]


class OverdraftSettingUpdateOverdraftSettingsParams(TypedDict, total=False):
    enabled: bool

    limit: float
