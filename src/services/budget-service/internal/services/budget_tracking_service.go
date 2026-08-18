// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/budget-service/internal/services/budget_tracking_service.go
================================================================================

package services

import (
	"context"
	"fmt"
	"log"
	"sort"
	"sync"
	"time"

	"github.com/google/uuid"
)

// --- Domain Models ---

// TransactionEvent represents an incoming financial transaction.
// Amount is positive for income, negative for expense.
type TransactionEvent struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	AccountID   string    `json:"account_id"`
	CategoryID  string    `json:"category_id"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Timestamp   time.Time `json:"timestamp"`
}

// Budget represents a user's budget for a specific category over a period.
type Budget struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	CategoryID      string    `json:"category_id"`
	PeriodStart     time.Time `json:"period_start"`
	PeriodEnd       time.Time `json:"period_end"`
	Limit           float64   `json:"limit"`
	CurrentSpending float64   `json:"current_spending"`
	Thresholds      []float64 `json:"thresholds"` // e.g., [0.5, 0.8, 1.0] for 50%, 80%, 100%
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	// LastAlertedThreshold could be added to prevent repeated alerts for the same threshold
	// map[float64]bool or just a single float64 for the highest threshold alerted
	LastAlertedThreshold float64 `json:"last_alerted_threshold"`
}

// --- Interfaces for Dependencies ---

// BudgetRepository defines the interface for interacting with budget data storage.
type BudgetRepository interface {
	// GetBudgetsForUserAndCategory retrieves budgets for a user and category that are active during the given time.
	GetBudgetsForUserAndCategory(ctx context.Context, userID, categoryID string, atTime time.Time) ([]*Budget, error)
	// UpdateBudgetSpending updates the current spending for a specific budget.
	// It should ideally handle idempotency if events can be replayed.
	UpdateBudgetSpending(ctx context.Context, budgetID string, newSpending float64, transactionID string) error
	// UpdateBudgetAlertStatus updates the last alerted threshold for a budget.
	UpdateBudgetAlertStatus(ctx context.Context, budgetID string, lastAlertedThreshold float64) error
}

// AlertService defines the interface for sending alerts.
type AlertService interface {
	// SendBudgetAlert sends a notification to the user about their budget status.
	SendBudgetAlert(ctx context.Context, userID, budgetID, message string, currentSpending, budgetLimit float64, threshold float64) error
}

// --- BudgetTrackingService ---

// BudgetTrackingService consumes transaction events to update budgets and trigger alerts.
type BudgetTrackingService struct {
	transactionEventCh chan TransactionEvent // Channel to receive incoming transaction events
	budgetRepo         BudgetRepository
	alertService       AlertService
	logger             *log.Logger
	ctx                context.Context
	cancel             context.CancelFunc
	wg                 sync.WaitGroup // Used to wait for all goroutines to finish on shutdown
}

// NewBudgetTrackingService creates a new instance of BudgetTrackingService.
// It requires a channel for transaction events, a budget repository, an alert service, and a logger.
func NewBudgetTrackingService(
	transactionEventCh chan TransactionEvent,
	budgetRepo BudgetRepository,
	alertService AlertService,
	logger *log.Logger,
) *BudgetTrackingService {
	if logger == nil {
		logger = log.Default() // Use default logger if none provided
	}
	ctx, cancel := context.WithCancel(context.Background())
	return &BudgetTrackingService{
		transactionEventCh: transactionEventCh,
		budgetRepo:         budgetRepo,
		alertService:       alertService,
		logger:             logger,
		ctx:                ctx,
		cancel:             cancel,
	}
}

// Start begins consuming transaction events in a goroutine.
// It will continue processing events until the service is stopped via the Stop method.
func (s *BudgetTrackingService) Start() {
	s.wg.Add(1)
	go func() {
		defer s.wg.Done()
		s.logger.Println("BudgetTrackingService started, listening for transaction events...")
		for {
			select {
			case event, ok := <-s.transactionEventCh:
				if !ok {
					s.logger.Println("Transaction event channel closed. Stopping event consumption.")
					return
				}
				s.logger.Printf("Received transaction event: %s for user %s, category %s, amount %.2f", event.ID, event.UserID, event.CategoryID, event.Amount)
				s.processTransactionEvent(s.ctx, event)
			case <-s.ctx.Done():
				s.logger.Println("BudgetTrackingService received shutdown signal. Stopping event consumption.")
				return
			}
		}
	}()
}

// Stop gracefully shuts down the service.
// It signals all running goroutines to stop and waits for them to complete.
func (s *BudgetTrackingService) Stop() {
	s.logger.Println("BudgetTrackingService stopping...")
	s.cancel()  // Signal goroutines to stop
	s.wg.Wait() // Wait for all goroutines to finish
	s.logger.Println("BudgetTrackingService stopped.")
}

// processTransactionEvent handles a single transaction event.
// It fetches relevant budgets, updates their spending, and triggers alerts if thresholds are crossed.
func (s *BudgetTrackingService) processTransactionEvent(ctx context.Context, event TransactionEvent) {
	// Only process expense transactions for budget tracking.
	// Income transactions do not affect spending limits.
	if event.Amount >= 0 {
		s.logger.Printf("Skipping transaction %s (user %s) as it's not an expense (amount: %.2f).", event.ID, event.UserID, event.Amount)
		return
	}

	// Get relevant budgets for the user and category that are active during the transaction's timestamp.
	budgets, err := s.budgetRepo.GetBudgetsForUserAndCategory(ctx, event.UserID, event.CategoryID, event.Timestamp)
	if err != nil {
		s.logger.Printf("ERROR: Failed to get budgets for user %s, category %s: %v", event.UserID, event.CategoryID, err)
		return
	}

	if len(budgets) == 0 {
		s.logger.Printf("No active budgets found for user %s, category %s at %s. Transaction %s not tracked.",
			event.UserID, event.CategoryID, event.Timestamp.Format("2006-01-02"), event.ID)
		return
	}

	// Process each relevant budget
	for _, budget := range budgets {
		// Ensure the transaction falls within the budget's period (should be handled by GetBudgets, but double-check)
		if event.Timestamp.Before(budget.PeriodStart) || event.Timestamp.After(budget.PeriodEnd) {
			s.logger.Printf("Transaction %s (timestamp %s) is outside budget %s period (%s - %s). Skipping.",
				event.ID, event.Timestamp.Format("2006-01-02"), budget.ID, budget.PeriodStart.Format("2006-01-02"), budget.PeriodEnd.Format("2006-01-02"))
			continue
		}

		// Calculate new spending. Transaction amount is negative for expense, so we add its absolute value.
		newSpending := budget.CurrentSpending + (-event.Amount)
		oldSpending := budget.CurrentSpending

		// Update budget spending in the repository.
		// The transaction ID is passed for potential idempotency checks in the repository.
		err := s.budgetRepo.UpdateBudgetSpending(ctx, budget.ID, newSpending, event.ID)
		if err != nil {
			s.logger.Printf("ERROR: Failed to update spending for budget %s (user %s, category %s): %v", budget.ID, budget.UserID, budget.CategoryID, err)
			continue // Try to process next budget if any
		}
		budget.CurrentSpending = newSpending // Update local copy for alert checks

		s.logger.Printf("Budget %s (User: %s, Category: %s): Spending updated from %.2f to %.2f (Limit: %.2f) due to transaction %s.",
			budget.ID, budget.UserID, budget.CategoryID, oldSpending, newSpending, budget.Limit, event.ID)

		// Check for and trigger alerts based on the updated spending.
		s.checkForAndTriggerAlerts(ctx, budget, oldSpending)
	}
}

// checkForAndTriggerAlerts checks if any budget thresholds have been crossed and triggers alerts.
// It also updates the budget's last alerted threshold to prevent repeated alerts for the same level.
func (s *BudgetTrackingService) checkForAndTriggerAlerts(ctx context.Context, budget *Budget, oldSpending float64) {
	if len(budget.Thresholds) == 0 {
		return // No thresholds defined for this budget
	}

	// Sort thresholds to ensure we process them in increasing order
	sort.Float64s(budget.Thresholds)

	currentPercentage := budget.CurrentSpending / budget.Limit
	oldPercentage := oldSpending / budget.Limit

	var highestThresholdCrossed float64 = budget.LastAlertedThreshold

	for _, threshold := range budget.Thresholds {
		// Check if the threshold was crossed from below to above, and if we haven't alerted for this threshold yet
		if oldPercentage < threshold && currentPercentage >= threshold && threshold > budget.LastAlertedThreshold {
			message := fmt.Sprintf("Budget alert! You have reached %.0f%% of your budget for category '%s'. Current spending: %.2f / %.2f",
				threshold*100, budget.CategoryID, budget.CurrentSpending, budget.Limit)
			s.logger.Printf("ALERT: %s (Budget ID: %s, User ID: %s)", message, budget.ID, budget.UserID)

			err := s.alertService.SendBudgetAlert(ctx, budget.UserID, budget.ID, message, budget.CurrentSpending, budget.Limit, threshold)
			if err != nil {
				s.logger.Printf("ERROR: Failed to send alert for budget %s (user %s): %v", budget.ID, budget.UserID, err)
			} else {
				// Update the highest threshold for which an alert was successfully sent
				if threshold > highestThresholdCrossed {
					highestThresholdCrossed = threshold
				}
			}
		}
	}

	// If a new highest threshold was crossed and alerted, update the budget in the repository
	if highestThresholdCrossed > budget.LastAlertedThreshold {
		err := s.budgetRepo.UpdateBudgetAlertStatus(ctx, budget.ID, highestThresholdCrossed)
		if err != nil {
			s.logger.Printf("ERROR: Failed to update last alerted threshold for budget %s to %.2f: %v", budget.ID, highestThresholdCrossed, err)
		} else {
			budget.LastAlertedThreshold = highestThresholdCrossed // Update local copy
			s.logger.Printf("Updated budget %s last alerted threshold to %.2f", budget.ID, highestThresholdCrossed)
		}
	}
}

// --- Mock Implementations for Demonstration ---

// MockBudgetRepository is a simple in-memory implementation of BudgetRepository for testing.
type MockBudgetRepository struct {
	budgets map[string]*Budget // budgetID -> Budget
	mu      sync.RWMutex
	// For idempotency tracking (simple example)
	processedTransactions map[string]map[string]bool // budgetID -> transactionID -> processed
}

// NewMockBudgetRepository creates a new mock repository.
func NewMockBudgetRepository() *MockBudgetRepository {
	return &MockBudgetRepository{
		budgets:               make(map[string]*Budget),
		processedTransactions: make(map[string]map[string]bool),
	}
}

// AddBudget adds a budget to the mock repository.
func (m *MockBudgetRepository) AddBudget(budget *Budget) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if budget.ID == "" {
		budget.ID = uuid.New().String()
	}
	if budget.CreatedAt.IsZero() {
		budget.CreatedAt = time.Now()
	}
	budget.UpdatedAt = time.Now()
	m.budgets[budget.ID] = budget
	m.processedTransactions[budget.ID] = make(map[string]bool)
}

// GetBudgetsForUserAndCategory retrieves budgets for a user and category that are active during the given time.
func (m *MockBudgetRepository) GetBudgetsForUserAndCategory(ctx context.Context, userID, categoryID string, atTime time.Time) ([]*Budget, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var activeBudgets []*Budget
	for _, budget := range m.budgets {
		if budget.UserID == userID && budget.CategoryID == categoryID &&
			!atTime.Before(budget.PeriodStart) && !atTime.After(budget.PeriodEnd) {
			// Return a deep copy to prevent external modification of the stored budget
			b := *budget
			b.Thresholds = make([]float64, len(budget.Thresholds))
			copy(b.Thresholds, budget.Thresholds)
			activeBudgets = append(activeBudgets, &b)
		}
	}
	return activeBudgets, nil
}

// UpdateBudgetSpending updates the current spending for a specific budget.
// Includes a basic idempotency check using transactionID.
func (m *MockBudgetRepository) UpdateBudgetSpending(ctx context.Context, budgetID string, newSpending float64, transactionID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	budget, ok := m.budgets[budgetID]
	if !ok {
		return fmt.Errorf("budget with ID %s not found", budgetID)
	}

	// Simple idempotency check: if this transaction has already been processed for this budget, skip.
	if m.processedTransactions[budgetID][transactionID] {
		log.Printf("INFO: Transaction %s already processed for budget %s. Skipping update.", transactionID, budgetID)
		return nil
	}

	budget.CurrentSpending = newSpending
	budget.UpdatedAt = time.Now()
	m.processedTransactions[budgetID][transactionID] = true // Mark as processed
	return nil
}

// UpdateBudgetAlertStatus updates the last alerted threshold for a budget.
func (m *MockBudgetRepository) UpdateBudgetAlertStatus(ctx context.Context, budgetID string, lastAlertedThreshold float64) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	budget, ok := m.budgets[budgetID]
	if !ok {
		return fmt.Errorf("budget with ID %s not found", budgetID)
	}
	budget.LastAlertedThreshold = lastAlertedThreshold
	budget.UpdatedAt = time.Now()
	return nil
}

// MockAlertService is a simple in-memory implementation of AlertService for testing.
type MockAlertService struct {
	logger *log.Logger
	mu     sync.Mutex
	Alerts []string // Stores messages of triggered alerts
}

// NewMockAlertService creates a new mock alert service.
func NewMockAlertService(logger *log.Logger) *MockAlertService {
	if logger == nil {
		logger = log.Default()
	}
	return &MockAlertService{
		logger: logger,
		Alerts: make([]string, 0),
	}
}

// SendBudgetAlert simulates sending an alert.
func (m *MockAlertService) SendBudgetAlert(ctx context.Context, userID, budgetID, message string, currentSpending, budgetLimit float64, threshold float64) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	alertMsg := fmt.Sprintf("[ALERT] User %s, Budget %s (Threshold %.0f%%): %s (%.2f/%.2f)", userID, budgetID, threshold*100, message, currentSpending, budgetLimit)
	m.logger.Println(alertMsg)
	m.Alerts = append(m.Alerts, alertMsg)
	return nil
}