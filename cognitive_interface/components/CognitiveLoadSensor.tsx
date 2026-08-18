// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/cognitive_interface/components/CognitiveLoadSensor.tsx
================================================================================

import React, { useRef, useEffect, useState, useCallback, createContext, useContext, useMemo } from 'react';

// --- Global Configuration Constants ---
/**
 * @constant {number} COGNITIVE_LOAD_DECAY_FACTOR - Exponential decay factor for older interactions.
 * A higher value means older interactions retain more influence. Typically between 0.5 and 1.
 * This influences how quickly the load score reacts to changes in user activity.
 */
const COGNITIVE_LOAD_DECAY_FACTOR: number = 0.85;

/**
 * @constant {number} INTERACTION_WINDOW_MS - The time window (in milliseconds) within which interactions are considered "recent".
 * Interactions outside this window have minimal impact. Set to 15 seconds.
 */
const INTERACTION_WINDOW_MS: number = 15000;

/**
 * @constant {number} REPORT_INTERVAL_MS - The frequency (in milliseconds) at which cognitive load metrics are calculated and reported.
 * A lower value provides more real-time updates but consumes more CPU. Set to 1 second.
 */
const REPORT_INTERVAL_MS: number = 1000;

/**
 * @constant {number} MOUSE_MOVE_THROTTLE_MS - Throttle delay (in milliseconds) for mouse movement events.
 * Prevents overwhelming the system with too many mousemove events. Set to 50ms.
 */
const MOUSE_MOVE_THROTTLE_MS: number = 50;

/**
 * @constant {number} SCROLL_THROTTLE_MS - Throttle delay (in milliseconds) for scroll events.
 * Prevents excessive scroll event processing. Set to 50ms.
 */
const SCROLL_THROTTLE_MS: number = 50;

/**
 * @constant {number} MAX_INTERACTION_HISTORY - The maximum number of individual interaction events to store in memory.
 * Helps prevent memory leaks by discarding the oldest events once the limit is reached. Set to 2000 events.
 */
const MAX_INTERACTION_HISTORY: number = 2000;

/**
 * @constant {number} TYPING_SPEED_SAMPLE_SIZE - The number of recent key presses used to estimate typing speed.
 * A larger sample provides a smoother average, a smaller sample is more reactive. Set to 10 characters.
 */
const TYPING_SPEED_SAMPLE_SIZE: number = 10;

/**
 * @constant {number} IDLE_THRESHOLD_MS - The duration (in milliseconds) after which a user is considered idle if no interactions occur.
 * Used to differentiate active mouse movements from casual cursor presence. Set to 5 seconds.
 */
const IDLE_THRESHOLD_MS: number = 5000;

/**
 * @constant {number} MIN_INTERACTION_FOR_METRICS - Minimum number of interactions required in a window to calculate meaningful metrics.
 * Prevents noisy data when user is largely inactive. Set to 5 interactions.
 */
const MIN_INTERACTION_FOR_METRICS: number = 5;

/**
 * @constant {object} INTERACTION_WEIGHTS - A map defining the influence (weight) of different interaction types on the raw cognitive load score.
 * These weights are heuristic and should be calibrated based on user studies and system goals.
 * - `CLICK`: Basic interaction.
 * - `KEY_PRESS_INPUT`: Typing in input fields, typically focused activity.
 * - `KEY_PRESS_GENERAL`: Keyboard shortcuts, navigation, etc., often less demanding than focused input.
 * - `SCROLL`: Navigating content. Rapid or excessive scrolling might indicate searching or frustration.
 * - `MOUSE_MOVE_ACTIVE`: Deliberate mouse movements when the user is not idle.
 * - `FORM_SUBMIT`: Completing a task, can be high load if complex.
 * - `FORM_ERROR`: Encountering an error; a strong indicator of increased cognitive effort or frustration.
 * - `NAVIGATION`: Changing routes or major views, often involves processing new information.
 * - `FOCUS_CHANGE`: Tabbing or programmatically changing focus.
 * - `VALUE_CHANGE`: Changing content in an input/textarea.
 * - `LONG_TASK_START`: Signifies the start of an asynchronous task perceived as "long" by the user.
 * - `LONG_TASK_END`: Signifies the end of an asynchronous task.
 */
const INTERACTION_WEIGHTS = {
  CLICK: 0.15,
  KEY_PRESS_INPUT: 0.1,
  KEY_PRESS_GENERAL: 0.05,
  SCROLL: 0.02,
  MOUSE_MOVE_ACTIVE: 0.01,
  FORM_SUBMIT: 0.3,
  FORM_ERROR: 0.7, // High impact
  NAVIGATION: 0.25,
  FOCUS_CHANGE: 0.03,
  VALUE_CHANGE: 0.08,
  LONG_TASK_START: 0.4, // Awaiting system response
  LONG_TASK_END: -0.2, // Task completion can reduce load
};

/**
 * @constant {object} COGNITIVE_LOAD_THRESHOLDS - Defines the score boundaries for different cognitive load levels.
 * These thresholds determine the categorical output of the sensor.
 * Scores are normalized between 0 and 1.
 */
const COGNITIVE_LOAD_THRESHOLDS = {
  LOW: 0.15,     // Score below this is 'low'
  MEDIUM: 0.4,   // Score above this is 'medium'
  HIGH: 0.75,    // Score above this is 'high'
  CRITICAL: 0.9, // Score above this is 'critical' (added for more granularity)
};

// --- Type Definitions for Data Structures ---

/**
 * @typedef {'low' | 'medium' | 'high' | 'critical'} CognitiveLoadLevel - Categorical representation of cognitive load.
 */
type CognitiveLoadLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * @interface InteractionEvent - Represents a single user interaction event captured by the sensor.
 * @property {number} timestamp - The exact time (ms since epoch) when the event occurred.
 * @property {keyof typeof INTERACTION_WEIGHTS} type - The categorized type of interaction.
 * @property {string} targetId - A unique or descriptive identifier for the HTML element that was interacted with.
 *                               Prioritizes `data-cl-id`, then `id`, then `tagName`, then `document`.
 * @property {string} [targetTag] - The HTML tag name of the target element (e.g., 'DIV', 'INPUT').
 * @property {number} [valueDelta] - Numeric change associated with the event (e.g., scroll distance, input length delta).
 * @property {boolean} [isError] - True if this interaction was associated with an error state (e.g., failed validation).
 * @property {number} [x] - X-coordinate of the mouse event.
 * @property {number} [y] - Y-coordinate of the mouse event.
 */
interface InteractionEvent {
  timestamp: number;
  type: keyof typeof INTERACTION_WEIGHTS;
  targetId: string;
  targetTag?: string;
  valueDelta?: number;
  isError?: boolean;
  x?: number;
  y?: number;
}

