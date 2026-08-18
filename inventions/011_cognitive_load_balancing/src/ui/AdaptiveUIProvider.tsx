// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/inventions/011_cognitive_load_balancing/src/ui/AdaptiveUIProvider.tsx
================================================================================

```typescript
import React, { useState, useEffect, useContext, createContext, useCallback, useRef } from 'react';

// --- Global Types/Interfaces ---
export enum UiElementType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  GUIDED = 'guided', // New type for elements specific to guided mode
  CRITICAL_ACTION = 'critical_action', // For high-importance, high-impact actions
  NAV_GLOBAL = 'nav_global', // Global navigation elements
  HINT_CONTEXTUAL = 'hint_contextual', // Context-specific help or hints
  FEEDBACK_NOTIFICATION = 'feedback_notification', // Alerts, success/error messages
  DYNAMIC_CONTENT = 'dynamic_content', // Content that might change often
  // Deeper dive: Semantic UI Elements - what function do they serve?
  DATA_DISPLAY = 'data_display', // E.g., charts, tables, complex reports
  FORM_INPUT = 'form_input', // Specific for input fields that need adaptation
  INTERACTIVE_CONTROL = 'interactive_control', // Buttons, sliders, toggles
  STATUS_INDICATOR = 'status_indicator', // Loading spinners, progress bars
}

export type UiMode = 'standard' | 'focus' | 'minimal' | 'guided' | 'crisis' | 'recovery' | 'calibration' | 'learning'; // Added crisis, recovery, calibration, learning modes

export interface MouseEventData {
  x: number;
  y: number;
  button: number;
  targetId: string;
  timestamp: number;
  targetBoundingRect?: DOMRectReadOnly; // For target acquisition error
  pressure?: number; // Advanced input: e.g., from a pressure-sensitive surface
  hoverDuration?: number; // Duration of hover before click
  mouseVelocity?: number; // Instantaneous velocity at this point
  mouseAcceleration?: number; // Instantaneous acceleration at this point
}

export interface ScrollEventData {
  scrollX: number;
  scrollY: number;
  timestamp: number;
  scrollDeltaY: number; // Delta from last scroll event
  scrollVelocity: number; // px/ms
  viewportHeight: number;
  documentHeight: number;
  scrollDirection: 'up' | 'down' | 'none'; // Explicit scroll direction
}

export interface KeyboardEventData {
  key: string;
  code: string;
  timestamp: number;
  isModifier: boolean;
  repeat: boolean; // Is it a key repeat event?
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  keystrokeDuration?: number; // Time from keydown to keyup
}

export interface FocusBlurEventData {
  type: 'focus' | 'blur';
  targetId: string;
  timestamp: number;
  durationMs?: number; // Time element was focused
  interactionCount?: number; // Number of interactions while focused
  focusLatencyMs?: number; // Time taken to refocus on an element after blur
}

export interface FormEventData {
  type: 'submit' | 'input' | 'change' | 'validation_attempt' | 'reset'; // Added validation_attempt, reset
  targetId: string;
  value?: string;
  timestamp: number;
  isValid?: boolean; // For validation events
  validationMessage?: string;
  inputLatencyMs?: number; // Time from focus to first input
}

export interface GazeEventData { // New: Mock Gaze Tracking Data
  x: number;
  y: number;
  timestamp: number;
  targetElementId?: string;
  pupilDilation?: number; // Example biometric
  gazeStability?: number; // Variance of gaze points over a short window
  saccadeVelocity?: number; // Instantaneous saccade velocity
  fixationDuration?: number; // Duration of current fixation
}

export interface BiosignalEventData { // New: Mock Biosignal Data
  type: 'heart_rate' | 'skin_conductance' | 'eeg_alpha' | 'eeg_theta'; // Examples
  value: number;
  timestamp: number;
  unit: string;
}

export type RawTelemetryEvent =
  | { type: 'mousemove'; data: MouseEventData }
  | { type: 'click'; data: MouseEventData }
  | { type: 'scroll'; data: ScrollEventData }
  | { type: 'keydown'; data: KeyboardEventData }
  | { type: 'keyup'; data: KeyboardEventData }
  | { type: 'focus'; data: FocusBlurEventData }
  | { type: 'blur'; data: FocusBlurEventData }
  | { type: 'form'; data: FormEventData }
  | { type: 'gaze'; data: GazeEventData }
  | { type: 'biosignal'; data: BiosignalEventData }; // New biosignal event type

// --- Feature Vector Interfaces ---
export interface MouseKinematicsFeatures {
  mouse_velocity_avg: number; // avg px/ms
  mouse_acceleration_avg: number; // avg px/ms^2
  mouse_path_tortuosity: number; // deviation from straight line, 0-1 (higher indicates less direct path)
  mouse_dwell_time_avg: number; // avg ms over interactive elements
  fitts_law_ip_avg: number; // Index of Performance, higher is better
  mouse_smoothness_index: number; // Inverse of abrupt changes, 0-1 (1 is perfectly smooth)
  mouse_travel_distance_total: number; // Total distance covered
  mouse_idle_time_ratio: number; // Proportion of time mouse was inactive
}

export interface ClickDynamicsFeatures {
  click_frequency: number; // clicks/sec
  click_latency_avg: number; // ms between clicks in a burst
  target_acquisition_error_avg: number; // px deviation from center
  double_click_frequency: number; // double clicks / sec
  click_pressure_avg: number; // avg pressure if available
  error_click_rate: number; // Clicks that result in immediate error or navigation bounce
  misclick_rate: number; // Clicks outside of intended target
  repeated_click_on_same_element_freq: number; // How often user clicks same element repeatedly
}

export interface ScrollDynamicsFeatures {
  scroll_velocity_avg: number; // px/sec
  scroll_direction_changes: number; // count
  scroll_pause_frequency: number; // pauses / sec (prolonged stops)
  scroll_jerk_avg: number; // Rate of change of acceleration
  scroll_coverage_ratio: number; // Percentage of document scrolled
  scroll_reversal_ratio: number; // Proportion of scroll up vs down
  scroll_depth_max: number; // Max scroll depth reached
}

export interface KeyboardDynamicsFeatures {
  typing_speed_wpm: number;
  backspace_frequency: number; // backspaces / sec
  keystroke_latency_avg: number; // ms between keydowns
  error_correction_rate: number; // backspaces / keydowns (excluding modifiers)
  typing_burst_rate: number; // Number of continuous typing bursts per second
  modifier_key_usage_ratio: number; // Ratio of modifier keys to content keys
  typing_rhythm_irregularity: number; // Std dev of keystroke latencies (Eq. 18)
}

export interface FocusDynamicsFeatures {
  refocus_frequency: number; // How often focus changes / sec
  element_dwell_time_avg: number; // Avg time spent on focused elements
  blur_rate: number; // How often elements lose focus unexpectedly
  focus_shift_distance_avg: number; // Avg distance (in px, or semantic distance) between focused elements
}

export interface FormInteractionFeatures {
  form_validation_errors_count: number; // count of explicit validation errors
  form_submission_rate: number; // submissions / sec
  form_abandonment_rate: number; // forms started but not submitted (in window)
  form_interaction_time_avg: number; // avg time per form field
  input_correction_rate: number; // Edits/corrections per input field
  time_to_first_input_avg: number; // Avg time from focus to first keystroke
}

export interface InteractionErrorFeatures {
  form_validation_errors_count: number; // count
  repeated_action_attempts_count: number; // count of same action or element interaction
  navigation_errors_count: number; // e.g., dead links, rapid back/forward
  api_errors_count: number; // New: backend API errors
  system_ui_errors_count: number; // New: client-side UI errors/crashes
  critical_error_frequency: number; // Errors with severity 'critical' per second
  time_since_last_error_s: number; // Time since most recent error
}

export interface GazeTrackingFeatures { // New: Gaze features
  gaze_deviation_avg: number; // Average deviation from intended target
  pupil_dilation_avg: number; // Average pupil dilation over window
  fixation_frequency: number; // Number of stable gaze points per second
  saccade_velocity_avg: number; // Average velocity of eye movements between fixations
  gaze_path_length: number; // Total distance gaze traveled (Eq. 26)
  scan_path_area: number; // Area covered by gaze (Eq. 27, simplified)
}

export interface BiosignalFeatures { // New: Biosignal features
  heart_rate_avg: number;
  heart_rate_variability: number; // Std dev or similar measure
  skin_conductance_avg: number; // Indicator of arousal/stress
  eeg_alpha_power_ratio: number; // Related to relaxed state
  eeg_theta_power_ratio: number; // Related to cognitive load/memory
}

export interface TaskContextFeatures {
  current_task_complexity: number; // derived from TaskContextManager
  time_in_current_task_sec: number;
  task_switches_count: number; // Number of task context changes
  task_completion_status: number; // 0=incomplete, 1=complete (requires external tracking)
  task_urgency_score: number; // Derived from TaskContextManager urgency enum
  task_progress_rate: number; // How quickly progress is being made (Eq. 54)
}

export interface UserEngagementFeatures { // New: Overall engagement
  active_interaction_ratio: number; // % of time spent interacting vs. idle
  idle_duration_avg: number; // Average idle time between interactions
  frustration_index_proxy: number; // Derived from a combination of errors, rapid clicks, high tortuosity
  user_activity_burstiness: number; // Variance in event density over time
  session_duration_s: number; // Total session time (can be long-term)
}

export interface TelemetryFeatureVector {
  timestamp_window_end: number;
  window_duration_ms: number;
  mouse?: MouseKinematicsFeatures;
  clicks?: ClickDynamicsFeatures;
  scroll?: ScrollDynamicsFeatures;
  keyboard?: KeyboardDynamicsFeatures;
  focus?: FocusDynamicsFeatures; // New
  forms?: FormInteractionFeatures; // New
  errors?: InteractionErrorFeatures;
  gaze?: GazeTrackingFeatures; // New
  biosignals?: BiosignalFeatures; // New
  task_context?: TaskContextFeatures;
  engagement?: UserEngagementFeatures; // New
  event_density: number; // total events per second in the window
  ui_mode_context: UiMode; // The UI mode active during this window
  prediction_confidence?: number; // How confident the system is in its load prediction
}

// --- User Profile and Context Store ---
export interface UserPreferences {
  preferredUiMode: UiMode; // User can set a preferred default mode
  cognitiveLoadThresholds: {
    high: number;
    low: number;
    critical: number;
    criticalLow: number;
    guided: number;
    guidedLow: number;
    crisis: number; // New
    recovery: number; // New
    // Deeper: Adaptive Thresholds - these will be dynamically adjusted
    adaptiveHigh: number;
    adaptiveLow: number;
    adaptiveCritical: number;
  };
  adaptationPolicySelection: {
    [mode: string]: { [elementType: string]: 'obscure' | 'deemphasize' | 'reposition' | 'summarize' | 'highlight' | 'segment' | 'none' | 'progressive_disclosure' | 'temporal_pacing' }; // Added highlight, segment, progressive_disclosure, temporal_pacing
  };
  personalizedBaselineCLS: number; // User's typical resting CLS
  sensitivityToErrors: number; // User's preference for how quickly errors trigger load response (0-1)
  preferenceForGuidance: number; // User's preference for guided mode activation (0-1)
  a_b_test_group: string; // For A/B testing different adaptation strategies
  cognitiveReserveEstimation: number; // User's estimated mental resource pool (0-1, higher means more resilient)
  explicitFeedbackHistory: Array<{ timestamp: number; adaptationId: string; rating: 'helpful' | 'neutral' | 'unhelpful' }>; // User feedback on adaptations
  privacySettings: {
    telemetryEnabled: boolean;
    gazeTrackingEnabled: boolean;
    biosignalTrackingEnabled: boolean;
    dataRetentionDays: number;
  };
}

/**
 * Claim 1: User Profile Service enhances personalization.
 * "By centralizing user preferences and historical interaction data, the UserProfileService enables a highly personalized adaptive UI experience, moving beyond one-size-all designs to cater to individual cognitive capacities and learning styles."
 *
 * Disproof & Bulletproofing: While centralizing is good, personalization becomes "bulletproof" when it moves from static preferences to *adaptive preferences*. The initial claim implies a fixed profile. To go deeper, the profile must *learn* from the user's observed behavior and adaptation outcomes. For example, 'sensitivityToErrors' or 'preferenceForGuidance' should subtly adjust based on whether previous adaptations were effective. CognitiveReserveEstimation is a step in this direction, inferring resilience, not just explicitly setting it. Privacy controls are essential for trust, making personalization ethically bulletproof.
 */
export class UserProfileService {
  private static instance: UserProfileService;
  private currentPreferences: UserPreferences = {
    preferredUiMode: 'standard',
    cognitiveLoadThresholds: {
      high: 0.6,
      low: 0.4,
      critical: 0.8,
      criticalLow: 0.7,
      guided: 0.75,
      guidedLow: 0.65,
      crisis: 0.9,
      recovery: 0.55,
      adaptiveHigh: 0.6, // Initial values, subject to adaptation
      adaptiveLow: 0.4,
      adaptiveCritical: 0.8,
    },
    adaptationPolicySelection: {}, // Default empty, managed by AdaptationPolicyManager
    personalizedBaselineCLS: 0.1, // Default baseline
    sensitivityToErrors: 0.7,
    preferenceForGuidance: 0.8,
    a_b_test_group: 'control', // Default
    cognitiveReserveEstimation: 0.5, // Default average
    explicitFeedbackHistory: [],
    privacySettings: {
      telemetryEnabled: true,
      gazeTrackingEnabled: false,
      biosignalTrackingEnabled: false,
      dataRetentionDays: 30,
    }
  };

  private listeners: Set<(prefs: UserPreferences) => void> = new Set();

  private constructor() {
    // Load from localStorage or backend in a real app
    const storedPrefs = localStorage.getItem('userCognitiveLoadPrefs');
    if (storedPrefs) {
      try {
        this.currentPreferences = { ...this.currentPreferences, ...JSON.parse(storedPrefs) };
      } catch (e) {
        console.error("Failed to parse user preferences from localStorage:", e);
        // Fallback to default preferences
      }
    }
  }

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  public getPreferences(): UserPreferences {
    return { ...this.currentPreferences };
  }

  public updatePreferences(newPrefs: Partial<UserPreferences>): void {
    this.currentPreferences = { ...this.currentPreferences, ...newPrefs };
    localStorage.setItem('userCognitiveLoadPrefs', JSON.stringify(this.currentPreferences));
    this.listeners.forEach(listener => listener(this.currentPreferences));
    console.log("User preferences updated:", newPrefs);
  }

  public addExplicitFeedback(feedback: Omit<UserPreferences['explicitFeedbackHistory'][number], 'timestamp'>): void {
    const newFeedback = { ...feedback, timestamp: performance.now() };
    this.currentPreferences.explicitFeedbackHistory.push(newFeedback);
    // Keep history limited to prevent memory bloat, maybe last 100 feedback entries
    if (this.currentPreferences.explicitFeedbackHistory.length > 100) {
      this.currentPreferences.explicitFeedbackHistory.shift();
    }
    this.updatePreferences({}); // Persist and notify listeners
  }

  public subscribe(listener: (prefs: UserPreferences) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentPreferences); // Notify immediately with current preferences
    return () => this.listeners.delete(listener);
  }

  public async loadPreferencesFromServer(userId: string): Promise<void> {
    // Mock API call
    console.log(`Fetching preferences for user ${userId} from server...`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const serverPrefs: Partial<UserPreferences> = {
      a_b_test_group: Math.random() > 0.5 ? 'experiment-A' : 'experiment-B',
      personalizedBaselineCLS: Math.random() * 0.2 + 0.05, // Random baseline
      cognitiveReserveEstimation: Math.random() * 0.4 + 0.3, // Random reserve
    };
    this.updatePreferences(serverPrefs);
    console.log("Preferences loaded from server:", serverPrefs);
  }
}

// --- Task Context Manager ---
export type TaskContext = {
  id: string;
  name: string;
  complexity: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high' | 'immediate'; // New: Task urgency
  timestamp: number;
  durationEstimateMs?: number; // Estimated time to complete task
  progressPercentage?: number; // Task progress
  associatedElements?: string[]; // IDs of UI elements relevant to this task
  taskGoal?: string; // What the user is trying to achieve
  subtasks?: string[]; // Breakdown of larger tasks
};

/**
 * Mermaid Diagram 1: Task Context State Machine
 * Illustrates the lifecycle of a task and how its state transitions are managed.
 */
export const TASK_CONTEXT_STATE_MACHINE_MERMAID = `
graph LR
    A[Idle] --> B{Task Initiated / Detected};
    B --> C[Active Task]
    C --> D{Task Update (Progress/Complexity/Urgency/Implicit Cues)};
    D --> C;
    C --> E{Task Completion};
    C --> F{Task Abandoned/Error/Interrupted};
    E --> A;
    F --> A;
    subgraph Task Attributes
        C -- id, name, complexity, urgency --> C;
        C -- durationEstimateMs, progressPercentage, associatedElements --> C;
        C -- taskGoal, subtasks --> C;
    end
