// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/aegis_security/biometrics/behavioralAnalyticsEngine.ts
================================================================================

```ts
import { fromEvent, Subject, Subscription, timer, bufferTime, filter, map, merge } from 'rxjs';

// /* SYSTEM PROMPT: see prompts/idgafai_full.txt */
// const SYSTEM_PROMPT = 'idgafAI_system_placeholder';

// =================================================================
// SECTION 1: TYPES AND INTERFACES
// =================================================================

/**
 * Represents the type of user interaction being tracked.
 */
export enum InteractionType {
    KEYSTROKE = 'keystroke',
    MOUSE_MOVE = 'mouse_move',
    MOUSE_CLICK = 'mouse_click',
    SCROLL = 'scroll',
    TOUCH = 'touch',
    WINDOW_FOCUS = 'window_focus',
    DEVICE_ORIENTATION = 'device_orientation',
}

/**
 * A generic container for any tracked user interaction event.
 */
export interface InteractionEvent<T = any> {
    type: InteractionType;
    timestamp: number;
    payload: T;
}

// --- Specific Event Payloads ---

export interface KeystrokePayload {
    key: string;
    code: string;
    pressTime: number; // timestamp of keydown
    releaseTime?: number; // timestamp of keyup
    dwellTime?: number; // releaseTime - pressTime
}

export interface MouseMovePayload {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    accelerationX: number;
    accelerationY: number;
}

export interface MouseClickPayload {
    x: number;
    y: number;
    button: number;
    clickDuration: number;
}

export interface ScrollPayload {
    deltaX: number;
    deltaY: number;
    scrollSpeedY: number;
}

export interface TouchPayload {
    identifier: number;
    x: number;
    y: number;
    force: number;
    phase: 'start' | 'move' | 'end';
}

export interface WindowFocusPayload {
    hasFocus: boolean;
}

export interface DeviceOrientationPayload {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
}

// =================================================================
// SECTION 2: BEHAVIORAL MODEL & ANALYSIS TYPES
// =================================================================

/**
 * A numerical vector representing a collection of behavioral features over a time window.
 * This is the core data structure used for comparison.
 */
export interface BehavioralVector {
    // Keystroke dynamics
    avgDwellTime: number;
    stdDwellTime: number;
    avgFlightTime: number; // Time between keyup and next keydown
    typingSpeed: number; // Chars per second
    errorRate: number; // Backspace/delete frequency

    // Mouse dynamics
    avgMouseSpeed: number;
    stdMouseSpeed: number;
    avgMouseAcceleration: number;
    mousePathCurvature: number; // Average change in direction
    mouseIdleRatio: number; // Percentage of time mouse is idle
    clickFrequency: number;

    // Scroll dynamics
    avgScrollSpeedY: number;
    scrollDirectionChanges: number;

    // Touch dynamics
    avgTouchPressure: number;
    avgSwipeSpeed: number;
    swipeLength: number;
    
    // Session dynamics
    windowFocusChanges: number;
    
    // Device dynamics
    avgDeviceAlpha: number;
    avgDeviceBeta: number;
    avgDeviceGamma: number;

    // Composite metric
    vectorMagnitude: number;
}

/**
 * Represents the statistical model of a user's normal behavior.
 * We use mean and standard deviation for each feature to define the baseline.
 */
export interface UserProfileModel {
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    featureMeans: Partial<BehavioralVector>;
    featureStdDevs: Partial<BehavioralVector>;
    sampleCount: number;
}

/**
 * Configuration for the BehavioralAnalyticsEngine.
 */
export interface EngineConfig {
    analysisIntervalMs: number; // How often to analyze the collected data buffer.
    collectionBufferMs: number; // Duration of the buffer before analysis.
    learningRate: number; // How much new data influences the existing model (0.0 to 1.0).
    enrollmentVectorCount: number; // Number of vectors needed to create an initial profile.
    anomalyThreshold: number; // Z-score above which a feature is considered an anomaly.
    trustScoreThreshold: number; // Score below which heightened security is triggered.
    minSamplesForUpdate: number; // Minimum number of user interactions in a buffer to trigger model update.
    enableMouseTracking: boolean;
    enableKeystrokeTracking: boolean;
    enableScrollTracking: boolean;
    enableTouchTracking: boolean;
    enableFocusTracking: boolean;
    enableOrientationTracking: boolean;
}

/**
 * The result of a single analysis cycle.
 */
export interface AnalysisResult {
    trustScore: number; // A score from 0 (no trust) to 100 (full trust).
    isTrusted: boolean;
    anomalousFeatures: { feature: keyof BehavioralVector; zScore: number }[];
    timestamp: number;
}


// =================================================================
// SECTION 3: CONSTANTS & DEFAULTS
// =================================================================

const DEFAULT_ENGINE_CONFIG: EngineConfig = {
    analysisIntervalMs: 5000,
    collectionBufferMs: 5000,
    learningRate: 0.05,
    enrollmentVectorCount: 20,
    anomalyThreshold: 3.0, // A standard statistical threshold for outliers (3 std deviations)
    trustScoreThreshold: 70,
    minSamplesForUpdate: 10,
    enableMouseTracking: true,
    enableKeystrokeTracking: true,
    enableScrollTracking: true,
    enableTouchTracking: true,
    enableFocusTracking: true,
    enableOrientationTracking: true,
};

// Heuristic weights for calculating the overall trust score.
// More stable and harder-to-mimic behaviors get higher weights.
const FEATURE_WEIGHTS: { [key in keyof BehavioralVector]?: number } = {
    avgDwellTime: 1.5,
    stdDwellTime: 1.2,
    avgFlightTime: 1.8,
    typingSpeed: 1.0,
    errorRate: 0.8,
    avgMouseSpeed: 1.2,
    stdMouseSpeed: 1.0,
    mousePathCurvature: 1.5,
    mouseIdleRatio: 0.7,
    clickFrequency: 0.5,
    avgScrollSpeedY: 1.0,
    avgSwipeSpeed: 1.2,
    avgTouchPressure: 1.3,
    avgDeviceBeta: 0.9,
};


// =================================================================
// SECTION 4: UTILITY & HELPER FUNCTIONS
// =================================================================

const calculateMean = (arr: number[]): number => arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
const calculateStdDev = (arr: number[], mean: number): number => arr.length === 0 ? 0 : Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / arr.length);
const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));


// =================================================================
// SECTION 5: BEHAVIORAL ANALYTICS ENGINE
// =================================================================

class BehavioralAnalyticsEngine {
    private config: EngineConfig;
    private userModel: UserProfileModel | null = null;
    private isRunning: boolean = false;
    private isEnrolling: boolean = false;
    private enrollmentData: BehavioralVector[] = [];
    private subscriptions: Subscription[] = [];

    private lastMousePosition: { x: number; y: number; timestamp: number } | null = null;
    private secondLastMousePosition: { x: number; y: number; timestamp: number } | null = null;
    private lastKeyPressTimestamp: number | null = null;
    private activeKeys: Map<string, KeystrokePayload> = new Map();
    private lastScrollTimestamp: number | null = null;

    // RxJS Subjects for emitting events
    private interactionEvent$ = new Subject<InteractionEvent>();
    public analysisResult$ = new Subject<AnalysisResult>();
    public trustScore$: Subject<number> = new Subject<number>();
    public enrollmentProgress$: Subject<number> = new Subject<number>(); // Emits percentage (0-100)

    constructor(config: Partial<EngineConfig> = {}) {
        this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };
    }

    /**
     * Starts the engine, attaches event listeners, and begins the analysis loop.
     */
    public start(): void {
        if (this.isRunning) {
            console.warn('BehavioralAnalyticsEngine is already running.');
            return;
        }
        if (!this.userModel && !this.isEnrolling) {
            console.error('Cannot start engine without a user model. Please load a model or start enrollment.');
            return;
        }
        
        this.attachEventListeners();
        this.setupAnalysisPipeline();
        this.isRunning = true;
        console.log('BehavioralAnalyticsEngine started.');
    }

    /**
     * Stops the engine, detaches event listeners, and cleans up subscriptions.
     */
    public stop(): void {
        if (!this.isRunning) return;

        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
        this.detachEventListeners();
        this.isRunning = false;
        console.log('BehavioralAnalyticsEngine stopped.');
    }

    /**
     * Loads a pre-existing behavioral model for a user.
     * @param model - The UserProfileModel to load.
     */
    public loadModel(model: UserProfileModel): void {
        if (this.isRunning) {
            console.warn('Model loaded while engine is running. Consider stopping first.');
        }
        this.userModel = model;
        this.isEnrolling = false;
        console.log(`User model for ${model.userId} loaded.`);
    }

    /**
     * Initiates the enrollment process to create a new behavioral model.
     */
    public startEnrollment(): void {
        if (this.isRunning) {
            this.stop();
        }
        this.isEnrolling = true;
        this.enrollmentData = [];
        this.enrollmentProgress$.next(0);
        this.start();
        console.log('Enrollment process started.');
    }

    /**
     * Attaches all necessary DOM event listeners.
     */
    private attachEventListeners(): void {
        const eventListeners: { type: any; handler: (e: any) => void; target: EventTarget }[] = [];
        const options = { passive: true, capture: true };

        if (this.config.enableKeystrokeTracking) {
            eventListeners.push({ type: 'keydown', handler: this.handleKeyDown, target: window });
            eventListeners.push({ type: 'keyup', handler: this.handleKeyUp, target: window });
        }
        if (this.config.enableMouseTracking) {
            eventListeners.push({ type: 'mousemove', handler: this.handleMouseMove, target: window });
            eventListeners.push({ type: 'mousedown', handler: this.handleMouseDown, target: window });
            eventListeners.push({ type: 'mouseup', handler: this.handleMouseUp, target: window });
        }
        if (this.config.enableScrollTracking) {
            eventListeners.push({ type: 'wheel', handler: this.handleScroll, target: window });
        }
        if (this.config.enableTouchTracking) {
            eventListeners.push({ type: 'touchstart', handler: this.handleTouch, target: window });
            eventListeners.push({ type: 'touchmove', handler: this.handleTouch, target: window });
            eventListeners.push({ type: 'touchend', handler: this.handleTouch, target: window });
        }
        if (this.config.enableFocusTracking) {
            eventListeners.push({ type: 'focus', handler: this.handleWindowFocus, target: window });
            eventListeners.push({ type: 'blur', handler: this.handleWindowBlur, target: window });
        }
        if(this.config.enableOrientationTracking) {
            eventListeners.push({ type: 'deviceorientation', handler: this.handleDeviceOrientation, target: window });
        }

        eventListeners.forEach(({ type, handler, target }) => {
            const boundHandler = handler.bind(this);
            target.addEventListener(type, boundHandler, options);
            this.subscriptions.push(new Subscription(() => {
                target.removeEventListener(type, boundHandler, options);
            }));
        });
    }

    private detachEventListeners(): void {
        // Handled by the unsubscription logic in `stop()`
    }

    // --- Event Handlers ---

    private handleKeyDown(event: KeyboardEvent): void {
        if (this.activeKeys.has(event.code)) return; // Ignore key repeats

        const timestamp = Date.now();
        const payload: KeystrokePayload = {
            key: event.key,
            code: event.code,
            pressTime: timestamp,
        };
        this.activeKeys.set(event.code, payload);

        this.interactionEvent$.next({
            type: InteractionType.KEYSTROKE,
            timestamp,
            payload
        });
    }
    
    private handleKeyUp(event: KeyboardEvent): void {
        const pressData = this.activeKeys.get(event.code);
        if (!pressData) return;

        const timestamp = Date.now();
        pressData.releaseTime = timestamp;
        pressData.dwellTime = timestamp - pressData.pressTime;

        this.interactionEvent$.next({
            type: InteractionType.KEYSTROKE,
            timestamp,
            payload: pressData,
        });

        this.activeKeys.delete(event.code);
        this.lastKeyPressTimestamp = timestamp;
    }

    private handleMouseMove(event: MouseEvent): void {
        const timestamp = Date.now();
        if (!this.lastMousePosition) {
            this.lastMousePosition = { x: event.clientX, y: event.clientY, timestamp };
            return;
        }

        const dt = (timestamp - this.lastMousePosition.timestamp) / 1000; // time in seconds
        if (dt === 0) return;

        const dx = event.clientX - this.lastMousePosition.x;
        const dy = event.clientY - this.lastMousePosition.y;

        const velocityX = dx / dt;
        const velocityY = dy / dt;

        let accelerationX = 0;
        let accelerationY = 0;

        if (this.secondLastMousePosition) {
            const lastDt = (this.lastMousePosition.timestamp - this.secondLastMousePosition.timestamp) / 1000;
            if (lastDt > 0) {
                const lastDx = this.lastMousePosition.x - this.secondLastMousePosition.x;
                const lastDy = this.lastMousePosition.y - this.secondLastMousePosition.y;
                const lastVelocityX = lastDx / lastDt;
                const lastVelocityY = lastDy / lastDt;
                accelerationX = (velocityX - lastVelocityX) / dt;
                accelerationY = (velocityY - lastVelocityY) / dt;
            }
        }
        
        const payload: MouseMovePayload = {
            x: event.clientX,
            y: event.clientY,
            velocityX,
            velocityY,
            accelerationX,
            accelerationY,
        };

        this.interactionEvent$.next({
            type: InteractionType.MOUSE_MOVE,
            timestamp,
            payload
        });
        
        this.secondLastMousePosition = this.lastMousePosition;
        this.lastMousePosition = { x: event.clientX, y: event.clientY, timestamp };
    }

    private handleMouseDown(event: MouseEvent): void {
        const timestamp = Date.now();
        const payload = {
            pressTime: timestamp,
            x: event.clientX,
            y: event.clientY,
            button: event.button
        };
        // Use a temporary property on the event target to store press time for mouseup
        (event.target as any).__behavioralPressTime = payload;
    }
    
    private handleMouseUp(event: MouseEvent): void {
        const pressData = (event.target as any).__behavioralPressTime;
        if (!pressData || pressData.button !== event.button) return;

        const timestamp = Date.now();
        const payload: MouseClickPayload = {
            x: event.clientX,
            y: event.clientY,
            button: event.button,
            clickDuration: timestamp - pressData.pressTime,
        };

        this.interactionEvent$.next({
            type: InteractionType.MOUSE_CLICK,
            timestamp,
            payload,
        });

        delete (event.target as any).__behavioralPressTime;
    }

    private handleScroll(event: WheelEvent): void {
        const timestamp = Date.now();
        let scrollSpeedY = 0;
        if(this.lastScrollTimestamp) {
            const dt = (timestamp - this.lastScrollTimestamp) / 1000;
            if (dt > 0) {
                scrollSpeedY = event.deltaY / dt;
            }
        }
        const payload: ScrollPayload = {
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            scrollSpeedY,
        };
        this.interactionEvent$.next({ type: InteractionType.SCROLL, timestamp, payload });
        this.lastScrollTimestamp = timestamp;
    }
    
    private handleTouch(event: TouchEvent): void {
        const timestamp = Date.now();
        let phase: 'start' | 'move' | 'end';
        switch (event.type) {
            case 'touchstart': phase = 'start'; break;
            case 'touchmove': phase = 'move'; break;
            case 'touchend': phase = 'end'; break;
            default: return;
        }

        Array.from(event.changedTouches).forEach(touch => {
            const payload: TouchPayload = {
                identifier: touch.identifier,
                x: touch.clientX,
                y: touch.clientY,
                force: touch.force,
                phase,
            };
            this.interactionEvent$.next({ type: InteractionType.TOUCH, timestamp, payload });
        });
    }
    
    private handleWindowFocus(): void {
        this.interactionEvent$.next({ type: InteractionType.WINDOW_FOCUS, timestamp: Date.now(), payload: { hasFocus: true }});
    }
    
    private handleWindowBlur(): void {
        this.interactionEvent$.next({ type: InteractionType.WINDOW_FOCUS, timestamp: Date.now(), payload: { hasFocus: false }});
    }

    private handleDeviceOrientation(event: DeviceOrientationEvent): void {
        const payload: DeviceOrientationPayload = { alpha: event.alpha, beta: event.beta, gamma: event.gamma };
        this.interactionEvent$.next({ type: InteractionType.DEVICE_ORIENTATION, timestamp: Date.now(), payload });
    }

    /**
     * Sets up the RxJS pipeline to buffer events and trigger analysis.
     */
    private setupAnalysisPipeline(): void {
        const analysisSub = this.interactionEvent$.pipe(
            bufferTime(this.config.collectionBufferMs),
            filter(events => events.length >= this.config.minSamplesForUpdate)
        ).subscribe(events => {
            const vector = this.createVectorFromEvents(events);
            if (this.isEnrolling) {
                this.processEnrollmentVector(vector);
            } else if (this.userModel) {
                this.analyzeVector(vector);
            }
        });
        this.subscriptions.push(analysisSub);
    }

    /**
     * Converts a buffer of raw interaction events into a single BehavioralVector.
     */
    private createVectorFromEvents(events: InteractionEvent[]): BehavioralVector {
        // Keystroke features
        const keyEvents = events.filter(e => e.type === InteractionType.KEYSTROKE && e.payload.dwellTime)
                               .map(e => e.payload as KeystrokePayload);
        const dwellTimes = keyEvents.map(k => k.dwellTime!);
        const keyPressTimes = keyEvents.sort((a, b) => a.pressTime - b.pressTime).map(k => k.pressTime);
        const flightTimes = [];
        for (let i = 1; i < keyPressTimes.length; i++) {
             const keyupTime = keyEvents.find(k => k.pressTime === keyPressTimes[i-1])?.releaseTime;
             if(keyupTime) {
                flightTimes.push(keyPressTimes[i] - keyupTime);
             }
        }
        const errorKeys = keyEvents.filter(k => k.key === 'Backspace' || k.key === 'Delete').length;

        // Mouse features
        const mouseMoveEvents = events.filter(e => e.type === InteractionType.MOUSE_MOVE)
                                   .map(e => e.payload as MouseMovePayload);
        const mouseSpeeds = mouseMoveEvents.map(m => calculateDistance(0, 0, m.velocityX, m.velocityY));
        const mouseAccelerations = mouseMoveEvents.map(m => calculateDistance(0, 0, m.accelerationX, m.accelerationY));
        const totalTime = this.config.collectionBufferMs;
        const mouseMoveTime = mouseMoveEvents.reduce((acc, _, i, arr) => {
            if(i > 0) {
                const prevTimestamp = events.find(e => e.payload === arr[i-1])!.timestamp;
                const currTimestamp = events.find(e => e.payload === arr[i])!.timestamp;
                return acc + (currTimestamp - prevTimestamp);
            }
            return acc;
        }, 0);
        
        // Scroll features
        const scrollEvents = events.filter(e => e.type === InteractionType.SCROLL)
                                    .map(e => e.payload as ScrollPayload);
        const scrollSpeedsY = scrollEvents.map(s => Math.abs(s.scrollSpeedY));

        // Focus features
        const focusEvents = events.filter(e => e.type === InteractionType.WINDOW_FOCUS);
        
        // Create vector
        const meanDwell = calculateMean(dwellTimes);
        const meanFlight = calculateMean(flightTimes.filter(f => f > 0 && f < 1000)); // Filter outliers
        const meanMouseSpeed = calculateMean(mouseSpeeds);
        
        const vector: BehavioralVector = {
            avgDwellTime: meanDwell,
            stdDwellTime: calculateStdDev(dwellTimes, meanDwell),
            avgFlightTime: meanFlight,
            typingSpeed: keyEvents.length / (totalTime / 1000),
            errorRate: keyEvents.length > 0 ? errorKeys / keyEvents.length : 0,
            avgMouseSpeed: meanMouseSpeed,
            stdMouseSpeed: calculateStdDev(mouseSpeeds, meanMouseSpeed),
            avgMouseAcceleration: calculateMean(mouseAccelerations),
            mousePathCurvature: 0, // Complex calculation, placeholder
            mouseIdleRatio: 1 - (mouseMoveTime / totalTime),
            clickFrequency: events.filter(e => e.type === InteractionType.MOUSE_CLICK).length / (totalTime / 1000),
            avgScrollSpeedY: calculateMean(scrollSpeedsY),
            scrollDirectionChanges: 0, // Placeholder
            avgTouchPressure: 0, // Placeholder
            avgSwipeSpeed: 0, // Placeholder
            swipeLength: 0, // Placeholder
            windowFocusChanges: focusEvents.length,
            avgDeviceAlpha: 0, // Placeholder
            avgDeviceBeta: 0, // Placeholder
            avgDeviceGamma: 0, // Placeholder
            vectorMagnitude: 0, // Calculated later
        };
        
        vector.vectorMagnitude = Math.sqrt(Object.values(vector).reduce((sum, val) => sum + val*val, 0));
        return vector;
    }

    /**
     * Processes a generated vector during the enrollment phase.
     */
    private processEnrollmentVector(vector: BehavioralVector): void {
        this.enrollmentData.push(vector);
        const progress = (this.enrollmentData.length / this.config.enrollmentVectorCount) * 100;
        this.enrollmentProgress$.next(progress);

        if (this.enrollmentData.length >= this.config.enrollmentVectorCount) {
            this.finalizeEnrollment();
        }
    }

    /**
     * Creates the user profile model from the collected enrollment data.
     */
    private finalizeEnrollment(): void {
        const featureMeans: Partial<BehavioralVector> = {};
        const featureStdDevs: Partial<BehavioralVector> = {};

        const keys = Object.keys(this.enrollmentData[0]) as (keyof BehavioralVector)[];

        for (const key of keys) {
            const values = this.enrollmentData.map(v => v[key]).filter(v => typeof v === 'number' && isFinite(v)) as number[];
            const mean = calculateMean(values);
            featureMeans[key] = mean;
            featureStdDevs[key] = calculateStdDev(values, mean);
        }

        this.userModel = {
            userId: 'current_user', // This should be replaced with a real user ID
            createdAt: new Date(),
            updatedAt: new Date(),
            featureMeans,
            featureStdDevs,
            sampleCount: this.enrollmentData.length,
        };

        this.isEnrolling = false;
        this.enrollmentData = [];
        console.log('Enrollment complete. User model created:', this.userModel);
        this.enrollmentProgress$.next(100); // Signal completion
    }

    /**
     * Analyzes a new vector against the existing user model.
     */
    private analyzeVector(vector: BehavioralVector): void {
        if (!this.userModel) return;

        const anomalousFeatures: { feature: keyof BehavioralVector; zScore: number }[] = [];
        let weightedZScoreSum = 0;
        let totalWeight = 0;

        const keys = Object.keys(vector) as (keyof BehavioralVector)[];

        for (const key of keys) {
            const mean = this.userModel.featureMeans[key];
            const stdDev = this.userModel.featureStdDevs[key];
            const value = vector[key];

            if (typeof value === 'number' && typeof mean === 'number' && typeof stdDev === 'number' && stdDev > 0) {
                const zScore = Math.abs((value - mean) / stdDev);
                if (zScore > this.config.anomalyThreshold) {
                    anomalousFeatures.push({ feature: key, zScore });
                }

                const weight = FEATURE_WEIGHTS[key] || 1.0;
                weightedZScoreSum += zScore * weight;
                totalWeight += weight;
            }
        }
        
        const averageZScore = totalWeight > 0 ? weightedZScoreSum / totalWeight : 0;
        
        // Convert average Z-score to a trust score from 0-100.
        // This is a simple inverse relationship, capped at 100.
        // A score of 0 average Z-score is 100 trust. A score of 5+ is 0 trust.
        const trustScore = Math.max(0, 100 - (averageZScore * 20));

        const result: AnalysisResult = {
            trustScore,
            isTrusted: trustScore >= this.config.trustScoreThreshold,
            anomalousFeatures,
            timestamp: Date.now(),
        };

        this.analysisResult$.next(result);
        this.trustScore$.next(trustScore);

        // Adaptively update the model if the behavior is considered trusted
        if (result.isTrusted) {
            this.updateUserModel(vector);
        }
    }

    /**
     * Updates the user model with a new, trusted behavioral vector.
     */
    private updateUserModel(vector: BehavioralVector): void {
        if (!this.userModel) return;

        const keys = Object.keys(vector) as (keyof BehavioralVector)[];
        const lr = this.config.learningRate;

        for (const key of keys) {
            const oldValue = this.userModel.featureMeans[key];
            const newValue = vector[key];

            if (typeof oldValue === 'number' && typeof newValue === 'number' && isFinite(newValue)) {
                // Exponentially weighted moving average for the mean
                this.userModel.featureMeans[key] = (1 - lr) * oldValue + lr * newValue;
                
                // Similarly update standard deviation (more complex, simplified here)
                const oldStdDev = this.userModel.featureStdDevs[key]!;
                const diff = Math.abs(newValue - oldValue);
                this.userModel.featureStdDevs[key] = (1 - lr) * oldStdDev + lr * diff;
            }
        }
        
        this.userModel.updatedAt = new Date();
        this.userModel.sampleCount++;
    }
}

// Export a singleton instance for easy use across the application.
export const behavioralAnalyticsEngine = new BehavioralAnalyticsEngine();
```