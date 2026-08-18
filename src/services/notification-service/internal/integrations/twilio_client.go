// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/notification-service/internal/integrations/twilio_client.go
================================================================================

package integrations

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/cenkalti/backoff/v4"
	"github.com/sirupsen/logrus"
)

const (
	twilioAPIBaseURL    = "https://api.twilio.com/2010-04-01"
	defaultTimeout      = 15 * time.Second
	maxRetryInterval    = 5 * time.Second
	maxRetryElapsedTime = 30 * time.Second
)

// Custom errors for the Twilio client
var (
	ErrInvalidConfig    = errors.New("twilio client: invalid configuration provided")
	ErrValidationFailed = errors.New("twilio client: payload validation failed")
	ErrAPICallFailed    = errors.New("twilio client: API call failed")
)

// TwilioErrorResponse represents the standard error format from the Twilio API.
type TwilioErrorResponse struct {
	Code     int    `json:"code"`
	Message  string `json:"message"`
	MoreInfo string `json:"more_info"`
	Status   int    `json:"status"`
}

// Error implements the error interface for TwilioErrorResponse.
func (e *TwilioErrorResponse) Error() string {
	return fmt.Sprintf("twilio API error: status %d, code %d - %s (more info: %s)", e.Status, e.Code, e.Message, e.MoreInfo)
}

// TwilioConfig holds the configuration for the Twilio client.
type TwilioConfig struct {
	AccountSID          string
	AuthToken           string
	FromPhoneNumber     string // Default "From" number for SMS
	MessagingServiceSID string // Can be used instead of FromPhoneNumber
	NotifyServiceSID    string // SID for the Twilio Notify service
	HTTPClient          *http.Client
	Logger              *logrus.Entry
}

// LoadTwilioConfigFromEnv loads configuration from environment variables.
// This is a convenient way to configure the client in containerized environments.
func LoadTwilioConfigFromEnv() (*TwilioConfig, error) {
	accountSID := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	if accountSID == "" || authToken == "" {
		return nil, fmt.Errorf("%w: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set", ErrInvalidConfig)
	}

	return &TwilioConfig{
		AccountSID:          accountSID,
		AuthToken:           authToken,
		FromPhoneNumber:     os.Getenv("TWILIO_FROM_PHONE_NUMBER"),
		MessagingServiceSID: os.Getenv("TWILIO_MESSAGING_SERVICE_SID"),
		NotifyServiceSID:    os.Getenv("TWILIO_NOTIFY_SERVICE_SID"),
	}, nil
}

// TwilioClient is a client for interacting with the Twilio API.
type TwilioClient struct {
	config TwilioConfig
	client *http.Client
	log    *logrus.Entry
}

// NewTwilioClient creates and configures a new TwilioClient.
func NewTwilioClient(config TwilioConfig) (*TwilioClient, error) {
	if config.AccountSID == "" || config.AuthToken == "" {
		return nil, fmt.Errorf("%w: AccountSID and AuthToken are required", ErrInvalidConfig)
	}
	if config.FromPhoneNumber == "" && config.MessagingServiceSID == "" {
		return nil, fmt.Errorf("%w: either FromPhoneNumber or MessagingServiceSID must be provided for SMS", ErrInvalidConfig)
	}

	httpClient := config.HTTPClient
	if httpClient == nil {
		httpClient = &http.Client{
			Timeout: defaultTimeout,
		}
	}

	logger := config.Logger
	if logger == nil {
		logger = logrus.NewEntry(logrus.New()) // Default to a null logger
	}

	return &TwilioClient{
		config: config,
		client: httpClient,
		log:    logger.WithField("integration", "twilio"),
	}, nil
}

// SMSPayload defines the parameters for sending an SMS.
type SMSPayload struct {
	To   string // Recipient's phone number in E.164 format.
	Body string // The message body.
	// Optional: Override the default "From" number if needed.
	From string
	// Optional: Provide a URL for status callbacks.
	StatusCallbackURL string
}

