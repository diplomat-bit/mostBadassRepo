// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/transactioninsight.go
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

// TransactionInsightService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewTransactionInsightService] method instead.
type TransactionInsightService struct {
	Options []option.RequestOption
}

// NewTransactionInsightService generates a new service that applies the given
// options to each request. These options are applied after the parent client's
// options (if there is one), and before any request-specific options.
func NewTransactionInsightService(opts ...option.RequestOption) (r *TransactionInsightService) {
	r = &TransactionInsightService{}
	r.Options = opts
	return
}

// Retrieves AI-generated insights into user spending trends over time, identifying
// patterns and anomalies.
func (r *TransactionInsightService) GetTrends(ctx context.Context, opts ...option.RequestOption) (res *TransactionInsightGetTrendsResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "transactions/insights/spending-trends"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, nil, &res, opts...)
	return
}

type TransactionInsightGetTrendsResponse = interface{}
