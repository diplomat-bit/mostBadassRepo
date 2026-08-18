// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/StripeNexusView.tsx
================================================================================


import React, { useState, useContext } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { 
    Zap, Users, Layers, FileText, 
    ShieldCheck, Activity, CheckCircle2, ArrowUpRight, 
    ArrowDownLeft, Filter
} from 'lucide-react';
import VirtualAccountsDashboard from './VirtualAccountsDashboard';
import ReconciliationHubView from './ReconciliationHubView';
import CounterpartyDashboardView from './CounterpartyDashboardView';

type Tab = 'PAYMENTS' | 'ENTITIES' | 'VIRTUAL_LEDGER' | 'RECONCILIATION';

const StripeNexusView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('PAYMENTS');
    const { deductCredits } = useContext(DataContext)!;

    const mockPayments = [
        { id: 'pi_1', status: 'Succeeded', amount: 12500, customer: 'Nexus Corp', date: '2025-01-22 14:30' },
        { id: 'pi_2', status: 'Pending', amount: 5400, customer: 'Alpha Ventures', date: '2025-01-22 14:45' },
        { id: 'pi_3', status: 'Failed', amount: 98000, customer: 'Gamma Systems', date: '2025-01-21 09:00' }
    ];

    const handleAction = (cost: number) => {
        if (deductCredits(cost)) {
            alert(`Action authorized. Cost: ${cost} SC deducted from Sovereign Balance.`);
        }
    };

    const renderPayments = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-950/10 border-emerald-500/30">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Gross Volume (24h)</p>
                    <p className="text-3xl font-black text-white font-mono">$1,284,500</p>
                </Card>
                <Card className="bg-indigo-950/10 border-indigo-500/30">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Net Volume (24h)</p>
                    <p className="text-3xl font-black text-white font-mono">$1,210,000</p>
                </Card>
                <Card className="bg-amber-950/10 border-amber-500/30">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Success Rate</p>
                    <p className="text-3xl font-black text-white font-mono">99.8%</p>
                </Card>
            </div>
            
            <Card title="Payment Intent Registry" className="p-0 overflow-hidden bg-black/40 border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="bg-gray-900/80 border-b border-gray-800 text-[10px] text-gray-500 font-black uppercase">
                            <tr>
                                <th className="px-6 py-4">Intent ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Entity</th>
                                <th className="px-6 py-4 text-right">Magnitude</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {mockPayments.map(p => (
                                <tr key={p.id} className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-4 text-cyan-400 font-bold">{p.id}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                                            p.status === 'Succeeded' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                            p.status === 'Pending' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                                            'border-red-500/30 text-red-400 bg-red-500/5'
                                        }`}>{p.status.toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{p.customer}</td>
                                    <td className="px-6 py-4 text-right font-black text-white">${p.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleAction(100)}
                                            className="text-[10px] font-black text-gray-500 hover:text-cyan-400 uppercase tracking-widest"
                                        >
                                            Refund (100 SC)
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 h-full">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Stripe Nexus</h1>
                    <p className="text-cyan-400 text-sm font-mono mt-1 tracking-[0.3em] uppercase">Unified Financial Suite // Rail-01</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl flex items-center gap-3">
                        <Activity className="text-green-500 animate-pulse" size={18} />
                        <span className="text-xs font-bold text-gray-400 uppercase">Rail Status: NOMINAL</span>
                    </div>
                </div>
            </header>

            <div className="flex gap-2 bg-gray-900/50 p-1 rounded-2xl border border-gray-800 w-fit">
                {[
                    { id: 'PAYMENTS', label: 'Payments', icon: <Zap size={14} /> },
                    { id: 'ENTITIES', label: 'Counterparties', icon: <Users size={14} /> },
                    { id: 'VIRTUAL_LEDGER', label: 'Virtual Accounts', icon: <Layers size={14} /> },
                    { id: 'RECONCILIATION', label: 'Reconciliation', icon: <CheckCircle2 size={14} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                            activeTab === tab.id ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <main className="min-h-[500px]">
                {activeTab === 'PAYMENTS' && renderPayments()}
                {activeTab === 'ENTITIES' && <CounterpartyDashboardView />}
                {activeTab === 'VIRTUAL_LEDGER' && <VirtualAccountsDashboard />}
                {activeTab === 'RECONCILIATION' && <ReconciliationHubView />}
            </main>
        </div>
    );
};

export default StripeNexusView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/StripeNexusView.tsx
================================================================================

import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Zap, Users, Layers, CheckCircle2 } from 'lucide-react';

// Assuming these components exist in your project
import Card from './Card';
import VirtualAccountsDashboard from './VirtualAccountsDashboard';
import ReconciliationHubView from './ReconciliationHubView';
import CounterpartyDashboardView from './CounterpartyDashboardView';

type Tab = 'PAYMENTS' | 'ENTITIES' | 'VIRTUAL_LEDGER' | 'RECONCILIATION';

// RENAMED: from `useStripeNexusView` to `StripeNexusView` to follow component conventions
const StripeNexusView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('PAYMENTS');
    const dataContext = useContext(DataContext);
    
    // Safety check for context
    if (!dataContext) {
        throw new Error("StripeNexusView must be used within a DataProvider");
    }
    const { deductCredits } = dataContext;

    const mockPayments = [
        { id: 'pi_1', status: 'Succeeded', amount: 12500, customer: 'Nexus Corp', date: '2025-01-22 14:30' },
        { id: 'pi_2', status: 'Pending', amount: 5400, customer: 'Alpha Ventures', date: '2025-01-22 14:45' },
        { id: 'pi_3', status: 'Failed', amount: 98000, customer: 'Gamma Systems', date: '2025-01-21 09:00' }
    ];

    const handleAction = (cost: number) => {
        if (deductCredits(cost)) {
            alert(`Action authorized. Cost: ${cost} SC deducted from Sovereign Balance.`);
        }
    };

    const renderPayments = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-950/10 border-emerald-500/30">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Gross Volume (24h)</p>
                    <p className="text-3xl font-black text-white font-mono">$1,284,500</p>
                </Card>
                <Card className="bg-indigo-950/10 border-indigo-500/30">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Net Volume (24h)</p>
                    <p className="text-3xl font-black text-white font-mono">$1,210,000</p>
                </Card>
                <Card className="bg-amber-950/10 border-amber-500/30">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Success Rate</p>
                    <p className="text-3xl font-black text-white font-mono">99.8%</p>
                </Card>
            </div>
            
            <Card title="Payment Intent Registry" className="p-0 overflow-hidden bg-black/40 border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="bg-gray-900/80 border-b border-gray-800 text-[10px] text-gray-500 font-black uppercase">
                            <tr>
                                <th className="px-6 py-4">Intent ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Entity</th>
                                <th className="px-6 py-4 text-right">Magnitude</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {mockPayments.map(p => (
                                <tr key={p.id} className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-4 text-cyan-400 font-bold">{p.id}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                                            p.status === 'Succeeded' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                            p.status === 'Pending' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                                            'border-red-500/30 text-red-400 bg-red-500/5'
                                        }`}>{p.status.toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{p.customer}</td>
                                    <td className="px-6 py-4 text-right font-black text-white">${p.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleAction(100)}
                                            className="text-[10px] font-black text-gray-500 hover:text-cyan-400 uppercase tracking-widest"
                                        >
                                            Refund (100 SC)
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 h-full">
            {/* ... rest of your JSX remains the same */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Stripe Nexus</h1>
                    <p className="text-cyan-400 text-sm font-mono mt-1 tracking-[0.3em] uppercase">Unified Financial Suite // Rail-01</p>
                </div>
                {/* ... */}
            </header>

            <div className="flex gap-2 bg-gray-900/50 p-1 rounded-2xl border border-gray-800 w-fit">
                {[
                    { id: 'PAYMENTS', label: 'Payments', icon: <Zap size={14} /> },
                    { id: 'ENTITIES', label: 'Counterparties', icon: <Users size={14} /> },
                    { id: 'VIRTUAL_LEDGER', label: 'Virtual Accounts', icon: <Layers size={14} /> },
                    { id: 'RECONCILIATION', label: 'Reconciliation', icon: <CheckCircle2 size={14} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                            activeTab === tab.id ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <main className="min-h-[500px]">
                {activeTab === 'PAYMENTS' && renderPayments()}
                {activeTab === 'ENTITIES' && <CounterpartyDashboardView />}
                {activeTab === 'VIRTUAL_LEDGER' && <VirtualAccountsDashboard />}
                {activeTab === 'RECONCILIATION' && <ReconciliationHubView />}
            </main>
        </div>
    );
};

// RENAMED: Export the renamed component
export default StripeNexusView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/StripeNexusView_1.tsx
================================================================================

import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Zap, Users, Layers, CheckCircle2 } from 'lucide-react';

// Assuming these components exist in your project
import Card from './Card';
import VirtualAccountsDashboard from './VirtualAccountsDashboard';
import ReconciliationHubView from './ReconciliationHubView';
import CounterpartyDashboardView from './CounterpartyDashboardView';

type Tab = 'PAYMENTS' | 'ENTITIES' | 'VIRTUAL_LEDGER' | 'RECONCILIATION';

// RENAMED: from `useStripeNexusView` to `StripeNexusView` to follow component conventions
const StripeNexusView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('PAYMENTS');
    const dataContext = useContext(DataContext);
    
    // Safety check for context
    if (!dataContext) {
        throw new Error("StripeNexusView must be used within a DataProvider");
    }
    const { deductCredits } = dataContext;

    const mockPayments = [
        { id: 'pi_1', status: 'Succeeded', amount: 12500, customer: 'Nexus Corp', date: '2025-01-22 14:30' },
        { id: 'pi_2', status: 'Pending', amount: 5400, customer: 'Alpha Ventures', date: '2025-01-22 14:45' },
        { id: 'pi_3', status: 'Failed', amount: 98000, customer: 'Gamma Systems', date: '2025-01-21 09:00' }
    ];

    const handleAction = (cost: number) => {
        if (deductCredits(cost)) {
            alert(`Action authorized. Cost: ${cost} SC deducted from Sovereign Balance.`);
        }
    };

    const renderPayments = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-950/10 border-emerald-500/30">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Gross Volume (24h)</p>
                    <p className="text-3xl font-black text-white font-mono">$1,284,500</p>
                </Card>
                <Card className="bg-indigo-950/10 border-indigo-500/30">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Net Volume (24h)</p>
                    <p className="text-3xl font-black text-white font-mono">$1,210,000</p>
                </Card>
                <Card className="bg-amber-950/10 border-amber-500/30">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Success Rate</p>
                    <p className="text-3xl font-black text-white font-mono">99.8%</p>
                </Card>
            </div>
            
            <Card title="Payment Intent Registry" className="p-0 overflow-hidden bg-black/40 border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="bg-gray-900/80 border-b border-gray-800 text-[10px] text-gray-500 font-black uppercase">
                            <tr>
                                <th className="px-6 py-4">Intent ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Entity</th>
                                <th className="px-6 py-4 text-right">Magnitude</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {mockPayments.map(p => (
                                <tr key={p.id} className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-4 text-cyan-400 font-bold">{p.id}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                                            p.status === 'Succeeded' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                            p.status === 'Pending' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                                            'border-red-500/30 text-red-400 bg-red-500/5'
                                        }`}>{p.status.toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{p.customer}</td>
                                    <td className="px-6 py-4 text-right font-black text-white">${p.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleAction(100)}
                                            className="text-[10px] font-black text-gray-500 hover:text-cyan-400 uppercase tracking-widest"
                                        >
                                            Refund (100 SC)
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 h-full">
            {/* ... rest of your JSX remains the same */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Stripe Nexus</h1>
                    <p className="text-cyan-400 text-sm font-mono mt-1 tracking-[0.3em] uppercase">Unified Financial Suite // Rail-01</p>
                </div>
                {/* ... */}
            </header>

            <div className="flex gap-2 bg-gray-900/50 p-1 rounded-2xl border border-gray-800 w-fit">
                {[
                    { id: 'PAYMENTS', label: 'Payments', icon: <Zap size={14} /> },
                    { id: 'ENTITIES', label: 'Counterparties', icon: <Users size={14} /> },
                    { id: 'VIRTUAL_LEDGER', label: 'Virtual Accounts', icon: <Layers size={14} /> },
                    { id: 'RECONCILIATION', label: 'Reconciliation', icon: <CheckCircle2 size={14} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                            activeTab === tab.id ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <main className="min-h-[500px]">
                {activeTab === 'PAYMENTS' && renderPayments()}
                {activeTab === 'ENTITIES' && <CounterpartyDashboardView />}
                {activeTab === 'VIRTUAL_LEDGER' && <VirtualAccountsDashboard />}
                {activeTab === 'RECONCILIATION' && <ReconciliationHubView />}
            </main>
        </div>
    );
};

// RENAMED: Export the renamed component
export default StripeNexusView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/StripeNexusView.tsx
================================================================================

import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Zap, Users, Layers, CheckCircle2 } from 'lucide-react';

// Assuming these components exist in your project
import Card from './Card';
import VirtualAccountsDashboard from './VirtualAccountsDashboard';
import ReconciliationHubView from './ReconciliationHubView';
import CounterpartyDashboardView from './CounterpartyDashboardView';

type Tab = 'PAYMENTS' | 'ENTITIES' | 'VIRTUAL_LEDGER' | 'RECONCILIATION';

// RENAMED: from `useStripeNexusView` to `StripeNexusView` to follow component conventions
const StripeNexusView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('PAYMENTS');
    const dataContext = useContext(DataContext);
    
    // Safety check for context
    if (!dataContext) {
        throw new Error("StripeNexusView must be used within a DataProvider");
    }
    const { deductCredits } = dataContext;

    const mockPayments = [
        { id: 'pi_1', status: 'Succeeded', amount: 12500, customer: 'Nexus Corp', date: '2025-01-22 14:30' },
        { id: 'pi_2', status: 'Pending', amount: 5400, customer: 'Alpha Ventures', date: '2025-01-22 14:45' },
        { id: 'pi_3', status: 'Failed', amount: 98000, customer: 'Gamma Systems', date: '2025-01-21 09:00' }
    ];

    const handleAction = (cost: number) => {
        if (deductCredits(cost)) {
            alert(`Action authorized. Cost: ${cost} SC deducted from Sovereign Balance.`);
        }
    };

    const renderPayments = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-950/10 border-emerald-500/30">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Gross Volume (24h)</p>
                    <p className="text-3xl font-black text-white font-mono">$1,284,500</p>
                </Card>
                <Card className="bg-indigo-950/10 border-indigo-500/30">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Net Volume (24h)</p>
                    <p className="text-3xl font-black text-white font-mono">$1,210,000</p>
                </Card>
                <Card className="bg-amber-950/10 border-amber-500/30">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Success Rate</p>
                    <p className="text-3xl font-black text-white font-mono">99.8%</p>
                </Card>
            </div>
            
            <Card title="Payment Intent Registry" className="p-0 overflow-hidden bg-black/40 border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="bg-gray-900/80 border-b border-gray-800 text-[10px] text-gray-500 font-black uppercase">
                            <tr>
                                <th className="px-6 py-4">Intent ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Entity</th>
                                <th className="px-6 py-4 text-right">Magnitude</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {mockPayments.map(p => (
                                <tr key={p.id} className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-4 text-cyan-400 font-bold">{p.id}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                                            p.status === 'Succeeded' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                            p.status === 'Pending' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                                            'border-red-500/30 text-red-400 bg-red-500/5'
                                        }`}>{p.status.toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{p.customer}</td>
                                    <td className="px-6 py-4 text-right font-black text-white">${p.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleAction(100)}
                                            className="text-[10px] font-black text-gray-500 hover:text-cyan-400 uppercase tracking-widest"
                                        >
                                            Refund (100 SC)
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 h-full">
            {/* ... rest of your JSX remains the same */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Stripe Nexus</h1>
                    <p className="text-cyan-400 text-sm font-mono mt-1 tracking-[0.3em] uppercase">Unified Financial Suite // Rail-01</p>
                </div>
                {/* ... */}
            </header>

            <div className="flex gap-2 bg-gray-900/50 p-1 rounded-2xl border border-gray-800 w-fit">
                {[
                    { id: 'PAYMENTS', label: 'Payments', icon: <Zap size={14} /> },
                    { id: 'ENTITIES', label: 'Counterparties', icon: <Users size={14} /> },
                    { id: 'VIRTUAL_LEDGER', label: 'Virtual Accounts', icon: <Layers size={14} /> },
                    { id: 'RECONCILIATION', label: 'Reconciliation', icon: <CheckCircle2 size={14} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                            activeTab === tab.id ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <main className="min-h-[500px]">
                {activeTab === 'PAYMENTS' && renderPayments()}
                {activeTab === 'ENTITIES' && <CounterpartyDashboardView />}
                {activeTab === 'VIRTUAL_LEDGER' && <VirtualAccountsDashboard />}
                {activeTab === 'RECONCILIATION' && <ReconciliationHubView />}
            </main>
        </div>
    );
};

// RENAMED: Export the renamed component
export default StripeNexusView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/StripeNexusView.tsx
================================================================================

```typescript
import React, { useState, useMemo, useCallback } from 'react';

const TheJamesBurvelOCallaghanIIICode = {name: "The James Burvel O'Callaghan III Code", version: "1.0.0", author: "The James Burvel O'Callaghan III"};

const A1_Citibankdemobusinessinc = { // Company A, Feature 1
    name: "Citibankdemobusinessinc",
    description: "A global financial services company providing a wide range of banking and financial products.",
    industry: "Financial Services",
    headquarters: "New York, NY",
    services: ["Retail Banking", "Investment Banking", "Wealth Management"],
    useCases: ["Credit Card Processing", "Loan Origination", "Fraud Detection"],
    apiEndpoints: ["/accounts", "/transactions", "/customers"],
    features: ["Balance Inquiry", "Payment Processing", "Transaction History"],
};

const A2_AcmeCorp = { // Company A, Feature 2
    name: "Acme Corp",
    description: "A diversified conglomerate involved in manufacturing, technology, and services.",
    industry: "Diversified",
    headquarters: "Wilmington, DE",
    services: ["Manufacturing", "Software Development", "Consulting"],
    useCases: ["Supply Chain Management", "Customer Relationship Management", "Data Analytics"],
    apiEndpoints: ["/products", "/orders", "/suppliers"],
    features: ["Product Catalog", "Order Management", "Supplier Portal"],
};

const A3_BetaSolutions = { // Company A, Feature 3
    name: "Beta Solutions",
    description: "A software development company specializing in cloud-based solutions.",
    industry: "Software Development",
    headquarters: "San Francisco, CA",
    services: ["Cloud Computing", "Web Development", "Mobile App Development"],
    useCases: ["SaaS Applications", "Web Hosting", "Mobile Commerce"],
    apiEndpoints: ["/users", "/applications", "/services"],
    features: ["User Authentication", "Application Deployment", "Service Monitoring"],
};

const A4_GammaEnterprises = { // Company A, Feature 4
    name: "Gamma Enterprises",
    description: "A retail company operating a chain of department stores.",
    industry: "Retail",
    headquarters: "Chicago, IL",
    services: ["Retail Sales", "Online Shopping", "Customer Service"],
    useCases: ["Point of Sale Systems", "E-commerce Platforms", "Customer Loyalty Programs"],
    apiEndpoints: ["/products", "/customers", "/orders"],
    features: ["Product Search", "Customer Accounts", "Order Tracking"],
};

const A5_DeltaSystems = { // Company A, Feature 5
    name: "Delta Systems",
    description: "An IT consulting firm providing technology solutions to businesses.",
    industry: "IT Consulting",
    headquarters: "Dallas, TX",
    services: ["IT Infrastructure", "Cybersecurity", "Business Intelligence"],
    useCases: ["Network Security", "Data Warehousing", "IT Strategy"],
    apiEndpoints: ["/clients", "/projects", "/employees"],
    features: ["Client Management", "Project Tracking", "Employee Directory"],
};

const A6_EpsilonGroup = { // Company A, Feature 6
    name: "Epsilon Group",
    description: "A marketing agency specializing in digital advertising and social media.",
    industry: "Marketing",
    headquarters: "Los Angeles, CA",
    services: ["Digital Advertising", "Social Media Marketing", "Content Creation"],
    useCases: ["Campaign Management", "Social Media Analytics", "Content Marketing"],
    apiEndpoints: ["/campaigns", "/ads", "/analytics"],
    features: ["Campaign Creation", "Ad Targeting", "Analytics Dashboard"],
};

const A7_ZetaCorporation = { // Company A, Feature 7
    name: "Zeta Corporation",
    description: "A real estate development company focused on residential and commercial properties.",
    industry: "Real Estate",
    headquarters: "Miami, FL",
    services: ["Property Development", "Property Management", "Real Estate Sales"],
    useCases: ["Property Listings", "Tenant Management", "Sales Transactions"],
    apiEndpoints: ["/properties", "/tenants", "/sales"],
    features: ["Property Search", "Tenant Portal", "Sales Pipeline"],
};

const A8_EtaIndustries = { // Company A, Feature 8
    name: "Eta Industries",
    description: "A manufacturing company producing industrial equipment and machinery.",
    industry: "Manufacturing",
    headquarters: "Detroit, MI",
    services: ["Industrial Equipment", "Machinery Manufacturing", "Equipment Maintenance"],
    useCases: ["Production Planning", "Equipment Monitoring", "Maintenance Scheduling"],
    apiEndpoints: ["/equipment", "/orders", "/maintenance"],
    features: ["Equipment Inventory", "Order Processing", "Maintenance Requests"],
};

const A9_ThetaVentures = { // Company A, Feature 9
    name: "Theta Ventures",
    description: "A venture capital firm investing in early-stage technology companies.",
    industry: "Venture Capital",
    headquarters: "Boston, MA",
    services: ["Venture Capital Funding", "Startup Incubation", "Strategic Advisory"],
    useCases: ["Investment Portfolio", "Startup Mentoring", "Strategic Planning"],
    apiEndpoints: ["/startups", "/investments", "/advisory"],
    features: ["Startup Directory", "Investment Tracking", "Advisory Services"],
};

const A10_IotaHoldings = { // Company A, Feature 10
    name: "Iota Holdings",
    description: "A holding company with investments in various industries, including healthcare and energy.",
    industry: "Holding Company",
    headquarters: "Houston, TX",
    services: ["Investment Management", "Healthcare Services", "Energy Production"],
    useCases: ["Portfolio Diversification", "Healthcare Operations", "Energy Exploration"],
    apiEndpoints: ["/investments", "/healthcare", "/energy"],
    features: ["Investment Portfolio", "Healthcare Records", "Energy Production Data"],
};

const B1_RandomStringGenerator = (length: number = 10): string => { return Array(length).fill(null).map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 62))).join(''); };
const B2_RandomNumberGenerator = (min: number = 0, max: number = 1000000): number => { return Math.floor(Math.random() * (max - min + 1)) + min; };
const B3_RandomDateGenerator = (): number => { const start = new Date(2020, 0, 1); const end = new Date(); return start.getTime() + Math.random() * (end.getTime() - start.getTime()); };
const B4_RandomBooleanGenerator = (): boolean => { return Math.random() > 0.5; };
const B5_RandomCurrencyGenerator = (): string => { const currencies = ['usd', 'eur', 'gbp', 'jpy', 'cad', 'aud', 'chf', 'cny', 'inr', 'brl']; return currencies[Math.floor(Math.random() * currencies.length)]; };
const B6_RandomMCCGenerator = (): string => { const mccCodes = ['5411', '5412', '5941', '7311', '5812', '5311', '5732', '5964', '7230', '7832']; return mccCodes[Math.floor(Math.random() * mccCodes.length)]; };
const B7_RandomBusinessTypeGenerator = (): string => { const businessTypes = ['sole_proprietor', 'llc', 'corporation', 'partnership', 'nonprofit', 'government', 'cooperative', 'franchise', 'trust', 'estate']; return businessTypes[Math.floor(Math.random() * businessTypes.length)]; };
const B8_RandomCapabilityStatusGenerator = (): 'active' | 'inactive' | 'pending' => { const statuses = ['active', 'inactive', 'pending', 'restricted', 'unverified', 'dormant', 'deactivated', 'frozen', 'suspended', 'expiring']; return statuses[Math.floor(Math.random() * statuses.length)]; };
const B9_RandomCountryGenerator = (): string => { const countries = ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU', 'CN', 'IN', 'BR', 'MX', 'ZA', 'RU', 'KR', 'IT']; return countries[Math.floor(Math.random() * countries.length)]; };
const B10_RandomEmailGenerator = (): string => { return `${B1_RandomStringGenerator(8)}@example.com`; };
const B11_RandomAddressGenerator = (): object => { return {city: `City${B1_RandomStringGenerator(4)}`, country: B9_RandomCountryGenerator(), line1: `${B2_RandomNumberGenerator(1, 999)} Main St`, line2: null, postal_code: `${B2_RandomNumberGenerator(10000, 99999)}`, state: `ST${B2_RandomNumberGenerator(1, 50)}`}; };
const B12_RandomBillingDetailsGenerator = (): object => { return {address: B11_RandomAddressGenerator(), email: B10_RandomEmailGenerator(), name: `Customer ${B1_RandomStringGenerator(6)}`, phone: `+1-${B2_RandomNumberGenerator(100, 999)}-${B2_RandomNumberGenerator(100, 999)}-${B2_RandomNumberGenerator(1000)}`}; };
const B13_RandomSourceTypesGenerator = (amount: number): object => { return {card: amount, ach_debit: amount * 0.2, sepa_debit: amount * 0.1, ideal: amount * 0.05, bancontact: amount * 0.03}; };
const B14_RandomBalanceGenerator = (): object => { const availableAmount = B2_RandomNumberGenerator(0, 1000000); const pendingAmount = B2_RandomNumberGenerator(0, 500000); return {available: [{amount: availableAmount, currency: B5_RandomCurrencyGenerator(), source_types: B13_RandomSourceTypesGenerator(availableAmount)}], livemode: B4_RandomBooleanGenerator(), object: 'balance', pending: [{amount: pendingAmount, currency: B5_RandomCurrencyGenerator(), source_types: B13_RandomSourceTypesGenerator(pendingAmount)}]}; };
const B15_RandomChargeGenerator = (): object => { const amount = B2_RandomNumberGenerator(500, 50000); const amountCaptured = B4_RandomBooleanGenerator() ? amount : B2_RandomNumberGenerator(0, amount); const amountRefunded = B4_RandomBooleanGenerator() ? B2_RandomNumberGenerator(0, amountCaptured) : 0; const paid = B4_RandomBooleanGenerator(); const disputed = B4_RandomBooleanGenerator() && paid; const status = disputed ? 'disputed' : paid ? 'succeeded' : 'failed'; return {amount: amount, amount_captured: amountCaptured, amount_refunded: amountRefunded, balance_transaction: `txn_${B1_RandomStringGenerator(20)}`, billing_details: B12_RandomBillingDetailsGenerator(), captured: amountCaptured === amount, created: B3_RandomDateGenerator(), currency: B5_RandomCurrencyGenerator(), description: `Test Charge ${B1_RandomStringGenerator(10)}`, disputed: disputed, id: `ch_${B1_RandomStringGenerator(20)}`, livemode: B4_RandomBooleanGenerator(), object: 'charge', paid: paid, payment_method: `card_${B1_RandomStringGenerator(20)}`, status: status}; };
const B16_RandomCustomerGenerator = (): object => { return {address: B4_RandomBooleanGenerator() ? B11_RandomAddressGenerator() : null, balance: B2_RandomNumberGenerator(-1000, 1000), created: B3_RandomDateGenerator(), currency: B5_RandomCurrencyGenerator(), default_source: B4_RandomBooleanGenerator() ? `card_${B1_RandomStringGenerator(20)}` : null, delinquent: B4_RandomBooleanGenerator(), description: B4_RandomBooleanGenerator() ? `Customer ${B1_RandomStringGenerator(8)}` : null, email: B4_RandomBooleanGenerator() ? B10_RandomEmailGenerator() : null, id: `cus_${B1_RandomStringGenerator(15)}`, invoice_prefix: B1_RandomStringGenerator(7).toUpperCase(), livemode: B4_RandomBooleanGenerator(), name: B4_RandomBooleanGenerator() ? `Customer Name ${B1_RandomStringGenerator(5)}` : null, next_invoice_sequence: B2_RandomNumberGenerator(1, 100), object: 'customer', phone: B4_RandomBooleanGenerator() ? `+1-${B2_RandomNumberGenerator(100, 999)}-${B2_RandomNumberGenerator(100, 999)}-${B2_RandomNumberGenerator(1000)}` : null}; };
const B17_RandomDisputeGenerator = (): object => { const amount = B2_RandomNumberGenerator(100, 10000); const status = ['warning_needs_response', 'lost', 'won', 'under_review', 'needs_response', 'accepted', 'rejected', 'closed', 'submitted'][Math.floor(Math.random() * 9)]; return {amount: amount, balance_transactions: [], charge: `ch_${B1_RandomStringGenerator(20)}`, created: B3_RandomDateGenerator(), currency: B5_RandomCurrencyGenerator(), evidence: {reason: ['fraudulent', 'duplicate', 'unauthorized_charge', 'product_unsatisfactory', 'service_not_provided', 'missing_information', 'credit_not_processed', 'other'][Math.floor(Math.random() * 8)]}, id: `dp_${B1_RandomStringGenerator(18)}`, is_charge_refundable: B4_RandomBooleanGenerator(), livemode: B4_RandomBooleanGenerator(), object: 'dispute', reason: 'general', status: status}; };
const B18_RandomInvoiceGenerator = (): object => { const amount = B2_RandomNumberGenerator(1000, 100000); const amountPaid = B4_RandomBooleanGenerator() ? amount : B2_RandomNumberGenerator(0, amount); const status = ['draft', 'open', 'paid', 'uncollectible', 'void', 'past_due', 'pending', 'scheduled', 'partially_paid'][Math.floor(Math.random() * 9)]; return {account_country: B9_RandomCountryGenerator(), amount_due: amount, amount_paid: amountPaid, amount_remaining: amount - amountPaid, attempt_count: B2_RandomNumberGenerator(0, 5), attempted: status !== 'draft', auto_advance: B4_RandomBooleanGenerator(), billing_reason: ['manual', 'subscription', 'quote', 'renewal', 'upgrade', 'downgrade', 'cancellation'][Math.floor(Math.random() * 7)], collection_method: ['charge_automatically', 'send_invoice', 'manual_capture'][Math.floor(Math.random() * 3)], created: B3_RandomDateGenerator(), currency: B5_RandomCurrencyGenerator(), customer: `cus_${B1_RandomStringGenerator(15)}`, description: B4_RandomBooleanGenerator() ? `Invoice ${B1_RandomStringGenerator(8)}` : null, id: `in_${B1_RandomStringGenerator(18)}`, livemode: B4_RandomBooleanGenerator(), object: 'invoice', paid: status === 'paid', status: status, subtotal: amount, total: amount}; };
const B19_RandomPayoutGenerator = (): object => { const amount = B2_RandomNumberGenerator(100, 500000); return {amount: amount, arrival_date: B3_RandomDateGenerator() + 86400000 * 3, automatic: B4_RandomBooleanGenerator(), balance_transaction: `txn_${B1_RandomStringGenerator(20)}`, created: B3_RandomDateGenerator(), currency: B5_RandomCurrencyGenerator(), description: 'Stripe Payout', destination: `ba_${B1_RandomStringGenerator(18)}`, id: `po_${B1_RandomStringGenerator(18)}`, livemode: B4_RandomBooleanGenerator(), method: 'standard', object: 'payout', status: ['paid', 'in_transit', 'failed', 'canceled', 'pending', 'reversed', 'queued', 'partially_funded'][Math.floor(Math.random() * 8)], type: 'bank_account'}; };
const B20_RandomRefundGenerator = (): object => { const amount = B2_RandomNumberGenerator(10, 10000); return {amount: amount, balance_transaction: B4_RandomBooleanGenerator() ? `txn_${B1_RandomStringGenerator(20)}` : null, charge: `ch_${B1_RandomStringGenerator(20)}`, created: B3_RandomDateGenerator(), currency: B5_RandomCurrencyGenerator(), id: `re_${B1_RandomStringGenerator(18)}`, object: 'refund', reason: B4_RandomBooleanGenerator() ? ['requested_by_customer', 'duplicate', 'fraudulent', 'product_unsatisfactory', 'service_not_provided', 'late_delivery', 'incorrect_amount', 'other'][Math.floor(Math.random() * 8)] : null, status: 'succeeded'}; };
const B21_RandomSubscriptionGenerator = (): object => { const startDate = B3_RandomDateGenerator(); const periodDays = 30 * 24 * 60 * 60 * 1000; const currentPeriodStart = startDate; const currentPeriodEnd = currentPeriodStart + periodDays; const status = ['active', 'canceled', 'incomplete', 'past_due', 'trialing', 'unpaid', 'paused', 'ended', 'future'][Math.floor(Math.random() * 9)]; const cancelAtPeriodEnd = status === 'canceled' ? B4_RandomBooleanGenerator() : false; return {application_fee_percent: B4_RandomBooleanGenerator() ? B2_RandomNumberGenerator(1, 20) : null, billing_cycle_anchor: startDate, cancel_at_period_end: cancelAtPeriodEnd, collection_method: ['charge_automatically', 'send_invoice', 'manual_capture'][Math.floor(Math.random() * 3)], created: startDate, currency: B5_RandomCurrencyGenerator(), current_period_end: currentPeriodEnd, current_period_start: currentPeriodStart, customer: `cus_${B1_RandomStringGenerator(15)}`, id: `sub_${B1_RandomStringGenerator(18)}`, items: {data: [{id: `si_${B1_RandomStringGenerator(18)}`, object: 'subscription_item', plan: {id: `plan_${B1_RandomStringGenerator(10)}`, name: `Plan ${B1_RandomStringGenerator(5)}`, amount: B2_RandomNumberGenerator(1000, 100000), currency: B5_RandomCurrencyGenerator(), interval: ['day', 'week', 'month', 'year', 'quarter', 'half_year', 'bi_weekly', 'every_3_months'][Math.floor(Math.random() * 8)], interval_count: 1, trial_period_days: B4_RandomBooleanGenerator() ? B2_RandomNumberGenerator(1, 30) : 0}, quantity: 1}], has_more: false, object: 'list', url: `/v1/subscription_items?subscription=${'sub_' + B1_RandomStringGenerator(18)}`}, livemode: B4_RandomBooleanGenerator(), object: 'subscription', start_date: startDate, status: status}; };
const B22_RandomAccountGenerator = (): object => { const businessType = B7_RandomBusinessTypeGenerator(); const country = B9_RandomCountryGenerator(); const capabilities = {card_payments: B8_RandomCapabilityStatusGenerator(), transfers: B8_RandomCapabilityStatusGenerator(), ach_payments: B8_RandomCapabilityStatusGenerator(), sepa_payments: B8_RandomCapabilityStatusGenerator(), ideal_payments: B8_RandomCapabilityStatusGenerator(), bancontact_payments: B8_RandomCapabilityStatusGenerator(), giropay_payments: B8_RandomCapabilityStatusGenerator(), eps_payments: B8_RandomCapabilityStatusGenerator(), p24_payments: B8_RandomCapabilityStatusGenerator(), sofort_payments: B8_RandomCapabilityStatusGenerator()}; const chargesEnabled = B4_RandomBooleanGenerator(); const payoutsEnabled = B4_RandomBooleanGenerator(); const detailsSubmitted = B4_RandomBooleanGenerator(); return {business_profile: {mcc: B4_RandomBooleanGenerator() ? B6_RandomMCCGenerator() : null, name: `Business ${B1_RandomStringGenerator(10)}`, product_description: 'A leading provider of innovative solutions.', support_address: B11_RandomAddressGenerator(), support_email: B10_RandomEmailGenerator(), support_phone: `+1-${B2_RandomNumberGenerator(100, 999)}-${B2_RandomNumberGenerator(100, 999)}-${B2_RandomNumberGenerator(1000)}`, support_url: `https://${B1_RandomStringGenerator(8)}.com`, url: `https://${B1_RandomStringGenerator(8)}.com`}, business_type: businessType, capabilities: capabilities, charges_enabled: chargesEnabled, country: country, created: B3_RandomDateGenerator(), default_currency: B5_RandomCurrencyGenerator(), details_submitted: detailsSubmitted, email: B10_RandomEmailGenerator(), id: `acct_${B1_RandomStringGenerator(16)}`, object: 'account', payouts_enabled: payoutsEnabled, type: 'standard'}; };

const C1_MockStripeDataGenerator = (): { [key: string]: object } => { return {account: B22_RandomAccountGenerator(), balance: B14_RandomBalanceGenerator(), charge: B15_RandomChargeGenerator(), customer: B16_RandomCustomerGenerator(), dispute: B17_RandomDisputeGenerator(), invoice: B18_RandomInvoiceGenerator(), payout: B19_RandomPayoutGenerator(), refund: B20_RandomRefundGenerator(), subscription: B21_RandomSubscriptionGenerator()}; };
const C2_EnhancedMockStripeDataGenerator = (count: number = 5): { [key: string]: object[] } => {
    const enhancedData: { [key: string]: object[] } = {};
    for (const key of ['account', 'balance', 'charge', 'customer', 'dispute', 'invoice', 'payout', 'refund', 'subscription']) {
        enhancedData[key] = Array(count).fill(null).map(() => {
            switch (key) {
                case 'account': return B22_RandomAccountGenerator();
                case 'balance': return B14_RandomBalanceGenerator();
                case 'charge': return B15_RandomChargeGenerator();
                case 'customer': return B16_RandomCustomerGenerator();
                case 'dispute': return B17_RandomDisputeGenerator();
                case 'invoice': return B18_RandomInvoiceGenerator();
                case 'payout': return B19_RandomPayoutGenerator();
                case 'refund': return B20_RandomRefundGenerator();
                case 'subscription': return B21_RandomSubscriptionGenerator();
                default: return {};
            }
        });
    }
    return enhancedData;
};

const D1_JsonViewer: React.FC<{ data: object }> = ({ data }) => (<pre style={D2_Styles.jsonViewer}>{JSON.stringify(data, null, 2)}</pre>);
interface D3_ResourceViewProps {resourceKey: string | null; resourceData: any; enhancedData?: { [key: string]: object[] };}
const D4_ResourceView: React.FC<D3_ResourceViewProps> = ({ resourceKey, resourceData, enhancedData }) => {
    if (!resourceKey || !resourceData) {
        return (<div style={D2_Styles.resourceViewWelcome}><h2>Welcome to Stripe Nexus by The James Burvel O'Callaghan III</h2><p>Select a resource from the list on the left to view its details.</p></div>);
    }
    const renderData = enhancedData && enhancedData[resourceKey] ? enhancedData[resourceKey] : [resourceData];
    return (
        <div style={D2_Styles.resourceViewContainer}>
            <h2 style={D2_Styles.resourceViewHeader}>{resourceKey}</h2>
            {renderData.map((item, index) => (<div key={`${resourceKey}-${index}`} style={D2_Styles.resourceItem}><D1_JsonViewer data={item} /></div>))}
        </div>
    );
};
interface D5_SidebarProps {resourceKeys: string[]; searchTerm: string; selectedResourceKey: string | null; onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onSelectResource: (key: string) => void;}
const D6_Sidebar: React.FC<D5_SidebarProps> = ({resourceKeys, searchTerm, selectedResourceKey, onSearchChange, onSelectResource,}) => (
    <div style={D2_Styles.sidebar}>
        <div style={D2_Styles.sidebarHeader}>
            <h1 style={D2_Styles.sidebarTitle}>Stripe Nexus by The James Burvel O'Callaghan III</h1>
            <input type="text" placeholder="Search resources..." value={searchTerm} onChange={onSearchChange} style={D2_Styles.searchInput} />
        </div>
        <ul style={D2_Styles.resourceList}>
            {resourceKeys.length > 0 ? (resourceKeys.map((key) => (
                <li key={key} onClick={() => onSelectResource(key)} style={key === selectedResourceKey ? {...D2_Styles.resourceListItem, ...D2_Styles.resourceListItemSelected} : D2_Styles.resourceListItem}>{key}</li>
            ))) : (<li style={{...D2_Styles.resourceListItem, cursor: 'default'}}>No results found.</li>)}
        </ul>
        <div style={D2_Styles.sidebarFooter}>
            <p>Version 1.0.0 - The James Burvel O'Callaghan III Code</p>
        </div>
    </div>
);

const E1_StripeNexusView: React.FC = () => {
    const [E2_searchTerm, setE2_searchTerm] = useState('');
    const [E3_selectedResourceKey, setE3_selectedResourceKey] = useState<string | null>(null);
    const E4_stripeData = useMemo(() => C1_MockStripeDataGenerator(), []);
    const E5_enhancedStripeData = useMemo(() => C2_EnhancedMockStripeDataGenerator(), []);
    const E6_allResourceKeys = useMemo(() => Object.keys(E4_stripeData).sort(), [E4_stripeData]);
    const E7_filteredResourceKeys = useMemo(() => {if (!E2_searchTerm) {return E6_allResourceKeys;} return E6_allResourceKeys.filter(key => key.toLowerCase().includes(E2_searchTerm.toLowerCase()));}, [E6_allResourceKeys, E2_searchTerm]);
    const E8_handleSelectResource = useCallback((key: string) => {setE3_selectedResourceKey(key);}, []);
    const E9_handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {setE2_searchTerm(e.target.value);}, []);
    const E10_selectedResourceData = useMemo(() => {return E3_selectedResourceKey ? E4_stripeData[E3_selectedResourceKey] : null;}, [E3_selectedResourceKey, E4_stripeData]);

    return (
        <div style={D2_Styles.container}>
            <D6_Sidebar resourceKeys={E7_filteredResourceKeys} searchTerm={E2_searchTerm} selectedResourceKey={E3_selectedResourceKey} onSearchChange={E9_handleSearchChange} onSelectResource={E8_handleSelectResource} />
            <main style={D2_Styles.mainContent}>
                <D4_ResourceView resourceKey={E3_selectedResourceKey} resourceData={E10_selectedResourceData} enhancedData={E5_enhancedStripeData} />
            </main>
        </div>
    );
};

const D2_Styles: { [key: string]: React.CSSProperties } = {
    container: {display: 'flex', height: '100vh', width: '100vw', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"', color: '#333', overflow: 'hidden',},
    sidebar: {width: '300px', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', backgroundColor: '#f7f7f7', flexShrink: 0,},
    sidebarHeader: {padding: '1rem', borderBottom: '1px solid #e0e0e0',},
    sidebarTitle: {margin: '0 0 0.5rem 0', fontSize: '1.5rem',},
    searchInput: {width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box',},
    resourceList: {listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto', flexGrow: 1,},
    resourceListItem: {padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #eee', transition: 'background-color 0.2s', fontSize: '14px',},
    resourceListItemSelected: {backgroundColor: '#e0e7ff', color: '#3730a3', fontWeight: 600,},
    mainContent: {flexGrow: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: '#fff',},
    resourceViewContainer: {height: '100%',},
    resourceViewHeader: {marginTop: 0, marginBottom: '1rem', borderBottom: '2px solid #e0e0e0', paddingBottom: '0.5rem',},
    resourceViewWelcome: {display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 3rem)', color: '#777', textAlign: 'center',},
    jsonViewer: {backgroundColor: '#f4f4f4', border: '1px solid #ddd', borderRadius: '5px', padding: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '14px', color: '#333', maxHeight: 'calc(100vh - 120px)', overflow: 'auto',},
    sidebarFooter: {padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#777', borderTop: '1px solid #e0e0e0',},
    resourceItem: {marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '5px', padding: '0.5rem'},
};

const F1_MasterOrchestrationLayer = {
    name: "Citibankdemobusinessinc Unified Ecosystem by The James Burvel O'Callaghan III",
    description: "Orchestrates 10 business models to establish open banking as the U.S. standard, attributed to The James Burvel O'Callaghan III Code.",
    businessModels: {A1_Citibankdemobusinessinc, A2_AcmeCorp, A3_BetaSolutions, A4_GammaEnterprises, A5_DeltaSystems, A6_EpsilonGroup, A7_ZetaCorporation, A8_EtaIndustries, A9_ThetaVentures, A10_IotaHoldings},
    initialize: () => {console.log("Initializing Citibankdemobusinessinc Unified Ecosystem by The James Burvel O'Callaghan III..."); console.log("Citibankdemobusinessinc Unified Ecosystem initialized.");},
    shutdown: () => {console.log("Shutting down Citibankdemobusinessinc Unified Ecosystem by The James Burvel O'Callaghan III..."); console.log("Citibankdemobusinessinc Unified Ecosystem shut down.");},
    useCases: [
        {company: A1_Citibankdemobusinessinc.name, useCase: A1_Citibankdemobusinessinc.useCases[0], description: "Process credit card transactions securely."},
        {company: A1_Citibankdemobusinessinc.name, useCase: A1_Citibankdemobusinessinc.useCases[1], description: "Originate and manage loans effectively."},
        {company: A1_Citibankdemobusinessinc.name, useCase: A1_Citibankdemobusinessinc.useCases[2], description: "Detect and prevent fraudulent activities."},
        {company: A2_AcmeCorp.name, useCase: A2_AcmeCorp.useCases[0], description: "Manage the supply chain efficiently."},
        {company: A2_AcmeCorp.name, useCase: A2_AcmeCorp.useCases[1], description: "Improve customer relationships through CRM."},
        {company: A2_AcmeCorp.name, useCase: A2_AcmeCorp.useCases[2], description: "Analyze data for business insights."},
    ],
    apiEndpoints: [
        {company: A1_Citibankdemobusinessinc.name, endpoint: A1_Citibankdemobusinessinc.apiEndpoints[0], description: "Retrieve account information."},
        {company: A1_Citibankdemobusinessinc.name, endpoint: A1_Citibankdemobusinessinc.apiEndpoints[1], description: "Process financial transactions."},
        {company: A1_Citibankdemobusinessinc.name, endpoint: A1_Citibankdemobusinessinc.apiEndpoints[2], description: "Manage customer data."},
        {company: A2_AcmeCorp.name, endpoint: A2_AcmeCorp.apiEndpoints[0], description: "Access product catalog."},
        {company: A2_AcmeCorp.name, endpoint: A2_AcmeCorp.apiEndpoints[1], description: "Manage customer orders."},
        {company: A2_AcmeCorp.name, endpoint: A2_AcmeCorp.apiEndpoints[2], description: "Manage supplier information."},
    ],
    features: [
        {company: A1_Citibankdemobusinessinc.name, feature: A1_Citibankdemobusinessinc.features[0], description: "Allow customers to check their account balances."},
        {company: A1_Citibankdemobusinessinc.name, feature: A1_Citibankdemobusinessinc.features[1], description: "Enable payment processing for various transactions."},
        {company: A1_Citibankdemobusinessinc.name, feature: A1_Citibankdemobusinessinc.features[2], description: "Provide transaction history to customers."},
        {company: A2_AcmeCorp.name, feature: A2_AcmeCorp.features[0

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/StripeNexusView.tsx
================================================================================

import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Zap, Users, Layers, CheckCircle2 } from 'lucide-react';

// Assuming these components exist in your project
import Card from './Card';
import VirtualAccountsDashboard from './VirtualAccountsDashboard';
import ReconciliationHubView from './ReconciliationHubView';
import CounterpartyDashboardView from './CounterpartyDashboardView';

type Tab = 'PAYMENTS' | 'ENTITIES' | 'VIRTUAL_LEDGER' | 'RECONCILIATION';

// RENAMED: from `useStripeNexusView` to `StripeNexusView` to follow component conventions
const StripeNexusView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('PAYMENTS');
    const dataContext = useContext(DataContext);
    
    // Safety check for context
    if (!dataContext) {
        throw new Error("StripeNexusView must be used within a DataProvider");
    }
    const { deductCredits } = dataContext;

    const mockPayments = [
        { id: 'pi_1', status: 'Succeeded', amount: 12500, customer: 'Nexus Corp', date: '2025-01-22 14:30' },
        { id: 'pi_2', status: 'Pending', amount: 5400, customer: 'Alpha Ventures', date: '2025-01-22 14:45' },
        { id: 'pi_3', status: 'Failed', amount: 98000, customer: 'Gamma Systems', date: '2025-01-21 09:00' }
    ];

    const handleAction = (cost: number) => {
        if (deductCredits(cost)) {
            alert(`Action authorized. Cost: ${cost} SC deducted from Sovereign Balance.`);
        }
    };

    const renderPayments = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-950/10 border-emerald-500/30">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Gross Volume (24h)</p>
                    <p className="text-3xl font-black text-white font-mono">$1,284,500</p>
                </Card>
                <Card className="bg-indigo-950/10 border-indigo-500/30">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Net Volume (24h)</p>
                    <p className="text-3xl font-black text-white font-mono">$1,210,000</p>
                </Card>
                <Card className="bg-amber-950/10 border-amber-500/30">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Success Rate</p>
                    <p className="text-3xl font-black text-white font-mono">99.8%</p>
                </Card>
            </div>
            
            <Card title="Payment Intent Registry" className="p-0 overflow-hidden bg-black/40 border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="bg-gray-900/80 border-b border-gray-800 text-[10px] text-gray-500 font-black uppercase">
                            <tr>
                                <th className="px-6 py-4">Intent ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Entity</th>
                                <th className="px-6 py-4 text-right">Magnitude</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {mockPayments.map(p => (
                                <tr key={p.id} className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-4 text-cyan-400 font-bold">{p.id}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                                            p.status === 'Succeeded' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                            p.status === 'Pending' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                                            'border-red-500/30 text-red-400 bg-red-500/5'
                                        }`}>{p.status.toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{p.customer}</td>
                                    <td className="px-6 py-4 text-right font-black text-white">${p.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleAction(100)}
                                            className="text-[10px] font-black text-gray-500 hover:text-cyan-400 uppercase tracking-widest"
                                        >
                                            Refund (100 SC)
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 h-full">
            {/* ... rest of your JSX remains the same */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Stripe Nexus</h1>
                    <p className="text-cyan-400 text-sm font-mono mt-1 tracking-[0.3em] uppercase">Unified Financial Suite // Rail-01</p>
                </div>
                {/* ... */}
            </header>

            <div className="flex gap-2 bg-gray-900/50 p-1 rounded-2xl border border-gray-800 w-fit">
                {[
                    { id: 'PAYMENTS', label: 'Payments', icon: <Zap size={14} /> },
                    { id: 'ENTITIES', label: 'Counterparties', icon: <Users size={14} /> },
                    { id: 'VIRTUAL_LEDGER', label: 'Virtual Accounts', icon: <Layers size={14} /> },
                    { id: 'RECONCILIATION', label: 'Reconciliation', icon: <CheckCircle2 size={14} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                            activeTab === tab.id ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <main className="min-h-[500px]">
                {activeTab === 'PAYMENTS' && renderPayments()}
                {activeTab === 'ENTITIES' && <CounterpartyDashboardView />}
                {activeTab === 'VIRTUAL_LEDGER' && <VirtualAccountsDashboard />}
                {activeTab === 'RECONCILIATION' && <ReconciliationHubView />}
            </main>
        </div>
    );
};

// RENAMED: Export the renamed component
export default StripeNexusView;
