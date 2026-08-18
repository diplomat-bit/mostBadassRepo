// REPOSITORY SOURCE: diplomat-bit/ai-news | PATH: diplomat-bit-ai-news-cd09a75/components/Sidebar.tsx
================================================================================


import React from 'react';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onSelectCategory, categories }) => {
  return (
    <aside className="w-64 border-r border-white/5 flex flex-col h-screen fixed top-0 left-0 bg-[#050505] z-10 overflow-y-auto">
      <div className="p-8 border-b border-white/5">
        <h1 className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          NEWS NEXUS
        </h1>
        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest mono font-medium">Autonomous Intelligence</p>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-1">
        <div className="px-4 mb-4 text-[10px] font-bold text-white/20 uppercase tracking-widest mono">Primary Feeds</div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
              activeCategory === cat 
                ? 'bg-cyan-500/10 text-cyan-400 font-medium' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>{cat}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${activeCategory === cat ? 'bg-cyan-400' : 'bg-transparent group-hover:bg-white/20'} transition-all`}></div>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mono mb-2">System Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-white/50">Core:</span>
              <span className="text-emerald-400 mono">ACTIVE</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-white/50">Acquisition:</span>
              <span className="text-emerald-400 mono">NOMINAL</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-white/50">Curation:</span>
              <span className="text-cyan-400 mono">AI-GATED</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-demai-jocalll3 | ORIGINAL PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/Sidebar.tsx
================================================================================

import React from 'react';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const DemoBankLogo: React.FC<{className?: string}> = ({className}) => (
     <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4"/>
        <path d="M30 70V30H55C65 30 65 40 55 40H30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M55 70V30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
    
    const handleNavClick = (view: View) => {
        setActiveView(view);
        setIsOpen(false); // Close sidebar on navigation
    };

    return (
        <>
            {/* Overlay */}
             <div 
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
             ></div>

            {/* Sidebar */}
            <div className={`flex flex-col w-64 bg-gray-900/50 backdrop-blur-lg border-r border-gray-700/50 fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between h-20 border-b border-gray-700/50 px-6">
                    <div className="flex items-center space-x-2 text-cyan-400">
                       <DemoBankLogo className="h-10 w-10" />
                       <span className="font-bold text-lg text-white">Demo Bank</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 space-y-2">
                        {NAV_ITEMS.map((item) => (
                             <a
                                key={item.id}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(item.id);
                                }}
                                className={`flex items-center px-4 py-2 text-gray-300 transition-colors duration-200 transform rounded-md hover:bg-gray-700/50 hover:text-white ${
                                    activeView === item.id ? 'bg-cyan-500/20 text-cyan-300 border-l-4 border-cyan-400' : ''
                                }`}
                            >
                                {item.icon}
                                <span className="mx-4 font-medium">{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/Sidebar.tsx
================================================================================


import React, { useContext } from 'react';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';
import { DataContext } from '../context/DataContext';
import { Crown, Sparkles, Terminal } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const InfiniteIntelligenceLogo: React.FC<{className?: string}> = ({className}) => (
     <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20,50 C20,20 80,20 80,50 C80,80 20,80 20,50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M20,50 C20,80 80,80 80,50 C80,20 20,20 20,50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
        <circle cx="50" cy="50" r="10" fill="currentColor" className="animate-pulse" />
    </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { activeView, setActiveView } = context;
    
    const handleNavClick = (view: View) => {
        setActiveView(view);
        setIsOpen(false);
    };

    return (
        <>
             <div 
                className={`fixed inset-0 bg-black/80 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
             ></div>

            <div className={`flex flex-col w-72 bg-black border-r border-gray-800 fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-800">
                    <div className="flex items-center">
                        <InfiniteIntelligenceLogo className="h-10 w-10 text-indigo-500" />
                        <div className="ml-3">
                            <span className="text-lg font-black text-white tracking-tighter uppercase italic">Nexus OS</span>
                            <div className="flex items-center gap-1">
                                <Terminal size={10} className="text-emerald-500" />
                                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest leading-none">Kernel: v5.2.7-LTS</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
                    {NAV_ITEMS.map((group, index) => (
                        <div key={index} className="space-y-2">
                            <h3 className="px-3 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                {group.group}
                                <div className="h-px bg-gray-800 flex-1"></div>
                            </h3>
                            <div className="space-y-1">
                                {group.items.map(item => {
                                    const isActive = activeView === item.view;
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.view}
                                            onClick={() => handleNavClick(item.view)}
                                            className={`flex items-center w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 group ${
                                                isActive
                                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                                    : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800/50'
                                            }`}
                                        >
                                            {Icon && <Icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-indigo-400'}`} />}
                                            <span className="flex-1">{item.title}</span>
                                            {isActive && <Sparkles size={12} className="text-indigo-300 animate-pulse" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-900 bg-gray-950/50 mt-auto">
                    <div className="flex items-center gap-3 p-3 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl">
                        <Crown className="text-indigo-400" size={16} />
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">The Caretaker</p>
                            <p className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest">Sovereign Admin</p>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/Sidebar.tsx
================================================================================

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';
import { DataContext } from '../context/DataContext';
import { Crown, Sparkles, Terminal, Building2 } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

// Logo Component
const InfiniteIntelligenceLogo: React.FC<{className?: string}> = ({className}) => (
     <svg className={className} viewBox="0 0 100 100" fill="none">
        <path d="M20,50 C20,20 80,20 80,50 C80,80 20,80 20,50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M20,50 C20,80 80,80 80,50 C80,20 20,20 20,50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
        <circle cx="50" cy="50" r="10" fill="currentColor" className="animate-pulse" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const context = useContext(DataContext);
    const navigate = useNavigate();

    if (!context) return null;
    const { activeView, setActiveView } = context;
    
    const handleNavClick = (view: View) => {
        setActiveView(view);
        setIsOpen(false);
    };

    return (
        <>
             {/* Mobile Overlay */}
             <div 
                className={`fixed inset-0 bg-black/80 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
             ></div>

            {/* Sidebar Container */}
            <div className={`flex flex-col w-72 bg-black border-r border-gray-800 fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                
                {/* Header */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-800">
                    <div className="flex items-center">
                        <InfiniteIntelligenceLogo className="h-10 w-10 text-indigo-500" />
                        <div className="ml-3">
                            <span className="text-lg font-black text-white tracking-tighter uppercase italic">Nexus OS</span>
                            <div className="flex items-center gap-1">
                                <Terminal size={10} className="text-emerald-500" />
                                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest leading-none">Kernel: v5.2.7-LTS</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Scrollable Navigation Area */}
                <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Special Showcase Section */}
                    <div className="space-y-2">
                        <h3 className="px-3 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                            Showcase
                            <div className="h-px bg-gray-800 flex-1"></div>
                        </h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => navigate('/business-demo')}
                                className="flex items-center w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 group text-amber-400 hover:text-amber-200 hover:bg-amber-900/20 border border-amber-500/20"
                            >
                                <Building2 className="w-4 h-4 mr-3 transition-colors text-amber-400 group-hover:text-amber-200" />
                                <span className="flex-1">Enterprise Demo</span>
                                <Sparkles size={12} className="text-amber-400 animate-pulse" />
                            </button>
                        </div>
                    </div>

                    {/* Standard Navigation Groups */}
                    {NAV_ITEMS.map((group, groupIndex) => (
                        <div key={`group-${groupIndex}`} className="space-y-2">
                            <h3 className="px-3 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                {group.group}
                                <div className="h-px bg-gray-800 flex-1"></div>
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = activeView === item.view;
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.view}
                                            onClick={() => handleNavClick(item.view)}
                                            className={`flex items-center w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 group ${
                                                isActive
                                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                                    : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800/50'
                                            }`}
                                        >
                                            {Icon && <Icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-indigo-400'}`} />}
                                            <span className="flex-1">{item.title}</span>
                                            {isActive && <Sparkles size={12} className="text-indigo-300 animate-pulse" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-gray-900 bg-gray-950/50 mt-auto">
                    <div className="flex items-center gap-3 p-3 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl">
                        <Crown className="text-indigo-400" size={16} />
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">The Caretaker</p>
                            <p className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest">Sovereign Admin</p>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/Sidebar.tsx
================================================================================

import React, { useState, useMemo, useEffect, useCallback, createContext, useContext } from 'react';
import { View } from '../types';
import { NAV_ITEMS, NavItem } from '../constants';

// --- NEW TYPES AND INTERFACES (Simulating a larger ecosystem) ---

export type UserStatus = 'online' | 'away' | 'busy' | 'offline' | 'incognito';
export type ThemeMode = 'light' | 'dark' | 'system';
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

export interface UserProfile {
    id: string;
    name: string;
    avatarUrl: string;
    status: UserStatus;
    unreadNotifications: number;
    achievementsCount: number;
    currentWorkspaceId: string;
    roles: string[]; // e.g., ['admin', 'analyst']
    lastLogin: string; // ISO string
    preferences: UserPreferences;
}

export interface UserPreferences {
    theme: ThemeMode;
    language: LanguageCode;
    notificationSettings: {
        email: boolean;
        sms: boolean;
        inApp: boolean;
    };
    accessibility: {
        fontSize: 'small' | 'medium' | 'large';
        highContrast: boolean;
    };
}

export interface SystemHealth {
    connection: 'online' | 'offline' | 'degraded';
    apiStatus: 'operational' | 'degraded' | 'maintenance';
    lastUpdateCheck: string; // ISO string
    pendingUpdates: number;
    resourceUsage: { cpu: number; memory: number; }; // Percentage
    securityAlerts: number;
}

export interface Workspace {
    id: string;
    name: string;
    icon: React.ReactElement;
    membersCount: number;
    isFavorite: boolean;
}

export interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactElement;
    action: () => void;
    requiresPermission?: string[];
}

export interface RecentActivityItem {
    id: string;
    type: 'transaction' | 'document' | 'report' | 'message' | 'alert' | 'login';
    description: string;
    timestamp: string; // ISO string
    link?: string;
    read: boolean;
}

export interface AISuggestion {
    id: string;
    type: 'module' | 'action' | 'report' | 'insight' | 'proactive_alert';
    label: string;
    icon: React.ReactElement;
    action: () => void;
    confidence: number; // 0-1
    context: string; // e.g., "based on your recent activity"
}

export interface GlobalSearchConfig {
    placeholder: string;
    scopeOptions: { id: string; label: string; }[];
    defaultScope: string;
    onSearchSubmit: (term: string, scope: string) => void;
}

// Global App Context (simulated) for user preferences and system data
interface AppContextType {
    user: UserProfile | null;
    systemHealth: SystemHealth;
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    themeMode: ThemeMode;
    language: LanguageCode;
    setUser: (user: UserProfile) => void;
    setSystemHealth: (health: SystemHealth) => void;
    setCurrentWorkspace: (workspace: Workspace) => void;
    setThemeMode: (mode: ThemeMode) => void;
    setLanguage: (lang: LanguageCode) => void;
    openCommandPalette: () => void; // A function to trigger a global command palette
    triggerNotification: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;
    trackEvent: (eventName: string, properties?: Record<string, any>) => void;
    availableQuickActions: QuickAction[];
    recentActivities: RecentActivityItem[];
    aiSuggestions: AISuggestion[];
    searchConfig: GlobalSearchConfig;
}

// Dummy context for demonstration
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook to use the context (simulated)
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        // In a real app, this would be provided higher up
        // For this large expansion, we'll mock a default value to avoid runtime errors,
        // but note this is not ideal for actual application state management.
        console.warn('AppContext is not provided. Using dummy context values.');
        return {
            user: {
                id: 'user-001',
                name: 'Galactic Banker',
                avatarUrl: 'https://via.placeholder.com/150/00FFFF/FFFFFF?text=GB',
                status: 'online',
                unreadNotifications: 3,
                achievementsCount: 12,
                currentWorkspaceId: 'workspace-alpha',
                roles: ['admin', 'auditor', 'quantum-finance-specialist'],
                lastLogin: new Date().toISOString(),
                preferences: {
                    theme: 'dark',
                    language: 'en',
                    notificationSettings: { email: true, sms: false, inApp: true },
                    accessibility: { fontSize: 'medium', highContrast: false },
                },
            },
            systemHealth: {
                connection: 'online',
                apiStatus: 'operational',
                lastUpdateCheck: new Date().toISOString(),
                pendingUpdates: 0,
                resourceUsage: { cpu: 25, memory: 40 },
                securityAlerts: 0,
            },
            workspaces: [
                { id: 'workspace-alpha', name: 'Alpha Quadrant Ops', icon: getIcon('globe'), membersCount: 5, isFavorite: true },
                { id: 'workspace-beta', name: 'Beta Sector Analysis', icon: getIcon('chart'), membersCount: 12, isFavorite: false },
            ],
            currentWorkspace: { id: 'workspace-alpha', name: 'Alpha Quadrant Ops', icon: getIcon('globe'), membersCount: 5, isFavorite: true },
            themeMode: 'dark',
            language: 'en',
            setUser: () => {},
            setSystemHealth: () => {},
            setCurrentWorkspace: () => {},
            setThemeMode: () => {},
            setLanguage: () => {},
            openCommandPalette: () => alert('Command Palette would open!'),
            triggerNotification: (msg) => alert(`Notification: ${msg}`),
            trackEvent: (eventName, props) => console.log(`Event tracked: ${eventName}`, props),
            availableQuickActions: [
                { id: 'new-transaction', label: 'New Transaction', icon: getIcon('wallet'), action: () => alert('New Transaction!') },
                { id: 'upload-doc', label: 'Upload Document', icon: getIcon('upload'), action: () => alert('Upload Document!') },
                { id: 'create-report', label: 'Generate Report', icon: getIcon('chart'), action: () => alert('Generate Report!') },
            ],
            recentActivities: [
                { id: 'act-001', type: 'transaction', description: 'Processed interstellar transfer #34567', timestamp: '2023-10-27T10:00:00Z', read: false },
                { id: 'act-002', type: 'document', description: 'Updated quantum ledger protocol v2.1', timestamp: '2023-10-27T09:30:00Z', read: true },
            ],
            aiSuggestions: [
                { id: 'ai-001', type: 'report', label: 'Review Q3 Galactic Performance', icon: getIcon('chart'), action: () => alert('AI Suggestion: Q3 Report!'), confidence: 0.95, context: 'based on your executive role' },
                { id: 'ai-002', type: 'action', label: 'Optimize Mars Colony Investment', icon: getIcon('globe'), action: () => alert('AI Suggestion: Optimize Investment!'), confidence: 0.88, context: 'high-priority alert' },
            ],
            searchConfig: {
                placeholder: "Search the Multiverse...",
                scopeOptions: [
                    { id: 'all', label: 'All Systems' },
                    { id: 'documents', label: 'Documents' },
                    { id: 'transactions', label: 'Transactions' },
                    { id: 'personnel', label: 'Personnel' },
                    { id: 'knowledge', label: 'Knowledge Base' },
                    { id: 'quantum', label: 'Quantum Ledger' },
                ],
                defaultScope: 'all',
                onSearchSubmit: (term, scope) => alert(`Searching for "${term}" in "${scope}"`),
            }
        } as AppContextType; // Cast to ensure type compatibility
    }
    return context;
};

// --- NEW HELPER FUNCTIONS AND UTILITIES ---

export function getIcon(name: string, className?: string) {
    // A more advanced icon resolver that could load icons dynamically
    // For now, simple placeholders or common icons for visual expansion
    const defaultClass = className || 'h-5 w-5';
    switch (name) {
        case 'user': return <svg className={defaultClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
        case 'settings': return <svg className={defaultClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724

================================================================================
// APPENDED FROM REPO: diplomat-bit/diplomat-bit-book-icewall | ORIGINAL PATH: diplomat-bit-diplomat-bit-book-icewall-23638b5/components/Sidebar.tsx
================================================================================


import React, { useState } from 'react';
import type { Book } from '../types';
import { ChevronRightIcon, ChevronDownIcon, DownloadIcon } from './IconComponents';

interface SidebarProps {
  book: Book;
  selectedPath: string;
  onSelectPath: (key: string) => void;
  onDownload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ book, selectedPath, onSelectPath, onDownload }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <aside className="w-80 bg-slate-950 border-r border-sky-900/30 flex flex-col p-5 shadow-2xl relative z-20">
      <div className="mb-10 p-5 bg-sky-900/10 border border-sky-400/10 rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <h2 className="text-[10px] font-mono-tech text-sky-400 uppercase tracking-[0.3em] mb-2 font-bold">Archive Log</h2>
        <p className="text-xl font-black text-white tracking-tighter uppercase italic">Frozen Relics</p>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar pr-3">
        {book.map((section, sIdx) => (
          <div key={sIdx} className="mb-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 px-2 flex items-center justify-between">
              <span>Tier 0{sIdx + 1}</span>
              <div className="h-[1px] flex-1 ml-4 bg-slate-800"></div>
            </h3>
            <ul className="space-y-1.5">
              {section.chapters.map((chapter, cIdx) => {
                const key = `${sIdx}-${cIdx}`;
                const isExp = expanded.has(key);
                const isSel = selectedPath.startsWith(key);

                return (
                  <li key={cIdx}>
                    <button
                      onClick={() => { toggle(key); onSelectPath(key); }}
                      className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between group relative overflow-hidden ${
                        isSel ? 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold leading-tight uppercase tracking-wide truncate pr-4">
                        {chapter.title}
                      </span>
                      {isExp ? <ChevronDownIcon className="w-3 h-3 opacity-40" /> : <ChevronRightIcon className="w-3 h-3 opacity-40" />}
                    </button>
                    {isExp && (
                      <ul className="mt-2 ml-4 border-l border-sky-900/40 pl-4 space-y-1">
                        {chapter.pages.map((p, pIdx) => {
                          const pKey = `${key}-${pIdx}`;
                          const isPSel = selectedPath === pKey;
                          return (
                            <li key={pIdx}>
                              <button
                                onClick={() => onSelectPath(pKey)}
                                className={`w-full text-left py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border-l-2 ${
                                  isPSel ? 'border-sky-400 bg-sky-400/5 text-sky-200' : 'border-transparent text-slate-500 hover:text-slate-200'
                                }`}
                              >
                                {p.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-8 space-y-3">
        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 p-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-sky-900/20 border border-sky-400/50"
        >
          <DownloadIcon className="w-4 h-4" />
          Export Log
        </button>
      </div>
    </aside>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/Sidebar.tsx
================================================================================

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';
import { DataContext } from '../context/DataContext';
import { Crown, Sparkles, Terminal, Building2 } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

// Logo Component
const InfiniteIntelligenceLogo: React.FC<{className?: string}> = ({className}) => (
     <svg className={className} viewBox="0 0 100 100" fill="none">
        <path d="M20,50 C20,20 80,20 80,50 C80,80 20,80 20,50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M20,50 C20,80 80,80 80,50 C80,20 20,20 20,50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
        <circle cx="50" cy="50" r="10" fill="currentColor" className="animate-pulse" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const context = useContext(DataContext);
    const navigate = useNavigate();

    if (!context) return null;
    const { activeView, setActiveView } = context;
    
    const handleNavClick = (view: View) => {
        setActiveView(view);
        setIsOpen(false);
    };

    return (
        <>
             {/* Mobile Overlay */}
             <div 
                className={`fixed inset-0 bg-black/80 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
             ></div>

            {/* Sidebar Container */}
            <div className={`flex flex-col w-72 bg-black border-r border-gray-800 fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                
                {/* Header */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-800">
                    <div className="flex items-center">
                        <InfiniteIntelligenceLogo className="h-10 w-10 text-indigo-500" />
                        <div className="ml-3">
                            <span className="text-lg font-black text-white tracking-tighter uppercase italic">Nexus OS</span>
                            <div className="flex items-center gap-1">
                                <Terminal size={10} className="text-emerald-500" />
                                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest leading-none">Kernel: v5.2.7-LTS</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Scrollable Navigation Area */}
                <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Special Showcase Section */}
                    <div className="space-y-2">
                        <h3 className="px-3 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                            Showcase
                            <div className="h-px bg-gray-800 flex-1"></div>
                        </h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => navigate('/business-demo')}
                                className="flex items-center w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 group text-amber-400 hover:text-amber-200 hover:bg-amber-900/20 border border-amber-500/20"
                            >
                                <Building2 className="w-4 h-4 mr-3 transition-colors text-amber-400 group-hover:text-amber-200" />
                                <span className="flex-1">Enterprise Demo</span>
                                <Sparkles size={12} className="text-amber-400 animate-pulse" />
                            </button>
                        </div>
                    </div>

                    {/* Standard Navigation Groups */}
                    {NAV_ITEMS.map((group, groupIndex) => (
                        <div key={`group-${groupIndex}`} className="space-y-2">
                            <h3 className="px-3 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                {group.group}
                                <div className="h-px bg-gray-800 flex-1"></div>
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = activeView === item.view;
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.view}
                                            onClick={() => handleNavClick(item.view)}
                                            className={`flex items-center w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 group ${
                                                isActive
                                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                                    : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800/50'
                                            }`}
                                        >
                                            {Icon && <Icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-indigo-400'}`} />}
                                            <span className="flex-1">{item.title}</span>
                                            {isActive && <Sparkles size={12} className="text-indigo-300 animate-pulse" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-gray-900 bg-gray-950/50 mt-auto">
                    <div className="flex items-center gap-3 p-3 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl">
                        <Crown className="text-indigo-400" size={16} />
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">The Caretaker</p>
                            <p className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest">Sovereign Admin</p>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/Sidebar.tsx
================================================================================

import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
  const menuItems = [
    { view: View.Dashboard, icon: 'fas fa-th-large', label: 'Dashboard' },
    { view: View.Transactions, icon: 'fas fa-exchange-alt', label: 'Transactions' },
    { view: View.SendMoney, icon: 'fas fa-paper-plane', label: 'Send Money' },
    { view: View.Investments, icon: 'fas fa-chart-line', label: 'Investments' },
    { view: View.AIAdvisor, icon: 'fas fa-robot', label: 'AI Advisor' },
    { view: View.Budgets, icon: 'fas fa-wallet', label: 'Budgets' },
    { view: View.Crypto, icon: 'fas fa-coins', label: 'Crypto' },
    { view: View.Security, icon: 'fas fa-shield-alt', label: 'Security' },
    { view: View.Settings, icon: 'fas fa-cog', label: 'Settings' },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/90 backdrop-blur-xl border-r border-gray-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:relative lg:translate-x-0`}>
      <div className="p-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Main Menu</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setActiveView(item.view);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === item.view ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <i className={`${item.icon} w-5`}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/Sidebar.tsx
================================================================================

```typescript
import React, { useContext, useState } from 'react';
import { View, NavItem } from '../types';
import { NAV_ITEMS } from '../constants';
import { DataContext } from '../context/DataContext';

// The James Burvel O’Callaghan III Code - Citibankdemobusinessinc - Sidebar Component

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const A_CitibankLogo: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20,50 C20,20 80,20 80,50 C80,80 20,80 20,50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d="M20,50 C20,80 80,80 80,50 C80,20 20,20 20,50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
    </svg>
);

const B_SidebarHeader: React.FC<{ setIsOpen: (isOpen: boolean) => void }> = ({ setIsOpen }) => (
    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700/50">
        <div className="flex items-center">
            <A_CitibankLogo className="h-8 w-8 text-cyan-400" />
            <span className="ml-3 text-lg font-bold text-white tracking-tight">Citibankdemobusinessinc</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);

const C_SidebarNavigationItem: React.FC<{ item: NavItem, isActive: boolean, handleNavClick: (view: View) => void }> = ({ item, isActive, handleNavClick }) => (
    <button
        onClick={() => handleNavClick(item.view)}
        className={`flex items-center w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
            isActive
                ? 'bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-500'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-l-2 border-transparent'
        }`}
    >
        {item.icon && <item.icon className="w-5 h-5 mr-3"/>}
        <span>{item.title}</span>
    </button>
);


const D_SidebarNavigationGroup: React.FC<{ groupTitle?: string, items: NavItem[], activeView: View, handleNavClick: (view: View) => void }> = ({ groupTitle, items, activeView, handleNavClick }) => (
    <div >
        {groupTitle && <h3 className="px-2 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{groupTitle}</h3>}
        {items.map((subItem, index) => {
            const isActive = activeView === subItem.view;
            return (
                <C_SidebarNavigationItem key={index} item={subItem} isActive={isActive} handleNavClick={handleNavClick} />
            );
        })}
    </div>
);

const E_Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Sidebar must be used within a DataProvider");
    const { activeView, setActiveView } = context;

    const handleNavClick = (view: View) => {
        setActiveView(view);
        setIsOpen(false);
    };

    const F_renderNavigation = () => (
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto custom-scrollbar">
            {NAV_ITEMS.map((item, index) => (
                <D_SidebarNavigationGroup
                    key={index}
                    groupTitle={item.group}
                    items={item.items}
                    activeView={activeView}
                    handleNavClick={handleNavClick}
                />
            ))}
        </nav>
    );

    const G_renderOverlay = () => (
        <div
            className={`fixed inset-0 bg-black/60 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsOpen(false)}
        ></div>
    );

    const H_renderSidebar = () => (
        <div className={`flex flex-col w-64 bg-gray-900/50 backdrop-blur-lg border-r border-gray-700/50 fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <B_SidebarHeader setIsOpen={setIsOpen} />
            {F_renderNavigation()}
        </div>
    );

    return (
        <>
            {G_renderOverlay()}
            {H_renderSidebar()}
        </>
    );
};

export default E_Sidebar;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-custom-GitHub-repo-transformer-into-New-York-times-best-seller | ORIGINAL PATH: diplomat-bit-jocall3-custom-GitHub-repo-transformer-into-New-York-times-best-seller-5617407/components/Sidebar.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { GithubRepo, GithubFile, KnowledgeBaseFile, AuditItem } from '../types';
import { githubService } from '../services/githubService';

interface SidebarProps {
  repos: GithubRepo[];
  selectedRepo: GithubRepo | null;
  knowledgeBase: KnowledgeBaseFile[];
  auditQueue: AuditItem[];
  onSelectRepo: (repo: GithubRepo) => void;
  onSelectFile: (file: GithubFile) => void;
  onToggleKnowledge: (file: GithubFile) => void;
  onToggleAudit: (file: GithubFile, repo: GithubRepo) => void;
  onAnalyzeRepo: (repo: GithubRepo) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FileItem: React.FC<{
  repo: GithubRepo;
  file: GithubFile;
  level: number;
  isSelected: boolean;
  isInKnowledge: boolean;
  isInAudit: boolean;
  onSelectFile: (file: GithubFile) => void;
  onToggleKnowledge: (file: GithubFile) => void;
  onToggleAudit: (file: GithubFile, repo: GithubRepo) => void;
}> = ({ repo, file, level, isSelected, isInKnowledge, isInAudit, onSelectFile, onToggleKnowledge, onToggleAudit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<GithubFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFolder = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (file.type !== 'dir') {
      onSelectFile(file);
      return;
    }
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && children.length === 0) {
      setIsLoading(true);
      try {
        const data = await githubService.getRepoContents(repo.name, file.path);
        setChildren(data);
      } catch (err) {
        setChildren([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="my-0.5">
      <div 
        className={`group flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer ${isSelected ? 'bg-indigo-500/20 border-indigo-500/30' : 'hover:bg-slate-800/40'}`}
        onClick={toggleFolder}
      >
        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
            {file.type === 'dir' ? (
                <i className={`fas fa-chevron-right text-[8px] transition-transform text-slate-500 ${isOpen ? 'rotate-90' : ''}`}></i>
            ) : null}
        </div>
        <i className={`fas ${file.type === 'dir' ? (isOpen ? 'fa-folder-open text-amber-400' : 'fa-folder text-amber-400') : 'fa-file-code text-indigo-400'} text-xs`}></i>
        <span className={`truncate text-[11px] ${file.type === 'dir' ? 'text-slate-300 font-medium' : 'text-slate-400'}`}>{file.name}</span>
        
        <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleAudit(file, repo); }} 
            className={`w-5 h-5 rounded flex items-center justify-center ${isInAudit ? 'text-amber-500' : 'text-slate-600 hover:text-amber-500'}`}
          >
            <i className="fas fa-atom text-[10px]"></i>
          </button>
          {file.type === 'file' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleKnowledge(file); }} 
              className={`w-5 h-5 rounded flex items-center justify-center ${isInKnowledge ? 'text-indigo-500' : 'text-slate-600 hover:text-indigo-500'}`}
            >
              <i className="fas fa-plus text-[10px]"></i>
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="ml-4 border-l border-slate-800 pl-2">
          {isLoading ? (
            <div className="py-2 px-4 space-y-2">
                <div className="h-2 bg-slate-800 rounded w-24 animate-pulse"></div>
            </div>
          ) : (
            children.map(child => (
              <FileItem 
                key={child.path} 
                repo={repo} 
                file={child} 
                level={level + 1} 
                isSelected={false} 
                isInKnowledge={false} 
                isInAudit={false}
                onSelectFile={onSelectFile} 
                onToggleKnowledge={onToggleKnowledge} 
                onToggleAudit={onToggleAudit} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ repos, selectedRepo, onSelectRepo, onSelectFile, onToggleKnowledge, onToggleAudit, onAnalyzeRepo, isOpen, onToggle }) => {
  const [search, setSearch] = useState('');
  const [rootFiles, setRootFiles] = useState<GithubFile[]>([]);
  const [loadingRoot, setLoadingRoot] = useState(false);

  useEffect(() => {
    if (selectedRepo) {
      loadRoot();
    }
  }, [selectedRepo?.id]);

  const loadRoot = async () => {
    setLoadingRoot(true);
    try {
      const data = await githubService.getRepoContents(selectedRepo!.name, '');
      setRootFiles(data);
    } catch (err) {
      setRootFiles([]);
    } finally {
      setLoadingRoot(false);
    }
  };

  const filteredRepos = repos.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`flex flex-col border-r border-white/5 bg-slate-950 transition-all duration-500 shadow-2xl overflow-hidden ${isOpen ? 'w-[320px]' : 'w-0 opacity-0'}`}>
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-header text-indigo-400 tracking-[0.3em] uppercase">Modules</h2>
          <button onClick={onToggle} className="text-slate-600 hover:text-white"><i className="fas fa-chevron-left"></i></button>
        </div>
        
        <div className="relative group">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]"></i>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Registry..." 
            className="w-full bg-slate-900 border border-white/5 rounded-lg py-2 pl-8 pr-4 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
        {filteredRepos.map(repo => (
          <div key={repo.id} className="group">
            <button 
                onClick={() => onSelectRepo(repo)} 
                className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${selectedRepo?.id === repo.id ? 'bg-indigo-600/10 border border-indigo-500/30' : 'hover:bg-slate-900 border border-transparent'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedRepo?.id === repo.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400'}`}>
                <i className="fas fa-archive text-xs"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] font-bold truncate uppercase tracking-tight ${selectedRepo?.id === repo.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{repo.name}</div>
                <div className="text-[9px] text-slate-600 font-mono mt-0.5">{repo.language || 'Code'}</div>
              </div>
            </button>
            
            {selectedRepo?.id === repo.id && (
              <div className="mt-2 ml-4 pl-4 border-l border-indigo-500/20 pb-4">
                <button 
                  onClick={() => onAnalyzeRepo(repo)}
                  className="w-full mb-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/20"
                >
                  <i className="fas fa-brain animate-pulse"></i>
                  Analyze Repo
                </button>

                {loadingRoot ? (
                  <div className="p-2 space-y-2 animate-pulse">
                      <div className="h-2 bg-slate-800 rounded w-full"></div>
                      <div className="h-2 bg-slate-800 rounded w-3/4"></div>
                  </div>
                ) : (
                  rootFiles.map(file => (
                    <FileItem 
                      key={file.path} 
                      repo={repo} 
                      file={file} 
                      level={0} 
                      isSelected={false} 
                      isInKnowledge={false} 
                      isInAudit={false}
                      onSelectFile={onSelectFile} 
                      onToggleKnowledge={onToggleKnowledge} 
                      onToggleAudit={onToggleAudit}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/Sidebar.tsx
================================================================================

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';
import { DataContext } from '../context/DataContext';
import { Crown, Sparkles, Terminal, Building2 } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

// Logo Component
const InfiniteIntelligenceLogo: React.FC<{className?: string}> = ({className}) => (
     <svg className={className} viewBox="0 0 100 100" fill="none">
        <path d="M20,50 C20,20 80,20 80,50 C80,80 20,80 20,50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M20,50 C20,80 80,80 80,50 C80,20 20,20 20,50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
        <circle cx="50" cy="50" r="10" fill="currentColor" className="animate-pulse" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const context = useContext(DataContext);
    const navigate = useNavigate();

    if (!context) return null;
    const { activeView, setActiveView } = context;
    
    const handleNavClick = (view: View) => {
        setActiveView(view);
        setIsOpen(false);
    };

    return (
        <>
             {/* Mobile Overlay */}
             <div 
                className={`fixed inset-0 bg-black/80 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
             ></div>

            {/* Sidebar Container */}
            <div className={`flex flex-col w-72 bg-black border-r border-gray-800 fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                
                {/* Header */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-800">
                    <div className="flex items-center">
                        <InfiniteIntelligenceLogo className="h-10 w-10 text-indigo-500" />
                        <div className="ml-3">
                            <span className="text-lg font-black text-white tracking-tighter uppercase italic">Nexus OS</span>
                            <div className="flex items-center gap-1">
                                <Terminal size={10} className="text-emerald-500" />
                                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest leading-none">Kernel: v5.2.7-LTS</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Scrollable Navigation Area */}
                <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Special Showcase Section */}
                    <div className="space-y-2">
                        <h3 className="px-3 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                            Showcase
                            <div className="h-px bg-gray-800 flex-1"></div>
                        </h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => navigate('/business-demo')}
                                className="flex items-center w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 group text-amber-400 hover:text-amber-200 hover:bg-amber-900/20 border border-amber-500/20"
                            >
                                <Building2 className="w-4 h-4 mr-3 transition-colors text-amber-400 group-hover:text-amber-200" />
                                <span className="flex-1">Enterprise Demo</span>
                                <Sparkles size={12} className="text-amber-400 animate-pulse" />
                            </button>
                        </div>
                    </div>

                    {/* Standard Navigation Groups */}
                    {NAV_ITEMS.map((group, groupIndex) => (
                        <div key={`group-${groupIndex}`} className="space-y-2">
                            <h3 className="px-3 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                {group.group}
                                <div className="h-px bg-gray-800 flex-1"></div>
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = activeView === item.view;
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.view}
                                            onClick={() => handleNavClick(item.view)}
                                            className={`flex items-center w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 group ${
                                                isActive
                                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                                    : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800/50'
                                            }`}
                                        >
                                            {Icon && <Icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-indigo-400'}`} />}
                                            <span className="flex-1">{item.title}</span>
                                            {isActive && <Sparkles size={12} className="text-indigo-300 animate-pulse" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-gray-900 bg-gray-950/50 mt-auto">
                    <div className="flex items-center gap-3 p-3 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl">
                        <Crown className="text-indigo-400" size={16} />
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">The Caretaker</p>
                            <p className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest">Sovereign Admin</p>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;