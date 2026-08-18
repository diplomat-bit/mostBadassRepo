// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/cognitive_interface/hooks/useBiometricFeedback.ts
================================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';

/**
 * @typedef {Object} FaceExpression
 * @property {number} neutral - Confidence score for neutral expression.
 * @property {number} happy - Confidence score for happy expression.
 * @property {number} sad - Confidence score for sad expression.
 * @property {number} angry - Confidence score for angry expression.
 * @property {number} fearful - Confidence score for fearful expression.
 * @property {number} disgusted - Confidence score for disgusted expression.
 * @property {number} surprised - Confidence score for surprised expression.
 */

/**
 * @typedef {Object} BiometricFeedbackResult
 * @property {string} dominantExpression - The detected dominant facial expression (e.g., 'happy', 'neutral').
 * @property {FaceExpression | null} expressions - Raw confidence scores for each expression, or null if no face is detected.
 * @property {number} attentionScore - A normalized score (0-1) indicating attention level. Higher means more attentive.
 * @property {boolean} isCameraActive - True if the camera stream is currently active and processing.
 * @property {boolean} isLoading - True if AI models are loading or camera is initializing.
 * @property {string | null} error - Any error message encountered during setup or operation.
 * @property {React.RefObject<HTMLVideoElement>} videoRef - Ref to attach to a <video> element to display the camera feed.
 * @property {React.RefObject<HTMLCanvasElement>} canvasRef - Ref to attach to a <canvas> element for visualizing face detections.
 * @property {() => Promise<void>} startBiometricFeed - Function to explicitly start the biometric analysis feed.
 * @property {() => void} stopBiometricFeed - Function to explicitly stop the biometric analysis feed.
 */

/**
 * Configuration options for the biometric feedback hook.
 * @typedef {Object} BiometricFeedbackOptions
 * @property {string} [modelUrl='/models'] - URL path to the directory containing face-api.js models.
 *                                           These models must be available publicly (e.g., in a 'public/models' folder).
 * @property {number} [detectionInterval=500] - Interval in milliseconds for performing face detections.
 *                                              A smaller interval provides more real-time feedback but uses more CPU.
 * @property {number} [minConfidence=0.6] - Minimum confidence score required for a face detection to be considered valid.
 * @property {number} [inputSize=224] - Input size for the TinyFaceDetector (e.g., 160, 224, 320, 416, 512, 608).
 *                                     Smaller sizes are faster but may be less accurate for small faces.
 * @property {boolean} [enableDrawing=false] - Whether to draw bounding boxes, landmarks, and expressions on the canvas.
 *                                            Useful for debugging but can impact performance.
 * @property {boolean} [autoStart=false] - Whether to automatically start the biometric feed on component mount.
 */

// Define the models to be loaded. Using TinyFaceDetector for performance.
const MODEL_DETECTOR = faceapi.nets.tinyFaceDetector;
const MODEL_LANDMARKS = faceapi.nets.faceLandmark68Net;
const MODEL_EXPRESSIONS = faceapi.nets.faceExpressionNet;

/**
 * `useBiometricFeedback` is a sophisticated React hook designed for integrating real-time biometric analysis
 * (sentiment and attention) from a user's webcam feed into commercial-grade applications. It leverages the
 * open-source `face-api.js` library, built on TensorFlow.js, for client-side face detection, landmark identification,
 * and expression recognition without relying on paid third-party APIs for core AI processing.
 *
 * This hook handles webcam access, AI model loading, continuous frame analysis, and robust state management,
 * providing a comprehensive solution for interactive AI-powered UI features. It includes detailed error handling,
 * explicit control for starting and stopping the analysis, and a configurable drawing option for visualization.
 *
 * The attention score is a composite metric derived from factors like face presence, centrality within the frame,
 * an approximation of head pose (indicating gaze direction), and the intensity of detected facial expressions.
 * This provides a nuanced signal of user engagement.
 *
 * @param {BiometricFeedbackOptions} [options] - Configuration options to customize the hook's behavior.
 * @returns {BiometricFeedbackResult} An object containing real-time biometric analysis results, camera status,
 *                                  error information, refs for video and canvas elements, and control functions.
 */
