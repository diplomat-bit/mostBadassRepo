// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/FractionalReserveView.tsx
================================================================================

// components/views/platform/FractionalReserveView.tsx
import React, { useState, useMemo, useReducer, useEffect, useCallback } from 'react';
import Card from '../../Card';

// --- Enhanced Types and Interfaces for a Real-World Application ---

/**
 * @enum ETransactionType
 * @description Defines the types of transactions that can occur within the simulation.
 */
export enum ETransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    LOAN_ISSUANCE = 'LOAN_ISSUANCE',
    LOAN_REPAYMENT = 'LOAN_REPAYMENT',
    INTEREST_ACCRUAL = 'INTEREST_ACCRUAL',
    RESERVE_TRANSFER = 'RESERVE_TRANSFER',
    CENTRAL_BANK_INJECTION = 'CENTRAL_BANK_INJECTION',
    LOAN_DEFAULT = 'LOAN_DEFAULT',
}

/**
 * @interface ITransaction
 * @description Represents a single financial transaction in the ledger.
 */
export interface ITransaction {
    id: string;
    timestamp: number;
    type: ETransactionType;
    amount: number;
    fromBankId?: string;
    toBankId?: string;
    description: string;
    relatedLoanId?: string;
    relatedDepositId?: string;
}

/**
 * @enum ELoanStatus
 * @description Represents the current status of a loan.
 */
export enum ELoanStatus {
    ACTIVE = 'ACTIVE',
    PAID_OFF = 'PAID_OFF',
    DEFAULTED = 'DEFAULTED',
}

/**
 * @interface ILoan
 * @description Represents a loan issued by a bank.
 */
export interface ILoan {
    id: string;
    bankId: string;
    principal: number;
    interestRate: number;
    interestAccrued: number;
    totalOwed: number;
    status: ELoanStatus;
    issueDate: number;
    termMonths: number;
}

/**
 * @interface IDeposit
 * @description Represents a customer deposit at a bank.
 */
export interface IDeposit {
    id: string;
    bankId: string;
    amount: number;
    depositorId: string;
    depositDate: number;
}

/**
 * @interface IBank
 * @description Represents a single bank within the simulated financial system.
 */
export interface IBank {
    id: string;
    name: string;
    reserves: number; // Cash on hand
    deposits: IDeposit[];
    loans: ILoan[];
    capital: number; // Bank's own equity
}

/**
 * @interface IEconomicIndicators
 * @description Key macroeconomic indicators for the simulation.
 */
export interface IEconomicIndicators {
    moneySupplyM1: number;
    totalCredit: number;
    inflationRate: number; // Annualized
    gdpGrowth: number; // Annualized
    defaultRate: number; // Percentage of loans defaulting
    velocityOfMoney: number;
}

/**
 * @interface ISimulationParameters
 * @description Configurable parameters for the financial simulation.
 */
export interface ISimulationParameters {
    reserveRatio: number;
    centralBankInterestRate: number; // aka discount rate
    loanInterestRate: number;
    simulationSpeed: number; // in ms per tick
    loanDefaultProbability: number;
    economicGrowthFactor: number;
    inflationFactor: number;
}

/**
 * @interface IStressTestScenario
 * @description Defines a stress test to apply to the simulation.
 */
export interface IStressTestScenario {
    type: 'BANK_RUN' | 'MARKET_CRASH' | 'INTEREST_RATE_SHOCK';
    targetBankId?: string;
    severity: number; // e.g., 0.5 for 50%
}

/**
 * @interface ISimulationState
 * @description The complete state of the financial simulation.
 */
export interface ISimulationState {
    isRunning: boolean;
    tick: number;
    banks: IBank[];
    transactions: ITransaction[];
    parameters: ISimulationParameters;
    indicators: IEconomicIndicators;
    log: string[];
}

