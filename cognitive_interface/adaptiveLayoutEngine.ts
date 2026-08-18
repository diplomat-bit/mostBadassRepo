// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/cognitive_interface/adaptiveLayoutEngine.ts
================================================================================

import {
    GeminiService,
    AIAgentCapability,
    AIAgentContext,
    AIAgentThoughtProcess,
    AIAgentDecision,
    AIAgentAction,
} from '../features/geminiService'; // Assuming a generic Gemini service for AI processing

import {
    CognitiveLoadMetrics,
    CognitiveLoadLevel,
    CognitiveLoadAssessment,
    CognitiveLoadPredictor,
} from '../inventions/011_cognitive_load_balancing/src/ml/CognitiveLoadPredictor'; // For predicting cognitive load based on raw metrics

import {
    CognitiveLoadBalancerService,
} from '../inventions/011_cognitive_load_balancing/src/core/CognitiveLoadBalancerService'; // For overall balancing strategy and resource adjustments

import { promptLibrary } from '../ai/promptLibrary'; // Centralized prompt management for AI interactions
import { UserProfile, UserPreferences } from '../data/userProfiles'; // User profile and preferences data structures
import { Notification } from '../data/notifications'; // Notification data types for active alerts
import { AppState, ActiveModule, ActiveFeature } from '../App'; // Global application state and current active views
import { logger } from '../utils/logger'; // A standardized logging utility
import { FeatureFlagManager } from '../utils/featureFlagManager'; // Manages feature flags for A/B testing or gradual rollout
import { TelemetryService } from '../services/telemetryService'; // Service for recording usage analytics and performance metrics
import { deepMerge } from '../components/utils/dataTransformers'; // Utility for deep merging objects

// --- External Fortune 500 API Integration Interfaces (Mocks) ---
// These interfaces define the expected structure and behavior of integrations
// with external Fortune 500 company APIs, providing rich context to the AI.
// In a production environment, these would be actual API client services.

/**
 * Interface representing the capabilities of a Microsoft Graph API integration.
 * Provides data related to user's calendar, presence, and recent document activity.
 */
interface MicrosoftGraphService {
    getUpcomingMeetings(userId: string): Promise<MicrosoftCalendarEvent[]>;
    getUserPresence(userId: string): Promise<MicrosoftUserPresence>;
    getRecentDocuments(userId: string): Promise<MicrosoftDocument[]>;
    getOutlookMailboxSettings(userId: string): Promise<MicrosoftMailboxSettings>;
    getTeamsActivity(userId: string): Promise<MicrosoftTeamsActivity>;
}

/** Represents an event from Microsoft Outlook Calendar. */
interface MicrosoftCalendarEvent {
    id: string;
    subject: string;
    start: Date;
    end: Date;
    isOnlineMeeting: boolean;
    location: string;
    organizer: { emailAddress: string; name: string };
    attendees: { emailAddress: string; name: string; type: 'Required' | 'Optional' }[];
    responseStatus: 'None' | 'Organizer' | 'TentativelyAccepted' | 'Accepted' | 'Declined' | 'NotResponded';
    importance: 'Low' | 'Normal' | 'High';
}

/** Defines various user presence states in Microsoft services like Teams. */
type MicrosoftUserPresence = 'Available' | 'Busy' | 'InAMeeting' | 'Away' | 'DoNotDisturb' | 'Offline' | 'BeRightBack';

/** Represents a recently accessed or modified document in Microsoft 365. */
interface MicrosoftDocument {
    id: string;
    name: string;
    lastModified: Date;
    url: string;
    application: 'Word' | 'Excel' | 'PowerPoint' | 'OneDrive' | 'SharePoint' | 'Outlook' | 'Unknown';
    sizeBytes: number;
    sharingStatus: 'Private' | 'SharedInternally' | 'SharedExternally';
}

/** Represents a user's Outlook Mailbox settings. */
interface MicrosoftMailboxSettings {
    automaticRepliesSetting: {
        status: 'Disabled' | 'AlwaysEnabled' | 'Scheduled';
        externalReplyMessage?: string;
    };
    delegateMeetingMessageDeliveryOptions: 'SendToDelegatesAndMe' | 'SendToDelegatesOnly';
    timeZone: string;
    language: {
        locale: string;
        displayName: string;
    };
}

/** Represents recent activity in Microsoft Teams. */
interface MicrosoftTeamsActivity {
    unreadChatsCount: number;
    unreadMentionsCount: number;
    activeCalls: { id: string; subject: string; durationMinutes: number }[];
    recentChannels: { id: string; displayName: string; unreadMessages: number }[];
}

/**
 * Interface representing the capabilities of a Google Workspace API integration.
 * Provides data related to user's calendar events and Google Drive activity.
 */
interface GoogleWorkspaceService {
    getCalendarEvents(userId: string, timeMin: Date, timeMax: Date): Promise<GoogleCalendarEvent[]>;
    getDriveActivity(userId: string, maxResults: number): Promise<GoogleDriveActivity[]>;
    getGmailUnreadCount(userId: string): Promise<number>;
    getGoogleTasks(userId: string): Promise<GoogleTask[]>;
}

/** Represents an event from Google Calendar. */
interface GoogleCalendarEvent {
    id: string;
    summary: string;
    start: { dateTime: string; timeZone?: string };
    end: { dateTime: string; timeZone?: string };
    location?: string;
    hangoutLink?: string;
    attendees?: { email: string; displayName?: string; responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted' }[];
    status: 'confirmed' | 'tentative' | 'cancelled';
}

/** Represents an activity log entry from Google Drive. */
interface GoogleDriveActivity {
    id: string;
    title: string;
    lastModified: string; // ISO date string
    mimeType: string;
    actor: { email: string; name: string };
    action: 'edit' | 'create' | 'delete' | 'move' | 'comment';
}

/** Represents a task from Google Tasks. */
interface GoogleTask {
    id: string;
    title: string;
    status: 'needsAction' | 'completed';
    due?: string; // ISO date string
    notes?: string;
    parent?: string; // Parent task ID
}

/**
 * Interface representing a hypothetical Salesforce CRM integration.
 * Provides access to active tasks, leads, and opportunity details.
 */
interface SalesforceCRMCustomService {
    getActiveTasks(userId: string): Promise<SalesforceTask[]>;
    getRecentLeads(userId: string, count: number): Promise<SalesforceLead[]>;
    getOpportunityDetails(opportunityId: string): Promise<SalesforceOpportunity | null>;
    getCaseDetails(caseId: string): Promise<SalesforceCase | null>;
}

/** Represents a task object from Salesforce. */
interface SalesforceTask {
    id: string;
    subject: string;
    status: 'Open' | 'Completed' | 'Deferred';
    priority: 'Low' | 'Normal' | 'High' | 'Critical';
    dueDate: Date;
    relatedToId: string; // ID of the related Account, Opportunity, Lead, etc.
    relatedToType: 'Account' | 'Opportunity' | 'Lead' | 'Contact' | 'Other';
    ownerId: string;
    description?: string;
}

/** Represents a lead object from Salesforce. */
interface SalesforceLead {
    id: string;
    name: string;
    status: 'New' | 'Working' | 'Qualified' | 'Unqualified';
    company: string;
    email: string;
    phone?: string;
    lastModified: Date;
    leadSource: string;
}

/** Represents an opportunity object from Salesforce. */
interface SalesforceOpportunity {
    id: string;
    name: string;
    stage: 'Prospecting' | 'Qualification' | 'Needs Analysis' | 'Value Proposition' | 'Perception Analysis' | 'Closed Won' | 'Closed Lost';
    amount: number;
    closeDate: Date;
    accountId: string;
    probability: number; // 0-100
}

/** Represents a case object from Salesforce. */
interface SalesforceCase {
    id: string;
    subject: string;
    status: 'New' | 'Working' | 'Escalated' | 'Closed';
    priority: 'Low' | 'Medium' | 'High';
    description: string;
    contactId: string;
    createdDate: Date;
}

/**
 * Interface for a hypothetical Plaid integration for financial data.
 */
interface PlaidFinancialService {
    getAccountsSummary(userId: string): Promise<PlaidAccountSummary[]>;
    getRecentTransactions(userId: string, count: number): Promise<PlaidTransaction[]>;
    getInvestmentHoldings(userId: string): Promise<PlaidInvestmentHolding[]>;
    getFinancialGoalsProgress(userId: string): Promise<PlaidFinancialGoal[]>;
}

/** Represents a summary of a financial account from Plaid. */
interface PlaidAccountSummary {
    id: string;
    name: string;
    type: string; // e.g., 'depository', 'credit'
    subtype: string; // e.g., 'checking', 'savings', 'credit card'
    balance: {
        available: number;
        current: number;
        iso_currency_code: string;
    };
    limit?: number; // For credit accounts
}

/** Represents a financial transaction from Plaid. */
interface PlaidTransaction {
    id: string;
    account_id: string;
    amount: number;
    iso_currency_code: string;
    date: string; // YYYY-MM-DD
    name: string;
    merchant_name?: string;
    category: string[];
    transaction_type: 'digital' | 'place' | 'special';
    pending: boolean;
}

/** Represents an investment holding from Plaid. */
interface PlaidInvestmentHolding {
    account_id: string;
    security_id: string;
    cost_basis: number;
    quantity: number;
    institution_price: number;
    institution_value: number;
    // Add security details if available
}

/** Represents a user's financial goal and its progress. */
interface PlaidFinancialGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: string;
    progressPercentage: number;
    category: 'savings' | 'investment' | 'debt_reduction';
}

// --- Core Types for Adaptive Layout Engine ---

/**
 * Represents the detailed profile of the user's current device.
 */
interface DeviceProfile {
    type: 'desktop' | 'tablet' | 'mobile' | 'wearable' | 'smart-display';
    screenResolution: { width: number; height: number }; // In pixels
    viewportSize: { width: number; height: number }; // Browser viewport size
    pixelDensity: number; // Device Pixel Ratio (DPR)
    hasTouchScreen: boolean;
    inputMethod: 'mouse-keyboard' | 'touch' | 'voice' | 'mixed' | 'stylus';
    os: string; // Operating System (e.g., 'MacIntel', 'Win32', 'Android')
    browser: string; // Browser name and version
    networkStatus: 'online' | 'offline' | 'constrained'; // Bandwidth consideration
    batteryLevel: number; // 0-1, e.g., 0.85
    isCharging: boolean;
    hasHardwareKeyboard: boolean;
    prefersReducedMotion: boolean; // From OS accessibility settings
    prefersColorScheme: 'light' | 'dark' | 'no-preference'; // From OS settings
}

/**
 * Represents the current environmental context surrounding the user.
 */
interface EnvironmentContext {
    timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'late-night';
    dayOfWeek: 'weekday' | 'weekend';
    ambientLightLevel: 'dark' | 'dim' | 'normal' | 'bright' | 'glare'; // Inferred from device sensors or time/location
    geographicLocation?: { latitude: number; longitude: number; city?: string; country?: string };
    isQuietHoursActive: boolean; // User-set system preference (e.g., Do Not Disturb)
    currentWeatherCondition?: string; // e.g., 'sunny', 'rainy', 'cloudy' (from external weather API)
    localTimezone: string;
}

/**
 * Represents the user's observed activity patterns within the application.
 */
interface UserActivityContext {
    isActive: boolean; // Is the user actively interacting (typing, moving mouse, tapping)?
    idleDurationSeconds: number; // How long since the last interaction
    typingActivityScore: number; // Aggregated score of recent typing (WPM, frequency)
    mouseActivityScore: number; // Aggregated score of recent mouse movement/clicks
    touchActivityScore: number; // Aggregated score of recent touch interactions
    scrollActivityScore: number; // Aggregated score of recent scrolling activity
    recentErrorCount: number; // Number of form validation errors, API errors, etc., in a recent period
    isMultitasking: boolean; // Inferred if user is switching tabs frequently, or has many modals open
    activeApplicationContext?: string; // High-level description of what the user is currently doing (e.g., 'data_entry', 'analysis', 'communication')
    currentInputMode: 'keyboard' | 'mouse' | 'touch' | 'voice' | 'mixed'; // Predominant input method
    recentlyVisitedViews: string[]; // History of the last N views visited
    readNotificationCount: number; // Notifications acknowledged by user
    dismissedNotificationCount: number; // Notifications dismissed by user
}

/**
 * Represents the current application's internal state that influences layout.
 */
interface ApplicationStateContext {
    activeViewId: string; // The canonical ID of the currently displayed main view/route
    openModalCount: number; // Number of active modals or overlays
    sidebarPrimaryVisible: boolean; // State of the primary navigation sidebar
    sidebarSecondaryVisible: boolean; // State of an auxiliary sidebar
    activeNotifications: Notification[]; // List of current active notifications/alerts
    backgroundTaskCount: number; // Number of ongoing background processes (e.g., data sync, AI generation)
    searchQueryActive: boolean; // Is the user currently typing in a search bar?
    lastUserActionTimestamp: number; // Unix timestamp of the last significant user action
    activeFeature: ActiveFeature | null; // The specific feature component currently in focus
    activeModule: ActiveModule | null; // The parent module (e.g., 'financials', 'AI', 'corporate')
    isInitialLoad: boolean; // Flag to indicate if the app is still loading
    isTourActive: boolean; // Is an onboarding tour/tutorial currently running?
    pendingActionCount: number; // Number of actions waiting for user confirmation
}

/**
 * Aggregated and synthesized context provided to the AI for layout decisions.
 */
interface FullUserContext {
    userId: string;
    profile: UserProfile; // Detailed user profile
    preferences: UserPreferences; // User's explicit preferences
    device: DeviceProfile; // Current device characteristics
    environment: EnvironmentContext; // Current environmental factors
    activity: UserActivityContext; // User's observed interaction patterns
    appState: ApplicationStateContext; // Current internal application state
    cognitiveLoad: CognitiveLoadAssessment; // Assessed cognitive load level and score
    externalIntegrations: {
        microsoftGraph?: {
            upcomingMeetings: MicrosoftCalendarEvent[];
            presence: MicrosoftUserPresence;
            recentDocuments: MicrosoftDocument[];
            mailboxSettings: MicrosoftMailboxSettings;
            teamsActivity: MicrosoftTeamsActivity;
        };
        googleWorkspace?: {
            calendarEvents: GoogleCalendarEvent[];
            driveActivity: GoogleDriveActivity[];
            gmailUnreadCount: number;
            googleTasks: GoogleTask[];
        };
        salesforceCRM?: {
            activeTasks: SalesforceTask[];
            recentLeads: SalesforceLead[];
            openOpportunities: SalesforceOpportunity[]; // Filtered to open
            activeCases: SalesforceCase[]; // Filtered to active
        };
        plaidFinancialData?: {
            accountsSummary: PlaidAccountSummary[];
            recentTransactions: PlaidTransaction[];
            investmentHoldings: PlaidInvestmentHolding[];
            financialGoalsProgress: PlaidFinancialGoal[];
        };
        // Extend with other relevant Fortune 500 APIs as needed (e.g., Adobe, SAP, Oracle)
    };
    strategicGoalFocus?: string; // High-level business goal currently prioritized (e.g., 'increase sales', 'reduce risk')
    userSentiment?: 'positive' | 'neutral' | 'negative' | 'stressed' | 'focused' | 'distracted'; // Inferred emotional state
}

/**
 * Generic configuration interface for a UI component within a layout.
 * Provides a standardized way to control visibility, size, position, and various visual properties.
 */
interface UILayoutComponentConfig {
    isVisible?: boolean; // Whether the component should be rendered
    isEnabled?: boolean; // Whether the component is interactive
    size?: 'auto' | 'small' | 'medium' | 'large' | string; // e.g., '250px', '20%', 'responsive'
    minSize?: string;
    maxSize?: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'absolute' | 'fixed' | { x: number; y: number };
    order?: number; // CSS flex/grid order property
    density?: 'compact' | 'standard' | 'spacious' | 'minimal'; // Controls padding, font size, spacing within component
    variant?: string; // Semantic variant (e.g., 'primary', 'secondary', 'alert', 'subtle')
    themeOverride?: { // Component-specific theme adjustments
        backgroundColor?: string;
        textColor?: string;
        borderColor?: string;
        shadow?: string;
    };
    iconSet?: 'default' | 'minimal' | 'stylized' | 'high-contrast'; // Which icon style to use
    animation?: 'none' | 'fade' | 'slide' | 'subtle' | 'bounce'; // Entrance/exit animation
    focusHighlight?: boolean; // Should this component draw explicit user attention?
    contentFilter?: 'all' | 'priority-only' | 'summary-view' | 'detailed-view'; // For filtering content within lists/feeds
    expandable?: boolean; // Whether the component can be expanded/collapsed by user
    draggable?: boolean; // Whether the component can be repositioned by user
    toolbarConfig?: { // Configuration for an internal toolbar within the component
        isVisible: boolean;
        buttonOrder: string[]; // List of button IDs in desired order
        showLabels: boolean; // Whether to show text labels for toolbar buttons
        alignment: 'left' | 'center' | 'right';
    };
    loadingIndicator?: 'spinner' | 'skeleton' | 'none'; // Type of loading indicator
    refreshIntervalSeconds?: number; // Auto-refresh data interval
    dataDisplayFormat?: 'chart' | 'table' | 'cards' | 'raw'; // Preferred data visualization
    // ... any other specific, granular properties applicable to a wide range of components
}

/**
 * Defines a comprehensive and highly granular UI layout configuration.
 * This interface is the primary output of the AdaptiveLayoutEngine and dictates
 * how the entire application UI should be composed and styled.
 */
export interface UILayoutConfig {
    version: string; // Semantic version of the layout schema itself
    timestamp: number; // Unix timestamp when this layout configuration was generated
    layoutStrategy: 'optimal' | 'fallback' | 'user-override' | 'crisis' | 'focus' | 'onboarding' | 'debug'; // Strategy that led to this layout
    explanation?: string; // Optional AI-generated explanation for the chosen layout adjustments

    globalTheme: {
        mode: 'light' | 'dark' | 'system-preference' | 'adaptive'; // Overall color scheme
        primaryColor: string; // Hex color code for primary branding elements
        secondaryColor: string; // Hex color code for secondary UI elements
        accentColor: string; // Hex color code for interactive elements, highlights
        neutralColor: string; // Hex color code for backgrounds, borders
        fontFamily: string; // Primary font stack
        fontSizeBase: string; // Base font size (e.g., '1rem', '16px')
        lineHeightBase: number; // Base line height (e.g., 1.5)
        spacingUnit: string; // Base unit for padding, margin (e.g., '0.5rem', '8px')
        cornerRadius: string; // Border radius for elements (e.g., '4px', '8px', '50%')
        shadowDepth: 'none' | 'shallow' | 'medium' | 'deep' | 'floating'; // Intensity of shadows
        animationSpeed: 'instant' | 'fast' | 'normal' | 'slow' | 'none'; // Global animation duration
        transitionEffect: 'ease-in-out' | 'linear' | 'ease-out-quad'; // Global transition timing function
        blurEffectIntensity: 'none' | 'low' | 'medium' | 'high'; // For backgrounds of modals, tooltips
    };

