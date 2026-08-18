// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/libs/logger-lib/logger.go
================================================================================

package logger

import (
	"context"
	"os"
	"strings"
	"sync"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Logger defines the standard interface for logging in the project.
// It abstracts the underlying logging implementation (Zap) to allow for
// easier testing and potential future replacement.
type Logger interface {
	// Debug logs a message at the Debug level.
	Debug(msg string, fields ...zap.Field)
	// Info logs a message at the Info level.
	Info(msg string, fields ...zap.Field)
	// Warn logs a message at the Warn level.
	Warn(msg string, fields ...zap.Field)
	// Error logs a message at the Error level.
	Error(msg string, fields ...zap.Field)
	// DPanic logs a message at the DPanic level. In development, the logger then panics.
	DPanic(msg string, fields ...zap.Field)
	// Panic logs a message at the Panic level, then panics.
	Panic(msg string, fields ...zap.Field)
	// Fatal logs a message at the Fatal level, then calls os.Exit(1).
	Fatal(msg string, fields ...zap.Field)

	// With creates a child logger and adds structured context to it.
	With(fields ...zap.Field) Logger

	// Sync flushes any buffered log entries.
	Sync() error

	// GetZapLogger returns the underlying Zap logger instance.
	// This is useful for integrations with libraries that expect a *zap.Logger.
	GetZapLogger() *zap.Logger
}

// zapLogger is the concrete implementation of the Logger interface using Zap.
type zapLogger struct {
	logger *zap.Logger
}

// Config holds the configuration for the logger.
type Config struct {
	// Level is the minimum log level to output.
	// Valid values: "debug", "info", "warn", "error", "dpanic", "panic", "fatal"
	Level string `json:"level" yaml:"level"`

	// Encoding sets the logger's output format.
	// Valid values: "json", "console"
	Encoding string `json:"encoding" yaml:"encoding"`

	// ServiceName is added as a field to all log entries.
	ServiceName string `json:"serviceName" yaml:"serviceName"`

	// OutputPaths is a list of URLs or file paths to write logs to.
	// Use "stdout" and "stderr" for standard streams.
	OutputPaths []string `json:"outputPaths" yaml:"outputPaths"`

	// ErrorOutputPaths is a list of URLs or file paths to write internal logger errors to.
	ErrorOutputPaths []string `json:"errorOutputPaths" yaml:"errorOutputPaths"`
}

var (
	// globalLogger is the default logger instance.
	globalLogger Logger
	once         sync.Once
)

// contextKey is a private type to prevent context key collisions.
type contextKey string

const loggerKey contextKey = "logger"

// Init initializes the global logger with the given configuration.
// It should be called once at the start of the application.
// If it's called multiple times, it will only have an effect the first time.
func Init(config Config) {
	once.Do(func() {
		var err error
		globalLogger, err = New(config)
		if err != nil {
			// Fallback to a basic logger if initialization fails
			fallbackLogger, _ := zap.NewProduction()
			fallbackLogger.Fatal("failed to initialize global logger", zap.Error(err))
		}
	})
}

// New creates a new Logger instance based on the provided configuration.
func New(config Config) (Logger, error) {
	var zapConfig zap.Config

	// Use development config for "console" encoding for human-readable output
	// and production config for "json" for machine-readable output.
	if config.Encoding == "console" {
		zapConfig = zap.NewDevelopmentConfig()
		zapConfig.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	} else {
		zapConfig = zap.NewProductionConfig()
	}

	// Set log level
	level := zap.NewAtomicLevel()
	if err := level.UnmarshalText([]byte(strings.ToLower(config.Level))); err != nil {
		// Default to info level if parsing fails
		level.SetLevel(zap.InfoLevel)
	}
	zapConfig.Level = level

	// Set output paths
	if len(config.OutputPaths) > 0 {
		zapConfig.OutputPaths = config.OutputPaths
	} else {
		zapConfig.OutputPaths = []string{"stdout"}
	}

	// Set error output paths
	if len(config.ErrorOutputPaths) > 0 {
		zapConfig.ErrorOutputPaths = config.ErrorOutputPaths
	} else {
		zapConfig.ErrorOutputPaths = []string{"stderr"}
	}

	// Build the logger
	logger, err := zapConfig.Build(zap.AddCallerSkip(1)) // Skip 1 caller to show the correct call site
	if err != nil {
		return nil, err
	}

	// Add the service name as a permanent field if provided
	if config.ServiceName != "" {
		logger = logger.With(zap.String("service", config.ServiceName))
	}

	return &zapLogger{logger: logger}, nil
}

// Get returns the initialized global logger.
// It panics if the logger has not been initialized via Init().
func Get() Logger {
	if globalLogger == nil {
		// This ensures that if Init() is not called, we still get a default logger.
		// This is useful for tests or small scripts.
		Init(Config{Level: "info", Encoding: "console", ServiceName: "default"})
	}
	return globalLogger
}

// ToContext embeds the given logger into the context.
func ToContext(ctx context.Context, logger Logger) context.Context {
	return context.WithValue(ctx, loggerKey, logger)
}

// FromContext retrieves the logger from the context.
// If no logger is found in the context, it returns the global logger.
func FromContext(ctx context.Context) Logger {
	if logger, ok := ctx.Value(loggerKey).(Logger); ok {
		return logger
	}
	return Get()
}

// Implementation of the Logger interface for zapLogger

func (l *zapLogger) Debug(msg string, fields ...zap.Field) {
	l.logger.Debug(msg, fields...)
}

func (l *zapLogger) Info(msg string, fields ...zap.Field) {
	l.logger.Info(msg, fields...)
}

func (l *zapLogger) Warn(msg string, fields ...zap.Field) {
	l.logger.Warn(msg, fields...)
}

func (l *zapLogger) Error(msg string, fields ...zap.Field) {
	l.logger.Error(msg, fields...)
}

func (l *zapLogger) DPanic(msg string, fields ...zap.Field) {
	l.logger.DPanic(msg, fields...)
}

func (l *zapLogger) Panic(msg string, fields ...zap.Field) {
	l.logger.Panic(msg, fields...)
}

func (l *zapLogger) Fatal(msg string, fields ...zap.Field) {
	l.logger.Fatal(msg, fields...)
}

func (l *zapLogger) With(fields ...zap.Field) Logger {
	return &zapLogger{logger: l.logger.With(fields...)}
}

func (l *zapLogger) Sync() error {
	return l.logger.Sync()
}

func (l *zapLogger) GetZapLogger() *zap.Logger {
	return l.logger
}

// Global logger convenience functions

// Debug logs a message at the Debug level using the global logger.
func Debug(msg string, fields ...zap.Field) {
	Get().Debug(msg, fields...)
}

// Info logs a message at the Info level using the global logger.
func Info(msg string, fields ...zap.Field) {
	Get().Info(msg, fields...)
}

// Warn logs a message at the Warn level using the global logger.
func Warn(msg string, fields ...zap.Field) {
	Get().Warn(msg, fields...)
}

// Error logs a message at the Error level using the global logger.
func Error(msg string, fields ...zap.Field) {
	Get().Error(msg, fields...)
}

// DPanic logs a message at the DPanic level using the global logger.
func DPanic(msg string, fields ...zap.Field) {
	Get().DPanic(msg, fields...)
}

// Panic logs a message at the Panic level, then panics, using the global logger.
func Panic(msg string, fields ...zap.Field) {
	Get().Panic(msg, fields...)
}

// Fatal logs a message at the Fatal level, then calls os.Exit(1), using the global logger.
func Fatal(msg string, fields ...zap.Field) {
	Get().Fatal(msg, fields...)
}

// With creates a child of the global logger and adds structured context to it.
func With(fields ...zap.Field) Logger {
	return Get().With(fields...)
}

// Sync flushes any buffered log entries in the global logger.
// It's recommended to call this before the application exits.
func Sync() error {
	if globalLogger != nil {
		return globalLogger.Sync()
	}
	return nil
}

// ErrorField is a convenience function to create a zap.Error field.
// It's useful for logging errors in a structured way.
// Example: logger.Error("operation failed", logger.ErrorField(err))
func ErrorField(err error) zap.Field {
	return zap.Error(err)
}