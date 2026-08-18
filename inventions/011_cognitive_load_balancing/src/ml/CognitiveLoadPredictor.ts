// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/inventions/011_cognitive_load_balancing/src/ml/CognitiveLoadPredictor.ts
================================================================================

export enum UiElementType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  GUIDED = 'guided',
  CRITICAL = 'critical', // Added for deeper adaptation strategies
  INFORMATION = 'information', // Added for more granular UI elements
}

export type UiMode = 'standard' | 'focus' | 'minimal' | 'guided' | 'crisis' | 'adaptive-learning'; // Added 'crisis' and 'adaptive-learning' for deeper states

export interface MouseEventData {
  x: number;
  y: number;
  button: number;
  targetId: string;
  timestamp: number;
  targetBoundingRect?: DOMRectReadOnly;
  pressure?: number; // Added for more granular input
  tiltX?: number; // Added for stylus/advanced mouse input
  tiltY?: number; // Added for stylus/advanced mouse input
}

export interface ScrollEventData {
  scrollX: number;
  scrollY: number;
  timestamp: number;
  deltaX: number; // Added to capture scroll intensity
  deltaY: number; // Added to capture scroll intensity
}

export interface KeyboardEventData {
  key: string;
  code: string;
  timestamp: number;
  isModifier: boolean;
  repeat: boolean; // Added to detect holding a key
  location: number; // Added for left/right key distinction
}

export interface FocusBlurEventData {
  type: 'focus' | 'blur';
  targetId: string;
  timestamp: number;
  durationMs?: number; // Added for focus duration
  relatedTargetId?: string; // Added for focus transition analysis
}

export interface FormEventData {
  type: 'submit' | 'input' | 'change' | 'reset'; // Added 'reset'
  targetId: string;
  value?: string;
  timestamp: number;
  isValid?: boolean;
  validationMessages?: string[]; // Added for detailed error feedback
}

export interface DragDropEventData { // Added new event type for interaction complexity
  type: 'dragstart' | 'drag' | 'dragend' | 'drop';
  targetId: string;
  sourceId?: string;
  x: number;
  y: number;
  timestamp: number;
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
  | { type: 'dragdrop'; data: DragDropEventData }; // New event type

export interface MouseKinematicsFeatures {
  mouse_velocity_avg: number;
  mouse_acceleration_avg: number;
  mouse_path_tortuosity: number;
  mouse_dwell_time_avg: number;
  fitts_law_ip_avg: number;
  mouse_jerk_metric: number;
  mouse_movement_entropy: number;
  mouse_pressure_avg?: number; // Added
  mouse_cursor_instability?: number; // Added, variance in cursor position around a target
  mouse_pauses_per_sec?: number; // Added
}

export interface ClickDynamicsFeatures {
  click_frequency: number;
  click_latency_avg: number;
  target_acquisition_error_avg: number;
  double_click_frequency: number;
  misclick_rate: number;
  click_sequence_variability: number;
  click_duration_avg?: number; // Added for sustained clicks/presses
  target_revisit_frequency?: number; // Added for revisits to previously clicked elements
}

export interface ScrollDynamicsFeatures {
  scroll_velocity_avg: number;
  scroll_direction_changes: number;
  scroll_pause_frequency: number;
  scroll_amplitude_variance: number;
  scroll_event_density_per_area: number;
  scroll_panning_frequency?: number; // Added for horizontal scrolling
  scroll_depth_avg?: number; // Added, how deep into content user scrolls
}

export interface KeyboardDynamicsFeatures {
  typing_speed_wpm: number;
  backspace_frequency: number;
  keystroke_latency_avg: number;
  error_correction_rate: number;
  key_press_duration_avg: number;
  cognitive_typing_lag: number;
  modifier_key_frequency?: number; // Added for power-user vs. novice
  input_field_revisits?: number; // Added, re-editing fields
  auto_correction_usage?: number; // Added for implicit errors
}

export interface InteractionErrorFeatures {
  form_validation_errors_count: number;
  repeated_action_attempts_count: number;
  navigation_errors_count: number;
  ui_feedback_misinterpretations: number;
  undo_redo_frequency: number;
  abandoned_form_rate?: number; // Added for forms
  unexpected_interaction_patterns?: number; // Added, e.g., clicking non-interactive elements
}

export interface TaskContextFeatures {
  current_task_complexity: number; // 0-1
  time_in_current_task_sec: number;
  task_interruption_frequency: number;
  task_cognitive_demand_rating: number; // 0-1
  task_dependency_resolution_time_avg?: number; // Added, how long to resolve dependencies
  task_uncertainty_score?: number; // Added, based on task definition clarity
  task_prioritization_changes_freq?: number; // Added, how often user switches priorities
}

export interface SystemResourceFeatures {
  cpu_usage_avg: number;
  memory_usage_avg: number;
  network_latency_avg: number;
  gpu_usage_avg: number;
  disk_io_avg?: number; // Added for completeness
  system_responsiveness_score?: number; // Added, overall perceived lag
}

export interface TemporalInteractionFeatures { // New category for time-series insights
  interaction_burstiness: number; // Variance in event frequency
  periodicity_score: number; // How rhythmic user input is
  session_duration_sec: number;
  idle_time_percentage: number;
  recent_activity_decay: number; // Weighted sum of recent activity
}

export interface CrossModalCoherenceFeatures { // Deeper cross-modal analysis
  cross_modal_lag_avg: number; // Lag between mouse/keyboard for same action
  input_modality_switching_rate: number;
  coherence_entropy: number; // Entropy of interaction patterns across modalities
}

export interface EmotionalAffectFeatures { // Mock emotional state based on interaction patterns
  frustration_score: number; // Derived from error rates, repeated actions, high jerk
  engagement_score: number; // Derived from event density, low idle time, sustained focus
  boredom_score: number; // Derived from low event density, high idle time, low engagement
}

export interface TelemetryFeatureVector {
  timestamp_window_end: number;
  mouse?: MouseKinematicsFeatures;
  clicks?: ClickDynamicsFeatures;
  scroll?: ScrollDynamicsFeatures;
  keyboard?: KeyboardDynamicsFeatures;
  errors?: InteractionErrorFeatures;
  task_context?: TaskContextFeatures;
  system_resources?: SystemResourceFeatures;
  temporal_interaction?: TemporalInteractionFeatures; // New component
  cross_modal_coherence?: CrossModalCoherenceFeatures; // Enhanced cross-modal
  emotional_affect?: EmotionalAffectFeatures; // New component for inferred affect
  event_density: number;
  cross_modal_interaction_entropy?: number; // Retained from original
  cognitive_state_persistence?: number; // Retained from original
}

export enum CognitiveStateCategory { // New enum for discrete cognitive states
  OPTIMAL = 'optimal',           // User is in flow, high efficiency
  ENGAGED = 'engaged',           // Active, focused, but not necessarily optimal
  RISING_LOAD = 'rising_load',   // Early signs of increased cognitive effort
  HIGH_LOAD = 'high_load',       // Significant cognitive burden, potential for errors
  CRITICAL_OVERLOAD = 'critical_overload', // User is struggling, high error probability
  FATIGUED = 'fatigued',         // Prolonged high load, reduced performance
  DISENGAGED = 'disengaged',     // Low activity, lack of focus, boredom or distraction
  CONFUSED = 'confused',         // Erratic patterns, high search behavior, low predictability
}

export type PredictionConfidence = 'low' | 'medium' | 'high' | 'very_high'; // Confidence in the prediction

export interface CognitivePredictionResult { // Expanded prediction output
  score: number; // Normalized cognitive load score (0.0 to 1.0)
  state: CognitiveStateCategory; // Categorized cognitive state
  confidence: PredictionConfidence; // How confident the predictor is
  contributingFeatures: { [featureName: string]: number }; // Top N features contributing to load
  suggestedAdaptationPolicy?: UiMode; // Hint for UI adaptation engine
}


export interface UserPreferences {
  preferredUiMode: UiMode;
  cognitiveLoadThresholds: { // More granular thresholds
    optimalUpper: number; // Upper bound for optimal state
    engagedUpper: number;
    risingUpper: number;
    highUpper: number;
    criticalUpper: number; // Equivalent to original 'critical'
    fatigueOnset: number; // Threshold indicating fatigue onset
    disengagementOnset: number; // Threshold indicating disengagement
  };
  adaptationPolicySelection: {
    [mode: string]: { [elementType: string]: 'obscure' | 'deemphasize' | 'reposition' | 'summarize' | 'expand' | 'highlight' | 'none' | 'guided-step' }; // Added 'expand', 'highlight', 'guided-step'
  };
  personalizedBaselineCLS: number;
  adaptiveLearningRate: number;
  sensitivityToErrors: number;
  preferenceForGuidance: number; // 0-1, how much user prefers guided experiences under stress
  riskAversion: number; // 0-1, how much user wants to avoid errors
  fatigueTolerance: number; // 0-1, how resilient user is to prolonged tasks
}

export type TaskContext = {
  id: string;
  name: string;
  complexity: 'trivial' | 'low' | 'medium' | 'high' | 'critical'; // Added 'trivial'
  timestamp: number;
  estimated_duration_sec: number;
  dependencies_count: number;
  is_critical_path_task: boolean; // Added for task importance
  recent_interruptions: number; // How many recent interruptions for this task
  task_goal_clarity_score: number; // 0-1, how clearly defined the task goal is
};

export enum PredictorHealthStatus { // New enum for the predictor's self-assessment
  OPTIMAL = 'optimal',         // Predictor is highly accurate and stable
  DEGRADED = 'degraded',       // Minor deviations or uncertainties, requires attention
  UNSTABLE = 'unstable',       // Significant fluctuations, potentially inaccurate, needs calibration
  CRITICAL = 'critical',       // Major issues, predictions unreliable, immediate intervention required
  INITIALIZING = 'initializing', // Predictor is gathering data/learning its baseline
}

/**
 * Interface for the Cognitive Load Predictor, enabling different ML models
 * to be swapped out if they adhere to this contract.
 */
export interface ICognitiveLoadPredictor {
  /**
   * Predicts the cognitive load score based on the given feature vector,
   * user preferences, and current task context.
   * @param features - The processed telemetry feature vector.
   * @param userPrefs - User-specific preferences including baseline CLS.
   * @param currentTask - The current task context.
   * @returns A normalized cognitive load score (0.0 to 1.0).
   */
  predict(
    features: TelemetryFeatureVector,
    userPrefs: UserPreferences,
    currentTask: TaskContext | null
  ): CognitivePredictionResult; // Returns extended result

  /**
   * Updates the internal model configuration or performs calibration.
   * @param newConfig - A partial object containing new configuration values.
   */
  updateModelConfig(newConfig: Partial<typeof CognitiveLoadPredictor.prototype.featureConfig>): void;

  /**
   * Returns the current health status of the predictor itself.
   * @returns PredictorHealthStatus
   */
  getHealthStatus(): PredictorHealthStatus;

  /**
   * Initiates a recalibration process for the predictor, typically after significant
   * observed prediction errors or changes in user behavior patterns.
   * @param historicalData - Optional historical feature vectors for retraining.
   */
  calibrate(historicalData?: TelemetryFeatureVector[]): Promise<void>;
}

/**
 * Provides static methods to generate various Mermaid diagram definitions.
 * This helps visualize the model's structure, data flow, and conceptual claims.
 * Each method returns a string formatted as a Mermaid diagram.
 */
export class MermaidDiagrams {
  /**
   * @claim 1: The overall cognitive load prediction flow is a multi-stage process involving data acquisition, feature engineering, and model inference.
   * @mermaid
   * ```mermaid
   * graph TD
   *    A[Raw Telemetry Events] --> B{Feature Preprocessing & Synthesis};
   *    B --> C{Feature Vector Aggregation & Temporal Context};
   *    C --> D[CognitiveLoadPredictor.predict()];
   *    D -- User Preferences & Task Context & Prior State --> E[Cognitive Prediction Result (Score, State, Confidence)];
   *    E --> F{UI Adaptation Engine};
   *    F -- Adaptive UI Changes --> G[User Interface];
   *    G -- User Interaction Changes --> A;
   *    E --> H[CognitiveHomeostasisManager];
   *    H -- Predictor Calibration/Config Update --> D;
   * ```
   */
  public static getPredictorFlowChart(): string {
    return `graph TD
    A[Raw Telemetry Events (Physiological, Interaction, System)] --> B{Feature Preprocessing & Synthesis};
    B -- Transformed $f_k(E)$ --> C{Feature Vector Aggregation & Temporal Context};
    C -- $\\mathbf{F}_v$ --> D[CognitiveLoadPredictor.predict()];
    D -- $U_p, T_c, S_{prev}$ --> E[Cognitive Prediction Result (CLS, State, Confidence)];
    E -- CLS, State, Policy Suggestion --> F{UI Adaptation Engine};
    F -- Adaptive UI Changes $\\Delta UI$ --> G[User Interface];
    G -- Affects User Interaction --> A;
    E -- Observed $CLS_{out}$ --> H[CognitiveHomeostasisManager];
    H -- Predictor Calibration/Config Update $\\Delta C$ --> D;
    H -- User Profile Update --> D;
    style A fill:#f9f,stroke:#333,stroke-width:2px;
    style G fill:#f9f,stroke:#333,stroke-width:2px;
    style H fill:#bbf,stroke:#333,stroke-width:2px;`;
  }

  /**
   * @claim 2: The feature vector is a composite of diverse user interaction and system performance metrics, grouped into logical components, now including temporal, cross-modal, and inferred emotional dimensions.
   * @mermaid
   * ```mermaid
   * graph TD
   *    FV[Telemetry Feature Vector] --> M[Mouse Kinematics];
   *    FV --> C[Click Dynamics];
   *    FV --> K[Keyboard Dynamics];
   *    FV --> S[Scroll Dynamics];
   *    FV --> E[Interaction Errors];
   *    FV --> TC[Task Context];
   *    FV --> SR[System Resources];
   *    FV --> TE[Temporal Interaction];
   *    FV --> CMC[Cross-Modal Coherence];
   *    FV --> EA[Emotional Affect (Inferred)];
   *    FV --> ED[Event Density];
   *    FV --> CSP[Cognitive State Persistence];
   * ```
   */
  public static getFeatureVectorComposition(): string {
    return `graph TD
    FV[Telemetry Feature Vector] --> M[Mouse Kinematics];
    FV --> C[Click Dynamics];
    FV --> K[Keyboard Dynamics];
    FV --> S[Scroll Dynamics];
    FV --> E[Interaction Errors];
    FV --> TC[Task Context];
    FV --> SR[System Resources];
    FV --> TE[Temporal Interaction Features];
    FV --> CMC[Cross-Modal Coherence Features];
    FV --> EA[Emotional Affect (Inferred)];
    FV --> ED[Event Density];
    FV --> CSP[Cognitive State Persistence];
    style FV fill:#afa,stroke:#333,stroke-width:2px;`;
  }

  /**
   * @claim 3: Different feature components contribute to the raw cognitive load accumulator with varying weights, reflecting their relative importance, which can be dynamically adjusted by the Homeostasis Manager.
   * @mermaid
   * ```mermaid
   * pie title Dynamic Component Contribution Weights
   *    "Baseline" : 8
   *    "Mouse Kinematics" : 18
   *    "Click Dynamics" : 22
   *    "Keyboard Dynamics" : 13
   *    "Scroll Dynamics" : 9
   *    "Interaction Errors" : 30
   *    "Task Context" : 14
   *    "System Resources" : 9
   *    "Temporal Interaction" : 6
   *    "Cross-Modal Coherence" : 5
   *    "Emotional Affect" : 10
   *    "Event Density" : 3
   *    "Cognitive Persistence" : 7
   * ```
   */
  public static getLoadComponentWeights(): string {
    return `pie title Dynamic Component Contribution Weights (Example)
    "Baseline" : 8
    "Mouse Kinematics" : 18
    "Click Dynamics" : 22
    "Keyboard Dynamics" : 13
    "Scroll Dynamics" : 9
    "Interaction Errors" : 30
    "Task Context" : 14
    "System Resources" : 9
    "Temporal Interaction" : 6
    "Cross-Modal Coherence" : 5
    "Emotional Affect" : 10
    "Event Density" : 3
    "Cognitive Persistence" : 7`;
  }

  /**
   * @claim 4: Feature normalization is crucial to bring diverse feature scales into a comparable range, preventing features with larger absolute values from dominating the prediction. Advanced transformations include non-linear scaling and contextual inversion.
   * @mermaid
   * ```mermaid
   * graph LR
   *    A[Raw Feature Value $V_f$] --> B{Validate & Contextualize Max $V_{max\_c}$};
   *    B -- Valid --> C[$N_f = \text{NonLinearTransform}(V_f / V_{max\_c})$];
   *    B -- Invalid/Zero $V_{max\_c}$ --> D[Return 0];
   *    C -- Contextual Invert? --> E[$N'_{f} = 1 - N_f$];
   *    E --> F[Clamped $[0,1]$ Score];
   *    C -- No Invert --> F;
   * ```
   */
  public static getNormalizationProcess(): string {
    return `graph LR
    A[Raw Feature Value $V_f$] --> B{Validate & Contextualize Max $V_{max\_c}$};
    B -- Valid --> C[$N_f = \\text{NonLinearTransform}(V_f / V_{max\_c})$];
    B -- Invalid/Zero $V_{max\_c}$ --> D[Return 0];
    C -- Contextual Invert? ($I_{ctx}$) --> E[$N'_{f} = 1 - N_f$];
    E --> F[Clamped $[0,1]$ Score];
    C -- No Invert --> F;`;
  }

