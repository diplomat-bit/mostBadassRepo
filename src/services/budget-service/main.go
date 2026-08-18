// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/budget-service/main.go
================================================================================

package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	// Placeholder imports for actual project structure
	// These would be replaced with your actual internal package paths
	"budget-service/api"
	"budget-service/config"
	"budget-service/internal/budget"
	"budget-service/internal/event"
	"budget-service/internal/platform/database"
	"budget-service/internal/platform/observability"
	"budget-service/internal/platform/secrets"
)

// version is set at build time
var version = "dev"

func main() {
	// Initialize structured logger
	logger, err := initLogger()
	if err != nil {
		fmt.Printf("failed to initialize logger: %v\n", err)
		os.Exit(1)
	}
	defer logger.Sync() // flushes buffer, if any

	// Run the application
	if err := run(logger); err != nil {
		logger.Fatal("application startup error", zap.Error(err))
	}
}

func run(logger *zap.Logger) error {
	logger.Info("starting budget service", zap.String("version", version))

	// =========================================================================
	// Configuration
	// =========================================================================
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("failed to load configuration: %w", err)
	}

	// =========================================================================
	// Secret Management (AWS Secrets Manager, GCP Secret Manager, Vault)
	// =========================================================================
	secretManager, err := secrets.NewManager(context.Background(), cfg.Secrets)
	if err != nil {
		return fmt.Errorf("failed to initialize secret manager: %w", err)
	}

	dbConnectionString, err := secretManager.GetSecret(context.Background(), cfg.Database.ConnectionStringSecret)
	if err != nil {
		return fmt.Errorf("failed to retrieve database connection string from secret manager: %w", err)
	}

	// =========================================================================
	// Observability (Prometheus, OpenTelemetry)
	// =========================================================================
	shutdownTracer, err := observability.InitTracer(cfg.Telemetry.OtelEndpoint, "budget-service", version)
	if err != nil {
		return fmt.Errorf("failed to initialize tracer: %w", err)
	}
	defer shutdownTracer()

	// =========================================================================
	// Database (PostgreSQL with connection pooling)
	// =========================================================================
	logger.Info("initializing database connection")
	db, err := database.New(dbConnectionString, cfg.Database.MaxOpenConns, cfg.Database.MaxIdleConns, cfg.Database.ConnMaxLifetime)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}
	defer db.Close()

	// =========================================================================
	// Initialize Domain Services
	// =========================================================================
	budgetRepo := budget.NewPostgresRepository(db, logger)
	budgetService := budget.NewService(budgetRepo, logger)

	// =========================================================================
	// Initialize Event Consumers (Kafka, RabbitMQ, GCP Pub/Sub, AWS SQS)
	// =========================================================================
	// This consumer listens for events from other services, e.g., a 'transaction.created'
	// event from the Plaid integration service, and updates budgets accordingly.
	transactionConsumer, err := event.NewConsumer(cfg.MessageBroker, "transactions", "budget-service-group", logger, budgetService)
	if err != nil {
		return fmt.Errorf("failed to initialize event consumer: %w", err)
	}

	// Run consumer in a separate goroutine
	consumerCtx, consumerCancel := context.WithCancel(context.Background())
	defer consumerCancel()
	go func() {
		logger.Info("starting event consumer")
		if err := transactionConsumer.Start(consumerCtx); err != nil {
			logger.Error("event consumer failed", zap.Error(err))
		}
		logger.Info("event consumer stopped")
	}()

	// =========================================================================
	// Initialize HTTP Server
	// =========================================================================
	if cfg.Server.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// Base middleware
	router.Use(gin.Recovery())
	router.Use(api.LoggingMiddleware(logger))
	router.Use(api.MetricsMiddleware()) // Prometheus metrics
	router.Use(api.TracingMiddleware()) // OpenTelemetry tracing

	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.Server.CorsAllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-Request-ID"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check and metrics endpoints
	router.GET("/healthz", func(c *gin.Context) {
		// TODO: Add deep health checks (e.g., database connectivity)
		c.JSON(http.StatusOK, gin.H{"status": "ok", "version": version})
	})
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// API v1 routes
	apiV1 := router.Group("/api/v1")

	// Authentication Middleware (Auth0, JWT, etc.)
	// This middleware will protect all subsequent routes in the group.
	// It validates the JWT token and attaches user information to the context.
	apiV1.Use(api.AuthMiddleware(cfg.Auth.JWT.Secret, cfg.Auth.JWT.Issuer))

	// Register budget handlers
	api.RegisterBudgetRoutes(apiV1, budgetService, logger)

	// =========================================================================
	// Start Server
	// =========================================================================
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Server.Port),
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	serverErrors := make(chan error, 1)

	go func() {
		logger.Info("starting http server", zap.Int("port", cfg.Server.Port))
		serverErrors <- srv.ListenAndServe()
	}()

	// =========================================================================
	// Graceful Shutdown
	// =========================================================================
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-serverErrors:
		return fmt.Errorf("server error: %w", err)

	case sig := <-shutdown:
		logger.Info("shutdown signal received", zap.String("signal", sig.String()))

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		// Shutdown the HTTP server
		if err := srv.Shutdown(ctx); err != nil {
			logger.Error("graceful shutdown of http server failed", zap.Error(err))
			if err := srv.Close(); err != nil {
				return fmt.Errorf("could not force-close http server: %w", err)
			}
		}

		// The consumer context is cancelled by the defer at the top of run()
		// allowing it to shut down gracefully.
	}

	logger.Info("service stopped")
	return nil
}

// initLogger initializes a production-ready zap logger.
func initLogger() (*zap.Logger, error) {
	config := zap.NewProductionConfig()
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	config.EncoderConfig.TimeKey = "timestamp"
	config.EncoderConfig.MessageKey = "message"
	config.EncoderConfig.LevelKey = "level"
	config.EncoderConfig.CallerKey = "caller"

	// Set log level from environment variable, default to INFO
	logLevel := os.Getenv("LOG_LEVEL")
	if logLevel != "" {
		var level zapcore.Level
		if err := level.UnmarshalText([]byte(logLevel)); err == nil {
			config.Level = zap.NewAtomicLevelAt(level)
		}
	}

	return config.Build(zap.AddCallerSkip(1))
}