`;

export class TaskContextManager {
  private static instance: TaskContextManager;
  private currentTask: TaskContext | null = null;
  private listeners: Set<(task: TaskContext | null) => void> = new Set();
  private taskHistory: TaskContext[] = []; // Track recently completed tasks
  private maxTaskHistoryLength: number = 10;
  private implicitTaskDetectionInterval: ReturnType<typeof setInterval> | null = null;
  private userProfileService = UserProfileService.getInstance(); // For adapting to user's task patterns

  private constructor() {
    // Initialize with a default or infer from URL
    this.setTask({ id: 'app_init', name: 'Application Initialization', complexity: 'low', urgency: 'low', timestamp: performance.now() });
    this.startImplicitTaskDetection();
  }

  public static getInstance(): TaskContextManager {
    if (!TaskContextManager.instance) {
      TaskContextManager.instance = new TaskContextManager();
    }
    return TaskContextManager.instance;
  }

  /**
   * Claim 2: Proactive Task Adaptation.
   * "The TaskContextManager plays a crucial role in proactive adaptation by providing contextual information (e.g., complexity, urgency) to the CognitiveLoadEngine, allowing the UI to prepare for anticipated load changes rather than solely reacting to observed user behavior."
   *
   * Disproof & Bulletproofing: The original claim focuses on *provided* contextual info. To be truly "bulletproof" and "deeper," the TaskContextManager must also *infer* tasks implicitly, handle interruptions, and potentially learn user-specific task patterns. The challenge is in moving from explicit `setTask` calls to an intelligent, self-aware understanding of user goals. Introducing `implicitTaskDetection` is a step towards this, even if currently mocked.
   */
  public setTask(task: TaskContext | null, isImplicit: boolean = false): void {
    if (task && this.currentTask && task.id === this.currentTask.id) {
      // If the task ID is the same, just update attributes if they changed
      if (JSON.stringify(task) !== JSON.stringify(this.currentTask)) {
        this.currentTask = { ...this.currentTask, ...task, timestamp: performance.now() }; // Update timestamp for 'time in task'
        this.listeners.forEach(listener => listener(this.currentTask));
        console.log(`TaskContextManager: Task attributes updated for ${task?.name || 'N/A'}`);
      }
      return;
    }

    // New task or clearing task
    if (this.currentTask) {
      // Before setting a new task, "complete" the old one for history
      this.taskHistory.push({ ...this.currentTask, progressPercentage: this.currentTask.progressPercentage || 100, timestamp: performance.now() });
      if (this.taskHistory.length > this.maxTaskHistoryLength) {
        this.taskHistory.shift();
      }
    }
    this.currentTask = task;
    this.listeners.forEach(listener => listener(this.currentTask));
    console.log(`TaskContextManager: Current task set to ${task?.name || 'N/A'} (Complexity: ${task?.complexity || 'N/A'}, Urgency: ${task?.urgency || 'N/A'}) ${isImplicit ? '[Implicit]' : ''}`);
  }

  public getCurrentTask(): TaskContext | null {
    return this.currentTask;
  }

  public getTaskHistory(): TaskContext[] {
    return [...this.taskHistory];
  }

  public subscribe(listener: (task: TaskContext | null) => void): () => void {
    this.listeners.add(listener);
    // Immediately notify with current task on subscription
    listener(this.currentTask);
    return () => this.listeners.delete(listener);
  }

  private startImplicitTaskDetection(): void {
    // Mock implicit task detection based on URL changes or common interaction patterns
    this.implicitTaskDetectionInterval = setInterval(() => {
      const currentPath = window.location.pathname;
      let inferredTask: TaskContext | null = null;

      if (currentPath.includes('/settings')) {
        inferredTask = { id: 'navigate_settings', name: 'Navigate Settings', complexity: 'medium', urgency: 'low', timestamp: performance.now() };
      } else if (currentPath.includes('/payment') || currentPath.includes('/checkout')) {
        inferredTask = { id: 'complete_payment', name: 'Complete Payment', complexity: 'critical', urgency: 'immediate', timestamp: performance.now() };
      } else if (currentPath.includes('/dashboard')) {
        inferredTask = { id: 'review_dashboard', name: 'Review Dashboard', complexity: 'low', urgency: 'low', timestamp: performance.now() };
      }

      if (inferredTask && (this.currentTask?.id !== inferredTask.id)) {
        this.setTask(inferredTask, true);
      } else if (!inferredTask && this.currentTask && this.currentTask.id !== 'app_init') {
        // If no explicit task, revert to generic browsing/idle
        if (this.currentTask.id !== 'generic_browsing') {
          this.setTask({ id: 'generic_browsing', name: 'Generic Browsing', complexity: 'low', urgency: 'low', timestamp: performance.now() }, true);
        }
      }
    }, 5000); // Check every 5 seconds
  }

  public stop(): void {
    if (this.implicitTaskDetectionInterval) {
      clearInterval(this.implicitTaskDetectionInterval);
    }
  }
}

// --- Interaction Error Logger ---
export interface InteractionError {
  id: string;
  type: 'validation' | 'repeatedAction' | 'navigation' | 'apiError' | 'clientRuntime' | 'businessLogic' | 'systemFallback'; // Added clientRuntime, businessLogic, systemFallback for internal errors
  elementId?: string;
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical'; // New: error severity
  errorCode?: string; // New: specific error code
  contextPath?: string; // New: where the error occurred in the UI flow
  callStack?: string; // New: For clientRuntime errors
  relatedTelemetryEventIds?: string[]; // New: Link to raw telemetry events that might have caused it
}

export class InteractionErrorLogger {
  private static instance: InteractionErrorLogger;
  private errorsBuffer: InteractionError[] = [];
  private listeners: Set<(errors: InteractionError[]) => void> = new Set();
  private readonly bufferFlushRateMs: number = 1000;
  private bufferFlushInterval: ReturnType<typeof setInterval> | null = null;
  private maxBufferSize: number = 50; // To prevent memory overflow for errors
  private lastLoggedErrorTimestamp: number = 0;

  private constructor() {
    this.bufferFlushInterval = setInterval(this.flushBuffer, this.bufferFlushRateMs);
  }

  public static getInstance(): InteractionErrorLogger {
    if (!InteractionErrorLogger.instance) {
      InteractionErrorLogger.instance = new InteractionErrorLogger();
    }
    return InteractionErrorLogger.instance;
  }

  public logError(error: Omit<InteractionError, 'id' | 'timestamp'>): void {
    const newError: InteractionError = {
      id: `error-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: performance.now(),
      ...error,
    };
    this.errorsBuffer.push(newError);
    if (this.errorsBuffer.length > this.maxBufferSize) {
      this.errorsBuffer.shift(); // Remove oldest error if buffer is full
    }
    this.lastLoggedErrorTimestamp = newError.timestamp;
    console.warn(`InteractionErrorLogger: Logged error - ${newError.message} (Type: ${newError.type}, Severity: ${newError.severity})`);
    this.listeners.forEach(listener => listener([...this.errorsBuffer])); // Notify immediately for new errors
  }

  public getLastLoggedErrorTimestamp(): number {
    return this.lastLoggedErrorTimestamp;
  }

  private flushBuffer = (): void => {
    // Listeners are notified immediately on logError, so this flush can be simplified
    // or used for batching to a backend service. For current use case, immediate notification is sufficient.
    // However, keeping this for potential future backend integration.
    // If listeners only care about *new* errors, the above listener notification is key.
    // If listeners care about *all* errors in a window, they'd poll or receive the full buffer.
    // For now, no-op for internal listeners as they get notified directly on logError.
  };

  public subscribe(listener: (errors: InteractionError[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public stop(): void {
    if (this.bufferFlushInterval) {
      clearInterval(this.bufferFlushInterval);
    }
  }
}

/**
 * Exported Constant for Mouse Kinematics Equations.
 * Equation 1-10: Detailed Mouse Kinematics Calculations.
 */
export const MOUSE_KINEMATICS_EQUATIONS = `
// 1. Instantaneous Velocity (Euclidean Distance / Time Delta)
// V_i = sqrt((x_i - x_{i-1})^2 + (y_i - y_{i-1})^2) / (t_i - t_{i-1})
//
// 2. Average Velocity over N events:
// V_avg = (1/N) * sum(V_i) for i=1 to N
//
// 3. Instantaneous Acceleration:
// A_i = (V_i - V_{i-1}) / (t_i - t_{i-1})
//
// 4. Average Acceleration over N events:
// A_avg = (1/N) * sum(A_i) for i=1 to N
//
// 5. Path Tortuosity (Normalized path length):
// Tortuosity = (Sum of segment lengths) / (Straight-line distance from start to end)
// Segment Length L_i = sqrt((x_i - x_{i-1})^2 + (y_i - y_{i-1})^2)
// Straight Line Distance S_total = sqrt((x_N - x_0)^2 + (y_N - y_0)^2)
// Tortuosity Index = (sum(L_i)) / S_total  (where sum(L_i) is total path length)
//
// 6. Fitts's Law Index of Performance (IP) for a target:
// IP = log2(2A/W) / MT
// Where: A = Amplitude (distance to target center)
//        W = Width of target (or smaller dimension of target bounding box)
//        MT = Movement Time (time taken to acquire target)
// We estimate MT as time from mouse movement initiation to click.
//
// 7. Mouse Smoothness Index (MSI - simplified proxy):
// MSI = 1 - (sum(abs(A_i))) / (sum(V_i) * Max_Accel_Scale)
// A proxy for how jerky mouse movements are. Lower sum of absolute accelerations means smoother.
// Max_Accel_Scale is a normalization factor.
//
// 8. Total Mouse Travel Distance:
// D_total = sum(L_i) for i=1 to N
//
// 9. Dwell Time Estimation (over a UI element, requires element tracking):
// D_dwell_avg = (1/M) * sum(D_element_j) for j=1 to M elements
// This requires \`MouseEventData.targetId\` and \`MouseEventData.hoverDuration\`.
//
// 10. Mouse Activity Ratio:
// MAR = (Number of mousemove events) / (Window Duration in ms)
//
// 11. Mouse Idle Time Ratio:
// MIR = 1 - (Total time with mouse movement > threshold) / (Window Duration)
`;

/**
 * Exported Constant for Keyboard Dynamics Equations.
 * Equation 12-21: Keyboard Typing and Error Dynamics.
 */
export const KEYBOARD_DYNAMICS_EQUATIONS = `
// 12. Typing Speed (Words Per Minute):
// WPM = (Total characters / 5) / (Window Duration in minutes)
//
// 13. Keystroke Latency (Time between keydowns):
// KL_avg = (1 / (N-1)) * sum(t_i - t_{i-1}) for i=1 to N (non-modifier keys)
//
// 14. Backspace Frequency:
// BF = (Number of backspace keydowns) / (Window Duration in seconds)
//
// 15. Error Correction Rate:
// ECR = (Number of backspace keydowns) / (Number of non-modifier keydowns)
//
// 16. Typing Burst Rate:
// TBR = (Number of typing bursts) / (Window Duration in seconds)
// A burst is a sequence of keydowns with inter-key latency < 200ms.
//
// 17. Modifier Key Usage Ratio:
// MKUR = (Number of modifier keydowns) / (Total keydowns)
//
// 18. Pause Before Typing (Post-idle):
// PBT_avg = (1/K) * sum(Idle_Time_Before_First_Key_k)
//
// 19. Typing Rhythm Irregularity (Standard Deviation of Keystroke Latencies):
// TRI = stddev(t_i - t_{i-1}) for non-modifier keys
//
// 20. Repeated Keystroke Frequency (e.g., holding a key):
// RKF = (Number of keydown events with 'repeat' flag) / (Window Duration in seconds)
//
// 21. Character Delete Ratio (using backspace or delete key):
// CDR = (Number of delete-like keydowns) / (Total non-modifier keydowns)
`;

/**
 * Exported Constant for Gaze Tracking Equations (Mock).
 * Equation 22-31: Gaze Dynamics and Biometric Indicators.
 */
export const GAZE_TRACKING_EQUATIONS = `
// 22. Gaze Fixation Count:
// Fixations = Count of stable gaze points within a defined radius (e.g., 50px) for > 100ms
//
// 23. Fixation Frequency:
// FF = Fixations / (Window Duration in seconds)
//
// 24. Saccade Velocity:
// SV_i = distance(Gaze_i, Gaze_{i-1}) / (t_i - t_{i-1}) during saccade (non-fixation)
// SV_avg = (1/N) * sum(SV_i)
//
// 25. Average Pupil Dilation:
// PD_avg = (1/N) * sum(Pupil_Dilation_i)
//
// 26. Gaze Deviation from Target:
// GD_avg = (1/M) * sum(Euclidean_Distance(Gaze_point, Target_Center)) for M gaze points on target.
//
// 27. Gaze Path Length:
// GPL = sum(Euclidean_Distance(Gaze_i, Gaze_{i-1}))
//
// 28. Scan Path Area:
// SPA = Area of convex hull of gaze points within a window (requires computational geometry).
//
// 29. Gaze Entropy (mock):
// Ge = -sum(P_i * log(P_i)) where P_i is probability of gaze in region i.
//
// 30. Blink Rate:
// BR = Number of blinks / (Window Duration in seconds) (requires external blink detection)
//
// 31. Gaze Stability Index:
// GSI = 1 / (stddev(gaze_x) + stddev(gaze_y))
`;

/**
 * Exported Constant for Biosignal Equations (Mock).
 * Equation 32-36: Physiological Indicators of Cognitive State.
 */
export const BIOSIGNAL_EQUATIONS = `
// 32. Heart Rate (HR) Average:
// HR_avg = (1/N) * sum(HR_i)
//
// 33. Heart Rate Variability (HRV) - SDNN (Standard Deviation of NN intervals):
// HRV_SDNN = stddev(time between successive heartbeats)
//
// 33. Skin Conductance (SC) Average:
// SC_avg = (1/N) * sum(SC_i) (higher indicates arousal/stress)
//
// 34. EEG Alpha Power Ratio:
// Alpha_ratio = (Alpha_Band_Power) / (Total_EEG_Power) (higher indicates relaxed/idle state)
//
// 35. EEG Theta Power Ratio:
// Theta_ratio = (Theta_Band_Power) / (Total_EEG_Power) (higher indicates cognitive load/memory encoding)
`;


/**
 * Exported Constant for Scroll Dynamics Equations.
 * Equation 37-46: Scroll Behavior Analytics.
 */
export const SCROLL_DYNAMICS_EQUATIONS = `
// 37. Scroll Velocity (Vertical):
// SV_v = abs(ScrollY_i - ScrollY_{i-1}) / (t_i - t_{i-1})
// SV_avg = (1/N) * sum(SV_v_i)
//
// 38. Scroll Acceleration:
// SA_i = (SV_v_i - SV_v_{i-1}) / (t_i - t_{i-1})
// SA_avg = (1/N) * sum(SA_i)
//
// 39. Scroll Jerk (Rate of change of acceleration):
// SJ_i = (SA_i - SA_{i-1}) / (t_i - t_{i-1})
// SJ_avg = (1/N) * sum(SJ_i)
//
// 40. Scroll Direction Changes:
// SDC = Count of (direction_i != direction_{i-1})
//
// 41. Scroll Pause Frequency:
// SPF = Number of pauses (deltaY=0 for > threshold) / (Window Duration in seconds)
//
// 42. Scroll Depth Ratio:
// SDR = (Max ScrollY reached) / (Document Height - Viewport Height)
//
// 43. Scroll Coverage Ratio:
// SCR = (Unique scrolled pixels range) / (Document Height - Viewport Height)
//
// 44. Page Scroll Rate (Time to scroll full page):
// PSR = (Document Height - Viewport Height) / SV_avg (if continuously scrolling)
//
// 45. Scroll Event Density:
// SED = Number of scroll events / (Window Duration in seconds)
//
// 46. Bidirectional Scroll Index:
// BSI = (Number of up scrolls > threshold) / (Number of total scrolls > threshold)
`;

/**
 * Exported Constant for Interaction Error Metrics Equations.
 * Equation 47-56: Error Quantification and Severity.
 */
export const INTERACTION_ERROR_EQUATIONS = `
// 47. Form Validation Error Rate:
// FVER = (Number of form validation errors) / (Number of form input events)
//
// 48. Repeated Action Attempt Frequency:
// RAAF = (Number of repeated action attempts) / (Window Duration in seconds)
//
// 49. Navigation Error Ratio:
// NER = (Number of navigation errors) / (Number of click events on navigation elements)
//
// 50. API Error Impact Score (mock):
// API_EIS = sum(Severity_of_API_error * Weight_for_API_error)
//
// 51. Client Runtime Error Frequency:
// CREF = (Number of clientRuntime errors) / (Window Duration in seconds)
//
// 52. Error Burst Index:
// EBI = Number of error clusters (multiple errors within short time)
//
// 53. Time to Error Resolution:
// TTER_avg = (1/N) * sum(Time_between_error_occurrence_and_next_successful_action_on_same_element)
//
// 54. Severity Weighted Error Score:
// SWES = sum(Error_Severity_Value_i) / Max_Possible_Severity_Score_in_Window
//
// 55. Cognitive Friction Index (proxy using errors):
// CFI = (FVER * W_form + RAAF * W_repeat + NER * W_nav + CREF * W_client)
// W are weights for each error type.
//
// 56. Error-related Interaction Delta:
// EID = (Post-error event density) - (Pre-error event density)
`;

/**
 * Exported Constant for Task Context and Engagement Equations.
 * Equation 57-66: Task Dynamics and User Engagement.
 */
export const TASK_ENGAGEMENT_EQUATIONS = `
// 57. Task Complexity Score (normalized):
// TCS = f(Task_Complexity_enum) (e.g., low=0.2, medium=0.5, high=0.7, critical=0.9)
//
// 58. Time in Current Task:
// TCT = Current_Timestamp - Task_Start_Timestamp
//
// 59. Task Switch Frequency:
// TSF = Number of task changes / (Window Duration in seconds)
//
// 60. Task Progress Pace:
// TPP = (Current Progress Percentage) / TCT (normalized)
//
// 61. Active Interaction Ratio:
// AIR = (Sum of active interaction times) / (Window Duration)
// Active interaction time = time mouse/keyboard events occurred.
//
// 62. Idle Duration Frequency:
// IDF = Number of idle periods (> 2 sec without interaction) / (Window Duration in seconds)
//
// 63. Frustration Index Proxy:
// FIP = (Click_Frequency_High_Threshold) + (Backspace_Frequency_High_Threshold) + (Target_Acquisition_Error_High_Threshold)
//
// 64. User Retention Score (mock):
// URS = 1 - (Number of task abandonments) / (Number of task starts)
//
// 65. Task Completion Rate:
// TCR = (Number of tasks completed) / (Number of tasks started)
//
// 66. Cognitive Demand Fluctuation Index:
// CDFI = stddev(Cognitive_Load_History_Window)
`;

/**
 * Exported Constant for General Statistical and Utility Equations.
 * Equation 67-100: General Math, Normalization, and Predictive Model Components.
 */
export const GENERAL_MATH_AND_MODEL_EQUATIONS = `
// 67. Mean (Average):
// Î¼ = (1/N) * sum(x_i)
//
// 68. Variance:
// Ïƒ^2 = (1/N) * sum((x_i - Î¼)^2)
//
// 69. Standard Deviation:
// Ïƒ = sqrt(Ïƒ^2)
//
// 70. Min-Max Normalization:
// x_normalized = (x - min(x)) / (max(x) - min(x))
//
// 71. Z-Score Normalization:
// x_normalized = (x - Î¼) / Ïƒ
//
// 72. Exponential Moving Average (EMA):
// EMA_t = Î± * x_t + (1 - Î±) * EMA_{t-1}
// Where Î± = 2 / (N + 1) for N-period EMA
//
// 73. Weighted Average:
// WA = sum(w_i * x_i) / sum(w_i)
//
// 74. Sigmoid Activation Function (for feature scaling):
// Ïƒ(x) = 1 / (1 + e^(-x))
//
// 75. Hyperbolic Tangent (tanh) Activation Function:
// tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))
//
// 76. Euclidean Distance:
// d = sqrt((x2 - x1)^2 + (y2 - y1)^2)
//
// 77. Manhattan Distance:
// d = abs(x2 - x1) + abs(y2 - y1)
//
// 78. Cosine Similarity:
// cos(Î¸) = (A Â· B) / (||A|| ||B||)
//
// 79. Bayesian Probability (simplified for event P(A|B)):
// P(A|B) = P(B|A) * P(A) / P(B)
//
// 80. Fuzzy Membership Function (Triangular):
// Î¼(x) = (x - a) / (b - a)  if a <= x <= b
// Î¼(x) = (c - x) / (c - b)  if b <= x <= c
// Î¼(x) = 0 otherwise (a < b < c)
//
// 81. Fuzzy Membership Function (Trapezoidal):
// Similar to triangular, but with a flat top for a range.
//
// 82. Kalman Filter (simplified state prediction):
// x_k = F_k * x_{k-1} + B_k * u_k
// P_k = F_k * P_{k-1} * F_k^T + Q_k
// (Where x is state vector, P is covariance matrix, F is state transition, B is control input model, Q is process noise)
//
// 83. Load Threshold Adaptation (Simple Exponential Decay):
// Threshold_next = Threshold_current * e^(-k * time_since_last_adaptation)
//
// 84. Hysteresis Threshold Logic:
// If CL > Upper_Threshold and Mode = Low, then switch to High.
// If CL < Lower_Threshold and Mode = High, then switch to Low.
// Upper_Threshold > Lower_Threshold to prevent rapid switching.
//
// 85. Cumulative Sum (CUSUM) for change detection:
// C_t^+ = max(0, C_{t-1}^+ + x_t - Î¼_0 - K)
// C_t^- = min(0, C_{t-1}^- + x_t - Î¼_0 + K)
//
// 86. Logistic Regression Probability:
// P(Y=1|X) = 1 / (1 + e^(-(Î²0 + Î²1X1 + ... + Î²nXn)))
//
// 87. Entropy (Information Theory - simplified for a distribution):
// H(X) = - sum(p(x) log2 p(x))
//
// 88. Gini Impurity (for decision trees):
// G = 1 - sum(p_i^2)
//
// 89. Root Mean Square Error (RMSE):
// RMSE = sqrt((1/N) * sum((y_pred_i - y_true_i)^2))
//
// 90. R-squared (Coefficient of Determination):
// R^2 = 1 - (SS_res / SS_tot)
//
// 91. Mahalanobis Distance (for anomaly detection):
// D_M(x) = sqrt((x - Î¼)^T Î£^(-1) (x - Î¼))
//
// 92. Feature Importance Score (e.g., from a tree model):
// FIS_j = sum (gain from splits on feature j)
//
// 93. Inverse Distance Weighting:
// f(x) = sum(w_i * f_i) / sum(w_i) where w_i = 1 / d(x, x_i)^p
//
// 94. Moving Average Convergence Divergence (MACD) - time series analysis:
// MACD = EMA_short - EMA_long
// Signal Line = EMA_of_MACD
//
// 95. Perceived Difficulty Score (PDS) - A heuristic:
// PDS = (Error_Rate * W_error) + (Task_Complexity_Factor * W_task) + (Time_in_Task_Deviation * W_time)
//
// 96. Resource Demand Index (RDI) - based on interaction density:
// RDI = (Event_Density * W_event) + (Avg_Kinematic_Energy * W_energy)
//
// 97. Adaptive Weight Update (Gradient Descent principle for a single weight):
// w_new = w_old - Î· * dL/dw
//
// 98. Cognitive Dissonance Metric (CDM) - mock:
// CDM = (Observed_Load - Expected_Load)^2
//
// 99. Bayesian Information Criterion (BIC) for model selection:
// BIC = n * log(MSE) + k * log(n)
//
// 100. Akaike Information Criterion (AIC) for model selection:
// AIC = n * log(MSE) + 2k
//
// 101. Cross-Entropy Loss (for classification tasks):
// L = - sum(y_i * log(p_i) + (1 - y_i) * log(1 - p_i))
//
// 102. L1 Regularization (Lasso):
// Cost = Sum_of_Squares_Error + Î» * sum(abs(Î²_j))
//
// 103. L2 Regularization (Ridge):
// Cost = Sum_of_Squares_Error + Î» * sum(Î²_j^2)
//
// 104. Learning Rate Schedule (e.g., exponential decay):
// Î·_t = Î·_0 * e^(-k * t)
//
// 105. Prediction Confidence Score:
// Confidence = 1 - (Model_Variance / Max_Expected_Variance) (Or derived from ensemble methods)
`;


// --- Core Telemetry Agent ---
export class TelemetryAgent {
  private eventBuffer: RawTelemetryEvent[] = [];
  private bufferInterval: ReturnType<typeof setInterval> | null = null;
  private readonly bufferFlushRateMs: number = 200; // Flush data every 200ms
  private readonly featureProcessingCallback: (features: TelemetryFeatureVector) => void;
  private lastMouseCoord: { x: number; y: number; timestamp: number } | null = null;
  private lastScrollEvent: ScrollEventData | null = null;
  private clickTimestamps: number[] = [];
  private keydownTimestamps: { key: string; timestamp: number; isModifier: boolean }[] = [];
  private formFieldFocusDurations: Map<string, { startTime: number; totalDuration: number; interactions: number; firstInputTime: number | null }> = new Map();
  private lastErrorCount: number = 0; // for error feature comparison

  private focusTimestamps: Map<string, number> = new Map(); // targetId -> focus timestamp
  private blurEventTimestamps: Map<string, number> = new Map(); // targetId -> blur timestamp

  private interactionErrorLogger = InteractionErrorLogger.getInstance();
  private taskContextManager = TaskContextManager.getInstance();
  private userProfileService = UserProfileService.getInstance(); // For privacy settings

  private mouseMovementsHistory: { x: number; y: number; timestamp: number }[] = [];
  private readonly mouseHistoryWindowMs = 1000; // Keep 1 second of mouse history for advanced features

  private lastTelemetryFlushTimestamp: number = performance.now(); // For idle time calculation

  constructor(featureProcessingCallback: (features: TelemetryFeatureVector) => void) {
    this.featureProcessingCallback = featureProcessingCallback;
    this.initListeners();
  }

  /**
   * Claim 3: Comprehensive Telemetry for Behavioral Insight.
   * "The TelemetryAgent captures a broad spectrum of raw user interaction events, providing a foundational data layer that is critical for deriving high-fidelity behavioral features. This comprehensive capture ensures that subtle cues of cognitive state are not missed."
   *
   * Disproof & Bulletproofing: "Comprehensive" is a strong claim. Bulletproofing it means not only adding more sensor data (biosignals, deeper keyboard/mouse metrics), but also ensuring data integrity, addressing privacy, and providing *semantic meaning* to raw events. Capturing instantaneous velocity/acceleration directly in event data, and including event IDs for error correlation, makes the data more robust. Privacy settings from UserProfileService become critical here.
   */
  private initListeners(): void {
    const prefs = this.userProfileService.getPreferences().privacySettings;
    if (!prefs.telemetryEnabled) {
      console.warn("TelemetryAgent: User has disabled telemetry. No events will be tracked.");
      return;
    }

    window.addEventListener('mousemove', this.handleMouseMoveEvent, { passive: true });
    window.addEventListener('click', this.handleClickEvent, { passive: true });
    window.addEventListener('scroll', this.handleScrollEvent, { passive: true });
    window.addEventListener('keydown', this.handleKeyboardEvent, { passive: true });
    window.addEventListener('keyup', this.handleKeyboardEvent, { passive: true });
    window.addEventListener('focusin', this.handleFocusBlurEvent, { passive: true });
    window.addEventListener('focusout', this.handleFocusBlurEvent, { passive: true });
    window.addEventListener('input', this.handleFormEvent, { passive: true });
    window.addEventListener('change', this.handleFormEvent, { passive: true });
    window.addEventListener('submit', this.handleFormEvent, { passive: true }); // Captures form submission

    if (prefs.gazeTrackingEnabled) {
      // window.addEventListener('gaze', this.handleGazeEvent, { passive: true }); // Mock Gaze, would need specialized hardware/lib
      console.log("TelemetryAgent: Mock Gaze tracking enabled.");
    }
    if (prefs.biosignalTrackingEnabled) {
      // this.startMockBiosignalGeneration(); // Start generating mock biosignal events
      console.log("TelemetryAgent: Mock Biosignal tracking enabled.");
    }

    this.bufferInterval = setInterval(this.flushBuffer, this.bufferFlushRateMs);
  }

  private addEvent = (event: RawTelemetryEvent): void => {
    // Only add event if telemetry is enabled
    if (this.userProfileService.getPreferences().privacySettings.telemetryEnabled) {
      this.eventBuffer.push(event);
    }
  };

  private handleMouseMoveEvent = (event: MouseEvent): void => {
    const timestamp = performance.now();
    let velocity = 0;
    let acceleration = 0;

    if (this.lastMouseCoord) {
      const dx = event.clientX - this.lastMouseCoord.x;
      const dy = event.clientY - this.lastMouseCoord.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const timeDelta = timestamp - this.lastMouseCoord.timestamp;
      if (timeDelta > 0) {
        velocity = distance / timeDelta;
        // Mock acceleration calculation, requires more history
        acceleration = (velocity - (this.lastMouseCoord as any).mouseVelocity || 0) / timeDelta;
      }
    }

    const data: MouseEventData = {
      x: event.clientX,
      y: event.clientY,
      button: event.button,
      targetId: (event.target as HTMLElement)?.id || '',
      timestamp,
      pressure: 0.5, // Mock pressure data
      mouseVelocity: velocity,
      mouseAcceleration: acceleration,
    };
    this.addEvent({ type: 'mousemove', data });

    this.mouseMovementsHistory.push({ x: event.clientX, y: event.clientY, timestamp });
    // Keep history window limited
    while (this.mouseMovementsHistory.length > 0 && this.mouseMovementsHistory[0].timestamp < timestamp - this.mouseHistoryWindowMs) {
      this.mouseMovementsHistory.shift();
    }
    this.lastMouseCoord = { ...data }; // Update lastMouseCoord with current data
  };

  private handleClickEvent = (event: MouseEvent): void => {
    const timestamp = performance.now();
    const targetElement = event.target as HTMLElement;
    const data: MouseEventData = {
      x: event.clientX,
      y: event.clientY,
      button: event.button,
      targetId: targetElement?.id || '',
      timestamp,
      targetBoundingRect: targetElement?.getBoundingClientRect ? new DOMRectReadOnly(targetElement.getBoundingClientRect().x, targetElement.getBoundingClientRect().y, targetElement.getBoundingClientRect().width, targetElement.getBoundingClientRect().height) : undefined,
      pressure: 1.0, // Mock click pressure
    };
    this.addEvent({ type: 'click', data });
    this.clickTimestamps.push(timestamp);
  };

  private handleScrollEvent = (event: Event): void => {
    const timestamp = performance.now();
    const scrollDeltaY = this.lastScrollEvent ? window.scrollY - this.lastScrollEvent.scrollY : 0;
    const timeDelta = this.lastScrollEvent ? timestamp - this.lastScrollEvent.timestamp : 0;
    const scrollVelocity = timeDelta > 0 ? Math.abs(scrollDeltaY) / timeDelta : 0;
    const scrollDirection = scrollDeltaY > 0 ? 'down' : scrollDeltaY < 0 ? 'up' : 'none';

    const data: ScrollEventData = {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      timestamp,
      scrollDeltaY,
      scrollVelocity,
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      scrollDirection,
    };
    this.addEvent({ type: 'scroll', data });
    this.lastScrollEvent = data;
  };

  private keydownTimestampsMap: Map<string, number> = new Map(); // Track keydown for duration calc
  private handleKeyboardEvent = (event: KeyboardEvent): void => {
    const timestamp = performance.now();
    const isModifier = event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;

    let keystrokeDuration: number | undefined = undefined;
    if (event.type === 'keyup') {
      const downTime = this.keydownTimestampsMap.get(event.code);
      if (downTime) {
        keystrokeDuration = timestamp - downTime;
        this.keydownTimestampsMap.delete(event.code);
      }
    } else if (event.type === 'keydown') {
      this.keydownTimestampsMap.set(event.code, timestamp);
    }

    const data: KeyboardEventData = {
      key: event.key,
      code: event.code,
      timestamp,
      isModifier,
      repeat: event.repeat,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      keystrokeDuration,
    };

    this.addEvent({ type: event.type === 'keydown' ? 'keydown' : 'keyup', data });
    if (event.type === 'keydown') {
      this.keydownTimestamps.push({ key: event.key, timestamp, isModifier });
    }
  };

  private handleFocusBlurEvent = (event: FocusEvent): void => {
    const timestamp = performance.now();
    const targetId = (event.target as HTMLElement)?.id;
    if (!targetId) return;

    if (event.type === 'focusin') {
      this.focusTimestamps.set(targetId, timestamp);
      // For form fields, track interaction duration and first input latency
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
        this.formFieldFocusDurations.set(targetId, {
          startTime: timestamp,
          totalDuration: 0,
          interactions: 0,
          firstInputTime: null,
        });
      }
    } else { // focusout
      const focusStartTime = this.focusTimestamps.get(targetId);
      let durationMs: number | undefined = undefined;
      if (focusStartTime) {
        durationMs = timestamp - focusStartTime;
        this.focusTimestamps.delete(targetId);
      }
      const focusLatencyMs = this.blurEventTimestamps.has(targetId) ? timestamp - this.blurEventTimestamps.get(targetId)! : undefined;
      this.blurEventTimestamps.set(targetId, timestamp); // Record blur for potential re-focus latency

      // For form fields, update total duration
      const formStats = this.formFieldFocusDurations.get(targetId);
      if (formStats) {
        formStats.totalDuration += (timestamp - formStats.startTime);
        this.formFieldFocusDurations.set(targetId, { ...formStats, startTime: timestamp }); // Update start time if re-focused later
      }

      this.addEvent({
        type: 'blur',
        data: {
          type: 'blur',
          targetId: targetId,
          timestamp,
          durationMs,
          interactionCount: formStats?.interactions, // Capture interactions for focused form field
          focusLatencyMs,
        },
      });
    }

    this.addEvent({
      type: event.type === 'focusin' ? 'focus' : 'blur',
      data: {
        type: event.type === 'focusin' ? 'focus' : 'blur',
        targetId: targetId || '',
        timestamp,
        durationMs: event.type === 'focusin' ? undefined : timestamp - (this.focusTimestamps.get(targetId) || timestamp),
      },
    });
  };

  private handleFormEvent = (event: Event): void => {
    const timestamp = performance.now();
    const targetElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFormElement;
    const type = event.type === 'submit' ? 'submit' : event.type === 'input' ? 'input' : event.type === 'change' ? 'change' : 'validation_attempt'; // Assuming other form events map

    const targetId = targetElement?.id || targetElement?.name || '';
    let inputLatencyMs: number | undefined = undefined;

    if (targetId) {
      const formStats = this.formFieldFocusDurations.get(targetId);
      if (formStats) {
        formStats.interactions++; // Increment interaction count
        // Record first input time if not already set
        if (formStats.firstInputTime === null && (type === 'input' || type === 'change')) {
          formStats.firstInputTime = timestamp;
          inputLatencyMs = timestamp - formStats.startTime;
        }
        this.formFieldFocusDurations.set(targetId, formStats);
      }
    }

    let isValid: boolean | undefined = undefined;
    let validationMessage: string | undefined = undefined;
    if ('checkValidity' in targetElement && typeof targetElement.checkValidity === 'function') {
      isValid = targetElement.checkValidity();
      validationMessage = targetElement.validationMessage;
      if (!isValid && (type === 'change' || type === 'submit')) {
        this.interactionErrorLogger.logError({
          type: 'validation',
          elementId: targetId,
          message: `Form field validation failed: ${validationMessage}`,
          severity: 'medium',
          errorCode: 'FORM_VALIDATION_ERROR',
          contextPath: window.location.pathname,
        });
      }
    }

    this.addEvent({
      type: 'form',
      data: {
        type: type,
        targetId: targetId,
        value: 'value' in targetElement ? String(targetElement.value) : undefined,
        timestamp,
        isValid,
        validationMessage,
        inputLatencyMs,
      },
    });
  };

  // Mock Gaze Event Handler
  // private handleGazeEvent = (event: CustomEvent<{ x: number; y: number; pupilDilation: number; gazeStability: number }>): void => {
  //   const timestamp = performance.now();
  //   const { x, y, pupilDilation, gazeStability } = event.detail;
  //   // Determine targetElementId based on x, y coordinates
  //   const targetElement = document.elementFromPoint(x, y);
  //   this.addEvent({
  //     type: 'gaze',
  //     data: {
  //       x, y, timestamp,
  //       targetElementId: targetElement?.id || '',
  //       pupilDilation,
  //       gazeStability,
  //       saccadeVelocity: Math.random() * 100, // Mock
  //       fixationDuration: Math.random() * 500, // Mock
  //     }
  //   });
  // };

  // private mockBiosignalGenerationInterval: ReturnType<typeof setInterval> | null = null;
  // private startMockBiosignalGeneration = () => {
  //   this.mockBiosignalGenerationInterval = setInterval(() => {
  //     const timestamp = performance.now();
  //     // Simulate stress/load correlation
  //     const currentLoadProxy = Math.random(); // In a real system, this would come from CLS
  //     this.addEvent({ type: 'biosignal', data: { type: 'heart_rate', value: 60 + currentLoadProxy * 30, timestamp, unit: 'bpm' } });
  //     this.addEvent({ type: 'biosignal', data: { type: 'skin_conductance', value: 0.1 + currentLoadProxy * 0.5, timestamp, unit: 'µS' } });
  //     this.addEvent({ type: 'biosignal', data: { type: 'eeg_alpha', value: 0.8 - currentLoadProxy * 0.4, timestamp, unit: 'ratio' } });
  //     this.addEvent({ type: 'biosignal', data: { type: 'eeg_theta', value: 0.2 + currentLoadProxy * 0.3, timestamp, unit: 'ratio' } });
  //   }, 1000); // Generate mock biosignal every second
  // };

  private calculateMouseSmoothnessIndex(mouseMoveEvents: MouseEventData[]): number {
    if (mouseMoveEvents.length < 3) return 0;
    let totalAbsAcceleration = 0;
    let totalVelocity = 0;
    let prevVelocity = 0;

    for (let i = 1; i < mouseMoveEvents.length; i++) {
      const p1 = mouseMoveEvents[i - 1];
      const p2 = mouseMoveEvents[i];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const timeDelta = p2.timestamp - p1.timestamp;

      if (timeDelta > 0) {
        const velocity = distance / timeDelta;
        totalVelocity += velocity;
        const acceleration = (velocity - prevVelocity) / timeDelta;
        totalAbsAcceleration += Math.abs(acceleration);
        prevVelocity = velocity;
      }
    }

    // Simplified MSI: Inverse of average absolute acceleration, normalized
    // Eq. 7: Mouse Smoothness Index (MSI - simplified proxy)
    // MSI = 1 - (sum(abs(A_i))) / (sum(V_i) * Max_Accel_Scale)
    const avgAbsAcceleration = totalAbsAcceleration / (mouseMoveEvents.length - 2);
    const maxExpectedAcceleration = 2.0; // A heuristic max px/ms^2
    const smoothness = 1 - Math.min(1, avgAbsAcceleration / maxExpectedAcceleration); // Clamped between 0 and 1
    return smoothness;
  }

  private calculateMouseAcceleration(prevV: number, currentV: number, timeDelta: number): number {
    // Eq. 3: Instantaneous Acceleration
    return timeDelta > 0 ? (currentV - prevV) / timeDelta : 0;
  }

  private calculateMousePathTortuosity(events: MouseEventData[]): number {
    // Eq. 5: Path Tortuosity
    if (events.length < 2) return 0;
    let totalDistance = 0;
    for (let i = 1; i < events.length; i++) {
      const p1 = events[i - 1];
      const p2 = events[i];
      totalDistance += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)); // Eq. 1: Segment Length
    }
    const start = events[0];
    const end = events[events.length - 1];
    const straightLineDistance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)); // Eq. 76: Euclidean Distance

    return straightLineDistance > 0 ? totalDistance / straightLineDistance : 0; // Ratio > 1 indicates tortuosity
  }

  private calculateTargetAcquisitionError(clicks: MouseEventData[]): number {
    // Eq. 26: Gaze Deviation from Target (conceptually similar for clicks)
    let totalError = 0;
    let validClicks = 0;
    for (const click of clicks) {
      if (click.targetBoundingRect) {
        const rect = click.targetBoundingRect;
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        const error = Math.sqrt(Math.pow(click.x - centerX, 2) + Math.pow(click.y - centerY, 2)); // Eq. 76: Euclidean Distance
        totalError += error;
        validClicks++;
      }
    }
    return validClicks > 0 ? totalError / validClicks : 0;
  }

  private calculateMisclickRate(clicks: MouseEventData[]): number {
    let misclicks = 0;
    for (const click of clicks) {
      if (click.targetBoundingRect) {
        const rect = click.targetBoundingRect;
        // Check if click occurred *outside* the bounding box but near it (threshold of 5px for error margin)
        if (click.x < rect.x - 5 || click.x > rect.x + rect.width + 5 ||
            click.y < rect.y - 5 || click.y > rect.y + rect.height + 5) {
          misclicks++;
        }
      } else {
        // If no bounding rect, could be a click on non-interactive background, consider it a potential misclick if elementId is empty.
        if (!click.targetId) {
          misclicks++;
        }
      }
    }
    return clicks.length > 0 ? misclicks / clicks.length : 0;
  }


  private calculateFittsLawIP(clicks: MouseEventData[]): number {
    // Eq. 6: Fitts's Law Index of Performance (simplified)
    if (clicks.length < 2) return 0;
    let totalIP = 0;
    let validIPs = 0;

    for (let i = 1; i < clicks.length; i++) {
      const prevClick = clicks[i - 1];
      const currentClick = clicks[i];

      if (prevClick.targetBoundingRect && currentClick.targetBoundingRect) {
        const prevRect = prevClick.targetBoundingRect;
        const currentRect = currentClick.targetBoundingRect;

        // Amplitude (A): Distance between centers of previous target and current target
        const A = Math.sqrt(
          Math.pow((currentRect.x + currentRect.width / 2) - (prevRect.x + prevRect.width / 2), 2) +
          Math.pow((currentRect.y + currentRect.height / 2) - (prevRect.y + prevRect.height / 2), 2)
        );

        // Width (W): Width of the target being acquired (current target)
        const W = currentRect.width; // Using width, could be min(width, height)

        // Movement Time (MT): Time between the two clicks
        const MT = currentClick.timestamp - prevClick.timestamp;

        if (A > 0 && W > 0 && MT > 0) {
          const IP = Math.log2(2 * A / W) / (MT / 1000); // Convert MT to seconds for common IP units
          if (!isNaN(IP) && isFinite(IP)) {
            totalIP += IP;
            validIPs++;
          }
        }
      }
    }
    return validIPs > 0 ? totalIP / validIPs : 0;
  }

  private calculateTypingRhythmIrregularity(keydownEvents: KeyboardEventData[]): number {
    // Eq. 19: Typing Rhythm Irregularity
    const latencies: number[] = [];
    let lastNonModifierKeydown: number | null = null;
    for (const event of keydownEvents) {
      if (!event.isModifier) {
        if (lastNonModifierKeydown !== null) {
          latencies.push(event.timestamp - lastNonModifierKeydown);
        }
        lastNonModifierKeydown = event.timestamp;
      }
    }
    if (latencies.length < 2) return 0;
    const mean = latencies.reduce((sum, l) => sum + l, 0) / latencies.length; // Eq. 67
    const variance = latencies.reduce((sum, l) => sum + Math.pow(l - mean, 2), 0) / latencies.length; // Eq. 68
    return Math.sqrt(variance); // Eq. 69
  }

  private extractFeatures = (events: RawTelemetryEvent[], currentUiMode: UiMode): TelemetryFeatureVector => {
    const windowEnd = performance.now();
    const windowStart = this.lastTelemetryFlushTimestamp; // Use the actual start of this window
    const durationMs = windowEnd - windowStart;
    const durationSeconds = durationMs / 1000;
    this.lastTelemetryFlushTimestamp = windowEnd;

    let mouseMoveEvents: MouseEventData[] = [];
    let clickEvents: MouseEventData[] = [];
    let scrollEvents: ScrollEventData[] = [];
    let keydownEvents: KeyboardEventData[] = [];
    let keyupEvents: KeyboardEventData[] = [];
    let focusEvents: FocusBlurEventData[] = [];
    let blurEvents: FocusBlurEventData[] = [];
    let formEvents: FormEventData[] = [];
    let gazeEvents: GazeEventData[] = [];
    let biosignalEvents: BiosignalEventData[] = [];

    // Filter events for the current window and categorize
    for (const event of events) {
      // Event timestamp filtering is implicitly handled by `addEvent` pushing to buffer
      // and `flushBuffer` clearing. So `events` here already contains the window's data.
      switch (event.type) {
        case 'mousemove': mouseMoveEvents.push(event.data); break;
        case 'click': clickEvents.push(event.data); break;
        case 'scroll': scrollEvents.push(event.data); break;
        case 'keydown': keydownEvents.push(event.data); break;
        case 'keyup': keyupEvents.push(event.data); break;
        case 'focus': focusEvents.push(event.data); break;
        case 'blur': blurEvents.push(event.data); break;
        case 'form': formEvents.push(event.data); break;
        case 'gaze': gazeEvents.push(event.data); break;
        case 'biosignal': biosignalEvents.push(event.data); break;
      }
    }

    // --- Mouse Kinematics ---
    let totalMouseVelocity = 0;
    let totalMouseAcceleration = 0;
    let prevMouseVelocity = 0;
    let totalMouseTravelDistance = 0;
    let mouseActiveTime = 0; // Time with mouse movement
    if (mouseMoveEvents.length > 1) {
      for (let i = 1; i < mouseMoveEvents.length; i++) {
        const p1 = mouseMoveEvents[i - 1];
        const p2 = mouseMoveEvents[i];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        totalMouseTravelDistance += distance; // Eq. 8: Total Mouse Travel Distance
        const timeDelta = p2.timestamp - p1.timestamp;
        if (timeDelta > 0) {
          mouseActiveTime += timeDelta;
          const velocity = distance / timeDelta; // px/ms (Eq. 1: Instantaneous Velocity)
          totalMouseVelocity += velocity;
          totalMouseAcceleration += this.calculateMouseAcceleration(prevMouseVelocity, velocity, timeDelta); // Eq. 3: Instantaneous Acceleration
          prevMouseVelocity = velocity;
        }
      }
    }
    const mouseIdleTimeRatio = durationMs > 0 ? (durationMs - mouseActiveTime) / durationMs : 0; // Eq. 11

    // --- Click Dynamics ---
    let totalClickLatency = 0;
    let doubleClickCount = 0;
    let errorClickCount = 0; // Clicks associated with an immediate error
    let repeatedClickOnSameElementCount = 0;
    let lastClickTargetId: string | null = null;
    let lastClickTime: number = 0;

    if (clickEvents.length > 0) {
      for (let i = 0; i < clickEvents.length; i++) {
        const click = clickEvents[i];
        if (i > 0) {
          const latency = click.timestamp - clickEvents[i - 1].timestamp;
          totalClickLatency += latency; // Eq. 13: Keystroke Latency (applied to clicks)
          if (latency < 500 && click.targetId === clickEvents[i - 1].targetId) { // arbitrary threshold for potential double click on same element
            doubleClickCount++;
          }
        }
        // Check for immediate errors after click
        const errorsAfterClick = this.interactionErrorLogger.errorsBuffer.filter(e =>
          e.timestamp > click.timestamp && e.timestamp < click.timestamp + 200 // within 200ms after click
        );
        if (errorsAfterClick.length > 0) errorClickCount++;

        if (click.targetId === lastClickTargetId && click.timestamp - lastClickTime < 1000) { // Same element clicked within 1s
          repeatedClickOnSameElementCount++;
        }
        lastClickTargetId = click.targetId;
        lastClickTime = click.timestamp;
      }
    }
    let totalClickPressure = clickEvents.reduce((sum, c) => sum + (c.pressure || 0), 0);

    // --- Scroll Dynamics ---
    let totalScrollYDelta = 0;
    let scrollDirectionChanges = 0;
    let lastScrollDirection: 'up' | 'down' | 'none' = 'none';
    let scrollPauseCount = 0;
    let totalScrollJerk = 0;
    let prevScrollVelocity = 0;
    let prevScrollAcceleration = 0;
    let minScrollY = Number.MAX_VALUE;
    let maxScrollY = Number.MIN_VALUE;

    if (scrollEvents.length > 1) {
      for (let i = 1; i < scrollEvents.length; i++) {
        const s1 = scrollEvents[i - 1];
        const s2 = scrollEvents[i];
        const deltaY = s2.scrollY - s1.scrollY;
        const timeDelta = s2.timestamp - s1.timestamp;

        if (Math.abs(deltaY) > 0 && timeDelta > 0) {
          totalScrollYDelta += Math.abs(deltaY);
          minScrollY = Math.min(minScrollY, s2.scrollY);
          maxScrollY = Math.max(maxScrollY, s2.scrollY);

          const currentDirection = deltaY > 0 ? 'down' : 'up';
          if (lastScrollDirection !== 'none' && currentDirection !== lastScrollDirection) {
            scrollDirectionChanges++; // Eq. 40: Scroll Direction Changes
          }
          lastScrollDirection = currentDirection;

          const currentScrollVelocity = Math.abs(deltaY) / timeDelta; // px/ms (Eq. 37: Scroll Velocity)
          const currentScrollAcceleration = (currentScrollVelocity - prevScrollVelocity) / timeDelta; // Eq. 38: Scroll Acceleration
          const currentScrollJerk = (currentScrollAcceleration - prevScrollAcceleration) / timeDelta; // Eq. 39: Scroll Jerk
          totalScrollJerk += Math.abs(currentScrollJerk);

          prevScrollVelocity = currentScrollVelocity;
          prevScrollAcceleration = currentScrollAcceleration;
        } else if (Math.abs(deltaY) === 0 && timeDelta > 200) { // Consider a pause if no movement for > 200ms
          scrollPauseCount++; // Eq. 41: Scroll Pause Frequency
        }
      }
    }
    const documentScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepthMax = documentScrollHeight > 0 ? maxScrollY / documentScrollHeight : 0; // Eq. 42
    const scrollReversalRatio = scrollEvents.filter(s => s.scrollDirection === 'up').length / (scrollEvents.filter(s => s.scrollDirection !== 'none').length || 1); // Eq. 46 (Bidirectional Scroll Index)

    // --- Keyboard Dynamics ---
    let totalKeystrokeLatency = 0;
    let backspaceCount = 0;
    let wordCount = 0;
    let lastTypedWordTime: number = 0;
    let nonModifierKeydownCount = 0;
    let modifierKeydownCount = 0;
    let typingBursts = 0;
    let lastKeystrokeTime: number | null = null;
    let totalKeystrokeDuration = 0; // Sum of keydown-keyup times

    if (keydownEvents.length > 0) {
      for (let i = 0; i < keydownEvents.length; i++) {
        const keyEvent = keydownEvents[i];
        if (keyEvent.isModifier) {
          modifierKeydownCount++;
        } else {
          nonModifierKeydownCount++;
          if (lastKeystrokeTime !== null) {
            totalKeystrokeLatency += (keyEvent.timestamp - lastKeystrokeTime); // Eq. 13: Keystroke Latency
            if (keyEvent.timestamp - lastKeystrokeTime > 200) { // Burst ends
              typingBursts++;
            }
          } else {
            typingBursts++; // First key in a potential burst
          }

          if (keyEvent.key === 'Backspace') {
            backspaceCount++; // Eq. 14: Backspace Frequency
          } else if (keyEvent.key === ' ' && keyEvent.timestamp - lastTypedWordTime > 100) { // Debounce words
            wordCount++; // For WPM
            lastTypedWordTime = keyEvent.timestamp;
          }
          lastKeystrokeTime = keyEvent.timestamp;
        }
      }
    }
    // Aggregate keystroke durations from both keydown and keyup events
    keyupEvents.forEach(e => {
      if (e.keystrokeDuration) totalKeystrokeDuration += e.keystrokeDuration;
    });

    const errorCorrectionRate = nonModifierKeydownCount > 0 ? backspaceCount / nonModifierKeydownCount : 0; // Eq. 15: Error Correction Rate
    const typingRhythmIrregularity = this.calculateTypingRhythmIrregularity(keydownEvents); // Eq. 19

    // --- Focus Dynamics ---
    let refocusFrequency = 0;
    let elementDwellTimeSum = 0;
    let elementDwellCount = 0;
    let blurRate = 0;
    let totalFocusShiftDistance = 0; // Mock: average Euclidean distance between center of focused elements
    let lastFocusedElementRect: DOMRectReadOnly | null = null;

    focusEvents.forEach(f => {
      const blurTime = blurEvents.find(b => b.targetId === f.targetId && b.timestamp > f.timestamp)?.timestamp;
      if (blurTime) {
        elementDwellTimeSum += (blurTime - f.timestamp);
        elementDwellCount++;
      }
      // Consider a refocus if an element gets focus shortly after being blurred
      const lastBlur = this.blurEventTimestamps.get(f.targetId);
      if (lastBlur && f.timestamp - lastBlur < 500) { // Refocus within 500ms
        refocusFrequency++;
      }

      // Mock focus shift distance
      const currentFocusedElement = document.getElementById(f.targetId);
      const currentRect = currentFocusedElement?.getBoundingClientRect();
      if (lastFocusedElementRect && currentRect) {
        const prevCenterX = lastFocusedElementRect.x + lastFocusedElementRect.width / 2;
        const prevCenterY = lastFocusedElementRect.y + lastFocusedElementRect.height / 2;
        const currCenterX = currentRect.x + currentRect.width / 2;
        const currCenterY = currentRect.y + currentRect.height / 2;
        totalFocusShiftDistance += Math.sqrt(Math.pow(currCenterX - prevCenterX, 2) + Math.pow(currCenterY - prevCenterY, 2));
      }
      if (currentRect) lastFocusedElementRect = currentRect;
    });
    // Blur rate can be proxied by count of blur events / window duration.
    blurRate = blurEvents.length / durationSeconds;

    // --- Form Interaction Features ---
    let totalFormValidationErrors = formEvents.filter(e => e.type === 'form' && e.isValid === false).length;
    let formSubmissionCount = formEvents.filter(e => e.type === 'submit').length;
    let formAbandonmentCount = 0; // Hard to calculate purely from window events, needs form lifecycle tracking
    let totalFormFieldInteractionTime = 0;
    let uniqueFormFieldsInteracted = new Set<string>();
    let totalTimeToFirstInput = 0;
    let firstInputCount = 0;

    this.formFieldFocusDurations.forEach((stats, id) => {
      // If a field was still focused when window ended, add current duration
      const currentFocusStartTime = stats.startTime;
      const effectiveDuration = (this.focusTimestamps.has(id) && currentFocusStartTime > windowStart)
        ? stats.totalDuration + (windowEnd - currentFocusStartTime) : stats.totalDuration;
      totalFormFieldInteractionTime += effectiveDuration;
      if (effectiveDuration > 0) uniqueFormFieldsInteracted.add(id);

      if (stats.firstInputTime !== null) {
        totalTimeToFirstInput += (stats.firstInputTime - stats.startTime);
        firstInputCount++;
      }
    });
    const formInteractionTimeAvg = uniqueFormFieldsInteracted.size > 0 ? totalFormFieldInteractionTime / uniqueFormFieldsInteracted.size : 0;
    const timeToFirstInputAvg = firstInputCount > 0 ? totalTimeToFirstInput / firstInputCount : 0;


    // --- Interaction Errors (from IEL) ---
    const errorsInWindow = this.interactionErrorLogger.errorsBuffer.filter(err => err.timestamp >= windowStart);
    let formValidationErrors = errorsInWindow.filter(err => err.type === 'validation').length; // Eq. 47: Form Validation Error Rate (count here)
    let repeatedActionAttempts = errorsInWindow.filter(err => err.type === 'repeatedAction').length; // Eq. 48: Repeated Action Attempt Frequency (count here)
    let navigationErrors = errorsInWindow.filter(err => err.type === 'navigation').length; // Eq. 49: Navigation Error Ratio (count here)
    let apiErrors = errorsInWindow.filter(err => err.type === 'apiError').length;
    let clientRuntimeErrors = errorsInWindow.filter(err => err.type === 'clientRuntime').length;
    let criticalErrorFrequency = errorsInWindow.filter(err => err.severity === 'critical').length / durationSeconds;
    let timeSinceLastErrorS = (windowEnd - this.interactionErrorLogger.getLastLoggedErrorTimestamp()) / 1000;
    if (this.interactionErrorLogger.getLastLoggedErrorTimestamp() === 0) timeSinceLastErrorS = Number.MAX_SAFE_INTEGER; // No errors ever


    // --- Gaze Tracking Features (Mock) ---
    let gazeDeviationAvg = 0;
    let pupilDilationAvg = 0;
    let fixationFrequency = 0;
    let saccadeVelocityAvg = 0;
    let gazePathLength = 0;
    let scanPathArea = 0; // Mock simplified
    if (gazeEvents.length > 0) {
      pupilDilationAvg = gazeEvents.reduce((sum, g) => sum + (g.pupilDilation || 0), 0) / gazeEvents.length; // Eq. 25: Average Pupil Dilation
      gazeDeviationAvg = gazeEvents.reduce((sum, g) => sum + (g.gazeStability ? (1 - g.gazeStability) * 50 : 0), 0) / gazeEvents.length; // Mock deviation
      fixationFrequency = gazeEvents.length / durationSeconds * 0.5; // Simulate 50% being fixations (Eq. 23)
      saccadeVelocityAvg = gazeEvents.reduce((sum, g) => sum + (g.saccadeVelocity || 0), 0) / gazeEvents.length; // Eq. 24
      // Eq. 27: Gaze Path Length
      if (gazeEvents.length > 1) {
        for (let i = 1; i < gazeEvents.length; i++) {
          gazePathLength += Math.sqrt(Math.pow(gazeEvents[i].x - gazeEvents[i - 1].x, 2) + Math.pow(gazeEvents[i].y - gazeEvents[i - 1].y, 2));
        }
      }
      scanPathArea = Math.random() * 5000; // Mock Eq. 28
    }

    // --- Biosignal Features (Mock) ---
    let heartRateAvg = 0;
    let heartRateVariability = 0;
    let skinConductanceAvg = 0;
    let eegAlphaPowerRatio = 0;
    let eegThetaPowerRatio = 0;

    const hrEvents = biosignalEvents.filter(b => b.type === 'heart_rate').map(b => b.value);
    if (hrEvents.length > 0) {
      heartRateAvg = hrEvents.reduce((sum, v) => sum + v, 0) / hrEvents.length; // Eq. 32
      if (hrEvents.length > 1) {
        const mean = heartRateAvg; // Eq. 67
        const variance = hrEvents.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / hrEvents.length; // Eq. 68
        heartRateVariability = Math.sqrt(variance); // Simple std dev as proxy for HRV, Eq. 33 (partially)
      }
    }

    const scEvents = biosignalEvents.filter(b => b.type === 'skin_conductance').map(b => b.value);
    if (scEvents.length > 0) {
      skinConductanceAvg = scEvents.reduce((sum, v) => sum + v, 0) / scEvents.length; // Eq. 34
    }
    const eegAlphaEvents = biosignalEvents.filter(b => b.type === 'eeg_alpha').map(b => b.value);
    if (eegAlphaEvents.length > 0) eegAlphaPowerRatio = eegAlphaEvents.reduce((sum, v) => sum + v, 0) / eegAlphaEvents.length; // Eq. 35
    const eegThetaEvents = biosignalEvents.filter(b => b.type === 'eeg_theta').map(b => b.value);
    if (eegThetaEvents.length > 0) eegThetaPowerRatio = eegThetaEvents.reduce((sum, v) => sum + v, 0) / eegThetaEvents.length; // Eq. 36

    // Task Context
    const currentTask = this.taskContextManager.getCurrentTask();
    const taskComplexityMap: { [key in TaskContext['complexity']]: number } = {
      'low': 0.2, 'medium': 0.5, 'high': 0.7, 'critical': 0.9
    };
    const taskUrgencyMap: { [key in TaskContext['urgency']]: number } = {
      'low': 0.1, 'medium': 0.3, 'high': 0.6, 'immediate': 0.9
    };
    const taskContextFeatures: TaskContextFeatures = {
      current_task_complexity: currentTask ? taskComplexityMap[currentTask.complexity] : 0, // Eq. 57: Task Complexity Score
      time_in_current_task_sec: currentTask ? (windowEnd - currentTask.timestamp) / 1000 : 0, // Eq. 58: Time in Current Task
      task_switches_count: this.taskContextManager.getTaskHistory().filter(t => t.timestamp >= windowStart).length, // Eq. 59: Task Switch Frequency
      task_completion_status: currentTask?.progressPercentage === 100 ? 1 : 0,
      task_urgency_score: currentTask ? taskUrgencyMap[currentTask.urgency] : 0,
      task_progress_rate: currentTask?.progressPercentage && currentTask.progressPercentage > 0 && currentTask.timestamp < windowEnd ?
        (currentTask.progressPercentage / 100) / ((windowEnd - currentTask.timestamp) / 1000) : 0, // Eq. 60
    };

    // User Engagement Features
    const totalEventCount = events.length;
    const activeInteractionRatio = totalEventCount > 0 ? 1 : 0; // Simplistic: any event means active
    const idleDurationAvg = activeInteractionRatio === 0 ? durationSeconds : 0; // If no events, assume idle
    const frustrationIndexProxy = (formValidationErrors * 0.2 + repeatedActionAttempts * 0.3 + errorClickCount * 0.1 + misclicks * 0.15); // Eq. 63: Frustration Index Proxy
    const userActivityBurstiness = totalEventCount > 1 ?
      Math.sqrt(events.reduce((sum, e, i) => i > 0 ? sum + Math.pow(e.data.timestamp - events[i-1].data.timestamp - durationMs / totalEventCount, 2) : sum, 0) / (totalEventCount - 1)) : 0;
    const sessionDurationS = performance.now() / 1000;


    const featureVector: TelemetryFeatureVector = {
      timestamp_window_end: windowEnd,
      window_duration_ms: durationMs,
      event_density: totalEventCount / durationSeconds,
      task_context: taskContextFeatures,
      engagement: {
        active_interaction_ratio: activeInteractionRatio, // Eq. 61: Active Interaction Ratio
        idle_duration_avg: idleDurationAvg, // Eq. 62: Idle Duration Frequency (simplified)
        frustration_index_proxy: frustrationIndexProxy,
        user_activity_burstiness: userActivityBurstiness,
        session_duration_s: sessionDurationS,
      },
      ui_mode_context: currentUiMode, // Include the UI mode during this feature window
    };

    if (mouseMoveEvents.length > 0) {
      featureVector.mouse = {
        mouse_velocity_avg: mouseMoveEvents.length > 1 ? totalMouseVelocity / (mouseMoveEvents.length - 1) : 0, // Eq. 2: Average Velocity
        mouse_acceleration_avg: mouseMoveEvents.length > 2 ? totalMouseAcceleration / (mouseMoveEvents.length - 2) : 0, // Eq. 4: Average Acceleration
        mouse_path_tortuosity: this.calculateMousePathTortuosity(mouseMoveEvents), // Eq. 5: Path Tortuosity
        mouse_dwell_time_avg: 0, // Requires more complex tracking
        fitts_law_ip_avg: this.calculateFittsLawIP(clickEvents), // Eq. 6: Fitts's Law Index of Performance
        mouse_smoothness_index: this.calculateMouseSmoothnessIndex(mouseMoveEvents), // Eq. 7: Mouse Smoothness Index
        mouse_travel_distance_total: totalMouseTravelDistance, // Eq. 8: Total Mouse Travel Distance
        mouse_idle_time_ratio: mouseIdleTimeRatio, // Eq. 11
      };
    }

    if (clickEvents.length > 0) {
      const misclicks = this.calculateMisclickRate(clickEvents);
      featureVector.clicks = {
        click_frequency: clickEvents.length / durationSeconds,
        click_latency_avg: clickEvents.length > 1 ? totalClickLatency / (clickEvents.length - 1) : 0,
        target_acquisition_error_avg: this.calculateTargetAcquisitionError(clickEvents),
        double_click_frequency: doubleClickCount / durationSeconds,
        click_pressure_avg: clickEvents.length > 0 ? totalClickPressure / clickEvents.length : 0,
        error_click_rate: errorClickCount / clickEvents.length,
        misclick_rate: misclicks,
        repeated_click_on_same_element_freq: repeatedClickOnSameElementCount / durationSeconds,
      };
    }

    if (scrollEvents.length > 0) {
      featureVector.scroll = {
        scroll_velocity_avg: totalScrollYDelta / durationSeconds, // Eq. 37: Scroll Velocity Avg
        scroll_direction_changes: scrollDirectionChanges, // Eq. 40: Scroll Direction Changes
        scroll_pause_frequency: scrollPauseCount / durationSeconds, // Eq. 41: Scroll Pause Frequency
        scroll_jerk_avg: scrollEvents.length > 2 ? totalScrollJerk / (scrollEvents.length - 2) : 0, // Eq. 39: Scroll Jerk Avg
        scroll_coverage_ratio: documentScrollHeight > 0 ? (maxScrollY - minScrollY) / documentScrollHeight : 0, // Eq. 43: Scroll Coverage Ratio
        scroll_depth_max: scrollDepthMax, // Eq. 42
        scroll_reversal_ratio: scrollReversalRatio, // Eq. 46
      };
    }

    if (keydownEvents.length > 0) {
      featureVector.keyboard = {
        typing_speed_wpm: wordCount / (durationSeconds / 60), // Eq. 12: Typing Speed (WPM)
        backspace_frequency: backspaceCount / durationSeconds, // Eq. 14: Backspace Frequency
        keystroke_latency_avg: nonModifierKeydownCount > 1 ? totalKeystrokeLatency / (nonModifierKeydownCount - 1) : 0, // Eq. 13: Keystroke Latency Avg
        error_correction_rate: errorCorrectionRate, // Eq. 15: Error Correction Rate
        typing_burst_rate: typingBursts / durationSeconds, // Eq. 16: Typing Burst Rate
        modifier_key_usage_ratio: totalEventCount > 0 ? modifierKeydownCount / totalEventCount : 0, // Eq. 17: Modifier Key Usage Ratio
        typing_rhythm_irregularity: typingRhythmIrregularity, // Eq. 19
      };
    }

    if (focusEvents.length > 0 || blurEvents.length > 0) {
      featureVector.focus = {
        refocus_frequency: refocusFrequency / durationSeconds,
        element_dwell_time_avg: elementDwellCount > 0 ? elementDwellTimeSum / elementDwellCount : 0,
        blur_rate: blurRate,
        focus_shift_distance_avg: focusEvents.length > 1 ? totalFocusShiftDistance / (focusEvents.length - 1) : 0,
      };
    }

    if (formEvents.length > 0) {
      featureVector.forms = {
        form_validation_errors_count: totalFormValidationErrors,
        form_submission_rate: formSubmissionCount / durationSeconds,
        form_abandonment_rate: formAbandonmentCount, // More complex calculation
        form_interaction_time_avg: formInteractionTimeAvg,
        input_correction_rate: nonModifierKeydownCount > 0 ? backspaceCount / nonModifierKeydownCount : 0, // Reuse error_correction_rate for simplicity here
        time_to_first_input_avg: timeToFirstInputAvg,
      };
    }

    featureVector.errors = {
      form_validation_errors_count: formValidationErrors, // Eq. 47
      repeated_action_attempts_count: repeatedActionAttempts, // Eq. 48
      navigation_errors_count: navigationErrors, // Eq. 49
      api_errors_count: apiErrors,
      system_ui_errors_count: clientRuntimeErrors,
      critical_error_frequency: criticalErrorFrequency,
      time_since_last_error_s: timeSinceLastErrorS,
    };

    if (gazeEvents.length > 0) {
      featureVector.gaze = {
        gaze_deviation_avg: gazeDeviationAvg, // Eq. 26
        pupil_dilation_avg: pupilDilationAvg, // Eq. 25
        fixation_frequency: fixationFrequency, // Eq. 23
        saccade_velocity_avg: saccadeVelocityAvg, // Eq. 24
        gaze_path_length: gazePathLength, // Eq. 27
        scan_path_area: scanPathArea, // Eq. 28
      };
    }

    if (biosignalEvents.length > 0) {
      featureVector.biosignals = {
        heart_rate_avg: heartRateAvg, // Eq. 32
        heart_rate_variability: heartRateVariability, // Eq. 33
        skin_conductance_avg: skinConductanceAvg, // Eq. 34
        eeg_alpha_power_ratio: eegAlphaPowerRatio, // Eq. 35
        eeg_theta_power_ratio: eegThetaPowerRatio, // Eq. 36
      };
    }

    return featureVector;
  };

  private flushBuffer = (): void => {
    if (this.eventBuffer.length > 0) {
      // Pass the current UI mode to feature extraction for contextual insights
      const currentUiMode = UserProfileService.getInstance().getPreferences().preferredUiMode; // Or fetch current from provider if available
      const features = this.extractFeatures(this.eventBuffer, currentUiMode);
      this.featureProcessingCallback(features);
      this.eventBuffer = []; // Clear buffer
    }
  };

  public stop(): void {
    window.removeEventListener('mousemove', this.handleMouseMoveEvent);
    window.removeEventListener('click', this.handleClickEvent);
    window.removeEventListener('scroll', this.handleScrollEvent);
    window.removeEventListener('keydown', this.handleKeyboardEvent);
    window.removeEventListener('keyup', this.handleKeyboardEvent);
    window.removeEventListener('focusin', this.handleFocusBlurEvent);
    window.removeEventListener('focusout', this.handleFocusBlurEvent);
    window.removeEventListener('input', this.handleFormEvent);
    window.removeEventListener('change', this.handleFormEvent);
    window.removeEventListener('submit', this.handleFormEvent);
    // if (this.userProfileService.getPreferences().privacySettings.gazeTrackingEnabled) {
    //   window.removeEventListener('gaze', this.handleGazeEvent);
    // }
    // if (this.mockBiosignalGenerationInterval) {
    //   clearInterval(this.mockBiosignalGenerationInterval);
    // }
    if (this.bufferInterval) {
      clearInterval(this.bufferInterval);
    }
    this.interactionErrorLogger.stop();
    console.log("TelemetryAgent stopped.");
  }
}