// --- Action Types for State Management ---
export type SimulationAction =
    | { type: 'TOGGLE_SIMULATION' }
    | { type: 'RESET_SIMULATION' }
    | { type: 'SIMULATION_TICK' }
    | { type: 'ADD_BANK'; payload: { name: string } }
    | { type: 'ADD_INITIAL_DEPOSIT'; payload: { bankId: string; amount: number } }
    | { type: 'UPDATE_PARAMETER'; payload: { key: keyof ISimulationParameters; value: number } }
    | { type: 'APPLY_STRESS_TEST'; payload: IStressTestScenario };

// --- Utility Functions ---

/**
 * @function generateId
 * @description Generates a simple unique identifier.
 * @returns {string} A unique ID string.
 */
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * @function createNewBank
 * @description Factory function to create a new bank object.
 * @param {string} name - The name of the new bank.
 * @returns {IBank} A new bank object.
 */
export const createNewBank = (name: string): IBank => ({
    id: generateId(),
    name,
    reserves: 0,
    deposits: [],
    loans: [],
    capital: 100000, // Initial seed capital
});

const initialParameters: ISimulationParameters = {
    reserveRatio: 0.10,
    centralBankInterestRate: 0.05,
    loanInterestRate: 0.08,
    simulationSpeed: 2000,
    loanDefaultProbability: 0.02,
    economicGrowthFactor: 0.001,
    inflationFactor: 0.0005,
};

const calculateIndicators = (banks: IBank[], oldIndicators?: IEconomicIndicators): IEconomicIndicators => {
    const totalDeposits = banks.reduce((sum, bank) => sum + bank.deposits.reduce((dSum, d) => dSum + d.amount, 0), 0);
    const totalReserves = banks.reduce((sum, bank) => sum + bank.reserves, 0);
    const totalActiveLoans = banks.reduce((sum, bank) => sum + bank.loans.filter(l => l.status === ELoanStatus.ACTIVE).length, 0);
    const totalDefaultedLoans = banks.reduce((sum, bank) => sum + bank.loans.filter(l => l.status === ELoanStatus.DEFAULTED).length, 0);
    const totalCredit = banks.reduce((sum, bank) => sum + bank.loans.filter(l => l.status === ELoanStatus.ACTIVE).reduce((lSum, l) => lSum + l.principal, 0), 0);
    const totalLoans = totalActiveLoans + totalDefaultedLoans;

    return {
        moneySupplyM1: totalReserves + totalDeposits,
        totalCredit: totalCredit,
        inflationRate: oldIndicators?.inflationRate ?? 0.0,
        gdpGrowth: oldIndicators?.gdpGrowth ?? 0.0,
        defaultRate: totalLoans > 0 ? totalDefaultedLoans / totalLoans : 0.0,
        velocityOfMoney: oldIndicators?.velocityOfMoney ?? 1.0,
    };
};

const initialBanks = [
    createNewBank('Demo Bank Alpha'),
    createNewBank('Quantum Credit Union'),
    createNewBank('Nexus Financial'),
];

export const initialSimulationState: ISimulationState = {
    isRunning: false,
    tick: 0,
    banks: initialBanks,
    transactions: [],
    parameters: initialParameters,
    indicators: calculateIndicators(initialBanks),
    log: ['Simulation initialized. Add an initial deposit to a bank to begin.'],
};


// --- The Core Simulation Reducer ---

/**
 * @function simulationReducer
 * @description Manages the state transitions of the financial simulation.
 * @param {ISimulationState} state - The current state.
 * @param {SimulationAction} action - The action to perform.
 * @returns {ISimulationState} The new state.
 */
