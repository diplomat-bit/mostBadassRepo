// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/inventions/011_cognitive_load_balancing/src/core/CognitiveLoadBalancerService.ts
================================================================================

// --- Global Types/Interfaces ---
export enum UiElementType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  GUIDED = 'guided', // New type for elements specific to guided mode
  CRITICAL = 'critical', // For elements crucial for task completion
  INFORMATIONAL = 'informational', // For read-only content
  ACTIONABLE = 'actionable', // For buttons, links etc.
  VISUAL = 'visual', // For decorative elements
  UTILITY = 'utility', // For tools, settings
  FEEDBACK = 'feedback', // For notifications, alerts
}

export type UiMode = 'standard' | 'focus' | 'minimal' | 'guided' | 'adaptive' | 'hyperfocus' | 'low-distraction';

export interface MouseEventData {
  x: number;
  y: number;
  button: number;
  targetId: string;
  timestamp: number;
  targetBoundingRect?: DOMRectReadOnly; // For target acquisition error
  elementBoundingRects?: { [id: string]: DOMRectReadOnly }; // Capture context of visible elements
}

export interface ScrollEventData {
  scrollX: number;
  scrollY: number;
  timestamp: number;
  viewportHeight: number;
  documentHeight: number;
  scrollDeltaY?: number; // Calculated delta for richer analysis
}

export interface KeyboardEventData {
  key: string;
  code: string;
  timestamp: number;
  isModifier: boolean;
  targetId: string; // Which element received the key event
}

export interface FocusBlurEventData {
  type: 'focus' | 'blur';
  targetId: string;
  timestamp: number;
  duration?: number; // Duration of focus
}

export interface FormEventData {
  type: 'submit' | 'input' | 'change' | 'reset';
  targetId: string;
  value?: string;
  timestamp: number;
  isValid?: boolean; // For validation events
  validationMessage?: string;
}

export interface GazeEventData {
  x: number;
  y: number;
  timestamp: number;
  targetId: string; // Element under gaze
  fixationDuration?: number; // Duration of fixation if applicable
  saccadeAmplitude?: number; // Amplitude of saccade if applicable
  pupilDilation?: number; // Mocked: Proxy for cognitive effort
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
  | { type: 'gaze'; data: GazeEventData }; // New type for gaze tracking (mocked)

// --- Feature Vector Interfaces ---
export interface MouseKinematicsFeatures {
  mouse_velocity_avg: number; // avg px/ms
  mouse_acceleration_avg: number; // avg px/ms^2
  mouse_path_tortuosity: number; // deviation from straight line, > 1 indicates tortuosity
  mouse_dwell_time_avg: number; // avg ms over interactive elements
  fitts_law_ip_avg: number; // Index of Performance, higher is better
  mouse_jerk_avg: number; // avg px/ms^3
  mouse_entropy: number; // Shannon entropy of mouse positions
  element_hover_to_click_latency_avg: number; // avg ms from hover entry to click for interactive elements
}

export interface ClickDynamicsFeatures {
  click_frequency: number; // clicks/sec
  click_latency_avg: number; // ms between clicks in a burst
  target_acquisition_error_avg: number; // px deviation from center
  double_click_frequency: number; // double clicks / sec
  click_burst_rate: number; // clicks in rapid succession / second
  click_precision_avg: number; // 1 - (target_acquisition_error_avg / target_size_avg)
}

export interface ScrollDynamicsFeatures {
  scroll_velocity_avg: number; // px/sec
  scroll_direction_changes: number; // count
  scroll_pause_frequency: number; // pauses / sec
  scroll_page_coverage_avg: number; // average % of page scrolled in a window
  scroll_intensity_score: number; // combination of velocity and delta
  scroll_backtracking_ratio: number; // ratio of scroll-up distance to total scroll distance
  scroll_jerkiness_avg: number; // avg px/ms^3 for scroll
}

export interface KeyboardDynamicsFeatures {
  typing_speed_wpm: number;
  backspace_frequency: number; // backspaces / sec
  keystroke_latency_avg: number; // ms between keydowns
  error_correction_rate: number; // backspaces / keydowns (excluding modifiers)
  typing_burst_speed: number; // WPM in rapid typing bursts
  keystroke_entropy: number; // Shannon entropy of key presses
  modifier_key_frequency: number; // modifiers / sec, indicates complex operations
}

export interface InteractionErrorFeatures {
  form_validation_errors_count: number; // count
  repeated_action_attempts_count: number; // count of same action or element interaction
  navigation_errors_count: number; // e.g., dead links, rapid back/forward
  api_errors_count: number; // Count of user-triggered API errors (e.g., failed searches)
  task_reversal_count: number; // e.g. going back in a multi-step form after completion
  cognitive_friction_score: number; // Derived from a combination of minor errors/hesitations
}

export interface TaskContextFeatures {
  current_task_complexity: number; // derived from TaskContextManager
  time_in_current_task_sec: number;
  task_progress_ratio: number; // 0-1, how far along in a task
  subtask_switches: number; // count of switches between subtasks
  task_urgency_score: number; // derived from task metadata, 0-1
  task_idle_time_ratio: number; // Ratio of idle time to active time within task window
}

export interface GazeFeatures {
  fixation_frequency: number; // fixations / sec
  saccade_amplitude_avg: number; // avg px distance of saccades
  gaze_deviation_from_focus: number; // px deviation from central task element
  scan_path_tortuosity: number; // deviation from linear scan path
  pupil_dilation_avg: number; // avg pupil diameter (mocked)
  blink_rate: number; // blinks/sec (mocked)
}

export interface TelemetryFeatureVector {
  timestamp_window_end: number;
  mouse?: MouseKinematicsFeatures;
  clicks?: ClickDynamicsFeatures;
  scroll?: ScrollDynamicsFeatures;
  keyboard?: KeyboardDynamicsFeatures;
  errors?: InteractionErrorFeatures;
  task_context?: TaskContextFeatures;
  gaze?: GazeFeatures; // New gaze features
  event_density: number; // total events per second in the window
  interaction_rate: number; // total user-generated events per second
}

// --- User Profile and Context Store ---

export interface HistoricalLoadEntry {
  timestamp: number;
  load: number;
}

export interface UserPreferences {
  preferredUiMode: UiMode; // User can set a preferred default mode
  cognitiveLoadThresholds: {
    high: number;
    low: number;
    critical: number;
    criticalLow: number;
    guided: number;
    guidedLow: number;
    adaptiveHigh: number; // New threshold for adaptive mode
    adaptiveLow: number;  // New threshold for adaptive mode
  };
  adaptationPolicySelection: {
    [mode: string]: { [elementType: string]: 'obscure' | 'deemphasize' | 'reposition' | 'summarize' | 'none' | 'highlight' | 'expand' | 'contract' };
  };
  personalizedBaselineCLS: number; // User's typical resting CLS
  learningRate: number; // How quickly the user adapts, 0-1
  stressSensitivity: number; // How sensitive the user is to high load indicators, 0-1
  preferredAdaptationStyle: 'proactive' | 'reactive' | 'minimal'; // New preference
  cognitiveResilience: number; // 0-1, how well user copes with sustained load
}

/**
 * @overview
 * The `UserProfileService` is the enduring memory of the system, a deep archive of the user's essence.
 * It holds not just preferences, but a history of their struggles and triumphs against cognitive burden,
 * personalizing the quest for optimal interaction. It disproves the notion of a 'universal user,'
 * asserting that truth lies in individuality.
 *
 * @mermaid
 * graph TD
 *    A[User Actions/Telemetry] --> B(TelemetryAgent)
 *    B --> C{Event Buffer}
 *    C --> D[Feature Extraction]
 *    D --> E(CognitiveLoadEngine)
 *    E --> F[Predicted Load]
 *    F --> G(UserProfileService)
 *    G --> H{Adaptation Policy}
 *    H --> I[UI Adaptation]
 *    E --> J(AdaptiveThresholdManager)
 *    J --> G
 *    D --> K(TaskContextManager)
 */
/**
 * Claim 1: The UserProfileService acts as a central repository for individual user preferences and historical load profiles, enabling personalized adaptive UI behavior.
 * Claim 2: By integrating multiple telemetry streams, the system achieves a holistic understanding of user interaction patterns, leading to more accurate cognitive load assessments.
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
      adaptiveHigh: 0.68,
      adaptiveLow: 0.45,
    },
    adaptationPolicySelection: {}, // Default empty, managed by AdaptationPolicyManager
    personalizedBaselineCLS: 0.1, // Default baseline
    learningRate: 0.5,
    stressSensitivity: 0.7,
    preferredAdaptationStyle: 'reactive',
    cognitiveResilience: 0.5,
  };
  private loadHistoryStore: HistoricalLoadEntry[] = []; // Stores historical cognitive load values for user profiling with timestamps
  private taskCompletionMetrics: Map<string, { successRate: number, avgTime: number, count: number }> = new Map(); // Stores success rates and times per task

  private constructor() {
    // Load from localStorage or backend in a real app
    const storedPrefs = typeof window !== 'undefined' ? localStorage.getItem('userCognitiveLoadPrefs') : null;
    if (storedPrefs) {
      this.currentPreferences = { ...this.currentPreferences, ...JSON.parse(storedPrefs) };
    }
    // Load historical data
    const storedLoadHistory = typeof window !== 'undefined' ? localStorage.getItem('userLoadHistory') : null;
    if (storedLoadHistory) {
        this.loadHistoryStore = JSON.parse(storedLoadHistory);
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCognitiveLoadPrefs', JSON.stringify(this.currentPreferences));
    }
  }

  public addLoadToHistory(load: number): void {
    this.loadHistoryStore.push({ timestamp: performance.now(), load });
    if (this.loadHistoryStore.length > 100) { // Keep a rolling window of history
        this.loadHistoryStore.shift();
    }
    if (typeof window !== 'undefined') {
        localStorage.setItem('userLoadHistory', JSON.stringify(this.loadHistoryStore));
    }
  }

  public getLoadHistory(): HistoricalLoadEntry[] {
      return [...this.loadHistoryStore];
  }

  public updateTaskCompletion(taskId: string, success: boolean, durationMs: number): void {
      const currentMetrics = this.taskCompletionMetrics.get(taskId) || { successRate: 0, avgTime: 0, count: 0 };
      const newCount = currentMetrics.count + 1;
      const newSuccessRate = ((currentMetrics.successRate * currentMetrics.count) + (success ? 1 : 0)) / newCount;
      const newAvgTime = ((currentMetrics.avgTime * currentMetrics.count) + durationMs) / newCount;
      this.taskCompletionMetrics.set(taskId, { successRate: newSuccessRate, avgTime: newAvgTime, count: newCount });
      // Math Equation 1: Success Rate Update
      // S_{new} = (S_{old} \times N_{old} + I_{success}) / (N_{old} + 1)
      // where S is success rate, N is count, I_success is 1 if success, 0 otherwise.
      // Math Equation 2: Average Time Update
      // T_{new} = (T_{old} \times N_{old} + D) / (N_{old} + 1)
      // where T is average time, D is current duration.
  }

  public getTaskCompletionMetrics(taskId: string): { successRate: number, avgTime: number, count: number } | undefined {
      return this.taskCompletionMetrics.get(taskId);
  }
}

// --- Task Context Manager ---
export type TaskContext = {
  id: string;
  name: string;
  complexity: 'low' | 'medium' | 'high' | 'critical' | 'dynamic';
  timestamp: number;
  expectedDurationMs?: number;
  progressSteps?: number;
  currentStep?: number;
  urgency?: 'low' | 'medium' | 'high';
  subtaskSwitchesCount: number; // How many times user switched away and back to this task or between subtasks
  isPaused: boolean; // Indicates if task is intentionally paused
};

/**
 * @overview
 * The `TaskContextManager` is the system's understanding of the user's intent. It defines what truly matters
 * in the present moment, cutting through the noise to illuminate the path forward. It disproves the illusion
 * of a flat interaction plane, recognizing that all actions serve a hierarchical purpose.
 *
 * @mermaid
 * graph TD
 *    A[Application Initialization] --> B{setTask(task)}
 *    B --> C{Task Change Detected?}
 *    C -- Yes --> D[Notify Listeners]
 *    C -- No --> B
 *    D --> E(Current Task State)
 */
/**
 * Claim 3: The TaskContextManager provides a dynamic and granular understanding of the user's current goals, enabling context-aware load balancing.
 */
export class TaskContextManager {
  private static instance: TaskContextManager;
  private currentTask: TaskContext | null = null;
  private listeners: Set<(task: TaskContext | null) => void> = new Set();
  private userProfileService = UserProfileService.getInstance(); // For task completion metrics
  private _subtaskSwitchesCounter: number = 0; // Tracks switches within the current active major task
  private _taskActiveTimestamp: number = 0; // Timestamp when the current task became active
  private _totalIdleTimeMs: number = 0; // Accumulated idle time within the current task
  private _lastActivityTimestamp: number = 0; // Last detected user activity

  private constructor() {
    // Initialize with a default or infer from URL
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._taskActiveTimestamp = now;
    this._lastActivityTimestamp = now;
    this.setTask({ id: 'app_init', name: 'Application Initialization', complexity: 'low', timestamp: now, urgency: 'low', subtaskSwitchesCount: 0, isPaused: false });
  }

  public static getInstance(): TaskContextManager {
    if (!TaskContextManager.instance) {
      TaskContextManager.instance = new TaskContextManager();
    }
    return TaskContextManager.instance;
  }

  public setTask(task: TaskContext | null): void {
    const now = performance.now();
    if (task && this.currentTask && task.id === this.currentTask.id && task.currentStep === this.currentTask.currentStep && task.isPaused === this.currentTask.isPaused) return; // Avoid redundant updates

    const previousTask = this.currentTask;
    if (previousTask && previousTask.id !== (task?.id || '')) {
        // A major task completed or switched. Log its metrics.
        const duration = (now - previousTask.timestamp);
        // Assuming success if user moves to a new task. Real logic would be external.
        this.userProfileService.updateTaskCompletion(previousTask.id, true, duration);
        this._subtaskSwitchesCounter = 0; // Reset for new major task
        this._totalIdleTimeMs = 0;
        this._taskActiveTimestamp = now;
    } else if (previousTask && task && previousTask.id === task.id && task.currentStep !== previousTask.currentStep) {
        // Switching subtask within the same major task
        this._subtaskSwitchesCounter++;
    }

    this.currentTask = task ? { ...task, subtaskSwitchesCount: this._subtaskSwitchesCounter } : null; // Ensure count is attached
    this.listeners.forEach(listener => listener(this.currentTask));
    // console.log(`TaskContextManager: Current task set to ${task?.name || 'N/A'} (Complexity: ${task?.complexity || 'N/A'})`);
  }

  public getCurrentTask(): TaskContext | null {
    return this.currentTask;
  }

  public updateTaskProgress(currentStep: number, totalSteps?: number): void {
    if (this.currentTask) {
      this.currentTask = {
        ...this.currentTask,
        currentStep: currentStep,
        progressSteps: totalSteps || this.currentTask.progressSteps,
      };
      this.listeners.forEach(listener => listener(this.currentTask));
    }
  }

  public markUserActivity(): void {
      const now = performance.now();
      if (this.currentTask && this.currentTask.isPaused) {
          // If user becomes active during a paused state, unpause the task.
          this.currentTask = { ...this.currentTask, isPaused: false };
          this.listeners.forEach(listener => listener(this.currentTask));
      }
      this._lastActivityTimestamp = now;
  }

  public calculateTaskIdleTimeRatio(windowStart: number, windowEnd: number): number {
      if (!this.currentTask) return 0;
      const taskDurationInWindow = Math.max(0, windowEnd - Math.max(windowStart, this.currentTask.timestamp));
      if (taskDurationInWindow === 0) return 0;

      const idleThreshold = 2000; // Consider user idle after 2 seconds without activity
      const timeSinceLastActivity = windowEnd - this._lastActivityTimestamp;

      // Only count idle time if the last activity was significantly before the end of the window
      let currentWindowIdleTime = Math.max(0, timeSinceLastActivity - idleThreshold);

      // Math Equation 24: Task Idle Time Ratio
      // R_{idle} = (IdleTime_{accumulated} + CurrentWindowIdleTime) / TaskDurationInWindow
      return Math.min(1, currentWindowIdleTime / taskDurationInWindow); // Simplified for window
  }

