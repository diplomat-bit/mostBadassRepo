// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/user-service/internal/handlers/user_handler.go
================================================================================

package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"golang.org/x/oauth2"

	// Assuming these internal packages exist
	"user-service/internal/models"
	"user-service/internal/services"
	"user-service/pkg/auth"
	"user-service/pkg/config"
	"user-service/pkg/utils"
)

// UserHandler handles all HTTP requests related to users.
// It orchestrates the flow between incoming requests, business logic (services), and responses.
type UserHandler struct {
	UserService    services.UserService
	AuthService    services.AuthService
	EmailService   services.EmailService
	PlaidService   services.PlaidService
	OAuth2Service  services.OAuth2Service
	APIKeyService  services.APIKeyService
	TOTPService    services.TOTPService
	Validator      *validator.Validate
	Config         *config.Config
	Logger         utils.Logger // Assuming a structured logger interface
}

// NewUserHandler creates a new UserHandler with required dependencies.
func NewUserHandler(
	userService services.UserService,
	authService services.AuthService,
	emailService services.EmailService,
	plaidService services.PlaidService,
	oauth2Service services.OAuth2Service,
	apiKeyService services.APIKeyService,
	totpService services.TOTPService,
	validator *validator.Validate,
	cfg *config.Config,
	logger utils.Logger,
) *UserHandler {
	return &UserHandler{
		UserService:    userService,
		AuthService:    authService,
		EmailService:   emailService,
		PlaidService:   plaidService,
		OAuth2Service:  oauth2Service,
		APIKeyService:  apiKeyService,
		TOTPService:    totpService,
		Validator:      validator,
		Config:         cfg,
		Logger:         logger,
	}
}

// RegisterRoutes sets up the routing for all user-related endpoints.
func (h *UserHandler) RegisterRoutes(r chi.Router, authMiddleware func(http.Handler) http.Handler) {
	r.Route("/users", func(r chi.Router) {
		// Public routes
		r.Post("/register", h.Register)
		r.Post("/login", h.Login)
		r.Post("/refresh-token", h.RefreshToken)
		r.Post("/request-password-reset", h.RequestPasswordReset)
		r.Post("/reset-password", h.ResetPassword)
		r.Get("/verify-email", h.VerifyEmail)

		// OAuth2 routes
		r.Get("/oauth/{provider}", h.OAuthLogin)
		r.Get("/oauth/{provider}/callback", h.OAuthCallback)

		// Authenticated routes
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/logout", h.Logout)
			r.Get("/profile", h.GetProfile)
			r.Put("/profile", h.UpdateProfile)
			r.Delete("/profile", h.DeleteAccount)
			r.Post("/change-password", h.ChangePassword)
			r.Post("/resend-verification", h.ResendVerificationEmail)

			// Two-Factor Authentication (2FA/MFA)
			r.Post("/2fa/setup", h.Setup2FA)
			r.Post("/2fa/verify", h.Verify2FA)
			r.Post("/2fa/disable", h.Disable2FA)

			// API Key Management
			r.Get("/api-keys", h.GetUserAPIKeys)
			r.Post("/api-keys", h.CreateUserAPIKey)
			r.Delete("/api-keys/{keyID}", h.DeleteUserAPIKey)

			// Plaid Integration
			r.Post("/plaid/create-link-token", h.CreatePlaidLinkToken)
			r.Post("/plaid/exchange-public-token", h.ExchangePlaidPublicToken)
			r.Get("/plaid/accounts", h.GetPlaidAccounts)
		})
	})
}

// --- DTOs (Data Transfer Objects) for Requests and Responses ---

type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=72"`
	FullName string `json:"full_name" validate:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
	TOTPCode string `json:"totp_code,omitempty"` // For 2FA
}

type LoginResponse struct {
	AccessToken  string       `json:"access_token"`
	RefreshToken string       `json:"refresh_token"`
	User         *models.User `json:"user"`
	MFARequired  bool         `json:"mfa_required,omitempty"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

