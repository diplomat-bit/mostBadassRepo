// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/system/verification_compare_biometric_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, TypedDict

__all__ = ["VerificationCompareBiometricParams"]


class VerificationCompareBiometricParams(TypedDict, total=False):
    sample_a: Required[str]

    sample_b: Required[str]
