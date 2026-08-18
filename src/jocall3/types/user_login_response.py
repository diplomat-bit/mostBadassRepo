// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/user_login_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from pydantic import Field as FieldInfo

from .._models import BaseModel

__all__ = ["UserLoginResponse"]


class UserLoginResponse(BaseModel):
    access_token: str = FieldInfo(alias="accessToken")

    expires_in: int = FieldInfo(alias="expiresIn")

    refresh_token: str = FieldInfo(alias="refreshToken")

    token_type: str = FieldInfo(alias="tokenType")
