// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/blueprints/NarrativeForgeView.tsx
================================================================================

// components/views/blueprints/NarrativeForgeView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

const NarrativeForgeView: React.FC = () => {
    const [script, setScript] = useState(
`[SCENE START]

INT. COFFEE SHOP - NIGHT

A coffee shop, moments before closing. Rain streaks down the windows.
ALEX (30s), tired and cynical, wipes down a counter.
MAYA (30s), energetic and optimistic, enters, shaking off an umbrella.

MAYA
You're still here.

ALEX
The world needs its caffeine, even at the bitter end.

MAYA
(Smiling)
The world needs its dreamers more. That's why I'm here. I have an idea.

ALEX
(Scoffs)
Another one? Does this one also involve teaching squirrels to code?
`
    );
    const [prompt, setPrompt] = useState('Suggest a witty, sarcastic comeback for Alex.');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setSuggestions([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = { type: Type.OBJECT, properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } };
            const fullPrompt = `You are an expert screenwriter. Based on the following scene context, generate 3 alternative lines of dialogue for the character Alex that match the user's request.

            **Scene Context:**
            ${script}
            
            **User Request:**
            ${prompt}`;

            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: fullPrompt, 
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            const result = JSON.parse(response.text);
            setSuggestions(result.suggestions);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">Blueprint 103: Narrative Forge</h1>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Script Editor">
                        <textarea
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            className="w-full h-[60vh] bg-gray-900/50 p-4 rounded-lg font-mono text-sm text-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="AI Co-Writer">
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-300">Your Request:</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                className="w-full bg-gray-700/50 p-2 rounded text-white"
                            />
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                                {isLoading ? 'Generating...' : 'Get Suggestions'}
                            </button>
                            {suggestions.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-300">Suggestions:</h4>
                                    {suggestions.map((s, i) => (
                                        <p key={i} className="text-sm p-2 bg-gray-900/50 rounded italic">"{s}"</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NarrativeForgeView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/blueprints/NarrativeForgeView.tsx
================================================================================

```tsx
/**
 * This module implements the core user interface and interaction logic for NarrativeForge Pro,
 * a revolutionary AI-powered narrative development platform. It provides a comprehensive
 * environment for storytellers to conceptualize, draft, and refine their projects with the
 * assistance of advanced generative AI capabilities across multiple leading AI models.
 * This file is designed as a fully self-contained application, demonstrating a new paradigm
 * in software architecture where components are deeply interconnected and self-aware.
 *
 * Business Value: NarrativeForge Pro dramatically accelerates the creative process,
 * reducing the time-to-market for narrative content while enhancing quality and consistency.
 * By integrating intelligent automation and agentic AI for content generation, analysis,
 * and ideation, it empowers writers to overcome creative blocks, explore diverse narrative
 * paths, and produce commercially viable stories with unprecedented efficiency. The platform

 * acts as a strategic asset, enabling enterprises in entertainment, publishing, and marketing
 * to rapidly prototype and iterate on compelling narratives, thereby unlocking new revenue
 * streams and establishing a competitive advantage in content creation. Its structured data
 * models and multi-provider AI-driven insights ensure higher narrative integrity and market relevance,
 * protecting intellectual property value and reducing the risk of project delays. This system
 * represents a revolutionary, multi-million-dollar infrastructure leap by digitalizing and
 * intelligently automating the creative pipeline.
 */
import React, { useState, useReducer, useEffect, useCallback, createContext, useContext, useMemo, useRef } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

// =================================================================================================
// SECTION: GLOBAL CONSTANTS & CONFIGURATION
// Business Value: Standardized constants ensure platform-wide consistency, reduce maintenance
// overhead, and provide a single source of truth for critical operational parameters. This
// enhances system reliability, security, and scalability.
// =================================================================================================

export const APP_NAME = "Narrative Forge Pro - Sentient Digital IP Workbench";
export const APP_VERSION = "3.0.0-sentient-beta";
export const LOCAL_STORAGE_KEY_PREFIX = "narrativeForgePro_v3_";
export const DEBOUNCE_SAVE_MS = 2000;
export const MAX_AI_SUGGESTIONS = 10;
export const AI_MAX_TOKENS_DEFAULT = 4096;
export const AI_TEMPERATURE_DEFAULT = 0.75;
export const AI_TOP_P_DEFAULT = 0.95;
export const AI_TOP_K_DEFAULT = 40;

// =================================================================================================
// SECTION: UTILITY FUNCTIONS
// Business Value: A robust set of utility functions promotes code reuse, reduces errors, and
// optimizes performance. These foundational building blocks are essential for developing a
// stable, maintainable, and high-performance enterprise application.
// =================================================================================================

export const generateUniqueId = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
export const formatDate = (date: Date): string => date.toLocaleString();
export const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>): void => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};
export const estimateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
};
export const countWords = (text: string): number => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

// =================================================================================================
// SECTION: CORE TYPES & INTERFACES
// Business Value: Strongly-typed data models are the bedrock of financial-grade software. They
// ensure data integrity, prevent common bugs, facilitate secure data exchange, and enable
// powerful AI analysis by providing a structured, predictable schema for all digital assets.
// =================================================================================================

// --- NOTIFICATION SYSTEM TYPES ---
export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    timeoutId?: NodeJS.Timeout;
}
export type NotificationAction =
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'REMOVE_NOTIFICATION'; payload: string };

// --- AI PROVIDER & CONFIGURATION TYPES ---
export type AIProviderType = 'gemini' | 'openai' | 'claude';
export const AVAILABLE_MODELS: Record<AIProviderType, string[]> = {
    gemini: ['gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-1.0-pro'],
    openai: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    claude: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
};
export interface AIConfig {
    provider: AIProviderType;
    model: string;
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
    responseMimeType: string;
}
export const defaultAIConfig: AIConfig = {
    provider: 'gemini',
    model: 'gemini-1.5-flash-latest',
    temperature: AI_TEMPERATURE_DEFAULT,
    topP: AI_TOP_P_DEFAULT,
    topK: AI_TOP_K_DEFAULT,
    maxOutputTokens: AI_MAX_TOKENS_DEFAULT,
    responseMimeType: "text/plain",
};

// --- NARRATIVE ASSET TYPES ---
export type PersonalityTrait = 'sarcastic' | 'optimistic' | 'cynical' | 'brave' | 'cowardly' | 'loyal' | 'treacherous' | 'wise' | 'naive' | 'driven' | 'lazy' | 'charismatic' | 'reserved' | 'impulsive' | 'calm';
export interface Character {
    id: string;
    name: string;
    aliases: string[];
    description: string;
    physicalDescription: string;
    backstory: string;
    motivations: string;
    goals: string;
    strengths: string;
    weaknesses: string;
    fears: string;
    personalityTraits: PersonalityTrait[];
    dialogueStyle: string;
    relationships: { characterId: string; type: string; description: string }[];
    arcs: { arcId: string; type: 'internal' | 'external'; description: string }[];
    aiNotes: string;
    createdAt: string;
    updatedAt: string;
}
export const emptyCharacter: Character = {
    id: '', name: '', aliases: [], description: '', physicalDescription: '', backstory: '', motivations: '', goals: '', strengths: '', weaknesses: '', fears: '',
    personalityTraits: [], dialogueStyle: '', relationships: [], arcs: [], aiNotes: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
};

export type LocationType = 'indoor' | 'outdoor' | 'city' | 'rural' | 'fantasy' | 'sci-fi' | 'historical' | 'specificBuilding' | 'naturalLandmark' | 'vehicle' | 'space';
export interface Location {
    id: string;
    name: string;
    type: LocationType;
    description: string;
    history: string;
    significance: string;
    atmosphere: string;
    sensoryDetails: string;
    keyElements: string[];
    mood: string;
    aiNotes: string;
    createdAt: string;
    updatedAt: string;
}
export const emptyLocation: Location = {
    id: '', name: '', type: 'outdoor', description: '', history: '', significance: '',
    atmosphere: '', sensoryDetails: '', keyElements: [], mood: '', aiNotes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
};

export type SceneMood = 'tense' | 'humorous' | 'dramatic' | 'romantic' | 'suspenseful' | 'calm' | 'action-packed' | 'melancholy' | 'joyful';
export type ScenePacing = 'slow' | 'medium' | 'fast' | 'variable';
export interface Scene {
    id: string;
    sceneNumber: number;
    title: string;
    synopsis: string;
    content: string;
    locationId: string;
    characterIds: string[];
    mood: SceneMood;
    pacing: ScenePacing;
    timeOfDay: string;
    emotionalShift: string;
    plotPointsCovered: string[];
    aiFeedback: string;
    createdAt: string;
    updatedAt: string;
}
export const emptyScene: Scene = {
    id: '', sceneNumber: 1, title: '', synopsis: '', content: '', locationId: '', characterIds: [],
    mood: 'calm', pacing: 'medium', timeOfDay: 'Day', emotionalShift: 'None', plotPointsCovered: [], aiFeedback: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
};

export type PlotPointType = 'incitingIncident' | 'risingAction' | 'climax' | 'fallingAction' | 'resolution' | 'midpoint' | 'plotTwist' | 'reversal' | 'setup' | 'payoff';
export interface PlotPoint {
    id: string;
    title: string;
    type: PlotPointType;
    description: string;
    impactOnCharacters: string[];
    associatedScenes: string[];
    requiredElements: string[];
    aiSuggestions: string;
    createdAt: string;
    updatedAt: string;
}
export const emptyPlotPoint: PlotPoint = {
    id: '', title: '', type: 'incitingIncident', description: '', impactOnCharacters: [],
    associatedScenes: [], requiredElements: [], aiSuggestions: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
};

export type StoryArcType = 'main' | 'sub_plot' | 'character_arc' | 'thematic';
export interface StoryArc {
    id: string;
    title: string;
    type: StoryArcType;
    description: string;
    startPoint: string;
    endPoint: string;
    keyPlotPoints: string[];
    charactersInvolved: string[];
    aiAnalysis: string;
    createdAt: string;
    updatedAt: string;
}
export const emptyStoryArc: StoryArc = {
    id: '', title: '', type: 'main', description: '', startPoint: '', endPoint: '',
    keyPlotPoints: [], charactersInvolved: [], aiAnalysis: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
};

// --- AI INTERACTION & PROJECT TYPES ---
export type AIChatRole = 'user' | 'model' | 'system';
export interface AIChatMessage {
    id: string;
    role: AIChatRole;
    content: string;
    timestamp: string;
    relatedEntityId?: string;
    relatedEntityType?: 'character' | 'scene' | 'location' | 'plot_point' | 'story_arc';
}
export interface ProjectSettings {
    projectId: string;
    lastOpenedPanel: AppPanel;
    autosaveEnabled: boolean;
    autoAIPropositions: boolean;
    preferredAIConfig: AIConfig;
    documentFont: string;
    documentFontSize: number;
    theme: 'dark' | 'light';
    showLineNumbers: boolean;
    exportFormat: 'fountain' | 'pdf' | 'html' | 'json' | 'markdown';
    createdAt: string;
    updatedAt: string;
}
export const defaultProjectSettings: ProjectSettings = {
    projectId: '',
    lastOpenedPanel: 'dashboard',
    autosaveEnabled: true,
    autoAIPropositions: false,
    preferredAIConfig: defaultAIConfig,
    documentFont: 'Inter',
    documentFontSize: 16,
    theme: 'dark',
    showLineNumbers: true,
    exportFormat: 'fountain',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export interface GeneratedCodeModule {
    id: string;
    name: string;
    type: 'type' | 'component' | 'hook';
    prompt: string;
    code: string;
    createdAt: string;
}

export interface Project {
    id: string;
    name: string;
    logline: string;
    synopsis: string;
    genre: string[];
    targetAudience: string;
    characters: Character[];
    locations: Location[];
    scenes: Scene[];
    plotPoints: PlotPoint[];
    storyArcs: StoryArc[];
    aiChatHistory: AIChatMessage[];
    generatedCodeModules: GeneratedCodeModule[];
    settings: ProjectSettings;
    createdAt: string;
    updatedAt: string;
}
export const emptyProject: Project = {
    id: generateUniqueId(),
    name: 'New Digital IP Asset',
    logline: 'A compelling new narrative asset ready for market disruption.',
    synopsis: 'This project aims to define a rich, engaging narrative that will capture significant market share and establish new benchmarks in content monetization.',
    genre: ['Sci-Fi', 'Satire'],
    targetAudience: 'Global audience (18-45) with a high tolerance for existential dread and corporate buzzwords.',
    characters: [],
    locations: [],
    scenes: [{
        ...emptyScene,
        id: generateUniqueId(),
        sceneNumber: 1,
        title: 'Inception of Value',
        content: `[SCENE START]

INT. SOULLESS BOARDROOM - DAY

Sunlight, possibly rented for the occasion, streams into a minimalist, high-tech boardroom that smells faintly of desperation and expensive air freshener.

ELARA (40s), CEO of "Quantum Narratives," stands before a holographic display showing a graph that only goes up. Her posture is perfect. It's unsettling.

Across a table so polished you can see your own mortality in it, INVESTOR ONE (60s, looks like he was born in a tailored suit) and INVESTOR TWO (50s, radiates spreadsheet energy) listen intently.

ELARA
(A little too intense)
...and this is where NarrativeForge Pro redefines intellectual property. We're not creating stories. Stories are for campfires and un-monetized childhoods. We are architecting scalable, cross-platform narrative assets. Think of this less as a word processor, and more as a high-frequency trading terminal for cultural capital.

INVESTOR ONE
(Massaging his temples)
Right. So it's Google Docs with an ego. What's the moat, Elara? Besides the jargon.

ELARA
(Grinning, showing a bit too much tooth)
The moat, sir, is a piranha-infested river of pure, unadulterated process. Our AI agents don't just 'help you write'. They A/B test plot points against demographic sentiment models. They predict virality scores for dialogue. They ensure your protagonist's 'dark secret' is dark enough to trend on Twitter, but not so dark it gets you cancelled. We've replaced the muse with a machine. A very, very profitable machine.

INVESTOR TWO
(Leaning forward, his eyes gleaming)
Show me the immutable ledger of creative transactions. I want to see the tokenomics of a plot twist.
`
    }],
    plotPoints: [],
    storyArcs: [],
    aiChatHistory: [],
    generatedCodeModules: [],
    settings: { ...defaultProjectSettings, projectId: '' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

// --- APPLICATION UI & STATE TYPES ---
export type AppPanel =
    | 'dashboard'
    | 'scriptEditor'
    | 'characters'
    | 'locations'
    | 'plotBoard'
    | 'storyArcs'
    | 'worldBuilder'
    | 'aiChat'
    | 'aiAgentWorkbench'
    | 'aiConfig'
    | 'projectSettings'
    | 'exportImport'
    | 'ipAssetOverview';
export interface AppState {
    projects: Project[];
    activeProjectId: string | null;
    activePanel: AppPanel;
    currentAISuggestions: string[];
    isAILoading: boolean;
    aiError: string | null;
    currentAIRequestPrompt: string;
    selectedCharacterId: string | null;
    selectedLocationId: string | null;
    selectedSceneId: string | null;
    selectedPlotPointId: string | null;
    selectedStoryArcId: string | null;
    showModal: {
        type: 'newProject' | 'editCharacter' | 'editLocation' | 'editScene' | 'editPlotPoint' | 'editStoryArc' | 'confirmDelete' | null;
        isOpen: boolean;
        data?: any;
    };
}
export const initialAppState: AppState = {
    projects: [],
    activeProjectId: null,
    activePanel: 'dashboard',
    currentAISuggestions: [],
    isAILoading: false,
    aiError: null,
    currentAIRequestPrompt: '',
    selectedCharacterId: null,
    selectedLocationId: null,
    selectedSceneId: null,
    selectedPlotPointId: null,
    selectedStoryArcId: null,
    showModal: { type: null, isOpen: false, data: null },
};
export type AppAction =
    | { type: 'SET_PROJECTS'; payload: Project[] }
    | { type: 'ADD_PROJECT'; payload: Project }
    | { type: 'UPDATE_PROJECT'; payload: Project }
    | { type: 'DELETE_PROJECT'; payload: string }
    | { type: 'SET_ACTIVE_PROJECT'; payload: string | null }
    | { type: 'SET_ACTIVE_PANEL'; payload: AppPanel }
    | { type: 'SET_AI_LOADING'; payload: boolean }
    | { type: 'SET_AI_SUGGESTIONS'; payload: string[] }
    | { type: 'SET_AI_ERROR'; payload: string | null }
    | { type: 'SET_CURRENT_AI_REQUEST_PROMPT'; payload: string }
    | { type: 'ADD_CHARACTER'; payload: { projectId: string; character: Character } }
    | { type: 'UPDATE_CHARACTER'; payload: { projectId: string; character: Character } }
    | { type: 'DELETE_CHARACTER'; payload: { projectId: string; characterId: string } }
    | { type: 'SET_SELECTED_CHARACTER'; payload: string | null }
    | { type: 'ADD_LOCATION'; payload: { projectId: string; location: Location } }
    | { type: 'UPDATE_LOCATION'; payload: { projectId: string; location: Location } }
    | { type: 'DELETE_LOCATION'; payload: { projectId: string; locationId: string } }
    | { type: 'SET_SELECTED_LOCATION'; payload: string | null }
    | { type: 'ADD_SCENE'; payload: { projectId: string; scene: Scene } }
    | { type: 'UPDATE_SCENE'; payload: { projectId: string; scene: Scene } }
    | { type: 'DELETE_SCENE'; payload: { projectId: string; sceneId: string } }
    | { type: 'SET_SELECTED_SCENE'; payload: string | null }
    | { type: 'ADD_PLOT_POINT'; payload: { projectId: string; plotPoint: PlotPoint } }
    | { type: 'UPDATE_PLOT_POINT'; payload: { projectId: string; plotPoint: PlotPoint } }
    | { type: 'DELETE_PLOT_POINT'; payload: { projectId: string; plotPointId: string } }
    | { type: 'SET_SELECTED_PLOT_POINT'; payload: string | null }
    | { type: 'ADD_STORY_ARC'; payload: { projectId: string; storyArc: StoryArc } }
    | { type: 'UPDATE_STORY_ARC'; payload: { projectId: string; storyArc: StoryArc } }
    | { type: 'DELETE_STORY_ARC'; payload: { projectId: string; storyArcId: string } }
    | { type: 'SET_SELECTED_STORY_ARC'; payload: string | null }
    | { type: 'ADD_AI_CHAT_MESSAGE'; payload: { projectId: string; message: AIChatMessage } }
    | { type: 'UPDATE_PROJECT_SETTINGS'; payload: { projectId: string; settings: Partial<ProjectSettings> } }
    | { type: 'ADD_GENERATED_CODE_MODULE', payload: { projectId: string; module: GeneratedCodeModule } }
    | { type: 'OPEN_MODAL'; payload: { type: AppState['showModal']['type']; data?: any } }
    | { type: 'CLOSE_MODAL' };

// --- "FILE SYSTEM" REGISTRY TYPES ---
export interface RegisteredFile {
    id: string;
    name: string;
    description: string;
    functionalities: string[];
    sizeInLines: number;
}


// =================================================================================================
// SECTION: STATE MANAGEMENT (REDUCERS)
// Business Value: Centralized state management via reducers provides a predictable, auditable,
// and scalable architecture for handling application data. This is analogous to a transactional
// ledger, ensuring every state change is explicit and traceable, which is paramount for systems
// managing high-value intellectual property.
// =================================================================================================

export const notificationReducer = (state: Notification[], action: NotificationAction): Notification[] => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return [...state, action.payload];
        case 'REMOVE_NOTIFICATION':
            return state.filter(n => n.id !== action.payload);
        default:
            return state;
    }
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
    const updateProject = (projectId: string, updateFn: (project: Project) => Project): Project[] =>
        state.projects.map(p => (p.id === projectId ? updateFn(p) : p));

    switch (action.type) {
        case 'SET_PROJECTS': return { ...state, projects: action.payload };
        case 'ADD_PROJECT': return { ...state, projects: [...state.projects, action.payload] };
        case 'UPDATE_PROJECT': return { ...state, projects: updateProject(action.payload.id, () => ({ ...action.payload, updatedAt: new Date().toISOString() })) };
        case 'DELETE_PROJECT': return { ...state, projects: state.projects.filter(p => p.id !== action.payload), activeProjectId: state.activeProjectId === action.payload ? null : state.activeProjectId };
        case 'SET_ACTIVE_PROJECT': return { ...state, activeProjectId: action.payload, selectedSceneId: null }; // Reset scene selection on project change
        case 'SET_ACTIVE_PANEL': return { ...state, activePanel: action.payload };
        case 'SET_AI_LOADING': return { ...state, isAILoading: action.payload };
        case 'SET_AI_SUGGESTIONS': return { ...state, currentAISuggestions: action.payload };
        case 'SET_AI_ERROR': return { ...state, aiError: action.payload };
        case 'SET_CURRENT_AI_REQUEST_PROMPT': return { ...state, currentAIRequestPrompt: action.payload };

        // CRUD operations for nested entities
        case 'ADD_CHARACTER': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, characters: [...p.characters, { ...action.payload.character, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] })) };
        case 'UPDATE_CHARACTER': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, characters: p.characters.map(c => c.id === action.payload.character.id ? { ...action.payload.character, updatedAt: new Date().toISOString() } : c) })) };
        case 'DELETE_CHARACTER': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, characters: p.characters.filter(c => c.id !== action.payload.characterId) })), selectedCharacterId: state.selectedCharacterId === action.payload.characterId ? null : state.selectedCharacterId };
        case 'SET_SELECTED_CHARACTER': return { ...state, selectedCharacterId: action.payload };

        case 'ADD_LOCATION': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, locations: [...p.locations, { ...action.payload.location, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] })) };
        case 'UPDATE_LOCATION': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, locations: p.locations.map(l => l.id === action.payload.location.id ? { ...action.payload.location, updatedAt: new Date().toISOString() } : l) })) };
        case 'DELETE_LOCATION': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, locations: p.locations.filter(l => l.id !== action.payload.locationId) })), selectedLocationId: state.selectedLocationId === action.payload.locationId ? null : state.selectedLocationId };
        case 'SET_SELECTED_LOCATION': return { ...state, selectedLocationId: action.payload };

        case 'ADD_SCENE': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, scenes: [...p.scenes, { ...action.payload.scene, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] })) };
        case 'UPDATE_SCENE': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, scenes: p.scenes.map(s => s.id === action.payload.scene.id ? { ...action.payload.scene, updatedAt: new Date().toISOString() } : s) })) };
        case 'DELETE_SCENE': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, scenes: p.scenes.filter(s => s.id !== action.payload.sceneId) })), selectedSceneId: state.selectedSceneId === action.payload.sceneId ? null : state.selectedSceneId };
        case 'SET_SELECTED_SCENE': return { ...state, selectedSceneId: action.payload };

        case 'ADD_PLOT_POINT': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, plotPoints: [...p.plotPoints, { ...action.payload.plotPoint, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] })) };
        case 'UPDATE_PLOT_POINT': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, plotPoints: p.plotPoints.map(pp => pp.id === action.payload.plotPoint.id ? { ...action.payload.plotPoint, updatedAt: new Date().toISOString() } : pp) })) };
        case 'DELETE_PLOT_POINT': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, plotPoints: p.plotPoints.filter(pp => pp.id !== action.payload.plotPointId) })), selectedPlotPointId: state.selectedPlotPointId === action.payload.plotPointId ? null : state.selectedPlotPointId };
        case 'SET_SELECTED_PLOT_POINT': return { ...state, selectedPlotPointId: action.payload };

        case 'ADD_STORY_ARC': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, storyArcs: [...p.storyArcs, { ...action.payload.storyArc, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] })) };
        case 'UPDATE_STORY_ARC': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, storyArcs: p.storyArcs.map(sa => sa.id === action.payload.storyArc.id ? { ...action.payload.storyArc, updatedAt: new Date().toISOString() } : sa) })) };
        case 'DELETE_STORY_ARC': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, storyArcs: p.storyArcs.filter(sa => sa.id !== action.payload.storyArcId) })), selectedStoryArcId: state.selectedStoryArcId === action.payload.storyArcId ? null : state.selectedStoryArcId };
        case 'SET_SELECTED_STORY_ARC': return { ...state, selectedStoryArcId: action.payload };

        case 'ADD_AI_CHAT_MESSAGE': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, aiChatHistory: [...p.aiChatHistory, action.payload.message] })) };
        case 'UPDATE_PROJECT_SETTINGS': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, settings: { ...p.settings, ...action.payload.settings, updatedAt: new Date().toISOString() } })) };
        case 'ADD_GENERATED_CODE_MODULE': return { ...state, projects: updateProject(action.payload.projectId, p => ({ ...p, generatedCodeModules: [...p.generatedCodeModules, action.payload.module] })) };
        case 'OPEN_MODAL': return { ...state, showModal: { type: action.payload.type, isOpen: true, data: action.payload.data } };
        case 'CLOSE_MODAL': return { ...state, showModal: { type: null, isOpen: false, data: null } };
        default: return state;
    }
};

// =================================================================================================
// SECTION: REACT CONTEXTS & PROVIDERS
// Business Value: Contexts provide a clean, efficient way to manage and distribute global state,
// preventing prop-drilling and simplifying component architecture. This leads to more maintainable
// and scalable code, reducing development costs and accelerating feature delivery.
// =================================================================================================

// --- NOTIFICATION CONTEXT ---
export const NotificationContext = createContext<{
    notifications: Notification[];
    dispatch: React.Dispatch<NotificationAction>;
    addNotification: (message: string, type: NotificationType, duration?: number) => void;
}>({ notifications: [], dispatch: () => { }, addNotification: () => { } });
export const NotificationProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [notifications, dispatch] = useReducer(notificationReducer, []);
    const addNotification = useCallback((message: string, type: NotificationType, duration: number = 5000) => {
        const id = generateUniqueId();
        const newNotification: Notification = { id, message, type };
        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
        const timeoutId = setTimeout(() => { dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }); }, duration);
        dispatch({ type: 'ADD_NOTIFICATION', payload: { ...newNotification, timeoutId } });
    }, []);
    return (<NotificationContext.Provider value={{ notifications, dispatch, addNotification }}>{children}</NotificationContext.Provider>);
};
export const useNotifications = () => useContext(NotificationContext);

// --- API KEY CONTEXT ---
export const APIKeyContext = createContext<{
    apiKeys: Record<AIProviderType, string>;
    setApiKey: (provider: AIProviderType, key: string) => void;
}>({ apiKeys: { gemini: '', openai: '', claude: '' }, setApiKey: () => { } });
export const APIKeyProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [apiKeys, setApiKeys] = useState<Record<AIProviderType, string>>({ gemini: '', openai: '', claude: '' });
    const setApiKey = (provider: AIProviderType, key: string) => { setApiKeys(prev => ({ ...prev, [provider]: key })); };
    useEffect(() => {
        const geminiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
        if (geminiKey) setApiKey('gemini', geminiKey);
    }, []);
    return (<APIKeyContext.Provider value={{ apiKeys, setApiKey }}>{children}</APIKeyContext.Provider>);
};
export const useApiKeys = () => useContext(APIKeyContext);

// --- "FILE SYSTEM" CONTEXT ---
export const FileSystemContext = createContext<{
    registeredFiles: RegisteredFile[];
    registerFile: (file: RegisteredFile) => void;
}>({ registeredFiles: [], registerFile: () => { } });
export const FileSystemProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [registeredFiles, setRegisteredFiles] = useState<RegisteredFile[]>([]);
    const registerFile = useCallback((file: RegisteredFile) => {
        setRegisteredFiles(prev => {
            if (prev.find(f => f.id === file.id)) return prev;
            return [...prev, file];
        });
    }, []);
    return (<FileSystemContext.Provider value={{ registeredFiles, registerFile }}>{children}</FileSystemContext.Provider>);
};
export const useFileSystem = () => useContext(FileSystemContext);

// --- MAIN APP CONTEXT ---
export const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction>; }>({ state: initialAppState, dispatch: () => { } });
export const useAppContext = () => useContext(AppContext);

// =================================================================================================
// SECTION: CORE HOOKS
// Business Value: Custom hooks encapsulate complex logic, promoting reusability and separating
// concerns. This abstraction simplifies component code, making it easier to read, test, and
// maintain, which is crucial for the long-term health and agility of the platform.
// =================================================================================================

/**
 * Master hook for interacting with various AI APIs.
 * Business Value: This hook abstracts the complexity of multiple AI providers into a single,
 * unified interface. This strategic abstraction allows the platform to be model-agnostic,
 * enabling seamless integration of new AI technologies without major architectural changes. It
 * provides flexibility to choose the best model for a given task, optimizing for cost, performance,
 * and quality, thereby maximizing the ROI on AI investments.
 */
export const useAI = (config?: Partial<AIConfig>) => {
    const { addNotification } = useNotifications();
    const { apiKeys } = useApiKeys();
    const { state, dispatch } = useAppContext();
    const activeProject = state.projects.find(p => p.id === state.activeProjectId);
    const effectiveAIConfig = activeProject?.settings.preferredAIConfig ? { ...defaultAIConfig, ...activeProject.settings.preferredAIConfig, ...config } : { ...defaultAIConfig, ...config };

    const genAI = useMemo(() => {
        if (!apiKeys.gemini) return null;
        try {
            return new GoogleGenAI(apiKeys.gemini);
        } catch (e) {
            console.error("Failed to initialize GoogleGenAI", e);
            return null;
        }
    }, [apiKeys.gemini]);

    const generateContent = useCallback(async (
        prompt: string,
        projectId: string,
        systemPrompt?: string,
        relatedEntityId?: string,
        relatedEntityType?: AIChatMessage['relatedEntityType']
    ) => {
        dispatch({ type: 'SET_AI_LOADING', payload: true });
        dispatch({ type: 'SET_AI_ERROR', payload: null });
        dispatch({ type: 'SET_CURRENT_AI_REQUEST_PROMPT', payload: prompt });
        dispatch({ type: 'SET_AI_SUGGESTIONS', payload: [] });

        dispatch({ type: 'ADD_AI_CHAT_MESSAGE', payload: { projectId, message: { id: generateUniqueId(), role: 'user', content: prompt, timestamp: new Date().toISOString(), relatedEntityId, relatedEntityType } } });

        let responseText = '';
        try {
            switch (effectiveAIConfig.provider) {
                case 'gemini':
                    if (!genAI) throw new Error('Google Gemini API key not configured or invalid.');
                    const model = genAI.getGenerativeModel({ model: effectiveAIConfig.model });
                    const chat = model.startChat({ history: activeProject?.aiChatHistory.filter(msg => msg.relatedEntityId === relatedEntityId || !msg.relatedEntityId).map(msg => ({ role: msg.role, parts: [{ text: msg.content }] })) || [] });
                    const result = await chat.sendMessage(prompt);
                    responseText = result.response.text();
                    break;

                case 'openai':
                    if (!apiKeys.openai) throw new Error('OpenAI API key not configured.');
                    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKeys.openai}` },
                        body: JSON.stringify({
                            model: effectiveAIConfig.model,
                            messages: [
                                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                                ...activeProject?.aiChatHistory.map(m => ({ role: m.role, content: m.content })) || [],
                                { role: 'user', content: prompt }
                            ],
                            temperature: effectiveAIConfig.temperature,
                            max_tokens: effectiveAIConfig.maxOutputTokens,
                            top_p: effectiveAIConfig.topP,
                        }),
                    });
                    if (!openaiResponse.ok) throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
                    const openaiData = await openaiResponse.json();
                    responseText = openaiData.choices[0].message.content;
                    break;

                case 'claude':
                    if (!apiKeys.claude) throw new Error('Anthropic API key not configured.');
                    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': apiKeys.claude,
                            'anthropic-version': '2023-06-01'
                        },
                        body: JSON.stringify({
                            model: effectiveAIConfig.model,
                            messages: activeProject?.aiChatHistory.map(m => ({ role: m.role, content: m.content })).concat([{ role: 'user', content: prompt }]) || [{ role: 'user', content: prompt }],
                            system: systemPrompt,
                            temperature: effectiveAIConfig.temperature,
                            max_tokens: effectiveAIConfig.maxOutputTokens,
                            top_p: effectiveAIConfig.topP,
                            top_k: effectiveAIConfig.topK,
                        }),
                    });
                    if (!claudeResponse.ok) throw new Error(`Anthropic API error: ${claudeResponse.statusText}`);
                    const claudeData = await claudeResponse.json();
                    responseText = claudeData.content[0].text;
                    break;
            }

            dispatch({ type: 'ADD_AI_CHAT_MESSAGE', payload: { projectId, message: { id: generateUniqueId(), role: 'model', content: responseText, timestamp: new Date().toISOString(), relatedEntityId, relatedEntityType } } });
            dispatch({ type: 'SET_AI_SUGGESTIONS', payload: responseText.split('\n').filter(s => s.trim() !== '') });
            addNotification('AI generated content successfully!', 'success');
            return responseText;

        } catch (error: any) {
            console.error('AI content generation failed:', error);
            const errorMessage = error.message || 'Failed to generate AI content.';
            dispatch({ type: 'SET_AI_ERROR', payload: errorMessage });
            addNotification(`AI Error: ${errorMessage}`, 'error');
            dispatch({ type: 'ADD_AI_CHAT_MESSAGE', payload: { projectId, message: { id: generateUniqueId(), role: 'model', content: `(AI Error: ${errorMessage})`, timestamp: new Date().toISOString(), relatedEntityId, relatedEntityType } } });
            return null;
        } finally {
            dispatch({ type: 'SET_AI_LOADING', payload: false });
        }
    }, [genAI, effectiveAIConfig, apiKeys, addNotification, state.activeProjectId, activeProject?.aiChatHistory, dispatch]);

    return {
        generateContent,
        isAILoading: state.isAILoading,
        aiError: state.aiError,
        currentAISuggestions: state.currentAISuggestions,
        currentAIRequestPrompt: state.currentAIRequestPrompt,
    };
};