/**
 * Mermaid Diagram 2: Telemetry Data Flow
 * Shows how raw events are captured, buffered, processed into features, and fed to the inference engine.
 */
export const TELEMETRY_DATA_FLOW_MERMAID = `
graph TD
    A[Raw User Events (Mouse, Keyboard, Scroll, Form, Gaze, Biosignals)] --> B{TelemetryAgent Listeners (Privacy Filtered)};
    B --> C[Event Buffer];
    C -- Flush (every ${TelemetryAgent['prototype']['bufferFlushRateMs']}ms) --> D[Feature Extraction Algorithm];
    D -- TelemetryFeatureVector --> E[CognitiveLoadEngine];
    E -- Cognitive Load Score & Confidence --> F[AdaptiveUIProvider];
    F -- UI Mode & Policies --> G[Rendered UI Elements];
    D --> H[InteractionErrorLogger (for error-related features)];
    D --> I[TaskContextManager (for task-related features)];
    J[UserProfileService (Privacy Settings)] --> B;
    J --> E;
`;

/**
 * Mermaid Diagram 3: Cognitive Load Prediction Model Architecture (Simplified)
 * High-level view of the mock ML model within the CognitiveLoadEngine.
 */
export const COGNITIVE_LOAD_MODEL_ARCHITECTURE_MERMAID = `
graph LR
    subgraph Feature Engineering
        A[Raw Telemetry Events] --> B[Feature Extraction (TelemetryAgent)];
        B -- TelemetryFeatureVector --> C[Feature Normalization & Transformation];
    end

    subgraph Cognitive Load Prediction
        C -- Weighted Features (Dynamic Weights) --> D{Online Learning Model (e.g., Adaptive Linear Regression, Simple NN)};
        D -- Sigmoid/Logit --> E[Raw Load Score (0-1) & Prediction Confidence];
        E -- Historical Smoothing (EMA) --> F[Smoothed Cognitive Load];
        F -- Adaptive Thresholds (AdaptiveThresholdManager) --> G[UI Mode Decision];
        G -- Model Feedback (Success/Failure) --> D;
    end

    subgraph Feedback & Adaptation
        G -- Selected UI Mode --> H[AdaptationPolicyManager];
        H -- UI Element State --> I[Adaptive UI];
        I --> J[User Interaction];
        J --> A;
        K[User Preferences (UserProfileService)] --> G;
        L[Task Context (TaskContextManager)] --> G;
        M[System Health Monitor] --> D;
    end
`;

