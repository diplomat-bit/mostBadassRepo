// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/AIAdStudioView.tsx
================================================================================

// components/views/platform/AIAdStudioView.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef, Reducer, useReducer } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from '../../Card';

const pollingMessages = [ "Initializing Veo 2.0 model...", "Analyzing prompt semantics...", "Generating initial keyframes...", "Rendering motion vectors...", "Upscaling to high resolution...", "Adding audio layer...", "Finalizing video file..." ];

// SECTION: Type Definitions for a real-world application
// =======================================================

export type GenerationState = 'idle' | 'generating' | 'polling' | 'done' | 'error';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '21:9';
export type VideoModel = 'veo-2.0-generate-001' | 'imagen-video-3-hq' | 'lumiere-hd-001' | 'phoenix-v1-fast';
export type GenerationMode = 'single' | 'storyboard';
export type AppTheme = 'dark' | 'light';
export type AppView = 'generator' | 'analytics';

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

export interface AdCopy {
    id: string;
    headline: string;
    body: string;
    cta: string; // Call to Action
}

export interface TargetAudience {
    id:string;
    name: string;
    demographics: string;
    interests: string[];
}

export interface CampaignIdea {
    id: string;
    title: string;
    description: string;
    platforms: ('YouTube' | 'TikTok' | 'Instagram' | 'Facebook')[];
}

export interface Comment {
    id: string;
    author: string;
    timestamp: string;
    text: string;
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
    // New AI-generated creative assets
    comments: Comment[];
    adCopy: AdCopy[];
    audiences: TargetAudience[];
    campaignIdeas: CampaignIdea[];
}

export interface BrandKit {
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
}

export interface AdProject {
    id: string;
    name: string;
    creationDate: string;
    lastModified: string;
    assets: VideoAsset[];
    brandKit: BrandKit;
}

export interface AppConfig {
    apiKey: string | null;
    theme: AppTheme;
    autoSave: boolean;
    defaultSettings: GenerationSettings;
}

// Analytics types
export interface CampaignPerformance {
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
}

export interface AssetPerformance {
    assetId: string;
    assetPrompt: string;
    url: string;
    ctr: number; // Click-through rate
    cvr: number; // Conversion rate
    cpa: number; // Cost per acquisition
}

export interface AnalyticsData {
    overallPerformance: CampaignPerformance[];
    topPerformingAssets: AssetPerformance[];
}

// SECTION: Mock API and Data Layer
// ===================================
// Simulates a backend with realistic data models and latency.

export class MockBackendAPI {
    private projects: AdProject[] = [];
    private latency: number = 500; // ms

    constructor() {
        this.loadFromLocalStorage();
    }

    private async simulateLatency(override?: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, override || this.latency));
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
                const defaultProject: AdProject = {
                    id: `proj_${Date.now()}`,
                    name: 'My First Campaign',
                    creationDate: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    assets: [],
                    brandKit: {
                        logoUrl: '',
                        primaryColor: '#06b6d4',
                        secondaryColor: '#ec4899',
                        font: 'Inter',
                    }
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
            brandKit: {
                logoUrl: '',
                primaryColor: '#0891b2',
                secondaryColor: '#be185d',
                font: 'Roboto',
            }
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

    public async updateBrandKit(projectId: string, brandKit: BrandKit): Promise<AdProject | null> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.brandKit = brandKit;
            project.lastModified = new Date().toISOString();
            this.saveToLocalStorage();
            return { ...project };
        }
        return null;
    }
    
    public async addAssetToProject(projectId: string, asset: Omit<VideoAsset, 'id' | 'projectId' | 'creationDate' | 'comments' | 'adCopy' | 'audiences' | 'campaignIdeas'>): Promise<VideoAsset> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (!project) throw new Error('Project not found');
        
        const newAsset: VideoAsset = {
            ...asset,
            id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            creationDate: new Date().toISOString(),
            comments: [],
            adCopy: [],
            audiences: [],
            campaignIdeas: [],
        };
        project.assets.unshift(newAsset);
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

    public async addComment(projectId: string, assetId: string, text: string): Promise<Comment> {
        await this.simulateLatency(100);
        const project = this.projects.find(p => p.id === projectId);
        const asset = project?.assets.find(a => a.id === assetId);
        if (!asset) throw new Error('Asset not found');

        const newComment: Comment = {
            id: generateUniqueId(),
            author: "CurrentUser", // In a real app, this would come from an auth context
            timestamp: new Date().toISOString(),
            text,
        };
        asset.comments.push(newComment);
        this.saveToLocalStorage();
        return newComment;
    }

    public async generateAdCreative(assetId: string, projectId: string): Promise<Pick<VideoAsset, 'adCopy' | 'audiences' | 'campaignIdeas'>> {
        await this.simulateLatency(2000); // Simulate AI generation time
        const project = this.projects.find(p => p.id === projectId);
        const asset = project?.assets.find(a => a.id === assetId);
        if (!asset) throw new Error('Asset not found');
        
        // Mocked AI response based on prompt
        const creativeSuite = {
            adCopy: [
                { id: generateUniqueId(), headline: `Experience the Future: ${asset.prompt.split(' ')[4]}`, body: 'Discover a new dimension of innovation. Our product redefines what\'s possible.', cta: 'Learn More' },
                { id: generateUniqueId(), headline: 'Unleash Your Potential', body: `Inspired by "${asset.prompt}", we bring you the ultimate tool for success.`, cta: 'Shop Now' },
            ],
            audiences: [
                { id: generateUniqueId(), name: 'Tech Enthusiasts', demographics: 'Ages 25-45, Urban, High-income', interests: ['Gadgets', 'AI', 'Futurism'] },
                { id: generateUniqueId(), name: 'Early Adopters', demographics: 'Ages 18-35, Trend-setters', interests: ['Startups', 'Kickstarter', 'Sci-Fi'] },
            ],
            campaignIdeas: [
                { id: generateUniqueId(), title: 'Cyberpunk City Launch', description: 'A multi-platform campaign focusing on the futuristic and high-tech aspects of the product.', platforms: ['YouTube', 'Instagram', 'TikTok'] },
            ]
        };
        
        asset.adCopy = creativeSuite.adCopy;
        asset.audiences = creativeSuite.audiences;
        asset.campaignIdeas = creativeSuite.campaignIdeas;
        this.saveToLocalStorage();
        
        return creativeSuite;
    }

    public async getAnalytics(projectId: string): Promise<AnalyticsData> {
        await this.simulateLatency();
        const project = this.projects.find(p => p.id === projectId);
        if (!project) throw new Error('Project not found');

        const overallPerformance: CampaignPerformance[] = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            overallPerformance.push({
                date: date.toISOString().split('T')[0],
                impressions: Math.floor(Math.random() * 20000) + 10000,
                clicks: Math.floor(Math.random() * 1000) + 200,
                conversions: Math.floor(Math.random() * 50) + 5,
                spend: Math.floor(Math.random() * 400) + 150,
            });
        }

        const topPerformingAssets: AssetPerformance[] = project.assets.slice(0, 5).map(asset => ({
            assetId: asset.id,
            assetPrompt: asset.prompt,
            url: asset.url,
            ctr: parseFloat((Math.random() * 5 + 1).toFixed(2)),
            cvr: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
            cpa: parseFloat((Math.random() * 50 + 10).toFixed(2)),
        }));

        return { overallPerformance, topPerformingAssets };
    }
}

// Instantiate the mock API
export const mockApi = new MockBackendAPI();

// SECTION: Utility Functions
// ==========================

export const generateUniqueId = (): string => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const formatDate = (isoString: string): string => {
    try {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
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
    | { type: