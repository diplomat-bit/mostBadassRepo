// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/corporatecardcontrol.go
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

// CorporateCardControlService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewCorporateCardControlService] method instead.
type CorporateCardControlService struct {
	Options []option.RequestOption
}

// NewCorporateCardControlService generates a new service that applies the given
// options to each request. These options are applied after the parent client's
// options (if there is one), and before any request-specific options.
func NewCorporateCardControlService(opts ...option.RequestOption) (r *CorporateCardControlService) {
	r = &CorporateCardControlService{}
	r.Options = opts
	return
}

// Updates the sophisticated spending controls, limits, and policy overrides for a
// specific corporate card, enabling real-time adjustments for security and budget
// adherence.
func (r *CorporateCardControlService) Update(ctx context.Context, cardID string, body CorporateCardControlUpdateParams, opts ...option.RequestOption) (res *CorporateCardControlUpdateResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	if cardID == "" {
		err = errors.New("missing required cardId parameter")
		return
	}
	path := fmt.Sprintf("corporate/cards/%s/controls", cardID)
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPut, path, body, &res, opts...)
	return
}

type CorporateCardControlUpdateResponse struct {
	// Granular spending controls for a corporate card.
	Controls interface{}                            `json:"controls,required"`
	JSON     corporateCardControlUpdateResponseJSON `json:"-"`
}

// corporateCardControlUpdateResponseJSON contains the JSON metadata for the struct
// [CorporateCardControlUpdateResponse]
type corporateCardControlUpdateResponseJSON struct {
	Controls    apijson.Field
	raw         string
	ExtraFields map[string]apijson.Field
}

func (r *CorporateCardControlUpdateResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r corporateCardControlUpdateResponseJSON) RawJSON() string {
	return r.raw
}

type CorporateCardControlUpdateParams struct {
}

func (r CorporateCardControlUpdateParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