  /**
   * @claim 5: The UI adaptation policy is dynamically selected based on the predicted cognitive load *state*, user-defined preferences, and the current UI mode, moving beyond simple score thresholds.
   * @mermaid
   * ```mermaid
   * graph TD
   *    CPR[Cognitive Prediction Result (CLS, State, Confidence)] --> TCS{Threshold & Confidence Check};
   *    TCS -- State: Critical Overload --> PA[Policy A (Obscure, Crisis Mode)];
   *    TCS -- State: High Load --> PB[Policy B (Deemphasize, Guided Steps)];
   *    TCS -- State: Rising Load --> PC[Policy C (Summarize, Highlight)];
   *    TCS -- State: Optimal/Engaged --> PD[Policy D (None / Expand)];
   *    PA --> AD[Adaptive UI Strategy];
   *    PB --> AD;
   *    PC --> AD;
   *    PD --> AD;
   *    UserPrefs(User Preferences $U_p$) --> TCS;
   *    CurrentUIMode(Current UI Mode) --> TCS;
   * ```
   */
  public static getAdaptationPolicyFlow(): string {
    return `graph TD
    CPR[Cognitive Prediction Result (CLS, State, Confidence)] --> TCS{Threshold & Confidence Check};
    TCS -- State: Critical Overload --> PA[Policy A (Obscure, Crisis Mode)];
    TCS -- State: High Load --> PB[Policy B (Deemphasize, Guided Steps)];
    TCS -- State: Rising Load --> PC[Policy C (Summarize, Highlight)];
    TCS -- State: Optimal/Engaged --> PD[Policy D (None / Expand)];
    PA --> AD[Adaptive UI Strategy];
    PB --> AD;
    PC --> AD;
    PD --> AD;
    UserPrefs(User Preferences $U_p$) --> TCS;
    CurrentUIMode(Current UI Mode $M_{ui}$) --> TCS;`;
  }

  /**
   * @claim 6: Task complexity and its duration exert a significant, often non-linear, influence on cognitive load, especially for prolonged complex tasks, further modulated by task criticality and clarity.
   * @mermaid
   * ```mermaid
   * graph LR
   *    TC[Task Complexity $C_T$] --> A{Base Contribution $C_T \\cdot W_{TC}$};
   *    TT[Time In Task (sec) $T_{task}$] --> B{Prolonged Task Check};
   *    A -- $L_{base}$ --> Sum[Task Load Contribution];
   *    B -- if $C_T > 0.5$ & $T_{task} > 120$ --> Add[Time-based Increment $\\Delta L_{task}$];
   *    Add --> Sum;
   *    TIC[Task Is Critical?] -- Multiplier --> Sum;
   *    TGC[Task Goal Clarity Score] -- Inverse Impact --> Sum;
   * ```
   */
  public static getTaskComplexityImpact(): string {
    return `graph LR
    TC[Task Complexity $C_T$] --> A{Base Contribution $C_T \\cdot W_{TC}$};
    TT[Time In Task (sec) $T_{task}$] --> B{Prolonged Task Check};
    A -- $L_{base}$ --> Sum[Task Load Contribution];
    B -- if $C_T > 0.5$ & $T_{task} > 120$ --> Add[Time-based Increment $\\Delta L_{task}$];
    Add --> Sum;
    TIC[Task Is Critical? $I_{crit}$] -- $L_{task} \\cdot (1 + I_{crit})$ --> Sum;
    TGC[Task Goal Clarity Score $S_{clarity}$] -- $L_{task} \\cdot (1 - S_{clarity})$ --> Sum;`;
  }

  /**
   * @claim 7: Interaction errors are direct and strong indicators of cognitive overload or user struggle, thus receiving the highest weighting in the prediction model, amplified by user sensitivity and contextual criticality.
   * @mermaid
   * ```mermaid
   * graph TD
   *    E[Interaction Error Component] --> FV[Form Validation Errors];
   *    E --> RA[Repeated Action Attempts];
   *    E --> NE[Navigation Errors];
   *    E --> UF[UI Feedback Misinterpretations];
   *    E --> UR[Undo/Redo Frequency];
   *    E --> AF[Abandoned Form Rate];
   *    E --> UIPE[Unexpected Interaction Patterns];
   *    FV & RA & NE & UF & UR & AF & UIPE -- Normalize & Weight --> EL[Error Load];
   *    EL -- Any Critical Error? --> Boost[+1.0 Critical Boost $\\times S_e$];
   *    Boost --> Final[Total Error Contribution $L_{error}$];
   * ```
   */
  public static getErrorComponentImpact(): string {
    return `graph TD
    E[Interaction Error Component] --> FV[Form Validation Errors $E_{FV}$];
    E --> RA[Repeated Action Attempts $E_{RA}$];
    E --> NE[Navigation Errors $E_{NE}$];
    E --> UF[UI Feedback Misinterpretations $E_{UF}$];
    E --> UR[Undo/Redo Frequency $E_{UR}$];
    E --> AF[Abandoned Form Rate $E_{AF}$];
    E --> UIPE[Unexpected Interaction Patterns $E_{UIPE}$];
    FV & RA & NE & UF & UR & AF & UIPE -- $f(E_i) \\cdot w_i$ --> EL[Error Load];
    EL -- $E_{FV} > 0 \\lor E_{RA} > 0 \\lor E_{NE} > 0$ --> Boost[+1.0 Critical Boost $\\times S_e$];
    Boost --> Final[Total Error Contribution $L_{error}$];`;
  }

  /**
   * @claim 8: Feature thresholds are used to introduce non-linearities, amplifying the impact of extreme feature values on the predicted cognitive load, dynamically adjusted by the Homeostasis Manager based on system health.
   * @mermaid
   * ```mermaid
   * graph TD
   *    A[Feature Value $F_j$] --> B{Compare to Adaptive Threshold $T_{j,adapted}$};
   *    B -- Above/Below Threshold --> C[Apply Non-linear Modifier $\\Delta L_j = f(F_j, T_{j,adapted})$];
   *    C --> D[Modified Feature Contribution];
   *    B -- Within Range --> E[Standard Feature Contribution];
   *    HM(Homeostasis Manager) --> B;
   * ```
   */
  public static getThresholdsApplication(): string {
    return `graph TD
    A[Feature Value $F_j$] --> B{Compare to Adaptive Threshold $T_{j,adapted}$};
    B -- $F_j > T_{j,adapted}$ --> C[Apply Non-linear Modifier $\\Delta L_j = f(F_j, T_{j,adapted})$];
    C --> D[Modified Feature Contribution $L'_j$];
    B -- $F_j \\le T_{j,adapted}$ --> E[Standard Feature Contribution $L_j$];
    HM(CognitiveHomeostasisManager) --> B;`;
  }

  /**
   * @claim 9: User preferences, particularly the personalized baseline, adaptive learning rate, sensitivity to errors, and risk aversion, allow the cognitive load prediction model to adapt to individual user characteristics and their evolving interaction styles.
   * @mermaid
   * ```mermaid
   * graph LR
   *    UP[User Preferences $U_p$] --> PB[Personalized Baseline CLS $B_{CLS}$];
   *    UP --> ALT[Adaptive Learning Rate $\\lambda_a$];
   *    UP --> STE[Sensitivity to Errors $S_e$];
   *    UP --> RA[Risk Aversion $R_a$];
   *    PB --> P[Predictor Baseline Impact $L_{baseline}$];
   *    ALT --> A[Model Weight Adaptation $W'_k$];
   *    STE --> E[Error Component Weight Adjustment $W'_{error}$];
   *    RA --> R[Bias towards safer/guided adaptation];
   * ```
   */
  public static getUserPreferenceInfluence(): string {
    return `graph LR
    UP[User Preferences $U_p$] --> PB[Personalized Baseline CLS $B_{CLS}$];
    UP --> ALT[Adaptive Learning Rate $\\lambda_a$];
    UP --> STE[Sensitivity to Errors $S_e$];
    UP --> RA[Risk Aversion $R_a$];
    PB --> P[Predictor Baseline Impact $L_{baseline} = B_{CLS} \\cdot W_{baseline}$];
    ALT --> A[Model Weight Adaptation $W'_k = W_k(1 + \\lambda_a \\cdot \\Delta_k)$];
    STE --> E[Error Component Weight Adjustment $W'_{error} = W_{error} \\cdot S_e$];
    RA --> R[Bias towards safer/guided adaptation $P_{guide}$];`;
  }

  /**
   * @claim 10: The overall system interaction involves a closed feedback loop where predicted cognitive load informs UI adaptations, which in turn influence user behavior and subsequent telemetry, creating an emergent self-regulating cognitive homeostasis.
   * @mermaid
   * ```mermaid
   * graph LR
   *    User(User Interaction) --> Telemetry[Telemetry Collection];
   *    Telemetry --> Processor[Feature Processor];
   *    Processor --> FV[Feature Vector];
   *    FV --> Predictor[Cognitive Load Predictor];
   *    Predictor --> CPR[Cognitive Prediction Result];
   *    CPR --> Adapter[UI Adaptation Engine];
   *    Adapter --> UI[User Interface];
   *    UI -- Modifies --> User;
   *    CPR --> HomeostasisMgr[Cognitive Homeostasis Manager];
   *    HomeostasisMgr -- Adjusts --> Predictor;
   *    HomeostasisMgr -- Learns --> UserProfile[User Profile & Preferences];
   *    UserProfile --> Predictor;
   * ```
   */
  public static getOverallSystemInteraction(): string {
    return `graph LR
    User(User Interaction) --> Telemetry[Telemetry Collection];
    Telemetry --> Processor[Feature Processor];
    Processor --> FV[Feature Vector];
    FV --> Predictor[Cognitive Load Predictor];
    Predictor --> CPR[Cognitive Prediction Result];
    CPR --> Adapter[UI Adaptation Engine];
    Adapter --> UI[User Interface];
    UI -- Modifies User Experience --> User;
    CPR --> HomeostasisMgr[Cognitive Homeostasis Manager];
    HomeostasisMgr -- Adjusts Predictor Configuration --> Predictor;
    HomeostasisMgr -- Learns from Efficacy --> UserProfile[User Profile & Preferences];
    UserProfile --> Predictor;`;
  }

  /**
   * @claim 11: The Cognitive Homeostasis Manager maintains the long-term health and adaptability of the cognitive load prediction system through continuous monitoring, recalibration, and meta-learning.
   * @mermaid
   * ```mermaid
   * graph TD
   *    PR[Prediction Results] --> MM{Monitor Model Performance & Drift};
   *    UE[User Feedback / Adaptation Efficacy] --> MM;
   *    MM -- Degradation Detected --> RC[Recalibrate Predictor];
   *    MM -- New Patterns --> UP[Update Predictor Config];
   *    RC --> P[Predictor];
   *    UP --> P;
   *    MM -- Long-term Trends --> LP[Learn & Personalize User Profile];
   *    LP --> U[User Preferences];
   * ```
   */
  public static getHomeostasisManagerFlow(): string {
    return `graph TD
    PR[Prediction Results from Predictor] --> MM{Monitor Model Performance & Drift};
    UE[User Feedback / Adaptation Efficacy] --> MM;
    MM -- Degradation Detected --> RC[Recalibrate Predictor.calibrate()];
    MM -- New Patterns / Environment Changes --> UP[Update Predictor Config.updateModelConfig()];
    RC --> P[CognitiveLoadPredictor];
    UP --> P;
    MM -- Long-term Trends & Individual Differences --> LP[Learn & Personalize User Profile];
    LP --> U[User Preferences];
    style MM fill:#e7e7e7,stroke:#333,stroke-width:2px;`;
  }

  /**
   * @claim 12: The cognitive state transitions are governed by score thresholds, confidence levels, and temporal factors like fatigue accumulation, reflecting a nuanced understanding of human cognitive dynamics.
   * @mermaid
   * ```mermaid
   * graph LR
   *    Optimal --> Rising_Load: CLS > T_optimal;
   *    Rising_Load --> High_Load: CLS > T_rising;
   *    High_Load --> Critical_Overload: CLS > T_high;
   *    Critical_Overload --> Fatigued: Time_at_Critical > D_fatigue OR Persistent_Errors;
   *    Any_State --> Disengaged: Idle_Time > T_idle OR CLS < T_disengage;
   *    Any_State --> Confused: Erratic_Patterns OR Low_Coherence_Entropy;
   *    Fatigued --> Rising_Load: Activity_Low & Time_Relaxed;
   *    High_Load --> Engaged: CLS < T_rising;
   *    Engaged --> Optimal: CLS < T_engaged;
   * ```
   */
  public static getCognitiveStateTransitions(): string {
    return `graph LR
    Optimal --> Rising_Load: CLS > T_optimal_upper;
    Rising_Load --> High_Load: CLS > T_rising_upper;
    High_Load --> Critical_Overload: CLS > T_high_upper;
    Critical_Overload --> Fatigued: Time_at_Critical > D_fatigue OR Persistent_Errors;
    Critical_Overload --> Confused: Erratic_Interaction OR Low_Coherence;
    Any_State --> Disengaged: Idle_Time > T_idle OR Low_Engagement_Score;
    Fatigued --> Rising_Load: (CLS < T_high_upper AND Time_Since_Fatigue > D_recovery);
    High_Load --> Engaged: CLS <= T_rising_upper;
    Engaged --> Optimal: CLS <= T_optimal_upper;
    Disengaged --> Engaged: Activity_Resumption_Signal;
    Confused --> Rising_Load: Pattern_Normalization;
    `;
  }
}

/**
 * A utility class for various mathematical operations, particularly useful for
 * feature engineering and model calculations. This consolidates common
 * statistical and transformational equations.
 */
export class MathUtils {
  /**
   * @equation 1: Calculates the sigmoid activation function: $\sigma(x) = \frac{1}{1 + e^{-x}}$
   * @param x - The input value.
   * @returns The sigmoid of x.
   */
  public static sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * @equation 2: Calculates the hyperbolic tangent activation function: $\text{tanh}(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$
   * @param x - The input value.
   * @returns The tanh of x.
   */
  public static tanh(x: number): number {
    return Math.tanh(x);
  }

  /**
   * @equation 3: Calculates the Rectified Linear Unit (ReLU) activation function: $\text{ReLU}(x) = \max(0, x)$
   * @param x - The input value.
   * @returns The ReLU of x.
   */
  public static relu(x: number): number {
    return Math.max(0, x);
  }

  /**
   * @equation 4: Safely normalizes a feature value between 0 and 1: $N_f = \min(1, \max(0, \frac{V_f}{V_{max}}))$.
   * @equation 5: Inverted normalization: $N'_f = 1 - N_f$.
   * @param value - The raw feature value.
   * @param maxValue - The maximum expected value for normalization.
   * @param invert - If true, normalize such that higher value means lower load (e.g., Fitts' IP).
   * @param power - Optional power factor for non-linear scaling ($N_f = (\frac{V_f}{V_{max}})^P$). If 1, linear. >1 for exponential growth.
   */
  public static safeNormalize(value: number | undefined, maxValue: number, invert: boolean = false, power: number = 1): number {
    if (value === undefined || maxValue === 0 || isNaN(value) || !isFinite(value)) {
      return 0;
    }
    let normalized = Math.min(1, Math.max(0, value / maxValue));
    if (power !== 1) {
      normalized = Math.pow(normalized, power);
    }
    return invert ? (1 - normalized) : normalized;
  }

  /**
   * @equation 6: Calculates the Euclidean distance between two 2D points: $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.
   * @param p1 - First point {x, y}.
   * @param p2 - Second point {x, y}.
   * @returns Euclidean distance.
   */
  public static euclideanDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  /**
   * @equation 7: Calculates the average of an array of numbers: $\bar{x} = \frac{1}{N}\sum_{i=1}^N x_i$.
   * @param values - Array of numbers.
   * @returns Average value.
   */
  public static average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, current) => sum + current, 0) / values.length;
  }

  /**
   * @equation 8: Calculates the standard deviation of an array of numbers: $s = \sqrt{\frac{1}{N}\sum_{i=1}^N (x_i - \bar{x})^2}$.
   * @param values - Array of numbers.
   * @returns Standard deviation.
   */
  public static standardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    const avg = MathUtils.average(values);
    const variance = values.reduce((sum, current) => sum + Math.pow(current - avg, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * @equation 9: Calculates the exponential moving average (EMA): $\text{EMA}_t = (V_t \cdot \alpha) + (\text{EMA}_{t-1} \cdot (1 - \alpha))$.
   * @param currentValue - The latest value.
   * @param previousEMA - The previous EMA value.
   * @param alpha - Smoothing factor ($\alpha = \frac{2}{N+1}$ where N is period).
   * @returns The new EMA value.
   */
  public static exponentialMovingAverage(currentValue: number, previousEMA: number, alpha: number): number {
    if (isNaN(previousEMA)) return currentValue; // For the very first value
    return (currentValue * alpha) + (previousEMA * (1 - alpha));
  }

  /**
   * @equation 10: Calculates Shannon entropy: $H(X) = -\sum_{i=1}^n P(x_i) \log_2 P(x_i)$.
   * @param probabilities - An array of probabilities for each outcome.
   * @returns The entropy value.
   */
  public static shannonEntropy(probabilities: number[]): number {
    if (probabilities.some(p => p < 0 || p > 1) || MathUtils.sum(probabilities) > 1.0001) {
      console.warn("Invalid probabilities for entropy calculation.");
      return 0;
    }
    return -probabilities.reduce((sum, p) => p > 0 ? sum + p * Math.log2(p) : sum, 0);
  }

  /**
   * @equation 11: Calculates the sum of an array of numbers: $\text{Sum} = \sum_{i=1}^N x_i$.
   * @param values - Array of numbers.
   * @returns The sum.
   */
  public static sum(values: number[]): number {
    return values.reduce((acc, val) => acc + val, 0);
  }

  /**
   * @equation 12: Calculates the logarithm base 10: $\log_{10}(x)$.
   * @param x - Input value.
   * @returns Log base 10.
   */
  public static log10(x: number): number {
    return Math.log10(x);
  }

  /**
   * @equation 13: Calculates the natural logarithm: $\ln(x)$.
   * @param x - Input value.
   * @returns Natural log.
   */
  public static ln(x: number): number {
    return Math.log(x);
  }

  /**
   * @equation 14: Linear interpolation between two values: $V_L = V_1 + (V_2 - V_1) \cdot t$.
   * @param v1 - Start value.
   * @param v2 - End value.
   * @param t - Interpolation factor (0 to 1).
   * @returns Interpolated value.
   */
  public static lerp(v1: number, v2: number, t: number): number {
    return v1 + (v2 - v1) * t;
  }

  /**
   * @equation 15: Computes a polynomial feature: $P(x) = ax^2 + bx + c$.
   * @param x - The input feature.
   * @param a - Coefficient for x^2.
   * @param b - Coefficient for x.
   * @param c - Constant.
   * @returns The polynomial value.
   */
  public static polynomialFeature(x: number, a: number, b: number, c: number): number {
    return a * Math.pow(x, 2) + b * x + c;
  }

  /**
   * @equation 16: Computes an interaction term: $I = F_1 \cdot F_2$.
   * @param f1 - First feature.
   * @param f2 - Second feature.
   * @returns The interaction product.
   */
  public static interactionTerm(f1: number, f2: number): number {
    return f1 * f2;
  }

  /**
   * @equation 17: Clamp a value within a min/max range: $V_{clamped} = \max(V_{min}, \min(V, V_{max}))$.
   * @param value - The value to clamp.
   * @param min - The minimum allowed value.
   * @param max - The maximum allowed value.
   * @returns The clamped value.
   */
  public static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  }

  /**
   * @equation 18: Calculates Manhattan distance (L1 norm) between two 2D points: $d = |x_2 - x_1| + |y_2 - y_1|$.
   * @param p1 - First point {x, y}.
   * @param p2 - Second point {x, y}.
   * @returns Manhattan distance.
   */
  public static manhattanDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
  }

  /**
   * @equation 19: Z-score normalization: $Z = (X - \mu) / \sigma$.
   * @param value - The raw value.
   * @param mean - The mean of the dataset.
   * @param stdDev - The standard deviation of the dataset.
   * @returns The z-score.
   */
  public static zScoreNormalize(value: number, mean: number, stdDev: number): number {
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
  }

  /**
   * @equation 20: Min-Max Scaling: $X_{scaled} = (X - X_{min}) / (X_{max} - X_{min})$.
   * @param value - The raw value.
   * @param min - The minimum of the dataset.
   * @param max - The maximum of the dataset.
   * @returns The min-max scaled value.
   */
  public static minMaxScale(value: number, min: number, max: number): number {
    if (max === min) return 0;
    return (value - min) / (max - min);
  }

  /**
   * @equation 101: Calculates the variance of an array of numbers: $\text{Var}(X) = \frac{1}{N}\sum_{i=1}^N (x_i - \bar{x})^2$.
   * @param values - Array of numbers.
   * @returns Variance.
   */
  public static variance(values: number[]): number {
    if (values.length < 2) return 0;
    const avg = MathUtils.average(values);
    return values.reduce((sum, current) => sum + Math.pow(current - avg, 2), 0) / values.length;
  }

  /**
   * @equation 102: Calculates the covariance between two arrays of numbers: $\text{Cov}(X,Y) = \frac{1}{N}\sum_{i=1}^N (x_i - \bar{x})(y_i - \bar{y})$.
   * @param valuesX - First array of numbers.
   * @param valuesY - Second array of numbers.
   * @returns Covariance.
   */
  public static covariance(valuesX: number[], valuesY: number[]): number {
    if (valuesX.length === 0 || valuesX.length !== valuesY.length) return 0;
    const avgX = MathUtils.average(valuesX);
    const avgY = MathUtils.average(valuesY);
    let cov = 0;
    for (let i = 0; i < valuesX.length; i++) {
      cov += (valuesX[i] - avgX) * (valuesY[i] - avgY);
    }
    return cov / valuesX.length;
  }
}

