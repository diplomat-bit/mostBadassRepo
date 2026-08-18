// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankTeamsView.tsx
================================================================================

import React, { useState, useEffect, createContext, useContext, useMemo, useCallback, useRef } from 'react';
import {
    Users, MessageSquare, Hash, Video, Phone, Mic, MicOff, VideoOff, Settings, AtSign, Plus, ChevronDown, ChevronRight,
    Search, Bell, ThumbsUp, Smile, Paperclip, Send, Bot, Star, Pin, X, Zap, BrainCircuit, FileText, Github, Share2, MoreVertical, LogOut, User as UserIcon, Palette, Moon
} from 'lucide-react';
import Card from '../../Card';

// --- TYPE DEFINITIONS ---
// Comprehensive types for a commercial-grade application

interface User {
    id: string;
    name: string;
    avatarUrl: string;
    isOnline: boolean;
    title: string;
    status?: string;
}

interface Reaction {
    emoji: string;
    count: number;
    users: string[]; // user IDs
}

interface Message {
    id: string;
    authorId: string;
    channelId: string;
    timestamp: Date;
    content: string;
    reactions: Reaction[];
    isPinned?: boolean;
    threadId?: string;
    attachment?: {
        type: 'file' | 'image' | 'integration';
        url?: string;
        fileName?: string;
        integrationData?: IntegrationData;
    };
}

interface IntegrationData {
    provider: 'GitHub' | 'Jira' | 'Figma';
    type: 'PR' | 'Issue' | 'Commit' | 'Ticket' | 'DesignUpdate';
    title: string;
    status: string;
    url: string;
    meta: Record<string, any>;
}

interface Channel {
    id: string;
    name: string;
    type: 'text' | 'voice';
    topic?: string;
    unreadCount: number;
    isMuted?: boolean;
}

interface Team {
    id:string;
    name: string;
    iconUrl: string;
    channels: Channel[];
}

interface TeamsContextType {
    teams: Team[];
    users: User[];
    currentUser: User;
    activeTeam: Team | null;
    activeChannel: Channel | null;
    messages: Message[];
    setActiveTeam: (team: Team) => void;
    setActiveChannel: (channel: Channel) => void;
    sendMessage: (content: string, channelId: string) => void;
    addReaction: (messageId: string, emoji: string) => void;
    togglePin: (messageId: string) => void;
    isLoading: boolean;
    isDetailsPaneOpen: boolean;
    toggleDetailsPane: () => void;
}

// --- MOCK DATA ---
// Simulating a real-world data source for a large corporation

const mockUsers: User[] = [
    { id: 'u1', name: 'Alex Chen', avatarUrl: 'https://i.pravatar.cc/150?u=alex', isOnline: true, title: 'Lead Engineer' },
    { id: 'u2', name: 'Brenda Rodriguez', avatarUrl: 'https://i.pravatar.cc/150?u=brenda', isOnline: true, title: 'Product Manager' },
    { id: 'u3', name: 'The Visionary', avatarUrl: 'https://i.pravatar.cc/150?u=visionary', isOnline: true, title: 'CEO', status: 'In a meeting' },
    { id: 'u4', name: 'Fiona Kim', avatarUrl: 'https://i.pravatar.cc/150?u=fiona', isOnline: false, title: 'UX Designer' },
    { id: 'u5', name: 'David Lee', avatarUrl: 'https://i.pravatar.cc/150?u=david', isOnline: true, title: 'DevOps Engineer', status: 'Deploying to prod' },
    { id: 'u6', name: 'Samantha Wu', avatarUrl: 'https://i.pravatar.cc/150?u=samantha', isOnline: true, title: 'Marketing Lead' },
    { id: 'ai-bot', name: 'QuantumSage AI', avatarUrl: 'https://i.pravatar.cc/150?u=aibot', isOnline: true, title: 'AI Assistant' }
];

const currentUser = mockUsers[0];