    pageLayout: {
        gridTemplateAreas: string; // CSS grid-template-areas property for overall page structure
        gridTemplateColumns: string; // CSS grid-template-columns property
        gridTemplateRows: string; // CSS grid-template-rows property
        gap: string; // CSS grid-gap for main areas
        padding: string; // Overall page padding
        margin: string; // Overall page margin
        maxContentWidth: string; // Maximum width of the main content area (e.g., '1440px', '90%')
        minContentWidth?: string;
        overflowBehavior: 'auto' | 'hidden' | 'scroll'; // How to handle content overflow
    };

    components: {
        // Core navigational and structural components
        sidebarPrimary: UILayoutComponentConfig & {
            sections: Array<{ id: string; order: number; isCollapsed: boolean; allowCollapse: boolean; }>; // Nav sections and their state
            autoCollapseThreshold: number; // Screen width (px) below which sidebar auto-collapses
            activeItemHighlight: 'subtle' | 'bold' | 'fill'; // Style for active navigation item
            autoHideBehavior: 'none' | 'on-idle' | 'on-focus-loss'; // How sidebar hides
            searchIntegration: 'inline' | 'modal' | 'none';
        };
        sidebarSecondary: UILayoutComponentConfig & {
            tabs: Array<{ id: string; label: string; icon: string; isVisible: boolean; }>; // Content tabs within secondary sidebar
            defaultTab?: string; // Which tab to show by default
            autoHideOnLowPriority: boolean; // Automatically hide if its content is deemed low priority
            contextualContentStrategy: 'pin-to-task' | 'suggest-related';
        };
        header: UILayoutComponentConfig & {
            logoVisibility: 'full' | 'icon-only' | 'hidden';
            searchBarLocation: 'center' | 'right' | 'left';
            quickAccessButtons: string[]; // List of component IDs for quick access (e.g., 'notifications', 'settings')
            profileDropdownContent: 'compact' | 'expanded' | 'user-info-only'; // Detail level of user profile dropdown
            brandingProminence: 'high' | 'medium' | 'low';
            stickyBehavior: 'sticky' | 'fixed' | 'none';
        };
        mainContentArea: UILayoutComponentConfig & {
            cardLayout: 'grid' | 'list' | 'carousel' | 'masonry'; // How main content cards are arranged
            cardDensity: 'compact' | 'standard' | 'spacious' | 'visual'; // Spacing and size of cards
            maxCardsPerRow: number; // Max number of cards in a grid row for desktop
            dynamicContentLoading: 'lazy' | 'eager' | 'predictive'; // Strategy for loading content
            emptyStateSuggestions: 'ai-generated' | 'template' | 'none'; // How to display empty states
        };
        notificationsPanel: UILayoutComponentConfig & {
            priorityFilter: 'critical-only' | 'high-medium' | 'all' | 'unread-only';
            autoDismissDelayMs: number; // Delay before non-critical notifications auto-dismiss
            groupingStrategy: 'by-type' | 'by-time' | 'by-source' | 'none';
            soundAlerts: boolean; // Enable/disable notification sounds
            vibrationAlerts: boolean; // Enable/disable vibration (for mobile devices)
            positioningStrategy: 'toast' | 'in-app-feed' | 'modal-center';
            maxVisibleNotifications: number;
        };
        commandPalette: UILayoutComponentConfig & {
            autoSuggestionsLimit: number; // Max number of AI-powered command suggestions
            recentCommandsDisplay: 'top' | 'contextual' | 'none';
            keyboardShortcutHint: boolean; // Show hints for keyboard shortcuts
            triggerMethod: 'always-on' | 'keyboard-only' | 'button-only';
            searchScope: 'app' | 'global' | 'contextual';
        };
        aiAssistantChat: UILayoutComponentConfig & {
            autoOpenOnContextChange: boolean; // Automatically open chat when context changes significantly
            responseDetailLevel: 'concise' | 'standard' | 'verbose' | 'explain-all';
            proactiveSuggestions: boolean; // Show proactive AI suggestions in chat
            chatHistoryRetentionDays: number;
            inputMethodPreference: 'text' | 'voice';
            personaPreference: 'formal' | 'casual' | 'expert';
        };
        footer: UILayoutComponentConfig & {
            legalLinksVisibility: boolean; // Show/hide legal and compliance links
            statusIndicators: string[]; // List of system status indicators (e.g., 'API Status', 'Sync Status', 'AI Model Health')
            helpLinkVisibility: boolean;
            versionInfoVisibility: boolean;
        };
        featureDock: UILayoutComponentConfig & {
            alignment: 'left' | 'right' | 'bottom' | 'floating'; // Position of the dock
            iconSize: 'small' | 'medium' | 'large';
            autoHide: boolean; // Automatically hide the dock when not in use
            pinnedFeatures: string[]; // IDs of features the user has chosen to keep in the dock
            labelVisibility: 'on-hover' | 'always' | 'never';
            dragAndDropEnabled: boolean;
        };

        // Data visualization components
        dataVisualizationWidgets: UILayoutComponentConfig & {
            chartTypePreference: 'bar' | 'line' | 'pie' | 'table' | 'area' | 'scatter'; // Preferred chart type
            realtimeUpdateFrequencySeconds: number; // How often to refresh real-time data visualizations
            dataPointDensity: 'low' | 'medium' | 'high'; // Number of data points displayed
            interactiveLegend: boolean;
            exportOptions: string[]; // e.g., 'csv', 'pdf', 'image'
        };

        // Form and input components
        formInputs: UILayoutComponentConfig & {
            autoSaveEnabled: boolean;
            validationFeedbackStyle: 'inline' | 'tooltip' | 'summary-list';
            autocompleteStrategy: 'on' | 'off' | 'ai-enhanced' | 'history-based';
            fieldDensity: 'compact' | 'standard' | 'spacious';
            labelPlacement: 'top' | 'left' | 'inside';
            errorHighlighting: 'border' | 'background' | 'icon';
        };

        // List and table components
        transactionLists: UILayoutComponentConfig & {
            defaultSortOrder: 'date-desc' | 'amount-desc' | 'category-asc';
            categoryGrouping: boolean; // Enable/disable grouping transactions by category
            filterPanelVisibility: boolean;
            paginationStyle: 'load-more' | 'numbered-pages' | 'infinite-scroll';
            rowDensity: 'condensed' | 'comfortable';
            columnVisibility: { [key: string]: boolean }; // e.g., { 'merchant': true, 'notes': false }
        };

        // Specific financial application components
        balanceSummaryCard: UILayoutComponentConfig & {
            showAccountDetails: boolean;
            showQuickActions: boolean;
            compactViewThreshold: number; // Screen width
        };
        budgetsOverview: UILayoutComponentConfig & {
            displayMode: 'pie' | 'bar' | 'list';
            highlightOverspent: boolean;
            budgetGoalProgressBars: 'visible' | 'hidden';
        };
        investmentPortfolioSnapshot: UILayoutComponentConfig & {
            showPerformanceMetrics: boolean;
            assetAllocationChart: 'donut' | 'treemap' | 'none';
            watchlistVisibility: 'expanded' | 'collapsed';
        };
        financialGoalsTracker: UILayoutComponentConfig & {
            showTimeline: boolean;
            projectionSimulatorEnabled: boolean;
            goalProgressVisualization: 'linear' | 'circular';
            aiGoalSuggestions: 'visible' | 'hidden';
        };
        recentTransactionsFeed: UILayoutComponentConfig & {
            showMerchantLogos: boolean;
            transactionGrouping: 'daily' | 'weekly' | 'none';
            miniMapVisibility: 'visible' | 'hidden'; // For geographical transactions
        };
        aiInsightsPanel: UILayoutComponentConfig & {
            insightCategoryFilter: string[]; // e.g., ['spending', 'saving', 'investment']
            refreshFrequencySeconds: number;
            feedbackMechanism: 'thumbs-up-down' | 'detailed-form';
            explanationVisibility: 'on-hover' | 'always';
        };
        pnlStatementView: UILayoutComponentConfig & {
            periodSelector: 'dropdown' | 'buttons';
            drillDownEnabled: boolean;
            comparisonFeatureEnabled: boolean;
        };
        cashFlowProjectionChart: UILayoutComponentConfig & {
            forecastHorizonMonths: number;
            scenarioModelingEnabled: boolean;
            breakdownCategories: string[];
        };
        riskAssessmentDashboard: UILayoutComponentConfig & {
            riskMatrixVisibility: boolean;
            mitigationPlanTracking: 'simplified' | 'detailed';
            severityThreshold: 'low' | 'medium' | 'high';
        };
        complianceReportsViewer: UILayoutComponentConfig & {
            documentViewerMode: 'preview' | 'full';
            annotationToolsEnabled: boolean;
            versionHistoryVisibility: boolean;
        };
        corporateAccountSummary: UILayoutComponentConfig & {
            groupBySubsidiary: boolean;
            showIntercompanyTransfers: boolean;
            executiveSummaryView: 'condensed' | 'detailed';
        };
        tradeExecutionPanel: UILayoutComponentConfig & {
            orderBookDepth: 'minimal' | 'full';
            chartingToolsIntegration: 'basic' | 'advanced';
            quickBuySellButtons: boolean;
            riskWarningProminence: 'subtle' | 'prominent';
        };
        // Add more specific components based on the project structure (e.g., from components/views/megadashboard)
        dataCatalogExplorer: UILayoutComponentConfig;
        predictiveModelsDashboard: UILayoutComponentConfig;
        fraudDetectionAlerts: UILayoutComponentConfig;
        loanApplicationWorkflow: UILayoutComponentConfig;
        blockchainLedgerViewer: UILayoutComponentConfig;
        daoGovernanceVoting: UILayoutComponentConfig;
        apiManagementDashboard: UILayoutComponentConfig;
        ciCdPipelineMonitor: UILayoutComponentConfig;
    };

    accessibilitySettings: {
        fontSizeMultiplier: number; // Factor to scale all font sizes (e.g., 1.0, 1.25, 1.5)
        highContrastMode: boolean; // Enables a high-contrast theme
        reducedMotion: boolean; // Disables complex animations, uses simple transitions
        screenReaderOptimized: boolean; // Enables ARIA attributes and semantic HTML optimizations
        dyslexiaFriendlyFont: boolean; // Uses a font designed for dyslexia
        keyboardNavigationFocusStyle: 'outline' | 'shadow' | 'underline' | 'none'; // Visual style for keyboard focus
        colorBlindnessFilter: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'; // Applies a color filter
        textSpacingAdjustment: 'none' | 'loose' | 'extra-loose';
    };

    performanceOptimization: {
        imageOptimizationLevel: 'none' | 'low' | 'medium' | 'high'; // Compression and format for images
        lazyLoadThresholdPx: number; // Pixels before viewport to lazy load elements
        clientSideCachingStrategy: 'aggressive' | 'standard' | 'minimal' | 'disabled';
        dataPrefetching: boolean; // Whether to prefetch data for anticipated user actions
        bundleSplittingStrategy: 'route-based' | 'component-based' | 'minimal';
        resourcePrioritization: 'critical-first' | 'balanced'; // Prioritize loading of visible/interactive elements
        webWorkerUtilization: 'aggressive' | 'standard' | 'minimal';
    };

    aiInteractions: {
        aiAssistanceLevel: 'minimal' | 'suggestive' | 'proactive' | 'autonomous'; // How much AI intervenes
        proactiveSuggestionFrequency: 'low' | 'medium' | 'high' | 'constant';
        explanationVerbosity: 'none' | 'summary' | 'detailed' | 'verbose'; // How much AI explains its actions/suggestions
        voiceCommandSensitivity: 'low' | 'medium' | 'high' | 'off'; // Sensitivity of voice command recognition
        aiGeneratedContentPreview: 'inline' | 'modal' | 'tooltip' | 'disabled'; // How AI generated content is shown
        aiFeedbackCollection: 'implicit' | 'explicit' | 'mixed' | 'disabled'; // How user feedback for AI is collected
        aiPrivacyMode: 'strict' | 'balanced' | 'relaxed'; // Data sharing for AI processing
    };

    developerSettings?: { // Settings specifically for developer mode
        debugPanelVisible: boolean;
        apiCallLogging: boolean;
        componentOutlineMode: boolean; // Visual outlines for components
        performanceMonitoringOverlay: boolean;
    };
}


// --- Default Layouts and Configuration Presets ---

/**
 * Default layout configuration for desktop environments.
 * This serves as a baseline for the AI to adapt from.
 */
const DEFAULT_DESKTOP_LAYOUT: UILayoutConfig = {
    version: '1.2.0',
    timestamp: Date.now(),
    layoutStrategy: 'fallback',
    explanation: 'Standard desktop layout, optimized for productivity and data visibility.',
    globalTheme: {
        mode: 'light',
        primaryColor: '#007bff', // Bootstrap primary blue
        secondaryColor: '#6c757d', // Bootstrap secondary grey
        accentColor: '#28a745', // Green for positive actions
        neutralColor: '#f8f9fa', // Light grey background
        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        fontSizeBase: '16px',
        lineHeightBase: 1.5,
        spacingUnit: '8px',
        cornerRadius: '4px',
        shadowDepth: 'medium',
        animationSpeed: 'normal',
        transitionEffect: 'ease-in-out',
        blurEffectIntensity: 'none',
    },
    pageLayout: {
        gridTemplateAreas: `
            'header header header'
            'sidebar-primary main-content sidebar-secondary'
            'footer footer footer'
        `,
        gridTemplateColumns: '250px 1fr 300px',
        gridTemplateRows: '64px 1fr 40px',
        gap: '16px',
        padding: '16px',
        margin: '0',
        maxContentWidth: '1920px',
        minContentWidth: '992px',
        overflowBehavior: 'auto',
    },
    components: {
        sidebarPrimary: {
            isVisible: true,
            isEnabled: true,
            size: '250px',
            position: 'left',
            order: 1,
            density: 'standard',
            sections: [
                { id: 'dashboard', order: 1, isCollapsed: false, allowCollapse: true },
                { id: 'financials', order: 2, isCollapsed: false, allowCollapse: true },
                { id: 'investments', order: 3, isCollapsed: false, allowCollapse: true },
                { id: 'ai-tools', order: 4, isCollapsed: true, allowCollapse: true },
                { id: 'settings', order: 5, isCollapsed: true, allowCollapse: true },
                { id: 'corporate', order: 6, isCollapsed: true, allowCollapse: true },
            ],
            autoCollapseThreshold: 1024,
            activeItemHighlight: 'bold',
            autoHideBehavior: 'on-focus-loss',
            searchIntegration: 'inline',
        },
        sidebarSecondary: {
            isVisible: true,
            isEnabled: true,
            size: '300px',
            position: 'right',
            order: 3,
            density: 'standard',
            tabs: [
                { id: 'ai-insights', label: 'AI Insights', icon: 'sparkles', isVisible: true },
                { id: 'notifications', label: 'Alerts', icon: 'bell', isVisible: true },
                { id: 'recent-activity', label: 'Activity', icon: 'activity', isVisible: true },
            ],
            defaultTab: 'ai-insights',
            autoHideOnLowPriority: false,
            contextualContentStrategy: 'pin-to-task',
        },
        header: {
            isVisible: true,
            isEnabled: true,
            size: '64px',
            position: 'top',
            order: 0,
            density: 'standard',
            logoVisibility: 'full',
            searchBarLocation: 'center',
            quickAccessButtons: ['command-palette', 'notifications', 'settings', 'user-profile'],
            profileDropdownContent: 'expanded',
            brandingProminence: 'medium',
            stickyBehavior: 'sticky',
        },
        mainContentArea: {
            isVisible: true,
            isEnabled: true,
            size: 'auto',
            position: 'center',
            order: 2,
            density: 'standard',
            cardLayout: 'grid',
            cardDensity: 'standard',
            maxCardsPerRow: 3,
            dynamicContentLoading: 'predictive',
            emptyStateSuggestions: 'ai-generated',
        },
        notificationsPanel: {
            isVisible: false, // Managed by secondary sidebar tab or toast
            priorityFilter: 'critical-only',
            autoDismissDelayMs: 7000,
            groupingStrategy: 'by-type',
            soundAlerts: true,
            vibrationAlerts: false,
            positioningStrategy: 'toast',
            maxVisibleNotifications: 5,
        },
        commandPalette: {
            isVisible: false,
            isEnabled: true,
            size: 'medium',
            position: 'center',
            order: 100,
            autoSuggestionsLimit: 7,
            recentCommandsDisplay: 'top',
            keyboardShortcutHint: true,
            triggerMethod: 'keyboard-only',
            searchScope: 'global',
        },
        aiAssistantChat: {
            isVisible: true,
            isEnabled: true,
            size: 'small',
            position: 'bottom-right',
            order: 101,
            autoOpenOnContextChange: false,
            responseDetailLevel: 'standard',
            proactiveSuggestions: true,
            chatHistoryRetentionDays: 30,
            inputMethodPreference: 'text',
            personaPreference: 'expert',
        },
        footer: {
            isVisible: true,
            isEnabled: true,
size: '40px',
            position: 'bottom',
            order: 1000,
            legalLinksVisibility: true,
            statusIndicators: ['API Status', 'Sync Status', 'AI Model Health'],
            helpLinkVisibility: true,
            versionInfoVisibility: true,
        },
        featureDock: {
            isVisible: false,
            isEnabled: false,
            alignment: 'bottom',
            iconSize: 'medium',
            autoHide: true,
            pinnedFeatures: [],
            labelVisibility: 'on-hover',
            dragAndDropEnabled: true,
        },
        dataVisualizationWidgets: {
            isVisible: true,
            isEnabled: true,
            chartTypePreference: 'bar',
            realtimeUpdateFrequencySeconds: 15,
            dataPointDensity: 'high',
            interactiveLegend: true,
            exportOptions: ['csv', 'pdf', 'image'],
        },
        formInputs: {
            isVisible: true,
            isEnabled: true,
            autoSaveEnabled: true,
            validationFeedbackStyle: 'inline',
            autocompleteStrategy: 'ai-enhanced',
            fieldDensity: 'standard',
            labelPlacement: 'top',
            errorHighlighting: 'border',
        },
        transactionLists: {
            isVisible: true,
            isEnabled: true,
            defaultSortOrder: 'date-desc',
            categoryGrouping: true,
            filterPanelVisibility: true,
            paginationStyle: 'numbered-pages',
            rowDensity: 'comfortable',
            columnVisibility: {
                date: true,
                description: true,
                amount: true,
                category: true,
                account: false,
                notes: false,
            },
        },
        balanceSummaryCard: { isVisible: true, isEnabled: true, density: 'standard', order: 1, showAccountDetails: true, showQuickActions: true, compactViewThreshold: 768 },
        budgetsOverview: { isVisible: true, isEnabled: true, density: 'standard', order: 2, displayMode: 'bar', highlightOverspent: true, budgetGoalProgressBars: 'visible' },
        investmentPortfolioSnapshot: { isVisible: true, isEnabled: true, density: 'standard', order: 3, showPerformanceMetrics: true, assetAllocationChart: 'donut', watchlistVisibility: 'expanded' },
        financialGoalsTracker: { isVisible: true, isEnabled: true, density: 'standard', order: 4, showTimeline: true, projectionSimulatorEnabled: true, goalProgressVisualization: 'linear', aiGoalSuggestions: 'visible' },
        recentTransactionsFeed: { isVisible: true, isEnabled: true, density: 'standard', order: 5, showMerchantLogos: true, transactionGrouping: 'daily', miniMapVisibility: 'hidden' },
        aiInsightsPanel: { isVisible: true, isEnabled: true, density: 'standard', order: 6, insightCategoryFilter: ['spending', 'saving', 'investment', 'market'], refreshFrequencySeconds: 60, feedbackMechanism: 'thumbs-up-down', explanationVisibility: 'on-hover' },
        pnlStatementView: { isVisible: true, isEnabled: true, density: 'standard', periodSelector: 'dropdown', drillDownEnabled: true, comparisonFeatureEnabled: true },
        cashFlowProjectionChart: { isVisible: true, isEnabled: true, density: 'standard', forecastHorizonMonths: 12, scenarioModelingEnabled: true, breakdownCategories: ['income', 'expenses', 'investments'] },
        riskAssessmentDashboard: { isVisible: true, isEnabled: true, density: 'standard', riskMatrixVisibility: true, mitigationPlanTracking: 'detailed', severityThreshold: 'high' },
        complianceReportsViewer: { isVisible: true, isEnabled: true, density: 'standard', documentViewerMode: 'preview', annotationToolsEnabled: true, versionHistoryVisibility: true },
        corporateAccountSummary: { isVisible: true, isEnabled: true, density: 'standard', groupBySubsidiary: true, showIntercompanyTransfers: false, executiveSummaryView: 'condensed' },
        tradeExecutionPanel: { isVisible: false, isEnabled: false, density: 'standard', orderBookDepth: 'full', chartingToolsIntegration: 'advanced', quickBuySellButtons: true, riskWarningProminence: 'prominent' },
        dataCatalogExplorer: { isVisible: false, isEnabled: false, density: 'standard' },
        predictiveModelsDashboard: { isVisible: false, isEnabled: false, density: 'standard' },
        fraudDetectionAlerts: { isVisible: false, isEnabled: false, density: 'standard' },
        loanApplicationWorkflow: { isVisible: false, isEnabled: false, density: 'standard' },
        blockchainLedgerViewer: { isVisible: false, isEnabled: false, density: 'standard' },
        daoGovernanceVoting: { isVisible: false, isEnabled: false, density: 'standard' },
        apiManagementDashboard: { isVisible: false, isEnabled: false, density: 'standard' },
        ciCdPipelineMonitor: { isVisible: false, isEnabled: false, density: 'standard' },
    },
    accessibilitySettings: {
        fontSizeMultiplier: 1.0,
        highContrastMode: false,
        reducedMotion: false,
        screenReaderOptimized: true,
        dyslexiaFriendlyFont: false,
        keyboardNavigationFocusStyle: 'outline',
        colorBlindnessFilter: 'none',
        textSpacingAdjustment: 'none',
    },
    performanceOptimization: {
        imageOptimizationLevel: 'high',
        lazyLoadThresholdPx: 300,
        clientSideCachingStrategy: 'standard',
        dataPrefetching: true,
        bundleSplittingStrategy: 'route-based',
        resourcePrioritization: 'critical-first',
        webWorkerUtilization: 'standard',
    },
    aiInteractions: {
        aiAssistanceLevel: 'suggestive',
        proactiveSuggestionFrequency: 'medium',
        explanationVerbosity: 'summary',
        voiceCommandSensitivity: 'medium',
        aiGeneratedContentPreview: 'inline',
        aiFeedbackCollection: 'implicit',
        aiPrivacyMode: 'balanced',
    },
    developerSettings: {
        debugPanelVisible: false,
        apiCallLogging: false,
        componentOutlineMode: false,
        performanceMonitoringOverlay: false,
    }
};

