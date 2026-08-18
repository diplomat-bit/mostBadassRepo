// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/user-service/main.go
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
	"go.uber.org/zap"

	"user-service/api"
	"user-service/config"
	"user-service/database"
	"user-service/integrations"
	"user-service/pkg/logging"
	"user-service/pkg/middleware"
	"user-service/pkg/observability"
)

// main is the entry point for the User Service application.
// It orchestrates the initialization of all core components including configuration,
// logging, database, third-party integrations, and the HTTP server.
// It also handles graceful shutdown to ensure clean termination.
func main() {
	// 1. Load Application Configuration
	// Configuration is loaded from environment variables and/or a config file.
	// This is the single source of truth for all service settings.
	cfg, err := config.Load()
	if err != nil {
		// Use standard log here as our logger isn't initialized yet.
		log.Fatalf("FATAL: Could not load configuration: %v", err)
	}

	// 2. Initialize Structured Logger
	// We use a structured logger (zap) for performance and better log management.
	logger, err := logging.New(cfg.Server.Env)
	if err != nil {
		log.Fatalf("FATAL: Could not initialize logger: %v", err)
	}
	defer func() {
		// Sync flushes any buffered log entries.
		_ = logger.Sync()
	}()
	sugar := logger.Sugar()
	sugar.Info("Logger initialized successfully")
	sugar.Infof("Service starting in '%s' environment", cfg.Server.Env)

	// 3. Initialize Observability (Tracing & Metrics)
	// OpenTelemetry is set up to provide distributed tracing, crucial for a microservices architecture.
	shutdownTracer, err := observability.InitTracer(cfg.Otel.ServiceName, cfg.Otel.ExporterEndpoint, cfg.Server.Env)
	if err != nil {
		sugar.Fatalf("Failed to initialize tracer: %v", err)
	}
	sugar.Info("OpenTelemetry tracer initialized successfully")

	// 4. Initialize Database Connection
	// Connect to the primary database (e.g., PostgreSQL) using GORM.
	// Includes retry logic for robust startup.
	db, err := database.Connect(cfg.Database)
	if err != nil {
		sugar.Fatalf("Failed to connect to database: %v", err)
	}
	sugar.Info("Database connection established")

	// Automatically run database migrations to keep the schema up-to-date.
	if err := database.Migrate(db); err != nil {
		sugar.Fatalf("Failed to run database migrations: %v", err)
	}
	sugar.Info("Database migrations completed successfully")

	// 5. Initialize Integration Clients
	// This is a critical step where we initialize clients for all third-party services.
	// This modular design allows for easy addition of new integrations (Plaid, Auth0, AWS, GCP, etc.).
	integrationClients, err := integrations.NewClients(cfg, sugar)
	if err != nil {
		sugar.Fatalf("Failed to initialize integration clients: %v", err)
	}
	sugar.Info("All integration clients initialized")

	// 6. Setup HTTP Server Engine (Gin)
	if cfg.Server.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.New()

	// 7. Apply Middleware
	// Middleware is applied in a specific order to process incoming requests.
	router.Use(middleware.RequestID())
	router.Use(middleware.ZapLogger(logger))
	router.Use(middleware.ZapRecovery(logger, true))
	router.Use(middleware.OpenTelemetry(cfg.Otel.ServiceName))
	router.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.Server.CORS.AllowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-Request-ID"},
		ExposeHeaders:    []string{"Content-Length", "X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 8. Register API Routes
	// Routes are defined in a separate package to keep main.go clean.
	// All necessary dependencies (DB, logger, config, clients) are injected into the API layer.
	api.RegisterRoutes(router, db, sugar, cfg, integrationClients)
	sugar.Info("API routes registered")

	// 9. Start HTTP Server
	// The server is configured with timeouts for security and stability.
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Server.Port),
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
	}

	// Start the server in a separate goroutine so it doesn't block the graceful shutdown logic.
	go func() {
		sugar.Infof("Server starting on port %d...", cfg.Server.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			sugar.Fatalf("Listen and serve error: %v", err)
		}
	}()

	// 10. Implement Graceful Shutdown
	// Wait for an interrupt signal (e.g., Ctrl+C) to gracefully shut down the server.
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	sugar.Warn("Shutdown signal received, initiating graceful shutdown...")

	// Create a context with a timeout to allow ongoing requests to complete.
	ctx, cancel := context.WithTimeout(context.Background(), cfg.Server.ShutdownTimeout)
	defer cancel()

	// Shutdown the OpenTelemetry tracer provider.
	if err := shutdownTracer(ctx); err != nil {
		sugar.Errorf("Error shutting down tracer provider: %v", err)
	} else {
		sugar.Info("Tracer provider shut down successfully")
	}

	// Close the database connection.
	sqlDB, dbErr := db.DB()
	if dbErr == nil {
		if err := sqlDB.Close(); err != nil {
			sugar.Errorf("Error closing database connection: %v", err)
		} else {
			sugar.Info("Database connection closed successfully")
		}
	}

	// Shutdown the HTTP server.
	if err := srv.Shutdown(ctx); err != nil {
		sugar.Fatalf("Server forced to shutdown: %v", err)
	}

	sugar.Info("Server exited gracefully")
}