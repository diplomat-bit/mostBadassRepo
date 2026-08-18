// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/personal/CardCustomizationView.tsx
================================================================================

// components/views/personal/CardCustomizationView.tsx
import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Card from '../../Card';

const CardCustomizationView: React.FC = () => {
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('Add a phoenix rising from the center, with its wings made of glowing data streams.');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [cardStory, setCardStory] = useState('');
    const [isStoryLoading, setIsStoryLoading] = useState(false);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string));
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setBaseImage(base64);
            setGeneratedImage(null);
        }
    };

    const handleGenerate = async () => {
        if (!baseImage || !prompt) return;
        setIsLoading(true); setError(''); setGeneratedImage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64Data = baseImage.split(',')[1];
            const mimeType = baseImage.match(/:(.*?);/)?.[1] || 'image/jpeg';
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: [{ inlineData: { data: base64Data, mimeType: mimeType } }, { text: prompt }] },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
            });

            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
            if (imagePart?.inlineData) {
                setGeneratedImage(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
            } else { setError("The AI didn't return an image. Try a different prompt."); }
        } catch (err) {
            setError("Sorry, I couldn't edit the image. Please try again.");
        } finally { setIsLoading(false); }
    };

     const generateCardStory = async () => {
        setIsStoryLoading(true); setCardStory('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const storyPrompt = `Based on this generative AI prompt for a credit card design, write a short, inspiring "Card Story" (2-3 sentences) about what this card represents. Prompt: "${prompt}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: storyPrompt });
            setCardStory(response.text);
        } catch (err) {
            setCardStory("Could not generate a story for this design.");
        } finally { setIsStoryLoading(false); }
    };

    const displayImage = generatedImage || baseImage;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Card Customization Forge</h2>
             <Card title="Design Your Card">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div>
                         <p className="text-gray-400 mb-4">1. Upload a base image.</p>
                         <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600/50 file:text-cyan-200 hover:file:bg-cyan-600"/>
                         <p className="text-gray-400 my-4">2. Describe your changes with AI.</p>
                         <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Make this image look like a watercolor painting" className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" disabled={isLoading || !baseImage}/>
                         <button onClick={handleGenerate} disabled={isLoading || !baseImage || !prompt} className="mt-4 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Image'}</button>
                         {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-gray-400 mb-2">Card Preview</p>
                        <div className="w-full max-w-sm aspect-[85.6/54] rounded-xl bg-gray-900/50 overflow-hidden shadow-2xl border border-gray-600 flex items-center justify-center">
                            {isLoading && <div className="text-cyan-300">Generating...</div>}
                            {!isLoading && displayImage && <img src={displayImage} alt="Card Preview" className="w-full h-full object-cover"/>}
                            {!isLoading && !displayImage && <div className="text-gray-500">Upload an image to start</div>}
                        </div>
                    </div>
                </div>
            </Card>
             <Card title="AI-Generated Card Story">
                {isStoryLoading ? <p>Generating story...</p> : cardStory ? <p className="text-gray-300 italic">"{cardStory}"</p> : <p className="text-gray-400">Generate a story for your unique card design.</p>}
                 <button onClick={generateCardStory} disabled={isStoryLoading || !displayImage} className="mt-4 px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-sm disabled:opacity-50">{isStoryLoading ? 'Writing...' : 'Generate Story'}</button>
             </Card>
        </div>
    );
};

export default CardCustomizationView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/personal/CardCustomizationView.tsx
================================================================================

