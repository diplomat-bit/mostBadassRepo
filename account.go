// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/account.go
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

// AccountService contains methods and other services that help with interacting
// with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewAccountService] method instead.
type AccountService struct {
	Options      []option.RequestOption
	Transactions *AccountTransactionService
	Statements   *AccountStatementService
	Overdraft    *AccountOverdraftService
}

// NewAccountService generates a new service that applies the given options to each
// request. These options are applied after the parent client's options (if there
// is one), and before any request-specific options.
func NewAccountService(opts ...option.RequestOption) (r *AccountService) {
	r = &AccountService{}
	r.Options = opts
	r.Transactions = NewAccountTransactionService(opts...)
	r.Statements = NewAccountStatementService(opts...)
	r.Overdraft = NewAccountOverdraftService(opts...)
	return
}

// Retrieves comprehensive analytics for a specific financial account, including
// historical balance trends, projected cash flow, and AI-driven insights into
// spending patterns.
func (r *AccountService) Get(ctx context.Context, accountID string, opts ...option.RequestOption) (res *AccountGetResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	if accountID == "" {
		err = errors.New("missing required accountId parameter")
		return
	}
	path := fmt.Sprintf("accounts/%s/details", accountID)
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, nil, &res, opts...)
	return
}

// Fetches a comprehensive, real-time list of all external financial accounts
// linked to the user's profile, including consolidated balances and institutional
// details.
func (r *AccountService) List(ctx context.Context, query AccountListParams, opts ...option.RequestOption) (res *AccountListResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "accounts/me"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

// Begins the secure process of linking a new external financial institution (e.g.,
// another bank, investment platform) to the user's profile, typically involving a
// third-party tokenized flow.
func (r *AccountService) Link(ctx context.Context, body AccountLinkParams, opts ...option.RequestOption) (res *AccountLinkResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "accounts/link"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

type AccountGetResponse struct {
	ProjectedCashFlow interface{}            `json:"projectedCashFlow"`
	JSON              accountGetResponseJSON `json:"-"`
}

// accountGetResponseJSON contains the JSON metadata for the struct
// [AccountGetResponse]
type accountGetResponseJSON struct {
	ProjectedCashFlow apijson.Field
	raw               string
	ExtraFields       map[string]apijson.Field
}

func (r *AccountGetResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r accountGetResponseJSON) RawJSON() string {
	return r.raw
}

type AccountListResponse = interface{}

type AccountLinkResponse = interface{}

type AccountListParams struct {
	// Maximum number of items to return in a single page.
	Limit param.Field[int64] `query:"limit"`
	// Number of items to skip before starting to collect the result set.
	Offset param.Field[int64] `query:"offset"`
}

// URLQuery serializes [AccountListParams]'s query parameters as `url.Values`.
func (r AccountListParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}

type AccountLinkParams struct {
}

func (r AccountLinkParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