export const simulationReducer = (state: ISimulationState, action: SimulationAction): ISimulationState => {
    switch (action.type) {
        case 'TOGGLE_SIMULATION':
            return {
                ...state,
                isRunning: !state.isRunning,
                log: [...state.log, `Simulation ${!state.isRunning ? 'started' : 'paused'}.`],
            };
        case 'RESET_SIMULATION':
            const newBanksOnReset = [
                createNewBank('Demo Bank Alpha'),
                createNewBank('Quantum Credit Union'),
                createNewBank('Nexus Financial'),
            ];
            return {
                ...initialSimulationState,
                banks: newBanksOnReset,
                indicators: calculateIndicators(newBanksOnReset),
                log: ['Simulation reset to initial state.'],
            };
        case 'UPDATE_PARAMETER':
            return {
                ...state,
                parameters: {
                    ...state.parameters,
                    [action.payload.key]: action.payload.value,
                },
                 log: [...state.log, `Parameter '${action.payload.key}' updated to ${action.payload.value}.`],
            };
        case 'ADD_INITIAL_DEPOSIT': {
            const { bankId, amount } = action.payload;
            const newBanks = state.banks.map(bank => {
                if (bank.id === bankId) {
                    const newDeposit: IDeposit = {
                        id: generateId(),
                        bankId: bank.id,
                        amount,
                        depositorId: 'central-bank-seed',
                        depositDate: Date.now(),
                    };
                    return {
                        ...bank,
                        reserves: bank.reserves + amount,
                        deposits: [...bank.deposits, newDeposit],
                    };
                }
                return bank;
            });
            const newTransaction: ITransaction = {
                id: generateId(),
                timestamp: Date.now(),
                type: ETransactionType.CENTRAL_BANK_INJECTION,
                amount,
                toBankId: bankId,
                description: `Initial capital injection of $${amount.toLocaleString()}.`,
            };

            const newState = {
                ...state,
                banks: newBanks,
                transactions: [newTransaction, ...state.transactions].slice(0, 50),
                log: [...state.log, `Deposited $${amount.toLocaleString()} into ${newBanks.find(b => b.id === bankId)?.name}.`],
            };

            return { ...newState, indicators: calculateIndicators(newState.banks, newState.indicators) };
        }
        case 'APPLY_STRESS_TEST': {
            const { type, targetBankId, severity } = action.payload;
            let newBanks = [...state.banks];
            let logUpdates: string[] = [`Applying Stress Test: ${type}`];

            switch (type) {
                case 'BANK_RUN': {
                    if (!targetBankId) return state;
                    newBanks = newBanks.map(bank => {
                        if (bank.id === targetBankId) {
                            const totalDeposits = bank.deposits.reduce((sum, d) => sum + d.amount, 0);
                            const withdrawalAmount = totalDeposits * severity;
                            logUpdates.push(`Bank run at ${bank.name}! Attempting to withdraw $${withdrawalAmount.toLocaleString()} (${severity * 100}% of deposits).`);
                            
                            if (bank.reserves >= withdrawalAmount) {
                                bank.reserves -= withdrawalAmount;
                                const remainingDepositRatio = 1 - severity;
                                bank.deposits = bank.deposits.map(d => ({ ...d, amount: d.amount * remainingDepositRatio }));
                                logUpdates.push(`${bank.name} survived the bank run, reserves are now $${bank.reserves.toLocaleString()}.`);
                            } else {
                                logUpdates.push(`CRITICAL: ${bank.name} has FAILED! Insufficient reserves of $${bank.reserves.toLocaleString()} to cover withdrawals of $${withdrawalAmount.toLocaleString()}. Bank is insolvent.`);
                                bank.capital = -1; 
                            }
                        }
                        return bank;
                    });
                    break;
                }
                case 'MARKET_CRASH': {
                    logUpdates.push(`Market crash! Loan default probability increased by ${severity * 100}%.`);
                    newBanks = newBanks.map(bank => {
                        bank.loans = bank.loans.map(loan => {
                            if (loan.status === ELoanStatus.ACTIVE && Math.random() < severity) {
                                loan.status = ELoanStatus.DEFAULTED;
                                bank.capital -= loan.totalOwed;
                                logUpdates.push(`Crash-induced default of loan ${loan.id} at ${bank.name} for $${loan.totalOwed.toLocaleString()}.`);
                            }
                            return loan;
                        });
                        return bank;
                    });
                    break;
                }
                case 'INTEREST_RATE_SHOCK': {
                     logUpdates.push(`Interest Rate Shock! Central bank rate increased by ${severity * 100}bps.`);
                     const newState = {
                         ...state,
                         parameters: {
                             ...state.parameters,
                             centralBankInterestRate: state.parameters.centralBankInterestRate + severity,
                             loanInterestRate: state.parameters.loanInterestRate + severity * 1.5
                         },
                         log: [...state.log, ...logUpdates],
                     };
                     return newState;
                }
            }
            
            const newState = { ...state, banks: newBanks, log: [...state.log, ...logUpdates] };
            return { ...newState, indicators: calculateIndicators(newState.banks, newState.indicators) };
        }
        case 'SIMULATION_TICK': {
            if (!state.isRunning) return state;

            let newBanks = JSON.parse(JSON.stringify(state.banks));
            let newTransactions: ITransaction[] = [];
            let logUpdates: string[] = [`Tick ${state.tick + 1}`];

            newBanks = newBanks.map((bank: IBank) => {
                if (bank.capital < 0) return bank; // Bank has failed, do not process
                
                let newBankTransactions: ITransaction[] = [];

                // 1. Accrue interest
                bank.loans = bank.loans.map(loan => {
                    if (loan.status === ELoanStatus.ACTIVE) {
                        const monthlyInterest = loan.principal * (loan.interestRate / 12);
                        loan.interestAccrued += monthlyInterest;
                        loan.totalOwed += monthlyInterest;
                    }
                    return loan;
                });

                // 2. Handle defaults
                bank.loans = bank.loans.map(loan => {
                    if (loan.status === ELoanStatus.ACTIVE && Math.random() < state.parameters.loanDefaultProbability) {
                        loan.status = ELoanStatus.DEFAULTED;
                        bank.capital -= loan.totalOwed;
                        logUpdates.push(`Loan ${loan.id.substring(0,4)} at ${bank.name} defaulted for $${loan.totalOwed.toFixed(0)}. Capital reduced.`);
                        newBankTransactions.push({ id: generateId(), timestamp: Date.now(), type: ETransactionType.LOAN_DEFAULT, amount: loan.totalOwed, fromBankId: bank.id, description: `Loan default`, relatedLoanId: loan.id });
                    }
                    return loan;
                });
                if (bank.capital < 0) logUpdates.push(`${bank.name} is insolvent!`);

                // 3. Issue new loans
                const totalDeposits = bank.deposits.reduce((sum, d) => sum + d.amount, 0);
                const requiredReserves = totalDeposits * state.parameters.reserveRatio;
                const excessReserves = bank.reserves - requiredReserves;

                if (excessReserves > 1000) {
                    const newLoanAmount = Math.floor(excessReserves * 0.8 * Math.random());
                    if (newLoanAmount > 500) {
                        const newLoan: ILoan = { id: generateId(), bankId: bank.id, principal: newLoanAmount, interestRate: state.parameters.loanInterestRate, interestAccrued: 0, totalOwed: newLoanAmount, status: ELoanStatus.ACTIVE, issueDate: Date.now(), termMonths: 36 };
                        const newDeposit: IDeposit = { id: generateId(), bankId: bank.id, amount: newLoanAmount, depositorId: `borrower-${generateId()}`, depositDate: Date.now() };
                        bank.loans.push(newLoan);
                        bank.deposits.push(newDeposit);
                        logUpdates.push(`${bank.name} issued new loan for $${newLoanAmount.toLocaleString()}, creating new deposit.`);
                        newBankTransactions.push({ id: generateId(), timestamp: Date.now(), type: ETransactionType.LOAN_ISSUANCE, amount: newLoanAmount, toBankId: bank.id, description: `New loan issued`, relatedLoanId: newLoan.id });
                    }
                }
                
                newTransactions.push(...newBankTransactions);
                return bank;
            });
            
            const newState = {
                ...state,
                tick: state.tick + 1,
                banks: newBanks,
                transactions: [...newTransactions, ...state.transactions].slice(0, 50),
                log: [...state.log, ...logUpdates].slice(-100),
            };

            const oldIndicators = state.indicators;
            const newMoneySupply = calculateIndicators(newBanks).moneySupplyM1;
            const moneySupplyGrowth = newMoneySupply - oldIndicators.moneySupplyM1;

            const updatedIndicators = calculateIndicators(newState.banks, oldIndicators);
            updatedIndicators.inflationRate = oldIndicators.inflationRate + (moneySupplyGrowth / oldIndicators.moneySupplyM1) * state.parameters.inflationFactor;
            updatedIndicators.gdpGrowth = oldIndicators.gdpGrowth + (newTransactions.length > 0 ? state.parameters.economicGrowthFactor : -state.parameters.economicGrowthFactor/2);
            
            return { ...newState, indicators: updatedIndicators };
        }
        default:
            return state;
    }
};

