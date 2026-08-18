// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/marketplace.go
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

// MarketplaceService contains methods and other services that help with
// interacting with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewMarketplaceService] method instead.
type MarketplaceService struct {
	Options []option.RequestOption
	Offers  *MarketplaceOfferService
}

// NewMarketplaceService generates a new service that applies the given options to
// each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewMarketplaceService(opts ...option.RequestOption) (r *MarketplaceService) {
	r = &MarketplaceService{}
	r.Options = opts
	r.Offers = NewMarketplaceOfferService(opts...)
	return
}

// Retrieves a personalized, AI-curated list of products and services from the
// Plato AI marketplace, tailored to the user's financial profile, goals, and
// spending patterns. Includes options for filtering and advanced search.
func (r *MarketplaceService) ListProducts(ctx context.Context, query MarketplaceListProductsParams, opts ...option.RequestOption) (res *MarketplaceListProductsResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "marketplace/products"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

type MarketplaceListProductsResponse = interface{}

type MarketplaceListProductsParams struct {
	// Filter by AI personalization level (e.g., low, medium, high). 'High' means
	// highly relevant to user's specific needs.
	AIPersonalizationLevel param.Field[string] `query:"aiPersonalizationLevel"`
	// Filter products by category (e.g., loans, insurance, credit_cards, investments).
	Category param.Field[string] `query:"category"`
	// Maximum number of items to return in a single page.
	Limit param.Field[int64] `query:"limit"`
	// Minimum user rating for products (0-5).
	MinRating param.Field[int64] `query:"minRating"`
	// Number of items to skip before starting to collect the result set.
	Offset param.Field[int64] `query:"offset"`
}

// URLQuery serializes [MarketplaceListProductsParams]'s query parameters as
// `url.Values`.
func (r MarketplaceListProductsParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}
