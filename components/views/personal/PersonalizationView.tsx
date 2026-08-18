// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/PersonalizationView.tsx
================================================================================

// components/views/personal/PersonalizationView.tsx
import React, { useContext, useState } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { IllusionType } from '../../../types';
import { GoogleGenAI } from '@google/genai';

const PersonalizationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("PersonalizationView must be within a DataProvider.");

    const { customBackgroundUrl, setCustomBackgroundUrl, activeIllusion, setActiveIllusion } = context;

    const [imageUrl, setImageUrl] = useState('');
    const [aiPrompt, setAiPrompt] = useState('An isolated lighthouse on a stormy sea, digital painting');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    
    const handleGenerate = async () => {
        setIsGenerating(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: aiPrompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const generatedUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setCustomBackgroundUrl(generatedUrl);
        } catch (err) {
            setError('Could not generate image. The model may have safety concerns with your prompt.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Personalization</h2>
            <Card title="Dynamic Visuals">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                        <h4 className="font-semibold text-white">Aurora Illusion</h4>
                        <p className="text-sm text-gray-400">A dynamic, flowing gradient inspired by the northern lights.</p>
                    </div>
                    <input type="radio" name="theme" className="radio radio-primary" checked={activeIllusion === 'aurora'} onChange={() => setActiveIllusion('aurora')} />
                </div>
                 <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg mt-2">
                    <div><h4 className="font-semibold text-white">None</h4><p className="text-sm text-gray-400">Default dark theme.</p></div>
                    <input type="radio" name="theme" className="radio radio-primary" checked={activeIllusion === 'none'} onChange={() => setActiveIllusion('none')} />
                </div>
            </Card>
            
            <Card title="AI Background Generator">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <p className="text-gray-400 mb-4">Describe the background you want, and our AI will create it for you.</p>
                        <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">{isGenerating ? 'Generating...' : 'Generate & Set Background'}</button>
                        {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
                    </div>
                    <div className="h-48 rounded-lg bg-gray-900/50 flex items-center justify-center">
                        {isGenerating ? <p className="text-cyan-300">Generating...</p> : <p className="text-gray-500">Preview will appear here</p>}
                    </div>
                </div>
            </Card>

            <Card title="Custom Background Image">
                <p className="text-gray-400 mb-4">Or, paste an image URL for a static background.</p>
                <div className="flex gap-2">
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <button onClick={() => setCustomBackgroundUrl(imageUrl)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">Set Image</button>
                </div>
            </Card>
        </div>
    );
};

export default PersonalizationView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/PersonalizationView.tsx
================================================================================

// components/views/personal/PersonalizationView.tsx
import React, { useContext, useState, useReducer, useCallback, useMemo, useEffect, useRef } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { IllusionType } from '../../../types';
// Note: In a real app, the API key would be managed securely, likely via a backend proxy.
// For this example, we assume it's available as an environment variable or entered by the user.
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';


// --- Enhanced Types for a Real-World Application ---

export type ColorValue = string; // e.g., '#RRGGBB', 'rgba(r,g,b,a)'
export type Gradient = { from: ColorValue; to: ColorValue; direction?: string };
export type FontStyle = 'normal' | 'italic' | 'oblique';
export type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number;
export type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';
export type UI_DENSITY = 'compact' | 'comfortable' | 'spacious';

export interface ThemeFont {
    family: string;
    weight: FontWeight;
    style: FontStyle;
    size: string; // e.g., '16px', '1rem'
    lineHeight: number | string;
    letterSpacing: string;
    textTransform: TextTransform;
}

export interface Theme {
    id: string;
    name: string;
    isCustom?: boolean;
    aiGenerated?: boolean;
    aiPrompt?: string;
    colors: {
        primary: ColorValue;
        secondary: ColorValue;
        accent: ColorValue;
        textPrimary: ColorValue;
        textSecondary: ColorValue;
        background: ColorValue | Gradient;
        cardBackground: ColorValue;
        borderColor: ColorValue;
        success: ColorValue;
        warning: ColorValue;
        error: ColorValue;
        info: ColorValue;
    };
    fonts: {
        heading: ThemeFont;
        body: ThemeFont;
    };
    styles: {
        borderRadius: string;
        cardShadow: string;
        blurIntensity?: string; // for glassmorphism effects
        uiDensity: UI_DENSITY;
    };
}

export interface Widget {
    id: string;
    name: string;
    description: string;
    component: string; // Component identifier
    defaultSize: { width: number; height: number }; // Grid units
    tags: string[]; // e.g., ['finance', 'productivity']
}

export interface LayoutConfiguration {
    [widgetId: string]: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
}

export type SoundPack = {
    id: string;
    name: string;
    sounds: {
        notification: string; // URL to sound file
        confirmation: string;
        error: string;
        uiClick: string;
    };
};

export interface AccessibilitySettings {
    fontSizeMultiplier: number; // 1 = normal, 1.5 = 50% larger
    highContrastMode: boolean;
    reducedMotion: boolean;
    colorBlindFilter: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
}

// --- Mock Data and Constants ---

export const PREDEFINED_THEMES: Theme[] = [
    {
        id: 'default-dark',
        name: 'Default Dark',
        colors: {
            primary: '#0D9488', // Teal-600
            secondary: '#475569', // Slate-600
            accent: '#38BDF8', // Sky-400
            textPrimary: '#F8FAFC', // Slate-50
            textSecondary: '#94A3B8', // Slate-400
            background: { from: '#0F172A', to: '#1E293B', direction: 'to bottom right' }, // Slate-900 to Slate-800
            cardBackground: 'rgba(30, 41, 59, 0.5)', // Slate-800 with transparency
            borderColor: '#334155', // Slate-700
            success: '#22C55E', // Green-500
            warning: '#F59E0B', // Amber-500
            error: '#EF4444', // Red-500
            info: '#3B82F6', // Blue-500
        },
        fonts: {
            heading: { family: 'Inter, sans-serif', weight: 'bold', style: 'normal', size: '1.5rem', lineHeight: 1.2, letterSpacing: '0px', textTransform: 'none' },
            body: { family: 'Inter, sans-serif', weight: 'normal', style: 'normal', size: '1rem', lineHeight: 1.5, letterSpacing: '0px', textTransform: 'none' },
        },
        styles: {
            borderRadius: '0.75rem',
            cardShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            blurIntensity: '10px',
            uiDensity: 'comfortable',
        },
    },
    {
        id: 'cyberpunk-neon',
        name: 'Cyberpunk Neon',
        colors: {
            primary: '#F43F5E', // Rose-500
            secondary: '#6D28D9', // Violet-700
            accent: '#00FFFF', // Cyan
            textPrimary: '#ECFDF5',
            textSecondary: '#A78BFA', // Violet-400
            background: { from: '#020617', to: '#1D1B44' }, // Slate-950 to Indigo-950
            cardBackground: 'rgba(28, 25, 62, 0.6)',
            borderColor: '#4F46E5', // Indigo-600
            success: '#39FF14', // Neon Green
            warning: '#FFFF00', // Neon Yellow
            error: '#FF073A', // Neon Red
            info: '#00BFFF', // Deep Sky Blue
        },
        fonts: {
            heading: { family: '"Orbitron", sans-serif', weight: 700, style: 'normal', size: '1.6rem', lineHeight: 1.3, letterSpacing: '1px', textTransform: 'uppercase' },
            body: { family: '"Rajdhani", sans-serif', weight: 400, style: 'normal', size: '1.1rem', lineHeight: 1.6, letterSpacing: '0.5px', textTransform: 'none' },
        },
        styles: {
            borderRadius: '0.25rem',
            cardShadow: '0 0 15px rgba(244, 63, 94, 0.5)',
            blurIntensity: '5px',
            uiDensity: 'compact'
        },
    },
    {
        id: 'solar-flare',
        name: 'Solar Flare',
        colors: {
            primary: '#F97316', // Orange-500
            secondary: '#DC2626', // Red-600
            accent: '#FACC15', // Yellow-400
            textPrimary: '#FFFFFF',
            textSecondary: '#FDE68A', // Yellow-200
            background: { from: '#450A0A', to: '#7F1D1D' }, // Red-950 to Red-900
            cardBackground: 'rgba(127, 29, 29, 0.4)',
            borderColor: '#991B1B', // Red-800
            success: '#84CC16', // Lime-500
            warning: '#F59E0B', // Amber-500
            error: '#E11D48', // Rose-600
            info: '#FBBF24' // Amber-400
        },
        fonts: {
            heading: { family: '"Exo 2", sans-serif', weight: 800, style: 'normal', size: '1.5rem', lineHeight: 1.2, letterSpacing: '-0.5px', textTransform: 'none' },
            body: { family: '"Roboto", sans-serif', weight: 400, style: 'normal', size: '1rem', lineHeight: 1.5, letterSpacing: '0px', textTransform: 'none' },
        },
        styles: {
            borderRadius: '1rem',
            cardShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
            blurIntensity: '15px',
            uiDensity: 'spacious'
        },
    },
    {
        id: 'minimalist-light',
        name: 'Minimalist Light',
        colors: {
            primary: '#2563EB', // Blue-600
            secondary: '#475569', // Slate-600
            accent: '#16A34A', // Green-600
            textPrimary: '#1E293B', // Slate-800
            textSecondary: '#64748B', // Slate-500
            background: '#F1F5F9', // Slate-100
            cardBackground: '#FFFFFF',
            borderColor: '#E2E8F0', // Slate-200
            success: '#16A34A',
            warning: '#F59E0B',
            error: '#DC2626',
            info: '#60A5FA' // Blue-400
        },
        fonts: {
            heading: { family: 'system-ui, sans-serif', weight: 600, style: 'normal', size: '1.5rem', lineHeight: 1.3, letterSpacing: '0px', textTransform: 'none' },
            body: { family: 'system-ui, sans-serif', weight: 400, style: 'normal', size: '1rem', lineHeight: 1.6, letterSpacing: '0px', textTransform: 'none' },
        },
        styles: {
            borderRadius: '0.5rem',
            cardShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
            blurIntensity: '0px',
            uiDensity: 'comfortable'
        },
    }
];

export const AVAILABLE_WIDGETS: Widget[] = [
    { id: 'clock', name: 'World Clock', description: 'Display time from different timezones.', component: 'ClockWidget', defaultSize: { width: 2, height: 1 }, tags: ['productivity', 'global'] },
    { id: 'weather', name: 'Weather Forecast', description: 'Show current weather and forecast.', component: 'WeatherWidget', defaultSize: { width: 2, height: 2 }, tags: ['lifestyle', 'planning'] },
    { id: 'news', name: 'News Feed', description: 'Latest headlines from your favorite sources.', component: 'NewsWidget', defaultSize: { width: 3, height: 3 }, tags: ['information', 'global'] },
    { id: 'system', name: 'System Monitor', description: 'CPU, RAM, and network usage.', component: 'SystemWidget', defaultSize: { width: 2, height: 2 }, tags: ['tech', 'monitoring'] },
    { id: 'notes', name: 'Quick Notes', description: 'Jot down your thoughts.', component: 'NotesWidget', defaultSize: { width: 2, height: 2 }, tags: ['productivity'] },
    { id: 'calendar', name: 'Calendar', description: 'View your upcoming events.', component: 'CalendarWidget', defaultSize: { width: 3, height: 3 }, tags: ['planning', 'productivity'] },
    { id: 'stocks', name: 'Stock Ticker', description: 'Track your favorite stocks.', component: 'StockWidget', defaultSize: { width: 3, height: 2 }, tags: ['finance'] },
    { id: 'crypto', name: 'Crypto Prices', description: 'Live prices for top cryptocurrencies.', component: 'CryptoWidget', defaultSize: { width: 3, height: 2 }, tags: ['finance', 'crypto'] },
];

export const SOUND_PACKS: SoundPack[] = [
    { id: 'modern', name: 'Modern', sounds: { notification: '/sounds/modern_notification.mp3', confirmation: '/sounds/modern_confirmation.mp3', error: '/sounds/modern_error.mp3', uiClick: '/sounds/modern_click.mp3' } },
    { id: 'retro', name: 'Retro Gaming', sounds: { notification: '/sounds/retro_notification.wav', confirmation: '/sounds/retro_confirmation.wav', error: '/sounds/retro_error.wav', uiClick: '/sounds/retro_click.wav' } },
    { id: 'sci-fi', name: 'Sci-Fi Interface', sounds: { notification: '/sounds/scifi_notification.ogg', confirmation: '/sounds/scifi_confirmation.ogg', error: '/sounds/scifi_error.ogg', uiClick: '/sounds/scifi_click.ogg' } },
    { id: 'calm', name: 'Calm & Natural', sounds: { notification: '/sounds/calm_notification.mp3', confirmation: '/sounds/calm_confirmation.mp3', error: '/sounds/calm_error.mp3', uiClick: '/sounds/calm_click.mp3' } },
    { id: 'none', name: 'Silent', sounds: { notification: '', confirmation: '', error: '', uiClick: '' } },
];

// --- AI Service Layer (Mocks for demonstration) ---
// In a real app, this would be in a separate `services` directory.

class AIService {
    private static isConfigured() {
        if (!GEMINI_API_KEY) {
            console.warn("Gemini API key is not configured.");
            return false;
        }
        return true;
    }

    static async generateThemeFromPrompt(prompt: string): Promise<Partial<Theme>> {
        if (!this.isConfigured()) throw new Error("AI Service is not configured. Please provide an API key.");
        // This is a simplified simulation. A real implementation would use the GenAI SDK.
        console.log(`Generating theme with prompt: "${prompt}"`);

        // Simulate API call delay
        await new Promise(res => setTimeout(res, 2000));

        // In a real application, you would make an API call to a generative AI model
        // with a carefully crafted system prompt to ensure it returns valid JSON
        // matching the Theme interface.
        // For example, you might use Google's Gemini with function calling or JSON mode.
        
        // Mock response based on prompt keywords
        if (prompt.toLowerCase().includes("ocean")) {
            return {
                colors: {
                    primary: '#0ea5e9',
                    secondary: '#334155',
                    accent: '#a3e635',
                    textPrimary: '#f8fafc',
                    textSecondary: '#cbd5e1',
                    background: { from: '#0c4a6e', to: '#030712' },
                    cardBackground: 'rgba(14, 165, 233, 0.1)',
                    borderColor: '#1e3a8a',
                },
                fonts: {
                    heading: { family: "'Merriweather', serif", weight: 700, style: 'normal', size: '1.6rem', lineHeight: 1.3, letterSpacing: '0px', textTransform: 'none' },
                    body: { family: "'Lato', sans-serif", weight: 400, style: 'normal', size: '1rem', lineHeight: 1.6, letterSpacing: '0px', textTransform: 'none' },
                },
            };
        }
        // Default mock for other prompts
        return {
            colors: {
                primary: '#d946ef',
                secondary: '#4c1d95',
                accent: '#fde047',
                textPrimary: '#f3e8ff',
                textSecondary: '#a8a29e',
                background: { from: '#2e1065', to: '#171717' },
                cardBackground: 'rgba(217, 70, 239, 0.1)',
                borderColor: '#581c87',
            },
            fonts: {
                heading: { family: "'Playfair Display', serif", weight: 700, style: 'normal', size: '1.6rem', lineHeight: 1.3, letterSpacing: '0px', textTransform: 'none' },
                body: { family: "'Source Sans Pro', sans-serif", weight: 400, style: 'normal', size: '1rem', lineHeight: 1.6, letterSpacing: '0px', textTransform: 'none' },
            },
        };
    }

    static async suggestLayoutForRole(role: string): Promise<LayoutConfiguration> {
        if (!this.isConfigured()) throw new Error("AI Service is not configured.");
        console.log(`Suggesting layout for role: "${role}"`);
        await new Promise(res => setTimeout(res, 1500));
        
        // Mock layout suggestions
        switch (role.toLowerCase()) {
            case 'day trader':
                return {
                    'stocks': { x: 0, y: 0, w: 4, h: 2 },
                    'crypto': { x: 4, y: 0, w: 4, h: 2 },
                    'news': { x: 0, y: 2, w: 8, h: 3 },
                };
            case 'project manager':
                 return {
                    'calendar': { x: 0, y: 0, w: 4, h: 3 },
                    'notes': { x: 4, y: 0, w: 3, h: 3 },
                    'system': { x: 0, y: 3, w: 2, h: 2 },
                };
            default:
                return {
                    'clock': { x: 0, y: 0, w: 2, h: 1 },
                    'weather': { x: 2, y: 0, w: 2, h: 2 },
                    'news': { x: 4, y: 0, w: 4, h: 4 },
                };
        }
    }

    static async generateImage(prompt: string): Promise<string> {
        if (!this.isConfigured()) throw new Error("AI Service is not configured.");
        console.log(`Generating image with prompt: "${prompt}"`);
        await new Promise(res => setTimeout(res, 3000));
        // Mocked response
        // In a real app, this would use an image generation model API
        // and return a data URL or a hosted image URL.
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 288;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const grad = ctx.createLinearGradient(0, 0, 512, 288);
            grad.addColorStop(0, `#${Math.floor(Math.random()*16777215).toString(16)}`);
            grad.addColorStop(1, `#${Math.floor(Math.random()*16777215).toString(16)}`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 288);
            ctx.fillStyle = 'white';
            ctx.font = '20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`Mock image for:`, 256, 130);
            ctx.fillText(prompt.substring(0, 40), 256, 160);
        }
        return canvas.toDataURL('image/jpeg');
    }
}


// --- Helper Components ---

export const ColorPicker: React.FC<{ label: string; color: ColorValue; onChange: (color: ColorValue) => void }> = ({ label, color, onChange }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm text-gray-300">{label}</label>
        <div className="relative">
            <input
                type="color"
                value={color.startsWith('#') ? color : '#ffffff'}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 p-0 border-none rounded-md cursor-pointer appearance-none"
                style={{ backgroundColor: color }}
            />
        </div>
    </div>
);

export const Slider: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; unit?: string }> = ({ label, value, min, max, step, onChange, unit }) => (
    <div>
        <label className="text-sm text-gray-300 flex justify-between">
            <span>{label}</span>
            <span>{value}{unit}</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm"
        />
    </div>
);

export const FontSelector: React.FC<{ label: string; font: ThemeFont; onChange: (font: ThemeFont) => void }> = ({ label, font, onChange }) => {
    const availableFonts = ['Inter', 'Roboto', 'Orbitron', 'Rajdhani', 'Exo 2', 'system-ui', 'monospace', 'Merriweather', 'Lato', 'Playfair Display', 'Source Sans Pro'];
    const availableWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900, 'normal', 'bold'];
    const textTransforms: TextTransform[] = ['none', 'capitalize', 'uppercase', 'lowercase'];

    return (
        <div className="space-y-2 p-2 border border-gray-700 rounded-lg">
            <h5 className="font-semibold text-white">{label}</h5>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400">Family</label>
                    <select value={font.family.split(',')[0]} onChange={e => onChange({ ...font, family: `${e.target.value}, sans-serif` })} className="select select-bordered select-sm w-full bg-gray-700/50">
                        {availableFonts.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-400">Weight</label>
                    <select value={font.weight} onChange={e => onChange({ ...font, weight: typeof e.target.value === 'string' ? e.target.value : parseInt(e.target.value, 10) })} className="select select-bordered select-sm w-full bg-gray-700/50">
                        {availableWeights.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="text-xs text-gray-400">Size (px)</label>
                    <input type="number" value={parseInt(font.size, 10)} onChange={e => onChange({ ...font, size: `${e.target.value}px` })} className="input input-sm w-full bg-gray-700/50" />
                </div>
                <div>
                    <label className="text-xs text-gray-400">Line Height</label>
                    <input type="number" step="0.1" value={font.lineHeight} onChange={e => onChange({ ...font, lineHeight: parseFloat(e.target.value) })} className="input input-sm w-full bg-gray-700/50" />
                </div>
                <div>
                    <label className="text-xs text-gray-400">Style</label>
                    <select value={font.style} onChange={e => onChange({ ...font, style: e.target.value as FontStyle })} className="select select-bordered select-sm w-full bg-gray-700/50">
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                        <option value="oblique">Oblique</option>
                    </select>
                </div>
                 <div>
                    <label className="text-xs text-gray-400">Transform</label>
                    <select value={font.textTransform} onChange={e => onChange({ ...font, textTransform: e.target.value as TextTransform })} className="select select-bordered select-sm w-full bg-gray-700/50">
                        {textTransforms.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};


// --- Main View and Sub-Components ---

type PersonalizationState = {
    activeTheme: Theme;
    customThemes: Theme[];
    dashboardLayout: LayoutConfiguration;
    activeSoundPack: SoundPack;
    accessibility: AccessibilitySettings;
    aiBackgroundHistory: string[];
    showThemeCreator: boolean;
};

type PersonalizationAction =
    | { type: 'SET_THEME'; payload: Theme }
    | { type: 'UPDATE_CUSTOM_THEME'; payload: Theme }
    | { type: 'SAVE_CUSTOM_THEME'; payload: Theme }
    | { type: 'DELETE_CUSTOM_THEME'; payload: string }
    | { type: 'SET_LAYOUT'; payload: LayoutConfiguration }
    | { type: 'SET_SOUND_PACK'; payload: SoundPack }
    | { type: 'SET_ACCESSIBILITY'; payload: Partial<AccessibilitySettings> }
    | { type: 'ADD_AI_HISTORY'; payload: string }
    | { type: 'TOGGLE_THEME_CREATOR'; payload: boolean }
    | { type: 'RESET_SETTINGS' };

const initialState: PersonalizationState = {
    activeTheme: PREDEFINED_THEMES[0],
    customThemes: [],
    dashboardLayout: {
        'clock': { x: 0, y: 0, w: 2, h: 1 },
        'weather': { x: 2, y: 0, w: 2, h: 2 },
    },
    activeSoundPack: SOUND_PACKS[0],
    accessibility: {
        fontSizeMultiplier: 1,
        highContrastMode: false,
        reducedMotion: false,
        colorBlindFilter: 'none',
    },
    aiBackgroundHistory: [],
    showThemeCreator: false,
};

const personalizationReducer = (state: PersonalizationState, action: PersonalizationAction): PersonalizationState => {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, activeTheme: action.payload };
        case 'SAVE_CUSTOM_THEME':
            const existingIndex = state.customThemes.findIndex(t => t.id === action.payload.id);
            if (existingIndex > -1) {
                const updatedThemes = [...state.customThemes];
                updatedThemes[existingIndex] = action.payload;
                return { ...state, customThemes: updatedThemes, activeTheme: action.payload };
            }
            return { ...state, customThemes: [...state.customThemes, action.payload], activeTheme: action.payload };
        case 'DELETE_CUSTOM_THEME':
            return {
                ...state,
                customThemes: state.customThemes.filter(t => t.id !== action.payload),
                activeTheme: state.activeTheme.id === action.payload ? PREDEFINED_THEMES[0] : state.activeTheme,
            };
        case 'UPDATE_CUSTOM_THEME':
             return { ...state, activeTheme: action.payload };
        case 'SET_LAYOUT':
            return { ...state, dashboardLayout: action.payload };
        case 'SET_SOUND_PACK':
            return { ...state, activeSoundPack: action.payload };
        case 'SET_ACCESSIBILITY':
            return { ...state, accessibility: { ...state.accessibility, ...action.payload } };
        case 'ADD_AI_HISTORY':
            return { ...state, aiBackgroundHistory: [action.payload, ...state.aiBackgroundHistory].slice(0, 10) };
        case 'TOGGLE_THEME_CREATOR':
            return { ...state, showThemeCreator: action.payload };
        case 'RESET_SETTINGS':
            return { ...initialState, customThemes: state.customThemes }; // Keep custom themes on reset
        default:
            return state;
    }
};

export const ThemePreview: React.FC<{ theme: Theme }> = ({ theme }) => {
    const backgroundStyle = typeof theme.colors.background === 'string'
        ? { backgroundColor: theme.colors.background }
        : { backgroundImage: `linear-gradient(${theme.colors.background.direction || 'to bottom right'}, ${theme.colors.background.from}, ${theme.colors.background.to})` };

    return (
        <div className="p-4 rounded-lg border-2" style={{ borderColor: theme.colors.borderColor, ...backgroundStyle }}>
            <h3 style={{ ...theme.fonts.heading, color: theme.colors.textPrimary, fontSize: '1.2rem' }}>{theme.name}</h3>
            <div
                className="p-3 mt-2 rounded-md"
                style={{
                    backgroundColor: theme.colors.cardBackground,
                    boxShadow: theme.styles.cardShadow,
                    borderRadius: theme.styles.borderRadius,
                    backdropFilter: `blur(${theme.styles.blurIntensity})`,
                }}
            >
                <p style={{ ...theme.fonts.body, color: theme.colors.textSecondary }}>This is how body text will look. It's designed for readability.</p>
                <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 text-sm rounded-md" style={{ backgroundColor: theme.colors.primary, color: theme.colors.textPrimary }}>Primary</button>
                    <button className="px-3 py-1 text-sm rounded-md" style={{ backgroundColor: theme.colors.accent, color: '#000' }}>Accent</button>
                </div>
            </div>
        </div>
    );
};

export const ThemeCustomizer: React.FC<{ theme: Theme; onThemeChange: (theme: Theme) => void; onSave: (theme: Theme) => void; onCancel: () => void, onGenerateWithAI: (prompt: string) => Promise<void>, isGenerating: boolean }> = ({ theme, onThemeChange, onSave, onCancel, onGenerateWithAI, isGenerating }) => {
    const [name, setName] = useState(theme.name);
    const [aiThemePrompt, setAiThemePrompt] = useState(theme.aiPrompt || "A tranquil cherry blossom garden at night");

    const handleColorChange = (key: keyof Theme['colors'], value: ColorValue) => {
        onThemeChange({ ...theme, colors: { ...theme.colors, [key]: value } });
    };

    const handleFontChange = (key: keyof Theme['fonts'], value: ThemeFont) => {
        onThemeChange({ ...theme, fonts: { ...theme.fonts, [key]: value } });
    };
    
    const handleAIThemeGeneration = async () => {
        await onGenerateWithAI(aiThemePrompt);
    };

    return (
        <div className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
             <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-white mb-2">✨ AI Theme Generator</h4>
                <p className="text-sm text-gray-400 mb-2">Describe the vibe you're going for, and let AI create a theme for you.</p>
                <div className="flex gap-2">
                    <input type="text" value={aiThemePrompt} onChange={e => setAiThemePrompt(e.target.value)} placeholder="e.g., retro-futuristic synthwave" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <button onClick={handleAIThemeGeneration} disabled={isGenerating} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 min-w-[120px]">
                        {isGenerating ? <span className="loading loading-spinner loading-sm"></span> : 'Generate'}
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white pt-4 border-t border-gray-700">Manual Theme Editor</h3>
            <div>
                <label className="text-sm text-gray-300">Theme Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-white">Colors</h4>
                    <ColorPicker label="Primary" color={theme.colors.primary} onChange={v => handleColorChange('primary', v)} />
                    <ColorPicker label="Accent" color={theme.colors.accent} onChange={v => handleColorChange('accent', v)} />
                    <ColorPicker label="Text" color={theme.colors.textPrimary} onChange={v => handleColorChange('textPrimary', v)} />
                    <ColorPicker label="Card BG" color={theme.colors.cardBackground} onChange={v => handleColorChange('cardBackground', v)} />
                    <ColorPicker label="Border" color={theme.colors.borderColor} onChange={v => handleColorChange('borderColor', v)} />
                </div>
                <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-white">Styles</h4>
                    <Slider label="Border Radius" value={parseInt(theme.styles.borderRadius)} min={0} max={32} step={1} unit="px" onChange={v => onThemeChange({ ...theme, styles: { ...theme.styles, borderRadius: `${v}px` } })} />
                    <Slider label="Glassmorphism Blur" value={parseInt(theme.styles.blurIntensity || '0')} min={0} max={20} step={1} unit="px" onChange={v => onThemeChange({ ...theme, styles: { ...theme.styles, blurIntensity: `${v}px` } })} />
                </div>
            </div>
            
            <FontSelector label="Heading Font" font={theme.fonts.heading} onChange={f => handleFontChange('heading', f)} />
            <FontSelector label="Body Font" font={theme.fonts.body} onChange={f => handleFontChange('body', f)} />

            <div className="mt-4">
                <h4 className="font-semibold text-white mb-2">Live Preview</h4>
                <ThemePreview theme={theme} />
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">Cancel</button>
                <button onClick={() => onSave({ ...theme, name })} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Save Theme</button>
            </div>
        </div>
    );
};

export const WidgetLayoutEditor: React.FC<{ layout: LayoutConfiguration; onLayoutChange: (layout: LayoutConfiguration) => void }> = ({ layout, onLayoutChange }) => {
    const [widgets, setWidgets] = useState(AVAILABLE_WIDGETS.filter(w => layout[w.id]));
    const [aiRole, setAiRole] = useState('project manager');
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [error, setError] = useState('');

    const addWidget = (widget: Widget) => {
        if (!layout[widget.id]) {
            const newLayout = { ...layout, [widget.id]: { x: 0, y: 0, ...widget.defaultSize } };
            onLayoutChange(newLayout);
            setWidgets([...widgets, widget]);
        }
    };
    
    const removeWidget = (widgetId: string) => {
        const { [widgetId]: _, ...restLayout } = layout;
        onLayoutChange(restLayout);
        setWidgets(widgets.filter(w => w.id !== widgetId));
    };
    
    const handleAISuggestion = async () => {
        setIsSuggesting(true);
        setError('');
        try {
            const suggestedLayout = await AIService.suggestLayoutForRole(aiRole);
            onLayoutChange(suggestedLayout);
            setWidgets(AVAILABLE_WIDGETS.filter(w => suggestedLayout[w.id]));
        } catch (e: any) {
            setError(e.message || 'Failed to get AI suggestion.');
        } finally {
            setIsSuggesting(false);
        }
    };

    return (
        <div>
            <div className="p-4 bg-gray-800 rounded-lg mb-4">
                <h4 className="font-semibold text-white mb-2">🤖 AI Layout Assistant</h4>
                <p className="text-sm text-gray-400 mb-2">Tell us your role, and we'll suggest a dashboard layout for you.</p>
                <div className="flex gap-2">
                    <input type="text" value={aiRole} onChange={e => setAiRole(e.target.value)} placeholder="e.g., Day Trader, Project Manager" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <button onClick={handleAISuggestion} disabled={isSuggesting} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 min-w-[120px]">
                         {isSuggesting ? <span className="loading loading-spinner loading-sm"></span> : 'Suggest'}
                    </button>
                </div>
                 {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
            </div>

            <div className="grid grid-cols-8 gap-4 p-4 bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-600 min-h-[200px]">
                {widgets.map(widget => (
                    <div key={widget.id} className="bg-cyan-900/50 p-3 rounded-lg flex flex-col justify-between" style={{ gridColumn: `span ${layout[widget.id].w}`, gridRow: `span ${layout[widget.id].h}` }}>
                        <div>
                            <h5 className="font-bold text-white">{widget.name}</h5>
                            <p className="text-xs text-gray-400">{widget.description}</p>
                        </div>
                        <button onClick={() => removeWidget(widget.id)} className="text-red-400 text-xs self-end hover:underline">Remove</button>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <h4 className="font-semibold text-white mb-2">Available Widgets</h4>
                <div className="flex flex-wrap gap-2">
                    {AVAILABLE_WIDGETS.map(widget => (
                        !layout[widget.id] && (
                            <button key={widget.id} onClick={() => addWidget(widget)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                                + {widget.name}
                            </button>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export const AccessibilityManager: React.FC<{ settings: AccessibilitySettings; onChange: (settings: Partial<AccessibilitySettings>) => void }> = ({ settings, onChange }) => {
    return (
        <div className="space-y-4">
            <Slider 
                label="Font Size" 
                value={settings.fontSizeMultiplier} 
                min={0.8} max={2} step={0.1} 
                onChange={v => onChange({ fontSizeMultiplier: v })} 
                unit="x" 
            />
            <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <label className="text-white">High Contrast Mode</label>
                <input type="checkbox" className="toggle toggle-primary" checked={settings.highContrastMode} onChange={e => onChange({ highContrastMode: e.target.checked })} />
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <label className="text-white">Reduce Motion</label>
                <input type="checkbox" className="toggle toggle-primary" checked={settings.reducedMotion} onChange={e => onChange({ reducedMotion: e.target.checked })} />
            </div>
            <div>
                <label className="text-sm text-gray-300">Color Blindness Filter</label>
                <select 
                    value={settings.colorBlindFilter} 
                    onChange={e => onChange({ colorBlindFilter: e.target.value as AccessibilitySettings['colorBlindFilter'] })} 
                    className="select select-bordered w-full bg-gray-700/50"
                >
                    <option value="none">None</option>
                    <option value="protanopia">Protanopia (Red-Green)</option>
                    <option value="deuteranopia">Deuteranopia (Red-Green)</option>
                    <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
                    <option value="achromatopsia">Achromatopsia (Monochrome)</option>
                </select>
            </div>
        </div>
    );
};


// --- The Main Component ---

type PersonalizationTab = 'appearance' | 'layout' | 'sounds' | 'accessibility' | 'data';

const PersonalizationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("PersonalizationView must be within a DataProvider.");

    const { customBackgroundUrl, setCustomBackgroundUrl, activeIllusion, setActiveIllusion } = context;

    // --- State Management ---
    const [state, dispatch] = useReducer(personalizationReducer, initialState);
    const [imageUrl, setImageUrl] = useState('');
    const [aiPrompt, setAiPrompt] = useState('An isolated lighthouse on a stormy sea, digital painting');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [currentCustomTheme, setCurrentCustomTheme] = useState<Theme | null>(null);
    const [activeTab, setActiveTab] = useState<PersonalizationTab>('appearance');
    const importFileRef = useRef<HTMLInputElement>(null);


    // --- Side Effects ---
    useEffect(() => {
        // Here you would apply the theme to the entire application,
        // for example by setting CSS variables on the :root element.
        const root = document.documentElement;
        const theme = state.activeTheme;
        root.style.setProperty('--color-primary', theme.colors.primary);
        root.style.setProperty('--color-accent', theme.colors.accent);
        root.style.setProperty('--color-text-primary', theme.colors.textPrimary);
        // ... and so on for all theme properties
        
        // Apply accessibility settings
        root.style.fontSize = `${16 * state.accessibility.fontSizeMultiplier}px`;
        root.classList.toggle('high-contrast', state.accessibility.highContrastMode);
        root.classList.toggle('reduced-motion', state.accessibility.reducedMotion);
        root.setAttribute('data-color-filter', state.accessibility.colorBlindFilter);

    }, [state.activeTheme, state.accessibility]);
    
    useEffect(() => {
        // Persist settings to local storage
        try {
            const settingsToSave = {
                activeThemeId: state.activeTheme.id,
                customThemes: state.customThemes,
                layout: state.dashboardLayout,
                soundPackId: state.activeSoundPack.id,
                accessibility: state.accessibility
            };
            localStorage.setItem('personalizationSettings', JSON.stringify(settingsToSave));
        } catch (err) {
            console.error("Failed to save settings to local storage", err);
        }
    }, [state]);

    useEffect(() => {
        // Load settings from local storage on initial mount
        try {
            const savedSettings = localStorage.getItem('personalizationSettings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                const allThemes = [...PREDEFINED_THEMES, ...(parsed.customThemes || [])];
                const activeTheme = allThemes.find(t => t.id === parsed.activeThemeId) || PREDEFINED_THEMES[0];
                const activeSoundPack = SOUND_PACKS.find(s => s.id === parsed.soundPackId) || SOUND_PACKS[0];
                
                dispatch({ type: 'SET_THEME', payload: activeTheme });
                if (parsed.customThemes) {
                    parsed.customThemes.forEach((theme: Theme) => dispatch({ type: 'SAVE_CUSTOM_THEME', payload: theme }));
                }
                if (parsed.layout) dispatch({ type: 'SET_LAYOUT', payload: parsed.layout });
                if (activeSoundPack) dispatch({ type: 'SET_SOUND_PACK', payload: activeSoundPack });
                if (parsed.accessibility) dispatch({ type: 'SET_ACCESSIBILITY', payload: parsed.accessibility });
            }
        } catch (err) {
            console.error("Failed to load settings from local storage", err);
        }
    }, []);


    // --- Event Handlers ---
    const handleGenerateBackground = async () => {
        setIsGenerating(true);
        setError('');
        try {
            const generatedUrl = await AIService.generateImage(aiPrompt);
            setCustomBackgroundUrl(generatedUrl);
            dispatch({ type: 'ADD_AI_HISTORY', payload: generatedUrl });
        } catch (err: any) {
            setError(err.message || 'Could not generate image. Please check your API key and prompt.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleGenerateTheme = async (prompt: string) => {
        setIsGenerating(true);
        setError('');
        try {
            const generatedParts = await AIService.generateThemeFromPrompt(prompt);
            if (currentCustomTheme) {
                setCurrentCustomTheme(prev => ({
                    ...prev!,
                    ...generatedParts,
                    colors: { ...prev!.colors, ...generatedParts.colors },
                    fonts: { ...prev!.fonts, ...generatedParts.fonts },
                    aiPrompt: prompt,
                    aiGenerated: true,
                }));
            }
        } catch (err: any) {
             setError(err.message || 'Could not generate theme. Please check your API key.');
        } finally {
            setIsGenerating(false);
        }
    };

    const startNewTheme = () => {
        const newTheme: Theme = {
            ...PREDEFINED_THEMES[0], // Start from default
            id: `custom-${Date.now()}`,
            name: 'My New Theme',
            isCustom: true,
        };
        setCurrentCustomTheme(newTheme);
        dispatch({ type: 'TOGGLE_THEME_CREATOR', payload: true });
    };
    
    const editTheme = (theme: Theme) => {
        setCurrentCustomTheme(theme);
        dispatch({ type: 'TOGGLE_THEME_CREATOR', payload: true });
    };
    
    const handleSaveTheme = (theme: Theme) => {
        dispatch({ type: 'SAVE_CUSTOM_THEME', payload: theme });
        dispatch({ type: 'TOGGLE_THEME_CREATOR', payload: false });
        setCurrentCustomTheme(null);
    };

    const handleCancelThemeEdit = () => {
        dispatch({ type: 'TOGGLE_THEME_CREATOR', payload: false });
        setCurrentCustomTheme(null);
    };
    
    const allThemes = useMemo(() => [...PREDEFINED_THEMES, ...state.customThemes], [state.customThemes]);

    const exportSettings = () => {
        const settingsString = localStorage.getItem('personalizationSettings');
        if (settingsString) {
            const blob = new Blob([settingsString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'app-settings.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text === 'string') {
                        // Basic validation
                        const parsed = JSON.parse(text);
                        if(parsed.activeThemeId && parsed.customThemes) {
                            localStorage.setItem('personalizationSettings', text);
                            window.location.reload();
                        } else {
                             setError("Invalid settings file format.");
                        }
                    }
                } catch (err) {
                    console.error("Error importing settings:", err);
                    setError("Failed to import settings file. It may be corrupt.");
                }
            };
            reader.readAsText(file);
        }
    };

    
    return (
        <div className="space-y-8 pb-12">
            <header>
                <h2 className="text-3xl font-bold text-white tracking-wider">Personalization</h2>
                <p className="text-gray-400 mt-1">Customize the application's look, feel, and behavior to match your preferences.</p>
                {!GEMINI_API_KEY && (
                    <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg text-sm">
                        <strong>Warning:</strong> No AI API key found. AI-powered features like theme and image generation will not work. Please set up your <code>REACT_APP_GEMINI_API_KEY</code>.
                    </div>
                )}
            </header>
            
            <div className="tabs tabs-boxed bg-gray-900/50">
                {(['appearance', 'layout', 'sounds', 'accessibility', 'data'] as PersonalizationTab[]).map(tab => (
                    <a key={tab} className={`tab tab-lg capitalize ${activeTab === tab ? 'tab-active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</a>
                ))}
            </div>

             {state.showThemeCreator && currentCustomTheme ? (
                <ThemeCustomizer 
                    theme={currentCustomTheme} 
                    onThemeChange={setCurrentCustomTheme}
                    onSave={handleSaveTheme} 
                    onCancel={handleCancelThemeEdit} 
                    onGenerateWithAI={handleGenerateTheme}
                    isGenerating={isGenerating}
                />
            ) : (
             <>
                {activeTab === 'appearance' && (
                <>
                <Card title="Appearance Theme">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allThemes.map(theme => (
                             <div key={theme.id} className={`relative p-1 rounded-lg cursor-pointer border-2 ${state.activeTheme.id === theme.id ? 'border-cyan-400' : 'border-transparent'}`} onClick={() => dispatch({ type: 'SET_THEME', payload: theme })}>
                                <ThemePreview theme={theme} />
                                {theme.isCustom && (
                                    <div className="absolute top-2 right-2 flex gap-1">
                                         <button onClick={(e) => { e.stopPropagation(); editTheme(theme); }} className="p-1 bg-gray-800/70 rounded-full hover:bg-cyan-600 text-white text-xs">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_CUSTOM_THEME', payload: theme.id }) }} className="p-1 bg-gray-800/70 rounded-full hover:bg-red-600 text-white text-xs">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div onClick={startNewTheme} className="flex items-center justify-center p-4 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600 hover:border-cyan-400 hover:bg-gray-800 cursor-pointer transition-colors">
                            <div className="text-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                <span className="mt-2 block font-semibold text-white">Create New Theme</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Background Style">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-white mb-2">Dynamic Illusion</h4>
                            <div className="flex gap-4">
                                <div className="flex-1 flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                                    <div>
                                        <h4 className="font-semibold text-white">Aurora Illusion</h4>
                                        <p className="text-sm text-gray-400">A dynamic, flowing gradient inspired by the northern lights.</p>
                                    </div>
                                    <input type="radio" name="theme" className="radio radio-primary" checked={activeIllusion === 'aurora'} onChange={() => setActiveIllusion('aurora')} />
                                </div>
                                 <div className="flex-1 flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                                    <div><h4 className="font-semibold text-white">None</h4><p className="text-sm text-gray-400">Use theme background color.</p></div>
                                    <input type="radio" name="theme" className="radio radio-primary" checked={activeIllusion === 'none'} onChange={() => setActiveIllusion('none')} />
                                </div>
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-white mb-2">AI Background Generator</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div>
                                    <p className="text-gray-400 mb-4">Describe the background you want, and our AI will create it for you.</p>
                                    <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                                    <button onClick={handleGenerateBackground} disabled={isGenerating} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">{isGenerating ? 'Generating...' : 'Generate & Set Background'}</button>
                                    {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
                                </div>
                                <div className="h-48 rounded-lg bg-gray-900/50 flex items-center justify-center overflow-hidden">
                                    {isGenerating ? <div className="loading loading-lg text-cyan-300"></div> : 
                                    customBackgroundUrl && customBackgroundUrl.startsWith('data:image') ? 
                                        <img src={customBackgroundUrl} alt="Generated background" className="w-full h-full object-cover" /> :
                                        <p className="text-gray-500">Preview will appear here</p>
                                    }
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-2">Custom Background Image</h4>
                            <p className="text-gray-400 mb-4">Or, paste an image URL for a static background.</p>
                            <div className="flex gap-2">
                                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                                <button onClick={() => setCustomBackgroundUrl(imageUrl)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">Set Image</button>
                            </div>
                        </div>
                    </div>
                </Card>
                </>
                )}

                {activeTab === 'layout' && (
                    <Card title="Dashboard Layout & Widgets">
                        <WidgetLayoutEditor layout={state.dashboardLayout} onLayoutChange={layout => dispatch({ type: 'SET_LAYOUT', payload: layout })} />
                    </Card>
                )}

                {activeTab === 'sounds' && (
                     <Card title="Sound & Notifications">
                        <div className="space-y-4 max-w-md">
                            <label className="text-sm text-gray-300">Sound Pack</label>
                            <select value={state.activeSoundPack.id} onChange={e => dispatch({type: 'SET_SOUND_PACK', payload: SOUND_PACKS.find(s => s.id === e.target.value)!})} className="select select-bordered w-full bg-gray-700/50">
                                {SOUND_PACKS.map(pack => <option key={pack.id} value={pack.id}>{pack.name}</option>)}
                            </select>
                            <p className="text-gray-400 text-sm">Adjust notification sounds, UI feedback, and other audio cues. Volume controls can be found in the main application settings.</p>
                        </div>
                    </Card>
                )}

                {activeTab === 'accessibility' && (
                    <Card title="Accessibility">
                        <AccessibilityManager settings={state.accessibility} onChange={settings => dispatch({ type: 'SET_ACCESSIBILITY', payload: settings })} />
                    </Card>
                )}
                
                {activeTab === 'data' && (
                <Card title="Data Management">
                    <div className="space-y-4">
                        <p className="text-gray-400">Export your personalization settings to a file, or import them to restore a previous configuration.</p>
                        <div className="flex gap-4">
                            <button onClick={exportSettings} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Export Settings</button>
                             <button onClick={() => importFileRef.current?.click()} className="flex-1 py-2 text-center bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer">
                                Import Settings
                            </button>
                            <input type="file" ref={importFileRef} className="hidden" accept=".json" onChange={importSettings} />
                        </div>
                        <div className="pt-4 border-t border-gray-700">
                             <p className="text-gray-400 mb-2">Reset all your personalization settings to their default values. This action cannot be undone.</p>
                             <button onClick={() => dispatch({ type: 'RESET_SETTINGS' })} className="w-full py-2 bg-red-800/80 hover:bg-red-700 text-white rounded-lg">Reset All Settings</button>
                        </div>
                        {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
                    </div>
                </Card>
                )}
             </>
            )}
        </div>
    );
};

export default PersonalizationView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/PersonalizationView.tsx
================================================================================

// components/views/personal/PersonalizationView.tsx
import React, { useContext, useState } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { IllusionType } from '../../../types';
import { GoogleGenAI } from '@google/genai';

const PersonalizationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("PersonalizationView must be within a DataProvider.");

    const { customBackgroundUrl, setCustomBackgroundUrl, activeIllusion, setActiveIllusion } = context;

    const [imageUrl, setImageUrl] = useState('');
    const [aiPrompt, setAiPrompt] = useState('An isolated lighthouse on a stormy sea, digital painting');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    
    const handleGenerate = async () => {
        setIsGenerating(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: aiPrompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const generatedUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setCustomBackgroundUrl(generatedUrl);
        } catch (err) {
            setError('Could not generate image. The model may have safety concerns with your prompt.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Personalization</h2>
            <Card title="Dynamic Visuals">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                        <h4 className="font-semibold text-white">Aurora Illusion</h4>
                        <p className="text-sm text-gray-400">A dynamic, flowing gradient inspired by the northern lights.</p>
                    </div>
                    <input type="radio" name="theme" className="radio radio-primary" checked={activeIllusion === 'aurora'} onChange={() => setActiveIllusion('aurora')} />
                </div>
                 <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg mt-2">
                    <div><h4 className="font-semibold text-white">None</h4><p className="text-sm text-gray-400">Default dark theme.</p></div>
                    <input type="radio" name="theme" className="radio radio-primary" checked={activeIllusion === 'none'} onChange={() => setActiveIllusion('none')} />
                </div>
            </Card>
            
            <Card title="AI Background Generator">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <p className="text-gray-400 mb-4">Describe the background you want, and our AI will create it for you.</p>
                        <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">{isGenerating ? 'Generating...' : 'Generate & Set Background'}</button>
                        {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
                    </div>
                    <div className="h-48 rounded-lg bg-gray-900/50 flex items-center justify-center">
                        {isGenerating ? <p className="text-cyan-300">Generating...</p> : <p className="text-gray-500">Preview will appear here</p>}
                    </div>
                </div>
            </Card>

            <Card title="Custom Background Image">
                <p className="text-gray-400 mb-4">Or, paste an image URL for a static background.</p>
                <div className="flex gap-2">
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <button onClick={() => setCustomBackgroundUrl(imageUrl)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">Set Image</button>
                </div>
            </Card>
        </div>
    );
};

export default PersonalizationView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/PersonalizationView.tsx
================================================================================

// components/views/personal/PersonalizationView.tsx
import React, { useContext, useState } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { IllusionType } from '../../../types';
import { GoogleGenAI } from '@google/genai';

const PersonalizationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("PersonalizationView must be within a DataProvider.");

    const { customBackgroundUrl, setCustomBackgroundUrl, activeIllusion, setActiveIllusion } = context;

    const [imageUrl, setImageUrl] = useState('');
    const [aiPrompt, setAiPrompt] = useState('An isolated lighthouse on a stormy sea, digital painting');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    
    const handleGenerate = async () => {
        setIsGenerating(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: aiPrompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const generatedUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setCustomBackgroundUrl(generatedUrl);
        } catch (err) {
            setError('Could not generate image. The model may have safety concerns with your prompt.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Personalization</h2>
            <Card title="Dynamic Visuals">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                        <h4 className="font-semibold text-white">Aurora Illusion</h4>
                        <p className="text-sm text-gray-400">A dynamic, flowing gradient inspired by the northern lights.</p>
                    </div>
                    <input type="radio" name="theme" className="radio radio-primary" checked={activeIllusion === 'aurora'} onChange={() => setActiveIllusion('aurora')} />
                </div>
                 <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg mt-2">
                    <div><h4 className="font-semibold text-white">None</h4><p className="text-sm text-gray-400">Default dark theme.</p></div>
                    <input type="radio" name="theme" className="radio radio-primary" checked={activeIllusion === 'none'} onChange={() => setActiveIllusion('none')} />
                </div>
            </Card>
            
            <Card title="AI Background Generator">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <p className="text-gray-400 mb-4">Describe the background you want, and our AI will create it for you.</p>
                        <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">{isGenerating ? 'Generating...' : 'Generate & Set Background'}</button>
                        {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
                    </div>
                    <div className="h-48 rounded-lg bg-gray-900/50 flex items-center justify-center">
                        {isGenerating ? <p className="text-cyan-300">Generating...</p> : <p className="text-gray-500">Preview will appear here</p>}
                    </div>
                </div>
            </Card>

            <Card title="Custom Background Image">
                <p className="text-gray-400 mb-4">Or, paste an image URL for a static background.</p>
                <div className="flex gap-2">
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                    <button onClick={() => setCustomBackgroundUrl(imageUrl)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">Set Image</button>
                </div>
            </Card>
        </div>
    );
};

export default PersonalizationView;
