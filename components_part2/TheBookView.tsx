// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/TheBookView.tsx
================================================================================


import React, { useState, useMemo } from 'react';
import Card from './Card';
import { Book, ChevronRight, FileText, List, Search, ArrowLeft } from 'lucide-react';

// --- DATA STRUCTURE FOR THE 527 PAGES ---
// This acts as the "database" for the book content.
// In a real app, this would be fetched from a markdown folder or CMS.
// We generate a massive structure here to simulate the depth required.

interface Chapter {
    id: string;
    title: string;
    pages: Page[];
}

interface Page {
    id: string;
    title: string;
    content: string;
}

const generateBookContent = (): Chapter[] => {
    const parts = [
        "I. The Vision",
        "II. High-Level Architecture",
        "III. Asset Domains Encyclopaedia",
        "IV. Banking & Integration",
        "V. Intelligence Systems",
        "VI. Component Library",
        "VII. Operational Playbooks",
        "VIII. Developer Appendix"
    ];

    let pageCounter = 1;
    const chapters: Chapter[] = [];

    parts.forEach((partTitle, partIndex) => {
        // Generate chapters for each part
        const chapterCount = partIndex === 2 ? 20 : 5; // Make Asset Domains huge
        
        for (let i = 1; i <= chapterCount; i++) {
            const chapterId = `part${partIndex + 1}-chap${i}`;
            const chapterTitle = `${partTitle} - Chapter ${i}: The ${partIndex === 2 ? 'Asset' : 'Protocol'} of ${Math.random().toString(36).substring(7)}`;
            
            const pages: Page[] = [];
            // Generate pages for each chapter
            const pageCount = partIndex === 5 ? 10 : 5; // Component library has many pages
            
            for (let j = 1; j <= pageCount; j++) {
                pages.push({
                    id: `page-${pageCounter}`,
                    title: `Page ${pageCounter}: Section ${j} of ${chapterTitle}`,
                    content: `
                        ### ${chapterTitle}
                        **Subsection ${j}.0 - Core Principles**

                        The Infinite Intelligence Foundation dictates that information flow must be unhindered yet verified. 
                        In this section, we explore the specific mechanics of ${partIndex === 2 ? 'asset tokenization' : 'system architecture'}.
                        
                        *   **Principle A:** Absolute Truth. The ledger cannot lie.
                        *   **Principle B:** Infinite Scalability. The system grows with the network.
                        *   **Principle C:** Benevolent Oversight. The AI ensures compliance and ethical alignment.

                        This protocol serves as the binding agent for the entire ecosystem. 
                        By adhering to these standards, we ensure that the Foundation remains a beacon of stability in a chaotic financial world.

                        *Ref: Protocol Standard 527.${pageCounter}.${j}*
                    `
                });
                pageCounter++;
            }

            chapters.push({
                id: chapterId,
                title: chapterTitle,
                pages: pages
            });
        }
    });

    return chapters;
};

const BOOK_DATA = generateBookContent();

