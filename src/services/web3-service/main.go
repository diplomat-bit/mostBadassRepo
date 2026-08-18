// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/web3-service/main.go
================================================================================

package main

import (
	"context"
	"crypto/ecdsa"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"
	"golang.org/x/crypto/sha3"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// =================================================================================
// CONFIGURATION
// =================================================================================

// ChainConfig holds the configuration for a single blockchain.
type ChainConfig struct {
	Name   string `mapstructure:"name"`
	RPCUrl string `mapstructure:"rpc_url"`
	ChainID int64 `mapstructure:"chain_id"`
}

// Config holds the application's configuration.
type Config struct {
	ServerPort string `mapstructure:"SERVER_PORT"`
	LogLevel   string `mapstructure:"LOG_LEVEL"`
	DSN        string `mapstructure:"DATABASE_DSN"`
	JWTSecret  string `mapstructure:"JWT_SECRET"`
	Chains     map[string]ChainConfig `mapstructure:"chains"`

	// For development key management
	DevSignerPrivateKey string `mapstructure:"DEV_SIGNER_PRIVATE_KEY"`
}

// LoadConfig loads configuration from environment variables and a config file.
func LoadConfig() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("/etc/web3-service/")
	viper.AutomaticEnv()

	// Set default values
	viper.SetDefault("SERVER_PORT", "8080")
	viper.SetDefault("LOG_LEVEL", "info")

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Warn().Msg("Config file not found; relying on environment variables.")
		} else {
			return nil, fmt.Errorf("failed to read config file: %w", err)
		}
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	// Basic validation
	if config.DSN == "" {
		return nil, errors.New("DATABASE_DSN is not set")
	}
	if config.JWTSecret == "" {
		return nil, errors.New("JWT_SECRET is not set")
	}
	if len(config.Chains) == 0 {
		return nil, errors.New("no chains configured")
	}

	return &config, nil
}

// =================================================================================
// DATABASE MODELS
// =================================================================================

// User represents a user account, identified by their wallet address.
type User struct {
	gorm.Model
	Address string `gorm:"uniqueIndex;not null"`
	Nonce   string `gorm:"not null"`
}

// =================================================================================
// SERVICES
// =================================================================================

// BlockchainService handles interactions with multiple blockchains.
type BlockchainService struct {
	clients map[int64]*ethclient.Client
	configs map[int64]ChainConfig
}

// NewBlockchainService creates and initializes a new BlockchainService.
func NewBlockchainService(chainConfigs map[string]ChainConfig) (*BlockchainService, error) {
	clients := make(map[int64]*ethclient.Client)
	configs := make(map[int64]ChainConfig)

	for _, cfg := range chainConfigs {
		client, err := ethclient.Dial(cfg.RPCUrl)
		if err != nil {
			return nil, fmt.Errorf("failed to connect to %s RPC at %s: %w", cfg.Name, cfg.RPCUrl, err)
		}
		log.Info().Str("chain", cfg.Name).Int64("chain_id", cfg.ChainID).Msg("Connected to blockchain node")
		clients[cfg.ChainID] = client
		configs[cfg.ChainID] = cfg
	}

	return &BlockchainService{clients: clients, configs: configs}, nil
}

// GetClient returns the ethclient for a given chain ID.
func (s *BlockchainService) GetClient(chainID int64) (*ethclient.Client, error) {
	client, ok := s.clients[chainID]
	if !ok {
		return nil, fmt.Errorf("no client configured for chain ID %d", chainID)
	}
	return client, nil
}

// GetBalance retrieves the native currency balance for an address.
func (s *BlockchainService) GetBalance(ctx context.Context, chainID int64, address common.Address) (*big.Int, error) {
	client, err := s.GetClient(chainID)
	if err != nil {
		return nil, err
	}
	return client.BalanceAt(ctx, address, nil)
}

// GetERC20Balance retrieves the balance of an ERC20 token.
func (s *BlockchainService) GetERC20Balance(ctx context.Context, chainID int64, contractAddress, ownerAddress common.Address) (*big.Int, error) {
	client, err := s.GetClient(chainID)
	if err != nil {
		return nil, err
	}

	// Minimal ERC20 ABI for balanceOf
	const erc20ABI = `[{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]`
	parsedABI, err := abi.JSON(strings.NewReader(erc20ABI))
	if err != nil {
		return nil, fmt.Errorf("failed to parse ERC20 ABI: %w", err)
	}

	data, err := parsedABI.Pack("balanceOf", ownerAddress)
	if err != nil {
		return nil, fmt.Errorf("failed to pack data for balanceOf: %w", err)
	}

	result, err := client.CallContract(ctx, types.Message{
		To:   &contractAddress,
		Data: data,
	}, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to call contract: %w", err)
	}

	balance := new(big.Int)
	balance.SetBytes(result)
	return balance, nil
}