```typescript
// components/views/personal/CardCustomizationView.tsx
import React, { useState, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Card from '../../Card';

// SECTION: SVG Icons (as components for reusability)
// =========================================================
const IconSparkles = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.192A6.75 6.75 0 019.315 7.584zM12 15a.75.75 0 01.75.75v7.192A6.75 6.75 0 016.685 14.916C3.883 12.035 1.5 7.535 1.5 2.25a.75.75 0 01.75-.75c5.056 0 9.555 2.383 12.436 6.084A6.75 6.75 0 0112 15z" clipRule="evenodd" />
    </svg>
);
const IconTrash = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 01-.749.658h-7.5a.75.75 0 01-.749-.658L5.168 6.648l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452z" clipRule="evenodd" />
    </svg>
);
const IconHeart = ({ className = 'w-5 h-5', isFilled = false }: { className?: string; isFilled?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);


// SECTION: Type Definitions for a Real-World Application
// =========================================================
export type Design = {
    id: string;
    baseImage: string;
    generatedImage: string;
    prompt: string;
    customizationOptions: CustomizationOptions;
    story: string;
    createdAt: Date;
    isFavorite: boolean;
    author?: string;
};

export type CustomizationOptions = {
    styleId: string;
    paletteId: string;
    finishId: string;
    textOverlays: TextOverlay[];
};

export type TextOverlay = {
    id: string;
    text: string;
    fontId: string;
    fontSize: number;
    color: string;
    position: { x: number; y: number }; // Percentage-based position
};

export type StylePreset = {
    id: string;
    name: string;
    description: string;
    promptFragment: string;
    thumbnailUrl: string;
};

export type ColorPalette = {
    id: string;
    name: string;
    colors: string[];
};

export type CardFinish = {
    id: string;
    name: string;
    description: string;
    promptFragment: string;
};

export type FontOption = {
    id: string;
    name: string;
    fontFamily: string;
};


// SECTION: Constants and Mock Data
// =========================================================

export const STYLE_PRESETS: StylePreset[] = [
    { id: 'default', name: 'Default', description: 'Your prompt, straight up.', promptFragment: '', thumbnailUrl: '/thumbnails/default.png' },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'High-tech, low-life, neon-drenched.', promptFragment: 'in a futuristic cyberpunk style, neon lights, gritty urban environment, chrome details', thumbnailUrl: '/thumbnails/cyberpunk.png' },
    { id: 'vintage', name: 'Vintage', description: 'Aged paper, retro-futurism.', promptFragment: 'in a vintage photo style, sepia tones, aged paper texture, 1950s aesthetic', thumbnailUrl: '/thumbnails/vintage.png' },
    { id: 'watercolor', name: 'Watercolor', description: 'Soft, blended colors, artistic.', promptFragment: 'as a vibrant watercolor painting, with soft edges and beautiful color bleeds', thumbnailUrl: '/thumbnails/watercolor.png' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean lines, simple forms, elegant.', promptFragment: 'with a minimalist design, clean lines, simple shapes, and a limited color palette', thumbnailUrl: '/thumbnails/minimalist.png' },
    { id: 'holographic', name: 'Holographic', description: 'Shimmering, iridescent, futuristic.', promptFragment: 'with a shimmering holographic and iridescent effect, reflecting rainbow colors', thumbnailUrl: '/thumbnails/holographic.png' },
    { id: 'art_deco', name: 'Art Deco', description: 'Geometric patterns, lavish, bold.', promptFragment: 'in a glamorous Art Deco style, with bold geometric shapes and lavish ornamentation', thumbnailUrl: '/thumbnails/art_deco.png' },
    { id: 'steampunk', name: 'Steampunk', description: 'Gears, cogs, Victorian aesthetics.', promptFragment: 'with a steampunk aesthetic, featuring brass gears, intricate clockwork, and Victorian elegance', thumbnailUrl: '/thumbnails/steampunk.png' },
];

export const COLOR_PALETTES: ColorPalette[] = [
    { id: 'default', name: 'Default', colors: [] },
    { id: 'ocean_breeze', name: 'Ocean Breeze', colors: ['#00A7E1', '#007EA7', '#003459', '#FFFFFF'] },
    { id: 'sunset_glow', name: 'Sunset Glow', colors: ['#FF6B6B', '#FFD166', '#EF7B7B', '#F7B267'] },
    { id: 'forest_depths', name: 'Forest Depths', colors: ['#0A3622', '#216869', '#49A078', '#99E2B4'] },
    { id: 'monochrome', name: 'Monochrome', colors: ['#1C1C1C', '#595959', '#D9D9D9', '#FFFFFF'] },
    { id: 'neon_noir', name: 'Neon Noir', colors: ['#F94144', '#F3722C', '#F8961E', '#90BE6D'] },
    { id: 'royal_velvet', name: 'Royal Velvet', colors: ['#4A2E67', '#865794', '#D095BF', '#F9D1E8'] },
];

export const CARD_FINISHES: CardFinish[] = [
    { id: 'default', name: 'Standard Gloss', description: "A classic shiny finish.", promptFragment: 'with a standard glossy finish' },
    { id: 'matte', name: 'Matte', description: "A non-reflective, premium feel.", promptFragment: 'with a premium non-reflective matte finish' },
    { id: 'brushed_metal', name: 'Brushed Metal', description: "Looks like textured aluminum.", promptFragment: 'simulating a brushed aluminum metal texture' },
    { id: 'holographic_foil', name: 'Holographic Foil', description: "Shimmers with rainbow colors.", promptFragment: 'with accents of holographic foil that shimmer in the light' },
    { id: 'embossed_leather', name: 'Embossed Leather', description: "A luxurious, tactile surface.", promptFragment: 'simulating the texture of embossed leather' },
    { id: 'carbon_fiber', name: 'Carbon Fiber', description: "A sleek, modern weave.", promptFragment: 'with a sleek carbon fiber weave texture' },
];

export const FONT_OPTIONS: FontOption[] = [
    { id: 'inter', name: 'Inter', fontFamily: '"Inter", sans-serif' },
    { id: 'roboto_mono', name: 'Roboto Mono', fontFamily: '"Roboto Mono", monospace' },
    { id: 'playfair', name: 'Playfair Display', fontFamily: '"Playfair Display", serif' },
    { id: 'pacifico', name: 'Pacifico', fontFamily: '"Pacifico", cursive' },
    { id: 'oswald', name: 'Oswald', fontFamily: '"Oswald", sans-serif' },
    { id: 'lobster', name: 'Lobster', fontFamily: '"Lobster", cursive' },
];

export const MOCK_COMMUNITY_GALLERY: Design[] = [
    // ... (existing mock data, potentially expanded)
];

// SECTION: State Management (useReducer) for Complex UI
// =========================================================
type EditorState = {
    baseImage: string | null;
    generatedImage: string | null;
    prompt: string;
    customizationOptions: CustomizationOptions;
    selectedTextOverlayId: string | null;
    
    activeTab: 'DESIGN' | 'GALLERY';
    isGeneratingImage: boolean;
    isGeneratingStory: boolean;
    isGeneratingPrompt: boolean;
    isSavingDesign: boolean;
    isOrderModalOpen: boolean;
    
    currentStory: string;
    promptSuggestions: string[];
    designHistory: Design[];
    communityGallery: Design[];
    
    error: string | null;
};

type Action =
    | { type: 'SET_BASE_IMAGE'; payload: string }
    | { type: 'SET_PROMPT'; payload: string }
    | { type: 'SET_CUSTOMIZATION_OPTION'; payload: { key: keyof CustomizationOptions, value: any } }
    | { type: 'ADD_TEXT_OVERLAY' }
    | { type: 'UPDATE_TEXT_OVERLAY'; payload: Partial<TextOverlay> & { id: string } }
    | { type: 'REMOVE_TEXT_OVERLAY'; payload: string }
    | { type: 'SELECT_TEXT_OVERLAY'; payload: string | null }
    | { type: 'START_IMAGE_GENERATION' }
    | { type: 'IMAGE_GENERATION_SUCCESS'; payload: { image: string, design: Design } }
    | { type: 'IMAGE_GENERATION_FAILURE'; payload: string }
    | { type: 'START_STORY_GENERATION' }
    | { type: 'STORY_GENERATION_SUCCESS'; payload: string }
    | { type: 'STORY_GENERATION_FAILURE'; payload: string }
    | { type: 'START_PROMPT_SUGGESTION' }
    | { type: 'PROMPT_SUGGESTION_SUCCESS'; payload: string[] }
    | { type: 'PROMPT_SUGGESTION_FAILURE'; payload: string }
    | { type: 'TOGGLE_FAVORITE'; payload: string }
    | { type: 'RESTORE_DESIGN'; payload: Design }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_ACTIVE_TAB'; payload: 'DESIGN' | 'GALLERY' }
    | { type: 'TOGGLE_ORDER_MODAL' };

const initialState: EditorState = {
    baseImage: null,
    generatedImage: null,
    prompt: 'A phoenix rising from the center, with its wings made of glowing data streams.',
    customizationOptions: {
        styleId: 'default',
        paletteId: 'default',
        finishId: 'default',
        textOverlays: [],
    },
    selectedTextOverlayId: null,
    activeTab: 'DESIGN',
    isGeneratingImage: false,
    isGeneratingStory: false,
    isGeneratingPrompt: false,
    isSavingDesign: false,
    isOrderModalOpen: false,
    currentStory: '',
    promptSuggestions: [],
    designHistory: [],
    communityGallery: MOCK_COMMUNITY_GALLERY,
    error: null,
};

function editorReducer(state: EditorState, action: Action): EditorState {
    switch (action.type) {
        case 'SET_BASE_IMAGE':
            return { ...state, baseImage: action.payload, generatedImage: null, error: null };
        case 'SET_PROMPT':
            return { ...state, prompt: action.payload };
        case 'SET_CUSTOMIZATION_OPTION':
            return { ...state, customizationOptions: { ...state.customizationOptions, [action.payload.key]: action.payload.value } };
        case 'ADD_TEXT_OVERLAY': {
            const newOverlay: TextOverlay = {
                id: `text_${new Date().getTime()}`,
                text: 'Your Name',
                fontId: 'inter',
                fontSize: 14,
                color: '#FFFFFF',
                position: { x: 10, y: 80 },
            };
            return { 
                ...state, 
                customizationOptions: { ...state.customizationOptions, textOverlays: [...state.customizationOptions.textOverlays, newOverlay] },
                selectedTextOverlayId: newOverlay.id
            };
        }
        case 'UPDATE_TEXT_OVERLAY': {
            return {
                ...state,
                customizationOptions: {
                    ...state.customizationOptions,
                    textOverlays: state.customizationOptions.textOverlays.map(o => o.id === action.payload.id ? { ...o, ...action.payload } : o)
                }
            };
        }
        case 'REMOVE_TEXT_OVERLAY': {
            return {
                ...state,
                customizationOptions: {
                    ...state.customizationOptions,
                    textOverlays: state.customizationOptions.textOverlays.filter(o => o.id !== action.payload)
                },
                selectedTextOverlayId: state.selectedTextOverlayId === action.payload ? null : state.selectedTextOverlayId
            };
        }
        case 'SELECT_TEXT_OVERLAY':
            return { ...state, selectedTextOverlayId: action.payload };
        case 'START_IMAGE_GENERATION':
            return { ...state, isGeneratingImage: true, generatedImage: null, error: null };
        case 'IMAGE_GENERATION_SUCCESS':
            return { ...state, isGeneratingImage: false, generatedImage: action.payload.image, designHistory: [action.payload.design, ...state.designHistory] };
        case 'IMAGE_GENERATION_FAILURE':
            return { ...state, isGeneratingImage: false, error: action.payload };
        case 'START_STORY_GENERATION':
            return { ...state, isGeneratingStory: true, currentStory: '' };
        case 'STORY_GENERATION_SUCCESS':
            return { ...state, isGeneratingStory: false, currentStory: action.payload };
        case 'STORY_GENERATION_FAILURE':
            return { ...state, isGeneratingStory: false, currentStory: action.payload };
        case 'START_PROMPT_SUGGESTION':
            return { ...state, isGeneratingPrompt: true, promptSuggestions: [] };
        case 'PROMPT_SUGGESTION_SUCCESS':
            return { ...state, isGeneratingPrompt: false, promptSuggestions: action.payload };
        case 'PROMPT_SUGGESTION_FAILURE':
             return { ...state, isGeneratingPrompt: false, error: action.payload };
        case 'TOGGLE_FAVORITE':
            return { ...state, designHistory: state.designHistory.map(d => d.id === action.payload ? { ...d, isFavorite: !d.isFavorite } : d) };
        case 'RESTORE_DESIGN':
            return {
                ...state,
                prompt: action.payload.prompt,
                customizationOptions: action.payload.customizationOptions,
                baseImage: action.payload.baseImage,
                generatedImage: action.payload.generatedImage,
            };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };
        case 'TOGGLE_ORDER_MODAL':
            return { ...state, isOrderModalOpen: !state.isOrderModalOpen };
        default:
            return state;
    }
}

// SECTION: Utility and Helper Functions
// =========================================================

export const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export async function mockApiCall<T>(data: T, delay: number = 500): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

export function buildAIPrompt(basePrompt: string, options: CustomizationOptions): string {
    let fullPrompt = `Create a visually stunning credit card design based on the concept: "${basePrompt}".`;

    const style = STYLE_PRESETS.find(s => s.id === options.styleId);
    if (style && style.promptFragment) fullPrompt += ` The design should be ${style.promptFragment}.`;

    const palette = COLOR_PALETTES.find(p => p.id === options.paletteId);
    if (palette && palette.colors.length > 0) fullPrompt += ` Use a color palette dominated by ${palette.colors.join(', ')}.`;

    const finish = CARD_FINISHES.find(f => f.id === options.finishId);
    if (finish && finish.promptFragment) fullPrompt += ` The final image should look like it has ${finish.promptFragment}.`;
    
    if (options.textOverlays.length > 0) {
        const textDescriptions = options.textOverlays.map(t => 
            `the text "${t.text}" using a font similar to ${t.fontId}`
        ).join(' and ');
        fullPrompt += ` The design must elegantly incorporate ${textDescriptions}. Do not render the text as garbled characters; if you cannot render it clearly, integrate abstract shapes where the text would be.`;
    }

    return fullPrompt + " The final output must be a high-resolution, photorealistic image of the credit card design itself, with no background.";
}

// SECTION: Child Components
// =========================================================

const StyleSelector: React.FC<{ selectedStyleId: string; onSelect: (id: string) => void; }> = ({ selectedStyleId, onSelect }) => (
    <div>
        <h4 className="text-lg font-semibold text-white mb-3">Style Preset</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STYLE_PRESETS.map(style => (
                <button key={style.id} onClick={() => onSelect(style.id)} className={`p-3 rounded-lg border-2 transition-all text-left ${selectedStyleId === style.id ? 'border-cyan-400 bg-cyan-900/50' : 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <p className="font-bold text-white">{style.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{style.description}</p>
                </button>
            ))}
        </div>
    </div>
);

