// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/userme.go
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

// UserMeService contains methods and other services that help with interacting
// with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewUserMeService] method instead.
type UserMeService struct {
	Options    []option.RequestOption
	Security   *UserMeSecurityService
	Devices    *UserMeDeviceService
	Biometrics *UserMeBiometricService
}

// NewUserMeService generates a new service that applies the given options to each
// request. These options are applied after the parent client's options (if there
// is one), and before any request-specific options.
func NewUserMeService(opts ...option.RequestOption) (r *UserMeService) {
	r = &UserMeService{}
	r.Options = opts
	r.Security = NewUserMeSecurityService(opts...)
	r.Devices = NewUserMeDeviceService(opts...)
	r.Biometrics = NewUserMeBiometricService(opts...)
	return
}

// Fetches the complete and dynamically updated profile information for the
// currently authenticated user, encompassing personal details, security status,
// gamification level, loyalty points, and linked identity attributes.
func (r *UserMeService) Get(ctx context.Context, opts ...option.RequestOption) (res *UserMeGetResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "users/me"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, nil, &res, opts...)
	return
}

// Updates selected fields of the currently authenticated user's profile
// information.
func (r *UserMeService) Update(ctx context.Context, body UserMeUpdateParams, opts ...option.RequestOption) (res *UserMeUpdateResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "users/me"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPut, path, body, &res, opts...)
	return
}

type UserMeGetResponse struct {
	Address interface{} `json:"address"`
	// User's personalized preferences for the platform.
	Preferences UserMeGetResponsePreferences `json:"preferences"`
	// Security-related status for the user account.
	SecurityStatus interface{}           `json:"securityStatus"`
	JSON           userMeGetResponseJSON `json:"-"`
}

// userMeGetResponseJSON contains the JSON metadata for the struct
// [UserMeGetResponse]
type userMeGetResponseJSON struct {
	Address        apijson.Field
	Preferences    apijson.Field
	SecurityStatus apijson.Field
	raw            string
	ExtraFields    map[string]apijson.Field
}

func (r *UserMeGetResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r userMeGetResponseJSON) RawJSON() string {
	return r.raw
}

// User's personalized preferences for the platform.
type UserMeGetResponsePreferences struct {
	// Preferred channels for receiving notifications.
	NotificationChannels interface{}                      `json:"notificationChannels"`
	JSON                 userMeGetResponsePreferencesJSON `json:"-"`
}

// userMeGetResponsePreferencesJSON contains the JSON metadata for the struct
// [UserMeGetResponsePreferences]
type userMeGetResponsePreferencesJSON struct {
	NotificationChannels apijson.Field
	raw                  string
	ExtraFields          map[string]apijson.Field
}

func (r *UserMeGetResponsePreferences) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r userMeGetResponsePreferencesJSON) RawJSON() string {
	return r.raw
}

type UserMeUpdateResponse struct {
	Address interface{} `json:"address"`
	// User's personalized preferences for the platform.
	Preferences UserMeUpdateResponsePreferences `json:"preferences"`
	// Security-related status for the user account.
	SecurityStatus interface{}              `json:"securityStatus"`
	JSON           userMeUpdateResponseJSON `json:"-"`
}

// userMeUpdateResponseJSON contains the JSON metadata for the struct
// [UserMeUpdateResponse]
type userMeUpdateResponseJSON struct {
	Address        apijson.Field
	Preferences    apijson.Field
	SecurityStatus apijson.Field
	raw            string
	ExtraFields    map[string]apijson.Field
}

func (r *UserMeUpdateResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r userMeUpdateResponseJSON) RawJSON() string {
	return r.raw
}

// User's personalized preferences for the platform.
type UserMeUpdateResponsePreferences struct {
	// Preferred channels for receiving notifications.
	NotificationChannels interface{}                         `json:"notificationChannels"`
	JSON                 userMeUpdateResponsePreferencesJSON `json:"-"`
}

// userMeUpdateResponsePreferencesJSON contains the JSON metadata for the struct
// [UserMeUpdateResponsePreferences]
type userMeUpdateResponsePreferencesJSON struct {
	NotificationChannels apijson.Field
	raw                  string
	ExtraFields          map[string]apijson.Field
}

func (r *UserMeUpdateResponsePreferences) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r userMeUpdateResponsePreferencesJSON) RawJSON() string {
	return r.raw
}

type UserMeUpdateParams struct {
	Address param.Field[interface{}] `json:"address"`
	// User's personalized preferences for the platform.
	Preferences param.Field[UserMeUpdateParamsPreferences] `json:"preferences"`
}

func (r UserMeUpdateParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}

// User's personalized preferences for the platform.
type UserMeUpdateParamsPreferences struct {
	// Preferred channels for receiving notifications.
	NotificationChannels param.Field[interface{}] `json:"notificationChannels"`
}

func (r UserMeUpdateParamsPreferences) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