type UpdateProfileRequest struct {
	FullName string            `json:"full_name" validate:"omitempty,min=2"`
	Metadata map[string]any `json:"metadata,omitempty"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" validate:"required"`
	NewPassword string `json:"new_password" validate:"required,min=8,max=72"`
}

type PasswordResetRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type ResetPasswordWithTokenRequest struct {
	Token       string `json:"token" validate:"required"`
	NewPassword string `json:"new_password" validate:"required,min=8,max=72"`
}

type Setup2FAResponse struct {
	Secret    string `json:"-"` // Never send the secret to the client
	QRCode    string `json:"qr_code"`
	AuthURL   string `json:"auth_url"`
}

type Verify2FARequest struct {
	TOTPCode string `json:"totp_code" validate:"required,len=6"`
}

type Disable2FARequest struct {
	Password string `json:"password" validate:"required"`
}

type CreateAPIKeyRequest struct {
	Name        string      `json:"name" validate:"required"`
	Permissions []string    `json:"permissions" validate:"required,min=1"`
	ExpiresAt   *time.Time  `json:"expires_at,omitempty"`
}

type CreateAPIKeyResponse struct {
	ID          string      `json:"id"`
	Key         string      `json:"key"` // Only shown on creation
	Name        string      `json:"name"`
	Permissions []string    `json:"permissions"`
	ExpiresAt   *time.Time  `json:"expires_at"`
	CreatedAt   time.Time   `json:"created_at"`
}

type PlaidExchangeRequest struct {
	PublicToken string `json:"public_token" validate:"required"`
}

// --- Handler Implementations ---

// Register handles new user registration.
func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	user, err := h.UserService.Register(r.Context(), req.Email, req.Password, req.FullName)
	if err != nil {
		if errors.Is(err, services.ErrUserAlreadyExists) {
			utils.RespondWithError(w, http.StatusConflict, err.Error())
		} else {
			h.Logger.Errorf("Failed to register user: %v", err)
			utils.RespondWithError(w, http.StatusInternalServerError, "Could not create user")
		}
		return
	}

	// Send verification email asynchronously
	go func() {
		if err := h.EmailService.SendVerificationEmail(context.Background(), user); err != nil {
			h.Logger.Errorf("Failed to send verification email to %s: %v", user.Email, err)
		}
	}()

	utils.RespondWithJSON(w, http.StatusCreated, user)
}

// Login handles user authentication.
func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	user, err := h.UserService.GetByEmail(r.Context(), req.Email)
	if err != nil || !h.AuthService.CheckPasswordHash(req.Password, user.PasswordHash) {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	if user.IsMFAEnabled {
		if req.TOTPCode == "" {
			utils.RespondWithJSON(w, http.StatusOK, LoginResponse{MFARequired: true})
			return
		}
		isValid, err := h.TOTPService.Validate(r.Context(), user.ID, req.TOTPCode)
		if err != nil || !isValid {
			utils.RespondWithError(w, http.StatusUnauthorized, "Invalid 2FA code")
			return
		}
	}

	accessToken, refreshToken, err := h.AuthService.GenerateTokens(r.Context(), user)
	if err != nil {
		h.Logger.Errorf("Failed to generate tokens for user %s: %v", user.ID, err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to log in")
		return
	}

	h.setTokenCookies(w, accessToken, refreshToken)
	utils.RespondWithJSON(w, http.StatusOK, LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         user,
	})
}

// RefreshToken provides a new access token using a valid refresh token.
func (h *UserHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	var req RefreshTokenRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	newAccessToken, newRefreshToken, err := h.AuthService.RefreshToken(r.Context(), req.RefreshToken)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Invalid or expired refresh token")
		return
	}

	h.setTokenCookies(w, newAccessToken, newRefreshToken)
	utils.RespondWithJSON(w, http.StatusOK, map[string]string{
		"access_token":  newAccessToken,
		"refresh_token": newRefreshToken,
	})
}

