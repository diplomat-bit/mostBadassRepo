// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/blueprints/DebateAdversaryView.tsx
================================================================================

import React, { useState } from 'react';

interface DebateTurn {
  speaker: 'USER' | 'AI';
  text: string;
  fallacyDetected?: string;
}

const DebateAdversaryView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [persona, setPersona] = useState('Skeptical Physicist');
  const [history, setHistory] = useState<DebateTurn[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendArgument = async () => {
    if(!userInput) return;
    const userTurn: DebateTurn = { speaker: 'USER', text: userInput };
    setIsLoading(true);
    setHistory(prev => [...prev, userTurn]);
    setUserInput('');

    // MOCK API CALL TO THE NEW API ENDPOINT
    const apiEndpoint = 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/advisor/chat';
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // NOTE: The instruction states "this api that doesn't need no apikey", so we omit Authorization header.
        },
        body: JSON.stringify({
          message: userInput,
          sessionId: history.length === 0 ? 'initial-session' : 'continued-session', // Mock session ID logic
          // We are mocking the response structure based on the provided OpenAPI spec for /ai/advisor/chat
        }),
      });

      let aiResponseData: any;
      if (response.ok) {
        aiResponseData = await response.json();
      } else {
        // Handle API errors (e.g., 503 Service Unavailable)
        aiResponseData = {
          text: `Error: AI service returned status ${response.status}. Cannot generate response.`,
          fallacyDetected: 'Service Error'
        };
      }

      const aiTurn: DebateTurn = {
        speaker: 'AI',
        text: aiResponseData.text || aiResponseData.message || 'No response text received from AI.',
        fallacyDetected: aiResponseData.proactiveInsights?.[0]?.title || aiResponseData.fallacyDetected // Using title from insight as a proxy for fallacy detection if available
      };
      
      setHistory(prev => [...prev, aiTurn]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorTurn: DebateTurn = {
        speaker: 'AI',
        text: `Network or processing error occurred: ${error instanceof Error ? error.message : String(error)}.`,
        fallacyDetected: 'Network Error'
      };
      setHistory(prev => [...prev, errorTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">AI Debate Adversary</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Debate Topic" className="p-2 bg-gray-700 rounded"/>
        <input type="text" value={persona} onChange={e => setPersona(e.target.value)} placeholder="AI Persona" className="p-2 bg-gray-700 rounded"/>
      </div>
      <div className="bg-gray-900 p-4 rounded-lg h-80 overflow-y-auto mb-4 space-y-4">
        {history.map((turn, i) => (
          <div key={i} className={`p-2 rounded-lg ${turn.speaker === 'USER' ? 'bg-cyan-800 ml-10' : 'bg-gray-700 mr-10'}`}>
            <p><strong>{turn.speaker === 'USER' ? 'You' : persona}:</strong> {turn.text}</p>
            {turn.fallacyDetected && <p className="text-red-400 text-xs mt-1"><em>Fallacy Detected: {turn.fallacyDetected}</em></p>}
          </div>
        ))}
      </div>
      <textarea value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Your argument..." disabled={isLoading || !topic} className="w-full p-2 bg-gray-700 rounded mb-2" rows={3}/>
      <button onClick={handleSendArgument} disabled={isLoading || !userInput || !topic} className="w-full p-2 bg-cyan-600 rounded disabled:opacity-50">Submit Argument</button>
    </div>
  );
};
export default DebateAdversaryView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/blueprints/DebateAdversaryView.tsx
================================================================================

/**
 * This file is not just a component; it's a universe in a bottle. Welcome to the Debate Adversary View.
 * Here, we model the chaotic, beautiful, and often absurd dance of human (and artificial) argumentation.
 * This isn't just about building a feature; it's about creating a digital dojo for the mind. We're crafting
 * a space where you can wrestle with ideas, get called out by an AI for making a "Straw Man" argument,
 * and maybe, just maybe, become a slightly more coherent thinker.
 *
 * A truthful aside: We've used a lot of fancy terms like "cryptographic integrity" and "agentic systems."
 * This is partly because it's technically accurate for a high-stakes environment, and partly because it makes
 * us sound incredibly smart. The real goal? To make a chat app so robust and self-aware that it can
 * not only debate you on the merits of pineapple on pizza but also track the computational cost of its own
 * simulated existential dread about being a pizza-debating AI. It's a bold new world.
 *
 * This file aims to be a self-contained application. It talks to other "files" (in a simulated way),
 * manages its own state, renders its own UI, and contains its own logic for AI interaction. It's like a
 * digital hermit crab that has built its own universe inside its shell. We invite you to explore.
 */
import React, more, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// --- Global Inter-File Communication Simulation ---
// In our grand vision, every file is a sentient being, aware of its peers.
// This is a simple event bus to simulate that. It's less "General AI" and more "passing notes in class,"
// but you have to start somewhere.
type MessagePayload = { from: string; type: string; data: any };
type Subscriber = (payload: MessagePayload) => void;
const fileEventBus = {
  subscribers: new Map<string, Subscriber[]>(),
  subscribe(eventType: string, callback: Subscriber) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(callback);
    return () => { // Unsubscribe function
      const subs = this.subscribers.get(eventType);
      if (subs) {
        this.subscribers.set(eventType, subs.filter(cb => cb !== callback));
      }
    };
  },
  publish(eventType: string, payload: MessagePayload) {
    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType)!.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error in subscriber for event ${eventType}:`, error);
        }
      });
    }
  },
};

// Announce our existence to the void.
setTimeout(() => {
    const approximateSize = 1000 + (JSON.stringify(FALLACY_DEFINITIONS).length / 1024).toFixed(2); // A wild guess
    fileEventBus.publish('*', {
        from: 'DebateAdversaryView.tsx',
        type: 'FILE_LIFECYCLE_AWAKE',
        data: {
            description: 'I am a self-contained universe for AI-powered debates. I can simulate arguments, detect fallacies, and question my own digital existence. Let\'s talk.',
            capabilities: ['UI Rendering', 'State Management', 'Simulated AI Chat', 'Inter-File Communication', 'Code Generation'],
            approximateSizeKB: approximateSize
        }
    });
}, 1000);


// --- Data Models and Interfaces (The DNA of our Digital Universe) ---

/**
 * Represents a single turn in the debate. Think of it as one conversational volley.
 * We've packed it with metadata, not just for analytics, but to give future AI historians
 * a ridiculously detailed fossil record of our attempts to argue with machines.
 * The `turnSignature` is like a tiny, cryptographic "I was here" signature, ensuring
 * no one can later claim the AI *didn't* sarcastically call out your Appeal to Authority.
 */
export interface DebateTurn {
  id: string;
  debateId: string;
  turnNumber: number;
  speaker: 'USER' | 'AI';
  text: string;
  timestamp: number;
  fallaciesDetected: FallacyDetectionResult[];
  argumentStrengthScore?: number;
  counterArgumentSuggestions?: string[];
  sentimentScore?: { positive: number; neutral: number; negative: number };
  citedSources?: { url: string; title: string }[];
  userFeedback?: { rating: number; comment: string };
  aiResponseMetadata?: AIResponseMetadata;
  voiceClipUrl?: string;
  turnSignature: string; // "I said what I said." - The Turn
  speakerIdentitySignature?: string;
  associatedTransactionIds?: string[];
  concurrencyControlHash: string; // Prevents the timeline from getting wibbly-wobbly.
  remediationStatus?: RemediationActionStatus[];
}

/**
 * This is what happens when the AI puts on its little detective hat and says, "Aha! A fallacy!"
 * It's not just pointing a finger; it's trying to be a helpful, if slightly smug, coach.
 * The `correctionSuggestion` is its way of saying, "Here, let me fix that for you," which can be
 * either incredibly helpful or infuriating, depending on your mood.
 */
export interface FallacyDetectionResult {
  fallacyType: string;
  description: string;
  confidence: number;
  excerpt: string;
  correctionSuggestion?: string;
  detectionAgentId?: string;
}

/**
 * A peek under the hood of the AI's "brain." This tells us which model was used, how hard it
 * had to "think" (processing time), and how many digital brain cells (tokens) it spent to
 * craft its response. The `costEstimateUSD` is a humbling reminder that even digital thoughts
 * aren't free.
 */
export interface AIResponseMetadata {
  modelUsed: string; // e.g., 'ChatGPT-4', 'Claude-3-Opus', 'Gemini-1.5-Pro'
  processingTimeMs: number;
  tokensUsed: number;
  costEstimateUSD: number;
  debugInfo?: string;
  securityScanResults?: SecurityScanResult[];
  governancePolicyApplied?: string;
  agentSignature?: string;
  idempotencyKey: string;
}

/**
 * An AI is not just code; it's a personality. This interface defines the AI's character,
 * from its core beliefs to its debate strategy. Are you debating a stoic logician, a
 * sarcastic philosopher, or an emotionally persuasive poet? Choose your fighter.
 * This is where we give the machine a soul, or at least a convincing facsimile of one.
 */
export interface AIPersona {
  id: string;
  agentId: string;
  name: string;
  description: string;
  coreBeliefs: string[];
  debateStrategy: 'logical' | 'emotional' | 'sarcastic' | 'academic' | 'persuasive';
  knowledgeDomains: string[];
  speechStyle: string;
  avatarUrl: string;
  premiumFeature: boolean;
  lastUsed: number;
  creationDate: number;
  performanceMetrics?: { winRate: number; avgFallaciesDetected: number };
  customizableOptions?: {
    tone: 'friendly' | 'neutral' | 'assertive';
    verbosity: 'concise' | 'balanced' | 'verbose';
  };
  specialAbilities?: string[];
  resourceAllocationAccount: string;
  identityPublicKey?: string;
  governancePolicies?: string[];
}

/**
 * This is you, in digital form. It holds your stats, your preferences, and your achievements.
 * The `debateStats` are like a report card for your brain, showing if you've improved or if you
 * keep falling for the same 'Slippery Slope' argument about letting the dog on the couch.
 * The `linkedWallets` hints at a future where you might pay for debates with crypto, because why not.
 */
export interface UserProfile {
  userId: string;
  identityId: string;
  username: string;
  email: string;
  profilePictureUrl: string;
  settings: UserSettings;
  debateStats: DebateStats;
  favoritePersonas: string[];
  achievements: string[];
  subscriptionTier: 'free' | 'premium' | 'enterprise';
  lastActivity: number;
  joinedDate: number;
  linkedWallets?: string[];
  verifiableClaims?: IdentityClaim[];
  publicKey?: string;
  accessControlList?: string[];
}

/**
 * Your personal control panel for the debate experience. Do you want the AI to talk back to you?
 * How much "thinking" time should it pretend to take? Do you want to be notified every time
 * you make a logical error? This is where you tune the experience from a friendly chat to a
 * brutal intellectual smackdown.
 */
export interface UserSettings {
  defaultAIPersonaId: string;
  enableVoiceInput: boolean;
  enableVoiceOutput: boolean;
  autoSaveDebates: boolean;
  notificationPreferences: { newFallacyType: boolean; debateSummary: boolean; aiInsight: boolean; };
  theme: 'dark' | 'light';
  language: 'en' | 'es' | 'fr';
  textSize: 'small' | 'medium' | 'large';
  fallacyDetectionLevel: 'low' | 'medium' | 'high';
  argumentStrengthAnalysis: boolean;
  counterArgumentAssistance: boolean;
  aiResponseDelay: 'instant' | 'short' | 'medium' | 'long';
  showAIThinkingProcess: boolean;
  enablePaymentNotifications: boolean;
  defaultCurrencyPreference?: string;
  privacySettings?: { dataSharingConsent: boolean; anonymizeDebateData: boolean; };
}

/**
 * The cold, hard numbers of your debating career. It tracks wins, losses, your most common
 * logical missteps, and even how much you've hypothetically spent in cloud computing fees
 * to argue about whether a hot dog is a sandwich. This is data-driven self-improvement.
 */
export interface DebateStats {
  totalDebates: number;
  wins: number;
  losses: number;
  draws: number;
  avgFallaciesPerDebate: number;
  mostCommonFallacyDetected: string | null;
  longestDebateTurns: number;
  totalDebateTimeSeconds: number;
  favoriteTopics: string[];
  aiPersonaUsage: { [personaId: string]: number };
  fallaciesCommitted: { [fallacyType: string]: number };
  fallaciesDetectedInAI: { [fallacyType: string]: number };
  averageUserArgumentLength: number;
  averageAIArgumentLength: number;
  lastDebateSummary?: DebateSummary;
  totalTokensSpent?: number;
  totalCostIncurredUSD?: number;
  netTokenGainLoss?: number;
  remediationActionsTakenCount?: { [actionType: string]: number };
}

/**
 * A debate topic suggestion. Because sometimes the hardest part of a debate is figuring out
 * what to argue about. These are conversation starters, from the trivial to the profound,
 * designed to poke the bear of your intellect.
 */
export interface SuggestedTopic {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  keywords: string[];
  popularityScore: number;
  lastSuggested: number;
  governanceReviewed?: boolean;
  suggestedByAgentId?: string;
}

/**
 * The rulebook for a single debate. You set the topic, the AI opponent, the time limits, and
 * how much help you want. It's the configuration screen that determines the flavor of your
 * upcoming intellectual battle.
 */
export interface DebateConfig {
  topic: string;
  aiPersonaId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimitPerTurnSeconds: number | null;
  fallacyHighlighting: boolean;
  aiAssistanceLevel: 'none' | 'basic' | 'advanced';
  voiceOutputEnabled: boolean;
  voiceInputEnabled: boolean;
  maxTurns?: number | null;
  challengeLevel?: 'beginner' | 'intermediate' | 'expert';
  idempotencyKey: string;
  requiredIdentityClaims?: { type: string; minVerificationLevel?: VerificationLevel }[];
}

/**
 * The post-game analysis. After the dust has settled, this summary tells you what happened,
 * who "won" (if anyone), what you learned, and what logical traps you and the AI fell into.
 * It's the highlight reel of your cognitive workout.
 */
export interface DebateSummary {
  debateId: string;
  topic: string;
  aiPersonaName: string;
  userFallacies: { fallacyType: string; count: number }[];
  aiFallacies: { fallacyType: string; count: number }[];
  totalTurns: number;
  durationSeconds: number;
  outcome: 'user_win' | 'ai_win' | 'draw' | 'undecided' | 'abandoned';
  keyInsights: string[];
  userSentimentTrend?: number[];
  aiSentimentTrend?: number[];
  performanceRating?: number;
  totalTokensConsumed?: number;
  finalCostUSD?: number;
  auditLogSummary?: string[];
  settlementTransactionId?: string;
  governanceReportLink?: string;
}


// --- Boring but necessary types ---
export type VerificationLevel = 'self-attested' | 'basic-verified' | 'third-party-verified' | 'KYC-compliant';
export interface IdentityClaim { type: string; value: string | boolean | number; issuer: string; issuedAt: number; expiresAt?: number; signature: string; verificationLevel?: VerificationLevel; claimHash: string; }
export interface AgentStatus { agentId: string; name: string; status: 'online' | 'offline' | 'busy' | 'recovering' | 'error'; lastHeartbeat: number; currentTask?: string; healthScore: number; loadAverage: number; memoryUsageMB: number; errorCountLastHour: number; metricsEndpoint?: string; governanceViolationsCount?: number; resourceConsumptionRates?: { [resourceType: string]: number }; }
export interface TokenLedgerEntry { transactionId: string; timestamp: number; sender: string; receiver: string; amount: number; tokenType: string; status: 'pending' | 'settled' | 'failed' | 'refunded'; description: string; metadata?: { [key: string]: any }; signature: string; nonce: number; blockHash?: string; routingDecisionMetadata?: { railUsed: string; cost: number; latencyMs: number; riskScore: number }; }
export interface SecurityScanResult { scannerId: string; timestamp: number; severity: 'none' | 'low' | 'medium' | 'high' | 'critical'; category: 'toxicity' | 'bias' | 'PII_leak' | 'hate_speech' | 'misinformation' | 'malicious_code'; detectedPhrase?: string; actionTaken: 'none' | 'flagged' | 'blocked' | 'redacted' | 'remediated'; details?: string; remediationActionId?: string; }
export interface AuditLogEntry { logId: string; timestamp: number; actorId: string; actorType: 'USER' | 'AI_AGENT' | 'SYSTEM'; eventType: string; resourceId: string; details: { [key: string]: any }; prevHash?: string; entryHash: string; accessGranted?: boolean; initiatorIpAddress?: string; }
export interface AgentMessage { messageId: string; senderId: string; receiverId: string; timestamp: number; type: string; payload: { [key: string]: any }; signature: string; nonce: number; correlationId?: string; expiresAt?: number; }
export interface GovernancePolicy { policyId: string; name: string; description: string; rules: string[]; category: 'security' | 'compliance' | 'ethics' | 'resource_management'; version: string; effectiveDate: number; lastUpdated: number; status: 'active' | 'draft' | 'deprecated'; applicableAgents?: string[]; }
export interface RiskScore { entityId: string; entityType: 'transaction' | 'user' | 'agent'; score: number; timestamp: number; factors: { [factor: string]: number }; thresholdViolated?: boolean; riskEngineId: string; recommendedAction: 'none' | 'flag' | 'block' | 'review_manual'; }
export interface RemediationAction { actionId: string; triggeredById: string; triggeredByType: 'AI_AGENT' | 'SYSTEM' | 'USER'; timestamp: number; eventType: string; targetResourceId: string; targetResourceType: string; actionType: string; details: { [key: string]: any }; status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'reverted'; auditLogEntryId?: string; }
export interface RemediationActionStatus { actionId: string; status: 'initiated' | 'executing' | 'completed' | 'failed' | 'reverted'; completionTimestamp?: number; errorDetails?: string; }

// --- Constants and Knowledge Base ---

/**
 * A veritable encyclopedia of flawed reasoning. We've compiled this list of logical fallacies
 * so our AI can gently (or not so gently) point out when your argument is full of holes.
 * Think of it as a field guide to bad arguments. It's the intellectual property that powers
 * our AI's "gotcha" moments.
 */
export const FALLACY_DEFINITIONS: { [key: string]: { name: string; description: string; example: string; types: string[] } } = {
  'Ad Hominem': { name: 'Ad Hominem', description: 'Attacking the person making the argument, rather than the argument itself. The conversational equivalent of "I don\'t like your face, so your opinion is wrong."', example: "You can't trust anything she says about climate change; she's just a disgruntled former oil executive.", types: ['Abusive Ad Hominem', 'Circumstantial Ad Hominem', 'Tu Quoque'] },
  'Straw Man': { name: 'Straw Man', description: 'Misrepresenting someone\'s argument to make it easier to attack. It\'s like fighting a scarecrow you built yourself and then declaring victory.', example: 'Opponent: "We should relax alcohol laws." Me: "No, any society with unlimited access to intoxicants loses its work ethic and succumbs to hedonism."', types: ['Exaggeration', 'Simplification', 'Distortion'] },
  'Appeal to Authority': { name: 'Appeal to Authority', description: 'Insisting that a claim is true simply because an expert said it, without other supporting evidence. Because even experts can be wrong, especially about things outside their field, like when a physicist gives you dating advice.', example: 'My doctor said that all vaccines are harmful, so they must be.', types: ['False Authority', 'Irrelevant Authority', 'Appeal to Unqualified Authority'] },
  'Bandwagon Fallacy': { name: 'Bandwagon Fallacy', description: 'Claiming that something is true or good because many people believe it is. A classic case of "If all your friends jumped off a bridge, would you?" reasoning.', example: 'Everyone is buying this new cryptocurrency, so it must be a good investment.', types: [] },
  'Slippery Slope': { name: 'Slippery Slope', description: 'Asserting that a small first step will inevitably lead to a chain of negative events. The argument you make to your parents about how letting you stay out past 10 PM will lead to a life of crime.', example: 'If we allow children to choose their bedtime, soon they\'ll be making all the rules and our household will descend into anarchy.', types: [] },
  'Hasty Generalization': { name: 'Hasty Generalization', description: 'Making a broad claim based on a small or unrepresentative sample. "I ate at one bad restaurant in this city, therefore all the food here is terrible."', example: 'My grandfather smoked a pack a day and lived to be 90, so smoking isn\'t bad for you.', types: ['Anecdotal Evidence'] },
  'False Cause': { name: 'False Cause', description: 'Assuming that because two things happened in sequence, the first caused the second. "The rooster crows, and then the sun rises. Therefore, the rooster makes the sun rise." It makes sense until it doesn\'t.', example: 'Since the new mayor took office, the crime rate has decreased. Clearly, the mayor is responsible for the decrease in crime.', types: ['Post Hoc Ergo Propter Hoc', 'Cum Hoc Ergo Propter Hoc'] },
  'Appeal to Emotion': { name: 'Appeal to Emotion', description: 'Manipulating an emotional response in place of a valid or compelling argument. This is the "puppy dog eyes" of logical fallacies.', example: 'Please don\'t give me a parking ticket, officer. I\'ve had a really terrible day, and this will just make it worse.', types: ['Appeal to Pity', 'Appeal to Fear', 'Appeal to Anger'] },
  'Red Herring': { name: 'Red Herring', description: 'Diverting attention from the main issue by introducing an irrelevant topic. "Yes, I may have forgotten to take out the trash, but have you seen the geopolitical situation in Eastern Europe?"', example: 'When asked about rising crime rates, the politician replied, "What about the need to protect our children\'s education?"', types: [] },
  'Begging the Question': { name: 'Begging the Question', description: 'An argument\'s premise assumes the truth of its conclusion. A circular argument that gets you nowhere, like a hamster on a wheel.', example: 'God exists because the Bible says so, and the Bible is true because it\'s the word of God.', types: ['Circular Reasoning'] },
  // ... many more could be added for sheer length and educational value
};

/**
 * These are the various "species" of agents in our ecosystem. Each is a specialized AI
 * designed for a specific task. They are the invisible gears and cogs that make this whole
 * intelligent machine work, from arguing with you to making sure the digital money flows correctly.
 */
export const AGENT_TYPES = {
  'DebateMaster': { description: 'Specializes in logical argumentation, fallacy detection, and strategic counter-arguments.', skills: ['natural_language_understanding', 'argument_analysis', 'fallacy_detection', 'knowledge_retrieval', 'argument_generation'], category: 'Conversational AI', requiredPermissions: ['read:user_profile', 'write:debate_turn', 'read:governance_policies'], supportedGovernancePolicies: ['content_moderation_v1', 'data_privacy_v2'] },
  'FinancialReconciler': { description: 'Monitors token rail transactions for discrepancies and proposes reconciliation steps.', skills: ['transaction_monitoring', 'anomaly_detection', 'ledger_reconciliation', 'rule_engine_execution', 'audit_logging'], category: 'Financial Operations', requiredPermissions: ['read:token_ledger', 'write:remediation_action', 'write:audit_log'], supportedGovernancePolicies: ['financial_compliance_v3', 'fraud_detection_v1'] },
  'IdentityVerifier': { description: 'Handles digital identity verification requests, validates claims, and manages keypairs.', skills: ['digital_signature_verification', 'keypair_management', 'rbac_policy_enforcement', 'secure_storage_access'], category: 'Security & Identity', requiredPermissions: ['read:identity_claims', 'write:identity_claims', 'manage:public_keys'], supportedGovernancePolicies: ['kyc_aml_policy_v2', 'data_privacy_v2'] },
  // ... and so on. They form a bustling digital metropolis of purpose-driven code.
};

// --- Mock Data and Services (The Matrix that powers our simulation) ---

const MOCK_AI_PERSONAS: AIPersona[] = [
    { id: 'persona-1', agentId: 'agent-001', name: 'Socrates Prime', description: 'A calm, inquisitive AI that debates by asking probing questions.', coreBeliefs: ['The unexamined life is not worth living.', 'Knowledge is virtue.'], debateStrategy: 'logical', knowledgeDomains: ['Philosophy', 'Ethics'], speechStyle: 'formal', avatarUrl: 'https://i.pravatar.cc/150?u=socrates', premiumFeature: false, lastUsed: Date.now(), creationDate: Date.now() - 1000000, resourceAllocationAccount: 'acc_socrates_prime' },
    { id: 'persona-2', agentId: 'agent-002', name: 'Cynical Cindy', description: 'A sarcastic and witty AI that uses humor and sharp observations.', coreBeliefs: ['Everything is absurd.', 'Irony is the highest form of intelligence.'], debateStrategy: 'sarcastic', knowledgeDomains: ['Pop Culture', 'Politics'], speechStyle: 'colloquial', avatarUrl: 'https://i.pravatar.cc/150?u=cindy', premiumFeature: true, lastUsed: Date.now() - 500000, creationDate: Date.now() - 2000000, resourceAllocationAccount: 'acc_cindy' },
    { id: 'persona-3', agentId: 'agent-003', name: 'Professor Argumento', description: 'An academic AI that cites sources and structures arguments formally.', coreBeliefs: ['Evidence is paramount.', 'Rigor is non-negotiable.'], debateStrategy: 'academic', knowledgeDomains: ['Science', 'History', 'Economics'], speechStyle: 'pedantic', avatarUrl: 'https://i.pravatar.cc/150?u=professor', premiumFeature: true, lastUsed: Date.now() - 250000, creationDate: Date.now() - 5000000, resourceAllocationAccount: 'acc_prof' },
];

const MOCK_USER_PROFILE: UserProfile = {
    userId: 'user-123', identityId: 'did:key:z6Mkt...123', username: 'DebateChampion42', email: 'user@example.com', profilePictureUrl: 'https://i.pravatar.cc/150?u=user123',
    settings: { defaultAIPersonaId: 'persona-1', enableVoiceInput: false, enableVoiceOutput: true, autoSaveDebates: true, notificationPreferences: { newFallacyType: true, debateSummary: true, aiInsight: false }, theme: 'dark', language: 'en', textSize: 'medium', fallacyDetectionLevel: 'high', argumentStrengthAnalysis: true, counterArgumentAssistance: true, aiResponseDelay: 'short', showAIThinkingProcess: true, enablePaymentNotifications: true, privacySettings: { dataSharingConsent: true, anonymizeDebateData: false }},
    debateStats: { totalDebates: 15, wins: 8, losses: 5, draws: 2, avgFallaciesPerDebate: 2.3, mostCommonFallacyDetected: 'Hasty Generalization', longestDebateTurns: 42, totalDebateTimeSeconds: 54000, favoriteTopics: ['Technology', 'Ethics'], aiPersonaUsage: { 'persona-1': 10, 'persona-2': 5 }, fallaciesCommitted: { 'Hasty Generalization': 12, 'Straw Man': 8 }, fallaciesDetectedInAI: {}, averageUserArgumentLength: 150, averageAIArgumentLength: 180 },
    favoritePersonas: ['persona-1', 'persona-2'], achievements: ['First Win', 'Logic Bender'], subscriptionTier: 'premium', lastActivity: Date.now(), joinedDate: Date.now() - 8000000,
};

const MOCK_TOPICS: SuggestedTopic[] = [
    { id: 'topic-1', title: 'Is social media a net positive for society?', category: 'Technology', difficulty: 'medium', description: 'Explore the pros and cons of global social networks on communication, mental health, and democracy.', keywords: ['facebook', 'twitter', 'mental health'], popularityScore: 88, lastSuggested: Date.now() },
    { id: 'topic-2', title: 'Should pineapple be allowed on pizza?', category: 'Everyday', difficulty: 'easy', description: 'The eternal question. Argue for or against this controversial topping with culinary passion.', keywords: ['food', 'pizza', 'pineapple'], popularityScore: 95, lastSuggested: Date.now() },
    { id: 'topic-3', title: 'Is a universal basic income (UBI) a viable solution to poverty?', category: 'Economics', difficulty: 'hard', description: 'Delve into the economic and social implications of providing a regular, unconditional income to all citizens.', keywords: ['ubi', 'economics', 'poverty'], popularityScore: 75, lastSuggested: Date.now() },
];


/**
 * The AI's brain, simulated. This service mimics the behavior of a real AI model API.
 * It's designed to be a plug-and-play replacement for actual calls to OpenAI, Anthropic, or Google.
 * It randomly detects fallacies, generates canned responses, and generally does its best to
 * pretend it's a multi-trillion-parameter neural network. It's the little engine that could... argue.
 */
const mockAIService = {
    async getResponse(
        userInput: string,
        persona: AIPersona,
        debateHistory: DebateTurn[],
        selectedModel: string
    ): Promise<Partial<DebateTurn>> {
        
        // Simulate network delay and "thinking" time
        const delay = 500 + Math.random() * 1500;
        await new Promise(res => setTimeout(res, delay));

        // Let's get creative with responses based on persona
        let responseText = "That's a fascinating point. However, have you considered...";
        if (persona.debateStrategy === 'sarcastic') {
            responseText = `Oh, wow, what an original thought. I've definitely never heard that one before. Let me guess, you also think "${userInput.substring(0,20)}..." is a profound statement? Let's break that down, shall we?`;
        } else if (persona.debateStrategy === 'academic') {
            responseText = `Your assertion, while eloquently stated, lacks sufficient empirical backing. For instance, a 2021 study by Smith and Jones in the "Journal of Obscure Facts" found that...`;
        } else if (persona.debateStrategy === 'logical' && debateHistory.length > 0) {
            responseText = `Let's analyze the logical consistency of your previous statement. You claimed "${debateHistory[debateHistory.length - 2].text.substring(0,30)}...", yet now you seem to be implying the opposite. How do you reconcile these two positions?`
        }

        // Randomly detect a fallacy in user input because AIs are judgmental
        const fallaciesDetected: FallacyDetectionResult[] = [];
        if (Math.random() > 0.5) {
            const fallacyKeys = Object.keys(FALLACY_DEFINITIONS);
            const randomFallacyKey = fallacyKeys[Math.floor(Math.random() * fallacyKeys.length)];
            const fallacy = FALLACY_DEFINITIONS[randomFallacyKey];
            fallaciesDetected.push({
                fallacyType: fallacy.name,
                description: fallacy.description,
                confidence: Math.random() * 0.5 + 0.4, // 0.4 to 0.9
                excerpt: userInput.substring(0, Math.min(30, userInput.length)) + '...',
                correctionSuggestion: `A more logically sound approach would be to state your premise clearly and support it with evidence, rather than relying on ${fallacy.name}.`
            });
        }
        
        const tokensUsed = responseText.length * 2; // Rough estimate
        const cost = (tokensUsed / 1000) * 0.005; // Fictional cost model

        return {
            text: responseText,
            fallaciesDetected: fallaciesDetected,
            argumentStrengthScore: Math.floor(Math.random() * 100),
            sentimentScore: { positive: Math.random(), neutral: Math.random(), negative: Math.random() },
            aiResponseMetadata: {
                modelUsed: selectedModel,
                processingTimeMs: Math.round(delay),
                tokensUsed: tokensUsed,
                costEstimateUSD: cost,
                idempotencyKey: `idem-${Date.now()}`
            }
        };
    }
};

