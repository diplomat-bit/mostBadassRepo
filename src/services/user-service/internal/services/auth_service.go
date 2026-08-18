// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/user-service/internal/services/auth_service.go
================================================================================

package services

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/pquerna/otp"
	"github.com/pquerna/otp/totp"
	"golang.org/x/crypto/bcrypt"
)

// --- Placeholder for models.User and related types ---
// In a real project, these would be in a separate `models` package,
// e.g., `your_project_path/src/services/user-service/internal/models/user.go`.
// They are defined here temporarily to make this file self-contained and compilable.

// User represents a user in the system.
type User struct {
	ID           string
	Email        string
	PasswordHash string
	MFASecret    string   // Stores the TOTP secret for MFA
	MFAEnabled   bool     // Indicates if MFA is enabled for the user
	Roles        []string // User roles for authorization
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// End of placeholder for models.User and related types

// JWTClaims defines the claims for our JWT tokens.
type JWTClaims struct {
	UserID string   `json:"user_id"`
	Email  string   `json:"email"`
	Roles  []string `json:"roles"`
	jwt.RegisteredClaims
}

// UserRepository defines the interface for interacting with user data.
// This allows the AuthService to be decoupled from the actual data storage.
type UserRepository interface {
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	GetUserByID(ctx context.Context, userID string) (*User, error)
	UpdateUserMFASecret(ctx context.Context, userID string, secret string) error
	UpdateUserMFAStatus(ctx context.Context, userID string, enabled bool) error
}

// AuthService implements the core business logic for authentication.
type AuthService struct {
	jwtSecret       []byte
	tokenExpiration time.Duration
	userRepo        UserRepository
	logger          *log.Logger // Or a more sophisticated logger interface
}

// NewAuthService creates and returns a new AuthService instance.
// jwtSecret should be a strong, securely stored secret key.
// tokenExpiration defines how long JWT tokens are valid.
// userRepo is an interface to interact with user data storage.
// logger is used for logging internal service events.
func NewAuthService(jwtSecret string, tokenExpiration time.Duration, userRepo UserRepository, logger *log.Logger) (*AuthService, error) {
	if jwtSecret == "" {
		return nil, errors.New("JWT secret cannot be empty")
	}
	if tokenExpiration <= 0 {
		return nil, errors.New("token expiration must be a positive duration")
	}
	if userRepo == nil {
		return nil, errors.New("user repository cannot be nil")
	}
	if logger == nil {
		logger = log.Default() // Fallback to default logger if none provided
	}

	return &AuthService{
		jwtSecret:       []byte(jwtSecret),
		tokenExpiration: tokenExpiration,
		userRepo:        userRepo,
		logger:          logger,
	}, nil
}

// HashPassword hashes a plain-text password using bcrypt.
func (s *AuthService) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		s.logger.Printf("Error hashing password: %v", err)
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(bytes), nil
}

// VerifyPassword compares a plain-text password with a hashed password.
// It returns an error if the password does not match or if there's an internal error.
func (s *AuthService) VerifyPassword(hashedPassword, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return errors.New("invalid credentials") // Return a generic error for security
		}
		s.logger.Printf("Error comparing password hash: %v", err)
		return fmt.Errorf("failed to verify password: %w", err)
	}
	return nil
}

