// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/marketplaceoffer.go
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

// MarketplaceOfferService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewMarketplaceOfferService] method instead.
type MarketplaceOfferService struct {
	Options []option.RequestOption
}

// NewMarketplaceOfferService generates a new service that applies the given
// options to each request. These options are applied after the parent client's
// options (if there is one), and before any request-specific options.
func NewMarketplaceOfferService(opts ...option.RequestOption) (r *MarketplaceOfferService) {
	r = &MarketplaceOfferService{}
	r.Options = opts
	return
}

// Redeems a personalized, exclusive offer from the Plato AI marketplace, often
// resulting in a discount, special rate, or credit to the user's account.
func (r *MarketplaceOfferService) Redeem(ctx context.Context, offerID string, body MarketplaceOfferRedeemParams, opts ...option.RequestOption) (res *MarketplaceOfferRedeemResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	if offerID == "" {
		err = errors.New("missing required offerId parameter")
		return
	}
	path := fmt.Sprintf("marketplace/offers/%s/redeem", offerID)
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

type MarketplaceOfferRedeemResponse = interface{}

type MarketplaceOfferRedeemParams struct {
}

func (r MarketplaceOfferRedeemParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}
