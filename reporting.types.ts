// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/reporting.types.ts
================================================================================


export interface ReportingReportRun {
    id: string;
    status: string;
    result?: { url: string };
}
export interface ReportingReportRunCreateParams {
    report_type: string;
    parameters: any;
}
export interface ReportingReportRunRetrieveParams {
    report_run_id: string;
}
