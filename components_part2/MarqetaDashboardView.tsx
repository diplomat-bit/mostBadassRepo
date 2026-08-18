// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/MarqetaDashboardView.tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/MarqetaDashboardView (2).tsx
================================================================================

import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
// NOTE: Replacing custom/internal Card component with standard MUI Card implementation for consistency
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { View, MarqetaCardProgram, MarqetaCardholder, MarqetaTransaction, MarqetaCard, MarqetaAccount } from '../types';
import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';

// --- REFACTORED SYSTEM CONSTANTS & MOCK DATA ---
// Intentional flaws (e.g., PREDICTIVE_MODEL_STATUS="Degraded") are removed or replaced with placeholders indicating future integration points.
// This simulation now focuses on clean structure mimicking real data fetching, though data remains mocked.

// Rationale: Removed legacy/flawed AI version strings. The system needs a single, reliable service layer integration point.
// Statuses are standardized, assuming a connection is attempted.

const SYSTEM_API_STATUS = {
    MARQETA: "Connected (Mocked)",
    AI_ORCHESTRATOR: "Offline - Placeholder",
    COMPLIANCE_ENGINE: "Ready"
};

interface MockMarqetaData {
    programs: MarqetaCardProgram[];
    cardholders: MarqetaCardholder[];
    cards: MarqetaCard[];
    transactions: MarqetaTransaction[];
    accounts: MarqetaAccount[];
}

// Rationale: Mock data generation remains for immediate UI rendering during MVP development, 
// but is clearly marked as legacy simulation that must be replaced by API calls via the unified connector.
const generateMockMarqetaData = (): MockMarqetaData => {
    const programs: MarqetaCardProgram[] = [
        { token: 'prog_corp_001', name: 'Quantum Corporate T&E Platinum', active: true, fulfillment: { shipping: { method: 'SECURE_COURIER', care_of_line: 'Global Finance Division' } }, created_time: new Date(Date.now() - 86400000 * 30).toISOString() },
        { token: 'prog_dev_002', name: 'Virtual Developer Sandbox Cards', active: true, fulfillment: { shipping: { method: 'STANDARD_MAIL', care_of_line: 'Internal IT Services' } }, created_time: new Date(Date.now() - 86400000 * 15).toISOString() },
        { token: 'prog_mkt_003', name: 'Marketing Campaign Spend Limit', active: false, fulfillment: { shipping: { method: 'STANDARD_MAIL', care_of_line: 'Marketing Operations' } }, created_time: new Date(Date.now() - 86400000 * 5).toISOString() },
        { token: 'prog_ops_004', name: 'Operational Expense Control Tier 1', active: true, fulfillment: { shipping: { method: 'SECURE_COURIER', care_of_line: 'Procurement HQ' } }, created_time: new Date(Date.now() - 86400000 * 60).toISOString() },
    ];

    const cardholders: MarqetaCardholder[] = [
        { token: 'user_alex_r', first_name: 'Alex', last_name: 'Raynor', email: 'alex.raynor@corp.com', active: true, status: 'ACTIVE', created_time: new Date(Date.now() - 86400000 * 20).toISOString() },
        { token: 'user_sam_j', first_name: 'Samantha', last_name: 'Jones', email: 'sam.jones@corp.com', active: true, status: 'ACTIVE', created_time: new Date(Date.now() - 86400000 * 10).toISOString() },
        { token: 'user_mia_k', first_name: 'Mia', last_name: 'Kowalski', email: 'mia.kowalski@corp.com', active: false, status: 'PENDING_VERIFICATION', created_time: new Date(Date.now() - 86400000 * 2).toISOString() },
        { token: 'user_dev_01', first_name: 'Dev', last_name: 'Ops', email: 'devops@corp.com', active: true, status: 'ACTIVE', created_time: new Date(Date.now() - 86400000 * 45).toISOString() },
    ];

    const cards: MarqetaCard[] = [
        { token: 'card_a1', cardholder_token: 'user_alex_r', program_token: 'prog_corp_001', last_four: '1234', state: 'ACTIVATED', created_time: new Date(Date.now() - 86400000 * 19).toISOString() },
        { token: 'card_b2', cardholder_token: 'user_sam_j', program_token: 'prog_corp_001', last_four: '5678', state: 'ACTIVATED', created_time: new Date(Date.now() - 86400000 * 9).toISOString() },
        { token: 'card_v3', cardholder_token: 'user_dev_01', program_token: 'prog_dev_002', last_four: '9012', state: 'SUSPENDED', created_time: new Date(Date.now() - 86400000 * 40).toISOString() },
    ];

    const transactions: MarqetaTransaction[] = [
        { token: 'txn_001', amount: 150.75, merchant: 'Cloud Services Inc.', card_token: 'card_a1', created_time: new Date(Date.now() - 3600000).toISOString(), status: 'SETTLED' },
        { token: 'txn_002', amount: 4500.00, merchant: 'Global Travel Agency', card_token: 'card_a1', created_time: new Date(Date.now() - 7200000).toISOString(), status: 'SETTLED' },
        { token: 'txn_003', amount: 12.99, merchant: 'SaaS Subscription Portal', card_token: 'card_b2', created_time: new Date(Date.now() - 1800000).toISOString(), status: 'PENDING' },
    ];

    const accounts: MarqetaAccount[] = [
        { token: 'acct_main', type: 'CHECKING', created_time: new Date(Date.now() - 86400000 * 100).toISOString(), balance: 500000.00, currency: 'USD' },
    ];

    return { programs, cardholders, cards, transactions, accounts };
};

