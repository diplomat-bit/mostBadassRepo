// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/AIAdStudioView.tsx.md
================================================================================

```typescript
/*
# The Propaganda Engine

This is the chamber where intent is given a voice that can move mountains. It is a studio not for advertisements, but for proclamations. Here, a whisper of will is amplified into a signal that can rearrange the world's perception. It is the art of turning a silent, internal vision into an external, resonant truth. To build here is to learn how to speak in the language of influence itself.

---

### A Fable for the Builder: The Dream Projector

(They told us that machines could be logical. Fast. Efficient. They never told us they could be myth-makers. This `AIAdStudio` is our proof that they were wrong. It is a testament to the idea that a machine, given the right command, can become a partner in the act of shaping reality.)

(The Veo 2.0 model is not just a video generator. It is a dream projector. It takes the most abstract of thingsâ€”a line of text, an idea, a declarationâ€”and transmutes it into the most concrete and powerful of mediums: a moving image. "A neon hologram of a cat driving a futuristic car..." This is not a logical request. It is a fragment of a myth.)

(And the AI's task is not to execute a command, but to interpret a myth. This is where its unique power lies. It has been trained on the vast ocean of human storytelling, on cinema, on art, on the very grammar of our collective consciousness. It understands the emotional resonance of 'neon hologram,' the kinetic energy of 'top speed,' the atmospheric weight of 'cyberpunk city.')

(Its logic is not deductive. It is generative. It is creative. It takes your words, your seeds of an idea, and from them, it grows a world. The `pollingMessages` are a window into that process. "Generating initial keyframes..." "Rendering motion vectors..." These are the technical terms for what is, in essence, an act of forging a new reality.)

(This is a profound shift in our relationship with technology. The machine is no longer just a tool to be wielded. It is an instrument of power to be commanded. A collaborator that can take the faintest whisper of your vision and amplify it into a symphony of light and sound, ready to be unleashed upon the world. All you have to do is provide the first decree.)

*/

import React, { 
    useState, 
    useEffect, 
    useCallback, 
    useReducer, 
    createContext, 
    useContext, 
    useRef, 
    useMemo 
} from 'react';

// SECTION: Type Definitions
// ============================================================================

export enum AssetStatus {
    PENDING = 'PENDING',
    GENERATING = 'GENERATING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    QUEUED = 'QUEUED',
}

export enum AIVideoModel {
    VEO_2_PRO = 'VEO_2_PRO',
    SORA_OPTIMIZED = 'SORA_OPTIMIZED',
    STABLE_VIDEO_XT = 'STABLE_VIDEO_XT',
    LUMIERE_MAX = 'LUMIERE_MAX',
}

export enum AIImageModel {
    DALL_E_3_HD = 'DALL_E_3_HD',
    MIDJOURNEY_V6_ALPHA = 'MIDJOURNEY_V6_ALPHA',
    STABLE_DIFFUSION_3 = 'STABLE_DIFFUSION_3',
}

export enum AITextModel {
    GPT_4O = 'GPT_4O',
    CLAUDE_3_OPUS = 'CLAUDE_3_OPUS',
    GEMINI_1_5_PRO = 'GEMINI_1_5_PRO',
}

export enum AIVoiceModel {
    ELEVEN_TURBO_V2 = 'ELEVEN_TURBO_V2',
    OPENAI_TTS_HD = 'OPENAI_TTS_HD',
    PLAYHT_2_0_PREMIUM = 'PLAYHT_2_0_PREMIUM',
}

export enum AIMusicModel {
    UDIO_V1 = 'UDIO_V1',
    SUNO_V3_PRO = 'SUNO_V3_PRO',
    STABLE_AUDIO_2 = 'STABLE_AUDIO_2',
}

export enum AspectRatio {
    SIXTEEN_NINE = '16:9',
    NINE_SIXTEEN = '9:16',
    ONE_ONE = '1:1',
    FOUR_FIVE = '4:5',
}

export enum VideoResolution {
    HD_720P = '1280x720',
    FHD_1080P = '1920x1080',
    QHD_1440P = '2560x1440',
    UHD_4K = '3840x2160',
}

export enum AdPlatform {
    YOUTUBE = 'YouTube',
    TIKTOK = 'TikTok',
    INSTAGRAM_REELS = 'Instagram Reels',
    FACEBOOK_FEED = 'Facebook Feed',
    LINKEDIN = 'LinkedIn Feed',
    LINEAR_TV = 'Linear TV',
    CTV = 'Connected TV',
}

export enum PlatformDeploymentStatus {
    DRAFT = 'Draft',
    PENDING_REVIEW = 'Pending Review',
    ACTIVE = 'Active',
    PAUSED = 'Paused',
    COMPLETED = 'Completed',
    REJECTED = 'Rejected',
}

export interface BrandProfile {
    id: string;
    name: string;
    industry: string;
    logoUrl?: string;
    brandColors: string[];
    voiceGuidelines: string;
    targetAudience: string;
    productOrService: string;
}

export interface CampaignBrief {
    objective: string;
    keyMessage: string;
    callToAction: string;
    durationSeconds: number;
    preferredTone: ('humorous' | 'inspirational' | 'dramatic' | 'urgent' | 'educational')[];
}

export interface VisualAsset {
    id: string;
    type: 'video' | 'image';
    url: string;
    thumbnailUrl: string;
    prompt: string;
    negativePrompt?: string;
    model: AIVideoModel | AIImageModel;
    status: AssetStatus;
    generationProgress: number; // 0-100
    generationLogs: string[];
    createdAt: string;
    duration?: number; // for video
}

export type AudioAssetType = 'voiceover' | 'music' | 'sfx';

export interface AudioAsset {
    id: string;
    type: AudioAssetType;
    url: string;
    prompt?: string;
    model?: AIVoiceModel | AIMusicModel;
    status: AssetStatus;
    createdAt: string;
    duration: number;
    sourceText?: string; // For voiceovers
    voiceId?: string; // For TTS
}

export interface TextOverlay {
    id: string;
    content: string;
    font: string;
    size: number;
    color: string;
    position: { x: number; y: number }; // Percentage
    animationIn: 'fadeIn' | 'slideUp' | 'zoomIn';
    animationOut: 'fadeOut' | 'slideDown' | 'zoomOut';
}

export interface TimelineClip {
    id: string;
    assetId: string;
    assetType: 'visual' | 'audio';
    track: 'video' | 'voiceover' | 'music' | 'sfx' | 'text';
    startTime: number; // in seconds
    endTime: number; // in seconds
    sourceStartTime: number; // for trimming, in seconds
    sourceEndTime: number; // for trimming, in seconds
    volume?: number; // 0-100 for audio
    object?: TextOverlay; // For text track
}

export interface Scene {
    id: string;
    sceneNumber: number;
    description: string;
    scriptText: string;
    visualPrompt: string;
    visualAssetId?: string;
    durationEstimate: number; // in seconds
}

export interface Timeline {
    duration: number; // Total duration in seconds
    clips: TimelineClip[];
    aspectRatio: AspectRatio;
}

export interface PlatformSettings {
    platform: AdPlatform;
    budget: number;
    bidStrategy: string;
    adCopy: string;
    headline: string;
    targetingParameters: Record<string, any>;
}

export interface CampaignSettings {
    name: string;
    totalBudget: number;
    currency: 'USD' | 'EUR' | 'GBP';
    startDate: string;
    endDate: string;
    geoTargeting: string[]; // e.g., ['USA', 'Canada']
    platformSettings: PlatformSettings[];
}

export interface PlatformDeployment {
    platform: AdPlatform;
    status: PlatformDeploymentStatus;
    deploymentId: string;
    metrics: {
        impressions: number;
        clicks: number;
        ctr: string;
        spend: number;
    };
}

export interface AdProject {
    id: string;
    name: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    brandProfile: BrandProfile;
    campaignBrief: CampaignBrief;
    script: string;
    scenes: Scene[];
    assets: {
        visual: VisualAsset[];
        audio: AudioAsset[];
    };
    timeline: Timeline;
    campaignSettings: CampaignSettings;
    deployments: PlatformDeployment[];
    status: 'DRAFT' | 'RENDERING' | 'COMPLETE' | 'ARCHIVED' | 'DEPLOYED';
    renderProgress?: number;
    finalVideoUrl?: string;
}

type ProjectState = AdProject | null;

type ProjectAction =
    | { type: 'LOAD_PROJECT'; payload: AdProject }
    | { type: 'UPDATE_NAME'; payload: string }
    | { type: 'UPDATE_SCRIPT'; payload: string }
    | { type: 'SET_SCENES'; payload: Scene[] }
    | { type: 'ADD_ASSET'; payload: { type: 'visual' | 'audio'; asset: VisualAsset | AudioAsset } }
    | { type: 'UPDATE_ASSET'; payload: { assetId: string, updates: Partial<VisualAsset | AudioAsset> } }
    | { type: 'ADD_CLIP_TO_TIMELINE'; payload: TimelineClip }
    | { type: 'UPDATE_CLIP_IN_TIMELINE'; payload: TimelineClip }
    | { type: 'REMOVE_CLIP_FROM_TIMELINE'; payload: string }
    | { type: 'SET_TIMELINE'; payload: Timeline }
    | { type: 'UPDATE_CAMPAIGN_SETTINGS'; payload: Partial<CampaignSettings> }
    | { type: 'UPDATE_PLATFORM_SETTINGS'; payload: PlatformSettings }
    | { type: 'INITIATE_DEPLOYMENT'; payload: PlatformDeployment[] }
    | { type: 'UPDATE_DEPLOYMENT_STATUS'; payload: { platform: AdPlatform; status: PlatformDeploymentStatus; metrics?: any } }
    | { type: 'START_RENDER' }
    | { type: 'UPDATE_RENDER_PROGRESS'; payload: number }
    | { type: 'FINISH_RENDER'; payload: string };

// SECTION: Mock API Layer
// ============================================================================

const MOCK_POLLING_MESSAGES = [
    "Initializing generative core...",
    "Parsing semantic intent from prompt...",
    "Establishing latent space vectors...",
    "Generating initial keyframes...",
    "Performing diffusion process pass 1/7...",
    "Analyzing frame coherence...",
    "Rendering motion vectors...",
    "Performing diffusion process pass 3/7...",
    "Upscaling temporal resolution...",
    "Synthesizing audio-visual alignment...",
    "Performing diffusion process pass 6/7...",
    "Applying post-production color grade...",
    "Finalizing render and encoding...",
    "Transmuting bits into reality...",
];

export const mockApi = {
    fetchProjects: async (): Promise<Partial<AdProject>[]> => {
        console.log('API: Fetching projects...');
        return new Promise(resolve => setTimeout(() => {
            resolve([
                { id: 'proj_1', name: 'Project "Genesis"', updatedAt: new Date().toISOString(), status: 'COMPLETE' },
                { id: 'proj_2', name: 'Q3 Product Launch', updatedAt: new Date().toISOString(), status: 'DRAFT' },
                { id: 'proj_3', name: 'Cyber Monday Flash Sale', updatedAt: new Date().toISOString(), status: 'RENDERING' },
            ]);
        }, 800));
    },

    fetchProjectById: async (id: string): Promise<AdProject> => {
        console.log(`API: Fetching project ${id}...`);
        return new Promise(resolve => setTimeout(() => {
            const mockProject: AdProject = {
                id,
                name: 'Q3 Product Launch',
                version: 1,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                updatedAt: new Date().toISOString(),
                brandProfile: {
                    id: 'brand_1',
                    name: 'InnovateInc',
                    industry: 'Tech Hardware',
                    logoUrl: '/logos/innovate_inc_logo.png',
                    brandColors: ['#0A2647', '#1C6DD0', '#FFFFFF'],
                    voiceGuidelines: 'Confident, futuristic, and innovative. Focus on benefits, not just features.',
                    targetAudience: 'Early adopters, tech enthusiasts, creative professionals.',
                    productOrService: 'The "Quantum" Laptop'
                },
                campaignBrief: {
                    objective: 'Drive pre-orders for the new Quantum Laptop.',
                    keyMessage: 'Unleash your creativity with the speed of thought.',
                    callToAction: 'Pre-order now and get a free stylus.',
                    durationSeconds: 30,
                    preferredTone: ['inspirational', 'dramatic'],
                },
                script: "In a world of limitations, one device pushes the boundaries.\n(Dramatic music swells)\nThe Quantum Laptop from InnovateInc.\n(Quick cuts of sleek design and powerful graphics)\nUnleash your creativity at the speed of thought.\n(Final shot of the product with text overlay)\nPre-order yours today.",
                scenes: [
                    { id: 'scene_1', sceneNumber: 1, description: 'Abstract representation of ideas flowing', scriptText: 'In a world of limitations, one device pushes the boundaries.', visualPrompt: 'An abstract, beautiful visualization of neural networks and flowing data streams, cinematic, 8k, photorealistic', durationEstimate: 8 },
                    { id: 'scene_2', sceneNumber: 2, description: 'Showcase the product', scriptText: 'The Quantum Laptop from InnovateInc.', visualPrompt: 'A sleek, futuristic laptop floating in a minimalist, clean white space, studio lighting, product shot, hero angle', durationEstimate: 7 },
                    { id: 'scene_3', sceneNumber: 3, description: 'Show people using it for creative tasks', scriptText: 'Unleash your creativity at the speed of thought.', visualPrompt: 'Montage of diverse, creative people (architect, musician, scientist) using a futuristic laptop, their ideas coming to life as holograms, fast-paced, inspirational', durationEstimate: 10 },
                    { id: 'scene_4', sceneNumber: 4, description: 'Call to action', scriptText: 'Pre-order yours today.', visualPrompt: 'The laptop closes slowly, the glowing brand logo on the back facing the camera. Text overlay appears: "Pre-order now"', durationEstimate: 5 },
                ],
                assets: { visual: [], audio: [] },
                timeline: { duration: 30, clips: [], aspectRatio: AspectRatio.SIXTEEN_NINE },
                campaignSettings: {
                    name: 'Q3 Quantum Laptop Launch',
                    totalBudget: 50000,
                    currency: 'USD',
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
                    geoTargeting: ['USA', 'Germany', 'Japan'],
                    platformSettings: [],
                },
                deployments: [],
                status: 'DRAFT',
            };
            resolve(mockProject);
        }, 1200));
    },

    generateVisualAsset: async (prompt: string, model: AIVideoModel | AIImageModel, onProgress: (progress: number, log: string) => void): Promise<Partial<VisualAsset>> => {
        console.log(`API: Generating visual with model ${model} for prompt: "${prompt}"`);
        const totalSteps = MOCK_POLLING_MESSAGES.length;
        for (let i = 0; i < totalSteps; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
            const progress = Math.round(((i + 1) / totalSteps) * 100);
            onProgress(progress, MOCK_POLLING_MESSAGES[i]);
        }
        return {
            url: 'https://via.placeholder.com/1920x1080.png?text=Generated+Video',
            thumbnailUrl: 'https://via.placeholder.com/320x180.png?text=Preview',
            status: AssetStatus.COMPLETED,
            duration: 10, // Mock duration
        };
    },
    
    generateScriptFromBrief: async (brief: CampaignBrief, brandProfile: BrandProfile): Promise<string[]> => {
        console.log('API: Generating script variants...');
        await new Promise(resolve => setTimeout(resolve, 2500));
        return [
            `Script Variant 1 (Dramatic): A voice echoes, "We were told to think inside the box." A box shatters revealing the ${brandProfile.productOrService}. "They were wrong." ${brief.callToAction}.`,
            `Script Variant 2 (Humorous): A person struggles with an old, slow computer. "Is this thing powered by a hamster?" Cut to the sleek ${brandProfile.productOrService}. Narrator: "Time for an upgrade." ${brief.callToAction}.`,
            `Script Variant 3 (Inspirational): Montage of beautiful user-generated content. "Your vision is limitless. Your tools should be too." Introducing the ${brandProfile.productOrService}. ${brief.callToAction}.`,
        ];
    },
    
    generateAudioAsset: async(type: AudioAssetType, prompt: string, model: AIVoiceModel | AIMusicModel): Promise<Partial<AudioAsset>> => {
        console.log(`API: Generating ${type} with model ${model} for prompt: "${prompt}"`);
        await new Promise(resolve => setTimeout(resolve, 3000 + prompt.length * 15));
        return {
            type: type,
            url: `/mock-audio/${type}.mp3`,
            status: AssetStatus.COMPLETED,
            duration: type === 'voiceover' ? (prompt.length / 15) : 30,
        }
    },

    deployCampaign: async(settings: CampaignSettings): Promise<PlatformDeployment[]> => {
        console.log('API: Deploying campaign...', settings);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return settings.platformSettings.map(ps => ({
            platform: ps.platform,
            status: PlatformDeploymentStatus.PENDING_REVIEW,
            deploymentId: `${ps.platform.toLowerCase()}_${Date.now()}`,
            metrics: { impressions: 0, clicks: 0, ctr: '0.00%', spend: 0 }
        }));
    }
};

// SECTION: State Management (Reducer and Context)
// ============================================================================

export const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
    if (!state && action.type !== 'LOAD_PROJECT') return null;

    switch (action.type) {
        case 'LOAD_PROJECT':
            return action.payload;
        case 'UPDATE_NAME':
            return { ...state, name: action.payload, updatedAt: new Date().toISOString() };
        case 'UPDATE_SCRIPT':
            return { ...state, script: action.payload, updatedAt: new Date().toISOString() };
        case 'SET_SCENES':
             return { ...state, scenes: action.payload, updatedAt: new Date().toISOString() };
        case 'ADD_ASSET': {
            const { type, asset } = action.payload;
            const newAssets = { ...state.assets };
            if (type === 'visual') {
                newAssets.visual = [...newAssets.visual, asset as VisualAsset];
            } else {
                newAssets.audio = [...newAssets.audio, asset as AudioAsset];
            }
            return { ...state, assets: newAssets, updatedAt: new Date().toISOString() };
        }
        case 'UPDATE_ASSET': {
            const { assetId, updates } = action.payload;
            return {
                ...state,
                assets: {
                    visual: state.assets.visual.map(asset => asset.id === assetId ? { ...asset, ...updates } : asset),
                    audio: state.assets.audio.map(asset => asset.id === assetId ? { ...asset, ...updates } : asset),
                },
                updatedAt: new Date().toISOString()
            };
        }
        case 'ADD_CLIP_TO_TIMELINE': {
            const newTimeline = { ...state.timeline, clips: [...state.timeline.clips, action.payload] };
            return { ...state, timeline: newTimeline, updatedAt: new Date().toISOString() };
        }
        case 'UPDATE_CLIP_IN_TIMELINE': {
            const newTimeline = { ...state.timeline, clips: state.timeline.clips.map(clip => clip.id === action.payload.id ? action.payload : clip) };
            return { ...state, timeline: newTimeline, updatedAt: new Date().toISOString() };
        }
        case 'REMOVE_CLIP_FROM_TIMELINE': {
            const newTimeline = { ...state.timeline, clips: state.timeline.clips.filter(clip => clip.id !== action.payload) };
            return { ...state, timeline: newTimeline, updatedAt: new Date().toISOString() };
        }
        case 'SET_TIMELINE': {
            return { ...state, timeline: action.payload, updatedAt: new Date().toISOString() };
        }
        case 'UPDATE_CAMPAIGN_SETTINGS': {
            return { ...state, campaignSettings: { ...state.campaignSettings, ...action.payload }, updatedAt: new Date().toISOString() };
        }
        case 'UPDATE_PLATFORM_SETTINGS': {
            const newPlatformSettings = state.campaignSettings.platformSettings.map(p => p.platform === action.payload.platform ? action.payload : p);
            if (!newPlatformSettings.find(p => p.platform === action.payload.platform)) {
                newPlatformSettings.push(action.payload);
            }
            return { ...state, campaignSettings: { ...state.campaignSettings, platformSettings: newPlatformSettings }, updatedAt: new Date().toISOString() };
        }
        case 'INITIATE_DEPLOYMENT': {
            return { ...state, deployments: action.payload, status: 'DEPLOYED', updatedAt: new Date().toISOString() };
        }
        case 'UPDATE_DEPLOYMENT_STATUS': {
            const { platform, status, metrics } = action.payload;
            const newDeployments = state.deployments.map(d => {
                if (d.platform === platform) {
                    return { ...d, status, metrics: metrics ? { ...d.metrics, ...metrics } : d.metrics };
                }
                return d;
            });
            return { ...state, deployments: newDeployments, updatedAt: new Date().toISOString() };
        }
        case 'START_RENDER':
            return { ...state, status: 'RENDERING', renderProgress: 0 };
        case 'UPDATE_RENDER_PROGRESS':
            return { ...state, renderProgress: action.payload };
        case 'FINISH_RENDER':
            return { ...state, status: 'COMPLETE', finalVideoUrl: action.payload, renderProgress: 100 };
        default:
            return state;
    }
};

interface ProjectContextType {
    project: ProjectState;
    dispatch: React.Dispatch<ProjectAction>;
    isLoading: boolean;
    error: string | null;
    addClipToTimeline: (clipData: Omit<TimelineClip, 'id'>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};

// SECTION: UI Components
// ============================================================================

// --- Generic UI Primitives ---

const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
    const baseStyle = "px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out inline-flex items-center justify-center";
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };
    const disabledStyle = 'disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variantStyles[variant]} ${disabledStyle} ${className}`}
        >
            {children}
        </button>
    );
};