/**
 * @interface InteractionVelocityMetrics - Detailed metrics focusing on the frequency of various interactions.
 * These metrics provide insights into the user's pace and engagement.
 * @property {number} clickRatePerSecond - Average number of clicks per second within the window.
 * @property {number} keyPressRatePerSecond - Average number of key presses (input and general) per second.
 * @property {number} formSubmitRatePerSecond - Average number of form submissions per second.
 * @property {number} focusChangeRatePerSecond - Average number of focus/blur events per second.
 * @property {number} valueChangeRatePerSecond - Average number of input value changes per second.
 * @property {number} totalInteractionRatePerSecond - Sum of all observed interaction types per second.
 * @property {number} averageTimeBetweenInteractionsMs - Average time (ms) between any two consecutive interactions.
 *                                                        A lower value indicates higher velocity.
 */
interface InteractionVelocityMetrics {
  clickRatePerSecond: number;
  keyPressRatePerSecond: number;
  formSubmitRatePerSecond: number;
  focusChangeRatePerSecond: number;
  valueChangeRatePerSecond: number;
  totalInteractionRatePerSecond: number;
  averageTimeBetweenInteractionsMs: number;
}

/**
 * @interface InteractionComplexityMetrics - Metrics attempting to quantify the complexity or difficulty of user interactions.
 * @property {number} formErrorRatio - Ratio of form submissions with errors to total submissions. Ranges from 0 to 1.
 *                                      A higher ratio strongly suggests user difficulty.
 * @property {number} rapidFocusChangeScore - A score indicating frequent and rapid changes in focus.
 *                                            Could suggest confusion or searching.
 * @property {number} highVelocityTypingBurstCount - Number of short, intense bursts of high-speed typing.
 *                                                  Might indicate focused effort or frantic corrections.
 * @property {number} erraticMouseMovementsScore - Score based on irregular, non-linear, or rapid mouse patterns.
 *                                                Can be a proxy for frustration or searching.
 */
interface InteractionComplexityMetrics {
  formErrorRatio: number;
  rapidFocusChangeScore: number;
  highVelocityTypingBurstCount: number;
  erraticMouseMovementsScore: number;
}

/**
 * @interface CognitiveLoadMetrics - The comprehensive report generated by the CognitiveLoadSensor.
 * This object contains raw scores, derived sub-metrics, and the final categorical load level.
 * @property {number} rawInteractionScore - A weighted sum of recent interactions, before full normalization.
 * @property {InteractionVelocityMetrics} velocityMetrics - Detailed sub-metrics related to the speed of interactions.
 * @property {InteractionComplexityMetrics} complexityMetrics - Detailed sub-metrics related to the perceived complexity of interactions.
 * @property {number} typingSpeedWPM - Estimated typing speed in words per minute.
 * @property {number} mouseActivityScore - Composite score (0-1) reflecting mouse movement intensity and click density.
 * @property {number} scrollActivityScore - Composite score (0-1) reflecting scroll frequency and distance.
 * @property {number} errorRateIndicator - Composite score (0-1) reflecting the presence and recency of errors.
 * @property {number} navigationFrequencyScore - Composite score (0-1) reflecting how often the user navigates between major views.
 * @property {number} currentLoadScore - The final calculated and normalized cognitive load score (0-1).
 *                                        This is the primary output for decision-making.
 * @property {CognitiveLoadLevel} loadLevel - Categorical interpretation of `currentLoadScore` ('low', 'medium', 'high', 'critical').
 * @property {InteractionEvent[]} recentInteractions - A small subset of the most recent raw interaction events for contextual analysis.
 */
interface CognitiveLoadMetrics {
  rawInteractionScore: number;
  velocityMetrics: InteractionVelocityMetrics;
  complexityMetrics: InteractionComplexityMetrics;
  typingSpeedWPM: number;
  mouseActivityScore: number;
  scrollActivityScore: number;
  errorRateIndicator: number;
  navigationFrequencyScore: number;
  currentLoadScore: number;
  loadLevel: CognitiveLoadLevel;
  recentInteractions: InteractionEvent[];
}

/**
 * @interface CognitiveLoadSensorProps - Props for the CognitiveLoadSensor component.
 * @property {React.ReactNode} [children] - Child components to render. The sensor monitors the entire document by default,
 *                                          but children allow it to wrap an application's UI.
 * @property {(metrics: CognitiveLoadMetrics) => void} [onLoadReport] - Optional callback function invoked with updated cognitive load metrics.
 *                                                                      Useful for external systems or debugging.
 * @property {boolean} [enabled=true] - If set to `false`, the sensor will cease monitoring and reporting.
 * @property {number} [reportInterval=REPORT_INTERVAL_MS] - Custom interval (ms) for reporting metrics. Overrides default.
 * @property {number} [interactionWindow=INTERACTION_WINDOW_MS] - Custom time window (ms) for considering recent interactions. Overrides default.
 * @property {typeof INTERACTION_WEIGHTS} [weights=INTERACTION_WEIGHTS] - Custom weights for interaction types. Overrides default.
 * @property {typeof COGNITIVE_LOAD_THRESHOLDS} [thresholds=COGNITIVE_LOAD_THRESHOLDS] - Custom thresholds for load levels. Overrides default.
 * @property {boolean} [debugOverlay=false] - If true, renders a small, non-intrusive debug overlay showing live metrics.
 *                                            Useful for development and tuning, should be `false` in production.
 */
interface CognitiveLoadSensorProps {
  children?: React.ReactNode;
  onLoadReport?: (metrics: CognitiveLoadMetrics) => void;
  enabled?: boolean;
  reportInterval?: number;
  interactionWindow?: number;
  weights?: typeof INTERACTION_WEIGHTS;
  thresholds?: typeof COGNITIVE_LOAD_THRESHOLDS;
  debugOverlay?: boolean; // New prop for debugging UI
}

// --- Utility Functions (Adhering to "Megabyte of Data" and "Commercial Grade" by being explicit) ---

/**
 * Custom debounce function implementation.
 * Ensures a function is not called too frequently.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds before the function is executed.
 * @returns {Function} The debounced version of the function.
 */
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Custom throttle function implementation.
 * Ensures a function is called at most once within a specified time window.
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The minimum time interval (ms) between successive calls.
 * @returns {Function} The throttled version of the function.
 */
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastResult: any;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  const throttled = function(this: any, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) { // Execute once more after throttle period if new call happened
          throttled.apply(lastThis, lastArgs);
          lastArgs = null;
        }
      }, limit);
      lastResult = func.apply(this, args);
    }
    return lastResult;
  };
  return throttled;
}

/**
 * Normalizes a score to a 0-1 range based on a theoretical maximum.
 * Prevents scores from escalating indefinitely and makes them comparable.
 * @param {number} score - The raw score to normalize.
 * @param {number} theoreticalMax - The estimated maximum possible value for the raw score.
 * @returns {number} The normalized score, clamped between 0 and 1.
 */
const normalizeScore = (score: number, theoreticalMax: number): number => {
  if (theoreticalMax <= 0) return 0; // Avoid division by zero
  return Math.min(Math.max(score / theoreticalMax, 0), 1);
};

/**
 * Retrieves a stable identifier for a DOM element.
 * Prefers `data-cl-id` for explicit developer control, then `id`, then `tagName`, finally 'document'.
 * @param {HTMLElement | Document} element - The DOM element.
 * @returns {string} The identified string.
 */
