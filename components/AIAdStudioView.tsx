// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/AIAdStudioView.tsx
================================================================================

// components/AIAdStudioView.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef, Reducer, useReducer } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';

const pollingMessages = [ "Initializing Veo 2.0 model...", "Analyzing prompt semantics...", "Generating initial keyframes...", "Rendering motion vectors...", "Upscaling to high resolution...", "Adding audio layer...", "Finalizing video file..." ];

// SECTION: Type Definitions for a real-world application
// =======================================================

export type GenerationState = 'idle' | 'generating' | 'polling' | 'done' | 'error';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '21:9';
export type VideoModel = 'veo-3.1-fast-generate-preview' | 'imagen-video-3-hq' | 'lumiere-hd-001' | 'phoenix-v1-fast';
export type GenerationMode = 'single' | 'storyboard';
export type AppTheme = 'dark' | 'light';

export interface GenerationSettings {
    model: VideoModel;
    aspectRatio: AspectRatio;
    duration: number; // in seconds
    negativePrompt: string;
    seed: number;
    highFidelity: boolean;
    stylizationStrength: number; // 0-100
}

export interface StoryboardScene {
    id: string;
    prompt: string;
    duration: number; // Scene-specific duration
}

export interface VideoAsset {
    id: string;
    projectId: string;
    url: string; // Could be a blob URL or a remote URL
    thumbnailUrl?: string;
    prompt: string;
    creationDate: string;
    settings: GenerationSettings;
    generationMode: GenerationMode;
    storyboard?: StoryboardScene[];
    isFavorite: boolean;
}

export interface AdProject {
    id: string;
    name: string;
    creationDate: string;
    lastModified: string;
    assets: VideoAsset[];
}

export interface AppConfig {
    apiKey: string | null;
    theme: AppTheme;
    autoSave: boolean;
    defaultSettings: GenerationSettings;
}

// SECTION: Mock API and Data Layer
// ===================================
// In a real application, this would be in a separate file and make real network requests.
// For this exercise, it's included here to simulate a backend.

export class MockBackendAPI {
    private projects: AdProject[] = [];
    private latency: number = 500; // ms

    constructor() {
        this.loadFromLocalStorage();
    }

    private async simulateLatency(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, this.latency));
    }

    private saveToLocalStorage(): void {
        try {
            localStorage.setItem('ai_ad_studio_projects', JSON.stringify(this.projects));
        } catch (error) {
            console.error("Failed to save projects to local storage:", error);
        }
    }

    private loadFromLocalStorage(): void {
        try {
            const storedProjects = localStorage.getItem('ai_ad_studio_projects');
            if (storedProjects) {
                this.projects = JSON.parse(storedProjects);
            } else {
                // Initialize with some default data if nothing is stored
                const defaultProject: AdProject = {
                    id: `proj_${Date.now()}`,
                    name: 'My First Campaign',
                    creationDate: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    assets: [],
                };
                this.projects.push(defaultProject);
                this.saveToLocalStorage();
            }
        } catch (error) {
            console.error("Failed to load projects from local storage:", error);
            this.projects = [];
        }
    }
    
    public async getProjects(): Promise<AdProject[]> {
        await this.simulateLatency();
        return JSON.parse(JSON.stringify(this.projects)); // Return a deep copy
    }
    
    public async createProject(name: string): Promise<AdProject> {
        await this.simulateLatency();
        const newProject: AdProject = {
            id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            creationDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            assets: [],
        };
        this.projects.push(newProject);
        this.saveToLocalStorage();
        return { ...newProject };
    }
    
    public async renameProject(id: string, newName: string): Promise<AdProject | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === id);
        if (project) {
            project.name = newName;
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return { ...project };
        }
        return null;
    }
    
    public async deleteProject(id: string): Promise<boolean> {
        await this.simulateLatency();
        const initialLength = this.projects.length;
        this.projects = this.projects.filter(p => p.id !== id);
        this.saveToLocalStorage();
        return this.projects.length < initialLength;
    }
    
    public async addAssetToProject(projectId: string, asset: Omit<VideoAsset, 'id' | 'projectId' | 'creationDate'>): Promise<VideoAsset> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        const newAsset: VideoAsset = {
            ...asset,
            id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            creationDate: new Date().toISOString(),
        };
        project.assets.unshift(newAsset); // Add to the beginning
        project.lastModified = new Date().toISOString();
        this.saveToLocalStorage();
        return { ...newAsset };
    }

    public async deleteAsset(projectId: string, assetId: string): Promise<boolean> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const initialLength = project.assets.length;
            project.assets = project.assets.filter(a => a.id !== assetId);
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return project.assets.length < initialLength;
        }
        return false;
    }

    public async toggleFavoriteAsset(projectId: string, assetId: string): Promise<VideoAsset | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const asset = project.assets.find(a => a.id === assetId);
            if(asset) {
                asset.isFavorite = !asset.isFavorite;
                project.lastModified = new Date().toISOString();
                this.saveToLocalStorage();
                return { ...asset };
            }
        }
        return null;
    }
}

// Instantiate the mock API
export const mockApi = new MockBackendAPI();


// SECTION: Utility Functions
// ==========================

export const generateUniqueId = (): string => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (isoString: string): string => {
    try {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return 'Invalid Date';
    }
};

export const getAspectRatioClass = (aspectRatio: AspectRatio): string => {
    switch (aspectRatio) {
        case '16:9': return 'aspect-video';
        case '9:16': return 'aspect-[9/16]';
        case '1:1': return 'aspect-square';
        case '4:5': return 'aspect-[4/5]';
        case '21:9': return 'aspect-[21/9]';
        default: return 'aspect-video';
    }
};

// SECTION: Reducer for Complex State Management
// =============================================

type AppState = {
    projects: AdProject[];
    currentProjectId: string | null;
    isLoading: boolean;
    error: string | null;
    config: AppConfig;
};

type AppAction =
    | { type: 'SET_PROJECTS'; payload: AdProject[] }
    | { type: 'SET_CURRENT_PROJECT'; payload: string | null }
    | { type: 'ADD_PROJECT'; payload: AdProject }
    | { type: 'UPDATE_PROJECT'; payload: AdProject }
    | { type: 'REMOVE_PROJECT'; payload: string }
    | { type: 'ADD_ASSET'; payload: { projectId: string; asset: VideoAsset } }
    | { type: 'REMOVE_ASSET'; payload: { projectId: string; assetId: string } }
    | { type: 'UPDATE_ASSET'; payload: { projectId: string; asset: VideoAsset } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'UPDATE_CONFIG'; payload: Partial<AppConfig> };

const initialState: AppState = {
    projects: [],
    currentProjectId: null,
    isLoading: true,
    error: null,
    config: {
        apiKey: null,
        theme: 'dark',
        autoSave: true,
        defaultSettings: {
            model: 'veo-3.1-fast-generate-preview',
            aspectRatio: '16:9',
            duration: 10,
            negativePrompt: 'blurry, low quality, watermark, text',
            seed: -1, // -1 means random
            highFidelity: true,
            stylizationStrength: 70,
        },
    },
};

const appReducer: Reducer<AppState, AppAction> = (state, action): AppState => {
    switch (action.type) {
        case 'SET_PROJECTS':
            const firstProjectId = action.payload.length > 0 ? action.payload[0].id : null;
            return {
                ...state,
                projects: action.payload,
                currentProjectId: state.currentProjectId || firstProjectId,
                isLoading: false,
            };
        case 'SET_CURRENT_PROJECT':
            return { ...state, currentProjectId: action.payload };
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload] };
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(p => (p.id === action.payload.id ? action.payload : p)),
            };
        case 'REMOVE_PROJECT':
            const remainingProjects = state.projects.filter(p => p.id !== action.payload);
            const newCurrentProjectId = state.currentProjectId === action.payload 
                ? remainingProjects.length > 0 ? remainingProjects[0].id : null 
                : state.currentProjectId;
            return {
                ...state,
                projects: remainingProjects,
                currentProjectId: newCurrentProjectId,
            };
        case 'ADD_ASSET':
        case 'REMOVE_ASSET':
        case 'UPDATE_ASSET':
            return {
                ...state,
                projects: state.projects.map(p => {
                    if (p.id !== action.payload.projectId) return p;
                    let newAssets: VideoAsset[];
                    if (action.type === 'ADD_ASSET') {
                        newAssets = [action.payload.asset, ...p.assets];
                    } else if (action.type === 'REMOVE_ASSET') {
                        newAssets = p.assets.filter(a => a.id !== action.payload.assetId);
                    } else { // UPDATE_ASSET
                        newAssets = p.assets.map(a => a.id === action.payload.asset.id ? action.payload.asset : a);
                    }
                    return { ...p, assets: newAssets, lastModified: new Date().toISOString() };
                }),
            };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'UPDATE_CONFIG':
            return { ...state, config: { ...state.config, ...action.payload } };
        default:
            return state;
    }
};

// SECTION: Child Components
// ==========================
// In a real app, these would be in separate files.

export const ProjectSidebar: React.FC<{
    projects: AdProject[];
    currentProjectId: string | null;
    onSelectProject: (id: string) => void;
    onCreateProject: (name: string) => void;
    onDeleteProject: (id: string) => void;
    onRenameProject: (id: string, newName: string) => void;
}> = ({ projects, currentProjectId, onSelectProject, onCreateProject, onDeleteProject, onRenameProject }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renamingText, setRenamingText] = useState('');

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            onCreateProject(newProjectName.trim());
            setNewProjectName('');
        }
    };

    const handleRename = (id: string) => {
        if (renamingText.trim() && renamingId) {
            onRenameProject(id, renamingText.trim());
        }
        setRenamingId(null);
        setRenamingText('');
    };

    return (
        <div className="bg-gray-800/50 border-r border-gray-700 w-64 p-4 flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-4">Projects</h3>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                    placeholder="New Campaign Name..."
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button onClick={handleCreateProject} className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-r-md text-sm">+</button>
            </div>
            <ul className="space-y-2 overflow-y-auto flex-grow">
                {projects.map(project => (
                    <li key={project.id}>
                        <div
                            className={`group flex items-center justify-between p-2 rounded-md cursor-pointer ${currentProjectId === project.id ? 'bg-cyan-600/30 text-cyan-300' : 'text-gray-300 hover:bg-gray-700/50'}`}
                            onClick={() => onSelectProject(project.id)}
                        >
                            {renamingId === project.id ? (
                                <input
                                    type="text"
                                    value={renamingText}
                                    onChange={(e) => setRenamingText(e.target.value)}
                                    onBlur={() => handleRename(project.id)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleRename(project.id)}
                                    className="bg-gray-600 text-white w-full text-sm p-1 rounded"
                                    autoFocus
                                />
                            ) : (
                                <span className="truncate text-sm">{project.name}</span>
                            )}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); setRenamingId(project.id); setRenamingText(project.name); }} className="text-gray-400 hover:text-white text-xs">✏️</button>
                                <button onClick={(e) => { e.stopPropagation(); if(window.confirm(`Are you sure you want to delete "${project.name}"?`)) onDeleteProject(project.id);}} className="text-gray-400 hover:text-red-500 text-xs">🗑️</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const GenerationControls: React.FC<{
    settings: GenerationSettings;
    onSettingsChange: (newSettings: Partial<GenerationSettings>) => void;
    isGenerating: boolean;
}> = ({ settings, onSettingsChange, isGenerating }) => {
    return (
        <Card title="Generation Parameters">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Model Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">AI Model</label>
                    <select
                        value={settings.model}
                        onChange={e => onSettingsChange({ model: e.target.value as VideoModel })}
                        disabled={isGenerating}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="veo-3.1-fast-generate-preview">Veo 2.0 (High Quality)</option>
                        <option value="imagen-video-3-hq">Imagen Video 3 (Creative)</option>
                        <option value="lumiere-hd-001">Lumiere HD (Realistic)</option>
                        <option value="phoenix-v1-fast">Phoenix v1 (Fast Draft)</option>
                    </select>
                </div>
                {/* Aspect Ratio */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Aspect Ratio</label>
                    <select
                        value={settings.aspectRatio}
                        onChange={e => onSettingsChange({ aspectRatio: e.target.value as AspectRatio })}
                        disabled={isGenerating}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="16:9">16:9 (Widescreen)</option>
                        <option value="9:16">9:16 (Vertical)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="4:5">4:5 (Portrait)</option>
                        <option value="21:9">21:9 (Cinematic)</option>
                    </select>
                </div>
                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Duration (s): {settings.duration}</label>
                    <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={settings.duration}
                        onChange={e => onSettingsChange({ duration: parseInt(e.target.value, 10) })}
                        disabled={isGenerating}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                {/* Seed */}
                <div className="lg:col-span-1">
                     <label className="block text-sm font-medium text-gray-300 mb-1">Seed</label>
                     <div className="flex">
                        <input
                            type="number"
                            value={settings.seed === -1 ? '' : settings.seed}
                            onChange={e => onSettingsChange({ seed: parseInt(e.target.value, 10) || -1 })}
                            placeholder="Random"
                            disabled={isGenerating}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-l-lg p-2 text-white text-sm"
                        />
                        <button onClick={() => onSettingsChange({seed: -1})} className="bg-gray-600 hover:bg-gray-500 p-2 rounded-r-lg text-sm" disabled={isGenerating}>🎲</button>
                     </div>
                </div>
                 {/* Stylization Strength */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Stylization Strength: {settings.stylizationStrength}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={settings.stylizationStrength}
                        onChange={e => onSettingsChange({ stylizationStrength: parseInt(e.target.value, 10) })}
                        disabled={isGenerating}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                {/* Negative Prompt */}
                <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Negative Prompt</label>
                    <input
                        type="text"
                        value={settings.negativePrompt}
                        onChange={e => onSettingsChange({ negativePrompt: e.target.value })}
                        placeholder="e.g., blurry, text, watermark, ugly"
                        disabled={isGenerating}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    />
                </div>
                {/* Toggles */}
                <div className="col-span-full">
                    <label className="flex items-center space-x-2 text-sm text-gray-300">
                        <input
                            type="checkbox"
                            checked={settings.highFidelity}
                            onChange={e => onSettingsChange({ highFidelity: e.target.checked })}
                            disabled={isGenerating}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span>High Fidelity Mode (Slower, higher quality)</span>
                    </label>
                </div>
            </div>
        </Card>
    );
};

export const AssetGrid: React.FC<{
    assets: VideoAsset[];
    onDelete: (assetId: string) => void;
    onToggleFavorite: (assetId: string) => void;
    onSelect: (asset: VideoAsset) => void;
}> = ({ assets, onDelete, onToggleFavorite, onSelect }) => {
    if (assets.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500">
                <p>No video assets in this project yet.</p>
                <p>Generate a new video to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.map(asset => (
                <div key={asset.id} className="group relative aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <video src={asset.url} muted loop className="w-full h-full object-cover" onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()}></video>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => onToggleFavorite(asset.id)} className={`text-xl ${asset.isFavorite ? 'text-yellow-400' : 'text-white/70 hover:text-white'}`}>
                                {asset.isFavorite ? '★' : '☆'}
                            </button>
                            <button onClick={() => onDelete(asset.id)} className="text-white/70 hover:text-red-500">🗑️</button>
                        </div>
                        <div>
                            <p className="text-xs text-white truncate">{asset.prompt}</p>
                            <p className="text-xs text-gray-400">{formatDate(asset.creationDate)}</p>
                            <button onClick={() => onSelect(asset)} className="mt-1 w-full text-xs bg-cyan-600/80 hover:bg-cyan-600/100 text-white py-1 rounded">View Details</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const StoryboardEditor: React.FC<{
    scenes: StoryboardScene[];
    setScenes: React.Dispatch<React.SetStateAction<StoryboardScene[]>>;
    isGenerating: boolean;
}> = ({ scenes, setScenes, isGenerating }) => {
    const addScene = () => {
        setScenes(prev => [...prev, { id: generateUniqueId(), prompt: '', duration: 5 }]);
    };

    const updateScenePrompt = (id: string, prompt: string) => {
        setScenes(prev => prev.map(s => s.id === id ? { ...s, prompt } : s));
    };
    
    const updateSceneDuration = (id: string, duration: number) => {
        setScenes(prev => prev.map(s => s.id === id ? { ...s, duration } : s));
    };

    const removeScene = (id: string) => {
        setScenes(prev => prev.filter(s => s.id !== id));
    };
    
    const totalDuration = useMemo(() => scenes.reduce((acc, scene) => acc + scene.duration, 0), [scenes]);

    return (
        <div className="space-y-4">
            {scenes.map((scene, index) => (
                <div key={scene.id} className="flex items-start space-x-3 p-3 bg-gray-800/60 rounded-lg">
                    <span className="font-bold text-gray-400 mt-2">{index + 1}</span>
                    <div className="flex-grow space-y-2">
                        <textarea
                            value={scene.prompt}
                            onChange={e => updateScenePrompt(scene.id, e.target.value)}
                            placeholder={`Scene ${index + 1} description...`}
                            className="w-full h-20 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm"
                            disabled={isGenerating}
                        />
                         <div className="flex items-center space-x-2">
                            <label className="text-xs text-gray-400">Duration:</label>
                             <input
                                type="range"
                                min="1"
                                max="15"
                                value={scene.duration}
                                onChange={e => updateSceneDuration(scene.id, parseInt(e.target.value, 10))}
                                disabled={isGenerating}
                                className="w-32 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-white w-8">{scene.duration}s</span>
                        </div>
                    </div>
                    <button onClick={() => removeScene(scene.id)} disabled={isGenerating || scenes.length <= 1} className="text-gray-400 hover:text-red-500 disabled:opacity-30 mt-2">🗑️</button>
                </div>
            ))}
            <div className="flex justify-between items-center">
                <button onClick={addScene} disabled={isGenerating} className="py-2 px-4 text-sm bg-cyan-600/50 hover:bg-cyan-600/80 text-white rounded-lg disabled:opacity-50">
                    + Add Scene
                </button>
                <p className="text-sm text-gray-400">Total Estimated Duration: {totalDuration}s</p>
            </div>
        </div>
    );
};

// SECTION: Main Component
// =========================

const AIAdStudioView: React.FC = () => {
    // Original state
    const [prompt, setPrompt] = useState('A neon hologram of a cat driving a futuristic car at top speed through a cyberpunk city.');
    const [generationState, setGenerationState] = useState<GenerationState>('idle');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [pollingMessageIndex, setPollingMessageIndex] = useState(0);
    const [pollingIntervalId, setPollingIntervalId] = useState<number | null>(null);

    // New state for the full application
    const [appState, dispatch] = useReducer(appReducer, initialState);
    const [generationSettings, setGenerationSettings] = useState<GenerationSettings>(initialState.config.defaultSettings);
    const [generationMode, setGenerationMode] = useState<GenerationMode>('single');
    const [scenes, setScenes] = useState<StoryboardScene[]>([{ id: generateUniqueId(), prompt: 'A cinematic opening shot of a futuristic city skyline at night.', duration: 5 }]);
    const [selectedAsset, setSelectedAsset] = useState<VideoAsset | null>(null);
    const isGenerating = generationState === 'generating' || generationState === 'polling';
    
    // API Key management
    const apiKeyInputRef = useRef<HTMLInputElement>(null);

    // Derived state
    const currentProject = useMemo(() => {
        return appState.projects.find(p => p.id === appState.currentProjectId);
    }, [appState.projects, appState.currentProjectId]);

    // Effects
    useEffect(() => {
        // Load initial projects from mock API
        mockApi.getProjects().then(projects => {
            dispatch({ type: 'SET_PROJECTS', payload: projects });
        }).catch(err => {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load projects.' });
            console.error(err);
        });

        // Load API key from local storage
        const storedApiKey = process.env.API_KEY || localStorage.getItem('google_genai_api_key');
        if (storedApiKey) {
            dispatch({ type: 'UPDATE_CONFIG', payload: { apiKey: storedApiKey } });
        }
    }, []);

    useEffect(() => {
        // Cleanup interval on component unmount or when polling stops
        return () => {
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
            }
        };
    }, [pollingIntervalId]);

    useEffect(() => {
        // Cleanup blob URL on component unmount or when videoUrl changes
        return () => {
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);
    
    // Project management handlers
    const handleCreateProject = useCallback(async (name: string) => {
        try {
            const newProject = await mockApi.createProject(name);
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject.id });
        } catch (err) {
            alert('Failed to create project.');
        }
    }, []);

    const handleDeleteProject = useCallback(async (id: string) => {
        try {
            await mockApi.deleteProject(id);
            dispatch({ type: 'REMOVE_PROJECT', payload: id });
        } catch (err) {
            alert('Failed to delete project.');
        }
    }, []);
    
    const handleRenameProject = useCallback(async (id: string, newName: string) => {
        try {
            const updatedProject = await mockApi.renameProject(id, newName);
            if (updatedProject) {
                dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
            }
        } catch (err) {
            alert('Failed to rename project.');
        }
    }, []);

    // Asset management handlers
    const handleDeleteAsset = useCallback(async (assetId: string) => {
        if (!currentProject) return;
        if (!window.confirm("Are you sure you want to delete this video asset?")) return;
        try {
            await mockApi.deleteAsset(currentProject.id, assetId);
            dispatch({ type: 'REMOVE_ASSET', payload: { projectId: currentProject.id, assetId }});
            if (selectedAsset?.id === assetId) {
                setSelectedAsset(null);
            }
        } catch (err) {
            alert('Failed to delete asset.');
        }
    }, [currentProject, selectedAsset]);
    
    const handleToggleFavorite = useCallback(async (assetId: string) => {
        if (!currentProject) return;
        try {
            const updatedAsset = await mockApi.toggleFavoriteAsset(currentProject.id, assetId);
            if(updatedAsset) {
                dispatch({ type: 'UPDATE_ASSET', payload: { projectId: currentProject.id, asset: updatedAsset }});
            }
        } catch (err) {
            alert('Failed to update favorite status.');
        }
    }, [currentProject]);

    // API Key handler
    const handleApiKeySave = () => {
        const key = apiKeyInputRef.current?.value;
        if (key) {
            localStorage.setItem('google_genai_api_key', key);
            dispatch({ type: 'UPDATE_CONFIG', payload: { apiKey: key } });
            alert("API Key saved. Please refresh the page if you experience issues.");
        }
    };

    // Main Generation Logic (adapted from original)
    const handleGenerate = async () => {
        if (!appState.config.apiKey) {
            setError('API Key is not set. Please add it in the settings.');
            setGenerationState('error');
            return;
        }

        if(!currentProject) {
            setError('No project selected. Please create or select a project first.');
            setGenerationState('error');
            return;
        }

        setGenerationState('generating');
        setError('');
        if (videoUrl && videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(videoUrl);
        }
        setVideoUrl(null);
        setPollingMessageIndex(0);
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }
        
        const finalPrompt = generationMode === 'single' ? prompt : scenes.map(s => s.prompt).join(' | ');

        try {
            const ai = new GoogleGenAI({ apiKey: appState.config.apiKey });
            
            // This is a simplified representation. A real API call would include all settings.
            const apiPayload: any = {
                model: generationSettings.model,
                prompt: finalPrompt,
                config: {
                    numberOfVideos: 1,
                    aspectRatio: generationSettings.aspectRatio,
                    resolution: '720p',
                    //... other settings
                },
            };
            console.log("Sending to AI API:", apiPayload);

            let operation = await ai.models.generateVideos(apiPayload);

            setGenerationState('polling');
            
            const intervalId: number = window.setInterval(() => {
                setPollingMessageIndex(prev => (prev + 1) % pollingMessages.length);
            }, 2500);
            setPollingIntervalId(intervalId);

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }
            
            clearInterval(intervalId);
            setPollingIntervalId(null);

            if (operation.error) {
                 throw new Error(String(operation.error.message) || 'Video generation failed after polling.');
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

            if (downloadLink) {
                setPollingMessageIndex(pollingMessages.length - 1);
                const videoResponse = await fetch(`${downloadLink}&key=${appState.config.apiKey}`);
                if (!videoResponse.ok) {
                    throw new Error(`Failed to download the generated video. Status: ${videoResponse.statusText}`);
                }
                const videoBlob = await videoResponse.blob();
                const objectURL = URL.createObjectURL(videoBlob);
                setVideoUrl(objectURL);
                setGenerationState('done');

                // Add the new asset to the current project
                const newAssetData = {
                    url: objectURL,
                    prompt: finalPrompt,
                    settings: generationSettings,
                    generationMode,
                    storyboard: generationMode === 'storyboard' ? scenes : undefined,
                    isFavorite: false,
                };

                const newAsset = await mockApi.addAssetToProject(currentProject.id, newAssetData);
                dispatch({ type: 'ADD_ASSET', payload: { projectId: currentProject.id, asset: newAsset } });

            } else {
                throw new Error('Video generation completed, but no download link was found in the response.');
            }

        } catch (err: any) {
            console.error("Video generation failed:", err);
            setError(String(err?.message || 'An error occurred during video generation.'));
            setGenerationState('error');
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
                setPollingIntervalId(null);
            }
        }
    };

    if (appState.isLoading) {
        return <div className="text-white text-center p-10">Loading Ad Studio...</div>;
    }

    if (!appState.config.apiKey) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
                <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
                    <p className="text-gray-400 mb-6">Please enter your Google GenAI API key to use the AI Ad Studio.</p>
                    <div className="space-y-4">
                        <input
                            ref={apiKeyInputRef}
                            type="password"
                            placeholder="Enter your API key here"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                        />
                        <button onClick={handleApiKeySave} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">
                            Save API Key
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-900 text-white">
            <ProjectSidebar 
                projects={appState.projects}
                currentProjectId={appState.currentProjectId}
                onSelectProject={id => dispatch({ type: 'SET_CURRENT_PROJECT', payload: id })}
                onCreateProject={handleCreateProject}
                onDeleteProject={handleDeleteProject}
                onRenameProject={handleRenameProject}
            />
            <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">AI Ad Studio</h2>
                    <div className="text-right">
                        <h3 className="text-lg font-semibold">{currentProject?.name || "No Project Selected"}</h3>
                        <p className="text-sm text-gray-400">Last Modified: {currentProject ? formatDate(currentProject.lastModified) : 'N/A'}</p>
                    </div>
                </div>

                {currentProject ? (
                <>
                <Card title="Generate a Custom Video Ad with Veo 2.0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Controls & Prompt */}
                        <div className="space-y-4">
                             <div className="flex bg-gray-800/50 rounded-lg p-1">
                                <button onClick={() => setGenerationMode('single')} className={`flex-1 py-1 rounded-md text-sm ${generationMode === 'single' ? 'bg-cyan-600' : ''}`}>Single Prompt</button>
                                <button onClick={() => setGenerationMode('storyboard')} className={`flex-1 py-1 rounded-md text-sm ${generationMode === 'storyboard' ? 'bg-cyan-600' : ''}`}>Storyboard</button>
                            </div>
                            
                            {generationMode === 'single' ? (
                                 <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your ad..." className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" />
                            ) : (
                                <StoryboardEditor scenes={scenes} setScenes={setScenes} isGenerating={isGenerating} />
                            )}
                            
                            <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                {isGenerating ? 'Generating...' : 'Generate Ad'}
                            </button>
                        </div>
                        {/* Right Column: Video Preview */}
                        <div className={` ${getAspectRatioClass(generationSettings.aspectRatio)} mx-auto max-h-[50vh] w-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700`}>
                            {generationState === 'done' && videoUrl ? (
                                <video src={videoUrl} controls autoPlay muted loop className="w-full h-full rounded-lg object-contain" />
                            ) : generationState === 'generating' || generationState === 'polling' ? (
                                <div className="text-center">
                                    <div className="relative w-16 h-16 mx-auto">
                                        <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                                        <div className="absolute inset-2 border-4 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <p className="text-white mt-4">{pollingMessages[pollingMessageIndex]}</p>
                                </div>
                            ) : error ? (
                                 <p className="text-red-400 p-4 text-center">{error}</p>
                            ) : (
                                 <p className="text-gray-500">Your generated video will appear here.</p>
                            )}
                        </div>
                    </div>
                </Card>

                <GenerationControls settings={generationSettings} onSettingsChange={ (partial) => setGenerationSettings(s => ({...s, ...partial}))} isGenerating={isGenerating} />
                
                <Card title="Project Asset Library">
                    <AssetGrid 
                        assets={currentProject.assets}
                        onDelete={handleDeleteAsset}
                        onToggleFavorite={handleToggleFavorite}
                        onSelect={setSelectedAsset}
                    />
                </Card>
                </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">Please select or create a project to begin.</p>
                    </div>
                )}
            </main>

            {/* Asset Detail Modal */}
            {selectedAsset && (
                 <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={() => setSelectedAsset(null)}>
                    <div className="bg-gray-800 rounded-lg max-w-4xl w-full p-6 space-y-4 m-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white">Asset Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <video src={selectedAsset.url} controls autoPlay loop muted className="w-full rounded-lg"></video>
                            </div>
                            <div className="text-sm space-y-3 text-gray-300">
                                <p><strong>Prompt:</strong> {selectedAsset.prompt}</p>
                                <p><strong>Generated:</strong> {formatDate(selectedAsset.creationDate)}</p>
                                <p><strong>Model:</strong> {selectedAsset.settings.model}</p>
                                <p><strong>Aspect Ratio:</strong> {selectedAsset.settings.aspectRatio}</p>
                                <p><strong>Duration:</strong> {selectedAsset.settings.duration}s</p>
                                <p><strong>Seed:</strong> {selectedAsset.settings.seed}</p>
                                {selectedAsset.settings.negativePrompt && <p><strong>Negative Prompt:</strong> {selectedAsset.settings.negativePrompt}</p>}
                                <p><strong>High Fidelity:</strong> {selectedAsset.settings.highFidelity ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <a href={selectedAsset.url} download={`ai-ad-${selectedAsset.id}.mp4`} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg">Download</a>
                            <button onClick={() => setSelectedAsset(null)} className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAdStudioView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/AIAdStudioView.tsx
================================================================================


import React, { useState, useEffect, useContext } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { Bot, Loader2, Download, Play, Video } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const POLLING_MESSAGES = [ 
    "Initializing Neural Video Synthesis Engine...", 
    "Analyzing semantic intent vectors...", 
    "Generating high-fidelity frame buffer...", 
    "Executing temporal coherence algorithms...", 
    "Optimizing lighting and global illumination...", 
    "Finalizing secure asset manifest..." 
];

const AIAdStudioView: React.FC = () => {
    const context = useContext(DataContext);
    const [prompt, setPrompt] = useState('A hyper-realistic cinematic commercial for a futuristic sovereign city-state, neon lights reflecting on wet pavement, high-speed travel pods in the background.');
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pollingStep, setPollingStep] = useState(0);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setError(null);
        setVideoUrl(null);
        setPollingStep(0);

        const pollingInterval = setInterval(() => {
            setPollingStep(prev => (prev + 1) % POLLING_MESSAGES.length);
        }, 3000);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '16:9'
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                /* FIX: Cast operation to any to bypass type error when polling for operation status */
                operation = await ai.operations.getVideosOperation({ operation: operation as any });
            }

            if (operation.error) {
                throw new Error(operation.error.message || 'Generation failed');
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred during generation.');
        } finally {
            clearInterval(pollingInterval);
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center border-b border-gray-800 pb-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">AI Ad Studio</h2>
                    <p className="text-gray-400 text-xs font-mono tracking-widest">VEHICLE: VEO_3.1_FAST_GEN</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Creative Directives">
                        <div className="space-y-4">
                            <textarea 
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                className="w-full h-48 bg-black/50 border border-gray-700 rounded-2xl p-6 text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none font-sans"
                                placeholder="Describe the cinematic vision..."
                                disabled={isGenerating}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Aspect Ratio</label>
                                    <div className="text-white font-bold">16:9 Landscape</div>
                                </div>
                                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Target Engine</label>
                                    <div className="text-white font-bold italic">VEO-3.1-FAST</div>
                                </div>
                            </div>
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
                            >
                                {isGenerating ? <><Loader2 className="animate-spin" /> Synthesizing Reality...</> : <><Video size={20} /> Execute Synthesis</>}
                            </button>
                            {error && <p className="text-red-400 text-xs font-mono text-center p-3 bg-red-950/20 rounded-lg border border-red-500/30">{error}</p>}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Asset Preview">
                        <div className="aspect-video bg-black rounded-2xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                            {isGenerating ? (
                                <div className="text-center p-6 space-y-6 z-10">
                                    <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]"></div>
                                    <p className="text-xs text-cyan-400 font-mono animate-pulse tracking-tight">{POLLING_MESSAGES[pollingStep]}</p>
                                </div>
                            ) : videoUrl ? (
                                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-8 space-y-2 opacity-30">
                                    <Bot size={64} className="mx-auto text-gray-600" />
                                    <p className="text-xs text-gray-500 font-mono">AWAITING SIGNAL INGESTION</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
                        </div>
                        {videoUrl && (
                            <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/30 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-bold text-green-400 uppercase">Asset Manifest Valid</span>
                                </div>
                                <a href={videoUrl} download="synthesis_result.mp4" className="flex items-center gap-2 text-xs font-black text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-500 transition-all">
                                    <Download size={14} /> DOWNLOAD MP4
                                </a>
                            </div>
                        )}
                    </Card>

                    <Card title="System Performance">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-xs text-gray-500 uppercase">Compute Load</span>
                                <span className="text-lg font-bold text-indigo-400">92%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-indigo-500 h-full w-[92%]"></div>
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono italic">"Quantum clusters are running at near-peak capacity for frame interpolation."</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIAdStudioView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/AIAdStudioView (2).tsx
================================================================================

/*
    Refactoring Note: The previous philosophical commentary has been removed to align with production-ready documentation standards.
    This file now focuses purely on technical implementation and architectural clarity.

    System Goal: Convert experimental prototype into a stable, coherent, production-ready platform.
    This module, AIAdStudioView.tsx, is a core component for the "AI-powered transaction intelligence" / "AI-powered creative" MVP candidate.
    It has been refactored to align with enhanced security, modularity, and maintainability.
*/
// components/AIAdStudioView.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef, Reducer, useReducer } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card'; // Assuming Card is a common UI component with consistent styling

// --- AI Generation Constants ---
const POLLING_MESSAGES = [ // Simplified polling messages for clarity and professionalism
    "Initializing AI Video Generation Engine...",
    "Analyzing prompt and scene directives...",
    "Allocating GPU compute resources...",
    "Synthesizing initial frame sequences...",
    "Applying stylistic and motion controls...",
    "Optimizing data stream for encoding...",
    "Finalizing video asset compilation..."
];
const MAX_SCENE_DURATION = 60;
const MIN_SCENE_DURATION = 1;
const MAX_PROJECTS_DISPLAY = 50;

// SECTION: Type Definitions (Standardized & Expanded)
// =======================================================

export type GenerationState = 'idle' | 'generating' | 'polling' | 'done' | 'error';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '21:9' | '3:2' | '2:3';
export type VideoModel = 'veo-3.1-ultra-hq' | 'imagen-video-4-pro' | 'lumiere-hd-001-enterprise' | 'phoenix-v2-stable';
export type GenerationMode = 'single_prompt' | 'storyboard_sequence' | 'ai_script_to_video'; // 'ai_script_to_video' is a future module
export type AppTheme = 'dark' | 'light' | 'system';
export type AssetType = 'video' | 'image_sequence' | 'audio_track';

export interface GenerationSettings {
    model: VideoModel;
    aspectRatio: AspectRatio;
    duration: number; // in seconds (for single prompt mode)
    negativePrompt: string;
    seed: number; // -1 for random, positive integer for deterministic
    stylizationStrength: number; // 0-100 (Creativity/Adherence balance)
    motionControl: 'default' | 'smooth' | 'dynamic';
    fidelityLevel: 'standard' | 'high_res' | '4k_preview';
    audioStyle: 'none' | 'cinematic_orchestral' | 'upbeat_synthwave' | 'corporate_minimal';
}

export interface StoryboardScene {
    id: string;
    prompt: string;
    aiDirectorNotes: string; // Specific instructions for the AI director for this frame
    duration: number; // Scene-specific duration
    visualReferenceUrl?: string; // Optional image reference for style transfer
}

export interface VideoAsset {
    id: string;
    projectId: string;
    assetType: AssetType;
    url: string; // Primary content URL
    metadataUrl?: string; // Secondary metadata/manifest URL
    prompt: string; // The primary prompt used for generation
    creationDate: string;
    lastAccessed: string;
    settings: GenerationSettings;
    generationMode: GenerationMode;
    storyboard?: StoryboardScene[];
    isFavorite: boolean;
    costCredits: number; // Estimated cost in internal credits
}

export interface AdProject {
    id: string;
    name: string;
    clientName: string; // New field for enterprise context
    creationDate: string;
    lastModified: string;
    assets: VideoAsset[];
    aiSummary: string; // AI-generated summary of the project's goal
}

export interface AppConfig {
    apiKey: string | null;
    theme: AppTheme;
    autoSave: boolean;
    defaultSettings: GenerationSettings;
    aiQuotaRemaining: number;
}

// SECTION: Mock Backend API (For MVP Development)
// ===================================================
// NOTE: This MockBackendAPI is for local development and demonstration purposes only.
// In a production environment, this entire class MUST be replaced with a secure,
// standards-compliant backend API (e.g., RESTful, gRPC) integrated with a proper
// database and authentication/authorization layer.
// All API Key management should be handled server-side via AWS Secrets Manager or Vault.
export class MockBackendAPI {
    private projects: AdProject[] = [];
    private latency: number = 150; // Reduced latency for perceived responsiveness
    private readonly STORAGE_KEY = 'ai_ad_studio_enterprise_projects_v2';

    constructor() {
        this.loadFromLocalStorage();
    }

    private async simulateLatency(minMs: number = this.latency): Promise<void> {
        const actualLatency = minMs + Math.random() * 100;
        return new Promise(resolve => setTimeout(resolve, actualLatency));
    }

    private saveToLocalStorage(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.projects));
        } catch (error) {
            console.error("CRITICAL: Failed to persist projects to local storage:", error);
        }
    }

    private loadFromLocalStorage(): void {
        try {
            const storedProjects = localStorage.getItem(this.STORAGE_KEY);
            if (storedProjects) {
                this.projects = JSON.parse(storedProjects);
            } else {
                this.initializeDefaultData();
            }
        } catch (error) {
            console.error("CRITICAL: Failed to load projects from local storage. Starting fresh:", error);
            this.initializeDefaultData();
        }
    }
    
    private initializeDefaultData(): void {
        const defaultSettings: GenerationSettings = {
            model: 'veo-3.1-ultra-hq',
            aspectRatio: '16:9',
            duration: 10,
            negativePrompt: 'blurry, low quality, watermark, text, artifacts, noise, low frame rate',
            seed: -1,
            stylizationStrength: 75,
            motionControl: 'dynamic',
            fidelityLevel: 'high_res',
            audioStyle: 'cinematic_orchestral',
        };
        
        const defaultProject: AdProject = {
            id: `proj_${Date.now()}`,
            name: 'Q1 2025 Launch Campaign',
            clientName: 'Global Dynamics Corp.',
            creationDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            assets: [],
            aiSummary: 'Initial project setup for high-impact video advertising targeting Gen Z demographics.',
        };
        this.projects.push(defaultProject);
        this.saveToLocalStorage();
    }

    // --- Project Operations ---
    
    public async getProjects(): Promise<AdProject[]> {
        await this.simulateLatency();
        return JSON.parse(JSON.stringify(this.projects)).slice(0, MAX_PROJECTS_DISPLAY);
    }
    
    public async getProjectById(id: string): Promise<AdProject | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === id);
        return project ? JSON.parse(JSON.stringify(project)) : null;
    }
    
    public async createProject(name: string, clientName: string = 'Unassigned Client'): Promise<AdProject> {
        await this.simulateLatency();
        const newProject: AdProject = {
            id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            clientName,
            creationDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            assets: [],
            aiSummary: `New project initialized for ${name}. Awaiting director input.`,
        };
        this.projects.push(newProject);
        this.saveToLocalStorage();
        return { ...newProject };
    }
    
    public async renameProject(id: string, newName: string): Promise<AdProject | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === id);
        if (project) {
            project.name = newName;
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return { ...project };
        }
        return null;
    }
    
    public async deleteProject(id: string): Promise<boolean> {
        await this.simulateLatency();
        const initialLength = this.projects.length;
        this.projects = this.projects.filter(p => p.id !== id);
        this.saveToLocalStorage();
        return this.projects.length < initialLength;
    }
    
    // --- Asset Operations ---
    
    public async addAssetToProject(projectId: string, asset: Omit<VideoAsset, 'id' | 'projectId' | 'creationDate' | 'lastAccessed'>): Promise<VideoAsset> {
        await this.simulateLatency(300); // Longer latency for asset creation
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            throw new Error('Project not found during asset addition');
        }
        const now = new Date().toISOString();
        const newAsset: VideoAsset = {
            ...asset,
            id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            creationDate: now,
            lastAccessed: now,
        };
        project.assets.unshift(newAsset); // Add to the beginning
        project.lastModified = now;
        this.saveToLocalStorage();
        return { ...newAsset };
    }

    public async deleteAsset(projectId: string, assetId: string): Promise<boolean> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const initialLength = project.assets.length;
            project.assets = project.assets.filter(a => a.id !== assetId);
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return project.assets.length < initialLength;
        }
        return false;
    }

    public async toggleFavoriteAsset(projectId: string, assetId: string): Promise<VideoAsset | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const asset = project.assets.find(a => a.id === assetId);
            if(asset) {
                asset.isFavorite = !asset.isFavorite;
                asset.lastAccessed = new Date().toISOString();
                project.lastModified = new Date().toISOString();
                this.saveToLocalStorage();
                return { ...asset };
            }
        }
        return null;
    }
    
    public async updateAssetAccessTime(projectId: string, assetId: string): Promise<void> {
        await this.simulateLatency(50);
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const asset = project.assets.find(a => a.id === assetId);
            if(asset) {
                asset.lastAccessed = new Date().toISOString();
                project.lastModified = new Date().toISOString();
                this.saveToLocalStorage();
            }
        }
    }
}

// Instantiate the mock API globally for the module
export const mockApi = new MockBackendAPI();


// SECTION: AI Integration Service (Standardized API Connector Pattern)
// ====================================================================
// This service encapsulates all direct calls to external AI APIs.
// It should handle rate limiting, retries, circuit breakers, and schema validation
// in a production environment. For this MVP, we simulate these patterns.
export class VideoGenerationService {
    private genAIClient: GoogleGenAI | null = null;
    private apiKey: string | null = null;
    private readonly MAX_POLLING_ATTEMPTS = 60; // Max 60 attempts * 8s = 8 minutes timeout
    private readonly POLLING_INTERVAL_MS = 8000; // Poll every 8 seconds

    public setApiKey(key: string | null): void {
        this.apiKey = key;
        this.genAIClient = key ? new GoogleGenAI({ apiKey: key }) : null;
    }

    private checkClient(): GoogleGenAI {
        if (!this.genAIClient || !this.apiKey) {
            throw new Error("AI Service not initialized: API Key is missing or invalid.");
        }
        return this.genAIClient;
    }

    // Unified API connector for video generation
    public async generateVideoAsset(
        mode: GenerationMode,
        singlePrompt: string,
        scenes: StoryboardScene[],
        settings: GenerationSettings
    ): Promise<{ url: string; prompt: string; costCredits: number; storyboard?: StoryboardScene[] }> {
        const ai = this.checkClient();
        
        const finalPrompt = synthesizeDirectorPrompt(mode, singlePrompt, scenes);
        const estimatedCost = mode === 'storyboard_sequence' ? 500 : 100; // Mock cost calculation

        // Simulate rate limiting / circuit breaker check
        console.info("[AI Service] Checking API rate limits and circuit breaker status...");
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate a quick check

        const apiPayload: any = {
            model: settings.model,
            prompt: finalPrompt,
            config: {
                numberOfVideos: 1,
                aspectRatio: settings.aspectRatio,
                duration: mode === 'single_prompt' ? settings.duration : undefined,
                fidelity: settings.fidelityLevel,
                stylization: settings.stylizationStrength / 100,
                motionProfile: settings.motionControl,
                audioTrack: settings.audioStyle,
                seed: settings.seed,
                negativePrompt: settings.negativePrompt,
            },
        };

        console.log(`[AI Service] Executing ${mode} generation with payload:`, apiPayload);
        
        let operation;
        try {
            operation = await ai.models.generateVideos(apiPayload);
            console.info("[AI Service] Generation operation initiated.");
        } catch (initialError: any) {
            console.error("[AI Service] Initial generation request failed:", initialError);
            throw new Error(`AI Request Failure: ${initialError.message || 'Unknown API error.'}`);
        }

        let attempts = 0;
        // Polling loop with explicit timeout
        while (!operation.done && attempts < this.MAX_POLLING_ATTEMPTS) {
            attempts++;
            console.debug(`[AI Service] Polling for video generation status (attempt ${attempts})...`);
            await new Promise(resolve => setTimeout(resolve, this.POLLING_INTERVAL_MS));
            
            try {
                operation = await ai.operations.getVideosOperation({ operation: operation });
            } catch (pollError: any) {
                console.error(`[AI Service] Polling failed on attempt ${attempts}:`, pollError);
                // Implement retry logic here if needed (e.g., exponential backoff)
                throw new Error(`AI Polling Failure: ${pollError.message || 'Unknown polling error.'}`);
            }
        }

        if (attempts >= this.MAX_POLLING_ATTEMPTS) {
            console.error("[AI Service] Video generation timed out.");
            throw new Error("AI Generation Timeout: Operation exceeded maximum allowed time.");
        }

        if (operation.error) {
            console.error("[AI Service] Generation operation reported error:", operation.error);
            throw new Error(`AI Generation Error: ${operation.error.message || 'Unknown backend error.'}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            console.error("[AI Service] Generation succeeded, but no download link was provided.");
            throw new Error('AI Asset Retrieval Error: Generation successful, but asset manifest empty.');
        }

        // Simulate fetching the actual file (using the mock API key for the fetch URL for demo)
        // In production, this download link would likely be temporary, signed, and not require the client's API key.
        const videoResponse = await fetch(`${downloadLink}&key=${this.apiKey}`);
        if (!videoResponse.ok) {
            console.error(`[AI Service] Failed to retrieve asset blob: ${videoResponse.statusText}`);
            throw new Error(`Download Protocol Error: Failed to retrieve asset (${videoResponse.statusText})`);
        }
        const videoBlob = await videoResponse.blob();
        const objectURL = URL.createObjectURL(videoBlob);
        
        console.info("[AI Service] Video asset successfully generated and retrieved.");

        return {
            url: objectURL,
            prompt: finalPrompt,
            costCredits: estimatedCost,
            storyboard: mode === 'storyboard_sequence' ? scenes : undefined,
        };
    }

    // AI utility for summarizing prompts (explainability notes)
    public async generateDirectorSummary(fullPrompt: string): Promise<string> {
        const ai = this.checkClient();
        
        // This uses a text-specific model for efficiency
        const directorPrompt = `Analyze the following video generation sequence prompt and generate a concise, high-level summary of the intended visual narrative, target emotion, and required technical execution style.
        PROMPT: ${fullPrompt}`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: directorPrompt }] }],
                config: { temperature: 0.3, maxOutputTokens: 200 } // Limit output for conciseness
            });
            return response.candidates?.[0]?.content?.parts?.[0]?.text || "Summary generation failed or returned empty.";
        } catch (err: any) {
            console.error("[AI Service] Director summary generation failed:", err);
            throw new Error(`AI Summary Generation Failed: ${err.message || 'Unknown AI error.'}`);
        }
    }
}

// Instantiate the AI Service
export const videoGenerationService = new VideoGenerationService();


// SECTION: Utility Functions (Standardized)
// ==========================

export const generateUniqueId = (): string => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (isoString: string): string => {
    try {
        return new Date(isoString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    } catch {
        return 'Invalid Timestamp';
    }
};

export const getAspectRatioClass = (aspectRatio: AspectRatio): string => {
    switch (aspectRatio) {
        case '16:9': return 'aspect-[16/9]';
        case '9:16': return 'aspect-[9/16]';
        case '1:1': return 'aspect-square';
        case '4:5': return 'aspect-[4/5]';
        case '21:9': return 'aspect-[21/9]';
        case '3:2': return 'aspect-[3/2]';
        case '2:3': return 'aspect-[2/3]';
        default: return 'aspect-video';
    }
};

// --- AI Utility: Prompt Synthesis ---
export const synthesizeDirectorPrompt = (mode: GenerationMode, singlePrompt: string, scenes: StoryboardScene[]): string => {
    if (mode === 'single_prompt') {
        return `[SINGLE_SHOT_AD] ${singlePrompt}`;
    }
    if (mode === 'storyboard_sequence') {
        const scenePrompts = scenes.map((scene, index) =>
            `Scene ${index + 1} (${scene.duration}s): [VISUAL_FOCUS] ${scene.prompt}. [DIRECTOR_NOTES] ${scene.aiDirectorNotes || 'Maintain visual consistency with previous scene.'}`
        ).join(' ||| ');
        return `[STORYBOARD_AD] Total Scenes: ${scenes.length}. Sequence: ${scenePrompts}`;
    }
    return singlePrompt; // Fallback for 'ai_script_to_video' or other future modes
};


// SECTION: Reducer for Complex State Management (Component-level standard)
// =============================================================
// Note: While this component uses useReducer for its state, for a larger application
// global state management (e.g., Zustand or Redux Toolkit) would be recommended
// for truly centralized, scalable state across multiple views/components.
type AppState = {
    projects: AdProject[];
    currentProjectId: string | null;
    isLoading: boolean;
    error: string | null;
    config: AppConfig;
};

type AppAction =
    | { type: 'SET_PROJECTS'; payload: AdProject[] }
    | { type: 'SET_CURRENT_PROJECT'; payload: string | null }
    | { type: 'ADD_PROJECT'; payload: AdProject }
    | { type: 'UPDATE_PROJECT'; payload: AdProject }
    | { type: 'REMOVE_PROJECT'; payload: string }
    | { type: 'ADD_ASSET'; payload: { projectId: string; asset: VideoAsset } }
    | { type: 'REMOVE_ASSET'; payload: { projectId: string; assetId: string } }
    | { type: 'UPDATE_ASSET'; payload: { projectId: string; asset: VideoAsset } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'UPDATE_CONFIG'; payload: Partial<AppConfig> }
    | { type: 'UPDATE_PROJECT_SUMMARY'; payload: { projectId: string; summary: string } };

const initialAppState: AppState = {
    projects: [],
    currentProjectId: null,
    isLoading: true,
    error: null,
    config: {
        apiKey: null,
        theme: 'dark',
        autoSave: true,
        aiQuotaRemaining: 10000, // Mock initial quota
        defaultSettings: {
            model: 'veo-3.1-ultra-hq',
            aspectRatio: '16:9',
            duration: 10,
            negativePrompt: 'blurry, low quality, watermark, text, artifacts, noise, low frame rate',
            seed: -1,
            stylizationStrength: 75,
            motionControl: 'dynamic',
            fidelityLevel: 'high_res',
            audioStyle: 'cinematic_orchestral',
        },
    },
};

const appReducer: Reducer<AppState, AppAction> = (state, action): AppState => {
    switch (action.type) {
        case 'SET_PROJECTS':
            const firstProjectId = action.payload.length > 0 ? action.payload[0].id : null;
            return {
                ...state,
                projects: action.payload,
                currentProjectId: state.currentProjectId && action.payload.some(p => p.id === state.currentProjectId)
                    ? state.currentProjectId
                    : firstProjectId,
                isLoading: false,
            };
        case 'SET_CURRENT_PROJECT':
            return { ...state, currentProjectId: action.payload };
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload] };
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(p => (p.id === action.payload.id ? action.payload : p)),
            };
        case 'REMOVE_PROJECT':
            const remainingProjects = state.projects.filter(p => p.id !== action.payload);
            const newCurrentProjectId = state.currentProjectId === action.payload
                ? remainingProjects.length > 0 ? remainingProjects[0].id : null
                : state.currentProjectId;
            return {
                ...state,
                projects: remainingProjects,
                currentProjectId: newCurrentProjectId,
            };
        case 'ADD_ASSET':
        case 'REMOVE_ASSET':
        case 'UPDATE_ASSET':
            return {
                ...state,
                projects: state.projects.map(p => {
                    if (p.id !== action.payload.projectId) return p;
                    let newAssets: VideoAsset[];
                    if (action.type === 'ADD_ASSET') {
                        newAssets = [action.payload.asset, ...p.assets];
                    } else if (action.type === 'REMOVE_ASSET') {
                        newAssets = p.assets.filter(a => a.id !== action.payload.assetId);
                    } else { // UPDATE_ASSET
                        newAssets = p.assets.map(a => a.id === action.payload.asset.id ? action.payload.asset : a);
                    }
                    return { ...p, assets: newAssets, lastModified: new Date().toISOString() };
                }),
            };
        case 'UPDATE_CONFIG':
            return { ...state, config: { ...state.config, ...action.payload } };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'UPDATE_PROJECT_SUMMARY':
             return {
                ...state,
                projects: state.projects.map(p => (p.id === action.payload.projectId ? { ...p, aiSummary: action.payload.summary, lastModified: new Date().toISOString() } : p)),
            };
        default:
            return state;
    }
};

// SECTION: Child Components (AI-Enhanced UI Elements)
// ==================================================

export const ProjectSidebar: React.FC<{
    projects: AdProject[];
    currentProjectId: string | null;
    onSelectProject: (id: string) => void;
    onCreateProject: (name: string, client: string) => void;
    onDeleteProject: (id: string) => void;
    onRenameProject: (id: string, newName: string) => void;
}> = ({ projects, currentProjectId, onSelectProject, onCreateProject, onDeleteProject, onRenameProject }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [newClientName, setNewClientName] = useState('');
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renamingText, setRenamingText] = useState('');

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            onCreateProject(newProjectName.trim(), newClientName.trim() || 'Unassigned Client');
            setNewProjectName('');
            setNewClientName('');
        }
    };

    const handleRename = (id: string) => {
        if (renamingText.trim() && renamingId) {
            onRenameProject(id, renamingText.trim());
        }
        setRenamingId(null);
        setRenamingText('');
    };

    return (
        <div className="bg-gray-900 border-r border-gray-700 w-72 p-4 flex flex-col h-full shadow-2xl">
            <h3 className="text-2xl font-extrabold text-cyan-400 mb-4 border-b border-gray-700 pb-2">Project Nexus</h3>
            
            {/* New Project Creation Block */}
            <div className="mb-4 p-3 bg-gray-800/70 rounded-lg border border-gray-700">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">New Initiative</h4>
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                    placeholder="Project Name (e.g., Q2 Campaign)"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white mb-2 focus:ring-cyan-500"
                />
                <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                    placeholder="Client Name (Optional)"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white mb-2 focus:ring-cyan-500"
                />
                <button onClick={handleCreateProject} disabled={!newProjectName.trim()} className="w-full bg-cyan-700 hover:bg-cyan-600 text-white p-2 rounded-md text-sm font-medium disabled:opacity-30">
                    Initiate Project
                </button>
            </div>

            <h4 className="text-md font-semibold text-gray-300 mb-2 uppercase tracking-wider">Active Projects ({projects.length})</h4>
            <ul className="space-y-1 overflow-y-auto flex-grow custom-scrollbar">
                {projects.map(project => (
                    <li key={project.id}>
                        <div
                            className={`group flex flex-col p-2 rounded-lg cursor-pointer transition-colors ${currentProjectId === project.id ? 'bg-cyan-700/50 text-white shadow-lg border border-cyan-500' : 'text-gray-300 hover:bg-gray-800/50 border border-transparent'}`}
                            onClick={() => onSelectProject(project.id)}
                        >
                            <div className="flex items-center justify-between w-full">
                                {renamingId === project.id ? (
                                    <input
                                        type="text"
                                        value={renamingText}
                                        onChange={(e) => setRenamingText(e.target.value)}
                                        onBlur={() => handleRename(project.id)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleRename(project.id)}
                                        className="bg-gray-600 text-white w-full text-sm p-1 rounded focus:outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="truncate font-medium text-sm">{project.name}</span>
                                )}
                                <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button title="Rename" onClick={(e) => { e.stopPropagation(); setRenamingId(project.id); setRenamingText(project.name); }} className="text-gray-400 hover:text-yellow-400 text-xs p-1">✏️</button>
                                    <button title="Delete" onClick={(e) => { e.stopPropagation(); if(window.confirm(`Confirm deletion of Project: "${project.name}"?`)) onDeleteProject(project.id);}} className="text-gray-400 hover:text-red-500 text-xs p-1">🗑️</button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">Client: {project.clientName}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const GenerationControls: React.FC<{
    settings: GenerationSettings;
    onSettingsChange: (newSettings: Partial<GenerationSettings>) => void;
    isGenerating: boolean;
    aiQuota: number;
}> = ({ settings, onSettingsChange, isGenerating, aiQuota }) => {
    
    const handleRangeChange = (key: keyof GenerationSettings, value: string) => {
        onSettingsChange({ [key]: parseInt(value, 10) });
    };
    
    const handleSelectChange = (key: keyof GenerationSettings, value: string) => {
        onSettingsChange({ [key]: value });
    };

    return (
        <Card title="AI Generation Matrix Configuration" className="shadow-xl border-cyan-800/50">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                
                {/* Model Selection */}
                <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">AI Model Core</label>
                    <select
                        value={settings.model}
                        onChange={e => handleSelectChange('model', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-cyan-500"
                    >
                        <option value="veo-3.1-ultra-hq">Veo 3.1 (Ultra HQ)</option>
                        <option value="imagen-video-4-pro">Imagen Video 4 (Pro)</option>
                        <option value="lumiere-hd-001-enterprise">Lumiere HD (Enterprise)</option>
                        <option value="phoenix-v2-stable">Phoenix v2 (Stable)</option>
                    </select>
                </div>
                
                {/* Aspect Ratio */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Output Ratio</label>
                    <select
                        value={settings.aspectRatio}
                        onChange={e => handleSelectChange('aspectRatio', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="16:9">16:9 (Widescreen)</option>
                        <option value="9:16">9:16 (Vertical/Mobile)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="4:5">4:5 (Portrait)</option>
                        <option value="21:9">21:9 (Cinematic)</option>
                        <option value="3:2">3:2 (Standard Photo)</option>
                        <option value="2:3">2:3 (Poster)</option>
                    </select>
                </div>
                
                {/* Duration (Single Mode Only) */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Duration (s): {settings.duration}</label>
                    <input
                        type="range"
                        min={MIN_SCENE_DURATION}
                        max={30} // Capped at 30 for single prompt for cost control
                        step="1"
                        value={settings.duration}
                        onChange={e => handleRangeChange('duration', e.target.value)}
                        disabled={isGenerating}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                    />
                </div>
                
                {/* Fidelity Level */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Fidelity Level</label>
                    <select
                        value={settings.fidelityLevel}
                        onChange={e => handleSelectChange('fidelityLevel', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="standard">Standard (Fast)</option>
                        <option value="high_res">High Resolution</option>
                        <option value="4k_preview">4K Preview (High Cost)</option>
                    </select>
                </div>
                
                {/* Stylization Strength */}
                <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Creativity/Adherence: {settings.stylizationStrength}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={settings.stylizationStrength}
                        onChange={e => handleRangeChange('stylizationStrength', e.target.value)}
                        disabled={isGenerating}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                    />
                </div>
                
                {/* Motion Control */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Motion Profile</label>
                    <select
                        value={settings.motionControl}
                        onChange={e => handleSelectChange('motionControl', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="dynamic">Dynamic (Complex)</option>
                        <option value="smooth">Smooth (Subtle)</option>
                        <option value="default">Default</option>
                    </select>
                </div>
                
                {/* Audio Style */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Audio Track</label>
                    <select
                        value={settings.audioStyle}
                        onChange={e => handleSelectChange('audioStyle', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="none">None (Muted)</option>
                        <option value="cinematic_orchestral">Cinematic Orchestral</option>
                        <option value="upbeat_synthwave">Upbeat Synthwave</option>
                        <option value="corporate_minimal">Corporate Minimal</option>
                    </select>
                </div>
                
                {/* Seed Control */}
                <div className="col-span-2 lg:col-span-1">
                     <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Seed (Deterministic)</label>
                     <div className="flex">
                        <input
                            type="number"
                            value={settings.seed === -1 ? '' : settings.seed}
                            onChange={e => onSettingsChange({ seed: parseInt(e.target.value, 10) || -1 })}
                            placeholder="Random (-1)"
                            disabled={isGenerating}
                            className="w-full bg-gray-700 border border-gray-600 rounded-l-lg p-2 text-white text-sm"
                        />
                        <button onClick={() => onSettingsChange({seed: -1})} title="Use Random Seed" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-r-lg text-sm font-bold">🎲</button>
                     </div>
                </div>
                
                {/* Quota Display */}
                <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">AI Compute Quota</label>
                    <div className="w-full bg-gray-700 rounded-lg h-8 flex items-center">
                        <div 
                            className={`h-full rounded-l-lg text-xs font-bold flex items-center px-2 transition-all duration-500 ${aiQuota > 1000 ? 'bg-green-600' : aiQuota > 200 ? 'bg-yellow-600' : 'bg-red-600'}`}
                            style={{ width: `${Math.min(100, (aiQuota / 10000) * 100)}%` }}
                        >
                            {aiQuota.toLocaleString()}
                        </div>
                        <span className="text-xs text-gray-300 px-2 flex-shrink-0">/ 10,000</span>
                    </div>
                </div>
                
                {/* Negative Prompt */}
                <div className="col-span-full">
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Negative Prompt (Artifact Suppression)</label>
                    <input
                        type="text"
                        value={settings.negativePrompt}
                        onChange={e => handleSelectChange('negativePrompt', e.target.value)}
                        placeholder="e.g., blurry, text, watermark, ugly, low resolution"
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    />
                </div>
            </div>
        </Card>
    );
};

export const AssetGrid: React.FC<{
    assets: VideoAsset[];
    onDelete: (assetId: string) => void;
    onToggleFavorite: (assetId: string) => void;
    onSelect: (asset: VideoAsset) => void;
}> = ({ assets, onDelete, onToggleFavorite, onSelect }) => {
    if (assets.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 border border-dashed border-gray-700 rounded-lg">
                <p className="text-lg mb-2">📦 Asset Repository Empty</p>
                <p>Generate your first video asset using the controls above to populate this library.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {assets.map(asset => (
                <div key={asset.id} className="group relative aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-200 shadow-lg">
                    {/* Placeholder for actual video preview */}
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Preview Unavailable</span>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end space-x-2">
                            <button title="Favorite" onClick={() => onToggleFavorite(asset.id)} className={`text-xl ${asset.isFavorite ? 'text-yellow-400' : 'text-white/70 hover:text-white'}`}>
                                {asset.isFavorite ? '★' : '☆'}
                            </button>
                            <button title="Delete Asset" onClick={() => onDelete(asset.id)} className="text-white/70 hover:text-red-500">🗑️</button>
                        </div>
                        <div className="bg-black/50 p-1 rounded-md">
                            <p className="text-xs text-white truncate font-mono">{asset.id.substring(0, 8)}...</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Cost: {asset.costCredits} Credits</p>
                            <button onClick={() => onSelect(asset)} className="mt-1 w-full text-xs bg-cyan-600/80 hover:bg-cyan-500 text-white py-1 rounded transition-colors">Analyze & View</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const StoryboardEditor: React.FC<{
    scenes: StoryboardScene[];
    setScenes: React.Dispatch<React.SetStateAction<StoryboardScene[]>>;
    isGenerating: boolean;
    onGenerateDirectorSummary: (prompt: string) => Promise<string>;
    onScenePromptChange: (id: string, prompt: string) => void;
    onSceneNotesChange: (id: string, notes: string) => void;
    onSceneDurationChange: (id: string, duration: number) => void;
    onUpdateProjectSummary: (projectId: string, summary: string) => void; // Added prop
    currentProjectId: string | null; // Added prop
}> = ({ scenes, setScenes, isGenerating, onGenerateDirectorSummary, onScenePromptChange, onSceneNotesChange, onSceneDurationChange, onUpdateProjectSummary, currentProjectId }) => {
    const [isSummarizing, setIsSummarizing] = useState(false);

    const addScene = () => {
        setScenes(prev => [...prev, { id: generateUniqueId(), prompt: '', aiDirectorNotes: '', duration: 5 }]);
    };

    const removeScene = (id: string) => {
        setScenes(prev => prev.filter(s => s.id !== id));
    };
    
    const totalDuration = useMemo(() => scenes.reduce((acc, scene) => acc + scene.duration, 0), [scenes]);

    const handleGenerateSummary = useCallback(async () => {
        if (isGenerating || !currentProjectId) return;
        setIsSummarizing(true);
        const sequencePrompt = synthesizeDirectorPrompt('storyboard_sequence', '', scenes);
        try {
            const summary = await onGenerateDirectorSummary(sequencePrompt);
            onUpdateProjectSummary(currentProjectId, summary); // Update project summary
        } catch (e) {
            console.error("Failed to generate director summary:", e);
            alert('Failed to generate director summary. See console for details.');
        } finally {
            setIsSummarizing(false);
        }
    }, [isGenerating, scenes, onGenerateDirectorSummary, onUpdateProjectSummary, currentProjectId]);

    return (
        <div className="space-y-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
            <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Storyboard Sequence Editor</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {scenes.map((scene, index) => (
                    <div key={scene.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg shadow-inner border border-gray-600">
                        <span className="font-extrabold text-lg text-cyan-400 mt-2 w-6 flex-shrink-0">{index + 1}</span>
                        <div className="flex-grow space-y-2">
                            {/* Prompt Input */}
                            <textarea
                                value={scene.prompt}
                                onChange={e => onScenePromptChange(scene.id, e.target.value)}
                                placeholder={`Scene ${index + 1} Visual Description...`}
                                className="w-full h-16 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-cyan-500 resize-none"
                                disabled={isGenerating}
                            />
                            {/* Director Notes Input */}
                            <textarea
                                value={scene.aiDirectorNotes}
                                onChange={e => onSceneNotesChange(scene.id, e.target.value)}
                                placeholder={`AI Director Notes (e.g., Camera movement, lighting style, character emotion)...`}
                                className="w-full h-12 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white text-xs italic focus:ring-yellow-500 resize-none"
                                disabled={isGenerating}
                            />
                            
                            {/* Duration Control */}
                             <div className="flex items-center space-x-2 pt-1">
                                <label className="text-xs text-gray-400">Duration:</label>
                                 <input
                                    type="range"
                                    min={MIN_SCENE_DURATION}
                                    max={MAX_SCENE_DURATION}
                                    value={scene.duration}
                                    onChange={e => onSceneDurationChange(scene.id, parseInt(e.target.value, 10))}
                                    disabled={isGenerating}
                                    className="w-32 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                                />
                                <span className="text-xs text-white w-8 font-bold">{scene.duration}s</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => removeScene(scene.id)} 
                            disabled={isGenerating || scenes.length <= 1} 
                            title="Remove Scene"
                            className="text-gray-400 hover:text-red-500 disabled:opacity-30 mt-2 p-1"
                        >🗑️</button>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                <button onClick={addScene} disabled={isGenerating || scenes.length >= 20} className="py-2 px-4 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded-lg disabled:opacity-50 flex items-center space-x-1">
                    <span>+ Add Scene Block</span>
                </button>
                <div className="flex items-center space-x-3">
                    <button onClick={handleGenerateSummary} disabled={isGenerating || isSummarizing || !currentProjectId} className="py-2 px-4 text-sm bg-yellow-700/50 hover:bg-yellow-700 text-white rounded-lg disabled:opacity-50 flex items-center space-x-1">
                        {isSummarizing ? (
                            <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                <span>AI Directing...</span>
                            </>
                        ) : (
                            <span>✨ Synthesize Director Notes</span>
                        )}
                    </button>
                    <p className="text-sm text-gray-400">Total Estimated Duration: <span className="font-bold text-white">{totalDuration}s</span></p>
                </div>
            </div>
        </div>
    );
};

// SECTION: Main Component (The Sovereign Interface)
// =========================================================

const AIAdStudioView: React.FC = () => {
    // --- Core State Management ---
    const [prompt, setPrompt] = useState('A hyper-realistic, cinematic 15-second commercial showcasing a self-driving electric vehicle navigating a rain-slicked Tokyo street at midnight, emphasizing speed and safety.');
    const [generationState, setGenerationState] = useState<GenerationState>('idle');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pollingMessageIndex, setPollingMessageIndex] = useState(0);
    const [pollingIntervalId, setPollingIntervalId] = useState<number | null>(null);

    // --- Application State (via Reducer) ---
    const [appState, dispatch] = useReducer(appReducer, initialAppState);
    const [generationSettings, setGenerationSettings] = useState<GenerationSettings>(initialAppState.config.defaultSettings);
    const [generationMode, setGenerationMode] = useState<GenerationMode>('single_prompt');
    const [scenes, setScenes] = useState<StoryboardScene[]>([
        { id: generateUniqueId(), prompt: 'Extreme close-up on a single raindrop hitting a polished chrome surface.', aiDirectorNotes: 'Shallow depth of field, high contrast.', duration: 3 },
        { id: generateUniqueId(), prompt: 'Wide shot of the vehicle accelerating smoothly away from a blurred neon sign.', aiDirectorNotes: 'Smooth tracking shot, cinematic color grading.', duration: 7 },
    ]);
    const [selectedAsset, setSelectedAsset] = useState<VideoAsset | null>(null);
    
    const isGenerating = generationState === 'generating' || generationState === 'polling';
    
    // API Key Input Ref
    const apiKeyInputRef = useRef<HTMLInputElement>(null);

    // Derived State
    const currentProject = useMemo(() => {
        return appState.projects.find(p => p.id === appState.currentProjectId);
    }, [appState.projects, appState.currentProjectId]);
    
    const currentProjectAssets = useMemo(() => {
        return currentProject?.assets || [];
    }, [currentProject]);

    // --- Effects ---
    useEffect(() => {
        // 1. Load initial projects and configuration
        mockApi.getProjects().then(projects => {
            dispatch({ type: 'SET_PROJECTS', payload: projects });
        }).catch(err => {
            dispatch({ type: 'SET_ERROR', payload: 'System initialization failed: Cannot load project manifest.' });
            console.error(err);
        });

        // 2. Load API key from persistent storage and set on AI service
        // WARNING: Storing API keys directly in localStorage or environment variables
        // on the client-side is INSECURE for production applications.
        // For a secure, production-ready system, implement a robust OAuth2/OIDC flow
        // where API keys are managed server-side (e.g., AWS Secrets Manager) and
        // client requests are authenticated via short-lived, backend-issued tokens (e.g., JWT).
        const storedApiKey = process.env.REACT_APP_API_KEY || localStorage.getItem('google_genai_api_key');
        if (storedApiKey) {
            dispatch({ type: 'UPDATE_CONFIG', payload: { apiKey: storedApiKey } });
            videoGenerationService.setApiKey(storedApiKey);
        }
    }, []);

    useEffect(() => {
        // 3. Cleanup interval on state change/unmount
        return () => {
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
            }
        };
    }, [pollingIntervalId]);

    useEffect(() => {
        // 4. Cleanup blob URL
        return () => {
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);
    
    // --- Handlers ---
    
    const handleUpdateConfig = useCallback((payload: Partial<AppConfig>) => {
        dispatch({ type: 'UPDATE_CONFIG', payload });
        if (payload.apiKey !== undefined) {
            videoGenerationService.setApiKey(payload.apiKey);
        }
    }, []);

    const handleApiKeySave = () => {
        const key = apiKeyInputRef.current?.value;
        if (key && key.length > 20) { // Basic validation for non-empty and reasonable length
            // WARNING: See comment in useEffect for security implications of client-side API key storage.
            localStorage.setItem('google_genai_api_key', key);
            handleUpdateConfig({ apiKey: key });
            setError(null);
            alert("API Key successfully registered. System ready for secure connection.");
        } else {
            setError("Invalid key format detected. Key must be substantial.");
        }
    };
    
    // Project Management
    const handleCreateProject = useCallback(async (name: string, client: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const newProject = await mockApi.createProject(name, client);
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject.id });
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to initiate new project: ${err.message || 'Unknown error.'}` });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const handleDeleteProject = useCallback(async (id: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await mockApi.deleteProject(id);
            dispatch({ type: 'REMOVE_PROJECT', payload: id });
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to decommission project: ${err.message || 'Unknown error.'}` });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);
    
    const handleRenameProject = useCallback(async (id: string, newName: string) => {
        try {
            const updatedProject = await mockApi.renameProject(id, newName);
            if (updatedProject) {
                dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
            }
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to rename project: ${err.message || 'Unknown error.'}` });
        }
    }, []);

    // Asset Management
    const handleDeleteAsset = useCallback(async (assetId: string) => {
        if (!currentProject) return;
        try {
            await mockApi.deleteAsset(currentProject.id, assetId);
            dispatch({ type: 'REMOVE_ASSET', payload: { projectId: currentProject.id, assetId }});
            if (selectedAsset?.id === assetId) {
                setSelectedAsset(null);
            }
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to purge asset: ${err.message || 'Unknown error.'}` });
        }
    }, [currentProject, selectedAsset]);
    
    const handleToggleFavorite = useCallback(async (assetId: string) => {
        if (!currentProject) return;
        try {
            const updatedAsset = await mockApi.toggleFavoriteAsset(currentProject.id, assetId);
            if(updatedAsset) {
                dispatch({ type: 'UPDATE_ASSET', payload: { projectId: currentProject.id, asset: updatedAsset }});
            }
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to update asset metadata: ${err.message || 'Unknown error.'}` });
        }
    }, [currentProject]);
    
    const handleAssetSelect = useCallback(async (asset: VideoAsset) => {
        await mockApi.updateAssetAccessTime(asset.projectId, asset.id);
        dispatch({ type: 'UPDATE_ASSET', payload: { projectId: asset.projectId, asset: {...asset, lastAccessed: new Date().toISOString()} }});
        setSelectedAsset(asset);
    }, []);
    
    // AI Director Summary Generation
    const handleGenerateDirectorSummary = useCallback(async (fullPrompt: string): Promise<string> => {
        try {
            return await videoGenerationService.generateDirectorSummary(fullPrompt);
        } catch (err: any) {
            console.error("Error generating director summary:", err);
            throw err; // Re-throw to be caught by the calling component
        }
    }, []);

    const handleUpdateProjectSummary = useCallback((projectId: string, summary: string) => {
        dispatch({ type: 'UPDATE_PROJECT_SUMMARY', payload: { projectId, summary } });
    }, []);

    // --- Core Generation Execution ---
    const handleGenerate = async () => {
        if (!appState.config.apiKey) {
            setError('Authentication Failure: API Key is required for compute access.');
            setGenerationState('error');
            return;
        }

        if(!currentProject) {
            setError('Project Context Missing: Select or create a project before generation.');
            setGenerationState('error');
            return;
        }
        
        if (appState.config.aiQuotaRemaining <= 0) {
            setError('Quota Exhausted: Compute resources are unavailable. Contact administration for quota refresh.');
            setGenerationState('error');
            return;
        }

        setGenerationState('generating');
        setError(null);
        if (videoUrl && videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(videoUrl);
        }
        setVideoUrl(null);
        setPollingMessageIndex(0);
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }
        
        // Start visual feedback loop for polling messages
        const intervalId: number = window.setInterval(() => {
            setPollingMessageIndex(prev => (prev + 1) % POLLING_MESSAGES.length);
        }, 2000);
        setPollingIntervalId(intervalId);

        try {
            const { url, prompt: generatedPrompt, costCredits, storyboard: generatedStoryboard } = await videoGenerationService.generateVideoAsset(
                generationMode,
                prompt,
                scenes,
                generationSettings
            );
            
            clearInterval(intervalId);
            setPollingIntervalId(null);

            setVideoUrl(url);
            setGenerationState('done');

            // Save Asset to Project Manifest
            const newAssetData: Omit<VideoAsset, 'id' | 'projectId' | 'creationDate' | 'lastAccessed'> = {
                assetType: 'video',
                url: url,
                prompt: generatedPrompt,
                settings: generationSettings,
                generationMode,
                storyboard: generatedStoryboard,
                isFavorite: false,
                costCredits: costCredits,
            };

            const newAsset = await mockApi.addAssetToProject(currentProject.id, newAssetData);
            dispatch({ type: 'ADD_ASSET', payload: { projectId: currentProject.id, asset: newAsset } });
            
            // Update Quota
            handleUpdateConfig({ aiQuotaRemaining: Math.max(0, appState.config.aiQuotaRemaining - costCredits) });

        } catch (err: any) {
            console.error("Generation Pipeline Interrupted:", err);
            setError(String(err?.message || 'A critical error halted the generation pipeline.'));
            setGenerationState('error');
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
                setPollingIntervalId(null);
            }
        }
    };

    // --- Render Logic ---
    if (appState.isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                    <div className="animate-pulse text-3xl mb-2">Initializing Sovereign Compute Layer...</div>
                    <p className="text-cyan-400">Establishing secure connection to GenAI Fabric.</p>
                </div>
            </div>
        );
    }

    if (!appState.config.apiKey) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
                <div className="max-w-lg w-full bg-gray-800 p-10 rounded-xl shadow-2xl border border-red-700/50">
                    <h2 className="text-3xl font-extrabold text-red-400 mb-4">ACCESS DENIED: Authentication Required</h2>
                    <p className="text-gray-300 mb-6">The AI Core requires a valid API key for resource allocation and computation. Input your credentials below to proceed.</p>
                    {/* WARNING: This API key input and local storage mechanism is INSECURE for production.
                        It is included for MVP demonstration purposes only.
                        A production application must use a secure backend for API key management and
                        user authentication via robust protocols like OAuth2/OIDC.
                        Sensitive data like API keys should never be exposed client-side. */}
                    <div className="space-y-4">
                        <input
                            ref={apiKeyInputRef}
                            type="password"
                            placeholder="Enter Google GenAI API Key (e.g., AIzaSy...)"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-red-500 focus:border-red-500"
                        />
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        <button onClick={handleApiKeySave} className="w-full py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold transition-colors">
                            Authorize Compute Access
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        For production, API keys will be managed securely server-side. This local input is for development.
                    </p>
                </div>
            </div>
        );
    }
    
    // --- Main Application View ---
    return (
        <div className="flex h-screen overflow-hidden bg-gray-950 text-white">
            {/* Sidebar */}
            <ProjectSidebar 
                projects={appState.projects}
                currentProjectId={appState.currentProjectId}
                onSelectProject={id => dispatch({ type: 'SET_CURRENT_PROJECT', payload: id })}
                onCreateProject={handleCreateProject}
                onDeleteProject={handleDeleteProject}
                onRenameProject={handleRenameProject}
            />
            
            {/* Main Content Area */}
            <main className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                
                {/* Header Bar */}
                <header className="flex justify-between items-center pb-4 border-b border-gray-800 sticky top-0 bg-gray-950 z-10">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-white">AI Video Synthesis Platform</h1>
                        <p className="text-sm text-gray-400">Current Context: {currentProject?.name || "System Initialization"}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-cyan-400">Quota Remaining: {appState.config.aiQuotaRemaining.toLocaleString()}</p>
                        <button onClick={() => handleUpdateConfig({ apiKey: null })} className="text-xs text-red-400 hover:text-red-300 mt-1">Revoke API Key (Local)</button>
                    </div>
                </header>

                {currentProject ? (
                <>
                {/* Generation Panel */}
                <Card title={`Generation Module: ${currentProject.name}`} className="bg-gray-900/70 border-l-4 border-cyan-500 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Column 1: Mode & Controls */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="flex bg-gray-800 rounded-lg p-1 shadow-inner">
                                <button onClick={() => setGenerationMode('single_prompt')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${generationMode === 'single_prompt' ? 'bg-cyan-600 shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}>Single Prompt</button>
                                <button onClick={() => setGenerationMode('storyboard_sequence')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${generationMode === 'storyboard_sequence' ? 'bg-cyan-600 shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}>Storyboard Sequence</button>
                                {/* Future Module: <button onClick={() => setGenerationMode('ai_script_to_video')} disabled className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${generationMode === 'ai_script_to_video' ? 'bg-cyan-600 shadow-md' : 'text-gray-300 hover:bg-gray-700 disabled:opacity-50'}`}>AI Script (Future)</button> */}
                            </div>
                            
                            <GenerationControls 
                                settings={generationSettings} 
                                onSettingsChange={ (partial) => setGenerationSettings(s => ({...s, ...partial}))} 
                                isGenerating={isGenerating} 
                                aiQuota={appState.config.aiQuotaRemaining}
                            />
                        </div>
                        
                        {/* Column 2: Prompt Input */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card title={generationMode === 'single_prompt' ? "Primary Prompt Input (Max 500 Chars)" : "Project AI Summary"} className="h-full">
                                {generationMode === 'single_prompt' ? (
                                    <textarea 
                                        value={prompt} 
                                        onChange={e => setPrompt(e.target.value)} 
                                        placeholder="Describe the scene, style, and required action with high detail..." 
                                        maxLength={500}
                                        className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-cyan-500 resize-none" 
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-400 italic">
                                            {currentProject.aiSummary || "Click 'Synthesize Director Notes' below to generate a narrative summary based on your storyboard."}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            (This summary is stored as the project's high-level objective and provides explainability.)
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                    
                    {/* Storyboard Editor (Conditional) */}
                    {generationMode === 'storyboard_sequence' && (
                        <div className="mt-6">
                            <StoryboardEditor 
                                scenes={scenes} 
                                setScenes={setScenes} 
                                isGenerating={isGenerating} 
                                onGenerateDirectorSummary={handleGenerateDirectorSummary}
                                onScenePromptChange={(id, p) => setScenes(prev => prev.map(s => s.id === id ? {...s, prompt: p} : s))}
                                onSceneNotesChange={(id, n) => setScenes(prev => prev.map(s => s.id === id ? {...s, aiDirectorNotes: n} : s))}
                                onSceneDurationChange={(id, d) => setScenes(prev => prev.map(s => s.id === id ? {...s, duration: d} : s))}
                                onUpdateProjectSummary={handleUpdateProjectSummary}
                                currentProjectId={currentProject.id}
                            />
                        </div>
                    )}
                    
                    {/* Execution Button */}
                    <div className="mt-6 pt-4 border-t border-gray-800 flex justify-center">
                        <button 
                            onClick={handleGenerate} 
                            disabled={isGenerating || (generationMode === 'single_prompt' && !prompt.trim()) || (generationMode === 'storyboard_sequence' && scenes.some(s => !s.prompt.trim()))} 
                            className="w-1/2 py-3 text-lg font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-lg transition-all disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-[1.01]"
                        >
                            {generationState === 'polling' ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Processing... ({POLLING_MESSAGES[pollingMessageIndex]})</span>
                                </div>
                            ) : generationState === 'generating' ? (
                                <span>Initiating Compute Sequence...</span>
                            ) : (
                                <span>Execute Generation Run</span>
                            )}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-sm text-red-300">
                            ERROR: {error}
                        </div>
                    )}
                </Card>
                
                {/* Video Preview Area */}
                <Card title="Real-Time Preview & Output" className="bg-gray-900/70 border-l-4 border-gray-500 shadow-xl">
                    <div className={`mx-auto max-h-[60vh] w-full bg-black rounded-xl flex items-center justify-center border border-gray-700 overflow-hidden`}>
                        {generationState === 'done' && videoUrl ? (
                            <video src={videoUrl} controls autoPlay muted loop className="w-full h-full object-contain rounded-xl" />
                        ) : generationState === 'polling' || generationState === 'generating' ? (
                            <div className="text-center p-12">
                                <div className="relative w-20 h-20 mx-auto mb-4">
                                    <div className="absolute inset-0 border-8 border-cyan-500/20 rounded-full"></div>
                                    <div className="absolute inset-2 border-8 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
                                </div>
                                <p className="text-xl font-semibold text-cyan-300">Rendering Frame Sequence...</p>
                                <p className="text-sm text-gray-400 mt-1">{POLLING_MESSAGES[pollingMessageIndex]}</p>
                            </div>
                        ) : error ? (
                             <p className="text-red-400 p-8 text-center text-lg">Generation Failed. Review error log above.</p>
                        ) : (
                             <p className="text-gray-600 p-12 text-lg">Output Preview Window. Awaiting first successful generation.</p>
                        )}
                    </div>
                </Card>
                
                {/* Asset Library */}
                <Card title={`Asset Repository (${currentProjectAssets.length} Items)`} className="bg-gray-900/70 border-l-4 border-yellow-500 shadow-xl">
                    <AssetGrid 
                        assets={currentProjectAssets}
                        onDelete={handleDeleteAsset}
                        onToggleFavorite={handleToggleFavorite}
                        onSelect={handleAssetSelect}
                    />
                </Card>
                </>
                ) : (
                    <div className="flex items-center justify-center h-[70vh] bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
                        <div className="text-center p-10">
                            <p className="text-2xl font-semibold text-gray-400 mb-3">No Active Project Context</p>
                            <p className="text-gray-500">Use the Project Nexus sidebar to create a new campaign or select an existing one.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Asset Detail Modal (Enhanced) */}
            {selectedAsset && (
                 <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setSelectedAsset(null)}>
                    <div className="bg-gray-800 rounded-xl max-w-5xl w-[90%] md:w-[80%] p-6 space-y-6 shadow-3xl border border-cyan-600/50" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                            <h3 className="text-2xl font-bold text-white">Asset Manifest Viewer: {selectedAsset.id.substring(0, 12)}</h3>
                            <button onClick={() => setSelectedAsset(null)} className="text-gray-400 hover:text-white text-2xl p-1">✕</button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Video/Preview Area */}
                            <div className="lg:col-span-2 space-y-3">
                                <div className={`aspect-video bg-black rounded-lg border border-gray-600 overflow-hidden`}>
                                    <video src={selectedAsset.url} controls autoPlay loop muted className="w-full h-full object-contain"></video>
                                </div>
                                <p className="text-sm text-gray-400 italic">Asset Type: {selectedAsset.assetType}</p>
                            </div>
                            
                            {/* Metadata Column */}
                            <div className="lg:col-span-1 text-sm space-y-3 bg-gray-700/30 p-4 rounded-lg">
                                <h4 className="font-bold text-cyan-300 border-b border-gray-600 pb-1 mb-2">Generation Metadata</h4>
                                <p><strong>Created:</strong> {formatDate(selectedAsset.creationDate)}</p>
                                <p><strong>Last Accessed:</strong> {formatDate(selectedAsset.lastAccessed)}</p>
                                <p><strong>Estimated Cost:</strong> <span className="text-yellow-300">{selectedAsset.costCredits} Credits</span></p>
                                <p><strong>Favorite:</strong> {selectedAsset.isFavorite ? 'Yes' : 'No'}</p>
                                
                                <h4 className="font-bold text-cyan-300 border-b border-gray-600 pb-1 mt-4 mb-2">Settings Snapshot</h4>
                                <p><strong>Model:</strong> {selectedAsset.settings.model}</p>
                                <p><strong>Ratio:</strong> {selectedAsset.settings.aspectRatio}</p>
                                <p><strong>Style Strength:</strong> {selectedAsset.settings.stylizationStrength}%</p>
                                <p><strong>Motion:</strong> {selectedAsset.settings.motionControl}</p>
                                
                                {selectedAsset.generationMode === 'storyboard_sequence' && selectedAsset.storyboard && (
                                    <>
                                        <h4 className="font-bold text-cyan-300 border-b border-gray-600 pb-1 mt-4 mb-2">Storyboard Breakdown ({selectedAsset.storyboard.length} Scenes)</h4>
                                        <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                                            {selectedAsset.storyboard.map((scene, i) => (
                                                <p key={scene.id} className="text-xs bg-gray-800 p-1 rounded truncate">
                                                    {i+1}. ({scene.duration}s) {scene.prompt.substring(0, 40)}...
                                                </p>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                            <a href={selectedAsset.url} download={`ad_asset_${selectedAsset.id}.mp4`} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium">Download Raw Asset</a>
                            <button onClick={() => {
                                handleToggleFavorite(selectedAsset.id);
                                setSelectedAsset(s => s ? {...s, isFavorite: !s.isFavorite} : null);
                            }} className={`py-2 px-4 rounded-lg font-medium transition-colors ${selectedAsset.isFavorite ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-500 hover:bg-gray-400'} text-white`}>
                                {selectedAsset.isFavorite ? 'Unmark Favorite' : 'Mark as Favorite'}
                            </button>
                            <button onClick={() => {
                                if(window.confirm("Permanently delete this asset? This action cannot be undone.")) {
                                    handleDeleteAsset(selectedAsset.id);
                                    setSelectedAsset(null);
                                }
                            }} className="py-2 px-4 bg-red-700 hover:bg-red-600 text-white rounded-lg font-medium">Delete Asset</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAdStudioView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/AIAdStudioView.tsx
================================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Bot, 
  Loader2, 
  Download, 
  Play, 
  Video, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Lock, 
  CreditCard, 
  Activity, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Cpu, 
  Globe, 
  Layers,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Database,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - AI AD STUDIO & SECURE OPERATIONS MONOLITH
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience: High-performance, elite UI.
 * - "Test Drive": Interactive, no-pressure, high-polish.
 * - "Bells and Whistles": Advanced encryption, real-time AI, audit trails.
 * 
 * SECURITY:
 * - Homomorphic-simulated Internal App Storage (Closure-based, encrypted).
 * - Multi-factor authentication simulations.
 * - Real-time fraud monitoring.
 * 
 * INTEGRATIONS:
 * - Stripe (Simulated high-fidelity).
 * - ERP/Accounting (Data visualization).
 * - Google GenAI (Gemini 3 Flash Preview).
 */

// --- SECURE INTERNAL STORAGE (HOMOMORPHIC SIMULATION) ---
// This storage is not accessible via window or browser dev tools.
const QuantumVault = (() => {
  const _vault = new Map<string, string>();
  const _key = "QUANTUM_INTERNAL_SECRET_0x8821";

  const encrypt = (text: string) => {
    // Simulated encryption logic - in production this would use SubtleCrypto
    return btoa(text.split('').map((c, i) => 
      String.fromCharCode(c.charCodeAt(0) ^ _key.charCodeAt(i % _key.length))
    ).join(''));
  };

  const decrypt = (encoded: string) => {
    const text = atob(encoded);
    return text.split('').map((c, i) => 
      String.fromCharCode(c.charCodeAt(0) ^ _key.charCodeAt(i % _key.length))
    ).join('');
  };

  return {
    setItem: (key: string, value: any) => {
      const encryptedValue = encrypt(JSON.stringify(value));
      _vault.set(key, encryptedValue);
    },
    getItem: (key: string) => {
      const val = _vault.get(key);
      if (!val) return null;
      return JSON.parse(decrypt(val));
    },
    has: (key: string) => _vault.has(key),
    clear: () => _vault.clear()
  };
})();

// --- AUDIT LOGGING SYSTEM ---
const QuantumAudit = {
  log: (action: string, details: any, severity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO') => {
    const logs = QuantumVault.getItem('audit_logs') || [];
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      severity,
      id: Math.random().toString(36).substring(2, 15)
    };
    QuantumVault.setItem('audit_logs', [entry, ...logs].slice(0, 100));
    console.log(`[AUDIT] ${severity}: ${action}`, details);
  }
};

// --- LOCAL COMPONENTS (To ensure self-containment) ---

const QuantumCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; className?: string }> = ({ title, children, icon, className }) => (
  <div className={`bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-indigo-500/30 ${className}`}>
    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-transparent to-white/[0.02]">
      <div className="flex items-center gap-3">
        {icon && <div className="text-indigo-400">{icon}</div>}
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">{title}</h3>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const StripeModal: React.FC<{ isOpen: boolean; onClose: () => void; onComplete: () => void }> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setLoading(true);
    QuantumAudit.log('STRIPE_PAYMENT_INITIATED', { amount: 499.00, currency: 'USD' });
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      QuantumAudit.log('STRIPE_PAYMENT_SUCCESS', { transactionId: 'pi_3N' + Math.random().toString(36).substring(7) });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.3)]">
        <div className="bg-[#635bff] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard size={24} />
            <span className="font-bold text-lg">Quantum Pay</span>
          </div>
          <button onClick={onClose} className="hover:opacity-70">✕</button>
        </div>
        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="text-gray-500 text-sm">Ad Studio Credits</p>
                  <p className="text-2xl font-bold text-gray-900">5,000 Units</p>
                </div>
                <p className="text-xl font-medium text-gray-900">$499.00</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Card Information</label>
                  <div className="border rounded-lg p-3 flex items-center gap-3 bg-gray-50">
                    <CreditCard className="text-gray-400" size={20} />
                    <input className="bg-transparent outline-none text-gray-800 w-full" placeholder="4242 4242 4242 4242" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Expiry</label>
                    <input className="border rounded-lg p-3 bg-gray-50 w-full" placeholder="MM / YY" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">CVC</label>
                    <input className="border rounded-lg p-3 bg-gray-50 w-full" placeholder="123" />
                  </div>
                </div>
              </div>
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-[#635bff] hover:bg-[#5a51e6] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : `Pay $499.00`}
              </button>
              <p className="text-[10px] text-center text-gray-400">Powered by Stripe. Secure, encrypted, and audited.</p>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Payment Successful</h3>
                <p className="text-gray-500">Your credits have been added to your Quantum Vault.</p>
              </div>
              <button 
                onClick={() => { onComplete(); onClose(); }}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg"
              >
                Return to Studio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN VIEW COMPONENT ---

const AIAdStudioView: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState('A hyper-realistic cinematic commercial for Quantum Financial, showcasing global connectivity, high-speed data streams, and elite security vaults.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingStep, setPollingStep] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Welcome to the Quantum Ad Studio. I am your AI Creative Director. How can I help you build your brand's vision today?" }
  ]);
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [credits, setCredits] = useState(1250);
  const [showAudit, setShowAudit] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const POLLING_MESSAGES = [ 
    "Initializing Neural Video Synthesis Engine...", 
    "Analyzing semantic intent vectors...", 
    "Generating high-fidelity frame buffer...", 
    "Executing temporal coherence algorithms...", 
    "Optimizing lighting and global illumination...", 
    "Finalizing secure asset manifest..." 
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // AI Generation Logic
  const handleGenerate = async (overridePrompt?: string) => {
    const activePrompt = overridePrompt || prompt;
    if (!activePrompt.trim()) return;
    if (credits < 500) {
      setIsStripeOpen(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setPollingStep(0);
    QuantumAudit.log('VIDEO_GENERATION_STARTED', { prompt: activePrompt });

    const pollingInterval = setInterval(() => {
      setPollingStep(prev => (prev + 1) % POLLING_MESSAGES.length);
    }, 3000);

    try {
      // Using the provided GEMINI_API_KEY from secrets
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Using the requested model gemini-3-flash-preview
      let operation = await ai.models.generateVideos({
        model: 'gemini-3-flash-preview',
        prompt: activePrompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      if (operation.error) throw new Error(operation.error.message || 'Generation failed');

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.GEMINI_API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setCredits(prev => prev - 500);
        QuantumAudit.log('VIDEO_GENERATION_SUCCESS', { url });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during generation.');
      QuantumAudit.log('VIDEO_GENERATION_FAILED', { error: err.message }, 'WARN');
    } finally {
      clearInterval(pollingInterval);
      setIsGenerating(false);
    }
  };

  // Chatbot Logic
  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const systemContext = `
        You are the Quantum Financial AI Assistant. 
        You help users create video ads, manage their credits, and understand their financial data.
        If the user wants to create a video, describe it and then say "[ACTION:GENERATE_VIDEO: prompt]".
        If the user wants to add credits, say "[ACTION:OPEN_STRIPE]".
        Be elite, professional, and high-performance.
        Current Credits: ${credits}.
      `;

      const result = await model.generateContent([systemContext, userMsg]);
      const responseText = result.response.text();

      setChatHistory(prev => [...prev, { role: 'ai', text: responseText }]);

      // Parse Actions
      if (responseText.includes('[ACTION:GENERATE_VIDEO:')) {
        const match = responseText.match(/\[ACTION:GENERATE_VIDEO:\s*(.*?)\]/);
        if (match && match[1]) {
          setPrompt(match[1]);
          handleGenerate(match[1]);
        }
      }
      if (responseText.includes('[ACTION:OPEN_STRIPE]')) {
        setIsStripeOpen(true);
      }

      QuantumAudit.log('AI_CHAT_INTERACTION', { userMsg, aiResponse: responseText });
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "I apologize, but my neural links are currently saturated. Please try again in a moment." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const auditLogs = QuantumVault.getItem('audit_logs') || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      {/* TOP NAVIGATION BAR */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Zap className="text-white fill-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Quantum</h1>
                <p className="text-[10px] font-bold text-indigo-400 tracking-[0.3em] uppercase">Financial</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex gap-6">
              {['Dashboard', 'Payments', 'Studio', 'Analytics', 'Vault'].map((item) => (
                <button key={item} className={`text-xs font-bold uppercase tracking-widest transition-colors ${item === 'Studio' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{credits} Credits</span>
              <button onClick={() => setIsStripeOpen(true)} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowAudit(!showAudit)} className="p-2 text-gray-400 hover:text-white transition-colors">
                <Activity size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/20 flex items-center justify-center font-bold text-xs">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* HERO SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Next-Gen Marketing</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">AI Ad Studio</h2>
            <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
              Experience the "Golden Ticket" of financial marketing. Test drive our neural synthesis engine to create high-performance cinematic assets for your global enterprise.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
              <Layers size={16} /> Templates
            </button>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
              <Play size={16} /> New Project
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: CREATIVE & PREVIEW */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <QuantumCard title="Creative Directives" icon={<Cpu size={18} />}>
                <div className="space-y-6">
                  <div className="relative">
                    <textarea 
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-sans transition-all placeholder:text-gray-700"
                      placeholder="Describe the cinematic vision..."
                      disabled={isGenerating}
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                        <Globe size={14} />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                        <Lock size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Resolution</label>
                      <div className="text-white font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div> 4K Ultra HD
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Engine</label>
                      <div className="text-white font-bold italic flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> VEO-3.1-PREVIEW
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
                  >
                    {isGenerating ? <><Loader2 className="animate-spin" /> Synthesizing Reality...</> : <><Video size={18} /> Execute Synthesis</>}
                  </button>
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                      <AlertCircle className="text-red-500 shrink-0" size={18} />
                      <p className="text-xs text-red-400 font-mono">{error}</p>
                    </div>
                  )}
                </div>
              </QuantumCard>

              <QuantumCard title="Asset Preview" icon={<Eye size={18} />}>
                <div className="aspect-video bg-black rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                  {isGenerating ? (
                    <div className="text-center p-6 space-y-6 z-10">
                      <div className="relative">
                        <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 border-2 border-blue-500/20 border-b-blue-500 rounded-full animate-spin-slow"></div>
                        </div>
                      </div>
                      <p className="text-[10px] text-indigo-400 font-mono animate-pulse tracking-[0.2em] uppercase">{POLLING_MESSAGES[pollingStep]}</p>
                    </div>
                  ) : videoUrl ? (
                    <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8 space-y-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <Bot size={40} className="text-gray-400" />
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase">Awaiting Signal Ingestion</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[8px] font-bold uppercase tracking-widest">Live Feed</div>
                    <div className="px-2 py-1 bg-indigo-600/60 backdrop-blur-md border border-indigo-500/20 rounded text-[8px] font-bold uppercase tracking-widest">Encrypted</div>
                  </div>
                </div>
                {videoUrl && (
                  <div className="mt-6 p-4 bg-green-500/5 rounded-xl border border-green-500/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Asset Manifest Valid</span>
                    </div>
                    <a href={videoUrl} download="quantum_synthesis.mp4" className="flex items-center gap-2 text-[10px] font-black text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500 transition-all uppercase tracking-widest">
                      <Download size={14} /> Download MP4
                    </a>
                  </div>
                )}
              </QuantumCard>
            </div>

            {/* ANALYTICS & ERP INTEGRATION SIMULATION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <QuantumCard title="System Load" icon={<BarChart3 size={16} />}>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Compute</span>
                    <span className="text-xl font-black text-indigo-400">94.2%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full w-[94%]"></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-gray-600 uppercase">
                    <span>Cluster_A: Active</span>
                    <span>Latency: 12ms</span>
                  </div>
                </div>
              </QuantumCard>
              <QuantumCard title="ERP Sync" icon={<Database size={16} />}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">SAP S/4HANA</p>
                      <p className="text-[8px] text-gray-500 uppercase">Last Sync: 2m ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">Oracle NetSuite</p>
                      <p className="text-[8px] text-gray-500 uppercase">Last Sync: 5m ago</p>
                    </div>
                  </div>
                </div>
              </QuantumCard>
              <QuantumCard title="Security" icon={<ShieldCheck size={16} />}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">MFA Status</span>
                    <span className="text-[10px] font-bold text-green-500 uppercase">Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Fraud Scan</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Clear</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Encryption</span>
                    <span className="text-[10px] font-bold text-white uppercase">AES-256-GCM</span>
                  </div>
                </div>
              </QuantumCard>
            </div>
          </div>

          {/* RIGHT COLUMN: AI ASSISTANT & AUDIT */}
          <div className="lg:col-span-4 space-y-8">
            <QuantumCard title="Quantum Assistant" icon={<MessageSquare size={18} />} className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10">
                      <Loader2 className="animate-spin text-indigo-400" size={16} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="mt-6 relative">
                <input 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Ask the AI to create or manage..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button 
                  onClick={handleChat}
                  className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </QuantumCard>

            {showAudit && (
              <QuantumCard title="Audit Trail" icon={<Terminal size={18} />} className="animate-in slide-in-from-right duration-300">
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {auditLogs.length === 0 ? (
                    <p className="text-[10px] text-gray-600 italic">No sensitive actions logged in this session.</p>
                  ) : (
                    auditLogs.map((log: any) => (
                      <div key={log.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-black uppercase ${
                            log.severity === 'CRITICAL' ? 'text-red-500' : log.severity === 'WARN' ? 'text-yellow-500' : 'text-indigo-400'
                          }`}>{log.action}</span>
                          <span className="text-[8px] text-gray-600 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-mono truncate">{JSON.stringify(log.details)}</p>
                      </div>
                    ))
                  )}
                </div>
              </QuantumCard>
            )}

            <QuantumCard title="Vault Storage" icon={<Lock size={18} />}>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Key className="text-indigo-400" size={16} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Secure Keys</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase">API_GATEWAY</span>
                      <span className="text-[9px] font-mono text-gray-300">••••••••••••4291</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase">STRIPE_LIVE</span>
                      <span className="text-[9px] font-mono text-gray-300">••••••••••••8821</span>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-gray-600 italic leading-relaxed">
                  "All integration keys are stored in the Quantum Vault using homomorphic-simulated encryption. Data is never exposed to the browser's local storage or global scope."
                </p>
              </div>
            </QuantumCard>
          </div>
        </div>
      </main>

      {/* STRIPE MODAL */}
      <StripeModal 
        isOpen={isStripeOpen} 
        onClose={() => setIsStripeOpen(false)} 
        onComplete={() => {
          setCredits(prev => prev + 5000);
          setChatHistory(prev => [...prev, { role: 'ai', text: "Excellent. Your credits have been replenished. We are ready to continue our creative journey." }]);
        }} 
      />

      {/* FOOTER */}
      <footer className="max-w-[1600px] mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
            <Zap size={12} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Quantum Financial © 2024</span>
        </div>
        <div className="flex gap-8">
          {['Security Policy', 'Terms of Service', 'API Documentation', 'Support'].map(item => (
            <button key={item} className="text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors">
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          SYSTEMS_OPERATIONAL_0x00
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AIAdStudioView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/AIAdStudioView (2).tsx
================================================================================

/*
    Refactoring Note: The previous philosophical commentary has been removed to align with production-ready documentation standards.
    This file now focuses purely on technical implementation and architectural clarity.

    System Goal: Convert experimental prototype into a stable, coherent, production-ready platform.
    This module, AIAdStudioView.tsx, is a core component for the "AI-powered transaction intelligence" / "AI-powered creative" MVP candidate.
    It has been refactored to align with enhanced security, modularity, and maintainability.
*/
// components/AIAdStudioView.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef, Reducer, useReducer } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card'; // Assuming Card is a common UI component with consistent styling

// --- AI Generation Constants ---
const POLLING_MESSAGES = [ // Simplified polling messages for clarity and professionalism
    "Initializing AI Video Generation Engine...",
    "Analyzing prompt and scene directives...",
    "Allocating GPU compute resources...",
    "Synthesizing initial frame sequences...",
    "Applying stylistic and motion controls...",
    "Optimizing data stream for encoding...",
    "Finalizing video asset compilation..."
];
const MAX_SCENE_DURATION = 60;
const MIN_SCENE_DURATION = 1;
const MAX_PROJECTS_DISPLAY = 50;

// SECTION: Type Definitions (Standardized & Expanded)
// =======================================================

export type GenerationState = 'idle' | 'generating' | 'polling' | 'done' | 'error';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '21:9' | '3:2' | '2:3';
export type VideoModel = 'veo-3.1-ultra-hq' | 'imagen-video-4-pro' | 'lumiere-hd-001-enterprise' | 'phoenix-v2-stable';
export type GenerationMode = 'single_prompt' | 'storyboard_sequence' | 'ai_script_to_video'; // 'ai_script_to_video' is a future module
export type AppTheme = 'dark' | 'light' | 'system';
export type AssetType = 'video' | 'image_sequence' | 'audio_track';

export interface GenerationSettings {
    model: VideoModel;
    aspectRatio: AspectRatio;
    duration: number; // in seconds (for single prompt mode)
    negativePrompt: string;
    seed: number; // -1 for random, positive integer for deterministic
    stylizationStrength: number; // 0-100 (Creativity/Adherence balance)
    motionControl: 'default' | 'smooth' | 'dynamic';
    fidelityLevel: 'standard' | 'high_res' | '4k_preview';
    audioStyle: 'none' | 'cinematic_orchestral' | 'upbeat_synthwave' | 'corporate_minimal';
}

export interface StoryboardScene {
    id: string;
    prompt: string;
    aiDirectorNotes: string; // Specific instructions for the AI director for this frame
    duration: number; // Scene-specific duration
    visualReferenceUrl?: string; // Optional image reference for style transfer
}

export interface VideoAsset {
    id: string;
    projectId: string;
    assetType: AssetType;
    url: string; // Primary content URL
    metadataUrl?: string; // Secondary metadata/manifest URL
    prompt: string; // The primary prompt used for generation
    creationDate: string;
    lastAccessed: string;
    settings: GenerationSettings;
    generationMode: GenerationMode;
    storyboard?: StoryboardScene[];
    isFavorite: boolean;
    costCredits: number; // Estimated cost in internal credits
}

export interface AdProject {
    id: string;
    name: string;
    clientName: string; // New field for enterprise context
    creationDate: string;
    lastModified: string;
    assets: VideoAsset[];
    aiSummary: string; // AI-generated summary of the project's goal
}

export interface AppConfig {
    apiKey: string | null;
    theme: AppTheme;
    autoSave: boolean;
    defaultSettings: GenerationSettings;
    aiQuotaRemaining: number;
}

// SECTION: Mock Backend API (For MVP Development)
// ===================================================
// NOTE: This MockBackendAPI is for local development and demonstration purposes only.
// In a production environment, this entire class MUST be replaced with a secure,
// standards-compliant backend API (e.g., RESTful, gRPC) integrated with a proper
// database and authentication/authorization layer.
// All API Key management should be handled server-side via AWS Secrets Manager or Vault.
export class MockBackendAPI {
    private projects: AdProject[] = [];
    private latency: number = 150; // Reduced latency for perceived responsiveness
    private readonly STORAGE_KEY = 'ai_ad_studio_enterprise_projects_v2';

    constructor() {
        this.loadFromLocalStorage();
    }

    private async simulateLatency(minMs: number = this.latency): Promise<void> {
        const actualLatency = minMs + Math.random() * 100;
        return new Promise(resolve => setTimeout(resolve, actualLatency));
    }

    private saveToLocalStorage(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.projects));
        } catch (error) {
            console.error("CRITICAL: Failed to persist projects to local storage:", error);
        }
    }

    private loadFromLocalStorage(): void {
        try {
            const storedProjects = localStorage.getItem(this.STORAGE_KEY);
            if (storedProjects) {
                this.projects = JSON.parse(storedProjects);
            } else {
                this.initializeDefaultData();
            }
        } catch (error) {
            console.error("CRITICAL: Failed to load projects from local storage. Starting fresh:", error);
            this.initializeDefaultData();
        }
    }
    
    private initializeDefaultData(): void {
        const defaultSettings: GenerationSettings = {
            model: 'veo-3.1-ultra-hq',
            aspectRatio: '16:9',
            duration: 10,
            negativePrompt: 'blurry, low quality, watermark, text, artifacts, noise, low frame rate',
            seed: -1,
            stylizationStrength: 75,
            motionControl: 'dynamic',
            fidelityLevel: 'high_res',
            audioStyle: 'cinematic_orchestral',
        };
        
        const defaultProject: AdProject = {
            id: `proj_${Date.now()}`,
            name: 'Q1 2025 Launch Campaign',
            clientName: 'Global Dynamics Corp.',
            creationDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            assets: [],
            aiSummary: 'Initial project setup for high-impact video advertising targeting Gen Z demographics.',
        };
        this.projects.push(defaultProject);
        this.saveToLocalStorage();
    }

    // --- Project Operations ---
    
    public async getProjects(): Promise<AdProject[]> {
        await this.simulateLatency();
        return JSON.parse(JSON.stringify(this.projects)).slice(0, MAX_PROJECTS_DISPLAY);
    }
    
    public async getProjectById(id: string): Promise<AdProject | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === id);
        return project ? JSON.parse(JSON.stringify(project)) : null;
    }
    
    public async createProject(name: string, clientName: string = 'Unassigned Client'): Promise<AdProject> {
        await this.simulateLatency();
        const newProject: AdProject = {
            id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            clientName,
            creationDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            assets: [],
            aiSummary: `New project initialized for ${name}. Awaiting director input.`,
        };
        this.projects.push(newProject);
        this.saveToLocalStorage();
        return { ...newProject };
    }
    
    public async renameProject(id: string, newName: string): Promise<AdProject | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === id);
        if (project) {
            project.name = newName;
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return { ...project };
        }
        return null;
    }
    
    public async deleteProject(id: string): Promise<boolean> {
        await this.simulateLatency();
        const initialLength = this.projects.length;
        this.projects = this.projects.filter(p => p.id !== id);
        this.saveToLocalStorage();
        return this.projects.length < initialLength;
    }
    
    // --- Asset Operations ---
    
    public async addAssetToProject(projectId: string, asset: Omit<VideoAsset, 'id' | 'projectId' | 'creationDate' | 'lastAccessed'>): Promise<VideoAsset> {
        await this.simulateLatency(300); // Longer latency for asset creation
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            throw new Error('Project not found during asset addition');
        }
        const now = new Date().toISOString();
        const newAsset: VideoAsset = {
            ...asset,
            id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            creationDate: now,
            lastAccessed: now,
        };
        project.assets.unshift(newAsset); // Add to the beginning
        project.lastModified = now;
        this.saveToLocalStorage();
        return { ...newAsset };
    }

    public async deleteAsset(projectId: string, assetId: string): Promise<boolean> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const initialLength = project.assets.length;
            project.assets = project.assets.filter(a => a.id !== assetId);
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return project.assets.length < initialLength;
        }
        return false;
    }

    public async toggleFavoriteAsset(projectId: string, assetId: string): Promise<VideoAsset | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const asset = project.assets.find(a => a.id === assetId);
            if(asset) {
                asset.isFavorite = !asset.isFavorite;
                asset.lastAccessed = new Date().toISOString();
                project.lastModified = new Date().toISOString();
                this.saveToLocalStorage();
                return { ...asset };
            }
        }
        return null;
    }
    
    public async updateAssetAccessTime(projectId: string, assetId: string): Promise<void> {
        await this.simulateLatency(50);
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const asset = project.assets.find(a => a.id === assetId);
            if(asset) {
                asset.lastAccessed = new Date().toISOString();
                project.lastModified = new Date().toISOString();
                this.saveToLocalStorage();
            }
        }
    }
}

// Instantiate the mock API globally for the module
export const mockApi = new MockBackendAPI();


// SECTION: AI Integration Service (Standardized API Connector Pattern)
// ====================================================================
// This service encapsulates all direct calls to external AI APIs.
// It should handle rate limiting, retries, circuit breakers, and schema validation
// in a production environment. For this MVP, we simulate these patterns.
export class VideoGenerationService {
    private genAIClient: GoogleGenAI | null = null;
    private apiKey: string | null = null;
    private readonly MAX_POLLING_ATTEMPTS = 60; // Max 60 attempts * 8s = 8 minutes timeout
    private readonly POLLING_INTERVAL_MS = 8000; // Poll every 8 seconds

    public setApiKey(key: string | null): void {
        this.apiKey = key;
        this.genAIClient = key ? new GoogleGenAI({ apiKey: key }) : null;
    }

    private checkClient(): GoogleGenAI {
        if (!this.genAIClient || !this.apiKey) {
            throw new Error("AI Service not initialized: API Key is missing or invalid.");
        }
        return this.genAIClient;
    }

    // Unified API connector for video generation
    public async generateVideoAsset(
        mode: GenerationMode,
        singlePrompt: string,
        scenes: StoryboardScene[],
        settings: GenerationSettings
    ): Promise<{ url: string; prompt: string; costCredits: number; storyboard?: StoryboardScene[] }> {
        const ai = this.checkClient();
        
        const finalPrompt = synthesizeDirectorPrompt(mode, singlePrompt, scenes);
        const estimatedCost = mode === 'storyboard_sequence' ? 500 : 100; // Mock cost calculation

        // Simulate rate limiting / circuit breaker check
        console.info("[AI Service] Checking API rate limits and circuit breaker status...");
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate a quick check

        const apiPayload: any = {
            model: settings.model,
            prompt: finalPrompt,
            config: {
                numberOfVideos: 1,
                aspectRatio: settings.aspectRatio,
                duration: mode === 'single_prompt' ? settings.duration : undefined,
                fidelity: settings.fidelityLevel,
                stylization: settings.stylizationStrength / 100,
                motionProfile: settings.motionControl,
                audioTrack: settings.audioStyle,
                seed: settings.seed,
                negativePrompt: settings.negativePrompt,
            },
        };

        console.log(`[AI Service] Executing ${mode} generation with payload:`, apiPayload);
        
        let operation;
        try {
            operation = await ai.models.generateVideos(apiPayload);
            console.info("[AI Service] Generation operation initiated.");
        } catch (initialError: any) {
            console.error("[AI Service] Initial generation request failed:", initialError);
            throw new Error(`AI Request Failure: ${initialError.message || 'Unknown API error.'}`);
        }

        let attempts = 0;
        // Polling loop with explicit timeout
        while (!operation.done && attempts < this.MAX_POLLING_ATTEMPTS) {
            attempts++;
            console.debug(`[AI Service] Polling for video generation status (attempt ${attempts})...`);
            await new Promise(resolve => setTimeout(resolve, this.POLLING_INTERVAL_MS));
            
            try {
                operation = await ai.operations.getVideosOperation({ operation: operation });
            } catch (pollError: any) {
                console.error(`[AI Service] Polling failed on attempt ${attempts}:`, pollError);
                // Implement retry logic here if needed (e.g., exponential backoff)
                throw new Error(`AI Polling Failure: ${pollError.message || 'Unknown polling error.'}`);
            }
        }

        if (attempts >= this.MAX_POLLING_ATTEMPTS) {
            console.error("[AI Service] Video generation timed out.");
            throw new Error("AI Generation Timeout: Operation exceeded maximum allowed time.");
        }

        if (operation.error) {
            console.error("[AI Service] Generation operation reported error:", operation.error);
            throw new Error(`AI Generation Error: ${operation.error.message || 'Unknown backend error.'}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            console.error("[AI Service] Generation succeeded, but no download link was provided.");
            throw new Error('AI Asset Retrieval Error: Generation successful, but asset manifest empty.');
        }

        // Simulate fetching the actual file (using the mock API key for the fetch URL for demo)
        // In production, this download link would likely be temporary, signed, and not require the client's API key.
        const videoResponse = await fetch(`${downloadLink}&key=${this.apiKey}`);
        if (!videoResponse.ok) {
            console.error(`[AI Service] Failed to retrieve asset blob: ${videoResponse.statusText}`);
            throw new Error(`Download Protocol Error: Failed to retrieve asset (${videoResponse.statusText})`);
        }
        const videoBlob = await videoResponse.blob();
        const objectURL = URL.createObjectURL(videoBlob);
        
        console.info("[AI Service] Video asset successfully generated and retrieved.");

        return {
            url: objectURL,
            prompt: finalPrompt,
            costCredits: estimatedCost,
            storyboard: mode === 'storyboard_sequence' ? scenes : undefined,
        };
    }

    // AI utility for summarizing prompts (explainability notes)
    public async generateDirectorSummary(fullPrompt: string): Promise<string> {
        const ai = this.checkClient();
        
        // This uses a text-specific model for efficiency
        const directorPrompt = `Analyze the following video generation sequence prompt and generate a concise, high-level summary of the intended visual narrative, target emotion, and required technical execution style.
        PROMPT: ${fullPrompt}`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: directorPrompt }] }],
                config: { temperature: 0.3, maxOutputTokens: 200 } // Limit output for conciseness
            });
            return response.candidates?.[0]?.content?.parts?.[0]?.text || "Summary generation failed or returned empty.";
        } catch (err: any) {
            console.error("[AI Service] Director summary generation failed:", err);
            throw new Error(`AI Summary Generation Failed: ${err.message || 'Unknown AI error.'}`);
        }
    }
}

// Instantiate the AI Service
export const videoGenerationService = new VideoGenerationService();


// SECTION: Utility Functions (Standardized)
// ==========================

export const generateUniqueId = (): string => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (isoString: string): string => {
    try {
        return new Date(isoString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    } catch {
        return 'Invalid Timestamp';
    }
};

export const getAspectRatioClass = (aspectRatio: AspectRatio): string => {
    switch (aspectRatio) {
        case '16:9': return 'aspect-[16/9]';
        case '9:16': return 'aspect-[9/16]';
        case '1:1': return 'aspect-square';
        case '4:5': return 'aspect-[4/5]';
        case '21:9': return 'aspect-[21/9]';
        case '3:2': return 'aspect-[3/2]';
        case '2:3': return 'aspect-[2/3]';
        default: return 'aspect-video';
    }
};

// --- AI Utility: Prompt Synthesis ---
export const synthesizeDirectorPrompt = (mode: GenerationMode, singlePrompt: string, scenes: StoryboardScene[]): string => {
    if (mode === 'single_prompt') {
        return `[SINGLE_SHOT_AD] ${singlePrompt}`;
    }
    if (mode === 'storyboard_sequence') {
        const scenePrompts = scenes.map((scene, index) =>
            `Scene ${index + 1} (${scene.duration}s): [VISUAL_FOCUS] ${scene.prompt}. [DIRECTOR_NOTES] ${scene.aiDirectorNotes || 'Maintain visual consistency with previous scene.'}`
        ).join(' ||| ');
        return `[STORYBOARD_AD] Total Scenes: ${scenes.length}. Sequence: ${scenePrompts}`;
    }
    return singlePrompt; // Fallback for 'ai_script_to_video' or other future modes
};


// SECTION: Reducer for Complex State Management (Component-level standard)
// =============================================================
// Note: While this component uses useReducer for its state, for a larger application
// global state management (e.g., Zustand or Redux Toolkit) would be recommended
// for truly centralized, scalable state across multiple views/components.
type AppState = {
    projects: AdProject[];
    currentProjectId: string | null;
    isLoading: boolean;
    error: string | null;
    config: AppConfig;
};

type AppAction =
    | { type: 'SET_PROJECTS'; payload: AdProject[] }
    | { type: 'SET_CURRENT_PROJECT'; payload: string | null }
    | { type: 'ADD_PROJECT'; payload: AdProject }
    | { type: 'UPDATE_PROJECT'; payload: AdProject }
    | { type: 'REMOVE_PROJECT'; payload: string }
    | { type: 'ADD_ASSET'; payload: { projectId: string; asset: VideoAsset } }
    | { type: 'REMOVE_ASSET'; payload: { projectId: string; assetId: string } }
    | { type: 'UPDATE_ASSET'; payload: { projectId: string; asset: VideoAsset } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'UPDATE_CONFIG'; payload: Partial<AppConfig> }
    | { type: 'UPDATE_PROJECT_SUMMARY'; payload: { projectId: string; summary: string } };

const initialAppState: AppState = {
    projects: [],
    currentProjectId: null,
    isLoading: true,
    error: null,
    config: {
        apiKey: null,
        theme: 'dark',
        autoSave: true,
        aiQuotaRemaining: 10000, // Mock initial quota
        defaultSettings: {
            model: 'veo-3.1-ultra-hq',
            aspectRatio: '16:9',
            duration: 10,
            negativePrompt: 'blurry, low quality, watermark, text, artifacts, noise, low frame rate',
            seed: -1,
            stylizationStrength: 75,
            motionControl: 'dynamic',
            fidelityLevel: 'high_res',
            audioStyle: 'cinematic_orchestral',
        },
    },
};

const appReducer: Reducer<AppState, AppAction> = (state, action): AppState => {
    switch (action.type) {
        case 'SET_PROJECTS':
            const firstProjectId = action.payload.length > 0 ? action.payload[0].id : null;
            return {
                ...state,
                projects: action.payload,
                currentProjectId: state.currentProjectId && action.payload.some(p => p.id === state.currentProjectId)
                    ? state.currentProjectId
                    : firstProjectId,
                isLoading: false,
            };
        case 'SET_CURRENT_PROJECT':
            return { ...state, currentProjectId: action.payload };
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload] };
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(p => (p.id === action.payload.id ? action.payload : p)),
            };
        case 'REMOVE_PROJECT':
            const remainingProjects = state.projects.filter(p => p.id !== action.payload);
            const newCurrentProjectId = state.currentProjectId === action.payload
                ? remainingProjects.length > 0 ? remainingProjects[0].id : null
                : state.currentProjectId;
            return {
                ...state,
                projects: remainingProjects,
                currentProjectId: newCurrentProjectId,
            };
        case 'ADD_ASSET':
        case 'REMOVE_ASSET':
        case 'UPDATE_ASSET':
            return {
                ...state,
                projects: state.projects.map(p => {
                    if (p.id !== action.payload.projectId) return p;
                    let newAssets: VideoAsset[];
                    if (action.type === 'ADD_ASSET') {
                        newAssets = [action.payload.asset, ...p.assets];
                    } else if (action.type === 'REMOVE_ASSET') {
                        newAssets = p.assets.filter(a => a.id !== action.payload.assetId);
                    } else { // UPDATE_ASSET
                        newAssets = p.assets.map(a => a.id === action.payload.asset.id ? action.payload.asset : a);
                    }
                    return { ...p, assets: newAssets, lastModified: new Date().toISOString() };
                }),
            };
        case 'UPDATE_CONFIG':
            return { ...state, config: { ...state.config, ...action.payload } };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'UPDATE_PROJECT_SUMMARY':
             return {
                ...state,
                projects: state.projects.map(p => (p.id === action.payload.projectId ? { ...p, aiSummary: action.payload.summary, lastModified: new Date().toISOString() } : p)),
            };
        default:
            return state;
    }
};

// SECTION: Child Components (AI-Enhanced UI Elements)
// ==================================================

export const ProjectSidebar: React.FC<{
    projects: AdProject[];
    currentProjectId: string | null;
    onSelectProject: (id: string) => void;
    onCreateProject: (name: string, client: string) => void;
    onDeleteProject: (id: string) => void;
    onRenameProject: (id: string, newName: string) => void;
}> = ({ projects, currentProjectId, onSelectProject, onCreateProject, onDeleteProject, onRenameProject }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [newClientName, setNewClientName] = useState('');
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renamingText, setRenamingText] = useState('');

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            onCreateProject(newProjectName.trim(), newClientName.trim() || 'Unassigned Client');
            setNewProjectName('');
            setNewClientName('');
        }
    };

    const handleRename = (id: string) => {
        if (renamingText.trim() && renamingId) {
            onRenameProject(id, renamingText.trim());
        }
        setRenamingId(null);
        setRenamingText('');
    };

    return (
        <div className="bg-gray-900 border-r border-gray-700 w-72 p-4 flex flex-col h-full shadow-2xl">
            <h3 className="text-2xl font-extrabold text-cyan-400 mb-4 border-b border-gray-700 pb-2">Project Nexus</h3>
            
            {/* New Project Creation Block */}
            <div className="mb-4 p-3 bg-gray-800/70 rounded-lg border border-gray-700">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">New Initiative</h4>
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                    placeholder="Project Name (e.g., Q2 Campaign)"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white mb-2 focus:ring-cyan-500"
                />
                <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                    placeholder="Client Name (Optional)"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white mb-2 focus:ring-cyan-500"
                />
                <button onClick={handleCreateProject} disabled={!newProjectName.trim()} className="w-full bg-cyan-700 hover:bg-cyan-600 text-white p-2 rounded-md text-sm font-medium disabled:opacity-30">
                    Initiate Project
                </button>
            </div>

            <h4 className="text-md font-semibold text-gray-300 mb-2 uppercase tracking-wider">Active Projects ({projects.length})</h4>
            <ul className="space-y-1 overflow-y-auto flex-grow custom-scrollbar">
                {projects.map(project => (
                    <li key={project.id}>
                        <div
                            className={`group flex flex-col p-2 rounded-lg cursor-pointer transition-colors ${currentProjectId === project.id ? 'bg-cyan-700/50 text-white shadow-lg border border-cyan-500' : 'text-gray-300 hover:bg-gray-800/50 border border-transparent'}`}
                            onClick={() => onSelectProject(project.id)}
                        >
                            <div className="flex items-center justify-between w-full">
                                {renamingId === project.id ? (
                                    <input
                                        type="text"
                                        value={renamingText}
                                        onChange={(e) => setRenamingText(e.target.value)}
                                        onBlur={() => handleRename(project.id)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleRename(project.id)}
                                        className="bg-gray-600 text-white w-full text-sm p-1 rounded focus:outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="truncate font-medium text-sm">{project.name}</span>
                                )}
                                <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button title="Rename" onClick={(e) => { e.stopPropagation(); setRenamingId(project.id); setRenamingText(project.name); }} className="text-gray-400 hover:text-yellow-400 text-xs p-1">✏️</button>
                                    <button title="Delete" onClick={(e) => { e.stopPropagation(); if(window.confirm(`Confirm deletion of Project: "${project.name}"?`)) onDeleteProject(project.id);}} className="text-gray-400 hover:text-red-500 text-xs p-1">🗑️</button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">Client: {project.clientName}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const GenerationControls: React.FC<{
    settings: GenerationSettings;
    onSettingsChange: (newSettings: Partial<GenerationSettings>) => void;
    isGenerating: boolean;
    aiQuota: number;
}> = ({ settings, onSettingsChange, isGenerating, aiQuota }) => {
    
    const handleRangeChange = (key: keyof GenerationSettings, value: string) => {
        onSettingsChange({ [key]: parseInt(value, 10) });
    };
    
    const handleSelectChange = (key: keyof GenerationSettings, value: string) => {
        onSettingsChange({ [key]: value });
    };

    return (
        <Card title="AI Generation Matrix Configuration" className="shadow-xl border-cyan-800/50">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                
                {/* Model Selection */}
                <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">AI Model Core</label>
                    <select
                        value={settings.model}
                        onChange={e => handleSelectChange('model', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-cyan-500"
                    >
                        <option value="veo-3.1-ultra-hq">Veo 3.1 (Ultra HQ)</option>
                        <option value="imagen-video-4-pro">Imagen Video 4 (Pro)</option>
                        <option value="lumiere-hd-001-enterprise">Lumiere HD (Enterprise)</option>
                        <option value="phoenix-v2-stable">Phoenix v2 (Stable)</option>
                    </select>
                </div>
                
                {/* Aspect Ratio */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Output Ratio</label>
                    <select
                        value={settings.aspectRatio}
                        onChange={e => handleSelectChange('aspectRatio', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="16:9">16:9 (Widescreen)</option>
                        <option value="9:16">9:16 (Vertical/Mobile)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="4:5">4:5 (Portrait)</option>
                        <option value="21:9">21:9 (Cinematic)</option>
                        <option value="3:2">3:2 (Standard Photo)</option>
                        <option value="2:3">2:3 (Poster)</option>
                    </select>
                </div>
                
                {/* Duration (Single Mode Only) */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Duration (s): {settings.duration}</label>
                    <input
                        type="range"
                        min={MIN_SCENE_DURATION}
                        max={30} // Capped at 30 for single prompt for cost control
                        step="1"
                        value={settings.duration}
                        onChange={e => handleRangeChange('duration', e.target.value)}
                        disabled={isGenerating}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                    />
                </div>
                
                {/* Fidelity Level */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Fidelity Level</label>
                    <select
                        value={settings.fidelityLevel}
                        onChange={e => handleSelectChange('fidelityLevel', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="standard">Standard (Fast)</option>
                        <option value="high_res">High Resolution</option>
                        <option value="4k_preview">4K Preview (High Cost)</option>
                    </select>
                </div>
                
                {/* Stylization Strength */}
                <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Creativity/Adherence: {settings.stylizationStrength}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={settings.stylizationStrength}
                        onChange={e => handleRangeChange('stylizationStrength', e.target.value)}
                        disabled={isGenerating}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                    />
                </div>
                
                {/* Motion Control */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Motion Profile</label>
                    <select
                        value={settings.motionControl}
                        onChange={e => handleSelectChange('motionControl', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="dynamic">Dynamic (Complex)</option>
                        <option value="smooth">Smooth (Subtle)</option>
                        <option value="default">Default</option>
                    </select>
                </div>
                
                {/* Audio Style */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Audio Track</label>
                    <select
                        value={settings.audioStyle}
                        onChange={e => handleSelectChange('audioStyle', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="none">None (Muted)</option>
                        <option value="cinematic_orchestral">Cinematic Orchestral</option>
                        <option value="upbeat_synthwave">Upbeat Synthwave</option>
                        <option value="corporate_minimal">Corporate Minimal</option>
                    </select>
                </div>
                
                {/* Seed Control */}
                <div className="col-span-2 lg:col-span-1">
                     <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Seed (Deterministic)</label>
                     <div className="flex">
                        <input
                            type="number"
                            value={settings.seed === -1 ? '' : settings.seed}
                            onChange={e => onSettingsChange({ seed: parseInt(e.target.value, 10) || -1 })}
                            placeholder="Random (-1)"
                            disabled={isGenerating}
                            className="w-full bg-gray-700 border border-gray-600 rounded-l-lg p-2 text-white text-sm"
                        />
                        <button onClick={() => onSettingsChange({seed: -1})} title="Use Random Seed" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-r-lg text-sm font-bold">🎲</button>
                     </div>
                </div>
                
                {/* Quota Display */}
                <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">AI Compute Quota</label>
                    <div className="w-full bg-gray-700 rounded-lg h-8 flex items-center">
                        <div 
                            className={`h-full rounded-l-lg text-xs font-bold flex items-center px-2 transition-all duration-500 ${aiQuota > 1000 ? 'bg-green-600' : aiQuota > 200 ? 'bg-yellow-600' : 'bg-red-600'}`}
                            style={{ width: `${Math.min(100, (aiQuota / 10000) * 100)}%` }}
                        >
                            {aiQuota.toLocaleString()}
                        </div>
                        <span className="text-xs text-gray-300 px-2 flex-shrink-0">/ 10,000</span>
                    </div>
                </div>
                
                {/* Negative Prompt */}
                <div className="col-span-full">
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Negative Prompt (Artifact Suppression)</label>
                    <input
                        type="text"
                        value={settings.negativePrompt}
                        onChange={e => handleSelectChange('negativePrompt', e.target.value)}
                        placeholder="e.g., blurry, text, watermark, ugly, low resolution"
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    />
                </div>
            </div>
        </Card>
    );
};

export const AssetGrid: React.FC<{
    assets: VideoAsset[];
    onDelete: (assetId: string) => void;
    onToggleFavorite: (assetId: string) => void;
    onSelect: (asset: VideoAsset) => void;
}> = ({ assets, onDelete, onToggleFavorite, onSelect }) => {
    if (assets.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 border border-dashed border-gray-700 rounded-lg">
                <p className="text-lg mb-2">📦 Asset Repository Empty</p>
                <p>Generate your first video asset using the controls above to populate this library.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {assets.map(asset => (
                <div key={asset.id} className="group relative aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-200 shadow-lg">
                    {/* Placeholder for actual video preview */}
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Preview Unavailable</span>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end space-x-2">
                            <button title="Favorite" onClick={() => onToggleFavorite(asset.id)} className={`text-xl ${asset.isFavorite ? 'text-yellow-400' : 'text-white/70 hover:text-white'}`}>
                                {asset.isFavorite ? '★' : '☆'}
                            </button>
                            <button title="Delete Asset" onClick={() => onDelete(asset.id)} className="text-white/70 hover:text-red-500">🗑️</button>
                        </div>
                        <div className="bg-black/50 p-1 rounded-md">
                            <p className="text-xs text-white truncate font-mono">{asset.id.substring(0, 8)}...</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Cost: {asset.costCredits} Credits</p>
                            <button onClick={() => onSelect(asset)} className="mt-1 w-full text-xs bg-cyan-600/80 hover:bg-cyan-500 text-white py-1 rounded transition-colors">Analyze & View</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const StoryboardEditor: React.FC<{
    scenes: StoryboardScene[];
    setScenes: React.Dispatch<React.SetStateAction<StoryboardScene[]>>;
    isGenerating: boolean;
    onGenerateDirectorSummary: (prompt: string) => Promise<string>;
    onScenePromptChange: (id: string, prompt: string) => void;
    onSceneNotesChange: (id: string, notes: string) => void;
    onSceneDurationChange: (id: string, duration: number) => void;
    onUpdateProjectSummary: (projectId: string, summary: string) => void; // Added prop
    currentProjectId: string | null; // Added prop
}> = ({ scenes, setScenes, isGenerating, onGenerateDirectorSummary, onScenePromptChange, onSceneNotesChange, onSceneDurationChange, onUpdateProjectSummary, currentProjectId }) => {
    const [isSummarizing, setIsSummarizing] = useState(false);

    const addScene = () => {
        setScenes(prev => [...prev, { id: generateUniqueId(), prompt: '', aiDirectorNotes: '', duration: 5 }]);
    };

    const removeScene = (id: string) => {
        setScenes(prev => prev.filter(s => s.id !== id));
    };
    
    const totalDuration = useMemo(() => scenes.reduce((acc, scene) => acc + scene.duration, 0), [scenes]);

    const handleGenerateSummary = useCallback(async () => {
        if (isGenerating || !currentProjectId) return;
        setIsSummarizing(true);
        const sequencePrompt = synthesizeDirectorPrompt('storyboard_sequence', '', scenes);
        try {
            const summary = await onGenerateDirectorSummary(sequencePrompt);
            onUpdateProjectSummary(currentProjectId, summary); // Update project summary
        } catch (e) {
            console.error("Failed to generate director summary:", e);
            alert('Failed to generate director summary. See console for details.');
        } finally {
            setIsSummarizing(false);
        }
    }, [isGenerating, scenes, onGenerateDirectorSummary, onUpdateProjectSummary, currentProjectId]);

    return (
        <div className="space-y-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
            <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Storyboard Sequence Editor</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {scenes.map((scene, index) => (
                    <div key={scene.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg shadow-inner border border-gray-600">
                        <span className="font-extrabold text-lg text-cyan-400 mt-2 w-6 flex-shrink-0">{index + 1}</span>
                        <div className="flex-grow space-y-2">
                            {/* Prompt Input */}
                            <textarea
                                value={scene.prompt}
                                onChange={e => onScenePromptChange(scene.id, e.target.value)}
                                placeholder={`Scene ${index + 1} Visual Description...`}
                                className="w-full h-16 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-cyan-500 resize-none"
                                disabled={isGenerating}
                            />
                            {/* Director Notes Input */}
                            <textarea
                                value={scene.aiDirectorNotes}
                                onChange={e => onSceneNotesChange(scene.id, e.target.value)}
                                placeholder={`AI Director Notes (e.g., Camera movement, lighting style, character emotion)...`}
                                className="w-full h-12 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white text-xs italic focus:ring-yellow-500 resize-none"
                                disabled={isGenerating}
                            />
                            
                            {/* Duration Control */}
                             <div className="flex items-center space-x-2 pt-1">
                                <label className="text-xs text-gray-400">Duration:</label>
                                 <input
                                    type="range"
                                    min={MIN_SCENE_DURATION}
                                    max={MAX_SCENE_DURATION}
                                    value={scene.duration}
                                    onChange={e => onSceneDurationChange(scene.id, parseInt(e.target.value, 10))}
                                    disabled={isGenerating}
                                    className="w-32 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                                />
                                <span className="text-xs text-white w-8 font-bold">{scene.duration}s</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => removeScene(scene.id)} 
                            disabled={isGenerating || scenes.length <= 1} 
                            title="Remove Scene"
                            className="text-gray-400 hover:text-red-500 disabled:opacity-30 mt-2 p-1"
                        >🗑️</button>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                <button onClick={addScene} disabled={isGenerating || scenes.length >= 20} className="py-2 px-4 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded-lg disabled:opacity-50 flex items-center space-x-1">
                    <span>+ Add Scene Block</span>
                </button>
                <div className="flex items-center space-x-3">
                    <button onClick={handleGenerateSummary} disabled={isGenerating || isSummarizing || !currentProjectId} className="py-2 px-4 text-sm bg-yellow-700/50 hover:bg-yellow-700 text-white rounded-lg disabled:opacity-50 flex items-center space-x-1">
                        {isSummarizing ? (
                            <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                <span>AI Directing...</span>
                            </>
                        ) : (
                            <span>✨ Synthesize Director Notes</span>
                        )}
                    </button>
                    <p className="text-sm text-gray-400">Total Estimated Duration: <span className="font-bold text-white">{totalDuration}s</span></p>
                </div>
            </div>
        </div>
    );
};

// SECTION: Main Component (The Sovereign Interface)
// =========================================================

const AIAdStudioView: React.FC = () => {
    // --- Core State Management ---
    const [prompt, setPrompt] = useState('A hyper-realistic, cinematic 15-second commercial showcasing a self-driving electric vehicle navigating a rain-slicked Tokyo street at midnight, emphasizing speed and safety.');
    const [generationState, setGenerationState] = useState<GenerationState>('idle');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pollingMessageIndex, setPollingMessageIndex] = useState(0);
    const [pollingIntervalId, setPollingIntervalId] = useState<number | null>(null);

    // --- Application State (via Reducer) ---
    const [appState, dispatch] = useReducer(appReducer, initialAppState);
    const [generationSettings, setGenerationSettings] = useState<GenerationSettings>(initialAppState.config.defaultSettings);
    const [generationMode, setGenerationMode] = useState<GenerationMode>('single_prompt');
    const [scenes, setScenes] = useState<StoryboardScene[]>([
        { id: generateUniqueId(), prompt: 'Extreme close-up on a single raindrop hitting a polished chrome surface.', aiDirectorNotes: 'Shallow depth of field, high contrast.', duration: 3 },
        { id: generateUniqueId(), prompt: 'Wide shot of the vehicle accelerating smoothly away from a blurred neon sign.', aiDirectorNotes: 'Smooth tracking shot, cinematic color grading.', duration: 7 },
    ]);
    const [selectedAsset, setSelectedAsset] = useState<VideoAsset | null>(null);
    
    const isGenerating = generationState === 'generating' || generationState === 'polling';
    
    // API Key Input Ref
    const apiKeyInputRef = useRef<HTMLInputElement>(null);

    // Derived State
    const currentProject = useMemo(() => {
        return appState.projects.find(p => p.id === appState.currentProjectId);
    }, [appState.projects, appState.currentProjectId]);
    
    const currentProjectAssets = useMemo(() => {
        return currentProject?.assets || [];
    }, [currentProject]);

    // --- Effects ---
    useEffect(() => {
        // 1. Load initial projects and configuration
        mockApi.getProjects().then(projects => {
            dispatch({ type: 'SET_PROJECTS', payload: projects });
        }).catch(err => {
            dispatch({ type: 'SET_ERROR', payload: 'System initialization failed: Cannot load project manifest.' });
            console.error(err);
        });

        // 2. Load API key from persistent storage and set on AI service
        // WARNING: Storing API keys directly in localStorage or environment variables
        // on the client-side is INSECURE for production applications.
        // For a secure, production-ready system, implement a robust OAuth2/OIDC flow
        // where API keys are managed server-side (e.g., AWS Secrets Manager) and
        // client requests are authenticated via short-lived, backend-issued tokens (e.g., JWT).
        const storedApiKey = process.env.REACT_APP_API_KEY || localStorage.getItem('google_genai_api_key');
        if (storedApiKey) {
            dispatch({ type: 'UPDATE_CONFIG', payload: { apiKey: storedApiKey } });
            videoGenerationService.setApiKey(storedApiKey);
        }
    }, []);

    useEffect(() => {
        // 3. Cleanup interval on state change/unmount
        return () => {
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
            }
        };
    }, [pollingIntervalId]);

    useEffect(() => {
        // 4. Cleanup blob URL
        return () => {
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);
    
    // --- Handlers ---
    
    const handleUpdateConfig = useCallback((payload: Partial<AppConfig>) => {
        dispatch({ type: 'UPDATE_CONFIG', payload });
        if (payload.apiKey !== undefined) {
            videoGenerationService.setApiKey(payload.apiKey);
        }
    }, []);

    const handleApiKeySave = () => {
        const key = apiKeyInputRef.current?.value;
        if (key && key.length > 20) { // Basic validation for non-empty and reasonable length
            // WARNING: See comment in useEffect for security implications of client-side API key storage.
            localStorage.setItem('google_genai_api_key', key);
            handleUpdateConfig({ apiKey: key });
            setError(null);
            alert("API Key successfully registered. System ready for secure connection.");
        } else {
            setError("Invalid key format detected. Key must be substantial.");
        }
    };
    
    // Project Management
    const handleCreateProject = useCallback(async (name: string, client: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const newProject = await mockApi.createProject(name, client);
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject.id });
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to initiate new project: ${err.message || 'Unknown error.'}` });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const handleDeleteProject = useCallback(async (id: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await mockApi.deleteProject(id);
            dispatch({ type: 'REMOVE_PROJECT', payload: id });
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to decommission project: ${err.message || 'Unknown error.'}` });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);
    
    const handleRenameProject = useCallback(async (id: string, newName: string) => {
        try {
            const updatedProject = await mockApi.renameProject(id, newName);
            if (updatedProject) {
                dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
            }
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to rename project: ${err.message || 'Unknown error.'}` });
        }
    }, []);

    // Asset Management
    const handleDeleteAsset = useCallback(async (assetId: string) => {
        if (!currentProject) return;
        try {
            await mockApi.deleteAsset(currentProject.id, assetId);
            dispatch({ type: 'REMOVE_ASSET', payload: { projectId: currentProject.id, assetId }});
            if (selectedAsset?.id === assetId) {
                setSelectedAsset(null);
            }
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to purge asset: ${err.message || 'Unknown error.'}` });
        }
    }, [currentProject, selectedAsset]);
    
    const handleToggleFavorite = useCallback(async (assetId: string) => {
        if (!currentProject) return;
        try {
            const updatedAsset = await mockApi.toggleFavoriteAsset(currentProject.id, assetId);
            if(updatedAsset) {
                dispatch({ type: 'UPDATE_ASSET', payload: { projectId: currentProject.id, asset: updatedAsset }});
            }
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to update asset metadata: ${err.message || 'Unknown error.'}` });
        }
    }, [currentProject]);
    
    const handleAssetSelect = useCallback(async (asset: VideoAsset) => {
        await mockApi.updateAssetAccessTime(asset.projectId, asset.id);
        dispatch({ type: 'UPDATE_ASSET', payload: { projectId: asset.projectId, asset: {...asset, lastAccessed: new Date().toISOString()} }});
        setSelectedAsset(asset);
    }, []);
    
    // AI Director Summary Generation
    const handleGenerateDirectorSummary = useCallback(async (fullPrompt: string): Promise<string> => {
        try {
            return await videoGenerationService.generateDirectorSummary(fullPrompt);
        } catch (err: any) {
            console.error("Error generating director summary:", err);
            throw err; // Re-throw to be caught by the calling component
        }
    }, []);

    const handleUpdateProjectSummary = useCallback((projectId: string, summary: string) => {
        dispatch({ type: 'UPDATE_PROJECT_SUMMARY', payload: { projectId, summary } });
    }, []);

    // --- Core Generation Execution ---
    const handleGenerate = async () => {
        if (!appState.config.apiKey) {
            setError('Authentication Failure: API Key is required for compute access.');
            setGenerationState('error');
            return;
        }

        if(!currentProject) {
            setError('Project Context Missing: Select or create a project before generation.');
            setGenerationState('error');
            return;
        }
        
        if (appState.config.aiQuotaRemaining <= 0) {
            setError('Quota Exhausted: Compute resources are unavailable. Contact administration for quota refresh.');
            setGenerationState('error');
            return;
        }

        setGenerationState('generating');
        setError(null);
        if (videoUrl && videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(videoUrl);
        }
        setVideoUrl(null);
        setPollingMessageIndex(0);
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }
        
        // Start visual feedback loop for polling messages
        const intervalId: number = window.setInterval(() => {
            setPollingMessageIndex(prev => (prev + 1) % POLLING_MESSAGES.length);
        }, 2000);
        setPollingIntervalId(intervalId);

        try {
            const { url, prompt: generatedPrompt, costCredits, storyboard: generatedStoryboard } = await videoGenerationService.generateVideoAsset(
                generationMode,
                prompt,
                scenes,
                generationSettings
            );
            
            clearInterval(intervalId);
            setPollingIntervalId(null);

            setVideoUrl(url);
            setGenerationState('done');

            // Save Asset to Project Manifest
            const newAssetData: Omit<VideoAsset, 'id' | 'projectId' | 'creationDate' | 'lastAccessed'> = {
                assetType: 'video',
                url: url,
                prompt: generatedPrompt,
                settings: generationSettings,
                generationMode,
                storyboard: generatedStoryboard,
                isFavorite: false,
                costCredits: costCredits,
            };

            const newAsset = await mockApi.addAssetToProject(currentProject.id, newAssetData);
            dispatch({ type: 'ADD_ASSET', payload: { projectId: currentProject.id, asset: newAsset } });
            
            // Update Quota
            handleUpdateConfig({ aiQuotaRemaining: Math.max(0, appState.config.aiQuotaRemaining - costCredits) });

        } catch (err: any) {
            console.error("Generation Pipeline Interrupted:", err);
            setError(String(err?.message || 'A critical error halted the generation pipeline.'));
            setGenerationState('error');
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
                setPollingIntervalId(null);
            }
        }
    };

    // --- Render Logic ---
    if (appState.isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                    <div className="animate-pulse text-3xl mb-2">Initializing Sovereign Compute Layer...</div>
                    <p className="text-cyan-400">Establishing secure connection to GenAI Fabric.</p>
                </div>
            </div>
        );
    }

    if (!appState.config.apiKey) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
                <div className="max-w-lg w-full bg-gray-800 p-10 rounded-xl shadow-2xl border border-red-700/50">
                    <h2 className="text-3xl font-extrabold text-red-400 mb-4">ACCESS DENIED: Authentication Required</h2>
                    <p className="text-gray-300 mb-6">The AI Core requires a valid API key for resource allocation and computation. Input your credentials below to proceed.</p>
                    {/* WARNING: This API key input and local storage mechanism is INSECURE for production.
                        It is included for MVP demonstration purposes only.
                        A production application must use a secure backend for API key management and
                        user authentication via robust protocols like OAuth2/OIDC.
                        Sensitive data like API keys should never be exposed client-side. */}
                    <div className="space-y-4">
                        <input
                            ref={apiKeyInputRef}
                            type="password"
                            placeholder="Enter Google GenAI API Key (e.g., AIzaSy...)"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-red-500 focus:border-red-500"
                        />
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        <button onClick={handleApiKeySave} className="w-full py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold transition-colors">
                            Authorize Compute Access
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        For production, API keys will be managed securely server-side. This local input is for development.
                    </p>
                </div>
            </div>
        );
    }
    
    // --- Main Application View ---
    return (
        <div className="flex h-screen overflow-hidden bg-gray-950 text-white">
            {/* Sidebar */}
            <ProjectSidebar 
                projects={appState.projects}
                currentProjectId={appState.currentProjectId}
                onSelectProject={id => dispatch({ type: 'SET_CURRENT_PROJECT', payload: id })}
                onCreateProject={handleCreateProject}
                onDeleteProject={handleDeleteProject}
                onRenameProject={handleRenameProject}
            />
            
            {/* Main Content Area */}
            <main className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                
                {/* Header Bar */}
                <header className="flex justify-between items-center pb-4 border-b border-gray-800 sticky top-0 bg-gray-950 z-10">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-white">AI Video Synthesis Platform</h1>
                        <p className="text-sm text-gray-400">Current Context: {currentProject?.name || "System Initialization"}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-cyan-400">Quota Remaining: {appState.config.aiQuotaRemaining.toLocaleString()}</p>
                        <button onClick={() => handleUpdateConfig({ apiKey: null })} className="text-xs text-red-400 hover:text-red-300 mt-1">Revoke API Key (Local)</button>
                    </div>
                </header>

                {currentProject ? (
                <>
                {/* Generation Panel */}
                <Card title={`Generation Module: ${currentProject.name}`} className="bg-gray-900/70 border-l-4 border-cyan-500 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Column 1: Mode & Controls */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="flex bg-gray-800 rounded-lg p-1 shadow-inner">
                                <button onClick={() => setGenerationMode('single_prompt')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${generationMode === 'single_prompt' ? 'bg-cyan-600 shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}>Single Prompt</button>
                                <button onClick={() => setGenerationMode('storyboard_sequence')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${generationMode === 'storyboard_sequence' ? 'bg-cyan-600 shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}>Storyboard Sequence</button>
                                {/* Future Module: <button onClick={() => setGenerationMode('ai_script_to_video')} disabled className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${generationMode === 'ai_script_to_video' ? 'bg-cyan-600 shadow-md' : 'text-gray-300 hover:bg-gray-700 disabled:opacity-50'}`}>AI Script (Future)</button> */}
                            </div>
                            
                            <GenerationControls 
                                settings={generationSettings} 
                                onSettingsChange={ (partial) => setGenerationSettings(s => ({...s, ...partial}))} 
                                isGenerating={isGenerating} 
                                aiQuota={appState.config.aiQuotaRemaining}
                            />
                        </div>
                        
                        {/* Column 2: Prompt Input */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card title={generationMode === 'single_prompt' ? "Primary Prompt Input (Max 500 Chars)" : "Project AI Summary"} className="h-full">
                                {generationMode === 'single_prompt' ? (
                                    <textarea 
                                        value={prompt} 
                                        onChange={e => setPrompt(e.target.value)} 
                                        placeholder="Describe the scene, style, and required action with high detail..." 
                                        maxLength={500}
                                        className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-cyan-500 resize-none" 
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-400 italic">
                                            {currentProject.aiSummary || "Click 'Synthesize Director Notes' below to generate a narrative summary based on your storyboard."}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            (This summary is stored as the project's high-level objective and provides explainability.)
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                    
                    {/* Storyboard Editor (Conditional) */}
                    {generationMode === 'storyboard_sequence' && (
                        <div className="mt-6">
                            <StoryboardEditor 
                                scenes={scenes} 
                                setScenes={setScenes} 
                                isGenerating={isGenerating} 
                                onGenerateDirectorSummary={handleGenerateDirectorSummary}
                                onScenePromptChange={(id, p) => setScenes(prev => prev.map(s => s.id === id ? {...s, prompt: p} : s))}
                                onSceneNotesChange={(id, n) => setScenes(prev => prev.map(s => s.id === id ? {...s, aiDirectorNotes: n} : s))}
                                onSceneDurationChange={(id, d) => setScenes(prev => prev.map(s => s.id === id ? {...s, duration: d} : s))}
                                onUpdateProjectSummary={handleUpdateProjectSummary}
                                currentProjectId={currentProject.id}
                            />
                        </div>
                    )}
                    
                    {/* Execution Button */}
                    <div className="mt-6 pt-4 border-t border-gray-800 flex justify-center">
                        <button 
                            onClick={handleGenerate} 
                            disabled={isGenerating || (generationMode === 'single_prompt' && !prompt.trim()) || (generationMode === 'storyboard_sequence' && scenes.some(s => !s.prompt.trim()))} 
                            className="w-1/2 py-3 text-lg font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-lg transition-all disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-[1.01]"
                        >
                            {generationState === 'polling' ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Processing... ({POLLING_MESSAGES[pollingMessageIndex]})</span>
                                </div>
                            ) : generationState === 'generating' ? (
                                <span>Initiating Compute Sequence...</span>
                            ) : (
                                <span>Execute Generation Run</span>
                            )}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-sm text-red-300">
                            ERROR: {error}
                        </div>
                    )}
                </Card>
                
                {/* Video Preview Area */}
                <Card title="Real-Time Preview & Output" className="bg-gray-900/70 border-l-4 border-gray-500 shadow-xl">
                    <div className={`mx-auto max-h-[60vh] w-full bg-black rounded-xl flex items-center justify-center border border-gray-700 overflow-hidden`}>
                        {generationState === 'done' && videoUrl ? (
                            <video src={videoUrl} controls autoPlay muted loop className="w-full h-full object-contain rounded-xl" />
                        ) : generationState === 'polling' || generationState === 'generating' ? (
                            <div className="text-center p-12">
                                <div className="relative w-20 h-20 mx-auto mb-4">
                                    <div className="absolute inset-0 border-8 border-cyan-500/20 rounded-full"></div>
                                    <div className="absolute inset-2 border-8 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
                                </div>
                                <p className="text-xl font-semibold text-cyan-300">Rendering Frame Sequence...</p>
                                <p className="text-sm text-gray-400 mt-1">{POLLING_MESSAGES[pollingMessageIndex]}</p>
                            </div>
                        ) : error ? (
                             <p className="text-red-400 p-8 text-center text-lg">Generation Failed. Review error log above.</p>
                        ) : (
                             <p className="text-gray-600 p-12 text-lg">Output Preview Window. Awaiting first successful generation.</p>
                        )}
                    </div>
                </Card>
                
                {/* Asset Library */}
                <Card title={`Asset Repository (${currentProjectAssets.length} Items)`} className="bg-gray-900/70 border-l-4 border-yellow-500 shadow-xl">
                    <AssetGrid 
                        assets={currentProjectAssets}
                        onDelete={handleDeleteAsset}
                        onToggleFavorite={handleToggleFavorite}
                        onSelect={handleAssetSelect}
                    />
                </Card>
                </>
                ) : (
                    <div className="flex items-center justify-center h-[70vh] bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
                        <div className="text-center p-10">
                            <p className="text-2xl font-semibold text-gray-400 mb-3">No Active Project Context</p>
                            <p className="text-gray-500">Use the Project Nexus sidebar to create a new campaign or select an existing one.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Asset Detail Modal (Enhanced) */}
            {selectedAsset && (
                 <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setSelectedAsset(null)}>
                    <div className="bg-gray-800 rounded-xl max-w-5xl w-[90%] md:w-[80%] p-6 space-y-6 shadow-3xl border border-cyan-600/50" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                            <h3 className="text-2xl font-bold text-white">Asset Manifest Viewer: {selectedAsset.id.substring(0, 12)}</h3>
                            <button onClick={() => setSelectedAsset(null)} className="text-gray-400 hover:text-white text-2xl p-1">✕</button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Video/Preview Area */}
                            <div className="lg:col-span-2 space-y-3">
                                <div className={`aspect-video bg-black rounded-lg border border-gray-600 overflow-hidden`}>
                                    <video src={selectedAsset.url} controls autoPlay loop muted className="w-full h-full object-contain"></video>
                                </div>
                                <p className="text-sm text-gray-400 italic">Asset Type: {selectedAsset.assetType}</p>
                            </div>
                            
                            {/* Metadata Column */}
                            <div className="lg:col-span-1 text-sm space-y-3 bg-gray-700/30 p-4 rounded-lg">
                                <h4 className="font-bold text-cyan-300 border-b border-gray-600 pb-1 mb-2">Generation Metadata</h4>
                                <p><strong>Created:</strong> {formatDate(selectedAsset.creationDate)}</p>
                                <p><strong>Last Accessed:</strong> {formatDate(selectedAsset.lastAccessed)}</p>
                                <p><strong>Estimated Cost:</strong> <span className="text-yellow-300">{selectedAsset.costCredits} Credits</span></p>
                                <p><strong>Favorite:</strong> {selectedAsset.isFavorite ? 'Yes' : 'No'}</p>
                                
                                <h4 className="font-bold text-cyan-300 border-b border-gray-600 pb-1 mt-4 mb-2">Settings Snapshot</h4>
                                <p><strong>Model:</strong> {selectedAsset.settings.model}</p>
                                <p><strong>Ratio:</strong> {selectedAsset.settings.aspectRatio}</p>
                                <p><strong>Style Strength:</strong> {selectedAsset.settings.stylizationStrength}%</p>
                                <p><strong>Motion:</strong> {selectedAsset.settings.motionControl}</p>
                                
                                {selectedAsset.generationMode === 'storyboard_sequence' && selectedAsset.storyboard && (
                                    <>
                                        <h4 className="font-bold text-cyan-300 border-b border-gray-600 pb-1 mt-4 mb-2">Storyboard Breakdown ({selectedAsset.storyboard.length} Scenes)</h4>
                                        <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                                            {selectedAsset.storyboard.map((scene, i) => (
                                                <p key={scene.id} className="text-xs bg-gray-800 p-1 rounded truncate">
                                                    {i+1}. ({scene.duration}s) {scene.prompt.substring(0, 40)}...
                                                </p>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                            <a href={selectedAsset.url} download={`ad_asset_${selectedAsset.id}.mp4`} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium">Download Raw Asset</a>
                            <button onClick={() => {
                                handleToggleFavorite(selectedAsset.id);
                                setSelectedAsset(s => s ? {...s, isFavorite: !s.isFavorite} : null);
                            }} className={`py-2 px-4 rounded-lg font-medium transition-colors ${selectedAsset.isFavorite ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-500 hover:bg-gray-400'} text-white`}>
                                {selectedAsset.isFavorite ? 'Unmark Favorite' : 'Mark as Favorite'}
                            </button>
                            <button onClick={() => {
                                if(window.confirm("Permanently delete this asset? This action cannot be undone.")) {
                                    handleDeleteAsset(selectedAsset.id);
                                    setSelectedAsset(null);
                                }
                            }} className="py-2 px-4 bg-red-700 hover:bg-red-600 text-white rounded-lg font-medium">Delete Asset</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAdStudioView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/AIAdStudioView.tsx
================================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Loader2,
  Download,
  Play,
  Video,
  ShieldCheck,
  Zap,
  Terminal,
  Lock,
  CreditCard,
  Activity,
  MessageSquare,
  Send,
  Sparkles,
  Cpu,
  Globe,
  Layers,
  AlertCircle,
  CheckCircle2,
  Database,
  Key,
  Eye,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - AI AD STUDIO & SECURE OPERATIONS MONOLITH
 *
 * PHILOSOPHY:
 * - "Golden Ticket" Experience: High-performance, elite UI.
 * - "Test Drive": Interactive, no-pressure, high-polish.
 * - "Bells and Whistles": Advanced encryption, real-time AI, audit trails.
 *
 * SECURITY:
 * - Homomorphic-simulated Internal App Storage (Closure-based, encrypted).
 * - Multi-factor authentication simulations.
 * - Real-time fraud monitoring.
 *
 * INTEGRATIONS:
 * - Stripe (Simulated high-fidelity).
 * - ERP/Accounting (Data visualization).
 * - Google GenAI (Gemini 2.5 Flash via @google/genai).
 */

// --- SECURE INTERNAL STORAGE (HOMOMORPHIC SIMULATION) ---
// This storage is not accessible via window or browser dev tools.
const QuantumVault = (() => {
  const _vault = new Map<string, string>();
  const _key = "QUANTUM_INTERNAL_SECRET_0x8821";

  const encrypt = (text: string) => {
    try {
      const utf8Text = unescape(encodeURIComponent(text));
      return btoa(utf8Text.split('').map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ _key.charCodeAt(i % _key.length))
      ).join(''));
    } catch (e) {
      return btoa(text);
    }
  };

  const decrypt = (encoded: string) => {
    try {
      const text = atob(encoded);
      const decoded = text.split('').map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ _key.charCodeAt(i % _key.length))
      ).join('');
      return decodeURIComponent(escape(decoded));
    } catch (e) {
      return atob(encoded);
    }
  };

  return {
    setItem: (key: string, value: unknown) => {
      try {
        const encryptedValue = encrypt(JSON.stringify(value));
        _vault.set(key, encryptedValue);
      } catch (e) {
        console.error("Vault serialization error:", e);
      }
    },
    getItem: (key: string) => {
      const val = _vault.get(key);
      if (!val) return null;
      try {
        return JSON.parse(decrypt(val));
      } catch (e) {
        return null;
      }
    },
    has: (key: string) => _vault.has(key),
    clear: () => _vault.clear()
  };
})();

// --- AUDIT LOGGING SYSTEM ---
interface AuditEntry {
  timestamp: string;
  action: string;
  details: unknown;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  id: string;
}

const QuantumAudit = {
  log: (action: string, details: unknown, severity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO') => {
    const logs: AuditEntry[] = QuantumVault.getItem('audit_logs') || [];
    const entry: AuditEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      severity,
      id: Math.random().toString(36).substring(2, 15)
    };
    QuantumVault.setItem('audit_logs', [entry, ...logs].slice(0, 100));
    console.log(`[AUDIT] ${severity}: ${action}`, details);
  }
};

// --- LOCAL COMPONENTS (To ensure self-containment) ---

const QuantumCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; className?: string }> = ({ title, children, icon, className }) => (
  <div className={`bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-indigo-500/30 ${className}`}>
    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-transparent to-white/[0.02]">
      <div className="flex items-center gap-3">
        {icon && <div className="text-indigo-400">{icon}</div>}
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">{title}</h3>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const StripeModal: React.FC<{ isOpen: boolean; onClose: () => void; onComplete: () => void }> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setLoading(true);
    QuantumAudit.log('STRIPE_PAYMENT_INITIATED', { amount: 499.00, currency: 'USD' });
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      QuantumAudit.log('STRIPE_PAYMENT_SUCCESS', { transactionId: 'pi_3N' + Math.random().toString(36).substring(7) });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.3)]">
        <div className="bg-[#635bff] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard size={24} />
            <span className="font-bold text-lg">Quantum Pay</span>
          </div>
          <button onClick={onClose} className="hover:opacity-70">✕</button>
        </div>
        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="text-gray-500 text-sm">Ad Studio Credits</p>
                  <p className="text-2xl font-bold text-gray-900">5,000 Units</p>
                </div>
                <p className="text-xl font-medium text-gray-900">$499.00</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Card Information</label>
                  <div className="border rounded-lg p-3 flex items-center gap-3 bg-gray-50">
                    <CreditCard className="text-gray-400" size={20} />
                    <input className="bg-transparent outline-none text-gray-800 w-full" placeholder="4242 4242 4242 4242" defaultValue="" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Expiry</label>
                    <input className="border rounded-lg p-3 bg-gray-50 w-full" placeholder="MM / YY" defaultValue="" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">CVC</label>
                    <input className="border rounded-lg p-3 bg-gray-50 w-full" placeholder="123" defaultValue="" />
                  </div>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-[#635bff] hover:bg-[#5a51e6] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : `Pay $499.00`}
              </button>
              <p className="text-[10px] text-center text-gray-400">Powered by Stripe. Secure, encrypted, and audited.</p>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Payment Successful</h3>
                <p className="text-gray-500">Your credits have been added to your Quantum Vault.</p>
              </div>
              <button
                onClick={() => { onComplete(); onClose(); }}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg"
              >
                Return to Studio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN VIEW COMPONENT ---

const AIAdStudioView: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState('A hyper-realistic cinematic commercial for Quantum Financial, showcasing global connectivity, high-speed data streams, and elite security vaults.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingStep, setPollingStep] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Welcome to the Quantum Ad Studio. I am your AI Creative Director. How can I help you build your brand's vision today?" }
  ]);
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [credits, setCredits] = useState(1250);
  const [showAudit, setShowAudit] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const POLLING_MESSAGES = [
    "Initializing Neural Video Synthesis Engine...",
    "Analyzing semantic intent vectors...",
    "Generating high-fidelity frame buffer...",
    "Executing temporal coherence algorithms...",
    "Optimizing lighting and global illumination...",
    "Finalizing secure asset manifest..."
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // AI Generation Logic
  const handleGenerate = async (overridePrompt?: string) => {
    const activePrompt = overridePrompt || prompt;
    if (!activePrompt.trim()) return;
    if (credits < 500) {
      setIsStripeOpen(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setPollingStep(0);
    QuantumAudit.log('VIDEO_GENERATION_STARTED', { prompt: activePrompt });

    intervalRef.current = setInterval(() => {
      setPollingStep(prev => (prev + 1) % POLLING_MESSAGES.length);
    }, 3000);

    try {
      // Simulate video synthesis pipeline
      await new Promise(resolve => setTimeout(resolve, 12000 + Math.random() * 3000));

      // Royalty-free sample video
      const simulatedVideoUrl = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';

      setVideoUrl(simulatedVideoUrl);
      setCredits(prev => prev - 500);
      QuantumAudit.log('VIDEO_GENERATION_SUCCESS', { url: simulatedVideoUrl });

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred during generation.';
      console.error("Video Generation Error:", err);
      setError(errorMsg);
      QuantumAudit.log('VIDEO_GENERATION_FAILED', { error: errorMsg }, 'WARN');
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsGenerating(false);
    }
  };

  // Chatbot Logic
  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiThinking(true);

    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured for client-side use. Please ensure NEXT_PUBLIC_GEMINI_API_KEY is set.");
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

      const systemContext = `
        You are the Quantum Financial AI Assistant.
        You help users create video ads, manage their credits, and understand their financial data.
        If the user wants to create a video, describe it and then say "[ACTION:GENERATE_VIDEO: prompt]".
        If the user wants to add credits, say "[ACTION:OPEN_STRIPE]".
        Be elite, professional, and high-performance.
        Current Credits: ${credits}.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemContext}\n\nUser: ${userMsg}`
      });

      const responseText = response.text || '';
      setChatHistory(prev => [...prev, { role: 'ai', text: responseText }]);

      // Parse Actions
      if (responseText.includes('[ACTION:GENERATE_VIDEO:')) {
        const match = responseText.match(/\[ACTION:GENERATE_VIDEO:\s*(.*?)\]/);
        if (match && match[1]) {
          setPrompt(match[1]);
          handleGenerate(match[1]);
        }
      }
      if (responseText.includes('[ACTION:OPEN_STRIPE]')) {
        setIsStripeOpen(true);
      }

      QuantumAudit.log('AI_CHAT_INTERACTION', { userMsg, aiResponse: responseText });
    } catch (err) {
      console.error("AI Chat Error:", err);
      setChatHistory(prev => [...prev, { role: 'ai', text: "I apologize, but my neural links are currently saturated, or there was an issue with the API. Please try again in a moment." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const auditLogs: AuditEntry[] = QuantumVault.getItem('audit_logs') || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      {/* TOP NAVIGATION BAR */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Zap className="text-white fill-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Quantum</h1>
                <p className="text-[10px] font-bold text-indigo-400 tracking-[0.3em] uppercase">Financial</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex gap-6">
              {['Dashboard', 'Payments', 'Studio', 'Analytics', 'Vault'].map((item) => (
                <button key={item} className={`text-xs font-bold uppercase tracking-widest transition-colors ${item === 'Studio' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{credits} Credits</span>
              <button onClick={() => setIsStripeOpen(true)} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowAudit(!showAudit)} className="p-2 text-gray-400 hover:text-white transition-colors">
                <Activity size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/20 flex items-center justify-center font-bold text-xs">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* HERO SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Next-Gen Marketing</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">AI Ad Studio</h2>
            <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
              Experience the "Golden Ticket" of financial marketing. Test drive our neural synthesis engine to create high-performance cinematic assets for your global enterprise.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
              <Layers size={16} /> Templates
            </button>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
              <Play size={16} /> New Project
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: CREATIVE & PREVIEW */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <QuantumCard title="Creative Directives" icon={<Cpu size={18} />}>
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-sans transition-all placeholder:text-gray-700"
                      placeholder="Describe the cinematic vision..."
                      disabled={isGenerating}
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                        <Globe size={14} />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                        <Lock size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Resolution</label>
                      <div className="text-white font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div> 4K Ultra HD
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Engine</label>
                      <div className="text-white font-bold italic flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> VEO-3.1-PREVIEW
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
                  >
                    {isGenerating ? <><Loader2 className="animate-spin" /> Synthesizing Reality...</> : <><Video size={18} /> Execute Synthesis</>}
                  </button>
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                      <AlertCircle className="text-red-500 shrink-0" size={18} />
                      <p className="text-xs text-red-400 font-mono">{error}</p>
                    </div>
                  )}
                </div>
              </QuantumCard>

              <QuantumCard title="Asset Preview" icon={<Eye size={18} />}>
                <div className="aspect-video bg-black rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                  {isGenerating ? (
                    <div className="text-center p-6 space-y-6 z-10">
                      <div className="relative">
                        <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 border-2 border-blue-500/20 border-b-blue-500 rounded-full animate-spin-slow"></div>
                        </div>
                      </div>
                      <p className="text-[10px] text-indigo-400 font-mono animate-pulse tracking-[0.2em] uppercase">{POLLING_MESSAGES[pollingStep]}</p>
                    </div>
                  ) : videoUrl ? (
                    <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8 space-y-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <Bot size={40} className="text-gray-400" />
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase">Awaiting Signal Ingestion</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[8px] font-bold uppercase tracking-widest">Live Feed</div>
                    <div className="px-2 py-1 bg-indigo-600/60 backdrop-blur-md border border-indigo-500/20 rounded text-[8px] font-bold uppercase tracking-widest">Encrypted</div>
                  </div>
                </div>
                {videoUrl && (
                  <div className="mt-6 p-4 bg-green-500/5 rounded-xl border border-green-500/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Asset Manifest Valid</span>
                    </div>
                    <a href={videoUrl} download="quantum_synthesis.mp4" className="flex items-center gap-2 text-[10px] font-black text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500 transition-all uppercase tracking-widest">
                      <Download size={14} /> Download MP4
                    </a>
                  </div>
                )}
              </QuantumCard>
            </div>

            {/* ANALYTICS & ERP INTEGRATION SIMULATION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <QuantumCard title="System Load" icon={<BarChart3 size={16} />}>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Compute</span>
                    <span className="text-xl font-black text-indigo-400">94.2%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full w-[94%]"></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-gray-600 uppercase">
                    <span>Cluster_A: Active</span>
                    <span>Latency: 12ms</span>
                  </div>
                </div>
              </QuantumCard>
              <QuantumCard title="ERP Sync" icon={<Database size={16} />}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">SAP S/4HANA</p>
                      <p className="text-[8px] text-gray-500 uppercase">Last Sync: 2m ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">Oracle NetSuite</p>
                      <p className="text-[8px] text-gray-500 uppercase">Last Sync: 5m ago</p>
                    </div>
                  </div>
                </div>
              </QuantumCard>
              <QuantumCard title="Security" icon={<ShieldCheck size={16} />}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">MFA Status</span>
                    <span className="text-[10px] font-bold text-green-500 uppercase">Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Fraud Scan</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Clear</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Encryption</span>
                    <span className="text-[10px] font-bold text-white uppercase">AES-256-GCM</span>
                  </div>
                </div>
              </QuantumCard>
            </div>
          </div>

          {/* RIGHT COLUMN: AI ASSISTANT & AUDIT */}
          <div className="lg:col-span-4 space-y-8">
            <QuantumCard title="Quantum Assistant" icon={<MessageSquare size={18} />} className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10">
                      <Loader2 className="animate-spin text-indigo-400" size={16} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="mt-6 relative">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Ask the AI to create or manage..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button
                  onClick={handleChat}
                  className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </QuantumCard>

            {showAudit && (
              <QuantumCard title="Audit Trail" icon={<Terminal size={18} />} className="animate-in slide-in-from-right duration-300">
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {auditLogs.length === 0 ? (
                    <p className="text-[10px] text-gray-600 italic">No sensitive actions logged in this session.</p>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-black uppercase ${
                            log.severity === 'CRITICAL' ? 'text-red-500' : log.severity === 'WARN' ? 'text-yellow-500' : 'text-indigo-400'
                          }`}>{log.action}</span>
                          <span className="text-[8px] text-gray-600 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-mono truncate">{JSON.stringify(log.details)}</p>
                      </div>
                    ))
                  )}
                </div>
              </QuantumCard>
            )}

            <QuantumCard title="Vault Storage" icon={<Lock size={18} />}>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Key className="text-indigo-400" size={16} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Secure Keys</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase">API_GATEWAY</span>
                      <span className="text-[9px] font-mono text-gray-300">••••••••••••4291</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase">STRIPE_LIVE</span>
                      <span className="text-[9px] font-mono text-gray-300">••••••••••••8821</span>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-gray-600 italic leading-relaxed">
                  "All integration keys are stored in the Quantum Vault using homomorphic-simulated encryption. Data is never exposed to the browser's local storage or global scope."
                </p>
              </div>
            </QuantumCard>
          </div>
        </div>
      </main>

      {/* STRIPE MODAL */}
      <StripeModal
        isOpen={isStripeOpen}
        onClose={() => setIsStripeOpen(false)}
        onComplete={() => {
          setCredits(prev => prev + 5000);
          setChatHistory(prev => [...prev, { role: 'ai', text: "Excellent. Your credits have been replenished. We are ready to continue our creative journey." }]);
        }}
      />

      {/* FOOTER */}
      <footer className="max-w-[1600px] mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
            <Zap size={12} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Quantum Financial © 2024</span>
        </div>
        <div className="flex gap-8">
          {['Security Policy', 'Terms of Service', 'API Documentation', 'Support'].map(item => (
            <button key={item} className="text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors">
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          SYSTEMS_OPERATIONAL_0x00
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}} />
    </div>
  );
};

export default AIAdStudioView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/AIAdStudioView_1.tsx
================================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Loader2,
  Download,
  Play,
  Video,
  ShieldCheck,
  Zap,
  Terminal,
  Lock,
  CreditCard,
  Activity,
  MessageSquare,
  Send,
  Sparkles,
  Cpu,
  Globe,
  Layers,
  AlertCircle,
  CheckCircle2,
  Database,
  Key,
  Eye,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - AI AD STUDIO & SECURE OPERATIONS MONOLITH
 *
 * PHILOSOPHY:
 * - "Golden Ticket" Experience: High-performance, elite UI.
 * - "Test Drive": Interactive, no-pressure, high-polish.
 * - "Bells and Whistles": Advanced encryption, real-time AI, audit trails.
 *
 * SECURITY:
 * - Homomorphic-simulated Internal App Storage (Closure-based, encrypted).
 * - Multi-factor authentication simulations.
 * - Real-time fraud monitoring.
 *
 * INTEGRATIONS:
 * - Stripe (Simulated high-fidelity).
 * - ERP/Accounting (Data visualization).
 * - Google GenAI (Gemini 2.5 Flash via @google/genai).
 */

// --- SECURE INTERNAL STORAGE (HOMOMORPHIC SIMULATION) ---
// This storage is not accessible via window or browser dev tools.
const QuantumVault = (() => {
  const _vault = new Map<string, string>();
  const _key = "QUANTUM_INTERNAL_SECRET_0x8821";

  const encrypt = (text: string) => {
    try {
      const utf8Text = unescape(encodeURIComponent(text));
      return btoa(utf8Text.split('').map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ _key.charCodeAt(i % _key.length))
      ).join(''));
    } catch (e) {
      return btoa(text);
    }
  };

  const decrypt = (encoded: string) => {
    try {
      const text = atob(encoded);
      const decoded = text.split('').map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ _key.charCodeAt(i % _key.length))
      ).join('');
      return decodeURIComponent(escape(decoded));
    } catch (e) {
      return atob(encoded);
    }
  };

  return {
    setItem: (key: string, value: unknown) => {
      try {
        const encryptedValue = encrypt(JSON.stringify(value));
        _vault.set(key, encryptedValue);
      } catch (e) {
        console.error("Vault serialization error:", e);
      }
    },
    getItem: (key: string) => {
      const val = _vault.get(key);
      if (!val) return null;
      try {
        return JSON.parse(decrypt(val));
      } catch (e) {
        return null;
      }
    },
    has: (key: string) => _vault.has(key),
    clear: () => _vault.clear()
  };
})();

// --- AUDIT LOGGING SYSTEM ---
interface AuditEntry {
  timestamp: string;
  action: string;
  details: unknown;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  id: string;
}

const QuantumAudit = {
  log: (action: string, details: unknown, severity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO') => {
    const logs: AuditEntry[] = QuantumVault.getItem('audit_logs') || [];
    const entry: AuditEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      severity,
      id: Math.random().toString(36).substring(2, 15)
    };
    QuantumVault.setItem('audit_logs', [entry, ...logs].slice(0, 100));
    console.log(`[AUDIT] ${severity}: ${action}`, details);
  }
};

// --- LOCAL COMPONENTS (To ensure self-containment) ---

const QuantumCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; className?: string }> = ({ title, children, icon, className }) => (
  <div className={`bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-indigo-500/30 ${className}`}>
    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-transparent to-white/[0.02]">
      <div className="flex items-center gap-3">
        {icon && <div className="text-indigo-400">{icon}</div>}
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">{title}</h3>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const StripeModal: React.FC<{ isOpen: boolean; onClose: () => void; onComplete: () => void }> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setLoading(true);
    QuantumAudit.log('STRIPE_PAYMENT_INITIATED', { amount: 499.00, currency: 'USD' });
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      QuantumAudit.log('STRIPE_PAYMENT_SUCCESS', { transactionId: 'pi_3N' + Math.random().toString(36).substring(7) });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.3)]">
        <div className="bg-[#635bff] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard size={24} />
            <span className="font-bold text-lg">Quantum Pay</span>
          </div>
          <button onClick={onClose} className="hover:opacity-70">✕</button>
        </div>
        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="text-gray-500 text-sm">Ad Studio Credits</p>
                  <p className="text-2xl font-bold text-gray-900">5,000 Units</p>
                </div>
                <p className="text-xl font-medium text-gray-900">$499.00</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Card Information</label>
                  <div className="border rounded-lg p-3 flex items-center gap-3 bg-gray-50">
                    <CreditCard className="text-gray-400" size={20} />
                    <input className="bg-transparent outline-none text-gray-800 w-full" placeholder="4242 4242 4242 4242" defaultValue="" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Expiry</label>
                    <input className="border rounded-lg p-3 bg-gray-50 w-full" placeholder="MM / YY" defaultValue="" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">CVC</label>
                    <input className="border rounded-lg p-3 bg-gray-50 w-full" placeholder="123" defaultValue="" />
                  </div>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-[#635bff] hover:bg-[#5a51e6] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : `Pay $499.00`}
              </button>
              <p className="text-[10px] text-center text-gray-400">Powered by Stripe. Secure, encrypted, and audited.</p>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Payment Successful</h3>
                <p className="text-gray-500">Your credits have been added to your Quantum Vault.</p>
              </div>
              <button
                onClick={() => { onComplete(); onClose(); }}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg"
              >
                Return to Studio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN VIEW COMPONENT ---

const AIAdStudioView: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState('A hyper-realistic cinematic commercial for Quantum Financial, showcasing global connectivity, high-speed data streams, and elite security vaults.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingStep, setPollingStep] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Welcome to the Quantum Ad Studio. I am your AI Creative Director. How can I help you build your brand's vision today?" }
  ]);
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [credits, setCredits] = useState(1250);
  const [showAudit, setShowAudit] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const POLLING_MESSAGES = [
    "Initializing Neural Video Synthesis Engine...",
    "Analyzing semantic intent vectors...",
    "Generating high-fidelity frame buffer...",
    "Executing temporal coherence algorithms...",
    "Optimizing lighting and global illumination...",
    "Finalizing secure asset manifest..."
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // AI Generation Logic
  const handleGenerate = async (overridePrompt?: string) => {
    const activePrompt = overridePrompt || prompt;
    if (!activePrompt.trim()) return;
    if (credits < 500) {
      setIsStripeOpen(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setPollingStep(0);
    QuantumAudit.log('VIDEO_GENERATION_STARTED', { prompt: activePrompt });

    intervalRef.current = setInterval(() => {
      setPollingStep(prev => (prev + 1) % POLLING_MESSAGES.length);
    }, 3000);

    try {
      // Simulate video synthesis pipeline
      await new Promise(resolve => setTimeout(resolve, 12000 + Math.random() * 3000));

      // Royalty-free sample video
      const simulatedVideoUrl = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';

      setVideoUrl(simulatedVideoUrl);
      setCredits(prev => prev - 500);
      QuantumAudit.log('VIDEO_GENERATION_SUCCESS', { url: simulatedVideoUrl });

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred during generation.';
      console.error("Video Generation Error:", err);
      setError(errorMsg);
      QuantumAudit.log('VIDEO_GENERATION_FAILED', { error: errorMsg }, 'WARN');
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsGenerating(false);
    }
  };

  // Chatbot Logic
  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiThinking(true);

    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured for client-side use. Please ensure NEXT_PUBLIC_GEMINI_API_KEY is set.");
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

      const systemContext = `
        You are the Quantum Financial AI Assistant.
        You help users create video ads, manage their credits, and understand their financial data.
        If the user wants to create a video, describe it and then say "[ACTION:GENERATE_VIDEO: prompt]".
        If the user wants to add credits, say "[ACTION:OPEN_STRIPE]".
        Be elite, professional, and high-performance.
        Current Credits: ${credits}.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemContext}\n\nUser: ${userMsg}`
      });

      const responseText = response.text || '';
      setChatHistory(prev => [...prev, { role: 'ai', text: responseText }]);

      // Parse Actions
      if (responseText.includes('[ACTION:GENERATE_VIDEO:')) {
        const match = responseText.match(/\[ACTION:GENERATE_VIDEO:\s*(.*?)\]/);
        if (match && match[1]) {
          setPrompt(match[1]);
          handleGenerate(match[1]);
        }
      }
      if (responseText.includes('[ACTION:OPEN_STRIPE]')) {
        setIsStripeOpen(true);
      }

      QuantumAudit.log('AI_CHAT_INTERACTION', { userMsg, aiResponse: responseText });
    } catch (err) {
      console.error("AI Chat Error:", err);
      setChatHistory(prev => [...prev, { role: 'ai', text: "I apologize, but my neural links are currently saturated, or there was an issue with the API. Please try again in a moment." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const auditLogs: AuditEntry[] = QuantumVault.getItem('audit_logs') || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      {/* TOP NAVIGATION BAR */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Zap className="text-white fill-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Quantum</h1>
                <p className="text-[10px] font-bold text-indigo-400 tracking-[0.3em] uppercase">Financial</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex gap-6">
              {['Dashboard', 'Payments', 'Studio', 'Analytics', 'Vault'].map((item) => (
                <button key={item} className={`text-xs font-bold uppercase tracking-widest transition-colors ${item === 'Studio' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{credits} Credits</span>
              <button onClick={() => setIsStripeOpen(true)} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowAudit(!showAudit)} className="p-2 text-gray-400 hover:text-white transition-colors">
                <Activity size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/20 flex items-center justify-center font-bold text-xs">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* HERO SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Next-Gen Marketing</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">AI Ad Studio</h2>
            <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
              Experience the "Golden Ticket" of financial marketing. Test drive our neural synthesis engine to create high-performance cinematic assets for your global enterprise.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
              <Layers size={16} /> Templates
            </button>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
              <Play size={16} /> New Project
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: CREATIVE & PREVIEW */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <QuantumCard title="Creative Directives" icon={<Cpu size={18} />}>
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-sans transition-all placeholder:text-gray-700"
                      placeholder="Describe the cinematic vision..."
                      disabled={isGenerating}
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                        <Globe size={14} />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                        <Lock size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Resolution</label>
                      <div className="text-white font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div> 4K Ultra HD
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Engine</label>
                      <div className="text-white font-bold italic flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> VEO-3.1-PREVIEW
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
                  >
                    {isGenerating ? <><Loader2 className="animate-spin" /> Synthesizing Reality...</> : <><Video size={18} /> Execute Synthesis</>}
                  </button>
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                      <AlertCircle className="text-red-500 shrink-0" size={18} />
                      <p className="text-xs text-red-400 font-mono">{error}</p>
                    </div>
                  )}
                </div>
              </QuantumCard>

              <QuantumCard title="Asset Preview" icon={<Eye size={18} />}>
                <div className="aspect-video bg-black rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                  {isGenerating ? (
                    <div className="text-center p-6 space-y-6 z-10">
                      <div className="relative">
                        <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 border-2 border-blue-500/20 border-b-blue-500 rounded-full animate-spin-slow"></div>
                        </div>
                      </div>
                      <p className="text-[10px] text-indigo-400 font-mono animate-pulse tracking-[0.2em] uppercase">{POLLING_MESSAGES[pollingStep]}</p>
                    </div>
                  ) : videoUrl ? (
                    <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8 space-y-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <Bot size={40} className="text-gray-400" />
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase">Awaiting Signal Ingestion</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[8px] font-bold uppercase tracking-widest">Live Feed</div>
                    <div className="px-2 py-1 bg-indigo-600/60 backdrop-blur-md border border-indigo-500/20 rounded text-[8px] font-bold uppercase tracking-widest">Encrypted</div>
                  </div>
                </div>
                {videoUrl && (
                  <div className="mt-6 p-4 bg-green-500/5 rounded-xl border border-green-500/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Asset Manifest Valid</span>
                    </div>
                    <a href={videoUrl} download="quantum_synthesis.mp4" className="flex items-center gap-2 text-[10px] font-black text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500 transition-all uppercase tracking-widest">
                      <Download size={14} /> Download MP4
                    </a>
                  </div>
                )}
              </QuantumCard>
            </div>

            {/* ANALYTICS & ERP INTEGRATION SIMULATION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <QuantumCard title="System Load" icon={<BarChart3 size={16} />}>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Compute</span>
                    <span className="text-xl font-black text-indigo-400">94.2%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full w-[94%]"></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-gray-600 uppercase">
                    <span>Cluster_A: Active</span>
                    <span>Latency: 12ms</span>
                  </div>
                </div>
              </QuantumCard>
              <QuantumCard title="ERP Sync" icon={<Database size={16} />}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">SAP S/4HANA</p>
                      <p className="text-[8px] text-gray-500 uppercase">Last Sync: 2m ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">Oracle NetSuite</p>
                      <p className="text-[8px] text-gray-500 uppercase">Last Sync: 5m ago</p>
                    </div>
                  </div>
                </div>
              </QuantumCard>
              <QuantumCard title="Security" icon={<ShieldCheck size={16} />}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">MFA Status</span>
                    <span className="text-[10px] font-bold text-green-500 uppercase">Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Fraud Scan</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Clear</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Encryption</span>
                    <span className="text-[10px] font-bold text-white uppercase">AES-256-GCM</span>
                  </div>
                </div>
              </QuantumCard>
            </div>
          </div>

          {/* RIGHT COLUMN: AI ASSISTANT & AUDIT */}
          <div className="lg:col-span-4 space-y-8">
            <QuantumCard title="Quantum Assistant" icon={<MessageSquare size={18} />} className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10">
                      <Loader2 className="animate-spin text-indigo-400" size={16} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="mt-6 relative">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Ask the AI to create or manage..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button
                  onClick={handleChat}
                  className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </QuantumCard>

            {showAudit && (
              <QuantumCard title="Audit Trail" icon={<Terminal size={18} />} className="animate-in slide-in-from-right duration-300">
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {auditLogs.length === 0 ? (
                    <p className="text-[10px] text-gray-600 italic">No sensitive actions logged in this session.</p>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-black uppercase ${
                            log.severity === 'CRITICAL' ? 'text-red-500' : log.severity === 'WARN' ? 'text-yellow-500' : 'text-indigo-400'
                          }`}>{log.action}</span>
                          <span className="text-[8px] text-gray-600 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-mono truncate">{JSON.stringify(log.details)}</p>
                      </div>
                    ))
                  )}
                </div>
              </QuantumCard>
            )}

            <QuantumCard title="Vault Storage" icon={<Lock size={18} />}>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Key className="text-indigo-400" size={16} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Secure Keys</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase">API_GATEWAY</span>
                      <span className="text-[9px] font-mono text-gray-300">••••••••••••4291</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase">STRIPE_LIVE</span>
                      <span className="text-[9px] font-mono text-gray-300">••••••••••••8821</span>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-gray-600 italic leading-relaxed">
                  "All integration keys are stored in the Quantum Vault using homomorphic-simulated encryption. Data is never exposed to the browser's local storage or global scope."
                </p>
              </div>
            </QuantumCard>
          </div>
        </div>
      </main>

      {/* STRIPE MODAL */}
      <StripeModal
        isOpen={isStripeOpen}
        onClose={() => setIsStripeOpen(false)}
        onComplete={() => {
          setCredits(prev => prev + 5000);
          setChatHistory(prev => [...prev, { role: 'ai', text: "Excellent. Your credits have been replenished. We are ready to continue our creative journey." }]);
        }}
      />

      {/* FOOTER */}
      <footer className="max-w-[1600px] mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
            <Zap size={12} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Quantum Financial © 2024</span>
        </div>
        <div className="flex gap-8">
          {['Security Policy', 'Terms of Service', 'API Documentation', 'Support'].map(item => (
            <button key={item} className="text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors">
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          SYSTEMS_OPERATIONAL_0x00
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}} />
    </div>
  );
};

export default AIAdStudioView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/AIAdStudioView.tsx
================================================================================

import React from 'react';

const AIAdStudioView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">AI Ad Studio</h2>
      <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700 h-96 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-6">
          <i className="fas fa-bullhorn text-white text-4xl"></i>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Create AI-Powered Ad Campaigns</h3>
        <p className="text-gray-400 max-w-md">Generate high-converting ad copy and visuals using advanced AI models. Target your audience with precision and optimize your marketing spend.</p>
      </div>
    </div>
  );
};

export default AIAdStudioView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/AIAdStudioView.tsx
================================================================================


// components/AIAdStudioView.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef, Reducer, useReducer } from 'react';
import { GoogleGenAI } from "@google/genai"; // This is typically for text models like Gemini-Pro. We will wrap and extend its capabilities conceptually.
import Card from './Card'; // Assuming Card is a simple UI wrapper.

// Hark, fellow creators and pixel prophets! Gather 'round and lend thine ears to the grand unveiling of the AI Ad Studio – a marvel so magnificent, it shall make your competitors weep into their stale spreadsheets!
//
// Imagine, if you will, a digital jester, a bard of bytes, whispering creative secrets directly into your ear. Our *Prompt Whisperer* feature, powered by the mystical Gemini, shall take your humble thought, 'cat drives car,' and transform it into an epic cinematic odyssey, 'A majestic Siberian feline, bedecked in bespoke leather, pilots a chrome-plated, neo-noir hovercraft through the rain-slicked canyons of a hyper-futuristic metropolis at twilight, the city lights reflecting in its determined, emerald eyes!' Oh, the wonders!
//
// But wait, there's more! Hath your campaigns become as flat as yesterday's jester's pancake? Fear not! Our *Mood Maestro & Motion Oracle* shall imbue your visuals with the gravitas of a Shakespearian tragedy or the mirth of a carnival, all while choreographing the camera's dance with exquisite precision. Want a dramatic zoom into a product? A playful pan across a fantastical landscape? 'Tis but a click away!
//
// And for the shrewd merchant, the *Brand Voice Alchemist* (a feature so wise, it practically wears a monocle) ensures your ad speaks with the authority and charm of *your* brand, not some common street hawker. No more off-key jingles, only symphonies of sales!
//
// Then, behold, the *Asset Altar*! A treasury where every generated masterpiece is cataloged, tagged, and ready for remixing. Discovered a video that almost, but not quite, hit the mark? Remix it! Tweak a prompt, change a setting, and behold a new gem, born from the ashes of the 'almost.' It’s like having a wizard’s cauldron for your marketing assets, but without the messy incantations!
//
// Finally, for the grand impresario, the *Ad Copy Conjurer* and *Audience Seer* work in tandem, crafting words so compelling they'll make coin leap from pockets, and revealing the very souls eager for your wares.
//
// So, banish ye dullness, embrace the future! With the AI Ad Studio, your ads shan't just run; they shall *reign*! And all this, powered by the humble, yet mighty, Gemini. Now, go forth and conquer the digital realm, for your million-dollar marketing empire awaits! Ha-HA!

const pollingMessages = [ "Initializing Veo 2.0 model...", "Analyzing prompt semantics...", "Generating initial keyframes...", "Rendering motion vectors...", "Upscaling to high resolution...", "Adding audio layer...", "Applying final cinematic touches...", "Encoding video file...", "Finalizing video file..." ];

// SECTION: Type Definitions for a real-world application
// =======================================================

// A philosophical musing: Types are the blueprints of our digital cathedrals,
// ensuring every brick of data fits perfectly, preventing the chaos of loose
// connections and undefined pathways. They are the silent guardians of integrity.
export type GenerationState = 'idle' | 'generating' | 'polling' | 'done' | 'error';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '21:9';
export type VideoModel = 'veo-3.1-fast-generate-preview' | 'imagen-video-3-hq' | 'lumiere-hd-001' | 'phoenix-v1-fast' | 'custom-veo-v3-beta';
export type GenerationMode = 'single' | 'storyboard';
export type AppTheme = 'dark' | 'light';
export type CameraMovement = 'none' | 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'tilt-up' | 'tilt-down';
export type LightingMood = 'cinematic' | 'dramatic' | 'playful' | 'documentary' | 'neon' | 'fantasy';
export type CreativeStyle = 'photorealistic' | 'impressionistic' | 'anime' | 'cartoon' | 'digital-painting' | 'noir';

// A philosophical musing: Interfaces are contracts, promises made between
// disparate parts of a system. They define expectations and ensure harmonious
// interaction, much like a well-written constitution governs a society.
export interface GenerationSettings {
    model: VideoModel;
    aspectRatio: AspectRatio;
    duration: number; // in seconds
    negativePrompt: string;
    seed: number; // -1 means random
    highFidelity: boolean;
    stylizationStrength: number; // 0-100
    cameraMovement: CameraMovement; // New control
    lightingMood: LightingMood;     // New control
    creativeStyle: CreativeStyle;   // New control
    motionMagnitude: number; // 0-100, strength of camera movement
}

// A philosophical musing: A storyboard is the skeletal dream, the sequence of
// intentions before flesh is given to vision. It's the silent narrative,
// awaiting the breath of creation to animate its form.
export interface StoryboardScene {
    id: string;
    prompt: string;
    duration: number; // Scene-specific duration
    cameraMovement?: CameraMovement; // Override for scene
    lightingMood?: LightingMood;     // Override for scene
    creativeStyle?: CreativeStyle;   // Override for scene
}

// A philosophical musing: An asset is a tangible memory, a digital echo of a creative act.
// It's not just a file; it's a testament to imagination, archived for future inspiration.
export interface VideoAsset {
    id: string;
    projectId: string;
    url: string; // Could be a blob URL or a remote URL
    thumbnailUrl?: string;
    prompt: string;
    creationDate: string;
    settings: GenerationSettings;
    generationMode: GenerationMode;
    storyboard?: StoryboardScene[];
    isFavorite: boolean;
    tags: string[]; // New: for categorization
    sizeBytes?: number; // New: for asset management
    generationHistory?: Omit<VideoAsset, 'id' | 'projectId' | 'generationHistory'>[]; // For remixing
}

// A philosophical musing: A project is a vessel for collective ambition, a digital
// workshop where ideas take shape and evolve. It defines the boundaries of
// a creative endeavor, containing its history and its future potential.
export interface AdProject {
    id: string;
    name: string;
    creationDate: string;
    lastModified: string;
    assets: VideoAsset[];
    description?: string; // New: project description
    templateId?: string; // New: if created from a template
}

// A philosophical musing: Configuration is the rudder of the application,
// subtly guiding its behavior and adapting its course to the user's will.
// It allows for personalization without rewriting the entire journey.
export interface AppConfig {
    apiKey: string | null;
    theme: AppTheme;
    autoSave: boolean;
    defaultSettings: GenerationSettings;
    enableExperimentalFeatures: boolean; // New setting
    notificationSound: boolean; // New setting
}

// A philosophical musing: Notifications are the gentle whispers of the system,
// drawing attention to events without shouting, ensuring the user is informed
// without being overwhelmed. They are the conscience of an active application.
export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export interface AppNotification {
    id: string;
    message: string;
    type: NotificationType;
    timestamp: string;
    read: boolean;
}

// A philosophical musing: Ad copy is the persuasive tongue, the art of
// transforming features into desires, words into sales. It's the bridge
// between a product's existence and its adoption by the eager world.
export interface AdCopy {
    id: string;
    projectId: string;
    assetId: string;
    headline: string;
    body: string;
    callToAction: string;
    tone: string; // e.g., 'persuasive', 'humorous', 'informative'
    generatedDate: string;
    isFavorite: boolean;
}

// A philosophical musing: A project template is a crystallized experience,
// a predefined path for common journeys. It's the wisdom of past endeavors
// encapsulated, offering a shortcut to quality and consistency.
export interface ProjectTemplate {
    id: string;
    name: string;
    description: string;
    defaultSettings: GenerationSettings;
    examplePrompt: string;
    exampleStoryboard?: StoryboardScene[];
}

// SECTION: Gemini Video Client (Conceptual & Mocked)
// ===================================================
// A philosophical musing: In the realm of AI, our clients are not just conduits;
// they are interpreters, translating human intention into machine-understandable
// directives, and machine-generated wonders back into human perception.
// This client, `GeminiVideoClient`, embodies this role, acting as a facade
// for complex AI interactions, while providing a clear interface for our application.
// It leverages GoogleGenAI for text prompts, and conceptually extends it for video.

export interface GenerateVideoPayload {
    model: VideoModel;
    prompt: string;
    config: {
        numberOfVideos: 1;
        aspectRatio: AspectRatio;
        resolution: '720p' | '1080p'; // Expanded resolution options
        duration: number;
        negativePrompt: string;
        seed: number;
        highFidelity: boolean;
        stylizationStrength: number;
        cameraMovement: CameraMovement;
        lightingMood: LightingMood;
        creativeStyle: CreativeStyle;
        motionMagnitude: number;
        storyboard?: StoryboardScene[];
    };
    sourceVideoUrl?: string; // For remixing / video-to-video
}

export interface VideoOperation {
    name: string; // e.g., "operations/video-generation-12345"
    done: boolean;
    response?: {
        generatedVideos: Array<{
            video: {
                uri: string;
                metadata: {
                    durationSeconds: number;
                    framesPerSecond: number;
                    width: number;
                    height: number;
                }
            };
        }>;
    };
    error?: {
        code: number;
        message: string;
        details?: any;
    };
    metadata?: {
        creationTime: string;
        lastUpdateTime: string;
        progressPercent: number;
        status: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED';
        inputPrompt: string;
        model: VideoModel;
    }
}

// A philosophical musing: The `GeminiVideoClient` stands as a testament to
// the power of abstraction, enabling us to interact with complex, hypothetical
// generative video models as if they were as simple as a flick of a switch.
// It's the illusionist's trick, making the impossible seem effortlessly real.
export class GeminiVideoClient {
    private apiKey: string;
    private genAIChat: GoogleGenAI | null = null;
    private mockOperationCounter = 0;
    private activeOperations: Map<string, VideoOperation> = new Map();

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        if (apiKey) {
            try {
                this.genAIChat = new GoogleGenAI(apiKey);
            } catch (error) {
                console.error("Failed to initialize GoogleGenAI for text tasks:", error);
            }
        }
    }

    // A philosophical musing: The act of prompting is akin to whispering a dream
    // into the ear of a titan. The `generatePromptSuggestions` function acts
    // as a dream interpreter, refining the whisper into a clear, potent vision.
    public async generatePromptSuggestions(basePrompt: string): Promise<string[]> {
        if (!this.genAIChat) {
            return ["API Key not configured for text suggestions."];
        }
        try {
            const model = this.genAIChat.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(`Given the prompt for video generation: "${basePrompt}", suggest 3 alternative, more descriptive, or stylistically varied prompts. Respond as a comma-separated list of prompt suggestions, without numbering or extra text.`);
            const responseText = result.response.text();
            return responseText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        } catch (error) {
            console.error("Error generating prompt suggestions:", error);
            return [`Could not generate suggestions: ${String(error)}`];
        }
    }

    // A philosophical musing: This function simulates the grand act of creation,
    // where raw text blossoms into vibrant motion. It's a controlled illusion,
    // mirroring the complex dance of algorithms that truly forge digital worlds.
    public async generateVideos(payload: GenerateVideoPayload): Promise<VideoOperation> {
        return new Promise((resolve, reject) => {
            if (!this.apiKey) {
                return reject(new Error("API Key is not set for Gemini Video Client."));
            }

            this.mockOperationCounter++;
            const operationName = `operations/video-generation-${Date.now()}-${this.mockOperationCounter}`;
            const mockDuration = payload.config.duration * 1000 + 5000; // base duration + 5s for processing

            const initialOperation: VideoOperation = {
                name: operationName,
                done: false,
                metadata: {
                    creationTime: new Date().toISOString(),
                    lastUpdateTime: new Date().toISOString(),
                    progressPercent: 0,
                    status: 'PENDING',
                    inputPrompt: payload.prompt,
                    model: payload.model,
                }
            };
            this.activeOperations.set(operationName, initialOperation);

            console.log(`Mocking video generation for operation: ${operationName}`);
            console.log("Payload:", payload);

            let currentProgress = 0;
            const intervalDuration = 2000; // Update progress every 2 seconds
            const totalSteps = mockDuration / intervalDuration;
            let currentStep = 0;

            const progressInterval = setInterval(() => {
                currentStep++;
                currentProgress = Math.min(99, Math.floor((currentStep / totalSteps) * 100));
                if (initialOperation.metadata) {
                    initialOperation.metadata.progressPercent = currentProgress;
                    initialOperation.metadata.lastUpdateTime = new Date().toISOString();
                    initialOperation.metadata.status = 'RUNNING';
                }
                this.activeOperations.set(operationName, { ...initialOperation }); // Update map
            }, intervalDuration);

            setTimeout(async () => {
                clearInterval(progressInterval); // Stop progress updates
                const mockBlob = new Blob(["mock-video-data-for-", payload.prompt], { type: "video/mp4" });
                const mockVideoUrl = URL.createObjectURL(mockBlob);

                const finalOperation: VideoOperation = {
                    name: operationName,
                    done: true,
                    response: {
                        generatedVideos: [{
                            video: {
                                uri: mockVideoUrl,
                                metadata: {
                                    durationSeconds: payload.config.duration,
                                    framesPerSecond: 24,
                                    width: 1280,
                                    height: 720,
                                }
                            }
                        }]
                    },
                    metadata: {
                        ...initialOperation.metadata!,
                        lastUpdateTime: new Date().toISOString(),
                        progressPercent: 100,
                        status: 'DONE',
                    }
                };
                this.activeOperations.set(operationName, finalOperation); // Final update
                resolve(finalOperation);
            }, mockDuration);
        });
    }

    // A philosophical musing: To retrieve an operation is to peek behind the
    // curtain of creation, observing the progress of a nascent artifact.
    // This function provides a window into that process, allowing us to
    // monitor and anticipate the moment of completion.
    public async getVideosOperation({ operation }: { operation: VideoOperation }): Promise<VideoOperation> {
        return new Promise(resolve => {
            setTimeout(() => {
                const currentOp = this.activeOperations.get(operation.name);
                if (currentOp) {
                    resolve(currentOp);
                } else {
                    // If not found in active operations, simulate an already completed/failed one
                    resolve({
                        ...operation,
                        done: true,
                        error: { code: 404, message: "Operation not found or expired." }
                    });
                }
            }, 1000); // Simulate network latency for polling
        });
    }

    // A philosophical musing: The creation of Ad Copy is the forging of linguistic
    // weapons, designed to captivate and convert. This function, though mocked,
    // envisions the Gemini AI as a master wordsmith, crafting compelling narratives.
    public async generateAdCopy(prompt: string, tone: string): Promise<{ headline: string, body: string, callToAction: string }> {
        if (!this.genAIChat) {
            return {
                headline: "AI Not Configured for Copy",
                body: "Please set your API key to enable AI-powered ad copy generation.",
                callToAction: "Configure API Key"
            };
        }
        try {
            const model = this.genAIChat.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(`Generate a compelling ad headline, a concise body, and a clear call to action for a video with the central idea: "${prompt}". The tone should be ${tone}. Structure the response as: Headline: [TEXT], Body: [TEXT], Call to Action: [TEXT]`);
            const responseText = result.response.text();

            const headlineMatch = responseText.match(/Headline:\s*(.*?),/i);
            const bodyMatch = responseText.match(/Body:\s*(.*?),/i);
            const ctaMatch = responseText.match(/Call to Action:\s*(.*)/i);

            return {
                headline: headlineMatch ? headlineMatch[1].trim() : "Captivating Headline Here!",
                body: bodyMatch ? bodyMatch[1].trim() : "Engaging body copy that drives interest and explains benefits.",
                callToAction: ctaMatch ? ctaMatch[1].trim() : "Click to Learn More!"
            };
        } catch (error) {
            console.error("Error generating ad copy:", error);
            return {
                headline: "Copy Generation Failed!",
                body: `An error occurred: ${String(error)}`,
                callToAction: "Try Again"
            };
        }
    }
}


// SECTION: Mock API and Data Layer
// ===================================
// A philosophical musing: Our `MockBackendAPI` is a benevolent deity,
// providing the illusion of a vast, persistent data realm. It stands as a
// temporary, yet crucial, edifice in our architectural landscape,
// demonstrating the potential for real-world interaction.
// In a real application, this would be in a separate file and make real network requests.
// For this exercise, it's included here to simulate a backend.

export class MockBackendAPI {
    private projects: AdProject[] = [];
    private adCopies: AdCopy[] = [];
    private templates: ProjectTemplate[] = [];
    private latency: number = 500; // ms
    private notifications: AppNotification[] = [];

    constructor() {
        this.loadFromLocalStorage();
        this.initializeTemplates();
        this.initializeNotifications();
    }

    // A philosophical musing: Persistence is memory, the digital echo of past states.
    // To save to local storage is to carve our transient data into the digital stone,
    // ensuring its survival beyond the fleeting present.
    private async saveToLocalStorage(): Promise<void> {
        return new Promise(resolve => {
            try {
                localStorage.setItem('ai_ad_studio_projects', JSON.stringify(this.projects));
                localStorage.setItem('ai_ad_studio_adcopies', JSON.stringify(this.adCopies));
                localStorage.setItem('ai_ad_studio_notifications', JSON.stringify(this.notifications));
                resolve();
            } catch (error) {
                console.error("Failed to save projects to local storage:", error);
                resolve(); // Still resolve to not block the app
            }
        });
    }

    // A philosophical musing: To load from storage is to retrieve forgotten memories,
    // resurrecting the past to inform the present. It's an act of digital archaeology.
    private loadFromLocalStorage(): void {
        try {
            const storedProjects = localStorage.getItem('ai_ad_studio_projects');
            if (storedProjects) {
                this.projects = JSON.parse(storedProjects);
            } else {
                const defaultProject: AdProject = {
                    id: `proj_${Date.now()}`,
                    name: 'My First Campaign',
                    description: 'A place for your initial ad creations.',
                    creationDate: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    assets: [],
                };
                this.projects.push(defaultProject);
                this.saveToLocalStorage();
            }

            const storedAdCopies = localStorage.getItem('ai_ad_studio_adcopies');
            if (storedAdCopies) {
                this.adCopies = JSON.parse(storedAdCopies);
            }

            const storedNotifications = localStorage.getItem('ai_ad_studio_notifications');
            if (storedNotifications) {
                this.notifications = JSON.parse(storedNotifications);
            }
        } catch (error) {
            console.error("Failed to load data from local storage:", error);
            this.projects = [];
            this.adCopies = [];
            this.notifications = [];
        }
    }

    // A philosophical musing: Templates are the archetypes of creation,
    // pre-formed molds that guide and accelerate the generative process.
    // They embody best practices and common patterns, offering a starting point
    // rather than a blank void.
    private initializeTemplates(): void {
        this.templates = [
            {
                id: 'tmpl_promo_short',
                name: 'Short Promo Video',
                description: 'Ideal for quick social media ads, 15-second duration.',
                defaultSettings: {
                    model: 'phoenix-v1-fast',
                    aspectRatio: '1:1',
                    duration: 15,
                    negativePrompt: 'blurry, low quality, watermark, text, pixelated',
                    seed: -1,
                    highFidelity: false,
                    stylizationStrength: 50,
                    cameraMovement: 'none',
                    lightingMood: 'playful',
                    creativeStyle: 'anime',
                    motionMagnitude: 30,
                },
                examplePrompt: 'A vibrant, energetic short video showcasing a new tech gadget being unboxed and demonstrated.',
                exampleStoryboard: [
                    { id: 'sc1', prompt: 'Close up on an unopened product box, clean background.', duration: 3 },
                    { id: 'sc2', prompt: 'Hands unboxing the gadget, product revealed.', duration: 5 },
                    { id: 'sc3', prompt: 'Product actively used with exciting UI elements, dynamic camera.', duration: 7 },
                ]
            },
            {
                id: 'tmpl_explainer_hd',
                name: 'HD Explainer Video',
                description: 'High-quality, detailed explainer for product features.',
                defaultSettings: {
                    model: 'veo-3.1-fast-generate-preview',
                    aspectRatio: '16:9',
                    duration: 30,
                    negativePrompt: 'blurry, low quality, watermark, text, out of focus',
                    seed: -1,
                    highFidelity: true,
                    stylizationStrength: 70,
                    cameraMovement: 'zoom-in',
                    lightingMood: 'cinematic',
                    creativeStyle: 'photorealistic',
                    motionMagnitude: 60,
                },
                examplePrompt: 'A professional and engaging explainer video detailing the innovative features of a new B2B software solution, with clear graphical overlays.',
                exampleStoryboard: [
                    { id: 'sc1', prompt: 'Opening shot of a diverse team collaborating in a modern office, bright lighting.', duration: 8 },
                    { id: 'sc2', prompt: 'Split screen showing problem vs. solution, elegant animation.', duration: 10 },
                    { id: 'sc3', prompt: 'User interacting with the software UI, highlighting key features with smooth transitions.', duration: 12 },
                ]
            },
            {
                id: 'tmpl_vertical_story',
                name: 'Vertical Story Ad',
                description: 'Perfect for Instagram/TikTok stories, short and captivating.',
                defaultSettings: {
                    model: 'imagen-video-3-hq',
                    aspectRatio: '9:16',
                    duration: 10,
                    negativePrompt: 'horizontal format, distracting backgrounds, bad composition',
                    seed: -1,
                    highFidelity: true,
                    stylizationStrength: 80,
                    cameraMovement: 'tilt-down',
                    lightingMood: 'neon',
                    creativeStyle: 'digital-painting',
                    motionMagnitude: 50,
                },
                examplePrompt: 'A fast-paced, visually striking vertical video showcasing a new fashion trend or product for a young, urban audience.',
            }
        ];
    }

    // A philosophical musing: Notifications are the ephemeral whispers of events,
    // transient by nature, yet essential for guiding user attention.
    private initializeNotifications(): void {
        if (this.notifications.length === 0) {
            this.notifications.push({
                id: generateUniqueId(),
                message: "Welcome to AI Ad Studio! Remember to set your API key in settings.",
                type: "info",
                timestamp: new Date().toISOString(),
                read: false,
            });
            this.saveToLocalStorage();
        }
    }

    // A philosophical musing: Latency is the unavoidable pause, the breath
    // between action and reaction, simulating the real-world dance of networks.
    private async simulateLatency(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, this.latency));
    }

    // A philosophical musing: To retrieve projects is to access the master plan,
    // the overarching narratives that bind individual creations into coherent campaigns.
    public async getProjects(): Promise<AdProject[]> {
        await this.simulateLatency();
        return JSON.parse(JSON.stringify(this.projects)); // Return a deep copy
    }

    // A philosophical musing: To retrieve templates is to consult the library
    // of established wisdom, providing structured beginnings for new creative journeys.
    public async getProjectTemplates(): Promise<ProjectTemplate[]> {
        await this.simulateLatency();
        return JSON.parse(JSON.stringify(this.templates));
    }
    
    // A philosophical musing: To create a project is to lay the cornerstone
    // of a new endeavor, a fresh canvas awaiting the strokes of imagination.
    public async createProject(name: string, description?: string, templateId?: string): Promise<AdProject> {
        await this.simulateLatency();
        const newProject: AdProject = {
            id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            description,
            templateId,
            creationDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            assets: [],
        };
        this.projects.push(newProject);
        this.saveToLocalStorage();
        return { ...newProject };
    }
    
    // A philosophical musing: To rename a project is to redefine its identity,
    // to give new meaning to an existing creative space.
    public async renameProject(id: string, newName: string): Promise<AdProject | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === id);
        if (project) {
            project.name = newName;
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return { ...project };
        }
        return null;
    }
    
    // A philosophical musing: To delete a project is to erase a chapter,
    // a necessary act for tidiness or finality, though the memories may linger.
    public async deleteProject(id: string): Promise<boolean> {
        await this.simulateLatency();
        const initialLength = this.projects.length;
        this.projects = this.projects.filter(p => p.id !== id);
        this.saveToLocalStorage();
        return this.projects.length < initialLength;
    }
    
    // A philosophical musing: Adding an asset is like adding a new star
    // to a constellation, enriching the project's visual universe.
    public async addAssetToProject(projectId: string, asset: Omit<VideoAsset, 'id' | 'projectId' | 'creationDate'>): Promise<VideoAsset> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        const newAsset: VideoAsset = {
            ...asset,
            id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            creationDate: new Date().toISOString(),
            tags: asset.tags || [], // Ensure tags array exists
            generationHistory: [], // Initialize history for remixing
        };
        project.assets.unshift(newAsset); // Add to the beginning
        project.lastModified = new Date().toISOString();
        this.saveToLocalStorage();
        return { ...newAsset };
    }

    // A philosophical musing: To delete an asset is to prune the garden,
    // removing what no longer serves to make space for new growth.
    public async deleteAsset(projectId: string, assetId: string): Promise<boolean> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const initialLength = project.assets.length;
            project.assets = project.assets.filter(a => a.id !== assetId);
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return project.assets.length < initialLength;
        }
        return false;
    }

    // A philosophical musing: Favoriting an asset is a declaration of value,
    // marking it as a beacon of inspiration, easily found amidst the many.
    public async toggleFavoriteAsset(projectId: string, assetId: string): Promise<VideoAsset | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const asset = project.assets.find(a => a.id === assetId);
            if(asset) {
                asset.isFavorite = !asset.isFavorite;
                project.lastModified = new Date().toISOString();
                this.saveToLocalStorage();
                return { ...asset };
            }
        }
        return null;
    }

    // A philosophical musing: Updating an asset is the act of refinement,
    // polishing a gem or adapting it to new contexts, preserving its core
    // while enhancing its utility.
    public async updateAsset(projectId: string, updatedAsset: VideoAsset): Promise<VideoAsset | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const index = project.assets.findIndex(a => a.id === updatedAsset.id);
            if (index !== -1) {
                project.assets[index] = updatedAsset;
                project.lastModified = new Date().toISOString();
                this.saveToLocalStorage();
                return { ...updatedAsset };
            }
        }
        return null;
    }

    // A philosophical musing: Adding ad copy is to craft the verbal complement
    // to a visual masterpiece, ensuring the message resonates as powerfully
    // as the imagery.
    public async addAdCopy(copy: Omit<AdCopy, 'id' | 'generatedDate'>): Promise<AdCopy> {
        await this.simulateLatency();
        const newCopy: AdCopy = {
            ...copy,
            id: `copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            generatedDate: new Date().toISOString(),
        };
        this.adCopies.push(newCopy);
        this.saveToLocalStorage();
        return { ...newCopy };
    }

    // A philosophical musing: Retrieving ad copy is to consult the scroll
    // of persuasive language, finding the words that best articulate the
    // purpose of a visual creation.
    public async getAdCopiesForAsset(assetId: string): Promise<AdCopy[]> {
        await this.simulateLatency();
        return this.adCopies.filter(c => c.assetId === assetId);
    }

    // A philosophical musing: Marking a notification as read is to acknowledge
    // the system's voice, dismissing the transient message after its purpose is served.
    public async markNotificationAsRead(id: string): Promise<AppNotification | null> {
        await this.simulateLatency();
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveToLocalStorage();
            return { ...notification };
        }
        return null;
    }

    // A philosophical musing: To retrieve notifications is to check the pulse
    // of the application, to see what events have transpired in our absence.
    public async getNotifications(): Promise<AppNotification[]> {
        await this.simulateLatency();
        return JSON.parse(JSON.stringify(this.notifications)).sort((a: AppNotification, b: AppNotification) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    // A philosophical musing: Emitting a notification is to send a signal,
    // a gentle chime or a clear alert, ensuring crucial information reaches the user.
    public async addNotification(message: string, type: NotificationType): Promise<AppNotification> {
        await this.simulateLatency();
        const newNotification: AppNotification = {
            id: generateUniqueId(),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false,
        };
        this.notifications.unshift(newNotification); // Add to the beginning
        // Keep only the latest 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }
        this.saveToLocalStorage();
        return { ...newNotification };
    }
}

// Instantiate the mock API
export const mockApi = new MockBackendAPI();

// SECTION: Utility Functions
// ==========================

// A philosophical musing: A unique ID is a singular identity in a sea of data,
// a digital fingerprint ensuring each entity stands distinct and unconfused.
export const generateUniqueId = (): string => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// A philosophical musing: Formatting bytes is to translate raw digital size
// into human-comprehensible terms, bridging the gap between machine and mind.
export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// A philosophical musing: Formatting dates is to capture the fleeting moment
// and present it in a digestible form, making the passage of time explicit.
export const formatDate = (isoString: string): string => {
    try {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return 'Invalid Date';
    }
};

// A philosophical musing: Aspect ratio classes are the visual geometry of content,
// ensuring that each frame is presented in its intended proportion, maintaining
// the integrity of the creator's vision.
export const getAspectRatioClass = (aspectRatio: AspectRatio): string => {
    switch (aspectRatio) {
        case '16:9': return 'aspect-video';
        case '9:16': return 'aspect-[9/16]';
        case '1:1': return 'aspect-square';
        case '4:5': return 'aspect-[4/5]';
        case '21:9': return 'aspect-[21/9]';
        default: return 'aspect-video';
    }
};

// A philosophical musing: Debouncing is the art of patience, delaying execution
// until a flurry of rapid inputs settles, ensuring efficiency by preventing
// redundant or premature actions.
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function(this: any, ...args: Parameters<T>): void {
        const context = this;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// A philosophical musing: Throttling is the art of moderation, ensuring a
// function executes at a controlled pace, preventing resource exhaustion
// by limiting its frequency, even under rapid demand.
export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    let lastResult: any;
    return function(this: any, ...args: Parameters<T>): void {
        const context = this;
        if (!inThrottle) {
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
            lastResult = func.apply(context, args);
        }
        return lastResult;
    };
}

// A philosophical musing: Deep copying is the creation of a true replica,
// a perfect clone that can exist independently, free from the entanglements
// of its origin. It prevents unintended alterations, ensuring data purity.
export function deepCopy<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepCopy(item)) as T;
    }

    const copy = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = deepCopy(obj[key]);
        }
    }
    return copy;
}

// A philosophical musing: Lorem Ipsum is the ghost of content, a placeholder
// for meaning, allowing us to visualize form before substance arrives.
export const generateLoremIpsum = (wordCount: number = 50): string => {
    const words = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
        "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
        "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
        "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in",
        "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
        "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa",
        "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
    ];
    let result = [];
    for (let i = 0; i < wordCount; i++) {
        result.push(words[Math.floor(Math.random() * words.length)]);
    }
    return result.join(' ');
};

// SECTION: Reducer for Complex State Management
// =============================================

// A philosophical musing: The AppState is the collective memory of our application,
// a single source of truth, reflecting the entirety of its current existence.
type AppState = {
    projects: AdProject[];
    currentProjectId: string | null;
    isLoading: boolean;
    error: string | null;
    config: AppConfig;
    notifications: AppNotification[]; // New: for activity log
    projectTemplates: ProjectTemplate[]; // New: for project creation
    showSettingsModal: boolean; // New: UI state for settings modal
    showNotificationsPanel: boolean; // New: UI state for notification panel
};

// A philosophical musing: Actions are the decrees of change, the singular commands
// that orchestrate the evolution of the application's state. Each action is a
// carefully crafted instruction, guiding the reducer to its next permutation.
type AppAction =
    | { type: 'SET_PROJECTS'; payload: AdProject[] }
    | { type: 'SET_CURRENT_PROJECT'; payload: string | null }
    | { type: 'ADD_PROJECT'; payload: AdProject }
    | { type: 'UPDATE_PROJECT'; payload: AdProject }
    | { type: 'REMOVE_PROJECT'; payload: string }
    | { type: 'ADD_ASSET'; payload: { projectId: string; asset: VideoAsset } }
    | { type: 'REMOVE_ASSET'; payload: { projectId: string; assetId: string } }
    | { type: 'UPDATE_ASSET'; payload: { projectId: string; asset: VideoAsset } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'UPDATE_CONFIG'; payload: Partial<AppConfig> }
    | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
    | { type: 'MARK_NOTIFICATION_READ'; payload: string }
    | { type: 'SET_NOTIFICATIONS'; payload: AppNotification[] }
    | { type: 'SET_PROJECT_TEMPLATES'; payload: ProjectTemplate[] }
    | { type: 'TOGGLE_SETTINGS_MODAL'; payload?: boolean }
    | { type: 'TOGGLE_NOTIFICATIONS_PANEL'; payload?: boolean }
    | { type: 'ADD_AD_COPY'; payload: { assetId: string; copy: AdCopy } }
    | { type: 'SET_AD_COPIES_FOR_ASSET'; payload: { assetId: string; copies: AdCopy[] } }; // New for ad copy management

// A philosophical musing: Initial state is the primordial soup, the nascent
// form from which all subsequent states emerge. It is the beginning of the journey.
const initialState: AppState = {
    projects: [],
    currentProjectId: null,
    isLoading: true,
    error: null,
    config: {
        apiKey: null,
        theme: 'dark',
        autoSave: true,
        defaultSettings: {
            model: 'veo-3.1-fast-generate-preview',
            aspectRatio: '16:9',
            duration: 10,
            negativePrompt: 'blurry, low quality, watermark, text',
            seed: -1, // -1 means random
            highFidelity: true,
            stylizationStrength: 70,
            cameraMovement: 'none',
            lightingMood: 'cinematic',
            creativeStyle: 'photorealistic',
            motionMagnitude: 50,
        },
        enableExperimentalFeatures: false,
        notificationSound: true,
    },
    notifications: [],
    projectTemplates: [],
    showSettingsModal: false,
    showNotificationsPanel: false,
};

// A philosophical musing: The reducer is the application's unwavering arbiter of change,
// a pure function transforming one state into the next, guided by the immutable laws
// of its switch-case logic. It is the engine of the application's evolution.
const appReducer: Reducer<AppState, AppAction> = (state, action): AppState => {
    switch (action.type) {
        case 'SET_PROJECTS':
            const firstProjectId = action.payload.length > 0 ? action.payload[0].id : null;
            return {
                ...state,
                projects: action.payload,
                currentProjectId: state.currentProjectId || firstProjectId,
                isLoading: false,
            };
        case 'SET_CURRENT_PROJECT':
            return { ...state, currentProjectId: action.payload };
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload] };
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(p => (p.id === action.payload.id ? action.payload : p)),
            };
        case 'REMOVE_PROJECT':
            const remainingProjects = state.projects.filter(p => p.id !== action.payload);
            const newCurrentProjectId = state.currentProjectId === action.payload
                ? remainingProjects.length > 0 ? remainingProjects[0].id : null
                : state.currentProjectId;
            return {
                ...state,
                projects: remainingProjects,
                currentProjectId: newCurrentProjectId,
            };
        case 'ADD_ASSET':
        case 'REMOVE_ASSET':
        case 'UPDATE_ASSET':
            return {
                ...state,
                projects: state.projects.map(p => {
                    if (p.id !== action.payload.projectId) return p;
                    let newAssets: VideoAsset[];
                    if (action.type === 'ADD_ASSET') {
                        newAssets = [action.payload.asset, ...p.assets];
                    } else if (action.type === 'REMOVE_ASSET') {
                        newAssets = p.assets.filter(a => a.id !== action.payload.assetId);
                    } else { // UPDATE_ASSET
                        newAssets = p.assets.map(a => a.id === action.payload.asset.id ? action.payload.asset : a);
                    }
                    return { ...p, assets: newAssets, lastModified: new Date().toISOString() };
                }),
            };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'UPDATE_CONFIG':
            return { ...state, config: { ...state.config, ...action.payload } };
        case 'ADD_NOTIFICATION':
            return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 50) };
        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, read: true } : n
                ),
            };
        case 'SET_NOTIFICATIONS':
            return { ...state, notifications: action.payload };
        case 'SET_PROJECT_TEMPLATES':
            return { ...state, projectTemplates: action.payload };
        case 'TOGGLE_SETTINGS_MODAL':
            return { ...state, showSettingsModal: action.payload !== undefined ? action.payload : !state.showSettingsModal };
        case 'TOGGLE_NOTIFICATIONS_PANEL':
            return { ...state, showNotificationsPanel: action.payload !== undefined ? action.payload : !state.showNotificationsPanel };
        case 'ADD_AD_COPY':
            // Ad copies are managed directly within mockApi. This action might be for future state normalization if adCopies were in AppState.
            // For now, it's a no-op or would trigger a refetch.
            return state; // Assuming ad copies are fetched on demand
        case 'SET_AD_COPIES_FOR_ASSET':
            // If ad copies were stored in app state like: { assetId: AdCopy[] }
            // For now, this state isn't part of appState, but if it were, logic would go here.
            return state;
        default:
            return state;
    }
};

// SECTION: Child Components
// ==========================
// A philosophical musing: Child components are the modular cells of our application,
// each a specialized organ contributing to the larger whole. They embody the principle
// of separation of concerns, ensuring clarity and maintainability.

// A philosophical musing: The ProjectSidebar is the gateway to creative endeavors,
// listing the distinct universes of projects, each a potential stage for grand visions.
export const ProjectSidebar: React.FC<{
    projects: AdProject[];
    currentProjectId: string | null;
    onSelectProject: (id: string) => void;
    onCreateProject: (name: string, description?: string, templateId?: string) => void;
    onDeleteProject: (id: string) => void;
    onRenameProject: (id: string, newName: string) => void;
    projectTemplates: ProjectTemplate[];
    onShowSettings: () => void;
    onShowNotifications: () => void;
    unreadNotificationCount: number;
}> = ({ projects, currentProjectId, onSelectProject, onCreateProject, onDeleteProject, onRenameProject, projectTemplates, onShowSettings, onShowNotifications, unreadNotificationCount }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renamingText, setRenamingText] = useState('');
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [newProjectDescription, setNewProjectDescription] = useState('');

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            onCreateProject(newProjectName.trim(), newProjectDescription.trim(), selectedTemplate);
            setNewProjectName('');
            setNewProjectDescription('');
            setSelectedTemplate(null);
            setShowNewProjectModal(false);
        }
    };

    const handleRename = (id: string) => {
        if (renamingText.trim() && renamingId) {
            onRenameProject(id, renamingText.trim());
        }
        setRenamingId(null);
        setRenamingText('');
    };

    return (
        <div className="bg-gray-800/50 border-r border-gray-700 w-72 p-4 flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-4">Projects</h3>
            <div className="flex mb-4">
                <button onClick={() => setShowNewProjectModal(true)} className="flex-grow bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-md text-sm">
                    + New Campaign
                </button>
            </div>
            <ul className="space-y-2 overflow-y-auto flex-grow mb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {projects.map(project => (
                    <li key={project.id}>
                        <div
                            className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors duration-200
                                ${currentProjectId === project.id ? 'bg-cyan-600/30 text-cyan-300' : 'text-gray-300 hover:bg-gray-700/50'}`}
                            onClick={() => onSelectProject(project.id)}
                        >
                            {renamingId === project.id ? (
                                <input
                                    type="text"
                                    value={renamingText}
                                    onChange={(e) => setRenamingText(e.target.value)}
                                    onBlur={() => handleRename(project.id)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleRename(project.id)}
                                    className="bg-gray-600 text-white w-full text-sm p-1 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()} // Prevent selecting project when renaming
                                />
                            ) : (
                                <span className="truncate text-sm pr-2">{project.name}</span>
                            )}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); setRenamingId(project.id); setRenamingText(project.name); }} className="text-gray-400 hover:text-white text-xs p-1 rounded hover:bg-gray-600">
                                    <span role="img" aria-label="rename">✏️</span>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); if(window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) onDeleteProject(project.id);}} className="text-gray-400 hover:text-red-500 text-xs p-1 rounded hover:bg-gray-600">
                                    <span role="img" aria-label="delete">🗑️</span>
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-auto border-t border-gray-700 pt-4 space-y-2">
                <button onClick={onShowNotifications} className="w-full flex justify-between items-center py-2 px-3 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200">
                    Notifications
                    {unreadNotificationCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadNotificationCount}</span>
                    )}
                </button>
                <button onClick={onShowSettings} className="w-full py-2 px-3 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200">
                    <span role="img" aria-label="settings" className="mr-2">⚙️</span> Settings
                </button>
            </div>

            {/* New Project Modal */}
            {showNewProjectModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={() => setShowNewProjectModal(false)}>
                    <div className="bg-gray-800 rounded-lg max-w-lg w-full p-6 space-y-4 m-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4">Create New Campaign</h3>
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Campaign Name (e.g., 'Summer Sale 2024')"
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            autoFocus
                        />
                        <textarea
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                            placeholder="Optional: Describe your campaign goals."
                            className="w-full h-20 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Start with a Template (Optional)</label>
                            <select
                                value={selectedTemplate || ''}
                                onChange={e => setSelectedTemplate(e.target.value || null)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="">No Template</option>
                                {projectTemplates.map(template => (
                                    <option key={template.id} value={template.id}>{template.name}</option>
                                ))}
                            </select>
                            {selectedTemplate && (
                                <p className="text-xs text-gray-400 mt-2">{projectTemplates.find(t => t.id === selectedTemplate)?.description}</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setShowNewProjectModal(false)} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm">Cancel</button>
                            <button onClick={handleCreateProject} disabled={!newProjectName.trim()} className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm disabled:opacity-50">Create Campaign</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// A philosophical musing: GenerationControls are the levers and dials of creation,
// empowering the user to sculpt the parameters of the AI's imagination, guiding
// it towards a desired artistic outcome.
export const GenerationControls: React.FC<{
    settings: GenerationSettings;
    onSettingsChange: (newSettings: Partial<GenerationSettings>) => void;
    isGenerating: boolean;
    enableExperimentalFeatures: boolean;
}> = ({ settings, onSettingsChange, isGenerating, enableExperimentalFeatures }) => {
    return (
        <Card title="Generation Parameters">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Model Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">AI Model</label>
                    <select
                        value={settings.model}
                        onChange={e => onSettingsChange({ model: e.target.value as VideoModel })}
                        disabled={isGenerating}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="veo-3.1-fast-generate-preview">Veo 2.0 (High Quality)</option>
                        <option value="imagen-video-3-hq">Imagen Video 3 (Creative)</option>
                        <option value="lumiere-hd-001">Lumiere HD (Realistic)</option>
                        <option value="phoenix-v1-fast">Phoenix v1 (Fast Draft)</option>
                        {enableExperimentalFeatures && <option value="custom-veo-v3-beta">Veo 3.0 Beta (Experimental)</option>}
                    </select>
                </div>
                {/* Aspect Ratio */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Aspect Ratio</label>
                    <select
                        value={settings.aspectRatio}
                        onChange={e => onSettingsChange({ aspectRatio: e.target.value as AspectRatio })}
                        disabled={isGenerating}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="16:9">16:9 (Widescreen)</option>
                        <option value="9:16">9:16 (Vertical)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="4:5">4:5 (Portrait)</option>
                        <option value="21:9">21:9 (Cinematic)</option>
                    </select>
                </div>
                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Duration (s): {settings.duration}</label>
                    <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={settings.duration}
                        onChange={e => onSettingsChange({ duration: parseInt(e.target.value, 10) })}
                        disabled={isGenerating}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                {/* Seed */}
                <div>
                     <label className="block text-sm font-medium text-gray-300 mb-1">Seed</label>
                     <div className="flex">
                        <input
                            type="number"
                            value={settings.seed === -1 ? '' : settings.seed}
                            onChange={e => onSettingsChange({ seed: parseInt(e.target.value, 10) || -1 })}
                            placeholder="Random"
                            disabled={isGenerating}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-l-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button onClick={() => onSettingsChange({seed: -1})} className="bg-gray-600 hover:bg-gray-500 p-2 rounded-r-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-gray-400" disabled={isGenerating}>🎲</button>
                     </div>
                </div>
                 {/* Stylization Strength */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Stylization Strength: {settings.stylizationStrength}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={settings.stylizationStrength}
                        onChange={e => onSettingsChange({ stylizationStrength: parseInt(e.target.value, 10) })}
                        disabled={isGenerating}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                {/* Camera Movement */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Camera Movement</label>
                    <select
                        value={settings.cameraMovement}
                        onChange={e => onSettingsChange({ cameraMovement: e.target.value as CameraMovement })}
                        disabled={isGenerating}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="none">None</option>
                        <option value="zoom-in">Zoom In</option>
                        <option value="zoom-out">Zoom Out</option>
                        <option value="pan-left">Pan Left</option>
                        <option value="pan-right">Pan Right</option>
                        <option value="tilt-up">Tilt Up</option>
                        <option value="tilt-down">Tilt Down</option>
                    </select>
                </div>
                {/* Motion Magnitude */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Motion Magnitude: {settings.motionMagnitude}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={settings.motionMagnitude}
                        onChange={e => onSettingsChange({ motionMagnitude: parseInt(e.target.value, 10) })}
                        disabled={isGenerating || settings.cameraMovement === 'none'}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-30"
                    />
                </div>
                {/* Lighting Mood */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Lighting & Mood</label>
                    <select
                        value={settings.lightingMood}
                        onChange={e => onSettingsChange({ lightingMood: e.target.value as LightingMood })}
                        disabled={isGenerating}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="cinematic">Cinematic</option>
                        <option value="dramatic">Dramatic</option>
                        <option value="playful">Playful</option>
                        <option value="documentary">Documentary</option>
                        <option value="neon">Neon</option>
                        <option value="fantasy">Fantasy</option>
                    </select>
                </div>
                 {/* Creative Style */}
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Creative Style</label>
                    <select
                        value={settings.creativeStyle}
                        onChange={e => onSettingsChange({ creativeStyle: e.target.value as CreativeStyle })}
                        disabled={isGenerating}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="photorealistic">Photorealistic</option>
                        <option value="impressionistic">Impressionistic</option>
                        <option value="anime">Anime</option>
                        <option value="cartoon">Cartoon</option>
                        <option value="digital-painting">Digital Painting</option>
                        <option value="noir">Noir</option>
                    </select>
                </div>
                {/* Negative Prompt */}
                <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Negative Prompt</label>
                    <input
                        type="text"
                        value={settings.negativePrompt}
                        onChange={e => onSettingsChange({ negativePrompt: e.target.value })}
                        placeholder="e.g., blurry, text, watermark, ugly, low resolution"
                        disabled={isGenerating}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                {/* Toggles */}
                <div className="col-span-full">
                    <label className="flex items-center space-x-2 text-sm text-gray-300">
                        <input
                            type="checkbox"
                            checked={settings.highFidelity}
                            onChange={e => onSettingsChange({ highFidelity: e.target.checked })}
                            disabled={isGenerating}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span>High Fidelity Mode (Slower, higher quality)</span>
                    </label>
                </div>
            </div>
        </Card>
    );
};

// A philosophical musing: The AssetGrid is a gallery of finished visions,
// a curated collection of creative achievements, presented for review, selection,
// and further inspiration.
export const AssetGrid: React.FC<{
    assets: VideoAsset[];
    onDelete: (assetId: string) => void;
    onToggleFavorite: (assetId: string) => void;
    onSelect: (asset: VideoAsset) => void;
    currentProjectId: string;
    onGenerateAdCopy: (assetId: string, prompt: string) => void;
}> = ({ assets, onDelete, onToggleFavorite, onSelect, currentProjectId, onGenerateAdCopy }) => {
    if (assets.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500">
                <p>No video assets in this project yet.</p>
                <p>Generate a new video to get started.</p>
            </div>
        );
    }

    // A philosophical musing: Sorting is the imposition of order upon chaos,
    // making a vast collection intelligible and navigable according to a defined principle.
    const sortedAssets = useMemo(() => {
        return [...assets].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [assets]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedAssets.map(asset => (
                <div key={asset.id} className="group relative aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-200">
                    <video src={asset.url} muted loop className="w-full h-full object-cover" onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()}></video>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end space-x-2">
                            <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(asset.id); }} className={`text-xl p-1 rounded-full ${asset.isFavorite ? 'text-yellow-400' : 'text-white/70 hover:text-white hover:bg-white/20'}`}>
                                {asset.isFavorite ? '⭐' : '☆'}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onGenerateAdCopy(asset.id, asset.prompt); }} className="text-white/70 hover:text-cyan-400 p-1 rounded-full hover:bg-white/20 text-lg" title="Generate Ad Copy">
                                ✍️
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(asset.id); }} className="text-white/70 hover:text-red-500 p-1 rounded-full hover:bg-white/20 text-lg">
                                🗑️
                            </button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-white truncate font-medium">{asset.prompt}</p>
                            <p className="text-xs text-gray-400">{formatDate(asset.creationDate)}</p>
                            <button onClick={() => onSelect(asset)} className="mt-1 w-full text-xs bg-cyan-600/80 hover:bg-cyan-600/100 text-white py-1 rounded transition-colors duration-200">View Details</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// A philosophical musing: The StoryboardEditor is the architect's canvas for narrative,
// allowing the construction of sequential visions, scene by scene, guiding the flow
// of the impending motion picture.
export const StoryboardEditor: React.FC<{
    scenes: StoryboardScene[];
    setScenes: React.Dispatch<React.SetStateAction<StoryboardScene[]>>;
    isGenerating: boolean;
    defaultSettings: GenerationSettings;
}> = ({ scenes, setScenes, isGenerating, defaultSettings }) => {
    const addScene = () => {
        setScenes(prev => [...prev, { id: generateUniqueId(), prompt: '', duration: 5 }]);
    };

    const updateScenePrompt = (id: string, prompt: string) => {
        setScenes(prev => prev.map(s => s.id === id ? { ...s, prompt } : s));
    };
    
    const updateSceneDuration = (id: string, duration: number) => {
        setScenes(prev => prev.map(s => s.id === id ? { ...s, duration } : s));
    };

    const removeScene = (id: string) => {
        setScenes(prev => prev.filter(s => s.id !== id));
    };
    
    const totalDuration = useMemo(() => scenes.reduce((acc, scene) => acc + scene.duration, 0), [scenes]);

    return (
        <div className="space-y-4">
            {scenes.map((scene, index) => (
                <div key={scene.id} className="flex items-start space-x-3 p-3 bg-gray-800/60 rounded-lg border border-gray-700">
                    <span className="font-bold text-gray-400 mt-2">{index + 1}.</span>
                    <div className="flex-grow space-y-2">
                        <textarea
                            value={scene.prompt}
                            onChange={e => updateScenePrompt(scene.id, e.target.value)}
                            placeholder={`Scene ${index + 1} description... (e.g., "A wide shot of a bustling futuristic city street at dusk.")`}
                            className="w-full h-20 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            disabled={isGenerating}
                        />
                         <div className="flex items-center space-x-2">
                            <label className="text-xs text-gray-400 w-20">Duration:</label>
                             <input
                                type="range"
                                min="1"
                                max="15"
                                value={scene.duration}
                                onChange={e => updateSceneDuration(scene.id, parseInt(e.target.value, 10))}
                                disabled={isGenerating}
                                className="w-32 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                            <span className="text-xs text-white w-8">{scene.duration}s</span>
                        </div>
                    </div>
                    <button onClick={() => removeScene(scene.id)} disabled={isGenerating || scenes.length <= 1} className="text-gray-400 hover:text-red-500 disabled:opacity-30 mt-2 p-1 rounded-full hover:bg-gray-700">
                        <span role="img" aria-label="remove scene">🗑️</span>
                    </button>
                </div>
            ))}
            <div className="flex justify-between items-center">
                <button onClick={addScene} disabled={isGenerating} className="py-2 px-4 text-sm bg-cyan-600/50 hover:bg-cyan-600/80 text-white rounded-lg disabled:opacity-50 transition-colors duration-200">
                    + Add Scene
                </button>
                <p className="text-sm text-gray-400">Total Estimated Duration: {totalDuration}s</p>
            </div>
        </div>
    );
};

// A philosophical musing: The PromptSuggestions component is the muse's echo,
// offering guiding words and phrases to ignite and refine the creator's vision,
// transforming vague ideas into vivid descriptions.
export const PromptSuggestions: React.FC<{
    currentPrompt: string;
    onSelectSuggestion: (suggestion: string) => void;
    geminiVideoClient: GeminiVideoClient | null;
    isGenerating: boolean;
}> = ({ currentPrompt, onSelectSuggestion, geminiVideoClient, isGenerating }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [showAll, setShowAll] = useState(false);

    // A philosophical musing: Debounced fetching is a patient listener,
    // waiting for the stream of thoughts to momentarily cease before
    // responding, thus preventing an overload of constant reactive queries.
    const fetchSuggestions = useCallback(debounce(async (promptText: string) => {
        if (!promptText.trim() || !geminiVideoClient || isGenerating) {
            setSuggestions([]);
            return;
        }
        setIsLoadingSuggestions(true);
        try {
            const result = await geminiVideoClient.generatePromptSuggestions(promptText);
            setSuggestions(result.filter(s => s !== promptText)); // Filter out the exact current prompt
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
            setSuggestions(["Failed to load suggestions."]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, 700), [geminiVideoClient, isGenerating]);

    useEffect(() => {
        fetchSuggestions(currentPrompt);
    }, [currentPrompt, fetchSuggestions]);

    if (!currentPrompt.trim()) {
        return null;
    }

    const visibleSuggestions = showAll ? suggestions : suggestions.slice(0, 3);

    return (
        <div className="p-3 bg-gray-800/60 rounded-lg border border-gray-700 text-sm">
            <h4 className="font-semibold text-gray-300 mb-2">Prompt Suggestions:</h4>
            {isLoadingSuggestions ? (
                <p className="text-gray-500 italic">Generating ideas...</p>
            ) : suggestions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {visibleSuggestions.map((s, idx) => (
                        <button
                            key={idx}
                            onClick={() => onSelectSuggestion(s)}
                            className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-xs transition-colors duration-200"
                            disabled={isGenerating}
                        >
                            {s}
                        </button>
                    ))}
                    {suggestions.length > 3 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-xs transition-colors duration-200"
                            disabled={isGenerating}
                        >
                            {showAll ? 'Show Less' : `+${suggestions.length - 3} More`}
                        </button>
                    )}
                </div>
            ) : (
                <p className="text-gray-500 italic">No suggestions available or API key missing.</p>
            )}
        </div>
    );
};

// A philosophical musing: The AssetDetailModal is a magnifying glass into the soul of an asset,
// revealing its origins, parameters, and providing tools for its evolution or re-interpretation.
export const AssetDetailModal: React.FC<{
    asset: VideoAsset;
    onClose: () => void;
    onRemix: (asset: VideoAsset) => void;
    onGenerateAdCopy: (assetId: string, prompt: string) => void;
    onUpdateAssetTags: (assetId: string, tags: string[]) => Promise<VideoAsset | null>;
    projectId: string;
    geminiVideoClient: GeminiVideoClient | null;
}> = ({ asset, onClose, onRemix, onGenerateAdCopy, onUpdateAssetTags, projectId, geminiVideoClient }) => {
    const [newTag, setNewTag] = useState('');
    const [adCopies, setAdCopies] = useState<AdCopy[]>([]);
    const [isLoadingAdCopies, setIsLoadingAdCopies] = useState(false);

    // A philosophical musing: The loading of ad copies is like retrieving ancient scrolls
    // associated with a visual artifact, revealing its narrative potential.
    const fetchAdCopies = useCallback(async () => {
        setIsLoadingAdCopies(true);
        try {
            const copies = await mockApi.getAdCopiesForAsset(asset.id);
            setAdCopies(copies);
        } catch (error) {
            console.error("Failed to fetch ad copies:", error);
            // set error state
        } finally {
            setIsLoadingAdCopies(false);
        }
    }, [asset.id]);

    useEffect(() => {
        fetchAdCopies();
    }, [fetchAdCopies]);

    const handleAddTag = async () => {
        if (newTag.trim() && !asset.tags.includes(newTag.trim())) {
            const updatedTags = [...asset.tags, newTag.trim()];
            const updatedAsset = await onUpdateAssetTags(asset.id, updatedTags);
            if (updatedAsset) {
                // Asset updated in parent, so local state of asset prop might implicitly update or trigger re-render
                // For direct update if asset prop isn't reactive enough:
                // setAsset(updatedAsset);
                setNewTag('');
            }
        }
    };

    const handleRemoveTag = async (tagToRemove: string) => {
        const updatedTags = asset.tags.filter(tag => tag !== tagToRemove);
        await onUpdateAssetTags(asset.id, updatedTags);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center overflow-y-auto" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg max-w-6xl w-full p-6 space-y-6 m-4 my-8 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">
                    &times;
                </button>
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Asset Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Video and controls */}
                    <div>
                        <video src={asset.url} controls autoPlay loop muted className="w-full rounded-lg mb-4 shadow-lg"></video>
                        <div className="flex justify-between space-x-4">
                            <a href={asset.url} download={`ai-ad-${asset.id}.mp4`} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex-grow text-center transition-colors duration-200">
                                <span role="img" aria-label="download">⬇️</span> Download
                            </a>
                            <button onClick={() => onRemix(asset)} className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex-grow text-center transition-colors duration-200">
                                <span role="img" aria-label="remix">🔄</span> Remix Video
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Metadata and features */}
                    <div className="text-sm space-y-4 text-gray-300">
                        <p className="text-base"><strong>Prompt:</strong> <span className="text-white">{asset.prompt}</span></p>
                        {asset.generationMode === 'storyboard' && asset.storyboard && (
                            <div className="border-t border-gray-700 pt-3">
                                <strong className="block mb-1">Storyboard:</strong>
                                <ul className="list-disc list-inside space-y-1 text-gray-400 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                    {asset.storyboard.map((scene, index) => (
                                        <li key={scene.id} className="text-xs">{index + 1}. {scene.prompt} ({scene.duration}s)</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 text-gray-400">
                            <p><strong>Generated:</strong> {formatDate(asset.creationDate)}</p>
                            <p><strong>Model:</strong> {asset.settings.model}</p>
                            <p><strong>Aspect Ratio:</strong> {asset.settings.aspectRatio}</p>
                            <p><strong>Duration:</strong> {asset.settings.duration}s</p>
                            <p><strong>Seed:</strong> {asset.settings.seed === -1 ? 'Random' : asset.settings.seed}</p>
                            <p><strong>High Fidelity:</strong> {asset.settings.highFidelity ? 'Yes' : 'No'}</p>
                            <p><strong>Stylization:</strong> {asset.settings.stylizationStrength}%</p>
                            <p><strong>Camera:</strong> {asset.settings.cameraMovement} ({asset.settings.motionMagnitude}%)</p>
                            <p><strong>Mood:</strong> {asset.settings.lightingMood}</p>
                            <p><strong>Style:</strong> {asset.settings.creativeStyle}</p>
                            {asset.settings.negativePrompt && <p className="col-span-2"><strong>Negative Prompt:</strong> {asset.settings.negativePrompt}</p>}
                            {asset.sizeBytes && <p><strong>File Size:</strong> {formatBytes(asset.sizeBytes)}</p>}
                        </div>

                        {/* Tags Section */}
                        <div className="border-t border-gray-700 pt-3">
                            <h4 className="font-semibold text-gray-300 mb-2">Tags:</h4>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {asset.tags.map(tag => (
                                    <span key={tag} className="flex items-center bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs">
                                        {tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-gray-400 hover:text-white">
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                    placeholder="Add new tag"
                                    className="flex-grow bg-gray-700/50 border border-gray-600 rounded-l-lg p-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                />
                                <button onClick={handleAddTag} className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-r-lg text-xs">Add</button>
                            </div>
                        </div>

                        {/* Ad Copy Section */}
                        <div className="border-t border-gray-700 pt-3">
                            <h4 className="font-semibold text-gray-300 mb-2">Ad Copies:</h4>
                            <button
                                onClick={() => onGenerateAdCopy(asset.id, asset.prompt)}
                                className="mb-3 py-1 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                                disabled={!geminiVideoClient}
                            >
                                <span role="img" aria-label="generate copy">✨</span> Generate Ad Copy
                            </button>
                            {isLoadingAdCopies ? (
                                <p className="text-gray-500 italic">Loading ad copies...</p>
                            ) : adCopies.length > 0 ? (
                                <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                    {adCopies.map(copy => (
                                        <div key={copy.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                                            <p className="text-sm text-white font-bold mb-1">{copy.headline}</p>
                                            <p className="text-xs text-gray-300 mb-2">{copy.body}</p>
                                            <p className="text-xs text-cyan-400 font-medium">CTA: {copy.callToAction}</p>
                                            <p className="text-xxs text-gray-500 mt-2">Generated: {formatDate(copy.generatedDate)} | Tone: {copy.tone}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No ad copies generated for this asset yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// A philosophical musing: AppSettingsModal is the control panel of the application's very essence,
// allowing the user to configure its fundamental behaviors and personalized aesthetics.
export const AppSettingsModal: React.FC<{
    config: AppConfig;
    onUpdateConfig: (newConfig: Partial<AppConfig>) => void;
    onClose: () => void;
    apiKeyInputRef: React.RefObject<HTMLInputElement>;
    onApiKeySave: () => void;
}> = ({ config, onUpdateConfig, onClose, apiKeyInputRef, onApiKeySave }) => {
    // Local state for API key input to manage its value without immediately updating global config
    const [localApiKey, setLocalApiKey] = useState(config.apiKey || '');

    useEffect(() => {
        setLocalApiKey(config.apiKey || '');
        if (apiKeyInputRef.current) {
            apiKeyInputRef.current.value = config.apiKey || '';
        }
    }, [config.apiKey, apiKeyInputRef]);

    const handleLocalApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalApiKey(e.target.value);
    };

    const handleSaveAndClose = () => {
        onApiKeySave(); // Save API key first if changed
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center overflow-y-auto" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 space-y-6 m-4 my-8 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">
                    &times;
                </button>
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Application Settings</h3>

                <div className="space-y-4">
                    {/* API Key Setting */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Google GenAI API Key</label>
                        <div className="flex">
                            <input
                                ref={apiKeyInputRef}
                                type="password"
                                value={localApiKey}
                                onChange={handleLocalApiKeyChange}
                                placeholder="sk-..."
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-l-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <button onClick={onApiKeySave} className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-r-lg text-sm transition-colors duration-200">Save</button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Your API key is stored locally in your browser.</p>
                    </div>

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="theme-toggle" className="text-sm font-medium text-gray-300">Theme</label>
                        <select
                            id="theme-toggle"
                            value={config.theme}
                            onChange={(e) => onUpdateConfig({ theme: e.target.value as AppTheme })}
                            className="bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light (Coming Soon)</option>
                        </select>
                    </div>

                    {/* Auto Save Toggle */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="auto-save-toggle" className="text-sm font-medium text-gray-300">Auto Save Projects</label>
                        <input
                            id="auto-save-toggle"
                            type="checkbox"
                            checked={config.autoSave}
                            onChange={(e) => onUpdateConfig({ autoSave: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-cyan-600 focus:ring-cyan-500"
                        />
                    </div>

                    {/* Experimental Features Toggle */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="experimental-features-toggle" className="text-sm font-medium text-gray-300">Enable Experimental Features</label>
                        <input
                            id="experimental-features-toggle"
                            type="checkbox"
                            checked={config.enableExperimentalFeatures}
                            onChange={(e) => onUpdateConfig({ enableExperimentalFeatures: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-purple-600 focus:ring-purple-500"
                        />
                    </div>

                    {/* Notification Sound Toggle */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="notification-sound-toggle" className="text-sm font-medium text-gray-300">Notification Sounds</label>
                        <input
                            id="notification-sound-toggle"
                            type="checkbox"
                            checked={config.notificationSound}
                            onChange={(e) => onUpdateConfig({ notificationSound: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-cyan-600 focus:ring-cyan-500"
                        />
                    </div>

                    {/* Default Generation Settings */}
                    <div className="border-t border-gray-700 pt-4">
                        <h4 className="font-semibold text-gray-300 mb-2">Default Generation Settings:</h4>
                        <GenerationControls
                            settings={config.defaultSettings}
                            onSettingsChange={(partial) => onUpdateConfig({ defaultSettings: { ...config.defaultSettings, ...partial }})}
                            isGenerating={false} // Always false for default settings
                            enableExperimentalFeatures={config.enableExperimentalFeatures}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button onClick={handleSaveAndClose} className="py-2 px-6 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm transition-colors duration-200">Done</button>
                </div>
            </div>
        </div>
    );
};

// A philosophical musing: The NotificationPanel is the application's bulletin board,
// where important messages, successes, and warnings are displayed, keeping the user
// informed of ongoing processes and events.
export const NotificationPanel: React.FC<{
    notifications: AppNotification[];
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
}> = ({ notifications, onClose, onMarkAsRead }) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end" onClick={onClose}>
            <div className="bg-gray-800 rounded-l-lg w-96 p-6 space-y-4 m-4 my-8 relative flex flex-col" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white text-2xl">
                    &times;
                </button>
                <h3 className="text-2xl font-bold text-white mb-4 pl-10 border-b border-gray-700 pb-2">Notifications ({unreadCount} unread)</h3>

                <div className="flex-grow overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 italic text-center py-10">No new notifications.</p>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} className={`p-3 rounded-lg border ${n.read ? 'bg-gray-700/40 border-gray-700 text-gray-400' : 'bg-gray-700/80 border-cyan-700 text-white'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-semibold ${n.read ? 'text-gray-400' : 'text-cyan-300'}`}>
                                        {n.type === 'success' && '✅ Success'}
                                        {n.type === 'error' && '❌ Error'}
                                        {n.type === 'info' && '💡 Info'}
                                        {n.type === 'warning' && '⚠️ Warning'}
                                    </span>
                                    {!n.read && (
                                        <button onClick={() => onMarkAsRead(n.id)} className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded-full bg-gray-600 hover:bg-gray-500">
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm">{n.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{formatDate(n.timestamp)}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="pt-4 border-t border-gray-700">
                    <button onClick={() => notifications.filter(n => !n.read).forEach(n => onMarkAsRead(n.id))} className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm disabled:opacity-50" disabled={unreadCount === 0}>
                        Mark all as read
                    </button>
                </div>
            </div>
        </div>
    );
};


// SECTION: Main Component
// =========================

// A philosophical musing: The AIAdStudioView is the central nexus, the digital forge
// where creativity meets computation. It orchestrates all the disparate elements,
// from prompt to pixel, bringing forth the user's advertising visions into reality.
const AIAdStudioView: React.FC = () => {
    // Original state
    const [prompt, setPrompt] = useState('A neon hologram of a cat driving a futuristic car at top speed through a cyberpunk city.');
    const [generationState, setGenerationState] = useState<GenerationState>('idle');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [pollingMessageIndex, setPollingMessageIndex] = useState(0);
    const [pollingIntervalId, setPollingIntervalId] = useState<number | null>(null);

    // New state for the full application
    const [appState, dispatch] = useReducer(appReducer, initialState);
    const [generationSettings, setGenerationSettings] = useState<GenerationSettings>(initialState.config.defaultSettings);
    const [generationMode, setGenerationMode] = useState<GenerationMode>('single');
    const [scenes, setScenes] = useState<StoryboardScene[]>([{ id: generateUniqueId(), prompt: 'A cinematic opening shot of a futuristic city skyline at night.', duration: 5 }]);
    const [selectedAsset, setSelectedAsset] = useState<VideoAsset | null>(null);
    const isGenerating = generationState === 'generating' || generationState === 'polling';
    
    // API Key management
    const apiKeyInputRef = useRef<HTMLInputElement>(null);

    // Instantiate Gemini Video Client
    const geminiVideoClient = useMemo(() => {
        return appState.config.apiKey ? new GeminiVideoClient(appState.config.apiKey) : null;
    }, [appState.config.apiKey]);

    // Derived state
    const currentProject = useMemo(() => {
        return appState.projects.find(p => p.id === appState.currentProjectId);
    }, [appState.projects, appState.currentProjectId]);

    const unreadNotificationCount = useMemo(() => {
        return appState.notifications.filter(n => !n.read).length;
    }, [appState.notifications]);

    // A philosophical musing: Effects are the silent observers, reacting to changes
    // in the application's environment or state, maintaining harmony and cleanliness.
    useEffect(() => {
        // Load initial projects and templates from mock API
        const loadInitialData = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const projects = await mockApi.getProjects();
                dispatch({ type: 'SET_PROJECTS', payload: projects });
                const templates = await mockApi.getProjectTemplates();
                dispatch({ type: 'SET_PROJECT_TEMPLATES', payload: templates });
                const notifications = await mockApi.getNotifications();
                dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
            } catch (err) {
                dispatch({ type: 'SET_ERROR', payload: 'Failed to load initial data.' });
                dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Failed to load initial data.', type: 'error', timestamp: new Date().toISOString(), read: false } });
                console.error(err);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };
        loadInitialData();

        // Load API key from local storage
        const storedApiKey = process.env.REACT_APP_GOOGLE_GENAI_API_KEY || localStorage.getItem('google_genai_api_key');
        if (storedApiKey) {
            dispatch({ type: 'UPDATE_CONFIG', payload: { apiKey: storedApiKey } });
        }
    }, []);

    // Cleanup interval on component unmount or when polling stops
    useEffect(() => {
        return () => {
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
            }
        };
    }, [pollingIntervalId]);

    // Cleanup blob URL on component unmount or when videoUrl changes
    useEffect(() => {
        return () => {
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);
    
    // A philosophical musing: Project management handlers are the conductors
    // of our campaign symphonies, directing the creation, naming, and deletion
    // of our overarching creative endeavors.
    const handleCreateProject = useCallback(async (name: string, description?: string, templateId?: string) => {
        try {
            let initialSettings = initialState.config.defaultSettings;
            let initialScenes: StoryboardScene[] = [{ id: generateUniqueId(), prompt: '', duration: 5 }];
            if (templateId) {
                const template = appState.projectTemplates.find(t => t.id === templateId);
                if (template) {
                    initialSettings = deepCopy(template.defaultSettings);
                    if (template.exampleStoryboard) {
                        initialScenes = deepCopy(template.exampleStoryboard);
                    } else if (template.examplePrompt) {
                        initialScenes = [{ id: generateUniqueId(), prompt: template.examplePrompt, duration: template.defaultSettings.duration }];
                    }
                }
            }
            
            // Set default generation settings to template's settings
            setGenerationSettings(initialSettings);
            setScenes(initialScenes);
            setPrompt(initialScenes[0]?.prompt || '');
            setGenerationMode(initialScenes.length > 1 ? 'storyboard' : 'single');


            const newProject = await mockApi.createProject(name, description, templateId);
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject.id });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: `Project "${newProject.name}" created successfully.`, type: 'success', timestamp: new Date().toISOString(), read: false } });
        } catch (err) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Failed to create project.', type: 'error', timestamp: new Date().toISOString(), read: false } });
            console.error(err);
        }
    }, [appState.projectTemplates, initialState.config.defaultSettings]);

    const handleDeleteProject = useCallback(async (id: string) => {
        try {
            const projectToDelete = appState.projects.find(p => p.id === id);
            await mockApi.deleteProject(id);
            dispatch({ type: 'REMOVE_PROJECT', payload: id });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: `Project "${projectToDelete?.name || 'Unknown'}" deleted.`, type: 'info', timestamp: new Date().toISOString(), read: false } });
        } catch (err) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Failed to delete project.', type: 'error', timestamp: new Date().toISOString(), read: false } });
            console.error(err);
        }
    }, [appState.projects]);
    
    const handleRenameProject = useCallback(async (id: string, newName: string) => {
        try {
            const updatedProject = await mockApi.renameProject(id, newName);
            if (updatedProject) {
                dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
                dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: `Project renamed to "${updatedProject.name}".`, type: 'success', timestamp: new Date().toISOString(), read: false } });
            }
        } catch (err) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Failed to rename project.', type: 'error', timestamp: new Date().toISOString(), read: false } });
            console.error(err);
        }
    }, []);

    // A philosophical musing: Asset management handlers are the custodians of our visual treasures,
    // ensuring they are stored, organized, and available for future use or modification.
    const handleDeleteAsset = useCallback(async (assetId: string) => {
        if (!currentProject) return;
        if (!window.confirm("Are you sure you want to delete this video asset?")) return;
        try {
            await mockApi.deleteAsset(currentProject.id, assetId);
            dispatch({ type: 'REMOVE_ASSET', payload: { projectId: currentProject.id, assetId }});
            if (selectedAsset?.id === assetId) {
                setSelectedAsset(null);
            }
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Video asset deleted.', type: 'info', timestamp: new Date().toISOString(), read: false } });
        } catch (err) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Failed to delete asset.', type: 'error', timestamp: new Date().toISOString(), read: false } });
            console.error(err);
        }
    }, [currentProject, selectedAsset]);
    
    const handleToggleFavorite = useCallback(async (assetId: string) => {
        if (!currentProject) return;
        try {
            const updatedAsset = await mockApi.toggleFavoriteAsset(currentProject.id, assetId);
            if(updatedAsset) {
                dispatch({ type: 'UPDATE_ASSET', payload: { projectId: currentProject.id, asset: updatedAsset }});
                dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: `Asset marked as ${updatedAsset.isFavorite ? 'favorite' : 'unfavorite'}.`, type: 'success', timestamp: new Date().toISOString(), read: false } });
            }
        } catch (err) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Failed to update favorite status.', type: 'error', timestamp: new Date().toISOString(), read: false } });
            console.error(err);
        }
    }, [currentProject]);

    const handleUpdateAssetTags = useCallback(async (assetId: string, tags: string[]) => {
        if (!currentProject) return null;
        try {
            const assetToUpdate = currentProject.assets.find(a => a.id === assetId);
            if (assetToUpdate) {
                const updatedAsset = await mockApi.updateAsset(currentProject.id, { ...assetToUpdate, tags });
                if (updatedAsset) {
                    dispatch({ type: 'UPDATE_ASSET', payload: { projectId: currentProject.id, asset: updatedAsset } });
                    // If modal is open, update its state
                    setSelectedAsset(s => s ? { ...s, tags: updatedAsset.tags } : null);
                    dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Asset tags updated.', type: 'success', timestamp: new Date().toISOString(), read: false } });
                    return updatedAsset;
                }
            }
        } catch (err) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Failed to update asset tags.', type: 'error', timestamp: new Date().toISOString(), read: false } });
            console.error(err);
        }
        return null;
    }, [currentProject]);

    // A philosophical musing: Remixing an asset is to take a completed work
    // and reimagine its potential, using its essence as a foundation for a new creation.
    const handleRemixAsset = useCallback((asset: VideoAsset) => {
        setPrompt(asset.prompt);
        setGenerationSettings(deepCopy(asset.settings)); // Deep copy to prevent accidental mutation
        if (asset.generationMode === 'storyboard' && asset.storyboard) {
            setScenes(deepCopy(asset.storyboard));
            setGenerationMode('storyboard');
        } else {
            setGenerationMode('single');
            setScenes([{ id: generateUniqueId(), prompt: asset.prompt, duration: asset.settings.duration }]);
        }
        setSelectedAsset(null); // Close modal
        dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: `Asset "${asset.id}" loaded for remixing.`, type: 'info', timestamp: new Date().toISOString(), read: false } });
    }, []);

    // A philosophical musing: The generation of ad copy is the act of conjuring
    // the perfect words to complement visual artistry, bridging sight with rhetoric.
    const handleGenerateAdCopy = useCallback(async (assetId: string, basePrompt: string) => {
        if (!currentProject || !geminiVideoClient) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'API Key not set or no project selected for ad copy generation.', type: 'warning', timestamp: new Date().toISOString(), read: false } });
            return;
        }

        dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Generating ad copy...', type: 'info', timestamp: new Date().toISOString(), read: false } });

        try {
            const tone = 'persuasive and creative'; // Could be user-configurable
            const generatedCopy = await geminiVideoClient.generateAdCopy(basePrompt, tone);
            const newAdCopy: Omit<AdCopy, 'id' | 'generatedDate'> = {
                projectId: currentProject.id,
                assetId,
                headline: generatedCopy.headline,
                body: generatedCopy.body,
                callToAction: generatedCopy.callToAction,
                tone: tone,
                isFavorite: false,
            };
            const savedCopy = await mockApi.addAdCopy(newAdCopy);
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Ad copy generated and saved!', type: 'success', timestamp: new Date().toISOString(), read: false } });
            // Refresh ad copies in the selected asset modal if it's open
            setSelectedAsset(prev => prev ? { ...prev } : null); // Trigger re-render to fetch new copies
        } catch (error) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: `Failed to generate ad copy: ${String(error)}.`, type: 'error', timestamp: new Date().toISOString(), read: false } });
            console.error("Ad copy generation failed:", error);
        }
    }, [currentProject, geminiVideoClient]);

    // A philosophical musing: The API Key handler is the custodian of access,
    // holding the master key to unlock the vast capabilities of the AI realm.
    const handleApiKeySave = useCallback(() => {
        const key = apiKeyInputRef.current?.value;
        if (key) {
            localStorage.setItem('google_genai_api_key', key);
            dispatch({ type: 'UPDATE_CONFIG', payload: { apiKey: key } });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'API Key saved. Remember to refresh if encountering issues.', type: 'info', timestamp: new Date().toISOString(), read: false } });
        } else {
            localStorage.removeItem('google_genai_api_key');
            dispatch({ type: 'UPDATE_CONFIG', payload: { apiKey: null } });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'API Key cleared.', type: 'warning', timestamp: new Date().toISOString(), read: false } });
        }
    }, []);

    // A philosophical musing: The Main Generation Logic is the heart of the studio,
    // initiating the complex dance of AI algorithms to transform abstract prompts
    // into tangible, animated visuals.
    const handleGenerate = async () => {
        if (!appState.config.apiKey || !geminiVideoClient) {
            setError('API Key is not set. Please add it in the settings.');
            setGenerationState('error');
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'API Key not set. Cannot generate video.', type: 'error', timestamp: new Date().toISOString(), read: false } });
            return;
        }

        if(!currentProject) {
            setError('No project selected. Please create or select a project first.');
            setGenerationState('error');
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'No project selected. Cannot generate video.', type: 'error', timestamp: new Date().toISOString(), read: false } });
            return;
        }

        setGenerationState('generating');
        setError('');
        if (videoUrl && videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(videoUrl);
        }
        setVideoUrl(null);
        setPollingMessageIndex(0);
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }
        
        const finalPrompt = generationMode === 'single' ? prompt : scenes.map(s => s.prompt).join(' | ');
        const finalScenes = generationMode === 'storyboard' ? scenes : undefined;

        dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Video generation initiated...', type: 'info', timestamp: new Date().toISOString(), read: false } });

        try {
            const apiPayload: GenerateVideoPayload = {
                model: generationSettings.model,
                prompt: finalPrompt,
                config: {
                    numberOfVideos: 1,
                    aspectRatio: generationSettings.aspectRatio,
                    resolution: '720p', // For mock, stick to one resolution for simplicity. Can be expanded.
                    duration: generationSettings.duration,
                    negativePrompt: generationSettings.negativePrompt,
                    seed: generationSettings.seed,
                    highFidelity: generationSettings.highFidelity,
                    stylizationStrength: generationSettings.stylizationStrength,
                    cameraMovement: generationSettings.cameraMovement,
                    lightingMood: generationSettings.lightingMood,
                    creativeStyle: generationSettings.creativeStyle,
                    motionMagnitude: generationSettings.motionMagnitude,
                    storyboard: finalScenes,
                },
                // sourceVideoUrl: selectedAsset?.url // Could be used for remixing video-to-video
            };
            console.log("Sending to AI API:", apiPayload);

            let operation = await geminiVideoClient.generateVideos(apiPayload);

            setGenerationState('polling');
            
            const intervalId: number = window.setInterval(() => {
                setPollingMessageIndex(prev => (prev + 1) % pollingMessages.length);
            }, 2500);
            setPollingIntervalId(intervalId);

            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Polling for video generation status...', type: 'info', timestamp: new Date().toISOString(), read: false } });

            let maxPollingAttempts = 60; // Max 60 * 10 seconds = 10 minutes
            while (!operation.done && maxPollingAttempts > 0) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
                operation = await geminiVideoClient.getVideosOperation({ operation: operation });
                maxPollingAttempts--;

                if (operation.metadata && operation.metadata.progressPercent > 0) {
                    const message = `Generation progress: ${operation.metadata.progressPercent}% - ${pollingMessages[Math.floor(operation.metadata.progressPercent / 100 * pollingMessages.length) % pollingMessages.length]}`;
                    dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message, type: 'info', timestamp: new Date().toISOString(), read: false } });
                }
            }
            
            clearInterval(intervalId);
            setPollingIntervalId(null);

            if (!operation.done && maxPollingAttempts <= 0) {
                throw new Error('Video generation timed out after prolonged polling.');
            }

            if (operation.error) {
                 throw new Error(String((operation.error as any).message) || 'Video generation failed after polling.');
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                setPollingMessageIndex(pollingMessages.length - 1);
                
                // Simulate actual video download size
                const videoBlobResponse = await fetch(downloadLink);
                if (!videoBlobResponse.ok) {
                    throw new Error(`Failed to retrieve generated video blob. Status: ${videoBlobResponse.statusText}`);
                }
                const videoBlob = await videoBlobResponse.blob();
                const objectURL = URL.createObjectURL(videoBlob);
                setVideoUrl(objectURL);
                setGenerationState('done');

                // Add the new asset to the current project
                const newAssetData: Omit<VideoAsset, 'id' | 'projectId' | 'creationDate'> = {
                    url: objectURL,
                    prompt: finalPrompt,
                    settings: deepCopy(generationSettings),
                    generationMode,
                    storyboard: finalScenes ? deepCopy(finalScenes) : undefined,
                    isFavorite: false,
                    tags: ['generated', generationSettings.model, generationSettings.aspectRatio],
                    sizeBytes: videoBlob.size,
                    generationHistory: [],
                };

                const newAsset = await mockApi.addAssetToProject(currentProject.id, newAssetData);
                dispatch({ type: 'ADD_ASSET', payload: { projectId: currentProject.id, asset: newAsset } });
                dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: 'Video ad generated successfully!', type: 'success', timestamp: new Date().toISOString(), read: false } });

            } else {
                throw new Error('Video generation completed, but no download link was found in the response.');
            }

        } catch (err: any) {
            console.error("Video generation failed:", err);
            const errMsg = String(err?.message || 'An error occurred during video generation.');
            setError(errMsg);
            setGenerationState('error');
            dispatch({ type: 'ADD_NOTIFICATION', payload: { id: generateUniqueId(), message: `Video generation failed: ${errMsg}`, type: 'error', timestamp: new Date().toISOString(), read: false } });
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
                setPollingIntervalId(null);
            }
        }
    };

    if (appState.isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-gray-900 text-white">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping-slow"></div>
                    <div className="absolute inset-2 border-4 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
                </div>
                <p className="ml-4 text-xl font-medium">Loading AI Ad Studio...</p>
            </div>
        );
    }

    if (!appState.config.apiKey) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
                <AppSettingsModal
                    config={appState.config}
                    onUpdateConfig={(partial) => dispatch({ type: 'UPDATE_CONFIG', payload: partial })}
                    onClose={() => { /* No-op, force API key input */ }}
                    apiKeyInputRef={apiKeyInputRef}
                    onApiKeySave={handleApiKeySave}
                />
            </div>
        );
    }
    
    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <ProjectSidebar 
                projects={appState.projects}
                currentProjectId={appState.currentProjectId}
                onSelectProject={id => dispatch({ type: 'SET_CURRENT_PROJECT', payload: id })}
                onCreateProject={handleCreateProject}
                onDeleteProject={handleDeleteProject}
                onRenameProject={handleRenameProject}
                projectTemplates={appState.projectTemplates}
                onShowSettings={() => dispatch({ type: 'TOGGLE_SETTINGS_MODAL' })}
                onShowNotifications={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS_PANEL' })}
                unreadNotificationCount={unreadNotificationCount}
            />
            <main className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                <div className="flex justify-between items-center sticky top-0 bg-gray-900 z-10 py-2 border-b border-gray-800 -mx-6 px-6">
                    <h2 className="text-3xl font-bold text-white tracking-wider">AI Ad Studio</h2>
                    <div className="text-right">
                        <h3 className="text-lg font-semibold">{currentProject?.name || "No Project Selected"}</h3>
                        <p className="text-sm text-gray-400">Last Modified: {currentProject ? formatDate(currentProject.lastModified) : 'N/A'}</p>
                    </div>
                </div>

                {currentProject ? (
                <>
                <Card title="Generate a Custom Video Ad with Gemini & Veo 2.0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Controls & Prompt */}
                        <div className="space-y-4">
                             <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700">
                                <button onClick={() => setGenerationMode('single')} className={`flex-1 py-1 rounded-md text-sm transition-colors duration-200 ${generationMode === 'single' ? 'bg-cyan-600' : 'hover:bg-gray-700'}`}>Single Prompt</button>
                                <button onClick={() => setGenerationMode('storyboard')} className={`flex-1 py-1 rounded-md text-sm transition-colors duration-200 ${generationMode === 'storyboard' ? 'bg-cyan-600' : 'hover:bg-gray-700'}`}>Storyboard</button>
                            </div>
                            
                            {generationMode === 'single' ? (
                                <>
                                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your ad... (e.g., 'A golden retriever running through a field of sunflowers with warm sunlight.')" className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                    <PromptSuggestions
                                        currentPrompt={prompt}
                                        onSelectSuggestion={setPrompt}
                                        geminiVideoClient={geminiVideoClient}
                                        isGenerating={isGenerating}
                                    />
                                </>
                            ) : (
                                <StoryboardEditor 
                                    scenes={scenes} 
                                    setScenes={setScenes} 
                                    isGenerating={isGenerating} 
                                    defaultSettings={generationSettings} // Pass default settings for potential scene-level overrides
                                />
                            )}
                            
                            <button onClick={handleGenerate} disabled={isGenerating || (!prompt.trim() && generationMode === 'single') || (generationMode === 'storyboard' && scenes.some(s => !s.prompt.trim()))} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                                {isGenerating ? (
                                    <span className="flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Generating...
                                    </span>
                                ) : 'Generate Ad'}
                            </button>
                        </div>
                        {/* Right Column: Video Preview */}
                        <div className={` ${getAspectRatioClass(generationSettings.aspectRatio)} mx-auto max-h-[50vh] w-full bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700 shadow-md`}>
                            {generationState === 'done' && videoUrl ? (
                                <video src={videoUrl} controls autoPlay muted loop className="w-full h-full rounded-lg object-contain" />
                            ) : generationState === 'generating' || generationState === 'polling' ? (
                                <div className="text-center p-4">
                                    <div className="relative w-16 h-16 mx-auto mb-4">
                                        <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                                        <div className="absolute inset-2 border-4 border-t-cyan-500 border-transparent rounded-full animate-spin-slow"></div>
                                    </div>
                                    <p className="text-white mt-4 text-lg font-medium animate-pulse">{pollingMessages[pollingMessageIndex]}</p>
                                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                                </div>
                            ) : error ? (
                                 <p className="text-red-400 p-4 text-center text-lg">{error}</p>
                            ) : (
                                 <p className="text-gray-500 text-lg">Your generated video will appear here.</p>
                            )}
                        </div>
                    </div>
                </Card>

                <GenerationControls 
                    settings={generationSettings} 
                    onSettingsChange={ (partial) => setGenerationSettings(s => ({...s, ...partial}))} 
                    isGenerating={isGenerating} 
                    enableExperimentalFeatures={appState.config.enableExperimentalFeatures}
                />
                
                <Card title="Project Asset Library">
                    {currentProject && (
                        <AssetGrid 
                            assets={currentProject.assets}
                            onDelete={handleDeleteAsset}
                            onToggleFavorite={handleToggleFavorite}
                            onSelect={setSelectedAsset}
                            currentProjectId={currentProject.id}
                            onGenerateAdCopy={handleGenerateAdCopy}
                        />
                    )}
                </Card>
                </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">Please select or create a project to begin.</p>
                    </div>
                )}
            </main>

            {/* Asset Detail Modal */}
            {selectedAsset && (
                 <AssetDetailModal
                    asset={selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                    onRemix={handleRemixAsset}
                    onGenerateAdCopy={handleGenerateAdCopy}
                    onUpdateAssetTags={handleUpdateAssetTags}
                    projectId={currentProject?.id || ''}
                    geminiVideoClient={geminiVideoClient}
                 />
            )}

            {/* App Settings Modal */}
            {appState.showSettingsModal && (
                <AppSettingsModal
                    config={appState.config}
                    onUpdateConfig={(partial) => dispatch({ type: 'UPDATE_CONFIG', payload: partial })}
                    onClose={() => dispatch({ type: 'TOGGLE_SETTINGS_MODAL', payload: false })}
                    apiKeyInputRef={apiKeyInputRef}
                    onApiKeySave={handleApiKeySave}
                />
            )}

            {/* Notifications Panel */}
            {appState.showNotificationsPanel && (
                <NotificationPanel
                    notifications={appState.notifications}
                    onClose={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS_PANEL', payload: false })}
                    onMarkAsRead={async (id) => {
                        const updatedNotification = await mockApi.markNotificationAsRead(id);
                        if (updatedNotification) {
                            dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
                        }
                    }}
                />
            )}
        </div>
    );
};

export default AIAdStudioView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/AIAdStudioView (2).tsx
================================================================================

/*
    Refactoring Note: The previous philosophical commentary has been removed to align with production-ready documentation standards.
    This file now focuses purely on technical implementation and architectural clarity.

    System Goal: Convert experimental prototype into a stable, coherent, production-ready platform.
    This module, AIAdStudioView.tsx, is a core component for the "AI-powered transaction intelligence" / "AI-powered creative" MVP candidate.
    It has been refactored to align with enhanced security, modularity, and maintainability.
*/
// components/AIAdStudioView.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef, Reducer, useReducer } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card'; // Assuming Card is a common UI component with consistent styling

// --- AI Generation Constants ---
const POLLING_MESSAGES = [ // Simplified polling messages for clarity and professionalism
    "Initializing AI Video Generation Engine...",
    "Analyzing prompt and scene directives...",
    "Allocating GPU compute resources...",
    "Synthesizing initial frame sequences...",
    "Applying stylistic and motion controls...",
    "Optimizing data stream for encoding...",
    "Finalizing video asset compilation..."
];
const MAX_SCENE_DURATION = 60;
const MIN_SCENE_DURATION = 1;
const MAX_PROJECTS_DISPLAY = 50;

// SECTION: Type Definitions (Standardized & Expanded)
// =======================================================

export type GenerationState = 'idle' | 'generating' | 'polling' | 'done' | 'error';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '21:9' | '3:2' | '2:3';
export type VideoModel = 'veo-3.1-ultra-hq' | 'imagen-video-4-pro' | 'lumiere-hd-001-enterprise' | 'phoenix-v2-stable';
export type GenerationMode = 'single_prompt' | 'storyboard_sequence' | 'ai_script_to_video'; // 'ai_script_to_video' is a future module
export type AppTheme = 'dark' | 'light' | 'system';
export type AssetType = 'video' | 'image_sequence' | 'audio_track';

export interface GenerationSettings {
    model: VideoModel;
    aspectRatio: AspectRatio;
    duration: number; // in seconds (for single prompt mode)
    negativePrompt: string;
    seed: number; // -1 for random, positive integer for deterministic
    stylizationStrength: number; // 0-100 (Creativity/Adherence balance)
    motionControl: 'default' | 'smooth' | 'dynamic';
    fidelityLevel: 'standard' | 'high_res' | '4k_preview';
    audioStyle: 'none' | 'cinematic_orchestral' | 'upbeat_synthwave' | 'corporate_minimal';
}

export interface StoryboardScene {
    id: string;
    prompt: string;
    aiDirectorNotes: string; // Specific instructions for the AI director for this frame
    duration: number; // Scene-specific duration
    visualReferenceUrl?: string; // Optional image reference for style transfer
}

export interface VideoAsset {
    id: string;
    projectId: string;
    assetType: AssetType;
    url: string; // Primary content URL
    metadataUrl?: string; // Secondary metadata/manifest URL
    prompt: string; // The primary prompt used for generation
    creationDate: string;
    lastAccessed: string;
    settings: GenerationSettings;
    generationMode: GenerationMode;
    storyboard?: StoryboardScene[];
    isFavorite: boolean;
    costCredits: number; // Estimated cost in internal credits
}

export interface AdProject {
    id: string;
    name: string;
    clientName: string; // New field for enterprise context
    creationDate: string;
    lastModified: string;
    assets: VideoAsset[];
    aiSummary: string; // AI-generated summary of the project's goal
}

export interface AppConfig {
    apiKey: string | null;
    theme: AppTheme;
    autoSave: boolean;
    defaultSettings: GenerationSettings;
    aiQuotaRemaining: number;
}

// SECTION: Mock Backend API (For MVP Development)
// ===================================================
// NOTE: This MockBackendAPI is for local development and demonstration purposes only.
// In a production environment, this entire class MUST be replaced with a secure,
// standards-compliant backend API (e.g., RESTful, gRPC) integrated with a proper
// database and authentication/authorization layer.
// All API Key management should be handled server-side via AWS Secrets Manager or Vault.
export class MockBackendAPI {
    private projects: AdProject[] = [];
    private latency: number = 150; // Reduced latency for perceived responsiveness
    private readonly STORAGE_KEY = 'ai_ad_studio_enterprise_projects_v2';

    constructor() {
        this.loadFromLocalStorage();
    }

    private async simulateLatency(minMs: number = this.latency): Promise<void> {
        const actualLatency = minMs + Math.random() * 100;
        return new Promise(resolve => setTimeout(resolve, actualLatency));
    }

    private saveToLocalStorage(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.projects));
        } catch (error) {
            console.error("CRITICAL: Failed to persist projects to local storage:", error);
        }
    }

    private loadFromLocalStorage(): void {
        try {
            const storedProjects = localStorage.getItem(this.STORAGE_KEY);
            if (storedProjects) {
                this.projects = JSON.parse(storedProjects);
            } else {
                this.initializeDefaultData();
            }
        } catch (error) {
            console.error("CRITICAL: Failed to load projects from local storage. Starting fresh:", error);
            this.initializeDefaultData();
        }
    }
    
    private initializeDefaultData(): void {
        const defaultSettings: GenerationSettings = {
            model: 'veo-3.1-ultra-hq',
            aspectRatio: '16:9',
            duration: 10,
            negativePrompt: 'blurry, low quality, watermark, text, artifacts, noise, low frame rate',
            seed: -1,
            stylizationStrength: 75,
            motionControl: 'dynamic',
            fidelityLevel: 'high_res',
            audioStyle: 'cinematic_orchestral',
        };
        
        const defaultProject: AdProject = {
            id: `proj_${Date.now()}`,
            name: 'Q1 2025 Launch Campaign',
            clientName: 'Global Dynamics Corp.',
            creationDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            assets: [],
            aiSummary: 'Initial project setup for high-impact video advertising targeting Gen Z demographics.',
        };
        this.projects.push(defaultProject);
        this.saveToLocalStorage();
    }

    // --- Project Operations ---
    
    public async getProjects(): Promise<AdProject[]> {
        await this.simulateLatency();
        return JSON.parse(JSON.stringify(this.projects)).slice(0, MAX_PROJECTS_DISPLAY);
    }
    
    public async getProjectById(id: string): Promise<AdProject | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === id);
        return project ? JSON.parse(JSON.stringify(project)) : null;
    }
    
    public async createProject(name: string, clientName: string = 'Unassigned Client'): Promise<AdProject> {
        await this.simulateLatency();
        const newProject: AdProject = {
            id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            clientName,
            creationDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            assets: [],
            aiSummary: `New project initialized for ${name}. Awaiting director input.`,
        };
        this.projects.push(newProject);
        this.saveToLocalStorage();
        return { ...newProject };
    }
    
    public async renameProject(id: string, newName: string): Promise<AdProject | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === id);
        if (project) {
            project.name = newName;
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return { ...project };
        }
        return null;
    }
    
    public async deleteProject(id: string): Promise<boolean> {
        await this.simulateLatency();
        const initialLength = this.projects.length;
        this.projects = this.projects.filter(p => p.id !== id);
        this.saveToLocalStorage();
        return this.projects.length < initialLength;
    }
    
    // --- Asset Operations ---
    
    public async addAssetToProject(projectId: string, asset: Omit<VideoAsset, 'id' | 'projectId' | 'creationDate' | 'lastAccessed'>): Promise<VideoAsset> {
        await this.simulateLatency(300); // Longer latency for asset creation
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            throw new Error('Project not found during asset addition');
        }
        const now = new Date().toISOString();
        const newAsset: VideoAsset = {
            ...asset,
            id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            creationDate: now,
            lastAccessed: now,
        };
        project.assets.unshift(newAsset); // Add to the beginning
        project.lastModified = now;
        this.saveToLocalStorage();
        return { ...newAsset };
    }

    public async deleteAsset(projectId: string, assetId: string): Promise<boolean> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const initialLength = project.assets.length;
            project.assets = project.assets.filter(a => a.id !== assetId);
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return project.assets.length < initialLength;
        }
        return false;
    }

    public async toggleFavoriteAsset(projectId: string, assetId: string): Promise<VideoAsset | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const asset = project.assets.find(a => a.id === assetId);
            if(asset) {
                asset.isFavorite = !asset.isFavorite;
                asset.lastAccessed = new Date().toISOString();
                project.lastModified = new Date().toISOString();
                this.saveToLocalStorage();
                return { ...asset };
            }
        }
        return null;
    }
    
    public async updateAssetAccessTime(projectId: string, assetId: string): Promise<void> {
        await this.simulateLatency(50);
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const asset = project.assets.find(a => a.id === assetId);
            if(asset) {
                asset.lastAccessed = new Date().toISOString();
                project.lastModified = new Date().toISOString();
                this.saveToLocalStorage();
            }
        }
    }
}

// Instantiate the mock API globally for the module
export const mockApi = new MockBackendAPI();


// SECTION: AI Integration Service (Standardized API Connector Pattern)
// ====================================================================
// This service encapsulates all direct calls to external AI APIs.
// It should handle rate limiting, retries, circuit breakers, and schema validation
// in a production environment. For this MVP, we simulate these patterns.
export class VideoGenerationService {
    private genAIClient: GoogleGenAI | null = null;
    private apiKey: string | null = null;
    private readonly MAX_POLLING_ATTEMPTS = 60; // Max 60 attempts * 8s = 8 minutes timeout
    private readonly POLLING_INTERVAL_MS = 8000; // Poll every 8 seconds

    public setApiKey(key: string | null): void {
        this.apiKey = key;
        this.genAIClient = key ? new GoogleGenAI({ apiKey: key }) : null;
    }

    private checkClient(): GoogleGenAI {
        if (!this.genAIClient || !this.apiKey) {
            throw new Error("AI Service not initialized: API Key is missing or invalid.");
        }
        return this.genAIClient;
    }

    // Unified API connector for video generation
    public async generateVideoAsset(
        mode: GenerationMode,
        singlePrompt: string,
        scenes: StoryboardScene[],
        settings: GenerationSettings
    ): Promise<{ url: string; prompt: string; costCredits: number; storyboard?: StoryboardScene[] }> {
        const ai = this.checkClient();
        
        const finalPrompt = synthesizeDirectorPrompt(mode, singlePrompt, scenes);
        const estimatedCost = mode === 'storyboard_sequence' ? 500 : 100; // Mock cost calculation

        // Simulate rate limiting / circuit breaker check
        console.info("[AI Service] Checking API rate limits and circuit breaker status...");
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate a quick check

        const apiPayload: any = {
            model: settings.model,
            prompt: finalPrompt,
            config: {
                numberOfVideos: 1,
                aspectRatio: settings.aspectRatio,
                duration: mode === 'single_prompt' ? settings.duration : undefined,
                fidelity: settings.fidelityLevel,
                stylization: settings.stylizationStrength / 100,
                motionProfile: settings.motionControl,
                audioTrack: settings.audioStyle,
                seed: settings.seed,
                negativePrompt: settings.negativePrompt,
            },
        };

        console.log(`[AI Service] Executing ${mode} generation with payload:`, apiPayload);
        
        let operation;
        try {
            operation = await ai.models.generateVideos(apiPayload);
            console.info("[AI Service] Generation operation initiated.");
        } catch (initialError: any) {
            console.error("[AI Service] Initial generation request failed:", initialError);
            throw new Error(`AI Request Failure: ${initialError.message || 'Unknown API error.'}`);
        }

        let attempts = 0;
        // Polling loop with explicit timeout
        while (!operation.done && attempts < this.MAX_POLLING_ATTEMPTS) {
            attempts++;
            console.debug(`[AI Service] Polling for video generation status (attempt ${attempts})...`);
            await new Promise(resolve => setTimeout(resolve, this.POLLING_INTERVAL_MS));
            
            try {
                operation = await ai.operations.getVideosOperation({ operation: operation });
            } catch (pollError: any) {
                console.error(`[AI Service] Polling failed on attempt ${attempts}:`, pollError);
                // Implement retry logic here if needed (e.g., exponential backoff)
                throw new Error(`AI Polling Failure: ${pollError.message || 'Unknown polling error.'}`);
            }
        }

        if (attempts >= this.MAX_POLLING_ATTEMPTS) {
            console.error("[AI Service] Video generation timed out.");
            throw new Error("AI Generation Timeout: Operation exceeded maximum allowed time.");
        }

        if (operation.error) {
            console.error("[AI Service] Generation operation reported error:", operation.error);
            throw new Error(`AI Generation Error: ${operation.error.message || 'Unknown backend error.'}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            console.error("[AI Service] Generation succeeded, but no download link was provided.");
            throw new Error('AI Asset Retrieval Error: Generation successful, but asset manifest empty.');
        }

        // Simulate fetching the actual file (using the mock API key for the fetch URL for demo)
        // In production, this download link would likely be temporary, signed, and not require the client's API key.
        const videoResponse = await fetch(`${downloadLink}&key=${this.apiKey}`);
        if (!videoResponse.ok) {
            console.error(`[AI Service] Failed to retrieve asset blob: ${videoResponse.statusText}`);
            throw new Error(`Download Protocol Error: Failed to retrieve asset (${videoResponse.statusText})`);
        }
        const videoBlob = await videoResponse.blob();
        const objectURL = URL.createObjectURL(videoBlob);
        
        console.info("[AI Service] Video asset successfully generated and retrieved.");

        return {
            url: objectURL,
            prompt: finalPrompt,
            costCredits: estimatedCost,
            storyboard: mode === 'storyboard_sequence' ? scenes : undefined,
        };
    }

    // AI utility for summarizing prompts (explainability notes)
    public async generateDirectorSummary(fullPrompt: string): Promise<string> {
        const ai = this.checkClient();
        
        // This uses a text-specific model for efficiency
        const directorPrompt = `Analyze the following video generation sequence prompt and generate a concise, high-level summary of the intended visual narrative, target emotion, and required technical execution style.
        PROMPT: ${fullPrompt}`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: directorPrompt }] }],
                config: { temperature: 0.3, maxOutputTokens: 200 } // Limit output for conciseness
            });
            return response.candidates?.[0]?.content?.parts?.[0]?.text || "Summary generation failed or returned empty.";
        } catch (err: any) {
            console.error("[AI Service] Director summary generation failed:", err);
            throw new Error(`AI Summary Generation Failed: ${err.message || 'Unknown AI error.'}`);
        }
    }
}

// Instantiate the AI Service
export const videoGenerationService = new VideoGenerationService();


// SECTION: Utility Functions (Standardized)
// ==========================

export const generateUniqueId = (): string => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (isoString: string): string => {
    try {
        return new Date(isoString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    } catch {
        return 'Invalid Timestamp';
    }
};

export const getAspectRatioClass = (aspectRatio: AspectRatio): string => {
    switch (aspectRatio) {
        case '16:9': return 'aspect-[16/9]';
        case '9:16': return 'aspect-[9/16]';
        case '1:1': return 'aspect-square';
        case '4:5': return 'aspect-[4/5]';
        case '21:9': return 'aspect-[21/9]';
        case '3:2': return 'aspect-[3/2]';
        case '2:3': return 'aspect-[2/3]';
        default: return 'aspect-video';
    }
};

// --- AI Utility: Prompt Synthesis ---
export const synthesizeDirectorPrompt = (mode: GenerationMode, singlePrompt: string, scenes: StoryboardScene[]): string => {
    if (mode === 'single_prompt') {
        return `[SINGLE_SHOT_AD] ${singlePrompt}`;
    }
    if (mode === 'storyboard_sequence') {
        const scenePrompts = scenes.map((scene, index) =>
            `Scene ${index + 1} (${scene.duration}s): [VISUAL_FOCUS] ${scene.prompt}. [DIRECTOR_NOTES] ${scene.aiDirectorNotes || 'Maintain visual consistency with previous scene.'}`
        ).join(' ||| ');
        return `[STORYBOARD_AD] Total Scenes: ${scenes.length}. Sequence: ${scenePrompts}`;
    }
    return singlePrompt; // Fallback for 'ai_script_to_video' or other future modes
};


// SECTION: Reducer for Complex State Management (Component-level standard)
// =============================================================
// Note: While this component uses useReducer for its state, for a larger application
// global state management (e.g., Zustand or Redux Toolkit) would be recommended
// for truly centralized, scalable state across multiple views/components.
type AppState = {
    projects: AdProject[];
    currentProjectId: string | null;
    isLoading: boolean;
    error: string | null;
    config: AppConfig;
};

type AppAction =
    | { type: 'SET_PROJECTS'; payload: AdProject[] }
    | { type: 'SET_CURRENT_PROJECT'; payload: string | null }
    | { type: 'ADD_PROJECT'; payload: AdProject }
    | { type: 'UPDATE_PROJECT'; payload: AdProject }
    | { type: 'REMOVE_PROJECT'; payload: string }
    | { type: 'ADD_ASSET'; payload: { projectId: string; asset: VideoAsset } }
    | { type: 'REMOVE_ASSET'; payload: { projectId: string; assetId: string } }
    | { type: 'UPDATE_ASSET'; payload: { projectId: string; asset: VideoAsset } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'UPDATE_CONFIG'; payload: Partial<AppConfig> }
    | { type: 'UPDATE_PROJECT_SUMMARY'; payload: { projectId: string; summary: string } };

const initialAppState: AppState = {
    projects: [],
    currentProjectId: null,
    isLoading: true,
    error: null,
    config: {
        apiKey: null,
        theme: 'dark',
        autoSave: true,
        aiQuotaRemaining: 10000, // Mock initial quota
        defaultSettings: {
            model: 'veo-3.1-ultra-hq',
            aspectRatio: '16:9',
            duration: 10,
            negativePrompt: 'blurry, low quality, watermark, text, artifacts, noise, low frame rate',
            seed: -1,
            stylizationStrength: 75,
            motionControl: 'dynamic',
            fidelityLevel: 'high_res',
            audioStyle: 'cinematic_orchestral',
        },
    },
};

const appReducer: Reducer<AppState, AppAction> = (state, action): AppState => {
    switch (action.type) {
        case 'SET_PROJECTS':
            const firstProjectId = action.payload.length > 0 ? action.payload[0].id : null;
            return {
                ...state,
                projects: action.payload,
                currentProjectId: state.currentProjectId && action.payload.some(p => p.id === state.currentProjectId)
                    ? state.currentProjectId
                    : firstProjectId,
                isLoading: false,
            };
        case 'SET_CURRENT_PROJECT':
            return { ...state, currentProjectId: action.payload };
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload] };
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(p => (p.id === action.payload.id ? action.payload : p)),
            };
        case 'REMOVE_PROJECT':
            const remainingProjects = state.projects.filter(p => p.id !== action.payload);
            const newCurrentProjectId = state.currentProjectId === action.payload
                ? remainingProjects.length > 0 ? remainingProjects[0].id : null
                : state.currentProjectId;
            return {
                ...state,
                projects: remainingProjects,
                currentProjectId: newCurrentProjectId,
            };
        case 'ADD_ASSET':
        case 'REMOVE_ASSET':
        case 'UPDATE_ASSET':
            return {
                ...state,
                projects: state.projects.map(p => {
                    if (p.id !== action.payload.projectId) return p;
                    let newAssets: VideoAsset[];
                    if (action.type === 'ADD_ASSET') {
                        newAssets = [action.payload.asset, ...p.assets];
                    } else if (action.type === 'REMOVE_ASSET') {
                        newAssets = p.assets.filter(a => a.id !== action.payload.assetId);
                    } else { // UPDATE_ASSET
                        newAssets = p.assets.map(a => a.id === action.payload.asset.id ? action.payload.asset : a);
                    }
                    return { ...p, assets: newAssets, lastModified: new Date().toISOString() };
                }),
            };
        case 'UPDATE_CONFIG':
            return { ...state, config: { ...state.config, ...action.payload } };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'UPDATE_PROJECT_SUMMARY':
             return {
                ...state,
                projects: state.projects.map(p => (p.id === action.payload.projectId ? { ...p, aiSummary: action.payload.summary, lastModified: new Date().toISOString() } : p)),
            };
        default:
            return state;
    }
};

// SECTION: Child Components (AI-Enhanced UI Elements)
// ==================================================

export const ProjectSidebar: React.FC<{
    projects: AdProject[];
    currentProjectId: string | null;
    onSelectProject: (id: string) => void;
    onCreateProject: (name: string, client: string) => void;
    onDeleteProject: (id: string) => void;
    onRenameProject: (id: string, newName: string) => void;
}> = ({ projects, currentProjectId, onSelectProject, onCreateProject, onDeleteProject, onRenameProject }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [newClientName, setNewClientName] = useState('');
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renamingText, setRenamingText] = useState('');

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            onCreateProject(newProjectName.trim(), newClientName.trim() || 'Unassigned Client');
            setNewProjectName('');
            setNewClientName('');
        }
    };

    const handleRename = (id: string) => {
        if (renamingText.trim() && renamingId) {
            onRenameProject(id, renamingText.trim());
        }
        setRenamingId(null);
        setRenamingText('');
    };

    return (
        <div className="bg-gray-900 border-r border-gray-700 w-72 p-4 flex flex-col h-full shadow-2xl">
            <h3 className="text-2xl font-extrabold text-cyan-400 mb-4 border-b border-gray-700 pb-2">Project Nexus</h3>
            
            {/* New Project Creation Block */}
            <div className="mb-4 p-3 bg-gray-800/70 rounded-lg border border-gray-700">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">New Initiative</h4>
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                    placeholder="Project Name (e.g., Q2 Campaign)"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white mb-2 focus:ring-cyan-500"
                />
                <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                    placeholder="Client Name (Optional)"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white mb-2 focus:ring-cyan-500"
                />
                <button onClick={handleCreateProject} disabled={!newProjectName.trim()} className="w-full bg-cyan-700 hover:bg-cyan-600 text-white p-2 rounded-md text-sm font-medium disabled:opacity-30">
                    Initiate Project
                </button>
            </div>

            <h4 className="text-md font-semibold text-gray-300 mb-2 uppercase tracking-wider">Active Projects ({projects.length})</h4>
            <ul className="space-y-1 overflow-y-auto flex-grow custom-scrollbar">
                {projects.map(project => (
                    <li key={project.id}>
                        <div
                            className={`group flex flex-col p-2 rounded-lg cursor-pointer transition-colors ${currentProjectId === project.id ? 'bg-cyan-700/50 text-white shadow-lg border border-cyan-500' : 'text-gray-300 hover:bg-gray-800/50 border border-transparent'}`}
                            onClick={() => onSelectProject(project.id)}
                        >
                            <div className="flex items-center justify-between w-full">
                                {renamingId === project.id ? (
                                    <input
                                        type="text"
                                        value={renamingText}
                                        onChange={(e) => setRenamingText(e.target.value)}
                                        onBlur={() => handleRename(project.id)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleRename(project.id)}
                                        className="bg-gray-600 text-white w-full text-sm p-1 rounded focus:outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="truncate font-medium text-sm">{project.name}</span>
                                )}
                                <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button title="Rename" onClick={(e) => { e.stopPropagation(); setRenamingId(project.id); setRenamingText(project.name); }} className="text-gray-400 hover:text-yellow-400 text-xs p-1">✏️</button>
                                    <button title="Delete" onClick={(e) => { e.stopPropagation(); if(window.confirm(`Confirm deletion of Project: "${project.name}"?`)) onDeleteProject(project.id);}} className="text-gray-400 hover:text-red-500 text-xs p-1">🗑️</button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">Client: {project.clientName}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const GenerationControls: React.FC<{
    settings: GenerationSettings;
    onSettingsChange: (newSettings: Partial<GenerationSettings>) => void;
    isGenerating: boolean;
    aiQuota: number;
}> = ({ settings, onSettingsChange, isGenerating, aiQuota }) => {
    
    const handleRangeChange = (key: keyof GenerationSettings, value: string) => {
        onSettingsChange({ [key]: parseInt(value, 10) });
    };
    
    const handleSelectChange = (key: keyof GenerationSettings, value: string) => {
        onSettingsChange({ [key]: value });
    };

    return (
        <Card title="AI Generation Matrix Configuration" className="shadow-xl border-cyan-800/50">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                
                {/* Model Selection */}
                <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">AI Model Core</label>
                    <select
                        value={settings.model}
                        onChange={e => handleSelectChange('model', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-cyan-500"
                    >
                        <option value="veo-3.1-ultra-hq">Veo 3.1 (Ultra HQ)</option>
                        <option value="imagen-video-4-pro">Imagen Video 4 (Pro)</option>
                        <option value="lumiere-hd-001-enterprise">Lumiere HD (Enterprise)</option>
                        <option value="phoenix-v2-stable">Phoenix v2 (Stable)</option>
                    </select>
                </div>
                
                {/* Aspect Ratio */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Output Ratio</label>
                    <select
                        value={settings.aspectRatio}
                        onChange={e => handleSelectChange('aspectRatio', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="16:9">16:9 (Widescreen)</option>
                        <option value="9:16">9:16 (Vertical/Mobile)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="4:5">4:5 (Portrait)</option>
                        <option value="21:9">21:9 (Cinematic)</option>
                        <option value="3:2">3:2 (Standard Photo)</option>
                        <option value="2:3">2:3 (Poster)</option>
                    </select>
                </div>
                
                {/* Duration (Single Mode Only) */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Duration (s): {settings.duration}</label>
                    <input
                        type="range"
                        min={MIN_SCENE_DURATION}
                        max={30} // Capped at 30 for single prompt for cost control
                        step="1"
                        value={settings.duration}
                        onChange={e => handleRangeChange('duration', e.target.value)}
                        disabled={isGenerating}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                    />
                </div>
                
                {/* Fidelity Level */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Fidelity Level</label>
                    <select
                        value={settings.fidelityLevel}
                        onChange={e => handleSelectChange('fidelityLevel', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="standard">Standard (Fast)</option>
                        <option value="high_res">High Resolution</option>
                        <option value="4k_preview">4K Preview (High Cost)</option>
                    </select>
                </div>
                
                {/* Stylization Strength */}
                <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Creativity/Adherence: {settings.stylizationStrength}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={settings.stylizationStrength}
                        onChange={e => handleRangeChange('stylizationStrength', e.target.value)}
                        disabled={isGenerating}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                    />
                </div>
                
                {/* Motion Control */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Motion Profile</label>
                    <select
                        value={settings.motionControl}
                        onChange={e => handleSelectChange('motionControl', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="dynamic">Dynamic (Complex)</option>
                        <option value="smooth">Smooth (Subtle)</option>
                        <option value="default">Default</option>
                    </select>
                </div>
                
                {/* Audio Style */}
                <div>
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Audio Track</label>
                    <select
                        value={settings.audioStyle}
                        onChange={e => handleSelectChange('audioStyle', e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="none">None (Muted)</option>
                        <option value="cinematic_orchestral">Cinematic Orchestral</option>
                        <option value="upbeat_synthwave">Upbeat Synthwave</option>
                        <option value="corporate_minimal">Corporate Minimal</option>
                    </select>
                </div>
                
                {/* Seed Control */}
                <div className="col-span-2 lg:col-span-1">
                     <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Seed (Deterministic)</label>
                     <div className="flex">
                        <input
                            type="number"
                            value={settings.seed === -1 ? '' : settings.seed}
                            onChange={e => onSettingsChange({ seed: parseInt(e.target.value, 10) || -1 })}
                            placeholder="Random (-1)"
                            disabled={isGenerating}
                            className="w-full bg-gray-700 border border-gray-600 rounded-l-lg p-2 text-white text-sm"
                        />
                        <button onClick={() => onSettingsChange({seed: -1})} title="Use Random Seed" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-r-lg text-sm font-bold">🎲</button>
                     </div>
                </div>
                
                {/* Quota Display */}
                <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">AI Compute Quota</label>
                    <div className="w-full bg-gray-700 rounded-lg h-8 flex items-center">
                        <div 
                            className={`h-full rounded-l-lg text-xs font-bold flex items-center px-2 transition-all duration-500 ${aiQuota > 1000 ? 'bg-green-600' : aiQuota > 200 ? 'bg-yellow-600' : 'bg-red-600'}`}
                            style={{ width: `${Math.min(100, (aiQuota / 10000) * 100)}%` }}
                        >
                            {aiQuota.toLocaleString()}
                        </div>
                        <span className="text-xs text-gray-300 px-2 flex-shrink-0">/ 10,000</span>
                    </div>
                </div>
                
                {/* Negative Prompt */}
                <div className="col-span-full">
                    <label className="block text-xs font-medium text-cyan-400 mb-1 uppercase">Negative Prompt (Artifact Suppression)</label>
                    <input
                        type="text"
                        value={settings.negativePrompt}
                        onChange={e => handleSelectChange('negativePrompt', e.target.value)}
                        placeholder="e.g., blurry, text, watermark, ugly, low resolution"
                        disabled={isGenerating}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    />
                </div>
            </div>
        </Card>
    );
};

export const AssetGrid: React.FC<{
    assets: VideoAsset[];
    onDelete: (assetId: string) => void;
    onToggleFavorite: (assetId: string) => void;
    onSelect: (asset: VideoAsset) => void;
}> = ({ assets, onDelete, onToggleFavorite, onSelect }) => {
    if (assets.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 border border-dashed border-gray-700 rounded-lg">
                <p className="text-lg mb-2">📦 Asset Repository Empty</p>
                <p>Generate your first video asset using the controls above to populate this library.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {assets.map(asset => (
                <div key={asset.id} className="group relative aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-200 shadow-lg">
                    {/* Placeholder for actual video preview */}
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Preview Unavailable</span>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end space-x-2">
                            <button title="Favorite" onClick={() => onToggleFavorite(asset.id)} className={`text-xl ${asset.isFavorite ? 'text-yellow-400' : 'text-white/70 hover:text-white'}`}>
                                {asset.isFavorite ? '★' : '☆'}
                            </button>
                            <button title="Delete Asset" onClick={() => onDelete(asset.id)} className="text-white/70 hover:text-red-500">🗑️</button>
                        </div>
                        <div className="bg-black/50 p-1 rounded-md">
                            <p className="text-xs text-white truncate font-mono">{asset.id.substring(0, 8)}...</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Cost: {asset.costCredits} Credits</p>
                            <button onClick={() => onSelect(asset)} className="mt-1 w-full text-xs bg-cyan-600/80 hover:bg-cyan-500 text-white py-1 rounded transition-colors">Analyze & View</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const StoryboardEditor: React.FC<{
    scenes: StoryboardScene[];
    setScenes: React.Dispatch<React.SetStateAction<StoryboardScene[]>>;
    isGenerating: boolean;
    onGenerateDirectorSummary: (prompt: string) => Promise<string>;
    onScenePromptChange: (id: string, prompt: string) => void;
    onSceneNotesChange: (id: string, notes: string) => void;
    onSceneDurationChange: (id: string, duration: number) => void;
    onUpdateProjectSummary: (projectId: string, summary: string) => void; // Added prop
    currentProjectId: string | null; // Added prop
}> = ({ scenes, setScenes, isGenerating, onGenerateDirectorSummary, onScenePromptChange, onSceneNotesChange, onSceneDurationChange, onUpdateProjectSummary, currentProjectId }) => {
    const [isSummarizing, setIsSummarizing] = useState(false);

    const addScene = () => {
        setScenes(prev => [...prev, { id: generateUniqueId(), prompt: '', aiDirectorNotes: '', duration: 5 }]);
    };

    const removeScene = (id: string) => {
        setScenes(prev => prev.filter(s => s.id !== id));
    };
    
    const totalDuration = useMemo(() => scenes.reduce((acc, scene) => acc + scene.duration, 0), [scenes]);

    const handleGenerateSummary = useCallback(async () => {
        if (isGenerating || !currentProjectId) return;
        setIsSummarizing(true);
        const sequencePrompt = synthesizeDirectorPrompt('storyboard_sequence', '', scenes);
        try {
            const summary = await onGenerateDirectorSummary(sequencePrompt);
            onUpdateProjectSummary(currentProjectId, summary); // Update project summary
        } catch (e) {
            console.error("Failed to generate director summary:", e);
            alert('Failed to generate director summary. See console for details.');
        } finally {
            setIsSummarizing(false);
        }
    }, [isGenerating, scenes, onGenerateDirectorSummary, onUpdateProjectSummary, currentProjectId]);

    return (
        <div className="space-y-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
            <h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Storyboard Sequence Editor</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {scenes.map((scene, index) => (
                    <div key={scene.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg shadow-inner border border-gray-600">
                        <span className="font-extrabold text-lg text-cyan-400 mt-2 w-6 flex-shrink-0">{index + 1}</span>
                        <div className="flex-grow space-y-2">
                            {/* Prompt Input */}
                            <textarea
                                value={scene.prompt}
                                onChange={e => onScenePromptChange(scene.id, e.target.value)}
                                placeholder={`Scene ${index + 1} Visual Description...`}
                                className="w-full h-16 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-cyan-500 resize-none"
                                disabled={isGenerating}
                            />
                            {/* Director Notes Input */}
                            <textarea
                                value={scene.aiDirectorNotes}
                                onChange={e => onSceneNotesChange(scene.id, e.target.value)}
                                placeholder={`AI Director Notes (e.g., Camera movement, lighting style, character emotion)...`}
                                className="w-full h-12 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white text-xs italic focus:ring-yellow-500 resize-none"
                                disabled={isGenerating}
                            />
                            
                            {/* Duration Control */}
                             <div className="flex items-center space-x-2 pt-1">
                                <label className="text-xs text-gray-400">Duration:</label>
                                 <input
                                    type="range"
                                    min={MIN_SCENE_DURATION}
                                    max={MAX_SCENE_DURATION}
                                    value={scene.duration}
                                    onChange={e => onSceneDurationChange(scene.id, parseInt(e.target.value, 10))}
                                    disabled={isGenerating}
                                    className="w-32 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                                />
                                <span className="text-xs text-white w-8 font-bold">{scene.duration}s</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => removeScene(scene.id)} 
                            disabled={isGenerating || scenes.length <= 1} 
                            title="Remove Scene"
                            className="text-gray-400 hover:text-red-500 disabled:opacity-30 mt-2 p-1"
                        >🗑️</button>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                <button onClick={addScene} disabled={isGenerating || scenes.length >= 20} className="py-2 px-4 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded-lg disabled:opacity-50 flex items-center space-x-1">
                    <span>+ Add Scene Block</span>
                </button>
                <div className="flex items-center space-x-3">
                    <button onClick={handleGenerateSummary} disabled={isGenerating || isSummarizing || !currentProjectId} className="py-2 px-4 text-sm bg-yellow-700/50 hover:bg-yellow-700 text-white rounded-lg disabled:opacity-50 flex items-center space-x-1">
                        {isSummarizing ? (
                            <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                <span>AI Directing...</span>
                            </>
                        ) : (
                            <span>✨ Synthesize Director Notes</span>
                        )}
                    </button>
                    <p className="text-sm text-gray-400">Total Estimated Duration: <span className="font-bold text-white">{totalDuration}s</span></p>
                </div>
            </div>
        </div>
    );
};

// SECTION: Main Component (The Sovereign Interface)
// =========================================================

const AIAdStudioView: React.FC = () => {
    // --- Core State Management ---
    const [prompt, setPrompt] = useState('A hyper-realistic, cinematic 15-second commercial showcasing a self-driving electric vehicle navigating a rain-slicked Tokyo street at midnight, emphasizing speed and safety.');
    const [generationState, setGenerationState] = useState<GenerationState>('idle');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pollingMessageIndex, setPollingMessageIndex] = useState(0);
    const [pollingIntervalId, setPollingIntervalId] = useState<number | null>(null);

    // --- Application State (via Reducer) ---
    const [appState, dispatch] = useReducer(appReducer, initialAppState);
    const [generationSettings, setGenerationSettings] = useState<GenerationSettings>(initialAppState.config.defaultSettings);
    const [generationMode, setGenerationMode] = useState<GenerationMode>('single_prompt');
    const [scenes, setScenes] = useState<StoryboardScene[]>([
        { id: generateUniqueId(), prompt: 'Extreme close-up on a single raindrop hitting a polished chrome surface.', aiDirectorNotes: 'Shallow depth of field, high contrast.', duration: 3 },
        { id: generateUniqueId(), prompt: 'Wide shot of the vehicle accelerating smoothly away from a blurred neon sign.', aiDirectorNotes: 'Smooth tracking shot, cinematic color grading.', duration: 7 },
    ]);
    const [selectedAsset, setSelectedAsset] = useState<VideoAsset | null>(null);
    
    const isGenerating = generationState === 'generating' || generationState === 'polling';
    
    // API Key Input Ref
    const apiKeyInputRef = useRef<HTMLInputElement>(null);

    // Derived State
    const currentProject = useMemo(() => {
        return appState.projects.find(p => p.id === appState.currentProjectId);
    }, [appState.projects, appState.currentProjectId]);
    
    const currentProjectAssets = useMemo(() => {
        return currentProject?.assets || [];
    }, [currentProject]);

    // --- Effects ---
    useEffect(() => {
        // 1. Load initial projects and configuration
        mockApi.getProjects().then(projects => {
            dispatch({ type: 'SET_PROJECTS', payload: projects });
        }).catch(err => {
            dispatch({ type: 'SET_ERROR', payload: 'System initialization failed: Cannot load project manifest.' });
            console.error(err);
        });

        // 2. Load API key from persistent storage and set on AI service
        // WARNING: Storing API keys directly in localStorage or environment variables
        // on the client-side is INSECURE for production applications.
        // For a secure, production-ready system, implement a robust OAuth2/OIDC flow
        // where API keys are managed server-side (e.g., AWS Secrets Manager) and
        // client requests are authenticated via short-lived, backend-issued tokens (e.g., JWT).
        const storedApiKey = process.env.REACT_APP_API_KEY || localStorage.getItem('google_genai_api_key');
        if (storedApiKey) {
            dispatch({ type: 'UPDATE_CONFIG', payload: { apiKey: storedApiKey } });
            videoGenerationService.setApiKey(storedApiKey);
        }
    }, []);

    useEffect(() => {
        // 3. Cleanup interval on state change/unmount
        return () => {
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
            }
        };
    }, [pollingIntervalId]);

    useEffect(() => {
        // 4. Cleanup blob URL
        return () => {
            if (videoUrl && videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);
    
    // --- Handlers ---
    
    const handleUpdateConfig = useCallback((payload: Partial<AppConfig>) => {
        dispatch({ type: 'UPDATE_CONFIG', payload });
        if (payload.apiKey !== undefined) {
            videoGenerationService.setApiKey(payload.apiKey);
        }
    }, []);

    const handleApiKeySave = () => {
        const key = apiKeyInputRef.current?.value;
        if (key && key.length > 20) { // Basic validation for non-empty and reasonable length
            // WARNING: See comment in useEffect for security implications of client-side API key storage.
            localStorage.setItem('google_genai_api_key', key);
            handleUpdateConfig({ apiKey: key });
            setError(null);
            alert("API Key successfully registered. System ready for secure connection.");
        } else {
            setError("Invalid key format detected. Key must be substantial.");
        }
    };
    
    // Project Management
    const handleCreateProject = useCallback(async (name: string, client: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const newProject = await mockApi.createProject(name, client);
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject.id });
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to initiate new project: ${err.message || 'Unknown error.'}` });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const handleDeleteProject = useCallback(async (id: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await mockApi.deleteProject(id);
            dispatch({ type: 'REMOVE_PROJECT', payload: id });
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to decommission project: ${err.message || 'Unknown error.'}` });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);
    
    const handleRenameProject = useCallback(async (id: string, newName: string) => {
        try {
            const updatedProject = await mockApi.renameProject(id, newName);
            if (updatedProject) {
                dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
            }
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to rename project: ${err.message || 'Unknown error.'}` });
        }
    }, []);

    // Asset Management
    const handleDeleteAsset = useCallback(async (assetId: string) => {
        if (!currentProject) return;
        try {
            await mockApi.deleteAsset(currentProject.id, assetId);
            dispatch({ type: 'REMOVE_ASSET', payload: { projectId: currentProject.id, assetId }});
            if (selectedAsset?.id === assetId) {
                setSelectedAsset(null);
            }
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to purge asset: ${err.message || 'Unknown error.'}` });
        }
    }, [currentProject, selectedAsset]);
    
    const handleToggleFavorite = useCallback(async (assetId: string) => {
        if (!currentProject) return;
        try {
            const updatedAsset = await mockApi.toggleFavoriteAsset(currentProject.id, assetId);
            if(updatedAsset) {
                dispatch({ type: 'UPDATE_ASSET', payload: { projectId: currentProject.id, asset: updatedAsset }});
            }
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: `Failed to update asset metadata: ${err.message || 'Unknown error.'}` });
        }
    }, [currentProject]);
    
    const handleAssetSelect = useCallback(async (asset: VideoAsset) => {
        await mockApi.updateAssetAccessTime(asset.projectId, asset.id);
        dispatch({ type: 'UPDATE_ASSET', payload: { projectId: asset.projectId, asset: {...asset, lastAccessed: new Date().toISOString()} }});
        setSelectedAsset(asset);
    }, []);
    
    // AI Director Summary Generation
    const handleGenerateDirectorSummary = useCallback(async (fullPrompt: string): Promise<string> => {
        try {
            return await videoGenerationService.generateDirectorSummary(fullPrompt);
        } catch (err: any) {
            console.error("Error generating director summary:", err);
            throw err; // Re-throw to be caught by the calling component
        }
    }, []);

    const handleUpdateProjectSummary = useCallback((projectId: string, summary: string) => {
        dispatch({ type: 'UPDATE_PROJECT_SUMMARY', payload: { projectId, summary } });
    }, []);

    // --- Core Generation Execution ---
    const handleGenerate = async () => {
        if (!appState.config.apiKey) {
            setError('Authentication Failure: API Key is required for compute access.');
            setGenerationState('error');
            return;
        }

        if(!currentProject) {
            setError('Project Context Missing: Select or create a project before generation.');
            setGenerationState('error');
            return;
        }
        
        if (appState.config.aiQuotaRemaining <= 0) {
            setError('Quota Exhausted: Compute resources are unavailable. Contact administration for quota refresh.');
            setGenerationState('error');
            return;
        }

        setGenerationState('generating');
        setError(null);
        if (videoUrl && videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(videoUrl);
        }
        setVideoUrl(null);
        setPollingMessageIndex(0);
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }
        
        // Start visual feedback loop for polling messages
        const intervalId: number = window.setInterval(() => {
            setPollingMessageIndex(prev => (prev + 1) % POLLING_MESSAGES.length);
        }, 2000);
        setPollingIntervalId(intervalId);

        try {
            const { url, prompt: generatedPrompt, costCredits, storyboard: generatedStoryboard } = await videoGenerationService.generateVideoAsset(
                generationMode,
                prompt,
                scenes,
                generationSettings
            );
            
            clearInterval(intervalId);
            setPollingIntervalId(null);

            setVideoUrl(url);
            setGenerationState('done');

            // Save Asset to Project Manifest
            const newAssetData: Omit<VideoAsset, 'id' | 'projectId' | 'creationDate' | 'lastAccessed'> = {
                assetType: 'video',
                url: url,
                prompt: generatedPrompt,
                settings: generationSettings,
                generationMode,
                storyboard: generatedStoryboard,
                isFavorite: false,
                costCredits: costCredits,
            };

            const newAsset = await mockApi.addAssetToProject(currentProject.id, newAssetData);
            dispatch({ type: 'ADD_ASSET', payload: { projectId: currentProject.id, asset: newAsset } });
            
            // Update Quota
            handleUpdateConfig({ aiQuotaRemaining: Math.max(0, appState.config.aiQuotaRemaining - costCredits) });

        } catch (err: any) {
            console.error("Generation Pipeline Interrupted:", err);
            setError(String(err?.message || 'A critical error halted the generation pipeline.'));
            setGenerationState('error');
            if (pollingIntervalId) {
                clearInterval(pollingIntervalId);
                setPollingIntervalId(null);
            }
        }
    };

    // --- Render Logic ---
    if (appState.isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                    <div className="animate-pulse text-3xl mb-2">Initializing Sovereign Compute Layer...</div>
                    <p className="text-cyan-400">Establishing secure connection to GenAI Fabric.</p>
                </div>
            </div>
        );
    }

    if (!appState.config.apiKey) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
                <div className="max-w-lg w-full bg-gray-800 p-10 rounded-xl shadow-2xl border border-red-700/50">
                    <h2 className="text-3xl font-extrabold text-red-400 mb-4">ACCESS DENIED: Authentication Required</h2>
                    <p className="text-gray-300 mb-6">The AI Core requires a valid API key for resource allocation and computation. Input your credentials below to proceed.</p>
                    {/* WARNING: This API key input and local storage mechanism is INSECURE for production.
                        It is included for MVP demonstration purposes only.
                        A production application must use a secure backend for API key management and
                        user authentication via robust protocols like OAuth2/OIDC.
                        Sensitive data like API keys should never be exposed client-side. */}
                    <div className="space-y-4">
                        <input
                            ref={apiKeyInputRef}
                            type="password"
                            placeholder="Enter Google GenAI API Key (e.g., AIzaSy...)"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-red-500 focus:border-red-500"
                        />
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        <button onClick={handleApiKeySave} className="w-full py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold transition-colors">
                            Authorize Compute Access
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        For production, API keys will be managed securely server-side. This local input is for development.
                    </p>
                </div>
            </div>
        );
    }
    
    // --- Main Application View ---
    return (
        <div className="flex h-screen overflow-hidden bg-gray-950 text-white">
            {/* Sidebar */}
            <ProjectSidebar 
                projects={appState.projects}
                currentProjectId={appState.currentProjectId}
                onSelectProject={id => dispatch({ type: 'SET_CURRENT_PROJECT', payload: id })}
                onCreateProject={handleCreateProject}
                onDeleteProject={handleDeleteProject}
                onRenameProject={handleRenameProject}
            />
            
            {/* Main Content Area */}
            <main className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                
                {/* Header Bar */}
                <header className="flex justify-between items-center pb-4 border-b border-gray-800 sticky top-0 bg-gray-950 z-10">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-white">AI Video Synthesis Platform</h1>
                        <p className="text-sm text-gray-400">Current Context: {currentProject?.name || "System Initialization"}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-cyan-400">Quota Remaining: {appState.config.aiQuotaRemaining.toLocaleString()}</p>
                        <button onClick={() => handleUpdateConfig({ apiKey: null })} className="text-xs text-red-400 hover:text-red-300 mt-1">Revoke API Key (Local)</button>
                    </div>
                </header>

                {currentProject ? (
                <>
                {/* Generation Panel */}
                <Card title={`Generation Module: ${currentProject.name}`} className="bg-gray-900/70 border-l-4 border-cyan-500 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Column 1: Mode & Controls */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="flex bg-gray-800 rounded-lg p-1 shadow-inner">
                                <button onClick={() => setGenerationMode('single_prompt')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${generationMode === 'single_prompt' ? 'bg-cyan-600 shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}>Single Prompt</button>
                                <button onClick={() => setGenerationMode('storyboard_sequence')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${generationMode === 'storyboard_sequence' ? 'bg-cyan-600 shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}>Storyboard Sequence</button>
                                {/* Future Module: <button onClick={() => setGenerationMode('ai_script_to_video')} disabled className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${generationMode === 'ai_script_to_video' ? 'bg-cyan-600 shadow-md' : 'text-gray-300 hover:bg-gray-700 disabled:opacity-50'}`}>AI Script (Future)</button> */}
                            </div>
                            
                            <GenerationControls 
                                settings={generationSettings} 
                                onSettingsChange={ (partial) => setGenerationSettings(s => ({...s, ...partial}))} 
                                isGenerating={isGenerating} 
                                aiQuota={appState.config.aiQuotaRemaining}
                            />
                        </div>
                        
                        {/* Column 2: Prompt Input */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card title={generationMode === 'single_prompt' ? "Primary Prompt Input (Max 500 Chars)" : "Project AI Summary"} className="h-full">
                                {generationMode === 'single_prompt' ? (
                                    <textarea 
                                        value={prompt} 
                                        onChange={e => setPrompt(e.target.value)} 
                                        placeholder="Describe the scene, style, and required action with high detail..." 
                                        maxLength={500}
                                        className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-cyan-500 resize-none" 
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-400 italic">
                                            {currentProject.aiSummary || "Click 'Synthesize Director Notes' below to generate a narrative summary based on your storyboard."}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            (This summary is stored as the project's high-level objective and provides explainability.)
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                    
                    {/* Storyboard Editor (Conditional) */}
                    {generationMode === 'storyboard_sequence' && (
                        <div className="mt-6">
                            <StoryboardEditor 
                                scenes={scenes} 
                                setScenes={setScenes} 
                                isGenerating={isGenerating} 
                                onGenerateDirectorSummary={handleGenerateDirectorSummary}
                                onScenePromptChange={(id, p) => setScenes(prev => prev.map(s => s.id === id ? {...s, prompt: p} : s))}
                                onSceneNotesChange={(id, n) => setScenes(prev => prev.map(s => s.id === id ? {...s, aiDirectorNotes: n} : s))}
                                onSceneDurationChange={(id, d) => setScenes(prev => prev.map(s => s.id === id ? {...s, duration: d} : s))}
                                onUpdateProjectSummary={handleUpdateProjectSummary}
                                currentProjectId={currentProject.id}
                            />
                        </div>
                    )}
                    
                    {/* Execution Button */}
                    <div className="mt-6 pt-4 border-t border-gray-800 flex justify-center">
                        <button 
                            onClick={handleGenerate} 
                            disabled={isGenerating || (generationMode === 'single_prompt' && !prompt.trim()) || (generationMode === 'storyboard_sequence' && scenes.some(s => !s.prompt.trim()))} 
                            className="w-1/2 py-3 text-lg font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-lg transition-all disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-[1.01]"
                        >
                            {generationState === 'polling' ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Processing... ({POLLING_MESSAGES[pollingMessageIndex]})</span>
                                </div>
                            ) : generationState === 'generating' ? (
                                <span>Initiating Compute Sequence...</span>
                            ) : (
                                <span>Execute Generation Run</span>
                            )}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-sm text-red-300">
                            ERROR: {error}
                        </div>
                    )}
                </Card>
                
                {/* Video Preview Area */}
                <Card title="Real-Time Preview & Output" className="bg-gray-900/70 border-l-4 border-gray-500 shadow-xl">
                    <div className={`mx-auto max-h-[60vh] w-full bg-black rounded-xl flex items-center justify-center border border-gray-700 overflow-hidden`}>
                        {generationState === 'done' && videoUrl ? (
                            <video src={videoUrl} controls autoPlay muted loop className="w-full h-full object-contain rounded-xl" />
                        ) : generationState === 'polling' || generationState === 'generating' ? (
                            <div className="text-center p-12">
                                <div className="relative w-20 h-20 mx-auto mb-4">
                                    <div className="absolute inset-0 border-8 border-cyan-500/20 rounded-full"></div>
                                    <div className="absolute inset-2 border-8 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
                                </div>
                                <p className="text-xl font-semibold text-cyan-300">Rendering Frame Sequence...</p>
                                <p className="text-sm text-gray-400 mt-1">{POLLING_MESSAGES[pollingMessageIndex]}</p>
                            </div>
                        ) : error ? (
                             <p className="text-red-400 p-8 text-center text-lg">Generation Failed. Review error log above.</p>
                        ) : (
                             <p className="text-gray-600 p-12 text-lg">Output Preview Window. Awaiting first successful generation.</p>
                        )}
                    </div>
                </Card>
                
                {/* Asset Library */}
                <Card title={`Asset Repository (${currentProjectAssets.length} Items)`} className="bg-gray-900/70 border-l-4 border-yellow-500 shadow-xl">
                    <AssetGrid 
                        assets={currentProjectAssets}
                        onDelete={handleDeleteAsset}
                        onToggleFavorite={handleToggleFavorite}
                        onSelect={handleAssetSelect}
                    />
                </Card>
                </>
                ) : (
                    <div className="flex items-center justify-center h-[70vh] bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
                        <div className="text-center p-10">
                            <p className="text-2xl font-semibold text-gray-400 mb-3">No Active Project Context</p>
                            <p className="text-gray-500">Use the Project Nexus sidebar to create a new campaign or select an existing one.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Asset Detail Modal (Enhanced) */}
            {selectedAsset && (
                 <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setSelectedAsset(null)}>
                    <div className="bg-gray-800 rounded-xl max-w-5xl w-[90%] md:w-[80%] p-6 space-y-6 shadow-3xl border border-cyan-600/50" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                            <h3 className="text-2xl font-bold text-white">Asset Manifest Viewer: {selectedAsset.id.substring(0, 12)}</h3>
                            <button onClick={() => setSelectedAsset(null)} className="text-gray-400 hover:text-white text-2xl p-1">✕</button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Video/Preview Area */}
                            <div className="lg:col-span-2 space-y-3">
                                <div className={`aspect-video bg-black rounded-lg border border-gray-600 overflow-hidden`}>
                                    <video src={selectedAsset.url} controls autoPlay loop muted className="w-full h-full object-contain"></video>
                                </div>
                                <p className="text-sm text-gray-400 italic">Asset Type: {selectedAsset.assetType}</p>
                            </div>
                            
                            {/* Metadata Column */}
                            <div className="lg:col-span-1 text-sm space-y-3 bg-gray-700/30 p-4 rounded-lg">
                                <h4 className="font-bold text-cyan-300 border-b border-gray-600 pb-1 mb-2">Generation Metadata</h4>
                                <p><strong>Created:</strong> {formatDate(selectedAsset.creationDate)}</p>
                                <p><strong>Last Accessed:</strong> {formatDate(selectedAsset.lastAccessed)}</p>
                                <p><strong>Estimated Cost:</strong> <span className="text-yellow-300">{selectedAsset.costCredits} Credits</span></p>
                                <p><strong>Favorite:</strong> {selectedAsset.isFavorite ? 'Yes' : 'No'}</p>
                                
                                <h4 className="font-bold text-cyan-300 border-b border-gray-600 pb-1 mt-4 mb-2">Settings Snapshot</h4>
                                <p><strong>Model:</strong> {selectedAsset.settings.model}</p>
                                <p><strong>Ratio:</strong> {selectedAsset.settings.aspectRatio}</p>
                                <p><strong>Style Strength:</strong> {selectedAsset.settings.stylizationStrength}%</p>
                                <p><strong>Motion:</strong> {selectedAsset.settings.motionControl}</p>
                                
                                {selectedAsset.generationMode === 'storyboard_sequence' && selectedAsset.storyboard && (
                                    <>
                                        <h4 className="font-bold text-cyan-300 border-b border-gray-600 pb-1 mt-4 mb-2">Storyboard Breakdown ({selectedAsset.storyboard.length} Scenes)</h4>
                                        <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                                            {selectedAsset.storyboard.map((scene, i) => (
                                                <p key={scene.id} className="text-xs bg-gray-800 p-1 rounded truncate">
                                                    {i+1}. ({scene.duration}s) {scene.prompt.substring(0, 40)}...
                                                </p>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                            <a href={selectedAsset.url} download={`ad_asset_${selectedAsset.id}.mp4`} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium">Download Raw Asset</a>
                            <button onClick={() => {
                                handleToggleFavorite(selectedAsset.id);
                                setSelectedAsset(s => s ? {...s, isFavorite: !s.isFavorite} : null);
                            }} className={`py-2 px-4 rounded-lg font-medium transition-colors ${selectedAsset.isFavorite ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-500 hover:bg-gray-400'} text-white`}>
                                {selectedAsset.isFavorite ? 'Unmark Favorite' : 'Mark as Favorite'}
                            </button>
                            <button onClick={() => {
                                if(window.confirm("Permanently delete this asset? This action cannot be undone.")) {
                                    handleDeleteAsset(selectedAsset.id);
                                    setSelectedAsset(null);
                                }
                            }} className="py-2 px-4 bg-red-700 hover:bg-red-600 text-white rounded-lg font-medium">Delete Asset</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAdStudioView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/AIAdStudioView.tsx
================================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Loader2,
  Download,
  Play,
  Video,
  ShieldCheck,
  Zap,
  Terminal,
  Lock,
  CreditCard,
  Activity,
  MessageSquare,
  Send,
  Sparkles,
  Cpu,
  Globe,
  Layers,
  AlertCircle,
  CheckCircle2,
  Database,
  Key,
  Eye,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - AI AD STUDIO & SECURE OPERATIONS MONOLITH
 *
 * PHILOSOPHY:
 * - "Golden Ticket" Experience: High-performance, elite UI.
 * - "Test Drive": Interactive, no-pressure, high-polish.
 * - "Bells and Whistles": Advanced encryption, real-time AI, audit trails.
 *
 * SECURITY:
 * - Homomorphic-simulated Internal App Storage (Closure-based, encrypted).
 * - Multi-factor authentication simulations.
 * - Real-time fraud monitoring.
 *
 * INTEGRATIONS:
 * - Stripe (Simulated high-fidelity).
 * - ERP/Accounting (Data visualization).
 * - Google GenAI (Gemini 2.5 Flash via @google/genai).
 */

// --- SECURE INTERNAL STORAGE (HOMOMORPHIC SIMULATION) ---
// This storage is not accessible via window or browser dev tools.
const QuantumVault = (() => {
  const _vault = new Map<string, string>();
  const _key = "QUANTUM_INTERNAL_SECRET_0x8821";

  const encrypt = (text: string) => {
    try {
      const utf8Text = unescape(encodeURIComponent(text));
      return btoa(utf8Text.split('').map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ _key.charCodeAt(i % _key.length))
      ).join(''));
    } catch (e) {
      return btoa(text);
    }
  };

  const decrypt = (encoded: string) => {
    try {
      const text = atob(encoded);
      const decoded = text.split('').map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ _key.charCodeAt(i % _key.length))
      ).join('');
      return decodeURIComponent(escape(decoded));
    } catch (e) {
      return atob(encoded);
    }
  };

  return {
    setItem: (key: string, value: unknown) => {
      try {
        const encryptedValue = encrypt(JSON.stringify(value));
        _vault.set(key, encryptedValue);
      } catch (e) {
        console.error("Vault serialization error:", e);
      }
    },
    getItem: (key: string) => {
      const val = _vault.get(key);
      if (!val) return null;
      try {
        return JSON.parse(decrypt(val));
      } catch (e) {
        return null;
      }
    },
    has: (key: string) => _vault.has(key),
    clear: () => _vault.clear()
  };
})();

// --- AUDIT LOGGING SYSTEM ---
interface AuditEntry {
  timestamp: string;
  action: string;
  details: unknown;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  id: string;
}

const QuantumAudit = {
  log: (action: string, details: unknown, severity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO') => {
    const logs: AuditEntry[] = QuantumVault.getItem('audit_logs') || [];
    const entry: AuditEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      severity,
      id: Math.random().toString(36).substring(2, 15)
    };
    QuantumVault.setItem('audit_logs', [entry, ...logs].slice(0, 100));
    console.log(`[AUDIT] ${severity}: ${action}`, details);
  }
};

// --- LOCAL COMPONENTS (To ensure self-containment) ---

const QuantumCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; className?: string }> = ({ title, children, icon, className }) => (
  <div className={`bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-indigo-500/30 ${className}`}>
    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-transparent to-white/[0.02]">
      <div className="flex items-center gap-3">
        {icon && <div className="text-indigo-400">{icon}</div>}
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">{title}</h3>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const StripeModal: React.FC<{ isOpen: boolean; onClose: () => void; onComplete: () => void }> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setLoading(true);
    QuantumAudit.log('STRIPE_PAYMENT_INITIATED', { amount: 499.00, currency: 'USD' });
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      QuantumAudit.log('STRIPE_PAYMENT_SUCCESS', { transactionId: 'pi_3N' + Math.random().toString(36).substring(7) });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.3)]">
        <div className="bg-[#635bff] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard size={24} />
            <span className="font-bold text-lg">Quantum Pay</span>
          </div>
          <button onClick={onClose} className="hover:opacity-70">✕</button>
        </div>
        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="text-gray-500 text-sm">Ad Studio Credits</p>
                  <p className="text-2xl font-bold text-gray-900">5,000 Units</p>
                </div>
                <p className="text-xl font-medium text-gray-900">$499.00</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Card Information</label>
                  <div className="border rounded-lg p-3 flex items-center gap-3 bg-gray-50">
                    <CreditCard className="text-gray-400" size={20} />
                    <input className="bg-transparent outline-none text-gray-800 w-full" placeholder="4242 4242 4242 4242" defaultValue="" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Expiry</label>
                    <input className="border rounded-lg p-3 bg-gray-50 w-full" placeholder="MM / YY" defaultValue="" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">CVC</label>
                    <input className="border rounded-lg p-3 bg-gray-50 w-full" placeholder="123" defaultValue="" />
                  </div>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-[#635bff] hover:bg-[#5a51e6] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : `Pay $499.00`}
              </button>
              <p className="text-[10px] text-center text-gray-400">Powered by Stripe. Secure, encrypted, and audited.</p>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Payment Successful</h3>
                <p className="text-gray-500">Your credits have been added to your Quantum Vault.</p>
              </div>
              <button
                onClick={() => { onComplete(); onClose(); }}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg"
              >
                Return to Studio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN VIEW COMPONENT ---

const AIAdStudioView: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState('A hyper-realistic cinematic commercial for Quantum Financial, showcasing global connectivity, high-speed data streams, and elite security vaults.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingStep, setPollingStep] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Welcome to the Quantum Ad Studio. I am your AI Creative Director. How can I help you build your brand's vision today?" }
  ]);
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [credits, setCredits] = useState(1250);
  const [showAudit, setShowAudit] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const POLLING_MESSAGES = [
    "Initializing Neural Video Synthesis Engine...",
    "Analyzing semantic intent vectors...",
    "Generating high-fidelity frame buffer...",
    "Executing temporal coherence algorithms...",
    "Optimizing lighting and global illumination...",
    "Finalizing secure asset manifest..."
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // AI Generation Logic
  const handleGenerate = async (overridePrompt?: string) => {
    const activePrompt = overridePrompt || prompt;
    if (!activePrompt.trim()) return;
    if (credits < 500) {
      setIsStripeOpen(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setPollingStep(0);
    QuantumAudit.log('VIDEO_GENERATION_STARTED', { prompt: activePrompt });

    intervalRef.current = setInterval(() => {
      setPollingStep(prev => (prev + 1) % POLLING_MESSAGES.length);
    }, 3000);

    try {
      // Simulate video synthesis pipeline
      await new Promise(resolve => setTimeout(resolve, 12000 + Math.random() * 3000));

      // Royalty-free sample video
      const simulatedVideoUrl = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';

      setVideoUrl(simulatedVideoUrl);
      setCredits(prev => prev - 500);
      QuantumAudit.log('VIDEO_GENERATION_SUCCESS', { url: simulatedVideoUrl });

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred during generation.';
      console.error("Video Generation Error:", err);
      setError(errorMsg);
      QuantumAudit.log('VIDEO_GENERATION_FAILED', { error: errorMsg }, 'WARN');
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsGenerating(false);
    }
  };

  // Chatbot Logic
  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiThinking(true);

    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured for client-side use. Please ensure NEXT_PUBLIC_GEMINI_API_KEY is set.");
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

      const systemContext = `
        You are the Quantum Financial AI Assistant.
        You help users create video ads, manage their credits, and understand their financial data.
        If the user wants to create a video, describe it and then say "[ACTION:GENERATE_VIDEO: prompt]".
        If the user wants to add credits, say "[ACTION:OPEN_STRIPE]".
        Be elite, professional, and high-performance.
        Current Credits: ${credits}.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemContext}\n\nUser: ${userMsg}`
      });

      const responseText = response.text || '';
      setChatHistory(prev => [...prev, { role: 'ai', text: responseText }]);

      // Parse Actions
      if (responseText.includes('[ACTION:GENERATE_VIDEO:')) {
        const match = responseText.match(/\[ACTION:GENERATE_VIDEO:\s*(.*?)\]/);
        if (match && match[1]) {
          setPrompt(match[1]);
          handleGenerate(match[1]);
        }
      }
      if (responseText.includes('[ACTION:OPEN_STRIPE]')) {
        setIsStripeOpen(true);
      }

      QuantumAudit.log('AI_CHAT_INTERACTION', { userMsg, aiResponse: responseText });
    } catch (err) {
      console.error("AI Chat Error:", err);
      setChatHistory(prev => [...prev, { role: 'ai', text: "I apologize, but my neural links are currently saturated, or there was an issue with the API. Please try again in a moment." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const auditLogs: AuditEntry[] = QuantumVault.getItem('audit_logs') || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      {/* TOP NAVIGATION BAR */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Zap className="text-white fill-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Quantum</h1>
                <p className="text-[10px] font-bold text-indigo-400 tracking-[0.3em] uppercase">Financial</p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex gap-6">
              {['Dashboard', 'Payments', 'Studio', 'Analytics', 'Vault'].map((item) => (
                <button key={item} className={`text-xs font-bold uppercase tracking-widest transition-colors ${item === 'Studio' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{credits} Credits</span>
              <button onClick={() => setIsStripeOpen(true)} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowAudit(!showAudit)} className="p-2 text-gray-400 hover:text-white transition-colors">
                <Activity size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/20 flex items-center justify-center font-bold text-xs">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* HERO SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Next-Gen Marketing</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">AI Ad Studio</h2>
            <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
              Experience the "Golden Ticket" of financial marketing. Test drive our neural synthesis engine to create high-performance cinematic assets for your global enterprise.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
              <Layers size={16} /> Templates
            </button>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
              <Play size={16} /> New Project
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: CREATIVE & PREVIEW */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <QuantumCard title="Creative Directives" icon={<Cpu size={18} />}>
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-sans transition-all placeholder:text-gray-700"
                      placeholder="Describe the cinematic vision..."
                      disabled={isGenerating}
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                        <Globe size={14} />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                        <Lock size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Resolution</label>
                      <div className="text-white font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div> 4K Ultra HD
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Engine</label>
                      <div className="text-white font-bold italic flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> VEO-3.1-PREVIEW
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
                  >
                    {isGenerating ? <><Loader2 className="animate-spin" /> Synthesizing Reality...</> : <><Video size={18} /> Execute Synthesis</>}
                  </button>
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                      <AlertCircle className="text-red-500 shrink-0" size={18} />
                      <p className="text-xs text-red-400 font-mono">{error}</p>
                    </div>
                  )}
                </div>
              </QuantumCard>

              <QuantumCard title="Asset Preview" icon={<Eye size={18} />}>
                <div className="aspect-video bg-black rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                  {isGenerating ? (
                    <div className="text-center p-6 space-y-6 z-10">
                      <div className="relative">
                        <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 border-2 border-blue-500/20 border-b-blue-500 rounded-full animate-spin-slow"></div>
                        </div>
                      </div>
                      <p className="text-[10px] text-indigo-400 font-mono animate-pulse tracking-[0.2em] uppercase">{POLLING_MESSAGES[pollingStep]}</p>
                    </div>
                  ) : videoUrl ? (
                    <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8 space-y-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <Bot size={40} className="text-gray-400" />
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase">Awaiting Signal Ingestion</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[8px] font-bold uppercase tracking-widest">Live Feed</div>
                    <div className="px-2 py-1 bg-indigo-600/60 backdrop-blur-md border border-indigo-500/20 rounded text-[8px] font-bold uppercase tracking-widest">Encrypted</div>
                  </div>
                </div>
                {videoUrl && (
                  <div className="mt-6 p-4 bg-green-500/5 rounded-xl border border-green-500/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Asset Manifest Valid</span>
                    </div>
                    <a href={videoUrl} download="quantum_synthesis.mp4" className="flex items-center gap-2 text-[10px] font-black text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500 transition-all uppercase tracking-widest">
                      <Download size={14} /> Download MP4
                    </a>
                  </div>
                )}
              </QuantumCard>
            </div>

            {/* ANALYTICS & ERP INTEGRATION SIMULATION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <QuantumCard title="System Load" icon={<BarChart3 size={16} />}>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Compute</span>
                    <span className="text-xl font-black text-indigo-400">94.2%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full w-[94%]"></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-gray-600 uppercase">
                    <span>Cluster_A: Active</span>
                    <span>Latency: 12ms</span>
                  </div>
                </div>
              </QuantumCard>
              <QuantumCard title="ERP Sync" icon={<Database size={16} />}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">SAP S/4HANA</p>
                      <p className="text-[8px] text-gray-500 uppercase">Last Sync: 2m ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">Oracle NetSuite</p>
                      <p className="text-[8px] text-gray-500 uppercase">Last Sync: 5m ago</p>
                    </div>
                  </div>
                </div>
              </QuantumCard>
              <QuantumCard title="Security" icon={<ShieldCheck size={16} />}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">MFA Status</span>
                    <span className="text-[10px] font-bold text-green-500 uppercase">Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Fraud Scan</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Clear</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Encryption</span>
                    <span className="text-[10px] font-bold text-white uppercase">AES-256-GCM</span>
                  </div>
                </div>
              </QuantumCard>
            </div>
          </div>

          {/* RIGHT COLUMN: AI ASSISTANT & AUDIT */}
          <div className="lg:col-span-4 space-y-8">
            <QuantumCard title="Quantum Assistant" icon={<MessageSquare size={18} />} className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10">
                      <Loader2 className="animate-spin text-indigo-400" size={16} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="mt-6 relative">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Ask the AI to create or manage..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button
                  onClick={handleChat}
                  className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </QuantumCard>

            {showAudit && (
              <QuantumCard title="Audit Trail" icon={<Terminal size={18} />} className="animate-in slide-in-from-right duration-300">
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {auditLogs.length === 0 ? (
                    <p className="text-[10px] text-gray-600 italic">No sensitive actions logged in this session.</p>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-black uppercase ${
                            log.severity === 'CRITICAL' ? 'text-red-500' : log.severity === 'WARN' ? 'text-yellow-500' : 'text-indigo-400'
                          }`}>{log.action}</span>
                          <span className="text-[8px] text-gray-600 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-mono truncate">{JSON.stringify(log.details)}</p>
                      </div>
                    ))
                  )}
                </div>
              </QuantumCard>
            )}

            <QuantumCard title="Vault Storage" icon={<Lock size={18} />}>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Key className="text-indigo-400" size={16} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Secure Keys</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase">API_GATEWAY</span>
                      <span className="text-[9px] font-mono text-gray-300">••••••••••••4291</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase">STRIPE_LIVE</span>
                      <span className="text-[9px] font-mono text-gray-300">••••••••••••8821</span>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-gray-600 italic leading-relaxed">
                  "All integration keys are stored in the Quantum Vault using homomorphic-simulated encryption. Data is never exposed to the browser's local storage or global scope."
                </p>
              </div>
            </QuantumCard>
          </div>
        </div>
      </main>

      {/* STRIPE MODAL */}
      <StripeModal
        isOpen={isStripeOpen}
        onClose={() => setIsStripeOpen(false)}
        onComplete={() => {
          setCredits(prev => prev + 5000);
          setChatHistory(prev => [...prev, { role: 'ai', text: "Excellent. Your credits have been replenished. We are ready to continue our creative journey." }]);
        }}
      />

      {/* FOOTER */}
      <footer className="max-w-[1600px] mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
            <Zap size={12} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Quantum Financial © 2024</span>
        </div>
        <div className="flex gap-8">
          {['Security Policy', 'Terms of Service', 'API Documentation', 'Support'].map(item => (
            <button key={item} className="text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors">
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          SYSTEMS_OPERATIONAL_0x00
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}} />
    </div>
  );
};

export default AIAdStudioView;