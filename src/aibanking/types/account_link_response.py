// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/account_link_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from .._models import BaseModel

__all__ = ["AccountLinkResponse"]


class AccountLinkResponse(BaseModel):
    link_session_id: Optional[str] = FieldInfo(alias="linkSessionId", default=None)

    status: Optional[str] = None
