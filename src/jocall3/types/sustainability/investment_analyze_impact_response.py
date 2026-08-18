// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/sustainability/investment_analyze_impact_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from pydantic import Field as FieldInfo

from ..._models import BaseModel

__all__ = ["InvestmentAnalyzeImpactResponse"]


class InvestmentAnalyzeImpactResponse(BaseModel):
    breakdown_by_esg_factors: object = FieldInfo(alias="breakdownByESGFactors")
    """Breakdown of the portfolio's ESG score by individual factors."""
