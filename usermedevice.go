// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/usermedevice.go
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

// UserMeDeviceService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewUserMeDeviceService] method instead.
type UserMeDeviceService struct {
	Options []option.RequestOption
}

// NewUserMeDeviceService generates a new service that applies the given options to
// each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewUserMeDeviceService(opts ...option.RequestOption) (r *UserMeDeviceService) {
	r = &UserMeDeviceService{}
	r.Options = opts
	return
}

// Retrieves a list of all devices linked to the user's account, including mobile
// phones, tablets, and desktops, indicating their last active status and security
// posture.
func (r *UserMeDeviceService) List(ctx context.Context, query UserMeDeviceListParams, opts ...option.RequestOption) (res *UserMeDeviceListResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "users/me/devices"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

type UserMeDeviceListResponse = interface{}

type UserMeDeviceListParams struct {
	// Maximum number of items to return in a single page.
	Limit param.Field[int64] `query:"limit"`
	// Number of items to skip before starting to collect the result set.
	Offset param.Field[int64] `query:"offset"`
}

// URLQuery serializes [UserMeDeviceListParams]'s query parameters as `url.Values`.
func (r UserMeDeviceListParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}
