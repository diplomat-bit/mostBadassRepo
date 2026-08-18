// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/model_fine_tune_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from ..._models import BaseModel

__all__ = ["ModelFineTuneResponse"]


class ModelFineTuneResponse(BaseModel):
    job_id: Optional[str] = None
