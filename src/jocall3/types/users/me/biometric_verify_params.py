// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/users/me/biometric_verify_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, Annotated, TypedDict

from ...._utils import PropertyInfo

__all__ = ["BiometricVerifyParams"]


class BiometricVerifyParams(TypedDict, total=False):
    biometric_signature: Required[Annotated[str, PropertyInfo(alias="biometricSignature")]]

    biometric_type: Required[Annotated[str, PropertyInfo(alias="biometricType")]]

    device_id: Required[Annotated[str, PropertyInfo(alias="deviceId")]]