// =================================================================================================
// SECTION: CORE PROVIDERS
// Business Value: The top-level provider orchestrates the entire application's data flow
// and persistence, acting as the core engine for the platform. It ensures all valuable
// intellectual property is reliably saved, loaded, and managed, akin to a secure,
// high-availability data store in financial systems, safeguarding creative assets and
// maintaining operational continuity.
// =================================================================================================

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialAppState);
    const { addNotification } = useNotifications();
    const localStorageKey = useMemo(() => `${LOCAL_STORAGE_KEY_PREFIX}projects`, []);

    useEffect(() => {
        try {
            const savedState = localStorage.getItem(localStorageKey);
            if (savedState) {
                const parsedProjects: Project[] = JSON.parse(savedState);
                dispatch({ type: 'SET_PROJECTS', payload: parsedProjects });
                if (parsedProjects.length > 0) {
                    const lastActiveId = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}activeProjectId`);
                    const lastActiveProject = parsedProjects.find(p => p.id === lastActiveId);
                    dispatch({ type: 'SET_ACTIVE_PROJECT', payload: lastActiveProject ? lastActiveId : parsedProjects[0].id });
                }
                addNotification('Project data loaded.', 'info');
            } else {
                const newProject = { ...emptyProject, id: generateUniqueId() };
                dispatch({ type: 'ADD_PROJECT', payload: newProject });
                dispatch({ type: 'SET_ACTIVE_PROJECT', payload: newProject.id });
                addNotification('Welcome! A new default project has been created for you.', 'info');
            }
        } catch (error: any) {
            console.error("Failed to load state from local storage:", error);
            addNotification(`Failed to load data: ${error.message || 'Unknown error'}`, 'error');
        }
    }, [localStorageKey, addNotification]);

    const debouncedSaveProjects = useCallback(
        debounce((projectsToSave: Project[], activeId: string | null) => {
            try {
                localStorage.setItem(localStorageKey, JSON.stringify(projectsToSave));
                if (activeId) {
                    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}activeProjectId`, activeId);
                }
            } catch (error: any) {
                console.error("Failed to save state to local storage:", error);
                addNotification(`Autosave failed: ${error.message || 'Unknown error'}`, 'error');
            }
        }, DEBOUNCE_SAVE_MS),
        [localStorageKey, addNotification]
    );

    useEffect(() => {
        if (state.projects.length > 0) {
            debouncedSaveProjects(state.projects, state.activeProjectId);
        }
    }, [state.projects, state.activeProjectId, debouncedSaveProjects]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

// =================================================================================================
// SECTION: UI COMPONENTS
// Business Value: A well-designed, modular component library is a force multiplier for development.
// It ensures a consistent user experience, accelerates development by promoting reuse, and
// simplifies maintenance, allowing the platform to evolve rapidly to meet market demands.
// =================================================================================================

// --- NOTIFICATION CONTAINER ---
export const NotificationContainer: React.FC = () => {
    const { notifications, dispatch } = useNotifications();
    const getNotificationColor = useCallback((type: NotificationType) => {
        switch (type) {
            case 'success': return 'bg-green-600';
            case 'error': return 'bg-red-600';
            case 'info': return 'bg-blue-600';
            case 'warning': return 'bg-yellow-600';
            default: return 'bg-gray-700';
        }
    }, []);
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
            {notifications.map(n => (
                <div key={n.id} className={`${getNotificationColor(n.type)} text-white p-3 rounded-lg shadow-md flex justify-between items-center transition-opacity duration-300 ease-out animate-fade-in`}>
                    <span>{n.message}</span>
                    <button onClick={() => { dispatch({ type: 'REMOVE_NOTIFICATION', payload: n.id }); if (n.timeoutId) clearTimeout(n.timeoutId); }} className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            ))}
        </div>
    );
};