// Logout invalidates the user's refresh token.
func (h *UserHandler) Logout(w http.ResponseWriter, r *http.Request) {
	var req RefreshTokenRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request: missing refresh_token")
		return
	}

	if err := h.AuthService.Logout(r.Context(), req.RefreshToken); err != nil {
		h.Logger.Warnf("Logout failed for token: %v", err)
		// Still proceed to clear cookies and respond successfully
	}

	h.clearTokenCookies(w)
	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "Successfully logged out"})
}

// GetProfile retrieves the authenticated user's profile.
func (h *UserHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	user, err := h.UserService.GetByID(r.Context(), userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, user)
}

// UpdateProfile updates the authenticated user's profile.
func (h *UserHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	updatedUser, err := h.UserService.UpdateProfile(r.Context(), userID, req.FullName, req.Metadata)
	if err != nil {
		h.Logger.Errorf("Failed to update profile for user %s: %v", userID, err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Could not update profile")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, updatedUser)
}

// ChangePassword allows an authenticated user to change their password.
func (h *UserHandler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req ChangePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	err := h.UserService.ChangePassword(r.Context(), userID, req.OldPassword, req.NewPassword)
	if err != nil {
		if errors.Is(err, services.ErrInvalidCredentials) {
			utils.RespondWithError(w, http.StatusUnauthorized, "Incorrect old password")
		} else {
			h.Logger.Errorf("Failed to change password for user %s: %v", userID, err)
			utils.RespondWithError(w, http.StatusInternalServerError, "Could not change password")
		}
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "Password changed successfully"})
}

// RequestPasswordReset initiates the password reset flow.
func (h *UserHandler) RequestPasswordReset(w http.ResponseWriter, r *http.Request) {
	var req PasswordResetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	user, err := h.UserService.GetByEmail(r.Context(), req.Email)
	if err != nil {
		// Respond successfully even if user doesn't exist to prevent email enumeration
		h.Logger.Infof("Password reset requested for non-existent email: %s", req.Email)
		utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "If an account with that email exists, a password reset link has been sent."})
		return
	}

	// Asynchronously send email
	go func() {
		if err := h.EmailService.SendPasswordResetEmail(context.Background(), user); err != nil {
			h.Logger.Errorf("Failed to send password reset email to %s: %v", user.Email, err)
		}
	}()

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "If an account with that email exists, a password reset link has been sent."})
}

// ResetPassword completes the password reset flow.
func (h *UserHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req ResetPasswordWithTokenRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	err := h.UserService.ResetPasswordWithToken(r.Context(), req.Token, req.NewPassword)
	if err != nil {
		if errors.Is(err, services.ErrInvalidOrExpiredToken) {
			utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		} else {
			h.Logger.Errorf("Failed to reset password with token: %v", err)
			utils.RespondWithError(w, http.StatusInternalServerError, "Could not reset password")
		}
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "Password has been reset successfully."})
}

// VerifyEmail handles email verification via a token.
func (h *UserHandler) VerifyEmail(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	if token == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Verification token is missing")
		return
	}

	err := h.UserService.VerifyEmail(r.Context(), token)
	if err != nil {
		if errors.Is(err, services.ErrInvalidOrExpiredToken) {
			utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		} else {
			h.Logger.Errorf("Failed to verify email with token: %v", err)
			utils.RespondWithError(w, http.StatusInternalServerError, "Could not verify email")
		}
		return
	}

	// Redirect to a success page on the frontend
	http.Redirect(w, r, h.Config.App.FrontendURL+"/email-verified", http.StatusFound)
}

// ResendVerificationEmail resends the email verification link.
func (h *UserHandler) ResendVerificationEmail(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	user, err := h.UserService.GetByID(r.Context(), userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	if user.IsEmailVerified {
		utils.RespondWithError(w, http.StatusBadRequest, "Email is already verified")
		return
	}

	go func() {
		if err := h.EmailService.SendVerificationEmail(context.Background(), user); err != nil {
			h.Logger.Errorf("Failed to resend verification email to %s: %v", user.Email, err)
		}
	}()

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "Verification email sent."})
}

