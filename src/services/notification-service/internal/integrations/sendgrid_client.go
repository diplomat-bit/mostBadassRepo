// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/notification-service/internal/integrations/sendgrid_client.go
================================================================================

// Package integrations provides clients for third-party services.
package integrations

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// Constants for SendGrid configuration and environment variables.
const (
	sendGridAPIKeyEnvVar = "SENDGRID_API_KEY"
)

// ErrSendGridAPIKeyMissing is returned when the SendGrid API key is not configured.
var ErrSendGridAPIKeyMissing = errors.New("SendGrid API key is missing. Set the SENDGRID_API_KEY environment variable or provide it during client initialization")

// EmailRecipient represents a single email recipient with a name and email address.
type EmailRecipient struct {
	Name  string
	Email string
}

// EmailRequest encapsulates all the necessary information to send an email via SendGrid.
// It supports both standard content and dynamic templates, making it a flexible data
// transfer object for our notification service.
type EmailRequest struct {
	To                  []EmailRecipient
	Cc                  []EmailRecipient
	Bcc                 []EmailRecipient
	From                EmailRecipient
	Subject             string
	PlainTextContent    string
	HTMLContent         string
	TemplateID          string
	DynamicTemplateData map[string]interface{}
	Categories          []string
	CustomArgs          map[string]string
}

// SendGridClient provides a high-level interface for interacting with the SendGrid API.
// It abstracts the underlying SendGrid library to provide a clean, domain-specific API
// for sending emails and performing related tasks.
type SendGridClient struct {
	client *sendgrid.Client
	logger *log.Logger
}

// NewSendGridClient creates and configures a new SendGridClient.
// It requires an API key, which can be provided directly or loaded from the
// SENDGRID_API_KEY environment variable. It returns an error if the API key is not found.
func NewSendGridClient(apiKey string) (*SendGridClient, error) {
	if apiKey == "" {
		apiKey = os.Getenv(sendGridAPIKeyEnvVar)
	}
	if apiKey == "" {
		return nil, ErrSendGridAPIKeyMissing
	}

	client := sendgrid.NewSendClient(apiKey)

	return &SendGridClient{
		client: client,
		logger: log.New(os.Stdout, "SENDGRID_CLIENT: ", log.LstdFlags|log.Lshortfile),
	}, nil
}

// SendEmail sends an email using the configured SendGrid client.
// It constructs the email message based on the EmailRequest and handles the API call.
// This method is flexible enough to handle both transactional and marketing emails.
func (c *SendGridClient) SendEmail(ctx context.Context, req *EmailRequest) error {
	if err := req.validate(); err != nil {
		return fmt.Errorf("invalid email request: %w", err)
	}

	message := c.buildMessage(req)

	// The sendgrid-go library doesn't directly use the context for cancellation
	// of the HTTP request. For a production system, one might wrap the HTTP client
	// to handle context cancellation. We include it here for API consistency and future-proofing.
	_ = ctx

	response, err := c.client.Send(message)
	if err != nil {
		return fmt.Errorf("failed to send email via SendGrid: %w", err)
	}

	// SendGrid returns 202 Accepted on success. We check for any status code >= 400 as an error.
	if response.StatusCode >= http.StatusBadRequest {
		c.logger.Printf("SendGrid API returned a non-successful status code: %d. Body: %s", response.StatusCode, response.Body)
		return fmt.Errorf("SendGrid API error: status code %d, body: %s", response.StatusCode, response.Body)
	}

	messageID := "N/A"
	if len(response.Headers["X-Message-Id"]) > 0 {
		messageID = response.Headers["X-Message-Id"][0]
	}

	c.logger.Printf("Successfully sent email to %s with subject '%s'. SendGrid Message ID: %s",
		req.To[0].Email, req.Subject, messageID)

	return nil
}

// validate checks if the EmailRequest has the minimum required fields to be sent.
func (r *EmailRequest) validate() error {
	if len(r.To) == 0 {
		return errors.New("at least one 'To' recipient is required")
	}
	for _, recipient := range r.To {
		if recipient.Email == "" {
			return errors.New("all 'To' recipients must have an email address")
		}
	}
	if r.From.Email == "" {
		return errors.New("'From' email address is required")
	}
	if r.Subject == "" {
		return errors.New("subject is required")
	}
	if r.PlainTextContent == "" && r.HTMLContent == "" && r.TemplateID == "" {
		return errors.New("either content (plain or HTML) or a template ID is required")
	}
	return nil
}

