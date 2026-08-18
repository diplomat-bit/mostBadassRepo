// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/compliance_screen_pep_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["ComplianceScreenPepResponse"]


class ComplianceScreenPepResponse(BaseModel):
    details: Optional[str] = None

    is_match: Optional[bool] = FieldInfo(alias="isMatch", default=None)
