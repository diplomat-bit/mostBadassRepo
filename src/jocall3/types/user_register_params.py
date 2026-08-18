// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/user_register_params.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

from typing_extensions import Required, TypedDict

__all__ = ["UserRegisterParams", "Address"]


class UserRegisterParams(TypedDict, total=False):
    email: Required[str]

    name: Required[str]

    password: Required[str]

    address: Address

    phone: str


class Address(TypedDict, total=False):
    city: str

    country: str

    state: str

    street: str

    zip: str