  public subscribe(listener: (task: TaskContext | null) => void): () => void {
    this.listeners.add(listener);
    // Immediately notify with current task on subscription
    listener(this.currentTask);
    return () => this.listeners.delete(listener);
  }
}

// --- Interaction Error Logger ---
export interface InteractionError {
  id: string;
  type: 'validation' | 'repeatedAction' | 'navigation' | 'apiError' | 'systemError' | 'timeout' | 'cognitiveMismatch';
  elementId?: string;
  message: string;
  timestamp: number;
  severity?: 'low' | 'medium' | 'high';
  context?: { [key: string]: any }; // Additional context for the error
}

/**
 * @overview
 * The `InteractionErrorLogger` is the vigilant ear, listening for the subtle cries of user frustration and confusion.
 * It does not judge, but meticulously records every misstep, every moment of friction, transforming isolated failures
 * into actionable insights. It disproves the myth of perfect design, affirming that true empathy begins with acknowledging error.
 *
 * @mermaid
 * graph TD
 *    A[logError(error)] --> B{Errors Buffer}
 *    B --> C[Flush Interval]
 *    C -- Trigger --> D[flushBuffer()]
 *    D --> E[Notify Listeners]
 *    E --> F{Cleared Buffer}
 */
/**
 * Claim 4: The InteractionErrorLogger captures critical indicators of user frustration and difficulty, directly informing the cognitive load model.
 */
export class InteractionErrorLogger {
  private static instance: InteractionErrorLogger;
  public errorsBuffer: InteractionError[] = []; // Changed to public for TelemetryAgent access
  private listeners: Set<(errors: InteractionError[]) => void> = new Set();
  private readonly bufferFlushRateMs: number = 1000;
  private bufferFlushInterval: ReturnType<typeof setInterval> | null = null;
  private errorWindow: number = 5000; // Track errors in the last 5 seconds

  private constructor() {
    if (typeof setInterval !== 'undefined') {
      this.bufferFlushInterval = setInterval(this.flushBuffer, this.bufferFlushRateMs);
    }
  }

  public static getInstance(): InteractionErrorLogger {
    if (!InteractionErrorLogger.instance) {
      InteractionErrorLogger.instance = new InteractionErrorLogger();
    }
    return InteractionErrorLogger.instance;
  }

