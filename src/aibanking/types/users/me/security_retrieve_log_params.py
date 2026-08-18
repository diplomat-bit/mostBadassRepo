// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/users/me/security_retrieve_log_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import TypedDict

__all__ = ["SecurityRetrieveLogParams"]


class SecurityRetrieveLogParams(TypedDict, total=False):
    limit: int

    offset: int
