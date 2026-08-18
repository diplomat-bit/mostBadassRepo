// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/ReconciliationHubView.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card';
import { ArrowRight, Check, X, Search, AlertCircle, Wand2 } from 'lucide-react';

// --- Mock Data Types ---
interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    source: 'INTERNAL_LEDGER' | 'BANK_STATEMENT';
    status: 'UNMATCHED' | 'MATCHED' | 'PENDING';
    currency: string;
}

interface MatchSuggestion {
    ledgerId: string;
    statementId: string;
    confidence: number;
    reason: string;
}

const MOCK_LEDGER: Transaction[] = [
    { id: 'L001', date: '2024-03-10', amount: 5000.00, description: 'Vendor Payment - Acme Corp', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L002', date: '2024-03-11', amount: 1250.50, description: 'Office Supplies', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L003', date: '2024-03-12', amount: 100000.00, description: 'Capital Injection', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L004', date: '2024-03-12', amount: 45.00, description: 'Coffee', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
];

const MOCK_STATEMENT: Transaction[] = [
    { id: 'S001', date: '2024-03-11', amount: 5000.00, description: 'ACH WDL ACME CORP', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S002', date: '2024-03-11', amount: 1250.50, description: 'STAPLES #9942', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S003', date: '2024-03-13', amount: 99985.00, description: 'WIRE IN CITI - FEE DEDUCTED', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S004', date: '2024-03-15', amount: 500.00, description: 'UNKNOWN CHARGE', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
];

const ReconciliationHubView: React.FC = () => {
    const [ledgerTx, setLedgerTx] = useState<Transaction[]>(MOCK_LEDGER);
    const [statementTx, setStatementTx] = useState<Transaction[]>(MOCK_STATEMENT);
    const [selectedLedger, setSelectedLedger] = useState<string | null>(null);
    const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [isAutoMatching, setIsAutoMatching] = useState(false);

    // --- AI Matching Logic ---
    const runAIMatching = () => {
        setIsAutoMatching(true);
        setTimeout(() => {
            const newSuggestions: MatchSuggestion[] = [];
            
            ledgerTx.filter(l => l.status === 'UNMATCHED').forEach(l => {
                statementTx.filter(s => s.status === 'UNMATCHED').forEach(s => {
                    let confidence = 0;
                    let reason = '';

                    // Exact Amount Match
                    if (l.amount === s.amount) {
                        confidence += 0.8;
                        reason = 'Exact amount match';
                    } 
                    // Fuzzy Amount Match (e.g., fees deducted)
                    else if (Math.abs(l.amount - s.amount) / l.amount < 0.01) {
                        confidence += 0.6;
                        reason = 'Close amount (possible fee deduction)';
                    }

                    // Date proximity
                    const dateDiff = Math.abs(new Date(l.date).getTime() - new Date(s.date).getTime());
                    if (dateDiff < 86400000 * 2) { // 2 days
                        confidence += 0.1;
                    }

                    if (confidence > 0.5) {
                        newSuggestions.push({
                            ledgerId: l.id,
                            statementId: s.id,
                            confidence: Math.min(confidence, 0.99),
                            reason
                        });
                    }
                });
            });

            setSuggestions(newSuggestions);
            setIsAutoMatching(false);
        }, 1500);
    };

    const handleMatch = () => {
        if (selectedLedger && selectedStatement) {
            setLedgerTx(prev => prev.map(t => t.id === selectedLedger ? { ...t, status: 'MATCHED' } : t));
            setStatementTx(prev => prev.map(t => t.id === selectedStatement ? { ...t, status: 'MATCHED' } : t));
            setSelectedLedger(null);
            setSelectedStatement(null);
            // Remove used suggestions
            setSuggestions(prev => prev.filter(s => s.ledgerId !== selectedLedger && s.statementId !== selectedStatement));
        }
    };

    const handleAutoResolve = (suggestion: MatchSuggestion) => {
        setLedgerTx(prev => prev.map(t => t.id === suggestion.ledgerId ? { ...t, status: 'MATCHED' } : t));
        setStatementTx(prev => prev.map(t => t.id === suggestion.statementId ? { ...t, status: 'MATCHED' } : t));
        setSuggestions(prev => prev.filter(s => s !== suggestion));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Reconciliation Hub</h2>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 flex items-center gap-2">
                        <Search size={16} /> Filter
                    </button>
                    <button 
                        onClick={runAIMatching}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 flex items-center gap-2 disabled:opacity-50 transition-all"
                        disabled={isAutoMatching}
                    >
                        {isAutoMatching ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Wand2 size={16} />}
                        AI Auto-Match
                    </button>
                </div>
            </div>

            {/* AI Suggestions Panel */}
            {suggestions.length > 0 && (
                <div className="mb-6 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl animate-fadeIn">
                    <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                        <Wand2 size={18} /> Suggested Matches ({suggestions.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestions.map((s, idx) => {
                            const l = ledgerTx.find(t => t.id === s.ledgerId);
                            const stmt = statementTx.find(t => t.id === s.statementId);
                            if (!l || !stmt) return null;
                            return (
                                <div key={idx} className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors group">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <span>{l.id} ↔ {stmt.id}</span>
                                        <span className="text-green-400 font-mono">{(s.confidence * 100).toFixed(0)}% Match</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-bold">${l.amount.toLocaleString()}</span>
                                        <span className="text-gray-500 text-xs">vs</span>
                                        <span className="text-white font-bold">${stmt.amount.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-indigo-300 mb-3">{s.reason}</p>
                                    <button 
                                        onClick={() => handleAutoResolve(s)}
                                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded transition-colors"
                                    >
                                        Confirm Match
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                {/* Internal Ledger Side */}
                <Card title="Internal Ledger (ERP)" className="flex flex-col h-full border-l-4 border-blue-500">
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {ledgerTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                            <div 
                                key={tx.id}
                                onClick={() => setSelectedLedger(tx.id === selectedLedger ? null : tx.id)}
                                className={`p-3 rounded cursor-pointer transition-all border ${
                                    selectedLedger === tx.id ? 'bg-blue-900/40 border-blue-500' : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <span className="font-mono text-xs text-gray-500">{tx.date}</span>
                                    <span className="font-mono font-bold text-white">${tx.amount.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1 truncate">{tx.description}</p>
                                <div className="text-xs text-gray-500 mt-1">{tx.id}</div>
                            </div>
                        ))}
                        {ledgerTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                <Check className="w-12 h-12 text-green-500 mb-2" />
                                All ledger items reconciled.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Bank Statement Side */}
                <Card title="Bank Statement (Citibank API)" className="flex flex-col h-full border-r-4 border-green-500">
                     <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {statementTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                            <div 
                                key={tx.id}
                                onClick={() => setSelectedStatement(tx.id === selectedStatement ? null : tx.id)}
                                className={`p-3 rounded cursor-pointer transition-all border ${
                                    selectedStatement === tx.id ? 'bg-green-900/40 border-green-500' : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <span className="font-mono text-xs text-gray-500">{tx.date}</span>
                                    <span className="font-mono font-bold text-white">${tx.amount.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1 truncate">{tx.description}</p>
                                <div className="text-xs text-gray-500 mt-1">{tx.id}</div>
                            </div>
                        ))}
                         {statementTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                <Check className="w-12 h-12 text-green-500 mb-2" />
                                All statement items reconciled.
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Manual Match Action Bar */}
            <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 p-4 rounded-xl shadow-2xl flex items-center gap-6 transition-all duration-300 ${selectedLedger && selectedStatement ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="text-sm">
                    <span className="text-gray-400">Linking</span> <span className="text-blue-400 font-mono">{selectedLedger}</span> <span className="text-gray-400">to</span> <span className="text-green-400 font-mono">{selectedStatement}</span>
                </div>
                <div className="h-8 w-px bg-gray-600"></div>
                <div className="flex gap-2">
                    <button onClick={() => { setSelectedLedger(null); setSelectedStatement(null); }} className="px-4 py-2 rounded hover:bg-gray-700 text-gray-300 text-sm font-medium">Cancel</button>
                    <button onClick={handleMatch} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold shadow-lg flex items-center gap-2">
                        <Check size={16} /> Match
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReconciliationHubView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/ReconciliationHubView (1).tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card';
import { ArrowRight, Check, X, Search, AlertCircle, Wand2 } from 'lucide-react';

// --- Mock Data Types ---
interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    source: 'INTERNAL_LEDGER' | 'BANK_STATEMENT';
    status: 'UNMATCHED' | 'MATCHED' | 'PENDING';
    currency: string;
}

interface MatchSuggestion {
    ledgerId: string;
    statementId: string;
    confidence: number;
    reason: string;
}

const MOCK_LEDGER: Transaction[] = [
    { id: 'L001', date: '2024-03-10', amount: 5000.00, description: 'Vendor Payment - Acme Corp', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L002', date: '2024-03-11', amount: 1250.50, description: 'Office Supplies', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L003', date: '2024-03-12', amount: 100000.00, description: 'Capital Injection', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L004', date: '2024-03-12', amount: 45.00, description: 'Coffee', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
];

const MOCK_STATEMENT: Transaction[] = [
    { id: 'S001', date: '2024-03-11', amount: 5000.00, description: 'ACH WDL ACME CORP', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S002', date: '2024-03-11', amount: 1250.50, description: 'STAPLES #9942', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S003', date: '2024-03-13', amount: 99985.00, description: 'WIRE IN CITI - FEE DEDUCTED', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S004', date: '2024-03-15', amount: 500.00, description: 'UNKNOWN CHARGE', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
];

const ReconciliationHubView: React.FC = () => {
    const [ledgerTx, setLedgerTx] = useState<Transaction[]>(MOCK_LEDGER);
    const [statementTx, setStatementTx] = useState<Transaction[]>(MOCK_STATEMENT);
    const [selectedLedger, setSelectedLedger] = useState<string | null>(null);
    const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [isAutoMatching, setIsAutoMatching] = useState(false);

    // --- AI Matching Logic ---
    const runAIMatching = () => {
        setIsAutoMatching(true);
        setTimeout(() => {
            const newSuggestions: MatchSuggestion[] = [];
            
            ledgerTx.filter(l => l.status === 'UNMATCHED').forEach(l => {
                statementTx.filter(s => s.status === 'UNMATCHED').forEach(s => {
                    let confidence = 0;
                    let reason = '';

                    // Exact Amount Match
                    if (l.amount === s.amount) {
                        confidence += 0.8;
                        reason = 'Exact amount match';
                    } 
                    // Fuzzy Amount Match (e.g., fees deducted)
                    else if (Math.abs(l.amount - s.amount) / l.amount < 0.01) {
                        confidence += 0.6;
                        reason = 'Close amount (possible fee deduction)';
                    }

                    // Date proximity
                    const dateDiff = Math.abs(new Date(l.date).getTime() - new Date(s.date).getTime());
                    if (dateDiff < 86400000 * 2) { // 2 days
                        confidence += 0.1;
                    }

                    if (confidence > 0.5) {
                        newSuggestions.push({
                            ledgerId: l.id,
                            statementId: s.id,
                            confidence: Math.min(confidence, 0.99),
                            reason
                        });
                    }
                });
            });

            setSuggestions(newSuggestions);
            setIsAutoMatching(false);
        }, 1500);
    };

    const handleMatch = () => {
        if (selectedLedger && selectedStatement) {
            setLedgerTx(prev => prev.map(t => t.id === selectedLedger ? { ...t, status: 'MATCHED' } : t));
            setStatementTx(prev => prev.map(t => t.id === selectedStatement ? { ...t, status: 'MATCHED' } : t));
            setSelectedLedger(null);
            setSelectedStatement(null);
            // Remove used suggestions
            setSuggestions(prev => prev.filter(s => s.ledgerId !== selectedLedger && s.statementId !== selectedStatement));
        }
    };

    const handleAutoResolve = (suggestion: MatchSuggestion) => {
        setLedgerTx(prev => prev.map(t => t.id === suggestion.ledgerId ? { ...t, status: 'MATCHED' } : t));
        setStatementTx(prev => prev.map(t => t.id === suggestion.statementId ? { ...t, status: 'MATCHED' } : t));
        setSuggestions(prev => prev.filter(s => s !== suggestion));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Reconciliation Hub</h2>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 flex items-center gap-2">
                        <Search size={16} /> Filter
                    </button>
                    <button 
                        onClick={runAIMatching}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 flex items-center gap-2 disabled:opacity-50 transition-all"
                        disabled={isAutoMatching}
                    >
                        {isAutoMatching ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Wand2 size={16} />}
                        AI Auto-Match
                    </button>
                </div>
            </div>

            {/* AI Suggestions Panel */}
            {suggestions.length > 0 && (
                <div className="mb-6 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl animate-fadeIn">
                    <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                        <Wand2 size={18} /> Suggested Matches ({suggestions.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestions.map((s, idx) => {
                            const l = ledgerTx.find(t => t.id === s.ledgerId);
                            const stmt = statementTx.find(t => t.id === s.statementId);
                            if (!l || !stmt) return null;
                            return (
                                <div key={idx} className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors group">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <span>{l.id} ↔ {stmt.id}</span>
                                        <span className="text-green-400 font-mono">{(s.confidence * 100).toFixed(0)}% Match</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-bold">${l.amount.toLocaleString()}</span>
                                        <span className="text-gray-500 text-xs">vs</span>
                                        <span className="text-white font-bold">${stmt.amount.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-indigo-300 mb-3">{s.reason}</p>
                                    <button 
                                        onClick={() => handleAutoResolve(s)}
                                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded transition-colors"
                                    >
                                        Confirm Match
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                {/* Internal Ledger Side */}
                <Card title="Internal Ledger (ERP)" className="flex flex-col h-full border-l-4 border-blue-500">
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {ledgerTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                            <div 
                                key={tx.id}
                                onClick={() => setSelectedLedger(tx.id === selectedLedger ? null : tx.id)}
                                className={`p-3 rounded cursor-pointer transition-all border ${
                                    selectedLedger === tx.id ? 'bg-blue-900/40 border-blue-500' : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <span className="font-mono text-xs text-gray-500">{tx.date}</span>
                                    <span className="font-mono font-bold text-white">${tx.amount.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1 truncate">{tx.description}</p>
                                <div className="text-xs text-gray-500 mt-1">{tx.id}</div>
                            </div>
                        ))}
                        {ledgerTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                <Check className="w-12 h-12 text-green-500 mb-2" />
                                All ledger items reconciled.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Bank Statement Side */}
                <Card title="Bank Statement (Citibank API)" className="flex flex-col h-full border-r-4 border-green-500">
                     <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {statementTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                            <div 
                                key={tx.id}
                                onClick={() => setSelectedStatement(tx.id === selectedStatement ? null : tx.id)}
                                className={`p-3 rounded cursor-pointer transition-all border ${
                                    selectedStatement === tx.id ? 'bg-green-900/40 border-green-500' : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <span className="font-mono text-xs text-gray-500">{tx.date}</span>
                                    <span className="font-mono font-bold text-white">${tx.amount.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1 truncate">{tx.description}</p>
                                <div className="text-xs text-gray-500 mt-1">{tx.id}</div>
                            </div>
                        ))}
                         {statementTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                <Check className="w-12 h-12 text-green-500 mb-2" />
                                All statement items reconciled.
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Manual Match Action Bar */}
            <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 p-4 rounded-xl shadow-2xl flex items-center gap-6 transition-all duration-300 ${selectedLedger && selectedStatement ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="text-sm">
                    <span className="text-gray-400">Linking</span> <span className="text-blue-400 font-mono">{selectedLedger}</span> <span className="text-gray-400">to</span> <span className="text-green-400 font-mono">{selectedStatement}</span>
                </div>
                <div className="h-8 w-px bg-gray-600"></div>
                <div className="flex gap-2">
                    <button onClick={() => { setSelectedLedger(null); setSelectedStatement(null); }} className="px-4 py-2 rounded hover:bg-gray-700 text-gray-300 text-sm font-medium">Cancel</button>
                    <button onClick={handleMatch} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold shadow-lg flex items-center gap-2">
                        <Check size={16} /> Match
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReconciliationHubView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/ReconciliationHubView (2).tsx
================================================================================

```typescript
import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card';
import { ArrowRight, Check, X, Search, AlertCircle, Wand2 } from 'lucide-react';

// --- The James Burvel O’Callaghan III Code ---
// --- Company: Citibankdemobusinessinc ---
// --- File: ReconciliationHubView.tsx ---
// --- Version: 1.0.0 ---
// --- Date: October 26, 2023 ---

// --- A1: Data Type Definitions ---
interface A1_Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    source: 'INTERNAL_LEDGER' | 'BANK_STATEMENT';
    status: 'UNMATCHED' | 'MATCHED' | 'PENDING';
    currency: string;
    internalNotes?: string;
    category?: string;
    vendor?: string;
    referenceNumber?: string;
    tags?: string[];
}

interface A2_MatchSuggestion {
    ledgerId: string;
    statementId: string;
    confidence: number;
    reason: string;
    suggestedBy: 'RULE_BASED' | 'AI';
}

interface A3_APIResponse<T> {
    status: 'success' | 'error';
    data?: T;
    error?: string;
}

// --- B1: Utility Functions (The James Burvel O’Callaghan III Code) ---
const B1_generateTransactionId = (): string => `TXN_${Math.random().toString(36).substring(2, 15)}`;
const B2_generateDate = (daysAgo: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo - Math.floor(Math.random() * 30));
    return date.toISOString().split('T')[0];
};
const B3_generateAmount = (base: number = 1000, variance: number = 0.5): number => {
    const sign = Math.random() > 0.5 ? 1 : -1;
    return parseFloat((base * (1 + (Math.random() - 0.5) * variance) * sign).toFixed(2));
};
const B4_generateDescription = (type: string): string => {
    const prefixes = ['Payment', 'Purchase', 'Transfer', 'Deposit', 'Withdrawal', 'Fee', 'Charge', 'Invoice', 'Credit', 'Debit'];
    const vendors = ['Acme Corp', 'Globex Inc', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems', 'Initech', 'Umbrella Corp', 'LexCorp', 'Oscorp', 'Weyland-Yutani'];
    const services = ['Cloud Hosting', 'Software License', 'Consulting Fee', 'Office Supplies', 'Travel Expense', 'Subscription', 'Payroll Processing', 'Marketing Campaign', 'Legal Services', 'Rent'];
    const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
    const randomService = services[Math.floor(Math.random() * services.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    switch (type) {
        case 'INTERNAL_LEDGER':
            return `${prefix} - ${randomVendor} - ${randomService} - ${B1_generateTransactionId().substring(0, 8)}`;
        case 'BANK_STATEMENT':
            return `${prefix.substring(0, 4)} ${randomVendor.substring(0, 4)} ${Math.random().toString(36).substring(0, 3).toUpperCase()} - ${B1_generateTransactionId().substring(0, 4)}`;
        default:
            return 'Miscellaneous Transaction - ' + B1_generateTransactionId().substring(0, 10);
    }
};
const B5_generateCurrency = (): string => ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'][Math.floor(Math.random() * 6)];
const B6_simulateNetworkLatency = (ms: number = 500): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
const B7_formatDate = (dateString: string, format: 'YYYY-MM-DD' | 'MM/DD/YYYY' = 'YYYY-MM-DD'): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if (format === 'MM/DD/YYYY') {
        return `${month}/${day}/${year}`;
    }
    return `${year}-${month}-${day}`;
};
const B8_calculatePercentage = (value: number, total: number): number => total === 0 ? 0 : parseFloat(((value / total) * 100).toFixed(2));
const B9_truncateString = (str: string, length: number): string => str.length > length ? str.substring(0, length) + "..." : str;
const B10_generateRandomString = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
const B11_generateRandomInteger = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const B12_isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
const B13_isValidURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
};
const B14_deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// --- C1: Data Simulation Functions (The James Burvel O’Callaghan III Code) ---
const C1_simulateInternalLedgerData = (count: number): A1_Transaction[] => {
    const data: A1_Transaction[] = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: B1_generateTransactionId(),
            date: B2_generateDate(B11_generateRandomInteger(0, 90)),
            amount: B3_generateAmount(B11_generateRandomInteger(50, 5000), 0.7),
            description: B4_generateDescription('INTERNAL_LEDGER'),
            source: 'INTERNAL_LEDGER',
            status: Math.random() > 0.4 ? 'UNMATCHED' : 'MATCHED',
            currency: B5_generateCurrency(),
            internalNotes: Math.random() > 0.8 ? "High priority" : undefined,
            category: ['Expense', 'Revenue', 'Transfer'][Math.floor(Math.random() * 3)],
            vendor: ['Acme Corp', 'Globex Inc'][Math.floor(Math.random() * 2)],
            referenceNumber: B10_generateRandomString(8),
            tags: Math.random() > 0.7 ? ['urgent', 'review'] : undefined,
        });
    }
    return data;
};
const C2_simulateBankStatementData = (count: number): A1_Transaction[] => {
    const data: A1_Transaction[] = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: B1_generateTransactionId(),
            date: B2_generateDate(B11_generateRandomInteger(0, 90)),
            amount: B3_generateAmount(B11_generateRandomInteger(50, 5000), 0.7),
            description: B4_generateDescription('BANK_STATEMENT'),
            source: 'BANK_STATEMENT',
            status: Math.random() > 0.4 ? 'UNMATCHED' : 'MATCHED',
            currency: B5_generateCurrency(),
            internalNotes: Math.random() > 0.8 ? "Requires Investigation" : undefined,
            category: ['Debit', 'Credit', 'ATM'][Math.floor(Math.random() * 3)],
            vendor: ['Stark Industries', 'Wayne Enterprises'][Math.floor(Math.random() * 2)],
            referenceNumber: B10_generateRandomString(10),
            tags: Math.random() > 0.7 ? ['fraud', 'high_value'] : undefined,
        });
    }
    return data;
};

// --- D1: Mock Data Initialization (The James Burvel O’Callaghan III Code) ---
const D1_MOCK_LEDGER: A1_Transaction[] = C1_simulateInternalLedgerData(15);
const D2_MOCK_STATEMENT: A1_Transaction[] = C2_simulateBankStatementData(18);

// --- E1: API Endpoint Definitions (The James Burvel O’Callaghan III Code) ---
const E1_API_BASE_URL = "/api/v1";

// **Company: Citibankdemobusinessinc**
const E1_API_GET_TRANSACTIONS = (source: 'ledger' | 'statement', status?: 'UNMATCHED' | 'MATCHED' | 'PENDING', currency?: string, dateRangeStart?: string, dateRangeEnd?: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/transactions?source=${source}${status ? `&status=${status}` : ''}${currency ? `&currency=${currency}` : ''}${dateRangeStart ? `&dateRangeStart=${dateRangeStart}` : ''}${dateRangeEnd ? `&dateRangeEnd=${dateRangeEnd}` : ''}`;
const E2_API_POST_MATCH_TRANSACTIONS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/match`;
const E3_API_GET_SUGGESTIONS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/suggestions`;
const E4_API_POST_AUTO_MATCH = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/automatch`;
const E5_API_GET_RECONCILIATION_SUMMARY = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/summary`;
const E6_API_GET_REPORT = (reportType: 'unmatched' | 'matched') => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/reports/${reportType}`;
const E7_API_GET_CURRENCIES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/currencies`;
const E8_API_GET_CATEGORIES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/categories`;
const E9_API_GET_VENDORS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/vendors`;
const E10_API_GET_TRANSACTION_DETAILS = (transactionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactions/${transactionId}`;
const E11_API_PUT_TRANSACTION_NOTES = (transactionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactions/${transactionId}/notes`;
const E12_API_POST_FEEDBACK = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/feedback`;
const E13_API_GET_USER_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/settings`;
const E14_API_PUT_USER_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/settings`;
const E15_API_GET_AUDIT_LOGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/auditlogs`;
const E16_API_GET_AI_MODEL_STATUS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/ai/modelstatus`;
const E17_API_POST_AI_MODEL_TRAIN = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/ai/modeltrain`;
const E18_API_GET_AI_MODEL_PERFORMANCE = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/ai/modelperformance`;
const E19_API_GET_SYSTEM_HEALTH = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/system/health`;
const E20_API_GET_SYSTEM_METRICS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/system/metrics`;
const E21_API_POST_ALERT = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/alerts`;
const E22_API_GET_ALERTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/alerts`;
const E23_API_DELETE_ALERT = (alertId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/alerts/${alertId}`;
const E24_API_GET_USER_ROLES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/roles`;
const E25_API_GET_USER_PERMISSIONS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/permissions`;
const E26_API_GET_TRANSACTION_HISTORY = (transactionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactions/${transactionId}/history`;
const E27_API_GET_VENDOR_DETAILS = (vendorId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/vendors/${vendorId}`;
const E28_API_PUT_VENDOR_DETAILS = (vendorId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/vendors/${vendorId}`;
const E29_API_GET_CATEGORY_DETAILS = (categoryId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/categories/${categoryId}`;
const E30_API_PUT_CATEGORY_DETAILS = (categoryId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/categories/${categoryId}`;
const E31_API_GET_CURRENCY_EXCHANGE_RATES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/currencies/exchangerates`;
const E32_API_GET_CURRENCY_DETAILS = (currencyCode: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/currencies/${currencyCode}`;
const E33_API_PUT_CURRENCY_DETAILS = (currencyCode: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/currencies/${currencyCode}`;
const E34_API_GET_PAYMENT_METHODS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/paymentmethods`;
const E35_API_GET_PAYMENT_METHOD_DETAILS = (paymentMethodId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/paymentmethods/${paymentMethodId}`;
const E36_API_PUT_PAYMENT_METHOD_DETAILS = (paymentMethodId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/paymentmethods/${paymentMethodId}`;
const E37_API_GET_USER_ACTIVITY = (userId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/${userId}/activity`;
const E38_API_GET_USER_PROFILE = (userId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/${userId}/profile`;
const E39_API_PUT_USER_PROFILE = (userId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/${userId}/profile`;
const E40_API_GET_SUBSCRIPTION_PLANS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/subscriptions/plans`;
const E41_API_GET_SUBSCRIPTION_DETAILS = (subscriptionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/subscriptions/${subscriptionId}`;
const E42_API_PUT_SUBSCRIPTION_DETAILS = (subscriptionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/subscriptions/${subscriptionId}`;
const E43_API_POST_ISSUE_REFUND = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/refunds`;
const E44_API_GET_REFUND_DETAILS = (refundId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/refunds/${refundId}`;
const E45_API_PUT_REFUND_DETAILS = (refundId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/refunds/${refundId}`;
const E46_API_GET_DISPUTES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/disputes`;
const E47_API_GET_DISPUTE_DETAILS = (disputeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/disputes/${disputeId}`;
const E48_API_PUT_DISPUTE_DETAILS = (disputeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/disputes/${disputeId}`;
const E49_API_GET_CHARGEBACKS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/chargebacks`;
const E50_API_GET_CHARGEBACK_DETAILS = (chargebackId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/chargebacks/${chargebackId}`;
const E51_API_PUT_CHARGEBACK_DETAILS = (chargebackId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/chargebacks/${chargebackId}`;
const E52_API_GET_FRAUD_ALERTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/fraudalerts`;
const E53_API_GET_FRAUD_ALERT_DETAILS = (alertId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/fraudalerts/${alertId}`;
const E54_API_PUT_FRAUD_ALERT_DETAILS = (alertId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/fraudalerts/${alertId}`;
const E55_API_GET_PAYOUTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/payouts`;
const E56_API_GET_PAYOUT_DETAILS = (payoutId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/payouts/${payoutId}`;
const E57_API_PUT_PAYOUT_DETAILS = (payoutId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/payouts/${payoutId}`;
const E58_API_GET_INVOICES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/invoices`;
const E59_API_GET_INVOICE_DETAILS = (invoiceId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/invoices/${invoiceId}`;
const E60_API_PUT_INVOICE_DETAILS = (invoiceId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/invoices/${invoiceId}`;
const E61_API_GET_STATEMENTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/statements`;
const E62_API_GET_STATEMENT_DETAILS = (statementId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/statements/${statementId}`;
const E63_API_GET_BANK_ACCOUNTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/bankaccounts`;
const E64_API_GET_BANK_ACCOUNT_DETAILS = (bankAccountId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/bankaccounts/${bankAccountId}`;
const E65_API_PUT_BANK_ACCOUNT_DETAILS = (bankAccountId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/bankaccounts/${bankAccountId}`;
const E66_API_GET_TRANSACTION_FEES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactionfees`;
const E67_API_GET_TRANSACTION_FEE_DETAILS = (feeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactionfees/${feeId}`;
const E68_API_PUT_TRANSACTION_FEE_DETAILS = (feeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactionfees/${feeId}`;
const E69_API_GET_DISCOUNT_CODES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/discountcodes`;
const E70_API_GET_DISCOUNT_CODE_DETAILS = (discountCodeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/discountcodes/${discountCodeId}`;
const E71_API_PUT_DISCOUNT_CODE_DETAILS = (discountCodeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/discountcodes/${discountCodeId}`;
const E72_API_GET_PROMOTIONS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/promotions`;
const E73_API_GET_PROMOTION_DETAILS = (promotionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/promotions/${promotionId}`;
const E74_API_PUT_PROMOTION_DETAILS = (promotionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/promotions/${promotionId}`;
const E75_API_GET_LOYALTY_PROGRAMS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/loyaltyprograms`;
const E76_API_GET_LOYALTY_PROGRAM_DETAILS = (programId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/loyaltyprograms/${programId}`;
const E77_API_PUT_LOYALTY_PROGRAM_DETAILS = (programId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/loyaltyprograms/${programId}`;
const E78_API_GET_REPORTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/reports`;
const E79_API_GET_REPORT_DETAILS = (reportId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/reports/${reportId}`;
const E80_API_PUT_REPORT_DETAILS = (reportId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/reports/${reportId}`;
const E81_API_GET_USER_PREFERENCES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/preferences`;
const E82_API_PUT_USER_PREFERENCES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/preferences`;
const E83_API_GET_API_KEYS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/apikeys`;
const E84_API_GET_API_KEY_DETAILS = (apiKeyId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/apikeys/${apiKeyId}`;
const E85_API_PUT_API_KEY_DETAILS = (apiKeyId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/apikeys/${apiKeyId}`;
const E86_API_GET_WEBHOOKS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/webhooks`;
const E87_API_GET_WEBHOOK_DETAILS = (webhookId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/webhooks/${webhookId}`;
const E88_API_PUT_WEBHOOK_DETAILS = (webhookId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/webhooks/${webhookId}`;
const E89_API_GET_SYSTEM_CONFIG = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/system/config`;
const E90_API_PUT_SYSTEM_CONFIG = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/system/config`;
const E91_API_GET_DATA_EXPORT_JOBS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/dataexports`;
const E92_API_GET_DATA_EXPORT_JOB_DETAILS = (jobId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/dataexports/${jobId}`;
const E93_API_POST_DATA_EXPORT_JOB = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/dataexports`;
const E94_API_GET_NOTIFICATION_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/notifications/settings`;
const E95_API_PUT_NOTIFICATION_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/notifications/settings`;
const E96_API_GET_NOTIFICATION_TEMPLATES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/notifications/templates`;
const E97_API_GET_NOTIFICATION_TEMPLATE_DETAILS = (templateId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/notifications/templates/${templateId}`;
const E98_API_PUT_NOTIFICATION_TEMPLATE_DETAILS = (templateId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/notifications/templates/${templateId}`;
const E99_API_GET_SECURITY_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/security/settings`;
const E100_API_PUT_SECURITY_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/security/settings`;

// --- F1: Feature Implementations (The James Burvel O’Callaghan III Code) ---
// **Company: Citibankdemobusinessinc**
const F1_FEATURE_AUTOMATED_MATCHING = "Automated Transaction Matching";
const F2_FEATURE_MANUAL_MATCHING = "Manual Transaction Matching";
const F3_FEATURE_TRANSACTION_SEARCH = "Transaction Search and Filtering";
const F4_FEATURE_AI_SUGGESTIONS = "AI-Powered Match Suggestions";
const F5_FEATURE_RECONCILIATION_SUMMARY_DASHBOARD = "Reconciliation Summary Dashboard";
const F6_FEATURE_UNMATCHED_TRANSACTIONS_REPORT = "Unmatched Transactions Report Generation";
const F7_FEATURE_MATCHED_TRANSACTIONS_REPORT = "Matched Transactions Report Generation";
const F8_FEATURE_CURRENCY_CONVERSION = "Currency Conversion Support";
const F9_FEATURE_CATEGORY_MANAGEMENT = "Transaction Category Management";
const F10_FEATURE_VENDOR_MANAGEMENT = "Vendor Management";
const F11_FEATURE_TRANSACTION_DETAILS_VIEW = "Detailed Transaction View";
const F12_FEATURE_TRANSACTION_NOTES = "Transaction Notes and Annotations";
const F13_FEATURE_USER_FEEDBACK = "User Feedback Submission";
const F14_FEATURE_USER_SETTINGS = "User-Specific Settings";
const F15_FEATURE_AUDIT_LOGS = "Audit Trail and Activity Logging";
const F16_FEATURE_AI_MODEL_STATUS_MONITORING = "AI Model Status Monitoring";
const F17_FEATURE_AI_MODEL_TRAINING = "Initiate and Track AI Model Training";
const F18_FEATURE_AI_MODEL_PERFORMANCE_METRICS = "AI Model Performance Metrics Display";
const F19_FEATURE_SYSTEM_HEALTH_MONITORING = "System Health and Status Monitoring";
const F20_FEATURE_SYSTEM_METRICS_DASHBOARD = "System Metrics Visualization";
const F21_FEATURE_ALERTS_AND_NOTIFICATIONS = "Alerts and Notification System";
const F22_FEATURE_USER_ROLE_MANAGEMENT = "User Role and Access Control";
const F23_FEATURE_USER_PERMISSION_MANAGEMENT = "User Permission Management";
const F24_FEATURE_TRANSACTION_HISTORY_VIEW = "Transaction History Tracking";
const F25_FEATURE_VENDOR_DETAILS_VIEW = "Vendor Details and Management";
const F26_FEATURE_CATEGORY_DETAILS_VIEW = "Category Details and Management";
const F27_FEATURE_EXCHANGE_RATE_DISPLAY = "Real-time Currency Exchange Rate Display";
const F28_FEATURE_CURRENCY_DETAILS_VIEW = "Currency Details and Management";
const F29_FEATURE_PAYMENT_METHOD_MANAGEMENT = "Payment Method Management";
const F30_FEATURE_PAYMENT_METHOD_DETAILS_VIEW = "Payment Method Details View";
const F31_FEATURE_USER_ACTIVITY_LOGS = "User Activity Logging and Reporting";
const F32_FEATURE_USER_PROFILE_MANAGEMENT = "User Profile and Account Management";
const F33_FEATURE_SUBSCRIPTION_PLAN_MANAGEMENT = "Subscription Plan and Tier Management";
const F34_FEATURE_SUBSCRIPTION_DETAILS_VIEW = "Subscription Details and Management";
const F35_FEATURE_REFUND_PROCESSING = "Automated Refund Processing";
const F36_FEATURE_REFUND_DETAILS_VIEW = "Refund Details and Management";
const F37_FEATURE_DISPUTE_MANAGEMENT = "Dispute Resolution and Management";
const F38_FEATURE_DISPUTE_DETAILS_VIEW = "Dispute Details View and Resolution";
const F39_FEATURE_CHARGEBACK_MANAGEMENT = "Chargeback Management";
const F40_FEATURE_CHARGEBACK_DETAILS_VIEW = "Chargeback Details and Processing";
const F41_FEATURE_FRAUD_ALERT_MANAGEMENT = "Fraud Alert Detection and Management";
const F42_FEATURE_FRAUD_ALERT_DETAILS_VIEW = "Fraud Alert Details View";
const F43_FEATURE_PAYOUT_PROCESSING = "Automated Payout Processing";
const F44_FEATURE_PAYOUT_DETAILS_VIEW = "Payout Details and Management";
const F45_FEATURE_INVOICE_GENERATION = "Invoice Generation and Management";
const F46_FEATURE_INVOICE_DETAILS_VIEW = "Invoice Details and Status Tracking";
const F47_FEATURE_STATEMENT_IMPORT = "Automated Bank Statement Import";
const F48_FEATURE_STATEMENT_DETAILS_VIEW = "Statement Details and Transaction Review";
const F49_FEATURE_BANK_ACCOUNT_MANAGEMENT = "Bank Account Management and Linking";
const F50_FEATURE_BANK_ACCOUNT_DETAILS_VIEW = "Bank Account Details and Information";
const F51_FEATURE_TRANSACTION_FEE_MANAGEMENT = "Transaction Fee Management";
const F52_FEATURE_TRANSACTION_FEE_DETAILS_VIEW = "Transaction Fee Details and Review";
const F53_FEATURE_DISCOUNT_CODE_MANAGEMENT = "Discount Code Management";
const F54_FEATURE_DISCOUNT_CODE_DETAILS_VIEW = "Discount Code Details and Reporting";
const F55_FEATURE_PROMOTION_MANAGEMENT = "Promotion and Campaign Management";
const F56_FEATURE_PROMOTION_DETAILS_VIEW = "Promotion Details and Analytics";
const F57_FEATURE_LOYALTY_PROGRAM_MANAGEMENT = "Loyalty Program Management";
const F58_FEATURE_LOYALTY_PROGRAM_DETAILS_VIEW = "Loyalty Program Details";
const F59_FEATURE_REPORT_GENERATION = "Customizable Report Generation";
const F60_FEATURE_REPORT_DETAILS_VIEW = "Report Details and Export Options";
const F61_FEATURE_USER_PREFERENCES_CUSTOMIZATION = "User Preference Customization";
const F62_FEATURE_API_KEY_MANAGEMENT = "API Key Management and Security";
const F63_FEATURE_API_KEY_DETAILS_VIEW = "API Key Details and Usage";
const F64_FEATURE_WEBHOOK_MANAGEMENT = "Webhook Management and Configuration";
const F65_FEATURE_WEBHOOK_DETAILS_VIEW = "Webhook Details and Event Logs";
const F66_FEATURE_SYSTEM_CONFIGURATION_SETTINGS = "System Configuration Settings";
const F67_FEATURE_DATA_EXPORT_JOBS = "Automated Data Export Jobs";
const F68_FEATURE_DATA_EXPORT_JOB_DETAILS_VIEW = "Data Export Job Details and Status";
const F69_FEATURE_EMAIL_NOTIFICATION_SETTINGS = "Email Notification Customization";
const F70_FEATURE_NOTIFICATION_TEMPLATE_CUSTOMIZATION = "Notification Template Customization";
const F71_FEATURE_SECURITY_SETTINGS_CONFIGURATION = "Security Setting Configuration";
const F72_FEATURE_TWO_FACTOR_AUTHENTICATION = "Two-Factor Authentication (2FA)";
const F73_FEATURE_PASSWORD_RESET_FUNCTIONALITY = "Password Reset and Recovery";
const F74_FEATURE_BRUTE_FORCE_PROTECTION = "Brute-Force Attack Protection";
const F75_FEATURE_SESSION_TIMEOUT_CONFIGURATION = "Session Timeout Configuration";
const F76_FEATURE_IP_ADDRESS_WHITELISTING = "IP Address Whitelisting";
const F77_FEATURE_SSL_CERTIFICATE_MANAGEMENT = "SSL Certificate Management";
const F78_FEATURE_DATA_ENCRYPTION_AT_REST = "

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/ReconciliationHubView.tsx
================================================================================

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, Check, X, Search, AlertCircle, Wand2, 
  ShieldCheck, Activity, Database, Zap, MessageSquare, 
  Terminal, BarChart3, Lock, Cpu, Gauge, Layers, 
  History, Settings, Download, Filter, RefreshCcw,
  ChevronRight, Play, Info, AlertTriangle, Eye,
  FileText, Share2, Trash2, CheckCircle2, Fingerprint
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';

/**
 * QUANTUM FINANCIAL - RECONCILIATION NEXUS V4.0
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience: High-polish, elite performance.
 * - "Test Drive": Interactive, low-pressure, high-feedback.
 * - "Bells and Whistles": AI-driven insights, real-time telemetry, audit persistence.
 * 
 * SECURITY: Multi-factor simulation and fraud monitoring integrated.
 * AUDIT: Every sensitive action is logged to the internal state "Black Box".
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    source: 'INTERNAL_LEDGER' | 'BANK_STATEMENT';
    status: 'UNMATCHED' | 'MATCHED' | 'PENDING' | 'FLAGGED';
    currency: string;
    category: string;
    riskScore: number;
    metadata: {
        traceId: string;
        originatingIp?: string;
        mfaVerified: boolean;
        rail: 'ACH' | 'WIRE' | 'SWIFT';
    };
}

interface MatchSuggestion {
    ledgerId: string;
    statementId: string;
    confidence: number;
    reason: string;
    aiModel: string;
}

interface AuditEntry {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
    severity: 'INFO' | 'SECURITY' | 'CRITICAL';
    hash: string; // Simulated blockchain hash for integrity
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

interface TelemetryData {
    cpuLoad: number;
    memoryUsage: number;
    apiLatency: number;
    fraudDetectionActive: boolean;
}

// ================================================================================================
// MOCK DATA GENERATION (THE "ENGINE" FUEL)
// ================================================================================================

const GENERATE_MOCK_LEDGER = (): Transaction[] => [
    { id: 'TX-L-9901', date: '2024-05-10', amount: 125000.00, description: 'Global Logistics - Q2 Settlement', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Operations', riskScore: 0.02, metadata: { traceId: 'TRC-001', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-L-9902', date: '2024-05-11', amount: 4250.50, description: 'Cloud Infrastructure - AWS Monthly', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Technology', riskScore: 0.05, metadata: { traceId: 'TRC-002', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-L-9903', date: '2024-05-12', amount: 890000.00, description: 'Strategic Acquisition - Alpha Corp', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Investment', riskScore: 0.12, metadata: { traceId: 'TRC-003', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-L-9904', date: '2024-05-12', amount: 150.00, description: 'Executive Catering - Board Meeting', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'G&A', riskScore: 0.01, metadata: { traceId: 'TRC-004', mfaVerified: false, rail: 'ACH' } },
    { id: 'TX-L-9905', date: '2024-05-13', amount: 55000.00, description: 'Payroll Funding - EMEA Region', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Payroll', riskScore: 0.03, metadata: { traceId: 'TRC-005', mfaVerified: true, rail: 'SWIFT' } },
    { id: 'TX-L-9906', date: '2024-05-14', amount: 1200.00, description: 'Office Supplies - Staples', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'G&A', riskScore: 0.01, metadata: { traceId: 'TRC-006', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-L-9907', date: '2024-05-15', amount: 33400.00, description: 'Marketing Campaign - Summer Launch', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Marketing', riskScore: 0.08, metadata: { traceId: 'TRC-007', mfaVerified: true, rail: 'WIRE' } },
];

const GENERATE_MOCK_STATEMENT = (): Transaction[] => [
    { id: 'TX-S-8801', date: '2024-05-11', amount: 125000.00, description: 'INCOMING WIRE: GLOBAL LOGISTICS', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.02, metadata: { traceId: 'TRC-S01', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-S-8802', date: '2024-05-11', amount: 4250.50, description: 'ACH DEBIT: AMZN MKTP', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.04, metadata: { traceId: 'TRC-S02', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-S-8803', date: '2024-05-13', amount: 889985.00, description: 'WIRE OUT: ALPHA CORP - FEE ADJ', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.15, metadata: { traceId: 'TRC-S03', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-S-8804', date: '2024-05-15', amount: 500.00, description: 'UNKNOWN POS DEBIT - NYC', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.85, metadata: { traceId: 'TRC-S04', mfaVerified: false, rail: 'ACH' } },
    { id: 'TX-S-8805', date: '2024-05-14', amount: 55000.00, description: 'SWIFT: EMEA PAYROLL FUND', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.03, metadata: { traceId: 'TRC-S05', mfaVerified: true, rail: 'SWIFT' } },
];

// ================================================================================================
// MAIN COMPONENT: RECONCILIATION HUB
// ================================================================================================

const ReconciliationHubView: React.FC = () => {
    // --- State Management ---
    const [ledgerTx, setLedgerTx] = useState<Transaction[]>(GENERATE_MOCK_LEDGER());
    const [statementTx, setStatementTx] = useState<Transaction[]>(GENERATE_MOCK_STATEMENT());
    const [selectedLedger, setSelectedLedger] = useState<string | null>(null);
    const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [isAutoMatching, setIsAutoMatching] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Welcome to the Quantum Financial Demo. I am your AI Treasury Assistant. How can I help you kick the tires on our reconciliation engine today?", timestamp: new Date().toLocaleTimeString() }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [activeTab, setActiveTab] = useState<'reconcile' | 'audit' | 'telemetry'>('reconcile');
    const [telemetry, setTelemetry] = useState<TelemetryData>({ cpuLoad: 12, memoryUsage: 45, apiLatency: 24, fraudDetectionActive: true });
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // --- AI Initialization ---
    // Using the provided pattern for Gemini
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

    // --- Helper: Audit Logger ---
    const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'INFO') => {
        const newEntry: AuditEntry = {
            timestamp: new Date().toISOString(),
            action,
            details,
            severity,
            hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        };
        setAuditLogs(prev => [newEntry, ...prev]);
        console.log(`[AUDIT] ${action}: ${details}`);
    }, []);

    // --- Effect: Telemetry Simulation ---
    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => ({
                cpuLoad: Math.floor(Math.random() * 20) + 5,
                memoryUsage: 40 + Math.floor(Math.random() * 10),
                apiLatency: 15 + Math.floor(Math.random() * 30),
                fraudDetectionActive: true
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // --- Effect: Scroll Chat ---
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // --- AI Logic: Chat & Interaction ---
    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const userMsg: ChatMessage = { role: 'user', content: userInput, timestamp: new Date().toLocaleTimeString() };
        setChatHistory(prev => [...prev, userMsg]);
        setUserInput('');
        setIsAiThinking(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            // Contextual prompt for the AI
            const prompt = `
                You are the Quantum Financial AI Assistant. 
                The user is currently in the "Reconciliation Hub" of a high-performance business banking demo.
                Philosophy: "Golden Ticket" experience, "Test Drive" the car, "Bells and Whistles".
                Current State: 
                - Unmatched Ledger Items: ${ledgerTx.filter(t => t.status === 'UNMATCHED').length}
                - Unmatched Statement Items: ${statementTx.filter(t => t.status === 'UNMATCHED').length}
                - Security Status: Multi-factor Auth Active, Fraud Monitoring Active.
                
                User said: "${userInput}"
                
                Respond as an elite financial architect. Be professional, secure, and helpful. 
                If they ask to "reconcile everything", tell them to click the "AI Auto-Match" button to see the engine roar.
                Do NOT mention Citibank. Use "The Demo Bank" or "Quantum Financial".
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: text, 
                timestamp: new Date().toLocaleTimeString() 
            }]);
            logAction('AI_INTERACTION', `User asked: ${userInput.substring(0, 30)}...`, 'INFO');
        } catch (error) {
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: "I apologize, but my neural link is experiencing high latency. Please try again or use the manual controls.", 
                timestamp: new Date().toLocaleTimeString() 
            }]);
            logAction('AI_ERROR', 'Failed to generate AI response', 'CRITICAL');
        } finally {
            setIsAiThinking(false);
        }
    };

    // --- Logic: AI Auto-Matching (The "Engine Roar") ---
    const runAIMatching = () => {
        setIsAutoMatching(true);
        logAction('AI_AUTO_MATCH_START', 'Initiating heuristic matching engine', 'INFO');
        
        setTimeout(() => {
            const newSuggestions: MatchSuggestion[] = [];
            
            ledgerTx.filter(l => l.status === 'UNMATCHED').forEach(l => {
                statementTx.filter(s => s.status === 'UNMATCHED').forEach(s => {
                    let confidence = 0;
                    let reason = '';

                    // Exact Amount Match
                    if (l.amount === s.amount) {
                        confidence += 0.85;
                        reason = 'Exact currency value parity detected.';
                    } 
                    // Fuzzy Amount Match (e.g., fees deducted)
                    else if (Math.abs(l.amount - s.amount) / l.amount < 0.02) {
                        confidence += 0.65;
                        reason = 'High-probability match with variance (likely wire fees).';
                    }

                    // Description Keyword Match
                    const lDesc = l.description.toLowerCase();
                    const sDesc = s.description.toLowerCase();
                    if (lDesc.split(' ').some(word => word.length > 3 && sDesc.includes(word))) {
                        confidence += 0.1;
                    }

                    if (confidence > 0.6) {
                        newSuggestions.push({
                            ledgerId: l.id,
                            statementId: s.id,
                            confidence: Math.min(confidence, 0.99),
                            reason,
                            aiModel: 'Quantum-Heuristic-v4'
                        });
                    }
                });
            });

            setSuggestions(newSuggestions);
            setIsAutoMatching(false);
            logAction('AI_AUTO_MATCH_COMPLETE', `Found ${newSuggestions.length} potential matches`, 'INFO');
        }, 2000);
    };

    // --- Logic: Manual Matching ---
    const handleManualMatch = () => {
        if (selectedLedger && selectedStatement) {
            const lTx = ledgerTx.find(t => t.id === selectedLedger);
            const sTx = statementTx.find(t => t.id === selectedStatement);

            if (lTx && sTx) {
                setLedgerTx(prev => prev.map(t => t.id === selectedLedger ? { ...t, status: 'MATCHED' } : t));
                setStatementTx(prev => prev.map(t => t.id === selectedStatement ? { ...t, status: 'MATCHED' } : t));
                
                logAction('MANUAL_MATCH', `Linked ${selectedLedger} to ${selectedStatement} (Value: $${lTx.amount})`, 'INFO');
                
                setSelectedLedger(null);
                setSelectedStatement(null);
                setSuggestions(prev => prev.filter(s => s.ledgerId !== selectedLedger && s.statementId !== selectedStatement));
            }
        }
    };

    const handleAutoResolve = (suggestion: MatchSuggestion) => {
        setLedgerTx(prev => prev.map(t => t.id === suggestion.ledgerId ? { ...t, status: 'MATCHED' } : t));
        setStatementTx(prev => prev.map(t => t.id === suggestion.statementId ? { ...t, status: 'MATCHED' } : t));
        setSuggestions(prev => prev.filter(s => s !== suggestion));
        logAction('AI_RESOLVE', `Confirmed AI suggestion: ${suggestion.ledgerId} <-> ${suggestion.statementId}`, 'INFO');
    };

    // ================================================================================================
    // RENDER SUB-COMPONENTS
    // ================================================================================================

    const renderTelemetry = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fadeIn">
            <Card variant="default" padding="sm" className="border-cyan-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Engine Load</p>
                        <p className="text-2xl font-bold text-cyan-400">{telemetry.cpuLoad}%</p>
                    </div>
                    <Cpu className="text-cyan-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${telemetry.cpuLoad}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-purple-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Neural Memory</p>
                        <p className="text-2xl font-bold text-purple-400">{telemetry.memoryUsage}%</p>
                    </div>
                    <Activity className="text-purple-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${telemetry.memoryUsage}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-green-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">API Latency</p>
                        <p className="text-2xl font-bold text-green-400">{telemetry.apiLatency}ms</p>
                    </div>
                    <Zap className="text-green-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(telemetry.apiLatency / 100) * 100}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-red-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Fraud Shield</p>
                        <p className="text-2xl font-bold text-red-400">ACTIVE</p>
                    </div>
                    <ShieldCheck className="text-red-500/50" size={24} />
                </div>
                <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-1 flex-1 bg-red-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
                </div>
            </Card>
        </div>
    );

    const renderAuditTrail = () => (
        <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <History size={20} className="text-cyan-400" /> System Black Box (Audit Persistence)
                </h3>
                <button className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                    <Download size={14} /> Export Immutable Log
                </button>
            </div>
            <div className="bg-gray-900/80 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Details</th>
                            <th className="px-4 py-3">Integrity Hash</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {auditLogs.map((log, idx) => (
                            <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
                                        log.severity === 'SECURITY' ? 'bg-purple-500/20 text-purple-400' : 
                                        'bg-cyan-500/20 text-cyan-400'
                                    }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-300">{log.details}</td>
                                <td className="px-4 py-3 font-mono text-[10px] text-gray-600">{log.hash}</td>
                            </tr>
                        ))}
                        {auditLogs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-gray-500 italic">No audit entries recorded in this session.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // ================================================================================================
    // MAIN RENDER
    // ================================================================================================

    return (
        <div className="min-h-screen bg-[#0a0c10] text-gray-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
            
            {/* Header Section: Elite Branding */}
            <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="bg-cyan-600 p-1.5 rounded-lg shadow-lg shadow-cyan-900/20">
                            <Layers className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                            Quantum <span className="text-cyan-500">Financial</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                        <ShieldCheck size={14} className="text-green-500" /> 
                        Enterprise Reconciliation Nexus • <span className="text-cyan-400/80">Sovereign Demo Environment</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">System Status</span>
                        <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> ALL SYSTEMS NOMINAL
                        </span>
                    </div>
                    <button 
                        onClick={() => setShowSecurityModal(true)}
                        className="p-2 bg-gray-800 border border-gray-700 rounded-full hover:border-cyan-500 transition-all group"
                    >
                        <Lock size={18} className="group-hover:text-cyan-400" />
                    </button>
                    <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-cyan-900/20 flex items-center gap-2">
                        <Play size={14} /> Deploy to Production
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Controls & AI Chat */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Navigation / Tabs */}
                    <Card variant="default" padding="none" className="overflow-hidden">
                        <div className="flex flex-col">
                            <button 
                                onClick={() => setActiveTab('reconcile')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'reconcile' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <RefreshCcw size={18} /> Reconciliation Hub
                            </button>
                            <button 
                                onClick={() => setActiveTab('audit')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'audit' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <History size={18} /> Audit Persistence
                            </button>
                            <button 
                                onClick={() => setActiveTab('telemetry')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'telemetry' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <Gauge size={18} /> Engine Telemetry
                            </button>
                        </div>
                    </Card>

                    {/* AI Chat Bar (The "Cheat Sheet" Assistant) */}
                    <Card title="Treasury AI" icon={<MessageSquare className="text-cyan-400" size={18} />} className="h-[500px] flex flex-col">
                        <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-cyan-600 text-white rounded-tr-none' 
                                            : 'bg-gray-800 text-gray-300 border border-gray-700 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] text-gray-600 mt-1 uppercase">{msg.timestamp}</span>
                                </div>
                            ))}
                            {isAiThinking && (
                                <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold animate-pulse">
                                    <Cpu size={12} className="animate-spin" /> QUANTUM CORE THINKING...
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask the AI Architect..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Main Workspace */}
                <div className="lg:col-span-9 space-y-6">
                    
                    {activeTab === 'telemetry' && renderTelemetry()}
                    {activeTab === 'audit' && renderAuditTrail()}

                    {activeTab === 'reconcile' && (
                        <>
                            {/* Action Bar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">AI</div>
                                        <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">SEC</div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-400">
                                        <span className="text-white font-bold">{ledgerTx.filter(t => t.status === 'UNMATCHED').length}</span> items pending reconciliation
                                    </p>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 text-sm font-bold transition-all">
                                        <Filter size={16} /> Advanced Filter
                                    </button>
                                    <button 
                                        onClick={runAIMatching}
                                        disabled={isAutoMatching}
                                        className="flex-1 md:flex-none px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-all shadow-lg shadow-cyan-900/40"
                                    >
                                        {isAutoMatching ? <RefreshCcw size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                        AI Auto-Match
                                    </button>
                                </div>
                            </div>

                            {/* AI Suggestions Panel */}
                            {suggestions.length > 0 && (
                                <div className="p-6 bg-cyan-900/10 border border-cyan-500/30 rounded-2xl animate-fadeIn relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Cpu size={120} />
                                    </div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <Wand2 size={20} /> Neural Match Suggestions ({suggestions.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {suggestions.map((s, idx) => {
                                            const l = ledgerTx.find(t => t.id === s.ledgerId);
                                            const stmt = statementTx.find(t => t.id === s.statementId);
                                            if (!l || !stmt) return null;
                                            return (
                                                <div key={idx} className="p-4 bg-gray-900/80 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all group relative">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-500 font-mono uppercase">Confidence</span>
                                                            <span className="text-green-400 font-black text-lg">{(s.confidence * 100).toFixed(0)}%</span>
                                                        </div>
                                                        <div className="bg-gray-800 p-1.5 rounded text-[10px] font-mono text-gray-400">
                                                            {s.aiModel}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Ledger:</span>
                                                            <span className="text-white font-bold">${l.amount.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Statement:</span>
                                                            <span className="text-white font-bold">${stmt.amount.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-cyan-300/80 italic mb-4 line-clamp-2">"{s.reason}"</p>
                                                    <button 
                                                        onClick={() => handleAutoResolve(s)}
                                                        className="w-full py-2 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white text-xs font-black rounded-lg transition-all border border-cyan-500/30"
                                                    >
                                                        CONFIRM MATCH
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Main Reconciliation Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
                                
                                {/* Internal Ledger Side */}
                                <Card 
                                    title="Internal Ledger (ERP)" 
                                    subtitle="Source: SAP/Oracle Integration"
                                    className="flex flex-col h-full border-t-4 border-cyan-500"
                                    headerActions={[
                                        { id: 'sync', icon: <RefreshCcw />, label: 'Sync ERP', onClick: () => logAction('ERP_SYNC', 'Manual sync triggered', 'INFO') }
                                    ]}
                                >
                                    <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {ledgerTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                                            <div 
                                                key={tx.id}
                                                onClick={() => setSelectedLedger(tx.id === selectedLedger ? null : tx.id)}
                                                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                    selectedLedger === tx.id 
                                                        ? 'bg-cyan-900/20 border-cyan-500 shadow-lg shadow-cyan-900/20' 
                                                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-mono text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{tx.date}</span>
                                                    <span className="font-black text-white text-lg">${tx.amount.toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 font-medium truncate mb-2">{tx.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-600 font-mono">{tx.id}</span>
                                                    <div className="flex gap-1">
                                                        <span className="px-1.5 py-0.5 bg-gray-800 rounded text-[9px] text-gray-400 font-bold uppercase">{tx.metadata.rail}</span>
                                                        {tx.metadata.mfaVerified && <ShieldCheck size={12} className="text-green-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {ledgerTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                                            <div className="text-center py-20 text-gray-500 flex flex-col items-center animate-pulse">
                                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                                </div>
                                                <p className="font-bold text-white">Ledger Reconciled</p>
                                                <p className="text-xs">All internal records matched.</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Bank Statement Side */}
                                <Card 
                                    title="Bank Statement" 
                                    subtitle="Source: Quantum API Real-time Feed"
                                    className="flex flex-col h-full border-t-4 border-purple-500"
                                    headerActions={[
                                        { id: 'api', icon: <Database />, label: 'API Status', onClick: () => logAction('API_CHECK', 'Bank feed health check', 'INFO') }
                                    ]}
                                >
                                     <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {statementTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                                            <div 
                                                key={tx.id}
                                                onClick={() => setSelectedStatement(tx.id === selectedStatement ? null : tx.id)}
                                                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                    selectedStatement === tx.id 
                                                        ? 'bg-purple-900/20 border-purple-500 shadow-lg shadow-purple-900/20' 
                                                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-mono text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{tx.date}</span>
                                                    <span className="font-black text-white text-lg">${tx.amount.toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 font-medium truncate mb-2">{tx.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-600 font-mono">{tx.id}</span>
                                                    <div className="flex items-center gap-2">
                                                        {tx.riskScore > 0.5 && (
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[9px] font-bold animate-pulse">
                                                                <AlertTriangle size={10} /> HIGH RISK
                                                            </div>
                                                        )}
                                                        <span className="px-1.5 py-0.5 bg-gray-800 rounded text-[9px] text-gray-400 font-bold uppercase">{tx.metadata.rail}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                         {statementTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                                            <div className="text-center py-20 text-gray-500 flex flex-col items-center animate-pulse">
                                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                                </div>
                                                <p className="font-bold text-white">Statement Reconciled</p>
                                                <p className="text-xs">All bank transactions verified.</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Manual Match Action Bar (Floating HUD) */}
            <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-cyan-500/50 p-6 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] flex items-center gap-8 transition-all duration-500 z-50 ${selectedLedger && selectedStatement ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90 pointer-events-none'}`}>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ledger Item</span>
                        <span className="text-cyan-400 font-mono font-bold">{selectedLedger}</span>
                    </div>
                    <div className="h-10 w-px bg-gray-700"></div>
                    <div className="bg-cyan-500/20 p-2 rounded-full">
                        <RefreshCcw className="text-cyan-500 animate-spin-slow" size={24} />
                    </div>
                    <div className="h-10 w-px bg-gray-700"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Statement Item</span>
                        <span className="text-purple-400 font-mono font-bold">{selectedStatement}</span>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => { setSelectedLedger(null); setSelectedStatement(null); }} 
                        className="px-6 py-3 rounded-xl hover:bg-gray-800 text-gray-400 text-sm font-bold transition-all"
                    >
                        Abort
                    </button>
                    <button 
                        onClick={handleManualMatch} 
                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black shadow-lg shadow-cyan-900/40 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Fingerprint size={18} /> AUTHORIZE MATCH
                    </button>
                </div>
            </div>

            {/* Security Simulation Modal */}
            {showSecurityModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <Card className="max-w-md w-full border-cyan-500/50 shadow-[0_0_100px_rgba(6,182,212,0.1)]" title="Security Protocol V4" icon={<ShieldCheck className="text-cyan-400" />}>
                        <div className="space-y-6 py-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center">
                                    <Lock className="text-cyan-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Multi-Factor Authentication</p>
                                    <p className="text-xs text-gray-500">Biometric & Hardware Key Active</p>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-10 h-5 bg-cyan-600 rounded-full relative">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-gray-400 uppercase font-black">Encryption Telemetry</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                                        <p className="text-[10px] text-gray-500">AES-256-GCM</p>
                                        <p className="text-xs font-bold text-green-400">VERIFIED</p>
                                    </div>
                                    <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                                        <p className="text-[10px] text-gray-500">TLS 1.3</p>
                                        <p className="text-xs font-bold text-green-400">ACTIVE</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowSecurityModal(false)}
                                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black transition-all"
                            >
                                RETURN TO HUB
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Footer: Legal & Versioning */}
            <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span>© 2024 Quantum Financial Group</span>
                    <span className="text-gray-800">|</span>
                    <span>Build: 4.0.11-STABLE</span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Protocol</a>
                    <a href="#" className="hover:text-cyan-500 transition-colors">Security Whitepaper</a>
                    <a href="#" className="hover:text-cyan-500 transition-colors">API Documentation</a>
                </div>
            </footer>

            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1f2937;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #0891b2;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default ReconciliationHubView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/ReconciliationHubView (1).tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card';
import { ArrowRight, Check, X, Search, AlertCircle, Wand2 } from 'lucide-react';

// --- Mock Data Types ---
interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    source: 'INTERNAL_LEDGER' | 'BANK_STATEMENT';
    status: 'UNMATCHED' | 'MATCHED' | 'PENDING';
    currency: string;
}

interface MatchSuggestion {
    ledgerId: string;
    statementId: string;
    confidence: number;
    reason: string;
}

const MOCK_LEDGER: Transaction[] = [
    { id: 'L001', date: '2024-03-10', amount: 5000.00, description: 'Vendor Payment - Acme Corp', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L002', date: '2024-03-11', amount: 1250.50, description: 'Office Supplies', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L003', date: '2024-03-12', amount: 100000.00, description: 'Capital Injection', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L004', date: '2024-03-12', amount: 45.00, description: 'Coffee', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
];

const MOCK_STATEMENT: Transaction[] = [
    { id: 'S001', date: '2024-03-11', amount: 5000.00, description: 'ACH WDL ACME CORP', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S002', date: '2024-03-11', amount: 1250.50, description: 'STAPLES #9942', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S003', date: '2024-03-13', amount: 99985.00, description: 'WIRE IN CITI - FEE DEDUCTED', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S004', date: '2024-03-15', amount: 500.00, description: 'UNKNOWN CHARGE', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
];

const ReconciliationHubView: React.FC = () => {
    const [ledgerTx, setLedgerTx] = useState<Transaction[]>(MOCK_LEDGER);
    const [statementTx, setStatementTx] = useState<Transaction[]>(MOCK_STATEMENT);
    const [selectedLedger, setSelectedLedger] = useState<string | null>(null);
    const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [isAutoMatching, setIsAutoMatching] = useState(false);

    // --- AI Matching Logic ---
    const runAIMatching = () => {
        setIsAutoMatching(true);
        setTimeout(() => {
            const newSuggestions: MatchSuggestion[] = [];
            
            ledgerTx.filter(l => l.status === 'UNMATCHED').forEach(l => {
                statementTx.filter(s => s.status === 'UNMATCHED').forEach(s => {
                    let confidence = 0;
                    let reason = '';

                    // Exact Amount Match
                    if (l.amount === s.amount) {
                        confidence += 0.8;
                        reason = 'Exact amount match';
                    } 
                    // Fuzzy Amount Match (e.g., fees deducted)
                    else if (Math.abs(l.amount - s.amount) / l.amount < 0.01) {
                        confidence += 0.6;
                        reason = 'Close amount (possible fee deduction)';
                    }

                    // Date proximity
                    const dateDiff = Math.abs(new Date(l.date).getTime() - new Date(s.date).getTime());
                    if (dateDiff < 86400000 * 2) { // 2 days
                        confidence += 0.1;
                    }

                    if (confidence > 0.5) {
                        newSuggestions.push({
                            ledgerId: l.id,
                            statementId: s.id,
                            confidence: Math.min(confidence, 0.99),
                            reason
                        });
                    }
                });
            });

            setSuggestions(newSuggestions);
            setIsAutoMatching(false);
        }, 1500);
    };

    const handleMatch = () => {
        if (selectedLedger && selectedStatement) {
            setLedgerTx(prev => prev.map(t => t.id === selectedLedger ? { ...t, status: 'MATCHED' } : t));
            setStatementTx(prev => prev.map(t => t.id === selectedStatement ? { ...t, status: 'MATCHED' } : t));
            setSelectedLedger(null);
            setSelectedStatement(null);
            // Remove used suggestions
            setSuggestions(prev => prev.filter(s => s.ledgerId !== selectedLedger && s.statementId !== selectedStatement));
        }
    };

    const handleAutoResolve = (suggestion: MatchSuggestion) => {
        setLedgerTx(prev => prev.map(t => t.id === suggestion.ledgerId ? { ...t, status: 'MATCHED' } : t));
        setStatementTx(prev => prev.map(t => t.id === suggestion.statementId ? { ...t, status: 'MATCHED' } : t));
        setSuggestions(prev => prev.filter(s => s !== suggestion));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Reconciliation Hub</h2>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 flex items-center gap-2">
                        <Search size={16} /> Filter
                    </button>
                    <button 
                        onClick={runAIMatching}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 flex items-center gap-2 disabled:opacity-50 transition-all"
                        disabled={isAutoMatching}
                    >
                        {isAutoMatching ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Wand2 size={16} />}
                        AI Auto-Match
                    </button>
                </div>
            </div>

            {/* AI Suggestions Panel */}
            {suggestions.length > 0 && (
                <div className="mb-6 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl animate-fadeIn">
                    <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                        <Wand2 size={18} /> Suggested Matches ({suggestions.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestions.map((s, idx) => {
                            const l = ledgerTx.find(t => t.id === s.ledgerId);
                            const stmt = statementTx.find(t => t.id === s.statementId);
                            if (!l || !stmt) return null;
                            return (
                                <div key={idx} className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors group">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <span>{l.id} ↔ {stmt.id}</span>
                                        <span className="text-green-400 font-mono">{(s.confidence * 100).toFixed(0)}% Match</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-bold">${l.amount.toLocaleString()}</span>
                                        <span className="text-gray-500 text-xs">vs</span>
                                        <span className="text-white font-bold">${stmt.amount.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-indigo-300 mb-3">{s.reason}</p>
                                    <button 
                                        onClick={() => handleAutoResolve(s)}
                                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded transition-colors"
                                    >
                                        Confirm Match
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                {/* Internal Ledger Side */}
                <Card title="Internal Ledger (ERP)" className="flex flex-col h-full border-l-4 border-blue-500">
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {ledgerTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                            <div 
                                key={tx.id}
                                onClick={() => setSelectedLedger(tx.id === selectedLedger ? null : tx.id)}
                                className={`p-3 rounded cursor-pointer transition-all border ${
                                    selectedLedger === tx.id ? 'bg-blue-900/40 border-blue-500' : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <span className="font-mono text-xs text-gray-500">{tx.date}</span>
                                    <span className="font-mono font-bold text-white">${tx.amount.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1 truncate">{tx.description}</p>
                                <div className="text-xs text-gray-500 mt-1">{tx.id}</div>
                            </div>
                        ))}
                        {ledgerTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                <Check className="w-12 h-12 text-green-500 mb-2" />
                                All ledger items reconciled.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Bank Statement Side */}
                <Card title="Bank Statement (Citibank API)" className="flex flex-col h-full border-r-4 border-green-500">
                     <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {statementTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                            <div 
                                key={tx.id}
                                onClick={() => setSelectedStatement(tx.id === selectedStatement ? null : tx.id)}
                                className={`p-3 rounded cursor-pointer transition-all border ${
                                    selectedStatement === tx.id ? 'bg-green-900/40 border-green-500' : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <span className="font-mono text-xs text-gray-500">{tx.date}</span>
                                    <span className="font-mono font-bold text-white">${tx.amount.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1 truncate">{tx.description}</p>
                                <div className="text-xs text-gray-500 mt-1">{tx.id}</div>
                            </div>
                        ))}
                         {statementTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                <Check className="w-12 h-12 text-green-500 mb-2" />
                                All statement items reconciled.
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Manual Match Action Bar */}
            <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 p-4 rounded-xl shadow-2xl flex items-center gap-6 transition-all duration-300 ${selectedLedger && selectedStatement ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="text-sm">
                    <span className="text-gray-400">Linking</span> <span className="text-blue-400 font-mono">{selectedLedger}</span> <span className="text-gray-400">to</span> <span className="text-green-400 font-mono">{selectedStatement}</span>
                </div>
                <div className="h-8 w-px bg-gray-600"></div>
                <div className="flex gap-2">
                    <button onClick={() => { setSelectedLedger(null); setSelectedStatement(null); }} className="px-4 py-2 rounded hover:bg-gray-700 text-gray-300 text-sm font-medium">Cancel</button>
                    <button onClick={handleMatch} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold shadow-lg flex items-center gap-2">
                        <Check size={16} /> Match
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReconciliationHubView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/ReconciliationHubView.tsx
================================================================================

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, Check, X, Search, AlertCircle, Wand2, 
  ShieldCheck, Activity, Database, Zap, MessageSquare, 
  Terminal, BarChart3, Lock, Cpu, Gauge, Layers, 
  History, Settings, Download, Filter, RefreshCcw,
  ChevronRight, Play, Info, AlertTriangle, Eye,
  FileText, Share2, Trash2, CheckCircle2, Fingerprint
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';

/**
 * QUANTUM FINANCIAL - RECONCILIATION NEXUS V4.0
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience: High-polish, elite performance.
 * - "Test Drive": Interactive, low-pressure, high-feedback.
 * - "Bells and Whistles": AI-driven insights, real-time telemetry, audit persistence.
 * 
 * SECURITY: Multi-factor simulation and fraud monitoring integrated.
 * AUDIT: Every sensitive action is logged to the internal state "Black Box".
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    source: 'INTERNAL_LEDGER' | 'BANK_STATEMENT';
    status: 'UNMATCHED' | 'MATCHED' | 'PENDING' | 'FLAGGED';
    currency: string;
    category: string;
    riskScore: number;
    metadata: {
        traceId: string;
        originatingIp?: string;
        mfaVerified: boolean;
        rail: 'ACH' | 'WIRE' | 'SWIFT';
    };
}

interface MatchSuggestion {
    ledgerId: string;
    statementId: string;
    confidence: number;
    reason: string;
    aiModel: string;
}

interface AuditEntry {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
    severity: 'INFO' | 'SECURITY' | 'CRITICAL';
    hash: string; // Simulated blockchain hash for integrity
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

interface TelemetryData {
    cpuLoad: number;
    memoryUsage: number;
    apiLatency: number;
    fraudDetectionActive: boolean;
}

// ================================================================================================
// MOCK DATA GENERATION (THE "ENGINE" FUEL)
// ================================================================================================

const GENERATE_MOCK_LEDGER = (): Transaction[] => [
    { id: 'TX-L-9901', date: '2024-05-10', amount: 125000.00, description: 'Global Logistics - Q2 Settlement', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Operations', riskScore: 0.02, metadata: { traceId: 'TRC-001', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-L-9902', date: '2024-05-11', amount: 4250.50, description: 'Cloud Infrastructure - AWS Monthly', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Technology', riskScore: 0.05, metadata: { traceId: 'TRC-002', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-L-9903', date: '2024-05-12', amount: 890000.00, description: 'Strategic Acquisition - Alpha Corp', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Investment', riskScore: 0.12, metadata: { traceId: 'TRC-003', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-L-9904', date: '2024-05-12', amount: 150.00, description: 'Executive Catering - Board Meeting', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'G&A', riskScore: 0.01, metadata: { traceId: 'TRC-004', mfaVerified: false, rail: 'ACH' } },
    { id: 'TX-L-9905', date: '2024-05-13', amount: 55000.00, description: 'Payroll Funding - EMEA Region', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Payroll', riskScore: 0.03, metadata: { traceId: 'TRC-005', mfaVerified: true, rail: 'SWIFT' } },
    { id: 'TX-L-9906', date: '2024-05-14', amount: 1200.00, description: 'Office Supplies - Staples', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'G&A', riskScore: 0.01, metadata: { traceId: 'TRC-006', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-L-9907', date: '2024-05-15', amount: 33400.00, description: 'Marketing Campaign - Summer Launch', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Marketing', riskScore: 0.08, metadata: { traceId: 'TRC-007', mfaVerified: true, rail: 'WIRE' } },
];

const GENERATE_MOCK_STATEMENT = (): Transaction[] => [
    { id: 'TX-S-8801', date: '2024-05-11', amount: 125000.00, description: 'INCOMING WIRE: GLOBAL LOGISTICS', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.02, metadata: { traceId: 'TRC-S01', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-S-8802', date: '2024-05-11', amount: 4250.50, description: 'ACH DEBIT: AMZN MKTP', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.04, metadata: { traceId: 'TRC-S02', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-S-8803', date: '2024-05-13', amount: 889985.00, description: 'WIRE OUT: ALPHA CORP - FEE ADJ', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.15, metadata: { traceId: 'TRC-S03', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-S-8804', date: '2024-05-15', amount: 500.00, description: 'UNKNOWN POS DEBIT - NYC', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.85, metadata: { traceId: 'TRC-S04', mfaVerified: false, rail: 'ACH' } },
    { id: 'TX-S-8805', date: '2024-05-14', amount: 55000.00, description: 'SWIFT: EMEA PAYROLL FUND', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.03, metadata: { traceId: 'TRC-S05', mfaVerified: true, rail: 'SWIFT' } },
];

// ================================================================================================
// MAIN COMPONENT: RECONCILIATION HUB
// ================================================================================================

const ReconciliationHubView: React.FC = () => {
    // --- State Management ---
    const [ledgerTx, setLedgerTx] = useState<Transaction[]>(GENERATE_MOCK_LEDGER());
    const [statementTx, setStatementTx] = useState<Transaction[]>(GENERATE_MOCK_STATEMENT());
    const [selectedLedger, setSelectedLedger] = useState<string | null>(null);
    const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [isAutoMatching, setIsAutoMatching] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Welcome to the Quantum Financial Demo. I am your AI Treasury Assistant. How can I help you kick the tires on our reconciliation engine today?", timestamp: new Date().toLocaleTimeString() }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [activeTab, setActiveTab] = useState<'reconcile' | 'audit' | 'telemetry'>('reconcile');
    const [telemetry, setTelemetry] = useState<TelemetryData>({ cpuLoad: 12, memoryUsage: 45, apiLatency: 24, fraudDetectionActive: true });
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // --- AI Initialization ---
    // Using the provided pattern for Gemini
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

    // --- Helper: Audit Logger ---
    const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'INFO') => {
        const newEntry: AuditEntry = {
            timestamp: new Date().toISOString(),
            action,
            details,
            severity,
            hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        };
        setAuditLogs(prev => [newEntry, ...prev]);
        console.log(`[AUDIT] ${action}: ${details}`);
    }, []);

    // --- Effect: Telemetry Simulation ---
    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => ({
                cpuLoad: Math.floor(Math.random() * 20) + 5,
                memoryUsage: 40 + Math.floor(Math.random() * 10),
                apiLatency: 15 + Math.floor(Math.random() * 30),
                fraudDetectionActive: true
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // --- Effect: Scroll Chat ---
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // --- AI Logic: Chat & Interaction ---
    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const userMsg: ChatMessage = { role: 'user', content: userInput, timestamp: new Date().toLocaleTimeString() };
        setChatHistory(prev => [...prev, userMsg]);
        setUserInput('');
        setIsAiThinking(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            // Contextual prompt for the AI
            const prompt = `
                You are the Quantum Financial AI Assistant. 
                The user is currently in the "Reconciliation Hub" of a high-performance business banking demo.
                Philosophy: "Golden Ticket" experience, "Test Drive" the car, "Bells and Whistles".
                Current State: 
                - Unmatched Ledger Items: ${ledgerTx.filter(t => t.status === 'UNMATCHED').length}
                - Unmatched Statement Items: ${statementTx.filter(t => t.status === 'UNMATCHED').length}
                - Security Status: Multi-factor Auth Active, Fraud Monitoring Active.
                
                User said: "${userInput}"
                
                Respond as an elite financial architect. Be professional, secure, and helpful. 
                If they ask to "reconcile everything", tell them to click the "AI Auto-Match" button to see the engine roar.
                Do NOT mention Citibank. Use "The Demo Bank" or "Quantum Financial".
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: text, 
                timestamp: new Date().toLocaleTimeString() 
            }]);
            logAction('AI_INTERACTION', `User asked: ${userInput.substring(0, 30)}...`, 'INFO');
        } catch (error) {
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: "I apologize, but my neural link is experiencing high latency. Please try again or use the manual controls.", 
                timestamp: new Date().toLocaleTimeString() 
            }]);
            logAction('AI_ERROR', 'Failed to generate AI response', 'CRITICAL');
        } finally {
            setIsAiThinking(false);
        }
    };

    // --- Logic: AI Auto-Matching (The "Engine Roar") ---
    const runAIMatching = () => {
        setIsAutoMatching(true);
        logAction('AI_AUTO_MATCH_START', 'Initiating heuristic matching engine', 'INFO');
        
        setTimeout(() => {
            const newSuggestions: MatchSuggestion[] = [];
            
            ledgerTx.filter(l => l.status === 'UNMATCHED').forEach(l => {
                statementTx.filter(s => s.status === 'UNMATCHED').forEach(s => {
                    let confidence = 0;
                    let reason = '';

                    // Exact Amount Match
                    if (l.amount === s.amount) {
                        confidence += 0.85;
                        reason = 'Exact currency value parity detected.';
                    } 
                    // Fuzzy Amount Match (e.g., fees deducted)
                    else if (Math.abs(l.amount - s.amount) / l.amount < 0.02) {
                        confidence += 0.65;
                        reason = 'High-probability match with variance (likely wire fees).';
                    }

                    // Description Keyword Match
                    const lDesc = l.description.toLowerCase();
                    const sDesc = s.description.toLowerCase();
                    if (lDesc.split(' ').some(word => word.length > 3 && sDesc.includes(word))) {
                        confidence += 0.1;
                    }

                    if (confidence > 0.6) {
                        newSuggestions.push({
                            ledgerId: l.id,
                            statementId: s.id,
                            confidence: Math.min(confidence, 0.99),
                            reason,
                            aiModel: 'Quantum-Heuristic-v4'
                        });
                    }
                });
            });

            setSuggestions(newSuggestions);
            setIsAutoMatching(false);
            logAction('AI_AUTO_MATCH_COMPLETE', `Found ${newSuggestions.length} potential matches`, 'INFO');
        }, 2000);
    };

    // --- Logic: Manual Matching ---
    const handleManualMatch = () => {
        if (selectedLedger && selectedStatement) {
            const lTx = ledgerTx.find(t => t.id === selectedLedger);
            const sTx = statementTx.find(t => t.id === selectedStatement);

            if (lTx && sTx) {
                setLedgerTx(prev => prev.map(t => t.id === selectedLedger ? { ...t, status: 'MATCHED' } : t));
                setStatementTx(prev => prev.map(t => t.id === selectedStatement ? { ...t, status: 'MATCHED' } : t));
                
                logAction('MANUAL_MATCH', `Linked ${selectedLedger} to ${selectedStatement} (Value: $${lTx.amount})`, 'INFO');
                
                setSelectedLedger(null);
                setSelectedStatement(null);
                setSuggestions(prev => prev.filter(s => s.ledgerId !== selectedLedger && s.statementId !== selectedStatement));
            }
        }
    };

    const handleAutoResolve = (suggestion: MatchSuggestion) => {
        setLedgerTx(prev => prev.map(t => t.id === suggestion.ledgerId ? { ...t, status: 'MATCHED' } : t));
        setStatementTx(prev => prev.map(t => t.id === suggestion.statementId ? { ...t, status: 'MATCHED' } : t));
        setSuggestions(prev => prev.filter(s => s !== suggestion));
        logAction('AI_RESOLVE', `Confirmed AI suggestion: ${suggestion.ledgerId} <-> ${suggestion.statementId}`, 'INFO');
    };

    // ================================================================================================
    // RENDER SUB-COMPONENTS
    // ================================================================================================

    const renderTelemetry = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fadeIn">
            <Card variant="default" padding="sm" className="border-cyan-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Engine Load</p>
                        <p className="text-2xl font-bold text-cyan-400">{telemetry.cpuLoad}%</p>
                    </div>
                    <Cpu className="text-cyan-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${telemetry.cpuLoad}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-purple-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Neural Memory</p>
                        <p className="text-2xl font-bold text-purple-400">{telemetry.memoryUsage}%</p>
                    </div>
                    <Activity className="text-purple-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${telemetry.memoryUsage}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-green-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">API Latency</p>
                        <p className="text-2xl font-bold text-green-400">{telemetry.apiLatency}ms</p>
                    </div>
                    <Zap className="text-green-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(telemetry.apiLatency / 100) * 100}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-red-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Fraud Shield</p>
                        <p className="text-2xl font-bold text-red-400">ACTIVE</p>
                    </div>
                    <ShieldCheck className="text-red-500/50" size={24} />
                </div>
                <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-1 flex-1 bg-red-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
                </div>
            </Card>
        </div>
    );

    const renderAuditTrail = () => (
        <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <History size={20} className="text-cyan-400" /> System Black Box (Audit Persistence)
                </h3>
                <button className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                    <Download size={14} /> Export Immutable Log
                </button>
            </div>
            <div className="bg-gray-900/80 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Details</th>
                            <th className="px-4 py-3">Integrity Hash</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {auditLogs.map((log, idx) => (
                            <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
                                        log.severity === 'SECURITY' ? 'bg-purple-500/20 text-purple-400' : 
                                        'bg-cyan-500/20 text-cyan-400'
                                    }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-300">{log.details}</td>
                                <td className="px-4 py-3 font-mono text-[10px] text-gray-600">{log.hash}</td>
                            </tr>
                        ))}
                        {auditLogs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-gray-500 italic">No audit entries recorded in this session.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // ================================================================================================
    // MAIN RENDER
    // ================================================================================================

    return (
        <div className="min-h-screen bg-[#0a0c10] text-gray-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
            
            {/* Header Section: Elite Branding */}
            <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="bg-cyan-600 p-1.5 rounded-lg shadow-lg shadow-cyan-900/20">
                            <Layers className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                            Quantum <span className="text-cyan-500">Financial</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                        <ShieldCheck size={14} className="text-green-500" /> 
                        Enterprise Reconciliation Nexus • <span className="text-cyan-400/80">Sovereign Demo Environment</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">System Status</span>
                        <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> ALL SYSTEMS NOMINAL
                        </span>
                    </div>
                    <button 
                        onClick={() => setShowSecurityModal(true)}
                        className="p-2 bg-gray-800 border border-gray-700 rounded-full hover:border-cyan-500 transition-all group"
                    >
                        <Lock size={18} className="group-hover:text-cyan-400" />
                    </button>
                    <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-cyan-900/20 flex items-center gap-2">
                        <Play size={14} /> Deploy to Production
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Controls & AI Chat */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Navigation / Tabs */}
                    <Card variant="default" padding="none" className="overflow-hidden">
                        <div className="flex flex-col">
                            <button 
                                onClick={() => setActiveTab('reconcile')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'reconcile' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <RefreshCcw size={18} /> Reconciliation Hub
                            </button>
                            <button 
                                onClick={() => setActiveTab('audit')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'audit' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <History size={18} /> Audit Persistence
                            </button>
                            <button 
                                onClick={() => setActiveTab('telemetry')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'telemetry' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <Gauge size={18} /> Engine Telemetry
                            </button>
                        </div>
                    </Card>

                    {/* AI Chat Bar (The "Cheat Sheet" Assistant) */}
                    <Card title="Treasury AI" icon={<MessageSquare className="text-cyan-400" size={18} />} className="h-[500px] flex flex-col">
                        <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-cyan-600 text-white rounded-tr-none' 
                                            : 'bg-gray-800 text-gray-300 border border-gray-700 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] text-gray-600 mt-1 uppercase">{msg.timestamp}</span>
                                </div>
                            ))}
                            {isAiThinking && (
                                <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold animate-pulse">
                                    <Cpu size={12} className="animate-spin" /> QUANTUM CORE THINKING...
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask the AI Architect..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Main Workspace */}
                <div className="lg:col-span-9 space-y-6">
                    
                    {activeTab === 'telemetry' && renderTelemetry()}
                    {activeTab === 'audit' && renderAuditTrail()}

                    {activeTab === 'reconcile' && (
                        <>
                            {/* Action Bar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">AI</div>
                                        <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">SEC</div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-400">
                                        <span className="text-white font-bold">{ledgerTx.filter(t => t.status === 'UNMATCHED').length}</span> items pending reconciliation
                                    </p>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 text-sm font-bold transition-all">
                                        <Filter size={16} /> Advanced Filter
                                    </button>
                                    <button 
                                        onClick={runAIMatching}
                                        disabled={isAutoMatching}
                                        className="flex-1 md:flex-none px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-all shadow-lg shadow-cyan-900/40"
                                    >
                                        {isAutoMatching ? <RefreshCcw size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                        AI Auto-Match
                                    </button>
                                </div>
                            </div>

                            {/* AI Suggestions Panel */}
                            {suggestions.length > 0 && (
                                <div className="p-6 bg-cyan-900/10 border border-cyan-500/30 rounded-2xl animate-fadeIn relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Cpu size={120} />
                                    </div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <Wand2 size={20} /> Neural Match Suggestions ({suggestions.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {suggestions.map((s, idx) => {
                                            const l = ledgerTx.find(t => t.id === s.ledgerId);
                                            const stmt = statementTx.find(t => t.id === s.statementId);
                                            if (!l || !stmt) return null;
                                            return (
                                                <div key={idx} className="p-4 bg-gray-900/80 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all group relative">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-500 font-mono uppercase">Confidence</span>
                                                            <span className="text-green-400 font-black text-lg">{(s.confidence * 100).toFixed(0)}%</span>
                                                        </div>
                                                        <div className="bg-gray-800 p-1.5 rounded text-[10px] font-mono text-gray-400">
                                                            {s.aiModel}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Ledger:</span>
                                                            <span className="text-white font-bold">${l.amount.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Statement:</span>
                                                            <span className="text-white font-bold">${stmt.amount.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-cyan-300/80 italic mb-4 line-clamp-2">"{s.reason}"</p>
                                                    <button 
                                                        onClick={() => handleAutoResolve(s)}
                                                        className="w-full py-2 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white text-xs font-black rounded-lg transition-all border border-cyan-500/30"
                                                    >
                                                        CONFIRM MATCH
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Main Reconciliation Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
                                
                                {/* Internal Ledger Side */}
                                <Card 
                                    title="Internal Ledger (ERP)" 
                                    subtitle="Source: SAP/Oracle Integration"
                                    className="flex flex-col h-full border-t-4 border-cyan-500"
                                    headerActions={[
                                        { id: 'sync', icon: <RefreshCcw />, label: 'Sync ERP', onClick: () => logAction('ERP_SYNC', 'Manual sync triggered', 'INFO') }
                                    ]}
                                >
                                    <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {ledgerTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                                            <div 
                                                key={tx.id}
                                                onClick={() => setSelectedLedger(tx.id === selectedLedger ? null : tx.id)}
                                                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                    selectedLedger === tx.id 
                                                        ? 'bg-cyan-900/20 border-cyan-500 shadow-lg shadow-cyan-900/20' 
                                                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-mono text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{tx.date}</span>
                                                    <span className="font-black text-white text-lg">${tx.amount.toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 font-medium truncate mb-2">{tx.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-600 font-mono">{tx.id}</span>
                                                    <div className="flex gap-1">
                                                        <span className="px-1.5 py-0.5 bg-gray-800 rounded text-[9px] text-gray-400 font-bold uppercase">{tx.metadata.rail}</span>
                                                        {tx.metadata.mfaVerified && <ShieldCheck size={12} className="text-green-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {ledgerTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                                            <div className="text-center py-20 text-gray-500 flex flex-col items-center animate-pulse">
                                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                                </div>
                                                <p className="font-bold text-white">Ledger Reconciled</p>
                                                <p className="text-xs">All internal records matched.</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Bank Statement Side */}
                                <Card 
                                    title="Bank Statement" 
                                    subtitle="Source: Quantum API Real-time Feed"
                                    className="flex flex-col h-full border-t-4 border-purple-500"
                                    headerActions={[
                                        { id: 'api', icon: <Database />, label: 'API Status', onClick: () => logAction('API_CHECK', 'Bank feed health check', 'INFO') }
                                    ]}
                                >
                                     <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {statementTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                                            <div 
                                                key={tx.id}
                                                onClick={() => setSelectedStatement(tx.id === selectedStatement ? null : tx.id)}
                                                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                    selectedStatement === tx.id 
                                                        ? 'bg-purple-900/20 border-purple-500 shadow-lg shadow-purple-900/20' 
                                                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-mono text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{tx.date}</span>
                                                    <span className="font-black text-white text-lg">${tx.amount.toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 font-medium truncate mb-2">{tx.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-600 font-mono">{tx.id}</span>
                                                    <div className="flex items-center gap-2">
                                                        {tx.riskScore > 0.5 && (
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[9px] font-bold animate-pulse">
                                                                <AlertTriangle size={10} /> HIGH RISK
                                                            </div>
                                                        )}
                                                        <span className="px-1.5 py-0.5 bg-gray-800 rounded text-[9px] text-gray-400 font-bold uppercase">{tx.metadata.rail}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                         {statementTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                                            <div className="text-center py-20 text-gray-500 flex flex-col items-center animate-pulse">
                                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                                </div>
                                                <p className="font-bold text-white">Statement Reconciled</p>
                                                <p className="text-xs">All bank transactions verified.</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Manual Match Action Bar (Floating HUD) */}
            <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-cyan-500/50 p-6 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] flex items-center gap-8 transition-all duration-500 z-50 ${selectedLedger && selectedStatement ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90 pointer-events-none'}`}>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ledger Item</span>
                        <span className="text-cyan-400 font-mono font-bold">{selectedLedger}</span>
                    </div>
                    <div className="h-10 w-px bg-gray-700"></div>
                    <div className="bg-cyan-500/20 p-2 rounded-full">
                        <RefreshCcw className="text-cyan-500 animate-spin-slow" size={24} />
                    </div>
                    <div className="h-10 w-px bg-gray-700"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Statement Item</span>
                        <span className="text-purple-400 font-mono font-bold">{selectedStatement}</span>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => { setSelectedLedger(null); setSelectedStatement(null); }} 
                        className="px-6 py-3 rounded-xl hover:bg-gray-800 text-gray-400 text-sm font-bold transition-all"
                    >
                        Abort
                    </button>
                    <button 
                        onClick={handleManualMatch} 
                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black shadow-lg shadow-cyan-900/40 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Fingerprint size={18} /> AUTHORIZE MATCH
                    </button>
                </div>
            </div>

            {/* Security Simulation Modal */}
            {showSecurityModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <Card className="max-w-md w-full border-cyan-500/50 shadow-[0_0_100px_rgba(6,182,212,0.1)]" title="Security Protocol V4" icon={<ShieldCheck className="text-cyan-400" />}>
                        <div className="space-y-6 py-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center">
                                    <Lock className="text-cyan-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Multi-Factor Authentication</p>
                                    <p className="text-xs text-gray-500">Biometric & Hardware Key Active</p>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-10 h-5 bg-cyan-600 rounded-full relative">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-gray-400 uppercase font-black">Encryption Telemetry</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                                        <p className="text-[10px] text-gray-500">AES-256-GCM</p>
                                        <p className="text-xs font-bold text-green-400">VERIFIED</p>
                                    </div>
                                    <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                                        <p className="text-[10px] text-gray-500">TLS 1.3</p>
                                        <p className="text-xs font-bold text-green-400">ACTIVE</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowSecurityModal(false)}
                                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black transition-all"
                            >
                                RETURN TO HUB
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Footer: Legal & Versioning */}
            <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span>© 2024 Quantum Financial Group</span>
                    <span className="text-gray-800">|</span>
                    <span>Build: 4.0.11-STABLE</span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Protocol</a>
                    <a href="#" className="hover:text-cyan-500 transition-colors">Security Whitepaper</a>
                    <a href="#" className="hover:text-cyan-500 transition-colors">API Documentation</a>
                </div>
            </footer>

            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1f2937;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #0891b2;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default ReconciliationHubView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/ReconciliationHubView_1.tsx
================================================================================

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, Check, X, Search, AlertCircle, Wand2, 
  ShieldCheck, Activity, Database, Zap, MessageSquare, 
  Terminal, BarChart3, Lock, Cpu, Gauge, Layers, 
  History, Settings, Download, Filter, RefreshCcw,
  ChevronRight, Play, Info, AlertTriangle, Eye,
  FileText, Share2, Trash2, CheckCircle2, Fingerprint
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';

/**
 * QUANTUM FINANCIAL - RECONCILIATION NEXUS V4.0
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience: High-polish, elite performance.
 * - "Test Drive": Interactive, low-pressure, high-feedback.
 * - "Bells and Whistles": AI-driven insights, real-time telemetry, audit persistence.
 * 
 * SECURITY: Multi-factor simulation and fraud monitoring integrated.
 * AUDIT: Every sensitive action is logged to the internal state "Black Box".
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    source: 'INTERNAL_LEDGER' | 'BANK_STATEMENT';
    status: 'UNMATCHED' | 'MATCHED' | 'PENDING' | 'FLAGGED';
    currency: string;
    category: string;
    riskScore: number;
    metadata: {
        traceId: string;
        originatingIp?: string;
        mfaVerified: boolean;
        rail: 'ACH' | 'WIRE' | 'SWIFT';
    };
}

interface MatchSuggestion {
    ledgerId: string;
    statementId: string;
    confidence: number;
    reason: string;
    aiModel: string;
}

interface AuditEntry {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
    severity: 'INFO' | 'SECURITY' | 'CRITICAL';
    hash: string; // Simulated blockchain hash for integrity
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

interface TelemetryData {
    cpuLoad: number;
    memoryUsage: number;
    apiLatency: number;
    fraudDetectionActive: boolean;
}

// ================================================================================================
// MOCK DATA GENERATION (THE "ENGINE" FUEL)
// ================================================================================================

const GENERATE_MOCK_LEDGER = (): Transaction[] => [
    { id: 'TX-L-9901', date: '2024-05-10', amount: 125000.00, description: 'Global Logistics - Q2 Settlement', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Operations', riskScore: 0.02, metadata: { traceId: 'TRC-001', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-L-9902', date: '2024-05-11', amount: 4250.50, description: 'Cloud Infrastructure - AWS Monthly', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Technology', riskScore: 0.05, metadata: { traceId: 'TRC-002', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-L-9903', date: '2024-05-12', amount: 890000.00, description: 'Strategic Acquisition - Alpha Corp', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Investment', riskScore: 0.12, metadata: { traceId: 'TRC-003', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-L-9904', date: '2024-05-12', amount: 150.00, description: 'Executive Catering - Board Meeting', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'G&A', riskScore: 0.01, metadata: { traceId: 'TRC-004', mfaVerified: false, rail: 'ACH' } },
    { id: 'TX-L-9905', date: '2024-05-13', amount: 55000.00, description: 'Payroll Funding - EMEA Region', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Payroll', riskScore: 0.03, metadata: { traceId: 'TRC-005', mfaVerified: true, rail: 'SWIFT' } },
    { id: 'TX-L-9906', date: '2024-05-14', amount: 1200.00, description: 'Office Supplies - Staples', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'G&A', riskScore: 0.01, metadata: { traceId: 'TRC-006', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-L-9907', date: '2024-05-15', amount: 33400.00, description: 'Marketing Campaign - Summer Launch', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Marketing', riskScore: 0.08, metadata: { traceId: 'TRC-007', mfaVerified: true, rail: 'WIRE' } },
];

const GENERATE_MOCK_STATEMENT = (): Transaction[] => [
    { id: 'TX-S-8801', date: '2024-05-11', amount: 125000.00, description: 'INCOMING WIRE: GLOBAL LOGISTICS', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.02, metadata: { traceId: 'TRC-S01', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-S-8802', date: '2024-05-11', amount: 4250.50, description: 'ACH DEBIT: AMZN MKTP', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.04, metadata: { traceId: 'TRC-S02', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-S-8803', date: '2024-05-13', amount: 889985.00, description: 'WIRE OUT: ALPHA CORP - FEE ADJ', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.15, metadata: { traceId: 'TRC-S03', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-S-8804', date: '2024-05-15', amount: 500.00, description: 'UNKNOWN POS DEBIT - NYC', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.85, metadata: { traceId: 'TRC-S04', mfaVerified: false, rail: 'ACH' } },
    { id: 'TX-S-8805', date: '2024-05-14', amount: 55000.00, description: 'SWIFT: EMEA PAYROLL FUND', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.03, metadata: { traceId: 'TRC-S05', mfaVerified: true, rail: 'SWIFT' } },
];

// ================================================================================================
// MAIN COMPONENT: RECONCILIATION HUB
// ================================================================================================

const ReconciliationHubView: React.FC = () => {
    // --- State Management ---
    const [ledgerTx, setLedgerTx] = useState<Transaction[]>(GENERATE_MOCK_LEDGER());
    const [statementTx, setStatementTx] = useState<Transaction[]>(GENERATE_MOCK_STATEMENT());
    const [selectedLedger, setSelectedLedger] = useState<string | null>(null);
    const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [isAutoMatching, setIsAutoMatching] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Welcome to the Quantum Financial Demo. I am your AI Treasury Assistant. How can I help you kick the tires on our reconciliation engine today?", timestamp: new Date().toLocaleTimeString() }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [activeTab, setActiveTab] = useState<'reconcile' | 'audit' | 'telemetry'>('reconcile');
    const [telemetry, setTelemetry] = useState<TelemetryData>({ cpuLoad: 12, memoryUsage: 45, apiLatency: 24, fraudDetectionActive: true });
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // --- AI Initialization ---
    // Using the provided pattern for Gemini
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

    // --- Helper: Audit Logger ---
    const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'INFO') => {
        const newEntry: AuditEntry = {
            timestamp: new Date().toISOString(),
            action,
            details,
            severity,
            hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        };
        setAuditLogs(prev => [newEntry, ...prev]);
        console.log(`[AUDIT] ${action}: ${details}`);
    }, []);

    // --- Effect: Telemetry Simulation ---
    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => ({
                cpuLoad: Math.floor(Math.random() * 20) + 5,
                memoryUsage: 40 + Math.floor(Math.random() * 10),
                apiLatency: 15 + Math.floor(Math.random() * 30),
                fraudDetectionActive: true
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // --- Effect: Scroll Chat ---
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // --- AI Logic: Chat & Interaction ---
    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const userMsg: ChatMessage = { role: 'user', content: userInput, timestamp: new Date().toLocaleTimeString() };
        setChatHistory(prev => [...prev, userMsg]);
        setUserInput('');
        setIsAiThinking(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            // Contextual prompt for the AI
            const prompt = `
                You are the Quantum Financial AI Assistant. 
                The user is currently in the "Reconciliation Hub" of a high-performance business banking demo.
                Philosophy: "Golden Ticket" experience, "Test Drive" the car, "Bells and Whistles".
                Current State: 
                - Unmatched Ledger Items: ${ledgerTx.filter(t => t.status === 'UNMATCHED').length}
                - Unmatched Statement Items: ${statementTx.filter(t => t.status === 'UNMATCHED').length}
                - Security Status: Multi-factor Auth Active, Fraud Monitoring Active.
                
                User said: "${userInput}"
                
                Respond as an elite financial architect. Be professional, secure, and helpful. 
                If they ask to "reconcile everything", tell them to click the "AI Auto-Match" button to see the engine roar.
                Do NOT mention Citibank. Use "The Demo Bank" or "Quantum Financial".
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: text, 
                timestamp: new Date().toLocaleTimeString() 
            }]);
            logAction('AI_INTERACTION', `User asked: ${userInput.substring(0, 30)}...`, 'INFO');
        } catch (error) {
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: "I apologize, but my neural link is experiencing high latency. Please try again or use the manual controls.", 
                timestamp: new Date().toLocaleTimeString() 
            }]);
            logAction('AI_ERROR', 'Failed to generate AI response', 'CRITICAL');
        } finally {
            setIsAiThinking(false);
        }
    };

    // --- Logic: AI Auto-Matching (The "Engine Roar") ---
    const runAIMatching = () => {
        setIsAutoMatching(true);
        logAction('AI_AUTO_MATCH_START', 'Initiating heuristic matching engine', 'INFO');
        
        setTimeout(() => {
            const newSuggestions: MatchSuggestion[] = [];
            
            ledgerTx.filter(l => l.status === 'UNMATCHED').forEach(l => {
                statementTx.filter(s => s.status === 'UNMATCHED').forEach(s => {
                    let confidence = 0;
                    let reason = '';

                    // Exact Amount Match
                    if (l.amount === s.amount) {
                        confidence += 0.85;
                        reason = 'Exact currency value parity detected.';
                    } 
                    // Fuzzy Amount Match (e.g., fees deducted)
                    else if (Math.abs(l.amount - s.amount) / l.amount < 0.02) {
                        confidence += 0.65;
                        reason = 'High-probability match with variance (likely wire fees).';
                    }

                    // Description Keyword Match
                    const lDesc = l.description.toLowerCase();
                    const sDesc = s.description.toLowerCase();
                    if (lDesc.split(' ').some(word => word.length > 3 && sDesc.includes(word))) {
                        confidence += 0.1;
                    }

                    if (confidence > 0.6) {
                        newSuggestions.push({
                            ledgerId: l.id,
                            statementId: s.id,
                            confidence: Math.min(confidence, 0.99),
                            reason,
                            aiModel: 'Quantum-Heuristic-v4'
                        });
                    }
                });
            });

            setSuggestions(newSuggestions);
            setIsAutoMatching(false);
            logAction('AI_AUTO_MATCH_COMPLETE', `Found ${newSuggestions.length} potential matches`, 'INFO');
        }, 2000);
    };

    // --- Logic: Manual Matching ---
    const handleManualMatch = () => {
        if (selectedLedger && selectedStatement) {
            const lTx = ledgerTx.find(t => t.id === selectedLedger);
            const sTx = statementTx.find(t => t.id === selectedStatement);

            if (lTx && sTx) {
                setLedgerTx(prev => prev.map(t => t.id === selectedLedger ? { ...t, status: 'MATCHED' } : t));
                setStatementTx(prev => prev.map(t => t.id === selectedStatement ? { ...t, status: 'MATCHED' } : t));
                
                logAction('MANUAL_MATCH', `Linked ${selectedLedger} to ${selectedStatement} (Value: $${lTx.amount})`, 'INFO');
                
                setSelectedLedger(null);
                setSelectedStatement(null);
                setSuggestions(prev => prev.filter(s => s.ledgerId !== selectedLedger && s.statementId !== selectedStatement));
            }
        }
    };

    const handleAutoResolve = (suggestion: MatchSuggestion) => {
        setLedgerTx(prev => prev.map(t => t.id === suggestion.ledgerId ? { ...t, status: 'MATCHED' } : t));
        setStatementTx(prev => prev.map(t => t.id === suggestion.statementId ? { ...t, status: 'MATCHED' } : t));
        setSuggestions(prev => prev.filter(s => s !== suggestion));
        logAction('AI_RESOLVE', `Confirmed AI suggestion: ${suggestion.ledgerId} <-> ${suggestion.statementId}`, 'INFO');
    };

    // ================================================================================================
    // RENDER SUB-COMPONENTS
    // ================================================================================================

    const renderTelemetry = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fadeIn">
            <Card variant="default" padding="sm" className="border-cyan-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Engine Load</p>
                        <p className="text-2xl font-bold text-cyan-400">{telemetry.cpuLoad}%</p>
                    </div>
                    <Cpu className="text-cyan-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${telemetry.cpuLoad}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-purple-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Neural Memory</p>
                        <p className="text-2xl font-bold text-purple-400">{telemetry.memoryUsage}%</p>
                    </div>
                    <Activity className="text-purple-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${telemetry.memoryUsage}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-green-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">API Latency</p>
                        <p className="text-2xl font-bold text-green-400">{telemetry.apiLatency}ms</p>
                    </div>
                    <Zap className="text-green-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(telemetry.apiLatency / 100) * 100}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-red-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Fraud Shield</p>
                        <p className="text-2xl font-bold text-red-400">ACTIVE</p>
                    </div>
                    <ShieldCheck className="text-red-500/50" size={24} />
                </div>
                <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-1 flex-1 bg-red-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
                </div>
            </Card>
        </div>
    );

    const renderAuditTrail = () => (
        <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <History size={20} className="text-cyan-400" /> System Black Box (Audit Persistence)
                </h3>
                <button className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                    <Download size={14} /> Export Immutable Log
                </button>
            </div>
            <div className="bg-gray-900/80 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Details</th>
                            <th className="px-4 py-3">Integrity Hash</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {auditLogs.map((log, idx) => (
                            <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
                                        log.severity === 'SECURITY' ? 'bg-purple-500/20 text-purple-400' : 
                                        'bg-cyan-500/20 text-cyan-400'
                                    }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-300">{log.details}</td>
                                <td className="px-4 py-3 font-mono text-[10px] text-gray-600">{log.hash}</td>
                            </tr>
                        ))}
                        {auditLogs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-gray-500 italic">No audit entries recorded in this session.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // ================================================================================================
    // MAIN RENDER
    // ================================================================================================

    return (
        <div className="min-h-screen bg-[#0a0c10] text-gray-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
            
            {/* Header Section: Elite Branding */}
            <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="bg-cyan-600 p-1.5 rounded-lg shadow-lg shadow-cyan-900/20">
                            <Layers className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                            Quantum <span className="text-cyan-500">Financial</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                        <ShieldCheck size={14} className="text-green-500" /> 
                        Enterprise Reconciliation Nexus • <span className="text-cyan-400/80">Sovereign Demo Environment</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">System Status</span>
                        <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> ALL SYSTEMS NOMINAL
                        </span>
                    </div>
                    <button 
                        onClick={() => setShowSecurityModal(true)}
                        className="p-2 bg-gray-800 border border-gray-700 rounded-full hover:border-cyan-500 transition-all group"
                    >
                        <Lock size={18} className="group-hover:text-cyan-400" />
                    </button>
                    <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-cyan-900/20 flex items-center gap-2">
                        <Play size={14} /> Deploy to Production
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Controls & AI Chat */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Navigation / Tabs */}
                    <Card variant="default" padding="none" className="overflow-hidden">
                        <div className="flex flex-col">
                            <button 
                                onClick={() => setActiveTab('reconcile')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'reconcile' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <RefreshCcw size={18} /> Reconciliation Hub
                            </button>
                            <button 
                                onClick={() => setActiveTab('audit')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'audit' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <History size={18} /> Audit Persistence
                            </button>
                            <button 
                                onClick={() => setActiveTab('telemetry')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'telemetry' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <Gauge size={18} /> Engine Telemetry
                            </button>
                        </div>
                    </Card>

                    {/* AI Chat Bar (The "Cheat Sheet" Assistant) */}
                    <Card title="Treasury AI" icon={<MessageSquare className="text-cyan-400" size={18} />} className="h-[500px] flex flex-col">
                        <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-cyan-600 text-white rounded-tr-none' 
                                            : 'bg-gray-800 text-gray-300 border border-gray-700 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] text-gray-600 mt-1 uppercase">{msg.timestamp}</span>
                                </div>
                            ))}
                            {isAiThinking && (
                                <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold animate-pulse">
                                    <Cpu size={12} className="animate-spin" /> QUANTUM CORE THINKING...
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask the AI Architect..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Main Workspace */}
                <div className="lg:col-span-9 space-y-6">
                    
                    {activeTab === 'telemetry' && renderTelemetry()}
                    {activeTab === 'audit' && renderAuditTrail()}

                    {activeTab === 'reconcile' && (
                        <>
                            {/* Action Bar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">AI</div>
                                        <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">SEC</div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-400">
                                        <span className="text-white font-bold">{ledgerTx.filter(t => t.status === 'UNMATCHED').length}</span> items pending reconciliation
                                    </p>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 text-sm font-bold transition-all">
                                        <Filter size={16} /> Advanced Filter
                                    </button>
                                    <button 
                                        onClick={runAIMatching}
                                        disabled={isAutoMatching}
                                        className="flex-1 md:flex-none px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-all shadow-lg shadow-cyan-900/40"
                                    >
                                        {isAutoMatching ? <RefreshCcw size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                        AI Auto-Match
                                    </button>
                                </div>
                            </div>

                            {/* AI Suggestions Panel */}
                            {suggestions.length > 0 && (
                                <div className="p-6 bg-cyan-900/10 border border-cyan-500/30 rounded-2xl animate-fadeIn relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Cpu size={120} />
                                    </div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <Wand2 size={20} /> Neural Match Suggestions ({suggestions.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {suggestions.map((s, idx) => {
                                            const l = ledgerTx.find(t => t.id === s.ledgerId);
                                            const stmt = statementTx.find(t => t.id === s.statementId);
                                            if (!l || !stmt) return null;
                                            return (
                                                <div key={idx} className="p-4 bg-gray-900/80 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all group relative">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-500 font-mono uppercase">Confidence</span>
                                                            <span className="text-green-400 font-black text-lg">{(s.confidence * 100).toFixed(0)}%</span>
                                                        </div>
                                                        <div className="bg-gray-800 p-1.5 rounded text-[10px] font-mono text-gray-400">
                                                            {s.aiModel}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Ledger:</span>
                                                            <span className="text-white font-bold">${l.amount.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Statement:</span>
                                                            <span className="text-white font-bold">${stmt.amount.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-cyan-300/80 italic mb-4 line-clamp-2">"{s.reason}"</p>
                                                    <button 
                                                        onClick={() => handleAutoResolve(s)}
                                                        className="w-full py-2 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white text-xs font-black rounded-lg transition-all border border-cyan-500/30"
                                                    >
                                                        CONFIRM MATCH
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Main Reconciliation Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
                                
                                {/* Internal Ledger Side */}
                                <Card 
                                    title="Internal Ledger (ERP)" 
                                    subtitle="Source: SAP/Oracle Integration"
                                    className="flex flex-col h-full border-t-4 border-cyan-500"
                                    headerActions={[
                                        { id: 'sync', icon: <RefreshCcw />, label: 'Sync ERP', onClick: () => logAction('ERP_SYNC', 'Manual sync triggered', 'INFO') }
                                    ]}
                                >
                                    <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {ledgerTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                                            <div 
                                                key={tx.id}
                                                onClick={() => setSelectedLedger(tx.id === selectedLedger ? null : tx.id)}
                                                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                    selectedLedger === tx.id 
                                                        ? 'bg-cyan-900/20 border-cyan-500 shadow-lg shadow-cyan-900/20' 
                                                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-mono text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{tx.date}</span>
                                                    <span className="font-black text-white text-lg">${tx.amount.toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 font-medium truncate mb-2">{tx.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-600 font-mono">{tx.id}</span>
                                                    <div className="flex gap-1">
                                                        <span className="px-1.5 py-0.5 bg-gray-800 rounded text-[9px] text-gray-400 font-bold uppercase">{tx.metadata.rail}</span>
                                                        {tx.metadata.mfaVerified && <ShieldCheck size={12} className="text-green-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {ledgerTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                                            <div className="text-center py-20 text-gray-500 flex flex-col items-center animate-pulse">
                                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                                </div>
                                                <p className="font-bold text-white">Ledger Reconciled</p>
                                                <p className="text-xs">All internal records matched.</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Bank Statement Side */}
                                <Card 
                                    title="Bank Statement" 
                                    subtitle="Source: Quantum API Real-time Feed"
                                    className="flex flex-col h-full border-t-4 border-purple-500"
                                    headerActions={[
                                        { id: 'api', icon: <Database />, label: 'API Status', onClick: () => logAction('API_CHECK', 'Bank feed health check', 'INFO') }
                                    ]}
                                >
                                     <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {statementTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                                            <div 
                                                key={tx.id}
                                                onClick={() => setSelectedStatement(tx.id === selectedStatement ? null : tx.id)}
                                                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                    selectedStatement === tx.id 
                                                        ? 'bg-purple-900/20 border-purple-500 shadow-lg shadow-purple-900/20' 
                                                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-mono text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{tx.date}</span>
                                                    <span className="font-black text-white text-lg">${tx.amount.toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 font-medium truncate mb-2">{tx.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-600 font-mono">{tx.id}</span>
                                                    <div className="flex items-center gap-2">
                                                        {tx.riskScore > 0.5 && (
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[9px] font-bold animate-pulse">
                                                                <AlertTriangle size={10} /> HIGH RISK
                                                            </div>
                                                        )}
                                                        <span className="px-1.5 py-0.5 bg-gray-800 rounded text-[9px] text-gray-400 font-bold uppercase">{tx.metadata.rail}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                         {statementTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                                            <div className="text-center py-20 text-gray-500 flex flex-col items-center animate-pulse">
                                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                                </div>
                                                <p className="font-bold text-white">Statement Reconciled</p>
                                                <p className="text-xs">All bank transactions verified.</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Manual Match Action Bar (Floating HUD) */}
            <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-cyan-500/50 p-6 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] flex items-center gap-8 transition-all duration-500 z-50 ${selectedLedger && selectedStatement ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90 pointer-events-none'}`}>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ledger Item</span>
                        <span className="text-cyan-400 font-mono font-bold">{selectedLedger}</span>
                    </div>
                    <div className="h-10 w-px bg-gray-700"></div>
                    <div className="bg-cyan-500/20 p-2 rounded-full">
                        <RefreshCcw className="text-cyan-500 animate-spin-slow" size={24} />
                    </div>
                    <div className="h-10 w-px bg-gray-700"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Statement Item</span>
                        <span className="text-purple-400 font-mono font-bold">{selectedStatement}</span>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => { setSelectedLedger(null); setSelectedStatement(null); }} 
                        className="px-6 py-3 rounded-xl hover:bg-gray-800 text-gray-400 text-sm font-bold transition-all"
                    >
                        Abort
                    </button>
                    <button 
                        onClick={handleManualMatch} 
                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black shadow-lg shadow-cyan-900/40 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Fingerprint size={18} /> AUTHORIZE MATCH
                    </button>
                </div>
            </div>

            {/* Security Simulation Modal */}
            {showSecurityModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <Card className="max-w-md w-full border-cyan-500/50 shadow-[0_0_100px_rgba(6,182,212,0.1)]" title="Security Protocol V4" icon={<ShieldCheck className="text-cyan-400" />}>
                        <div className="space-y-6 py-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center">
                                    <Lock className="text-cyan-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Multi-Factor Authentication</p>
                                    <p className="text-xs text-gray-500">Biometric & Hardware Key Active</p>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-10 h-5 bg-cyan-600 rounded-full relative">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-gray-400 uppercase font-black">Encryption Telemetry</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                                        <p className="text-[10px] text-gray-500">AES-256-GCM</p>
                                        <p className="text-xs font-bold text-green-400">VERIFIED</p>
                                    </div>
                                    <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                                        <p className="text-[10px] text-gray-500">TLS 1.3</p>
                                        <p className="text-xs font-bold text-green-400">ACTIVE</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowSecurityModal(false)}
                                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black transition-all"
                            >
                                RETURN TO HUB
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Footer: Legal & Versioning */}
            <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span>© 2024 Quantum Financial Group</span>
                    <span className="text-gray-800">|</span>
                    <span>Build: 4.0.11-STABLE</span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Protocol</a>
                    <a href="#" className="hover:text-cyan-500 transition-colors">Security Whitepaper</a>
                    <a href="#" className="hover:text-cyan-500 transition-colors">API Documentation</a>
                </div>
            </footer>

            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1f2937;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #0891b2;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default ReconciliationHubView;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/ReconciliationHubView.tsx
================================================================================

```typescript
import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card';
import { ArrowRight, Check, X, Search, AlertCircle, Wand2 } from 'lucide-react';

// --- The James Burvel O’Callaghan III Code ---
// --- Company: Citibankdemobusinessinc ---
// --- File: ReconciliationHubView.tsx ---
// --- Version: 1.0.0 ---
// --- Date: October 26, 2023 ---

// --- A1: Data Type Definitions ---
interface A1_Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    source: 'INTERNAL_LEDGER' | 'BANK_STATEMENT';
    status: 'UNMATCHED' | 'MATCHED' | 'PENDING';
    currency: string;
    internalNotes?: string;
    category?: string;
    vendor?: string;
    referenceNumber?: string;
    tags?: string[];
}

interface A2_MatchSuggestion {
    ledgerId: string;
    statementId: string;
    confidence: number;
    reason: string;
    suggestedBy: 'RULE_BASED' | 'AI';
}

interface A3_APIResponse<T> {
    status: 'success' | 'error';
    data?: T;
    error?: string;
}

// --- B1: Utility Functions (The James Burvel O’Callaghan III Code) ---
const B1_generateTransactionId = (): string => `TXN_${Math.random().toString(36).substring(2, 15)}`;
const B2_generateDate = (daysAgo: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo - Math.floor(Math.random() * 30));
    return date.toISOString().split('T')[0];
};
const B3_generateAmount = (base: number = 1000, variance: number = 0.5): number => {
    const sign = Math.random() > 0.5 ? 1 : -1;
    return parseFloat((base * (1 + (Math.random() - 0.5) * variance) * sign).toFixed(2));
};
const B4_generateDescription = (type: string): string => {
    const prefixes = ['Payment', 'Purchase', 'Transfer', 'Deposit', 'Withdrawal', 'Fee', 'Charge', 'Invoice', 'Credit', 'Debit'];
    const vendors = ['Acme Corp', 'Globex Inc', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems', 'Initech', 'Umbrella Corp', 'LexCorp', 'Oscorp', 'Weyland-Yutani'];
    const services = ['Cloud Hosting', 'Software License', 'Consulting Fee', 'Office Supplies', 'Travel Expense', 'Subscription', 'Payroll Processing', 'Marketing Campaign', 'Legal Services', 'Rent'];
    const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
    const randomService = services[Math.floor(Math.random() * services.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    switch (type) {
        case 'INTERNAL_LEDGER':
            return `${prefix} - ${randomVendor} - ${randomService} - ${B1_generateTransactionId().substring(0, 8)}`;
        case 'BANK_STATEMENT':
            return `${prefix.substring(0, 4)} ${randomVendor.substring(0, 4)} ${Math.random().toString(36).substring(0, 3).toUpperCase()} - ${B1_generateTransactionId().substring(0, 4)}`;
        default:
            return 'Miscellaneous Transaction - ' + B1_generateTransactionId().substring(0, 10);
    }
};
const B5_generateCurrency = (): string => ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'][Math.floor(Math.random() * 6)];
const B6_simulateNetworkLatency = (ms: number = 500): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
const B7_formatDate = (dateString: string, format: 'YYYY-MM-DD' | 'MM/DD/YYYY' = 'YYYY-MM-DD'): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if (format === 'MM/DD/YYYY') {
        return `${month}/${day}/${year}`;
    }
    return `${year}-${month}-${day}`;
};
const B8_calculatePercentage = (value: number, total: number): number => total === 0 ? 0 : parseFloat(((value / total) * 100).toFixed(2));
const B9_truncateString = (str: string, length: number): string => str.length > length ? str.substring(0, length) + "..." : str;
const B10_generateRandomString = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
const B11_generateRandomInteger = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const B12_isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
const B13_isValidURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
};
const B14_deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// --- C1: Data Simulation Functions (The James Burvel O’Callaghan III Code) ---
const C1_simulateInternalLedgerData = (count: number): A1_Transaction[] => {
    const data: A1_Transaction[] = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: B1_generateTransactionId(),
            date: B2_generateDate(B11_generateRandomInteger(0, 90)),
            amount: B3_generateAmount(B11_generateRandomInteger(50, 5000), 0.7),
            description: B4_generateDescription('INTERNAL_LEDGER'),
            source: 'INTERNAL_LEDGER',
            status: Math.random() > 0.4 ? 'UNMATCHED' : 'MATCHED',
            currency: B5_generateCurrency(),
            internalNotes: Math.random() > 0.8 ? "High priority" : undefined,
            category: ['Expense', 'Revenue', 'Transfer'][Math.floor(Math.random() * 3)],
            vendor: ['Acme Corp', 'Globex Inc'][Math.floor(Math.random() * 2)],
            referenceNumber: B10_generateRandomString(8),
            tags: Math.random() > 0.7 ? ['urgent', 'review'] : undefined,
        });
    }
    return data;
};
const C2_simulateBankStatementData = (count: number): A1_Transaction[] => {
    const data: A1_Transaction[] = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: B1_generateTransactionId(),
            date: B2_generateDate(B11_generateRandomInteger(0, 90)),
            amount: B3_generateAmount(B11_generateRandomInteger(50, 5000), 0.7),
            description: B4_generateDescription('BANK_STATEMENT'),
            source: 'BANK_STATEMENT',
            status: Math.random() > 0.4 ? 'UNMATCHED' : 'MATCHED',
            currency: B5_generateCurrency(),
            internalNotes: Math.random() > 0.8 ? "Requires Investigation" : undefined,
            category: ['Debit', 'Credit', 'ATM'][Math.floor(Math.random() * 3)],
            vendor: ['Stark Industries', 'Wayne Enterprises'][Math.floor(Math.random() * 2)],
            referenceNumber: B10_generateRandomString(10),
            tags: Math.random() > 0.7 ? ['fraud', 'high_value'] : undefined,
        });
    }
    return data;
};

// --- D1: Mock Data Initialization (The James Burvel O’Callaghan III Code) ---
const D1_MOCK_LEDGER: A1_Transaction[] = C1_simulateInternalLedgerData(15);
const D2_MOCK_STATEMENT: A1_Transaction[] = C2_simulateBankStatementData(18);

// --- E1: API Endpoint Definitions (The James Burvel O’Callaghan III Code) ---
const E1_API_BASE_URL = "/api/v1";

// **Company: Citibankdemobusinessinc**
const E1_API_GET_TRANSACTIONS = (source: 'ledger' | 'statement', status?: 'UNMATCHED' | 'MATCHED' | 'PENDING', currency?: string, dateRangeStart?: string, dateRangeEnd?: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/transactions?source=${source}${status ? `&status=${status}` : ''}${currency ? `&currency=${currency}` : ''}${dateRangeStart ? `&dateRangeStart=${dateRangeStart}` : ''}${dateRangeEnd ? `&dateRangeEnd=${dateRangeEnd}` : ''}`;
const E2_API_POST_MATCH_TRANSACTIONS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/match`;
const E3_API_GET_SUGGESTIONS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/suggestions`;
const E4_API_POST_AUTO_MATCH = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/automatch`;
const E5_API_GET_RECONCILIATION_SUMMARY = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/summary`;
const E6_API_GET_REPORT = (reportType: 'unmatched' | 'matched') => `${E1_API_BASE_URL}/citibankdemobusinessinc/reconciliation/reports/${reportType}`;
const E7_API_GET_CURRENCIES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/currencies`;
const E8_API_GET_CATEGORIES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/categories`;
const E9_API_GET_VENDORS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/vendors`;
const E10_API_GET_TRANSACTION_DETAILS = (transactionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactions/${transactionId}`;
const E11_API_PUT_TRANSACTION_NOTES = (transactionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactions/${transactionId}/notes`;
const E12_API_POST_FEEDBACK = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/feedback`;
const E13_API_GET_USER_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/settings`;
const E14_API_PUT_USER_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/settings`;
const E15_API_GET_AUDIT_LOGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/auditlogs`;
const E16_API_GET_AI_MODEL_STATUS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/ai/modelstatus`;
const E17_API_POST_AI_MODEL_TRAIN = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/ai/modeltrain`;
const E18_API_GET_AI_MODEL_PERFORMANCE = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/ai/modelperformance`;
const E19_API_GET_SYSTEM_HEALTH = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/system/health`;
const E20_API_GET_SYSTEM_METRICS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/system/metrics`;
const E21_API_POST_ALERT = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/alerts`;
const E22_API_GET_ALERTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/alerts`;
const E23_API_DELETE_ALERT = (alertId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/alerts/${alertId}`;
const E24_API_GET_USER_ROLES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/roles`;
const E25_API_GET_USER_PERMISSIONS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/permissions`;
const E26_API_GET_TRANSACTION_HISTORY = (transactionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactions/${transactionId}/history`;
const E27_API_GET_VENDOR_DETAILS = (vendorId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/vendors/${vendorId}`;
const E28_API_PUT_VENDOR_DETAILS = (vendorId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/vendors/${vendorId}`;
const E29_API_GET_CATEGORY_DETAILS = (categoryId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/categories/${categoryId}`;
const E30_API_PUT_CATEGORY_DETAILS = (categoryId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/categories/${categoryId}`;
const E31_API_GET_CURRENCY_EXCHANGE_RATES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/currencies/exchangerates`;
const E32_API_GET_CURRENCY_DETAILS = (currencyCode: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/currencies/${currencyCode}`;
const E33_API_PUT_CURRENCY_DETAILS = (currencyCode: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/currencies/${currencyCode}`;
const E34_API_GET_PAYMENT_METHODS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/paymentmethods`;
const E35_API_GET_PAYMENT_METHOD_DETAILS = (paymentMethodId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/paymentmethods/${paymentMethodId}`;
const E36_API_PUT_PAYMENT_METHOD_DETAILS = (paymentMethodId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/paymentmethods/${paymentMethodId}`;
const E37_API_GET_USER_ACTIVITY = (userId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/${userId}/activity`;
const E38_API_GET_USER_PROFILE = (userId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/${userId}/profile`;
const E39_API_PUT_USER_PROFILE = (userId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/${userId}/profile`;
const E40_API_GET_SUBSCRIPTION_PLANS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/subscriptions/plans`;
const E41_API_GET_SUBSCRIPTION_DETAILS = (subscriptionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/subscriptions/${subscriptionId}`;
const E42_API_PUT_SUBSCRIPTION_DETAILS = (subscriptionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/subscriptions/${subscriptionId}`;
const E43_API_POST_ISSUE_REFUND = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/refunds`;
const E44_API_GET_REFUND_DETAILS = (refundId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/refunds/${refundId}`;
const E45_API_PUT_REFUND_DETAILS = (refundId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/refunds/${refundId}`;
const E46_API_GET_DISPUTES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/disputes`;
const E47_API_GET_DISPUTE_DETAILS = (disputeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/disputes/${disputeId}`;
const E48_API_PUT_DISPUTE_DETAILS = (disputeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/disputes/${disputeId}`;
const E49_API_GET_CHARGEBACKS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/chargebacks`;
const E50_API_GET_CHARGEBACK_DETAILS = (chargebackId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/chargebacks/${chargebackId}`;
const E51_API_PUT_CHARGEBACK_DETAILS = (chargebackId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/chargebacks/${chargebackId}`;
const E52_API_GET_FRAUD_ALERTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/fraudalerts`;
const E53_API_GET_FRAUD_ALERT_DETAILS = (alertId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/fraudalerts/${alertId}`;
const E54_API_PUT_FRAUD_ALERT_DETAILS = (alertId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/fraudalerts/${alertId}`;
const E55_API_GET_PAYOUTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/payouts`;
const E56_API_GET_PAYOUT_DETAILS = (payoutId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/payouts/${payoutId}`;
const E57_API_PUT_PAYOUT_DETAILS = (payoutId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/payouts/${payoutId}`;
const E58_API_GET_INVOICES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/invoices`;
const E59_API_GET_INVOICE_DETAILS = (invoiceId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/invoices/${invoiceId}`;
const E60_API_PUT_INVOICE_DETAILS = (invoiceId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/invoices/${invoiceId}`;
const E61_API_GET_STATEMENTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/statements`;
const E62_API_GET_STATEMENT_DETAILS = (statementId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/statements/${statementId}`;
const E63_API_GET_BANK_ACCOUNTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/bankaccounts`;
const E64_API_GET_BANK_ACCOUNT_DETAILS = (bankAccountId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/bankaccounts/${bankAccountId}`;
const E65_API_PUT_BANK_ACCOUNT_DETAILS = (bankAccountId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/bankaccounts/${bankAccountId}`;
const E66_API_GET_TRANSACTION_FEES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactionfees`;
const E67_API_GET_TRANSACTION_FEE_DETAILS = (feeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactionfees/${feeId}`;
const E68_API_PUT_TRANSACTION_FEE_DETAILS = (feeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/transactionfees/${feeId}`;
const E69_API_GET_DISCOUNT_CODES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/discountcodes`;
const E70_API_GET_DISCOUNT_CODE_DETAILS = (discountCodeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/discountcodes/${discountCodeId}`;
const E71_API_PUT_DISCOUNT_CODE_DETAILS = (discountCodeId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/discountcodes/${discountCodeId}`;
const E72_API_GET_PROMOTIONS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/promotions`;
const E73_API_GET_PROMOTION_DETAILS = (promotionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/promotions/${promotionId}`;
const E74_API_PUT_PROMOTION_DETAILS = (promotionId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/promotions/${promotionId}`;
const E75_API_GET_LOYALTY_PROGRAMS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/loyaltyprograms`;
const E76_API_GET_LOYALTY_PROGRAM_DETAILS = (programId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/loyaltyprograms/${programId}`;
const E77_API_PUT_LOYALTY_PROGRAM_DETAILS = (programId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/loyaltyprograms/${programId}`;
const E78_API_GET_REPORTS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/reports`;
const E79_API_GET_REPORT_DETAILS = (reportId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/reports/${reportId}`;
const E80_API_PUT_REPORT_DETAILS = (reportId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/reports/${reportId}`;
const E81_API_GET_USER_PREFERENCES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/preferences`;
const E82_API_PUT_USER_PREFERENCES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/users/preferences`;
const E83_API_GET_API_KEYS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/apikeys`;
const E84_API_GET_API_KEY_DETAILS = (apiKeyId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/apikeys/${apiKeyId}`;
const E85_API_PUT_API_KEY_DETAILS = (apiKeyId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/apikeys/${apiKeyId}`;
const E86_API_GET_WEBHOOKS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/webhooks`;
const E87_API_GET_WEBHOOK_DETAILS = (webhookId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/webhooks/${webhookId}`;
const E88_API_PUT_WEBHOOK_DETAILS = (webhookId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/webhooks/${webhookId}`;
const E89_API_GET_SYSTEM_CONFIG = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/system/config`;
const E90_API_PUT_SYSTEM_CONFIG = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/system/config`;
const E91_API_GET_DATA_EXPORT_JOBS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/dataexports`;
const E92_API_GET_DATA_EXPORT_JOB_DETAILS = (jobId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/dataexports/${jobId}`;
const E93_API_POST_DATA_EXPORT_JOB = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/dataexports`;
const E94_API_GET_NOTIFICATION_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/notifications/settings`;
const E95_API_PUT_NOTIFICATION_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/notifications/settings`;
const E96_API_GET_NOTIFICATION_TEMPLATES = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/notifications/templates`;
const E97_API_GET_NOTIFICATION_TEMPLATE_DETAILS = (templateId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/notifications/templates/${templateId}`;
const E98_API_PUT_NOTIFICATION_TEMPLATE_DETAILS = (templateId: string) => `${E1_API_BASE_URL}/citibankdemobusinessinc/notifications/templates/${templateId}`;
const E99_API_GET_SECURITY_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/security/settings`;
const E100_API_PUT_SECURITY_SETTINGS = () => `${E1_API_BASE_URL}/citibankdemobusinessinc/security/settings`;

// --- F1: Feature Implementations (The James Burvel O’Callaghan III Code) ---
// **Company: Citibankdemobusinessinc**
const F1_FEATURE_AUTOMATED_MATCHING = "Automated Transaction Matching";
const F2_FEATURE_MANUAL_MATCHING = "Manual Transaction Matching";
const F3_FEATURE_TRANSACTION_SEARCH = "Transaction Search and Filtering";
const F4_FEATURE_AI_SUGGESTIONS = "AI-Powered Match Suggestions";
const F5_FEATURE_RECONCILIATION_SUMMARY_DASHBOARD = "Reconciliation Summary Dashboard";
const F6_FEATURE_UNMATCHED_TRANSACTIONS_REPORT = "Unmatched Transactions Report Generation";
const F7_FEATURE_MATCHED_TRANSACTIONS_REPORT = "Matched Transactions Report Generation";
const F8_FEATURE_CURRENCY_CONVERSION = "Currency Conversion Support";
const F9_FEATURE_CATEGORY_MANAGEMENT = "Transaction Category Management";
const F10_FEATURE_VENDOR_MANAGEMENT = "Vendor Management";
const F11_FEATURE_TRANSACTION_DETAILS_VIEW = "Detailed Transaction View";
const F12_FEATURE_TRANSACTION_NOTES = "Transaction Notes and Annotations";
const F13_FEATURE_USER_FEEDBACK = "User Feedback Submission";
const F14_FEATURE_USER_SETTINGS = "User-Specific Settings";
const F15_FEATURE_AUDIT_LOGS = "Audit Trail and Activity Logging";
const F16_FEATURE_AI_MODEL_STATUS_MONITORING = "AI Model Status Monitoring";
const F17_FEATURE_AI_MODEL_TRAINING = "Initiate and Track AI Model Training";
const F18_FEATURE_AI_MODEL_PERFORMANCE_METRICS = "AI Model Performance Metrics Display";
const F19_FEATURE_SYSTEM_HEALTH_MONITORING = "System Health and Status Monitoring";
const F20_FEATURE_SYSTEM_METRICS_DASHBOARD = "System Metrics Visualization";
const F21_FEATURE_ALERTS_AND_NOTIFICATIONS = "Alerts and Notification System";
const F22_FEATURE_USER_ROLE_MANAGEMENT = "User Role and Access Control";
const F23_FEATURE_USER_PERMISSION_MANAGEMENT = "User Permission Management";
const F24_FEATURE_TRANSACTION_HISTORY_VIEW = "Transaction History Tracking";
const F25_FEATURE_VENDOR_DETAILS_VIEW = "Vendor Details and Management";
const F26_FEATURE_CATEGORY_DETAILS_VIEW = "Category Details and Management";
const F27_FEATURE_EXCHANGE_RATE_DISPLAY = "Real-time Currency Exchange Rate Display";
const F28_FEATURE_CURRENCY_DETAILS_VIEW = "Currency Details and Management";
const F29_FEATURE_PAYMENT_METHOD_MANAGEMENT = "Payment Method Management";
const F30_FEATURE_PAYMENT_METHOD_DETAILS_VIEW = "Payment Method Details View";
const F31_FEATURE_USER_ACTIVITY_LOGS = "User Activity Logging and Reporting";
const F32_FEATURE_USER_PROFILE_MANAGEMENT = "User Profile and Account Management";
const F33_FEATURE_SUBSCRIPTION_PLAN_MANAGEMENT = "Subscription Plan and Tier Management";
const F34_FEATURE_SUBSCRIPTION_DETAILS_VIEW = "Subscription Details and Management";
const F35_FEATURE_REFUND_PROCESSING = "Automated Refund Processing";
const F36_FEATURE_REFUND_DETAILS_VIEW = "Refund Details and Management";
const F37_FEATURE_DISPUTE_MANAGEMENT = "Dispute Resolution and Management";
const F38_FEATURE_DISPUTE_DETAILS_VIEW = "Dispute Details View and Resolution";
const F39_FEATURE_CHARGEBACK_MANAGEMENT = "Chargeback Management";
const F40_FEATURE_CHARGEBACK_DETAILS_VIEW = "Chargeback Details and Processing";
const F41_FEATURE_FRAUD_ALERT_MANAGEMENT = "Fraud Alert Detection and Management";
const F42_FEATURE_FRAUD_ALERT_DETAILS_VIEW = "Fraud Alert Details View";
const F43_FEATURE_PAYOUT_PROCESSING = "Automated Payout Processing";
const F44_FEATURE_PAYOUT_DETAILS_VIEW = "Payout Details and Management";
const F45_FEATURE_INVOICE_GENERATION = "Invoice Generation and Management";
const F46_FEATURE_INVOICE_DETAILS_VIEW = "Invoice Details and Status Tracking";
const F47_FEATURE_STATEMENT_IMPORT = "Automated Bank Statement Import";
const F48_FEATURE_STATEMENT_DETAILS_VIEW = "Statement Details and Transaction Review";
const F49_FEATURE_BANK_ACCOUNT_MANAGEMENT = "Bank Account Management and Linking";
const F50_FEATURE_BANK_ACCOUNT_DETAILS_VIEW = "Bank Account Details and Information";
const F51_FEATURE_TRANSACTION_FEE_MANAGEMENT = "Transaction Fee Management";
const F52_FEATURE_TRANSACTION_FEE_DETAILS_VIEW = "Transaction Fee Details and Review";
const F53_FEATURE_DISCOUNT_CODE_MANAGEMENT = "Discount Code Management";
const F54_FEATURE_DISCOUNT_CODE_DETAILS_VIEW = "Discount Code Details and Reporting";
const F55_FEATURE_PROMOTION_MANAGEMENT = "Promotion and Campaign Management";
const F56_FEATURE_PROMOTION_DETAILS_VIEW = "Promotion Details and Analytics";
const F57_FEATURE_LOYALTY_PROGRAM_MANAGEMENT = "Loyalty Program Management";
const F58_FEATURE_LOYALTY_PROGRAM_DETAILS_VIEW = "Loyalty Program Details";
const F59_FEATURE_REPORT_GENERATION = "Customizable Report Generation";
const F60_FEATURE_REPORT_DETAILS_VIEW = "Report Details and Export Options";
const F61_FEATURE_USER_PREFERENCES_CUSTOMIZATION = "User Preference Customization";
const F62_FEATURE_API_KEY_MANAGEMENT = "API Key Management and Security";
const F63_FEATURE_API_KEY_DETAILS_VIEW = "API Key Details and Usage";
const F64_FEATURE_WEBHOOK_MANAGEMENT = "Webhook Management and Configuration";
const F65_FEATURE_WEBHOOK_DETAILS_VIEW = "Webhook Details and Event Logs";
const F66_FEATURE_SYSTEM_CONFIGURATION_SETTINGS = "System Configuration Settings";
const F67_FEATURE_DATA_EXPORT_JOBS = "Automated Data Export Jobs";
const F68_FEATURE_DATA_EXPORT_JOB_DETAILS_VIEW = "Data Export Job Details and Status";
const F69_FEATURE_EMAIL_NOTIFICATION_SETTINGS = "Email Notification Customization";
const F70_FEATURE_NOTIFICATION_TEMPLATE_CUSTOMIZATION = "Notification Template Customization";
const F71_FEATURE_SECURITY_SETTINGS_CONFIGURATION = "Security Setting Configuration";
const F72_FEATURE_TWO_FACTOR_AUTHENTICATION = "Two-Factor Authentication (2FA)";
const F73_FEATURE_PASSWORD_RESET_FUNCTIONALITY = "Password Reset and Recovery";
const F74_FEATURE_BRUTE_FORCE_PROTECTION = "Brute-Force Attack Protection";
const F75_FEATURE_SESSION_TIMEOUT_CONFIGURATION = "Session Timeout Configuration";
const F76_FEATURE_IP_ADDRESS_WHITELISTING = "IP Address Whitelisting";
const F77_FEATURE_SSL_CERTIFICATE_MANAGEMENT = "SSL Certificate Management";
const F78_FEATURE_DATA_ENCRYPTION_AT_REST = "

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/ReconciliationHubView (1).tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card';
import { ArrowRight, Check, X, Search, AlertCircle, Wand2 } from 'lucide-react';

// --- Mock Data Types ---
interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    source: 'INTERNAL_LEDGER' | 'BANK_STATEMENT';
    status: 'UNMATCHED' | 'MATCHED' | 'PENDING';
    currency: string;
}

interface MatchSuggestion {
    ledgerId: string;
    statementId: string;
    confidence: number;
    reason: string;
}

const MOCK_LEDGER: Transaction[] = [
    { id: 'L001', date: '2024-03-10', amount: 5000.00, description: 'Vendor Payment - Acme Corp', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L002', date: '2024-03-11', amount: 1250.50, description: 'Office Supplies', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L003', date: '2024-03-12', amount: 100000.00, description: 'Capital Injection', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
    { id: 'L004', date: '2024-03-12', amount: 45.00, description: 'Coffee', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD' },
];

const MOCK_STATEMENT: Transaction[] = [
    { id: 'S001', date: '2024-03-11', amount: 5000.00, description: 'ACH WDL ACME CORP', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S002', date: '2024-03-11', amount: 1250.50, description: 'STAPLES #9942', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S003', date: '2024-03-13', amount: 99985.00, description: 'WIRE IN CITI - FEE DEDUCTED', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
    { id: 'S004', date: '2024-03-15', amount: 500.00, description: 'UNKNOWN CHARGE', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD' },
];

const ReconciliationHubView: React.FC = () => {
    const [ledgerTx, setLedgerTx] = useState<Transaction[]>(MOCK_LEDGER);
    const [statementTx, setStatementTx] = useState<Transaction[]>(MOCK_STATEMENT);
    const [selectedLedger, setSelectedLedger] = useState<string | null>(null);
    const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [isAutoMatching, setIsAutoMatching] = useState(false);

    // --- AI Matching Logic ---
    const runAIMatching = () => {
        setIsAutoMatching(true);
        setTimeout(() => {
            const newSuggestions: MatchSuggestion[] = [];
            
            ledgerTx.filter(l => l.status === 'UNMATCHED').forEach(l => {
                statementTx.filter(s => s.status === 'UNMATCHED').forEach(s => {
                    let confidence = 0;
                    let reason = '';

                    // Exact Amount Match
                    if (l.amount === s.amount) {
                        confidence += 0.8;
                        reason = 'Exact amount match';
                    } 
                    // Fuzzy Amount Match (e.g., fees deducted)
                    else if (Math.abs(l.amount - s.amount) / l.amount < 0.01) {
                        confidence += 0.6;
                        reason = 'Close amount (possible fee deduction)';
                    }

                    // Date proximity
                    const dateDiff = Math.abs(new Date(l.date).getTime() - new Date(s.date).getTime());
                    if (dateDiff < 86400000 * 2) { // 2 days
                        confidence += 0.1;
                    }

                    if (confidence > 0.5) {
                        newSuggestions.push({
                            ledgerId: l.id,
                            statementId: s.id,
                            confidence: Math.min(confidence, 0.99),
                            reason
                        });
                    }
                });
            });

            setSuggestions(newSuggestions);
            setIsAutoMatching(false);
        }, 1500);
    };

    const handleMatch = () => {
        if (selectedLedger && selectedStatement) {
            setLedgerTx(prev => prev.map(t => t.id === selectedLedger ? { ...t, status: 'MATCHED' } : t));
            setStatementTx(prev => prev.map(t => t.id === selectedStatement ? { ...t, status: 'MATCHED' } : t));
            setSelectedLedger(null);
            setSelectedStatement(null);
            // Remove used suggestions
            setSuggestions(prev => prev.filter(s => s.ledgerId !== selectedLedger && s.statementId !== selectedStatement));
        }
    };

    const handleAutoResolve = (suggestion: MatchSuggestion) => {
        setLedgerTx(prev => prev.map(t => t.id === suggestion.ledgerId ? { ...t, status: 'MATCHED' } : t));
        setStatementTx(prev => prev.map(t => t.id === suggestion.statementId ? { ...t, status: 'MATCHED' } : t));
        setSuggestions(prev => prev.filter(s => s !== suggestion));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white tracking-wider">Reconciliation Hub</h2>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 flex items-center gap-2">
                        <Search size={16} /> Filter
                    </button>
                    <button 
                        onClick={runAIMatching}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 flex items-center gap-2 disabled:opacity-50 transition-all"
                        disabled={isAutoMatching}
                    >
                        {isAutoMatching ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Wand2 size={16} />}
                        AI Auto-Match
                    </button>
                </div>
            </div>

            {/* AI Suggestions Panel */}
            {suggestions.length > 0 && (
                <div className="mb-6 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl animate-fadeIn">
                    <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                        <Wand2 size={18} /> Suggested Matches ({suggestions.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestions.map((s, idx) => {
                            const l = ledgerTx.find(t => t.id === s.ledgerId);
                            const stmt = statementTx.find(t => t.id === s.statementId);
                            if (!l || !stmt) return null;
                            return (
                                <div key={idx} className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors group">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <span>{l.id} ↔ {stmt.id}</span>
                                        <span className="text-green-400 font-mono">{(s.confidence * 100).toFixed(0)}% Match</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-bold">${l.amount.toLocaleString()}</span>
                                        <span className="text-gray-500 text-xs">vs</span>
                                        <span className="text-white font-bold">${stmt.amount.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-indigo-300 mb-3">{s.reason}</p>
                                    <button 
                                        onClick={() => handleAutoResolve(s)}
                                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded transition-colors"
                                    >
                                        Confirm Match
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                {/* Internal Ledger Side */}
                <Card title="Internal Ledger (ERP)" className="flex flex-col h-full border-l-4 border-blue-500">
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {ledgerTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                            <div 
                                key={tx.id}
                                onClick={() => setSelectedLedger(tx.id === selectedLedger ? null : tx.id)}
                                className={`p-3 rounded cursor-pointer transition-all border ${
                                    selectedLedger === tx.id ? 'bg-blue-900/40 border-blue-500' : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <span className="font-mono text-xs text-gray-500">{tx.date}</span>
                                    <span className="font-mono font-bold text-white">${tx.amount.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1 truncate">{tx.description}</p>
                                <div className="text-xs text-gray-500 mt-1">{tx.id}</div>
                            </div>
                        ))}
                        {ledgerTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                <Check className="w-12 h-12 text-green-500 mb-2" />
                                All ledger items reconciled.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Bank Statement Side */}
                <Card title="Bank Statement (Citibank API)" className="flex flex-col h-full border-r-4 border-green-500">
                     <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {statementTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                            <div 
                                key={tx.id}
                                onClick={() => setSelectedStatement(tx.id === selectedStatement ? null : tx.id)}
                                className={`p-3 rounded cursor-pointer transition-all border ${
                                    selectedStatement === tx.id ? 'bg-green-900/40 border-green-500' : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <span className="font-mono text-xs text-gray-500">{tx.date}</span>
                                    <span className="font-mono font-bold text-white">${tx.amount.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1 truncate">{tx.description}</p>
                                <div className="text-xs text-gray-500 mt-1">{tx.id}</div>
                            </div>
                        ))}
                         {statementTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                <Check className="w-12 h-12 text-green-500 mb-2" />
                                All statement items reconciled.
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Manual Match Action Bar */}
            <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 p-4 rounded-xl shadow-2xl flex items-center gap-6 transition-all duration-300 ${selectedLedger && selectedStatement ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="text-sm">
                    <span className="text-gray-400">Linking</span> <span className="text-blue-400 font-mono">{selectedLedger}</span> <span className="text-gray-400">to</span> <span className="text-green-400 font-mono">{selectedStatement}</span>
                </div>
                <div className="h-8 w-px bg-gray-600"></div>
                <div className="flex gap-2">
                    <button onClick={() => { setSelectedLedger(null); setSelectedStatement(null); }} className="px-4 py-2 rounded hover:bg-gray-700 text-gray-300 text-sm font-medium">Cancel</button>
                    <button onClick={handleMatch} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold shadow-lg flex items-center gap-2">
                        <Check size={16} /> Match
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReconciliationHubView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/ReconciliationHubView.tsx
================================================================================

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, Check, X, Search, AlertCircle, Wand2, 
  ShieldCheck, Activity, Database, Zap, MessageSquare, 
  Terminal, BarChart3, Lock, Cpu, Gauge, Layers, 
  History, Settings, Download, Filter, RefreshCcw,
  ChevronRight, Play, Info, AlertTriangle, Eye,
  FileText, Share2, Trash2, CheckCircle2, Fingerprint
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';

/**
 * QUANTUM FINANCIAL - RECONCILIATION NEXUS V4.0
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience: High-polish, elite performance.
 * - "Test Drive": Interactive, low-pressure, high-feedback.
 * - "Bells and Whistles": AI-driven insights, real-time telemetry, audit persistence.
 * 
 * SECURITY: Multi-factor simulation and fraud monitoring integrated.
 * AUDIT: Every sensitive action is logged to the internal state "Black Box".
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    source: 'INTERNAL_LEDGER' | 'BANK_STATEMENT';
    status: 'UNMATCHED' | 'MATCHED' | 'PENDING' | 'FLAGGED';
    currency: string;
    category: string;
    riskScore: number;
    metadata: {
        traceId: string;
        originatingIp?: string;
        mfaVerified: boolean;
        rail: 'ACH' | 'WIRE' | 'SWIFT';
    };
}

interface MatchSuggestion {
    ledgerId: string;
    statementId: string;
    confidence: number;
    reason: string;
    aiModel: string;
}

interface AuditEntry {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
    severity: 'INFO' | 'SECURITY' | 'CRITICAL';
    hash: string; // Simulated blockchain hash for integrity
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

interface TelemetryData {
    cpuLoad: number;
    memoryUsage: number;
    apiLatency: number;
    fraudDetectionActive: boolean;
}

// ================================================================================================
// MOCK DATA GENERATION (THE "ENGINE" FUEL)
// ================================================================================================

const GENERATE_MOCK_LEDGER = (): Transaction[] => [
    { id: 'TX-L-9901', date: '2024-05-10', amount: 125000.00, description: 'Global Logistics - Q2 Settlement', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Operations', riskScore: 0.02, metadata: { traceId: 'TRC-001', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-L-9902', date: '2024-05-11', amount: 4250.50, description: 'Cloud Infrastructure - AWS Monthly', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Technology', riskScore: 0.05, metadata: { traceId: 'TRC-002', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-L-9903', date: '2024-05-12', amount: 890000.00, description: 'Strategic Acquisition - Alpha Corp', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Investment', riskScore: 0.12, metadata: { traceId: 'TRC-003', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-L-9904', date: '2024-05-12', amount: 150.00, description: 'Executive Catering - Board Meeting', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'G&A', riskScore: 0.01, metadata: { traceId: 'TRC-004', mfaVerified: false, rail: 'ACH' } },
    { id: 'TX-L-9905', date: '2024-05-13', amount: 55000.00, description: 'Payroll Funding - EMEA Region', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Payroll', riskScore: 0.03, metadata: { traceId: 'TRC-005', mfaVerified: true, rail: 'SWIFT' } },
    { id: 'TX-L-9906', date: '2024-05-14', amount: 1200.00, description: 'Office Supplies - Staples', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'G&A', riskScore: 0.01, metadata: { traceId: 'TRC-006', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-L-9907', date: '2024-05-15', amount: 33400.00, description: 'Marketing Campaign - Summer Launch', source: 'INTERNAL_LEDGER', status: 'UNMATCHED', currency: 'USD', category: 'Marketing', riskScore: 0.08, metadata: { traceId: 'TRC-007', mfaVerified: true, rail: 'WIRE' } },
];

const GENERATE_MOCK_STATEMENT = (): Transaction[] => [
    { id: 'TX-S-8801', date: '2024-05-11', amount: 125000.00, description: 'INCOMING WIRE: GLOBAL LOGISTICS', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.02, metadata: { traceId: 'TRC-S01', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-S-8802', date: '2024-05-11', amount: 4250.50, description: 'ACH DEBIT: AMZN MKTP', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.04, metadata: { traceId: 'TRC-S02', mfaVerified: true, rail: 'ACH' } },
    { id: 'TX-S-8803', date: '2024-05-13', amount: 889985.00, description: 'WIRE OUT: ALPHA CORP - FEE ADJ', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.15, metadata: { traceId: 'TRC-S03', mfaVerified: true, rail: 'WIRE' } },
    { id: 'TX-S-8804', date: '2024-05-15', amount: 500.00, description: 'UNKNOWN POS DEBIT - NYC', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.85, metadata: { traceId: 'TRC-S04', mfaVerified: false, rail: 'ACH' } },
    { id: 'TX-S-8805', date: '2024-05-14', amount: 55000.00, description: 'SWIFT: EMEA PAYROLL FUND', source: 'BANK_STATEMENT', status: 'UNMATCHED', currency: 'USD', category: 'Uncategorized', riskScore: 0.03, metadata: { traceId: 'TRC-S05', mfaVerified: true, rail: 'SWIFT' } },
];

// ================================================================================================
// MAIN COMPONENT: RECONCILIATION HUB
// ================================================================================================

const ReconciliationHubView: React.FC = () => {
    // --- State Management ---
    const [ledgerTx, setLedgerTx] = useState<Transaction[]>(GENERATE_MOCK_LEDGER());
    const [statementTx, setStatementTx] = useState<Transaction[]>(GENERATE_MOCK_STATEMENT());
    const [selectedLedger, setSelectedLedger] = useState<string | null>(null);
    const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [isAutoMatching, setIsAutoMatching] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Welcome to the Quantum Financial Demo. I am your AI Treasury Assistant. How can I help you kick the tires on our reconciliation engine today?", timestamp: new Date().toLocaleTimeString() }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [activeTab, setActiveTab] = useState<'reconcile' | 'audit' | 'telemetry'>('reconcile');
    const [telemetry, setTelemetry] = useState<TelemetryData>({ cpuLoad: 12, memoryUsage: 45, apiLatency: 24, fraudDetectionActive: true });
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // --- AI Initialization ---
    // Using the provided pattern for Gemini
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

    // --- Helper: Audit Logger ---
    const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'INFO') => {
        const newEntry: AuditEntry = {
            timestamp: new Date().toISOString(),
            action,
            details,
            severity,
            hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        };
        setAuditLogs(prev => [newEntry, ...prev]);
        console.log(`[AUDIT] ${action}: ${details}`);
    }, []);

    // --- Effect: Telemetry Simulation ---
    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => ({
                cpuLoad: Math.floor(Math.random() * 20) + 5,
                memoryUsage: 40 + Math.floor(Math.random() * 10),
                apiLatency: 15 + Math.floor(Math.random() * 30),
                fraudDetectionActive: true
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // --- Effect: Scroll Chat ---
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // --- AI Logic: Chat & Interaction ---
    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const userMsg: ChatMessage = { role: 'user', content: userInput, timestamp: new Date().toLocaleTimeString() };
        setChatHistory(prev => [...prev, userMsg]);
        setUserInput('');
        setIsAiThinking(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            // Contextual prompt for the AI
            const prompt = `
                You are the Quantum Financial AI Assistant. 
                The user is currently in the "Reconciliation Hub" of a high-performance business banking demo.
                Philosophy: "Golden Ticket" experience, "Test Drive" the car, "Bells and Whistles".
                Current State: 
                - Unmatched Ledger Items: ${ledgerTx.filter(t => t.status === 'UNMATCHED').length}
                - Unmatched Statement Items: ${statementTx.filter(t => t.status === 'UNMATCHED').length}
                - Security Status: Multi-factor Auth Active, Fraud Monitoring Active.
                
                User said: "${userInput}"
                
                Respond as an elite financial architect. Be professional, secure, and helpful. 
                If they ask to "reconcile everything", tell them to click the "AI Auto-Match" button to see the engine roar.
                Do NOT mention Citibank. Use "The Demo Bank" or "Quantum Financial".
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: text, 
                timestamp: new Date().toLocaleTimeString() 
            }]);
            logAction('AI_INTERACTION', `User asked: ${userInput.substring(0, 30)}...`, 'INFO');
        } catch (error) {
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: "I apologize, but my neural link is experiencing high latency. Please try again or use the manual controls.", 
                timestamp: new Date().toLocaleTimeString() 
            }]);
            logAction('AI_ERROR', 'Failed to generate AI response', 'CRITICAL');
        } finally {
            setIsAiThinking(false);
        }
    };

    // --- Logic: AI Auto-Matching (The "Engine Roar") ---
    const runAIMatching = () => {
        setIsAutoMatching(true);
        logAction('AI_AUTO_MATCH_START', 'Initiating heuristic matching engine', 'INFO');
        
        setTimeout(() => {
            const newSuggestions: MatchSuggestion[] = [];
            
            ledgerTx.filter(l => l.status === 'UNMATCHED').forEach(l => {
                statementTx.filter(s => s.status === 'UNMATCHED').forEach(s => {
                    let confidence = 0;
                    let reason = '';

                    // Exact Amount Match
                    if (l.amount === s.amount) {
                        confidence += 0.85;
                        reason = 'Exact currency value parity detected.';
                    } 
                    // Fuzzy Amount Match (e.g., fees deducted)
                    else if (Math.abs(l.amount - s.amount) / l.amount < 0.02) {
                        confidence += 0.65;
                        reason = 'High-probability match with variance (likely wire fees).';
                    }

                    // Description Keyword Match
                    const lDesc = l.description.toLowerCase();
                    const sDesc = s.description.toLowerCase();
                    if (lDesc.split(' ').some(word => word.length > 3 && sDesc.includes(word))) {
                        confidence += 0.1;
                    }

                    if (confidence > 0.6) {
                        newSuggestions.push({
                            ledgerId: l.id,
                            statementId: s.id,
                            confidence: Math.min(confidence, 0.99),
                            reason,
                            aiModel: 'Quantum-Heuristic-v4'
                        });
                    }
                });
            });

            setSuggestions(newSuggestions);
            setIsAutoMatching(false);
            logAction('AI_AUTO_MATCH_COMPLETE', `Found ${newSuggestions.length} potential matches`, 'INFO');
        }, 2000);
    };

    // --- Logic: Manual Matching ---
    const handleManualMatch = () => {
        if (selectedLedger && selectedStatement) {
            const lTx = ledgerTx.find(t => t.id === selectedLedger);
            const sTx = statementTx.find(t => t.id === selectedStatement);

            if (lTx && sTx) {
                setLedgerTx(prev => prev.map(t => t.id === selectedLedger ? { ...t, status: 'MATCHED' } : t));
                setStatementTx(prev => prev.map(t => t.id === selectedStatement ? { ...t, status: 'MATCHED' } : t));
                
                logAction('MANUAL_MATCH', `Linked ${selectedLedger} to ${selectedStatement} (Value: $${lTx.amount})`, 'INFO');
                
                setSelectedLedger(null);
                setSelectedStatement(null);
                setSuggestions(prev => prev.filter(s => s.ledgerId !== selectedLedger && s.statementId !== selectedStatement));
            }
        }
    };

    const handleAutoResolve = (suggestion: MatchSuggestion) => {
        setLedgerTx(prev => prev.map(t => t.id === suggestion.ledgerId ? { ...t, status: 'MATCHED' } : t));
        setStatementTx(prev => prev.map(t => t.id === suggestion.statementId ? { ...t, status: 'MATCHED' } : t));
        setSuggestions(prev => prev.filter(s => s !== suggestion));
        logAction('AI_RESOLVE', `Confirmed AI suggestion: ${suggestion.ledgerId} <-> ${suggestion.statementId}`, 'INFO');
    };

    // ================================================================================================
    // RENDER SUB-COMPONENTS
    // ================================================================================================

    const renderTelemetry = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fadeIn">
            <Card variant="default" padding="sm" className="border-cyan-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Engine Load</p>
                        <p className="text-2xl font-bold text-cyan-400">{telemetry.cpuLoad}%</p>
                    </div>
                    <Cpu className="text-cyan-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${telemetry.cpuLoad}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-purple-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Neural Memory</p>
                        <p className="text-2xl font-bold text-purple-400">{telemetry.memoryUsage}%</p>
                    </div>
                    <Activity className="text-purple-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${telemetry.memoryUsage}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-green-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">API Latency</p>
                        <p className="text-2xl font-bold text-green-400">{telemetry.apiLatency}ms</p>
                    </div>
                    <Zap className="text-green-500/50" size={24} />
                </div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(telemetry.apiLatency / 100) * 100}%` }}></div>
                </div>
            </Card>
            <Card variant="default" padding="sm" className="border-red-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter">Fraud Shield</p>
                        <p className="text-2xl font-bold text-red-400">ACTIVE</p>
                    </div>
                    <ShieldCheck className="text-red-500/50" size={24} />
                </div>
                <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-1 flex-1 bg-red-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
                </div>
            </Card>
        </div>
    );

    const renderAuditTrail = () => (
        <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <History size={20} className="text-cyan-400" /> System Black Box (Audit Persistence)
                </h3>
                <button className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                    <Download size={14} /> Export Immutable Log
                </button>
            </div>
            <div className="bg-gray-900/80 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Details</th>
                            <th className="px-4 py-3">Integrity Hash</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {auditLogs.map((log, idx) => (
                            <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
                                        log.severity === 'SECURITY' ? 'bg-purple-500/20 text-purple-400' : 
                                        'bg-cyan-500/20 text-cyan-400'
                                    }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-300">{log.details}</td>
                                <td className="px-4 py-3 font-mono text-[10px] text-gray-600">{log.hash}</td>
                            </tr>
                        ))}
                        {auditLogs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-gray-500 italic">No audit entries recorded in this session.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // ================================================================================================
    // MAIN RENDER
    // ================================================================================================

    return (
        <div className="min-h-screen bg-[#0a0c10] text-gray-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
            
            {/* Header Section: Elite Branding */}
            <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="bg-cyan-600 p-1.5 rounded-lg shadow-lg shadow-cyan-900/20">
                            <Layers className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                            Quantum <span className="text-cyan-500">Financial</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                        <ShieldCheck size={14} className="text-green-500" /> 
                        Enterprise Reconciliation Nexus • <span className="text-cyan-400/80">Sovereign Demo Environment</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">System Status</span>
                        <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> ALL SYSTEMS NOMINAL
                        </span>
                    </div>
                    <button 
                        onClick={() => setShowSecurityModal(true)}
                        className="p-2 bg-gray-800 border border-gray-700 rounded-full hover:border-cyan-500 transition-all group"
                    >
                        <Lock size={18} className="group-hover:text-cyan-400" />
                    </button>
                    <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-cyan-900/20 flex items-center gap-2">
                        <Play size={14} /> Deploy to Production
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Controls & AI Chat */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Navigation / Tabs */}
                    <Card variant="default" padding="none" className="overflow-hidden">
                        <div className="flex flex-col">
                            <button 
                                onClick={() => setActiveTab('reconcile')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'reconcile' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <RefreshCcw size={18} /> Reconciliation Hub
                            </button>
                            <button 
                                onClick={() => setActiveTab('audit')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'audit' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <History size={18} /> Audit Persistence
                            </button>
                            <button 
                                onClick={() => setActiveTab('telemetry')}
                                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold transition-all ${activeTab === 'telemetry' ? 'bg-cyan-600/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <Gauge size={18} /> Engine Telemetry
                            </button>
                        </div>
                    </Card>

                    {/* AI Chat Bar (The "Cheat Sheet" Assistant) */}
                    <Card title="Treasury AI" icon={<MessageSquare className="text-cyan-400" size={18} />} className="h-[500px] flex flex-col">
                        <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-cyan-600 text-white rounded-tr-none' 
                                            : 'bg-gray-800 text-gray-300 border border-gray-700 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] text-gray-600 mt-1 uppercase">{msg.timestamp}</span>
                                </div>
                            ))}
                            {isAiThinking && (
                                <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold animate-pulse">
                                    <Cpu size={12} className="animate-spin" /> QUANTUM CORE THINKING...
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask the AI Architect..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Main Workspace */}
                <div className="lg:col-span-9 space-y-6">
                    
                    {activeTab === 'telemetry' && renderTelemetry()}
                    {activeTab === 'audit' && renderAuditTrail()}

                    {activeTab === 'reconcile' && (
                        <>
                            {/* Action Bar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">AI</div>
                                        <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">SEC</div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-400">
                                        <span className="text-white font-bold">{ledgerTx.filter(t => t.status === 'UNMATCHED').length}</span> items pending reconciliation
                                    </p>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 text-sm font-bold transition-all">
                                        <Filter size={16} /> Advanced Filter
                                    </button>
                                    <button 
                                        onClick={runAIMatching}
                                        disabled={isAutoMatching}
                                        className="flex-1 md:flex-none px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-all shadow-lg shadow-cyan-900/40"
                                    >
                                        {isAutoMatching ? <RefreshCcw size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                        AI Auto-Match
                                    </button>
                                </div>
                            </div>

                            {/* AI Suggestions Panel */}
                            {suggestions.length > 0 && (
                                <div className="p-6 bg-cyan-900/10 border border-cyan-500/30 rounded-2xl animate-fadeIn relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Cpu size={120} />
                                    </div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <Wand2 size={20} /> Neural Match Suggestions ({suggestions.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {suggestions.map((s, idx) => {
                                            const l = ledgerTx.find(t => t.id === s.ledgerId);
                                            const stmt = statementTx.find(t => t.id === s.statementId);
                                            if (!l || !stmt) return null;
                                            return (
                                                <div key={idx} className="p-4 bg-gray-900/80 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all group relative">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-500 font-mono uppercase">Confidence</span>
                                                            <span className="text-green-400 font-black text-lg">{(s.confidence * 100).toFixed(0)}%</span>
                                                        </div>
                                                        <div className="bg-gray-800 p-1.5 rounded text-[10px] font-mono text-gray-400">
                                                            {s.aiModel}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Ledger:</span>
                                                            <span className="text-white font-bold">${l.amount.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Statement:</span>
                                                            <span className="text-white font-bold">${stmt.amount.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-cyan-300/80 italic mb-4 line-clamp-2">"{s.reason}"</p>
                                                    <button 
                                                        onClick={() => handleAutoResolve(s)}
                                                        className="w-full py-2 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white text-xs font-black rounded-lg transition-all border border-cyan-500/30"
                                                    >
                                                        CONFIRM MATCH
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Main Reconciliation Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
                                
                                {/* Internal Ledger Side */}
                                <Card 
                                    title="Internal Ledger (ERP)" 
                                    subtitle="Source: SAP/Oracle Integration"
                                    className="flex flex-col h-full border-t-4 border-cyan-500"
                                    headerActions={[
                                        { id: 'sync', icon: <RefreshCcw />, label: 'Sync ERP', onClick: () => logAction('ERP_SYNC', 'Manual sync triggered', 'INFO') }
                                    ]}
                                >
                                    <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {ledgerTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                                            <div 
                                                key={tx.id}
                                                onClick={() => setSelectedLedger(tx.id === selectedLedger ? null : tx.id)}
                                                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                    selectedLedger === tx.id 
                                                        ? 'bg-cyan-900/20 border-cyan-500 shadow-lg shadow-cyan-900/20' 
                                                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-mono text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{tx.date}</span>
                                                    <span className="font-black text-white text-lg">${tx.amount.toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 font-medium truncate mb-2">{tx.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-600 font-mono">{tx.id}</span>
                                                    <div className="flex gap-1">
                                                        <span className="px-1.5 py-0.5 bg-gray-800 rounded text-[9px] text-gray-400 font-bold uppercase">{tx.metadata.rail}</span>
                                                        {tx.metadata.mfaVerified && <ShieldCheck size={12} className="text-green-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {ledgerTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                                            <div className="text-center py-20 text-gray-500 flex flex-col items-center animate-pulse">
                                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                                </div>
                                                <p className="font-bold text-white">Ledger Reconciled</p>
                                                <p className="text-xs">All internal records matched.</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Bank Statement Side */}
                                <Card 
                                    title="Bank Statement" 
                                    subtitle="Source: Quantum API Real-time Feed"
                                    className="flex flex-col h-full border-t-4 border-purple-500"
                                    headerActions={[
                                        { id: 'api', icon: <Database />, label: 'API Status', onClick: () => logAction('API_CHECK', 'Bank feed health check', 'INFO') }
                                    ]}
                                >
                                     <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {statementTx.filter(t => t.status === 'UNMATCHED').map(tx => (
                                            <div 
                                                key={tx.id}
                                                onClick={() => setSelectedStatement(tx.id === selectedStatement ? null : tx.id)}
                                                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                    selectedStatement === tx.id 
                                                        ? 'bg-purple-900/20 border-purple-500 shadow-lg shadow-purple-900/20' 
                                                        : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-mono text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{tx.date}</span>
                                                    <span className="font-black text-white text-lg">${tx.amount.toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 font-medium truncate mb-2">{tx.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-600 font-mono">{tx.id}</span>
                                                    <div className="flex items-center gap-2">
                                                        {tx.riskScore > 0.5 && (
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[9px] font-bold animate-pulse">
                                                                <AlertTriangle size={10} /> HIGH RISK
                                                            </div>
                                                        )}
                                                        <span className="px-1.5 py-0.5 bg-gray-800 rounded text-[9px] text-gray-400 font-bold uppercase">{tx.metadata.rail}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                         {statementTx.filter(t => t.status === 'UNMATCHED').length === 0 && (
                                            <div className="text-center py-20 text-gray-500 flex flex-col items-center animate-pulse">
                                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                                </div>
                                                <p className="font-bold text-white">Statement Reconciled</p>
                                                <p className="text-xs">All bank transactions verified.</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Manual Match Action Bar (Floating HUD) */}
            <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-cyan-500/50 p-6 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] flex items-center gap-8 transition-all duration-500 z-50 ${selectedLedger && selectedStatement ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90 pointer-events-none'}`}>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ledger Item</span>
                        <span className="text-cyan-400 font-mono font-bold">{selectedLedger}</span>
                    </div>
                    <div className="h-10 w-px bg-gray-700"></div>
                    <div className="bg-cyan-500/20 p-2 rounded-full">
                        <RefreshCcw className="text-cyan-500 animate-spin-slow" size={24} />
                    </div>
                    <div className="h-10 w-px bg-gray-700"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Statement Item</span>
                        <span className="text-purple-400 font-mono font-bold">{selectedStatement}</span>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => { setSelectedLedger(null); setSelectedStatement(null); }} 
                        className="px-6 py-3 rounded-xl hover:bg-gray-800 text-gray-400 text-sm font-bold transition-all"
                    >
                        Abort
                    </button>
                    <button 
                        onClick={handleManualMatch} 
                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black shadow-lg shadow-cyan-900/40 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Fingerprint size={18} /> AUTHORIZE MATCH
                    </button>
                </div>
            </div>

            {/* Security Simulation Modal */}
            {showSecurityModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <Card className="max-w-md w-full border-cyan-500/50 shadow-[0_0_100px_rgba(6,182,212,0.1)]" title="Security Protocol V4" icon={<ShieldCheck className="text-cyan-400" />}>
                        <div className="space-y-6 py-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center">
                                    <Lock className="text-cyan-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Multi-Factor Authentication</p>
                                    <p className="text-xs text-gray-500">Biometric & Hardware Key Active</p>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-10 h-5 bg-cyan-600 rounded-full relative">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-gray-400 uppercase font-black">Encryption Telemetry</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                                        <p className="text-[10px] text-gray-500">AES-256-GCM</p>
                                        <p className="text-xs font-bold text-green-400">VERIFIED</p>
                                    </div>
                                    <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                                        <p className="text-[10px] text-gray-500">TLS 1.3</p>
                                        <p className="text-xs font-bold text-green-400">ACTIVE</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowSecurityModal(false)}
                                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black transition-all"
                            >
                                RETURN TO HUB
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Footer: Legal & Versioning */}
            <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span>© 2024 Quantum Financial Group</span>
                    <span className="text-gray-800">|</span>
                    <span>Build: 4.0.11-STABLE</span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Protocol</a>
                    <a href="#" className="hover:text-cyan-500 transition-colors">Security Whitepaper</a>
                    <a href="#" className="hover:text-cyan-500 transition-colors">API Documentation</a>
                </div>
            </footer>

            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1f2937;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #0891b2;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default ReconciliationHubView;