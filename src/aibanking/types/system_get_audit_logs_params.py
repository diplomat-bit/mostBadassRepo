// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/system_get_audit_logs_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Annotated, TypedDict

from .._utils import PropertyInfo

__all__ = ["SystemGetAuditLogsParams"]


class SystemGetAuditLogsParams(TypedDict, total=False):
    actor_id: Annotated[str, PropertyInfo(alias="actorId")]

    limit: int

    offset: int