const generateMessages = (channelId: string): Message[] => {
    return [
        { id: `m1-${channelId}`, authorId: 'u1', channelId, timestamp: new Date(Date.now() - 3600000 * 2), content: 'Hey team, the latest deployment for the API gateway is complete. Let me know if you see any issues.', reactions: [{ emoji: '👍', count: 2, users: ['u2', 'u5']}]},
        { id: `m2-${channelId}`, authorId: 'u2', channelId, timestamp: new Date(Date.now() - 3600000 * 1.9), content: 'Looks good on my end! Great work.', reactions: [{ emoji: '🎉', count: 1, users: ['u1']}]},
        { id: `m3-${channelId}`, authorId: 'u3', channelId, timestamp: new Date(Date.now() - 3600000 * 1.8), content: 'Excellent progress. How is the Q3 roadmap looking?', reactions: [], isPinned: true },
        { id: `m4-${channelId}`, authorId: 'u2', channelId, timestamp: new Date(Date.now() - 3600000 * 1.7), content: 'On track. I will be sharing the updated product specs later today.', reactions: []},
        { id: `m5-${channelId}`, authorId: 'u5', channelId, timestamp: new Date(Date.now() - 3600000 * 1.5), content: 'CI/CD pipeline ran successfully. All green.', reactions: [{ emoji: '✅', count: 3, users: ['u1', 'u2', 'u3']}]},
        { id: `m6-${channelId}`, authorId: 'u4', channelId, timestamp: new Date(Date.now() - 3600000 * 1.2), content: 'Here are the latest mockups from Figma.', reactions: [], attachment: {
            type: 'integration',
            integrationData: {
                provider: 'Figma',
                type: 'DesignUpdate',
                title: 'New Dashboard Layout v3',
                status: 'Ready for Review',
                url: '#',
                meta: { comments: 5, author: 'Fiona Kim' }
            }
        }},
        { id: `m7-${channelId}`, authorId: 'u1', channelId, timestamp: new Date(Date.now() - 3600000 * 1), content: 'Looks fantastic, Fiona! I\'ve created a ticket for implementation.', reactions: [], attachment: {
            type: 'integration',
            integrationData: {
                provider: 'Jira',
                type: 'Ticket',
                title: 'PROJ-123: Implement New Dashboard UI',
                status: 'To Do',
                url: '#',
                meta: { assignee: 'Alex Chen', storyPoints: 8 }
            }
        }},
        { id: `m8-${channelId}`, authorId: 'ai-bot', channelId, timestamp: new Date(Date.now() - 3600000 * 0.5), content: 'Just a reminder, our weekly sync is tomorrow at 10 AM PST.', reactions: []},
        { id: `m9-${channelId}`, authorId: 'u5', channelId, timestamp: new Date(Date.now() - 3600000 * 0.2), content: 'Pull request for the new auth module is up for review.', reactions: [{ emoji: '👀', count: 1, users: ['u1']}], attachment: {
            type: 'integration',
            integrationData: {
                provider: 'GitHub',
                type: 'PR',
                title: '#42: Feature/QuantumAuth Integration',
                status: 'Open',
                url: '#',
                meta: { reviews: '1 approved', branch: 'feature/quantum-auth' }
            }
        }},
    ];
};

const mockTeams: Team[] = [
    {
        id: 't1',
        name: 'Core Platform',
        iconUrl: '/icons/platform.svg',
        channels: [
            { id: 'c1', name: 'general', type: 'text', topic: 'General announcements and team chat', unreadCount: 2 },
            { id: 'c2', name: 'api-gateway', type: 'text', topic: 'Discussion about the main API gateway', unreadCount: 0 },
            { id: 'c3', name: 'frontend-dev', type: 'text', topic: 'All things React and UI', unreadCount: 5 },
            { id: 'c4', name: 'backend-dev', type: 'text', topic: 'Go, Rust, and database talk', unreadCount: 0, isMuted: true },
            { id: 'c5', name: 'release-planning', type: 'text', topic: 'Coordinating upcoming releases', unreadCount: 1 },
            { id: 'c6', name: 'Team Sync', type: 'voice', topic: 'Weekly team sync meeting room', unreadCount: 0 },
        ]
    },
    {
        id: 't2',
        name: 'AI/ML R&D',
        iconUrl: '/icons/ai.svg',
        channels: [
            { id: 'c7', name: 'research', type: 'text', topic: 'Sharing papers and new findings', unreadCount: 12 },
            { id: 'c8', name: 'model-training', type: 'text', topic: 'Updates on training runs and infra', unreadCount: 3 },
            { id: 'c9', name: 'QuantumSage', type: 'text', topic: 'Development of our in-house AI', unreadCount: 0 },
            { id: 'c10', name: 'AI Standup', type: 'voice', topic: 'Daily standup call', unreadCount: 0 },
        ]
    },
    {
        id: 't3',
        name: 'Marketing',
        iconUrl: '/icons/marketing.svg',
        channels: [
            { id: 'c11', name: 'campaign-q3', type: 'text', topic: 'Planning for Q3 marketing campaigns', unreadCount: 0 },
            { id: 'c12', name: 'social-media', type: 'text', topic: 'Content calendar and strategy', unreadCount: 8 },
        ]
    },
];