/**
 * Default layout configuration for mobile (and smaller tablet) environments.
 */
const DEFAULT_MOBILE_LAYOUT: UILayoutConfig = {
    version: '1.2.0',
    timestamp: Date.now(),
    layoutStrategy: 'fallback',
    explanation: 'Standard mobile layout, optimized for touch interaction and limited screen space.',
    globalTheme: {
        mode: 'dark', // Often preferred on mobile for battery saving and outdoor visibility
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        accentColor: '#28a745',
        neutralColor: '#121212', // Dark background
        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        fontSizeBase: '14px',
        lineHeightBase: 1.4,
        spacingUnit: '4px',
        cornerRadius: '8px',
        shadowDepth: 'shallow',
        animationSpeed: 'fast',
        transitionEffect: 'ease-in-out',
        blurEffectIntensity: 'low',
    },
    pageLayout: {
        gridTemplateAreas: `
            'header'
            'main-content'
            'feature-dock'
        `,
        gridTemplateColumns: '1fr',
        gridTemplateRows: '56px 1fr 64px',
        gap: '8px',
        padding: '8px',
        margin: '0',
        maxContentWidth: 'none', // Full width on mobile
        minContentWidth: '320px',
        overflowBehavior: 'auto',
    },
    components: {
        sidebarPrimary: {
            isVisible: false, // Hidden by default, accessed via a hamburger menu in the header
            isEnabled: true,
            size: '100%',
            position: 'left',
            order: 1,
            density: 'compact',
            sections: [
                { id: 'dashboard', order: 1, isCollapsed: false, allowCollapse: false },
                { id: 'financials', order: 2, isCollapsed: false, allowCollapse: false },
                { id: 'investments', order: 3, isCollapsed: false, allowCollapse: false },
                { id: 'ai-tools', order: 4, isCollapsed: true, allowCollapse: false },
                { id: 'settings', order: 5, isCollapsed: true, allowCollapse: false },
                { id: 'corporate', order: 6, isCollapsed: true, allowCollapse: false },
            ],
            autoCollapseThreshold: 0,
            activeItemHighlight: 'subtle',
            autoHideBehavior: 'none',
            searchIntegration: 'modal',
        },
        sidebarSecondary: {
            isVisible: false,
            isEnabled: false,
            size: '100%',
            position: 'bottom',
            order: 3,
            density: 'compact',
            tabs: [],
            defaultTab: undefined,
            autoHideOnLowPriority: true,
            contextualContentStrategy: 'suggest-related',
        },
        header: {
            isVisible: true,
            isEnabled: true,
            size: '56px',
            position: 'top',
            order: 0,
            density: 'compact',
            logoVisibility: 'icon-only',
            searchBarLocation: 'right', // Often includes a search icon
            quickAccessButtons: ['menu', 'notifications'], // Hamburger menu, notifications bell
            profileDropdownContent: 'compact',
            brandingProminence: 'low',
            stickyBehavior: 'fixed',
        },
        mainContentArea: {
            isVisible: true,
            isEnabled: true,
            size: 'auto',
            position: 'center',
            order: 1,
            density: 'compact',
            cardLayout: 'list', // List view often better on mobile for readability
            cardDensity: 'compact',
            maxCardsPerRow: 1,
            dynamicContentLoading: 'lazy',
            emptyStateSuggestions: 'template',
        },
        notificationsPanel: {
            isVisible: false, // Typically presented as a modal or dedicated screen
            priorityFilter: 'critical-only',
            autoDismissDelayMs: 5000,
            groupingStrategy: 'by-time',
            soundAlerts: true,
            vibrationAlerts: true,
            positioningStrategy: 'modal-center',
            maxVisibleNotifications: 3,
        },
        commandPalette: {
            isVisible: false,
            isEnabled: true,
            size: 'large',
            position: 'modal',
            order: 100,
            autoSuggestionsLimit: 3,
            recentCommandsDisplay: 'none',
            keyboardShortcutHint: false,
            triggerMethod: 'button-only',
            searchScope: 'app',
        },
        aiAssistantChat: {
            isVisible: false, // Often in a dedicated screen or bottom sheet
            isEnabled: true,
            size: 'full',
            position: 'modal',
            order: 101,
            autoOpenOnContextChange: false,
            responseDetailLevel: 'concise',
            proactiveSuggestions: true,
            chatHistoryRetentionDays: 7,
            inputMethodPreference: 'voice',
            personaPreference: 'casual',
        },
        footer: {
            isVisible: false, // Replaced by featureDock (bottom navigation)
            isEnabled: false,
            size: '0px',
            position: 'bottom',
            order: 1000,
            legalLinksVisibility: false,
            statusIndicators: [],
            helpLinkVisibility: false,
            versionInfoVisibility: false,
        },
        featureDock: {
            isVisible: true,
            isEnabled: true,
            alignment: 'bottom',
            iconSize: 'large',
            autoHide: false,
            pinnedFeatures: ['dashboard', 'transactions', 'investments', 'ai-tools', 'more'], // Essential bottom navigation
            labelVisibility: 'always',
            dragAndDropEnabled: false,
        },
        dataVisualizationWidgets: {
            isVisible: true,
            isEnabled: true,
            chartTypePreference: 'table', // Simplified charts or lists for mobile
            realtimeUpdateFrequencySeconds: 60,
            dataPointDensity: 'low',
            interactiveLegend: false,
            exportOptions: ['csv', 'image'],
        },
        formInputs: {
            isVisible: true,
            isEnabled: true,
            autoSaveEnabled: false, // More explicit saves
            validationFeedbackStyle: 'tooltip',
            autocompleteStrategy: 'on',
            fieldDensity: 'compact',
            labelPlacement: 'inside',
            errorHighlighting: 'background',
        },
        transactionLists: {
            isVisible: true,
            isEnabled: true,
            defaultSortOrder: 'date-desc',
            categoryGrouping: false, // Simplified
            filterPanelVisibility: false, // Access via dedicated filter screen/modal
            paginationStyle: 'load-more',
            rowDensity: 'condensed',
            columnVisibility: {
                date: true,
                description: true,
                amount: true,
                category: false,
                account: false,
                notes: false,
            },
        },
        balanceSummaryCard: { isVisible: true, isEnabled: true, density: 'compact', order: 1, showAccountDetails: false, showQuickActions: false, compactViewThreshold: 0 },
        budgetsOverview: { isVisible: true, isEnabled: true, density: 'compact', order: 2, displayMode: 'list', highlightOverspent: true, budgetGoalProgressBars: 'visible' },
        investmentPortfolioSnapshot: { isVisible: true, isEnabled: true, density: 'compact', order: 3, showPerformanceMetrics: false, assetAllocationChart: 'none', watchlistVisibility: 'collapsed' },
        financialGoalsTracker: { isVisible: false, isEnabled: true, density: 'compact', order: 4, showTimeline: false, projectionSimulatorEnabled: false, goalProgressVisualization: 'linear', aiGoalSuggestions: 'hidden' }, // Often hidden by default
        recentTransactionsFeed: { isVisible: true, isEnabled: true, density: 'compact', order: 5, showMerchantLogos: true, transactionGrouping: 'none', miniMapVisibility: 'hidden' },
        aiInsightsPanel: { isVisible: false, isEnabled: true, density: 'compact', order: 6, insightCategoryFilter: ['spending', 'saving'], refreshFrequencySeconds: 120, feedbackMechanism: 'thumbs-up-down', explanationVisibility: 'on-hover' },
        pnlStatementView: { isVisible: false, isEnabled: true, density: 'compact', periodSelector: 'dropdown', drillDownEnabled: false, comparisonFeatureEnabled: false },
        cashFlowProjectionChart: { isVisible: false, isEnabled: true, density: 'compact', forecastHorizonMonths: 3, scenarioModelingEnabled: false, breakdownCategories: ['income', 'expenses'] },
        riskAssessmentDashboard: { isVisible: false, isEnabled: true, density: 'compact', riskMatrixVisibility: false, mitigationPlanTracking: 'simplified', severityThreshold: 'medium' },
        complianceReportsViewer: { isVisible: false, isEnabled: true, density: 'compact', documentViewerMode: 'preview', annotationToolsEnabled: false, versionHistoryVisibility: false },
        corporateAccountSummary: { isVisible: false, isEnabled: true, density: 'compact', groupBySubsidiary: false, showIntercompanyTransfers: false, executiveSummaryView: 'condensed' },
        tradeExecutionPanel: { isVisible: false, isEnabled: false, density: 'compact', orderBookDepth: 'minimal', chartingToolsIntegration: 'basic', quickBuySellButtons: true, riskWarningProminence: 'subtle' },
        dataCatalogExplorer: { isVisible: false, isEnabled: false, density: 'compact' },
        predictiveModelsDashboard: { isVisible: false, isEnabled: false, density: 'compact' },
        fraudDetectionAlerts: { isVisible: false, isEnabled: false, density: 'compact' },
        loanApplicationWorkflow: { isVisible: false, isEnabled: false, density: 'compact' },
        blockchainLedgerViewer: { isVisible: false, isEnabled: false, density: 'compact' },
        daoGovernanceVoting: { isVisible: false, isEnabled: false, density: 'compact' },
        apiManagementDashboard: { isVisible: false, isEnabled: false, density: 'compact' },
        ciCdPipelineMonitor: { isVisible: false, isEnabled: false, density: 'compact' },
    },
    accessibilitySettings: {
        fontSizeMultiplier: 1.0,
        highContrastMode: false,
        reducedMotion: false,
        screenReaderOptimized: true,
        dyslexiaFriendlyFont: false,
        keyboardNavigationFocusStyle: 'outline',
        colorBlindnessFilter: 'none',
        textSpacingAdjustment: 'none',
    },
    performanceOptimization: {
        imageOptimizationLevel: 'medium',
        lazyLoadThresholdPx: 100,
        clientSideCachingStrategy: 'aggressive',
        dataPrefetching: false, // Conserve data/bandwidth
        bundleSplittingStrategy: 'component-based',
        resourcePrioritization: 'critical-first',
        webWorkerUtilization: 'minimal',
    },
    aiInteractions: {
        aiAssistanceLevel: 'suggestive',
        proactiveSuggestionFrequency: 'low', // Less intrusive on mobile
        explanationVerbosity: 'summary',
        voiceCommandSensitivity: 'medium',
        aiGeneratedContentPreview: 'modal',
        aiFeedbackCollection: 'implicit',
        aiPrivacyMode: 'balanced',
    },
    developerSettings: {
        debugPanelVisible: false,
        apiCallLogging: false,
        componentOutlineMode: false,
        performanceMonitoringOverlay: false,
    }
};

/**
 * Layout designed for high cognitive load or crisis scenarios.
 * Focuses on minimalism, critical information, and rapid action.
 */
const CRISIS_MODE_LAYOUT: UILayoutConfig = {
    ...DEFAULT_DESKTOP_LAYOUT, // Start from desktop baseline
    layoutStrategy: 'crisis',
    explanation: 'Crisis mode activated: streamlined UI for critical alerts and urgent actions. Minimized distractions.',
    globalTheme: {
        ...DEFAULT_DESKTOP_LAYOUT.globalTheme,
        mode: 'dark', // High contrast, less eye strain in high-stress situations
        primaryColor: '#dc3545', // Red for urgency
        accentColor: '#ffc107', // Amber for warnings
        neutralColor: '#212529',
        shadowDepth: 'none',
        animationSpeed: 'instant',
    },
    pageLayout: {
        ...DEFAULT_DESKTOP_LAYOUT.pageLayout,
        gridTemplateAreas: `'header' 'main-content'`, // Single column layout
        gridTemplateColumns: '1fr',
        gridTemplateRows: '56px 1fr',
        gap: '0px',
        padding: '8px',
        maxContentWidth: '1200px', // Keep content focused
    },
    components: {
        ...DEFAULT_DESKTOP_LAYOUT.components,
        sidebarPrimary: { ...DEFAULT_DESKTOP_LAYOUT.components.sidebarPrimary, isVisible: false, isEnabled: false },
        sidebarSecondary: { ...DEFAULT_DESKTOP_LAYOUT.components.sidebarSecondary, isVisible: false, isEnabled: false },
        header: {
            ...DEFAULT_DESKTOP_LAYOUT.components.header,
            size: '56px',
            logoVisibility: 'icon-only',
            searchBarLocation: 'hidden',
            quickAccessButtons: ['notifications', 'user-profile'], // Only critical access
            brandingProminence: 'high', // Critical context
        },
        mainContentArea: {
            ...DEFAULT_DESKTOP_LAYOUT.components.mainContentArea,
            cardLayout: 'list',
            cardDensity: 'compact',
            maxCardsPerRow: 1,
            emptyStateSuggestions: 'none',
        },
        notificationsPanel: {
            ...DEFAULT_DESKTOP_LAYOUT.components.notificationsPanel,
            isVisible: true,
            priorityFilter: 'critical-only',
            positioningStrategy: 'in-app-feed', // Prominent display
            maxVisibleNotifications: 10,
            soundAlerts: true,
            vibrationAlerts: true,
        },
        commandPalette: { ...DEFAULT_DESKTOP_LAYOUT.components.commandPalette, isVisible: true, autoSuggestionsLimit: 3 },
        aiAssistantChat: {
            ...DEFAULT_DESKTOP_LAYOUT.components.aiAssistantChat,
            isVisible: true,
            autoOpenOnContextChange: true, // Proactive AI during crisis
            responseDetailLevel: 'concise',
            proactiveSuggestions: true,
            personaPreference: 'formal',
        },
        footer: {
            ...DEFAULT_DESKTOP_LAYOUT.components.footer,
            isVisible: true,
            legalLinksVisibility: false,
            statusIndicators: ['API Status', 'AI Model Health'], // Critical systems
            helpLinkVisibility: true,
            versionInfoVisibility: false,
        },
        featureDock: { ...DEFAULT_DESKTOP_LAYOUT.components.featureDock, isVisible: false },
        balanceSummaryCard: { ...DEFAULT_DESKTOP_LAYOUT.components.balanceSummaryCard, isVisible: true, showQuickActions: false, density: 'compact' },
        budgetsOverview: { ...DEFAULT_DESKTOP_LAYOUT.components.budgetsOverview, isVisible: false, isEnabled: false },
        investmentPortfolioSnapshot: { ...DEFAULT_DESKTOP_LAYOUT.components.investmentPortfolioSnapshot, isVisible: false, isEnabled: false },
        financialGoalsTracker: { ...DEFAULT_DESKTOP_LAYOUT.components.financialGoalsTracker, isVisible: false, isEnabled: false },
        recentTransactionsFeed: { ...DEFAULT_DESKTOP_LAYOUT.components.recentTransactionsFeed, isVisible: true, transactionGrouping: 'none', columnVisibility: { date: true, description: true, amount: true, category: false } },
        aiInsightsPanel: { ...DEFAULT_DESKTOP_LAYOUT.components.aiInsightsPanel, isVisible: false, isEnabled: false },
        riskAssessmentDashboard: { ...DEFAULT_DESKTOP_LAYOUT.components.riskAssessmentDashboard, isVisible: true, density: 'standard', riskMatrixVisibility: true, mitigationPlanTracking: 'detailed', severityThreshold: 'high' },
        fraudDetectionAlerts: { ...DEFAULT_DESKTOP_LAYOUT.components.fraudDetectionAlerts, isVisible: true, isEnabled: true },
        tradeExecutionPanel: { ...DEFAULT_DESKTOP_LAYOUT.components.tradeExecutionPanel, isVisible: true, isEnabled: true, orderBookDepth: 'full', chartingToolsIntegration: 'basic', quickBuySellButtons: true, riskWarningProminence: 'prominent' },
        // Hide most other components
        dataVisualizationWidgets: { ...DEFAULT_DESKTOP_LAYOUT.components.dataVisualizationWidgets, isVisible: false, isEnabled: false },
        formInputs: { ...DEFAULT_DESKTOP_LAYOUT.components.formInputs, isVisible: false, isEnabled: false },
        transactionLists: { ...DEFAULT_DESKTOP_LAYOUT.components.transactionLists, isVisible: false, isEnabled: false },
    },
    accessibilitySettings: {
        ...DEFAULT_DESKTOP_LAYOUT.accessibilitySettings,
        highContrastMode: true,
        reducedMotion: true,
    },
    performanceOptimization: {
        ...DEFAULT_DESKTOP_LAYOUT.performanceOptimization,
        imageOptimizationLevel: 'none',
        lazyLoadThresholdPx: 0,
        dataPrefetching: true,
        resourcePrioritization: 'critical-first',
    },
    aiInteractions: {
        ...DEFAULT_DESKTOP_LAYOUT.aiInteractions,
        aiAssistanceLevel: 'proactive',
        proactiveSuggestionFrequency: 'constant',
        explanationVerbosity: 'concise',
    },
};

