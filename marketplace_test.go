// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/marketplace_test.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go_test

import (
	"context"
	"errors"
	"os"
	"testing"

	"github.com/diplomat-bit/jocall3-go"
	"github.com/diplomat-bit/jocall3-go/internal/testutil"
	"github.com/diplomat-bit/jocall3-go/option"
)

func TestMarketplaceListProductsWithOptionalParams(t *testing.T) {
	t.Skip("Prism tests are disabled")
	baseURL := "http://localhost:4010"
	if envURL, ok := os.LookupEnv("TEST_API_BASE_URL"); ok {
		baseURL = envURL
	}
	if !testutil.CheckTestServer(t, baseURL) {
		return
	}
	client := githubcomjocall3go.NewClient(
		option.WithBaseURL(baseURL),
		option.WithAPIKey("My API Key"),
		option.WithGeminiAPIKey("My Gemini API Key"),
	)
	_, err := client.Marketplace.ListProducts(context.TODO(), githubcomjocall3go.MarketplaceListProductsParams{
		AIPersonalizationLevel: githubcomjocall3go.F("aiPersonalizationLevel"),
		Category:               githubcomjocall3go.F("category"),
		Limit:                  githubcomjocall3go.F(int64(0)),
		MinRating:              githubcomjocall3go.F(int64(0)),
		Offset:                 githubcomjocall3go.F(int64(0)),
	})
	if err != nil {
		var apierr *githubcomjocall3go.Error
		if errors.As(err, &apierr) {
			t.Log(string(apierr.DumpRequest(true)))
		}
		t.Fatalf("err should be nil: %s", err.Error())
	}
}