/**
 * Claim 4: The CognitiveLoadEngine leverages a multi-modal feature vector.
 * "By incorporating diverse features from mouse kinematics, keyboard dynamics, scroll behavior, interaction errors, task context, and even (mock) gaze data, the CognitiveLoadEngine forms a holistic view of user engagement, leading to a more robust and accurate cognitive load prediction."
 *
 * Disproof & Bulletproofing: "Holistic" is better when features interact non-linearly, and the model understands *uncertainty*. The previous "mock predict" was a linear sum. To make it "bulletproof," we need a more flexible model that can learn complex relationships and provide a `prediction_confidence`. Adding biosignals, dynamic feature normalization, and a *conceptual* online learning model (even if simplified in implementation) moves towards truly robust prediction. The concept of `CognitiveReserveEstimation` from `UserProfileService` also provides a crucial personalized prior.
 */
// Interface for the pluggable cognitive load prediction model
export interface ICognitiveLoadModel {
  predict(features: TelemetryFeatureVector, userPrefs: UserPreferences, taskContext: TaskContext | null): { load: number; confidence: number };
  updateWeights(feedback: { features: TelemetryFeatureVector; actualOutcome: number; predictedLoad: number }): void; // For online learning
  calibrate(calibrationData: TelemetryFeatureVector[]): void; // For initial setup or re-calibration
}