/**
 * Layout optimized for deep data analysis, with focus on charts and tables.
 */
const ANALYTICS_FOCUS_LAYOUT: UILayoutConfig = {
    ...DEFAULT_DESKTOP_LAYOUT,
    layoutStrategy: 'analytics-focus',
    explanation: 'Optimized for deep data analysis, maximizing visualization and data table real estate.',
    globalTheme: {
        ...DEFAULT_DESKTOP_LAYOUT.globalTheme,
        mode: 'dark',
        primaryColor: '#17a2b8', // Info blue
        accentColor: '#ffc107',
    },
    pageLayout: {
        ...DEFAULT_DESKTOP_LAYOUT.pageLayout,
        gridTemplateAreas: `
            'header header'
            'main-content sidebar-secondary'
            'footer footer'
        `,
        gridTemplateColumns: '1fr 350px', // Wider main content, dedicated analysis panel
        gridTemplateRows: '64px 1fr 40px',
        gap: '8px',
        padding: '8px',
    },
    components: {
        ...DEFAULT_DESKTOP_LAYOUT.components,
        sidebarPrimary: { ...DEFAULT_DESKTOP_LAYOUT.components.sidebarPrimary, isVisible: false, isEnabled: false }, // Hide primary nav for focus
        sidebarSecondary: {
            ...DEFAULT_DESKTOP_LAYOUT.components.sidebarSecondary,
            isVisible: true,
            size: '350px',
            tabs: [
                { id: 'filters', label: 'Filters', icon: 'filter', isVisible: true },
                { id: 'parameters', label: 'Parameters', icon: 'sliders', isVisible: true },
                { id: 'ai-suggestions', label: 'AI Insights', icon: 'sparkles', isVisible: true },
            ],
            defaultTab: 'filters',
            autoHideOnLowPriority: false,
            contextualContentStrategy: 'pin-to-task',
        },
        header: {
            ...DEFAULT_DESKTOP_LAYOUT.components.header,
            searchBarLocation: 'right', // Compact
            quickAccessButtons: ['command-palette', 'settings', 'user-profile'], // Focus on analytics tools
        },
        mainContentArea: {
            ...DEFAULT_DESKTOP_LAYOUT.components.mainContentArea,
            cardLayout: 'grid',
            cardDensity: 'spacious', // More room for charts
            maxCardsPerRow: 2,
            dynamicContentLoading: 'eager',
        },
        dataVisualizationWidgets: {
            ...DEFAULT_DESKTOP_LAYOUT.components.dataVisualizationWidgets,
            isVisible: true,
            chartTypePreference: 'line', // Prefer line/area for trends
            realtimeUpdateFrequencySeconds: 5,
            dataPointDensity: 'high',
            interactiveLegend: true,
            exportOptions: ['csv', 'json', 'pdf', 'image', 'svg'],
        },
        transactionLists: {
            ...DEFAULT_DESKTOP_LAYOUT.components.transactionLists,
            isVisible: true,
            defaultSortOrder: 'date-desc',
            categoryGrouping: true,
            filterPanelVisibility: false, // Moved to secondary sidebar
            paginationStyle: 'infinite-scroll',
            rowDensity: 'condensed',
            columnVisibility: {
                date: true, description: true, amount: true, category: true,
                merchant: true, // Additional columns for analysis
                tags: true,
            },
        },
        aiInsightsPanel: {
            ...DEFAULT_DESKTOP_LAYOUT.components.aiInsightsPanel,
            isVisible: true,
            density: 'standard',
            insightCategoryFilter: ['performance', 'trends', 'anomalies', 'predictive'],
            refreshFrequencySeconds: 30,
            feedbackMechanism: 'detailed-form',
            explanationVisibility: 'always',
        },
        // Show specific analytics views, hide others
        dataCatalogExplorer: { ...DEFAULT_DESKTOP_LAYOUT.components.dataCatalogExplorer, isVisible: true, isEnabled: true },
        predictiveModelsDashboard: { ...DEFAULT_DESKTOP_LAYOUT.components.predictiveModelsDashboard, isVisible: true, isEnabled: true },
        riskAssessmentDashboard: { ...DEFAULT_DESKTOP_LAYOUT.components.riskAssessmentDashboard, isVisible: true, isEnabled: true },
        // Hide other components not relevant to deep analytics
        balanceSummaryCard: { ...DEFAULT_DESKTOP_LAYOUT.components.balanceSummaryCard, isVisible: false, isEnabled: false },
        budgetsOverview: { ...DEFAULT_DESKTOP_LAYOUT.components.budgetsOverview, isVisible: false, isEnabled: false },
        investmentPortfolioSnapshot: { ...DEFAULT_DESKTOP_LAYOUT.components.investmentPortfolioSnapshot, isVisible: false, isEnabled: false },
        financialGoalsTracker: { ...DEFAULT_DESKTOP_LAYOUT.components.financialGoalsTracker, isVisible: false, isEnabled: false },
        recentTransactionsFeed: { ...DEFAULT_DESKTOP_LAYOUT.components.recentTransactionsFeed, isVisible: false, isEnabled: false },
        aiAssistantChat: { ...DEFAULT_DESKTOP_LAYOUT.components.aiAssistantChat, isVisible: false, isEnabled: false },
        footer: { ...DEFAULT_DESKTOP_LAYOUT.components.footer, statusIndicators: ['Data Source Health', 'Query Performance'] },
    },
    aiInteractions: {
        ...DEFAULT_DESKTOP_LAYOUT.aiInteractions,
        aiAssistanceLevel: 'proactive',
        proactiveSuggestionFrequency: 'high',
        explanationVerbosity: 'detailed',
    },
    performanceOptimization: {
        ...DEFAULT_DESKTOP_LAYOUT.performanceOptimization,
        dataPrefetching: true,
        resourcePrioritization: 'critical-first',
        clientSideCachingStrategy: 'aggressive',
    },
};

/**
 * Provides thresholds for interpreting cognitive load scores.
 */
const COGNITIVE_LOAD_THRESHOLDS = {
    LOW: 0.25, // Score below this indicates low load (may need more engagement)
    NORMAL_MIN: 0.25,
    NORMAL_MAX: 0.70,
    HIGH: 0.70, // Score above this indicates high load (UI simplification needed)
    CRITICAL: 0.90, // Score above this indicates critical overload (drastic UI measures)
};

/**
 * Delays for debouncing layout updates to prevent flickering and excessive AI calls.
 */
const LAYOUT_UPDATE_DEBOUNCE_MS = 1000; // Minimum 1 second between layout updates
const CRITICAL_LAYOUT_UPDATE_DEBOUNCE_MS = 200; // Faster update for critical situations

/**
 * Maximum number of recently visited views to track.
 */
const MAX_RECENT_VIEWS_HISTORY = 5;

/**
 * Service to manage and fetch user profile and preferences from a backend or local store.
 */
class UserProfileService {
    /**
     * Retrieves the user's profile information.
     * @param userId The ID of the user.
     * @returns A promise resolving to the UserProfile.
     */
    async getUserProfile(userId: string): Promise<UserProfile> {
        logger.debug(`Fetching user profile for ${userId}`);
        // In a real application, this would be an API call to a backend service.
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate API delay
        return {
            id: userId,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            organization: 'Global FinCorp',
            role: 'Senior Financial Analyst',
            onboardingStatus: 'completed',
            isPremiumUser: true,
            lastLogin: new Date(),
            preferredCurrency: 'USD',
            department: 'Corporate Finance',
            securityLevel: 'Confidential',
        };
    }

    /**
     * Retrieves the user's explicit preferences.
     * @param userId The ID of the user.
     * @returns A promise resolving to the UserPreferences.
     */
    async getUserPreferences(userId: string): Promise<UserPreferences> {
        logger.debug(`Fetching user preferences for ${userId}`);
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate API delay
        // This data would typically be loaded from a user settings store.
        return {
            userId: userId,
            themePreference: 'system', // Can be 'light', 'dark', 'system'
            language: 'en-US',
            timezone: 'America/New_York',
            notificationSettings: {
                financialAlerts: true,
                aiSuggestions: true,
                marketing: false,
                systemUpdates: true,
                securityAlerts: true,
            },
            privacySettings: {
                dataSharingEnabled: true,
                biometricAuthEnabled: true,
                aiPersonalizationEnabled: true,
                telemetryEnabled: true,
            },
            layoutPreference: 'adaptive', // Can be 'adaptive', 'fixed', or a saved custom layout ID
            accessibility: {
                fontSize: 1.0,
                highContrast: false,
                reducedMotion: false,
                screenReaderSupport: true,
                keyboardNavigation: true,
            },
            dashboardWidgets: ['balance', 'investments', 'budgets', 'recent-transactions'],
            quickAccessItems: ['send-money', 'insights', 'reports'],
            developerMode: false,
            voiceControlEnabled: true,
        };
    }

    /**
     * Saves updated user preferences to the backend.
     * @param userId The ID of the user.
     * @param preferences The preferences object to save.
     * @returns A promise that resolves when save is complete.
     */
    async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
        logger.info(`Saving preferences for ${userId}:`, preferences);
        // In a real app, this would be an API call to update user settings.
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
        // A success or failure message might be returned.
    }
}

/**
 * Utility for detecting and providing the current device's characteristics.
 * Leverages browser APIs to gather device-specific information.
 */
class DeviceDetector {
    /**
     * Gathers and returns a comprehensive profile of the current device.
     * @returns The current DeviceProfile.
     */
    getDeviceProfile(): DeviceProfile {
        const userAgent = navigator.userAgent;
        let type: DeviceProfile['type'] = 'desktop';

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|mm|us)|ai(ko|ob)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r|s)|az(er|me|ve)|boie|bada|carv|cdm|clde|cell|chtm|cino|ipaq|koio|psp0|qwap|sacu|samu|sams|samm|sand|scom|se(wt|oo)|si(em|sm)|soso|sp(sm|mi|th)|tsm|indo|teli|timd|tocc|trav|upg1|utst|v400|v750|veri|vi(rg|te)|vk(45|52|53|5c)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c( )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte /i.test(userAgent.substring(0, 4))) {
            type = 'mobile';
        } else if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent)) {
            type = 'tablet';
        } else if (/smart-display|hub|echo show|google home/i.test(userAgent)) {
            type = 'smart-display';
        }

        const screen = window.screen;
        const inputMethod: DeviceProfile['inputMethod'] = (navigator.maxTouchPoints > 0) || ('ontouchstart' in window) ? 'touch' : 'mouse-keyboard';
        if (navigator.maxTouchPoints > 0 && /(stylus|pen)/i.test(userAgent)) inputMethod === 'stylus'; // More specific
        if (inputMethod === 'touch' && !/(mobile|tablet)/i.test(userAgent)) inputMethod = 'mixed'; // E.g., desktop with touch screen

        const battery = (navigator as any).getBattery ? (navigator as any).getBattery() : null; // Battery API is experimental

        return {
            type,
            screenResolution: { width: screen.width, height: screen.height },
            viewportSize: { width: window.innerWidth, height: window.innerHeight },
            pixelDensity: window.devicePixelRatio,
            hasTouchScreen: inputMethod === 'touch' || inputMethod === 'mixed' || inputMethod === 'stylus',
            inputMethod,
            os: navigator.platform,
            browser: navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)?.[1] || navigator.userAgent,
            networkStatus: navigator.onLine ? 'online' : 'offline', // Simplified, could use Network Information API
            batteryLevel: battery ? battery.level : 1, // Assume full if no API or error
            isCharging: battery ? battery.charging : true, // Assume charging if no API or error
            hasHardwareKeyboard: !/(mobile|tablet)/i.test(userAgent) || /mac|win|linux/i.test(navigator.platform), // Heuristic
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'no-preference'),
        };
    }
}

/**
 * Utility for detecting and providing the current environmental context.
 * Gathers information like time of day, day of week, and attempts to infer ambient light.
 */
class EnvironmentDetector {
    /**
     * Gathers and returns the current environmental context.
     * @returns The current EnvironmentContext.
     */
    getEnvironmentContext(): EnvironmentContext {
        const date = new Date();
        const hour = date.getHours();
        const day = date.getDay(); // 0-6, Sunday is 0

        let timeOfDay: EnvironmentContext['timeOfDay'];
        if (hour >= 4 && hour < 7) timeOfDay = 'dawn';
        else if (hour >= 7 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 14) timeOfDay = 'noon';
        else if (hour >= 14 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
        else if (hour >= 21 && hour < 24) timeOfDay = 'night';
        else timeOfDay = 'late-night'; // 0-3 AM

        const dayOfWeek = (day === 0 || day === 6) ? 'weekend' : 'weekday';

        // Placeholder for ambient light level. Requires dedicated sensors or OS integration for accuracy.
        // Could be inferred from timeOfDay, device theme, or user preferences.
        const ambientLightLevel: EnvironmentContext['ambientLightLevel'] = (timeOfDay === 'night' || timeOfDay === 'late-night') ? 'dim' : 'normal';

        // Placeholder for quiet hours (requires OS integration or user setting in app)
        const isQuietHoursActive = false; // For now, assume not active

        return {
            timeOfDay,
            dayOfWeek,
            ambientLightLevel,
            isQuietHoursActive,
            localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            // currentWeatherCondition: 'sunny', // Placeholder, would require API integration
        };
    }
}

/**
 * Service to track detailed user activity within the application.
 * Captures interaction patterns to infer engagement and potential cognitive load.
 */
class UserActivityTracker {
    private lastActivityTimestamp: number = Date.now();
    private idleTimer: NodeJS.Timeout | null = null;
    private readonly IDLE_THRESHOLD_SECONDS = 300; // 5 minutes of inactivity

    private typingEventTimestamps: number[] = []; // Timestamps of keypresses
    private mouseMovementDistances: number[] = []; // Aggregated mouse movement over short periods
    private clickEventTimestamps: number[] = []; // Timestamps of clicks
    private scrollEventDistances: number[] = []; // Aggregated scroll distance over short periods
    private errorEventTimestamps: number[] = []; // Timestamps of user-facing errors

    private _activeViewId: string = 'unknown';
    private _openModalCount: number = 0;
    private _searchQueryActive: boolean = false;
    private _recentlyVisitedViews: string[] = [];
    private _readNotificationCount: number = 0;
    private _dismissedNotificationCount: number = 0;

    private currentMetrics: UserActivityContext = {
        isActive: true,
        idleDurationSeconds: 0,
        typingActivityScore: 0,
        mouseActivityScore: 0,
        touchActivityScore: 0,
        scrollActivityScore: 0,
        recentErrorCount: 0,
        isMultitasking: false,
        activeApplicationContext: 'unknown',
        currentInputMode: 'mouse-keyboard',
        recentlyVisitedViews: [],
        readNotificationCount: 0,
        dismissedNotificationCount: 0,
    };

    private inputModeHistory: ('keyboard' | 'mouse' | 'touch' | 'voice')[] = [];

    constructor() {
        this.resetIdleTimer();
        document.addEventListener('mousemove', this.handleActivity, { passive: true });
        document.addEventListener('keypress', this.handleTypingActivity, { passive: true });
        document.addEventListener('click', this.handleClickActivity, { passive: true });
        document.addEventListener('scroll', this.handleScrollActivity, { passive: true });
        window.addEventListener('blur', this.handleWindowBlur);
        window.addEventListener('focus', this.handleWindowFocus);
        document.addEventListener('touchstart', () => this.recordInputMode('touch'), { passive: true });
        document.addEventListener('keypress', () => this.recordInputMode('keyboard'), { passive: true });
        document.addEventListener('mousemove', () => this.recordInputMode('mouse'), { passive: true }); // Need a better heuristic for mouse activity

        setInterval(() => this.calculateAndPublishMetrics(), 2000); // Calculate metrics every 2 seconds
    }

    private handleActivity = () => {
        this.lastActivityTimestamp = Date.now();
        this.resetIdleTimer();
    };

    private handleTypingActivity = (event: KeyboardEvent) => {
        this.typingEventTimestamps.push(Date.now());
        this.handleActivity();
    };

    private handleClickActivity = () => {
        this.clickEventTimestamps.push(Date.now());
        this.handleActivity();
    };

    private handleScrollActivity = (event: Event) => {
        // Approximate scroll distance (could be more accurate by tracking element scroll positions)
        const target = event.target as HTMLElement;
        const scrollDelta = Math.abs(target.scrollTop - (this.lastScrollPosition.get(target) || target.scrollTop));
        this.scrollEventDistances.push(scrollDelta);
        this.lastScrollPosition.set(target, target.scrollTop);
        this.handleActivity();
    };
    private lastScrollPosition = new Map<HTMLElement, number>();

    private handleWindowBlur = () => {
        // User left the application window
        this.currentMetrics.isActive = false;
        logger.debug('Window blurred: User is likely inactive.');
    }