const ColorPalettePicker: React.FC<{ selectedPaletteId: string; onSelect: (id: string) => void; }> = ({ selectedPaletteId, onSelect }) => (
     <div className="mt-6">
        <h4 className="text-lg font-semibold text-white mb-3">Color Palette</h4>
        <div className="flex flex-wrap gap-3">
            {COLOR_PALETTES.map(palette => (
                <button key={palette.id} onClick={() => onSelect(palette.id)} className={`p-3 rounded-lg border-2 transition-all ${selectedPaletteId === palette.id ? 'border-cyan-400 bg-cyan-900/50' : 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <p className="font-bold text-white mb-2">{palette.name}</p>
                    <div className="flex space-x-1 h-5">{palette.colors.length > 0 ? palette.colors.map(color => <div key={color} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: color }} />) : <div className="text-xs text-gray-400">As specified</div>}</div>
                </button>
            ))}
        </div>
    </div>
);

const CardFinishSelector: React.FC<{ selectedFinishId: string; onSelect: (id: string) => void; }> = ({ selectedFinishId, onSelect }) => (
    <div className="mt-6">
        <h4 className="text-lg font-semibold text-white mb-3">Card Finish</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CARD_FINISHES.map(finish => (
                <button key={finish.id} onClick={() => onSelect(finish.id)} className={`p-3 rounded-lg border-2 transition-all text-left ${selectedFinishId === finish.id ? 'border-cyan-400 bg-cyan-900/50' : 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50'}`}>
                    <p className="font-bold text-white">{finish.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{finish.description}</p>
                </button>
            ))}
        </div>
    </div>
);

const TextOverlayEditor: React.FC<{
    overlays: TextOverlay[];
    selectedOverlayId: string | null;
    dispatch: React.Dispatch<Action>;
}> = ({ overlays, selectedOverlayId, dispatch }) => {
    const selectedOverlay = overlays.find(o => o.id === selectedOverlayId);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-white">Text Overlays</h4>
                <button onClick={() => dispatch({ type: 'ADD_TEXT_OVERLAY' })} className="px-3 py-1 text-sm bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-md">Add Text</button>
            </div>
            {selectedOverlay && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-4">
                    <div className="flex items-center gap-2">
                        <input type="text" value={selectedOverlay.text} onChange={e => dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { id: selectedOverlay.id, text: e.target.value } })} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                        <button onClick={() => dispatch({ type: 'REMOVE_TEXT_OVERLAY', payload: selectedOverlay.id })} className="p-2 text-red-400 hover:text-red-300"><IconTrash /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-400">Font</label>
                            <select value={selectedOverlay.fontId} onChange={e => dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { id: selectedOverlay.id, fontId: e.target.value } })} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">
                                {FONT_OPTIONS.map(font => <option key={font.id} value={font.id}>{font.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400">Color</label>
                            <input type="color" value={selectedOverlay.color} onChange={e => dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { id: selectedOverlay.id, color: e.target.value } })} className="w-full h-10 bg-transparent border-none cursor-pointer" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400">Font Size: {selectedOverlay.fontSize}pt</label>
                        <input type="range" min="8" max="48" value={selectedOverlay.fontSize} onChange={e => dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { id: selectedOverlay.id, fontSize: parseInt(e.target.value) } })} className="w-full" />
                    </div>
                </div>
            )}
            {!selectedOverlay && overlays.length > 0 && <p className="text-sm text-gray-400 text-center">Select a text element on the card to edit it.</p>}
        </div>
    );
};

