// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/corporate/card_update_controls_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from ..._models import BaseModel

__all__ = ["CardUpdateControlsResponse"]


class CardUpdateControlsResponse(BaseModel):
    controls: object
    """Granular spending controls for a corporate card."""