// DeleteAccount allows a user to permanently delete their account.
func (h *UserHandler) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	err := h.UserService.DeleteUser(r.Context(), userID)
	if err != nil {
		h.Logger.Errorf("Failed to delete account for user %s: %v", userID, err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Could not delete account")
		return
	}

	h.clearTokenCookies(w)
	w.WriteHeader(http.StatusNoContent)
}

// --- OAuth2 Handlers ---

// OAuthLogin redirects the user to the provider's authentication page.
func (h *UserHandler) OAuthLogin(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	oauthConfig, err := h.OAuth2Service.GetConfig(provider)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Unsupported OAuth provider")
		return
	}

	state, err := h.OAuth2Service.GenerateState(r.Context())
	if err != nil {
		h.Logger.Errorf("Failed to generate OAuth state: %v", err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Could not initiate OAuth login")
		return
	}

	// Set state in a secure, httpOnly cookie to prevent CSRF
	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Path:     "/",
		Expires:  time.Now().Add(10 * time.Minute),
		HttpOnly: true,
		Secure:   h.Config.Server.Env == "production",
		SameSite: http.SameSiteLaxMode,
	})

	url := oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// OAuthCallback handles the callback from the OAuth provider.
func (h *UserHandler) OAuthCallback(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	
	// Verify state to prevent CSRF
	stateCookie, err := r.Cookie("oauth_state")
	if err != nil || stateCookie.Value != r.URL.Query().Get("state") {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid OAuth state")
		return
	}
	// Clear the state cookie
	http.SetCookie(w, &http.Cookie{Name: "oauth_state", MaxAge: -1})

	code := r.URL.Query().Get("code")
	user, err := h.OAuth2Service.HandleCallback(r.Context(), provider, code)
	if err != nil {
		h.Logger.Errorf("OAuth callback failed for provider %s: %v", provider, err)
		http.Redirect(w, r, fmt.Sprintf("%s/login?error=oauth_failed", h.Config.App.FrontendURL), http.StatusTemporaryRedirect)
		return
	}

	accessToken, refreshToken, err := h.AuthService.GenerateTokens(r.Context(), user)
	if err != nil {
		h.Logger.Errorf("Failed to generate tokens after OAuth for user %s: %v", user.ID, err)
		http.Redirect(w, r, fmt.Sprintf("%s/login?error=token_generation_failed", h.Config.App.FrontendURL), http.StatusTemporaryRedirect)
		return
	}

	h.setTokenCookies(w, accessToken, refreshToken)
	// Redirect to a frontend page that handles the tokens
	redirectURL := fmt.Sprintf("%s/oauth/callback?access_token=%s&refresh_token=%s", h.Config.App.FrontendURL, accessToken, refreshToken)
	http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
}

// --- Two-Factor Authentication (2FA/MFA) Handlers ---

// Setup2FA generates a secret and QR code for setting up TOTP.
func (h *UserHandler) Setup2FA(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	user, err := h.UserService.GetByID(r.Context(), userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	secret, qrCode, authURL, err := h.TOTPService.Generate(r.Context(), user)
	if err != nil {
		h.Logger.Errorf("Failed to generate TOTP for user %s: %v", userID, err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Could not set up 2FA")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, Setup2FAResponse{
		QRCode:  qrCode,
		AuthURL: authURL,
	})
}

// Verify2FA verifies a TOTP code and enables 2FA for the user.
func (h *UserHandler) Verify2FA(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req Verify2FARequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	err := h.TOTPService.Enable(r.Context(), userID, req.TOTPCode)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid 2FA code or setup expired")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "2FA enabled successfully"})
}

// Disable2FA disables 2FA for the user's account.
func (h *UserHandler) Disable2FA(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req Disable2FARequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	err := h.TOTPService.Disable(r.Context(), userID, req.Password)
	if err != nil {
		if errors.Is(err, services.ErrInvalidCredentials) {
			utils.RespondWithError(w, http.StatusUnauthorized, "Incorrect password")
		} else {
			h.Logger.Errorf("Failed to disable 2FA for user %s: %v", userID, err)
			utils.RespondWithError(w, http.StatusInternalServerError, "Could not disable 2FA")
		}
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "2FA disabled successfully"})
}

