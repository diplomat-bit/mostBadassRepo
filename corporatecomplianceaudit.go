// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/corporatecomplianceaudit.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"context"
	"net/http"
	"slices"

	"github.com/diplomat-bit/jocall3-go/internal/apijson"
	"github.com/diplomat-bit/jocall3-go/internal/requestconfig"
	"github.com/diplomat-bit/jocall3-go/option"
)

// CorporateComplianceAuditService contains methods and other services that help
// with interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewCorporateComplianceAuditService] method instead.
type CorporateComplianceAuditService struct {
	Options []option.RequestOption
}

// NewCorporateComplianceAuditService generates a new service that applies the
// given options to each request. These options are applied after the parent
// client's options (if there is one), and before any request-specific options.
func NewCorporateComplianceAuditService(opts ...option.RequestOption) (r *CorporateComplianceAuditService) {
	r = &CorporateComplianceAuditService{}
	r.Options = opts
	return
}

// Initiates an AI-powered compliance audit for a specific period or scope,
// generating a comprehensive report detailing adherence to regulatory frameworks,
// internal policies, and flagging potential risks.
func (r *CorporateComplianceAuditService) Request(ctx context.Context, body CorporateComplianceAuditRequestParams, opts ...option.RequestOption) (res *CorporateComplianceAuditRequestResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "corporate/compliance/audits"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

type CorporateComplianceAuditRequestResponse = interface{}

type CorporateComplianceAuditRequestParams struct {
}

func (r CorporateComplianceAuditRequestParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