export const useBiometricFeedback = (options?: BiometricFeedbackOptions) => {
    const {
        modelUrl = '/models',
        detectionInterval = 500,
        minConfidence = 0.6,
        inputSize = 224,
        enableDrawing = false,
        autoStart = false,
    } = options || {};

    // Refs for DOM elements and internal state management
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null); // To keep track of the active media stream
    const detectionIntervalIdRef = useRef<NodeJS.Timeout | null>(null); // To manage the detection loop
    const modelsLoadedRef = useRef(false); // Flag to ensure models are loaded only once

    // State variables for the biometric feedback results
    const [dominantExpression, setDominantExpression] = useState<string>('neutral');
    const [expressions, setExpressions] = useState<faceapi.FaceExpressions | null>(null);
    const [attentionScore, setAttentionScore] = useState<number>(0); // Normalized score from 0 to 1
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Initially true for model loading
    const [error, setError] = useState<string | null>(null);

    /**
     * Loads the required `face-api.js` neural network models.
     * This function is memoized to prevent unnecessary re-loading.
     * @private
     */
    const loadModels = useCallback(async () => {
        if (modelsLoadedRef.current) return; // Prevent re-loading if already loaded

        setError(null);
        setIsLoading(true);
        try {
            // Load all necessary models concurrently
            await Promise.all([
                MODEL_DETECTOR.loadFromUri(modelUrl),
                MODEL_LANDMARKS.loadFromUri(modelUrl),
                MODEL_EXPRESSIONS.loadFromUri(modelUrl),
            ]);
            modelsLoadedRef.current = true;
            console.info('face-api.js models loaded successfully from:', modelUrl);
        } catch (err) {
            console.error('Failed to load face-api.js models:', err);
            setError(`Failed to load AI models for biometric analysis. Please check network and model path: ${modelUrl}. Ensure models are in your public directory.`);
        } finally {
            setIsLoading(false);
        }
    }, [modelUrl]);

    /**
     * Initiates the webcam stream and attaches it to the video element for processing.
     * @private
     * @returns {Promise<void>}
     */
    const startCamera = useCallback(async () => {
        // If camera is already active, just confirm its state
        if (mediaStreamRef.current && mediaStreamRef.current.active) {
            console.log('Attempted to start camera, but it is already active.');
            setIsCameraActive(true);
            return;
        }

        if (!videoRef.current) {
            console.error('Video element ref is not available. Cannot start camera.');
            setError('Video element not found. Cannot start camera feed.');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            // Request access to the user's video input device
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            mediaStreamRef.current = stream;

            // Wait for the video metadata to be loaded to ensure dimensions are available
            await new Promise((resolve) => {
                videoRef.current!.onloadedmetadata = () => {
                    resolve(true);
                };
            });

            // Match canvas dimensions to video feed for accurate drawing
            if (canvasRef.current && videoRef.current) {
                const displaySize = {
                    width: videoRef.current.videoWidth,
                    height: videoRef.current.videoHeight,
                };
                faceapi.matchDimensions(canvasRef.current, displaySize);
            }
            setIsCameraActive(true);
            console.log('Camera stream started successfully and attached to video element.');
        } catch (err) {
            console.error('Failed to access webcam:', err);
            setError('Failed to access webcam. Please ensure permissions are granted and no other application is using the camera.');
            setIsCameraActive(false);
            // In case of error, ensure any half-initialized resources are cleaned up
            stopCamera();
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Stops the webcam stream and clears any active detection intervals.
     * @private
     */
    const stopCamera = useCallback(() => {
        // Stop all tracks in the media stream
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
            if (videoRef.current) {
                videoRef.current.srcObject = null; // Detach stream from video element
            }
        }
        setIsCameraActive(false);

        // Clear the detection interval
        if (detectionIntervalIdRef.current) {
            clearInterval(detectionIntervalIdRef.current);
            detectionIntervalIdRef.current = null;
        }

        // Reset all biometric feedback states
        setDominantExpression('neutral');
        setExpressions(null);
        setAttentionScore(0);
        console.log('Camera stream stopped and associated resources released.');
    }, []);

    /**
     * Performs real-time face detection, landmark analysis, and expression recognition on the video stream.
     * It also calculates a composite attention score.
     * @private
     */
    const performDetection = useCallback(async () => {
        // Guard conditions: video element must be ready, camera active, and models loaded.
        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || !isCameraActive || !modelsLoadedRef.current) {
            return;
        }

        try {
            const detectionOptions = new faceapi.TinyFaceDetectorOptions({
                inputSize: inputSize,
                scoreThreshold: minConfidence,
            });

            // Perform face detection with landmarks and expressions
            const fullFaceDescriptions = await faceapi
                .detectAllFaces(videoRef.current, detectionOptions)
                .withFaceLandmarks()
                .withFaceExpressions();

            if (fullFaceDescriptions.length > 0) {
                // For multiple faces, prioritize the largest face as the primary user
                const largestFace = fullFaceDescriptions.reduce((prev, current) =>
                    (prev.detection.box.area > current.detection.box.area ? prev : current)
                );

                const currentExpressions = largestFace.expressions;
                setExpressions(currentExpressions);

                // Determine the dominant expression
                const dominant = Object.keys(currentExpressions).reduce((a, b) =>
                    currentExpressions[a as keyof faceapi.FaceExpressions] > currentExpressions[b as keyof faceapi.FaceExpressions] ? a : b
                );
                setDominantExpression(dominant);

                // --- Comprehensive Attention Score Calculation ---
                // The attention score combines several indicators for a robust metric:
                // 1. Face Presence & Size: Is a face clearly visible and of a reasonable size in the frame?
                // 2. Centrality: Is the face generally centered, suggesting direct interaction?
                // 3. Head Pose (Gaze Approximation): Is the user looking towards the camera? (approximated via landmark positions)
                // 4. Expression Intensity: Stronger, clearer expressions (positive or negative) might indicate more active engagement.

                const { x, y, width, height } = largestFace.detection.box;
                const videoElement = videoRef.current;
                const viewportWidth = videoElement.videoWidth;
                const viewportHeight = videoElement.videoHeight;

                // 1. Face Presence & Size Score
                const faceAreaRatio = (width * height) / (viewportWidth * viewportHeight);
                const presenceScore = Math.min(1, faceAreaRatio * 5); // Scale up small faces, cap at 1

                // 2. Centrality Score
                const centerX = x + width / 2;
                const centerY = y + height / 2;
                const distanceX = Math.abs(centerX - viewportWidth / 2);
                const distanceY = Math.abs(centerY - viewportHeight / 2);
                const maxCenterDistance = Math.sqrt((viewportWidth / 2) ** 2 + (viewportHeight / 2) ** 2);
                const centralityScore = 1 - (Math.sqrt(distanceX ** 2 + distanceY ** 2) / maxCenterDistance);

                // 3. Head Pose (Gaze Approximation) Score
                // This is a simplified estimation of direct gaze using key facial landmarks.
                // It checks if eyes and nose are relatively aligned and centered, suggesting head-on view.
                const nosePoint = largestFace.landmarks.getNose()[3]; // Bridge of nose
                const jawCenter = largestFace.landmarks.getJawOutline()[8]; // Chin point
                const leftEyePoints = largestFace.landmarks.getLeftEye();
                const rightEyePoints = largestFace.landmarks.getRightEye();

                const getCenter = (points: faceapi.Point[]) => points.reduce((sum, p) => ({ x: sum.x + p.x, y: sum.y + p.y }), { x: 0, y: 0 });
                const leftEyeCenter = getCenter(leftEyePoints);
                const rightEyeCenter = getCenter(rightEyePoints);
                leftEyeCenter.x /= leftEyePoints.length; leftEyeCenter.y /= leftEyePoints.length;
                rightEyeCenter.x /= rightEyePoints.length; rightEyeCenter.y /= rightEyePoints.length;

                // Horizontal gaze: how far are eye centers from nose x?
                const avgEyeX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
                const gazeScoreX = 1 - (Math.abs(avgEyeX - nosePoint.x) / (width * 0.5)); // Normalized by half face width

                // Vertical gaze: how far are eye centers from nose y, relative to jaw?
                const eyeNoseDistY = Math.abs(avgEyeX - nosePoint.y); // Simplified vertical alignment
                const headPoseScore = Math.max(0, (gazeScoreX * 0.7 + (1 - (Math.abs(nosePoint.y - jawCenter.y) / height)) * 0.3)); // Weighted average

                // 4. Expression Intensity Score
                const totalExpressionConfidence = Object.values(currentExpressions).reduce((sum, val) => sum + val, 0);
                const expressionIntensityScore = totalExpressionConfidence / 7; // Normalize by number of expression categories

                // Combine all factors into a final attention score with weighted importance
                const combinedAttention = (
                    presenceScore * 0.35 +        // Strong emphasis on being present
                    centralityScore * 0.25 +      // Important for direct interaction
                    headPoseScore * 0.30 +        // Direct gaze is a key attention indicator
                    expressionIntensityScore * 0.10 // Active expressions contribute to engagement
                );

                setAttentionScore(Math.min(1, Math.max(0, combinedAttention))); // Clamp the score between 0 and 1

            } else {
                // No face detected, reset states
                setDominantExpression('neutral');
                setExpressions(null);
                setAttentionScore(0);
            }

            // Optional: Draw detections on the canvas for visual feedback/debugging
            if (enableDrawing && canvasRef.current && videoRef.current) {
                const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
                faceapi.matchDimensions(canvasRef.current, displaySize); // Ensure canvas matches video size
                const resizedDetections = faceapi.resizeResults(fullFaceDescriptions, displaySize);
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, displaySize.width, displaySize.height); // Clear previous drawings
                    if (fullFaceDescriptions.length > 0) {
                        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                        faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
                    }
                }
            } else if (canvasRef.current && videoRef.current) {
                // If drawing is disabled or no faces are detected, ensure the canvas is clear
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
                    faceapi.matchDimensions(canvasRef.current, displaySize);
                    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
                }
            }
        } catch (err) {
            console.warn('Error during biometric detection frame:', err);
            // This can happen due to transient issues (e.g., sudden movement).
            // We log a warning but don't stop the feed or set a global error
            // unless it's a persistent problem.
        }
    }, [isCameraActive, inputSize, minConfidence, enableDrawing, detectionInterval]); // Add detectionInterval as dependency to ensure interval restarts if it changes

    /**
     * Public API function to explicitly start the biometric feedback process.
     * This involves loading models and then starting the camera and detection loop.
     * @returns {Promise<void>}
     */
    const startBiometricFeed = useCallback(async () => {
        if (isCameraActive && modelsLoadedRef.current) {
            console.log('Biometric feed is already running.');
            return;
        }

        setIsLoading(true);
        await loadModels(); // Ensure models are loaded first
        if (modelsLoadedRef.current) {
            await startCamera(); // Then start the camera
        }
        // setIsLoading(false) is handled by loadModels and startCamera finally blocks
    }, [isCameraActive, loadModels, startCamera]);

    /**
     * Public API function to explicitly stop the biometric feedback process.
     * This stops the camera stream and cleans up all related resources.
     * @returns {void}
     */
    const stopBiometricFeed = useCallback(() => {
        stopCamera();
    }, [stopCamera]);


    // --- Effect Hooks ---

    // Effect for initial model loading and optional auto-start behavior.
    useEffect(() => {
        // Load models immediately on mount
        loadModels();

        // If autoStart is enabled, initiate the feed after a short delay
        // to allow models to begin loading.
        if (autoStart) {
            const timeoutId = setTimeout(() => {
                startBiometricFeed();
            }, 100); // Small delay to prevent race conditions with model loading
            return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
        }
    }, [autoStart, loadModels, startBiometricFeed]);

    // Effect for managing the face detection interval based on camera activity.
    useEffect(() => {
        if (isCameraActive && modelsLoadedRef.current && videoRef.current) {
            // Clear any existing interval to prevent duplicates
            if (detectionIntervalIdRef.current) {
                clearInterval(detectionIntervalIdRef.current);
            }

            // Function to start the detection interval once video metadata is loaded
            const handleVideoPlay = () => {
                console.log('Video stream is ready; starting biometric detection interval.');
                detectionIntervalIdRef.current = setInterval(performDetection, detectionInterval);
            };

            // Check if video is already playing or ready, otherwise wait for 'play' event
            if (videoRef.current.readyState >= 2) { // HTMLMediaElement.HAVE_CURRENT_DATA
                handleVideoPlay();
            } else {
                videoRef.current.addEventListener('play', handleVideoPlay, { once: true });
            }

            // Cleanup function for this effect: clear interval and remove event listener
            return () => {
                if (detectionIntervalIdRef.current) {
                    clearInterval(detectionIntervalIdRef.current);
                }
                if (videoRef.current) {
                    videoRef.current.removeEventListener('play', handleVideoPlay);
                }
                detectionIntervalIdRef.current = null;
            };
        } else {
            // If camera is not active or models not loaded, ensure interval is cleared
            if (detectionIntervalIdRef.current) {
                clearInterval(detectionIntervalIdRef.current);
                detectionIntervalIdRef.current = null;
            }
        }
    }, [isCameraActive, performDetection, detectionInterval]);

    // Cleanup effect: Ensure all resources are released when the component unmounts.
    useEffect(() => {
        return () => {
            console.log('useBiometricFeedback hook unmounted. Stopping biometric feed.');
            stopBiometricFeed();
        };
    }, [stopBiometricFeed]); // Dependency on stopBiometricFeed ensures it's always the latest version


    // --- Return Value ---
    return {
        dominantExpression,
        expressions,
        attentionScore,
        isCameraActive,
        isLoading,
        error,
        videoRef,
        canvasRef,
        startBiometricFeed,
        stopBiometricFeed,
    };
};