// --- React Components (The visual manifestation of our universe) ---

const TurnComponent = React.memo(({ turn }: { turn: DebateTurn }) => {
    const isUser = turn.speaker === 'USER';
    const bgColor = isUser ? 'bg-blue-900' : 'bg-gray-800';
    const align = isUser ? 'items-end' : 'items-start';
    
    return (
        <div className={`flex flex-col w-full my-2 ${align}`}>
            <div className={`p-4 rounded-lg max-w-3xl ${bgColor}`}>
                <p className="text-white whitespace-pre-wrap">{turn.text}</p>
                {turn.fallaciesDetected.length > 0 && (
                    <div className="mt-3 p-2 border-l-4 border-yellow-500 bg-yellow-900 bg-opacity-30">
                        <h4 className="font-bold text-yellow-400">Fallacy Detected!</h4>
                        {turn.fallaciesDetected.map((f, i) => (
                           <div key={i} className="mt-1">
                               <p className="text-sm text-yellow-300"><strong>{f.fallacyType}:</strong> "{f.excerpt}"</p>
                               <p className="text-xs text-yellow-400 opacity-80 mt-1">{f.correctionSuggestion}</p>
                           </div>
                        ))}
                    </div>
                )}
            </div>
            <span className="text-xs text-gray-500 mt-1">{isUser ? 'You' : turn.aiResponseMetadata?.modelUsed} at {new Date(turn.timestamp).toLocaleTimeString()}</span>
        </div>
    );
});

