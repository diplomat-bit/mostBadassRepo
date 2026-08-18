// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/user-service/internal/integrations/auth0_client.go
================================================================================

// Copyright 2024 The FusionAuth Go Client Authors. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package integrations

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"
)

// Custom error types for better error handling.
var (
	ErrUserNotFound      = errors.New("user not found")
	ErrInvalidUserID     = errors.New("invalid user ID provided")
	ErrInvalidConfig     = errors.New("invalid Auth0 configuration")
	ErrTokenRequestFailed = errors.New("failed to retrieve management API token")
	ErrRequestFailed     = errors.New("Auth0 API request failed")
)

const (
	defaultTimeout = 15 * time.Second
)

// Auth0Config holds the necessary configuration for the Auth0 Management API client.
type Auth0Config struct {
	Domain       string
	ClientID     string
	ClientSecret string
	Audience     string
}

// LoadAuth0ConfigFromEnv loads configuration from environment variables.
// AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET are required.
// AUTH0_AUDIENCE defaults to https://{domain}/api/v2/ if not set.
func LoadAuth0ConfigFromEnv() (*Auth0Config, error) {
	domain := os.Getenv("AUTH0_DOMAIN")
	if domain == "" {
		return nil, fmt.Errorf("%w: AUTH0_DOMAIN is not set", ErrInvalidConfig)
	}
	clientID := os.Getenv("AUTH0_CLIENT_ID")
	if clientID == "" {
		return nil, fmt.Errorf("%w: AUTH0_CLIENT_ID is not set", ErrInvalidConfig)
	}
	clientSecret := os.Getenv("AUTH0_CLIENT_SECRET")
	if clientSecret == "" {
		return nil, fmt.Errorf("%w: AUTH0_CLIENT_SECRET is not set", ErrInvalidConfig)
	}

	audience := os.Getenv("AUTH0_AUDIENCE")
	if audience == "" {
		audience = fmt.Sprintf("https://%s/api/v2/", domain)
	}

	return &Auth0Config{
		Domain:       domain,
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Audience:     audience,
	}, nil
}

// managementToken stores the API access token and its expiration time.
type managementToken struct {
	AccessToken string    `json:"access_token"`
	ExpiresIn   int       `json:"expires_in"`
	TokenType   string    `json:"token_type"`
	Scope       string    `json:"scope"`
	ExpiresAt   time.Time `json:"-"`
}

// IsExpired checks if the token is expired or close to expiring.
func (t *managementToken) IsExpired() bool {
	if t == nil || t.AccessToken == "" {
		return true
	}
	// Consider token expired 1 minute before it actually does to avoid race conditions.
	return time.Now().UTC().After(t.ExpiresAt.Add(-1 * time.Minute))
}

// Auth0Client is a client for interacting with the Auth0 Management API.
type Auth0Client struct {
	config     *Auth0Config
	httpClient *http.Client
	token      *managementToken
	tokenMutex sync.RWMutex
}

// NewAuth0Client creates and initializes a new Auth0Client.
func NewAuth0Client(cfg *Auth0Config) (*Auth0Client, error) {
	if cfg == nil {
		return nil, fmt.Errorf("%w: configuration cannot be nil", ErrInvalidConfig)
	}
	if cfg.Domain == "" || cfg.ClientID == "" || cfg.ClientSecret == "" {
		return nil, fmt.Errorf("%w: domain, client ID, and client secret must be provided", ErrInvalidConfig)
	}

	return &Auth0Client{
		config: cfg,
		httpClient: &http.Client{
			Timeout: defaultTimeout,
		},
	}, nil
}

// --- Token Management ---

// getManagementAPIToken safely retrieves a valid management API token, refreshing if necessary.
func (c *Auth0Client) getManagementAPIToken(ctx context.Context) (string, error) {
	c.tokenMutex.RLock()
	if c.token != nil && !c.token.IsExpired() {
		token := c.token.AccessToken
		c.tokenMutex.RUnlock()
		return token, nil
	}
	c.tokenMutex.RUnlock()

	// Upgrade to a write lock to refresh the token
	c.tokenMutex.Lock()
	defer c.tokenMutex.Unlock()

	// Double-check if another goroutine refreshed the token while we were waiting for the lock.
	if c.token != nil && !c.token.IsExpired() {
		return c.token.AccessToken, nil
	}

	if err := c.refreshManagementAPIToken(ctx); err != nil {
		return "", err
	}

	return c.token.AccessToken, nil
}

