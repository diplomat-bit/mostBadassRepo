// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/payment-service/internal/services/fx_service.go
================================================================================

package services

import (
	"context"
	"errors"
	"fmt"
	"log"
	"sync"
	"time"
)

// CurrencyCode represents a standard three-letter currency code (e.g., "USD", "EUR").
type CurrencyCode string

// Predefined currency codes for convenience (can be extended).
const (
	USD CurrencyCode = "USD"
	EUR CurrencyCode = "EUR"
	GBP CurrencyCode = "GBP"
	JPY CurrencyCode = "JPY"
	AUD CurrencyCode = "AUD"
	CAD CurrencyCode = "CAD"
	CHF CurrencyCode = "CHF"
	CNY CurrencyCode = "CNY"
	INR CurrencyCode = "INR"
	BRL CurrencyCode = "BRL"
)

// ExchangeRate represents a single foreign exchange rate.
type ExchangeRate struct {
	Base      CurrencyCode `json:"base_currency"`
	Target    CurrencyCode `json:"target_currency"`
	Rate      float64      `json:"rate"`
	Timestamp time.Time    `json:"timestamp"` // When the rate was last updated/fetched
}

// ConversionResult holds the details of a currency conversion.
type ConversionResult struct {
	OriginalAmount  float64      `json:"original_amount"`
	ConvertedAmount float64      `json:"converted_amount"`
	BaseCurrency    CurrencyCode `json:"base_currency"`
	TargetCurrency  CurrencyCode `json:"target_currency"`
	RateUsed        float64      `json:"rate_used"`
	Timestamp       time.Time    `json:"timestamp"` // When the conversion was performed
}

// FXProvider defines the interface for an external foreign exchange rate provider.
// Implementations will interact with specific third-party APIs (e.g., Open Exchange Rates, Fixer.io).
type FXProvider interface {
	// GetRate fetches the exchange rate between a base and target currency.
	// It should return an error if the rate cannot be fetched (e.g., network error, invalid currency).
	GetRate(ctx context.Context, base, target CurrencyCode) (*ExchangeRate, error)
}

// FXService defines the interface for our internal foreign exchange service.
type FXService interface {
	// GetExchangeRate retrieves the current exchange rate for a given currency pair.
	// It should utilize caching to reduce external API calls.
	GetExchangeRate(ctx context.Context, base, target CurrencyCode) (*ExchangeRate, error)

	// Convert performs a currency conversion from one amount and currency to another.
	Convert(ctx context.Context, amount float64, from, to CurrencyCode) (*ConversionResult, error)
}

// cacheEntry stores an exchange rate along with its expiry time.
type cacheEntry struct {
	rate   *ExchangeRate
	expiry time.Time
}

// fxService is the concrete implementation of the FXService interface.
type fxService struct {
	provider  FXProvider
	cache     map[string]cacheEntry
	mu        sync.RWMutex // Mutex for protecting cache access
	cacheTTL  time.Duration
	logger    *log.Logger
	baseRates map[CurrencyCode]float64 // A simple map for mock provider base rates
}

// NewFXService creates and returns a new instance of the FXService.
// It requires an FXProvider implementation, a cache Time-To-Live, and a logger.
func NewFXService(provider FXProvider, cacheTTL time.Duration, logger *log.Logger) FXService {
	if logger == nil {
		logger = log.Default() // Fallback to default logger if none provided
	}
	return &fxService{
		provider: provider,
		cache:    make(map[string]cacheEntry),
		cacheTTL: cacheTTL,
		logger:   logger,
		// Initialize base rates for the mock provider if it's used.
		// In a real scenario, this would be handled by the actual FXProvider implementation.
		baseRates: map[CurrencyCode]float64{
			USD: 1.0, // USD is the base for these mock rates
			EUR: 0.92,
			GBP: 0.79,
			JPY: 155.0,
			AUD: 1.50,
			CAD: 1.36,
			CHF: 0.90,
			CNY: 7.25,
			INR: 83.50,
			BRL: 5.15,
		},
	}
}