const Spinner = ({ size = 'md' }) => {
    const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-16 h-16' };
    return <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizeMap[size]}`}></div>;
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                <div className="mt-4 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>{children}</div>
);

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
);

const Textarea = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
    </div>
);

// --- App-specific Components ---

const ProjectManager = ({ onSelectProject }) => {
    const [projects, setProjects] = useState<Partial<AdProject>[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        mockApi.fetchProjects().then(data => {
            setProjects(data);
            setIsLoading(false);
        });
    }, []);

    const handleCreateProject = (newProjectData) => {
        console.log("Creating new project:", newProjectData);
        const newProject = { id: `proj_${Date.now()}`, name: newProjectData.name, status: 'DRAFT', updatedAt: new Date().toISOString() };
        setProjects(prev => [newProject, ...prev]);
        setCreateModalOpen(false);
        onSelectProject(newProject.id);
    };

    return (
        <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-4 flex flex-col h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Propaganda Engine</h2>
            <Button onClick={() => setCreateModalOpen(true)} className="w-full mb-4">New Proclamation</Button>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Projects</h3>
            <div className="flex-grow overflow-y-auto pr-2">
                {isLoading ? <div className="flex justify-center mt-8"><Spinner /></div> : (
                    <ul>
                        {projects.map(p => (
                            <li key={p.id} onClick={() => onSelectProject(p.id)}
                                className="p-3 mb-2 rounded-md hover:bg-blue-100 cursor-pointer border border-gray-200 transition-colors">
                                <p className="font-semibold text-gray-900">{p.name}</p>
                                <p className="text-sm text-gray-500">Status: {p.status}</p>
                                <p className="text-xs text-gray-400">Updated: {new Date(p.updatedAt).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <NewProjectModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreateProject} />
        </div>
    );
};

const NewProjectModal = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [objective, setObjective] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({ name, objective });
        setName('');
        setObjective('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Start a New Proclamation">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input label="Project Name" id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
                    <Textarea label="Primary Objective" id="objective" value={objective} onChange={e => setObjective(e.target.value)} rows={3} required />
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <Button onClick={onClose} variant="secondary" type="button">Cancel</Button>
                    <Button type="submit">Create</Button>
                </div>
            </form>
        </Modal>
    );
};

const StudioWorkspace = () => {
    const { project } = useProject();
    const [activeTab, setActiveTab] = useState('script');

    if (!project) {
        return <div className="flex-grow flex items-center justify-center bg-gray-100 text-gray-500">Select or create a project to begin.</div>;
    }

    const tabs = [
        { id: 'script', label: 'Scripting' },
        { id: 'visuals', label: 'Visuals' },
        { id: 'audio', label: 'Audio' },
        { id: 'timeline', label: 'Timeline' },
        { id: 'deploy', label: 'Deploy' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'script': return <ScriptingAssistant />;
            case 'visuals': return <VisualsGenerator />;
            case 'audio': return <AudioStudio />;
            case 'timeline': return <TimelineEditor />;
            case 'deploy': return <CampaignDeployment />;
            default: return null;
        }
    }

    return (
        <div className="flex-grow flex flex-col p-6 bg-gray-100 h-screen overflow-hidden">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-sm text-gray-600 mb-4">Brand: {project.brandProfile.name} | Objective: {project.campaignBrief.objective}</p>
            <div className="border-b border-gray-300">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-grow mt-6 overflow-hidden">{renderTabContent()}</div>
        </div>
    );
};

const ScriptingAssistant = () => {
    const { project, dispatch } = useProject();
    const [script, setScript] = useState(project.script);
    const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedVariants([]);
        const variants = await mockApi.generateScriptFromBrief(project.campaignBrief, project.brandProfile);
        setGeneratedVariants(variants);
        setIsGenerating(false);
    };
    
    const handleApplyVariant = (variant: string) => {
        setScript(variant);
        dispatch({ type: 'UPDATE_SCRIPT', payload: variant });
        setGeneratedVariants([]);
    };

    const handleSave = () => {
        dispatch({ type: 'UPDATE_SCRIPT', payload: script });
        const scenesFromScript = parseScriptToScenes(script);
        dispatch({ type: 'SET_SCENES', payload: scenesFromScript });
        alert("Script saved and scenes parsed. Check the Visuals tab.");
    };

    return (
        <div className="grid grid-cols-3 gap-6 h-full">
            <div className="col-span-2 flex flex-col">
                <Card className="flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">Script Editor</h3>
                    <textarea value={script} onChange={e => setScript(e.target.value)}
                        className="w-full flex-grow rounded-md border-gray-300 font-mono text-sm p-2"
                        placeholder="Write your ad script here or use the AI assistant..." />
                    <div className="mt-4 flex justify-end">
                        <Button onClick={handleSave}>Save & Parse Scenes</Button>
                    </div>
                </Card>
            </div>
            <div className="col-span-1">
                <Card>
                     <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
                     <div className="space-y-4">
                        <p className="text-sm text-gray-600">Generate script ideas based on your campaign brief.</p>
                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                            {isGenerating ? <><Spinner size="sm" /> <span className="ml-2">Generating...</span></> : 'Generate Script Variants'}
                        </Button>
                        {generatedVariants.length > 0 && (
                            <div className="mt-4 space-y-3">
                                <h4 className="font-semibold">Generated Variants:</h4>
                                {generatedVariants.map((variant, index) => (
                                    <div key={index} className="p-3 border rounded-md bg-gray-50">
                                        <p className="text-sm text-gray-800">{variant}</p>
                                        <Button onClick={() => handleApplyVariant(variant)} variant="secondary" className="mt-2 text-xs py-1 px-2">
                                            Use this variant
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>
                </Card>
            </div>
        </div>
    );
};

const VisualsGenerator = () => {
    const { project, dispatch } = useProject();
    const [selectedSceneId, setSelectedSceneId] = useState<string | null>(project.scenes[0]?.id || null);

    const selectedScene = useMemo(() => project.scenes.find(s => s.id === selectedSceneId), [project.scenes, selectedSceneId]);
    const sceneAssets = useMemo(() => project.assets.visual.filter(asset => asset.prompt === selectedScene?.visualPrompt), [project.assets.visual, selectedScene]);

    const handleGenerateVisual = async () => {
        if (!selectedScene) return;
        
        const tempId = `vis_temp_${Date.now()}`;
        const newAssetStub: VisualAsset = {
            id: tempId, type: 'video', url: '', thumbnailUrl: '', prompt: selectedScene.visualPrompt, model: AIVideoModel.VEO_2_PRO, status: AssetStatus.QUEUED,
            generationProgress: 0, generationLogs: [], createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_ASSET', payload: { type: 'visual', asset: newAssetStub } });

        dispatch({ type: 'UPDATE_ASSET', payload: { assetId: tempId, updates: { status: AssetStatus.GENERATING } }});

        const finalAsset = await mockApi.generateVisualAsset(selectedScene.visualPrompt, AIVideoModel.VEO_2_PRO,
            (progress, log) => {
                dispatch({ type: 'UPDATE_ASSET', payload: { assetId: tempId, updates: { status: AssetStatus.GENERATING, generationProgress: progress, generationLogs: [...(project.assets.visual.find(a => a.id === tempId)?.generationLogs || []), log] } } });
            }
        );

        dispatch({ type: 'UPDATE_ASSET', payload: { assetId: tempId, updates: { ...finalAsset, id: tempId, status: AssetStatus.COMPLETED, generationProgress: 100 } } });
    };

    return (
        <div className="grid grid-cols-12 gap-6 h-full">
            <div className="col-span-3 bg-white rounded-lg shadow p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2">Scenes</h3>
                <ul>
                    {project.scenes.map(scene => (
                        <li key={scene.id} onClick={() => setSelectedSceneId(scene.id)} className={`p-3 rounded-md cursor-pointer ${selectedSceneId === scene.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                            <p className="font-semibold">Scene {scene.sceneNumber}</p>
                            <p className="text-sm text-gray-600 truncate">{scene.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-span-5 bg-white rounded-lg shadow p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">Dream Projector</h3>
                {selectedScene ? (
                    <div className="flex-grow flex flex-col">
                        <Textarea label="Visual Prompt" value={selectedScene.visualPrompt} readOnly rows={5} />
                        <div className="mt-4">
                             <label className="block text-sm font-medium text-gray-700">AI Model</label>
                             <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                {Object.values(AIVideoModel).map(m => <option key={m} value={m}>{m}</option>)}
                             </select>
                        </div>
                        <div className="mt-auto pt-4">
                            <Button onClick={handleGenerateVisual} className="w-full">Generate Visual</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">Select a scene to start generating visuals.</div>
                )}
            </div>
            <div className="col-span-4 bg-white rounded-lg shadow p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2">Generated Assets</h3>
                <div className="grid grid-cols-2 gap-4">
                    {sceneAssets.map(asset => <AssetCard key={asset.id} asset={asset} />)}
                </div>
            </div>
        </div>
    );
};

