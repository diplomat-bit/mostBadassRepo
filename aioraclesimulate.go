// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/aioraclesimulate.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"context"
	"net/http"
	"slices"

	"github.com/diplomat-bit/jocall3-go/internal/apijson"
	"github.com/diplomat-bit/jocall3-go/internal/param"
	"github.com/diplomat-bit/jocall3-go/internal/requestconfig"
	"github.com/diplomat-bit/jocall3-go/option"
)

// AIOracleSimulateService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewAIOracleSimulateService] method instead.
type AIOracleSimulateService struct {
	Options []option.RequestOption
}

// NewAIOracleSimulateService generates a new service that applies the given
// options to each request. These options are applied after the parent client's
// options (if there is one), and before any request-specific options.
func NewAIOracleSimulateService(opts ...option.RequestOption) (r *AIOracleSimulateService) {
	r = &AIOracleSimulateService{}
	r.Options = opts
	return
}

// Engages the Quantum Oracle for highly complex, multi-variable simulations,
// allowing precise control over numerous financial parameters, market conditions,
// and personal events to generate deep, predictive insights and sensitivity
// analysis.
func (r *AIOracleSimulateService) RunAdvanced(ctx context.Context, body AIOracleSimulateRunAdvancedParams, opts ...option.RequestOption) (res *AIOracleSimulateRunAdvancedResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "ai/oracle/simulate/advanced"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

// Submits a hypothetical scenario to the Quantum Oracle AI for standard financial
// impact analysis. The AI simulates the effect on the user's current financial
// state and provides a summary.
func (r *AIOracleSimulateService) RunStandard(ctx context.Context, body AIOracleSimulateRunStandardParams, opts ...option.RequestOption) (res *AIOracleSimulateRunStandardResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "ai/oracle/simulate"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

type AIOracleSimulateRunAdvancedResponse = interface{}

type AIOracleSimulateRunStandardResponse struct {
	// AI-driven risk assessment of the simulated scenario.
	RiskAnalysis interface{}                             `json:"riskAnalysis"`
	JSON         aiOracleSimulateRunStandardResponseJSON `json:"-"`
}

// aiOracleSimulateRunStandardResponseJSON contains the JSON metadata for the
// struct [AIOracleSimulateRunStandardResponse]
type aiOracleSimulateRunStandardResponseJSON struct {
	RiskAnalysis apijson.Field
	raw          string
	ExtraFields  map[string]apijson.Field
}

func (r *AIOracleSimulateRunStandardResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r aiOracleSimulateRunStandardResponseJSON) RawJSON() string {
	return r.raw
}

type AIOracleSimulateRunAdvancedParams struct {
	// Optional: Global economic conditions to apply to all scenarios.
	GlobalEconomicFactors param.Field[interface{}] `json:"globalEconomicFactors"`
	// Optional: Personal financial assumptions to override defaults.
	PersonalAssumptions param.Field[interface{}] `json:"personalAssumptions"`
}

func (r AIOracleSimulateRunAdvancedParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}

type AIOracleSimulateRunStandardParams struct {
}

func (r AIOracleSimulateRunStandardParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
