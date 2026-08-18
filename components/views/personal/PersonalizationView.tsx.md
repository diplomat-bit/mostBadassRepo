// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/PersonalizationView.tsx.md
================================================================================


# The Personalization

This is the studio of the self. The space where the inner landscape is projected onto the outer vessel. It is the act of shaping your environment to be a true reflection of your inner state. To personalize is to attune your reality to your own frequency, creating a world that resonates in perfect harmony with the vision you hold within.

---

### A Fable for the Builder: The Color of the Sky

(They say you cannot change the world. That you can only change yourself. We thought, why not both? This `Personalization` view is a testament to that idea. It is the place where you, the creator, are given the power to change the very color of the sky in your own digital world.)

(A simple background image may seem trivial. A cosmetic choice. But we saw it as something deeper. It is an act of claiming a space, of making it your own. It is the difference between a sterile, generic hotel room and your own home. We wanted this Instrument to feel like home.)

(But we wanted to give you more than just a paintbrush. We wanted to give you a muse. That is the purpose of the `AI Background Generator`. You do not have to be an artist. You only need to have a feeling, an idea, a dream. You speak that dream into the prompt—"an isolated lighthouse on a stormy sea"—and the AI becomes your hands. It translates your feeling into light and color, and projects it onto the canvas of your world.)

(This is a profound partnership. The AI does not create on its own. It requires the spark of your intent. It is a tool for the manifestation of your inner landscape. The choice of the 'Aurora Illusion' is another path. It is for those who prefer their world not to be static, but to be alive, dynamic, a constant, gentle flow of color and light.)

(This is our 'Aesthetic Resonance' principle. We believe that the environment in which you think affects the quality of your thoughts. By giving you the power to shape this environment, to make it a true reflection of your inner state, we believe we are helping you to think more clearly, more creatively, more powerfully. It is a simple truth: a person who feels at home in their world is a person who can do great things within it.)


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/PersonalizationView.tsx.md
================================================================================

import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    createContext,
    useContext,
    useReducer,
    useRef,
    FC,
    ReactNode,
    CSSProperties,
    ChangeEvent,
    DragEvent
} from 'react';
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { throttle } from 'lodash';

// --- SECTION 1: TYPE DEFINITIONS ---

/**
 * Represents the configuration for a single widget on the dashboard.
 */
export type WidgetConfig = {
    id: string;
    name: string;
    enabled: boolean;
    component: string; // Identifier for the component to render
    gridPosition: { x: number; y: number; w: number; h: number };
};

/**
 * Options for the Aurora dynamic background.
 */
export type AuroraOptions = {
    speed: number; // 0-100
    complexity: number; // 0-100
    colorPalette: string[];
};

/**
 * Options for the Waves dynamic background.
 */
export type WavesOptions = {
    speed: number; // 0-100
    amplitude: number; // 0-100
    frequency: number; // 0-100
    color: string;
    lineCount: number; // 1-10
};

/**
 * Options for the Starfield dynamic background.
 */
export type StarfieldOptions = {
    starCount: number; // 50-5000
    speed: number; // 0-100
    starColor: string;
};

/**
 * Configuration for a single keyboard shortcut.
 */
export type ShortcutConfig = {
    id: string;
    name: string;
    keys: string[];
};

/**
 * Represents a connected third-party integration.
 */
export type IntegrationConfig = {
    id: 'google' | 'slack' | 'github' | 'spotify';
    name: string;
    isConnected: boolean;
    lastSync?: number;
};

/**
 * The main state object for all personalization settings.
 */
export type PersonalizationState = {
    theme: {
        mode: 'light' | 'dark' | 'system';
        primaryColor: string;
        accentColor: string;
        backgroundColor: string;
        gradientAngle: number;
        fontFamily: string;
        fontSize: number; // in rem
        uiDensity: 'compact' | 'comfortable' | 'spacious';
    };
    background: {
        type: 'solid' | 'image' | 'ai' | 'dynamic';
        solid: {
            color: string;
        };
        image: {
            url: string;
            blur: number; // 0-100
            brightness: number; // 0-100
            position: 'cover' | 'contain' | 'tile';
        };
        ai: {
            prompt: string;
            negativePrompt: string;
            style: string;
            history: { prompt: string; url: string; timestamp: number }[];
            isGenerating: boolean;
            error: string | null;
            currentImageUrl: string | null;
        };
        dynamic: {
            type: 'aurora' | 'waves' | 'starfield';
            options: AuroraOptions | WavesOptions | StarfieldOptions;
        };
    };
    layout: {
        sidebarPosition: 'left' | 'right';
        widgets: WidgetConfig[];
    };
    sound: {
        enabled: boolean;
        volume: number; // 0-100
        theme: 'default' | 'calm' | 'tech' | 'retro';
    };
    accessibility: {
        highContrast: boolean;
        reduceMotion: boolean;
        dyslexicFont: boolean;
    };
    notifications: {
        enabled: boolean;
        position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
        duration: number; // in ms
    };
    integrations: IntegrationConfig[];
    aiAssistant: {
        personality: 'professional' | 'witty' | 'zen' | 'explorer';
        proactiveSuggestions: boolean;
    };
    keyboardShortcuts: ShortcutConfig[];
    metadata: {
        lastSaved: number | null;
        hasUnsavedChanges: boolean;
    };
};

/**
 * Action types for the personalization reducer.
 */