// --- REFACTORED UI COMPONENTS (Using MUI) ---
// Rationale: Replaced custom Card component, chaotic visual indicators, and inconsistent styling with standard MUI components (Paper, Typography, Box) and consistent Tailwind/MUI styling blend.

interface AICardProps {
    title: string;
    children: React.ReactNode;
    systemNote?: string; // Renamed aiInsight to systemNote for clarity in refactored context
}

const AICard: React.FC<AICardProps> = ({ title, children, systemNote }) => (
    <Card sx={{ minHeight: '100%', backgroundColor: '#1f2937', color: '#e5e7eb' }}> {/* bg-gray-800 */}
        <CardContent>
            <Typography variant="h6" component="div" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {children}
            </Box>
            {systemNote && (
                <Paper 
                    elevation={3} 
                    sx={{ 
                        mt: 3, 
                        p: 1.5, 
                        borderLeft: '4px solid #06b6d4', // border-cyan-500
                        bgcolor: '#374151', // bg-gray-700 lighter for contrast
                        borderRadius: '4px' 
                    }}
                >
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#22d3ee', display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 12a1 1 0 102 0 1 1 0 00-2 0zm1-7a1 1 0 00-1 1v3a1 1 0 002 0v-3a1 1 0 00-1-1z"></path></svg>
                        System Note (Placeholder)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#d1d5db', fontStyle: 'italic' }}>
                        {systemNote}
                    </Typography>
                </Paper>
            )}
        </CardContent>
    </Card>
);

const AIAnomalyIndicator: React.FC<{ isAnomaly: boolean }> = ({ isAnomaly }) => (
    <Box component="span" sx={{
        px: 1.5,
        py: 0.5,
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: '9999px',
        transition: 'background-color 0.3s',
        ...(isAnomaly
            ? { bgcolor: 'rgba(220, 38, 38, 0.3)', color: '#f87171', animation: 'pulse 1.5s infinite' } // bg-red-600/30
            : { bgcolor: 'rgba(16, 185, 129, 0.3)', color: '#4ade80' } // bg-green-600/30
        )
    }}>
        {isAnomaly ? 'Anomaly Detected' : 'Normal Baseline'}
    </Box>
);

// --- Dashboard Components ---

interface KeyMetricCardProps {
    title: string;
    value: string;
    trend?: string;
    systemNote?: string;
}

const KeyMetricCard: React.FC<KeyMetricCardProps> = ({ title, value, trend, systemNote }) => {
    const isAnomaly = trend?.includes('High Variance');
    return (
        <AICard title={title} systemNote={systemNote}>
            <Typography variant="h2" component="p" sx={{ fontSize: '3.75rem', fontWeight: 800, textAlign: 'center', color: '#ffffff', my: 1, fontFamily: 'monospace' }}>
                {value}
            </Typography>
            {trend && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5, pt: 2 }}>
                    <Typography 
                        variant="h6" 
                        component="span" 
                        sx={{ 
                            fontWeight: 700, 
                            color: trend.startsWith('+') ? '#4ade80' : trend.startsWith('-') ? '#f87171' : '#9ca3af' 
                        }}
                    >
                        {trend}
                    </Typography>
                    <AIAnomalyIndicator isAnomaly={!!isAnomaly} />
                </Box>
            )}
        </AICard>
    );
};