// --- Helper Components ---
const PlayIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const ResetIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>;

const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

const SimulationControls = ({ state, dispatch }: { state: ISimulationState, dispatch: React.Dispatch<SimulationAction> }) => {
    const [depositAmount, setDepositAmount] = useState(100000);
    const [targetBank, setTargetBank] = useState(state.banks[0]?.id || '');

    useEffect(() => {
        if (!targetBank && state.banks.length > 0) {
            setTargetBank(state.banks[0].id);
        }
    }, [state.banks, targetBank]);

    const handleDeposit = useCallback(() => {
        if (targetBank && depositAmount > 0) {
            dispatch({ type: 'ADD_INITIAL_DEPOSIT', payload: { bankId: targetBank, amount: depositAmount } });
        }
    }, [dispatch, targetBank, depositAmount]);
    
    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Controls</h3>
            <div className="flex space-x-2 mb-4">
                <button onClick={() => dispatch({ type: 'TOGGLE_SIMULATION' })} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center justify-center space-x-2">
                    {state.isRunning ? <PauseIcon/> : <PlayIcon/>} <span>{state.isRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button onClick={() => dispatch({ type: 'RESET_SIMULATION' })} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded flex items-center justify-center space-x-2">
                    <ResetIcon/> <span>Reset</span>
                </button>
            </div>
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Reserve Ratio: {formatPercent(state.parameters.reserveRatio)}</label>
                    <input type="range" min="0.01" max="1" step="0.01" value={state.parameters.reserveRatio} onChange={e => dispatch({type: 'UPDATE_PARAMETER', payload: {key: 'reserveRatio', value: +e.target.value}})} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Loan Interest Rate: {formatPercent(state.parameters.loanInterestRate)}</label>
                    <input type="range" min="0.01" max="0.25" step="0.005" value={state.parameters.loanInterestRate} onChange={e => dispatch({type: 'UPDATE_PARAMETER', payload: {key: 'loanInterestRate', value: +e.target.value}})} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Simulation Speed: {state.parameters.simulationSpeed}ms/tick</label>
                    <input type="range" min="100" max="5000" step="100" value={state.parameters.simulationSpeed} onChange={e => dispatch({type: 'UPDATE_PARAMETER', payload: {key: 'simulationSpeed', value: +e.target.value}})} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                </div>
            </div>
            <div className="mt-6 border-t border-gray-700 pt-4">
                <h4 className="text-md font-semibold text-gray-300 mb-2">Initial Deposit</h4>
                <div className="flex space-x-2">
                    <select value={targetBank} onChange={e => setTargetBank(e.target.value)} className="flex-grow bg-gray-900 border border-gray-600 rounded p-2">
                        {state.banks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <input type="number" value={depositAmount} onChange={e => setDepositAmount(+e.target.value)} className="w-32 bg-gray-900 border border-gray-600 rounded p-2" />
                    <button onClick={handleDeposit} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">Inject</button>
                </div>
            </div>
        </Card>
    );
};

const EconomicIndicatorsPanel = ({ indicators }: { indicators: IEconomicIndicators }) => (
    <Card>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Economic Indicators</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Money Supply (M1)</p>
                <p className="text-xl font-bold text-green-400">{formatCurrency(indicators.moneySupplyM1)}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Total Credit</p>
                <p className="text-xl font-bold text-blue-400">{formatCurrency(indicators.totalCredit)}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Inflation Rate</p>
                <p className="text-xl font-bold text-yellow-400">{formatPercent(indicators.inflationRate)}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Loan Default Rate</p>
                <p className="text-xl font-bold text-red-400">{formatPercent(indicators.defaultRate)}</p>
            </div>
        </div>
    </Card>
);

const BankCard = ({ bank, reserveRatio }: { bank: IBank; reserveRatio: number }) => {
    const totalDeposits = useMemo(() => bank.deposits.reduce((sum, d) => sum + d.amount, 0), [bank.deposits]);
    const totalLoans = useMemo(() => bank.loans.filter(l => l.status === ELoanStatus.ACTIVE).reduce((sum, l) => sum + l.principal, 0), [bank.loans]);
    const requiredReserves = totalDeposits * reserveRatio;
    const excessReserves = bank.reserves - requiredReserves;
    const isSolvent = bank.capital >= 0;

    return (
        <div className={`p-4 rounded-lg ${isSolvent ? 'bg-gray-800' : 'bg-red-900/50 border border-red-500'}`}>
            <h4 className="font-bold text-lg text-white">{bank.name} {isSolvent ? '' : '(INSOLVENT)'}</h4>
            <div className="text-sm text-gray-400 space-y-1 mt-2">
                <p><strong>Capital:</strong> <span className={bank.capital > 0 ? 'text-green-400' : 'text-red-400'}>{formatCurrency(bank.capital)}</span></p>
                <p><strong>Total Deposits:</strong> {formatCurrency(totalDeposits)}</p>
                <p><strong>Total Active Loans:</strong> {formatCurrency(totalLoans)}</p>
                <p><strong>Reserves:</strong> {formatCurrency(bank.reserves)}</p>
            </div>
            <div className="mt-3">
                <label className="text-xs text-gray-500">Reserves vs Required ({formatCurrency(requiredReserves)})</label>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (bank.reserves / (requiredReserves + 0.01)) * 100)}%` }}></div>
                </div>
                <p className={`text-xs mt-1 ${excessReserves >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {excessReserves >= 0 ? `Excess: ${formatCurrency(excessReserves)}` : `Deficit: ${formatCurrency(excessReserves)}`}
                </p>
            </div>
        </div>
    );
};

