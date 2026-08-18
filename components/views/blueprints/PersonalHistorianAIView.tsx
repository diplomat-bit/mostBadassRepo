// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/blueprints/PersonalHistorianAIView.tsx
================================================================================

import React, { useState } from 'react';

interface Memory {
  id: string;
  title: string;
  summary: string;
  assets: { type: 'PHOTO' | 'EMAIL' | 'DOCUMENT', url: string }[];
  vrExperienceUrl: string;
}

const PersonalHistorianAIView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Memory | null>(null);
  
  const handleRecall = async () => {
    setIsLoading(true);
    setResult(null);
    // MOCK API
    const response: Memory = await new Promise(res => setTimeout(() => res({
      id: "mem-italy-2018",
      title: "Trip to Italy - Summer 2018",
      summary: "A 10-day trip focusing on Rome and Florence, key highlights include the Colosseum and Uffizi Gallery.",
      assets: [
        {type: "PHOTO", url: "#"},
        {type: "EMAIL", url: "#"}
      ],
      vrExperienceUrl: "#"
    }), 2500));
    setResult(response);
    setIsLoading(false);
  };
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Personal Historian AI</h1>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Recall a memory (e.g., 'My first marathon')" 
          className="w-full p-2 bg-gray-700 rounded"
        />
        <button onClick={handleRecall} disabled={isLoading} className="p-2 bg-cyan-600 rounded disabled:opacity-50">Recall</button>
      </div>
      {isLoading && <p className="mt-4">Searching digital archives... reconstructing timeline...</p>}
      {result && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-semibold">Recalled Memory: {result.title}</h2>
          <p className="text-gray-400 mt-2">{result.summary}</p>
          <p className="mt-2">Launch <a href={result.vrExperienceUrl} className="text-cyan-400 hover:underline">VR Memory Palace Experience</a></p>
          <h4 className="font-semibold mt-2">Key Assets:</h4>
          <ul className="list-disc list-inside">
            {result.assets.map((asset, i) => <li key={i}><a href={asset.url} className="text-cyan-400 hover:underline">{asset.type}</a></li>)}
          </ul>
        </div>
      )}
    </div>
  );
};
export default PersonalHistorianAIView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/blueprints/PersonalHistorianAIView.tsx
================================================================================

This module implements the client-side user interface for the Personal Historian AI. Think of it as an interactive, intelligent diary with a super-powered memory, designed to help you collect, organize, and understand the story of your digital life. This isn't just about storing photos and emails; it's about connecting the dots, finding patterns, and rediscovering moments you may have forgotten.

**So, what's the big deal?**
In a world where our lives are scattered across countless apps and devices, this system brings it all together. It uses smart AI agents to do the tedious work of sorting and tagging, transforming a chaotic digital shoebox into a coherent, searchable, and insightful narrative of your life. For a person, it's a powerful tool for reflection and memory. For a business, this interface is the blueprint for a new kind of personalized service—one that provides tangible, intelligent value from user data with their full consent and control. It's a demonstration of how complex backend systems, including secure digital identities and transaction networks, can power intuitive, useful applications.

**How does this UI fit into the bigger picture?**
This file is a self-contained simulation of the entire front-end application. It demonstrates how various advanced concepts work together:

- **Agentic AI Interaction**: You'll see how users can interact with AI agents that work in the background. The UI provides a window into what these agents are doing, showing their logs and the results of their work, which builds trust and shows their value.
- **Digital Identity & Security**: The application simulates a secure digital identity for each user. This is the foundation for everything, ensuring that your data is yours and that all actions and transactions are secure and verifiable. It's like a digital passport for your personal history.
- **A Glimpse into a Token Economy**: The app uses a simulated token (`HST` or Historian Stable Token) to represent the computational cost of AI tasks. This makes the "cost" of AI processing transparent. You can see how much a task costs, manage your token balance, and see a history of all transactions. This models a fair and transparent micro-economy for digital services.
- **Real-time Value Exchange**: When you ask an AI agent to do something complex, like generate a VR scene from a memory, a token transaction happens in real-time. This UI component simulates that immediate and transparent value exchange.
- **Transparency and Control**: A core principle is that you should always know what's happening with your data. The UI provides views into AI processing logs and identity-related audit trails, giving you a clear picture and control over how your information is being used. This is crucial for building a trustworthy and ethical AI system.

