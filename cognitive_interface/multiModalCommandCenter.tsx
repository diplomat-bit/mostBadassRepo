// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/cognitive_interface/multiModalCommandCenter.tsx
================================================================================

import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';

// Minimal definitions to satisfy type checking for external dependencies,
// assuming these interfaces/classes exist in their respective files within the project structure.

// From components/contexts/FinancialVoiceContext.tsx
interface VoiceCommand {
    id: string;
    command: string;
    timestamp: Date;
}
interface FinancialVoiceContextType {
    isListening: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
    voiceCommands: VoiceCommand[];
}
const FinancialVoiceContext = React.createContext<FinancialVoiceContextType>({
    isListening: false,
    transcript: '',
    startListening: () => { console.log("Voice listening started (mock)"); },
    stopListening: () => { console.log("Voice listening stopped (mock)"); },
    resetTranscript: () => { console.log("Voice transcript reset (mock)"); },
    voiceCommands: [],
});

// From google/ai_studio/services/GeminiService.ts
class GeminiService {
    async processMultimodalInput(data: { prompt: string; context: any; rawInputs: any }): Promise<any> {
        console.log("GeminiService: Processing multimodal input with data:", data);
        // Simulate a sophisticated AI response structure, including insights and suggested actions.
        // In a real application, this would involve an actual API call to Gemini/ChatGPT.
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    data: {
                        status: 'success',
                        message: `AI's comprehensive interpretation of your multimodal request: "${data.prompt.substring(0, 100)}..."`,
                        insights: {
                            summary: `Leveraging your inputs from text "${data.rawInputs.text}", voice "${data.rawInputs.voice}", and gesture "${data.rawInputs.gesture?.description || 'N/A'}", AI identified the core intent as a data inquiry related to financial performance.`,
                            sentiment: "Neutral to slightly analytical",
                            entities: ["financial performance", "multimodal input", "data inquiry", data.rawInputs.text, data.rawInputs.voice],
                            contextualRelevance: "High, given the current application view and user preferences.",
                            potentialRisks: "None immediately apparent, but misinterpretation could lead to irrelevant data retrieval.",
                            strategicValue: "Enhances user interaction efficiency by consolidating diverse input streams."
                        },
                        suggestedActions: [
                            { label: "Display Financial Overview Dashboard", action: "NAVIGATE", params: { path: "/dashboard/finance" } },
                            { label: "Generate Trend Analysis Report", action: "GENERATE_REPORT", params: { type: "financial_trends", period: "last 12 months" } },
                            { label: "Schedule a Follow-up with AI Advisor", action: "SCHEDULE_CONSULTATION", params: { topic: "multimodal command optimization" } },
                            { label: "Refine Gesture Recognition Model", action: "INITIATE_ML_TASK", params: { model_id: "gesture_rec_v2", feedback_data: data.rawInputs.gesture } }
                        ],
                        rawAIOutput: {
                            model: "Gemini-Pro-Multimodal-v1.2",
                            timestamp: new Date().toISOString(),
                            tokenUsage: { prompt: 250, completion: 120 }
                        }
                    }
                });
            }, 1800); // Simulate network latency and AI processing time
        });
    }
}

// From ai/promptLibrary.ts
const promptLibrary = {
    getMultimodalAnalysisPrompt: (inputs: any) => {
        let promptText = `As a sophisticated AI system, your task is to fuse and interpret the following multimodal user inputs. Your goal is to understand the user's deep intent, provide actionable insights, and suggest concrete next steps.
        
        Prioritize explicit textual commands, followed by clear voice commands, and finally contextual gestures. If inputs conflict, identify the most dominant intent.
        
        User Inputs:
        - Text Input: "${inputs.text || 'None'}"
        - Voice Input: "${inputs.voice || 'None'}"
        - Gesture Input: "${inputs.gesture?.description || 'None'}" (Type: ${inputs.gesture?.type || 'N/A'}, Raw Coordinates: ${inputs.gesture?.coordinates || 'N/A'})
        
        Current Application Context:
        - Current Page: ${inputs.context.currentPage}
        - Current View State: ${inputs.context.currentView ? JSON.stringify(inputs.context.currentView, null, 2) : 'N/A'}
        - User Preferences: ${inputs.context.userPreferences ? JSON.stringify(inputs.context.userPreferences, null, 2) : 'N/A'}
        
        Based on this, generate a comprehensive analysis in a structured JSON format containing:
        1.  A concise 'message' summarizing the interpreted user intent and the AI's understanding.
        2.  An 'insights' object with detailed analysis (e.g., summary, sentiment, key entities, contextual relevance, potential risks, strategic value).
        3.  A 'suggestedActions' array, where each action is an object with 'label' (for UI display), 'action' (an internal command identifier), and 'params' (a JSON object with parameters for the action).
        4.  A 'rawAIOutput' object for diagnostic purposes.
        
        Ensure the response is commercial-grade, precise, and directly actionable within an enterprise financial management system.`;

        return {
            promptText: promptText,
            context: inputs.context,
        };
    }
};