// --- AI SERVICE HOOK ---
// Mocking interactions with a powerful AI model like Gemini or ChatGPT

const useAIServices = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    const simulateAICall = <T,>(result: T, delay = 1500): Promise<T> => {
        return new Promise(resolve => {
            setIsGenerating(true);
            setTimeout(() => {
                setIsGenerating(false);
                resolve(result);
            }, delay);
        });
    };

    const summarizeChannel = useCallback(async (messages: Message[], users: User[]): Promise<string> => {
        const userMap = new Map(users.map(u => [u.id, u.name]));
        const conversationText = messages.map(m => `${userMap.get(m.authorId) || 'Unknown'}: ${m.content}`).join('\n');
        // In a real app, this would be an API call to a summarization model.
        return simulateAICall(`**Key Discussion Points:**
- **API Gateway Deployment:** Alex Chen confirmed a successful deployment. No immediate issues were reported.
- **Q3 Roadmap:** The Visionary inquired about the Q3 roadmap. Brenda Rodriguez confirmed it's on track, with product specs to be shared soon.
- **New Dashboard UI:** Fiona Kim shared new Figma mockups, which were well-received. Alex Chen created Jira ticket PROJ-123 for implementation.
- **QuantumAuth Module:** David Lee submitted a pull request (#42) for a new authentication module, which is now under review.
- **Upcoming Meeting:** A weekly sync is scheduled for tomorrow at 10 AM PST.`);
    }, []);

    const draftReply = useCallback(async (context: string, tone: 'professional' | 'casual' | 'urgent'): Promise<string> => {
        // In a real app, this sends context and tone to a generative AI.
        let draft = '';
        if (tone === 'professional') {
            draft = 'Thank you for the update. I have reviewed the pull request and left some comments for your consideration. Overall, the changes look solid.';
        } else if (tone === 'casual') {
            draft = 'Hey, took a look at the PR. Left a few nits, but it looks great! Ready to merge when you are.';
        } else {
            draft = 'This is a critical update. Please review my comments on the pull request immediately so we can get this merged and deployed before the deadline.';
        }
        return simulateAICall(draft);
    }, []);

    const findActionItems = useCallback(async (messages: Message[]): Promise<string[]> => {
        return simulateAICall([
            "Share updated product specs for Q3 (Owner: Brenda Rodriguez)",
            "Implement new dashboard UI from Figma mockups (Owner: Alex Chen, Ticket: PROJ-123)",
            "Review and merge PR #42 for QuantumAuth (Owner: David Lee)",
            "Prepare for weekly sync tomorrow at 10 AM PST (Owner: All)",
        ], 2000);
    }, []);

    return { isGenerating, summarizeChannel, draftReply, findActionItems };
};

// --- REACT CONTEXT ---
// Centralized state management for the Teams application

const TeamsContext = createContext<TeamsContextType | null>(null);

