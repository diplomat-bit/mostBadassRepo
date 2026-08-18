// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/corporatetreasury.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"context"
	"net/http"
	"net/url"
	"slices"

	"github.com/diplomat-bit/jocall3-go/internal/apijson"
	"github.com/diplomat-bit/jocall3-go/internal/apiquery"
	"github.com/diplomat-bit/jocall3-go/internal/param"
	"github.com/diplomat-bit/jocall3-go/internal/requestconfig"
	"github.com/diplomat-bit/jocall3-go/option"
)

// CorporateTreasuryService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewCorporateTreasuryService] method instead.
type CorporateTreasuryService struct {
	Options  []option.RequestOption
	Sweeping *CorporateTreasurySweepingService
}

// NewCorporateTreasuryService generates a new service that applies the given
// options to each request. These options are applied after the parent client's
// options (if there is one), and before any request-specific options.
func NewCorporateTreasuryService(opts ...option.RequestOption) (r *CorporateTreasuryService) {
	r = &CorporateTreasuryService{}
	r.Options = opts
	r.Sweeping = NewCorporateTreasurySweepingService(opts...)
	return
}

// Retrieves an advanced AI-driven cash flow forecast for the organization,
// projecting liquidity, identifying potential surpluses or deficits, and providing
// recommendations for optimal treasury management.
func (r *CorporateTreasuryService) ForecastCashFlow(ctx context.Context, query CorporateTreasuryForecastCashFlowParams, opts ...option.RequestOption) (res *CorporateTreasuryForecastCashFlowResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "corporate/treasury/cash-flow/forecast"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

type CorporateTreasuryForecastCashFlowResponse struct {
	// Forecast of cash inflows by source.
	InflowForecast interface{} `json:"inflowForecast,required"`
	// Forecast of cash outflows by category.
	OutflowForecast interface{}                                   `json:"outflowForecast,required"`
	JSON            corporateTreasuryForecastCashFlowResponseJSON `json:"-"`
}

// corporateTreasuryForecastCashFlowResponseJSON contains the JSON metadata for the
// struct [CorporateTreasuryForecastCashFlowResponse]
type corporateTreasuryForecastCashFlowResponseJSON struct {
	InflowForecast  apijson.Field
	OutflowForecast apijson.Field
	raw             string
	ExtraFields     map[string]apijson.Field
}

func (r *CorporateTreasuryForecastCashFlowResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r corporateTreasuryForecastCashFlowResponseJSON) RawJSON() string {
	return r.raw
}

type CorporateTreasuryForecastCashFlowParams struct {
	// The number of days into the future for which to generate the cash flow forecast
	// (e.g., 30, 90, 180).
	ForecastHorizonDays param.Field[int64] `query:"forecastHorizonDays"`
	// If true, the forecast will include best-case and worst-case scenario analysis
	// alongside the most likely projection.
	IncludeScenarioAnalysis param.Field[bool] `query:"includeScenarioAnalysis"`
}

// URLQuery serializes [CorporateTreasuryForecastCashFlowParams]'s query parameters
// as `url.Values`.
func (r CorporateTreasuryForecastCashFlowParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}
