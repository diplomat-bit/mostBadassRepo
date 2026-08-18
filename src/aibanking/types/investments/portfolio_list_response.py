// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/investments/portfolio_list_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["PortfolioListResponse", "Data"]


class Data(BaseModel):
    id: Optional[str] = None

    name: Optional[str] = None

    total_value: Optional[float] = FieldInfo(alias="totalValue", default=None)


class PortfolioListResponse(BaseModel):
    data: Optional[List[Data]] = None
