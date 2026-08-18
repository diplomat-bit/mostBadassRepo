// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/web3/wallet_list_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from ..._models import BaseModel

__all__ = ["WalletListResponse", "Data"]


class Data(BaseModel):
    id: str

    address: str

    network: str


class WalletListResponse(BaseModel):
    data: Optional[List[Data]] = None
