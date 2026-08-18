// REPOSITORY SOURCE: diplomat-bit/aibankingmtls | PATH: diplomat-bit-aibankingmtls-6a06a68/src/App.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db 
} from './firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  limit
} from 'firebase/firestore';
import { 
  Globe, 
  LayoutDashboard, 
  Wallet, 
  LineChart, 
  Shield, 
  LogOut,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Zap,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { ConnectionsView } from './components/ConnectionsView';

interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: string;
}

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
  currency: string;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'debit' | 'credit';
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'web3' | 'advisor' | 'connections'>('dashboard');

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const formattedBalance = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBalance);


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          let userProfile: UserProfile;
          if (!userSnap.exists()) {
            userProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, userProfile);
          } else {
            userProfile = userSnap.data() as UserProfile;
          }
          setProfile(userProfile);

          // Listen for accounts
          const qAccounts = query(collection(db, 'accounts'), where('userId', '==', firebaseUser.uid));
          const unsubscribeAccounts = onSnapshot(qAccounts, (snapshot) => {
            setAccounts(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Account)));
          });

          // Listen for transactions
          const qTx = query(
            collection(db, 'transactions'), 
            where('userId', '==', firebaseUser.uid), 
            orderBy('date', 'desc'), 
            limit(10)
          );
          const unsubscribeTx = onSnapshot(qTx, (snapshot) => {
            setTransactions(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Transaction)));
          });

          return () => {
            unsubscribeAccounts();
            unsubscribeTx();
          };
        }
      } catch (err: any) {
        console.error("Initialization error:", err);
        setError(err.message || "Failed to initialize Aura");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSignIn = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Sign in error details:", err);
      if (err.code === 'auth/popup-blocked') {
        setError("Sign-in popup was blocked. Please allow popups for this site.");
      } else if (err.message.includes('invalid client secret')) {
        setError("Configuration Error: The Google OAuth Client Secret is invalid. Please check your Firebase Console and Google Cloud Credentials.");
      } else {
        setError(err.message || "An error occurred during sign-in.");
      }
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.service === 'citi') {
        console.log("Citibank authentication successful:", event.data.tokens);
        // In a real app, we would save these tokens to Firestore
        // For the demo, we'll just show success
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSignOut = () => auth.signOut();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center font-sans">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full mb-4"
        />
        <p className="text-zinc-500 font-medium tracking-widest text-xs uppercase">Initializing Aura</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center z-10 max-w-sm"
        >
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl shadow-white/10">
            <Zap className="w-10 h-10 text-black fill-black" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Aura AI Bank</h1>
          <p className="text-zinc-400 mb-10 leading-relaxed text-sm">
            Experience the future of finance with autonomous intelligence and multi-chain liquidity.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleSignIn}
            className="w-full bg-white text-black h-14 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-xl shadow-white/5"
          >
            <Globe className="w-5 h-5" />
            Connect with Google
          </button>

          <p className="mt-8 text-zinc-600 text-[10px] uppercase tracking-widest font-semibold">
            Institutional Grade Security &bull; End-to-End Encryption
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
            <Zap className="w-4 h-4 text-black fill-black" />
          </div>
          <span className="font-bold text-lg tracking-tight">Aura</span>
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'web3', label: 'Crypto Hub', icon: Wallet },
            { id: 'advisor', label: 'AI Advisor', icon: LineChart },
            { id: 'connections', label: 'Connections', icon: LinkIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                currentView === item.id 
                  ? "bg-white/10 text-white" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 mb-6 px-2">
            <img 
              src={profile?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aura'} 
              className="w-8 h-8 rounded-full border border-white/10"
              alt="Avatar"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{profile?.displayName}</p>
              <p className="text-[10px] text-zinc-500 truncate">{profile?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight uppercase">
              {currentView === 'connections' ? 'Connections' : currentView === 'web3' ? 'Web3' : currentView === 'advisor' ? 'Insights' : 'Dashboard'}
            </h2>
            <p className="text-zinc-500 text-sm">
              {currentView === 'connections' ? 'Institutional Partner APIs' : 'Welcome back to your financial command center.'}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500 text-sm font-bold tracking-tight">Verified Secure</span>
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            {currentView === 'dashboard' && (
              <div className="grid grid-cols-12 gap-8">
                {/* Card: Net Worth */}
                <section className="col-span-12 lg:col-span-8 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 p-8 rounded-[32px] relative overflow-hidden group">
                      <div className="z-10 relative">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Total Balance</p>
                        <h3 className="text-4xl font-bold mb-6">{formattedBalance}</h3>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>+12.5% this month</span>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard className="w-24 h-24 rotate-12" />
                      </div>
                    </div>
                    
                    <div className="bg-zinc-900 border border-white/5 p-8 rounded-[32px] flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Globe className="w-24 h-24 rotate-12" />
                      </div>
                      <div className="z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Partner Banking</p>
                            <h4 className="text-lg font-bold">Connect Citibank</h4>
                          </div>
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">Sandbox</span>
                        </div>
                        <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
                          Link your Citi institutional accounts to enable real-time liquidity monitoring and automated global payments.
                        </p>
                        <button 
                          onClick={async () => {
                            try {
                              setError(null);
                              const res = await fetch('/api/auth/citi/url');
                              if (!res.ok) throw new Error("Failed to get Citi auth URL");
                              const { url } = await res.json();
                              window.open(url, 'citi_auth', 'width=600,height=700');
                            } catch (e: any) {
                              setError(e.message || "Failed to start Citibank connection");
                            }
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
                        >
                          <Zap className="w-4 h-4 fill-white" />
                          Link Account
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="bg-zinc-900/50 border border-white/5 rounded-[32px] p-8">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="text-xl font-bold">Recent Activity</h4>
                      <button className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1 font-bold">
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {transactions.length > 0 ? (
                        transactions.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                                <Zap className={clsx("w-5 h-5", tx.type === 'credit' ? "text-emerald-500" : "text-white")} />
                              </div>
                              <div>
                                <p className="text-sm font-bold">{tx.description}</p>
                                <p className="text-xs text-zinc-500">{tx.category} &bull; {new Date(tx.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className={clsx("font-mono font-bold", tx.type === 'credit' ? "text-emerald-400" : "text-white")}>
                              {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center">
                          <p className="text-zinc-600 text-sm">Your financial history starts here.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Card: Side Info */}
                <section className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="bg-white text-black p-8 rounded-[32px] shadow-2xl shadow-white/10">
                    <Zap className="w-8 h-8 mb-6 fill-black" />
                    <h4 className="text-2xl font-bold mb-4 tracking-tight leading-8">Aura Insight Engine</h4>
                    <p className="text-black/60 text-sm mb-8 leading-relaxed font-medium">
                      "Based on your current spending, you could save $450/mo by consolidating your SaaS subscriptions."
                    </p>
                    <button className="w-full bg-black text-white h-12 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                      Apply Insight
                    </button>
                  </div>

                  <div className="bg-zinc-900 border border-white/5 p-8 rounded-[32px]">
                    <h4 className="text-lg font-bold mb-6">Security Score</h4>
                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                      <div className="absolute top-0 left-0 h-full w-[94%] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight text-zinc-500">
                      <span>94/100 (Optimal)</span>
                      <span className="text-emerald-500">Enhanced Privacy Active</span>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {currentView === 'connections' && <ConnectionsView />}
            
            {currentView === 'web3' && (
              <div className="p-20 text-center border border-dashed border-white/10 rounded-[40px]">
                <Wallet className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Crypto Hub Coming Soon</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">We're building the first high-yield multi-chain liquidity bridge for premium accounts.</p>
              </div>
            )}

            {currentView === 'advisor' && (
              <div className="p-20 text-center border border-dashed border-white/10 rounded-[40px]">
                <LineChart className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">AI Insights Engine</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">Predictive analysis of your cash flow and personalized investment strategies.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibankingnew | ORIGINAL PATH: diplomat-bit-aibankingnew-a0c4868/src/App.tsx
================================================================================

import React from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  ShieldCheck, 
  Cpu, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Bell,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Database,
  Send,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import Markdown from 'react-markdown';
import { cn } from './lib/utils';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, MOCK_APIS } from './constants';
import { analyzeFinances, forgeApi } from './services/geminiService';
import accountApiSpec from './data/account_api_spec.json';
import balanceCheckApiSpec from './data/balance_check_api_spec.json';
import transactionDetailsApiSpec from './data/transaction_details_api_spec.json';
import investmentTransactionsApiSpec from './data/investment_transactions_api_spec.json';
import outageMaintenanceApiSpec from './data/outage_maintenance_api_spec.json';
import clearDataApiSpec from './data/clear_data_api_spec.json';
import customerDemographicsApiSpec from './data/customer_demographics_api_spec.json';
import repeatingTerminateApiSpec from './data/repeating_payments_terminate_api_spec.json';
import sepaTransferApiSpec from './data/sepa_transfer_api_spec.json';
import payeeEligibilityApiSpec from './data/payee_eligibility_api_spec.json';
import repeatingInquiryApiSpec from './data/repeating_payments_inquiry_api_spec.json';
import adhocTransfersApiSpec from './data/adhoc_transfers_api_spec.json';
import tokenManagementApiSpec from './data/token_management_api_spec.json';
import clientRegistrationApiSpec from './data/client_registration_api_spec.json';
import { Transaction, Account, ApiDefinition } from './types';

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform duration-200", active ? "" : "group-hover:scale-110")} />
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, className, title, subtitle, action }: { children: React.ReactNode, className?: string, title?: string, subtitle?: string, action?: React.ReactNode }) => (
  <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", className)}>
    {(title || subtitle || action) && (
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          {title && <h3 className="font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [chatInput, setChatInput] = React.useState('');
  const [apis, setApis] = React.useState<ApiDefinition[]>(MOCK_APIS);
  const [forgingApiId, setForgingApiId] = React.useState<string | null>(null);
  const [forgeResult, setForgeResult] = React.useState<string | null>(null);
  const [forgeResults, setForgeResults] = React.useState<Record<string, string>>({});
  const [activeForgeModel, setActiveForgeModel] = React.useState<string>("Gemini 3.1 Pro");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Simulate processing a folder or multiple files
    const newApis: ApiDefinition[] = Array.from(files).map((file, index) => ({
      id: `uploaded-${Date.now()}-${index}`,
      name: file.name.replace(/\.(json|yaml|yml)$/, ''),
      version: '1.0.0',
      status: 'active',
      endpoints: Math.floor(Math.random() * 20) + 5,
      lastSync: new Date().toLocaleString().slice(0, 16)
    }));

    setApis(prev => [...newApis, ...prev]);
    setActiveTab('forge');
  };

  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setIsAiLoading(true);
    const response = await analyzeFinances(MOCK_TRANSACTIONS, chatInput);
    setAiResponse(response);
    setIsAiLoading(false);
    setChatInput('');
  };

  const handleForge = async (api: ApiDefinition) => {
    setForgingApiId(api.id);
    setActiveTab('forge-result');
    setForgeResults({});
    setForgeResult(null);
    
    let specToForge: any = api;
    if (api.id === 'api-accounts') specToForge = accountApiSpec;
    if (api.id === 'api-balance-check') specToForge = balanceCheckApiSpec;
    if (api.id === 'api-transactions') specToForge = transactionDetailsApiSpec;
    if (api.id === 'api-investments') specToForge = investmentTransactionsApiSpec;
    if (api.id === 'api-outage') specToForge = outageMaintenanceApiSpec;
    if (api.id === 'api-clear-data') specToForge = clearDataApiSpec;
    if (api.id === 'api-demographics') specToForge = customerDemographicsApiSpec;
    if (api.id === 'api-repeating-terminate') specToForge = repeatingTerminateApiSpec;
    if (api.id === 'api-sepa') specToForge = sepaTransferApiSpec;
    if (api.id === 'api-payee-eligibility') specToForge = payeeEligibilityApiSpec;
    if (api.id === 'api-repeating-inquiry') specToForge = repeatingInquiryApiSpec;
    if (api.id === 'api-adhoc-transfers') specToForge = adhocTransfersApiSpec;
    if (api.id === 'api-token-mgmt') specToForge = tokenManagementApiSpec;
    if (api.id === 'api-client-reg') specToForge = clientRegistrationApiSpec;
    
    const models = [
      { name: "Gemini 3.1 Flash Lite", id: "gemini-3.1-flash-lite-preview" },
      { name: "Gemini 3.1 Pro", id: "gemini-3.1-pro-preview" },
      { name: "Gemini 3.1 Flash", id: "gemini-3.1-flash-preview" },
      { name: "Gemini 2.5 Pro", id: "gemini-2.5-pro-preview" },
      { name: "Gemini 2.5 Flash", id: "gemini-2.5-flash-preview" }
    ];

    const promises = models.map(async (model) => {
      try {
        const result = await forgeApi(specToForge, model.id);
        setForgeResults(prev => ({ ...prev, [model.name]: result }));
      } catch (err) {
        setForgeResults(prev => ({ ...prev, [model.name]: "Error forging with this model." }));
      }
    });

    await Promise.all(promises);
    setForgingApiId(null);
    
    // Mark as forged
    setApis(prev => prev.map(a => a.id === api.id ? { ...a, isForged: true } : a));
  };

  const handleForgeAll = async () => {
    setActiveTab('forge-result');
    setForgingApiId('all');
    setForgeResults({});
    setForgeResult("");

    const models = [
      { name: "Gemini 3.1 Flash Lite", id: "gemini-3.1-flash-lite-preview" },
      { name: "Gemini 3.1 Pro", id: "gemini-3.1-pro-preview" },
      { name: "Gemini 3.1 Flash", id: "gemini-3.1-flash-preview" },
      { name: "Gemini 2.5 Pro", id: "gemini-2.5-pro-preview" },
      { name: "Gemini 2.5 Flash", id: "gemini-2.5-flash-preview" }
    ];

    // Shuffle the APIs list for processing
    const shuffledApis = [...apis].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < shuffledApis.length; i += 5) {
      const chunk = shuffledApis.slice(i, i + 5);
      
      // Process batch of 5 APIs simultaneously, each using a different model
      const chunkResults = await Promise.all(chunk.map(async (api, index) => {
        const model = models[index % models.length];
        try {
          const result = await forgeApi(api, model.id);
          return `### ${api.name}\n**Engine:** ${model.name}\n\n${result}`;
        } catch (err) {
          return `### ${api.name}\n**Engine:** ${model.name}\n\n*Error: Failed to forge this API spec.*`;
        }
      }));

      // Append results to the UI incrementally
      setForgeResult(prev => (prev ? prev + '\n\n---\n\n' : '') + chunkResults.join('\n\n---\n\n'));

      // If there's another batch, wait 30 seconds to respect rate limits
      if (i + 5 < shuffledApis.length) {
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }

    setForgeResult(prev => `## Global Batch Forge Report\n\nSuccessfully processed ${apis.length} APIs in batches of 5 with 30s cooldowns.\n\n` + prev);
    setApis(prev => prev.map(a => ({ ...a, isForged: true })));
    setForgingApiId(null);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
          <Plus className="w-4 h-4 text-blue-600" />
          Send Money
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
          <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          Request
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
          <CreditCard className="w-4 h-4 text-purple-600" />
          Card Settings
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          Security Audit
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_ACCOUNTS.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
          >
            <Card className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-16 h-16 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-slate-500">{account.name}</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                ${account.balance.toLocaleString()}
              </h2>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                  {account.accountNumber}
                </span>
                <span className={cn(
                  "text-[10px] uppercase font-bold px-2 py-1 rounded-full",
                  account.type === 'checking' ? "bg-blue-50 text-blue-600" :
                  account.type === 'savings' ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
                )}>
                  {account.type}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2" title="Cash Flow Analysis" subtitle="Monthly income vs expenses">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Jan', income: 4000, expense: 2400 },
                { name: 'Feb', income: 3000, expense: 1398 },
                { name: 'Mar', income: 2000, expense: 9800 },
                { name: 'Apr', income: 2780, expense: 3908 },
                { name: 'May', income: 1890, expense: 4800 },
                { name: 'Jun', income: 2390, expense: 3800 },
              ]}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#2563eb" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Advisor Quick View */}
        <Card title="Nexus AI Advisor" className="bg-slate-900 text-white border-none shadow-xl shadow-blue-900/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">Financial Health</p>
                <p className="text-xs text-slate-400">Analysis complete</p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <p className="text-sm text-slate-300 leading-relaxed">
                "Your spending in **Dining** is up 15% this month. Consider setting a cap of $400 to stay on track for your savings goal."
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('ai')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Full Analysis
            </button>
          </div>
        </Card>

        {/* System Status / Outage Maintenance */}
        <Card title="System Status" className="bg-emerald-50 border-emerald-100">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Database className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">All Systems Operational</p>
                <p className="text-xs text-emerald-600">Last check: 2 mins ago</p>
              </div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg border border-emerald-200">
              <p className="text-[10px] font-bold text-emerald-800 uppercase mb-1">Upcoming Maintenance</p>
              <p className="text-xs text-emerald-700">
                Scheduled outage for **SEPA Core** on March 20th, 02:00 - 04:00 UTC.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Activity" action={<button className="text-blue-600 text-sm font-medium hover:underline">View All</button>}>
        <div className="space-y-1">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  tx.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                )}>
                  {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{tx.description}</p>
                  <p className="text-xs text-slate-500">{tx.category} • {tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold",
                  tx.type === 'income' ? "text-emerald-600" : "text-slate-900"
                )}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderApiForge = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">API Forge</h1>
          <p className="text-slate-500">Manage and deploy FAPI-compliant banking integrations</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            multiple 
            accept=".json,.yaml,.yml"
            className="hidden" 
          />
          <button 
            onClick={handleForgeAll}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Cpu className="w-4 h-4" />
            Forge All
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Import API Spec
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apis.map((api) => (
          <motion.div key={api.id} layout>
            <Card className="relative group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-50 transition-colors">
                  <Database className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                    api.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                  )}>
                    {api.status}
                  </div>
                  {api.isForged && (
                    <div className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Forged
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{api.name}</h3>
              <p className="text-sm text-slate-500 mt-1">Version {api.version}</p>
              
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  FAPI v1.0
                </span>
                <span>{api.endpoints} Endpoints</span>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                  Documentation
                </button>
                <button 
                  onClick={() => handleForge(api)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Forge App
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
        
        <button className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all group">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Add New Integration</span>
        </button>
      </div>

      <Card title="Security & Compliance" subtitle="Financial-grade API (FAPI) Standards">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">mTLS Enforcement</h4>
                <p className="text-sm text-slate-500">Mutual TLS is required for all production endpoints to ensure client authenticity.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-purple-50 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">JWS Request Signing</h4>
                <p className="text-sm text-slate-500">All API requests must be signed using JSON Web Signature to prevent tampering.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Compliance Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Open Banking UK</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">PASSED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">CDR Australia</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">PASSED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">FDX (US)</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">IN PROGRESS</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAiAdvisor = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Nexus AI Advisor</h1>
        <p className="text-slate-500">Intelligent financial insights powered by Gemini</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[600px]">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
              <p className="text-slate-800">Hello! I'm Nexus AI. I've analyzed your recent transactions. How can I help you optimize your finances today?</p>
            </div>
          </div>

          <AnimatePresence>
            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] prose prose-slate prose-sm">
                  <Markdown>{aiResponse}</Markdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isAiLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 animate-pulse">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <form onSubmit={handleAiChat} className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your spending, savings goals, or budget..."
              className="w-full pl-4 pr-12 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={isAiLoading || !chatInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Analyze my spending", "How can I save $500?", "Review my subscriptions"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setChatInput(suggestion)}
                className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderForgeResult = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('forge')}
          className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-medium"
        >
          <ArrowDownLeft className="w-4 h-4 rotate-45" />
          Back to Forge
        </button>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
            Export Code
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            Deploy to Prod
          </button>
        </div>
      </div>

      <Card className="min-h-[600px]">
        {forgingApiId ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">
                {forgingApiId === 'all' ? 'Forging All APIs...' : 'Forging Production App...'}
              </h3>
              <p className="text-slate-500">Applying FAPI security layers and generating banking logic</p>
            </div>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              Forge Report: Production-Ready FAPI App
            </h1>

            {Object.keys(forgeResults).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-4">
                {Object.keys(forgeResults).map(modelName => (
                  <button
                    key={modelName}
                    onClick={() => setActiveForgeModel(modelName)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeForgeModel === modelName
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {modelName}
                  </button>
                ))}
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Markdown>
                {forgeResult || forgeResults[activeForgeModel] || "No report generated yet."}
              </Markdown>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Nexus Bank</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Database} label="API Forge" active={activeTab === 'forge'} onClick={() => setActiveTab('forge')} />
          <SidebarItem icon={Send} label="Transfers" active={activeTab === 'transfers'} onClick={() => setActiveTab('transfers')} />
          <SidebarItem icon={MessageSquare} label="AI Advisor" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
          <SidebarItem icon={CreditCard} label="Cards" active={activeTab === 'cards'} onClick={() => setActiveTab('cards')} />
          <SidebarItem icon={TrendingUp} label="Investments" active={activeTab === 'invest'} onClick={() => setActiveTab('invest')} />
          <SidebarItem icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase">System Status</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">FAPI Gateway: Online</p>
            <p className="text-[10px] text-slate-400 font-medium">AI Core: v3.1 Flash</p>
          </div>
          <SidebarItem icon={Settings} label="Settings" onClick={() => {}} />
          <SidebarItem icon={LogOut} label="Logout" onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions, APIs, or help..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-white hover:text-slate-900 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Alex Rivera</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase">Premium Member</p>
              </div>
              <img 
                src="https://picsum.photos/seed/alex/100/100" 
                alt="Profile" 
                className="w-10 h-10 rounded-xl border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'forge' && renderApiForge()}
            {activeTab === 'forge-result' && renderForgeResult()}
            {activeTab === 'ai' && renderAiAdvisor()}
            {activeTab === 'transfers' && renderTransfers()}
            {activeTab === 'cards' && renderCards()}
            {activeTab === 'invest' && renderInvestments()}
            {activeTab === 'profile' && renderProfile()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );

  function renderTransfers() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Money Movement</h1>
            <p className="text-slate-500">Secure FAPI-compliant transfers and payment management</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              New Transfer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* SEPA Transfer Form */}
            <Card title="SEPA Transfer" subtitle="Instant Euro Payments">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">From Account</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                      {MOCK_ACCOUNTS.map(acc => <option key={acc.id}>{acc.name} ({acc.accountNumber})</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Amount (EUR)</label>
                    <input type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Recipient IBAN</label>
                  <input type="text" placeholder="EE00 0000 0000 0000 0000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Confirm SEPA Transfer
                </button>
              </div>
            </Card>

            {/* Repeating Payments */}
            <Card title="Repeating Payments" subtitle="Manage your standing instructions">
              <div className="space-y-4">
                {[
                  { id: 'si1', name: 'Rent Payment', amount: 1200, frequency: 'Monthly', next: '2024-04-01' },
                  { id: 'si2', name: 'Gym Membership', amount: 45, frequency: 'Monthly', next: '2024-03-28' },
                  { id: 'si3', name: 'Savings Transfer', amount: 500, frequency: 'Weekly', next: '2024-03-22' },
                ].map((si) => (
                  <div key={si.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{si.name}</p>
                        <p className="text-xs text-slate-500">{si.frequency} • Next: {si.next}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-slate-900">${si.amount}</p>
                      <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Adhoc Multiple Transfers */}
            <Card title="Batch Payments" subtitle="Adhoc Multiple Transfers">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    Process multiple payments simultaneously. Ideal for payroll or vendor settlements.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Selected Payees</span>
                    <span className="font-bold text-slate-900">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Total Amount</span>
                    <span className="font-bold text-slate-900">$0.00</span>
                  </div>
                </div>
                <button className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-500 rounded-xl font-medium hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Payee to Batch
                </button>
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50" disabled>
                  Execute Batch Payment
                </button>
              </div>
            </Card>

            {/* Payee Eligibility */}
            <Card title="Payee Verification" subtitle="Eligibility Check">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search payees..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-slate-600">Global SWIFT Network: Connected</span>
                  </div>
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-slate-600">SEPA Instant: Active</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  function renderCards() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Card Management</h1>
            <p className="text-slate-500">Manage your physical and virtual payment methods</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Issue Virtual Card
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.div 
              initial={{ rotateY: -10, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              className="relative w-full h-56 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-2xl p-8 text-white shadow-2xl shadow-blue-200 overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu className="w-32 h-32" />
              </div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-medium opacity-70 uppercase tracking-widest">Nexus Platinum</p>
                  <p className="text-lg font-bold">Alex Rivera</p>
                </div>
                <div className="w-12 h-8 bg-amber-400/20 rounded-md border border-amber-400/30 flex items-center justify-center">
                  <div className="w-6 h-4 bg-amber-400/40 rounded-sm" />
                </div>
              </div>
              <div className="mt-12">
                <p className="text-2xl font-mono tracking-[0.2em]">**** **** **** 4582</p>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] opacity-60 uppercase">Expiry</p>
                    <p className="text-sm font-medium">09/28</p>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-60 uppercase">CVV</p>
                    <p className="text-sm font-medium">***</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500/80" />
                  <div className="w-8 h-8 rounded-full bg-amber-500/80" />
                </div>
              </div>
            </motion.div>

            <Card title="Card Controls">
              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, label: "Freeze Card", desc: "Temporarily disable all transactions", color: "text-blue-600" },
                  { icon: Search, label: "View PIN", desc: "Securely reveal your card PIN", color: "text-slate-600" },
                  { icon: Bell, label: "Transaction Alerts", desc: "Get notified for every spend", color: "text-emerald-600" },
                  { icon: LogOut, label: "Terminate Card", desc: "Permanently disable this card", color: "text-rose-600" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors", item.color)}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className="w-10 h-6 bg-slate-200 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Spending Limits">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Daily Limit</span>
                    <span className="font-bold text-slate-900">$2,500 / $5,000</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-600 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Online Purchases</span>
                    <span className="font-bold text-slate-900">$850 / $2,000</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[42%] h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Recent Card Activity">
              <div className="space-y-4">
                {MOCK_TRANSACTIONS.slice(0, 3).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Search className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{tx.description}</p>
                        <p className="text-[10px] text-slate-500">{tx.date}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-900">-${tx.amount}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customer Profile</h1>
            <p className="text-slate-500">Manage your personal information and demographics</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 flex flex-col items-center text-center py-10">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/alex/200/200" 
                alt="Profile" 
                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl mb-4"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 right-0 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Alex Rivera</h3>
            <p className="text-sm text-slate-500">Premium Member since 2021</p>
            <div className="mt-6 w-full px-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Verification Status</span>
                <span className="text-emerald-600">Verified</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-emerald-500" />
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2" title="Demographics & Identity">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: "Alexandro Rivera" },
                { label: "Email Address", value: "alex.rivera@nexus.bank" },
                { label: "Phone Number", value: "+1 (555) 012-3456" },
                { label: "Date of Birth", value: "May 14, 1992" },
                { label: "Nationality", value: "United States" },
                { label: "Employment", value: "Senior Software Architect" },
                { label: "Residential Status", value: "Resident" },
                { label: "Tax ID", value: "XXX-XX-9876" }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-4">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Your demographics data is protected by FAPI-compliant encryption. Only authorized banking modules can access this information.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function renderInvestments() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Investment Portfolio</h1>
            <p className="text-slate-500">Track and grow your wealth with AI-guided strategies</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
              Portfolio Rebalance
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <TrendingUp className="w-4 h-4" />
              Trade
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" title="Performance History">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', value: 42000 },
                  { name: 'Tue', value: 43500 },
                  { name: 'Wed', value: 41000 },
                  { name: 'Thu', value: 44800 },
                  { name: 'Fri', value: 46200 },
                  { name: 'Sat', value: 45900 },
                  { name: 'Sun', value: 47500 },
                ]}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Asset Allocation">
              <div className="h-[200px] w-full flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 border-[12px] border-blue-600 rounded-full" />
                  <div className="absolute inset-0 border-[12px] border-emerald-500 rounded-full clip-path-half rotate-90" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="text-sm font-bold">$47.5k</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-slate-600">Stocks</span>
                  </div>
                  <span className="font-bold">65%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-slate-600">Crypto</span>
                  </div>
                  <span className="font-bold">25%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="text-slate-600">Cash</span>
                  </div>
                  <span className="font-bold">10%</span>
                </div>
              </div>
            </Card>

            <Card title="AI Strategy" className="bg-emerald-900 text-white border-none">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Bullish Outlook</span>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  "Market indicators suggest a strong recovery in the tech sector. I recommend increasing your exposure to **Cloud Infrastructure** by 5%."
                </p>
                <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors">
                  Execute Strategy
                </button>
              </div>
            </Card>
          </div>
        </div>

        <Card title="Top Holdings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Apple Inc.", symbol: "AAPL", price: "$182.52", change: "+1.2%", color: "text-emerald-600" },
              { name: "Bitcoin", symbol: "BTC", price: "$64,210", change: "-0.5%", color: "text-rose-600" },
              { name: "NVIDIA", symbol: "NVDA", price: "$875.30", change: "+4.8%", color: "text-emerald-600" },
              { name: "Ethereum", symbol: "ETH", price: "$3,450", change: "+2.1%", color: "text-emerald-600" }
            ].map((stock, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-400">{stock.symbol}</span>
                  <span className={cn("text-xs font-bold", stock.color)}>{stock.change}</span>
                </div>
                <p className="font-bold text-slate-900">{stock.name}</p>
                <p className="text-lg font-mono mt-1">{stock.price}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/src/App.tsx
================================================================================

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Cpu, ShieldAlert, Sparkles, Terminal, ArrowLeft, ExternalLink, Grid } from 'lucide-react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { datadogLogs } from '@datadog/browser-logs';
import { Analytics } from '@vercel/analytics/react';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider, DataContext } from './context/DataContext';
import { StripeDataProvider } from './components/StripeDataProvider';
import { MoneyMovementProvider } from './components/MoneyMovementContext';

// Layout & Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SApp from './components/SApp';
import { View } from './types';

// Views & Components
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import BudgetsView from './components/BudgetsView';
import FinancialGoalsView from './components/FinancialGoalsView';
import CreditHealthView from './components/CreditHealthView';
import PersonalizationView from './components/PersonalizationView';
import AccountsView from './components/AccountsView';
import InvestmentsView from './components/InvestmentsView';
import CryptoView from './components/CryptoView';
import AlgoTradingLab from './components/AlgoTradingLab';
import ForexArena from './components/ForexArena';
import CommoditiesExchange from './components/CommoditiesExchange';
import RealEstateEmpire from './components/RealEstateEmpire';
import ArtCollectibles from './components/ArtCollectibles';
import DerivativesDesk from './components/DerivativesDesk';
import VentureCapitalDesk from './components/VentureCapitalDesk';
import PrivateEquityLounge from './components/PrivateEquityLounge';
import TaxOptimizationChamber from './components/TaxOptimizationChamber';
import LegacyBuilder from './components/LegacyBuilder';
import CorporateCommandView from './components/CorporateCommandView';
import ModernTreasuryView from './components/ModernTreasuryView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import QuantumWeaverView from './components/QuantumWeaverView';
import AgentMarketplaceView from './components/MarketplaceView';
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import ConciergeService from './components/ConciergeService';
import SovereignWealth from './components/SovereignWealth';
import PhilanthropyHub from './components/PhilanthropyHub';
import TheVisionView from './components/TheVisionView';
import AIAdvisorView from './components/AIAdvisorView';
import { AIInsights } from './components/AIInsights';
import SecurityView from './components/SecurityView';
import ComplianceOracleView from './components/ComplianceOracleView';
import GlobalPositionMap from './components/GlobalPositionMap';
import GlobalSsiHubView from './components/GlobalSsiHubView';
import CustomerDashboard from './components/CustomerDashboard';
import VerificationReportsView from './components/VerificationReportsView';
import FinancialReportingView from './components/FinancialReportingView';
import StripeNexusDashboard from './components/StripeNexusDashboard';
import TheBookView from './components/TheBookView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import VoiceControl from './components/VoiceControl';
import LandingPage from './components/LandingPage';
import QuantumAssets from './components/QuantumAssets';
import CitibankAccountsView from './components/CitibankAccountsView';
import CitibankAccountProxyView from './components/CitibankAccountProxyView';
import CitibankBillPayView from './components/CitibankBillPayView';
import CitibankCrossBorderView from './components/CitibankCrossBorderView';
import CitibankPayeeManagementView from './components/CitibankPayeeManagementView';
import CitibankStandingInstructionsView from './components/CitibankStandingInstructionsView';
import CitibankDeveloperToolsView from './components/CitibankDeveloperToolsView';
import CitibankEligibilityView from './components/CitibankEligibilityView';
import CitibankUnmaskedDataView from './components/CitibankUnmaskedDataView';
import PlaidIdentityView from './components/PlaidIdentityView';
import PlaidCRAMonitoringView from './components/PlaidCRAMonitoringView';
import { PlaidInstitutionsExplorer } from './components/PlaidInstitutionsExplorer';
import { PlaidItemManagementView } from './components/PlaidItemManagementView';
import PlaidMainDashboard from './components/PlaidMainDashboard';
import StripeNexusView from './components/StripeNexusView';
import CounterpartyDashboardView from './components/CounterpartyDashboardView';
import VirtualAccountsDashboard from './components/VirtualAccountsDashboard';
import CorporateActionsNexusView from './components/CorporateActionsNexusView';
import { CreditNoteLedger } from './components/CreditNoteLedger';
import ReconciliationHubView from './components/ReconciliationHubView';
import GEINDashboard from './components/GEIN_DashboardView';
import CardholderManagement from './components/CardholderManagement';
import UniversalObjectInspector from './components/UniversalObjectInspector';
import { LoginView } from './components/LoginView';
import { PlaidClient } from './lib/plaidClient';
import DeveloperHubView from './components/DeveloperHubView';
import ApiPlaygroundView from './components/ApiPlaygroundView';

// --- ALL COMPONENT IMPORTS FOR DIRECT ACCESS ---
import AccountDetails from './components/AccountDetails';
import AccountList from './components/AccountList';
import AccountStatementGrid from './components/AccountStatementGrid';
import { AccountVerificationModal } from './components/AccountVerificationModal';
import ACHDetailsDisplay from './components/ACHDetailsDisplay';
import AICommandLog from './components/AICommandLog';
import AIPredictionWidget from './components/AIPredictionWidget';
import AssetCatalog from './components/AssetCatalog';
import AutomatedSweepRules from './components/AutomatedSweepRules';
import BalanceReportChart from './components/BalanceReportChart';
import BalanceTransactionTable from './components/BalanceTransactionTable';
import CardDesignVisualizer from './components/CardDesignVisualizer';
import { ChargeDetailModal } from './components/ChargeDetailModal';
import ChargeList from './components/ChargeList';
import ConductorConfigurationView from './components/ConductorConfigurationView';
import CounterpartyDetails from './components/CounterpartyDetails';
import { CounterpartyForm } from './components/CounterpartyForm';
import DisruptionIndexMeter from './components/DisruptionIndexMeter';
import DocumentUploader from './components/DocumentUploader';
import { DownloadLink } from './components/DownloadLink';
import EarlyFraudWarningFeed from './components/EarlyFraudWarningFeed';
import ElectionChoiceForm from './components/ElectionChoiceForm';
import EventNotificationCard from './components/EventNotificationCard';
import ExpectedPaymentsTable from './components/ExpectedPaymentsTable';
import ExternalAccountCard from './components/ExternalAccountCard';
import ExternalAccountForm from './components/ExternalAccountForm';
import ExternalAccountTable from './components/ExternalAccountsTable';
import { FinancialAccountCard } from './components/FinancialAccountCard';
import IncomingPaymentDetailList from './components/IncomingPaymentDetailList';
import { InvestmentForm } from './components/InvestmentForm';
import InvoiceFinancingRequest from './components/InvoiceFinancingRequest';
import PaymentInitiationForm from './components/PaymentInitiationForm';
import PaymentMethodDetails from './components/PaymentMethodDetails';
import PaymentOrderForm from './components/PaymentOrderForm';
import PayoutsDashboard from './components/PayoutsDashboard';
import PnLChart from './components/PnLChart';
import RefundForm from './components/RefundForm';
import RemittanceInfoEditor from './components/RemittanceInfoEditor';
import ReportingView from './components/ReportingView';
import { ReportRunGenerator } from './components/ReportRunGenerator';
import ReportStatusIndicator from './components/ReportStatusIndicator';
import ResourceGraphView from './components/ResourceGraphView';
import SchemaExplorer from './components/SchemaExplorer';
import SecurityComplianceView from './components/SecurityComplianceView';
import SsiEditorForm from './components/SsiEditorForm';
import StripeStatusBadge from './components/StripeStatusBadge';
import StructuredPurposeInput from './components/StructuredPurposeInput';
import SubscriptionList from './components/SubscriptionList';
import TimeSeriesChart from './components/TimeSeriesChart';
import TradeConfirmationModal from './components/TradeConfirmationModal';
import TransactionFilter from './components/TransactionFilter';
import TransactionList from './components/TransactionList';
import { TreasuryTransactionList } from './components/TreasuryTransactionList';
import TreasuryView from './components/TreasuryView';
import VentureCapitalDeskView from './components/VentureCapitalDeskView';
import VirtualAccountForm from './components/VirtualAccountForm';
import VirtualAccountsTable from './components/VirtualAccountsTable';
import WebhookSimulator from './components/WebhookSimulator';

// --- FIXED Wrapper Components ---
type WrapperProps = {
  Component: React.FC<any>;
  props?: any;
};

const Wrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  return <Component {...props} />;
};

const ModalWrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Component
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      {...props}
    />
  );
};

const DataContextWrapper: React.FC<{ Component: React.FC<any>; extraProps?: any }> = ({ Component, extraProps = {} }) => {
  const dataContext = useContext(DataContext);
  const mockContext = {
    setActiveView: () => {},
    impactData: { treesPlanted: 0, progressToNextTree: 0 },
  };
  const props = { ...(dataContext || mockContext), ...extraProps };
  return <Component {...props} />;
};

const AIIntentStub: React.FC<{ view: View }> = ({ view }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in duration-700 bg-gray-950/50 rounded-3xl border border-gray-800">
      <div className="w-24 h-24 bg-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        <Sparkles className="text-cyan-400 w-12 h-12 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-mono">
          Module Ingress: {String(view).replace(/-/g, '_').toUpperCase()}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed font-mono">
          The Sovereign AI Core is compiling the high-frequency logic for this specific subsystem. Targeting zero-latency node deployment in the next epoch.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
          <Terminal size={14} /> STATUS: COMPILING_INTENT
        </div>
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
          <ShieldAlert size={14} /> AUTH: VERIFIED
        </div>
      </div>
    </div>
  );
};

const MonetizationOverlay = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { sovereignCredits } = context;
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sovereign Balance:</span>
      <span className="text-cyan-400 font-mono text-lg font-bold tracking-tighter">
        {sovereignCredits.toLocaleString()} SC
      </span>
    </div>
  );
};

const Logout = () => {
  const { logout } = useAuth0();
  useEffect(() => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout]);
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black text-cyan-400 font-mono">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span>TERMINATING SESSION...</span>
      </div>
    </div>
  );
};

const SAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    datadogLogs.logger.info('App View Loaded', { name: 'SovereignNexus', id: 'init_view' });
  }, []);

  // Define Route Configuration to map Views to Paths and Components
  const viewConfig = useMemo(() => [
    { view: View.Dashboard, path: '/dashboard', element: <Dashboard /> },
    { view: View.Transactions, path: '/transactions', element: <TransactionsView /> },
    { view: View.SendMoney, path: '/send-money', element: <SendMoneyView /> },
    { view: View.Budgets, path: '/budgets', element: <BudgetsView /> },
    { view: View.FinancialGoals, path: '/financial-goals', element: <FinancialGoalsView /> },
    { view: View.CreditHealth, path: '/credit-health', element: <CreditHealthView /> },
    { view: View.Personalization, path: '/personalization', element: <PersonalizationView /> },
    { view: View.Accounts, path: '/accounts', element: <AccountsView /> },
    { view: View.Investments, path: '/investments', element: <InvestmentsView /> },
    { view: View.CryptoWeb3, path: '/crypto', element: <CryptoView /> },
    { view: View.AlgoTradingLab, path: '/algo-trading', element: <AlgoTradingLab /> },
    { view: View.ForexArena, path: '/forex', element: <ForexArena /> },
    { view: View.CommoditiesExchange, path: '/commodities', element: <CommoditiesExchange /> },
    { view: View.RealEstateEmpire, path: '/real-estate', element: <RealEstateEmpire /> },
    { view: View.ArtCollectibles, path: '/art-collectibles', element: <ArtCollectibles /> },
    { view: View.DerivativesDesk, path: '/derivatives', element: <DerivativesDesk /> },
    { view: View.VentureCapital, path: '/venture-capital', element: <VentureCapitalDesk /> },
    { view: View.PrivateEquity, path: '/private-equity', element: <PrivateEquityLounge /> },
    { view: View.TaxOptimization, path: '/tax-optimization', element: <TaxOptimizationChamber /> },
    { view: View.LegacyBuilder, path: '/legacy-builder', element: <LegacyBuilder /> },
    { view: View.CorporateCommand, path: '/corporate-command', element: <CorporateCommandView setActiveView={dataContext?.setActiveView} /> },
    { view: View.ModernTreasury, path: '/modern-treasury', element: <ModernTreasuryView /> },
    { view: View.OpenBanking, path: '/open-banking', element: <OpenBankingView /> },
    { view: View.FinancialDemocracy, path: '/financial-democracy', element: <FinancialDemocracyView /> },
    { view: View.AIAdStudio, path: '/ai-ad-studio', element: <AIAdStudioView /> },
    { view: View.QuantumWeaver, path: '/quantum-weaver', element: <QuantumWeaverView /> },
    { view: View.AgentMarketplace, path: '/agent-marketplace', element: <AgentMarketplaceView /> },
    { view: View.APIStatus, path: '/api-status', element: <APIIntegrationView /> },
    { view: View.Settings, path: '/settings', element: <SettingsView /> },
    { view: View.QuantumAssets, path: '/quantum-assets', element: <QuantumAssets /> },
    { view: View.SovereignWealth, path: '/sovereign-wealth', element: <SovereignWealth /> },
    { view: View.Philanthropy, path: '/philanthropy', element: <PhilanthropyHub /> },
    { view: View.TheVision, path: '/vision', element: <TheVisionView /> },
    { view: View.AIAdvisor, path: '/ai-advisor', element: <AIAdvisorView /> },
    { view: View.AIInsights, path: '/ai-insights', element: <AIInsights /> },
    { view: View.SecurityCenter, path: '/security', element: <SecurityView /> },
    { view: View.ComplianceOracle, path: '/compliance', element: <ComplianceOracleView /> },
    { view: View.GlobalPositionMap, path: '/global-map', element: <GlobalPositionMap /> },
    { view: View.GlobalSsiHub, path: '/ssi-hub', element: <GlobalSsiHubView /> },
    { view: View.CustomerDashboard, path: '/customer-dashboard', element: <CustomerDashboard /> },
    { view: View.VerificationReports, path: '/verification-reports', element: <VerificationReportsView customerId="c1" /> },
    { view: View.FinancialReporting, path: '/financial-reporting', element: <FinancialReportingView /> },
    { view: View.StripeNexusDashboard, path: '/stripe-nexus-dashboard', element: <StripeNexusDashboard /> },
    { view: View.TheBook, path: '/the-book', element: <TheBookView /> },
    { view: View.KnowledgeBase, path: '/knowledge-base', element: <KnowledgeBaseView /> },
    { view: View.CitibankAccounts, path: '/citi-accounts', element: <CitibankAccountsView /> },
    { view: View.CitibankAccountProxy, path: '/citi-proxy', element: <CitibankAccountProxyView /> },
    { view: View.CitibankBillPay, path: '/citi-bill-pay', element: <CitibankBillPayView /> },
    { view: View.CitibankCrossBorder, path: '/citi-cross-border', element: <CitibankCrossBorderView /> },
    { view: View.CitibankPayeeManagement, path: '/citi-payee', element: <CitibankPayeeManagementView /> },
    { view: View.CitibankStandingInstructions, path: '/citi-standing-instructions', element: <CitibankStandingInstructionsView /> },
    { view: View.CitibankDeveloperTools, path: '/citi-dev-tools', element: <CitibankDeveloperToolsView /> },
    { view: View.CitibankEligibility, path: '/citi-eligibility', element: <CitibankEligibilityView /> },
    { view: View.CitibankUnmaskedData, path: '/citi-unmasked', element: <CitibankUnmaskedDataView accountIdsToUnmask={['acc_1']} /> },
    { view: View.PlaidMainDashboard, path: '/plaid-dashboard', element: <PlaidMainDashboard /> },
    { view: View.PlaidIdentity, path: '/plaid-identity', element: <PlaidIdentityView /> },
    { view: View.PlaidCRAMonitoring, path: '/plaid-cra', element: <PlaidCRAMonitoringView /> },
    { view: View.PlaidInstitutions, path: '/plaid-institutions', element: <PlaidInstitutionsExplorer client={new PlaidClient()} /> },
    { view: View.PlaidItemManagement, path: '/plaid-items', element: <PlaidItemManagementView accessToken="mock_token" /> },
    { view: View.StripeNexus, path: '/stripe-nexus', element: <StripeNexusView /> },
    { view: View.CounterpartyDashboard, path: '/counterparty-dashboard', element: <CounterpartyDashboardView /> },
    { view: View.VirtualAccounts, path: '/virtual-accounts', element: <VirtualAccountsDashboard /> },
    { view: View.SApp, path: '/sapp', element: <SApp /> }, // Fixed Typo: SAPP -> SApp
    { view: View.CorporateActions, path: '/corporate-actions', element: <CorporateActionsNexusView /> },
    { view: View.CreditNoteLedger, path: '/credit-note-ledger', element: <CreditNoteLedger /> },
    { view: View.ReconciliationHub, path: '/reconciliation', element: <ReconciliationHubView /> },
    { view: View.GEINDashboard, path: '/gein-dashboard', element: <GEINDashboard /> },
    { view: View.CardholderManagement, path: '/cardholder-management', element: <CardholderManagement /> },
    { view: View.SecurityCompliance, path: '/security-compliance', element: <SecurityComplianceView /> },
    { view: View.DeveloperHub, path: '/developer-hub', element: <DeveloperHubView /> },
    { view: View.SchemaExplorer, path: '/schema-explorer', element: <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} /> },
    { view: View.ResourceGraph, path: '/resource-graph', element: <ResourceGraphView /> },
    { view: View.ApiPlayground, path: '/api-playground', element: <ApiPlaygroundView /> },
    { view: View.VentureCapitalDeskView, path: '/vc-desk-view', element: <VentureCapitalDeskView /> },
    
    // Direct Component Access
    { view: View.AccountDetails, path: '/comp/account-details', element: <Wrapper Component={AccountDetails} props={{ accountId: '1', customerId: 'c1' }} /> },
    { view: View.AccountList, path: '/comp/account-list', element: <Wrapper Component={AccountList} props={{ accounts: [] }} /> },
    { view: View.AccountStatementGrid, path: '/comp/account-statement', element: <Wrapper Component={AccountStatementGrid} props={{ statementLines: [] }} /> },
    { view: View.AccountVerificationModal, path: '/comp/account-verification', element: <ModalWrapper Component={AccountVerificationModal} props={{ externalAccount: {id: '1', verification_status: 'unverified' }, onSuccess: () => {}}} /> },
    { view: View.ACHDetailsDisplay, path: '/comp/ach-details', element: <Wrapper Component={ACHDetailsDisplay} props={{ details: { routingNumber: '123', realAccountNumber: '456' } }} /> },
    { view: View.AICommandLog, path: '/comp/ai-command-log', element: <AICommandLog /> },
    { view: View.AIPredictionWidget, path: '/comp/ai-prediction', element: <AIPredictionWidget /> },
    { view: View.AssetCatalog, path: '/comp/asset-catalog', element: <Wrapper Component={AssetCatalog} props={{ assets: [], onAssetSelected: () => {}, getAssetDetails: async () => ({}) }} /> },
    { view: View.AutomatedSweepRules, path: '/comp/sweep-rules', element: <AutomatedSweepRules /> },
    { view: View.BalanceReportChart, path: '/comp/balance-chart', element: <Wrapper Component={BalanceReportChart} props={{ data: [] }} /> },
    { view: View.BalanceTransactionTable, path: '/comp/balance-table', element: <Wrapper Component={BalanceTransactionTable} props={{ balanceTransactions: [] }} /> },
    { view: View.CardDesignVisualizer, path: '/comp/card-design', element: <Wrapper Component={CardDesignVisualizer} props={{ design: { id: 'd_1', physical_bundle: { features: {} } } }} /> },
    { view: View.ChargeDetailModal, path: '/comp/charge-detail', element: <ModalWrapper Component={ChargeDetailModal} props={{ charge: {id: 'ch_1', amount: 50000, currency: 'USD', status: 'succeeded'}, onClose: () => {}}} /> },
    { view: View.ChargeList, path: '/comp/charge-list', element: <ChargeList /> },
    { view: View.ConductorConfigurationView, path: '/comp/conductor-config', element: <ConductorConfigurationView /> },
    { view: View.CounterpartyDetails, path: '/comp/counterparty-details', element: <Wrapper Component={CounterpartyDetails} props={{ counterpartyId: 'cp_1' }} /> },
    { view: View.CounterpartyForm, path: '/comp/counterparty-form', element: <Wrapper Component={CounterpartyForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.DisruptionIndexMeter, path: '/comp/disruption-meter', element: <Wrapper Component={DisruptionIndexMeter} props={{ indexValue: 50 }} /> },
    { view: View.DocumentUploader, path: '/comp/document-uploader', element: <Wrapper Component={DocumentUploader} props={{ documentableType: 'test', documentableId: '1' }} /> },
    { view: View.DownloadLink, path: '/comp/download-link', element: <Wrapper Component={DownloadLink} props={{ url: '#', filename: 'test.pdf' }} /> },
    { view: View.EarlyFraudWarningFeed, path: '/comp/fraud-feed', element: <EarlyFraudWarningFeed /> },
    { view: View.ElectionChoiceForm, path: '/comp/election-form', element: <Wrapper Component={ElectionChoiceForm} props={{ availableChoices: {}, onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.EventNotificationCard, path: '/comp/event-card', element: <Wrapper Component={EventNotificationCard} props={{ event: {} }} /> },
    { view: View.ExpectedPaymentsTable, path: '/comp/expected-payments', element: <ExpectedPaymentsTable /> },
    { view: View.ExternalAccountCard, path: '/comp/external-account-card', element: <Wrapper Component={ExternalAccountCard} props={{ account: {id: '1', account_details: [], routing_details: []}}} /> },
    { view: View.ExternalAccountForm, path: '/comp/external-account-form', element: <Wrapper Component={ExternalAccountForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.ExternalAccountsTable, path: '/comp/external-accounts-table', element: <Wrapper Component={ExternalAccountTable} props={{ accounts: [] }} /> },
    { view: View.FinancialAccountCard, path: '/comp/financial-account-card', element: <Wrapper Component={FinancialAccountCard} props={{ financialAccount: {id: 'fa_1', balance: { cash: {}}, supported_currencies: []}}} /> },
    { view: View.IncomingPaymentDetailList, path: '/comp/incoming-payments', element: <IncomingPaymentDetailList /> },
    { view: View.InvoiceFinancingRequest, path: '/comp/invoice-financing', element: <Wrapper Component={InvoiceFinancingRequest} props={{ onSubmit: () => {} }} /> },
    { view: View.PaymentInitiationForm, path: '/comp/payment-initiation', element: <PaymentInitiationForm /> },
    { view: View.PaymentMethodDetails, path: '/comp/payment-method', element: <Wrapper Component={PaymentMethodDetails} props={{ details: { type: 'card', card: {} }}} /> },
    { view: View.PaymentOrderForm, path: '/comp/payment-order', element: <Wrapper Component={PaymentOrderForm} props={{ internalAccounts: [], externalAccounts: [], onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.PayoutsDashboard, path: '/comp/payouts', element: <PayoutsDashboard /> },
    { view: View.PnLChart, path: '/comp/pnl-chart', element: <Wrapper Component={PnLChart} props={{ data: [], algorithmName: 'Test' }} /> },
    { view: View.RefundForm, path: '/comp/refund-form', element: <RefundForm /> },
    { view: View.RemittanceInfoEditor, path: '/comp/remittance-editor', element: <Wrapper Component={RemittanceInfoEditor} props={{ onChange: () => {} }} /> },
    { view: View.ReportingView, path: '/comp/reporting', element: <ReportingView /> },
    { view: View.ReportRunGenerator, path: '/comp/report-generator', element: <ReportRunGenerator /> },
    { view: View.ReportStatusIndicator, path: '/comp/report-status', element: <Wrapper Component={ReportStatusIndicator} props={{ status: 'success' }} /> },
    { view: View.ResourceGraphView, path: '/comp/resource-graph-view', element: <ResourceGraphView /> },
    { view: View.SchemaExplorer, path: '/comp/schema-explorer-view', element: <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} /> },
    { view: View.SecurityComplianceView, path: '/comp/security-compliance-view', element: <SecurityComplianceView /> },
    { view: View.SsiEditorForm, path: '/comp/ssi-editor', element: <Wrapper Component={SsiEditorForm} props={{ onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.StripeStatusBadge, path: '/comp/stripe-badge', element: <Wrapper Component={StripeStatusBadge} props={{ status: 'succeeded', objectType: 'charge' }} /> },
    { view: View.StructuredPurposeInput, path: '/comp/structured-purpose', element: <Wrapper Component={StructuredPurposeInput} props={{ onChange: () => {}, value: null }} /> },
    { view: View.SubscriptionList, path: '/comp/subscription-list', element: <Wrapper Component={SubscriptionList} props={{ subscriptions: [] }} /> },
    { view: View.TimeSeriesChart, path: '/comp/time-series', element: <Wrapper Component={TimeSeriesChart} props={{ data: { labels: [], datasets: [] } }} /> },
    { view: View.TradeConfirmationModal, path: '/comp/trade-confirmation', element: <ModalWrapper Component={TradeConfirmationModal} props={{ settlementInstruction: { messageId: 'NEX-INST-99281-Z', totalAmount: 12500000, currency: 'USD', creationDateTime: Date.now(), settlementDate: '2024-12-15', numberOfTransactions: 1, purpose: 'TREA' } }} /> },
    { view: View.TransactionFilter, path: '/comp/transaction-filter', element: <Wrapper Component={TransactionFilter} props={{ onApplyFilters: () => {} }} /> },
    { view: View.TransactionList, path: '/comp/transaction-list', element: <Wrapper Component={TransactionList} props={{ transactions: [] }} /> },
    { view: View.TreasuryTransactionList, path: '/comp/treasury-list', element: <Wrapper Component={TreasuryTransactionList} props={{ transactions: [] }} /> },
    { view: View.TreasuryView, path: '/comp/treasury-view', element: <TreasuryView /> },
    { view: View.UniversalObjectInspector, path: '/comp/object-inspector', element: <Wrapper Component={UniversalObjectInspector} props={{ data: { status: "Nominal", uptime: "99.999%", load: "Balanced" } }} /> },
    { view: View.VirtualAccountForm, path: '/comp/virtual-account-form', element: <Wrapper Component={VirtualAccountForm} props={{ onSubmit: () => {}, isSubmitting: false }} /> },
    { view: View.VirtualAccountsTable, path: '/comp/virtual-accounts-table', element: <Wrapper Component={VirtualAccountsTable} props={{ onEdit: () => {}, onDelete: () => {} }} /> },
    { view: View.VoiceControl, path: '/comp/voice-control', element: <DataContextWrapper Component={VoiceControl} /> },
    { view: View.WebhookSimulator, path: '/comp/webhook-simulator', element: <Wrapper Component={WebhookSimulator} props={{ stripeAccountId: 'acct_mock' }} /> },
  ], [dataContext?.setActiveView]);

  if (!dataContext || !authContext) return null;
  const { isAuthenticated, isLoading: authLoading } = authContext;
  const { isLoading: dataLoading, activeView, setActiveView } = dataContext;

  // Sync URL to State (Deep Linking)
  useEffect(() => {
    const currentPath = location.pathname;
    const config = viewConfig.find(c => c.path === currentPath);
    if (config && activeView !== config.view) {
      setActiveView(config.view);
    } else if (!config && currentPath !== '/') {
      // Fallback for unknown routes inside SAppLayout
      // Optional: Redirect to dashboard or handle 404
    }
  }, [location.pathname, viewConfig, activeView, setActiveView]);

  // Sync State to URL (Sidebar Navigation)
  useEffect(() => {
    const config = viewConfig.find(c => c.view === activeView);
    if (config && location.pathname !== config.path) {
      navigate(config.path);
    }
  }, [activeView, viewConfig, navigate, location.pathname]);

  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-6">
        <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />
        <h1 className="text-3xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase font-mono">
          Nexus OS // Syncing
        </h1>
        <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-progress-flow"></div>
        </div>
        <style>{`
          @keyframes flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          .animate-progress-flow { animation: flow 2s linear infinite; width: 50%; }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="relative flex flex-col flex-1 min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,#111,transparent)]">
          <div className="max-w-[1600px] mx-auto h-full min-h-0">
            <Routes>
              {viewConfig.map((config) => (
                <Route key={config.path} path={config.path} element={config.element} />
              ))}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
        <MonetizationOverlay />
        <Link 
          to="/modules"
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] group"
          title="Open AI Nexus"
        >
          <Grid size={20} className="group-hover:animate-spin-slow" />
        </Link>
      </div>
    </div>
  );
};

const AI_MODULES = [
  "https://admin08077-openapi.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-ai-ban-king-demo.static.hf.space",
  "https://admin08077-1233.static.hf.space",
  "https://admin08077-inventions.static.hf.space",
  "https://admin08077-gemini-app-citibank-demo-business-inc-google.static.hf.space",
  "https://admin08077-aibankdemo2.static.hf.space",
  "https://admin08077-airenderer.static.hf.space",
  "https://admin08077-book.static.hf.space",
  "https://admin08077-merrychristmas.static.hf.space",
  "https://admin08077-apiai.static.hf.space",
  "https://admin08077-projectatlas.static.hf.space",
  "https://admin08077-jocall3.static.hf.space",
  "https://admin08077-demob.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-static.static.hf.space",
  "https://admin08077-demoo.static.hf.space",
  "https://admin08077-webgenai.static.hf.space",
  "https://admin08077-aiab.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-app.static.hf.space",
  "https://admin08077-aib8nking.static.hf.space",
  "https://admin08077-bb.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-apps.static.hf.space",
  "https://admin08077-newwa.static.hf.space",
  "https://admin08077-jamesocallaghanprivatebank.hf.space",
  "https://admin08077-drip-faucet.static.hf.space",
  "https://admin08077-transactpro.hf.space",
  "https://admin08077-quantumbank.hf.space",
  "https://admin08077-test.hf.space"
];

const getModuleTitle = (url: string) => {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    // Remove .hf.space or .static.hf.space
    hostname = hostname.replace('.static.hf.space', '').replace('.hf.space', '');
    // Remove admin08077- prefix
    hostname = hostname.replace(/^admin\d+-/, '');
    // Replace hyphens with spaces
    const title = hostname.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return title || 'AI Module';
  } catch (e) {
    return 'AI Module';
  }
};

const AIModuleCard = ({ url, className }: { url: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const title = getModuleTitle(url);

  return (
    <div className={`flex flex-col w-full bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 group ${className || 'h-[500px]'}`}>
      <div className="px-4 py-3 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-sm font-mono font-bold text-gray-300 group-hover:text-cyan-400 transition-colors truncate max-w-[300px]">
            {title}
          </span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-white transition-colors">
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="relative flex-1 bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/20 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title={title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

const ExternalIframeCollection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % AI_MODULES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + AI_MODULES.length) % AI_MODULES.length);
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} transition-all duration-300 border-r border-gray-800 bg-gray-950 flex flex-col fixed md:relative z-20 h-full`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="font-mono font-bold text-gray-200 tracking-wider">MODULES</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white">
            <ArrowLeft size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {AI_MODULES.map((url, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-mono transition-all duration-200 flex items-center gap-3 ${
                activeIndex === index
                  ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300 border border-transparent'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeIndex === index ? 'bg-cyan-400 animate-pulse' : 'bg-gray-700'}`} />
              <span className="truncate">{getModuleTitle(url)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative">
        {/* Top Bar */}
        <div className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Terminal size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <div className="p-1.5 rounded-md bg-gray-900 group-hover:bg-gray-800 border border-gray-800 group-hover:border-gray-700">
                <ArrowLeft size={14} />
              </div>
              <span className="text-xs font-mono tracking-widest">RETURN TO OS</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-mono text-gray-400">
               MODULE {activeIndex + 1} / {AI_MODULES.length}
             </div>
          </div>
        </div>

        {/* Card Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center overflow-hidden relative">
           {/* Navigation Buttons (Desktop) */}
           <button 
             onClick={handlePrev}
             className="absolute left-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           </button>

           <button 
             onClick={handleNext}
             className="absolute right-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="rotate-180 group-hover:translate-x-1 transition-transform" />
           </button>

           {/* The Card */}
           <div className="w-full h-full max-w-[1400px] relative flex flex-col">
             <div className="flex-1 relative animate-in fade-in zoom-in-95 duration-500">
               <AIModuleCard 
                 key={activeIndex} 
                 url={AI_MODULES[activeIndex]} 
                 className="h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-gray-800" 
               />
             </div>
             
             {/* Mobile Nav */}
             <div className="flex md:hidden items-center justify-between mt-4 gap-4">
               <button onClick={handlePrev} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Prev</button>
               <button onClick={handleNext} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Next</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const theme = createTheme({ palette: { mode: 'dark' } });

function App() {
  return (
    <Auth0Provider
      domain="aibankinguniversity.us.auth0.com"
      clientId="fOkKYLJUrLnv7hInn8CVi3cHpjF7xPRp"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <AuthProvider>
        <DataProvider>
          <MoneyMovementProvider>
            <StripeDataProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/modules" element={<ExternalIframeCollection />} />
                    <Route path="*" element={<SAppLayout />} />
                  </Routes>
                </Router>
              </ThemeProvider>
            </StripeDataProvider>
          </MoneyMovementProvider>
        </DataProvider>
      </AuthProvider>
      <Analytics />
    </Auth0Provider>
  );
}

export default App;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/src/App.tsx
================================================================================

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Cpu, ShieldAlert, Sparkles, Terminal, ArrowLeft, ExternalLink, Grid } from 'lucide-react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { datadogLogs } from '@datadog/browser-logs';
import { Analytics } from '@vercel/analytics/react';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider, DataContext } from './context/DataContext';
import { StripeDataProvider } from './components/StripeDataProvider';
import { MoneyMovementProvider } from './components/MoneyMovementContext';

// Layout & Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SApp from './components/SApp';
import { View } from './types';

// Views & Components
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import BudgetsView from './components/BudgetsView';
import FinancialGoalsView from './components/FinancialGoalsView';
import CreditHealthView from './components/CreditHealthView';
import PersonalizationView from './components/PersonalizationView';
import AccountsView from './components/AccountsView';
import InvestmentsView from './components/InvestmentsView';
import CryptoView from './components/CryptoView';
import AlgoTradingLab from './components/AlgoTradingLab';
import ForexArena from './components/ForexArena';
import CommoditiesExchange from './components/CommoditiesExchange';
import RealEstateEmpire from './components/RealEstateEmpire';
import ArtCollectibles from './components/ArtCollectibles';
import DerivativesDesk from './components/DerivativesDesk';
import VentureCapitalDesk from './components/VentureCapitalDesk';
import PrivateEquityLounge from './components/PrivateEquityLounge';
import TaxOptimizationChamber from './components/TaxOptimizationChamber';
import LegacyBuilder from './components/LegacyBuilder';
import CorporateCommandView from './components/CorporateCommandView';
import ModernTreasuryView from './components/ModernTreasuryView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import QuantumWeaverView from './components/QuantumWeaverView';
import AgentMarketplaceView from './components/MarketplaceView';
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import ConciergeService from './components/ConciergeService';
import SovereignWealth from './components/SovereignWealth';
import PhilanthropyHub from './components/PhilanthropyHub';
import TheVisionView from './components/TheVisionView';
import AIAdvisorView from './components/AIAdvisorView';
import { AIInsights } from './components/AIInsights';
import SecurityView from './components/SecurityView';
import ComplianceOracleView from './components/ComplianceOracleView';
import GlobalPositionMap from './components/GlobalPositionMap';
import GlobalSsiHubView from './components/GlobalSsiHubView';
import CustomerDashboard from './components/CustomerDashboard';
import VerificationReportsView from './components/VerificationReportsView';
import FinancialReportingView from './components/FinancialReportingView';
import StripeNexusDashboard from './components/StripeNexusDashboard';
import TheBookView from './components/TheBookView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import VoiceControl from './components/VoiceControl';
import LandingPage from './components/LandingPage';
import QuantumAssets from './components/QuantumAssets';
import CitibankAccountsView from './components/CitibankAccountsView';
import CitibankAccountProxyView from './components/CitibankAccountProxyView';
import CitibankBillPayView from './components/CitibankBillPayView';
import CitibankCrossBorderView from './components/CitibankCrossBorderView';
import CitibankPayeeManagementView from './components/CitibankPayeeManagementView';
import CitibankStandingInstructionsView from './components/CitibankStandingInstructionsView';
import CitibankDeveloperToolsView from './components/CitibankDeveloperToolsView';
import CitibankEligibilityView from './components/CitibankEligibilityView';
import CitibankUnmaskedDataView from './components/CitibankUnmaskedDataView';
import PlaidIdentityView from './components/PlaidIdentityView';
import PlaidCRAMonitoringView from './components/PlaidCRAMonitoringView';
import { PlaidInstitutionsExplorer } from './components/PlaidInstitutionsExplorer';
import { PlaidItemManagementView } from './components/PlaidItemManagementView';
import PlaidMainDashboard from './components/PlaidMainDashboard';
import StripeNexusView from './components/StripeNexusView';
import CounterpartyDashboardView from './components/CounterpartyDashboardView';
import VirtualAccountsDashboard from './components/VirtualAccountsDashboard';
import CorporateActionsNexusView from './components/CorporateActionsNexusView';
import { CreditNoteLedger } from './components/CreditNoteLedger';
import ReconciliationHubView from './components/ReconciliationHubView';
import GEINDashboard from './components/GEIN_DashboardView';
import CardholderManagement from './components/CardholderManagement';
import UniversalObjectInspector from './components/UniversalObjectInspector';
import { LoginView } from './components/LoginView';
import { PlaidClient } from './lib/plaidClient';
import DeveloperHubView from './components/DeveloperHubView';
import ApiPlaygroundView from './components/ApiPlaygroundView';

// --- ALL COMPONENT IMPORTS FOR DIRECT ACCESS ---
import AccountDetails from './components/AccountDetails';
import AccountList from './components/AccountList';
import AccountStatementGrid from './components/AccountStatementGrid';
import { AccountVerificationModal } from './components/AccountVerificationModal';
import ACHDetailsDisplay from './components/ACHDetailsDisplay';
import AICommandLog from './components/AICommandLog';
import AIPredictionWidget from './components/AIPredictionWidget';
import AssetCatalog from './components/AssetCatalog';
import AutomatedSweepRules from './components/AutomatedSweepRules';
import BalanceReportChart from './components/BalanceReportChart';
import BalanceTransactionTable from './components/BalanceTransactionTable';
import CardDesignVisualizer from './components/CardDesignVisualizer';
import { ChargeDetailModal } from './components/ChargeDetailModal';
import ChargeList from './components/ChargeList';
import ConductorConfigurationView from './components/ConductorConfigurationView';
import CounterpartyDetails from './components/CounterpartyDetails';
import { CounterpartyForm } from './components/CounterpartyForm';
import DisruptionIndexMeter from './components/DisruptionIndexMeter';
import DocumentUploader from './components/DocumentUploader';
import { DownloadLink } from './components/DownloadLink';
import EarlyFraudWarningFeed from './components/EarlyFraudWarningFeed';
import ElectionChoiceForm from './components/ElectionChoiceForm';
import EventNotificationCard from './components/EventNotificationCard';
import ExpectedPaymentsTable from './components/ExpectedPaymentsTable';
import ExternalAccountCard from './components/ExternalAccountCard';
import ExternalAccountForm from './components/ExternalAccountForm';
import ExternalAccountTable from './components/ExternalAccountsTable';
import { FinancialAccountCard } from './components/FinancialAccountCard';
import IncomingPaymentDetailList from './components/IncomingPaymentDetailList';
import { InvestmentForm } from './components/InvestmentForm';
import InvoiceFinancingRequest from './components/InvoiceFinancingRequest';
import PaymentInitiationForm from './components/PaymentInitiationForm';
import PaymentMethodDetails from './components/PaymentMethodDetails';
import PaymentOrderForm from './components/PaymentOrderForm';
import PayoutsDashboard from './components/PayoutsDashboard';
import PnLChart from './components/PnLChart';
import RefundForm from './components/RefundForm';
import RemittanceInfoEditor from './components/RemittanceInfoEditor';
import ReportingView from './components/ReportingView';
import { ReportRunGenerator } from './components/ReportRunGenerator';
import ReportStatusIndicator from './components/ReportStatusIndicator';
import ResourceGraphView from './components/ResourceGraphView';
import SchemaExplorer from './components/SchemaExplorer';
import SecurityComplianceView from './components/SecurityComplianceView';
import SsiEditorForm from './components/SsiEditorForm';
import StripeStatusBadge from './components/StripeStatusBadge';
import StructuredPurposeInput from './components/StructuredPurposeInput';
import SubscriptionList from './components/SubscriptionList';
import TimeSeriesChart from './components/TimeSeriesChart';
import TradeConfirmationModal from './components/TradeConfirmationModal';
import TransactionFilter from './components/TransactionFilter';
import TransactionList from './components/TransactionList';
import { TreasuryTransactionList } from './components/TreasuryTransactionList';
import TreasuryView from './components/TreasuryView';
import VentureCapitalDeskView from './components/VentureCapitalDeskView';
import VirtualAccountForm from './components/VirtualAccountForm';
import VirtualAccountsTable from './components/VirtualAccountsTable';
import WebhookSimulator from './components/WebhookSimulator';

// --- FIXED Wrapper Components ---
type WrapperProps = {
  Component: React.FC<any>;
  props?: any;
};

const Wrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  return <Component {...props} />;
};

const ModalWrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Component
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      {...props}
    />
  );
};

const DataContextWrapper: React.FC<{ Component: React.FC<any>; extraProps?: any }> = ({ Component, extraProps = {} }) => {
  const dataContext = useContext(DataContext);
  const mockContext = {
    setActiveView: () => {},
    impactData: { treesPlanted: 0, progressToNextTree: 0 },
  };
  const props = { ...(dataContext || mockContext), ...extraProps };
  return <Component {...props} />;
};

const AIIntentStub: React.FC<{ view: View }> = ({ view }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in duration-700 bg-gray-950/50 rounded-3xl border border-gray-800">
      <div className="w-24 h-24 bg-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        <Sparkles className="text-cyan-400 w-12 h-12 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-mono">
          Module Ingress: {String(view).replace(/-/g, '_').toUpperCase()}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed font-mono">
          The Sovereign AI Core is compiling the high-frequency logic for this specific subsystem. Targeting zero-latency node deployment in the next epoch.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
          <Terminal size={14} /> STATUS: COMPILING_INTENT
        </div>
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
          <ShieldAlert size={14} /> AUTH: VERIFIED
        </div>
      </div>
    </div>
  );
};

const MonetizationOverlay = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { sovereignCredits } = context;
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sovereign Balance:</span>
      <span className="text-cyan-400 font-mono text-lg font-bold tracking-tighter">
        {sovereignCredits.toLocaleString()} SC
      </span>
    </div>
  );
};

const Logout = () => {
  const { logout } = useAuth0();
  useEffect(() => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout]);
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black text-cyan-400 font-mono">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span>TERMINATING SESSION...</span>
      </div>
    </div>
  );
};

const SAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    datadogLogs.logger.info('App View Loaded', { name: 'SovereignNexus', id: 'init_view' });
  }, []);

  // Define Route Configuration to map Views to Paths and Components
  const viewConfig = useMemo(() => [
    { view: View.Dashboard, path: '/dashboard', element: <Dashboard /> },
    { view: View.Transactions, path: '/transactions', element: <TransactionsView /> },
    { view: View.SendMoney, path: '/send-money', element: <SendMoneyView /> },
    { view: View.Budgets, path: '/budgets', element: <BudgetsView /> },
    { view: View.FinancialGoals, path: '/financial-goals', element: <FinancialGoalsView /> },
    { view: View.CreditHealth, path: '/credit-health', element: <CreditHealthView /> },
    { view: View.Personalization, path: '/personalization', element: <PersonalizationView /> },
    { view: View.Accounts, path: '/accounts', element: <AccountsView /> },
    { view: View.Investments, path: '/investments', element: <InvestmentsView /> },
    { view: View.CryptoWeb3, path: '/crypto', element: <CryptoView /> },
    { view: View.AlgoTradingLab, path: '/algo-trading', element: <AlgoTradingLab /> },
    { view: View.ForexArena, path: '/forex', element: <ForexArena /> },
    { view: View.CommoditiesExchange, path: '/commodities', element: <CommoditiesExchange /> },
    { view: View.RealEstateEmpire, path: '/real-estate', element: <RealEstateEmpire /> },
    { view: View.ArtCollectibles, path: '/art-collectibles', element: <ArtCollectibles /> },
    { view: View.DerivativesDesk, path: '/derivatives', element: <DerivativesDesk /> },
    { view: View.VentureCapital, path: '/venture-capital', element: <VentureCapitalDesk /> },
    { view: View.PrivateEquity, path: '/private-equity', element: <PrivateEquityLounge /> },
    { view: View.TaxOptimization, path: '/tax-optimization', element: <TaxOptimizationChamber /> },
    { view: View.LegacyBuilder, path: '/legacy-builder', element: <LegacyBuilder /> },
    { view: View.CorporateCommand, path: '/corporate-command', element: <CorporateCommandView setActiveView={dataContext?.setActiveView} /> },
    { view: View.ModernTreasury, path: '/modern-treasury', element: <ModernTreasuryView /> },
    { view: View.OpenBanking, path: '/open-banking', element: <OpenBankingView /> },
    { view: View.FinancialDemocracy, path: '/financial-democracy', element: <FinancialDemocracyView /> },
    { view: View.AIAdStudio, path: '/ai-ad-studio', element: <AIAdStudioView /> },
    { view: View.QuantumWeaver, path: '/quantum-weaver', element: <QuantumWeaverView /> },
    { view: View.AgentMarketplace, path: '/agent-marketplace', element: <AgentMarketplaceView /> },
    { view: View.APIStatus, path: '/api-status', element: <APIIntegrationView /> },
    { view: View.Settings, path: '/settings', element: <SettingsView /> },
    { view: View.QuantumAssets, path: '/quantum-assets', element: <QuantumAssets /> },
    { view: View.SovereignWealth, path: '/sovereign-wealth', element: <SovereignWealth /> },
    { view: View.Philanthropy, path: '/philanthropy', element: <PhilanthropyHub /> },
    { view: View.TheVision, path: '/vision', element: <TheVisionView /> },
    { view: View.AIAdvisor, path: '/ai-advisor', element: <AIAdvisorView /> },
    { view: View.AIInsights, path: '/ai-insights', element: <AIInsights /> },
    { view: View.SecurityCenter, path: '/security', element: <SecurityView /> },
    { view: View.ComplianceOracle, path: '/compliance', element: <ComplianceOracleView /> },
    { view: View.GlobalPositionMap, path: '/global-map', element: <GlobalPositionMap /> },
    { view: View.GlobalSsiHub, path: '/ssi-hub', element: <GlobalSsiHubView /> },
    { view: View.CustomerDashboard, path: '/customer-dashboard', element: <CustomerDashboard /> },
    { view: View.VerificationReports, path: '/verification-reports', element: <VerificationReportsView customerId="c1" /> },
    { view: View.FinancialReporting, path: '/financial-reporting', element: <FinancialReportingView /> },
    { view: View.StripeNexusDashboard, path: '/stripe-nexus-dashboard', element: <StripeNexusDashboard /> },
    { view: View.TheBook, path: '/the-book', element: <TheBookView /> },
    { view: View.KnowledgeBase, path: '/knowledge-base', element: <KnowledgeBaseView /> },
    { view: View.CitibankAccounts, path: '/citi-accounts', element: <CitibankAccountsView /> },
    { view: View.CitibankAccountProxy, path: '/citi-proxy', element: <CitibankAccountProxyView /> },
    { view: View.CitibankBillPay, path: '/citi-bill-pay', element: <CitibankBillPayView /> },
    { view: View.CitibankCrossBorder, path: '/citi-cross-border', element: <CitibankCrossBorderView /> },
    { view: View.CitibankPayeeManagement, path: '/citi-payee', element: <CitibankPayeeManagementView /> },
    { view: View.CitibankStandingInstructions, path: '/citi-standing-instructions', element: <CitibankStandingInstructionsView /> },
    { view: View.CitibankDeveloperTools, path: '/citi-dev-tools', element: <CitibankDeveloperToolsView /> },
    { view: View.CitibankEligibility, path: '/citi-eligibility', element: <CitibankEligibilityView /> },
    { view: View.CitibankUnmaskedData, path: '/citi-unmasked', element: <CitibankUnmaskedDataView accountIdsToUnmask={['acc_1']} /> },
    { view: View.PlaidMainDashboard, path: '/plaid-dashboard', element: <PlaidMainDashboard /> },
    { view: View.PlaidIdentity, path: '/plaid-identity', element: <PlaidIdentityView /> },
    { view: View.PlaidCRAMonitoring, path: '/plaid-cra', element: <PlaidCRAMonitoringView /> },
    { view: View.PlaidInstitutions, path: '/plaid-institutions', element: <PlaidInstitutionsExplorer client={new PlaidClient()} /> },
    { view: View.PlaidItemManagement, path: '/plaid-items', element: <PlaidItemManagementView accessToken="mock_token" /> },
    { view: View.StripeNexus, path: '/stripe-nexus', element: <StripeNexusView /> },
    { view: View.CounterpartyDashboard, path: '/counterparty-dashboard', element: <CounterpartyDashboardView /> },
    { view: View.VirtualAccounts, path: '/virtual-accounts', element: <VirtualAccountsDashboard /> },
    { view: View.SApp, path: '/sapp', element: <SApp /> }, // Fixed Typo: SAPP -> SApp
    { view: View.CorporateActions, path: '/corporate-actions', element: <CorporateActionsNexusView /> },
    { view: View.CreditNoteLedger, path: '/credit-note-ledger', element: <CreditNoteLedger /> },
    { view: View.ReconciliationHub, path: '/reconciliation', element: <ReconciliationHubView /> },
    { view: View.GEINDashboard, path: '/gein-dashboard', element: <GEINDashboard /> },
    { view: View.CardholderManagement, path: '/cardholder-management', element: <CardholderManagement /> },
    { view: View.SecurityCompliance, path: '/security-compliance', element: <SecurityComplianceView /> },
    { view: View.DeveloperHub, path: '/developer-hub', element: <DeveloperHubView /> },
    { view: View.SchemaExplorer, path: '/schema-explorer', element: <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} /> },
    { view: View.ResourceGraph, path: '/resource-graph', element: <ResourceGraphView /> },
    { view: View.ApiPlayground, path: '/api-playground', element: <ApiPlaygroundView /> },
    { view: View.VentureCapitalDeskView, path: '/vc-desk-view', element: <VentureCapitalDeskView /> },
    
    // Direct Component Access
    { view: View.AccountDetails, path: '/comp/account-details', element: <Wrapper Component={AccountDetails} props={{ accountId: '1', customerId: 'c1' }} /> },
    { view: View.AccountList, path: '/comp/account-list', element: <Wrapper Component={AccountList} props={{ accounts: [] }} /> },
    { view: View.AccountStatementGrid, path: '/comp/account-statement', element: <Wrapper Component={AccountStatementGrid} props={{ statementLines: [] }} /> },
    { view: View.AccountVerificationModal, path: '/comp/account-verification', element: <ModalWrapper Component={AccountVerificationModal} props={{ externalAccount: {id: '1', verification_status: 'unverified' }, onSuccess: () => {}}} /> },
    { view: View.ACHDetailsDisplay, path: '/comp/ach-details', element: <Wrapper Component={ACHDetailsDisplay} props={{ details: { routingNumber: '123', realAccountNumber: '456' } }} /> },
    { view: View.AICommandLog, path: '/comp/ai-command-log', element: <AICommandLog /> },
    { view: View.AIPredictionWidget, path: '/comp/ai-prediction', element: <AIPredictionWidget /> },
    { view: View.AssetCatalog, path: '/comp/asset-catalog', element: <Wrapper Component={AssetCatalog} props={{ assets: [], onAssetSelected: () => {}, getAssetDetails: async () => ({}) }} /> },
    { view: View.AutomatedSweepRules, path: '/comp/sweep-rules', element: <AutomatedSweepRules /> },
    { view: View.BalanceReportChart, path: '/comp/balance-chart', element: <Wrapper Component={BalanceReportChart} props={{ data: [] }} /> },
    { view: View.BalanceTransactionTable, path: '/comp/balance-table', element: <Wrapper Component={BalanceTransactionTable} props={{ balanceTransactions: [] }} /> },
    { view: View.CardDesignVisualizer, path: '/comp/card-design', element: <Wrapper Component={CardDesignVisualizer} props={{ design: { id: 'd_1', physical_bundle: { features: {} } } }} /> },
    { view: View.ChargeDetailModal, path: '/comp/charge-detail', element: <ModalWrapper Component={ChargeDetailModal} props={{ charge: {id: 'ch_1', amount: 50000, currency: 'USD', status: 'succeeded'}, onClose: () => {}}} /> },
    { view: View.ChargeList, path: '/comp/charge-list', element: <ChargeList /> },
    { view: View.ConductorConfigurationView, path: '/comp/conductor-config', element: <ConductorConfigurationView /> },
    { view: View.CounterpartyDetails, path: '/comp/counterparty-details', element: <Wrapper Component={CounterpartyDetails} props={{ counterpartyId: 'cp_1' }} /> },
    { view: View.CounterpartyForm, path: '/comp/counterparty-form', element: <Wrapper Component={CounterpartyForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.DisruptionIndexMeter, path: '/comp/disruption-meter', element: <Wrapper Component={DisruptionIndexMeter} props={{ indexValue: 50 }} /> },
    { view: View.DocumentUploader, path: '/comp/document-uploader', element: <Wrapper Component={DocumentUploader} props={{ documentableType: 'test', documentableId: '1' }} /> },
    { view: View.DownloadLink, path: '/comp/download-link', element: <Wrapper Component={DownloadLink} props={{ url: '#', filename: 'test.pdf' }} /> },
    { view: View.EarlyFraudWarningFeed, path: '/comp/fraud-feed', element: <EarlyFraudWarningFeed /> },
    { view: View.ElectionChoiceForm, path: '/comp/election-form', element: <Wrapper Component={ElectionChoiceForm} props={{ availableChoices: {}, onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.EventNotificationCard, path: '/comp/event-card', element: <Wrapper Component={EventNotificationCard} props={{ event: {} }} /> },
    { view: View.ExpectedPaymentsTable, path: '/comp/expected-payments', element: <ExpectedPaymentsTable /> },
    { view: View.ExternalAccountCard, path: '/comp/external-account-card', element: <Wrapper Component={ExternalAccountCard} props={{ account: {id: '1', account_details: [], routing_details: []}}} /> },
    { view: View.ExternalAccountForm, path: '/comp/external-account-form', element: <Wrapper Component={ExternalAccountForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.ExternalAccountsTable, path: '/comp/external-accounts-table', element: <Wrapper Component={ExternalAccountTable} props={{ accounts: [] }} /> },
    { view: View.FinancialAccountCard, path: '/comp/financial-account-card', element: <Wrapper Component={FinancialAccountCard} props={{ financialAccount: {id: 'fa_1', balance: { cash: {}}, supported_currencies: []}}} /> },
    { view: View.IncomingPaymentDetailList, path: '/comp/incoming-payments', element: <IncomingPaymentDetailList /> },
    { view: View.InvoiceFinancingRequest, path: '/comp/invoice-financing', element: <Wrapper Component={InvoiceFinancingRequest} props={{ onSubmit: () => {} }} /> },
    { view: View.PaymentInitiationForm, path: '/comp/payment-initiation', element: <PaymentInitiationForm /> },
    { view: View.PaymentMethodDetails, path: '/comp/payment-method', element: <Wrapper Component={PaymentMethodDetails} props={{ details: { type: 'card', card: {} }}} /> },
    { view: View.PaymentOrderForm, path: '/comp/payment-order', element: <Wrapper Component={PaymentOrderForm} props={{ internalAccounts: [], externalAccounts: [], onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.PayoutsDashboard, path: '/comp/payouts', element: <PayoutsDashboard /> },
    { view: View.PnLChart, path: '/comp/pnl-chart', element: <Wrapper Component={PnLChart} props={{ data: [], algorithmName: 'Test' }} /> },
    { view: View.RefundForm, path: '/comp/refund-form', element: <RefundForm /> },
    { view: View.RemittanceInfoEditor, path: '/comp/remittance-editor', element: <Wrapper Component={RemittanceInfoEditor} props={{ onChange: () => {} }} /> },
    { view: View.ReportingView, path: '/comp/reporting', element: <ReportingView /> },
    { view: View.ReportRunGenerator, path: '/comp/report-generator', element: <ReportRunGenerator /> },
    { view: View.ReportStatusIndicator, path: '/comp/report-status', element: <Wrapper Component={ReportStatusIndicator} props={{ status: 'success' }} /> },
    { view: View.ResourceGraphView, path: '/comp/resource-graph-view', element: <ResourceGraphView /> },
    { view: View.SchemaExplorer, path: '/comp/schema-explorer-view', element: <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} /> },
    { view: View.SecurityComplianceView, path: '/comp/security-compliance-view', element: <SecurityComplianceView /> },
    { view: View.SsiEditorForm, path: '/comp/ssi-editor', element: <Wrapper Component={SsiEditorForm} props={{ onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.StripeStatusBadge, path: '/comp/stripe-badge', element: <Wrapper Component={StripeStatusBadge} props={{ status: 'succeeded', objectType: 'charge' }} /> },
    { view: View.StructuredPurposeInput, path: '/comp/structured-purpose', element: <Wrapper Component={StructuredPurposeInput} props={{ onChange: () => {}, value: null }} /> },
    { view: View.SubscriptionList, path: '/comp/subscription-list', element: <Wrapper Component={SubscriptionList} props={{ subscriptions: [] }} /> },
    { view: View.TimeSeriesChart, path: '/comp/time-series', element: <Wrapper Component={TimeSeriesChart} props={{ data: { labels: [], datasets: [] } }} /> },
    { view: View.TradeConfirmationModal, path: '/comp/trade-confirmation', element: <ModalWrapper Component={TradeConfirmationModal} props={{ settlementInstruction: { messageId: 'NEX-INST-99281-Z', totalAmount: 12500000, currency: 'USD', creationDateTime: Date.now(), settlementDate: '2024-12-15', numberOfTransactions: 1, purpose: 'TREA' } }} /> },
    { view: View.TransactionFilter, path: '/comp/transaction-filter', element: <Wrapper Component={TransactionFilter} props={{ onApplyFilters: () => {} }} /> },
    { view: View.TransactionList, path: '/comp/transaction-list', element: <Wrapper Component={TransactionList} props={{ transactions: [] }} /> },
    { view: View.TreasuryTransactionList, path: '/comp/treasury-list', element: <Wrapper Component={TreasuryTransactionList} props={{ transactions: [] }} /> },
    { view: View.TreasuryView, path: '/comp/treasury-view', element: <TreasuryView /> },
    { view: View.UniversalObjectInspector, path: '/comp/object-inspector', element: <Wrapper Component={UniversalObjectInspector} props={{ data: { status: "Nominal", uptime: "99.999%", load: "Balanced" } }} /> },
    { view: View.VirtualAccountForm, path: '/comp/virtual-account-form', element: <Wrapper Component={VirtualAccountForm} props={{ onSubmit: () => {}, isSubmitting: false }} /> },
    { view: View.VirtualAccountsTable, path: '/comp/virtual-accounts-table', element: <Wrapper Component={VirtualAccountsTable} props={{ onEdit: () => {}, onDelete: () => {} }} /> },
    { view: View.VoiceControl, path: '/comp/voice-control', element: <DataContextWrapper Component={VoiceControl} /> },
    { view: View.WebhookSimulator, path: '/comp/webhook-simulator', element: <Wrapper Component={WebhookSimulator} props={{ stripeAccountId: 'acct_mock' }} /> },
  ], [dataContext?.setActiveView]);

  if (!dataContext || !authContext) return null;
  const { isAuthenticated, isLoading: authLoading } = authContext;
  const { isLoading: dataLoading, activeView, setActiveView } = dataContext;

  // Sync URL to State (Deep Linking)
  useEffect(() => {
    const currentPath = location.pathname;
    const config = viewConfig.find(c => c.path === currentPath);
    if (config && activeView !== config.view) {
      setActiveView(config.view);
    } else if (!config && currentPath !== '/') {
      // Fallback for unknown routes inside SAppLayout
      // Optional: Redirect to dashboard or handle 404
    }
  }, [location.pathname, viewConfig, activeView, setActiveView]);

  // Sync State to URL (Sidebar Navigation)
  useEffect(() => {
    const config = viewConfig.find(c => c.view === activeView);
    if (config && location.pathname !== config.path) {
      navigate(config.path);
    }
  }, [activeView, viewConfig, navigate, location.pathname]);

  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-6">
        <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />
        <h1 className="text-3xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase font-mono">
          Nexus OS // Syncing
        </h1>
        <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-progress-flow"></div>
        </div>
        <style>{`
          @keyframes flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          .animate-progress-flow { animation: flow 2s linear infinite; width: 50%; }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="relative flex flex-col flex-1 min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,#111,transparent)]">
          <div className="max-w-[1600px] mx-auto h-full min-h-0">
            <Routes>
              {viewConfig.map((config) => (
                <Route key={config.path} path={config.path} element={config.element} />
              ))}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
        <MonetizationOverlay />
        <Link 
          to="/modules"
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] group"
          title="Open AI Nexus"
        >
          <Grid size={20} className="group-hover:animate-spin-slow" />
        </Link>
      </div>
    </div>
  );
};

const AI_MODULES = [
  "https://admin08077-openapi.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-ai-ban-king-demo.static.hf.space",
  "https://admin08077-1233.static.hf.space",
  "https://admin08077-inventions.static.hf.space",
  "https://admin08077-gemini-app-citibank-demo-business-inc-google.static.hf.space",
  "https://admin08077-aibankdemo2.static.hf.space",
  "https://admin08077-airenderer.static.hf.space",
  "https://admin08077-book.static.hf.space",
  "https://admin08077-merrychristmas.static.hf.space",
  "https://admin08077-apiai.static.hf.space",
  "https://admin08077-projectatlas.static.hf.space",
  "https://admin08077-jocall3.static.hf.space",
  "https://admin08077-demob.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-static.static.hf.space",
  "https://admin08077-demoo.static.hf.space",
  "https://admin08077-webgenai.static.hf.space",
  "https://admin08077-aiab.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-app.static.hf.space",
  "https://admin08077-aib8nking.static.hf.space",
  "https://admin08077-bb.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-apps.static.hf.space",
  "https://admin08077-newwa.static.hf.space",
  "https://admin08077-jamesocallaghanprivatebank.hf.space",
  "https://admin08077-drip-faucet.static.hf.space",
  "https://admin08077-transactpro.hf.space",
  "https://admin08077-quantumbank.hf.space",
  "https://admin08077-test.hf.space"
];

const getModuleTitle = (url: string) => {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    // Remove .hf.space or .static.hf.space
    hostname = hostname.replace('.static.hf.space', '').replace('.hf.space', '');
    // Remove admin08077- prefix
    hostname = hostname.replace(/^admin\d+-/, '');
    // Replace hyphens with spaces
    const title = hostname.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return title || 'AI Module';
  } catch (e) {
    return 'AI Module';
  }
};

const AIModuleCard = ({ url, className }: { url: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const title = getModuleTitle(url);

  return (
    <div className={`flex flex-col w-full bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 group ${className || 'h-[500px]'}`}>
      <div className="px-4 py-3 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-sm font-mono font-bold text-gray-300 group-hover:text-cyan-400 transition-colors truncate max-w-[300px]">
            {title}
          </span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-white transition-colors">
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="relative flex-1 bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/20 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title={title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

const ExternalIframeCollection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % AI_MODULES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + AI_MODULES.length) % AI_MODULES.length);
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} transition-all duration-300 border-r border-gray-800 bg-gray-950 flex flex-col fixed md:relative z-20 h-full`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="font-mono font-bold text-gray-200 tracking-wider">MODULES</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white">
            <ArrowLeft size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {AI_MODULES.map((url, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-mono transition-all duration-200 flex items-center gap-3 ${
                activeIndex === index
                  ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300 border border-transparent'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeIndex === index ? 'bg-cyan-400 animate-pulse' : 'bg-gray-700'}`} />
              <span className="truncate">{getModuleTitle(url)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative">
        {/* Top Bar */}
        <div className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Terminal size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <div className="p-1.5 rounded-md bg-gray-900 group-hover:bg-gray-800 border border-gray-800 group-hover:border-gray-700">
                <ArrowLeft size={14} />
              </div>
              <span className="text-xs font-mono tracking-widest">RETURN TO OS</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-mono text-gray-400">
               MODULE {activeIndex + 1} / {AI_MODULES.length}
             </div>
          </div>
        </div>

        {/* Card Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center overflow-hidden relative">
           {/* Navigation Buttons (Desktop) */}
           <button 
             onClick={handlePrev}
             className="absolute left-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           </button>

           <button 
             onClick={handleNext}
             className="absolute right-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="rotate-180 group-hover:translate-x-1 transition-transform" />
           </button>

           {/* The Card */}
           <div className="w-full h-full max-w-[1400px] relative flex flex-col">
             <div className="flex-1 relative animate-in fade-in zoom-in-95 duration-500">
               <AIModuleCard 
                 key={activeIndex} 
                 url={AI_MODULES[activeIndex]} 
                 className="h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-gray-800" 
               />
             </div>
             
             {/* Mobile Nav */}
             <div className="flex md:hidden items-center justify-between mt-4 gap-4">
               <button onClick={handlePrev} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Prev</button>
               <button onClick={handleNext} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Next</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const theme = createTheme({ palette: { mode: 'dark' } });

function App() {
  return (
    <Auth0Provider
      domain="aibankinguniversity.us.auth0.com"
      clientId="fOkKYLJUrLnv7hInn8CVi3cHpjF7xPRp"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <AuthProvider>
        <DataProvider>
          <MoneyMovementProvider>
            <StripeDataProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/modules" element={<ExternalIframeCollection />} />
                    <Route path="*" element={<SAppLayout />} />
                  </Routes>
                </Router>
              </ThemeProvider>
            </StripeDataProvider>
          </MoneyMovementProvider>
        </DataProvider>
      </AuthProvider>
      <Analytics />
    </Auth0Provider>
  );
}

export default App;

export {
  AuthProvider,
  AuthContext,
  DataProvider,
  DataContext,
  StripeDataProvider,
  MoneyMovementProvider,
  Sidebar,
  Header,
  SApp,
  View,
  Dashboard,
  TransactionsView,
  SendMoneyView,
  BudgetsView,
  FinancialGoalsView,
  CreditHealthView,
  PersonalizationView,
  AccountsView,
  InvestmentsView,
  CryptoView,
  AlgoTradingLab,
  ForexArena,
  CommoditiesExchange,
  RealEstateEmpire,
  ArtCollectibles,
  DerivativesDesk,
  VentureCapitalDesk,
  PrivateEquityLounge,
  TaxOptimizationChamber,
  LegacyBuilder,
  CorporateCommandView,
  ModernTreasuryView,
  OpenBankingView,
  FinancialDemocracyView,
  AIAdStudioView,
  QuantumWeaverView,
  AgentMarketplaceView,
  APIIntegrationView,
  SettingsView,
  PlaidDashboardView,
  StripeDashboardView,
  MarqetaDashboardView,
  SSOView,
  ConciergeService,
  SovereignWealth,
  PhilanthropyHub,
  TheVisionView,
  AIAdvisorView,
  AIInsights,
  SecurityView,
  ComplianceOracleView,
  GlobalPositionMap,
  GlobalSsiHubView,
  CustomerDashboard,
  VerificationReportsView,
  FinancialReportingView,
  StripeNexusDashboard,
  TheBookView,
  KnowledgeBaseView,
  VoiceControl,
  LandingPage,
  QuantumAssets,
  CitibankAccountsView,
  CitibankAccountProxyView,
  CitibankBillPayView,
  CitibankCrossBorderView,
  CitibankPayeeManagementView,
  CitibankStandingInstructionsView,
  CitibankDeveloperToolsView,
  CitibankEligibilityView,
  CitibankUnmaskedDataView,
  PlaidIdentityView,
  PlaidCRAMonitoringView,
  PlaidInstitutionsExplorer,
  PlaidItemManagementView,
  PlaidMainDashboard,
  StripeNexusView,
  CounterpartyDashboardView,
  VirtualAccountsDashboard,
  CorporateActionsNexusView,
  CreditNoteLedger,
  ReconciliationHubView,
  GEINDashboard,
  CardholderManagement,
  UniversalObjectInspector,
  LoginView,
  PlaidClient,
  DeveloperHubView,
  ApiPlaygroundView,
  AccountDetails,
  AccountList,
  AccountStatementGrid,
  AccountVerificationModal,
  ACHDetailsDisplay,
  AICommandLog,
  AIPredictionWidget,
  AssetCatalog,
  AutomatedSweepRules,
  BalanceReportChart,
  BalanceTransactionTable,
  CardDesignVisualizer,
  ChargeDetailModal,
  ChargeList,
  ConductorConfigurationView,
  CounterpartyDetails,
  CounterpartyForm,
  DisruptionIndexMeter,
  DocumentUploader,
  DownloadLink,
  EarlyFraudWarningFeed,
  ElectionChoiceForm,
  EventNotificationCard,
  ExpectedPaymentsTable,
  ExternalAccountCard,
  ExternalAccountForm,
  ExternalAccountTable,
  FinancialAccountCard,
  IncomingPaymentDetailList,
  InvestmentForm,
  InvoiceFinancingRequest,
  PaymentInitiationForm,
  PaymentMethodDetails,
  PaymentOrderForm,
  PayoutsDashboard,
  PnLChart,
  RefundForm,
  RemittanceInfoEditor,
  ReportingView,
  ReportRunGenerator,
  ReportStatusIndicator,
  ResourceGraphView,
  SchemaExplorer,
  SecurityComplianceView,
  SsiEditorForm,
  StripeStatusBadge,
  StructuredPurposeInput,
  SubscriptionList,
  TimeSeriesChart,
  TradeConfirmationModal,
  TransactionFilter,
  TransactionList,
  TreasuryTransactionList,
  TreasuryView,
  VentureCapitalDeskView,
  VirtualAccountForm,
  VirtualAccountsTable,
  WebhookSimulator
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/gameover | ORIGINAL PATH: diplomat-bit-gameover-da1da3c/src/App.tsx
================================================================================

import React from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  ShieldCheck, 
  Cpu, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Bell,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Database,
  Send,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import Markdown from 'react-markdown';
import { cn } from './lib/utils';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, MOCK_APIS } from './constants';
import { analyzeFinances, forgeApi } from './services/geminiService';
import accountApiSpec from './data/account_api_spec.json';
import balanceCheckApiSpec from './data/balance_check_api_spec.json';
import transactionDetailsApiSpec from './data/transaction_details_api_spec.json';
import investmentTransactionsApiSpec from './data/investment_transactions_api_spec.json';
import outageMaintenanceApiSpec from './data/outage_maintenance_api_spec.json';
import clearDataApiSpec from './data/clear_data_api_spec.json';
import customerDemographicsApiSpec from './data/customer_demographics_api_spec.json';
import repeatingTerminateApiSpec from './data/repeating_payments_terminate_api_spec.json';
import sepaTransferApiSpec from './data/sepa_transfer_api_spec.json';
import payeeEligibilityApiSpec from './data/payee_eligibility_api_spec.json';
import repeatingInquiryApiSpec from './data/repeating_payments_inquiry_api_spec.json';
import adhocTransfersApiSpec from './data/adhoc_transfers_api_spec.json';
import tokenManagementApiSpec from './data/token_management_api_spec.json';
import clientRegistrationApiSpec from './data/client_registration_api_spec.json';
import { Transaction, Account, ApiDefinition } from './types';

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform duration-200", active ? "" : "group-hover:scale-110")} />
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, className, title, subtitle, action }: { children: React.ReactNode, className?: string, title?: string, subtitle?: string, action?: React.ReactNode }) => (
  <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", className)}>
    {(title || subtitle || action) && (
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          {title && <h3 className="font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);
  const [chatInput, setChatInput] = React.useState('');
  const [apis, setApis] = React.useState<ApiDefinition[]>(MOCK_APIS);
  const [forgingApiId, setForgingApiId] = React.useState<string | null>(null);
  const [forgeResult, setForgeResult] = React.useState<string | null>(null);
  const [forgeResults, setForgeResults] = React.useState<Record<string, string>>({});
  const [activeForgeModel, setActiveForgeModel] = React.useState<string>("Gemini 3.1 Pro");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Simulate processing a folder or multiple files
    const newApis: ApiDefinition[] = Array.from(files).map((file, index) => ({
      id: `uploaded-${Date.now()}-${index}`,
      name: file.name.replace(/\.(json|yaml|yml)$/, ''),
      version: '1.0.0',
      status: 'active',
      endpoints: Math.floor(Math.random() * 20) + 5,
      lastSync: new Date().toLocaleString().slice(0, 16)
    }));

    setApis(prev => [...newApis, ...prev]);
    setActiveTab('forge');
  };

  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setIsAiLoading(true);
    const response = await analyzeFinances(MOCK_TRANSACTIONS, chatInput);
    setAiResponse(response);
    setIsAiLoading(false);
    setChatInput('');
  };

  const handleForge = async (api: ApiDefinition) => {
    setForgingApiId(api.id);
    setActiveTab('forge-result');
    setForgeResults({});
    setForgeResult(null);
    
    let specToForge: any = api;
    if (api.id === 'api-accounts') specToForge = accountApiSpec;
    if (api.id === 'api-balance-check') specToForge = balanceCheckApiSpec;
    if (api.id === 'api-transactions') specToForge = transactionDetailsApiSpec;
    if (api.id === 'api-investments') specToForge = investmentTransactionsApiSpec;
    if (api.id === 'api-outage') specToForge = outageMaintenanceApiSpec;
    if (api.id === 'api-clear-data') specToForge = clearDataApiSpec;
    if (api.id === 'api-demographics') specToForge = customerDemographicsApiSpec;
    if (api.id === 'api-repeating-terminate') specToForge = repeatingTerminateApiSpec;
    if (api.id === 'api-sepa') specToForge = sepaTransferApiSpec;
    if (api.id === 'api-payee-eligibility') specToForge = payeeEligibilityApiSpec;
    if (api.id === 'api-repeating-inquiry') specToForge = repeatingInquiryApiSpec;
    if (api.id === 'api-adhoc-transfers') specToForge = adhocTransfersApiSpec;
    if (api.id === 'api-token-mgmt') specToForge = tokenManagementApiSpec;
    if (api.id === 'api-client-reg') specToForge = clientRegistrationApiSpec;
    
    const models = [
      { name: "Gemini 3.1 Flash Lite", id: "gemini-3.1-flash-lite-preview" },
      { name: "Gemini 3.1 Pro", id: "gemini-3.1-pro-preview" },
      { name: "Gemini 3.1 Flash", id: "gemini-3.1-flash-preview" },
      { name: "Gemini 2.5 Pro", id: "gemini-2.5-pro-preview" },
      { name: "Gemini 2.5 Flash", id: "gemini-2.5-flash-preview" }
    ];

    const promises = models.map(async (model) => {
      try {
        const result = await forgeApi(specToForge, model.id);
        setForgeResults(prev => ({ ...prev, [model.name]: result }));
      } catch (err) {
        setForgeResults(prev => ({ ...prev, [model.name]: "Error forging with this model." }));
      }
    });

    await Promise.all(promises);
    setForgingApiId(null);
    
    // Mark as forged
    setApis(prev => prev.map(a => a.id === api.id ? { ...a, isForged: true } : a));
  };

  const handleForgeAll = async () => {
    setActiveTab('forge-result');
    setForgingApiId('all');
    setForgeResults({});
    setForgeResult("");

    const models = [
      { name: "Gemini 3.1 Flash Lite", id: "gemini-3.1-flash-lite-preview" },
      { name: "Gemini 3.1 Pro", id: "gemini-3.1-pro-preview" },
      { name: "Gemini 3.1 Flash", id: "gemini-3.1-flash-preview" },
      { name: "Gemini 2.5 Pro", id: "gemini-2.5-pro-preview" },
      { name: "Gemini 2.5 Flash", id: "gemini-2.5-flash-preview" }
    ];

    // Shuffle the APIs list for processing
    const shuffledApis = [...apis].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < shuffledApis.length; i += 5) {
      const chunk = shuffledApis.slice(i, i + 5);
      
      // Process batch of 5 APIs simultaneously, each using a different model
      const chunkResults = await Promise.all(chunk.map(async (api, index) => {
        const model = models[index % models.length];
        try {
          const result = await forgeApi(api, model.id);
          return `### ${api.name}\n**Engine:** ${model.name}\n\n${result}`;
        } catch (err) {
          return `### ${api.name}\n**Engine:** ${model.name}\n\n*Error: Failed to forge this API spec.*`;
        }
      }));

      // Append results to the UI incrementally
      setForgeResult(prev => (prev ? prev + '\n\n---\n\n' : '') + chunkResults.join('\n\n---\n\n'));

      // If there's another batch, wait 30 seconds to respect rate limits
      if (i + 5 < shuffledApis.length) {
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }

    setForgeResult(prev => `## Global Batch Forge Report\n\nSuccessfully processed ${apis.length} APIs in batches of 5 with 30s cooldowns.\n\n` + prev);
    setApis(prev => prev.map(a => ({ ...a, isForged: true })));
    setForgingApiId(null);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
          <Plus className="w-4 h-4 text-blue-600" />
          Send Money
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
          <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          Request
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
          <CreditCard className="w-4 h-4 text-purple-600" />
          Card Settings
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          Security Audit
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_ACCOUNTS.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
          >
            <Card className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-16 h-16 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-slate-500">{account.name}</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                ${account.balance.toLocaleString()}
              </h2>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                  {account.accountNumber}
                </span>
                <span className={cn(
                  "text-[10px] uppercase font-bold px-2 py-1 rounded-full",
                  account.type === 'checking' ? "bg-blue-50 text-blue-600" :
                  account.type === 'savings' ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
                )}>
                  {account.type}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2" title="Cash Flow Analysis" subtitle="Monthly income vs expenses">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Jan', income: 4000, expense: 2400 },
                { name: 'Feb', income: 3000, expense: 1398 },
                { name: 'Mar', income: 2000, expense: 9800 },
                { name: 'Apr', income: 2780, expense: 3908 },
                { name: 'May', income: 1890, expense: 4800 },
                { name: 'Jun', income: 2390, expense: 3800 },
              ]}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#2563eb" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Advisor Quick View */}
        <Card title="Nexus AI Advisor" className="bg-slate-900 text-white border-none shadow-xl shadow-blue-900/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">Financial Health</p>
                <p className="text-xs text-slate-400">Analysis complete</p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <p className="text-sm text-slate-300 leading-relaxed">
                "Your spending in **Dining** is up 15% this month. Consider setting a cap of $400 to stay on track for your savings goal."
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('ai')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Full Analysis
            </button>
          </div>
        </Card>

        {/* System Status / Outage Maintenance */}
        <Card title="System Status" className="bg-emerald-50 border-emerald-100">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Database className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">All Systems Operational</p>
                <p className="text-xs text-emerald-600">Last check: 2 mins ago</p>
              </div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg border border-emerald-200">
              <p className="text-[10px] font-bold text-emerald-800 uppercase mb-1">Upcoming Maintenance</p>
              <p className="text-xs text-emerald-700">
                Scheduled outage for **SEPA Core** on March 20th, 02:00 - 04:00 UTC.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Activity" action={<button className="text-blue-600 text-sm font-medium hover:underline">View All</button>}>
        <div className="space-y-1">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  tx.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                )}>
                  {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{tx.description}</p>
                  <p className="text-xs text-slate-500">{tx.category} • {tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold",
                  tx.type === 'income' ? "text-emerald-600" : "text-slate-900"
                )}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderApiForge = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">API Forge</h1>
          <p className="text-slate-500">Manage and deploy FAPI-compliant banking integrations</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            multiple 
            accept=".json,.yaml,.yml"
            className="hidden" 
          />
          <button 
            onClick={handleForgeAll}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Cpu className="w-4 h-4" />
            Forge All
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Import API Spec
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apis.map((api) => (
          <motion.div key={api.id} layout>
            <Card className="relative group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-50 transition-colors">
                  <Database className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                    api.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                  )}>
                    {api.status}
                  </div>
                  {api.isForged && (
                    <div className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Forged
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{api.name}</h3>
              <p className="text-sm text-slate-500 mt-1">Version {api.version}</p>
              
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  FAPI v1.0
                </span>
                <span>{api.endpoints} Endpoints</span>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                  Documentation
                </button>
                <button 
                  onClick={() => handleForge(api)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Forge App
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
        
        <button className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all group">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Add New Integration</span>
        </button>
      </div>

      <Card title="Security & Compliance" subtitle="Financial-grade API (FAPI) Standards">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">mTLS Enforcement</h4>
                <p className="text-sm text-slate-500">Mutual TLS is required for all production endpoints to ensure client authenticity.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-purple-50 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">JWS Request Signing</h4>
                <p className="text-sm text-slate-500">All API requests must be signed using JSON Web Signature to prevent tampering.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Compliance Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Open Banking UK</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">PASSED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">CDR Australia</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">PASSED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">FDX (US)</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">IN PROGRESS</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAiAdvisor = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Nexus AI Advisor</h1>
        <p className="text-slate-500">Intelligent financial insights powered by Gemini</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[600px]">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
              <p className="text-slate-800">Hello! I'm Nexus AI. I've analyzed your recent transactions. How can I help you optimize your finances today?</p>
            </div>
          </div>

          <AnimatePresence>
            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] prose prose-slate prose-sm">
                  <Markdown>{aiResponse}</Markdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isAiLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 animate-pulse">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <form onSubmit={handleAiChat} className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your spending, savings goals, or budget..."
              className="w-full pl-4 pr-12 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={isAiLoading || !chatInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Analyze my spending", "How can I save $500?", "Review my subscriptions"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setChatInput(suggestion)}
                className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderForgeResult = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('forge')}
          className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-medium"
        >
          <ArrowDownLeft className="w-4 h-4 rotate-45" />
          Back to Forge
        </button>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
            Export Code
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            Deploy to Prod
          </button>
        </div>
      </div>

      <Card className="min-h-[600px]">
        {forgingApiId ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">
                {forgingApiId === 'all' ? 'Forging All APIs...' : 'Forging Production App...'}
              </h3>
              <p className="text-slate-500">Applying FAPI security layers and generating banking logic</p>
            </div>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              Forge Report: Production-Ready FAPI App
            </h1>

            {Object.keys(forgeResults).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-4">
                {Object.keys(forgeResults).map(modelName => (
                  <button
                    key={modelName}
                    onClick={() => setActiveForgeModel(modelName)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeForgeModel === modelName
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {modelName}
                  </button>
                ))}
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Markdown>
                {forgeResult || forgeResults[activeForgeModel] || "No report generated yet."}
              </Markdown>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Nexus Bank</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Database} label="API Forge" active={activeTab === 'forge'} onClick={() => setActiveTab('forge')} />
          <SidebarItem icon={Send} label="Transfers" active={activeTab === 'transfers'} onClick={() => setActiveTab('transfers')} />
          <SidebarItem icon={MessageSquare} label="AI Advisor" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
          <SidebarItem icon={CreditCard} label="Cards" active={activeTab === 'cards'} onClick={() => setActiveTab('cards')} />
          <SidebarItem icon={TrendingUp} label="Investments" active={activeTab === 'invest'} onClick={() => setActiveTab('invest')} />
          <SidebarItem icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase">System Status</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">FAPI Gateway: Online</p>
            <p className="text-[10px] text-slate-400 font-medium">AI Core: v3.1 Flash</p>
          </div>
          <SidebarItem icon={Settings} label="Settings" onClick={() => {}} />
          <SidebarItem icon={LogOut} label="Logout" onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions, APIs, or help..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-white hover:text-slate-900 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Alex Rivera</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase">Premium Member</p>
              </div>
              <img 
                src="https://picsum.photos/seed/alex/100/100" 
                alt="Profile" 
                className="w-10 h-10 rounded-xl border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'forge' && renderApiForge()}
            {activeTab === 'forge-result' && renderForgeResult()}
            {activeTab === 'ai' && renderAiAdvisor()}
            {activeTab === 'transfers' && renderTransfers()}
            {activeTab === 'cards' && renderCards()}
            {activeTab === 'invest' && renderInvestments()}
            {activeTab === 'profile' && renderProfile()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );

  function renderTransfers() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Money Movement</h1>
            <p className="text-slate-500">Secure FAPI-compliant transfers and payment management</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              New Transfer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* SEPA Transfer Form */}
            <Card title="SEPA Transfer" subtitle="Instant Euro Payments">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">From Account</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                      {MOCK_ACCOUNTS.map(acc => <option key={acc.id}>{acc.name} ({acc.accountNumber})</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Amount (EUR)</label>
                    <input type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Recipient IBAN</label>
                  <input type="text" placeholder="EE00 0000 0000 0000 0000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Confirm SEPA Transfer
                </button>
              </div>
            </Card>

            {/* Repeating Payments */}
            <Card title="Repeating Payments" subtitle="Manage your standing instructions">
              <div className="space-y-4">
                {[
                  { id: 'si1', name: 'Rent Payment', amount: 1200, frequency: 'Monthly', next: '2024-04-01' },
                  { id: 'si2', name: 'Gym Membership', amount: 45, frequency: 'Monthly', next: '2024-03-28' },
                  { id: 'si3', name: 'Savings Transfer', amount: 500, frequency: 'Weekly', next: '2024-03-22' },
                ].map((si) => (
                  <div key={si.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{si.name}</p>
                        <p className="text-xs text-slate-500">{si.frequency} • Next: {si.next}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-slate-900">${si.amount}</p>
                      <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Adhoc Multiple Transfers */}
            <Card title="Batch Payments" subtitle="Adhoc Multiple Transfers">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    Process multiple payments simultaneously. Ideal for payroll or vendor settlements.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Selected Payees</span>
                    <span className="font-bold text-slate-900">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Total Amount</span>
                    <span className="font-bold text-slate-900">$0.00</span>
                  </div>
                </div>
                <button className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-500 rounded-xl font-medium hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Payee to Batch
                </button>
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50" disabled>
                  Execute Batch Payment
                </button>
              </div>
            </Card>

            {/* Payee Eligibility */}
            <Card title="Payee Verification" subtitle="Eligibility Check">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search payees..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-slate-600">Global SWIFT Network: Connected</span>
                  </div>
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-slate-600">SEPA Instant: Active</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  function renderCards() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Card Management</h1>
            <p className="text-slate-500">Manage your physical and virtual payment methods</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Issue Virtual Card
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.div 
              initial={{ rotateY: -10, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              className="relative w-full h-56 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-2xl p-8 text-white shadow-2xl shadow-blue-200 overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu className="w-32 h-32" />
              </div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-medium opacity-70 uppercase tracking-widest">Nexus Platinum</p>
                  <p className="text-lg font-bold">Alex Rivera</p>
                </div>
                <div className="w-12 h-8 bg-amber-400/20 rounded-md border border-amber-400/30 flex items-center justify-center">
                  <div className="w-6 h-4 bg-amber-400/40 rounded-sm" />
                </div>
              </div>
              <div className="mt-12">
                <p className="text-2xl font-mono tracking-[0.2em]">**** **** **** 4582</p>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] opacity-60 uppercase">Expiry</p>
                    <p className="text-sm font-medium">09/28</p>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-60 uppercase">CVV</p>
                    <p className="text-sm font-medium">***</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500/80" />
                  <div className="w-8 h-8 rounded-full bg-amber-500/80" />
                </div>
              </div>
            </motion.div>

            <Card title="Card Controls">
              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, label: "Freeze Card", desc: "Temporarily disable all transactions", color: "text-blue-600" },
                  { icon: Search, label: "View PIN", desc: "Securely reveal your card PIN", color: "text-slate-600" },
                  { icon: Bell, label: "Transaction Alerts", desc: "Get notified for every spend", color: "text-emerald-600" },
                  { icon: LogOut, label: "Terminate Card", desc: "Permanently disable this card", color: "text-rose-600" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors", item.color)}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className="w-10 h-6 bg-slate-200 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Spending Limits">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Daily Limit</span>
                    <span className="font-bold text-slate-900">$2,500 / $5,000</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-600 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Online Purchases</span>
                    <span className="font-bold text-slate-900">$850 / $2,000</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[42%] h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Recent Card Activity">
              <div className="space-y-4">
                {MOCK_TRANSACTIONS.slice(0, 3).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Search className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{tx.description}</p>
                        <p className="text-[10px] text-slate-500">{tx.date}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-900">-${tx.amount}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customer Profile</h1>
            <p className="text-slate-500">Manage your personal information and demographics</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 flex flex-col items-center text-center py-10">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/alex/200/200" 
                alt="Profile" 
                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl mb-4"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 right-0 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Alex Rivera</h3>
            <p className="text-sm text-slate-500">Premium Member since 2021</p>
            <div className="mt-6 w-full px-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Verification Status</span>
                <span className="text-emerald-600">Verified</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-emerald-500" />
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2" title="Demographics & Identity">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: "Alexandro Rivera" },
                { label: "Email Address", value: "alex.rivera@nexus.bank" },
                { label: "Phone Number", value: "+1 (555) 012-3456" },
                { label: "Date of Birth", value: "May 14, 1992" },
                { label: "Nationality", value: "United States" },
                { label: "Employment", value: "Senior Software Architect" },
                { label: "Residential Status", value: "Resident" },
                { label: "Tax ID", value: "XXX-XX-9876" }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-4">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Your demographics data is protected by FAPI-compliant encryption. Only authorized banking modules can access this information.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function renderInvestments() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Investment Portfolio</h1>
            <p className="text-slate-500">Track and grow your wealth with AI-guided strategies</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
              Portfolio Rebalance
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <TrendingUp className="w-4 h-4" />
              Trade
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" title="Performance History">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', value: 42000 },
                  { name: 'Tue', value: 43500 },
                  { name: 'Wed', value: 41000 },
                  { name: 'Thu', value: 44800 },
                  { name: 'Fri', value: 46200 },
                  { name: 'Sat', value: 45900 },
                  { name: 'Sun', value: 47500 },
                ]}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Asset Allocation">
              <div className="h-[200px] w-full flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 border-[12px] border-blue-600 rounded-full" />
                  <div className="absolute inset-0 border-[12px] border-emerald-500 rounded-full clip-path-half rotate-90" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="text-sm font-bold">$47.5k</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-slate-600">Stocks</span>
                  </div>
                  <span className="font-bold">65%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-slate-600">Crypto</span>
                  </div>
                  <span className="font-bold">25%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="text-slate-600">Cash</span>
                  </div>
                  <span className="font-bold">10%</span>
                </div>
              </div>
            </Card>

            <Card title="AI Strategy" className="bg-emerald-900 text-white border-none">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Bullish Outlook</span>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  "Market indicators suggest a strong recovery in the tech sector. I recommend increasing your exposure to **Cloud Infrastructure** by 5%."
                </p>
                <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors">
                  Execute Strategy
                </button>
              </div>
            </Card>
          </div>
        </div>

        <Card title="Top Holdings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Apple Inc.", symbol: "AAPL", price: "$182.52", change: "+1.2%", color: "text-emerald-600" },
              { name: "Bitcoin", symbol: "BTC", price: "$64,210", change: "-0.5%", color: "text-rose-600" },
              { name: "NVIDIA", symbol: "NVDA", price: "$875.30", change: "+4.8%", color: "text-emerald-600" },
              { name: "Ethereum", symbol: "ETH", price: "$3,450", change: "+2.1%", color: "text-emerald-600" }
            ].map((stock, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-400">{stock.symbol}</span>
                  <span className={cn("text-xs font-bold", stock.color)}>{stock.change}</span>
                </div>
                <p className="font-bold text-slate-900">{stock.name}</p>
                <p className="text-lg font-mono mt-1">{stock.price}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/Gmail-ai-loan-over-writer- | ORIGINAL PATH: diplomat-bit-Gmail-ai-loan-over-writer--b3dc614/src/App.tsx
================================================================================

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return <div></div>;
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/src/App.tsx
================================================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import LicensingView from './features/compliance/views/LicensingView';

const App: React.FC = () => {
    return (
        <DataProvider>
            <Router>
                <div className="min-h-screen bg-gray-900 text-gray-100">
                    <Routes>
                        <Route path="/" element={<Navigate to="/compliance/licensing" replace />} />
                        <Route path="/compliance/licensing" element={<LicensingView />} />
                    </Routes>
                </div>
            </Router>
        </DataProvider>
    );
};

export default App;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/src/App.tsx
================================================================================

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Cpu, ShieldAlert, Sparkles, Terminal, ArrowLeft, ExternalLink, Grid } from 'lucide-react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { datadogLogs } from '@datadog/browser-logs';
import { Analytics } from '@vercel/analytics/react';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider, DataContext } from './context/DataContext';
import { StripeDataProvider } from './components/StripeDataProvider';
import { MoneyMovementProvider } from './components/MoneyMovementContext';

// Layout & Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SApp from './components/SApp';
import { View } from './types';

// Views & Components
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import BudgetsView from './components/BudgetsView';
import FinancialGoalsView from './components/FinancialGoalsView';
import CreditHealthView from './components/CreditHealthView';
import PersonalizationView from './components/PersonalizationView';
import AccountsView from './components/AccountsView';
import InvestmentsView from './components/InvestmentsView';
import CryptoView from './components/CryptoView';
import AlgoTradingLab from './components/AlgoTradingLab';
import ForexArena from './components/ForexArena';
import CommoditiesExchange from './components/CommoditiesExchange';
import RealEstateEmpire from './components/RealEstateEmpire';
import ArtCollectibles from './components/ArtCollectibles';
import DerivativesDesk from './components/DerivativesDesk';
import VentureCapitalDesk from './components/VentureCapitalDesk';
import PrivateEquityLounge from './components/PrivateEquityLounge';
import TaxOptimizationChamber from './components/TaxOptimizationChamber';
import LegacyBuilder from './components/LegacyBuilder';
import CorporateCommandView from './components/CorporateCommandView';
import ModernTreasuryView from './components/ModernTreasuryView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import QuantumWeaverView from './components/QuantumWeaverView';
import AgentMarketplaceView from './components/MarketplaceView';
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import ConciergeService from './components/ConciergeService';
import SovereignWealth from './components/SovereignWealth';
import PhilanthropyHub from './components/PhilanthropyHub';
import TheVisionView from './components/TheVisionView';
import AIAdvisorView from './components/AIAdvisorView';
import { AIInsights } from './components/AIInsights';
import SecurityView from './components/SecurityView';
import ComplianceOracleView from './components/ComplianceOracleView';
import GlobalPositionMap from './components/GlobalPositionMap';
import GlobalSsiHubView from './components/GlobalSsiHubView';
import CustomerDashboard from './components/CustomerDashboard';
import VerificationReportsView from './components/VerificationReportsView';
import FinancialReportingView from './components/FinancialReportingView';
import StripeNexusDashboard from './components/StripeNexusDashboard';
import TheBookView from './components/TheBookView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import VoiceControl from './components/VoiceControl';
import LandingPage from './components/LandingPage';
import QuantumAssets from './components/QuantumAssets';
import CitibankAccountsView from './components/CitibankAccountsView';
import CitibankAccountProxyView from './components/CitibankAccountProxyView';
import CitibankBillPayView from './components/CitibankBillPayView';
import CitibankCrossBorderView from './components/CitibankCrossBorderView';
import CitibankPayeeManagementView from './components/CitibankPayeeManagementView';
import CitibankStandingInstructionsView from './components/CitibankStandingInstructionsView';
import CitibankDeveloperToolsView from './components/CitibankDeveloperToolsView';
import CitibankEligibilityView from './components/CitibankEligibilityView';
import CitibankUnmaskedDataView from './components/CitibankUnmaskedDataView';
import PlaidIdentityView from './components/PlaidIdentityView';
import PlaidCRAMonitoringView from './components/PlaidCRAMonitoringView';
import { PlaidInstitutionsExplorer } from './components/PlaidInstitutionsExplorer';
import { PlaidItemManagementView } from './components/PlaidItemManagementView';
import PlaidMainDashboard from './components/PlaidMainDashboard';
import StripeNexusView from './components/StripeNexusView';
import CounterpartyDashboardView from './components/CounterpartyDashboardView';
import VirtualAccountsDashboard from './components/VirtualAccountsDashboard';
import CorporateActionsNexusView from './components/CorporateActionsNexusView';
import { CreditNoteLedger } from './components/CreditNoteLedger';
import ReconciliationHubView from './components/ReconciliationHubView';
import GEINDashboard from './components/GEIN_DashboardView';
import CardholderManagement from './components/CardholderManagement';
import UniversalObjectInspector from './components/UniversalObjectInspector';
import { LoginView } from './components/LoginView';
import { PlaidClient } from './lib/plaidClient';
import DeveloperHubView from './components/DeveloperHubView';
import ApiPlaygroundView from './components/ApiPlaygroundView';

// --- ALL COMPONENT IMPORTS FOR DIRECT ACCESS ---
import AccountDetails from './components/AccountDetails';
import AccountList from './components/AccountList';
import AccountStatementGrid from './components/AccountStatementGrid';
import { AccountVerificationModal } from './components/AccountVerificationModal';
import ACHDetailsDisplay from './components/ACHDetailsDisplay';
import AICommandLog from './components/AICommandLog';
import AIPredictionWidget from './components/AIPredictionWidget';
import AssetCatalog from './components/AssetCatalog';
import AutomatedSweepRules from './components/AutomatedSweepRules';
import BalanceReportChart from './components/BalanceReportChart';
import BalanceTransactionTable from './components/BalanceTransactionTable';
import CardDesignVisualizer from './components/CardDesignVisualizer';
import { ChargeDetailModal } from './components/ChargeDetailModal';
import ChargeList from './components/ChargeList';
import ConductorConfigurationView from './components/ConductorConfigurationView';
import CounterpartyDetails from './components/CounterpartyDetails';
import { CounterpartyForm } from './components/CounterpartyForm';
import DisruptionIndexMeter from './components/DisruptionIndexMeter';
import DocumentUploader from './components/DocumentUploader';
import { DownloadLink } from './components/DownloadLink';
import EarlyFraudWarningFeed from './components/EarlyFraudWarningFeed';
import ElectionChoiceForm from './components/ElectionChoiceForm';
import EventNotificationCard from './components/EventNotificationCard';
import ExpectedPaymentsTable from './components/ExpectedPaymentsTable';
import ExternalAccountCard from './components/ExternalAccountCard';
import ExternalAccountForm from './components/ExternalAccountForm';
import ExternalAccountTable from './components/ExternalAccountsTable';
import { FinancialAccountCard } from './components/FinancialAccountCard';
import IncomingPaymentDetailList from './components/IncomingPaymentDetailList';
import { InvestmentForm } from './components/InvestmentForm';
import InvoiceFinancingRequest from './components/InvoiceFinancingRequest';
import PaymentInitiationForm from './components/PaymentInitiationForm';
import PaymentMethodDetails from './components/PaymentMethodDetails';
import PaymentOrderForm from './components/PaymentOrderForm';
import PayoutsDashboard from './components/PayoutsDashboard';
import PnLChart from './components/PnLChart';
import RefundForm from './components/RefundForm';
import RemittanceInfoEditor from './components/RemittanceInfoEditor';
import ReportingView from './components/ReportingView';
import { ReportRunGenerator } from './components/ReportRunGenerator';
import ReportStatusIndicator from './components/ReportStatusIndicator';
import ResourceGraphView from './components/ResourceGraphView';
import SchemaExplorer from './components/SchemaExplorer';
import SecurityComplianceView from './components/SecurityComplianceView';
import SsiEditorForm from './components/SsiEditorForm';
import StripeStatusBadge from './components/StripeStatusBadge';
import StructuredPurposeInput from './components/StructuredPurposeInput';
import SubscriptionList from './components/SubscriptionList';
import TimeSeriesChart from './components/TimeSeriesChart';
import TradeConfirmationModal from './components/TradeConfirmationModal';
import TransactionFilter from './components/TransactionFilter';
import TransactionList from './components/TransactionList';
import { TreasuryTransactionList } from './components/TreasuryTransactionList';
import TreasuryView from './components/TreasuryView';
import VentureCapitalDeskView from './components/VentureCapitalDeskView';
import VirtualAccountForm from './components/VirtualAccountForm';
import VirtualAccountsTable from './components/VirtualAccountsTable';
import WebhookSimulator from './components/WebhookSimulator';

// --- FIXED Wrapper Components ---
type WrapperProps = {
  Component: React.FC<any>;
  props?: any;
};

const Wrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  return <Component {...props} />;
};

const ModalWrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Component
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      {...props}
    />
  );
};

const DataContextWrapper: React.FC<{ Component: React.FC<any>; extraProps?: any }> = ({ Component, extraProps = {} }) => {
  const dataContext = useContext(DataContext);
  const mockContext = {
    setActiveView: () => {},
    impactData: { treesPlanted: 0, progressToNextTree: 0 },
  };
  const props = { ...(dataContext || mockContext), ...extraProps };
  return <Component {...props} />;
};

const AIIntentStub: React.FC<{ view: View }> = ({ view }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in duration-700 bg-gray-950/50 rounded-3xl border border-gray-800">
      <div className="w-24 h-24 bg-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        <Sparkles className="text-cyan-400 w-12 h-12 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-mono">
          Module Ingress: {String(view).replace(/-/g, '_').toUpperCase()}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed font-mono">
          The Sovereign AI Core is compiling the high-frequency logic for this specific subsystem. Targeting zero-latency node deployment in the next epoch.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
          <Terminal size={14} /> STATUS: COMPILING_INTENT
        </div>
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
          <ShieldAlert size={14} /> AUTH: VERIFIED
        </div>
      </div>
    </div>
  );
};

const MonetizationOverlay = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { sovereignCredits } = context;
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sovereign Balance:</span>
      <span className="text-cyan-400 font-mono text-lg font-bold tracking-tighter">
        {sovereignCredits.toLocaleString()} SC
      </span>
    </div>
  );
};

const Logout = () => {
  const { logout } = useAuth0();
  useEffect(() => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout]);
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black text-cyan-400 font-mono">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span>TERMINATING SESSION...</span>
      </div>
    </div>
  );
};

const SAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    datadogLogs.logger.info('App View Loaded', { name: 'SovereignNexus', id: 'init_view' });
  }, []);

  // Define Route Configuration to map Views to Paths and Components
  const viewConfig = useMemo(() => [
    { view: View.Dashboard, path: '/dashboard', element: <Dashboard /> },
    { view: View.Transactions, path: '/transactions', element: <TransactionsView /> },
    { view: View.SendMoney, path: '/send-money', element: <SendMoneyView /> },
    { view: View.Budgets, path: '/budgets', element: <BudgetsView /> },
    { view: View.FinancialGoals, path: '/financial-goals', element: <FinancialGoalsView /> },
    { view: View.CreditHealth, path: '/credit-health', element: <CreditHealthView /> },
    { view: View.Personalization, path: '/personalization', element: <PersonalizationView /> },
    { view: View.Accounts, path: '/accounts', element: <AccountsView /> },
    { view: View.Investments, path: '/investments', element: <InvestmentsView /> },
    { view: View.CryptoWeb3, path: '/crypto', element: <CryptoView /> },
    { view: View.AlgoTradingLab, path: '/algo-trading', element: <AlgoTradingLab /> },
    { view: View.ForexArena, path: '/forex', element: <ForexArena /> },
    { view: View.CommoditiesExchange, path: '/commodities', element: <CommoditiesExchange /> },
    { view: View.RealEstateEmpire, path: '/real-estate', element: <RealEstateEmpire /> },
    { view: View.ArtCollectibles, path: '/art-collectibles', element: <ArtCollectibles /> },
    { view: View.DerivativesDesk, path: '/derivatives', element: <DerivativesDesk /> },
    { view: View.VentureCapital, path: '/venture-capital', element: <VentureCapitalDesk /> },
    { view: View.PrivateEquity, path: '/private-equity', element: <PrivateEquityLounge /> },
    { view: View.TaxOptimization, path: '/tax-optimization', element: <TaxOptimizationChamber /> },
    { view: View.LegacyBuilder, path: '/legacy-builder', element: <LegacyBuilder /> },
    { view: View.CorporateCommand, path: '/corporate-command', element: <CorporateCommandView setActiveView={dataContext?.setActiveView} /> },
    { view: View.ModernTreasury, path: '/modern-treasury', element: <ModernTreasuryView /> },
    { view: View.OpenBanking, path: '/open-banking', element: <OpenBankingView /> },
    { view: View.FinancialDemocracy, path: '/financial-democracy', element: <FinancialDemocracyView /> },
    { view: View.AIAdStudio, path: '/ai-ad-studio', element: <AIAdStudioView /> },
    { view: View.QuantumWeaver, path: '/quantum-weaver', element: <QuantumWeaverView /> },
    { view: View.AgentMarketplace, path: '/agent-marketplace', element: <AgentMarketplaceView /> },
    { view: View.APIStatus, path: '/api-status', element: <APIIntegrationView /> },
    { view: View.Settings, path: '/settings', element: <SettingsView /> },
    { view: View.QuantumAssets, path: '/quantum-assets', element: <QuantumAssets /> },
    { view: View.SovereignWealth, path: '/sovereign-wealth', element: <SovereignWealth /> },
    { view: View.Philanthropy, path: '/philanthropy', element: <PhilanthropyHub /> },
    { view: View.TheVision, path: '/vision', element: <TheVisionView /> },
    { view: View.AIAdvisor, path: '/ai-advisor', element: <AIAdvisorView /> },
    { view: View.AIInsights, path: '/ai-insights', element: <AIInsights /> },
    { view: View.SecurityCenter, path: '/security', element: <SecurityView /> },
    { view: View.ComplianceOracle, path: '/compliance', element: <ComplianceOracleView /> },
    { view: View.GlobalPositionMap, path: '/global-map', element: <GlobalPositionMap /> },
    { view: View.GlobalSsiHub, path: '/ssi-hub', element: <GlobalSsiHubView /> },
    { view: View.CustomerDashboard, path: '/customer-dashboard', element: <CustomerDashboard /> },
    { view: View.VerificationReports, path: '/verification-reports', element: <VerificationReportsView customerId="c1" /> },
    { view: View.FinancialReporting, path: '/financial-reporting', element: <FinancialReportingView /> },
    { view: View.StripeNexusDashboard, path: '/stripe-nexus-dashboard', element: <StripeNexusDashboard /> },
    { view: View.TheBook, path: '/the-book', element: <TheBookView /> },
    { view: View.KnowledgeBase, path: '/knowledge-base', element: <KnowledgeBaseView /> },
    { view: View.CitibankAccounts, path: '/citi-accounts', element: <CitibankAccountsView /> },
    { view: View.CitibankAccountProxy, path: '/citi-proxy', element: <CitibankAccountProxyView /> },
    { view: View.CitibankBillPay, path: '/citi-bill-pay', element: <CitibankBillPayView /> },
    { view: View.CitibankCrossBorder, path: '/citi-cross-border', element: <CitibankCrossBorderView /> },
    { view: View.CitibankPayeeManagement, path: '/citi-payee', element: <CitibankPayeeManagementView /> },
    { view: View.CitibankStandingInstructions, path: '/citi-standing-instructions', element: <CitibankStandingInstructionsView /> },
    { view: View.CitibankDeveloperTools, path: '/citi-dev-tools', element: <CitibankDeveloperToolsView /> },
    { view: View.CitibankEligibility, path: '/citi-eligibility', element: <CitibankEligibilityView /> },
    { view: View.CitibankUnmaskedData, path: '/citi-unmasked', element: <CitibankUnmaskedDataView accountIdsToUnmask={['acc_1']} /> },
    { view: View.PlaidMainDashboard, path: '/plaid-dashboard', element: <PlaidMainDashboard /> },
    { view: View.PlaidIdentity, path: '/plaid-identity', element: <PlaidIdentityView /> },
    { view: View.PlaidCRAMonitoring, path: '/plaid-cra', element: <PlaidCRAMonitoringView /> },
    { view: View.PlaidInstitutions, path: '/plaid-institutions', element: <PlaidInstitutionsExplorer client={new PlaidClient()} /> },
    { view: View.PlaidItemManagement, path: '/plaid-items', element: <PlaidItemManagementView accessToken="mock_token" /> },
    { view: View.StripeNexus, path: '/stripe-nexus', element: <StripeNexusView /> },
    { view: View.CounterpartyDashboard, path: '/counterparty-dashboard', element: <CounterpartyDashboardView /> },
    { view: View.VirtualAccounts, path: '/virtual-accounts', element: <VirtualAccountsDashboard /> },
    { view: View.SApp, path: '/sapp', element: <SApp /> }, // Fixed Typo: SAPP -> SApp
    { view: View.CorporateActions, path: '/corporate-actions', element: <CorporateActionsNexusView /> },
    { view: View.CreditNoteLedger, path: '/credit-note-ledger', element: <CreditNoteLedger /> },
    { view: View.ReconciliationHub, path: '/reconciliation', element: <ReconciliationHubView /> },
    { view: View.GEINDashboard, path: '/gein-dashboard', element: <GEINDashboard /> },
    { view: View.CardholderManagement, path: '/cardholder-management', element: <CardholderManagement /> },
    { view: View.SecurityCompliance, path: '/security-compliance', element: <SecurityComplianceView /> },
    { view: View.DeveloperHub, path: '/developer-hub', element: <DeveloperHubView /> },
    { view: View.SchemaExplorer, path: '/schema-explorer', element: <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} /> },
    { view: View.ResourceGraph, path: '/resource-graph', element: <ResourceGraphView /> },
    { view: View.ApiPlayground, path: '/api-playground', element: <ApiPlaygroundView /> },
    { view: View.VentureCapitalDeskView, path: '/vc-desk-view', element: <VentureCapitalDeskView /> },
    
    // Direct Component Access
    { view: View.AccountDetails, path: '/comp/account-details', element: <Wrapper Component={AccountDetails} props={{ accountId: '1', customerId: 'c1' }} /> },
    { view: View.AccountList, path: '/comp/account-list', element: <Wrapper Component={AccountList} props={{ accounts: [] }} /> },
    { view: View.AccountStatementGrid, path: '/comp/account-statement', element: <Wrapper Component={AccountStatementGrid} props={{ statementLines: [] }} /> },
    { view: View.AccountVerificationModal, path: '/comp/account-verification', element: <ModalWrapper Component={AccountVerificationModal} props={{ externalAccount: {id: '1', verification_status: 'unverified' }, onSuccess: () => {}}} /> },
    { view: View.ACHDetailsDisplay, path: '/comp/ach-details', element: <Wrapper Component={ACHDetailsDisplay} props={{ details: { routingNumber: '123', realAccountNumber: '456' } }} /> },
    { view: View.AICommandLog, path: '/comp/ai-command-log', element: <AICommandLog /> },
    { view: View.AIPredictionWidget, path: '/comp/ai-prediction', element: <AIPredictionWidget /> },
    { view: View.AssetCatalog, path: '/comp/asset-catalog', element: <Wrapper Component={AssetCatalog} props={{ assets: [], onAssetSelected: () => {}, getAssetDetails: async () => ({}) }} /> },
    { view: View.AutomatedSweepRules, path: '/comp/sweep-rules', element: <AutomatedSweepRules /> },
    { view: View.BalanceReportChart, path: '/comp/balance-chart', element: <Wrapper Component={BalanceReportChart} props={{ data: [] }} /> },
    { view: View.BalanceTransactionTable, path: '/comp/balance-table', element: <Wrapper Component={BalanceTransactionTable} props={{ balanceTransactions: [] }} /> },
    { view: View.CardDesignVisualizer, path: '/comp/card-design', element: <Wrapper Component={CardDesignVisualizer} props={{ design: { id: 'd_1', physical_bundle: { features: {} } } }} /> },
    { view: View.ChargeDetailModal, path: '/comp/charge-detail', element: <ModalWrapper Component={ChargeDetailModal} props={{ charge: {id: 'ch_1', amount: 50000, currency: 'USD', status: 'succeeded'}, onClose: () => {}}} /> },
    { view: View.ChargeList, path: '/comp/charge-list', element: <ChargeList /> },
    { view: View.ConductorConfigurationView, path: '/comp/conductor-config', element: <ConductorConfigurationView /> },
    { view: View.CounterpartyDetails, path: '/comp/counterparty-details', element: <Wrapper Component={CounterpartyDetails} props={{ counterpartyId: 'cp_1' }} /> },
    { view: View.CounterpartyForm, path: '/comp/counterparty-form', element: <Wrapper Component={CounterpartyForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.DisruptionIndexMeter, path: '/comp/disruption-meter', element: <Wrapper Component={DisruptionIndexMeter} props={{ indexValue: 50 }} /> },
    { view: View.DocumentUploader, path: '/comp/document-uploader', element: <Wrapper Component={DocumentUploader} props={{ documentableType: 'test', documentableId: '1' }} /> },
    { view: View.DownloadLink, path: '/comp/download-link', element: <Wrapper Component={DownloadLink} props={{ url: '#', filename: 'test.pdf' }} /> },
    { view: View.EarlyFraudWarningFeed, path: '/comp/fraud-feed', element: <EarlyFraudWarningFeed /> },
    { view: View.ElectionChoiceForm, path: '/comp/election-form', element: <Wrapper Component={ElectionChoiceForm} props={{ availableChoices: {}, onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.EventNotificationCard, path: '/comp/event-card', element: <Wrapper Component={EventNotificationCard} props={{ event: {} }} /> },
    { view: View.ExpectedPaymentsTable, path: '/comp/expected-payments', element: <ExpectedPaymentsTable /> },
    { view: View.ExternalAccountCard, path: '/comp/external-account-card', element: <Wrapper Component={ExternalAccountCard} props={{ account: {id: '1', account_details: [], routing_details: []}}} /> },
    { view: View.ExternalAccountForm, path: '/comp/external-account-form', element: <Wrapper Component={ExternalAccountForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.ExternalAccountsTable, path: '/comp/external-accounts-table', element: <Wrapper Component={ExternalAccountTable} props={{ accounts: [] }} /> },
    { view: View.FinancialAccountCard, path: '/comp/financial-account-card', element: <Wrapper Component={FinancialAccountCard} props={{ financialAccount: {id: 'fa_1', balance: { cash: {}}, supported_currencies: []}}} /> },
    { view: View.IncomingPaymentDetailList, path: '/comp/incoming-payments', element: <IncomingPaymentDetailList /> },
    { view: View.InvoiceFinancingRequest, path: '/comp/invoice-financing', element: <Wrapper Component={InvoiceFinancingRequest} props={{ onSubmit: () => {} }} /> },
    { view: View.PaymentInitiationForm, path: '/comp/payment-initiation', element: <PaymentInitiationForm /> },
    { view: View.PaymentMethodDetails, path: '/comp/payment-method', element: <Wrapper Component={PaymentMethodDetails} props={{ details: { type: 'card', card: {} }}} /> },
    { view: View.PaymentOrderForm, path: '/comp/payment-order', element: <Wrapper Component={PaymentOrderForm} props={{ internalAccounts: [], externalAccounts: [], onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.PayoutsDashboard, path: '/comp/payouts', element: <PayoutsDashboard /> },
    { view: View.PnLChart, path: '/comp/pnl-chart', element: <Wrapper Component={PnLChart} props={{ data: [], algorithmName: 'Test' }} /> },
    { view: View.RefundForm, path: '/comp/refund-form', element: <RefundForm /> },
    { view: View.RemittanceInfoEditor, path: '/comp/remittance-editor', element: <Wrapper Component={RemittanceInfoEditor} props={{ onChange: () => {} }} /> },
    { view: View.ReportingView, path: '/comp/reporting', element: <ReportingView /> },
    { view: View.ReportRunGenerator, path: '/comp/report-generator', element: <ReportRunGenerator /> },
    { view: View.ReportStatusIndicator, path: '/comp/report-status', element: <Wrapper Component={ReportStatusIndicator} props={{ status: 'success' }} /> },
    { view: View.ResourceGraphView, path: '/comp/resource-graph-view', element: <ResourceGraphView /> },
    { view: View.SchemaExplorer, path: '/comp/schema-explorer-view', element: <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} /> },
    { view: View.SecurityComplianceView, path: '/comp/security-compliance-view', element: <SecurityComplianceView /> },
    { view: View.SsiEditorForm, path: '/comp/ssi-editor', element: <Wrapper Component={SsiEditorForm} props={{ onSubmit: () => {}, onCancel: () => {} }} /> },
    { view: View.StripeStatusBadge, path: '/comp/stripe-badge', element: <Wrapper Component={StripeStatusBadge} props={{ status: 'succeeded', objectType: 'charge' }} /> },
    { view: View.StructuredPurposeInput, path: '/comp/structured-purpose', element: <Wrapper Component={StructuredPurposeInput} props={{ onChange: () => {}, value: null }} /> },
    { view: View.SubscriptionList, path: '/comp/subscription-list', element: <Wrapper Component={SubscriptionList} props={{ subscriptions: [] }} /> },
    { view: View.TimeSeriesChart, path: '/comp/time-series', element: <Wrapper Component={TimeSeriesChart} props={{ data: { labels: [], datasets: [] } }} /> },
    { view: View.TradeConfirmationModal, path: '/comp/trade-confirmation', element: <ModalWrapper Component={TradeConfirmationModal} props={{ settlementInstruction: { messageId: 'NEX-INST-99281-Z', totalAmount: 12500000, currency: 'USD', creationDateTime: Date.now(), settlementDate: '2024-12-15', numberOfTransactions: 1, purpose: 'TREA' } }} /> },
    { view: View.TransactionFilter, path: '/comp/transaction-filter', element: <Wrapper Component={TransactionFilter} props={{ onApplyFilters: () => {} }} /> },
    { view: View.TransactionList, path: '/comp/transaction-list', element: <Wrapper Component={TransactionList} props={{ transactions: [] }} /> },
    { view: View.TreasuryTransactionList, path: '/comp/treasury-list', element: <Wrapper Component={TreasuryTransactionList} props={{ transactions: [] }} /> },
    { view: View.TreasuryView, path: '/comp/treasury-view', element: <TreasuryView /> },
    { view: View.UniversalObjectInspector, path: '/comp/object-inspector', element: <Wrapper Component={UniversalObjectInspector} props={{ data: { status: "Nominal", uptime: "99.999%", load: "Balanced" } }} /> },
    { view: View.VirtualAccountForm, path: '/comp/virtual-account-form', element: <Wrapper Component={VirtualAccountForm} props={{ onSubmit: () => {}, isSubmitting: false }} /> },
    { view: View.VirtualAccountsTable, path: '/comp/virtual-accounts-table', element: <Wrapper Component={VirtualAccountsTable} props={{ onEdit: () => {}, onDelete: () => {} }} /> },
    { view: View.VoiceControl, path: '/comp/voice-control', element: <DataContextWrapper Component={VoiceControl} /> },
    { view: View.WebhookSimulator, path: '/comp/webhook-simulator', element: <Wrapper Component={WebhookSimulator} props={{ stripeAccountId: 'acct_mock' }} /> },
  ], [dataContext?.setActiveView]);

  if (!dataContext || !authContext) return null;
  const { isAuthenticated, isLoading: authLoading } = authContext;
  const { isLoading: dataLoading, activeView, setActiveView } = dataContext;

  // Sync URL to State (Deep Linking)
  useEffect(() => {
    const currentPath = location.pathname;
    const config = viewConfig.find(c => c.path === currentPath);
    if (config && activeView !== config.view) {
      setActiveView(config.view);
    } else if (!config && currentPath !== '/') {
      // Fallback for unknown routes inside SAppLayout
      // Optional: Redirect to dashboard or handle 404
    }
  }, [location.pathname, viewConfig, activeView, setActiveView]);

  // Sync State to URL (Sidebar Navigation)
  useEffect(() => {
    const config = viewConfig.find(c => c.view === activeView);
    if (config && location.pathname !== config.path) {
      navigate(config.path);
    }
  }, [activeView, viewConfig, navigate, location.pathname]);

  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-6">
        <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />
        <h1 className="text-3xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase font-mono">
          Nexus OS // Syncing
        </h1>
        <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-progress-flow"></div>
        </div>
        <style>{`
          @keyframes flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          .animate-progress-flow { animation: flow 2s linear infinite; width: 50%; }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="relative flex flex-col flex-1 min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,#111,transparent)]">
          <div className="max-w-[1600px] mx-auto h-full min-h-0">
            <Routes>
              {viewConfig.map((config) => (
                <Route key={config.path} path={config.path} element={config.element} />
              ))}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
        <MonetizationOverlay />
        <Link 
          to="/modules"
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] group"
          title="Open AI Nexus"
        >
          <Grid size={20} className="group-hover:animate-spin-slow" />
        </Link>
      </div>
    </div>
  );
};

const AI_MODULES = [
  "https://admin08077-openapi.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-ai-ban-king-demo.static.hf.space",
  "https://admin08077-1233.static.hf.space",
  "https://admin08077-inventions.static.hf.space",
  "https://admin08077-gemini-app-citibank-demo-business-inc-google.static.hf.space",
  "https://admin08077-aibankdemo2.static.hf.space",
  "https://admin08077-airenderer.static.hf.space",
  "https://admin08077-book.static.hf.space",
  "https://admin08077-merrychristmas.static.hf.space",
  "https://admin08077-apiai.static.hf.space",
  "https://admin08077-projectatlas.static.hf.space",
  "https://admin08077-jocall3.static.hf.space",
  "https://admin08077-demob.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-static.static.hf.space",
  "https://admin08077-demoo.static.hf.space",
  "https://admin08077-webgenai.static.hf.space",
  "https://admin08077-aiab.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-app.static.hf.space",
  "https://admin08077-aib8nking.static.hf.space",
  "https://admin08077-bb.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-apps.static.hf.space",
  "https://admin08077-newwa.static.hf.space",
  "https://admin08077-jamesocallaghanprivatebank.hf.space",
  "https://admin08077-drip-faucet.static.hf.space",
  "https://admin08077-transactpro.hf.space",
  "https://admin08077-quantumbank.hf.space",
  "https://admin08077-test.hf.space"
];

const getModuleTitle = (url: string) => {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    // Remove .hf.space or .static.hf.space
    hostname = hostname.replace('.static.hf.space', '').replace('.hf.space', '');
    // Remove admin08077- prefix
    hostname = hostname.replace(/^admin\d+-/, '');
    // Replace hyphens with spaces
    const title = hostname.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return title || 'AI Module';
  } catch (e) {
    return 'AI Module';
  }
};

const AIModuleCard = ({ url, className }: { url: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const title = getModuleTitle(url);

  return (
    <div className={`flex flex-col w-full bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 group ${className || 'h-[500px]'}`}>
      <div className="px-4 py-3 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-sm font-mono font-bold text-gray-300 group-hover:text-cyan-400 transition-colors truncate max-w-[300px]">
            {title}
          </span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-white transition-colors">
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="relative flex-1 bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/20 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title={title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

const ExternalIframeCollection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % AI_MODULES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + AI_MODULES.length) % AI_MODULES.length);
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} transition-all duration-300 border-r border-gray-800 bg-gray-950 flex flex-col fixed md:relative z-20 h-full`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="font-mono font-bold text-gray-200 tracking-wider">MODULES</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white">
            <ArrowLeft size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {AI_MODULES.map((url, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-mono transition-all duration-200 flex items-center gap-3 ${
                activeIndex === index
                  ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300 border border-transparent'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeIndex === index ? 'bg-cyan-400 animate-pulse' : 'bg-gray-700'}`} />
              <span className="truncate">{getModuleTitle(url)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative">
        {/* Top Bar */}
        <div className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Terminal size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <div className="p-1.5 rounded-md bg-gray-900 group-hover:bg-gray-800 border border-gray-800 group-hover:border-gray-700">
                <ArrowLeft size={14} />
              </div>
              <span className="text-xs font-mono tracking-widest">RETURN TO OS</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-mono text-gray-400">
               MODULE {activeIndex + 1} / {AI_MODULES.length}
             </div>
          </div>
        </div>

        {/* Card Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center overflow-hidden relative">
           {/* Navigation Buttons (Desktop) */}
           <button 
             onClick={handlePrev}
             className="absolute left-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           </button>

           <button 
             onClick={handleNext}
             className="absolute right-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="rotate-180 group-hover:translate-x-1 transition-transform" />
           </button>

           {/* The Card */}
           <div className="w-full h-full max-w-[1400px] relative flex flex-col">
             <div className="flex-1 relative animate-in fade-in zoom-in-95 duration-500">
               <AIModuleCard 
                 key={activeIndex} 
                 url={AI_MODULES[activeIndex]} 
                 className="h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-gray-800" 
               />
             </div>
             
             {/* Mobile Nav */}
             <div className="flex md:hidden items-center justify-between mt-4 gap-4">
               <button onClick={handlePrev} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Prev</button>
               <button onClick={handleNext} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Next</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const theme = createTheme({ palette: { mode: 'dark' } });

function App() {
  return (
    <Auth0Provider
      domain="aibankinguniversity.us.auth0.com"
      clientId="fOkKYLJUrLnv7hInn8CVi3cHpjF7xPRp"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <AuthProvider>
        <DataProvider>
          <MoneyMovementProvider>
            <StripeDataProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/modules" element={<ExternalIframeCollection />} />
                    <Route path="*" element={<SAppLayout />} />
                  </Routes>
                </Router>
              </ThemeProvider>
            </StripeDataProvider>
          </MoneyMovementProvider>
        </DataProvider>
      </AuthProvider>
      <Analytics />
    </Auth0Provider>
  );
}

export default App;

================================================================================
// APPENDED FROM REPO: diplomat-bit/partnerportal-microsoft | ORIGINAL PATH: diplomat-bit-partnerportal-microsoft-81d9840/src/App.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { DataTable } from './components/DataTable';
import { Search, Bell, Settings, HelpCircle, User as UserIcon, X, Info, CreditCard, Landmark, Loader2, LogIn, Terminal } from 'lucide-react';
import { TransactionEntry } from './types';
import { PlaidLink } from './components/PlaidLink';
import { WebhookMonitor } from './components/WebhookMonitor';
import { CrossAppMessenger } from './components/CrossAppMessenger';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, User, db, handleFirestoreError, OperationType } from './firebase';
import { collection, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [selectedLog, setSelectedLog] = React.useState<TransactionEntry | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('plaid_access_token'));
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMonitor, setShowMonitor] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        // Sync user to Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, 'users'));
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore Real-time Listeners
  useEffect(() => {
    if (!isAuthReady || !user) return;

    const transactionsQuery = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const mappedTransactions: TransactionEntry[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: data.transaction_id,
          date: data.date,
          description: data.name,
          category: data.category?.[0] || 'Uncategorized',
          amount: data.amount,
          currency: data.iso_currency_code || 'USD',
          status: data.pending ? 'Pending' : 'Completed',
          account: data.account_name || 'Unknown', // We might need to sync account name too
          merchant: data.merchant_name || data.name,
          reference: data.transaction_id,
        };
      });
      setTransactions(mappedTransactions);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'transactions'));

    const accountsQuery = query(collection(db, 'accounts'), where('userId', '==', user.uid));
    const unsubscribeAccounts = onSnapshot(accountsQuery, (snapshot) => {
      setAccounts(snapshot.docs.map(doc => doc.data()));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'accounts'));

    return () => {
      unsubscribeTransactions();
      unsubscribeAccounts();
    };
  }, [isAuthReady, user]);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        // User cancelled or closed the popup, ignore or log silently
        console.log('Login cancelled by user');
      } else {
        console.error('Login failed:', err);
        setError(`Login failed: ${err.message}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePlaidSuccess = async (publicToken: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/set_access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token: publicToken, userId: user?.uid }),
      });
      const data = await response.json();
      setAccessToken(data.access_token);
      localStorage.setItem('plaid_access_token', data.access_token);
      fetchData(data.access_token);
    } catch (err) {
      setError('Failed to exchange public token');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (token: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await Promise.all([
        fetch('/api/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: token, userId: user.uid }),
        }),
        fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: token, userId: user.uid }),
        }),
      ]);
      // Data will be updated via Firestore listeners
    } catch (err) {
      setError('Failed to fetch bank data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && user) {
      fetchData(accessToken);
    }
  }, [accessToken, user]);

  const handleLogout = () => {
    auth.signOut();
    setAccessToken(null);
    localStorage.removeItem('plaid_access_token');
    setAccounts([]);
    setTransactions([]);
  };

  if (!isAuthReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F2F1]">
        <Loader2 className="animate-spin text-[#0078D4]" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F3F2F1] p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-[#0078D4]/10 rounded-full flex items-center justify-center mx-auto">
            <Landmark size={32} className="text-[#0078D4]" />
          </div>
          <h1 className="text-2xl font-bold text-[#323130]">Sovereign Bank</h1>
          <p className="text-[#605E5C]">Please sign in to access your secure banking dashboard.</p>
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 bg-[#0078D4] text-white py-3 rounded-lg font-semibold hover:bg-[#005A9E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <LogIn size={20} />
            )}
            {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
          </button>
          {error && <p className="text-[#A4262C] text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F3F2F1] font-sans text-[#323130] overflow-hidden">
      {/* Top Global Bar */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-[#0078D4] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#005A9E] rounded transition-colors">
            <Landmark size={20} className="text-white" />
          </button>
          <span className="text-white font-semibold">Sovereign Bank Online</span>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#605E5C]" size={16} />
            <input 
              type="text" 
              placeholder="Search transactions, accounts, or help..."
              className="w-full bg-white/90 rounded px-10 py-1.5 text-sm focus:bg-white outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowMonitor(!showMonitor)}
            className={`p-2 rounded transition-colors ${showMonitor ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}
            title="Toggle Webhook Monitor"
          >
            <Terminal size={18} />
          </button>
          <button 
            onClick={handleLogout}
            className="text-white text-xs hover:underline mx-4"
          >
            Sign Out
          </button>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition-colors mr-2">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-sm" />
            <span>AI Assistant</span>
          </button>
          {[Bell, Settings, HelpCircle].map((Icon, i) => (
            <button key={i} className="p-2 text-white hover:bg-[#005A9E] rounded transition-colors">
              <Icon size={20} />
            </button>
          ))}
          <div className="ml-2 flex items-center gap-2 pl-2 border-l border-white/20">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-white font-medium leading-tight">{user.displayName}</div>
              <div className="text-[10px] text-white/70 leading-tight">{user.email}</div>
            </div>
            <div className="w-8 h-8 bg-[#797775] rounded-full flex items-center justify-center text-white text-xs border border-white/20 overflow-hidden">
              {user.photoURL ? <img src={user.photoURL} alt="Avatar" referrerPolicy="no-referrer" /> : <UserIcon size={18} />}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-12">
        <Sidebar accounts={accounts} />
        <main className="flex-1 flex flex-col min-w-0 relative">
          <Header />
          
          {!accessToken ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
              <div className="max-w-md text-center space-y-6">
                <div className="w-16 h-16 bg-[#F3F2F1] rounded-full flex items-center justify-center mx-auto">
                  <Landmark size={32} className="text-[#0078D4]" />
                </div>
                <h2 className="text-2xl font-bold text-[#323130]">Connect Your Bank</h2>
                <p className="text-[#605E5C]">
                  To view your real-time transactions and balances, please securely connect your bank account via Plaid.
                </p>
                <PlaidLink onSuccess={handlePlaidSuccess} />
                <p className="text-[10px] text-[#A19F9D]">
                  Your credentials are never stored on our servers. We use industry-standard encryption to keep your data safe.
                </p>
              </div>
            </div>
          ) : (
            <>
              <FilterBar />
              {isLoading && transactions.length === 0 ? (
                <div className="flex-1 flex items-center justify-center bg-white">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-[#0078D4]" size={32} />
                    <span className="text-sm text-[#605E5C]">Fetching your financial data...</span>
                  </div>
                </div>
              ) : error && transactions.length === 0 ? (
                <div className="flex-1 flex items-center justify-center bg-white">
                  <div className="text-center space-y-4">
                    <X className="text-[#A4262C] mx-auto" size={48} />
                    <h3 className="text-lg font-semibold text-[#323130]">{error}</h3>
                    <button 
                      onClick={() => fetchData(accessToken)}
                      className="px-4 py-2 bg-[#0078D4] text-white rounded text-sm hover:bg-[#005A9E]"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <DataTable 
                  onSelectLog={setSelectedLog} 
                  selectedLogId={selectedLog?.id} 
                  transactions={transactions}
                />
              )}
            </>
          )}
          
          {/* Details Panel */}
          {selectedLog && (
            <div className="absolute top-0 right-0 bottom-0 w-[450px] bg-white shadow-2xl border-l border-[#EDEBE9] z-40 flex flex-col animate-in slide-in-from-right duration-200">
              <div className="p-4 border-b border-[#EDEBE9] flex items-center justify-between bg-[#F3F2F1]">
                <div className="flex items-center gap-2">
                  <Info size={18} className="text-[#0078D4]" />
                  <h3 className="font-semibold text-[#323130]">Transaction Details</h3>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-1 hover:bg-[#EDEBE9] rounded transition-colors"
                >
                  <X size={20} className="text-[#605E5C]" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <section>
                    <h4 className="text-xs font-bold text-[#605E5C] uppercase tracking-wider mb-3">Overview</h4>
                    <div className="grid grid-cols-3 gap-y-4 text-sm">
                      <div className="text-[#605E5C]">Date</div>
                      <div className="col-span-2 text-[#323130]">{selectedLog.date}</div>
                      
                      <div className="text-[#605E5C]">Description</div>
                      <div className="col-span-2 text-[#323130] font-semibold">{selectedLog.description}</div>
                      
                      <div className="text-[#605E5C]">Amount</div>
                      <div className={`col-span-2 font-bold text-lg ${selectedLog.amount < 0 ? 'text-[#107C10]' : 'text-[#A4262C]'}`}>
                        {selectedLog.amount < 0 ? '+' : '-'}${Math.abs(selectedLog.amount).toFixed(2)} {selectedLog.currency}
                      </div>

                      <div className="text-[#605E5C]">Status</div>
                      <div className="col-span-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedLog.status === 'Completed' ? 'bg-[#DFF6DD] text-[#107C10]' :
                          selectedLog.status === 'Pending' ? 'bg-[#FFF4CE] text-[#797775]' :
                          'bg-[#FDE7E9] text-[#A4262C]'
                        }`}>
                          {selectedLog.status}
                        </span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-[#605E5C] uppercase tracking-wider mb-3">Merchant Information</h4>
                    <div className="bg-[#F3F2F1] p-4 rounded text-sm text-[#323130] border border-[#EDEBE9] flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded border border-[#EDEBE9] flex items-center justify-center">
                        <CreditCard size={20} className="text-[#605E5C]" />
                      </div>
                      <div>
                        <div className="font-semibold">{selectedLog.merchant}</div>
                        <div className="text-xs text-[#605E5C]">{selectedLog.category}</div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-[#605E5C] uppercase tracking-wider mb-3">Account Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border border-[#EDEBE9] rounded text-sm">
                        <div className="flex items-center gap-2">
                          <Landmark size={16} className="text-[#605E5C]" />
                          <span className="text-[#323130]">{selectedLog.account}</span>
                        </div>
                        <span className="text-[#0078D4] text-xs font-medium cursor-pointer hover:underline">View Account</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-[#605E5C] uppercase tracking-wider mb-3">Technical Reference</h4>
                    <div className="grid grid-cols-3 gap-y-4 text-sm">
                      <div className="text-[#605E5C]">Reference #</div>
                      <div className="col-span-2 text-[#323130] font-mono text-xs">{selectedLog.reference}</div>
                      
                      <div className="text-[#605E5C]">Auth Code</div>
                      <div className="col-span-2 text-[#323130] font-mono text-xs">{Math.random().toString(36).substring(2, 8).toUpperCase()}</div>
                      
                      <div className="text-[#605E5C]">Terminal ID</div>
                      <div className="col-span-2 text-[#323130] font-mono text-xs">TERM-{Math.floor(Math.random() * 10000)}</div>
                    </div>
                  </section>
                </div>
              </div>
              
              <div className="p-4 border-t border-[#EDEBE9] bg-[#F3F2F1] flex gap-2 justify-end">
                <button className="px-4 py-1.5 bg-white border border-[#8A8886] text-sm font-semibold hover:bg-[#F3F2F1] transition-colors">
                  Report Issue
                </button>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-1.5 bg-[#0078D4] text-white text-sm font-semibold hover:bg-[#005A9E] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {showMonitor && <WebhookMonitor />}
          <CrossAppMessenger />

          {/* Footer Status Bar */}
          <footer className="h-8 bg-white border-t border-[#EDEBE9] px-4 flex items-center text-[11px] text-[#605E5C]">
            <span>Secure Connection: 256-bit SSL Encryption Active</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
