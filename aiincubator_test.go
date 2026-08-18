// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/aiincubator_test.go
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

func TestAIIncubatorGeneratePitch(t *testing.T) {
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
	_, err := client.AI.Incubator.GeneratePitch(context.TODO(), githubcomjocall3go.AIIncubatorGeneratePitchParams{
		FinancialProjections: githubcomjocall3go.F[any](map[string]interface{}{
			"seedRoundAmount":   2500000,
			"valuationPreMoney": 10000000,
			"projectionYears":   3,
			"revenueForecast": []float64{
				500000,
				2000000,
				6000000,
			},
			"profitabilityEstimate": "Achieve profitability within 18 months.",
		}),
	})
	if err != nil {
		var apierr *githubcomjocall3go.Error
		if errors.As(err, &apierr) {
			t.Log(string(apierr.DumpRequest(true)))
		}
		t.Fatalf("err should be nil: %s", err.Error())
	}
}