// --- API Key Handlers ---

func (h *UserHandler) GetUserAPIKeys(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	keys, err := h.APIKeyService.ListForUser(r.Context(), userID)
	if err != nil {
		h.Logger.Errorf("Failed to get API keys for user %s: %v", userID, err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Could not retrieve API keys")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, keys)
}

func (h *UserHandler) CreateUserAPIKey(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req CreateAPIKeyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	key, secret, err := h.APIKeyService.Create(r.Context(), userID, req.Name, req.Permissions, req.ExpiresAt)
	if err != nil {
		h.Logger.Errorf("Failed to create API key for user %s: %v", userID, err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Could not create API key")
		return
	}

	utils.RespondWithJSON(w, http.StatusCreated, CreateAPIKeyResponse{
		ID:          key.ID,
		Key:         secret, // Important: only show the secret on creation
		Name:        key.Name,
		Permissions: key.Permissions,
		ExpiresAt:   key.ExpiresAt,
		CreatedAt:   key.CreatedAt,
	})
}

func (h *UserHandler) DeleteUserAPIKey(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	keyID := chi.URLParam(r, "keyID")

	err := h.APIKeyService.Delete(r.Context(), userID, keyID)
	if err != nil {
		if errors.Is(err, services.ErrNotFound) {
			utils.RespondWithError(w, http.StatusNotFound, "API key not found or you do not have permission to delete it")
		} else {
			h.Logger.Errorf("Failed to delete API key %s for user %s: %v", keyID, userID, err)
			utils.RespondWithError(w, http.StatusInternalServerError, "Could not delete API key")
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// --- Plaid Integration Handlers ---

func (h *UserHandler) CreatePlaidLinkToken(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	linkToken, err := h.PlaidService.CreateLinkToken(r.Context(), userID)
	if err != nil {
		h.Logger.Errorf("Failed to create Plaid link token for user %s: %v", userID, err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Could not create Plaid link token")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"link_token": linkToken})
}

func (h *UserHandler) ExchangePlaidPublicToken(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req PlaidExchangeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	if err := h.Validator.Struct(req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, utils.FormatValidationErrors(err))
		return
	}

	err := h.PlaidService.ExchangePublicToken(r.Context(), userID, req.PublicToken)
	if err != nil {
		h.Logger.Errorf("Failed to exchange Plaid public token for user %s: %v", userID, err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Could not link Plaid account")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]string{"message": "Plaid account linked successfully"})
}

func (h *UserHandler) GetPlaidAccounts(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserIDFromContext(r.Context())
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	accounts, err := h.PlaidService.GetAccounts(r.Context(), userID)
	if err != nil {
		h.Logger.Errorf("Failed to get Plaid accounts for user %s: %v", userID, err)
		utils.RespondWithError(w, http.StatusInternalServerError, "Could not retrieve Plaid accounts")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, accounts)
}

// --- Helper Functions ---

func (h *UserHandler) setTokenCookies(w http.ResponseWriter, accessToken, refreshToken string) {
	isProd := h.Config.Server.Env == "production"
	
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		Expires:  time.Now().Add(h.Config.JWT.AccessTTL),
		HttpOnly: true,
		Secure:   isProd,
		SameSite: http.SameSiteLaxMode,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/api/v1/users/refresh-token", // Scope refresh token to its endpoint
		Expires:  time.Now().Add(h.Config.JWT.RefreshTTL),
		HttpOnly: true,
		Secure:   isProd,
		SameSite: http.SameSiteStrictMode,
	})
}

func (h *UserHandler) clearTokenCookies(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/api/v1/users/refresh-token",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
	})
}