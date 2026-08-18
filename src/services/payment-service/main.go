// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/payment-service/main.go
================================================================================

package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"go.uber.org/zap"
)

// Config holds all application configuration
type Config struct {
	Port             string `mapstructure:"PORT"`
	DatabaseURL      string `mapstructure:"DATABASE_URL"`
	StripeAPIKey     string `mapstructure:"STRIPE_API_KEY"`
	AdyenAPIKey      string `mapstructure:"ADYEN_API_KEY"`
	FXProviderAPIKey string `mapstructure:"FX_PROVIDER_API_KEY"`
	Environment      string `mapstructure:"ENVIRONMENT"` // e.g., "development", "production"
}

// Logger instance
var logger *zap.Logger

// initLogger initializes the Zap logger based on the environment.
func initLogger(env string) {
	var err error
	if env == "production" {
		logger, err = zap.NewProduction()
	} else {
		logger, err = zap.NewDevelopment()
	}
	if err != nil {
		fmt.Printf("Failed to initialize logger: %v\n", err)
		os.Exit(1)
	}
	// Defer syncing the logger to ensure all buffered logs are written before the application exits.
	// This is important for production environments.
	defer logger.Sync()
}

// loadConfig loads configuration from environment variables or a .env file.
func loadConfig() (*Config, error) {
	viper.SetConfigFile(".env") // Look for .env file
	viper.AutomaticEnv()        // Read environment variables

	// Set default values
	viper.SetDefault("PORT", "8080")
	viper.SetDefault("ENVIRONMENT", "development")

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// Config file not found; ignore error if env vars are expected
			fmt.Println("No .env file found, relying on environment variables.")
		} else {
			return nil, fmt.Errorf("failed to read config file: %w", err)
		}
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	// Basic validation and warnings for missing critical keys
	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}
	if cfg.StripeAPIKey == "" {
		// In a real scenario, this might be a fatal error if Stripe is a primary processor.
		// For this example, we'll just warn.
		logger.Warn("STRIPE_API_KEY not set. Stripe integration might be limited or unavailable.")
	}
	if cfg.AdyenAPIKey == "" {
		logger.Warn("ADYEN_API_KEY not set. Adyen integration might be limited or unavailable.")
	}
	if cfg.FXProviderAPIKey == "" {
		logger.Warn("FX_PROVIDER_API_KEY not set. FX conversion might be limited or unavailable.")
	}

	return &cfg, nil
}

// --- Mock/Placeholder Implementations for Dependencies ---
// In a real-world project, these would be in separate packages (e.g., `internal/models`, `internal/database`, `internal/paymentprocessor`, `internal/fx`).
// They are included here for self-containment as per the single-file requirement.