const AssetCard = ({ asset }: { asset: VisualAsset | AudioAsset }) => {
    const { addClipToTimeline } = useProject();
    const isVisual = 'thumbnailUrl' in asset;
    
    const handleAddToTimeline = () => {
        const trackMap = {
            'video': 'video',
            'image': 'video',
            'voiceover': 'voiceover',
            'music': 'music',
            'sfx': 'sfx',
        };
        addClipToTimeline({
            assetId: asset.id,
            assetType: isVisual ? 'visual' : 'audio',
            track: trackMap[asset.type] as any,
            startTime: 0,
            endTime: asset.duration,
            sourceStartTime: 0,
            sourceEndTime: asset.duration,
            volume: 100
        });
    };

    return (
        <div className="border rounded-lg overflow-hidden shadow-sm relative group">
            {isVisual ? 
                <img src={(asset as VisualAsset).thumbnailUrl || 'https://via.placeholder.com/320x180.png?text=...'} alt={asset.prompt} className="w-full h-auto" />
                : 
                <div className="h-24 bg-gray-200 flex items-center justify-center">
                    <p className="font-semibold text-gray-700">{asset.type}</p>
                </div>
            }
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex flex-col justify-between p-2">
                <div>
                    {asset.status === AssetStatus.COMPLETED && (
                        <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded w-min">Ready</div>
                    )}
                    {asset.status === AssetStatus.FAILED && (
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded w-min">Failed</div>
                    )}
                </div>
                <div>
                    {asset.status === AssetStatus.COMPLETED && (
                        <Button onClick={handleAddToTimeline} className="text-xs py-1 px-2 w-full opacity-0 group-hover:opacity-100 transition-opacity">Add to Timeline</Button>
                    )}
                </div>
            </div>
            {asset.status === AssetStatus.GENERATING && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-2">
                    <Spinner size="sm"/>
                    {'generationProgress' in asset && <p className="text-sm mt-2">{asset.generationProgress}%</p>}
                    {'generationLogs' in asset && <p className="text-xs text-center mt-1">{asset.generationLogs[asset.generationLogs.length - 1]}</p>}
                </div>
            )}
        </div>
    );
};

