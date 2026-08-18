// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/web3/network_get_status_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from ..._models import BaseModel

__all__ = ["NetworkGetStatusResponse"]


class NetworkGetStatusResponse(BaseModel):
    ethereum: Optional[object] = None

    polygon: Optional[object] = None

    solana: Optional[object] = None
