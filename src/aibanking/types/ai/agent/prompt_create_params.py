// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/agent/prompt_create_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, Annotated, TypedDict

from ...._utils import PropertyInfo

__all__ = ["PromptCreateParams"]


class PromptCreateParams(TypedDict, total=False):
    system_prompt: Required[Annotated[str, PropertyInfo(alias="systemPrompt")]]