// GetTransactionReceipt retrieves the receipt for a transaction hash.
func (s *BlockchainService) GetTransactionReceipt(ctx context.Context, chainID int64, txHash common.Hash) (*types.Receipt, error) {
	client, err := s.GetClient(chainID)
	if err != nil {
		return nil, err
	}
	return client.TransactionReceipt(ctx, txHash)
}

// AuthService handles user authentication via wallet signatures.
type AuthService struct {
	db        *gorm.DB
	jwtSecret []byte
}

// NewAuthService creates a new AuthService.
func NewAuthService(db *gorm.DB, jwtSecret string) *AuthService {
	return &AuthService{
		db:        db,
		jwtSecret: []byte(jwtSecret),
	}
}

// GenerateNonce creates a new nonce for a user or retrieves the existing one.
func (s *AuthService) GenerateNonce(address string) (string, error) {
	var user User
	// Normalize address to checksum format
	normalizedAddr := common.HexToAddress(address).Hex()

	err := s.db.Where(User{Address: normalizedAddr}).First(&user).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return "", fmt.Errorf("database error: %w", err)
	}

	// If user exists, return their current nonce
	if user.ID != 0 {
		return user.Nonce, nil
	}

	// If user does not exist, create one with a new nonce
	newNonce := uuid.New().String()
	newUser := User{
		Address: normalizedAddr,
		Nonce:   newNonce,
	}
	if err := s.db.Create(&newUser).Error; err != nil {
		return "", fmt.Errorf("failed to create user: %w", err)
	}

	return newNonce, nil
}

// VerifySignatureAndCreateJWT verifies a signed message and issues a JWT.
func (s *AuthService) VerifySignatureAndCreateJWT(address, signature string) (string, error) {
	var user User
	normalizedAddr := common.HexToAddress(address).Hex()

	if err := s.db.Where(User{Address: normalizedAddr}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("user not found or nonce not generated")
		}
		return "", fmt.Errorf("database error: %w", err)
	}

	// Construct the message that should have been signed
	// This follows a simple "Sign-In with Ethereum" like pattern
	message := fmt.Sprintf("Welcome to our platform!\n\nSign this message to authenticate.\n\nNonce: %s", user.Nonce)
	messageHash := crypto.Keccak256Hash([]byte(fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", len(message), message)))

	// Decode signature
	sig, err := hexutil.Decode(signature)
	if err != nil {
		return "", errors.New("invalid signature format")
	}
	// Ethereum signatures have a recovery ID at the end (v).
	// For EIP-155, v is {0,1} + chainId*2 + 35.
	// For personal_sign, it's {27,28}. We subtract 27 to get {0,1}.
	if len(sig) == 65 && (sig[64] == 27 || sig[64] == 28) {
		sig[64] -= 27
	} else {
		return "", errors.New("invalid signature recovery id")
	}

	// Recover public key from signature
	pubKey, err := crypto.SigToPub(messageHash.Bytes(), sig)
	if err != nil {
		return "", fmt.Errorf("failed to recover public key: %w", err)
	}

	// Get address from public key
	recoveredAddr := crypto.PubkeyToAddress(*pubKey)

	// Compare addresses
	if !strings.EqualFold(recoveredAddr.Hex(), normalizedAddr) {
		return "", errors.New("signature verification failed")
	}

	// Signature is valid, update nonce for security (prevents replay attacks)
	user.Nonce = uuid.New().String()
	if err := s.db.Save(&user).Error; err != nil {
		return "", fmt.Errorf("failed to update nonce: %w", err)
	}

	// Create JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"address": normalizedAddr,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // 1 week expiry
		"iat":     time.Now().Unix(),
	})

	tokenString, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

// =================================================================================
// API SERVER & HANDLERS
// =================================================================================

// Server holds dependencies for the HTTP server.
type Server struct {
	router            *gin.Engine
	db                *gorm.DB
	config            *Config
	blockchainService *BlockchainService
	authService       *AuthService
}