// refreshManagementAPIToken performs the OAuth2 client credentials flow to get a new token.
func (c *Auth0Client) refreshManagementAPIToken(ctx context.Context) error {
	payload := map[string]string{
		"grant_type":    "client_credentials",
		"client_id":     c.config.ClientID,
		"client_secret": c.config.ClientSecret,
		"audience":      c.config.Audience,
	}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal token request payload: %w", err)
	}

	tokenURL := fmt.Sprintf("https://%s/oauth/token", c.config.Domain)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, tokenURL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return fmt.Errorf("failed to create token request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("token request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("%w: status %d, body: %s", ErrTokenRequestFailed, resp.StatusCode, string(bodyBytes))
	}

	var token managementToken
	if err := json.NewDecoder(resp.Body).Decode(&token); err != nil {
		return fmt.Errorf("failed to decode token response: %w", err)
	}

	token.ExpiresAt = time.Now().UTC().Add(time.Duration(token.ExpiresIn) * time.Second)
	c.token = &token

	return nil
}

// --- HTTP Helper ---

// ErrorResponse represents a standard error response from the Auth0 API.
type ErrorResponse struct {
	StatusCode int    `json:"statusCode"`
	ErrorCode  string `json:"errorCode"`
	Message    string `json:"message"`
	Error      string `json:"error"`
}

func (e *ErrorResponse) String() string {
	return fmt.Sprintf("Auth0 API Error: %s (code: %s, status: %d)", e.Message, e.ErrorCode, e.StatusCode)
}

// doRequest is a generic helper for making authenticated requests to the Auth0 Management API.
func (c *Auth0Client) doRequest(ctx context.Context, method, path string, body, result interface{}) error {
	token, err := c.getManagementAPIToken(ctx)
	if err != nil {
		return err
	}

	var reqBody io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("failed to marshal request body: %w", err)
		}
		reqBody = bytes.NewBuffer(jsonBody)
	}

	apiURL := fmt.Sprintf("%s%s", strings.TrimSuffix(c.config.Audience, "/"), path)
	req, err := http.NewRequestWithContext(ctx, method, apiURL, reqBody)
	if err != nil {
		return fmt.Errorf("failed to create API request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("API request execution failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		if resp.StatusCode == http.StatusNotFound {
			return ErrUserNotFound
		}
		var errResp ErrorResponse
		if err := json.NewDecoder(resp.Body).Decode(&errResp); err == nil {
			errResp.StatusCode = resp.StatusCode
			return fmt.Errorf("%w: %s", ErrRequestFailed, errResp.String())
		}
		// Fallback if error response is not JSON
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("%w: status %d, body: %s", ErrRequestFailed, resp.StatusCode, string(bodyBytes))
	}

	if result != nil && resp.StatusCode != http.StatusNoContent {
		if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
			return fmt.Errorf("failed to decode successful response body: %w", err)
		}
	}

	return nil
}

// --- Data Models ---

// Auth0User represents a user object from Auth0.
type Auth0User struct {
	UserID        string                 `json:"user_id"`
	Email         string                 `json:"email"`
	EmailVerified bool                   `json:"email_verified"`
	Username      string                 `json:"username,omitempty"`
	PhoneNumber   string                 `json:"phone_number,omitempty"`
	PhoneVerified bool                   `json:"phone_verified,omitempty"`
	CreatedAt     *time.Time             `json:"created_at,omitempty"`
	UpdatedAt     *time.Time             `json:"updated_at,omitempty"`
	Identities    []UserIdentity         `json:"identities,omitempty"`
	AppMetadata   map[string]interface{} `json:"app_metadata,omitempty"`
	UserMetadata  map[string]interface{} `json:"user_metadata,omitempty"`
	Picture       string                 `json:"picture,omitempty"`
	Name          string                 `json:"name,omitempty"`
	Nickname      string                 `json:"nickname,omitempty"`
	LastIP        string                 `json:"last_ip,omitempty"`
	LastLogin     *time.Time             `json:"last_login,omitempty"`
	LoginsCount   int                    `json:"logins_count,omitempty"`
	Blocked       bool                   `json:"blocked,omitempty"`
}