const getElementIdentifier = (element: HTMLElement | Document): string => {
  if (element instanceof Document) {
    return 'document';
  }
  return element.dataset.clId || element.id || element.tagName || 'unknown_element';
};

/**
 * Calculates a weighted sum of recent interactions with exponential decay.
 * More recent events contribute more to the score. Errors have increased weight.
 * @param {InteractionEvent[]} interactions - A list of relevant interaction events.
 * @param {number} currentTime - The current timestamp (Date.now()).
 * @param {number} windowMs - The time window (ms) for considering interactions.
 * @param {typeof INTERACTION_WEIGHTS} weights - The weights configuration for different interaction types.
 * @returns {number} The calculated decayed raw interaction score.
 */
const calculateDecayedRawInteractionScore = (
  interactions: InteractionEvent[],
  currentTime: number,
  windowMs: number,
  weights: typeof INTERACTION_WEIGHTS
): number => {
  let score = 0;
  interactions.forEach(event => {
    const age = currentTime - event.timestamp;
    if (age >= 0 && age < windowMs) {
      const decayFactor = Math.exp(-age / (windowMs * COGNITIVE_LOAD_DECAY_FACTOR));
      score += (weights[event.type] || 0) * decayFactor * (event.isError ? 2.5 : 1); // Errors strongly amplify load
    }
  });
  return score;
};

/**
 * Estimates typing speed from a sequence of recent key press events in input fields.
 * Considers a sample of the most recent presses to calculate words per minute.
 * @param {InteractionEvent[]} interactions - Filtered key press interactions within the window.
 * @param {number} sampleSize - Number of key presses to consider for speed calculation.
 * @returns {number} Estimated typing speed in Words Per Minute (WPM). Returns 0 if insufficient data.
 */
const estimateTypingSpeed = (interactions: InteractionEvent[], sampleSize: number): number => {
  const inputKeyPresses = interactions.filter(
    (e) => e.type === 'KEY_PRESS_INPUT' && e.targetTag && ['input', 'textarea'].includes(e.targetTag.toLowerCase())
  );

  if (inputKeyPresses.length < sampleSize) return 0;

  // Get the most recent `sampleSize` key presses
  const latestKeyPresses = inputKeyPresses
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, sampleSize);

  if (latestKeyPresses.length < sampleSize) return 0; // Double check size

  const timeDiff = latestKeyPresses[0].timestamp - latestKeyPresses[latestKeyPresses.length - 1].timestamp;

  if (timeDiff <= 0) return 0; // Avoid division by zero or negative time

  const characters = latestKeyPresses.length; // Simplified: each key press is a char
  const minutes = timeDiff / 1000 / 60;
  const words = characters / 5; // Standard approximation: 5 characters per word
  return Math.round(words / minutes);
};

/**
 * Calculates a mouse activity score based on movement frequency, click density, and spatial distribution.
 * Higher scores indicate more frantic or deliberate mouse usage.
 * @param {InteractionEvent[]} interactions - Recent mouse move and click interactions.
 * @param {number} windowMs - Time window for consideration.
 * @param {number} currentTime - Current timestamp.
 * @param {typeof INTERACTION_WEIGHTS} weights - Interaction weights.
 * @returns {number} Normalized mouse activity score (0-1).
 */
const calculateMouseActivityScore = (
  interactions: InteractionEvent[],
  windowMs: number,
  currentTime: number,
  weights: typeof INTERACTION_WEIGHTS
): number => {
  const mouseMoves = interactions.filter(e => e.type === 'MOUSE_MOVE_ACTIVE');
  const clicks = interactions.filter(e => e.type === 'CLICK');

  let score = 0;
  const timeWindowSeconds = windowMs / 1000;

  if (timeWindowSeconds === 0) return 0;

  // 1. Mouse move frequency
  score += normalizeScore(mouseMoves.length / timeWindowSeconds, 50) * 0.4; // Max 50 moves/sec

  // 2. Click frequency
  score += normalizeScore(clicks.length / timeWindowSeconds, 10) * 0.3; // Max 10 clicks/sec

  // 3. Mouse path complexity (simplified: check for rapid direction changes or confined movements)
  // This would ideally require more sophisticated path analysis. For now, a proxy:
  // high density of clicks/moves in short time suggests complexity.
  if (mouseMoves.length > 5 && clicks.length > 2) {
    const minX = Math.min(...mouseMoves.map(m => m.x || 0), ...clicks.map(c => c.x || 0));
    const maxX = Math.max(...mouseMoves.map(m => m.x || 0), ...clicks.map(c => c.x || 0));
    const minY = Math.min(...mouseMoves.map(m => m.y || 0), ...clicks.map(c => c.y || 0));
    const maxY = Math.max(...mouseMoves.map(m => m.y || 0), ...clicks.map(c => c.y || 0));

    const spanX = maxX - minX;
    const spanY = maxY - minY;

    if (spanX < 100 && spanY < 100) { // If movements are confined to a small area
      score += 0.2; // Add a bonus for potential "micro-interactions" or fumbling
    }
  }

  // Normalize final mouse activity score (max ~1.0)
  return normalizeScore(score, 1.2); // Theoretical max for combined scores
};

/**
 * Calculates a scroll activity score based on frequency and total scroll delta.
 * @param {InteractionEvent[]} interactions - Recent scroll interactions.
 * @param {number} windowMs - Time window for consideration.
 * @param {number} currentTime - Current timestamp.
 * @param {typeof INTERACTION_WEIGHTS} weights - Interaction weights.
 * @returns {number} Normalized scroll activity score (0-1).
 */
const calculateScrollActivityScore = (
  interactions: InteractionEvent[],
  windowMs: number,
  currentTime: number,
  weights: typeof INTERACTION_WEIGHTS
): number => {
  const scrolls = interactions.filter(e => e.type === 'SCROLL');
  if (scrolls.length === 0) return 0;

  let totalScrollDelta = 0;
  scrolls.forEach(event => {
    totalScrollDelta += Math.abs(event.valueDelta || 0);
  });

  const timeWindowSeconds = windowMs / 1000;
  if (timeWindowSeconds === 0) return 0;

  // Score based on average scroll speed and frequency
  const scrollFrequencyPerSecond = scrolls.length / timeWindowSeconds;
  const averageScrollMagnitude = totalScrollDelta / (scrolls.length || 1); // Average pixels scrolled per event

  let score = normalizeScore(scrollFrequencyPerSecond, 20) * 0.6; // Max 20 scrolls/sec
  score += normalizeScore(averageScrollMagnitude, 500) * 0.4; // Max 500 pixels per scroll

  return normalizeScore(score, 1.0); // Normalize to 0-1
};

/**
 * Calculates an error rate indicator score. This score increases with more recent or frequent errors.
 * @param {InteractionEvent[]} interactions - Recent interactions, including those flagged as errors.
 * @param {number} windowMs - Time window for consideration.
 * @param {number} currentTime - Current timestamp.
 * @param {typeof INTERACTION_WEIGHTS} weights - Interaction weights.
 * @returns {number} Normalized error rate score (0-1).
 */