// NewServer creates a new server instance.
func NewServer(config *Config, db *gorm.DB, bs *BlockchainService, as *AuthService) *Server {
	server := &Server{
		config:            config,
		db:                db,
		blockchainService: bs,
		authService:       as,
	}
	server.setupRouter()
	return server
}

// setupRouter configures the Gin router with middleware and routes.
func (s *Server) setupRouter() {
	if s.config.LogLevel != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.New()

	// Middleware
	r.Use(gin.Recovery())
	r.Use(LoggerMiddleware())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // In production, restrict this to your frontend's domain
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	r.GET("/health", s.healthCheckHandler)

	v1 := r.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/nonce", s.getNonceHandler)
			auth.POST("/verify", s.verifySignatureHandler)
		}

		web3 := v1.Group("/web3")
		// This group can be protected by JWT middleware if needed
		// web3.Use(s.JwtAuthMiddleware())
		{
			web3.GET("/balance/:chainID/:address", s.getBalanceHandler)
			web3.GET("/token-balance/:chainID/:contractAddress/:ownerAddress", s.getTokenBalanceHandler)
			web3.GET("/tx/:chainID/:hash", s.getTransactionReceiptHandler)
		}
	}

	s.router = r
}

// Start runs the HTTP server.
func (s *Server) Start(address string) error {
	return s.router.Run(address)
}

// healthCheckHandler provides a simple health check endpoint.
func (s *Server) healthCheckHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "timestamp": time.Now().UTC()})
}

// getNonceHandler provides a nonce for a user to sign.
func (s *Server) getNonceHandler(c *gin.Context) {
	var req struct {
		Address string `json:"address" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: address is required"})
		return
	}
	if !common.IsHexAddress(req.Address) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Ethereum address format"})
		return
	}

	nonce, err := s.authService.GenerateNonce(req.Address)
	if err != nil {
		log.Error().Err(err).Str("address", req.Address).Msg("Failed to generate nonce")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate nonce"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"nonce": nonce})
}

// verifySignatureHandler verifies a signature and returns a JWT.
func (s *Server) verifySignatureHandler(c *gin.Context) {
	var req struct {
		Address   string `json:"address" binding:"required"`
		Signature string `json:"signature" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: address and signature are required"})
		return
	}
	if !common.IsHexAddress(req.Address) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Ethereum address format"})
		return
	}

	token, err := s.authService.VerifySignatureAndCreateJWT(req.Address, req.Signature)
	if err != nil {
		log.Warn().Err(err).Str("address", req.Address).Msg("Signature verification failed")
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

// getBalanceHandler retrieves the native balance of an address.
func (s *Server) getBalanceHandler(c *gin.Context) {
	chainID, ok := s.parseChainID(c)
	if !ok {
		return
	}
	addressStr := c.Param("address")
	if !common.IsHexAddress(addressStr) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Ethereum address format"})
		return
	}
	address := common.HexToAddress(addressStr)

	balance, err := s.blockchainService.GetBalance(c.Request.Context(), chainID, address)
	if err != nil {
		log.Error().Err(err).Int64("chainID", chainID).Str("address", addressStr).Msg("Failed to get balance")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve balance"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"address": addressStr,
		"balance": balance.String(),
		"chainID": chainID,
	})
}

// getTokenBalanceHandler retrieves the ERC20 token balance of an address.
func (s *Server) getTokenBalanceHandler(c *gin.Context) {
	chainID, ok := s.parseChainID(c)
	if !ok {
		return
	}
	contractStr := c.Param("contractAddress")
	if !common.IsHexAddress(contractStr) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contract address format"})
		return
	}
	ownerStr := c.Param("ownerAddress")
	if !common.IsHexAddress(ownerStr) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid owner address format"})
		return
	}
	contractAddr := common.HexToAddress(contractStr)
	ownerAddr := common.HexToAddress(ownerStr)

	balance, err := s.blockchainService.GetERC20Balance(c.Request.Context(), chainID, contractAddr, ownerAddr)
	if err != nil {
		log.Error().Err(err).Int64("chainID", chainID).Str("contract", contractStr).Str("owner", ownerStr).Msg("Failed to get token balance")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve token balance"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"contractAddress": contractStr,
		"ownerAddress":    ownerStr,
		"balance":         balance.String(),
		"chainID":         chainID,
	})
}

