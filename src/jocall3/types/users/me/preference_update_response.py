// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/users/me/preference_update_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ...._models import BaseModel

__all__ = ["PreferenceUpdateResponse", "NotificationChannels"]


class NotificationChannels(BaseModel):
    """Preferred channels for receiving notifications."""

    email: Optional[bool] = None

    in_app: Optional[bool] = FieldInfo(alias="inApp", default=None)

    push: Optional[bool] = None

    sms: Optional[bool] = None


class PreferenceUpdateResponse(BaseModel):
    """User's personalized preferences for the platform."""

    ai_interaction_mode: Optional[str] = FieldInfo(alias="aiInteractionMode", default=None)

    data_sharing_consent: Optional[bool] = FieldInfo(alias="dataSharingConsent", default=None)

    notification_channels: Optional[NotificationChannels] = FieldInfo(alias="notificationChannels", default=None)
    """Preferred channels for receiving notifications."""

    preferred_language: Optional[str] = FieldInfo(alias="preferredLanguage", default=None)

    theme: Optional[str] = None

    transaction_grouping: Optional[str] = FieldInfo(alias="transactionGrouping", default=None)