const InteractiveCardPreview: React.FC<{
    image: string | null;
    overlays: TextOverlay[];
    selectedOverlayId: string | null;
    isGenerating: boolean;
    dispatch: React.Dispatch<Action>;
}> = ({ image, overlays, selectedOverlayId, isGenerating, dispatch }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDrag = (id: string, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const card = cardRef.current;
        if (!card) return;
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startPos = overlays.find(o => o.id === id)?.position || { x: 0, y: 0 };
        
        const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            const newX = startPos.x + (dx / card.clientWidth) * 100;
            const newY = startPos.y + (dy / card.clientHeight) * 100;

            dispatch({
                type: 'UPDATE_TEXT_OVERLAY',
                payload: { id, position: { x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) } }
            });
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
    
    return (
        <div ref={cardRef} className="w-full max-w-sm mx-auto aspect-[85.6/54] rounded-xl bg-gray-900/50 overflow-hidden shadow-2xl border border-gray-600 flex items-center justify-center relative">
            {isGenerating && <div className="text-cyan-300 p-4 text-center">The AI is forging your vision...</div>}
            {!isGenerating && image && <img src={image} alt="Card Preview" className="w-full h-full object-cover"/>}
            {!isGenerating && !image && <div className="text-gray-500 p-4 text-center">Upload an image and write a prompt to start</div>}
            
            {overlays.map(overlay => {
                const font = FONT_OPTIONS.find(f => f.id === overlay.fontId);
                return (
                    <div
                        key={overlay.id}
                        onMouseDown={e => {
                            dispatch({ type: 'SELECT_TEXT_OVERLAY', payload: overlay.id });
                            handleDrag(overlay.id, e);
                        }}
                        className={`absolute cursor-grab p-1 rounded transition-all ${selectedOverlayId === overlay.id ? 'border-2 border-dashed border-cyan-400' : 'border-2 border-transparent hover:border-dashed hover:border-white/50'}`}
                        style={{
                            left: `${overlay.position.x}%`,
                            top: `${overlay.position.y}%`,
                            color: overlay.color,
                            fontSize: `${overlay.fontSize}pt`,
                            fontFamily: font?.fontFamily || 'sans-serif',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {overlay.text}
                    </div>
                );
            })}
        </div>
    );
};

const OrderModal: React.FC<{ isOpen: boolean; onClose: () => void; designImage: string | null; }> = ({ isOpen, onClose, designImage }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 max-w-lg w-full border border-gray-600">
                <h3 className="text-2xl font-bold text-white mb-4">Order Your Custom Card</h3>
                {designImage && <img src={designImage} alt="Final Design" className="rounded-lg mb-4 w-full aspect-[85.6/54] object-cover" />}
                <p className="text-gray-400 mb-6">Enter your details to receive a physical copy of your unique design. (This is a mock-up, no real order will be placed).</p>
                <form onSubmit={(e) => { e.preventDefault(); alert('Mock order submitted!'); onClose(); }}>
                    <div className="space-y-4">
                        <input type="text" placeholder="Full Name" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white" />
                        <input type="text" placeholder="Shipping Address" required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white" />
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Submit Order</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// SECTION: The Main Component
// =========================================================
const CardCustomizationView: React.FC = () => {
    const [state, dispatch] = useReducer(editorReducer, initialState);
    
    // AI API Call Functions
    const getAiModel = useCallback(() => {
        const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.API_KEY;
        if (!apiKey) {
            dispatch({ type: 'SET_ERROR', payload: "API key is not configured. Please set REACT_APP_GEMINI_API_KEY." });
            return null;
        }
        return new GoogleGenAI({ apiKey });
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            dispatch({ type: 'SET_BASE_IMAGE', payload: base64 });
        }
    };

    const handleGenerate = async () => {
        if (!state.baseImage || !state.prompt) return;
        const ai = getAiModel();
        if (!ai) return;

        dispatch({ type: 'START_IMAGE_GENERATION' });
        try {
            const base64Data = state.baseImage.split(',')[1];
            const mimeType = state.baseImage.match(/:(.*?);/)?.[1] || 'image/jpeg';
            const fullPrompt = buildAIPrompt(state.prompt, state.customizationOptions);
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: fullPrompt }] },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
            });

            const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
            if (imagePart?.inlineData) {
                const generatedImage = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
                const newDesign: Design = {
                    id: new Date().toISOString(),
                    baseImage: state.baseImage, generatedImage, prompt: state.prompt,
                    customizationOptions: state.customizationOptions, story: '',
                    createdAt: new Date(), isFavorite: false,
                };
                dispatch({ type: 'IMAGE_GENERATION_SUCCESS', payload: { image: generatedImage, design: newDesign } });
            } else { 
                dispatch({ type: 'IMAGE_GENERATION_FAILURE', payload: "The AI didn't return an image. Try a different prompt." });
            }
        } catch (err) {
            console.error("Image generation error:", err);
            dispatch({ type: 'IMAGE_GENERATION_FAILURE', payload: "Sorry, I couldn't edit the image. Please try again." });
        }
    };

    const generateCardStory = async () => {
        const ai = getAiModel();
        if (!ai) return;

        dispatch({ type: 'START_STORY_GENERATION' });
        try {
            const storyPrompt = `Based on this generative AI prompt for a credit card design, write a short, inspiring "Card Story" (2-3 sentences) about what this card represents. Prompt: "${state.prompt}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: storyPrompt });
            dispatch({ type: 'STORY_GENERATION_SUCCESS', payload: response.text });
        } catch (err) {
            dispatch({ type: 'STORY_GENERATION_FAILURE', payload: "Could not generate a story for this design." });
        }
    };

    const generatePromptSuggestions = async () => {
        const ai = getAiModel();
        if (!ai) return;

        dispatch({ type: 'START_PROMPT_SUGGESTION' });
        try {
            const suggestionPrompt = `You are a creative assistant for designing credit cards. Give me three distinct and imaginative prompts for a card design. The user's current idea is "${state.prompt}". Provide only the prompts, each on a new line.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: suggestionPrompt });
            const suggestions = response.text.split('\n').filter(s => s.trim() !== '');
            dispatch({ type: 'PROMPT_SUGGESTION_SUCCESS', payload: suggestions });
        } catch (err) {
            dispatch({ type: 'PROMPT_SUGGESTION_FAILURE', payload: "Failed to get suggestions." });
        }
    };

    const displayImage = state.generatedImage || state.baseImage;

    const mainContent = useMemo(() => {
        if (state.activeTab === 'GALLERY') {
            return (
                 <Card title="Community Gallery">
                    <p className="text-gray-400 mb-6">Explore designs created by other users for inspiration.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {state.communityGallery.map(design => (
                            <div key={design.id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 group">
                                <img src={design.generatedImage || '/placeholder.png'} alt={design.prompt} className="w-full aspect-[85.6/54] object-cover transition-transform group-hover:scale-105" />
                                <div className="p-4">
                                    <p className="text-white font-semibold truncate group-hover:whitespace-normal">{design.prompt}</p>
                                    <p className="text-sm text-gray-400 mt-1 italic">by {design.author || 'Anonymous'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            );
        }

        return (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Left Column: Controls */}
                <div className="xl:col-span-2 space-y-6">
                    <Card title="1. Upload & Describe">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <div>
                                <p className="text-gray-400 mb-4">Upload a base image.</p>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600/50 file:text-cyan-200 hover:file:bg-cyan-600"/>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-4">Describe your vision with AI.</p>
                                <textarea value={state.prompt} onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })} placeholder="e.g., An ancient cosmic turtle swimming through a nebula" className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" disabled={state.isGeneratingImage || !state.baseImage}/>
                                <button onClick={generatePromptSuggestions} disabled={state.isGeneratingPrompt} className="mt-2 flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50"><IconSparkles/> {state.isGeneratingPrompt ? 'Thinking...' : 'Get AI Suggestions'}</button>
                                {state.promptSuggestions.length > 0 && (
                                    <div className="mt-2 space-y-2 bg-gray-800/50 p-3 rounded-md">
                                        {state.promptSuggestions.map((s, i) => <p key={i} onClick={() => dispatch({type: 'SET_PROMPT', payload: s})} className="text-xs text-gray-300 cursor-pointer hover:text-white p-1 rounded hover:bg-white/10">"{s}"</p>)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card title="2. Refine with Advanced Options">
                        <StyleSelector selectedStyleId={state.customizationOptions.styleId} onSelect={(id) => dispatch({ type: 'SET_CUSTOMIZATION_OPTION', payload: { key: 'styleId', value: id }})}/>
                        <ColorPalettePicker selectedPaletteId={state.customizationOptions.paletteId} onSelect={(id) => dispatch({ type: 'SET_CUSTOMIZATION_OPTION', payload: { key: 'paletteId', value: id }})}/>
                        <CardFinishSelector selectedFinishId={state.customizationOptions.finishId} onSelect={(id) => dispatch({ type: 'SET_CUSTOMIZATION_OPTION', payload: { key: 'finishId', value: id }})} />
                    </Card>

                    <Card title="3. Add Text">
                        <TextOverlayEditor overlays={state.customizationOptions.textOverlays} selectedOverlayId={state.selectedTextOverlayId} dispatch={dispatch} />
                    </Card>

                    <Card title="4. Generate & Finalize">
                        <div className="flex flex-col md:flex-row gap-4">
                            <button onClick={handleGenerate} disabled={state.isGeneratingImage || !state.baseImage || !state.prompt} className="flex-grow py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50 transition-all font-bold">
                                {state.isGeneratingImage ? 'Forging...' : 'Forge My Design'}
                            </button>
                             <button onClick={() => dispatch({ type: 'TOGGLE_ORDER_MODAL' })} disabled={!state.generatedImage} className="flex-grow py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50">
                                Order Physical Card
                            </button>
                        </div>
                         {state.error && <p className="text-red-400 text-center mt-2">{state.error}</p>}
                    </Card>
                </div>

                {/* Right Column: Preview & History */}
                <div className="xl:col-span-1 space-y-6 sticky top-8">
                     <Card title="Live Preview">
                        <InteractiveCardPreview image={displayImage} overlays={state.customizationOptions.textOverlays} selectedOverlayId={state.selectedTextOverlayId} isGenerating={state.isGeneratingImage} dispatch={dispatch} />
                    </Card>
                    <Card title="AI-Generated Card Story">
                        {state.isGeneratingStory ? <p className="text-gray-400">Generating story...</p> : state.currentStory ? <p className="text-gray-300 italic">"{state.currentStory}"</p> : <p className="text-gray-400">Generate a story for your unique card design.</p>}
                        <button onClick={generateCardStory} disabled={state.isGeneratingStory || !displayImage} className="mt-4 px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-sm disabled:opacity-50">{state.isGeneratingStory ? 'Writing...' : 'Generate Story'}</button>
                    </Card>
                    <Card title="Design History">
                        {state.designHistory.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {state.designHistory.map(design => (
                                    <div key={design.id} onClick={() => dispatch({type: 'RESTORE_DESIGN', payload: design})} className="flex items-center gap-4 p-2 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50">
                                        <img src={design.generatedImage} alt="design history" className="w-20 aspect-[85.6/54] object-cover rounded" />
                                        <div className="flex-grow overflow-hidden">
                                            <p className="text-sm text-white truncate">{design.prompt}</p>
                                            <p className="text-xs text-gray-400">{design.createdAt.toLocaleTimeString()}</p>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); dispatch({type: 'TOGGLE_FAVORITE', payload: design.id})}} className="p-2 text-pink-400 hover:text-pink-300"><IconHeart isFilled={design.isFavorite} /></button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-gray-500 text-center py-4">Your generated designs will appear here.</p>
                        )}
                    </Card>
                </div>
            </div>
        );
    }, [state, handleFileChange, handleGenerate, generateCardStory, generatePromptSuggestions]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-white tracking-wider">Card Customization Forge</h2>
                <div className="flex-shrink-0">
                    <div className="flex items-center bg-gray-800 rounded-full p-1 border border-gray-700">
                        <button onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'DESIGN' })} className={`px-6 py-2 text-sm rounded-full transition-colors ${state.activeTab === 'DESIGN' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Design Studio</button>
                        <button onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'GALLERY' })} className={`px-6 py-2 text-sm rounded-full transition-colors ${state.activeTab === 'GALLERY' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Community Gallery</button>
                    </div>
                </div>
            </div>
            {mainContent}
            <OrderModal isOpen={state.isOrderModalOpen} onClose={() => dispatch({ type: 'TOGGLE_ORDER_MODAL' })} designImage={state.generatedImage}/>
        </div>
    );
};

export default CardCustomizationView;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/personal/CardCustomizationView.tsx
================================================================================

// components/views/personal/CardCustomizationView.tsx
import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Card from '../../Card';

const CardCustomizationView: React.FC = () => {
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('Add a phoenix rising from the center, with its wings made of glowing data streams.');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [cardStory, setCardStory] = useState('');
    const [isStoryLoading, setIsStoryLoading] = useState(false);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string));
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setBaseImage(base64);
            setGeneratedImage(null);
        }
    };

    const handleGenerate = async () => {
        if (!baseImage || !prompt) return;
        setIsLoading(true); setError(''); setGeneratedImage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64Data = baseImage.split(',')[1];
            const mimeType = baseImage.match(/:(.*?);/)?.[1] || 'image/jpeg';
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: [{ inlineData: { data: base64Data, mimeType: mimeType } }, { text: prompt }] },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
            });

            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
            if (imagePart?.inlineData) {
                setGeneratedImage(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
            } else { setError("The AI didn't return an image. Try a different prompt."); }
        } catch (err) {
            setError("Sorry, I couldn't edit the image. Please try again.");
        } finally { setIsLoading(false); }
    };

     const generateCardStory = async () => {
        setIsStoryLoading(true); setCardStory('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const storyPrompt = `Based on this generative AI prompt for a credit card design, write a short, inspiring "Card Story" (2-3 sentences) about what this card represents. Prompt: "${prompt}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: storyPrompt });
            setCardStory(response.text);
        } catch (err) {
            setCardStory("Could not generate a story for this design.");
        } finally { setIsStoryLoading(false); }
    };

    const displayImage = generatedImage || baseImage;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Card Customization Forge</h2>
             <Card title="Design Your Card">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div>
                         <p className="text-gray-400 mb-4">1. Upload a base image.</p>
                         <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600/50 file:text-cyan-200 hover:file:bg-cyan-600"/>
                         <p className="text-gray-400 my-4">2. Describe your changes with AI.</p>
                         <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Make this image look like a watercolor painting" className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" disabled={isLoading || !baseImage}/>
                         <button onClick={handleGenerate} disabled={isLoading || !baseImage || !prompt} className="mt-4 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Image'}</button>
                         {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-gray-400 mb-2">Card Preview</p>
                        <div className="w-full max-w-sm aspect-[85.6/54] rounded-xl bg-gray-900/50 overflow-hidden shadow-2xl border border-gray-600 flex items-center justify-center">
                            {isLoading && <div className="text-cyan-300">Generating...</div>}
                            {!isLoading && displayImage && <img src={displayImage} alt="Card Preview" className="w-full h-full object-cover"/>}
                            {!isLoading && !displayImage && <div className="text-gray-500">Upload an image to start</div>}
                        </div>
                    </div>
                </div>
            </Card>
             <Card title="AI-Generated Card Story">
                {isStoryLoading ? <p>Generating story...</p> : cardStory ? <p className="text-gray-300 italic">"{cardStory}"</p> : <p className="text-gray-400">Generate a story for your unique card design.</p>}
                 <button onClick={generateCardStory} disabled={isStoryLoading || !displayImage} className="mt-4 px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-sm disabled:opacity-50">{isStoryLoading ? 'Writing...' : 'Generate Story'}</button>
             </Card>
        </div>
    );
};

