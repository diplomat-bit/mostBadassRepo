// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/ads/generate_copy_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from pydantic import Field as FieldInfo

from ...._models import BaseModel

__all__ = ["GenerateCopyResponse"]


class GenerateCopyResponse(BaseModel):
    body_text: Optional[str] = FieldInfo(alias="bodyText", default=None)

    headlines: Optional[List[str]] = None
