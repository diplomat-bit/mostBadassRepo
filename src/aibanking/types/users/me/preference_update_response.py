// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/users/me/preference_update_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ...._models import BaseModel

__all__ = ["PreferenceUpdateResponse"]


class PreferenceUpdateResponse(BaseModel):
    ai_interaction_mode: Optional[str] = FieldInfo(alias="aiInteractionMode", default=None)

    theme: Optional[str] = None