// SMSResponse defines the structure of a successful SMS API call response.
type SMSResponse struct {
	SID          string  `json:"sid"`
	DateCreated  string  `json:"date_created"`
	DateUpdated  string  `json:"date_updated"`
	DateSent     string  `json:"date_sent"`
	AccountSID   string  `json:"account_sid"`
	To           string  `json:"to"`
	From         string  `json:"from"`
	Body         string  `json:"body"`
	Status       string  `json:"status"`
	NumSegments  string  `json:"num_segments"`
	NumMedia     string  `json:"num_media"`
	Direction    string  `json:"direction"`
	APIVersion   string  `json:"api_version"`
	Price        string  `json:"price"`
	PriceUnit    string  `json:"price_unit"`
	ErrorCode    *int    `json:"error_code"`
	ErrorMessage *string `json:"error_message"`
	URI          string  `json:"uri"`
}

// SendSMS sends a text message using the Twilio Messages API.
// It returns the message SID on success.
func (c *TwilioClient) SendSMS(ctx context.Context, payload SMSPayload) (*SMSResponse, error) {
	if payload.To == "" || payload.Body == "" {
		return nil, fmt.Errorf("%w: 'To' and 'Body' fields are required", ErrValidationFailed)
	}

	data := url.Values{}
	data.Set("To", payload.To)
	data.Set("Body", payload.Body)

	// Use payload-specific 'From' if provided, otherwise use config.
	from := payload.From
	if from != "" {
		data.Set("From", from)
	} else if c.config.MessagingServiceSID != "" {
		data.Set("MessagingServiceSid", c.config.MessagingServiceSID)
	} else {
		data.Set("From", c.config.FromPhoneNumber)
	}

	if payload.StatusCallbackURL != "" {
		data.Set("StatusCallback", payload.StatusCallbackURL)
	}

	path := fmt.Sprintf("/Accounts/%s/Messages.json", c.config.AccountSID)

	var response SMSResponse
	err := c.doRequest(ctx, http.MethodPost, path, data, &response)
	if err != nil {
		return nil, err
	}

	c.log.WithFields(logrus.Fields{
		"message_sid": response.SID,
		"to":          payload.To,
		"status":      response.Status,
	}).Info("SMS sent successfully via Twilio")

	return &response, nil
}

// PushNotificationPayload defines the parameters for sending a push notification.
type PushNotificationPayload struct {
	Identities []string               // The identities of the recipients.
	Body       string                 // The notification body.
	Title      string                 // The notification title (mainly for APN).
	Data       map[string]interface{} // Custom data payload.
	APN        map[string]interface{} // APN-specific overrides.
	FCM        map[string]interface{} // FCM-specific overrides.
}

// PushNotificationResponse defines the structure of a successful push notification API call.
type PushNotificationResponse struct {
	SID         string   `json:"sid"`
	AccountSID  string   `json:"account_sid"`
	ServiceSID  string   `json:"service_sid"`
	Identities  []string `json:"identities"`
	DateCreated string   `json:"date_created"`
	Body        string   `json:"body"`
	Title       string   `json:"title"`
}

// SendPushNotification sends a push notification using the Twilio Notify API.
func (c *TwilioClient) SendPushNotification(ctx context.Context, payload PushNotificationPayload) (*PushNotificationResponse, error) {
	if c.config.NotifyServiceSID == "" {
		return nil, fmt.Errorf("%w: NotifyServiceSID is required for push notifications", ErrInvalidConfig)
	}
	if len(payload.Identities) == 0 || payload.Body == "" {
		return nil, fmt.Errorf("%w: 'Identities' and 'Body' are required", ErrValidationFailed)
	}

	data := url.Values{}
	for _, identity := range payload.Identities {
		data.Add("Identity", identity)
	}
	data.Set("Body", payload.Body)

	if payload.Title != "" {
		data.Set("Title", payload.Title)
	}
	if payload.Data != nil {
		jsonData, err := json.Marshal(payload.Data)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal custom data: %w", err)
		}
		data.Set("Data", string(jsonData))
	}
	if payload.APN != nil {
		jsonAPN, err := json.Marshal(payload.APN)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal APN data: %w", err)
		}
		data.Set("Apn", string(jsonAPN))
	}
	if payload.FCM != nil {
		jsonFCM, err := json.Marshal(payload.FCM)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal FCM data: %w", err)
		}
		data.Set("Fcm", string(jsonFCM))
	}

	path := fmt.Sprintf("/Services/%s/Notifications.json", c.config.NotifyServiceSID)

	var response PushNotificationResponse
	err := c.doRequest(ctx, http.MethodPost, path, data, &response)
	if err != nil {
		return nil, err
	}

	c.log.WithFields(logrus.Fields{
		"notification_sid": response.SID,
		"identities":       payload.Identities,
		"service_sid":      c.config.NotifyServiceSID,
	}).Info("Push notification sent successfully via Twilio")

	return &response, nil
}

