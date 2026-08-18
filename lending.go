// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/lending.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"github.com/diplomat-bit/jocall3-go/option"
)

// LendingService contains methods and other services that help with interacting
// with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewLendingService] method instead.
type LendingService struct {
	Options   []option.RequestOption
	Decisions *LendingDecisionService
}

// NewLendingService generates a new service that applies the given options to each
// request. These options are applied after the parent client's options (if there
// is one), and before any request-specific options.
func NewLendingService(opts ...option.RequestOption) (r *LendingService) {
	r = &LendingService{}
	r.Options = opts
	r.Decisions = NewLendingDecisionService(opts...)
	return
}