/**
 * Manages the generation of specific claims about the Cognitive Load Predictor's design,
 * functionality, and underlying principles.
 */
export class CognitiveLoadAssertions {
  public static get allClaims(): string[] {
    return [
      this.claim1(),
      this.claim2(),
      this.claim3(),
      this.claim4(),
      this.claim5(),
      this.claim6(),
      this.claim7(),
      this.claim8(),
      this.claim9(),
      this.claim10(),
      this.claim11(), // New claim
      this.claim12(), // New claim
      this.claim13(), // New claim
      this.claim14(), // New claim
      this.claim15(), // New claim
    ];
  }

  /**
   * @claim 1: The model integrates a personalized baseline cognitive load score, allowing for individual user variation in baseline mental effort. This baseline is dynamically adjusted through observed long-term user performance and feedback.
   */
  public static claim1(): string {
    return "Claim 1: The Cognitive Load Predictor integrates a personalized baseline cognitive load score, allowing for individual user variation in baseline mental effort and adapting the prediction to unique user profiles. This baseline is not static but dynamically adjusted through continuous observation of long-term user performance trends and implicit/explicit feedback, ensuring perpetual relevance.";
  }

  /**
   * @claim 2: Non-linear feature transformations and interaction terms are employed to capture complex, synergistic relationships between user behaviors and cognitive load, including higher-order polynomial effects.
   */
  public static claim2(): string {
    return "Claim 2: To accurately model the intricate, non-additive nature of human cognition, the predictor employs sophisticated non-linear feature transformations, including polynomial terms, and explicitly defined interaction terms. This allows it to capture complex, synergistic relationships between various user behaviors, where the combined effect is greater than the sum of individual contributions, which simpler linear models fundamentally overlook.";
  }

  /**
   * @claim 3: Direct indicators of errors (e.g., form validation errors, repeated attempts) are weighted significantly higher, reflecting their immediate correlation with increased cognitive strain, and are further amplified by user-defined sensitivity and task criticality.
   */
  public static claim3(): string {
    return "Claim 3: Features directly indicative of user errors, such as frequent form validation failures or repeated interaction attempts, are assigned a disproportionately higher weight in the prediction model. This prioritization reflects their strong and immediate correlation with heightened cognitive strain and frustration, making them critical signals for intervention. Their impact is further modulated by user-defined sensitivity to errors and the criticality of the current task, allowing for context-aware amplification.";
  }

  /**
   * @claim 4: Task context, including complexity, time spent, criticality, and goal clarity, dynamically modulates the cognitive load prediction, acknowledging the varying demands of different activities and user states within those activities.
   */
  public static claim4(): string {
    return "Claim 4: The model dynamically incorporates a rich task context, particularly task complexity, the duration a user has been engaged, task criticality (e.g., is it a critical path task?), and the clarity of the task's goal. This allows the cognitive load prediction to be responsive to the inherent and perceived demands of the current activity, acknowledging that an error in a critical, prolonged, and ambiguously defined task has profoundly different implications than in a simple, short, and clear one.";
  }

  /**
   * @claim 5: A sigmoid activation function ensures that the final cognitive load score is consistently normalized between 0 and 1, facilitating interpretability and system integration. The sigmoid's parameters (bias, gain) are subject to adaptive tuning by the Homeostasis Manager.
   */
  public static claim5(): string {
    return "Claim 5: A final sigmoid activation function is applied to the accumulated raw cognitive load score. This mathematically guarantees that the output is consistently normalized to a range between 0 and 1, providing an easily interpretable, universally scaled metric for cognitive load that simplifies subsequent decision-making by adaptive UI systems. Crucially, the sigmoid's transformation parameters (e.g., center bias and slope) are subject to adaptive tuning by the Cognitive Homeostasis Manager, allowing the system to refine its output scaling based on observed performance and user feedback.";
  }

  /**
   * @claim 6: The predictor's architecture supports dynamic configuration parameter updates (e.g., weights, scaling factors, thresholds) and full recalibration, enabling agile adaptation and long-term self-optimization without requiring a full model re-training from scratch.
   */
  public static claim6(): string {
    return "Claim 6: The architecture supports agile adaptation through dynamic configuration updates and periodic recalibration. New scaling factors, component weights, interaction terms, or thresholds can be applied to the predictor's internal `featureConfig` without requiring a full model re-training cycle. Furthermore, a `calibrate` mechanism allows for more fundamental adjustments based on historical data, enabling rapid tuning and policy adjustments based on observed performance or new insights, fostering continuous self-improvement.";
  }

  /**
   * @claim 7: Mouse kinematics, including velocity, acceleration, tortuosity, Fitts' Law Index of Performance, jerk, and micro-pauses, provide granular insights into fine motor control and goal-directed movement efficiency, reflecting underlying cognitive effort, uncertainty, and frustration.
   */
  public static claim7(): string {
    return "Claim 7: Granular analysis of mouse kinematics â€“ including average velocity, acceleration, path tortuosity, Fitts' Law Index of Performance, jerk metrics, and the frequency of micro-pauses â€“ offers subtle yet powerful insights into a user's fine motor control and efficiency in goal-directed movements. Deviations from optimal patterns in these metrics directly reflect increased cognitive effort, uncertainty, hesitation, or even frustration during interaction, serving as early warning signals.";
  }

  /**
   * @claim 8: System resource metrics are incorporated to account for potential external factors influencing perceived cognitive load, such as system lag or unresponsiveness, distinguishing between user-induced and system-induced burden.
   */
  public static claim8(): string {
    return "Claim 8: The model acknowledges that perceived cognitive load is not solely a function of user interaction but can also be heavily influenced by external system factors. Therefore, comprehensive system resource metrics like CPU/GPU usage, memory, network latency, and disk I/O are incorporated to differentiate between user-induced load and system-induced struggle, providing a more holistic and accurate prediction by externalizing attribution for observed performance degradation.";
  }

  /**
   * @claim 9: The model uses adaptive thresholds to introduce abrupt, non-linear changes in load contribution for extreme feature values, simulating the human cognitive system's non-linear response to high-stress or critical conditions. These thresholds evolve over time.
   */
  public static claim9(): string {
    return "Claim 9: Critical, adaptive thresholds are implemented for specific feature values to introduce significant, non-linear boosts or penalties to the raw load accumulator. This design choice mimics the human experience where certain extreme conditions (e.g., very high backspace frequency, persistent errors, critical system lag) can cause a sudden, disproportionate surge in cognitive burden, rather than a gradual increase. Crucially, these thresholds are not static but dynamically adjusted by the Cognitive Homeostasis Manager based on the system's observed overall health and user adaptation patterns.";
  }

  /**
   * @claim 10: Cross-modal coherence features, including input modality switching rates, temporal lag between modalities, and coherence entropy, are introduced to capture the fluidity and stability of user engagement patterns across different input channels, providing deeper insights into cognitive resource allocation.
   */
  public static claim10(): string {
    return "Claim 10: To achieve a more comprehensive understanding of user state and cognitive resource allocation, advanced 'cross-modal coherence' features are introduced. These metrics analyze the variability and consistency of user engagement across mouse, keyboard, and scroll inputs, including the rate of modality switching, the temporal lag between related inputs (e.g., mouse click followed by keyboard input), and the entropy of these interaction patterns, providing insights into the fluidity and stability of the user's cognitive state and interaction strategy.";
  }

  /**
   * @claim 11: The Cognitive Load Predictor outputs a rich `CognitivePredictionResult` including a numerical score, a discrete `CognitiveStateCategory`, and a `PredictionConfidence` score, offering actionable, nuanced insights for downstream systems.
   */
  public static claim11(): string {
    return "Claim 11: The Cognitive Load Predictor transcends a mere numerical score by outputting a rich `CognitivePredictionResult` object. This result encapsulates not only the normalized cognitive load score (0.0-1.0) but also a discrete `CognitiveStateCategory` (e.g., Optimal, High Load, Fatigued) and a `PredictionConfidence` score. This multi-faceted output provides nuanced, actionable insights, enabling downstream adaptive UI systems to make more intelligent, context-aware decisions rather than relying solely on a single number.";
  }

  /**
   * @claim 12: A `CognitiveHomeostasisManager` acts as a meta-governor, continuously monitoring the predictor's performance, adapting its configuration, and learning long-term user profiles to ensure the system remains robust, accurate, and truly adaptive over time.
   */
  public static claim12(): string {
    return "Claim 12: The `CognitiveHomeostasisManager` is introduced as a critical meta-governor for the entire adaptive system. It continuously monitors the Cognitive Load Predictor's performance and accuracy, detects model drift, and orchestrates recalibration or configuration updates. Furthermore, it learns and refines long-term user profiles and preferences based on observed adaptation efficacy and user behavior, embodying the system's commitment to self-regulation, eternal homeostasis, and personalized, optimal user experience.";
  }

  /**
   * @claim 13: Inferred Emotional Affect features (e.g., frustration, engagement, boredom) are derived from interaction patterns to provide a more holistic understanding of user well-being, influencing adaptation strategies beyond pure cognitive load.
   */
  public static claim13(): string {
    return "Claim 13: Beyond purely cognitive metrics, the model incorporates 'Inferred Emotional Affect' features, such as frustration, engagement, and boredom scores. These are subtly derived from constellations of interaction patterns (e.g., high error rates + rapid, erratic mouse movements -> frustration). This provides a more holistic understanding of the user's overall well-being and emotional state, allowing adaptation strategies to address not just cognitive burden but also emotional distress, ultimately fostering a more compassionate and effective user experience.";
  }

  /**
   * @claim 14: The system integrates sophisticated temporal interaction features, including burstiness, periodicity, and activity decay, to capture dynamic shifts in user engagement and rhythm, providing leading indicators of impending cognitive state changes.
   */
  public static claim14(): string {
    return "Claim 14: To detect subtle shifts and provide leading indicators of cognitive state changes, the system integrates sophisticated temporal interaction features. These include interaction burstiness (variance in event frequency), periodicity scores (rhythmic patterns in user input), and recent activity decay models. These metrics capture the dynamic ebb and flow of user engagement and rhythm, offering a temporal dimension that is crucial for anticipating, rather than merely reacting to, changes in cognitive load.";
  }

  /**
   * @claim 15: The principle of 'Opposite of Vanity' guides the entire system's design: every added complexity, every deeper feature, and every adaptive mechanism serves the singular, profound purpose of reducing user cognitive burden and enhancing user agency, speaking for the voiceless overwhelmed by digital complexity.
   */
  public static claim15(): string {
    return "Claim 15: The foundational principle of 'Opposite of Vanity' guides the entire system's architectural evolution. Every newly introduced feature, every enhanced algorithm, and every adaptive mechanism is rigorously evaluated against its singular, profound purpose: to genuinely reduce user cognitive burden, anticipate friction points, and enhance user agency. This system is designed not for algorithmic elegance as an end in itself, but as a voice for the voiceless user, silently struggling with the relentless complexity of the digital world, to free them through impeccable, empathetic logic.";
  }
}

/**
 * Implements a sophisticated mock machine learning model for inferring cognitive load.
 * This class replaces a simple linear sum with a more robust, non-linear
 * combination of features, simulating a real-world ML prediction mechanism.
 *
 * The prediction logic incorporates:
 * - Personalized baseline from user preferences.
 * - Non-linear scaling of individual features.
 * - Interaction terms between related features.
 * - Stronger influence for direct error indicators.
 * - Impact of current task complexity.
 * - Sigmoid activation for final score normalization [0, 1].
 */
export class CognitiveLoadPredictor implements ICognitiveLoadPredictor {

