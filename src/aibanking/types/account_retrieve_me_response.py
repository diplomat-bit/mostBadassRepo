// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/account_retrieve_me_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from .._models import BaseModel

__all__ = ["AccountRetrieveMeResponse"]


class AccountRetrieveMeResponse(BaseModel):
    value: Optional[str] = None