// getTransactionReceiptHandler retrieves the receipt for a transaction.
func (s *Server) getTransactionReceiptHandler(c *gin.Context) {
	chainID, ok := s.parseChainID(c)
	if !ok {
		return
	}
	hashStr := c.Param("hash")
	txHash := common.HexToHash(hashStr)

	receipt, err := s.blockchainService.GetTransactionReceipt(c.Request.Context(), chainID, txHash)
	if err != nil {
		if err.Error() == "not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found or not yet mined"})
			return
		}
		log.Error().Err(err).Int64("chainID", chainID).Str("hash", hashStr).Msg("Failed to get transaction receipt")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve transaction receipt"})
		return
	}

	c.JSON(http.StatusOK, receipt)
}

// parseChainID is a helper to extract and validate chainID from context.
func (s *Server) parseChainID(c *gin.Context) (int64, bool) {
	var chainID int64
	_, err := fmt.Sscan(c.Param("chainID"), &chainID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chain ID format"})
		return 0, false
	}
	if _, err := s.blockchainService.GetClient(chainID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Unsupported chain ID: %d", chainID)})
		return 0, false
	}
	return chainID, true
}

// =================================================================================
// MIDDLEWARE
// =================================================================================

// LoggerMiddleware creates a middleware for structured logging of requests.
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		c.Next()

		if raw != "" {
			path = path + "?" + raw
		}

		log.Info().
			Str("method", c.Request.Method).
			Str("path", path).
			Int("status", c.Writer.Status()).
			Str("ip", c.ClientIP()).
			Str("user_agent", c.Request.UserAgent()).
			Dur("latency", time.Since(start)).
			Msg("Request processed")
	}
}

// JwtAuthMiddleware creates a middleware to protect routes with JWT authentication.
func (s *Server) JwtAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			return
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(s.config.JWTSecret), nil
		})

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token: " + err.Error()})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("address", claims["address"])
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		c.Next()
	}
}

// =================================================================================
// MAIN
// =================================================================================

func main() {
	// Setup structured logging
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339})

	// Load configuration
	config, err := LoadConfig()
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to load configuration")
	}

	// Set log level from config
	logLevel, err := zerolog.ParseLevel(config.LogLevel)
	if err != nil {
		log.Warn().Str("level", config.LogLevel).Msg("Invalid log level, defaulting to 'info'")
		logLevel = zerolog.InfoLevel
	}
	zerolog.SetGlobalLevel(logLevel)

	// Initialize database connection
	gormLogger := logger.New(
		&log.Logger,
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Silent, // Use Silent and rely on zerolog
			IgnoreRecordNotFoundError: true,
			Colorful:                  false,
		},
	)
	db, err := gorm.Open(postgres.Open(config.DSN), &gorm.Config{Logger: gormLogger})
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect to database")
	}
	log.Info().Msg("Database connection established")

	// Run database migrations
	if err := db.AutoMigrate(&User{}); err != nil {
		log.Fatal().Err(err).Msg("Failed to run database migrations")
	}
	log.Info().Msg("Database migrations completed")

	// Initialize services
	blockchainService, err := NewBlockchainService(config.Chains)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to initialize blockchain service")
	}
	authService := NewAuthService(db, config.JWTSecret)

	// Create and start server
	server := NewServer(config, db, blockchainService, authService)
	httpServer := &http.Server{
		Addr:    ":" + config.ServerPort,
		Handler: server.router,
	}

	// Graceful shutdown
	go func() {
		log.Info().Str("port", config.ServerPort).Msg("Starting Web3 service...")
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal().Err(err).Msg("Server failed to start")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Info().Msg("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := httpServer.Shutdown(ctx); err != nil {
		log.Fatal().Err(err).Msg("Server forced to shutdown")
	}

	log.Info().Msg("Server exiting")
}

// Keccak256 calculates and returns the Keccak256 hash of the input data.
// This is a helper function that might be useful elsewhere.
func Keccak256(data ...[]byte) []byte {
	d := sha3.NewLegacyKeccak256()
	for _, b := range data {
		d.Write(b)
	}
	return d.Sum(nil)
}

// ToECDSA creates a private key object from a hex string.
// WARNING: Do not use this with real private keys in production.
// Use a KMS or hardware wallet instead.
func ToECDSA(hexkey string) (*ecdsa.PrivateKey, error) {
	return crypto.HexToECDSA(strings.TrimPrefix(hexkey, "0x"))
}

// Seed random number generator
func init() {
	rand.Seed(time.Now().UnixNano())
}