export type PersonalizationAction =
    | { type: 'SET_STATE'; payload: PersonalizationState }
    | { type: 'SET_THEME_MODE'; payload: 'light' | 'dark' | 'system' }
    | { type: 'SET_PRIMARY_COLOR'; payload: string }
    | { type: 'SET_ACCENT_COLOR'; payload: string }
    | { type: 'SET_BACKGROUND_COLOR'; payload: string }
    | { type: 'SET_GRADIENT_ANGLE'; payload: number }
    | { type: 'SET_FONT_FAMILY'; payload: string }
    | { type: 'SET_FONT_SIZE'; payload: number }
    | { type: 'SET_UI_DENSITY'; payload: 'compact' | 'comfortable' | 'spacious' }
    | { type: 'SET_BACKGROUND_TYPE'; payload: 'solid' | 'image' | 'ai' | 'dynamic' }
    | { type: 'SET_SOLID_BACKGROUND_COLOR'; payload: string }
    | { type: 'SET_IMAGE_BACKGROUND_URL'; payload: string }
    | { type: 'SET_IMAGE_BACKGROUND_BLUR'; payload: number }
    | { type: 'SET_IMAGE_BACKGROUND_BRIGHTNESS'; payload: number }
    | { type: 'SET_IMAGE_BACKGROUND_POSITION'; payload: 'cover' | 'contain' | 'tile' }
    | { type: 'SET_AI_PROMPT'; payload: string }
    | { type: 'SET_AI_NEGATIVE_PROMPT'; payload: string }
    | { type: 'SET_AI_STYLE'; payload: string }
    | { type: 'START_AI_GENERATION' }
    | { type: 'AI_GENERATION_SUCCESS'; payload: { url: string; prompt: string } }
    | { type: 'AI_GENERATION_FAILURE'; payload: string }
    | { type: 'SET_AI_BACKGROUND_IMAGE'; payload: string }
    | { type: 'CLEAR_AI_HISTORY' }
    | { type: 'SET_DYNAMIC_BACKGROUND_TYPE'; payload: 'aurora' | 'waves' | 'starfield' }
    | { type: 'UPDATE_DYNAMIC_BACKGROUND_OPTIONS'; payload: Partial<AuroraOptions | WavesOptions | StarfieldOptions> }
    | { type: 'SET_SIDEBAR_POSITION'; payload: 'left' | 'right' }
    | { type: 'REORDER_WIDGETS'; payload: { dragIndex: number; hoverIndex: number } }
    | { type: 'TOGGLE_WIDGET'; payload: string } // by widget id
    | { type: 'SET_SOUND_ENABLED'; payload: boolean }
    | { type: 'SET_SOUND_VOLUME'; payload: number }
    | { type: 'SET_SOUND_THEME'; payload: 'default' | 'calm' | 'tech' | 'retro' }
    | { type: 'SET_HIGH_CONTRAST'; payload: boolean }
    | { type: 'SET_REDUCE_MOTION'; payload: boolean }
    | { type: 'SET_DYSLEXIC_FONT'; payload: boolean }
    | { type: 'SET_NOTIFICATION_ENABLED'; payload: boolean }
    | { type: 'SET_NOTIFICATION_POSITION'; payload: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }
    | { type: 'SET_NOTIFICATION_DURATION'; payload: number }
    | { type: 'TOGGLE_INTEGRATION'; payload: 'google' | 'slack' | 'github' | 'spotify' }
    | { type: 'SET_AI_PERSONALITY'; payload: 'professional' | 'witty' | 'zen' | 'explorer' }
    | { type: 'SET_AI_PROACTIVE_SUGGESTIONS'; payload: boolean }
    | { type: 'UPDATE_SHORTCUT'; payload: { id: string; keys: string[] } }
    | { type: 'RESET_TO_DEFAULTS' }
    | { type: 'SAVE_SETTINGS_START' }
    | { type: 'SAVE_SETTINGS_SUCCESS' }
    | { type: 'SAVE_SETTINGS_FAILURE' };


/**
 * The shape of the personalization context.
 */
export interface PersonalizationContextType {
    state: PersonalizationState;
    dispatch: React.Dispatch<PersonalizationAction>;
    isSaving: boolean;
    saveError: string | null;
    saveSettings: () => void;
}

// --- SECTION 2: MOCK DATA & API LAYER ---

export const AI_ART_STYLES = [
    'Photorealistic', 'Oil Painting', 'Watercolor', 'Cyberpunk', 'Steampunk', 'Anime',
    'Concept Art', 'Surrealism', 'Minimalist', 'Impressionism', 'Art Deco', 'Vaporwave'
];

export const GOOGLE_FONTS = ['Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Code Pro', 'Raleway'];

export const DYNAMIC_BACKGROUND_PALETTES = {
    aurora: [
        '#00ff99', '#00ccff', '#9933ff', '#ff3399', '#00ff99'
    ],
    sunset: [
        '#ff5e00', '#ff9900', '#ffcc00', '#ff9900', '#ff5e00'
    ],
    ocean: [
        '#003366', '#006699', '#0099cc', '#33ccff', '#0099cc'
    ]
};

/**
 * Simulates calling an AI image generation API.
 * @param prompt The user's text prompt.
 * @param style The selected art style.
 * @returns A promise that resolves to a URL of a generated image.
 */
export const mockGenerateImageAPI = (prompt: string, style: string): Promise<{ url: string }> => {
    console.log(`Generating image for prompt: "${prompt}" with style: "${style}"`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (prompt.toLowerCase().includes('error')) {
                reject(new Error("Failed to generate image due to an explicit error request."));
                return;
            }
            const seed = Math.random().toString(36).substring(7);
            const url = `https://picsum.photos/seed/${seed}/1920/1080`;
            console.log(`Generated image URL: ${url}`);
            resolve({ url });
        }, 2500); // Simulate network latency
    });
};

/**
 * Simulates fetching inspirational prompts.
 * @returns A promise that resolves to a random prompt string.
 */
export const mockGetInspirationAPI = (): Promise<{ prompt: string }> => {
    const inspirations = [
        "A cyberpunk city in the rain, neon lights reflecting on the wet streets.",
        "An ancient library inside a giant, hollowed-out tree.",
        "A lone astronaut discovering a glowing alien artifact on Mars.",
        "A tranquil Japanese garden with a koi pond under a cherry blossom tree.",
        "A steampunk airship navigating through a storm of clouds.",
        "A hidden waterfall in a lush, tropical jungle at sunset."
    ];
    return new Promise(resolve => {
        setTimeout(() => {
            const prompt = inspirations[Math.floor(Math.random() * inspirations.length)];
            resolve({ prompt });
        }, 500);
    });
};

/**
 * Simulates fetching a gallery of curated background images from a service like Unsplash.
 * @returns A promise that resolves to an array of image URLs.
 */
export const mockFetchGalleryImagesAPI = (): Promise<{ images: { id: string; url: string; author: string }[] }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const images = Array.from({ length: 20 }).map((_, i) => ({
                id: `gallery_${i}`,
                url: `https://picsum.photos/seed/gallery${i}/800/600`,
                author: `Photographer ${i + 1}`
            }));
            resolve({ images });
        }, 1000);
    });
};

/**
 * Simulates saving personalization settings to a server or local storage.
 * @param settings The settings to save.
 * @returns A promise that resolves on successful save.
 */
export const mockSaveSettingsAPI = (settings: PersonalizationState): Promise<void> => {
    console.log("Saving settings...", settings);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                localStorage.setItem('personalizationSettings', JSON.stringify(settings));
                console.log("Settings saved successfully.");
                resolve();
            } catch (error) {
                console.error("Failed to save settings:", error);
                reject(new Error("Could not save settings to local storage."));
            }
        }, 1500);
    });
};

/**
 * Simulates loading personalization settings.
 * @returns A promise that resolves with the loaded settings or null if none exist.
 */
