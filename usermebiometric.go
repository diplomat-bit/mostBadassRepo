// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/usermebiometric.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"context"
	"net/http"
	"slices"

	"github.com/diplomat-bit/jocall3-go/internal/apijson"
	"github.com/diplomat-bit/jocall3-go/internal/requestconfig"
	"github.com/diplomat-bit/jocall3-go/option"
)

// UserMeBiometricService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewUserMeBiometricService] method instead.
type UserMeBiometricService struct {
	Options []option.RequestOption
}

// NewUserMeBiometricService generates a new service that applies the given options
// to each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewUserMeBiometricService(opts ...option.RequestOption) (r *UserMeBiometricService) {
	r = &UserMeBiometricService{}
	r.Options = opts
	return
}

// Retrieves the current status of biometric enrollments for the authenticated
// user.
func (r *UserMeBiometricService) GetStatus(ctx context.Context, opts ...option.RequestOption) (res *UserMeBiometricGetStatusResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "users/me/biometrics"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, nil, &res, opts...)
	return
}

// Performs real-time biometric verification to authorize sensitive actions or
// access protected resources, using a one-time biometric signature.
func (r *UserMeBiometricService) Verify(ctx context.Context, body UserMeBiometricVerifyParams, opts ...option.RequestOption) (res *UserMeBiometricVerifyResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "users/me/biometrics/verify"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

type UserMeBiometricGetStatusResponse = interface{}

type UserMeBiometricVerifyResponse = interface{}

type UserMeBiometricVerifyParams struct {
}

func (r UserMeBiometricVerifyParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
