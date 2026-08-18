// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/web3/transaction_send_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["TransactionSendResponse"]


class TransactionSendResponse(BaseModel):
    tx_hash: Optional[str] = FieldInfo(alias="txHash", default=None)