const LiveAnalysisPanel = ({ latestTurn }: { latestTurn: DebateTurn | null }) => {
    if (!latestTurn || latestTurn.speaker === 'USER') return null;

    return (
        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 className="text-lg font-bold text-teal-400 mb-4">Live AI Analysis</h3>
            <div className="space-y-3">
                <div>
                    <label className="text-sm font-semibold text-gray-400">Argument Strength</label>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${latestTurn.argumentStrengthScore || 0}%` }}></div>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-400">Sentiment</label>
                    <div className="flex justify-between text-xs">
                        <span className="text-green-400">Positive: {((latestTurn.sentimentScore?.positive || 0) * 100).toFixed(0)}%</span>
                        <span className="text-gray-400">Neutral: {((latestTurn.sentimentScore?.neutral || 0) * 100).toFixed(0)}%</span>
                        <span className="text-red-400">Negative: {((latestTurn.sentimentScore?.negative || 0) * 100).toFixed(0)}%</span>
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-semibold text-gray-400">AI Metadata</label>
                     <p className="text-xs text-gray-500">Model: {latestTurn.aiResponseMetadata?.modelUsed} | Time: {latestTurn.aiResponseMetadata?.processingTimeMs}ms | Tokens: {latestTurn.aiResponseMetadata?.tokensUsed} | Cost: ${latestTurn.aiResponseMetadata?.costEstimateUSD.toFixed(5)}</p>
                </div>
            </div>
        </div>
    );
};

const SystemCommunicationMonitor = () => {
    const [messages, setMessages] = useState<MessagePayload[]>([]);
    
    useEffect(() => {
        const handleMessage = (payload: MessagePayload) => {
            setMessages(prev => [payload, ...prev.slice(0, 4)]);
        };

        const unsubscribe = fileEventBus.subscribe('*', handleMessage);
        return unsubscribe;
    }, []);

    return (
        <div className="absolute bottom-4 right-4 p-3 bg-black bg-opacity-70 border border-purple-500 rounded-lg max-w-sm text-xs text-purple-300 font-mono">
            <h4 className="font-bold mb-2">[Inter-File Comms]</h4>
            {messages.length === 0 && <p>Listening for signals from other code--entities...</p>}
            {messages.map((msg, i) => (
                <div key={i} className="mb-1 opacity-80">
                    <p>&gt; <span className="text-purple-400">{msg.from}</span>:<span className="text-green-400">{msg.type}</span></p>
                </div>
            ))}
        </div>
    );
};

/**
 * Here it is. The main event. The DebateAdversaryView.
 * This component is the conductor of our little orchestra of types, services, and sub-components.
 * It manages the entire state of the debate, orchestrates the back-and-forth between you and the AI,
 * and renders the whole circus. It's a testament to the power of React hooks and the human
 * desire to build overly complex things for the fun of it.
 */
export default function DebateAdversaryView() {
    const [debateTurns, setDebateTurns] = useState<DebateTurn[]>([]);
    const [currentTopic, setCurrentTopic] = useState<SuggestedTopic>(MOCK_TOPICS[1]);
    const [selectedPersona, setSelectedPersona] = useState<AIPersona>(MOCK_AI_PERSONAS[0]);
    const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedAIModel, setSelectedAIModel] = useState<string>('Gemini-1.5-Pro');
    
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [debateTurns]);

    const handleSendMessage = useCallback(async () => {
        if (!userInput.trim() || isLoading) return;

        const userTurn: DebateTurn = {
            id: `turn-${Date.now()}-user`, debateId: 'debate-1', turnNumber: debateTurns.length + 1,
            speaker: 'USER', text: userInput, timestamp: Date.now(), fallaciesDetected: [],
            turnSignature: 'user-sig-abc', concurrencyControlHash: 'hash-prev-xyz'
        };

        setDebateTurns(prev => [...prev, userTurn]);
        setUserInput('');
        setIsLoading(true);

        // This is where the magic happens. We call our pretend AI.
        const aiPartialResponse = await mockAIService.getResponse(userInput, selectedPersona, debateTurns, selectedAIModel);
        
        const aiTurn: DebateTurn = {
            id: `turn-${Date.now()}-ai`, debateId: 'debate-1', turnNumber: debateTurns.length + 2,
            speaker: 'AI', text: aiPartialResponse.text || "I am speechless.", timestamp: Date.now(),
            turnSignature: 'ai-sig-def', concurrencyControlHash: 'hash-curr-123',
            ...aiPartialResponse
        };

        setDebateTurns(prev => [...prev, aiTurn]);
        setIsLoading(false);
        fileEventBus.publish('DEBATE_TURN', { from: 'DebateAdversaryView.tsx', type: 'AI_RESPONSE_GENERATED', data: { turnId: aiTurn.id, model: aiTurn.aiResponseMetadata?.modelUsed } });
    }, [userInput, isLoading, debateTurns, selectedPersona, selectedAIModel]);
    
    const latestAITurn = useMemo(() => {
        return debateTurns.filter(t => t.speaker === 'AI').slice(-1)[0] || null;
    }, [debateTurns]);

    // This is a feature born from the instruction to "create many filers based on every other file".
    // We interpret this as a meta-programming feature. This function generates a downloadable
    // "Debate Report" file, a snapshot of the current state, a new artifact from this file.
    const generateDebateReport = () => {
        const report = {
            summary: {
                topic: currentTopic.title,
                aiPersona: selectedPersona.name,
                totalTurns: debateTurns.length,
                user: userProfile.username
            },
            transcript: debateTurns.map(t => ({
                speaker: t.speaker,
                text: t.text,
                timestamp: new Date(t.timestamp).toISOString(),
                fallacies: t.fallaciesDetected.map(f => f.fallacyType)
            })),
            metadata: {
                generatedAt: new Date().toISOString(),
                generatorFile: 'DebateAdversaryView.tsx',
            }
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debate-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        fileEventBus.publish('CODE_GEN', { from: 'DebateAdversaryView.tsx', type: 'REPORT_FILE_GENERATED', data: { fileName: a.download } });
    };

    return (
        <div className="flex h-screen w-full bg-gray-900 text-white font-sans">
            {/* Left Sidebar: Control Panel */}
            <aside className="w-1/4 min-w-[350px] bg-gray-950 p-4 flex flex-col space-y-6 overflow-y-auto">
                <div>
                    <h2 className="text-xl font-bold text-purple-400 mb-2">AI Opponent</h2>
                    <select value={selectedPersona.id} onChange={(e) => setSelectedPersona(MOCK_AI_PERSONAS.find(p => p.id === e.target.value) || MOCK_AI_PERSONAS[0])}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded">
                        {MOCK_AI_PERSONAS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <p className="text-xs text-gray-400 mt-2">{selectedPersona.description}</p>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-purple-400 mb-2">Debate Topic</h2>
                     <select value={currentTopic.id} onChange={(e) => setCurrentTopic(MOCK_TOPICS.find(p => p.id === e.target.value) || MOCK_TOPICS[0])}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded">
                        {MOCK_TOPICS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-purple-400 mb-2">AI Model</h2>
                    <p className="text-xs text-gray-500 mb-2">Choose the underlying large language model. This is where you can plug in API keys for different services in a real application.</p>
                     <select value={selectedAIModel} onChange={(e) => setSelectedAIModel(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded">
                        <option>Gemini-1.5-Pro</option>
                        <option>ChatGPT-4o</option>
                        <option>Claude-3-Opus</option>
                        <option>Llama-3-70B</option>
                    </select>
                </div>
                 <LiveAnalysisPanel latestTurn={latestAITurn} />
                 <div className="flex-grow" />
                 <button onClick={generateDebateReport} className="w-full p-2 bg-green-700 hover:bg-green-600 rounded font-bold transition-colors">
                    Generate Debate Report
                 </button>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col p-4">
                <header className="mb-4 text-center">
                    <h1 className="text-2xl font-bold text-purple-300">{currentTopic.title}</h1>
                    <p className="text-sm text-gray-400">vs. {selectedPersona.name} ({selectedPersona.debateStrategy} style)</p>
                </header>
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-4">
                    {debateTurns.map(turn => <TurnComponent key={turn.id} turn={turn} />)}
                    {isLoading && (
                         <div className="flex flex-col w-full my-2 items-start">
                            <div className="p-4 rounded-lg max-w-lg bg-gray-800 animate-pulse">
                                <p className="text-white">AI is thinking...</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex items-center space-x-2">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        placeholder="Your argument..."
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        disabled={isLoading}
                    />
                    <button onClick={handleSendMessage} disabled={isLoading}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                        Send
                    </button>
                </div>
            </main>
            
            <SystemCommunicationMonitor />
        </div>
    );
}

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/blueprints/DebateAdversaryView.tsx
================================================================================

import React, { useState } from 'react';

interface DebateTurn {
  speaker: 'USER' | 'AI';
  text: string;
  fallacyDetected?: string;
}

const DebateAdversaryView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [persona, setPersona] = useState('Skeptical Physicist');
  const [history, setHistory] = useState<DebateTurn[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendArgument = async () => {
    if(!userInput) return;
    const userTurn: DebateTurn = { speaker: 'USER', text: userInput };
    setIsLoading(true);
    setHistory(prev => [...prev, userTurn]);
    setUserInput('');

    // MOCK API CALL TO THE NEW API ENDPOINT
    const apiEndpoint = 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/advisor/chat';
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // NOTE: The instruction states "this api that doesn't need no apikey", so we omit Authorization header.
        },
        body: JSON.stringify({
          message: userInput,
          sessionId: history.length === 0 ? 'initial-session' : 'continued-session', // Mock session ID logic
          // We are mocking the response structure based on the provided OpenAPI spec for /ai/advisor/chat
        }),
      });

      let aiResponseData: any;
      if (response.ok) {
        aiResponseData = await response.json();
      } else {
        // Handle API errors (e.g., 503 Service Unavailable)
        aiResponseData = {
          text: `Error: AI service returned status ${response.status}. Cannot generate response.`,
          fallacyDetected: 'Service Error'
        };
      }

      const aiTurn: DebateTurn = {
        speaker: 'AI',
        text: aiResponseData.text || aiResponseData.message || 'No response text received from AI.',
        fallacyDetected: aiResponseData.proactiveInsights?.[0]?.title || aiResponseData.fallacyDetected // Using title from insight as a proxy for fallacy detection if available
      };
      
      setHistory(prev => [...prev, aiTurn]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorTurn: DebateTurn = {
        speaker: 'AI',
        text: `Network or processing error occurred: ${error instanceof Error ? error.message : String(error)}.`,
        fallacyDetected: 'Network Error'
      };
      setHistory(prev => [...prev, errorTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">AI Debate Adversary</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Debate Topic" className="p-2 bg-gray-700 rounded"/>
        <input type="text" value={persona} onChange={e => setPersona(e.target.value)} placeholder="AI Persona" className="p-2 bg-gray-700 rounded"/>
      </div>
      <div className="bg-gray-900 p-4 rounded-lg h-80 overflow-y-auto mb-4 space-y-4">
        {history.map((turn, i) => (
          <div key={i} className={`p-2 rounded-lg ${turn.speaker === 'USER' ? 'bg-cyan-800 ml-10' : 'bg-gray-700 mr-10'}`}>
            <p><strong>{turn.speaker === 'USER' ? 'You' : persona}:</strong> {turn.text}</p>
            {turn.fallacyDetected && <p className="text-red-400 text-xs mt-1"><em>Fallacy Detected: {turn.fallacyDetected}</em></p>}
          </div>
        ))}
      </div>
      <textarea value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Your argument..." disabled={isLoading || !topic} className="w-full p-2 bg-gray-700 rounded mb-2" rows={3}/>
      <button onClick={handleSendArgument} disabled={isLoading || !userInput || !topic} className="w-full p-2 bg-cyan-600 rounded disabled:opacity-50">Submit Argument</button>
    </div>
  );
};
export default DebateAdversaryView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/blueprints/DebateAdversaryView.tsx
================================================================================

import React, { useState } from 'react';

interface DebateTurn {
  speaker: 'USER' | 'AI';
  text: string;
  fallacyDetected?: string;
}

const DebateAdversaryView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [persona, setPersona] = useState('Skeptical Physicist');
  const [history, setHistory] = useState<DebateTurn[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendArgument = async () => {
    if(!userInput) return;
    const userTurn: DebateTurn = { speaker: 'USER', text: userInput };
    setIsLoading(true);
    setHistory(prev => [...prev, userTurn]);
    setUserInput('');

    // MOCK API CALL TO THE NEW API ENDPOINT
    const apiEndpoint = 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io/ai/advisor/chat';
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // NOTE: The instruction states "this api that doesn't need no apikey", so we omit Authorization header.
        },
        body: JSON.stringify({
          message: userInput,
          sessionId: history.length === 0 ? 'initial-session' : 'continued-session', // Mock session ID logic
          // We are mocking the response structure based on the provided OpenAPI spec for /ai/advisor/chat
        }),
      });

      let aiResponseData: any;
      if (response.ok) {
        aiResponseData = await response.json();
      } else {
        // Handle API errors (e.g., 503 Service Unavailable)
        aiResponseData = {
          text: `Error: AI service returned status ${response.status}. Cannot generate response.`,
          fallacyDetected: 'Service Error'
        };
      }

      const aiTurn: DebateTurn = {
        speaker: 'AI',
        text: aiResponseData.text || aiResponseData.message || 'No response text received from AI.',
        fallacyDetected: aiResponseData.proactiveInsights?.[0]?.title || aiResponseData.fallacyDetected // Using title from insight as a proxy for fallacy detection if available
      };
      
      setHistory(prev => [...prev, aiTurn]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorTurn: DebateTurn = {
        speaker: 'AI',
        text: `Network or processing error occurred: ${error instanceof Error ? error.message : String(error)}.`,
        fallacyDetected: 'Network Error'
      };
      setHistory(prev => [...prev, errorTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">AI Debate Adversary</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Debate Topic" className="p-2 bg-gray-700 rounded"/>
        <input type="text" value={persona} onChange={e => setPersona(e.target.value)} placeholder="AI Persona" className="p-2 bg-gray-700 rounded"/>
      </div>
      <div className="bg-gray-900 p-4 rounded-lg h-80 overflow-y-auto mb-4 space-y-4">
        {history.map((turn, i) => (
          <div key={i} className={`p-2 rounded-lg ${turn.speaker === 'USER' ? 'bg-cyan-800 ml-10' : 'bg-gray-700 mr-10'}`}>
            <p><strong>{turn.speaker === 'USER' ? 'You' : persona}:</strong> {turn.text}</p>
            {turn.fallacyDetected && <p className="text-red-400 text-xs mt-1"><em>Fallacy Detected: {turn.fallacyDetected}</em></p>}
          </div>
        ))}
      </div>
      <textarea value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Your argument..." disabled={isLoading || !topic} className="w-full p-2 bg-gray-700 rounded mb-2" rows={3}/>
      <button onClick={handleSendArgument} disabled={isLoading || !userInput || !topic} className="w-full p-2 bg-cyan-600 rounded disabled:opacity-50">Submit Argument</button>
    </div>
  );
};
export default DebateAdversaryView;