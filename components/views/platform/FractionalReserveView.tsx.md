// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/FractionalReserveView.tsx.md
================================================================================

```typescript
namespace TheAssemblyLayerPrinciple {
    type MonetaryUnit = number;
    
    interface IConstitutionalArticle {
        readonly number: "XXIX";
        readonly title: "The Principle of Fractional Reserve Creation";
    }

    class TheBankingEngine {
        private readonly reserveRatio: number = 0.10;
        private readonly interestRate: number = 0.29;

        public calculateCreditExpansion(initialDeposit: MonetaryUnit): MonetaryUnit {
            const loanMultiplier = 1 / this.reserveRatio;
            return initialDeposit * loanMultiplier;
        }
        
        public calculateInterestObligation(loanPrincipal: MonetaryUnit): MonetaryUnit {
            return loanPrincipal * this.interestRate;
        }
    }

    class TheEducationalAI {
        private readonly engine: TheBankingEngine;

        constructor() {
            this.engine = new TheBankingEngine();
        }
        
        public explainThePrinciple(): string {
            const expansion = this.engine.calculateCreditExpansion(100);
            const interest = this.engine.calculateInterestObligation(100);

            const exposition = `
            Article XXIX is the cornerstone of value creation within this simulated economy. It establishes two fundamental truths:
            1. The Principle of Credit Expansion: A deposit is not merely stored; it is leveraged. An initial deposit of 100 units, under the 10% reserve ratio, enables the creation of ${expansion} units of new credit throughout the system.
            2. The Principle of Interest on Principal: This newly created credit is not without cost. A loan of 100 units creates a repayment obligation of ${100 + interest} units, ensuring the system's own sustenance and growth.
            Together, these form the Assembly Layer, the process by which raw deposits are assembled into the complex financial instruments of the modern economy.
            `;
            return exposition;
        }
    }

    function learnThePrinciplesOfMoney(): void {
        const theAI = new TheEducationalAI();
        const exposition = theAI.explainThePrinciple();
    }
    // --- END OF ORIGINAL CODE ---

    // --- CORE INFRASTRUCTURE & DOMAIN MODELS FOR A REAL-WORLD ECONOMIC SIMULATOR ---
    
    // --- UNIQUE IDENTIFIERS ---
    export type AgentId = `agent_${string}`;
    export type BankId = `bank_${string}`;
    export type TransactionId = `txn_${string}`;
    export type AssetId = `asset_${string}`;
    export type LoanId = `loan_${string}`;
    export type PolicyId = `policy_${string}`;
    export type SimulationId = `sim_${string}`;

    // --- ENUMERATIONS & CONSTANTS ---
    export enum Currency {
        USD = "USD", // United States Dollar
        EUR = "EUR", // Euro
        JPY = "JPY", // Japanese Yen
        GLD = "GLD", // Gold Standard Unit
        SYS = "SYS", // System Internal Currency
    }

    export const SIMULATION_CONSTANTS = {
        INITIAL_HOUSEHOLD_COUNT: 1000,
        INITIAL_CORPORATION_COUNT: 100,
        INITIAL_BANK_COUNT: 10,
        TICKS_PER_YEAR: 12, // Monthly ticks
        MAX_SIMULATION_YEARS: 100,
        GLOBAL_ID_COUNTER: 0,
        GOVERNMENT_ID: 'agent_gov_federal' as AgentId,
        CENTRAL_BANK_ID: 'bank_central_001' as BankId,
    };

    export function generateUniqueId(prefix: 'agent' | 'bank' | 'txn' | 'asset' | 'loan' | 'policy' | 'sim'): string {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 9);
        SIMULATION_CONSTANTS.GLOBAL_ID_COUNTER++;
        return `${prefix}_${timestamp}_${randomPart}_${SIMULATION_CONSTANTS.GLOBAL_ID_COUNTER}`;
    }

    // --- MONETARY & ASSET INTERFACES ---
    export interface IMonetaryValue {
        amount: MonetaryUnit;
        currency: Currency;
    }

    export enum AssetType {
        REAL_ESTATE,
        EQUITY,
        BOND,
        COMMODITY,
        CAPITAL_GOOD,
        CASH_EQUIVALENT,
    }

    export interface IAsset {
        id: AssetId;
        ownerId: AgentId | BankId;
        type: AssetType;
        marketValue: IMonetaryValue;
        description: string;
        yield?: number; // Annual yield for assets like bonds or rental properties
        lastValuationTick: number;
    }

    export interface IBalanceSheet {
        assets: Map<AssetId, IAsset>;
        liabilities: Map<LoanId, ILoan>;
        calculateNetWorth(): IMonetaryValue;
        addAsset(asset: IAsset): void;
        removeAsset(assetId: AssetId): void;
        addLiability(loan: ILoan): void;
        removeLiability(loanId: LoanId): void;
    }

    // --- TRANSACTION & LEDGER SYSTEM ---
    export enum TransactionType {
        DEPOSIT,
        WITHDRAWAL,
        LOAN_ORIGINATION,
        LOAN_REPAYMENT,
        INTEREST_ACCRUAL,
        INTEREST_PAYMENT,
        ASSET_PURCHASE,
        ASSET_SALE,
        INTERBANK_LOAN,
        INTERBANK_SETTLEMENT,
        TAX_PAYMENT,
        GOVERNMENT_SPENDING,
        WAGE_PAYMENT,
        DIVIDEND_PAYMENT,
        CENTRAL_BANK_OPERATION,
        SIMULATION_GENESIS,
        CONSUMER_PURCHASE,
        CAPITAL_INVESTMENT,
    }

    export interface ITransaction {
        id: TransactionId;
        tick: number;
        timestamp: number;
        type: TransactionType;
        from: AgentId | BankId | 'GENESIS' | 'SYSTEM';
        to: AgentId | BankId | 'SYSTEM';
        amount: IMonetaryValue;
        memo: string;
        relatedAssetId?: AssetId;
        relatedLoanId?: LoanId;
    }

    export class GlobalLedger {
        private static instance: GlobalLedger;
        private readonly transactions: ITransaction[] = [];
        private isLocked: boolean = false;

        private constructor() {}

        public static getInstance(): GlobalLedger {
            if (!GlobalLedger.instance) {
                GlobalLedger.instance = new GlobalLedger();
            }
            return GlobalLedger.instance;
        }
        
        public static resetInstance(): void {
             GlobalLedger.instance = new GlobalLedger();
        }

        public recordTransaction(transaction: Omit<ITransaction, 'id' | 'timestamp'>): ITransaction {
            if (this.isLocked) {
                throw new Error("Ledger is locked and cannot record new transactions.");
            }
            const newTransaction: ITransaction = {
                ...transaction,
                id: generateUniqueId('txn'),
                timestamp: Date.now(),
            };
            this.transactions.push(newTransaction);
            return newTransaction;
        }

        public getTransactionById(id: TransactionId): ITransaction | undefined {
            return this.transactions.find(t => t.id === id);
        }
        
        public getTransactionsForTick(tick: number): ITransaction[] {
            return this.transactions.filter(t => t.tick === tick);
        }

        public getTransactionsForEntity(entityId: AgentId | BankId): ITransaction[] {
            return this.transactions.filter(t => t.from === entityId || t.to === entityId);
        }

        public getTransactionsByType(type: TransactionType): ITransaction[] {
            return this.transactions.filter(t => t.type === type);
        }

        public getFullLedger(): readonly ITransaction[] {
            return this.transactions;
        }
        
        public lock(): void {
            this.isLocked = true;
        }
    }

    // --- LOAN & DEBT INSTRUMENTS ---
    export interface ILoan {
        id: LoanId;
        principal: IMonetaryValue;
        outstandingPrincipal: MonetaryUnit;
        interestRate: number; // Annual rate
        termInTicks: number;
        originationTick: number;
        lenderId: BankId;
        borrowerId: AgentId;
        amortizationSchedule: IAmortizationPayment[];
        isDefaulted: boolean;
    }

    export interface IAmortizationPayment {
        tick: number;
        principalPayment: MonetaryUnit;
        interestPayment: MonetaryUnit;
        paid: boolean;
    }

    export class LoanFactory {
        public static createLoan(
            principal: IMonetaryValue,
            interestRate: number,
            termInYears: number,
            originationTick: number,
            lenderId: BankId,
            borrowerId: AgentId
        ): ILoan {
            const termInTicks = termInYears * SIMULATION_CONSTANTS.TICKS_PER_YEAR;
            const monthlyRate = interestRate / SIMULATION_CONSTANTS.TICKS_PER_YEAR;
            
            if (termInTicks <= 0 || monthlyRate <= 0) {
                 return { // Interest-only or simple balloon loan for simplicity
                    id: generateUniqueId('loan'), principal, outstandingPrincipal: principal.amount,
                    interestRate, termInTicks, originationTick, lenderId, borrowerId,
                    amortizationSchedule: [], isDefaulted: false,
                };
            }

            const monthlyPayment = principal.amount * (monthlyRate * Math.pow(1 + monthlyRate, termInTicks)) / (Math.pow(1 + monthlyRate, termInTicks) - 1);

            const schedule: IAmortizationPayment[] = [];
            let remainingPrincipal = principal.amount;

            for (let i = 1; i <= termInTicks; i++) {
                const interestPayment = remainingPrincipal * monthlyRate;
                const principalPayment = monthlyPayment - interestPayment;
                remainingPrincipal -= principalPayment;
                schedule.push({
                    tick: originationTick + i,
                    principalPayment: principalPayment > 0 ? principalPayment : 0,
                    interestPayment,
                    paid: false,
                });
            }

            return {
                id: generateUniqueId('loan'),
                principal,
                outstandingPrincipal: principal.amount,
                interestRate,
                termInTicks,
                originationTick,
                lenderId,
                borrowerId,
                amortizationSchedule: schedule,
                isDefaulted: false,
            };
        }
    }

    // --- BASE CLASSES FOR ECONOMIC ENTITIES ---
    export abstract class EconomicEntity {
        public readonly id: AgentId | BankId;
        public readonly name: string;
        public balanceSheet: IBalanceSheet;
        protected ledger: GlobalLedger;

        constructor(id: AgentId | BankId, name: string) {
            this.id = id;
            this.name = name;
            this.ledger = GlobalLedger.getInstance();
            this.balanceSheet = {
                assets: new Map(),
                liabilities: new Map(),
                calculateNetWorth: (): IMonetaryValue => {
                    let totalAssets = 0;
                    this.balanceSheet.assets.forEach(asset => totalAssets += asset.marketValue.amount);
                    let totalLiabilities = 0;
                    this.balanceSheet.liabilities.forEach(loan => totalLiabilities += loan.outstandingPrincipal);
                    return { amount: totalAssets - totalLiabilities, currency: Currency.USD };
                },
                addAsset: (asset: IAsset) => this.balanceSheet.assets.set(asset.id, asset),
                removeAsset: (assetId: AssetId) => this.balanceSheet.assets.delete(assetId),
                addLiability: (loan: ILoan) => this.balanceSheet.liabilities.set(loan.id, loan),
                removeLiability: (loanId: LoanId) => this.balanceSheet.liabilities.delete(loanId),
            };
        }

        public abstract update(currentTick: number, simulator: EconomicSimulator): void;
    }

    // --- ECONOMIC AGENTS ---
    export abstract class EconomicAgent extends EconomicEntity {
        public readonly id: AgentId;
        public bankAccounts: Map<BankId, IMonetaryValue> = new Map();

        constructor(id: AgentId, name: string) {
            super(id, name);
            this.id = id;
        }

        public getCashBalance(): number {
            return Array.from(this.bankAccounts.values()).reduce((sum, acc) => sum + acc.amount, 0);
        }

        public getPrimaryBankId(): BankId | undefined {
            return this.bankAccounts.keys().next().value;
        }

        public deposit(bankId: BankId, amount: IMonetaryValue, currentTick: number, memo: string): void {
            const currentBalance = this.bankAccounts.get(bankId)?.amount || 0;
            this.bankAccounts.set(bankId, { amount: currentBalance + amount.amount, currency: amount.currency });
        }

        public withdraw(bankId: BankId, amount: IMonetaryValue, currentTick: number, memo: string): boolean {
            const currentBalance = this.bankAccounts.get(bankId)?.amount || 0;
            if (currentBalance < amount.amount) {
                return false;
            }
            this.bankAccounts.set(bankId, { amount: currentBalance - amount.amount, currency: amount.currency });
            return true;
        }
    }

    export class Household extends EconomicAgent {
        private yearlyIncome: IMonetaryValue;
        private consumptionRate: number; // Percentage of disposable income
        public creditScore: number = 700; // Simplified credit score
        public employerId: AgentId | null = null;

        constructor(id: AgentId, name: string, initialIncome: IMonetaryValue) {
            super(id, name);
            this.yearlyIncome = initialIncome;
            this.consumptionRate = 0.8 + Math.random() * 0.15; // 80% - 95%
        }
        
        public setEmployer(corpId: AgentId) {
            this.employerId = corpId;
        }

        public update(currentTick: number, simulator: EconomicSimulator): void {
            // NOTE: Income is handled by the Corporation's update step (wage payment)
            const disposableIncome = this.getMonthlyIncome(); // Simplified: assumes income already received this tick
            
            // 1. Pay taxes (simplified flat tax)
            const taxAmount = disposableIncome * simulator.government.taxRate;
            this.payTaxes(taxAmount, currentTick, simulator);

            const afterTaxIncome = disposableIncome - taxAmount;

            // 2. Make loan payments
            this.makeLoanPayments(currentTick, simulator);

            // 3. Consume
            const consumptionAmount = afterTaxIncome * this.consumptionRate;
            this.consumeGoods(consumptionAmount, currentTick, simulator);
        }
        
        private getMonthlyIncome(): number {
            return this.yearlyIncome.amount / SIMULATION_CONSTANTS.TICKS_PER_YEAR;
        }

        private payTaxes(amount: number, currentTick: number, simulator: EconomicSimulator) {
            const primaryBankId = this.getPrimaryBankId();
            if (!primaryBankId) return;
            const taxPayment: IMonetaryValue = {amount, currency: Currency.USD};
            
            if (this.withdraw(primaryBankId, taxPayment, currentTick, "Tax Payment")) {
                 simulator.getBank(primaryBankId)?.handleWithdrawal(this.id, taxPayment);
                 simulator.government.receiveTax(taxPayment);
                 this.ledger.recordTransaction({
                    tick: currentTick, type: TransactionType.TAX_PAYMENT, from: this.id,
                    to: simulator.government.id, amount: taxPayment, memo: "Household income tax"
                 });
            }
        }
        
        private makeLoanPayments(currentTick: number, simulator: EconomicSimulator) {
            const primaryBankId = this.getPrimaryBankId();
            if (!primaryBankId) return;

            this.balanceSheet.liabilities.forEach(loan => {
                const payment = loan.amortizationSchedule.find(p => p.tick === currentTick && !p.paid);
                if (payment) {
                    const totalPayment = payment.principalPayment + payment.interestPayment;
                    const paymentAmount: IMonetaryValue = { amount: totalPayment, currency: loan.principal.currency };

                    if (this.withdraw(primaryBankId, paymentAmount, currentTick, `Loan payment ${loan.id}`)) {
                        simulator.getBank(primaryBankId)?.handleWithdrawal(this.id, paymentAmount);
                        simulator.getBank(loan.lenderId)?.handleLoanPayment(loan, payment);

                        payment.paid = true;
                        loan.outstandingPrincipal -= payment.principalPayment;
                    } else {
                        loan.isDefaulted = true; // Simplified default logic
                        console.warn(`${this.name} failed to make loan payment. Defaulting on loan ${loan.id}`);
                    }
                }
            });
        }
        
        private consumeGoods(amount: number, currentTick: number, simulator: EconomicSimulator) {
             const primaryBankId = this.getPrimaryBankId();
             if (!primaryBankId || amount <= 0) return;
             
             const price = simulator.goodsMarket.getPrice();
             const goodsToBuy = amount / price;
             const totalCost: IMonetaryValue = { amount: goodsToBuy * price, currency: Currency.USD };
             
             // Assume a single corporate sector to buy from
             const corporation = simulator.getCorporations()[0];
             if (!corporation) return;

             if (this.withdraw(primaryBankId, totalCost, currentTick, "Goods consumption")) {
                simulator.getBank(primaryBankId)?.handleWithdrawal(this.id, totalCost);
                // Money flows to the corporation
                const corpBankId = corporation.getPrimaryBankId();
                if (corpBankId) {
                    corporation.deposit(corpBankId, totalCost, currentTick, "Sales revenue");
                    simulator.getBank(corpBankId)?.handleDeposit(corporation.id, totalCost);
                }

                simulator.goodsMarket.recordDemand(goodsToBuy);
                this.ledger.recordTransaction({
                    tick: currentTick, type: TransactionType.CONSUMER_PURCHASE, from: this.id,
                    to: corporation.id, amount: totalCost, memo: "Household consumption"
                });
             }
        }
    }

    export class Corporation extends EconomicAgent {
        private employees: Map<AgentId, Household> = new Map();
        private capitalStock: number = 1000000;
        private productionFunctionAlpha: number = 0.3; // Capital's share of income
        
        constructor(id: AgentId, name: string) {
            super(id, name);
        }

        public hire(household: Household): void {
            this.employees.set(household.id, household);
            household.setEmployer(this.id);
        }

        public update(currentTick: number, simulator: EconomicSimulator): void {
            // 1. Production
            const goodsProduced = this.produce();
            simulator.goodsMarket.recordSupply(goodsProduced);

            // 2. Pay Wages
            this.payWages(currentTick, simulator);
            
            // Other logic (investment, dividends, taxes) would go here
        }
        
        private produce(): number {
            // Cobb-Douglas Production Function: Y = A * K^alpha * L^(1-alpha)
            const A = 1.0; // Total factor productivity
            const K = this.capitalStock;
            const L = this.employees.size;
            if (L === 0) return 0;
            return A * Math.pow(K, this.productionFunctionAlpha) * Math.pow(L, 1 - this.productionFunctionAlpha);
        }
        
        private payWages(currentTick: number, simulator: EconomicSimulator) {
            const primaryBankId = this.getPrimaryBankId();
            if (!primaryBankId) return;

            this.employees.forEach(employee => {
                const monthlyWage = 50000 / SIMULATION_CONSTANTS.TICKS_PER_YEAR; // Simplified: all get 50k/yr
                const wagePayment: IMonetaryValue = { amount: monthlyWage, currency: Currency.USD };
                
                if (this.withdraw(primaryBankId, wagePayment, currentTick, `Wage for ${employee.name}`)) {
                    simulator.getBank(primaryBankId)?.handleWithdrawal(this.id, wagePayment);
                    
                    const employeeBankId = employee.getPrimaryBankId();
                    if (employeeBankId) {
                        employee.deposit(employeeBankId, wagePayment, currentTick, "Monthly wage");
                        simulator.getBank(employeeBankId)?.handleDeposit(employee.id, wagePayment);
                    }
                    
                    this.ledger.recordTransaction({
                        tick: currentTick, type: TransactionType.WAGE_PAYMENT, from: this.id,
                        to: employee.id, amount: wagePayment, memo: `Monthly wage`
                    });
                }
            });
        }
    }

    export class Government extends EconomicAgent {
        public taxRate: number = 0.20; // 20% flat tax

        constructor(id: AgentId, name: string) {
            super(id, name);
        }
        
        public receiveTax(amount: IMonetaryValue) {
            // In this model, government funds appear in its account magically after collection.
            const primaryBankId = this.getPrimaryBankId();
            if (!primaryBankId) return;
            this.deposit(primaryBankId, amount, 0, "Tax Revenue");
        }

        public update(currentTick: number, simulator: EconomicSimulator): void {
            // Government spending logic would go here
        }
    }


    // --- BANKING SYSTEM HIERARCHY ---
    export class CommercialBank extends EconomicEntity {
        public readonly id: BankId;
        private deposits: Map<AgentId, IMonetaryValue> = new Map();
        public reserves: IMonetaryValue;
        private loans: Map<LoanId, ILoan> = new Map();
        private centralBank: TheCentralBank;

        constructor(id: BankId, name: string, centralBank: TheCentralBank, initialCapital: IMonetaryValue) {
            super(id, name);
            this.id = id;
            this.centralBank = centralBank;
            this.reserves = initialCapital;
            const capitalAsset: IAsset = {
                id: generateUniqueId('asset'), ownerId: this.id, type: AssetType.CASH_EQUIVALENT,
                marketValue: initialCapital, description: "Initial Tier 1 Capital", lastValuationTick: 0
            };
            this.balanceSheet.addAsset(capitalAsset);
        }

        public get reserveRequirement(): number {
            return this.centralBank.getPolicyRate('reserveRatio');
        }

        public handleDeposit(agentId: AgentId, amount: IMonetaryValue): void {
            const currentDeposit = this.deposits.get(agentId)?.amount || 0;
            this.deposits.set(agentId, { amount: currentDeposit + amount.amount, currency: amount.currency });
            this.reserves.amount += amount.amount;
        }
        
        public handleWithdrawal(agentId: AgentId, amount: IMonetaryValue): void {
             const currentDeposit = this.deposits.get(agentId)?.amount || 0;
             this.deposits.set(agentId, { amount: currentDeposit - amount.amount, currency: amount.currency });
             this.reserves.amount -= amount.amount;
        }

        public handleLoanPayment(loan: ILoan, payment: IAmortizationPayment): void {
            // When a loan payment is made, the bank's reserves increase
            this.reserves.amount += (payment.principalPayment + payment.interestPayment);
        }

        public getTotalDeposits(): number {
             return Array.from(this.deposits.values()).reduce((sum, d) => sum + d.amount, 0);
        }

        public getRequiredReserves(): MonetaryUnit {
            return this.getTotalDeposits() * this.reserveRequirement;
        }

        public getExcessReserves(): MonetaryUnit {
            return this.reserves.amount - this.getRequiredReserves();
        }

        public originateLoan(borrower: EconomicAgent, principal: IMonetaryValue, termInYears: number, currentTick: number): ILoan | null {
            const excessReserves = this.getExcessReserves();
            if (principal.amount > excessReserves) { // Simplified: can only lend up to excess reserves
                console.warn(`${this.name} has insufficient excess reserves to lend.`);
                return null;
            }
            
            const interestRate = this.centralBank.getPolicyRate('discountRate') + 0.03; // Spread over central bank rate
            const newLoan = LoanFactory.createLoan(principal, interestRate, termInYears, currentTick, this.id, borrower.id);
            this.loans.set(newLoan.id, newLoan);
            borrower.balanceSheet.addLiability(newLoan);
            
            // The magic of money creation: credit the borrower's deposit account
            const borrowerBankId = borrower.getPrimaryBankId();
            if(borrowerBankId) {
                // Here, the loan creates a new deposit for the borrower. The bank's reserves do not change at this moment.
                // The bank's assets (loans) increase, and liabilities (deposits) increase.
                const borrowerBank = this === simulator.getBank(borrowerBankId) ? this : simulator.getBank(borrowerBankId);
                borrowerBank?.handleDeposit(borrower.id, principal);
                borrower.deposit(borrowerBankId, principal, currentTick, "Loan proceeds");
            }
            
            this.ledger.recordTransaction({
                tick: currentTick, type: TransactionType.LOAN_ORIGINATION, from: this.id,
                to: borrower.id, amount: principal, memo: `Loan origination for ${borrower.name}`,
                relatedLoanId: newLoan.id
            });
            
            console.log(`${this.name} created ${principal.amount} of new money by issuing a loan to ${borrower.name}.`);
            return newLoan;
        }

        public update(currentTick: number, simulator: EconomicSimulator): void {
            this.loans.forEach(loan => {
                if (!loan.isDefaulted) {
                    const paymentInfo = loan.amortizationSchedule.find(p => p.tick === currentTick);
                    if (paymentInfo) {
                        this.ledger.recordTransaction({
                            tick: currentTick, type: TransactionType.INTEREST_ACCRUAL, from: loan.borrowerId,
                            to: this.id, amount: {amount: paymentInfo.interestPayment, currency: loan.principal.currency},
                            memo: `Interest accrued for loan ${loan.id}`, relatedLoanId: loan.id
                        });
                    }
                }
            });

            if (this.reserves.amount < this.getRequiredReserves()) {
                const shortfall = this.getRequiredReserves() - this.reserves.amount;
                console.log(`${this.name} is short on reserves by ${shortfall}. Seeking interbank loan.`);
            }
        }
    }

    export class TheCentralBank extends EconomicEntity {
        public readonly id: BankId = SIMULATION_CONSTANTS.CENTRAL_BANK_ID;
        private memberBanks: Map<BankId, CommercialBank> = new Map();
        private policyRates: Map<string, number> = new Map();

        constructor(name: string) {
            super(SIMULATION_CONSTANTS.CENTRAL_BANK_ID, name);
            this.initializePolicyRates();
        }

        private initializePolicyRates(): void {
            this.policyRates.set('reserveRatio', 0.10);
            this.policyRates.set('discountRate', 0.05);
            this.policyRates.set('fedFundsTarget', 0.04);
        }
        
        public setPolicyRate(policy: 'reserveRatio' | 'discountRate' | 'fedFundsTarget', rate: number, currentTick: number): void {
            if (rate < 0) throw new Error("Policy rate cannot be negative.");
            this.policyRates.set(policy, rate);
            console.log(`MONETARY POLICY ALERT (Tick ${currentTick}): ${this.name} has set ${policy} to ${rate * 100}%.`);
            this.ledger.recordTransaction({
                tick: currentTick, type: TransactionType.CENTRAL_BANK_OPERATION, from: this.id,
                to: 'SYSTEM', amount: { amount: rate, currency: Currency.SYS },
                memo: `Policy Change: ${policy} set to ${rate}`
            });
        }

        public getPolicyRate(policy: 'reserveRatio' | 'discountRate' | 'fedFundsTarget'): number {
            return this.policyRates.get(policy) || 0;
        }

        public registerMemberBank(bank: CommercialBank): void {
            this.memberBanks.set(bank.id, bank);
        }

        public quantitativeEasing(amount: IMonetaryValue, targetBank: CommercialBank, currentTick: number): void {
            console.log(`QE: ${this.name} is injecting ${amount.amount} into ${targetBank.name} by purchasing assets.`);
            targetBank.reserves.amount += amount.amount;
            
            const qeAsset: IAsset = {
                id: generateUniqueId('asset'), ownerId: this.id, type: AssetType.BOND,
                marketValue: amount, description: `Asset purchased from ${targetBank.name} via QE`,
                lastValuationTick: currentTick
            };
            this.balanceSheet.addAsset(qeAsset);

            this.ledger.recordTransaction({
                tick: currentTick, type: TransactionType.CENTRAL_BANK_OPERATION, from: this.id,
                to: targetBank.id, amount: amount, memo: 'Quantitative Easing Operation',
                relatedAssetId: qeAsset.id
            });
        }
        
        public update(currentTick: number, simulator: EconomicSimulator): void {
            // Implement a simple Taylor Rule for monetary policy
            const analytics = simulator.analyticsEngine;
            const currentInflation = analytics.calculateInflationRate();
            const targetInflation = 0.02; // 2%
            const equilibriumRate = 0.02; // Assumed natural rate of interest
            
            // Taylor Rule: r = p + r* + a(p - p*) + b(y - y*)
            // Simplified: r = p + r* + 0.5(p - p*)
            const inflationGap = currentInflation - targetInflation;
            let newFedFundsTarget = equilibriumRate + currentInflation + 0.5 * inflationGap;
            newFedFundsTarget = Math.max(0, Math.min(0.1, newFedFundsTarget)); // Bound the rate

            if (Math.abs(newFedFundsTarget - this.getPolicyRate('fedFundsTarget')) > 0.0025) {
                this.setPolicyRate('fedFundsTarget', newFedFundsTarget, currentTick);
                this.setPolicyRate('discountRate', newFedFundsTarget + 0.01, currentTick);
            }
        }
    }
    
    export class GoodsMarket {
        private priceLevel: number = 1.0;
        private lastTickSupply: number = 0;
        private lastTickDemand: number = 0;
        public inflationRate: number = 0.02; // Annual

        public recordSupply(amount: number): void { this.lastTickSupply += amount; }
        public recordDemand(amount: number): void { this.lastTickDemand += amount; }
        public getPrice(): number { return this.priceLevel; }

        public updatePriceLevel(): void {
            if (this.lastTickSupply > 0 && this.lastTickDemand > 0) {
                const imbalance = this.lastTickDemand / this.lastTickSupply;
                const newPriceLevel = this.priceLevel * (1 + (imbalance - 1) * 0.1); // Inertia
                const tickInflation = newPriceLevel / this.priceLevel - 1;
                this.inflationRate = Math.pow(1 + tickInflation, SIMULATION_CONSTANTS.TICKS_PER_YEAR) - 1;
                this.priceLevel = newPriceLevel;
            }
            this.lastTickDemand = 0;
            this.lastTickSupply = 0;
        }
    }

    // --- ECONOMIC SIMULATION ENGINE ---
    var simulator: EconomicSimulator; // Global for bank access
    export class EconomicSimulator {
        public readonly id: SimulationId;
        private currentTick: number = 0;
        private isRunning: boolean = false;
        private households: Household[] = [];
        private corporations: Corporation[] = [];
        private banks: CommercialBank[] = [];
        public government: Government;
        public centralBank: TheCentralBank;
        public goodsMarket: GoodsMarket;
        public analyticsEngine: EconomicAnalyticsEngine;
        private ledger: GlobalLedger;

        constructor() {
            this.id = generateUniqueId('sim');
            GlobalLedger.resetInstance(); // Ensure clean slate for new sim
            this.ledger = GlobalLedger.getInstance();
            this.centralBank = new TheCentralBank("The Central Banking Authority");
            this.government = new Government(SIMULATION_CONSTANTS.GOVERNMENT_ID, "The Federal Government");
            this.goodsMarket = new GoodsMarket();
            this.analyticsEngine = new EconomicAnalyticsEngine(this);
            simulator = this;

            this.initializeEconomy();
        }

        private initializeEconomy(): void {
            console.log(`Initializing economic simulation ${this.id}...`);

            for (let i = 0; i < SIMULATION_CONSTANTS.INITIAL_BANK_COUNT; i++) {
                const bank = new CommercialBank(
                    generateUniqueId('bank') as BankId, `Commercial Bank #${i + 1}`,
                    this.centralBank, { amount: 1000000, currency: Currency.USD }
                );
                this.banks.push(bank);
                this.centralBank.registerMemberBank(bank);
            }
            this.government.deposit(this.banks[0].id, {amount: 10000000, currency: Currency.USD}, 0, "Initial Gov Balance");


            for (let i = 0; i < SIMULATION_CONSTANTS.INITIAL_CORPORATION_COUNT; i++) {
                const corp = new Corporation(generateUniqueId('agent') as AgentId, `Corporation #${i+1}`);
                const randomBank = this.banks[Math.floor(Math.random() * this.banks.length)];
                corp.deposit(randomBank.id, {amount: 500000, currency: Currency.USD}, 0, "Initial Capital");
                randomBank.handleDeposit(corp.id, {amount: 500000, currency: Currency.USD});
                this.corporations.push(corp);
            }

            for (let i = 0; i < SIMULATION_CONSTANTS.INITIAL_HOUSEHOLD_COUNT; i++) {
                const household = new Household(
                    generateUniqueId('agent') as AgentId, `Household #${i + 1}`,
                    { amount: 50000 + Math.random() * 100000, currency: Currency.USD }
                );
                const initialSavings = (Math.random() * 5000);
                const randomBank = this.banks[Math.floor(Math.random() * this.banks.length)];
                household.deposit(randomBank.id, { amount: initialSavings, currency: Currency.USD }, 0, "Initial Savings");
                randomBank.handleDeposit(household.id, { amount: initialSavings, currency: Currency.USD });
                
                // Assign to a corporation
                const randomCorp = this.corporations[Math.floor(Math.random() * this.corporations.length)];
                randomCorp.hire(household);
                this.households.push(household);
            }
            console.log("Economic simulation initialized.");
        }
        
        public getHouseholds(): readonly Household[] { return this.households; }
        public getCorporations(): readonly Corporation[] { return this.corporations; }
        public getBanks(): readonly CommercialBank[] { return this.banks; }
        public getBank(id: BankId): CommercialBank | undefined { return this.banks.find(b => b.id === id); }

        public runFor(ticks: number): void {
            this.isRunning = true;
            console.log(`--- Starting simulation run for ${ticks} ticks ---`);
            for (let i = 0; i < ticks; i++) {
                this.currentTick++;
                console.log(`\n--- Tick ${this.currentTick} ---`);
                this.step();
                if (!this.isRunning) {
                    console.log("Simulation halted.");
                    break;
                }
            }
            console.log("--- Simulation run finished ---");
        }

        private step(): void {
            // Production & Labor Market
            this.corporations.forEach(corp => corp.update(this.currentTick, this));
            // Consumption, Savings, Debt
            this.households.forEach(agent => agent.update(this.currentTick, this));
            // Financial System
            this.banks.forEach(bank => bank.update(this.currentTick, this));
            // Government
            this.government.update(this.currentTick, this);
            // Monetary Policy
            this.centralBank.update(this.currentTick, this);
            // Market Clearing
            this.goodsMarket.updatePriceLevel();
        }

        public getSystemState(): object {
            return {
                tick: this.currentTick,
                totalAgents: this.households.length + this.corporations.length,
                totalBanks: this.banks.length,
                centralBankPolicy: {
                    reserveRatio: this.centralBank.getPolicyRate('reserveRatio'),
                    discountRate: this.centralBank.getPolicyRate('discountRate'),
                },
                ledgerSize: this.ledger.getFullLedger().length
            };
        }

        public demonstrateCreditCreation(): void {
            const household = this.households[0] as Household;
            const bank = this.banks[0];

            console.log("\n--- DEMONSTRATING CREDIT CREATION ---");
            const loanAmount = { amount: 10000, currency: Currency.USD };
            console.log(`${household.name} is applying for a ${loanAmount.amount} loan...`);
            
            const loan = bank.originateLoan(household, loanAmount, 5, this.currentTick);

            if (loan) {
                console.log(`Loan successful!`);
            } else {
                console.log("Loan origination failed.");
            }
        }
    }
    
    // --- ECONOMIC ANALYTICS & VISUALIZATION ---
    export class EconomicAnalyticsEngine {
        private simulator: EconomicSimulator;
        private ledger: GlobalLedger;

        constructor(simulator: EconomicSimulator) {
            this.simulator = simulator;
            this.ledger = GlobalLedger.getInstance();
        }

        public calculateMoneySupply(): { m0: number, m1: number } {
            const banks = this.simulator.getBanks();
            let totalReserves = banks.reduce((sum, b) => sum + b.reserves.amount, 0);
            let totalDeposits = banks.reduce((sum, b) => sum + b.getTotalDeposits(), 0);
            return { m0: totalReserves, m1: totalReserves + totalDeposits };
        }

        public calculateGDP(tick: number): number {
            const transactions = this.ledger.getTransactionsForTick(tick);
            return transactions
                .filter(t => t.type === TransactionType.CONSUMER_PURCHASE || t.type === TransactionType.CAPITAL_INVESTMENT)
                .reduce((sum, t) => sum + t.amount.amount, 0);
        }
        
        public calculateInflationRate(): number {
            return this.simulator.goodsMarket.inflationRate;
        }

        public generateGiniCoefficient(): number {
            const households = this.simulator.getHouseholds();
            if (households.length < 2) return 0;
            
            const wealths = households.map(h => h.balanceSheet.calculateNetWorth().amount).sort((a, b) => a - b);
            const n = wealths.length;
            const totalWealth = wealths.reduce((sum, w) => sum + w, 0);
            if (totalWealth === 0) return 0;
            
            let numerator = 0;
            for(let i=0; i<n; i++) {
                numerator += (i + 1) * wealths[i];
            }
            
            const gini = (2 * numerator) / (n * totalWealth) - (n + 1) / n;
            return gini;
        }
    }
    
    // --- ADVANCED EDUCATIONAL AI ---
    export class TheAdvancedEducationalAI {
        private readonly simulator: EconomicSimulator;
        private readonly analytics: EconomicAnalyticsEngine;
        private readonly simpleEngine: TheBankingEngine;

        constructor(simulator: EconomicSimulator) {
            this.simulator = simulator;
            this.analytics = simulator.analyticsEngine;
            this.simpleEngine = new TheBankingEngine();
        }
        
        public explainThePrincipleInPractice(): string {
            const simState = this.simulator.getSystemState();
            const reserveRatio = this.simulator.centralBank.getPolicyRate('reserveRatio');
            const simpleExpansion = this.simpleEngine.calculateCreditExpansion(100);
            const loanTxn = this.analytics['ledger'].getTransactionsByType(TransactionType.LOAN_ORIGINATION)[0];
            let realExample = "No loans have been originated yet in the simulation.";

            if (loanTxn) {
                realExample = `For instance, we observed a real transaction (${loanTxn.id}) where a loan of ${loanTxn.amount.amount} ${loanTxn.amount.currency} was created. This action simultaneously created a new asset (the loan) for the bank and a new liability (the debt) for the borrower, backed by a corresponding new deposit. This deposit is new money, added to the M1 money supply. The bank did not lend out existing money; it created new money, constrained only by its capital, its excess reserves, and the borrower's creditworthiness.`;
            }

            const exposition = `
            ======================================================================
            THE ASSEMBLY LAYER PRINCIPLE: FROM THEORY TO LIVE SIMULATION
            ======================================================================

            Constitutional Article XXIX outlines the theoretical basis of our economy. Let us now observe its manifestation within this complex, running simulation (ID: ${this.simulator.id}).

            1. The Principle of Credit Expansion (Revisited):
            -----------------------------------------------------
            The simple model states that a deposit of 100 units at a ${reserveRatio * 100}% reserve ratio creates ${simpleExpansion} units of credit.
            
            In reality, the process is far more dynamic. It is not a mechanical multiplier acting on a single deposit. Rather, every single loan is an act of money creation. 

            **Live Simulation Example:**
            ${realExample}

            This dynamic process is governed not just by the reserve ratio, but by the Central Bank's full suite of policy tools, the demand for loans from creditworthy agents, and the risk appetite of the commercial banks. The money supply is therefore endogenousâ€”determined from within the system, not exogenously injected.

            2. The Principle of Interest on Principal (The System's Metabolism):
            -------------------------------------------------------------------
            The simple model shows a static interest obligation. Our simulation models this as a dynamic flow over time. Every tick, interest accrues on all outstanding debt, creating a constant, system-wide demand for more currency than was initially created as principal.

            This "interest imperative" is a primary driver of economic activity. Agents must work, invest, and innovate to acquire the necessary currency to service their debts. This creates a perpetual growth incentive. Failure to meet these obligations leads to defaults, which can cascade through the system, demonstrating the inherent fragility that accompanies this powerful mechanism of value creation.

            **Current Economic State (Tick ${simState.tick}):**
            - Total Transactions Processed: ${simState.ledgerSize}
            - Money Supply (M1): ${this.analytics.calculateMoneySupply().m1.toFixed(2)}
            - Gini Coefficient (Inequality): ${this.analytics.generateGiniCoefficient().toFixed(3)}
            - Annualized Inflation (Est.): ${(this.analytics.calculateInflationRate() * 100).toFixed(2)}%

            This simulation demonstrates that the Assembly Layer is not a simple formula, but a complex, emergent property of countless interacting agents operating within a defined regulatory framework. The principles remain true, but their expression is rich, chaotic, and perpetually evolving.
            `;
            return exposition;
        }
    }

    // --- MAIN EXECUTION LOGIC ---
    export function runFullEconomicSimulation(): void {
        console.log("--- Initializing The Assembly Layer Principle ---");
        const simulator = new EconomicSimulator();
        const aia = new TheAdvancedEducationalAI(simulator);

        console.log(new TheEducationalAI().explainThePrinciple());
        
        simulator.runFor(5);
        
        simulator.demonstrateCreditCreation();
        
        simulator.runFor(5);

        console.log(aia.explainThePrincipleInPractice());
    }
}
```