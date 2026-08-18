// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/types/corporate/risk/fraud/rule_list_active_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from typing import List, Optional

from ....._models import BaseModel

__all__ = ["RuleListActiveResponse"]


class RuleListActiveResponse(BaseModel):
    rules: Optional[List[object]] = None