export const mockLoadSettingsAPI = (): Promise<PersonalizationState | null> => {
    console.log("Loading settings...");
    return new Promise(resolve => {
        setTimeout(() => {
            try {
                const savedSettings = localStorage.getItem('personalizationSettings');
                if (savedSettings) {
                    console.log("Settings loaded successfully.");
                    resolve(JSON.parse(savedSettings));
                } else {
                    console.log("No saved settings found.");
                    resolve(null);
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
                resolve(null);
            }
        }, 500);
    });
};


// --- SECTION 3: STATE MANAGEMENT (CONTEXT & REDUCER) ---

export const DEFAULT_WIDGETS: WidgetConfig[] = [
    { id: 'widget-1', name: 'Welcome Quickstart', component: 'Welcome', enabled: true, gridPosition: { x: 0, y: 0, w: 2, h: 1 } },
    { id: 'widget-2', name: 'Daily Focus', component: 'Focus', enabled: true, gridPosition: { x: 2, y: 0, w: 1, h: 1 } },
    { id: 'widget-3', name: 'Scratchpad', component: 'Scratchpad', enabled: true, gridPosition: { x: 0, y: 1, w: 1, h: 2 } },
    { id: 'widget-4', name: 'Recent Projects', component: 'Projects', enabled: false, gridPosition: { x: 1, y: 1, w: 1, h: 1 } },
    { id: 'widget-5', name: 'Calendar Events', component: 'Calendar', enabled: true, gridPosition: { x: 1, y: 2, w: 2, h: 1 } },
];

export const defaultPersonalizationState: PersonalizationState = {
    theme: {
        mode: 'dark',
        primaryColor: '#6e44ff',
        accentColor: '#ff6b4a',
        backgroundColor: '#1a1a2e',
        gradientAngle: 145,
        fontFamily: 'Roboto',
        fontSize: 1, // rem
        uiDensity: 'comfortable',
    },
    background: {
        type: 'dynamic',
        solid: { color: '#1a1a2e' },
        image: {
            url: '',
            blur: 5,
            brightness: 80,
            position: 'cover',
        },
        ai: {
            prompt: '',
            negativePrompt: '',
            style: AI_ART_STYLES[0],
            history: [],
            isGenerating: false,
            error: null,
            currentImageUrl: null,
        },
        dynamic: {
            type: 'aurora',
            options: {
                speed: 50,
                complexity: 60,
                colorPalette: DYNAMIC_BACKGROUND_PALETTES.aurora,
            },
        },
    },
    layout: {
        sidebarPosition: 'left',
        widgets: DEFAULT_WIDGETS,
    },
    sound: {
        enabled: true,
        volume: 75,
        theme: 'default',
    },
    accessibility: {
        highContrast: false,
        reduceMotion: false,
        dyslexicFont: false,
    },
    notifications: {
        enabled: true,
        position: 'top-right',
        duration: 5000,
    },
    integrations: [
        { id: 'google', name: 'Google Suite', isConnected: false },
        { id: 'slack', name: 'Slack', isConnected: false },
        { id: 'github', name: 'GitHub', isConnected: false },
        { id: 'spotify', name: 'Spotify', isConnected: false },
    ],
    aiAssistant: {
        personality: 'professional',
        proactiveSuggestions: true,
    },
    keyboardShortcuts: [
        { id: 'open_command_palette', name: 'Open Command Palette', keys: ['Cmd', 'K'] },
        { id: 'toggle_sidebar', name: 'Toggle Sidebar', keys: ['Cmd', 'B'] },
        { id: 'new_document', name: 'New Document', keys: ['Cmd', 'N'] },
    ],
    metadata: {
        lastSaved: null,
        hasUnsavedChanges: false,
    },
};

/**
 * Reducer function for managing personalization state.
 * @param state The current state.
 * @param action The dispatched action.
 * @returns The new state.
 */
export const personalizationReducer = (state: PersonalizationState, action: PersonalizationAction): PersonalizationState => {
    // A helper to wrap state updates and automatically set the unsaved changes flag
    const withUnsavedChanges = (newState: Partial<PersonalizationState>): PersonalizationState => ({
        ...state,
        ...newState,
        metadata: { ...state.metadata, hasUnsavedChanges: true },
    });

    switch (action.type) {
        case 'SET_STATE':
            return action.payload;
        case 'SET_THEME_MODE':
            return withUnsavedChanges({ theme: { ...state.theme, mode: action.payload } });
        case 'SET_PRIMARY_COLOR':
            return withUnsavedChanges({ theme: { ...state.theme, primaryColor: action.payload } });
        case 'SET_ACCENT_COLOR':
            return withUnsavedChanges({ theme: { ...state.theme, accentColor: action.payload } });
        case 'SET_FONT_FAMILY':
            return withUnsavedChanges({ theme: { ...state.theme, fontFamily: action.payload } });
        // ... all other cases
        case 'REORDER_WIDGETS':
            const newWidgets = [...state.layout.widgets];
            const [removed] = newWidgets.splice(action.payload.dragIndex, 1);
            newWidgets.splice(action.payload.hoverIndex, 0, removed);
            return withUnsavedChanges({ layout: { ...state.layout, widgets: newWidgets } });
        case 'TOGGLE_WIDGET':
            return withUnsavedChanges({
                layout: {
                    ...state.layout,
                    widgets: state.layout.widgets.map(w => w.id === action.payload ? { ...w, enabled: !w.enabled } : w)
                }
            });
        case 'TOGGLE_INTEGRATION': {
            const newIntegrations = state.integrations.map(int =>
                int.id === action.payload ? { ...int, isConnected: !int.isConnected, lastSync: Date.now() } : int
            );
            return withUnsavedChanges({ integrations: newIntegrations });
        }
        case 'SET_AI_PERSONALITY':
            return withUnsavedChanges({ aiAssistant: { ...state.aiAssistant, personality: action.payload } });
        case 'SET_AI_PROACTIVE_SUGGESTIONS':
            return withUnsavedChanges({ aiAssistant: { ...state.aiAssistant, proactiveSuggestions: action.payload } });
        // ... add all other missing cases from the expanded state
        case 'AI_GENERATION_SUCCESS':
            const newHistoryEntry = { prompt: action.payload.prompt, url: action.payload.url, timestamp: Date.now() };
            return withUnsavedChanges({
                background: {
                    ...state.background,
                    type: 'ai',
                    ai: {
                        ...state.background.ai,
                        isGenerating: false,
                        currentImageUrl: action.payload.url,
                        history: [newHistoryEntry, ...state.background.ai.history].slice(0, 20),
                    }
                }
            });
        case 'RESET_TO_DEFAULTS':
            return { ...defaultPersonalizationState, metadata: { ...state.metadata, hasUnsavedChanges: true } };
        case 'SAVE_SETTINGS_SUCCESS':
            return { ...state, metadata: { ...state.metadata, lastSaved: Date.now(), hasUnsavedChanges: false } };
        case 'SAVE_SETTINGS_START':
        case 'SAVE_SETTINGS_FAILURE':
            return state;
        default:
            return state;
    }
};

export const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

/**
 * Provider component for the Personalization context.
 */
export const PersonalizationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(personalizationReducer, defaultPersonalizationState);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        // Load settings on initial mount
        mockLoadSettingsAPI().then(loadedSettings => {
            if (loadedSettings) {
                // Deep merge with defaults to prevent breakage on new features
                const mergedState = {
                    ...defaultPersonalizationState,
                    ...loadedSettings,
                    theme: { ...defaultPersonalizationState.theme, ...loadedSettings.theme },
                    background: { ...defaultPersonalizationState.background, ...loadedSettings.background },
                    layout: { ...defaultPersonalizationState.layout, ...loadedSettings.layout },
                    metadata: { ...defaultPersonalizationState.metadata, ...loadedSettings.metadata, hasUnsavedChanges: false },
                };
                dispatch({ type: 'SET_STATE', payload: mergedState });
            }
        });
    }, []);

    const saveSettings = useCallback(async () => {
        setIsSaving(true);
        setSaveError(null);
        dispatch({ type: 'SAVE_SETTINGS_START' });
        try {
            await mockSaveSettingsAPI(state);
            dispatch({ type: 'SAVE_SETTINGS_SUCCESS' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setSaveError(errorMessage);
            dispatch({ type: 'SAVE_SETTINGS_FAILURE' });
        } finally {
            setIsSaving(false);
        }
    }, [state]);

    const value = useMemo(() => ({
        state,
        dispatch,
        isSaving,
        saveError,
        saveSettings,
    }), [state, isSaving, saveError, saveSettings]);

    return (
        <PersonalizationContext.Provider value={value}>
            {children}
        </PersonalizationContext.Provider>
    );
};

/**
 * Custom hook to easily access the Personalization context.
 */
export const usePersonalization = (): PersonalizationContextType => {
    const context = useContext(PersonalizationContext);
    if (context === undefined) {
        throw new Error('usePersonalization must be used within a PersonalizationProvider');
    }
    return context;
};


// --- SECTION 4: UTILITY FUNCTIONS & HOOKS ---

/**
 * Converts a hex color to an RGBA string.
 * @param hex The hex color code.
 * @param alpha The alpha transparency value (0-1).
 * @returns The RGBA color string.
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
        : 'rgba(0,0,0,1)';
};

/**
 * A custom hook to debounce a value.
 * @param value The value to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


// --- SECTION 5: CANVAS-BASED DYNAMIC BACKGROUND ---

/**
 * Represents a single particle in the Aurora simulation.
 */
export class AuroraParticle {
    x: number; y: number; vx: number; vy: number; radius: number; color: string; life: number; maxLife: number;
    constructor(w: number, h: number, colors: string[]) {
        this.x = Math.random() * w; this.y = Math.random() * h * 1.2; this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.2 - 0.3;
        this.radius = Math.random() * 80 + 40; this.color = colors[Math.floor(Math.random() * colors.length)]; this.maxLife = Math.random() * 200 + 100; this.life = this.maxLife;
    }
    update() { this.x += this.vx; this.y += this.vy; this.life--; }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const alpha = Math.max(0, this.life / this.maxLife) * 0.2;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, hexToRgba(this.color, alpha)); grad.addColorStop(1, hexToRgba(this.color, 0));
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
}
/**
 * The DynamicBackgroundCanvas component renders a procedural animation on a canvas.
 */
