// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/ACHDetailsDisplay.tsx
================================================================================


import React from 'react';
import { ACHDetails } from '../types';

/**
 * Props for the ACHDetailsDisplay component.
 */
interface ACHDetailsDisplayProps {
  /** The ACH details object containing routing and account numbers. */
  details: ACHDetails;
  /** Optional flag to hide sensitive numbers by default (shows obfuscated versions). Defaults to true. */
  hideSensitive?: boolean;
}

/**
 * A secure component to display sensitive ACH account and routing numbers.
 *
 * It defaults to displaying partially obscured numbers and provides a mechanism
 * (though external state management or component logic would control the actual reveal)
 * to indicate when the sensitive data is intended to be visible.
 *
 * NOTE: In a real-world application, the display logic (showing real numbers)
 * would be tied to strong authentication/authorization checks and an audit trail.
 */
const ACHDetailsDisplay: React.FC<ACHDetailsDisplayProps> = ({
  details,
  hideSensitive = true,
}) => {
  const [showFullDetails, setShowFullDetails] = React.useState(!hideSensitive);

  if (!details) {
    return <div>No ACH details available.</div>;
  }

  // Helper function to obscure numbers securely
  const obscureNumber = (num: string | undefined): string => {
    if (!num) return 'N/A';
    if (num.length <= 4) return `****`;
    const visibleLength = 4;
    return `****${num.slice(-visibleLength)}`;
  };

  const displayRoutingNumber = showFullDetails
    ? details.routingNumber
    : obscureNumber(details.routingNumber);

  const displayAccountNumber = showFullDetails
    ? details.realAccountNumber
    : obscureNumber(details.realAccountNumber);

  const toggleVisibility = () => {
    setShowFullDetails(prev => !prev);
  };

  return (
    <div className="ach-details-display p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">ACH Payment Details</h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm font-medium text-gray-600">Routing Number:</span>
          <span
            className={`font-mono text-base ${showFullDetails ? 'text-green-700' : 'text-red-500'}`}
            data-testid="routing-number"
          >
            {displayRoutingNumber}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Account Number:</span>
          <span
            className={`font-mono text-base ${showFullDetails ? 'text-green-700' : 'text-red-500'}`}
            data-testid="account-number"
          >
            {displayAccountNumber}
          </span>
        </div>
      </div>

      {hideSensitive && (
        <button
          onClick={toggleVisibility}
          className="mt-4 text-sm px-3 py-1 rounded-md transition-colors duration-150"
          style={{
            backgroundColor: showFullDetails ? '#fcd34d' : '#3b82f6',
            color: showFullDetails ? '#1f2937' : 'white',
          }}
          data-testid="toggle-visibility-button"
        >
          {showFullDetails ? 'Hide Sensitive Details' : 'Show Full Details'}
        </button>
      )}

      {!hideSensitive && (
        <p className="mt-4 text-xs text-gray-500">
          Note: Details are displayed in full as configured by component props.
        </p>
      )}
    </div>
  );
};

export default ACHDetailsDisplay;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/ACHDetailsDisplay.tsx
================================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";

/**
 * TYPES & INTERFACES
 */
export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
  accountType: 'Checking' | 'Savings';
  bankName: string;
  lastVerified?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  metadata: any;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * SECURE VAULT - HOMOMORPHIC SIMULATION
 * This simulates a frontend-only encrypted storage where data is processed 
 * without being fully exposed to the standard browser refs.
 */
class HomomorphicVault {
  private static instance: HomomorphicVault;
  private storage: Map<string, string> = new Map();
  private salt: string = "QUANTUM_SECURE_2024_ALPHA";

  private constructor() {}

  public static getInstance(): HomomorphicVault {
    if (!HomomorphicVault.instance) {
      HomomorphicVault.instance = new HomomorphicVault();
    }
    return HomomorphicVault.instance;
  }

  private encrypt(value: string): string {
    // Simulated homomorphic encryption (XOR + Base64)
    // In a real app, this would use WebCrypto API with subtle crypto
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const applySalt = (code: number) => textToChars(this.salt).reduce((a, b) => a ^ b, code);
    return btoa(value.split("").map(textToChars).map(applySalt).join(","));
  }

  public store(key: string, value: string) {
    const encrypted = this.encrypt(value);
    this.storage.set(key, encrypted);
  }

  public get(key: string): string | undefined {
    // Simulated retrieval - in a real homomorphic system, we'd perform operations 
    // on the encrypted data itself.
    return this.storage.get(key);
  }
}

/**
 * QUANTUM FINANCIAL - ACH DETAILS DISPLAY & AI COMMAND CENTER
 * 
 * This component is a "Golden Ticket" experience for business banking.
 * It features:
 * 1. Secure ACH Display with obfuscation.
 * 2. Integrated AI Assistant (Quantum AI) using Google GenAI.
 * 3. Real-time Audit Logging.
 * 4. Stripe-integrated Payment Simulation.
 * 5. Homomorphic Storage Simulation.
 */
