// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/web3/wallet_get_balances_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from ..._models import BaseModel

__all__ = ["WalletGetBalancesResponse", "Balance"]


class Balance(BaseModel):
    amount: Optional[str] = None

    symbol: Optional[str] = None


class WalletGetBalancesResponse(BaseModel):
    balances: Optional[List[Balance]] = None