// UserIdentity represents a linked identity for a user.
type UserIdentity struct {
	Connection string `json:"connection"`
	UserID     string `json:"user_id"`
	Provider   string `json:"provider"`
	IsSocial   bool   `json:"isSocial"`
}

// UserCreateRequest is the payload for creating a new user.
type UserCreateRequest struct {
	Connection    string                 `json:"connection"` // e.g., "Username-Password-Authentication"
	Email         string                 `json:"email"`
	Password      string                 `json:"password"`
	EmailVerified bool                   `json:"email_verified,omitempty"`
	AppMetadata   map[string]interface{} `json:"app_metadata,omitempty"`
	UserMetadata  map[string]interface{} `json:"user_metadata,omitempty"`
	VerifyEmail   bool                   `json:"verify_email,omitempty"`
}

// UserUpdateRequest is the payload for updating an existing user.
type UserUpdateRequest struct {
	Blocked       *bool                  `json:"blocked,omitempty"`
	EmailVerified *bool                  `json:"email_verified,omitempty"`
	Email         *string                `json:"email,omitempty"`
	Password      *string                `json:"password,omitempty"`
	Connection    *string                `json:"connection,omitempty"`
	AppMetadata   map[string]interface{} `json:"app_metadata,omitempty"`
	UserMetadata  map[string]interface{} `json:"user_metadata,omitempty"`
}

// Auth0Role represents a role in Auth0.
type Auth0Role struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

// Auth0Log represents a single log event from Auth0.
type Auth0Log struct {
	Date        time.Time              `json:"date"`
	Type        string                 `json:"type"`
	Description string                 `json:"description"`
	Connection  string                 `json:"connection,omitempty"`
	ClientID    string                 `json:"client_id"`
	ClientName  string                 `json:"client_name"`
	IP          string                 `json:"ip"`
	UserAgent   string                 `json:"user_agent"`
	UserID      string                 `json:"user_id,omitempty"`
	UserName    string                 `json:"user_name,omitempty"`
	Details     map[string]interface{} `json:"details,omitempty"`
}

// --- Public API Methods ---