const AudioStudio = () => {
    const { project, dispatch } = useProject();
    const [text, setText] = useState('');
    const [voiceId, setVoiceId] = useState('en-US-Standard-C');
    const [musicPrompt, setMusicPrompt] = useState('');
    const [sfxPrompt, setSfxPrompt] = useState('');

    const generate = async (type: AudioAssetType, prompt: string, model: any) => {
        const tempId = `aud_temp_${Date.now()}`;
        const assetStub: AudioAsset = { id: tempId, type, url: '', prompt, model, status: AssetStatus.QUEUED, createdAt: new Date().toISOString(), duration: 0 };
        dispatch({ type: 'ADD_ASSET', payload: { type: 'audio', asset: assetStub } });
        dispatch({ type: 'UPDATE_ASSET', payload: { assetId: tempId, updates: { status: AssetStatus.GENERATING } } });
        const finalAsset = await mockApi.generateAudioAsset(type, prompt, model);
        dispatch({ type: 'UPDATE_ASSET', payload: { assetId: tempId, updates: { ...finalAsset, id: tempId, status: AssetStatus.COMPLETED } } });
    }

    return (
        <div className="grid grid-cols-2 gap-6 h-full">
            <div className="space-y-6">
                <Card>
                    <h3 className="text-lg font-semibold mb-2">Voiceover Generation</h3>
                    <Textarea label="Script Text" value={text} onChange={e => setText(e.target.value)} rows={4} />
                    <Button onClick={() => generate('voiceover', text, AIVoiceModel.ELEVEN_TURBO_V2)} className="mt-2">Generate Voiceover</Button>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold mb-2">Music Generation</h3>
                    <Input label="Music Prompt" placeholder="e.g., upbeat corporate techno" value={musicPrompt} onChange={e => setMusicPrompt(e.target.value)} />
                    <Button onClick={() => generate('music', musicPrompt, AIMusicModel.SUNO_V3_PRO)} className="mt-2">Generate Music</Button>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold mb-2">Sound Effect Generation</h3>
                    <Input label="SFX Prompt" placeholder="e.g., cinematic whoosh" value={sfxPrompt} onChange={e => setSfxPrompt(e.target.value)} />
                    <Button onClick={() => generate('sfx', sfxPrompt, AIMusicModel.STABLE_AUDIO_2)} className="mt-2">Generate SFX</Button>
                </Card>
            </div>
            <Card className="overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2">Audio Assets</h3>
                <div className="grid grid-cols-2 gap-4">
                    {project.assets.audio.map(asset => <AssetCard key={asset.id} asset={asset} />)}
                </div>
            </Card>
        </div>
    );
};