const ACHDetailsDisplay: React.FC<{ details: ACHDetails; hideSensitive?: boolean }> = ({
  details: initialDetails,
  hideSensitive = true,
}) => {
  // --- STATE MANAGEMENT ---
  const [details, setDetails] = useState<ACHDetails>(initialDetails);
  const [showFullDetails, setShowFullDetails] = useState(!hideSensitive);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to Quantum Financial. I am your AI Treasury Assistant. How can I help you manage your ACH configurations today?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isEditing, setIsEditing] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const vault = HomomorphicVault.getInstance();

  // --- INITIALIZATION ---
  useEffect(() => {
    logAudit("VIEW_COMPONENT", "System", { component: "ACHDetailsDisplay" });
    vault.store("ACH_ROUTING", initialDetails.routingNumber);
    vault.store("ACH_ACCOUNT", initialDetails.realAccountNumber);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- AUDIT LOGGING ---
  const logAudit = (action: string, actor: string, metadata: any) => {
    const entry: AuditEntry = {
      id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      metadata
    };
    setAuditTrail(prev => [entry, ...prev].slice(0, 50));
    console.log(`[AUDIT] ${action}`, entry);
  };

  // --- AI INTEGRATION (GOOGLE GENAI) ---
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setUserInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessingAI(true);
    logAudit("AI_QUERY", "User", { query: userMsg });

    try {
      // Using the requested GoogleGenAI package and secrets
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const prompt = `
        You are the Quantum Financial AI Assistant. 
        Context: The user is viewing their ACH Details for "The Demo Bank".
        Current Details: ${JSON.stringify(details)}
        User Request: "${userMsg}"
        
        Instructions:
        1. If the user wants to change details (routing, account, bank), respond with a JSON block starting with { "action": "UPDATE_ACH", ... }.
        2. If the user wants to initiate a payment, respond with { "action": "INITIATE_PAYMENT" }.
        3. Otherwise, provide a professional, elite financial response.
        4. Never mention Citibank.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      if (responseText.includes("UPDATE_ACH")) {
        try {
          const jsonMatch = responseText.match(/\{.*\}/s);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            const newDetails = { ...details, ...data.payload };
            setDetails(newDetails);
            setMessages(prev => [...prev, { role: 'assistant', content: "I have updated your ACH configurations as requested. The changes are now reflected in the secure vault." }]);
            logAudit("AI_ACTION_UPDATE", "QuantumAI", { newDetails });
          }
        } catch (e) {
          setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        }
      } else if (responseText.includes("INITIATE_PAYMENT")) {
        setShowPaymentModal(true);
        setMessages(prev => [...prev, { role: 'assistant', content: "I've opened the Stripe payment gateway for you. You can now 'test drive' the transaction engine." }]);
        logAudit("AI_ACTION_PAYMENT", "QuantumAI", {});
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I'm experiencing a connection latency with the Quantum core. Please try again." }]);
    } finally {
      setIsProcessingAI(false);
    }
  };

  // --- STRIPE SIMULATION ---
  const handleStripePayment = () => {
    setStripeStatus('processing');
    logAudit("STRIPE_INITIATED", "User", { amount: 5000, currency: 'USD' });
    
    setTimeout(() => {
      setStripeStatus('success');
      logAudit("STRIPE_SUCCESS", "StripeGateway", { transactionId: "ch_3N" + Math.random().toString(36).substr(2, 10) });
      setTimeout(() => {
        setShowPaymentModal(false);
        setStripeStatus('idle');
      }, 2000);
    }, 2500);
  };

  // --- UI HELPERS ---
  const obscureNumber = (num: string): string => {
    if (num.length <= 4) return `****`;
    return `****${num.slice(-4)}`;
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 font-sans p-8 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              QUANTUM FINANCIAL
            </h1>
            <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">Global Business Treasury • Demo Environment</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-slate-800 rounded-full border border-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono">SYSTEMS NOMINAL</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 transition-all rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20"
            >
              {isChatOpen ? "CLOSE ASSISTANT" : "OPEN AI ASSISTANT"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main ACH Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-1">ACH Payment Details</h2>
                  <p className="text-slate-400 text-sm">Securely manage your corporate disbursement channels.</p>
                </div>
                <button 
                  onClick={() => {
                    setShowFullDetails(!showFullDetails);
                    logAudit(showFullDetails ? "HIDE_SENSITIVE" : "REVEAL_SENSITIVE", "User", {});
                  }}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4"
                >
                  {showFullDetails ? "OBFUSCATE DATA" : "REVEAL SECURE DATA"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Bank Institution</label>
                  <div className="text-xl font-semibold text-slate-200">{details.bankName}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Account Type</label>
                  <div className="text-xl font-semibold text-slate-200">{details.accountType}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Routing Number (ABA)</label>
                  <div className="text-2xl font-mono text-emerald-400">
                    {showFullDetails ? details.routingNumber : obscureNumber(details.routingNumber)}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Account Number (DDA)</label>
                  <div className="text-2xl font-mono text-emerald-400">
                    {showFullDetails ? details.realAccountNumber : obscureNumber(details.realAccountNumber)}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-700 flex flex-wrap gap-4">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-sm transition-all"
                >
                  Edit Configuration
                </button>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20"
                >
                  Test Drive Payment (Stripe)
                </button>
                <button 
                  className="px-6 py-3 bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl font-bold text-sm transition-all"
                  onClick={() => logAudit("EXPORT_DETAILS", "User", { format: "PDF" })}
                >
                  Export Audit PDF
                </button>
              </div>
            </div>

            {/* Analytics / Bells & Whistles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl">
                <div className="text-slate-500 text-[10px] font-bold uppercase mb-2">Fraud Risk Score</div>
                <div className="text-3xl font-bold text-emerald-400">0.02</div>
                <div className="w-full bg-slate-700 h-1 mt-4 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[2%]"></div>
                </div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl">
                <div className="text-slate-500 text-[10px] font-bold uppercase mb-2">Monthly Volume</div>
                <div className="text-3xl font-bold text-blue-400">$1.2M</div>
                <div className="text-[10px] text-slate-400 mt-2">↑ 12% from last month</div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl">
                <div className="text-slate-500 text-[10px] font-bold uppercase mb-2">Uptime SLA</div>
                <div className="text-3xl font-bold text-slate-200">99.99%</div>
                <div className="text-[10px] text-emerald-500 mt-2">Quantum Core Active</div>
              </div>
            </div>
          </div>

          {/* Sidebar: Audit Log */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Audit Storage</h3>
              <span className="text-[10px] bg-blue-900/40 text-blue-400 px-2 py-1 rounded">ENCRYPTED</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[10px]">
              {auditTrail.map((log) => (
                <div key={log.id} className="border-l-2 border-slate-700 pl-3 py-1">
                  <div className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  <div className="text-blue-400 font-bold">{log.action}</div>
                  <div className="text-slate-300">Actor: {log.actor}</div>
                </div>
              ))}
              {auditTrail.length === 0 && <div className="text-slate-600 italic">Waiting for telemetry...</div>}
            </div>
          </div>
        </div>
      </div>

      {/* AI CHATBOT OVERLAY */}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-slate-800 border border-blue-500/30 shadow-2xl rounded-2xl flex flex-col z-50 animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-4 border-b border-slate-700 bg-blue-600 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold text-sm">Quantum AI Assistant</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isProcessingAI && (
              <div className="flex justify-start">
                <div className="bg-slate-700 p-3 rounded-xl text-sm animate-pulse">Quantum is thinking...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-slate-700">
            <div className="relative">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask AI to update details or pay..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-2 top-1.5 text-blue-500 hover:text-blue-400"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRIPE PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">S</div>
                <span className="font-bold text-lg">Stripe Checkout</span>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Pay Quantum Financial</div>
                <div className="text-4xl font-bold">$5,000.00</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Card Information</label>
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 font-mono text-sm">
                    4242 4242 4242 4242
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Expiry</label>
                    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 font-mono text-sm">12 / 26</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">CVC</label>
                    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 font-mono text-sm">***</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleStripePayment}
                disabled={stripeStatus !== 'idle'}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  stripeStatus === 'success' ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {stripeStatus === 'idle' && "Pay Now"}
                {stripeStatus === 'processing' && (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                )}
                {stripeStatus === 'success' && "✓ Payment Successful"}
              </button>
              
              <p className="text-center text-[10px] text-slate-400 mt-4">
                Securely processed by Stripe. No real funds will be moved in this demo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Update ACH Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={details.bankName}
                  onChange={(e) => setDetails({...details, bankName: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Routing Number</label>
                  <input 
                    type="text" 
                    value={details.routingNumber}
                    onChange={(e) => setDetails({...details, routingNumber: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Account Number</label>
                  <input 
                    type="text" 
                    value={details.realAccountNumber}
                    onChange={(e) => setDetails({...details, realAccountNumber: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  logAudit("MANUAL_UPDATE", "User", { details });
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="mt-20 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em]">
        Quantum Financial Services Group © 2024 • Proprietary Demo Environment • No Human Intervention Required
      </footer>
    </div>
  );
};

export default ACHDetailsDisplay;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/ACHDetailsDisplay (1).tsx
================================================================================


import React from 'react';
import { ACHDetails } from '../types';

/**
 * Props for the ACHDetailsDisplay component.
 */
interface ACHDetailsDisplayProps {
  /** The ACH details object containing routing and account numbers. */
  details: ACHDetails;
  /** Optional flag to hide sensitive numbers by default (shows obfuscated versions). Defaults to true. */
  hideSensitive?: boolean;
}

/**
 * A secure component to display sensitive ACH account and routing numbers.
 *
 * It defaults to displaying partially obscured numbers and provides a mechanism
 * (though external state management or component logic would control the actual reveal)
 * to indicate when the sensitive data is intended to be visible.
 *
 * NOTE: In a real-world application, the display logic (showing real numbers)
 * would be tied to strong authentication/authorization checks and an audit trail.
 */
const ACHDetailsDisplay: React.FC<ACHDetailsDisplayProps> = ({
  details,
  hideSensitive = true,
}) => {
  const [showFullDetails, setShowFullDetails] = React.useState(!hideSensitive);

  if (!details) {
    return <div>No ACH details available.</div>;
  }

  // Helper function to obscure numbers securely
  const obscureNumber = (num: string | undefined): string => {
    if (!num) return 'N/A';
    if (num.length <= 4) return `****`;
    const visibleLength = 4;
    return `****${num.slice(-visibleLength)}`;
  };

  const displayRoutingNumber = showFullDetails
    ? details.routingNumber
    : obscureNumber(details.routingNumber);

  const displayAccountNumber = showFullDetails
    ? details.realAccountNumber
    : obscureNumber(details.realAccountNumber);

  const toggleVisibility = () => {
    setShowFullDetails(prev => !prev);
  };

  return (
    <div className="ach-details-display p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">ACH Payment Details</h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm font-medium text-gray-600">Routing Number:</span>
          <span
            className={`font-mono text-base ${showFullDetails ? 'text-green-700' : 'text-red-500'}`}
            data-testid="routing-number"
          >
            {displayRoutingNumber}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Account Number:</span>
          <span
            className={`font-mono text-base ${showFullDetails ? 'text-green-700' : 'text-red-500'}`}
            data-testid="account-number"
          >
            {displayAccountNumber}
          </span>
        </div>
      </div>

      {hideSensitive && (
        <button
          onClick={toggleVisibility}
          className="mt-4 text-sm px-3 py-1 rounded-md transition-colors duration-150"
          style={{
            backgroundColor: showFullDetails ? '#fcd34d' : '#3b82f6',
            color: showFullDetails ? '#1f2937' : 'white',
          }}
          data-testid="toggle-visibility-button"
        >
          {showFullDetails ? 'Hide Sensitive Details' : 'Show Full Details'}
        </button>
      )}

      {!hideSensitive && (
        <p className="mt-4 text-xs text-gray-500">
          Note: Details are displayed in full as configured by component props.
        </p>
      )}
    </div>
  );
};

export default ACHDetailsDisplay;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/ACHDetailsDisplay.tsx
================================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

/**
 * TYPES & INTERFACES
 */
export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
  accountType: 'Checking' | 'Savings';
  bankName: string;
  lastVerified?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  metadata: any;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * SECURE VAULT - HOMOMORPHIC SIMULATION
 * NOTE: This is a simplified, obfuscation-level "homomorphic simulation"
 * and does not provide true homomorphic encryption capabilities or strong security.
 * Data stored is simply XOR-ed with a salt and base64 encoded.
 * There is no decrypt method provided as per the simulation's current design.
 */
class HomomorphicVault {
  private static instance: HomomorphicVault;
  private storage: Map<string, string> = new Map();
  // Using a longer, more complex salt for slight improvement in obfuscation; still not secure encryption.
  private salt: string = "QUANTUM_SECURE_VAULT_KEY_2024_ALPHA_VERSION_1.0_SECRET_SALT_FOR_SIMULATION";

  private constructor() {}

  public static getInstance(): HomomorphicVault {
    if (!HomomorphicVault.instance) {
      HomomorphicVault.instance = new HomomorphicVault();
    }
    return HomomorphicVault.instance;
  }

  // Obfuscates the value using XOR with the salt and then Base64 encodes the result.
  private encrypt(value: string): string {
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const saltCodes = textToChars(this.salt);
    return btoa(
      value
        .split("")
        .map((char) => char.charCodeAt(0))
        .map((code, i) => code ^ saltCodes[i % saltCodes.length])
        .map((c) => c.toString(16).padStart(2, '0')) // Ensure two hex digits for consistency
        .join(",")
    );
  }

  public store(key: string, value: string) {
    this.storage.set(key, this.encrypt(value));
  }

  public get(key: string): string | undefined {
    // Returns the obfuscated string, not the original value.
    // A decrypt method would be needed to retrieve the original value,
    // but is omitted for this "simulation" as per its current design.
    return this.storage.get(key);
  }
}

const ACHDetailsDisplay: React.FC<{ details: ACHDetails; hideSensitive?: boolean }> = ({
  details: initialDetails,
  hideSensitive = true,
}) => {
  const [details, setDetails] = useState<ACHDetails>(initialDetails);
  const [editDetails, setEditDetails] = useState<ACHDetails>(initialDetails); // For editing state
  const [showFullDetails, setShowFullDetails] = useState(!hideSensitive);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to Quantum Financial. I am your AI Treasury Assistant. How can I help you manage your ACH configurations today?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isEditing, setIsEditing] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const vault = HomomorphicVault.getInstance();

  const logAudit = (action: string, actor: string, metadata: any) => {
    const entry: AuditEntry = {
      id: `LOG-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      metadata
    };
    setAuditTrail(prev => [entry, ...prev].slice(0, 50));
  };

  useEffect(() => {
    logAudit("VIEW_COMPONENT", "System", { component: "ACHDetailsDisplay" });
    // Storing initial details in the "vault". These are just obfuscated.
    // The vault is not used for displaying details, the `details` state is.
    vault.store("ACH_ROUTING", initialDetails.routingNumber);
    vault.store("ACH_ACCOUNT", initialDetails.realAccountNumber);
    // Also initialize editDetails from initialDetails
    setEditDetails(initialDetails);
  }, [initialDetails]); // Depend on initialDetails object reference, assuming it might change.

  // Update editDetails if initialDetails or details state changes externally (e.g. via AI)
  useEffect(() => {
    if (!isEditing) { // Only update if not currently editing to avoid losing user's unsaved changes
      setEditDetails(details);
    }
  }, [details, isEditing]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setUserInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessingAI(true);
    logAudit("AI_QUERY", "User", { query: userMsg });

    try {
      // Ensure API key is available
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Google Gemini API key is not configured.");
      }
      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a financial AI. Current ACH Details (DO NOT directly output sensitive data unless explicitly asked and confirmed by user, then mask output): ${JSON.stringify(details)}. User Request: "${userMsg}". 
      If the user explicitly asks to update ACH details, respond with a JSON object: { "action": "UPDATE_ACH", "payload": { "routingNumber": "new_val", "realAccountNumber": "new_val", "accountType": "new_val", "bankName": "new_val" } }. 
      Ensure payload only contains fields to be updated. For example, if only routing number needs updating, payload should be { "routingNumber": "new_val" }.
      If the user wants to initiate a payment or transaction, respond with a JSON object: { "action": "INITIATE_PAYMENT" }. 
      Otherwise, provide a helpful and concise text response.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Attempt to parse AI response for structured actions
      try {
        const jsonMatch = responseText.match(/\{.*\}/s); // Matches the first JSON object
        if (jsonMatch) {
          const aiResponseData = JSON.parse(jsonMatch[0]);

          if (aiResponseData.action === "UPDATE_ACH" && aiResponseData.payload) {
            const updatedFields: Partial<ACHDetails> = {};
            // Validate and apply updates
            if (typeof aiResponseData.payload.routingNumber === 'string') updatedFields.routingNumber = aiResponseData.payload.routingNumber;
            if (typeof aiResponseData.payload.realAccountNumber === 'string') updatedFields.realAccountNumber = aiResponseData.payload.realAccountNumber;
            if (aiResponseData.payload.accountType && (aiResponseData.payload.accountType === 'Checking' || aiResponseData.payload.accountType === 'Savings')) {
              updatedFields.accountType = aiResponseData.payload.accountType;
            }
            if (typeof aiResponseData.payload.bankName === 'string') updatedFields.bankName = aiResponseData.payload.bankName;
            
            setDetails(prev => ({ ...prev, ...updatedFields }));
            logAudit("AI_UPDATE_ACH", "AI Assistant", updatedFields);
            setMessages(prev => [...prev, { role: 'assistant', content: "Configuration updated as per your request." }]);
            return; // Exit after handling structured response
          } else if (aiResponseData.action === "INITIATE_PAYMENT") {
            setShowPaymentModal(true);
            logAudit("AI_INITIATE_PAYMENT", "AI Assistant", {});
            setMessages(prev => [...prev, { role: 'assistant', content: "Payment gateway opened for your request." }]);
            return; // Exit after handling structured response
          }
        }
      } catch (jsonError) {
        // If JSON parsing fails, or it's not a recognized action, treat it as a normal text response.
        // console.error("Failed to parse AI JSON response, or action not recognized:", jsonError);
      }
      
      // If not a structured action, or parsing failed, display as a regular message
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);

    } catch (error: any) { // Catch more specific error types if needed
      console.error("AI Assistant error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || "Connection error. Please try again."}` }]);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleStripePayment = () => {
    setStripeStatus('processing');
    logAudit("INITIATE_STRIPE_PAYMENT", "User", { amount: 5000 });
    setTimeout(() => {
      setStripeStatus('success');
      logAudit("STRIPE_PAYMENT_SUCCESS", "System", { amount: 5000 });
      setTimeout(() => {
        setShowPaymentModal(false);
        setStripeStatus('idle');
      }, 2000);
    }, 2500);
  };

  const obscureNumber = (num: string): string => {
    if (!num || num.length < 4) return "****";
    return `****${num.slice(-4)}`;
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    // Basic validation before saving
    if (!editDetails.routingNumber || !editDetails.realAccountNumber || !editDetails.bankName) {
      alert("Please fill in all required fields.");
      return;
    }
    setDetails(editDetails); // Apply changes to the main state
    setIsEditing(false); // Exit editing mode
    logAudit("MANUAL_UPDATE_ACH", "User", editDetails);
  };

  const handleCancelEdit = () => {
    setEditDetails(details); // Revert editDetails to current details
    setIsEditing(false); // Exit editing mode
    logAudit("CANCEL_EDIT_ACH", "User", {});
  };


  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-700 pb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">QUANTUM FINANCIAL</h1>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-bold">AI ASSISTANT</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
            {!isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Routing Number</label>
                    <div className="text-2xl font-mono text-emerald-400">{showFullDetails ? details.routingNumber : obscureNumber(details.routingNumber)}</div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Account Number</label>
                    <div className="text-2xl font-mono text-emerald-400">{showFullDetails ? details.realAccountNumber : obscureNumber(details.realAccountNumber)}</div>
                  </div>
                  <div className="col-span-1 md:col-span-2 lg:col-span-1"> {/* Adjusted column span for better layout */}
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Account Type</label>
                    <div className="text-lg font-bold text-blue-400">{details.accountType}</div>
                  </div>
                  <div className="col-span-1 md:col-span-2 lg:col-span-1"> {/* Adjusted column span for better layout */}
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Bank Name</label>
                    <div className="text-lg font-bold text-blue-400">{details.bankName}</div>
                  </div>
                  {details.lastVerified && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                      <label className="text-[10px] uppercase text-slate-500 font-bold">Last Verified</label>
                      <div className="text-sm text-slate-300">{new Date(details.lastVerified).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">Edit Configuration</button>
                  <button onClick={() => setShowFullDetails(!showFullDetails)} className="px-6 py-3 bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">
                    {showFullDetails ? "Hide Sensitive" : "Show Full Details"}
                  </button>
                </div>
              </>
            ) : (
              // Editing mode
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">Edit ACH Configuration</h2>
                <div>
                  <label htmlFor="routingNumber" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Routing Number</label>
                  <input
                    type="text"
                    id="routingNumber"
                    name="routingNumber"
                    value={editDetails.routingNumber}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="realAccountNumber" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Account Number</label>
                  <input
                    type="text"
                    id="realAccountNumber"
                    name="realAccountNumber"
                    value={editDetails.realAccountNumber}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="accountType" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Account Type</label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={editDetails.accountType}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-bold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bankName" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={editDetails.bankName}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-bold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={handleSaveEdit} className="px-6 py-3 bg-green-600 rounded-xl font-bold text-sm hover:bg-green-500 transition-colors">Save Changes</button>
                  <button onClick={handleCancelEdit} className="px-6 py-3 bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl h-[400px] overflow-y-auto p-4 font-mono text-[10px]">
            <h2 className="text-sm font-bold text-slate-400 mb-3">AUDIT TRAIL</h2>
            {auditTrail.map((log) => (
              <div key={log.id} className="border-l-2 border-slate-700 pl-3 py-1 text-slate-300">
                <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()} - </span>
                <span className="font-semibold text-emerald-300">{log.action}</span>
                {log.actor !== "System" && <span className="text-slate-500"> by {log.actor}</span>}
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <span className="text-slate-600"> ({JSON.stringify(log.metadata)})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-slate-800 border border-blue-500/30 rounded-2xl flex flex-col z-50">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <span className="font-bold text-lg">Quantum AI Assistant</span>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"> {/* Added custom-scrollbar class */}
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-xl text-sm max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white ml-auto rounded-br-none' : 'bg-slate-700 text-slate-200 mr-auto rounded-bl-none'}`}
              >
                {m.content}
              </div>
            ))}
            {isProcessingAI && (
              <div className="p-3 rounded-xl text-sm bg-slate-700 text-slate-200 mr-auto rounded-bl-none">
                <div className="animate-pulse">Thinking...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-slate-700 flex">
            <input
              className="flex-1 bg-slate-900 p-3 rounded-l-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              disabled={isProcessingAI}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-3 bg-blue-600 rounded-r-lg text-white font-bold text-sm hover:bg-blue-700 transition-colors ml-[-1px]"
              disabled={isProcessingAI || !userInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[100]">
          <div className="bg-white text-slate-900 p-8 rounded-2xl w-full max-w-sm relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors text-xl leading-none">✕</button>
            <h2 className="font-bold text-2xl mb-6 text-center">Stripe Checkout</h2>
            <div className="mb-6 text-center text-slate-700">
              <p>Total amount: <span className="font-extrabold text-3xl text-emerald-600">$5,000.00</span></p>
              <p className="text-sm mt-2">Simulated payment gateway.</p>
            </div>
            <button onClick={handleStripePayment} disabled={stripeStatus !== 'idle'} className={`w-full py-4 rounded-xl font-bold text-lg transition-colors
              ${stripeStatus === 'idle' ? 'bg-blue-600 text-white hover:bg-blue-700' : 
                stripeStatus === 'processing' ? 'bg-blue-400 text-white cursor-not-allowed' : 
                'bg-green-600 text-white cursor-not-allowed'}`}>
              {stripeStatus === 'idle' ? "Confirm Payment" : 
               stripeStatus === 'processing' ? "Processing Payment..." : 
               "Payment Successful!"}
            </button>
            {stripeStatus === 'processing' && (
              <div className="mt-4 text-center text-blue-600 font-medium">
                Please wait, do not close this window.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ACHDetailsDisplay;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/ACHDetailsDisplay (1).tsx
================================================================================

import React from 'react';
import { ACHDetails } from '../types';

/**
 * Props for the ACHDetailsDisplay component.
 */
interface ACHDetailsDisplayProps {
  /** The ACH details object containing routing and account numbers. */
  details: ACHDetails;
  /** Optional flag to hide sensitive numbers by default (shows obfuscated versions). Defaults to true. */
  hideSensitive?: boolean;
}

/**
 * A secure component to display sensitive ACH account and routing numbers.
 *
 * It defaults to displaying partially obscured numbers and provides a mechanism
 * (though external state management or component logic would control the actual reveal)
 * to indicate when the sensitive data is intended to be visible.
 *
 * NOTE: In a real-world application, the display logic (showing real numbers)
 * would be tied to strong authentication/authorization checks and an audit trail.
 */
const ACHDetailsDisplay: React.FC<ACHDetailsDisplayProps> = ({
  details,
  hideSensitive = true,
}) => {
  const [showFullDetails, setShowFullDetails] = React.useState(!hideSensitive);

  if (!details) {
    return <div className="p-4 text-gray-500">No ACH details available.</div>;
  }

  // Helper function to obscure numbers securely
  const obscureNumber = (num: string | undefined): string => {
    if (!num) return 'N/A';
    // If length is short, hide all; otherwise mask all but last 4
    if (num.length <= 4) return '****';
    return `****${num.slice(-4)}`;
  };

  const displayRoutingNumber = showFullDetails
    ? details.routingNumber
    : obscureNumber(details.routingNumber);

  const displayAccountNumber = showFullDetails
    ? details.realAccountNumber
    : obscureNumber(details.realAccountNumber);

  const toggleVisibility = () => {
    setShowFullDetails((prev) => !prev);
  };

  return (
    <div className="ach-details-display p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">ACH Payment Details</h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm font-medium text-gray-600">Routing Number:</span>
          <span
            className={`font-mono text-base ${showFullDetails ? 'text-green-700' : 'text-gray-800'}`}
            data-testid="routing-number"
          >
            {displayRoutingNumber}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Account Number:</span>
          <span
            className={`font-mono text-base ${showFullDetails ? 'text-green-700' : 'text-gray-800'}`}
            data-testid="account-number"
          >
            {displayAccountNumber}
          </span>
        </div>
      </div>

      {hideSensitive && (
        <button
          onClick={toggleVisibility}
          className="mt-4 text-sm px-3 py-1 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1"
          style={{
            backgroundColor: showFullDetails ? '#fcd34d' : '#3b82f6',
            color: showFullDetails ? '#1f2937' : 'white',
          }}
          data-testid="toggle-visibility-button"
        >
          {showFullDetails ? 'Hide Sensitive Details' : 'Show Full Details'}
        </button>
      )}

      {!hideSensitive && (
        <p className="mt-4 text-xs text-gray-500">
          Note: Details are displayed in full as configured by component props.
        </p>
      )}
    </div>
  );
};

export default ACHDetailsDisplay;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/ACHDetailsDisplay_1.tsx
================================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

/**
 * TYPES & INTERFACES
 */
export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
  accountType: 'Checking' | 'Savings';
  bankName: string;
  lastVerified?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  metadata: any;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * SECURE VAULT - HOMOMORPHIC SIMULATION
 * NOTE: This is a simplified, obfuscation-level "homomorphic simulation"
 * and does not provide true homomorphic encryption capabilities or strong security.
 * Data stored is simply XOR-ed with a salt and base64 encoded.
 * There is no decrypt method provided as per the simulation's current design.
 */
class HomomorphicVault {
  private static instance: HomomorphicVault;
  private storage: Map<string, string> = new Map();
  // Using a longer, more complex salt for slight improvement in obfuscation; still not secure encryption.
  private salt: string = "QUANTUM_SECURE_VAULT_KEY_2024_ALPHA_VERSION_1.0_SECRET_SALT_FOR_SIMULATION";

  private constructor() {}

  public static getInstance(): HomomorphicVault {
    if (!HomomorphicVault.instance) {
      HomomorphicVault.instance = new HomomorphicVault();
    }
    return HomomorphicVault.instance;
  }

  // Obfuscates the value using XOR with the salt and then Base64 encodes the result.
  private encrypt(value: string): string {
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const saltCodes = textToChars(this.salt);
    return btoa(
      value
        .split("")
        .map((char) => char.charCodeAt(0))
        .map((code, i) => code ^ saltCodes[i % saltCodes.length])
        .map((c) => c.toString(16).padStart(2, '0')) // Ensure two hex digits for consistency
        .join(",")
    );
  }

  public store(key: string, value: string) {
    this.storage.set(key, this.encrypt(value));
  }

  public get(key: string): string | undefined {
    // Returns the obfuscated string, not the original value.
    // A decrypt method would be needed to retrieve the original value,
    // but is omitted for this "simulation" as per its current design.
    return this.storage.get(key);
  }
}

const ACHDetailsDisplay: React.FC<{ details: ACHDetails; hideSensitive?: boolean }> = ({
  details: initialDetails,
  hideSensitive = true,
}) => {
  const [details, setDetails] = useState<ACHDetails>(initialDetails);
  const [editDetails, setEditDetails] = useState<ACHDetails>(initialDetails); // For editing state
  const [showFullDetails, setShowFullDetails] = useState(!hideSensitive);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to Quantum Financial. I am your AI Treasury Assistant. How can I help you manage your ACH configurations today?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isEditing, setIsEditing] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const vault = HomomorphicVault.getInstance();

  const logAudit = (action: string, actor: string, metadata: any) => {
    const entry: AuditEntry = {
      id: `LOG-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      metadata
    };
    setAuditTrail(prev => [entry, ...prev].slice(0, 50));
  };

  useEffect(() => {
    logAudit("VIEW_COMPONENT", "System", { component: "ACHDetailsDisplay" });
    // Storing initial details in the "vault". These are just obfuscated.
    // The vault is not used for displaying details, the `details` state is.
    vault.store("ACH_ROUTING", initialDetails.routingNumber);
    vault.store("ACH_ACCOUNT", initialDetails.realAccountNumber);
    // Also initialize editDetails from initialDetails
    setEditDetails(initialDetails);
  }, [initialDetails]); // Depend on initialDetails object reference, assuming it might change.

  // Update editDetails if initialDetails or details state changes externally (e.g. via AI)
  useEffect(() => {
    if (!isEditing) { // Only update if not currently editing to avoid losing user's unsaved changes
      setEditDetails(details);
    }
  }, [details, isEditing]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setUserInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessingAI(true);
    logAudit("AI_QUERY", "User", { query: userMsg });

    try {
      // Ensure API key is available
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Google Gemini API key is not configured.");
      }
      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a financial AI. Current ACH Details (DO NOT directly output sensitive data unless explicitly asked and confirmed by user, then mask output): ${JSON.stringify(details)}. User Request: "${userMsg}". 
      If the user explicitly asks to update ACH details, respond with a JSON object: { "action": "UPDATE_ACH", "payload": { "routingNumber": "new_val", "realAccountNumber": "new_val", "accountType": "new_val", "bankName": "new_val" } }. 
      Ensure payload only contains fields to be updated. For example, if only routing number needs updating, payload should be { "routingNumber": "new_val" }.
      If the user wants to initiate a payment or transaction, respond with a JSON object: { "action": "INITIATE_PAYMENT" }. 
      Otherwise, provide a helpful and concise text response.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Attempt to parse AI response for structured actions
      try {
        const jsonMatch = responseText.match(/\{.*\}/s); // Matches the first JSON object
        if (jsonMatch) {
          const aiResponseData = JSON.parse(jsonMatch[0]);

          if (aiResponseData.action === "UPDATE_ACH" && aiResponseData.payload) {
            const updatedFields: Partial<ACHDetails> = {};
            // Validate and apply updates
            if (typeof aiResponseData.payload.routingNumber === 'string') updatedFields.routingNumber = aiResponseData.payload.routingNumber;
            if (typeof aiResponseData.payload.realAccountNumber === 'string') updatedFields.realAccountNumber = aiResponseData.payload.realAccountNumber;
            if (aiResponseData.payload.accountType && (aiResponseData.payload.accountType === 'Checking' || aiResponseData.payload.accountType === 'Savings')) {
              updatedFields.accountType = aiResponseData.payload.accountType;
            }
            if (typeof aiResponseData.payload.bankName === 'string') updatedFields.bankName = aiResponseData.payload.bankName;
            
            setDetails(prev => ({ ...prev, ...updatedFields }));
            logAudit("AI_UPDATE_ACH", "AI Assistant", updatedFields);
            setMessages(prev => [...prev, { role: 'assistant', content: "Configuration updated as per your request." }]);
            return; // Exit after handling structured response
          } else if (aiResponseData.action === "INITIATE_PAYMENT") {
            setShowPaymentModal(true);
            logAudit("AI_INITIATE_PAYMENT", "AI Assistant", {});
            setMessages(prev => [...prev, { role: 'assistant', content: "Payment gateway opened for your request." }]);
            return; // Exit after handling structured response
          }
        }
      } catch (jsonError) {
        // If JSON parsing fails, or it's not a recognized action, treat it as a normal text response.
        // console.error("Failed to parse AI JSON response, or action not recognized:", jsonError);
      }
      
      // If not a structured action, or parsing failed, display as a regular message
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);

    } catch (error: any) { // Catch more specific error types if needed
      console.error("AI Assistant error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || "Connection error. Please try again."}` }]);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleStripePayment = () => {
    setStripeStatus('processing');
    logAudit("INITIATE_STRIPE_PAYMENT", "User", { amount: 5000 });
    setTimeout(() => {
      setStripeStatus('success');
      logAudit("STRIPE_PAYMENT_SUCCESS", "System", { amount: 5000 });
      setTimeout(() => {
        setShowPaymentModal(false);
        setStripeStatus('idle');
      }, 2000);
    }, 2500);
  };

  const obscureNumber = (num: string): string => {
    if (!num || num.length < 4) return "****";
    return `****${num.slice(-4)}`;
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    // Basic validation before saving
    if (!editDetails.routingNumber || !editDetails.realAccountNumber || !editDetails.bankName) {
      alert("Please fill in all required fields.");
      return;
    }
    setDetails(editDetails); // Apply changes to the main state
    setIsEditing(false); // Exit editing mode
    logAudit("MANUAL_UPDATE_ACH", "User", editDetails);
  };

  const handleCancelEdit = () => {
    setEditDetails(details); // Revert editDetails to current details
    setIsEditing(false); // Exit editing mode
    logAudit("CANCEL_EDIT_ACH", "User", {});
  };


  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-700 pb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">QUANTUM FINANCIAL</h1>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-bold">AI ASSISTANT</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
            {!isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Routing Number</label>
                    <div className="text-2xl font-mono text-emerald-400">{showFullDetails ? details.routingNumber : obscureNumber(details.routingNumber)}</div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Account Number</label>
                    <div className="text-2xl font-mono text-emerald-400">{showFullDetails ? details.realAccountNumber : obscureNumber(details.realAccountNumber)}</div>
                  </div>
                  <div className="col-span-1 md:col-span-2 lg:col-span-1"> {/* Adjusted column span for better layout */}
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Account Type</label>
                    <div className="text-lg font-bold text-blue-400">{details.accountType}</div>
                  </div>
                  <div className="col-span-1 md:col-span-2 lg:col-span-1"> {/* Adjusted column span for better layout */}
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Bank Name</label>
                    <div className="text-lg font-bold text-blue-400">{details.bankName}</div>
                  </div>
                  {details.lastVerified && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                      <label className="text-[10px] uppercase text-slate-500 font-bold">Last Verified</label>
                      <div className="text-sm text-slate-300">{new Date(details.lastVerified).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">Edit Configuration</button>
                  <button onClick={() => setShowFullDetails(!showFullDetails)} className="px-6 py-3 bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">
                    {showFullDetails ? "Hide Sensitive" : "Show Full Details"}
                  </button>
                </div>
              </>
            ) : (
              // Editing mode
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">Edit ACH Configuration</h2>
                <div>
                  <label htmlFor="routingNumber" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Routing Number</label>
                  <input
                    type="text"
                    id="routingNumber"
                    name="routingNumber"
                    value={editDetails.routingNumber}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="realAccountNumber" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Account Number</label>
                  <input
                    type="text"
                    id="realAccountNumber"
                    name="realAccountNumber"
                    value={editDetails.realAccountNumber}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="accountType" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Account Type</label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={editDetails.accountType}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-bold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bankName" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={editDetails.bankName}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-bold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={handleSaveEdit} className="px-6 py-3 bg-green-600 rounded-xl font-bold text-sm hover:bg-green-500 transition-colors">Save Changes</button>
                  <button onClick={handleCancelEdit} className="px-6 py-3 bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl h-[400px] overflow-y-auto p-4 font-mono text-[10px]">
            <h2 className="text-sm font-bold text-slate-400 mb-3">AUDIT TRAIL</h2>
            {auditTrail.map((log) => (
              <div key={log.id} className="border-l-2 border-slate-700 pl-3 py-1 text-slate-300">
                <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()} - </span>
                <span className="font-semibold text-emerald-300">{log.action}</span>
                {log.actor !== "System" && <span className="text-slate-500"> by {log.actor}</span>}
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <span className="text-slate-600"> ({JSON.stringify(log.metadata)})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-slate-800 border border-blue-500/30 rounded-2xl flex flex-col z-50">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <span className="font-bold text-lg">Quantum AI Assistant</span>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"> {/* Added custom-scrollbar class */}
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-xl text-sm max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white ml-auto rounded-br-none' : 'bg-slate-700 text-slate-200 mr-auto rounded-bl-none'}`}
              >
                {m.content}
              </div>
            ))}
            {isProcessingAI && (
              <div className="p-3 rounded-xl text-sm bg-slate-700 text-slate-200 mr-auto rounded-bl-none">
                <div className="animate-pulse">Thinking...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-slate-700 flex">
            <input
              className="flex-1 bg-slate-900 p-3 rounded-l-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              disabled={isProcessingAI}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-3 bg-blue-600 rounded-r-lg text-white font-bold text-sm hover:bg-blue-700 transition-colors ml-[-1px]"
              disabled={isProcessingAI || !userInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[100]">
          <div className="bg-white text-slate-900 p-8 rounded-2xl w-full max-w-sm relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors text-xl leading-none">✕</button>
            <h2 className="font-bold text-2xl mb-6 text-center">Stripe Checkout</h2>
            <div className="mb-6 text-center text-slate-700">
              <p>Total amount: <span className="font-extrabold text-3xl text-emerald-600">$5,000.00</span></p>
              <p className="text-sm mt-2">Simulated payment gateway.</p>
            </div>
            <button onClick={handleStripePayment} disabled={stripeStatus !== 'idle'} className={`w-full py-4 rounded-xl font-bold text-lg transition-colors
              ${stripeStatus === 'idle' ? 'bg-blue-600 text-white hover:bg-blue-700' : 
                stripeStatus === 'processing' ? 'bg-blue-400 text-white cursor-not-allowed' : 
                'bg-green-600 text-white cursor-not-allowed'}`}>
              {stripeStatus === 'idle' ? "Confirm Payment" : 
               stripeStatus === 'processing' ? "Processing Payment..." : 
               "Payment Successful!"}
            </button>
            {stripeStatus === 'processing' && (
              <div className="mt-4 text-center text-blue-600 font-medium">
                Please wait, do not close this window.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ACHDetailsDisplay;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/ACHDetailsDisplay.tsx
================================================================================

import React from 'react';
import { ACHDetails } from '../types';

/**
 * Props for the ACHDetailsDisplay component.
 */
interface ACHDetailsDisplayProps {
  /** The ACH details object containing routing and account numbers. */
  details: ACHDetails;
  /** Optional flag to hide sensitive numbers by default (shows obfuscated versions). Defaults to true. */
  hideSensitive?: boolean;
}

/**
 * A secure component to display sensitive ACH account and routing numbers.
 *
 * It defaults to displaying partially obscured numbers and provides a mechanism
 * (though external state management or component logic would control the actual reveal)
 * to indicate when the sensitive data is intended to be visible.
 *
 * NOTE: In a real-world application, the display logic (showing real numbers)
 * would be tied to strong authentication/authorization checks and an audit trail.
 */
const ACHDetailsDisplay: React.FC<ACHDetailsDisplayProps> = ({
  details,
  hideSensitive = true,
}) => {
  const [showFullDetails, setShowFullDetails] = React.useState(!hideSensitive);

  if (!details) {
    return <div>No ACH details available.</div>;
  }

  // Helper function to obscure numbers securely
  const obscureNumber = (num: string | undefined): string => {
    if (!num) return 'N/A';
    if (num.length <= 4) return `****`;
    const visibleLength = 4;
    return `****${num.slice(-visibleLength)}`;
  };

  const displayRoutingNumber = showFullDetails
    ? details.routingNumber
    : obscureNumber(details.routingNumber);

  const displayAccountNumber = showFullDetails
    ? details.realAccountNumber
    : obscureNumber(details.realAccountNumber);

  const toggleVisibility = () => {
    setShowFullDetails(prev => !prev);
  };

  return (
    <div className="ach-details-display p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">ACH Payment Details</h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm font-medium text-gray-600">Routing Number:</span>
          <span
            className={`font-mono text-base ${showFullDetails ? 'text-green-700' : 'text-red-500'}`}
            data-testid="routing-number"
          >
            {displayRoutingNumber}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Account Number:</span>
          <span
            className={`font-mono text-base ${showFullDetails ? 'text-green-700' : 'text-red-500'}`}
            data-testid="account-number"
          >
            {displayAccountNumber}
          </span>
        </div>
      </div>

      {hideSensitive && (
        <button
          onClick={toggleVisibility}
          className="mt-4 text-sm px-3 py-1 rounded-md transition-colors duration-150"
          style={{
            backgroundColor: showFullDetails ? '#fcd34d' : '#3b82f6',
            color: showFullDetails ? '#1f2937' : 'white',
          }}
          data-testid="toggle-visibility-button"
        >
          {showFullDetails ? 'Hide Sensitive Details' : 'Show Full Details'}
        </button>
      )}

      {!hideSensitive && (
        <p className="mt-4 text-xs text-gray-500">
          Note: Details are displayed in full as configured by component props.
        </p>
      )}
    </div>
  );
};

export default ACHDetailsDisplay;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/ACHDetailsDisplay.tsx
================================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

/**
 * TYPES & INTERFACES
 */
export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
  accountType: 'Checking' | 'Savings';
  bankName: string;
  lastVerified?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  metadata: any;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * SECURE VAULT - HOMOMORPHIC SIMULATION
 * NOTE: This is a simplified, obfuscation-level "homomorphic simulation"
 * and does not provide true homomorphic encryption capabilities or strong security.
 * Data stored is simply XOR-ed with a salt and base64 encoded.
 * There is no decrypt method provided as per the simulation's current design.
 */
class HomomorphicVault {
  private static instance: HomomorphicVault;
  private storage: Map<string, string> = new Map();
  // Using a longer, more complex salt for slight improvement in obfuscation; still not secure encryption.
  private salt: string = "QUANTUM_SECURE_VAULT_KEY_2024_ALPHA_VERSION_1.0_SECRET_SALT_FOR_SIMULATION";

  private constructor() {}

  public static getInstance(): HomomorphicVault {
    if (!HomomorphicVault.instance) {
      HomomorphicVault.instance = new HomomorphicVault();
    }
    return HomomorphicVault.instance;
  }

  // Obfuscates the value using XOR with the salt and then Base64 encodes the result.
  private encrypt(value: string): string {
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const saltCodes = textToChars(this.salt);
    return btoa(
      value
        .split("")
        .map((char) => char.charCodeAt(0))
        .map((code, i) => code ^ saltCodes[i % saltCodes.length])
        .map((c) => c.toString(16).padStart(2, '0')) // Ensure two hex digits for consistency
        .join(",")
    );
  }

  public store(key: string, value: string) {
    this.storage.set(key, this.encrypt(value));
  }

  public get(key: string): string | undefined {
    // Returns the obfuscated string, not the original value.
    // A decrypt method would be needed to retrieve the original value,
    // but is omitted for this "simulation" as per its current design.
    return this.storage.get(key);
  }
}

const ACHDetailsDisplay: React.FC<{ details: ACHDetails; hideSensitive?: boolean }> = ({
  details: initialDetails,
  hideSensitive = true,
}) => {
  const [details, setDetails] = useState<ACHDetails>(initialDetails);
  const [editDetails, setEditDetails] = useState<ACHDetails>(initialDetails); // For editing state
  const [showFullDetails, setShowFullDetails] = useState(!hideSensitive);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to Quantum Financial. I am your AI Treasury Assistant. How can I help you manage your ACH configurations today?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isEditing, setIsEditing] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const vault = HomomorphicVault.getInstance();

  const logAudit = (action: string, actor: string, metadata: any) => {
    const entry: AuditEntry = {
      id: `LOG-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      metadata
    };
    setAuditTrail(prev => [entry, ...prev].slice(0, 50));
  };

  useEffect(() => {
    logAudit("VIEW_COMPONENT", "System", { component: "ACHDetailsDisplay" });
    // Storing initial details in the "vault". These are just obfuscated.
    // The vault is not used for displaying details, the `details` state is.
    vault.store("ACH_ROUTING", initialDetails.routingNumber);
    vault.store("ACH_ACCOUNT", initialDetails.realAccountNumber);
    // Also initialize editDetails from initialDetails
    setEditDetails(initialDetails);
  }, [initialDetails]); // Depend on initialDetails object reference, assuming it might change.

  // Update editDetails if initialDetails or details state changes externally (e.g. via AI)
  useEffect(() => {
    if (!isEditing) { // Only update if not currently editing to avoid losing user's unsaved changes
      setEditDetails(details);
    }
  }, [details, isEditing]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setUserInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessingAI(true);
    logAudit("AI_QUERY", "User", { query: userMsg });

    try {
      // Ensure API key is available
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Google Gemini API key is not configured.");
      }
      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a financial AI. Current ACH Details (DO NOT directly output sensitive data unless explicitly asked and confirmed by user, then mask output): ${JSON.stringify(details)}. User Request: "${userMsg}". 
      If the user explicitly asks to update ACH details, respond with a JSON object: { "action": "UPDATE_ACH", "payload": { "routingNumber": "new_val", "realAccountNumber": "new_val", "accountType": "new_val", "bankName": "new_val" } }. 
      Ensure payload only contains fields to be updated. For example, if only routing number needs updating, payload should be { "routingNumber": "new_val" }.
      If the user wants to initiate a payment or transaction, respond with a JSON object: { "action": "INITIATE_PAYMENT" }. 
      Otherwise, provide a helpful and concise text response.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Attempt to parse AI response for structured actions
      try {
        const jsonMatch = responseText.match(/\{.*\}/s); // Matches the first JSON object
        if (jsonMatch) {
          const aiResponseData = JSON.parse(jsonMatch[0]);

          if (aiResponseData.action === "UPDATE_ACH" && aiResponseData.payload) {
            const updatedFields: Partial<ACHDetails> = {};
            // Validate and apply updates
            if (typeof aiResponseData.payload.routingNumber === 'string') updatedFields.routingNumber = aiResponseData.payload.routingNumber;
            if (typeof aiResponseData.payload.realAccountNumber === 'string') updatedFields.realAccountNumber = aiResponseData.payload.realAccountNumber;
            if (aiResponseData.payload.accountType && (aiResponseData.payload.accountType === 'Checking' || aiResponseData.payload.accountType === 'Savings')) {
              updatedFields.accountType = aiResponseData.payload.accountType;
            }
            if (typeof aiResponseData.payload.bankName === 'string') updatedFields.bankName = aiResponseData.payload.bankName;
            
            setDetails(prev => ({ ...prev, ...updatedFields }));
            logAudit("AI_UPDATE_ACH", "AI Assistant", updatedFields);
            setMessages(prev => [...prev, { role: 'assistant', content: "Configuration updated as per your request." }]);
            return; // Exit after handling structured response
          } else if (aiResponseData.action === "INITIATE_PAYMENT") {
            setShowPaymentModal(true);
            logAudit("AI_INITIATE_PAYMENT", "AI Assistant", {});
            setMessages(prev => [...prev, { role: 'assistant', content: "Payment gateway opened for your request." }]);
            return; // Exit after handling structured response
          }
        }
      } catch (jsonError) {
        // If JSON parsing fails, or it's not a recognized action, treat it as a normal text response.
        // console.error("Failed to parse AI JSON response, or action not recognized:", jsonError);
      }
      
      // If not a structured action, or parsing failed, display as a regular message
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);

    } catch (error: any) { // Catch more specific error types if needed
      console.error("AI Assistant error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || "Connection error. Please try again."}` }]);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleStripePayment = () => {
    setStripeStatus('processing');
    logAudit("INITIATE_STRIPE_PAYMENT", "User", { amount: 5000 });
    setTimeout(() => {
      setStripeStatus('success');
      logAudit("STRIPE_PAYMENT_SUCCESS", "System", { amount: 5000 });
      setTimeout(() => {
        setShowPaymentModal(false);
        setStripeStatus('idle');
      }, 2000);
    }, 2500);
  };

  const obscureNumber = (num: string): string => {
    if (!num || num.length < 4) return "****";
    return `****${num.slice(-4)}`;
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    // Basic validation before saving
    if (!editDetails.routingNumber || !editDetails.realAccountNumber || !editDetails.bankName) {
      alert("Please fill in all required fields.");
      return;
    }
    setDetails(editDetails); // Apply changes to the main state
    setIsEditing(false); // Exit editing mode
    logAudit("MANUAL_UPDATE_ACH", "User", editDetails);
  };

  const handleCancelEdit = () => {
    setEditDetails(details); // Revert editDetails to current details
    setIsEditing(false); // Exit editing mode
    logAudit("CANCEL_EDIT_ACH", "User", {});
  };


  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-700 pb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">QUANTUM FINANCIAL</h1>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-bold">AI ASSISTANT</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
            {!isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Routing Number</label>
                    <div className="text-2xl font-mono text-emerald-400">{showFullDetails ? details.routingNumber : obscureNumber(details.routingNumber)}</div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Account Number</label>
                    <div className="text-2xl font-mono text-emerald-400">{showFullDetails ? details.realAccountNumber : obscureNumber(details.realAccountNumber)}</div>
                  </div>
                  <div className="col-span-1 md:col-span-2 lg:col-span-1"> {/* Adjusted column span for better layout */}
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Account Type</label>
                    <div className="text-lg font-bold text-blue-400">{details.accountType}</div>
                  </div>
                  <div className="col-span-1 md:col-span-2 lg:col-span-1"> {/* Adjusted column span for better layout */}
                    <label className="text-[10px] uppercase text-slate-500 font-bold">Bank Name</label>
                    <div className="text-lg font-bold text-blue-400">{details.bankName}</div>
                  </div>
                  {details.lastVerified && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                      <label className="text-[10px] uppercase text-slate-500 font-bold">Last Verified</label>
                      <div className="text-sm text-slate-300">{new Date(details.lastVerified).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">Edit Configuration</button>
                  <button onClick={() => setShowFullDetails(!showFullDetails)} className="px-6 py-3 bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">
                    {showFullDetails ? "Hide Sensitive" : "Show Full Details"}
                  </button>
                </div>
              </>
            ) : (
              // Editing mode
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">Edit ACH Configuration</h2>
                <div>
                  <label htmlFor="routingNumber" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Routing Number</label>
                  <input
                    type="text"
                    id="routingNumber"
                    name="routingNumber"
                    value={editDetails.routingNumber}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="realAccountNumber" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Account Number</label>
                  <input
                    type="text"
                    id="realAccountNumber"
                    name="realAccountNumber"
                    value={editDetails.realAccountNumber}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="accountType" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Account Type</label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={editDetails.accountType}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-bold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bankName" className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={editDetails.bankName}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-lg font-bold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={handleSaveEdit} className="px-6 py-3 bg-green-600 rounded-xl font-bold text-sm hover:bg-green-500 transition-colors">Save Changes</button>
                  <button onClick={handleCancelEdit} className="px-6 py-3 bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl h-[400px] overflow-y-auto p-4 font-mono text-[10px]">
            <h2 className="text-sm font-bold text-slate-400 mb-3">AUDIT TRAIL</h2>
            {auditTrail.map((log) => (
              <div key={log.id} className="border-l-2 border-slate-700 pl-3 py-1 text-slate-300">
                <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()} - </span>
                <span className="font-semibold text-emerald-300">{log.action}</span>
                {log.actor !== "System" && <span className="text-slate-500"> by {log.actor}</span>}
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <span className="text-slate-600"> ({JSON.stringify(log.metadata)})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-slate-800 border border-blue-500/30 rounded-2xl flex flex-col z-50">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <span className="font-bold text-lg">Quantum AI Assistant</span>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"> {/* Added custom-scrollbar class */}
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-xl text-sm max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white ml-auto rounded-br-none' : 'bg-slate-700 text-slate-200 mr-auto rounded-bl-none'}`}
              >
                {m.content}
              </div>
            ))}
            {isProcessingAI && (
              <div className="p-3 rounded-xl text-sm bg-slate-700 text-slate-200 mr-auto rounded-bl-none">
                <div className="animate-pulse">Thinking...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-slate-700 flex">
            <input
              className="flex-1 bg-slate-900 p-3 rounded-l-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              disabled={isProcessingAI}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-3 bg-blue-600 rounded-r-lg text-white font-bold text-sm hover:bg-blue-700 transition-colors ml-[-1px]"
              disabled={isProcessingAI || !userInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[100]">
          <div className="bg-white text-slate-900 p-8 rounded-2xl w-full max-w-sm relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors text-xl leading-none">✕</button>
            <h2 className="font-bold text-2xl mb-6 text-center">Stripe Checkout</h2>
            <div className="mb-6 text-center text-slate-700">
              <p>Total amount: <span className="font-extrabold text-3xl text-emerald-600">$5,000.00</span></p>
              <p className="text-sm mt-2">Simulated payment gateway.</p>
            </div>
            <button onClick={handleStripePayment} disabled={stripeStatus !== 'idle'} className={`w-full py-4 rounded-xl font-bold text-lg transition-colors
              ${stripeStatus === 'idle' ? 'bg-blue-600 text-white hover:bg-blue-700' : 
                stripeStatus === 'processing' ? 'bg-blue-400 text-white cursor-not-allowed' : 
                'bg-green-600 text-white cursor-not-allowed'}`}>
              {stripeStatus === 'idle' ? "Confirm Payment" : 
               stripeStatus === 'processing' ? "Processing Payment..." : 
               "Payment Successful!"}
            </button>
            {stripeStatus === 'processing' && (
              <div className="mt-4 text-center text-blue-600 font-medium">
                Please wait, do not close this window.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ACHDetailsDisplay;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/ACHDetailsDisplay (1).tsx
================================================================================

import React from 'react';
import { ACHDetails } from '../types';

/**
 * Props for the ACHDetailsDisplay component.
 */
interface ACHDetailsDisplayProps {
  /** The ACH details object containing routing and account numbers. */
  details: ACHDetails;
  /** Optional flag to hide sensitive numbers by default (shows obfuscated versions). Defaults to true. */
  hideSensitive?: boolean;
}

/**
 * A secure component to display sensitive ACH account and routing numbers.
 *
 * It defaults to displaying partially obscured numbers and provides a mechanism
 * (though external state management or component logic would control the actual reveal)
 * to indicate when the sensitive data is intended to be visible.
 *
 * NOTE: In a real-world application, the display logic (showing real numbers)
 * would be tied to strong authentication/authorization checks and an audit trail.
 */
const ACHDetailsDisplay: React.FC<ACHDetailsDisplayProps> = ({
  details,
  hideSensitive = true,
}) => {
  const [showFullDetails, setShowFullDetails] = React.useState(!hideSensitive);

  if (!details) {
    return <div className="p-4 text-gray-500">No ACH details available.</div>;
  }

  // Helper function to obscure numbers securely
  const obscureNumber = (num: string | undefined): string => {
    if (!num) return 'N/A';
    // If length is short, hide all; otherwise mask all but last 4
    if (num.length <= 4) return '****';
    return `****${num.slice(-4)}`;
  };

  const displayRoutingNumber = showFullDetails
    ? details.routingNumber
    : obscureNumber(details.routingNumber);

  const displayAccountNumber = showFullDetails
    ? details.realAccountNumber
    : obscureNumber(details.realAccountNumber);

  const toggleVisibility = () => {
    setShowFullDetails((prev) => !prev);
  };

  return (
    <div className="ach-details-display p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">ACH Payment Details</h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm font-medium text-gray-600">Routing Number:</span>
          <span
            className={`font-mono text-base ${showFullDetails ? 'text-green-700' : 'text-gray-800'}`}
            data-testid="routing-number"
          >
            {displayRoutingNumber}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Account Number:</span>
          <span
            className={`font-mono text-base ${showFullDetails ? 'text-green-700' : 'text-gray-800'}`}
            data-testid="account-number"
          >
            {displayAccountNumber}
          </span>
        </div>
      </div>

      {hideSensitive && (
        <button
          onClick={toggleVisibility}
          className="mt-4 text-sm px-3 py-1 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1"
          style={{
            backgroundColor: showFullDetails ? '#fcd34d' : '#3b82f6',
            color: showFullDetails ? '#1f2937' : 'white',
          }}
          data-testid="toggle-visibility-button"
        >
          {showFullDetails ? 'Hide Sensitive Details' : 'Show Full Details'}
        </button>
      )}

      {!hideSensitive && (
        <p className="mt-4 text-xs text-gray-500">
          Note: Details are displayed in full as configured by component props.
        </p>
      )}
    </div>
  );
};

export default ACHDetailsDisplay;