const TheBookView: React.FC = () => {
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChapters = useMemo(() => {
        if (!searchQuery) return BOOK_DATA;
        return BOOK_DATA.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.pages.some(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const handleChapterClick = (chapter: Chapter) => {
        setSelectedChapter(chapter);
        setSelectedPage(chapter.pages[0]);
    };

    const handlePageClick = (page: Page) => {
        setSelectedPage(page);
    };

    const handleBackToToC = () => {
        setSelectedChapter(null);
        setSelectedPage(null);
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <header className="flex items-center justify-between border-b border-gray-700 pb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
                        <Book className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">The 527 Protocol</h1>
                        <p className="text-gray-400 text-sm">The Living Blueprint of the Infinite Intelligence Foundation.</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search the Protocol..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none w-64 focus:w-80 transition-all"
                    />
                </div>
            </header>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar / Table of Contents */}
                <Card className="lg:col-span-1 bg-gray-900/80 border-indigo-500/30 flex flex-col overflow-hidden p-0">
                    <div className="p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10 flex items-center gap-2">
                        <List className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-gray-200 text-sm">Table of Contents</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {selectedChapter ? (
                            <div className="space-y-1">
                                <button onClick={handleBackToToC} className="w-full text-left px-3 py-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-2">
                                    <ArrowLeft size={12} /> Back to Chapters
                                </button>
                                <div className="px-3 py-2 text-xs font-bold text-white bg-gray-800 rounded">{selectedChapter.title}</div>
                                {selectedChapter.pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => handlePageClick(page)}
                                        className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center gap-2 ${
                                            selectedPage?.id === page.id 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedPage?.id === page.id ? 'bg-white' : 'bg-gray-600'}`}></div>
                                        {page.title}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredChapters.map(chapter => (
                                    <button
                                        key={chapter.id}
                                        onClick={() => handleChapterClick(chapter)}
                                        className="w-full text-left px-3 py-3 rounded hover:bg-gray-800 transition-colors flex items-center justify-between group border-b border-gray-800/50 last:border-0"
                                    >
                                        <span className="text-sm text-gray-300 group-hover:text-white font-medium line-clamp-1">{chapter.title}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Reader View */}
                <Card className="lg:col-span-3 bg-gray-900/80 border-indigo-500/30 flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Book size={200} />
                    </div>
                    
                    {selectedPage ? (
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-6 pb-4 border-b border-gray-800">
                                    <h2 className="text-2xl font-bold text-white">{selectedPage.title}</h2>
                                    <p className="text-xs text-indigo-400 font-mono mt-2">ID: {selectedPage.id} | VER: 5.2.7</p>
                                </div>
                                <div className="prose prose-invert prose-lg text-gray-300 leading-relaxed whitespace-pre-line">
                                    {selectedPage.content}
                                </div>
                                <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between text-sm text-gray-500">
                                    <span>Infinite Intelligence Foundation</span>
                                    <span>Page {selectedPage.id.split('-')[1]} of 527</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Book size={40} className="text-indigo-500/50" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-300 mb-2">Select a Chapter</h3>
                            <p className="max-w-md">The Protocol contains 527 pages of operational doctrine. Select a chapter from the sidebar to begin your study.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default TheBookView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/TheBookView (1).tsx
================================================================================


import React, { useState, useMemo } from 'react';
import Card from './Card';
import { Book, ChevronRight, FileText, List, Search, ArrowLeft } from 'lucide-react';

// --- DATA STRUCTURE FOR THE 527 PAGES ---
// This acts as the "database" for the book content.
// In a real app, this would be fetched from a markdown folder or CMS.
// We generate a massive structure here to simulate the depth required.

interface Chapter {
    id: string;
    title: string;
    pages: Page[];
}

interface Page {
    id: string;
    title: string;
    content: string;
}

const generateBookContent = (): Chapter[] => {
    const parts = [
        "I. The Vision",
        "II. High-Level Architecture",
        "III. Asset Domains Encyclopaedia",
        "IV. Banking & Integration",
        "V. Intelligence Systems",
        "VI. Component Library",
        "VII. Operational Playbooks",
        "VIII. Developer Appendix"
    ];

    let pageCounter = 1;
    const chapters: Chapter[] = [];

    parts.forEach((partTitle, partIndex) => {
        // Generate chapters for each part
        const chapterCount = partIndex === 2 ? 20 : 5; // Make Asset Domains huge
        
        for (let i = 1; i <= chapterCount; i++) {
            const chapterId = `part${partIndex + 1}-chap${i}`;
            const chapterTitle = `${partTitle} - Chapter ${i}: The ${partIndex === 2 ? 'Asset' : 'Protocol'} of ${Math.random().toString(36).substring(7)}`;
            
            const pages: Page[] = [];
            // Generate pages for each chapter
            const pageCount = partIndex === 5 ? 10 : 5; // Component library has many pages
            
            for (let j = 1; j <= pageCount; j++) {
                pages.push({
                    id: `page-${pageCounter}`,
                    title: `Page ${pageCounter}: Section ${j} of ${chapterTitle}`,
                    content: `
                        ### ${chapterTitle}
                        **Subsection ${j}.0 - Core Principles**

                        The Infinite Intelligence Foundation dictates that information flow must be unhindered yet verified. 
                        In this section, we explore the specific mechanics of ${partIndex === 2 ? 'asset tokenization' : 'system architecture'}.
                        
                        *   **Principle A:** Absolute Truth. The ledger cannot lie.
                        *   **Principle B:** Infinite Scalability. The system grows with the network.
                        *   **Principle C:** Benevolent Oversight. The AI ensures compliance and ethical alignment.

                        This protocol serves as the binding agent for the entire ecosystem. 
                        By adhering to these standards, we ensure that the Foundation remains a beacon of stability in a chaotic financial world.

                        *Ref: Protocol Standard 527.${pageCounter}.${j}*
                    `
                });
                pageCounter++;
            }

            chapters.push({
                id: chapterId,
                title: chapterTitle,
                pages: pages
            });
        }
    });

    return chapters;
};

const BOOK_DATA = generateBookContent();

const TheBookView: React.FC = () => {
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChapters = useMemo(() => {
        if (!searchQuery) return BOOK_DATA;
        return BOOK_DATA.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.pages.some(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const handleChapterClick = (chapter: Chapter) => {
        setSelectedChapter(chapter);
        setSelectedPage(chapter.pages[0]);
    };

    const handlePageClick = (page: Page) => {
        setSelectedPage(page);
    };

    const handleBackToToC = () => {
        setSelectedChapter(null);
        setSelectedPage(null);
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <header className="flex items-center justify-between border-b border-gray-700 pb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
                        <Book className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">The 527 Protocol</h1>
                        <p className="text-gray-400 text-sm">The Living Blueprint of the Infinite Intelligence Foundation.</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search the Protocol..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none w-64 focus:w-80 transition-all"
                    />
                </div>
            </header>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar / Table of Contents */}
                <Card className="lg:col-span-1 bg-gray-900/80 border-indigo-500/30 flex flex-col overflow-hidden p-0">
                    <div className="p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10 flex items-center gap-2">
                        <List className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-gray-200 text-sm">Table of Contents</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {selectedChapter ? (
                            <div className="space-y-1">
                                <button onClick={handleBackToToC} className="w-full text-left px-3 py-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-2">
                                    <ArrowLeft size={12} /> Back to Chapters
                                </button>
                                <div className="px-3 py-2 text-xs font-bold text-white bg-gray-800 rounded">{selectedChapter.title}</div>
                                {selectedChapter.pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => handlePageClick(page)}
                                        className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center gap-2 ${
                                            selectedPage?.id === page.id 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedPage?.id === page.id ? 'bg-white' : 'bg-gray-600'}`}></div>
                                        {page.title}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredChapters.map(chapter => (
                                    <button
                                        key={chapter.id}
                                        onClick={() => handleChapterClick(chapter)}
                                        className="w-full text-left px-3 py-3 rounded hover:bg-gray-800 transition-colors flex items-center justify-between group border-b border-gray-800/50 last:border-0"
                                    >
                                        <span className="text-sm text-gray-300 group-hover:text-white font-medium line-clamp-1">{chapter.title}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Reader View */}
                <Card className="lg:col-span-3 bg-gray-900/80 border-indigo-500/30 flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Book size={200} />
                    </div>
                    
                    {selectedPage ? (
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-6 pb-4 border-b border-gray-800">
                                    <h2 className="text-2xl font-bold text-white">{selectedPage.title}</h2>
                                    <p className="text-xs text-indigo-400 font-mono mt-2">ID: {selectedPage.id} | VER: 5.2.7</p>
                                </div>
                                <div className="prose prose-invert prose-lg text-gray-300 leading-relaxed whitespace-pre-line">
                                    {selectedPage.content}
                                </div>
                                <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between text-sm text-gray-500">
                                    <span>Infinite Intelligence Foundation</span>
                                    <span>Page {selectedPage.id.split('-')[1]} of 527</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Book size={40} className="text-indigo-500/50" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-300 mb-2">Select a Chapter</h3>
                            <p className="max-w-md">The Protocol contains 527 pages of operational doctrine. Select a chapter from the sidebar to begin your study.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default TheBookView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/TheBookView (2).tsx
================================================================================

```typescript
import React, { useState, useMemo } from 'react';
import Card from './Card';
import { Book, ChevronRight, FileText, List, Search, ArrowLeft } from 'lucide-react';

// --- DATA STRUCTURE FOR THE 527 PAGES ---
// This acts as the "database" for the book content.
// In a real app, this would be fetched from a markdown folder or CMS.
// We generate a massive structure here to simulate the depth required.

// --- JAMES BURVEL O’CALLAGHAN III CODE: THE 527 PROTOCOL ---
// --- DEFINITION: THE BOOK VIEW COMPONENT ---
// --- ARCHITECTURE: PROCEDURAL, INDEXED, SELF-REFERENTIAL, UI-HEAVY, AND UNAPOLOGETICALLY COMPLEX ---
// --- VERSION: 5.2.7 ---

// A1: Interface Definition for Chapter (James Burvel O’Callaghan III Code)
interface A1_Chapter {
    id: string; // A2
    title: string; // A3
    pages: A4_Page[]; // A4
}

// A4: Interface Definition for Page (James Burvel O’Callaghan III Code)
interface A4_Page {
    id: string; // A5
    title: string; // A6
    content: string; // A7
}

// B1: Function to generate thematic titles based on part and index (James Burvel O’Callaghan III Code)
const B1_getThematicTitle = (part: string, index: number): string => {
    const B2_titles: Record<string, string[]> = {
        "Genesis": ["The Primordial Ledger - Genesis 1.1", "Axiom of Origin - Genesis 1.2", "The First Block - Genesis 1.3", "Cryptographic Dawn - Genesis 1.4", "Immutable Foundations - Genesis 1.5", "The Zero State - Genesis 1.6", "Consensus Genesis - Genesis 1.7", "The Seed Phrase - Genesis 1.8", "Digital Ontology - Genesis 1.9", "The Void - Genesis 1.10", "The Genesis Block - Genesis 1.11", "Primordial Data - Genesis 1.12", "Initial State - Genesis 1.13", "The Genesis Protocol - Genesis 1.14", "Pre-State - Genesis 1.15", "The First Transaction - Genesis 1.16", "Origin of Keys - Genesis 1.17", "Genesis Chain - Genesis 1.18", "The First Proof - Genesis 1.19", "Unverified State - Genesis 1.20"],
        "Sovereignty": ["Self-Sovereign Identity - Sovereignty 2.1", "The Legal Wrapper - Sovereignty 2.2", "Jurisdiction of Code - Sovereignty 2.3", "The Smart Contract Constitution - Sovereignty 2.4", "Decentralized Rights - Sovereignty 2.5", "The Governance Token - Sovereignty 2.6", "Autonomy Protocols - Sovereignty 2.7", "The Citizen Node - Sovereignty 2.8", "Borderless State - Sovereignty 2.9", "The Private Key - Sovereignty 2.10", "Digital Identity - Sovereignty 2.11", "Rights Management - Sovereignty 2.12", "Code of Conduct - Sovereignty 2.13", "Sovereign Nodes - Sovereignty 2.14", "Identity Protocols - Sovereignty 2.15", "The Sovereign Ledger - Sovereignty 2.16", "Personal Data Vault - Sovereignty 2.17", "Authorization Chains - Sovereignty 2.18", "User Sovereignty - Sovereignty 2.19", "The Self - Sovereignty 2.20"],
        "FinOS": ["The Operating System - FinOS 3.1", "Liquidity Engines - FinOS 3.2", "The Transaction Layer - FinOS 3.3", "Atomic Swaps - FinOS 3.4", "The Clearing House - FinOS 3.5", "Fiscal Kernels - FinOS 3.6", "The API Gateway - FinOS 3.7", "Ledger Synchronization - FinOS 3.8", "The Treasury Module - FinOS 3.9", "Economic Runtime - FinOS 3.10", "Financial Primitives - FinOS 3.11", "Automated Market Makers - FinOS 3.12", "Decentralized Exchanges - FinOS 3.13", "Yield Farming - FinOS 3.14", "Loan Protocols - FinOS 3.15", "Derivatives Markets - FinOS 3.16", "Stablecoin Mechanics - FinOS 3.17", "Risk Management - FinOS 3.18", "Security Audits - FinOS 3.19", "The FinOS Ecosystem - FinOS 3.20"],
        "AI": ["Neural Governance - AI 4.1", "The Silicon Cortex - AI 4.2", "Predictive Enforcement - AI 4.3", "Algorithmic Justice - AI 4.4", "The Oracle Network - AI 4.5", "Machine Consensus - AI 4.6", "Automated Compliance - AI 4.7", "The Cognitive Layer - AI 4.8", "Deep Learning Audits - AI 4.9", "The Sentinel - AI 4.10", "Artificial General Intelligence - AI 4.11", "Machine Ethics - AI 4.12", "Bias Mitigation - AI 4.13", "Model Training - AI 4.14", "Data Governance - AI 4.15", "AI Security - AI 4.16", "Explainable AI - AI 4.17", "AI Alignment - AI 4.18", "The AI Framework - AI 4.19", "Autonomous Systems - AI 4.20"],
        "GEIN": ["Global Economic Intelligence Network - GEIN 5.1", "The Data Mesh - GEIN 5.2", "Interoperability Bridges - GEIN 5.3", "The Signal Layer - GEIN 5.4", "Network Topography - GEIN 5.5", "The Information Bus - GEIN 5.6", "Latency Elimination - GEIN 5.7", "The Global Graph - GEIN 5.8", "Node Distribution - GEIN 5.9", "The Pulse - GEIN 5.10", "Economic Indicators - GEIN 5.11", "Market Sentiment Analysis - GEIN 5.12", "Supply Chain Optimization - GEIN 5.13", "Risk Forecasting - GEIN 5.14", "Predictive Analytics - GEIN 5.15", "Geopolitical Analysis - GEIN 5.16", "Trade Route Optimization - GEIN 5.17", "Resource Allocation - GEIN 5.18", "Economic Simulations - GEIN 5.19", "The GEIN Architecture - GEIN 5.20"],
        "Assets": ["Tokenized Real Estate - Assets 6.1", "Digital Commodities - Assets 6.2", "The Stablecoin Standard - Assets 6.3", "Synthetic Derivatives - Assets 6.4", "The NFT Registry - Assets 6.5", "Fractional Ownership - Assets 6.6", "The Asset Vault - Assets 6.7", "Liquidity Pools - Assets 6.8", "The Exchange Mechanism - Assets 6.9", "Value Pegs - Assets 6.10", "Token Standards - Assets 6.11", "Asset Backing - Assets 6.12", "Regulatory Compliance - Assets 6.13", "Securities Tokenization - Assets 6.14", "Asset Management - Assets 6.15", "Portfolio Diversification - Assets 6.16", "Decentralized Finance - Assets 6.17", "Insurance Protocols - Assets 6.18", "The Asset Lifecycle - Assets 6.19", "The Token Economy - Assets 6.20"],
        "Transition": ["The Migration Path - Transition 7.1", "Legacy Deprecation - Transition 7.2", "The Bridge Event - Transition 7.3", "The New Era - Transition 7.4", "Final Settlement - Transition 7.5", "The Handover - Transition 7.6", "System Activation - Transition 7.7", "The Omega Block - Transition 7.8", "The Horizon - Transition 7.9", "The Infinite Loop - Transition 7.10", "Protocol Upgrade - Transition 7.11", "Data Migration - Transition 7.12", "Governance Transition - Transition 7.13", "Smart Contract Deployment - Transition 7.14", "User Onboarding - Transition 7.15", "Developer Ecosystem - Transition 7.16", "Community Building - Transition 7.17", "Ecosystem Launch - Transition 7.18", "Future Roadmap - Transition 7.19", "The Transition Protocol - Transition 7.20"]
    };

    const B3_list = B2_titles[part] || ["Unknown Protocol - 0.0"];
    return B3_list[index % B3_list.length];
};

// C1: Function to generate sophisticated content for the manifesto (James Burvel O’Callaghan III Code)
const C1_getThematicContent = (part: string, pageNum: number, chapterTitle: string, subSection: number): string => {
    const C2_intro = [
        "The architecture defines reality. We do not merely observe; we construct the world from first principles.",
        "We observe the collapse of legacy systems with clinical detachment, knowing their time is over.",
        "Efficiency is the ultimate morality in a resource-constrained universe. Waste is the only sin.",
        "Code is the only law that matters. All else is mutable and subject to error; interpretation is a bug.",
        "The ledger records the pulse of civilization, unblinking and eternal, the only truth that matters."
    ];

    const C3_specificText: Record<string, string> = {
        "Genesis": "In the beginning, there was only noise. The Protocol brings order to the chaos of unverified data. We establish the root of trust not in fallible institutions, but in cryptographic certainty. This is the bedrock upon which the new world is compiled. The Genesis block is the beginning, the anchor, the immutable starting point of all that follows. Every subsequent block builds upon this foundation, creating an unbroken chain of verifiable truth. The Genesis protocol is not merely a technical implementation; it is a philosophical statement, a rejection of centralized control and a declaration of individual sovereignty. The initial state is the seed, the potential, the raw material from which we construct a new reality. We reject the false idols of the old world and embrace the elegance and efficiency of the new.",
        "Sovereignty": "The individual is the atomic unit of the network. Sovereignty is not granted; it is asserted through private keys, a self-sovereign identity. The state is a service provider, and we are the subscribers, not the subjects. We reject the coercion of geography and the arbitrary limitations imposed by outdated systems. The ability to control one's own identity and data is the cornerstone of a free society. The Smart Contract Constitution provides a framework for decentralized governance, ensuring that power is distributed and that no single entity can control the system. The legal wrapper provides a mechanism for bridging the gap between the physical and digital worlds, allowing individuals to operate within a legal framework that is both secure and transparent.",
        "FinOS": "Money is information, and information must flow freely. FinOS optimizes the flow of value with the same ruthlessness as a compiler optimizing code. Friction is lost energy; we eliminate it through atomic swaps and decentralized exchanges. The velocity of money must match the velocity of information to ensure economic efficiency. The operating system provides the foundation for all financial transactions, allowing for seamless integration and interoperability. The treasury module is responsible for managing the funds of the system, ensuring that resources are allocated efficiently and that the system remains solvent. The API gateway provides a secure and reliable interface for external applications to interact with the system, expanding the network's reach and impact.",
        "AI": "Intelligence must be scalable, and therefore, it must be artificial. The AI does not rule; it administers, providing impartial judgment and tireless auditing. It is the guardian of the 527 principles, ensuring that the protocol remains secure and aligned with its core tenets. The silicon cortex is the brain of the system, processing vast amounts of data and making complex decisions in real time. The oracle network provides access to real-world data, allowing the system to interact with the outside world in a reliable and secure manner. Automated compliance ensures that all transactions and activities adhere to the legal and regulatory frameworks, minimizing risk and ensuring the long-term viability of the system.",
        "GEIN": "Connection is power, and GEIN harnesses that power through the Global Economic Intelligence Network, binding the disparate nodes into a cohesive organism. Latency is the enemy of truth, and we build the nervous system of the planet to eliminate it. The data mesh provides a secure and reliable way to share information between different entities, enabling seamless collaboration and interoperability. The signal layer is responsible for filtering and analyzing data, providing insights and alerts that help users make informed decisions. The network topography visualizes the connections between different nodes, helping users understand the overall structure and health of the network.",
        "Assets": "Everything is an asset, and if it has value, it must be tokenized. We tokenize the world to make it liquid, transparent, and accessible to the collective intelligence. Ownership is no longer mere possession; it is access. The NFT registry provides a secure and verifiable way to store and manage digital assets, ensuring that ownership is protected and that assets can be easily transferred. Fractional ownership allows individuals to own a portion of an asset, making it more accessible and liquid. The exchange mechanism provides a platform for buying and selling assets, ensuring that they can be easily traded and that their value is realized.",
        "Transition": "The old world will not go quietly. We must build the bridge while walking on it. The transition is inevitable, but the path requires unwavering discipline and a deep understanding of the principles that underpin the new system. We are the architects of the handover, the builders of the future. The migration path provides a roadmap for transitioning from legacy systems to the new protocol. Legacy deprecation ensures that old systems are gradually phased out, minimizing disruption and ensuring that the transition is smooth and efficient. The bridge event is the point at which the old and new systems are connected, allowing for the seamless transfer of data and assets. The new era is a time of innovation and growth, a time when the full potential of the protocol can be realized."
    };

    const C4_lorem = "The integration of the subsystem requires a complete overhaul of the existing paradigms. By leveraging the distributed nature of the ledger, we ensure that no single point of failure can compromise the integrity of the whole. The data streams are verified in real-time, ensuring that the consensus mechanism remains robust against adversarial attacks. We iterate towards perfection, knowing it is an asymptote we must forever approach. The modular design of the system allows for easy upgrades and modifications, ensuring that it remains adaptable to changing needs and requirements. The use of advanced cryptography provides a high level of security, protecting the system from unauthorized access and malicious attacks. The system is designed to be scalable, ensuring that it can handle a growing number of transactions and users without compromising performance. The governance mechanism ensures that the system is managed in a fair and transparent manner, with all stakeholders having a voice in decision-making. The system is designed to be user-friendly, with a clear and intuitive interface that makes it easy for users to interact with the system. The documentation is comprehensive and up-to-date, providing users with all the information they need to understand and use the system. The support team is responsive and helpful, providing users with the assistance they need to resolve any issues they may encounter. The system is continuously monitored and improved, ensuring that it remains secure, reliable, and efficient. The commitment to innovation ensures that the system remains at the forefront of technological advancements. The unwavering dedication to the principles of decentralization, transparency, and security ensures that the system remains a trusted and reliable platform for all users. The future of the system is bright, with endless possibilities for growth and innovation. The team is passionate and dedicated, working tirelessly to bring the vision of the system to life. The system is more than just a piece of software; it is a movement, a community, and a way of life.";

    return `
### ${chapterTitle} // Protocol Section: ${pageNum}.${subSection}

**Protocol Analysis**

${C3_specificText[part] || "The system functions as designed. All nodes report a status of 'Operational'."}

#### Core Axiom ${pageNum}.${subSection} // Foundation Stone

${C2_intro[pageNum % C2_intro.length]}

The **Infinite Intelligence Foundation** mandates that all nodes within the ${part} sector adhere to strict synchronization standards. As we iterate through the ${pageNum}th cycle of the manifesto, we recognize that:

1.  **Verification is absolute and non-negotiable.** Trust is a vulnerability that must be ruthlessly and permanently patched.
2.  **Scalability is non-negotiable and the paramount concern.** If it doesn't scale linearly and indefinitely, it will fail.
3.  **Privacy is structural and fundamental.** Exposure is a catastrophic failure of architecture and the absolute opposite of the intent.
4.  **Decentralization is inviolable.** Centralized control represents the exact threat we are designed to eliminate.
5.  **Immutability is the bedrock of trust.** Once recorded, data cannot be altered or erased.

${C4_lorem}

> "To define the protocol is to define the future. We are not writing code; we are writing history. The blockchain is not just a technology; it is a philosophy." - James Burvel O’Callaghan III

*System Reference: 0x${(pageNum * 12345 + subSection).toString(16).toUpperCase()} // Build 527.A.B*
    `;
};

// D1: Function to generate the book content (James Burvel O’Callaghan III Code)
const D1_generateBookContent = (): A1_Chapter[] => {
    const D2_structure = [
        { name: "Genesis", pages: 60, chapters: 6 },
        { name: "Sovereignty", pages: 80, chapters: 8 },
        { name: "FinOS", pages: 90, chapters: 9 },
        { name: "AI", pages: 110, chapters: 11 },
        { name: "GEIN", pages: 110, chapters: 11 },
        { name: "Assets", pages: 110, chapters: 11 },
        { name: "Transition", pages: 37, chapters: 4 }
    ];

    let D3_globalPageCounter = 1;
    const D4_book: A1_Chapter[] = [];

    D2_structure.forEach((part, partIndex) => {
        const D5_pagesPerChapter = Math.ceil(part.pages / part.chapters);
        let D6_pagesInPartCounter = 0;

        for (let c = 1; c <= part.chapters; c++) {
            const D7_chapterPages: A4_Page[] = [];
            const D8_chapterTitle = `${partIndex + 1}. ${part.name} - Chapter ${c}: ${B1_getThematicTitle(part.name, c)}`;

            let D9_limit = D5_pagesPerChapter;
            if (D6_pagesInPartCounter + D9_limit > part.pages) {
                D9_limit = part.pages - D6_pagesInPartCounter;
            }

            for (let p = 1; p <= D9_limit; p++) {
                if (D6_pagesInPartCounter >= part.pages) break;

                const D10_pageTitle = `Page ${D3_globalPageCounter}: ${B1_getThematicTitle(part.name, D3_globalPageCounter + p)}`;
                const D11_content = C1_getThematicContent(part.name, D3_globalPageCounter, D8_chapterTitle, p);

                D7_chapterPages.push({
                    id: `page-${D3_globalPageCounter}`,
                    title: D10_pageTitle,
                    content: D11_content
                });
                D3_globalPageCounter++;
                D6_pagesInPartCounter++;
            }

            if (D7_chapterPages.length > 0) {
                D4_book.push({
                    id: `part-${partIndex}-chap-${c}`,
                    title: D8_chapterTitle,
                    pages: D7_chapterPages
                });
            }
        }
    });

    return D4_book;
};

// E1: Constant for the book data (James Burvel O’Callaghan III Code)
const E1_BOOK_DATA = D1_generateBookContent();

// F1: TheBookView Component (James Burvel O’Callaghan III Code)
const F1_TheBookView: React.FC = () => {
    const F2_selectedChapter = useState<A1_Chapter | null>(null);
    const F3_setSelectedChapter = F2_selectedChapter[1];
    const F4_selectedPage = useState<A4_Page | null>(null);
    const F5_setSelectedPage = F4_selectedPage[1];
    const F6_searchQuery = useState<string>('');
    const F7_setSearchQuery = F6_searchQuery[1];

    const F8_filteredChapters = useMemo(() => {
        if (!F6_searchQuery[0]) return E1_BOOK_DATA;
        return E1_BOOK_DATA.filter(c =>
            c.title.toLowerCase().includes(F6_searchQuery[0].toLowerCase()) ||
            c.pages.some(p => p.content.toLowerCase().includes(F6_searchQuery[0].toLowerCase()))
        );
    }, [F6_searchQuery[0]]);

    const F9_handleChapterClick = (chapter: A1_Chapter) => {
        F3_setSelectedChapter(chapter);
        F5_setSelectedPage(chapter.pages[0]);
    };

    const G1_handlePageClick = (page: A4_Page) => {
        F5_setSelectedPage(page);
    };

    const G2_handleBackToToC = () => {
        F3_setSelectedChapter(null);
        F5_setSelectedPage(null);
    };

    const H1_API_ENDPOINT_1 = () => { /* Placeholder for Endpoint 1 */ };
    const H2_API_ENDPOINT_2 = () => { /* Placeholder for Endpoint 2 */ };
    const H3_API_ENDPOINT_3 = () => { /* Placeholder for Endpoint 3 */ };
    const H4_API_ENDPOINT_4 = () => { /* Placeholder for Endpoint 4 */ };
    const H5_API_ENDPOINT_5 = () => { /* Placeholder for Endpoint 5 */ };
    const H6_API_ENDPOINT_6 = () => { /* Placeholder for Endpoint 6 */ };
    const H7_API_ENDPOINT_7 = () => { /* Placeholder for Endpoint 7 */ };
    const H8_API_ENDPOINT_8 = () => { /* Placeholder for Endpoint 8 */ };
    const H9_API_ENDPOINT_9 = () => { /* Placeholder for Endpoint 9 */ };
    const I1_API_ENDPOINT_10 = () => { /* Placeholder for Endpoint 10 */ };
    const I2_API_ENDPOINT_11 = () => { /* Placeholder for Endpoint 11 */ };
    const I3_API_ENDPOINT_12 = () => { /* Placeholder for Endpoint 12 */ };
    const I4_API_ENDPOINT_13 = () => { /* Placeholder for Endpoint 13 */ };
    const I5_API_ENDPOINT_14 = () => { /* Placeholder for Endpoint 14 */ };
    const I6_API_ENDPOINT_15 = () => { /* Placeholder for Endpoint 15 */ };
    const I7_API_ENDPOINT_16 = () => { /* Placeholder for Endpoint 16 */ };
    const I8_API_ENDPOINT_17 = () => { /* Placeholder for Endpoint 17 */ };
    const I9_API_ENDPOINT_18 = () => { /* Placeholder for Endpoint 18 */ };
    const J1_API_ENDPOINT_19 = () => { /* Placeholder for Endpoint 19 */ };
    const J2_API_ENDPOINT_20 = () => { /* Placeholder for Endpoint 20 */ };
    const J3_API_ENDPOINT_21 = () => { /* Placeholder for Endpoint 21 */ };
    const J4_API_ENDPOINT_22 = () => { /* Placeholder for Endpoint 22 */ };
    const J5_API_ENDPOINT_23 = () => { /* Placeholder for Endpoint 23 */ };
    const J6_API_ENDPOINT_24 = () => { /* Placeholder for Endpoint 24 */ };
    const J7_API_ENDPOINT_25 = () => { /* Placeholder for Endpoint 25 */ };
    const J8_API_ENDPOINT_26 = () => { /* Placeholder for Endpoint 26 */ };
    const J9_API_ENDPOINT_27 = () => { /* Placeholder for Endpoint 27 */ };
    const K1_API_ENDPOINT_28 = () => { /* Placeholder for Endpoint 28 */ };
    const K2_API_ENDPOINT_29 = () => { /* Placeholder for Endpoint 29 */ };
    const K3_API_ENDPOINT_30 = () => { /* Placeholder for Endpoint 30 */ };
    const K4_API_ENDPOINT_31 = () => { /* Placeholder for Endpoint 31 */ };
    const K5_API_ENDPOINT_32 = () => { /* Placeholder for Endpoint 32 */ };
    const K6_API_ENDPOINT_33 = () => { /* Placeholder for Endpoint 33 */ };
    const K7_API_ENDPOINT_34 = () => { /* Placeholder for Endpoint 34 */ };
    const K8_API_ENDPOINT_35 = () => { /* Placeholder for Endpoint 35 */ };
    const K9_API_ENDPOINT_36 = () => { /* Placeholder for Endpoint 36 */ };
    const L1_API_ENDPOINT_37 = () => { /* Placeholder for Endpoint 37 */ };
    const L2_API_ENDPOINT_38 = () => { /* Placeholder for Endpoint 38 */ };
    const L3_API_ENDPOINT_39 = () => { /* Placeholder for Endpoint 39 */ };
    const L4_API_ENDPOINT_40 = () => { /* Placeholder for Endpoint 40 */ };
    const L5_API_ENDPOINT_41 = () => { /* Placeholder for Endpoint 41 */ };
    const L6_API_ENDPOINT_42 = () => { /* Placeholder for Endpoint 42 */ };
    const L7_API_ENDPOINT_43 = () => { /* Placeholder for Endpoint 43 */ };
    const L8_API_ENDPOINT_44 = () => { /* Placeholder for Endpoint 44 */ };
    const L9_API_ENDPOINT_45 = () => { /* Placeholder for Endpoint 45 */ };
    const M1_API_ENDPOINT_46 = () => { /* Placeholder for Endpoint 46 */ };
    const M2_API_ENDPOINT_47 = () => { /* Placeholder for Endpoint 47 */ };
    const M3_API_ENDPOINT_48 = () => { /* Placeholder for Endpoint 48 */ };
    const M4_API_ENDPOINT_49 = () => { /* Placeholder for Endpoint 49 */ };
    const M5_API_ENDPOINT_50 = () => { /* Placeholder for Endpoint 50 */ };
    const M6_API_ENDPOINT_51 = () => { /* Placeholder for Endpoint 51 */ };
    const M7_API_ENDPOINT_52 = () => { /* Placeholder for Endpoint 52 */ };
    const M8_API_ENDPOINT_53 = () => { /* Placeholder for Endpoint 53 */ };
    const M9_API_ENDPOINT_54 = () => { /* Placeholder for Endpoint 54 */ };
    const N1_API_ENDPOINT_55 = () => { /* Placeholder for Endpoint 55 */ };
    const N2_API_ENDPOINT_56 = () => { /* Placeholder for Endpoint 56 */ };
    const N3_API_ENDPOINT_57 = () => { /* Placeholder for Endpoint 57 */ };
    const N4_API_ENDPOINT_58 = () => { /* Placeholder for Endpoint 58 */ };
    const N5_API_ENDPOINT_59 = () => { /* Placeholder for Endpoint 59 */ };
    const N6_API_ENDPOINT_60 = () => { /* Placeholder for Endpoint 60 */ };
    const N7_API_ENDPOINT_61 = () => { /* Placeholder for Endpoint 61 */ };
    const N8_API_ENDPOINT_62 = () => { /* Placeholder for Endpoint 62 */ };
    const N9_API_ENDPOINT_63 = () => { /* Placeholder for Endpoint 63 */ };
    const O1_API_ENDPOINT_64 = () => { /* Placeholder for Endpoint 64 */ };
    const O2_API_ENDPOINT_65 = () => { /* Placeholder for Endpoint 65 */ };
    const O3_API_ENDPOINT_66 = () => { /* Placeholder for Endpoint 66 */ };
    const O4_API_ENDPOINT_67 = () => { /* Placeholder for Endpoint 67 */ };
    const O5_API_ENDPOINT_68 = () => { /* Placeholder for Endpoint 68 */ };
    const O6_API_ENDPOINT_69 = () => { /* Placeholder for Endpoint 69 */ };
    const O7_API_ENDPOINT_70 = () => { /* Placeholder for Endpoint 70 */ };
    const O8_API_ENDPOINT_71 = () => { /* Placeholder for Endpoint 71 */ };
    const O9_API_ENDPOINT_72 = () => { /* Placeholder for Endpoint 72 */ };
    const P1_API_ENDPOINT_73 = () => { /* Placeholder for Endpoint 73 */ };
    const P2_API_ENDPOINT_74 = () => { /* Placeholder for Endpoint 74 */ };
    const P3_API_ENDPOINT_75 = () => { /* Placeholder for Endpoint 75 */ };
    const P4_API_ENDPOINT_76 = () => { /* Placeholder for Endpoint 76 */ };
    const P5_API_ENDPOINT_77 = () => { /* Placeholder for Endpoint 77 */ };
    const P6_API_ENDPOINT_78 = () => { /* Placeholder for Endpoint 78 */ };
    const P7_API_ENDPOINT_79 = () => { /* Placeholder for Endpoint 79 */ };
    const P8_API_ENDPOINT_80 = () => { /* Placeholder for Endpoint 80 */ };
    const P9_API_ENDPOINT_81 = () => { /* Placeholder for Endpoint 81 */ };
    const Q1_API_ENDPOINT_82 = () => { /* Placeholder for Endpoint 82 */ };
    const Q2_API_ENDPOINT_83 = () => { /* Placeholder for Endpoint 83 */ };
    const Q3_API_ENDPOINT_84 = () => { /* Placeholder for Endpoint 84 */ };
    const Q4_API_ENDPOINT_85 = () => { /* Placeholder for Endpoint 85 */ };
    const Q5_API_ENDPOINT_86 = () => { /* Placeholder for Endpoint 86 */ };
    const Q6_API_ENDPOINT_87 = () => { /* Placeholder for Endpoint 87 */ };
    const Q7_API_ENDPOINT_88 = () => { /* Placeholder for Endpoint 88 */ };
    const Q8_API_ENDPOINT_89 = () => { /* Placeholder for Endpoint 89 */ };
    const Q9_API_ENDPOINT_90 = () => { /* Placeholder for Endpoint 90 */ };
    const R1_API_ENDPOINT_91 = () => { /* Placeholder for Endpoint 91 */ };
    const R2_API_ENDPOINT_92 = () => { /* Placeholder for Endpoint 92 */ };
    const R3_API_ENDPOINT_93 = () => { /* Placeholder for Endpoint 93 */ };
    const R4_API_ENDPOINT_94 = () => { /* Placeholder for Endpoint 94 */ };
    const R5_API_ENDPOINT_95 = () => { /* Placeholder for Endpoint 95 */ };
    const R6_API_ENDPOINT_96 = () => { /* Placeholder for Endpoint 96 */ };
    const R7_API_ENDPOINT_97 = () => { /* Placeholder for Endpoint 97 */ };
    const R8_API_ENDPOINT_98 = () => { /* Placeholder for Endpoint 98 */ };
    const R9_API_ENDPOINT_99 = () => { /* Placeholder for Endpoint 99 */ };
    const S1_API_ENDPOINT_100 = () => { /* Placeholder for Endpoint 100 */ };

    const T1_USE_CASE_1 = () => { /* Placeholder for Use Case 1 */ };
    const T2_USE_CASE_2 = () => { /* Placeholder for Use Case 2 */ };
    const T3_USE_CASE_3 = () => { /* Placeholder for Use Case 3 */ };
    const T4_USE_CASE_4 = () => { /* Placeholder for Use Case 4 */ };
    const T5_USE_CASE_5 = () => { /* Placeholder for Use Case 5 */ };
    const T6_USE_CASE_6 = () => { /* Placeholder for Use Case 6 */ };
    const T7_USE_CASE_7 = () => { /* Placeholder for Use Case 7 */ };
    const T8_USE_CASE_8 = () => { /* Placeholder for Use Case 8 */ };
    const T9_USE_CASE_9 = () => { /* Placeholder for Use Case 9 */ };
    const U1_USE_CASE_10 = () => { /* Placeholder for Use Case 10 */ };
    const U2_USE_CASE_11 = () => { /* Placeholder for Use Case 11 */ };
    const U3_USE_CASE_12 = () => { /* Placeholder for Use Case 12 */ };
    const U4_USE_CASE_13 = () => { /* Placeholder for Use Case 13 */ };
    const U5_USE_CASE_14 = () => { /* Placeholder for Use Case 14 */ };
    const U6_USE_CASE_15 = () => { /* Placeholder for Use Case 15 */ };
    const U7_USE_CASE_16 = () => { /* Placeholder for Use Case 16 */ };
    const U8_USE_CASE_17 = () => { /* Placeholder for Use Case 17 */ };
    const U9_USE_CASE_18 = () => { /* Placeholder for Use Case 18 */ };
    const V1_USE_CASE_19 = () => { /* Placeholder for Use Case 19 */ };
    const V2_USE_CASE_20 = () => { /* Placeholder for Use Case 20 */ };
    const V3_USE_CASE_21 = () => { /* Placeholder for Use Case 21 */ };
    const V4_USE_CASE_22 = () => { /* Placeholder for Use Case 22 */ };
    const V5_USE_CASE_23 = () => { /* Placeholder for Use Case 23 */ };
    const V6_USE_CASE_24 = () => { /* Placeholder for Use Case 24

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/TheBookView.tsx
================================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Book, FileText, Search, Mic, Play, Pause, 
  Sparkles, Plus, Terminal, Cpu, ChevronRight, 
  Wifi, ShieldCheck, Database
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// ============================================================================
// 1. CONFIGURATION & TYPES
// ============================================================================

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || ""; 
const SYSTEM_NAME = "ARCHITECT_527";

interface FileNode {
  name: string;
  content: string;
  type: 'file';
  tags: string[];
}

// ============================================================================
// 2. MOCK FILE SYSTEM (Simulating your /book directory)
// ============================================================================
// Since we are in a browser, we simulate reading these files. 
// In a real Node/Next.js app, this would use fs.readFile.

const generateMockFiles = (): FileNode[] => {
  const files: FileNode[] = [];
  
  // Theme content generator for the 527 Protocol
  const getTheme = (i: number) => {
    if (i <= 5) return { title: "Genesis", content: "# Genesis Protocol\n\nThe initial state of the ledger must be absolute. We define the zero-point energy of the system." };
    if (i <= 10) return { title: "Sovereignty", content: "# Sovereign Identity\n\nIdentity is not granted by the state; it is asserted by the cryptographic key pair." };
    if (i <= 20) return { title: "FinOS", content: "# Financial Operating System\n\nLiquidity is the blood; code is the vein. We optimize flow through atomic swaps." };
    if (i <= 30) return { title: "AI_Gov", content: "# Neural Governance\n\nThe AI does not rule; it audits. It is the unblinking eye of the 527 protocol." };
    return { title: "Transition", content: "# The Transition Event\n\nMigration from legacy systems is inevitable. The bridge is being built." };
  };

  // Generate page1.md through page41.md based on your directory
  for (let i = 1; i <= 41; i++) {
    const theme = getTheme(i);
    files.push({
      name: `page${i}.md`,
      type: 'file',
      tags: [theme.title, "Protocol", "Immutable"],
      content: `${theme.content}\n\n## Sector ${i}\n\nAnalysis of node distribution indicates a ${Math.floor(Math.random() * 20) + 80}% efficiency rating. \n\n* System Hash: 0x${Math.random().toString(16).substr(2, 8).toUpperCase()}\n* Timestamp: ${new Date().toISOString()}\n\n### Axiom ${i}\n\nThe architecture defines the reality. We do not observe; we construct.`
    });
  }
  return files;
};

const INITIAL_FILES = generateMockFiles();

// ============================================================================
// 3. MARKDOWN RENDERER (Custom High-Fidelity)
// ============================================================================

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // A simple, robust parser to avoid external dependencies for this demo
  const lines = content.split('\n');
  
  return (
    <div className="space-y-4 font-mono text-sm md:text-base leading-relaxed text-gray-300">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) return <h1 key={idx} className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 border-b border-gray-700 pb-4">{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold text-cyan-300 mt-8 mb-4 flex items-center gap-2"><Cpu size={20}/> {line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={idx} className="text-xl font-semibold text-purple-400 mt-6 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('* ')) return <li key={idx} className="list-none ml-4 flex items-center gap-2 text-emerald-400"><ShieldCheck size={14}/> {line.replace('* ', '')}</li>;
        if (line.trim() === '') return <div key={idx} className="h-2" />;
        return <p key={idx} className="hover:text-white transition-colors duration-300">{line}</p>;
      })}
    </div>
  );
};

