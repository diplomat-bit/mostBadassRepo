// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/notification-service/main.go
================================================================================

package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/spf13/viper"
)

// =================================================================================
// This section represents the 'config' package (e.g., src/services/notification-service/config/config.go)
// =================================================================================

// Config holds the application's configuration.
type Config struct {
	Server       ServerConfig
	Providers    map[string]map[string]interface{}
	MessageQueue MessageQueueConfig
	Telemetry    TelemetryConfig
}

// ServerConfig holds the HTTP server configuration.
type ServerConfig struct {
	Port int
}

// MessageQueueConfig holds the message queue configuration.
type MessageQueueConfig struct {
	Type     string // e.g., "rabbitmq", "kafka", "in-memory"
	Host     string
	Port     int
	User     string
	Password string
	Queue    string
}

// TelemetryConfig holds configuration for observability.
type TelemetryConfig struct {
	Otel OtelConfig
}

// OtelConfig holds OpenTelemetry configuration.
type OtelConfig struct {
	Enabled      bool
	Endpoint     string
	ServiceName  string
	ExporterType string // e.g., "stdout", "otlp"
}

// Load reads configuration from file and environment variables.
func Load() (*Config, error) {
	v := viper.New()
	v.SetConfigName("config")
	v.SetConfigType("yaml")
	v.AddConfigPath("/etc/notification-service/")
	v.AddConfigPath("$HOME/.notification-service")
	v.AddConfigPath(".")
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	// Set default values
	v.SetDefault("server.port", 8080)
	v.SetDefault("messageQueue.type", "in-memory")
	v.SetDefault("messageQueue.queue", "notifications")
	v.SetDefault("telemetry.otel.enabled", false)
	v.SetDefault("telemetry.otel.serviceName", "notification-service")
	v.SetDefault("telemetry.otel.exporterType", "stdout")

	if err := v.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			slog.Warn("Config file not found; using defaults and environment variables.")
		} else {
			return nil, fmt.Errorf("error reading config file: %w", err)
		}
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("unable to decode config into struct: %w", err)
	}

	return &cfg, nil
}

// =================================================================================
// This section represents the 'telemetry' package (e.g., src/services/notification-service/internal/telemetry/telemetry.go)
// =================================================================================

var (
	notificationsProcessed = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "notification_service_processed_total",
			Help: "The total number of processed notifications",
		},
		[]string{"provider", "channel", "status"}, // e.g., provider="sendgrid", channel="email", status="success"
	)
	notificationProcessingTime = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "notification_service_processing_duration_seconds",
			Help:    "The latency of notification processing.",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"provider", "channel"},
	)
)

// InitTracer initializes the OpenTelemetry tracer.
// In a real application, this would set up OTLP exporters, etc.
func InitTracer(cfg OtelConfig) (func(context.Context) error, error) {
	if !cfg.Enabled {
		slog.Info("OpenTelemetry tracing is disabled.")
		return func(ctx context.Context) error { return nil }, nil
	}
	slog.Info("Initializing OpenTelemetry tracer", "service", cfg.ServiceName, "exporter", cfg.ExporterType, "endpoint", cfg.Endpoint)
	// Placeholder for actual OTel SDK setup
	shutdown := func(ctx context.Context) error {
		slog.Info("Shutting down OpenTelemetry tracer provider.")
		// Placeholder for tracerProvider.Shutdown(ctx)
		return nil
	}
	return shutdown, nil
}

// GinLogger returns a gin.HandlerFunc (middleware) that logs requests using slog.
func GinLogger(logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		c.Next()

		latency := time.Since(start)
		statusCode := c.Writer.Status()

		logger.Info("request",
			"status", statusCode,
			"method", c.Request.Method,
			"path", path,
			"query", query,
			"ip", c.ClientIP(),
			"latency", latency,
			"user-agent", c.Request.UserAgent(),
			"errors", c.Errors.ByType(gin.ErrorTypePrivate).String(),
		)
	}
}

// =================================================================================
// This section represents the 'providers' package (e.g., src/services/notification-service/internal/providers/providers.go)
// =================================================================================