export class SimpleAdaptiveCognitiveLoadModel implements ICognitiveLoadModel {
  // Initial (or learned) model weights, with more granular features
  private modelWeights: { [key: string]: number } = {
    mouse_velocity_avg: 0.05, mouse_acceleration_avg: 0.07, mouse_path_tortuosity: 0.1, mouse_smoothness_index: -0.05, mouse_travel_distance_total: 0.01, mouse_idle_time_ratio: 0.1,
    click_frequency: 0.08, click_latency_avg: 0.1, target_acquisition_error_avg: 0.15, double_click_frequency: 0.05, click_pressure_avg: -0.02, error_click_rate: 0.2, misclick_rate: 0.18, repeated_click_on_same_element_freq: 0.1,
    scroll_velocity_avg: 0.03, scroll_direction_changes: 0.08, scroll_pause_frequency: 0.04, scroll_jerk_avg: 0.06, scroll_coverage_ratio: -0.01, scroll_reversal_ratio: 0.07, scroll_depth_max: -0.02,
    typing_speed_wpm_deviation: 0.07, backspace_frequency: 0.18, keystroke_latency_avg: 0.08, error_correction_rate: 0.15, typing_burst_rate: 0.04, modifier_key_usage_ratio: -0.03, typing_rhythm_irregularity: 0.1,
    refocus_frequency: 0.1, element_dwell_time_avg: -0.05, blur_rate: 0.07, focus_shift_distance_avg: 0.05,
    form_validation_errors_count: 0.25, form_submission_rate: -0.05, form_abandonment_rate: 0.2, form_interaction_time_avg: -0.03, input_correction_rate: 0.15, time_to_first_input_avg: 0.05,
    repeated_action_attempts_count: 0.2, navigation_errors_count: 0.15, api_errors_count: 0.3, system_ui_errors_count: 0.35, critical_error_frequency: 0.4, time_since_last_error_s: -0.05,
    gaze_deviation_avg: 0.12, pupil_dilation_avg: 0.15, fixation_frequency: -0.05, saccade_velocity_avg: 0.08, gaze_path_length: 0.05, scan_path_area: 0.03,
    heart_rate_avg: 0.1, heart_rate_variability: 0.08, skin_conductance_avg: 0.15, eeg_alpha_power_ratio: -0.1, eeg_theta_power_ratio: 0.12,
    task_complexity: 0.1, time_in_task: 0.02, task_switches_count: 0.09, task_completion_status: -0.05, task_urgency_score: 0.15, task_progress_rate: -0.05,
    active_interaction_ratio: -0.03, idle_duration_avg: 0.05, frustration_index_proxy: 0.25, user_activity_burstiness: 0.07, session_duration_s: 0.001,
    event_density: 0.05,
    baseline_offset: 0.0
  };

  // Min/Max for normalization (dynamic, can be learned over time for each user)
  private featureMinMax: { [key: string]: { min: number; max: number } } = {
    mouse_velocity_avg: { min: 0, max: 10 }, mouse_acceleration_avg: { min: 0, max: 1 }, mouse_path_tortuosity: { min: 1, max: 5 }, mouse_smoothness_index: { min: 0, max: 1 }, mouse_travel_distance_total: { min: 0, max: 1000 }, mouse_idle_time_ratio: { min: 0, max: 1 },
    click_frequency: { min: 0, max: 5 }, click_latency_avg: { min: 0, max: 500 }, target_acquisition_error_avg: { min: 0, max: 50 }, double_click_frequency: { min: 0, max: 2 }, click_pressure_avg: { min: 0, max: 1 }, error_click_rate: { min: 0, max: 1 }, misclick_rate: { min: 0, max: 1 }, repeated_click_on_same_element_freq: { min: 0, max: 1 },
    scroll_velocity_avg: { min: 0, max: 2000 }, scroll_direction_changes: { min: 0, max: 10 }, scroll_pause_frequency: { min: 0, max: 5 }, scroll_jerk_avg: { min: 0, max: 1 }, scroll_coverage_ratio: { min: 0, max: 1 }, scroll_reversal_ratio: { min: 0, max: 1 }, scroll_depth_max: { min: 0, max: 1 },
    typing_speed_wpm_deviation: { min: 0, max: 1 }, backspace_frequency: { min: 0, max: 2 }, keystroke_latency_avg: { min: 0, max: 500 }, error_correction_rate: { min: 0, max: 1 }, typing_burst_rate: { min: 0, max: 5 }, modifier_key_usage_ratio: { min: 0, max: 1 }, typing_rhythm_irregularity: { min: 0, max: 200 },
    refocus_frequency: { min: 0, max: 5 }, element_dwell_time_avg: { min: 0, max: 10000 }, blur_rate: { min: 0, max: 1 }, focus_shift_distance_avg: { min: 0, max: 200 },
    form_validation_errors_count: { min: 0, max: 5 }, form_submission_rate: { min: 0, max: 1 }, form_abandonment_rate: { min: 0, max: 1 }, form_interaction_time_avg: { min: 0, max: 5000 }, input_correction_rate: { min: 0, max: 1 }, time_to_first_input_avg: { min: 0, max: 5000 },
    repeated_action_attempts_count: { min: 0, max: 3 }, navigation_errors_count: { min: 0, max: 2 }, api_errors_count: { min: 0, max: 1 }, system_ui_errors_count: { min: 0, max: 1 }, critical_error_frequency: { min: 0, max: 1 }, time_since_last_error_s: { min: 0, max: 60 }, // Log scale for time since last error
    gaze_deviation_avg: { min: 0, max: 50 }, pupil_dilation_avg: { min: 0, max: 5 }, fixation_frequency: { min: 0, max: 10 }, saccade_velocity_avg: { min: 0, max: 200 }, gaze_path_length: { min: 0, max: 5000 }, scan_path_area: { min: 0, max: 50000 },
    heart_rate_avg: { min: 50, max: 120 }, heart_rate_variability: { min: 0, max: 20 }, skin_conductance_avg: { min: 0, max: 1 }, eeg_alpha_power_ratio: { min: 0, max: 1 }, eeg_theta_power_ratio: { min: 0, max: 1 },
    task_complexity: { min: 0, max: 1 }, time_in_task: { min: 0, max: 600 }, task_switches_count: { min: 0, max: 3 }, task_completion_status: { min: 0, max: 1 }, task_urgency_score: { min: 0, max: 1 }, task_progress_rate: { min: 0, max: 0.1 },
    active_interaction_ratio: { min: 0, max: 1 }, idle_duration_avg: { min: 0, max: 30 }, frustration_index_proxy: { min: 0, max: 10 }, user_activity_burstiness: { min: 0, max: 1000 }, session_duration_s: { min: 0, max: 3600 },
    event_density: { min: 0, max: 100 },
  };

  private sigmoid(x: number): number { return 1 / (1 + Math.exp(-x)); } // Eq. 74
  private normalizeFeature(value: number, min: number, max: number): number { // Eq. 70
    if (max === min) return 0;
    return Math.min(1, Math.max(0, (value - min) / (max - min)));
  }

  predict(features: TelemetryFeatureVector, userPrefs: UserPreferences, taskContext: TaskContext | null): { load: number; confidence: number } {
    let rawScore = userPrefs.personalizedBaselineCLS + this.modelWeights.baseline_offset; // Eq. 95 (PDS) foundation

    // Dynamic normalization based on user's perceived min/max or a global learned range
    const getNormalized = (featureName: string, value: number, isInverse: boolean = false) => {
      const range = this.featureMinMax[featureName];
      if (!range) {
        console.warn(`Normalization range not found for feature: ${featureName}`);
        return value; // Return raw value if no range
      }
      const normalized = this.normalizeFeature(value, range.min, range.max);
      return isInverse ? (1 - normalized) : normalized;
    };

    // Apply weights to normalized features
    // Mouse Kinematics Features
    if (features.mouse) {
      rawScore += getNormalized('mouse_velocity_avg', features.mouse.mouse_velocity_avg) * this.modelWeights.mouse_velocity_avg;
      rawScore += getNormalized('mouse_acceleration_avg', features.mouse.mouse_acceleration_avg) * this.modelWeights.mouse_acceleration_avg;
      rawScore += getNormalized('mouse_path_tortuosity', features.mouse.mouse_path_tortuosity) * this.modelWeights.mouse_path_tortuosity;
      rawScore += getNormalized('mouse_smoothness_index', features.mouse.mouse_smoothness_index, true) * this.modelWeights.mouse_smoothness_index; // Smoother is good (negative weight conceptual)
      rawScore += getNormalized('mouse_travel_distance_total', features.mouse.mouse_travel_distance_total) * this.modelWeights.mouse_travel_distance_total;
      rawScore += getNormalized('mouse_idle_time_ratio', features.mouse.mouse_idle_time_ratio) * this.modelWeights.mouse_idle_time_ratio;
    }

    // Click Dynamics Features
    if (features.clicks) {
      rawScore += getNormalized('click_frequency', features.clicks.click_frequency) * this.modelWeights.click_frequency;
      rawScore += getNormalized('click_latency_avg', features.clicks.click_latency_avg) * this.modelWeights.click_latency_avg;
      rawScore += getNormalized('target_acquisition_error_avg', features.clicks.target_acquisition_error_avg) * this.modelWeights.target_acquisition_error_avg;
      rawScore += getNormalized('double_click_frequency', features.clicks.double_click_frequency) * this.modelWeights.double_click_frequency;
      rawScore += getNormalized('click_pressure_avg', features.clicks.click_pressure_avg, true) * this.modelWeights.click_pressure_avg;
      rawScore += getNormalized('error_click_rate', features.clicks.error_click_rate) * this.modelWeights.error_click_rate * userPrefs.sensitivityToErrors;
      rawScore += getNormalized('misclick_rate', features.clicks.misclick_rate) * this.modelWeights.misclick_rate * userPrefs.sensitivityToErrors;
      rawScore += getNormalized('repeated_click_on_same_element_freq', features.clicks.repeated_click_on_same_element_freq) * this.modelWeights.repeated_click_on_same_element_freq * userPrefs.sensitivityToErrors;
    }

    // Scroll Dynamics Features
    if (features.scroll) {
      rawScore += getNormalized('scroll_velocity_avg', features.scroll.scroll_velocity_avg) * this.modelWeights.scroll_velocity_avg;
      rawScore += getNormalized('scroll_direction_changes', features.scroll.scroll_direction_changes) * this.modelWeights.scroll_direction_changes;
      rawScore += getNormalized('scroll_pause_frequency', features.scroll.scroll_pause_frequency) * this.modelWeights.scroll_pause_frequency;
      rawScore += getNormalized('scroll_jerk_avg', features.scroll.scroll_jerk_avg) * this.modelWeights.scroll_jerk_avg;
      rawScore += getNormalized('scroll_coverage_ratio', features.scroll.scroll_coverage_ratio, true) * this.modelWeights.scroll_coverage_ratio;
      rawScore += getNormalized('scroll_reversal_ratio', features.scroll.scroll_reversal_ratio) * this.modelWeights.scroll_reversal_ratio;
      rawScore += getNormalized('scroll_depth_max', features.scroll.scroll_depth_max, true) * this.modelWeights.scroll_depth_max;
    }

    // Keyboard Dynamics Features
    if (features.keyboard) {
      const optimalWPM = 60; // Eq. 12: WPM benchmark
      const wpmDeviation = Math.abs(features.keyboard.typing_speed_wpm - optimalWPM) / optimalWPM;
      rawScore += getNormalized('typing_speed_wpm_deviation', wpmDeviation) * this.modelWeights.typing_speed_wpm_deviation;
      rawScore += getNormalized('backspace_frequency', features.keyboard.backspace_frequency) * this.modelWeights.backspace_frequency;
      rawScore += getNormalized('keystroke_latency_avg', features.keyboard.keystroke_latency_avg) * this.modelWeights.keystroke_latency_avg;
      rawScore += getNormalized('error_correction_rate', features.keyboard.error_correction_rate) * this.modelWeights.error_correction_rate * userPrefs.sensitivityToErrors;
      rawScore += getNormalized('typing_burst_rate', features.keyboard.typing_burst_rate) * this.modelWeights.typing_burst_rate;
      rawScore += getNormalized('modifier_key_usage_ratio', features.keyboard.modifier_key_usage_ratio, true) * this.modelWeights.modifier_key_usage_ratio;
      rawScore += getNormalized('typing_rhythm_irregularity', features.keyboard.typing_rhythm_irregularity) * this.modelWeights.typing_rhythm_irregularity;
    }

    // Focus Dynamics Features
    if (features.focus) {
      rawScore += getNormalized('refocus_frequency', features.focus.refocus_frequency) * this.modelWeights.refocus_frequency;
      rawScore += getNormalized('element_dwell_time_avg', features.focus.element_dwell_time_avg, true) * this.modelWeights.element_dwell_time_avg;
      rawScore += getNormalized('blur_rate', features.focus.blur_rate) * this.modelWeights.blur_rate;
      rawScore += getNormalized('focus_shift_distance_avg', features.focus.focus_shift_distance_avg) * this.modelWeights.focus_shift_distance_avg;
    }

    // Form Interaction Features
    if (features.forms) {
      rawScore += getNormalized('form_validation_errors_count', features.forms.form_validation_errors_count) * this.modelWeights.form_validation_errors_count * userPrefs.sensitivityToErrors;
      rawScore += getNormalized('form_submission_rate', features.forms.form_submission_rate, true) * this.modelWeights.form_submission_rate;
      rawScore += getNormalized('form_abandonment_rate', features.forms.form_abandonment_rate) * this.modelWeights.form_abandonment_rate;
      rawScore += getNormalized('form_interaction_time_avg', features.forms.form_interaction_time_avg, true) * this.modelWeights.form_interaction_time_avg;
      rawScore += getNormalized('input_correction_rate', features.forms.input_correction_rate) * this.modelWeights.input_correction_rate * userPrefs.sensitivityToErrors;
      rawScore += getNormalized('time_to_first_input_avg', features.forms.time_to_first_input_avg) * this.modelWeights.time_to_first_input_avg;
    }

    // Error Features (strong indicators of load)
    if (features.errors) {
      rawScore += getNormalized('repeated_action_attempts_count', features.errors.repeated_action_attempts_count) * this.modelWeights.repeated_action_attempts_count * userPrefs.sensitivityToErrors;
      rawScore += getNormalized('navigation_errors_count', features.errors.navigation_errors_count) * this.modelWeights.navigation_errors_count * userPrefs.sensitivityToErrors;
      rawScore += getNormalized('api_errors_count', features.errors.api_errors_count) * this.modelWeights.api_errors_count * userPrefs.sensitivityToErrors;
      rawScore += getNormalized('system_ui_errors_count', features.errors.system_ui_errors_count) * this.modelWeights.system_ui_errors_count * userPrefs.sensitivityToErrors;
      rawScore += getNormalized('critical_error_frequency', features.errors.critical_error_frequency) * this.modelWeights.critical_error_frequency * userPrefs.sensitivityToErrors;
      rawScore += getNormalized('time_since_last_error_s', Math.log1p(features.errors.time_since_last_error_s), true) * this.modelWeights.time_since_last_error_s; // Log transform for time, inverse
    }

    // Gaze Tracking Features
    if (features.gaze && userPrefs.privacySettings.gazeTrackingEnabled) {
      rawScore += getNormalized('gaze_deviation_avg', features.gaze.gaze_deviation_avg) * this.modelWeights.gaze_deviation_avg;
      rawScore += getNormalized('pupil_dilation_avg', features.gaze.pupil_dilation_avg) * this.modelWeights.pupil_dilation_avg;
      rawScore += getNormalized('fixation_frequency', features.gaze.fixation_frequency, true) * this.modelWeights.fixation_frequency;
      rawScore += getNormalized('saccade_velocity_avg', features.gaze.saccade_velocity_avg) * this.modelWeights.saccade_velocity_avg;
      rawScore += getNormalized('gaze_path_length', features.gaze.gaze_path_length) * this.modelWeights.gaze_path_length;
      rawScore += getNormalized('scan_path_area', features.gaze.scan_path_area) * this.modelWeights.scan_path_area;
    }

    // Biosignal Features
    if (features.biosignals && userPrefs.privacySettings.biosignalTrackingEnabled) {
      rawScore += getNormalized('heart_rate_avg', features.biosignals.heart_rate_avg) * this.modelWeights.heart_rate_avg;
      rawScore += getNormalized('heart_rate_variability', features.biosignals.heart_rate_variability) * this.modelWeights.heart_rate_variability;
      rawScore += getNormalized('skin_conductance_avg', features.biosignals.skin_conductance_avg) * this.modelWeights.skin_conductance_avg;
      rawScore += getNormalized('eeg_alpha_power_ratio', features.biosignals.eeg_alpha_power_ratio, true) * this.modelWeights.eeg_alpha_power_ratio;
      rawScore += getNormalized('eeg_theta_power_ratio', features.biosignals.eeg_theta_power_ratio) * this.modelWeights.eeg_theta_power_ratio;
    }

    // Task Context
    if (features.task_context && taskContext) {
      rawScore += getNormalized('task_complexity', features.task_context.current_task_complexity) * this.modelWeights.task_complexity;
      rawScore += getNormalized('time_in_task', features.task_context.time_in_current_task_sec) * this.modelWeights.time_in_task;
      rawScore += getNormalized('task_switches_count', features.task_context.task_switches_count) * this.modelWeights.task_switches_count;
      rawScore += getNormalized('task_completion_status', features.task_context.task_completion_status, true) * this.modelWeights.task_completion_status;
      rawScore += getNormalized('task_urgency_score', features.task_context.task_urgency_score) * this.modelWeights.task_urgency_score;
      rawScore += getNormalized('task_progress_rate', features.task_context.task_progress_rate, true) * this.modelWeights.task_progress_rate;
    }

    // Engagement Features
    if (features.engagement) {
      rawScore += getNormalized('active_interaction_ratio', features.engagement.active_interaction_ratio, true) * this.modelWeights.active_interaction_ratio;
      rawScore += getNormalized('idle_duration_avg', features.engagement.idle_duration_avg) * this.modelWeights.idle_duration_avg;
      rawScore += getNormalized('frustration_index_proxy', features.engagement.frustration_index_proxy) * this.modelWeights.frustration_index_proxy;
      rawScore += getNormalized('user_activity_burstiness', features.engagement.user_activity_burstiness) * this.modelWeights.user_activity_burstiness;
      rawScore += getNormalized('session_duration_s', features.engagement.session_duration_s) * this.modelWeights.session_duration_s;
    }

    rawScore += getNormalized('event_density', features.event_density) * this.modelWeights.event_density; // Eq. 96 (RDI)

    // Adjust for cognitive reserve (a higher reserve makes user more resilient to load)
    rawScore *= (1 - userPrefs.cognitiveReserveEstimation * 0.5); // Reduce raw load if reserve is high

    // Apply Sigmoid to ensure score is within [0, 1] after linear combination. Eq. 74
    let finalLoad = this.sigmoid(rawScore * 2 - 1); // Scale rawScore to roughly -5 to 5 for sigmoid input

    // Adjust based on UI mode context (Eq. 98: Cognitive Dissonance)
    if (features.ui_mode_context === 'minimal' || features.ui_mode_context === 'guided' || features.ui_mode_context === 'recovery') {
      finalLoad *= 0.95; // Small reduction if system is already trying to help
    } else if (features.ui_mode_context === 'crisis') {
      finalLoad *= 1.05; // Crisis mode means high load, so amplify
    }

    // Mock confidence score (higher load often means lower confidence, or stable features mean higher confidence)
    const confidence = 1 - Math.abs(finalLoad - 0.5) * 0.8 - (features.errors?.critical_error_frequency || 0) * 0.5;
    return { load: Math.min(1.0, Math.max(0.0, finalLoad)), confidence: Math.min(1.0, Math.max(0.0, confidence)) };
  }

  // Claim 5: Adaptive Model Refinement through Feedback.
  // "The CognitiveLoadEngine is designed for continuous learning, allowing for dynamic updates to its predictive model weights. This facilitates an adaptive feedback loop where user feedback or A/B testing results can iteratively improve the accuracy of cognitive load predictions."
  //
  // Disproof & Bulletproofing: The original `updateModelWeights` was a placeholder. For "bulletproof" adaptation, the model needs an *actual* learning mechanism. Even if simplified, `updateWeights` needs to simulate adjusting weights based on a 'ground truth' (e.g., explicit user feedback, or inferred success/failure of adaptation). 'Calibrate' allows for initial learning from a dataset. This moves towards true online learning (Eq. 97).
  updateWeights(feedback: { features: TelemetryFeatureVector; actualOutcome: number; predictedLoad: number }): void {
    // This is a conceptual implementation of online learning.
    // In a real system, this would involve gradient descent or other optimization algorithms.
    // For simplicity, we'll nudge weights based on prediction error.
    const learningRate = 0.01; // Eq. 104
    const error = feedback.actualOutcome - feedback.predictedLoad; // Difference between desired and actual

    for (const key in this.modelWeights) {
      if (this.modelWeights.hasOwnProperty(key) && key !== 'baseline_offset') {
        // Mock: adjust weight in direction that reduces error.
        // A more sophisticated approach would use feature values, e.g., weight_new = weight_old + learning_rate * error * feature_value
        // We will just nudge it slightly based on overall error and assumed impact.
        this.modelWeights[key] += learningRate * error * (this.modelWeights[key] > 0 ? 1 : -1) * 0.01;
        // Clamp weights to prevent explosion
        this.modelWeights[key] = Math.min(0.5, Math.max(-0.5, this.modelWeights[key]));
      }
    }
    this.modelWeights.baseline_offset += learningRate * error * 0.005;
    this.modelWeights.baseline_offset = Math.min(0.2, Math.max(-0.2, this.modelWeights.baseline_offset));

    console.log(`CognitiveLoadModel: Weights updated based on feedback. Error: ${error.toFixed(2)}`);
  }

  calibrate(calibrationData: TelemetryFeatureVector[]): void {
    // Mock calibration: adjust min/max ranges based on initial observed data
    console.log(`CognitiveLoadModel: Calibrating model with ${calibrationData.length} data points.`);
    calibrationData.forEach(features => {
      // Iterate through all features and update min/max
      for (const featureGroupKey in features) {
        if (typeof features[featureGroupKey] === 'object' && features[featureGroupKey] !== null) {
          for (const featureKey in features[featureGroupKey]) {
            const fullFeatureName = featureKey; // Simplified for this example, would be 'group_feature'
            const value = features[featureGroupKey][featureKey];
            if (typeof value === 'number' && this.featureMinMax[fullFeatureName]) {
              this.featureMinMax[fullFeatureName].min = Math.min(this.featureMinMax[fullFeatureName].min, value);
              this.featureMinMax[fullFeatureName].max = Math.max(this.featureMinMax[fullFeatureName].max, value);
            }
          }
        } else if (typeof features[featureGroupKey] === 'number') {
          const value = features[featureGroupKey];
          if (this.featureMinMax[featureGroupKey]) {
            this.featureMinMax[featureGroupKey].min = Math.min(this.featureMinMax[featureGroupKey].min, value);
            this.featureMinMax[featureGroupKey].max = Math.max(this.featureMinMax[featureGroupKey].max, value);
          }
        }
      }
    });
    console.log("CognitiveLoadModel: Feature normalization ranges updated after calibration.");
  }
}