// doRequest is a helper function to handle the boilerplate of making API requests to Twilio.
// It includes authentication, error handling, and response parsing with retries.
func (c *TwilioClient) doRequest(ctx context.Context, method, path string, data url.Values, target interface{}) error {
	fullURL := twilioAPIBaseURL + path

	// Use an exponential backoff strategy for retries
	b := backoff.NewExponentialBackOff()
	b.MaxInterval = maxRetryInterval
	b.MaxElapsedTime = maxRetryElapsedTime

	var apiErr *TwilioErrorResponse

	operation := func() error {
		bodyReader := strings.NewReader(data.Encode())
		req, err := http.NewRequestWithContext(ctx, method, fullURL, bodyReader)
		if err != nil {
			// This is a non-retriable error
			return backoff.Permanent(fmt.Errorf("failed to create request: %w", err))
		}

		req.SetBasicAuth(c.config.AccountSID, c.config.AuthToken)
		req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
		req.Header.Add("Accept", "application/json")
		req.Header.Add("User-Agent", "our-awesome-app/1.0")

		c.log.WithFields(logrus.Fields{
			"method": method,
			"url":    fullURL,
		}).Debug("Executing Twilio API request")

		resp, err := c.client.Do(req)
		if err != nil {
			// Retriable network error
			c.log.WithError(err).Warn("Twilio request failed, will retry...")
			return fmt.Errorf("http request failed: %w", err)
		}
		defer resp.Body.Close()

		respBody, err := io.ReadAll(resp.Body)
		if err != nil {
			// Retriable read error
			c.log.WithError(err).Warn("Failed to read Twilio response body, will retry...")
			return fmt.Errorf("failed to read response body: %w", err)
		}

		// Check for non-successful status codes
		if resp.StatusCode < 200 || resp.StatusCode >= 300 {
			// Attempt to parse Twilio's specific error format
			err = json.Unmarshal(respBody, &apiErr)
			if err != nil {
				// If parsing fails, return a generic error with the status and body
				unparseableErr := fmt.Errorf("%w: status %d, body: %s", ErrAPICallFailed, resp.StatusCode, string(respBody))

				// Decide if this status code is retriable
				if resp.StatusCode == http.StatusTooManyRequests || resp.StatusCode >= 500 {
					c.log.WithError(unparseableErr).Warn("Twilio API returned a retriable server error")
					return unparseableErr
				}
				// Non-retriable client errors (4xx)
				return backoff.Permanent(unparseableErr)
			}

			// Parsed a Twilio error successfully
			if resp.StatusCode == http.StatusTooManyRequests || resp.StatusCode >= 500 {
				c.log.WithError(apiErr).Warn("Twilio API returned a retriable server error")
				return apiErr
			}
			// Non-retriable client errors (4xx)
			return backoff.Permanent(apiErr)
		}

		// Success case: decode the response body into the target struct
		if target != nil {
			if err := json.Unmarshal(respBody, target); err != nil {
				// This is a serious issue, likely a mismatch between our struct and the API response
				return backoff.Permanent(fmt.Errorf("failed to unmarshal successful response: %w", err))
			}
		}

		return nil // Success
	}

	// Execute the operation with retries
	err := backoff.Retry(operation, backoff.WithContext(b, ctx))
	if err != nil {
		c.log.WithError(err).Error("Twilio API call failed after all retries")
		return err
	}

	return nil
}