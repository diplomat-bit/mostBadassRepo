// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/aiincubator.go
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

// AIIncubatorService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewAIIncubatorService] method instead.
type AIIncubatorService struct {
	Options  []option.RequestOption
	Analysis *AIIncubatorAnalysisService
}

// NewAIIncubatorService generates a new service that applies the given options to
// each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewAIIncubatorService(opts ...option.RequestOption) (r *AIIncubatorService) {
	r = &AIIncubatorService{}
	r.Options = opts
	r.Analysis = NewAIIncubatorAnalysisService(opts...)
	return
}

// Submits a detailed business plan to the Quantum Weaver AI for rigorous analysis,
// market validation, and seed funding consideration. This initiates the AI-driven
// incubation journey, aiming to transform innovative ideas into commercially
// successful ventures.
func (r *AIIncubatorService) GeneratePitch(ctx context.Context, body AIIncubatorGeneratePitchParams, opts ...option.RequestOption) (res *AIIncubatorGeneratePitchResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "ai/incubator/pitch"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

type AIIncubatorGeneratePitchResponse = interface{}

type AIIncubatorGeneratePitchParams struct {
	// Key financial metrics and projections for the next 3-5 years.
	FinancialProjections param.Field[interface{}] `json:"financialProjections,required"`
}

func (r AIIncubatorGeneratePitchParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
