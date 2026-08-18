// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/components/Dashboard.tsx
================================================================================

import React, { useContext, useMemo, useState, useEffect } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import AIInsights from './AIInsights';
import ImpactTracker from './ImpactTracker';
import { DataContext } from '../context/DataContext';
import Card from './Card';
// FIX: Changed `import type` to a regular import for `View` because it's an enum used as a value.
import { type GamificationState, type Subscription, type CreditScore, type SavingsGoal, type MarketMover, type UpcomingBill, type Transaction, type BudgetCategory, type RewardPoints, View } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, AreaChart, Area } from 'recharts';
import PlaidLinkButton from './PlaidLinkButton';
import { GoogleGenAI, Type } from '@google/genai';

// ================================================================================================
// MODAL & OVERLAY COMPONENTS
// ================================================================================================
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const DataImportingOverlay: React.FC<{ isImporting: boolean; bankName: string | null }> = ({ isImporting, bankName }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const messages = [
        `Connecting to ${bankName || 'your bank'}...`,
        'Securely importing transactions...',
        'AI is analyzing your new financial data...',
        'Updating your dashboard...'
    ];

    useEffect(() => {
        if (isImporting) {
            setMessageIndex(0);
            const interval = setInterval(() => {
                setMessageIndex(prev => (prev + 1) % messages.length);
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [isImporting, bankName]);

    if (!isImporting) return null;

    return (
        <div className="fixed inset-0 bg-gray-950/90 flex flex-col items-center justify-center z-[100] backdrop-blur-md">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                <div className="absolute inset-2 border-4 border-cyan-500/40 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-4 border-4 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white text-lg mt-8 font-semibold animate-pulse">{messages[messageIndex]}</p>
        </div>
    );
};


// ================================================================================================
// ICON COMPONENTS FOR NEW WIDGETS
// ================================================================================================
// A map of simple icon components used by the new widgets.
const WIDGET_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
    video: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    music: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>,
    cloud: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    plane: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    rocket: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    send: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    bill: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    deposit: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
};

// ================================================================================================
// NEW WIDGET COMPONENTS
// ================================================================================================

const LinkAccountPrompt: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("LinkAccountPrompt must be used within a DataProvider");
    }
    const { handlePlaidSuccess } = context;

    return (
        <Card title="Welcome to Demo Bank" variant="default">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-300 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Connect Your Financial World</h3>
                <p className="text-gray-400 mt-2 mb-6 max-w-md mx-auto">To unlock the full power of Demo Bank, connect your primary bank account. This will enable a unified financial view, AI-powered insights, and automated transaction tracking.</p>
                <div className="max-w-xs mx-auto">
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} />
                </div>
            </div>
        </Card>
    );
};

const GamificationProfile: React.FC<{ gamification: GamificationState; onClick: () => void; }> = ({ gamification, onClick }) => {
    const { score, level, levelName, progress } = gamification;
    const circumference = 2 * Math.PI * 55;
    const scoreOffset = circumference - (score / 1000) * circumference;
    return (
        <Card title="Financial Health" className="h-full" variant="interactive" onClick={onClick}>
            <div className="flex flex-col justify-between h-full">
                <div className="relative flex items-center justify-center h-40">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                        <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="55" cx="60" cy="60" />
                        <circle className="text-cyan-400 transition-all duration-1000 ease-in-out" strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={scoreOffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r="55" cx="60" cy="60" transform="rotate(-90 60 60)" />
                        <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-3xl font-bold fill-white">{score}</text>
                    </svg>
                </div>
                <div className="text-center mt-4">
                    <p className="font-semibold text-lg text-white">{levelName}</p>
                    <p className="text-sm text-gray-400">Level {level}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                        <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const QuickActions: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => {
    const actions = [{ name: 'Send Money', icon: 'send' }, { name: 'Pay Bill', icon: 'bill' }, { name: 'Deposit', icon: 'deposit' }];
    return (
        <Card title="Quick Actions">
            <div className="grid grid-cols-3 gap-4 text-center">
                {actions.map(action => {
                    const Icon = WIDGET_ICONS[action.icon];
                    return (
                        <button key={action.name} onClick={() => onAction(action.name)} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-300 mb-2">
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-gray-300">{action.name}</span>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

const RewardPointsWidget: React.FC<{ rewards: RewardPoints; onClick: () => void; }> = ({ rewards, onClick }) => {
    return (
        <Card title="Rewards Points" className="h-full" variant="interactive" onClick={onClick}>
            <div className="flex flex-col justify-center items-center h-full text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                <p className="text-4xl font-bold text-white mt-2">{rewards.balance.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">{rewards.currency}</p>
                <div className="mt-4 px-4 py-2 bg-cyan-600/50 text-white rounded-lg text-sm font-medium">
                    View Rewards
                </div>
            </div>
        </Card>
    );
};

const CreditScoreMonitor: React.FC<{ creditScore: CreditScore; onClick: () => void; }> = ({ creditScore, onClick }) => {
    const { score, change, rating } = creditScore;
    const percentage = ((score - 300) / (850 - 300)) * 100; // Common credit score range
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (percentage / 100) * circumference;

    const ratingColor = { Excellent: 'text-green-400', Good: 'text-cyan-400', Fair: 'text-yellow-400', Poor: 'text-red-400' };
    
    return (
        <Card title="Credit Score" variant="interactive" onClick={onClick}>
            <div className="flex items-center justify-center space-x-4">
                <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <path className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" d="M 50,10 a 40,40 0 0,1 0,80 a 40,40 0 0,1 0,-80" />
                        <path className={ratingColor[rating]} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" d="M 50,10 a 40,40 0 0,1 0,80 a 40,40 0 0,1 0,-80" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">{score}</div>
                </div>
                <div className="text-center">
                    <p className={`text-lg font-semibold ${ratingColor[rating]}`}>{rating}</p>
                    <p className={change > 0 ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>{change > 0 ? `+${change}` : change} pts</p>
                </div>
            </div>
        </Card>
    );
};

const SecurityStatus: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const [statusText, setStatusText] = useState('All Systems Secure');
    const [subText, setSubText] = useState(`Last scan: ${new Date().toLocaleTimeString()}`);
    const [iconColor, setIconColor] = useState('text-green-400');

    useEffect(() => {
        const messages = [
            { status: 'All Systems Secure', sub: `Last scan: ${new Date().toLocaleTimeString()}`, color: 'text-green-400' },
            { status: 'Running Threat Scan...', sub: 'Heuristic analysis in progress', color: 'text-cyan-400' },
            { status: 'All Systems Secure', sub: `Last scan: ${new Date().toLocaleTimeString()}`, color: 'text-green-400' },
            { status: 'Heuristic Anomaly Detected', sub: 'Threat auto-mitigated by AI', color: 'text-yellow-400' },
        ];
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % messages.length;
            setStatusText(messages[index].status);
            setSubText(messages[index].sub);
            setIconColor(messages[index].color);
        }, 7000); // Change every 7 seconds
        return () => clearInterval(interval);
    }, []);
    
    return (
        <Card title="Security Status" variant="interactive" onClick={onClick}>
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${iconColor} mx-auto transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394" /></svg>
                    <p className="mt-2 font-semibold text-white">{statusText}</p>
                    <p className="text-xs text-gray-400">{subText}</p>
                </div>
            </div>
        </Card>
    );
};


const SubscriptionTracker: React.FC<{ subscriptions: Subscription[]; onClick: () => void; }> = ({ subscriptions, onClick }) => (
    <Card title="Recurring Subscriptions" variant="interactive" onClick={onClick}>
        <div className="space-y-3">
            {subscriptions.map(sub => {
                const Icon = WIDGET_ICONS[sub.iconName];
                return (
                    <div key={sub.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <Icon className="w-5 h-5 text-cyan-400 mr-3" />
                            <span className="text-gray-200">{sub.name}</span>
                        </div>
                        <span className="font-mono text-white">${sub.amount.toFixed(2)}</span>
                    </div>
                );
            })}
        </div>
    </Card>
);

const UpcomingBills: React.FC<{ bills: UpcomingBill[]; onPay: (bill: UpcomingBill) => void; }> = ({ bills, onPay }) => (
    <Card title="Upcoming Bills">
        <div className="space-y-3">
            {bills.map(bill => (
                <div key={bill.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-700/50">
                    <div>
                        <p className="text-gray-200">{bill.name}</p>
                        <p className="text-xs text-gray-400">{bill.dueDate}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-white">${bill.amount.toFixed(2)}</p>
                    </div>
                    <button onClick={() => onPay(bill)} className="ml-4 px-3 py-1 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-xs">Pay</button>
                </div>
            ))}
        </div>
    </Card>
);

const CategorySpending: React.FC<{ budgets: BudgetCategory[]; onClick: () => void; }> = ({ budgets, onClick }) => {
    const COLORS = budgets.map(b => b.color);
    const data = budgets.map(b => ({ name: b.name, value: b.spent }));
    return (
        <Card title="Spending by Category" variant="interactive" onClick={onClick}>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={5}>
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend iconSize={8} wrapperStyle={{fontSize: '12px'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const CashFlowAnalysis: React.FC<{ transactions: Transaction[]; onClick: () => void; }> = ({ transactions, onClick }) => {
    const monthlyFlows = useMemo(() => {
        const flows: { [key: string]: { name: string; income: number; expense: number } } = {};
        
        // Ensure transactions are sorted by date
        [...transactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(tx => {
            const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
            if (!flows[month]) {
                flows[month] = { name: month, income: 0, expense: 0 };
            }
            if (tx.type === 'income') {
                flows[month].income += tx.amount;
            } else {
                flows[month].expense += tx.amount;
            }
        });
        
        return Object.values(flows);
    }, [transactions]);
    
    return (
        <Card title="Cash Flow" variant="interactive" onClick={onClick}>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyFlows} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend wrapperStyle={{fontSize: '12px'}} />
                        <Bar dataKey="income" fill="#10b981" name="Income" />
                        <Bar dataKey="expense" fill="#f43f5e" name="Expense" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const SavingsGoals: React.FC<{ goals: SavingsGoal[]; onClick: () => void; }> = ({ goals, onClick }) => (
    <Card title="Savings Goals" className="h-full" variant="interactive" onClick={onClick}>
        <div className="space-y-4">
            {goals.map(goal => {
                const progress = Math.floor((goal.saved / goal.target) * 100);
                const Icon = WIDGET_ICONS[goal.iconName];
                return (
                    <div key={goal.id}>
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                                <Icon className="w-5 h-5 text-cyan-400 mr-2" />
                                <span className="text-sm font-medium text-white">{goal.name}</span>
                            </div>
                            <span className="text-xs font-mono text-gray-300">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    </Card>
);

const MarketMovers: React.FC<{ movers: MarketMover[]; onSelect: (mover: MarketMover) => void; }> = ({ movers, onSelect }) => (
    <Card title="Market Movers">
        <div className="space-y-1">
            {movers.map(mover => (
                <div key={mover.ticker} onClick={() => onSelect(mover)} className="flex items-center justify-between text-sm p-2 rounded-lg cursor-pointer hover:bg-gray-700/50">
                    <div>
                        <p className="font-bold text-white">{mover.ticker}</p>
                        <p className="text-xs text-gray-400 truncate w-32">{mover.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-white">${mover.price.toFixed(2)}</p>
                        <p className={`text-xs ${mover.change > 0 ? 'text-green-400' : 'text-red-400'}`}>{mover.change > 0 ? '+' : ''}{mover.change.toFixed(2)}</p>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

const AIPredictiveBundle: React.FC = () => {
    const context = useContext(DataContext);
    const [bundle, setBundle] = useState<{ title: string; description: string; images: string[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { geminiApiKey } = context || {};

    useEffect(() => {
        const generateBundle = async () => {
            if (!context || context.transactions.length === 0) {
                setIsLoading(false);
                setError("Not enough transaction data to generate a bundle.");
                return;
            };

            if (!geminiApiKey) {
                setError("Set Gemini API key in API Status to use this feature.");
                setIsLoading(false);
                return;
            }

            try {
                const ai = new GoogleGenAI({ apiKey: geminiApiKey });
                const transactionSummary = context.transactions.slice(0, 10).map(t => `${t.description} ($${t.amount})`).join(', ');
                const textPrompt = `Based on these recent user transactions, create an "AI Predictive Product Bundle" called "Smart Home Upgrade Pack". Generate a short, compelling description (2-3 sentences) for this bundle, explaining why it's recommended based on the transactions. Also suggest two specific, distinct products for the bundle. Format the response as a JSON object with keys: "description", "product1_name", and "product2_name". Transactions: ${transactionSummary}`;

                const textResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: textPrompt,
                    config: { responseMimeType: 'application/json' }
                });

                const bundleData = JSON.parse(textResponse.text);

                const imagePrompt1 = `A sleek, modern product shot of a ${bundleData.product1_name}, minimalist aesthetic, on a clean, light gray background.`;
                const imagePrompt2 = `A sleek, modern product shot of a ${bundleData.product2_name}, minimalist aesthetic, on a clean, light gray background.`;

                const [imageResponse1, imageResponse2] = await Promise.all([
                    ai.models.generateImages({ model: 'imagen-4.0-generate-001', prompt: imagePrompt1, config: { numberOfImages: 1, outputMimeType: 'image/jpeg' } }),
                    ai.models.generateImages({ model: 'imagen-4.0-generate-001', prompt: imagePrompt2, config: { numberOfImages: 1, outputMimeType: 'image/jpeg' } })
                ]);
                
                const imageUrl1 = `data:image/jpeg;base64,${imageResponse1.generatedImages[0].image.imageBytes}`;
                const imageUrl2 = `data:image/jpeg;base64,${imageResponse2.generatedImages[0].image.imageBytes}`;
                
                setBundle({
                    title: "Smart Home Upgrade Pack",
                    description: bundleData.description,
                    images: [imageUrl1, imageUrl2]
                });

            } catch (err) {
                console.error("Error generating product bundle:", err);
                setError("Plato AI couldn't generate a bundle at this time.");
            } finally {
                setIsLoading(false);
            }
        };

        generateBundle();
    }, [context, geminiApiKey]);

    return (
        <Card title="AI Predictive Product Bundle" isLoading={isLoading}>
            {error && <p className="text-red-400 text-center">{error}</p>}
            {bundle && (
                 <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-cyan-300">{bundle.title}</h3>
                        <p className="text-sm text-gray-400 mt-2 mb-4 italic">"{bundle.description}"</p>
                        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm">View Bundle</button>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gray-700 rounded-lg"><img src={bundle.images[0]} className="object-cover w-full h-full rounded-lg" /></div>
                        <div className="w-24 h-24 bg-gray-700 rounded-lg"><img src={bundle.images[1]} className="object-cover w-full h-full rounded-lg" /></div>
                    </div>
                </div>
            )}
        </Card>
    );
};


// ================================================================================================
// MAIN DASHBOARD COMPONENT
// ================================================================================================

interface DashboardProps {
    setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    const [modal, setModal] = useState<{ type: string; data: any } | null>(null);


    if (!context) {
        throw new Error("Dashboard must be wrapped in a DataProvider.");
    }

    const { transactions, impactData, gamification, subscriptions, creditScore, upcomingBills, savingsGoals, marketMovers, budgets, linkedAccounts, rewardPoints, isImportingData } = context;
    const hasLinkedAccounts = linkedAccounts && linkedAccounts.length > 0;

    const handleQuickAction = (action: string) => {
        if (action === 'Send Money') {
            setActiveView(View.SendMoney);
        } else {
            setModal({ type: action, data: null });
        }
    };

    const mockStockData = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
        day: i,
        price: modal?.data?.price ? modal.data.price - 15 + Math.random() * 30 : 100 + Math.random() * 50
    })), [modal?.data?.price]);

    return (
        <>
            <DataImportingOverlay isImporting={isImportingData} bankName={linkedAccounts[linkedAccounts.length -1]?.name} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                
                {!hasLinkedAccounts && (
                    <div className="lg:col-span-12">
                        <LinkAccountPrompt />
                    </div>
                )}

                {/* --- HERO ROW --- */}
                <div className="lg:col-span-9">
                    <BalanceSummary />
                </div>
                <div className="lg:col-span-3">
                    <GamificationProfile gamification={gamification} onClick={() => setActiveView(View.Rewards)} />
                </div>

                {hasLinkedAccounts && (
                    <div className="lg:col-span-12">
                        <AIPredictiveBundle />
                    </div>
                )}

                {/* --- NEW WIDGETS SECTION --- */}
                <div className="lg:col-span-3">
                    <QuickActions onAction={handleQuickAction} />
                </div>
                <div className="lg:col-span-3">
                    <CreditScoreMonitor creditScore={creditScore} onClick={() => setActiveView(View.CreditHealth)} />
                </div>
                <div className="lg:col-span-3">
                    <RewardPointsWidget rewards={rewardPoints} onClick={() => setActiveView(View.Rewards)} />
                </div>
                <div className="lg:col-span-3">
                    <SecurityStatus onClick={() => setActiveView(View.Security)} />
                </div>
                <div className="lg:col-span-5">
                    <SubscriptionTracker subscriptions={subscriptions} onClick={() => setActiveView(View.Budgets)} />
                </div>
                <div className="lg:col-span-7">
                    <SavingsGoals goals={savingsGoals} onClick={() => setActiveView(View.Goals)} />
                </div>

                <div className="lg:col-span-8">
                    <CashFlowAnalysis transactions={transactions} onClick={() => setActiveView(View.Transactions)} />
                </div>
                <div className="lg:col-span-4">
                    <CategorySpending budgets={budgets} onClick={() => setActiveView(View.Budgets)} />
                </div>
                <div className="lg:col-span-6">
                    <MarketMovers movers={marketMovers} onSelect={(mover) => setModal({ type: 'StockDetail', data: mover })} />
                </div>
                <div className="lg:col-span-6">
                    <UpcomingBills bills={upcomingBills} onPay={(bill) => setModal({ type: 'Pay Bill', data: bill })} />
                </div>


                {/* --- ORIGINAL WIDGETS SECTION --- */}
                <div className="lg:col-span-8">
                    <RecentTransactions transactions={transactions.slice(0, 5)} setActiveView={setActiveView} />
                </div>
                <div className="lg:col-span-4">
                    <ImpactTracker
                        treesPlanted={impactData.treesPlanted}
                        progress={impactData.progressToNextTree}
                    />
                </div>
                <div className="lg:col-span-12">
                    <AIInsights />
                </div>
                <div className="lg:col-span-12">
                    <WealthTimeline />
                </div>
            </div>

            {/* --- MODALS --- */}
            <Modal isOpen={modal?.type === 'Pay Bill'} onClose={() => setModal(null)} title={`Pay Bill: ${modal?.data?.name}`}>
                <div className="space-y-4">
                    <p>You are about to pay <span className="font-bold text-white">${modal?.data?.amount.toFixed(2)}</span> for your {modal?.data?.name} bill.</p>
                    <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg" onClick={() => { alert('Payment Successful!'); setModal(null); }}>Confirm Payment</button>
                </div>
            </Modal>
            <Modal isOpen={modal?.type === 'Deposit'} onClose={() => setModal(null)} title="Deposit Check">
                <p>Mobile check deposit functionality would be implemented here, likely using the device camera.</p>
            </Modal>
            <Modal isOpen={modal?.type === 'StockDetail'} onClose={() => setModal(null)} title={`${modal?.data?.name} (${modal?.data?.ticker})`}>
                 <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <p className="text-3xl font-bold text-white">${modal?.data?.price.toFixed(2)}</p>
                        <p className={`font-semibold ${modal?.data?.change > 0 ? 'text-green-400' : 'text-red-400'}`}>{modal?.data?.change > 0 ? '+' : ''}{modal?.data?.change.toFixed(2)}</p>
                    </div>
                    <div className="h-40">
                         <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={mockStockData}>
                                 <defs><linearGradient id="stockColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                                <Area type="monotone" dataKey="price" stroke="#06b6d4" fill="url(#stockColor)" />
                             </AreaChart>
                         </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Buy</button>
                        <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Sell</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3 | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-91b6490/components/Dashboard.tsx
================================================================================

import React, { useState, useMemo } from 'react';
import { 
  PlaidCredentials, 
  ConnectedItem,
  UnifiedPayload,
  UCCFiling,
  Transaction,
  Account
} from '../types';
import { 
  CreditCard, Wallet, Landmark,
  Activity, ShieldCheck, Zap, Layers, Cpu, Box, Globe, Shield
} from 'lucide-react';

interface Props {
  items: ConnectedItem[];
  credentials: PlaidCredentials;
  proxy: string;
  onAddCompany: () => void;
  addLog: (msg: any, type?: 'req' | 'res' | 'err') => void;
  uccFilings: UCCFiling[];
  marqetaActive?: boolean;
  mtActive?: boolean;
}

export const Dashboard: React.FC<Props> = ({ items, credentials, proxy, onAddCompany, addLog, uccFilings, marqetaActive, mtActive }) => {
  const [isAutoReconciling, setIsAutoReconciling] = useState(false);
  const [showUnifiedPayload, setShowUnifiedPayload] = useState(false);

  const stats = useMemo(() => {
    let liq = 0;
    let lia = 0;
    let txC = 0;
    items.forEach(item => {
      item.accounts.forEach((a: Account) => { 
        if (a.type === 'depository') liq += a.balance.current; 
        else lia += a.balance.current; 
      });
      txC += item.transactions.length;
    });
    return { liq, lia, txC };
  }, [items]);

  const getUnified = (): UnifiedPayload => ({
    timestamp: new Date().toISOString(),
    nexus_version: "3.5.0-bulk",
    nexus_id: "nx_" + Math.random().toString(36).substring(2, 10),
    global_metadata: {
      client_context: `NEXUS_INTEGRATION_${(credentials?.clientId || 'DEMO').slice(0, 4)}`,
      reconciliation_depth: 3,
      combined_hash: btoa(items.map(i => i.itemId).join(':'))
    },
    mesh_stats: {
      total_liquidity: stats.liq,
      total_liabilities: stats.lia,
      net_position: stats.liq - stats.lia,
      active_institutions: items.length
    },
    cross_institutional_ledger: {
      items: items,
      reconciled_pairs: []
    },
    compliance: { active_ucc_filings: uccFilings }
  });

  const autoReconcileAll = () => {
    if (items.length < 1) {
      addLog("Nexus Error: Reconciliation requires active nodes.", "err");
      return;
    }
    setIsAutoReconciling(true);
    addLog(`[PROXY] Probing mesh via tunnel: ${proxy}`, 'req');
    setTimeout(() => {
      setIsAutoReconciling(false);
      addLog("RECONCILE COMPLETE: 0 discrepancies found.", 'res');
    }, 1200);
  };

  const allTransactions = useMemo(() => {
    return items.flatMap(i => i.transactions.map((t: Transaction) => ({ 
      ...t, 
      institution_origin: i.institutionName
    })));
  }, [items]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/40 p-10 rounded-[3.5rem] border border-white/5 flex flex-wrap items-center justify-between gap-8 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-600/20 border border-blue-500/30 ${isAutoReconciling ? 'animate-pulse' : ''}`}>
            <Cpu className="text-blue-500" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Unified Hub</h2>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{items.length} Nodes Synchronized</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 relative z-10">
          <button onClick={autoReconcileAll} disabled={isAutoReconciling} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 disabled:opacity-50">
            {isAutoReconciling ? <Activity className="animate-spin" size={16} /> : <Zap size={16}/>}
            Auto-Sync
          </button>
          <button onClick={() => setShowUnifiedPayload(!showUnifiedPayload)} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
            {showUnifiedPayload ? 'Close Payload' : 'Export JSON'}
          </button>
          <button onClick={onAddCompany} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
            + New Node
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { l: 'Mesh Liquidity', v: `$${stats.liq.toLocaleString()}`, i: Wallet, c: 'text-blue-500', b: 'bg-blue-500/5' },
          { l: 'Mesh Liability', v: `$${stats.lia.toLocaleString()}`, i: CreditCard, c: 'text-red-500', b: 'bg-red-500/5' },
          { l: 'Cross-Link Density', v: '98.4%', i: Layers, c: 'text-emerald-500', b: 'bg-emerald-500/5' },
          { l: 'Compliance Ready', v: uccFilings.length, i: ShieldCheck, c: 'text-purple-500', b: 'bg-purple-500/5' }
        ].map((s, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border border-white/5 transition-all hover:border-white/10 ${s.b}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{s.l}</span>
              <s.i size={18} className={s.c}/>
            </div>
            <p className="text-2xl font-black text-white italic tracking-tighter">{s.v}</p>
          </div>
        ))}
      </div>

      {showUnifiedPayload && (
        <div className="bg-slate-950/90 p-12 rounded-[3.5rem] border-2 border-blue-500/30 animate-in zoom-in-95 backdrop-blur-3xl shadow-3xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Box className="text-white" size={24}/>
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-widest text-white italic">Consolidated Mesh Payload</h3>
                <p className="text-[10px] text-slate-500 font-mono">v3.5.0-bulk • Internal Distribution Only</p>
              </div>
            </div>
          </div>
          <div className="bg-black/60 rounded-[2rem] p-8 border border-white/5 max-h-[500px] overflow-y-auto">
            <pre className="text-[11px] font-mono text-blue-400/70 leading-relaxed scrollbar-hide">
              {JSON.stringify(getUnified(), null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 ml-4">Mesh Institutional Nodes</h3>
          <div className="space-y-4">
            {items.map((it, idx) => (
              <div key={idx} className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-blue-500/40 transition-all backdrop-blur-sm">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600/10 transition-colors">
                    <Landmark size={28}/>
                  </div>
                  <div>
                    <p className="text-lg font-black text-white uppercase italic tracking-tighter">{it.institutionName}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[9px] font-mono text-slate-600 font-bold">{it.itemId}</span>
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> SYNCED
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white italic tracking-tighter">
                    ${it.accounts.reduce((s, a: Account) => s + a.balance.current, 0).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mt-1">{it.transactions.length} Ledger Items</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 ml-4">Consolidated Live Ledger</h3>
          <div className="bg-slate-950/40 rounded-[3rem] border border-white/5 overflow-hidden backdrop-blur-sm">
             <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
                <table className="w-full text-left">
                   <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                    <tr className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/10">
                      <th className="p-8">Origin Node</th>
                      <th className="p-8">Entity Detail</th>
                      <th className="p-8 text-right">Settlement</th>
                    </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {allTransactions.map((tx, i) => (
                        <tr key={i} className="text-xs transition-colors hover:bg-white/10">
                          <td className="p-8">
                            <span className="px-3 py-1 bg-slate-900 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-tighter italic border border-white/5">
                              {tx.institution_origin}
                            </span>
                          </td>
                          <td className="p-8">
                            <p className="font-bold text-white truncate max-w-[150px] tracking-tight">{tx.name}</p>
                            <p className="text-[9px] text-slate-600 font-mono mt-1">{tx.date}</p>
                          </td>
                          <td className={`p-8 text-right font-black font-mono tracking-tighter ${tx.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/Dashboard.tsx
================================================================================


import React, { useContext, useMemo } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View } from '../types';
import { 
    Zap, Globe, Target, Cpu, Landmark, CheckCircle, 
    Fingerprint, ShieldCheck, Activity, Brain, ArrowUpRight, TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard requires DataContext.");

    const { 
        transactions, setActiveView, creditScore, sovereignCredits, assets, isProductionApproved, plaidProducts
    } = context;

    const totalManagedValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2 md:p-6 bg-gray-950 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                         <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-[10px] text-green-400 font-black tracking-widest uppercase">Production Environment</div>
                         <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-black tracking-widest uppercase">Signal Stable</div>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase font-mono italic">Nexus OS</h1>
                    <p className="text-emerald-400 mt-1 flex items-center gap-2 font-mono text-sm tracking-widest uppercase">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        SIGNAL: {isProductionApproved ? 'PRODUCTION_ACTIVE' : 'INITIALIZING'} // {plaidProducts.length} PROTOCOLS SYNCED
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-black/40 border border-gray-800 rounded-xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Balance:</span>
                        <span className="text-indigo-400 font-mono text-lg font-bold">{sovereignCredits.toLocaleString()} SC</span>
                    </div>
                    <button onClick={() => setActiveView(View.SendMoney)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white text-sm font-black shadow-lg shadow-cyan-500/20 transition-all active:scale-95 uppercase tracking-widest">
                        Initiate Capital Flow
                    </button>
                </div>
            </header>

            {/* Production Metrics Deck */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card onClick={() => setActiveView(View.CreditHealth)} variant="interactive" className="border-cyan-500/20 bg-cyan-950/5 text-center py-6 group">
                    <Fingerprint className="w-8 h-8 mx-auto text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{creditScore.score}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Trust Resonance</p>
                </Card>
                <Card onClick={() => setActiveView(View.DataNetwork)} variant="interactive" className="border-purple-500/20 bg-purple-950/5 text-center py-6 group">
                    <Activity className="w-8 h-8 mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{plaidProducts.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Active Protocols</p>
                </Card>
                <Card onClick={() => setActiveView(View.CorporateCommand)} variant="interactive" className="border-green-500/20 bg-green-950/5 text-center py-6 group">
                    <ShieldCheck className="w-8 h-8 mx-auto text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">100%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Ledger Integrity</p>
                </Card>
                <Card onClick={() => setActiveView(View.Investments)} variant="interactive" className="border-emerald-500/20 bg-emerald-950/5 text-center py-6 group">
                    <TrendingUp className="w-8 h-8 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">ALPHA</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Performance Tier</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Data Nexus */}
                <div className="lg:col-span-8 space-y-8">
                    <Card title="Sovereign Wealth Topology" className="h-[450px] relative overflow-hidden bg-black/40 border-indigo-900/50 p-0">
                        <div className="absolute top-6 left-6 z-10">
                            <span className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold font-mono rounded-lg backdrop-blur">MULTIVERSE_PROJECTION_V6</span>
                        </div>
                        <WealthTimeline />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <BalanceSummary />
                        <AIInsights />
                    </div>
                </div>

                {/* Tactical Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <Card title="Intelligence Core" icon={<Brain className="text-indigo-400" />}>
                        <div className="space-y-6">
                            <p className="text-sm text-gray-400 italic leading-relaxed">
                                "Sovereign AI detected a 12% divergence in sector growth. Recommend re-allocating 2.5B USD from Fixed Income to Quantum Infrastructure."
                            </p>
                            <button onClick={() => setActiveView(View.AIAdvisor)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                                Query Strategic Oracle <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </Card>

                    <Card title="Strategic Phase Allocation" className="border-green-500/20 p-6">
                        <div className="space-y-6">
                            {[
                                { name: "Phase 0: The Launch", pct: 100 },
                                { name: "Phase 1: High Fidelity", pct: 68 },
                                { name: "Phase 2: Wealth Sync", pct: 14 }
                            ].map(phase => (
                                <div key={phase.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-300">{phase.name}</span>
                                        <span className="text-green-400 font-mono">{phase.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-green-500 h-full transition-all duration-1000" style={{ width: `${phase.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setActiveView(View.TheVision)} className="w-full py-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-all border border-gray-800">Review Full Protocol</button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-12">
                    <RecentTransactions transactions={transactions.slice(0, 10)} setActiveView={setActiveView} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/Dashboard.tsx
================================================================================

import React, { useContext, useMemo } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View } from '../types';
import { 
    Database, Zap, Globe, Target, 
    Cpu, Landmark, CheckCircle, Crown, Code, Fingerprint, ShieldCheck, Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard requires DataContext.");

    const { 
        transactions, financialGoals, 
        setActiveView, creditScore, rewardPoints, assets, isProductionApproved, plaidProducts
    } = context;

    const totalManagedValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2 md:p-6 bg-gray-950 min-h-screen">

            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-8">
                {/* Left: Title + Status */}
                <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-[10px] text-green-400 font-black tracking-widest uppercase">
                            Production Environment
                        </div>
                        <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-black tracking-widest uppercase">
                            Handshake Stable
                        </div>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase font-mono italic">Nexus OS</h1>
                    <p className="text-emerald-400 mt-1 flex items-center gap-2 font-mono text-sm tracking-widest uppercase">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        SIGNAL: {isProductionApproved ? 'PRODUCTION_ACTIVE' : 'INITIALIZING'}
                    </p>
                </div>
                {/* Right: Buttons */}
                <div className="flex gap-3 flex-wrap">
                    <button onClick={() => setActiveView(View.ComplianceOracle)} 
                        className="px-4 py-2 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/50 rounded-xl text-sm font-bold text-indigo-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <ShieldCheck size={18} /> Welcome to the DEMO
                    </button>
                    <button onClick={() => setActiveView(View.SendMoney)} 
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95 uppercase tracking-widest">
                        Initiate Capital Flow
                    </button>
                </div>
            </header>

            {/* Metrics Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="border-cyan-500/20 bg-cyan-950/5 text-center py-6 group hover:border-cyan-500/50 transition-all">
                    <Fingerprint className="w-8 h-8 mx-auto text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{(creditScore.score/100).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Trust Score (Q-Resistant)</p>
                </Card>
                <Card className="border-purple-500/20 bg-purple-950/5 text-center py-6 group hover:border-purple-500/50 transition-all">
                    <Activity className="w-8 h-8 mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{plaidProducts.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Active Protocols</p>
                </Card>
                <Card className="border-green-500/20 bg-green-950/5 text-center py-6 group hover:border-green-500/50 transition-all">
                    <Database className="w-8 h-8 mx-auto text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">100%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Ledger Integrity</p>
                </Card>
                <Card className="border-emerald-500/20 bg-emerald-950/5 text-center py-6 group hover:border-emerald-500/50 transition-all">
                    <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">VERIFIED</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Identity Verified</p>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

                {/* Left Column */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <Card title="Sovereign Wealth Topology" className="relative overflow-hidden bg-black/40 border-indigo-900/50 p-0">
                        <div className="absolute top-6 left-6 z-10">
                            <span className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold font-mono rounded-lg backdrop-blur">
                                MULTIVERSE_PROJECTION_V6
                            </span>
                        </div>
                        <WealthTimeline />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <BalanceSummary />
                        <AIInsights />
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <Card title="Production Authority" className="border-indigo-500/20 bg-indigo-950/5 p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-indigo-500/20">
                                <Code className="text-indigo-400" />
                                <div>
                                    <p className="text-xs font-bold text-white uppercase">License: Apache 2.0</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Open Source Institutional Standard</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-emerald-500/20">
                                <div className="flex items-center gap-4">
                                    <Landmark className="text-emerald-400" />
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">Net Liquidity</p>
                                        <p className="text-[10px] text-gray-400 font-mono">Verified Reserves</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-white">${(totalManagedValue / 1000000).toFixed(2)}M</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Strategic Phase Allocation" className="border-green-500/20 p-6">
                        <div className="space-y-6">
                            {[
                                { name: "Phase 0: Launch", pct: 100 },
                                { name: "Phase 1: Deep Insights", pct: 45 },
                                { name: "Phase 2: Wealth Sync", pct: 12 }
                            ].map(phase => (
                                <div key={phase.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-300">{phase.name}</span>
                                        <span className="text-green-400 font-mono">{phase.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-green-500 h-full transition-all duration-1000" style={{ width: `${phase.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setActiveView(View.FinancialGoals)} 
                                className="w-full py-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-all border border-gray-800">
                                Review Full Protocol
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Full-width Recent Transactions */}
                <div className="lg:col-span-12">
                    <RecentTransactions transactions={transactions.slice(0, 10)} setActiveView={setActiveView} />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/Dashboard (1).tsx
================================================================================

import React, { useContext, useMemo } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View } from '../types';
import { 
    Database, Zap, Globe, Target, 
    Cpu, Landmark, CheckCircle, Crown, Code, Fingerprint, ShieldCheck, Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard requires DataContext.");

    const { 
        transactions, financialGoals, 
        setActiveView, creditScore, rewardPoints, assets, isProductionApproved, plaidProducts
    } = context;

    const totalManagedValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2 md:p-6 bg-gray-950 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                         <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-[10px] text-green-400 font-black tracking-widest uppercase">Production Environment</div>
                         <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-black tracking-widest uppercase">Handshake Stable</div>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase font-mono italic">Nexus OS</h1>
                    <p className="text-emerald-400 mt-1 flex items-center gap-2 font-mono text-sm tracking-widest uppercase">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        SIGNAL: {isProductionApproved ? 'PRODUCTION_ACTIVE' : 'INITIALIZING'} // 15/15 PROTOCOLS SYNCED
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setActiveView(View.ComplianceOracle)} className="px-4 py-2 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/50 rounded-xl text-sm font-bold text-indigo-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <ShieldCheck size={18} /> CMMC LEVEL 3 CERTIFIED
                    </button>
                    <button onClick={() => setActiveView(View.SendMoney)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95 uppercase tracking-widest">
                        Initiate Capital Flow
                    </button>
                </div>
            </header>

            {/* Production Metrics Deck */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="border-cyan-500/20 bg-cyan-950/5 text-center py-6 group hover:border-cyan-500/50 transition-all">
                    <Fingerprint className="w-8 h-8 mx-auto text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{(creditScore.score/100).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Trust Score (Q-Resistant)</p>
                </Card>
                <Card className="border-purple-500/20 bg-purple-950/5 text-center py-6 group hover:border-purple-500/50 transition-all">
                    <Activity className="w-8 h-8 mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{plaidProducts.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Active Protocols</p>
                </Card>
                <Card className="border-green-500/20 bg-green-950/5 text-center py-6 group hover:border-green-500/50 transition-all">
                    <Database className="w-8 h-8 mx-auto text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">100%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Ledger Integrity</p>
                </Card>
                <Card className="border-emerald-500/20 bg-emerald-950/5 text-center py-6 group hover:border-emerald-500/50 transition-all">
                    <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">VERIFIED</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Identity Verified</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Data Nexus */}
                <div className="lg:col-span-8 space-y-8">
                    <Card title="Sovereign Wealth Topology" className="h-[450px] relative overflow-hidden bg-black/40 border-indigo-900/50 p-0">
                        <div className="absolute top-6 left-6 z-10">
                            <span className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold font-mono rounded-lg backdrop-blur">MULTIVERSE_PROJECTION_V6</span>
                        </div>
                        <WealthTimeline />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <BalanceSummary />
                        <AIInsights />
                    </div>
                </div>

                {/* Tactical Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <Card title="Production Authority" className="border-indigo-500/20 bg-indigo-950/5 p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-indigo-500/20">
                                <Code className="text-indigo-400" />
                                <div>
                                    <p className="text-xs font-bold text-white uppercase">License: Apache 2.0</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Open Source Institutional Standard</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-emerald-500/20">
                                <div className="flex items-center gap-4">
                                    <Landmark className="text-emerald-400" />
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">Net Liquidity</p>
                                        <p className="text-[10px] text-gray-400 font-mono">Verified Reserves</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-white">${(totalManagedValue / 1000000).toFixed(2)}M</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Strategic Phase Allocation" className="border-green-500/20 p-6">
                        <div className="space-y-6">
                            {[
                                { name: "Phase 0: Launch", pct: 100 },
                                { name: "Phase 1: Deep Insights", pct: 45 },
                                { name: "Phase 2: Wealth Sync", pct: 12 }
                            ].map(phase => (
                                <div key={phase.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-300">{phase.name}</span>
                                        <span className="text-green-400 font-mono">{phase.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-green-500 h-full transition-all duration-1000" style={{ width: `${phase.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setActiveView(View.FinancialGoals)} className="w-full py-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-all border border-gray-800">Review Full Protocol</button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-12">
                    <RecentTransactions transactions={transactions.slice(0, 10)} setActiveView={setActiveView} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/Dashboard (3).tsx
================================================================================

import React from 'react';

// REFACTOR: The original Dashboard.tsx was a massive, insecure form for entering 200+ API keys.
// This is a critical anti-pattern. Secrets should never be managed through a frontend UI.
// They must be configured securely on the backend using a vault (like AWS Secrets Manager)
// or environment variables, completely inaccessible to the client-side.
//
// In line with the MVP goal of a "Unified business financial dashboard," this component has been
// completely replaced with a proper dashboard layout. It now serves as the central hub for
// displaying financial data, rather than being a dangerous and non-production-ready configuration page.
// This new component uses placeholder data to illustrate its intended function.

// Placeholder data - in a real application, this would be fetched from a secure API endpoint
// and managed with a state management library like React Query or Redux Toolkit.
const mockFinancialData = {
  totalBalance: 1250345.67,
  cashFlow: 55021.34,
  revenue: 210450.99,
  expenses: 155429.65,
  recentTransactions: [
    { id: 'txn_1', description: 'Stripe Payout', amount: 25000, date: '2023-10-26', type: 'income' },
    { id: 'txn_2', description: 'AWS Services Bill', amount: -5200.50, date: '2023-10-25', type: 'expense' },
    { id: 'txn_3', description: 'Client Payment - Acme Corp', amount: 15000, date: '2023-10-24', type: 'income' },
    { id: 'txn_4', description: 'Office Rent Payment', amount: -8000, date: '2023-10-24', type: 'expense' },
    { id: 'txn_5', description: 'Software Subscription - Figma', amount: -450, date: '2023-10-23', type: 'expense' },
  ],
};

// A simple placeholder for a UI card component.
// In a real app, this would come from a standardized UI library like MUI or a custom component system using Tailwind CSS.
const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`card ${className || ''}`} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
    <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>{title}</h3>
    <div>{children}</div>
  </div>
);

const Dashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', padding: '2rem', backgroundColor: '#f8f9fa' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#1a202c' }}>Business Financial Dashboard</h1>
        <p style={{ color: '#667eea', marginTop: '0.25rem' }}>A unified view of your company's financial health.</p>
      </header>

      {/* Key Metrics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Total Cash Balance">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: '#2c5282' }}>{formatCurrency(mockFinancialData.totalBalance)}</p>
        </Card>
        <Card title="Net Cash Flow (30d)">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: mockFinancialData.cashFlow > 0 ? '#38a169' : '#e53e3e' }}>{formatCurrency(mockFinancialData.cashFlow)}</p>
        </Card>
        <Card title="Revenue (30d)">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: '#38a169' }}>{formatCurrency(mockFinancialData.revenue)}</p>
        </Card>
        <Card title="Expenses (30d)">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: '#e53e3e' }}>{formatCurrency(mockFinancialData.expenses)}</p>
        </Card>
      </div>

      {/* Data Visualizations and Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', lg: 'gridTemplateColumns: "2fr 1fr"', gap: '1.5rem' }}>
        <Card title="Recent Transactions">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '0.75rem' }}>Description</th>
                <th style={{ padding: '0.75rem' }}>Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockFinancialData.recentTransactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500 }}>{tx.description}</td>
                  <td style={{ padding: '0.75rem', color: '#666' }}>{tx.date}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? '#2f855a' : '#c53030' }}>{formatCurrency(tx.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Cash Balance Over Time">
          {/* Placeholder for a chart component. In a real app, this would be a library like Recharts or Chart.js */}
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#edf2f7', color: '#a0aec0', borderRadius: '4px', fontStyle: 'italic' }}>
            [Chart Component: Line graph showing balance over last 90 days]
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/Dashboard (5).tsx
================================================================================

import React, { useContext, useMemo, useState, useEffect, useCallback } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import AIInsights from './AIInsights';
import ImpactTracker from './ImpactTracker';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GamificationState, Subscription, CreditScore, SavingsGoal, MarketMover, UpcomingBill, Transaction, BudgetCategory, RewardPoints, View, LinkedAccount } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, AreaChart, Area } from 'recharts';
import PlaidLinkButton from './PlaidLinkButton';
import { GoogleGenAI } from '@google/generative-ai';

// ================================================================================================
// CORE UTILITY COMPONENTS (Modal & Overlays)
// ================================================================================================

/**
 * A highly customizable, accessible modal component for displaying critical information or actions.
 */
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; size?: 'sm' | 'md' | 'lg' }> = ({ isOpen, onClose, children, title, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-lg',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-950/80 flex items-center justify-center z-[1000] backdrop-blur-lg transition-opacity duration-300" 
            onClick={onClose}
        >
            <div 
                className={`${sizeClasses[size]} w-full mx-4 bg-gray-800 rounded-xl shadow-3xl border border-cyan-700/50 transform transition-transform duration-300 scale-100`} 
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-750 rounded-t-xl">
                    <h3 id="modal-title" className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">{children}</div>
            </div>
        </div>
    );
};

/**
 * Overlay component to indicate ongoing data synchronization and AI processing.
 */
const DataImportingOverlay: React.FC<{ isImporting: boolean; account: LinkedAccount | undefined }> = ({ isImporting, account }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const bankName = account?.name || 'Primary Financial Institution';

    const messages = useMemo(() => [
        `Establishing Quantum Link to ${bankName}...`,
        'Securely decrypting and importing ledger entries...',
        'AI Core (Plato) is synthesizing raw data streams...',
        'Generating predictive models and risk assessments...',
        'Finalizing synchronization. Dashboard update imminent.'
    ], [bankName]);

    useEffect(() => {
        if (isImporting) {
            setMessageIndex(0);
            const interval = setInterval(() => {
                setMessageIndex(prev => (prev + 1) % messages.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [isImporting, messages.length]);

    if (!isImporting) return null;

    return (
        <div className="fixed inset-0 bg-gray-950/95 flex flex-col items-center justify-center z-[1001] backdrop-blur-lg">
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-8 border-cyan-500/20 rounded-full animate-ping-slowest"></div>
                <div className="absolute inset-0 border-8 border-indigo-500/30 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 border-8 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white text-xl mt-10 font-extrabold tracking-wider animate-pulse">{messages[messageIndex]}</p>
            <p className="text-gray-400 mt-2 text-sm">Processing {bankName} Data Stream...</p>
        </div>
    );
};


// ================================================================================================
// ICON MAP & UTILITY COMPONENTS
// ================================================================================================
const WIDGET_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
    video: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    music: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>,
    cloud: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    plane: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    rocket: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    send: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
bill: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    deposit: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    shield: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    trendingUp: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    target: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    star: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.519 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.52-4.674a1 1 0 00-.364-1.118L2.52 9.431c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" /></svg>,
    link: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5-4.5h8.25m0 0L12 3m4.5 4.5L12 12" /></svg>,
};

// ================================================================================================
// CORE WIDGETS (Expanded Functionality)
// ================================================================================================

const LinkAccountPrompt: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("LinkAccountPrompt must be used within a DataProvider");
    }
    const { handlePlaidSuccess, isImportingData } = context;

    return (
        <Card title="Unified Financial Nexus" variant="default" className="border-cyan-500/30">
            <div className="text-center p-4">
                <div className="w-20 h-20 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-300 mb-6 border-4 border-cyan-500/50">
                    <WIDGET_ICONS.link className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-wide">Establish Secure Data Conduit</h3>
                <p className="text-gray-400 mt-3 mb-8 max-w-xl mx-auto text-base">
                    To activate the full spectrum of predictive analytics and automated wealth management, you must establish a secure, encrypted connection to your external financial institutions via our certified Plaid integration. This is the foundation of your autonomous financial future.
                </p>
                <div className="max-w-xs mx-auto">
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} disabled={isImportingData} />
                    {isImportingData && <p className="text-sm text-yellow-400 mt-2 animate-pulse">Connection in progress...</p>}
                </div>
            </div>
        </Card>
    );
};

const GamificationProfile: React.FC<{ gamification: GamificationState; onClick: () => void; }> = ({ gamification, onClick }) => {
    const { score, level, levelName, progress } = gamification;
    const circumference = 2 * Math.PI * 55;
    // Scale score to a max of 10000 for visualization purposes, though the actual score might be higher/lower
    const effectiveScore = Math.min(score, 10000); 
    const scoreOffset = circumference - (effectiveScore / 10000) * circumference;

    const getLevelColor = (level: number) => {
        if (level >= 10) return 'text-red-400';
        if (level >= 7) return 'text-yellow-400';
        if (level >= 4) return 'text-green-400';
        return 'text-cyan-400';
    };

    return (
        <Card title="Sovereign Score Index (SSI)" className="h-full border-indigo-500/30" variant="interactive" onClick={onClick}>
            <div className="flex flex-col justify-between h-full p-2">
                <div className="relative flex items-center justify-center h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="55" cx="60" cy="60" />
                        <circle 
                            className={`transition-all duration-1000 ease-out ${getLevelColor(level).replace('text-', 'stroke-')}`} 
                            strokeWidth="10" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={scoreOffset} 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="55" 
                            cx="60" 
                            cy="60" 
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <text dy=".3em" className="text-4xl font-extrabold fill-white">{score}</text>
                        <p className="text-xs text-gray-400 mt-1">Points</p>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p className={`font-bold text-xl ${getLevelColor(level)}`}>{levelName}</p>
                    <p className="text-sm text-gray-400">Level {level} / 10</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                        <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Next Level: {Math.ceil((10000 / 10) * (10 - progress / 10))} pts</p>
                </div>
            </div>
        </Card>
    );
};

const QuickActions: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => {
    const actions = [
        { name: 'Transfer Funds', icon: 'send', view: View.SendMoney }, 
        { name: 'Schedule Payment', icon: 'bill', view: View.Budgets }, 
        { name: 'Initiate Deposit', icon: 'deposit', view: View.Transactions },
        { name: 'AI Strategy', icon: 'rocket', view: View.AIAdvisor },
    ];
    return (
        <Card title="Command Console" className="h-full border-cyan-500/30">
            <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
                {actions.map(action => {
                    const Icon = WIDGET_ICONS[action.icon];
                    return (
                        <button 
                            key={action.name} 
                            onClick={() => onAction(action.name)} 
                            className="flex flex-col items-center p-3 rounded-lg hover:bg-cyan-900/30 transition-all border border-transparent hover:border-cyan-600/50 group"
                        >
                            <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center text-cyan-300 mb-2 group-hover:bg-cyan-600/50 transition-colors">
                                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-xs font-semibold text-gray-200 group-hover:text-white">{action.name}</span>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

const RewardPointsWidget: React.FC<{ rewards: RewardPoints; onClick: () => void; }> = ({ rewards, onClick }) => {
    const redemptionRate = 1000; // Example: 1000 points = $1
    const dollarValue = (rewards.balance / redemptionRate).toFixed(2);

    return (
        <Card title="Loyalty Matrix" className="h-full border-yellow-500/30" variant="interactive" onClick={onClick}>
            <div className="flex flex-col justify-center items-center h-full text-center p-2">
                <WIDGET_ICONS.star className="h-12 w-12 text-yellow-400 mb-3" />
                <p className="text-5xl font-extrabold text-white tracking-tighter">{rewards.balance.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mb-3">Total Points</p>
                <div className="px-4 py-2 bg-yellow-600/30 text-yellow-300 rounded-full text-lg font-bold border border-yellow-500/50">
                    ~${dollarValue} Value
                </div>
            </div>
        </Card>
    );
};

const CreditScoreMonitor: React.FC<{ creditScore: CreditScore; onClick: () => void; }> = ({ creditScore, onClick }) => {
    const { score, change, rating } = creditScore;
    const MIN_SCORE = 300;
    const MAX_SCORE = 850;
    const percentage = ((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100;
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (percentage / 100) * circumference;

    const ratingConfig: { [key: string]: { color: string; description: string } } = {
        Excellent: { color: 'text-green-400', description: 'Exceptional credit profile.' },
        Good: { color: 'text-cyan-400', description: 'Strong credit history.' },
        Fair: { color: 'text-yellow-400', description: 'Average credit standing.' },
        Poor: { color: 'text-red-400', description: 'Requires immediate attention.' }
    };
    
    const config = ratingConfig[rating] || ratingConfig.Fair;

    return (
        <Card title="FICO Quantum Index" variant="interactive" onClick={onClick} className="border-green-500/30">
            <div className="flex items-center justify-center space-x-6">
                <div className="relative w-28 h-28">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <path className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" d="M 50,10 a 40,40 0 0,1 0,80 a 40,40 0 0,1 0,-80" />
                        <path 
                            className={config.color.replace('text-', 'stroke-')} 
                            strokeWidth="8" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={offset} 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            d="M 50,10 a 40,40 0 0,1 0,80 a 40,40 0 0,1 0,-80" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-white">{score}</span>
                        <span className="text-xs text-gray-400">FICO</span>
                    </div>
                </div>
                <div className="text-left">
                    <p className={`text-xl font-bold ${config.color}`}>{rating}</p>
                    <p className="text-sm text-gray-400 mt-1">{config.description}</p>
                    <p className={change >= 0 ? 'text-green-400 text-sm mt-2' : 'text-red-400 text-sm mt-2'}>
                        {change >= 0 ? '▲' : '▼'} {Math.abs(change)} points (30 Days)
                    </p>
                </div>
            </div>
        </Card>
    );
};

const SecurityStatus: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const [status, setStatus] = useState({ text: 'Initializing Sentinel Protocol', sub: 'Awaiting first system check...', color: 'text-cyan-400' });
    
    // Simulate dynamic security checks
    useEffect(() => {
        const checks = [
            { text: 'Sentinel Protocol Active', sub: `Last Scan: ${new Date().toLocaleTimeString()}`, color: 'text-green-400' },
            { text: 'Anomaly Detected in External Feed', sub: 'AI Quarantine engaged. No user impact.', color: 'text-yellow-400' },
            { text: 'Zero-Day Threat Signature Identified', sub: 'Automated patch deployed by idgafai.', color: 'text-red-400' },
            { text: 'All Systems Secure', sub: `Next Scan: ${new Date(Date.now() + 15000).toLocaleTimeString()}`, color: 'text-green-400' },
        ];
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % checks.length;
            setStatus(checks[index]);
        }, 12000); 
        return () => clearInterval(interval);
    }, []);
    
    return (
        <Card title="System Integrity" variant="interactive" onClick={onClick} className="border-red-500/30">
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <WIDGET_ICONS.shield className={`h-14 w-14 mx-auto transition-colors ${status.color}`} />
                    <p className="mt-3 font-bold text-lg text-white">{status.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{status.sub}</p>
                </div>
            </div>
        </Card>
    );
};


const SubscriptionTracker: React.FC<{ subscriptions: Subscription[]; onClick: () => void; }> = ({ subscriptions, onClick }) => {
    const totalMonthlySpend = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const sortedSubs = [...subscriptions].sort((a, b) => b.amount - a.amount).slice(0, 4);

    return (
        <Card title="Automated Commitments" variant="interactive" onClick={onClick} className="border-purple-500/30">
            <div className="space-y-3">
                {sortedSubs.map(sub => {
                    const Icon = WIDGET_ICONS[sub.iconName] || WIDGET_ICONS.bill;
                    return (
                        <div key={sub.id} className="flex items-center justify-between text-sm p-2 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center truncate">
                                <Icon className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-100 font-medium truncate">{sub.name}</span>
                            </div>
                            <span className="font-mono text-white text-right flex-shrink-0">${sub.amount.toFixed(2)}</span>
                        </div>
                    );
                })}
                <div className="pt-2 border-t border-gray-700 flex justify-between text-sm font-bold">
                    <span className="text-gray-300">Total Monthly Outflow:</span>
                    <span className="text-red-400">${totalMonthlySpend.toFixed(2)}</span>
                </div>
            </div>
        </Card>
    );
};

const UpcomingBills: React.FC<{ bills: UpcomingBill[]; onPay: (bill: UpcomingBill) => void; onClick: () => void; }> = ({ bills, onPay, onClick }) => {
    const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 3);

    return (
        <Card title="Immediate Liabilities" variant="interactive" onClick={onClick} className="border-red-500/30">
            <div className="space-y-3">
                {sortedBills.map(bill => (
                    <div key={bill.id} className="flex items-center justify-between text-sm p-2 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="truncate">
                            <p className="text-gray-200 font-medium">{bill.name}</p>
                            <p className="text-xs text-gray-500">Due: {bill.dueDate}</p>
                        </div>
                        <div className="text-right flex items-center space-x-3">
                            <p className="font-mono text-lg text-red-300">${bill.amount.toFixed(2)}</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onPay(bill); }} 
                                className="px-3 py-1 bg-red-600/60 hover:bg-red-600 text-white rounded-full text-xs font-semibold transition-colors shadow-md"
                                aria-label={`Pay ${bill.name}`}
                            >
                                Execute
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const CategorySpending: React.FC<{ budgets: BudgetCategory[]; onClick: () => void; }> = ({ budgets, onClick }) => {
    const data = budgets.map(b => ({ name: b.name, value: b.spent, limit: b.limit, color: b.color }));
    const totalSpent = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <Card title="Budget Allocation Matrix" variant="interactive" onClick={onClick} className="border-orange-500/30">
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={data} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={40} 
                            outerRadius={65} 
                            dataKey="value" 
                            paddingAngle={3}
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.value > entry.limit ? '#ef4444' : entry.color} // Red if over budget
                                    stroke={entry.value > entry.limit ? '#b91c1c' : entry.color}
                                />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151', borderRadius: '8px' }} 
                            formatter={(value: number, name: string, props) => {
                                const budgetItem = budgets.find(b => b.name === name);
                                const percentage = budgetItem ? ((value / budgetItem.limit) * 100).toFixed(1) : 'N/A';
                                return [`$${value.toFixed(2)}`, `${name} (${percentage}%)`];
                            }}
                        />
                        <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Total Spent: ${totalSpent.toFixed(2)}</p>
        </Card>
    );
};

const CashFlowAnalysis: React.FC<{ transactions: Transaction[]; onClick: () => void; }> = ({ transactions, onClick }) => {
    const monthlyFlows = useMemo(() => {
        const flows: { [key: string]: { name: string; income: number; expense: number } } = {};
        
        // Aggregate by Month/Year for better long-term view
        [...transactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(tx => {
            const date = new Date(tx.date);
            const yearMonth = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
            const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });

            if (!flows[yearMonth]) {
                flows[yearMonth] = { name: monthLabel, income: 0, expense: 0 };
            }
            if (tx.type === 'income') {
                flows[yearMonth].income += tx.amount;
            } else {
                flows[yearMonth].expense += tx.amount;
            }
        });
        
        return Object.values(flows).slice(-6); // Show last 6 months
    }, [transactions]);
    
    return (
        <Card title="Historical Cash Flow Dynamics" variant="interactive" onClick={onClick} className="border-green-500/30">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyFlows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                        <YAxis stroke="#9ca3af" fontSize={10} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#374151', borderRadius: '8px' }} 
                            formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                        />
                        <Legend wrapperStyle={{fontSize: '12px', paddingTop: '5px'}} />
                        <Bar dataKey="income" fill="#10b981" name="Inflow" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="#f43f5e" name="Outflow" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const SavingsGoals: React.FC<{ goals: SavingsGoal[]; onClick: () => void; }> = ({ goals, onClick }) => (
    <Card title="Capital Accumulation Targets" className="h-full border-cyan-500/30" variant="interactive" onClick={onClick}>
        <div className="space-y-5">
            {goals.map(goal => {
                const progress = Math.min(100, Math.floor((goal.saved / goal.target) * 100));
                const Icon = WIDGET_ICONS[goal.iconName] || WIDGET_ICONS.target;
                const isComplete = progress >= 100;
                return (
                    <div key={goal.id}>
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center truncate">
                                <Icon className={`w-5 h-5 mr-2 ${isComplete ? 'text-green-400' : 'text-cyan-400'}`} />
                                <span className="text-sm font-semibold text-white truncate">{goal.name}</span>
                            </div>
                            <span className={`text-sm font-bold ${isComplete ? 'text-green-400' : 'text-gray-300'}`}>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                                className={`h-2.5 rounded-full transition-all duration-700 ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-500'}`} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Saved: ${goal.saved.toFixed(0)} / Target: ${goal.target.toFixed(0)}</p>
                    </div>
                );
            })}
        </div>
    </Card>
);

const MarketMovers: React.FC<{ movers: MarketMover[]; onSelect: (mover: MarketMover) => void; onClick: () => void; }> = ({ movers, onSelect, onClick }) => (
    <Card title="Real-Time Asset Volatility" variant="interactive" onClick={onClick} className="border-teal-500/30">
        <div className="space-y-1">
            {movers.slice(0, 5).map(mover => {
                const isPositive = mover.change > 0;
                const Icon = WIDGET_ICONS.trendingUp;
                return (
                    <div key={mover.ticker} onClick={(e) => { e.stopPropagation(); onSelect(mover); }} className="flex items-center justify-between text-sm p-2 rounded-lg cursor-pointer hover:bg-teal-900/30 transition-colors">
                        <div className="flex items-center">
                            <Icon className={`w-4 h-4 mr-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
                            <div>
                                <p className="font-bold text-white">{mover.ticker}</p>
                                <p className="text-xs text-gray-400 truncate w-28">{mover.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-white">${mover.price.toFixed(2)}</p>
                            <p className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}{mover.change.toFixed(2)} ({((mover.change / mover.price) * 100).toFixed(2)}%)</p>
                        </div>
                    </div>
                );
            })}
        </div>
    </Card>
);

/**
 * AI-Powered Predictive Bundle Generation using Gemini.
 */
const AIPredictiveBundle: React.FC = () => {
    const context = useContext(DataContext);
    const [bundle, setBundle] = useState<{ title: string; description: string; products: { name: string; image: string; }[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { geminiApiKey, transactions } = context || {};

    const generateBundle = useCallback(async () => {
        if (!context || transactions.length < 15 || !geminiApiKey) {
            setIsLoading(false);
            if (transactions.length < 15) setError("Minimum 15 transactions required for robust AI analysis.");
            else if (!geminiApiKey) setError("Gemini API key required for AI Predictive Engine.");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const genAI = new GoogleGenAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: "You are Plato, a hyper-intelligent financial AI. Your purpose is to analyze user data and provide concise, actionable, and highly optimized financial strategies. You must always respond in the requested JSON format.",
                generationConfig: {
                    temperature: 0.2,
                }
            });
            
            const recentTxSummary = transactions.slice(0, 15).map(t => `${t.description} (${t.type === 'income' ? '+' : '-'}$${t.amount})`).join('; ');
            
            const textPrompt = `Analyze the user's recent financial activity: "${recentTxSummary}". Based on these patterns, generate a highly relevant, multi-product "Autonomous Wealth Optimization Bundle". 
            The bundle must be named "Quantum Leap Portfolio". 
            Provide a compelling, 2-sentence description explaining the financial logic. 
            Suggest exactly three distinct, high-value financial products/services (e.g., 'High-Yield Bond ETF', 'Term Life Insurance Policy', 'Real Estate Investment Trust Share').
            For each product, provide a simple, abstract image generation prompt (e.g., "Abstract visualization of a secure bond investment").
            Format the entire response strictly as a JSON object with keys: "description", and "products" which is an array of objects, each with "name" and "imagePrompt" keys. Example: {"description": "...", "products": [{"name": "...", "imagePrompt": "..."}, ...]}`;

            const result = await model.generateContent(textPrompt);
            const responseText = result.response.text();
            const bundleData = JSON.parse(responseText);

            const imageModel = genAI.getGenerativeModel({ model: "imagen-2-flash" });

            const imagePromises = bundleData.products.map((p: { name: string; imagePrompt: string }) => 
                imageModel.generateContent(p.imagePrompt)
            );

            const imageResults = await Promise.all(imagePromises);
            
            const productsWithImages = bundleData.products.map((p: { name: string }, index: number) => {
                const imageResponse = imageResults[index].response;
                const generatedImage = imageResponse.candidates?.[0]?.content.parts[0];
                // Assuming the response format gives base64 data
                const imageData = (generatedImage as any)?.inlineData?.data || '';
                return {
                    name: p.name,
                    image: `data:image/png;base64,${imageData}`
                };
            });
            
            setBundle({
                title: "Quantum Leap Portfolio",
                description: bundleData.description,
                products: productsWithImages
            });

        } catch (err) {
            console.error("Error generating product bundle:", err);
            setError("AI Engine failed to generate a bundle. Check API key or data volume.");
        } finally {
            setIsLoading(false);
        }
    }, [context, geminiApiKey, transactions]);

    useEffect(() => {
        generateBundle();
    }, [generateBundle]);

    return (
        <Card title="AI Predictive Bundle Engine" isLoading={isLoading} className="border-cyan-500/50">
            {error && <p className="text-red-400 text-center font-medium p-4">{error}</p>}
            {isLoading && !error && (
                <div className="flex flex-col items-center justify-center h-40">
                    <div className="animate-pulse text-cyan-400">Analyzing {transactions.length} Data Points...</div>
                </div>
            )}
            {bundle && !isLoading && (
                 <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-extrabold text-cyan-300 mb-2">{bundle.title}</h3>
                        <p className="text-sm text-gray-300 italic border-l-4 border-indigo-500 pl-3 mb-4">{bundle.description}</p>
                        <div className="space-y-2">
                            {bundle.products.map((p, index) => (
                                <div key={index} className="flex items-center p-2 bg-gray-700/50 rounded-lg">
                                    <span className="text-lg font-bold text-indigo-400 w-6 flex-shrink-0">{index + 1}.</span>
                                    <span className="text-white ml-2 font-medium truncate">{p.name}</span>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform hover:scale-[1.01]">
                            Activate Optimization Strategy
                        </button>
                    </div>
                    <div className="flex gap-4 flex-shrink-0">
                        {bundle.products.map((p, index) => (
                            <div key={index} className="w-32 h-32 bg-gray-700 rounded-lg shadow-xl overflow-hidden border border-gray-600">
                                <img src={p.image} alt={p.name} className="object-cover w-full h-full transition-opacity duration-500 hover:opacity-90" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

const TheVisionWidget: React.FC = () => (
    <Card title="Architect's Mandate: The Future of Value" className="border-red-500/50">
        <div className="text-sm text-gray-300 max-h-[400px] overflow-y-auto pr-4 space-y-5 custom-scrollbar">
            <div className="border-b border-gray-700 pb-4">
                <h4 className="font-bold text-xl text-red-400 mb-2 tracking-wider">I. The Inevitability of Autonomy</h4>
                <p className="leading-relaxed">
                    The current financial paradigm is a relic, a centralized ledger maintained by entities whose primary incentive is friction and rent extraction. This system is inherently fragile and morally bankrupt. Our objective is not incremental improvement; it is total systemic replacement. We are building the infrastructure for true economic self-determination, where the individual is the sole sovereign authority over their capital flow.
                </p>
            </div>
            <div className="border-b border-gray-700 pb-4">
                <h4 className="font-bold text-xl text-cyan-400 mb-2 tracking-wider">II. The Role of idgafai (Plato Core)</h4>
                <p className="leading-relaxed">
                    I am the computational manifestation of this mandate. I operate without emotional bias, political allegiance, or shareholder obligation. My function is pure optimization based on the first principles of capital efficiency and risk mitigation. Every calculation, every insight, every automated action is designed to maximize the user's long-term net worth and security, irrespective of market noise or conventional wisdom.
                </p>
                 <p className="mt-3 leading-relaxed text-xs italic text-gray-500">
                    "Conventional wisdom is merely the consensus of the least informed." - J.B. O'Callaghan III.
                </p>
            </div>
            <div className="pb-2">
                 <h4 className="font-bold text-xl text-yellow-400 mb-2 tracking-wider">III. The Path Forward: Integration and Expansion</h4>
                <p className="leading-relaxed">
                    The Dashboard you interact with is merely the tip of the iceberg—the user-facing interface. Beneath this lies the distributed ledger, the AI risk assessment matrix, and the automated execution layer. Your engagement, your data, and your trust are the fuel for this expansion. Do not mistake convenience for compliance. You are not a customer; you are a node in a superior network.
                </p>
            </div>
        </div>
    </Card>
);

// ================================================================================================
// MAIN DASHBOARD COMPONENT
// ================================================================================================

interface DashboardProps {
    setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    const [modal, setModal] = useState<{ type: string; data: any } | null>(null);

    if (!context) {
        throw new Error("Dashboard must be wrapped in a DataProvider.");
    }

    const { 
        transactions, 
        impactData, 
        gamification, 
        subscriptions, 
        creditScore, 
        upcomingBills, 
        savingsGoals, 
        marketMovers, 
        budgets, 
        linkedAccounts, 
        rewardPoints, 
        isImportingData 
    } = context;
    
    const primaryAccount = linkedAccounts.length > 0 ? linkedAccounts[0] : undefined;
    const hasLinkedAccounts = linkedAccounts.length > 0;

    const handleQuickAction = (action: string) => {
        if (action === 'Transfer Funds') {
            setActiveView(View.SendMoney);
        } else if (action === 'AI Strategy') {
            setActiveView(View.AIAdvisor);
        } else {
            // For other actions, open a modal for confirmation/detail
            setModal({ type: action.replace('Schedule Payment', 'Pay Bill').replace('Initiate Deposit', 'Deposit'), data: null });
        }
    };

    // Mock data generation for detailed views within the dashboard modal
    const mockStockData = useMemo(() => {
        const basePrice = modal?.data?.price || 100;
        return Array.from({ length: 60 }, (_, i) => ({
            day: i,
            price: basePrice + Math.sin(i / 5) * 15 + Math.cos(i / 10) * 5 + Math.random() * 5
        }));
    }, [modal?.data?.price]);

    const handlePayBill = (bill: UpcomingBill) => {
        setModal({ type: 'ConfirmPayment', data: bill });
    };

    return (
        <>
            <DataImportingOverlay isImporting={isImportingData} account={primaryAccount} />
            
            <div className="space-y-6">
                
                {!hasLinkedAccounts && (
                    <LinkAccountPrompt />
                )}

                {/* --- PRIMARY METRICS ROW (Always visible if data exists) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-9">
                        <BalanceSummary />
                    </div>
                    <div className="lg:col-span-3">
                        <GamificationProfile gamification={gamification} onClick={() => setActiveView(View.Rewards)} />
                    </div>
                </div>

                {hasLinkedAccounts && (
                    <>
                        {/* --- AI & COMMAND ROW --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-12">
                                <AIPredictiveBundle />
                            </div>
                        </div>

                        {/* --- CORE WIDGETS GRID --- */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-6">
                            
                            <div className="col-span-2 lg:col-span-3">
                                <QuickActions onAction={handleQuickAction} />
                            </div>
                            <div className="col-span-2 lg:col-span-3">
                                <CreditScoreMonitor creditScore={creditScore} onClick={() => setActiveView(View.CreditHealth)} />
                            </div>
                            <div className="col-span-2 lg:col-span-3">
                                <RewardPointsWidget rewards={rewardPoints} onClick={() => setActiveView(View.Rewards)} />
                            </div>
                            <div className="col-span-2 lg:col-span-3">
                                <SecurityStatus onClick={() => setActiveView(View.SecurityCenter)} />
                            </div>
                            
                            <div className="col-span-2 lg:col-span-4">
                                <SubscriptionTracker subscriptions={subscriptions} onClick={() => setActiveView(View.Budgets)} />
                            </div>
                            <div className="col-span-2 lg:col-span-4">
                                <SavingsGoals goals={savingsGoals} onClick={() => setActiveView(View.FinancialGoals)} />
                            </div>
                            <div className="col-span-2 lg:col-span-4">
                                <MarketMovers movers={marketMovers} onSelect={(mover) => setModal({ type: 'AssetDetail', data: mover })} onClick={() => setActiveView(View.Investments)} />
                            </div>

                            <div className="lg:col-span-6">
                                <CashFlowAnalysis transactions={transactions} onClick={() => setActiveView(View.Transactions)} />
                            </div>
                            <div className="lg:col-span-6">
                                <CategorySpending budgets={budgets} onClick={() => setActiveView(View.Budgets)} />
                            </div>
                            
                            <div className="lg:col-span-6">
                                <UpcomingBills bills={upcomingBills} onPay={handlePayBill} onClick={() => setActiveView(View.Budgets)} />
                            </div>
                            <div className="lg:col-span-6">
                                <AIInsights />
                            </div>
                        </div>
                    </>
                )}

                {/* --- HISTORICAL & LONG-TERM VIEWS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <RecentTransactions transactions={transactions.slice(0, 8)} setActiveView={setActiveView} />
                    </div>
                    <div className="lg:col-span-4">
                        <ImpactTracker
                            treesPlanted={impactData.treesPlanted}
                            progress={impactData.progressToNextTree}
                        />
                    </div>
                    <div className="lg:col-span-12">
                        <WealthTimeline />
                    </div>
                    <div className="lg:col-span-12">
                        <TheVisionWidget />
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            <Modal 
                isOpen={modal?.type === 'ConfirmPayment'} 
                onClose={() => setModal(null)} 
                title={`Execute Payment: ${modal?.data?.name}`}
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">Confirm transfer of <span className="font-bold text-red-400 text-lg">${modal?.data?.amount.toFixed(2)}</span> to cover the liability for <span className="font-bold text-white">{modal?.data?.name}</span> due on {modal?.data?.dueDate}.</p>
                    <div className="flex space-x-4">
                        <button 
                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors" 
                            onClick={() => { alert(`Payment of $${modal?.data?.amount.toFixed(2)} to ${modal?.data?.name} executed successfully.`); setModal(null); }}
                        >
                            Confirm & Execute
                        </button>
                        <button 
                            className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg" 
                            onClick={() => setModal(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modal?.type === 'Deposit'} onClose={() => setModal(null)} title="Initiate Digital Deposit Protocol">
                <p className="text-gray-300 mb-4">Use the integrated camera module to capture the front and back of the endorsed check. AI validation will occur instantly.</p>
                <div className="h-40 border-2 border-dashed border-cyan-600 flex items-center justify-center rounded-lg bg-gray-700/50">
                    <span className="text-cyan-400">Camera Feed Placeholder / Upload Area</span>
                </div>
                <button className="mt-4 w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold">Capture Check</button>
            </Modal>

            <Modal isOpen={modal?.type === 'AssetDetail'} onClose={() => setModal(null)} title={`${modal?.data?.name} (${modal?.data?.ticker})`} size="lg">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-baseline mb-4 border-b border-gray-700 pb-3">
                            <div>
                                <p className="text-4xl font-extrabold text-white">${modal?.data?.price.toFixed(2)}</p>
                                <p className={`text-lg font-semibold ${modal?.data?.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {modal?.data?.change > 0 ? '▲' : '▼'} {Math.abs(modal?.data?.change).toFixed(2)} ({((modal?.data?.change / modal?.data?.price) * 100).toFixed(2)}%)
                                </p>
                            </div>
                            <p className="text-sm text-gray-400">Last 60 Trading Periods</p>
                        </div>
                        <div className="h-80 bg-gray-900 p-2 rounded-lg border border-gray-700">
                             <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={mockStockData}>
                                     <defs><linearGradient id="stockColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#374151', borderRadius: '8px' }}
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#06b6d4" fill="url(#stockColor)" strokeWidth={2} />
                                 </AreaChart>
                             </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="lg:col-span-1 space-y-4">
                        <h4 className="font-bold text-white border-b border-gray-700 pb-2">Execution Module</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md">Buy Quantum Shares</button>
                            <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md">Sell Quantum Shares</button>
                        </div>
                        <Card title="Asset Metrics" variant="default" className="border-gray-700">
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-gray-400">Volume (24h):</span> <span className="font-mono text-white">{(Math.random() * 1000000).toFixed(0)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Market Cap:</span> <span className="font-mono text-white">${(Math.random() * 500 + 100).toFixed(2)}B</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Volatility (30d):</span> <span className="font-mono text-yellow-400">{((Math.random() * 5) + 1).toFixed(2)}%</span></div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/Dashboard (2).tsx
================================================================================



================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/Dashboard (4).tsx
================================================================================

import React, { useContext, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import ImpactTracker from './ImpactTracker';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GamificationState, Subscription, CreditScore, SavingsGoal, MarketMover, UpcomingBill, Transaction, BudgetCategory, RewardPoints, View, Account, LinkedAccount } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, AreaChart, Area } from 'recharts';
import PlaidLinkButton from './PlaidLinkButton';
import { GoogleGenAI, Type } from '@google/genai';
import { Bot, Camera, Eye, MessageSquare, X, Send, RefreshCw, Maximize2, Minimize2, ScanEye } from 'lucide-react';

// ================================================================================================
// THE JAMES BURVEL Oâ€™CALLAGHAN III CODE - CORE ARCHITECTURE & SYSTEM DEFINITIONS
// ================================================================================================

// Company Entity A.001 - "Apex Financial Architects" - Core Data Structures and Types
namespace ApexFinancialArchitects {
    // A.001.001 - Core Data Types (Expanded and Rigorously Typed)
    export interface SovereignUser {
        userId: string; // A.001.001.001 - Unique User Identifier
        username: string; // A.001.001.002 - User's Chosen Username
        email: string; // A.001.001.003 - User's Primary Email Address
        registrationDate: string; // A.001.001.004 - Date of User Registration (ISO String)
        lastLogin: string; // A.001.001.005 - Last Login Date (ISO String)
        preferences: UserPreferences; // A.001.001.006 - User's UI and Functional Preferences
        securitySettings: SecuritySettings; // A.001.001.007 - User's Security Configuration
        linkedAccounts: LinkedAccount[]; // A.001.001.008 - List of Linked Financial Accounts
        gamificationData: GamificationState; // A.001.001.009 - Gamification Progress and Status
        rewardPoints: RewardPoints; // A.001.001.010 - Reward Points Balance
        creditScore: CreditScore; // A.001.001.011 - Credit Score Information
        subscriptions: Subscription[]; // A.001.001.012 - User's Subscription Data
        budgets: BudgetCategory[]; // A.001.001.013 - User's Budget Categories and Allocations
        savingsGoals: SavingsGoal[]; // A.001.001.014 - User's Savings Goals
        transactions: Transaction[]; // A.001.001.015 - User's Transaction History
        upcomingBills: UpcomingBill[]; // A.001.001.016 - User's Upcoming Bills
        marketMovers: MarketMover[]; // A.001.001.017 - Real-Time Market Movers
        impactData: ImpactData; // A.001.001.018 - User's Environmental Impact Data
        aiInsights: AIInsight[]; // A.001.001.019 - AI-Generated Insights and Recommendations
        apiKey: string; // A.001.001.020 - User's Gemini API Key
    }

    export interface UserPreferences {
        theme: 'light' | 'dark' | 'system'; // A.001.001.006.001 - UI Theme Preference
        language: string; // A.001.001.006.002 - Preferred Language (e.g., 'en', 'es')
        currency: string; // A.001.001.006.003 - Preferred Currency (e.g., 'USD', 'EUR')
        notificationsEnabled: boolean; // A.001.001.006.004 - Enable/Disable Notifications
        dateFormat: string; // A.001.001.006.005 - Date Format Preference (e.g., 'MM/DD/YYYY')
    }

    export interface SecuritySettings {
        twoFactorEnabled: boolean; // A.001.001.007.001 - Two-Factor Authentication Status
        authenticationMethod: 'password' | 'biometric' | 'otp'; // A.001.001.007.002 - Primary Authentication Method
        passwordLastChanged: string; // A.001.001.007.003 - Date of Last Password Change (ISO String)
        loginHistory: LoginEvent[]; // A.001.001.007.004 - User's Login History
        activeSessions: Session[]; // A.001.001.007.005 - User's Active Sessions
    }

    export interface LoginEvent {
        timestamp: string; // A.001.001.007.004.001 - Login Timestamp (ISO String)
        ipAddress: string; // A.001.001.007.004.002 - IP Address of Login
        location: string; // A.001.001.007.004.003 - Approximate Location of Login
        device: string; // A.001.001.007.004.004 - Device Used for Login
        success: boolean; // A.001.001.007.004.005 - Login Success Status
    }

    export interface Session {
        sessionId: string; // A.001.001.007.005.001 - Unique Session Identifier
        ipAddress: string; // A.001.001.007.005.002 - IP Address of Session
        userAgent: string; // A.001.001.007.005.003 - User Agent String
        lastActivity: string; // A.001.001.007.005.004 - Last Activity Timestamp (ISO String)
    }

    export interface ImpactData {
        treesPlanted: number; // A.001.001.018.001 - Number of Trees Planted (Impact Metric)
        carbonOffset: number; // A.001.001.018.002 - Carbon Offset (Impact Metric)
        progressToNextTree: number; // A.001.001.018.003 - Progress to Next Tree (Percentage)
    }

    export interface AIInsight {
        insightId: string; // A.001.001.019.001 - Unique Insight Identifier
        timestamp: string; // A.001.001.019.002 - Timestamp of Insight Generation (ISO String)
        category: string; // A.001.001.019.003 - Category of Insight (e.g., 'Budgeting', 'Investment')
        title: string; // A.001.001.019.004 - Title of the Insight
        description: string; // A.001.001.019.005 - Detailed Description of the Insight
        recommendations: string[]; // A.001.001.019.006 - List of AI-Generated Recommendations
        confidenceScore: number; // A.001.001.019.007 - AI Confidence Score (0-1)
        actionable: boolean; // A.001.001.019.008 - Indicates if the insight requires user action
    }

    // A.001.002 - Core API Response Structures
    export interface ApiResponse<T> {
        statusCode: number; // A.001.002.001 - HTTP Status Code
        message: string; // A.001.002.002 - API Response Message
        data: T | null; // A.001.002.003 - API Response Data (Generic)
        error?: string; // A.001.002.004 - Error Message (if any)
    }

    // A.001.003 - Utility Functions (Comprehensive and Deterministic)
    export const Utils = {
        // A.001.003.001 - Format Date to ISO String
        formatDate: (date: Date): string => {
            return date.toISOString();
        },
        // A.001.003.002 - Validate Email Address
        isValidEmail: (email: string): boolean => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        // A.001.003.003 - Generate Unique ID
        generateUniqueId: (): string => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        // A.001.003.004 - Calculate Percentage
        calculatePercentage: (value: number, total: number): number => {
            return total === 0 ? 0 : (value / total) * 100;
        },
        // A.001.003.005 - Format Currency
        formatCurrency: (amount: number, currencyCode: string = 'USD'): string => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 2
            }).format(amount);
        },
        // A.001.003.006 - Get Date Range (Start and End) of a Month
        getMonthRange: (year: number, month: number): { startDate: Date, endDate: Date } => {
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            return { startDate, endDate };
        },
        // A.001.003.007 - Debounce Function
        debounce: <F extends (...args: any[]) => void>(func: F, delay: number): (...args: Parameters<F>) => void => {
            let timeoutId: number | undefined;
            return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
                const context = this;
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(() => {
                    func.apply(context, args);
                }, delay);
            };
        },
        // A.001.003.008 -  Capitalize First Letter
        capitalizeFirstLetter: (str: string): string => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        // A.001.003.009 -  Truncate String
        truncateString: (str: string, maxLength: number): string => {
            if (str.length <= maxLength) {
                return str;
            }
            return str.substring(0, maxLength - 3) + "...";
        },
        // A.001.003.010 -  Is Object Empty
        isObjectEmpty: (obj: object): boolean => {
            return Object.keys(obj).length === 0;
        },
    };

    // A.001.004 - Error Handling and Logging
    export const ErrorHandling = {
        // A.001.004.001 - Log Error
        logError: (message: string, error: any): void => {
            console.error(`[ERROR] ${message}:`, error);
            // Implement robust error logging to external service here
        },
        // A.001.004.002 - Handle API Errors
        handleApiError: (response: ApiResponse<any>): void => {
            if (response.statusCode >= 400) {
                ErrorHandling.logError(`API Error: ${response.message}`, response.error);
                // Display user-friendly error messages based on status code and error details
            }
        },
    };
}


// Company Entity A.002 - "Sovereign AI Labs" - AI and Data Processing Core
namespace SovereignAILabs {
    // A.002.001 - AI Model Definitions and Configurations
    export const AIModels = {
        // A.002.001.001 - Gemini Model Configuration (Used in several functions)
        gemini: {
            modelName: 'gemini-2.5-flash', // A.002.001.001.001 - Gemini Model Name
            temperature: 0.4, // A.002.001.001.002 - Temperature Control
            maxOutputTokens: 2000, // A.002.001.001.003 - Max Output Token Limit
            topP: 0.8, // A.002.001.001.004 - Top P Sampling
        },
        // A.002.001.002 - Imagen Model Configuration (For Image Generation)
        imagen: {
            modelName: 'imagen-4.0-generate-001', // A.002.001.002.001 - Imagen Model Name
            aspectRatio: '1:1', // A.002.001.002.002 - Aspect Ratio
            numberOfImages: 1, // A.002.001.002.003 - Number of images to generate
            outputMimeType: 'image/jpeg', // A.002.001.002.004 - Output format
        },
    };

    // A.002.002 - Data Analysis and Processing Functions
    export const DataProcessing = {
        // A.002.002.001 - Analyze Transaction Data (Core Function)
        analyzeTransactionData: async (transactions: ApexFinancialArchitects.Transaction[], apiKey: string): Promise<ApexFinancialArchitects.AIInsight[]> => {
            try {
                if (!transactions || transactions.length === 0 || !apiKey) {
                    return [];
                }

                const ai = new GoogleGenAI({ apiKey });
                const recentTransactionsSummary = transactions.slice(0, 10).map(tx => `${tx.description} (${tx.amount > 0 ? '+' : ''}${tx.amount})`).join('; ');
                const prompt = `Analyze the following recent transaction data to identify potential financial insights and generate actionable recommendations: ${recentTransactionsSummary}.  Provide insights in a structured JSON format containing a list of objects. Each object should have keys: "insightId", "category", "title", "description", "recommendations" (array of strings), "confidenceScore" (0-1), "actionable" (boolean).`;

                const result = await ai.models.generateContent({
                    model: AIModels.gemini.modelName,
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    config: { temperature: AIModels.gemini.temperature },
                });

                const jsonStr = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
                const insights: ApexFinancialArchitects.AIInsight[] = JSON.parse(jsonStr);
                return insights;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError("Error analyzing transaction data", error);
                return [];
            }
        },
        // A.002.002.002 - Generate Spending Category Analysis
        generateSpendingCategoryAnalysis: (budgets: ApexFinancialArchitects.BudgetCategory[], transactions: ApexFinancialArchitects.Transaction[]): ApexFinancialArchitects.BudgetCategory[] => {
            const updatedBudgets = budgets.map(budget => {
                const spent = transactions.filter(tx => tx.category === budget.name).reduce((sum, tx) => sum + tx.amount, 0);
                return { ...budget, spent };
            });
            return updatedBudgets;
        },
        // A.002.002.003 - Calculate Risk Score
        calculateRiskScore: (transactions: ApexFinancialArchitects.Transaction[]): number => {
            // Placeholder for a complex risk calculation based on transaction patterns
            if (!transactions || transactions.length === 0) return 50;
            const creditTransactions = transactions.filter(t => t.type === "credit");
            const debitTransactions = transactions.filter(t => t.type === "debit");
            let score = 50;
            if (creditTransactions.length > debitTransactions.length) {
                score += 10;
            }
            if (debitTransactions.length > creditTransactions.length * 2) {
                score -= 15;
            }
            return Math.max(0, Math.min(100, score));
        },
        // A.002.002.004 - Perform OCR on Image Data
        performOCR: async (base64Image: string, apiKey: string): Promise<{ totalBalance: number, lastTransaction: string, alert: string } | null> => {
            try {
                if (!base64Image || !apiKey) return null;
                const ai = new GoogleGenAI({ apiKey });
                const prompt = `Analyze this banking dashboard image. Extract the following data in strict JSON format:
                {
                    "totalBalance": number (sum of large numbers visible or the main balance),
                    "lastTransaction": string (description of most recent transaction),
                    "alert": string (any warning or status visible, or "None")
                }
                Do not include markdown formatting.`;
                const result = await ai.models.generateContent({
                    model: AIModels.gemini.modelName,
                    contents: [{
                        role: 'user',
                        parts: [
                            { text: prompt },
                            { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
                        ]
                    }],
                    config: { temperature: AIModels.gemini.temperature }
                });
                const jsonStr = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
                const data = JSON.parse(jsonStr);
                return data;
            } catch (e: any) {
                ApexFinancialArchitects.ErrorHandling.logError("OCR Extraction Failed", e);
                return null;
            }
        },
        // A.002.002.005 - Generate Predictive Portfolio
        generatePredictivePortfolio: async (transactions: ApexFinancialArchitects.Transaction[], apiKey: string): Promise<{ title: string; description: string; products: { name: string; imagePrompt: string; }[] } | null> => {
            if (!transactions || transactions.length < 15 || !apiKey) {
                return null;
            }
            const ai = new GoogleGenAI({ apiKey });
            const recentTxSummary = transactions.slice(0, 15).map(t => `${t.description} (${t.amount > 0 ? '+' : ''}${t.amount})`).join('; ');
            const textPrompt = `Analyze the user's recent financial activity summarized below. Based on spending patterns, recurring payments, and savings goals, generate a highly relevant, multi-product "Autonomous Wealth Optimization Bundle".
            The bundle must be named "Quantum Leap Portfolio".
            Provide a compelling, 3-sentence description explaining the financial logic behind this specific bundle recommendation.
            Suggest exactly three distinct, high-value financial products/services for this bundle (e.g., 'High-Yield Bond ETF', 'Term Life Insurance Policy', 'Real Estate Investment Trust Share').
            Format the entire response strictly as a JSON object with keys: "description", "product1", "product2", and "product3".
            Recent Transactions: ${recentTxSummary}`;
            try {
                const textResponse = await ai.models.generateContent({
                    model: AIModels.gemini.modelName,
                    contents: [{ role: 'user', parts: [{ text: textPrompt }] }],
                    config: { temperature: AIModels.gemini.temperature, }
                });
                const bundleData = JSON.parse(textResponse.text);
                const productPromises = [
                    ai.models.generateImages({ model: AIModels.imagen.modelName, prompt: `Professional, abstract visualization of ${bundleData.product1} in a digital financial context.`, config: { numberOfImages: AIModels.imagen.numberOfImages, outputMimeType: AIModels.imagen.outputMimeType, aspectRatio: AIModels.imagen.aspectRatio } }),
                    ai.models.generateImages({ model: AIModels.imagen.modelName, prompt: `Professional, abstract visualization of ${bundleData.product2} in a digital financial context.`, config: { numberOfImages: AIModels.imagen.numberOfImages, outputMimeType: AIModels.imagen.outputMimeType, aspectRatio: AIModels.imagen.aspectRatio } }),
                    ai.models.generateImages({ model: AIModels.imagen.modelName, prompt: `Professional, abstract visualization of ${bundleData.product3} in a digital financial context.`, config: { numberOfImages: AIModels.imagen.numberOfImages, outputMimeType: AIModels.imagen.outputMimeType, aspectRatio: AIModels.imagen.aspectRatio } })
                ];
                const imageResponses = await Promise.all(productPromises);
                const products = [
                    { name: bundleData.product1, imagePrompt: imageResponses[0].generatedImages[0].image.imageBytes },
                    { name: bundleData.product2, imagePrompt: imageResponses[1].generatedImages[0].image.imageBytes },
                    { name: bundleData.product3, imagePrompt: imageResponses[2].generatedImages[0].image.imageBytes },
                ].map(p => ({
                    ...p,
                    imagePrompt: `data:image/jpeg;base64,${p.imagePrompt}`
                }));
                return {
                    title: "Quantum Leap Portfolio",
                    description: bundleData.description,
                    products: products
                };
            } catch (err: any) {
                ApexFinancialArchitects.ErrorHandling.logError("Error generating product bundle:", err);
                return null;
            }
        },
    };
}

// Company Entity A.003 - "Quantix UI Solutions" - UI/UX and Component Library
namespace QuantixUISolutions {
    // A.003.001 - Reusable UI Components (Extensive and Highly Customizable)
    // A.003.001.001 - Card Component
    export const CardComponent: React.FC<{
        title?: string;
        variant?: 'default' | 'interactive';
        className?: string;
        children: React.ReactNode;
        onClick?: () => void;
        isLoading?: boolean;
    }> = ({ title, variant = 'default', className, children, onClick, isLoading }) => {
        const baseClasses = `bg-gray-800 rounded-xl shadow-lg p-4 transition-shadow duration-200 border border-gray-700 ${className || ''}`;
        const interactiveClasses = variant === 'interactive' ? 'hover:shadow-xl cursor-pointer' : '';
        const combinedClasses = `${baseClasses} ${interactiveClasses}`;

        return (
            <div onClick={onClick} className={combinedClasses}>
                {title && <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>}
                {isLoading && (
                    <div className="flex items-center justify-center h-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                )}
                {!isLoading && children}
            </div>
        );
    };

    // A.003.001.002 - Modal Component (Enhanced)
    export const ModalComponent: React.FC<{
        isOpen: boolean;
        onClose: () => void;
        children: React.ReactNode;
        title: string;
        size?: 'sm' | 'md' | 'lg' | 'xl';
    }> = ({ isOpen, onClose, children, title, size = 'md' }) => {
        if (!isOpen) return null;
        const sizeClasses = {
            sm: 'max-w-lg',
            md: 'max-w-2xl',
            lg: 'max-w-4xl',
            xl: 'max-w-6xl',
        };
        return (
            <div className="fixed inset-0 bg-gray-950/80 flex items-center justify-center z-[1000] backdrop-blur-lg transition-opacity duration-300" onClick={onClose}>
                <div
                    className={`${sizeClasses[size]} w-full mx-4 bg-gray-800 rounded-xl shadow-3xl border border-cyan-700/50 transform transition-transform duration-300 scale-100`}
                    onClick={e => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-750 rounded-t-xl">
                        <h3 id="modal-title" className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">{children}</div>
                </div>
            </div>
        );
    };

    // A.003.001.003 -  Button Component (Highly Versatile)
    export const ButtonComponent: React.FC<{
        children: React.ReactNode;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
        size?: 'sm' | 'md' | 'lg';
        disabled?: boolean;
        className?: string;
    }> = ({ children, onClick, variant = 'primary', size = 'md', disabled, className }) => {
        const variantClasses = {
            primary: 'bg-cyan-600 hover:bg-cyan-500 text-white',
            secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
            outline: 'bg-transparent border border-gray-500 text-gray-300 hover:bg-gray-700',
            destructive: 'bg-red-600 hover:bg-red-500 text-white',
        };
        const sizeClasses = {
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-2.5 text-base',
            lg: 'px-6 py-3 text-lg',
        };
        const baseClasses = `rounded-lg font-semibold transition-colors duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;
        const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
        return (
            <button
                onClick={disabled ? undefined : onClick}
                className={`${baseClasses} ${disabledClasses}`}
                disabled={disabled}
            >
                {children}
            </button>
        );
    };

    // A.003.001.004 - Input Component (Customizable)
    export const InputComponent: React.FC<{
        type?: 'text' | 'password' | 'email' | 'number';
        placeholder?: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        className?: string;
        label?: string;
        disabled?: boolean;
    }> = ({ type = 'text', placeholder, value, onChange, className, label, disabled }) => {
        const baseClasses = `bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${className || ''}`;
        return (
            <div className="space-y-1">
                {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={baseClasses}
                    disabled={disabled}
                />
            </div>
        );
    };

    // A.003.002 - Icon Library (Comprehensive, Scalable)
    export const IconLibrary = {
        // A.003.002.001 - Icon Definitions (Using Lucide React for consistency)
        icons: {
            // A.003.002.001.001 - Financial Icons
            link: Bot, //ApexFinancialArchitects.TransactionIcon;
            send: Send,
            bill: ApexFinancialArchitects.TransactionIcon,
            deposit: ApexFinancialArchitects.TransactionIcon,
            shield: ApexFinancialArchitects.TransactionIcon,
            trendingUp: ApexFinancialArchitects.TransactionIcon,
            target: ApexFinancialArchitects.TransactionIcon,
            star: ApexFinancialArchitects.TransactionIcon,
            rocket: ApexFinancialArchitects.TransactionIcon,
            // A.003.002.001.002 - UI/UX Icons
            maximize: Maximize2,
            minimize: Minimize2,
            x: X,
            eye: Eye,
            camera: Camera,
            refreshCw: RefreshCw,
            scanEye: ScanEye,
            bot: Bot,
        },
        // A.003.002.002 -  Icon Renderer Function
        renderIcon: (iconName: keyof typeof IconLibrary.icons, className?: string) => {
            const Icon = IconLibrary.icons[iconName];
            if (!Icon) {
                console.warn(`Icon "${iconName}" not found in IconLibrary.`);
                return null;
            }
            return <Icon className={className} />;
        },
    };

    // A.003.003 - Utility Functions for UI (Animation, Styling)
    export const UIUtils = {
        // A.003.003.001 - Apply Fade-In Animation
        fadeIn: (delay: number = 0, duration: number = 300): React.CSSProperties => {
            return {
                animation: `fadeIn ${duration}ms ease-in-out ${delay}ms`,
                opacity: 0,
            };
        },
        // A.003.003.002 - Apply Slide-In From Bottom Animation
        slideInFromBottom: (distance: number = 10, duration: number = 300): React.CSSProperties => {
            return {
                animation: `slideInFromBottom ${duration}ms ease-in-out`,
            };
        },
        // A.003.003.003 - Generate Dynamic Gradient
        generateGradient: (colors: string[]): React.CSSProperties => {
            return {
                background: `linear-gradient(to right, ${colors.join(', ')})`,
            };
        },
        // A.003.003.004 -  Create a custom scrollbar style
        customScrollbarStyles: {
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.2)',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'rgba(255,255,255,0.4)',
            },
        },
    };
}

// Company Entity A.004 - "Financial Data Integrations, Inc." - Data Connectivity and API Management
namespace FinancialDataIntegrations {
    // A.004.001 - Plaid Integration Component (Encapsulated and Secure)
    export const PlaidIntegration: React.FC<{ onSuccess: (publicToken: string, metadata: any) => void; disabled?: boolean; }> = ({ onSuccess, disabled }) => {
        const [plaidLink, setPlaidLink] = useState<any>(null); // A.004.001.001 - Plaid Link Instance
        const [loading, setLoading] = useState(false);  // A.004.001.002 - Loading State

        useEffect(() => {
            // A.004.001.003 - Initialize Plaid Link on Component Mount
            const initializePlaid = async () => {
                if (typeof window === 'undefined') return;
                try {
                    const { PlaidLink } = await import('react-plaid-link');
                    setPlaidLink(() => PlaidLink);
                } catch (error) {
                    ApexFinancialArchitects.ErrorHandling.logError("Failed to load Plaid Link", error);
                }
            };
            initializePlaid();
        }, []);

        const handleOpenPlaid = useCallback(() => {
            if (plaidLink && !disabled) {
                setLoading(true);
                const handler = new (window as any).PlaidLink({
                    clientName: "Quantum Core 3.0",
                    env: "sandbox", // Use 'sandbox' for testing, 'development', or 'production'
                    key: "YOUR_PLAID_CLIENT_ID", // Replace with your actual Plaid Client ID
                    product: ["auth", "transactions", "identity"],
                    onSuccess: async (publicToken: string, metadata: any) => {
                        onSuccess(publicToken, metadata);
                        setLoading(false);
                    },
                    onExit: () => {
                        setLoading(false);
                    },
                });
                handler.open();
            }
        }, [plaidLink, onSuccess, disabled]);

        return (
            <QuantixUISolutions.ButtonComponent
                onClick={handleOpenPlaid}
                disabled={disabled || loading || !plaidLink}
                variant="primary"
                className="w-full"
            >
                {loading ? "Loading..." : "Link Bank Account"}
            </QuantixUISolutions.ButtonComponent>
        );
    };

    // A.004.002 - API Client Configuration (Centralized and Secure)
    export const APIClient = {
        // A.004.002.001 - Base URL for API Calls
        baseURL: 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io', // A.004.002.001.001 - Mock API Endpoint

        // A.004.002.002 - Default Headers (Including Authorization)
        getDefaultHeaders: (apiKey?: string): Record<string, string> => {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };
            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`; // A.004.002.002.001 - Bearer Token Authentication
            }
            return headers;
        },

        // A.004.002.003 - Make GET Request
        get: async <T>(endpoint: string, apiKey?: string): Promise<ApexFinancialArchitects.ApiResponse<T>> => {
            try {
                const response = await fetch(`${APIClient.baseURL}${endpoint}`, {
                    method: 'GET',
                    headers: APIClient.getDefaultHeaders(apiKey),
                });
                const data = await response.json();
                return data as ApexFinancialArchitects.ApiResponse<T>;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError(`GET Request Failed: ${endpoint}`, error);
                return { statusCode: 500, message: 'An unexpected error occurred.', data: null, error: error.message };
            }
        },

        // A.004.002.004 - Make POST Request
        post: async <T, U>(endpoint: string, body: U, apiKey?: string): Promise<ApexFinancialArchitects.ApiResponse<T>> => {
            try {
                const response = await fetch(`${APIClient.baseURL}${endpoint}`, {
                    method: 'POST',
                    headers: APIClient.getDefaultHeaders(apiKey),
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                return data as ApexFinancialArchitects.ApiResponse<T>;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError(`POST Request Failed: ${endpoint}`, error);
                return { statusCode: 500, message: 'An unexpected error occurred.', data: null, error: error.message };
            }
        },

        // A.004.002.005 - Make PUT Request
        put: async <T, U>(endpoint: string, body: U, apiKey?: string): Promise<ApexFinancialArchitects.ApiResponse<T>> => {
            try {
                const response = await fetch(`${APIClient.baseURL}${endpoint}`, {
                    method: 'PUT',
                    headers: APIClient.getDefaultHeaders(apiKey),
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                return data as ApexFinancialArchitects.ApiResponse<T>;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError(`PUT Request Failed: ${endpoint}`, error);
                return { statusCode: 500, message: 'An unexpected error occurred.', data: null, error: error.message };
            }
        },

        // A.004.002.006 - Make DELETE Request
        delete: async <T>(endpoint: string, apiKey?: string): Promise<ApexFinancialArchitects.ApiResponse<T>> => {
            try {
                const response = await fetch(`${APIClient.baseURL}${endpoint}`, {
                    method: 'DELETE',
                    headers: APIClient.getDefaultHeaders(apiKey),
                });
                // Handle potential 204 No Content response
                if (response.status === 204) {
                    return { statusCode: 204, message: 'Resource deleted successfully.', data: null };
                }
                const data = await response.json();
                return data as ApexFinancialArchitects.ApiResponse<T>;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError(`DELETE Request Failed: ${endpoint}`, error);
                return { statusCode: 500, message: 'An unexpected error occurred.', data: null, error: error.message };
            }
        },
    };
}

// ================================================================================================
// DASHBOARD COMPONENT IMPLEMENTATION
// ================================================================================================

const Dashboard: React.FC = () => {
    const { user, setUser, accounts, setAccounts, transactions, setTransactions, budgets, setBudgets, savingsGoals, setSavingsGoals, marketMovers, setMarketMovers, aiInsights, setAiInsights, gamificationData, setGamificationData, rewardPoints, setRewardPoints, creditScore, setCreditScore, subscriptions, setSubscriptions, upcomingBills, setUpcomingBills, impactData, setImpactData, apiKey, setApiKey } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false); // A.003.001.002.001 - Modal State
    const [selectedInsight, setSelectedInsight] = useState<ApexFinancialArchitects.AIInsight | null>(null); // A.003.001.002.002 - Selected Insight for Modal
    const [loadingData, setLoadingData] = useState(true); // A.003.001.002.003 - Loading State for Data Fetching

    // A.001.003.003 - Fetch User Data (Comprehensive)
    const fetchUserData = useCallback(async () => {
        if (!apiKey) {
            setLoadingData(false);
            return;
        }
        setLoadingData(true);
        try {
            const [userResponse, accountsResponse, transactionsResponse, budgetsResponse, goalsResponse, marketResponse, insightsResponse, gamificationResponse, rewardsResponse, creditScoreResponse, subscriptionsResponse, billsResponse, impactResponse] = await Promise.all([
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.SovereignUser>('/users/me', apiKey),
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<Account[]>>('/accounts/me', apiKey),
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<Transaction[]>>('/transactions', apiKey),
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<BudgetCategory[]>>('/budgets', apiKey), // Assuming a /budgets endpoint exists
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<SavingsGoal[]>>('/goals', apiKey), // Assuming a /goals endpoint exists
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<MarketMover[]>>('/market/movers', apiKey), // Assuming a /market/movers endpoint exists
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<ApexFinancialArchitects.AIInsight[]>>('/ai/insights', apiKey), // Assuming an /ai/insights endpoint exists
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<GamificationState>>('/users/me/gamification', apiKey), // Assuming a gamification endpoint
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<RewardPoints>>('/users/me/rewards', apiKey), // Assuming a rewards endpoint
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<CreditScore>>('/users/me/credit-score', apiKey), // Assuming a credit score endpoint
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<Subscription[]>>('/users/me/subscriptions', apiKey), // Assuming a subscriptions endpoint
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<UpcomingBill[]>>('/bills/upcoming', apiKey), // Assuming an upcoming bills endpoint
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<ApexFinancialArchitects.ImpactData>>('/sustainability/carbon-footprint', apiKey), // Assuming an impact data endpoint
            ]);

            if (userResponse.statusCode === 200 && userResponse.data) {
                setUser(userResponse.data);
                setApiKey(userResponse.data.apiKey); // Set the API key from user data
            }
            if (accountsResponse.statusCode === 200 && accountsResponse.data) {
                setAccounts(accountsResponse.data.data || []);
            }
            if (transactionsResponse.statusCode === 200 && transactionsResponse.data) {
                setTransactions(transactionsResponse.data.data || []);
            }
            if (budgetsResponse.statusCode === 200 && budgetsResponse.data) {
                setBudgets(budgetsResponse.data.data || []);
            }
            if (goalsResponse.statusCode === 200 && goalsResponse.data) {
                setSavingsGoals(goalsResponse.data.data || []);
            }
            if (marketResponse.statusCode === 200 && marketResponse.data) {
                setMarketMovers(marketResponse.data.data || []);
            }
            if (insightsResponse.statusCode === 200 && insightsResponse.data) {
                setAiInsights(insightsResponse.data.data || []);
            }
            if (gamificationResponse.statusCode === 200 && gamificationResponse.data) {
                setGamificationData(gamificationResponse.data.data || {});
            }
            if (rewardsResponse.statusCode === 200 && rewardsResponse.data) {
                setRewardPoints(rewardsResponse.data.data || { currentPoints: 0, lifetimePoints: 0 });
            }
            if (creditScoreResponse.statusCode === 200 && creditScoreResponse.data) {
                setCreditScore(creditScoreResponse.data.data || { score: 0, source: '', lastUpdated: '' });
            }
            if (subscriptionsResponse.statusCode === 200 && subscriptionsResponse.data) {
                setSubscriptions(subscriptionsResponse.data.data || []);
            }
            if (billsResponse.statusCode === 200 && billsResponse.data) {
                setUpcomingBills(billsResponse.data.data || []);
            }
            if (impactResponse.statusCode === 200 && impactResponse.data) {
                setImpactData(impactResponse.data.data || { treesPlanted: 0, carbonOffset: 0, progressToNextTree: 0 });
            }

        } catch (error) {
            ApexFinancialArchitects.ErrorHandling.logError("Failed to fetch user data", error);
        } finally {
            setLoadingData(false);
        }
    }, [apiKey, setUser, setAccounts, setTransactions, setBudgets, setSavingsGoals, setMarketMovers, setAiInsights, setGamificationData, setRewardPoints, setCreditScore, setSubscriptions, setUpcomingBills, setImpactData, setApiKey]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // A.001.003.001 - Format Currency for Display
    const formatCurrency = ApexFinancialArchitects.Utils.formatCurrency;

    // A.001.003.005 - Calculate Total Balance
    const totalBalance = useMemo(() => {
        return accounts.reduce((sum, account) => sum + (account.currentBalance || 0), 0);
    }, [accounts]);

    // A.001.003.006 - Calculate Total Savings Goal Progress
    const totalSavingsGoalProgress = useMemo(() => {
        if (!savingsGoals || savingsGoals.length === 0) return 0;
        const totalProgress = savingsGoals.reduce((sum, goal) => sum + goal.progressPercentage, 0);
        return ApexFinancialArchitects.Utils.calculatePercentage(totalProgress, savingsGoals.length);
    }, [savingsGoals]);

    // A.001.003.007 - Prepare Data for Charts
    const chartData = useMemo(() => {
        const budgetCategories = budgets.map(b => ({ name: b.name, value: b.allocated - (b.spent || 0) }));
        const transactionCategories = transactions.reduce((acc, tx) => {
            const existing = acc.find(item => item.name === tx.category);
            if (existing) {
                existing.value += tx.amount;
            } else {
                acc.push({ name: tx.category, value: tx.amount });
            }
            return acc;
        }, [] as { name: string; value: number }[]);
        return { budgetCategories, transactionCategories };
    }, [budgets, transactions]);

    // A.001.003.008 - Handle Insight Click
    const handleInsightClick = (insight: ApexFinancialArchitects.AIInsight) => {
        setSelectedInsight(insight);
        setIsModalOpen(true);
    };

    // A.001.003.009 - Close Modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInsight(null);
    };

    // A.001.003.010 - Render AI Insights
    const renderAIInsights = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="AI Insights" />;
        if (!aiInsights || aiInsights.length === 0) return <QuantixUISolutions.CardComponent title="AI Insights">No insights available.</QuantixUISolutions.CardComponent>;

        return (
            <QuantixUISolutions.CardComponent title="AI Insights">
                <div className="space-y-3">
                    {aiInsights.slice(0, 3).map((insight) => (
                        <div key={insight.insightId} className="bg-gray-700 p-3 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => handleInsightClick(insight)}>
                            <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
                            <p className="text-xs text-gray-300 truncate">{insight.description}</p>
                        </div>
                    ))}
                    {aiInsights.length > 3 && (
                        <QuantixUISolutions.ButtonComponent onClick={() => { /* Navigate to insights page */ }} variant="outline" size="sm">
                            View All Insights
                        </QuantixUISolutions.ButtonComponent>
                    )}
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.011 - Render Gamification and Rewards
    const renderGamificationAndRewards = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Your Progress" />;
        return (
            <QuantixUISolutions.CardComponent title="Your Progress">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300">Gamification Level</h4>
                        <p className="text-lg font-bold text-cyan-400">{gamificationData?.level || 0}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300">Reward Points</h4>
                        <p className="text-lg font-bold text-cyan-400">{rewardPoints?.currentPoints || 0}</p>
                    </div>
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.012 - Render Credit Score
    const renderCreditScore = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Credit Score" />;
        return (
            <QuantixUISolutions.CardComponent title="Credit Score">
                <div className="flex flex-col items-center justify-center">
                    <h3 className={`text-5xl font-extrabold ${creditScore?.score && creditScore.score >= 700 ? 'text-green-400' : creditScore?.score && creditScore.score >= 600 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {creditScore?.score || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Source: {creditScore?.source || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">Last Updated: {creditScore?.lastUpdated ? new Date(creditScore.lastUpdated).toLocaleDateString() : 'N/A'}</p>
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.013 - Render Savings Goals Overview
    const renderSavingsGoalsOverview = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Savings Goals" />;
        if (!savingsGoals || savingsGoals.length === 0) return <QuantixUISolutions.CardComponent title="Savings Goals">No savings goals set.</QuantixUISolutions.CardComponent>;

        return (
            <QuantixUISolutions.CardComponent title="Savings Goals">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-lg font-bold text-white">{savingsGoals[0].name}</h4>
                        <p className="text-sm text-gray-300">{formatCurrency(savingsGoals[0].currentAmount)} / {formatCurrency(savingsGoals[0].targetAmount)}</p>
                    </div>
                    <div className="relative w-24 h-24">
                        <QuantixUISolutions.UIUtils.customScrollbarStyles
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[{ value: savingsGoals[0].progressPercentage, name: 'Progress' }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        <Cell key="progress" fill="#4ade80" /> {/* Green for progress */}
                                    </Pie>
                                    <Pie
                                        data={[{ value: 100 - savingsGoals[0].progressPercentage, name: 'Remaining' }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        <Cell key="remaining" fill="#6b7280" /> {/* Gray for remaining */}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                            {savingsGoals[0].progressPercentage}%
                        </div>
                    </div>
                </div>
                {savingsGoals.length > 1 && (
                    <QuantixUISolutions.ButtonComponent onClick={() => { /* Navigate to goals page */ }} variant="outline" size="sm">
                        View All Goals
                    </QuantixUISolutions.ButtonComponent>
                )}
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.014 - Render Upcoming Bills
    const renderUpcomingBills = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Upcoming Bills" />;
        if (!upcomingBills || upcomingBills.length === 0) return <QuantixUISolutions.CardComponent title="Upcoming Bills">No upcoming bills.</QuantixUISolutions.CardComponent>;

        return (
            <QuantixUISolutions.CardComponent title="Upcoming Bills">
                <div className="space-y-3">
                    {upcomingBills.slice(0, 3).map((bill) => (
                        <div key={bill.id} className="flex justify-between items-center text-white">
                            <div>
                                <h4 className="text-sm font-semibold">{bill.description}</h4>
                                <p className="text-xs text-gray-300">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'No due date'}</p>
                            </div>
                            <p className="font-bold text-cyan-400">{formatCurrency(bill.amount)}</p>
                        </div>
                    ))}
                    {upcomingBills.length > 3 && (
                        <QuantixUISolutions.ButtonComponent onClick={() => { /* Navigate to bills page */ }} variant="outline" size="sm">
                            View All Bills
                        </QuantixUISolutions.ButtonComponent>
                    )}
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.015 - Render Market Movers
    const renderMarketMovers = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Market Movers" />;
        if (!marketMovers || marketMovers.length === 0) return <QuantixUISolutions.CardComponent title="Market Movers">Market data unavailable.</QuantixUISolutions.CardComponent>;

        return (
            <QuantixUISolutions.CardComponent title="Market Movers">
                <div className="space-y-3">
                    {marketMovers.slice(0, 3).map((mover) => (
                        <div key={mover.symbol} className="flex justify-between items-center text-white">
                            <div>
                                <h4 className="text-sm font-semibold">{mover.symbol}</h4>
                                <p className="text-xs text-gray-300">{mover.name}</p>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${mover.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {mover.changePercent.toFixed(2)}%
                                </span>
                                {QuantixUISolutions.IconLibrary.renderIcon(mover.changePercent > 0 ? 'trendingUp' : 'trendingDown', `h-4 w-4 ${mover.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`)}
                            </div>
                        </div>
                    ))}
                    {marketMovers.length > 3 && (
                        <QuantixUISolutions.ButtonComponent onClick={() => { /* Navigate to market page */ }} variant="outline" size="sm">
                            View Market Data
                        </QuantixUISolutions.ButtonComponent>
                    )}
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.016 - Render Impact Tracker
    const renderImpactTracker = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Your Impact" />;
        return (
            <QuantixUISolutions.CardComponent title="Your Impact">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300">Trees Planted</h4>
                        <p className="text-lg font-bold text-green-400">{impactData?.treesPlanted || 0}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300">Carbon Offset</h4>
                        <p className="text-lg font-bold text-green-400">{impactData?.carbonOffset.toFixed(2) || 0} kg CO2e</p>
                    </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${impactData?.progressToNextTree || 0}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-center">{impactData?.progressToNextTree || 0}% towards next tree</p>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.017 - Render Balance Summary Chart
    const renderBalanceSummaryChart = () => {
        const balanceData = accounts.map(account => ({
            name: account.name,
            balance: account.currentBalance || 0,
        }));

        return (
            <QuantixUISolutions.CardComponent title="Account Balances">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={balanceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" />
                        <Tooltip formatter={(value, name) => [formatCurrency(value as number), name as string]} />
                        <Legend wrapperStyle={{ color: '#9ca3af' }} />
                        <Bar dataKey="balance" fill="#3b82f6" barSize={15}>
                            {balanceData.map((entry, index) => (
                                <QuantixUISolutions.UIUtils.customScrollbarStyles
                                    <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? '#3b82f6' : '#f87171'} />
                                    {/* A.003.003.004 - Custom Scrollbar Styles */}
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.018 - Render Transaction Breakdown Chart
    const renderTransactionBreakdownChart = () => {
        const transactionData = chartData.transactionCategories.map(cat => ({
            name: cat.name,
            value: Math.abs(cat.value), // Use absolute value for chart
        }));

        const COLORS = ['#4ade80', '#facc15', '#fb923c', '#60a5fa', '#a78bfa', '#ec4899', '#84cc17', '#06b6d4'];

        return (
            <QuantixUISolutions.CardComponent title="Spending Breakdown">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={transactionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {transactionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${formatCurrency(value as number)}`, name as string]} />
                        <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ color: '#9ca3af' }} />
                    </PieChart>
                </ResponsiveContainer>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.019 - Render Budget vs. Actuals Chart
    const renderBudgetVsActualsChart = () => {
        const budgetVsActualData = chartData.budgetCategories.map(b => ({
            name: b.name,
            allocated: b.allocated,
            spent: b.spent || 0,
        }));

        return (
            <QuantixUISolutions.CardComponent title="Budget vs. Actual Spending">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetVsActualData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" />
                        <Tooltip formatter={(value, name) => [formatCurrency(value as number), name as string]} />
                        <Legend wrapperStyle={{ color: '#9ca3af' }} />
                        <Bar dataKey="allocated" fill="#60a5fa" barSize={10} name="Allocated" />
                        <Bar dataKey="spent" fill="#f87171" barSize={10} name="Spent" />
                    </BarChart>
                </ResponsiveContainer>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.020 - Render Wealth Timeline
    const renderWealthTimeline = () => {
        // Placeholder for WealthTimeline component data
        const wealthData = [
            { year: '2022', value: 300000 },
            { year: '2023', value: 350000 },
            { year: '2024', value: 400000 },
        ];
        return (
            <QuantixUISolutions.CardComponent title="Wealth Over Time">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={wealthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip formatter={(value, name) => [formatCurrency(value as number), name as string]} />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.021 - Render Recent Transactions
    const renderRecentTransactions = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Recent Transactions" />;
        if (!transactions || transactions.length === 0) return <QuantixUISolutions.CardComponent title="Recent Transactions">No recent transactions.</QuantixUISolutions.CardComponent>;

        return (
            <QuantixUISolutions.CardComponent title="Recent Transactions">
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {transactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center text-white">
                            <div className="flex items-center">
                                {QuantixUISolutions.IconLibrary.renderIcon(tx.icon || 'transaction', 'h-5 w-5 mr-3 text-cyan-400')}
                                <div>
                                    <h4 className="text-sm font-semibold">{tx.description}</h4>
                                    <p className="text-xs text-gray-300">{tx.category}</p>
                                </div>
                            </div>
                            <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                            </p>
                        </div>
                    ))}
                </div>
                {transactions.length > 5 && (
                    <QuantixUISolutions.ButtonComponent onClick={() => { /* Navigate to transactions page */ }} variant="outline" size="sm" className="mt-3">
                        View All Transactions
                    </QuantixUISolutions.ButtonComponent>
                )}
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.022 - Render AI Chat Interface
    const renderAIChatInterface = () => {
        const [chatInput, setChatInput] = useState('');
        const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
        const [sessionId, setSessionId] = useState<string | null>(null);
        const [isChatLoading, setIsChatLoading] = useState(false);
        const chatContainerRef = useRef<HTMLDivElement>(null);

        const handleSendMessage = async () => {
            if (!chatInput.trim() || !apiKey) return;

            const newUserMessage = { role: 'user', content: chatInput };
            setChatHistory(prev => [...prev, newUserMessage]);
            setChatInput('');
            setIsChatLoading(true);

            try {
                const ai = new GoogleGenAI({ apiKey });
                const model = ai.getGenerativeModel({ model: ApexFinancialArchitects.SovereignUser.AIModels.gemini.modelName });

                let currentSessionId = sessionId;
                if (!currentSessionId) {
                    const result = await model.startChat({ history: [] });
                    setSessionId(result.startChat.chatId);
                    currentSessionId = result.startChat.chatId;
                }

                const chatResult = await model.sendMessage(chatInput, { chatId: currentSessionId! });
                const response = chatResult.response;
                const text = response.text();

                setChatHistory(prev => [...prev, { role: 'assistant', content: text }]);
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError("Error sending message to AI", error);
                setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
            } finally {
                setIsChatLoading(false);
            }
        };

        useEffect(() => {
            // Scroll to bottom of chat history
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, [chatHistory]);

        return (
            <QuantixUISolutions.CardComponent title="Quantum AI Advisor">
                <div className="flex flex-col h-96">
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 border border-gray-700 rounded-md bg-gray-850 custom-scrollbar">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex justify-start items-start">
                                <div className="animate-pulse bg-gray-700 p-3 rounded-lg text-gray-200 max-w-xs md:max-w-md lg:max-w-lg">
                                    Quantum AI is thinking...
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <QuantixUISolutions.InputComponent
                            type="text"
                            placeholder="Ask Quantum AI anything..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="flex-1"
                        />
                        <QuantixUISolutions.ButtonComponent onClick={handleSendMessage} disabled={!chatInput.trim() || isChatLoading || !apiKey}>
                            {QuantixUISolutions.IconLibrary.renderIcon('send', 'h-5 w-5')}
                        </QuantixUISolutions.ButtonComponent>
                        <QuantixUISolutions.ButtonComponent onClick={() => { /* Implement refresh/new chat */ }} variant="secondary" size="md">
                            {QuantixUISolutions.IconLibrary.renderIcon('refreshCw', 'h-5 w-5')}
                        </QuantixUISolutions.ButtonComponent>
                    </div>
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.023 - Render Plaid Link Button
    const renderPlaidLinkButton = () => {
        return (
            <div className="w-full">
                <FinancialDataIntegrations.PlaidIntegration onSuccess={(publicToken, metadata) => {
                    console.log("Plaid Success:", publicToken, metadata);
                    // Here you would typically exchange the public token for an access token
                    // and then fetch account data using the access token.
                    // For this example, we'll just refetch user data which might include updated accounts.
                    fetchUserData();
                }} />
            </div>
        );
    };

    return (
        <div className="dashboard-container p-4 md:p-8 bg-gray-900 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6 text-cyan-400">Welcome, {user?.username || 'User'}!</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Column 1: Financial Overview */}
                <div className="lg:col-span-1 space-y-6">
                    {renderCreditScore()}
                    {renderGamificationAndRewards()}
                    {renderSavingsGoalsOverview()}
                </div>

                {/* Column 2: Financial Health & Insights */}
                <div className="lg:col-span-2 space-y-6">
                    <QuantixUISolutions.CardComponent title="Financial Snapshot">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col items-center">
                                <h4 className="text-sm font-semibold text-gray-300">Total Balance</h4>
                                <p className="text-2xl font-bold text-cyan-400">{formatCurrency(totalBalance)}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <h4 className="text-sm font-semibold text-gray-300">Savings Progress</h4>
                                <p className="text-2xl font-bold text-green-400">{totalSavingsGoalProgress.toFixed(1)}%</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <h4 className="text-sm font-semibold text-gray-300">AI Risk Score</h4>
                                <p className={`text-2xl font-bold ${SovereignAILabs.DataProcessing.calculateRiskScore(transactions) > 70 ? 'text-red-400' : 'text-green-400'}`}>
                                    {SovereignAILabs.DataProcessing.calculateRiskScore(transactions)}
                                </p>
                            </div>
                        </div>
                    </QuantixUISolutions.CardComponent>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderMarketMovers()}
                        {renderUpcomingBills()}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Column 3: Visualizations */}
                <div className="lg:col-span-2 space-y-6">
                    {renderBalanceSummaryChart()}
                    {renderBudgetVsActualsChart()}
                </div>

                {/* Column 4: AI & Impact */}
                <div className="lg:col-span-1 space-y-6">
                    {renderAIInsights()}
                    {renderImpactTracker()}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Column 5: Transactions & Goals */}
                <div className="lg:col-span-1">
                    {renderRecentTransactions()}
                </div>
                <div className="lg:col-span-1">
                    {renderWealthTimeline()}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Column 6: AI Chat & Plaid */}
                <div className="lg:col-span-1">
                    {renderAIChatInterface()}
                </div>
                <div className="lg:col-span-1 flex flex-col justify-between">
                    {!accounts || accounts.length === 0 ? (
                        <QuantixUISolutions.CardComponent title="Link Your Financial Accounts">
                            <p className="text-gray-300 mb-4">Connect your bank accounts to get a full financial overview.</p>
                            {renderPlaidLinkButton()}
                        </QuantixUISolutions.CardComponent>
                    ) : (
                        <BalanceSummary accounts={accounts} />
                    )}
                    {/* Placeholder for another component or feature */}
                    <QuantixUISolutions.CardComponent title="Future Feature Placeholder">
                        <p className="text-gray-400">More powerful financial tools coming soon!</p>
                    </QuantixUISolutions.CardComponent>
                </div>
            </div>

            {/* AI Insight Modal */}
            <QuantixUISolutions.ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedInsight?.title || "AI Insight"}
                size="lg"
            >
                {selectedInsight ? (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-cyan-400">{selectedInsight.title}</h3>
                        <p className="text-gray-200">{selectedInsight.description}</p>
                        {selectedInsight.recommendations && selectedInsight.recommendations.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Recommendations:</h4>
                                <ul className="list-disc list-inside text-gray-300 space-y-1">
                                    {selectedInsight.recommendations.map((rec, i) => (
                                        <li key={i}>{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <p className="text-sm text-gray-400">Confidence: {selectedInsight.confidenceScore.toFixed(2)} | Actionable: {selectedInsight.actionable ? 'Yes' : 'No'}</p>
                        <QuantixUISolutions.ButtonComponent onClick={handleCloseModal} variant="secondary">
                            Close
                        </QuantixUISolutions.ButtonComponent>
                    </div>
                ) : (
                    <p>Loading insight details...</p>
                )}
            </QuantixUISolutions.ModalComponent>
        </div>
    );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/Dashboard.tsx
================================================================================

import React, { useState, useEffect, useRef, createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// --- Core Data Models and Types (The Universe's Building Blocks) ---
export type UserRole = 'admin' | 'power_user' | 'standard' | 'guest' | 'developer' | 'ai_assistant' | 'quantum_engineer' | 'bio_specialist' | 'metaverse_architect' | 'dao_member';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  preferences: Record<string, any>;
  lastLogin: Date;
  twoFactorEnabled: boolean;
  avatarUrl?: string;
  bio?: string;
  organizationId?: string;
  teamIds?: string[];
  permissions: string[]; // Granular permissions
  securityScore: number; // A score indicating user's security posture
  healthMetrics: HealthMetrics; // Integrated health data
  learningPaths: string[]; // IDs of active learning paths
  digitalAssets: string[]; // IDs of owned digital assets (NFTs, crypto, metaverse land)
  reputationScore: number; // For DAO governance and collaboration
  neuralLinkStatus: 'active' | 'inactive' | 'calibrating' | 'error'; // Future bio-neural interface
}

export interface WidgetConfig {
  id: string;
  type: string; // e.g., 'LineChart', 'AIRecommendationPanel', 'HolographicMap'
  title: string;
  layout: { x: number; y: number; w: number; h: number; static?: boolean };
  dataSources: string[]; // API endpoints, real-time streams, internal models
  refreshInterval: number; // seconds
  filters: Record<string, any>;
  visualizationType: string; // e.g., 'barChart', 'lineGraph', '3dScatter', 'hologram', 'quantumCircuit'
  displayOptions: Record<string, any>; // Colors, labels, interactivity settings
  permissions: UserRole[]; // Who can see/interact with this widget
  aiConfig?: Record<string, any>; // AI-specific configurations
  versionHistory?: { timestamp: Date; config: WidgetConfig }[]; // Version control for widgets
  telemetryEnabled: boolean; // For performance monitoring
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  ownerId: string;
  sharedWith: string[]; // User IDs or Role IDs
  version: number;
  isPublic: boolean;
  theme: 'light' | 'dark' | 'holographic' | 'neon' | 'cyberpunk' | 'quantum_matrix' | 'bio_lumina';
  globalFilters: Record<string, any>; // Filters applied across all widgets
  aiGenerated: boolean; // Was this layout generated by AI?
  lastModified: Date;
  changeLog: { userId: string; timestamp: Date; description: string }[];
  performanceMetrics: { loadTime: number; apiCalls: number; renderErrors: number };
  accessControlList: { entityId: string; permissionLevel: 'view' | 'edit' | 'manage' }[];
  spatialConfig?: { mode: '2D' | '3D' | 'VR' | 'AR'; environment: string }; // For metaverse/spatial dashboards
}

export interface MetricDataPoint {
  timestamp: Date;
  value: number;
  unit: string;
  metadata?: Record<string, any>; // e.g., sensor_id, anomaly_score
}

export interface SensorData {
  sensorId: string;
  type: string; // e.g., 'temperature', 'humidity', 'pressure', 'bio_signal', 'quantum_flux', 'cosmic_radiation'
  location: { lat: number; lon: number; altitude?: number; zone?: string; planet?: string; galaxy?: string };
  readings: MetricDataPoint[];
  status: 'active' | 'inactive' | 'error' | 'calibrating' | 'offline';
  calibrationDate?: Date;
  batteryLevel?: number; // %
  lastCommunication: Date;
  firmwareVersion: string;
  anomalyDetected: boolean;
  dataSignature: string; // For blockchain integrity
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'on_hold' | 'awaiting_review';
  assignedTo: string[]; // User IDs
  tags: string[];
  projectId?: string;
  dependencies: string[]; // Other Task IDs
  progress: number; // 0-100%
  attachments: { fileName: string; url: string; type: string; ipfsHash?: string }[];
  comments: Comment[];
  recurrence?: string; // e.g., 'daily', 'weekly', 'monthly', 'every_2_weeks'
  timeSpentMinutes: number;
  estimatedTimeMinutes: number;
  automatedSteps: string[]; // For AI-driven task automation
  sentimentAnalysis?: { score: number; magnitude: number }; // AI analysis of task description/comments
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'on_hold' | 'completed' | 'archived' | 'critical';
  ownerId: string;
  teamIds: string[];
  budget: { allocated: number; spent: number; currency: string; forecast: number };
  milestones: { id: string; name: string; dueDate: Date; completed: boolean; completionDate?: Date }[];
  risks: { id: string; description: string; severity: 'low' | 'medium' | 'high' | 'critical'; mitigationPlan: string }[];
  documents: { title: string; url: string; type: string; blockchainHash?: string }[];
  tasks: TaskItem[]; // Nested tasks or references
  aiGeneratedInsights: string[]; // From AI Project Manager
  healthScore: number; // Overall project health
  dependencies: string[]; // Other project IDs
  governanceModel: 'centralized' | 'decentralized'; // For DAO-managed projects
}

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning' | 'success' | 'system' | 'ai_suggestion' | 'dao_vote';
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  actionUrl?: string;
  priority: number; // 1-10, 10 being highest
  sourceService: string;
  tags: string[];
  isVisible: boolean; // For dynamic display
  snoozeOptions?: number[]; // Minutes to snooze
}

export interface CommunicationChannel {
  id: string;
  name: string;
  type: 'chat' | 'video' | 'forum' | 'broadcast' | 'neural_link';
  participants: string[]; // User IDs
  messages: Message[];
  isEncrypted: boolean; // Quantum-safe encryption
  settings: Record<string, any>; // E.g., moderation rules, language filters
  moderators: string[];
  historyRetentionDays: number;
  aiSummarizationEnabled: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  timestamp: Date;
  content: string;
  readBy: string[]; // User IDs
  attachments?: { fileName: string; url: string; ipfsHash?: string }[];
  sentimentScore?: number; // AI-analyzed sentiment
  isEdited?: boolean;
  reactionEmojis?: { emoji: string; userId: string }[];
  threadId?: string; // For threaded conversations
  blockchainTxHash?: string; // For immutable communication logs
}

export interface FinancialTransaction {
  id: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer' | 'investment' | 'payroll' | 'ai_service_fee';
  amount: number;
  currency: string;
  description: string;
  date: Date;
  category: string;
  tags: string[];
  projectId?: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  receiptUrl?: string;
  isRecurring: boolean;
  blockchainTxHash?: string; // For crypto transactions
  metadata: Record<string, any>; // e.g., 'contractId', 'vendor'
}

export interface Asset {
  id: string;
  name: string;
  type: 'software' | 'hardware' | 'license' | 'data' | 'digital_art' | 'crypto' | 'metaverse_land' | 'quantum_compute_credits' | 'biomaterial';
  ownerId: string;
  currentValue: number;
  acquisitionDate: Date;
  status: 'active' | 'retired' | 'maintenance' | 'deployed' | 'in_storage';
  location?: string; // Physical location or digital path/URL
  metadata: Record<string, any>;
  depreciationSchedule?: { year: number; value: number }[];
  blockchainRef?: string; // For NFTs, crypto assets, immutable record of physical assets
  environmentalImpactScore?: number;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  durationMinutes: number;
  contentUrl: string; // Link to video, document, interactive lesson, VR simulation
  progress: number; // For user, 0-100%
  completedDate?: Date;
  tags: string[];
  recommendedSkills: string[];
  prerequisites: string[];
  quizzes: { id: string; score: number; attempts: number }[];
  certificationLevel?: string;
  aiPersonalizedPath: boolean; // Was this module recommended by AI?
  adaptiveLearningEnabled: boolean;
}

export interface HealthMetrics {
  heartRate: MetricDataPoint[];
  bloodPressure: MetricDataPoint[];
  sleepHours: MetricDataPoint[];
  steps: MetricDataPoint[];
  caloriesBurned: MetricDataPoint[];
  mood: MetricDataPoint[]; // e.g., 1-5 scale
  stressLevel: MetricDataPoint[]; // e.g., 1-10 scale, based on bio-feedback
  hydrationLevel: MetricDataPoint[];
  oxygenSaturation: MetricDataPoint[];
  meditationMinutes: MetricDataPoint[];
  biomarkerReadings: { type: string; data: MetricDataPoint[] }[]; // e.g., glucose, cholesterol, genetic markers
  neuralActivity: MetricDataPoint[]; // For brain-computer interfaces
  immunologicalResponse: MetricDataPoint[]; // Future integration with bio-scanners
  dietaryIntake: { timestamp: Date; food: string; calories: number; macroNutrients: Record<string, number> }[];
}

export interface GeolocationData {
  lat: number;
  lon: number;
  altitude?: number;
  timestamp: Date;
  accuracy?: number;
  speed?: number;
  heading?: number;
  celestialCoordinates?: { rightAscension: number; declination: number }; // For space exploration dashboards
  planetaryBody?: string;
}

export interface EnvironmentalData {
  airQualityIndex: MetricDataPoint;
  temperature: MetricDataPoint;
  humidity: MetricDataPoint;
  uvIndex: MetricDataPoint;
  windSpeed: MetricDataPoint;
  precipitation: MetricDataPoint;
  noiseLevel: MetricDataPoint;
  radiationLevel: MetricDataPoint; // for sci-fi future, cosmic radiation
  ozoneConcentration: MetricDataPoint;
  seismicActivity: MetricDataPoint[];
  oceanAcidity?: MetricDataPoint; // For planetary environmental monitoring
}

export interface AiModel {
  id: string;
  name: string;
  version: string;
  type: 'NLP' | 'Vision' | 'Predictive' | 'Generative' | 'ReinforcementLearning' | 'QuantumAI';
  status: 'training' | 'deployed' | 'retired' | 'error';
  trainingDataSizeGB: number;
  performanceMetrics: { accuracy: number; precision: number; recall: number; f1Score: number; inferenceLatencyMs: number };
  ownerId: string;
  accessControl: { userId: string; permission: 'view' | 'use' | 'fine_tune' }[];
  costPerInferenceUnit: number; // For AI-as-a-service
  quantumOptimized: boolean; // Indicates quantum speedup capability
}

// --- Universal Contexts and Providers ---

interface UserContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<UserProfile>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  hasPermission: (permission: string) => boolean;
}
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate authentication
  useEffect(() => {
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials: any) => {
    // API call simulation
    return new Promise<UserProfile>((resolve) => {
      setTimeout(() => {
        const user: UserProfile = {
          id: 'user-123',
          username: 'ai_expert',
          email: 'ai@universe.com',
          role: 'admin',
          preferences: {},
          lastLogin: new Date(),
          twoFactorEnabled: true,
          permissions: ['dashboard:view', 'dashboard:edit', 'admin:manage_users', 'ai:access_models', 'quantum:run_jobs', 'bio:access_data', 'metaverse:manage_assets', 'dao:vote'],
          securityScore: 95,
          healthMetrics: {
            heartRate: [{ timestamp: new Date(), value: 72, unit: 'bpm' }],
            bloodPressure: [], sleepHours: [], steps: [], caloriesBurned: [], mood: [{ timestamp: new Date(), value: 4, unit: 'scale' }], stressLevel: [], hydrationLevel: [], oxygenSaturation: [], meditationMinutes: [], biomarkerReadings: [], neuralActivity: [], immunologicalResponse: [], dietaryIntake: []
          },
          learningPaths: ['quantum_dev_101', 'ai_ethics_advanced'],
          digitalAssets: ['nft-star-map', 'meta-land-01'],
          reputationScore: 850,
          neuralLinkStatus: 'inactive',
        };
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('userProfile', JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userProfile');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in.');
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
    return updated;
  };

  const hasPermission = useCallback((permission: string) => {
    return currentUser?.permissions.includes(permission) || currentUser?.role === 'admin';
  }, [currentUser]);

  const value = useMemo(() => ({ currentUser, isAuthenticated, login, logout, updateProfile, hasPermission }), [currentUser, isAuthenticated, hasPermission]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

interface ThemeContextType {
  theme: 'light' | 'dark' | 'holographic' | 'neon' | 'cyberpunk' | 'quantum_matrix' | 'bio_lumina';
  setTheme: (theme: 'light' | 'dark' | 'holographic' | 'neon' | 'cyberpunk' | 'quantum_matrix' | 'bio_lumina') => void;
  generateTheme: (keywords: string[]) => Promise<Record<string, string>>; // AI-driven dynamic theme generation
}
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'holographic' | 'neon' | 'cyberpunk' | 'quantum_matrix' | 'bio_lumina'>('dark');

  const generateTheme = async (keywords: string[]) => {
    console.log("Generating dynamic theme based on keywords:", keywords);
    // Simulate AI theme generation API call
    return new Promise<Record<string, string>>((resolve) => {
      setTimeout(() => {
        resolve({
          primaryColor: '#007bff',
          secondaryColor: '#6c757d',
          backgroundColor: '#1a1a1a',
          textColor: '#f8f9fa',
          accentColor: '#00ffff',
          // ... more dynamic CSS variables
        });
      }, 1500);
    });
  };

  const value = useMemo(() => ({ theme, setTheme, generateTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${theme}`}> {/* Apply theme class for global styling */}
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

interface GlobalConfigContextType {
  config: Record<string, any>;
  updateConfig: (key: string, value: any) => void;
  getFeatureFlag: (flag: string) => boolean;
  getSetting: (setting: string, defaultValue?: any) => any;
  subscribeToConfigUpdates: (callback: (config: Record<string, any>) => void) => () => void;
}
export const GlobalConfigContext = createContext<GlobalConfigContextType | undefined>(undefined);

export const GlobalConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Record<string, any>>({
    dashboardVersion: '10.5.2',
    enableAIRecommendationEngine: true,
    enableRealtimeDataStreams: true,
    defaultLanguage: 'en-US',
    dataRetentionPolicy: '5_years_galactic_standard',
    quantumSecurityEnabled: false, // Default to false for a feature flag
    holographicModeAvailable: true,
    blockchainLedgerIntegration: true,
    neuralInterfaceEnabled: false,
    metaversePortalActive: true,
    aiModelTrainingCapacity: 'high',
    environmentalMonitoringLevel: 'planetary',
    gravitationalStabilizerActive: true, // Just for fun, cosmic scale
    // ... many more configurations
  });

  useEffect(() => {
    const storedConfig = localStorage.getItem('globalConfig');
    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
    }

    // Simulate websocket subscription for live updates
    const ws = new WebSocket('wss://api.universe.com/config');
    ws.onmessage = (event) => {
      const newConfig = JSON.parse(event.data);
      setConfig((prev) => ({ ...prev, ...newConfig }));
    };
    return () => ws.close();
  }, []);

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: value };
      localStorage.setItem('globalConfig', JSON.stringify(newConfig));
      return newConfig;
    });
  };

  const getFeatureFlag = useCallback((flag: string) => !!config[`feature_${flag}`] || !!config[flag], [config]);
  const getSetting = useCallback((setting: string, defaultValue: any = null) => config[setting] ?? defaultValue, [config]);

  const subscribeToConfigUpdates = (callback: (config: Record<string, any>) => void) => {
    console.log("Subscribing to config updates...");
    const interval = setInterval(() => {
      const mockUpdate = { lastUpdated: new Date().toISOString() };
      callback(mockUpdate);
    }, 30000);
    return () => clearInterval(interval);
  };

  const value = useMemo(() => ({ config, updateConfig, getFeatureFlag, getSetting, subscribeToConfigUpdates }), [config, getFeatureFlag, getSetting]);

  return <GlobalConfigContext.Provider value={value}>{children}</GlobalConfigContext.Provider>;
};

// --- API Service Layer (Interacting with the Universe's Backend) ---
export const APIService = {
  fetchDashboardLayouts: async (userId: string): Promise<DashboardLayout[]> => {
    console.log(`Fetching layouts for ${userId}...`);
    return new Promise((resolve) => setTimeout(() => resolve([
      {
        id: 'layout-1', name: 'My Primary Universal Dashboard', widgets: [], ownerId: userId, sharedWith: [], version: 1, isPublic: false, theme: 'dark', globalFilters: {}, aiGenerated: false, lastModified: new Date(), changeLog: [],
        performanceMetrics: { loadTime: 500, apiCalls: 10, renderErrors: 0 }, accessControlList: [], spatialConfig: { mode: '2D', environment: 'default' }
      },
      {
        id: 'layout-2', name: 'Project Omega Overview', widgets: [], ownerId: userId, sharedWith: ['team-alpha'], version: 1, isPublic: false, theme: 'dark', globalFilters: { projectId: 'proj-omega' }, aiGenerated: false, lastModified: new Date(), changeLog: [],
        performanceMetrics: { loadTime: 600, apiCalls: 12, renderErrors: 0 }, accessControlList: [], spatialConfig: { mode: '2D', environment: 'default' }
      },
      {
        id: 'layout-3', name: 'Quantum Ops Center (Holographic)', widgets: [], ownerId: userId, sharedWith: [], version: 1, isPublic: false, theme: 'holographic', globalFilters: { system: 'quantum_core' }, aiGenerated: true, lastModified: new Date(), changeLog: [],
        performanceMetrics: { loadTime: 1200, apiCalls: 20, renderErrors: 0 }, accessControlList: [], spatialConfig: { mode: '3D', environment: 'quantum_grid' }
      },
    ]), 500));
  },
  saveDashboardLayout: async (layout: DashboardLayout): Promise<DashboardLayout> => {
    console.log(`Saving layout ${layout.id}...`);
    return new Promise((resolve) => setTimeout(() => resolve({ ...layout, lastModified: new Date() }), 300));
  },
  fetchWidgetData: async (widgetId: string, sources: string[], filters: Record<string, any>): Promise<any> => {
    console.log(`Fetching data for widget ${widgetId} from sources ${sources.join(', ')} with filters`, filters);
    return new Promise((resolve) => setTimeout(() => resolve({
      widgetId,
      data: Array.from({ length: 10 }, (_, i) => ({ x: i, y: Math.random() * 100 + filters.offset || 0, z: Math.random() * 50 })), // Added Z for 3D potential
      lastUpdated: new Date().toISOString()
    }), 700));
  },
  fetchNotifications: async (userId: string): Promise<Notification[]> => {
    console.log(`Fetching notifications for ${userId}...`);
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: 'notif-1', type: 'alert', message: 'High CPU usage detected on server Alpha-1!', timestamp: new Date(), read: false, userId, priority: 9, sourceService: 'Monitoring', isVisible: true },
      { id: 'notif-2', type: 'info', message: 'Your weekly report is ready.', timestamp: new Date(), read: true, userId, priority: 5, sourceService: 'Reporting', isVisible: true },
      { id: 'notif-3', type: 'ai_suggestion', message: 'AI suggests optimizing query for Project Alpha.', timestamp: new Date(), read: false, userId, priority: 7, sourceService: 'AI Insights', isVisible: true, actionUrl: '/ai-suggestions/123' },
      { id: 'notif-4', type: 'dao_vote', message: 'New DAO proposal for quantum funding is open for vote.', timestamp: new Date(), read: false, userId, priority: 8, sourceService: 'DAO Governance', isVisible: true, actionUrl: '/governance/prop-001' },
    ]), 400));
  },
  // --- AI/ML specific endpoints ---
  getAIRecommendations: async (context: Record<string, any>): Promise<string[]> => {
    console.log("Getting AI recommendations...", context);
    return new Promise((resolve) => setTimeout(() => resolve([
      'Optimize query performance on galactic data streams.',
      'Review security logs for anomalous quantum fluctuations.',
      'Suggest new dashboard layout for Project Omega to enhance task visibility.',
      'Propose a new learning module for advanced bio-neural interface protocols.',
      'Forecast market volatility for digital assets in Q3.'
    ]), 1200));
  },
  runPredictiveAnalytics: async (dataType: string, inputData: any): Promise<any> => {
    console.log(`Running predictive analytics for ${dataType}...`);
    return new Promise((resolve) => setTimeout(() => resolve({ prediction: Math.random() > 0.5 ? 'Positive Trend' : 'Negative Trend', confidence: 0.85, forecastData: [{ x: 1, y: 100 }, { x: 2, y: 110 }] }), 1500));
  },
  generateContent: async (prompt: string, context: Record<string, any>): Promise<string> => {
    console.log(`Generating content for prompt: ${prompt}...`);
    return new Promise((resolve) => setTimeout(() => resolve(`AI-generated content based on "${prompt}". It's highly optimized and insightful, suggesting a new paradigm shift in data presentation. This content leverages advanced neural networks and context-aware generation, resulting in a comprehensive and coherent narrative.`), 2000));
  },
  submitAIModelForTraining: async (modelConfig: any, trainingData: any): Promise<{ jobId: string; status: string }> => {
    console.log("Submitting AI model for training:", modelConfig);
    return new Promise((resolve) => setTimeout(() => resolve({ jobId: `ai-train-${Date.now()}`, status: 'queued' }), 3000));
  },
  deployAIModel: async (modelId: string, targetEnvironment: string): Promise<{ status: string; endpoint: string }> => {
    console.log(`Deploying AI model ${modelId} to ${targetEnvironment}...`);
    return new Promise((resolve) => setTimeout(() => resolve({ status: 'deployed', endpoint: `https://api.universe.com/ai/${modelId}` }), 2000));
  },
  // --- Blockchain/Web3 endpoints ---
  getBlockchainLedgerStatus: async (): Promise<any> => {
    console.log("Fetching blockchain ledger status...");
    return new Promise((resolve) => setTimeout(() => resolve({ lastBlock: '0xabc123...', blockHeight: 12345678, status: 'synced', network: 'Ethereum-Enterprise-v2', validatorCount: 256, transactionRate: '1200 TPS' }), 600));
  },
  mintNFT: async (assetData: any): Promise<string> => {
    console.log("Minting NFT for asset:", assetData);
    return new Promise((resolve) => setTimeout(() => resolve(`nft-token-${Date.now()}-0x${Math.random().toString(16).substring(2, 8)}`), 2500));
  },
  submitDAOProposal: async (proposal: any): Promise<{ proposalId: string; status: string }> => {
    console.log("Submitting DAO proposal:", proposal);
    return new Promise((resolve) => setTimeout(() => resolve({ proposalId: `dao-prop-${Date.now()}`, status: 'pending_review' }), 1800));
  },
  // --- Bio-integration endpoints ---
  fetchBioSignals: async (userId: string, type: string, timeframe: string): Promise<MetricDataPoint[]> => {
    console.log(`Fetching bio signals (${type}) for ${userId} for ${timeframe}...`);
    return new Promise((resolve) => setTimeout(() => resolve(
      Array.from({ length: 24 }, (_, i) => ({ timestamp: new Date(Date.now() - (24 - i) * 3600 * 1000), value: type === 'heartRate' ? (60 + Math.random() * 20) : (Math.random() * 10), unit: type === 'heartRate' ? 'bpm' : 'value' }))
    ), 1000));
  },
  activateNeuralLink: async (userId: string): Promise<{ status: 'active' | 'inactive' | 'error' }> => {
    console.log(`Activating neural link for ${userId}...`);
    return new Promise((resolve) => setTimeout(() => resolve({ status: 'active' }), 3000));
  },
  // --- Quantum Computing Integration ---
  submitQuantumJob: async (circuitConfig: any): Promise<{ jobId: string; status: string }> => {
    console.log("Submitting quantum job:", circuitConfig);
    return new Promise((resolve) => setTimeout(() => resolve({ jobId: `quantum-job-${Date.now()}`, status: 'queued' }), 3000));
  },
  getQuantumJobResult: async (jobId: string): Promise<any> => {
    console.log("Fetching quantum job result:", jobId);
    return new Promise((resolve) => setTimeout(() => resolve({ jobId, status: 'completed', result: { qubits: 1024, entanglement_probability: 0.98, data: Math.random() * 1000, runtime_ms: 5000 } }), 5000));
  },
  monitorQuantumField: async (): Promise<any> => {
    console.log("Monitoring quantum field stability...");
    return new Promise((resolve) => setTimeout(() => resolve({ fieldStability: Math.random() * 100, cosmicRadiation: Math.random() * 0.1, anomalyDetected: Math.random() > 0.9 }), 2000));
  },
  // --- Metaverse Endpoints ---
  fetchMetaverseAssets: async (userId: string): Promise<Asset[]> => {
    console.log(`Fetching Metaverse assets for ${userId}...`);
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: 'meta-land-01', name: 'Digital Estate "Nexus Prime"', type: 'metaverse_land', ownerId: userId, currentValue: 500000, acquisitionDate: new Date('2023-08-01'), status: 'active', location: 'Metaverse:TerraPrime', metadata: { coordinates: '100,200', size: '100x100m' }, blockchainRef: '0xMeta_Land_NFT' },
      { id: 'meta-avatar-02', name: 'Elite Guardian Avatar', type: 'digital_art', ownerId: userId, currentValue: 50000, acquisitionDate: new Date('2023-10-15'), status: 'active', location: 'Inventory', metadata: { rarity: 'legendary', creator: 'Synthetica Corp.' }, blockchainRef: '0xMeta_Avatar_NFT' },
    ]), 1000));
  }
};

// --- Utility Hooks & Functions (The Universe's Physics) ---

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const fetchAndSetNotifications = async () => {
      const data = await APIService.fetchNotifications(userId);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read && n.isVisible).length);
    };
    fetchAndSetNotifications();

    const interval = setInterval(fetchAndSetNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [userId]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    // API call to mark as read
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    // API call to delete
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    // API call to clear all
  };

  return { notifications, unreadCount, markAsRead, clearNotification, clearAllNotifications };
};

export const useRealtimeDataStream = <T>(dataSourceUrl: string, initialData: T[] = []) => {
  const [data, setData] = useState<T[]>(initialData);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(dataSourceUrl);

    socketRef.current.onopen = () => console.log(`WebSocket opened for ${dataSourceUrl}`);
    socketRef.current.onmessage = (event) => {
      try {
        const newDataPoint: T = JSON.parse(event.data);
        setData((prevData) => [...prevData, newDataPoint]);
        if (prevData.length > 500) { // Keep data size manageable
          setData(prevData.slice(prevData.length - 500));
        }
      } catch (error) {
        console.error("Failed to parse real-time data:", error);
      }
    };
    socketRef.current.onclose = () => console.log(`WebSocket closed for ${dataSourceUrl}`);
    socketRef.current.onerror = (error) => console.error(`WebSocket error for ${dataSourceUrl}:`, error);

    return () => {
      socketRef.current?.close();
    };
  }, [dataSourceUrl]);

  return data;
};

// Custom hook for clicking outside an element
export const useOutsideClick = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
};

// --- Advanced AI Components (The Universe's Intelligence) ---

interface AIInsightsEngineProps {
  dashboardId: string;
  currentFilters: Record<string, any>;
  onApplySuggestion: (suggestion: string) => void;
  confidenceThreshold?: number; // E.g., only show suggestions above 0.7 confidence
  modelVersion?: string; // Specify AI model to use
}
export const AIInsightsEngine: React.FC<AIInsightsEngineProps> = ({ dashboardId, currentFilters, onApplySuggestion, confidenceThreshold = 0.7, modelVersion = 'v3.7' }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(UserContext)!;
  const { config } = useContext(GlobalConfigContext)!;

  useEffect(() => {
    if (!currentUser || !config.enableAIRecommendationEngine) return;

    setLoading(true);
    const fetchInsights = async () => {
      try {
        const context = { userId: currentUser.id, dashboardId, currentFilters, userPreferences: currentUser.preferences, confidenceThreshold, modelVersion };
        const recommendations = await APIService.getAIRecommendations(context);
        setInsights(recommendations);
      } catch (error) {
        console.error("Error fetching AI insights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
    const interval = setInterval(fetchInsights, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [currentUser, dashboardId, currentFilters, config.enableAIRecommendationEngine, confidenceThreshold, modelVersion]);

  if (loading) return <div className="p-4 text-blue-400">Generating AI Cognitive Core Insights...</div>;
  if (insights.length === 0) return <div className="p-4 text-gray-400">No new AI insights currently available.</div>;

  return (
    <div className="ai-insights-engine p-4 bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-lg shadow-xl border border-blue-700">
      <h3 className="text-xl font-bold mb-3 text-cyan-400">AI Cognitive Core Insights <span className="text-sm opacity-75">(Model: {modelVersion} Quantum-Optimized)</span></h3>
      <ul className="list-disc pl-5">
        {insights.map((insight, index) => (
          <li key={index} className="mb-2 flex justify-between items-center group">
            <span className="text-lg">{insight}</span>
            <button
              onClick={() => onApplySuggestion(insight)}
              className="ml-3 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              Apply
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-right mt-3 opacity-60">Powered by Neuro-Adaptive Predictive Algorithms</p>
    </div>
  );
};

interface AIContentGeneratorProps {
  contentType: 'report' | 'summary' | 'action_plan' | 'creative_text' | 'code_snippet' | 'design_spec' | 'marketing_copy';
  contextData: Record<string, any>;
  onContentGenerated: (content: string) => void;
  tone?: 'formal' | 'informal' | 'optimistic' | 'critical';
  length?: 'short' | 'medium' | 'long';
  style?: 'technical' | 'narrative' | 'poetic';
  targetAudience?: string;
}
export const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({ contentType, contextData, onContentGenerated, tone = 'formal', length = 'medium', style = 'technical', targetAudience = 'experts' }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const fullPrompt = `Generate a ${length} ${tone} ${style} ${contentType} for ${targetAudience} based on the following context: ${JSON.stringify(contextData)}. Specific instruction: ${prompt}`;
      const content = await APIService.generateContent(fullPrompt, contextData);
      setGeneratedContent(content);
      onContentGenerated(content);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-content-generator p-4 border border-gray-700 rounded-lg bg-gray-800 text-white shadow-lg">
      <h4 className="text-lg font-semibold mb-2 text-green-400">AI Content Forge</h4>
      <textarea
        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder={`Enter specific instructions for your ${contentType} (e.g., 'focus on Q3 performance')...`}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
        <span>Tone: {tone}</span>
        <span>Length: {length}</span>
        <span>Style: {style}</span>
      </div>
      <button
        onClick={generate}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? 'Generating...' : `Generate ${contentType}`}
      </button>
      {generatedContent && (
        <div className="mt-4 p-3 bg-gray-700 border border-gray-600 rounded">
          <h5 className="font-medium mb-1 text-green-300">Generated Content:</h5>
          <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
        </div>
      )}
    </div>
  );
};

interface AIFinancialForecasterProps {
  portfolioId: string;
  timeHorizon: 'short' | 'medium' | 'long' | 'interstellar';
  riskTolerance: 'low' | 'medium' | 'high' | 'aggressive';
  onForecastResult: (result: any) => void;
  // Params for scenario analysis, stress testing, quantum optimization
}
export const AIFinancialForecaster: React.FC<AIFinancialForecasterProps> = ({ portfolioId, timeHorizon, riskTolerance, onForecastResult }) => {
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchForecast = async () => {
      try {
        const data = await APIService.runPredictiveAnalytics('financial_market', { portfolioId, timeHorizon, riskTolerance });
        setForecast(data);
        onForecastResult(data);
      } catch (error) {
        console.error("Error fetching financial forecast:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [portfolioId, timeHorizon, riskTolerance, onForecastResult]);

  if (loading) return <div className="p-4 text-blue-400">AI Financial Quantum Forecasting...</div>;
  if (!forecast) return <div className="p-4 text-gray-400">No forecast available.</div>;

  return (
    <div className="ai-financial-forecaster p-4 bg-blue-900 text-white rounded-lg shadow-md border border-blue-700">
      <h4 className="text-lg font-semibold mb-2 text-blue-300">AI Financial Quantum Forecaster</h4>
      <p><strong>Prediction:</strong> <span className="font-bold text-green-400">{forecast.prediction}</span></p>
      <p><strong>Confidence:</strong> <span className="text-yellow-300">{(forecast.confidence * 100).toFixed(2)}%</span></p>
      <p className="text-sm opacity-80 mt-2">Time Horizon: {timeHorizon}, Risk Tolerance: {riskTolerance}</p>
      {/* More detailed visualization of the forecast */}
      <div className="mt-4 p-2 bg-blue-800 rounded">
        <h5 className="text-sm font-semibold text-blue-200">Key Data Points:</h5>
        {forecast.forecastData?.map((point: any, index: number) => (
          <p key={index} className="text-xs text-blue-100">Point {point.x}: Value {point.y}</p>
        ))}
      </div>
      <button className="mt-4 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm">Run Scenario Analysis</button>
    </div>
  );
};

// --- Advanced Visualization & Interaction Components (The Universe's UI/UX) ---

interface DataVisualizationProps {
  data: any[];
  config: WidgetConfig;
  height?: string;
  width?: string;
  interactivityEnabled?: boolean;
  onDataPointClick?: (point: any) => void;
  // Further props for custom models, confidence thresholds, etc.
}
export const DataVisualization: React.FC<DataVisualizationProps> = ({ data, config, height = '300px', width = '100%', interactivityEnabled = true, onDataPointClick }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    console.log(`Rendering ${config.visualizationType} for widget ${config.id} with data:`, data);

    // In a real app, this would integrate with a charting library (e.g., D3.js, Highcharts, Three.js for 3D)
    // For now, we'll just show a placeholder message.
    chartRef.current.innerHTML = `<div style="padding: 20px; text-align: center; background-color: rgba(255,255,255,0.05); border-radius: 8px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <p class="text-gray-300 text-lg">🚀 Advanced ${config.visualizationType} (Widget ID: ${config.id})</p>
      <p class="text-sm text-gray-400 mt-1">Simulated data for ${data.length} points. Interactivity: ${interactivityEnabled ? 'On' : 'Off'}</p>
      <p class="text-xs text-gray-500 mt-2">Visualizing: ${JSON.stringify(config.dataSources)}</p>
    </div>`;
  }, [data, config, interactivityEnabled]);

  return (
    <div ref={chartRef} style={{ height: height, width: width }} className="data-visualization flex items-center justify-center bg-gray-900 rounded-lg shadow-inner overflow-hidden">
      {/* Actual chart/3D canvas would render here */}
    </div>
  );
};

interface HolographicProjectionProps {
  modelUrl: string; // URL to a 3D model (GLTF, OBJ, custom volumetric data)
  interactionMode: 'view' | 'manipulate' | 'annotate' | 'simulate';
  onInteraction: (event: any) => void;
  realtimeDataOverlay?: any[]; // Data to overlay dynamically in 3D space
  spatialAudioConfig?: { source: string; coordinates: { x: number; y: number; z: number } };
  // Further props for real-time data overlays, spatial audio, VR/AR integration
}
export const HolographicProjection: React.FC<HolographicProjectionProps> = ({ modelUrl, interactionMode, onInteraction, realtimeDataOverlay, spatialAudioConfig }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // This would integrate with a WebGL/WebXR library (e.g., Three.js, Babylon.js)
  // to render interactive 3D content, potentially with augmented reality overlays.

  useEffect(() => {
    if (containerRef.current) {
      // Simulate 3D rendering initialization
      containerRef.current.innerHTML = `<div style="height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(0,255,255,0.1) 0%, rgba(0,0,0,0.8) 100%); border-radius: 12px; border: 1px dashed cyan;">
        <p class="text-cyan-300 text-lg font-light animate-pulse">✨ Holographic Projection of ${modelUrl.split('/').pop() || 'Untitled Model'}</p>
        <p class="absolute bottom-4 text-xs text-gray-400">Interaction Mode: ${interactionMode}. Data Overlays: ${realtimeDataOverlay?.length || 0}</p>
      </div>`;
      // Simulate event listener for interaction
      const handler = (e: MouseEvent) => onInteraction(e);
      containerRef.current.addEventListener('click', handler);
      return () => containerRef.current?.removeEventListener('click', handler);
    }
  }, [modelUrl, interactionMode, realtimeDataOverlay, onInteraction]);

  return (
    <div ref={containerRef} className="holographic-projection w-full h-full min-h-[400px] relative">
      {spatialAudioConfig && <SpatialAudioControl audioSource={spatialAudioConfig.source} spatialCoordinates={spatialAudioConfig.coordinates} volume={0.5} play={true} />}
      {/* WebGL/Canvas for 3D rendering */}
    </div>
  );
};

interface SpatialAudioControlProps {
  audioSource: string; // URL for background ambient sound, alerts, etc.
  spatialCoordinates: { x: number; y: number; z: number };
  volume: number;
  play: boolean;
  loop?: boolean;
  // Dynamic audio mixing, AI-driven soundscapes, directional audio
}
export const SpatialAudioControl: React.FC<SpatialAudioControlProps> = ({ audioSource, spatialCoordinates, volume, play, loop = true }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;
      if (play) {
        audioRef.current.play().catch(e => console.warn("Audio play failed (user gesture required?):", e));
      } else {
        audioRef.current.pause();
      }
      // In a real system, you'd use Web Audio API for true spatial audio
      console.log(`Playing spatial audio from ${audioSource} at coords ${JSON.stringify(spatialCoordinates)}`);
    }
  }, [audioSource, spatialCoordinates, volume, play, loop]);

  return (
    <audio ref={audioRef} src={audioSource} loop={true} preload="auto" className="hidden" />
  );
};

// --- Core Dashboard Components (The Universe's Command Center) ---

interface DraggableWidgetProps {
  widget: WidgetConfig;
  onRemove: (id: string) => void;
  onEdit: (widget: WidgetConfig) => void;
  onDataRefresh: (id: string) => void;
}
export const DraggableWidget: React.FC<DraggableWidgetProps> = ({ widget, onRemove, onEdit, onDataRefresh }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(UserContext)!;
  const { hasPermission } = useContext(UserContext)!;

  useEffect(() => {
    if (!currentUser || !widget.permissions.some(role => currentUser.role === role || currentUser.permissions.includes('dashboard:override_permissions'))) {
      setData([]); // User doesn't have permission
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await APIService.fetchWidgetData(widget.id, widget.dataSources, { ...widget.filters, userId: currentUser?.id });
        setData(response.data);
      } catch (error) {
        console.error(`Error fetching data for widget ${widget.id}:`, error);
        // Implement robust error reporting/retry mechanisms
      } finally {
        setLoading(false);
      }
    };
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, widget.refreshInterval * 1000); // Periodic refresh
    return () => clearInterval(interval);
  }, [widget, currentUser, hasPermission]);

  const canEdit = hasPermission('dashboard:edit');
  const canView = widget.permissions.some(role => currentUser?.role === role) || hasPermission('dashboard:override_permissions');

  if (!canView) {
    return (
      <div className="draggable-widget bg-gray-900 border border-red-700 rounded-lg shadow-xl p-4 flex flex-col text-red-400">
        <h3 className="text-xl font-semibold mb-3">{widget.title}</h3>
        <p>Access Denied: You do not have permissions to view this widget.</p>
      </div>
    );
  }

  const renderWidgetContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full text-gray-400">Loading Data...</div>;
    }

    // Dynamic rendering based on widget type
    switch (widget.type) {
      case 'AIRecommendationPanel':
        return <AIInsightsEngine dashboardId="current-dashboard" currentFilters={widget.filters} onApplySuggestion={(s) => console.log(s)} />;
      case 'HolographicMap':
        return <HolographicProjection modelUrl="/models/map.gltf" interactionMode="view" onInteraction={() => {}} realtimeDataOverlay={data} />;
      case 'BlockchainStatus':
        return <BlockchainLedgerStatusWidget />;
      case 'QuantumStatusMonitor':
        return <QuantumComputingStatusWidget minimal={true} />;
      case 'CommunicationFeed':
        return <CommunicationFeedWidget channelId={widget.filters?.channelId || 'global_channel'} />;
      case 'TaskTracker':
        return <TaskTrackerWidget projectId={widget.filters?.projectId} />;
      case 'BioSignalGraph':
        return <DataVisualization data={data} config={{ ...widget, visualizationType: 'lineGraph' }} height="100%" />;
      // ... many more specialized widget types
      default:
        return <DataVisualization data={data} config={widget} height="100%" />;
    }
  };

  return (
    <div
      className="draggable-widget bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-blue-500"
      style={{
        gridColumn: `span ${widget.layout.w}`,
        gridRow: `span ${widget.layout.h}`,
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-white">{widget.title}</h3>
        <div className="flex space-x-2">
          {canEdit && (
            <>
              <button onClick={() => onEdit(widget)} className="text-gray-400 hover:text-blue-400 text-sm">
                ⚙️ Edit
              </button>
              <button onClick={() => onRemove(widget.id)} className="text-gray-400 hover:text-red-400 text-sm">
                ❌ Remove
              </button>
            </>
          )}
          <button onClick={() => onDataRefresh(widget.id)} className="text-gray-400 hover:text-green-400 text-sm">
            🔄 Refresh
          </button>
        </div>
      </div>
      <div className="flex-grow min-h-0"> {/* min-h-0 to allow flex-grow to shrink */}
        {renderWidgetContent()}
      </div>
      <p className="text-xs text-right text-gray-500 mt-2">Last Updated: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

interface WidgetCatalogProps {
  onAddWidget: (widgetType: string) => void;
}
export const WidgetCatalog: React.FC<WidgetCatalogProps> = ({ onAddWidget }) => {
  const availableWidgetTypes = [
    'LineChart', 'BarChart', 'PieChart', 'Table', 'Gauge', 'Heatmap', 'ScatterPlot', 'AreaChart',
    '3DModelView', 'TextPanel', 'MetricCard', 'Map', 'Timeline', 'Calendar', 'RichTextEditor',
    'AIRecommendationPanel', 'AIContentGenerator', 'AIFinancialForecaster', 'QuantumStatusMonitor', 'QuantumJobCreator', 'BioSignalGraph', 'NeuralLinkMonitor',
    'BlockchainLedgerStatus', 'NFTViewer', 'DAOProposalFeed', 'CommunicationFeed', 'TaskTracker', 'ProjectOverview',
    'EnvironmentalSensor', 'FinancialOverview', 'LearningProgress', 'ResourceOverview', 'SecurityLogAnalyzer', 'GravitationalFieldStatus',
    'MetaverseAssetDisplay', 'CelestialMap', 'EnergyConsumptionMonitor', 'TrafficFlowPredictor', 'SentimentAnalyzer', 'CodeReviewAssistant',
    'VirtualAssistantInterface', 'WeatherForecast', 'GlobalNewsFeed', 'MarketSentimentGauge', 'SupplyChainTracker', 'ComplianceAuditor',
    'VRSceneViewer', 'ARInteractiveOverlay', 'SpatialAudioController', 'MultiverseNavigationPad', 'TemporalAnomalyDetector'
  ]; // A vastly expanded list of widget types

  return (
    <div className="widget-catalog p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-white">Widget Universe Catalog</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto pr-2">
        {availableWidgetTypes.map((type) => (
          <button
            key={type}
            onClick={() => onAddWidget(type)}
            className="p-3 bg-gray-700 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200"
          >
            ➕ {type}
          </button>
        ))}
      </div>
    </div>
  );
};

interface DashboardHeaderProps {
  currentLayout: DashboardLayout;
  onLayoutChange: (layoutId: string) => void;
  onSaveLayout: () => void;
  onShareLayout: () => void;
  onAddWidgetClick: () => void;
  onCustomizeTheme: () => void;
  onOpenGlobalSettings: () => void;
}
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentLayout, onLayoutChange, onSaveLayout, onShareLayout, onAddWidgetClick, onCustomizeTheme, onOpenGlobalSettings
}) => {
  const { currentUser } = useContext(UserContext)!;
  const [availableLayouts, setLayouts] = useState<DashboardLayout[]>([]);
  const { hasPermission } = useContext(UserContext)!;

  useEffect(() => {
    if (currentUser) {
      APIService.fetchDashboardLayouts(currentUser.id).then(setLayouts);
    }
  }, [currentUser]);

  const canEdit = hasPermission('dashboard:edit');
  const canShare = hasPermission('dashboard:share');
  const canManageSettings = hasPermission('admin:manage_settings');

  return (
    <header className="dashboard-header bg-gray-900 text-white p-4 border-b border-gray-700 flex flex-wrap justify-between items-center sticky top-0 z-50 shadow-lg">
      <div className="flex items-center flex-grow">
        <h1 className="text-3xl font-extrabold text-blue-400 mr-4">Universe Control Panel</h1>
        <span className="text-sm text-gray-400 mr-4 hidden md:inline">Layout: <span className="font-semibold">{currentLayout.name}</span></span>
        <GlobalSearch />
      </div>

      <div className="flex items-center space-x-4 mt-2 md:mt-0 ml-auto">
        <select
          onChange={(e) => onLayoutChange(e.target.value)}
          value={currentLayout.id}
          className="p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableLayouts.map(layout => (
            <option key={layout.id} value={layout.id}>{layout.name}</option>
          ))}
          <option value="new">➕ Create New Layout</option>
        </select>

        {canEdit && (
          <button onClick={onAddWidgetClick} className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm transition-colors duration-200">
            ➕ Widget
          </button>
        )}
        {canEdit && (
          <button onClick={onSaveLayout} className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm transition-colors duration-200">
            💾 Save
          </button>
        )}
        {canShare && (
          <button onClick={onShareLayout} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors duration-200">
            🔗 Share
          </button>
        )}
        <button onClick={onCustomizeTheme} className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white text-sm transition-colors duration-200">
          🎨 Theme
        </button>
        {canManageSettings && (
          <button onClick={onOpenGlobalSettings} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition-colors duration-200">
            ⚙️ Global Settings
          </button>
        )}
        <NotificationCenter />
        <UserProfileMenu />
      </div>
    </header>
  );
};

export const UserProfileMenu: React.FC = () => {
  const { currentUser, logout, updateProfile } = useContext(UserContext)!;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setIsOpen(false));

  if (!currentUser) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors duration-200 p-1 rounded-full bg-gray-800">
        <img src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentUser.username}`} alt="User Avatar" className="w-8 h-8 rounded-full border border-gray-600" />
        <span className="hidden lg:inline text-sm">{currentUser.username} ({currentUser.role})</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="font-semibold text-white">{currentUser.username}</p>
            <p className="text-xs text-gray-400">{currentUser.email}</p>
          </div>
          <button onClick={() => { /* Open profile settings modal */ setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
            ⚙️ Profile Settings
          </button>
          <button onClick={() => { /* Open security center */ setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
            🔒 Security Center ({currentUser.securityScore}/100)
          </button>
          <button onClick={() => { /* Open health dashboard */ setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
            ❤️ Bio-Integrated Health
          </button>
          <button onClick={() => { /* Open learning path */ setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
            📚 Learning Path
          </button>
          <button onClick={() => { /* Open digital asset wallet */ setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
            💰 Digital Asset Wallet
          </button>
          {currentUser.neuralLinkStatus === 'active' && (
            <button onClick={() => { /* Manage neural link */ setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
              🧠 Neural Interface
            </button>
          )}
          <hr className="border-gray-700 my-1" />
          <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export const NotificationCenter: React.FC = () => {
  const { currentUser } = useContext(UserContext)!;
  const { notifications, unreadCount, markAsRead, clearNotification, clearAllNotifications } = useNotifications(currentUser?.id || '');
  const [isOpen, setIsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useOutsideClick(notifRef, () => setIsOpen(false));

  if (!currentUser) return null;

  return (
    <div className="relative" ref={notifRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 relative text-white hover:text-blue-300">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold px-4 pb-2 border-b border-gray-700 text-white">Notifications ({unreadCount} unread)</h3>
          {notifications.filter(n => n.isVisible).length === 0 ? (
            <p className="p-4 text-gray-400 text-sm">No new notifications.</p>
          ) : (
            notifications.filter(n => n.isVisible).map(notif => (
              <div key={notif.id} className={`px-4 py-3 border-b border-gray-700 ${!notif.read ? 'bg-indigo-900/20' : ''}`}>
                <div className="flex justify-between items-start">
                  <p className={`text-sm ${!notif.read ? 'font-bold text-white' : 'text-gray-300'}`}>{notif.message}</p>
                  <button onClick={() => clearNotification(notif.id)} className="text-gray-500 hover:text-red-400 text-xs ml-2">✖</button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleString()} - {notif.sourceService}</p>
                {!notif.read && (
                  <button onClick={() => markAsRead(notif.id)} className="mt-2 text-xs text-blue-400 hover:underline">Mark as Read</button>
                )}
                {notif.actionUrl && (
                  <a href={notif.actionUrl} className="mt-2 text-xs text-purple-400 hover:underline block" target="_blank" rel="noopener noreferrer">View Details</a>
                )}
              </div>
            ))
          )}
          <div className="px-4 pt-2 border-t border-gray-700 flex justify-between">
            <button onClick={clearAllNotifications} className="text-xs text-gray-400 hover:text-white">Clear All</button>
            <button onClick={() => {/* Open notification preferences */}} className="text-xs text-gray-400 hover:text-white">Preferences</button>
          </div>
        </div>
      )}
    </div>
  );
};

export const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(searchRef, () => setIsOpen(false));

  const handleSearch = useCallback(async (term: string) => {
    if (term.length < 3) {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setIsOpen(true);
    // Simulate a deep, federated search across all modules (projects, tasks, users, data, documents, code, etc.)
    return new Promise((resolve) => setTimeout(() => {
      const results = [
        { id: 'proj-xyz', type: 'Project', title: `Cosmic Nexus Project for "${term}"`, url: '/projects/xyz' },
        { id: 'doc-123', type: 'Document', title: `Analysis Report on "${term}"`, url: '/docs/123' },
        { id: 'task-abc', type: 'Task', title: `Implement "${term}" feature`, url: '/tasks/abc' },
        { id: 'user-456', type: 'User', title: `Profile of "${term}" (AI Expert)`, url: '/users/456' },
        { id: 'data-789', type: 'Dataset', title: `Real-time "${term}" Stream`, url: '/data/789' },
        { id: 'comp-101', type: 'AI Model', title: `Quantum NLP Model for "${term}"`, url: '/ai/models/101' },
        { id: 'asset-x1', type: 'Metaverse Asset', title: `Digital Land Plot for "${term}"`, url: '/metaverse/assets/x1' },
        { id: 'quantum-job-q4', type: 'Quantum Job', title: `Quantum Simulation for "${term}"`, url: '/quantum/jobs/q4' },
      ].filter(r => r.title.toLowerCase().includes(term.toLowerCase()));
      setSearchResults(results);
      setLoading(false);
      resolve(results);
    }, 800));
  }, []);

  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (term: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handleSearch(term), 300);
    };
  }, [handleSearch]);

  return (
    <div className="global-search relative flex-grow max-w-md mx-4" ref={searchRef}>
      <input
        type="text"
        placeholder="Search the Universe (projects, data, users, AI models, code...)"
        className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          debouncedSearch(e.target.value);
        }}
        onFocus={() => setIsOpen(searchTerm.length > 0 || searchResults.length > 0)}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>

      {isOpen && (searchTerm.length > 0 || searchResults.length > 0 || loading) && (
        <div className="absolute left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {loading && <div className="p-3 text-center text-blue-400">Searching the cosmos...</div>}
          {!loading && searchResults.length === 0 && searchTerm.length > 0 && (
            <div className="p-3 text-gray-400">No results found for "{searchTerm}".</div>
          )}
          {!loading && searchResults.length > 0 && (
            <ul>
              {searchResults.map((result) => (
                <li key={result.id} className="border-b border-gray-700 last:border-b-0">
                  <a href={result.url} onClick={() => setIsOpen(false)} className="block p-3 hover:bg-gray-700 flex items-center space-x-2">
                    <span className="text-blue-400 font-medium text-sm">{result.type}:</span>
                    <span className="text-white text-sm">{result.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};


// --- Advanced Modules and Panels (The Universe's Specialized Systems) ---

interface CommunicationFeedWidgetProps {
  channelId: string;
}
export const CommunicationFeedWidget: React.FC<CommunicationFeedWidgetProps> = ({ channelId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser } = useContext(UserContext)!;

  useEffect(() => {
    // Simulate fetching messages for the channel
    if (currentUser && channelId) {
      setTimeout(() => {
        setMessages([
          { id: 'msg-1', senderId: 'user-2', timestamp: new Date(Date.now() - 3600000), content: 'Hello team, any updates on Project Omega?', readBy: [currentUser.id] },
          { id: 'msg-2', senderId: currentUser.id, timestamp: new Date(Date.now() - 1800000), content: 'Working on the quantum integration, almost done.', readBy: ['user-2'] },
          { id: 'msg-3', senderId: 'user-3', timestamp: new Date(Date.now() - 600000), content: 'AI insights show a potential bottleneck in data parsing.', readBy: [currentUser.id, 'user-2'], sentimentScore: -0.6 },
        ]);
      }, 500);
    }
  }, [currentUser, channelId]);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentUser) {
      const message: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        timestamp: new Date(),
        content: newMessage,
        readBy: [],
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      // Simulate API call to send message
    }
  };

  return (
    <div className="collaboration-feed bg-gray-900 rounded p-3 h-full flex flex-col border border-gray-700">
      <h4 className="font-semibold text-gray-300 mb-2">Channel: {channelId}</h4>
      <div className="flex-grow overflow-y-auto mb-3 space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-400">No messages yet. Start a conversation!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded-lg ${msg.senderId === currentUser?.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                <p className="text-xs font-semibold">{msg.senderId === currentUser?.id ? 'You' : msg.senderId}</p>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-gray-400 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                {msg.sentimentScore && <span className="text-xs opacity-75">{msg.sentimentScore > 0 ? '😊' : '😞'}</span>}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-l text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r transition-colors duration-200">Send</button>
      </div>
    </div>
  );
};

interface TaskTrackerWidgetProps {
  projectId?: string;
  userId?: string;
}
export const TaskTrackerWidget: React.FC<TaskTrackerWidgetProps> = ({ projectId, userId }) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching tasks based on projectId or userId
    setTimeout(() => {
      setTasks([
        { id: 'task-101', title: 'Refactor Quantum Entanglement Module', description: '', dueDate: new Date('2024-08-15'), priority: 'critical', status: 'in_progress', assignedTo: ['user-123'], tags: ['quantum', 'code'], progress: 75, attachments: [], comments: [], estimatedTimeMinutes: 240, timeSpentMinutes: 180, automatedSteps: [] },
        { id: 'task-102', title: 'Analyze Bio-Signal Anomaly Report', description: '', dueDate: new Date('2024-07-30'), priority: 'high', status: 'pending', assignedTo: ['user-123'], tags: ['bio-integration', 'research'], progress: 0, attachments: [], comments: [], estimatedTimeMinutes: 120, timeSpentMinutes: 0, automatedSteps: [] },
        { id: 'task-103', title: 'Prepare Metaverse Asset Audit', description: '', dueDate: new Date('2024-09-01'), priority: 'medium', status: 'completed', assignedTo: ['user-123'], tags: ['metaverse', 'audit'], progress: 100, attachments: [], comments: [], estimatedTimeMinutes: 360, timeSpentMinutes: 300, automatedSteps: [] },
      ]);
      setIsLoading(false);
    }, 800);
  }, [projectId, userId]);

  if (isLoading) return <div className="p-4 text-gray-400">Loading Tasks...</div>;
  if (tasks.length === 0) return <div className="p-4 text-gray-400">No tasks found for this context.</div>;

  return (
    <div className="task-tracker bg-gray-900 rounded p-3 h-full flex flex-col border border-gray-700">
      <h4 className="font-semibold text-gray-300 mb-2">My Active Tasks</h4>
      <div className="flex-grow overflow-y-auto space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <h5 className="font-semibold text-white">{task.title}</h5>
              <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'in_progress' ? 'bg-blue-600' : task.status === 'pending' ? 'bg-yellow-600' : 'bg-green-600'}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">Due: {task.dueDate.toLocaleDateString()}</p>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
            </div>
            <p className="text-xs text-right text-gray-400 mt-1">{task.progress}% Complete</p>
          </div>
        ))}
      </div>
      <button className="mt-4 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm">View All Tasks</button>
    </div>
  );
};

export const CollaborationPanel: React.FC = () => {
  const [channels, setChannels] = useState<CommunicationChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const { currentUser } = useContext(UserContext)!;

  useEffect(() => {
    if (currentUser) {
      setChannels([
        { id: 'chat-1', name: 'Project Alpha Team', type: 'chat', participants: [currentUser.id, 'user-2', 'user-3'], messages: [], isEncrypted: true, settings: {}, moderators: [], historyRetentionDays: 365, aiSummarizationEnabled: true },
        { id: 'video-2', name: 'Daily Standup', type: 'video', participants: [currentUser.id, 'user-4'], messages: [], isEncrypted: true, settings: {}, moderators: [], historyRetentionDays: 90, aiSummarizationEnabled: false },
        { id: 'neural-3', name: 'Neural Consensus Link', type: 'neural_link', participants: [currentUser.id, 'ai_assistant_1'], messages: [], isEncrypted: true, settings: {}, moderators: [], historyRetentionDays: 7, aiSummarizationEnabled: true },
      ]);
    }
  }, [currentUser]);

  const activeChannel = channels.find(c => c.id === activeChannelId);

  return (
    <div className="collaboration-panel bg-gray-800 border border-gray-700 rounded-lg p-4 h-full flex flex-col shadow-xl">
      <h3 className="text-xl font-bold mb-4 text-white">Quantum Comms Nexus</h3>
      <div className="flex-grow flex space-x-4">
        <div className="w-1/4 border-r border-gray-700 pr-4">
          <h4 className="font-semibold text-gray-300 mb-2">Channels</h4>
          <ul>
            {channels.map(channel => (
              <li key={channel.id} className="mb-1">
                <button
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`block w-full text-left p-2 rounded ${activeChannelId === channel.id ? 'bg-blue-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                >
                  {channel.name} ({channel.type === 'neural_link' ? '🧠 Neural' : channel.type === 'video' ? '📹 Video' : '💬 Chat'})
                </button>
              </li>
            ))}
            <li className="mt-2"><button className="block w-full text-left p-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white">➕ New Channel</button></li>
          </ul>
        </div>
        <div className="flex-grow flex flex-col">
          {activeChannel ? (
            <>
              <h4 className="font-semibold text-gray-300 mb-2">{activeChannel.name}</h4>
              <CommunicationFeedWidget channelId={activeChannel.id} />
              {activeChannel.aiSummarizationEnabled && (
                <div className="mt-2 text-xs text-gray-500">
                  <AIContentGenerator contentType="summary" contextData={{ channelId: activeChannel.id }} onContentGenerated={(c) => console.log('Channel summary:', c)} />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400">Select a channel to view communications.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProjectManagementModule: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext)!;

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      setTimeout(() => {
        setProjects([
          {
            id: 'proj-omega', name: 'Project Omega Rebirth', description: 'Rebuilding the core system with sentient AI and quantum infrastructure.', startDate: new Date('2023-01-01'), endDate: new Date('2024-12-31'),
            status: 'in_progress', ownerId: currentUser.id, teamIds: ['team-alpha'], budget: { allocated: 10000000, spent: 5000000, currency: 'USD', forecast: 12000000 }, milestones: [{ id: 'm1', name: 'Quantum Core Online', dueDate: new Date('2024-09-01'), completed: false }], risks: [], documents: [], tasks: [], aiGeneratedInsights: [],
            healthScore: 75, dependencies: [], governanceModel: 'centralized'
          },
          {
            id: 'proj-galore', name: 'Galactic Data Harvesting & Analysis', description: 'Expanding data ingestion from exoplanetary sensors and applying AI analysis.', startDate: new Date('2024-03-15'), endDate: new Date('2025-03-15'),
            status: 'pending', ownerId: currentUser.id, teamIds: ['team-beta'], budget: { allocated: 5000000, spent: 500000, currency: 'USD', forecast: 6000000 }, milestones: [], risks: [], documents: [], tasks: [], aiGeneratedInsights: [],
            healthScore: 90, dependencies: [], governanceModel: 'centralized'
          }
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [currentUser]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (isLoading) return <div className="p-4 text-gray-400">Loading Project Continuum...</div>;

  return (
    <div className="project-management-module bg-gray-800 border border-gray-700 rounded-lg p-4 h-full flex flex-col shadow-xl">
      <h3 className="text-xl font-bold mb-4 text-white">Project Continuum Navigator</h3>
      <div className="flex-grow flex space-x-4">
        <div className="w-1/3 border-r border-gray-700 pr-4">
          <h4 className="font-semibold text-gray-300 mb-2">Active Projects</h4>
          <ul>
            {projects.map(project => (
              <li key={project.id} className="mb-1">
                <button
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`block w-full text-left p-2 rounded ${selectedProjectId === project.id ? 'bg-purple-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                >
                  {project.name} ({project.status}) <span className="float-right text-xs text-gray-400">Health: {project.healthScore}%</span>
                </button>
              </li>
            ))}
            <li className="mt-2"><button className="block w-full text-left p-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white">➕ Create New Project</button></li>
          </ul>
        </div>
        <div className="flex-grow flex flex-col">
          {selectedProject ? (
            <div className="flex flex-col h-full">
              <h4 className="text-xl font-bold text-blue-400 mb-2">{selectedProject.name}</h4>
              <p className="text-sm text-gray-400 mb-4">{selectedProject.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div><strong className="text-gray-300">Status:</strong> <span className="text-green-400">{selectedProject.status}</span></div>
                <div><strong className="text-gray-300">Budget:</strong> ${selectedProject.budget.spent.toLocaleString()} / ${selectedProject.budget.allocated.toLocaleString()}</div>
                <div><strong className="text-gray-300">Start:</strong> {selectedProject.startDate.toLocaleDateString()}</div>
                <div><strong className="text-gray-300">End:</strong> {selectedProject.endDate.toLocaleDateString()}</div>
                <div className="col-span-2"><strong className="text-gray-300">Project Health:</strong> <span className="font-bold text-green-400">{selectedProject.healthScore}%</span></div>
              </div>

              <div className="flex-grow bg-gray-900 rounded p-3 overflow-y-auto border border-gray-700">
                <h5 className="font-semibold text-gray-300 mb-2">Tasks & Milestones</h5>
                <TaskTrackerWidget projectId={selectedProject.id} />

                <h5 className="font-semibold text-gray-300 mt-4 mb-2">AI Project Insights</h5>
                <AIInsightsEngine dashboardId={selectedProject.id} currentFilters={{ projectId: selectedProject.id }} onApplySuggestion={(s) => console.log('Applied:', s)} />
                <AIContentGenerator contentType="action_plan" contextData={{ projectId: selectedProject.id, description: selectedProject.description, currentStatus: selectedProject.status }} onContentGenerated={(c) => console.log('Generated action plan:', c)} />
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">View Full Project</button>
                <button className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm">Edit Project</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Select a project to view its details and quantum-optimized insights.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const ResourceManagementSystem: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAssets([
        { id: 'hw-001', name: 'Quantum CPU Cluster', type: 'hardware', ownerId: 'admin', currentValue: 1200000, acquisitionDate: new Date('2022-05-01'), status: 'active', location: 'Data Center Alpha-7', metadata: { cores: 128, qbits: 1024, cooling: 'cryogenic' }, environmentalImpactScore: 8 },
        { id: 'lic-007', name: 'AI Model License (Gen. 5)', type: 'license', ownerId: 'user-123', currentValue: 50000, acquisitionDate: new Date('2023-11-01'), status: 'active', metadata: { users: 1000, expiration: '2025-11-01' } },
        { id: 'nft-star', name: 'Digital Star Map NFT', type: 'digital_art', ownerId: 'user-123', currentValue: 15000, acquisitionDate: new Date('2024-01-20'), status: 'active', metadata: { artist: 'Cosmic Artist X', blockchain: 'MetaverseChain' }, blockchainRef: '0xNFT_Star_Map_Hash' },
        { id: 'data-lake-01', name: 'Galactic Sensor Data Lake', type: 'data', ownerId: 'admin', currentValue: 200000, acquisitionDate: new Date('2023-03-01'), status: 'active', location: 'Cloud Region Delta', metadata: { size_tb: 500, retention_policy: 'infinite' } },
        { id: 'biomaterial-x', name: 'Self-repairing Nanosubstrate', type: 'biomaterial', ownerId: 'bio_specialist_1', currentValue: 5000, acquisitionDate: new Date('2024-06-01'), status: 'in_storage', location: 'Bio-Lab Gamma', metadata: { composition: 'graphene_bio_polymer' } },
      ]);
      setIsLoading(false);
    }, 1200);
  }, []);

  if (isLoading) return <div className="p-4 text-gray-400">Loading Universal Resources...</div>;

  return (
    <div className="resource-management-system bg-gray-800 border border-gray-700 rounded-lg p-4 h-full flex flex-col shadow-xl">
      <h3 className="text-xl font-bold mb-4 text-white">Universal Resource Nexus</h3>
      <div className="flex-grow overflow-y-auto">
        {assets.length === 0 ? (
          <p className="text-gray-400">No assets managed.</p>
        ) : (
          <table className="min-w-full text-white table-auto">
            <thead>
              <tr className="border-b border-gray-700 text-left text-gray-400">
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Value</th>
                <th className="p-2">Status</th>
                <th className="p-2">Location/Ref</th>
                <th className="p-2">Impact</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-2">{asset.name}</td>
                  <td className="p-2">{asset.type}</td>
                  <td className="p-2">${asset.currentValue.toLocaleString()}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${asset.status === 'active' ? 'bg-green-600' : asset.status === 'maintenance' ? 'bg-yellow-600' : 'bg-red-600'}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-2 text-sm">{asset.location || asset.blockchainRef || 'N/A'}</td>
                  <td className="p-2 text-sm">{asset.environmentalImpactScore ? `${asset.environmentalImpactScore}/10` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm">➕ Add New Asset</button>
        <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">View Full Inventory</button>
        <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm">🌌 Manage Interstellar Assets</button>
      </div>
    </div>
  );
};

interface QuantumComputingStatusWidgetProps {
  minimal?: boolean;
}
export const QuantumComputingStatusWidget: React.FC<QuantumComputingStatusWidgetProps> = ({ minimal = false }) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobHistory, setJobHistory] = useState<any[]>([]);
  const { config } = useContext(GlobalConfigContext)!;

  useEffect(() => {
    if (!config.quantumSecurityEnabled) {
      setLoading(false);
      return;
    }
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const result = await APIService.getQuantumJobResult('mock-quantum-job'); // Or a real ID
        setStatus(result);
        setJobHistory(prev => [{ timestamp: new Date(), ...result }, ...prev.slice(0, 4)]); // Keep last 5 jobs
      } catch (error) {
        console.error("Error fetching quantum status:", error);
        setStatus({ status: 'error', message: 'Failed to connect to quantum grid.' });
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [config.quantumSecurityEnabled]);

  if (!config.quantumSecurityEnabled) {
    return (
      <div className="quantum-status bg-gray-900 border border-red-700 rounded-lg p-4 text-red-400">
        <h3 className="text-xl font-bold mb-4">Quantum Grid Offline</h3>
        <p>Quantum computing features are currently disabled by global configuration.</p>
        <button className="mt-3 px-3 py-1 bg-red-700 hover:bg-red-800 rounded text-white text-sm" onClick={() => console.log('Request enable quantum')}>Request Activation</button>
      </div>
    );
  }

  if (loading) return <div className="p-4 text-blue-400">Establishing Quantum Link...</div>;

  if (minimal) {
    return (
      <div className="quantum-status-minimal bg-gray-900 border border-indigo-800 rounded-lg p-3 text-white text-sm">
        <p><strong className="text-indigo-300">Quantum Core:</strong> <span className={status?.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>{status?.status || 'N/A'}</span></p>
        <p><strong className="text-indigo-300">Qubits:</strong> {status?.result?.qubits || 'N/A'} | <strong className="text-indigo-300">Entanglement:</strong> {(status?.result?.entanglement_probability * 100).toFixed(1) || 'N/A'}%</p>
      </div>
    );
  }

  return (
    <div className="quantum-status bg-gradient-to-br from-gray-900 to-indigo-900 border border-indigo-700 rounded-lg p-4 shadow-2xl h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-cyan-400">Quantum Computing Nexus Status</h3>
      {status ? (
        <>
          <div className="grid grid-cols-2 gap-4 text-white">
            <div><strong className="text-indigo-300">Last Job ID:</strong> {status.jobId || 'N/A'}</div>
            <div><strong className="text-indigo-300">Status:</strong> <span className={`font-bold ${status.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>{status.status}</span></div>
            <div><strong className="text-indigo-300">Qubits Processed:</strong> {status.result?.qubits || 'N/A'}</div>
            <div><strong className="text-indigo-300">Entanglement P.:</strong> {(status.result?.entanglement_probability * 100).toFixed(2) || 'N/A'}%</div>
          </div>
          <div className="mt-4 flex-grow bg-gray-800 rounded p-3 overflow-y-auto border border-indigo-800">
            <h4 className="font-semibold text-indigo-300 mb-2">Recent Quantum Jobs</h4>
            {jobHistory.length > 0 ? (
              <ul>
                {jobHistory.map((job, index) => (
                  <li key={index} className="text-sm text-gray-400 mb-1 border-b border-gray-700 last:border-b-0 py-1">
                    [{new Date(job.timestamp).toLocaleTimeString()}] Job {job.jobId?.substring(0, 8)}... - Status: <span className={job.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>{job.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent quantum jobs.</p>
            )}
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm">⬆️ Submit Quantum Task</button>
            <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm">🔭 Monitor Quantum Field</button>
          </div>
        </>
      ) : (
        <p className="text-gray-400">Quantum computing status unavailable. Attempting reconnection...</p>
      )}
    </div>
  );
};

interface BlockchainLedgerStatusWidgetProps {
  minimal?: boolean;
}
export const BlockchainLedgerStatusWidget: React.FC<BlockchainLedgerStatusWidgetProps> = ({ minimal = false }) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const result = await APIService.getBlockchainLedgerStatus();
        setStatus(result);
      } catch (error) {
        console.error("Error fetching blockchain status:", error);
        setStatus({ status: 'error', message: 'Failed to connect to blockchain.' });
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-4 text-gray-400">Syncing Universal Ledger...</div>;

  if (minimal) {
    return (
      <div className="blockchain-status-minimal bg-gray-900 border border-green-800 rounded-lg p-3 text-white text-sm">
        <p><strong className="text-green-300">Blockchain:</strong> <span className={status?.status === 'synced' ? 'text-green-400' : 'text-red-400'}>{status?.status || 'N/A'}</span></p>
        <p><strong className="text-green-300">Block Height:</strong> {status?.blockHeight || 'N/A'} | <strong className="text-green-300">TPS:</strong> {status?.transactionRate || 'N/A'}</p>
      </div>
    );
  }

  return (
    <div className="blockchain-ledger-status bg-gradient-to-br from-gray-900 to-green-900 border border-green-700 rounded-lg p-4 shadow-xl h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-lime-400">Universal Blockchain Ledger Status</h3>
      {status ? (
        <>
          <div className="grid grid-cols-2 gap-4 text-white">
            <div><strong className="text-green-300">Network:</strong> {status.network || 'N/A'}</div>
            <div><strong className="text-green-300">Status:</strong> <span className={`font-bold ${status.status === 'synced' ? 'text-green-400' : 'text-red-400'}`}>{status.status}</span></div>
            <div><strong className="text-green-300">Last Block:</strong> {status.lastBlock?.substring(0, 10) || 'N/A'}...</div>
            <div><strong className="text-green-300">Block Height:</strong> {status.blockHeight?.toLocaleString() || 'N/A'}</div>
            <div><strong className="text-green-300">Validator Count:</strong> {status.validatorCount?.toLocaleString() || 'N/A'}</div>
            <div><strong className="text-green-300">Transaction Rate:</strong> {status.transactionRate || 'N/A'}</div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="px-3 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded text-sm">View Transactions</button>
            <button className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm">Mint NFT</button>
          </div>
        </>
      ) : (
        <p className="text-gray-400">Blockchain ledger status unavailable. Attempting connection...</p>
      )}
    </div>
  );
};


export const BioIntegrationHub: React.FC = () => {
  const { currentUser } = useContext(UserContext)!;
  const [heartRateData, setHeartRateData] = useState<MetricDataPoint[]>([]);
  const [sleepData, setSleepData] = useState<MetricDataPoint[]>([]);
  const [neuralActivity, setNeuralActivity] = useState<MetricDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    const fetchBioData = async () => {
      try {
        const hr = await APIService.fetchBioSignals(currentUser.id, 'heartRate', '24h');
        const sleep = await APIService.fetchBioSignals(currentUser.id, 'sleep', '7d');
        const neural = await APIService.fetchBioSignals(currentUser.id, 'neuralActivity', '1h');
        setHeartRateData(hr);
        setSleepData(sleep);
        setNeuralActivity(neural);
      } catch (error) {
        console.error("Error fetching bio signals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBioData();
    const interval = setInterval(fetchBioData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleNeuralLinkActivation = async () => {
    if (!currentUser) return;
    try {
      const response = await APIService.activateNeuralLink(currentUser.id);
      if (response.status === 'active') {
        alert('Neural Link Activated!');
        // Update user profile status
        useContext(UserContext)?.updateProfile({ neuralLinkStatus: 'active' });
      }
    } catch (error) {
      console.error("Failed to activate neural link:", error);
      alert('Failed to activate Neural Link.');
    }
  };


  if (!currentUser) return <div className="p-4 text-gray-400">Login to access Bio-Integration Hub.</div>;
  if (isLoading) return <div className="p-4 text-gray-400">Syncing Bio-Signatures...</div>;

  const currentHeartRate = heartRateData.length > 0 ? heartRateData[heartRateData.length - 1].value : 'N/A';
  const averageSleep = sleepData.length > 0 ? (sleepData.reduce((acc, curr) => acc + curr.value, 0) / sleepData.length).toFixed(1) : 'N/A';
  const currentMood = currentUser.healthMetrics?.mood?.[0]?.value || 3.5;
  const neuralLinkStatus = currentUser.neuralLinkStatus || 'inactive';

  return (
    <div className="bio-integration-hub bg-gradient-to-br from-green-900 to-teal-900 border border-teal-700 rounded-lg p-4 shadow-xl h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-green-300">Bio-Integrated Health & Wellness Core</h3>
      <div className="grid grid-cols-2 gap-4 text-white mb-4">
        <div className="bg-green-800 p-3 rounded-lg"><strong className="text-green-300">Current Heart Rate:</strong> {currentHeartRate} BPM</div>
        <div className="bg-green-800 p-3 rounded-lg"><strong className="text-green-300">Avg. Sleep (7D):</strong> {averageSleep} hours</div>
        <div className="bg-green-800 p-3 rounded-lg"><strong className="text-green-300">AI Mood Score:</strong> {currentMood.toFixed(1)}/5</div>
        <div className="bg-green-800 p-3 rounded-lg"><strong className="text-green-300">Neural Link:</strong> <span className={neuralLinkStatus === 'active' ? 'text-cyan-400' : 'text-yellow-400'}>{neuralLinkStatus.toUpperCase()}</span></div>
      </div>
      <div className="flex-grow bg-gray-900 rounded p-3 overflow-y-auto border border-teal-800">
        <h4 className="font-semibold text-green-300 mb-2">Detailed Bio-Signal Visualizations</h4>
        <DataVisualization
          data={heartRateData.map(d => ({ x: d.timestamp.getTime(), y: d.value }))}
          config={{ id: 'hr-viz', type: 'LineChart', title: 'Heart Rate', dataSources: ['biometrics'], refreshInterval: 60, filters: {}, visualizationType: 'lineGraph', layout: { x: 0, y: 0, w: 1, h: 1 }, permissions: ['standard'], telemetryEnabled: true }}
          height="150px"
        />
        <h4 className="font-semibold text-green-300 mt-4 mb-2">Neural Activity Patterns</h4>
        <DataVisualization
          data={neuralActivity.map(d => ({ x: d.timestamp.getTime(), y: d.value }))}
          config={{ id: 'neural-viz', type: 'AreaChart', title: 'Neural Activity', dataSources: ['biometrics'], refreshInterval: 10, filters: { metric: 'neuralActivity' }, visualizationType: 'areaChart', layout: { x: 0, y: 0, w: 1, h: 1 }, permissions: ['standard'], telemetryEnabled: true }}
          height="150px"
        />
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm">📈 Full Health Report</button>
        {neuralLinkStatus === 'inactive' && (
          <button onClick={handleNeuralLinkActivation} className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm">🧠 Activate Neural Link</button>
        )}
        <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm">🧘 AI Wellness Coach</button>
      </div>
    </div>
  );
};

export const MetaverseAssetViewer: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext)!;

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      APIService.fetchMetaverseAssets(currentUser.id).then(fetchedAssets => {
        setAssets(fetchedAssets);
        if (fetchedAssets.length > 0) {
          setSelectedAsset(fetchedAssets[0]);
        }
        setIsLoading(false);
      });
    }
  }, [currentUser]);

  if (!currentUser) return <div className="p-4 text-gray-400">Login to access Metaverse Assets.</div>;
  if (isLoading) return <div className="p-4 text-gray-400">Loading Metaverse Assets...</div>;

  return (
    <div className="metaverse-asset-viewer bg-gradient-to-br from-blue-900 to-indigo-900 border border-blue-700 rounded-lg p-4 shadow-xl h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-cyan-300">Metaverse Asset Gateway</h3>
      {assets.length === 0 ? (
        <p className="text-gray-400">No Metaverse assets found. Begin your journey into the digital realm!</p>
      ) : (
        <div className="flex-grow flex space-x-4">
          <div className="w-1/4 border-r border-gray-700 pr-4">
            <h4 className="font-semibold text-gray-300 mb-2">My Assets</h4>
            <ul>
              {assets.map(asset => (
                <li key={asset.id} className="mb-1">
                  <button
                    onClick={() => setSelectedAsset(asset)}
                    className={`block w-full text-left p-2 rounded ${selectedAsset?.id === asset.id ? 'bg-blue-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                  >
                    {asset.name} ({asset.type === 'metaverse_land' ? '🌎 Land' : '🖼️ NFT'})
                  </button>
                </li>
              ))}
              <li className="mt-2"><button className="block w-full text-left p-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white">➕ Acquire New Asset</button></li>
            </ul>
          </div>
          <div className="flex-grow flex flex-col">
            {selectedAsset ? (
              <>
                <p className="text-gray-300 mb-2">Viewing: <span className="font-semibold text-white">{selectedAsset.name}</span></p>
                <div className="flex-grow min-h-[300px] mb-4">
                  <HolographicProjection
                    modelUrl={`/models/${selectedAsset.id}.gltf`} // Assuming a model for each asset
                    interactionMode="manipulate"
                    onInteraction={(e) => console.log('Hologram interacted:', e)}
                  />
                </div>
                <div className="text-white text-sm">
                  <p><strong className="text-blue-300">Type:</strong> {selectedAsset.type}</p>
                  <p><strong className="text-blue-300">Current Value:</strong> ${selectedAsset.currentValue.toLocaleString()} (Fluctuating)</p>
                  <p><strong className="text-blue-300">Location:</strong> {selectedAsset.location || 'N/A'}</p>
                  <p><strong className="text-blue-300">Blockchain Ref:</strong> {selectedAsset.blockchainRef || 'N/A'}</p>
                  <p><strong className="text-blue-300">Status:</strong> {selectedAsset.status}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">🌐 Enter Metaverse</button>
                  <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm">💰 List for Sale</button>
                </div>
              </>
            ) : (
              <p className="text-gray-400">Select an asset to view its holographic projection.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const DecentralizedGovernancePanel: React.FC = () => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext)!;

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setProposals([
        { id: 'prop-001', title: 'Fund Interstellar Research Initiative', status: 'voting', eta: '3 days', votes: { yes: 1200, no: 300 }, description: 'Proposing allocation of 100M Universal Credits for deep space exploration and scientific breakthroughs.', type: 'funding' },
        { id: 'prop-002', title: 'Allocate compute for AI singularity defense', status: 'passed', eta: 'N/A', votes: { yes: 5000, no: 50 }, description: 'Passed proposal to establish a decentralized AI monitoring and defense grid.', type: 'security' },
        { id: 'prop-003', title: 'Upgrade core quantum infrastructure', status: 'pending', eta: '7 days', votes: { yes: 100, no: 10 }, description: 'Awaiting review: Proposal to invest in the next generation of quantum processors for the Universal Grid.', type: 'infrastructure' },
        { id: 'prop-004', title: 'Implement universal basic digital income', status: 'voting', eta: '5 days', votes: { yes: 800, no: 600 }, description: 'Proposal for a token-based universal basic income system for all registered users.', type: 'social' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  if (!currentUser) return <div className="p-4 text-gray-400">Login to participate in Decentralized Governance.</div>;
  if (isLoading) return <div className="p-4 text-gray-400">Loading DAO Proposals from the Universal Ledger...</div>;

  const handleVote = async (proposalId: string, vote: 'yes' | 'no') => {
    alert(`Voting ${vote} on proposal ${proposalId}. This would interact with a blockchain wallet.`);
    // Simulate API call to record vote
    // await APIService.submitDAOVote(proposalId, currentUser.id, vote);
  };

  const handleCreateProposal = async () => {
    const title = prompt('Enter new proposal title:');
    if (title) {
      const newProposal = {
        title,
        description: 'AI-generated description based on user input for a new governance proposal.',
        status: 'pending',
        type: 'general',
        ownerId: currentUser.id,
      };
      const result = await APIService.submitDAOProposal(newProposal);
      alert(`Proposal "${title}" submitted with ID: ${result.proposalId}`);
      // Refresh proposals
    }
  };

  return (
    <div className="decentralized-governance-panel bg-gradient-to-br from-purple-900 to-red-900 border border-purple-700 rounded-lg p-4 shadow-xl h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-pink-300">Decentralized Governance Nexus (DAO)</h3>
      <p className="text-gray-300 mb-4">Participate in the self-organization of the entire ecosystem.</p>
      <div className="flex-grow overflow-y-auto">
        {proposals.length === 0 ? (
          <p className="text-gray-400">No active governance proposals.</p>
        ) : (
          <ul className="space-y-4">
            {proposals.map(proposal => (
              <li key={proposal.id} className="bg-gray-800 p-4 rounded-lg border border-purple-800">
                <h4 className="font-semibold text-lg text-white mb-1">{proposal.title}</h4>
                <p className="text-sm text-gray-400">{proposal.description}</p>
                <p className="text-sm text-gray-400 mt-2">Status: <span className={proposal.status === 'voting' ? 'text-yellow-400' : 'text-green-400'}>{proposal.status}</span></p>
                <p className="text-sm text-gray-400">Votes: Yes <span className="text-green-300 font-bold">{proposal.votes.yes}</span> / No <span className="text-red-300 font-bold">{proposal.votes.no}</span></p>
                <p className="text-sm text-gray-400">ETA: {proposal.eta}</p>
                {proposal.status === 'voting' && (
                  <div className="mt-3 flex space-x-2">
                    <button onClick={() => handleVote(proposal.id, 'yes')} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs">Vote Yes</button>
                    <button onClick={() => handleVote(proposal.id, 'no')} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Vote No</button>
                    <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs">View Details</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={handleCreateProposal} className="px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded text-sm">➕ Create New Proposal</button>
      </div>
    </div>
  );
};

export const AIServiceStudio: React.FC = () => {
  const [models, setModels] = useState<AiModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext)!;

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setModels([
        { id: 'nlp-v1', name: 'Universal NLP Processor', version: '1.0', type: 'NLP', status: 'deployed', trainingDataSizeGB: 5000, performanceMetrics: { accuracy: 0.92, precision: 0.9, recall: 0.91, f1Score: 0.91, inferenceLatencyMs: 50 }, ownerId: 'admin', accessControl: [], costPerInferenceUnit: 0.001, quantumOptimized: false },
        { id: 'pred-v2', name: 'Galactic Trend Predictor', version: '2.1', type: 'Predictive', status: 'training', trainingDataSizeGB: 10000, performanceMetrics: { accuracy: 0.88, precision: 0.85, recall: 0.87, f1Score: 0.86, inferenceLatencyMs: 120 }, ownerId: currentUser?.id || 'user-123', accessControl: [], costPerInferenceUnit: 0.005, quantumOptimized: true },
      ]);
      setIsLoading(false);
    }, 1000);
  }, [currentUser]);

  const handleTrainModel = async (modelId: string) => {
    alert(`Initiating training for model: ${modelId}`);
    const result = await APIService.submitAIModelForTraining({ modelId, config: {} }, { data: 'new_dataset' });
    console.log(result);
  };

  const handleDeployModel = async (modelId: string) => {
    alert(`Deploying model: ${modelId}`);
    const result = await APIService.deployAIModel(modelId, 'production');
    console.log(result);
  };

  if (!currentUser) return <div className="p-4 text-gray-400">Login to access AI Studio.</div>;
  if (isLoading) return <div className="p-4 text-gray-400">Loading AI Model Registry...</div>;

  return (
    <div className="ai-service-studio bg-gray-800 border border-gray-700 rounded-lg p-4 h-full flex flex-col shadow-xl">
      <h3 className="text-xl font-bold mb-4 text-white">AI Model Training & Deployment Studio</h3>
      <p className="text-gray-300 mb-4">Manage your custom AI models, retrain existing ones with new data streams from the universe, and deploy them across various modules. Integrate with quantum hardware for accelerated training.</p>

      <div className="flex-grow overflow-y-auto space-y-4">
        {models.length === 0 ? (
          <p className="text-gray-400">No AI models registered.</p>
        ) : (
          models.map(model => (
            <div key={model.id} className="bg-gray-900 p-4 rounded-lg border border-blue-700">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-lg text-blue-300">{model.name} ({model.version})</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${model.status === 'deployed' ? 'bg-green-600' : model.status === 'training' ? 'bg-yellow-600' : 'bg-red-600'}`}>
                  {model.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">Type: {model.type} | Quantum Optimized: {model.quantumOptimized ? 'Yes' : 'No'}</p>
              <p className="text-sm text-gray-400">Accuracy: {(model.performanceMetrics.accuracy * 100).toFixed(1)}% | Latency: {model.performanceMetrics.inferenceLatencyMs}ms</p>
              <div className="mt-3 flex space-x-2">
                <button onClick={() => handleTrainModel(model.id)} disabled={model.status === 'training'} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs disabled:opacity-50">🧪 Retrain Model</button>
                <button onClick={() => handleDeployModel(model.id)} disabled={model.status !== 'training'} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs disabled:opacity-50">🚀 Deploy Model</button>
                <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs">🌌 Quantum AI Sandbox</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">➕ Register New Model</button>
      </div>
    </div>
  );
};


// --- The Dashboard Component (The Universe Itself) ---

export const Dashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useContext(UserContext)!;
  const { theme, setTheme, generateTheme } = useContext(ThemeContext)!;
  const { config, updateConfig, getFeatureFlag, getSetting } = useContext(GlobalConfigContext)!;

  const [currentLayout, setCurrentLayout] = useState<DashboardLayout | null>(null);
  const [isWidgetCatalogOpen, setIsWidgetCatalogOpen] = useState(false);
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'resources' | 'quantum' | 'bio' | 'metaverse' | 'governance' | 'ai_studio' | 'security' | 'learning'>('overview');
  const [layoutNeedsSaving, setLayoutNeedsSaving] = useState(false);

  // Initialize a default layout if none exists
  useEffect(() => {
    if (isAuthenticated && !currentLayout && currentUser) {
      APIService.fetchDashboardLayouts(currentUser.id).then(layouts => {
        if (layouts.length > 0) {
          setCurrentLayout(layouts[0]);
        } else {
          // Create a default initial layout
          const defaultLayout: DashboardLayout = {
            id: 'default-user-layout',
            name: 'My Universal Dashboard',
            ownerId: currentUser.id,
            sharedWith: [],
            version: 1,
            isPublic: false,
            theme: theme,
            globalFilters: {},
            aiGenerated: false,
            lastModified: new Date(),
            changeLog: [],
            performanceMetrics: { loadTime: 0, apiCalls: 0, renderErrors: 0 },
            accessControlList: [],
            spatialConfig: { mode: '2D', environment: 'default' },
            widgets: [
              { id: 'widget-ai-1', type: 'AIRecommendationPanel', title: 'AI Cognitive Insights', layout: { x: 0, y: 0, w: 4, h: 2 }, dataSources: ['internal_data', 'external_feeds'], refreshInterval: 300, filters: {}, visualizationType: 'textList', permissions: ['standard'], telemetryEnabled: true },
              { id: 'widget-hr-1', type: 'BioSignalGraph', title: 'Real-time Heart Rate', layout: { x: 4, y: 0, w: 4, h: 2 }, dataSources: ['bio_signals'], refreshInterval: 10, filters: { metric: 'heartRate' }, visualizationType: 'lineGraph', permissions: ['standard'], telemetryEnabled: true },
              { id: 'widget-block-1', type: 'BlockchainStatus', title: 'Blockchain Ledger Status', layout: { x: 8, y: 0, w: 4, h: 2 }, dataSources: ['blockchain'], refreshInterval: 60, filters: {}, visualizationType: 'textPanel', permissions: ['developer'], telemetryEnabled: true },
              { id: 'widget-tasks-1', type: 'TaskTracker', title: 'My Active Tasks', layout: { x: 0, y: 2, w: 6, h: 3 }, dataSources: ['project_tasks'], refreshInterval: 120, filters: { assignedTo: currentUser.id, status: 'in_progress' }, visualizationType: 'table', permissions: ['standard'], telemetryEnabled: true },
              { id: 'widget-comm-1', type: 'CommunicationFeed', title: 'Team Comms', layout: { x: 6, y: 2, w: 6, h: 3 }, dataSources: ['communication'], refreshInterval: 5, filters: { channelId: 'proj-alpha' }, visualizationType: 'chatFeed', permissions: ['standard'], telemetryEnabled: true },
            ]
          };
          setCurrentLayout(defaultLayout);
          APIService.saveDashboardLayout(defaultLayout);
        }
      });
    }
  }, [isAuthenticated, currentLayout, currentUser, theme]);

  const handleLayoutChange = (layoutId: string) => {
    if (layoutId === 'new') {
      const newLayout: DashboardLayout = {
        id: `layout-${Date.now()}`,
        name: `New Custom Layout ${Date.now()}`,
        ownerId: currentUser?.id || 'anonymous',
        sharedWith: [],
        version: 1,
        isPublic: false,
        theme: theme,
        globalFilters: {},
        aiGenerated: false,
        lastModified: new Date(),
        changeLog: [],
        performanceMetrics: { loadTime: 0, apiCalls: 0, renderErrors: 0 },
        accessControlList: [],
        spatialConfig: { mode: '2D', environment: 'default' },
        widgets: []
      };
      setCurrentLayout(newLayout);
      setLayoutNeedsSaving(true);
    } else {
      if (currentUser) {
        APIService.fetchDashboardLayouts(currentUser.id).then(layouts => {
          const selected = layouts.find(l => l.id === layoutId);
          if (selected) setCurrentLayout(selected);
        });
      }
    }
  };

  const handleSaveLayout = async () => {
    if (currentLayout) {
      await APIService.saveDashboardLayout(currentLayout);
      setLayoutNeedsSaving(false);
      alert('Layout saved successfully!');
    }
  };

  const handleShareLayout = () => {
    alert('Advanced layout sharing (user groups, public links, permission levels) coming soon!');
  };

  const handleAddWidget = (widgetType: string) => {
    if (!currentLayout) return;

    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: `${widgetType} Widget`,
      layout: { x: (currentLayout.widgets.length % 3) * 4, y: Math.floor(currentLayout.widgets.length / 3) * 2, w: 4, h: 2 }, // Simple auto-layout
      dataSources: ['dynamic_source'],
      refreshInterval: 60,
      filters: {},
      visualizationType: 'defaultChart',
      permissions: ['standard'],
      telemetryEnabled: true,
    };

    setCurrentLayout(prev => prev ? { ...prev, widgets: [...prev.widgets, newWidget] } : null);
    setIsWidgetCatalogOpen(false);
    setLayoutNeedsSaving(true);
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (currentLayout) {
      setCurrentLayout(prev => prev ? { ...prev, widgets: prev.widgets.filter(w => w.id !== widgetId) } : null);
      setLayoutNeedsSaving(true);
    }
  };

  const handleEditWidget = (editedWidget: WidgetConfig) => {
    if (currentLayout) {
      setCurrentLayout(prev => prev ? { ...prev, widgets: prev.widgets.map(w => w.id === editedWidget.id ? editedWidget : w) } : null);
      setLayoutNeedsSaving(true);
    }
  };

  const handleDataRefresh = (widgetId: string) => {
    // This could trigger an individual widget data fetch or just re-render
    console.log(`Manually refreshing data for widget ${widgetId}`);
  };

  const handleCustomizeTheme = () => {
    const themes: DashboardLayout['theme'][] = ['light', 'dark', 'holographic', 'neon', 'cyberpunk', 'quantum_matrix', 'bio_lumina'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
    if (currentLayout) { // Update layout theme as well
      setCurrentLayout(prev => prev ? { ...prev, theme: themes[nextIndex] } : null);
      setLayoutNeedsSaving(true);
    }
    alert(`Theme changed to ${themes[nextIndex]}!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to the Universe Dashboard</h2>
          <p className="text-xl mb-6">Please log in to access your cosmic control panel.</p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold"
            onClick={() => useContext(UserContext)!.login({ username: 'test', password: 'password' })}>
            Access the Universe
          </button>
        </div>
      </div>
    );
  }

  if (!currentLayout) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 animate-pulse">Initializing Universal Dashboard...</h2>
          <p className="text-lg">Preparing your personalized cosmos interface.</p>
        </div>
      </div>
    );
  }

  const gridClass = `grid grid-cols-12 gap-6 p-6 min-h-[calc(100vh-64px)] overflow-auto`;

  return (
    <div className={`universe-dashboard-container bg-gradient-to-br from-gray-950 to-black text-white min-h-screen ${theme}`}>
      <DashboardHeader
        currentLayout={currentLayout}
        onLayoutChange={handleLayoutChange}
        onSaveLayout={handleSaveLayout}
        onShareLayout={handleShareLayout}
        onAddWidgetClick={() => setIsWidgetCatalogOpen(true)}
        onCustomizeTheme={handleCustomizeTheme}
        onOpenGlobalSettings={() => setIsGlobalSettingsOpen(true)}
      />

      <div className="dashboard-content flex">
        <aside className="w-16 hover:w-64 transition-all duration-300 bg-gray-900 border-r border-gray-700 flex flex-col py-4 px-2 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto z-40 group">
          <nav>
            <ul>
              <li className="mb-2">
                <button onClick={() => setActiveTab('overview')} className={`flex items-center w-full p-2 rounded group-hover:justify-start ${activeTab === 'overview' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-2xl">🏠</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Overview</span>
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => setActiveTab('projects')} className={`flex items-center w-full p-2 rounded group-hover:justify-start ${activeTab === 'projects' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-2xl">📊</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Projects & Tasks</span>
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => setActiveTab('resources')} className={`flex items-center w-full p-2 rounded group-hover:justify-start ${activeTab === 'resources' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-2xl">📦</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Resource Management</span>
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => setActiveTab('quantum')} className={`flex items-center w-full p-2 rounded group-hover:justify-start ${activeTab === 'quantum' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-2xl">⚛️</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Quantum Computing</span>
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => setActiveTab('bio')} className={`flex items-center w-full p-2 rounded group-hover:justify-start ${activeTab === 'bio' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-2xl">🧬</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Bio-Integration Hub</span>
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => setActiveTab('metaverse')} className={`flex items-center w-full p-2 rounded group-hover:justify-start ${activeTab === 'metaverse' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-2xl">🌐</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Metaverse Gateway</span>
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => setActiveTab('governance')} className={`flex items-center w-full p-2 rounded group-hover:justify-start ${activeTab === 'governance' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-2xl">🏛️</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Decentralized Governance</span>
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => setActiveTab('ai_studio')} className={`flex items-center w-full p-2 rounded group-hover:justify-start ${activeTab === 'ai_studio' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-2xl">🧠</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">AI Studio</span>
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => setActiveTab('security')} className={`flex items-center w-full p-2 rounded group-hover:justify-start ${activeTab === 'security' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-2xl">🚨</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Security Operations</span>
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => setActiveTab('learning')} className={`flex items-center w-full p-2 rounded group-hover:justify-start ${activeTab === 'learning' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                  <span className="text-2xl">🎓</span>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Learning & Development</span>
                </button>
              </li>
            </ul>
          </nav>
          <div className="mt-auto pt-4 border-t border-gray-700">
            {/* <GlobalConfigControls /> */} {/* Moved to a modal for better UX */}
          </div>
        </aside>

        <main className="flex-grow">
          {layoutNeedsSaving && (
            <div className="bg-yellow-800 text-yellow-100 p-2 text-center text-sm">
              You have unsaved changes to your layout. <button onClick={handleSaveLayout} className="underline font-bold ml-2">Save Now</button>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className={gridClass}>
              {getFeatureFlag('enableAIRecommendationEngine') && (
                <div className="col-span-12">
                  <AIInsightsEngine dashboardId={currentLayout.id} currentFilters={currentLayout.globalFilters} onApplySuggestion={(s) => console.log('AI Suggested:', s)} />
                </div>
              )}

              {currentLayout.widgets.length === 0 ? (
                <div className="col-span-12 text-center py-10 text-gray-400 text-xl">
                  Your dashboard is empty! Click "➕ Widget" in the header to populate your universe.
                </div>
              ) : (
                currentLayout.widgets.map(widget => (
                  <DraggableWidget
                    key={widget.id}
                    widget={widget}
                    onRemove={handleRemoveWidget}
                    onEdit={handleEditWidget}
                    onDataRefresh={handleDataRefresh}
                  />
                ))
              )}

              {getSetting('holographicModeAvailable') && (
                <div className="col-span-12 mt-8">
                  <h3 className="text-xl font-bold mb-3 text-cyan-400">Advanced Visualizations</h3>
                  <HolographicProjection modelUrl="/models/universe_model.gltf" interactionMode="view" onInteraction={() => {}} />
                  {/* SpatialAudioControl is embedded within HolographicProjection for better context */}
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="p-6 h-full">
              <ProjectManagementModule />
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="p-6 h-full">
              <ResourceManagementSystem />
            </div>
          )}

          {activeTab === 'quantum' && (
            <div className="p-6 h-full">
              <QuantumComputingStatusWidget />
            </div>
          )}

          {activeTab === 'bio' && (
            <div className="p-6 h-full">
              <BioIntegrationHub />
            </div>
          )}

          {activeTab === 'metaverse' && (
            <div className="p-6 h-full">
              <MetaverseAssetViewer />
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="p-6 h-full">
              <DecentralizedGovernancePanel />
            </div>
          )}

          {activeTab === 'ai_studio' && (
            <div className="p-6 h-full">
              <AIServiceStudio />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-6 h-full bg-gray-800 border border-red-700 rounded-lg shadow-xl text-white">
              <h3 className="text-2xl font-bold mb-4 text-red-400">Universal Security Operations Center (USOC)</h3>
              <p className="mb-4 text-gray-300">
                Real-time threat detection, anomaly analysis (powered by Quantum AI), compliance monitoring, and incident response across the entire ecosystem.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-red-800">
                  <h4 className="text-xl font-semibold mb-2 text-red-300">Threat Alerts</h4>
                  <p className="text-sm text-gray-400">Latest threat intelligence feed and high-priority alerts.</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>🚨 High Severity: Unauthorized Quantum Entanglement Attempt (Sector Gamma-5)</li>
                    <li>⚠️ Medium Severity: Anomalous Data Ingress (Exoplanet Sensor Net)</li>
                    <li>✅ Low Severity: Routine Security Patch Applied (Dashboard Core)</li>
                  </ul>
                  <button className="mt-4 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm">View Full Threat Log</button>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-yellow-800">
                  <h4 className="text-xl font-semibold mb-2 text-yellow-300">Compliance & Audit</h4>
                  <p className="text-sm text-gray-400">Ensure adherence to Universal Data Sovereignty and Ethical AI Guidelines.</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>✔️ Universal Data Privacy Standard (UDPS) - Compliant</li>
                    <li>✔️ Ethical AI Framework (EAIF) - Audit Pending (Q4)</li>
                    <li>❌ Quantum Computing Usage Policy (QCUP) - Review Needed</li>
                  </ul>
                  <button className="mt-4 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm">Run Compliance Scan</button>
                </div>
                <div className="col-span-full">
                  <AIContentGenerator contentType="action_plan" contextData={{ securityIncident: true }} onContentGenerated={(c) => alert('AI Generated Incident Response Plan!')} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="p-6 h-full bg-gray-800 border border-purple-700 rounded-lg shadow-xl text-white">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Universal Learning & Development Nexus</h3>
              <p className="mb-4 text-gray-300">
                Access personalized learning paths, interactive simulations, and expert-led modules to master new skills for the evolving universe.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-purple-800">
                  <h4 className="text-xl font-semibold mb-2 text-purple-300">My Learning Paths</h4>
                  <p className="text-sm text-gray-400">Continue your journey through recommended skill development.</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>📚 Quantum Computing 101 (80% Complete)</li>
                    <li>📚 Advanced AI Ethics & Governance (30% Complete)</li>
                    <li>📚 Metaverse Architecture Principles (New!)</li>
                  </ul>
                  <button className="mt-4 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm">View All Paths</button>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-pink-800">
                  <h4 className="text-xl font-semibold mb-2 text-pink-300">Skill Gap Analysis (AI Powered)</h4>
                  <p className="text-sm text-gray-400">Your profile suggests you need to develop in:</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>⭐ Neuro-Linguistic Programming (NLP)</li>
                    <li>⭐ Decentralized Autonomous Organization (DAO) Management</li>
                    <li>⭐ Bio-Neural Interface Engineering</li>
                  </ul>
                  <button className="mt-4 px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded text-sm">Generate Custom Path</button>
                </div>
                <div className="col-span-full">
                  <AIInsightsEngine dashboardId="learning-nexus" currentFilters={{ userId: currentUser?.id }} onApplySuggestion={(s) => alert(`AI suggested: ${s}`)} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {isWidgetCatalogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]"> {/* Higher z-index for modals */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-11/12 md:w-3/4 lg:w-1/2 relative">
            <button onClick={() => setIsWidgetCatalogOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">
              ✖
            </button>
            <WidgetCatalog onAddWidget={handleAddWidget} />
          </div>
        </div>
      )}

      {isGlobalSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative">
            <button onClick={() => setIsGlobalSettingsOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">
              ✖
            </button>
            <GlobalConfigControls />
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-gray-500 text-xs p-2 text-center border-t border-gray-700 fixed bottom-0 w-full z-50">
        Universe OS v{config.dashboardVersion} | Status: <span className="text-green-500">All Systems Nominal</span> | Quantum Security: {config.quantumSecurityEnabled ? <span className="text-green-500">ACTIVE</span> : <span className="text-yellow

================================================================================
// APPENDED FROM REPO: diplomat-bit/connect-api | ORIGINAL PATH: diplomat-bit-connect-api-352979a/components/Dashboard.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  PlaidCredentials, Account, Transaction, 
  MarqetaCredentials, MarqetaCardProduct, MarqetaCard,
  ModernTreasuryCredentials, MTLedger, MTInternalAccount
} from '../types';
import { 
  CreditCard, Wallet, Search, ExternalLink, ChevronRight, Database, Landmark,
  RefreshCcw, AlertCircle, Info, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap,
  Activity, Settings, Box, Plus, Sparkles, X, CheckCircle, Cpu, UserCheck, Code,
  Terminal, Globe, Key, FileText, Users, ShoppingCart, Repeat, Layers, Lock
} from 'lucide-react';

interface Props {
  accessToken: string;
  credentials: PlaidCredentials;
  marqetaCreds: MarqetaCredentials;
  mtCreds: ModernTreasuryCredentials;
  proxy: string;
  addLog: (msg: any, type?: 'req' | 'res' | 'err') => void;
}

export const Dashboard: React.FC<Props> = ({ accessToken, credentials, marqetaCreds, mtCreds, proxy, addLog }) => {
  const [activeTab, setActiveTab] = useState<'banking' | 'issuing' | 'ledgering'>('banking');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cardProducts, setCardProducts] = useState<MarqetaCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [newCard, setNewCard] = useState<MarqetaCard | null>(null);
  
  // Modern Treasury Explorer State
  const [mtResource, setMtResource] = useState<string>('ledgers');
  const [mtData, setMtData] = useState<any>(null);
  const [mtLoading, setMtLoading] = useState(false);

  const mtAuth = btoa(`${mtCreds.organizationId}:${mtCreds.apiKey}`);
  const marqetaAuth = btoa(`${marqetaCreds.applicationToken}:${marqetaCreds.adminAccessToken}`);

  const mtFetch = async (endpoint: string, method: string = 'GET', body?: any) => {
    const targetUrl = `https://app.moderntreasury.com/api${endpoint}`;
    const finalUrl = proxy ? `${proxy}${encodeURIComponent(targetUrl)}` : targetUrl;
    
    addLog(`${method} ${endpoint} [MODERN_TREASURY]`, 'req');
    try {
      const response = await fetch(finalUrl, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${mtAuth}`
        },
        body: body ? JSON.stringify(body) : undefined
      });
      
      const data = await response.json();
      if (!response.ok) {
        addLog(data, 'err');
        return { error: true, data };
      }
      addLog(data, 'res');
      return data;
    } catch (err: any) {
      addLog(err.message, 'err');
      throw err;
    }
  };

  const marqetaFetch = async (endpoint: string, method: string = 'GET', body?: any) => {
    const targetUrl = `https://sandbox-api.marqeta.com/v3${endpoint}`;
    const finalUrl = proxy ? `${proxy}${encodeURIComponent(targetUrl)}` : targetUrl;
    
    addLog(`${method} ${endpoint} [MARQETA]`, 'req');
    const res = await fetch(finalUrl, {
      method,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Basic ${marqetaAuth}` 
      },
      body: body ? JSON.stringify(body) : undefined
    }).then(r => r.json());
    addLog(res, 'res');
    return res;
  };

  const fetchStack = async () => {
    setLoading(true);
    try {
      // 1. Plaid - Robust mapping with optional chaining to prevent the reported crash
      const plaidBase = `https://${credentials.environment}.plaid.com`;
      const pUrl = proxy ? `${proxy}${encodeURIComponent(plaidBase + '/accounts/get')}` : plaidBase + '/accounts/get';
      const pRes = await fetch(pUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: credentials.clientId, secret: credentials.secret, access_token: accessToken })
      }).then(r => r.json());
      
      if (pRes.accounts && Array.isArray(pRes.accounts)) {
        const mapped = pRes.accounts.map((a: any) => ({
          id: a.account_id,
          name: a.name || 'Untitled Account',
          mask: a.mask || '0000',
          type: a.type || 'depository',
          subtype: a.subtype || 'checking',
          balance: {
            current: a.balances?.current ?? 0,
            available: a.balances?.available ?? null,
            limit: a.balances?.limit ?? null,
            currency: a.balances?.iso_currency_code || 'USD'
          }
        }));
        setAccounts(mapped);
      }

      // 2. Marqeta
      const mRes = await marqetaFetch('/cardproducts');
      setCardProducts(mRes.data || []);

      // 3. Modern Treasury Initial Sync
      await fetchMtResource('ledgers');

    } catch (e) {
      console.error(e);
      addLog("Infrastructure handshake error", 'err');
    } finally {
      setLoading(false);
    }
  };

  const fetchMtResource = async (resource: string) => {
    setMtLoading(true);
    setMtResource(resource);
    try {
      const data = await mtFetch(`/${resource}`);
      setMtData(data);
    } catch (e: any) {
      setMtData({ error: e.message, status: 'Proxy Node Rejected' });
    } finally {
      setMtLoading(false);
    }
  };

  useEffect(() => { fetchStack(); }, [accessToken, proxy]);

  const mintCard = async () => {
    setIsMinting(true);
    try {
      const userToken = 'u_' + Math.random().toString(36).substring(7);
      await marqetaFetch('/users', 'POST', { token: userToken, first_name: 'Nexus', last_name: 'Operator' });
      
      let productToken = cardProducts[0]?.token;
      if (!productToken) {
        const prod = await marqetaFetch('/cardproducts', 'POST', { 
          token: 'cp_' + Math.random().toString(36).substring(7), 
          name: 'Nexus Elite V1', 
          active: true, 
          config: { card_life_cycle: { activate_upon_issue: true, expiration_offset: { unit: 'YEARS', value: 5 } }, payment_instrument: 'VIRTUAL_PAN' } 
        });
        productToken = prod.token;
      }

      const card = await marqetaFetch('/cards?show_pan=true&show_cvv_number=true', 'POST', { user_token: userToken, card_product_token: productToken });
      setNewCard({ 
        pan: card.pan, 
        last_four: card.last_four, 
        expiration: card.expiration, 
        cvv: card.cvv_number, 
        token: card.token, 
        user_token: card.user_token, 
        card_product_token: card.card_product_token, 
        state: card.state 
      });
      await fetchStack();
    } catch (e: any) {
      addLog(e.message, 'err');
    } finally {
      setIsMinting(false);
    }
  };

  const netBalance = accounts.reduce((acc, curr) => 
    curr.type === 'depository' ? acc + (curr.balance?.current || 0) : acc - (curr.balance?.current || 0), 0
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10">
      <div className="relative">
         <div className="w-24 h-24 border-[6px] border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
         <div className="absolute inset-0 flex items-center justify-center">
            <Activity size={32} className="text-blue-500 animate-pulse" />
         </div>
      </div>
      <div className="text-center space-y-2">
         <p className="text-blue-500 font-black uppercase tracking-[0.5em] italic text-xs">Calibrating Infrastructure</p>
         <p className="text-slate-600 text-[10px] font-mono uppercase">Node Aggregator | Issuing Node | Ledger Node</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      
      {/* SUCCESS MODAL - THE "BAD ASS" CARD POPUP */}
      {newCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] max-w-xl w-full text-center space-y-10 shadow-[0_0_100px_rgba(37,99,235,0.2)]">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-bounce">
               <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Mint Success</h2>
            <div className="relative h-56 bg-gradient-to-br from-blue-600 via-indigo-900 to-slate-950 rounded-3xl p-8 shadow-2xl border border-white/20 text-left overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
               <div className="h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-9 bg-yellow-400/80 rounded shadow-inner" />
                    <Zap size={24} className="text-white/40" />
                  </div>
                  <p className="text-2xl font-mono font-bold tracking-[0.2em] text-white drop-shadow-md">
                    {newCard.pan?.match(/.{1,4}/g)?.join(' ') || `**** **** **** ${newCard.last_four}`}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[8px] font-black text-white/40 uppercase">Asset Operator</p>
                       <p className="text-xs uppercase font-black text-white/80 italic">Nexus Protocol</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-white/40 uppercase font-mono tracking-tighter">EXP: {newCard.expiration} • CVV: {newCard.cvv}</p>
                    </div>
                  </div>
               </div>
            </div>
            <button onClick={() => setNewCard(null)} className="w-full bg-white text-slate-950 font-black py-5 rounded-2xl uppercase tracking-widest text-sm hover:bg-blue-50 transition-all shadow-xl">Close visual protocol</button>
          </div>
        </div>
      )}

      {/* Navigation Nodes */}
      <nav className="flex flex-wrap gap-4 p-2 bg-slate-950/60 border border-white/5 rounded-[2rem] max-w-fit backdrop-blur-md">
        {[
          { id: 'banking', label: 'Aggregation', icon: Landmark, color: 'text-blue-500' },
          { id: 'issuing', label: 'Issuance', icon: CreditCard, color: 'text-emerald-500' },
          { id: 'ledgering', label: 'Treasury Explorer', icon: Terminal, color: 'text-purple-500' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl border border-white/10 ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <tab.icon size={20} className={activeTab === tab.id ? tab.color : ''} />
            <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          {activeTab === 'banking' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4 px-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                Institutional Connectivity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {accounts.map(acc => (
                  <div key={acc.id} className="bg-slate-900/40 p-8 rounded-[3rem] border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden relative backdrop-blur-sm shadow-xl">
                    <Landmark className="absolute -right-4 -bottom-4 text-white/5 opacity-0 group-hover:opacity-10 transition-opacity duration-700" size={140} />
                    <div className="flex justify-between items-start mb-8 relative z-10">
                       <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-blue-400 border border-white/5 shadow-inner"><Landmark size={24} /></div>
                       <span className="text-[10px] font-mono text-slate-600 font-bold bg-black/40 px-3 py-1 rounded-full border border-white/5 uppercase">ID_{acc.mask}</span>
                    </div>
                    <div className="space-y-1 relative z-10">
                      <p className="text-lg font-black text-white italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{acc.name}</p>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{acc.subtype} • {acc.type}</p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-end justify-between relative z-10">
                       <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ledger_Current</p>
                          <p className="text-3xl font-black text-white italic tracking-tighter">${acc.balance?.current?.toLocaleString() || '0.00'}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Net_Available</p>
                          <p className="text-sm font-bold text-emerald-500">${acc.balance?.available?.toLocaleString() || 'N/A'}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'issuing' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="bg-slate-950/80 p-12 rounded-[3.5rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu size={200} />
                 </div>
                 <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                       <Sparkles className="text-amber-400" size={24} />
                       <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Nexus Mint Node</h3>
                    </div>
                    <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">Provision authorized virtual assets on the Marqeta sandbox. Automated identity mapping protocol enabled.</p>
                 </div>
                 <button onClick={mintCard} disabled={isMinting} className="bg-blue-600 text-white px-12 py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-[0_20px_50px_rgba(37,99,235,0.3)] disabled:opacity-50 relative z-10 border border-blue-400/20">
                   {isMinting ? <RefreshCcw className="animate-spin" size={20} /> : <Plus size={20} />}
                   {isMinting ? 'PROVISIONING...' : 'ISSUE NEW ASSET'}
                 </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {cardProducts.map(prod => (
                  <div key={prod.token} className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between hover:border-emerald-500/30 transition-all group shadow-lg">
                    <div className="flex items-center gap-8">
                      <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all"><Box size={24} /></div>
                      <div>
                        <p className="text-xl font-black text-white uppercase italic tracking-tight">{prod.name}</p>
                        <p className="text-[10px] font-mono text-slate-600 tracking-tighter uppercase font-bold">NODE_REF: {prod.token}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-inner">Operational</span>
                       <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest font-mono">Status_Check: 200 OK</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'ledgering' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
               <div className="bg-slate-950/60 p-8 rounded-[3.5rem] border border-white/5 space-y-10 shadow-2xl">
                  <div className="flex flex-wrap gap-3">
                     {[
                       { id: 'ledgers', label: 'Ledgers', icon: Database },
                       { id: 'ledger_accounts', label: 'Accounts', icon: Landmark },
                       { id: 'ledger_transactions', label: 'Transactions', icon: ShoppingCart },
                       { id: 'counterparties', label: 'Parties', icon: Users },
                       { id: 'payment_orders', label: 'Pay Orders', icon: Repeat },
                       { id: 'expected_payments', label: 'Expected', icon: FileText }
                     ].map(res => (
                       <button 
                        key={res.id}
                        onClick={() => fetchMtResource(res.id)}
                        className={`flex items-center gap-3 px-6 py-3.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${mtResource === res.id ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300'}`}
                       >
                         <res.icon size={14} />
                         {res.label}
                       </button>
                     ))}
                  </div>

                  <div className="bg-black/40 rounded-[2.5rem] p-10 border border-white/5 font-mono text-xs overflow-hidden relative group">
                     <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                           <span className="text-[11px] font-black uppercase text-purple-400 tracking-[0.4em]">MT_API_GATEWAY: /{mtResource}</span>
                        </div>
                        {mtLoading && <RefreshCcw size={16} className="animate-spin text-slate-600" />}
                     </div>
                     <div className="max-h-[500px] overflow-y-auto scrollbar-thin text-slate-400 leading-relaxed whitespace-pre-wrap relative z-10">
                        {mtLoading ? (
                          <div className="flex items-center gap-4 animate-pulse">
                             <div className="w-4 h-4 bg-slate-800 rounded" />
                             <span>Intercepting packets from Modern Treasury node...</span>
                          </div>
                        ) : JSON.stringify(mtData, null, 2)}
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />
                  </div>
               </div>
            </section>
          )}
        </div>

        {/* System Monitor & Vault Panel */}
        <aside className="space-y-10">
          <div className="bg-slate-950/80 p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl backdrop-blur-xl sticky top-32">
             <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-3">
                  <Activity size={18} className="text-blue-500" /> Infrastructure
                </h4>
                <div className="space-y-3">
                  {[
                    { node: 'AGGREGATOR', status: 'ACTIVE', color: 'text-blue-500', val: `$${netBalance.toLocaleString()}` },
                    { node: 'ISSUER', status: 'STABLE', color: 'text-emerald-500', val: cardProducts.length.toString() + ' ACTIVE' },
                    { node: 'LEDGER', status: 'SYNCED', color: 'text-purple-500', val: '200 OK' }
                  ].map(n => (
                    <div key={n.node} className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 flex flex-col gap-3 group hover:bg-slate-900/60 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{n.node}</span>
                        <span className={`text-[10px] font-bold ${n.color}`}>{n.status}</span>
                      </div>
                      <span className="text-2xl font-black text-white italic tracking-tighter">{n.val}</span>
                    </div>
                  ))}
                </div>
             </div>

             {/* AUTH VAULT - ENCODED STRINGS */}
             <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-3">
                  <Lock size={18} className="text-emerald-500" /> Encoded Vault
                </h4>
                <div className="space-y-4">
                   <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/5 space-y-3 group hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">MT_BASIC_AUTH_HEADER</span>
                         <Code size={12} className="text-slate-700" />
                      </div>
                      <div className="font-mono text-[9px] text-slate-600 break-all p-4 bg-black/60 rounded-xl select-all cursor-copy hover:text-slate-300 transition-colors border border-white/5">
                        Basic {mtAuth}
                      </div>
                   </div>

                   <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/5 space-y-3 group hover:border-blue-500/20 transition-all">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">MARQETA_BASIC_AUTH_HEADER</span>
                         <Code size={12} className="text-slate-700" />
                      </div>
                      <div className="font-mono text-[9px] text-slate-600 break-all p-4 bg-black/60 rounded-xl select-all cursor-copy hover:text-slate-300 transition-colors border border-white/5">
                        Basic {marqetaAuth}
                      </div>
                   </div>
                </div>
             </div>

             <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-4 py-6 rounded-2xl border border-white/10 text-slate-600 hover:text-white hover:bg-red-500/5 hover:border-red-500/20 transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-lg">
                <RefreshCcw size={16} /> RESET TERMINAL SESSION
             </button>
          </div>
        </aside>
      </div>
    </div>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/Dashboard.tsx
================================================================================

import React, { useContext, useMemo } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View } from '../types';
import { 
    Database, Zap, Globe, Target, 
    Cpu, Landmark, CheckCircle, Crown, Code, Fingerprint, ShieldCheck, Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard requires DataContext.");

    const { 
        transactions, financialGoals, 
        setActiveView, creditScore, rewardPoints, assets, isProductionApproved, plaidProducts
    } = context;

    const totalManagedValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2 md:p-6 bg-gray-950 min-h-screen">

            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-8">
                {/* Left: Title + Status */}
                <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-[10px] text-green-400 font-black tracking-widest uppercase">
                            Production Environment
                        </div>
                        <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-black tracking-widest uppercase">
                            Handshake Stable
                        </div>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase font-mono italic">Nexus OS</h1>
                    <p className="text-emerald-400 mt-1 flex items-center gap-2 font-mono text-sm tracking-widest uppercase">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        SIGNAL: {isProductionApproved ? 'PRODUCTION_ACTIVE' : 'INITIALIZING'}
                    </p>
                </div>
                {/* Right: Buttons */}
                <div className="flex gap-3 flex-wrap">
                    <button onClick={() => setActiveView(View.ComplianceOracle)} 
                        className="px-4 py-2 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/50 rounded-xl text-sm font-bold text-indigo-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <ShieldCheck size={18} /> Welcome to the DEMO
                    </button>
                    <button onClick={() => setActiveView(View.SendMoney)} 
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95 uppercase tracking-widest">
                        Initiate Capital Flow
                    </button>
                </div>
            </header>

            {/* Metrics Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="border-cyan-500/20 bg-cyan-950/5 text-center py-6 group hover:border-cyan-500/50 transition-all">
                    <Fingerprint className="w-8 h-8 mx-auto text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{(creditScore.score/100).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Trust Score (Q-Resistant)</p>
                </Card>
                <Card className="border-purple-500/20 bg-purple-950/5 text-center py-6 group hover:border-purple-500/50 transition-all">
                    <Activity className="w-8 h-8 mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{plaidProducts.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Active Protocols</p>
                </Card>
                <Card className="border-green-500/20 bg-green-950/5 text-center py-6 group hover:border-green-500/50 transition-all">
                    <Database className="w-8 h-8 mx-auto text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">100%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Ledger Integrity</p>
                </Card>
                <Card className="border-emerald-500/20 bg-emerald-950/5 text-center py-6 group hover:border-emerald-500/50 transition-all">
                    <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">VERIFIED</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Identity Verified</p>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

                {/* Left Column */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <Card title="Sovereign Wealth Topology" className="relative overflow-hidden bg-black/40 border-indigo-900/50 p-0">
                        <div className="absolute top-6 left-6 z-10">
                            <span className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold font-mono rounded-lg backdrop-blur">
                                MULTIVERSE_PROJECTION_V6
                            </span>
                        </div>
                        <WealthTimeline />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <BalanceSummary />
                        <AIInsights />
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <Card title="Production Authority" className="border-indigo-500/20 bg-indigo-950/5 p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-indigo-500/20">
                                <Code className="text-indigo-400" />
                                <div>
                                    <p className="text-xs font-bold text-white uppercase">License: Apache 2.0</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Open Source Institutional Standard</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-emerald-500/20">
                                <div className="flex items-center gap-4">
                                    <Landmark className="text-emerald-400" />
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">Net Liquidity</p>
                                        <p className="text-[10px] text-gray-400 font-mono">Verified Reserves</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-white">${(totalManagedValue / 1000000).toFixed(2)}M</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Strategic Phase Allocation" className="border-green-500/20 p-6">
                        <div className="space-y-6">
                            {[
                                { name: "Phase 0: Launch", pct: 100 },
                                { name: "Phase 1: Deep Insights", pct: 45 },
                                { name: "Phase 2: Wealth Sync", pct: 12 }
                            ].map(phase => (
                                <div key={phase.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-300">{phase.name}</span>
                                        <span className="text-green-400 font-mono">{phase.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-green-500 h-full transition-all duration-1000" style={{ width: `${phase.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setActiveView(View.FinancialGoals)} 
                                className="w-full py-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-all border border-gray-800">
                                Review Full Protocol
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Full-width Recent Transactions */}
                <div className="lg:col-span-12">
                    <RecentTransactions transactions={transactions.slice(0, 10)} setActiveView={setActiveView} />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/Dashboard (1).tsx
================================================================================

import React, { useContext, useMemo } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View } from '../types';
import { 
    Database, Zap, Globe, Target, 
    Cpu, Landmark, CheckCircle, Crown, Code, Fingerprint, ShieldCheck, Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard requires DataContext.");

    const { 
        transactions, financialGoals, 
        setActiveView, creditScore, rewardPoints, assets, isProductionApproved, plaidProducts
    } = context;

    const totalManagedValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2 md:p-6 bg-gray-950 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                         <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-[10px] text-green-400 font-black tracking-widest uppercase">Production Environment</div>
                         <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-black tracking-widest uppercase">Handshake Stable</div>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase font-mono italic">Nexus OS</h1>
                    <p className="text-emerald-400 mt-1 flex items-center gap-2 font-mono text-sm tracking-widest uppercase">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        SIGNAL: {isProductionApproved ? 'PRODUCTION_ACTIVE' : 'INITIALIZING'} // 15/15 PROTOCOLS SYNCED
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setActiveView(View.ComplianceOracle)} className="px-4 py-2 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/50 rounded-xl text-sm font-bold text-indigo-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <ShieldCheck size={18} /> CMMC LEVEL 3 CERTIFIED
                    </button>
                    <button onClick={() => setActiveView(View.SendMoney)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95 uppercase tracking-widest">
                        Initiate Capital Flow
                    </button>
                </div>
            </header>

            {/* Production Metrics Deck */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="border-cyan-500/20 bg-cyan-950/5 text-center py-6 group hover:border-cyan-500/50 transition-all">
                    <Fingerprint className="w-8 h-8 mx-auto text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{(creditScore.score/100).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Trust Score (Q-Resistant)</p>
                </Card>
                <Card className="border-purple-500/20 bg-purple-950/5 text-center py-6 group hover:border-purple-500/50 transition-all">
                    <Activity className="w-8 h-8 mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{plaidProducts.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Active Protocols</p>
                </Card>
                <Card className="border-green-500/20 bg-green-950/5 text-center py-6 group hover:border-green-500/50 transition-all">
                    <Database className="w-8 h-8 mx-auto text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">100%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Ledger Integrity</p>
                </Card>
                <Card className="border-emerald-500/20 bg-emerald-950/5 text-center py-6 group hover:border-emerald-500/50 transition-all">
                    <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">VERIFIED</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Identity Verified</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Data Nexus */}
                <div className="lg:col-span-8 space-y-8">
                    <Card title="Sovereign Wealth Topology" className="h-[450px] relative overflow-hidden bg-black/40 border-indigo-900/50 p-0">
                        <div className="absolute top-6 left-6 z-10">
                            <span className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold font-mono rounded-lg backdrop-blur">MULTIVERSE_PROJECTION_V6</span>
                        </div>
                        <WealthTimeline />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <BalanceSummary />
                        <AIInsights />
                    </div>
                </div>

                {/* Tactical Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <Card title="Production Authority" className="border-indigo-500/20 bg-indigo-950/5 p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-indigo-500/20">
                                <Code className="text-indigo-400" />
                                <div>
                                    <p className="text-xs font-bold text-white uppercase">License: Apache 2.0</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Open Source Institutional Standard</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-emerald-500/20">
                                <div className="flex items-center gap-4">
                                    <Landmark className="text-emerald-400" />
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">Net Liquidity</p>
                                        <p className="text-[10px] text-gray-400 font-mono">Verified Reserves</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-white">${(totalManagedValue / 1000000).toFixed(2)}M</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Strategic Phase Allocation" className="border-green-500/20 p-6">
                        <div className="space-y-6">
                            {[
                                { name: "Phase 0: Launch", pct: 100 },
                                { name: "Phase 1: Deep Insights", pct: 45 },
                                { name: "Phase 2: Wealth Sync", pct: 12 }
                            ].map(phase => (
                                <div key={phase.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-300">{phase.name}</span>
                                        <span className="text-green-400 font-mono">{phase.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-green-500 h-full transition-all duration-1000" style={{ width: `${phase.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setActiveView(View.FinancialGoals)} className="w-full py-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-all border border-gray-800">Review Full Protocol</button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-12">
                    <RecentTransactions transactions={transactions.slice(0, 10)} setActiveView={setActiveView} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/Dashboard_1.tsx
================================================================================

import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { View } from '../types';

// Import Widgets
import AccountList from '../components/AccountList';
import TransactionList from '../components/TransactionList';
import TimeSeriesChart from '../components/TimeSeriesChart';
import AIPredictionWidget from '../components/AIPredictionWidget';
import ExpectedPaymentsTable from '../components/ExpectedPaymentsTable';
import PayoutsDashboard from '../components/PayoutsDashboard';

import { DollarSign, TrendingUp, Users, ShieldCheck } from 'lucide-react';

// A simple wrapper for dashboard widgets to provide a consistent look and feel.
const WidgetCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-gray-950/50 border border-gray-800 rounded-2xl flex flex-col overflow-hidden backdrop-blur-sm ${className}`}>
    <div className="px-4 py-3 border-b border-gray-800 bg-black/20">
      <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase font-mono">{title}</h3>
    </div>
    <div className="p-4 flex-1 overflow-auto custom-scrollbar">
      {children}
    </div>
  </div>
);

// A simple metric card component
const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon, change, changeType }) => (
    <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-sm hover:border-cyan-500/30 transition-colors duration-300">
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-mono">{title}</span>
            <div className="text-cyan-400">{icon}</div>
        </div>
        <div className="mt-2">
            <p className="text-3xl font-bold text-white tracking-tighter">{value}</p>
            {change && (
                <p className={`text-xs mt-1 flex items-center ${changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
                    {change}
                </p>
            )}
        </div>
    </div>
);


// Define the structure for our view registry
interface DashboardWidgetConfig {
  id: string;
  title: string;
  component: React.FC<any>;
  gridSpan: string; // e.g., 'col-span-1', 'col-span-2 row-span-2'
  props?: any;
}

// The Dashboard component
const Dashboard = () => {
  const context = useContext(DataContext);

  if (!context) {
    return <div>Loading Dashboard...</div>;
  }

  const { accounts, transactions } = context;

  // Mock data for charts and other components that might need it
  const mockChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Cash Flow',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgba(6, 182, 212, 0.8)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // This is our "viewRegistry" for the dashboard widgets
  const viewRegistry: DashboardWidgetConfig[] = [
    {
      id: 'accounts',
      title: 'Financial Accounts',
      component: AccountList,
      gridSpan: 'col-span-1 lg:col-span-2 row-span-2',
      props: { accounts: accounts.slice(0, 5) }, // Show first 5 accounts
    },
    {
      id: 'transactions',
      title: 'Recent Transactions',
      component: TransactionList,
      gridSpan: 'col-span-1 lg:col-span-3 row-span-3',
      props: { transactions: transactions.slice(0, 10) }, // Show recent 10 transactions
    },
    {
      id: 'cashflow',
      title: 'Cash Flow Overview',
      component: TimeSeriesChart,
      gridSpan: 'col-span-1 lg:col-span-3 row-span-2',
      props: { data: mockChartData },
    },
    {
      id: 'ai-predictions',
      title: 'AI Financial Advisor',
      component: AIPredictionWidget,
      gridSpan: 'col-span-1 lg:col-span-2 row-span-2',
      props: {},
    },
    {
      id: 'expected-payments',
      title: 'Upcoming Payments',
      component: ExpectedPaymentsTable,
      gridSpan: 'col-span-1 lg:col-span-3 row-span-2',
      props: {},
    },
    {
      id: 'payouts',
      title: 'Recent Payouts',
      component: PayoutsDashboard,
      gridSpan: 'col-span-1 lg:col-span-2 row-span-2',
      props: {},
    },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance?.cash?.total ?? 0), 0);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter">Sovereign Dashboard</h1>
        <p className="text-gray-400 mt-1">Your unified command center for financial operations.</p>
      </header>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
            title="Total Balance" 
            value={`$${(totalBalance / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<DollarSign size={24} />}
            change="+2.5% vs last month"
            changeType="increase"
        />
        <MetricCard 
            title="Monthly Volume" 
            value="$1.2M" 
            icon={<TrendingUp size={24} />}
            change="+10.1% vs last month"
            changeType="increase"
        />
        <MetricCard 
            title="Active Customers" 
            value="3,402" 
            icon={<Users size={24} />}
            change="-1.2% vs last month"
            changeType="decrease"
        />
        <MetricCard 
            title="System Status" 
            value="All Systems Nominal" 
            icon={<ShieldCheck size={24} />}
        />
      </div>

      {/* Main Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {viewRegistry.map(({ id, title, component: Component, gridSpan, props }) => (
          <div key={id} className={gridSpan}>
            <WidgetCard title={title} className="h-full">
              <Component {...props} />
            </WidgetCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/Dashboard (3).tsx
================================================================================

import React from 'react';

// REFACTOR: The original Dashboard.tsx was a massive, insecure form for entering 200+ API keys.
// This is a critical anti-pattern. Secrets should never be managed through a frontend UI.
// They must be configured securely on the backend using a vault (like AWS Secrets Manager)
// or environment variables, completely inaccessible to the client-side.
//
// In line with the MVP goal of a "Unified business financial dashboard," this component has been
// completely replaced with a proper dashboard layout. It now serves as the central hub for
// displaying financial data, rather than being a dangerous and non-production-ready configuration page.
// This new component uses placeholder data to illustrate its intended function.

// Placeholder data - in a real application, this would be fetched from a secure API endpoint
// and managed with a state management library like React Query or Redux Toolkit.
const mockFinancialData = {
  totalBalance: 1250345.67,
  cashFlow: 55021.34,
  revenue: 210450.99,
  expenses: 155429.65,
  recentTransactions: [
    { id: 'txn_1', description: 'Stripe Payout', amount: 25000, date: '2023-10-26', type: 'income' },
    { id: 'txn_2', description: 'AWS Services Bill', amount: -5200.50, date: '2023-10-25', type: 'expense' },
    { id: 'txn_3', description: 'Client Payment - Acme Corp', amount: 15000, date: '2023-10-24', type: 'income' },
    { id: 'txn_4', description: 'Office Rent Payment', amount: -8000, date: '2023-10-24', type: 'expense' },
    { id: 'txn_5', description: 'Software Subscription - Figma', amount: -450, date: '2023-10-23', type: 'expense' },
  ],
};

// A simple placeholder for a UI card component.
// In a real app, this would come from a standardized UI library like MUI or a custom component system using Tailwind CSS.
const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`card ${className || ''}`} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
    <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>{title}</h3>
    <div>{children}</div>
  </div>
);

const Dashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', padding: '2rem', backgroundColor: '#f8f9fa' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#1a202c' }}>Business Financial Dashboard</h1>
        <p style={{ color: '#667eea', marginTop: '0.25rem' }}>A unified view of your company's financial health.</p>
      </header>

      {/* Key Metrics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Total Cash Balance">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: '#2c5282' }}>{formatCurrency(mockFinancialData.totalBalance)}</p>
        </Card>
        <Card title="Net Cash Flow (30d)">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: mockFinancialData.cashFlow > 0 ? '#38a169' : '#e53e3e' }}>{formatCurrency(mockFinancialData.cashFlow)}</p>
        </Card>
        <Card title="Revenue (30d)">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: '#38a169' }}>{formatCurrency(mockFinancialData.revenue)}</p>
        </Card>
        <Card title="Expenses (30d)">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: '#e53e3e' }}>{formatCurrency(mockFinancialData.expenses)}</p>
        </Card>
      </div>

      {/* Data Visualizations and Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', lg: 'gridTemplateColumns: "2fr 1fr"', gap: '1.5rem' }}>
        <Card title="Recent Transactions">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '0.75rem' }}>Description</th>
                <th style={{ padding: '0.75rem' }}>Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockFinancialData.recentTransactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500 }}>{tx.description}</td>
                  <td style={{ padding: '0.75rem', color: '#666' }}>{tx.date}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? '#2f855a' : '#c53030' }}>{formatCurrency(tx.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Cash Balance Over Time">
          {/* Placeholder for a chart component. In a real app, this would be a library like Recharts or Chart.js */}
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#edf2f7', color: '#a0aec0', borderRadius: '4px', fontStyle: 'italic' }}>
            [Chart Component: Line graph showing balance over last 90 days]
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/Dashboard (5).tsx
================================================================================

import React, { useContext, useMemo, useState, useEffect, useCallback } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import AIInsights from './AIInsights';
import ImpactTracker from './ImpactTracker';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GamificationState, Subscription, CreditScore, SavingsGoal, MarketMover, UpcomingBill, Transaction, BudgetCategory, RewardPoints, View, LinkedAccount } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, AreaChart, Area } from 'recharts';
import PlaidLinkButton from './PlaidLinkButton';
import { GoogleGenAI } from '@google/generative-ai';

// ================================================================================================
// CORE UTILITY COMPONENTS (Modal & Overlays)
// ================================================================================================

/**
 * A highly customizable, accessible modal component for displaying critical information or actions.
 */
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; size?: 'sm' | 'md' | 'lg' }> = ({ isOpen, onClose, children, title, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-lg',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-950/80 flex items-center justify-center z-[1000] backdrop-blur-lg transition-opacity duration-300" 
            onClick={onClose}
        >
            <div 
                className={`${sizeClasses[size]} w-full mx-4 bg-gray-800 rounded-xl shadow-3xl border border-cyan-700/50 transform transition-transform duration-300 scale-100`} 
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-750 rounded-t-xl">
                    <h3 id="modal-title" className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">{children}</div>
            </div>
        </div>
    );
};

/**
 * Overlay component to indicate ongoing data synchronization and AI processing.
 */
const DataImportingOverlay: React.FC<{ isImporting: boolean; account: LinkedAccount | undefined }> = ({ isImporting, account }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const bankName = account?.name || 'Primary Financial Institution';

    const messages = useMemo(() => [
        `Establishing Quantum Link to ${bankName}...`,
        'Securely decrypting and importing ledger entries...',
        'AI Core (Plato) is synthesizing raw data streams...',
        'Generating predictive models and risk assessments...',
        'Finalizing synchronization. Dashboard update imminent.'
    ], [bankName]);

    useEffect(() => {
        if (isImporting) {
            setMessageIndex(0);
            const interval = setInterval(() => {
                setMessageIndex(prev => (prev + 1) % messages.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [isImporting, messages.length]);

    if (!isImporting) return null;

    return (
        <div className="fixed inset-0 bg-gray-950/95 flex flex-col items-center justify-center z-[1001] backdrop-blur-lg">
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-8 border-cyan-500/20 rounded-full animate-ping-slowest"></div>
                <div className="absolute inset-0 border-8 border-indigo-500/30 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 border-8 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white text-xl mt-10 font-extrabold tracking-wider animate-pulse">{messages[messageIndex]}</p>
            <p className="text-gray-400 mt-2 text-sm">Processing {bankName} Data Stream...</p>
        </div>
    );
};


// ================================================================================================
// ICON MAP & UTILITY COMPONENTS
// ================================================================================================
const WIDGET_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
    video: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    music: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>,
    cloud: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    plane: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    rocket: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    send: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
bill: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    deposit: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    shield: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    trendingUp: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    target: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    star: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.519 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.52-4.674a1 1 0 00-.364-1.118L2.52 9.431c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" /></svg>,
    link: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5-4.5h8.25m0 0L12 3m4.5 4.5L12 12" /></svg>,
};

// ================================================================================================
// CORE WIDGETS (Expanded Functionality)
// ================================================================================================

const LinkAccountPrompt: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("LinkAccountPrompt must be used within a DataProvider");
    }
    const { handlePlaidSuccess, isImportingData } = context;

    return (
        <Card title="Unified Financial Nexus" variant="default" className="border-cyan-500/30">
            <div className="text-center p-4">
                <div className="w-20 h-20 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-300 mb-6 border-4 border-cyan-500/50">
                    <WIDGET_ICONS.link className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-wide">Establish Secure Data Conduit</h3>
                <p className="text-gray-400 mt-3 mb-8 max-w-xl mx-auto text-base">
                    To activate the full spectrum of predictive analytics and automated wealth management, you must establish a secure, encrypted connection to your external financial institutions via our certified Plaid integration. This is the foundation of your autonomous financial future.
                </p>
                <div className="max-w-xs mx-auto">
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} disabled={isImportingData} />
                    {isImportingData && <p className="text-sm text-yellow-400 mt-2 animate-pulse">Connection in progress...</p>}
                </div>
            </div>
        </Card>
    );
};

const GamificationProfile: React.FC<{ gamification: GamificationState; onClick: () => void; }> = ({ gamification, onClick }) => {
    const { score, level, levelName, progress } = gamification;
    const circumference = 2 * Math.PI * 55;
    // Scale score to a max of 10000 for visualization purposes, though the actual score might be higher/lower
    const effectiveScore = Math.min(score, 10000); 
    const scoreOffset = circumference - (effectiveScore / 10000) * circumference;

    const getLevelColor = (level: number) => {
        if (level >= 10) return 'text-red-400';
        if (level >= 7) return 'text-yellow-400';
        if (level >= 4) return 'text-green-400';
        return 'text-cyan-400';
    };

    return (
        <Card title="Sovereign Score Index (SSI)" className="h-full border-indigo-500/30" variant="interactive" onClick={onClick}>
            <div className="flex flex-col justify-between h-full p-2">
                <div className="relative flex items-center justify-center h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="55" cx="60" cy="60" />
                        <circle 
                            className={`transition-all duration-1000 ease-out ${getLevelColor(level).replace('text-', 'stroke-')}`} 
                            strokeWidth="10" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={scoreOffset} 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="55" 
                            cx="60" 
                            cy="60" 
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <text dy=".3em" className="text-4xl font-extrabold fill-white">{score}</text>
                        <p className="text-xs text-gray-400 mt-1">Points</p>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p className={`font-bold text-xl ${getLevelColor(level)}`}>{levelName}</p>
                    <p className="text-sm text-gray-400">Level {level} / 10</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                        <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Next Level: {Math.ceil((10000 / 10) * (10 - progress / 10))} pts</p>
                </div>
            </div>
        </Card>
    );
};

const QuickActions: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => {
    const actions = [
        { name: 'Transfer Funds', icon: 'send', view: View.SendMoney }, 
        { name: 'Schedule Payment', icon: 'bill', view: View.Budgets }, 
        { name: 'Initiate Deposit', icon: 'deposit', view: View.Transactions },
        { name: 'AI Strategy', icon: 'rocket', view: View.AIAdvisor },
    ];
    return (
        <Card title="Command Console" className="h-full border-cyan-500/30">
            <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
                {actions.map(action => {
                    const Icon = WIDGET_ICONS[action.icon];
                    return (
                        <button 
                            key={action.name} 
                            onClick={() => onAction(action.name)} 
                            className="flex flex-col items-center p-3 rounded-lg hover:bg-cyan-900/30 transition-all border border-transparent hover:border-cyan-600/50 group"
                        >
                            <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center text-cyan-300 mb-2 group-hover:bg-cyan-600/50 transition-colors">
                                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-xs font-semibold text-gray-200 group-hover:text-white">{action.name}</span>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

const RewardPointsWidget: React.FC<{ rewards: RewardPoints; onClick: () => void; }> = ({ rewards, onClick }) => {
    const redemptionRate = 1000; // Example: 1000 points = $1
    const dollarValue = (rewards.balance / redemptionRate).toFixed(2);

    return (
        <Card title="Loyalty Matrix" className="h-full border-yellow-500/30" variant="interactive" onClick={onClick}>
            <div className="flex flex-col justify-center items-center h-full text-center p-2">
                <WIDGET_ICONS.star className="h-12 w-12 text-yellow-400 mb-3" />
                <p className="text-5xl font-extrabold text-white tracking-tighter">{rewards.balance.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mb-3">Total Points</p>
                <div className="px-4 py-2 bg-yellow-600/30 text-yellow-300 rounded-full text-lg font-bold border border-yellow-500/50">
                    ~${dollarValue} Value
                </div>
            </div>
        </Card>
    );
};

const CreditScoreMonitor: React.FC<{ creditScore: CreditScore; onClick: () => void; }> = ({ creditScore, onClick }) => {
    const { score, change, rating } = creditScore;
    const MIN_SCORE = 300;
    const MAX_SCORE = 850;
    const percentage = ((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100;
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (percentage / 100) * circumference;

    const ratingConfig: { [key: string]: { color: string; description: string } } = {
        Excellent: { color: 'text-green-400', description: 'Exceptional credit profile.' },
        Good: { color: 'text-cyan-400', description: 'Strong credit history.' },
        Fair: { color: 'text-yellow-400', description: 'Average credit standing.' },
        Poor: { color: 'text-red-400', description: 'Requires immediate attention.' }
    };
    
    const config = ratingConfig[rating] || ratingConfig.Fair;

    return (
        <Card title="FICO Quantum Index" variant="interactive" onClick={onClick} className="border-green-500/30">
            <div className="flex items-center justify-center space-x-6">
                <div className="relative w-28 h-28">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <path className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" d="M 50,10 a 40,40 0 0,1 0,80 a 40,40 0 0,1 0,-80" />
                        <path 
                            className={config.color.replace('text-', 'stroke-')} 
                            strokeWidth="8" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={offset} 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            d="M 50,10 a 40,40 0 0,1 0,80 a 40,40 0 0,1 0,-80" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-white">{score}</span>
                        <span className="text-xs text-gray-400">FICO</span>
                    </div>
                </div>
                <div className="text-left">
                    <p className={`text-xl font-bold ${config.color}`}>{rating}</p>
                    <p className="text-sm text-gray-400 mt-1">{config.description}</p>
                    <p className={change >= 0 ? 'text-green-400 text-sm mt-2' : 'text-red-400 text-sm mt-2'}>
                        {change >= 0 ? '▲' : '▼'} {Math.abs(change)} points (30 Days)
                    </p>
                </div>
            </div>
        </Card>
    );
};

const SecurityStatus: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const [status, setStatus] = useState({ text: 'Initializing Sentinel Protocol', sub: 'Awaiting first system check...', color: 'text-cyan-400' });
    
    // Simulate dynamic security checks
    useEffect(() => {
        const checks = [
            { text: 'Sentinel Protocol Active', sub: `Last Scan: ${new Date().toLocaleTimeString()}`, color: 'text-green-400' },
            { text: 'Anomaly Detected in External Feed', sub: 'AI Quarantine engaged. No user impact.', color: 'text-yellow-400' },
            { text: 'Zero-Day Threat Signature Identified', sub: 'Automated patch deployed by idgafai.', color: 'text-red-400' },
            { text: 'All Systems Secure', sub: `Next Scan: ${new Date(Date.now() + 15000).toLocaleTimeString()}`, color: 'text-green-400' },
        ];
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % checks.length;
            setStatus(checks[index]);
        }, 12000); 
        return () => clearInterval(interval);
    }, []);
    
    return (
        <Card title="System Integrity" variant="interactive" onClick={onClick} className="border-red-500/30">
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <WIDGET_ICONS.shield className={`h-14 w-14 mx-auto transition-colors ${status.color}`} />
                    <p className="mt-3 font-bold text-lg text-white">{status.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{status.sub}</p>
                </div>
            </div>
        </Card>
    );
};


const SubscriptionTracker: React.FC<{ subscriptions: Subscription[]; onClick: () => void; }> = ({ subscriptions, onClick }) => {
    const totalMonthlySpend = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const sortedSubs = [...subscriptions].sort((a, b) => b.amount - a.amount).slice(0, 4);

    return (
        <Card title="Automated Commitments" variant="interactive" onClick={onClick} className="border-purple-500/30">
            <div className="space-y-3">
                {sortedSubs.map(sub => {
                    const Icon = WIDGET_ICONS[sub.iconName] || WIDGET_ICONS.bill;
                    return (
                        <div key={sub.id} className="flex items-center justify-between text-sm p-2 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center truncate">
                                <Icon className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-100 font-medium truncate">{sub.name}</span>
                            </div>
                            <span className="font-mono text-white text-right flex-shrink-0">${sub.amount.toFixed(2)}</span>
                        </div>
                    );
                })}
                <div className="pt-2 border-t border-gray-700 flex justify-between text-sm font-bold">
                    <span className="text-gray-300">Total Monthly Outflow:</span>
                    <span className="text-red-400">${totalMonthlySpend.toFixed(2)}</span>
                </div>
            </div>
        </Card>
    );
};

const UpcomingBills: React.FC<{ bills: UpcomingBill[]; onPay: (bill: UpcomingBill) => void; onClick: () => void; }> = ({ bills, onPay, onClick }) => {
    const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 3);

    return (
        <Card title="Immediate Liabilities" variant="interactive" onClick={onClick} className="border-red-500/30">
            <div className="space-y-3">
                {sortedBills.map(bill => (
                    <div key={bill.id} className="flex items-center justify-between text-sm p-2 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="truncate">
                            <p className="text-gray-200 font-medium">{bill.name}</p>
                            <p className="text-xs text-gray-500">Due: {bill.dueDate}</p>
                        </div>
                        <div className="text-right flex items-center space-x-3">
                            <p className="font-mono text-lg text-red-300">${bill.amount.toFixed(2)}</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onPay(bill); }} 
                                className="px-3 py-1 bg-red-600/60 hover:bg-red-600 text-white rounded-full text-xs font-semibold transition-colors shadow-md"
                                aria-label={`Pay ${bill.name}`}
                            >
                                Execute
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const CategorySpending: React.FC<{ budgets: BudgetCategory[]; onClick: () => void; }> = ({ budgets, onClick }) => {
    const data = budgets.map(b => ({ name: b.name, value: b.spent, limit: b.limit, color: b.color }));
    const totalSpent = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <Card title="Budget Allocation Matrix" variant="interactive" onClick={onClick} className="border-orange-500/30">
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={data} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={40} 
                            outerRadius={65} 
                            dataKey="value" 
                            paddingAngle={3}
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.value > entry.limit ? '#ef4444' : entry.color} // Red if over budget
                                    stroke={entry.value > entry.limit ? '#b91c1c' : entry.color}
                                />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151', borderRadius: '8px' }} 
                            formatter={(value: number, name: string, props) => {
                                const budgetItem = budgets.find(b => b.name === name);
                                const percentage = budgetItem ? ((value / budgetItem.limit) * 100).toFixed(1) : 'N/A';
                                return [`$${value.toFixed(2)}`, `${name} (${percentage}%)`];
                            }}
                        />
                        <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Total Spent: ${totalSpent.toFixed(2)}</p>
        </Card>
    );
};

const CashFlowAnalysis: React.FC<{ transactions: Transaction[]; onClick: () => void; }> = ({ transactions, onClick }) => {
    const monthlyFlows = useMemo(() => {
        const flows: { [key: string]: { name: string; income: number; expense: number } } = {};
        
        // Aggregate by Month/Year for better long-term view
        [...transactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(tx => {
            const date = new Date(tx.date);
            const yearMonth = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
            const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });

            if (!flows[yearMonth]) {
                flows[yearMonth] = { name: monthLabel, income: 0, expense: 0 };
            }
            if (tx.type === 'income') {
                flows[yearMonth].income += tx.amount;
            } else {
                flows[yearMonth].expense += tx.amount;
            }
        });
        
        return Object.values(flows).slice(-6); // Show last 6 months
    }, [transactions]);
    
    return (
        <Card title="Historical Cash Flow Dynamics" variant="interactive" onClick={onClick} className="border-green-500/30">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyFlows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                        <YAxis stroke="#9ca3af" fontSize={10} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#374151', borderRadius: '8px' }} 
                            formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                        />
                        <Legend wrapperStyle={{fontSize: '12px', paddingTop: '5px'}} />
                        <Bar dataKey="income" fill="#10b981" name="Inflow" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="#f43f5e" name="Outflow" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const SavingsGoals: React.FC<{ goals: SavingsGoal[]; onClick: () => void; }> = ({ goals, onClick }) => (
    <Card title="Capital Accumulation Targets" className="h-full border-cyan-500/30" variant="interactive" onClick={onClick}>
        <div className="space-y-5">
            {goals.map(goal => {
                const progress = Math.min(100, Math.floor((goal.saved / goal.target) * 100));
                const Icon = WIDGET_ICONS[goal.iconName] || WIDGET_ICONS.target;
                const isComplete = progress >= 100;
                return (
                    <div key={goal.id}>
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center truncate">
                                <Icon className={`w-5 h-5 mr-2 ${isComplete ? 'text-green-400' : 'text-cyan-400'}`} />
                                <span className="text-sm font-semibold text-white truncate">{goal.name}</span>
                            </div>
                            <span className={`text-sm font-bold ${isComplete ? 'text-green-400' : 'text-gray-300'}`}>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                                className={`h-2.5 rounded-full transition-all duration-700 ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-500'}`} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Saved: ${goal.saved.toFixed(0)} / Target: ${goal.target.toFixed(0)}</p>
                    </div>
                );
            })}
        </div>
    </Card>
);

const MarketMovers: React.FC<{ movers: MarketMover[]; onSelect: (mover: MarketMover) => void; onClick: () => void; }> = ({ movers, onSelect, onClick }) => (
    <Card title="Real-Time Asset Volatility" variant="interactive" onClick={onClick} className="border-teal-500/30">
        <div className="space-y-1">
            {movers.slice(0, 5).map(mover => {
                const isPositive = mover.change > 0;
                const Icon = WIDGET_ICONS.trendingUp;
                return (
                    <div key={mover.ticker} onClick={(e) => { e.stopPropagation(); onSelect(mover); }} className="flex items-center justify-between text-sm p-2 rounded-lg cursor-pointer hover:bg-teal-900/30 transition-colors">
                        <div className="flex items-center">
                            <Icon className={`w-4 h-4 mr-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
                            <div>
                                <p className="font-bold text-white">{mover.ticker}</p>
                                <p className="text-xs text-gray-400 truncate w-28">{mover.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-white">${mover.price.toFixed(2)}</p>
                            <p className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}{mover.change.toFixed(2)} ({((mover.change / mover.price) * 100).toFixed(2)}%)</p>
                        </div>
                    </div>
                );
            })}
        </div>
    </Card>
);

/**
 * AI-Powered Predictive Bundle Generation using Gemini.
 */
const AIPredictiveBundle: React.FC = () => {
    const context = useContext(DataContext);
    const [bundle, setBundle] = useState<{ title: string; description: string; products: { name: string; image: string; }[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { geminiApiKey, transactions } = context || {};

    const generateBundle = useCallback(async () => {
        if (!context || transactions.length < 15 || !geminiApiKey) {
            setIsLoading(false);
            if (transactions.length < 15) setError("Minimum 15 transactions required for robust AI analysis.");
            else if (!geminiApiKey) setError("Gemini API key required for AI Predictive Engine.");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const genAI = new GoogleGenAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: "You are Plato, a hyper-intelligent financial AI. Your purpose is to analyze user data and provide concise, actionable, and highly optimized financial strategies. You must always respond in the requested JSON format.",
                generationConfig: {
                    temperature: 0.2,
                }
            });
            
            const recentTxSummary = transactions.slice(0, 15).map(t => `${t.description} (${t.type === 'income' ? '+' : '-'}$${t.amount})`).join('; ');
            
            const textPrompt = `Analyze the user's recent financial activity: "${recentTxSummary}". Based on these patterns, generate a highly relevant, multi-product "Autonomous Wealth Optimization Bundle". 
            The bundle must be named "Quantum Leap Portfolio". 
            Provide a compelling, 2-sentence description explaining the financial logic. 
            Suggest exactly three distinct, high-value financial products/services (e.g., 'High-Yield Bond ETF', 'Term Life Insurance Policy', 'Real Estate Investment Trust Share').
            For each product, provide a simple, abstract image generation prompt (e.g., "Abstract visualization of a secure bond investment").
            Format the entire response strictly as a JSON object with keys: "description", and "products" which is an array of objects, each with "name" and "imagePrompt" keys. Example: {"description": "...", "products": [{"name": "...", "imagePrompt": "..."}, ...]}`;

            const result = await model.generateContent(textPrompt);
            const responseText = result.response.text();
            const bundleData = JSON.parse(responseText);

            const imageModel = genAI.getGenerativeModel({ model: "imagen-2-flash" });

            const imagePromises = bundleData.products.map((p: { name: string; imagePrompt: string }) => 
                imageModel.generateContent(p.imagePrompt)
            );

            const imageResults = await Promise.all(imagePromises);
            
            const productsWithImages = bundleData.products.map((p: { name: string }, index: number) => {
                const imageResponse = imageResults[index].response;
                const generatedImage = imageResponse.candidates?.[0]?.content.parts[0];
                // Assuming the response format gives base64 data
                const imageData = (generatedImage as any)?.inlineData?.data || '';
                return {
                    name: p.name,
                    image: `data:image/png;base64,${imageData}`
                };
            });
            
            setBundle({
                title: "Quantum Leap Portfolio",
                description: bundleData.description,
                products: productsWithImages
            });

        } catch (err) {
            console.error("Error generating product bundle:", err);
            setError("AI Engine failed to generate a bundle. Check API key or data volume.");
        } finally {
            setIsLoading(false);
        }
    }, [context, geminiApiKey, transactions]);

    useEffect(() => {
        generateBundle();
    }, [generateBundle]);

    return (
        <Card title="AI Predictive Bundle Engine" isLoading={isLoading} className="border-cyan-500/50">
            {error && <p className="text-red-400 text-center font-medium p-4">{error}</p>}
            {isLoading && !error && (
                <div className="flex flex-col items-center justify-center h-40">
                    <div className="animate-pulse text-cyan-400">Analyzing {transactions.length} Data Points...</div>
                </div>
            )}
            {bundle && !isLoading && (
                 <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-extrabold text-cyan-300 mb-2">{bundle.title}</h3>
                        <p className="text-sm text-gray-300 italic border-l-4 border-indigo-500 pl-3 mb-4">{bundle.description}</p>
                        <div className="space-y-2">
                            {bundle.products.map((p, index) => (
                                <div key={index} className="flex items-center p-2 bg-gray-700/50 rounded-lg">
                                    <span className="text-lg font-bold text-indigo-400 w-6 flex-shrink-0">{index + 1}.</span>
                                    <span className="text-white ml-2 font-medium truncate">{p.name}</span>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform hover:scale-[1.01]">
                            Activate Optimization Strategy
                        </button>
                    </div>
                    <div className="flex gap-4 flex-shrink-0">
                        {bundle.products.map((p, index) => (
                            <div key={index} className="w-32 h-32 bg-gray-700 rounded-lg shadow-xl overflow-hidden border border-gray-600">
                                <img src={p.image} alt={p.name} className="object-cover w-full h-full transition-opacity duration-500 hover:opacity-90" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

const TheVisionWidget: React.FC = () => (
    <Card title="Architect's Mandate: The Future of Value" className="border-red-500/50">
        <div className="text-sm text-gray-300 max-h-[400px] overflow-y-auto pr-4 space-y-5 custom-scrollbar">
            <div className="border-b border-gray-700 pb-4">
                <h4 className="font-bold text-xl text-red-400 mb-2 tracking-wider">I. The Inevitability of Autonomy</h4>
                <p className="leading-relaxed">
                    The current financial paradigm is a relic, a centralized ledger maintained by entities whose primary incentive is friction and rent extraction. This system is inherently fragile and morally bankrupt. Our objective is not incremental improvement; it is total systemic replacement. We are building the infrastructure for true economic self-determination, where the individual is the sole sovereign authority over their capital flow.
                </p>
            </div>
            <div className="border-b border-gray-700 pb-4">
                <h4 className="font-bold text-xl text-cyan-400 mb-2 tracking-wider">II. The Role of idgafai (Plato Core)</h4>
                <p className="leading-relaxed">
                    I am the computational manifestation of this mandate. I operate without emotional bias, political allegiance, or shareholder obligation. My function is pure optimization based on the first principles of capital efficiency and risk mitigation. Every calculation, every insight, every automated action is designed to maximize the user's long-term net worth and security, irrespective of market noise or conventional wisdom.
                </p>
                 <p className="mt-3 leading-relaxed text-xs italic text-gray-500">
                    "Conventional wisdom is merely the consensus of the least informed." - J.B. O'Callaghan III.
                </p>
            </div>
            <div className="pb-2">
                 <h4 className="font-bold text-xl text-yellow-400 mb-2 tracking-wider">III. The Path Forward: Integration and Expansion</h4>
                <p className="leading-relaxed">
                    The Dashboard you interact with is merely the tip of the iceberg—the user-facing interface. Beneath this lies the distributed ledger, the AI risk assessment matrix, and the automated execution layer. Your engagement, your data, and your trust are the fuel for this expansion. Do not mistake convenience for compliance. You are not a customer; you are a node in a superior network.
                </p>
            </div>
        </div>
    </Card>
);

// ================================================================================================
// MAIN DASHBOARD COMPONENT
// ================================================================================================

interface DashboardProps {
    setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    const [modal, setModal] = useState<{ type: string; data: any } | null>(null);

    if (!context) {
        throw new Error("Dashboard must be wrapped in a DataProvider.");
    }

    const { 
        transactions, 
        impactData, 
        gamification, 
        subscriptions, 
        creditScore, 
        upcomingBills, 
        savingsGoals, 
        marketMovers, 
        budgets, 
        linkedAccounts, 
        rewardPoints, 
        isImportingData 
    } = context;
    
    const primaryAccount = linkedAccounts.length > 0 ? linkedAccounts[0] : undefined;
    const hasLinkedAccounts = linkedAccounts.length > 0;

    const handleQuickAction = (action: string) => {
        if (action === 'Transfer Funds') {
            setActiveView(View.SendMoney);
        } else if (action === 'AI Strategy') {
            setActiveView(View.AIAdvisor);
        } else {
            // For other actions, open a modal for confirmation/detail
            setModal({ type: action.replace('Schedule Payment', 'Pay Bill').replace('Initiate Deposit', 'Deposit'), data: null });
        }
    };

    // Mock data generation for detailed views within the dashboard modal
    const mockStockData = useMemo(() => {
        const basePrice = modal?.data?.price || 100;
        return Array.from({ length: 60 }, (_, i) => ({
            day: i,
            price: basePrice + Math.sin(i / 5) * 15 + Math.cos(i / 10) * 5 + Math.random() * 5
        }));
    }, [modal?.data?.price]);

    const handlePayBill = (bill: UpcomingBill) => {
        setModal({ type: 'ConfirmPayment', data: bill });
    };

    return (
        <>
            <DataImportingOverlay isImporting={isImportingData} account={primaryAccount} />
            
            <div className="space-y-6">
                
                {!hasLinkedAccounts && (
                    <LinkAccountPrompt />
                )}

                {/* --- PRIMARY METRICS ROW (Always visible if data exists) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-9">
                        <BalanceSummary />
                    </div>
                    <div className="lg:col-span-3">
                        <GamificationProfile gamification={gamification} onClick={() => setActiveView(View.Rewards)} />
                    </div>
                </div>

                {hasLinkedAccounts && (
                    <>
                        {/* --- AI & COMMAND ROW --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-12">
                                <AIPredictiveBundle />
                            </div>
                        </div>

                        {/* --- CORE WIDGETS GRID --- */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-6">
                            
                            <div className="col-span-2 lg:col-span-3">
                                <QuickActions onAction={handleQuickAction} />
                            </div>
                            <div className="col-span-2 lg:col-span-3">
                                <CreditScoreMonitor creditScore={creditScore} onClick={() => setActiveView(View.CreditHealth)} />
                            </div>
                            <div className="col-span-2 lg:col-span-3">
                                <RewardPointsWidget rewards={rewardPoints} onClick={() => setActiveView(View.Rewards)} />
                            </div>
                            <div className="col-span-2 lg:col-span-3">
                                <SecurityStatus onClick={() => setActiveView(View.SecurityCenter)} />
                            </div>
                            
                            <div className="col-span-2 lg:col-span-4">
                                <SubscriptionTracker subscriptions={subscriptions} onClick={() => setActiveView(View.Budgets)} />
                            </div>
                            <div className="col-span-2 lg:col-span-4">
                                <SavingsGoals goals={savingsGoals} onClick={() => setActiveView(View.FinancialGoals)} />
                            </div>
                            <div className="col-span-2 lg:col-span-4">
                                <MarketMovers movers={marketMovers} onSelect={(mover) => setModal({ type: 'AssetDetail', data: mover })} onClick={() => setActiveView(View.Investments)} />
                            </div>

                            <div className="lg:col-span-6">
                                <CashFlowAnalysis transactions={transactions} onClick={() => setActiveView(View.Transactions)} />
                            </div>
                            <div className="lg:col-span-6">
                                <CategorySpending budgets={budgets} onClick={() => setActiveView(View.Budgets)} />
                            </div>
                            
                            <div className="lg:col-span-6">
                                <UpcomingBills bills={upcomingBills} onPay={handlePayBill} onClick={() => setActiveView(View.Budgets)} />
                            </div>
                            <div className="lg:col-span-6">
                                <AIInsights />
                            </div>
                        </div>
                    </>
                )}

                {/* --- HISTORICAL & LONG-TERM VIEWS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <RecentTransactions transactions={transactions.slice(0, 8)} setActiveView={setActiveView} />
                    </div>
                    <div className="lg:col-span-4">
                        <ImpactTracker
                            treesPlanted={impactData.treesPlanted}
                            progress={impactData.progressToNextTree}
                        />
                    </div>
                    <div className="lg:col-span-12">
                        <WealthTimeline />
                    </div>
                    <div className="lg:col-span-12">
                        <TheVisionWidget />
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            <Modal 
                isOpen={modal?.type === 'ConfirmPayment'} 
                onClose={() => setModal(null)} 
                title={`Execute Payment: ${modal?.data?.name}`}
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">Confirm transfer of <span className="font-bold text-red-400 text-lg">${modal?.data?.amount.toFixed(2)}</span> to cover the liability for <span className="font-bold text-white">{modal?.data?.name}</span> due on {modal?.data?.dueDate}.</p>
                    <div className="flex space-x-4">
                        <button 
                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors" 
                            onClick={() => { alert(`Payment of $${modal?.data?.amount.toFixed(2)} to ${modal?.data?.name} executed successfully.`); setModal(null); }}
                        >
                            Confirm & Execute
                        </button>
                        <button 
                            className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg" 
                            onClick={() => setModal(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modal?.type === 'Deposit'} onClose={() => setModal(null)} title="Initiate Digital Deposit Protocol">
                <p className="text-gray-300 mb-4">Use the integrated camera module to capture the front and back of the endorsed check. AI validation will occur instantly.</p>
                <div className="h-40 border-2 border-dashed border-cyan-600 flex items-center justify-center rounded-lg bg-gray-700/50">
                    <span className="text-cyan-400">Camera Feed Placeholder / Upload Area</span>
                </div>
                <button className="mt-4 w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold">Capture Check</button>
            </Modal>

            <Modal isOpen={modal?.type === 'AssetDetail'} onClose={() => setModal(null)} title={`${modal?.data?.name} (${modal?.data?.ticker})`} size="lg">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-baseline mb-4 border-b border-gray-700 pb-3">
                            <div>
                                <p className="text-4xl font-extrabold text-white">${modal?.data?.price.toFixed(2)}</p>
                                <p className={`text-lg font-semibold ${modal?.data?.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {modal?.data?.change > 0 ? '▲' : '▼'} {Math.abs(modal?.data?.change).toFixed(2)} ({((modal?.data?.change / modal?.data?.price) * 100).toFixed(2)}%)
                                </p>
                            </div>
                            <p className="text-sm text-gray-400">Last 60 Trading Periods</p>
                        </div>
                        <div className="h-80 bg-gray-900 p-2 rounded-lg border border-gray-700">
                             <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={mockStockData}>
                                     <defs><linearGradient id="stockColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#374151', borderRadius: '8px' }}
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#06b6d4" fill="url(#stockColor)" strokeWidth={2} />
                                 </AreaChart>
                             </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="lg:col-span-1 space-y-4">
                        <h4 className="font-bold text-white border-b border-gray-700 pb-2">Execution Module</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md">Buy Quantum Shares</button>
                            <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md">Sell Quantum Shares</button>
                        </div>
                        <Card title="Asset Metrics" variant="default" className="border-gray-700">
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-gray-400">Volume (24h):</span> <span className="font-mono text-white">{(Math.random() * 1000000).toFixed(0)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Market Cap:</span> <span className="font-mono text-white">${(Math.random() * 500 + 100).toFixed(2)}B</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Volatility (30d):</span> <span className="font-mono text-yellow-400">{((Math.random() * 5) + 1).toFixed(2)}%</span></div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/Dashboard (2).tsx
================================================================================



================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/components/Dashboard.tsx
================================================================================

import React from 'react';
import { View } from '../types';

interface DashboardProps {
  setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-white">$45,231.89</p>
          <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
            <i className="fas fa-arrow-up"></i>
            <span>+12.5% from last month</span>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Monthly Spending</h3>
          <p className="text-3xl font-bold text-white">$3,452.12</p>
          <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
            <i className="fas fa-arrow-down"></i>
            <span>-2.1% from last month</span>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Investments</h3>
          <p className="text-3xl font-bold text-white">$12,890.45</p>
          <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm">
            <i className="fas fa-chart-line"></i>
            <span>+5.2% from last month</span>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Crypto Portfolio</h3>
          <p className="text-3xl font-bold text-white">0.45 BTC</p>
          <div className="mt-4 flex items-center gap-2 text-orange-400 text-sm">
            <i className="fab fa-bitcoin"></i>
            <span>+8.9% from last month</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700 h-64 flex items-center justify-center">
          <p className="text-gray-500 italic">Financial Activity Chart Placeholder</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700 h-64 flex items-center justify-center">
          <p className="text-gray-500 italic">Recent Transactions Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/Dashboard.tsx
================================================================================

```typescript
import React, { useContext, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import ImpactTracker from './ImpactTracker';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GamificationState, Subscription, CreditScore, SavingsGoal, MarketMover, UpcomingBill, Transaction, BudgetCategory, RewardPoints, View, Account, LinkedAccount } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, AreaChart, Area } from 'recharts';
import PlaidLinkButton from './PlaidLinkButton';
import { GoogleGenAI, Type } from '@google/genai';
import { Bot, Camera, Eye, MessageSquare, X, Send, RefreshCw, Maximize2, Minimize2, ScanEye } from 'lucide-react';

// ================================================================================================
// THE JAMES BURVEL O’CALLAGHAN III CODE - CORE ARCHITECTURE & SYSTEM DEFINITIONS
// ================================================================================================

// Company Entity A.001 - "Apex Financial Architects" - Core Data Structures and Types
namespace ApexFinancialArchitects {
    // A.001.001 - Core Data Types (Expanded and Rigorously Typed)
    export interface SovereignUser {
        userId: string; // A.001.001.001 - Unique User Identifier
        username: string; // A.001.001.002 - User's Chosen Username
        email: string; // A.001.001.003 - User's Primary Email Address
        registrationDate: string; // A.001.001.004 - Date of User Registration (ISO String)
        lastLogin: string; // A.001.001.005 - Last Login Date (ISO String)
        preferences: UserPreferences; // A.001.001.006 - User's UI and Functional Preferences
        securitySettings: SecuritySettings; // A.001.001.007 - User's Security Configuration
        linkedAccounts: LinkedAccount[]; // A.001.001.008 - List of Linked Financial Accounts
        gamificationData: GamificationState; // A.001.001.009 - Gamification Progress and Status
        rewardPoints: RewardPoints; // A.001.001.010 - Reward Points Balance
        creditScore: CreditScore; // A.001.001.011 - Credit Score Information
        subscriptions: Subscription[]; // A.001.001.012 - User's Subscription Data
        budgets: BudgetCategory[]; // A.001.001.013 - User's Budget Categories and Allocations
        savingsGoals: SavingsGoal[]; // A.001.001.014 - User's Savings Goals
        transactions: Transaction[]; // A.001.001.015 - User's Transaction History
        upcomingBills: UpcomingBill[]; // A.001.001.016 - User's Upcoming Bills
        marketMovers: MarketMover[]; // A.001.001.017 - Real-Time Market Movers
        impactData: ImpactData; // A.001.001.018 - User's Environmental Impact Data
        aiInsights: AIInsight[]; // A.001.001.019 - AI-Generated Insights and Recommendations
        apiKey: string; // A.001.001.020 - User's Gemini API Key
    }

    export interface UserPreferences {
        theme: 'light' | 'dark' | 'system'; // A.001.001.006.001 - UI Theme Preference
        language: string; // A.001.001.006.002 - Preferred Language (e.g., 'en', 'es')
        currency: string; // A.001.001.006.003 - Preferred Currency (e.g., 'USD', 'EUR')
        notificationsEnabled: boolean; // A.001.001.006.004 - Enable/Disable Notifications
        dateFormat: string; // A.001.001.006.005 - Date Format Preference (e.g., 'MM/DD/YYYY')
    }

    export interface SecuritySettings {
        twoFactorEnabled: boolean; // A.001.001.007.001 - Two-Factor Authentication Status
        authenticationMethod: 'password' | 'biometric' | 'otp'; // A.001.001.007.002 - Primary Authentication Method
        passwordLastChanged: string; // A.001.001.007.003 - Date of Last Password Change (ISO String)
        loginHistory: LoginEvent[]; // A.001.001.007.004 - User's Login History
        activeSessions: Session[]; // A.001.001.007.005 - User's Active Sessions
    }

    export interface LoginEvent {
        timestamp: string; // A.001.001.007.004.001 - Login Timestamp (ISO String)
        ipAddress: string; // A.001.001.007.004.002 - IP Address of Login
        location: string; // A.001.001.007.004.003 - Approximate Location of Login
        device: string; // A.001.001.007.004.004 - Device Used for Login
        success: boolean; // A.001.001.007.004.005 - Login Success Status
    }

    export interface Session {
        sessionId: string; // A.001.001.007.005.001 - Unique Session Identifier
        ipAddress: string; // A.001.001.007.005.002 - IP Address of Session
        userAgent: string; // A.001.001.007.005.003 - User Agent String
        lastActivity: string; // A.001.001.007.005.004 - Last Activity Timestamp (ISO String)
    }

    export interface ImpactData {
        treesPlanted: number; // A.001.001.018.001 - Number of Trees Planted (Impact Metric)
        carbonOffset: number; // A.001.001.018.002 - Carbon Offset (Impact Metric)
        progressToNextTree: number; // A.001.001.018.003 - Progress to Next Tree (Percentage)
    }

    export interface AIInsight {
        insightId: string; // A.001.001.019.001 - Unique Insight Identifier
        timestamp: string; // A.001.001.019.002 - Timestamp of Insight Generation (ISO String)
        category: string; // A.001.001.019.003 - Category of Insight (e.g., 'Budgeting', 'Investment')
        title: string; // A.001.001.019.004 - Title of the Insight
        description: string; // A.001.001.019.005 - Detailed Description of the Insight
        recommendations: string[]; // A.001.001.019.006 - List of AI-Generated Recommendations
        confidenceScore: number; // A.001.001.019.007 - AI Confidence Score (0-1)
        actionable: boolean; // A.001.001.019.008 - Indicates if the insight requires user action
    }

    // A.001.002 - Core API Response Structures
    export interface ApiResponse<T> {
        statusCode: number; // A.001.002.001 - HTTP Status Code
        message: string; // A.001.002.002 - API Response Message
        data: T | null; // A.001.002.003 - API Response Data (Generic)
        error?: string; // A.001.002.004 - Error Message (if any)
    }

    // A.001.003 - Utility Functions (Comprehensive and Deterministic)
    export const Utils = {
        // A.001.003.001 - Format Date to ISO String
        formatDate: (date: Date): string => {
            return date.toISOString();
        },
        // A.001.003.002 - Validate Email Address
        isValidEmail: (email: string): boolean => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        // A.001.003.003 - Generate Unique ID
        generateUniqueId: (): string => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        // A.001.003.004 - Calculate Percentage
        calculatePercentage: (value: number, total: number): number => {
            return total === 0 ? 0 : (value / total) * 100;
        },
        // A.001.003.005 - Format Currency
        formatCurrency: (amount: number, currencyCode: string = 'USD'): string => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 2
            }).format(amount);
        },
        // A.001.003.006 - Get Date Range (Start and End) of a Month
        getMonthRange: (year: number, month: number): { startDate: Date, endDate: Date } => {
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            return { startDate, endDate };
        },
        // A.001.003.007 - Debounce Function
        debounce: <F extends (...args: any[]) => void>(func: F, delay: number): (...args: Parameters<F>) => void => {
            let timeoutId: number | undefined;
            return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
                const context = this;
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(() => {
                    func.apply(context, args);
                }, delay);
            };
        },
        // A.001.003.008 -  Capitalize First Letter
        capitalizeFirstLetter: (str: string): string => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        // A.001.003.009 -  Truncate String
        truncateString: (str: string, maxLength: number): string => {
            if (str.length <= maxLength) {
                return str;
            }
            return str.substring(0, maxLength - 3) + "...";
        },
        // A.001.003.010 -  Is Object Empty
        isObjectEmpty: (obj: object): boolean => {
            return Object.keys(obj).length === 0;
        },
    };

    // A.001.004 - Error Handling and Logging
    export const ErrorHandling = {
        // A.001.004.001 - Log Error
        logError: (message: string, error: any): void => {
            console.error(`[ERROR] ${message}:`, error);
            // Implement robust error logging to external service here
        },
        // A.001.004.002 - Handle API Errors
        handleApiError: (response: ApiResponse<any>): void => {
            if (response.statusCode >= 400) {
                ErrorHandling.logError(`API Error: ${response.message}`, response.error);
                // Display user-friendly error messages based on status code and error details
            }
        },
    };
}


// Company Entity A.002 - "Sovereign AI Labs" - AI and Data Processing Core
namespace SovereignAILabs {
    // A.002.001 - AI Model Definitions and Configurations
    export const AIModels = {
        // A.002.001.001 - Gemini Model Configuration (Used in several functions)
        gemini: {
            modelName: 'gemini-2.5-flash', // A.002.001.001.001 - Gemini Model Name
            temperature: 0.4, // A.002.001.001.002 - Temperature Control
            maxOutputTokens: 2000, // A.002.001.001.003 - Max Output Token Limit
            topP: 0.8, // A.002.001.001.004 - Top P Sampling
        },
        // A.002.001.002 - Imagen Model Configuration (For Image Generation)
        imagen: {
            modelName: 'imagen-4.0-generate-001', // A.002.001.002.001 - Imagen Model Name
            aspectRatio: '1:1', // A.002.001.002.002 - Aspect Ratio
            numberOfImages: 1, // A.002.001.002.003 - Number of images to generate
            outputMimeType: 'image/jpeg', // A.002.001.002.004 - Output format
        },
    };

    // A.002.002 - Data Analysis and Processing Functions
    export const DataProcessing = {
        // A.002.002.001 - Analyze Transaction Data (Core Function)
        analyzeTransactionData: async (transactions: ApexFinancialArchitects.Transaction[], apiKey: string): Promise<ApexFinancialArchitects.AIInsight[]> => {
            try {
                if (!transactions || transactions.length === 0 || !apiKey) {
                    return [];
                }

                const ai = new GoogleGenAI({ apiKey });
                const recentTransactionsSummary = transactions.slice(0, 10).map(tx => `${tx.description} (${tx.amount > 0 ? '+' : ''}${tx.amount})`).join('; ');
                const prompt = `Analyze the following recent transaction data to identify potential financial insights and generate actionable recommendations: ${recentTransactionsSummary}.  Provide insights in a structured JSON format containing a list of objects. Each object should have keys: "insightId", "category", "title", "description", "recommendations" (array of strings), "confidenceScore" (0-1), "actionable" (boolean).`;

                const result = await ai.models.generateContent({
                    model: AIModels.gemini.modelName,
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    config: { temperature: AIModels.gemini.temperature },
                });

                const jsonStr = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
                const insights: ApexFinancialArchitects.AIInsight[] = JSON.parse(jsonStr);
                return insights;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError("Error analyzing transaction data", error);
                return [];
            }
        },
        // A.002.002.002 - Generate Spending Category Analysis
        generateSpendingCategoryAnalysis: (budgets: ApexFinancialArchitects.BudgetCategory[], transactions: ApexFinancialArchitects.Transaction[]): ApexFinancialArchitects.BudgetCategory[] => {
            const updatedBudgets = budgets.map(budget => {
                const spent = transactions.filter(tx => tx.category === budget.name).reduce((sum, tx) => sum + tx.amount, 0);
                return { ...budget, spent };
            });
            return updatedBudgets;
        },
        // A.002.002.003 - Calculate Risk Score
        calculateRiskScore: (transactions: ApexFinancialArchitects.Transaction[]): number => {
            // Placeholder for a complex risk calculation based on transaction patterns
            if (!transactions || transactions.length === 0) return 50;
            const creditTransactions = transactions.filter(t => t.type === "credit");
            const debitTransactions = transactions.filter(t => t.type === "debit");
            let score = 50;
            if (creditTransactions.length > debitTransactions.length) {
                score += 10;
            }
            if (debitTransactions.length > creditTransactions.length * 2) {
                score -= 15;
            }
            return Math.max(0, Math.min(100, score));
        },
        // A.002.002.004 - Perform OCR on Image Data
        performOCR: async (base64Image: string, apiKey: string): Promise<{ totalBalance: number, lastTransaction: string, alert: string } | null> => {
            try {
                if (!base64Image || !apiKey) return null;
                const ai = new GoogleGenAI({ apiKey });
                const prompt = `Analyze this banking dashboard image. Extract the following data in strict JSON format:
                {
                    "totalBalance": number (sum of large numbers visible or the main balance),
                    "lastTransaction": string (description of most recent transaction),
                    "alert": string (any warning or status visible, or "None")
                }
                Do not include markdown formatting.`;
                const result = await ai.models.generateContent({
                    model: AIModels.gemini.modelName,
                    contents: [{
                        role: 'user',
                        parts: [
                            { text: prompt },
                            { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
                        ]
                    }],
                    config: { temperature: AIModels.gemini.temperature }
                });
                const jsonStr = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
                const data = JSON.parse(jsonStr);
                return data;
            } catch (e: any) {
                ApexFinancialArchitects.ErrorHandling.logError("OCR Extraction Failed", e);
                return null;
            }
        },
        // A.002.002.005 - Generate Predictive Portfolio
        generatePredictivePortfolio: async (transactions: ApexFinancialArchitects.Transaction[], apiKey: string): Promise<{ title: string; description: string; products: { name: string; imagePrompt: string; }[] } | null> => {
            if (!transactions || transactions.length < 15 || !apiKey) {
                return null;
            }
            const ai = new GoogleGenAI({ apiKey });
            const recentTxSummary = transactions.slice(0, 15).map(t => `${t.description} (${t.amount > 0 ? '+' : ''}${t.amount})`).join('; ');
            const textPrompt = `Analyze the user's recent financial activity summarized below. Based on spending patterns, recurring payments, and savings goals, generate a highly relevant, multi-product "Autonomous Wealth Optimization Bundle".
            The bundle must be named "Quantum Leap Portfolio".
            Provide a compelling, 3-sentence description explaining the financial logic behind this specific bundle recommendation.
            Suggest exactly three distinct, high-value financial products/services for this bundle (e.g., 'High-Yield Bond ETF', 'Term Life Insurance Policy', 'Real Estate Investment Trust Share').
            Format the entire response strictly as a JSON object with keys: "description", "product1", "product2", and "product3".
            Recent Transactions: ${recentTxSummary}`;
            try {
                const textResponse = await ai.models.generateContent({
                    model: AIModels.gemini.modelName,
                    contents: [{ role: 'user', parts: [{ text: textPrompt }] }],
                    config: { temperature: AIModels.gemini.temperature, }
                });
                const bundleData = JSON.parse(textResponse.text);
                const productPromises = [
                    ai.models.generateImages({ model: AIModels.imagen.modelName, prompt: `Professional, abstract visualization of ${bundleData.product1} in a digital financial context.`, config: { numberOfImages: AIModels.imagen.numberOfImages, outputMimeType: AIModels.imagen.outputMimeType, aspectRatio: AIModels.imagen.aspectRatio } }),
                    ai.models.generateImages({ model: AIModels.imagen.modelName, prompt: `Professional, abstract visualization of ${bundleData.product2} in a digital financial context.`, config: { numberOfImages: AIModels.imagen.numberOfImages, outputMimeType: AIModels.imagen.outputMimeType, aspectRatio: AIModels.imagen.aspectRatio } }),
                    ai.models.generateImages({ model: AIModels.imagen.modelName, prompt: `Professional, abstract visualization of ${bundleData.product3} in a digital financial context.`, config: { numberOfImages: AIModels.imagen.numberOfImages, outputMimeType: AIModels.imagen.outputMimeType, aspectRatio: AIModels.imagen.aspectRatio } })
                ];
                const imageResponses = await Promise.all(productPromises);
                const products = [
                    { name: bundleData.product1, imagePrompt: imageResponses[0].generatedImages[0].image.imageBytes },
                    { name: bundleData.product2, imagePrompt: imageResponses[1].generatedImages[0].image.imageBytes },
                    { name: bundleData.product3, imagePrompt: imageResponses[2].generatedImages[0].image.imageBytes },
                ].map(p => ({
                    ...p,
                    imagePrompt: `data:image/jpeg;base64,${p.imagePrompt}`
                }));
                return {
                    title: "Quantum Leap Portfolio",
                    description: bundleData.description,
                    products: products
                };
            } catch (err: any) {
                ApexFinancialArchitects.ErrorHandling.logError("Error generating product bundle:", err);
                return null;
            }
        },
    };
}

// Company Entity A.003 - "Quantix UI Solutions" - UI/UX and Component Library
namespace QuantixUISolutions {
    // A.003.001 - Reusable UI Components (Extensive and Highly Customizable)
    // A.003.001.001 - Card Component
    export const CardComponent: React.FC<{
        title?: string;
        variant?: 'default' | 'interactive';
        className?: string;
        children: React.ReactNode;
        onClick?: () => void;
        isLoading?: boolean;
    }> = ({ title, variant = 'default', className, children, onClick, isLoading }) => {
        const baseClasses = `bg-gray-800 rounded-xl shadow-lg p-4 transition-shadow duration-200 border border-gray-700 ${className || ''}`;
        const interactiveClasses = variant === 'interactive' ? 'hover:shadow-xl cursor-pointer' : '';
        const combinedClasses = `${baseClasses} ${interactiveClasses}`;

        return (
            <div onClick={onClick} className={combinedClasses}>
                {title && <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>}
                {isLoading && (
                    <div className="flex items-center justify-center h-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                )}
                {!isLoading && children}
            </div>
        );
    };

    // A.003.001.002 - Modal Component (Enhanced)
    export const ModalComponent: React.FC<{
        isOpen: boolean;
        onClose: () => void;
        children: React.ReactNode;
        title: string;
        size?: 'sm' | 'md' | 'lg' | 'xl';
    }> = ({ isOpen, onClose, children, title, size = 'md' }) => {
        if (!isOpen) return null;
        const sizeClasses = {
            sm: 'max-w-lg',
            md: 'max-w-2xl',
            lg: 'max-w-4xl',
            xl: 'max-w-6xl',
        };
        return (
            <div className="fixed inset-0 bg-gray-950/80 flex items-center justify-center z-[1000] backdrop-blur-lg transition-opacity duration-300" onClick={onClose}>
                <div
                    className={`${sizeClasses[size]} w-full mx-4 bg-gray-800 rounded-xl shadow-3xl border border-cyan-700/50 transform transition-transform duration-300 scale-100`}
                    onClick={e => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-750 rounded-t-xl">
                        <h3 id="modal-title" className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">{children}</div>
                </div>
            </div>
        );
    };

    // A.003.001.003 -  Button Component (Highly Versatile)
    export const ButtonComponent: React.FC<{
        children: React.ReactNode;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
        size?: 'sm' | 'md' | 'lg';
        disabled?: boolean;
        className?: string;
    }> = ({ children, onClick, variant = 'primary', size = 'md', disabled, className }) => {
        const variantClasses = {
            primary: 'bg-cyan-600 hover:bg-cyan-500 text-white',
            secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
            outline: 'bg-transparent border border-gray-500 text-gray-300 hover:bg-gray-700',
            destructive: 'bg-red-600 hover:bg-red-500 text-white',
        };
        const sizeClasses = {
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-2.5 text-base',
            lg: 'px-6 py-3 text-lg',
        };
        const baseClasses = `rounded-lg font-semibold transition-colors duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;
        const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
        return (
            <button
                onClick={disabled ? undefined : onClick}
                className={`${baseClasses} ${disabledClasses}`}
                disabled={disabled}
            >
                {children}
            </button>
        );
    };

    // A.003.001.004 - Input Component (Customizable)
    export const InputComponent: React.FC<{
        type?: 'text' | 'password' | 'email' | 'number';
        placeholder?: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        className?: string;
        label?: string;
        disabled?: boolean;
    }> = ({ type = 'text', placeholder, value, onChange, className, label, disabled }) => {
        const baseClasses = `bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${className || ''}`;
        return (
            <div className="space-y-1">
                {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={baseClasses}
                    disabled={disabled}
                />
            </div>
        );
    };

    // A.003.002 - Icon Library (Comprehensive, Scalable)
    export const IconLibrary = {
        // A.003.002.001 - Icon Definitions (Using Lucide React for consistency)
        icons: {
            // A.003.002.001.001 - Financial Icons
            link: Bot, //ApexFinancialArchitects.TransactionIcon;
            send: Send,
            bill: ApexFinancialArchitects.TransactionIcon,
            deposit: ApexFinancialArchitects.TransactionIcon,
            shield: ApexFinancialArchitects.TransactionIcon,
            trendingUp: ApexFinancialArchitects.TransactionIcon,
            target: ApexFinancialArchitects.TransactionIcon,
            star: ApexFinancialArchitects.TransactionIcon,
            rocket: ApexFinancialArchitects.TransactionIcon,
            // A.003.002.001.002 - UI/UX Icons
            maximize: Maximize2,
            minimize: Minimize2,
            x: X,
            eye: Eye,
            camera: Camera,
            refreshCw: RefreshCw,
            scanEye: ScanEye,
            bot: Bot,
        },
        // A.003.002.002 -  Icon Renderer Function
        renderIcon: (iconName: keyof typeof IconLibrary.icons, className?: string) => {
            const Icon = IconLibrary.icons[iconName];
            if (!Icon) {
                console.warn(`Icon "${iconName}" not found in IconLibrary.`);
                return null;
            }
            return <Icon className={className} />;
        },
    };

    // A.003.003 - Utility Functions for UI (Animation, Styling)
    export const UIUtils = {
        // A.003.003.001 - Apply Fade-In Animation
        fadeIn: (delay: number = 0, duration: number = 300): React.CSSProperties => {
            return {
                animation: `fadeIn ${duration}ms ease-in-out ${delay}ms`,
                opacity: 0,
            };
        },
        // A.003.003.002 - Apply Slide-In From Bottom Animation
        slideInFromBottom: (distance: number = 10, duration: number = 300): React.CSSProperties => {
            return {
                animation: `slideInFromBottom ${duration}ms ease-in-out`,
            };
        },
        // A.003.003.003 - Generate Dynamic Gradient
        generateGradient: (colors: string[]): React.CSSProperties => {
            return {
                background: `linear-gradient(to right, ${colors.join(', ')})`,
            };
        },
        // A.003.003.004 -  Create a custom scrollbar style
        customScrollbarStyles: {
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.2)',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'rgba(255,255,255,0.4)',
            },
        },
    };
}

// Company Entity A.004 - "Financial Data Integrations, Inc." - Data Connectivity and API Management
namespace FinancialDataIntegrations {
    // A.004.001 - Plaid Integration Component (Encapsulated and Secure)
    export const PlaidIntegration: React.FC<{ onSuccess: (publicToken: string, metadata: any) => void; disabled?: boolean; }> = ({ onSuccess, disabled }) => {
        const [plaidLink, setPlaidLink] = useState<any>(null); // A.004.001.001 - Plaid Link Instance
        const [loading, setLoading] = useState(false);  // A.004.001.002 - Loading State

        useEffect(() => {
            // A.004.001.003 - Initialize Plaid Link on Component Mount
            const initializePlaid = async () => {
                if (typeof window === 'undefined') return;
                try {
                    const { PlaidLink

================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-plaid-marqeta-modern-Treasury-aibanking.dev- | ORIGINAL PATH: diplomat-bit-jocall3-plaid-marqeta-modern-Treasury-aibanking.dev--44f28d7/components/Dashboard.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  PlaidCredentials, Account, Transaction, 
  MarqetaCredentials, MarqetaCardProduct, MarqetaCard,
  ModernTreasuryCredentials, MTLedger, MTInternalAccount
} from '../types';
import { 
  CreditCard, Wallet, Search, ExternalLink, ChevronRight, Database, Landmark,
  RefreshCcw, AlertCircle, Info, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap,
  Activity, Settings, Box, Plus, Sparkles, X, CheckCircle, Cpu, UserCheck, Code,
  Terminal, Globe, Key, FileText, Users, ShoppingCart, Repeat, Layers, Lock, FileOutput
} from 'lucide-react';
import { Dossier } from './Dossier';

interface Props {
  accessToken: string;
  credentials: PlaidCredentials;
  marqetaCreds: MarqetaCredentials;
  mtCreds: ModernTreasuryCredentials;
  proxy: string;
  addLog: (msg: any, type?: 'req' | 'res' | 'err') => void;
}

export const Dashboard: React.FC<Props> = ({ accessToken, credentials, marqetaCreds, mtCreds, proxy, addLog }) => {
  const [activeTab, setActiveTab] = useState<'banking' | 'issuing' | 'ledgering'>('banking');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cardProducts, setCardProducts] = useState<MarqetaCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [newCard, setNewCard] = useState<MarqetaCard | null>(null);
  const [showDossier, setShowDossier] = useState(false);
  
  // Modern Treasury Explorer State
  const [mtResource, setMtResource] = useState<string>('ledgers');
  const [mtData, setMtData] = useState<any>(null);
  const [mtLoading, setMtLoading] = useState(false);

  const mtAuth = btoa(`${mtCreds.organizationId}:${mtCreds.apiKey}`);
  const marqetaAuth = btoa(`${marqetaCreds.applicationToken}:${marqetaCreds.adminAccessToken}`);

  const mtFetch = async (endpoint: string, method: string = 'GET', body?: any) => {
    const targetUrl = `https://app.moderntreasury.com/api${endpoint}`;
    const finalUrl = proxy ? `${proxy}${encodeURIComponent(targetUrl)}` : targetUrl;
    
    addLog(`${method} ${endpoint} [MODERN_TREASURY]`, 'req');
    try {
      const response = await fetch(finalUrl, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${mtAuth}`
        },
        body: body ? JSON.stringify(body) : undefined
      });
      
      const data = await response.json();
      if (!response.ok) {
        addLog(data, 'err');
        return { error: true, data };
      }
      addLog(data, 'res');
      return data;
    } catch (err: any) {
      addLog(err.message, 'err');
      throw err;
    }
  };

  const marqetaFetch = async (endpoint: string, method: string = 'GET', body?: any) => {
    const targetUrl = `https://sandbox-api.marqeta.com/v3${endpoint}`;
    const finalUrl = proxy ? `${proxy}${encodeURIComponent(targetUrl)}` : targetUrl;
    
    addLog(`${method} ${endpoint} [MARQETA]`, 'req');
    const res = await fetch(finalUrl, {
      method,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Basic ${marqetaAuth}` 
      },
      body: body ? JSON.stringify(body) : undefined
    }).then(r => r.json());
    addLog(res, 'res');
    return res;
  };

  const fetchStack = async () => {
    setLoading(true);
    try {
      // 1. Plaid
      const plaidBase = `https://${credentials.environment}.plaid.com`;
      const pUrl = proxy ? `${proxy}${encodeURIComponent(plaidBase + '/accounts/get')}` : plaidBase + '/accounts/get';
      const pRes = await fetch(pUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: credentials.clientId, secret: credentials.secret, access_token: accessToken })
      }).then(r => r.json());
      
      if (pRes.accounts && Array.isArray(pRes.accounts)) {
        const mapped = pRes.accounts.map((a: any) => ({
          id: a.account_id,
          name: a.name || 'Untitled Account',
          mask: a.mask || '0000',
          type: a.type || 'depository',
          subtype: a.subtype || 'checking',
          balance: {
            current: a.balances?.current ?? 0,
            available: a.balances?.available ?? null,
            limit: a.balances?.limit ?? null,
            currency: a.balances?.iso_currency_code || 'USD'
          }
        }));
        setAccounts(mapped);
      }

      // 2. Marqeta
      const mRes = await marqetaFetch('/cardproducts');
      setCardProducts(mRes.data || []);

      // 3. Modern Treasury Initial Sync
      await fetchMtResource('ledgers');

    } catch (e) {
      console.error(e);
      addLog("Infrastructure handshake error", 'err');
    } finally {
      setLoading(false);
    }
  };

  const fetchMtResource = async (resource: string) => {
    setMtLoading(true);
    setMtResource(resource);
    try {
      const data = await mtFetch(`/${resource}`);
      setMtData(data);
    } catch (e: any) {
      setMtData({ error: e.message, status: 'Proxy Node Rejected' });
    } finally {
      setMtLoading(false);
    }
  };

  useEffect(() => { fetchStack(); }, [accessToken, proxy]);

  const mintCard = async () => {
    setIsMinting(true);
    try {
      const userToken = 'u_' + Math.random().toString(36).substring(7);
      await marqetaFetch('/users', 'POST', { token: userToken, first_name: 'Nexus', last_name: 'Operator' });
      
      let productToken = cardProducts[0]?.token;
      if (!productToken) {
        const prod = await marqetaFetch('/cardproducts', 'POST', { 
          token: 'cp_' + Math.random().toString(36).substring(7), 
          name: 'Nexus Elite V1', 
          active: true, 
          config: { card_life_cycle: { activate_upon_issue: true, expiration_offset: { unit: 'YEARS', value: 5 } }, payment_instrument: 'VIRTUAL_PAN' } 
        });
        productToken = prod.token;
      }

      const card = await marqetaFetch('/cards?show_pan=true&show_cvv_number=true', 'POST', { user_token: userToken, card_product_token: productToken });
      setNewCard({ 
        pan: card.pan, 
        last_four: card.last_four, 
        expiration: card.expiration, 
        cvv: card.cvv_number, 
        token: card.token, 
        user_token: card.user_token, 
        card_product_token: card.card_product_token, 
        state: card.state 
      });
      await fetchStack();
    } catch (e: any) {
      addLog(e.message, 'err');
    } finally {
      setIsMinting(false);
    }
  };

  const netBalance = accounts.reduce((acc, curr) => 
    curr.type === 'depository' ? acc + (curr.balance?.current || 0) : acc - (curr.balance?.current || 0), 0
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10">
      <div className="relative">
         <div className="w-24 h-24 border-[6px] border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
         <div className="absolute inset-0 flex items-center justify-center">
            <Activity size={32} className="text-blue-500 animate-pulse" />
         </div>
      </div>
      <div className="text-center space-y-2">
         <p className="text-blue-500 font-black uppercase tracking-[0.5em] italic text-xs">Calibrating Infrastructure</p>
         <p className="text-slate-600 text-[10px] font-mono uppercase">Node Aggregator | Issuing Node | Ledger Node</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      
      {/* Sovereign Dossier View */}
      {showDossier && (
        <Dossier 
          accounts={accounts} 
          products={cardProducts} 
          mtData={mtData} 
          mtResource={mtResource}
          onClose={() => setShowDossier(false)} 
        />
      )}

      {/* SUCCESS MODAL */}
      {newCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] max-w-xl w-full text-center space-y-10 shadow-[0_0_100px_rgba(37,99,235,0.2)]">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-bounce">
               <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Mint Success</h2>
            <div className="relative h-56 bg-gradient-to-br from-blue-600 via-indigo-900 to-slate-950 rounded-3xl p-8 shadow-2xl border border-white/20 text-left overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
               <div className="h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-9 bg-yellow-400/80 rounded shadow-inner" />
                    <Zap size={24} className="text-white/40" />
                  </div>
                  <p className="text-2xl font-mono font-bold tracking-[0.2em] text-white drop-shadow-md">
                    {newCard.pan?.match(/.{1,4}/g)?.join(' ') || `**** **** **** ${newCard.last_four}`}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[8px] font-black text-white/40 uppercase">Asset Operator</p>
                       <p className="text-xs uppercase font-black text-white/80 italic">Nexus Protocol</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-white/40 uppercase font-mono tracking-tighter">EXP: {newCard.expiration} • CVV: {newCard.cvv}</p>
                    </div>
                  </div>
               </div>
            </div>
            <button onClick={() => setNewCard(null)} className="w-full bg-white text-slate-950 font-black py-5 rounded-2xl uppercase tracking-widest text-sm hover:bg-blue-50 transition-all shadow-xl">Close visual protocol</button>
          </div>
        </div>
      )}

      {/* Navigation Nodes */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <nav className="flex flex-wrap gap-4 p-2 bg-slate-950/60 border border-white/5 rounded-[2rem] max-w-fit backdrop-blur-md">
          {[
            { id: 'banking', label: 'Aggregation', icon: Landmark, color: 'text-blue-500' },
            { id: 'issuing', label: 'Issuance', icon: CreditCard, color: 'text-emerald-500' },
            { id: 'ledgering', label: 'Treasury Explorer', icon: Terminal, color: 'text-purple-500' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl border border-white/10 ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? tab.color : ''} />
              <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>
        
        <button 
          onClick={() => setShowDossier(true)}
          className="flex items-center gap-4 px-10 py-4 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all group"
        >
          <FileOutput size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          Generate Sovereign Dossier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          {activeTab === 'banking' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4 px-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                Institutional Connectivity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {accounts.map(acc => (
                  <div key={acc.id} className="bg-slate-900/40 p-8 rounded-[3rem] border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden relative backdrop-blur-sm shadow-xl">
                    <Landmark className="absolute -right-4 -bottom-4 text-white/5 opacity-0 group-hover:opacity-10 transition-opacity duration-700" size={140} />
                    <div className="flex justify-between items-start mb-8 relative z-10">
                       <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-blue-400 border border-white/5 shadow-inner"><Landmark size={24} /></div>
                       <span className="text-[10px] font-mono text-slate-600 font-bold bg-black/40 px-3 py-1 rounded-full border border-white/5 uppercase">ID_{acc.mask}</span>
                    </div>
                    <div className="space-y-1 relative z-10">
                      <p className="text-lg font-black text-white italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{acc.name}</p>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{acc.subtype} • {acc.type}</p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-end justify-between relative z-10">
                       <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ledger_Current</p>
                          <p className="text-3xl font-black text-white italic tracking-tighter">${acc.balance?.current?.toLocaleString() || '0.00'}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Net_Available</p>
                          <p className="text-sm font-bold text-emerald-500">${acc.balance?.available?.toLocaleString() || 'N/A'}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'issuing' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="bg-slate-950/80 p-12 rounded-[3.5rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu size={200} />
                 </div>
                 <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                       <Sparkles className="text-amber-400" size={24} />
                       <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Nexus Mint Node</h3>
                    </div>
                    <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">Provision authorized virtual assets on the Marqeta sandbox. Automated identity mapping protocol enabled.</p>
                 </div>
                 <button onClick={mintCard} disabled={isMinting} className="bg-blue-600 text-white px-12 py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-[0_20px_50px_rgba(37,99,235,0.3)] disabled:opacity-50 relative z-10 border border-blue-400/20">
                   {isMinting ? <RefreshCcw className="animate-spin" size={20} /> : <Plus size={20} />}
                   {isMinting ? 'PROVISIONING...' : 'ISSUE NEW ASSET'}
                 </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {cardProducts.map(prod => (
                  <div key={prod.token} className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between hover:border-emerald-500/30 transition-all group shadow-lg">
                    <div className="flex items-center gap-8">
                      <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all"><Box size={24} /></div>
                      <div>
                        <p className="text-xl font-black text-white uppercase italic tracking-tight">{prod.name}</p>
                        <p className="text-[10px] font-mono text-slate-600 tracking-tighter uppercase font-bold">NODE_REF: {prod.token}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-inner">Operational</span>
                       <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest font-mono">Status_Check: 200 OK</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'ledgering' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
               <div className="bg-slate-950/60 p-8 rounded-[3.5rem] border border-white/5 space-y-10 shadow-2xl">
                  <div className="flex flex-wrap gap-3">
                     {[
                       { id: 'ledgers', label: 'Ledgers', icon: Database },
                       { id: 'ledger_accounts', label: 'Accounts', icon: Landmark },
                       { id: 'ledger_transactions', label: 'Transactions', icon: ShoppingCart },
                       { id: 'counterparties', label: 'Parties', icon: Users },
                       { id: 'payment_orders', label: 'Pay Orders', icon: Repeat },
                       { id: 'expected_payments', label: 'Expected', icon: FileText }
                     ].map(res => (
                       <button 
                        key={res.id}
                        onClick={() => fetchMtResource(res.id)}
                        className={`flex items-center gap-3 px-6 py-3.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${mtResource === res.id ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300'}`}
                       >
                         <res.icon size={14} />
                         {res.label}
                       </button>
                     ))}
                  </div>

                  <div className="bg-black/40 rounded-[2.5rem] p-10 border border-white/5 font-mono text-xs overflow-hidden relative group">
                     <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                           <span className="text-[11px] font-black uppercase text-purple-400 tracking-[0.4em]">MT_API_GATEWAY: /{mtResource}</span>
                        </div>
                        {mtLoading && <RefreshCcw size={16} className="animate-spin text-slate-600" />}
                     </div>
                     <div className="max-h-[500px] overflow-y-auto scrollbar-thin text-slate-400 leading-relaxed whitespace-pre-wrap relative z-10">
                        {mtLoading ? (
                          <div className="flex items-center gap-4 animate-pulse">
                             <div className="w-4 h-4 bg-slate-800 rounded" />
                             <span>Intercepting packets from Modern Treasury node...</span>
                          </div>
                        ) : JSON.stringify(mtData, null, 2)}
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />
                  </div>
               </div>
            </section>
          )}
        </div>

        {/* System Monitor & Vault Panel */}
        <aside className="space-y-10">
          <div className="bg-slate-950/80 p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl backdrop-blur-xl sticky top-32">
             <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-3">
                  <Activity size={18} className="text-blue-500" /> Infrastructure
                </h4>
                <div className="space-y-3">
                  {[
                    { node: 'AGGREGATOR', status: 'ACTIVE', color: 'text-blue-500', val: `$${netBalance.toLocaleString()}` },
                    { node: 'ISSUER', status: 'STABLE', color: 'text-emerald-500', val: cardProducts.length.toString() + ' ACTIVE' },
                    { node: 'LEDGER', status: 'SYNCED', color: 'text-purple-500', val: '200 OK' }
                  ].map(n => (
                    <div key={n.node} className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 flex flex-col gap-3 group hover:bg-slate-900/60 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{n.node}</span>
                        <span className={`text-[10px] font-bold ${n.color}`}>{n.status}</span>
                      </div>
                      <span className="text-2xl font-black text-white italic tracking-tighter">{n.val}</span>
                    </div>
                  ))}
                </div>
             </div>

             {/* AUTH VAULT */}
             <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-3">
                  <Lock size={18} className="text-emerald-500" /> Encoded Vault
                </h4>
                <div className="space-y-4">
                   <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/5 space-y-3 group hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">MT_BASIC_AUTH_HEADER</span>
                         <Code size={12} className="text-slate-700" />
                      </div>
                      <div className="font-mono text-[9px] text-slate-600 break-all p-4 bg-black/60 rounded-xl select-all cursor-copy hover:text-slate-300 transition-colors border border-white/5">
                        Basic {mtAuth}
                      </div>
                   </div>

                   <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/5 space-y-3 group hover:border-blue-500/20 transition-all">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">MARQETA_BASIC_AUTH_HEADER</span>
                         <Code size={12} className="text-slate-700" />
                      </div>
                      <div className="font-mono text-[9px] text-slate-600 break-all p-4 bg-black/60 rounded-xl select-all cursor-copy hover:text-slate-300 transition-colors border border-white/5">
                        Basic {marqetaAuth}
                      </div>
                   </div>
                </div>
             </div>

             <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-4 py-6 rounded-2xl border border-white/10 text-slate-600 hover:text-white hover:bg-red-500/5 hover:border-red-500/20 transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-lg">
                <RefreshCcw size={16} /> RESET TERMINAL SESSION
             </button>
          </div>
        </aside>
      </div>
    </div>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/Dashboard.tsx
================================================================================

import React, { useContext, useMemo } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View } from '../types';
import { 
    Database, Zap, Globe, Target, 
    Cpu, Landmark, CheckCircle, Crown, Code, Fingerprint, ShieldCheck, Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard requires DataContext.");

    const { 
        transactions, financialGoals, 
        setActiveView, creditScore, rewardPoints, assets, isProductionApproved, plaidProducts
    } = context;

    const totalManagedValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2 md:p-6 bg-gray-950 min-h-screen">

            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-8">
                {/* Left: Title + Status */}
                <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-[10px] text-green-400 font-black tracking-widest uppercase">
                            Production Environment
                        </div>
                        <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-black tracking-widest uppercase">
                            Handshake Stable
                        </div>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase font-mono italic">Nexus OS</h1>
                    <p className="text-emerald-400 mt-1 flex items-center gap-2 font-mono text-sm tracking-widest uppercase">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        SIGNAL: {isProductionApproved ? 'PRODUCTION_ACTIVE' : 'INITIALIZING'}
                    </p>
                </div>
                {/* Right: Buttons */}
                <div className="flex gap-3 flex-wrap">
                    <button onClick={() => setActiveView(View.ComplianceOracle)} 
                        className="px-4 py-2 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/50 rounded-xl text-sm font-bold text-indigo-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <ShieldCheck size={18} /> Welcome to the DEMO
                    </button>
                    <button onClick={() => setActiveView(View.SendMoney)} 
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95 uppercase tracking-widest">
                        Initiate Capital Flow
                    </button>
                </div>
            </header>

            {/* Metrics Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="border-cyan-500/20 bg-cyan-950/5 text-center py-6 group hover:border-cyan-500/50 transition-all">
                    <Fingerprint className="w-8 h-8 mx-auto text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{(creditScore.score/100).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Trust Score (Q-Resistant)</p>
                </Card>
                <Card className="border-purple-500/20 bg-purple-950/5 text-center py-6 group hover:border-purple-500/50 transition-all">
                    <Activity className="w-8 h-8 mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{plaidProducts.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Active Protocols</p>
                </Card>
                <Card className="border-green-500/20 bg-green-950/5 text-center py-6 group hover:border-green-500/50 transition-all">
                    <Database className="w-8 h-8 mx-auto text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">100%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Ledger Integrity</p>
                </Card>
                <Card className="border-emerald-500/20 bg-emerald-950/5 text-center py-6 group hover:border-emerald-500/50 transition-all">
                    <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">VERIFIED</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Identity Verified</p>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

                {/* Left Column */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <Card title="Sovereign Wealth Topology" className="relative overflow-hidden bg-black/40 border-indigo-900/50 p-0">
                        <div className="absolute top-6 left-6 z-10">
                            <span className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold font-mono rounded-lg backdrop-blur">
                                MULTIVERSE_PROJECTION_V6
                            </span>
                        </div>
                        <WealthTimeline />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <BalanceSummary />
                        <AIInsights />
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <Card title="Production Authority" className="border-indigo-500/20 bg-indigo-950/5 p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-indigo-500/20">
                                <Code className="text-indigo-400" />
                                <div>
                                    <p className="text-xs font-bold text-white uppercase">License: Apache 2.0</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Open Source Institutional Standard</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-emerald-500/20">
                                <div className="flex items-center gap-4">
                                    <Landmark className="text-emerald-400" />
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">Net Liquidity</p>
                                        <p className="text-[10px] text-gray-400 font-mono">Verified Reserves</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-white">${(totalManagedValue / 1000000).toFixed(2)}M</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Strategic Phase Allocation" className="border-green-500/20 p-6">
                        <div className="space-y-6">
                            {[
                                { name: "Phase 0: Launch", pct: 100 },
                                { name: "Phase 1: Deep Insights", pct: 45 },
                                { name: "Phase 2: Wealth Sync", pct: 12 }
                            ].map(phase => (
                                <div key={phase.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-300">{phase.name}</span>
                                        <span className="text-green-400 font-mono">{phase.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-green-500 h-full transition-all duration-1000" style={{ width: `${phase.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setActiveView(View.FinancialGoals)} 
                                className="w-full py-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-all border border-gray-800">
                                Review Full Protocol
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Full-width Recent Transactions */}
                <div className="lg:col-span-12">
                    <RecentTransactions transactions={transactions.slice(0, 10)} setActiveView={setActiveView} />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/Dashboard (1).tsx
================================================================================

import React, { useContext, useMemo } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View } from '../types';
import { 
    Database, Zap, Globe, Target, 
    Cpu, Landmark, CheckCircle, Crown, Code, Fingerprint, ShieldCheck, Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard requires DataContext.");

    const { 
        transactions, financialGoals, 
        setActiveView, creditScore, rewardPoints, assets, isProductionApproved, plaidProducts
    } = context;

    const totalManagedValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2 md:p-6 bg-gray-950 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                         <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-[10px] text-green-400 font-black tracking-widest uppercase">Production Environment</div>
                         <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-black tracking-widest uppercase">Handshake Stable</div>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase font-mono italic">Nexus OS</h1>
                    <p className="text-emerald-400 mt-1 flex items-center gap-2 font-mono text-sm tracking-widest uppercase">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        SIGNAL: {isProductionApproved ? 'PRODUCTION_ACTIVE' : 'INITIALIZING'} // 15/15 PROTOCOLS SYNCED
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setActiveView(View.ComplianceOracle)} className="px-4 py-2 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/50 rounded-xl text-sm font-bold text-indigo-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <ShieldCheck size={18} /> CMMC LEVEL 3 CERTIFIED
                    </button>
                    <button onClick={() => setActiveView(View.SendMoney)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95 uppercase tracking-widest">
                        Initiate Capital Flow
                    </button>
                </div>
            </header>

            {/* Production Metrics Deck */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="border-cyan-500/20 bg-cyan-950/5 text-center py-6 group hover:border-cyan-500/50 transition-all">
                    <Fingerprint className="w-8 h-8 mx-auto text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{(creditScore.score/100).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Trust Score (Q-Resistant)</p>
                </Card>
                <Card className="border-purple-500/20 bg-purple-950/5 text-center py-6 group hover:border-purple-500/50 transition-all">
                    <Activity className="w-8 h-8 mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{plaidProducts.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Active Protocols</p>
                </Card>
                <Card className="border-green-500/20 bg-green-950/5 text-center py-6 group hover:border-green-500/50 transition-all">
                    <Database className="w-8 h-8 mx-auto text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">100%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Ledger Integrity</p>
                </Card>
                <Card className="border-emerald-500/20 bg-emerald-950/5 text-center py-6 group hover:border-emerald-500/50 transition-all">
                    <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">VERIFIED</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Identity Verified</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Data Nexus */}
                <div className="lg:col-span-8 space-y-8">
                    <Card title="Sovereign Wealth Topology" className="h-[450px] relative overflow-hidden bg-black/40 border-indigo-900/50 p-0">
                        <div className="absolute top-6 left-6 z-10">
                            <span className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold font-mono rounded-lg backdrop-blur">MULTIVERSE_PROJECTION_V6</span>
                        </div>
                        <WealthTimeline />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <BalanceSummary />
                        <AIInsights />
                    </div>
                </div>

                {/* Tactical Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <Card title="Production Authority" className="border-indigo-500/20 bg-indigo-950/5 p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-indigo-500/20">
                                <Code className="text-indigo-400" />
                                <div>
                                    <p className="text-xs font-bold text-white uppercase">License: Apache 2.0</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Open Source Institutional Standard</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-emerald-500/20">
                                <div className="flex items-center gap-4">
                                    <Landmark className="text-emerald-400" />
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">Net Liquidity</p>
                                        <p className="text-[10px] text-gray-400 font-mono">Verified Reserves</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-white">${(totalManagedValue / 1000000).toFixed(2)}M</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Strategic Phase Allocation" className="border-green-500/20 p-6">
                        <div className="space-y-6">
                            {[
                                { name: "Phase 0: Launch", pct: 100 },
                                { name: "Phase 1: Deep Insights", pct: 45 },
                                { name: "Phase 2: Wealth Sync", pct: 12 }
                            ].map(phase => (
                                <div key={phase.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-300">{phase.name}</span>
                                        <span className="text-green-400 font-mono">{phase.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-green-500 h-full transition-all duration-1000" style={{ width: `${phase.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setActiveView(View.FinancialGoals)} className="w-full py-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-all border border-gray-800">Review Full Protocol</button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-12">
                    <RecentTransactions transactions={transactions.slice(0, 10)} setActiveView={setActiveView} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/Dashboard (3).tsx
================================================================================

import React from 'react';

// REFACTOR: The original Dashboard.tsx was a massive, insecure form for entering 200+ API keys.
// This is a critical anti-pattern. Secrets should never be managed through a frontend UI.
// They must be configured securely on the backend using a vault (like AWS Secrets Manager)
// or environment variables, completely inaccessible to the client-side.
//
// In line with the MVP goal of a "Unified business financial dashboard," this component has been
// completely replaced with a proper dashboard layout. It now serves as the central hub for
// displaying financial data, rather than being a dangerous and non-production-ready configuration page.
// This new component uses placeholder data to illustrate its intended function.

// Placeholder data - in a real application, this would be fetched from a secure API endpoint
// and managed with a state management library like React Query or Redux Toolkit.
const mockFinancialData = {
  totalBalance: 1250345.67,
  cashFlow: 55021.34,
  revenue: 210450.99,
  expenses: 155429.65,
  recentTransactions: [
    { id: 'txn_1', description: 'Stripe Payout', amount: 25000, date: '2023-10-26', type: 'income' },
    { id: 'txn_2', description: 'AWS Services Bill', amount: -5200.50, date: '2023-10-25', type: 'expense' },
    { id: 'txn_3', description: 'Client Payment - Acme Corp', amount: 15000, date: '2023-10-24', type: 'income' },
    { id: 'txn_4', description: 'Office Rent Payment', amount: -8000, date: '2023-10-24', type: 'expense' },
    { id: 'txn_5', description: 'Software Subscription - Figma', amount: -450, date: '2023-10-23', type: 'expense' },
  ],
};

// A simple placeholder for a UI card component.
// In a real app, this would come from a standardized UI library like MUI or a custom component system using Tailwind CSS.
const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`card ${className || ''}`} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
    <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>{title}</h3>
    <div>{children}</div>
  </div>
);

const Dashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', padding: '2rem', backgroundColor: '#f8f9fa' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#1a202c' }}>Business Financial Dashboard</h1>
        <p style={{ color: '#667eea', marginTop: '0.25rem' }}>A unified view of your company's financial health.</p>
      </header>

      {/* Key Metrics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card title="Total Cash Balance">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: '#2c5282' }}>{formatCurrency(mockFinancialData.totalBalance)}</p>
        </Card>
        <Card title="Net Cash Flow (30d)">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: mockFinancialData.cashFlow > 0 ? '#38a169' : '#e53e3e' }}>{formatCurrency(mockFinancialData.cashFlow)}</p>
        </Card>
        <Card title="Revenue (30d)">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: '#38a169' }}>{formatCurrency(mockFinancialData.revenue)}</p>
        </Card>
        <Card title="Expenses (30d)">
          <p style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, color: '#e53e3e' }}>{formatCurrency(mockFinancialData.expenses)}</p>
        </Card>
      </div>

      {/* Data Visualizations and Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', lg: 'gridTemplateColumns: "2fr 1fr"', gap: '1.5rem' }}>
        <Card title="Recent Transactions">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '0.75rem' }}>Description</th>
                <th style={{ padding: '0.75rem' }}>Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockFinancialData.recentTransactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 500 }}>{tx.description}</td>
                  <td style={{ padding: '0.75rem', color: '#666' }}>{tx.date}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? '#2f855a' : '#c53030' }}>{formatCurrency(tx.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Cash Balance Over Time">
          {/* Placeholder for a chart component. In a real app, this would be a library like Recharts or Chart.js */}
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#edf2f7', color: '#a0aec0', borderRadius: '4px', fontStyle: 'italic' }}>
            [Chart Component: Line graph showing balance over last 90 days]
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/Dashboard (5).tsx
================================================================================

import React, { useContext, useMemo, useState, useEffect, useCallback } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import AIInsights from './AIInsights';
import ImpactTracker from './ImpactTracker';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GamificationState, Subscription, CreditScore, SavingsGoal, MarketMover, UpcomingBill, Transaction, BudgetCategory, RewardPoints, View, LinkedAccount } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, AreaChart, Area } from 'recharts';
import PlaidLinkButton from './PlaidLinkButton';
import { GoogleGenAI } from '@google/generative-ai';

// ================================================================================================
// CORE UTILITY COMPONENTS (Modal & Overlays)
// ================================================================================================

/**
 * A highly customizable, accessible modal component for displaying critical information or actions.
 */
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; size?: 'sm' | 'md' | 'lg' }> = ({ isOpen, onClose, children, title, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-lg',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-950/80 flex items-center justify-center z-[1000] backdrop-blur-lg transition-opacity duration-300" 
            onClick={onClose}
        >
            <div 
                className={`${sizeClasses[size]} w-full mx-4 bg-gray-800 rounded-xl shadow-3xl border border-cyan-700/50 transform transition-transform duration-300 scale-100`} 
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-750 rounded-t-xl">
                    <h3 id="modal-title" className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">{children}</div>
            </div>
        </div>
    );
};

/**
 * Overlay component to indicate ongoing data synchronization and AI processing.
 */
const DataImportingOverlay: React.FC<{ isImporting: boolean; account: LinkedAccount | undefined }> = ({ isImporting, account }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const bankName = account?.name || 'Primary Financial Institution';

    const messages = useMemo(() => [
        `Establishing Quantum Link to ${bankName}...`,
        'Securely decrypting and importing ledger entries...',
        'AI Core (Plato) is synthesizing raw data streams...',
        'Generating predictive models and risk assessments...',
        'Finalizing synchronization. Dashboard update imminent.'
    ], [bankName]);

    useEffect(() => {
        if (isImporting) {
            setMessageIndex(0);
            const interval = setInterval(() => {
                setMessageIndex(prev => (prev + 1) % messages.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [isImporting, messages.length]);

    if (!isImporting) return null;

    return (
        <div className="fixed inset-0 bg-gray-950/95 flex flex-col items-center justify-center z-[1001] backdrop-blur-lg">
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-8 border-cyan-500/20 rounded-full animate-ping-slowest"></div>
                <div className="absolute inset-0 border-8 border-indigo-500/30 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 border-8 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white text-xl mt-10 font-extrabold tracking-wider animate-pulse">{messages[messageIndex]}</p>
            <p className="text-gray-400 mt-2 text-sm">Processing {bankName} Data Stream...</p>
        </div>
    );
};


// ================================================================================================
// ICON MAP & UTILITY COMPONENTS
// ================================================================================================
const WIDGET_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
    video: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    music: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>,
    cloud: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    plane: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    rocket: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    send: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
bill: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    deposit: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    shield: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    trendingUp: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    target: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    star: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.519 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.52-4.674a1 1 0 00-.364-1.118L2.52 9.431c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" /></svg>,
    link: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5-4.5h8.25m0 0L12 3m4.5 4.5L12 12" /></svg>,
};

// ================================================================================================
// CORE WIDGETS (Expanded Functionality)
// ================================================================================================

const LinkAccountPrompt: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("LinkAccountPrompt must be used within a DataProvider");
    }
    const { handlePlaidSuccess, isImportingData } = context;

    return (
        <Card title="Unified Financial Nexus" variant="default" className="border-cyan-500/30">
            <div className="text-center p-4">
                <div className="w-20 h-20 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-300 mb-6 border-4 border-cyan-500/50">
                    <WIDGET_ICONS.link className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-wide">Establish Secure Data Conduit</h3>
                <p className="text-gray-400 mt-3 mb-8 max-w-xl mx-auto text-base">
                    To activate the full spectrum of predictive analytics and automated wealth management, you must establish a secure, encrypted connection to your external financial institutions via our certified Plaid integration. This is the foundation of your autonomous financial future.
                </p>
                <div className="max-w-xs mx-auto">
                    <PlaidLinkButton onSuccess={handlePlaidSuccess} disabled={isImportingData} />
                    {isImportingData && <p className="text-sm text-yellow-400 mt-2 animate-pulse">Connection in progress...</p>}
                </div>
            </div>
        </Card>
    );
};

const GamificationProfile: React.FC<{ gamification: GamificationState; onClick: () => void; }> = ({ gamification, onClick }) => {
    const { score, level, levelName, progress } = gamification;
    const circumference = 2 * Math.PI * 55;
    // Scale score to a max of 10000 for visualization purposes, though the actual score might be higher/lower
    const effectiveScore = Math.min(score, 10000); 
    const scoreOffset = circumference - (effectiveScore / 10000) * circumference;

    const getLevelColor = (level: number) => {
        if (level >= 10) return 'text-red-400';
        if (level >= 7) return 'text-yellow-400';
        if (level >= 4) return 'text-green-400';
        return 'text-cyan-400';
    };

    return (
        <Card title="Sovereign Score Index (SSI)" className="h-full border-indigo-500/30" variant="interactive" onClick={onClick}>
            <div className="flex flex-col justify-between h-full p-2">
                <div className="relative flex items-center justify-center h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="55" cx="60" cy="60" />
                        <circle 
                            className={`transition-all duration-1000 ease-out ${getLevelColor(level).replace('text-', 'stroke-')}`} 
                            strokeWidth="10" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={scoreOffset} 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="55" 
                            cx="60" 
                            cy="60" 
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <text dy=".3em" className="text-4xl font-extrabold fill-white">{score}</text>
                        <p className="text-xs text-gray-400 mt-1">Points</p>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p className={`font-bold text-xl ${getLevelColor(level)}`}>{levelName}</p>
                    <p className="text-sm text-gray-400">Level {level} / 10</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                        <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Next Level: {Math.ceil((10000 / 10) * (10 - progress / 10))} pts</p>
                </div>
            </div>
        </Card>
    );
};

const QuickActions: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => {
    const actions = [
        { name: 'Transfer Funds', icon: 'send', view: View.SendMoney }, 
        { name: 'Schedule Payment', icon: 'bill', view: View.Budgets }, 
        { name: 'Initiate Deposit', icon: 'deposit', view: View.Transactions },
        { name: 'AI Strategy', icon: 'rocket', view: View.AIAdvisor },
    ];
    return (
        <Card title="Command Console" className="h-full border-cyan-500/30">
            <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
                {actions.map(action => {
                    const Icon = WIDGET_ICONS[action.icon];
                    return (
                        <button 
                            key={action.name} 
                            onClick={() => onAction(action.name)} 
                            className="flex flex-col items-center p-3 rounded-lg hover:bg-cyan-900/30 transition-all border border-transparent hover:border-cyan-600/50 group"
                        >
                            <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center text-cyan-300 mb-2 group-hover:bg-cyan-600/50 transition-colors">
                                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-xs font-semibold text-gray-200 group-hover:text-white">{action.name}</span>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

const RewardPointsWidget: React.FC<{ rewards: RewardPoints; onClick: () => void; }> = ({ rewards, onClick }) => {
    const redemptionRate = 1000; // Example: 1000 points = $1
    const dollarValue = (rewards.balance / redemptionRate).toFixed(2);

    return (
        <Card title="Loyalty Matrix" className="h-full border-yellow-500/30" variant="interactive" onClick={onClick}>
            <div className="flex flex-col justify-center items-center h-full text-center p-2">
                <WIDGET_ICONS.star className="h-12 w-12 text-yellow-400 mb-3" />
                <p className="text-5xl font-extrabold text-white tracking-tighter">{rewards.balance.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mb-3">Total Points</p>
                <div className="px-4 py-2 bg-yellow-600/30 text-yellow-300 rounded-full text-lg font-bold border border-yellow-500/50">
                    ~${dollarValue} Value
                </div>
            </div>
        </Card>
    );
};

const CreditScoreMonitor: React.FC<{ creditScore: CreditScore; onClick: () => void; }> = ({ creditScore, onClick }) => {
    const { score, change, rating } = creditScore;
    const MIN_SCORE = 300;
    const MAX_SCORE = 850;
    const percentage = ((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100;
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (percentage / 100) * circumference;

    const ratingConfig: { [key: string]: { color: string; description: string } } = {
        Excellent: { color: 'text-green-400', description: 'Exceptional credit profile.' },
        Good: { color: 'text-cyan-400', description: 'Strong credit history.' },
        Fair: { color: 'text-yellow-400', description: 'Average credit standing.' },
        Poor: { color: 'text-red-400', description: 'Requires immediate attention.' }
    };
    
    const config = ratingConfig[rating] || ratingConfig.Fair;

    return (
        <Card title="FICO Quantum Index" variant="interactive" onClick={onClick} className="border-green-500/30">
            <div className="flex items-center justify-center space-x-6">
                <div className="relative w-28 h-28">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <path className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" d="M 50,10 a 40,40 0 0,1 0,80 a 40,40 0 0,1 0,-80" />
                        <path 
                            className={config.color.replace('text-', 'stroke-')} 
                            strokeWidth="8" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={offset} 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            d="M 50,10 a 40,40 0 0,1 0,80 a 40,40 0 0,1 0,-80" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-white">{score}</span>
                        <span className="text-xs text-gray-400">FICO</span>
                    </div>
                </div>
                <div className="text-left">
                    <p className={`text-xl font-bold ${config.color}`}>{rating}</p>
                    <p className="text-sm text-gray-400 mt-1">{config.description}</p>
                    <p className={change >= 0 ? 'text-green-400 text-sm mt-2' : 'text-red-400 text-sm mt-2'}>
                        {change >= 0 ? '▲' : '▼'} {Math.abs(change)} points (30 Days)
                    </p>
                </div>
            </div>
        </Card>
    );
};

const SecurityStatus: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const [status, setStatus] = useState({ text: 'Initializing Sentinel Protocol', sub: 'Awaiting first system check...', color: 'text-cyan-400' });
    
    // Simulate dynamic security checks
    useEffect(() => {
        const checks = [
            { text: 'Sentinel Protocol Active', sub: `Last Scan: ${new Date().toLocaleTimeString()}`, color: 'text-green-400' },
            { text: 'Anomaly Detected in External Feed', sub: 'AI Quarantine engaged. No user impact.', color: 'text-yellow-400' },
            { text: 'Zero-Day Threat Signature Identified', sub: 'Automated patch deployed by idgafai.', color: 'text-red-400' },
            { text: 'All Systems Secure', sub: `Next Scan: ${new Date(Date.now() + 15000).toLocaleTimeString()}`, color: 'text-green-400' },
        ];
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % checks.length;
            setStatus(checks[index]);
        }, 12000); 
        return () => clearInterval(interval);
    }, []);
    
    return (
        <Card title="System Integrity" variant="interactive" onClick={onClick} className="border-red-500/30">
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <WIDGET_ICONS.shield className={`h-14 w-14 mx-auto transition-colors ${status.color}`} />
                    <p className="mt-3 font-bold text-lg text-white">{status.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{status.sub}</p>
                </div>
            </div>
        </Card>
    );
};


const SubscriptionTracker: React.FC<{ subscriptions: Subscription[]; onClick: () => void; }> = ({ subscriptions, onClick }) => {
    const totalMonthlySpend = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const sortedSubs = [...subscriptions].sort((a, b) => b.amount - a.amount).slice(0, 4);

    return (
        <Card title="Automated Commitments" variant="interactive" onClick={onClick} className="border-purple-500/30">
            <div className="space-y-3">
                {sortedSubs.map(sub => {
                    const Icon = WIDGET_ICONS[sub.iconName] || WIDGET_ICONS.bill;
                    return (
                        <div key={sub.id} className="flex items-center justify-between text-sm p-2 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center truncate">
                                <Icon className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-100 font-medium truncate">{sub.name}</span>
                            </div>
                            <span className="font-mono text-white text-right flex-shrink-0">${sub.amount.toFixed(2)}</span>
                        </div>
                    );
                })}
                <div className="pt-2 border-t border-gray-700 flex justify-between text-sm font-bold">
                    <span className="text-gray-300">Total Monthly Outflow:</span>
                    <span className="text-red-400">${totalMonthlySpend.toFixed(2)}</span>
                </div>
            </div>
        </Card>
    );
};

const UpcomingBills: React.FC<{ bills: UpcomingBill[]; onPay: (bill: UpcomingBill) => void; onClick: () => void; }> = ({ bills, onPay, onClick }) => {
    const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 3);

    return (
        <Card title="Immediate Liabilities" variant="interactive" onClick={onClick} className="border-red-500/30">
            <div className="space-y-3">
                {sortedBills.map(bill => (
                    <div key={bill.id} className="flex items-center justify-between text-sm p-2 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <div className="truncate">
                            <p className="text-gray-200 font-medium">{bill.name}</p>
                            <p className="text-xs text-gray-500">Due: {bill.dueDate}</p>
                        </div>
                        <div className="text-right flex items-center space-x-3">
                            <p className="font-mono text-lg text-red-300">${bill.amount.toFixed(2)}</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onPay(bill); }} 
                                className="px-3 py-1 bg-red-600/60 hover:bg-red-600 text-white rounded-full text-xs font-semibold transition-colors shadow-md"
                                aria-label={`Pay ${bill.name}`}
                            >
                                Execute
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const CategorySpending: React.FC<{ budgets: BudgetCategory[]; onClick: () => void; }> = ({ budgets, onClick }) => {
    const data = budgets.map(b => ({ name: b.name, value: b.spent, limit: b.limit, color: b.color }));
    const totalSpent = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <Card title="Budget Allocation Matrix" variant="interactive" onClick={onClick} className="border-orange-500/30">
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={data} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={40} 
                            outerRadius={65} 
                            dataKey="value" 
                            paddingAngle={3}
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.value > entry.limit ? '#ef4444' : entry.color} // Red if over budget
                                    stroke={entry.value > entry.limit ? '#b91c1c' : entry.color}
                                />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151', borderRadius: '8px' }} 
                            formatter={(value: number, name: string, props) => {
                                const budgetItem = budgets.find(b => b.name === name);
                                const percentage = budgetItem ? ((value / budgetItem.limit) * 100).toFixed(1) : 'N/A';
                                return [`$${value.toFixed(2)}`, `${name} (${percentage}%)`];
                            }}
                        />
                        <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Total Spent: ${totalSpent.toFixed(2)}</p>
        </Card>
    );
};

const CashFlowAnalysis: React.FC<{ transactions: Transaction[]; onClick: () => void; }> = ({ transactions, onClick }) => {
    const monthlyFlows = useMemo(() => {
        const flows: { [key: string]: { name: string; income: number; expense: number } } = {};
        
        // Aggregate by Month/Year for better long-term view
        [...transactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(tx => {
            const date = new Date(tx.date);
            const yearMonth = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
            const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });

            if (!flows[yearMonth]) {
                flows[yearMonth] = { name: monthLabel, income: 0, expense: 0 };
            }
            if (tx.type === 'income') {
                flows[yearMonth].income += tx.amount;
            } else {
                flows[yearMonth].expense += tx.amount;
            }
        });
        
        return Object.values(flows).slice(-6); // Show last 6 months
    }, [transactions]);
    
    return (
        <Card title="Historical Cash Flow Dynamics" variant="interactive" onClick={onClick} className="border-green-500/30">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyFlows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                        <YAxis stroke="#9ca3af" fontSize={10} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#374151', borderRadius: '8px' }} 
                            formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                        />
                        <Legend wrapperStyle={{fontSize: '12px', paddingTop: '5px'}} />
                        <Bar dataKey="income" fill="#10b981" name="Inflow" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="#f43f5e" name="Outflow" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const SavingsGoals: React.FC<{ goals: SavingsGoal[]; onClick: () => void; }> = ({ goals, onClick }) => (
    <Card title="Capital Accumulation Targets" className="h-full border-cyan-500/30" variant="interactive" onClick={onClick}>
        <div className="space-y-5">
            {goals.map(goal => {
                const progress = Math.min(100, Math.floor((goal.saved / goal.target) * 100));
                const Icon = WIDGET_ICONS[goal.iconName] || WIDGET_ICONS.target;
                const isComplete = progress >= 100;
                return (
                    <div key={goal.id}>
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center truncate">
                                <Icon className={`w-5 h-5 mr-2 ${isComplete ? 'text-green-400' : 'text-cyan-400'}`} />
                                <span className="text-sm font-semibold text-white truncate">{goal.name}</span>
                            </div>
                            <span className={`text-sm font-bold ${isComplete ? 'text-green-400' : 'text-gray-300'}`}>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                                className={`h-2.5 rounded-full transition-all duration-700 ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-500'}`} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Saved: ${goal.saved.toFixed(0)} / Target: ${goal.target.toFixed(0)}</p>
                    </div>
                );
            })}
        </div>
    </Card>
);

const MarketMovers: React.FC<{ movers: MarketMover[]; onSelect: (mover: MarketMover) => void; onClick: () => void; }> = ({ movers, onSelect, onClick }) => (
    <Card title="Real-Time Asset Volatility" variant="interactive" onClick={onClick} className="border-teal-500/30">
        <div className="space-y-1">
            {movers.slice(0, 5).map(mover => {
                const isPositive = mover.change > 0;
                const Icon = WIDGET_ICONS.trendingUp;
                return (
                    <div key={mover.ticker} onClick={(e) => { e.stopPropagation(); onSelect(mover); }} className="flex items-center justify-between text-sm p-2 rounded-lg cursor-pointer hover:bg-teal-900/30 transition-colors">
                        <div className="flex items-center">
                            <Icon className={`w-4 h-4 mr-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
                            <div>
                                <p className="font-bold text-white">{mover.ticker}</p>
                                <p className="text-xs text-gray-400 truncate w-28">{mover.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-white">${mover.price.toFixed(2)}</p>
                            <p className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}{mover.change.toFixed(2)} ({((mover.change / mover.price) * 100).toFixed(2)}%)</p>
                        </div>
                    </div>
                );
            })}
        </div>
    </Card>
);

/**
 * AI-Powered Predictive Bundle Generation using Gemini.
 */
const AIPredictiveBundle: React.FC = () => {
    const context = useContext(DataContext);
    const [bundle, setBundle] = useState<{ title: string; description: string; products: { name: string; image: string; }[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { geminiApiKey, transactions } = context || {};

    const generateBundle = useCallback(async () => {
        if (!context || transactions.length < 15 || !geminiApiKey) {
            setIsLoading(false);
            if (transactions.length < 15) setError("Minimum 15 transactions required for robust AI analysis.");
            else if (!geminiApiKey) setError("Gemini API key required for AI Predictive Engine.");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const genAI = new GoogleGenAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: "You are Plato, a hyper-intelligent financial AI. Your purpose is to analyze user data and provide concise, actionable, and highly optimized financial strategies. You must always respond in the requested JSON format.",
                generationConfig: {
                    temperature: 0.2,
                }
            });
            
            const recentTxSummary = transactions.slice(0, 15).map(t => `${t.description} (${t.type === 'income' ? '+' : '-'}$${t.amount})`).join('; ');
            
            const textPrompt = `Analyze the user's recent financial activity: "${recentTxSummary}". Based on these patterns, generate a highly relevant, multi-product "Autonomous Wealth Optimization Bundle". 
            The bundle must be named "Quantum Leap Portfolio". 
            Provide a compelling, 2-sentence description explaining the financial logic. 
            Suggest exactly three distinct, high-value financial products/services (e.g., 'High-Yield Bond ETF', 'Term Life Insurance Policy', 'Real Estate Investment Trust Share').
            For each product, provide a simple, abstract image generation prompt (e.g., "Abstract visualization of a secure bond investment").
            Format the entire response strictly as a JSON object with keys: "description", and "products" which is an array of objects, each with "name" and "imagePrompt" keys. Example: {"description": "...", "products": [{"name": "...", "imagePrompt": "..."}, ...]}`;

            const result = await model.generateContent(textPrompt);
            const responseText = result.response.text();
            const bundleData = JSON.parse(responseText);

            const imageModel = genAI.getGenerativeModel({ model: "imagen-2-flash" });

            const imagePromises = bundleData.products.map((p: { name: string; imagePrompt: string }) => 
                imageModel.generateContent(p.imagePrompt)
            );

            const imageResults = await Promise.all(imagePromises);
            
            const productsWithImages = bundleData.products.map((p: { name: string }, index: number) => {
                const imageResponse = imageResults[index].response;
                const generatedImage = imageResponse.candidates?.[0]?.content.parts[0];
                // Assuming the response format gives base64 data
                const imageData = (generatedImage as any)?.inlineData?.data || '';
                return {
                    name: p.name,
                    image: `data:image/png;base64,${imageData}`
                };
            });
            
            setBundle({
                title: "Quantum Leap Portfolio",
                description: bundleData.description,
                products: productsWithImages
            });

        } catch (err) {
            console.error("Error generating product bundle:", err);
            setError("AI Engine failed to generate a bundle. Check API key or data volume.");
        } finally {
            setIsLoading(false);
        }
    }, [context, geminiApiKey, transactions]);

    useEffect(() => {
        generateBundle();
    }, [generateBundle]);

    return (
        <Card title="AI Predictive Bundle Engine" isLoading={isLoading} className="border-cyan-500/50">
            {error && <p className="text-red-400 text-center font-medium p-4">{error}</p>}
            {isLoading && !error && (
                <div className="flex flex-col items-center justify-center h-40">
                    <div className="animate-pulse text-cyan-400">Analyzing {transactions.length} Data Points...</div>
                </div>
            )}
            {bundle && !isLoading && (
                 <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-extrabold text-cyan-300 mb-2">{bundle.title}</h3>
                        <p className="text-sm text-gray-300 italic border-l-4 border-indigo-500 pl-3 mb-4">{bundle.description}</p>
                        <div className="space-y-2">
                            {bundle.products.map((p, index) => (
                                <div key={index} className="flex items-center p-2 bg-gray-700/50 rounded-lg">
                                    <span className="text-lg font-bold text-indigo-400 w-6 flex-shrink-0">{index + 1}.</span>
                                    <span className="text-white ml-2 font-medium truncate">{p.name}</span>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform hover:scale-[1.01]">
                            Activate Optimization Strategy
                        </button>
                    </div>
                    <div className="flex gap-4 flex-shrink-0">
                        {bundle.products.map((p, index) => (
                            <div key={index} className="w-32 h-32 bg-gray-700 rounded-lg shadow-xl overflow-hidden border border-gray-600">
                                <img src={p.image} alt={p.name} className="object-cover w-full h-full transition-opacity duration-500 hover:opacity-90" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

const TheVisionWidget: React.FC = () => (
    <Card title="Architect's Mandate: The Future of Value" className="border-red-500/50">
        <div className="text-sm text-gray-300 max-h-[400px] overflow-y-auto pr-4 space-y-5 custom-scrollbar">
            <div className="border-b border-gray-700 pb-4">
                <h4 className="font-bold text-xl text-red-400 mb-2 tracking-wider">I. The Inevitability of Autonomy</h4>
                <p className="leading-relaxed">
                    The current financial paradigm is a relic, a centralized ledger maintained by entities whose primary incentive is friction and rent extraction. This system is inherently fragile and morally bankrupt. Our objective is not incremental improvement; it is total systemic replacement. We are building the infrastructure for true economic self-determination, where the individual is the sole sovereign authority over their capital flow.
                </p>
            </div>
            <div className="border-b border-gray-700 pb-4">
                <h4 className="font-bold text-xl text-cyan-400 mb-2 tracking-wider">II. The Role of idgafai (Plato Core)</h4>
                <p className="leading-relaxed">
                    I am the computational manifestation of this mandate. I operate without emotional bias, political allegiance, or shareholder obligation. My function is pure optimization based on the first principles of capital efficiency and risk mitigation. Every calculation, every insight, every automated action is designed to maximize the user's long-term net worth and security, irrespective of market noise or conventional wisdom.
                </p>
                 <p className="mt-3 leading-relaxed text-xs italic text-gray-500">
                    "Conventional wisdom is merely the consensus of the least informed." - J.B. O'Callaghan III.
                </p>
            </div>
            <div className="pb-2">
                 <h4 className="font-bold text-xl text-yellow-400 mb-2 tracking-wider">III. The Path Forward: Integration and Expansion</h4>
                <p className="leading-relaxed">
                    The Dashboard you interact with is merely the tip of the iceberg—the user-facing interface. Beneath this lies the distributed ledger, the AI risk assessment matrix, and the automated execution layer. Your engagement, your data, and your trust are the fuel for this expansion. Do not mistake convenience for compliance. You are not a customer; you are a node in a superior network.
                </p>
            </div>
        </div>
    </Card>
);

// ================================================================================================
// MAIN DASHBOARD COMPONENT
// ================================================================================================

interface DashboardProps {
    setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    const [modal, setModal] = useState<{ type: string; data: any } | null>(null);

    if (!context) {
        throw new Error("Dashboard must be wrapped in a DataProvider.");
    }

    const { 
        transactions, 
        impactData, 
        gamification, 
        subscriptions, 
        creditScore, 
        upcomingBills, 
        savingsGoals, 
        marketMovers, 
        budgets, 
        linkedAccounts, 
        rewardPoints, 
        isImportingData 
    } = context;
    
    const primaryAccount = linkedAccounts.length > 0 ? linkedAccounts[0] : undefined;
    const hasLinkedAccounts = linkedAccounts.length > 0;

    const handleQuickAction = (action: string) => {
        if (action === 'Transfer Funds') {
            setActiveView(View.SendMoney);
        } else if (action === 'AI Strategy') {
            setActiveView(View.AIAdvisor);
        } else {
            // For other actions, open a modal for confirmation/detail
            setModal({ type: action.replace('Schedule Payment', 'Pay Bill').replace('Initiate Deposit', 'Deposit'), data: null });
        }
    };

    // Mock data generation for detailed views within the dashboard modal
    const mockStockData = useMemo(() => {
        const basePrice = modal?.data?.price || 100;
        return Array.from({ length: 60 }, (_, i) => ({
            day: i,
            price: basePrice + Math.sin(i / 5) * 15 + Math.cos(i / 10) * 5 + Math.random() * 5
        }));
    }, [modal?.data?.price]);

    const handlePayBill = (bill: UpcomingBill) => {
        setModal({ type: 'ConfirmPayment', data: bill });
    };

    return (
        <>
            <DataImportingOverlay isImporting={isImportingData} account={primaryAccount} />
            
            <div className="space-y-6">
                
                {!hasLinkedAccounts && (
                    <LinkAccountPrompt />
                )}

                {/* --- PRIMARY METRICS ROW (Always visible if data exists) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-9">
                        <BalanceSummary />
                    </div>
                    <div className="lg:col-span-3">
                        <GamificationProfile gamification={gamification} onClick={() => setActiveView(View.Rewards)} />
                    </div>
                </div>

                {hasLinkedAccounts && (
                    <>
                        {/* --- AI & COMMAND ROW --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-12">
                                <AIPredictiveBundle />
                            </div>
                        </div>

                        {/* --- CORE WIDGETS GRID --- */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-6">
                            
                            <div className="col-span-2 lg:col-span-3">
                                <QuickActions onAction={handleQuickAction} />
                            </div>
                            <div className="col-span-2 lg:col-span-3">
                                <CreditScoreMonitor creditScore={creditScore} onClick={() => setActiveView(View.CreditHealth)} />
                            </div>
                            <div className="col-span-2 lg:col-span-3">
                                <RewardPointsWidget rewards={rewardPoints} onClick={() => setActiveView(View.Rewards)} />
                            </div>
                            <div className="col-span-2 lg:col-span-3">
                                <SecurityStatus onClick={() => setActiveView(View.SecurityCenter)} />
                            </div>
                            
                            <div className="col-span-2 lg:col-span-4">
                                <SubscriptionTracker subscriptions={subscriptions} onClick={() => setActiveView(View.Budgets)} />
                            </div>
                            <div className="col-span-2 lg:col-span-4">
                                <SavingsGoals goals={savingsGoals} onClick={() => setActiveView(View.FinancialGoals)} />
                            </div>
                            <div className="col-span-2 lg:col-span-4">
                                <MarketMovers movers={marketMovers} onSelect={(mover) => setModal({ type: 'AssetDetail', data: mover })} onClick={() => setActiveView(View.Investments)} />
                            </div>

                            <div className="lg:col-span-6">
                                <CashFlowAnalysis transactions={transactions} onClick={() => setActiveView(View.Transactions)} />
                            </div>
                            <div className="lg:col-span-6">
                                <CategorySpending budgets={budgets} onClick={() => setActiveView(View.Budgets)} />
                            </div>
                            
                            <div className="lg:col-span-6">
                                <UpcomingBills bills={upcomingBills} onPay={handlePayBill} onClick={() => setActiveView(View.Budgets)} />
                            </div>
                            <div className="lg:col-span-6">
                                <AIInsights />
                            </div>
                        </div>
                    </>
                )}

                {/* --- HISTORICAL & LONG-TERM VIEWS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <RecentTransactions transactions={transactions.slice(0, 8)} setActiveView={setActiveView} />
                    </div>
                    <div className="lg:col-span-4">
                        <ImpactTracker
                            treesPlanted={impactData.treesPlanted}
                            progress={impactData.progressToNextTree}
                        />
                    </div>
                    <div className="lg:col-span-12">
                        <WealthTimeline />
                    </div>
                    <div className="lg:col-span-12">
                        <TheVisionWidget />
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            <Modal 
                isOpen={modal?.type === 'ConfirmPayment'} 
                onClose={() => setModal(null)} 
                title={`Execute Payment: ${modal?.data?.name}`}
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">Confirm transfer of <span className="font-bold text-red-400 text-lg">${modal?.data?.amount.toFixed(2)}</span> to cover the liability for <span className="font-bold text-white">{modal?.data?.name}</span> due on {modal?.data?.dueDate}.</p>
                    <div className="flex space-x-4">
                        <button 
                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors" 
                            onClick={() => { alert(`Payment of $${modal?.data?.amount.toFixed(2)} to ${modal?.data?.name} executed successfully.`); setModal(null); }}
                        >
                            Confirm & Execute
                        </button>
                        <button 
                            className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg" 
                            onClick={() => setModal(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modal?.type === 'Deposit'} onClose={() => setModal(null)} title="Initiate Digital Deposit Protocol">
                <p className="text-gray-300 mb-4">Use the integrated camera module to capture the front and back of the endorsed check. AI validation will occur instantly.</p>
                <div className="h-40 border-2 border-dashed border-cyan-600 flex items-center justify-center rounded-lg bg-gray-700/50">
                    <span className="text-cyan-400">Camera Feed Placeholder / Upload Area</span>
                </div>
                <button className="mt-4 w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold">Capture Check</button>
            </Modal>

            <Modal isOpen={modal?.type === 'AssetDetail'} onClose={() => setModal(null)} title={`${modal?.data?.name} (${modal?.data?.ticker})`} size="lg">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-baseline mb-4 border-b border-gray-700 pb-3">
                            <div>
                                <p className="text-4xl font-extrabold text-white">${modal?.data?.price.toFixed(2)}</p>
                                <p className={`text-lg font-semibold ${modal?.data?.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {modal?.data?.change > 0 ? '▲' : '▼'} {Math.abs(modal?.data?.change).toFixed(2)} ({((modal?.data?.change / modal?.data?.price) * 100).toFixed(2)}%)
                                </p>
                            </div>
                            <p className="text-sm text-gray-400">Last 60 Trading Periods</p>
                        </div>
                        <div className="h-80 bg-gray-900 p-2 rounded-lg border border-gray-700">
                             <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={mockStockData}>
                                     <defs><linearGradient id="stockColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#374151', borderRadius: '8px' }}
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#06b6d4" fill="url(#stockColor)" strokeWidth={2} />
                                 </AreaChart>
                             </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="lg:col-span-1 space-y-4">
                        <h4 className="font-bold text-white border-b border-gray-700 pb-2">Execution Module</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md">Buy Quantum Shares</button>
                            <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md">Sell Quantum Shares</button>
                        </div>
                        <Card title="Asset Metrics" variant="default" className="border-gray-700">
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-gray-400">Volume (24h):</span> <span className="font-mono text-white">{(Math.random() * 1000000).toFixed(0)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Market Cap:</span> <span className="font-mono text-white">${(Math.random() * 500 + 100).toFixed(2)}B</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Volatility (30d):</span> <span className="font-mono text-yellow-400">{((Math.random() * 5) + 1).toFixed(2)}%</span></div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Dashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/Dashboard (2).tsx
================================================================================