export const DynamicBackgroundCanvas: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { state } = usePersonalization();
    const { reduceMotion } = state.accessibility;
    const { type, options } = state.background.dynamic;

    useEffect(() => {
        if (reduceMotion) return;
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;

        let animationFrameId: number; let particles: AuroraParticle[] = []; let time = 0;
        let canvasWidth = window.innerWidth; let canvasHeight = window.innerHeight;
        canvas.width = canvasWidth; canvas.height = canvasHeight;
        const resizeHandler = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resizeHandler);

        const initAurora = () => { const opts = options as AuroraOptions; particles = Array.from({ length: Math.floor(opts.complexity / 100 * 50) + 10 }, () => new AuroraParticle(canvas.width, canvas.height, opts.colorPalette)); };
        const renderAurora = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.globalCompositeOperation = 'lighter';
            particles.forEach((p, i) => { p.update(); p.draw(ctx); if (p.life <= 0) { particles.splice(i, 1, new AuroraParticle(canvas.width, canvas.height, (options as AuroraOptions).colorPalette)); } });
            ctx.globalCompositeOperation = 'source-over';
        };
        const renderWaves = () => {
            const opts = options as WavesOptions; ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.lineWidth = 2;
            for (let i = 0; i < opts.lineCount; i++) {
                ctx.strokeStyle = hexToRgba(opts.color, 0.5 - (i / opts.lineCount) * 0.4); ctx.beginPath();
                for (let x = 0; x < canvas.width; x++) {
                    const y = canvas.height / 2 + Math.sin(x * (opts.frequency / 1000) + time * (opts.speed / 1000) + i * 0.5) * (opts.amplitude / 2);
                    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
            } time++;
        };
        const renderStarfield = () => {
            const opts = options as StarfieldOptions; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (!particles.length) particles = Array.from({ length: opts.starCount }, () => new (class Star { x=Math.random()*canvas.width; y=Math.random()*canvas.height; z=Math.random()*canvas.width; pz=this.z; constructor(){} update(s:number){this.z-=s; if(this.z<1){this.z=canvas.width;this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;this.pz=this.z;}} draw(ctx:any,w:number,h:number,c:string){ctx.fillStyle=c;const sx=this.x/this.z*w/2+w/2; const sy=this.y/this.z*h/2+h/2; const r=Math.max(0.1,(1-this.z/w)*2);ctx.beginPath();ctx.arc(sx,sy,r,0,Math.PI*2);ctx.fill();}}));
            particles.forEach(p => { p.update(opts.speed/10); p.draw(ctx, canvas.width, canvas.height, opts.starColor); });
        };
        const renderSwitch = { 'aurora': renderAurora, 'waves': renderWaves, 'starfield': renderStarfield };
        if (type === 'aurora') initAurora(); if (type === 'starfield') particles = [];
        const animate = () => { renderSwitch[type](); animationFrameId = window.requestAnimationFrame(animate); };
        animate();
        return () => { window.cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', resizeHandler); };
    }, [type, options, reduceMotion]);
    if (reduceMotion) return null;
    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, backgroundColor: '#000' }} />;
};


// --- SECTION 6: UI PRIMITIVE COMPONENTS ---

