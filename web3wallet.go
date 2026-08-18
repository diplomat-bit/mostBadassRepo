// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/web3wallet.go
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

// Web3WalletService contains methods and other services that help with interacting
// with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewWeb3WalletService] method instead.
type Web3WalletService struct {
	Options []option.RequestOption
}

// NewWeb3WalletService generates a new service that applies the given options to
// each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewWeb3WalletService(opts ...option.RequestOption) (r *Web3WalletService) {
	r = &Web3WalletService{}
	r.Options = opts
	return
}

// Initiates the process to securely connect a new cryptocurrency wallet to the
// user's profile, typically involving a signed message or OAuth flow from the
// wallet provider.
func (r *Web3WalletService) New(ctx context.Context, body Web3WalletNewParams, opts ...option.RequestOption) (res *Web3WalletNewResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "web3/wallets"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

// Retrieves a list of all securely linked cryptocurrency wallets (e.g., MetaMask,
// Ledger integration), showing their addresses, associated networks, and
// verification status.
func (r *Web3WalletService) List(ctx context.Context, query Web3WalletListParams, opts ...option.RequestOption) (res *Web3WalletListResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "web3/wallets"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

// Retrieves the current balances of all recognized crypto assets within a specific
// connected wallet.
func (r *Web3WalletService) GetBalance(ctx context.Context, walletID string, query Web3WalletGetBalanceParams, opts ...option.RequestOption) (res *Web3WalletGetBalanceResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	if walletID == "" {
		err = errors.New("missing required walletId parameter")
		return
	}
	path := fmt.Sprintf("web3/wallets/%s/balances", walletID)
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

type Web3WalletNewResponse = interface{}

type Web3WalletListResponse = interface{}

type Web3WalletGetBalanceResponse = interface{}

type Web3WalletNewParams struct {
}

func (r Web3WalletNewParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}

type Web3WalletListParams struct {
	// Maximum number of items to return in a single page.
	Limit param.Field[int64] `query:"limit"`
	// Number of items to skip before starting to collect the result set.
	Offset param.Field[int64] `query:"offset"`
}

// URLQuery serializes [Web3WalletListParams]'s query parameters as `url.Values`.
func (r Web3WalletListParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}

type Web3WalletGetBalanceParams struct {
	// Maximum number of items to return in a single page.
	Limit param.Field[int64] `query:"limit"`
	// Number of items to skip before starting to collect the result set.
	Offset param.Field[int64] `query:"offset"`
}

// URLQuery serializes [Web3WalletGetBalanceParams]'s query parameters as
// `url.Values`.
func (r Web3WalletGetBalanceParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}