const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [teams, setTeams] = useState<Team[]>(mockTeams);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [activeTeam, setActiveTeamState] = useState<Team | null>(mockTeams[0]);
    const [activeChannel, setActiveChannelState] = useState<Channel | null>(mockTeams[0].channels[0]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailsPaneOpen, setIsDetailsPaneOpen] = useState(true);

    useEffect(() => {
        if (activeChannel) {
            setIsLoading(true);
            setTimeout(() => { // Simulate API fetch
                setMessages(generateMessages(activeChannel.id));
                setIsLoading(false);
            }, 500);
        }
    }, [activeChannel]);
    
    const setActiveTeam = (team: Team) => {
        setActiveTeamState(team);
        // Automatically switch to the first channel of the new team
        setActiveChannelState(team.channels[0]);
    };
    
    const setActiveChannel = (channel: Channel) => {
        setActiveChannelState(channel);
    };

    const sendMessage = (content: string, channelId: string) => {
        const newMessage: Message = {
            id: `m${Date.now()}`,
            authorId: currentUser.id,
            channelId,
            timestamp: new Date(),
            content,
            reactions: [],
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const addReaction = (messageId: string, emoji: string) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                const reaction = msg.reactions.find(r => r.emoji === emoji);
                if (reaction) {
                    if (reaction.users.includes(currentUser.id)) { // Un-react
                        return { ...msg, reactions: msg.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== currentUser.id) } : r).filter(r => r.count > 0) };
                    } else { // Add reaction
                        return { ...msg, reactions: msg.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, currentUser.id] } : r) };
                    }
                } else { // New reaction
                    return { ...msg, reactions: [...msg.reactions, { emoji, count: 1, users: [currentUser.id] }] };
                }
            }
            return msg;
        }));
    };

    const togglePin = (messageId: string) => {
        setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg));
    };
    
    const toggleDetailsPane = () => setIsDetailsPaneOpen(prev => !prev);

    const value = useMemo(() => ({
        teams, users, currentUser, activeTeam, activeChannel, messages,
        setActiveTeam, setActiveChannel, sendMessage, addReaction, togglePin, isLoading,
        isDetailsPaneOpen, toggleDetailsPane
    }), [teams, users, currentUser, activeTeam, activeChannel, messages, isLoading, isDetailsPaneOpen]);

    return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
};

const useTeams = () => {
    const context = useContext(TeamsContext);
    if (!context) {
        throw new Error('useTeams must be used within a TeamsProvider');
    }
    return context;
};


// --- UI SUB-COMPONENTS ---
// Breaking down the complex UI into manageable, reusable components

const UserAvatar: React.FC<{ userId: string; size?: 'sm' | 'md' | 'lg' }> = ({ userId, size = 'md' }) => {
    const { users } = useTeams();
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16'
    };

    return (
        <div className="relative">
            <img src={user.avatarUrl} alt={user.name} className={`rounded-full ${sizeClasses[size]}`} />
            {user.isOnline && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-gray-800"></span>}
        </div>
    );
};

const TeamsSidebar: React.FC = () => {
    const { teams, activeTeam, setActiveTeam } = useTeams();

    return (
        <div className="w-20 bg-gray-900/80 backdrop-blur-sm p-3 flex flex-col items-center space-y-4 border-r border-gray-700/50">
            {teams.map(team => (
                <button
                    key={team.id}
                    onClick={() => setActiveTeam(team)}
                    className={`h-14 w-14 rounded-2xl bg-gray-700 flex items-center justify-center transition-all duration-200 transform hover:rounded-xl hover:bg-cyan-500 ${activeTeam?.id === team.id ? 'rounded-xl bg-cyan-600 scale-105' : ''}`}
                    aria-label={team.name}
                    title={team.name}
                >
                    {/* Placeholder for team icon */}
                    <span className="text-white font-bold text-xl">{team.name.charAt(0)}</span>
                </button>
            ))}
            <button className="h-14 w-14 rounded-full border-2 border-dashed border-gray-500 text-gray-400 hover:bg-gray-700 hover:text-white transition-all">
                <Plus size={24} className="mx-auto" />
            </button>
        </div>
    );
};

