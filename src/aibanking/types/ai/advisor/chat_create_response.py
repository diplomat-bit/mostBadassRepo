// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/advisor/chat_create_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from pydantic import Field as FieldInfo

from ...._models import BaseModel

__all__ = ["ChatCreateResponse"]


class ChatCreateResponse(BaseModel):
    reply: Optional[str] = None

    session_id: Optional[str] = FieldInfo(alias="sessionId", default=None)

    suggested_actions: Optional[List[object]] = FieldInfo(alias="suggestedActions", default=None)