  public logError(error: Omit<InteractionError, 'id' | 'timestamp'>): void {
    if (typeof performance === 'undefined') return; // Skip if no performance API

    const newError: InteractionError = {
      id: `error-${performance.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: performance.now(),
      severity: error.severity || 'medium',
      ...error,
    };
    this.errorsBuffer.push(newError);
  }

  private flushBuffer = (): void => {
    // Only send errors that are still relevant within the errorWindow
    const relevantErrors = this.errorsBuffer.filter(err => performance.now() - err.timestamp < this.errorWindow);
    if (relevantErrors.length > 0) {
      this.listeners.forEach(listener => listener([...relevantErrors])); // Send a copy
    }
    // Remove old errors from the buffer for the next flush cycle
    this.errorsBuffer = relevantErrors;
  };

  public getRecentErrors(windowMs: number): InteractionError[] {
      const now = performance.now();
      return this.errorsBuffer.filter(err => now - err.timestamp <= windowMs);
  }

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

// --- UI Element Tracker (New Class) ---
export interface InteractiveUiElement {
  id: string;
  type: UiElementType;
  boundingRect: DOMRectReadOnly;
  isClickable: boolean;
  isFocusable: boolean;
  isInteractive: boolean;
  isVisible: boolean; // Dynamic visibility state
}

export interface UiElementInteractionData {
    element: InteractiveUiElement;
    hoverEntryTimestamp: number;
    hoverExitTimestamp?: number;
    clicks: number;
    clickTimestamps: number[]; // Store timestamps of clicks for latency/burst analysis per element
    hoverToClickTimes: number[]; // Store durations from hover entry to click
    focusCount: number;
    inputCount: number;
    totalDwellTime: number; // Sum of hover durations
    lastInteractionTimestamp: number;
}

/**
 * @overview
 * The `UiElementTracker` is the system's discerning eye, meticulously mapping the digital landscape
 * and recording every nuance of human-interface dialogue. It disproves the abstraction of "the UI,"
 * asserting that truth resides in the granular, individual interaction with each pixel and control.
 *
 * @mermaid
 * graph TD
 *    A[UI Mutation Observer] --> B{registerElement(id, type, rect)}
 *    B --> C[Element Registry]
 *    D[TelemetryAgent Events] --> E{trackInteraction(event)}
 *    E --> F(Update Interaction Data)
 *    F --> G[Calculate Metrics: Dwell Time, Fitts's Law]
 *    G --> H[TelemetryFeatureVector]
 */
/**
 * Claim 5: The UiElementTracker provides granular interaction data for individual UI components, enabling precise Fitts's Law calculations and dwell time analysis.
 */
export class UiElementTracker {
    private static instance: UiElementTracker;
    private elementRegistry: Map<string, InteractiveUiElement> = new Map();
    public interactionMetrics: Map<string, UiElementInteractionData> = new Map(); // Public for easier feature extraction
    private activeHover: { elementId: string; timestamp: number } | null = null;

    private constructor() {}

    public static getInstance(): UiElementTracker {
        if (!UiElementTracker.instance) {
            UiElementTracker.instance = new UiElementTracker();
        }
        return UiElementTracker.instance;
    }

    public registerElement(id: string, type: UiElementType, rect: DOMRectReadOnly, isInteractive: boolean = true, isClickable: boolean = true, isFocusable: boolean = true, isVisible: boolean = true): void {
        this.elementRegistry.set(id, { id, type, boundingRect: rect, isClickable, isFocusable, isInteractive, isVisible });
        if (!this.interactionMetrics.has(id)) {
            this.interactionMetrics.set(id, {
                element: { id, type, boundingRect: rect, isClickable, isFocusable, isInteractive, isVisible },
                hoverEntryTimestamp: 0,
                clicks: 0,
                clickTimestamps: [],
                hoverToClickTimes: [],
                focusCount: 0,
                inputCount: 0,
                totalDwellTime: 0,
                lastInteractionTimestamp: 0,
            });
        } else {
            // Update existing element's properties if re-registered (e.g., rect changed)
            const existingMetrics = this.interactionMetrics.get(id)!;
            existingMetrics.element = { id, type, boundingRect: rect, isClickable, isFocusable, isInteractive, isVisible };
            this.interactionMetrics.set(id, existingMetrics);
        }
    }

    public unregisterElement(id: string): void {
        this.elementRegistry.delete(id);
        this.interactionMetrics.delete(id);
        if (this.activeHover && this.activeHover.elementId === id) {
            this.activeHover = null;
        }
    }

    public updateElementVisibility(id: string, isVisible: boolean): void {
        const element = this.elementRegistry.get(id);
        if (element) {
            element.isVisible = isVisible;
            this.elementRegistry.set(id, element);
            const metrics = this.interactionMetrics.get(id);
            if (metrics) {
                metrics.element.isVisible = isVisible;
                this.interactionMetrics.set(id, metrics);
            }
        }
    }

    public getElement(id: string): InteractiveUiElement | undefined {
        return this.elementRegistry.get(id);
    }

    public getAllElements(): InteractiveUiElement[] {
        return Array.from(this.elementRegistry.values());
    }

    public trackMouseMove(event: MouseEventData): void {
        const timestamp = event.timestamp;
        const targetElementId = event.targetId;

        // Update hover tracking
        if (this.activeHover && this.activeHover.elementId !== targetElementId) {
            // Exited previous element
            this.trackHoverExit(this.activeHover.elementId, timestamp);
        }

        if (targetElementId && this.elementRegistry.has(targetElementId) && targetElementId !== (this.activeHover?.elementId || '')) {
            // Entered new element (or re-entered after exiting to non-element)
            this.trackHoverEnter(targetElementId, timestamp);
        } else if (!targetElementId && this.activeHover) {
            // Mouse moved off any tracked element
            this.trackHoverExit(this.activeHover.elementId, timestamp);
        }
    }

    public trackHoverEnter(elementId: string, timestamp: number): void {
        const metrics = this.interactionMetrics.get(elementId);
        if (metrics) {
            metrics.hoverEntryTimestamp = timestamp;
            this.activeHover = { elementId, timestamp };
            this.interactionMetrics.set(elementId, metrics);
        }
    }

    public trackHoverExit(elementId: string, timestamp: number): void {
        const metrics = this.interactionMetrics.get(elementId);
        if (metrics && metrics.hoverEntryTimestamp > 0 && timestamp > metrics.hoverEntryTimestamp) {
            metrics.totalDwellTime += (timestamp - metrics.hoverEntryTimestamp);
            metrics.hoverEntryTimestamp = 0; // Reset
            this.interactionMetrics.set(elementId, metrics);
            if (this.activeHover && this.activeHover.elementId === elementId) {
                this.activeHover = null;
            }
        }
    }

    public trackClick(event: MouseEventData): void {
        const metrics = this.interactionMetrics.get(event.targetId);
        if (metrics) {
            metrics.clicks++;
            metrics.lastInteractionTimestamp = event.timestamp;
            metrics.clickTimestamps.push(event.timestamp); // Store click timestamp

            if (metrics.hoverEntryTimestamp > 0 && event.timestamp > metrics.hoverEntryTimestamp) {
                metrics.hoverToClickTimes.push(event.timestamp - metrics.hoverEntryTimestamp);
                metrics.hoverEntryTimestamp = 0; // Consider hover intent concluded for this click.
            }
            this.interactionMetrics.set(event.targetId, metrics);
        }
    }

    public trackFocus(event: FocusBlurEventData): void {
        const metrics = this.interactionMetrics.get(event.targetId);
        if (metrics && event.type === 'focus') {
            metrics.focusCount++;
            metrics.lastInteractionTimestamp = event.timestamp;
            this.interactionMetrics.set(event.targetId, metrics);
        } else if (metrics && event.type === 'blur' && event.duration) {
            metrics.totalDwellTime += event.duration; // For focus-based dwell time on inputs
            this.interactionMetrics.set(event.targetId, metrics);
        }
    }

    public trackInput(event: FormEventData): void {
        const metrics = this.interactionMetrics.get(event.targetId);
        if (metrics) {
            metrics.inputCount++;
            metrics.lastInteractionTimestamp = event.timestamp;
            this.interactionMetrics.set(event.targetId, metrics);
        }
    }

    public getInteractionMetrics(elementId: string): UiElementInteractionData | undefined {
        return this.interactionMetrics.get(elementId);
    }

    public resetMetricsForWindow(): void {
        this.interactionMetrics.forEach(metrics => {
            metrics.clicks = 0;
            metrics.clickTimestamps = [];
            metrics.hoverToClickTimes = [];
            metrics.focusCount = 0;
            metrics.inputCount = 0;
            // totalDwellTime accumulates, do not reset here if it's for long-term profiling
            // but for windowed features, we only care about new dwell time.
            // Let's reset for windowed aggregation only for features that sum up.
            // metrics.totalDwellTime = 0; // This should be part of long-term profile
            metrics.hoverEntryTimestamp = 0; // Ensure active hover is reset if not exited
        });
        this.activeHover = null;
    }
}

// --- Core Telemetry Agent ---
/**
 * @overview
 * The `TelemetryAgent` is the silent observer, the ubiquitous sentinel of human interaction.
 * It discreetly gathers every whisper of user intent, every tactile response, every glance,
 * translating raw, fleeting moments into a language of structured data. It disproves the illusion
 * of mind-reading, asserting that profound understanding begins with meticulous observation.
 *
 * @mermaid
 * graph TD
 *    A[User Events] --> B{initListeners()}
 *    B --> C(Event Handlers)
 *    C --> D[addEvent(RawTelemetryEvent)]
 *    D --> E{eventBuffer}
 *    E --> F[bufferFlushInterval]
 *    F -- Trigger --> G(flushBuffer())
 *    G --> H[extractFeatures(events)]
 *    H --> I(featureProcessingCallback)
 */
/**
 * Claim 6: The TelemetryAgent operates with minimal overhead, passively collecting raw user interaction data and efficiently transforming it into rich feature vectors.
 */
export class TelemetryAgent {
  private eventBuffer: RawTelemetryEvent[] = [];
  private bufferInterval: ReturnType<typeof setInterval> | null = null;
  private readonly bufferFlushRateMs: number = 200; // Flush data every 200ms
  private readonly featureProcessingCallback: (features: TelemetryFeatureVector) => void;
  private lastMouseCoord: { x: number; y: number; timestamp: number } | null = null;
  private lastScrollY: { y: number; timestamp: number; viewportHeight: number; documentHeight: number } | null = null;
  private lastKeyboardActivityTime: number = 0;
  private formInputTimes: Map<string, number> = new Map(); // track time spent on form fields
  private mouseMoveEventHistory: MouseEventData[] = []; // For velocity, acceleration, jerk
  private scrollEventHistory: ScrollEventData[] = []; // For scroll velocity, jerk, backtracking
  private keyboardEventHistory: KeyboardEventData[] = []; // For advanced keyboard dynamics
  private gazeEventHistory: GazeEventData[] = []; // For gaze features (mocked)

  private interactionErrorLogger = InteractionErrorLogger.getInstance();
  private taskContextManager = TaskContextManager.getInstance();
  private uiElementTracker = UiElementTracker.getInstance(); // New element tracker

  constructor(featureProcessingCallback: (features: TelemetryFeatureVector) => void) {
    this.featureProcessingCallback = featureProcessingCallback;
  }

  public initListeners(): void {
    if (typeof window === 'undefined' || typeof performance === 'undefined') return;

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
    this.bufferInterval = setInterval(this.flushBuffer, this.bufferFlushRateMs);

    // Mock Gaze Event Listener
    if (Math.random() > 0.5) { // Simulate gaze tracking availability
        setInterval(this.mockGazeEvent, 50); // Emit mock gaze events
    }
  }

  private addEvent = (event: RawTelemetryEvent): void => {
    this.eventBuffer.push(event);
    this.taskContextManager.markUserActivity(); // Mark activity on any event
  };

  private handleMouseMoveEvent = (event: MouseEvent): void => {
    const timestamp = performance.now();
    const targetElement = event.target as HTMLElement;
    const data: MouseEventData = {
        x: event.clientX,
        y: event.clientY,
        button: event.button,
        targetId: targetElement?.id || '',
        timestamp,
        targetBoundingRect: targetElement?.getBoundingClientRect ? new DOMRectReadOnly(targetElement.getBoundingClientRect().x, targetElement.getBoundingClientRect().y, targetElement.getBoundingClientRect().width, targetElement.getBoundingClientRect().height) : undefined,
    };
    this.addEvent({ type: 'mousemove', data });
    this.mouseMoveEventHistory.push(data);
    this.uiElementTracker.trackMouseMove(data);
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
    };
    this.addEvent({ type: 'click', data });
    this.uiElementTracker.trackClick(data);
  };

  private handleScrollEvent = (event: Event): void => {
    const timestamp = performance.now();
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    let scrollDeltaY = 0;
    if (this.lastScrollY) {
        scrollDeltaY = scrollY - this.lastScrollY.y;
    }
    const data: ScrollEventData = {
      scrollX: window.scrollX,
      scrollY: scrollY,
      timestamp,
      viewportHeight,
      documentHeight,
      scrollDeltaY,
    };
    this.addEvent({ type: 'scroll', data });
    this.scrollEventHistory.push(data);
    this.lastScrollY = data;
  };

  private handleKeyboardEvent = (event: KeyboardEvent): void => {
    const timestamp = performance.now();
    const targetElement = event.target as HTMLElement;
    const data: KeyboardEventData = {
        key: event.key,
        code: event.code,
        timestamp,
        isModifier: event.ctrlKey || event.shiftKey || event.altKey || event.metaKey,
        targetId: targetElement?.id || '',
    };
    this.addEvent({
      type: event.type === 'keydown' ? 'keydown' : 'keyup',
      data: data,
    });
    if (event.type === 'keydown') {
      this.lastKeyboardActivityTime = timestamp;
      this.keyboardEventHistory.push(data);
    }
  };

  private handleFocusBlurEvent = (event: FocusEvent): void => {
    const timestamp = performance.now();
    const targetId = (event.target as HTMLElement)?.id;
    const type = event.type === 'focusin' ? 'focus' : 'blur';
    const data: FocusBlurEventData = {
        type: type,
        targetId: targetId || '',
        timestamp,
    };
    this.addEvent({ type, data });

    if (targetId && (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) {
      if (event.type === 'focusin') {
        this.formInputTimes.set(targetId, timestamp);
        this.uiElementTracker.trackFocus({ ...data, type: 'focus' });
      } else if (event.type === 'focusout' && this.formInputTimes.has(targetId)) {
        const focusTime = this.formInputTimes.get(targetId);
        if (focusTime) {
            const duration = timestamp - focusTime;
            this.uiElementTracker.trackFocus({ ...data, type: 'blur', duration });
        }
        this.formInputTimes.delete(targetId); // Clear after processing
      }
    }
  };

  private handleFormEvent = (event: Event): void => {
    const timestamp = performance.now();
    const targetElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFormElement;
    const type = event.type === 'submit' ? 'submit' : event.type === 'input' ? 'input' : 'change';

    // Basic validation check - would be more sophisticated in a real app
    let isValid: boolean | undefined = undefined;
    let validationMessage: string | undefined = undefined;
    if ('checkValidity' in targetElement && typeof targetElement.checkValidity === 'function') {
      isValid = targetElement.checkValidity();
      validationMessage = targetElement.validationMessage;
      if (!isValid && type === 'change') { // Log validation error on change if invalid
        this.interactionErrorLogger.logError({
          type: 'validation',
          elementId: targetElement.id || targetElement.name,
          message: `Form field validation failed: ${validationMessage}`,
          severity: 'medium'
        });
      }
    }

    const data: FormEventData = {
      type: type,
      targetId: targetElement?.id || targetElement?.name || '',
      value: 'value' in targetElement ? String(targetElement.value) : undefined,
      timestamp,
      isValid,
      validationMessage,
    };
    this.addEvent({ type: 'form', data });
    this.uiElementTracker.trackInput(data);
  };

  private mockGazeEvent = (): void => {
    // This is a highly simplified mock. Real gaze tracking requires hardware.
    // We simulate gaze near the current mouse position or a "task focus" area.
    if (typeof performance === 'undefined' || typeof document === 'undefined') return;

    const timestamp = performance.now();
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetId = '';

    // Simulate gaze around the current mouse position if available, else center
    if (this.lastMouseCoord) {
        x = this.lastMouseCoord.x + (Math.random() - 0.5) * 50; // Jitter around mouse
        y = this.lastMouseCoord.y + (Math.random() - 0.5) * 50;
        const element = document.elementFromPoint(x, y);
        targetId = element?.id || '';
    } else {
        const element = document.elementFromPoint(x, y);
        targetId = element?.id || '';
    }

    const data: GazeEventData = {
        x: Math.max(0, Math.min(window.innerWidth, x)),
        y: Math.max(0, Math.min(window.innerHeight, y)),
        timestamp,
        targetId,
        fixationDuration: Math.random() * 200 + 50, // 50-250ms
        saccadeAmplitude: Math.random() * 100 + 10, // 10-110px
        pupilDilation: Math.random() * 2 + 2, // Mock 2-4mm, proxy for effort
    };
    this.addEvent({ type: 'gaze', data });
    this.gazeEventHistory.push(data);
  };

  /**
   * Math Equation 3: Euclidean Distance
   * D = sqrt((x2 - x1)^2 + (y2 - y1)^2)
   */
  private calculateDistance(p1: {x: number, y: number}, p2: {x: number, y: number}): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  /**
   * Math Equation 4: Mouse Velocity
   * V = D / T
   * where D is distance, T is time delta.
   */
  private calculateMouseVelocity(p1: {x: number, y: number, timestamp: number}, p2: {x: number, y: number, timestamp: number}): number {
    const dist = this.calculateDistance(p1, p2);
    const timeDelta = p2.timestamp - p1.timestamp;
    return timeDelta > 0 ? dist / timeDelta : 0;
  }

  /**
   * Math Equation 5: Mouse Acceleration
   * A = (V2 - V1) / T
   * where V1, V2 are velocities, T is time delta.
   */
  private calculateMouseAcceleration(prevV: number, currentV: number, timeDelta: number): number {
    return timeDelta > 0 ? (currentV - prevV) / timeDelta : 0;
  }

  /**
   * Math Equation 6: Mouse Jerk (rate of change of acceleration)
   * J = (A2 - A1) / T
   * where A1, A2 are accelerations, T is time delta.
   */
  private calculateMouseJerk(prevA: number, currentA: number, timeDelta: number): number {
    return timeDelta > 0 ? (currentA - prevA) / timeDelta : 0;
  }

  /**
   * Math Equation 7: Mouse Path Tortuosity (Normalized Path Length)
   * T = L_path / L_straight
   * where L_path is total path length, L_straight is straight line distance from start to end.
   * A value of 1 means a straight line. Values > 1 indicate increasing tortuosity.
   */
  private calculateMousePathTortuosity(events: MouseEventData[]): number {
    if (events.length < 3) return 0;
    let totalDistance = 0;
    for (let i = 1; i < events.length; i++) {
      totalDistance += this.calculateDistance(events[i - 1], events[i]);
    }
    const straightLineDistance = this.calculateDistance(events[0], events[events.length - 1]);
    return straightLineDistance > 0 ? totalDistance / straightLineDistance : 0;
  }

  /**
   * Math Equation 8: Target Acquisition Error (Distance from click to target center)
   * E = sqrt((click_x - center_x)^2 + (click_y - center_y)^2)
   */
  private calculateTargetAcquisitionError(clicks: MouseEventData[]): number {
    let totalError = 0;
    let validClicks = 0;
    for (const click of clicks) {
      if (click.targetBoundingRect) {
        const rect = click.targetBoundingRect;
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        const error = Math.sqrt(Math.pow(click.x - centerX, 2) + Math.pow(click.y - centerY, 2));
        totalError += error;
        validClicks++;
      }
    }
    return validClicks > 0 ? totalError / validClicks : 0;
  }

  /**
   * Math Equation 9: Click Precision
   * P = 1 - (E / (W_target + H_target)/2)
   * where E is acquisition error, W/H are target width/height. A value near 1 is precise.
   */
  private calculateClickPrecision(clicks: MouseEventData[]): number {
      let totalPrecision = 0;
      let validClicks = 0;
      for (const click of clicks) {
          if (click.targetBoundingRect) {
              const rect = click.targetBoundingRect;
              const error = this.calculateDistance(click, { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
              const avgTargetDim = (rect.width + rect.height) / 2;
              const precision = avgTargetDim > 0 ? 1 - (error / avgTargetDim) : 0; // Normalize error by target size
              totalPrecision += Math.max(0, precision); // Ensure precision is not negative
              validClicks++;
          }
      }
      return validClicks > 0 ? totalPrecision / validClicks : 0;
  }

  /**
   * Math Equation 10: Fitts's Law Index of Performance (IP)
   * IP = ID / MT = log2(2A/W) / MT
   * where ID is Index of Difficulty, A is amplitude (distance), W is width (target size), MT is Movement Time.
   * This is a simplified calculation, full Fitts's Law requires more precise measurements across target sequences.
   */
  private calculateFittsLawIndex(clicks: MouseEventData[]): number {
      let totalIP = 0;
      let validPairs = 0;
      if (clicks.length < 2) return 0;

      for (let i = 1; i < clicks.length; i++) {
          const prevClick = clicks[i - 1];
          const currentClick = clicks[i];

          if (prevClick.targetBoundingRect && currentClick.targetBoundingRect) {
              const A = this.calculateDistance(prevClick, currentClick); // Amplitude = distance between clicks
              const W = currentClick.targetBoundingRect.width; // Width of the target clicked (simplified as width)
              const MT = currentClick.timestamp - prevClick.timestamp; // Movement Time

              if (A > 0 && W > 0 && MT > 0) {
                  const ID = Math.log2(A / W + 1); // Shannon Formulation
                  const IP = ID / (MT / 1000); // IP in bits/second (MT in seconds)
                  if (!isNaN(IP) && isFinite(IP)) {
                      totalIP += IP;
                      validPairs++;
                  }
              }
          }
      }
      return validPairs > 0 ? totalIP / validPairs : 0;
  }

  /**
   * Math Equation 11: Keystroke Entropy (Shannon Entropy)
   * H = -Sum(p_i * log2(p_i))
   * where p_i is the probability of character i.
   */
  private calculateKeystrokeEntropy(keydownEvents: KeyboardEventData[]): number {
    if (keydownEvents.length === 0) return 0;

    const charCounts: Map<string, number> = new Map();
    for (const event of keydownEvents) {
      if (!event.isModifier && event.key.length === 1) { // Only count printable characters
        charCounts.set(event.key, (charCounts.get(event.key) || 0) + 1);
      }
    }

    if (charCounts.size === 0) return 0;

    let entropy = 0;
    const totalChars = Array.from(charCounts.values()).reduce((sum, count) => sum + count, 0);

    charCounts.forEach(count => {
      const p = count / totalChars;
      entropy -= p * Math.log2(p);
    });
    return entropy;
  }

  /**
   * Math Equation 12: Scroll Jerk (Derivative of Scroll Acceleration)
   * J = (A_{curr} - A_{prev}) / T
   */
  private calculateScrollJerkiness(scrollEvents: ScrollEventData[]): number {
      if (scrollEvents.length < 4) return 0; // Need at least 3 segments for 2 accelerations and 1 jerk
      let totalJerk = 0;
      let prevVelocity = 0;
      let prevAcceleration = 0;
      let count = 0;

      for (let i = 1; i < scrollEvents.length; i++) {
          const s1 = scrollEvents[i - 1];
          const s2 = scrollEvents[i];
          const timeDelta = s2.timestamp - s1.timestamp;
          if (timeDelta > 0) {
              const velocity = Math.abs(s2.scrollDeltaY || 0) / timeDelta;
              const acceleration = (velocity - prevVelocity) / timeDelta;
              if (count >= 1) { // Need at least one previous acceleration to calculate jerk
                 totalJerk += Math.abs((acceleration - prevAcceleration) / timeDelta);
              }
              prevVelocity = velocity;
              prevAcceleration = acceleration;
              count++;
          }
      }
      return count > 1 ? totalJerk / (count - 1) : 0; // Average over available jerk calculations
  }

  /**
   * Math Equation 13: Mouse Entropy
   * Based on spatial distribution of mouse movements.
   * Divide screen into a grid, calculate probabilities of being in each cell.
   */
  private calculateMouseEntropy(mouseMoveEvents: MouseEventData[]): number {
    if (mouseMoveEvents.length === 0 || typeof window === 'undefined') return 0;

    const gridCellsX = 10;
    const gridCellsY = 10;
    const cellWidth = window.innerWidth / gridCellsX;
    const cellHeight = window.innerHeight / gridCellsY;

    const cellCounts = new Map<string, number>();
    for (const event of mouseMoveEvents) {
      const cellX = Math.floor(event.x / cellWidth);
      const cellY = Math.floor(event.y / cellHeight);
      const cellId = `${cellX},${cellY}`;
      cellCounts.set(cellId, (cellCounts.get(cellId) || 0) + 1);
    }

    if (cellCounts.size === 0) return 0;

    let entropy = 0;
    const totalMoves = mouseMoveEvents.length;
    cellCounts.forEach(count => {
      const p = count / totalMoves;
      if (p > 0) entropy -= p * Math.log2(p);
    });
    return entropy;
  }

  /**
   * Math Equation 14: Scroll Backtracking Ratio
   * Ratio = L_up / L_total
   * where L_up is total upward scroll distance, L_total is total absolute scroll distance.
   */
  private calculateScrollBacktrackingRatio(scrollEvents: ScrollEventData[]): number {
      let totalDeltaY = 0;
      let totalUpScroll = 0;
      for (let i = 1; i < scrollEvents.length; i++) {
          const deltaY = scrollEvents[i].scrollY - scrollEvents[i-1].scrollY;
          totalDeltaY += Math.abs(deltaY);
          if (deltaY < 0) { // Scrolling up
              totalUpScroll += Math.abs(deltaY);
          }
      }
      return totalDeltaY > 0 ? totalUpScroll / totalDeltaY : 0;
  }

  /**
   * Math Equation 15: Gaze Deviation From Focus
   * D_gaze = Avg_i(Dist(Gaze_i, Target_centroid))
   * where Gaze_i is i-th gaze point, Target_centroid is center of main task element.
   * This would require knowing the 'main task element' which is context-dependent.
   */
  private calculateGazeDeviationFromFocus(gazeEvents: GazeEventData[], mainTargetRect?: DOMRectReadOnly): number {
      if (gazeEvents.length === 0 || !mainTargetRect) return 0;
      const targetCenterX = mainTargetRect.x + mainTargetRect.width / 2;
      const targetCenterY = mainTargetRect.y + mainTargetRect.height / 2;

      let totalDeviation = 0;
      for (const gaze of gazeEvents) {
          totalDeviation += this.calculateDistance(gaze, { x: targetCenterX, y: targetCenterY });
      }
      return totalDeviation / gazeEvents.length;
  }

  /**
   * Math Equation 16: Scroll Intensity Score
   * S = (AvgVelocity * DirectionChanges) + (AvgVelocity * (1 - BacktrackingRatio))
   * Captures both speed and "exploratory" or "confused" scrolling.
   */
  private calculateScrollIntensityScore(avgVelocity: number, directionChanges: number, backtrackingRatio: number): number {
    return (avgVelocity * (directionChanges + 1)) + (avgVelocity * (1 - backtrackingRatio));
  }

  /**
   * Math Equation 17: Error Correction Rate
   * E = Backspaces / NonModifierKeydowns
   */
  private calculateErrorCorrectionRate(backspaceCount: number, nonModifierKeydownCount: number): number {
    return nonModifierKeydownCount > 0 ? backspaceCount / nonModifierKeydownCount : 0;
  }

  /**
   * Math Equation 18: Typing Burst Speed (WPM)
   * WPM = (NonModifierKeydowns / 5) / (DurationSeconds / 60)
   * (simplified: assuming average 5 characters per word)
   */
  private calculateTypingBurstSpeedWPM(nonModifierKeydownCount: number, durationSeconds: number): number {
    if (nonModifierKeydownCount > 5 && durationSeconds > 0) {
        return (nonModifierKeydownCount / 5) * (60 / durationSeconds);
    }
    return 0;
  }

  /**
   * Math Equation 19: Task Reversal Count
   * R = Sum(RepeatedActionAttempts indicating reversal)
   */
  private calculateTaskReversalCount(errorsInWindow: InteractionError[]): number {
    return errorsInWindow.filter(err => err.type === 'repeatedAction' && err.message.includes('backtracking')).length;
  }

  /**
   * Math Equation 20: Task Progress Ratio
   * P = CurrentStep / TotalSteps
   */
  private calculateTaskProgressRatio(currentStep: number | undefined, totalSteps: number | undefined): number {
    return (currentStep !== undefined && totalSteps && totalSteps > 0) ? (currentStep / totalSteps) : 0;
  }

  /**
   * Math Equation 21: Task Urgency Score
   * U = Factor(UrgencyLevel)
   */
  private calculateTaskUrgencyScore(urgency: TaskContext['urgency']): number {
    return urgency === 'high' ? 0.8 : (urgency === 'medium' ? 0.5 : 0.2);
  }

  /**
   * Math Equation 22: Scan Path Tortuosity (for gaze)
   * T = L_path / L_straight (similar to mouse tortuosity)
   */
  private calculateScanPathTortuosity(gazeEvents: GazeEventData[]): number {
      if (gazeEvents.length < 3) return 0;
      let totalDistance = 0;
      for (let i = 1; i < gazeEvents.length; i++) {
        totalDistance += this.calculateDistance(gazeEvents[i - 1], gazeEvents[i]);
      }
      const straightLineDistance = this.calculateDistance(gazeEvents[0], gazeEvents[gazeEvents.length - 1]);
      return straightLineDistance > 0 ? totalDistance / straightLineDistance : 0;
  }

  /**
   * Math Equation 23: Interaction Rate
   * R = TotalUserEvents / DurationSeconds
   */
  private calculateInteractionRate(eventCount: number, durationSeconds: number): number {
    return durationSeconds > 0 ? eventCount / durationSeconds : 0;
  }

  /**
   * Math Equation 24: Modifier Key Frequency
   * F = ModifierKeys / DurationSeconds
   */
  private calculateModifierKeyFrequency(modifierKeyCount: number, durationSeconds: number): number {
    return durationSeconds > 0 ? modifierKeyCount / durationSeconds : 0;
  }

  /**
   * Math Equation 25: Cognitive Friction Score (Simplified)
   * F_c = (ErrorCount * W_E) + (BackspaceFreq * W_B) + (ScrollBacktracking * W_S)
   * Combines various small indicators of struggle.
   */
  private calculateCognitiveFrictionScore(
      errorsCount: number,
      backspaceFrequency: number,
      scrollBacktrackingRatio: number
  ): number {
      const WE = 0.5; // Weight for errors
      const WB = 0.3; // Weight for backspace
      const WS = 0.2; // Weight for scroll backtracking
      return (errorsCount * WE) + (backspaceFrequency * WB) + (scrollBacktrackingRatio * WS);
  }


  private extractFeatures = (events: RawTelemetryEvent[]): TelemetryFeatureVector => {
    if (typeof performance === 'undefined') {
        return { timestamp_window_end: Date.now(), event_density: 0, interaction_rate: 0 };
    }
    const windowStart = performance.now() - this.bufferFlushRateMs;
    const windowEnd = performance.now();
    const durationSeconds = this.bufferFlushRateMs / 1000;

    // Filter and categorize events for the current window
    const windowEvents = events.filter(event => event.data.timestamp >= windowStart);
    let mouseMoveEvents: MouseEventData[] = windowEvents.filter((e): e is { type: 'mousemove'; data: MouseEventData } => e.type === 'mousemove').map(e => e.data);
    let clickEvents: MouseEventData[] = windowEvents.filter((e): e is { type: 'click'; data: MouseEventData } => e.type === 'click').map(e => e.data);
    let scrollEvents: ScrollEventData[] = windowEvents.filter((e): e is { type: 'scroll'; data: ScrollEventData } => e.type === 'scroll').map(e => e.data);
    let keydownEvents: KeyboardEventData[] = windowEvents.filter((e): e is { type: 'keydown'; data: KeyboardEventData } => e.type === 'keydown').map(e => e.data);
    let keyupEvents: KeyboardEventData[] = windowEvents.filter((e): e is { type: 'keyup'; data: KeyboardEventData } => e.type === 'keyup').map(e => e.data);
    let formEvents: FormEventData[] = windowEvents.filter((e): e is { type: 'form'; data: FormEventData } => e.type === 'form').map(e => e.data);
    let gazeEvents: GazeEventData[] = windowEvents.filter((e): e is { type: 'gaze'; data: GazeEventData } => e.type === 'gaze').map(e => e.data);

    // --- Mouse Kinematics ---
    let totalMouseVelocity = 0;
    let totalMouseAcceleration = 0;
    let totalMouseJerk = 0;
    let prevMouseVelocity = 0;
    let prevMouseAcceleration = 0;
    if (mouseMoveEvents.length > 1) {
      for (let i = 1; i < mouseMoveEvents.length; i++) {
        const p1 = mouseMoveEvents[i - 1];
        const p2 = mouseMoveEvents[i];
        const timeDelta = p2.timestamp - p1.timestamp;
        if (timeDelta > 0) {
          const velocity = this.calculateMouseVelocity(p1, p2); // Math Equation 4
          totalMouseVelocity += velocity;
          const acceleration = this.calculateMouseAcceleration(prevMouseVelocity, velocity, timeDelta); // Math Equation 5
          totalMouseAcceleration += acceleration;
          totalMouseJerk += this.calculateMouseJerk(prevMouseAcceleration, acceleration, timeDelta); // Math Equation 6
          prevMouseVelocity = velocity;
          prevMouseAcceleration = acceleration;
        }
      }
    }
    const mouseDwellTimeAvg = Array.from(this.uiElementTracker.interactionMetrics.values())
                                .filter(m => m.element.isInteractive && m.totalDwellTime > 0)
                                .map(m => m.totalDwellTime)
                                .reduce((sum, time) => sum + time, 0) / (this.uiElementTracker.interactionMetrics.size || 1);

    let totalHoverToClickLatency = 0;
    let validHoverToClickCount = 0;
    this.uiElementTracker.interactionMetrics.forEach(metrics => {
        if (metrics.element.isClickable && metrics.hoverToClickTimes.length > 0) {
            totalHoverToClickLatency += metrics.hoverToClickTimes.reduce((sum, time) => sum + time, 0);
            validHoverToClickCount += metrics.hoverToClickTimes.length;
        }
    });


    // --- Click Dynamics ---
    let totalClickLatency = 0;
    let doubleClickCount = 0;
    let clickBurstCount = 0;
    const clickLatencyWindow = 500; // ms for double click or burst
    if (clickEvents.length > 1) {
      for (let i = 1; i < clickEvents.length; i++) {
        const latency = clickEvents[i].timestamp - clickEvents[i-1].timestamp;
        totalClickLatency += latency;
        if (latency < clickLatencyWindow) {
          doubleClickCount++;
          if (latency < 200) { // tighter threshold for burst
            clickBurstCount++;
          }
        }
      }
    }


    // --- Scroll Dynamics ---
    let totalScrollYDelta = 0;
    let scrollDirectionChanges = 0;
    let prevScrollYValue: number | null = null;
    let lastScrollDirection: 'up' | 'down' | null = null;
    let scrollPauseCount = 0;
    let totalPageCoverage = 0;
    if (scrollEvents.length > 0) {
        if (scrollEvents.length > 1) {
            for (let i = 1; i < scrollEvents.length; i++) {
                const s1 = scrollEvents[i - 1];
                const s2 = scrollEvents[i];
                const deltaY = s2.scrollY - s1.scrollY;
                if (Math.abs(deltaY) > 0) {
                totalScrollYDelta += Math.abs(deltaY);
                const currentDirection = deltaY > 0 ? 'down' : 'up';
                if (lastScrollDirection && currentDirection !== lastScrollDirection) {
                    scrollDirectionChanges++;
                }
                lastScrollDirection = currentDirection;
                } else {
                    if (prevScrollYValue !== null && prevScrollYValue === s2.scrollY) {
                        scrollPauseCount++;
                    }
                }
                prevScrollYValue = s2.scrollY;
            }
        }
        const initialScroll = scrollEvents[0].scrollY;
        const finalScroll = scrollEvents[scrollEvents.length - 1].scrollY;
        const totalDocumentHeight = scrollEvents[0].documentHeight - scrollEvents[0].viewportHeight;
        if (totalDocumentHeight > 0) {
            totalPageCoverage = (Math.abs(finalScroll - initialScroll) + scrollEvents[0].viewportHeight) / totalDocumentHeight;
            totalPageCoverage = Math.min(1, totalPageCoverage); // Clamp to 1
        }
    }
    const avgScrollVelocity = totalScrollYDelta / durationSeconds;
    const scrollBacktrackingRatio = this.calculateScrollBacktrackingRatio(scrollEvents); // Math Equation 14
    const scrollIntensityScore = this.calculateScrollIntensityScore(avgScrollVelocity, scrollDirectionChanges, scrollBacktrackingRatio); // Math Equation 16

    // --- Keyboard Dynamics ---
    let totalKeystrokeLatency = 0;
    let backspaceCount = 0;
    let wordCount = 0; // For WPM
    let lastTypedWordTime: number = 0;
    let nonModifierKeydownCount = 0;
    let modifierKeyCount = 0;
    if (keydownEvents.length > 0) {
      for (let i = 0; i < keydownEvents.length; i++) {
        const keyEvent = keydownEvents[i];
        if (keyEvent.isModifier) {
            modifierKeyCount++;
        } else {
          nonModifierKeydownCount++;
          if (i > 0 && !keydownEvents[i-1].isModifier) { // only count latency between non-modifier keys
            totalKeystrokeLatency += (keyEvent.timestamp - keydownEvents[i-1].timestamp);
          }
          if (keyEvent.key === 'Backspace') {
            backspaceCount++;
          } else if (keyEvent.key === ' ' && keyEvent.timestamp - lastTypedWordTime > 100) { // debounce words
            wordCount++;
            lastTypedWordTime = keyEvent.timestamp;
          }
        }
      }
    }
    const errorCorrectionRate = this.calculateErrorCorrectionRate(backspaceCount, nonModifierKeydownCount); // Math Equation 17
    const typingBurstSpeedWPM = this.calculateTypingBurstSpeedWPM(nonModifierKeydownCount, durationSeconds); // Math Equation 18
    const modifierKeyFrequency = this.calculateModifierKeyFrequency(modifierKeyCount, durationSeconds); // Math Equation 24

    // --- Interaction Errors (from IEL) ---
    const errorsInWindow = this.interactionErrorLogger.getRecentErrors(this.bufferFlushRateMs);
    let formValidationErrors = errorsInWindow.filter(err => err.type === 'validation').length;
    let repeatedActionAttempts = errorsInWindow.filter(err => err.type === 'repeatedAction').length;
    let navigationErrors = errorsInWindow.filter(err => err.type === 'navigation').length;
    let apiErrors = errorsInWindow.filter(err => err.type === 'apiError').length;
    let taskReversalCount = this.calculateTaskReversalCount(errorsInWindow); // Math Equation 19
    let cognitiveFrictionScore = this.calculateCognitiveFrictionScore(
        formValidationErrors + repeatedActionAttempts + navigationErrors + apiErrors,
        backspaceCount / durationSeconds,
        scrollBacktrackingRatio
    ); // Math Equation 25

    // Task Context
    const currentTask = this.taskContextManager.getCurrentTask();
    const taskComplexityMap: { [key in TaskContext['complexity']]: number } = {
      'low': 0.2, 'medium': 0.5, 'high': 0.7, 'critical': 0.9, 'dynamic': 0.6
    };
    const taskProgressRatio = this.calculateTaskProgressRatio(currentTask?.currentStep, currentTask?.progressSteps); // Math Equation 20
    const taskUrgencyScore = this.calculateTaskUrgencyScore(currentTask?.urgency); // Math Equation 21
    const taskIdleTimeRatio = this.taskContextManager.calculateTaskIdleTimeRatio(windowStart, windowEnd);

    const taskContextFeatures: TaskContextFeatures = {
      current_task_complexity: currentTask ? taskComplexityMap[currentTask.complexity] : 0,
      time_in_current_task_sec: currentTask ? (windowEnd - currentTask.timestamp) / 1000 : 0,
      task_progress_ratio: taskProgressRatio,
      subtask_switches: currentTask?.subtaskSwitchesCount || 0,
      task_urgency_score: taskUrgencyScore,
      task_idle_time_ratio: taskIdleTimeRatio,
    };


    // --- Gaze Features ---
    let totalFixationFrequency = 0;
    let totalSaccadeAmplitude = 0;
    let gazeDeviation = 0;
    let scanPathTortuosity = 0;
    let totalPupilDilation = 0;
    let blinkRate = 0; // Mocked

    if (gazeEvents.length > 0) {
        totalFixationFrequency = gazeEvents.filter(g => g.fixationDuration !== undefined && g.fixationDuration > 0).length / durationSeconds;
        totalSaccadeAmplitude = gazeEvents.filter(g => g.saccadeAmplitude !== undefined && g.saccadeAmplitude > 0).map(g => g.saccadeAmplitude || 0).reduce((sum, val) => sum + val, 0) / gazeEvents.length;
        totalPupilDilation = gazeEvents.filter(g => g.pupilDilation !== undefined).map(g => g.pupilDilation || 0).reduce((sum, val) => sum + val, 0) / gazeEvents.length;
        blinkRate = gazeEvents.length > 0 ? (gazeEvents.length / 20) / durationSeconds : 0; // Mock: 1 blink every 20 gaze events
        // Mocking gaze deviation from focus, assuming currentTask might define a main target
        const mainTaskElement = currentTask ? this.uiElementTracker.getElement(currentTask.id) : null; // simplified
        gazeDeviation = this.calculateGazeDeviationFromFocus(gazeEvents, mainTaskElement?.boundingRect); // Math Equation 15
        scanPathTortuosity = this.calculateScanPathTortuosity(gazeEvents); // Math Equation 22
    }


    const featureVector: TelemetryFeatureVector = {
      timestamp_window_end: windowEnd,
      event_density: windowEvents.length / durationSeconds,
      interaction_rate: this.calculateInteractionRate((mouseMoveEvents.length + clickEvents.length + keydownEvents.length + scrollEvents.length + formEvents.length), durationSeconds), // Math Equation 23
      task_context: taskContextFeatures,
    };

    if (mouseMoveEvents.length > 0) {
      featureVector.mouse = {
        mouse_velocity_avg: mouseMoveEvents.length > 1 ? totalMouseVelocity / (mouseMoveEvents.length - 1) : 0,
        mouse_acceleration_avg: mouseMoveEvents.length > 2 ? totalMouseAcceleration / (mouseMoveEvents.length - 2) : 0,
        mouse_path_tortuosity: this.calculateMousePathTortuosity(mouseMoveEvents), // Math Equation 7
        mouse_dwell_time_avg: mouseDwellTimeAvg,
        fitts_law_ip_avg: this.calculateFittsLawIndex(clickEvents), // Math Equation 10
        mouse_jerk_avg: mouseMoveEvents.length > 3 ? totalMouseJerk / (mouseMoveEvents.length - 3) : 0,
        mouse_entropy: this.calculateMouseEntropy(mouseMoveEvents), // Math Equation 13
        element_hover_to_click_latency_avg: validHoverToClickCount > 0 ? totalHoverToClickLatency / validHoverToClickCount : 0,
      };
    }

    if (clickEvents.length > 0) {
      featureVector.clicks = {
        click_frequency: clickEvents.length / durationSeconds,
        click_latency_avg: clickEvents.length > 1 ? totalClickLatency / (clickEvents.length - 1) : 0,
        target_acquisition_error_avg: this.calculateTargetAcquisitionError(clickEvents), // Math Equation 8
        double_click_frequency: doubleClickCount / durationSeconds,
        click_burst_rate: clickBurstCount / durationSeconds,
        click_precision_avg: this.calculateClickPrecision(clickEvents), // Math Equation 9
      };
    }

    if (scrollEvents.length > 0) {
      featureVector.scroll = {
        scroll_velocity_avg: avgScrollVelocity,
        scroll_direction_changes: scrollDirectionChanges,
        scroll_pause_frequency: scrollPauseCount / durationSeconds,
        scroll_page_coverage_avg: totalPageCoverage,
        scroll_intensity_score: scrollIntensityScore, // Math Equation 16
        scroll_backtracking_ratio: scrollBacktrackingRatio, // Math Equation 14
        scroll_jerkiness_avg: this.calculateScrollJerkiness(scrollEvents), // Math Equation 12
      };
    }

    if (keydownEvents.length > 0) {
      featureVector.keyboard = {
        typing_speed_wpm: wordCount / (durationSeconds / 60),
        backspace_frequency: backspaceCount / durationSeconds,
        keystroke_latency_avg: nonModifierKeydownCount > 1 ? totalKeystrokeLatency / (nonModifierKeydownCount - 1) : 0,
        error_correction_rate: errorCorrectionRate, // Math Equation 17
        typing_burst_speed: typingBurstSpeedWPM, // Math Equation 18
        keystroke_entropy: this.calculateKeystrokeEntropy(keydownEvents), // Math Equation 11
        modifier_key_frequency: modifierKeyFrequency, // Math Equation 24
      };
    }

    featureVector.errors = {
      form_validation_errors_count: formValidationErrors,
      repeated_action_attempts_count: repeatedActionAttempts,
      navigation_errors_count: navigationErrors,
      api_errors_count: apiErrors,
      task_reversal_count: taskReversalCount, // Math Equation 19
      cognitive_friction_score: cognitiveFrictionScore, // Math Equation 25
    };

    if (gazeEvents.length > 0) {
        featureVector.gaze = {
            fixation_frequency: totalFixationFrequency,
            saccade_amplitude_avg: totalSaccadeAmplitude,
            gaze_deviation_from_focus: gazeDeviation, // Math Equation 15
            scan_path_tortuosity: scanPathTortuosity, // Math Equation 22
            pupil_dilation_avg: totalPupilDilation,
            blink_rate: blinkRate,
        };
    }

    // Clear event histories for the processed window.
    this.mouseMoveEventHistory = this.mouseMoveEventHistory.filter(e => e.timestamp >= windowEnd);
    this.scrollEventHistory = this.scrollEventHistory.filter(e => e.timestamp >= windowEnd);
    this.keyboardEventHistory = this.keyboardEventHistory.filter(e => e.timestamp >= windowEnd);
    this.gazeEventHistory = this.gazeEventHistory.filter(e => e.timestamp >= windowEnd);

    this.uiElementTracker.resetMetricsForWindow(); // Reset interaction metrics for the next window

    // Update last known states for next window
    this.lastMouseCoord = mouseMoveEvents.length > 0 ? mouseMoveEvents[mouseMoveEvents.length - 1] : this.lastMouseCoord;
    this.lastScrollY = scrollEvents.length > 0 ? { y: scrollEvents[scrollEvents.length - 1].scrollY, timestamp: scrollEvents[scrollEvents.length - 1].timestamp, viewportHeight: scrollEvents[scrollEvents.length - 1].viewportHeight, documentHeight: scrollEvents[scrollEvents.length - 1].documentHeight } : this.lastScrollY;

    return featureVector;
  };

  private flushBuffer = (): void => {
    if (this.eventBuffer.length > 0) {
      const features = this.extractFeatures(this.eventBuffer);
      this.featureProcessingCallback(features);
      this.eventBuffer = []; // Clear buffer
    }
  };

  public stop(): void {
    if (typeof window !== 'undefined') {
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
    }
    if (this.bufferInterval) {
      clearInterval(this.bufferInterval);
    }
    this.interactionErrorLogger.stop();
  }
}

// --- Predictive Analytics Service (New Class) ---
/**
 * @overview
 * The `PredictiveAnalyticsService` is the oracle of the system, peering into the immediate future
 * to anticipate cognitive storms before they gather. It disproves the fatalism of pure reaction,
 * asserting that foresight is the cornerstone of true prevention and enduring tranquility.
 */
export class PredictiveAnalyticsService {
    private static instance: PredictiveAnalyticsService;
    private userProfileService = UserProfileService.getInstance();
    private loadHistory: number[] = []; // Stores raw load values for local prediction

    private constructor() {}

    public static getInstance(): PredictiveAnalyticsService {
        if (!PredictiveAnalyticsService.instance) {
            PredictiveAnalyticsService.instance = new PredictiveAnalyticsService();
        }
        return PredictiveAnalyticsService.instance;
    }

    public updateLoadHistory(load: number): void {
        this.loadHistory.push(load);
        if (this.loadHistory.length > 50) { // Keep a rolling window
            this.loadHistory.shift();
        }
    }

    /**
     * Predicts the cognitive load for the next time window based on current features and recent history.
     * Uses a simplified autoregressive model with feature contributions.
     * Math Equation 26: Autoregressive Predictive Model for Cognitive Load
     * L_{t+1} = \alpha_0 + \sum_{i=1}^{P} \alpha_i L_{t-i+1} + \sum_{j=1}^{M} \beta_j F_{j,t} + \epsilon_t
     * where L is load, F are features, \alpha_i are autoregressive coefficients, \beta_j are feature weights, \epsilon_t is error.
     * A real implementation would use a trained ML model (e.g., LSTM, ARIMA).
     */
    public predictNextLoad(currentFeatures: TelemetryFeatureVector): number {
        if (this.loadHistory.length < 5) { // Not enough history for robust prediction
            return this.loadHistory.length > 0 ? this.loadHistory[this.loadHistory.length - 1] : this.userProfileService.getPreferences().personalizedBaselineCLS;
        }

        let predictedLoad = 0;
        const arCoefficients = [0.4, 0.2, 0.1, 0.05, 0.02]; // Autoregressive coefficients (mocked, sum to 0.77)
        const featureWeights = { // Simplified and scaled for prediction
            event_density: 0.01,
            mouse_velocity_avg: 0.02,
            mouse_acceleration_avg: 0.03,
            click_frequency: 0.01,
            target_acquisition_error_avg: 0.04,
            backspace_frequency: 0.05,
            error_correction_rate: 0.06,
            form_validation_errors_count: 0.1,
            current_task_complexity: 0.08,
            gaze_deviation_from_focus: 0.03,
            cognitive_friction_score: 0.07,
            task_idle_time_ratio: -0.05, // More idle time, lower predicted load
        };

        // Autoregressive component: leverage recent historical load
        for (let i = 0; i < arCoefficients.length && i < this.loadHistory.length; i++) {
            predictedLoad += arCoefficients[i] * this.loadHistory[this.loadHistory.length - 1 - i];
        }

        // Feature component: current state influence
        if (currentFeatures.mouse) {
            predictedLoad += (currentFeatures.mouse.mouse_velocity_avg / 10) * featureWeights.mouse_velocity_avg;
            predictedLoad += (currentFeatures.mouse.mouse_acceleration_avg / 0.5) * featureWeights.mouse_acceleration_avg;
        }
        if (currentFeatures.clicks) {
            predictedLoad += (currentFeatures.clicks.click_frequency / 5) * featureWeights.click_frequency;
            predictedLoad += (currentFeatures.clicks.target_acquisition_error_avg / 50) * featureWeights.target_acquisition_error_avg;
        }
        if (currentFeatures.keyboard) {
            predictedLoad += (currentFeatures.keyboard.backspace_frequency / 2) * featureWeights.backspace_frequency;
            predictedLoad += (currentFeatures.keyboard.error_correction_rate * 2) * featureWeights.error_correction_rate;
        }
        if (currentFeatures.errors) {
            predictedLoad += (currentFeatures.errors.form_validation_errors_count * 0.5) * featureWeights.form_validation_errors_count;
            predictedLoad += (currentFeatures.errors.cognitive_friction_score * 0.5) * featureWeights.cognitive_friction_score;
        }
        if (currentFeatures.task_context) {
            predictedLoad += currentFeatures.task_context.current_task_complexity * featureWeights.current_task_complexity;
            predictedLoad += currentFeatures.task_context.task_idle_time_ratio * featureWeights.task_idle_time_ratio;
        }
        if (currentFeatures.gaze) {
            predictedLoad += (currentFeatures.gaze.gaze_deviation_from_focus / 100) * featureWeights.gaze_deviation_from_focus;
        }
        predictedLoad += (currentFeatures.event_density / 50) * featureWeights.event_density;

        // Baseline adjustment (constant term alpha_0)
        predictedLoad += (1 - arCoefficients.reduce((sum, val) => sum + val, 0)) * this.userProfileService.getPreferences().personalizedBaselineCLS;


        // Clamp predicted load
        return Math.min(1.0, Math.max(0.0, predictedLoad));
    }

    /**
     * Math Equation 27: Risk Score Calculation
     * Risk = L_{predicted} \times C_{task} \times S_{user}
     * where L_{predicted} is predicted load, C_{task} is task complexity, S_{user} is user stress sensitivity.
     */
    public calculateRiskScore(predictedLoad: number, taskComplexity: number): number {
        const stressSensitivity = this.userProfileService.getPreferences().stressSensitivity;
        return predictedLoad * taskComplexity * stressSensitivity;
    }

    /**
     * Math Equation 28: Estimated Intervention Effectiveness
     * E = E_base \times (1 - L_{current}) \times (1 + S_{user}) \times (1 + R_{cognitive})
     * where E_base is base effectiveness, L_{current} is current load, S_{user} is stress sensitivity, R_{cognitive} is cognitive resilience.
     * This is a very simplified model.
     */
    public estimateInterventionEffectiveness(interventionType: 'minimal' | 'focus' | 'guided' | 'low-distraction', currentLoad: number): number {
        const baseEffectiveness: { [key in typeof interventionType]: number } = {
            'minimal': 0.8,
            'focus': 0.6,
            'guided': 0.7,
            'low-distraction': 0.5
        };
        const prefs = this.userProfileService.getPreferences();
        const sensitivityFactor = 1 + (prefs.stressSensitivity * 0.5); // More sensitive user, higher impact
        const resilienceFactor = 1 + (prefs.cognitiveResilience * 0.2); // More resilient user, interventions might be less 'needed' or more effective
        return (baseEffectiveness[interventionType] || 0.5) * (1 - currentLoad) * sensitivityFactor * resilienceFactor;
    }
}

// --- Adaptive Threshold Manager (New Class) ---
/**
 * @overview
 * The `AdaptiveThresholdManager` is the wise adjudicator, constantly recalibrating the boundaries of acceptable load,
 * recognizing that the human capacity is not static but fluid, shaped by context and experience. It disproves
 * the rigidity of fixed limits, asserting that true control lies in dynamic responsiveness.
 */
export class AdaptiveThresholdManager {
    private static instance: AdaptiveThresholdManager;
    private userProfileService = UserProfileService.getInstance();
    private taskContextManager = TaskContextManager.getInstance();

    private constructor() {}

    public static getInstance(): AdaptiveThresholdManager {
        if (!AdaptiveThresholdManager.instance) {
            AdaptiveThresholdManager.instance = new AdaptiveThresholdManager();
        }
        return AdaptiveThresholdManager.instance;
    }

    /**
     * Dynamically adjusts cognitive load thresholds based on current task, user history, and preferences.
     * Math Equation 29: Dynamic Threshold Adjustment for 'High' Load
     * T_{high, new} = T_{high, base} + (C_{task} \times W_C) - (L_{baseline} \times W_L) + (P_{style} \times W_P) + (R_{cognition} \times W_R)
     * where T_{high, base} is baseline high threshold, C_{task} is task complexity, W are weights, L_{baseline} is user baseline load, P_{style} is preferred adaptation style factor, R_{cognition} is cognitive resilience.
     */
    public adjustThresholds(currentLoad: number): UserPreferences['cognitiveLoadThresholds'] {
        const baseThresholds = this.userProfileService.getPreferences().cognitiveLoadThresholds;
        const currentTask = this.taskContextManager.getCurrentTask();
        const userBaseline = this.userProfileService.getPreferences().personalizedBaselineCLS;
        const learningRate = this.userProfileService.getPreferences().learningRate;
        const preferredStyle = this.userProfileService.getPreferences().preferredAdaptationStyle;
        const cognitiveResilience = this.userProfileService.getPreferences().cognitiveResilience;

        let taskComplexityFactor = 0;
        if (currentTask) {
            const complexityMap: { [key in TaskContext['complexity']]: number } = {
                'low': -0.1, 'medium': 0, 'high': 0.1, 'critical': 0.2, 'dynamic': 0.05
            };
            taskComplexityFactor = complexityMap[currentTask.complexity];
        }

        let adaptationStyleFactor = 0;
        if (preferredStyle === 'proactive') adaptationStyleFactor = -0.05; // Lower thresholds for proactive adaptation
        else if (preferredStyle === 'minimal') adaptationStyleFactor = 0.05; // Higher thresholds for minimal intervention

        // Resilience factor: more resilient users might tolerate slightly higher load before intervention
        const resilienceAdjustment = (cognitiveResilience - 0.5) * 0.05; // -0.025 to +0.025

        const adjustmentFactor = taskComplexityFactor - (userBaseline * 0.1) + adaptationStyleFactor + resilienceAdjustment; // Math Equation 30

        // Apply learning rate to make adjustments more gradual or aggressive
        const adjustedHigh = baseThresholds.high + (adjustmentFactor * learningRate);
        const adjustedLow = baseThresholds.low + (adjustmentFactor * learningRate);
        const adjustedCritical = baseThresholds.critical + (adjustmentFactor * 1.2 * learningRate);
        const adjustedCriticalLow = baseThresholds.criticalLow + (adjustmentFactor * 1.2 * learningRate);
        const adjustedGuided = baseThresholds.guided + (adjustmentFactor * learningRate);
        const adjustedGuidedLow = baseThresholds.guidedLow + (adjustmentFactor * learningRate);
        const adjustedAdaptiveHigh = baseThresholds.adaptiveHigh + (adjustmentFactor * 0.8 * learningRate);
        const adjustedAdaptiveLow = baseThresholds.adaptiveLow + (adjustmentFactor * 0.8 * learningRate);

        // Clamp thresholds between 0 and 1
        return {
            high: Math.min(0.9, Math.max(0.1, adjustedHigh)), // Math Equation 31
            low: Math.min(0.8, Math.max(0.05, adjustedLow)), // Math Equation 32
            critical: Math.min(0.95, Math.max(0.5, adjustedCritical)), // Math Equation 33
            criticalLow: Math.min(0.9, Math.max(0.4, adjustedCriticalLow)), // Math Equation 34
            guided: Math.min(0.9, Math.max(0.5, adjustedGuided)), // Math Equation 35
            guidedLow: Math.min(0.8, Math.max(0.4, adjustedGuidedLow)), // Math Equation 36
            adaptiveHigh: Math.min(0.85, Math.max(0.3, adjustedAdaptiveHigh)), // Math Equation 37
            adaptiveLow: Math.min(0.75, Math.max(0.2, adjustedAdaptiveLow)), // Math Equation 38
        };
    }

    /**
     * Math Equation 39: Threshold Hysteresis
     * To prevent rapid mode switching:
     * T_{up} = T_{base} + \delta
     * T_{down} = T_{base} - \delta
     * A mode change only occurs if load crosses T_up or T_down, not just T_base.
     */
    public applyHysteresis(threshold: number, currentMode: UiMode, targetMode: UiMode, hysteresisFactor: number = 0.02): { up: number, down: number } {
        if (currentMode === targetMode) { // If already in target mode, maintain current thresholds
            return { up: threshold, down: threshold };
        }
        // Increase threshold for entering 'higher' load mode, decrease for 'lower' load mode
        if (this.isModeHigherLoad(targetMode, currentMode)) {
            return { up: threshold + hysteresisFactor, down: threshold }; // Need to go higher to confirm
        } else {
            return { up: threshold, down: threshold - hysteresisFactor }; // Need to go lower to confirm
        }
    }

    /**
     * Defines an ordinal scale for UI modes based on their typical cognitive load implications.
     * Used by hysteresis to determine if a target mode is 'higher' or 'lower' load.
     * Lower index means generally higher cognitive load reduction (more aggressive adaptation).
     */
    public isModeHigherLoad(mode1: UiMode, mode2: UiMode): boolean {
        const modeOrder: UiMode[] = ['minimal', 'hyperfocus', 'guided', 'focus', 'low-distraction', 'adaptive', 'standard'];
        return modeOrder.indexOf(mode1) < modeOrder.indexOf(mode2);
    }
}

// --- Adaptive Learning Engine (New Class) ---
/**
 * @overview
 * The `AdaptiveLearningEngine` is the system's own inner physician, the voice of continuous self-improvement.
 * It does not merely observe; it learns. It disproves the arrogance of fixed intelligence, asserting that
 * true mastery lies in persistent, humble self-correction and eternal striving for a better truth.
 * This engine is the beating heart of homeostasis, ensuring the system remains bulletproof and ever-optimized.
 *
 * @mermaid
 * graph TD
 *    A[UI Mode Changed] --> B{Snapshot Pre-Transition State}
 *    B --> C[Monitor Post-Transition Load/Errors]
 *    C --> D{Evaluation Window Ends?}
 *    D -- Yes --> E(Calculate Effectiveness Score)
 *    E --> F{Score Positive?}
 *    F -- Yes --> G[Reinforce Model (UserProfile, Thresholds)]
 *    F -- No --> H[Penalize Model (UserProfile, Thresholds)]
 *    G & H --> I[Log Learning Event]
 *    I --> J{Reset Evaluation Context}
 */
/**
 * Claim 11: The AdaptiveLearningEngine embodies the principle of systemic introspection, continuously validating and refining the cognitive load model and adaptation policies through a robust feedback loop, ensuring eternal homeostasis.
 */
export class AdaptiveLearningEngine {
    private static instance: AdaptiveLearningEngine;
    private userProfileService = UserProfileService.getInstance();
    private cognitiveLoadEngine: CognitiveLoadEngine | null = null;
    private adaptiveThresholdManager: AdaptiveThresholdManager | null = null;
    private interactionErrorLogger = InteractionErrorLogger.getInstance();

    private lastModeChangeContext: {
        timestamp: number;
        oldMode: UiMode;
        newMode: UiMode;
        preLoadSnapshot: HistoricalLoadEntry[]; // Snapshot of load before change
        preErrorSnapshot: InteractionError[]; // Snapshot of errors before change
    } | null = null;

    private postTransitionLoadHistory: { timestamp: number; load: number }[] = [];
    private postTransitionErrorHistory: { timestamp: number; errorCount: number }[] = [];
    private readonly evaluationWindowMs: number = 7000; // Evaluate adaptation effect over 7 seconds
    private readonly preEvaluationWindowMs: number = 5000; // Look at data this far back before transition

    private constructor() {
        // Private constructor for Singleton pattern. Dependencies set by initialize.
    }

    public static getInstance(): AdaptiveLearningEngine {
        if (!AdaptiveLearningEngine.instance) {
            AdaptiveLearningEngine.instance = new AdaptiveLearningEngine();
        }
        return AdaptiveLearningEngine.instance;
    }

    public initialize(cognitiveLoadEngine: CognitiveLoadEngine, adaptiveThresholdManager: AdaptiveThresholdManager): void {
        this.cognitiveLoadEngine = cognitiveLoadEngine;
        this.adaptiveThresholdManager = adaptiveThresholdManager;
        // console.log("AdaptiveLearningEngine initialized.");
    }

    public onUiModeChanged(newMode: UiMode, oldMode: UiMode, currentLoad: number): void {
        if (newMode !== oldMode) {
            const now = performance.now();
            // Snapshot relevant pre-transition data from UserProfileService history
            const userLoadHistory = this.userProfileService.getLoadHistory();
            const preLoadSnapshot = userLoadHistory.filter(entry => entry.timestamp >= (now - this.preEvaluationWindowMs) && entry.timestamp < now);

            // Snapshot errors before transition
            const preErrorSnapshot = this.interactionErrorLogger.getRecentErrors(this.preEvaluationWindowMs);

            this.lastModeChangeContext = {
                timestamp: now,
                oldMode: oldMode,
                newMode: newMode,
                preLoadSnapshot: preLoadSnapshot,
                preErrorSnapshot: preErrorSnapshot
            };
            this.postTransitionLoadHistory = [];
            this.postTransitionErrorHistory = [];
            // console.log(`ALE: Mode changed from ${oldMode} to ${newMode}. Starting evaluation window.`);
        }
    }

    public onCognitiveLoadUpdated(load: number): void {
        if (this.lastModeChangeContext && performance.now() - this.lastModeChangeContext.timestamp < this.evaluationWindowMs) {
            this.postTransitionLoadHistory.push({ timestamp: performance.now(), load });
        }
    }

    public onInteractionErrorsUpdated(errors: InteractionError[]): void {
        if (this.lastModeChangeContext && performance.now() - this.lastModeChangeContext.timestamp < this.evaluationWindowMs) {
            this.postTransitionErrorHistory.push({ timestamp: performance.now(), errorCount: errors.length });
        }
    }

    /**
     * Math Equation 104: Comprehensive Adaptation Effectiveness Score
     * E = (AvgLoad_pre - AvgLoad_post) \times W_L + (TotalErrors_pre - TotalErrors_post) \times W_E + (TaskSuccess_delta \times W_T)
     * where W_L, W_E, W_T are weights.
     * This score quantifies how much the mode change helped or hindered the user's cognitive state.
     */
    public evaluateAdaptationEffectiveness(): void {
        if (!this.lastModeChangeContext || performance.now() - this.lastModeChangeContext.timestamp < this.evaluationWindowMs) {
            return; // Not enough time has passed or no active mode change to evaluate
        }

        const { oldMode, newMode, preLoadSnapshot, preErrorSnapshot } = this.lastModeChangeContext;

        const avgPreLoad = preLoadSnapshot.length > 0 ? preLoadSnapshot.reduce((sum, entry) => sum + entry.load, 0) / preLoadSnapshot.length : 0;
        const avgPostLoad = this.postTransitionLoadHistory.length > 0 ? this.postTransitionLoadHistory.reduce((sum, entry) => sum + entry.load, 0) / this.postTransitionLoadHistory.length : 0;

        const totalPreErrors = preErrorSnapshot.length;
        const totalPostErrors = this.postTransitionErrorHistory.reduce((sum, entry) => sum + entry.errorCount, 0);

        // Weigh load reduction more heavily, but errors are critical
        const weightLoad = 0.7;
        const weightErrors = 0.3;

        let effectivenessScore = (avgPreLoad - avgPostLoad) * weightLoad;
        effectivenessScore += (totalPreErrors - totalPostErrors) * weightErrors;

        // Math Equation 105: Dynamic Learning Rate
        // The user's learning rate is a base, but could be adjusted here based on system's confidence or impact.
        const learningRate = this.userProfileService.getPreferences().learningRate;

        // "The voice for the voiceless": Amplify the subtle signals of struggle or relief.
        // A profound system doesn't just react; it learns the user's silent language.
        if (effectivenessScore > 0.05) { // Adaptation was positive, load/errors reduced meaningfully
            // console.log(`ALE: Mode transition from ${oldMode} to ${newMode} was effective (score: ${effectivenessScore.toFixed(3)}). Reinforcing model.`);
            this.reinforceModel(newMode, effectivenessScore, learningRate);
        } else if (effectivenessScore < -0.05) { // Adaptation was negative, load/errors increased meaningfully
            // console.log(`ALE: Mode transition from ${oldMode} to ${newMode} was detrimental (score: ${effectivenessScore.toFixed(3)}). Penalizing model.`);
            this.penalizeModel(newMode, effectivenessScore, learningRate);
        } else {
            // console.log(`ALE: Mode transition from ${oldMode} to ${newMode} had neutral effect (score: ${effectivenessScore.toFixed(3)}). No change.`);
        }

        this.lastModeChangeContext = null; // Reset for next evaluation
        this.postTransitionLoadHistory = [];
        this.postTransitionErrorHistory = [];
    }

    private reinforceModel(mode: UiMode, score: number, learningRate: number): void {
        const prefs = this.userProfileService.getPreferences();
        const impactFactor = Math.min(1, score * 2); // Scale score to an impact factor [0, 1] for controlled adjustment

        // Adjust user's personalized baseline CLS and resilience:
        // If adaptation was effective, perhaps their baseline is slightly lower (system helped them perform better),
        // or they are more resilient than previously thought.
        this.userProfileService.updatePreferences({
            personalizedBaselineCLS: Math.max(0.01, prefs.personalizedBaselineCLS - (learningRate * impactFactor * 0.01)),
            cognitiveResilience: Math.min(1.0, prefs.cognitiveResilience + (learningRate * impactFactor * 0.02)),
            stressSensitivity: Math.max(0.1, prefs.stressSensitivity - (learningRate * impactFactor * 0.01))
        });

        // The CognitiveLoadEngine weights could be subtly adjusted here,
        // specifically reinforcing the features that correctly predicted the need for the `oldMode` or the success of the `newMode`.
        // This is a complex area for a mock, but conceptually, if a feature's high value led to a successful adaptation, its weight might be slightly increased.
        // Math Equation 106: Contextual Weight Adjustment for CLS Features
        // W_{new,f} = W_{old,f} + \eta \times Effectiveness \times FeatureContributionMultiplier
        // (This would require a more detailed feature state comparison for specific weights)

        // AdaptiveThresholdManager adjustments:
        // If the mode transition was successful (e.g., to 'focus' when load was high),
        // it implies the threshold triggering that 'focus' mode was appropriate, or could even be slightly more proactive.
        const currentThresholds = prefs.cognitiveLoadThresholds;
        const newThresholds = { ...currentThresholds };
        switch(mode) {
            case 'focus': // Transition to focus was effective in reducing load
                newThresholds.high = Math.max(0.1, newThresholds.high - (learningRate * impactFactor * 0.005)); // Make threshold more sensitive
                newThresholds.adaptiveHigh = Math.max(0.1, newThresholds.adaptiveHigh - (learningRate * impactFactor * 0.005)); // Reinforce proactive threshold
                break;
            case 'minimal': // Transition to minimal was effective for critical overload
                newThresholds.critical = Math.max(0.5, newThresholds.critical - (learningRate * impactFactor * 0.007)); // Make threshold more sensitive
                break;
            case 'guided': // Guided mode successfully reduced load in a complex task
                newThresholds.guided = Math.max(0.5, newThresholds.guided - (learningRate * impactFactor * 0.006));
                break;
            case 'standard': // Returning to standard was effective (load was truly low)
                newThresholds.low = Math.min(0.8, newThresholds.low + (learningRate * impactFactor * 0.005)); // Make threshold less sensitive to low
                newThresholds.adaptiveLow = Math.min(0.75, newThresholds.adaptiveLow + (learningRate * impactFactor * 0.005)); // Reinforce proactive return
                break;
        }
        this.userProfileService.updatePreferences({ cognitiveLoadThresholds: newThresholds });
    }

    private penalizeModel(mode: UiMode, score: number, learningRate: number): void {
        const prefs = this.userProfileService.getPreferences();
        const impactFactor = Math.min(1, Math.abs(score) * 2); // Scale negative score to impact factor [0, 1]

        // Adjust user's personalized baseline CLS and resilience:
        // If adaptation failed, maybe the baseline is higher (system expected less load), or user is less resilient.
        this.userProfileService.updatePreferences({
            personalizedBaselineCLS: Math.min(1.0, prefs.personalizedBaselineCLS + (learningRate * impactFactor * 0.01)),
            cognitiveResilience: Math.max(0.01, prefs.cognitiveResilience - (learningRate * impactFactor * 0.02)),
            stressSensitivity: Math.min(1.0, prefs.stressSensitivity + (learningRate * impactFactor * 0.01))
        });

        // CognitiveLoadEngine weights adjustment (opposite of reinforcement)
        // If a feature's high value led to an unsuccessful adaptation, its weight might be slightly decreased.
        // Math Equation 107: Contextual Weight Adjustment for CLS Features (Penalization)
        // W_{new,f} = W_{old,f} - \eta \times Ineffectiveness \times FeatureContributionMultiplier

        // AdaptiveThresholdManager adjustments:
        // If the mode transition was unsuccessful (e.g., to 'focus' but load increased),
        // it implies the threshold triggering that 'focus' mode was too sensitive or incorrect.
        const currentThresholds = prefs.cognitiveLoadThresholds;
        const newThresholds = { ...currentThresholds };
        switch(mode) {
            case 'focus': // Transition to focus was ineffective (load increased)
                newThresholds.high = Math.min(0.9, newThresholds.high + (learningRate * impactFactor * 0.005)); // Make threshold less sensitive
                newThresholds.adaptiveHigh = Math.min(0.85, newThresholds.adaptiveHigh + (learningRate * impactFactor * 0.005)); // Soften proactive threshold
                break;
            case 'minimal': // Transition to minimal was ineffective for critical overload
                newThresholds.critical = Math.min(0.95, newThresholds.critical + (learningRate * impactFactor * 0.007)); // Make threshold less sensitive
                break;
            case 'guided': // Guided mode failed to reduce load
                newThresholds.guided = Math.min(0.9, newThresholds.guided + (learningRate * impactFactor * 0.006));
                break;
            case 'standard': // Returning to standard was *not* effective (load remained high)
                newThresholds.low = Math.max(0.05, newThresholds.low - (learningRate * impactFactor * 0.005)); // Make threshold more sensitive to low
                newThresholds.adaptiveLow = Math.max(0.2, newThresholds.adaptiveLow - (learningRate * impactFactor * 0.005)); // Soften proactive return
                break;
        }
        this.userProfileService.updatePreferences({ cognitiveLoadThresholds: newThresholds });
    }
}

// --- Cognitive Load Inference Engine ---
/**
 * @overview
 * The `CognitiveLoadEngine` is the profound interpreter, the core of the system's wisdom.
 * It synthesizes myriad whispers of interaction into a singular, undeniable truth: the user's cognitive state.
 * It disproves the notion of unknowable inner experience, asserting that human struggle can be quantified, understood, and ultimately alleviated.
 *
 * @mermaid
 * graph TD
 *    A[TelemetryFeatureVector] --> B{processFeatures()}
 *    B --> C[latestFeatureVector]
 *    C --> D[predictionTimer]
 *    D -- Trigger --> E(inferLoad())
 *    E --> F[mockPredict(features)]
 *    F --> G[Apply Smoothing (EMA)]
 *    G --> H(onCognitiveLoadUpdate)
 *    H --> I[UserProfileService: addLoadToHistory]
 *    H --> J[PredictiveAnalyticsService: updateLoadHistory]
 */
/**
 * Claim 7: The CognitiveLoadEngine accurately infers real-time cognitive load by employing a sophisticated, multi-modal feature vector and a dynamically weighted prediction model.
 */
export class CognitiveLoadEngine {
  private latestFeatureVector: TelemetryFeatureVector | null = null;
  private loadHistory: number[] = []; // For internal smoothing
  private readonly historyLength: number = 20; // For smoothing
  private readonly predictionIntervalMs: number = 500;
  private predictionTimer: ReturnType<typeof setInterval> | null = null;
  private onCognitiveLoadUpdate: (load: number) => void;
  private userProfileService = UserProfileService.getInstance();
  private predictiveAnalyticsService = PredictiveAnalyticsService.getInstance();

  private _weights: { [key: string]: number } = {
    mouse_velocity_avg: 0.1, mouse_acceleration_avg: 0.15, mouse_path_tortuosity: 0.2, mouse_jerk_avg: 0.25, mouse_entropy: 0.15, element_hover_to_click_latency_avg: 0.2,
    click_frequency: 0.1, click_latency_avg: 0.15, target_acquisition_error_avg: 0.25, double_click_frequency: 0.1, click_burst_rate: 0.15, click_precision_avg: 0.2,
    scroll_velocity_avg: 0.05, scroll_direction_changes: 0.1, scroll_pause_frequency: 0.05, scroll_page_coverage_avg: 0.08, scroll_intensity_score: 0.12, scroll_backtracking_ratio: 0.2, scroll_jerkiness_avg: 0.15,
    typing_speed_wpm: 0.15, backspace_frequency: 0.3, keystroke_latency_avg: 0.1, error_correction_rate: 0.2, typing_burst_speed: 0.18, keystroke_entropy: 0.15, modifier_key_frequency: 0.1,
    form_validation_errors_count: 0.4, repeated_action_attempts_count: 0.3, navigation_errors_count: 0.2, api_errors_count: 0.25, task_reversal_count: 0.35, cognitive_friction_score: 0.3,
    current_task_complexity: 0.2, time_in_current_task_sec: 0.05, task_progress_ratio: 0.08, subtask_switches: 0.1, task_urgency_score: 0.15, task_idle_time_ratio: -0.1,
    event_density: 0.1, interaction_rate: 0.15,
    fixation_frequency: 0.1, saccade_amplitude_avg: 0.15, gaze_deviation_from_focus: 0.25, scan_path_tortuosity: 0.18, pupil_dilation_avg: 0.22, blink_rate: 0.17,
  };

  constructor(onUpdate: (load: number) => void) {
    this.onCognitiveLoadUpdate = onUpdate;
    if (typeof setInterval !== 'undefined') {
      this.predictionTimer = setInterval(this.inferLoad, this.predictionIntervalMs);
    }
  }

  public processFeatures(featureVector: TelemetryFeatureVector): void {
    this.latestFeatureVector = featureVector;
  }

  /**
   * A more sophisticated mock machine learning model for cognitive load prediction.
   * This function simulates a weighted sum model with non-linear feature transformations.
   * Math Equation 40: Cognitive Load Prediction Model (Enhanced)
   * CLS = B + \sum_{f \in Features} W_f \times T_f(V_f) + \sum_{i,j \in Interactions} W_{ij} \times I_{ij}(V_i, V_j) + \epsilon
   * where B is baseline, W_f are feature weights, T_f is non-linear transformation for feature f, V_f is feature value.
   * W_{ij} are interaction weights, I_{ij} is interaction term, \epsilon represents noise/unaccounted factors.
   */
  private mockPredict(features: TelemetryFeatureVector): number {
    const prefs = this.userProfileService.getPreferences();
    let score = prefs.personalizedBaselineCLS; // Start with baseline

    const weights = this._weights;

    // Math Equation 41: Non-linear transformation for feature (e.g., sigmoid or logarithmic scaling)
    const sigmoid = (x: number, k: number = 1, x0: number = 0) => 1 / (1 + Math.exp(-k * (x - x0))); // Math Equation 42
    const logScale = (x: number, c: number = 1) => Math.log1p(x / c); // Math Equation 43
    const inverseSigmoid = (x: number, k: number = 1, x0: 0) => sigmoid(x, -k, x0); // High value implies low load

    // Contribution from Mouse Features
    if (features.mouse) {
      score += sigmoid(features.mouse.mouse_velocity_avg / 5, 2, 0.5) * weights.mouse_velocity_avg; // Math Equation 44
      score += sigmoid(features.mouse.mouse_acceleration_avg / 0.2, 2, 0.5) * weights.mouse_acceleration_avg; // Math Equation 45
      score += sigmoid(features.mouse.mouse_path_tortuosity / 2, 2, 0.5) * weights.mouse_path_tortuosity; // Math Equation 46
      score += sigmoid(features.mouse.mouse_jerk_avg / 0.1, 2, 0.5) * weights.mouse_jerk_avg; // Math Equation 47
      score += sigmoid(features.mouse.mouse_entropy / 3, 2, 0.5) * weights.mouse_entropy; // Math Equation 48
      score += (1 - sigmoid(features.mouse.fitts_law_ip_avg / 5, 2, 1)) * weights.fitts_law_ip_avg; // Lower IP means higher load. Math Equation 49
      score += sigmoid(features.mouse.element_hover_to_click_latency_avg / 500, 2, 0.5) * weights.element_hover_to_click_latency_avg; // Math Equation 50
    }

    // Contribution from Click Features
    if (features.clicks) {
      score += logScale(features.clicks.click_frequency / 2, 1) * weights.click_frequency; // Math Equation 51
      score += sigmoid(features.clicks.click_latency_avg / 150, 2, 0.5) * weights.click_latency_avg; // Higher latency -> higher load. Math Equation 52
      score += sigmoid(features.clicks.target_acquisition_error_avg / 30, 2, 0.5) * weights.target_acquisition_error_avg; // Larger error -> higher load. Math Equation 53
      score += sigmoid(features.clicks.double_click_frequency / 0.5, 2, 0.5) * weights.double_click_frequency; // Higher freq -> more hurried/stressed. Math Equation 54
      score += sigmoid(features.clicks.click_burst_rate / 1, 2, 0.5) * weights.click_burst_rate; // Math Equation 55
      score += (1 - sigmoid(features.clicks.click_precision_avg / 0.8, 2, 0.5)) * weights.click_precision_avg; // Lower precision -> higher load. Math Equation 56
    }

    // Contribution from Scroll Features
    if (features.scroll) {
      score += sigmoid(features.scroll.scroll_velocity_avg / 500, 2, 0.5) * weights.scroll_velocity_avg; // Math Equation 57
      score += logScale(features.scroll.scroll_direction_changes / 2, 1) * weights.scroll_direction_changes; // Math Equation 58
      score += logScale(features.scroll.scroll_pause_frequency / 1, 1) * weights.scroll_pause_frequency; // Math Equation 59
      score += (1 - sigmoid(features.scroll.scroll_page_coverage_avg / 0.5, 2, 0.5)) * weights.scroll_page_coverage_avg; // Low coverage could be confusion. Math Equation 60
      score += sigmoid(features.scroll.scroll_intensity_score / 1000, 2, 0.5) * weights.scroll_intensity_score; // Math Equation 61
      score += sigmoid(features.scroll.scroll_backtracking_ratio / 0.2, 2, 0.5) * weights.scroll_backtracking_ratio; // High backtracking -> confusion. Math Equation 62
      score += sigmoid(features.scroll.scroll_jerkiness_avg / 0.1, 2, 0.5) * weights.scroll_jerkiness_avg; // Math Equation 63
    }

    // Contribution from Keyboard Features
    if (features.keyboard) {
      const optimalWPM = 60; // Assume ideal typing speed for general users
      const wpmDeviation = Math.abs(features.keyboard.typing_speed_wpm - optimalWPM) / optimalWPM; // Math Equation 64
      score += sigmoid(wpmDeviation * 2, 2, 0.5) * weights.typing_speed_wpm; // Math Equation 65
      score += logScale(features.keyboard.backspace_frequency / 1, 1) * weights.backspace_frequency; // Math Equation 66
      score += sigmoid(features.keyboard.keystroke_latency_avg / 80, 2, 0.5) * weights.keystroke_latency_avg; // Math Equation 67
      score += sigmoid(features.keyboard.error_correction_rate * 3, 2, 0.5) * weights.error_correction_rate; // Math Equation 68
      score += (1 - sigmoid(features.keyboard.typing_burst_speed / 70, 2, 0.5)) * weights.typing_burst_speed; // Slow burst typing implies load. Math Equation 69
      score += (1 - sigmoid(features.keyboard.keystroke_entropy / 4, 2, 0.5)) * weights.keystroke_entropy; // Low entropy could be repetitive errors. Math Equation 70
      score += sigmoid(features.keyboard.modifier_key_frequency / 1, 2, 0.5) * weights.modifier_key_frequency; // High modifier freq can imply complex operations. Math Equation 71
    }

    // Contribution from Error Features (strong indicators of load)
    if (features.errors) {
      score += logScale(features.errors.form_validation_errors_count * 0.8, 1) * weights.form_validation_errors_count; // Math Equation 72
      score += logScale(features.errors.repeated_action_attempts_count * 0.8, 1) * weights.repeated_action_attempts_count; // Math Equation 73
      score += logScale(features.errors.navigation_errors_count * 0.8, 1) * weights.navigation_errors_count; // Math Equation 74
      score += logScale(features.errors.api_errors_count * 0.8, 1) * weights.api_errors_count; // Math Equation 75
      score += logScale(features.errors.task_reversal_count * 0.8, 1) * weights.task_reversal_count; // Math Equation 76
      score += sigmoid(features.errors.cognitive_friction_score * 2, 2, 0.5) * weights.cognitive_friction_score; // Math Equation 77
    }

    // Contribution from Task Context
    if (features.task_context) {
      score += features.task_context.current_task_complexity * weights.current_task_complexity; // Linear contribution. Math Equation 78
      score += sigmoid(features.task_context.time_in_current_task_sec / 300, 2, 0.5) * weights.time_in_current_task_sec; // Longer time -> higher load. Math Equation 79
      score += (1 - sigmoid(features.task_context.task_progress_ratio / 0.5, 2, 0.5)) * weights.task_progress_ratio; // Stalled progress implies load. Math Equation 80
      score += logScale(features.task_context.subtask_switches / 1, 1) * weights.subtask_switches; // Frequent switches implies load. Math Equation 81
      score += features.task_context.task_urgency_score * weights.task_urgency_score; // Urgency adds to perceived load. Math Equation 82
      score += (1 - sigmoid(features.task_context.task_idle_time_ratio * 3, 2, 0.5)) * weights.task_idle_time_ratio; // More idle time implies lower load. Math Equation 83
    }

    // Contribution from Gaze Features
    if (features.gaze) {
        score += sigmoid(features.gaze.fixation_frequency / 5, 2, 0.5) * weights.fixation_frequency; // Math Equation 84
        score += sigmoid(features.gaze.saccade_amplitude_avg / 50, 2, 0.5) * weights.saccade_amplitude_avg; // Math Equation 85
        score += sigmoid(features.gaze.gaze_deviation_from_focus / 50, 2, 0.5) * weights.gaze_deviation_from_focus; // Math Equation 86
        score += sigmoid(features.gaze.scan_path_tortuosity / 2, 2, 0.5) * weights.scan_path_tortuosity; // Math Equation 87
        score += sigmoid(features.gaze.pupil_dilation_avg / 3, 2, 0.5) * weights.pupil_dilation_avg; // Math Equation 88
        score += sigmoid(features.gaze.blink_rate / 0.5, 2, 0.5) * weights.blink_rate; // High blink rate could indicate fatigue/load. Math Equation 89
    }

    score += sigmoid(features.event_density / 40, 2, 0.5) * weights.event_density; // Very high or very low event density. Math Equation 90
    score += sigmoid(features.interaction_rate / 20, 2, 0.5) * weights.interaction_rate; // Math Equation 91

    // Interaction Term: High errors + High task complexity -> amplified load
    if (features.errors && features.task_context) {
        const errorSeverity = (features.errors.form_validation_errors_count + features.errors.repeated_action_attempts_count) > 0 ? 1 : 0;
        score += (errorSeverity * features.task_context.current_task_complexity * 0.1); // Math Equation 92
    }

    // Ensure score is within [0, 1]
    return Math.min(1.0, Math.max(0.0, score)); // Math Equation 93
  }

  private inferLoad = (): void => {
    if (!this.latestFeatureVector) {
      // If no new features, decay towards baseline or maintain last load
      const lastLoad = this.loadHistory.length > 0 ? this.loadHistory[this.loadHistory.length - 1] : this.userProfileService.getPreferences().personalizedBaselineCLS;
      const decayRate = 0.05 * (1 - this.userProfileService.getPreferences().cognitiveResilience); // Slower decay for resilient users. Math Equation 94
      const decayedLoad = lastLoad * (1 - decayRate) + this.userProfileService.getPreferences().personalizedBaselineCLS * decayRate; // Math Equation 95
      this.loadHistory.push(decayedLoad);
      if (this.loadHistory.length > this.historyLength) {
        this.loadHistory.shift();
      }
      this.onCognitiveLoadUpdate(decayedLoad);
      this.userProfileService.addLoadToHistory(decayedLoad);
      this.predictiveAnalyticsService.updateLoadHistory(decayedLoad);
      return;
    }

    const rawLoad = this.mockPredict(this.latestFeatureVector);

    // Apply Exponential Moving Average for smoothing
    if (this.loadHistory.length === 0) {
      this.loadHistory.push(rawLoad);
    } else {
      const alpha = 2 / (this.historyLength + 1); // Smoothing factor. Math Equation 96
      const smoothed = this.loadHistory[this.loadHistory.length - 1] * (1 - alpha) + rawLoad * alpha; // Math Equation 97
      this.loadHistory.push(smoothed);
    }

    if (this.loadHistory.length > this.historyLength) {
      this.loadHistory.shift();
    }
    const currentSmoothedLoad = this.loadHistory[this.loadHistory.length - 1];

    this.onCognitiveLoadUpdate(currentSmoothedLoad);
    this.userProfileService.addLoadToHistory(currentSmoothedLoad); // Store load in user profile
    this.predictiveAnalyticsService.updateLoadHistory(currentSmoothedLoad); // Update predictive service
    this.latestFeatureVector = null; // Clear features processed
  };

  public updateModelWeights(newWeights: Partial<{ [key: string]: number }>): void {
    // In a real system, this would involve retraining or updating ML model parameters
    this._weights = { ...this._weights, ...newWeights };
    // Math Equation 98: Weight Update Rule (e.g., Stochastic Gradient Descent)
    // W_{new} = W_{old} - \eta \nabla L(W)
    // Here, we enable external components (like AdaptiveLearningEngine) to influence the model.
  }

  public stop(): void {
    if (this.predictionTimer) {
      clearInterval(this.predictionTimer);
    }
  }
}

// --- Adaptation Policy Manager ---
/**
 * @overview
 * The `AdaptationPolicyManager` is the master artisan, crafting the tangible reality of the user's interface
 * in response to the invisible currents of their mind. It disproves the tyranny of static design,
 * asserting that form must always serve function, and that function is inherently dynamic, responsive, and humane.
 *
 * @mermaid
 * graph TD
 *    A[getCurrentUiMode] --> B{getPolicyForMode(mode, elementType)}
 *    B --> C{UserProfileService.getPreferences()}
 *    C --> D{Default Policies}
 *    D --> E[isVisible, className]
 *    E --> F[getUiElementState()]
 */
/**
 * Claim 8: The AdaptationPolicyManager dynamically translates inferred cognitive load into concrete UI adjustments, respecting user preferences and predefined adaptation strategies.
 */
export class AdaptationPolicyManager {
  private static instance: AdaptationPolicyManager;
  private userProfileService = UserProfileService.getInstance();
  private readonly defaultAdaptationPolicies: { [mode: string]: { [elementType: string]: 'obscure' | 'deemphasize' | 'reposition' | 'summarize' | 'none' | 'highlight' | 'expand' | 'contract' } } = {
    'standard': {
        [UiElementType.PRIMARY]: 'none', [UiElementType.SECONDARY]: 'none', [UiElementType.TERTIARY]: 'none',
        [UiElementType.GUIDED]: 'none', [UiElementType.CRITICAL]: 'none', [UiElementType.INFORMATIONAL]: 'none',
        [UiElementType.ACTIONABLE]: 'none', [UiElementType.VISUAL]: 'none', [UiElementType.UTILITY]: 'none',
        [UiElementType.FEEDBACK]: 'none',
    },
    'focus': {
        [UiElementType.PRIMARY]: 'none',
        [UiElementType.SECONDARY]: 'deemphasize',
        [UiElementType.TERTIARY]: 'obscure',
        [UiElementType.GUIDED]: 'none', // Guided elements should still be visible
        [UiElementType.CRITICAL]: 'highlight', // Highlight critical elements
        [UiElementType.INFORMATIONAL]: 'deemphasize',
        [UiElementType.ACTIONABLE]: 'none',
        [UiElementType.VISUAL]: 'obscure',
        [UiElementType.UTILITY]: 'deemphasize',
        [UiElementType.FEEDBACK]: 'highlight',
    },
    'minimal': {
        [UiElementType.PRIMARY]: 'none',
        [UiElementType.SECONDARY]: 'obscure',
        [UiElementType.TERTIARY]: 'obscure',
        [UiElementType.GUIDED]: 'obscure', // Even guided elements might be hidden to reduce all load
        [UiElementType.CRITICAL]: 'highlight',
        [UiElementType.INFORMATIONAL]: 'obscure',
        [UiElementType.ACTIONABLE]: 'none',
        [UiElementType.VISUAL]: 'obscure',
        [UiElementType.UTILITY]: 'obscure',
        [UiElementType.FEEDBACK]: 'highlight',
    },
    'guided': { // Emphasize guided elements, deemphasize others
        [UiElementType.PRIMARY]: 'none',
        [UiElementType.SECONDARY]: 'deemphasize',
        [UiElementType.TERTIARY]: 'obscure',
        [UiElementType.GUIDED]: 'highlight',
        [UiElementType.CRITICAL]: 'highlight',
        [UiElementType.INFORMATIONAL]: 'summarize',
        [UiElementType.ACTIONABLE]: 'none',
        [UiElementType.VISUAL]: 'deemphasize',
        [UiElementType.UTILITY]: 'deemphasize',
        [UiElementType.FEEDBACK]: 'highlight',
    },
    'adaptive': { // A blend, adapting based on criticality, aiming for balance
        [UiElementType.PRIMARY]: 'none',
        [UiElementType.SECONDARY]: 'deemphasize',
        [UiElementType.TERTIARY]: 'summarize',
        [UiElementType.GUIDED]: 'none',
        [UiElementType.CRITICAL]: 'highlight',
        [UiElementType.INFORMATIONAL]: 'deemphasize',
        [UiElementType.ACTIONABLE]: 'none',
        [UiElementType.VISUAL]: 'deemphasize',
        [UiElementType.UTILITY]: 'deemphasize',
        [UiElementType.FEEDBACK]: 'highlight',
    },
    'hyperfocus': { // Extreme focus, similar to minimal but with strong highlighting for primary/critical actions
        [UiElementType.PRIMARY]: 'highlight',
        [UiElementType.SECONDARY]: 'obscure',
        [UiElementType.TERTIARY]: 'obscure',
        [UiElementType.GUIDED]: 'obscure',
        [UiElementType.CRITICAL]: 'highlight',
        [UiElementType.INFORMATIONAL]: 'obscure',
        [UiElementType.ACTIONABLE]: 'highlight',
        [UiElementType.VISUAL]: 'obscure',
        [UiElementType.UTILITY]: 'obscure',
        [UiElementType.FEEDBACK]: 'highlight',
    },
    'low-distraction': { // Softened focus, deemphasize without fully obscuring, subtle hints
        [UiElementType.PRIMARY]: 'none',
        [UiElementType.SECONDARY]: 'deemphasize',
        [UiElementType.TERTIARY]: 'deemphasize',
        [UiElementType.GUIDED]: 'none',
        [UiElementType.CRITICAL]: 'none',
        [UiElementType.INFORMATIONAL]: 'none',
        [UiElementType.ACTIONABLE]: 'none',
        [UiElementType.VISUAL]: 'deemphasize',
        [UiElementType.UTILITY]: 'deemphasize',
        [UiElementType.FEEDBACK]: 'none',
    },
  };

  private constructor() {}

  public static getInstance(): AdaptationPolicyManager {
    if (!AdaptationPolicyManager.instance) {
      AdaptationPolicyManager.instance = new AdaptationPolicyManager();
    }
    return AdaptationPolicyManager.instance;
  }

  // Define default or A/B testable policies.
  // In a real system, these would be fetched from a configuration service or derived from ML models.
  private getPolicyForMode(mode: UiMode, elementType: UiElementType) {
    // User-defined policies take precedence
    const userPolicy = this.userProfileService.getPreferences().adaptationPolicySelection[mode]?.[elementType];
    if (userPolicy) return userPolicy;

    // Default policies
    return this.defaultAdaptationPolicies[mode]?.[elementType] || 'none';
  }

  public getUiElementState(mode: UiMode, elementType: UiElementType): { isVisible: boolean; className: string; styleHint?: { [key: string]: string } } {
    const policy = this.getPolicyForMode(mode, elementType);
    let isVisible = true;
    let className = `${elementType.toLowerCase()}-element`;
    let styleHint: { [key: string]: string } = {};

    switch (policy) {
      case 'obscure':
        isVisible = false; // Completely hide
        styleHint = { display: 'none' }; // Math Equation 99: Display: none
        break;
      case 'deemphasize':
        className += ` mode-${mode}-deemphasize`;
        styleHint = { opacity: '0.4', filter: 'blur(2px)' }; // Math Equation 100: Opacity and Blur
        break;
      case 'reposition':
        className += ` mode-${mode}-reposition`; // Placeholder for repositioning logic
        styleHint = { order: '9999', margin: 'auto' }; // Math Equation 101: CSS Order and Margin
        break;
      case 'summarize':
        className += ` mode-${mode}-summarize`; // Placeholder for summarization logic
        styleHint = { fontSize: '0.8em', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }; // Math Equation 102: Summarization styling
        break;
      case 'highlight':
          className += ` mode-${mode}-highlight`;
          styleHint = { border: '2px solid var(--highlight-color, yellow)', boxShadow: '0 0 8px var(--highlight-color, yellow)' }; // Math Equation 103: Highlight styling
          break;
      case 'expand':
          className += ` mode-${mode}-expand`;
          styleHint = { transform: 'scale(1.05)', zIndex: '100' }; // Math Equation 104: Scale transformation
          break;
      case 'contract':
          className += ` mode-${mode}-contract`;
          styleHint = { transform: 'scale(0.95)', opacity: '0.8' }; // Math Equation 105: Scale transformation and opacity
          break;
      case 'none':
      default:
        // Default visibility and class name
        break;
    }

    return { isVisible, className, styleHint };
  }
}

// --- Cognitive Load Balancer Service ---
/**
 * @overview
 * The `CognitiveLoadBalancerService` is the enlightened conductor, the central nervous system of this adaptive reality.
 * It orchestrates a symphony of data, insight, and action, guiding the user experience towards a state of perpetual flow and minimal friction.
 * It is the embodiment of impeccable logic, existing not for vanity, but to free the oppressed mind from the tyranny of overload.
 * Like a self-healing organism, it diagnoses its own condition and adjusts, forever striving for homeostasis.
 * This is the ultimate aspiration: to render the interface invisible, leaving only the unhindered dance of thought.
 *
 * @mermaid
 * graph TD
 *    A[start()] --> B(TelemetryAgent.initListeners())
 *    A --> C(CognitiveLoadEngine Prediction Timer)
 *    A --> D[Mode Transition Interval]
 *    A --> E[Adaptation Evaluation Interval]
 *
 *    D -- Trigger --> F(checkUiModeTransition())
 *    F --> G{_cognitiveLoad vs _predictedLoad vs _loadThresholds}
 *    G --> H{_currentTask Complexity}
 *    G & H --> I[Determine nextMode (with Hysteresis)]
 *    I --> J{Sustained Load/Condition?}
 *    J -- Yes --> K[setUiMode(nextMode)]
 *    K --> L[Notify Mode Subscribers & AdaptiveLearningEngine]
 *
 *    E -- Trigger --> M(AdaptiveLearningEngine.evaluateAdaptationEffectiveness())
 *    M --> N[Reinforce/Penalize Models (UserProfile, Thresholds)]
 *
 *    subgraph Telemetry Flow
 *        TelemetryAgent -- features --> CognitiveLoadEngine -- load --> CognitiveLoadBalancerService
 *    end
 */
/**
 * Claim 9: The CognitiveLoadBalancerService orchestrates a real-time, closed-loop feedback system, adapting the UI to maintain an optimal cognitive state for the user.
 * Claim 10: By leveraging predictive analytics and adaptive thresholds, the system can proactively mitigate potential overload, enhancing user experience and productivity.
 */
export class CognitiveLoadBalancerService {
  private static instance: CognitiveLoadBalancerService;

  private userProfileService: UserProfileService;
  private taskContextManager: TaskContextManager;
  private interactionErrorLogger: InteractionErrorLogger;
  private adaptationPolicyManager: AdaptationPolicyManager;
  private telemetryAgent: TelemetryAgent;
  private cognitiveLoadEngine: CognitiveLoadEngine;
  private predictiveAnalyticsService: PredictiveAnalyticsService;
  private adaptiveThresholdManager: AdaptiveThresholdManager;
  private uiElementTracker: UiElementTracker;
  private adaptiveLearningEngine: AdaptiveLearningEngine; // The "medical condition" doctor

  private _cognitiveLoad: number = 0.0;
  private _predictedLoad: number = 0.0;
  private _uiMode: UiMode = 'standard';
  private _currentTask: TaskContext | null = null;
  private _loadThresholds: UserPreferences['cognitiveLoadThresholds']; // Dynamically adjusted

  private _sustainedLoadCounter: number = 0;
  private readonly _checkIntervalMs: number = 500; // How often to check for mode transitions
  private readonly _sustainedLoadDurationMs: number = 1500; // How long conditions must persist for a transition
  private _modeTransitionInterval: ReturnType<typeof setInterval> | null = null;

  private readonly _evaluationIntervalMs: number = 2000; // How often to check adaptation effectiveness
  private _evaluationInterval: ReturnType<typeof setInterval> | null = null;

  private _loadSubscribers: Set<(load: number) => void> = new Set();
  private _predictedLoadSubscribers: Set<(load: number) => void> = new Set();
  private _modeSubscribers: Set<(mode: UiMode) => void> = new Set();
  private _taskSubscribers: Set<(task: TaskContext | null) => void> = new Set();
  private _thresholdSubscribers: Set<(thresholds: UserPreferences['cognitiveLoadThresholds']) => void> = new Set();

  private constructor() {
    this.userProfileService = UserProfileService.getInstance();
    this.taskContextManager = TaskContextManager.getInstance();
    this.interactionErrorLogger = InteractionErrorLogger.getInstance();
    this.adaptationPolicyManager = AdaptationPolicyManager.getInstance();
    this.predictiveAnalyticsService = PredictiveAnalyticsService.getInstance();
    this.adaptiveThresholdManager = AdaptiveThresholdManager.getInstance();
    this.uiElementTracker = UiElementTracker.getInstance();

    this._loadThresholds = this.userProfileService.getPreferences().cognitiveLoadThresholds; // Initial thresholds

    // Initialize core components
    this.telemetryAgent = new TelemetryAgent(this._handleFeatureVector);
    this.cognitiveLoadEngine = new CognitiveLoadEngine(this._handleCognitiveLoad);
    this.adaptiveLearningEngine = AdaptiveLearningEngine.getInstance(); // Get instance first
    this.adaptiveLearningEngine.initialize(this.cognitiveLoadEngine, this.adaptiveThresholdManager); // Then initialize with dependencies

    // Subscribe to internal events
    this.taskContextManager.subscribe(this._handleTaskContext);
    this.interactionErrorLogger.subscribe(this.adaptiveLearningEngine.onInteractionErrorsUpdated); // Pass error updates to ALE
    // Initial thresholds based on current context
    this._loadThresholds = this.adaptiveThresholdManager.adjustThresholds(this._cognitiveLoad);
  }

  public static getInstance(): CognitiveLoadBalancerService {
    if (!CognitiveLoadBalancerService.instance) {
      CognitiveLoadBalancerService.instance = new CognitiveLoadBalancerService();
    }
    return CognitiveLoadBalancerService.instance;
  }

  private _handleFeatureVector = (features: TelemetryFeatureVector): void => {
    this.cognitiveLoadEngine.processFeatures(features);
    // Also predict future load based on new features for proactive adaptation
    this._predictedLoad = this.predictiveAnalyticsService.predictNextLoad(features);
    this._predictedLoadSubscribers.forEach(callback => callback(this._predictedLoad));
    // Math Equation 106: Predicted load is a function of current features and history.
    // L_p = f(F_t, H_t)
  };

  private _handleCognitiveLoad = (load: number): void => {
    if (load !== this._cognitiveLoad) {
      this._cognitiveLoad = load;
      this._loadSubscribers.forEach(callback => callback(this._cognitiveLoad));
      // Dynamically adjust thresholds based on current load and other factors
      const newThresholds = this.adaptiveThresholdManager.adjustThresholds(this._cognitiveLoad);
      if (JSON.stringify(newThresholds) !== JSON.stringify(this._loadThresholds)) {
          this._loadThresholds = newThresholds;
          this._thresholdSubscribers.forEach(callback => callback(this._loadThresholds));
      }
      this.adaptiveLearningEngine.onCognitiveLoadUpdated(this._cognitiveLoad); // Notify ALE
    }
  };

  private _handleTaskContext = (task: TaskContext | null): void => {
    if (task !== this._currentTask) {
      this._currentTask = task;
      this._taskSubscribers.forEach(callback => callback(this._currentTask));
      // Re-evaluate thresholds when task context changes, as complexity changes optimal load
      this._loadThresholds = this.adaptiveThresholdManager.adjustThresholds(this._cognitiveLoad);
      this._thresholdSubscribers.forEach(callback => callback(this._loadThresholds));
    }
  };

  private _setUiMode = (newMode: UiMode): void => {
    if (newMode !== this._uiMode) {
      const oldMode = this._uiMode;
      this._uiMode = newMode;
      this._modeSubscribers.forEach(callback => callback(this._uiMode));
      this.adaptiveLearningEngine.onUiModeChanged(newMode, oldMode, this._cognitiveLoad); // Notify ALE for evaluation
      // console.log(`UI Mode changed to: ${this._uiMode}`);
    }
  };

  /**
   * Math Equation 107: Mode Transition Logic
   * nextMode = f(CurrentLoad, PredictedLoad, Thresholds, TaskComplexity, UserPreferences, Hysteresis, AdaptationEffectiveness)
   * This function embodies the system's wisdom in choosing the optimal mode, like a seasoned pilot navigating turbulent skies.
   */
  private _checkUiModeTransition = (): void => {
    const currentMode = this._uiMode;
    const cognitiveLoad = this._cognitiveLoad;
    const predictedLoad = this._predictedLoad; // Consider predicted load for proactive changes
    const thresholds = this._loadThresholds;
    const taskComplexity = this._currentTask?.complexity === 'critical' || this._currentTask?.complexity === 'high'; // Simplified check
    const userPreferredStyle = this.userProfileService.getPreferences().preferredAdaptationStyle;
    const userResilience = this.userProfileService.getPreferences().cognitiveResilience;

    let nextMode: UiMode = currentMode;
    let transitionReason: string = 'stable'; // For debugging/logging

    // Decision hierarchy:
    // 1. Critical overload (immediate action)
    // 2. Guided mode for complex tasks
    // 3. Proactive adaptation (using prediction)
    // 4. Reactive adaptation (using current load)

    // Critical Overload Management: Overrides all other considerations
    if (cognitiveLoad > thresholds.critical || predictedLoad > thresholds.critical + (0.05 * (1 - userResilience))) { // Proactive critical with resilience factor
      if (currentMode !== 'minimal' && currentMode !== 'hyperfocus') {
        nextMode = 'minimal'; // Go to most restrictive mode
        transitionReason = 'critical_overload_imminent';
      }
    } else if (cognitiveLoad < thresholds.criticalLow && (currentMode === 'minimal' || currentMode === 'hyperfocus')) {
      nextMode = 'focus'; // Recover to a more balanced focused state
      transitionReason = 'critical_recovery';
    }
    // Guided Mode for High Complexity Tasks (if not already in critical state)
    else if (cognitiveLoad > thresholds.guided && taskComplexity && currentMode !== 'guided') {
      nextMode = 'guided';
      transitionReason = 'task_guided_needed';
    } else if (cognitiveLoad < thresholds.guidedLow && currentMode === 'guided' && !taskComplexity) {
      nextMode = 'focus'; // Exit guided mode if no longer needed or load is low
      transitionReason = 'guided_not_needed';
    }
    // Proactive Adaptation based on Predicted Load (User preference sensitive)
    else if (userPreferredStyle === 'proactive') {
        if (predictedLoad > thresholds.adaptiveHigh && currentMode === 'standard') {
            nextMode = 'focus';
            transitionReason = 'proactive_high_load';
        } else if (predictedLoad < thresholds.adaptiveLow && (currentMode === 'focus' || currentMode === 'low-distraction')) {
            nextMode = 'standard';
            transitionReason = 'proactive_low_load';
        }
    }
    // Reactive Adaptation based on Current Load (Default)
    if (nextMode === currentMode) { // Only if no higher priority transition occurred
        if (cognitiveLoad > thresholds.high && currentMode === 'standard') {
          nextMode = 'focus';
          transitionReason = 'reactive_high_load';
        } else if (cognitiveLoad < thresholds.low && (currentMode === 'focus' || currentMode === 'low-distraction')) {
          nextMode = 'standard';
          transitionReason = 'reactive_low_load';
        } else if (cognitiveLoad > thresholds.adaptiveHigh && currentMode === 'focus') {
            nextMode = 'hyperfocus';
            transitionReason = 'reactive_escalate_focus';
        } else if (cognitiveLoad < thresholds.adaptiveLow && currentMode === 'hyperfocus') {
            nextMode = 'focus';
            transitionReason = 'reactive_deescalate_hyperfocus';
        }
    }

    // Apply hysteresis to prevent rapid flickering between modes, giving the system 'inertia'.
    const { up: targetUpThreshold, down: targetDownThreshold } = this.adaptiveThresholdManager.applyHysteresis(
        // The base threshold for hysteresis should be the threshold relevant to *entering* the next mode from the current one.
        // This is complex, so let's use a simplified approach based on the `nextMode`'s typical "entry" threshold.
        nextMode === 'minimal' ? thresholds.critical :
        nextMode === 'hyperfocus' ? thresholds.adaptiveHigh :
        nextMode === 'guided' ? thresholds.guided :
        nextMode === 'focus' ? thresholds.high :
        thresholds.low, // For returning to standard or low-distraction
        currentMode,
        nextMode
    );

    let shouldTransition = false;
    if (nextMode !== currentMode) {
        // Evaluate if conditions for the new mode are *sustained* past the hysteresis thresholds
        if (this.adaptiveThresholdManager.isModeHigherLoad(nextMode, currentMode)) { // Moving to a mode typically associated with higher load reduction (e.g., standard -> focus)
            if (cognitiveLoad > targetUpThreshold) {
                this._sustainedLoadCounter += this._checkIntervalMs;
                if (this._sustainedLoadCounter >= this._sustainedLoadDurationMs) {
                    shouldTransition = true;
                }
            } else {
                this._sustainedLoadCounter = 0; // Load dropped below threshold, reset counter
            }
        } else { // Moving to a mode typically associated with lower load (e.g., focus -> standard)
            if (cognitiveLoad < targetDownThreshold) {
                this._sustainedLoadCounter += this._checkIntervalMs;
                if (this._sustainedLoadCounter >= this._sustainedLoadDurationMs) {
                    shouldTransition = true;
                }
            } else {
                this._sustainedLoadCounter = 0; // Load rose above threshold, reset counter
            }
        }
    } else {
        this._sustainedLoadCounter = 0; // Reset if conditions for transition are no longer met (mode remains unchanged)
    }

    if (shouldTransition) {
        this._setUiMode(nextMode);
        this._sustainedLoadCounter = 0; // Reset after transition
    }
  };

  public start(): void {
    // console.log('CognitiveLoadBalancerService starting...');
    this.telemetryAgent.initListeners();
    if (typeof setInterval !== 'undefined') {
      this._modeTransitionInterval = setInterval(this._checkUiModeTransition, this._checkIntervalMs);
      this._evaluationInterval = setInterval(() => this.adaptiveLearningEngine.evaluateAdaptationEffectiveness(), this._evaluationIntervalMs);
    }
    // Initial notifications for subscribers
    this._loadSubscribers.forEach(callback => callback(this._cognitiveLoad));
    this._predictedLoadSubscribers.forEach(callback => callback(this._predictedLoad));
    this._modeSubscribers.forEach(callback => callback(this._uiMode));
    this._taskSubscribers.forEach(callback => callback(this._currentTask));
    this._thresholdSubscribers.forEach(callback => callback(this._loadThresholds));
  }

  public stop(): void {
    // console.log('CognitiveLoadBalancerService stopping...');
    this.telemetryAgent.stop();
    this.cognitiveLoadEngine.stop();
    this.interactionErrorLogger.stop();
    if (this._modeTransitionInterval) {
      clearInterval(this._modeTransitionInterval);
    }
    if (this._evaluationInterval) {
        clearInterval(this._evaluationInterval);
    }
    this._loadSubscribers.clear();
    this._predictedLoadSubscribers.clear();
    this._modeSubscribers.clear();
    this._taskSubscribers.clear();
    this._thresholdSubscribers.clear();
  }

  public getCognitiveLoad(): number {
    return this._cognitiveLoad;
  }

  public getPredictedCognitiveLoad(): number {
      return this._predictedLoad;
  }

  public getUiMode(): UiMode {
    return this._uiMode;
  }

  public getCurrentTask(): TaskContext | null {
    return this._currentTask;
  }

  public getCognitiveLoadThresholds(): UserPreferences['cognitiveLoadThresholds'] {
      return { ...this._loadThresholds };
  }

  public subscribeToLoad(callback: (load: number) => void): () => void {
    this._loadSubscribers.add(callback);
    callback(this._cognitiveLoad); // Immediate notification
    return () => this._loadSubscribers.delete(callback);
  }

  public subscribeToPredictedLoad(callback: (load: number) => void): () => void {
    this._predictedLoadSubscribers.add(callback);
    callback(this._predictedLoad); // Immediate notification
    return () => this._predictedLoadSubscribers.delete(callback);
  }

  public subscribeToUiMode(callback: (mode: UiMode) => void): () => void {
    this._modeSubscribers.add(callback);
    callback(this._uiMode); // Immediate notification
    return () => this._modeSubscribers.delete(callback);
  }

  public subscribeToTaskContext(callback: (task: TaskContext | null) => void): () => void {
    this._taskSubscribers.add(callback);
    callback(this._currentTask); // Immediate notification
    return () => this._taskSubscribers.delete(callback);
  }

  public subscribeToThresholds(callback: (thresholds: UserPreferences['cognitiveLoadThresholds']) => void): () => void {
      this._thresholdSubscribers.add(callback);
      callback(this._loadThresholds); // Immediate notification
      return () => this._thresholdSubscribers.delete(callback);
  }

  /**
   * Provides UI adaptation state for a given element type based on the current UI mode.
   * Frameworks can use this to apply dynamic styling or conditional rendering.
   * @param uiType The type of the UI element (e.g., PRIMARY, SECONDARY, TERTIARY).
   * @returns An object indicating visibility and appropriate CSS class name.
   */
  public getUiElementAdaptationState(uiType: UiElementType): { isVisible: boolean; className: string; styleHint?: { [key: string]: string } } {
    return this.adaptationPolicyManager.getUiElementState(this._uiMode, uiType);
  }

  // Expose Managers/Services for external interaction
  public getTaskContextManager(): TaskContextManager {
    return this.taskContextManager;
  }

  public getInteractionErrorLogger(): InteractionErrorLogger {
    return this.interactionErrorLogger;
  }

  public getUserProfileService(): UserProfileService {
    return this.userProfileService;
  }

  public getUiElementTracker(): UiElementTracker {
      return this.uiElementTracker;
  }

  public getPredictiveAnalyticsService(): PredictiveAnalyticsService {
      return this.predictiveAnalyticsService;
  }

  public getAdaptiveThresholdManager(): AdaptiveThresholdManager {
      return this.adaptiveThresholdManager;
  }

  public getAdaptiveLearningEngine(): AdaptiveLearningEngine {
      return this.adaptiveLearningEngine;
  }
}