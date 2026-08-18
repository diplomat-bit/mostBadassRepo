// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/transaction.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"slices"

	"github.com/diplomat-bit/jocall3-go/internal/apijson"
	"github.com/diplomat-bit/jocall3-go/internal/apiquery"
	"github.com/diplomat-bit/jocall3-go/internal/param"
	"github.com/diplomat-bit/jocall3-go/internal/requestconfig"
	"github.com/diplomat-bit/jocall3-go/option"
)

// TransactionService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewTransactionService] method instead.
type TransactionService struct {
	Options   []option.RequestOption
	Recurring *TransactionRecurringService
	Insights  *TransactionInsightService
}

// NewTransactionService generates a new service that applies the given options to
// each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewTransactionService(opts ...option.RequestOption) (r *TransactionService) {
	r = &TransactionService{}
	r.Options = opts
	r.Recurring = NewTransactionRecurringService(opts...)
	r.Insights = NewTransactionInsightService(opts...)
	return
}

// Retrieves granular information for a single transaction by its unique ID,
// including AI categorization confidence, merchant details, and associated carbon
// footprint.
func (r *TransactionService) Get(ctx context.Context, transactionID string, opts ...option.RequestOption) (res *TransactionGetResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	if transactionID == "" {
		err = errors.New("missing required transactionId parameter")
		return
	}
	path := fmt.Sprintf("transactions/%s", transactionID)
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, nil, &res, opts...)
	return
}

// Retrieves a paginated list of the user's transactions, with extensive options
// for filtering by type, category, date range, amount, and intelligent AI-driven
// sorting and search capabilities.
func (r *TransactionService) List(ctx context.Context, query TransactionListParams, opts ...option.RequestOption) (res *TransactionListResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "transactions"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

// Allows the user to override or refine the AI's categorization for a transaction,
// improving future AI accuracy and personal financial reporting.
func (r *TransactionService) Categorize(ctx context.Context, transactionID string, body TransactionCategorizeParams, opts ...option.RequestOption) (res *TransactionCategorizeResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	if transactionID == "" {
		err = errors.New("missing required transactionId parameter")
		return
	}
	path := fmt.Sprintf("transactions/%s/categorize", transactionID)
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPut, path, body, &res, opts...)
	return
}

type TransactionGetResponse struct {
	// Geographic location details for a transaction.
	Location interface{} `json:"location"`
	// Detailed information about a merchant associated with a transaction.
	MerchantDetails TransactionGetResponseMerchantDetails `json:"merchantDetails"`
	JSON            transactionGetResponseJSON            `json:"-"`
}

// transactionGetResponseJSON contains the JSON metadata for the struct
// [TransactionGetResponse]
type transactionGetResponseJSON struct {
	Location        apijson.Field
	MerchantDetails apijson.Field
	raw             string
	ExtraFields     map[string]apijson.Field
}

func (r *TransactionGetResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r transactionGetResponseJSON) RawJSON() string {
	return r.raw
}

// Detailed information about a merchant associated with a transaction.
type TransactionGetResponseMerchantDetails struct {
	Address interface{}                               `json:"address"`
	JSON    transactionGetResponseMerchantDetailsJSON `json:"-"`
}

// transactionGetResponseMerchantDetailsJSON contains the JSON metadata for the
// struct [TransactionGetResponseMerchantDetails]
type transactionGetResponseMerchantDetailsJSON struct {
	Address     apijson.Field
	raw         string
	ExtraFields map[string]apijson.Field
}

func (r *TransactionGetResponseMerchantDetails) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r transactionGetResponseMerchantDetailsJSON) RawJSON() string {
	return r.raw
}

type TransactionListResponse = interface{}

type TransactionCategorizeResponse struct {
	// Geographic location details for a transaction.
	Location interface{} `json:"location"`
	// Detailed information about a merchant associated with a transaction.
	MerchantDetails TransactionCategorizeResponseMerchantDetails `json:"merchantDetails"`
	JSON            transactionCategorizeResponseJSON            `json:"-"`
}

// transactionCategorizeResponseJSON contains the JSON metadata for the struct
// [TransactionCategorizeResponse]
type transactionCategorizeResponseJSON struct {
	Location        apijson.Field
	MerchantDetails apijson.Field
	raw             string
	ExtraFields     map[string]apijson.Field
}

func (r *TransactionCategorizeResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r transactionCategorizeResponseJSON) RawJSON() string {
	return r.raw
}

// Detailed information about a merchant associated with a transaction.
type TransactionCategorizeResponseMerchantDetails struct {
	Address interface{}                                      `json:"address"`
	JSON    transactionCategorizeResponseMerchantDetailsJSON `json:"-"`
}

// transactionCategorizeResponseMerchantDetailsJSON contains the JSON metadata for
// the struct [TransactionCategorizeResponseMerchantDetails]
type transactionCategorizeResponseMerchantDetailsJSON struct {
	Address     apijson.Field
	raw         string
	ExtraFields map[string]apijson.Field
}

func (r *TransactionCategorizeResponseMerchantDetails) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r transactionCategorizeResponseMerchantDetailsJSON) RawJSON() string {
	return r.raw
}

type TransactionListParams struct {
	// Filter transactions by their AI-assigned or user-defined category.
	Category param.Field[string] `query:"category"`
	// Retrieve transactions up to this date (inclusive).
	EndDate param.Field[string] `query:"endDate"`
	// Maximum number of items to return in a single page.
	Limit param.Field[int64] `query:"limit"`
	// Filter for transactions with an amount less than or equal to this value.
	MaxAmount param.Field[int64] `query:"maxAmount"`
	// Filter for transactions with an amount greater than or equal to this value.
	MinAmount param.Field[int64] `query:"minAmount"`
	// Number of items to skip before starting to collect the result set.
	Offset param.Field[int64] `query:"offset"`
	// Free-text search across transaction descriptions, merchants, and notes.
	SearchQuery param.Field[string] `query:"searchQuery"`
	// Retrieve transactions from this date (inclusive).
	StartDate param.Field[string] `query:"startDate"`
	// Filter transactions by type (e.g., income, expense, transfer).
	Type param.Field[string] `query:"type"`
}

// URLQuery serializes [TransactionListParams]'s query parameters as `url.Values`.
func (r TransactionListParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}

type TransactionCategorizeParams struct {
}

func (r TransactionCategorizeParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