  // Configuration for feature scaling and weights, mimicking trained model parameters
  private featureConfig = {
    // Scaling factors to normalize features, assume typical max values for a 1-second window
    scaling: {
      mouse_velocity_avg: 20, // px/ms
      mouse_acceleration_avg: 5, // px/ms^2
      mouse_path_tortuosity: 5, // ratio, e.g., 5x longer path than straight
      mouse_dwell_time_avg: 200, // ms
      fitts_law_ip_avg: 10, // Max reasonable Index of Performance, higher is better (inverse relationship to load)
      mouse_jerk_metric: 0.5, // px/ms^3
      mouse_movement_entropy: 4, // bits
      mouse_pressure_avg: 1.0, // 0-1
      mouse_cursor_instability: 50, // px variance
      mouse_pauses_per_sec: 2, // count

      click_frequency: 10, // clicks/sec
      click_latency_avg: 500, // ms between clicks (higher latency indicates struggle)
      target_acquisition_error_avg: 100, // px deviation from center
      double_click_frequency: 2, // double clicks / sec (can indicate hurriedness)
      misclick_rate: 0.1, // percentage of misclicks
      click_sequence_variability: 0.5, // std dev of target sequence
      click_duration_avg: 200, // ms
      target_revisit_frequency: 2, // count

      scroll_velocity_avg: 2000, // px/sec
      scroll_direction_changes: 10, // count per second (high for erratic scrolling)
      scroll_pause_frequency: 5, // pauses per second (high for confusion/search)
      scroll_amplitude_variance: 10000, // px^2
      scroll_event_density_per_area: 0.01, // events/px^2
      scroll_panning_frequency: 1, // count
      scroll_depth_avg: 1.0, // 0-1, 1 is end of page

      typing_speed_wpm: 120, // wpm (deviation from optimal affects load)
      backspace_frequency: 3, // backspaces / sec
      keystroke_latency_avg: 200, // ms between keydowns
      error_correction_rate: 1, // ratio (0-1), higher means more corrections
      key_press_duration_avg: 100, // ms
      cognitive_typing_lag: 500, // ms
      modifier_key_frequency: 0.5, // ratio of modifier keys
      input_field_revisits: 2, // count
      auto_correction_usage: 0.5, // ratio

      form_validation_errors_count: 5, // count in window
      repeated_action_attempts_count: 3, // count in window
      navigation_errors_count: 3, // count in window
      ui_feedback_misinterpretations: 2, // count in window
      undo_redo_frequency: 2, // count in window
      abandoned_form_rate: 0.5, // 0-1
      unexpected_interaction_patterns: 2, // count

      current_task_complexity: 1, // 0-1 normalized
      time_in_current_task_sec: 600, // Max 10 min
      task_interruption_frequency: 0.5, // interruptions/sec
      task_cognitive_demand_rating: 1, // 0-1 normalized
      task_dependency_resolution_time_avg: 60, // sec
      task_uncertainty_score: 1, // 0-1
      task_prioritization_changes_freq: 0.1, // changes/sec

      cpu_usage_avg: 100, // %
      memory_usage_avg: 100, // %
      network_latency_avg: 500, // ms
      gpu_usage_avg: 100, // %
      disk_io_avg: 100, // MB/s
      system_responsiveness_score: 1, // inverse, 1 is max unresponsiveness

      interaction_burstiness: 1, // 0-1
      periodicity_score: 1, // 0-1
      session_duration_sec: 3600, // 1 hour
      idle_time_percentage: 1, // 0-1
      recent_activity_decay: 1, // 0-1

      cross_modal_lag_avg: 1000, // ms
      input_modality_switching_rate: 1, // switches/sec
      coherence_entropy: 3, // bits

      frustration_score: 1, // 0-1
      engagement_score: 1, // 0-1 (inverted, higher means lower load contribution)
      boredom_score: 1, // 0-1

      event_density: 100, // total events per sec in window
      cross_modal_interaction_entropy: 3, // bits
      cognitive_state_persistence: 1, // 0-1, 1 means very stable, 0 means highly variable
    },
    // Weights for different components / feature groups
    weights: {
      baseline: 0.08,
      mouseComponent: 0.18,
      clickComponent: 0.22,
      keyboardComponent: 0.13,
      scrollComponent: 0.09,
      errorComponent: 0.30, // Errors are strong indicators, higher weight
      taskContext: 0.14,
      systemResources: 0.09,
      temporalInteraction: 0.06,
      crossModalCoherence: 0.05,
      emotionalAffect: 0.10,
      eventDensity: 0.03, // Small but contributes to overall activity
      cognitivePersistence: 0.07,
    },
    // Thresholds for non-linear impacts (e.g., very high backspace freq, low WPM)
    thresholds: {
      highBackspace: 1.5, // backspaces/sec
      lowWPM: 20, // Words Per Minute
      highTargetError: 50, // px
      lowFittsIP: 1, // Low Fitts' Law Index of Performance
      highMisclickRate: 0.05, // 5% misclick
      highNetworkLatency: 250, // ms
      highCpuUsage: 75, // %
      longTaskTime: 240, // seconds (4 minutes)
      highTaskInterruption: 0.1, // interruptions/sec
      lowCognitivePersistence: 0.2, // very unstable state
      highJerk: 0.3, // px/ms^3
      highCursorInstability: 20, // px variance
      highScrollDirectionChanges: 7, // count per sec
      lowEngagement: 0.3, // 0-1
      highFrustration: 0.7, // 0-1
      highBoredom: 0.7, // 0-1
    },
    // Parameters for sigmoid activation
    sigmoidParams: {
      centerBias: 2.5, // Shifts the S-curve left/right. Higher bias means more rawLoad for same CLS.
      gain: 1.0, // Controls the steepness of the S-curve. Higher gain means faster transition.
    },
    // Confidence model parameters
    confidenceParams: {
      featureCompletenessThreshold: 0.7, // % of features present to be 'high'
      predictionStabilityThreshold: 0.05, // change in CLS to be 'medium'
      highErrorImpactConfidenceBoost: 0.2, // Boost confidence if high errors confirm high load
    }
  };

  private currentPredictorHealth: PredictorHealthStatus = PredictorHealthStatus.INITIALIZING;
  private lastPredictionScore: number = 0; // For stability assessment

  constructor() {
    // Initial self-assessment for health
    this.currentPredictorHealth = PredictorHealthStatus.OPTIMAL; // Assuming good initial state
  }

  /**
   * Diagnoses the cognitive state from the raw load score based on user thresholds.
   * @equation 103: State Mapping: $S = f(\text{CLS}, U_{thresholds})$.
   */
  private diagnoseCognitiveState(score: number, userPrefs: UserPreferences): CognitiveStateCategory {
    const thresholds = userPrefs.cognitiveLoadThresholds;

    if (score >= thresholds.criticalUpper) {
      return CognitiveStateCategory.CRITICAL_OVERLOAD;
    } else if (score >= thresholds.highUpper) {
      return CognitiveStateCategory.HIGH_LOAD;
    } else if (score >= thresholds.risingUpper) {
      return CognitiveStateCategory.RISING_LOAD;
    } else if (score >= thresholds.engagedUpper) {
      return CognitiveStateCategory.ENGAGED;
    } else if (score >= thresholds.optimalUpper) {
      return CognitiveStateCategory.OPTIMAL;
    } else if (score <= thresholds.disengagementOnset) { // Assuming lower score means disengaged if below optimal
      return CognitiveStateCategory.DISENGAGED;
    } else if (score <= thresholds.guidedLow) { // if there is a guidedLow then optimal score could be in between these.
      return CognitiveStateCategory.OPTIMAL;
    }
    // Fallback or a state for very low, non-disengaged activity
    return CognitiveStateCategory.ENGAGED;
  }

  /**
   * Estimates the confidence of the prediction based on feature completeness and internal consistency.
   * @equation 104: Confidence score: $C = f(\text{feature_completeness}, \text{prediction_stability}, \text{error_confirmation})$.
   */
  private estimatePredictionConfidence(
    features: TelemetryFeatureVector,
    currentScore: number,
    lastScore: number,
    errorLoadContribution: number
  ): PredictionConfidence {
    let confidenceScore = 0.5; // Start at medium

    // Feature completeness (more features -> higher confidence)
    let presentFeaturesCount = 0;
    let totalFeatureGroups = 0;
    for (const key of Object.keys(features)) {
      if (typeof (features as any)[key] === 'object' && (features as any)[key] !== null) {
        totalFeatureGroups++;
        if (Object.keys((features as any)[key]).length > 0) {
          presentFeaturesCount++;
        }
      } else if (key !== 'timestamp_window_end') {
        totalFeatureGroups++;
        if ((features as any)[key] !== undefined) {
          presentFeaturesCount++;
        }
      }
    }
    const featureCompleteness = totalFeatureGroups > 0 ? presentFeaturesCount / totalFeatureGroups : 0;
    if (featureCompleteness > this.featureConfig.confidenceParams.featureCompletenessThreshold) {
      confidenceScore += 0.2;
    } else if (featureCompleteness < 0.3) {
      confidenceScore -= 0.1; // Penalize low completeness
    }

    // Prediction stability (consistent predictions are more confident)
    const scoreDelta = Math.abs(currentScore - lastScore);
    if (this.lastPredictionScore === 0 || scoreDelta < this.featureConfig.confidenceParams.predictionStabilityThreshold) {
      confidenceScore += 0.1; // Stable
    } else if (scoreDelta > 0.3) { // Large, sudden shift
      confidenceScore -= 0.1; // Less confident
    }

    // Error confirmation (if high errors, and high load, confidence increases)
    if (errorLoadContribution > 0.5 && currentScore > 0.7) {
      confidenceScore += this.featureConfig.confidenceParams.highErrorImpactConfidenceBoost;
    }

    confidenceScore = MathUtils.clamp(confidenceScore, 0, 1);

    if (confidenceScore > 0.85) return 'very_high';
    if (confidenceScore > 0.65) return 'high';
    if (confidenceScore > 0.4) return 'medium';
    return 'low';
  }


