// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/ai.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"github.com/diplomat-bit/jocall3-go/option"
)

// AIService contains methods and other services that help with interacting with
// the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewAIService] method instead.
type AIService struct {
	Options   []option.RequestOption
	Advisor   *AIAdvisorService
	Oracle    *AIOracleService
	Incubator *AIIncubatorService
	Ads       *AIAdService
}

// NewAIService generates a new service that applies the given options to each
// request. These options are applied after the parent client's options (if there
// is one), and before any request-specific options.
func NewAIService(opts ...option.RequestOption) (r *AIService) {
	r = &AIService{}
	r.Options = opts
	r.Advisor = NewAIAdvisorService(opts...)
	r.Oracle = NewAIOracleService(opts...)
	r.Incubator = NewAIIncubatorService(opts...)
	r.Ads = NewAIAdService(opts...)
	return
}
