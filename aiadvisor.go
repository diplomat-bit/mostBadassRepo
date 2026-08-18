// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/aiadvisor.go
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

// AIAdvisorService contains methods and other services that help with interacting
// with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewAIAdvisorService] method instead.
type AIAdvisorService struct {
	Options []option.RequestOption
	Tools   *AIAdvisorToolService
}

// NewAIAdvisorService generates a new service that applies the given options to
// each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewAIAdvisorService(opts ...option.RequestOption) (r *AIAdvisorService) {
	r = &AIAdvisorService{}
	r.Options = opts
	r.Tools = NewAIAdvisorToolService(opts...)
	return
}

// Initiates or continues a sophisticated conversation with Quantum, the AI
// Advisor. Quantum can provide advanced financial insights, execute complex tasks
// via an expanding suite of intelligent tools, and learn from user interactions to
// offer hyper-personalized guidance.
func (r *AIAdvisorService) Chat(ctx context.Context, body AIAdvisorChatParams, opts ...option.RequestOption) (res *AIAdvisorChatResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "ai/advisor/chat"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

type AIAdvisorChatResponse = interface{}

type AIAdvisorChatParams struct {
	// Optional: The output from a tool function that the AI previously requested to be
	// executed.
	FunctionResponse param.Field[interface{}] `json:"functionResponse"`
}

func (r AIAdvisorChatParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
