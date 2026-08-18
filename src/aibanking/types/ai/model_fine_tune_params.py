// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/model_fine_tune_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, TypedDict

__all__ = ["ModelFineTuneParams"]


class ModelFineTuneParams(TypedDict, total=False):
    base_model: Required[str]

    training_data_url: Required[str]

    hyperparameters: object