    private handleWindowFocus = () => {
        // User returned to the application window
        this.currentMetrics.isActive = true;
        this.lastActivityTimestamp = Date.now(); // Reset activity
        this.resetIdleTimer();
        logger.debug('Window focused: User is active.');
    }

    private resetIdleTimer = () => {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }
        this.idleTimer = setTimeout(() => {
            this.currentMetrics.isActive = false;
            logger.debug(`User has been idle for ${this.IDLE_THRESHOLD_SECONDS} seconds.`);
        }, this.IDLE_THRESHOLD_SECONDS * 1000);
    };

    /** Records mouse movement distance. To be called by global mousemove listener. */
    recordMouseMovement(distance: number) {
        this.mouseMovementDistances.push(distance);
        this.handleActivity();
    }

    /** Records a user-facing error. */
    recordError() {
        this.errorEventTimestamps.push(Date.now());
        this.handleActivity();
    }

    /** Sets the currently active view ID. */
    setActiveView(viewId: string) {
        if (this._activeViewId !== viewId) {
            this._activeViewId = viewId;
            // Update recently visited views, keeping it unique and limited
            this._recentlyVisitedViews = [viewId, ...this._recentlyVisitedViews.filter(v => v !== viewId)].slice(0, MAX_RECENT_VIEWS_HISTORY);
        }
        this.handleActivity();
    }

    /** Sets the count of open modals. */
    setOpenModalCount(count: number) {
        this._openModalCount = count;
        this.handleActivity();
    }

    /** Sets whether a search query is currently active. */
    setSearchQueryActive(isActive: boolean) {
        this._searchQueryActive = isActive;
        this.handleActivity();
    }

    /** Records that a notification was read. */
    recordNotificationRead() {
        this._readNotificationCount++;
    }

    /** Records that a notification was dismissed. */
    recordNotificationDismissed() {
        this._dismissedNotificationCount++;
    }

    /** Records the primary input mode detected. */
    recordInputMode(mode: 'keyboard' | 'mouse' | 'touch' | 'voice') {
        this.inputModeHistory.push(mode);
        // Keep a short history, e.g., last 5 entries
        if (this.inputModeHistory.length > 5) {
            this.inputModeHistory.shift();
        }
    }

    /**
     * Calculates and updates the current activity metrics based on recent events.
     * This method is called periodically by an internal interval.
     */
    private calculateAndPublishMetrics(): void {
        const now = Date.now();
        const lastInterval = now - 2000; // Last 2 seconds for scores
        const lastMinute = now - 60 * 1000; // Last minute for some aggregates

        // Filter events for the last minute and calculate scores
        const recentTypingEvents = this.typingEventTimestamps.filter(t => t > lastMinute);
        const typingSpeedWPM = recentTypingEvents.length * 6; // Simple heuristic: 1 keypress = 1 word / 10 characters, in 10 second window
        this.typingEventTimestamps = this.typingEventTimestamps.filter(t => t > lastMinute); // Clear old data

        const recentMouseMovements = this.mouseMovementDistances.filter(m => true); // In a real scenario, sum of distances for the interval
        const mouseMovementRatePxPerSec = recentMouseMovements.length > 0 ? recentMouseMovements.reduce((a, b) => a + b, 0) / 2 : 0;
        this.mouseMovementDistances = [];

        const recentClickEvents = this.clickEventTimestamps.filter(t => t > lastMinute);
        const clicksPerMinute = recentClickEvents.length;
        this.clickEventTimestamps = this.clickEventTimestamps.filter(t => t > lastMinute);

        const recentScrollDistances = this.scrollEventDistances.filter(s => true);
        const scrollRatePxPerSec = recentScrollDistances.length > 0 ? recentScrollDistances.reduce((a, b) => a + b, 0) / 2 : 0;
        this.scrollEventDistances = [];

        const recentErrors = this.errorEventTimestamps.filter(t => t > lastMinute);
        this.errorEventTimestamps = this.errorEventTimestamps.filter(t => t > lastMinute);

        // Infer predominant input mode
        const inputModeCounts = this.inputModeHistory.reduce((acc, mode) => {
            acc[mode] = (acc[mode] || 0) + 1;
            return acc;
        }, {} as Record<DeviceProfile['inputMethod'], number>);

        let currentInputMode: UserActivityContext['currentInputMode'] = 'mouse-keyboard';
        let maxCount = 0;
        for (const mode in inputModeCounts) {
            if (inputModeCounts[mode] > maxCount) {
                maxCount = inputModeCounts[mode];
                currentInputMode = mode as UserActivityContext['currentInputMode'];
            }
        }
        if (Object.keys(inputModeCounts).length > 1 && maxCount > 0) currentInputMode = 'mixed';
        if (Object.keys(inputModeCounts).length === 0) currentInputMode = 'mouse-keyboard'; // Default if no activity recorded yet

        this.currentMetrics = {
            isActive: (now - this.lastActivityTimestamp) < this.IDLE_THRESHOLD_SECONDS * 1000,
            idleDurationSeconds: Math.floor((now - this.lastActivityTimestamp) / 1000),
            typingActivityScore: typingSpeedWPM,
            mouseActivityScore: mouseMovementRatePxPerSec,
            touchActivityScore: 0, // Requires specific touch event handling beyond basic activity
            scrollActivityScore: scrollRatePxPerSec,
            recentErrorCount: recentErrors.length,
            isMultitasking: this._openModalCount > 1 || this._searchQueryActive || (this._recentlyVisitedViews.length > 1 && (now - this.lastActivityTimestamp) < 30000), // Simple heuristic
            activeApplicationContext: this._activeViewId,
            currentInputMode: currentInputMode,
            recentlyVisitedViews: this._recentlyVisitedViews,
            readNotificationCount: this._readNotificationCount,
            dismissedNotificationCount: this._dismissedNotificationCount,
        };

        // logger.debug('User Activity Metrics:', this.currentMetrics);
    }

    /**
     * Retrieves the current user activity context.
     * @returns The latest UserActivityContext.
     */
    getUserActivityContext(): UserActivityContext {
        return this.currentMetrics;
    }
}

/**
 * Placeholder for `promptLibrary` if it's not yet fully fleshed out in `../ai/promptLibrary.ts`.
 * This provides a default implementation for generating AI prompts for layout configuration.
 */
interface PromptLibrary {
    generateAdaptiveLayoutPrompt(context: FullUserContext, currentLayout: UILayoutConfig): string;
    // Add other prompt generation methods here as the project grows
}