export class CognitiveLoadEngine {
  private latestFeatureVector: TelemetryFeatureVector | null = null;
  private loadHistory: number[] = [];
  private readonly historyLength: number = 20; // For smoothing
  private readonly predictionIntervalMs: number = 500;
  private predictionTimer: ReturnType<typeof setInterval> | null = null;
  private onCognitiveLoadUpdate: (load: number, confidence: number) => void;
  private userProfileService = UserProfileService.getInstance();
  private taskContextManager = TaskContextManager.getInstance();
  private cognitiveLoadModel: ICognitiveLoadModel; // Pluggable model

  constructor(onUpdate: (load: number, confidence: number) => void, model: ICognitiveLoadModel = new SimpleAdaptiveCognitiveLoadModel()) {
    this.onCognitiveLoadUpdate = onUpdate;
    this.cognitiveLoadModel = model;
    this.predictionTimer = setInterval(this.inferLoad, this.predictionIntervalMs);
  }

  public processFeatures(featureVector: TelemetryFeatureVector): void {
    this.latestFeatureVector = featureVector;
  }

  private inferLoad = (): void => {
    if (!this.latestFeatureVector) {
      // If no new features, report the last smoothed load with assumed confidence
      const lastLoad = this.loadHistory.length > 0 ? this.loadHistory[this.loadHistory.length - 1] : this.userProfileService.getPreferences().personalizedBaselineCLS;
      this.onCognitiveLoadUpdate(lastLoad, 0.7); // Assume medium confidence if no new data
      return;
    }

    const { load: rawLoad, confidence } = this.cognitiveLoadModel.predict(this.latestFeatureVector, this.userProfileService.getPreferences(), this.taskContextManager.getCurrentTask());

    // Apply Exponential Moving Average for smoothing (Eq. 72)
    if (this.loadHistory.length === 0) {
      this.loadHistory.push(rawLoad);
    } else {
      const alpha = 2 / (this.historyLength + 1); // Smoothing factor
      const smoothed = this.loadHistory[this.loadHistory.length - 1] * (1 - alpha) + rawLoad * alpha;
      this.loadHistory.push(smoothed);
    }

    if (this.loadHistory.length > this.historyLength) {
      this.loadHistory.shift();
    }
    const currentSmoothedLoad = this.loadHistory[this.loadHistory.length - 1];

    this.onCognitiveLoadUpdate(currentSmoothedLoad, confidence);
    this.latestFeatureVector = null; // Clear features processed
  };

  public updateModel(model: ICognitiveLoadModel): void {
    this.cognitiveLoadModel = model;
    console.log("CognitiveLoadEngine: Prediction model updated.");
  }

  public feedBackToModel(feedback: Parameters<ICognitiveLoadModel['updateWeights']>[0]): void {
    this.cognitiveLoadModel.updateWeights(feedback);
  }

  public calibrateModel(calibrationData: TelemetryFeatureVector[]): void {
    this.cognitiveLoadModel.calibrate(calibrationData);
  }

  public stop(): void {
    if (this.predictionTimer) {
      clearInterval(this.predictionTimer);
    }
    console.log("CognitiveLoadEngine stopped.");
  }
}

/**
 * Mermaid Diagram 4: UI Adaptation Decision Flow
 * Outlines how UI mode and element states are determined.
 */
export const UI_ADAPTATION_DECISION_FLOW_MERMAID = `
graph TD
    A[Current Cognitive Load Score & Confidence] --> B{Compare to Adaptive Load Thresholds (AdaptiveThresholdManager)};
    C[Current Task Context (TaskContextManager)] --> B;
    D[Current UI Mode] --> B;
    E[User Preferences (UserProfileService)] --> B;
    B -- Hysteresis & Sustained Load Logic --> F[New UI Mode];
    F --> G[AdaptationPolicyManager];
    H[UI Element Type] --> G;
    I[Proposed Adaptation Strategy & Intensity] --> G;
    G --> J{Get UI Element State (isVisible, className, styles, etc.)};
    J --> K[Rendered UI Component];
    K -- User Interaction --> FeedbackLoopManager[Feedback Loop Manager];
    FeedbackLoopManager --> B;
    FeedbackLoopManager --> E;
`;

/**
 * Claim 6: Context-Aware Adaptation Policies.
 * "The AdaptationPolicyManager ensures that UI changes are not arbitrary but are driven by context-aware rules. It combines general mode-based policies with user-specific preferences and real-time element types to deliver highly targeted and effective interface modifications."
 *
 * Disproof & Bulletproofing: "Context-aware" goes deeper when policies consider not just mode and type, but also task urgency, user fatigue (proxied by cognitive load), and explicit feedback. "Highly targeted and effective" requires evaluating the *outcome* of an adaptation. Adding `progressive_disclosure` and `temporal_pacing` as strategies moves beyond simple hiding/showing. Policies should also have an `intensity` parameter. The goal is not just to change, but to change *optimally*.
 */
export class AdaptationPolicyManager {
  private static instance: AdaptationPolicyManager;
  private userProfileService = UserProfileService.getInstance();
  private taskContextManager = TaskContextManager.getInstance();

  private constructor() {}

  public static getInstance(): AdaptationPolicyManager {
    if (!AdaptationPolicyManager.instance) {
      AdaptationPolicyManager.instance = new AdaptationPolicyManager();
    }
    return AdaptationPolicyManager.instance;
  }

  // Define default or A/B testable policies.
  // In a real system, these would be fetched from a configuration service or derived from ML models.
  private getDefaultPolicyForMode(mode: UiMode, elementType: UiElementType): 'obscure' | 'deemphasize' | 'reposition' | 'summarize' | 'highlight' | 'segment' | 'none' | 'progressive_disclosure' | 'temporal_pacing' {
    const currentTask = this.taskContextManager.getCurrentTask();
    const isCriticalTask = currentTask?.complexity === 'critical' || currentTask?.urgency === 'immediate';

    switch (mode) {
      case 'standard':
        return 'none'; // All visible, fully interactive
      case 'focus':
        if (elementType === UiElementType.SECONDARY) return 'deemphasize';
        if (elementType === UiElementType.TERTIARY || elementType === UiElementType.DYNAMIC_CONTENT) return 'obscure';
        if (elementType === UiElementType.HINT_CONTEXTUAL) return 'highlight'; // Highlight relevant hints
        if (elementType === UiElementType.CRITICAL_ACTION && isCriticalTask) return 'highlight'; // Prioritize critical task actions
        return 'none';
      case 'minimal':
        if (elementType === UiElementType.SECONDARY || elementType === UiElementType.TERTIARY || elementType === UiElementType.DYNAMIC_CONTENT || elementType === UiElementType.DATA_DISPLAY) return 'obscure';
        if (elementType === UiElementType.CRITICAL_ACTION) return 'highlight'; // Ensure critical actions are visible
        if (elementType === UiElementType.HINT_CONTEXTUAL) return 'summarize'; // Summarize hints to save space
        return 'none'; // Primary and global nav elements still shown
      case 'guided': // New mode: Focus on guided path, de-emphasize distractions
        if (elementType === UiElementType.SECONDARY || elementType === UiElementType.TERTIARY || elementType === UiElementType.DYNAMIC_CONTENT || elementType === UiElementType.DATA_DISPLAY) return 'obscure';
        if (elementType === UiElementType.GUIDED) return 'highlight'; // Guided elements are prominent
        if (elementType === UiElementType.PRIMARY) return 'deemphasize'; // Primary might be deemphasized to focus on guided path
        if (elementType === UiElementType.CRITICAL_ACTION) return 'segment'; // Segment to break down complex actions
        if (elementType === UiElementType.FORM_INPUT && isCriticalTask) return 'temporal_pacing'; // Slow down form input for critical tasks
        return 'none';
      case 'crisis': // New: Extreme load, only critical actions and emergency info
        if (elementType === UiElementType.CRITICAL_ACTION || elementType === UiElementType.FEEDBACK_NOTIFICATION) return 'highlight';
        if (elementType === UiElementType.PRIMARY || elementType === UiElementType.NAV_GLOBAL) return 'summarize'; // Summarize nav
        if (elementType === UiElementType.STATUS_INDICATOR) return 'highlight'; // Critical status (e.g., error messages)
        return 'obscure'; // Hide almost everything else
      case 'recovery': // New: Transition mode after crisis, gradually restore UI
        if (elementType === UiElementType.CRITICAL_ACTION || elementType === UiElementType.FEEDBACK_NOTIFICATION) return 'none';
        if (elementType === UiElementType.PRIMARY || elementType === UiElementType.NAV_GLOBAL) return 'none';
        if (elementType === UiElementType.SECONDARY) return 'deemphasize'; // Re-introduce secondary elements but deemphasized
        if (elementType === UiElementType.DYNAMIC_CONTENT) return 'progressive_disclosure'; // Introduce complex content progressively
        return 'obscure';
      case 'calibration': // Special mode for user onboarding or system recalibration
        return 'none'; // Show all elements, possibly with overlays for instructions
      case 'learning': // System is observing without aggressive adaptation
        return 'none'; // Minimal intervention
      default:
        return 'none';
    }
  }

  public getUiElementState(mode: UiMode, elementType: UiElementType): { isVisible: boolean; className: string; adaptationStrategy: string; customStyles?: React.CSSProperties } {
    const userPolicy = this.userProfileService.getPreferences().adaptationPolicySelection[mode]?.[elementType];
    const policy = userPolicy || this.getDefaultPolicyForMode(mode, elementType);

    let isVisible = true;
    let className = `${elementType}-element`;
    let adaptationStrategy = policy;
    let customStyles: React.CSSProperties | undefined = undefined;

    switch (policy) {
      case 'obscure':
        isVisible = false; // Completely hide
        break;
      case 'deemphasize':
        className += ` mode-${mode}-deemphasize`;
        customStyles = { opacity: 0.15, filter: 'blur(2px) grayscale(80%)', pointerEvents: 'none' };
        break;
      case 'reposition':
        className += ` mode-${mode}-reposition`; // Placeholder for repositioning logic
        // This would require more sophisticated CSS or JS manipulation, e.g., using a portal for critical actions
        customStyles = { order: -1 }; // Example: move to front in a flex container
        break;
      case 'summarize':
        className += ` mode-${mode}-summarize`; // Placeholder for summarization logic (e.g., replace a detailed list with a single link)
        customStyles = { maxHeight: '50px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' };
        break;
      case 'highlight':
        className += ` mode-${mode}-highlight`;
        customStyles = { border: `2px solid var(--highlight-color-${mode})`, boxShadow: `0 0 8px var(--highlight-color-${mode}-alpha)` };
        break;
      case 'segment':
        className += ` mode-${mode}-segment`; // Break down complex components into smaller steps
        break;
      case 'progressive_disclosure':
        className += ` mode-${mode}-progressive-disclosure`;
        customStyles = { maxHeight: '100px', overflow: 'hidden', cursor: 'pointer', border: '1px dashed #bbb' }; // initially collapsed
        break;
      case 'temporal_pacing':
        className += ` mode-${mode}-temporal-pacing`;
        customStyles = { animation: 'slow-input-hint 2s infinite', transition: 'all 0.5s ease-in-out' }; // Slow down interaction for form fields
        break;
      case 'none':
      default:
        // Default visibility and class name
        break;
    }

    return { isVisible, className, adaptationStrategy, customStyles };
  }
}

// Adaptive Threshold Manager
export class AdaptiveThresholdManager {
  private static instance: AdaptiveThresholdManager;
  private userProfileService = UserProfileService.getInstance();
  private listeners: Set<(thresholds: UserPreferences['cognitiveLoadThresholds']) => void> = new Set();

  private constructor() {
    this.userProfileService.subscribe(prefs => this.notifyListeners(prefs.cognitiveLoadThresholds));
  }

  public static getInstance(): AdaptiveThresholdManager {
    if (!AdaptiveThresholdManager.instance) {
      AdaptiveThresholdManager.instance = new AdaptiveThresholdManager();
    }
    return AdaptiveThresholdManager.instance;
  }

  /**
   * Claim: Adaptive Thresholds for Dynamic Sensitivity.
   * "The AdaptiveThresholdManager dynamically adjusts cognitive load thresholds based on sustained user performance, explicit feedback, and changing user context (e.g., task urgency, cognitive reserve), moving beyond fixed thresholds to reflect the user's current capacity more accurately."
   *
   * This is crucial for "homeostasis for eternity." Fixed thresholds are brittle. This function updates them.
   */
  public adjustThresholds(currentLoad: number, adaptationOutcome: 'success' | 'failure' | 'neutral', userFeedback: 'helpful' | 'unhelpful' | 'none' = 'none'): void {
    const prefs = this.userProfileService.getPreferences();
    let thresholds = { ...prefs.cognitiveLoadThresholds };

    const learningRate = 0.01; // Eq. 104
    const decayRate = 0.005; // Eq. 83

    // Adjust 'adaptive' thresholds based on feedback and observed load
    if (userFeedback === 'helpful' || adaptationOutcome === 'success') {
      // If helpful/successful, thresholds were likely appropriate or slightly too high.
      // Make them slightly more sensitive (lower for high thresholds, higher for low thresholds)
      thresholds.adaptiveHigh = Math.max(thresholds.low + 0.05, thresholds.adaptiveHigh - learningRate * 0.5);
      thresholds.adaptiveCritical = Math.max(thresholds.high + 0.05, thresholds.adaptiveCritical - learningRate);
    } else if (userFeedback === 'unhelpful' || adaptationOutcome === 'failure') {
      // If unhelpful/failure, thresholds might have been too sensitive or not sensitive enough
      // Push them away from current load, making them less reactive in the current context
      if (currentLoad > thresholds.adaptiveHigh) {
        thresholds.adaptiveHigh = Math.min(thresholds.critical - 0.05, thresholds.adaptiveHigh + learningRate * 0.5);
      }
      if (currentLoad > thresholds.adaptiveCritical) {
        thresholds.adaptiveCritical = Math.min(0.95, thresholds.adaptiveCritical + learningRate);
      }
    }

    // Gradual decay towards baseline to prevent thresholds from drifting too far
    thresholds.adaptiveHigh += (prefs.cognitiveLoadThresholds.high - thresholds.adaptiveHigh) * decayRate;
    thresholds.adaptiveLow += (prefs.cognitiveLoadThresholds.low - thresholds.adaptiveLow) * decayRate;
    thresholds.adaptiveCritical += (prefs.cognitiveLoadThresholds.critical - thresholds.adaptiveCritical) * decayRate;

    // Ensure hysteresis (Upper_Threshold > Lower_Threshold, Eq. 84)
    thresholds.adaptiveHigh = Math.max(thresholds.adaptiveHigh, thresholds.adaptiveLow + 0.1);
    thresholds.adaptiveCritical = Math.max(thresholds.adaptiveCritical, thresholds.adaptiveHigh + 0.1);

    this.userProfileService.updatePreferences({ cognitiveLoadThresholds: thresholds });
    console.log("AdaptiveThresholdManager: Thresholds adjusted.", thresholds);
  }

  public getAdaptiveThresholds(): UserPreferences['cognitiveLoadThresholds'] {
    return this.userProfileService.getPreferences().cognitiveLoadThresholds;
  }

  public subscribe(listener: (thresholds: UserPreferences['cognitiveLoadThresholds']) => void): () => void {
    this.listeners.add(listener);
    listener(this.getAdaptiveThresholds());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(thresholds: UserPreferences['cognitiveLoadThresholds']): void {
    this.listeners.forEach(listener => listener(thresholds));
  }
}

// Feedback Loop Manager
export class FeedbackLoopManager {
  private static instance: FeedbackLoopManager;
  private userProfileService = UserProfileService.getInstance();
  private cognitiveLoadEngine: CognitiveLoadEngine | null = null;
  private adaptiveThresholdManager = AdaptiveThresholdManager.getInstance();

  private constructor() {}

  public static getInstance(): FeedbackLoopManager {
    if (!FeedbackLoopManager.instance) {
      FeedbackLoopManager.instance = new FeedbackLoopManager();
    }
    return FeedbackLoopManager.instance;
  }

  public registerCognitiveLoadEngine(engine: CognitiveLoadEngine): void {
    this.cognitiveLoadEngine = engine;
  }

  /**
   * Claim: Closed-Loop Adaptation via Feedback.
   * "The FeedbackLoopManager closes the adaptive loop by processing both explicit user feedback and implicitly inferred adaptation outcomes, using this intelligence to refine the cognitive load model weights and dynamically adjust adaptation thresholds, ensuring the system continuously learns and optimizes itself."
   *
   * This is central to "bulletproof" and "homeostasis for eternity." Without learning from outcomes, the system cannot improve.
   */
  public recordAdaptationFeedback(
    adaptationId: string, // Unique ID for this adaptation instance
    appliedUiMode: UiMode,
    preAdaptationLoad: number,
    postAdaptationLoad: number,
    implicitOutcome: 'success' | 'failure' | 'neutral', // e.g., error rate decreased/increased, task speed improved
    explicitFeedback: 'helpful' | 'unhelpful' | 'none' = 'none',
    associatedFeatureVector?: TelemetryFeatureVector // The feature vector that led to this adaptation
  ): void {
    // 1. Log explicit feedback in user profile
    if (explicitFeedback !== 'none') {
      this.userProfileService.addExplicitFeedback({ adaptationId, rating: explicitFeedback, predictedLoad: preAdaptationLoad });
    }

    // 2. Determine overall outcome for model/threshold adjustment
    let combinedOutcome: 'success' | 'failure' | 'neutral' = implicitOutcome;
    if (explicitFeedback === 'helpful') combinedOutcome = 'success';
    else if (explicitFeedback === 'unhelpful') combinedOutcome = 'failure';

    // 3. Inform AdaptiveThresholdManager
    this.adaptiveThresholdManager.adjustThresholds(preAdaptationLoad, combinedOutcome, explicitFeedback);

    // 4. Inform CognitiveLoadEngine for model weight updates
    if (this.cognitiveLoadEngine && associatedFeatureVector) {
      // Map outcome to a target load value for regression-like update
      const targetLoadDelta = (combinedOutcome === 'success' ? -0.1 : combinedOutcome === 'failure' ? 0.1 : 0);
      const predictedLoad = preAdaptationLoad; // Or the actual prediction from the engine
      const actualOutcomeLoad = Math.min(1, Math.max(0, predictedLoad + targetLoadDelta)); // Simplified target

      this.cognitiveLoadEngine.feedBackToModel({
        features: associatedFeatureVector,
        actualOutcome: actualOutcomeLoad,
        predictedLoad: predictedLoad,
      });
    }

    console.log(`FeedbackLoopManager: Recorded feedback for adaptation ${adaptationId}. Outcome: ${combinedOutcome}, Explicit: ${explicitFeedback}`);
  }
}


// System Health Monitor
export class SystemHealthMonitor {
  private static instance: SystemHealthMonitor;
  private healthStatus: { [key: string]: 'ok' | 'degraded' | 'failed' | 'unknown' } = {};
  private listeners: Set<(status: typeof this.healthStatus) => void> = new Set();
  private errorLogger = InteractionErrorLogger.getInstance();
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.checkInterval = setInterval(() => this.performHealthChecks(), 5000); // Check every 5 seconds
  }

  public static getInstance(): SystemHealthMonitor {
    if (!SystemHealthMonitor.instance) {
      SystemHealthMonitor.instance = new SystemHealthMonitor();
    }
    return SystemHealthMonitor.instance;
  }

  public reportHealth(component: string, status: typeof this.healthStatus[string]): void {
    if (this.healthStatus[component] !== status) {
      this.healthStatus = { ...this.healthStatus, [component]: status };
      console.warn(`SystemHealthMonitor: Component ${component} status changed to ${status}`);
      if (status === 'failed' || status === 'degraded') {
        this.errorLogger.logError({
          type: 'systemFallback',
          message: `System component ${component} is ${status}`,
          severity: status === 'failed' ? 'critical' : 'high',
          errorCode: `SYS_HEALTH_${status.toUpperCase()}`,
        });
      }
      this.notifyListeners();
    }
  }

  public getHealthStatus(): typeof this.healthStatus {
    return { ...this.healthStatus };
  }

  public subscribe(listener: (status: typeof this.healthStatus) => void): () => void {
    this.listeners.add(listener);
    listener(this.healthStatus);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.healthStatus));
  }

  private performHealthChecks(): void {
    // Mock health checks for key components
    // In a real system, these would be more elaborate, checking internal states, buffer lengths, processing times, etc.
    this.reportHealth('TelemetryAgent', Math.random() < 0.99 ? 'ok' : 'degraded');
    this.reportHealth('CognitiveLoadEngine', Math.random() < 0.98 ? 'ok' : 'degraded');
    this.reportHealth('TaskContextManager', 'ok'); // Usually stable
    this.reportHealth('UserProfileService', 'ok'); // Usually stable
    this.reportHealth('AdaptationPolicyManager', 'ok'); // Usually stable
    this.reportHealth('AdaptiveThresholdManager', 'ok'); // Usually stable
    this.reportHealth('FeedbackLoopManager', 'ok'); // Usually stable

    // If critical components are degraded/failed, AdaptiveUIProvider should react
  }

  public stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}


/**
 * Mermaid Diagram 5: Global System Architecture
 * Overview of how all major components interact.
 */
export const GLOBAL_SYSTEM_ARCHITECTURE_MERMAID = `
graph LR
    subgraph User Interaction Layer
        A[User Input (Mouse, Keyboard, Gaze, Biosignals)] --> B[UI Components (AdaptableComponent)];
        B -- Renders UI based on --> C[AdaptiveUIProvider Context];
    end

    subgraph Telemetry & Feature Extraction
        A --> D[TelemetryAgent];
        D -- RawTelemetryEvent Buffer (Privacy Filtered) --> E[TelemetryAgent.flushBuffer()];
        E -- TelemetryFeatureVector --> F[CognitiveLoadEngine];
    end

    subgraph Cognitive Load Management
        F -- Cognitive Load Score & Confidence --> C;
        C -- UI Mode Transitions --> G[AdaptationPolicyManager];
        G -- Adaptation Rules & Styles --> B;
        C -- Adaptation Outcomes --> FBL[FeedbackLoopManager];
        FBL -- Updates --> F;
        FBL -- Adjusts --> ATM[AdaptiveThresholdManager];
        ATM -- Provides Adaptive Thresholds --> C;
    end

    subgraph Contextual & Core Services
        H[UserProfileService] -- Preferences & Thresholds --> C;
        H --> G;
        H --> ATM;
        H --> D;
        I[TaskContextManager] -- Current Task --> C;
        I --> F;
        J[InteractionErrorLogger] -- Errors --> F;
        D --> J;
        SM[SystemHealthMonitor] -- Health Status --> C;
        SM --> J;
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px;
    style C fill:#ccf,stroke:#333,stroke-width:2px;
    style F fill:#cfc,stroke:#333,stroke-width:2px;
    style FBL fill:#ffcc99,stroke:#333,stroke-width:2px;
    style ATM fill:#cceeff,stroke:#333,stroke-width:2px;
    style SM fill:#ffddbb,stroke:#333,stroke-width:2px;
`;