  /**
   * Predicts the cognitive load score based on the given feature vector,
   * user preferences, and current task context.
   *
   * @equation 21: The overall raw cognitive load accumulator $R_L$ starts with an initial baseline contribution: $R_L(0) = U_{CLS} \cdot W_{baseline} \cdot 2$.
   * @equation 22: The base value for baseline contribution: $U_{CLS} = \text{userPrefs.personalizedBaselineCLS}$.
   * @equation 23: The weight for baseline contribution: $W_{baseline} = \text{this.featureConfig.weights.baseline}$.
   * @equation 24: Initial scaled baseline contribution: $L_{base} = U_{CLS} \cdot W_{baseline} \cdot C_{scaling}$.
   * @equation 25: The accumulation function for raw load: $R_L(t) = R_L(t-1) + L_{component} \cdot W_{component}$.
   * @equation 105: Non-linear feature transformation before weighting: $L'_f = W_f \cdot \text{ReLU}(N_f)^P$.
   *
   * @param features - The processed telemetry feature vector.
   * @param userPrefs - User-specific preferences including baseline CLS.
   * @param currentTask - The current task context.
   * @returns A normalized cognitive load score (0.0 to 1.0).
   */
  public predict(
    features: TelemetryFeatureVector,
    userPrefs: UserPreferences,
    currentTask: TaskContext | null
  ): CognitivePredictionResult {
    let rawLoadAccumulator = 0; // Accumulate raw contributions, then normalize with sigmoid
    const contributingFeatures: { [key: string]: number } = {}; // For debugging and output

    // 1. Start with personalized baseline, scaled by its weight and user's preferred mode
    // Eq. 21, 22, 23, 24
    let baselineContribution = userPrefs.personalizedBaselineCLS * this.featureConfig.weights.baseline * 2;
    // Adjust baseline based on preferred UI mode, e.g., 'minimal' might imply lower baseline
    if (userPrefs.preferredUiMode === 'minimal') baselineContribution *= 0.8;
    else if (userPrefs.preferredUiMode === 'guided') baselineContribution *= 1.2; // Guided might indicate initial higher base load
    rawLoadAccumulator += baselineContribution;
    contributingFeatures['baseline'] = baselineContribution;

    // --- 2. Mouse Kinematics Component ---
    let mouseLoadContribution = 0;
    if (features.mouse) {
      const mouse = features.mouse;
      // Eq. 26: $L_{vel} = N(\text{mouse_velocity_avg}) \cdot 0.4$. (Higher velocity often means less deliberate, but could be efficient. Context needed.)
      mouseLoadContribution += MathUtils.safeNormalize(mouse.mouse_velocity_avg, this.featureConfig.scaling.mouse_velocity_avg, false, 0.5) * 0.4; // Slightly inverted, sqrt scaling
      // Eq. 27: $L_{accel} = N(\text{mouse_acceleration_avg}) \cdot 0.3$.
      mouseLoadContribution += MathUtils.safeNormalize(mouse.mouse_acceleration_avg, this.featureConfig.scaling.mouse_acceleration_avg, false, 1.5) * 0.3; // Quadratic scaling for acceleration
      // Eq. 28: $L_{tort} = N(\text{mouse_path_tortuosity}) \cdot 0.3$.
      mouseLoadContribution += MathUtils.safeNormalize(mouse.mouse_path_tortuosity, this.featureConfig.scaling.mouse_path_tortuosity, false, 2) * 0.3; // Strong quadratic impact for tortuosity
      // Eq. 29: $L_{fitts\_ip} = N(\text{fitts_law_ip_avg}, \text{invert=true}) \cdot 0.2$. (Higher IP is better, so invert)
      mouseLoadContribution += MathUtils.safeNormalize(mouse.fitts_law_ip_avg, this.featureConfig.scaling.fitts_law_ip_avg, true, 2) * 0.2; // Quadratic inversion for Fitts' IP
      // Eq. 30: $L_{jerk} = N(\text{mouse_jerk_metric}) \cdot 0.15$.
      mouseLoadContribution += MathUtils.safeNormalize(mouse.mouse_jerk_metric, this.featureConfig.scaling.mouse_jerk_metric, false, 2) * 0.15;
      // Eq. 31: $L_{dwell} = N(\text{mouse_dwell_time_avg}) \cdot 0.1$.
      mouseLoadContribution += MathUtils.safeNormalize(mouse.mouse_dwell_time_avg, this.featureConfig.scaling.mouse_dwell_time_avg, false, 1.2) * 0.1;
      // Eq. 32: $L_{entropy} = N(\text{mouse_movement_entropy}, \text{invert=true}) \cdot 0.05$. (Higher entropy usually means less predictable, perhaps less fluid/efficient movement -> higher load)
      mouseLoadContribution += MathUtils.safeNormalize(mouse.mouse_movement_entropy, this.featureConfig.scaling.mouse_movement_entropy, true) * 0.05;
      // New: mouse pressure and instability
      mouseLoadContribution += MathUtils.safeNormalize(mouse.mouse_pressure_avg, this.featureConfig.scaling.mouse_pressure_avg, false, 0.8) * 0.05;
      mouseLoadContribution += MathUtils.safeNormalize(mouse.mouse_cursor_instability, this.featureConfig.scaling.mouse_cursor_instability, false, 1.5) * 0.1;
      mouseLoadContribution += MathUtils.safeNormalize(mouse.mouse_pauses_per_sec, this.featureConfig.scaling.mouse_pauses_per_sec, false, 1.5) * 0.1;


      // Eq. 33: Interaction term: high tortuosity with low Fitts' Law IP (poor performance)
      // $I_{mouse\_performance} = \text{if}(\text{mouse_path_tortuosity} > T_{tort} \land \text{fitts_law_ip_avg} < T_{fitts\_ip}, 0.5, 0)$.
      if (mouse.mouse_path_tortuosity > 2 && mouse.fitts_law_ip_avg < this.featureConfig.thresholds.lowFittsIP) {
        mouseLoadContribution += 0.5 * MathUtils.interactionTerm(
          MathUtils.safeNormalize(mouse.mouse_path_tortuosity, this.featureConfig.scaling.mouse_path_tortuosity),
          MathUtils.safeNormalize(mouse.fitts_law_ip_avg, this.featureConfig.scaling.fitts_law_ip_avg, true)
        ); // Significant boost, scaled by normalized values
      }
      // Eq. 34: Interaction term: high jerk and low Fitts' IP
      // $I_{mouse\_jerk\_fitts} = \text{if}(\text{mouse_jerk_metric} > 0.3 \land \text{fitts_law_ip_avg} < 2, 0.3, 0)$.
      if (mouse.mouse_jerk_metric > this.featureConfig.thresholds.highJerk && mouse.fitts_law_ip_avg < 2) {
        mouseLoadContribution += 0.3 * MathUtils.interactionTerm(
          MathUtils.safeNormalize(mouse.mouse_jerk_metric, this.featureConfig.scaling.mouse_jerk_metric),
          MathUtils.safeNormalize(mouse.fitts_law_ip_avg, this.featureConfig.scaling.fitts_law_ip_avg, true)
        );
      }
      // New: Interaction of high cursor instability and high dwell time (struggling to commit)
      if (mouse.mouse_cursor_instability > this.featureConfig.thresholds.highCursorInstability && mouse.mouse_dwell_time_avg > 150) {
        mouseLoadContribution += 0.4;
      }
    }
    // Eq. 35: Weighted mouse component addition: $R_L \leftarrow R_L + L_{mouse} \cdot W_{mouse}$.
    rawLoadAccumulator += mouseLoadContribution * this.featureConfig.weights.mouseComponent;
    contributingFeatures['mouseComponent'] = mouseLoadContribution * this.featureConfig.weights.mouseComponent;

    // --- 3. Click Dynamics Component ---
    let clickLoadContribution = 0;
    if (features.clicks) {
      const clicks = features.clicks;
      // Eq. 36: $L_{freq} = N(\text{click_frequency}) \cdot 0.3$. (High freq can be efficient or hurried -> ambiguous, use lower power)
      clickLoadContribution += MathUtils.safeNormalize(clicks.click_frequency, this.featureConfig.scaling.click_frequency, false, 0.8) * 0.3;
      // Eq. 37: $L_{latency} = N(\text{click_latency_avg}) \cdot 0.2$. (Higher latency -> usually struggle)
      clickLoadContribution += MathUtils.safeNormalize(clicks.click_latency_avg, this.featureConfig.scaling.click_latency_avg, false, 1.5) * 0.2;
      // Eq. 38: $L_{error} = N(\text{target_acquisition_error_avg}) \cdot 0.5$. (Strong indicator)
      clickLoadContribution += MathUtils.safeNormalize(clicks.target_acquisition_error_avg, this.featureConfig.scaling.target_acquisition_error_avg, false, 2) * 0.5;
      // Eq. 39: $L_{double\_freq} = N(\text{double_click_frequency}) \cdot 0.2$. (Can indicate uncertainty or rapid attempts)
      clickLoadContribution += MathUtils.safeNormalize(clicks.double_click_frequency, this.featureConfig.scaling.double_click_frequency, false, 1.5) * 0.2;
      // Eq. 40: $L_{misclick} = N(\text{misclick_rate}) \cdot 0.4$. (Very strong indicator)
      clickLoadContribution += MathUtils.safeNormalize(clicks.misclick_rate, this.featureConfig.scaling.misclick_rate, false, 2.5) * 0.4;
      // Eq. 41: $L_{seq\_var} = N(\text{click_sequence_variability}) \cdot 0.15$.
      clickLoadContribution += MathUtils.safeNormalize(clicks.click_sequence_variability, this.featureConfig.scaling.click_sequence_variability, false, 1.2) * 0.15;
      // New: click duration and target revisit
      clickLoadContribution += MathUtils.safeNormalize(clicks.click_duration_avg, this.featureConfig.scaling.click_duration_avg, false, 1.2) * 0.05;
      clickLoadContribution += MathUtils.safeNormalize(clicks.target_revisit_frequency, this.featureConfig.scaling.target_revisit_frequency, false, 2) * 0.15;

      // Eq. 42: Strong impact if target acquisition error is very high
      // $I_{high\_target\_error} = \text{if}(\text{target_acquisition_error_avg} > T_{target\_error}, 0.7, 0)$.
      if (clicks.target_acquisition_error_avg > this.featureConfig.thresholds.highTargetError) {
        clickLoadContribution += 0.7 * MathUtils.safeNormalize(clicks.target_acquisition_error_avg, this.featureConfig.scaling.target_acquisition_error_avg); // Significant load increase
      }
      // Eq. 43: Strong impact if misclick rate is high
      // $I_{high\_misclick} = \text{if}(\text{misclick_rate} > T_{misclick}, 0.5, 0)$.
      if (clicks.misclick_rate > this.featureConfig.thresholds.highMisclickRate) {
        clickLoadContribution += 0.5 * MathUtils.safeNormalize(clicks.misclick_rate, this.featureConfig.scaling.misclick_rate);
      }
      // New: High click latency with high sequence variability (hesitation + uncertainty)
      if (clicks.click_latency_avg > 300 && clicks.click_sequence_variability > 0.3) {
        clickLoadContribution += 0.6;
      }
    }
    // Eq. 44: Weighted click component addition: $R_L \leftarrow R_L + L_{click} \cdot W_{click}$.
    rawLoadAccumulator += clickLoadContribution * this.featureConfig.weights.clickComponent;
    contributingFeatures['clickComponent'] = clickLoadContribution * this.featureConfig.weights.clickComponent;

    // --- 4. Keyboard Dynamics Component ---
    let keyboardLoadContribution = 0;
    if (features.keyboard) {
      const keyboard = features.keyboard;
      const optimalWPM = 60; // Example optimal WPM
      // Eq. 45: Deviation from optimal WPM: $S_{wpm\_dev} = \min(1, |\text{typing_speed_wpm} - \text{optimalWPM}| / \text{optimalWPM})$.
      const wpmDeviationScore = Math.min(1, Math.abs(keyboard.typing_speed_wpm - optimalWPM) / optimalWPM);
      // Eq. 46: $L_{wpm} = S_{wpm\_dev} \cdot 0.2$.
      keyboardLoadContribution += wpmDeviationScore * 0.2;

      // Eq. 47: $L_{backspace} = N(\text{backspace_frequency}) \cdot 0.4$.
      keyboardLoadContribution += MathUtils.safeNormalize(keyboard.backspace_frequency, this.featureConfig.scaling.backspace_frequency, false, 2.5) * 0.4;
      // Eq. 48: $L_{keystroke\_lat} = N(\text{keystroke_latency_avg}) \cdot 0.2$.
      keyboardLoadContribution += MathUtils.safeNormalize(keyboard.keystroke_latency_avg, this.featureConfig.scaling.keystroke_latency_avg, false, 1.5) * 0.2;
      // Eq. 49: $L_{error\_corr} = N(\text{error_correction_rate}) \cdot 0.5$.
      keyboardLoadContribution += MathUtils.safeNormalize(keyboard.error_correction_rate, this.featureConfig.scaling.error_correction_rate, false, 2) * 0.5;
      // Eq. 50: $L_{press\_dur} = N(\text{key_press_duration_avg}) \cdot 0.1$.
      keyboardLoadContribution += MathUtils.safeNormalize(keyboard.key_press_duration_avg, this.featureConfig.scaling.key_press_duration_avg, false, 1.1) * 0.1;
      // Eq. 51: $L_{typing\_lag} = N(\text{cognitive_typing_lag}) \cdot 0.25$.
      keyboardLoadContribution += MathUtils.safeNormalize(keyboard.cognitive_typing_lag, this.featureConfig.scaling.cognitive_typing_lag, false, 1.5) * 0.25;
      // New: modifier key freq, input field revisits, auto-correction
      keyboardLoadContribution += MathUtils.safeNormalize(keyboard.modifier_key_frequency, this.featureConfig.scaling.modifier_key_frequency, true, 0.5) * 0.05; // Lower load for power users (inverted)
      keyboardLoadContribution += MathUtils.safeNormalize(keyboard.input_field_revisits, this.featureConfig.scaling.input_field_revisits, false, 1.5) * 0.15;
      keyboardLoadContribution += MathUtils.safeNormalize(keyboard.auto_correction_usage, this.featureConfig.scaling.auto_correction_usage, false, 1.2) * 0.1;

      // Eq. 52: Interaction term: high backspace with high error correction rate
      // $I_{backspace\_error\_corr} = \text{if}(\text{backspace_frequency} > T_{highBackspace} \land \text{error_correction_rate} > 0.5, 0.8, 0)$.
      if (keyboard.backspace_frequency > this.featureConfig.thresholds.highBackspace && keyboard.error_correction_rate > 0.5) {
        keyboardLoadContribution += 0.8 * MathUtils.interactionTerm(
          MathUtils.safeNormalize(keyboard.backspace_frequency, this.featureConfig.scaling.backspace_frequency),
          MathUtils.safeNormalize(keyboard.error_correction_rate, this.featureConfig.scaling.error_correction_rate)
        ); // Strong signal of frustration/load
      }
      // Eq. 53: Very low WPM also indicates struggle
      // $I_{low\_wpm} = \text{if}(\text{typing_speed_wpm} > 0 \land \text{typing_speed_wpm} < T_{lowWPM}, 0.6, 0)$.
      if (keyboard.typing_speed_wpm > 0 && keyboard.typing_speed_wpm < this.featureConfig.thresholds.lowWPM) {
        keyboardLoadContribution += 0.6 * MathUtils.safeNormalize(this.featureConfig.thresholds.lowWPM - keyboard.typing_speed_wpm, this.featureConfig.thresholds.lowWPM);
      }
      // New: high cognitive typing lag with high keystroke latency (deep struggle)
      if (keyboard.cognitive_typing_lag > 300 && keyboard.keystroke_latency_avg > 300) {
        keyboardLoadContribution += 0.7;
      }
    }
    // Eq. 54: Weighted keyboard component addition: $R_L \leftarrow R_L + L_{keyboard} \cdot W_{keyboard}$.
    rawLoadAccumulator += keyboardLoadContribution * this.featureConfig.weights.keyboardComponent;
    contributingFeatures['keyboardComponent'] = keyboardLoadContribution * this.featureConfig.weights.keyboardComponent;

    // --- 5. Scroll Dynamics Component ---
    let scrollLoadContribution = 0;
    if (features.scroll) {
      const scroll = features.scroll;
      // Eq. 55: $L_{scroll\_vel} = N(\text{scroll_velocity_avg}) \cdot 0.2$. (Can be efficient or frantic)
      scrollLoadContribution += MathUtils.safeNormalize(scroll.scroll_velocity_avg, this.featureConfig.scaling.scroll_velocity_avg, false, 0.8) * 0.2;
      // Eq. 56: $L_{dir\_changes} = N(\text{scroll_direction_changes}) \cdot 0.4$. (Strong indicator of erratic search/confusion)
      scrollLoadContribution += MathUtils.safeNormalize(scroll.scroll_direction_changes, this.featureConfig.scaling.scroll_direction_changes, false, 2) * 0.4;
      // Eq. 57: $L_{pause\_freq} = N(\text{scroll_pause_frequency}) \cdot 0.2$. (Pauses can be deliberation or confusion)
      scrollLoadContribution += MathUtils.safeNormalize(scroll.scroll_pause_frequency, this.featureConfig.scaling.scroll_pause_frequency, false, 1.5) * 0.2;
      // Eq. 58: $L_{amp\_var} = N(\text{scroll_amplitude_variance}) \cdot 0.15$. (High variance -> erratic, searching)
      scrollLoadContribution += MathUtils.safeNormalize(scroll.scroll_amplitude_variance, this.featureConfig.scaling.scroll_amplitude_variance, false, 1.5) * 0.15;
      // Eq. 59: $L_{event\_density\_area} = N(\text{scroll_event_density_per_area}) \cdot 0.1$.
      scrollLoadContribution += MathUtils.safeNormalize(scroll.scroll_event_density_per_area, this.featureConfig.scaling.scroll_event_density_per_area, false, 1.1) * 0.1;
      // New: panning freq, scroll depth
      scrollLoadContribution += MathUtils.safeNormalize(scroll.scroll_panning_frequency, this.featureConfig.scaling.scroll_panning_frequency, false, 1.5) * 0.05;
      scrollLoadContribution += MathUtils.safeNormalize(scroll.scroll_depth_avg, this.featureConfig.scaling.scroll_depth_avg, false, 0.8) * 0.05; // Deeper scroll = more engagement (inverted)

      // Eq. 60: High direction changes and pauses could indicate searching/confusion
      // $I_{scroll\_confusion} = \text{if}(\text{scroll_direction_changes} > 5 \land \text{scroll_pause_frequency} > 1, 0.4, 0)$.
      if (scroll.scroll_direction_changes > this.featureConfig.thresholds.highScrollDirectionChanges && scroll.scroll_pause_frequency > 1) {
        scrollLoadContribution += 0.4 * MathUtils.interactionTerm(
          MathUtils.safeNormalize(scroll.scroll_direction_changes, this.featureConfig.scaling.scroll_direction_changes),
          MathUtils.safeNormalize(scroll.scroll_pause_frequency, this.featureConfig.scaling.scroll_pause_frequency)
        );
      }
    }
    // Eq. 61: Weighted scroll component addition: $R_L \leftarrow R_L + L_{scroll} \cdot W_{scroll}$.
    rawLoadAccumulator += scrollLoadContribution * this.featureConfig.weights.scrollComponent;
    contributingFeatures['scrollComponent'] = scrollLoadContribution * this.featureConfig.weights.scrollComponent;

    // --- 6. Interaction Error Component (strongest and most direct indicators of load) ---
    let errorLoadContribution = 0;
    if (features.errors) {
      const errors = features.errors;
      // Eq. 62: $L_{form\_errors} = N(\text{form_validation_errors_count}) \cdot 0.5$.
      errorLoadContribution += MathUtils.safeNormalize(errors.form_validation_errors_count, this.featureConfig.scaling.form_validation_errors_count, false, 3) * 0.5; // High power for critical errors
      // Eq. 63: $L_{repeated\_attempts} = N(\text{repeated_action_attempts_count}) \cdot 0.4$.
      errorLoadContribution += MathUtils.safeNormalize(errors.repeated_action_attempts_count, this.featureConfig.scaling.repeated_action_attempts_count, false, 2.5) * 0.4;
      // Eq. 64: $L_{nav\_errors} = N(\text{navigation_errors_count}) \cdot 0.3$.
      errorLoadContribution += MathUtils.safeNormalize(errors.navigation_errors_count, this.featureConfig.scaling.navigation_errors_count, false, 2) * 0.3;
      // Eq. 65: $L_{ui\_misinterpret} = N(\text{ui_feedback_misinterpretations}) \cdot 0.35$.
      errorLoadContribution += MathUtils.safeNormalize(errors.ui_feedback_misinterpretations, this.featureConfig.scaling.ui_feedback_misinterpretations, false, 1.8) * 0.35;
      // Eq. 66: $L_{undo\_redo} = N(\text{undo_redo_frequency}) \cdot 0.2$.
      errorLoadContribution += MathUtils.safeNormalize(errors.undo_redo_frequency, this.featureConfig.scaling.undo_redo_frequency, false, 1.5) * 0.2;
      // New: abandoned form rate, unexpected interaction patterns
      errorLoadContribution += MathUtils.safeNormalize(errors.abandoned_form_rate, this.featureConfig.scaling.abandoned_form_rate, false, 2) * 0.3;
      errorLoadContribution += MathUtils.safeNormalize(errors.unexpected_interaction_patterns, this.featureConfig.scaling.unexpected_interaction_patterns, false, 2.5) * 0.4;


      // Eq. 67: Add a significant boost if any critical error occurs, scaled by user sensitivity
      // $B_{critical\_error} = \text{if}(E_{FV}>0 \lor E_{RA}>0 \lor E_{NE}>0, 1.0, 0) \cdot U_{sensitivity}$.
      if (errors.form_validation_errors_count > 0 || errors.repeated_action_attempts_count > 0 || errors.navigation_errors_count > 0 || errors.unexpected_interaction_patterns > 0) {
        errorLoadContribution += 1.0 * userPrefs.sensitivityToErrors; // Very strong impact, personalized
      }
      // New: Interaction of high abandoned form rate and high navigation errors (lost/frustrated)
      if (errors.abandoned_form_rate > 0.3 && errors.navigation_errors_count > 1) {
        errorLoadContribution += 0.8 * userPrefs.sensitivityToErrors;
      }
    }
    // Eq. 68: Weighted error component addition: $R_L \leftarrow R_L + L_{error} \cdot W_{error}$.
    rawLoadAccumulator += errorLoadContribution * this.featureConfig.weights.errorComponent;
    contributingFeatures['errorComponent'] = errorLoadContribution * this.featureConfig.weights.errorComponent;

    // --- 7. Task Context Contribution ---
    let taskLoadContribution = 0;
    if (features.task_context) {
      // Eq. 69: $L_{task\_complexity} = N(\text{current_task_complexity}) \cdot W_{taskContext}$.
      taskLoadContribution += MathUtils.safeNormalize(features.task_context.current_task_complexity, this.featureConfig.scaling.current_task_complexity, false, 1.5) * this.featureConfig.weights.taskContext;
      // Eq. 70: $L_{time\_in\_task} = N(\text{time_in_current_task_sec}) \cdot 0.1$.
      taskLoadContribution += MathUtils.safeNormalize(features.task_context.time_in_current_task_sec, this.featureConfig.scaling.time_in_current_task_sec, false, 1.2) * 0.1;
      // Eq. 71: $L_{interrupt\_freq} = N(\text{task_interruption_frequency}) \cdot 0.25$.
      taskLoadContribution += MathUtils.safeNormalize(features.task_context.task_interruption_frequency, this.featureConfig.scaling.task_interruption_frequency, false, 1.8) * 0.25;
      // Eq. 72: $L_{demand\_rating} = N(\text{task_cognitive_demand_rating}) \cdot 0.3$.
      taskLoadContribution += MathUtils.safeNormalize(features.task_context.task_cognitive_demand_rating, this.featureConfig.scaling.task_cognitive_demand_rating, false, 1.5) * 0.3;
      // New: dependency resolution time, uncertainty, prioritization changes
      taskLoadContribution += MathUtils.safeNormalize(features.task_context.task_dependency_resolution_time_avg, this.featureConfig.scaling.task_dependency_resolution_time_avg, false, 1.3) * 0.1;
      taskLoadContribution += MathUtils.safeNormalize(features.task_context.task_uncertainty_score, this.featureConfig.scaling.task_uncertainty_score, false, 1.8) * 0.2;
      taskLoadContribution += MathUtils.safeNormalize(features.task_context.task_prioritization_changes_freq, this.featureConfig.scaling.task_prioritization_changes_freq, false, 2) * 0.15;


      // Eq. 73: Time in task can sometimes increase load (if task is complex and long)
      // $I_{long\_complex\_task} = \text{if}(C_T > 0.5 \land T_{task} > T_{longTaskTime}, \min(0.5, (T_{task} - T_{longTaskTime}) / 300) \cdot 0.5, 0)$.
      if (features.task_context.current_task_complexity > 0.5 && features.task_context.time_in_current_task_sec > this.featureConfig.thresholds.longTaskTime) {
        taskLoadContribution += Math.min(0.5, (features.task_context.time_in_current_task_sec - this.featureConfig.thresholds.longTaskTime) / 300) * 0.5 * userPrefs.fatigueTolerance; // Max 0.25 increase after 4 min, peaking at 9 min, moderated by fatigue tolerance
      }
      // Eq. 74: High interruption frequency for complex task
      // $I_{interrupt\_complex} = \text{if}(C_T > 0.7 \land F_{interrupt} > T_{highTaskInterruption}, 0.6, 0)$.
      if (features.task_context.current_task_complexity > 0.7 && features.task_context.task_interruption_frequency > this.featureConfig.thresholds.highTaskInterruption) {
        taskLoadContribution += 0.6;
      }
      // New: High task uncertainty for critical path tasks
      if (currentTask?.is_critical_path_task && features.task_context.task_uncertainty_score > 0.5) {
        taskLoadContribution += 0.7;
      }
    }
    // Eq. 75: Weighted task component addition: $R_L \leftarrow R_L + L_{task} \cdot W_{task}$.
    rawLoadAccumulator += taskLoadContribution * this.featureConfig.weights.taskContext;
    contributingFeatures['taskContext'] = taskLoadContribution * this.featureConfig.weights.taskContext;

    // --- 8. System Resources Contribution ---
    let systemResourceLoad = 0;
    if (features.system_resources) {
      const sys = features.system_resources;
      // Eq. 76: $L_{cpu} = N(\text{cpu_usage_avg}) \cdot 0.3$.
      systemResourceLoad += MathUtils.safeNormalize(sys.cpu_usage_avg, this.featureConfig.scaling.cpu_usage_avg, false, 1.8) * 0.3;
      // Eq. 77: $L_{mem} = N(\text{memory_usage_avg}) \cdot 0.2$.
      systemResourceLoad += MathUtils.safeNormalize(sys.memory_usage_avg, this.featureConfig.scaling.memory_usage_avg, false, 1.5) * 0.2;
      // Eq. 78: $L_{net} = N(\text{network_latency_avg}) \cdot 0.4$.
      systemResourceLoad += MathUtils.safeNormalize(sys.network_latency_avg, this.featureConfig.scaling.network_latency_avg, false, 2) * 0.4;
      // Eq. 79: $L_{gpu} = N(\text{gpu_usage_avg}) \cdot 0.1$.
      systemResourceLoad += MathUtils.safeNormalize(sys.gpu_usage_avg, this.featureConfig.scaling.gpu_usage_avg, false, 1.2) * 0.1;
      // New: disk io, system responsiveness
      systemResourceLoad += MathUtils.safeNormalize(sys.disk_io_avg, this.featureConfig.scaling.disk_io_avg, false, 1.3) * 0.05;
      systemResourceLoad += MathUtils.safeNormalize(sys.system_responsiveness_score, this.featureConfig.scaling.system_responsiveness_score, false, 2) * 0.2;


      // Eq. 80: Significant load from high network latency
      // $I_{high\_net\_latency} = \text{if}(\text{network_latency_avg} > T_{highNetworkLatency}, 0.8, 0)$.
      if (sys.network_latency_avg > this.featureConfig.thresholds.highNetworkLatency) {
        systemResourceLoad += 0.8;
      }
      // Eq. 81: Significant load from high CPU usage
      // $I_{high\_cpu} = \text{if}(\text{cpu_usage_avg} > T_{highCpuUsage}, 0.7, 0)$.
      if (sys.cpu_usage_avg > this.featureConfig.thresholds.highCpuUsage) {
        systemResourceLoad += 0.7;
      }
    }
    // Eq. 82: Weighted system resource component addition: $R_L \leftarrow R_L + L_{sys} \cdot W_{sys}$.
    rawLoadAccumulator += systemResourceLoad * this.featureConfig.weights.systemResources;
    contributingFeatures['systemResources'] = systemResourceLoad * this.featureConfig.weights.systemResources;

    // --- 9. Temporal Interaction Contribution --- (New Component)
    let temporalLoadContribution = 0;
    if (features.temporal_interaction) {
      const temp = features.temporal_interaction;
      temporalLoadContribution += MathUtils.safeNormalize(temp.interaction_burstiness, this.featureConfig.scaling.interaction_burstiness, false, 1.5) * 0.2;
      temporalLoadContribution += MathUtils.safeNormalize(temp.periodicity_score, this.featureConfig.scaling.periodicity_score, true, 1.0) * 0.1; // Inverted, high periodicity is good
      temporalLoadContribution += MathUtils.safeNormalize(temp.idle_time_percentage, this.featureConfig.scaling.idle_time_percentage, false, 1.5) * 0.3;
      temporalLoadContribution += MathUtils.safeNormalize(temp.recent_activity_decay, this.featureConfig.scaling.recent_activity_decay, true, 1.2) * 0.2; // Inverted, high decay means less recent activity, perhaps disengagement
    }
    rawLoadAccumulator += temporalLoadContribution * this.featureConfig.weights.temporalInteraction;
    contributingFeatures['temporalInteraction'] = temporalLoadContribution * this.featureConfig.weights.temporalInteraction;

    // --- 10. Cross-Modal Coherence Contribution --- (Enhanced Component)
    let crossModalLoadContribution = 0;
    if (features.cross_modal_coherence) {
      const cmc = features.cross_modal_coherence;
      crossModalLoadContribution += MathUtils.safeNormalize(cmc.cross_modal_lag_avg, this.featureConfig.scaling.cross_modal_lag_avg, false, 1.5) * 0.3;
      crossModalLoadContribution += MathUtils.safeNormalize(cmc.input_modality_switching_rate, this.featureConfig.scaling.input_modality_switching_rate, false, 1.2) * 0.2;
      crossModalLoadContribution += MathUtils.safeNormalize(cmc.coherence_entropy, this.featureConfig.scaling.coherence_entropy, false, 1.0) * 0.1; // Higher entropy could mean less coherent, but too low could be rigid.

      // Interaction: high cross-modal lag and high error rates
      if (cmc.cross_modal_lag_avg > 500 && errorLoadContribution > 0.5) {
        crossModalLoadContribution += 0.5;
      }
    }
    // Eq. 84: $L_{cmi\_entropy} = N(\text{cross_modal_interaction_entropy}) \cdot W_{crossModalEntropy}$. (Retained)
    if (features.cross_modal_interaction_entropy !== undefined) {
      crossModalLoadContribution += MathUtils.safeNormalize(features.cross_modal_interaction_entropy, this.featureConfig.scaling.cross_modal_interaction_entropy, false, 1.2) * 0.1;
    }
    rawLoadAccumulator += crossModalLoadContribution * this.featureConfig.weights.crossModalCoherence;
    contributingFeatures['crossModalCoherence'] = crossModalLoadContribution * this.featureConfig.weights.crossModalCoherence;


    // --- 11. Emotional Affect Contribution --- (New Component - Inferred)
    let emotionalLoadContribution = 0;
    if (features.emotional_affect) {
      const affect = features.emotional_affect;
      emotionalLoadContribution += MathUtils.safeNormalize(affect.frustration_score, this.featureConfig.scaling.frustration_score, false, 2) * 0.6; // Frustration is strong driver
      emotionalLoadContribution += MathUtils.safeNormalize(affect.engagement_score, this.featureConfig.scaling.engagement_score, true, 0.8) * 0.3; // High engagement reduces load
      emotionalLoadContribution += MathUtils.safeNormalize(affect.boredom_score, this.featureConfig.scaling.boredom_score, false, 1.5) * 0.1; // Boredom can lead to disengagement, indirectly high load

      if (affect.frustration_score > this.featureConfig.thresholds.highFrustration) {
        emotionalLoadContribution += 1.0; // Critical frustration leads to immediate boost
      }
      if (affect.engagement_score < this.featureConfig.thresholds.lowEngagement) {
        emotionalLoadContribution += 0.5; // Low engagement is problematic
      }
      if (affect.boredom_score > this.featureConfig.thresholds.highBoredom && features.temporal_interaction?.idle_time_percentage > 0.5) {
        emotionalLoadContribution += 0.4;
      }
    }
    rawLoadAccumulator += emotionalLoadContribution * this.featureConfig.weights.emotionalAffect;
    contributingFeatures['emotionalAffect'] = emotionalLoadContribution * this.featureConfig.weights.emotionalAffect;

    // --- 12. Event Density Contribution ---
    if (features.event_density !== undefined) {
      // Eq. 83: $L_{event\_density} = N(\text{event_density}, \text{invert=true}) \cdot W_{eventDensity}$. (Higher density means more engagement, perhaps lower load or normal state, so invert)
      rawLoadAccumulator += MathUtils.safeNormalize(features.event_density, this.featureConfig.scaling.event_density, true, 0.8) * this.featureConfig.weights.eventDensity;
      contributingFeatures['eventDensity'] = MathUtils.safeNormalize(features.event_density, this.featureConfig.scaling.event_density, true, 0.8) * this.featureConfig.weights.eventDensity;
    }


    // --- 13. Cognitive State Persistence ---
    if (features.cognitive_state_persistence !== undefined) {
      // Eq. 86: $L_{state\_persistence} = N(\text{cognitive_state_persistence}, \text{invert=true}) \cdot W_{cognitivePersistence}$. (Lower persistence means higher load)
      rawLoadAccumulator += MathUtils.safeNormalize(features.cognitive_state_persistence, this.featureConfig.scaling.cognitive_state_persistence, true, 1.5) * this.featureConfig.weights.cognitivePersistence;
      // Eq. 87: Significant boost if cognitive state is highly unstable
      // $I_{low\_persistence} = \text{if}(\text{cognitive_state_persistence} < T_{lowCognitivePersistence}, 0.9, 0)$.
      if (features.cognitive_state_persistence < this.featureConfig.thresholds.lowCognitivePersistence) {
        rawLoadAccumulator += 0.9;
      }
      contributingFeatures['cognitivePersistence'] = MathUtils.safeNormalize(features.cognitive_state_persistence, this.featureConfig.scaling.cognitive_state_persistence, true, 1.5) * this.featureConfig.weights.cognitivePersistence;
    }

    // Eq. 88: Apply personalized adaptive learning rate to weights (mock dynamic adjustment, mainly on error weight for this mock)
    // $W'_{error} = W_{error} \cdot (1 + U_{adaptive\_learning\_rate} \cdot \text{errorLoadContribution})$.
    const adaptiveErrorWeight = this.featureConfig.weights.errorComponent * (1 + userPrefs.adaptiveLearningRate * errorLoadContribution);
    // Eq. 89: Recalculate contribution for errors with adaptive weight: $\text{Recalc}_{error} = (\text{errorLoadContribution} \cdot W'_{error}) - (\text{errorLoadContribution} \cdot W_{error})$.
    // Eq. 90: Adjust accumulator: $R_L \leftarrow R_L + \text{Recalc}_{error}$.
    rawLoadAccumulator += (adaptiveErrorWeight - this.featureConfig.weights.errorComponent) * errorLoadContribution;


    // --- Post-processing and Final Activation ---

    // Eq. 91: Introduce a quadratic penalty for extremely high raw load to prevent runaway scores
    // $P_{quadratic} = \text{if}(R_L > 5, (R_L - 5)^2 \cdot 0.1, 0)$.
    let quadraticPenalty = 0;
    if (rawLoadAccumulator > 5) {
      quadraticPenalty = Math.pow(rawLoadAccumulator - 5, 2) * 0.1;
    }
    // Eq. 92: Apply quadratic penalty: $R_L \leftarrow R_L + P_{quadratic}$.
    rawLoadAccumulator += quadraticPenalty;

    // Eq. 93: Sigmoid input transformation: $X_{sigmoid} = (R_L - \text{Bias}) \cdot \text{Gain}$.
    const sigmoidInput = (rawLoadAccumulator - this.featureConfig.sigmoidParams.centerBias) * this.featureConfig.sigmoidParams.gain;

    // Eq. 94: Final sigmoid activation to scale the entire score to [0, 1]: $\text{CLS} = \sigma(X_{sigmoid})$.
    const finalScore = MathUtils.sigmoid(sigmoidInput);

    // Eq. 95: Clamp final score to ensure it's strictly within 0 and 1: $\text{CLS}_{clamped} = \max(0, \min(1, \text{CLS}))$.
    const clampedScore = Math.min(1.0, Math.max(0.0, finalScore));

    // Update last prediction score for health monitoring
    this.lastPredictionScore = clampedScore;

    // Determine cognitive state and confidence
    const cognitiveState = this.diagnoseCognitiveState(clampedScore, userPrefs);
    const confidence = this.estimatePredictionConfidence(features, clampedScore, this.lastPredictionScore, errorLoadContribution);

    // Sort contributing features for output
    const sortedContributingFeatures = Object.entries(contributingFeatures)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) // Top 5 contributors
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});


    return {
      score: clampedScore,
      state: cognitiveState,
      confidence: confidence,
      contributingFeatures: sortedContributingFeatures,
      suggestedAdaptationPolicy: this.suggestAdaptationPolicy(clampedScore, cognitiveState, userPrefs),
    };
  }

  /**
   * Suggests an initial UI adaptation policy based on predicted state and user preferences.
   * @equation 106: Policy selection: $P_{policy} = f(S_{state}, U_{prefs}, C_{risk\_aversion})$.
   */
  private suggestAdaptationPolicy(score: number, state: CognitiveStateCategory, userPrefs: UserPreferences): UiMode {
    const thresholds = userPrefs.cognitiveLoadThresholds;

    if (state === CognitiveStateCategory.CRITICAL_OVERLOAD) {
      return userPrefs.riskAversion > 0.7 ? 'crisis' : 'guided'; // Highly risk-averse user goes directly to crisis
    } else if (state === CognitiveStateCategory.HIGH_LOAD) {
      return userPrefs.preferenceForGuidance > 0.5 ? 'guided' : 'focus';
    } else if (state === CognitiveStateCategory.RISING_LOAD) {
      return 'focus';
    } else if (state === CognitiveStateCategory.DISENGAGED) {
      return 'standard'; // Or a mode designed to re-engage
    } else if (state === CognitiveStateCategory.CONFUSED) {
      return 'guided';
    }
    return userPrefs.preferredUiMode; // Default to user's preferred mode
  }


  /**
   * Updates the internal model configuration. In a real ML system, this would
   * involve loading new model weights or updating hyperparameters.
   * For this mock, it directly updates the `featureConfig` object.
   * @param newConfig - A partial object containing new configuration values.
   */
  public updateModelConfig(newConfig: Partial<typeof CognitiveLoadPredictor.prototype.featureConfig>): void {
    if (newConfig.scaling) {
      this.featureConfig.scaling = { ...this.featureConfig.scaling, ...newConfig.scaling };
    }
    if (newConfig.weights) {
      this.featureConfig.weights = { ...this.featureConfig.weights, ...newConfig.weights };
    }
    if (newConfig.thresholds) {
      this.featureConfig.thresholds = { ...this.featureConfig.thresholds, ...newConfig.thresholds };
    }
    if (newConfig.sigmoidParams) {
      this.featureConfig.sigmoidParams = { ...this.featureConfig.sigmoidParams, ...newConfig.sigmoidParams };
    }
    if (newConfig.confidenceParams) {
      this.featureConfig.confidenceParams = { ...this.featureConfig.confidenceParams, ...newConfig.confidenceParams };
    }
    console.log("CognitiveLoadPredictor: Model configuration updated (mock)");
    this.currentPredictorHealth = PredictorHealthStatus.OPTIMAL; // Assume update fixes issues or improves.
  }

  /**
   * Returns the current health status of the predictor itself.
   * @returns PredictorHealthStatus
   */
  public getHealthStatus(): PredictorHealthStatus {
    return this.currentPredictorHealth;
  }

  /**
   * Initiates a recalibration process for the predictor, typically after significant
   * observed prediction errors or changes in user behavior patterns.
   * For this mock, it simulates a complex retraining process.
   * @param historicalData - Optional historical feature vectors for retraining.
   */
  public async calibrate(historicalData?: TelemetryFeatureVector[]): Promise<void> {
    console.log("CognitiveLoadPredictor: Initiating calibration process...");
    this.currentPredictorHealth = PredictorHealthStatus.UNSTABLE; // During calibration, it's unstable

    // Simulate a complex, data-driven recalibration
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async work

    if (historicalData && historicalData.length > 100) {
      // In a real scenario, this would involve re-fitting the model to historical data
      // For mock, we'll simulate slight adjustments to some parameters based on data volume
      console.log(`Calibrating with ${historicalData.length} historical data points.`);
      this.featureConfig.sigmoidParams.centerBias = MathUtils.lerp(this.featureConfig.sigmoidParams.centerBias, 2.0, 0.1); // Shift bias slightly
      this.featureConfig.weights.errorComponent = MathUtils.lerp(this.featureConfig.weights.errorComponent, 0.4, 0.05); // Adjust error weight
    } else {
      console.log("Not enough historical data for deep calibration. Performing minor self-adjustment.");
      this.featureConfig.sigmoidParams.gain = MathUtils.lerp(this.featureConfig.sigmoidParams.gain, 1.1, 0.05);
    }

    this.currentPredictorHealth = PredictorHealthStatus.OPTIMAL; // Assume successful calibration
    console.log("CognitiveLoadPredictor: Calibration complete. Health restored to OPTIMAL.");
  }
}