// Mock implementation of promptLibrary if the actual file isn't rich enough yet.
// In `ai/promptLibrary.ts` this would be the actual content.
export const mockPromptLibrary: PromptLibrary = {
    /**
     * Generates a detailed prompt for an AI model to recommend an optimal UI layout.
     * The prompt includes all relevant user, device, environment, app, and cognitive load contexts.
     * It instructs the AI to return a JSON object conforming to the UILayoutConfig interface.
     * @param context The full user context for the AI to consider.
     * @param currentLayout The current layout, provided as a reference for incremental changes.
     * @returns A string prompt for the AI model.
     */
    generateAdaptiveLayoutPrompt: (context: FullUserContext, currentLayout: UILayoutConfig): string => {
        // Construct the prompt by serializing the context and current layout.
        // It's critical to ensure the JSON is valid and fits within token limits.
        // We'll focus on key areas for brevity in the prompt, but the actual context object is much larger.

        const simplifiedContext = {
            userId: context.userId,
            profile: {
                role: context.profile.role,
                isPremiumUser: context.profile.isPremiumUser,
                securityLevel: context.profile.securityLevel,
                department: context.profile.department,
            },
            preferences: {
                themePreference: context.preferences.themePreference,
                layoutPreference: context.preferences.layoutPreference,
                accessibility: context.preferences.accessibility,
                notificationSettings: context.preferences.notificationSettings,
                aiPersonalizationEnabled: context.preferences.privacySettings.aiPersonalizationEnabled,
                developerMode: context.preferences.developerMode,
            },
            device: {
                type: context.device.type,
                screenResolution: context.device.screenResolution,
                viewportSize: context.device.viewportSize,
                pixelDensity: context.device.pixelDensity,
                inputMethod: context.device.inputMethod,
                os: context.device.os,
                prefersReducedMotion: context.device.prefersReducedMotion,
                prefersColorScheme: context.device.prefersColorScheme,
                batteryLevel: context.device.batteryLevel,
                isCharging: context.device.isCharging,
            },
            environment: {
                timeOfDay: context.environment.timeOfDay,
                dayOfWeek: context.environment.dayOfWeek,
                ambientLightLevel: context.environment.ambientLightLevel,
                isQuietHoursActive: context.environment.isQuietHoursActive,
                localTimezone: context.environment.localTimezone,
                currentWeatherCondition: context.environment.currentWeatherCondition,
            },
            activity: {
                isActive: context.activity.isActive,
                idleDurationSeconds: context.activity.idleDurationSeconds,
                typingActivityScore: context.activity.typingActivityScore,
                mouseActivityScore: context.activity.mouseActivityScore,
                recentErrorCount: context.activity.recentErrorCount,
                isMultitasking: context.activity.isMultitasking,
                activeApplicationContext: context.activity.activeApplicationContext,
                currentInputMode: context.activity.currentInputMode,
                recentlyVisitedViews: context.activity.recentlyVisitedViews,
                unreadNotifications: context.appState.activeNotifications.filter(n => !n.isRead).length,
                pendingActionCount: context.appState.pendingActionCount,
            },
            appState: {
                activeViewId: context.appState.activeViewId,
                openModalCount: context.appState.openModalCount,
                sidebarPrimaryVisible: context.appState.sidebarPrimaryVisible,
                sidebarSecondaryVisible: context.appState.sidebarSecondaryVisible,
                backgroundTaskCount: context.appState.backgroundTaskCount,
                searchQueryActive: context.appState.searchQueryActive,
                activeFeature: context.appState.activeFeature,
                activeModule: context.appState.activeModule,
                isTourActive: context.appState.isTourActive,
            },
            cognitiveLoad: context.cognitiveLoad,
            externalIntegrations: {
                microsoftGraph: {
                    inMeeting: context.externalIntegrations.microsoftGraph?.presence === 'InAMeeting',
                    upcomingMeetingsCount: context.externalIntegrations.microsoftGraph?.upcomingMeetings.length || 0,
                    unreadTeamsChats: context.externalIntegrations.microsoftGraph?.teamsActivity.unreadChatsCount || 0,
                    unreadTeamsMentions: context.externalIntegrations.microsoftGraph?.teamsActivity.unreadMentionsCount || 0,
                },
                googleWorkspace: {
                    upcomingCalendarEventsCount: context.externalIntegrations.googleWorkspace?.calendarEvents.length || 0,
                    unreadGmailCount: context.externalIntegrations.googleWorkspace?.gmailUnreadCount || 0,
                    activeGoogleTasksCount: context.externalIntegrations.googleWorkspace?.googleTasks.filter(t => t.status === 'needsAction').length || 0,
                },
                salesforceCRM: {
                    highPriorityTasksCount: context.externalIntegrations.salesforceCRM?.activeTasks.filter(t => t.priority === 'High' || t.priority === 'Critical').length || 0,
                    openOpportunitiesCount: context.externalIntegrations.salesforceCRM?.openOpportunities.length || 0,
                    activeCasesCount: context.externalIntegrations.salesforceCRM?.activeCases.length || 0,
                },
                plaidFinancialData: {
                    criticalFinancialAlerts: context.appState.activeNotifications.filter(n => n.type === 'financial' && n.priority === 'critical').length > 0,
                    overspentBudgets: context.externalIntegrations.plaidFinancialData?.financialGoalsProgress.filter(g => g.category === 'savings' && g.currentAmount < g.targetAmount).length || 0, // Simplified overspent logic
                    imminentFinancialGoals: context.externalIntegrations.plaidFinancialData?.financialGoalsProgress.filter(g => g.targetDate && (new Date(g.targetDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000)).length || 0, // Goals due in 30 days
                },
            },
            strategicGoalFocus: context.strategicGoalFocus,
            userSentiment: context.userSentiment,
        };

        const currentLayoutCompact = {
            layoutStrategy: currentLayout.layoutStrategy,
            globalTheme: { mode: currentLayout.globalTheme.mode, fontSizeBase: currentLayout.globalTheme.fontSizeBase, animationSpeed: currentLayout.globalTheme.animationSpeed },
            pageLayout: { gridTemplateAreas: currentLayout.pageLayout.gridTemplateAreas, gridTemplateColumns: currentLayout.pageLayout.gridTemplateColumns },
            components: {
                sidebarPrimary: { isVisible: currentLayout.components.sidebarPrimary.isVisible, size: currentLayout.components.sidebarPrimary.size, density: currentLayout.components.sidebarPrimary.density },
                sidebarSecondary: { isVisible: currentLayout.components.sidebarSecondary.isVisible, size: currentLayout.components.sidebarSecondary.size, density: currentLayout.components.sidebarSecondary.density },
                header: { logoVisibility: currentLayout.components.header.logoVisibility, searchBarLocation: currentLayout.components.header.searchBarLocation, quickAccessButtons: currentLayout.components.header.quickAccessButtons },
                mainContentArea: { cardLayout: currentLayout.components.mainContentArea.cardLayout, cardDensity: currentLayout.components.mainContentArea.cardDensity, maxCardsPerRow: currentLayout.components.mainContentArea.maxCardsPerRow },
                notificationsPanel: { priorityFilter: currentLayout.components.notificationsPanel.priorityFilter, positioningStrategy: currentLayout.components.notificationsPanel.positioningStrategy },
                aiAssistantChat: { isVisible: currentLayout.components.aiAssistantChat.isVisible, responseDetailLevel: currentLayout.components.aiAssistantChat.responseDetailLevel, proactiveSuggestions: currentLayout.components.aiAssistantChat.proactiveSuggestions },
                featureDock: { isVisible: currentLayout.components.featureDock.isVisible, alignment: currentLayout.components.featureDock.alignment },
                // Only include key visibility/state for primary components, not every single property
                balanceSummaryCard: { isVisible: currentLayout.components.balanceSummaryCard.isVisible },
                budgetsOverview: { isVisible: currentLayout.components.budgetsOverview.isVisible },
                investmentPortfolioSnapshot: { isVisible: currentLayout.components.investmentPortfolioSnapshot.isVisible },
                financialGoalsTracker: { isVisible: currentLayout.components.financialGoalsTracker.isVisible },
                recentTransactionsFeed: { isVisible: currentLayout.components.recentTransactionsFeed.isVisible },
                aiInsightsPanel: { isVisible: currentLayout.components.aiInsightsPanel.isVisible },
                riskAssessmentDashboard: { isVisible: currentLayout.components.riskAssessmentDashboard.isVisible },
                fraudDetectionAlerts: { isVisible: currentLayout.components.fraudDetectionAlerts.isVisible },
                corporateAccountSummary: { isVisible: currentLayout.components.corporateAccountSummary.isVisible },
            },
            accessibilitySettings: { fontSizeMultiplier: currentLayout.accessibilitySettings.fontSizeMultiplier, highContrastMode: currentLayout.accessibilitySettings.highContrastMode, reducedMotion: currentLayout.accessibilitySettings.reducedMotion },
            aiInteractions: { aiAssistanceLevel: currentLayout.aiInteractions.aiAssistanceLevel, proactiveSuggestionFrequency: currentLayout.aiInteractions.proactiveSuggestionFrequency, explanationVerbosity: currentLayout.aiInteractions.explanationVerbosity },
        };


        return `As an expert UI/UX AI, your task is to dynamically recompose the user interface layout in real-time.
        Analyze the provided user context, application state, and cognitive load to recommend an optimal UI configuration.
        The goal is to enhance user productivity, minimize cognitive burden, and provide a seamless, personalized experience.
        Consider all aspects of UI, from global theme and page structure to individual component visibility, size, and interaction.

        Crucially, if the user's cognitive load is 'high' or 'critical', prioritize simplicity, minimalism, and focus on critical tasks,
        reducing distractions and complex information displays. If load is 'low', consider introducing more data, exploration tools,
        or proactive suggestions.

        Provide the output as a JSON object strictly conforming to the 'UILayoutConfig' TypeScript interface.
        Include a concise 'explanation' field (max 150 characters) detailing the rationale for the recommended layout.
        Do not include any conversational text, markdown formatting (like ```json), or explanations outside of the JSON object itself.

        Current User Context (important factors):
        ${JSON.stringify(simplifiedContext, null, 2)}

        Current Layout (reference for incremental adjustments):
        ${JSON.stringify(currentLayoutCompact, null, 2)}

        Guidance:
        - If 'device.type' is 'mobile' or 'tablet', generally use 'DEFAULT_MOBILE_LAYOUT' as a baseline and adapt.
        - If 'device.type' is 'desktop', generally use 'DEFAULT_DESKTOP_LAYOUT' as a baseline and adapt.
        - If 'cognitiveLoad.level' is 'high' or 'critical', consider activating 'CRISIS_MODE_LAYOUT' principles:
            - Hide non-essential sidebars and panels.
            - Reduce card density.
            - Prioritize critical notifications.
            - Make AI Assistant more proactive and concise.
            - Simplify navigation.
            - Adjust theme to high-contrast/dark.
            - Reduce animations.
        - If 'appState.activeViewId' indicates an analytics view (e.g., 'PredictiveModelsView', 'DataCatalogView') and cognitive load is 'normal' or 'low', consider 'ANALYTICS_FOCUS_LAYOUT' principles:
            - Maximize main content area for charts/tables.
            - Dedicate a sidebar for filters/parameters.
            - Increase data density and refresh rates for visualizations.
            - Ensure AI insights related to data analysis are prominent.
        - Respect 'preferences.accessibility' settings (fontSizeMultiplier, highContrastMode, reducedMotion).
        - If 'activity.isActive' is false and 'activity.idleDurationSeconds' is high, suggest reducing distractions on re-engagement.
        - If 'externalIntegrations.microsoftGraph.inMeeting' is true, mute notifications and simplify layout.
        - If 'externalIntegrations.salesforceCRM.highPriorityTasksCount' > 0 and relevant tasks are active, highlight CRM components.
        - If 'appState.isTourActive', simplify layout to highlight tutorial steps and related components.

        Output the complete UILayoutConfig JSON object here:`;
    }
};

// Replace promptLibrary with mockPromptLibrary if the actual file does not exist or is empty
// This ensures that the engine can run even if ai/promptLibrary.ts is not fully developed yet.
const effectivePromptLibrary: PromptLibrary = promptLibrary || mockPromptLibrary;

/**
 * Service for general system performance monitoring (mocked).
 * In a real application, this would gather actual CPU, memory, and network usage.
 */
class SystemPerformanceMonitor {
    private cpuUsage: number = 0.1; // Baseline
    private memoryUsageGB: number = 0.5; // Baseline
    private networkLatencyMs: number = 50; // Baseline
    private diskIOPS: number = 100; // Baseline

    constructor() {
        setInterval(() => this.simulatePerformance(), 1000); // Simulate changes every second
    }

    private simulatePerformance(): void {
        const activity = getAdaptiveLayoutEngineInstance().activityTracker.getUserActivityContext();

        // Simulate CPU/Memory based on activity
        this.cpuUsage = 0.1 + (activity.typingActivityScore > 0 ? 0.05 : 0) + (activity.mouseActivityScore > 100 ? 0.05 : 0) + (activity.isMultitasking ? 0.1 : 0);
        this.memoryUsageGB = 0.5 + (activity.recentlyVisitedViews.length * 0.1) + (activity.openModalCount * 0.05);

        // Add some random noise
        this.cpuUsage = Math.max(0.05, Math.min(0.95, this.cpuUsage + (Math.random() - 0.5) * 0.02));
        this.memoryUsageGB = Math.max(0.2, Math.min(4, this.memoryUsageGB + (Math.random() - 0.5) * 0.1));
        this.networkLatencyMs = Math.max(20, Math.min(200, this.networkLatencyMs + (Math.random() - 0.5) * 5));
        this.diskIOPS = Math.max(50, Math.min(500, this.diskIOPS + (Math.random() - 0.5) * 20));
    }

    getSystemPerformanceMetrics(): { cpuUsage: number; memoryUsageGB: number; networkLatencyMs: number; diskIOPS: number; } {
        return {
            cpuUsage: this.cpuUsage,
            memoryUsageGB: this.memoryUsageGB,
            networkLatencyMs: this.networkLatencyMs,
            diskIOPS: this.diskIOPS,
        };
    }
}

/**
 * Central service for dynamic UI layout adaptation based on cognitive load and comprehensive user context.
 * This engine orchestrates data collection from various sources, calls AI for layout recommendations,
 * and applies those recommendations to the UI through a publish-subscribe mechanism.
 */
export class AdaptiveLayoutEngine {
    private geminiService: GeminiService;
    private cognitiveLoadPredictor: CognitiveLoadPredictor;
    private cognitiveLoadBalancer: CognitiveLoadBalancerService; // Used for system-level adjustments, not direct UI
    private userProfileService: UserProfileService;
    private deviceDetector: DeviceDetector;
    private environmentDetector: EnvironmentDetector;
    public activityTracker: UserActivityTracker; // Public for external components to record activity
    private telemetryService: TelemetryService;
    private featureFlagManager: FeatureFlagManager;
    private systemPerformanceMonitor: SystemPerformanceMonitor;

    private currentLayout: UILayoutConfig;
    private layoutSubscribers: Array<(layout: UILayoutConfig) => void> = [];
    private currentUserContext: FullUserContext | null = null;
    private lastLayoutDecisionContext: FullUserContext | null = null; // Snapshot of context when last layout decision was made
    private lastLayoutUpdateTimestamp: number = 0;
    private layoutUpdateTimeout: NodeJS.Timeout | null = null;

    // Mock external Fortune 500 services
    private msGraphService: MicrosoftGraphService = this.createMockMicrosoftGraphService();
    private googleWorkspaceService: GoogleWorkspaceService = this.createMockGoogleWorkspaceService();
    private salesforceCRMCustomService: SalesforceCRMCustomService = this.createMockSalesforceCRMCustomService();
    private plaidFinancialService: PlaidFinancialService = this.createMockPlaidFinancialService();

    /**
     * Constructs the AdaptiveLayoutEngine.
     * @param geminiService The AI service for layout recommendations.
     * @param cognitiveLoadPredictor Predicts user's cognitive load.
     * @param cognitiveLoadBalancer Balances system resources based on load.
     * @param userProfileService Fetches user profiles and preferences.
     * @param deviceDetector Detects device characteristics.
     * @param environmentDetector Detects environmental factors.
     * @param activityTracker Tracks user activity within the app.
     * @param telemetryService Records usage and performance data.
     * @param featureFlagManager Manages feature flags.
     * @param systemPerformanceMonitor Monitors system resource usage.
     */
    constructor(
        geminiService: GeminiService,
        cognitiveLoadPredictor: CognitiveLoadPredictor,
        cognitiveLoadBalancer: CognitiveLoadBalancerService,
        userProfileService: UserProfileService,
        deviceDetector: DeviceDetector,
        environmentDetector: EnvironmentDetector,
        activityTracker: UserActivityTracker,
        telemetryService: TelemetryService,
        featureFlagManager: FeatureFlagManager,
        systemPerformanceMonitor: SystemPerformanceMonitor
    ) {
        this.geminiService = geminiService;
        this.cognitiveLoadPredictor = cognitiveLoadPredictor;
        this.cognitiveLoadBalancer = cognitiveLoadBalancer;
        this.userProfileService = userProfileService;
        this.deviceDetector = deviceDetector;
        this.environmentDetector = environmentDetector;
        this.activityTracker = activityTracker;
        this.telemetryService = telemetryService;
        this.featureFlagManager = featureFlagManager;
        this.systemPerformanceMonitor = systemPerformanceMonitor;

        // Initialize with a default layout based on current device type
        const device = this.deviceDetector.getDeviceProfile();
        this.currentLayout = device.type === 'mobile' || device.type === 'tablet' ? DEFAULT_MOBILE_LAYOUT : DEFAULT_DESKTOP_LAYOUT;

        logger.info('AdaptiveLayoutEngine initialized with default device layout.');
    }

    /**
     * Creates a mock Microsoft Graph Service for demonstration purposes.
     * Provides simulated data for calendar, presence, and documents.
     */
    private createMockMicrosoftGraphService(): MicrosoftGraphService {
        return {
            getUpcomingMeetings: async (userId: string) => {
                logger.debug(`Mock MS Graph: Fetching upcoming meetings for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 50));
                return [
                    {
                        id: 'm1', subject: 'Q3 Financial Review',
                        start: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
                        end: new Date(Date.now() + 2 * 60 * 60 * 1000), isOnlineMeeting: true,
                        location: 'Teams Meeting', organizer: { emailAddress: 'ceo@acmecorp.com', name: 'CEO' },
                        attendees: [{ emailAddress: 'jane.doe@example.com', name: 'Jane Doe', type: 'Required' }],
                        responseStatus: 'Accepted', importance: 'High',
                    },
                    {
                        id: 'm2', subject: 'Project Alpha Sync',
                        start: new Date(Date.now() + 3 * 60 * 60 * 1000),
                        end: new Date(Date.now() + 3.5 * 60 * 60 * 1000), isOnlineMeeting: false,
                        location: 'Conference Room 3', organizer: { emailAddress: 'pm@acmecorp.com', name: 'Project Manager' },
                        attendees: [{ emailAddress: 'jane.doe@example.com', name: 'Jane Doe', type: 'Required' }],
                        responseStatus: 'TentativelyAccepted', importance: 'Normal',
                    }
                ];
            },
            getUserPresence: async (userId: string) => {
                logger.debug(`Mock MS Graph: Fetching user presence for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 30));
                const meetings = await this.msGraphService.getUpcomingMeetings(userId);
                const now = Date.now();
                const isInMeeting = meetings.some(m => now >= m.start.getTime() && now < m.end.getTime());
                return isInMeeting ? 'InAMeeting' : 'Available';
            },
            getRecentDocuments: async (userId: string) => {
                logger.debug(`Mock MS Graph: Fetching recent documents for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 70));
                return [
                    { id: 'doc1', name: 'AnnualReport_2023.xlsx', lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), url: '#', application: 'Excel', sizeBytes: 5000000, sharingStatus: 'SharedInternally' },
                    { id: 'doc2', name: 'Strategy_Pitch.pptx', lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), url: '#', application: 'PowerPoint', sizeBytes: 12000000, sharingStatus: 'Private' },
                ];
            },
            getOutlookMailboxSettings: async (userId: string) => {
                logger.debug(`Mock MS Graph: Fetching mailbox settings for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 20));
                return {
                    automaticRepliesSetting: { status: 'Disabled' },
                    delegateMeetingMessageDeliveryOptions: 'SendToDelegatesAndMe',
                    timeZone: 'Eastern Standard Time',
                    language: { locale: 'en-US', displayName: 'English (United States)' },
                };
            },
            getTeamsActivity: async (userId: string) => {
                logger.debug(`Mock MS Graph: Fetching Teams activity for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 40));
                return {
                    unreadChatsCount: Math.floor(Math.random() * 5),
                    unreadMentionsCount: Math.random() > 0.7 ? 1 : 0,
                    activeCalls: [],
                    recentChannels: [{ id: 'general', displayName: 'General', unreadMessages: 0 }],
                };
            }
        };
    }

    /**
     * Creates a mock Google Workspace Service for demonstration purposes.
     * Provides simulated data for calendar, drive, Gmail, and tasks.
     */
    private createMockGoogleWorkspaceService(): GoogleWorkspaceService {
        return {
            getCalendarEvents: async (userId: string, timeMin: Date, timeMax: Date) => {
                logger.debug(`Mock Google Workspace: Fetching calendar events for ${userId} from ${timeMin.toISOString()} to ${timeMax.toISOString()}`);
                await new Promise(resolve => setTimeout(resolve, 60));
                return [
                    {
                        id: 'gcal1', summary: 'Team Standup',
                        start: { dateTime: new Date(Date.now() - 30 * 60 * 1000).toISOString() }, // Ongoing
                        end: { dateTime: new Date(Date.now() + 30 * 60 * 1000).toISOString() },
                        hangoutLink: 'https://meet.google.com/abc-defg-hij', status: 'confirmed',
                    },
                    {
                        id: 'gcal2', summary: 'Client Demo Prep',
                        start: { dateTime: new Date(Date.now() + 120 * 60 * 1000).toISOString() }, // In 2 hours
                        end: { dateTime: new Date(Date.now() + 150 * 60 * 1000).toISOString() },
                        location: 'Online', status: 'confirmed',
                    }
                ];
            },
            getDriveActivity: async (userId: string, maxResults: number) => {
                logger.debug(`Mock Google Workspace: Fetching Drive activity for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 80));
                return [
                    { id: 'gd1', title: 'Marketing Plan v2.0', lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), mimeType: 'application/vnd.google-apps.document', actor: { email: 'jane.doe@example.com', name: 'Jane Doe' }, action: 'edit' }
                ];
            },
            getGmailUnreadCount: async (userId: string) => {
                logger.debug(`Mock Google Workspace: Fetching Gmail unread count for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 25));
                return Math.floor(Math.random() * 10); // Simulate some unread emails
            },
            getGoogleTasks: async (userId: string) => {
                logger.debug(`Mock Google Workspace: Fetching Google Tasks for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 45));
                return [
                    { id: 'gt1', title: 'Review Q1 Budget Report', status: 'needsAction', due: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
                    { id: 'gt2', title: 'Schedule Team Offsite', status: 'needsAction', notes: 'Find dates in October' },
                    { id: 'gt3', title: 'Complete Expense Report', status: 'completed' },
                ];
            }
        };
    }

    /**
     * Creates a mock Salesforce CRM Service for demonstration purposes.
     * Provides simulated data for tasks, leads, opportunities, and cases.
     */
    private createMockSalesforceCRMCustomService(): SalesforceCRMCustomService {
        return {
            getActiveTasks: async (userId: string) => {
                logger.debug(`Mock Salesforce CRM: Fetching active tasks for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 75));
                return [
                    {
                        id: 'sf_task1', subject: 'Follow up with Client X', status: 'Open', priority: 'High',
                        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), relatedToId: 'Opportunity_123', relatedToType: 'Opportunity',
                        ownerId: userId, description: 'Discuss Q3 performance metrics and next steps.',
                    },
                    {
                        id: 'sf_task2', subject: 'Prepare Q4 sales forecast', status: 'In Progress', priority: 'Medium',
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), relatedToId: 'Forecast_Project', relatedToType: 'Other',
                        ownerId: userId,
                    },
                ];
            },
            getRecentLeads: async (userId: string, count: number) => {
                logger.debug(`Mock Salesforce CRM: Fetching recent leads for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 55));
                return [
                    { id: 'sf_lead1', name: 'New Prospect Inc.', status: 'New', company: 'New Prospect Inc.', email: 'contact@newprospect.com', lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), leadSource: 'Webinar' }
                ];
            },
            getOpportunityDetails: async (opportunityId: string) => {
                logger.debug(`Mock Salesforce CRM: Fetching opportunity details for ${opportunityId}`);
                await new Promise(resolve => setTimeout(resolve, 40));
                if (opportunityId === 'Opportunity_123') {
                    return {
                        id: 'Opportunity_123', name: 'Acme Corp Q3 Deal', stage: 'Qualification', amount: 150000,
                        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), accountId: 'Account_ABC', probability: 60,
                    };
                }
                return null;
            },
            getCaseDetails: async (caseId: string) => {
                logger.debug(`Mock Salesforce CRM: Fetching case details for ${caseId}`);
                await new Promise(resolve => setTimeout(resolve, 35));
                if (caseId === 'Case_456') {
                    return {
                        id: 'Case_456', subject: 'Billing Issue for Account XYZ', status: 'Working', priority: 'High',
                        description: 'Client reports incorrect charges for June 2024.', contactId: 'Contact_DEF', createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    };
                }
                return null;
            }
        };
    }

    /**
     * Creates a mock Plaid Financial Service for demonstration purposes.
     * Provides simulated financial data.
     */
    private createMockPlaidFinancialService(): PlaidFinancialService {
        return {
            getAccountsSummary: async (userId: string) => {
                logger.debug(`Mock Plaid: Fetching accounts summary for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 90));
                return [
                    {
                        id: 'acc1', name: 'Checking Account', type: 'depository', subtype: 'checking',
                        balance: { available: 5200.75, current: 5250.00, iso_currency_code: 'USD' },
                    },
                    {
                        id: 'acc2', name: 'Savings Account', type: 'depository', subtype: 'savings',
                        balance: { available: 25000.00, current: 25000.00, iso_currency_code: 'USD' },
                    },
                    {
                        id: 'acc3', name: 'Credit Card', type: 'credit', subtype: 'credit card',
                        balance: { available: 8000.00, current: 2000.00, iso_currency_code: 'USD' }, limit: 10000.00,
                    },
                ];
            },
            getRecentTransactions: async (userId: string, count: number) => {
                logger.debug(`Mock Plaid: Fetching recent transactions for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 110));
                return [
                    { id: 't1', account_id: 'acc1', amount: 45.50, iso_currency_code: 'USD', date: '2024-07-20', name: 'Starbucks', merchant_name: 'Starbucks', category: ['Food and Drink', 'Coffee Shops'], transaction_type: 'place', pending: false },
                    { id: 't2', account_id: 'acc1', amount: 120.00, iso_currency_code: 'USD', date: '2024-07-19', name: 'Electricity Bill', category: ['Utilities'], transaction_type: 'digital', pending: false },
                    { id: 't3', account_id: 'acc3', amount: 500.00, iso_currency_code: 'USD', date: '2024-07-18', name: 'Online Shopping', category: ['Shopping'], transaction_type: 'digital', pending: false },
                ];
            },
            getInvestmentHoldings: async (userId: string) => {
                logger.debug(`Mock Plaid: Fetching investment holdings for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 130));
                return [
                    { account_id: 'inv1', security_id: 'AAPL', cost_basis: 15000, quantity: 100, institution_price: 180, institution_value: 18000 },
                    { account_id: 'inv1', security_id: 'MSFT', cost_basis: 20000, quantity: 50, institution_price: 420, institution_value: 21000 },
                ];
            },
            getFinancialGoalsProgress: async (userId: string) => {
                logger.debug(`Mock Plaid: Fetching financial goals for ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                return [
                    { id: 'goal1', name: 'New Home Down Payment', targetAmount: 100000, currentAmount: 30000, targetDate: '2027-12-31', progressPercentage: 30, category: 'savings' },
                    { id: 'goal2', name: 'Retirement Savings', targetAmount: 1000000, currentAmount: 250000, progressPercentage: 25, category: 'investment' },
                ];
            },
        };
    }

    /**
     * Initializes the engine, fetching initial context, applying a default layout,
     * and setting up periodic context polling. This should be called once on application start.
     * @param userId The ID of the currently logged-in user.
     */
    async initialize(userId: string): Promise<void> {
        if (this.currentUserContext) {
            logger.warn('AdaptiveLayoutEngine already initialized. Skipping re-initialization.');
            return;
        }

        logger.info(`Initializing AdaptiveLayoutEngine for user: ${userId}`);

        // 1. Initial fetch of static user context
        const userProfile = await this.userProfileService.getUserProfile(userId);
        const userPreferences = await this.userProfileService.getUserPreferences(userId);

        this.currentUserContext = {
            userId,
            profile: userProfile,
            preferences: userPreferences,
            device: this.deviceDetector.getDeviceProfile(),
            environment: this.environmentDetector.getEnvironmentContext(),
            activity: this.activityTracker.getUserActivityContext(),
            appState: {
                activeViewId: 'dashboard', // Default initial view
                openModalCount: 0,
                sidebarPrimaryVisible: this.currentLayout.components.sidebarPrimary.isVisible || false,
                sidebarSecondaryVisible: this.currentLayout.components.sidebarSecondary.isVisible || false,
                activeNotifications: [], // Will be updated by updateApplicationState
                backgroundTaskCount: 0,
                searchQueryActive: false,
                lastUserActionTimestamp: Date.now(),
                activeFeature: null,
                activeModule: null,
                isInitialLoad: true,
                isTourActive: false,
                pendingActionCount: 0,
            },
            cognitiveLoad: { level: 'normal', score: 0.5, explanation: 'Initial state, no activity yet.' }, // Placeholder
            externalIntegrations: {}, // Populated shortly
        };
        this.lastLayoutDecisionContext = deepMerge({}, this.currentUserContext); // Initial snapshot

        // 2. Apply initial layout based on preferences or device, ensuring accessibility
        this.currentLayout = this.determineInitialLayout(userPreferences, this.currentUserContext.device);
        this.applyAccessibilitySettings(this.currentLayout, userPreferences.accessibility, this.currentUserContext.device);
        this.emitLayoutChange(this.currentLayout);
        logger.info('Initial layout applied based on preferences and device.');

        // 3. Start periodic context updates and layout re-evaluation
        setInterval(() => this.updateContextAndReevaluateLayout(userId), 5000); // Poll every 5 seconds
        logger.info('AdaptiveLayoutEngine context polling started.');
    }

    /**
     * Determines the initial layout based on user preferences and device type.
     * @param preferences User's explicit preferences.
     * @param device Device profile.
     * @returns The initial UILayoutConfig.
     */
    private determineInitialLayout(preferences: UserPreferences, device: DeviceProfile): UILayoutConfig {
        if (preferences.layoutPreference === 'fixed') {
            // In a real app, there might be a stored 'fixed' layout by the user.
            // For now, we'll fall back to device-specific defaults.
            logger.warn('User prefers fixed layout, but no specific fixed layout found. Using device-adaptive default.');
        }

        if (device.type === 'mobile' || device.type === 'tablet' || device.type === 'wearable') {
            return deepMerge({}, DEFAULT_MOBILE_LAYOUT);
        } else if (device.type === 'smart-display') {
            // Could define a specific DEFAULT_SMART_DISPLAY_LAYOUT
            return deepMerge({}, DEFAULT_MOBILE_LAYOUT); // Fallback to mobile for simplicity
        }
        return deepMerge({}, DEFAULT_DESKTOP_LAYOUT);
    }

    /**
     * Applies accessibility settings from user preferences to a given layout configuration.
     * This ensures user-mandated accessibility overrides are always respected.
     * @param layout The layout to modify.
     * @param accessibilityPrefs User's accessibility preferences.
     * @param device Current device profile.
     */
    private applyAccessibilitySettings(layout: UILayoutConfig, accessibilityPrefs: UserPreferences['accessibility'], device: DeviceProfile): void {
        layout.accessibilitySettings.fontSizeMultiplier = accessibilityPrefs.fontSize;
        layout.accessibilitySettings.highContrastMode = accessibilityPrefs.highContrast;
        layout.accessibilitySettings.reducedMotion = accessibilityPrefs.reducedMotion || device.prefersReducedMotion; // Respect OS preference
        layout.accessibilitySettings.screenReaderOptimized = accessibilityPrefs.screenReaderSupport;
        layout.accessibilitySettings.keyboardNavigationFocusStyle = accessibilityPrefs.keyboardNavigation ? 'outline' : 'none'; // Basic setting
        // Apply color scheme preference if global theme is 'system' or 'adaptive'
        if (layout.globalTheme.mode === 'system-preference' || layout.globalTheme.mode === 'adaptive') {
            layout.globalTheme.mode = device.prefersColorScheme === 'dark' ? 'dark' : 'light';
        }
    }


    /**
     * Periodically updates the full user context and triggers layout re-evaluation.
     * This is the heart of the adaptive logic.
     * @param userId The ID of the currently logged-in user.
     */
    private async updateContextAndReevaluateLayout(userId: string): Promise<void> {
        if (!this.currentUserContext) {
            logger.warn('Context not initialized for re-evaluation. Skipping periodic update.');
            return;
        }

        const now = Date.now();
        const debounceThreshold = this.currentUserContext.cognitiveLoad.level === 'critical' ? CRITICAL_LAYOUT_UPDATE_DEBOUNCE_MS : LAYOUT_UPDATE_DEBOUNCE_MS;

        if (this.layoutUpdateTimeout) {
            clearTimeout(this.layoutUpdateTimeout);
        }

        // Debounce subsequent calls
        this.layoutUpdateTimeout = setTimeout(async () => {
            logger.debug('Starting periodic context update and layout re-evaluation.');

            // 1. Update dynamic parts of the context
            this.currentUserContext.device = this.deviceDetector.getDeviceProfile();
            this.currentUserContext.environment = this.environmentDetector.getEnvironmentContext();
            this.currentUserContext.activity = this.activityTracker.getUserActivityContext();

            // 2. Fetch external integration data concurrently
            const externalDataPromises = [
                this.msGraphService.getUpcomingMeetings(userId).then(m => ({ meetings: m })).catch(e => { logger.error('MS Graph meetings error:', e); return { meetings: [] }; }),
                this.msGraphService.getUserPresence(userId).then(p => ({ presence: p })).catch(e => { logger.error('MS Graph presence error:', e); return { presence: 'Available' as MicrosoftUserPresence }; }),
                this.msGraphService.getRecentDocuments(userId).then(d => ({ documents: d })).catch(e => { logger.error('MS Graph docs error:', e); return { documents: [] }; }),
                this.msGraphService.getOutlookMailboxSettings(userId).then(s => ({ mailboxSettings: s })).catch(e => { logger.error('MS Graph mailbox settings error:', e); return { mailboxSettings: null }; }),
                this.msGraphService.getTeamsActivity(userId).then(a => ({ teamsActivity: a })).catch(e => { logger.error('MS Graph Teams activity error:', e); return { teamsActivity: null }; }),

                this.googleWorkspaceService.getCalendarEvents(userId, new Date(), new Date(now + 24 * 60 * 60 * 1000)).then(e => ({ events: e })).catch(e => { logger.error('Google Calendar error:', e); return { events: [] }; }),
                this.googleWorkspaceService.getDriveActivity(userId, 5).then(a => ({ activity: a })).catch(e => { logger.error('Google Drive error:', e); return { activity: [] }; }),
                this.googleWorkspaceService.getGmailUnreadCount(userId).then(c => ({ unreadCount: c })).catch(e => { logger.error('Google Gmail unread count error:', e); return { unreadCount: 0 }; }),
                this.googleWorkspaceService.getGoogleTasks(userId).then(t => ({ tasks: t })).catch(e => { logger.error('Google Tasks error:', e); return { tasks: [] }; }),

                this.salesforceCRMCustomService.getActiveTasks(userId).then(t => ({ tasks: t })).catch(e => { logger.error('Salesforce tasks error:', e); return { tasks: [] }; }),
                this.salesforceCRMCustomService.getRecentLeads(userId, 3).then(l => ({ leads: l })).catch(e => { logger.error('Salesforce leads error:', e); return { leads: [] }; }),
                this.salesforceCRMCustomService.getOpportunityDetails('Opportunity_123').then(o => ({ opportunity: o })).catch(e => { logger.error('Salesforce opportunity error:', e); return { opportunity: null }; }), // Example for one opportunity
                this.salesforceCRMCustomService.getCaseDetails('Case_456').then(c => ({ case: c })).catch(e => { logger.error('Salesforce case error:', e); return { case: null }; }), // Example for one case

                this.plaidFinancialService.getAccountsSummary(userId).then(a => ({ accounts: a })).catch(e => { logger.error('Plaid accounts error:', e); return { accounts: [] }; }),
                this.plaidFinancialService.getRecentTransactions(userId, 5).then(t => ({ transactions: t })).catch(e => { logger.error('Plaid transactions error:', e); return { transactions: [] }; }),
                this.plaidFinancialService.getInvestmentHoldings(userId).then(h => ({ holdings: h })).catch(e => { logger.error('Plaid holdings error:', e); return { holdings: [] }; }),
                this.plaidFinancialService.getFinancialGoalsProgress(userId).then(g => ({ goals: g })).catch(e => { logger.error('Plaid goals error:', e); return { goals: [] }; }),
            ];

            const results = await Promise.all(externalDataPromises);
            const externalData = results.reduce((acc, current) => ({ ...acc, ...current }), {});

            this.currentUserContext.externalIntegrations = {
                microsoftGraph: {
                    upcomingMeetings: externalData.meetings,
                    presence: externalData.presence,
                    recentDocuments: externalData.documents,
                    mailboxSettings: externalData.mailboxSettings,
                    teamsActivity: externalData.teamsActivity,
                },
                googleWorkspace: {
                    calendarEvents: externalData.events,
                    driveActivity: externalData.activity,
                    gmailUnreadCount: externalData.unreadCount,
                    googleTasks: externalData.tasks,
                },
                salesforceCRM: {
                    activeTasks: externalData.tasks,
                    recentLeads: externalData.leads,
                    openOpportunities: externalData.opportunity ? [externalData.opportunity] : [], // Filter for open in real impl
                    activeCases: externalData.case ? [externalData.case] : [], // Filter for active in real impl
                },
                plaidFinancialData: {
                    accountsSummary: externalData.accounts,
                    recentTransactions: externalData.transactions,
                    investmentHoldings: externalData.holdings,
                    financialGoalsProgress: externalData.goals,
                },
            };

            // 3. Update cognitive load based on activity, app state, and context
            const sysPerformance = this.systemPerformanceMonitor.getSystemPerformanceMetrics();
            const cognitiveLoadMetrics: CognitiveLoadMetrics = {
                interactionSpeed: (this.currentUserContext.activity.typingActivityScore / 100) + (this.currentUserContext.activity.mouseActivityScore / 500) + (this.currentUserContext.activity.scrollActivityScore / 500),
                errorRate: this.currentUserContext.activity.recentErrorCount,
                taskComplexityScore: this.inferTaskComplexityScore(this.currentUserContext),
                multitaskingLevel: this.currentUserContext.activity.isMultitasking ? 1 : 0,
                unreadNotificationCount: this.currentUserContext.appState.activeNotifications.filter(n => !n.isRead).length + (this.currentUserContext.externalIntegrations.googleWorkspace?.gmailUnreadCount || 0) + (this.currentUserContext.externalIntegrations.microsoftGraph?.teamsActivity.unreadChatsCount || 0),
                timeOnTask: this.currentUserContext.activity.idleDurationSeconds === 0 ? (now - this.currentUserContext.appState.lastUserActionTimestamp) / 1000 : 0, // Time since last app action
                systemPerformanceImpact: (sysPerformance.cpuUsage + sysPerformance.memoryUsageGB / 8) / 2, // Simple average impact
                pendingActionCount: this.currentUserContext.appState.pendingActionCount,
                recentTaskSwitches: this.currentUserContext.activity.recentlyVisitedViews.length > 1 ? 1 : 0, // Heuristic
                // ... more metrics could be added here
            };

            this.currentUserContext.cognitiveLoad = this.cognitiveLoadPredictor.assessLoad(cognitiveLoadMetrics);
            this.currentUserContext.profile = await this.userProfileService.getUserProfile(userId); // Re-fetch for potential updates
            this.currentUserContext.preferences = await this.userProfileService.getUserPreferences(userId); // Re-fetch for potential updates
            // Infer user sentiment (placeholder)
            this.currentUserContext.userSentiment = this.inferUserSentiment(this.currentUserContext);

            // 4. Request new layout from AI if context warrants it
            await this.requestNewLayoutFromAI();

            this.currentUserContext.appState.isInitialLoad = false; // Initial load is complete after first full context and layout
            this.lastLayoutUpdateTimestamp = now;

            // Notify CognitiveLoadBalancer for system resource adjustments if it's separate from UI
            this.cognitiveLoadBalancer.adjustSystemResources(this.currentUserContext.cognitiveLoad, this.currentUserContext);

            logger.debug('Finished periodic context update and layout re-evaluation cycle.');
        }, debounceThreshold);
    }

    /**
     * Infers a task complexity score based on various factors in the user context.
     * This is a heuristic, and could be refined using ML or more detailed task models.
     * @param context The full user context.
     * @returns A score between 0 and 1, where 1 is highest complexity.
     */
    private inferTaskComplexityScore(context: FullUserContext): number {
        let score = 0.1; // Baseline complexity

        // Based on active view/module
        if (context.appState.activeModule === 'developer') score += 0.4; // Developer tools are inherently complex
        if (context.appState.activeViewId.includes('Analytics') || context.appState.activeViewId.includes('PredictiveModels') || context.appState.activeViewId.includes('Blockchain')) {
            score += 0.3; // Data-heavy, analytical views
        }
        if (context.appState.activeViewId.includes('Compliance') || context.appState.activeViewId.includes('Security')) {
            score += 0.35; // Regulatory or security tasks are high stakes
        }
        if (context.appState.activeViewId.includes('Transactions') && (context.activity.typingActivityScore > 10 || context.activity.clicksPerMinute > 20)) {
            score += 0.1; // Active data entry
        }
        if (context.appState.activeViewId.includes('CorporateDashboard') && context.profile.role === 'CEO' || context.profile.role === 'Executive') {
            score += 0.25; // High-level decision making context
        }
        if (context.appState.isTourActive) score -= 0.2; // Onboarding should be simpler

        // Based on external integrations
        const msGraph = context.externalIntegrations.microsoftGraph;
        if (msGraph?.presence === 'InAMeeting' || msGraph?.upcomingMeetings.some(m => m.start.getTime() < Date.now() + 15 * 60 * 1000)) {
            score += 0.2; // Being in/near a meeting is a context switch
        }
        if (msGraph?.teamsActivity.unreadMentionsCount > 0) score += 0.1;

        const googleWorkspace = context.externalIntegrations.googleWorkspace;
        if (googleWorkspace?.gmailUnreadCount > 10) score += 0.1;
        if (googleWorkspace?.googleTasks.filter(t => t.status === 'needsAction' && t.due && new Date(t.due).getTime() < Date.now() + 24 * 60 * 60 * 1000).length > 0) {
            score += 0.15; // Impending tasks
        }

        const salesforceCRM = context.externalIntegrations.salesforceCRM;
        if (salesforceCRM?.activeTasks.some(t => t.priority === 'High' || t.priority === 'Critical')) {
            score += 0.25; // High-priority sales/CRM tasks
        }
        if (salesforceCRM?.activeCases.some(c => c.priority === 'High')) {
            score += 0.2; // High-priority customer support cases
        }

        const plaid = context.externalIntegrations.plaidFinancialData;
        if (plaid?.financialGoalsProgress.some(g => g.progressPercentage < 50 && g.targetDate && (new Date(g.targetDate).getTime() - Date.now() < 60 * 24 * 60 * 60 * 1000))) {
            score += 0.15; // Struggling or urgent financial goals
        }
        if (context.appState.activeNotifications.some(n => n.priority === 'critical' || n.type === 'fraud' || n.type === 'security')) {
            score += 0.5; // Critical alerts significantly increase load
        } else if (context.appState.activeNotifications.some(n => n.priority === 'high' || n.type === 'financial')) {
            score += 0.2;
        }

        // Clamp between 0 and 1
        return Math.min(1, Math.max(0, score));
    }

    /**
     * Infers user sentiment based on various context clues (mocked for now).
     * This would ideally use NLP on user inputs or more sophisticated activity patterns.
     * @param context The full user context.
     * @returns An inferred user sentiment.
     */
    private inferUserSentiment(context: FullUserContext): FullUserContext['userSentiment'] {
        if (context.cognitiveLoad.level === 'critical' || context.cognitiveLoad.level === 'high') {
            if (context.activity.recentErrorCount > 0) return 'stressed';
            if (context.activity.idleDurationSeconds > this.activityTracker.IDLE_THRESHOLD_SECONDS) return 'distracted';
            return 'focused'; // High load could also mean deep focus
        }
        if (context.activity.isActive && context.activity.typingActivityScore > 50 && context.activity.mouseActivityScore > 200) {
            return 'focused';
        }
        if (context.activity.idleDurationSeconds > this.IDLE_THRESHOLD_SECONDS / 2) {
            return 'distracted';
        }
        if (context.cognitiveLoad.level === 'low' && context.activity.isActive) {
            return 'positive'; // Suggesting engagement
        }
        return 'neutral';
    }

    /**
     * Makes a call to the AI service to get a new layout recommendation.
     * It decides whether an AI call is necessary based on context changes and user preferences.
     */
    private async requestNewLayoutFromAI(): Promise<void> {
        if (!this.currentUserContext) {
            logger.error('Cannot request layout from AI: User context not available.');
            return;
        }

        const userPreferences = this.currentUserContext.preferences;
        const currentLoadLevel = this.currentUserContext.cognitiveLoad.level;
        const currentDeviceType = this.currentUserContext.device.type;

        // Skip AI if adaptive layout is disabled or in developer mode with AI disabled
        if (userPreferences.layoutPreference !== 'adaptive' || (userPreferences.developerMode && !this.featureFlagManager.isFeatureEnabled('aiLayoutAdaptationInDevMode'))) {
            logger.debug('AI layout adaptation skipped due to user preferences or dev mode settings.');
            // Ensure the current layout is consistent with explicit user preferences or device defaults
            this.ensureDefaultOrUserPreferredLayout(userPreferences, currentDeviceType);
            this.lastLayoutDecisionContext = deepMerge({}, this.currentUserContext); // Update snapshot
            return;
        }

        // Only trigger AI if cognitive load is abnormal, or if a significant context change occurred.
        const shouldAdapt = currentLoadLevel === 'high' || currentLoadLevel === 'critical' || currentLoadLevel === 'low' ||
                             this.hasSignificantContextChange(this.currentUserContext);

        if (!shouldAdapt && !this.currentUserContext.appState.isInitialLoad) {
            logger.debug('No significant change or abnormal cognitive load, skipping AI layout adaptation.');
            this.lastLayoutDecisionContext = deepMerge({}, this.currentUserContext); // Update snapshot
            return;
        }

        logger.info(`Requesting new layout from AI. Current Cognitive Load: ${currentLoadLevel}, Significant Change: ${shouldAdapt}`);
        this.telemetryService.recordEvent('ai_layout_request_initiated', {
            cognitiveLoadLevel: currentLoadLevel,
            activeView: this.currentUserContext.appState.activeViewId,
            reason: shouldAdapt ? 'context_change_or_abnormal_load' : 'initial_load',
        });

        try {
            // Construct a comprehensive prompt using the prompt library
            const prompt = effectivePromptLibrary.generateAdaptiveLayoutPrompt(this.currentUserContext, this.currentLayout);
            const aiResponse = await this.geminiService.sendPrompt({
                model: 'gemini-pro',
                prompt: prompt,
                temperature: 0.7, // Balance creativity and consistency
                maxOutputTokens: 2500, // Sufficient for detailed JSON
                responseFormat: 'json',
            });

            if (aiResponse && aiResponse.candidates && aiResponse.candidates.length > 0) {
                const layoutString = aiResponse.candidates[0].content.parts[0].text;
                let recommendedLayout: UILayoutConfig | null = null;
                try {
                    recommendedLayout = JSON.parse(layoutString) as UILayoutConfig;
                    if (!this.validateLayoutConfig(recommendedLayout)) {
                        throw new Error('AI layout response failed schema validation.');
                    }

                    // Always apply user accessibility preferences on top of AI recommendation
                    this.applyAccessibilitySettings(recommendedLayout, userPreferences.accessibility, this.currentUserContext.device);

                    // Allow CognitiveLoadBalancer to make final adjustments if necessary
                    this.cognitiveLoadBalancer.applyLayoutAdjustments(recommendedLayout, this.currentUserContext.cognitiveLoad);

                    this.applyLayout(recommendedLayout, 'optimal');
                    this.telemetryService.recordEvent('layout_adapted_by_ai', {
                        cognitiveLoadLevel: currentLoadLevel,
                        strategy: recommendedLayout.layoutStrategy,
                        explanation: recommendedLayout.explanation,
                    });
                    this.lastLayoutDecisionContext = deepMerge({}, this.currentUserContext); // Update snapshot after successful layout
                } catch (parseError) {
                    logger.error('Failed to parse or validate AI layout response:', parseError, layoutString);
                    this.telemetryService.recordError(new Error('AI_LAYOUT_PARSE_ERROR'), { aiResponse: layoutString, parseError: parseError.message });
                    this.applyLayout(this.getFallbackLayout(), 'fallback');
                }
            } else {
                logger.warn('AI returned no valid layout candidates. Using fallback layout.');
                this.telemetryService.recordEvent('ai_layout_no_candidates', { cognitiveLoadLevel: currentLoadLevel });
                this.applyLayout(this.getFallbackLayout(), 'fallback');
            }
        } catch (error) {
            logger.error('Error fetching layout from AI service:', error);
            this.telemetryService.recordError(error as Error, { stage: 'ai_service_call', cognitiveLoadLevel: currentLoadLevel });
            this.applyLayout(this.getFallbackLayout(), 'fallback');
        }
    }

    /**
     * Performs a basic validation of the received UILayoutConfig structure.
     * This is a critical step to prevent malformed AI responses from breaking the UI.
     * @param layout The layout object to validate.
     * @returns True if the layout is valid, false otherwise.
     */
    private validateLayoutConfig(layout: UILayoutConfig): boolean {
        // Perform deep validation if necessary, for now, a shallow check on critical fields.
        if (!layout || typeof layout !== 'object') return false;
        if (!layout.version || !layout.globalTheme || !layout.pageLayout || !layout.components || !layout.accessibilitySettings || !layout.aiInteractions) {
            logger.error('Layout config missing critical top-level properties.', layout);
            return false;
        }
        // Check a few key component configs
        if (!layout.components.header || !layout.components.mainContentArea || !layout.components.sidebarPrimary) {
            logger.error('Layout config missing critical component definitions.', layout.components);
            return false;
        }
        // Add more specific validation for types if needed.
        return true;
    }

    /**
     * Determines if there has been a significant change in context to warrant a new AI layout request.
     * This involves comparing the current context with the last context that triggered a layout decision.
     * @param currentContext The most up-to-date user context.
     * @returns True if a significant change is detected, false otherwise.
     */
    private hasSignificantContextChange(currentContext: FullUserContext): boolean {
        if (!this.lastLayoutDecisionContext) {
            return true; // Always adapt if no previous decision context
        }

        const lastContext = this.lastLayoutDecisionContext;

        // --- High-level changes that always trigger an update ---
        if (lastContext.device.type !== currentContext.device.type) return true;
        if (lastContext.appState.activeModule !== currentContext.appState.activeModule) return true;
        if (lastContext.cognitiveLoad.level !== currentContext.cognitiveLoad.level) return true; // Change in cognitive load level

        // --- Threshold-based changes for more nuance ---
        // Activity changes
        if (Math.abs(lastContext.activity.idleDurationSeconds - currentContext.activity.idleDurationSeconds) > 30 && currentContext.activity.idleDurationSeconds < this.IDLE_THRESHOLD_SECONDS) return true; // Became active/idle significantly
        if (lastContext.activity.isMultitasking !== currentContext.activity.isMultitasking) return true;
        if (Math.abs(lastContext.activity.recentErrorCount - currentContext.activity.recentErrorCount) > 0) return true; // Any new errors

        // App state changes
        if (lastContext.appState.activeViewId !== currentContext.appState.activeViewId) return true;
        if (lastContext.appState.openModalCount !== currentContext.appState.openModalCount) return true;
        if (lastContext.appState.searchQueryActive !== currentContext.appState.searchQueryActive) return true;
        if (lastContext.appState.isTourActive !== currentContext.appState.isTourActive) return true;
        if (Math.abs(lastContext.appState.pendingActionCount - currentContext.appState.pendingActionCount) > 0) return true;


        // External integration changes
        const msGraphChanged =
            lastContext.externalIntegrations.microsoftGraph?.presence !== currentContext.externalIntegrations.microsoftGraph?.presence ||
            (lastContext.externalIntegrations.microsoftGraph?.upcomingMeetings.length || 0) !== (currentContext.externalIntegrations.microsoftGraph?.upcomingMeetings.length || 0) ||
            (lastContext.externalIntegrations.microsoftGraph?.teamsActivity?.unreadMentionsCount || 0) !== (currentContext.externalIntegrations.microsoftGraph?.teamsActivity?.unreadMentionsCount || 0);
        if (msGraphChanged) return true;

        const googleWorkspaceChanged =
            (lastContext.externalIntegrations.googleWorkspace?.gmailUnreadCount || 0) !== (currentContext.externalIntegrations.googleWorkspace?.gmailUnreadCount || 0) ||
            (lastContext.externalIntegrations.googleWorkspace?.googleTasks?.length || 0) !== (currentContext.externalIntegrations.googleWorkspace?.googleTasks?.length || 0);
        if (googleWorkspaceChanged) return true;

        const salesforceChanged =
            (lastContext.externalIntegrations.salesforceCRM?.activeTasks.length || 0) !== (currentContext.externalIntegrations.salesforceCRM?.activeTasks.length || 0);
        if (salesforceChanged) return true;

        const plaidChanged =
            (lastContext.externalIntegrations.plaidFinancialData?.financialGoalsProgress.length || 0) !== (currentContext.externalIntegrations.plaidFinancialData?.financialGoalsProgress.length || 0) ||
            (lastContext.externalIntegrations.plaidFinancialData?.recentTransactions.length || 0) !== (currentContext.externalIntegrations.plaidFinancialData?.recentTransactions.length || 0);
        if (plaidChanged) return true;


        // User preferences changed
        if (JSON.stringify(lastContext.preferences) !== JSON.stringify(currentContext.preferences)) return true;

        return false;
    }

    /**
     * Ensures the current layout aligns with user preferences or device defaults if AI adaptation is skipped.
     * @param preferences User's current preferences.
     * @param deviceType Current device type.
     */
    private ensureDefaultOrUserPreferredLayout(preferences: UserPreferences, deviceType: DeviceProfile['type']): void {
        let targetLayout: UILayoutConfig;

        if (preferences.layoutPreference === 'fixed') {
            // Here, you would load a user-saved fixed layout. For now, use device default.
            targetLayout = (deviceType === 'mobile' || deviceType === 'tablet') ? DEFAULT_MOBILE_LAYOUT : DEFAULT_DESKTOP_LAYOUT;
            if (JSON.stringify(this.currentLayout) !== JSON.stringify(targetLayout)) {
                this.applyLayout(targetLayout, 'user-fixed');
            }
        } else { // 'adaptive' or other unknown preference
            // Ensure basic device fit if for some reason the layout became inconsistent
            const defaultLayoutForDevice = (deviceType === 'mobile' || deviceType === 'tablet') ? DEFAULT_MOBILE_LAYOUT : DEFAULT_DESKTOP_LAYOUT;
            if (this.currentLayout.pageLayout.gridTemplateColumns !== defaultLayoutForDevice.pageLayout.gridTemplateColumns ||
                this.currentLayout.globalTheme.mode !== preferences.themePreference && preferences.themePreference !== 'system') {
                this.applyLayout(defaultLayoutForDevice, 'device-default');
            }
        }
    }

    /**
     * Applies a new layout configuration and notifies all subscribers.
     * This method deep merges the new layout with the existing one to allow for partial updates.
     * @param newLayout The new layout configuration to apply.
     * @param strategy The strategy that led to this layout (e.g., 'optimal', 'fallback').
     */
    private applyLayout(newLayout: UILayoutConfig, strategy: UILayoutConfig['layoutStrategy']): void {
        const mergedLayout = deepMerge(this.currentLayout, {
            ...newLayout,
            layoutStrategy: strategy,
            timestamp: Date.now(),
        });
        this.currentLayout = mergedLayout;
        logger.debug(`Applied new layout with strategy: ${strategy}`, this.currentLayout);
        this.emitLayoutChange(this.currentLayout);
    }

    /**
     * Returns a safe fallback layout, typically the device's default, applying current accessibility.
     * @returns A safe, default UILayoutConfig.
     */
    private getFallbackLayout(): UILayoutConfig {
        const device = this.deviceDetector.getDeviceProfile();
        const fallback = (device.type === 'mobile' || device.type === 'tablet') ? deepMerge({}, DEFAULT_MOBILE_LAYOUT) : deepMerge({}, DEFAULT_DESKTOP_LAYOUT);

        // Re-apply accessibility preferences on fallback
        if (this.currentUserContext?.preferences) {
            this.applyAccessibilitySettings(fallback, this.currentUserContext.preferences.accessibility, device);
        }
        fallback.explanation = 'Fallback layout applied due to AI error or invalid response.';
        return fallback;
    }

    /**
     * Subscribes a callback function to layout changes.
     * The callback will be immediately invoked with the current layout upon subscription.
     * @param callback The function to call when the layout changes.
     * @returns A function to unsubscribe this specific callback.
     */
    subscribe(callback: (layout: UILayoutConfig) => void): () => void {
        this.layoutSubscribers.push(callback);
        // Immediately provide the current layout to new subscribers
        try {
            callback(this.currentLayout);
        } catch (error) {
            logger.error('Error notifying new layout subscriber immediately:', error);
        }

        return () => {
            this.layoutSubscribers = this.layoutSubscribers.filter(sub => sub !== callback);
            logger.debug('Layout subscriber unsubscribed.');
        };
    }

    /**
     * Emits the current layout to all registered subscribers.
     */
    private emitLayoutChange(layout: UILayoutConfig): void {
        this.layoutSubscribers.forEach(callback => {
            try {
                callback(layout);
            } catch (error) {
                logger.error('Error notifying layout subscriber:', error);
                this.telemetryService.recordError(error as Error, { stage: 'layout_emit_callback_error', subscriberCount: this.layoutSubscribers.length });
            }
        });
    }

    /**
     * Gets the current active UI layout configuration.
     * @returns The current UILayoutConfig.
     */
    getCurrentLayout(): UILayoutConfig {
        return deepMerge({}, this.currentLayout); // Return a clone to prevent direct modification
    }

    /**
     * Updates the application state context. This method should be called by UI components
     * or the central application state manager (e.g., `App.tsx` or `DataContext`)
     * whenever relevant application state changes.
     * @param appState A partial object containing the updated application state properties.
     */
    updateApplicationState(appState: Partial<ApplicationStateContext>): void {
        if (this.currentUserContext) {
            const oldAppState = { ...this.currentUserContext.appState };
            this.currentUserContext.appState = {
                ...this.currentUserContext.appState,
                ...appState,
                lastUserActionTimestamp: Date.now(),
            };

            // Immediately trigger re-evaluation for critical app state changes
            const criticalChange =
                (appState.activeViewId && appState.activeViewId !== oldAppState.activeViewId) ||
                (appState.activeModule && appState.activeModule !== oldAppState.activeModule) ||
                (appState.isTourActive !== undefined && appState.isTourActive !== oldAppState.isTourActive) ||
                (appState.activeNotifications && appState.activeNotifications.length !== oldAppState.activeNotifications.length);

            if (criticalChange) {
                logger.debug('Critical app state change detected, triggering immediate layout re-evaluation.', appState);
                this.activityTracker.setActiveView(this.currentUserContext.appState.activeViewId); // Update tracker
                this.requestNewLayoutFromAI(); // Bypass debounce for critical changes
            } else {
                logger.debug('App state updated (non-critical). Will be picked up by next periodic update.', appState);
            }

            // Update activity tracker with relevant app state
            if (appState.activeViewId) this.activityTracker.setActiveView(appState.activeViewId);
            if (appState.openModalCount !== undefined) this.activityTracker.setOpenModalCount(appState.openModalCount);
            if (appState.searchQueryActive !== undefined) this.activityTracker.setSearchQueryActive(appState.searchQueryActive);
        } else {
            logger.warn('Attempted to update application state before engine initialization.');
        }
    }

    /**
     * Explicitly triggers a re-evaluation of the layout. Can be used for user-initiated refreshes
     * or programmatic overrides when an immediate layout change is required.
     * @returns A Promise that resolves when the re-evaluation process is complete.
     */
    triggerLayoutReevaluation(): Promise<void> {
        if (this.currentUserContext?.userId) {
            logger.info('Manual layout re-evaluation triggered.');
            return this.updateContextAndReevaluateLayout(this.currentUserContext.userId);
        }
        logger.warn('Cannot trigger layout re-evaluation: User ID not available.');
        return Promise.resolve();
    }
}


// --- Factory / Singleton Pattern for AdaptiveLayoutEngine ---
// Ensures that only a single instance of the engine is used throughout the application,
// and manages its dependencies.

let adaptiveLayoutEngineInstance: AdaptiveLayoutEngine | null = null;
const systemPerformanceMonitorInstance = new SystemPerformanceMonitor(); // Singleton for perf monitor

/**
 * Get the singleton instance of AdaptiveLayoutEngine.
 * This function should be called once, typically during application bootstrap,
 * with all necessary dependencies to instantiate the engine. Subsequent calls
 * will return the existing instance.
 * @param geminiService Required for initial instantiation.
 * @param cognitiveLoadPredictor Required for initial instantiation.
 * @param cognitiveLoadBalancer Required for initial instantiation.
 * @param userProfileService Required for initial instantiation.
 * @param deviceDetector Required for initial instantiation.
 * @param environmentDetector Required for initial instantiation.
 * @param activityTracker Required for initial instantiation.
 * @param telemetryService Required for initial instantiation.
 * @param featureFlagManager Required for initial instantiation.
 * @returns The singleton instance of AdaptiveLayoutEngine.
 * @throws Error if dependencies are missing during the first call.
 */
export function getAdaptiveLayoutEngineInstance(
    geminiService?: GeminiService,
    cognitiveLoadPredictor?: CognitiveLoadPredictor,
    cognitiveLoadBalancer?: CognitiveLoadBalancerService,
    userProfileService?: UserProfileService,
    deviceDetector?: DeviceDetector,
    environmentDetector?: EnvironmentDetector,
    activityTracker?: UserActivityTracker,
    telemetryService?: TelemetryService,
    featureFlagManager?: FeatureFlagManager
): AdaptiveLayoutEngine {
    if (!adaptiveLayoutEngineInstance) {
        if (!geminiService || !cognitiveLoadPredictor || !cognitiveLoadBalancer || !userProfileService || !deviceDetector || !environmentDetector || !activityTracker || !telemetryService || !featureFlagManager) {
            throw new Error("AdaptiveLayoutEngine requires all dependencies for its initial instantiation.");
        }
        adaptiveLayoutEngineInstance = new AdaptiveLayoutEngine(
            geminiService,
            cognitiveLoadPredictor,
            cognitiveLoadBalancer,
            userProfileService,
            deviceDetector,
            environmentDetector,
            activityTracker,
            telemetryService,
            featureFlagManager,
            systemPerformanceMonitorInstance // Inject the singleton performance monitor
        );
    }
    return adaptiveLayoutEngineInstance;
}

/**
 * Creates a mock AdaptiveLayoutEngine instance with mock dependencies.
 * Useful for testing or environments where actual services are not available.
 * @returns A fully functional, but mocked, AdaptiveLayoutEngine instance.
 */
export function createMockAdaptiveLayoutEngine(): AdaptiveLayoutEngine {
    logger.warn('Creating mock AdaptiveLayoutEngine instance. All external services are mocked.');

    const mockGeminiService: GeminiService = {
        sendPrompt: async (payload) => {
            logger.debug('Mock GeminiService: Received prompt for layout, returning default.');
            const defaultLayout = new DeviceDetector().getDeviceProfile().type === 'mobile' ? DEFAULT_MOBILE_LAYOUT : DEFAULT_DESKTOP_LAYOUT;
            return {
                candidates: [{
                    content: {
                        parts: [{
                            text: JSON.stringify({
                                ...defaultLayout,
                                explanation: 'Mock AI response: Default layout for device type, simulating AI decision.',
                                layoutStrategy: 'mock-ai',
                            }),
                        }],
                    },
                }],
            };
        },
        configure: () => logger.debug('Mock GeminiService: configure called.'),
        getModels: async () => [{ name: 'mock-gemini-pro', displayName: 'Mock Gemini Pro', inputTokenLimit: 32768, outputTokenLimit: 2048, capabilities: [AIAgentCapability.GenerateText] }],
    };

    const mockCognitiveLoadPredictor: CognitiveLoadPredictor = {
        assessLoad: (metrics: CognitiveLoadMetrics) => {
            let score = (metrics.errorRate * 0.3) + (metrics.interactionSpeed * 0.2) + (metrics.taskComplexityScore * 0.5) + (metrics.systemPerformanceImpact * 0.2);
            score = Math.min(1, Math.max(0, score)); // Clamp score between 0 and 1
            let level: CognitiveLoadLevel = 'normal';
            if (score > COGNITIVE_LOAD_THRESHOLDS.CRITICAL) level = 'critical';
            else if (score > COGNITIVE_LOAD_THRESHOLDS.HIGH) level = 'high';
            else if (score < COGNITIVE_LOAD_THRESHOLDS.LOW) level = 'low';
            return { level, score, explanation: `Mock load assessment: score ${score.toFixed(2)} based on [${JSON.stringify(metrics)}]` };
        },
    };

    const mockCognitiveLoadBalancer: CognitiveLoadBalancerService = {
        adjustSystemResources: (load: CognitiveLoadAssessment, context: any) => {
            logger.debug(`Mock CognitiveLoadBalancerService: Adjusting resources for load ${load.level}`, context);
            return Promise.resolve(); // No actual resource adjustment in mock
        },
        applyLayoutAdjustments: (layout: UILayoutConfig, load: CognitiveLoadAssessment) => {
            logger.debug(`Mock CognitiveLoadBalancerService: Applying layout adjustments for load ${load.level}`);
            // Example: If critical, ensure header is red
            if (load.level === 'critical') {
                layout.globalTheme.primaryColor = '#dc3545';
                layout.components.header.themeOverride = { backgroundColor: '#dc3545', textColor: '#ffffff' };
            }
        }
    };

    const mockUserProfileService = new UserProfileService();
    const mockDeviceDetector = new DeviceDetector();
    const mockEnvironmentDetector = new EnvironmentDetector();
    const mockActivityTracker = new UserActivityTracker();

    const mockTelemetryService: TelemetryService = {
        recordEvent: (eventName, data) => logger.debug(`Mock Telemetry: Event: ${eventName}`, data),
        recordError: (error, context) => logger.error(`Mock Telemetry Error: ${error.message}`, context),
        recordPageView: (pageName, path) => logger.debug(`Mock Telemetry PageView: ${pageName} - ${path}`),
    };

    const mockFeatureFlagManager: FeatureFlagManager = {
        isFeatureEnabled: (flag) => true, // All features enabled in mock by default
        getFeatureValue: (flag, defaultValue) => defaultValue,
    };

    return new AdaptiveLayoutEngine(
        mockGeminiService,
        mockCognitiveLoadPredictor,
        mockCognitiveLoadBalancer,
        mockUserProfileService,
        mockDeviceDetector,
        mockEnvironmentDetector,
        mockActivityTracker,
        mockTelemetryService,
        mockFeatureFlagManager,
        new SystemPerformanceMonitor() // Use a real (simulated) performance monitor for mock engine
    );
}

// Ensure promptLibrary is available, or use the mock
if (!promptLibrary) {
    logger.warn("The global 'promptLibrary' object was not found. Using mock implementation.");
    // This line won't actually re-export, but signifies the usage of the mock.
    // In actual project setup, ai/promptLibrary.ts needs to be properly defined and imported.
    // The `effectivePromptLibrary` variable already handles this.
}