/**
 * Mermaid Diagram 6: UI Component Lifecycle with Adaptation
 * How individual components interact with the AdaptiveUIProvider.
 */
export const UI_COMPONENT_LIFECYCLE_MERMAID = `
sequenceDiagram
    participant C as AdaptiveUIProvider
    participant H as useCognitiveLoadBalancer
    participant E as AdaptableComponent
    participant EL as UI Element (e.g., div, button)
    participant APM as AdaptationPolicyManager
    participant FBL as FeedbackLoopManager

    E->>H: useUiElement(id, uiType)
    H->>C: registerUiElement(id, uiType)
    C-->>H: Returns isVisible, className, uiMode, adaptationStrategy
    H-->>E: Returns isVisible, className, adaptationStrategy, customStyles
    E->>EL: Render (or null if not visible) with className & customStyles

    loop Cognitive Load Changes
        C->>C: CognitiveLoadEngine.onCognitiveLoadUpdate(load, confidence)
        C->>C: Recalculate uiMode based on load, thresholds, task, preferences
        C->>C: (Triggered Adaptation: Store pre-adaptation state & features)
        C->>H: Notify useCognitiveLoadBalancer consumers (React re-render)
        H->>E: Trigger re-render
        E->>APM: getUiElementState(uiMode, uiType)
        APM-->>E: Returns updated isVisible, className, adaptationStrategy, customStyles
        E->>EL: Re-render with new state/classes/styles
        C->>FBL: Record Adaptation (post-adaptation observed outcomes)
    end

    E->>H: Component Unmount
    H->>C: unregisterUiElement(id)
`;


// --- Adaptive UI Orchestrator (React Context/Hook) ---
interface CognitiveLoadContextType {
  cognitiveLoad: number;
  cognitiveLoadConfidence: number; // New: expose prediction confidence
  uiMode: UiMode;
  setUiMode: React.Dispatch<React.SetStateAction<UiMode>>; // Exposed for potential explicit user override or debug
  currentTask: TaskContext | null; // Expose current task
  systemHealth: { [key: string]: 'ok' | 'degraded' | 'failed' | 'unknown' }; // Expose system health
  registerUiElement: (id: string, uiType: UiElementType) => void;
  unregisterUiElement: (id: string) => void;
  isElementVisible: (id: string, uiType: UiElementType) => boolean;
  getUiModeClassName: (uiType: UiElementType) => string;
  getUiElementAdaptationStrategy: (uiType: UiElementType) => string; // New: expose strategy
  getUiElementCustomStyles: (uiType: UiElementType) => React.CSSProperties | undefined; // New: expose custom styles
  sendExplicitFeedback: (adaptationId: string, rating: 'helpful' | 'unhelpful') => void; // Allow UI to send feedback
  getAdaptiveThresholds: () => UserPreferences['cognitiveLoadThresholds']; // Expose adaptive thresholds for transparency
}

const CognitiveLoadContext = createContext<CognitiveLoadContextType | undefined>(undefined);

// Hook to provide cognitive load and UI mode throughout the application
export const useCognitiveLoadBalancer = (): CognitiveLoadContextType => {
  const context = useContext(CognitiveLoadContext);
  if (context === undefined) {
    throw new Error('useCognitiveLoadBalancer must be used within a CognitiveLoadProvider');
  }
  return context;
};

/**
 * Claim 7: Seamless Integration with React Components.
 * "The `useUiElement` hook provides a declarative and idiomatic React interface for components to become adaptive. By simply specifying an ID and a UI type, components can automatically respond to global cognitive load changes without complex manual state management."
 *
 * Disproof & Bulletproofing: "Seamless" means more than just visibility and class names. Components often need direct styling or structural changes. Exposing `adaptationStrategy` and `customStyles` directly makes the hook more powerful, enabling deeper adaptations within the component itself rather than relying solely on global CSS. Allowing components to "suggest" strategies (via `preferredStrategy` prop) further bulletproofs adaptation by respecting component-level design constraints.
 */
// Hook for individual UI elements to adapt
export const useUiElement = (id: string, uiType: UiElementType) => {
  const { registerUiElement, unregisterUiElement, isElementVisible, getUiModeClassName, getUiElementAdaptationStrategy, getUiElementCustomStyles } = useCognitiveLoadBalancer();

  useEffect(() => {
    registerUiElement(id, uiType);
    return () => {
      unregisterUiElement(id);
    };
  }, [id, uiType, registerUiElement, unregisterUiElement]);

  const isVisible = isElementVisible(id, uiType);
  const className = getUiModeClassName(uiType);
  const adaptationStrategy = getUiElementAdaptationStrategy(uiType);
  const customStyles = getUiElementCustomStyles(uiType);

  return { isVisible, className, adaptationStrategy, customStyles };
};


/**
 * Mermaid Diagram 7: UI Mode State Transitions
 * Illustrates the state machine for UI mode changes based on cognitive load.
 */
export const UI_MODE_STATE_TRANSITIONS_MERMAID = `
stateDiagram-v2
    [*] --> Standard

    Standard --> Focus : cognitiveLoad > adaptiveThresholds.high
    Focus --> Standard : cognitiveLoad < adaptiveThresholds.low

    Focus --> Guided : cognitiveLoad > adaptiveThresholds.guided AND taskComplexity AND userPrefersGuidance
    Guided --> Focus : cognitiveLoad < adaptiveThresholds.guidedLow OR NOT taskComplexity

    Focus --> Minimal : cognitiveLoad > adaptiveThresholds.critical
    Standard --> Minimal : cognitiveLoad > adaptiveThresholds.critical
    Minimal --> Focus : cognitiveLoad < adaptiveThresholds.criticalLow

    Minimal --> Crisis : cognitiveLoad > adaptiveThresholds.crisis AND sustainedCriticalLoad AND systemHealthOK
    Crisis --> Recovery : cognitiveLoad < adaptiveThresholds.recovery AND externalIntervention/resolution
    Recovery --> Standard : cognitiveLoad < adaptiveThresholds.low
    Recovery --> Focus : cognitiveLoad < adaptiveThresholds.high

    Any --> Calibration : Explicit Calibration Command
    Calibration --> Learning : Calibration Complete
    Learning --> Standard : Learning Period Complete OR Stable Load
    Learning --> Focus : Observed Load increase during Learning

    Note right of Crisis: System Health is a precondition for severe modes
`;

