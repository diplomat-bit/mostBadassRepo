// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/corporate/risk/fraud/rule_update_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from ....._models import BaseModel

__all__ = ["RuleUpdateResponse"]


class RuleUpdateResponse(BaseModel):
    action: object
    """Action to take when a fraud rule is triggered."""

    criteria: object
    """Criteria that define when a fraud rule should trigger."""