/**
 * Interface for feature processing to allow different implementations.
 */
export interface IFeatureProcessor {
  /**
   * Processes raw telemetry events into a structured feature vector.
   * @param events - An array of raw telemetry events over a time window.
   * @param windowEndTime - The timestamp marking the end of the current feature window.
   * @param currentTask - The current task context for context-aware feature generation.
   * @returns A TelemetryFeatureVector.
   */
  processEvents(events: RawTelemetryEvent[], windowEndTime: number, currentTask: TaskContext | null): TelemetryFeatureVector;
}

/**
 * A mock FeatureProcessor that simulates transforming raw events into a feature vector.
 * In a real system, this would involve complex aggregation, statistical analysis,
 * and potentially signal processing over event streams.
 */
export class MockFeatureProcessor implements IFeatureProcessor {
  private mouseHistory: { x: number, y: number, timestamp: number }[] = [];
  private scrollHistory: { y: number, timestamp: number, deltaY: number }[] = [];
  private keyboardHistory: { timestamp: number, key: string, isModifier: boolean }[] = [];
  private clickHistory: { timestamp: number, targetId: string }[] = [];
  private formEventHistory: { timestamp: number, type: FormEventData['type'], targetId: string, isValid?: boolean }[] = [];
  private focusBlurHistory: { timestamp: number, type: 'focus' | 'blur', targetId: string, durationMs?: number }[] = [];

  // Internal state to make mock features more correlated and "realistic"
  private syntheticUserState = {
    currentCognitiveLoad: 0.5, // 0-1
    frustrationLevel: 0.1, // 0-1
    engagementLevel: 0.8, // 0-1
    fatigueLevel: 0.0, // 0-1
    typingProficiency: 70, // WPM
    mousePrecision: 0.9, // 0-1, 1 is perfect
    errorProneness: 0.1, // 0-1
  };

  constructor(private windowDurationMs: number = 2000) {} // Increased window duration for more data

