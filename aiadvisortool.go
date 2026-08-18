// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/aiadvisortool.go
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

// AIAdvisorToolService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewAIAdvisorToolService] method instead.
type AIAdvisorToolService struct {
	Options []option.RequestOption
}

// NewAIAdvisorToolService generates a new service that applies the given options
// to each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewAIAdvisorToolService(opts ...option.RequestOption) (r *AIAdvisorToolService) {
	r = &AIAdvisorToolService{}
	r.Options = opts
	return
}

// Retrieves a dynamic manifest of all integrated AI tools that Quantum can invoke
// and execute, providing details on their capabilities, parameters, and access
// requirements.
func (r *AIAdvisorToolService) List(ctx context.Context, query AIAdvisorToolListParams, opts ...option.RequestOption) (res *AIAdvisorToolListResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "ai/advisor/tools"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

type AIAdvisorToolListResponse = interface{}

type AIAdvisorToolListParams struct {
	// Maximum number of items to return in a single page.
	Limit param.Field[int64] `query:"limit"`
	// Number of items to skip before starting to collect the result set.
	Offset param.Field[int64] `query:"offset"`
}

// URLQuery serializes [AIAdvisorToolListParams]'s query parameters as
// `url.Values`.
func (r AIAdvisorToolListParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}
