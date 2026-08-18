// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/users/me/preference_update_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Annotated, TypedDict

from ...._utils import PropertyInfo

__all__ = ["PreferenceUpdateParams"]


class PreferenceUpdateParams(TypedDict, total=False):
    ai_interaction_mode: Annotated[str, PropertyInfo(alias="aiInteractionMode")]

    theme: str