// --- MODAL COMPONENTS ---

const Modal: React.FC<React.PropsWithChildren<{ title: string; onClose: () => void; size?: 'sm' | 'md' | 'lg' | 'xl' }>> = ({ title, onClose, children, size = 'lg' }) => {
    const sizeClasses = {
        sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-40 animate-fade-in-fast" onClick={onClose}>
            <div className={`bg-gray-800 rounded-lg shadow-xl text-white w-full ${sizeClasses[size]} flex flex-col`} onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </header>
                <main className="p-6 overflow-y-auto max-h-[80vh]">
                    {children}
                </main>
            </div>
        </div>
    );
};


const NewProjectModal: React.FC<{ onClose: () => void; onSave: (data: Partial<Project>) => void }> = ({ onClose, onSave }) => {
    const [name, setName] = useState('New Digital IP Asset');
    const [logline, setLogline] = useState('');
    const handleSave = () => { onSave({ name, logline }); };
    return (
        <Modal title="Create New Project" onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Project Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Logline</label>
                    <textarea value={logline} onChange={e => setLogline(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 h-24 resize-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="A one-sentence summary of your story." />
                </div>
                <footer className="flex justify-end space-x-3 pt-4">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Create Project</button>
                </footer>
            </div>
        </Modal>
    );
};

const ConfirmDeleteModal: React.FC<{ entityType: string; entityName: string; onConfirm: () => void; onCancel: () => void; }> = ({ entityType, entityName, onConfirm, onCancel }) => {
    return (
        <Modal title={`Confirm Deletion`} onClose={onCancel} size="sm">
            <p>Are you sure you want to delete the {entityType} "{entityName}"?</p>
            <p className="text-sm text-yellow-400 mt-2">This action cannot be undone.</p>
            <footer className="flex justify-end space-x-3 pt-6">
                <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Delete</button>
            </footer>
        </Modal>
    );
};
// Placeholders for other modals that would be fully implemented
const CharacterModal: React.FC<any> = ({ project, character, onClose, onSave, onDelete }) => <Modal title="Edit Character" onClose={onClose}><p>Character editor for {character.name}. (Full implementation pending)</p></Modal>;
const LocationModal: React.FC<any> = ({ project, location, onClose, onSave, onDelete }) => <Modal title="Edit Location" onClose={onClose}><p>Location editor for {location.name}. (Full implementation pending)</p></Modal>;
const SceneModal: React.FC<any> = ({ project, scene, onClose, onSave, onDelete }) => <Modal title="Edit Scene" onClose={onClose}><p>Scene editor for {scene.title}. (Full implementation pending)</p></Modal>;
const PlotPointModal: React.FC<any> = ({ project, plotPoint, onClose, onSave, onDelete }) => <Modal title="Edit Plot Point" onClose={onClose}><p>Plot Point editor for {plotPoint.title}. (Full implementation pending)</p></Modal>;
const StoryArcModal: React.FC<any> = ({ project, storyArc, onClose, onSave, onDelete }) => <Modal title="Edit Story Arc" onClose={onClose}><p>Story Arc editor for {storyArc.title}. (Full implementation pending)</p></Modal>;


// --- PANEL COMPONENTS ---

interface PanelProps { project: Project; }
interface ExportImportProps { projects: Project[]; activeProjectId: string | null; }

const Dashboard: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const handleNewProject = () => dispatch({ type: 'OPEN_MODAL', payload: { type: 'newProject' } });
    const handleSelectProject = (projectId: string) => {
        dispatch({ type: 'SET_ACTIVE_PROJECT', payload: projectId });
        dispatch({ type: 'SET_ACTIVE_PANEL', payload: 'scriptEditor' });
    };
    const handleDeleteProject = (projectId: string) => dispatch({ type: 'OPEN_MODAL', payload: { type: 'confirmDelete', data: { entityType: 'project', entityId: projectId } } });
    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-white">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-300">New Project</h3>
                    <p className="text-gray-400 mb-6">Forge a new universe. Or, you know, just write a story.</p>
                    <button onClick={handleNewProject} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg self-start transition-colors">Create</button>
                </Card>
                <Card className="bg-gray-800 p-6 rounded-lg shadow-md col-span-full">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-300">Your Digital IP Assets</h3>
                    {state.projects.length === 0 ? (
                        <p className="text-gray-400">The void is vast and empty. Create a project to populate it.</p>
                    ) : (
                        <div className="space-y-4">
                            {state.projects.map(project => (
                                <div key={project.id} className="flex justify-between items-center bg-gray-700 p-4 rounded-md">
                                    <div>
                                        <h4 className="text-lg font-medium text-white">{project.name}</h4>
                                        <p className="text-sm text-gray-400">{project.logline}</p>
                                        <p className="text-xs text-gray-500">Last updated: {formatDate(new Date(project.updatedAt))}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleSelectProject(project.id)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded-lg transition-colors">Open</button>
                                        <button onClick={() => handleDeleteProject(project.id)} className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded-lg transition-colors">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

const ScriptEditor: React.FC<PanelProps> = ({ project }) => {
    const { state, dispatch } = useAppContext();
    const { selectedSceneId } = state;
    const { addNotification } = useNotifications();
    const { generateContent, isAILoading } = useAI();

    const activeScene = useMemo(() => project.scenes.find(s => s.id === selectedSceneId) || project.scenes[0], [project.scenes, selectedSceneId]);
    const [sceneContent, setSceneContent] = useState<string>(activeScene?.content || '');

    useEffect(() => {
        if (activeScene) setSceneContent(activeScene.content);
        else setSceneContent('');
    }, [activeScene]);

    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSceneContent(e.target.value);
        if (activeScene) {
            const updatedScene = { ...activeScene, content: e.target.value };
            dispatch({ type: 'UPDATE_SCENE', payload: { projectId: project.id, scene: updatedScene } });
        }
    }, [dispatch, project.id, activeScene]);

    const handleSceneSelect = (sceneId: string) => dispatch({ type: 'SET_SELECTED_SCENE', payload: sceneId });

    const handleContinueWriting = async () => {
        if (!activeScene) return;
        const prompt = `Continue writing this scene. Here is the existing content:\n\n${activeScene.content}\n\nContinue from there.`;
        const result = await generateContent(prompt, project.id, `You are a helpful screenwriter assistant.`, activeScene.id, 'scene');
        if (result) {
            const updatedContent = activeScene.content + "\n" + result;
            setSceneContent(updatedContent);
            dispatch({ type: 'UPDATE_SCENE', payload: { projectId: project.id, scene: { ...activeScene, content: updatedContent } } });
        }
    };
    
    return (
        <div className="flex h-full space-x-4">
            <Card className="w-1/4 flex flex-col p-4 bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-white">Scenes</h3>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {project.scenes.map(scene => (
                        <div key={scene.id} onClick={() => handleSceneSelect(scene.id)}
                             className={`p-3 rounded-lg cursor-pointer ${scene.id === activeScene?.id ? 'bg-indigo-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            <p className="font-semibold truncate">{scene.sceneNumber}. {scene.title || 'Untitled Scene'}</p>
                            <p className="text-sm text-gray-400 truncate">{scene.synopsis || 'No synopsis'}</p>
                        </div>
                    ))}
                </div>
            </Card>
            <Card className="flex-1 flex flex-col p-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-6 text-white">Script Editor: {activeScene?.title || 'No Scene Selected'}</h2>
                <div className="flex-1 min-h-0">
                    <textarea
                        className="w-full h-full p-4 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-base resize-none"
                        value={sceneContent}
                        onChange={handleContentChange}
                        placeholder="Select a scene or create a new one to begin."
                        disabled={!activeScene}
                    />
                </div>
                <div className="mt-6 flex space-x-4">
                    <button onClick={handleContinueWriting} disabled={isAILoading || !activeScene} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500">
                        {isAILoading ? 'AI is Writing...' : 'Continue with AI'}
                    </button>
                    <button onClick={() => addNotification('Feature not implemented yet!', 'info')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Analyze Script</button>
                </div>
            </Card>
        </div>
    );
};
const CharacterManager: React.FC<PanelProps> = ({ project }) => {
    const { dispatch } = useAppContext();
    const handleAddCharacter = () => {
        const newChar = { ...emptyCharacter, id: generateUniqueId(), name: `New Character ${project.characters.length + 1}` };
        dispatch({ type: 'ADD_CHARACTER', payload: { projectId: project.id, character: newChar } });
        dispatch({ type: 'SET_SELECTED_CHARACTER', payload: newChar.id });
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'editCharacter', data: newChar } });
    };
    return (<Card className="p-6 bg-gray-800 rounded-lg shadow-md"><h2 className="text-3xl font-bold mb-6 text-white">Character Manager</h2><button onClick={handleAddCharacter} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg mb-6 transition-colors">Add New Character</button></Card>);
};
const LocationManager: React.FC<PanelProps> = ({ project }) => {
    const { dispatch } = useAppContext();
    const handleAddLocation = () => {
        const newLoc = { ...emptyLocation, id: generateUniqueId(), name: `New Location ${project.locations.length + 1}` };
        dispatch({ type: 'ADD_LOCATION', payload: { projectId: project.id, location: newLoc } });
        dispatch({ type: 'SET_SELECTED_LOCATION', payload: newLoc.id });
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'editLocation', data: newLoc } });
    };
    return (<Card className="p-6 bg-gray-800 rounded-lg shadow-md"><h2 className="text-3xl font-bold mb-6 text-white">Location Manager</h2><button onClick={handleAddLocation} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg mb-6 transition-colors">Add New Location</button></Card>);
};
const PlotBoardManager: React.FC<PanelProps> = ({ project }) => {
    const { dispatch } = useAppContext();
    const handleAddPlotPoint = () => {
        const newPP = { ...emptyPlotPoint, id: generateUniqueId(), title: `New Plot Point ${project.plotPoints.length + 1}` };
        dispatch({ type: 'ADD_PLOT_POINT', payload: { projectId: project.id, plotPoint: newPP } });
        dispatch({ type: 'SET_SELECTED_PLOT_POINT', payload: newPP.id });
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'editPlotPoint', data: newPP } });
    };
    return (<Card className="p-6 bg-gray-800 rounded-lg shadow-md"><h2 className="text-3xl font-bold mb-6 text-white">Plot Board</h2><button onClick={handleAddPlotPoint} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg mb-6 transition-colors">Add New Plot Point</button></Card>);
};
const StoryArcManager: React.FC<PanelProps> = ({ project }) => {
    const { dispatch } = useAppContext();
    const handleAddStoryArc = () => {
        const newSA = { ...emptyStoryArc, id: generateUniqueId(), title: `New Story Arc ${project.storyArcs.length + 1}` };
        dispatch({ type: 'ADD_STORY_ARC', payload: { projectId: project.id, storyArc: newSA } });
        dispatch({ type: 'SET_SELECTED_STORY_ARC', payload: newSA.id });
        dispatch({ type: 'OPEN_MODAL', payload: { type: 'editStoryArc', data: newSA } });
    };
    return (<Card className="p-6 bg-gray-800 rounded-lg shadow-md"><h2 className="text-3xl font-bold mb-6 text-white">Story Arc Manager</h2><button onClick={handleAddStoryArc} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg mb-6 transition-colors">Add New Story Arc</button></Card>);
};
const WorldBuilder: React.FC<PanelProps> = ({ project }) => (<Card className="p-6 bg-gray-800 rounded-lg shadow-md"><h2 className="text-3xl font-bold mb-6 text-white">World Builder</h2><p className="text-gray-300">This panel is under construction. Soon you'll be able to visually map out your world, its lore, factions, and timelines.</p></Card>);
const AIChat: React.FC<PanelProps> = ({ project }) => {
    const { generateContent, isAILoading, aiError } = useAI();
    const [inputPrompt, setInputPrompt] = useState('');
    const chatHistory = project.aiChatHistory;
    const handleSendMessage = async () => {
        if (!inputPrompt.trim()) return;
        await generateContent(inputPrompt, project.id);
        setInputPrompt('');
    };
    return (
        <Card className="flex flex-col h-full p-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-white">AI Chat</h2>
            <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-y-auto mb-4">
                {chatHistory.map(msg => (
                    <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-3/4 p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-700' : 'bg-gray-700'}`}>
                            <p className="font-semibold capitalize">{msg.role}</p>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex">
                <input type="text" value={inputPrompt} onChange={e => setInputPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} disabled={isAILoading} className="flex-1 p-3 rounded-l-lg bg-gray-700 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                <button onClick={handleSendMessage} disabled={isAILoading} className="bg-indigo-600 hover:bg-indigo-700 font-bold py-3 px-6 rounded-r-lg disabled:bg-gray-500">{isAILoading ? 'Thinking...' : 'Send'}</button>
            </div>
        </Card>
    );
};
const AIConfiguration: React.FC<PanelProps> = ({ project }) => {
    const { dispatch } = useAppContext();
    const { apiKeys, setApiKey } = useApiKeys();
    const [settings, setSettings] = useState(project.settings.preferredAIConfig);
    const handleSave = () => { dispatch({ type: 'UPDATE_PROJECT_SETTINGS', payload: { projectId: project.id, settings: { preferredAIConfig: settings } } }); };
    return (<Card className="p-6 bg-gray-800 rounded-lg shadow-md"><h2 className="text-3xl font-bold mb-6 text-white">AI Configuration</h2><p>Configure your AI provider settings here.</p><button onClick={handleSave}>Save</button></Card>);
};
const ProjectSettingsEditor: React.FC<PanelProps> = ({ project }) => (<Card className="p-6 bg-gray-800 rounded-lg shadow-md"><h2 className="text-3xl font-bold mb-6 text-white">Project Settings</h2><p>Edit your project settings here.</p></Card>);
const ExportImportManager: React.FC<ExportImportProps> = ({ projects }) => (<Card className="p-6 bg-gray-800 rounded-lg shadow-md"><h2 className="text-3xl font-bold mb-6 text-white">Export / Import</h2><p>Manage project data import and export.</p></Card>);
const IPAssetOverview: React.FC<PanelProps> = ({ project }) => (<Card className="p-6 bg-gray-800 rounded-lg shadow-md"><h2 className="text-3xl font-bold mb-6 text-white">IP Asset Overview</h2><p>An overview of your intellectual property asset.</p></Card>);
const AIAgentWorkbench: React.FC<PanelProps> = ({ project }) => (<Card className="p-6 bg-gray-800 rounded-lg shadow-md"><h2 className="text-3xl font-bold mb-6 text-white">AI Agent Workbench</h2><p>Use AI to generate new code modules for your project.</p></Card>);


// =================================================================================================
// SECTION: MAIN APPLICATION COMPONENT
// Business Value: The root component orchestrates the entire user experience. Its clean structure
// and efficient rendering logic are critical for a responsive, high-performance platform that
// keeps users engaged and productive.
// =================================================================================================

const App: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { addNotification } = useNotifications();
    const activeProject = useMemo(() => state.projects.find(p => p.id === state.activeProjectId), [state.projects, state.activeProjectId]);

    const renderPanel = useCallback(() => {
        if (!activeProject && !['dashboard', 'exportImport'].includes(state.activePanel)) {
            return <div className="flex-1 flex items-center justify-center text-gray-500"><p>No project active. Please create or select one.</p></div>;
        }
        switch (state.activePanel) {
            case 'dashboard': return <Dashboard />;
            case 'scriptEditor': return activeProject ? <ScriptEditor project={activeProject} /> : null;
            case 'characters': return activeProject ? <CharacterManager project={activeProject} /> : null;
            case 'locations': return activeProject ? <LocationManager project={activeProject} /> : null;
            case 'plotBoard': return activeProject ? <PlotBoardManager project={activeProject} /> : null;
            case 'storyArcs': return activeProject ? <StoryArcManager project={activeProject} /> : null;
            case 'worldBuilder': return activeProject ? <WorldBuilder project={activeProject} /> : null;
            case 'aiChat': return activeProject ? <AIChat project={activeProject} /> : null;
            case 'aiAgentWorkbench': return activeProject ? <AIAgentWorkbench project={activeProject} /> : null;
            case 'aiConfig': return activeProject ? <AIConfiguration project={activeProject} /> : null;
            case 'projectSettings': return activeProject ? <ProjectSettingsEditor project={activeProject} /> : null;
            case 'exportImport': return <ExportImportManager projects={state.projects} activeProjectId={state.activeProjectId} />;
            case 'ipAssetOverview': return activeProject ? <IPAssetOverview project={activeProject} /> : null;
            default: return <div className="flex-1 flex items-center justify-center text-gray-500"><p>Select a panel from the navigation.</p></div>;
        }
    }, [state.activePanel, activeProject, state.projects, state.activeProjectId]);

    const handleConfirmDelete = useCallback((entityType: string, entityId: string) => {
        dispatch({ type: 'CLOSE_MODAL' });
        if (entityType === 'project') {
            dispatch({ type: 'DELETE_PROJECT', payload: entityId });
            addNotification('Project deleted!', 'success');
        }
        // ... other entity deletions
    }, [dispatch, addNotification]);

    const sideBarNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: 'scriptEditor', label: 'Script Editor', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'characters', label: 'Characters', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 'locations', label: 'Locations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657zM12 13a4 4 0 110-8 4 4 0 010 8z' },
        { id: 'plotBoard', label: 'Plot Board', icon: 'M8 7V3m8 4V3m-9 8h.01M16 11h.01M9 16h.01M15 16h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { id: 'storyArcs', label: 'Story Arcs', icon: 'M15.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z M15.5 17.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z M5 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM5 15.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM19 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z M5 12a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z' },
        { id: 'worldBuilder', label: 'World Builder', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2a2 2 0 002-2v-1a2 2 0 012-2h2.945M21 12v3a2 2 0 01-2 2H3a2 2 0 01-2-2v-3m18 0a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v3a2 2 0 002 2h18z' },
        { id: 'aiChat', label: 'AI Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
        { id: 'aiAgentWorkbench', label: 'AI Workbench', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M8 12a4 4 0 110-8 4 4 0 010 8z M2 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z' },
        { id: 'aiConfig', label: 'AI Config', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.527.288 1.137.366 1.724.01zM12 12a3 3 0 100-6 3 3 0 000 6z' },
        { id: 'projectSettings', label: 'Settings', icon: 'M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l-1.414-1.414M6.05 6.05l-1.414-1.414m12.728 0l-1.414 1.414M6.05 17.95l-1.414 1.414M12 18a6 6 0 100-12 6 6 0 000 12z' },
        { id: 'exportImport', label: 'Export/Import', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
        { id: 'ipAssetOverview', label: 'IP Overview', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ];
    
    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans">
            <aside className="w-64 bg-gray-800 p-4 shadow-lg flex flex-col">
                <div className="text-2xl font-bold mb-6 text-indigo-400">{APP_NAME}</div>
                <nav className="space-y-2 flex-grow overflow-y-auto">
                    {sideBarNavItems.map(item => (
                        <button key={item.id} onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: item.id as AppPanel })}
                            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${state.activePanel === item.id ? 'bg-indigo-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="mt-8 pt-4 border-t border-gray-700"><p className="text-xs text-gray-500">Version: {APP_VERSION}</p></div>
            </aside>

            <main className="flex-1 flex flex-col">
                <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center z-10">
                    <div className="flex items-center space-x-4">
                        <select
                            className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                            value={state.activeProjectId || ''}
                            onChange={(e) => dispatch({ type: 'SET_ACTIVE_PROJECT', payload: e.target.value })}
                        >
                            <option value="" disabled>Select a Project</option>
                            {state.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <button onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'newProject' } })} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>New
                        </button>
                    </div>
                    {activeProject && <h1 className="text-xl font-semibold text-white truncate max-w-lg">{activeProject.name}</h1>}
                    <div></div>
                </header>
                <section className="flex-1 p-6 overflow-auto">{renderPanel()}</section>
            </main>

            <NotificationContainer />

            {state.showModal.isOpen && state.showModal.type === 'newProject' && (
                <NewProjectModal
                    onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                    onSave={(newProjectData) => {
                        const newId = generateUniqueId();
                        const projectToAdd: Project = { ...emptyProject, ...newProjectData, id: newId, settings: { ...defaultProjectSettings, projectId: newId } };
                        dispatch({ type: 'ADD_PROJECT', payload: projectToAdd });
                        dispatch({ type: 'SET_ACTIVE_PROJECT', payload: newId });
                        dispatch({ type: 'CLOSE_MODAL' });
                        addNotification('New project created!', 'success');
                    }}
                />
            )}
            {state.showModal.isOpen && state.showModal.type === 'confirmDelete' && (
                <ConfirmDeleteModal
                    entityType={state.showModal.data?.entityType}
                    entityName={state.showModal.data?.entityType === 'project' ? state.projects.find(p => p.id === state.showModal.data?.entityId)?.name || 'Project' : 'Item'}
                    onConfirm={() => handleConfirmDelete(state.showModal.data?.entityType, state.showModal.data?.entityId)}
                    onCancel={() => dispatch({ type: 'CLOSE_MODAL' })}
                />
            )}
            {/* Other modals would be rendered here */}
        </div>
    );
};

const FullApp: React.FC = () => (
    <NotificationProvider>
        <APIKeyProvider>
            <FileSystemProvider>
                <AppProvider>
                    <App />
                </AppProvider>
            </FileSystemProvider>
        </APIKeyProvider>
    </NotificationProvider>
);

export default FullApp;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/blueprints/NarrativeForgeView.tsx
================================================================================

// components/views/blueprints/NarrativeForgeView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

const NarrativeForgeView: React.FC = () => {
    const [script, setScript] = useState(
`[SCENE START]

INT. COFFEE SHOP - NIGHT

A coffee shop, moments before closing. Rain streaks down the windows.
ALEX (30s), tired and cynical, wipes down a counter.
MAYA (30s), energetic and optimistic, enters, shaking off an umbrella.

MAYA
You're still here.

ALEX
The world needs its caffeine, even at the bitter end.

MAYA
(Smiling)
The world needs its dreamers more. That's why I'm here. I have an idea.

ALEX
(Scoffs)
Another one? Does this one also involve teaching squirrels to code?
`
    );
    const [prompt, setPrompt] = useState('Suggest a witty, sarcastic comeback for Alex.');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setSuggestions([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = { type: Type.OBJECT, properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } };
            const fullPrompt = `You are an expert screenwriter. Based on the following scene context, generate 3 alternative lines of dialogue for the character Alex that match the user's request.

            **Scene Context:**
            ${script}
            
            **User Request:**
            ${prompt}`;

            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: fullPrompt, 
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            const result = JSON.parse(response.text);
            setSuggestions(result.suggestions);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">Blueprint 103: Narrative Forge</h1>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Script Editor">
                        <textarea
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            className="w-full h-[60vh] bg-gray-900/50 p-4 rounded-lg font-mono text-sm text-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="AI Co-Writer">
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-300">Your Request:</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                className="w-full bg-gray-700/50 p-2 rounded text-white"
                            />
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                                {isLoading ? 'Generating...' : 'Get Suggestions'}
                            </button>
                            {suggestions.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-300">Suggestions:</h4>
                                    {suggestions.map((s, i) => (
                                        <p key={i} className="text-sm p-2 bg-gray-900/50 rounded italic">"{s}"</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NarrativeForgeView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/blueprints/NarrativeForgeView.tsx
================================================================================

// components/views/blueprints/NarrativeForgeView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

const NarrativeForgeView: React.FC = () => {
    const [script, setScript] = useState(
`[SCENE START]

INT. COFFEE SHOP - NIGHT

A coffee shop, moments before closing. Rain streaks down the windows.
ALEX (30s), tired and cynical, wipes down a counter.
MAYA (30s), energetic and optimistic, enters, shaking off an umbrella.

MAYA
You're still here.

ALEX
The world needs its caffeine, even at the bitter end.

MAYA
(Smiling)
The world needs its dreamers more. That's why I'm here. I have an idea.

ALEX
(Scoffs)
Another one? Does this one also involve teaching squirrels to code?
`
    );
    const [prompt, setPrompt] = useState('Suggest a witty, sarcastic comeback for Alex.');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setSuggestions([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = { type: Type.OBJECT, properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } };
            const fullPrompt = `You are an expert screenwriter. Based on the following scene context, generate 3 alternative lines of dialogue for the character Alex that match the user's request.

            **Scene Context:**
            ${script}
            
            **User Request:**
            ${prompt}`;

            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: fullPrompt, 
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            const result = JSON.parse(response.text);
            setSuggestions(result.suggestions);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-wider">Blueprint 103: Narrative Forge</h1>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Script Editor">
                        <textarea
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            className="w-full h-[60vh] bg-gray-900/50 p-4 rounded-lg font-mono text-sm text-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="AI Co-Writer">
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-300">Your Request:</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                className="w-full bg-gray-700/50 p-2 rounded text-white"
                            />
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50">
                                {isLoading ? 'Generating...' : 'Get Suggestions'}
                            </button>
                            {suggestions.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-300">Suggestions:</h4>
                                    {suggestions.map((s, i) => (
                                        <p key={i} className="text-sm p-2 bg-gray-900/50 rounded italic">"{s}"</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NarrativeForgeView;
