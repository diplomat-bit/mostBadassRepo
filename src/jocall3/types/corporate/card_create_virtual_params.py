// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/corporate/card_create_virtual_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, TypedDict

__all__ = ["CardCreateVirtualParams"]


class CardCreateVirtualParams(TypedDict, total=False):
    controls: Required[object]
    """Granular spending controls for a corporate card."""