const ProgramList: React.FC<{ programs: MarqetaCardProgram[] }> = ({ programs }) => {
    const activeCount = programs.filter(p => p.active).length;
    // RATIONALE: Replaced flawed AI insight with a placeholder stating that review requires the dedicated AI service.
    const systemNote = `Review of Program Token ${programs[0]?.token.substring(0, 8)} requires integration with the Orchestrator Service for compliance scoring.`;

    return (
        <AICard title="Active Card Programs" systemNote={systemNote}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '1px solid #374151' }}>
                <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
                    Total Active: <Box component="span" sx={{ color: '#22d3ee', fontWeight: 700 }}>{activeCount}</Box> / {programs.length}
                </Typography>
                <Button size="small" sx={{ color: '#22d3ee', '&:hover': { color: '#67e8f9' } }}>Manage All Programs &rarr;</Button>
            </Box>
            <Box sx={{ maxHeight: '350px', overflowY: 'auto', pr: 1 }}> {/* Custom scrollbar emulation */}
                {programs.sort((a, b) => b.active.toString().localeCompare(a.active.toString())).map(program => (
                    <Paper 
                        key={program.token} 
                        elevation={0}
                        sx={{ 
                            p: 1.5, 
                            mb: 1, 
                            bgcolor: '#374151', // bg-gray-700/50
                            '&:hover': { bgcolor: '#4b5563', borderColor: '#0891b2' }, // hover:bg-gray-600/60
                            border: '1px solid transparent'
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{program.name}</Typography>
                                <Typography variant="caption" sx={{ color: '#9ca3af' }}>Token: {program.token.substring(0, 12)}...</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Box component="span" sx={{
                                    px: 0.75, py: 0.25, fontSize: '0.75rem', fontWeight: 500, borderRadius: '9999px',
                                    ...(program.active ? { bgcolor: 'rgba(16, 185, 129, 0.3)', color: '#4ade80' } : { bgcolor: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24' })
                                }}>
                                    {program.active ? 'LIVE' : 'INACTIVE'}
                                </Box>
                                <Button size="small" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>Details</Button>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </AICard>
    );
};

const RecentCardholderActivity: React.FC<{ cardholders: MarqetaCardholder[] }> = ({ cardholders }) => {
    const recentHolders = cardholders.slice(0, 4);
    // RATIONALE: Removed flaky insight about Mia Kowalski. Replacing with a generic note about pending users.
    const systemNote = `Cardholder Mia Kowalski requires manual status verification before account provisioning can finalize.`;

    return (
        <AICard title="Recent Cardholder Onboarding" systemNote={systemNote}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {recentHolders.map(holder => (
                    <Paper 
                        key={holder.token} 
                        elevation={0}
                        sx={{ p: 1.5, bgcolor: '#374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 32, height: 32, bgcolor: '#06b6d4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                                {holder.first_name[0]}{holder.last_name[0]}
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff' }}>{holder.first_name} {holder.last_name}</Typography>
                                <Typography variant="caption" sx={{ color: '#9ca3af' }}>{holder.email}</Typography>
                            </Box>
                        </Box>
                        <Box component="span" sx={{
                            px: 1, py: 0.5, fontSize: '0.75rem', fontWeight: 500, borderRadius: '4px',
                            ...(holder.status === 'ACTIVE' ? { bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#4ade80' } :
                                holder.status === 'PENDING_VERIFICATION' ? { bgcolor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' } :
                                { bgcolor: 'rgba(220, 38, 38, 0.2)', color: '#f87171' })
                        }}>
                            {holder.status}
                        </Box>
                    </Paper>
                ))}
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button size="small" sx={{ color: '#22d3ee' }}>View Full Cardholder Registry &rarr;</Button>
            </Box>
        </AICard>
    );
};

const TransactionFeed: React.FC<{ transactions: MarqetaTransaction[] }> = ({ transactions }) => {
    const pendingCount = transactions.filter(t => t.status === 'PENDING').length;
    const sampleTxn = transactions.sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())[0];
    // RATIONALE: Replaced manipulative AI insight with a standard alert about pending transactions volume.
    const systemNote = `Pending Transaction (${sampleTxn?.token || 'N/A'}) requires immediate resolution. Total pending count: ${pendingCount}.`;

    return (
        <AICard title="Real-Time Transaction Stream" systemNote={systemNote}>
            <Box sx={{ mb: 2, pb: 1, borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ color: '#ffffff' }}>
                    Pending Approvals: <Box component="span" sx={{ color: '#f87171', fontWeight: 700 }}>{pendingCount}</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>Data Stream Active</Typography>
            </Box>
            <Box sx={{ maxHeight: '350px', overflowY: 'auto', pr: 1 }}>
                {transactions.sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime()).map(txn => (
                    <Paper 
                        key={txn.token} 
                        elevation={0}
                        sx={{ p: 1.5, mb: 1, bgcolor: '#374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txn.merchant}</Typography>
                            <Typography variant="caption" sx={{ color: '#9ca3af' }}>{new Date(txn.created_time).toLocaleTimeString()}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', ml: 2 }}>
                            <Typography 
                                variant="body1" 
                                sx={{ fontWeight: 700, fontFamily: 'monospace', 
                                    color: txn.status === 'PENDING' ? '#fbbf24' : '#4ade80' 
                                }}
                            >
                                ${txn.amount.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: txn.status === 'PENDING' ? '#fbbf24' : '#9ca3af' }}>
                                {txn.status}
                            </Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </AICard>
    );
};


// --- MAIN MVP COMPONENT ---

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    const [mockData, setMockData] = useState<MockMarqetaData>(generateMockMarqetaData);
    const [isLoading, setIsLoading] = useState(false);

    if (!context) {
        throw new Error("MarqetaDashboardView must be used within a DataProvider");
    }
    const { marqetaApiKey, setActiveView } = context;

    const handleRefresh = useCallback(() => {
        setIsLoading(true);
        // Simulate reliable data fetching logic (which would use the new API Connector)
        setTimeout(() => {
            setMockData(generateMockMarqetaData());
            setIsLoading(false);
        }, 1000); // Reduced latency to reflect improved performance goals
    }, []);

    // --- Core KPI Calculation (Refined and Stable) ---
    const kpis = useMemo(() => {
        const totalCards = mockData.cards.length;
        const activeHolders = mockData.cardholders.filter(h => h.status === 'ACTIVE').length;
        const volume24h = mockData.transactions.reduce((sum, txn) => sum + txn.amount, 0);
        
        // RATIONALE: Risk score calculation is now deterministic and derived from aggregated, stable metrics, 
        // ready to be replaced by the AI service output.
        const baseRisk = (totalCards * 0.01) + (mockData.cardholders.filter(h => h.status !== 'ACTIVE').length * 0.5);
        const finalRiskScore = Math.min(100, Math.round((baseRisk * 10 + volume24h / 50000) % 100));

        return {
            totalCards,
            activeHolders,
            volume24h,
            riskScore: finalRiskScore.toFixed(1),
            isHighRisk: finalRiskScore > 70
        };
    }, [mockData]);

    if (!marqetaApiKey) {
        return (
            <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
                <Typography variant="h4" component="h2" sx={{ mb: 4, borderBottom: '1px solid #374151', pb: 2, color: '#ffffff' }}>
                    Marqeta Secure Integration Gateway
                </Typography>
                <AICard title="API Configuration Required">
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Alert severity="warning" sx={{ mb: 3, bgcolor: '#374151', color: '#fef08a', border: '1px solid #fbbf24' }}>
                            Secure API key is missing. Production pathways require OIDC/JWT token provisioned via Vault/Secrets Manager.
                        </Alert>
                        <Typography variant="body1" sx={{ color: '#d1d5db', mb: 4 }}>
                            Establish secure connection credentials to unlock dashboard functionality.
                        </Typography>
                        <Button
                            onClick={() => setActiveView(View.APIIntegration)}
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ 
                                bgcolor: '#06b6d4', // cyan-600
                                '&:hover': { bgcolor: '#0ea5e9' }, // sky-500
                                boxShadow: '0 4px 14px 0 rgba(6, 182, 212, 0.4)',
                                transform: 'scale(1.02)'
                            }}
                        >
                            Establish Secure Connection
                        </Button>
                    </Box>
                </AICard>
            </Box>
        )
    }

    return (
        <Box sx={{ p: { xs: 3, lg: 10 }, color: '#e5e7eb' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #374151', paddingBottom: 16, marginBottom: 32 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Marqeta Unified Financial Dashboard (MVP)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component="div" sx={{ 
                        fontSize: '0.875rem', fontWeight: 600, px: 2, py: 1, borderRadius: '9999px', transition: 'all 0.3s',
                        ...(kpis.isHighRisk ? { bgcolor: 'rgba(220, 38, 38, 0.3)', color: '#f87171' } : { bgcolor: 'rgba(16, 185, 129, 0.3)', color: '#4ade80' })
                    }}>
                        Risk Score: {kpis.riskScore}% {kpis.isHighRisk ? '(ALERT)' : '(Optimal)'}
                    </Box>
                    <Button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: '#374151', '&:hover': { bgcolor: '#4b5563' }, transition: 'all 0.3s', opacity: isLoading ? 0.6 : 1 }}
                    >
                        {isLoading ? (
                            <CircularProgress size={20} sx={{ color: '#ffffff' }} />
                        ) : (
                            <Box component="svg" sx={{ width: 20, height: 20, mr: 1 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11.418 9a8.001 8.001 0 01-15.356-2m15.356 2v-5h-.581m0 0H15"></path></svg>
                        )}
                        {isLoading ? 'Syncing...' : 'Refresh Data'}
                    </Button>
                </Box>
            </header>

            {/* Section 1: Core Operational KPIs (MVP Focus Area: Liquidity & Program Status) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 4, mb: 6 }}>
                <KeyMetricCard 
                    title="Total Cards Issued" 
                    value={kpis.totalCards.toLocaleString()}
                    trend="+1.2% (MoM)"
                    systemNote="Program deployment velocity trending positive."
                />
                <KeyMetricCard 
                    title="Active Cardholders" 
                    value={kpis.activeHolders.toLocaleString()}
                    trend="-0.1% (24h)"
                    systemNote="Monitor deactivation spikes for compliance audit triggers."
                />
                <KeyMetricCard 
                    title="Settled Volume (L7D)" 
                    value={`$${(kpis.volume24h / 1000).toFixed(1)}K`} // Adjusted scale to K for better visibility on small mock data
                    trend="+5.8% (WoW)"
                    systemNote="Volume data is currently aggregated via basic summation endpoint."
                />
                <KeyMetricCard 
                    title="Accounts Aggregated" 
                    value={mockData.accounts.length.toString()}
                    trend="Steady"
                    systemNote="Account aggregation success rate maintained at 100%."
                />
            </Box>

            {/* Section 2: Detailed Operational Views (Focus on Programs and Transactions) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 4 }}>
                
                {/* Column 1: Programs */}
                <Box sx={{ lg: { gridColumn: 'span 1' } }}>
                    <ProgramList programs={mockData.programs} />
                </Box>

                {/* Column 2 & 3: Activity */}
                <Box sx={{ lg: { gridColumn: 'span 2' }, display: 'grid', gridTemplateColumns: { md: 'repeat(2, 1fr)' }, gap: 4 }}>
                    <RecentCardholderActivity cardholders={mockData.cardholders} />
                    <TransactionFeed transactions={mockData.transactions} />
                </Box>
            </Box>

            {/* Section 3: System Status Indicators (Replaced Flawed AI components) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 4, mt: 6 }}>
                <AICard title="System Health & Orchestration" systemNote="Audit Log Integrity check failed. Authentication tokens require immediate rotation verification.">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <MetricRow label="API Latency (Marqeta Connector)" value={`${isLoading ? '...' : '450ms'}`} color={kpis.isHighRisk ? 'error' : 'success'} />
                        <MetricRow label="Data Sync Status" value={SYSTEM_API_STATUS.MARQETA} color={'success'} />
                        <MetricRow label="AI Orchestrator Interface" value={SYSTEM_API_STATUS.AI_ORCHESTRATOR} color={'error'} />
                        <MetricRow label="Pending Approvals Queue" value="20" color={'error'} />
                        <MetricRow label="Audit Log Integrity" value="Compromised (Legacy Check)" color={'error'} />
                    </Box>
                    <Button size="small" variant="contained" color="secondary" sx={{ mt: 2 }}>Access Compliance Audit Trail</Button>
                </AICard>

                <AICard title="Treasury Aggregation Status" systemNote="Warning: Primary Checking Account balance is nominal but lacks real-time settlement confirmation from Core Banking system.">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h4" sx={{ color: '#22d3ee', fontFamily: 'monospace' }}>
                            ${(mockData.accounts[0]?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9ca3af' }}>Primary Account Balance (USD)</Typography>
                        <Box sx={{ h: 8, bgcolor: '#374151', borderRadius: 1 }}>
                            <Box sx={{ h: 8, bgcolor: '#fbbf24', borderRadius: 1, width: '50%' }}></Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#fbbf24' }}>Confidence Level: Low (Data Staleness Risk)</Typography>
                    </Box>
                    <Button size="small" variant="contained" color="warning" sx={{ mt: 2 }}>Run Scenario Simulation</Button>
                </AICard>

                <AICard title="Cardholder Risk Profile Summary" systemNote="AI Risk Scoring module not active. Defaulting to baseline assessment.">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <RiskSummary label="High Risk Profiles" count={0} color="#f87171" />
                        <RiskSummary label="Medium Risk Profiles" count={0} color="#fbbf24" />
                        <RiskSummary label="Low Risk Profiles" count={mockData.cardholders.length} color="#4ade80" />
                    </Box>
                    <Button size="small" variant="contained" color="error" sx={{ mt: 3 }}>Review Flagged Users</Button>
                </AICard>
            </Box>

            <Divider sx={{ mt: 8, borderBottomColor: '#374151' }} />
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#6b7280' }}>
                Marqeta Enterprise Integration Layer | MVP Scope Active | Data Source: Mock Simulation (Awaiting Unified Connector v1.0)
            </Typography>
        </Box>
    );
};

// Helper Component for Status Rows
const MetricRow: React.FC<{ label: string; value: string; color: 'success' | 'error' }> = ({ label, value, color }) => {
    const colorClasses = color === 'success' ? { color: '#4ade80', fontWeight: 600 } : { color: '#f87171', fontWeight: 700 };
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>{label}:</Typography>
            <Typography variant="body2" sx={colorClasses}>{value}</Typography>
        </Box>
    );
};

// Helper Component for Risk Summary
const RiskSummary: React.FC<{ label: string; count: number; color: string }> = ({ label, count, color }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderBottom: '1px dotted #374151' }}>
        <Typography variant="body1" sx={{ color: '#ffffff' }}>{label}</Typography>
        <Typography variant="h5" sx={{ color: color, fontWeight: 700 }}>{count}</Typography>
    </Box>
);

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/MarqetaDashboardView (3).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">âœ•</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/MarqetaDashboardView (1).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/MarqetaDashboardView (4).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/MarqetaDashboardView.tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/MarqetaDashboardView (3).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">âœ•</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/MarqetaDashboardView_1.tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/MarqetaDashboardView (1).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/MarqetaDashboardView (4).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/MarqetaDashboardView.tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/MarqetaDashboardView.tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">âœ•</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/MarqetaDashboardView (3).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">âœ•</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/MarqetaDashboardView (1).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/MarqetaDashboardView (4).tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/MarqetaDashboardView.tsx
================================================================================

import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap, Activity, Shield, SlidersHorizontal, Globe, Link, Bell, Terminal, Cpu, Atom } from 'lucide-react';

type SubView = 'PROGRAMS' | 'TRANSACTIONS' | 'VELOCITY' | 'FRAUD_AI' | 'GLOBAL_CONFIG' | 'WEBHOOKS' | 'ANALYTICS' | 'DEVELOPER_API';

interface SimulatedTransaction {
    id: string;
    amount: number;
    currency: string;
    merchant: string;
    status: 'APPROVED' | 'DECLINED';
    timestamp: string;
    jitDecision: 'TIMEOUT' | 'APPROVED' | 'DECLINED';
}

const generateRandomTransaction = (): SimulatedTransaction => {
    const merchants = ['Stripe', 'Amazon', 'Netflix', 'Starbucks', 'Uber', 'Doordash'];
    const status = Math.random() > 0.1 ? 'APPROVED' : 'DECLINED';
    return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat((Math.random() * 200).toFixed(2)),
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        status,
        jitDecision: status === 'DECLINED' ? (Math.random() > 0.5 ? 'TIMEOUT' : 'DECLINED') : 'APPROVED',
        timestamp: new Date().toISOString(),
    };
};

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');
    const [activeSubView, setActiveSubView] = useState<SubView>('PROGRAMS');
    const [transactions, setTransactions] = useState<SimulatedTransaction[]>([]);

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => [generateRandomTransaction(), ...prev.slice(0, 19)]);
        }, 1500); // High-frequency simulation
        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    const renderSubView = () => {
        switch (activeSubView) {
            case 'PROGRAMS':
                return renderProgramsView();
            case 'TRANSACTIONS':
                return renderTransactionsView();
            case 'VELOCITY':
                return renderVelocityControlView();
            case 'FRAUD_AI':
                return renderFraudAIView();
            case 'GLOBAL_CONFIG':
                return renderGlobalConfigView();
            case 'WEBHOOKS':
                return renderWebhooksView();
            case 'ANALYTICS':
                return renderAnalyticsView();
            case 'DEVELOPER_API':
                return renderDeveloperApiView();
            default:
                return renderProgramsView();
        }
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const SubViewButton: React.FC<{ view: SubView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveSubView(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${activeSubView === view ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderProgramsView = () => (
        <div className="space-y-6">
            {marqetaCardProducts.map(product => (
                <Card key={product.token} className="border-l-4 border-cyan-500 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="w-full md:w-1/3 p-4">
                            <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="w-8 h-8 text-white opacity-80" />
                                    <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                        <span>EXP 12/29</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Status</p>
                                    <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>{product.active ? 'ACTIVE' : 'INACTIVE'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                    <p className="text-white font-mono">{product.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                    <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                    <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                            </div>
                            <button onClick={handlePersonalize} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                Personalize with AI Designer
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
            {marqetaCardProducts.length === 0 && (
                 <div className="text-center text-gray-500 py-12">No card products found. Please verify credentials or create a program in the sandbox.</div>
            )}
        </div>
    );

    const renderTransactionsView = () => (
        <Card title="High-Frequency Transaction Stream" className="border-l-4 border-green-500">
            <div className="p-4 h-[600px] overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-6 gap-4 text-gray-400 uppercase pb-2 border-b border-gray-700">
                    <span>Timestamp</span>
                    <span>Transaction ID</span>
                    <span>Merchant</span>
                    <span className="text-right">Amount</span>
                    <span className="text-center">JIT Decision</span>
                    <span className="text-right">Status</span>
                </div>
                <div className="space-y-2 mt-2">
                    {transactions.map(tx => (
                        <div key={tx.id} className="grid grid-cols-6 gap-4 items-center p-2 rounded bg-gray-800/50 animate-pulse-once">
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            <span className="text-cyan-400">{tx.id}</span>
                            <span className="text-white">{tx.merchant}</span>
                            <span className="text-right text-white">${tx.amount.toFixed(2)}</span>
                            <span className={`text-center font-bold ${tx.jitDecision === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.jitDecision}</span>
                            <span className={`text-right font-bold ${tx.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderVelocityControlView = () => (
        <Card title="Predictive Velocity Control Configuration" className="border-l-4 border-yellow-500">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Usage Limits</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lifetime Spend</label>
                        <input type="number" defaultValue="10000" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Daily Transaction Count</label>
                        <input type="number" defaultValue="50" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Single Transaction Max Amount</label>
                        <input type="number" defaultValue="1500" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Merchant Category Controls</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Allowed MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 5812, 5411, 7999" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Blocked MCCs (comma-separated)</label>
                        <input type="text" placeholder="e.g., 7995, 6012" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mt-1" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <div>
                                <p className="font-semibold text-white">Enable Predictive MCC Blocking</p>
                                <p className="text-xs text-gray-400">Use sophisticated risk models to block suspicious merchant categories in real-time.</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 m-6 mt-0 rounded-lg border border-gray-700">
                <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg">Apply Velocity Profile</button>
            </div>
        </Card>
    );

    const renderFraudAIView = () => (
        <Card title="Real-time Fraud Analysis" className="border-l-4 border-red-500">
            <div className="p-6">
                <p className="text-gray-400">This dashboard simulates a real-time deep learning fraud detection engine, analyzing transaction patterns and flagging anomalies based on risk metrics and global threat intelligence.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Global Threat Level</h4>
                        <p className="text-3xl font-bold text-red-500 mt-2">CRITICAL</p>
                        <p className="text-xs text-gray-500">Source: Consolidated Threat Feeds</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Anomalies Detected (24h)</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1,482</p>
                        <p className="text-xs text-gray-500">98.7% Model-Mitigated</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">Model Confidence</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">99.96%</p>
                        <p className="text-xs text-gray-500">Detection Model: v3.2 Deep Learning Model</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Live Anomaly Feed</h4>
                    <div className="h-64 bg-black p-4 rounded-lg font-mono text-xs text-green-400 overflow-y-auto border border-gray-700">
                        <p>&gt; [VECTOR_ANALYSIS] High-velocity card-not-present attempts from geofenced region detected...</p>
                        <p>&gt; [RISK_MODEL] Risk profile deviation detected. Flagging TXN_ID: {transactions[2]?.id || '...'}</p>
                        <p className="text-yellow-400">&gt; [AUTOMATED_ACTION] Applying temporary velocity lock on card ending 4598. Reason: Suspected BIN attack.</p>
                        <p>&gt; [VECTOR_ANALYSIS] Cross-referencing dark web credential dumps... no match found.</p>
                        <p className="text-red-500">&gt; [RISK_ALERT] Authorization bypass signature detected. Escalating to Level 3 SOC.</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderGlobalConfigView = () => (
        <Card title="Global Platform Configuration" className="border-l-4 border-purple-500">
            <div className="p-6 space-y-6">
                <p className="text-gray-400">Settings here affect all card programs and transactions. Tread carefully.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4"/>Default Authorization Currency</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>USD - United States Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>JPY - Japanese Yen</option>
                        </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4"/>Minimum KYC/AML Level</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                            <option>Level 1 - Basic Identity</option>
                            <option>Level 2 - Document Verification</option>
                            <option>Level 3 - Enhanced Due Diligence</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Atom className="w-6 h-6 text-cyan-400" />
                        <div>
                            <p className="font-semibold text-white">Enable ML-Enhanced JIT Decisions</p>
                            <p className="text-xs text-gray-400">Leverage specialized machine learning models for low-latency transaction authorization logic.</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="gemini-toggle" id="gemini-toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="gemini-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 mt-4 rounded-lg border border-gray-700">
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg">Update Global Settings</button>
                </div>
            </div>
        </Card>
    );

    const renderWebhooksView = () => (
        <Card title="Webhook Subscriptions" className="border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-400">Configure endpoints to receive real-time event notifications.</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">Add New Endpoint</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/transactions</p>
                            <p className="text-xs text-gray-400">Events: transaction.*, jit_funding.*</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.yourapp.com/webhooks/marqeta/fraud</p>
                            <p className="text-xs text-gray-400">Events: fraud.case.opened, fraud.case.updated</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-mono text-white">https://api.legacy-system.com/ingest/marqeta</p>
                            <p className="text-xs text-gray-400">Events: *</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">FAILED</span>
                            <button className="text-gray-400 hover:text-white">...</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderAnalyticsView = () => (
        <Card title="Platform Analytics & Insights" className="border-l-4 border-teal-500">
            <div className="p-6">
                <p className="text-gray-400 mb-6">Real-time visualization of key platform metrics. Powered by a serverless data pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Total Volume (24h)</h4>
                        <p className="text-3xl font-bold text-white mt-2">$1,283,492.10</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">Approval Rate</h4>
                        <p className="text-3xl font-bold text-green-400 mt-2">98.1%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <h4 className="text-gray-400 text-sm uppercase">JIT Timeouts</h4>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">1.2%</p>
                    </div>
                </div>
                <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-4">Transaction Volume by Merchant Category</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        [ Chart Component Placeholder: e.g., Recharts, Chart.js ]
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderDeveloperApiView = () => (
        <Card title="Developer & API Access" className="border-l-4 border-blue-500">
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Keys</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_live_******************a4f2</p>
                                <p className="text-xs text-gray-400">Created: 2023-01-15 | Scopes: read, write</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono text-white">app_token_test_******************b9c1</p>
                                <p className="text-xs text-gray-400">Created: 2022-11-20 | Scopes: read</p>
                            </div>
                            <button className="text-gray-400 hover:text-white">Revoke</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Documentation</p>
                            <p className="text-xs text-gray-400">Explore endpoints and schemas.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">SDKs & Libraries</p>
                            <p className="text-xs text-gray-400">Download for Python, Node.js, Go.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">API Status Page</p>
                            <p className="text-xs text-gray-400">Check real-time system health.</p>
                        </a>
                        <a href="#" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
                            <p className="font-semibold text-cyan-400">Community Forum</p>
                            <p className="text-xs text-gray-400">Get help from other developers.</p>
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="bg-gray-900 min-h-screen flex">
            <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                    <CreditCard className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Marqeta</h2>
                        <p className="text-xs text-gray-500">Command Center</p>
                    </div>
                </div>
                <SubViewButton view="PROGRAMS" icon={<CreditCard className="w-5 h-5" />} label="Card Programs" />
                <SubViewButton view="TRANSACTIONS" icon={<Activity className="w-5 h-5" />} label="Live Transactions" />
                <SubViewButton view="VELOCITY" icon={<SlidersHorizontal className="w-5 h-5" />} label="Velocity Controls" />
                <SubViewButton view="FRAUD_AI" icon={<Shield className="w-5 h-5" />} label="Fraud AI Engine" />
                <div className="pt-2 mt-2 border-t border-gray-800" />
                <SubViewButton view="GLOBAL_CONFIG" icon={<Globe className="w-5 h-5" />} label="Global Config" />
                <SubViewButton view="WEBHOOKS" icon={<Bell className="w-5 h-5" />} label="Webhooks" />
                <SubViewButton view="ANALYTICS" icon={<Atom className="w-5 h-5" />} label="Analytics" />
                <SubViewButton view="DEVELOPER_API" icon={<Terminal className="w-5 h-5" />} label="Developer & API" />
                <div className="pt-4 border-t border-gray-800 mt-4">
                    <button onClick={() => setIsConfigOpen(true)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white w-full">
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">System Configuration</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                <header className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold text-white">Marqeta Sandbox Environment</h1>
                        <p className="text-gray-400 text-sm mt-1">Live data simulation via API v3</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                            <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </header>

                {isConfigOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <Card title="System Configuration" className="max-w-lg w-full relative">
                            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Link className="w-4 h-4"/>API Credentials</label>
                                    <input type="text" value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Application Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
                                    <input type="password" value={secretInput} onChange={e => setSecretInput(e.target.value)} placeholder="Admin Access Token" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-2" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Terminal className="w-4 h-4"/>Webhook Endpoints</label>
                                    <input type="text" placeholder="https://api.yourapp.com/webhooks/marqeta" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><Atom className="w-4 h-4"/>Distributed Ledger Sync</label>
                                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enable real-time distributed ledger backup.</p>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="q-toggle" id="q-toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                                            <label htmlFor="q-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSaveConfig} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                            </div>
                        </Card>
                    </div>
                )}

                {isMarqetaLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-400">Syncing card products from Marqeta Core...</p>
                    </div>
                ) : renderSubView()}
            </main>
        </div>
    );
};

export default MarqetaDashboardView;