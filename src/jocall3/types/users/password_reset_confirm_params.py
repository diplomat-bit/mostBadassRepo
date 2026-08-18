// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/users/password_reset_confirm_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, Annotated, TypedDict

from ..._utils import PropertyInfo

__all__ = ["PasswordResetConfirmParams"]


class PasswordResetConfirmParams(TypedDict, total=False):
    identifier: Required[str]

    new_password: Required[Annotated[str, PropertyInfo(alias="newPassword")]]

    verification_code: Required[Annotated[str, PropertyInfo(alias="verificationCode")]]
