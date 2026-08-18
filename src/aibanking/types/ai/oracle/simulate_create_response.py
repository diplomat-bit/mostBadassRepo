// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/ai/oracle/simulate_create_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import Optional

from pydantic import Field as FieldInfo

from ...._models import BaseModel

__all__ = ["SimulateCreateResponse"]


class SimulateCreateResponse(BaseModel):
    simulation_id: str = FieldInfo(alias="simulationId")

    status: str

    outcome_narrative: Optional[str] = FieldInfo(alias="outcomeNarrative", default=None)

    projected_value: Optional[float] = FieldInfo(alias="projectedValue", default=None)
