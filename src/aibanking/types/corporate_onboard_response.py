// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate_onboard_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from .._models import BaseModel

__all__ = ["CorporateOnboardResponse"]


class CorporateOnboardResponse(BaseModel):
    corporate_id: Optional[str] = FieldInfo(alias="corporateId", default=None)

    status: Optional[str] = None