const StressTestPanel = ({ banks, dispatch }: { banks: IBank[], dispatch: React.Dispatch<SimulationAction> }) => {
    const [targetBank, setTargetBank] = useState(banks[0]?.id || '');
    useEffect(() => { if (!targetBank && banks.length > 0) setTargetBank(banks[0].id) }, [banks, targetBank]);

    const runBankRun = () => dispatch({type: 'APPLY_STRESS_TEST', payload: {type: 'BANK_RUN', targetBankId: targetBank, severity: 0.5}});
    const runMarketCrash = () => dispatch({type: 'APPLY_STRESS_TEST', payload: {type: 'MARKET_CRASH', severity: 0.25}});
    const runRateShock = () => dispatch({type: 'APPLY_STRESS_TEST', payload: {type: 'INTEREST_RATE_SHOCK', severity: 0.05}});

    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Stress Scenarios</h3>
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                     <select value={targetBank} onChange={e => setTargetBank(e.target.value)} className="flex-grow bg-gray-900 border border-gray-600 rounded p-2 text-sm">
                        {banks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <button onClick={runBankRun} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded text-sm">Simulate Bank Run (50%)</button>
                </div>
                 <button onClick={runMarketCrash} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-sm">Simulate Market Crash (25% Defaults)</button>
                 <button onClick={runRateShock} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded text-sm">Simulate Rate Shock (+500bps)</button>
            </div>
        </Card>
    );
};

