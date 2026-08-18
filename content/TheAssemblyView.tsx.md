// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/content/TheAssemblyView.tsx.md
================================================================================

---
```typescript
import React from 'react'; // Assuming React is available in the scope

/**
 * @namespace TheFinancialInstrumentForge
 * @description A comprehensive suite for the design, analysis, and minting of bespoke financial instruments.
 * This namespace encapsulates the entire lifecycle of a financial product, from blueprint selection to AI-driven risk analysis
 * and final on-chain or off-chain issuance. It serves as a virtual assembly line for financial engineering.
 */
export namespace TheFinancialInstrumentForge {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // SECTION 1: CORE DOMAIN MODELS & TYPES
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Defines the high-level classification of a financial product.
     * - **Structured**: Instruments created by combining traditional assets with derivatives.
     * - **Decentralized**: Instruments native to blockchain ecosystems (DeFi).
     * - **Personal**: Instruments tailored for individual needs, like annuities or bespoke loans.
     * - **Insurance**: Products focused on risk mitigation and transfer.
     * - **Alternative**: Investments in non-traditional asset classes like real estate, commodities, or private equity.
     * - **Impact**: Instruments designed to generate positive social or environmental impact alongside a financial return.
     */
    export type FinancialProductClass = "Structured" | "Decentralized" | "Personal" | "Insurance" | "Alternative" | "Impact";

    /**
     * Defines the type of input parameter for an instrument, hinting at the required UI component.
     */
    export type ParameterType = "number" | "percentage" | "date" | "select" | "currency" | "boolean" | "asset_picker" | "risk_slider" | "textarea";

    /**
     * Defines the structure for a configurable parameter within a blueprint.
     */
    export interface IParameterDefinition {
        readonly key: string;
        readonly label: string;
        readonly description: string;
        readonly type: ParameterType;
        readonly defaultValue: any;
        readonly validationRules?: {
            readonly required?: boolean;
            readonly minValue?: number;
            readonly maxValue?: number;
            readonly pattern?: string; // For regex validation
            readonly options?: Array<{ value: string | number; label: string }>;
        };
        readonly uiHint?: {
            readonly placeholder?: string;
            readonly step?: number;
        }
    }

    /**
     * Represents the foundational template for a financial product.
     * It contains all the immutable properties and rules of a specific type of instrument.
     */
    export interface IProductBlueprint {
        readonly id: string;
        readonly name: string;
        readonly description: string;
        readonly productClass: FinancialProductClass;
        readonly underlyingAssets: string[]; // e.g., ['SPX', 'NDX', 'BTC']
        readonly payoffFormula: string; // A mathematical or logical representation of the payoff
        readonly legalFramework: "ISDA" | "Custom" | "SmartContract" | "Governmental";
        readonly jurisdiction: "US" | "EU" | "UK" | "SG" | "Global";
        readonly configurableParameters: IParameterDefinition[];
    }

    /**
     * Represents a user-customized instance of a financial instrument, ready for analysis and minting.
     */
    export interface ICustomInstrument {
        readonly instanceId: string; // Unique ID for this specific instance
        readonly blueprint: IProductBlueprint;
        readonly principal: number;
        readonly termInYears: number;
        readonly riskProfile: "Conservative" | "Moderate" | "Aggressive" | "Speculative";
        readonly customParameters: Record<string, any>;
        readonly investorId: string;
        readonly creationDate: Date;
        status: "Draft" | "Analyzed" | "Minted" | "Matured" | "Failed";
    }
    
    /**
     * Describes the outcome of a specific stress test scenario.
     */
    export interface IStressTestResult {
        scenario: string;
        description: string;
        impactOnValue: number; // as a percentage change
        narrative: string;
    }

    /**
     * Encapsulates the complete AI-driven analysis of a custom instrument.
     */
    export interface IAIAnalysisResult {
        readonly timestamp: Date;
        readonly risk: {
            summary: string;
            valueAtRisk95: number; // 95% VaR
            expectedShortfall95: number;
            volatility: number;
            sensitivityAnalysis: Record<string, number>; // Greeks: Delta, Gamma, Vega, Theta
            downsideDeviation: number; // Sortino Ratio denominator
        };
        readonly reward: {
            summary: string;
            expectedReturn: number;
            sharpeRatio: number;
            sortinoRatio: number;
            bestCaseScenario: number;
            worstCaseScenario: number;
            returnDistributionSkewness: number;
        };
        readonly suitability: {
            summary: string;
            score: number; // 0-100
            warnings: string[];
            ethicalConsiderations: string;
        };
        readonly complianceChecks: {
            mifidII: "Pass" | "Fail" | "N/A";
            doddFrank: "Pass" | "Fail" | "N/A";
            localRegs: "Pass" | "Fail" | "N/A";
            regulatoryRedFlags: string[];
        };
        readonly simulationData?: {
            payoffDistribution: Array<{ value: number; probability: number }>;
            monteCarloPaths?: number[][];
        };
        readonly backtestResult?: IBacktestResult;
        readonly marketSentiment?: {
            summary: string;
            score: number; // -1 to 1
            keyHeadlines: string[];
        };
        readonly stressTestResults?: IStressTestResult[];
        readonly aiNarrative: string; // Full, conversational explanation from the AI
    }

    /**
     * Represents the outcome of a backtesting simulation.
     */
    export interface IBacktestResult {
        readonly period: { start: Date; end: Date };
        readonly strategyReturns: number;
        readonly benchmarkReturns: number; // e.g., S&P 500 returns over the same period
        readonly maxDrawdown: number;
        readonly annualisedSharpeRatio: number;
        readonly summary: string;
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // SECTION 2: MOCK SERVICES & DATA PROVIDERS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * @class LoggerService
     * @description A simple singleton for application-wide logging.
     */
    export class LoggerService {
        private static instance: LoggerService;
        private logs: string[] = [];

        private constructor() { }

        public static getInstance(): LoggerService {
            if (!LoggerService.instance) {
                LoggerService.instance = new LoggerService();
            }
            return LoggerService.instance;
        }

        public log(level: 'INFO' | 'WARN' | 'ERROR', message: string, context?: object) {
            const logEntry = `[${new Date().toISOString()}] [${level}] ${message} ${context ? JSON.stringify(context) : ''}`;
            console.log(logEntry);
            this.logs.push(logEntry);
        }

        public getLogs(): string[] {
            return [...this.logs];
        }
    }
    
    /**
     * @class MarketDataService
     * @description Simulates fetching market data required for financial calculations.
     * In a real application, this would connect to APIs like Bloomberg, Reuters, or crypto exchanges.
     */
    export class MarketDataService {
        private logger = LoggerService.getInstance();
        private riskFreeRate: number = 0.05; // 5% risk-free rate (e.g., T-Bill yield)

        constructor() {
            this.logger.log('INFO', 'MarketDataService initialized.');
        }

        public getRiskFreeRate(): number {
            this.logger.log('INFO', 'Fetching risk-free rate.', { rate: this.riskFreeRate });
            return this.riskFreeRate;
        }

        public getAssetData(assetId: string): { price: number; volatility: number; dividendYield: number } {
            this.logger.log('INFO', `Fetching data for asset: ${assetId}`);
            // In a real app, this would be a complex lookup. Here we simulate it.
            switch (assetId) {
                case 'SPX': return { price: 4500, volatility: 0.20, dividendYield: 0.015 };
                case 'NDX': return { price: 15000, volatility: 0.25, dividendYield: 0.008 };
                case 'BTC': return { price: 60000, volatility: 0.80, dividendYield: 0 };
                case 'ETH': return { price: 3000, volatility: 0.95, dividendYield: 0.02 }; // Staking yield
                case 'VTI': return { price: 230, volatility: 0.18, dividendYield: 0.016 };
                case 'BND': return { price: 75, volatility: 0.05, dividendYield: 0.025 };
                case 'GLD': return { price: 180, volatility: 0.15, dividendYield: 0 };
                case 'CAT_BOND_INDEX': return { price: 100, volatility: 0.04, dividendYield: 0.06 };
                case 'IMPACT_FUND_A': return { price: 50, volatility: 0.12, dividendYield: 0.01 };
                default:
                    this.logger.log('WARN', `No data for asset ${assetId}. Using fallback.`);
                    return { price: 100, volatility: 0.30, dividendYield: 0.01 };
            }
        }

        public getNewsSentiment(assetIds: string[]): { summary: string; score: number; keyHeadlines: string[] } {
             this.logger.log('INFO', 'Fetching news sentiment.', { assets: assetIds });
             // Simulated NLP analysis of news headlines
             const score = (Math.random() - 0.5) * 2; // -1 to 1
             return {
                 score,
                 summary: score > 0.5 ? "Overwhelmingly positive news coverage focused on strong earnings and macro tailwinds." : score > 0 ? "Slightly positive sentiment with some mixed economic signals." : score > -0.5 ? "Negative sentiment driven by regulatory concerns and market volatility." : "Extremely negative sentiment; widespread fears of a downturn.",
                 keyHeadlines: [
                     `Fed Signals Potential Pause in Rate Hikes, Boosting ${assetIds[0]}`,
                     "Geopolitical Tensions Weigh on Market Outlook",
                     `Analyst Upgrades ${assetIds[0]} to 'Buy' on Innovation Pipeline`
                 ]
             };
        }

        public getHistoricalData(assetId: string, years: number): number[] {
            this.logger.log('INFO', `Fetching ${years} years of historical data for ${assetId}.`);
            const data = this.getAssetData(assetId);
            const days = years * 252; // Trading days
            const dailyDrift = (this.riskFreeRate - data.dividendYield - 0.5 * data.volatility ** 2) / 252;
            const dailyStDev = data.volatility / Math.sqrt(252);
            
            let prices: number[] = [data.price];
            let currentPrice = data.price;

            for (let i = 1; i < days; i++) {
                const epsilon = this.standardNormalRandom();
                currentPrice *= Math.exp(dailyDrift + dailyStDev * epsilon);
                prices.push(currentPrice);
            }
            return prices.reverse(); // Simulate from past to present
        }

        // Box-Muller transform to get a standard normal random variable
        private standardNormalRandom(): number {
            let u = 0, v = 0;
            while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
            while(v === 0) v = Math.random();
            return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        }
    }

    /**
     * @class BlueprintService
     * @description Provides the catalog of available financial product blueprints.
     */
    export class BlueprintService {
        private logger = LoggerService.getInstance();
        private blueprints: IProductBlueprint[];

        constructor() {
            this.logger.log('INFO', 'BlueprintService initialized.');
            this.blueprints = this.loadBlueprints();
        }

        public getBlueprints(): IProductBlueprint[] {
            return this.blueprints;
        }

        public getBlueprintById(id: string): IProductBlueprint | undefined {
            return this.blueprints.find(b => b.id === id);
        }

        private loadBlueprints(): IProductBlueprint[] {
            this.logger.log('INFO', 'Loading financial product blueprints from internal catalog.');
            return [
                {
                    id: "ppn_spx_1",
                    name: "Principal Protected Note on S&P 500",
                    description: "A structured product that guarantees the return of principal at maturity while offering participation in the potential upside of the S&P 500 index.",
                    productClass: "Structured",
                    underlyingAssets: ["SPX"],
                    payoffFormula: "Principal + Principal * ParticipationRate * MAX(0, (SPX_Final / SPX_Initial) - 1)",
                    legalFramework: "ISDA",
                    jurisdiction: "US",
                    configurableParameters: [
                        { key: "participationRate", label: "Participation Rate", description: "The percentage of the index's upside the investor captures.", type: "percentage", defaultValue: 0.7, validationRules: { minValue: 0.1, maxValue: 1.5 } },
                        { key: "cap", label: "Upside Cap", description: "The maximum return potential from the index exposure.", type: "percentage", defaultValue: 0.2, validationRules: { minValue: 0.05 } }
                    ]
                },
                {
                    id: "rcn_ndx_1",
                    name: "Reverse Convertible Note on Nasdaq 100",
                    description: "A yield-enhancement product that pays a high coupon. At maturity, if the underlying asset (Nasdaq 100) is above a certain barrier, the principal is returned. Otherwise, the investor receives the depreciated asset.",
                    productClass: "Structured",
                    underlyingAssets: ["NDX"],
                    payoffFormula: "IF(NDX_Final > KnockInBarrier, Principal, Principal * (NDX_Final / NDX_Initial))",
                    legalFramework: "ISDA",
                    jurisdiction: "EU",
                    configurableParameters: [
                        { key: "couponRate", label: "Annual Coupon Rate", description: "The fixed annual interest paid to the investor.", type: "percentage", defaultValue: 0.12, validationRules: { minValue: 0.05, maxValue: 0.25 } },
                        { key: "knockInBarrier", label: "Knock-In Barrier", description: "The price level below which the principal becomes at risk (as a % of initial price).", type: "percentage", defaultValue: 0.75, validationRules: { minValue: 0.5, maxValue: 0.95 } }
                    ]
                },
                {
                    id: "defi_lending_aave_1",
                    name: "Aave Variable Rate Lending Pool",
                    description: "Deposit assets into the Aave protocol to earn a variable interest rate based on market supply and demand for borrowing.",
                    productClass: "Decentralized",
                    underlyingAssets: ["ETH", "USDC", "DAI"],
                    payoffFormula: "Principal * (1 + AverageVariableAPY)^Term",
                    legalFramework: "SmartContract",
                    jurisdiction: "Global",
                    configurableParameters: [
                        { key: "depositAsset", label: "Deposit Asset", description: "The cryptocurrency asset to deposit.", type: "select", defaultValue: "USDC", validationRules: { options: [{ value: 'USDC', label: 'USD Coin' }, { value: 'ETH', label: 'Ethereum' }, { value: 'DAI', label: 'Dai Stablecoin' }] } }
                    ]
                },
                {
                    id: "pra_dynamic_1",
                    name: "Personalized Retirement Annuity",
                    description: "A bespoke annuity product where contributions are invested in a portfolio dynamically adjusted based on the investor's age and risk tolerance.",
                    productClass: "Personal",
                    underlyingAssets: ["VTI", "BND", "GLD"], // Vanguard Total Stock Market, Total Bond Market, Gold ETF
                    payoffFormula: "Complex portfolio growth model with scheduled payouts.",
                    legalFramework: "Custom",
                    jurisdiction: "UK",
                    configurableParameters: [
                        { key: "retirementAge", label: "Target Retirement Age", description: "The age at which payouts will begin.", type: "number", defaultValue: 65, validationRules: { minValue: 50, maxValue: 80 } },
                        { key: "payoutFrequency", label: "Payout Frequency", description: "How often to receive payments in retirement.", type: "select", defaultValue: "monthly", validationRules: { options: [{ value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'annually', label: 'Annually' }] } }
                    ]
                },
                {
                    id: "cat_bond_1",
                    name: "Catastrophe Bond (Florida Hurricane)",
                    description: "An insurance-linked security that provides high yield, but loses principal if a specified catastrophic event (e.g., a major hurricane in Florida) occurs.",
                    productClass: "Insurance",
                    underlyingAssets: ["CAT_BOND_INDEX"],
                    payoffFormula: "IF(EventTriggered, 0, Principal * (1 + Coupon)^Term)",
                    legalFramework: "Custom",
                    jurisdiction: "Global",
                    configurableParameters: [
                        { key: "couponRate", label: "Annual Coupon", description: "The high yield paid for taking on the catastrophe risk.", type: "percentage", defaultValue: 0.08, validationRules: { minValue: 0.04, maxValue: 0.20 } },
                        { key: "eventTrigger", label: "Event Trigger", description: "The specific condition for loss of principal.", type: "textarea", defaultValue: "A Category 4 or higher hurricane making landfall in the state of Florida as determined by the NHC." }
                    ]
                },
                {
                    id: "sib_1",
                    name: "Social Impact Bond (Recidivism Reduction)",
                    description: "Funds a social program to reduce prison recidivism. If the program meets its goals, the government repays investors with a return. If not, investors lose their principal.",
                    productClass: "Impact",
                    underlyingAssets: ["IMPACT_FUND_A"],
                    payoffFormula: "IF(SuccessKPI_Met, Principal * (1 + SuccessReturn), Principal * (1 - LossShare))",
                    legalFramework: "Governmental",
                    jurisdiction: "US",
                    configurableParameters: [
                        { key: "successReturn", label: "Success Return Rate", description: "The annual return if KPIs are met.", type: "percentage", defaultValue: 0.06, validationRules: { minValue: 0.01, maxValue: 0.10 } },
                        { key: "lossShare", label: "Principal Loss Share", description: "The percentage of principal lost if KPIs are not met.", type: "percentage", defaultValue: 1.0, validationRules: { minValue: 0, maxValue: 1.0 } }
                    ]
                }
            ];
        }
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // SECTION 3: FINANCIAL ENGINEERING AI CORE
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    /**
     * @class TheFinancialEngineerAI
     * @description The core intelligence of the forge. This class is responsible for performing
     * complex quantitative analysis on custom financial instruments.
     */
    export class TheFinancialEngineerAI {
        private readonly marketDataService: MarketDataService;
        private readonly logger: LoggerService;

        constructor(marketDataService: MarketDataService) {
            this.marketDataService = marketDataService;
            this.logger = LoggerService.getInstance();
            this.logger.log('INFO', 'TheFinancialEngineerAI has been activated.');
        }

        /**
         * Main entry point for instrument analysis. Delegates to specific methods based on blueprint ID.
         * @param instrument - The custom instrument to analyze.
         * @returns A comprehensive analysis result object.
         */
        public analyzeInstrument(instrument: ICustomInstrument): IAIAnalysisResult {
            this.logger.log('INFO', `Starting analysis for instrument: ${instrument.instanceId}`, { blueprint: instrument.blueprint.id });

            try {
                let analysisResult: IAIAnalysisResult;
                switch (instrument.blueprint.id) {
                    case "ppn_spx_1":
                        analysisResult = this.analyzePrincipalProtectedNote(instrument);
                        break;
                    case "rcn_ndx_1":
                        analysisResult = this.analyzeReverseConvertibleNote(instrument);
                        break;
                    case "defi_lending_aave_1":
                        analysisResult = this.analyzeDeFiLending(instrument);
                        break;
                    case "cat_bond_1":
                        analysisResult = this.analyzeCatastropheBond(instrument);
                        break;
                    case "sib_1":
                        analysisResult = this.analyzeSocialImpactBond(instrument);
                        break;
                    default:
                         return this.getPendingAnalysis(instrument);
                }
                
                // Augment with common analyses
                analysisResult = {
                    ...analysisResult,
                    backtestResult: this.backtestStrategy(instrument),
                    marketSentiment: this.marketDataService.getNewsSentiment(instrument.blueprint.underlyingAssets),
                    stressTestResults: this.runStressTests(instrument, analysisResult),
                };
                analysisResult.aiNarrative = this.generateAINarrative(instrument, analysisResult);

                this.logger.log('INFO', 'Analysis complete.', { instanceId: instrument.instanceId });
                return analysisResult;
            } catch (error) {
                this.logger.log('ERROR', 'An error occurred during instrument analysis.', { error, instanceId: instrument.instanceId });
                return this.getErrorAnalysis(error as Error);
            }
        }

        private getPendingAnalysis(instrument: ICustomInstrument): IAIAnalysisResult {
            const base = {
                timestamp: new Date(),
                risk: { summary: "Analysis pending for this instrument type.", valueAtRisk95: 0, expectedShortfall95: 0, volatility: 0, sensitivityAnalysis: {}, downsideDeviation: 0 },
                reward: { summary: "Analysis pending.", expectedReturn: 0, sharpeRatio: 0, sortinoRatio: 0, bestCaseScenario: 0, worstCaseScenario: 0, returnDistributionSkewness: 0 },
                suitability: { summary: "Analysis pending.", score: 0, warnings: [], ethicalConsiderations: "Analysis pending." },
                complianceChecks: { mifidII: "N/A", doddFrank: "N/A", localRegs: "N/A", regulatoryRedFlags: [] },
                aiNarrative: "The AI analysis for this specific instrument blueprint has not been implemented yet. Please select another blueprint or contact support."
            };
            return base;
        }

        private getErrorAnalysis(error: Error): IAIAnalysisResult {
             const base = {
                timestamp: new Date(),
                risk: { summary: `Analysis failed: ${error.message}`, valueAtRisk95: 0, expectedShortfall95: 0, volatility: 0, sensitivityAnalysis: {}, downsideDeviation: 0 },
                reward: { summary: "Analysis failed.", expectedReturn: 0, sharpeRatio: 0, sortinoRatio: 0, bestCaseScenario: 0, worstCaseScenario: 0, returnDistributionSkewness: 0 },
                suitability: { summary: "Analysis failed.", score: 0, warnings: ["Critical error during analysis. Results are invalid."], ethicalConsiderations: "Analysis failed due to a critical error." },
                complianceChecks: { mifidII: "Fail", doddFrank: "Fail", localRegs: "Fail", regulatoryRedFlags: ["System error during compliance check."] },
                aiNarrative: `I'm sorry, but a critical error occurred while I was analyzing this instrument: ${error.message}. The results are unreliable. Please check the parameters or contact an administrator.`
            };
            return base;
        }

        private runMonteCarloSimulation(
            initialPrice: number,
            termInYears: number,
            riskFreeRate: number,
            volatility: number,
            dividendYield: number,
            numSimulations: number = 10000
        ): { paths: number[][], finalPrices: number[] } {
            const dt = 1 / 252; // Time step per day
            const numSteps = Math.floor(termInYears * 252);
            const drift = (riskFreeRate - dividendYield - 0.5 * volatility * volatility) * dt;
            const diffusion = volatility * Math.sqrt(dt);
            
            const paths: number[][] = [];
            const finalPrices: number[] = [];

            for (let i = 0; i < numSimulations; i++) {
                const path = [initialPrice];
                let currentPrice = initialPrice;
                for (let j = 0; j < numSteps; j++) {
                    const randomShock = this.standardNormalRandom();
                    currentPrice *= Math.exp(drift + diffusion * randomShock);
                    path.push(currentPrice);
                }
                paths.push(path);
                finalPrices.push(currentPrice);
            }

            return { paths, finalPrices };
        }
        
        private standardNormalRandom(): number {
            let u = 0, v = 0;
            while(u === 0) u = Math.random();
            while(v === 0) v = Math.random();
            return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        }

        private analyzePrincipalProtectedNote(instrument: ICustomInstrument): IAIAnalysisResult {
            const assetId = instrument.blueprint.underlyingAssets[0];
            const assetData = this.marketDataService.getAssetData(assetId);
            const riskFreeRate = this.marketDataService.getRiskFreeRate();
            
            const participationRate = instrument.customParameters.participationRate;
            const cap = instrument.customParameters.cap;

            const sim = this.runMonteCarloSimulation(assetData.price, instrument.termInYears, riskFreeRate, assetData.volatility, assetData.dividendYield);
            
            const payoffs = sim.finalPrices.map(finalPrice => {
                const assetReturn = (finalPrice / assetData.price) - 1;
                const cappedReturn = Math.min(assetReturn, cap);
                const optionPayoff = instrument.principal * participationRate * Math.max(0, cappedReturn);
                return instrument.principal + optionPayoff;
            });

            return this.compileAnalysisFromPayoffs(instrument, payoffs, sim.paths);
        }

        private analyzeReverseConvertibleNote(instrument: ICustomInstrument): IAIAnalysisResult {
            const assetId = instrument.blueprint.underlyingAssets[0];
            const assetData = this.marketDataService.getAssetData(assetId);
            const riskFreeRate = this.marketDataService.getRiskFreeRate();
            
            const couponRate = instrument.customParameters.couponRate;
            const knockInBarrier = instrument.customParameters.knockInBarrier * assetData.price;
            
            const totalCouponValue = instrument.principal * couponRate * instrument.termInYears;

            const sim = this.runMonteCarloSimulation(assetData.price, instrument.termInYears, riskFreeRate, assetData.volatility, assetData.dividendYield);

            const payoffs = sim.finalPrices.map(finalPrice => {
                let finalPrincipal;
                if (finalPrice < knockInBarrier) {
                    finalPrincipal = instrument.principal * (finalPrice / assetData.price);
                } else {
                    finalPrincipal = instrument.principal;
                }
                return finalPrincipal + totalCouponValue;
            });

            return this.compileAnalysisFromPayoffs(instrument, payoffs, sim.paths);
        }
        
        private analyzeDeFiLending(instrument: ICustomInstrument): IAIAnalysisResult {
            const avgAPY = 0.05;
            const apyVolatility = 0.5;
            
            const sim = this.runMonteCarloSimulation(avgAPY, instrument.termInYears, 0, apyVolatility, 0, 5000);
            
            const payoffs = sim.paths.map(path => {
                let value = instrument.principal;
                const dailyRatePath = path.map(apy => apy / 365);
                for(const rate of dailyRatePath) {
                    value *= (1 + Math.max(0, rate));
                }
                return value;
            });
            
            const analysis = this.compileAnalysisFromPayoffs(instrument, payoffs);
            
            analysis.risk.summary = "Primary risks are smart contract vulnerabilities, oracle failures, and extreme APY volatility. Principal is not guaranteed and can be lost in a protocol failure. Low market risk for stablecoins.";
            analysis.suitability.warnings.push("DeFi protocols are experimental technology. Do not invest more than you can afford to lose.");
            analysis.complianceChecks.mifidII = "N/A";
            analysis.suitability.ethicalConsiderations = "Funds may be used to lend to anonymous entities for purposes that may not align with the investor's values, including leveraged trading.";
            
            return analysis;
        }
        
        private analyzeCatastropheBond(instrument: ICustomInstrument): IAIAnalysisResult {
            // This is not based on market simulation, but on event probability.
            const annualEventProbability = 0.02; // 2% chance of a triggering event per year
            const probabilityOfNoEvent = Math.pow(1 - annualEventProbability, instrument.termInYears);
            
            const coupon = instrument.customParameters.couponRate;
            const totalReturnIfNoEvent = instrument.principal * Math.pow(1 + coupon, instrument.termInYears);
            const totalReturnIfEvent = 0; // Total loss of principal

            // Simulate based on event probability
            const numSimulations = 10000;
            const payoffs = Array.from({ length: numSimulations }).map(() => {
                return Math.random() < probabilityOfNoEvent ? totalReturnIfNoEvent : totalReturnIfEvent;
            });

            const analysis = this.compileAnalysisFromPayoffs(instrument, payoffs);
            analysis.risk.summary = "This is a binary risk instrument. The primary risk is the total loss of principal if a specified catastrophic event occurs. It has no market correlation, which can be a diversification benefit.";
            analysis.suitability.warnings.push("This instrument can result in 100% loss of capital. It is suitable only for sophisticated investors.");
            analysis.suitability.ethicalConsiderations = "While providing necessary capital to the insurance industry, this instrument profits from the absence of major natural disasters that cause human suffering.";
            return analysis;
        }

        private analyzeSocialImpactBond(instrument: ICustomInstrument): IAIAnalysisResult {
            // Analysis based on the probability of meeting the social KPI.
            const probabilityOfSuccess = 0.70; // Assume a 70% chance the social program succeeds
            const { successReturn, lossShare } = instrument.customParameters;
            
            const returnIfSuccess = instrument.principal * Math.pow(1 + successReturn, instrument.termInYears);
            const returnIfFailure = instrument.principal * (1 - lossShare);

            const numSimulations = 10000;
            const payoffs = Array.from({ length: numSimulations }).map(() => {
                return Math.random() < probabilityOfSuccess ? returnIfSuccess : returnIfFailure;
            });

            const analysis = this.compileAnalysisFromPayoffs(instrument, payoffs);
            analysis.risk.summary = `The risk is tied to the performance of a social program, not financial markets. There is a ${(100 * (1 - probabilityOfSuccess)).toFixed(0)}% chance of losing ${(lossShare * 100).toFixed(0)}% of the principal.`;
            analysis.suitability.ethicalConsiderations = "This instrument directly funds a positive social outcome. Investors should ensure the program's methodology and KPIs are robust and genuinely beneficial to the target community.";
            return analysis;
        }

        private compileAnalysisFromPayoffs(instrument: ICustomInstrument, payoffs: number[], paths?: number[][]): IAIAnalysisResult {
            const n = payoffs.length;
            const returns = payoffs.map(p => (p / instrument.principal) - 1);
            const totalReturn = returns.reduce((sum, r) => sum + r, 0) / n;
            const expectedAnnualReturn = Math.pow(1 + totalReturn, 1 / instrument.termInYears) - 1;
            
            const riskFreeRate = this.marketDataService.getRiskFreeRate();
            const excessReturns = returns.map(r => r - (Math.pow(1 + riskFreeRate, instrument.termInYears) - 1));
            const stdDev = Math.sqrt(excessReturns.reduce((sum, r) => sum + Math.pow(r - totalReturn, 2), 0) / (n - 1));
            const annualVolatility = stdDev / Math.sqrt(instrument.termInYears);
            
            const sharpeRatio = annualVolatility > 0 ? (expectedAnnualReturn - riskFreeRate) / annualVolatility : Infinity;

            const downsideReturns = returns.filter(r => r < totalReturn);
            const downsideDeviation = Math.sqrt(downsideReturns.reduce((sum, r) => sum + Math.pow(r - totalReturn, 2), 0) / n);
            const annualDownsideDeviation = downsideDeviation / Math.sqrt(instrument.termInYears);
            const sortinoRatio = annualDownsideDeviation > 0 ? (expectedAnnualReturn - riskFreeRate) / annualDownsideDeviation : Infinity;

            const sortedReturns = [...returns].sort((a, b) => a - b);
            const varIndex = Math.floor(0.05 * n);
            const valueAtRisk95 = -sortedReturns[varIndex] * instrument.principal;
            const expectedShortfall95 = -sortedReturns.slice(0, varIndex).reduce((a, b) => a + b, 0) / varIndex * instrument.principal;
            
            const bestCaseScenario = Math.max(...payoffs);
            const worstCaseScenario = Math.min(...payoffs);
            
            const mean = totalReturn;
            const m3 = returns.reduce((sum, r) => sum + Math.pow(r - mean, 3), 0) / n;
            const skewness = m3 / Math.pow(stdDev, 3);

            const suitabilityScore = this.calculateSuitabilityScore(instrument, expectedAnnualReturn, annualVolatility);

            const minPayoff = Math.min(...payoffs);
            const maxPayoff = Math.max(...payoffs);
            const numBins = 20;
            const binWidth = (maxPayoff - minPayoff) / numBins || 1;
            const bins = Array(numBins).fill(0);
            for (const p of payoffs) {
                const binIndex = Math.min(numBins - 1, Math.floor((p - minPayoff) / binWidth));
                bins[binIndex]++;
            }
            const payoffDistribution = bins.map((count, i) => ({
                value: minPayoff + i * binWidth,
                probability: count / n
            }));

            return {
                timestamp: new Date(),
                risk: {
                    summary: this.getRiskSummary(annualVolatility, valueAtRisk95, instrument.principal),
                    valueAtRisk95,
                    expectedShortfall95,
                    volatility: annualVolatility,
                    sensitivityAnalysis: {},
                    downsideDeviation: annualDownsideDeviation,
                },
                reward: {
                    summary: this.getRewardSummary(expectedAnnualReturn, bestCaseScenario, instrument.principal),
                    expectedReturn: expectedAnnualReturn,
                    sharpeRatio,
                    sortinoRatio,
                    bestCaseScenario,
                    worstCaseScenario,
                    returnDistributionSkewness: skewness,
                },
                suitability: {
                    summary: `With a score of ${suitabilityScore.toFixed(0)}/100, this instrument is ${suitabilityScore > 70 ? "highly suitable" : suitabilityScore > 40 ? "moderately suitable" : "potentially unsuitable"} for a ${instrument.riskProfile.toLowerCase()} investor.`,
                    score: suitabilityScore,
                    warnings: suitabilityScore < 50 ? ["High risk/reward mismatch for stated profile."] : [],
                    ethicalConsiderations: "This instrument has no specific ethical flags based on its structure, but investors should consider the activities of the underlying asset issuers."
                },
                complianceChecks: { mifidII: "Pass", doddFrank: "Pass", localRegs: "Pass", regulatoryRedFlags: [] },
                simulationData: {
                    payoffDistribution,
                    monteCarloPaths: paths?.slice(0, 50)
                },
                aiNarrative: "", // To be filled in later
            };
        }
        
        private getRiskSummary(volatility: number, vaR: number, principal: number): string {
            if (volatility < 0.05) {
                return `Extremely low risk. The 95% Value-at-Risk is $${vaR.toFixed(2)}, indicating a 5% chance of losing more than this amount. Volatility is very low.`;
            } else if (volatility < 0.15) {
                return `Low to moderate risk. The 95% Value-at-Risk is $${vaR.toFixed(2)}. The instrument exhibits some sensitivity to market movements but has protective features.`;
            } else if (volatility < 0.30) {
                 return `Significant risk. The 95% Value-at-Risk is $${vaR.toFixed(2)}. Principal is exposed to considerable market fluctuations.`;
            } else {
                return `High risk. The 95% Value-at-Risk is $${vaR.toFixed(2)}. This is a speculative instrument with a high probability of significant loss.`;
            }
        }
        
        private getRewardSummary(expectedReturn: number, bestCase: number, principal: number): string {
            const bestCasePct = (bestCase/principal - 1) * 100;
             if (expectedReturn < 0.04) {
                return `Conservative reward potential. Expected annual return is ${(expectedReturn*100).toFixed(2)}%. The best-case scenario could yield a ${bestCasePct.toFixed(2)}% total return.`;
            } else if (expectedReturn < 0.10) {
                return `Moderate reward potential. Expected annual return is ${(expectedReturn*100).toFixed(2)}%, with a best-case scenario return of ${bestCasePct.toFixed(2)}%.`;
            } else {
                return `High reward potential. Expected annual return is ${(expectedReturn*100).toFixed(2)}%. This comes with significant risk, but the best-case scenario could yield a substantial ${bestCasePct.toFixed(2)}% return.`;
            }
        }

        private calculateSuitabilityScore(instrument: ICustomInstrument, expectedReturn: number, volatility: number): number {
            let score = 50;
            const profile = instrument.riskProfile;

            if (profile === "Conservative") {
                if (volatility < 0.05) score += 40;
                else if (volatility > 0.15) score -= 40;
                if (instrument.blueprint.id.startsWith('ppn')) score += 20;
            } else if (profile === "Moderate") {
                if (volatility > 0.08 && volatility < 0.20) score += 30;
                else score -= 20;
            } else if (profile === "Aggressive") {
                if (volatility > 0.20) score += 30;
                else if (volatility < 0.10) score -= 30;
                 if (expectedReturn > 0.10) score += 15;
            } else if (profile === "Speculative") {
                if (volatility > 0.40) score += 40;
                 if (expectedReturn > 0.15) score += 20;
            }

            return Math.max(0, Math.min(100, score));
        }

        private runStressTests(instrument: ICustomInstrument, baseAnalysis: IAIAnalysisResult): IStressTestResult[] {
            // Simplified stress tests. A real system would re-run simulations with modified parameters.
            const { volatility } = baseAnalysis.risk;
            const { expectedReturn } = baseAnalysis.reward;

            return [
                {
                    scenario: "Market Crash (-30%)",
                    description: "Simulates a sharp, sudden market downturn affecting the underlying asset.",
                    impactOnValue: -0.30 * volatility / 0.20, // Naive scaling with SPX vol
                    narrative: "In a severe market crash, this instrument's value is expected to decline significantly, though protective features may cushion some of the blow."
                },
                {
                    scenario: "Interest Rate Shock (+3%)",
                    description: "Simulates a rapid increase in the risk-free interest rate by 300 basis points.",
                    impactOnValue: -0.05 * instrument.termInYears, // Naive duration estimate
                    narrative: "A sharp rise in rates would decrease the present value of future cash flows, negatively impacting the instrument's valuation."
                },
                {
                    scenario: "Volatility Spike (+50%)",
                    description: "Simulates a major increase in market volatility.",
                    impactOnValue: (instrument.blueprint.id.startsWith('rcn') ? -0.15 : 0.05), // Options become more valuable, but short options lose value
                    narrative: "Increased volatility can have mixed effects. For instruments with embedded long options it can be beneficial, but for those with short option exposure it significantly increases risk."
                }
            ];
        }

        private generateAINarrative(instrument: ICustomInstrument, analysis: IAIAnalysisResult): string {
            // Simulates a call to a large language model like GPT-4 or Gemini.
            const { risk, reward, suitability } = analysis;
            const intro = `Hello! I've completed my analysis of the "${instrument.blueprint.name}" you've designed with a principal of $${instrument.principal.toLocaleString()}. Here is my assessment based on your '${instrument.riskProfile}' profile.`;
            
            const rewardSection = `Looking at the potential upside, I project an expected annual return of ${(reward.expectedReturn * 100).toFixed(2)}%. In an optimistic scenario, the instrument could mature at a value of $${reward.bestCaseScenario.toLocaleString(undefined, {maximumFractionDigits: 0})}, while a pessimistic outcome could see it fall to $${reward.worstCaseScenario.toLocaleString(undefined, {maximumFractionDigits: 0})}. The Sharpe Ratio of ${reward.sharpeRatio.toFixed(2)} suggests a ${reward.sharpeRatio > 1 ? 'strong' : reward.sharpeRatio > 0.5 ? 'reasonable' : 'poor'} risk-adjusted return compared to a risk-free asset.`;
            
            const riskSection = `On the risk side, the annualized volatility is ${(risk.volatility * 100).toFixed(1)}%. More tangibly, our Value-at-Risk (VaR) model indicates there is a 5% chance you could lose at least $${risk.valueAtRisk95.toLocaleString(undefined, {maximumFractionDigits: 0})} over the instrument's term. In those worst-case scenarios, the average loss could be as high as $${risk.expectedShortfall95.toLocaleString(undefined, {maximumFractionDigits: 0})}. ${risk.summary}`;
            
            const suitabilitySection = `Based on these factors, I've calculated a suitability score of ${suitability.score.toFixed(0)} out of 100 for your profile. ${suitability.summary}. ${suitability.warnings.join(' ')}`;
            
            const conclusion = `In conclusion, this instrument offers ${reward.summary.toLowerCase().replace(' potential.', '')} potential but comes with ${risk.summary.toLowerCase().replace(' risk.', '')} risk. Please review the detailed charts and stress tests before making a final decision.`;
            
            return `${intro}\n\n${rewardSection}\n\n${riskSection}\n\n${suitabilitySection}\n\n${conclusion}`;
        }
        
        public backtestStrategy(instrument: ICustomInstrument): IBacktestResult {
            const years = 5;
            const assetId = instrument.blueprint.underlyingAssets[0];
            if (!assetId) {
                 return {
                    period: { start: new Date(), end: new Date() },
                    strategyReturns: 0, benchmarkReturns: 0, maxDrawdown: 0, annualisedSharpeRatio: 0,
                    summary: "Backtesting not applicable for this instrument."
                };
            }
            const histData = this.marketDataService.getHistoricalData(assetId, years);
            const benchmarkData = this.marketDataService.getHistoricalData("SPX", years);

            const initialAssetPrice = histData[0];
            const finalAssetPrice = histData[histData.length - 1];
            const initialBenchmarkPrice = benchmarkData[0];
            const finalBenchmarkPrice = benchmarkData[benchmarkData.length - 1];

            const assetReturn = (finalAssetPrice / initialAssetPrice) - 1;
            const benchmarkReturn = (finalBenchmarkPrice / initialBenchmarkPrice) - 1;
            
            let strategyReturn = 0;
            if (instrument.blueprint.id.startsWith('ppn')) {
                 const participationRate = instrument.customParameters.participationRate;
                 const cap = instrument.customParameters.cap;
                 strategyReturn = participationRate * Math.min(cap, Math.max(0, assetReturn));
            } else if (instrument.blueprint.id.startsWith('rcn')) {
                 const coupon = instrument.customParameters.couponRate * instrument.termInYears;
                 const knockInBarrier = instrument.customParameters.knockInBarrier;
                 if ((finalAssetPrice / initialAssetPrice) < knockInBarrier) {
                     strategyReturn = (finalAssetPrice / initialAssetPrice) - 1 + coupon;
                 } else {
                     strategyReturn = coupon;
                 }
            }
            
            return {
                period: { start: new Date(new Date().setFullYear(new Date().getFullYear() - years)), end: new Date() },
                strategyReturns: strategyReturn,
                benchmarkReturns: benchmarkReturn,
                maxDrawdown: 0.1, // Mocked
                annualisedSharpeRatio: 0.8, // Mocked
                summary: `Over the last ${years} years, this strategy would have returned ${(strategyReturn*100).toFixed(2)}%, compared to the benchmark's ${(benchmarkReturn*100).toFixed(2)}%.`
            };
        }
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // SECTION 4: REACT UI COMPONENTS (Using React.createElement for consistency)
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const e = React.createElement;

    /**
     * @component FinancialInstrumentForgeView
     * @description The primary functional component for the application, using React Hooks.
     */
    export const FinancialInstrumentForgeView: React.FC<IFinancialInstrumentForgeViewProps> = (props) => {
        const { blueprintService, engineerAI, logger, defaultInvestorId } = props;

        const [blueprints] = React.useState<IProductBlueprint[]>(() => blueprintService.getBlueprints());
        const [selectedBlueprintId, setSelectedBlueprintId] = React.useState<string | null>(blueprints[0]?.id || null);
        const [instrument, setInstrument] = React.useState<ICustomInstrument | null>(null);
        const [analysis, setAnalysis] = React.useState<IAIAnalysisResult | null>(null);
        const [isLoading, setIsLoading] = React.useState<boolean>(false);
        const [error, setError] = React.useState<string | null>(null);

        const selectedBlueprint = React.useMemo(() => {
            return blueprints.find(b => b.id === selectedBlueprintId) || null;
        }, [selectedBlueprintId, blueprints]);

        React.useEffect(() => {
            if (selectedBlueprint) {
                const defaultCustomParams: Record<string, any> = {};
                selectedBlueprint.configurableParameters.forEach(p => {
                    defaultCustomParams[p.key] = p.defaultValue;
                });

                setInstrument({
                    instanceId: `inst_${Date.now()}`,
                    blueprint: selectedBlueprint,
                    principal: 100000,
                    termInYears: 5,
                    riskProfile: 'Moderate',
                    customParameters: defaultCustomParams,
                    investorId: defaultInvestorId,
                    creationDate: new Date(),
                    status: 'Draft',
                });
                setAnalysis(null);
            }
        }, [selectedBlueprint, defaultInvestorId]);

        const handleParameterChange = React.useCallback((key: string, value: any) => {
            if (!instrument) return;

            const paramDef = instrument.blueprint.configurableParameters.find(p => p.key === key);
            let parsedValue = value;
            if (paramDef?.type === 'number' || paramDef?.type === 'percentage' || paramDef?.type === 'currency') {
                parsedValue = parseFloat(value);
                if (isNaN(parsedValue)) parsedValue = 0;
            }

            setInstrument(prev => prev ? ({
                ...prev,
                customParameters: { ...prev.customParameters, [key]: parsedValue },
                status: 'Draft'
            }) : null);
            setAnalysis(null);
        }, [instrument]);
        
        const handleCoreParamChange = React.useCallback((key: 'principal' | 'termInYears' | 'riskProfile', value: any) => {
            if (!instrument) return;
             setInstrument(prev => prev ? ({ ...prev, [key]: value, status: 'Draft' }) : null);
             setAnalysis(null);
        }, [instrument]);

        const handleAnalyzeClick = React.useCallback(() => {
            if (!instrument) return;
            logger.log('INFO', 'User initiated analysis.', { instanceId: instrument.instanceId });
            setIsLoading(true);
            setError(null);
            
            setTimeout(() => {
                try {
                    const result = engineerAI.analyzeInstrument(instrument);
                    setAnalysis(result);
                    setInstrument(prev => prev ? ({ ...prev, status: 'Analyzed' }) : null);
                } catch (e) {
                    const err = e as Error;
                    logger.log('ERROR', 'Analysis UI caught an error.', { error: err.message });
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }, 1500);
        }, [instrument, engineerAI, logger]);

        const handleMintClick = React.useCallback(() => {
            if (instrument?.status !== 'Analyzed') {
                alert("Please analyze the instrument before minting.");
                return;
            }
            logger.log('INFO', 'User initiated minting process.', { instanceId: instrument.instanceId });
            alert(`Minting instrument ${instrument.instanceId} for $${instrument.principal}. This is a simulation.`);
            setInstrument(prev => prev ? ({ ...prev, status: 'Minted' }) : null);
        }, [instrument, logger]);


        return e('div', { className: 'forge-container' },
            e('h1', { className: 'forge-title' }, 'The Financial Instrument Forge'),
            e('div', { className: 'forge-main-layout' },
                e('div', { className: 'forge-left-panel' },
                    e(BlueprintSelector, { blueprints, selectedId: selectedBlueprintId, onSelect: setSelectedBlueprintId }),
                    instrument && e(ParameterWorkbench, { instrument, onCoreChange: handleCoreParamChange, onCustomChange: handleParameterChange })
                ),
                e('div', { className: 'forge-right-panel' },
                    e(AnalysisDashboard, { analysis, isLoading, error, instrument }),
                    e(MintingConsole, {
                        instrumentStatus: instrument?.status || 'Draft',
                        onAnalyze: handleAnalyzeClick,
                        onMint: handleMintClick,
                        isLoading
                    })
                )
            )
        );
    };
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // SECTION 4A: DETAILED UI SUB-COMPONENTS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    export const AnalysisDashboard: React.FC<{
        analysis: IAIAnalysisResult | null;
        isLoading: boolean;
        error: string | null;
        instrument: ICustomInstrument | null;
    }> = ({ analysis, isLoading, error, instrument }) => {
        if (isLoading) {
            return e('div', { className: 'widget analysis-dashboard loading' },
                e('div', { className: 'spinner' }),
                e('h3', null, 'AI Engineer is Analyzing...'),
                e('p', null, 'Running thousands of simulations to assess risk and reward.')
            );
        }
        if (error) {
            return e('div', { className: 'widget analysis-dashboard error' }, e('h3', null, 'Analysis Error'), e('p', null, error));
        }
        if (!analysis) {
            return e('div', { className: 'widget analysis-dashboard placeholder' }, 
                e('h3', { className: 'widget-title' }, "3. AI Analysis & Minting"),
                e('p', null, "Configure your instrument and click 'Analyze' to see the AI's assessment.")
            );
        }
        
        return e('div', { className: 'widget analysis-dashboard' },
            e('h2', { className: 'widget-title' }, "3. AI Analysis Results"),
            e('div', { className: 'dashboard-grid' },
                e(AINarrativeView, { narrative: analysis.aiNarrative }),
                e(SuitabilityGauge, { score: analysis.suitability.score, profile: instrument?.riskProfile || 'Moderate' }),
                e(KeyMetrics, { analysis }),
                e(PayoffDistributionChart, { data: analysis.simulationData?.payoffDistribution || [], principal: instrument?.principal || 0 }),
                e(StressTestResults, { results: analysis.stressTestResults || [] }),
                e(BacktestChart, { result: analysis.backtestResult })
            )
        );
    };

    const AINarrativeView: React.FC<{ narrative: string }> = ({ narrative }) => {
        return e('div', { className: 'grid-item-full-width narrative-view' },
            e('h3', { className: 'widget-subtitle' }, 'AI Narrative Summary'),
            e('p', { className: 'narrative-text' }, narrative)
        );
    };
    
    const SuitabilityGauge: React.FC<{ score: number; profile: string }> = ({ score, profile }) => {
        const rotation = (score / 100) * 180 - 90;
        const color = score > 70 ? '#28a745' : score > 40 ? '#ffc107' : '#dc3545';
        return e('div', { className: 'grid-item gauge-container' },
            e('h3', { className: 'widget-subtitle' }, 'Suitability Score'),
            e('div', { className: 'gauge' },
                e('div', { className: 'gauge-arc' }),
                e('div', { className: 'gauge-needle', style: { transform: `rotate(${rotation}deg)` } }),
                e('div', { className: 'gauge-center' }),
                e('div', { className: 'gauge-value', style: { color } }, score.toFixed(0)),
            ),
            e('p', { className: 'gauge-label' }, `For ${profile} Profile`)
        );
    };
    
    const KeyMetrics: React.FC<{ analysis: IAIAnalysisResult }> = ({ analysis }) => {
        const { risk, reward } = analysis;
        const metrics = [
            { label: "Expected Annual Return", value: `${(reward.expectedReturn * 100).toFixed(2)}%`, positive: true },
            { label: "Annual Volatility", value: `${(risk.volatility * 100).toFixed(2)}%`, positive: false },
            { label: "Sharpe Ratio", value: reward.sharpeRatio.toFixed(2), positive: reward.sharpeRatio > 1 },
            { label: "95% Value at Risk (VaR)", value: `$${risk.valueAtRisk95.toLocaleString(undefined, {maximumFractionDigits:0})}`, positive: false },
        ];
        return e('div', { className: 'grid-item metrics-container' },
            e('h3', { className: 'widget-subtitle' }, 'Key Metrics'),
            e('div', { className: 'metrics-grid' }, 
                ...metrics.map(m => e('div', { key: m.label, className: 'metric-item' },
                    e('div', { className: 'metric-label' }, m.label),
                    e('div', { className: `metric-value ${m.positive ? 'positive' : 'negative'}` }, m.value)
                ))
            )
        );
    };

    const PayoffDistributionChart: React.FC<{ data: Array<{ value: number, probability: number }>, principal: number }> = ({ data, principal }) => {
        if (!data.length) return null;
        const maxProb = Math.max(...data.map(d => d.probability));
        return e('div', { className: 'grid-item-full-width chart-container' },
            e('h3', { className: 'widget-subtitle' }, 'Simulated Payoff Distribution'),
            e('div', { className: 'chart' },
                data.map((d, i) => e('div', { key: i, className: 'bar-wrapper' },
                    e('div', { className: `bar ${d.value < principal ? 'loss' : 'gain'}`, style: { height: `${(d.probability / maxProb) * 100}%` }, title: `Payoff: $${d.value.toFixed(0)}, Prob: ${(d.probability*100).toFixed(1)}%` })
                ))
            )
        );
    };
    
    const StressTestResults: React.FC<{ results: IStressTestResult[] }> = ({ results }) => {
        return e('div', { className: 'grid-item' },
            e('h3', { className: 'widget-subtitle' }, 'Stress Tests'),
            e('table', { className: 'stress-test-table' },
                e('thead', null, e('tr', null, e('th', null, 'Scenario'), e('th', null, 'Impact'))),
                e('tbody', null, ...results.map(r => e('tr', { key: r.scenario, title: r.narrative },
                    e('td', null, r.scenario),
                    e('td', { className: r.impactOnValue >= 0 ? 'positive' : 'negative' }, `${(r.impactOnValue * 100).toFixed(1)}%`)
                )))
            )
        );
    };
    
    const BacktestChart: React.FC<{ result?: IBacktestResult }> = ({ result }) => {
        if (!result) return null;
        return e('div', { className: 'grid-item' },
            e('h3', { className: 'widget-subtitle' }, '5-Year Backtest'),
            e('div', { className: 'backtest-summary' },
                e('div', { className: 'backtest-metric' },
                    e('span', { className: 'metric-label' }, 'Strategy Return'),
                    e('span', { className: `metric-value ${result.strategyReturns > result.benchmarkReturns ? 'positive' : 'negative'}` }, `${(result.strategyReturns*100).toFixed(2)}%`)
                ),
                e('div', { className: 'backtest-metric' },
                    e('span', { className: 'metric-label' }, 'S&P 500 Benchmark'),
                    e('span', { className: 'metric-value' }, `${(result.benchmarkReturns*100).toFixed(2)}%`)
                ),
            ),
             e('p', { className: 'backtest-narrative' }, result.summary)
        );
    };


    export interface IFinancialInstrumentForgeViewProps {
        blueprintService: BlueprintService;
        engineerAI: TheFinancialEngineerAI;
        logger: LoggerService;
        defaultInvestorId: string;
    }

    export const BlueprintSelector: React.FC<{
        blueprints: IProductBlueprint[];
        selectedId: string | null;
        onSelect: (id: string) => void;
    }> = ({ blueprints, selectedId, onSelect }) => {
        const categories = [...new Set(blueprints.map(b => b.productClass))];
        
        return e('div', { className: 'widget blueprint-selector' },
            e('h2', { className: 'widget-title' }, '1. Select Blueprint'),
            categories.map(category => e('div', { key: category, className: 'category-group' },
                e('h3', { className: 'category-title' }, category),
                blueprints.filter(b => b.productClass === category).map(blueprint => 
                    e('div', {
                        key: blueprint.id,
                        className: `blueprint-item ${selectedId === blueprint.id ? 'selected' : ''}`,
                        onClick: () => onSelect(blueprint.id),
                    },
                        e('div', { className: 'blueprint-item-name' }, blueprint.name),
                        e('div', { className: 'blueprint-item-desc' }, blueprint.description)
                    )
                )
            ))
        );
    };

    export const ParameterWorkbench: React.FC<{
        instrument: ICustomInstrument;
        onCoreChange: (key: 'principal' | 'termInYears' | 'riskProfile', value: any) => void;
        onCustomChange: (key: string, value: any) => void;
    }> = ({ instrument, onCoreChange, onCustomChange }) => {
        const renderInputField = (param: IParameterDefinition) => {
            const id = `param-${param.key}`;
            const value = instrument.customParameters[param.key];
            const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onCustomChange(param.key, e.target.value);
            
            let inputElement;
            switch(param.type) {
                case 'select':
                    inputElement = e('select', { id, value, onChange, className: 'param-input' },
                        param.validationRules?.options?.map(opt =>
                            e('option', { key: opt.value, value: opt.value }, opt.label)
                        )
                    );
                    break;
                case 'textarea':
                    inputElement = e('textarea', { id, value, onChange, className: 'param-input', rows: 3 });
                    break;
                default:
                    inputElement = e('input', { id, value, onChange, className: 'param-input', type: 'number', step: param.type === 'percentage' ? 0.01 : 1 });
            }

            return e('div', { key: param.key, className: 'param-field' },
                e('label', { htmlFor: id, className: 'param-label', title: param.description }, param.label),
                inputElement
            );
        };
        
        const coreParams = [
            { key: 'principal', label: 'Principal Amount', type: 'number', value: instrument.principal },
            { key: 'termInYears', label: 'Term (Years)', type: 'number', value: instrument.termInYears },
            { key: 'riskProfile', label: 'Investor Risk Profile', type: 'select', value: instrument.riskProfile, options: ['Conservative', 'Moderate', 'Aggressive', 'Speculative'] },
        ];

        return e('div', { className: 'widget parameter-workbench' },
            e('h2', { className: 'widget-title' }, '2. Configure Instrument'),
            e('h3', { className: 'category-title' }, 'Core Parameters'),
            ...coreParams.map(p => e('div', { key: p.key, className: 'param-field' },
                e('label', { htmlFor: `core-${p.key}`, className: 'param-label' }, p.label),
                p.type === 'select'
                    ? e('select', { id: `core-${p.key}`, value: p.value, onChange: (e) => onCoreChange(p.key as any, e.target.value), className: 'param-input' },
                        p.options?.map(o => e('option', { key: o, value: o }, o))
                      )
                    : e('input', { id: `core-${p.key}`, type: 'number', value: p.value, onChange: (e) => onCoreChange(p.key as any, Number(e.target.value) || 0), className: 'param-input' })
            )),
            e('h3', { className: 'category-title' }, 'Blueprint-Specific Parameters'),
            ...instrument.blueprint.configurableParameters.map(renderInputField)
        );
    };

    const MintingConsole: React.FC<{
        instrumentStatus: ICustomInstrument['status'];
        onAnalyze: () => void;
        onMint: () => void;
        isLoading: boolean;
    }> = ({ instrumentStatus, onAnalyze, onMint, isLoading }) => {
        return e('div', { className: 'minting-console' },
            e('button', {
                className: 'forge-button analyze',
                onClick: onAnalyze,
                disabled: isLoading || ['Analyzed', 'Minted'].includes(instrumentStatus)
            }, 'Analyze Instrument'),
            e('button', {
                className: 'forge-button mint',
                onClick: onMint,
                disabled: isLoading || instrumentStatus !== 'Analyzed'
            }, 'Mint Instrument')
        );
    };

}
```
        ---