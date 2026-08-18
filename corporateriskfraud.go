// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/corporateriskfraud.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"context"
	"net/http"
	"net/url"
	"slices"

	"github.com/diplomat-bit/jocall3-go/internal/apiquery"
	"github.com/diplomat-bit/jocall3-go/internal/param"
	"github.com/diplomat-bit/jocall3-go/internal/requestconfig"
	"github.com/diplomat-bit/jocall3-go/option"
)

// CorporateRiskFraudService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewCorporateRiskFraudService] method instead.
type CorporateRiskFraudService struct {
	Options []option.RequestOption
}

// NewCorporateRiskFraudService generates a new service that applies the given
// options to each request. These options are applied after the parent client's
// options (if there is one), and before any request-specific options.
func NewCorporateRiskFraudService(opts ...option.RequestOption) (r *CorporateRiskFraudService) {
	r = &CorporateRiskFraudService{}
	r.Options = opts
	return
}

// Retrieves a list of AI-powered fraud detection rules currently active for the
// organization, including their parameters, thresholds, and associated actions
// (e.g., flag, block, alert).
func (r *CorporateRiskFraudService) ListRules(ctx context.Context, query CorporateRiskFraudListRulesParams, opts ...option.RequestOption) (res *CorporateRiskFraudListRulesResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "corporate/risk/fraud/rules"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

type CorporateRiskFraudListRulesResponse = interface{}

type CorporateRiskFraudListRulesParams struct {
	// Maximum number of items to return in a single page.
	Limit param.Field[int64] `query:"limit"`
	// Number of items to skip before starting to collect the result set.
	Offset param.Field[int64] `query:"offset"`
}

// URLQuery serializes [CorporateRiskFraudListRulesParams]'s query parameters as
// `url.Values`.
func (r CorporateRiskFraudListRulesParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}