Ultimately, this UI is the bridge between a person and their AI-enhanced digital memory. It's designed to be powerful, transparent, and a genuinely useful tool for exploring the past.
"""
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// --- Core Data Interfaces ---

export interface Person {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  relationship?: string;
  tags?: string[];
  digitalIdentityId?: string; // Link to DigitalIdentity
}

export interface Location {
  id: string;
  name: string;
  coordinates?: { lat: number; lng: number };
  description?: string;
  type?: 'city' | 'country' | 'landmark' | 'home' | 'work' | 'event_venue';
  tags?: string[];
}

export interface Tag {
  id: string;
  name: string;
  category?: string;
  color?: string;
}

export interface AIModelUsage {
  modelName: string;
  version: string;
  timestamp: string;
  confidenceScore?: number;
  outputSummary?: string;
  processedDataChunks?: number;
  costInTokens?: number; // Cost associated with this specific AI model usage
  transactionId?: string; // Link to TokenTransaction if applicable
}

export type AssetType = 'PHOTO' | 'VIDEO' | 'AUDIO' | 'EMAIL' | 'DOCUMENT' | 'SOCIAL_POST' | 'WEBPAGE_ARCHIVE' | 'OTHER';

export interface Asset {
  id: string;
  type: AssetType;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  timestamp?: string;
  sourceApp?: string; // e.g., 'Google Photos', 'Outlook', 'Slack'
  metadata?: { [key: string]: any }; // EXIF data, email headers, etc.
  transcription?: string; // For audio/video
  aiAnalyzed?: boolean;
}

export interface Memory {
  id: string;
  title: string;
  summary: string;
  description?: string; // More detailed narrative
  timestamp: string; // ISO 8601 string
  endDate?: string; // For events spanning multiple days
  locationId?: string; // Link to Location interface
  peopleIds?: string[]; // Links to Person interface
  tagIds?: string[]; // Links to Tag interface
  assets: Asset[];
  sentiment?: 'positive' | 'neutral' | 'negative' | 'mixed';
  sourceAIModels?: AIModelUsage[];
  linkedMemoryIds?: string[]; // Other related memories
  originalSources?: { type: string; url: string; identifier: string }[]; // Original digital source locations
  notes?: string;
  status?: 'draft' | 'published' | 'archived';
  visibility?: 'private' | 'shared' | 'public';
  vrExperienceUrl?: string;
  aiGeneratedInsights?: string[]; // AI-driven deeper analyses
  relevanceScore?: number; // For search ranking
  agentProcessingJobId?: string; // Link to a DataProcessingJob for this memory
  processingCostTokenId?: string; // Link to TokenTransaction for overall processing
}

export interface TimelineEvent {
  id: string;
  type: 'memory' | 'milestone' | 'period_summary' | 'ai_insight' | 'agent_action' | 'transaction_event'; // Added agent_action, transaction_event
  timestamp: string;
  title: string;
  description: string;
  relatedMemoryId?: string;
  tags?: string[];
  imageUrl?: string;
  detailUrl?: string;
  agentId?: string; // For agent_action type
  transactionId?: string; // For transaction_event type
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  preferences: UserPreferences;
  digitalIdentityId?: string; // Link to the user's main DigitalIdentity
  tokenAccountId?: string; // Link to the user's primary token account
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  defaultView: 'timeline' | 'dashboard' | 'map' | 'chat';
  notificationSettings: {
    memoryAnniversaries: boolean;
    newInsights: boolean;
    aiProcessingComplete: boolean;
    agentActivityAlerts: boolean; // Added for agentic AI
    transactionNotifications: boolean; // Added for token rails
  };
  privacySettings: {
    dataRetentionDays: number;
    anonymizeInsights: boolean;
    allowAIContextLearning: boolean; // Added for AI governance
  };
  language: string;
  defaultTimezone: string;
}

export interface AISettings {
  enableAutoTagging: boolean;
  enableSentimentAnalysis: boolean;
  enableVRSceneGeneration: boolean;
  preferredTranscriptionModel: string;
  preferredImageAnalysisModel: string;
  preferredChatModel: 'Gemini-Pro' | 'GPT-4-Turbo' | 'Claude-3-Sonnet'; // Added for chat feature
  aiModelAccessKeys: { [modelName: string]: string };
  autoProcessNewMemories: boolean; // Added for agentic AI workflow
  maxMonthlyAICostTokens: number; // Added for token governance
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'agent' | 'transaction'; // Added agent, transaction
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  relatedEntityId?: string; // e.g., memory ID, transaction ID, agent ID
}

export interface SearchHistoryEntry {
  id: string;
  query: string;
  timestamp: string;
  resultCount: number;
}

export interface Recommendation {
  id: string;
  type: 'related_memory' | 'insight' | 'action_item' | 'anniversary' | 'agent_suggestion'; // Added agent_suggestion
  title: string;
  description: string;
  relatedMemoryId?: string;
  actionUrl?: string;
  timestamp: string;
  priority?: 'low' | 'medium' | 'high';
  agentId?: string; // Agent that made the recommendation
}

// --- New Interfaces for Chat Functionality ---
export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    relatedMemoryIds?: string[];
    isLoading?: boolean;
}

export interface AIConversation {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: string;
}

// --- New Money20/20 Related Interfaces ---

/**
 * Represents a simulated Digital Identity for users or agents.
 * This is the cornerstone of trust in the system. It uses cryptographic principles
 * to ensure that you are who you say you are, and that your interactions are secure
 * and verifiable. Think of it as a digital signature that can't be forged.
 */
export interface DigitalIdentity {
  id: string;
  ownerId: string; // userId or agentId
  ownerType: 'user' | 'agent';
  publicKey: string; // Simulated public key
  privateKeyEncrypted?: string; // Simulated encrypted private key (NEVER expose in real system)
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked' | 'suspended';
  roleIds?: string[]; // Links to Role (for RBAC)
  auditLogId?: string; // Link to AuditLog for identity actions
}

/**
 * Defines a Role for Role-Based Access Control (RBAC).
 * This is about setting rules for who can do what. For example, a user can edit their
 * own memories, while an AI "analyzer" agent can only read them to generate insights.
 * This granular control is essential for security and data privacy.
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // e.g., 'memory:read', 'memory:write', 'agent:manage', 'token:transfer'
}

/**
 * Represents a simulated AI Agent operating within the system.
 * These are the autonomous workers that help manage your history. They can analyze,
 * curate, and even help you find connections you never knew existed. Each agent has

 * its own identity and operates based on a set of skills.
 */
export interface Agent {
  id: string;
  name: string;
  type: 'analyzer' | 'curator' | 'remediator' | 'orchestrator';
  description: string;
  status: 'active' | 'suspended' | 'idle';
  skillIds: string[]; // List of skills the agent possesses
  digitalIdentityId: string; // Agent's own DigitalIdentity
  lastActivity: string;
  tokenBalance: number; // For internal operational costs
  ownerUserId?: string; // If a user 'owns' this agent instance
}

/**
 * Represents a simulated Skill an AI Agent can perform.
 * Skills are like individual tools in an agent's toolbox. One skill might be for
 * analyzing sentiment, another for generating VR scenes. This modular approach allows
 * for flexible and scalable AI capabilities. Each skill has a defined cost to use.
 */
export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  costPerUseTokens: number; // Cost for an agent to use this skill
  expectedDurationMs: number;
}

/**
 * An activity log entry for an AI Agent.
 * This provides a transparent, unchangeable record of every action an agent takes.
 * It's crucial for understanding what the AI is doing, for troubleshooting, and for
 * ensuring that the system is operating as expected. It's the foundation of accountability.
 */
export interface AgentActivityLog {
  id: string;
  agentId: string;
  timestamp: string;
  action: string; // e.g., 'memory:analyze', 'tag:create', 'asset:transcribe', 'payment:initiate'
  relatedEntityId?: string; // e.g., memoryId, assetId, transactionId
  details: { [key: string]: any };
  status: 'success' | 'failed' | 'pending';
  costInTokens?: number;
  transactionId?: string; // If this activity resulted in a token transaction
  signature?: string; // Agent's digital signature for the action
}

/**
 * Represents a simulated Token Account.
 * This is your wallet within the system's micro-economy. It holds the tokens you use
 * to pay for AI services. This makes the cost of computation clear and gives you
 * direct control over how you use the platform's more powerful features.
 */
export interface TokenAccount {
  id: string;
  ownerId: string; // userId or agentId
  ownerType: 'user' | 'agent';
  balance: number;
  currency: 'HST'; // Historian Stable Token
  createdAt: string;
  lastUpdated: string;
}

/**
 * Represents a simulated Token Transaction.
 * Every time tokens are spent, earned, or transferred, a transaction record is created.
 * This provides a complete, auditable history of all value exchange in the system,
 * ensuring financial integrity and transparency. It's the ledger for the internal economy.
 */
export interface TokenTransaction {
  id: string;
  timestamp: string;
  senderId: string; // TokenAccount ID
  receiverId: string; // TokenAccount ID
  amount: number;
  currency: 'HST';
  type: 'mint' | 'burn' | 'transfer' | 'fee' | 'reward';
  status: 'pending' | 'completed' | 'failed' | 'reverted';
  description: string;
  associatedJobId?: string; // e.g., DataProcessingJob ID
  signature: string; // Cryptographic signature of the transaction
  rail?: 'rail_fast' | 'rail_batch'; // Simulated payment rail
  metadata?: { [key: string]: any }; // Idempotency key, risk score, etc.
}

/**
 * A Data Processing Job, typically initiated by a user and executed by agents.
 * This represents a specific, high-value task, like "analyze this memory completely"
 * or "generate a VR experience." It bundles together all the agent actions and token
 * costs for a single, manageable, and auditable piece of work.
 */
export interface DataProcessingJob {
  id: string;
  initiatorId: string; // userId
  targetMemoryId: string;
  jobType: 'full_analysis' | 'vr_generation' | 'sentiment_reanalysis' | 'asset_transcription';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedCostTokens: number;
  actualCostTokens?: number;
  agentActivityLogIds: string[]; // Links to AgentActivityLog entries
  finalTransactionId?: string; // Overall transaction for the job
  outputDetails?: { [key: string]: any }; // e.g., new insights, VR URL
}

// --- Mock Data Store & API Simulation ---

let mockMemories: Memory[] = Array.from({ length: 500 }).map((_, i) => ({
  id: `mem-${i}`,
  title: `Memory Title ${i + 1}: ${i % 3 === 0 ? 'Travel' : i % 3 === 1 ? 'Family' : 'Work Event'}`,
  summary: `A brief summary of Memory ${i + 1}. This memory highlights key events and emotions from the period.`,
  description: `A more detailed narrative for Memory ${i + 1}. This section could contain a rich text account, including specific anecdotes, challenges faced, and lessons learned. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  timestamp: new Date(Date.now() - (500 - i) * 86400000 * 5).toISOString(), // Spread over 5 years
  endDate: (i % 7 === 0) ? new Date(Date.now() - (500 - i) * 86400000 * 5 + 86400000).toISOString() : undefined,
  locationId: `loc-${i % 10}`,
  peopleIds: i % 5 === 0 ? [`person-${i % 20}`, `person-${(i + 1) % 20}`] : [`person-${i % 20}`],
  tagIds: i % 4 === 0 ? [`tag-${i % 5}`, `tag-${(i + 1) % 5}`] : [`tag-${i % 5}`],
  assets: Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, assetIdx) => ({
    id: `asset-${i}-${assetIdx}`,
    type: ['PHOTO', 'VIDEO', 'DOCUMENT', 'EMAIL'][Math.floor(Math.random() * 4)] as AssetType,
    url: `#asset-url-${i}-${assetIdx}`,
    thumbnailUrl: `https://picsum.photos/seed/${i}-${assetIdx}/200/200`,
    caption: `Asset ${assetIdx + 1} for Memory ${i + 1}`,
    timestamp: new Date(Date.now() - (500 - i) * 86400000 * 5 + assetIdx * 3600000).toISOString(),
    aiAnalyzed: Math.random() > 0.3,
  })),
  sentiment: ['positive', 'neutral', 'negative', 'mixed'][Math.floor(Math.random() * 4)] as any,
  sourceAIModels: i % 2 === 0 ? [{ modelName: 'GPT-4', version: '4.0', timestamp: new Date().toISOString(), confidenceScore: 0.95, costInTokens: 10, transactionId: `txn-${Math.floor(Math.random() * 100)}` }] : [],
  linkedMemoryIds: i % 10 === 0 && i < 490 ? [`mem-${i + 10}`] : [],
  originalSources: [{ type: 'Google Drive', url: '#google-drive', identifier: `doc-${i}` }],
  notes: i % 6 === 0 ? `AI suggests this memory is highly significant due to its emotional valence.` : undefined,
  status: 'published',
  visibility: 'private',
  vrExperienceUrl: i % 15 === 0 ? `#vr-exp-${i}` : undefined,
  aiGeneratedInsights: i % 3 === 0 ? [`Potential link to early career decisions.`, `Shows recurring themes of innovation.`] : [],
  relevanceScore: Math.random() * 100,
  agentProcessingJobId: i % 5 === 0 ? `job-${Math.floor(Math.random() * 50)}` : undefined,
  processingCostTokenId: i % 5 === 0 ? `txn-${Math.floor(Math.random() * 100)}` : undefined,
}));

let mockPeople: Person[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `person-${i}`,
  name: `Person Name ${i + 1}`,
  avatarUrl: `https://api.lorem.space/image/face?w=100&h=100&r=${i}`,
  bio: `A close acquaintance. Interested in ${i % 2 === 0 ? 'tech' : 'art'}.`,
  relationship: i % 3 === 0 ? 'Family' : i % 3 === 1 ? 'Friend' : 'Colleague',
  tags: i % 2 === 0 ? ['Close', 'Supportive'] : ['Distant'],
  digitalIdentityId: `id-${i % 3 === 0 ? 'user' : 'agent'}-${i}`,
}));

let mockLocations: Location[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `loc-${i}`,
  name: `Location ${i + 1}`,
  coordinates: { lat: 34 + i * 0.1, lng: -118 + i * 0.1 },
  description: `A significant place in my history.`,
  type: ['city', 'country', 'landmark', 'home'][i % 4] as any,
  tags: ['Visited', 'Lived'],
}));

let mockTags: Tag[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `tag-${i}`,
  name: `tag_${i + 1}`,
  category: ['Event', 'Emotion', 'Topic', 'People'][i % 4],
  color: ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'][i % 5],
}));

let mockUserProfile: UserProfile = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://api.lorem.space/image/face?w=100&h=100&r=20',
  bio: 'Avid memory collector and AI enthusiast.',
  preferences: {
    theme: 'dark',
    defaultView: 'dashboard',
    notificationSettings: {
      memoryAnniversaries: true,
      newInsights: true,
      aiProcessingComplete: false,
      agentActivityAlerts: true,
      transactionNotifications: true,
    },
    privacySettings: {
      dataRetentionDays: 3650,
      anonymizeInsights: false,
      allowAIContextLearning: true,
    },
    language: 'en-US',
    defaultTimezone: 'America/Los_Angeles',
  },
  digitalIdentityId: 'id-user-123',
  tokenAccountId: 'acc-user-123',
};

let mockAISettings: AISettings = {
  enableAutoTagging: true,
  enableSentimentAnalysis: true,
  enableVRSceneGeneration: false,
  preferredTranscriptionModel: 'WhisperV3',
  preferredImageAnalysisModel: 'VisionPro',
  preferredChatModel: 'Gemini-Pro',
  aiModelAccessKeys: {
    'GPT-4': 'sk-...',
    'WhisperV3': 'sk-...',
  },
  autoProcessNewMemories: true,
  maxMonthlyAICostTokens: 5000,
};

let mockNotifications: Notification[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `notif-${i}`,
  type: ['info', 'warning', 'success', 'agent', 'transaction'][i % 5] as any,
  message: `Notification ${i + 1}: ${i % 2 === 0 ? 'New insight available!' : 'Memory processing complete.'}`,
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  read: i < 2,
  actionUrl: i % 2 === 0 ? `#insight-${i}` : undefined,
  relatedEntityId: i % 3 === 0 ? `mem-${i * 10}` : `agent-${i}`,
}));

let mockSearchHistory: SearchHistoryEntry[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `sh-${i}`,
  query: i % 3 === 0 ? 'vacation in europe' : i % 3 === 1 ? 'my first job' : 'family reunion',
  timestamp: new Date(Date.now() - i * 7200000).toISOString(),
  resultCount: Math.floor(Math.random() * 10) + 1,
}));

let mockRecommendations: Recommendation[] = Array.from({ length: 7 }).map((_, i) => ({
  id: `rec-${i}`,
  type: ['related_memory', 'insight', 'action_item', 'anniversary', 'agent_suggestion'][i % 5] as any,
  title: `Recommendation ${i + 1}: ${i % 2 === 0 ? 'Memory Anniversary!' : 'Deep Insight Uncovered'}`,
  description: `This is a detailed description of recommendation ${i + 1}. AI analysis suggests you might find this relevant.`,
  relatedMemoryId: i % 2 === 0 ? `mem-${i * 10}` : undefined,
  actionUrl: `#rec-action-${i}`,
  timestamp: new Date(Date.now() - i * 1800000).toISOString(),
  priority: ['low', 'medium', 'high'][i % 3] as any,
  agentId: `agent-${i % 2}`,
}));

let mockDigitalIdentities: DigitalIdentity[] = [
  {
    id: 'id-user-123', ownerId: 'user-123', ownerType: 'user',
    publicKey: 'pk-user-123-abcdef123456', privateKeyEncrypted: 'ek-user-123-xyz789',
    createdAt: new Date().toISOString(), lastUsed: new Date().toISOString(),
    status: 'active', roleIds: ['role-user'], auditLogId: 'audit-user-123',
  },
  {
    id: 'id-agent-analyzer-001', ownerId: 'agent-analyzer-001', ownerType: 'agent',
    publicKey: 'pk-agent-analyzer-001-fede4321', privateKeyEncrypted: 'ek-agent-analyzer-001-abc987',
    createdAt: new Date().toISOString(), lastUsed: new Date().toISOString(),
    status: 'active', roleIds: ['role-agent-analyzer'], auditLogId: 'audit-agent-analyzer-001',
  },
  {
    id: 'id-agent-curator-002', ownerId: 'agent-curator-002', ownerType: 'agent',
    publicKey: 'pk-agent-curator-002-abcd1234', privateKeyEncrypted: 'ek-agent-curator-002-wxyz5678',
    createdAt: new Date().toISOString(), lastUsed: new Date().toISOString(),
    status: 'active', roleIds: ['role-agent-curator'], auditLogId: 'audit-agent-curator-002',
  },
];

let mockRoles: Role[] = [
  { id: 'role-user', name: 'Standard User', description: 'Can create/edit/delete own memories, view basic insights.', permissions: ['memory:read', 'memory:write', 'identity:view'] },
  { id: 'role-admin', name: 'Administrator', description: 'Full system access.', permissions: ['*:*'] },
  { id: 'role-agent-analyzer', name: 'AI Analyzer Agent', description: 'Can analyze memories for sentiment, tags, insights.', permissions: ['memory:read', 'memory:update:insights', 'tag:create', 'asset:read'] },
  { id: 'role-agent-curator', name: 'AI Curator Agent', description: 'Can organize memories, suggest links, create VR scenes.', permissions: ['memory:read', 'memory:update:structure', 'memory:update:vr', 'location:read', 'person:read'] },
];

let mockAgents: Agent[] = [
  {
    id: 'agent-analyzer-001', name: 'Insight Agent', type: 'analyzer',
    description: 'Specializes in deep semantic analysis and insight generation.',
    status: 'active', skillIds: ['skill-sentiment', 'skill-tagging'],
    digitalIdentityId: 'id-agent-analyzer-001', lastActivity: new Date().toISOString(),
    tokenBalance: 1000, ownerUserId: 'user-123',
  },
  {
    id: 'agent-curator-002', name: 'Archivist Agent', type: 'curator',
    description: 'Manages memory organization, links related events, and generates VR experiences.',
    status: 'idle', skillIds: ['skill-linking', 'skill-vr'],
    digitalIdentityId: 'id-agent-curator-002', lastActivity: new Date(Date.now() - 86400000).toISOString(),
    tokenBalance: 800, ownerUserId: 'user-123',
  },
];

let mockAgentSkills: AgentSkill[] = [
  { id: 'skill-sentiment', name: 'Sentiment Analysis', description: 'Analyzes emotional tone of memory content.', costPerUseTokens: 5, expectedDurationMs: 500 },
  { id: 'skill-tagging', name: 'Auto-Tagging', description: 'Automatically applies relevant tags to memories.', costPerUseTokens: 3, expectedDurationMs: 300 },
  { id: 'skill-linking', name: 'Memory Linking', description: 'Identifies and suggests links between related memories.', costPerUseTokens: 8, expectedDurationMs: 800 },
  { id: 'skill-vr', name: 'VR Scene Generation', description: 'Generates a virtual reality experience from memory details and assets.', costPerUseTokens: 50, expectedDurationMs: 5000 },
];

let mockAgentActivityLogs: AgentActivityLog[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `agent-log-${i}`,
  agentId: i % 2 === 0 ? 'agent-analyzer-001' : 'agent-curator-002',
  timestamp: new Date(Date.now() - i * 1200000).toISOString(),
  action: i % 3 === 0 ? 'memory:analyze' : i % 3 === 1 ? 'tag:create' : 'memory:update',
  relatedEntityId: `mem-${i * 10}`,
  details: i % 3 === 0 ? { tagsAdded: ['new_tag'], sentiment: 'positive' } : { description: 'Updated for clarity' },
  status: i % 5 === 0 ? 'failed' : 'success',
  costInTokens: i % 3 === 0 ? 5 : 3,
  transactionId: `txn-${Math.floor(Math.random() * 100)}`,
  signature: `sig-agent-log-${i}-xyz`, // Simulated signature
}));

let mockTokenAccounts: TokenAccount[] = [
  { id: 'acc-user-123', ownerId: 'user-123', ownerType: 'user', balance: 1500, currency: 'HST', createdAt: new Date().toISOString(), lastUpdated: new Date().toISOString() },
  { id: 'acc-agent-analyzer-001', ownerId: 'agent-analyzer-001', ownerType: 'agent', balance: 1000, currency: 'HST', createdAt: new Date().toISOString(), lastUpdated: new Date().toISOString() },
  { id: 'acc-agent-curator-002', ownerId: 'agent-curator-002', ownerType: 'agent', balance: 800, currency: 'HST', createdAt: new Date().toISOString(), lastUpdated: new Date().toISOString() },
  { id: 'acc-system-fees', ownerId: 'system', ownerType: 'agent', balance: 5000, currency: 'HST', createdAt: new Date().toISOString(), lastUpdated: new Date().toISOString() },
];

let mockTokenTransactions: TokenTransaction[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `txn-${i}`,
  timestamp: new Date(Date.now() - i * 360000).toISOString(),
  senderId: i % 2 === 0 ? 'acc-user-123' : 'acc-agent-analyzer-001',
  receiverId: i % 2 === 0 ? 'acc-agent-analyzer-001' : 'acc-system-fees',
  amount: Math.floor(Math.random() * 20) + 1,
  currency: 'HST',
  type: i % 5 === 0 ? 'mint' : i % 5 === 1 ? 'burn' : 'fee',
  status: i % 10 === 0 ? 'failed' : 'completed',
  description: i % 3 === 0 ? 'AI analysis fee' : 'Memory processing reward',
  associatedJobId: `job-${Math.floor(Math.random() * 50)}`,
  signature: `sig-txn-${i}-abc`, // Simulated cryptographic signature
  rail: i % 2 === 0 ? 'rail_fast' : 'rail_batch', // Simulated rail
  metadata: { idempotencyKey: `idem-${i}-${Date.now()}` },
}));

let mockDataProcessingJobs: DataProcessingJob[] = Array.from({ length: 50 }).map((_, i) => {
  const jobType: DataProcessingJob['jobType'] = ['full_analysis', 'vr_generation', 'sentiment_reanalysis', 'asset_transcription'][i % 4] as any;
  const estimatedCost = jobType === 'vr_generation' ? 50 : (jobType === 'full_analysis' ? 15 : 5);
  return {
    id: `job-${i}`,
    initiatorId: 'user-123',
    targetMemoryId: `mem-${i * 10}`,
    jobType: jobType,
    status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'in_progress' : 'pending',
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    startedAt: i % 3 === 0 || i % 3 === 1 ? new Date(Date.now() - i * 86400000 + 3600000).toISOString() : undefined,
    completedAt: i % 3 === 0 ? new Date(Date.now() - i * 86400000 + 7200000).toISOString() : undefined,
    estimatedCostTokens: estimatedCost,
    actualCostTokens: i % 3 === 0 ? estimatedCost + Math.floor(Math.random() * 2) : undefined,
    agentActivityLogIds: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
      (_, actIdx) => `agent-log-${(i + actIdx) % mockAgentActivityLogs.length}`
    ),
    finalTransactionId: i % 3 === 0 ? `txn-${(i * 2) % mockTokenTransactions.length}` : undefined,
    outputDetails: jobType === 'vr_generation' && i % 3 === 0 ? { vrExperienceUrl: `#generated-vr-${i}` } : undefined,
  };
});

let mockConversations: AIConversation[] = [
    {
        id: 'convo-1',
        title: 'Discussing my trip to Italy',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        messages: [
            { id: 'msg-1', role: 'user', content: 'Tell me about my trip to Italy in 2022.', timestamp: new Date(Date.now() - 86400000).toISOString() },
            { id: 'msg-2', role: 'ai', content: 'Of course! I found several memories related to Italy. It seems you visited Rome and Florence. One highlight was a visit to the Colosseum. Would you like to know more about that?', timestamp: new Date(Date.now() - 86400000).toISOString(), relatedMemoryIds: ['mem-10', 'mem-11'] },
        ]
    }
];


// Helper for simulating cryptographic operations (simplified for front-end mock)
export const cryptoSim = {
  generateKeyPair: async (): Promise<{ publicKey: string; privateKey: string }> => {
    await delay(100);
    const publicKey = `pk-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const privateKey = `prk-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    return { publicKey, privateKey };
  },
  sign: async (data: string, privateKey: string): Promise<string> => {
    await delay(50);
    const combinedData = data + privateKey.substring(0, 10);
    const hash = btoa(combinedData).substring(0, 20);
    return `sig-${hash}`;
  },
  verify: async (data: string, signature: string, publicKey: string): Promise<boolean> => {
    await delay(50);
    if (!signature.startsWith('sig-')) return false;
    const mockPrivateKeyPart = 'prk-mock_key_part';
    const expectedHashPart = btoa(data + mockPrivateKeyPart).substring(0, 20);
    return signature.includes(expectedHashPart);
  },
  encrypt: async (data: string, publicKey: string): Promise<string> => {
    await delay(50);
    return `enc-${btoa(data)}-${publicKey.substring(0, 10)}`;
  },
  decrypt: async (encryptedData: string, privateKey: string): Promise<string> => {
    await delay(50);
    const parts = encryptedData.split('-');
    if (parts.length > 1 && parts[0] === 'enc') {
      try {
        const decoded = atob(parts[1]);
        return decoded;
      } catch (e) {
        console.error("Mock decryption error:", e);
        return 'Decryption failed (mock)';
      }
    }
    return 'Decryption failed (invalid format)';
  }
};


export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  getMemories: async (params?: { query?: string; tagIds?: string[]; peopleIds?: string[]; locationId?: string; startDate?: string; endDate?: string; sentiment?: string; limit?: number; offset?: number; }) => {
    await delay(500 + Math.random() * 1000);
    let filtered = [...mockMemories];

    if (params?.query) {
      const lowerQuery = params.query.toLowerCase();
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.summary.toLowerCase().includes(lowerQuery) ||
        m.description?.toLowerCase().includes(lowerQuery) ||
        m.notes?.toLowerCase().includes(lowerQuery) ||
        m.aiGeneratedInsights?.some(insight => insight.toLowerCase().includes(lowerQuery))
      );
    }
    if (params?.tagIds && params.tagIds.length > 0) {
      filtered = filtered.filter(m => m.tagIds?.some(tid => params.tagIds!.includes(tid)));
    }
    if (params?.peopleIds && params.peopleIds.length > 0) {
      filtered = filtered.filter(m => m.peopleIds?.some(pid => params.peopleIds!.includes(pid)));
    }
    if (params?.locationId) {
      filtered = filtered.filter(m => m.locationId === params.locationId);
    }
    if (params?.startDate) {
      filtered = filtered.filter(m => m.timestamp >= params.startDate!);
    }
    if (params?.endDate) {
      filtered = filtered.filter(m => m.timestamp <= params.endDate!);
    }
    if (params?.sentiment) {
      filtered = filtered.filter(m => m.sentiment === params.sentiment);
    }

    const total = filtered.length;
    const offset = params.offset || 0;
    const limit = params.limit || 20;
    const paginated = filtered.slice(offset, offset + limit);

    return { data: paginated, total };
  },
  getMemoryById: async (id: string): Promise<Memory | null> => {
    await delay(300 + Math.random() * 700);
    return mockMemories.find(m => m.id === id) || null;
  },
  createMemory: async (memory: Partial<Memory>): Promise<Memory> => {
    await delay(1000 + Math.random() * 500);
    const newMemory: Memory = {
      ...memory as Memory,
      id: `mem-${mockMemories.length + 1}`,
      timestamp: memory.timestamp || new Date().toISOString(),
      assets: memory.assets || [],
      summary: memory.summary || memory.title || 'Untitled Memory',
      status: 'draft',
      visibility: 'private',
    };
    mockMemories.unshift(newMemory); // Add to beginning for freshness
    // Simulate auto-processing if enabled
    if (mockAISettings.autoProcessNewMemories && mockUserProfile.id) {
      api.processMemoryForInsights(newMemory.id, mockUserProfile.id);
    }
    return newMemory;
  },
  updateMemory: async (id: string, updates: Partial<Memory>): Promise<Memory | null> => {
    await delay(800 + Math.random() * 400);
    const index = mockMemories.findIndex(m => m.id === id);
    if (index === -1) return null;
    const updatedMemory = { ...mockMemories[index], ...updates };
    mockMemories[index] = updatedMemory;
    return updatedMemory;
  },
  deleteMemory: async (id: string): Promise<boolean> => {
    await delay(600 + Math.random() * 300);
    const initialLength = mockMemories.length;
    const memoryIndex = mockMemories.findIndex(m => m.id === id);
    if (memoryIndex !== -1) {
      mockMemories.splice(memoryIndex, 1);
      // Simulate audit log for deletion
      const logEntry: AgentActivityLog = {
        id: `audit-delete-${Date.now()}`,
        agentId: 'system-governance-agent', // Placeholder for a system agent
        timestamp: new Date().toISOString(),
        action: 'memory:delete',
        relatedEntityId: id,
        details: { userId: mockUserProfile.id, memoryTitle: `Deleted memory ${id}` },
        status: 'success',
        costInTokens: 0,
        signature: await cryptoSim.sign(`memory_delete_${id}_${mockUserProfile.id}`, 'system_private_key'),
      };
      mockAgentActivityLogs.unshift(logEntry);
    }
    return mockMemories.length < initialLength;
  },
  getPeople: async () => {
    await delay(200);
    return mockPeople;
  },
  getLocations: async () => {
    await delay(200);
    return mockLocations;
  },
  getTags: async () => {
    await delay(200);
    return mockTags;
  },
  getUserProfile: async (): Promise<UserProfile> => {
    await delay(300);
    return mockUserProfile;
  },
  updateUserProfile: async (profile: UserProfile): Promise<UserProfile> => {
    await delay(500);
    Object.assign(mockUserProfile, profile);
    return mockUserProfile;
  },
  getAISettings: async (): Promise<AISettings> => {
    await delay(300);
    return mockAISettings;
  },
  updateAISettings: async (settings: AISettings): Promise<AISettings> => {
    await delay(500);
    Object.assign(mockAISettings, settings);
    return mockAISettings;
  },
  getNotifications: async (): Promise<Notification[]> => {
    await delay(300);
    return mockNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  markNotificationAsRead: async (id: string): Promise<Notification | null> => {
    await delay(200);
    const notif = mockNotifications.find(n => n.id === id);
    if (notif) notif.read = true;
    return notif || null;
  },
  getSearchHistory: async (): Promise<SearchHistoryEntry[]> => {
    await delay(300);
    return mockSearchHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  addSearchHistoryEntry: async (query: string, resultCount: number): Promise<SearchHistoryEntry> => {
    await delay(100);
    const newEntry: SearchHistoryEntry = {
      id: `sh-${mockSearchHistory.length + 1}`,
      query,
      timestamp: new Date().toISOString(),
      resultCount,
    };
    mockSearchHistory.unshift(newEntry);
    return newEntry;
  },
  getRecommendations: async (): Promise<Recommendation[]> => {
    await delay(400);
    return mockRecommendations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  uploadAsset: async (file: File): Promise<Asset> => {
    await delay(1500 + Math.random() * 1000);
    console.log('Uploading file:', file.name);
    return {
      id: `asset-${Date.now()}`,
      type: file.type.startsWith('image/') ? 'PHOTO' : file.type.startsWith('video/') ? 'VIDEO' : 'DOCUMENT',
      url: `https://mockstorage.com/assets/${file.name}`,
      thumbnailUrl: `https://mockstorage.com/thumbnails/${file.name}`,
      caption: file.name,
      timestamp: new Date().toISOString(),
      sourceApp: 'PersonalHistorianUploader',
      aiAnalyzed: false,
    };
  },

  // --- New API functions for Chat ---
  getConversations: async (): Promise<AIConversation[]> => {
      await delay(200);
      return mockConversations;
  },
  postChatMessage: async (conversationId: string, message: string): Promise<ChatMessage> => {
      await delay(1500 + Math.random() * 1000); // Simulate AI thinking time
      const conversation = mockConversations.find(c => c.id === conversationId);
      if (!conversation) throw new Error("Conversation not found");

      const lowerMessage = message.toLowerCase();
      const searchResults = mockMemories.filter(m =>
          m.title.toLowerCase().includes(lowerMessage) ||
          m.summary.toLowerCase().includes(lowerMessage) ||
          m.description?.toLowerCase().includes(lowerMessage)
      ).slice(0, 3); // Find up to 3 relevant memories

      let aiContent: string;
      const relatedMemoryIds: string[] = searchResults.map(m => m.id);

      if (searchResults.length > 0) {
          aiContent = `I found ${searchResults.length} memory that seems related to your query. The most relevant one is titled "${searchResults[0].title}".\n\nHere's a brief summary: "${searchResults[0].summary}". I can provide more details if you like.`;
      } else {
          aiContent = `I couldn't find any specific memories related to "${message}". Could you try rephrasing or asking about something else?`;
      }

      const aiResponse: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'ai',
          content: aiContent,
          timestamp: new Date().toISOString(),
          relatedMemoryIds,
      };

      conversation.messages.push({
          id: `msg-${Date.now() - 1}`,
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
      });
      conversation.messages.push(aiResponse);

      return aiResponse;
  },

  // --- New API functions for Money20/20 architecture ---

  getDigitalIdentity: async (identityId: string): Promise<DigitalIdentity | null> => {
    await delay(200);
    return mockDigitalIdentities.find(id => id.id === identityId) || null;
  },
  generateDigitalIdentity: async (ownerId: string, ownerType: 'user' | 'agent', roleIds: string[]): Promise<DigitalIdentity> => {
    await delay(1000);
    const { publicKey, privateKey } = await cryptoSim.generateKeyPair();
    const encryptedPrivateKey = await cryptoSim.encrypt(privateKey, publicKey);
    const newIdentity: DigitalIdentity = {
      id: `id-${ownerType}-${ownerId}-${Date.now()}`,
      ownerId,
      ownerType,
      publicKey,
      privateKeyEncrypted: encryptedPrivateKey,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      status: 'active',
      roleIds,
      auditLogId: `audit-log-${Date.now()}`,
    };
    mockDigitalIdentities.push(newIdentity);
    return newIdentity;
  },
  getAgentProfile: async (agentId: string): Promise<Agent | null> => {
    await delay(200);
    return mockAgents.find(a => a.id === agentId) || null;
  },
  getAgents: async (): Promise<Agent[]> => {
    await delay(200);
    return mockAgents;
  },
  getAgentSkills: async (): Promise<AgentSkill[]> => {
    await delay(150);
    return mockAgentSkills;
  },
  getAgentActivityLogs: async (agentId?: string, relatedEntityId?: string): Promise<AgentActivityLog[]> => {
    await delay(300);
    let logs = [...mockAgentActivityLogs];
    if (agentId) logs = logs.filter(log => log.agentId === agentId);
    if (relatedEntityId) logs = logs.filter(log => log.relatedEntityId === relatedEntityId);
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  getTokenAccount: async (accountId: string): Promise<TokenAccount | null> => {
    await delay(200);
    return mockTokenAccounts.find(acc => acc.id === accountId) || null;
  },
  getTokenTransactions: async (accountId?: string): Promise<TokenTransaction[]> => {
    await delay(400);
    let transactions = [...mockTokenTransactions];
    if (accountId) {
      transactions = transactions.filter(txn => txn.senderId === accountId || txn.receiverId === accountId);
    }
    return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  /**
   * Simulates an AI agent processing a memory. This includes cost deduction and log generation.
   * This is where the magic happens: a user request kicks off an autonomous workflow.
   * Agents use their skills, tokens are exchanged for their work, and a detailed audit
   * trail is created. It's a live demonstration of the programmable value rails in action.
   */
  processMemoryForInsights: async (memoryId: string, initiatorId: string, options?: { forceVR?: boolean; reanalyzeSentiment?: boolean }): Promise<DataProcessingJob> => {
    await delay(2000 + Math.random() * 1000); // Simulate AI processing time

    const memory = mockMemories.find(m => m.id === memoryId);
    if (!memory) throw new Error('Memory not found for processing.');

    const userTokenAccount = mockTokenAccounts.find(acc => acc.ownerId === initiatorId && acc.ownerType === 'user');
    if (!userTokenAccount) throw new Error('User token account not found.');

    const userDigitalIdentity = mockDigitalIdentities.find(id => id.ownerId === initiatorId && id.ownerType === 'user');
    if (!userDigitalIdentity) throw new Error('User digital identity not found for signing transactions.');

    let totalCost = 0;
    const agentActivityLogIds: string[] = [];
    const insights: string[] = [];
    let transactionIds: string[] = [];

    const job: DataProcessingJob = {
      id: `job-${mockDataProcessingJobs.length + 1}`,
      initiatorId,
      targetMemoryId: memoryId,
      jobType: options?.forceVR ? 'vr_generation' : 'full_analysis',
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      estimatedCostTokens: 0, // Will be updated
      agentActivityLogIds: [],
    };
    mockDataProcessingJobs.unshift(job); // Add job immediately

    const processSkill = async (skillId: string, agentId: string, relatedMemory: Memory, action: string) => {
      const skill = mockAgentSkills.find(s => s.id === skillId);
      if (!skill) return;

      const agentAccount = mockTokenAccounts.find(acc => acc.ownerId === agentId);
      if (!agentAccount) {
        console.error(`Agent account for ${agentId} not found.`);
        return;
      }

      // Pre-flight check for user balance
      if (userTokenAccount.balance < skill.costPerUseTokens) {
        throw new Error(`Insufficient tokens for skill '${skill.name}'. Required: ${skill.costPerUseTokens}, Available: ${userTokenAccount.balance}`);
      }

      // Deduct from user, credit to agent (simplified, in real token rail, it's more complex)
      userTokenAccount.balance -= skill.costPerUseTokens;
      agentAccount.balance += skill.costPerUseTokens;
      totalCost += skill.costPerUseTokens;

      const transactionData = `txn_data_${job.id}_${skillId}_${new Date().getTime()}`; // Ensure unique data for signature
      const transactionSignature = await cryptoSim.sign(transactionData, userDigitalIdentity.privateKeyEncrypted || 'mock_user_private_key'); // Use user's ID for signing

      const transaction: TokenTransaction = {
        id: `txn-${mockTokenTransactions.length + 1}`,
        timestamp: new Date().toISOString(),
        senderId: userTokenAccount.id,
        receiverId: agentAccount.id,
        amount: skill.costPerUseTokens,
        currency: 'HST',
        type: 'fee',
        status: 'completed',
        description: `Fee for ${skill.name} on memory ${relatedMemory.id}`,
        associatedJobId: job.id,
        signature: transactionSignature,
        rail: 'rail_fast',
        metadata: { idempotencyKey: `idem-${job.id}-${skillId}-${Date.now()}`, riskScore: Math.floor(Math.random() * 10) },
      };
      mockTokenTransactions.unshift(transaction);
      transactionIds.push(transaction.id);


      const agentDigitalIdentity = mockDigitalIdentities.find(id => id.ownerId === agentId && id.ownerType === 'agent');
      const agentSignature = await cryptoSim.sign(`agent_log_data_${relatedMemory.id}_${agentId}_${Date.now()}`, agentDigitalIdentity?.privateKeyEncrypted || 'mock_agent_private_key');

      const agentLog: AgentActivityLog = {
        id: `agent-log-${mockAgentActivityLogs.length + 1}`,
        agentId,
        timestamp: new Date().toISOString(),
        action,
        relatedEntityId: relatedMemory.id,
        details: { skill: skill.name, cost: skill.costPerUseTokens, transactionId: transaction.id },
        status: 'success',
        costInTokens: skill.costPerUseTokens,
        transactionId: transaction.id,
        signature: agentSignature,
      };
      mockAgentActivityLogs.unshift(agentLog);
      agentActivityLogIds.push(agentLog.id);

      // Simulate output
      if (skill.id === 'skill-sentiment') {
        const sentiments = ['positive', 'neutral', 'negative', 'mixed'];
        const newSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        insights.push(`Sentiment re-analyzed as ${newSentiment}.`);
        relatedMemory.sentiment = newSentiment as any;
      } else if (skill.id === 'skill-tagging') {
        const newTags = [`ai_tag_${Math.floor(Math.random() * 10)}`, `event_detail_${Math.floor(Math.random() * 10)}`];
        relatedMemory.tagIds = Array.from(new Set([...(relatedMemory.tagIds || []), ...newTags]));
        insights.push(`Added new tags: ${newTags.join(', ')}.`);
        // Also simulate creation of new tags in mockTags if they don't exist
        newTags.forEach(tagName => {
          if (!mockTags.some(t => t.name === tagName)) {
            mockTags.push({ id: `tag-${mockTags.length + 1}`, name: tagName, category: 'AI', color: '#6B5B95' });
          }
        });
      } else if (skill.id === 'skill-linking') {
        insights.push('Found 3 related memories and linked them.');
        if (!relatedMemory.linkedMemoryIds) relatedMemory.linkedMemoryIds = [];
        relatedMemory.linkedMemoryIds.push(`mem-${Math.floor(Math.random() * mockMemories.length)}`);
      } else if (skill.id === 'skill-vr') {
        const vrUrl = `https://historian.ai/vr/exp-${memoryId}-${Date.now()}`;
        relatedMemory.vrExperienceUrl = vrUrl;
        insights.push(`VR experience generated: ${vrUrl}`);
        job.outputDetails = { vrExperienceUrl: vrUrl };
      }
    };

    const analyzerAgent = mockAgents.find(a => a.id === 'agent-analyzer-001');
    const curatorAgent = mockAgents.find(a => a.id === 'agent-curator-002');

    if (analyzerAgent) {
      if (mockAISettings.enableSentimentAnalysis || options?.reanalyzeSentiment) {
        await processSkill('skill-sentiment', analyzerAgent.id, memory, 'memory:sentiment_analysis');
      }
      if (mockAISettings.enableAutoTagging) {
        await processSkill('skill-tagging', analyzerAgent.id, memory, 'memory:auto_tagging');
      }
    }

    if (curatorAgent && options?.forceVR && mockAISettings.enableVRSceneGeneration) {
      await processSkill('skill-vr', curatorAgent.id, memory, 'memory:vr_generation');
    } else if (curatorAgent && mockAISettings.enableAutoTagging) { // Assuming auto-linking happens with auto-tagging
      await processSkill('skill-linking', curatorAgent.id, memory, 'memory:auto_linking');
    }

    // Update memory insights
    if (insights.length > 0) {
      memory.aiGeneratedInsights = Array.from(new Set([...(memory.aiGeneratedInsights || []), ...insights]));
    }
    // Update sourceAIModels if not already present, aggregate costs
    const existingOrchestratorEntry = memory.sourceAIModels?.find(m => m.modelName === 'HistorianAI Orchestrator');
    if (existingOrchestratorEntry) {
        existingOrchestratorEntry.costInTokens = (existingOrchestratorEntry.costInTokens || 0) + totalCost;
        existingOrchestratorEntry.timestamp = new Date().toISOString();
        existingOrchestratorEntry.outputSummary = 'Processed by agents (updated)';
    } else {
        memory.sourceAIModels = [...(memory.sourceAIModels || []), { modelName: 'HistorianAI Orchestrator', version: '1.0', timestamp: new Date().toISOString(), outputSummary: 'Processed by agents', costInTokens: totalCost }];
    }
    memory.agentProcessingJobId = job.id;

    // Finalize job
    const finalJobIndex = mockDataProcessingJobs.findIndex(j => j.id === job.id);
    if (finalJobIndex !== -1) {
      mockDataProcessingJobs[finalJobIndex] = {
        ...mockDataProcessingJobs[finalJobIndex],
        status: 'completed',
        completedAt: new Date().toISOString(),
        actualCostTokens: totalCost,
        agentActivityLogIds: agentActivityLogIds,
        finalTransactionId: transactionIds[0] || undefined, // Link to first transaction for simplicity
      };
      // Simulate system notification for job completion
      mockNotifications.unshift({
        id: `notif-${mockNotifications.length + 1}`,
        type: 'agent',
        message: `AI processing for "${memory.title}" completed. Total cost: ${totalCost} HST.`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: `#memory-${memory.id}`,
        relatedEntityId: memory.id,
      });
    }

    // Update the memory object in mockMemories array directly
    const memoryIdx = mockMemories.findIndex(m => m.id === memoryId);
    if (memoryIdx !== -1) {
      mockMemories[memoryIdx] = memory;
    }

    return mockDataProcessingJobs[finalJobIndex];
  },

  getDataProcessingJob: async (jobId: string): Promise<DataProcessingJob | null> => {
    await delay(200);
    return mockDataProcessingJobs.find(job => job.id === jobId) || null;
  },
  getRoles: async (): Promise<Role[]> => {
    await delay(100);
    return mockRoles;
  },

  /**
   * Simulates a user-initiated token minting transaction.
   * This allows users to "top up" their account with tokens to access premium AI services.
   * It's a fundamental operation for fueling engagement and value exchange in the economy.
   */
  mintTokens: async (userId: string, amount: number): Promise<TokenTransaction> => {
    await delay(1000);
    const userAccount = mockTokenAccounts.find(acc => acc.ownerId === userId && acc.ownerType === 'user');
    if (!userAccount) throw new Error('User token account not found.');

    const userDigitalIdentity = mockDigitalIdentities.find(id => id.ownerId === userId && id.ownerType === 'user');
    if (!userDigitalIdentity) throw new Error('User digital identity not found for signing transactions.');

    // Simulate system account for minting source
    let systemAccount = mockTokenAccounts.find(acc => acc.ownerId === 'system');
    if (!systemAccount) {
      systemAccount = { id: 'acc-system-fees', ownerId: 'system', ownerType: 'agent', balance: 1000000, currency: 'HST', createdAt: new Date().toISOString(), lastUpdated: new Date().toISOString() };
      mockTokenAccounts.push(systemAccount);
    }

    userAccount.balance += amount; // Directly update user's balance
    systemAccount.balance -= amount; // Simulate system "issuing" tokens

    const transactionData = `mint_data_${userId}_${amount}_${new Date().getTime()}`;
    const transactionSignature = await cryptoSim.sign(transactionData, userDigitalIdentity.privateKeyEncrypted || 'mock_user_private_key');

    const transaction: TokenTransaction = {
      id: `txn-${mockTokenTransactions.length + 1}`,
      timestamp: new Date().toISOString(),
      senderId: systemAccount.id, // System is the sender of new tokens
      receiverId: userAccount.id,
      amount: amount,
      currency: 'HST',
      type: 'mint',
      status: 'completed',
      description: `User initiated token mint of ${amount} HST`,
      signature: transactionSignature,
      rail: 'rail_fast', // Minting usually fast
      metadata: { idempotencyKey: `mint-${userId}-${Date.now()}` },
    };
    mockTokenTransactions.unshift(transaction);

    mockNotifications.unshift({
      id: `notif-${mockNotifications.length + 1}`,
      type: 'transaction',
      message: `${amount} HST successfully minted to your account.`,
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: `#transaction-${transaction.id}`,
      relatedEntityId: transaction.id,
    });

    return transaction;
  }
};

// --- Context for Global State (Simplified for single file) ---
interface GlobalState {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  aiSettings: AISettings | null;
  setAiSettings: React.Dispatch<React.SetStateAction<AISettings | null>>;
  allPeople: Person[];
  allLocations: Location[];
  allTags: Tag[];
  fetchStaticData: () => Promise<void>;
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  userDigitalIdentity: DigitalIdentity | null;
  setUserDigitalIdentity: React.Dispatch<React.SetStateAction<DigitalIdentity | null>>;
  userTokenAccount: TokenAccount | null;
  setUserTokenAccount: React.Dispatch<React.SetStateAction<TokenAccount | null>>;
  allAgents: Agent[];
  allAgentSkills: AgentSkill[];
  fetchAgentData: () => Promise<void>;
}

const AppContext = createContext<GlobalState | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// --- Reusable UI Components (internal to this file, but exported for the prompt's requirement) ---

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
    <p className="ml-3 text-gray-400">Loading...</p>
  </div>
);

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-900 border border-red-700 text-red-200 p-3 rounded mt-4">
    <p>Error: {message}</p>
  </div>
);

export const AssetPreview: React.FC<{ asset: Asset }> = ({ asset }) => {
  const renderAsset = () => {
    if (asset.type === 'PHOTO' || asset.type === 'VIDEO') {
      return (
        <img src={asset.thumbnailUrl || asset.url} alt={asset.caption || asset.type} className="w-full h-32 object-cover rounded" />
      );
    } else if (asset.type === 'AUDIO') {
      return <audio controls src={asset.url} className="w-full" />;
    }
    return (
      <div className="bg-gray-700 p-2 rounded flex items-center justify-center h-32">
        <span className="text-sm text-gray-400">{asset.type} Preview</span>
      </div>
    );
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden flex-shrink-0 w-48">
      {renderAsset()}
      <div className="p-2 text-sm">
        <p className="font-semibold text-cyan-400 truncate">{asset.caption || asset.type}</p>
        <p className="text-gray-500 text-xs">{new Date(asset.timestamp || '').toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export const TagPill: React.FC<{ tagId: string }> = ({ tagId }) => {
  const { allTags } = useAppContext();
  const tag = allTags.find(t => t.id === tagId);
  if (!tag) return null;
  return (
    <span style={{ backgroundColor: tag.color || '#6B7280' }} className="inline-block text-white text-xs px-2 py-1 rounded-full mr-2 mb-2 opacity-90">
      {tag.name}
    </span>
  );
};

export const PersonAvatar: React.FC<{ personId: string }> = ({ personId }) => {
  const { allPeople } = useAppContext();
  const person = allPeople.find(p => p.id === personId);
  if (!person) return null;
  return (
    <div className="flex items-center space-x-2 mr-4">
      <img src={person.avatarUrl || 'https://api.lorem.space/image/face?w=40&h=40&r=0'} alt={person.name} className="w-8 h-8 rounded-full object-cover" />
      <span className="text-sm text-cyan-400">{person.name}</span>
    </div>
  );
};

export const LocationBadge: React.FC<{ locationId: string }> = ({ locationId }) => {
  const { allLocations } = useAppContext();
  const location = allLocations.find(l => l.id === locationId);
  if (!location) return null;
  return (
    <span className="inline-flex items-center bg-gray-700 text-gray-300 text-xs px-2.5 py-0.5 rounded-full mr-2 mb-2">
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
      {location.name}
    </span>
  );
};

// --- Feature-Specific Components (exported as per requirement) ---

/**
 * Displays a detailed view of a single memory.
 * This is where a single memory comes to life. It combines all the raw data,
 * AI insights, people, places, and media into a rich, browsable format.
 */
export const MemoryDetailComponent: React.FC<{ memory: Memory; onEdit?: (id: string) => void; onDelete?: (id: string) => void; onProcessAI?: (id: string) => void; }> = ({ memory, onEdit, onDelete, onProcessAI }) => {
  const { allPeople, allLocations } = useAppContext();
  const location = memory.locationId ? allLocations.find(l => l.id === memory.locationId) : null;
  const people = memory.peopleIds?.map(pId => allPeople.find(p => p.id === pId)).filter(Boolean) as Person[];

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-cyan-400">{memory.title}</h2>
        <div className="flex space-x-2">
          {onProcessAI && (
            <button onClick={() => onProcessAI(memory.id)} className="p-2 bg-indigo-600 rounded hover:bg-indigo-700 text-sm">Process with AI</button>
          )}
          {onEdit && (
            <button onClick={() => onEdit(memory.id)} className="p-2 bg-blue-600 rounded hover:bg-blue-700 text-sm">Edit</button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(memory.id)} className="p-2 bg-red-600 rounded hover:bg-red-700 text-sm">Delete</button>
          )}
        </div>
      </div>
      <p className="text-gray-300 text-lg mb-4">{memory.summary}</p>

      {memory.description && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">Full Narrative</h3>
          <p className="text-gray-400 whitespace-pre-wrap">{memory.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-800 p-3 rounded">
          <h4 className="font-semibold text-gray-300">Date</h4>
          <p className="text-gray-400">{new Date(memory.timestamp).toLocaleDateString()} {memory.endDate && ` - ${new Date(memory.endDate).toLocaleDateString()}`}</p>
        </div>
        {location && (
          <div className="bg-gray-800 p-3 rounded">
            <h4 className="font-semibold text-gray-300">Location</h4>
            <LocationBadge locationId={location.id} />
            <p className="text-gray-400 text-sm">{location.description}</p>
          </div>
        )}
        {memory.sentiment && (
          <div className="bg-gray-800 p-3 rounded">
            <h4 className="font-semibold text-gray-300">Sentiment</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              memory.sentiment === 'positive' ? 'bg-green-600' :
              memory.sentiment === 'negative' ? 'bg-red-600' :
              memory.sentiment === 'mixed' ? 'bg-yellow-600' : 'bg-gray-600'
            }`}>{memory.sentiment}</span>
          </div>
        )}
        {memory.processingCostTokenId && (
          <div className="bg-gray-800 p-3 rounded">
            <h4 className="font-semibold text-gray-300">AI Processing Cost</h4>
            <p className="text-gray-400 text-sm">{mockTokenTransactions.find(t => t.id === memory.processingCostTokenId)?.amount || 'N/A'} HST</p>
          </div>
        )}
      </div>

      {people && people.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">People Involved</h3>
          <div className="flex flex-wrap">
            {people.map(person => <PersonAvatar key={person.id} personId={person.id} />)}
          </div>
        </div>
      )}

      {memory.tagIds && memory.tagIds.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">Tags</h3>
          <div className="flex flex-wrap">
            {memory.tagIds.map(tagId => <TagPill key={tagId} tagId={tagId} />)}
          </div>
        </div>
      )}

      {memory.assets.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">Digital Assets</h3>
          <div className="flex flex-wrap gap-4 overflow-x-auto pb-2">
            {memory.assets.map(asset => (
              <a href={asset.url} target="_blank" rel="noopener noreferrer" key={asset.id} className="block hover:opacity-80">
                <AssetPreview asset={asset} />
              </a>
            ))}
          </div>
        </div>
      )}

      {memory.aiGeneratedInsights && memory.aiGeneratedInsights.length > 0 && (
        <div className="mb-4 bg-cyan-900 bg-opacity-30 p-4 rounded-lg border border-cyan-700">
          <h3 className="text-xl font-semibold text-cyan-200 mb-2">AI Insights</h3>
          <ul className="list-disc list-inside text-cyan-300">
            {memory.aiGeneratedInsights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {memory.agentProcessingJobId && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">AI Processing Job Details</h3>
          <p className="text-gray-400 text-sm">Job ID: <span className="font-mono text-cyan-400">{memory.agentProcessingJobId}</span></p>
          <p className="text-gray-400 text-sm">View <a href={`#job-details-${memory.agentProcessingJobId}`} className="text-cyan-500 hover:underline">agent activity logs</a> for this memory.</p>
        </div>
      )}

      {memory.vrExperienceUrl && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Experience this Memory in VR</h3>
          <a href={memory.vrExperienceUrl} target="_blank" rel="noopener noreferrer" className="inline-block p-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors text-white">
            Launch VR Memory Palace Experience
          </a>
        </div>
      )}
    </div>
  );
};

/**
 * Renders a compact card view for a memory, perfect for grids and lists.
 * This component is all about providing an at-a-glance summary to make
 * browsing through hundreds or thousands of memories fast and intuitive.
 */
export const MemoryCard: React.FC<{ memory: Memory; onClick: (memory: Memory) => void }> = ({ memory, onClick }) => (
  <div
    className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer relative"
    onClick={() => onClick(memory)}
  >
    <div className="absolute top-2 right-2 flex space-x-1">
      {memory.sentiment && (
        <span className={`text-xs px-2 py-1 rounded-full ${
          memory.sentiment === 'positive' ? 'bg-green-700' :
          memory.sentiment === 'negative' ? 'bg-red-700' :
          memory.sentiment === 'mixed' ? 'bg-yellow-700' : 'bg-gray-700'
        }`}>{memory.sentiment.charAt(0).toUpperCase()}</span>
      )}
      {memory.vrExperienceUrl && (
        <span className="text-xs px-2 py-1 rounded-full bg-indigo-700">VR</span>
      )}
    </div>

    <h3 className="text-xl font-semibold text-white mb-2 pr-10">{memory.title}</h3>
    <p className="text-gray-400 text-sm mb-3 line-clamp-3">{memory.summary}</p>
    <div className="flex flex-wrap items-center text-xs text-gray-500 mb-2">
      <span className="mr-3">{new Date(memory.timestamp).toLocaleDateString()}</span>
      {memory.locationId && <LocationBadge locationId={memory.locationId} />}
    </div>
    <div className="flex flex-wrap mb-2">
      {memory.tagIds?.slice(0, 3).map(tagId => <TagPill key={tagId} tagId={tagId} />)}
      {memory.tagIds && memory.tagIds.length > 3 && (
        <span className="inline-block text-gray-400 text-xs px-2 py-1 rounded-full mr-2 mb-2 bg-gray-700">+{memory.tagIds.length - 3}</span>
      )}
    </div>
    {memory.assets.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-3">
        {memory.assets.slice(0, 3).map(asset => (
          <img
            key={asset.id}
            src={asset.thumbnailUrl || asset.url}
            alt={asset.caption || 'Asset'}
            className="w-12 h-12 object-cover rounded-md border border-gray-700"
          />
        ))}
        {memory.assets.length > 3 && (
          <div className="w-12 h-12 flex items-center justify-center bg-gray-700 text-gray-400 rounded-md border border-gray-600 text-xs">
            +{memory.assets.length - 3}
          </div>
        )}
      </div>
    )}
  </div>
);

/**
 * Provides an advanced search interface for memories.
 * This lets users slice and dice their personal history with powerful filters,
 * turning a massive archive into a precise, answer-finding tool.
 */
export const AdvancedSearchForm: React.FC<{
  onSearch: (params: any) => void;
  isLoading: boolean;
}> = ({ onSearch, isLoading }) => {
  const { allPeople, allLocations, allTags } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative' | 'mixed' | ''>('');

  const handleSearch = useCallback(() => {
    onSearch({
      query: searchTerm,
      tagIds: selectedTags.length > 0 ? selectedTags : undefined,
      peopleIds: selectedPeople.length > 0 ? selectedPeople : undefined,
      locationId: selectedLocation || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sentiment: sentiment || undefined,
    });
  }, [searchTerm, selectedTags, selectedPeople, selectedLocation, startDate, endDate, sentiment, onSearch]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-white">Advanced Memory Search</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="search-term" className="block text-gray-300 text-sm font-bold mb-2">Keywords</label>
          <input
            id="search-term"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search titles, summaries, descriptions..."
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="tags-select" className="block text-gray-300 text-sm font-bold mb-2">Tags</label>
          <select
            id="tags-select"
            multiple
            value={selectedTags}
            onChange={e => setSelectedTags(Array.from(e.target.options).filter(o => o.selected).map(o => o.value))}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white h-24 focus:ring-cyan-500 focus:border-cyan-500"
          >
            {allTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="people-select" className="block text-gray-300 text-sm font-bold mb-2">People</label>
          <select
            id="people-select"
            multiple
            value={selectedPeople}
            onChange={e => setSelectedPeople(Array.from(e.target.options).filter(o => o.selected).map(o => o.value))}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white h-24 focus:ring-cyan-500 focus:border-cyan-500"
          >
            {allPeople.map(person => (
              <option key={person.id} value={person.id}>{person.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location-select" className="block text-gray-300 text-sm font-bold mb-2">Location</label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="">Any Location</option>
            {allLocations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="start-date" className="block text-gray-300 text-sm font-bold mb-2">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-gray-300 text-sm font-bold mb-2">End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="sentiment-select" className="block text-gray-300 text-sm font-bold mb-2">Sentiment</label>
          <select
            id="sentiment-select"
            value={sentiment}
            onChange={e => setSentiment(e.target.value as any)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="">Any Sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="p-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-bold w-full disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Searching...' : 'Search Memories'}
      </button>
    </div>
  );
};

/**
 * Provides an interface for creating or editing memories.
 * This is the primary input for getting memories into the system. It's designed
 * to be comprehensive yet easy to use, ensuring that the data captured is rich
 * and well-structured from the start.
 */
export const MemoryEditorComponent: React.FC<{
  memory?: Memory;
  onSave: (memory: Partial<Memory>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ memory, onSave, onCancel, isLoading }) => {
  const { allPeople, allLocations, allTags } = useAppContext();
  const [formData, setFormData] = useState<Partial<Memory>>(() => memory || {
    title: '',
    summary: '',
    description: '',
    timestamp: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
    assets: [],
    peopleIds: [],
    tagIds: [],
    sentiment: 'neutral',
    locationId: '',
    vrExperienceUrl: '',
    notes: '',
  });
  const [newAssetFile, setNewAssetFile] = useState<File | null>(null);
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);

  useEffect(() => {
    if (memory) {
      setFormData({
        ...memory,
        timestamp: new Date(memory.timestamp).toISOString().slice(0, 16),
        endDate: memory.endDate ? new Date(memory.endDate).toISOString().slice(0, 16) : undefined,
      });
    }
  }, [memory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value ? new Date(value).toISOString() : undefined }));
  };

  const handleMultiSelectChange = (name: keyof Memory, options: HTMLOptionElement[]) => {
    const selectedValues = Array.from(options).filter(o => o.selected).map(o => o.value);
    setFormData(prev => ({ ...prev, [name]: selectedValues }));
  };

  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAssetFile(file);
      setIsUploadingAsset(true);
      try {
        const uploadedAsset = await api.uploadAsset(file);
        setFormData(prev => ({ ...prev, assets: [...(prev.assets || []), uploadedAsset] }));
        setNewAssetFile(null);
      } catch (error) {
        console.error('Asset upload failed:', error);
        alert('Failed to upload asset.');
      } finally {
        setIsUploadingAsset(false);
      }
    }
  };

  const handleRemoveAsset = (assetId: string) => {
    setFormData(prev => ({ ...prev, assets: prev.assets?.filter(a => a.id !== assetId) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (dataToSave.timestamp && !dataToSave.timestamp.endsWith('Z')) {
      dataToSave.timestamp = new Date(dataToSave.timestamp).toISOString();
    }
    if (dataToSave.endDate && !dataToSave.endDate.endsWith('Z')) {
      dataToSave.endDate = new Date(dataToSave.endDate).toISOString();
    }
    await onSave(dataToSave);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-white">{memory ? 'Edit Memory' : 'Create New Memory'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-1">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
        <div>
          <label htmlFor="summary" className="block text-gray-300 text-sm font-bold mb-1">Summary</label>
          <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} required rows={3}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"></textarea>
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-1">Full Narrative</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="timestamp" className="block text-gray-300 text-sm font-bold mb-1">Start Date/Time</label>
            <input type="datetime-local" id="timestamp" name="timestamp" value={formData.timestamp ? new Date(formData.timestamp).toISOString().slice(0, 16) : ''} onChange={e => handleDateChange('timestamp', e.target.value)} required
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-gray-300 text-sm font-bold mb-1">End Date/Time (Optional)</label>
            <input type="datetime-local" id="endDate" name="endDate" value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''} onChange={e => handleDateChange('endDate', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
        </div>
        <div>
          <label htmlFor="locationId" className="block text-gray-300 text-sm font-bold mb-1">Location</label>
          <select id="locationId" name="locationId" value={formData.locationId} onChange={handleChange}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500">
            <option value="">Select Location</option>
            {allLocations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="peopleIds" className="block text-gray-300 text-sm font-bold mb-1">People Involved</label>
          <select multiple id="peopleIds" name="peopleIds" value={formData.peopleIds} onChange={e => handleMultiSelectChange('peopleIds', Array.from(e.target.options))}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white h-24 focus:ring-cyan-500 focus:border-cyan-500">
            {allPeople.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tagIds" className="block text-gray-300 text-sm font-bold mb-1">Tags</label>
          <select multiple id="tagIds" name="tagIds" value={formData.tagIds} onChange={e => handleMultiSelectChange('tagIds', Array.from(e.target.options))}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white h-24 focus:ring-cyan-500 focus:border-cyan-500">
            {allTags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sentiment" className="block text-gray-300 text-sm font-bold mb-1">Sentiment</label>
          <select id="sentiment" name="sentiment" value={formData.sentiment} onChange={handleChange}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500">
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div>
          <label htmlFor="vrExperienceUrl" className="block text-gray-300 text-sm font-bold mb-1">VR Experience URL</label>
          <input type="url" id="vrExperienceUrl" name="vrExperienceUrl" value={formData.vrExperienceUrl} onChange={handleChange}
            placeholder="e.g., https://my-vr-palace.com/experience/123"
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
        <div>
          <label htmlFor="notes" className="block text-gray-300 text-sm font-bold mb-1">Private Notes</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"></textarea>
        </div>

        <div className="border-t border-gray-700 pt-4 mt-4">
          <h4 className="text-lg font-semibold text-gray-200 mb-2">Assets</h4>
          <div className="flex flex-wrap gap-4 mb-4">
            {formData.assets?.map(asset => (
              <div key={asset.id} className="relative group">
                <AssetPreview asset={asset} />
                <button
                  type="button"
                  onClick={() => handleRemoveAsset(asset.id)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove asset"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <label className="block text-gray-300 text-sm font-bold mb-1">Upload New Asset</label>
          <input type="file" onChange={handleAssetUpload} disabled={isUploadingAsset}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 disabled:opacity-50" />
          {isUploadingAsset && <p className="text-cyan-400 text-sm mt-2">Uploading asset...</p>}
        </div>

        <div className="flex justify-end space-x-4 border-t border-gray-700 pt-6 mt-6">
          <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-bold">Cancel</button>
          <button type="submit" disabled={isLoading || isUploadingAsset} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-bold disabled:opacity-50">
            {isLoading ? 'Saving...' : 'Save Memory'}
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * Displays key metrics, AI recommendations, and recent memories.
 * The dashboard is your mission control. It gives you a high-level overview
 * of your personal history, highlights what the AI thinks is interesting,
 * and keeps you up-to-date with recent activity.
 */
export const DashboardInsights: React.FC = () => {
  const { allTags, userTokenAccount } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]
  );
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [stats, setStats] = useState<{ totalMemories: number; avgSentiment: string; mostFrequentTag: string; totalAIAgentCost: number } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [recs, recents, allMemsResponse] = await Promise.all([
          api.getRecommendations(),
          api.getMemories({ limit: 5 }),
          api.getMemories({ limit: 9999 }) // Fetch all for stats
        ]);
        setRecommendations(recs);
        setRecentMemories(recents.data);

        // Mock stats calculation
        const allMemories = allMemsResponse.data;
        const totalMemories = allMemories.length;
        const sentimentCounts = allMemories.reduce((acc, mem) => {
          if (mem.sentiment) acc[mem.sentiment] = (acc[mem.sentiment] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const avgSentiment = Object.keys(sentimentCounts).length > 0
          ? Object.keys(sentimentCounts).reduce((a, b) => sentimentCounts[a] > sentimentCounts[b] ? a : b)
          : 'neutral';

        const tagCounts: Record<string, number> = {};
        allMemories.forEach(mem => mem.tagIds?.forEach(tagId => {
          tagCounts[tagId] = (tagCounts[tagId] || 0) + 1;
        }));
        const mostFrequentTagId = Object.keys(tagCounts).length > 0
          ? Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b)
          : '';
        const mostFrequentTag = allTags.find(t => t.id === mostFrequentTagId)?.name || 'N/A';

        // Calculate total AI agent cost
        const totalAIAgentCost = mockTokenTransactions
          .filter(txn => txn.senderId === userTokenAccount?.id && txn.type === 'fee')
          .reduce((sum, txn) => sum + txn.amount, 0);

        setStats({ totalMemories, avgSentiment, mostFrequentTag, totalAIAgentCost });

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [allTags, userTokenAccount]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Your Personal Historian Dashboard</h2>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-5 rounded-lg shadow-md">
            <p className="text-gray-400 text-sm">Total Memories</p>
            <p className="text-3xl font-bold text-cyan-400">{stats.totalMemories}</p>
          </div>
          <div className="bg-gray-800 p-5 rounded-lg shadow-md">
            <p className="text-gray-400 text-sm">Overall Sentiment</p>
            <p className={`text-3xl font-bold ${
              stats.avgSentiment === 'positive' ? 'text-green-400' :
              stats.avgSentiment === 'negative' ? 'text-red-400' :
              stats.avgSentiment === 'mixed' ? 'text-yellow-400' : 'text-gray-400'
            }`}>{stats.avgSentiment.charAt(0).toUpperCase() + stats.avgSentiment.slice(1)}</p>
          </div>
          <div className="bg-gray-800 p-5 rounded-lg shadow-md">
            <p className="text-gray-400 text-sm">Most Frequent Tag</p>
            <p className="text-3xl font-bold text-indigo-400">{stats.mostFrequentTag}</p>
          </div>
          <div className="bg-gray-800 p-5 rounded-lg shadow-md">
            <p className="text-gray-400 text-sm">Total AI Agent Costs (HST)</p>
            <p className="text-3xl font-bold text-purple-400">{stats.totalAIAgentCost}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-white mb-4">AI Recommendations & Insights</h3>
          {recommendations.length > 0 ? (
            <ul className="space-y-4">
              {recommendations.map(rec => (
                <li key={rec.id} className="border-b border-gray-700 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-cyan-300 text-lg">{rec.title}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      rec.priority === 'high' ? 'bg-red-800 text-red-100' :
                      rec.priority === 'medium' ? 'bg-yellow-800 text-yellow-100' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {rec.priority || 'medium'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{rec.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    {rec.actionUrl && (
                      <a href={rec.actionUrl} className="text-cyan-500 hover:underline mr-4">View Details</a>
                    )}
                    <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No new recommendations at the moment.</p>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Memories</h3>
          {recentMemories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentMemories.map(memory => (
                <MemoryCard key={memory.id} memory={memory} onClick={() => console.log('View memory', memory.id)} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent memories found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Manages and displays system notifications.
 * This is the central place for all alerts, from AI processing updates to
 * transaction confirmations. It keeps the user informed and in the loop.
 */
export const NotificationCenter: React.FC = () => {
  const { notifications, fetchNotifications, markNotificationRead } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchNotifications();
      } catch (err) {
        setError('Failed to load notifications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, [fetchNotifications]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6 flex justify-between items-center">
        Notification Center
        {unreadCount > 0 && <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">{unreadCount} Unread</span>}
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map(notif => (
            <li
              key={notif.id}
              className={`bg-gray-800 p-4 rounded-lg shadow-md flex items-start ${!notif.read ? 'border-l-4 border-cyan-500' : 'border-l-4 border-gray-700'}`}
            >
              <div className="flex-shrink-0 mr-4">
                {notif.type === 'info' && <span className="text-blue-400 text-2xl">i</span>}
                {notif.type === 'warning' && <span className="text-yellow-400 text-2xl">!</span>}
                {notif.type === 'error' && <span className="text-red-400 text-2xl">Ã—</span>}
                {notif.type === 'success' && <span className="text-green-400 text-2xl">âœ“</span>}
                {notif.type === 'agent' && <span className="text-indigo-400 text-2xl">âš™ï¸ </span>}
                {notif.type === 'transaction' && <span className="text-purple-400 text-2xl">$</span>}
              </div>
              <div className="flex-grow">
                <p className={`font-semibold text-lg ${notif.read ? 'text-gray-400' : 'text-white'}`}>{notif.message}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(notif.timestamp).toLocaleString()}
                </p>
                <div className="mt-3 flex space-x-3">
                  {notif.actionUrl && (
                    <a href={notif.actionUrl} className="text-cyan-500 hover:underline text-sm">View Details</a>
                  )}
                  {!notif.read && (
                    <button onClick={() => markNotificationRead(notif.id)} className="text-gray-400 hover:text-white text-sm">Mark as Read</button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * Manages user profile and AI settings.
 * This component gives the user fine-grained control over their experience,
 * from privacy settings and notifications to managing their digital identity
 * and token wallet. It's the hub for personalization and security.
 */
export const UserProfileSettings: React.FC = () => {
  const { userProfile, setUserProfile, aiSettings, setAiSettings, userDigitalIdentity, setUserDigitalIdentity, userTokenAccount, setUserTokenAccount } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileFormData, setProfileFormData] = useState<UserProfile | null>(userProfile);
  const [aiSettingsFormData, setAiSettingsFormData] = useState<AISettings | null>(aiSettings);
  const [isGeneratingIdentity, setIsGeneratingIdentity] = useState(false);

  useEffect(() => {
    setProfileFormData(userProfile);
    setAiSettingsFormData(aiSettings);
  }, [userProfile, aiSettings]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (profileFormData) {
      if (name.startsWith('preferences.notificationSettings.')) {
        const notifSettingName = name.split('.')[2] as keyof UserPreferences['notificationSettings'];
        setProfileFormData({
          ...profileFormData,
          preferences: {
            ...profileFormData.preferences,
            notificationSettings: {
              ...profileFormData.preferences.notificationSettings,
              [notifSettingName]: checked,
            },
          },
        });
      } else if (name.startsWith('preferences.privacySettings.')) {
        const privacySettingName = name.split('.')[2] as keyof UserPreferences['privacySettings'];
        setProfileFormData({
          ...profileFormData,
          preferences: {
            ...profileFormData.preferences,
            privacySettings: {
              ...profileFormData.preferences.privacySettings,
              [privacySettingName]: type === 'checkbox' ? checked : value,
            },
          },
        });
      } else if (name.startsWith('preferences.')) {
        const prefName = name.split('.')[1] as keyof UserPreferences;
        setProfileFormData({
          ...profileFormData,
          preferences: {
            ...profileFormData.preferences,
            [prefName]: type === 'checkbox' ? checked : value,
          },
        });
      } else {
        setProfileFormData({ ...profileFormData, [name]: value });
      }
    }
  };

  const handleAISettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (aiSettingsFormData) {
      if (name.startsWith('aiModelAccessKeys.')) {
        const modelName = name.split('.')[1];
        setAiSettingsFormData({
          ...aiSettingsFormData,
          aiModelAccessKeys: {
            ...aiSettingsFormData.aiModelAccessKeys,
            [modelName]: value,
          },
        });
      } else {
        setAiSettingsFormData({ ...aiSettingsFormData, [name]: type === 'checkbox' ? checked : (name === 'maxMonthlyAICostTokens' ? parseInt(value, 10) : value) });
      }
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFormData) return;
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await api.updateUserProfile(profileFormData);
      setUserProfile(updatedProfile);
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAISettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSettingsFormData) return;
    setLoading(true);
    setError(null);
    try {
      const updatedAISettings = await api.updateAISettings(aiSettingsFormData);
      setAiSettings(updatedAISettings);
      alert('AI Settings updated successfully!');
    } catch (err) {
      setError('Failed to update AI settings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDigitalIdentity = async () => {
    if (!userProfile) {
      setError('User profile not available. Cannot generate identity.');
      return;
    }
    setIsGeneratingIdentity(true);
    setError(null);
    try {
      const newIdentity = await api.generateDigitalIdentity(userProfile.id, 'user', ['role-user']);
      setUserDigitalIdentity(newIdentity);
      // Update user profile to link new identity
      const updatedProfile = { ...userProfile, digitalIdentityId: newIdentity.id };
      await api.updateUserProfile(updatedProfile); // Also update server-side mock
      setUserProfile(updatedProfile);
      alert('Digital Identity generated successfully! Public key copied to clipboard (simulated).'); // Simulate copy
    } catch (err) {
      setError(`Failed to generate Digital Identity: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsGeneratingIdentity(false);
    }
  };

  const handleMintTokens = async () => {
    if (!userTokenAccount || !userDigitalIdentity || !userProfile) {
      setError('User profile, digital identity, or token account not available to mint tokens.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const amountToMint = 1000;
      const transaction = await api.mintTokens(userProfile.id, amountToMint);
      // Update user token account balance locally
      setUserTokenAccount(prev => prev ? { ...prev, balance: prev.balance + amountToMint, lastUpdated: new Date().toISOString() } : null);
      alert(`${amountToMint} HST tokens minted successfully! Transaction ID: ${transaction.id}`);
    } catch (err) {
      setError(`Failed to mint tokens: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  if (!profileFormData || !aiSettingsFormData || !userTokenAccount) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">User Profile & Settings</h2>

      {error && <ErrorMessage message={error} />}

      {/* User Profile Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">User Profile</h3>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-1">Name</label>
            <input type="text" id="name" name="name" value={profileFormData.name} onChange={handleProfileChange}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white" />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-1">Email</label>
            <input type="email" id="email" name="email" value={profileFormData.email} onChange={handleProfileChange} disabled
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white opacity-70 cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="avatarUrl" className="block text-gray-300 text-sm font-bold mb-1">Avatar URL</label>
            <input type="url" id="avatarUrl" name="avatarUrl" value={profileFormData.avatarUrl || ''} onChange={handleProfileChange}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white" />
          </div>
          <div>
            <label htmlFor="bio" className="block text-gray-300 text-sm font-bold mb-1">Bio</label>
            <textarea id="bio" name="bio" value={profileFormData.bio || ''} onChange={handleProfileChange} rows={3}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"></textarea>
          </div>

          <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="theme" className="block text-gray-300 text-sm font-bold mb-1">Theme</label>
              <select id="theme" name="preferences.theme" value={profileFormData.preferences.theme} onChange={handleProfileChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            <div>
              <label htmlFor="defaultView" className="block text-gray-300 text-sm font-bold mb-1">Default View</label>
              <select id="defaultView" name="preferences.defaultView" value={profileFormData.preferences.defaultView} onChange={handleProfileChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white">
                <option value="dashboard">Dashboard</option>
                <option value="timeline">Timeline</option>
                <option value="chat">AI Chat</option>
                <option value="map">Map</option>
              </select>
            </div>
          </div>

          <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">Notification Settings</h4>
          <div className="space-y-2">
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="preferences.notificationSettings.memoryAnniversaries" checked={profileFormData.preferences.notificationSettings.memoryAnniversaries} onChange={handleProfileChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">Memory Anniversaries</span>
            </label>
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="preferences.notificationSettings.newInsights" checked={profileFormData.preferences.notificationSettings.newInsights} onChange={handleProfileChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">New AI Insights</span>
            </label>
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="preferences.notificationSettings.aiProcessingComplete" checked={profileFormData.preferences.notificationSettings.aiProcessingComplete} onChange={handleProfileChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">AI Processing Complete</span>
            </label>
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="preferences.notificationSettings.agentActivityAlerts" checked={profileFormData.preferences.notificationSettings.agentActivityAlerts} onChange={handleProfileChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">Agent Activity Alerts</span>
            </label>
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="preferences.notificationSettings.transactionNotifications" checked={profileFormData.preferences.notificationSettings.transactionNotifications} onChange={handleProfileChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">Token Transaction Notifications</span>
            </label>
          </div>

          <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">Privacy Settings</h4>
          <div className="space-y-2">
            <div>
              <label htmlFor="dataRetentionDays" className="block text-gray-300 text-sm font-bold mb-1">Data Retention (Days)</label>
              <input type="number" id="dataRetentionDays" name="preferences.privacySettings.dataRetentionDays" value={profileFormData.preferences.privacySettings.dataRetentionDays} onChange={handleProfileChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white" />
            </div>
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="preferences.privacySettings.anonymizeInsights" checked={profileFormData.preferences.privacySettings.anonymizeInsights} onChange={handleProfileChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">Anonymize Insights for AI Training</span>
            </label>
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="preferences.privacySettings.allowAIContextLearning" checked={profileFormData.preferences.privacySettings.allowAIContextLearning} onChange={handleProfileChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">Allow AI Contextual Learning (for improved insights)</span>
            </label>
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-bold disabled:opacity-50">
              {loading ? 'Saving Profile...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Digital Identity Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Digital Identity Management</h3>
        <p className="text-gray-400 text-sm mb-4">Your Digital Identity secures your data and transactions using cryptographic keys. It's essential for participating in the token economy and ensuring data integrity. This cryptographic identity is the foundation of trust and non-repudiation across the platform.</p>
        {userDigitalIdentity ? (
          <div className="space-y-2">
            <p className="text-gray-300"><strong>Identity ID:</strong> <span className="font-mono text-cyan-400 text-sm">{userDigitalIdentity.id}</span></p>
            <p className="text-gray-300"><strong>Public Key:</strong> <span className="font-mono text-gray-400 text-xs break-all">{userDigitalIdentity.publicKey}</span></p>
            <p className="text-gray-300"><strong>Status:</strong> <span className={`font-semibold ${userDigitalIdentity.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{userDigitalIdentity.status}</span></p>
            <p className="text-gray-500 text-xs">Private key is securely stored (simulated encryption) and never displayed.</p>
            <button disabled className="px-4 py-2 bg-gray-600 text-white rounded-lg opacity-50 cursor-not-allowed">View Audit Log (Coming Soon)</button>
          </div>
        ) : (
          <div>
            <p className="text-gray-400 mb-4">No Digital Identity found. Generate one to enable full platform features, including AI agent interaction and token transactions.</p>
            <button onClick={handleGenerateDigitalIdentity} disabled={isGeneratingIdentity || loading} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-bold disabled:opacity-50">
              {isGeneratingIdentity ? 'Generating...' : 'Generate New Digital Identity'}
            </button>
          </div>
        )}
      </div>

      {/* Token Wallet Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Token Wallet (HST)</h3>
        <p className="text-gray-400 text-sm mb-4">Manage your Historian Stable Tokens (HST), used for AI processing, VR generation, and other premium services. Your token balance fuels the intelligent automation layer and powers the programmable value rails of the platform.</p>
        <div className="space-y-2 mb-4">
          <p className="text-gray-300"><strong>Account ID:</strong> <span className="font-mono text-cyan-400 text-sm">{userTokenAccount.id}</span></p>
          <p className="text-gray-300 text-2xl"><strong>Current Balance:</strong> <span className="font-bold text-purple-400">{userTokenAccount.balance} HST</span></p>
        </div>
        <button onClick={handleMintTokens} disabled={loading || !userDigitalIdentity} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-bold disabled:opacity-50 mr-4">
          {loading ? 'Minting...' : 'Mint 1000 HST (Simulated)'}
        </button>
        <button disabled className="px-4 py-2 bg-gray-600 text-white rounded-lg opacity-50 cursor-not-allowed">View Transactions (Coming Soon)</button>
      </div>


      {/* AI Settings Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-white mb-4">AI Service Settings</h3>
        <form onSubmit={handleAISettingsSave} className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="enableAutoTagging" checked={aiSettingsFormData.enableAutoTagging} onChange={handleAISettingsChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">Enable Auto-Tagging for New Memories</span>
            </label>
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="enableSentimentAnalysis" checked={aiSettingsFormData.enableSentimentAnalysis} onChange={handleAISettingsChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">Enable Sentiment Analysis</span>
            </label>
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="enableVRSceneGeneration" checked={aiSettingsFormData.enableVRSceneGeneration} onChange={handleAISettingsChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">Enable VR Scene Generation (Experimental)</span>
            </label>
            <label className="flex items-center text-gray-300">
              <input type="checkbox" name="autoProcessNewMemories" checked={aiSettingsFormData.autoProcessNewMemories} onChange={handleAISettingsChange} className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded" />
              <span className="ml-2">Auto-Process New Memories with Default AI Agents</span>
            </label>
          </div>

          <div>
              <label htmlFor="preferredChatModel" className="block text-gray-300 text-sm font-bold mb-1">Preferred Chat AI</label>
              <select id="preferredChatModel" name="preferredChatModel" value={aiSettingsFormData.preferredChatModel} onChange={handleAISettingsChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white">
                <option value="Gemini-Pro">Gemini-Pro</option>
                <option value="GPT-4-Turbo">GPT-4-Turbo</option>
                <option value="Claude-3-Sonnet">Claude-3-Sonnet</option>
              </select>
          </div>
          <div>
            <label htmlFor="preferredTranscriptionModel" className="block text-gray-300 text-sm font-bold mb-1">Preferred Transcription Model</label>
            <select id="preferredTranscriptionModel" name="preferredTranscriptionModel" value={aiSettingsFormData.preferredTranscriptionModel} onChange={handleAISettingsChange}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white">
              <option value="WhisperV3">Whisper V3 (High Accuracy)</option>
              <option value="BasicASR">Basic ASR (Faster, Lower Cost)</option>
            </select>
          </div>
          <div>
            <label htmlFor="preferredImageAnalysisModel" className="block text-gray-300 text-sm font-bold mb-1">Preferred Image Analysis Model</label>
            <select id="preferredImageAnalysisModel" name="preferredImageAnalysisModel" value={aiSettingsFormData.preferredImageAnalysisModel} onChange={handleAISettingsChange}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white">
              <option value="VisionPro">VisionPro (Advanced)</option>
              <option value="BasicVision">BasicVision (Standard)</option>
            </select>
          </div>
          <div>
            <label htmlFor="maxMonthlyAICostTokens" className="block text-gray-300 text-sm font-bold mb-1">Max Monthly AI Cost (HST Tokens)</label>
            <input type="number" id="maxMonthlyAICostTokens" name="maxMonthlyAICostTokens" value={aiSettingsFormData.maxMonthlyAICostTokens} onChange={handleAISettingsChange}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white" />
          </div>

          <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">AI Model Access Keys</h4>
          <p className="text-gray-400 text-sm mb-2">Enter your API keys for third-party AI services. These are stored securely (simulated).</p>
          <div className="space-y-2">
            {Object.keys(aiSettingsFormData.aiModelAccessKeys).map(modelName => (
              <div key={modelName}>
                <label htmlFor={`key-${modelName}`} className="block text-gray-300 text-sm font-bold mb-1">{modelName} API Key</label>
                <input
                  type="password"
                  id={`key-${modelName}`}
                  name={`aiModelAccessKeys.${modelName}`}
                  value={aiSettingsFormData.aiModelAccessKeys[modelName]}
                  onChange={handleAISettingsChange}
                  placeholder={`Enter ${modelName} API Key`}
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-bold disabled:opacity-50">
              {loading ? 'Saving AI Settings...' : 'Save AI Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Displays a chronological timeline of memories and significant life events.
 * This view provides a powerful way to visualize your history, see how events
 * unfold over time, and discover long-term patterns. It's like scrolling
 * through the story of your life.
 */
export const TimelineViewComponent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const { userTokenAccount } = useAppContext();

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const memoriesResponse = await api.getMemories({ limit: 500 }); // Fetch a reasonable number
        const events: TimelineEvent[] = memoriesResponse.data.map(mem => ({
          id: `tlev-${mem.id}`,
          type: 'memory',
          timestamp: mem.timestamp,
          title: mem.title,
          description: mem.summary,
          relatedMemoryId: mem.id,
          tags: mem.tagIds?.map(tid => mockTags.find(t => t.id === tid)?.name || 'N/A'),
          imageUrl: mem.assets[0]?.thumbnailUrl || mem.assets[0]?.url,
          detailUrl: `#memory-${mem.id}`,
        }));

        // Add some mock AI insight events to the timeline
        mockRecommendations.filter(r => r.type === 'insight').forEach(rec => {
          events.push({
            id: `tlev-${rec.id}`,
            type: 'ai_insight',
            timestamp: rec.timestamp,
            title: `AI Insight: ${rec.title}`,
            description: rec.description,
            relatedMemoryId: rec.relatedMemoryId,
            tags: ['AI', 'Insight'],
            detailUrl: rec.actionUrl,
          });
        });

        // Add some mock agent activity events to the timeline
        mockAgentActivityLogs.filter(log => log.status === 'success').slice(0, 10).forEach(log => {
          events.push({
            id: `tlev-${log.id}`,
            type: 'agent_action',
            timestamp: log.timestamp,
            title: `Agent Activity: ${log.action} by ${mockAgents.find(a => a.id === log.agentId)?.name || log.agentId}`,
            description: `Agent ${log.agentId} performed ${log.action} on related entity ${log.relatedEntityId}. Cost: ${log.costInTokens || 0} HST.`,
            relatedMemoryId: log.relatedEntityId?.startsWith('mem-') ? log.relatedEntityId : undefined,
            tags: ['Agent', 'Activity'],
            agentId: log.agentId,
            detailUrl: `#agent-log-${log.id}`,
          });
        });

        // Add some mock token transaction events to the timeline for the current user
        mockTokenTransactions
          .filter(txn => txn.senderId === userTokenAccount?.id || txn.receiverId === userTokenAccount?.id)
          .slice(0, 10) // Limit for demo
          .forEach(txn => {
            events.push({
              id: `tlev-txn-${txn.id}`,
              type: 'transaction_event',
              timestamp: txn.timestamp,
              title: `Transaction: ${txn.type.toUpperCase()} ${txn.amount} HST`,
              description: `${txn.description}. Status: ${txn.status}.`,
              tags: ['Finance', 'Transaction'],
              transactionId: txn.id,
              detailUrl: `#transaction-${txn.id}`,
            });
          });

        // Sort all events chronologically
        events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setTimelineEvents(events);
      } catch (error) {
        console.error('Failed to fetch timeline data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [userTokenAccount]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-white">Your Personal Timeline</h2>
      {timelineEvents.length === 0 ? (
        <p className="text-gray-500">No events to display on the timeline.</p>
      ) : (
        <div className="relative border-l-2 border-gray-700 ml-4 pl-4">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="mb-8 relative">
              <div className={`absolute -left-5 top-0 w-4 h-4 rounded-full ${
                event.type === 'memory' ? 'bg-cyan-600' :
                event.type === 'ai_insight' ? 'bg-indigo-600' :
                event.type === 'agent_action' ? 'bg-purple-600' :
                event.type === 'transaction_event' ? 'bg-yellow-600' :
                'bg-gray-500'
              }`}></div>
              <p className="text-gray-400 text-sm mb-1">{new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
              <p className="text-gray-300 text-sm mb-2">{event.description}</p>
              <div className="flex flex-wrap items-center text-xs text-gray-500">
                {event.tags?.map(tag => (
                  <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full mr-2 mb-2">{tag}</span>
                ))}
                {event.detailUrl && (
                  <a href={event.detailUrl} className="text-cyan-500 hover:underline mr-2 mb-2">View Details</a>
                )}
              </div>
              {event.imageUrl && (
                <img src={event.imageUrl} alt={event.title} className="w-48 h-auto rounded-lg mt-2 object-cover" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Displays logs of all activities performed by AI agents.
 * This is the transparency layer for all autonomous AI operations.
 * It's crucial for understanding what the agents are doing, for debugging,
 * and for building trust in the system's intelligent capabilities.
 */
export const AgentActivityLogViewer: React.FC = () => {
  const { allAgents } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<AgentActivityLog[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedLogs = await api.getAgentActivityLogs(selectedAgent || undefined);
      setLogs(fetchedLogs);
    } catch (err) {
      setError('Failed to fetch agent activity logs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedAgent]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">AI Agent Activity Logs</h2>

      <div className="mb-4">
        <label htmlFor="agent-filter" className="block text-gray-300 text-sm font-bold mb-2">Filter by Agent</label>
        <select
          id="agent-filter"
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full md:w-1/3 p-2 bg-gray-700 rounded border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">All Agents</option>
          {allAgents.map(agent => (
            <option key={agent.id} value={agent.id}>{agent.name} ({agent.type})</option>
          ))}
        </select>
      </div>

      {logs.length === 0 ? (
        <p className="text-gray-500">No agent activities found.</p>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <ul className="space-y-4">
            {logs.map(log => (
              <li key={log.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-lg text-indigo-400">{log.action}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    log.status === 'success' ? 'bg-green-700 text-green-100' :
                    log.status === 'failed' ? 'bg-red-700 text-red-100' :
                    'bg-gray-700 text-gray-300'
                  }`}>{log.status}</span>
                </div>
                <p className="text-gray-400 text-sm mb-1">Agent: <span className="text-cyan-400">{allAgents.find(a => a.id === log.agentId)?.name || log.agentId}</span></p>
                <p className="text-gray-500 text-xs">Timestamp: {new Date(log.timestamp).toLocaleString()}</p>
                {log.relatedEntityId && (
                  <p className="text-gray-500 text-xs">Related Entity: <span className="font-mono text-gray-400">{log.relatedEntityId}</span></p>
                )}
                {log.costInTokens !== undefined && (
                  <p className="text-gray-500 text-xs">Cost: <span className="font-bold text-purple-400">{log.costInTokens} HST</span></p>
                )}
                {log.transactionId && (
                  <p className="text-gray-500 text-xs">Transaction ID: <span className="font-mono text-gray-400">{log.transactionId}</span></p>
                )}
                <details className="text-gray-500 text-xs mt-2 cursor-pointer">
                  <summary className="text-cyan-500 hover:text-cyan-400">Details</summary>
                  <pre className="bg-gray-900 p-2 rounded mt-1 overflow-x-auto text-gray-400">{JSON.stringify(log.details, null, 2)}</pre>
                  {log.signature && <p className="mt-1">Signature: <span className="font-mono text-gray-600 text-xs break-all">{log.signature}</span></p>}
                </details>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * A conversational interface for interacting with your memories.
 * This is where you can "talk" to your personal history. Ask questions,
 * explore topics, and let the AI help you find the memories you're looking for
 * in a natural, intuitive way.
 */
export const AIChatView: React.FC<{onViewMemory: (memoryId: string) => void;}> = ({onViewMemory}) => {
    const { aiSettings } = useAppContext();
    const [conversations, setConversations] = useState<AIConversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        api.getConversations().then(data => {
            setConversations(data);
            if (data.length > 0) {
                setCurrentConversationId(data[0].id);
            }
        });
    }, []);

    useEffect(() => {
        // Scroll to bottom when new messages are added
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversations, currentConversationId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentConversationId || isLoading) return;

        setIsLoading(true);
        const currentConvo = conversations.find(c => c.id === currentConversationId);
        if(!currentConvo) return;
        
        // Add a temporary user message
        const tempUserMessage: ChatMessage = { id: `temp-user-${Date.now()}`, role: 'user', content: newMessage, timestamp: new Date().toISOString() };
        const tempAIMessage: ChatMessage = { id: `temp-ai-${Date.now()}`, role: 'ai', content: '', timestamp: new Date().toISOString(), isLoading: true };

        setConversations(prev => prev.map(c => c.id === currentConversationId ? {...c, messages: [...c.messages, tempUserMessage, tempAIMessage]} : c));
        setNewMessage('');
        
        try {
            const aiResponse = await api.postChatMessage(currentConversationId, newMessage);
            // Replace temporary messages with the real ones
            setConversations(prev => {
                const updatedConvos = [...prev];
                const convoIndex = updatedConvos.findIndex(c => c.id === currentConversationId);
                if (convoIndex !== -1) {
                    // Remove the last two temp messages
                    updatedConvos[convoIndex].messages.splice(-2, 2); 
                    // Add the real user message and AI response (from the updated mock data)
                    const updatedConversationFromServer = mockConversations.find(c => c.id === currentConversationId);
                    if(updatedConversationFromServer){
                       updatedConvos[convoIndex].messages = updatedConversationFromServer.messages;
                    }
                }
                return updatedConvos;
            });

        } catch (error) {
            console.error("Failed to send message", error);
            // Handle error state in UI
        } finally {
            setIsLoading(false);
        }
    };

    const currentConversation = conversations.find(c => c.id === currentConversationId);

    return (
        <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">AI Memory Chat</h2>
                <p className="text-sm text-gray-400">Chatting with: <span className="font-semibold text-cyan-400">{aiSettings?.preferredChatModel || "Default AI"}</span></p>
            </div>
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
                {currentConversation?.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                            {msg.isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            ) : (
                                <p className="text-white whitespace-pre-wrap">{msg.content}</p>
                            )}
                             {msg.relatedMemoryIds && msg.relatedMemoryIds.length > 0 && (
                                <div className="mt-2 border-t border-gray-600 pt-2">
                                    <p className="text-xs text-gray-400 mb-1">Related Memories:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.relatedMemoryIds.map(memId => (
                                            <button key={memId} onClick={() => onViewMemory(memId)} className="text-xs bg-cyan-800 hover:bg-cyan-700 text-cyan-200 px-2 py-1 rounded-md">
                                                {mockMemories.find(m => m.id === memId)?.title || memId}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => { if (e.key === 'Enter') handleSendMessage(); }}
                        placeholder="Ask about your memories..."
                        className="flex-grow p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        disabled={isLoading}
                    />
                    <button onClick={handleSendMessage} disabled={isLoading || !newMessage.trim()} className="p-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-bold disabled:opacity-50 transition-colors">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};


/**
 * Manages the global application context, loading initial data and providing
 * shared state and functions to all components. This is the heart of the app's
 * state management, ensuring every component has access to the data it needs.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [aiSettings, setAiSettings] = useState<AISettings | null>(null);
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userDigitalIdentity, setUserDigitalIdentity] = useState<DigitalIdentity | null>(null);
  const [userTokenAccount, setUserTokenAccount] = useState<TokenAccount | null>(null);
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [allAgentSkills, setAllAgentSkills] = useState<AgentSkill[]>([]);

  const fetchStaticData = useCallback(async () => {
    try {
      const [profile, settings, people, locations, tags] = await Promise.all([
        api.getUserProfile(),
        api.getAISettings(),
        api.getPeople(),
        api.getLocations(),
        api.getTags(),
      ]);
      setUserProfile(profile);
      setAiSettings(settings);
      setAllPeople(people);
      setAllLocations(locations);
      setAllTags(tags);

      // Fetch digital identity and token account after profile is loaded
      if (profile.digitalIdentityId) {
        const identity = await api.getDigitalIdentity(profile.digitalIdentityId);
        setUserDigitalIdentity(identity);
      }
      if (profile.tokenAccountId) {
        const tokenAccount = await api.getTokenAccount(profile.tokenAccountId);
        setUserTokenAccount(tokenAccount);
      }

    } catch (error) {
      console.error('Failed to load initial app data:', error);
    }
  }, []);

  const fetchAgentData = useCallback(async () => {
    try {
      const [agents, skills] = await Promise.all([
        api.getAgents(),
        api.getAgentSkills(),
      ]);
      setAllAgents(agents);
      setAllAgentSkills(skills);
    } catch (error) {
      console.error('Failed to load agent data:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      const updatedNotif = await api.markNotificationAsRead(id);
      if (updatedNotif) {
        setNotifications(prev => prev.map(n => n.id === id ? updatedNotif : n));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  useEffect(() => {
    fetchStaticData();
    fetchNotifications();
    fetchAgentData();
  }, [fetchStaticData, fetchNotifications, fetchAgentData]);

  const contextValue = {
    userProfile, setUserProfile,
    aiSettings, setAiSettings,
    allPeople, allLocations, allTags,
    fetchStaticData,
    notifications, fetchNotifications, markNotificationRead,
    userDigitalIdentity, setUserDigitalIdentity,
    userTokenAccount, setUserTokenAccount,
    allAgents, allAgentSkills, fetchAgentData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * The main application view for the Personal Historian AI.
 * This top-level component orchestrates all the sub-components, providing the
 * core navigation and dynamic content rendering. It's the public face of this
 * entire simulated platform, demonstrating how intelligent automation, digital identity,
 * and a token economy can come together in a seamless user experience.
 */
export const PersonalHistorianAIView: React.FC = () => {
  const { userProfile, notifications, fetchNotifications, userTokenAccount, setUserTokenAccount } = useAppContext();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Memory[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'search' | 'create' | 'edit' | 'settings' | 'notifications' | 'timeline' | 'agentLogs' | 'chat'>('dashboard');
  const [memoryToEdit, setMemoryToEdit] = useState<Memory | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const memoriesPerPage = 20;

  useEffect(() => {
    if (userProfile?.preferences.defaultView) {
      setCurrentView(userProfile.preferences.defaultView);
    }
  }, [userProfile]);

  const handleRecall = useCallback(async (params?: { query?: string; tagIds?: string[]; peopleIds?: string[]; locationId?: string; startDate?: string; endDate?: string; sentiment?: string; reset?: boolean }) => {
    setIsLoading(true);
    setError(null);
    const currentPage = params?.reset ? 0 : page;
    try {
      const response = await api.getMemories({
        ...params,
        query: params?.query || query,
        limit: memoriesPerPage,
        offset: currentPage * memoriesPerPage,
      });
      if (params?.reset) {
        setSearchResults(response.data);
      } else {
        setSearchResults(prev => [...prev, ...response.data]);
      }
      setTotalResults(response.total);
      setHasMore(response.data.length === memoriesPerPage);
      setPage(currentPage + 1);
      if (response.data.length > 0) {
        if (!params?.tagIds && !params?.peopleIds && !params?.locationId && !params?.startDate && !params?.endDate && !params?.sentiment && response.data.length === 1) {
             setSelectedMemory(response.data[0]);
        }
        await api.addSearchHistoryEntry(params?.query || query, response.data.length);
      }
    } catch (err) {
      setError('Failed to recall memory. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [query, page, memoriesPerPage]);

  const handleInitialRecall = async () => {
    if (!query.trim()) return;
    setSearchResults([]);
    setSelectedMemory(null);
    setPage(0);
    setHasMore(true);
    setCurrentView('search');
    await handleRecall({ query: query, reset: true });
  };

  const handleAdvancedSearch = async (params: any) => {
    setCurrentView('search');
    setSearchResults([]);
    setSelectedMemory(null);
    setPage(0);
    setHasMore(true);
    await handleRecall({ ...params, reset: true });
  };

  const handleViewMemory = useCallback(async (memoryId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const memory = await api.getMemoryById(memoryId);
      if (memory) {
        setSelectedMemory(memory);
        setCurrentView('search');
      } else {
        setError('Memory not found.');
      }
    } catch (err) {
      setError('Failed to fetch memory details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateMemory = () => {
    setMemoryToEdit(null);
    setCurrentView('create');
  };

  const handleEditMemory = (id: string) => {
    const memory = searchResults.find(m => m.id === id) || mockMemories.find(m => m.id === id);
    if (memory) {
      setMemoryToEdit(memory);
      setCurrentView('edit');
    } else {
      setError('Memory not found for editing.');
    }
  };

  const handleDeleteMemory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await api.deleteMemory(id);
      setSearchResults(prev => prev.filter(m => m.id !== id));
      setSelectedMemory(null);
      alert('Memory deleted successfully!');
      fetchNotifications(); // Refresh notifications in case of new audit log
    } catch (err) {
      setError('Failed to delete memory.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessMemoryWithAI = async (memoryId: string) => {
    if (!userProfile?.id || !userTokenAccount) {
      setError('User profile or token account not available.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // For simplicity, let's allow force VR generation option here
      const confirmVr = window.confirm('Do you want to request VR Scene Generation for this memory? This is a higher cost service.');
      const processingJob = await api.processMemoryForInsights(memoryId, userProfile.id, { forceVR: confirmVr });

      // Update the memory in searchResults and selectedMemory if it was the one
      const updatedMemory = await api.getMemoryById(memoryId);
      if (updatedMemory) {
        setSearchResults(prev => prev.map(m => m.id === memoryId ? updatedMemory : m));
        if (selectedMemory?.id === memoryId) setSelectedMemory(updatedMemory);
      }
      // Update user token account balance locally by refetching from mock or updating context directly
      if (userTokenAccount) {
        const updatedTokenAccount = await api.getTokenAccount(userTokenAccount.id);
        if (updatedTokenAccount) setUserTokenAccount(updatedTokenAccount); // Use setter to update context
      }
      alert(`AI processing job "${processingJob.jobType}" initiated for memory. Actual cost: ${processingJob.actualCostTokens || processingJob.estimatedCostTokens} HST.`);
      fetchNotifications(); // Fetch new notification about job completion
    } catch (err: any) {
      setError(`AI Processing failed: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSaveMemory = async (memoryData: Partial<Memory>) => {
    setIsLoading(true);
    setError(null);
    try {
      let savedMemory: Memory;
      if (memoryData.id) {
        savedMemory = (await api.updateMemory(memoryData.id, memoryData)) as Memory;
        setSearchResults(prev => prev.map(m => m.id === savedMemory.id ? savedMemory : m));
        if (selectedMemory?.id === savedMemory.id) setSelectedMemory(savedMemory);
      } else {
        savedMemory = await api.createMemory(memoryData);
        setSearchResults(prev => [savedMemory, ...prev]);
      }
      setCurrentView('search');
      setSelectedMemory(savedMemory);
      alert('Memory saved successfully!');
      fetchNotifications(); // New memories might trigger auto-processing notifications
    } catch (err) {
      setError('Failed to save memory.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setMemoryToEdit(null);
    setCurrentView('search');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-gray-800 p-6 flex flex-col shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">Historian AI</h1>
        <div className="flex flex-col space-y-4 flex-grow">
          <button onClick={() => setCurrentView('dashboard')} className={`p-3 text-left rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-cyan-700' : 'hover:bg-gray-700'}`}>Dashboard</button>
          <button onClick={() => setCurrentView('chat')} className={`p-3 text-left rounded-lg transition-colors ${currentView === 'chat' ? 'bg-cyan-700' : 'hover:bg-gray-700'}`}>AI Chat</button>
          <button onClick={() => setCurrentView('search')} className={`p-3 text-left rounded-lg transition-colors ${currentView === 'search' ? 'bg-cyan-700' : 'hover:bg-gray-700'}`}>Search Memories</button>
          <button onClick={handleCreateMemory} className={`p-3 text-left rounded-lg transition-colors ${currentView === 'create' ? 'bg-cyan-700' : 'hover:bg-gray-700'}`}>Add New Memory</button>
          <button onClick={() => setCurrentView('timeline')} className={`p-3 text-left rounded-lg transition-colors ${currentView === 'timeline' ? 'bg-cyan-700' : 'hover:bg-gray-700'}`}>Timeline View</button>
          <button onClick={() => setCurrentView('agentLogs')} className={`p-3 text-left rounded-lg transition-colors ${currentView === 'agentLogs' ? 'bg-purple-700' : 'hover:bg-gray-700'}`}>AI Agent Activity</button>
          <button onClick={() => setCurrentView('settings')} className={`p-3 text-left rounded-lg transition-colors ${currentView === 'settings' ? 'bg-cyan-700' : 'hover:bg-gray-700'}`}>Settings</button>
          <button onClick={() => setCurrentView('notifications')} className={`p-3 text-left rounded-lg transition-colors flex items-center justify-between ${currentView === 'notifications' ? 'bg-cyan-700' : 'hover:bg-gray-700'}`}>
            <span>Notifications</span>
            {unreadNotificationsCount > 0 && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{unreadNotificationsCount}</span>}
          </button>
        </div>
        {userProfile && (
          <div className="mt-8 pt-4 border-t border-gray-700 flex items-center">
            <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-10 h-10 rounded-full object-cover mr-3" />
            <div>
              <p className="font-semibold">{userProfile.name}</p>
              <p className="text-sm text-gray-400">{userProfile.email}</p>
              {userTokenAccount && <p className="text-sm text-purple-400 font-bold">Balance: {userTokenAccount.balance} HST</p>}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        {currentView !== 'chat' && (
            <div className="flex gap-2 mb-6 bg-gray-800 p-4 rounded-lg shadow-md sticky top-0 z-10">
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyPress={e => { if (e.key === 'Enter') handleInitialRecall(); }}
                placeholder="Quick recall: 'Trip to Italy', 'My first marathon', 'Meeting with Sarah'"
                className="flex-grow p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
            <button onClick={handleInitialRecall} disabled={isLoading} className="p-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-bold disabled:opacity-50 transition-colors">Recall</button>
            <button onClick={() => setCurrentView('search')} className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold disabled:opacity-50 transition-colors">Advanced Search</button>
            </div>
        )}

        {error && <ErrorMessage message={error} />}

        {/* Dynamic View Rendering */}
        <div className={currentView === 'chat' ? 'h-full' : ''}>
            {currentView === 'dashboard' && <DashboardInsights />}
            {currentView === 'chat' && <AIChatView onViewMemory={handleViewMemory} />}

            {currentView === 'search' && (
            <>
                <AdvancedSearchForm onSearch={handleAdvancedSearch} isLoading={isLoading} />
                <h2 className="text-3xl font-bold mb-6 text-white">Search Results</h2>
                {isLoading && searchResults.length === 0 && <LoadingSpinner />}
                {searchResults.length === 0 && !isLoading && !error && <p className="text-gray-500">No memories found for your query. Try a different search!</p>}
                {searchResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map(mem => (
                    <MemoryCard key={mem.id} memory={mem} onClick={() => handleViewMemory(mem.id)} />
                    ))}
                </div>
                )}
                {hasMore && searchResults.length > 0 && !isLoading && (
                <div className="text-center mt-8">
                    <button onClick={() => handleRecall({ query: query, reset: false })} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-bold disabled:opacity-50">Load More Memories</button>
                </div>
                )}
                {isLoading && searchResults.length > 0 && <LoadingSpinner />}
                {selectedMemory && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto">
                    <button onClick={() => setSelectedMemory(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-4xl">&times;</button>
                    <MemoryDetailComponent
                        memory={selectedMemory}
                        onEdit={handleEditMemory}
                        onDelete={handleDeleteMemory}
                        onProcessAI={handleProcessMemoryWithAI}
                    />
                    </div>
                </div>
                )}
            </>
            )}

            {currentView === 'create' && (
            <MemoryEditorComponent onSave={handleSaveMemory} onCancel={() => setCurrentView('dashboard')} isLoading={isLoading} />
            )}

            {currentView === 'edit' && memoryToEdit && (
            <MemoryEditorComponent memory={memoryToEdit} onSave={handleSaveMemory} onCancel={handleCancelEdit} isLoading={isLoading} />
            )}

            {currentView === 'timeline' && <TimelineViewComponent />}

            {currentView === 'agentLogs' && <AgentActivityLogViewer />}

            {currentView === 'settings' && <UserProfileSettings />}

            {currentView === 'notifications' && <NotificationCenter />}
        </div>
      </main>
    </div>
  );
};

// Root component that provides the context. This will wrap the main view.
const PersonalHistorianAIApp: React.FC = () => (
  <AppProvider>
    <PersonalHistorianAIView />
  </AppProvider>
);

export default PersonalHistorianAIApp;
        

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/blueprints/PersonalHistorianAIView.tsx
================================================================================

import React, { useState } from 'react';

interface Memory {
  id: string;
  title: string;
  summary: string;
  assets: { type: 'PHOTO' | 'EMAIL' | 'DOCUMENT', url: string }[];
  vrExperienceUrl: string;
}

const PersonalHistorianAIView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Memory | null>(null);
  
  const handleRecall = async () => {
    setIsLoading(true);
    setResult(null);
    // MOCK API
    const response: Memory = await new Promise(res => setTimeout(() => res({
      id: "mem-italy-2018",
      title: "Trip to Italy - Summer 2018",
      summary: "A 10-day trip focusing on Rome and Florence, key highlights include the Colosseum and Uffizi Gallery.",
      assets: [
        {type: "PHOTO", url: "#"},
        {type: "EMAIL", url: "#"}
      ],
      vrExperienceUrl: "#"
    }), 2500));
    setResult(response);
    setIsLoading(false);
  };
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Personal Historian AI</h1>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Recall a memory (e.g., 'My first marathon')" 
          className="w-full p-2 bg-gray-700 rounded"
        />
        <button onClick={handleRecall} disabled={isLoading} className="p-2 bg-cyan-600 rounded disabled:opacity-50">Recall</button>
      </div>
      {isLoading && <p className="mt-4">Searching digital archives... reconstructing timeline...</p>}
      {result && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-semibold">Recalled Memory: {result.title}</h2>
          <p className="text-gray-400 mt-2">{result.summary}</p>
          <p className="mt-2">Launch <a href={result.vrExperienceUrl} className="text-cyan-400 hover:underline">VR Memory Palace Experience</a></p>
          <h4 className="font-semibold mt-2">Key Assets:</h4>
          <ul className="list-disc list-inside">
            {result.assets.map((asset, i) => <li key={i}><a href={asset.url} className="text-cyan-400 hover:underline">{asset.type}</a></li>)}
          </ul>
        </div>
      )}
    </div>
  );
};
export default PersonalHistorianAIView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/blueprints/PersonalHistorianAIView.tsx
================================================================================

import React, { useState } from 'react';

interface Memory {
  id: string;
  title: string;
  summary: string;
  assets: { type: 'PHOTO' | 'EMAIL' | 'DOCUMENT', url: string }[];
  vrExperienceUrl: string;
}

const PersonalHistorianAIView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Memory | null>(null);
  
  const handleRecall = async () => {
    setIsLoading(true);
    setResult(null);
    // MOCK API
    const response: Memory = await new Promise(res => setTimeout(() => res({
      id: "mem-italy-2018",
      title: "Trip to Italy - Summer 2018",
      summary: "A 10-day trip focusing on Rome and Florence, key highlights include the Colosseum and Uffizi Gallery.",
      assets: [
        {type: "PHOTO", url: "#"},
        {type: "EMAIL", url: "#"}
      ],
      vrExperienceUrl: "#"
    }), 2500));
    setResult(response);
    setIsLoading(false);
  };
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Personal Historian AI</h1>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Recall a memory (e.g., 'My first marathon')" 
          className="w-full p-2 bg-gray-700 rounded"
        />
        <button onClick={handleRecall} disabled={isLoading} className="p-2 bg-cyan-600 rounded disabled:opacity-50">Recall</button>
      </div>
      {isLoading && <p className="mt-4">Searching digital archives... reconstructing timeline...</p>}
      {result && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-semibold">Recalled Memory: {result.title}</h2>
          <p className="text-gray-400 mt-2">{result.summary}</p>
          <p className="mt-2">Launch <a href={result.vrExperienceUrl} className="text-cyan-400 hover:underline">VR Memory Palace Experience</a></p>
          <h4 className="font-semibold mt-2">Key Assets:</h4>
          <ul className="list-disc list-inside">
            {result.assets.map((asset, i) => <li key={i}><a href={asset.url} className="text-cyan-400 hover:underline">{asset.type}</a></li>)}
          </ul>
        </div>
      )}
    </div>
  );
};
export default PersonalHistorianAIView;