// From components/AIInsights.tsx
const AIInsights: React.FC<{ insights: any }> = ({ insights }) => {
    if (!insights || Object.keys(insights).length === 0) return (
        <div className="text-gray-400 italic mt-2">No detailed insights available.</div>
    );
    return (
        <div className="bg-gray-700 p-3 rounded-md mt-2 border border-gray-600 space-y-2 text-sm">
            {insights.summary && <p className="text-gray-300"><span className="font-semibold text-teal-200">Summary:</span> <span className="text-white">{insights.summary}</span></p>}
            {insights.sentiment && <p className="text-gray-300"><span className="font-semibold text-teal-200">Sentiment:</span> <span className="text-white">{insights.sentiment}</span></p>}
            {insights.entities && insights.entities.length > 0 && <p className="text-gray-300"><span className="font-semibold text-teal-200">Entities:</span> <span className="text-white">{insights.entities.join(', ')}</span></p>}
            {insights.contextualRelevance && <p className="text-gray-300"><span className="font-semibold text-teal-200">Contextual Relevance:</span> <span className="text-white">{insights.contextualRelevance}</span></p>}
            {insights.potentialRisks && <p className="text-gray-300"><span className="font-semibold text-teal-200">Potential Risks:</span> <span className="text-white">{insights.potentialRisks}</span></p>}
            {insights.strategicValue && <p className="text-gray-300"><span className="font-semibold text-teal-200">Strategic Value:</span> <span className="text-white">{insights.strategicValue}</span></p>}
            {insights.rawAIOutput && (
                <div className="pt-2 mt-2 border-t border-gray-600">
                    <p className="font-semibold text-teal-200">Raw AI Output Details:</p>
                    <pre className="bg-gray-800 p-2 rounded text-xs overflow-x-auto text-gray-400 mt-1">
                        {JSON.stringify(insights.rawAIOutput, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

// From components/AIAdvisorView.tsx (placeholder component for broader AI integration)
const AIAdvisorView: React.FC = () => {
    // This component would typically render a more extensive AI assistant interface,
    // potentially a chat window or a dashboard of active AI recommendations.
    // For the purpose of this file, it serves as an integration point.
    return (
        <div className="absolute bottom-4 right-4 p-3 bg-indigo-900 rounded-lg shadow-xl text-xs text-white opacity-70 border border-indigo-700">
            <span className="font-bold">AI Advisor:</span> Operational
        </div>
    );
};

// From components/AIDynamicKpiButton.tsx (placeholder component for AI-driven KPI display)
const AIDynamicKpiButton: React.FC<{ kpiName: string; value: any }> = ({ kpiName, value }) => {
    // This component would dynamically display and update Key Performance Indicators
    // often driven by real-time data or AI analysis.
    return (
        <button className="bg-purple-700 hover:bg-purple-800 text-white text-xs py-1.5 px-3 rounded-full transition duration-200 shadow-md">
            <span className="font-semibold">{kpiName}:</span> <span className="font-bold text-lg">{value}</span>
        </button>
    );
};

// From components/notifications/AlertActionCenter.tsx
const AlertActionCenter = {
    addNotification: (notification: { id: string; message: string; type: 'info' | 'error' | 'warning'; actions?: { label: string; handler: () => void }[] }) => {
        console.log(`[AlertActionCenter] Notification (${notification.type}): ${notification.message}`);
        if (notification.actions) {
            notification.actions.forEach(action => console.log(` - Action: ${action.label}`));
        }
        // In a full application, this would dispatch to a global notification state
        // and render a toast or a modal.
    }
};

// From components/preferences/usePreferences.ts
interface UserPreferences {
    theme: 'dark' | 'light';
    aiAssistanceLevel: 'low' | 'medium' | 'high';
    preferredLanguage: string;
    // Add more user preferences relevant to a fortune 500 company app
    dataPrivacyConsent: boolean;
    realtimeAnalytics: boolean;
    voiceFeedbackEnabled: boolean;
    gestureSensitivity: 'low' | 'medium' | 'high';
}

const usePreferences = () => {
    const [preferences, setPreferences] = useState<UserPreferences>({
        theme: 'dark',
        aiAssistanceLevel: 'high',
        preferredLanguage: 'en',
        dataPrivacyConsent: true,
        realtimeAnalytics: true,
        voiceFeedbackEnabled: true,
        gestureSensitivity: 'medium',
    });

    useEffect(() => {
        // Simulate loading preferences from a backend or local storage
        console.log("Loading user preferences...");
        // In a real app, this would fetch from an API or localStorage
    }, []);

    const updatePreference = (key: keyof UserPreferences, value: any) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        console.log(`Preference "${key}" updated to "${value}"`);
        // In a real app, this would persist the preference to a backend
    };

    return { preferences, updatePreference };
};

// From components/components/hooks/useMultiversalState.ts (assuming a global state management hook)
interface GlobalState {
    currentView: string;
    insights: any[];
    activeNotifications: any[];
    userContext: {
        department: string;
        role: string;
        accessLevel: 'admin' | 'user' | 'guest';
    };
    // Add more global state properties relevant to a complex enterprise application
    activeKpis: Record<string, number>;
    featureFlags: Record<string, boolean>;
}

interface GlobalAction {
    type: string;
    payload?: any;
}

const useMultiversalState = () => {
    const [state, setState] = useState<GlobalState>({
        currentView: 'MultimodalCommandCenter',
        insights: [],
        activeNotifications: [],
        userContext: {
            department: 'Finance',
            role: 'Senior Analyst',
            accessLevel: 'admin',
        },
        activeKpis: {
            'Multimodal Interaction Rate': 0,
            'AI Action Success Rate': 0,
        },
        featureFlags: {
            geminiIntegration: true,
            quantumShieldActive: false,
        }
    });

    const dispatch = useCallback((action: GlobalAction) => {
        console.log("[GlobalState] Dispatching action:", action.type, action.payload);
        setState(prev => {
            switch (action.type) {
                case 'ADD_INSIGHTS':
                    return { ...prev, insights: [...prev.insights, action.payload] };
                case 'UPDATE_VIEW':
                    return { ...prev, currentView: action.payload };
                case 'ADD_NOTIFICATION':
                    return { ...prev, activeNotifications: [...prev.activeNotifications, action.payload] };
                case 'UPDATE_KPI':
                    return { ...prev, activeKpis: { ...prev.activeKpis, ...action.payload } };
                // Add more complex state transformations here
                default:
                    return prev;
            }
        });
    }, []);

    return { state, dispatch };
};

// From features/CommandPaletteTrigger.tsx (for global command access)
const CommandPaletteTrigger: React.FC = () => {
    const handleTrigger = () => {
        console.log("Command Palette Triggered (simulated)!");
        AlertActionCenter.addNotification({
            id: 'command-palette-triggered',
            message: 'Command Palette opened for quick access.',
            type: 'info',
        });
        // In a real app, this would open a global command palette modal
    };
    return (
        <button
            onClick={handleTrigger}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs py-1.5 px-3 rounded-full transition duration-200 shadow-md"
        >
            Press <span className="font-bold">Ctrl+K</span> for Command Palette
        </button>
    );
};

// Main component starts here
interface GestureData {
    type: 'swipe' | 'tap' | 'zoom' | 'draw' | 'scroll' | 'unknown';
    direction?: 'up' | 'down' | 'left' | 'right';
    coordinates?: { x: number; y: number }[]; // For draw gestures
    scale?: number; // For zoom gestures
    description: string; // A natural language description of the gesture
    timestamp: number;
}

interface CommandHistoryEntry {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    modality?: 'text' | 'voice' | 'gesture' | 'multimodal';
    rawInputs?: {
        text?: string;
        voice?: string;
        gesture?: GestureData;
    };
    aiInterpretation?: string;
    aiAction?: any; // Structured data for AI-driven actions
}

interface AIResponse {
    status: 'success' | 'error' | 'info';
    message: string;
    insights?: any; // Detailed insights from AI
    suggestedActions?: { label: string; action: string; params: any }[];
    commandProcessed?: boolean;
    data?: any; // Any structured data returned by AI
    rawAIOutput?: any; // Raw output for debugging/advanced display
}

const MAX_COMMAND_HISTORY = 200; // Increased history for "megabyte of data"

const MultiModalCommandCenter: React.FC = () => {
    const { state: globalState, dispatch: globalDispatch } = useMultiversalState();
    const { preferences } = usePreferences();
    const { isListening, transcript, startListening, stopListening, resetTranscript, voiceCommands } = useContext(FinancialVoiceContext);

    const [textInput, setTextInput] = useState<string>('');
    const [currentVoiceInput, setCurrentVoiceInput] = useState<string>('');
    const [currentGestureInput, setCurrentGestureInput] = useState<GestureData | null>(null);
    const [isRecordingGesture, setIsRecordingGesture] = useState<boolean>(false);
    const [commandHistory, setCommandHistory] = useState<CommandHistoryEntry[]>([]);
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const gestureCanvasRef = useRef<HTMLCanvasElement>(null);
    const gestureDrawing = useRef<boolean>(false);
    const gesturePoints = useRef<{ x: number; y: number }[]>([]);
    const geminiService = useRef(new GeminiService()); // Initialize Gemini Service for AI calls

    // Effect to update current voice input as transcript changes
    useEffect(() => {
        if (transcript) {
            setCurrentVoiceInput(transcript);
        }
    }, [transcript]);

    // Handle incoming voice commands from context
    useEffect(() => {
        if (voiceCommands && voiceCommands.length > 0) {
            const latestCommand = voiceCommands[voiceCommands.length - 1];
            console.log("Voice command detected from context:", latestCommand.command);
            setCurrentVoiceInput(latestCommand.command);
            // Optionally, automatically trigger processing if the command is considered 'complete' by voice system
            // For now, it waits for explicit "Process All Inputs" button click or text submit.
        }
    }, [voiceCommands]); // Removed textInput, currentGestureInput to prevent infinite loop

    const addCommandToHistory = useCallback((entry: CommandHistoryEntry) => {
        setCommandHistory(prevHistory => {
            const newHistory = [...prevHistory, entry];
            if (newHistory.length > MAX_COMMAND_HISTORY) {
                return newHistory.slice(newHistory.length - MAX_COMMAND_HISTORY); // Maintain max history size
            }
            return newHistory;
        });
    }, []);

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Check if any input is provided before processing
        if (textInput.trim() === '' && currentVoiceInput.trim() === '' && !currentGestureInput) {
            setError("Please provide some input (text, voice, or gesture) to process.");
            return;
        }
        processMultimodalCommand(textInput, currentVoiceInput, currentGestureInput);
    };

    const startGestureRecording = () => {
        setIsRecordingGesture(true);
        gesturePoints.current = []; // Clear previous points
        const canvas = gestureCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas visually
                ctx.beginPath();
                ctx.strokeStyle = preferences.theme === 'dark' ? '#007bff' : '#0056b3'; // Dynamic color
                ctx.lineWidth = 3;
            }
        }
        setCurrentGestureInput(null); // Clear previous conceptual gesture data
        setError(null);
        AlertActionCenter.addNotification({
            id: 'gesture-start',
            message: 'Gesture recording started. Draw on the canvas.',
            type: 'info',
        });
    };

    const stopGestureRecording = () => {
        setIsRecordingGesture(false);
        if (gesturePoints.current.length > 0) {
            const { type, description, extraData } = interpretGesturePoints(gesturePoints.current);
            const newGesture: GestureData = {
                type,
                description,
                timestamp: Date.now(),
                coordinates: gesturePoints.current,
                ...extraData,
            };
            setCurrentGestureInput(newGesture);
            addCommandToHistory({
                id: `gesture-${Date.now()}`,
                type: 'user',
                content: `Gesture recorded: ${newGesture.description} (${newGesture.type})`,
                modality: 'gesture',
                rawInputs: { gesture: newGesture },
                timestamp: new Date(),
            });
            AlertActionCenter.addNotification({
                id: 'gesture-recorded',
                message: `Gesture "${newGesture.description}" recorded successfully.`,
                type: 'info',
            });
        } else {
            AlertActionCenter.addNotification({
                id: 'gesture-none',
                message: 'No gesture detected during recording session.',
                type: 'warning',
            });
        }
        gestureDrawing.current = false;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isRecordingGesture || !gestureCanvasRef.current) return;
        gestureDrawing.current = true;
        const rect = gestureCanvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gesturePoints.current.push({ x, y });
        const ctx = gestureCanvasRef.current.getContext('2d');
        if (ctx) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + 0.5, y + 0.5); // Draw a point if no movement
            ctx.stroke();
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isRecordingGesture || !gestureDrawing.current || !gestureCanvasRef.current) return;
        const rect = gestureCanvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gesturePoints.current.push({ x, y });
        const ctx = gestureCanvasRef.current.getContext('2d');
        if (ctx) {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const handleMouseUp = () => {
        if (!isRecordingGesture) return; // Only stop drawing if actually recording
        gestureDrawing.current = false;
    };

    // Advanced gesture interpretation logic (conceptual for commercial grade)
    const interpretGesturePoints = (points: { x: number; y: number }[]): { type: GestureData['type'], description: string, extraData?: any } => {
        if (points.length < 2) {
            return { type: 'tap', description: 'A single tap or click was performed.', extraData: { precision: 'high' } };
        }

        const start = points[0];
        const end = points[points.length - 1];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const totalDistance = points.reduce((acc, point, i) => {
            if (i === 0) return acc;
            const prev = points[i - 1];
            return acc + Math.sqrt(Math.pow(point.x - prev.x, 2) + Math.pow(point.y - prev.y, 2));
        }, 0);
        const straightLineDistance = Math.sqrt(dx * dx + dy * dy);

        // Basic classification thresholds (configurable via preferences.gestureSensitivity)
        const minSwipeDistance = preferences.gestureSensitivity === 'high' ? 15 : preferences.gestureSensitivity === 'medium' ? 30 : 50;
        const minDrawComplexity = preferences.gestureSensitivity === 'high' ? 50 : preferences.gestureSensitivity === 'medium' ? 100 : 150;
        const straightnessThreshold = preferences.gestureSensitivity === 'high' ? 0.95 : preferences.gestureSensitivity === 'medium' ? 0.8 : 0.7; // Ratio of straight line distance to total path

        if (totalDistance < minSwipeDistance) {
            return { type: 'tap', description: 'A short touch or click gesture.', extraData: { duration: 'short' } };
        }

        // Check for swipes
        if (straightLineDistance / totalDistance > straightnessThreshold) {
            const angle = Math.atan2(dy, dx) * 180 / Math.PI; // -180 to 180
            if (angle > -45 && angle <= 45) return { type: 'swipe', direction: 'right', description: 'A horizontal swipe to the right.' };
            if (angle > 45 && angle <= 135) return { type: 'swipe', direction: 'down', description: 'A vertical swipe downwards.' };
            if (angle > 135 || angle <= -135) return { type: 'swipe', direction: 'left', description: 'A horizontal swipe to the left.' };
            if (angle > -135 && angle <= -45) return { type: 'swipe', direction: 'up', description: 'A vertical swipe upwards.' };
        }

        // Check for more complex shapes like circles or specific patterns
        // This would involve pattern recognition algorithms, e.g., Fourier descriptors, dynamic time warping
        if (totalDistance > minDrawComplexity) {
            // Simple example: check if it's roughly a circle
            const boundingBox = {
                minX: Math.min(...points.map(p => p.x)),
                maxX: Math.max(...points.map(p => p.x)),
                minY: Math.min(...points.map(p => p.y)),
                maxY: Math.max(...points.map(p => p.y)),
            };
            const width = boundingBox.maxX - boundingBox.minX;
            const height = boundingBox.maxY - boundingBox.minY;
            if (Math.abs(width - height) < (width * 0.3) && width > minSwipeDistance * 2) { // Roughly square bounding box, large enough
                // Further checks for circular path (e.g., distance from center varies consistently)
                return { type: 'draw', description: 'A complex drawing, possibly a circle or an abstract shape.', extraData: { shape: 'circular-like' } };
            }
            return { type: 'draw', description: 'A free-form drawing or signature.', extraData: { complexity: totalDistance } };
        }

        return { type: 'unknown', description: 'An ambiguous gesture that could not be clearly classified.', extraData: { rawLength: totalDistance } };
    };


    const processMultimodalCommand = useCallback(async (text: string, voice: string, gesture: GestureData | null) => {
        setIsLoading(true);
        setError(null);
        setAiResponse(null);

        const currentTimestamp = new Date();
        const rawText = text.trim();
        const rawVoice = voice.trim();

        const combinedInput = {
            text: rawText,
            voice: rawVoice,
            gesture: gesture ? {
                type: gesture.type,
                description: gesture.description,
                coordinates: gesture.coordinates?.map(p => `(${p.x},${p.y})`).join('; ') || 'N/A', // Flatten coordinates for prompt
                extraData: gesture.extraData || {}
            } : null,
            context: {
                currentPage: globalState.currentView, // Using global state for current view
                userPreferences: preferences,
                userProfile: globalState.userContext, // Passing user profile from global state
                timestamp: currentTimestamp.toISOString(),
            }
        };

        const modalityUsed = [];
        if (rawText) modalityUsed.push('text');
        if (rawVoice) modalityUsed.push('voice');
        if (gesture) modalityUsed.push('gesture');

        if (modalityUsed.length === 0) {
            setError("No input detected across any modality. Please provide text, voice, or a gesture.");
            setIsLoading(false);
            return;
        }

        const userCommandEntry: CommandHistoryEntry = {
            id: `cmd-${Date.now()}`,
            type: 'user',
            content: `User Input: ${rawText ? `"${rawText}" ` : ''}${rawVoice ? `(Voice: "${rawVoice}") ` : ''}${gesture ? `(Gesture: ${gesture.description})` : ''}`,
            modality: modalityUsed.length > 1 ? 'multimodal' : (modalityUsed[0] || 'unknown'),
            rawInputs: { text: rawText, voice: rawVoice, gesture: gesture || undefined },
            timestamp: currentTimestamp,
        };
        addCommandToHistory(userCommandEntry);

        try {
            // Construct a sophisticated prompt using promptLibrary
            const multimodalPrompt = promptLibrary.getMultimodalAnalysisPrompt(combinedInput);

            // Call the AI service
            const response = await geminiService.current.processMultimodalInput({
                prompt: multimodalPrompt.promptText,
                context: multimodalPrompt.context,
                rawInputs: combinedInput
            });

            const processedAiResponse: AIResponse = response.data; // Assuming response.data is AIResponse structure

            setAiResponse(processedAiResponse);

            addCommandToHistory({
                id: `ai-resp-${Date.now()}`,
                type: 'ai',
                content: processedAiResponse.message || "AI processed the command, no explicit message.",
                aiInterpretation: processedAiResponse.insights?.summary || processedAiResponse.message,
                aiAction: processedAiResponse.suggestedActions,
                timestamp: new Date(),
            });

            // Update global state and trigger notifications based on AI response
            if (processedAiResponse.insights) {
                globalDispatch({ type: 'ADD_INSIGHTS', payload: processedAiResponse.insights });
                AlertActionCenter.addNotification({
                    id: `ai-insights-${Date.now()}`,
                    message: processedAiResponse.insights.summary || 'New AI insights generated.',
                    type: 'info',
                });
            }
            if (processedAiResponse.suggestedActions && processedAiResponse.suggestedActions.length > 0) {
                processedAiResponse.suggestedActions.forEach(action => {
                    // This is where real application logic for AI-driven actions would go
                    console.log(`AI suggested action: ${action.label} with params:`, action.params);
                    AlertActionCenter.addNotification({
                        id: `ai-suggestion-${Date.now()}-${action.action}`,
                        message: `AI Suggestion: ${action.label}`,
                        type: 'info',
                        actions: [{
                            label: 'Execute Action',
                            handler: () => {
                                // Simulate execution of the AI-suggested action
                                console.log(`Executing AI action: ${action.action} with ${JSON.stringify(action.params)}`);
                                AlertActionCenter.addNotification({
                                    id: `action-executed-${Date.now()}`,
                                    message: `Action "${action.label}" executed.`,
                                    type: 'success',
                                });
                                // Example: dispatching to global state for navigation
                                if (action.action === "NAVIGATE" && action.params?.path) {
                                    globalDispatch({ type: 'UPDATE_VIEW', payload: action.params.path });
                                }
                                // Example: updating a KPI
                                if (action.action === "GENERATE_REPORT") {
                                    globalDispatch({ type: 'UPDATE_KPI', payload: { 'AI Action Success Rate': (globalState.activeKpis['AI Action Success Rate'] || 0) + 1 } });
                                }
                            }
                        }]
                    });
                });
            }
            // Update multimodal interaction KPI
            globalDispatch({ type: 'UPDATE_KPI', payload: { 'Multimodal Interaction Rate': (globalState.activeKpis['Multimodal Interaction Rate'] || 0) + 1 } });

        } catch (err) {
            console.error("Error processing multimodal command:", err);
            const errorMessage = `Failed to process command: ${err instanceof Error ? err.message : String(err)}. Please try again or refine your input.`;
            setError(errorMessage);
            AlertActionCenter.addNotification({
                id: 'multimodal-error',
                message: errorMessage,
                type: 'error',
            });
            addCommandToHistory({
                id: `ai-err-${Date.now()}`,
                type: 'ai',
                content: `Error processing command: ${errorMessage}`,
                timestamp: new Date(),
                status: 'error',
            });
        } finally {
            setIsLoading(false);
            // Clear inputs after processing for a fresh start, voice transcript might linger for user to review
            setTextInput('');
            setCurrentGestureInput(null);
            resetTranscript(); // Reset Web Speech API transcript state in context
        }
    }, [addCommandToHistory, globalState.currentView, preferences, globalState.userContext, globalDispatch, resetTranscript, globalState.activeKpis]);

    // Use Web Speech API for voice listening if available
    useEffect(() => {
        // This useEffect is primarily for initial setup or cleanup if needed
        // Voice context already handles the core listening logic.
        return () => {
            // Cleanup function if necessary, e.g., stop listening when component unmounts
            if (isListening) {
                stopListening();
            }
        };
    }, [isListening, stopListening]);

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-gray-100 p-8 overflow-hidden font-sans">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-8 text-center drop-shadow-lg">
                Omni-Modal Command Nexus
            </h1>

            {/* Input Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Text Input */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
                    <h2 className="text-2xl font-semibold text-blue-300 mb-4 flex items-center">
                        <span className="mr-2">📝</span> Text Command
                    </h2>
                    <form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
                        <textarea
                            className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y h-32 text-base shadow-inner"
                            placeholder="Enter your financial query, command, or request here..."
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            disabled={isLoading}
                            aria-label="Text input for commands"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg disabled:opacity-40 disabled:cursor-not-allowed text-lg"
                            disabled={isLoading || textInput.trim() === ''}
                        >
                            Submit Text
                        </button>
                    </form>
                </div>

                {/* Voice Input */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-green-500 transition-all duration-300">
                    <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
                        <span className="mr-2">🎤</span> Voice Command
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg text-lg ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white disabled:opacity-40`}
                            disabled={isLoading}
                            aria-label={isListening ? 'Stop voice listening' : 'Start voice listening'}
                        >
                            {isListening ? 'Stop Listening' : 'Start Listening'}
                        </button>
                        <span className={`text-sm font-medium ${isListening ? 'text-green-400 animate-pulse' : 'text-gray-400'}`}>
                            Status: {isListening ? 'Actively Listening...' : 'Idle'}
                        </span>
                    </div>
                    <div className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 min-h-[128px] overflow-y-auto text-base italic placeholder-gray-400 shadow-inner">
                        {currentVoiceInput || "Voice transcript will appear here as you speak..."}
                    </div>
                </div>

                {/* Gesture Input */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <h2 className="text-2xl font-semibold text-purple-300 mb-4 flex items-center">
                        <span className="mr-2">👋</span> Gesture Input
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={isRecordingGesture ? stopGestureRecording : startGestureRecording}
                            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg text-lg ${isRecordingGesture ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} text-white disabled:opacity-40`}
                            disabled={isLoading}
                            aria-label={isRecordingGesture ? 'Stop gesture recording' : 'Record new gesture'}
                        >
                            {isRecordingGesture ? 'Stop Gesture' : 'Record Gesture'}
                        </button>
                        <span className={`text-sm font-medium ${isRecordingGesture ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`}>
                            Status: {isRecordingGesture ? 'Recording...' : 'Idle'}
                        </span>
                    </div>
                    <canvas
                        ref={gestureCanvasRef}
                        width="380" // Fixed width to ensure consistency
                        height="128" // Fixed height for consistent gesture area
                        className="w-full border border-gray-600 rounded-lg bg-gray-700 cursor-crosshair shadow-inner"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp} // Stop drawing if mouse leaves canvas
                        aria-label="Gesture recording canvas"
                    ></canvas>
                    {currentGestureInput && (
                        <p className="mt-3 text-sm text-gray-300">
                            Detected Gesture: <span className="font-medium text-purple-200">{currentGestureInput.description}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Central Processing Button */}
            <div className="mb-8 flex justify-center">
                <button
                    onClick={() => processMultimodalCommand(textInput, currentVoiceInput, currentGestureInput)}
                    className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-extrabold py-4 px-10 rounded-full shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed text-xl tracking-wide"
                    disabled={isLoading || (textInput.trim() === '' && currentVoiceInput.trim() === '' && !currentGestureInput)}
                    aria-label="Process all available inputs with AI"
                >
                    {isLoading ? 'Fusing and Analyzing Inputs with AI...' : 'Process All Inputs (Multimodal AI)'}
                </button>
            </div>

            {/* Status, Error, and AI Feedback */}
            {isLoading && (
                <div className="flex items-center justify-center text-blue-400 mb-6 animate-pulse text-lg font-medium">
                    <svg className="animate-spin h-6 w-6 mr-3 text-blue-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI is processing your request...
                </div>
            )}
            {error && (
                <div className="bg-red-800 text-red-100 p-4 rounded-lg mb-6 flex items-center justify-between shadow-xl border border-red-700">
                    <span className="font-semibold text-lg flex items-center"><span className="mr-2 text-xl">❗</span> Error: {error}</span>
                    <button onClick={() => setError(null)} className="ml-4 text-red-200 hover:text-red-50 text-sm opacity-80 hover:opacity-100 transition-opacity">Dismiss</button>
                </div>
            )}
            {aiResponse && (
                <div className={`p-6 rounded-lg mb-8 shadow-2xl border ${aiResponse.status === 'error' ? 'bg-red-800 border-red-700' : (aiResponse.status === 'success' ? 'bg-green-800 border-green-700' : 'bg-blue-800 border-blue-700')}`}>
                    <h3 className="font-bold text-2xl mb-3 text-white flex items-center">
                        {aiResponse.status === 'success' ? <span className="mr-2">✅</span> : (aiResponse.status === 'error' ? <span className="mr-2">❌</span> : <span className="mr-2">ℹ️</span>)}
                        AI Response (<span className="capitalize">{aiResponse.status}</span>)
                    </h3>
                    <p className="text-gray-200 text-lg leading-relaxed">{aiResponse.message}</p>
                    {aiResponse.insights && (
                        <div className="mt-5">
                            <h4 className="font-semibold text-xl text-teal-300 mb-2 flex items-center"><span className="mr-2">💡</span> Detailed Insights:</h4>
                            <AIInsights insights={aiResponse.insights} /> {/* Re-using AIInsights component */}
                        </div>
                    )}
                    {aiResponse.suggestedActions && aiResponse.suggestedActions.length > 0 && (
                        <div className="mt-5">
                            <h4 className="font-semibold text-xl text-orange-300 mb-2 flex items-center"><span className="mr-2">🚀</span> Suggested Actions:</h4>
                            <div className="flex flex-wrap gap-3 mt-3">
                                {aiResponse.suggestedActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            console.log(`Simulating AI action execution: ${action.label}`);
                                            AlertActionCenter.addNotification({
                                                id: `action-sim-${Date.now()}-${index}`,
                                                message: `Simulating: "${action.label}"`,
                                                type: 'info',
                                            });
                                            // More detailed handling for specific actions
                                        }}
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-base py-2.5 px-5 rounded-full transition duration-200 shadow-md"
                                        aria-label={`Execute suggested action: ${action.label}`}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Command History */}
            <div className="flex-1 bg-gray-900 p-6 rounded-xl shadow-2xl overflow-y-auto border border-gray-700">
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4 flex items-center"><span className="mr-2">📜</span> Interaction History</h2>
                <div className="space-y-5">
                    {commandHistory.slice().reverse().map((entry) => (
                        <div key={entry.id} className={`p-4 rounded-lg shadow-md ${entry.type === 'user' ? 'bg-indigo-800 text-indigo-100 border border-indigo-700' : 'bg-gray-700 text-gray-200 border border-gray-600'}`}>
                            <p className="text-xs text-gray-400 flex justify-between items-center">
                                <span>{new Date(entry.timestamp).toLocaleString()}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${entry.modality === 'user' ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                                    {entry.modality?.toUpperCase() || 'UNKNOWN'}
                                </span>
                            </p>
                            <p className="mt-2 font-medium text-base leading-snug">{entry.content}</p>
                            {entry.aiInterpretation && entry.type === 'ai' && (
                                <p className="text-sm italic text-gray-300 mt-2 border-t border-gray-600 pt-2">
                                    <span className="font-bold text-teal-200">AI Interpretation:</span> {entry.aiInterpretation}
                                </p>
                            )}
                            {entry.aiAction && entry.type === 'ai' && (
                                <div className="mt-2">
                                    <span className="font-bold text-sm text-orange-200">AI Actions:</span>
                                    <pre className="bg-gray-600 p-2 rounded text-xs overflow-x-auto mt-1 text-gray-100">
                                        {JSON.stringify(entry.aiAction, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))}
                    {commandHistory.length === 0 && (
                        <p className="text-gray-400 italic text-center p-4">Your multimodal interaction history will appear here. Start by entering a command!</p>
                    )}
                </div>
            </div>

            {/* Footer with additional UI elements */}
            <div className="mt-8 flex justify-between items-center text-gray-500 text-sm border-t border-gray-800 pt-6">
                <p>&copy; {new Date().getFullYear()} Omni-Modal Command Nexus for Fortune 500</p>
                <div className="flex items-center gap-4">
                    <CommandPaletteTrigger />
                    <AIDynamicKpiButton kpiName="Active Sessions" value={globalState.activeKpis['Multimodal Interaction Rate']} />
                    <AIDynamicKpiButton kpiName="AI Success Rate" value={`${globalState.activeKpis['AI Action Success Rate'] || 0}%`} />
                    <AIAdvisorView /> {/* This would typically be a floating element or a dedicated view */}
                </div>
            </div>
        </div>
    );
};

export default MultiModalCommandCenter;