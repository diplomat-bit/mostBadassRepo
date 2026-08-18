// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/advisor/chat_retrieve_history_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from ...._models import BaseModel

__all__ = ["ChatRetrieveHistoryResponse"]


class ChatRetrieveHistoryResponse(BaseModel):
    messages: Optional[List[object]] = None