// Notification represents the data for a single notification.
type Notification struct {
	ID         string                 `json:"id"`
	Channel    string                 `json:"channel"`    // e.g., "email", "sms", "push", "slack"
	Recipient  string                 `json:"recipient"`  // e.g., "user@example.com", "+15551234567", "device_token"
	TemplateID string                 `json:"templateId"` // ID of the template to use
	Payload    map[string]interface{} `json:"payload"`    // Data to populate the template
	Provider   string                 `json:"provider"`   // Optional: specific provider to use, e.g., "sendgrid"
	TraceID    string                 `json:"traceId"`    // For distributed tracing
}

// Provider is the interface that all notification providers must implement.
type Provider interface {
	Send(ctx context.Context, notification *Notification) error
	Name() string
	Channel() string // e.g., "email", "sms"
}

// Registry holds all active notification providers.
type Registry struct {
	providers map[string]Provider
	byChannel map[string][]Provider
	mu        sync.RWMutex
}

// NewRegistry creates a new provider registry and initializes providers from config.
func NewRegistry(providerConfigs map[string]map[string]interface{}) (*Registry, error) {
	r := &Registry{
		providers: make(map[string]Provider),
		byChannel: make(map[string][]Provider),
	}

	// Add a default logging provider for development and testing
	logProvider := &LogProvider{}
	r.register(logProvider)

	// In a real app, you would iterate through providerConfigs and initialize
	// clients for SendGrid, Twilio, Slack, AWS SES, GCP FCM, etc.
	// For example:
	// if cfg, ok := providerConfigs["sendgrid"]; ok {
	//     apiKey := cfg["apiKey"].(string)
	//     sgProvider, err := NewSendGridProvider(apiKey)
	//     if err != nil { return nil, err }
	//     r.register(sgProvider)
	// }
	// if cfg, ok := providerConfigs["twilio"]; ok { ... }

	slog.Info("Initialized providers", "count", len(r.providers))
	if len(r.providers) == 0 {
		slog.Warn("No notification providers configured. Only 'log' provider is active.")
	}

	return r, nil
}

func (r *Registry) register(p Provider) {
	r.mu.Lock()
	defer r.mu.Unlock()

	name := p.Name()
	channel := p.Channel()

	if _, exists := r.providers[name]; exists {
		slog.Warn("Provider with this name already registered, overwriting", "name", name)
	}

	r.providers[name] = p
	r.byChannel[channel] = append(r.byChannel[channel], p)
}

// GetProvider returns a specific provider by name.
func (r *Registry) GetProvider(name string) (Provider, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	p, ok := r.providers[name]
	return p, ok
}

// GetProvidersForChannel returns all providers for a given channel (e.g., all email providers).
func (r *Registry) GetProvidersForChannel(channel string) []Provider {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.byChannel[channel]
}

// Count returns the number of registered providers.
func (r *Registry) Count() int {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return len(r.providers)
}

// LogProvider is a simple provider that just logs the notification.
// It's useful for development and as a fallback.
type LogProvider struct{}

func (p *LogProvider) Send(ctx context.Context, n *Notification) error {
	slog.Info("Sending notification via LogProvider",
		"id", n.ID,
		"channel", n.Channel,
		"recipient", n.Recipient,
		"template", n.TemplateID,
		"payload", n.Payload,
		"traceID", n.TraceID,
	)
	return nil
}
func (p *LogProvider) Name() string    { return "log" }
func (p *LogProvider) Channel() string { return "log" } // Can handle any channel by logging

// =================================================================================
// This section represents the 'dispatcher' package (e.g., src/services/notification-service/internal/dispatcher/dispatcher.go)
// =================================================================================

// Dispatcher is responsible for routing a notification to the correct provider.
type Dispatcher struct {
	registry *Registry
	logger   *slog.Logger
}

// NewDispatcher creates a new Dispatcher.
func NewDispatcher(registry *Registry, logger *slog.Logger) *Dispatcher {
	return &Dispatcher{
		registry: registry,
		logger:   logger,
	}
}