const calculateErrorRateIndicator = (
  interactions: InteractionEvent[],
  windowMs: number,
  currentTime: number,
  weights: typeof INTERACTION_WEIGHTS
): number => {
  const errors = interactions.filter(e => e.isError);
  if (errors.length === 0) return 0;

  const errorScore = errors.reduce((sum, error) => {
    const age = currentTime - error.timestamp;
    if (age >= 0 && age < windowMs) {
      const decayFactor = Math.exp(-age / (windowMs * COGNITIVE_LOAD_DECAY_FACTOR));
      return sum + (weights.FORM_ERROR || 0) * decayFactor;
    }
    return sum;
  }, 0);

  // Normalize error score, assuming a few errors in the window can lead to high load
  // Max possible error score could be `weights.FORM_ERROR` * `MAX_ERRORS_IN_WINDOW` * 2.5 (for decay).
  const theoreticalMaxErrorContribution = (weights.FORM_ERROR || 0) * 5 * 2.5; // Example: 5 significant errors
  return normalizeScore(errorScore, theoreticalMaxErrorContribution);
};

/**
 * Calculates interaction velocity metrics from recent interactions.
 * @param {InteractionEvent[]} recentInteractions - Interactions within the current window.
 * @param {number} interactionWindowMs - The time window in milliseconds.
 * @returns {InteractionVelocityMetrics} The calculated velocity metrics.
 */
const calculateInteractionVelocityMetrics = (
  recentInteractions: InteractionEvent[],
  interactionWindowMs: number
): InteractionVelocityMetrics => {
  const timeWindowSeconds = interactionWindowMs / 1000;
  if (timeWindowSeconds === 0 || recentInteractions.length < MIN_INTERACTION_FOR_METRICS) {
    return {
      clickRatePerSecond: 0, keyPressRatePerSecond: 0, formSubmitRatePerSecond: 0,
      focusChangeRatePerSecond: 0, valueChangeRatePerSecond: 0, totalInteractionRatePerSecond: 0,
      averageTimeBetweenInteractionsMs: 0
    };
  }

  const getRate = (type: keyof typeof INTERACTION_WEIGHTS) => recentInteractions.filter(e => e.type === type).length / timeWindowSeconds;

  const clickRate = getRate('CLICK');
  const keyPressRate = getRate('KEY_PRESS_INPUT') + getRate('KEY_PRESS_GENERAL');
  const formSubmitRate = getRate('FORM_SUBMIT');
  const focusChangeRate = getRate('FOCUS_CHANGE');
  const valueChangeRate = getRate('VALUE_CHANGE');
  const totalRate = recentInteractions.length / timeWindowSeconds;

  let averageTimeBetweenInteractionsMs = 0;
  if (recentInteractions.length > 1) {
    const sorted = [...recentInteractions].sort((a, b) => a.timestamp - b.timestamp);
    let totalDiff = 0;
    for (let i = 1; i < sorted.length; i++) {
      totalDiff += (sorted[i].timestamp - sorted[i-1].timestamp);
    }
    averageTimeBetweenInteractionsMs = totalDiff / (sorted.length - 1);
  }


  return {
    clickRatePerSecond: clickRate,
    keyPressRatePerSecond: keyPressRate,
    formSubmitRatePerSecond: formSubmitRate,
    focusChangeRatePerSecond: focusChangeRate,
    valueChangeRatePerSecond: valueChangeRate,
    totalInteractionRatePerSecond: totalRate,
    averageTimeBetweenInteractionsMs: averageTimeBetweenInteractionsMs,
  };
};

/**
 * Calculates interaction complexity metrics from recent interactions.
 * @param {InteractionEvent[]} recentInteractions - Interactions within the current window.
 * @param {number} interactionWindowMs - The time window in milliseconds.
 * @returns {InteractionComplexityMetrics} The calculated complexity metrics.
 */
const calculateInteractionComplexityMetrics = (
  recentInteractions: InteractionEvent[],
  interactionWindowMs: number
): InteractionComplexityMetrics => {
  const timeWindowSeconds = interactionWindowMs / 1000;
  if (timeWindowSeconds === 0 || recentInteractions.length < MIN_INTERACTION_FOR_METRICS) {
    return { formErrorRatio: 0, rapidFocusChangeScore: 0, highVelocityTypingBurstCount: 0, erraticMouseMovementsScore: 0 };
  }

  // Form Error Ratio
  const formSubmits = recentInteractions.filter(e => e.type === 'FORM_SUBMIT');
  const formErrors = formSubmits.filter(e => e.isError).length;
  const formErrorRatio = formSubmits.length > 0 ? formErrors / formSubmits.length : 0;

  // Rapid Focus Change Score
  const focusEvents = recentInteractions.filter(e => e.type === 'FOCUS_CHANGE');
  let rapidFocusChangeScore = 0;
  if (focusEvents.length > 2) {
    const sortedFocus = [...focusEvents].sort((a, b) => a.timestamp - b.timestamp);
    for (let i = 1; i < sortedFocus.length; i++) {
      const timeDiff = sortedFocus[i].timestamp - sortedFocus[i-1].timestamp;
      if (timeDiff < 200) { // Very rapid focus change (e.g., tabbing quickly)
        rapidFocusChangeScore += 0.1;
      }
    }
  }
  rapidFocusChangeScore = normalizeScore(rapidFocusChangeScore, focusEvents.length * 0.1); // Max score proportional to events

  // High Velocity Typing Burst Count (simplified)
  const typingEvents = recentInteractions.filter(e => e.type === 'KEY_PRESS_INPUT');
  let highVelocityTypingBurstCount = 0;
  if (typingEvents.length > TYPING_SPEED_SAMPLE_SIZE * 2) { // Need enough events to detect bursts
    // This is a complex metric, simplifying to "many keypresses in short periods"
    // More accurate would involve statistical analysis of time between keypresses.
    highVelocityTypingBurstCount = normalizeScore(typingEvents.length / timeWindowSeconds, 50) > 0.5 ? 1 : 0;
  }

  // Erratic Mouse Movements Score (using basic path length/window area for proxy)
  const mouseMoves = recentInteractions.filter(e => e.type === 'MOUSE_MOVE_ACTIVE');
  let erraticMouseMovementsScore = 0;
  if (mouseMoves.length > 10) {
    let totalDistance = 0;
    for(let i = 1; i < mouseMoves.length; i++) {
      const dx = (mouseMoves[i].x || 0) - (mouseMoves[i-1].x || 0);
      const dy = (mouseMoves[i].y || 0) - (mouseMoves[i-1].y || 0);
      totalDistance += Math.sqrt(dx*dx + dy*dy);
    }
    // High distance relative to number of events suggests erratic movement
    if (mouseMoves.length > 0 && totalDistance / mouseMoves.length > 50) { // Avg move of 50px per event
      erraticMouseMovementsScore = normalizeScore(totalDistance / timeWindowSeconds, 2000) * 0.5; // Max 2000px/sec avg
    }
  }


  return {
    formErrorRatio,
    rapidFocusChangeScore,
    highVelocityTypingBurstCount,
    erraticMouseMovementsScore,
  };
};


