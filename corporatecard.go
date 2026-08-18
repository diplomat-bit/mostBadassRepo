// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/corporatecard.go
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

// CorporateCardService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewCorporateCardService] method instead.
type CorporateCardService struct {
	Options  []option.RequestOption
	Controls *CorporateCardControlService
}

// NewCorporateCardService generates a new service that applies the given options
// to each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewCorporateCardService(opts ...option.RequestOption) (r *CorporateCardService) {
	r = &CorporateCardService{}
	r.Options = opts
	r.Controls = NewCorporateCardControlService(opts...)
	return
}

// Retrieves a comprehensive list of all physical and virtual corporate cards
// associated with the user's organization, including their status, assigned
// holder, and current spending controls.
func (r *CorporateCardService) List(ctx context.Context, query CorporateCardListParams, opts ...option.RequestOption) (res *CorporateCardListResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "corporate/cards"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

// Immediately changes the frozen status of a corporate card, preventing or
// allowing transactions in real-time, critical for security and expense
// management.
func (r *CorporateCardService) Freeze(ctx context.Context, cardID string, body CorporateCardFreezeParams, opts ...option.RequestOption) (res *CorporateCardFreezeResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	if cardID == "" {
		err = errors.New("missing required cardId parameter")
		return
	}
	path := fmt.Sprintf("corporate/cards/%s/freeze", cardID)
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

// Creates and issues a new virtual corporate card with specified spending limits,
// merchant restrictions, and expiration dates, ideal for secure online purchases
// and temporary projects.
func (r *CorporateCardService) IssueVirtual(ctx context.Context, body CorporateCardIssueVirtualParams, opts ...option.RequestOption) (res *CorporateCardIssueVirtualResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "corporate/cards/virtual"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

type CorporateCardListResponse = interface{}

type CorporateCardFreezeResponse struct {
	// Granular spending controls for a corporate card.
	Controls interface{}                     `json:"controls,required"`
	JSON     corporateCardFreezeResponseJSON `json:"-"`
}

// corporateCardFreezeResponseJSON contains the JSON metadata for the struct
// [CorporateCardFreezeResponse]
type corporateCardFreezeResponseJSON struct {
	Controls    apijson.Field
	raw         string
	ExtraFields map[string]apijson.Field
}

func (r *CorporateCardFreezeResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r corporateCardFreezeResponseJSON) RawJSON() string {
	return r.raw
}

type CorporateCardIssueVirtualResponse struct {
	// Granular spending controls for a corporate card.
	Controls interface{}                           `json:"controls,required"`
	JSON     corporateCardIssueVirtualResponseJSON `json:"-"`
}

// corporateCardIssueVirtualResponseJSON contains the JSON metadata for the struct
// [CorporateCardIssueVirtualResponse]
type corporateCardIssueVirtualResponseJSON struct {
	Controls    apijson.Field
	raw         string
	ExtraFields map[string]apijson.Field
}

func (r *CorporateCardIssueVirtualResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r corporateCardIssueVirtualResponseJSON) RawJSON() string {
	return r.raw
}

type CorporateCardListParams struct {
	// Maximum number of items to return in a single page.
	Limit param.Field[int64] `query:"limit"`
	// Number of items to skip before starting to collect the result set.
	Offset param.Field[int64] `query:"offset"`
}

// URLQuery serializes [CorporateCardListParams]'s query parameters as
// `url.Values`.
func (r CorporateCardListParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}

type CorporateCardFreezeParams struct {
}

func (r CorporateCardFreezeParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}

type CorporateCardIssueVirtualParams struct {
	// Granular spending controls for a corporate card.
	Controls param.Field[interface{}] `json:"controls,required"`
}

func (r CorporateCardIssueVirtualParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
