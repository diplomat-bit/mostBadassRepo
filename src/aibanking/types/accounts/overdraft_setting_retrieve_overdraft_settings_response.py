// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/accounts/overdraft_setting_retrieve_overdraft_settings_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["OverdraftSettingRetrieveOverdraftSettingsResponse"]


class OverdraftSettingRetrieveOverdraftSettingsResponse(BaseModel):
    enabled: Optional[bool] = None

    fee_preference: Optional[str] = FieldInfo(alias="feePreference", default=None)

    limit: Optional[float] = None