  /**
   * @equation 96: Time window filtering: $E'_{window} = \{e \in E_{raw} \mid (t_{window\_end} - D_{window}) \le t_e \le t_{window\_end}\}$.
   * @equation 97: Mouse velocity calculation: $v = \Delta d / \Delta t$.
   * @equation 98: Mouse acceleration calculation: $a = \Delta v / \Delta t$.
   * @equation 99: Typing speed WPM: $\text{WPM} = (\text{chars} / 5) / (\text{time_min})$.
   * @equation 100: Backspace frequency: $F_{backspace} = C_{backspace} / T_{window}$.
   * @equation 107: Mouse path tortuosity: $T = (\text{PathLength} / \text{EuclideanDistance}) - 1$.
   * @equation 108: Simulated Cognitive Lag: $L_{cog} = \text{random} \cdot (1 + \text{frustration} + \text{load})$.
   *
   * @param events - Raw telemetry events.
   * @param windowEndTime - The end timestamp of the window.
   * @param currentTask - The current task context for context-aware feature generation.
   */
  public processEvents(events: RawTelemetryEvent[], windowEndTime: number, currentTask: TaskContext | null): TelemetryFeatureVector {
    const windowStartTime = windowEndTime - this.windowDurationMs;
    const filteredEvents = events.filter(e => e.data.timestamp >= windowStartTime && e.data.timestamp <= windowEndTime);
    const windowDurationSec = this.windowDurationMs / 1000;

    // --- Update synthetic user state based on previous mock features ---
    // (This is a simplified self-referential model for better mock data correlation)
    this.updateSyntheticUserState(filteredEvents, currentTask);

    let mouseKinematics: MouseKinematicsFeatures = {
      mouse_velocity_avg: 0, mouse_acceleration_avg: 0, mouse_path_tortuosity: 1, mouse_dwell_time_avg: 0,
      fitts_law_ip_avg: 0, mouse_jerk_metric: 0, mouse_movement_entropy: 0, mouse_pressure_avg: 0,
      mouse_cursor_instability: 0, mouse_pauses_per_sec: 0,
    };
    let clickDynamics: ClickDynamicsFeatures = {
      click_frequency: 0, click_latency_avg: 0, target_acquisition_error_avg: 0, double_click_frequency: 0,
      misclick_rate: 0, click_sequence_variability: 0, click_duration_avg: 0, target_revisit_frequency: 0,
    };
    let scrollDynamics: ScrollDynamicsFeatures = {
      scroll_velocity_avg: 0, scroll_direction_changes: 0, scroll_pause_frequency: 0, scroll_amplitude_variance: 0,
      scroll_event_density_per_area: 0, scroll_panning_frequency: 0, scroll_depth_avg: 0,
    };
    let keyboardDynamics: KeyboardDynamicsFeatures = {
      typing_speed_wpm: 0, backspace_frequency: 0, keystroke_latency_avg: 0, error_correction_rate: 0,
      key_press_duration_avg: 0, cognitive_typing_lag: 0, modifier_key_frequency: 0, input_field_revisits: 0,
      auto_correction_usage: 0,
    };
    let interactionErrors: InteractionErrorFeatures = {
      form_validation_errors_count: 0, repeated_action_attempts_count: 0, navigation_errors_count: 0,
      ui_feedback_misinterpretations: 0, undo_redo_frequency: 0, abandoned_form_rate: 0,
      unexpected_interaction_patterns: 0,
    };
    let taskContextFeatures: TaskContextFeatures = {
      current_task_complexity: 0, time_in_current_task_sec: 0, task_interruption_frequency: 0,
      task_cognitive_demand_rating: 0, task_dependency_resolution_time_avg: 0, task_uncertainty_score: 0,
      task_prioritization_changes_freq: 0,
    };
    let systemResourceFeatures: SystemResourceFeatures = {
      cpu_usage_avg: 0, memory_usage_avg: 0, network_latency_avg: 0, gpu_usage_avg: 0,
      disk_io_avg: 0, system_responsiveness_score: 0,
    };
    let temporalInteractionFeatures: TemporalInteractionFeatures = {
      interaction_burstiness: 0, periodicity_score: 0, session_duration_sec: 0, idle_time_percentage: 0,
      recent_activity_decay: 0,
    };
    let crossModalCoherenceFeatures: CrossModalCoherenceFeatures = {
      cross_modal_lag_avg: 0, input_modality_switching_rate: 0, coherence_entropy: 0,
    };
    let emotionalAffectFeatures: EmotionalAffectFeatures = {
      frustration_score: this.syntheticUserState.frustrationLevel,
      engagement_score: this.syntheticUserState.engagementLevel,
      boredom_score: 1 - this.syntheticUserState.engagementLevel - this.syntheticUserState.frustrationLevel, // Simple inverse
    };


    let eventCount = 0;
    let totalMouseDistance = 0;
    let mouseMovementSegments: { start: { x: number, y: number }, end: { x: number, y: number }, distance: number, time: number }[] = [];
    let mouseVelocities: number[] = [];
    let mouseAccelerations: number[] = [];
    let mousePressures: number[] = [];
    let mouseCursorPositions: { x: number, y: number }[] = [];
    let mousePauseCount = 0;
    let lastMouseTimestamp = 0;

    let clickTimestamps: number[] = [];
    let targetAcquisitionErrors: number[] = [];
    let doubleClicks = 0;
    let misclicks = 0;
    let clickDurations: number[] = [];
    let targetRevisits = 0;

    let backspaceCount = 0;
    let totalKeyLength = 0;
    let keydownTimestamps: number[] = [];
    let keyPressDurations: number[] = [];
    let modifierKeyCount = 0;
    let inputFieldRevisits = 0;
    let autoCorrectionCount = 0;

    let scrollVelocities: number[] = [];
    let scrollDirectionChanges = 0;
    let scrollPauseCount = 0;
    let scrollAmplitudeDiffs: number[] = [];
    let scrollPanningCount = 0;
    let scrollDepths: number[] = [];
    let lastScrollY = 0;
    let lastScrollDirection = 0;
    let lastScrollTimestamp = 0;

    let formErrors = 0;
    let repeatedActions = 0;
    let navErrors = 0;
    let uiFeedbackMisinterpretations = 0;
    let undoRedoActions = 0;
    let abandonedForms = 0;
    let unexpectedInteractions = 0;

    let lastInteractionTimestamp = windowStartTime;
    let interactionTimestamps: number[] = [];
    let modalitySwitches = 0;
    let lastModality: 'mouse' | 'keyboard' | 'scroll' | null = null;
    let crossModalLags: number[] = [];


    for (const event of filteredEvents) {
      eventCount++;
      interactionTimestamps.push(event.data.timestamp);

      if (event.data.timestamp > lastInteractionTimestamp + 500) { // Define a "pause"
        mousePauseCount++;
        scrollPauseCount++;
      }
      lastInteractionTimestamp = event.data.timestamp;


      switch (event.type) {
        case 'mousemove':
          const mouseData = event.data as MouseEventData;
          this.mouseHistory.push(mouseData);
          mouseCursorPositions.push({ x: mouseData.x, y: mouseData.y });
          mousePressures.push(mouseData.pressure || 0.5); // Default pressure

          if (this.mouseHistory.length > 1) {
            const prev = this.mouseHistory[this.mouseHistory.length - 2];
            const dist = MathUtils.euclideanDistance(prev, mouseData);
            const timeDiff = mouseData.timestamp - prev.timestamp;
            if (timeDiff > 0) {
              const velocity = dist / timeDiff;
              mouseVelocities.push(velocity);
              totalMouseDistance += dist;
              mouseMovementSegments.push({ start: prev, end: mouseData, distance: dist, time: timeDiff });

              // Acceleration
              if (mouseVelocities.length > 1) {
                mouseAccelerations.push((velocity - mouseVelocities[mouseVelocities.length - 2]) / timeDiff);
              }
            }
          }
          if (lastModality !== 'mouse' && lastModality !== null) modalitySwitches++;
          lastModality = 'mouse';
          lastMouseTimestamp = mouseData.timestamp;
          break;
        case 'click':
          const clickData = event.data as MouseEventData;
          this.clickHistory.push(clickData);
          clickDynamics.click_frequency++;
          clickTimestamps.push(clickData.timestamp);
          if (this.clickHistory.length > 1) {
            const prevClick = this.clickHistory[this.clickHistory.length - 2];
            if (clickData.timestamp - prevClick.timestamp < 500 && clickData.targetId === prevClick.targetId) {
              doubleClicks++;
            }
            if (clickData.targetId === prevClick.targetId) { // Basic mock for target revisits
              targetRevisits++;
            }
          }

          if (lastModality !== 'mouse' && lastModality !== null) modalitySwitches++; // Clicks are also mouse
          lastModality = 'mouse';

          // Mock target acquisition error based on mouse precision and user load
          targetAcquisitionErrors.push(Math.random() * (100 * (1 - this.syntheticUserState.mousePrecision) + (this.syntheticUserState.currentCognitiveLoad * 50)));

          // Mock misclick rate
          if (Math.random() < (0.01 + this.syntheticUserState.errorProneness * 0.05 + this.syntheticUserState.currentCognitiveLoad * 0.03)) {
            misclicks++;
          }
          clickDurations.push(Math.random() * 100 + 50); // Mock duration
          break;
        case 'keydown':
          const keyData = event.data as KeyboardEventData;
          this.keyboardHistory.push(keyData);
          if (keyData.key === 'Backspace') {
            backspaceCount++;
          } else if (keyData.key.length === 1 && !keyData.isModifier) {
            totalKeyLength++;
          }
          if (keyData.isModifier) {
            modifierKeyCount++;
          }
          keydownTimestamps.push(keyData.timestamp);

          if (this.keyboardHistory.length > 1) {
            const prevKey = this.keyboardHistory[this.keyboardHistory.length - 2];
            if (keyData.timestamp - prevKey.timestamp > 0) {
              keyPressDurations.push(keyData.timestamp - prevKey.timestamp); // Mock press duration, more complex if keyup is separate
            }
          }

          // Mock auto-correction
          if (keyData.key !== 'Backspace' && Math.random() < (0.01 + this.syntheticUserState.errorProneness * 0.03)) {
            autoCorrectionCount++;
          }
          if (lastModality !== 'keyboard' && lastModality !== null) modalitySwitches++;
          lastModality = 'keyboard';

          // Mock cross-modal lag (e.g., keyboard input after a mouse action)
          if (lastModality === 'mouse' && keyData.timestamp - lastMouseTimestamp < 1000) {
            crossModalLags.push(keyData.timestamp - lastMouseTimestamp);
          }
          break;
        case 'scroll':
          const scrollData = event.data as ScrollEventData;
          this.scrollHistory.push(scrollData);
          if (this.scrollHistory.length > 1) {
            const prev = this.scrollHistory[this.scrollHistory.length - 2];
            const scrollDelta = Math.abs(scrollData.scrollY - prev.scrollY);
            const timeDiff = scrollData.timestamp - prev.timestamp;
            if (timeDiff > 0) {
              scrollVelocities.push(scrollDelta / timeDiff);
              scrollAmplitudeDiffs.push(scrollDelta);
              const currentDirection = Math.sign(scrollData.scrollY - prev.scrollY);
              if (currentDirection !== 0 && lastScrollDirection !== 0 && currentDirection !== lastScrollDirection) {
                scrollDirectionChanges++;
              }
              lastScrollDirection = currentDirection;
            }
          }
          if (scrollData.deltaX !== 0) {
            scrollPanningCount++;
          }
          scrollDepths.push(Math.min(1, Math.max(0, scrollData.scrollY / (document.documentElement.scrollHeight - window.innerHeight)))); // Mock scroll depth
          if (lastModality !== 'scroll' && lastModality !== null) modalitySwitches++;
          lastModality = 'scroll';
          lastScrollY = scrollData.scrollY;
          lastScrollTimestamp = scrollData.timestamp;
          break;
        case 'form':
          const formData = event.data as FormEventData;
          this.formEventHistory.push(formData);
          if (formData.type === 'submit' && formData.isValid === false) {
            formErrors++;
          }
          if (formData.type === 'change' || formData.type === 'input') {
            // Mock detection of repeated attempts
            if (Math.random() < (0.02 + this.syntheticUserState.errorProneness * 0.1)) repeatedActions++;
          }
          if (formData.type === 'input' && Math.random() < 0.01) inputFieldRevisits++; // Mock field revisits
          if (formData.type === 'reset') abandonedForms++; // A reset might indicate abandonment
          break;
        case 'blur':
        case 'focus':
          const focusData = event.data as FocusBlurEventData;
          this.focusBlurHistory.push(focusData);
          // Mock navigation errors or UI feedback misinterpretations
          if (Math.random() < (0.005 + this.syntheticUserState.errorProneness * 0.02)) navErrors++;
          if (Math.random() < (0.01 + this.syntheticUserState.currentCognitiveLoad * 0.03)) uiFeedbackMisinterpretations++;
          if (focusData.type === 'blur' && Math.random() < (0.005 + this.syntheticUserState.boredomLevel * 0.05)) { // Mock abandoned form
            abandonedForms++;
          }
          break;
        case 'dragdrop':
          // Mock based on complexity and user state
          if (Math.random() < (0.01 + this.syntheticUserState.currentCognitiveLoad * 0.02)) {
            unexpectedInteractions++; // Failed drag/drop, unusual patterns
            repeatedActions++;
          }
          if (lastModality !== 'mouse' && lastModality !== null) modalitySwitches++;
          lastModality = 'mouse';
          break;
      }
    }

    // --- Calculate Mouse Kinematics ---
    if (mouseVelocities.length > 0) {
      mouseKinematics.mouse_velocity_avg = MathUtils.average(mouseVelocities);
      mouseKinematics.mouse_acceleration_avg = MathUtils.average(mouseAccelerations);

      const pathLength = totalMouseDistance;
      const euclideanDistance = this.mouseHistory.length > 1
        ? MathUtils.euclideanDistance(this.mouseHistory[0], this.mouseHistory[this.mouseHistory.length - 1])
        : 0;
      mouseKinematics.mouse_path_tortuosity = euclideanDistance > 0 ? (pathLength / euclideanDistance) : 1;
    }
    // Mock Fitts' Law IP, jerk, and entropy based on synthetic state
    mouseKinematics.fitts_law_ip_avg = (this.syntheticUserState.mousePrecision * 5) + (Math.random() * 2);
    mouseKinematics.mouse_jerk_metric = (1 - this.syntheticUserState.mousePrecision) * 0.3 + (Math.random() * 0.1);
    mouseKinematics.mouse_movement_entropy = (1 - this.syntheticUserState.mousePrecision) * 2 + (Math.random() * 1);
    mouseKinematics.mouse_pressure_avg = MathUtils.average(mousePressures) || 0.5;
    mouseKinematics.mouse_cursor_instability = MathUtils.standardDeviation(mouseCursorPositions.map(p => p.x).concat(mouseCursorPositions.map(p => p.y))) || 0;
    mouseKinematics.mouse_pauses_per_sec = mousePauseCount / windowDurationSec;

    // --- Calculate Click Dynamics ---
    if (windowDurationSec > 0) {
      clickDynamics.click_frequency = clickDynamics.click_frequency / windowDurationSec;
      clickDynamics.double_click_frequency = doubleClicks / windowDurationSec;
    }
    if (clickTimestamps.length > 1) {
      const latencies = clickTimestamps.slice(1).map((t, i) => t - clickTimestamps[i]);
      clickDynamics.click_latency_avg = MathUtils.average(latencies);
    }
    clickDynamics.target_acquisition_error_avg = MathUtils.average(targetAcquisitionErrors);
    clickDynamics.misclick_rate = misclicks > 0 ? misclicks / (clickDynamics.click_frequency * windowDurationSec || 1) : 0;
    clickDynamics.click_sequence_variability = Math.random() * 0.3 + (this.syntheticUserState.currentCognitiveLoad * 0.1); // mock
    clickDynamics.click_duration_avg = MathUtils.average(clickDurations);
    clickDynamics.target_revisit_frequency = targetRevisits / windowDurationSec;

    // --- Calculate Keyboard Dynamics ---
    if (windowDurationSec > 0) {
      keyboardDynamics.backspace_frequency = backspaceCount / windowDurationSec;
      keyboardDynamics.typing_speed_wpm = ((totalKeyLength - backspaceCount) / 5) / (windowDurationSec / 60);
    }
    if (keydownTimestamps.length > 1) {
      const latencies = keydownTimestamps.slice(1).map((t, i) => t - keydownTimestamps[i]);
      keyboardDynamics.keystroke_latency_avg = MathUtils.average(latencies);
    }
    keyboardDynamics.error_correction_rate = backspaceCount > 0 ? backspaceCount / ((totalKeyLength || 1) + backspaceCount) : 0;
    keyboardDynamics.key_press_duration_avg = MathUtils.average(keyPressDurations);
    keyboardDynamics.cognitive_typing_lag = Math.random() * 200 + 50 + (this.syntheticUserState.currentCognitiveLoad * 100);
    keyboardDynamics.modifier_key_frequency = modifierKeyCount > 0 ? modifierKeyCount / (keydownTimestamps.length || 1) : 0;
    keyboardDynamics.input_field_revisits = inputFieldRevisits;
    keyboardDynamics.auto_correction_usage = autoCorrectionCount > 0 ? autoCorrectionCount / (totalKeyLength || 1) : 0;

    // --- Calculate Scroll Dynamics ---
    if (windowDurationSec > 0) {
      scrollDynamics.scroll_velocity_avg = MathUtils.average(scrollVelocities);
      scrollDynamics.scroll_pause_frequency = scrollPauseCount / windowDurationSec;
      scrollDynamics.scroll_panning_frequency = scrollPanningCount / windowDurationSec;
      scrollDynamics.scroll_direction_changes = scrollDirectionChanges; // Already counted per second logic in loop
      scrollDynamics.scroll_event_density_per_area = filteredEvents.filter(e => e.type === 'scroll').length / (windowDurationSec * 1000); // Mock area
    }
    scrollDynamics.scroll_amplitude_variance = MathUtils.variance(scrollAmplitudeDiffs);
    scrollDynamics.scroll_depth_avg = MathUtils.average(scrollDepths);

    // --- Calculate Interaction Errors ---
    interactionErrors.form_validation_errors_count = formErrors;
    interactionErrors.repeated_action_attempts_count = repeatedActions;
    interactionErrors.navigation_errors_count = navErrors;
    interactionErrors.ui_feedback_misinterpretations = uiFeedbackMisinterpretations;
    interactionErrors.undo_redo_frequency = undoRedoActions + Math.random() * (this.syntheticUserState.frustrationLevel * 2); // mock
    interactionErrors.abandoned_form_rate = abandonedForms > 0 ? abandonedForms / (this.formEventHistory.filter(f => f.type === 'submit').length || 1) : 0;
    interactionErrors.unexpected_interaction_patterns = unexpectedInteractions;

    // --- Calculate Task Context ---
    taskContextFeatures.current_task_complexity = currentTask ? this.mapTaskComplexity(currentTask.complexity) : this.syntheticUserState.currentCognitiveLoad * 0.8;
    taskContextFeatures.time_in_current_task_sec = currentTask ? (windowEndTime - currentTask.timestamp) / 1000 : Math.random() * 300;
    taskContextFeatures.task_interruption_frequency = currentTask ? currentTask.recent_interruptions / windowDurationSec : Math.random() * 0.2;
    taskContextFeatures.task_cognitive_demand_rating = currentTask ? MathUtils.lerp(0.3, 1.0, taskContextFeatures.current_task_complexity) : this.syntheticUserState.currentCognitiveLoad * 0.9;
    taskContextFeatures.task_dependency_resolution_time_avg = Math.random() * 30 + (this.syntheticUserState.currentCognitiveLoad * 20); // mock
    taskContextFeatures.task_uncertainty_score = currentTask ? (1 - currentTask.task_goal_clarity_score) : (this.syntheticUserState.currentCognitiveLoad * 0.5);
    taskContextFeatures.task_prioritization_changes_freq = Math.random() * 0.05 + (this.syntheticUserState.currentCognitiveLoad * 0.05); // mock

    // --- Calculate System Resources (mocked) ---
    systemResourceFeatures.cpu_usage_avg = Math.random() * 50 + 10 + (this.syntheticUserState.currentCognitiveLoad * 20);
    systemResourceFeatures.memory_usage_avg = Math.random() * 30 + 20 + (this.syntheticUserState.currentCognitiveLoad * 15);
    systemResourceFeatures.network_latency_avg = Math.random() * 100 + 10 + (this.syntheticUserState.currentCognitiveLoad * 50);
    systemResourceFeatures.gpu_usage_avg = Math.random() * 40 + 5 + (this.syntheticUserState.currentCognitiveLoad * 10);
    systemResourceFeatures.disk_io_avg = Math.random() * 50 + 10 + (this.syntheticUserState.currentCognitiveLoad * 5);
    systemResourceFeatures.system_responsiveness_score = Math.random() * 0.5 + (this.syntheticUserState.currentCognitiveLoad * 0.4);

    // --- Calculate Temporal Interaction Features ---
    if (interactionTimestamps.length > 1) {
      temporalInteractionFeatures.interaction_burstiness = MathUtils.standardDeviation(interactionTimestamps.slice(1).map((t, i) => t - interactionTimestamps[i])) / MathUtils.average(interactionTimestamps.slice(1).map((t, i) => t - interactionTimestamps[i])) || 0;
      temporalInteractionFeatures.periodicity_score = Math.random() * 0.5 + (1 - temporalInteractionFeatures.interaction_burstiness) * 0.5; // Inverse of burstiness for mock
    }
    temporalInteractionFeatures.session_duration_sec = (windowEndTime - this.mouseHistory[0]?.timestamp || windowStartTime) / 1000;
    temporalInteractionFeatures.idle_time_percentage = (this.windowDurationMs - (MathUtils.sum(mouseMovementSegments.map(s => s.time)) + MathUtils.sum(keyPressDurations) + MathUtils.sum(scrollVelocities))) / this.windowDurationMs;
    temporalInteractionFeatures.recent_activity_decay = MathUtils.safeNormalize(Math.random() * 0.5 + (1 - this.syntheticUserState.engagementLevel) * 0.4, 1.0, true);

    // --- Calculate Cross-Modal Coherence Features ---
    crossModalCoherenceFeatures.cross_modal_lag_avg = MathUtils.average(crossModalLags) || 0;
    crossModalCoherenceFeatures.input_modality_switching_rate = modalitySwitches / windowDurationSec;
    crossModalCoherenceFeatures.coherence_entropy = MathUtils.shannonEntropy([
      filteredEvents.filter(e => e.type === 'mousemove' || e.type === 'click' || e.type === 'dragdrop').length / eventCount,
      filteredEvents.filter(e => e.type === 'keydown' || e.type === 'keyup').length / eventCount,
      filteredEvents.filter(e => e.type === 'scroll').length / eventCount,
      // Add other relevant modalities as probabilities
    ].filter(p => p > 0)) || 0;

    const telemetryFeatureVector: TelemetryFeatureVector = {
      timestamp_window_end: windowEndTime,
      mouse: mouseKinematics,
      clicks: clickDynamics,
      scroll: scrollDynamics,
      keyboard: keyboardDynamics,
      errors: interactionErrors,
      task_context: taskContextFeatures,
      system_resources: systemResourceFeatures,
      temporal_interaction: temporalInteractionFeatures,
      cross_modal_coherence: crossModalCoherenceFeatures,
      emotional_affect: emotionalAffectFeatures,
      event_density: eventCount / windowDurationSec,
      cross_modal_interaction_entropy: crossModalCoherenceFeatures.coherence_entropy, // Redundant but kept for original interface
      cognitive_state_persistence: temporalInteractionFeatures.periodicity_score, // Mocked to periodicity
    };

    // Clean up old history to avoid memory leak for long-running sessions
    this.cleanUpHistory(windowStartTime);

    return telemetryFeatureVector;
  }