// GetExchangeRate retrieves the current exchange rate for a given currency pair.
// It first checks the cache. If the rate is found and not expired, it returns the cached rate.
// Otherwise, it fetches the rate from the underlying FXProvider, caches it, and then returns it.
func (s *fxService) GetExchangeRate(ctx context.Context, base, target CurrencyCode) (*ExchangeRate, error) {
	if base == target {
		return &ExchangeRate{Base: base, Target: target, Rate: 1.0, Timestamp: time.Now()}, nil
	}

	cacheKey := fmt.Sprintf("%s_%s", base, target)

	// Try to get from cache
	s.mu.RLock()
	entry, found := s.cache[cacheKey]
	s.mu.RUnlock()

	if found && time.Now().Before(entry.expiry) {
		s.logger.Printf("INFO: Cache hit for %s/%s", base, target)
		return entry.rate, nil
	}

	s.logger.Printf("INFO: Cache miss or expired for %s/%s, fetching from provider...", base, target)

	// Fetch from provider
	rate, err := s.provider.GetRate(ctx, base, target)
	if err != nil {
		s.logger.Printf("ERROR: Failed to fetch rate for %s/%s from provider: %v", base, target, err)
		return nil, fmt.Errorf("failed to fetch exchange rate: %w", err)
	}

	// Store in cache
	s.mu.Lock()
	s.cache[cacheKey] = cacheEntry{
		rate:   rate,
		expiry: time.Now().Add(s.cacheTTL),
	}
	s.mu.Unlock()

	s.logger.Printf("INFO: Fetched and cached rate for %s/%s: %.4f", base, target, rate.Rate)
	return rate, nil
}

// Convert performs a currency conversion from one amount and currency to another.
// It fetches the necessary exchange rate using GetExchangeRate and then calculates the converted amount.
func (s *fxService) Convert(ctx context.Context, amount float64, from, to CurrencyCode) (*ConversionResult, error) {
	if amount < 0 {
		return nil, errors.New("amount to convert cannot be negative")
	}

	rate, err := s.GetExchangeRate(ctx, from, to)
	if err != nil {
		return nil, fmt.Errorf("could not get exchange rate for conversion: %w", err)
	}

	convertedAmount := amount * rate.Rate

	return &ConversionResult{
		OriginalAmount:  amount,
		ConvertedAmount: convertedAmount,
		BaseCurrency:    from,
		TargetCurrency:  to,
		RateUsed:        rate.Rate,
		Timestamp:       time.Now(),
	}, nil
}

// --- Mock FX Provider Implementation ---
// This mock provider simulates an external API for testing and demonstration purposes.
// In a real application, you would replace this with an actual client for a third-party FX API.

// mockFXProvider is a simple implementation of FXProvider for testing.
type mockFXProvider struct {
	logger    *log.Logger
	baseRates map[CurrencyCode]float64 // Rates relative to a common base (e.g., USD)
}

// NewMockFXProvider creates a new mock FX provider.
func NewMockFXProvider(logger *log.Logger) FXProvider {
	if logger == nil {
		logger = log.Default()
	}
	return &mockFXProvider{
		logger: logger,
		baseRates: map[CurrencyCode]float64{
			USD: 1.0, // USD is the base for these mock rates
			EUR: 0.92,
			GBP: 0.79,
			JPY: 155.0,
			AUD: 1.50,
			CAD: 1.36,
			CHF: 0.90,
			CNY: 7.25,
			INR: 83.50,
			BRL: 5.15,
		},
	}
}

// GetRate simulates fetching an exchange rate from an external service.
// It uses a fixed set of rates relative to USD and calculates cross rates.
func (m *mockFXProvider) GetRate(ctx context.Context, base, target CurrencyCode) (*ExchangeRate, error) {
	m.logger.Printf("DEBUG: MockFXProvider fetching rate for %s/%s (simulating external call)...", base, target)

	// Simulate network delay
	select {
	case <-time.After(100 * time.Millisecond): // Simulate a small delay
	case <-ctx.Done():
		return nil, ctx.Err() // Respect context cancellation
	}

	baseRateUSD, ok := m.baseRates[base]
	if !ok {
		return nil, fmt.Errorf("unsupported base currency: %s", base)
	}
	targetRateUSD, ok := m.baseRates[target]
	if !ok {
		return nil, fmt.Errorf("unsupported target currency: %s", target)
	}

	// Calculate cross rate: (Target / USD) / (Base / USD) = Target / Base
	rate := targetRateUSD / baseRateUSD

	return &ExchangeRate{
		Base:      base,
		Target:    target,
		Rate:      rate,
		Timestamp: time.Now(),
	}, nil
}