export default CardCustomizationView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/personal/CardCustomizationView.tsx
================================================================================

// components/views/personal/CardCustomizationView.tsx
import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Card from '../../Card';

const CardCustomizationView: React.FC = () => {
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('Add a phoenix rising from the center, with its wings made of glowing data streams.');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [cardStory, setCardStory] = useState('');
    const [isStoryLoading, setIsStoryLoading] = useState(false);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string));
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setBaseImage(base64);
            setGeneratedImage(null);
        }
    };

    const handleGenerate = async () => {
        if (!baseImage || !prompt) return;
        setIsLoading(true); setError(''); setGeneratedImage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64Data = baseImage.split(',')[1];
            const mimeType = baseImage.match(/:(.*?);/)?.[1] || 'image/jpeg';
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: [{ inlineData: { data: base64Data, mimeType: mimeType } }, { text: prompt }] },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
            });

            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
            if (imagePart?.inlineData) {
                setGeneratedImage(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
            } else { setError("The AI didn't return an image. Try a different prompt."); }
        } catch (err) {
            setError("Sorry, I couldn't edit the image. Please try again.");
        } finally { setIsLoading(false); }
    };

     const generateCardStory = async () => {
        setIsStoryLoading(true); setCardStory('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const storyPrompt = `Based on this generative AI prompt for a credit card design, write a short, inspiring "Card Story" (2-3 sentences) about what this card represents. Prompt: "${prompt}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: storyPrompt });
            setCardStory(response.text);
        } catch (err) {
            setCardStory("Could not generate a story for this design.");
        } finally { setIsStoryLoading(false); }
    };

    const displayImage = generatedImage || baseImage;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Card Customization Forge</h2>
             <Card title="Design Your Card">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div>
                         <p className="text-gray-400 mb-4">1. Upload a base image.</p>
                         <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600/50 file:text-cyan-200 hover:file:bg-cyan-600"/>
                         <p className="text-gray-400 my-4">2. Describe your changes with AI.</p>
                         <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Make this image look like a watercolor painting" className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" disabled={isLoading || !baseImage}/>
                         <button onClick={handleGenerate} disabled={isLoading || !baseImage || !prompt} className="mt-4 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Generating...' : 'Generate Image'}</button>
                         {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-gray-400 mb-2">Card Preview</p>
                        <div className="w-full max-w-sm aspect-[85.6/54] rounded-xl bg-gray-900/50 overflow-hidden shadow-2xl border border-gray-600 flex items-center justify-center">
                            {isLoading && <div className="text-cyan-300">Generating...</div>}
                            {!isLoading && displayImage && <img src={displayImage} alt="Card Preview" className="w-full h-full object-cover"/>}
                            {!isLoading && !displayImage && <div className="text-gray-500">Upload an image to start</div>}
                        </div>
                    </div>
                </div>
            </Card>
             <Card title="AI-Generated Card Story">
                {isStoryLoading ? <p>Generating story...</p> : cardStory ? <p className="text-gray-300 italic">"{cardStory}"</p> : <p className="text-gray-400">Generate a story for your unique card design.</p>}
                 <button onClick={generateCardStory} disabled={isStoryLoading || !displayImage} className="mt-4 px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-sm disabled:opacity-50">{isStoryLoading ? 'Writing...' : 'Generate Story'}</button>
             </Card>
        </div>
    );
};

export default CardCustomizationView;
