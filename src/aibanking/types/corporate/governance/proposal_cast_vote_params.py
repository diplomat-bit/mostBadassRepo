// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/governance/proposal_cast_vote_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Literal, Required, TypedDict

__all__ = ["ProposalCastVoteParams"]


class ProposalCastVoteParams(TypedDict, total=False):
    decision: Required[Literal["APPROVE", "REJECT"]]

    comment: str

    signature: str
    """Cryptographic signature if required"""
