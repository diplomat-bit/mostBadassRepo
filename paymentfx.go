// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/paymentfx.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"context"
	"net/http"
	"net/url"
	"slices"

	"github.com/diplomat-bit/jocall3-go/internal/apijson"
	"github.com/diplomat-bit/jocall3-go/internal/apiquery"
	"github.com/diplomat-bit/jocall3-go/internal/param"
	"github.com/diplomat-bit/jocall3-go/internal/requestconfig"
	"github.com/diplomat-bit/jocall3-go/option"
)

// PaymentFxService contains methods and other services that help with interacting
// with the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewPaymentFxService] method instead.
type PaymentFxService struct {
	Options []option.RequestOption
}

// NewPaymentFxService generates a new service that applies the given options to
// each request. These options are applied after the parent client's options (if
// there is one), and before any request-specific options.
func NewPaymentFxService(opts ...option.RequestOption) (r *PaymentFxService) {
	r = &PaymentFxService{}
	r.Options = opts
	return
}

// Executes an instant currency conversion between two currencies, either from a
// balance or into a specified account.
func (r *PaymentFxService) Convert(ctx context.Context, body PaymentFxConvertParams, opts ...option.RequestOption) (res *PaymentFxConvertResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "payments/fx/convert"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodPost, path, body, &res, opts...)
	return
}

// Retrieves current and AI-predicted future foreign exchange rates for a specified
// currency pair, including bid/ask spreads and historical volatility data for
// informed decisions.
func (r *PaymentFxService) GetRates(ctx context.Context, query PaymentFxGetRatesParams, opts ...option.RequestOption) (res *PaymentFxGetRatesResponse, err error) {
	opts = slices.Concat(r.Options, opts)
	path := "payments/fx/rates"
	err = requestconfig.ExecuteNewRequest(ctx, http.MethodGet, path, query, &res, opts...)
	return
}

type PaymentFxConvertResponse = interface{}

type PaymentFxGetRatesResponse struct {
	// Real-time foreign exchange rates.
	CurrentRate          interface{}                   `json:"currentRate,required"`
	HistoricalVolatility interface{}                   `json:"historicalVolatility"`
	JSON                 paymentFxGetRatesResponseJSON `json:"-"`
}

// paymentFxGetRatesResponseJSON contains the JSON metadata for the struct
// [PaymentFxGetRatesResponse]
type paymentFxGetRatesResponseJSON struct {
	CurrentRate          apijson.Field
	HistoricalVolatility apijson.Field
	raw                  string
	ExtraFields          map[string]apijson.Field
}

func (r *PaymentFxGetRatesResponse) UnmarshalJSON(data []byte) (err error) {
	return apijson.UnmarshalRoot(data, r)
}

func (r paymentFxGetRatesResponseJSON) RawJSON() string {
	return r.raw
}

type PaymentFxConvertParams struct {
}

func (r PaymentFxConvertParams) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(r)
}

type PaymentFxGetRatesParams struct {
	// The base currency code (e.g., USD).
	BaseCurrency param.Field[string] `query:"baseCurrency"`
	// Number of days into the future to provide an AI-driven prediction.
	ForecastDays param.Field[int64] `query:"forecastDays"`
	// The target currency code (e.g., EUR).
	TargetCurrency param.Field[string] `query:"targetCurrency"`
}

// URLQuery serializes [PaymentFxGetRatesParams]'s query parameters as
// `url.Values`.
func (r PaymentFxGetRatesParams) URLQuery() (v url.Values) {
	return apiquery.MarshalWithSettings(r, apiquery.QuerySettings{
		ArrayFormat:  apiquery.ArrayQueryFormatComma,
		NestedFormat: apiquery.NestedQueryFormatBrackets,
	})
}
