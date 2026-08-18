// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/system/webhook_register_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, TypedDict

from ..._types import SequenceNotStr

__all__ = ["WebhookRegisterParams"]


class WebhookRegisterParams(TypedDict, total=False):
    events: Required[SequenceNotStr[str]]

    url: Required[str]

    secret: str
    """HMAC signing secret"""
