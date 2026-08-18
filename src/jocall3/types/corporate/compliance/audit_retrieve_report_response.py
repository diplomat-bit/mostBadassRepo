// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/types/corporate/compliance/audit_retrieve_report_response.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from pydantic import Field as FieldInfo

from ...._models import BaseModel

__all__ = ["AuditRetrieveReportResponse"]


class AuditRetrieveReportResponse(BaseModel):
    period_covered: object = FieldInfo(alias="periodCovered")
    """The period covered by this audit report."""
