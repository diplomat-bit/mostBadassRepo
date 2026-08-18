// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/account_retrieve_balance_history_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional
from datetime import datetime

from .._models import BaseModel

__all__ = ["AccountRetrieveBalanceHistoryResponse", "History"]


class History(BaseModel):
    balance: Optional[float] = None

    timestamp: Optional[datetime] = None


class AccountRetrieveBalanceHistoryResponse(BaseModel):
    history: Optional[List[History]] = None