// Dispatch sends a notification using the appropriate provider.
// It implements logic for provider selection, retries, and fallbacks.
func (d *Dispatcher) Dispatch(ctx context.Context, notification *Notification) error {
	var providerNameForMetric string
	var provider Provider

	// 1. If a specific provider is requested, use it.
	if notification.Provider != "" {
		p, ok := d.registry.GetProvider(notification.Provider)
		if !ok {
			err := fmt.Errorf("requested provider '%s' not found", notification.Provider)
			d.logger.Error("Dispatch failed", "error", err, "notificationID", notification.ID)
			notificationsProcessed.WithLabelValues(notification.Provider, notification.Channel, "error").Inc()
			return err
		}
		provider = p
	} else {
		// 2. Otherwise, find a provider for the channel.
		providers := d.registry.GetProvidersForChannel(notification.Channel)
		if len(providers) == 0 {
			// As a last resort, try the log provider if it exists
			logProvider, ok := d.registry.GetProvider("log")
			if ok {
				d.logger.Warn("No provider found for channel, falling back to log provider", "channel", notification.Channel, "notificationID", notification.ID)
				provider = logProvider
			} else {
				err := fmt.Errorf("no provider configured for channel '%s'", notification.Channel)
				d.logger.Error("Dispatch failed", "error", err, "notificationID", notification.ID)
				notificationsProcessed.WithLabelValues("unknown", notification.Channel, "error").Inc()
				return err
			}
		} else {
			// Simple strategy: use the first available provider.
			// A more advanced strategy could involve round-robin, load balancing, or cost-based routing.
			provider = providers[0]
		}
	}

	providerNameForMetric = provider.Name()
	timer := prometheus.NewTimer(notificationProcessingTime.WithLabelValues(providerNameForMetric, notification.Channel))
	defer timer.ObserveDuration()

	d.logger.Info("Dispatching notification",
		"notificationID", notification.ID,
		"provider", provider.Name(),
		"channel", provider.Channel(),
		"recipient", notification.Recipient,
	)

	// In a real system, you'd implement a retry mechanism here (e.g., with exponential backoff).
	err := provider.Send(ctx, notification)
	if err != nil {
		d.logger.Error("Failed to send notification", "error", err, "provider", provider.Name(), "notificationID", notification.ID)
		notificationsProcessed.WithLabelValues(providerNameForMetric, notification.Channel, "error").Inc()
		return err
	}

	d.logger.Info("Notification sent successfully", "provider", provider.Name(), "notificationID", notification.ID)
	notificationsProcessed.WithLabelValues(providerNameForMetric, notification.Channel, "success").Inc()
	return nil
}

// =================================================================================
// This section represents the 'consumer' package (e.g., src/services/notification-service/internal/consumer/consumer.go)
// =================================================================================

// DispatchFunc is the function signature for the dispatcher's entry point.
type DispatchFunc func(context.Context, *Notification) error

// Consumer listens to a message queue and processes incoming notification requests.
type Consumer struct {
	config      MessageQueueConfig
	dispatch    DispatchFunc
	logger      *slog.Logger
	messageChan chan []byte // In-memory queue for simulation
}

// NewConsumer creates a new message queue consumer.
func NewConsumer(config MessageQueueConfig, dispatchFn DispatchFunc, logger *slog.Logger) (*Consumer, error) {
	c := &Consumer{
		config:   config,
		dispatch: dispatchFn,
		logger:   logger,
	}

	switch config.Type {
	case "in-memory":
		c.messageChan = make(chan []byte, 100)
		go c.simulateMessageProduction() // Start a goroutine to simulate messages
	case "rabbitmq", "kafka":
		// In a real app, you would establish a connection here.
		// conn, err := amqp.Dial(...)
		return nil, fmt.Errorf("message queue type '%s' not implemented in this example", config.Type)
	default:
		return nil, fmt.Errorf("unsupported message queue type: %s", config.Type)
	}

	return c, nil
}

// Start begins consuming messages from the queue.
func (c *Consumer) Start(ctx context.Context) error {
	c.logger.Info("Starting message consumer", "type", c.config.Type, "queue", c.config.Queue)

	for {
		select {
		case <-ctx.Done():
			c.logger.Info("Consumer shutting down.")
			close(c.messageChan)
			return ctx.Err()
		case msgBody, ok := <-c.messageChan:
			if !ok {
				// Channel was closed
				return nil
			}
			var notification Notification
			if err := json.Unmarshal(msgBody, &notification); err != nil {
				c.logger.Error("Failed to unmarshal message", "error", err, "body", string(msgBody))
				// In a real system, this message would be sent to a dead-letter queue.
				continue
			}

			// Process the message in a separate goroutine to not block the consumer loop
			go func(n Notification) {
				// Create a new context for this message, potentially with a timeout.
				// This could also inherit a trace ID from the message headers.
				msgCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
				defer cancel()

				if err := c.dispatch(msgCtx, &n); err != nil {
					c.logger.Error("Failed to dispatch notification", "error", err, "notificationID", n.ID)
					// Handle failure: requeue, dead-letter, etc.
				}
			}(notification)
		}
	}
}