// GenerateJWT creates a new JWT for a given user.
// The token includes user ID, email, roles, and standard registered claims.
func (s *AuthService) GenerateJWT(ctx context.Context, user *User) (string, error) {
	expirationTime := time.Now().Add(s.tokenExpiration)
	claims := &JWTClaims{
		UserID: user.ID,
		Email:  user.Email,
		Roles:  user.Roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "your-auth-service", // Replace with your service issuer name
			Subject:   user.ID,
			ID:        fmt.Sprintf("%s-%d", user.ID, time.Now().UnixNano()), // Unique ID for the token
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(s.jwtSecret)
	if err != nil {
		s.logger.Printf("Error generating JWT for user %s: %v", user.ID, err)
		return "", fmt.Errorf("failed to generate JWT: %w", err)
	}
	return tokenString, nil
}

// ValidateJWT validates a JWT token string and returns the claims if valid.
// It returns an error if the token is invalid, expired, or malformed.
func (s *AuthService) ValidateJWT(ctx context.Context, tokenString string) (*JWTClaims, error) {
	claims := &JWTClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Ensure the token's signing method is HMAC
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return s.jwtSecret, nil
	})

	if err != nil {
		s.logger.Printf("Error parsing or validating JWT: %v", err)
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

// EnrollMFA generates a new TOTP secret for a user and returns the provisioning URI and the secret.
// The provisioning URI can be used to generate a QR code for authenticator apps (e.g., Google Authenticator).
// The secret is stored in the user's profile for later verification.
func (s *AuthService) EnrollMFA(ctx context.Context, userID, userEmail string) (string, string, error) {
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "YourCompany", // Replace with your company name
		AccountName: userEmail,
		Algorithm:   otp.AlgorithmSHA1,
		Digits:      otp.DigitsSix,
		Period:      30, // 30 seconds
	})
	if err != nil {
		s.logger.Printf("Error generating TOTP key for user %s: %v", userID, err)
		return "", "", fmt.Errorf("failed to generate MFA key: %w", err)
	}

	// Store the secret in the user's profile (e.g., database)
	err = s.userRepo.UpdateUserMFASecret(ctx, userID, key.Secret())
	if err != nil {
		s.logger.Printf("Error updating MFA secret for user %s: %v", userID, err)
		return "", "", fmt.Errorf("failed to store MFA secret: %w", err)
	}

	// Return the provisioning URI (for QR code generation) and the secret itself.
	// In a production API, you might only return the URI and handle QR code generation
	// on the client side or return a base64 encoded image directly.
	return key.URL(), key.Secret(), nil
}

// VerifyMFA verifies a TOTP code provided by the user against their stored MFA secret.
// If successful and MFA was not previously enabled, it enables MFA for the user.
func (s *AuthService) VerifyMFA(ctx context.Context, userID, code string) (bool, error) {
	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		s.logger.Printf("Error getting user %s for MFA verification: %v", userID, err)
		return false, fmt.Errorf("user not found or database error: %w", err)
	}

	if user.MFASecret == "" {
		return false, errors.New("MFA secret not set for this user")
	}

	valid := totp.Validate(code, user.MFASecret)
	if !valid {
		s.logger.Printf("Invalid MFA code for user %s", userID)
		return false, nil // Return false without an error for invalid code
	}

	// If MFA was just enrolled and verified for the first time, enable it.
	if !user.MFAEnabled {
		err = s.userRepo.UpdateUserMFAStatus(ctx, userID, true)
		if err != nil {
			s.logger.Printf("Error enabling MFA for user %s: %v", userID, err)
			return false, fmt.Errorf("failed to enable MFA: %w", err)
		}
	}

	return true, nil
}

// DisableMFA disables MFA for a user by clearing their secret and setting MFAEnabled to false.
func (s *AuthService) DisableMFA(ctx context.Context, userID string) error {
	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		s.logger.Printf("Error getting user %s for MFA disable: %v", userID, err)
		return fmt.Errorf("user not found or database error: %w", err)
	}

	if !user.MFAEnabled {
		return errors.New("MFA is not enabled for this user")
	}

	// Clear the secret
	err = s.userRepo.UpdateUserMFASecret(ctx, userID, "")
	if err != nil {
		s.logger.Printf("Error clearing MFA secret for user %s: %v", userID, err)
		return fmt.Errorf("failed to clear MFA secret: %w", err)
	}

	// Set MFAEnabled to false
	err = s.userRepo.UpdateUserMFAStatus(ctx, userID, false)
	if err != nil {
		s.logger.Printf("Error disabling MFA status for user %s: %v", userID, err)
		return fmt.Errorf("failed to disable MFA status: %w", err)
	}

	return nil
}