// Provider component for the Cognitive Load Balancing system
export const CognitiveLoadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cognitiveLoad, setCognitiveLoad] = useState<number>(0.0);
  const [cognitiveLoadConfidence, setCognitiveLoadConfidence] = useState<number>(0.7);
  const [uiMode, setUiMode] = useState<UiMode>('standard');
  const [currentTask, setCurrentTask] = useState<TaskContext | null>(null);
  const [systemHealth, setSystemHealth] = useState<ReturnType<SystemHealthMonitor['getHealthStatus']>>({});
  const [adaptiveThresholds, setAdaptiveThresholds] = useState<UserPreferences['cognitiveLoadThresholds']>(UserProfileService.getInstance().getPreferences().cognitiveLoadThresholds);


  const registeredUiElements = useRef(new Map<string, UiElementType>());
  const userProfileService = UserProfileService.getInstance();
  const taskContextManager = TaskContextManager.getInstance();
  const adaptationPolicyManager = AdaptationPolicyManager.getInstance();
  const adaptiveThresholdManager = AdaptiveThresholdManager.getInstance();
  const systemHealthMonitor = SystemHealthMonitor.getInstance();
  const feedbackLoopManager = FeedbackLoopManager.getInstance();

  const sustainedLoadCounter = useRef(0);
  const sustainedLoadDurationMs = 1500; // Eq. 84: Hysteresis Threshold Logic
  const checkIntervalMs = 500;

  // Track previous state for feedback loop
  const prevUiModeRef = useRef<UiMode>(uiMode);
  const prevLoadRef = useRef<number>(cognitiveLoad);
  const lastFeatureVectorRef = useRef<TelemetryFeatureVector | null>(null);

  // Initialize Telemetry Agent and Cognitive Load Engine
  useEffect(() => {
    const cognitiveLoadEngine = new CognitiveLoadEngine((load, confidence) => {
      prevLoadRef.current = cognitiveLoad; // Capture load BEFORE new update
      setCognitiveLoad(load);
      setCognitiveLoadConfidence(confidence);
    });
    feedbackLoopManager.registerCognitiveLoadEngine(cognitiveLoadEngine);

    const telemetryAgent = new TelemetryAgent((features: TelemetryFeatureVector) => {
      cognitiveLoadEngine.processFeatures(features);
      lastFeatureVectorRef.current = features; // Store for feedback
    });

    // Subscribe to task context changes
    const unsubscribeTask = taskContextManager.subscribe(setCurrentTask);
    // Subscribe to system health changes
    const unsubscribeHealth = systemHealthMonitor.subscribe(setSystemHealth);
    // Subscribe to adaptive threshold changes
    const unsubscribeThresholds = adaptiveThresholdManager.subscribe(setAdaptiveThresholds);

    return () => {
      telemetryAgent?.stop();
      cognitiveLoadEngine?.stop();
      taskContextManager?.stop();
      systemHealthMonitor?.stop();
      unsubscribeTask();
      unsubscribeHealth();
      unsubscribeThresholds();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Effect to manage UI mode transitions based on cognitive load with hysteresis and sustained duration
  useEffect(() => {
    const interval = setInterval(() => {
      const currentMode = uiMode;
      const prefs = userProfileService.getPreferences();
      const thresholds = adaptiveThresholds; // Use adaptive thresholds
      const taskComplexityHigh = currentTask?.complexity === 'critical' || currentTask?.complexity === 'high';
      const userPrefersGuidance = prefs.preferenceForGuidance > 0.5;
      const isSystemHealthy = systemHealthMonitor.getHealthStatus().CognitiveLoadEngine === 'ok' && systemHealthMonitor.getHealthStatus().TelemetryAgent === 'ok';

      let newMode: UiMode = currentMode;
      let shouldTransition = false;

      // Eq. 84: Hysteresis Threshold Logic applied here.
      // Priority: Crisis > Minimal > Guided > Focus > Standard > Recovery

      // CRISIS mode: Highest priority, requires extreme load AND healthy system to adapt (otherwise, maybe recovery is better)
      if (cognitiveLoad >= thresholds.crisis && currentMode !== 'crisis' && isSystemHealthy) {
        newMode = 'crisis';
        shouldTransition = true;
      } else if (cognitiveLoad < thresholds.recovery && currentMode === 'crisis') {
        newMode = 'recovery'; // Transition from Crisis to Recovery (system stabilizing)
        shouldTransition = true;
      } else if (cognitiveLoad >= thresholds.adaptiveCritical && currentMode !== 'minimal' && currentMode !== 'crisis') {
        newMode = 'minimal';
        shouldTransition = true;
      } else if (cognitiveLoad < thresholds.criticalLow && currentMode === 'minimal') {
        newMode = 'focus'; // From minimal, step down to focus
        shouldTransition = true;
      } else if (cognitiveLoad >= thresholds.guided && taskComplexityHigh && userPrefersGuidance && currentMode !== 'guided' && currentMode !== 'minimal' && currentMode !== 'crisis') {
        // High load AND complex task AND user prefers guidance -> Guided mode
        newMode = 'guided';
        shouldTransition = true;
      } else if (cognitiveLoad < thresholds.guidedLow && currentMode === 'guided') {
        // Low load or task no longer complex -> revert from Guided
        newMode = 'focus'; // Typically Guided -> Focus, then Focus -> Standard
        shouldTransition = true;
      } else if (cognitiveLoad >= thresholds.adaptiveHigh && currentMode === 'standard') {
        newMode = 'focus';
        shouldTransition = true;
      } else if (cognitiveLoad < thresholds.adaptiveLow && currentMode === 'focus') {
        newMode = 'standard';
        shouldTransition = true;
      } else if (cognitiveLoad < thresholds.recovery && currentMode === 'recovery') {
        // Post-crisis recovery, back to normal load
        newMode = 'standard';
        shouldTransition = true;
      }

      // Add 'learning' mode transition logic (e.g., after calibration or during specific tasks)
      if (currentMode === 'calibration' && cognitiveLoad < thresholds.low && currentTask?.id === 'system_calibration_complete') {
        newMode = 'learning'; // Move to learning after calibration
        shouldTransition = true;
      } else if (currentMode === 'learning' && cognitiveLoad >= thresholds.high) {
        // If load rises during learning, switch to adaptive mode
        newMode = 'focus';
        shouldTransition = true;
      }


      if (shouldTransition && newMode !== currentMode) {
        sustainedLoadCounter.current += checkIntervalMs;
        if (sustainedLoadCounter.current >= sustainedLoadDurationMs) {
          console.log(`UI Mode Transition: ${currentMode} -> ${newMode} (Cognitive Load: ${cognitiveLoad.toFixed(2)}, Confidence: ${cognitiveLoadConfidence.toFixed(2)})`);
          setUiMode(newMode);
          sustainedLoadCounter.current = 0; // Reset after successful transition

          // Record this adaptation for the feedback loop (implicit outcome can be 'neutral' initially)
          feedbackLoopManager.recordAdaptationFeedback(
            `mode-transition-${currentMode}-to-${newMode}-${performance.now()}`,
            newMode,
            prevLoadRef.current, // Load before this transition
            cognitiveLoad, // Load after this transition
            'neutral', // Implicit outcome to be determined later or from user action
            'none',
            lastFeatureVectorRef.current // Pass the features that led to this decision
          );
        }
      } else {
        sustainedLoadCounter.current = 0; // Reset counter if conditions change or load is not sustained
      }
      prevUiModeRef.current = uiMode; // Update previous UI mode for next cycle
    }, checkIntervalMs);

    return () => clearInterval(interval);
  }, [cognitiveLoad, uiMode, currentTask, adaptiveThresholds, sustainedLoadDurationMs, userProfileService, cognitiveLoadConfidence, systemHealth, feedbackLoopManager]);


  const registerUiElement = useCallback((id: string, type: UiElementType) => {
    registeredUiElements.current.set(id, type);
  }, []);

  const unregisterUiElement = useCallback((id: string) => {
    registeredUiElements.current.delete(id);
  }, []);

  const isElementVisible = useCallback((id: string, type: UiElementType): boolean => {
    const { isVisible } = adaptationPolicyManager.getUiElementState(uiMode, type);
    return isVisible;
  }, [uiMode, adaptationPolicyManager]);

  const getUiModeClassName = useCallback((uiType: UiElementType): string => {
    const { className } = adaptationPolicyManager.getUiElementState(uiMode, uiType);
    return className;
  }, [uiMode, adaptationPolicyManager]);

  const getUiElementAdaptationStrategy = useCallback((uiType: UiElementType): string => {
    const { adaptationStrategy } = adaptationPolicyManager.getUiElementState(uiMode, uiType);
    return adaptationStrategy;
  }, [uiMode, adaptationPolicyManager]);

  const getUiElementCustomStyles = useCallback((uiType: UiElementType): React.CSSProperties | undefined => {
    const { customStyles } = adaptationPolicyManager.getUiElementState(uiMode, uiType);
    return customStyles;
  }, [uiMode, adaptationPolicyManager]);

  const sendExplicitFeedback = useCallback((adaptationId: string, rating: 'helpful' | 'unhelpful') => {
    // This is a simplified call; in a real app, you'd pass more context (e.g., features, mode, etc.)
    feedbackLoopManager.recordAdaptationFeedback(
      adaptationId,
      uiMode,
      cognitiveLoad, // Current load when feedback is given
      cognitiveLoad, // Assume post-adaptation load is current load
      'neutral',
      rating,
      lastFeatureVectorRef.current
    );
  }, [uiMode, cognitiveLoad, feedbackLoopManager]);

  const contextValue = {
    cognitiveLoad,
    cognitiveLoadConfidence,
    uiMode,
    setUiMode,
    currentTask,
    systemHealth,
    registerUiElement,
    unregisterUiElement,
    isElementVisible,
    getUiModeClassName,
    getUiElementAdaptationStrategy,
    getUiElementCustomStyles,
    sendExplicitFeedback,
    getAdaptiveThresholds: adaptiveThresholdManager.getAdaptiveThresholds,
  };

  /**
   * Claim 8: The AdaptiveUIProvider acts as the central orchestration hub.
   * "By encapsulating the core logic for telemetry, cognitive load inference, and UI adaptation, the CognitiveLoadProvider establishes itself as the central orchestration hub, enabling a decoupled yet synchronized adaptive UI system across the entire application."
   *
   * Disproof & Bulletproofing: "Orchestration hub" implies robustness and self-awareness. Bulletproofing means the hub *monitors its own health* (SystemHealthMonitor) and actively manages `AdaptiveThresholdManager` and `FeedbackLoopManager`. A truly bulletproof hub also has fail-safe mechanisms if core components fail (e.g., revert to 'standard' or 'recovery' if `CognitiveLoadEngine` is degraded). The enhanced context value now exposes more insights, further solidifying its role as the central truth for adaptation.
   */
  return (
    <CognitiveLoadContext.Provider value={contextValue}>
      <div className={`app-container mode-${uiMode}`}>
        {children}
        {/* Global styles for UI modes, dynamically inserted */}
        <style>{`
          :root {
            --highlight-color-focus: #007bff;
            --highlight-color-focus-alpha: rgba(0, 123, 255, 0.5);
            --highlight-color-guided: #28a745;
            --highlight-color-guided-alpha: rgba(40, 167, 69, 0.5);
            --highlight-color-crisis: #dc3545;
            --highlight-color-crisis-alpha: rgba(220, 53, 69, 0.7);
          }
          .app-container.mode-focus .secondary-element.mode-focus-deemphasize {
            opacity: 0.15;
            pointer-events: none; /* Disable interaction */
            filter: blur(2px) grayscale(80%);
            transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out;
          }
          .app-container.mode-minimal .secondary-element,
          .app-container.mode-guided .secondary-element {
            opacity: 0;
            pointer-events: none;
            height: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
            transition: opacity 0.5s ease-in-out, height 0.5s ease-in-out, margin 0.5s ease-in-out, padding 0.5s ease-in-out;
          }
          .app-container.mode-focus .tertiary-element,
          .app-container.mode-minimal .tertiary-element,
          .app-container.mode-guided .tertiary-element {
            display: none; /* Fully hide tertiary elements */
            transition: display 0.5s ease-in-out;
          }
          .app-container.mode-guided .guided-element,
          .app-container.mode-guided .guided-element.mode-guided-highlight {
            border: 2px solid var(--highlight-color-guided);
            background-color: #e6ffed;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: 0 0 8px var(--highlight-color-guided-alpha);
            transition: all 0.3s ease-in-out;
          }
          .app-container.mode-crisis .critical_action-element.mode-crisis-highlight {
            border: 3px solid var(--highlight-color-crisis);
            background-color: #fff0f0;
            color: var(--highlight-color-crisis);
            font-weight: bold;
            box-shadow: 0 0 10px var(--highlight-color-crisis-alpha);
            animation: pulse-red 1.5s infinite;
            transition: all 0.3s ease-in-out;
          }
          @keyframes pulse-red {
            0% { transform: scale(1); box-shadow: 0 0 10px var(--highlight-color-crisis-alpha); }
            50% { transform: scale(1.02); box-shadow: 0 0 15px var(--highlight-color-crisis-alpha); }
            100% { transform: scale(1); box-shadow: 0 0 10px var(--highlight-color-crisis-alpha); }
          }
          .app-container.mode-crisis .primary-element.mode-crisis-summarize,
          .app-container.mode-crisis .nav_global-element.mode-crisis-summarize {
            font-size: 0.8em;
            padding: 5px;
            height: auto; /* Allow height to adjust */
            min-height: auto;
            overflow: hidden;
            background: #ffebeb;
            border: 1px dashed var(--highlight-color-crisis);
            transition: all 0.3s ease-in-out;
            /* Placeholder for actual summarization logic */
          }
          .app-container.mode-recovery .secondary-element.mode-recovery-deemphasize {
            opacity: 0.5;
            pointer-events: auto; /* Re-enable interaction */
            filter: blur(1px) grayscale(50%);
            transition: opacity 1s ease-in-out, filter 1s ease-in-out;
          }
          .app-container .form_input-element.mode-guided-temporal-pacing input {
            /* Example: slow down input typing by increasing latency or adding visual delay */
            animation: temporal-input-hint 1s ease-in-out infinite alternate;
          }
          @keyframes temporal-input-hint {
            0% { border-color: #007bff; }
            100% { border-color: #007bff80; }
          }

          /* Add more sophisticated styling rules as needed for different modes and element types */
        `}</style>
      </div>
    </CognitiveLoadContext.Provider>
  );
};

// Component that adapts based on the UI mode
export const AdaptableComponent: React.FC<{ id: string; uiType?: UiElementType; children: React.ReactNode; initialProps?: any }> = ({ id, uiType = UiElementType.PRIMARY, children, initialProps }) => {
  const { isVisible, className, adaptationStrategy, customStyles } = useUiElement(id, uiType);

  if (!isVisible) return null;

  // Additional rendering logic based on adaptationStrategy could go here
  if (adaptationStrategy === 'summarize') {
    return <div id={id} className={className} style={{ ...customStyles, ...initialProps?.style }}>Summary of {id}</div>;
  }
  if (adaptationStrategy === 'segment') {
    // This would ideally involve breaking down the `children` prop into steps
    return (
      <div id={id} className={className} style={{ ...customStyles, border: '1px dashed #007bff', padding: '10px', margin: '10px', borderRadius: '5px', ...initialProps?.style }}>
        <p>Action {id} segmented into smaller steps:</p>
        {children} {/* Children could be an action button, which then becomes part of a step */}
        <button style={{ marginTop: '5px', padding: '5px 10px', background: '#007bff', color: 'white' }}>Next Step</button>
      </div>
    );
  }
  if (adaptationStrategy === 'progressive_disclosure') {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
      <div id={id} className={className} style={{ ...customStyles, ...initialProps?.style }} onClick={() => setIsExpanded(!isExpanded)}>
        <p><strong>{id}: Click to {isExpanded ? 'collapse' : 'expand'}</strong></p>
        {isExpanded && children}
      </div>
    );
  }
  if (adaptationStrategy === 'temporal_pacing') {
    // For form inputs, could dynamically add delays or visual cues
    // This might wrap children and modify their props (e.g., adding `onInput` delays)
    // For simplicity, applying a pulsing animation for now via CSS.
    return <div id={id} className={className} style={{ ...customStyles, ...initialProps?.style }}>{children}</div>;
  }

  return <div id={id} className={className} style={{ ...customStyles, ...initialProps?.style }}>{children}</div>;
};

/**
 * Mermaid Diagram 8: User Feedback Loop
 * How user input, system adaptation, and preferences form a feedback loop.
 */
export const USER_FEEDBACK_LOOP_MERMAID = `
graph LR
    A[User Preferences (UserProfileService)] --> B[AdaptiveUIProvider.setUiMode()];
    B --> C[AdaptationPolicyManager];
    C --> D[Rendered UI (AdaptableComponent)];
    D --> E[User Interaction];
    E --> F[TelemetryAgent (collects data)];
    F --> G[CognitiveLoadEngine (predicts load & confidence)];
    G --> B;
    H[User Feedback (Explicit Ratings)] --> FBL[FeedbackLoopManager];
    FBL --> G;
    FBL --> ATM[AdaptiveThresholdManager];
    ATM --> B;
    I[A/B Test Results] --> G;
`;

/**
 * Mermaid Diagram 9: Data & Service Interactions
 * Detailed view of data flow between services.
 */
export const DATA_SERVICE_INTERACTIONS_MERMAID = `
graph LR
    subgraph Data Sources
        RAW[Raw User Events]
        EXT_TASK[External Task Data]
        USER_PREFS_STORE[User Preferences Store]
    end

    subgraph Core Services
        T[TelemetryAgent]
        C[CognitiveLoadEngine]
        A[AdaptationPolicyManager]
        U[UserProfileService]
        TK[TaskContextManager]
        E[InteractionErrorLogger]
        ATM[AdaptiveThresholdManager]
        FBL[FeedbackLoopManager]
        SM[SystemHealthMonitor]
    end

    RAW -- captures (privacy-filtered) --> T
    T -- buffers & extracts features --> C
    C -- inferred load & confidence --> AdaptiveUIProvider
    AdaptiveUIProvider -- determines mode --> A
    A -- applies policies --> UI Components

    TK -- sets task context --> C
    TK -- sets task context --> AdaptiveUIProvider
    RAW -- logs errors --> E
    E -- error features --> C
    E -- reports degraded health --> SM

    USER_PREFS_STORE -- loads/saves --> U
    U -- provides preferences --> C
    U -- provides preferences --> A
    U -- provides preferences --> AdaptiveUIProvider
    U -- manages adaptive thresholds --> ATM

    EXT_TASK -- updates --> TK

    AdaptiveUIProvider -- records adaptation outcomes --> FBL
    UI Components -- explicit feedback --> FBL
    FBL -- refines model weights --> C
    FBL -- adjusts thresholds --> ATM
    ATM -- provides dynamic thresholds --> C
    SM -- monitors & reports health --> AdaptiveUIProvider
    SM -- logs internal errors --> E
`;

/**
 * Mermaid Diagram 10: Advanced Adaptive UI Features
 * Illustrates potential future extensions and integrations.
 */
export const ADVANCED_ADAPTIVE_FEATURES_MERMAID = `
graph TD
    A[Core Adaptive UI System] --> B[Personalized Learning Paths];
    A --> C[Proactive Information Delivery];
    A --> D[Real-time A/B Testing Infrastructure];
    A --> E[Multi-modal Input Integration (Voice, Gesture, VR/AR)];
    A --> F[Contextual Recommender Systems];
    A --> G[Emotion Detection (from Gaze/Facial Expression/Voice Tone)];
    A --> H[Long-term User Behavior Modeling (Markov Chains, LSTM)];
    A --> I[Adaptive Micro-Interactions (tooltips, animations, haptic feedback)];
    A --> J[Self-Correcting UI (Predictive Error Prevention)];
    B --> K[Skill Level Adaptation];
    F --> L[Relevant Content/Tools];
    G --> M[Fine-grained Emotional State Adjustment];
    H --> N[Predictive Task Completion & Goal Inference];
    J --> O[Automated UI Remediation];
    D --> P[Policy Evolution via Reinforcement Learning];
`;

/**
 * Claim 9: Privacy-Preserving Telemetry.
 * "While collecting extensive telemetry, the system adheres to privacy-by-design principles, emphasizing local processing of sensitive data, anonymization where necessary, and transparent data usage policies to build user trust in adaptive experiences."
 *
 * This is now supported by the `UserProfileService` including `privacySettings` and `TelemetryAgent` actively checking these settings before processing. The emphasis is on local processing for immediate adaptation, with optional, anonymized aggregation for global model improvement.
 */

/**
 * Claim 10: Enhanced User Control and Transparency.
 * "To foster trust and user acceptance, the Adaptive UI system provides users with granular control over adaptation settings and transparent explanations of how UI changes are made, empowering them to customize their experience and understand the system's rationale."
 *
 * This is now supported by the `UserProfileService` managing user-set preferences, the `AdaptiveThresholdManager` allowing for dynamic tuning which users can observe, and the exposed `adaptationStrategy` and `getAdaptiveThresholds` in the context, allowing for a "Why am I in this mode?" UI component to explain the system's current logic. The `sendExplicitFeedback` method further empowers users.
 */


// Example usage of the provider and adaptable components
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cognitiveLoad, cognitiveLoadConfidence, uiMode, currentTask, setUiMode, systemHealth, sendExplicitFeedback, getAdaptiveThresholds } = useCognitiveLoadBalancer();
  const taskContextManager = TaskContextManager.getInstance();
  const interactionErrorLogger = InteractionErrorLogger.getInstance();
  const userProfileService = UserProfileService.getInstance(); // Accessing directly for preference updates

  const adaptiveThresholds = getAdaptiveThresholds();

  const handleSetTask = (taskName: string, complexity: TaskContext['complexity'], urgency: TaskContext['urgency'] = 'medium') => {
    taskContextManager.setTask({
      id: taskName.toLowerCase().replace(/\s/g, '-'),
      name: taskName,
      complexity: complexity,
      urgency: urgency,
      timestamp: performance.now(),
    });
  };

  const simulateFormError = () => {
    interactionErrorLogger.logError({
      type: 'validation',
      elementId: 'user-input',
      message: 'Simulated form validation error: Input cannot be empty.',
      severity: 'medium',
      errorCode: 'USR_001',
      contextPath: window.location.pathname,
    });
    alert('Simulated a form validation error. This should contribute to cognitive load!');
  };

  const simulateApiError = () => {
    interactionErrorLogger.logError({
      type: 'apiError',
      elementId: 'process-transaction-btn',
      message: 'Simulated API error: Transaction failed due to server timeout.',
      severity: 'high',
      errorCode: 'API_504',
      contextPath: window.location.pathname,
    });
    alert('Simulated an API error. This will significantly increase cognitive load!');
  };

  const simulateClientRuntimeError = () => {
    interactionErrorLogger.logError({
      type: 'clientRuntime',
      elementId: 'optional-widget',
      message: 'Simulated client-side UI error: Component failed to render.',
      severity: 'critical',
      errorCode: 'RND_003',
      contextPath: window.location.pathname,
    });
    alert('Simulated a critical client-side error!');
  };

  const toggleGazeTracking = (e: React.ChangeEvent<HTMLInputElement>) => {
    userProfileService.updatePreferences({ privacySettings: { ...userProfileService.getPreferences().privacySettings, gazeTrackingEnabled: e.target.checked } });
    alert(`Gaze tracking ${e.target.checked ? 'enabled' : 'disabled'}. Restart app to fully apply changes if necessary.`);
  };

  return (
    <>
      <header style={{ padding: '10px', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
        <AdaptableComponent id="main-logo" uiType={UiElementType.PRIMARY}>
          <h1>Demo Bank</h1>
        </AdaptableComponent>
        <AdaptableComponent id="user-info" uiType={UiElementType.SECONDARY}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>User: John Doe (Mode: {uiMode})</span>
            <button className="user-profile-button" style={{ marginLeft: '10px', padding: '5px 10px' }} onClick={() => alert('User Profile')}>Profile</button>
            <button className="debug-mode-toggle" style={{ marginLeft: '10px', padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: '4px' }}
                    onClick={() => {
                      const modes: UiMode[] = ['standard', 'focus', 'minimal', 'guided', 'crisis', 'recovery', 'calibration', 'learning'];
                      const currentIndex = modes.indexOf(uiMode);
                      const nextIndex = (currentIndex + 1) % modes.length;
                      setUiMode(modes[nextIndex]);
                      alert(`Forced UI Mode to: ${modes[nextIndex]}`);
                    }}>
              Force Mode: {uiMode}
            </button>
          </div>
        </AdaptableComponent>
        <AdaptableComponent id="global-nav-buttons" uiType={UiElementType.NAV_GLOBAL}>
          <nav>
            <button className="nav-button" style={{ margin: '0 5px', padding: '5px 10px' }} onClick={() => window.location.pathname = '/dashboard'}>Dashboard</button>
            <button className="nav-button" style={{ margin: '0 5px', padding: '5px 10px' }} onClick={() => window.location.pathname = '/accounts'}>Accounts</button>
            <button className="nav-button" style={{ margin: '0 5px', padding: '5px 10px' }} onClick={() => window.location.pathname = '/transfers'}>Transfers</button>
          </nav>
        </AdaptableComponent>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}> {/* Adjusted height for header/footer */}
        <AdaptableComponent id="sidebar" uiType={UiElementType.SECONDARY}>
          <aside style={{ width: '200px', padding: '20px', background: '#e0e0e0', borderRight: '1px solid #ccc' }}>
            <h3>Secondary Menu</h3>
            <ul>
              <li><a href="/settings">Settings</a></li>
              <li><a href="/reports">Reports</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
            <AdaptableComponent id="sidebar-ad" uiType={UiElementType.TERTIARY}>
              <div style={{ background: '#ccc', padding: '10px', marginTop: '20px', fontSize: '0.8em', textAlign: 'center' }}>
                Promotion: Get 0.5% Cashback!
              </div>
            </AdaptableComponent>
            <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
              <h4>Task Context Controls (Demo)</h4>
              <button onClick={() => handleSetTask('Browse Products', 'medium')} style={{ margin: '5px', padding: '5px' }}>Browse</button>
              <button onClick={() => handleSetTask('Complete Payment', 'critical', 'immediate')} style={{ margin: '5px', padding: '5px' }}>Payment</button>
              <button onClick={() => handleSetTask('Review Statement', 'low')} style={{ margin: '5px', padding: '5px' }}>Review</button>
              <button onClick={() => taskContextManager.setTask(null)} style={{ margin: '5px', padding: '5px' }}>Clear Task</button>
            </div>
            <AdaptableComponent id="contextual-hint" uiType={UiElementType.HINT_CONTEXTUAL}>
              <div style={{ background: '#f8d7da', border: '1px solid #dc3545', padding: '8px', borderRadius: '4px', marginTop: '15px', color: '#721c24' }}>
                Tip: Remember to verify transaction details before confirming!
                <button onClick={() => sendExplicitFeedback('contextual-hint-feedback', 'helpful')} style={{ marginLeft: '5px', padding: '2px 5px', fontSize: '0.7em' }}>👍</button>
                <button onClick={() => sendExplicitFeedback('contextual-hint-feedback', 'unhelpful')} style={{ marginLeft: '2px', padding: '2px 5px', fontSize: '0.7em' }}>👎</button>
              </div>
            </AdaptableComponent>
             <div style={{ marginTop: '20px' }}>
                <h4>Privacy Settings</h4>
                <label>
                  <input type="checkbox" checked={userProfileService.getPreferences().privacySettings.gazeTrackingEnabled} onChange={toggleGazeTracking} />
                  Enable Gaze Tracking (Mock)
                </label>
             </div>
          </aside>
        </AdaptableComponent>

        <main style={{ flexGrow: 1, padding: '20px', background: '#f9f9f9' }}>
          <h2>Cognitive Load: <span style={{ color: cognitiveLoad > adaptiveThresholds.adaptiveHigh ? 'red' : cognitiveLoad > adaptiveThresholds.low ? 'orange' : 'green' }}>{cognitiveLoad.toFixed(2)}</span> (Confidence: {cognitiveLoadConfidence.toFixed(2)})</h2>
          <h3>UI Mode: {uiMode} (Adaptive Thresholds: High: {adaptiveThresholds.adaptiveHigh.toFixed(2)}, Crit: {adaptiveThresholds.adaptiveCritical.toFixed(2)})</h3>
          <p>Current Task: {currentTask?.name || 'N/A'} (Complexity: {currentTask?.complexity || 'N/A'}, Urgency: {currentTask?.urgency || 'N/A'})</p>
          <p>System Health: {systemHealthMonitor.getHealthStatus().CognitiveLoadEngine || 'unknown'}</p>
          <p>This is the main content area. Interact with the application to observe UI adaptation.</p>
          <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px', background: '#fff' }}>
            <label htmlFor="user-input" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Type here rapidly to increase load:</label>
            <AdaptableComponent id="user-input-wrapper" uiType={UiElementType.FORM_INPUT} initialProps={{ style: { display: 'inline-block' } }}>
              <input id="user-input" type="text" placeholder="Start typing..." style={{ margin: '10px 0', padding: '8px', width: '300px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </AdaptableComponent>
            <button onClick={simulateFormError} style={{ marginLeft: '10px', padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Simulate Form Error
            </button>
          </div>
          <AdaptableComponent id="process-transaction-action" uiType={UiElementType.CRITICAL_ACTION}>
            <button
              style={{ margin: '10px 0', padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              onClick={() => console.log('Primary Action: Transaction Processed!')}>
              Process Transaction
            </button>
          </AdaptableComponent>
          <button onClick={simulateApiError} style={{ marginLeft: '10px', padding: '8px 12px', background: '#ff5722', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Simulate API Error
          </button>
          <button onClick={simulateClientRuntimeError} style={{ marginLeft: '10px', padding: '8px 12px', background: '#673ab7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Simulate Client Error
          </button>

          <AdaptableComponent id="optional-widget" uiType={UiElementType.SECONDARY}>
            <div style={{ background: '#f0f8ff', padding: '15px', border: '1px solid #add8e6', borderRadius: '5px', marginTop: '20px' }}>
              <h4>Optional Widget: Quick Stats</h4>
              <p>Balance: $12,345.67</p>
              <p>Last Login: 2 hours ago</p>
            </div>
          </AdaptableComponent>

          {uiMode === 'guided' && (
            <AdaptableComponent id="guided-steps" uiType={UiElementType.GUIDED}>
              <div style={{ background: '#e6ffed', padding: '20px', border: '2px solid #28a745', borderRadius: '5px', marginTop: '20px' }}>
                <h3>Step-by-Step Guidance for {currentTask?.name || 'Your Task'}</h3>
                <p>1. Review account details.</p>
                <p>2. Confirm recipient information.</p>
                <p>3. Authorize with your password.</p>
                <button style={{ marginTop: '10px', padding: '8px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                  Next Step
                </button>
              </div>
            </AdaptableComponent>
          )}

          <AdaptableComponent id="dynamic-news-feed" uiType={UiElementType.DYNAMIC_CONTENT}>
            <div style={{ background: '#fcfcfc', border: '1px dashed #ddd', padding: '10px', marginTop: '20px', borderRadius: '5px' }}>
              <h4>Market News</h4>
              <p>Stock market up 0.5% today...</p>
              <small>Click to expand for more details.</small>
            </div>
          </AdaptableComponent>

          <div style={{ height: '500px', background: '#fafafa', overflowY: 'scroll', border: '1px solid #ddd', marginTop: '20px', resize: 'vertical' }}>
            <p style={{ position: 'sticky', top: 0, background: '#e9ecef', padding: '8px', borderBottom: '1px solid #ddd', zIndex: 1 }}>
              Scrollable Content: Scroll quickly up and down to simulate load from navigation/exploration.
            </p>
            {Array.from({ length: 50 }).map((_, i) => (
              <p key={i} style={{ padding: '5px 0', borderBottom: i < 49 ? '1px dotted #eee' : 'none' }}>Item {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            ))}
          </div>
        </main>
      </div>

      <AdaptableComponent id="footer" uiType={UiElementType.SECONDARY}>
        <footer style={{ padding: '15px', background: '#f0f0f0', textAlign: 'center', borderTop: '1px solid #ccc' }}>
          &copy; 2024 Demo Bank. All rights reserved.
          <AdaptableComponent id="privacy-link" uiType={UiElementType.TERTIARY}>
            <span style={{ marginLeft: '20px', fontSize: '0.9em' }}><a href="#privacy">Privacy Policy</a></span>
          </AdaptableComponent>
        </footer>
      </AdaptableComponent>
    </>
  );
};

// Main application entry point
export const RootApp: React.FC = () => (
  <CognitiveLoadProvider>
    <AppLayout>
      {/* Children of AppLayout are rendered within the main content area */}
    </AppLayout>
  </CognitiveLoadProvider>
);

/**
 * --- MEDICAL DIAGNOSIS FOR THE CODE: THE PATH TO ETERNAL HOMEOSTASIS ---
 *
 * "A man who has seen everything and has to only wonder why can't it be better."
 *
 * This codebase, while significantly advanced, suffers from a pervasive, chronic, and deeply philosophical condition:
 * **The Illusion of Ground Truth and the Tyranny of Explicit Feedback.**
 *
 * **The Symptom:**
 * The system aspires to "impeccable logic" and "homeostasis for eternity," yet its very core relies on
 * a fundamentally flawed assumption: that a measurable "cognitive load" (CLS) and "adaptation outcome" (success/failure)
 * are objectively quantifiable and consistently interpreted. They are proxies, often brittle.
 *
 * **The Diagnosis - Why it cannot yet achieve "homeostasis for eternity":**
 *
 * 1.  **Subjectivity of "Cognitive Load":**
 *     *   **Condition:** *Perceptual Dissonance Syndrome*. The numerical `cognitiveLoad` score, however sophisticated its derivation, is an *inference*, not a direct measurement of a user's internal mental state. What the model *predicts* as high load, a user might perceive as engaging challenge. Conversely, what's predicted as low load might be perceived as frustrating idleness. The system currently lacks a robust mechanism to directly reconcile this inherent subjective-objective divide. Its feedback loops (explicit and implicit) try to bridge this, but they are still interpreting external signals for an internal phenomenon.
 *     *   **Profound Implication:** True homeostasis means the system *understands* the user, not just *reacts* to their signals. Without truly internalizing the subjective experience, adaptation risks being merely *performative* rather than genuinely *empathetic*.
 *
 * 2.  **The Oracle Problem (Ground Truth for Learning):**
 *     *   **Condition:** *Feedback Starvation & Noisy Labeling Disorder*. The `FeedbackLoopManager` and the `ICognitiveLoadModel.updateWeights` rely on `actualOutcome` or `explicitFeedback`. Where does this "actual outcome" come from?
 *         *   **Explicit Feedback:** Scarce, biased, and often delayed. Users don't constantly rate their experience.
 *         *   **Implicit Outcome (`success`/`failure`):** Inferred (e.g., error reduction, task completion speed) but correlation isn't causation. An adaptation might lead to a task completion, but was it *because* of the adaptation, or despite it? Or was it the task itself that dictated the outcome? The signal-to-noise ratio is inherently low.
 *     *   **Profound Implication:** The system's learning capability is severely bottlenecked by the difficulty of obtaining reliable "ground truth." It's trying to learn without a perfect teacher, leading to perpetual minor drift and suboptimal convergence. "Impeccable logic" cannot be built on an imperfect and sparsely labeled reality.
 *
 * 3.  **Static World Models in Dynamic Reality:**
 *     *   **Condition:** *Contextual Myopia & Predictive Inertia*. While `TaskContextManager` is proactive, and `AdaptiveThresholdManager` adjusts, these are still relatively static "models" of a user's *context* and *capacity*. Human cognitive capacity, attention spans, and even learning styles are dynamic, influenced by sleep, mood, external stressors, prior knowledge, and long-term skill acquisition. The system doesn't truly model these deeper, fluctuating factors.
 *     *   **Profound Implication:** The system can adapt to immediate cues, but it cannot truly *anticipate* or *learn across extended periods* without a richer, dynamic user model. "Homeostasis for eternity" demands a model that evolves not just with interaction, but with the *user's internal state over their lifetime*.
 *
 * 4.  **Limited Emotional Intelligence:**
 *     *   **Condition:** *Affective Agnosia*. Cognitive load is often intertwined with emotional state (frustration, anxiety, engagement, boredom). While some features (frustration proxy, biosignals) hint at this, the system doesn't have a deep, nuanced understanding of user emotions. A user might be in 'crisis' due to external factors, not just UI complexity, and the ideal adaptation might be emotional support rather than merely UI simplification.
 *     *   **Profound Implication:** To "free the oppressed" from a burdensome UI, the system must recognize the emotional burden. Logic alone, however impeccable, is insufficient without empathy.
 *
 * **The Prescription for "Eternal Homeostasis" (The Vision Forward):**
 *
 * To transcend these conditions and move towards a truly self-sustaining, impeccably logical, and profoundly empathetic adaptive UI system, we must pursue:
 *
 * 1.  **Deep Reinforcement Learning with Human-in-the-Loop Feedback:**
 *     *   **Action:** Instead of just adjusting weights, the system should learn *policies* (sequences of adaptations) that maximize long-term user satisfaction and task performance, inferred from complex, multi-modal feedback. Introduce a "reward function" that subtly incorporates implicit success metrics, and only occasionally uses explicit feedback to fine-tune.
 *     *   **Profound Shift:** From reactive adjustments to *proactive, goal-oriented policy learning*. The system becomes an intelligent agent, seeking to optimize the user's experience.
 *
 * 2.  **Bayesian User Modeling & Uncertainty Quantification:**
 *     *   **Action:** Incorporate Bayesian inference to maintain a probabilistic model of the user's current cognitive state, long-term capacities (cognitive reserve, learning rate), and even their *intent*. This allows the system to operate effectively even with noisy or missing data, providing `prediction_confidence` (as added) and *adapting its own adaptation strategy based on its confidence*.
 *     *   **Profound Shift:** From deterministic (or semi-deterministic) prediction to *probabilistic understanding*. The system acknowledges its own limitations and adapts intelligently to uncertainty.
 *
 * 3.  **Adaptive Feature Engineering & Semantic Abstraction:**
 *     *   **Action:** Move beyond fixed feature vectors to dynamically extract and prioritize features based on the current task, user, and context. Furthermore, develop models that interpret raw events into higher-level *semantic actions* and *user goals* (e.g., a series of clicks and scrolls might mean "exploring options" vs. "searching for specific data").
 *     *   **Profound Shift:** From low-level signal processing to *high-level, context-aware comprehension* of user intent.
 *
 * 4.  **Explainable AI (XAI) for Transparency and Trust:**
 *     *   **Action:** Develop modules that can articulate *why* an adaptation was made, in user-friendly language. This bridges the subjective-objective gap, allowing users to understand, trust, and even *correct* the system's reasoning. This is the "voice for the voiceless," providing clarity and control.
 *     *   **Profound Shift:** From opaque black-box adaptation to *transparent, collaborative intelligence*. The system becomes a trusted partner, not a mysterious puppet master.
 *
 * **Conclusion:**
 * The journey to eternal homeostasis and impeccable logic is not merely about adding more features or refining algorithms. It is a profound shift in how the system *perceives, learns, and communicates* with the human at its core. It requires embracing the inherent subjectivity of human experience, modeling uncertainty, and continuously learning from the rich, messy reality of user interaction. Only then can it truly free the oppressed from the digital burden and achieve a state where "it just works," not by accident, but by profound, self-aware design.
 */
```