const TimelineEditor = () => {
    const { project, dispatch } = useProject();
    const [zoom, setZoom] = useState(10); // pixels per second

    const tracks = ['video', 'voiceover', 'music', 'sfx'];

    return (
        <div className="grid grid-cols-4 gap-6 h-full">
            <div className="col-span-3 flex flex-col h-full">
                <Card className="flex-grow flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Timeline</h3>
                        {/* Placeholder for preview window */}
                        <div className="w-48 h-24 bg-black text-white flex items-center justify-center">Preview</div>
                    </div>
                    <div className="flex-grow overflow-auto">
                        {tracks.map(trackName => (
                            <div key={trackName} className="flex items-center mb-1">
                                <div className="w-28 font-semibold text-sm capitalize pr-2 text-right">{trackName}</div>
                                <div className="flex-1 bg-gray-200 h-16 relative rounded">
                                    {project.timeline.clips
                                        .filter(c => c.track === trackName)
                                        .map(clip => (
                                            <div key={clip.id}
                                                 className="absolute bg-blue-400 border border-blue-600 rounded h-full"
                                                 style={{
                                                     left: `${clip.startTime * zoom}px`,
                                                     width: `${(clip.endTime - clip.startTime) * zoom}px`
                                                 }}>
                                                <span className="text-xs text-white p-1 truncate">{clip.assetId}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="col-span-1 h-full">
                <Card className="h-full flex flex-col overflow-hidden">
                    <h3 className="text-lg font-semibold mb-2">Media Bin</h3>
                    <div className="flex-grow overflow-y-auto space-y-2">
                        {[...project.assets.visual, ...project.assets.audio]
                            .filter(a => a.status === AssetStatus.COMPLETED)
                            .map(asset => (
                                <div key={asset.id} className="p-2 border rounded text-sm">{asset.id} ({asset.type})</div>
                            ))
                        }
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CampaignDeployment = () => {
    const { project, dispatch } = useProject();
    const [selectedPlatforms, setSelectedPlatforms] = useState<AdPlatform[]>([]);
    
    const handlePlatformToggle = (platform: AdPlatform) => {
        setSelectedPlatforms(prev => 
            prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
        );
    };

    const handleDeploy = async () => {
        const platformSettings = selectedPlatforms.map(p => ({
            platform: p,
            budget: project.campaignSettings.totalBudget / selectedPlatforms.length,
            bidStrategy: 'AUTO',
            adCopy: project.script,
            headline: project.campaignBrief.keyMessage,
            targetingParameters: { geo: project.campaignSettings.geoTargeting },
        }));
        dispatch({ type: 'UPDATE_CAMPAIGN_SETTINGS', payload: { platformSettings } });

        const deployments = await mockApi.deployCampaign(project.campaignSettings);
        dispatch({ type: 'INITIATE_DEPLOYMENT', payload: deployments });
    };

    return (
        <div className="grid grid-cols-2 gap-6 h-full">
            <Card>
                <h3 className="text-lg font-semibold mb-4">Deployment Configuration</h3>
                <div className="space-y-4">
                    <Input label="Campaign Name" value={project.campaignSettings.name} onChange={e => dispatch({ type: 'UPDATE_CAMPAIGN_SETTINGS', payload: { name: e.target.value } })} />
                    <Input label="Total Budget" type="number" value={project.campaignSettings.totalBudget} onChange={e => dispatch({ type: 'UPDATE_CAMPAIGN_SETTINGS', payload: { totalBudget: Number(e.target.value) } })} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Platforms</label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {Object.values(AdPlatform).map(p => (
                                <button key={p} onClick={() => handlePlatformToggle(p)} className={`p-2 border rounded ${selectedPlatforms.includes(p) ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <Button onClick={handleDeploy} disabled={selectedPlatforms.length === 0} className="w-full">Deploy Campaign</Button>
                </div>
            </Card>
            <Card className="overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Deployment Status</h3>
                <div className="space-y-4">
                    {project.deployments.length > 0 ? project.deployments.map(d => (
                        <div key={d.platform} className="p-3 border rounded">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{d.platform}</p>
                                <p className="text-sm px-2 py-1 bg-gray-200 rounded-full">{d.status}</p>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mt-2 text-sm text-center">
                                <div><p className="font-bold">{d.metrics.impressions}</p><p className="text-xs text-gray-500">Impressions</p></div>
                                <div><p className="font-bold">{d.metrics.clicks}</p><p className="text-xs text-gray-500">Clicks</p></div>
                                <div><p className="font-bold">{d.metrics.ctr}</p><p className="text-xs text-gray-500">CTR</p></div>
                                <div><p className="font-bold">${d.metrics.spend.toFixed(2)}</p><p className="text-xs text-gray-500">Spend</p></div>
                            </div>
                        </div>
                    )) : <p className="text-gray-500">No active deployments.</p>}
                </div>
            </Card>
        </div>
    );
};

// SECTION: Utility Functions
// ============================================================================

export const parseScriptToScenes = (script: string): Scene[] => {
    const lines = script.split('\n').filter(line => line.trim() !== '');
    const scenes: Scene[] = [];
    let sceneCounter = 1;
    let currentScene: Partial<Scene> = { sceneNumber: sceneCounter };

    for (const line of lines) {
        if (line.toLowerCase().startsWith('scene ') || line.match(/^\(\s*.*\s*\)$/)) { // A new scene directive
            if (currentScene.scriptText || currentScene.description) {
                scenes.push({
                    id: `scene_${Date.now()}_${scenes.length}`,
                    sceneNumber: currentScene.sceneNumber,
                    description: currentScene.description || "Visuals for this scene",
                    scriptText: (currentScene.scriptText || "").trim(),
                    visualPrompt: `cinematic shot of ${currentScene.description || "a relevant scene"}, 4k, high detail`,
                    durationEstimate: (currentScene.scriptText || "").split(' ').length / 2.5,
                });
            }
            sceneCounter++;
            currentScene = { sceneNumber: sceneCounter, description: line };
        } else {
            currentScene.scriptText = (currentScene.scriptText || "") + line + "\n";
        }
    }
    
    if (currentScene.scriptText || currentScene.description) {
        scenes.push({
            id: `scene_${Date.now()}_${scenes.length}`,
            sceneNumber: currentScene.sceneNumber,
            description: currentScene.description || "Visuals for the final scene",
            scriptText: (currentScene.scriptText || "").trim(),
            visualPrompt: `cinematic shot of ${currentScene.description || "a concluding scene"}, 4k, high detail, product shot`,
            durationEstimate: (currentScene.scriptText || "").split(' ').length / 2.5,
        });
    }
    return scenes;
};

// SECTION: Main View Component
// ============================================================================

export const AIAdStudioView: React.FC = () => {
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [project, dispatch] = useReducer(projectReducer, null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentProjectId) {
            dispatch({ type: 'LOAD_PROJECT', payload: null });
            return;
        }

        setIsLoading(true);
        setError(null);
        mockApi.fetchProjectById(currentProjectId)
            .then(data => dispatch({ type: 'LOAD_PROJECT', payload: data }))
            .catch(err => {
                console.error("Failed to load project:", err);
                setError("Could not load the selected project.");
            })
            .finally(() => setIsLoading(false));

    }, [currentProjectId]);

    const addClipToTimeline = useCallback((clipData: Omit<TimelineClip, 'id'>) => {
        dispatch({
            type: 'ADD_CLIP_TO_TIMELINE',
            payload: { ...clipData, id: `clip_${Date.now()}` }
        });
        alert(`Asset ${clipData.assetId} added to timeline.`);
    }, []);

    const projectContextValue: ProjectContextType = useMemo(() => ({
        project, dispatch, isLoading, error, addClipToTimeline
    }), [project, isLoading, error, addClipToTimeline]);

    return (
        <ProjectContext.Provider value={projectContextValue}>
            <div className="h-screen w-screen bg-gray-200 flex font-sans antialiased text-gray-900">
                <ProjectManager onSelectProject={setCurrentProjectId} />
                <main className="flex-grow flex flex-col">
                    {isLoading ? (
                        <div className="flex-grow flex items-center justify-center bg-gray-100">
                            <div className="text-center"><Spinner size="lg" /><p className="mt-4 text-gray-600">Loading Project...</p></div>
                        </div>
                    ) : error ? (
                         <div className="flex-grow flex items-center justify-center bg-red-50"><p className="text-red-600">{error}</p></div>
                    ) : (
                        <StudioWorkspace />
                    )}
                </main>
            </div>
        </ProjectContext.Provider>
    );
};

export default AIAdStudioView;
```