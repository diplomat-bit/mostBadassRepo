// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/incubator/pitch_update_feedback_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing import Iterable
from typing_extensions import Required, TypedDict

__all__ = ["PitchUpdateFeedbackParams"]


class PitchUpdateFeedbackParams(TypedDict, total=False):
    answers: Required[Iterable[object]]