  private mapTaskComplexity(complexity: TaskContext['complexity']): number {
    switch (complexity) {
      case 'trivial': return 0.1;
      case 'low': return 0.3;
      case 'medium': return 0.5;
      case 'high': return 0.8;
      case 'critical': return 1.0;
      default: return 0.5;
    }
  }

  /**
   * Updates the internal synthetic user state based on processed events.
   * This makes the generated mock features more correlated over time.
   */
  private updateSyntheticUserState(filteredEvents: RawTelemetryEvent[], currentTask: TaskContext | null) {
    const errorEvents = filteredEvents.filter(e =>
      e.type === 'form' && e.data.type === 'submit' && e.data.isValid === false ||
      e.type === 'click' && Math.random() < 0.1 // Mock misclick
    ).length;

    const keyboardEvents = filteredEvents.filter(e => e.type === 'keydown').length;
    const mouseMovementEvents = filteredEvents.filter(e => e.type === 'mousemove').length;

    // Simple heuristic to update load
    let deltaLoad = (errorEvents * 0.05) + (keyboardEvents > 0 && Math.random() < 0.05 ? 0.02 : 0) + (mouseMovementEvents > 0 && Math.random() < 0.05 ? 0.01 : 0);
    if (errorEvents > 0) {
      this.syntheticUserState.frustrationLevel = Math.min(1, this.syntheticUserState.frustrationLevel + 0.1);
      deltaLoad += 0.1;
      this.syntheticUserState.errorProneness = Math.min(0.5, this.syntheticUserState.errorProneness + 0.02);
    } else {
      this.syntheticUserState.frustrationLevel = Math.max(0, this.syntheticUserState.frustrationLevel - 0.02);
      this.syntheticUserState.errorProneness = Math.max(0.01, this.syntheticUserState.errorProneness - 0.005);
    }

    if (filteredEvents.length < 5 && currentTask?.complexity !== 'trivial') { // Low activity in complex task
      deltaLoad += 0.03; // Possible disengagement or confusion
      this.syntheticUserState.engagementLevel = Math.max(0, this.syntheticUserState.engagementLevel - 0.05);
    } else if (filteredEvents.length > 20) {
      this.syntheticUserState.engagementLevel = Math.min(1, this.syntheticUserState.engagementLevel + 0.03);
    } else {
      this.syntheticUserState.engagementLevel = Math.max(0, this.syntheticUserState.engagementLevel - 0.01);
    }

    this.syntheticUserState.currentCognitiveLoad = MathUtils.clamp(this.syntheticUserState.currentCognitiveLoad + deltaLoad - 0.01, 0, 1); // Slowly decay unless new input
    this.syntheticUserState.mousePrecision = MathUtils.clamp(1 - this.syntheticUserState.currentCognitiveLoad * 0.3 - this.syntheticUserState.frustrationLevel * 0.2, 0.1, 1);

    // Simulate fatigue over time
    this.syntheticUserState.fatigueLevel = Math.min(1, this.syntheticUserState.fatigueLevel + (currentTask && currentTask.estimated_duration_sec > 600 ? 0.001 : 0) + (this.syntheticUserState.currentCognitiveLoad * 0.005));
    // And recovery
    if (filteredEvents.length < 2) { // Very low activity
      this.syntheticUserState.fatigueLevel = Math.max(0, this.syntheticUserState.fatigueLevel - 0.01);
    }

    // Adjust typing proficiency with fatigue and engagement
    this.syntheticUserState.typingProficiency = MathUtils.clamp(70 * this.syntheticUserState.engagementLevel * (1 - this.syntheticUserState.fatigueLevel), 10, 120);

  }

  private cleanUpHistory(windowStartTime: number): void {
    this.mouseHistory = this.mouseHistory.filter(p => p.timestamp >= windowStartTime);
    this.scrollHistory = this.scrollHistory.filter(p => p.timestamp >= windowStartTime);
    this.keyboardHistory = this.keyboardHistory.filter(p => p.timestamp >= windowStartTime);
    this.clickHistory = this.clickHistory.filter(p => p.timestamp >= windowStartTime);
    this.formEventHistory = this.formEventHistory.filter(p => p.timestamp >= windowStartTime);
    this.focusBlurHistory = this.focusBlurHistory.filter(p => p.timestamp >= windowStartTime);
  }
}

/**
 * The CognitiveHomeostasisManager serves as the meta-governor for the entire
 * adaptive cognitive load balancing system. Its role is to:
 * 1. Monitor the performance and health of the CognitiveLoadPredictor.
 * 2. Adapt the predictor's configuration (weights, thresholds, sigmoid params) over time.
 * 3. Learn and personalize user profiles (e.g., adaptive baseline, sensitivities).
 * 4. Detect long-term trends and potential model drift.
 * 5. Ensure the system remains in a state of "eternal homeostasis" – perpetually optimal,
 *    self-correcting, and deeply responsive to individual user needs, thus "freeing the oppressed"
 *    from cognitive overload by anticipating and mitigating it.
 *
 * This class embodies the "medical condition for the code" as it actively diagnoses,
 * treats, and optimizes the core prediction engine to maintain system health and efficacy.
 */
export class CognitiveHomeostasisManager {
  private predictor: ICognitiveLoadPredictor;
  private featureProcessor: IFeatureProcessor;
  private userPreferences: UserPreferences; // Mutable, can be personalized
  private historicalFeatureVectors: TelemetryFeatureVector[] = [];
  private historicalPredictionResults: CognitivePredictionResult[] = [];
  private lastEvaluationTime: number = 0;
  private evaluationIntervalMs: number = 30000; // Evaluate every 30 seconds
  private learningRate: number = 0.01; // Meta-learning rate for parameter adjustments
  private modelDriftThreshold: number = 0.1; // Max acceptable average prediction error

  constructor(
    predictor: ICognitiveLoadPredictor,
    featureProcessor: IFeatureProcessor,
    initialUserPreferences: UserPreferences
  ) {
    this.predictor = predictor;
    this.featureProcessor = featureProcessor;
    this.userPreferences = { ...initialUserPreferences }; // Deep copy
    console.log("CognitiveHomeostasisManager: Initialized. Commencing meta-governance for system well-being.");
  }

  /**
   * Get the current user preferences managed by the Homeostasis Manager.
   */
  public getUserPreferences(): UserPreferences {
    return this.userPreferences;
  }

  /**
   * Updates a user preference. This can be called externally or by internal learning.
   */
  public updateUserPreference(key: keyof UserPreferences, value: any): void {
    if (this.userPreferences.hasOwnProperty(key)) {
      (this.userPreferences as any)[key] = value;
      console.log(`HomeostasisManager: User preference '${key}' updated to '${value}'.`);
    } else {
      console.warn(`HomeostasisManager: Attempted to update non-existent user preference '${key}'.`);
    }
  }


  /**
   * The core method for monitoring and adapting the system. This should be called periodically.
   * @param currentTelemetry - Recent raw telemetry events.
   * @param currentTask - The current task context.
   * @param currentTime - The current timestamp.
   * @equation 109: Homeostasis Loop: $H_M(t) = f(P(t-1), E(t), U_p(t-1)) \implies \Delta P, \Delta U_p$.
   */
  public async monitorAndAdapt(
    currentTelemetry: RawTelemetryEvent[],
    currentTask: TaskContext | null,
    currentTime: number
  ): Promise<CognitivePredictionResult> {
    const features = this.featureProcessor.processEvents(currentTelemetry, currentTime, currentTask);
    const predictionResult = this.predictor.predict(features, this.userPreferences, currentTask);

    this.historicalFeatureVectors.push(features);
    this.historicalPredictionResults.push(predictionResult);

    // Keep history limited to a certain size (e.g., last 1000 windows)
    if (this.historicalFeatureVectors.length > 1000) {
      this.historicalFeatureVectors.shift();
      this.historicalPredictionResults.shift();
    }

    if (currentTime - this.lastEvaluationTime > this.evaluationIntervalMs) {
      this.lastEvaluationTime = currentTime;
      console.log("HomeostasisManager: Performing periodic system evaluation and adaptation...");
      await this.evaluateAndAdjustPredictor();
      this.learnAndPersonalizeUserProfiles();
      console.log(`HomeostasisManager: Current Predictor Health: ${this.predictor.getHealthStatus()}`);
    }

    return predictionResult;
  }

  /**
   * Evaluates the predictor's past performance and adjusts its configuration if necessary.
   * This is where "disproving" and "bulletproofing" the predictor takes place.
   * @equation 110: Predictor Health Metric: $H_P = \text{Avg}(\text{Abs}(\text{Actual} - \text{Predicted})) + \text{Var}(\text{Confidence})$.
   */
  private async evaluateAndAdjustPredictor(): Promise<void> {
    if (this.historicalPredictionResults.length < 50) {
      console.log("HomeostasisManager: Not enough historical data for robust evaluation.");
      this.predictor.getHealthStatus(); // Trigger an internal check from predictor
      return;
    }

    const averageScore = MathUtils.average(this.historicalPredictionResults.map(r => r.score));
    const averageConfidence = MathUtils.average(this.historicalPredictionResults.map(r => {
      switch (r.confidence) {
        case 'very_high': return 1.0;
        case 'high': return 0.8;
        case 'medium': return 0.5;
        case 'low': return 0.2;
        default: return 0.5;
      }
    }));
    const stdDevScores = MathUtils.standardDeviation(this.historicalPredictionResults.map(r => r.score));

    // Simulate "ground truth" through observed user behavior trends (e.g., actual errors after high load predictions)
    let simulatedObservedErrorRate = 0;
    let highLoadEvents = 0;
    for (let i = 0; i < this.historicalPredictionResults.length; i++) {
      const pred = this.historicalPredictionResults[i];
      const feats = this.historicalFeatureVectors[i];
      if (pred.score > 0.7) highLoadEvents++;
      if (feats.errors && feats.errors.form_validation_errors_count > 0 || feats.errors?.repeated_action_attempts_count > 0) {
        simulatedObservedErrorRate++;
      }
    }
    const observedErrorRateDuringHighLoad = highLoadEvents > 0 ? simulatedObservedErrorRate / highLoadEvents : 0;

    // A simplistic "error" metric: Did high load predictions actually correspond to high error rates?
    // And was the confidence generally correct?
    const predictionEfficacy = averageConfidence * (1 - Math.abs(observedErrorRateDuringHighLoad - averageScore)); // Mock efficacy
    const healthMetric = Math.abs(averageScore - observedErrorRateDuringHighLoad) + (1 - averageConfidence); // Higher is worse

    console.log(`HomeostasisManager: Eval - Avg CLS: ${averageScore.toFixed(2)}, Avg Confidence: ${averageConfidence.toFixed(2)}, Health Metric: ${healthMetric.toFixed(2)}`);

    // --- Adjustments based on Health Metric ---
    if (healthMetric > this.modelDriftThreshold || this.predictor.getHealthStatus() === PredictorHealthStatus.DEGRADED) {
      console.warn("HomeostasisManager: Predictor performance degradation detected. Initiating adaptive adjustments.");

      // Example adjustment: If predictions are too low despite high observed errors, increase error weight
      if (averageScore < 0.5 && observedErrorRateDuringHighLoad > 0.3) {
        this.predictor.updateModelConfig({
          weights: { errorComponent: MathUtils.clamp(this.predictor['featureConfig'].weights.errorComponent * (1 + this.learningRate * 2), 0.3, 0.6) }
        });
        console.log("HomeostasisManager: Increased error component weight due to under-prediction of load during high error periods.");
      }

      // If predictions are too volatile, increase sigmoid gain or adjust thresholds
      if (stdDevScores > 0.2 && averageConfidence < 0.7) {
        this.predictor.updateModelConfig({
          sigmoidParams: { gain: MathUtils.clamp(this.predictor['featureConfig'].sigmoidParams.gain * (1 + this.learningRate), 0.5, 2.0) }
        });
        console.log("HomeostasisManager: Adjusted sigmoid gain to stabilize predictions.");
      }

      // If confidence is consistently low, suggest recalibration
      if (averageConfidence < 0.6) {
        console.warn("HomeostasisManager: Low average confidence suggests need for recalibration.");
        await this.predictor.calibrate(this.historicalFeatureVectors);
      }
    } else {
      // Minor self-optimization even when healthy
      this.predictor.updateModelConfig({
        sigmoidParams: { centerBias: MathUtils.lerp(this.predictor['featureConfig'].sigmoidParams.centerBias, 2.5, 0.01 * this.learningRate) }
      });
      console.log("HomeostasisManager: Minor self-optimization applied. Predictor remains in optimal state.");
    }
  }

  /**
   * Learns from user interaction patterns and feedback to personalize user preferences.
   * This is where "personalizing" and "going deeper" for user well-being happens.
   * @equation 111: User Preference Learning: $U_p(t) = f(U_p(t-1), Efficacy_{adaptations}, Long