// GetUser retrieves a user by their ID.
func (c *Auth0Client) GetUser(ctx context.Context, userID string) (*Auth0User, error) {
	if userID == "" {
		return nil, ErrInvalidUserID
	}
	path := fmt.Sprintf("/api/v2/users/%s", url.PathEscape(userID))
	var user Auth0User
	err := c.doRequest(ctx, http.MethodGet, path, nil, &user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// CreateUser creates a new user in Auth0.
func (c *Auth0Client) CreateUser(ctx context.Context, req UserCreateRequest) (*Auth0User, error) {
	var user Auth0User
	err := c.doRequest(ctx, http.MethodPost, "/api/v2/users", req, &user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// UpdateUser updates an existing user's information.
func (c *Auth0Client) UpdateUser(ctx context.Context, userID string, req UserUpdateRequest) (*Auth0User, error) {
	if userID == "" {
		return nil, ErrInvalidUserID
	}
	path := fmt.Sprintf("/api/v2/users/%s", url.PathEscape(userID))
	var user Auth0User
	err := c.doRequest(ctx, http.MethodPatch, path, req, &user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// DeleteUser removes a user from Auth0.
func (c *Auth0Client) DeleteUser(ctx context.Context, userID string) error {
	if userID == "" {
		return ErrInvalidUserID
	}
	path := fmt.Sprintf("/api/v2/users/%s", url.PathEscape(userID))
	return c.doRequest(ctx, http.MethodDelete, path, nil, nil)
}

// LinkAccounts links a secondary user account to a primary one.
// primaryUserID is the ID of the user to link to.
// secondaryUserToken is the JWT of the secondary account.
func (c *Auth0Client) LinkAccounts(ctx context.Context, primaryUserID, secondaryUserToken string) ([]UserIdentity, error) {
	if primaryUserID == "" {
		return nil, ErrInvalidUserID
	}
	path := fmt.Sprintf("/api/v2/users/%s/identities", url.PathEscape(primaryUserID))
	payload := map[string]string{
		"link_with": secondaryUserToken,
	}
	var identities []UserIdentity
	err := c.doRequest(ctx, http.MethodPost, path, payload, &identities)
	return identities, err
}

// UnlinkAccount unlinks a secondary identity from a primary user account.
func (c *Auth0Client) UnlinkAccount(ctx context.Context, primaryUserID, provider, secondaryIdentityID string) ([]UserIdentity, error) {
	if primaryUserID == "" {
		return nil, ErrInvalidUserID
	}
	path := fmt.Sprintf("/api/v2/users/%s/identities/%s/%s", url.PathEscape(primaryUserID), url.PathEscape(provider), url.PathEscape(secondaryIdentityID))
	var identities []UserIdentity
	err := c.doRequest(ctx, http.MethodDelete, path, nil, &identities)
	return identities, err
}

// GetUserRoles retrieves all roles assigned to a specific user.
func (c *Auth0Client) GetUserRoles(ctx context.Context, userID string) ([]*Auth0Role, error) {
	if userID == "" {
		return nil, ErrInvalidUserID
	}
	path := fmt.Sprintf("/api/v2/users/%s/roles", url.PathEscape(userID))
	var roles []*Auth0Role
	err := c.doRequest(ctx, http.MethodGet, path, nil, &roles)
	return roles, err
}

// AssignRolesToUser assigns one or more roles to a user.
func (c *Auth0Client) AssignRolesToUser(ctx context.Context, userID string, roleIDs []string) error {
	if userID == "" {
		return ErrInvalidUserID
	}
	path := fmt.Sprintf("/api/v2/users/%s/roles", url.PathEscape(userID))
	payload := map[string][]string{
		"roles": roleIDs,
	}
	return c.doRequest(ctx, http.MethodPost, path, payload, nil)
}

// RemoveRolesFromUser removes one or more roles from a user.
func (c *Auth0Client) RemoveRolesFromUser(ctx context.Context, userID string, roleIDs []string) error {
	if userID == "" {
		return ErrInvalidUserID
	}
	path := fmt.Sprintf("/api/v2/users/%s/roles", url.PathEscape(userID))
	payload := map[string][]string{
		"roles": roleIDs,
	}
	return c.doRequest(ctx, http.MethodDelete, path, payload, nil)
}

// TriggerPasswordReset sends a password reset email to a user.
// Returns the ticket URL that would be embedded in the email.
func (c *Auth0Client) TriggerPasswordReset(ctx context.Context, email, connection string) (string, error) {
	payload := map[string]string{
		"email":       email,
		"connection":  connection,
		"client_id":   c.config.ClientID,
	}
	var result struct {
		Ticket string `json:"ticket"`
	}
	err := c.doRequest(ctx, http.MethodPost, "/api/v2/tickets/password-change", payload, &result)
	if err != nil {
		return "", err
	}
	return result.Ticket, nil
}

// GetLogs fetches audit and operational logs.
// query is a Lucene query string for filtering logs (e.g., 'type:s AND date:[2023-01-01 TO 2023-01-31]').
// See Auth0 documentation for query syntax.
func (c *Auth0Client) GetLogs(ctx context.Context, query string, page, perPage int) ([]*Auth0Log, error) {
	params := url.Values{}
	params.Set("q", query)
	params.Set("page", fmt.Sprintf("%d", page))
	params.Set("per_page", fmt.Sprintf("%d", perPage))
	params.Set("sort", "date:-1") // Sort by date descending

	path := fmt.Sprintf("/api/v2/logs?%s", params.Encode())
	var logs []*Auth0Log
	err := c.doRequest(ctx, http.MethodGet, path, nil, &logs)
	return logs, err
}