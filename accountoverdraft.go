// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/accountoverdraft.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"slices"

	"github.com/diplomat-bit/jocall3-go/internal/apijson"
	"github.com/diplomat-bit/jocall3-go/internal/requestconfig"
	"github.com/diplomat-bit/jocall3-go/option"
)

// AccountOverdraftService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewAccountOverdraftService] method instead.
type AccountOverdraftService struct {
	Options []option.RequestOption
}

// NewAccountOverdraftService generates a new service that applies the given
// options to each request. These options are applied after the parent client's
// options (if there is one), and before any request-specific options.
func NewAccountOverdraftService(opts ...option.RequestOption) (r *AccountOverdraftService) {
	r = &AccountOverdraftService{}
	r.Options = opts
	return
}

// Updates the overdraft protection settings for a specific account, enabling or
// disabling protection and configuring preferences.
func (r *AccountOverdraftService) Update(ctx context.Context, accountID string, body AccountOverdraftUpdateParams, opts ...option.RequestOption) (res *AccountOverdraftUpdateResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	if accountID == "" {
		err = errors.New("missing required accountId parameter")
		return
	}
	path := fmt.Sprintf("accounts/%s/overdraft-settings", accountID)
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPut, path, body, &res, opts...)
	return
}

// Retrieves the current overdraft protection settings for a specific account.
func (r *AccountOverdraftService) Get(ctx context.Context, accountID string, opts ...option.RequestOption) (res *AccountOverdraftGetResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	if accountID == "" {
		err = errors.New("missing required accountId parameter")
		return
	}
	path := fmt.Sprintf("accounts/%s/overdraft-settings", accountID)
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, nil, &res, opts...)
	return
}

type AccountOverdraftUpdateResponse = interface{}

type AccountOverdraftGetResponse = interface{}

type AccountOverdraftUpdateParams struct {
}

func (r AccountOverdraftUpdateParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