export const commonStyles: { [key: string]: CSSProperties } = {
    controlWrapper: { marginBottom: '1rem', },
    label: { display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: '#ccc', },
    input: { width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '4px', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', },
    button: { padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, transition: 'background-color 0.2s', },
};
export const Slider: FC<{ label: string; value: number; min?: number; max?: number; step?: number; onChange: (v: number) => void; }> = ({ label, value, min = 0, max = 100, step = 1, onChange }) => (
    <div style={commonStyles.controlWrapper}>
        <label style={commonStyles.label}>{label} ({value})</label>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: usePersonalization().state.theme.accentColor }} />
    </div>
);
export const ToggleSwitch: FC<{ label: string; checked: boolean; onChange: (c: boolean) => void }> = ({ label, checked, onChange }) => {
    const { state } = usePersonalization();
    return (<div style={{...commonStyles.controlWrapper, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span style={commonStyles.label}>{label}</span>
        <label style={{position:'relative',display:'inline-block',width:'50px',height:'28px'}}><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{opacity:0,width:0,height:0}}/><span style={{position:'absolute',cursor:'pointer',top:0,left:0,right:0,bottom:0,backgroundColor:checked?state.theme.accentColor:'#444',transition:'.4s',borderRadius:'28px'}}><span style={{position:'absolute',content:'""',height:'20px',width:'20px',left:'4px',bottom:'4px',backgroundColor:'white',transition:'.4s',borderRadius:'50%',transform:checked?'translateX(22px)':'translateX(0)'}}></span></span></label>
    </div>);
};
export const ColorPicker: FC<{ label: string; color: string; onChange: (c: string) => void }> = ({ label, color, onChange }) => (
    <div style={commonStyles.controlWrapper}><label style={commonStyles.label}>{label}</label><div style={{display:'flex',alignItems:'center'}}><input type="color" value={color} onChange={e=>onChange(e.target.value)} style={{width:'40px',height:'40px',border:'none',padding:0,cursor:'pointer',backgroundColor:'transparent',}}/><span style={{marginLeft:'1rem',fontFamily:'monospace'}}>{color}</span></div></div>
);
export const Select: FC<{ label: string; value: string; options: string[] | {label: string, value: string}[]; onChange: (v: string) => void; }> = ({ label, value, options, onChange }) => (
    <div style={commonStyles.controlWrapper}><label style={commonStyles.label}>{label}</label><select value={value} onChange={e=>onChange(e.target.value)} style={{...commonStyles.input, appearance:'none'}}>{options.map(opt => typeof opt === 'string' ? <option key={opt} value={opt}>{opt}</option> : <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
);
export const SegmentedControl: FC<{ label: string; options: { label: string; value: string }[]; value: string; onChange: (v: string) => void; }> = ({ label, options, value, onChange }) => {
    const { state } = usePersonalization();
    return (<div style={commonStyles.controlWrapper}><label style={commonStyles.label}>{label}</label><div style={{display:'flex',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'4px',overflow:'hidden'}}>{options.map(opt=>(<button key={opt.value} onClick={()=>onChange(opt.value)} style={{...commonStyles.button,flex:1,borderRadius:0,backgroundColor:value===opt.value?state.theme.accentColor:'transparent',borderRight:'1px solid rgba(255,255,255,0.2)',}}>{opt.label}</button>))}</div></div>);
};
export const Spinner: FC<{ size?: number }> = ({ size = 24 }) => (<div style={{width:size,height:size,border:`${size*0.15}px solid rgba(255,255,255,0.3)`,borderTopColor:'#fff',borderRadius:'50%',animation:'spin 1s linear infinite'}}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>);
export const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => { if (!isOpen) return null; return (<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.7)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{backgroundColor:'#2a2a3e',padding:'2rem',borderRadius:'8px',width:'90%',maxWidth:'600px',position:'relative'}}><h2 style={{marginTop:0}}>{title}</h2><button onClick={onClose} style={{position:'absolute',top:'1rem',right:'1rem',background:'none',border:'none',color:'#fff',fontSize:'1.5rem',cursor:'pointer'}}>&times;</button>{children}</div></div>); };

// --- SECTION 7: SETTINGS SECTION COMPONENTS ---

export const SectionWrapper: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
    <div style={{ marginBottom: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}><h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>{title}</h2>{children}<style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style></div>
);
export const ThemeSettings: FC = () => {
    const { state, dispatch } = usePersonalization(); const { theme } = state;
    return (<SectionWrapper title="Aesthetic & Theme">
        <SegmentedControl label="Color Mode" value={theme.mode} onChange={value => dispatch({ type: 'SET_THEME_MODE', payload: value as any })} options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }, { label: 'System', value: 'system' }]} />
        <ColorPicker label="Primary Color" color={theme.primaryColor} onChange={c => dispatch({ type: 'SET_PRIMARY_COLOR', payload: c })} />
        <ColorPicker label="Accent Color" color={theme.accentColor} onChange={c => dispatch({ type: 'SET_ACCENT_COLOR', payload: c })} />
        <Select label="Font Family" value={theme.fontFamily} onChange={value => dispatch({ type: 'SET_FONT_FAMILY', payload: value })} options={GOOGLE_FONTS}/>
        <Slider label="Font Size" value={theme.fontSize} min={0.8} max={1.5} step={0.1} onChange={v => dispatch({ type: 'SET_FONT_SIZE', payload: v })} />
        <SegmentedControl label="UI Density" value={theme.uiDensity} onChange={value => dispatch({ type: 'SET_UI_DENSITY', payload: value as any })} options={[{ label: 'Compact', value: 'compact' }, { label: 'Comfortable', value: 'comfortable' }, { label: 'Spacious', value: 'spacious' }]} />
    </SectionWrapper>);
};
export const AIGeneratorPanel: FC = () => {
    const { state, dispatch } = usePersonalization(); const { ai } = state.background;
    const handleGenerate = useCallback(async () => { dispatch({ type: 'START_AI_GENERATION' }); try { const { url } = await mockGenerateImageAPI(ai.prompt, ai.style); dispatch({ type: 'AI_GENERATION_SUCCESS', payload: { url, prompt: ai.prompt } }); } catch (e) { dispatch({ type: 'AI_GENERATION_FAILURE', payload: e instanceof Error ? e.message : "Unknown error" }); } }, [dispatch, ai.prompt, ai.style]);
    const handleInspireMe = useCallback(async () => { const { prompt } = await mockGetInspirationAPI(); dispatch({ type: 'SET_AI_PROMPT', payload: prompt }); }, [dispatch]);
    return (<div>
        <div style={commonStyles.controlWrapper}><label style={commonStyles.label}>Your Vision (Prompt)</label><textarea value={ai.prompt} onChange={e => dispatch({ type: 'SET_AI_PROMPT', payload: e.target.value })} placeholder="e.g., An isolated lighthouse on a stormy sea..." style={{ ...commonStyles.input, minHeight: '80px', resize: 'vertical' }} /></div>
        <div style={commonStyles.controlWrapper}><label style={commonStyles.label}>Negative Prompt (Optional)</label><input type="text" value={ai.negativePrompt} onChange={e => dispatch({ type: 'SET_AI_NEGATIVE_PROMPT', payload: e.target.value })} placeholder="e.g., blurry, text, watermark" style={commonStyles.input} /></div>
        <Select label="Art Style" value={ai.style} options={AI_ART_STYLES} onChange={v => dispatch({ type: 'SET_AI_STYLE', payload: v })}/>
        <div style={{display:'flex',gap:'1rem',marginTop:'1.5rem'}}><button onClick={handleGenerate} disabled={ai.isGenerating||!ai.prompt} style={{...commonStyles.button,backgroundColor:state.theme.accentColor,flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>{ai.isGenerating && <Spinner size={20} />}{ai.isGenerating?'Generating...':'Manifest'}</button><button onClick={handleInspireMe} disabled={ai.isGenerating} style={{...commonStyles.button,backgroundColor:'rgba(255,255,255,0.2)'}}>Inspire Me</button></div>
        {ai.error && <p style={{color:'#ff4d4d',marginTop:'1rem'}}>Error: {ai.error}</p>}
        {ai.currentImageUrl && (<div style={{marginTop:'2rem'}}><h4>Current Background:</h4><img src={ai.currentImageUrl} alt="Generated background" style={{width:'100%',borderRadius:'4px',border:'2px solid'+state.theme.accentColor}}/></div>)}
        {ai.history.length>0&&(<div style={{marginTop:'2rem'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h4>History</h4><button onClick={()=>dispatch({type:'CLEAR_AI_HISTORY'})} style={{...commonStyles.button,padding:'0.25rem 0.5rem',fontSize:'0.8rem',backgroundColor:'rgba(255,0,0,0.3)'}}>Clear</button></div><div style={{maxHeight:'300px',overflowY:'auto',display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))',gap:'0.5rem',marginTop:'1rem'}}>{ai.history.map(item=>(<img key={item.timestamp} src={item.url} alt={item.prompt} title={item.prompt} onClick={()=>dispatch({type:'SET_AI_BACKGROUND_IMAGE',payload:item.url})} style={{width:'100%',height:'auto',borderRadius:'4px',cursor:'pointer',border:ai.currentImageUrl===item.url?`2px solid ${state.theme.accentColor}`:'2px solid transparent'}}/>))}</div></div>)}
    </div>);
};
export const ImageBackgroundPanel: FC = () => {
    const { state, dispatch } = usePersonalization(); const { image } = state.background;
    const [galleryImages, setGalleryImages] = useState<{ id: string, url: string, author: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => { mockFetchGalleryImagesAPI().then(data => { setGalleryImages(data.images); setIsLoading(false); }); }, []);
    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => { if(e.target.files?.[0]){ const reader = new FileReader(); reader.onload = (ev) => { if(ev.target?.result) dispatch({ type: 'SET_IMAGE_BACKGROUND_URL', payload: ev.target.result as string }); }; reader.readAsDataURL(e.target.files[0]); }};
    return (<div>
        <h4>Upload Your Own</h4><input type="file" accept="image/*" onChange={handleUpload} style={{...commonStyles.input,padding:'0.5rem'}}/>
        {image.url && (<div style={{marginTop:'1rem'}}><p>Preview:</p><img src={image.url} alt="Uploaded background" style={{width:'100%',maxHeight:'200px',objectFit:'cover',borderRadius:'4px'}}/></div>)}
        <div style={{marginTop:'1.5rem'}}><Slider label="Blur" value={image.blur} onChange={v => dispatch({ type: 'SET_IMAGE_BACKGROUND_BLUR', payload: v })}/><Slider label="Brightness" value={image.brightness} onChange={v => dispatch({ type: 'SET_IMAGE_BACKGROUND_BRIGHTNESS', payload: v })}/><SegmentedControl label="Position" value={image.position} onChange={v => dispatch({ type: 'SET_IMAGE_BACKGROUND_POSITION', payload: v as any })} options={[{label:'Cover',value:'cover'},{label:'Contain',value:'contain'},{label:'Tile',value:'tile'}]}/></div>
        <h4 style={{marginTop:'2rem'}}>Or Select from Gallery</h4>
        {isLoading ? <Spinner /> : (<div style={{maxHeight:'400px',overflowY:'auto',display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))',gap:'0.5rem'}}>{galleryImages.map(img=>(<img key={img.id} src={img.url} alt={`By ${img.author}`} onClick={()=>dispatch({type:'SET_IMAGE_BACKGROUND_URL',payload:img.url})} style={{width:'100%',height:'auto',borderRadius:'4px',cursor:'pointer',border:image.url===img.url?`2px solid ${state.theme.accentColor}`:'2px solid transparent'}}/>))}</div>)}
    </div>);
};
export const DynamicBackgroundPanel: FC = () => {
    const { state, dispatch } = usePersonalization(); const { dynamic } = state.background;
    const renderOptions = () => { switch(dynamic.type){ case 'aurora': const o=dynamic.options as AuroraOptions; return(<> <Slider label="Speed" value={o.speed} onChange={v=>dispatch({type:'UPDATE_DYNAMIC_BACKGROUND_OPTIONS',payload:{speed:v}})}/> <Slider label="Complexity" value={o.complexity} onChange={v=>dispatch({type:'UPDATE_DYNAMIC_BACKGROUND_OPTIONS',payload:{complexity:v}})}/> </>); case 'waves': const w=dynamic.options as WavesOptions; return(<> <Slider label="Speed" value={w.speed} onChange={v=>dispatch({type:'UPDATE_DYNAMIC_BACKGROUND_OPTIONS',payload:{speed:v}})}/> <Slider label="Amplitude" value={w.amplitude} onChange={v=>dispatch({type:'UPDATE_DYNAMIC_BACKGROUND_OPTIONS',payload:{amplitude:v}})}/> <Slider label="Frequency" value={w.frequency} onChange={v=>dispatch({type:'UPDATE_DYNAMIC_BACKGROUND_OPTIONS',payload:{frequency:v}})}/> <ColorPicker label="Color" color={w.color} onChange={c=>dispatch({type:'UPDATE_DYNAMIC_BACKGROUND_OPTIONS',payload:{color:c}})}/> </>); case 'starfield': const s=dynamic.options as StarfieldOptions; return(<> <Slider label="Speed" value={s.speed} onChange={v=>dispatch({type:'UPDATE_DYNAMIC_BACKGROUND_OPTIONS',payload:{speed:v}})}/> <Slider label="Star Count" value={s.starCount} min={50} max={5000} onChange={v=>dispatch({type:'UPDATE_DYNAMIC_BACKGROUND_OPTIONS',payload:{starCount:v}})}/> <ColorPicker label="Star Color" color={s.starColor} onChange={c=>dispatch({type:'UPDATE_DYNAMIC_BACKGROUND_OPTIONS',payload:{starColor:c}})}/> </>); default: return null; } };
    return (<div>
        <SegmentedControl label="Effect Type" value={dynamic.type} onChange={v => dispatch({ type: 'SET_DYNAMIC_BACKGROUND_TYPE', payload: v as any })} options={[{label:'Aurora',value:'aurora'},{label:'Waves',value:'waves'},{label:'Starfield',value:'starfield'}]}/>
        <div style={{marginTop:'1.5rem'}}>{renderOptions()}</div>
    </div>);
};
export const BackgroundSettings: FC = () => {
    const { state, dispatch } = usePersonalization(); const { background: { type, solid } } = state;
    const tabs = [{id:'dynamic',label:'Dynamic'},{id:'ai',label:'AI Generator'},{id:'image',label:'Image'},{id:'solid',label:'Solid Color'}];
    const renderContent = () => { switch(type){ case 'solid': return <ColorPicker label="Background Color" color={solid.color} onChange={c=>dispatch({type:'SET_SOLID_BACKGROUND_COLOR',payload:c})}/>; case 'image': return <ImageBackgroundPanel/>; case 'ai': return <AIGeneratorPanel/>; case 'dynamic': return <DynamicBackgroundPanel/>; default: return null; } };
    return (<SectionWrapper title="World Canvas (Background)">
        <div style={{display:'flex',borderBottom:'1px solid rgba(255,255,255,0.2)',marginBottom:'1.5rem'}}>{tabs.map(t=>(<button key={t.id} onClick={()=>dispatch({type:'SET_BACKGROUND_TYPE',payload:t.id as any})} style={{...commonStyles.button,backgroundColor:'transparent',color:type===t.id?state.theme.accentColor:'#ccc',borderBottom:type===t.id?`2px solid ${state.theme.accentColor}`:'2px solid transparent',borderRadius:0,padding:'0.75rem 1rem',}}>{t.label}</button>))}</div>
        {renderContent()}
    </SectionWrapper>);
};
const DraggableWidgetItem: FC<{ widget: WidgetConfig; index: number; moveWidget: (d: number, h: number) => void }> = ({ widget, index, moveWidget }) => {
    const ref = useRef<HTMLDivElement>(null); const { dispatch } = usePersonalization();
    const [, drop] = useDrop({ accept: 'widget', hover(item: { index: number }) { if(!ref.current)return; const dragIndex=item.index; const hoverIndex=index; if(dragIndex===hoverIndex)return; moveWidget(dragIndex, hoverIndex); item.index=hoverIndex; }, });
    const [{ isDragging }, drag] = useDrag({ type: 'widget', item: { index }, collect: (m) => ({ isDragging: m.isDragging() }), });
    drag(drop(ref));
    return (<div ref={ref} style={{padding:'0.75rem',backgroundColor:'rgba(255,255,255,0.1)',borderRadius:'4px',marginBottom:'0.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',opacity:isDragging?0.5:1,cursor:'move'}}><span>{widget.name}</span><ToggleSwitch label="" checked={widget.enabled} onChange={()=>dispatch({type:'TOGGLE_WIDGET',payload:widget.id})}/></div>);
};
export const LayoutSettings: FC = () => {
    const { state, dispatch } = usePersonalization(); const { layout } = state;
    const moveWidget = (dragIndex: number, hoverIndex: number) => dispatch({ type: 'REORDER_WIDGETS', payload: { dragIndex, hoverIndex } });
    return (<SectionWrapper title="Environment & Layout">
        <SegmentedControl label="Sidebar Position" value={layout.sidebarPosition} onChange={v => dispatch({ type: 'SET_SIDEBAR_POSITION', payload: v as any })} options={[{label:'Left',value:'left'},{label:'Right',value:'right'}]}/>
        <div style={{marginTop:'1.5rem'}}><label style={commonStyles.label}>Dashboard Widgets (Drag to reorder)</label><div>{layout.widgets.map((w, i) => (<DraggableWidgetItem key={w.id} index={i} widget={w} moveWidget={moveWidget}/>))}</div></div>
    </SectionWrapper>);
};
export const SoundSettings: FC = () => {
    const { state, dispatch } = usePersonalization(); const { sound } = state;
    return (<SectionWrapper title="Auditory Resonance">
        <ToggleSwitch label="Enable UI Sounds" checked={sound.enabled} onChange={c => dispatch({ type: 'SET_SOUND_ENABLED', payload: c })} />
        {sound.enabled && (<><Slider label="Volume" value={sound.volume} onChange={v => dispatch({ type: 'SET_SOUND_VOLUME', payload: v })} /><Select label="Sound Theme" value={sound.theme} onChange={v => dispatch({ type: 'SET_SOUND_THEME', payload: v as any })} options={['default', 'calm', 'tech', 'retro']}/></>)}
    </SAectionWrapper>);
};
export const AccessibilitySettings: FC = () => {
    const { state, dispatch } = usePersonalization(); const { accessibility } = state;
    return (<SectionWrapper title="Accessibility">
        <ToggleSwitch label="High Contrast Mode" checked={accessibility.highContrast} onChange={c => dispatch({ type: 'SET_HIGH_CONTRAST', payload: c })} />
        <ToggleSwitch label="Reduce Motion" checked={accessibility.reduceMotion} onChange={c => dispatch({ type: 'SET_REDUCE_MOTION', payload: c })} />
        <ToggleSwitch label="Dyslexia-Friendly Font" checked={accessibility.dyslexicFont} onChange={c => dispatch({ type: 'SET_DYSLEXIC_FONT', payload: c })} />
        <p style={{fontSize:'0.9rem',color:'#aaa',marginTop:'1rem'}}>Note: Font size is managed under "Aesthetic & Theme".</p>
    </SectionWrapper>);
};
export const AiAssistantSettings: FC = () => {
    const { state, dispatch } = usePersonalization(); const { aiAssistant } = state;
    return (<SectionWrapper title="AI Assistant">
        <Select label="Personality" value={aiAssistant.personality} onChange={v => dispatch({ type: 'SET_AI_PERSONALITY', payload: v as any })} options={[{label: 'Professional', value: 'professional'}, {label: 'Witty', value: 'witty'}, {label: 'Zen', value: 'zen'}, {label: 'Explorer', value: 'explorer'}]} />
        <ToggleSwitch label="Proactive Suggestions" checked={aiAssistant.proactiveSuggestions} onChange={c => dispatch({ type: 'SET_AI_PROACTIVE_SUGGESTIONS', payload: c })} />
    </SectionWrapper>);
};
export const IntegrationSettings: FC = () => {
    const { state, dispatch } = usePersonalization(); const { integrations } = state;
    return (<SectionWrapper title="Integrations">
        {integrations.map(int => (<ToggleSwitch key={int.id} label={`Connect to ${int.name}`} checked={int.isConnected} onChange={() => dispatch({ type: 'TOGGLE_INTEGRATION', payload: int.id })} />))}
    </SectionWrapper>);
};

// --- SECTION 8: MAIN VIEW COMPONENT ---

const settingsNav = [
    { id: 'theme', label: 'Theme', component: ThemeSettings },
    { id: 'background', label: 'Background', component: BackgroundSettings },
    { id: 'layout', label: 'Layout', component: LayoutSettings },
    { id: 'sound', label: 'Sound', component: SoundSettings },
    { id: 'accessibility', label: 'Accessibility', component: AccessibilitySettings },
    { id: 'ai', label: 'AI Assistant', component: AiAssistantSettings },
    { id: 'integrations', label: 'Integrations', component: IntegrationSettings },
];

/**
 * The main PersonalizationView component that brings all settings together.
 */
export const PersonalizationView: FC = () => {
    const { state, dispatch, saveSettings, isSaving, saveError } = usePersonalization();
    const { hasUnsavedChanges } = state.metadata;
    const [activeSection, setActiveSection] = useState('theme');
    
    const ActiveComponent = useMemo(() => {
        return settingsNav.find(nav => nav.id === activeSection)?.component || ThemeSettings;
    }, [activeSection]);
    
    return (<div style={{color:'#fff',backgroundColor:'#12121f',minHeight:'100vh',fontFamily:state.theme.fontFamily,display:'flex'}}>
        <aside style={{width:'240px',backgroundColor:'#1a1a2e',padding:'2rem 1rem',borderRight:'1px solid rgba(255,255,255,0.1)'}}>
            <h1 style={{fontSize:'1.8rem',margin:'0 0 2rem 0.5rem',color:state.theme.primaryColor}}>Personalization</h1>
            <nav><ul>{settingsNav.map(nav=>(<li key={nav.id} style={{listStyle:'none',marginBottom:'0.5rem'}}><button onClick={()=>setActiveSection(nav.id)} style={{width:'100%',textAlign:'left',padding:'0.75rem 1rem',background:activeSection===nav.id?'rgba(255,255,255,0.1)':'transparent',border:'none',color:'#fff',borderRadius:'4px',cursor:'pointer',fontWeight:activeSection===nav.id?600:400,fontSize:'1rem'}}>{nav.label}</button></li>))}</ul></nav>
        </aside>

        <main style={{flex:1,padding:'2rem 4rem',overflowY:'auto',height:'100vh'}}>
            <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem',borderBottom:'1px solid rgba(255,255,255,0.2)',paddingBottom:'1rem'}}>
                <div><h1 style={{margin:0,fontSize:'2.5rem'}}>Studio of the Self</h1><p style={{margin:'0.25rem 0 0',color:'#aaa'}}>Shape your environment to be a true reflection of your inner state.</p></div>
                <div style={{display:'flex',gap:'1rem'}}>
                    <button onClick={()=>dispatch({type:'RESET_TO_DEFAULTS'})} style={{...commonStyles.button,backgroundColor:'rgba(255,255,255,0.2)'}}>Reset Defaults</button>
                    <button onClick={saveSettings} disabled={!hasUnsavedChanges || isSaving} style={{...commonStyles.button,backgroundColor:state.theme.primaryColor,display:'flex',alignItems:'center',gap:'0.5rem'}}>{isSaving && <Spinner size={20}/>}{isSaving?'Saving...':'Save Changes'}{hasUnsavedChanges && <div style={{width:'8px',height:'8px',borderRadius:'50%',backgroundColor:state.theme.accentColor,marginLeft:'0.5rem'}}></div>}</button>
                </div>
            </header>
            {saveError && <div style={{backgroundColor:'#5c1f1f',color:'#ffc1c1',padding:'1rem',borderRadius:'4px',marginBottom:'2rem'}}>Error saving settings: {saveError}</div>}
            
            <DndProvider backend={HTML5Backend}>
                <div style={{maxWidth:'900px',margin:'0 auto'}}>
                    <ActiveComponent />
                </div>
            </DndProvider>
        </main>
        <DynamicBackgroundCanvas />
    </div>);
};

/**
 * A wrapper component that includes the necessary providers for the PersonalizationView.
 * This would typically be used in the application's routing system.
 */
export const PersonalizationViewWithProvider: FC = () => {
    return (
        <PersonalizationProvider>
            <PersonalizationView />
        </PersonalizationProvider>
    );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/PersonalizationView.tsx.md
================================================================================


# The Personalization

This is the studio of the self. The space where the inner landscape is projected onto the outer vessel. It is the act of shaping your environment to be a true reflection of your inner state. To personalize is to attune your reality to your own frequency, creating a world that resonates in perfect harmony with the vision you hold within.

---

### A Fable for the Builder: The Color of the Sky

(They say you cannot change the world. That you can only change yourself. We thought, why not both? This `Personalization` view is a testament to that idea. It is the place where you, the creator, are given the power to change the very color of the sky in your own digital world.)

(A simple background image may seem trivial. A cosmetic choice. But we saw it as something deeper. It is an act of claiming a space, of making it your own. It is the difference between a sterile, generic hotel room and your own home. We wanted this Instrument to feel like home.)

(But we wanted to give you more than just a paintbrush. We wanted to give you a muse. That is the purpose of the `AI Background Generator`. You do not have to be an artist. You only need to have a feeling, an idea, a dream. You speak that dream into the prompt—"an isolated lighthouse on a stormy sea"—and the AI becomes your hands. It translates your feeling into light and color, and projects it onto the canvas of your world.)

(This is a profound partnership. The AI does not create on its own. It requires the spark of your intent. It is a tool for the manifestation of your inner landscape. The choice of the 'Aurora Illusion' is another path. It is for those who prefer their world not to be static, but to be alive, dynamic, a constant, gentle flow of color and light.)

(This is our 'Aesthetic Resonance' principle. We believe that the environment in which you think affects the quality of your thoughts. By giving you the power to shape this environment, to make it a true reflection of your inner state, we believe we are helping you to think more clearly, more creatively, more powerfully. It is a simple truth: a person who feels at home in their world is a person who can do great things within it.)


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/PersonalizationView.tsx.md
================================================================================


# The Personalization

This is the studio of the self. The space where the inner landscape is projected onto the outer vessel. It is the act of shaping your environment to be a true reflection of your inner state. To personalize is to attune your reality to your own frequency, creating a world that resonates in perfect harmony with the vision you hold within.

---

### A Fable for the Builder: The Color of the Sky

(They say you cannot change the world. That you can only change yourself. We thought, why not both? This `Personalization` view is a testament to that idea. It is the place where you, the creator, are given the power to change the very color of the sky in your own digital world.)

(A simple background image may seem trivial. A cosmetic choice. But we saw it as something deeper. It is an act of claiming a space, of making it your own. It is the difference between a sterile, generic hotel room and your own home. We wanted this Instrument to feel like home.)

(But we wanted to give you more than just a paintbrush. We wanted to give you a muse. That is the purpose of the `AI Background Generator`. You do not have to be an artist. You only need to have a feeling, an idea, a dream. You speak that dream into the prompt—"an isolated lighthouse on a stormy sea"—and the AI becomes your hands. It translates your feeling into light and color, and projects it onto the canvas of your world.)

(This is a profound partnership. The AI does not create on its own. It requires the spark of your intent. It is a tool for the manifestation of your inner landscape. The choice of the 'Aurora Illusion' is another path. It is for those who prefer their world not to be static, but to be alive, dynamic, a constant, gentle flow of color and light.)

(This is our 'Aesthetic Resonance' principle. We believe that the environment in which you think affects the quality of your thoughts. By giving you the power to shape this environment, to make it a true reflection of your inner state, we believe we are helping you to think more clearly, more creatively, more powerfully. It is a simple truth: a person who feels at home in their world is a person who can do great things within it.)