const TransactionLedger = ({ transactions }: { transactions: ITransaction[] }) => (
    <Card>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Transaction Ledger</h3>
        <div className="h-48 overflow-y-auto pr-2 space-y-2">
            {transactions.length === 0 && <p className="text-gray-500 text-center mt-4">No transactions yet.</p>}
            {transactions.map(tx => (
                <div key={tx.id} className="text-xs p-2 bg-gray-800 rounded">
                    <p className="font-semibold text-sky-400">{tx.type} - {formatCurrency(tx.amount)}</p>
                    <p className="text-gray-400">{tx.description}</p>
                </div>
            ))}
        </div>
    </Card>
);

const SimulationLog = ({ logs }: { logs: string[] }) => (
    <Card>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Simulation Log</h3>
        <div className="h-48 overflow-y-auto bg-gray-900 rounded p-2 text-xs font-mono">
            {logs.slice().reverse().map((log, i) => <p key={i} className="whitespace-pre-wrap">{log}</p>)}
        </div>
    </Card>
);


const getAIInsight = (state: ISimulationState): string => {
    const { indicators, banks, parameters, tick, log } = state;
    if (tick < 5) {
        return "Simulation is initializing. The system is stable but requires economic activity to generate meaningful data.";
    }

    if (log[log.length-1]?.includes("CRITICAL")) {
        return `CRITICAL ADVISORY: ${log[log.length-1]}. Recommend immediate intervention to prevent systemic collapse. Pausing the simulation is advised.`;
    }

    if (indicators.defaultRate > 0.15) {
        return "High default rates are eroding bank capital. This suggests significant economic stress. Consider lowering interest rates or applying a capital injection to stabilize the system.";
    }
    
    const moneySupplyGrowth = indicators.moneySupplyM1 - (calculateIndicators(banks).moneySupplyM1 || indicators.moneySupplyM1);
    if (moneySupplyGrowth / indicators.moneySupplyM1 > 0.10) {
        return "Rapid expansion of the money supply detected. While this can fuel growth, it poses a significant inflation risk. Monitor inflation indicators closely.";
    }

    const lowLeverageBanks = banks.filter(b => {
        const totalDeposits = b.deposits.reduce((sum, d) => sum + d.amount, 0);
        const requiredReserves = totalDeposits * parameters.reserveRatio;
        return b.reserves - requiredReserves > totalDeposits * 0.5;
    });

    if (lowLeverageBanks.length > 0) {
        return `Banks like ${lowLeverageBanks.map(b=>b.name).join(', ')} are holding significant excess reserves. The system is under-leveraged. Lowering the reserve ratio could stimulate lending and economic activity.`;
    }

    return "The financial system appears stable. Current parameters are supporting controlled growth. Monitor for changes in credit quality and liquidity.";
};

