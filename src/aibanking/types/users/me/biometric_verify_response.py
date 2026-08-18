// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/users/me/biometric_verify_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ...._models import BaseModel

__all__ = ["BiometricVerifyResponse"]


class BiometricVerifyResponse(BaseModel):
    verification_status: Optional[str] = FieldInfo(alias="verificationStatus", default=None)