/**
 * Determines the categorical cognitive load level based on the normalized score and defined thresholds.
 * @param {number} score - The normalized cognitive load score (0-1).
 * @param {typeof COGNITIVE_LOAD_THRESHOLDS} thresholds - The threshold configuration.
 * @returns {CognitiveLoadLevel} The corresponding cognitive load level.
 */
const getCognitiveLoadLevel = (score: number, thresholds: typeof COGNITIVE_LOAD_THRESHOLDS): CognitiveLoadLevel => {
  if (score >= thresholds.CRITICAL) return 'critical';
  if (score >= thresholds.HIGH) return 'high';
  if (score >= thresholds.MEDIUM) return 'medium';
  if (score >= thresholds.LOW) return 'low';
  return 'low'; // Default
};

// --- CognitiveLoadContext for broader application access ---

/**
 * @interface ICognitiveLoadContext - Defines the shape of the context object for cognitive load.
 * @property {CognitiveLoadMetrics | null} latestMetrics - The most recently calculated cognitive load metrics.
 *                                                         `null` if the sensor is disabled or not yet initialized.
 */
interface ICognitiveLoadContext {
  latestMetrics: CognitiveLoadMetrics | null;
}

/**
 * @constant {React.Context<ICognitiveLoadContext>} CognitiveLoadContext - React Context for providing cognitive load metrics.
 * Allows descendant components to easily consume load data without prop drilling.
 */
const CognitiveLoadContext = createContext<ICognitiveLoadContext>({
  latestMetrics: null,
});

/**
 * @function useCognitiveLoad - Custom React hook to access cognitive load metrics from the `CognitiveLoadContext`.
 * @returns {ICognitiveLoadContext} The current cognitive load metrics.
 * @throws {Error} If `useCognitiveLoad` is used outside of a `CognitiveLoadSensor` provider.
 * @example
 * const { latestMetrics } = useCognitiveLoad();
 * if (latestMetrics?.loadLevel === 'high') {
 *   // Render a simplified UI or offer help
 * }
 */
export const useCognitiveLoad = (): ICognitiveLoadContext => {
  const context = useContext(CognitiveLoadContext);
  if (context === undefined) {
    console.error('useCognitiveLoad must be used within a CognitiveLoadSensor Provider.');
    // In a production environment, you might want to throw an error or return a default/mock object.
    return { latestMetrics: null };
  }
  return context;
};

// --- Main CognitiveLoadSensor Component ---

/**
 * `CognitiveLoadSensor` is a non-intrusive React component designed to estimate user cognitive load
 * based on observed interaction velocity, complexity, and other behavioral heuristics within a web application.
 *
 * It passively listens to various DOM events (clicks, key presses, scrolls, mouse movements, form submissions,
 * focus changes, etc.) across the entire document. It then analyzes their frequency, type, and context
 * to compute a "cognitive load score." This score is subsequently categorized into levels
 * (low, medium, high, critical) to provide an actionable signal.
 *
 * The sensor aims to provide real-time insights into potential user stress, confusion, or intense engagement levels.
 * These insights can be invaluable for driving AI-powered adaptive UI adjustments, offering proactive assistance,
 * personalizing content, or feeding advanced analytics systems.
 *
 * This component is a foundational element for building truly sentient and responsive user experiences,
 * integrating directly with the broader project's AI capabilities (e.g., the `CognitiveLoadPredictor`
 * from `inventions/011_cognitive_load_balancing/src/ml/`) by providing rich, structured telemetry data.
 *
 * @component
 * @param {CognitiveLoadSensorProps} props - The properties for the CognitiveLoadSensor.
 * @example
 * // Basic usage wrapping the entire application:
 * <CognitiveLoadSensor
 *   enabled={true}
 *   onLoadReport={(metrics) => console.log('Current Cognitive Load:', metrics.loadLevel, metrics.currentLoadScore.toFixed(2))}
 *   debugOverlay={process.env.NODE_ENV === 'development'}
 * >
 *   <App />
 * </CognitiveLoadSensor>
 *
 * @remarks
 * The component leverages several key heuristics and mechanisms:
 * - **Event Listeners**: Comprehensive global DOM event tracking for clicks, key presses, mouse movements, scrolls, form submits, focus changes, and input changes.
 * - **Interaction History**: Maintains a rolling window of recent events to analyze patterns and trends.
 * - **Decaying Scores**: Prioritizes recent interactions using an exponential decay function, ensuring the load score is highly reactive to current user state.
 * - **Derived Metrics**: Calculates granular metrics like typing speed (WPM), mouse activity (movement density, click frequency), scroll activity (speed, depth), and error rates.
 * - **Complexity Indicators**: Infers complexity from patterns such as rapid focus changes, form validation errors, and erratic mouse movements.
 * - **Configurable Weights & Thresholds**: Allows for fine-tuning the sensitivity and categorization of the cognitive load model via props.
 * - **Context API Integration**: Exposes the `latestMetrics` via `CognitiveLoadContext` and `useCognitiveLoad` hook, enabling seamless data consumption by any descendant component.
 * - **Throttling/Debouncing**: Employs custom utility functions to optimize performance by limiting the frequency of high-volume events like mousemove and scroll.
 * - **Commercial Grade Design**: Emphasizes explicit typing, detailed JSDoc comments, modular helper functions, and consideration for performance and memory management (e.g., `MAX_INTERACTION_HISTORY`).
 * - **AI Integration Point**: The `CognitiveLoadMetrics` object produced is explicitly designed as a rich data payload for upstream AI analysis, allowing intelligent systems to infer user intent, frustration, or engagement.
 */
