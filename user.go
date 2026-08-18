// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/user.go
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

// UserService contains methods and other services that help with interacting with
// the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewUserService] method instead.
type UserService struct {
	Options []option.RequestOption
	Me      *UserMeService
}

// NewUserService generates a new service that applies the given options to each
// request. These options are applied after the parent client's options (if there
// is one), and before any request-specific options.
func NewUserService(opts ...option.RequestOption) (r *UserService) {
	r = &UserService{}
	r.Options = opts
	r.Me = NewUserMeService(opts...)
	return
}

// Authenticates a user and creates a secure session, returning access tokens. May
// require MFA depending on user settings.
func (r *UserService) Login(ctx context.Context, body UserLoginParams, opts ...option.RequestOption) (res *UserLoginResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "users/login"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

// Registers a new user account with , initiating the onboarding process. Requires
// basic user details.
func (r *UserService) Register(ctx context.Context, body UserRegisterParams, opts ...option.RequestOption) (res *UserRegisterResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "users/register"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

type UserLoginResponse = interface{}

type UserRegisterResponse struct {
	Address interface{} `json:"address"`
	// User's personalized preferences for the platform.
	Preferences UserRegisterResponsePreferences `json:"preferences"`
	// Security-related status for the user account.
	SecurityStatus interface{}              `json:"securityStatus"`
	JSON           userRegisterResponseJSON `json:"-"`
}

// userRegisterResponseJSON contains the JSON metadata for the struct
// [UserRegisterResponse]
type userRegisterResponseJSON struct {
	Address        apijson.Field
	Preferences    apijson.Field
	SecurityStatus apijson.Field
	raw            string
	ExtraFields    map[string]apijson.Field
}

func (r *UserRegisterResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r userRegisterResponseJSON) RawJSON() string {
	return r.raw
}

// User's personalized preferences for the platform.
type UserRegisterResponsePreferences struct {
	// Preferred channels for receiving notifications.
	NotificationChannels interface{}                         `json:"notificationChannels"`
	JSON                 userRegisterResponsePreferencesJSON `json:"-"`
}

// userRegisterResponsePreferencesJSON contains the JSON metadata for the struct
// [UserRegisterResponsePreferences]
type userRegisterResponsePreferencesJSON struct {
	NotificationChannels apijson.Field
	raw                  string
	ExtraFields          map[string]apijson.Field
}

func (r *UserRegisterResponsePreferences) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r userRegisterResponsePreferencesJSON) RawJSON() string {
	return r.raw
}

type UserLoginParams struct {
}

func (r UserLoginParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}

type UserRegisterParams struct {
	Address param.Field[interface{}] `json:"address"`
}

func (r UserRegisterParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