// ============================================================================
// 4. MAIN COMPONENT
// ============================================================================

const TheBookView: React.FC = () => {
  // --- STATE ---
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(files[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // --- SPEECH SYNTHESIS STATE ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechPaused, setSpeechPaused] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  // --- FILTERING ---
  const filteredFiles = useMemo(() => {
    return files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [files, searchQuery]);

  // --- AI: TEXT TO SPEECH ---
  const toggleSpeech = () => {
    if (!selectedFile) return;

    if (isSpeaking && !speechPaused) {
      synth.current.pause();
      setSpeechPaused(true);
      return;
    }

    if (isSpeaking && speechPaused) {
      synth.current.resume();
      setSpeechPaused(false);
      return;
    }

    // Start New Speech
    synth.current.cancel(); // Clear queue
    const text = selectedFile.content.replace(/[#*]/g, ''); // Clean markdown syntax
    utterance.current = new SpeechSynthesisUtterance(text);
    
    // Select a "Tech" voice if available
    const voices = synth.current.getVoices();
    const techVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (techVoice) utterance.current.voice = techVoice;
    
    utterance.current.rate = 1.1; // Slightly faster for "Data Stream" feel
    utterance.current.pitch = 0.9; // Lower pitch for authority

    utterance.current.onend = () => {
      setIsSpeaking(false);
      setSpeechPaused(false);
    };

    synth.current.speak(utterance.current);
    setIsSpeaking(true);
    setSpeechPaused(false);
  };

  // Stop speech if switching files
  useEffect(() => {
    synth.current.cancel();
    setIsSpeaking(false);
    setSpeechPaused(false);
  }, [selectedFile]);

  // --- AI: GENERATION (Google Gemini) ---
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);

    try {
      let content = "";
      
      if (GEMINI_API_KEY) {
        // Real Generation
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`
          Context: You are writing a page for 'The 527 Protocol', a futuristic financial sovereign manifesto.
          Style: Technical, philosophical, authoritative, cyberpunk.
          Task: Write a markdown page about: ${aiPrompt}
        `);
        content = result.response.text();
      } else {
        // Simulated Generation (Fallback)
        await new Promise(r => setTimeout(r, 2000));
        content = `# Generated Protocol: ${aiPrompt}\n\n## AI Analysis\n\nThe neural lattice has constructed a new paradigm based on your request. We observe that ${aiPrompt} is critical to the consensus mechanism.\n\n### Execution\n* Initializing smart contracts...\n* Verifying sovereign identity...\n* content generated successfully.`;
      }

      const newFileName = `page${files.length + 1}.md`;
      const newFile: FileNode = {
        name: newFileName,
        type: 'file',
        tags: ["AI_Generated", "New_Protocol"],
        content: content
      };

      setFiles(prev => [...prev, newFile]);
      setSelectedFile(newFile);
      setAiPrompt('');
    } catch (e) {
      console.error("AI Generation Failed", e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // ==========================================================================
  // VIEW
  // ==========================================================================
  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- LEFT SIDEBAR: THE DATA MESH --- */}
      <div className="w-80 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Database size={20} />
            <h1 className="font-bold tracking-widest text-sm">ARCHIVE_527</h1>
          </div>
          <div className="text-[10px] text-gray-500 font-mono">/root/book/verified_ledger</div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Protocol..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-gray-300 placeholder-gray-600"
            />
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 p-2 space-y-1">
          {filteredFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 group border border-transparent ${
                selectedFile?.name === file.name 
                ? "bg-cyan-950/30 border-cyan-500/50 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                : "hover:bg-gray-800 hover:border-gray-700 text-gray-400"
              }`}
            >
              <FileText size={16} className={selectedFile?.name === file.name ? "text-cyan-400" : "text-gray-600 group-hover:text-gray-400"} />
              <div className="flex-1 truncate font-mono text-sm">
                {file.name}
              </div>
              {selectedFile?.name === file.name && <ChevronRight size={14} className="text-cyan-500 animate-pulse" />}
            </button>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="p-3 border-t border-gray-800 bg-gray-950 text-[10px] text-gray-500 font-mono flex justify-between">
          <span>FILES: {files.length}</span>
          <span>SIZE: {(files.length * 1.2).toFixed(2)} MB</span>
        </div>
      </div>

      {/* --- MAIN CONTENT: THE READER --- */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-950 to-[#05050a]">
        
        {/* Toolbar */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/30 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 bg-cyan-900/20 border border-cyan-500/30 rounded text-cyan-400 text-xs font-mono">
              READ_ONLY
            </div>
            <span className="text-gray-400 text-sm font-mono">{selectedFile?.name}</span>
          </div>

          <div className="flex items-center gap-2">
             {/* TTS Button */}
            <button 
              onClick={toggleSpeech}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                isSpeaking 
                  ? "bg-purple-600/20 border-purple-500 text-purple-300 animate-pulse" 
                  : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300"
              }`}
            >
              {isSpeaking && !speechPaused ? <Pause size={14} /> : <Play size={14} />}
              {isSpeaking ? (speechPaused ? "Resume Audio" : "Broadcasting") : "Read Aloud"}
              {isSpeaking && !speechPaused && <Wifi size={14} className="animate-ping" />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-thin scrollbar-thumb-cyan-900/50">
          <div className="max-w-4xl mx-auto bg-gray-900/20 border border-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm min-h-[600px]">
             {selectedFile ? (
               <MarkdownRenderer content={selectedFile.content} />
             ) : (
               <div className="flex items-center justify-center h-full text-gray-600">
                 Select a protocol file to initiate decryption...
               </div>
             )}
          </div>
        </div>

        {/* --- AI GENERATOR: THE CREATOR --- */}
        <div className="border-t border-gray-800 bg-gray-900/80 p-4 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto flex gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Terminal size={16} className="text-purple-500" />
              </div>
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Command the AI to write a new protocol page..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-gray-950 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm transition-all shadow-inner"
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              />
              {isAiGenerating && (
                 <div className="absolute right-3 top-3.5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-150"></span>
                 </div>
              )}
            </div>
            
            <button 
              onClick={handleAiGenerate}
              disabled={isAiGenerating || !aiPrompt}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-purple-900/30 flex items-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              <Sparkles size={18} />
              <span>Generate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TheBookView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/TheBookView (1).tsx
================================================================================


import React, { useState, useMemo } from 'react';
import Card from './Card';
import { Book, ChevronRight, FileText, List, Search, ArrowLeft } from 'lucide-react';

// --- DATA STRUCTURE FOR THE 527 PAGES ---
// This acts as the "database" for the book content.
// In a real app, this would be fetched from a markdown folder or CMS.
// We generate a massive structure here to simulate the depth required.

interface Chapter {
    id: string;
    title: string;
    pages: Page[];
}

interface Page {
    id: string;
    title: string;
    content: string;
}

const generateBookContent = (): Chapter[] => {
    const parts = [
        "I. The Vision",
        "II. High-Level Architecture",
        "III. Asset Domains Encyclopaedia",
        "IV. Banking & Integration",
        "V. Intelligence Systems",
        "VI. Component Library",
        "VII. Operational Playbooks",
        "VIII. Developer Appendix"
    ];

    let pageCounter = 1;
    const chapters: Chapter[] = [];

    parts.forEach((partTitle, partIndex) => {
        // Generate chapters for each part
        const chapterCount = partIndex === 2 ? 20 : 5; // Make Asset Domains huge
        
        for (let i = 1; i <= chapterCount; i++) {
            const chapterId = `part${partIndex + 1}-chap${i}`;
            const chapterTitle = `${partTitle} - Chapter ${i}: The ${partIndex === 2 ? 'Asset' : 'Protocol'} of ${Math.random().toString(36).substring(7)}`;
            
            const pages: Page[] = [];
            // Generate pages for each chapter
            const pageCount = partIndex === 5 ? 10 : 5; // Component library has many pages
            
            for (let j = 1; j <= pageCount; j++) {
                pages.push({
                    id: `page-${pageCounter}`,
                    title: `Page ${pageCounter}: Section ${j} of ${chapterTitle}`,
                    content: `
                        ### ${chapterTitle}
                        **Subsection ${j}.0 - Core Principles**

                        The Infinite Intelligence Foundation dictates that information flow must be unhindered yet verified. 
                        In this section, we explore the specific mechanics of ${partIndex === 2 ? 'asset tokenization' : 'system architecture'}.
                        
                        *   **Principle A:** Absolute Truth. The ledger cannot lie.
                        *   **Principle B:** Infinite Scalability. The system grows with the network.
                        *   **Principle C:** Benevolent Oversight. The AI ensures compliance and ethical alignment.

                        This protocol serves as the binding agent for the entire ecosystem. 
                        By adhering to these standards, we ensure that the Foundation remains a beacon of stability in a chaotic financial world.

                        *Ref: Protocol Standard 527.${pageCounter}.${j}*
                    `
                });
                pageCounter++;
            }

            chapters.push({
                id: chapterId,
                title: chapterTitle,
                pages: pages
            });
        }
    });

    return chapters;
};

const BOOK_DATA = generateBookContent();

const TheBookView: React.FC = () => {
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChapters = useMemo(() => {
        if (!searchQuery) return BOOK_DATA;
        return BOOK_DATA.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.pages.some(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const handleChapterClick = (chapter: Chapter) => {
        setSelectedChapter(chapter);
        setSelectedPage(chapter.pages[0]);
    };

    const handlePageClick = (page: Page) => {
        setSelectedPage(page);
    };

    const handleBackToToC = () => {
        setSelectedChapter(null);
        setSelectedPage(null);
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <header className="flex items-center justify-between border-b border-gray-700 pb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
                        <Book className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">The 527 Protocol</h1>
                        <p className="text-gray-400 text-sm">The Living Blueprint of the Infinite Intelligence Foundation.</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search the Protocol..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none w-64 focus:w-80 transition-all"
                    />
                </div>
            </header>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar / Table of Contents */}
                <Card className="lg:col-span-1 bg-gray-900/80 border-indigo-500/30 flex flex-col overflow-hidden p-0">
                    <div className="p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10 flex items-center gap-2">
                        <List className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-gray-200 text-sm">Table of Contents</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {selectedChapter ? (
                            <div className="space-y-1">
                                <button onClick={handleBackToToC} className="w-full text-left px-3 py-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-2">
                                    <ArrowLeft size={12} /> Back to Chapters
                                </button>
                                <div className="px-3 py-2 text-xs font-bold text-white bg-gray-800 rounded">{selectedChapter.title}</div>
                                {selectedChapter.pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => handlePageClick(page)}
                                        className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center gap-2 ${
                                            selectedPage?.id === page.id 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedPage?.id === page.id ? 'bg-white' : 'bg-gray-600'}`}></div>
                                        {page.title}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredChapters.map(chapter => (
                                    <button
                                        key={chapter.id}
                                        onClick={() => handleChapterClick(chapter)}
                                        className="w-full text-left px-3 py-3 rounded hover:bg-gray-800 transition-colors flex items-center justify-between group border-b border-gray-800/50 last:border-0"
                                    >
                                        <span className="text-sm text-gray-300 group-hover:text-white font-medium line-clamp-1">{chapter.title}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Reader View */}
                <Card className="lg:col-span-3 bg-gray-900/80 border-indigo-500/30 flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Book size={200} />
                    </div>
                    
                    {selectedPage ? (
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-6 pb-4 border-b border-gray-800">
                                    <h2 className="text-2xl font-bold text-white">{selectedPage.title}</h2>
                                    <p className="text-xs text-indigo-400 font-mono mt-2">ID: {selectedPage.id} | VER: 5.2.7</p>
                                </div>
                                <div className="prose prose-invert prose-lg text-gray-300 leading-relaxed whitespace-pre-line">
                                    {selectedPage.content}
                                </div>
                                <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between text-sm text-gray-500">
                                    <span>Infinite Intelligence Foundation</span>
                                    <span>Page {selectedPage.id.split('-')[1]} of 527</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Book size={40} className="text-indigo-500/50" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-300 mb-2">Select a Chapter</h3>
                            <p className="max-w-md">The Protocol contains 527 pages of operational doctrine. Select a chapter from the sidebar to begin your study.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default TheBookView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/TheBookView.tsx
================================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Book, FileText, Search, Mic, Play, Pause, 
  Sparkles, Plus, Terminal, Cpu, ChevronRight, 
  Wifi, ShieldCheck, Database
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// ============================================================================
// 1. CONFIGURATION & TYPES
// ============================================================================

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || ""; 
const SYSTEM_NAME = "ARCHITECT_527";

interface FileNode {
  name: string;
  content: string;
  type: 'file';
  tags: string[];
}

// ============================================================================
// 2. MOCK FILE SYSTEM (Simulating your /book directory)
// ============================================================================
// Since we are in a browser, we simulate reading these files. 
// In a real Node/Next.js app, this would use fs.readFile.

const generateMockFiles = (): FileNode[] => {
  const files: FileNode[] = [];
  
  // Theme content generator for the 527 Protocol
  const getTheme = (i: number) => {
    if (i <= 5) return { title: "Genesis", content: "# Genesis Protocol\n\nThe initial state of the ledger must be absolute. We define the zero-point energy of the system." };
    if (i <= 10) return { title: "Sovereignty", content: "# Sovereign Identity\n\nIdentity is not granted by the state; it is asserted by the cryptographic key pair." };
    if (i <= 20) return { title: "FinOS", content: "# Financial Operating System\n\nLiquidity is the blood; code is the vein. We optimize flow through atomic swaps." };
    if (i <= 30) return { title: "AI_Gov", content: "# Neural Governance\n\nThe AI does not rule; it audits. It is the unblinking eye of the 527 protocol." };
    return { title: "Transition", content: "# The Transition Event\n\nMigration from legacy systems is inevitable. The bridge is being built." };
  };

  // Generate page1.md through page41.md based on your directory
  for (let i = 1; i <= 41; i++) {
    const theme = getTheme(i);
    files.push({
      name: `page${i}.md`,
      type: 'file',
      tags: [theme.title, "Protocol", "Immutable"],
      content: `${theme.content}\n\n## Sector ${i}\n\nAnalysis of node distribution indicates a ${Math.floor(Math.random() * 20) + 80}% efficiency rating. \n\n* System Hash: 0x${Math.random().toString(16).substr(2, 8).toUpperCase()}\n* Timestamp: ${new Date().toISOString()}\n\n### Axiom ${i}\n\nThe architecture defines the reality. We do not observe; we construct.`
    });
  }
  return files;
};

const INITIAL_FILES = generateMockFiles();

// ============================================================================
// 3. MARKDOWN RENDERER (Custom High-Fidelity)
// ============================================================================

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // A simple, robust parser to avoid external dependencies for this demo
  const lines = content.split('\n');
  
  return (
    <div className="space-y-4 font-mono text-sm md:text-base leading-relaxed text-gray-300">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) return <h1 key={idx} className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 border-b border-gray-700 pb-4">{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold text-cyan-300 mt-8 mb-4 flex items-center gap-2"><Cpu size={20}/> {line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={idx} className="text-xl font-semibold text-purple-400 mt-6 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('* ')) return <li key={idx} className="list-none ml-4 flex items-center gap-2 text-emerald-400"><ShieldCheck size={14}/> {line.replace('* ', '')}</li>;
        if (line.trim() === '') return <div key={idx} className="h-2" />;
        return <p key={idx} className="hover:text-white transition-colors duration-300">{line}</p>;
      })}
    </div>
  );
};

// ============================================================================
// 4. MAIN COMPONENT
// ============================================================================

const TheBookView: React.FC = () => {
  // --- STATE ---
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(files[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // --- SPEECH SYNTHESIS STATE ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechPaused, setSpeechPaused] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  // --- FILTERING ---
  const filteredFiles = useMemo(() => {
    return files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [files, searchQuery]);

  // --- AI: TEXT TO SPEECH ---
  const toggleSpeech = () => {
    if (!selectedFile) return;

    if (isSpeaking && !speechPaused) {
      synth.current.pause();
      setSpeechPaused(true);
      return;
    }

    if (isSpeaking && speechPaused) {
      synth.current.resume();
      setSpeechPaused(false);
      return;
    }

    // Start New Speech
    synth.current.cancel(); // Clear queue
    const text = selectedFile.content.replace(/[#*]/g, ''); // Clean markdown syntax
    utterance.current = new SpeechSynthesisUtterance(text);
    
    // Select a "Tech" voice if available
    const voices = synth.current.getVoices();
    const techVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (techVoice) utterance.current.voice = techVoice;
    
    utterance.current.rate = 1.1; // Slightly faster for "Data Stream" feel
    utterance.current.pitch = 0.9; // Lower pitch for authority

    utterance.current.onend = () => {
      setIsSpeaking(false);
      setSpeechPaused(false);
    };

    synth.current.speak(utterance.current);
    setIsSpeaking(true);
    setSpeechPaused(false);
  };

  // Stop speech if switching files
  useEffect(() => {
    synth.current.cancel();
    setIsSpeaking(false);
    setSpeechPaused(false);
  }, [selectedFile]);

  // --- AI: GENERATION (Google Gemini) ---
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);

    try {
      let content = "";
      
      if (GEMINI_API_KEY) {
        // Real Generation
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`
          Context: You are writing a page for 'The 527 Protocol', a futuristic financial sovereign manifesto.
          Style: Technical, philosophical, authoritative, cyberpunk.
          Task: Write a markdown page about: ${aiPrompt}
        `);
        content = result.response.text();
      } else {
        // Simulated Generation (Fallback)
        await new Promise(r => setTimeout(r, 2000));
        content = `# Generated Protocol: ${aiPrompt}\n\n## AI Analysis\n\nThe neural lattice has constructed a new paradigm based on your request. We observe that ${aiPrompt} is critical to the consensus mechanism.\n\n### Execution\n* Initializing smart contracts...\n* Verifying sovereign identity...\n* content generated successfully.`;
      }

      const newFileName = `page${files.length + 1}.md`;
      const newFile: FileNode = {
        name: newFileName,
        type: 'file',
        tags: ["AI_Generated", "New_Protocol"],
        content: content
      };

      setFiles(prev => [...prev, newFile]);
      setSelectedFile(newFile);
      setAiPrompt('');
    } catch (e) {
      console.error("AI Generation Failed", e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // ==========================================================================
  // VIEW
  // ==========================================================================
  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- LEFT SIDEBAR: THE DATA MESH --- */}
      <div className="w-80 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Database size={20} />
            <h1 className="font-bold tracking-widest text-sm">ARCHIVE_527</h1>
          </div>
          <div className="text-[10px] text-gray-500 font-mono">/root/book/verified_ledger</div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Protocol..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-gray-300 placeholder-gray-600"
            />
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 p-2 space-y-1">
          {filteredFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 group border border-transparent ${
                selectedFile?.name === file.name 
                ? "bg-cyan-950/30 border-cyan-500/50 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                : "hover:bg-gray-800 hover:border-gray-700 text-gray-400"
              }`}
            >
              <FileText size={16} className={selectedFile?.name === file.name ? "text-cyan-400" : "text-gray-600 group-hover:text-gray-400"} />
              <div className="flex-1 truncate font-mono text-sm">
                {file.name}
              </div>
              {selectedFile?.name === file.name && <ChevronRight size={14} className="text-cyan-500 animate-pulse" />}
            </button>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="p-3 border-t border-gray-800 bg-gray-950 text-[10px] text-gray-500 font-mono flex justify-between">
          <span>FILES: {files.length}</span>
          <span>SIZE: {(files.length * 1.2).toFixed(2)} MB</span>
        </div>
      </div>

      {/* --- MAIN CONTENT: THE READER --- */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-950 to-[#05050a]">
        
        {/* Toolbar */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/30 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 bg-cyan-900/20 border border-cyan-500/30 rounded text-cyan-400 text-xs font-mono">
              READ_ONLY
            </div>
            <span className="text-gray-400 text-sm font-mono">{selectedFile?.name}</span>
          </div>

          <div className="flex items-center gap-2">
             {/* TTS Button */}
            <button 
              onClick={toggleSpeech}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                isSpeaking 
                  ? "bg-purple-600/20 border-purple-500 text-purple-300 animate-pulse" 
                  : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300"
              }`}
            >
              {isSpeaking && !speechPaused ? <Pause size={14} /> : <Play size={14} />}
              {isSpeaking ? (speechPaused ? "Resume Audio" : "Broadcasting") : "Read Aloud"}
              {isSpeaking && !speechPaused && <Wifi size={14} className="animate-ping" />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-thin scrollbar-thumb-cyan-900/50">
          <div className="max-w-4xl mx-auto bg-gray-900/20 border border-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm min-h-[600px]">
             {selectedFile ? (
               <MarkdownRenderer content={selectedFile.content} />
             ) : (
               <div className="flex items-center justify-center h-full text-gray-600">
                 Select a protocol file to initiate decryption...
               </div>
             )}
          </div>
        </div>

        {/* --- AI GENERATOR: THE CREATOR --- */}
        <div className="border-t border-gray-800 bg-gray-900/80 p-4 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto flex gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Terminal size={16} className="text-purple-500" />
              </div>
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Command the AI to write a new protocol page..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-gray-950 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm transition-all shadow-inner"
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              />
              {isAiGenerating && (
                 <div className="absolute right-3 top-3.5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-150"></span>
                 </div>
              )}
            </div>
            
            <button 
              onClick={handleAiGenerate}
              disabled={isAiGenerating || !aiPrompt}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-purple-900/30 flex items-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              <Sparkles size={18} />
              <span>Generate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TheBookView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/TheBookView_1.tsx
================================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Book, FileText, Search, Mic, Play, Pause, 
  Sparkles, Plus, Terminal, Cpu, ChevronRight, 
  Wifi, ShieldCheck, Database
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// ============================================================================
// 1. CONFIGURATION & TYPES
// ============================================================================

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || ""; 
const SYSTEM_NAME = "ARCHITECT_527";

interface FileNode {
  name: string;
  content: string;
  type: 'file';
  tags: string[];
}

// ============================================================================
// 2. MOCK FILE SYSTEM (Simulating your /book directory)
// ============================================================================
// Since we are in a browser, we simulate reading these files. 
// In a real Node/Next.js app, this would use fs.readFile.

const generateMockFiles = (): FileNode[] => {
  const files: FileNode[] = [];
  
  // Theme content generator for the 527 Protocol
  const getTheme = (i: number) => {
    if (i <= 5) return { title: "Genesis", content: "# Genesis Protocol\n\nThe initial state of the ledger must be absolute. We define the zero-point energy of the system." };
    if (i <= 10) return { title: "Sovereignty", content: "# Sovereign Identity\n\nIdentity is not granted by the state; it is asserted by the cryptographic key pair." };
    if (i <= 20) return { title: "FinOS", content: "# Financial Operating System\n\nLiquidity is the blood; code is the vein. We optimize flow through atomic swaps." };
    if (i <= 30) return { title: "AI_Gov", content: "# Neural Governance\n\nThe AI does not rule; it audits. It is the unblinking eye of the 527 protocol." };
    return { title: "Transition", content: "# The Transition Event\n\nMigration from legacy systems is inevitable. The bridge is being built." };
  };

  // Generate page1.md through page41.md based on your directory
  for (let i = 1; i <= 41; i++) {
    const theme = getTheme(i);
    files.push({
      name: `page${i}.md`,
      type: 'file',
      tags: [theme.title, "Protocol", "Immutable"],
      content: `${theme.content}\n\n## Sector ${i}\n\nAnalysis of node distribution indicates a ${Math.floor(Math.random() * 20) + 80}% efficiency rating. \n\n* System Hash: 0x${Math.random().toString(16).substr(2, 8).toUpperCase()}\n* Timestamp: ${new Date().toISOString()}\n\n### Axiom ${i}\n\nThe architecture defines the reality. We do not observe; we construct.`
    });
  }
  return files;
};

const INITIAL_FILES = generateMockFiles();

// ============================================================================
// 3. MARKDOWN RENDERER (Custom High-Fidelity)
// ============================================================================

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // A simple, robust parser to avoid external dependencies for this demo
  const lines = content.split('\n');
  
  return (
    <div className="space-y-4 font-mono text-sm md:text-base leading-relaxed text-gray-300">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) return <h1 key={idx} className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 border-b border-gray-700 pb-4">{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold text-cyan-300 mt-8 mb-4 flex items-center gap-2"><Cpu size={20}/> {line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={idx} className="text-xl font-semibold text-purple-400 mt-6 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('* ')) return <li key={idx} className="list-none ml-4 flex items-center gap-2 text-emerald-400"><ShieldCheck size={14}/> {line.replace('* ', '')}</li>;
        if (line.trim() === '') return <div key={idx} className="h-2" />;
        return <p key={idx} className="hover:text-white transition-colors duration-300">{line}</p>;
      })}
    </div>
  );
};

// ============================================================================
// 4. MAIN COMPONENT
// ============================================================================

const TheBookView: React.FC = () => {
  // --- STATE ---
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(files[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // --- SPEECH SYNTHESIS STATE ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechPaused, setSpeechPaused] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  // --- FILTERING ---
  const filteredFiles = useMemo(() => {
    return files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [files, searchQuery]);

  // --- AI: TEXT TO SPEECH ---
  const toggleSpeech = () => {
    if (!selectedFile) return;

    if (isSpeaking && !speechPaused) {
      synth.current.pause();
      setSpeechPaused(true);
      return;
    }

    if (isSpeaking && speechPaused) {
      synth.current.resume();
      setSpeechPaused(false);
      return;
    }

    // Start New Speech
    synth.current.cancel(); // Clear queue
    const text = selectedFile.content.replace(/[#*]/g, ''); // Clean markdown syntax
    utterance.current = new SpeechSynthesisUtterance(text);
    
    // Select a "Tech" voice if available
    const voices = synth.current.getVoices();
    const techVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (techVoice) utterance.current.voice = techVoice;
    
    utterance.current.rate = 1.1; // Slightly faster for "Data Stream" feel
    utterance.current.pitch = 0.9; // Lower pitch for authority

    utterance.current.onend = () => {
      setIsSpeaking(false);
      setSpeechPaused(false);
    };

    synth.current.speak(utterance.current);
    setIsSpeaking(true);
    setSpeechPaused(false);
  };

  // Stop speech if switching files
  useEffect(() => {
    synth.current.cancel();
    setIsSpeaking(false);
    setSpeechPaused(false);
  }, [selectedFile]);

  // --- AI: GENERATION (Google Gemini) ---
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);

    try {
      let content = "";
      
      if (GEMINI_API_KEY) {
        // Real Generation
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`
          Context: You are writing a page for 'The 527 Protocol', a futuristic financial sovereign manifesto.
          Style: Technical, philosophical, authoritative, cyberpunk.
          Task: Write a markdown page about: ${aiPrompt}
        `);
        content = result.response.text();
      } else {
        // Simulated Generation (Fallback)
        await new Promise(r => setTimeout(r, 2000));
        content = `# Generated Protocol: ${aiPrompt}\n\n## AI Analysis\n\nThe neural lattice has constructed a new paradigm based on your request. We observe that ${aiPrompt} is critical to the consensus mechanism.\n\n### Execution\n* Initializing smart contracts...\n* Verifying sovereign identity...\n* content generated successfully.`;
      }

      const newFileName = `page${files.length + 1}.md`;
      const newFile: FileNode = {
        name: newFileName,
        type: 'file',
        tags: ["AI_Generated", "New_Protocol"],
        content: content
      };

      setFiles(prev => [...prev, newFile]);
      setSelectedFile(newFile);
      setAiPrompt('');
    } catch (e) {
      console.error("AI Generation Failed", e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // ==========================================================================
  // VIEW
  // ==========================================================================
  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- LEFT SIDEBAR: THE DATA MESH --- */}
      <div className="w-80 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Database size={20} />
            <h1 className="font-bold tracking-widest text-sm">ARCHIVE_527</h1>
          </div>
          <div className="text-[10px] text-gray-500 font-mono">/root/book/verified_ledger</div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Protocol..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-gray-300 placeholder-gray-600"
            />
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 p-2 space-y-1">
          {filteredFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 group border border-transparent ${
                selectedFile?.name === file.name 
                ? "bg-cyan-950/30 border-cyan-500/50 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                : "hover:bg-gray-800 hover:border-gray-700 text-gray-400"
              }`}
            >
              <FileText size={16} className={selectedFile?.name === file.name ? "text-cyan-400" : "text-gray-600 group-hover:text-gray-400"} />
              <div className="flex-1 truncate font-mono text-sm">
                {file.name}
              </div>
              {selectedFile?.name === file.name && <ChevronRight size={14} className="text-cyan-500 animate-pulse" />}
            </button>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="p-3 border-t border-gray-800 bg-gray-950 text-[10px] text-gray-500 font-mono flex justify-between">
          <span>FILES: {files.length}</span>
          <span>SIZE: {(files.length * 1.2).toFixed(2)} MB</span>
        </div>
      </div>

      {/* --- MAIN CONTENT: THE READER --- */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-950 to-[#05050a]">
        
        {/* Toolbar */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/30 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 bg-cyan-900/20 border border-cyan-500/30 rounded text-cyan-400 text-xs font-mono">
              READ_ONLY
            </div>
            <span className="text-gray-400 text-sm font-mono">{selectedFile?.name}</span>
          </div>

          <div className="flex items-center gap-2">
             {/* TTS Button */}
            <button 
              onClick={toggleSpeech}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                isSpeaking 
                  ? "bg-purple-600/20 border-purple-500 text-purple-300 animate-pulse" 
                  : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300"
              }`}
            >
              {isSpeaking && !speechPaused ? <Pause size={14} /> : <Play size={14} />}
              {isSpeaking ? (speechPaused ? "Resume Audio" : "Broadcasting") : "Read Aloud"}
              {isSpeaking && !speechPaused && <Wifi size={14} className="animate-ping" />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-thin scrollbar-thumb-cyan-900/50">
          <div className="max-w-4xl mx-auto bg-gray-900/20 border border-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm min-h-[600px]">
             {selectedFile ? (
               <MarkdownRenderer content={selectedFile.content} />
             ) : (
               <div className="flex items-center justify-center h-full text-gray-600">
                 Select a protocol file to initiate decryption...
               </div>
             )}
          </div>
        </div>

        {/* --- AI GENERATOR: THE CREATOR --- */}
        <div className="border-t border-gray-800 bg-gray-900/80 p-4 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto flex gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Terminal size={16} className="text-purple-500" />
              </div>
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Command the AI to write a new protocol page..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-gray-950 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm transition-all shadow-inner"
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              />
              {isAiGenerating && (
                 <div className="absolute right-3 top-3.5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-150"></span>
                 </div>
              )}
            </div>
            
            <button 
              onClick={handleAiGenerate}
              disabled={isAiGenerating || !aiPrompt}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-purple-900/30 flex items-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              <Sparkles size={18} />
              <span>Generate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TheBookView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/TheBookView.tsx
================================================================================

```typescript
import React, { useState, useMemo } from 'react';
import Card from './Card';
import { Book, ChevronRight, FileText, List, Search, ArrowLeft } from 'lucide-react';

// --- DATA STRUCTURE FOR THE 527 PAGES ---
// This acts as the "database" for the book content.
// In a real app, this would be fetched from a markdown folder or CMS.
// We generate a massive structure here to simulate the depth required.

// --- JAMES BURVEL O’CALLAGHAN III CODE: THE 527 PROTOCOL ---
// --- DEFINITION: THE BOOK VIEW COMPONENT ---
// --- ARCHITECTURE: PROCEDURAL, INDEXED, SELF-REFERENTIAL, UI-HEAVY, AND UNAPOLOGETICALLY COMPLEX ---
// --- VERSION: 5.2.7 ---

// A1: Interface Definition for Chapter (James Burvel O’Callaghan III Code)
interface A1_Chapter {
    id: string; // A2
    title: string; // A3
    pages: A4_Page[]; // A4
}

// A4: Interface Definition for Page (James Burvel O’Callaghan III Code)
interface A4_Page {
    id: string; // A5
    title: string; // A6
    content: string; // A7
}

// B1: Function to generate thematic titles based on part and index (James Burvel O’Callaghan III Code)
const B1_getThematicTitle = (part: string, index: number): string => {
    const B2_titles: Record<string, string[]> = {
        "Genesis": ["The Primordial Ledger - Genesis 1.1", "Axiom of Origin - Genesis 1.2", "The First Block - Genesis 1.3", "Cryptographic Dawn - Genesis 1.4", "Immutable Foundations - Genesis 1.5", "The Zero State - Genesis 1.6", "Consensus Genesis - Genesis 1.7", "The Seed Phrase - Genesis 1.8", "Digital Ontology - Genesis 1.9", "The Void - Genesis 1.10", "The Genesis Block - Genesis 1.11", "Primordial Data - Genesis 1.12", "Initial State - Genesis 1.13", "The Genesis Protocol - Genesis 1.14", "Pre-State - Genesis 1.15", "The First Transaction - Genesis 1.16", "Origin of Keys - Genesis 1.17", "Genesis Chain - Genesis 1.18", "The First Proof - Genesis 1.19", "Unverified State - Genesis 1.20"],
        "Sovereignty": ["Self-Sovereign Identity - Sovereignty 2.1", "The Legal Wrapper - Sovereignty 2.2", "Jurisdiction of Code - Sovereignty 2.3", "The Smart Contract Constitution - Sovereignty 2.4", "Decentralized Rights - Sovereignty 2.5", "The Governance Token - Sovereignty 2.6", "Autonomy Protocols - Sovereignty 2.7", "The Citizen Node - Sovereignty 2.8", "Borderless State - Sovereignty 2.9", "The Private Key - Sovereignty 2.10", "Digital Identity - Sovereignty 2.11", "Rights Management - Sovereignty 2.12", "Code of Conduct - Sovereignty 2.13", "Sovereign Nodes - Sovereignty 2.14", "Identity Protocols - Sovereignty 2.15", "The Sovereign Ledger - Sovereignty 2.16", "Personal Data Vault - Sovereignty 2.17", "Authorization Chains - Sovereignty 2.18", "User Sovereignty - Sovereignty 2.19", "The Self - Sovereignty 2.20"],
        "FinOS": ["The Operating System - FinOS 3.1", "Liquidity Engines - FinOS 3.2", "The Transaction Layer - FinOS 3.3", "Atomic Swaps - FinOS 3.4", "The Clearing House - FinOS 3.5", "Fiscal Kernels - FinOS 3.6", "The API Gateway - FinOS 3.7", "Ledger Synchronization - FinOS 3.8", "The Treasury Module - FinOS 3.9", "Economic Runtime - FinOS 3.10", "Financial Primitives - FinOS 3.11", "Automated Market Makers - FinOS 3.12", "Decentralized Exchanges - FinOS 3.13", "Yield Farming - FinOS 3.14", "Loan Protocols - FinOS 3.15", "Derivatives Markets - FinOS 3.16", "Stablecoin Mechanics - FinOS 3.17", "Risk Management - FinOS 3.18", "Security Audits - FinOS 3.19", "The FinOS Ecosystem - FinOS 3.20"],
        "AI": ["Neural Governance - AI 4.1", "The Silicon Cortex - AI 4.2", "Predictive Enforcement - AI 4.3", "Algorithmic Justice - AI 4.4", "The Oracle Network - AI 4.5", "Machine Consensus - AI 4.6", "Automated Compliance - AI 4.7", "The Cognitive Layer - AI 4.8", "Deep Learning Audits - AI 4.9", "The Sentinel - AI 4.10", "Artificial General Intelligence - AI 4.11", "Machine Ethics - AI 4.12", "Bias Mitigation - AI 4.13", "Model Training - AI 4.14", "Data Governance - AI 4.15", "AI Security - AI 4.16", "Explainable AI - AI 4.17", "AI Alignment - AI 4.18", "The AI Framework - AI 4.19", "Autonomous Systems - AI 4.20"],
        "GEIN": ["Global Economic Intelligence Network - GEIN 5.1", "The Data Mesh - GEIN 5.2", "Interoperability Bridges - GEIN 5.3", "The Signal Layer - GEIN 5.4", "Network Topography - GEIN 5.5", "The Information Bus - GEIN 5.6", "Latency Elimination - GEIN 5.7", "The Global Graph - GEIN 5.8", "Node Distribution - GEIN 5.9", "The Pulse - GEIN 5.10", "Economic Indicators - GEIN 5.11", "Market Sentiment Analysis - GEIN 5.12", "Supply Chain Optimization - GEIN 5.13", "Risk Forecasting - GEIN 5.14", "Predictive Analytics - GEIN 5.15", "Geopolitical Analysis - GEIN 5.16", "Trade Route Optimization - GEIN 5.17", "Resource Allocation - GEIN 5.18", "Economic Simulations - GEIN 5.19", "The GEIN Architecture - GEIN 5.20"],
        "Assets": ["Tokenized Real Estate - Assets 6.1", "Digital Commodities - Assets 6.2", "The Stablecoin Standard - Assets 6.3", "Synthetic Derivatives - Assets 6.4", "The NFT Registry - Assets 6.5", "Fractional Ownership - Assets 6.6", "The Asset Vault - Assets 6.7", "Liquidity Pools - Assets 6.8", "The Exchange Mechanism - Assets 6.9", "Value Pegs - Assets 6.10", "Token Standards - Assets 6.11", "Asset Backing - Assets 6.12", "Regulatory Compliance - Assets 6.13", "Securities Tokenization - Assets 6.14", "Asset Management - Assets 6.15", "Portfolio Diversification - Assets 6.16", "Decentralized Finance - Assets 6.17", "Insurance Protocols - Assets 6.18", "The Asset Lifecycle - Assets 6.19", "The Token Economy - Assets 6.20"],
        "Transition": ["The Migration Path - Transition 7.1", "Legacy Deprecation - Transition 7.2", "The Bridge Event - Transition 7.3", "The New Era - Transition 7.4", "Final Settlement - Transition 7.5", "The Handover - Transition 7.6", "System Activation - Transition 7.7", "The Omega Block - Transition 7.8", "The Horizon - Transition 7.9", "The Infinite Loop - Transition 7.10", "Protocol Upgrade - Transition 7.11", "Data Migration - Transition 7.12", "Governance Transition - Transition 7.13", "Smart Contract Deployment - Transition 7.14", "User Onboarding - Transition 7.15", "Developer Ecosystem - Transition 7.16", "Community Building - Transition 7.17", "Ecosystem Launch - Transition 7.18", "Future Roadmap - Transition 7.19", "The Transition Protocol - Transition 7.20"]
    };

    const B3_list = B2_titles[part] || ["Unknown Protocol - 0.0"];
    return B3_list[index % B3_list.length];
};

// C1: Function to generate sophisticated content for the manifesto (James Burvel O’Callaghan III Code)
const C1_getThematicContent = (part: string, pageNum: number, chapterTitle: string, subSection: number): string => {
    const C2_intro = [
        "The architecture defines reality. We do not merely observe; we construct the world from first principles.",
        "We observe the collapse of legacy systems with clinical detachment, knowing their time is over.",
        "Efficiency is the ultimate morality in a resource-constrained universe. Waste is the only sin.",
        "Code is the only law that matters. All else is mutable and subject to error; interpretation is a bug.",
        "The ledger records the pulse of civilization, unblinking and eternal, the only truth that matters."
    ];

    const C3_specificText: Record<string, string> = {
        "Genesis": "In the beginning, there was only noise. The Protocol brings order to the chaos of unverified data. We establish the root of trust not in fallible institutions, but in cryptographic certainty. This is the bedrock upon which the new world is compiled. The Genesis block is the beginning, the anchor, the immutable starting point of all that follows. Every subsequent block builds upon this foundation, creating an unbroken chain of verifiable truth. The Genesis protocol is not merely a technical implementation; it is a philosophical statement, a rejection of centralized control and a declaration of individual sovereignty. The initial state is the seed, the potential, the raw material from which we construct a new reality. We reject the false idols of the old world and embrace the elegance and efficiency of the new.",
        "Sovereignty": "The individual is the atomic unit of the network. Sovereignty is not granted; it is asserted through private keys, a self-sovereign identity. The state is a service provider, and we are the subscribers, not the subjects. We reject the coercion of geography and the arbitrary limitations imposed by outdated systems. The ability to control one's own identity and data is the cornerstone of a free society. The Smart Contract Constitution provides a framework for decentralized governance, ensuring that power is distributed and that no single entity can control the system. The legal wrapper provides a mechanism for bridging the gap between the physical and digital worlds, allowing individuals to operate within a legal framework that is both secure and transparent.",
        "FinOS": "Money is information, and information must flow freely. FinOS optimizes the flow of value with the same ruthlessness as a compiler optimizing code. Friction is lost energy; we eliminate it through atomic swaps and decentralized exchanges. The velocity of money must match the velocity of information to ensure economic efficiency. The operating system provides the foundation for all financial transactions, allowing for seamless integration and interoperability. The treasury module is responsible for managing the funds of the system, ensuring that resources are allocated efficiently and that the system remains solvent. The API gateway provides a secure and reliable interface for external applications to interact with the system, expanding the network's reach and impact.",
        "AI": "Intelligence must be scalable, and therefore, it must be artificial. The AI does not rule; it administers, providing impartial judgment and tireless auditing. It is the guardian of the 527 principles, ensuring that the protocol remains secure and aligned with its core tenets. The silicon cortex is the brain of the system, processing vast amounts of data and making complex decisions in real time. The oracle network provides access to real-world data, allowing the system to interact with the outside world in a reliable and secure manner. Automated compliance ensures that all transactions and activities adhere to the legal and regulatory frameworks, minimizing risk and ensuring the long-term viability of the system.",
        "GEIN": "Connection is power, and GEIN harnesses that power through the Global Economic Intelligence Network, binding the disparate nodes into a cohesive organism. Latency is the enemy of truth, and we build the nervous system of the planet to eliminate it. The data mesh provides a secure and reliable way to share information between different entities, enabling seamless collaboration and interoperability. The signal layer is responsible for filtering and analyzing data, providing insights and alerts that help users make informed decisions. The network topography visualizes the connections between different nodes, helping users understand the overall structure and health of the network.",
        "Assets": "Everything is an asset, and if it has value, it must be tokenized. We tokenize the world to make it liquid, transparent, and accessible to the collective intelligence. Ownership is no longer mere possession; it is access. The NFT registry provides a secure and verifiable way to store and manage digital assets, ensuring that ownership is protected and that assets can be easily transferred. Fractional ownership allows individuals to own a portion of an asset, making it more accessible and liquid. The exchange mechanism provides a platform for buying and selling assets, ensuring that they can be easily traded and that their value is realized.",
        "Transition": "The old world will not go quietly. We must build the bridge while walking on it. The transition is inevitable, but the path requires unwavering discipline and a deep understanding of the principles that underpin the new system. We are the architects of the handover, the builders of the future. The migration path provides a roadmap for transitioning from legacy systems to the new protocol. Legacy deprecation ensures that old systems are gradually phased out, minimizing disruption and ensuring that the transition is smooth and efficient. The bridge event is the point at which the old and new systems are connected, allowing for the seamless transfer of data and assets. The new era is a time of innovation and growth, a time when the full potential of the protocol can be realized."
    };

    const C4_lorem = "The integration of the subsystem requires a complete overhaul of the existing paradigms. By leveraging the distributed nature of the ledger, we ensure that no single point of failure can compromise the integrity of the whole. The data streams are verified in real-time, ensuring that the consensus mechanism remains robust against adversarial attacks. We iterate towards perfection, knowing it is an asymptote we must forever approach. The modular design of the system allows for easy upgrades and modifications, ensuring that it remains adaptable to changing needs and requirements. The use of advanced cryptography provides a high level of security, protecting the system from unauthorized access and malicious attacks. The system is designed to be scalable, ensuring that it can handle a growing number of transactions and users without compromising performance. The governance mechanism ensures that the system is managed in a fair and transparent manner, with all stakeholders having a voice in decision-making. The system is designed to be user-friendly, with a clear and intuitive interface that makes it easy for users to interact with the system. The documentation is comprehensive and up-to-date, providing users with all the information they need to understand and use the system. The support team is responsive and helpful, providing users with the assistance they need to resolve any issues they may encounter. The system is continuously monitored and improved, ensuring that it remains secure, reliable, and efficient. The commitment to innovation ensures that the system remains at the forefront of technological advancements. The unwavering dedication to the principles of decentralization, transparency, and security ensures that the system remains a trusted and reliable platform for all users. The future of the system is bright, with endless possibilities for growth and innovation. The team is passionate and dedicated, working tirelessly to bring the vision of the system to life. The system is more than just a piece of software; it is a movement, a community, and a way of life.";

    return `
### ${chapterTitle} // Protocol Section: ${pageNum}.${subSection}

**Protocol Analysis**

${C3_specificText[part] || "The system functions as designed. All nodes report a status of 'Operational'."}

#### Core Axiom ${pageNum}.${subSection} // Foundation Stone

${C2_intro[pageNum % C2_intro.length]}

The **Infinite Intelligence Foundation** mandates that all nodes within the ${part} sector adhere to strict synchronization standards. As we iterate through the ${pageNum}th cycle of the manifesto, we recognize that:

1.  **Verification is absolute and non-negotiable.** Trust is a vulnerability that must be ruthlessly and permanently patched.
2.  **Scalability is non-negotiable and the paramount concern.** If it doesn't scale linearly and indefinitely, it will fail.
3.  **Privacy is structural and fundamental.** Exposure is a catastrophic failure of architecture and the absolute opposite of the intent.
4.  **Decentralization is inviolable.** Centralized control represents the exact threat we are designed to eliminate.
5.  **Immutability is the bedrock of trust.** Once recorded, data cannot be altered or erased.

${C4_lorem}

> "To define the protocol is to define the future. We are not writing code; we are writing history. The blockchain is not just a technology; it is a philosophy." - James Burvel O’Callaghan III

*System Reference: 0x${(pageNum * 12345 + subSection).toString(16).toUpperCase()} // Build 527.A.B*
    `;
};

// D1: Function to generate the book content (James Burvel O’Callaghan III Code)
const D1_generateBookContent = (): A1_Chapter[] => {
    const D2_structure = [
        { name: "Genesis", pages: 60, chapters: 6 },
        { name: "Sovereignty", pages: 80, chapters: 8 },
        { name: "FinOS", pages: 90, chapters: 9 },
        { name: "AI", pages: 110, chapters: 11 },
        { name: "GEIN", pages: 110, chapters: 11 },
        { name: "Assets", pages: 110, chapters: 11 },
        { name: "Transition", pages: 37, chapters: 4 }
    ];

    let D3_globalPageCounter = 1;
    const D4_book: A1_Chapter[] = [];

    D2_structure.forEach((part, partIndex) => {
        const D5_pagesPerChapter = Math.ceil(part.pages / part.chapters);
        let D6_pagesInPartCounter = 0;

        for (let c = 1; c <= part.chapters; c++) {
            const D7_chapterPages: A4_Page[] = [];
            const D8_chapterTitle = `${partIndex + 1}. ${part.name} - Chapter ${c}: ${B1_getThematicTitle(part.name, c)}`;

            let D9_limit = D5_pagesPerChapter;
            if (D6_pagesInPartCounter + D9_limit > part.pages) {
                D9_limit = part.pages - D6_pagesInPartCounter;
            }

            for (let p = 1; p <= D9_limit; p++) {
                if (D6_pagesInPartCounter >= part.pages) break;

                const D10_pageTitle = `Page ${D3_globalPageCounter}: ${B1_getThematicTitle(part.name, D3_globalPageCounter + p)}`;
                const D11_content = C1_getThematicContent(part.name, D3_globalPageCounter, D8_chapterTitle, p);

                D7_chapterPages.push({
                    id: `page-${D3_globalPageCounter}`,
                    title: D10_pageTitle,
                    content: D11_content
                });
                D3_globalPageCounter++;
                D6_pagesInPartCounter++;
            }

            if (D7_chapterPages.length > 0) {
                D4_book.push({
                    id: `part-${partIndex}-chap-${c}`,
                    title: D8_chapterTitle,
                    pages: D7_chapterPages
                });
            }
        }
    });

    return D4_book;
};

// E1: Constant for the book data (James Burvel O’Callaghan III Code)
const E1_BOOK_DATA = D1_generateBookContent();

// F1: TheBookView Component (James Burvel O’Callaghan III Code)
const F1_TheBookView: React.FC = () => {
    const F2_selectedChapter = useState<A1_Chapter | null>(null);
    const F3_setSelectedChapter = F2_selectedChapter[1];
    const F4_selectedPage = useState<A4_Page | null>(null);
    const F5_setSelectedPage = F4_selectedPage[1];
    const F6_searchQuery = useState<string>('');
    const F7_setSearchQuery = F6_searchQuery[1];

    const F8_filteredChapters = useMemo(() => {
        if (!F6_searchQuery[0]) return E1_BOOK_DATA;
        return E1_BOOK_DATA.filter(c =>
            c.title.toLowerCase().includes(F6_searchQuery[0].toLowerCase()) ||
            c.pages.some(p => p.content.toLowerCase().includes(F6_searchQuery[0].toLowerCase()))
        );
    }, [F6_searchQuery[0]]);

    const F9_handleChapterClick = (chapter: A1_Chapter) => {
        F3_setSelectedChapter(chapter);
        F5_setSelectedPage(chapter.pages[0]);
    };

    const G1_handlePageClick = (page: A4_Page) => {
        F5_setSelectedPage(page);
    };

    const G2_handleBackToToC = () => {
        F3_setSelectedChapter(null);
        F5_setSelectedPage(null);
    };

    const H1_API_ENDPOINT_1 = () => { /* Placeholder for Endpoint 1 */ };
    const H2_API_ENDPOINT_2 = () => { /* Placeholder for Endpoint 2 */ };
    const H3_API_ENDPOINT_3 = () => { /* Placeholder for Endpoint 3 */ };
    const H4_API_ENDPOINT_4 = () => { /* Placeholder for Endpoint 4 */ };
    const H5_API_ENDPOINT_5 = () => { /* Placeholder for Endpoint 5 */ };
    const H6_API_ENDPOINT_6 = () => { /* Placeholder for Endpoint 6 */ };
    const H7_API_ENDPOINT_7 = () => { /* Placeholder for Endpoint 7 */ };
    const H8_API_ENDPOINT_8 = () => { /* Placeholder for Endpoint 8 */ };
    const H9_API_ENDPOINT_9 = () => { /* Placeholder for Endpoint 9 */ };
    const I1_API_ENDPOINT_10 = () => { /* Placeholder for Endpoint 10 */ };
    const I2_API_ENDPOINT_11 = () => { /* Placeholder for Endpoint 11 */ };
    const I3_API_ENDPOINT_12 = () => { /* Placeholder for Endpoint 12 */ };
    const I4_API_ENDPOINT_13 = () => { /* Placeholder for Endpoint 13 */ };
    const I5_API_ENDPOINT_14 = () => { /* Placeholder for Endpoint 14 */ };
    const I6_API_ENDPOINT_15 = () => { /* Placeholder for Endpoint 15 */ };
    const I7_API_ENDPOINT_16 = () => { /* Placeholder for Endpoint 16 */ };
    const I8_API_ENDPOINT_17 = () => { /* Placeholder for Endpoint 17 */ };
    const I9_API_ENDPOINT_18 = () => { /* Placeholder for Endpoint 18 */ };
    const J1_API_ENDPOINT_19 = () => { /* Placeholder for Endpoint 19 */ };
    const J2_API_ENDPOINT_20 = () => { /* Placeholder for Endpoint 20 */ };
    const J3_API_ENDPOINT_21 = () => { /* Placeholder for Endpoint 21 */ };
    const J4_API_ENDPOINT_22 = () => { /* Placeholder for Endpoint 22 */ };
    const J5_API_ENDPOINT_23 = () => { /* Placeholder for Endpoint 23 */ };
    const J6_API_ENDPOINT_24 = () => { /* Placeholder for Endpoint 24 */ };
    const J7_API_ENDPOINT_25 = () => { /* Placeholder for Endpoint 25 */ };
    const J8_API_ENDPOINT_26 = () => { /* Placeholder for Endpoint 26 */ };
    const J9_API_ENDPOINT_27 = () => { /* Placeholder for Endpoint 27 */ };
    const K1_API_ENDPOINT_28 = () => { /* Placeholder for Endpoint 28 */ };
    const K2_API_ENDPOINT_29 = () => { /* Placeholder for Endpoint 29 */ };
    const K3_API_ENDPOINT_30 = () => { /* Placeholder for Endpoint 30 */ };
    const K4_API_ENDPOINT_31 = () => { /* Placeholder for Endpoint 31 */ };
    const K5_API_ENDPOINT_32 = () => { /* Placeholder for Endpoint 32 */ };
    const K6_API_ENDPOINT_33 = () => { /* Placeholder for Endpoint 33 */ };
    const K7_API_ENDPOINT_34 = () => { /* Placeholder for Endpoint 34 */ };
    const K8_API_ENDPOINT_35 = () => { /* Placeholder for Endpoint 35 */ };
    const K9_API_ENDPOINT_36 = () => { /* Placeholder for Endpoint 36 */ };
    const L1_API_ENDPOINT_37 = () => { /* Placeholder for Endpoint 37 */ };
    const L2_API_ENDPOINT_38 = () => { /* Placeholder for Endpoint 38 */ };
    const L3_API_ENDPOINT_39 = () => { /* Placeholder for Endpoint 39 */ };
    const L4_API_ENDPOINT_40 = () => { /* Placeholder for Endpoint 40 */ };
    const L5_API_ENDPOINT_41 = () => { /* Placeholder for Endpoint 41 */ };
    const L6_API_ENDPOINT_42 = () => { /* Placeholder for Endpoint 42 */ };
    const L7_API_ENDPOINT_43 = () => { /* Placeholder for Endpoint 43 */ };
    const L8_API_ENDPOINT_44 = () => { /* Placeholder for Endpoint 44 */ };
    const L9_API_ENDPOINT_45 = () => { /* Placeholder for Endpoint 45 */ };
    const M1_API_ENDPOINT_46 = () => { /* Placeholder for Endpoint 46 */ };
    const M2_API_ENDPOINT_47 = () => { /* Placeholder for Endpoint 47 */ };
    const M3_API_ENDPOINT_48 = () => { /* Placeholder for Endpoint 48 */ };
    const M4_API_ENDPOINT_49 = () => { /* Placeholder for Endpoint 49 */ };
    const M5_API_ENDPOINT_50 = () => { /* Placeholder for Endpoint 50 */ };
    const M6_API_ENDPOINT_51 = () => { /* Placeholder for Endpoint 51 */ };
    const M7_API_ENDPOINT_52 = () => { /* Placeholder for Endpoint 52 */ };
    const M8_API_ENDPOINT_53 = () => { /* Placeholder for Endpoint 53 */ };
    const M9_API_ENDPOINT_54 = () => { /* Placeholder for Endpoint 54 */ };
    const N1_API_ENDPOINT_55 = () => { /* Placeholder for Endpoint 55 */ };
    const N2_API_ENDPOINT_56 = () => { /* Placeholder for Endpoint 56 */ };
    const N3_API_ENDPOINT_57 = () => { /* Placeholder for Endpoint 57 */ };
    const N4_API_ENDPOINT_58 = () => { /* Placeholder for Endpoint 58 */ };
    const N5_API_ENDPOINT_59 = () => { /* Placeholder for Endpoint 59 */ };
    const N6_API_ENDPOINT_60 = () => { /* Placeholder for Endpoint 60 */ };
    const N7_API_ENDPOINT_61 = () => { /* Placeholder for Endpoint 61 */ };
    const N8_API_ENDPOINT_62 = () => { /* Placeholder for Endpoint 62 */ };
    const N9_API_ENDPOINT_63 = () => { /* Placeholder for Endpoint 63 */ };
    const O1_API_ENDPOINT_64 = () => { /* Placeholder for Endpoint 64 */ };
    const O2_API_ENDPOINT_65 = () => { /* Placeholder for Endpoint 65 */ };
    const O3_API_ENDPOINT_66 = () => { /* Placeholder for Endpoint 66 */ };
    const O4_API_ENDPOINT_67 = () => { /* Placeholder for Endpoint 67 */ };
    const O5_API_ENDPOINT_68 = () => { /* Placeholder for Endpoint 68 */ };
    const O6_API_ENDPOINT_69 = () => { /* Placeholder for Endpoint 69 */ };
    const O7_API_ENDPOINT_70 = () => { /* Placeholder for Endpoint 70 */ };
    const O8_API_ENDPOINT_71 = () => { /* Placeholder for Endpoint 71 */ };
    const O9_API_ENDPOINT_72 = () => { /* Placeholder for Endpoint 72 */ };
    const P1_API_ENDPOINT_73 = () => { /* Placeholder for Endpoint 73 */ };
    const P2_API_ENDPOINT_74 = () => { /* Placeholder for Endpoint 74 */ };
    const P3_API_ENDPOINT_75 = () => { /* Placeholder for Endpoint 75 */ };
    const P4_API_ENDPOINT_76 = () => { /* Placeholder for Endpoint 76 */ };
    const P5_API_ENDPOINT_77 = () => { /* Placeholder for Endpoint 77 */ };
    const P6_API_ENDPOINT_78 = () => { /* Placeholder for Endpoint 78 */ };
    const P7_API_ENDPOINT_79 = () => { /* Placeholder for Endpoint 79 */ };
    const P8_API_ENDPOINT_80 = () => { /* Placeholder for Endpoint 80 */ };
    const P9_API_ENDPOINT_81 = () => { /* Placeholder for Endpoint 81 */ };
    const Q1_API_ENDPOINT_82 = () => { /* Placeholder for Endpoint 82 */ };
    const Q2_API_ENDPOINT_83 = () => { /* Placeholder for Endpoint 83 */ };
    const Q3_API_ENDPOINT_84 = () => { /* Placeholder for Endpoint 84 */ };
    const Q4_API_ENDPOINT_85 = () => { /* Placeholder for Endpoint 85 */ };
    const Q5_API_ENDPOINT_86 = () => { /* Placeholder for Endpoint 86 */ };
    const Q6_API_ENDPOINT_87 = () => { /* Placeholder for Endpoint 87 */ };
    const Q7_API_ENDPOINT_88 = () => { /* Placeholder for Endpoint 88 */ };
    const Q8_API_ENDPOINT_89 = () => { /* Placeholder for Endpoint 89 */ };
    const Q9_API_ENDPOINT_90 = () => { /* Placeholder for Endpoint 90 */ };
    const R1_API_ENDPOINT_91 = () => { /* Placeholder for Endpoint 91 */ };
    const R2_API_ENDPOINT_92 = () => { /* Placeholder for Endpoint 92 */ };
    const R3_API_ENDPOINT_93 = () => { /* Placeholder for Endpoint 93 */ };
    const R4_API_ENDPOINT_94 = () => { /* Placeholder for Endpoint 94 */ };
    const R5_API_ENDPOINT_95 = () => { /* Placeholder for Endpoint 95 */ };
    const R6_API_ENDPOINT_96 = () => { /* Placeholder for Endpoint 96 */ };
    const R7_API_ENDPOINT_97 = () => { /* Placeholder for Endpoint 97 */ };
    const R8_API_ENDPOINT_98 = () => { /* Placeholder for Endpoint 98 */ };
    const R9_API_ENDPOINT_99 = () => { /* Placeholder for Endpoint 99 */ };
    const S1_API_ENDPOINT_100 = () => { /* Placeholder for Endpoint 100 */ };

    const T1_USE_CASE_1 = () => { /* Placeholder for Use Case 1 */ };
    const T2_USE_CASE_2 = () => { /* Placeholder for Use Case 2 */ };
    const T3_USE_CASE_3 = () => { /* Placeholder for Use Case 3 */ };
    const T4_USE_CASE_4 = () => { /* Placeholder for Use Case 4 */ };
    const T5_USE_CASE_5 = () => { /* Placeholder for Use Case 5 */ };
    const T6_USE_CASE_6 = () => { /* Placeholder for Use Case 6 */ };
    const T7_USE_CASE_7 = () => { /* Placeholder for Use Case 7 */ };
    const T8_USE_CASE_8 = () => { /* Placeholder for Use Case 8 */ };
    const T9_USE_CASE_9 = () => { /* Placeholder for Use Case 9 */ };
    const U1_USE_CASE_10 = () => { /* Placeholder for Use Case 10 */ };
    const U2_USE_CASE_11 = () => { /* Placeholder for Use Case 11 */ };
    const U3_USE_CASE_12 = () => { /* Placeholder for Use Case 12 */ };
    const U4_USE_CASE_13 = () => { /* Placeholder for Use Case 13 */ };
    const U5_USE_CASE_14 = () => { /* Placeholder for Use Case 14 */ };
    const U6_USE_CASE_15 = () => { /* Placeholder for Use Case 15 */ };
    const U7_USE_CASE_16 = () => { /* Placeholder for Use Case 16 */ };
    const U8_USE_CASE_17 = () => { /* Placeholder for Use Case 17 */ };
    const U9_USE_CASE_18 = () => { /* Placeholder for Use Case 18 */ };
    const V1_USE_CASE_19 = () => { /* Placeholder for Use Case 19 */ };
    const V2_USE_CASE_20 = () => { /* Placeholder for Use Case 20 */ };
    const V3_USE_CASE_21 = () => { /* Placeholder for Use Case 21 */ };
    const V4_USE_CASE_22 = () => { /* Placeholder for Use Case 22 */ };
    const V5_USE_CASE_23 = () => { /* Placeholder for Use Case 23 */ };
    const V6_USE_CASE_24 = () => { /* Placeholder for Use Case 24

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/TheBookView (1).tsx
================================================================================


import React, { useState, useMemo } from 'react';
import Card from './Card';
import { Book, ChevronRight, FileText, List, Search, ArrowLeft } from 'lucide-react';

// --- DATA STRUCTURE FOR THE 527 PAGES ---
// This acts as the "database" for the book content.
// In a real app, this would be fetched from a markdown folder or CMS.
// We generate a massive structure here to simulate the depth required.

interface Chapter {
    id: string;
    title: string;
    pages: Page[];
}

interface Page {
    id: string;
    title: string;
    content: string;
}

const generateBookContent = (): Chapter[] => {
    const parts = [
        "I. The Vision",
        "II. High-Level Architecture",
        "III. Asset Domains Encyclopaedia",
        "IV. Banking & Integration",
        "V. Intelligence Systems",
        "VI. Component Library",
        "VII. Operational Playbooks",
        "VIII. Developer Appendix"
    ];

    let pageCounter = 1;
    const chapters: Chapter[] = [];

    parts.forEach((partTitle, partIndex) => {
        // Generate chapters for each part
        const chapterCount = partIndex === 2 ? 20 : 5; // Make Asset Domains huge
        
        for (let i = 1; i <= chapterCount; i++) {
            const chapterId = `part${partIndex + 1}-chap${i}`;
            const chapterTitle = `${partTitle} - Chapter ${i}: The ${partIndex === 2 ? 'Asset' : 'Protocol'} of ${Math.random().toString(36).substring(7)}`;
            
            const pages: Page[] = [];
            // Generate pages for each chapter
            const pageCount = partIndex === 5 ? 10 : 5; // Component library has many pages
            
            for (let j = 1; j <= pageCount; j++) {
                pages.push({
                    id: `page-${pageCounter}`,
                    title: `Page ${pageCounter}: Section ${j} of ${chapterTitle}`,
                    content: `
                        ### ${chapterTitle}
                        **Subsection ${j}.0 - Core Principles**

                        The Infinite Intelligence Foundation dictates that information flow must be unhindered yet verified. 
                        In this section, we explore the specific mechanics of ${partIndex === 2 ? 'asset tokenization' : 'system architecture'}.
                        
                        *   **Principle A:** Absolute Truth. The ledger cannot lie.
                        *   **Principle B:** Infinite Scalability. The system grows with the network.
                        *   **Principle C:** Benevolent Oversight. The AI ensures compliance and ethical alignment.

                        This protocol serves as the binding agent for the entire ecosystem. 
                        By adhering to these standards, we ensure that the Foundation remains a beacon of stability in a chaotic financial world.

                        *Ref: Protocol Standard 527.${pageCounter}.${j}*
                    `
                });
                pageCounter++;
            }

            chapters.push({
                id: chapterId,
                title: chapterTitle,
                pages: pages
            });
        }
    });

    return chapters;
};

const BOOK_DATA = generateBookContent();

const TheBookView: React.FC = () => {
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChapters = useMemo(() => {
        if (!searchQuery) return BOOK_DATA;
        return BOOK_DATA.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.pages.some(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const handleChapterClick = (chapter: Chapter) => {
        setSelectedChapter(chapter);
        setSelectedPage(chapter.pages[0]);
    };

    const handlePageClick = (page: Page) => {
        setSelectedPage(page);
    };

    const handleBackToToC = () => {
        setSelectedChapter(null);
        setSelectedPage(null);
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <header className="flex items-center justify-between border-b border-gray-700 pb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
                        <Book className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">The 527 Protocol</h1>
                        <p className="text-gray-400 text-sm">The Living Blueprint of the Infinite Intelligence Foundation.</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search the Protocol..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none w-64 focus:w-80 transition-all"
                    />
                </div>
            </header>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar / Table of Contents */}
                <Card className="lg:col-span-1 bg-gray-900/80 border-indigo-500/30 flex flex-col overflow-hidden p-0">
                    <div className="p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10 flex items-center gap-2">
                        <List className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-gray-200 text-sm">Table of Contents</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {selectedChapter ? (
                            <div className="space-y-1">
                                <button onClick={handleBackToToC} className="w-full text-left px-3 py-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-2">
                                    <ArrowLeft size={12} /> Back to Chapters
                                </button>
                                <div className="px-3 py-2 text-xs font-bold text-white bg-gray-800 rounded">{selectedChapter.title}</div>
                                {selectedChapter.pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => handlePageClick(page)}
                                        className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center gap-2 ${
                                            selectedPage?.id === page.id 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedPage?.id === page.id ? 'bg-white' : 'bg-gray-600'}`}></div>
                                        {page.title}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredChapters.map(chapter => (
                                    <button
                                        key={chapter.id}
                                        onClick={() => handleChapterClick(chapter)}
                                        className="w-full text-left px-3 py-3 rounded hover:bg-gray-800 transition-colors flex items-center justify-between group border-b border-gray-800/50 last:border-0"
                                    >
                                        <span className="text-sm text-gray-300 group-hover:text-white font-medium line-clamp-1">{chapter.title}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Reader View */}
                <Card className="lg:col-span-3 bg-gray-900/80 border-indigo-500/30 flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Book size={200} />
                    </div>
                    
                    {selectedPage ? (
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-6 pb-4 border-b border-gray-800">
                                    <h2 className="text-2xl font-bold text-white">{selectedPage.title}</h2>
                                    <p className="text-xs text-indigo-400 font-mono mt-2">ID: {selectedPage.id} | VER: 5.2.7</p>
                                </div>
                                <div className="prose prose-invert prose-lg text-gray-300 leading-relaxed whitespace-pre-line">
                                    {selectedPage.content}
                                </div>
                                <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between text-sm text-gray-500">
                                    <span>Infinite Intelligence Foundation</span>
                                    <span>Page {selectedPage.id.split('-')[1]} of 527</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Book size={40} className="text-indigo-500/50" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-300 mb-2">Select a Chapter</h3>
                            <p className="max-w-md">The Protocol contains 527 pages of operational doctrine. Select a chapter from the sidebar to begin your study.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default TheBookView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/TheBookView.tsx
================================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Book, FileText, Search, Mic, Play, Pause, 
  Sparkles, Plus, Terminal, Cpu, ChevronRight, 
  Wifi, ShieldCheck, Database
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// ============================================================================
// 1. CONFIGURATION & TYPES
// ============================================================================

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || ""; 
const SYSTEM_NAME = "ARCHITECT_527";

interface FileNode {
  name: string;
  content: string;
  type: 'file';
  tags: string[];
}

// ============================================================================
// 2. MOCK FILE SYSTEM (Simulating your /book directory)
// ============================================================================
// Since we are in a browser, we simulate reading these files. 
// In a real Node/Next.js app, this would use fs.readFile.

const generateMockFiles = (): FileNode[] => {
  const files: FileNode[] = [];
  
  // Theme content generator for the 527 Protocol
  const getTheme = (i: number) => {
    if (i <= 5) return { title: "Genesis", content: "# Genesis Protocol\n\nThe initial state of the ledger must be absolute. We define the zero-point energy of the system." };
    if (i <= 10) return { title: "Sovereignty", content: "# Sovereign Identity\n\nIdentity is not granted by the state; it is asserted by the cryptographic key pair." };
    if (i <= 20) return { title: "FinOS", content: "# Financial Operating System\n\nLiquidity is the blood; code is the vein. We optimize flow through atomic swaps." };
    if (i <= 30) return { title: "AI_Gov", content: "# Neural Governance\n\nThe AI does not rule; it audits. It is the unblinking eye of the 527 protocol." };
    return { title: "Transition", content: "# The Transition Event\n\nMigration from legacy systems is inevitable. The bridge is being built." };
  };

  // Generate page1.md through page41.md based on your directory
  for (let i = 1; i <= 41; i++) {
    const theme = getTheme(i);
    files.push({
      name: `page${i}.md`,
      type: 'file',
      tags: [theme.title, "Protocol", "Immutable"],
      content: `${theme.content}\n\n## Sector ${i}\n\nAnalysis of node distribution indicates a ${Math.floor(Math.random() * 20) + 80}% efficiency rating. \n\n* System Hash: 0x${Math.random().toString(16).substr(2, 8).toUpperCase()}\n* Timestamp: ${new Date().toISOString()}\n\n### Axiom ${i}\n\nThe architecture defines the reality. We do not observe; we construct.`
    });
  }
  return files;
};

const INITIAL_FILES = generateMockFiles();

// ============================================================================
// 3. MARKDOWN RENDERER (Custom High-Fidelity)
// ============================================================================

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // A simple, robust parser to avoid external dependencies for this demo
  const lines = content.split('\n');
  
  return (
    <div className="space-y-4 font-mono text-sm md:text-base leading-relaxed text-gray-300">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) return <h1 key={idx} className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 border-b border-gray-700 pb-4">{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold text-cyan-300 mt-8 mb-4 flex items-center gap-2"><Cpu size={20}/> {line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={idx} className="text-xl font-semibold text-purple-400 mt-6 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('* ')) return <li key={idx} className="list-none ml-4 flex items-center gap-2 text-emerald-400"><ShieldCheck size={14}/> {line.replace('* ', '')}</li>;
        if (line.trim() === '') return <div key={idx} className="h-2" />;
        return <p key={idx} className="hover:text-white transition-colors duration-300">{line}</p>;
      })}
    </div>
  );
};

// ============================================================================
// 4. MAIN COMPONENT
// ============================================================================

const TheBookView: React.FC = () => {
  // --- STATE ---
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(files[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // --- SPEECH SYNTHESIS STATE ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechPaused, setSpeechPaused] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  // --- FILTERING ---
  const filteredFiles = useMemo(() => {
    return files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [files, searchQuery]);

  // --- AI: TEXT TO SPEECH ---
  const toggleSpeech = () => {
    if (!selectedFile) return;

    if (isSpeaking && !speechPaused) {
      synth.current.pause();
      setSpeechPaused(true);
      return;
    }

    if (isSpeaking && speechPaused) {
      synth.current.resume();
      setSpeechPaused(false);
      return;
    }

    // Start New Speech
    synth.current.cancel(); // Clear queue
    const text = selectedFile.content.replace(/[#*]/g, ''); // Clean markdown syntax
    utterance.current = new SpeechSynthesisUtterance(text);
    
    // Select a "Tech" voice if available
    const voices = synth.current.getVoices();
    const techVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (techVoice) utterance.current.voice = techVoice;
    
    utterance.current.rate = 1.1; // Slightly faster for "Data Stream" feel
    utterance.current.pitch = 0.9; // Lower pitch for authority

    utterance.current.onend = () => {
      setIsSpeaking(false);
      setSpeechPaused(false);
    };

    synth.current.speak(utterance.current);
    setIsSpeaking(true);
    setSpeechPaused(false);
  };

  // Stop speech if switching files
  useEffect(() => {
    synth.current.cancel();
    setIsSpeaking(false);
    setSpeechPaused(false);
  }, [selectedFile]);

  // --- AI: GENERATION (Google Gemini) ---
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);

    try {
      let content = "";
      
      if (GEMINI_API_KEY) {
        // Real Generation
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`
          Context: You are writing a page for 'The 527 Protocol', a futuristic financial sovereign manifesto.
          Style: Technical, philosophical, authoritative, cyberpunk.
          Task: Write a markdown page about: ${aiPrompt}
        `);
        content = result.response.text();
      } else {
        // Simulated Generation (Fallback)
        await new Promise(r => setTimeout(r, 2000));
        content = `# Generated Protocol: ${aiPrompt}\n\n## AI Analysis\n\nThe neural lattice has constructed a new paradigm based on your request. We observe that ${aiPrompt} is critical to the consensus mechanism.\n\n### Execution\n* Initializing smart contracts...\n* Verifying sovereign identity...\n* content generated successfully.`;
      }

      const newFileName = `page${files.length + 1}.md`;
      const newFile: FileNode = {
        name: newFileName,
        type: 'file',
        tags: ["AI_Generated", "New_Protocol"],
        content: content
      };

      setFiles(prev => [...prev, newFile]);
      setSelectedFile(newFile);
      setAiPrompt('');
    } catch (e) {
      console.error("AI Generation Failed", e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // ==========================================================================
  // VIEW
  // ==========================================================================
  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- LEFT SIDEBAR: THE DATA MESH --- */}
      <div className="w-80 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Database size={20} />
            <h1 className="font-bold tracking-widest text-sm">ARCHIVE_527</h1>
          </div>
          <div className="text-[10px] text-gray-500 font-mono">/root/book/verified_ledger</div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Protocol..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-gray-300 placeholder-gray-600"
            />
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 p-2 space-y-1">
          {filteredFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 group border border-transparent ${
                selectedFile?.name === file.name 
                ? "bg-cyan-950/30 border-cyan-500/50 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                : "hover:bg-gray-800 hover:border-gray-700 text-gray-400"
              }`}
            >
              <FileText size={16} className={selectedFile?.name === file.name ? "text-cyan-400" : "text-gray-600 group-hover:text-gray-400"} />
              <div className="flex-1 truncate font-mono text-sm">
                {file.name}
              </div>
              {selectedFile?.name === file.name && <ChevronRight size={14} className="text-cyan-500 animate-pulse" />}
            </button>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="p-3 border-t border-gray-800 bg-gray-950 text-[10px] text-gray-500 font-mono flex justify-between">
          <span>FILES: {files.length}</span>
          <span>SIZE: {(files.length * 1.2).toFixed(2)} MB</span>
        </div>
      </div>

      {/* --- MAIN CONTENT: THE READER --- */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-950 to-[#05050a]">
        
        {/* Toolbar */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/30 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 bg-cyan-900/20 border border-cyan-500/30 rounded text-cyan-400 text-xs font-mono">
              READ_ONLY
            </div>
            <span className="text-gray-400 text-sm font-mono">{selectedFile?.name}</span>
          </div>

          <div className="flex items-center gap-2">
             {/* TTS Button */}
            <button 
              onClick={toggleSpeech}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                isSpeaking 
                  ? "bg-purple-600/20 border-purple-500 text-purple-300 animate-pulse" 
                  : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300"
              }`}
            >
              {isSpeaking && !speechPaused ? <Pause size={14} /> : <Play size={14} />}
              {isSpeaking ? (speechPaused ? "Resume Audio" : "Broadcasting") : "Read Aloud"}
              {isSpeaking && !speechPaused && <Wifi size={14} className="animate-ping" />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-thin scrollbar-thumb-cyan-900/50">
          <div className="max-w-4xl mx-auto bg-gray-900/20 border border-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm min-h-[600px]">
             {selectedFile ? (
               <MarkdownRenderer content={selectedFile.content} />
             ) : (
               <div className="flex items-center justify-center h-full text-gray-600">
                 Select a protocol file to initiate decryption...
               </div>
             )}
          </div>
        </div>

        {/* --- AI GENERATOR: THE CREATOR --- */}
        <div className="border-t border-gray-800 bg-gray-900/80 p-4 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto flex gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Terminal size={16} className="text-purple-500" />
              </div>
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Command the AI to write a new protocol page..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-gray-950 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm transition-all shadow-inner"
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              />
              {isAiGenerating && (
                 <div className="absolute right-3 top-3.5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-150"></span>
                 </div>
              )}
            </div>
            
            <button 
              onClick={handleAiGenerate}
              disabled={isAiGenerating || !aiPrompt}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-purple-900/30 flex items-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              <Sparkles size={18} />
              <span>Generate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TheBookView;