export const CognitiveLoadSensor: React.FC<CognitiveLoadSensorProps> = ({
  children,
  onLoadReport,
  enabled = true,
  reportInterval = REPORT_INTERVAL_MS,
  interactionWindow = INTERACTION_WINDOW_MS,
  weights = INTERACTION_WEIGHTS,
  thresholds = COGNITIVE_LOAD_THRESHOLDS,
  debugOverlay = false,
}) => {
  /**
   * @private
   * @type {React.MutableRefObject<InteractionEvent[]>} interactionHistoryRef - A mutable ref object that holds the chronological history of all captured interaction events.
   * Using a ref allows event handlers to update this array without causing re-renders of the sensor component itself, optimizing performance.
   * Events are added to the end and oldest events are shifted out once `MAX_INTERACTION_HISTORY` is exceeded.
   */
  const interactionHistoryRef = useRef<InteractionEvent[]>([]);

  /**
   * @private
   * @type {React.MutableRefObject<number>} lastMouseMoveTimeRef - Stores the timestamp of the last recorded mouse move event.
   * Used for throttling mousemove events and determining if a user is actively moving the mouse or is idle.
   */
  const lastMouseMoveTimeRef = useRef<number>(0);

  /**
   * @private
   * @type {React.MutableRefObject<number>} lastScrollTimeRef - Stores the timestamp of the last recorded scroll event.
   * Primarily used for throttling scroll events to reduce event listener overhead.
   */
  const lastScrollTimeRef = useRef<number>(0);

  /**
   * @private
   * @type {React.MutableRefObject<number | null>} previousScrollYRef - Stores the `window.scrollY` value from the previous scroll event.
   * This is crucial for calculating the `valueDelta` (distance scrolled) for scroll events.
   */
  const previousScrollYRef = useRef<number | null>(null);

  /**
   * @private
   * @type {React.MutableRefObject<number>} lastActivityTimeRef - Stores the timestamp of the most recent user interaction (any type).
   * Used to determine overall user idleness, which can influence mouse activity scoring.
   */
  const lastActivityTimeRef = useRef<number>(Date.now());

  /**
   * @private
   * @type {[CognitiveLoadMetrics | null, React.Dispatch<React.SetStateAction<CognitiveLoadMetrics | null>>]}
   * latestMetrics - React state hook to hold the most recently calculated cognitive load metrics.
   * This state is provided via the `CognitiveLoadContext` to all consuming components.
   */
  const [latestMetrics, setLatestMetrics] = useState<CognitiveLoadMetrics | null>(null);

  /**
   * @private
   * @function addInteraction - Adds a new interaction event to the `interactionHistoryRef`.
   * Manages the `MAX_INTERACTION_HISTORY` limit by removing the oldest event if the capacity is exceeded.
   * This function is memoized using `useCallback` for performance optimization.
   * @param {InteractionEvent} event - The interaction event object to be added.
   */
  const addInteraction = useCallback((event: InteractionEvent) => {
    interactionHistoryRef.current.push(event);
    if (interactionHistoryRef.current.length > MAX_INTERACTION_HISTORY) {
      interactionHistoryRef.current.shift(); // Remove the oldest event to prevent unbounded growth
      if (process.env.NODE_ENV === 'development') {
        // console.log(`Interaction history truncated. Current size: ${interactionHistoryRef.current.length}`);
      }
    }
    lastActivityTimeRef.current = event.timestamp; // Update last activity time with any interaction
  }, []);

  /**
   * @private
   * @function captureInteraction - A high-level helper function to standardize the capturing of DOM interaction events.
   * It extracts relevant information from the DOM event and formats it into an `InteractionEvent` object before
   * calling `addInteraction`. This function is memoized using `useCallback`.
   * @param {keyof typeof INTERACTION_WEIGHTS} type - The categorized type of interaction.
   * @param {Event} domEvent - The original DOM event object (e.g., `MouseEvent`, `KeyboardEvent`).
   * @param {object} [extraDetails] - Optional additional details to include in the `InteractionEvent`, like `valueDelta` or `isError`.
   */
  const captureInteraction = useCallback((
    type: keyof typeof INTERACTION_WEIGHTS,
    domEvent: Event,
    extraDetails?: Partial<Omit<InteractionEvent, 'timestamp' | 'type' | 'targetId'>>
  ) => {
    if (!enabled) return;

    const target = domEvent.target as HTMLElement;
    const targetId = getElementIdentifier(target);
    const targetTag = target.tagName;

    let x, y;
    if (domEvent instanceof MouseEvent) {
      x = domEvent.clientX;
      y = domEvent.clientY;
    }

    addInteraction({
      timestamp: Date.now(),
      type,
      targetId,
      targetTag,
      x,
      y,
      ...extraDetails,
    });
  }, [enabled, addInteraction]);

  // --- Event Handler Implementations (using useCallback for stability) ---

  /**
   * @private
   * @function handleClick - Handles the global `click` event.
   * This handler is optimized to capture the click and log it as a `CLICK` interaction.
   * Memoized with `useCallback`.
   * @param {MouseEvent} event - The DOM `MouseEvent` object.
   */
  const handleClick = useCallback((event: MouseEvent) => {
    captureInteraction('CLICK', event);
  }, [captureInteraction]);

  /**
   * @private
   * @function handleKeyDown - Handles the global `keydown` event.
   * Distinguishes between key presses within input elements (`KEY_PRESS_INPUT`) and general key presses elsewhere (`KEY_PRESS_GENERAL`).
   * Memoized with `useCallback`.
   * @param {KeyboardEvent} event - The DOM `KeyboardEvent` object.
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.matches('input, textarea, [contenteditable="true"]')) {
      captureInteraction('KEY_PRESS_INPUT', event);
    } else {
      captureInteraction('KEY_PRESS_GENERAL', event);
    }
  }, [captureInteraction]);

  /**
   * @private
   * @function handleMouseMoveThrottled - Handles the global `mousemove` event, debounced and throttled.
   * This is a critical performance optimization to prevent excessive event processing.
   * It only registers an `MOUSE_MOVE_ACTIVE` interaction if the user is not considered idle
   * and a certain time has passed since the last mouse move.
   * Memoized with `useCallback` and wrapped by a throttle utility.
   * @param {MouseEvent} event - The DOM `MouseEvent` object.
   */
  const handleMouseMoveThrottled = useCallback(throttle((event: MouseEvent) => {
    if (!enabled) return;
    const now = Date.now();
    // Only register as "active" if user is not idle
    if (now - lastActivityTimeRef.current < IDLE_THRESHOLD_MS) {
      captureInteraction('MOUSE_MOVE_ACTIVE', event, { x: event.clientX, y: event.clientY });
      lastMouseMoveTimeRef.current = now;
    }
  }, MOUSE_MOVE_THROTTLE_MS), [enabled, captureInteraction]);

  /**
   * @private
   * @function handleScrollThrottled - Handles the global `scroll` event, throttled.
   * Calculates the vertical scroll delta (`valueDelta`) to quantify the amount of scrolling.
   * Memoized with `useCallback` and wrapped by a throttle utility.
   * @param {Event} event - The DOM `Event` object (scroll).
   */
  const handleScrollThrottled = useCallback(throttle((event: Event) => {
    if (!enabled) return;
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    let valueDelta = 0;
    if (previousScrollYRef.current !== null) {
      valueDelta = Math.abs(currentScrollY - previousScrollYRef.current);
    }
    previousScrollYRef.current = currentScrollY;

    captureInteraction('SCROLL', event, { valueDelta });
  }, SCROLL_THROTTLE_MS), [enabled, captureInteraction]);

  /**
   * @private
   * @function handleSubmit - Handles the global `submit` event, primarily for HTML forms.
   * Includes a basic check for form validity to set the `isError` flag, indicating potential user frustration.
   * Memoized with `useCallback`.
   * @param {Event} event - The DOM `Event` object (submit).
   */
  const handleSubmit = useCallback((event: Event) => {
    const form = event.target as HTMLFormElement;
    let isFormValid = true;
    if (form && typeof form.checkValidity === 'function') {
      isFormValid = form.checkValidity(); // Check HTML5 form validation status
    }
    captureInteraction('FORM_SUBMIT', event, { isError: !isFormValid });
  }, [captureInteraction]);

  /**
   * @private
   * @function handleFocusChange - Handles `focusin` and `focusout` events.
   * Captures changes in focus, which can indicate navigation between elements, potentially via tabbing.
   * Memoized with `useCallback`.
   * @param {FocusEvent} event - The DOM `FocusEvent` object.
   */
  const handleFocusChange = useCallback((event: FocusEvent) => {
    captureInteraction('FOCUS_CHANGE', event);
  }, [captureInteraction]);

  /**
   * @private
   * @function handleValueChange - Handles `input` and `change` events on form elements.
   * Records modifications to input fields, which are core user interactions.
   * Memoized with `useCallback`.
   * @param {Event} event - The DOM `Event` object (input or change).
   */
  const handleValueChange = useCallback((event: Event) => {
    // For more advanced logic, one could track actual value changes and their complexity.
    // E.g., a large paste might be low complexity, but many small corrections could be high.
    captureInteraction('VALUE_CHANGE', event);
  }, [captureInteraction]);

  // --- Core Cognitive Load Calculation Logic ---

  /**
   * @private
   * @function calculateCognitiveLoad - The main function responsible for aggregating all collected interaction data
   * and deriving the comprehensive `CognitiveLoadMetrics` report. This function encapsulates all the heuristic
   * logic for estimating cognitive load.
   * This function is memoized using `useCallback` to ensure it only recalculates when its dependencies change,
   * enhancing performance within the `useEffect` interval.
   * @returns {CognitiveLoadMetrics} A complete object containing all raw and derived cognitive load metrics.
   */
  const calculateCognitiveLoad = useCallback((): CognitiveLoadMetrics => {
    const now = Date.now();
    const currentWindowStart = now - interactionWindow;

    // Filter interactions to include only those within the current observation window
    const recentInteractions = interactionHistoryRef.current.filter(
      (event) => event.timestamp >= currentWindowStart
    );

    // If there are too few interactions, return a base low load to avoid noisy data
    if (recentInteractions.length < MIN_INTERACTION_FOR_METRICS) {
      return {
        rawInteractionScore: 0,
        velocityMetrics: calculateInteractionVelocityMetrics([], interactionWindow),
        complexityMetrics: calculateInteractionComplexityMetrics([], interactionWindow),
        typingSpeedWPM: 0,
        mouseActivityScore: 0,
        scrollActivityScore: 0,
        errorRateIndicator: 0,
        navigationFrequencyScore: 0,
        currentLoadScore: 0,
        loadLevel: 'low',
        recentInteractions: [],
      };
    }

    // --- Calculate Individual & Derived Metrics ---

    // 1. Raw Interaction Score (weighted and decayed by recency)
    const rawInteractionScore = calculateDecayedRawInteractionScore(recentInteractions, now, interactionWindow, weights);

    // 2. Interaction Velocity Metrics
    const velocityMetrics = calculateInteractionVelocityMetrics(recentInteractions, interactionWindow);

    // 3. Interaction Complexity Metrics
    const complexityMetrics = calculateInteractionComplexityMetrics(recentInteractions, interactionWindow);

    // 4. Typing Speed (WPM)
    const typingSpeedWPM = estimateTypingSpeed(recentInteractions, TYPING_SPEED_SAMPLE_SIZE);

    // 5. Mouse Activity Score
    const mouseActivityScore = calculateMouseActivityScore(recentInteractions, interactionWindow, now, weights);

    // 6. Scroll Activity Score
    const scrollActivityScore = calculateScrollActivityScore(recentInteractions, interactionWindow, now, weights);

    // 7. Error Rate Indicator
    const errorRateIndicator = calculateErrorRateIndicator(recentInteractions, interactionWindow, now, weights);

    // 8. Navigation Frequency Score (Needs external integration for robust tracking)
    // For this file, we simulate or assume 'NAVIGATION' events are manually triggered or inferred.
    const navigationEvents = recentInteractions.filter(e => e.type === 'NAVIGATION');
    const navigationFrequencyScore = navigationEvents.length > 0
      ? normalizeScore(navigationEvents.length / (interactionWindow / 1000), 2) * 0.7 // Max 2 navs/sec, weighted
      : 0;

    // --- Composite Cognitive Load Score Calculation ---
    // This is the core heuristic fusion. Weights for each metric's contribution to the final score.
    // These specific multipliers are heuristic and would typically be derived through machine learning
    // or extensive empirical user studies in a mature system.
    let compositeScore = (
      rawInteractionScore * 0.25 +                                  // Base interaction intensity
      velocityMetrics.totalInteractionRatePerSecond * 0.05 +        // Higher rate suggests focus/speed
      typingSpeedWPM * 0.001 +                                      // High WPM is good, but too high with errors...
      mouseActivityScore * 0.2 +                                    // Erratic mouse == higher load
      scrollActivityScore * 0.1 +                                   // Excessive scrolling == searching/confusion
      errorRateIndicator * 0.35 +                                   // Errors are strong indicators of load
      navigationFrequencyScore * 0.05 +                             // Frequent navigation can indicate searching
      complexityMetrics.formErrorRatio * 0.2 +                      // Direct error ratio is very strong
      complexityMetrics.rapidFocusChangeScore * 0.15 +              // Rapid focus shifts are often high load
      (complexityMetrics.erraticMouseMovementsScore > 0 ? 0.1 : 0)  // Erratic movements contribution
    );

    // Apply a penalty for high velocity + high error scenarios (indicates frustration)
    if (velocityMetrics.totalInteractionRatePerSecond > 5 && errorRateIndicator > 0.3) {
      compositeScore *= 1.2; // 20% penalty multiplier
    }

    // Define a theoretical maximum for the composite score before final normalization.
    // This is crucial for normalizing to 0-1 range accurately. This value must be calibrated.
    // It's an estimate of the highest possible "raw" score given the chosen weights and expected max values of metrics.
    const theoreticalMaxHeuristicScore = 8.0; // Example value, would be empirically determined

    const currentLoadScore = normalizeScore(compositeScore, theoreticalMaxHeuristicScore);

    const loadLevel = getCognitiveLoadLevel(currentLoadScore, thresholds);

    return {
      rawInteractionScore,
      velocityMetrics,
      complexityMetrics,
      typingSpeedWPM,
      mouseActivityScore,
      scrollActivityScore,
      errorRateIndicator,
      navigationFrequencyScore,
      currentLoadScore,
      loadLevel,
      recentInteractions: recentInteractions.slice(-50), // Include last 50 events for context, for AI/debugging
    };
  }, [enabled, interactionWindow, weights, thresholds]);


  // --- Effect Hooks for Event Listener Management and Reporting Interval ---

  /**
   * @private
   * @effect
   * Sets up and tears down global DOM event listeners. This `useEffect` runs once on component mount
   * and cleans up on unmount or if `enabled` changes to `false`.
   * It attaches listeners for various user interactions across the entire document.
   */
  useEffect(() => {
    if (!enabled) {
      if (process.env.NODE_ENV === 'development') {
        // console.log('CognitiveLoadSensor: Event listeners disabled.');
      }
      // Remove all listeners if disabled
      document.removeEventListener('click', handleClick, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('mousemove', handleMouseMoveThrottled);
      document.removeEventListener('scroll', handleScrollThrottled, { capture: true });
      document.removeEventListener('submit', handleSubmit, { capture: true });
      document.removeEventListener('focusin', handleFocusChange, { capture: true });
      document.removeEventListener('focusout', handleFocusChange, { capture: true });
      document.removeEventListener('input', handleValueChange, { capture: true });
      document.removeEventListener('change', handleValueChange, { capture: true });
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      // console.log('CognitiveLoadSensor: Attaching event listeners.');
    }

    // Attach global event listeners with capture phase for broader coverage
    document.addEventListener('click', handleClick, { capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('mousemove', handleMouseMoveThrottled, { passive: true }); // Passive for performance
    document.addEventListener('scroll', handleScrollThrottled, { passive: true, capture: true });
    document.addEventListener('submit', handleSubmit, { capture: true });
    document.addEventListener('focusin', handleFocusChange, { capture: true });
    document.addEventListener('focusout', handleFocusChange, { capture: true });
    document.addEventListener('input', handleValueChange, { capture: true });
    document.addEventListener('change', handleValueChange, { capture: true });

    // Note on Navigation Tracking:
    // For robust navigation tracking, one would typically integrate with a client-side router
    // (e.g., `react-router-dom`'s `useLocation` or `history` object) to detect route changes.
    // A simplified approach might listen to `window.onpopstate` or manually call `captureInteraction('NAVIGATION', ...)`
    // whenever a significant view transition occurs. This component assumes such calls might originate externally
    // or a basic `popstate` could be tracked if `enabled` is true.
    const handlePopState = (event: PopStateEvent) => {
        captureInteraction('NAVIGATION', event, { targetId: window.location.pathname });
    };
    window.addEventListener('popstate', handlePopState);


    return () => {
      // Clean up all event listeners when the component unmounts or `enabled` becomes false
      if (process.env.NODE_ENV === 'development') {
        // console.log('CognitiveLoadSensor: Cleaning up event listeners.');
      }
      document.removeEventListener('click', handleClick, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('mousemove', handleMouseMoveThrottled);
      document.removeEventListener('scroll', handleScrollThrottled, { capture: true });
      document.removeEventListener('submit', handleSubmit, { capture: true });
      document.removeEventListener('focusin', handleFocusChange, { capture: true });
      document.removeEventListener('focusout', handleFocusChange, { capture: true });
      document.removeEventListener('input', handleValueChange, { capture: true });
      document.removeEventListener('change', handleValueChange, { capture: true });
      window.removeEventListener('popstate', handlePopState);
    };
  }, [
    enabled,
    handleClick,
    handleKeyDown,
    handleMouseMoveThrottled,
    handleScrollThrottled,
    handleSubmit,
    handleFocusChange,
    handleValueChange,
    captureInteraction, // Add captureInteraction to dependency array for popstate handler
  ]);

  /**
   * @private
   * @effect
   * Establishes a timed interval for periodically calculating and reporting cognitive load metrics.
   * This `useEffect` is responsible for driving the continuous assessment process.
   * It also performs an initial calculation when the component mounts or `enabled` status changes.
   */
  useEffect(() => {
    if (!enabled) {
      setLatestMetrics(null); // Clear metrics when disabled
      if (process.env.NODE_ENV === 'development') {
        // console.log('CognitiveLoadSensor: Reporting interval disabled.');
      }
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      // console.log(`CognitiveLoadSensor: Starting reporting interval every ${reportInterval}ms.`);
    }

    const intervalId = setInterval(() => {
      const metrics = calculateCognitiveLoad();
      setLatestMetrics(metrics); // Update internal state for context consumers
      if (onLoadReport) {
        onLoadReport(metrics); // Call external reporter if provided
      }
    }, reportInterval);

    // Perform an initial calculation and report when the sensor becomes enabled
    const initialMetrics = calculateCognitiveLoad();
    setLatestMetrics(initialMetrics);
    if (onLoadReport) {
      onLoadReport(initialMetrics);
    }

    return () => {
      // Clean up the interval when the component unmounts or `enabled` becomes false
      if (process.env.NODE_ENV === 'development') {
        // console.log('CognitiveLoadSensor: Clearing reporting interval.');
      }
      clearInterval(intervalId);
    };
  }, [enabled, reportInterval, onLoadReport, calculateCognitiveLoad]);

  /**
   * @private
   * @function renderDebugOverlay - A functional component to render a small, non-intrusive debug overlay.
   * This overlay displays the latest cognitive load metrics directly on the screen for development and testing purposes.
   * It's conditionally rendered based on the `debugOverlay` prop.
   * @param {CognitiveLoadMetrics | null} metrics - The current cognitive load metrics to display.
   * @returns {JSX.Element | null} The debug overlay JSX or `null` if no metrics or debugging is disabled.
   */
  const renderDebugOverlay = (metrics: CognitiveLoadMetrics | null) => {
    if (!debugOverlay || !metrics) {
      return null;
    }

    // Inline styles for a discreet, functional overlay
    const overlayStyle: React.CSSProperties = {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '400px',
      overflowY: 'auto',
      boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
      pointerEvents: 'none', // Allow clicks to pass through
    };

    const levelColor = {
      'low': '#4CAF50', // Green
      'medium': '#FFC107', // Amber
      'high': '#FF9800', // Orange
      'critical': '#F44336', // Red
    }[metrics.loadLevel];

    return (
      <div style={overlayStyle}>
        <strong>Cognitive Load:</strong>{' '}
        <span style={{ color: levelColor, fontWeight: 'bold' }}>{metrics.loadLevel.toUpperCase()}</span>
        <br />
        Score: {metrics.currentLoadScore.toFixed(3)}
        <br />
        --- Metrics ---
        <br />
        Raw Interactions: {metrics.rawInteractionScore.toFixed(2)}
        <br />
        Rate (sec): {metrics.velocityMetrics.totalInteractionRatePerSecond.toFixed(1)}
        <br />
        Typing (WPM): {metrics.typingSpeedWPM}
        <br />
        Mouse Active: {metrics.mouseActivityScore.toFixed(2)}
        <br />
        Scroll Active: {metrics.scrollActivityScore.toFixed(2)}
        <br />
        Errors: {metrics.errorRateIndicator.toFixed(2)}
        <br />
        Nav Freq: {metrics.navigationFrequencyScore.toFixed(2)}
        <br />
        Form Error Ratio: {metrics.complexityMetrics.formErrorRatio.toFixed(2)}
        <br />
        Focus Change: {metrics.complexityMetrics.rapidFocusChangeScore.toFixed(2)}
        <br />
        Erratic Mouse: {metrics.complexityMetrics.erraticMouseMovementsScore.toFixed(2)}
        <br />
        ---
        <details>
          <summary>Recent Events ({metrics.recentInteractions.length})</summary>
          <ul style={{ margin: 0, paddingLeft: '15px', maxHeight: '150px', overflowY: 'auto' }}>
            {metrics.recentInteractions.map((e, idx) => (
              <li key={idx} style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                [{new Date(e.timestamp).toLocaleTimeString()}]{' '}
                {e.type} ({e.targetId}){e.isError ? ' (ERROR)' : ''}
              </li>
            ))}
          </ul>
        </details>
      </div>
    );
  };

  /**
   * @returns {JSX.Element} The CognitiveLoadSensor component, providing context and rendering children.
   * Optionally renders a debug overlay.
   */
  return (
    <CognitiveLoadContext.Provider value={{ latestMetrics }}>
      {children}
      {renderDebugOverlay(latestMetrics)}
    </CognitiveLoadContext.Provider>
  );
};