// Payment represents a payment transaction in the system.
type Payment struct {
	ID             string    `json:"id"`
	UserID         string    `json:"user_id"`
	Amount         float64   `json:"amount"`
	Currency       string    `json:"currency"`
	TargetAmount   float64   `json:"target_amount,omitempty"` // Amount after FX conversion
	TargetCurrency string    `json:"target_currency,omitempty"` // Currency after FX conversion
	Processor      string    `json:"processor"`
	ProcessorTxID  string    `json:"processor_tx_id"` // Transaction ID from the external payment processor
	Status         string    `json:"status"`          // e.g., "pending", "completed", "failed", "refunded", "partially_refunded"
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// Database interface for payment storage and retrieval.
type Database interface {
	Connect(ctx context.Context, url string) error
	Close(ctx context.Context) error
	CreatePayment(ctx context.Context, payment *Payment) error
	GetPaymentByID(ctx context.Context, id string) (*Payment, error)
	UpdatePaymentStatus(ctx context.Context, id, status, processorTxID string) error
	// Add more methods as needed, e.g., GetPaymentsByUserID, UpdatePaymentDetails, etc.
}

// MockDatabase implements the Database interface for demonstration purposes.
type MockDatabase struct {
	payments map[string]*Payment
	logger   *zap.Logger
}

// NewMockDatabase creates a new instance of MockDatabase.
func NewMockDatabase(logger *zap.Logger) *MockDatabase {
	return &MockDatabase{
		payments: make(map[string]*Payment),
		logger:   logger,
	}
}

// Connect simulates a database connection.
func (m *MockDatabase) Connect(ctx context.Context, url string) error {
	m.logger.Info("MockDatabase connected", zap.String("url", url))
	return nil
}

// Close simulates closing a database connection.
func (m *MockDatabase) Close(ctx context.Context) error {
	m.logger.Info("MockDatabase closed")
	return nil
}

// CreatePayment adds a new payment record to the mock database.
func (m *MockDatabase) CreatePayment(ctx context.Context, payment *Payment) error {
	payment.ID = fmt.Sprintf("pay_%d", time.Now().UnixNano()) // Simple ID generation
	payment.CreatedAt = time.Now()
	payment.UpdatedAt = time.Now()
	m.payments[payment.ID] = payment
	m.logger.Info("MockDatabase: Payment created", zap.String("payment_id", payment.ID), zap.String("status", payment.Status))
	return nil
}

// GetPaymentByID retrieves a payment record by its ID.
func (m *MockDatabase) GetPaymentByID(ctx context.Context, id string) (*Payment, error) {
	payment, ok := m.payments[id]
	if !ok {
		return nil, fmt.Errorf("payment with ID %s not found", id)
	}
	return payment, nil
}

// UpdatePaymentStatus updates the status and processor transaction ID of a payment.
func (m *MockDatabase) UpdatePaymentStatus(ctx context.Context, id, status, processorTxID string) error {
	payment, ok := m.payments[id]
	if !ok {
		return fmt.Errorf("payment with ID %s not found", id)
	}
	payment.Status = status
	payment.ProcessorTxID = processorTxID
	payment.UpdatedAt = time.Now()
	m.logger.Info("MockDatabase: Payment status updated", zap.String("payment_id", id), zap.String("status", status), zap.String("processor_tx_id", processorTxID))
	return nil
}

// PaymentProcessor interface for external payment gateways like Stripe or Adyen.
type PaymentProcessor interface {
	ProcessPayment(ctx context.Context, amount float64, currency, token string) (string, error) // returns processor transaction ID
	RefundPayment(ctx context.Context, processorTxID string, amount float64) error
	GetPaymentStatus(ctx context.Context, processorTxID string) (string, error)
	// Add methods for webhook verification, recurring payments, etc.
}

// MockStripeProcessor implements PaymentProcessor for Stripe.
type MockStripeProcessor struct {
	apiKey string
	logger *zap.Logger
}

// NewMockStripeProcessor creates a new instance of MockStripeProcessor.
func NewMockStripeProcessor(apiKey string, logger *zap.Logger) *MockStripeProcessor {
	return &MockStripeProcessor{apiKey: apiKey, logger: logger}
}

// ProcessPayment simulates processing a payment via Stripe.
func (m *MockStripeProcessor) ProcessPayment(ctx context.Context, amount float64, currency, token string) (string, error) {
	m.logger.Info("MockStripe: Processing payment", zap.Float64("amount", amount), zap.String("currency", currency), zap.String("token", token))
	time.Sleep(100 * time.Millisecond) // Simulate network latency
	if token == "fail" {
		return "", fmt.Errorf("mock stripe: payment failed for token 'fail'")
	}
	return fmt.Sprintf("stripe_tx_%d", time.Now().UnixNano()), nil
}

// RefundPayment simulates refunding a payment via Stripe.
func (m *MockStripeProcessor) RefundPayment(ctx context.Context, processorTxID string, amount float64) error {
	m.logger.Info("MockStripe: Refunding payment", zap.String("tx_id", processorTxID), zap.Float64("amount", amount))
	time.Sleep(50 * time.Millisecond) // Simulate network latency
	return nil
}

// GetPaymentStatus simulates getting payment status from Stripe.
func (m *MockStripeProcessor) GetPaymentStatus(ctx context.Context, processorTxID string) (string, error) {
	m.logger.Info("MockStripe: Getting payment status", zap.String("tx_id", processorTxID))
	time.Sleep(20 * time.Millisecond) // Simulate network latency
	return "succeeded", nil           // Always succeed for mock
}

// MockAdyenProcessor implements PaymentProcessor for Adyen.
type MockAdyenProcessor struct {
	apiKey string
	logger *zap.Logger
}

// NewMockAdyenProcessor creates a new instance of MockAdyenProcessor.
func NewMockAdyenProcessor(apiKey string, logger *zap.Logger) *MockAdyenProcessor {
	return &MockAdyenProcessor{apiKey: apiKey, logger: logger}
}

// ProcessPayment simulates processing a payment via Adyen.
func (m *MockAdyenProcessor) ProcessPayment(ctx context.Context, amount float64, currency, token string) (string, error) {
	m.logger.Info("MockAdyen: Processing payment", zap.Float64("amount", amount), zap.String("currency", currency), zap.String("token", token))
	time.Sleep(120 * time.Millisecond) // Simulate network latency
	if token == "fail" {
		return "", fmt.Errorf("mock adyen: payment failed for token 'fail'")
	}
	return fmt.Sprintf("adyen_tx_%d", time.Now().UnixNano()), nil
}

// RefundPayment simulates refunding a payment via Adyen.
func (m *MockAdyenProcessor) RefundPayment(ctx context.Context, processorTxID string, amount float64) error {
	m.logger.Info("MockAdyen: Refunding payment", zap.String("tx_id", processorTxID), zap.Float64("amount", amount))
	time.Sleep(60 * time.Millisecond) // Simulate network latency
	return nil
}

// GetPaymentStatus simulates getting payment status from Adyen.
func (m *MockAdyenProcessor) GetPaymentStatus(ctx context.Context, processorTxID string) (string, error) {
	m.logger.Info("MockAdyen: Getting payment status", zap.String("tx_id", processorTxID))
	time.Sleep(25 * time.Millisecond) // Simulate network latency
	return "Authorised", nil          // Always authorised for mock
}

// FXService interface for foreign exchange operations.
type FXService interface {
	GetExchangeRate(ctx context.Context, fromCurrency, toCurrency string) (float64, error)
	ConvertAmount(ctx context.Context, amount float64, fromCurrency, toCurrency string) (float64, error)
}

// MockFXService implements FXService for demonstration.
type MockFXService struct {
	apiKey string
	logger *zap.Logger
}

// NewMockFXService creates a new instance of MockFXService.
func NewMockFXService(apiKey string, logger *zap.Logger) *MockFXService {
	return &MockFXService{apiKey: apiKey, logger: logger}
}

// GetExchangeRate simulates fetching an exchange rate.
func (m *MockFXService) GetExchangeRate(ctx context.Context, fromCurrency, toCurrency string) (float64, error) {
	m.logger.Info("MockFX: Getting exchange rate", zap.String("from", fromCurrency), zap.String("to", toCurrency))
	time.Sleep(30 * time.Millisecond) // Simulate network latency
	// Simple mock rates
	if fromCurrency == "USD" && toCurrency == "EUR" {
		return 0.92, nil
	}
	if fromCurrency == "EUR" && toCurrency == "USD" {
		return 1.08, nil
	}
	if fromCurrency == toCurrency {
		return 1.0, nil
	}
	return 0.85, nil // Default mock rate for other conversions
}

// ConvertAmount converts an amount from one currency to another using mock rates.
func (m *MockFXService) ConvertAmount(ctx context.Context, amount float64, fromCurrency, toCurrency string) (float64, error) {
	rate, err := m.GetExchangeRate(ctx, fromCurrency, toCurrency)
	if err != nil {
		return 0, err
	}
	return amount * rate, nil
}

// --- Core Business Logic (Service Layer) ---

// PaymentService orchestrates payment operations, interacting with DB, processors, and FX.
type PaymentService struct {
	db     Database
	stripe PaymentProcessor
	adyen  PaymentProcessor
	fx     FXService
	logger *zap.Logger
}

// NewPaymentService creates a new instance of PaymentService.
func NewPaymentService(db Database, stripe, adyen PaymentProcessor, fx FXService, logger *zap.Logger) *PaymentService {
	return &PaymentService{
		db:     db,
		stripe: stripe,
		adyen:  adyen,
		fx:     fx,
		logger: logger,
	}
}

// ProcessPaymentRequest defines the request payload for processing a payment.
type ProcessPaymentRequest struct {
	UserID         string  `json:"user_id" binding:"required"`
	Amount         float64 `json:"amount" binding:"required,gt=0"`
	Currency       string  `json:"currency" binding:"required,len=3"` // e.g., "USD", "EUR"
	PaymentToken   string  `json:"payment_token" binding:"required"`  // e.g., Stripe token, Adyen token
	Processor      string  `json:"processor" binding:"required,oneof=stripe adyen"`
	TargetCurrency string  `json:"target_currency,omitempty" binding:"omitempty,len=3"` // For FX conversion
}

// ProcessPayment handles the business logic for initiating and completing a payment.
func (s *PaymentService) ProcessPayment(ctx context.Context, req *ProcessPaymentRequest) (*Payment, error) {
	s.logger.Info("Processing payment request", zap.Any("request", req))

	// 1. Handle FX conversion if target currency is specified and different from source.
	var finalAmount = req.Amount
	var finalCurrency = req.Currency
	if req.TargetCurrency != "" && req.TargetCurrency != req.Currency {
		convertedAmount, err := s.fx.ConvertAmount(ctx, req.Amount, req.Currency, req.TargetCurrency)
		if err != nil {
			s.logger.Error("FX conversion failed", zap.Error(err),
				zap.Float64("original_amount", req.Amount), zap.String("original_currency", req.Currency),
				zap.String("target_currency", req.TargetCurrency))
			return nil, fmt.Errorf("failed to convert currency from %s to %s: %w", req.Currency, req.TargetCurrency, err)
		}
		finalAmount = convertedAmount
		finalCurrency = req.TargetCurrency
		s.logger.Info("Amount converted",
			zap.Float64("original_amount", req.Amount), zap.String("original_currency", req.Currency),
			zap.Float64("converted_amount", finalAmount), zap.String("converted_currency", finalCurrency))
	}

	// 2. Create a pending payment record in our internal database.
	payment := &Payment{
		UserID:         req.UserID,
		Amount:         req.Amount,
		Currency:       req.Currency,
		TargetAmount:   finalAmount,
		TargetCurrency: finalCurrency,
		Processor:      req.Processor,
		Status:         "pending", // Initial status
	}
	if err := s.db.CreatePayment(ctx, payment); err != nil {
		s.logger.Error("Failed to create pending payment record", zap.Error(err))
		return nil, fmt.Errorf("failed to create payment record: %w", err)
	}

	// 3. Route the payment to the appropriate external payment processor.
	var processor PaymentProcessor
	switch req.Processor {
	case "stripe":
		processor = s.stripe
	case "adyen":
		processor = s.adyen
	default:
		s.logger.Error("Unsupported payment processor", zap.String("processor", req.Processor))
		// Update payment status to failed if processor is unsupported
		_ = s.db.UpdatePaymentStatus(ctx, payment.ID, "failed", "") // Best effort update
		return nil, fmt.Errorf("unsupported payment processor: %s", req.Processor)
	}

	processorTxID, err := processor.ProcessPayment(ctx, finalAmount, finalCurrency, req.PaymentToken)
	if err != nil {
		s.logger.Error("Payment processor failed", zap.String("processor", req.Processor), zap.Error(err), zap.String("payment_id", payment.ID))
		// Update payment status to failed
		_ = s.db.UpdatePaymentStatus(ctx, payment.ID, "failed", "") // Best effort update
		return nil, fmt.Errorf("payment processing failed with %s: %w", req.Processor, err)
	}

	// 4. Update the internal payment record with success status and the processor's transaction ID.
	if err := s.db.UpdatePaymentStatus(ctx, payment.ID, "completed", processorTxID); err != nil {
		s.logger.Error("Failed to update payment status to completed", zap.String("payment_id", payment.ID), zap.Error(err))
		// This is a critical error: the payment might have completed successfully with the processor,
		// but our internal record is not updated. This requires manual intervention or a robust
		// reconciliation process to prevent discrepancies.
		return nil, fmt.Errorf("payment completed but failed to update internal record: %w", err)
	}
	payment.Status = "completed"
	payment.ProcessorTxID = processorTxID

	s.logger.Info("Payment successfully processed", zap.String("payment_id", payment.ID), zap.String("processor_tx_id", processorTxID))
	return payment, nil
}

// GetPaymentStatus retrieves the current status and details of a payment from the internal database.
func (s *PaymentService) GetPaymentStatus(ctx context.Context, paymentID string) (*Payment, error) {
	s.logger.Info("Getting payment status", zap.String("payment_id", paymentID))
	payment, err := s.db.GetPaymentByID(ctx, paymentID)
	if err != nil {
		s.logger.Error("Failed to get payment from DB", zap.String("payment_id", paymentID), zap.Error(err))
		return nil, fmt.Errorf("payment not found: %w", err)
	}

	// In a more advanced system, you might optionally query the external processor
	// for the absolute latest status, especially for "pending" payments.
	// For simplicity, this example relies on the internal record.
	return payment, nil
}

// RefundPaymentRequest defines the request payload for refunding a payment.
type RefundPaymentRequest struct {
	PaymentID string  `json:"payment_id" binding:"required"`
	Amount    float64 `json:"amount" binding:"required,gt=0"`
}

// RefundPayment handles the business logic for initiating a refund for a previously processed payment.
func (s *PaymentService) RefundPayment(ctx context.Context, req *RefundPaymentRequest) (*Payment, error) {
	s.logger.Info("Refunding payment request", zap.Any("request", req))

	// 1. Retrieve the original payment details from the database.
	payment, err := s.db.GetPaymentByID(ctx, req.PaymentID)
	if err != nil {
		s.logger.Error("Failed to get payment for refund", zap.String("payment_id", req.PaymentID), zap.Error(err))
		return nil, fmt.Errorf("payment not found for refund: %w", err)
	}

	// 2. Validate refund conditions.
	if payment.Status != "completed" && payment.Status != "partially_refunded" {
		return nil, fmt.Errorf("payment %s is in '%s' state and cannot be refunded. Only 'completed' or 'partially_refunded' payments can be refunded", payment.ID, payment.Status)
	}
	if payment.ProcessorTxID == "" {
		return nil, fmt.Errorf("payment %s has no processor transaction ID, cannot initiate refund with external processor", payment.ID)
	}
	// Note: A more robust system would track refunded amounts to ensure total refunds don't exceed original amount.
	// For simplicity, this example assumes a full refund or a partial refund up to the original target amount.
	if req.Amount > payment.TargetAmount {
		return nil, fmt.Errorf("refund amount %.2f exceeds original payment amount %.2f", req.Amount, payment.TargetAmount)
	}

	// 3. Route the refund request to the appropriate external payment processor.
	var processor PaymentProcessor
	switch payment.Processor {
	case "stripe":
		processor = s.stripe
	case "adyen":
		processor = s.adyen
	default:
		s.logger.Error("Unsupported payment processor for refund", zap.String("processor", payment.Processor))
		return nil, fmt.Errorf("unsupported payment processor for refund: %s", payment.Processor)
	}

	if err := processor.RefundPayment(ctx, payment.ProcessorTxID, req.Amount); err != nil {
		s.logger.Error("Payment processor failed to refund", zap.String("processor", payment.Processor), zap.Error(err), zap.String("payment_id", payment.ID))
		return nil, fmt.Errorf("refund failed with %s: %w", payment.Processor, err)
	}

	// 4. Update the internal payment record's status.
	newStatus := "refunded" // Assume full refund for simplicity, or if remaining amount is zero
	if req.Amount < payment.TargetAmount {
		// A more complex system would track `refunded_amount` and update it.
		// For this example, we'll just mark it as partially refunded if the amount is less than original.
		newStatus = "partially_refunded"
	}
	if err := s.db.UpdatePaymentStatus(ctx, payment.ID, newStatus, payment.ProcessorTxID); err != nil {
		s.logger.Error("Failed to update payment status to refunded", zap.String("payment_id", payment.ID), zap.Error(err))
		// Critical error: refund completed with processor, but internal record not updated.
		return nil, fmt.Errorf("refund completed but failed to update internal record: %w", err)
	}
	payment.Status = newStatus

	s.logger.Info("Payment successfully refunded", zap.String("payment_id", payment.ID), zap.String("processor_tx_id", payment.ProcessorTxID), zap.Float64("refund_amount", req.Amount))
	return payment, nil
}

// --- HTTP Handlers (Controller Layer) ---

// PaymentHandler handles HTTP requests related to payments.
type PaymentHandler struct {
	service *PaymentService
	logger  *zap.Logger
}

// NewPaymentHandler creates a new instance of PaymentHandler.
func NewPaymentHandler(service *PaymentService, logger *zap.Logger) *PaymentHandler {
	return &PaymentHandler{service: service, logger: logger}
}

// ProcessPayment godoc
// @Summary Process a new payment
// @Description Initiates a payment transaction through a specified processor, handling FX if needed.
// @Tags payments
// @Accept json
// @Produce json
// @Param payment body ProcessPaymentRequest true "Payment request details"
// @Success 200 {object} Payment "Payment successfully processed"
// @Failure 400 {object} map[string]string "Bad request (e.g., invalid input)"
// @Failure 500 {object} map[string]string "Internal server error (e.g., processor failure, DB error)"
// @Router /payments [post]
func (h *PaymentHandler) ProcessPayment(c *gin.Context) {
	var req ProcessPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Error("Invalid process payment request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	payment, err := h.service.ProcessPayment(c.Request.Context(), &req)
	if err != nil {
		h.logger.Error("Failed to process payment", zap.Error(err), zap.Any("request", req))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, payment)
}

// GetPaymentStatus godoc
// @Summary Get payment status by ID
// @Description Retrieves the current status and details of a payment from the internal system.
// @Tags payments
// @Produce json
// @Param id path string true "Payment ID"
// @Success 200 {object} Payment "Payment details"
// @Failure 400 {object} map[string]string "Bad request (e.g., missing ID)"
// @Failure 404 {object} map[string]string "Payment not found"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /payments/{id} [get]
func (h *PaymentHandler) GetPaymentStatus(c *gin.Context) {
	paymentID := c.Param("id")
	if paymentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment ID is required"})
		return
	}

	payment, err := h.service.GetPaymentStatus(c.Request.Context(), paymentID)
	if err != nil {
		h.logger.Error("Failed to get payment status", zap.String("payment_id", paymentID), zap.Error(err))
		// Check for specific error types to return appropriate HTTP status codes
		if err.Error() == fmt.Sprintf("payment not found: payment with ID %s not found", paymentID) { // Crude check for mock DB error
			c.JSON(http.StatusNotFound, gin.H{"error": "payment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, payment)
}

// RefundPayment godoc
// @Summary Refund a payment
// @Description Initiates a refund for a previously processed payment.
// @Tags payments
// @Accept json
// @Produce json
// @Param refund body RefundPaymentRequest true "Refund request details"
// @Success 200 {object} Payment "Payment successfully refunded"
// @Failure 400 {object} map[string]string "Bad request (e.g., invalid input, invalid payment status)"
// @Failure 404 {object} map[string]string "Payment not found"
// @Failure 500 {object} map[string]string "Internal server error (e.g., processor failure, DB error)"
// @Router /payments/refund [post]
func (h *PaymentHandler) RefundPayment(c *gin.Context) {
	var req RefundPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Error("Invalid refund payment request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	payment, err := h.service.RefundPayment(c.Request.Context(), &req)
	if err != nil {
		h.logger.Error("Failed to refund payment", zap.Error(err), zap.Any("request", req))
		// Check for specific error types to return appropriate HTTP status codes
		if err.Error() == fmt.Sprintf("payment not found for refund: payment with ID %s not found", req.PaymentID) {
			c.JSON(http.StatusNotFound, gin.H{"error": "payment not found"})
			return
		}
		// For other business logic errors (e.g., "payment not in 'completed' state"), return 400
		if _, ok := err.(interface{ IsBadRequest() bool }); ok { // Example of custom error type check
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, payment)
}

// HealthCheck godoc
// @Summary Service health check
// @Description Checks if the service is up and running.
// @Tags health
// @Produce json
// @Success 200 {object} map[string]string "Service is healthy"
// @Router /health [get]
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "UP", "service": "payment-service"})
}

func main() {
	// 1. Load Configuration
	cfg, err := loadConfig()
	if err != nil {
		fmt.Printf("Error loading configuration: %v\n", err)
		os.Exit(1)
	}

	// 2. Initialize Logger (after config is loaded to determine environment)
	initLogger(cfg.Environment)
	logger.Info("Payment Service starting...", zap.String("environment", cfg.Environment), zap.String("port", cfg.Port))

	// 3. Initialize Dependencies
	// Use a context with timeout for dependency initialization to prevent indefinite waits.
	initCtx, initCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer initCancel()

	// Database
	db := NewMockDatabase(logger) // Using mock for demonstration. Replace with actual DB client (e.g., PostgreSQL, MongoDB)
	if err := db.Connect(initCtx, cfg.DatabaseURL); err != nil {
		logger.Fatal("Failed to connect to database", zap.Error(err))
	}
	// Ensure database connection is closed on application exit.
	defer func() {
		if err := db.Close(context.Background()); err != nil {
			logger.Error("Failed to close database connection", zap.Error(err))
		}
	}()

	// Payment Processors
	stripeProcessor := NewMockStripeProcessor(cfg.StripeAPIKey, logger) // Replace with actual Stripe client
	adyenProcessor := NewMockAdyenProcessor(cfg.AdyenAPIKey, logger)     // Replace with actual Adyen client

	// FX Service
	fxService := NewMockFXService(cfg.FXProviderAPIKey, logger) // Replace with actual FX provider client

	// 4. Initialize Service Layer (Business Logic)
	paymentService := NewPaymentService(db, stripeProcessor, adyenProcessor, fxService, logger)

	// 5. Initialize Handler Layer (HTTP API)
	paymentHandler := NewPaymentHandler(paymentService, logger)

	// 6. Setup Gin Router
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode) // Set Gin to release mode for production
	}
	router := gin.New() // Use gin.New() for more control over middleware
	router.Use(gin.Logger()) // Gin's default logger for request logs
	router.Use(gin.Recovery()) // Recover from panics and return 500

	// Health check endpoint
	router.GET("/health", HealthCheck)

	// Payment API group
	payments := router.Group("/payments")
	{
		payments.POST("/", paymentHandler.ProcessPayment)
		payments.GET("/:id", paymentHandler.GetPaymentStatus)
		payments.POST("/refund", paymentHandler.RefundPayment)
		// Add webhook endpoints here for payment processor callbacks (e.g., Stripe, Adyen)
		// payments.POST("/webhooks/stripe", paymentHandler.StripeWebhook)
		// payments.POST("/webhooks/adyen", paymentHandler.AdyenWebhook)
	}

	// 7. Start HTTP Server
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
		// Add timeouts for production readiness
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Run the server in a goroutine so it doesn't block the main thread.
	go func() {
		logger.Info("HTTP server listening", zap.String("address", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Server failed to start", zap.Error(err))
		}
	}()

	// 8. Graceful Shutdown
	// Create a channel to listen for OS signals (e.g., Ctrl+C, kill command).
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit // Block until a signal is received.
	logger.Info("Shutting down server...")

	// Create a context with a timeout for server shutdown.
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	// Attempt to gracefully shut down the server.
	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Fatal("Server forced to shutdown", zap.Error(err))
	}

	logger.Info("Server exited gracefully")
}