// simulateMessageProduction is for the "in-memory" queue type. It periodically
// adds messages to the channel to simulate an external service.
func (c *Consumer) simulateMessageProduction() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()
	idCounter := 0

	for range ticker.C {
		idCounter++
		notification := Notification{
			ID:         fmt.Sprintf("msg-%d", idCounter),
			Channel:    "email",
			Recipient:  fmt.Sprintf("user%d@example.com", idCounter),
			TemplateID: "welcome_email",
			Payload:    map[string]interface{}{"name": fmt.Sprintf("User %d", idCounter)},
			TraceID:    fmt.Sprintf("trace-%d", time.Now().UnixNano()),
		}
		body, _ := json.Marshal(notification)

		select {
		case c.messageChan <- body:
			c.logger.Info("Simulated new message produced", "notificationID", notification.ID)
		default:
			c.logger.Warn("In-memory queue is full, dropping message.")
		}
	}
}

// =================================================================================
// Main application entry point
// =================================================================================

func main() {
	// 1. Initialize structured logger
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	slog.Info("Starting Notification Service...")

	// 2. Load configuration
	cfg, err := Load()
	if err != nil {
		slog.Error("Failed to load configuration", "error", err)
		os.Exit(1)
	}
	slog.Info("Configuration loaded successfully")

	// 3. Initialize Telemetry (Tracing and Metrics)
	otelShutdown, err := InitTracer(cfg.Telemetry.Otel)
	if err != nil {
		slog.Error("Failed to initialize tracer", "error", err)
		os.Exit(1)
	}

	// 4. Initialize Notification Providers
	providerRegistry, err := NewRegistry(cfg.Providers)
	if err != nil {
		slog.Error("Failed to initialize notification providers", "error", err)
		os.Exit(1)
	}

	// 5. Initialize the Dispatcher
	notificationDispatcher := NewDispatcher(providerRegistry, logger)
	slog.Info("Notification dispatcher initialized")

	// 6. Initialize and start the Message Queue Consumer
	mqConsumer, err := NewConsumer(cfg.MessageQueue, notificationDispatcher.Dispatch, logger)
	if err != nil {
		slog.Error("Failed to initialize message queue consumer", "error", err)
		os.Exit(1)
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		if err := mqConsumer.Start(ctx); err != nil && !errors.Is(err, context.Canceled) {
			slog.Error("Message consumer stopped with error", "error", err)
			cancel() // Signal other parts of the application to shut down
		}
	}()

	// 7. Set up and start the HTTP server for health checks and metrics
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(GinLogger(logger))

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "timestamp": time.Now().UTC()})
	})
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	httpServer := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Server.Port),
		Handler: router,
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		slog.Info("Starting HTTP server", "port", cfg.Server.Port)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("HTTP server failed", "error", err)
			cancel() // Signal shutdown
		}
	}()

	// 8. Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case <-quit:
		slog.Info("Shutdown signal received, starting graceful shutdown...")
	case <-ctx.Done():
		slog.Info("Context cancelled, starting graceful shutdown...")
	}

	cancel() // Signal all goroutines to stop

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer shutdownCancel()

	slog.Info("Shutting down HTTP server...")
	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		slog.Error("HTTP server shutdown failed", "error", err)
	} else {
		slog.Info("HTTP server shut down gracefully")
	}

	slog.Info("Shutting down OpenTelemetry tracer...")
	if err := otelShutdown(shutdownCtx); err != nil {
		slog.Error("OpenTelemetry tracer shutdown failed", "error", err)
	} else {
		slog.Info("OpenTelemetry tracer shut down gracefully")
	}

	slog.Info("Waiting for all background processes to finish...")
	wg.Wait()

	slog.Info("Notification Service shut down complete.")
}