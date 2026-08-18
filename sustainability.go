// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/sustainability.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"context"
	"net/http"
	"slices"

	"github.com/diplomat-bit/jocall3-go/internal/requestconfig"
	"github.com/diplomat-bit/jocall3-go/option"
)

// SustainabilityService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewSustainabilityService] method instead.
type SustainabilityService struct {
	Options []option.RequestOption
	Offsets *SustainabilityOffsetService
	Impact  *SustainabilityImpactService
}

// NewSustainabilityService generates a new service that applies the given options
// to each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewSustainabilityService(opts ...option.RequestOption) (r *SustainabilityService) {
	r = &SustainabilityService{}
	r.Options = opts
	r.Offsets = NewSustainabilityOffsetService(opts...)
	r.Impact = NewSustainabilityImpactService(opts...)
	return
}

// Generates a detailed report of the user's estimated carbon footprint based on
// transaction data, lifestyle choices, and AI-driven impact assessments, offering
// insights and reduction strategies.
func (r *SustainabilityService) GetFootprint(ctx context.Context, opts ...option.RequestOption) (res *SustainabilityGetFootprintResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "sustainability/carbon-footprint"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, nil, &res, opts...)
	return
}

type SustainabilityGetFootprintResponse = interface{}