const ChannelList: React.FC = () => {
    const { activeTeam, activeChannel, setActiveChannel, currentUser } = useTeams();
    const [openCategories, setOpenCategories] = useState({ text: true, voice: true });

    if (!activeTeam) return null;

    const toggleCategory = (category: 'text' | 'voice') => {
        setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const renderChannel = (channel: Channel) => (
        <button
            key={channel.id}
            onClick={() => setActiveChannel(channel)}
            className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between group ${activeChannel?.id === channel.id ? 'bg-cyan-500/20 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'}`}
        >
            <div className="flex items-center space-x-2">
                {channel.type === 'text' ? <Hash size={18} /> : <Mic size={18} />}
                <span>{channel.name}</span>
            </div>
            {channel.unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{channel.unreadCount}</span>}
        </button>
    );

    return (
        <div className="w-64 bg-gray-800/70 p-3 flex flex-col border-r border-gray-700/50">
            <div className="mb-4">
                <h1 className="text-xl font-bold text-white">{activeTeam.name}</h1>
                <p className="text-sm text-gray-400">Powered by Demo Bank</p>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-4">
                <div>
                    <button onClick={() => toggleCategory('text')} className="flex items-center w-full text-gray-400 hover:text-white mb-2">
                        {openCategories.text ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span className="ml-1 text-sm font-semibold uppercase">Text Channels</span>
                    </button>
                    {openCategories.text && <div className="space-y-1">
                        {activeTeam.channels.filter(c => c.type === 'text').map(renderChannel)}
                    </div>}
                </div>
                 <div>
                    <button onClick={() => toggleCategory('voice')} className="flex items-center w-full text-gray-400 hover:text-white mb-2">
                        {openCategories.voice ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span className="ml-1 text-sm font-semibold uppercase">Voice Channels</span>
                    </button>
                    {openCategories.voice && <div className="space-y-1">
                        {activeTeam.channels.filter(c => c.type === 'voice').map(renderChannel)}
                    </div>}
                </div>
            </div>

            <div className="mt-auto p-2 bg-gray-900/50 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <UserAvatar userId={currentUser.id} size="sm" />
                    <div>
                         <p className="text-white font-semibold text-sm">{currentUser.name}</p>
                         <p className="text-gray-400 text-xs">{currentUser.status || (currentUser.isOnline ? 'Online' : 'Offline')}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                    <button className="p-1 hover:bg-gray-700 rounded"><Mic size={16}/></button>
                    <button className="p-1 hover:bg-gray-700 rounded"><Settings size={16}/></button>
                </div>
            </div>
        </div>
    );
};

const MessageComponent: React.FC<{ message: Message }> = ({ message }) => {
    const { users, currentUser, addReaction, togglePin } = useTeams();
    const author = users.find(u => u.id === message.authorId);
    const isBot = author?.id === 'ai-bot';
    
    const IntegrationCard: React.FC<{ data: IntegrationData }> = ({ data }) => {
        const icons = { GitHub: <Github size={20} />, Jira: <Zap size={20} />, Figma: <Palette size={20} /> };
        const colors = { GitHub: 'bg-gray-700', Jira: 'bg-blue-900/50', Figma: 'bg-purple-900/50' };

        return (
            <div className={`mt-2 p-3 rounded-lg border border-gray-600 ${colors[data.provider]} max-w-md`}>
                <div className="flex items-center space-x-2 text-gray-300">
                    {icons[data.provider]}
                    <span className="font-bold">{data.provider}</span>
                    <span className="text-xs text-gray-400">{data.type}</span>
                </div>
                <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline my-1 block">{data.title}</a>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>Status: <span className="font-semibold text-gray-200">{data.status}</span></span>
                    {Object.entries(data.meta).map(([key, value]) => (
                        <span key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: <span className="font-semibold text-gray-200">{value}</span></span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex items-start space-x-4 p-3 hover:bg-gray-800/40 rounded-lg group relative">
            <UserAvatar userId={message.authorId} />
            <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                    <span className={`font-semibold ${isBot ? 'text-purple-400' : 'text-white'}`}>{author?.name || 'Unknown User'}</span>
                     {isBot && <span className="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-md">BOT</span>}
                    <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-gray-300 prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: message.content.replace(/@\w+/g, '<span class="text-cyan-400 bg-cyan-900/50 px-1 rounded">$&</span>') }}></div>
                {message.attachment && message.attachment.type === 'integration' && message.attachment.integrationData && (
                    <IntegrationCard data={message.attachment.integrationData} />
                )}
                {message.reactions.length > 0 && (
                    <div className="flex space-x-2 mt-2">
                        {message.reactions.map(r => (
                            <button key={r.emoji} onClick={() => addReaction(message.id, r.emoji)} className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${r.users.includes(currentUser.id) ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-300' : 'bg-gray-700/80 border border-gray-600 text-gray-300 hover:border-gray-500'}`}>
                                <span>{r.emoji}</span>
                                <span>{r.count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="absolute top-2 right-4 bg-gray-700 border border-gray-600 rounded-md shadow-lg flex opacity-0 group-hover:opacity-100 transition-opacity">
                <button title="Add Reaction" className="p-1.5 text-gray-400 hover:bg-gray-600 rounded-l-md"><Smile size={16} /></button>
                <button title={message.isPinned ? 'Unpin Message' : 'Pin Message'} onClick={() => togglePin(message.id)} className={`p-1.5 text-gray-400 hover:bg-gray-600 ${message.isPinned ? 'text-yellow-400' : ''}`}><Pin size={16} /></button>
                <button title="More" className="p-1.5 text-gray-400 hover:bg-gray-600 rounded-r-md"><MoreVertical size={16} /></button>
            </div>
        </div>
    );
};


const MessageInput: React.FC<{ channel: Channel }> = ({ channel }) => {
    const { sendMessage } = useTeams();
    const [text, setText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        if (text.trim()) {
            sendMessage(text, channel.id);
            setText('');
            inputRef.current?.focus();
        }
    };
    
    return (
        <div className="p-4 border-t border-gray-700/50 bg-gray-800">
            <div className="bg-gray-700/50 rounded-lg flex items-center px-4">
                <button className="p-2 text-gray-400 hover:text-white"><Paperclip size={20}/></button>
                <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder={`Message #${channel.name}`}
                    className="flex-grow bg-transparent p-3 text-white placeholder-gray-500 focus:outline-none"
                />
                <button className="p-2 text-gray-400 hover:text-yellow-400" title="AI Assistant"><Zap size={20}/></button>
                <button className="p-2 text-gray-400 hover:text-white"><Smile size={20}/></button>
                <button onClick={handleSend} className="p-2 text-cyan-400 hover:text-cyan-300 disabled:text-gray-600" disabled={!text.trim()}><Send size={20}/></button>
            </div>
        </div>
    );
};

const ChannelHeader: React.FC = () => {
    const { activeChannel, users, toggleDetailsPane, isDetailsPaneOpen } = useTeams();
    if (!activeChannel) return null;

    return (
        <div className="h-16 flex-shrink-0 px-4 flex items-center justify-between border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center">
                    {activeChannel.type === 'text' ? <Hash size={24} className="text-gray-500 mr-2" /> : <Mic size={24} className="text-gray-500 mr-2" />}
                    {activeChannel.name}
                </h2>
                <p className="text-sm text-gray-400 truncate max-w-md">{activeChannel.topic}</p>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
                <button className="hover:text-white"><Phone size={20}/></button>
                <button className="hover:text-white"><Video size={20}/></button>
                <div className="h-6 w-px bg-gray-600"></div>
                <button onClick={toggleDetailsPane} className={`hover:text-white ${isDetailsPaneOpen ? 'text-cyan-400' : ''}`}>
                    <Users size={20} />
                </button>
                <div className="relative">
                    <input type="text" placeholder="Search" className="w-48 bg-gray-700/50 rounded-md pl-8 pr-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
            </div>
        </div>
    );
};

const RightDetailsPane: React.FC = () => {
    const { activeChannel, messages, users, isGenerating, summarizeChannel, findActionItems } = useTeams();
    const [activeTab, setActiveTab] = useState('summary');
    const [summary, setSummary] = useState('');
    const [actionItems, setActionItems] = useState<string[]>([]);
    
    const pinnedMessages = messages.filter(m => m.isPinned);

    const handleSummarize = async () => {
        setSummary('');
        const result = await summarizeChannel(messages, users);
        setSummary(result);
    };

    const handleFindActions = async () => {
        setActionItems([]);
        const result = await findActionItems(messages);
        setActionItems(result);
    };

    if (!activeChannel) return null;

    return (
        <div className="w-80 bg-gray-800/70 border-l border-gray-700/50 p-4 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Channel Details</h3>
            <div className="border-b border-gray-600 mb-4">
                <nav className="flex space-x-4 -mb-px">
                    <button onClick={() => setActiveTab('summary')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'summary' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>AI Summary</button>
                    <button onClick={() => setActiveTab('pins')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'pins' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>Pins</button>
                    <button onClick={() => setActiveTab('members')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'members' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>Members</button>
                </nav>
            </div>
            
            <div className="flex-grow overflow-y-auto">
                {activeTab === 'summary' && (
                    <div className="space-y-4">
                        <div>
                            <button onClick={handleSummarize} disabled={isGenerating} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:bg-gray-600">
                                <BrainCircuit size={18} /><span>Generate Summary</span>
                            </button>
                            {summary && <div className="mt-4 p-3 bg-gray-900/50 rounded-lg text-sm text-gray-300 prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>') }}></div>}
                        </div>
                        <div>
                            <button onClick={handleFindActions} disabled={isGenerating} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:bg-gray-600">
                                <FileText size={18} /><span>Find Action Items</span>
                            </button>
                            {actionItems.length > 0 && <div className="mt-4 p-3 bg-gray-900/50 rounded-lg text-sm text-gray-300">
                                <ul className="list-disc list-inside space-y-2">
                                    {actionItems.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </div>}
                        </div>
                        {isGenerating && <div className="flex items-center justify-center text-gray-400 mt-4"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400"></div><span className="ml-2">AI is thinking...</span></div>}
                    </div>
                )}
                {activeTab === 'pins' && (
                    <div className="space-y-3">
                        {pinnedMessages.length > 0 ? pinnedMessages.map(msg => {
                            const author = users.find(u => u.id === msg.authorId);
                            return <div key={msg.id} className="p-2 bg-gray-700/50 rounded-lg text-sm">
                                <div className="flex items-center space-x-2 mb-1">
                                    <img src={author?.avatarUrl} className="h-5 w-5 rounded-full" alt={author?.name}/>
                                    <span className="font-semibold text-white">{author?.name}</span>
                                </div>
                                <p className="text-gray-300">{msg.content}</p>
                            </div>
                        }) : <p className="text-gray-500 text-center text-sm">No pinned messages yet.</p>}
                    </div>
                )}
                {activeTab === 'members' && (
                     <div className="space-y-3">
                        {users.map(user => (
                            <div key={user.id} className="flex items-center space-x-3 p-1.5 rounded-md hover:bg-gray-700/50">
                                <UserAvatar userId={user.id} size="sm" />
                                <div>
                                    <p className="text-white font-medium text-sm">{user.name}</p>
                                    <p className="text-gray-400 text-xs">{user.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ChannelView: React.FC = () => {
    const { activeChannel, messages, isLoading } = useTeams();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!activeChannel) {
        return <div className="flex-1 flex items-center justify-center text-gray-500">Select a channel to start chatting.</div>;
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-800/80">
            <ChannelHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    </div>
                ) : (
                    <>
                        {messages.map(msg => <MessageComponent key={msg.id} message={msg} />)}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
            <MessageInput channel={activeChannel} />
        </div>
    );
};


// --- MAIN COMPONENT ---
// Assembling the full-featured Teams view

const DemoBankTeamsView: React.FC = () => {
    return (
        <div className="h-full w-full bg-gray-900 text-white rounded-lg shadow-2xl overflow-hidden">
            <TeamsProvider>
                <div className="flex h-full">
                    <TeamsSidebar />
                    <ChannelList />
                    <main className="flex-1 flex">
                        <ChannelView />
                        <TeamsContext.Consumer>
                            {({ isDetailsPaneOpen }) => isDetailsPaneOpen && <RightDetailsPane />}
                        </TeamsContext.Consumer>
                    </main>
                </div>
            </TeamsProvider>
        </div>
    );
};

export default DemoBankTeamsView;