const AIAdvisor = ({ state }: { state: ISimulationState }) => {
    const insight = useMemo(() => getAIInsight(state), [state]);
    return (
        <Card>
             <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-cyan-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-1.54c0-.28.22-.5.5-.5s.5.22.5.5v1.54c0 .28-.22.5-.5.5s-.5-.22-.5-.5zM12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                AI Financial System Advisor
            </h3>
            <div className="p-3 bg-gray-800 rounded-lg text-gray-300 italic">
                {insight}
            </div>
        </Card>
    );
};


const FractionalReserveView: React.FC = () => {
    const [state, dispatch] = useReducer(simulationReducer, initialSimulationState);

    useEffect(() => {
        if (state.isRunning) {
            const timer = setInterval(() => {
                dispatch({ type: 'SIMULATION_TICK' });
            }, state.parameters.simulationSpeed);
            return () => clearInterval(timer);
        }
    }, [state.isRunning, state.parameters.simulationSpeed]);

    return (
        <div className="p-4 md:p-6 bg-gray-900 text-gray-300 min-h-screen">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-white">Fractional Reserve Banking Simulation</h1>
                <p className="text-gray-400 mt-1">An interactive model of the money creation process and systemic risk in a banking system.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Controls & Parameters */}
                <div className="space-y-6">
                    <SimulationControls state={state} dispatch={dispatch} />
                    <StressTestPanel banks={state.banks} dispatch={dispatch} />
                    <AIAdvisor state={state}/>
                </div>

                {/* Column 2: System & Bank Overview */}
                <div className="space-y-6">
                    <EconomicIndicatorsPanel indicators={state.indicators} />
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Banking System Overview</h3>
                        <div className="space-y-4">
                            {state.banks.map(bank => (
                                <BankCard key={bank.id} bank={bank} reserveRatio={state.parameters.reserveRatio} />
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Column 3: Ledger & Logs */}
                <div className="space-y-6">
                    <TransactionLedger transactions={state.transactions} />
                    <SimulationLog logs={state.log} />
                </div>
            </div>
        </div>
    );
};

export default FractionalReserveView;
