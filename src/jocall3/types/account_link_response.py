// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/account_link_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from .._models import BaseModel

__all__ = ["AccountLinkResponse"]


class AccountLinkResponse(BaseModel):
    auth_uri: str = FieldInfo(alias="authUri")

    link_session_id: str = FieldInfo(alias="linkSessionId")

    status: str

    message: Optional[str] = None