// buildMessage constructs a SendGrid SGMailV3 object from our internal EmailRequest.
// This abstraction allows the rest of our application to be ignorant of SendGrid's specific data structures.
func (c *SendGridClient) buildMessage(req *EmailRequest) *mail.SGMailV3 {
	from := mail.NewEmail(req.From.Name, req.From.Email)
	message := mail.NewV3Mail()
	message.SetFrom(from)
	message.Subject = req.Subject

	p := mail.NewPersonalization()

	// Add To, Cc, Bcc recipients
	toEmails := make([]*mail.Email, len(req.To))
	for i, recipient := range req.To {
		toEmails[i] = mail.NewEmail(recipient.Name, recipient.Email)
	}
	p.AddTos(toEmails...)

	if len(req.Cc) > 0 {
		ccEmails := make([]*mail.Email, len(req.Cc))
		for i, recipient := range req.Cc {
			ccEmails[i] = mail.NewEmail(recipient.Name, recipient.Email)
		}
		p.AddCCs(ccEmails...)
	}

	if len(req.Bcc) > 0 {
		bccEmails := make([]*mail.Email, len(req.Bcc))
		for i, recipient := range req.Bcc {
			bccEmails[i] = mail.NewEmail(recipient.Name, recipient.Email)
		}
		p.AddBCCs(bccEmails...)
	}

	// Add dynamic data for templates
	if req.TemplateID != "" && len(req.DynamicTemplateData) > 0 {
		p.DynamicTemplateData = req.DynamicTemplateData
	}

	// Add custom arguments for tracking or metadata
	if len(req.CustomArgs) > 0 {
		for key, val := range req.CustomArgs {
			p.SetCustomArg(key, val)
		}
	}

	message.AddPersonalizations(p)

	// Set content or template
	if req.TemplateID != "" {
		message.SetTemplateID(req.TemplateID)
	} else {
		if req.PlainTextContent != "" {
			message.AddContent(mail.NewContent("text/plain", req.PlainTextContent))
		}
		if req.HTMLContent != "" {
			message.AddContent(mail.NewContent("text/html", req.HTMLContent))
		}
	}

	// Add categories for tracking and statistics
	if len(req.Categories) > 0 {
		message.AddCategories(req.Categories...)
	}

	return message
}

// GetStats fetches global email statistics from SendGrid for a given date range.
// The startDate and endDate should be in "YYYY-MM-DD" format.
// This is an example of an extended feature beyond just sending emails, adding value to our platform.
func (c *SendGridClient) GetStats(ctx context.Context, startDate, endDate string) (string, error) {
	_ = ctx // For API consistency

	queryParams := map[string]string{
		"start_date":    startDate,
		"end_date":      endDate,
		"aggregated_by": "day",
	}
	request := sendgrid.GetRequest(c.client.APIKey, "/v3/stats", c.client.Host)
	request.Method = "GET"
	request.QueryParams = queryParams

	response, err := c.client.Send(request)
	if err != nil {
		return "", fmt.Errorf("failed to get stats from SendGrid: %w", err)
	}

	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf("SendGrid API error while fetching stats: status code %d, body: %s", response.StatusCode, response.Body)
	}

	return response.Body, nil
}

// ValidateEmailAddress uses the SendGrid Email Validation API to check if an email is valid.
// Note: This is a separate SendGrid product and may require a different subscription level.
// The response body contains detailed validation results in JSON format.
func (c *SendGridClient) ValidateEmailAddress(ctx context.Context, email string) (string, error) {
	_ = ctx // For API consistency

	data := fmt.Sprintf(`{"email": "%s"}`, email)
	request := sendgrid.GetRequest(c.client.APIKey, "/v3/validations/email", c.client.Host)
	request.Method = "POST"
	request.Body = []byte(data)

	response, err := c.client.Send(request)
	if err != nil {
		return "", fmt.Errorf("failed to validate email with SendGrid: %w", err)
	}

	if response.StatusCode != http.StatusOK && response.StatusCode != http.StatusAccepted {
		return "", fmt.Errorf("SendGrid email validation API error: status code %d, body: %s", response.StatusCode, response.Body)
	}

	return response.Body, nil
}