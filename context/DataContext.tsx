// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-demai-jocalll3 | PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/context/DataContext.tsx
================================================================================

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Transaction, Asset, BudgetCategory, GamificationState, IllusionType, LinkedAccount, QuantumWeaverState, AIPlan, AIQuestion, Subscription, CreditScore, UpcomingBill, SavingsGoal, MarketMover, MarketplaceProduct, FinancialGoal, AIGoalPlan, CryptoAsset, VirtualCard, PaymentOperation, AIInsight, CorporateCard, CorporateTransaction, RewardPoints, Notification, NFTAsset, RewardItem, APIStatus, CreditFactor, CorporateCardControls, Counterparty } from '../types';
import { View, WeaverStage } from '../types';
import { MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_IMPACT_INVESTMENTS, MOCK_BUDGETS, MOCK_SUBSCRIPTIONS, MOCK_CREDIT_SCORE, MOCK_UPCOMING_BILLS, MOCK_SAVINGS_GOALS, MOCK_MARKET_MOVERS, MOCK_FINANCIAL_GOALS, MOCK_CRYPTO_ASSETS, MOCK_PAYMENT_OPERATIONS, MOCK_CORPORATE_CARDS, MOCK_CORPORATE_TRANSACTIONS, MOCK_REWARD_POINTS, MOCK_NOTIFICATIONS, MOCK_REWARD_ITEMS, MOCK_API_STATUS, MOCK_CREDIT_FACTORS, MOCK_COUNTERPARTIES } from '../data/mockData';

const LEVEL_NAMES = ["Financial Novice", "Budgeting Apprentice", "Savings Specialist", "Investment Adept", "Wealth Master"];
const SCORE_PER_LEVEL = 200;

interface WalletInfo {
    address: string;
    balance: number; // ETH for simplicity
}

interface IDataContext {
  transactions: Transaction[];
  assets: Asset[];
  impactInvestments: Asset[];
  budgets: BudgetCategory[];
  addBudget: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => void;
  gamification: GamificationState;
  impactData: {
    treesPlanted: number;
    spendingForNextTree: number;
    progressToNextTree: number;
  };
  customBackgroundUrl: string | null;
  setCustomBackgroundUrl: (url: string) => void;
  addTransaction: (tx: Transaction) => void;
  activeIllusion: IllusionType;
  setActiveIllusion: (illusion: IllusionType) => void;
  linkedAccounts: LinkedAccount[];
  unlinkAccount: (id: string) => void;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  weaverState: QuantumWeaverState;
  pitchBusinessPlan: (plan: string) => Promise<void>;
  simulateTestPass: () => Promise<void>;
  subscriptions: Subscription[];
  creditScore: CreditScore;
  upcomingBills: UpcomingBill[];
  savingsGoals: SavingsGoal[];
  marketMovers: MarketMover[];
  financialGoals: FinancialGoal[];
  addFinancialGoal: (goalData: Omit<FinancialGoal, 'id' | 'plan' | 'currentAmount'>) => void;
  contributeToGoal: (goalId: string, amount: number) => void;
  generateGoalPlan: (goalId: string) => Promise<void>;
  cryptoAssets: CryptoAsset[];
  paymentOperations: PaymentOperation[];
  walletInfo: WalletInfo | null;
  virtualCard: VirtualCard | null;
  connectWallet: () => void;
  issueCard: () => void;
  buyCrypto: (usdAmount: number, cryptoTicker: string) => void;
  aiInsights: AIInsight[];
  isInsightsLoading: boolean;
  corporateCards: CorporateCard[];
  corporateTransactions: CorporateTransaction[];
  toggleCorporateCardFreeze: (cardId: string) => void;
  updateCorporateCard: (cardId: string, newControls: CorporateCardControls, newFrozenState: boolean) => void;
  rewardPoints: RewardPoints;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  isImportingData: boolean;
  nftAssets: NFTAsset[];
  mintNFT: (name: string, imageUrl: string) => void;
  mintToken: (name: string, ticker: string, amount: number) => void;
  initiatePayment: (details: Omit<PaymentOperation, 'id' | 'status' | 'date'>) => void;
  rewardItems: RewardItem[];
  redeemReward: (item: RewardItem) => boolean;
  apiStatus: APIStatus[];
  creditFactors: CreditFactor[];
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string) => void;
  modernTreasuryApiKey: string | null;
  setModernTreasuryApiKey: (key: string) => void;
  modernTreasuryOrganizationId: string | null;
  setModernTreasuryOrganizationId: (id: string) => void;
  counterparties: Counterparty[];
  addCounterparty: (data: { name: string, email: string, accountNumber: string, routingNumber: string }) => Promise<void>;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const COST_PER_TREE = 250;

  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [assets] = useState<Asset[]>(MOCK_ASSETS);
  const [impactInvestments] = useState<Asset[]>(MOCK_IMPACT_INVESTMENTS);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(MOCK_BUDGETS);
  const [treesPlanted, setTreesPlanted] = useState<number>(12);
  const [spendingForNextTree, setSpendingForNextTree] = useState<number>(170);
  const [gamification, setGamification] = useState<GamificationState>({
      score: 450,
      level: 3,
      levelName: "Savings Specialist",
      progress: 25,
      credits: 225,
  });
  const [customBackgroundUrl, setCustomBackgroundUrlState] = useState<string | null>(() => {
      return localStorage.getItem('customBackgroundUrl');
  });
  const [activeIllusion, setActiveIllusionState] = useState<IllusionType>(
    () => (localStorage.getItem('activeIllusion') as IllusionType) || 'none'
  );
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [weaverState, setWeaverState] = useState<QuantumWeaverState>({
    stage: WeaverStage.Pitch,
    businessPlan: '',
    feedback: '',
    questions: [],
    loanAmount: 0,
    coachingPlan: null,
    error: null,
  });

  const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(() => {
      return localStorage.getItem('geminiApiKey');
  });
    
  const [modernTreasuryApiKey, setModernTreasuryApiKey_] = useState<string | null>(() => localStorage.getItem('modernTreasuryApiKey'));
  const [modernTreasuryOrganizationId, setModernTreasuryOrganizationId_] = useState<string | null>(() => localStorage.getItem('modernTreasuryOrganizationId'));


  const setGeminiApiKey = (key: string) => {
      if (key) {
          localStorage.setItem('geminiApiKey', key);
          setGeminiApiKeyState(key);
      } else {
          localStorage.removeItem('geminiApiKey');
          setGeminiApiKeyState(null);
      }
  };
    
  const setModernTreasuryApiKey = (key: string) => {
      if (key) {
          localStorage.setItem('modernTreasuryApiKey', key);
          setModernTreasuryApiKey_(key);
      } else {
          localStorage.removeItem('modernTreasuryApiKey');
          setModernTreasuryApiKey_(null);
      }
  };

  const setModernTreasuryOrganizationId = (id: string) => {
    if (id) {
        localStorage.setItem('modernTreasuryOrganizationId', id);
        setModernTreasuryOrganizationId_(id);
    } else {
        localStorage.removeItem('modernTreasuryOrganizationId');
        setModernTreasuryOrganizationId_(null);
    }
  };

  // State for new dashboard widgets
  const [subscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [creditScore] = useState<CreditScore>(MOCK_CREDIT_SCORE);
  const [upcomingBills] = useState<UpcomingBill[]>(MOCK_UPCOMING_BILLS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(MOCK_SAVINGS_GOALS);
  const [marketMovers] = useState<MarketMover[]>(MOCK_MARKET_MOVERS);
  const [rewardPoints, setRewardPoints] = useState<RewardPoints>(MOCK_REWARD_POINTS);
  
  // State for Financial Goals
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(MOCK_FINANCIAL_GOALS);

  // State for Crypto & Web3 Hub
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(MOCK_CRYPTO_ASSETS);
  const [nftAssets, setNftAssets] = useState<NFTAsset[]>([]);
  const [paymentOperations, setPaymentOperations] = useState<PaymentOperation[]>(MOCK_PAYMENT_OPERATIONS);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);

  // State for dynamic AI insights
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [isImportingData, setIsImportingData] = useState(false);

  // State for Corporate Command Center
  const [corporateCards, setCorporateCards] = useState<CorporateCard[]>(MOCK_CORPORATE_CARDS);
  const [corporateTransactions] = useState<CorporateTransaction[]>(MOCK_CORPORATE_TRANSACTIONS);
  const [counterparties, setCounterparties] = useState<Counterparty[]>(MOCK_COUNTERPARTIES);


  // State for new interactive features
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  // State for new views
  const [rewardItems] = useState<RewardItem[]>(MOCK_REWARD_ITEMS);
  const [apiStatus, setApiStatus] = useState<APIStatus[]>(MOCK_API_STATUS);
  const [creditFactors] = useState<CreditFactor[]>(MOCK_CREDIT_FACTORS);

  useEffect(() => {
    setApiStatus(prev => prev.map(s => {
        if (s.provider === 'Google Gemini') {
            return { ...s, status: geminiApiKey ? 'Operational' : 'Major Outage' };
        }
        if (s.provider === 'Modern Treasury') {
            return { ...s, status: (modernTreasuryApiKey && modernTreasuryOrganizationId) ? 'Operational' : 'Major Outage' };
        }
        return s;
    }));
  }, [geminiApiKey, modernTreasuryApiKey, modernTreasuryOrganizationId]);


  const setCustomBackgroundUrl = (url: string) => {
      localStorage.setItem('customBackgroundUrl', url);
      setCustomBackgroundUrlState(url);
      localStorage.setItem('activeIllusion', 'none');
      setActiveIllusionState('none');
  };

  const setActiveIllusion = (illusion: IllusionType) => {
    localStorage.setItem('activeIllusion', illusion);
    setActiveIllusionState(illusion);
    if (illusion !== 'none') {
      localStorage.removeItem('customBackgroundUrl');
      setCustomBackgroundUrlState(null);
    }
  };
  
  const updateGamification = (points: number) => {
    setGamification(prev => {
        const newScore = prev.score + points;
        const newLevel = Math.floor(newScore / SCORE_PER_LEVEL) + 1;
        const newProgress = ((newScore % SCORE_PER_LEVEL) / SCORE_PER_LEVEL) * 100;
        const newLevelName = LEVEL_NAMES[Math.min(newLevel - 1, LEVEL_NAMES.length - 1)];
        const newCredits = prev.credits + (points > 0 ? Math.floor(points / 2) : 0);

        return { score: newScore, level: newLevel, levelName: newLevelName, progress: newProgress, credits: newCredits };
    });
  };

  const generateDashboardInsights = useCallback(async () => {
    setIsInsightsLoading(true);
     if (!geminiApiKey) {
        setAiInsights([{ id: 'error_no_key', title: 'API Key Not Set', description: 'Please configure your Google Gemini API key in the API Status view.', urgency: 'high' }]);
        setIsInsightsLoading(false);
        return;
    }
    try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const recentTransactionsSummary = transactions.slice(0, 10).map(t => `${t.description}: $${t.amount.toFixed(2)} (${t.type})`).join(', ');
        
        const prompt = `You are Quantum, a proactive AI financial advisor. Analyze the user's recent transactions to generate 3 diverse, actionable insights. Your insights must be concise. If an insight is about high spending, provide chartData for the top 3 items. Format your response as a JSON object that strictly adheres to the provided schema. Do not include any text outside of the JSON object.

Recent Transactions: ${recentTransactionsSummary}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        insights: {
                            type: Type.ARRAY,
                            description: "A list of 3 diverse financial insights.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING, description: "A unique identifier for the insight, e.g., 'insight_1'." },
                                    title: { type: Type.STRING, description: "A short, catchy title for the insight (max 10 words)." },
                                    description: { type: Type.STRING, description: "A concise, user-friendly description of the insight (max 2 sentences)." },
                                    urgency: { type: Type.STRING, description: "The urgency level of the insight.", enum: ['low', 'medium', 'high'] },
                                    chartData: {
                                        type: Type.ARRAY,
                                        description: "Optional. If the insight is about spending, provide data for a bar chart. Include the top 3 items.",
                                        nullable: true,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING, description: "The name of the item for the chart (e.g., a specific transaction description)." },
                                                value: { type: Type.NUMBER, description: "The value (amount) for the chart." }
                                            },
                                            required: ["name", "value"]
                                        }
                                    }
                                },
                                required: ["id", "title", "description", "urgency"]
                            }
                        }
                    },
                    required: ["insights"]
                }
            }
        });
        
        const parsedResponse = JSON.parse(response.text);
        if (parsedResponse.insights) {
            setAiInsights(parsedResponse.insights);
        }

    } catch (error) {
        console.error("Failed to generate AI insights:", error);
        // Fallback to a default insight on error
        setAiInsights([{ id: 'error_1', title: 'Analysis Paused', description: 'Could not fetch fresh insights at this time. Displaying last known data.', urgency: 'low' }]);
    } finally {
        setIsInsightsLoading(false);
    }
}, [transactions, geminiApiKey]); // Dependency on transactions ensures it can re-run with new data

useEffect(() => {
    generateDashboardInsights(); // Initial generation
    const intervalId = setInterval(generateDashboardInsights, 35000); // Auto-refresh every 35 seconds
    return () => clearInterval(intervalId);
}, [generateDashboardInsights]);

  const handlePlaidSuccess = (publicToken: string, metadata: any) => {
    setIsImportingData(true);
    console.log("Plaid Link Success!", { publicToken, metadata });

    const newAccount: LinkedAccount = {
        id: metadata.institution.institution_id,
        name: metadata.institution.name,
        mask: metadata.accounts[0].mask,
    };
    
    if (!linkedAccounts.some(acc => acc.id === newAccount.id)) {
        setLinkedAccounts(prev => [...prev, newAccount]);
    }
    
    setTimeout(() => {
        const plaidTransactions: Transaction[] = [
            { id: `plaid_${Date.now()}`, type: 'expense', category: 'Shopping', description: `Zara`, amount: 152.34, date: '2024-03-22', carbonFootprint: 10.1 },
            { id: `plaid_${Date.now()+1}`, type: 'expense', category: 'Dining', description: `The Cheesecake Factory`, amount: 85.50, date: '2024-03-21', carbonFootprint: 8.2 },
            { id: `plaid_${Date.now()+2}`, type: 'income', category: 'Salary', description: `Paycheck`, amount: 2500.00, date: '2024-03-20' },
            { id: `plaid_${Date.now()+3}`, type: 'expense', category: 'Groceries', description: `Whole Foods`, amount: 210.40, date: '2024-03-19', carbonFootprint: 21.8 },
            { id: `plaid_${Date.now()+4}`, type: 'expense', category: 'Transport', description: `Uber`, amount: 25.10, date: '2024-03-18', carbonFootprint: 2.1 },
            { id: `plaid_${Date.now()+5}`, type: 'expense', category: 'Utilities', description: `Con Edison`, amount: 112.00, date: '2024-03-15', carbonFootprint: 25.3 },
            { id: `plaid_${Date.now()+6}`, type: 'expense', category: 'Entertainment', description: `Netflix Subscription`, amount: 15.99, date: '2024-03-12', carbonFootprint: 0.5 },
            { id: `plaid_${Date.now()+7}`, type: 'expense', category: 'Dining', description: `Starbucks`, amount: 7.80, date: '2024-03-11', carbonFootprint: 0.8 },
        ];
        
        setTransactions(prev => [...plaidTransactions, ...prev]);
        
        updateGamification(100);
        
        // The generateDashboardInsights function will automatically re-run due to the dependency change,
        // but we can call it here to ensure immediate feedback after import simulation.
        generateDashboardInsights();
        
        setIsImportingData(false);
    }, 4000);
  };

  const unlinkAccount = (id: string) => {
      setLinkedAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const pitchBusinessPlan = async (plan: string) => {
    setWeaverState(prev => ({ ...prev, stage: WeaverStage.Analysis, businessPlan: plan, error: null }));
    if (!geminiApiKey) {
        setWeaverState(prev => ({ ...prev, stage: WeaverStage.Error, error: "Google Gemini API Key is not set. Please add it in the API Status view." }));
        return;
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const prompt = `Analyze the following business plan. Provide brief, constructive initial feedback (1-2 sentences) and generate exactly 5 sample assessment questions based on the plan's potential weaknesses or key areas. The questions should cover different categories like Market, Finance, Operations, etc.

Business Plan: "${plan}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    feedback: { type: Type.STRING },
                    questions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                question: { type: Type.STRING },
                                category: { type: Type.STRING }
                            },
                            required: ["id", "question", "category"]
                        }
                    }
                },
                 required: ["feedback", "questions"]
            }
        }
      });
      
      const parsedResponse = JSON.parse(response.text);
      setWeaverState(prev => ({
        ...prev,
        stage: WeaverStage.Test,
        feedback: parsedResponse.feedback,
        questions: parsedResponse.questions,
      }));

    } catch (err) {
      console.error("Error analyzing business plan:", err);
      setWeaverState(prev => ({ ...prev, stage: WeaverStage.Error, error: "Plato AI encountered an issue analyzing your plan. Please try again." }));
    }
  };

  const simulateTestPass = async () => {
    setWeaverState(prev => ({ ...prev, stage: WeaverStage.FinalReview, error: null }));
    if (!geminiApiKey) {
        setWeaverState(prev => ({ ...prev, stage: WeaverStage.Error, error: "Google Gemini API Key is not set. Please add it in the API Status view." }));
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const prompt = `Based on this business plan, you have approved a seed loan. Determine a realistic loan amount (between $50,000 and $250,000). Then, generate a 3-step coaching plan to guide the founder. The plan should be high-level and encouraging.

Business Plan: "${weaverState.businessPlan}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    loanAmount: { type: Type.NUMBER },
                    coachingPlan: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            summary: { type: Type.STRING },
                            steps: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        timeline: { type: Type.STRING }
                                    },
                                    required: ["title", "description", "timeline"]
                                }
                            }
                        },
                        required: ["title", "summary", "steps"]
                    }
                },
                required: ["loanAmount", "coachingPlan"]
            }
        }
      });

      const parsedResponse = JSON.parse(response.text);
      const { loanAmount, coachingPlan } = parsedResponse;

      setWeaverState(prev => ({
        ...prev,
        stage: WeaverStage.Approved,
        loanAmount,
        coachingPlan,
      }));
      
      const loanTx: Transaction = {
          id: `loan_${new Date().toISOString()}`,
          type: 'income',
          category: 'Loan',
          description: `QuantumWeaver Seed Loan`,
          amount: loanAmount,
          date: new Date().toLocaleDateString('en-CA'),
      };
      addTransaction(loanTx);

    } catch (err) {
        console.error("Error finalizing loan:", err);
        setWeaverState(prev => ({ ...prev, stage: WeaverStage.Error, error: "Plato AI couldn't finalize the funding package. Please try again." }));
    }
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    if (tx.type === 'expense') {
        setSpendingForNextTree(prev => {
            const newSpending = prev + tx.amount;
            if (newSpending >= COST_PER_TREE) {
                setTreesPlanted(p => p + Math.floor(newSpending / COST_PER_TREE));
                return newSpending % COST_PER_TREE;
            }
            return newSpending;
        });

        const budgetToUpdate = budgets.find(b => b.name.toLowerCase() === tx.category.toLowerCase());
        if (budgetToUpdate) {
            setBudgets(prev => prev.map(b => b.id === budgetToUpdate.id ? { ...b, spent: b.spent + tx.amount } : b));
        }
    }
    updateGamification(tx.type === 'income' ? 20 : 10);
  };

  const addBudget = (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => {
      const newBudget: BudgetCategory = {
          id: budget.name.toLowerCase().replace(' ', '-'),
          ...budget,
          spent: 0,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      setBudgets(prev => [...prev, newBudget]);
  };

  const addFinancialGoal = (goalData: Omit<FinancialGoal, 'id' | 'plan' | 'currentAmount'>) => {
    const newGoal: FinancialGoal = {
        ...goalData,
        id: `goal_${Date.now()}`,
        currentAmount: 0,
        plan: null,
    };
    setFinancialGoals(prev => [...prev, newGoal]);
  };

  const contributeToGoal = (goalId: string, amount: number) => {
      setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g));
      const tx: Transaction = {
          id: `goal_contrib_${Date.now()}`,
          type: 'expense',
          category: 'Savings',
          description: `Contribution to ${financialGoals.find(g => g.id === goalId)?.name}`,
          amount: amount,
          date: new Date().toLocaleDateString('en-CA'),
      };
      addTransaction(tx);
  };

  const generateGoalPlan = async (goalId: string) => {
    const goal = financialGoals.find(g => g.id === goalId);
    if (!goal) return;
    if (!geminiApiKey) {
        console.error("Gemini API key not set.");
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const prompt = `Generate a feasible financial plan for the following goal. Provide a brief feasibility summary, a recommended monthly contribution, and 3 actionable steps across different categories (Savings, Budgeting, Investing, Income).
        
Goal: ${goal.name}
Target Amount: $${goal.targetAmount}
Target Date: ${goal.targetDate}
Current Savings for this goal: $${goal.currentAmount}`;

         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        feasibilitySummary: { type: Type.STRING },
                        monthlyContribution: { type: Type.NUMBER },
                        steps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    category: { type: Type.STRING, enum: ['Savings', 'Budgeting', 'Investing', 'Income'] }
                                },
                                required: ["title", "description", "category"]
                            }
                        }
                    },
                    required: ["feasibilitySummary", "monthlyContribution", "steps"]
                }
            }
        });

        const plan: AIGoalPlan = JSON.parse(response.text);
        setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, plan } : g));
    } catch (err) {
        console.error("Error generating goal plan:", err);
    }
  };
  
    // --- CRYPTO & WEB3 FUNCTIONS ---
  const connectWallet = () => {
      // Simulate Metamask connection
      setTimeout(() => {
          setWalletInfo({
              address: '0x1a2b...c3d4',
              balance: 12.5
          });
      }, 500);
  };

  const issueCard = () => {
       // Simulate Marqeta card issuance
       setTimeout(() => {
          setVirtualCard({
              cardNumber: '5555 1234 5678 9012',
              cvv: '123',
              expiry: '12/28',
              holderName: 'The Visionary'
          });
       }, 2000);
  };

  const buyCrypto = (usdAmount: number, cryptoTicker: string) => {
      // Simulate Stripe on-ramp and Modern Treasury ledger update
      setTimeout(() => {
          const cryptoAmount = usdAmount / 3000; // Mock ETH price
          setCryptoAssets(prev => prev.map(asset => asset.ticker === cryptoTicker ? { ...asset, amount: asset.amount + cryptoAmount, value: asset.value + usdAmount } : asset));
          const tx: Transaction = {
            id: `crypto_buy_${Date.now()}`,
            type: 'expense',
            category: 'Investments',
            description: `Buy ${cryptoTicker} via Stripe`,
            amount: usdAmount,
            date: new Date().toLocaleDateString('en-CA'),
            carbonFootprint: 0.2
          };
          addTransaction(tx);
          setAiInsights(prev => [
              { id: 'crypto_insight_1', title: 'Crypto Purchase Detected', description: `Our systems noticed your recent purchase of ${cryptoTicker}. We recommend monitoring market volatility.`, urgency: 'medium' },
              ...prev
          ]);
      }, 1000);
  };

  const mintNFT = (name: string, imageUrl: string) => {
    const newNft: NFTAsset = {
        id: `nft_${Date.now()}`,
        name,
        imageUrl,
        contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`
    };
    setNftAssets(prev => [newNft, ...prev]);
    setNotifications(prev => [
        { id: `notif_${Date.now()}`, message: `Congratulations! You've successfully minted the "${name}" NFT.`, timestamp: 'Just now', read: false, view: View.Crypto },
        ...prev
    ]);
  };

  const mintToken = (name: string, ticker: string, amount: number) => {
    if (cryptoAssets.some(asset => asset.ticker.toUpperCase() === ticker.toUpperCase())) {
        setNotifications(prev => [
            { id: `notif_${Date.now()}`, message: `Error: Token with ticker ${ticker.toUpperCase()} already exists.`, timestamp: 'Just now', read: false, view: View.Crypto },
            ...prev
        ]);
        return;
    }
    const newMockToken: CryptoAsset = {
        ticker: ticker.toUpperCase(),
        name: name,
        value: Math.random() * 100,
        amount: amount,
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
    };
    setCryptoAssets(prev => [...prev, newMockToken]);
    setNotifications(prev => [
        { id: `notif_${Date.now()}`, message: `New token minted: ${amount.toLocaleString()} ${ticker.toUpperCase()} added to your portfolio.`, timestamp: 'Just now', read: false, view: View.Crypto },
        ...prev
    ]);
  };

  const addCounterparty = async (data: { name: string, email: string, accountNumber: string, routingNumber: string }) => {
    if (!modernTreasuryOrganizationId || !modernTreasuryApiKey) {
        throw new Error("Modern Treasury API Key and Organization ID must be set in API Status view.");
    }
    
    // NOTE: This is a sandboxed API call. In a real production app, this would be handled on a secure server to protect credentials.
    // The use of a CORS proxy would be required to run this from the browser. For this demo, we simulate the fetch call.
    console.log("Simulating Modern Treasury Counterparty Creation:", data);

    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            const newCounterparty: Counterparty = {
                id: `cpty_${Date.now()}`,
                name: data.name,
                email: data.email,
                send_remittance_advice: false,
                created_at: new Date().toISOString(),
                accounts: [{
                    id: `act_${Date.now()}`,
                    party_name: data.name,
                    account_details: [{
                        account_number_safe: data.accountNumber.slice(-4)
                    }]
                }]
            };
            setCounterparties(prev => [newCounterparty, ...prev]);
            resolve();
        }, 1500);
    });
};


  const toggleCorporateCardFreeze = (cardId: string) => {
      setCorporateCards(prev => prev.map(c => c.id === cardId ? { ...c, frozen: !c.frozen } : c));
  };
  
  const updateCorporateCard = (cardId: string, newControls: CorporateCardControls, newFrozenState: boolean) => {
      setCorporateCards(prev => prev.map(c => c.id === cardId ? { ...c, controls: newControls, frozen: newFrozenState } : c));
  };
  
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const initiatePayment = (details: Omit<PaymentOperation, 'id' | 'status' | 'date'>) => {
      const newPayment: PaymentOperation = {
          ...details,
          id: `po_${Date.now()}`,
          status: 'Initiated',
          date: new Date().toLocaleDateString('en-CA'),
      };
      setPaymentOperations(prev => [newPayment, ...prev]);
      
      // Simulate status progression
      setTimeout(() => {
          setPaymentOperations(prev => prev.map(p => p.id === newPayment.id ? {...p, status: 'Processing' } : p));
      }, 3000);
      setTimeout(() => {
          setPaymentOperations(prev => prev.map(p => p.id === newPayment.id ? {...p, status: 'Completed' } : p));
      }, 8000);
  };
  
  const redeemReward = (item: RewardItem): boolean => {
      if (rewardPoints.balance >= item.cost) {
          setRewardPoints(prev => ({
              ...prev,
              balance: prev.balance - item.cost,
              lastRedeemed: item.cost,
          }));
          setNotifications(prev => [{
              id: `notif_reward_${Date.now()}`,
              message: `You've successfully redeemed "${item.name}" for ${item.cost.toLocaleString()} points.`,
              timestamp: 'Just now',
              read: false,
              view: View.Rewards
          }, ...prev]);
          return true;
      }
      return false;
  };

  const impactData = {
    treesPlanted,
    spendingForNextTree,
    progressToNextTree: (spendingForNextTree / COST_PER_TREE) * 100,
  };

  const value = {
    transactions,
    assets,
    impactInvestments,
    budgets,
    addBudget,
    gamification,
    impactData,
    customBackgroundUrl,
    setCustomBackgroundUrl,
    addTransaction,
    activeIllusion,
    setActiveIllusion,
    linkedAccounts,
    unlinkAccount,
    handlePlaidSuccess,
    weaverState,
    pitchBusinessPlan,
    simulateTestPass,
    subscriptions,
    creditScore,
    upcomingBills,
    savingsGoals,
    marketMovers,
    financialGoals,
    addFinancialGoal,
    contributeToGoal,
    generateGoalPlan,
    cryptoAssets,
    paymentOperations,
    walletInfo,
    virtualCard,
    connectWallet,
    issueCard,
    buyCrypto,
    aiInsights,
    isInsightsLoading,
    corporateCards,
    corporateTransactions,
    toggleCorporateCardFreeze,
    updateCorporateCard,
    rewardPoints,
    notifications,
    markNotificationRead,
    isImportingData,
    nftAssets,
    mintNFT,
    mintToken,
    initiatePayment,
    rewardItems,
    redeemReward,
    apiStatus,
    creditFactors,
    geminiApiKey,
    setGeminiApiKey,
    modernTreasuryApiKey,
    setModernTreasuryApiKey,
    modernTreasuryOrganizationId,
    setModernTreasuryOrganizationId,
    counterparties,
    addCounterparty,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/context/DataContext.tsx
================================================================================


import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  Transaction, PortfolioAsset, UserProfile, 
  AppView, View, Notification, InternalAccount,
  AIInsight, BudgetCategory, RewardItem, APIStatus,
  FinancialGoal, RewardPoints, PaymentOrder, Invoice, ComplianceCase, 
  CorporateTransaction, MarqetaCardProduct, SecurityScoreMetric,
  AuditLogEntry, ThreatAlert, DataSharingPolicy, APIKey,
  TrustedContact, SecurityAwarenessModule, TransactionRule, LinkedAccount, User,
  // Added missing import
  CreditFactor
} from '../types';
import { 
  MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_BUDGETS, 
  MOCK_REWARD_ITEMS, MOCK_API_STATUS, MOCK_NOTIFICATIONS,
  MOCK_CREDIT_SCORE, MOCK_CREDIT_FACTORS, MOCK_FINANCIAL_GOALS,
  MOCK_REWARD_POINTS, MOCK_SECURITY_METRICS, MOCK_AUDIT_LOGS, 
  MOCK_THREAT_ALERTS, MOCK_DATA_SHARING_POLICIES, MOCK_API_KEYS, 
  MOCK_TRUSTED_CONTACTS, MOCK_SECURITY_AWARENESS, MOCK_TRANSACTION_RULES
} from '../data/mockData';
import { GoogleGenAI } from "@google/genai";

export interface ApiEndpoints {
    citibank: string;
    plaid: string;
    stripe: string;
    modernTreasury: string;
    gemini: string;
    gein: string;
}

interface IDataContext {
  activeView: View;
  setActiveView: (view: View) => void;
  user: UserProfile;
  transactions: Transaction[];
  addTransaction: (tx: Partial<Transaction>) => void;
  budgets: BudgetCategory[];
  addBudget: (budget: Partial<BudgetCategory>) => void;
  financialGoals: FinancialGoal[];
  addFinancialGoal: (goal: Partial<FinancialGoal>) => void;
  notifications: Notification[];
  showNotification: (message: string, severity: Notification['severity']) => void;
  sovereignCredits: number;
  deductCredits: (amount: number) => boolean;
  askSovereignAI: (prompt: string, modelName?: string) => Promise<string>;
  isLoading: boolean;
  isProductionApproved: boolean;
  plaidProducts: string[];
  assets: PortfolioAsset[];
  creditScore: any;
  rewardPoints: any;
  apiEndpoints: ApiEndpoints;
  updateEndpoint: (key: keyof ApiEndpoints, value: string) => void;
  // Fallbacks for compatibility
  view: View;
  setView: (view: View) => void;
  revokedApps: string[];
  revokeApp: (id: string) => void;
  
  // --- Missing properties added to fix component errors ---
  simulationData: any[];
  showSystemAlert: (message: string, severity: Notification['severity']) => void;
  linkedAccounts: LinkedAccount[];
  unlinkAccount: (id: string) => void;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  securityMetrics: SecurityScoreMetric[];
  auditLogs: AuditLogEntry[];
  threatAlerts: ThreatAlert[];
  dataSharingPolicies: DataSharingPolicy[];
  apiKeys: APIKey[];
  trustedContacts: TrustedContact[];
  securityAwarenessModules: SecurityAwarenessModule[];
  transactionRules: TransactionRule[];
  stripeApiKey: string | null;
  paymentOrders: PaymentOrder[];
  invoices: Invoice[];
  complianceCases: ComplianceCase[];
  corporateTransactions: CorporateTransaction[];
  marqetaCardProducts: MarqetaCardProduct[];
  fetchMarqetaProducts: () => void;
  isMarqetaLoading: boolean;
  marqetaApiToken: string | null;
  marqetaApiSecret: string | null;
  setMarqetaCredentials: (token: string, secret: string) => void;
  plaidApiKey: string | null;
  userProfile: UserProfile | null;
  creditFactors: CreditFactor[];
  geminiApiKey: string | null;
  markNotificationRead: (id: string) => void;
  dbConfig: any;
  updateDbConfig: (config: any) => void;
  connectDatabase: () => void;
  webDriverStatus: any;
  launchWebDriver: (task: string) => void;
  broadcastEvent: (type: string, data: any) => void;
  error: string | null;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS as any);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(MOCK_BUDGETS as any);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(MOCK_FINANCIAL_GOALS as any);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS as any);
  const [sovereignCredits, setSovereignCredits] = useState(1250000);
  const [isLoading, setIsLoading] = useState(false);
  const [revokedApps, setRevokedApps] = useState<string[]>([]);
  
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoints>({
      citibank: 'https://api.sandbox.citi.com/v1',
      plaid: 'https://sandbox.plaid.com',
      stripe: 'https://api.stripe.com/v1',
      modernTreasury: 'https://app.moderntreasury.com/api',
      gemini: 'https://generativelanguage.googleapis.com',
      gein: 'https://nexus.gein.io/v1'
  });

  // --- New State for missing members ---
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [securityMetrics] = useState<SecurityScoreMetric[]>(MOCK_SECURITY_METRICS);
  const [auditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [threatAlerts] = useState<ThreatAlert[]>(MOCK_THREAT_ALERTS);
  const [dataSharingPolicies] = useState<DataSharingPolicy[]>(MOCK_DATA_SHARING_POLICIES);
  const [apiKeys] = useState<APIKey[]>(MOCK_API_KEYS);
  const [trustedContacts] = useState<TrustedContact[]>(MOCK_TRUSTED_CONTACTS);
  const [securityAwarenessModules] = useState<SecurityAwarenessModule[]>(MOCK_SECURITY_AWARENESS);
  const [transactionRules] = useState<TransactionRule[]>(MOCK_TRANSACTION_RULES);
  const [stripeApiKey, setStripeApiKey] = useState<string | null>(null);
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [complianceCases, setComplianceCases] = useState<ComplianceCase[]>([]);
  const [corporateTransactions, setCorporateTransactions] = useState<CorporateTransaction[]>([]);
  const [marqetaCardProducts, setMarqetaCardProducts] = useState<MarqetaCardProduct[]>([]);
  const [isMarqetaLoading, setIsMarqetaLoading] = useState(false);
  const [marqetaApiToken, setMarqetaApiToken] = useState<string | null>(null);
  const [marqetaApiSecret, setMarqetaApiSecret] = useState<string | null>(null);
  const [plaidApiKey, setPlaidApiKey] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [creditFactors] = useState<CreditFactor[]>(MOCK_CREDIT_FACTORS);
  const [geminiApiKey] = useState<string | null>(process.env.API_KEY || null);
  const [dbConfig, setDbConfig] = useState({ host: 'localhost', port: '5432', username: 'admin', databaseName: 'nexus', connectionStatus: 'disconnected', sslMode: 'required' });
  const [webDriverStatus, setWebDriverStatus] = useState({ status: 'idle', logs: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      // Seed simulation data
      setSimulationData(Array.from({length: 20}, (_, i) => ({ time: `T-${20-i}`, value: 5000 + Math.random() * 2000 })));
  }, []);

  const showNotification = useCallback((message: string, severity: Notification['severity'] = 'info') => {
    setNotifications(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: 'Just Now',
      read: false,
      severity
    }, ...prev].slice(0, 20));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const showSystemAlert = useCallback((message: string, severity: Notification['severity'] = 'info') => {
      showNotification(message, severity);
  }, [showNotification]);

  const deductCredits = (amount: number) => {
    if (sovereignCredits >= amount) {
        setSovereignCredits(prev => prev - amount);
        return true;
    }
    showNotification("Insufficient Sovereign Credits for this operation.", "error");
    return false;
  };

  const addTransaction = (tx: Partial<Transaction>) => {
    const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: tx.description || 'System Entry',
        amount: tx.amount || 0,
        type: tx.type || 'expense',
        category: tx.category || 'Uncategorized',
        currency: 'USD',
        ...tx
    };
    setTransactions(prev => [newTx, ...prev]);
    showNotification(`New transaction logged: ${newTx.description}`, "success");
  };

  const addBudget = (budget: Partial<BudgetCategory>) => {
      const newBudget: BudgetCategory = {
          id: `b_${Date.now()}`,
          name: budget.name || 'New Budget',
          limit: budget.limit || 0,
          spent: 0,
          color: '#06b6d4',
          remaining: budget.limit || 0,
          category: budget.name || 'General',
          alerts: [],
          ...budget
      };
      setBudgets(prev => [newBudget, ...prev]);
      showNotification(`Capital allocation established: ${newBudget.name}`, "success");
  };

  const addFinancialGoal = (goal: Partial<FinancialGoal>) => {
      const newGoal: FinancialGoal = {
          id: `goal_${Date.now()}`,
          name: goal.name || 'New Strategic Goal',
          targetAmount: goal.targetAmount || 0,
          currentAmount: 0,
          targetDate: goal.targetDate || '2030-01-01',
          status: 'on_track',
          ...goal
      };
      setFinancialGoals(prev => [newGoal, ...prev]);
      showNotification(`Strategic objective initialized: ${newGoal.name}`, "success");
  };

  const askSovereignAI = async (prompt: string, modelName = 'gemini-3-flash-preview') => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { systemInstruction: "You are the Aquarius AI Core. Provide high-fidelity, strategic financial intelligence. Be concise, professional, and slightly futuristic." }
        });
        return response.text || "Communication loop timed out.";
    } catch (e) {
        console.error("AI Core Error:", e);
        return "Critical failure in neural synchronization.";
    }
  };

  const updateEndpoint = (key: keyof ApiEndpoints, value: string) => {
      setApiEndpoints(prev => ({ ...prev, [key]: value }));
      showNotification(`Signal path updated: ${key.toUpperCase()}`, "info");
  };

  const unlinkAccount = (id: string) => {
      setLinkedAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const handlePlaidSuccess = (publicToken: string, metadata: any) => {
      console.log("Plaid success:", publicToken, metadata);
      const newAcc: LinkedAccount = {
          id: `acc_${Date.now()}`,
          name: metadata.institution.name,
          institutionId: metadata.institution.institution_id,
          mask: '0000',
          type: 'depository'
      };
      setLinkedAccounts(prev => [...prev, newAcc]);
  };

  const fetchMarqetaProducts = () => {
      setIsMarqetaLoading(true);
      setTimeout(() => setIsMarqetaLoading(false), 1000);
  };

  const setMarqetaCredentials = (token: string, secret: string) => {
      setMarqetaApiToken(token);
      setMarqetaApiSecret(secret);
  };

  const updateDbConfig = (config: any) => setDbConfig(prev => ({ ...prev, ...config }));
  const connectDatabase = () => {
      setDbConfig(prev => ({ ...prev, connectionStatus: 'connecting' }));
      setTimeout(() => setDbConfig(prev => ({ ...prev, connectionStatus: 'connected' })), 1000);
  };
  const launchWebDriver = (task: string) => {
      setWebDriverStatus(prev => ({ ...prev, status: 'running', logs: [`Initiating ${task}...`] }));
      setTimeout(() => setWebDriverStatus(prev => ({ ...prev, status: 'idle', logs: [...prev.logs, `${task} completed.`] })), 2000);
  };

  const broadcastEvent = useCallback((type: string, data: any) => {
      console.log(`[Event Broadcast] ${type}:`, data);
      showNotification(`System Event: ${type}`, 'info');
  }, [showNotification]);

  const value = {
    activeView,
    setActiveView,
    user: {
        id: 'USR-77-X',
        name: 'James Burvel oCallaghan III',
        email: 'james@sovereign.io',
        loyaltyTier: 'OMEGA',
        usdBalance: 2450000000,
        cryptoBalance: 142.55,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
    },
    transactions,
    addTransaction,
    budgets,
    addBudget,
    financialGoals,
    addFinancialGoal,
    notifications,
    showNotification,
    sovereignCredits,
    deductCredits,
    askSovereignAI,
    isLoading,
    isProductionApproved: true,
    plaidProducts: ['Auth', 'Transactions', 'Identity', 'Balance', 'Investments'],
    assets: MOCK_ASSETS as any,
    creditScore: MOCK_CREDIT_SCORE,
    rewardPoints: MOCK_REWARD_POINTS,
    apiEndpoints,
    updateEndpoint,
    view: activeView,
    setView: setActiveView,
    revokedApps,
    revokeApp: (id: string) => setRevokedApps(prev => [...prev, id]),
    
    // --- New value mappings ---
    simulationData,
    showSystemAlert,
    linkedAccounts,
    unlinkAccount,
    handlePlaidSuccess,
    securityMetrics,
    auditLogs,
    threatAlerts,
    dataSharingPolicies,
    apiKeys,
    trustedContacts,
    securityAwarenessModules,
    transactionRules,
    stripeApiKey,
    paymentOrders,
    invoices,
    complianceCases,
    corporateTransactions,
    marqetaCardProducts,
    fetchMarqetaProducts,
    isMarqetaLoading,
    marqetaApiToken,
    marqetaApiSecret,
    setMarqetaCredentials,
    plaidApiKey,
    userProfile,
    creditFactors,
    geminiApiKey,
    markNotificationRead,
    dbConfig,
    updateDbConfig,
    connectDatabase,
    webDriverStatus,
    launchWebDriver,
    broadcastEvent,
    error
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/context/DataContext.tsx
================================================================================

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Transaction, PortfolioAsset, UserProfile, 
  AppView, View, Notification, InternalAccount,
  AIInsight, BudgetCategory, RewardItem, APIStatus,
  Pipeline, InboundBlob, FundFlow, AuthorizedApp,
  CreditScore, CreditFactor, FinancialGoal, RewardPoints,
  PaymentOrder, Invoice, ComplianceCase, CorporateTransaction,
  EIP6963ProviderDetail, MarqetaCardProduct, SecurityScoreMetric,
  AuditLogEntry, ThreatAlert, DataSharingPolicy, APIKey,
  TrustedContact, SecurityAwarenessModule, TransactionRule
} from '../types';
import { 
  MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_BUDGETS, 
  MOCK_REWARD_ITEMS, MOCK_API_STATUS, MOCK_NOTIFICATIONS,
  MOCK_CREDIT_SCORE, MOCK_CREDIT_FACTORS, MOCK_FINANCIAL_GOALS,
  MOCK_REWARD_POINTS,
  MOCK_SECURITY_METRICS, MOCK_AUDIT_LOGS, MOCK_THREAT_ALERTS,
  MOCK_DATA_SHARING_POLICIES, MOCK_API_KEYS, MOCK_TRUSTED_CONTACTS,
  MOCK_SECURITY_AWARENESS, MOCK_TRANSACTION_RULES
} from '../data/mockData';

export interface ApiEndpoints {
    quantumFinancial: string;
    plaid: string;
    stripe: string;
    modernTreasury: string;
    gemini: string;
    gein: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
}

interface IDataContext {
  view: AppView; activeView: View; setView: (view: AppView) => void;
  setActiveView: (view: View) => void; userProfile: UserProfile; user: UserProfile; 
  creator: { name: string; title: string }; transactions: Transaction[]; assets: PortfolioAsset[];
  internalAccounts: InternalAccount[]; notifications: Notification[]; aiInsights: AIInsight[];
  insights: AIInsight[]; budgets: BudgetCategory[]; rewardItems: RewardItem[]; apiStatus: APIStatus[];
  pipelines: Pipeline[]; inboundBlobs: InboundBlob[]; fundFlows: FundFlow[]; authorizedApps: AuthorizedApp[];
  geminiApiKey: string | null; setGeminiApiKey: (key: string) => void;
  modernTreasuryApiKey: string | null; setModernTreasuryApiKey: (key: string) => void;
  modernTreasuryOrganizationId: string | null; setModernTreasuryOrganizationId: (id: string) => void;
  setTransactions: (txs: Transaction[]) => void; updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void; setAssets: (assets: PortfolioAsset[]) => void;
  setInternalAccounts: (accounts: InternalAccount[]) => void;
  showNotification: (message: string, severity: Notification['severity']) => void;
  markNotificationRead: (id: string) => void; authorizeApp: (app: Partial<AuthorizedApp>) => void;
  revokeApp: (id: string) => void; redeemReward: (item: RewardItem) => boolean;
  askSovereignAI: (prompt: string, modelName?: string) => Promise<string>;
  simulationData: { time: string; value: number }[]; isImportingData: boolean; treesPlanted: number;
  spendingForNextTree: number; linkedAccounts: any[]; unlinkAccount: (id: string) => void;
  paymentOrders: PaymentOrder[]; invoices: Invoice[]; complianceCases: ComplianceCase[];
  corporateTransactions: CorporateTransaction[]; creditScore: CreditScore; creditFactors: CreditFactor[];
  financialGoals: FinancialGoal[]; addFinancialGoal: (goal: Partial<FinancialGoal>) => void;
  generateGoalPlan: (id: string) => Promise<void>; addContributionToGoal: (id: string, amount: number) => void;
  addRecurringContributionToGoal: (id: string, contrib: any) => void;
  updateRecurringContributionInGoal: (gid: string, cid: string, updates: any) => void;
  deleteRecurringContributionFromGoal: (gid: string, cid: string) => void;
  updateFinancialGoal: (id: string, updates: any) => void; linkGoals: (s: string, t: string, type: any, amt?: number) => void;
  unlinkGoals: (s: string, t: string) => void; isWalletConnectModalOpen: boolean;
  setWalletConnectModalOpen: (open: boolean) => void; detectedProviders: EIP6963ProviderDetail[];
  connectWallet: (provider: EIP6963ProviderDetail) => void; rewardPoints: RewardPoints;
  apiEndpoints: ApiEndpoints; updateEndpoint: (key: keyof ApiEndpoints, value: string) => void;
  sovereignCredits: number; deductCredits: (amount: number) => boolean; isProductionApproved: boolean;
  plaidProducts: string[]; addTransaction: (tx: Transaction) => void;
  isLoading: boolean; error: string | null; broadcastEvent: (type: string, data: any) => void;
  githubRepoFiles: GitHubFile[]; fetchRepo: () => Promise<void>; fetchDirectory: (path: string) => Promise<void>; isRepoLoading: boolean;
  addBudget: (name: string, limit: number) => void; stripeApiKey: string | null;
  marqetaCardProducts: MarqetaCardProduct[]; fetchMarqetaProducts: () => Promise<void>;
  isMarqetaLoading: boolean; marqetaApiToken: string | null; marqetaApiSecret: string | null;
  setMarqetaCredentials: (token: string, secret: string) => void; plaidApiKey: string | null;
  dbConfig: any; updateDbConfig: (updates: any) => void; connectDatabase: () => Promise<void>;
  webDriverStatus: any; launchWebDriver: (task: string) => Promise<void>;
  showSystemAlert: (message: string, severity: Notification['severity']) => void;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  securityMetrics: SecurityScoreMetric[]; auditLogs: AuditLogEntry[];
  threatAlerts: ThreatAlert[]; dataSharingPolicies: DataSharingPolicy[];
  apiKeys: APIKey[]; trustedContacts: TrustedContact[];
  securityAwarenessModules: SecurityAwarenessModule[]; transactionRules: TransactionRule[];
  initiateWireTransfer: (details: any) => Promise<void>;
  initiateACHTransfer: (details: any) => Promise<void>;
  logAuditAction: (action: string, details: any) => void;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

const STORAGE_KEY = 'QUANTUM_FINANCIAL_STATE_V1';
const GITHUB_STORAGE_KEY = 'QUANTUM_GITHUB_REPO_V1';
const GITHUB_OWNER = 'jocall3';
const GITHUB_REPO = 'jocall3';

const MOCK_INBOUND_BLOBS: InboundBlob[] = [
    { id: 'b-1', filePath: 's3://nexus/ingest/quantum_q4_raw.csv', status: 'IMPORTED', vendorName: 'Quantum Financial', interfaceType: 'SFTP', createdAt: '2024-11-15T09:00:00Z' }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>(View.Dashboard);
  const [transactions, setTransactionsState] = useState<Transaction[]>(MOCK_TRANSACTIONS as any);
  const [assets, setAssetsState] = useState<PortfolioAsset[]>(MOCK_ASSETS as any);
  const [internalAccounts, setInternalAccountsState] = useState<InternalAccount[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS as any);
  const [simulationData, setSimulationData] = useState<{ time: string; value: number }[]>([]);
  const [isImportingData, setIsImportingData] = useState(false);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(MOCK_FINANCIAL_GOALS as any);
  const [isWalletConnectModalOpen, setWalletConnectModalOpen] = useState(false);
  const [detectedProviders, setDetectedProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([
    { id: 'acc_01', name: 'Quantum Elite Checking', mask: '9981', balance: 8500000, institutionId: 'quantum_intl' },
    { id: 'acc_02', name: 'Global Treasury Savings', mask: '1102', balance: 25000000, institutionId: 'quantum_intl' }
  ]);
  const [authorizedApps, setAuthorizedApps] = useState<AuthorizedApp[]>([
    { id: 'app-1', name: 'Quantum Nexus ERP', description: 'Enterprise Resource Planning', status: 'active', authorizedAt: '2024-10-01T08:00:00Z' }
  ]);
  
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key'));
  const [modernTreasuryApiKey, setModernTreasuryApiKey] = useState<string | null>(localStorage.getItem('mt_api_key'));
  const [modernTreasuryOrganizationId, setModernTreasuryOrganizationId] = useState<string | null>(localStorage.getItem('mt_org_id'));

  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoints>({
      quantumFinancial: 'https://api.quantumfinancial.io/v1',
      plaid: 'https://production.plaid.com',
      stripe: 'https://api.stripe.com/v1',
      modernTreasury: 'https://app.moderntreasury.com/api',
      gemini: 'https://generativelanguage.googleapis.com',
      gein: 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io'
  });

  const [sovereignCredits, setSovereignCredits] = useState(500000);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(MOCK_BUDGETS as any);
  const [marqetaCardProducts, setMarqetaCardProducts] = useState<MarqetaCardProduct[]>([]);
  const [isMarqetaLoading, setIsMarqetaLoading] = useState(false);
  const [marqetaApiToken, setMarqetaApiToken] = useState<string | null>(localStorage.getItem('marqeta_token'));
  const [marqetaApiSecret, setMarqetaApiSecret] = useState<string | null>(localStorage.getItem('marqeta_secret'));
  
  const [dbConfig, setDbConfig] = useState({
      host: 'quantum-db-cluster.aws.internal',
      port: '5432',
      username: 'quantum_admin',
      password: '',
      databaseName: 'quantum_ledger_prod',
      connectionStatus: 'disconnected' as 'connected' | 'disconnected' | 'connecting',
      sslMode: 'require'
  });

  const updateDbConfig = useCallback((updates: any) => {
    setDbConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const [webDriverStatus, setWebDriverStatus] = useState({
      status: 'idle' as 'idle' | 'running' | 'error',
      logs: [] as string[]
  });

  const [githubRepoFiles, setGithubRepoFiles] = useState<GitHubFile[]>([]);
  const [isRepoLoading, setIsRepoLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS as any);

  const logAuditAction = useCallback((action: string, details: any) => {
    const entry: AuditLogEntry = {
      id: `AUDIT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details: JSON.stringify(details),
      user: 'James Burvel oCallaghan III',
      ipAddress: '10.0.0.42',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [entry, ...prev]);
    console.log(`[QUANTUM_AUDIT] ${action}`, details);
  }, []);

  const showNotification = useCallback((message: string, severity: Notification['severity']) => {
    setNotifications(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: 'Just Now',
      read: false,
      severity: severity || 'info'
    }, ...prev].slice(0, 20));
  }, []);

  const initiateWireTransfer = useCallback(async (details: any) => {
    logAuditAction('WIRE_TRANSFER_INITIATED', details);
    showNotification('MFA Challenge Issued: Please verify on your Quantum Secure Key.', 'info');
    await new Promise(r => setTimeout(r, 2000));
    showNotification('Fraud Monitoring: Transaction cleared heuristic analysis.', 'success');
    showNotification(`Wire Transfer of ${details.amount} to ${details.recipient} successful.`, 'success');
    logAuditAction('WIRE_TRANSFER_COMPLETED', { ...details, status: 'SETTLED' });
  }, [logAuditAction, showNotification]);

  const initiateACHTransfer = useCallback(async (details: any) => {
    logAuditAction('ACH_TRANSFER_INITIATED', details);
    showNotification('Processing ACH Batch...', 'info');
    await new Promise(r => setTimeout(r, 1500));
    showNotification(`ACH Transfer to ${details.recipient} queued for next window.`, 'success');
    logAuditAction('ACH_TRANSFER_QUEUED', details);
  }, [logAuditAction, showNotification]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.transactions) setTransactionsState(parsed.transactions);
        if (parsed.assets) setAssetsState(parsed.assets);
        if (parsed.internalAccounts) setInternalAccountsState(parsed.internalAccounts);
        if (parsed.financialGoals) setFinancialGoals(parsed.financialGoals);
        if (parsed.linkedAccounts) setLinkedAccounts(parsed.linkedAccounts);
      } catch (e) { console.error("State hydration failed", e); }
    }
    
    const savedGithub = localStorage.getItem(GITHUB_STORAGE_KEY);
    if (savedGithub) {
        try { setGithubRepoFiles(JSON.parse(savedGithub)); } catch (e) { console.error('Failed to parse cached GitHub repo', e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      transactions, assets, internalAccounts, financialGoals, linkedAccounts
    }));
  }, [transactions, assets, internalAccounts, financialGoals, linkedAccounts]);

  useEffect(() => {
    const interval = setInterval(() => {
      const totalWealth = assets.reduce((sum, a) => sum + a.value, 0) + 24500000;
      setSimulationData(prev => {
        const newData = [...prev, { 
          time: new Date().toLocaleTimeString(), 
          value: totalWealth + (Math.random() - 0.5) * 50000 
        }].slice(-30);
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [assets]);

  const askSovereignAI = useCallback(async (prompt: string, modelName = 'gemini-1.5-pro') => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const model = ai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, topP: 0.95 }
        });
        return result.response.text();
    } catch (e) {
        return "Quantum AI Core synchronization interrupted. Re-establishing secure link...";
    }
  }, []);

  const broadcastEvent = useCallback((type: string, data: any) => {
      logAuditAction(`SYSTEM_EVENT_${type}`, data);
      showNotification(`System Event: ${type.replace(/_/g, ' ')}`, 'info');
  }, [showNotification, logAuditAction]);

  const fetchDirectoryContents = useCallback(async (path: string): Promise<GitHubFile[]> => {
    setIsRepoLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
      let data: GitHubFile[] = await res.json();
      return data.map(item => ({ ...item, path: item.path || `${path}/${item.name}`.replace(/\/\//g, '/') }));
    } catch (e) {
      showNotification(`Repo Error: Could not load ${path}`, 'error');
      return [];
    } finally { setIsRepoLoading(false); }
  }, [showNotification]);

  const fetchRepo = useCallback(async () => {
    setIsRepoLoading(true);
    const rootFiles = await fetchDirectoryContents(''); 
    setGithubRepoFiles(rootFiles);
    setIsRepoLoading(false);
    showNotification('Quantum Repository structure synchronized.', 'success');
    localStorage.setItem(GITHUB_STORAGE_KEY, JSON.stringify(rootFiles));
  }, [fetchDirectoryContents, showNotification]);

  const connectDatabase = useCallback(async () => {
      updateDbConfig({ connectionStatus: 'connecting' });
      await new Promise(r => setTimeout(r, 1500));
      updateDbConfig({ connectionStatus: 'connected' });
      logAuditAction('DATABASE_CONNECTED', { host: dbConfig.host });
      showNotification("Quantum Database nexus synchronized.", "success");
  }, [updateDbConfig, showNotification, logAuditAction, dbConfig.host]);

  const value: IDataContext = useMemo(() => ({
    view, activeView: view as View, setView, setActiveView: setView as (view: View) => void,
    userProfile: { id: 'USR-77-X-ALPHA', name: 'James Burvel oCallaghan III', title: 'Sovereign Architect', email: 'james@quantum.io', phone: '+1 (555) 942-0123', loyaltyTier: 'OMEGA', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', usdBalance: 2450000000, fiatBalance: 2450000000, cryptoBalance: 14200.55 },
    user: { id: 'USR-77-X-ALPHA', name: 'James Burvel oCallaghan III', title: 'Sovereign Architect', email: 'james@quantum.io', phone: '+1 (555) 942-0123', loyaltyTier: 'OMEGA', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', usdBalance: 2450000000, fiatBalance: 2450000000, cryptoBalance: 14200.55 },
    creator: { name: 'James Burvel oCallaghan III', title: 'Grand Architect of Quantum AI' },
    transactions, assets, internalAccounts, notifications, aiInsights: [], insights: [],
    budgets, rewardItems: MOCK_REWARD_ITEMS as any, apiStatus: MOCK_API_STATUS as any,
    pipelines: [
      { id: 'p-1', name: 'Quantum Ledger Sync', pipelineName: 'NEXUS_TX_FEED', status: 'SUCCESS', prettyDuration: '1.2s' },
      { id: 'p-2', name: 'Risk Vector Audit', pipelineName: 'HEURISTIC_RISK', status: 'RUNNING', prettyDuration: '240ms' }
    ],
    inboundBlobs: MOCK_INBOUND_BLOBS, 
    fundFlows: [{ id: 'f-1', name: 'Reserve Accumulation', ledgerId: 'L-771', postedTxCount: 1242, pendingTxCount: 12 }],
    authorizedApps, simulationData, geminiApiKey,
    setGeminiApiKey: (key) => { setGeminiApiKey(key); localStorage.setItem('gemini_api_key', key); },
    modernTreasuryApiKey,
    setModernTreasuryApiKey: (key) => { setModernTreasuryApiKey(key); localStorage.setItem('mt_api_key', key); },
    modernTreasuryOrganizationId,
    setModernTreasuryOrganizationId: (id) => { setModernTreasuryOrganizationId(id); localStorage.setItem('mt_org_id', id); },
    setTransactions: setTransactionsState,
    updateTransaction: (id, updates) => setTransactionsState(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)),
    deleteTransaction: (id) => setTransactionsState(prev => prev.filter(t => t.id !== id)),
    addTransaction: (tx) => setTransactionsState(prev => [tx, ...prev]),
    setAssets: setAssetsState,
    setInternalAccounts: setInternalAccountsState,
    showNotification,
    markNotificationRead: (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)),
    authorizeApp: (app) => setAuthorizedApps(prev => [...prev, { id: app.id || `app-${Date.now()}`, name: app.name || 'Unknown', description: app.description || '', status: 'active', authorizedAt: new Date().toISOString(), scopes: app.scopes }]),
    revokeApp: (id) => setAuthorizedApps(prev => prev.map(a => a.id === id ? { ...a, status: 'revoked' } : a)),
    redeemReward: (item) => { showNotification(`Redeemed ${item.name}`, 'success'); return true; },
    rewardPoints: MOCK_REWARD_POINTS,
    askSovereignAI,
    isImportingData,
    treesPlanted: 142,
    spendingForNextTree: 120,
    linkedAccounts,
    unlinkAccount: (id) => { setLinkedAccounts(prev => prev.filter(a => a.id !== id)); showNotification("Institutional link severed.", "warning"); },
    paymentOrders: [], invoices: [], complianceCases: [], corporateTransactions: [],
    creditScore: MOCK_CREDIT_SCORE,
    creditFactors: MOCK_CREDIT_FACTORS,
    financialGoals,
    addFinancialGoal: (goal) => setFinancialGoals(prev => [...prev, { id: `goal-${Date.now()}`, name: goal.name || 'New Goal', targetAmount: goal.targetAmount || 0, currentAmount: 0, targetDate: goal.targetDate || new Date().toISOString(), iconName: goal.iconName || 'default', plan: null, startDate: new Date().toISOString(), contributions: [], status: 'on_track' }]),
    generateGoalPlan: async (id) => { showNotification("Neural strategist is mapping your trajectory...", "info"); await new Promise(r => setTimeout(r, 2000)); showNotification("Strategic roadmap synthesized.", "success"); },
    addContributionToGoal: (id, amount) => setFinancialGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g)),
    addRecurringContributionToGoal: () => {},
    updateRecurringContributionInGoal: () => {},
    deleteRecurringContributionFromGoal: () => {},
    updateFinancialGoal: (id, updates) => setFinancialGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g)),
    linkGoals: () => {},
    unlinkGoals: () => {},
    isWalletConnectModalOpen,
    setWalletConnectModalOpen,
    detectedProviders,
    connectWallet: (provider) => showNotification(`Synchronized with ${provider.info.name}`, "success"),
    apiEndpoints,
    updateEndpoint: (key, value) => setApiEndpoints(prev => ({ ...prev, [key]: value })),
    sovereignCredits,
    deductCredits: (amount) => { if (sovereignCredits >= amount) { setSovereignCredits(prev => prev - amount); return true; } return false; },
    isProductionApproved: true,
    plaidProducts: ['auth', 'transactions', 'identity', 'balance'],
    isLoading: false,
    error: null,
    broadcastEvent,
    addBudget: (name, limit) => setBudgets(prev => [...prev, { id: `b-${Date.now()}`, name, limit, spent: 0, color: '#06b6d4', remaining: limit, category: name, alerts: [] }]),
    stripeApiKey: process.env.STRIPE_SECRET_KEY || null,
    marqetaCardProducts,
    fetchMarqetaProducts: async () => { setIsMarqetaLoading(true); await new Promise(r => setTimeout(r, 1000)); setMarqetaCardProducts([{ token: 'cp-1', name: 'Quantum Black', active: true, start_date: '2024-01-01', config: { fulfillment: { bin_prefix: '424242' }, poi: { other: {} } } } as any]); setIsMarqetaLoading(false); },
    isMarqetaLoading,
    marqetaApiToken,
    marqetaApiSecret,
    setMarqetaCredentials: (token, secret) => { setMarqetaApiToken(token); setMarqetaApiSecret(secret); localStorage.setItem('marqeta_token', token); localStorage.setItem('marqeta_secret', secret); },
    plaidApiKey: process.env.PLAID_SECRET || null,
    dbConfig,
    updateDbConfig,
    connectDatabase,
    webDriverStatus,
    launchWebDriver: async (task) => { setWebDriverStatus(prev => ({ ...prev, status: 'running', logs: [...prev.logs, `Starting task: ${task}`] })); await new Promise(r => setTimeout(r, 2000)); setWebDriverStatus(prev => ({ ...prev, status: 'idle', logs: [...prev.logs, `Task completed: ${task}`] })); },
    showSystemAlert: (msg, sev) => showNotification(msg, sev),
    handlePlaidSuccess: (token, meta) => showNotification(`Account linked: ${meta.institution.name}`, "success"),
    securityMetrics: MOCK_SECURITY_METRICS,
    auditLogs,
    threatAlerts: MOCK_THREAT_ALERTS,
    dataSharingPolicies: MOCK_DATA_SHARING_POLICIES,
    apiKeys: MOCK_API_KEYS,
    trustedContacts: MOCK_TRUSTED_CONTACTS,
    securityAwarenessModules: MOCK_SECURITY_AWARENESS,
    transactionRules: MOCK_TRANSACTION_RULES,
    githubRepoFiles,
    fetchRepo,
    fetchDirectory: async () => {},
    isRepoLoading,
    initiateWireTransfer,
    initiateACHTransfer,
    logAuditAction,
  }), [
    view, transactions, assets, internalAccounts, notifications, simulationData, isImportingData, financialGoals, isWalletConnectModalOpen, detectedProviders, linkedAccounts, authorizedApps, 
    geminiApiKey, modernTreasuryApiKey, modernTreasuryOrganizationId, budgets, sovereignCredits, 
    marqetaCardProducts, isMarqetaLoading, marqetaApiToken, marqetaApiSecret, 
    dbConfig, webDriverStatus, githubRepoFiles, isRepoLoading, auditLogs,
    showNotification, askSovereignAI, broadcastEvent, connectDatabase, initiateWireTransfer, initiateACHTransfer, logAuditAction, fetchRepo, updateDbConfig
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/context/DataContext.tsx
================================================================================

```typescript
// @/context/DataContext.tsx
// --- The Live Data Nexus: All Data Fetching, State, and API Interactions ---
// This file has been completely refactored to be the application's live data layer.
// It removes all mock data imports and implements real-time data fetching from a backend server.
// It manages loading/error states and provides functions to mutate data via API calls.

import React, { createContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
    Transaction, Asset, BudgetCategory, GamificationState, IllusionType,
    LinkedAccount, QuantumWeaverState, AIPlan, AIQuestion, Subscription, 
    CreditScore, UpcomingBill, SavingsGoal, MarketMover, MarketplaceProduct, 
    FinancialGoal, AIGoalPlan, CryptoAsset, VirtualCard, PaymentOperation, 
    AIInsight, CorporateCard, CorporateTransaction, RewardPoints, Notification,
    NFTAsset, RewardItem, APIStatus, CreditFactor, CorporateCardControls,
    PaymentOrder, Invoice, ComplianceCase, FinancialAnomaly, AnomalyStatus, 
    Counterparty, DynamicKpi, PaymentOrderStatus, NexusGraphData, View, 
    WeaverStage, AccessLog, FraudCase, MLModel, LoanApplication, MortgageAsset,
    ThreatIntelBrief, InsuranceClaim, RiskProfile, DataSet, DataLakeStat,
    NexusNode, NexusLink,
    SalesDeal, MarketingCampaign, GrowthMetric, Competitor, Benchmark,
    License, Disclosure, LegalDoc, SandboxExperiment, ConsentRecord,
    ContainerImage, ApiUsage, Incident, BackupJob,
    PayRun, Project, Course, Employee, PortfolioAsset,
    // --- NEW TYPES FOR EXPANSION (simulating ../types existence) ---
    RealEstateAsset, LoanAccount, InsurancePolicy, TaxFiling, EstatePlan,
    MicroLoan, FamilyBudget, AdvancedInvestment, AlgorithmicStrategy, ESGScore,
    AlternativeAsset, MarketSentiment, TreasuryForecast, SupplyChainInvoice,
    RegulatoryAlert, GlobalPayrollRun, ExpenseReport, VendorContract,
    RevenueForecast, DAOGovernance, QuantumSimulationResult, AIAgent,
    LegalAIReview, ARVRFinancialScene, APIGatewayRoute, CloudResource,
    SecurityIncident, CICDPipeline, FeatureFlag, AuditLog, ComplianceRule,
    DataRetentionPolicy, BlockchainTransaction, SmartContract, WalletConnectSession,
    MultiCurrencyAccount, FXHedge, CarbonFootprintReport, SDGImpactProject,
    BiometricProfile, QuantumKey, ZeroKnowledgeProof, DigitalIdentity,
    DigitalTwinModel, FinancialEducationModule, SocialFinanceChallenge, BehavioralNudge,
    SubscriptionUsage, SubscriptionTier, CustomReport, BIReportConfig,
    RiskAssessment, ScenarioAnalysis, PlaidWebhook, Web3GasPrice, DEXSwap,
    BridgeTransaction, DecentralizedID, NFTCollection, AssetTokenizationRecord,
    AIModelPerformance, DataStreamAnomaly, CorporateWellnessProgram,
    EmployeePerformanceMetric, LearningPath, Certification, HRPolicy,
    RecruitmentPipeline, OnboardingFlow, OffboardingChecklist, CRMLead,
    CRMContact, ERPDocument, LegalCase, GrantApplication, IoTDevice,
    PredictiveMaintenanceAlert, EnergyConsumptionData, WaterUsageData,
    WasteGenerationData, SupplyChainProvenance, GeospatialAsset, SatelliteData,
    WeatherImpactAssessment, DisasterRecoveryPlan, CyberSecurityThreat,
    VulnerabilityScanResult, PenetrationTestReport, SecurityAuditLog,
    ComplianceDashboard, RegulatoryDeadline, LegalHold, DiscoveryRequest,
    LegalResearchResult, PatentApplication, TrademarkRegistration, CopyrightAsset,
    PrivacyPolicyVersion, DataProcessingAgreement, ConsentFormTemplate,
    PersonalDataRequest, EthicalAIGuideline, BiasDetectionReport, FairnessMetric,
    ExplainabilityReport, FinancialModelAudit, ModelDriftAlert, SyntheticDataConfig,
    FederatedLearningRound, HomomorphicEncryptedData, PostQuantumCryptoStatus,
    GlobalTaxTreaty, JurisdictionProfile, LocalizedContent, SmartCityInvestment,
    InfrastructureProject, PublicPrivatePartnership, SocialImpactBond, GreenBond,
    MicrogridInvestment, CarbonCredit, RenewableEnergyCertificate, ImpactReport,
    DigitalArtAsset, VirtualLandAsset, GamingItemNFT, MetaverseIdentity,
    DecentralizedStorageFile, IPFSHash, Web3Domain, WalletActivityLog,
    SmartContractInteraction, GasFeePrediction, Layer2Solution, RollupStatus,
    OracleFeed, TokenomicsModel, StakingPool, LiquidityPool, YieldFarmingStrategy,
    InsuranceProtocolClaim, DecentralizedExchangeOrder, CrossChainBridge,
    InteroperabilityStandard, IdentityVerificationProvider, ReputationScore,
    VerifiableCredential, DIDDocument, KeyManagementSystem, HardwareWalletIntegration,
    MultiSigWalletConfig, SocialRecoveryMethod, SelfSovereignIdentityFlow,
    DataPortabilityRequest, PersonalDataVault, DataMonetizationOptIn,
    AIAssistantLog, VoiceCommandHistory, GestureControlMapping, EyeTrackingData,
    BiofeedbackMetric, NeuroInterfaceCommand, HapticFeedbackProfile,
    WearableDeviceData, SmartHomeIntegration, AutonomousVehiclePayment,
    DroneDeliveryLog, RoboticProcessAutomationTask, DigitalAssetLicense,
    ContentMonetizationMetric, CreatorEconomyPayout, FanEngagementStat,
    SubscriptionRevenueShare, AdRevenueReport, AffiliateCommission,
    CrowdfundingCampaign, PatronageModel, RevenueBasedFinancing, VentureDebt,
    StartupEquity, ExitStrategy, CapTableManagement, ShareholderAgreement,
    InvestorPitchDeck, TermSheet, DueDiligenceDocument, EscrowAgreement,
    MergerAcquisitionTarget, PostMergerIntegrationPlan, DivestitureStrategy,
    BankruptcyProceeding, RestructuringPlan, LiquidationReport,
    FinancialForensicsAudit, EdiscoveryCase, DigitalEvidenceLog,
    IncidentResponsePlaybook, BusinessContinuityPlan, DisasterRecoveryTest,
    CrisisCommunicationPlan, SupplyChainRiskAssessment, GeopoliticalRiskScore,
    ClimateRiskAssessment, PandemicResponsePlan, CyberInsurancePolicy,
    SystemHealthMetric, ResourceUtilization, ServiceLevelAgreement, ErrorRateTrend,
    LatencyReport, ThroughputMetric, CostOptimizationReport,
    CarbonFootprintOptimization, EnergyEfficiencyScore, SustainableCodingPractice,
    GreenITReport, CircularEconomyMetric, RecyclingProgram, WasteReductionTarget,
    EthicalSupplyChainAudit, LaborPracticeReport, DiversityInclusionMetric,
    SocialImpactScore, CommunityInvestment, VolunteerHours, PhilanthropicDonation,
    GrantFunding, ImpactInvestmentFund, MicrofinanceInitiative,
    SocialEnterpriseKPI, NonProfitGovernance, FundraisingCampaign,
    DonorRelationManagement, EndowmentFund, ScholarshipProgram, ResearchGrant,
    PublicFundingApplication, PoliticalLobbyingSpend, RegulatoryAdvocacy,
    PolicyImpactAnalysis, GovernmentContract, PublicSectorProject,
    CivicEngagementMetric, SmartGovernmentInitiative, CitizenFeedbackPlatform,
    OpenDataPortal, EGovernanceService, DigitalVotingSystem,
    PublicKeyInfrastructure, DecentralizedPublicRecord, TokenizedIdentity,
    BiometricVote, AIJudicialAssistant, PredictivePolicingAnalysis,
    SocialCreditScore, UniversalBasicIncomeTrial, DecentralizedAutonomousGovernment,
    PlanetaryResourceTracker, SpaceEconomyInvestment, AsteroidMiningClaim,
    LunarRealEstateDeed, OrbitalDebrisTracker, SpaceTravelInsurance,
    AlienContactProtocolFunding
} from '../types'; 

// Import all mock data directly
import * as MockData from '../data';


interface IDataContext {
  // Loading & Error states
  isLoading: boolean;
  error: string | null;

  // Personal Finance
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  assets: Asset[];
  portfolioAssets: PortfolioAsset[];
  impactInvestments: Asset[];
  budgets: BudgetCategory[];
  addBudget: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => void;
  financialGoals: FinancialGoal[];
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id' | 'currentAmount' | 'plan' | 'progressHistory'>) => void;
  generateGoalPlan: (goalId: string) => Promise<void>;
  subscriptions: Subscription[];
  upcomingBills: UpcomingBill[];
  savingsGoals: SavingsGoal[];
  
  // Gamification & Rewards
  gamification: GamificationState | null;
  rewardPoints: RewardPoints | null;
  rewardItems: RewardItem[];
  redeemReward: (item: RewardItem) => boolean;
  
  // Credit & Health
  creditScore: CreditScore | null;
  creditFactors: CreditFactor[];
  
  // UI & Personalization
  customBackgroundUrl: string | null;
  setCustomBackgroundUrl: (url: string) => void;
  activeIllusion: IllusionType;
  setActiveIllusion: (illusion: IllusionType) => void;
  
  // AI & Platform
  aiInsights: AIInsight[];
  isInsightsLoading: boolean;
  generateDashboardInsights: () => Promise<void>;
  marketplaceProducts: MarketplaceProduct[];
  isMarketplaceLoading: boolean;
  fetchMarketplaceProducts: () => Promise<void>;
  addProductToTransactions: (product: MarketplaceProduct) => void;
  dynamicKpis: DynamicKpi[];
  addDynamicKpi: (kpi: DynamicKpi) => void;
  getNexusData: () => NexusGraphData;


  // Crypto & Web3
  cryptoAssets: CryptoAsset[];
  nftAssets: NFTAsset[];
  paymentOperations: PaymentOperation[];
  walletInfo: any | null; // Simplified
  connectWallet: () => void;
  virtualCard: VirtualCard | null;
  issueCard: () => void;
  buyCrypto: (amount: number, currency: string) => void;
  mintNFT: (name: string, imageUrl: string) => void;

  // Corporate Finance
  corporateCards: CorporateCard[];
  corporateTransactions: CorporateTransaction[];
  paymentOrders: PaymentOrder[];
  updatePaymentOrderStatus: (orderId: string, status: PaymentOrderStatus) => void;
  invoices: Invoice[];
  complianceCases: ComplianceCase[];
  financialAnomalies: FinancialAnomaly[];
  updateAnomalyStatus: (anomalyId: string, status: AnomalyStatus) => void;
  counterparties: Counterparty[];
  toggleCorporateCardFreeze: (cardId: string) => void;
  updateCorporateCardControls: (cardId: string, controls: CorporateCardControls) => void;
  payRuns: PayRun[];


  // Mega Dashboard Data
  accessLogs: AccessLog[];
  fraudCases: FraudCase[];
  updateFraudCaseStatus: (caseId: string, status: FraudCase['status']) => void;
  mlModels: MLModel[];
  retrainMlModel: (modelId: string) => void;
  loanApplications: LoanApplication[];
  mortgageAssets: MortgageAsset[];
  threatIntelBriefs: ThreatIntelBrief[];
  insuranceClaims: InsuranceClaim[];
  riskProfiles: RiskProfile[];
  dataCatalogItems: DataSet[];
  dataLakeStats: DataLakeStat[];
  salesDeals: SalesDeal[];
  marketingCampaigns: MarketingCampaign[];
  growthMetrics: GrowthMetric[];
  competitors: Competitor[];
  benchmarks: Benchmark[];
  licenses: License[];
  disclosures: Disclosure[];
  legalDocs: LegalDoc[];
  sandboxExperiments: SandboxExperiment[];
  consentRecords: ConsentRecord[];
  containerImages: ContainerImage[];
  apiUsage: ApiUsage[];
  incidents: Incident[];
  backupJobs: BackupJob[];

  // Demo Bank Platform
  projects: Project[];
  courses: Course[];
  employees: Employee[];

  // System & Misc
  impactData: { treesPlanted: number; progressToNextTree: number; };
  linkedAccounts: LinkedAccount[];
  isImportingData: boolean;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  unlinkAccount: (accountId: string) => void;
  marketMovers: MarketMover[];
  notifications: Notification[];
  markNotificationRead: (notificationId: string) => void;
  apiStatus: APIStatus[];

  // Paywall
  unlockedFeatures: Set<View>;
  unlockFeature: (view: View) => void;

  // New functions to interact with backend
  refetchData: () => void;
  // FIX: Add missing generateApiKey function to the context interface.
  generateApiKey: () => Promise<void>;

  // --- START NEW EXPANSION ---

  // Advanced Personal Finance & Wealth Management
  realEstateAssets: RealEstateAsset[];
  addRealEstateAsset: (asset: Omit<RealEstateAsset, 'id'>) => Promise<void>;
  loanAccounts: LoanAccount[];
  applyForLoan: (loanDetails: Omit<LoanAccount, 'id' | 'status' | 'balance'>) => Promise<void>;
  insurancePolicies: InsurancePolicy[];
  fileInsuranceClaim: (policyId: string, details: string) => Promise<void>;
  taxFilings: TaxFiling[];
  generateTaxReport: (year: number) => Promise<TaxFiling>;
  estatePlan: EstatePlan | null;
  updateEstatePlan: (plan: EstatePlan) => Promise<void>;
  microLoans: MicroLoan[];
  offerMicroLoan: (loan: Omit<MicroLoan, 'id' | 'status' | 'repaidAmount'>) => Promise<void>;
  familyBudgets: FamilyBudget[];
  createFamilyBudget: (budget: Omit<FamilyBudget, 'id' | 'members' | 'spent'>) => Promise<void>;
  scenarioAnalyses: ScenarioAnalysis[];
  runFinancialScenario: (scenarioConfig: any) => Promise<ScenarioAnalysis>;

  // Advanced Investments & Trading
  advancedInvestments: AdvancedInvestment[];
  executeTrade: (investment: Omit<AdvancedInvestment, 'id'>) => Promise<void>;
  algorithmicStrategies: AlgorithmicStrategy[];
  deployAlgorithmicStrategy: (strategy: AlgorithmicStrategy) => Promise<void>;
  esgScores: ESGScore[];
  getESGScore: (assetId: string) => Promise<ESGScore>;
  alternativeAssets: AlternativeAsset[];
  investInAlternativeAsset: (asset: Omit<AlternativeAsset, 'id'>) => Promise<void>;
  marketSentiment: MarketSentiment | null;
  fetchMarketSentiment: () => Promise<void>;
  
  // AI-Powered Financial Intelligence
  aiModelPerformances: AIModelPerformance[];
  optimizeAIModel: (modelId: string) => Promise<void>;
  dataStreamAnomalies: DataStreamAnomaly[];
  detectDataStreamAnomalies: () => Promise<void>;
  ethicalAIGuidelines: EthicalAIGuideline[];
  biasDetectionReports: BiasDetectionReport[];
  generateBiasDetectionReport: (modelId: string) => Promise<BiasDetectionReport>;
  fairnessMetrics: FairnessMetric[];
  explainabilityReports: ExplainabilityReport[];
  getExplainabilityReport: (modelId: string, insightId: string) => Promise<ExplainabilityReport>;
  financialModelAudits: FinancialModelAudit[];
  conductFinancialModelAudit: (modelId: string) => Promise<FinancialModelAudit>;
  modelDriftAlerts: ModelDriftAlert[];
  syntheticDataConfigs: SyntheticDataConfig[];
  generateSyntheticData: (config: SyntheticDataConfig) => Promise<void>;
  federatedLearningRounds: FederatedLearningRound[];
  initiateFederatedLearning: (roundConfig: any) => Promise<void>;
  aiAssistantLogs: AIAssistantLog[];
  processVoiceCommand: (command: string) => Promise<AIAssistantLog>;

  // Corporate & Global Operations
  treasuryForecasts: TreasuryForecast[];
  generateTreasuryForecast: (period: string) => Promise<TreasuryForecast>;
  supplyChainInvoices: SupplyChainInvoice[];
  processSupplyChainInvoice: (invoice: Omit<SupplyChainInvoice, 'id' | 'status'>) => Promise<void>;
  regulatoryAlerts: RegulatoryAlert[];
  fetchRegulatoryAlerts: () => Promise<void>;
  globalPayrollRuns: GlobalPayrollRun[];
  initiateGlobalPayrollRun: (runDetails: Omit<GlobalPayrollRun, 'id' | 'status'>) => Promise<void>;
  expenseReports: ExpenseReport[];
  submitExpenseReport: (report: Omit<ExpenseReport, 'id' | 'status'>) => Promise<void>;
  vendorContracts: VendorContract[];
  reviewVendorContract: (contractId: string) => Promise<void>;
  revenueForecasts: RevenueForecast[];
  generateRevenueForecast: (period: string) => Promise<RevenueForecast>;
  auditLogs: AuditLog[];
  fetchAuditLogs: (filters: any) => Promise<AuditLog[]>;
  complianceRules: ComplianceRule[];
  addComplianceRule: (rule: Omit<ComplianceRule, 'id'>) => Promise<void>;
  dataRetentionPolicies: DataRetentionPolicy[];
  updateDataRetentionPolicy: (policy: DataRetentionPolicy) => Promise<void>;
  hrPolicies: HRPolicy[];
  updateHRPolicy: (policy: HRPolicy) => Promise<void>;
  recruitmentPipelines: RecruitmentPipeline[];
  onboardingFlows: OnboardingFlow[];
  offboardingChecklists: OffboardingChecklist[];
  crmLeads: CRMLead[];
  addCRMLead: (lead: Omit<CRMLead, 'id'>) => Promise<void>;
  crmContacts: CRMContact[];
  updateCRMContact: (contact: CRMContact) => Promise<void>;
  erpDocuments: ERPDocument[];
  syncERPDocument: (doc: ERPDocument) => Promise<void>;
  legalCases: LegalCase[];
  openLegalCase: (caseDetails: Omit<LegalCase, 'id' | 'status'>) => Promise<void>;
  grantApplications: GrantApplication[];
  submitGrantApplication: (application: Omit<GrantApplication, 'id' | 'status'>) => Promise<void>;
  iotDevices: IoTDevice[];
  registerIoTDevice: (device: Omit<IoTDevice, 'id' | 'status'>) => Promise<void>;
  predictiveMaintenanceAlerts: PredictiveMaintenanceAlert[];
  acknowledgeMaintenanceAlert: (alertId: string) => Promise<void>;
  energyConsumptionData: EnergyConsumptionData[];
  trackEnergyConsumption: (data: EnergyConsumptionData) => Promise<void>;
  supplyChainProvenances: SupplyChainProvenance[];
  recordSupplyChainProvenance: (data: SupplyChainProvenance) => Promise<void>;
  geospatialAssets: GeospatialAsset[];
  updateGeospatialAsset: (asset: GeospatialAsset) => Promise<void>;
  weatherImpactAssessments: WeatherImpactAssessment[];
  assessWeatherImpact: (location: string) => Promise<WeatherImpactAssessment>;
  disasterRecoveryPlans: DisasterRecoveryPlan[];
  activateDisasterRecoveryPlan: (planId: string) => Promise<void>;
  cyberSecurityThreats: CyberSecurityThreat[];
  reportCyberSecurityThreat: (threat: Omit<CyberSecurityThreat, 'id' | 'status'>) => Promise<void>;
  vulnerabilityScanResults: VulnerabilityScanResult[];
  runVulnerabilityScan: (target: string) => Promise<VulnerabilityScanResult>;
  penetrationTestReports: PenetrationTestReport[];
  requestPenTest: (scope: string) => Promise<PenetrationTestReport>;
  securityAuditLogs: SecurityAuditLog[];
  fetchSecurityAuditLogs: (filters: any) => Promise<SecurityAuditLog[]>;
  complianceDashboards: ComplianceDashboard[];
  generateComplianceDashboard: (dashboardId: string) => Promise<ComplianceDashboard>;
  regulatoryDeadlines: RegulatoryDeadline[];
  addRegulatoryDeadline: (deadline: Omit<RegulatoryDeadline, 'id'>) => Promise<void>;
  legalHolds: LegalHold[];
  initiateLegalHold: (caseId: string, scope: string) => Promise<void>;
  discoveryRequests: DiscoveryRequest[];
  respondToDiscoveryRequest: (requestId: string) => Promise<void>;
  legalResearchResults: LegalResearchResult[];
  conductLegalResearch: (query: string) => Promise<LegalResearchResult>;
  patentApplications: PatentApplication[];
  filePatentApplication: (app: Omit<PatentApplication, 'id' | 'status'>) => Promise<void>;
  trademarkRegistrations: TrademarkRegistration[];
  registerTrademark: (reg: Omit<TrademarkRegistration, 'id' | 'status'>) => Promise<void>;
  copyrightAssets: CopyrightAsset[];
  registerCopyright: (asset: Omit<CopyrightAsset, 'id' | 'status'>) => Promise<void>;
  privacyPolicyVersions: PrivacyPolicyVersion[];
  updatePrivacyPolicy: (policy: Omit<PrivacyPolicyVersion, 'id' | 'version'>) => Promise<void>;
  dataProcessingAgreements: DataProcessingAgreement[];
  generateDPA: (parties: string[]) => Promise<DataProcessingAgreement>;
  consentFormTemplates: ConsentFormTemplate[];
  createConsentFormTemplate: (template: Omit<ConsentFormTemplate, 'id'>) => Promise<void>;
  personalDataRequests: PersonalDataRequest[];
  processPersonalDataRequest: (requestId: string) => Promise<void>;
  globalTaxTreaties: GlobalTaxTreaty[];
  fetchGlobalTaxTreaties: () => Promise<GlobalTaxTreaty[]>;
  jurisdictionProfiles: JurisdictionProfile[];
  fetchJurisdictionProfile: (countryCode: string) => Promise<JurisdictionProfile>;
  localizedContent: LocalizedContent[];
  generateLocalizedContent: (contentId: string, language: string) => Promise<LocalizedContent>;
  governmentContracts: GovernmentContract[];
  bidGovernmentContract: (contract: Omit<GovernmentContract, 'id' | 'status'>) => Promise<void>;
  publicKeyInfrastructures: PublicKeyInfrastructure[];
  deployPKI: (config: any) => Promise<PublicKeyInfrastructure>;
  digitalVotingSystems: DigitalVotingSystem[];
  monitorDigitalVoting: (systemId: string) => Promise<void>;
  tokenizedIdentities: TokenizedIdentity[];
  issueTokenizedIdentity: (userId: string) => Promise<TokenizedIdentity>;
  biometricProfiles: BiometricProfile[];
  registerBiometricProfile: (userId: string, data: any) => Promise<BiometricProfile>;
  quantumKeys: QuantumKey[];
  generateQuantumKey: () => Promise<QuantumKey>;
  zeroKnowledgeProofs: ZeroKnowledgeProof[];
  generateZeroKnowledgeProof: (data: any) => Promise<ZeroKnowledgeProof>;
  digitalIdentities: DigitalIdentity[];
  verifyDigitalIdentity: (did: string) => Promise<boolean>;
  digitalTwinModels: DigitalTwinModel[];
  createDigitalTwin: (assetId: string, model: any) => Promise<DigitalTwinModel>;
  homomorphicEncryptedData: HomomorphicEncryptedData[];
  encryptDataHomomorphically: (data: any) => Promise<HomomorphicEncryptedData>;
  postQuantumCryptoStatus: PostQuantumCryptoStatus[];
  checkPostQuantumCryptoStatus: () => Promise<PostQuantumCryptoStatus>;
  quantumSimulationResults: QuantumSimulationResult[];
  runQuantumSimulation: (config: any) => Promise<QuantumSimulationResult>;
  aiAgents: AIAgent[];
  deployAIAgent: (agent: Omit<AIAgent, 'id' | 'status'>) => Promise<void>;
  legalAIReviews: LegalAIReview[];
  requestLegalAIReview: (documentId: string) => Promise<LegalAIReview>;
  arvrFinancialScenes: ARVRFinancialScene[];
  renderARVRFinancialScene: (sceneConfig: any) => Promise<ARVRFinancialScene>;
  apiGatewayRoutes: APIGatewayRoute[];
  configureAPIGatewayRoute: (route: Omit<APIGatewayRoute, 'id'>) => Promise<void>;
  cloudResources: CloudResource[];
  optimizeCloudResources: () => Promise<void>;
  securityIncidents: SecurityIncident[];
  resolveSecurityIncident: (incidentId: string) => Promise<void>;
  cicdPipelines: CICDPipeline[];
  triggerCICDPipeline: (pipelineId: string) => Promise<void>;
  featureFlags: FeatureFlag[];
  toggleFeatureFlag: (flagId: string, enabled: boolean) => Promise<void>;
  systemHealthMetrics: SystemHealthMetric[];
  fetchSystemHealthMetrics: () => Promise<SystemHealthMetric[]>;
  resourceUtilization: ResourceUtilization[];
  getRecentResourceUtilization: () => Promise<ResourceUtilization[]>;
  serviceLevelAgreements: ServiceLevelAgreement[];
  defineSLA: (sla: Omit<ServiceLevelAgreement, 'id'>) => Promise<void>;
  errorRateTrends: ErrorRateTrend[];
  getDailyErrorRateTrend: () => Promise<ErrorRateTrend[]>;
  latencyReports: LatencyReport[];
  getAverageLatencyReport: () => Promise<LatencyReport>;
  throughputMetrics: ThroughputMetric[];
  getHourlyThroughputMetrics: () => Promise<ThroughputMetric[]>;
  costOptimizationReports: CostOptimizationReport[];
  generateCostOptimizationReport: (period: string) => Promise<CostOptimizationReport>;

  // Web3 & DeFi Ecosystem
  blockchainTransactions: BlockchainTransaction[];
  broadcastBlockchainTransaction: (tx: Omit<BlockchainTransaction, 'id' | 'status'>) => Promise<void>;
  smartContracts: SmartContract[];
  deploySmartContract: (code: string) => Promise<SmartContract>;
  walletConnectSessions: WalletConnectSession[];
  initiateWalletConnectSession: (dappUrl: string) => Promise<WalletConnectSession>;
  web3GasPrices: Web3GasPrice | null;
  fetchWeb3GasPrices: () => Promise<void>;
  dexSwaps: DEXSwap[];
  executeDEXSwap: (swap: Omit<DEXSwap, 'id' | 'status'>) => Promise<void>;
  bridgeTransactions: BridgeTransaction[];
  initiateBridgeTransaction: (tx: Omit<BridgeTransaction, 'id' | 'status'>) => Promise<void>;
  decentralizedIDs: DecentralizedID[];
  createDecentralizedID: (publicKey: string) => Promise<DecentralizedID>;
  nftCollections: NFTCollection[];
  createNFTCollection: (name: string, symbol: string) => Promise<NFTCollection>;
  assetTokenizationRecords: AssetTokenizationRecord[];
  tokenizeAsset: (asset: any) => Promise<AssetTokenizationRecord>;
  metaverseIdentities: MetaverseIdentity[];
  createMetaverseIdentity: (avatarDetails: any) => Promise<MetaverseIdentity>;
  decentralizedStorageFiles: DecentralizedStorageFile[];
  uploadToDecentralizedStorage: (file: any) => Promise<DecentralizedStorageFile>;
  ipfsHashes: IPFSHash[];
  resolveIPFSHash: (hash: string) => Promise<any>;
  web3Domains: Web3Domain[];
  registerWeb3Domain: (name: string) => Promise<Web3Domain>;
  walletActivityLogs: WalletActivityLog[];
  fetchWalletActivityLogs: (address: string) => Promise<WalletActivityLog[]>;
  smartContractInteractions: SmartContractInteraction[];
  executeSmartContractInteraction: (interaction: Omit<SmartContractInteraction, 'id' | 'status'>) => Promise<void>;
  gasFeePredictions: GasFeePrediction | null;
  fetchGasFeePredictions: () => Promise<void>;
  layer2Solutions: Layer2Solution[];
  onboardToLayer2Solution: (solutionId: string) => Promise<void>;
  rollupStatus: RollupStatus[];
  getRollupStatus: (rollupId: string) => Promise<RollupStatus>;
  oracleFeeds: OracleFeed[];
  subscribeToOracleFeed: (feedId: string) => Promise<void>;
  tokenomicsModels: TokenomicsModel[];
  simulateTokenomicsModel: (model: any) => Promise<TokenomicsModel>;
  stakingPools: StakingPool[];
  joinStakingPool: (poolId: string, amount: number) => Promise<void>;
  liquidityPools: LiquidityPool[];
  addLiquidity: (poolId: string, amountA: number, amountB: number) => Promise<void>;
  yieldFarmingStrategies: YieldFarmingStrategy[];
  deployYieldFarmingStrategy: (strategy: Omit<YieldFarmingStrategy, 'id'>) => Promise<void>;
  insuranceProtocolClaims: InsuranceProtocolClaim[];
  fileInsuranceProtocolClaim: (claim: Omit<InsuranceProtocolClaim, 'id' | 'status'>) => Promise<void>;
  decentralizedExchangeOrders: DecentralizedExchangeOrder[];
  placeDEXOrder: (order: Omit<DecentralizedExchangeOrder, 'id' | 'status'>) => Promise<void>;
  crossChainBridges: CrossChainBridge[];
  initiateCrossChainBridge: (bridge: Omit<CrossChainBridge, 'id' | 'status'>) => Promise<void>;
  interoperabilityStandards: InteroperabilityStandard[];
  adoptInteroperabilityStandard: (standardId: string) => Promise<void>;
  identityVerificationProviders: IdentityVerificationProvider[];
  integrateIdentityVerificationProvider: (providerId: string) => Promise<void>;
  reputationScores: ReputationScore[];
  fetchReputationScore: (entityId: string) => Promise<ReputationScore>;
  verifiableCredentials: VerifiableCredential[];
  issueVerifiableCredential: (credential: Omit<VerifiableCredential, 'id'>) => Promise<void>;
  didDocuments: DIDDocument[];
  publishDIDDocument: (doc: Omit<DIDDocument, 'id'>) => Promise<void>;
  keyManagementSystems: KeyManagementSystem[];
  integrateKMS: (kmsConfig: any) => Promise<void>;
  hardwareWalletIntegrations: HardwareWalletIntegration[];
  connectHardwareWallet: (device: string) => Promise<void>;
  multiSigWalletConfigs: MultiSigWalletConfig[];
  createMultiSigWallet: (config: Omit<MultiSigWalletConfig, 'id'>) => Promise<void>;
  socialRecoveryMethods: SocialRecoveryMethod[];
  configureSocialRecovery: (method: Omit<SocialRecoveryMethod, 'id'>) => Promise<void>;
  selfSovereignIdentityFlows: SelfSovereignIdentityFlow[];
  initiateSSIOnboarding: (flowConfig: any) => Promise<void>;
  dataPortabilityRequests: DataPortabilityRequest[];
  processDataPortabilityRequest: (requestId: string) => Promise<void>;
  personalDataVaults: PersonalDataVault[];
  createPersonalDataVault: (userId: string) => Promise<PersonalDataVault>;
  dataMonetizationOptIns: DataMonetizationOptIn[];
  toggleDataMonetizationOptIn: (userId: string, optIn: boolean) => Promise<void>;

  // Sustainability & Impact v2
  carbonFootprintReports: CarbonFootprintReport[];
  generateCarbonFootprintReport: (scope: string) => Promise<CarbonFootprintReport>;
  sdgImpactProjects: SDGImpactProject[];
  investInSDGProject: (projectId: string, amount: number) => Promise<void>;
  impactReports: ImpactReport[];
  generateImpactReport: (period: string) => Promise<ImpactReport>;
  carbonCreditBalance: CarbonCredit[];
  purchaseCarbonCredits: (amount: number, type: string) => Promise<void>;
  renewableEnergyCertificates: RenewableEnergyCertificate[];
  redeemRenewableEnergyCertificate: (certId: string) => Promise<void>;
  energyEfficiencyScores: EnergyEfficiencyScore[];
  assessEnergyEfficiency: (assetId: string) => Promise<EnergyEfficiencyScore>;
  sustainableCodingPractices: SustainableCodingPractice[];
  implementSustainableCodingPractice: (practice: Omit<SustainableCodingPractice, 'id'>) => Promise<void>;
  greenITReports: GreenITReport[];
  generateGreenITReport: (scope: string) => Promise<GreenITReport>;
  circularEconomyMetrics: CircularEconomyMetric[];
  trackCircularEconomyMetric: (metric: Omit<CircularEconomyMetric, 'id'>) => Promise<void>;
  recyclingPrograms: RecyclingProgram[];
  launchRecyclingProgram: (program: Omit<RecyclingProgram, 'id'>) => Promise<void>;
  wasteReductionTargets: WasteReductionTarget[];
  setWasteReductionTarget: (target: Omit<WasteReductionTarget, 'id'>) => Promise<void>;
  ethicalSupplyChainAudits: EthicalSupplyChainAudit[];
  conductEthicalSupplyChainAudit: (supplierId: string) => Promise<EthicalSupplyChainAudit>;
  laborPracticeReports: LaborPracticeReport[];
  generateLaborPracticeReport: (region: string) => Promise<LaborPracticeReport>;
  diversityInclusionMetrics: DiversityInclusionMetric[];
  trackDiversityInclusionMetrics: (data: Omit<DiversityInclusionMetric, 'id'>) => Promise<void>;
  socialImpactScores: SocialImpactScore[];
  calculateSocialImpactScore: (entityId: string) => Promise<SocialImpactScore>;
  communityInvestments: CommunityInvestment[];
  makeCommunityInvestment: (investment: Omit<CommunityInvestment, 'id'>) => Promise<void>;
  volunteerHours: VolunteerHours[];
  logVolunteerHours: (log: Omit<VolunteerHours, 'id'>) => Promise<void>;
  philanthropicDonations: PhilanthropicDonation[];
  makePhilanthropicDonation: (donation: Omit<PhilanthropicDonation, 'id'>) => Promise<void>;
  grantFunding: GrantFunding[];
  applyForGrantFunding: (grant: Omit<GrantFunding, 'id' | 'status'>) => Promise<void>;
  impactInvestmentFunds: ImpactInvestmentFund[];
  createImpactInvestmentFund: (fund: Omit<ImpactInvestmentFund, 'id'>) => Promise<void>;
  microfinanceInitiatives: MicrofinanceInitiative[];
  launchMicrofinanceInitiative: (initiative: Omit<MicrofinanceInitiative, 'id'>) => Promise<void>;
  socialEnterpriseKPIs: SocialEnterpriseKPI[];
  trackSocialEnterpriseKPI: (kpi: Omit<SocialEnterpriseKPI, 'id'>) => Promise<void>;
  nonProfitGovernance: NonProfitGovernance[];
  updateNonProfitGovernance: (governance: NonProfitGovernance) => Promise<void>;
  fundraisingCampaigns: FundraisingCampaign[];
  launchFundraisingCampaign: (campaign: Omit<FundraisingCampaign, 'id' | 'raisedAmount'>) => Promise<void>;
  donorRelationManagement: DonorRelationManagement[];
  logDonorInteraction: (interaction: Omit<DonorRelationManagement, 'id'>) => Promise<void>;
  endowmentFunds: EndowmentFund[];
  createEndowmentFund: (fund: Omit<EndowmentFund, 'id'>) => Promise<void>;
  scholarshipPrograms: ScholarshipProgram[];
  launchScholarshipProgram: (program: Omit<ScholarshipProgram, 'id' | 'awardedAmount'>) => Promise<void>;
  researchGrants: ResearchGrant[];
  applyForResearchGrant: (grant: Omit<ResearchGrant, 'id' | 'status'>) => Promise<void>;
  publicFundingApplications: PublicFundingApplication[];
  submitPublicFundingApplication: (app: Omit<PublicFundingApplication, 'id' | 'status'>) => Promise<void>;
  politicalLobbyingSpend: PoliticalLobbyingSpend[];
  recordLobbyingSpend: (spend: Omit<PoliticalLobbyingSpend, 'id'>) => Promise<void>;
  regulatoryAdvocacy: RegulatoryAdvocacy[];
  engageInRegulatoryAdvocacy: (advocacy: Omit<RegulatoryAdvocacy, 'id'>) => Promise<void>;
  policyImpactAnalyses: PolicyImpactAnalysis[];
  conductPolicyImpactAnalysis: (policy: any) => Promise<PolicyImpactAnalysis>;
  smartCityInvestments: SmartCityInvestment[];
  makeSmartCityInvestment: (investment: Omit<SmartCityInvestment, 'id'>) => Promise<void>;
  infrastructureProjects: InfrastructureProject[];
  fundInfrastructureProject: (project: Omit<InfrastructureProject, 'id' | 'status'>) => Promise<void>;
  publicPrivatePartnerships: PublicPrivatePartnership[];
  formPublicPrivatePartnership: (partnership: Omit<PublicPrivatePartnership, 'id'>) => Promise<void>;
  socialImpactBonds: SocialImpactBond[];
  investInSocialImpactBond: (bond: Omit<SocialImpactBond, 'id'>) => Promise<void>;
  greenBonds: GreenBond[];
  issueGreenBond: (bond: Omit<GreenBond, 'id'>) => Promise<void>;
  microgridInvestments: MicrogridInvestment[];
  investInMicrogrid: (investment: Omit<MicrogridInvestment, 'id'>) => Promise<void>;

  // Global & Multi-Currency Finance
  multiCurrencyAccounts: MultiCurrencyAccount[];
  openMultiCurrencyAccount: (currency: string) => Promise<void>;
  fxHedges: FXHedge[];
  createFXHedge: (hedge: Omit<FXHedge, 'id' | 'status'>) => Promise<void>;

  // Emerging Tech & Future Finance
  planetaryResourceTracker: PlanetaryResourceTracker | null;
  fetchPlanetaryResourceData: () => Promise<void>;
  spaceEconomyInvestments: SpaceEconomyInvestment[];
  investInSpaceEconomy: (investment: Omit<SpaceEconomyInvestment, 'id'>) => Promise<void>;
  asteroidMiningClaims: AsteroidMiningClaim[];
  fileAsteroidMiningClaim: (claim: Omit<AsteroidMiningClaim, 'id' | 'status'>) => Promise<void>;
  lunarRealEstateDeeds: LunarRealEstateDeed[];
  purchaseLunarRealEstate: (deed: Omit<LunarRealEstateDeed, 'id' | 'owner'>) => Promise<void>;
  orbitalDebrisTracker: OrbitalDebrisTracker | null;
  fetchOrbitalDebrisData: () => Promise<void>;
  spaceTravelInsurance: SpaceTravelInsurance[];
  buySpaceTravelInsurance: (policy: Omit<SpaceTravelInsurance, 'id' | 'status'>) => Promise<void>;
  alienContactProtocolFunding: AlienContactProtocolFunding[];
  fundAlienContactProtocol: (funding: Omit<AlienContactProtocolFunding, 'id'>) => Promise<void>;

  // Education & Behavioral Finance
  financialEducationModules: FinancialEducationModule[];
  completeFinancialEducationModule: (moduleId: string) => Promise<void>;
  socialFinanceChallenges: SocialFinanceChallenge[];
  joinSocialFinanceChallenge: (challengeId: string) => Promise<void>;
  behavioralNudges: BehavioralNudge[];
  applyBehavioralNudge: (nudgeType: string) => Promise<void>;

  // Customer & Platform Management
  subscriptionUsages: SubscriptionUsage[];
  trackSubscriptionUsage: (usage: Omit<SubscriptionUsage, 'id'>) => Promise<void>;
  subscriptionTiers: SubscriptionTier[];
  upgradeSubscriptionTier: (tierId: string) => Promise<void>;
  customReports: CustomReport[];
  generateCustomReport: (config: BIReportConfig) => Promise<CustomReport>;
  biReportConfigs: BIReportConfig[];
  createBIReportConfig: (config: Omit<BIReportConfig, 'id'>) => Promise<void>;
  riskAssessments: RiskAssessment[];
  conductRiskAssessment: (entityId: string) => Promise<RiskAssessment>;
  plaidWebhooks: PlaidWebhook[];
  processPlaidWebhook: (webhook: PlaidWebhook) => Promise<void>;

}

export const DataContext = createContext<IDataContext | undefined>(undefined);


export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    // All data states, initialized as empty
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([]);
    const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
    const [impactInvestments, setImpactInvestments] = useState<Asset[]>([]);
    const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>([]);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
    const [gamification, setGamification] = useState<GamificationState | null>(null);
    const [rewardPoints, setRewardPoints] = useState<RewardPoints | null>(null);
    const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);
    const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
    const [creditFactors, setCreditFactors] = useState<CreditFactor[]>([]);
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [isInsightsLoading, setIsInsightsLoading] = useState(false);
    const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>([]);
    const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false);
    const [dynamicKpis, setDynamicKpis] = useState<DynamicKpi[]>([]);
    const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([]);
    const [nftAssets, setNftAssets] = useState<NFTAsset[]>([]);
    const [paymentOperations, setPaymentOperations] = useState<PaymentOperation[]>([]);
    const [walletInfo, setWalletInfo] = useState<any | null>(null);
    const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);
    const [corporateCards, setCorporateCards] = useState<CorporateCard[]>([]);
    const [corporateTransactions, setCorporateTransactions] = useState<CorporateTransaction[]>([]);
    const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [complianceCases, setComplianceCases] = useState<ComplianceCase[]>([]);
    const [financialAnomalies, setFinancialAnomalies] = useState<FinancialAnomaly[]>([]);
    const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
    const [payRuns, setPayRuns] = useState<PayRun[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
    const [fraudCases, setFraudCases] = useState<FraudCase[]>([]);
    const [mlModels, setMlModels] = useState<MLModel[]>([]);
    const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
    const [mortgageAssets, setMortgageAssets] = useState<MortgageAsset[]>([]);
    const [threatIntelBriefs, setThreatIntelBriefs] = useState<ThreatIntelBrief[]>([]);
    const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>([]);
    const [riskProfiles, setRiskProfiles] = useState<RiskProfile[]>([]);
    const [dataCatalogItems, setDataCatalogItems] = useState<DataSet[]>([]);
    const [dataLakeStats, setDataLakeStats] = useState<DataLakeStat[]>([]);
    const [salesDeals, setSalesDeals] = useState<SalesDeal[]>([]);
    const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>([]);
    const [growthMetrics, setGrowthMetrics] = useState<GrowthMetric[]>([]);
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
    const [licenses, setLicenses] = useState<License[]>([]);
    const [disclosures, setDisclosures] = useState<Disclosure[]>([]);
    const [legalDocs, setLegalDocs] = useState<LegalDoc[]>([]);
    const [sandboxExperiments, setSandboxExperiments] = useState<SandboxExperiment[]>([]);
    const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
    const [containerImages, setContainerImages] = useState<ContainerImage[]>([]);
    const [apiUsage, setApiUsage] = useState<ApiUsage[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [backupJobs, setBackupJobs] = useState<BackupJob[]>([]);
    const [impactData, setImpactData] = useState({ treesPlanted: 0, progressToNextTree: 0 });
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
    const [isImportingData, setIsImportingData] = useState(false);
    const [marketMovers, setMarketMovers] = useState<MarketMover[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [apiStatus, setApiStatus] = useState<APIStatus[]>([]);
    
    const [customBackgroundUrl, setCustomBackgroundUrlState] = useState<string | null>(() => localStorage.getItem('customBackgroundUrl'));
    const [activeIllusion, setActiveIllusionState] = useState<IllusionType>(() => (localStorage.getItem('activeIllusion') as IllusionType) || 'none');
    const [unlockedFeatures, setUnlockedFeatures] = useState<Set<View>>(() => new Set<View>([View.Dashboard, View.DeveloperApiKeys]));
    
    // --- START NEW EXPANSION STATES ---
    const [realEstateAssets, setRealEstateAssets] = useState<RealEstateAsset[]>([]);
    const [loanAccounts, setLoanAccounts] = useState<LoanAccount[]>([]);
    const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>([]);
    const [taxFilings, setTaxFilings] = useState<TaxFiling[]>([]);
    const [estatePlan, setEstatePlan] = useState<EstatePlan | null>(null);
    const [microLoans, setMicroLoans] = useState<MicroLoan[]>([]);
    const [familyBudgets, setFamilyBudgets] = useState<FamilyBudget[]>([]);
    const [scenarioAnalyses, setScenarioAnalyses] = useState<ScenarioAnalysis[]>([]);
    const [advancedInvestments, setAdvancedInvestments] = useState<AdvancedInvestment[]>([]);
    const [algorithmicStrategies, setAlgorithmicStrategies] = useState<AlgorithmicStrategy[]>([]);
    const [esgScores, setEsgScores] = useState<ESGScore[]>([]);
    const [alternativeAssets, setAlternativeAssets] = useState<AlternativeAsset[]>([]);
    const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
    const [aiModelPerformances, setAiModelPerformances] = useState<AIModelPerformance[]>([]);
    const [dataStreamAnomalies, setDataStreamAnomalies] = useState<DataStreamAnomaly[]>([]);
    const [ethicalAIGuidelines, setEthicalAIGuidelines] = useState<EthicalAIGuideline[]>([]);
    const [biasDetectionReports, setBiasDetectionReports] = useState<BiasDetectionReport[]>([]);
    const [fairnessMetrics, setFairnessMetrics] = useState<FairnessMetric[]>([]);
    const [explainabilityReports, setExplainabilityReports] = useState<ExplainabilityReport[]>([]);
    const [financialModelAudits, setFinancialModelAudits] = useState<FinancialModelAudit[]>([]);
    const [modelDriftAlerts, setModelDriftAlerts] = useState<ModelDriftAlert[]>([]);
    const [syntheticDataConfigs, setSyntheticDataConfigs] = useState<SyntheticDataConfig[]>([]);
    const [federatedLearningRounds, setFederatedLearningRounds] = useState<FederatedLearningRound[]>([]);
    const [aiAssistantLogs, setAiAssistantLogs] = useState<AIAssistantLog[]>([]);
    const [treasuryForecasts, setTreasuryForecasts] = useState<TreasuryForecast[]>([]);
    const [supplyChainInvoices, setSupplyChainInvoices] = useState<SupplyChainInvoice[]>([]);
    const [regulatoryAlerts, setRegulatoryAlerts] = useState<RegulatoryAlert[]>([]);
    const [globalPayrollRuns, setGlobalPayrollRuns] = useState<GlobalPayrollRun[]>([]);
    const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>([]);
    const [vendorContracts, setVendorContracts] = useState<VendorContract[]>([]);
    const [revenueForecasts, setRevenueForecasts] = useState<RevenueForecast[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
    const [dataRetentionPolicies, setDataRetentionPolicies] = useState<DataRetentionPolicy[]>([]);
    const [hrPolicies, setHrPolicies] = useState<HRPolicy[]>([]);
    const [recruitmentPipelines, setRecruitmentPipelines] = useState<RecruitmentPipeline[]>([]);
    const [onboardingFlows, setOnboardingFlows] = useState<OnboardingFlow[]>([]);
    const [offboardingChecklists, setOffboardingChecklists] = useState<OffboardingChecklist[]>([]);
    const [crmLeads, setCrmLeads] = useState<CRMLead[]>([]);
    const [crmContacts, setCrmContacts] = useState<CRMContact[]>([]);
    const [erpDocuments, setErpDocuments] = useState<ERPDocument[]>([]);
    const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
    const [grantApplications, setGrantApplications] = useState<GrantApplication[]>([]);
    const [iotDevices, setIotDevices] = useState<IoTDevice[]>([]);
    const [predictiveMaintenanceAlerts, setPredictiveMaintenanceAlerts] = useState<PredictiveMaintenanceAlert[]>([]);
    const [energyConsumptionData, setEnergyConsumptionData] = useState<EnergyConsumptionData[]>([]);
    const [supplyChainProvenances, setSupplyChainProvenances] = useState<SupplyChainProvenance[]>([]);
    const [geospatialAssets, setGeospatialAssets] = useState<GeospatialAsset[]>([]);
    const [weatherImpactAssessments, setWeatherImpactAssessments] = useState<WeatherImpactAssessment[]>([]);
    const [disasterRecoveryPlans, setDisasterRecoveryPlans] = useState<DisasterRecoveryPlan[]>([]);
    const [cyberSecurityThreats, setCyberSecurityThreats] = useState<CyberSecurityThreat[]>([]);
    const [vulnerabilityScanResults, setVulnerabilityScanResults] = useState<VulnerabilityScanResult[]>([]);
    const [penetrationTestReports, setPenetrationTestReports] = useState<PenetrationTestReport[]>([]);
    const [securityAuditLogs, setSecurityAuditLogs] = useState<SecurityAuditLog[]>([]);
    const [complianceDashboards, setComplianceDashboards] = useState<ComplianceDashboard[]>([]);
    const [regulatoryDeadlines, setRegulatoryDeadlines] = useState<RegulatoryDeadline[]>([]);
    const [legalHolds, setLegalHolds] = useState<LegalHold[]>([]);
    const [discoveryRequests, setDiscoveryRequests] = useState<DiscoveryRequest[]>([]);
    const [legalResearchResults, setLegalResearchResults] = useState<LegalResearchResult[]>([]);
    const [patentApplications, setPatentApplications] = useState<PatentApplication[]>([]);
    const [trademarkRegistrations, setTrademarkRegistrations] = useState<TrademarkRegistration[]>([]);
    const [copyrightAssets, setCopyrightAssets] = useState<CopyrightAsset[]>([]);
    const [privacyPolicyVersions, setPrivacyPolicyVersions] = useState<PrivacyPolicyVersion[]>([]);
    const [dataProcessingAgreements, setDataProcessingAgreements] = useState<DataProcessingAgreement[]>([]);
    const [consentFormTemplates, setConsentFormTemplates] = useState<ConsentFormTemplate[]>([]);
    const [personalDataRequests, setPersonalDataRequests] = useState<PersonalDataRequest[]>([]);
    const [globalTaxTreaties, setGlobalTaxTreaties] = useState<GlobalTaxTreaty[]>([]);
    const [jurisdictionProfiles, setJurisdictionProfiles] = useState<JurisdictionProfile[]>([]);
    const [localizedContent, setLocalizedContent] = useState<LocalizedContent[]>([]);
    const [governmentContracts, setGovernmentContracts] = useState<GovernmentContract[]>([]);
    const [publicKeyInfrastructures, setPublicKeyInfrastructures] = useState<PublicKeyInfrastructure[]>([]);
    const [digitalVotingSystems, setDigitalVotingSystems] = useState<DigitalVotingSystem[]>([]);
    const [tokenizedIdentities, setTokenizedIdentities] = useState<TokenizedIdentity[]>([]);
    const [biometricProfiles, setBiometricProfiles] = useState<BiometricProfile[]>([]);
    const [quantumKeys, setQuantumKeys] = useState<QuantumKey[]>([]);
    const [zeroKnowledgeProofs, setZeroKnowledgeProofs] = useState<ZeroKnowledgeProof[]>([]);
    const [digitalIdentities, setDigitalIdentities] = useState<DigitalIdentity[]>([]);
    const [digitalTwinModels, setDigitalTwinModels] = useState<DigitalTwinModel[]>([]);
    const [homomorphicEncryptedData, setHomomorphicEncryptedData] = useState<HomomorphicEncryptedData[]>([]);
    const [postQuantumCryptoStatus, setPostQuantumCryptoStatus] = useState<PostQuantumCryptoStatus[]>([]);
    const [quantumSimulationResults, setQuantumSimulationResults] = useState<QuantumSimulationResult[]>([]);
    const [aiAgents, setAiAgents] = useState<AIAgent[]>([]);
    const [legalAIReviews, setLegalAIReviews] = useState<LegalAIReview[]>([]);
    const [arvrFinancialScenes, setArvrFinancialScenes] = useState<ARVRFinancialScene[]>([]);
    const [apiGatewayRoutes, setApiGatewayRoutes] = useState<APIGatewayRoute[]>([]);
    const [cloudResources, setCloudResources] = useState<CloudResource[]>([]);
    const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>([]);
    const [cicdPipelines, setCicdPipelines] = useState<CICDPipeline[]>([]);
    const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
    const [systemHealthMetrics, setSystemHealthMetrics] = useState<SystemHealthMetric[]>([]);
    const [resourceUtilization, setResourceUtilization] = useState<ResourceUtilization[]>([]);
    const [serviceLevelAgreements, setServiceLevelAgreements] = useState<ServiceLevelAgreement[]>([]);
    const [errorRateTrends, setErrorRateTrends] = useState<ErrorRateTrend[]>([]);
    const [latencyReports, setLatencyReports] = useState<LatencyReport[]>([]);
    const [throughputMetrics, setThroughputMetrics] = useState<ThroughputMetric[]>([]);
    const [costOptimizationReports, setCostOptimizationReports] = useState<CostOptimizationReport[]>([]);
    const [blockchainTransactions, setBlockchainTransactions] = useState<BlockchainTransaction[]>([]);
    const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);
    const [walletConnectSessions, setWalletConnectSessions] = useState<WalletConnectSession[]>([]);
    const [web3GasPrices, setWeb3GasPrices] = useState<Web3GasPrice | null>(null);
    const [dexSwaps, setDexSwaps] = useState<DEXSwap[]>([]);
    const [bridgeTransactions, setBridgeTransactions] = useState<BridgeTransaction[]>([]);
    const [decentralizedIDs, setDecentralizedIDs] = useState<DecentralizedID[]>([]);
    const [nftCollections, setNftCollections] = useState<NFTCollection[]>([]);
    const [assetTokenizationRecords, setAssetTokenizationRecords] = useState<AssetTokenizationRecord[]>([]);
    const [metaverseIdentities, setMetaverseIdentities] = useState<MetaverseIdentity[]>([]);
    const [decentralizedStorageFiles, setDecentralizedStorageFiles] = useState<DecentralizedStorageFile[]>([]);
    const [ipfsHashes, setIpfsHashes] = useState<IPFSHash[]>([]);
    const [web3Domains, setWeb3Domains] = useState<Web3Domain[]>([]);
    const [walletActivityLogs, setWalletActivityLogs] = useState<WalletActivityLog[]>([]);
    const [smartContractInteractions, setSmartContractInteractions] = useState<SmartContractInteraction[]>([]);
    const [gasFeePredictions, setGasFeePredictions] = useState<GasFeePrediction | null>(null);
    const [layer2Solutions, setLayer2Solutions] = useState<Layer2Solution[]>([]);
    const [rollupStatus, setRollupStatus] = useState<RollupStatus[]>([]);
    const [oracleFeeds, setOracleFeeds] = useState<OracleFeed[]>([]);
    const [tokenomicsModels, setTokenomicsModels] = useState<TokenomicsModel[]>([]);
    const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
    const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);
    const [yieldFarmingStrategies, setYieldFarmingStrategies] = useState<YieldFarmingStrategy[]>([]);
    const [insuranceProtocolClaims, setInsuranceProtocolClaims] = useState<InsuranceProtocolClaim[]>([]);
    const [decentralizedExchangeOrders, setDecentralizedExchangeOrders] = useState<DecentralizedExchangeOrder[]>([]);
    const [crossChainBridges, setCrossChainBridges] = useState<CrossChainBridge[]>([]);
    const [interoperabilityStandards, setInteroperabilityStandards] = useState<InteroperabilityStandard[]>([]);
    const [identityVerificationProviders, setIdentityVerificationProviders] = useState<IdentityVerificationProvider[]>([]);
    const [reputationScores, setReputationScores] = useState<ReputationScore[]>([]);
    const [verifiableCredentials, setVerifiableCredentials] = useState<VerifiableCredential[]>([]);
    const [didDocuments, setDidDocuments] = useState<DIDDocument[]>([]);
    const [keyManagementSystems, setKeyManagementSystems] = useState<KeyManagementSystem[]>([]);
    const [hardwareWalletIntegrations, setHardwareWalletIntegrations] = useState<HardwareWalletIntegration[]>([]);
    const [multiSigWalletConfigs, setMultiSigWalletConfigs] = useState<MultiSigWalletConfig[]>([]);
    const [socialRecoveryMethods, setSocialRecoveryMethods] = useState<SocialRecoveryMethod[]>([]);
    const [selfSovereignIdentityFlows, setSelfSovereignIdentityFlows] = useState<SelfSovereignIdentityFlow[]>([]);
    const [dataPortabilityRequests, setDataPortabilityRequests] = useState<DataPortabilityRequest[]>([]);
    const [personalDataVaults, setPersonalDataVaults] = useState<PersonalDataVault[]>([]);
    const [dataMonetizationOptIns, setDataMonetizationOptIns] = useState<DataMonetizationOptIn[]>([]);
    const [carbonFootprintReports, setCarbonFootprintReports] = useState<CarbonFootprintReport[]>([]);
    const [sdgImpactProjects, setSdgImpactProjects] = useState<SDGImpactProject[]>([]);
    const [impactReports, setImpactReports] = useState<ImpactReport[]>([]);
    const [carbonCreditBalance, setCarbonCreditBalance] = useState<CarbonCredit[]>([]);
    const [renewableEnergyCertificates, setRenewableEnergyCertificates] = useState<RenewableEnergyCertificate[]>([]);
    const [energyEfficiencyScores, setEnergyEfficiencyScores] = useState<EnergyEfficiencyScore[]>([]);
    const [sustainableCodingPractices, setSustainableCodingPractices] = useState<SustainableCodingPractice[]>([]);
    const [greenITReports, setGreenITReports] = useState<GreenITReport[]>([]);
    const [circularEconomyMetrics, setCircularEconomyMetrics] = useState<CircularEconomyMetric[]>([]);
    const [recyclingPrograms, setRecyclingPrograms] = useState<RecyclingProgram[]>([]);
    const [wasteReductionTargets, setWasteReductionTargets] = useState<WasteReductionTarget[]>([]);
    const [ethicalSupplyChainAudits, setEthicalSupplyChainAudits] = useState<EthicalSupplyChainAudit[]>([]);
    const [laborPracticeReports, setLaborPracticeReports] = useState<LaborPracticeReport[]>([]);
    const [diversityInclusionMetrics, setDiversityInclusionMetrics] = useState<DiversityInclusionMetric[]>([]);
    const [socialImpactScores, setSocialImpactScores] = useState<SocialImpactScore[]>([]);
    const [communityInvestments, setCommunityInvestments] = useState<CommunityInvestment[]>([]);
    const [volunteerHours, setVolunteerHours] = useState<VolunteerHours[]>([]);
    const [philanthropicDonations, setPhilanthropicDonations] = useState<PhilanthropicDonation[]>([]);
    const [grantFunding, setGrantFunding] = useState<GrantFunding[]>([]);
    const [impactInvestmentFunds, setImpactInvestmentFunds] = useState<ImpactInvestmentFund[]>([]);
    const [microfinanceInitiatives, setMicrofinanceInitiatives] = useState<MicrofinanceInitiative[]>([]);
    const [socialEnterpriseKPIs, setSocialEnterpriseKPIs] = useState<SocialEnterpriseKPI[]>([]);
    const [nonProfitGovernance, setNonProfitGovernance] = useState<NonProfitGovernance[]>([]);
    const [fundraisingCampaigns, setFundraisingCampaigns] = useState<FundraisingCampaign[]>([]);
    const [donorRelationManagement, setDonorRelationManagement] = useState<DonorRelationManagement[]>([]);
    const [endowmentFunds, setEndowmentFunds] = useState<EndowmentFund[]>([]);
    const [scholarshipPrograms, setScholarshipPrograms] = useState<ScholarshipProgram[]>([]);
    const [researchGrants, setResearchGrants] = useState<ResearchGrant[]>([]);
    const [publicFundingApplications, setPublicFundingApplications] = useState<PublicFundingApplication[]>([]);
    const [politicalLobbyingSpend, setPoliticalLobbyingSpend] = useState<PoliticalLobbyingSpend[]>([]);
    const [regulatoryAdvocacy, setRegulatoryAdvocacy] = useState<RegulatoryAdvocacy[]>([]);
    const [policyImpactAnalyses, setPolicyImpactAnalyses] = useState<PolicyImpactAnalysis[]>([]);
    const [smartCityInvestments, setSmartCityInvestments] = useState<SmartCityInvestment[]>([]);
    const [infrastructureProjects, setInfrastructureProjects] = useState<InfrastructureProject[]>([]);
    const [publicPrivatePartnerships, setPublicPrivatePartnerships] = useState<PublicPrivatePartnership[]>([]);
    const [socialImpactBonds, setSocialImpactBonds] = useState<SocialImpactBond[]>([]);
    const [greenBonds, setGreenBonds] = useState<GreenBond[]>([]);
    const [microgridInvestments, setMicrogridInvestments] = useState<MicrogridInvestment[]>([]);
    const [multiCurrencyAccounts, setMultiCurrencyAccounts] = useState<MultiCurrencyAccount[]>([]);
    const [fxHedges, setFxHedges] = useState<FXHedge[]>([]);
    const [planetaryResourceTracker, setPlanetaryResourceTracker] = useState<PlanetaryResourceTracker | null>(null);
    const [spaceEconomyInvestments, setSpaceEconomyInvestments] = useState<SpaceEconomyInvestment[]>([]);
    const [asteroidMiningClaims, setAsteroidMiningClaims] = useState<AsteroidMiningClaim[]>([]);
    const [lunarRealEstateDeeds, setLunarRealEstateDeeds] = useState<LunarRealEstateDeed[]>([]);
    const [orbitalDebrisTracker, setOrbitalDebrisTracker] = useState<OrbitalDebrisTracker | null>(null);
    const [spaceTravelInsurance, setSpaceTravelInsurance] = useState<SpaceTravelInsurance[]>([]);
    const [alienContactProtocolFunding, setAlienContactProtocolFunding] = useState<AlienContactProtocolFunding[]>([]);
    const [financialEducationModules, setFinancialEducationModules] = useState<FinancialEducationModule[]>([]);
    const [socialFinanceChallenges, setSocialFinanceChallenges] = useState<SocialFinanceChallenge[]>([]);
    const [behavioralNudges, setBehavioralNudges] = useState<BehavioralNudge[]>([]);
    const [subscriptionUsages, setSubscriptionUsages] = useState<SubscriptionUsage[]>([]);
    const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
    const [customReports, setCustomReports] = useState<CustomReport[]>([]);
    const [biReportConfigs, setBiReportConfigs] = useState<BIReportConfig[]>([]);
    const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
    const [plaidWebhooks, setPlaidWebhooks] = useState<PlaidWebhook[]>([]);
    // --- END NEW EXPANSION STATES ---


     const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Load all data from mock files
            setTransactions(MockData.MOCK_TRANSACTIONS);
            setAssets(MockData.MOCK_ASSETS);
            setPortfolioAssets(MockData.MOCK_PORTFOLIO_ASSETS);
            setBudgets(MockData.MOCK_BUDGETS);
            setImpactInvestments(MockData.MOCK_IMPACT_INVESTMENTS);
            setFinancialGoals(MockData.MOCK_FINANCIAL_GOALS);
            setSubscriptions(MockData.MOCK_SUBSCRIPTIONS);
            setUpcomingBills(MockData.MOCK_UPCOMING_BILLS);
            setSavingsGoals(MockData.MOCK_SAVINGS_GOALS);
            // FIX: Import missing mock data from the central data export file.
            setGamification(MockData.MOCK_GAMIFICATION);
            setRewardPoints(MockData.MOCK_REWARD_POINTS);
            setRewardItems(MockData.MOCK_REWARD_ITEMS);
            setCreditScore(MockData.MOCK_CREDIT_SCORE);
            setCreditFactors(MockData.MOCK_CREDIT_FACTORS);
            // FIX: Import missing mock data from the central data export file.
            setAiInsights(MockData.MOCK_AI_INSIGHTS);
            setCryptoAssets(MockData.MOCK_CRYPTO_ASSETS);
            setPaymentOperations(MockData.MOCK_PAYMENT_OPERATIONS);
            // FIX: Import missing mock data from the central data export file.
            setLinkedAccounts(MockData.MOCK_LINKED_ACCOUNTS);
            setNotifications(MockData.MOCK_NOTIFICATIONS);
            
            setCorporateCards(MockData.MOCK_CORPORATE_CARDS);
            setCorporateTransactions(MockData.MOCK_CORPORATE_TRANSACTIONS);
            setPaymentOrders(MockData.MOCK_PAYMENT_ORDERS);
            setInvoices(MockData.MOCK_INVOICES);
            setComplianceCases(MockData.MOCK_COMPLIANCE_CASES);
            setFinancialAnomalies(MockData.MOCK_ANOMALIES);
            setCounterparties(MockData.MOCK_COUNTERPARTIES);
            setPayRuns(MockData.MOCK_PAY_RUNS);

            setProjects(MockData.MOCK_PROJECTS);
            setCourses(MockData.MOCK_COURSES);
            setEmployees(MockData.MOCK_EMPLOYEES);
            
            setMarketMovers(MockData.MOCK_MARKET_MOVERS);
            setApiStatus(MockData.MOCK_API_STATUS);
            
            setAccessLogs(MockData.MOCK_ACCESS_LOGS);
            setFraudCases(MockData.MOCK_FRAUD_CASES);
            setMlModels(MockData.MOCK_ML_MODELS);
            setLoanApplications(MockData.MOCK_LOAN_APPLICATIONS);
            setMortgageAssets(MockData.MOCK_MORTGAGE_ASSETS);
            setThreatIntelBriefs(MockData.MOCK_THREAT_INTEL);
            setInsuranceClaims(MockData.MOCK_INSURANCE_CLAIMS);
            setRiskProfiles(MockData.MOCK_RISK_PROFILES);
            setDataCatalogItems(MockData.MOCK_DATA_CATALOG_ITEMS);
            setDataLakeStats(MockData.MOCK_DATA_LAKE_STATS);
            setSalesDeals(MockData.MOCK_SALES_DEALS);
            setMarketingCampaigns(MockData.MOCK_MARKETING_CAMPAIGNS);
            setGrowthMetrics(MockData.MOCK_GROWTH_METRICS);
            setCompetitors(MockData.MOCK_COMPETITORS);
            setBenchmarks(MockData.MOCK_BENCHMARKS);
            setLicenses(MockData.MOCK_LICENSES);
            setDisclosures(MockData.MOCK_DISCLOSURES);
            setLegalDocs(MockData.MOCK_LEGAL_DOCS);
            setSandboxExperiments(MockData.MOCK_SANDBOX_EXPERIMENTS);
            setConsentRecords(MockData.MOCK_CONSENT_RECORDS);
            setContainerImages(MockData.MOCK_CONTAINER_IMAGES);
            setApiUsage(MockData.MOCK_API_USAGE);
            setIncidents(MockData.MOCK_INCIDENTS);
            setBackupJobs(MockData.MOCK_BACKUP_JOBS);
            
            setImpactData({ treesPlanted: 42, progressToNextTree: 75 });

            // --- START NEW EXPANSION DATA LOADING ---
            setRealEstateAssets(MockData.MOCK_REAL_ESTATE_ASSETS || []);
            setLoanAccounts(MockData.MOCK_LOAN_ACCOUNTS || []);
            setInsurancePolicies(MockData.MOCK_INSURANCE_POLICIES || []);
            setTaxFilings(MockData.MOCK_TAX_FILINGS || []);
            setEstatePlan(MockData.MOCK_ESTATE_PLAN || null);
            setMicroLoans(MockData.MOCK_MICRO_LOANS || []);
            setFamilyBudgets(MockData.MOCK_FAMILY_BUDGETS || []);
            setScenarioAnalyses(MockData.MOCK_SCENARIO_ANALYSES || []);
            setAdvancedInvestments(MockData.MOCK_ADVANCED_INVESTMENTS || []);
            setAlgorithmicStrategies(MockData.MOCK_ALGORITHMIC_STRATEGIES || []);
            setEsgScores(MockData.MOCK_ESG_SCORES || []);
            setAlternativeAssets(MockData.MOCK_ALTERNATIVE_ASSETS || []);
            setMarketSentiment(MockData.MOCK_MARKET_SENTIMENT || null);
            setAiModelPerformances(MockData.MOCK_AI_MODEL_PERFORMANCES || []);
            setDataStreamAnomalies(MockData.MOCK_DATA_STREAM_ANOMALIES || []);
            setEthicalAIGuidelines(MockData.MOCK_ETHICAL_AI_GUIDELINES || []);
            setBiasDetectionReports(MockData.MOCK_BIAS_DETECTION_REPORTS || []);
            setFairnessMetrics(MockData.MOCK_FAIRNESS_METRICS || []);
            setExplainabilityReports(MockData.MOCK_EXPLAINABILITY_REPORTS || []);
            setFinancialModelAudits(MockData.MOCK_FINANCIAL_MODEL_AUDITS || []);
            setModelDriftAlerts(MockData.MOCK_MODEL_DRIFT_ALERTS || []);
            setSyntheticDataConfigs(MockData.MOCK_SYNTHETIC_DATA_CONFIGS || []);
            setFederatedLearningRounds(MockData.MOCK_FEDERATED_LEARNING_ROUNDS || []);
            setAiAssistantLogs(MockData.MOCK_AI_ASSISTANT_LOGS || []);
            setTreasuryForecasts(MockData.MOCK_TREASURY_FORECASTS || []);
            setSupplyChainInvoices(MockData.MOCK_SUPPLY_CHAIN_INVOICES || []);
            setRegulatoryAlerts(MockData.MOCK_REGULATORY_ALERTS || []);
            setGlobalPayrollRuns(MockData.MOCK_GLOBAL_PAYROLL_RUNS || []);
            setExpenseReports(MockData.MOCK_EXPENSE_REPORTS || []);
            setVendorContracts(MockData.MOCK_VENDOR_CONTRACTS || []);
            setRevenueForecasts(MockData.MOCK_REVENUE_FORECASTS || []);
            setAuditLogs(MockData.MOCK_AUDIT_LOGS || []);
            setComplianceRules(MockData.MOCK_COMPLIANCE_RULES || []);
            setDataRetentionPolicies(MockData.MOCK_DATA_RETENTION_POLICIES || []);
            setHrPolicies(MockData.MOCK_HR_POLICIES || []);
            setRecruitmentPipelines(MockData.MOCK_RECRUITMENT_PIPELINES || []);
            setOnboardingFlows(MockData.MOCK_ONBOARDING_FLOWS || []);
            setOffboardingChecklists(MockData.MOCK_OFFBOARDING_CHECKLISTS || []);
            setCrmLeads(MockData.MOCK_CRM_LEADS || []);
            setCrmContacts(MockData.MOCK_CRM_CONTACTS || []);
            setErpDocuments(MockData.MOCK_ERP_DOCUMENTS || []);
            setLegalCases(MockData.MOCK_LEGAL_CASES || []);
            setGrantApplications(MockData.MOCK_GRANT_APPLICATIONS || []);
            setIotDevices(MockData.MOCK_IOT_DEVICES || []);
            setPredictiveMaintenanceAlerts(MockData.MOCK_PREDICTIVE_MAINTENANCE_ALERTS || []);
            setEnergyConsumptionData(MockData.MOCK_ENERGY_CONSUMPTION_DATA || []);
            setSupplyChainProvenances(MockData.MOCK_SUPPLY_CHAIN_PROVENANCES || []);
            setGeospatialAssets(MockData.MOCK_GEOSPATIAL_ASSETS || []);
            setWeatherImpactAssessments(MockData.MOCK_WEATHER_IMPACT_ASSESSMENTS || []);
            setDisasterRecoveryPlans(MockData.MOCK_DISASTER_RECOVERY_PLANS || []);
            setCyberSecurityThreats(MockData.MOCK_CYBER_SECURITY_THREATS || []);
            setVulnerabilityScanResults(MockData.MOCK_VULNERABILITY_SCAN_RESULTS || []);
            setPenetrationTestReports(MockData.MOCK_PENETRATION_TEST_REPORTS || []);
            setSecurityAuditLogs(MockData.MOCK_SECURITY_AUDIT_LOGS || []);
            setComplianceDashboards(MockData.MOCK_COMPLIANCE_DASHBOARDS || []);
            setRegulatoryDeadlines(MockData.MOCK_REGULATORY_DEADLINES || []);
            setLegalHolds(MockData.MOCK_LEGAL_HOLDS || []);
            setDiscoveryRequests(MockData.MOCK_DISCOVERY_REQUESTS || []);
            setLegalResearchResults(MockData.MOCK_LEGAL_RESEARCH_RESULTS || []);
            setPatentApplications(MockData.MOCK_PATENT_APPLICATIONS || []);
            setTrademarkRegistrations(MockData.MOCK_TRADEMARK_REGISTRATIONS || []);
            setCopyrightAssets(MockData.MOCK_COPYRIGHT_ASSETS || []);
            setPrivacyPolicyVersions(MockData.MOCK_PRIVACY_POLICY_VERSIONS || []);
            setDataProcessingAgreements(MockData.MOCK_DATA_PROCESSING_AGREEMENTS || []);
            setConsentFormTemplates(MockData.MOCK_CONSENT_FORM_TEMPLATES || []);
            setPersonalDataRequests(MockData.MOCK_PERSONAL_DATA_REQUESTS || []);
            setGlobalTaxTreaties(MockData.MOCK_GLOBAL_TAX_TREATIES || []);
            setJurisdictionProfiles(MockData.MOCK_JURISDICTION_PROFILES || []);
            setLocalizedContent(MockData.MOCK_LOCALIZED_CONTENT || []);
            setGovernmentContracts(MockData.MOCK_GOVERNMENT_CONTRACTS || []);
            setPublicKeyInfrastructures(MockData.MOCK_PUBLIC_KEY_INFRASTRUCTURES || []);
            setDigitalVotingSystems(MockData.MOCK_DIGITAL_VOTING_SYSTEMS || []);
            setTokenizedIdentities(MockData.MOCK_TOKENIZED_IDENTITIES || []);
            setBiometricProfiles(MockData.MOCK_BIOMETRIC_PROFILES || []);
            setQuantumKeys(MockData.MOCK_QUANTUM_KEYS || []);
            setZeroKnowledgeProofs(MockData.MOCK_ZERO_KNOWLEDGE_PROOFS || []);
            setDigitalIdentities(MockData.MOCK_DIGITAL_IDENTITIES || []);
            setDigitalTwinModels(MockData.MOCK_DIGITAL_TWIN_MODELS || []);
            setHomomorphicEncryptedData(MockData.MOCK_HOMOMORPHIC_ENCRYPTED_DATA || []);
            setPostQuantumCryptoStatus(MockData.MOCK_POST_QUANTUM_CRYPTO_STATUS || []);
            setQuantumSimulationResults(MockData.MOCK_QUANTUM_SIMULATION_RESULTS || []);
            setAiAgents(MockData.MOCK_AI_AGENTS || []);
            setLegalAIReviews(MockData.MOCK_LEGAL_AI_REVIEWS || []);
            setArvrFinancialScenes(MockData.MOCK_ARVR_FINANCIAL_SCENES || []);
            setApiGatewayRoutes(MockData.MOCK_API_GATEWAY_ROUTES || []);
            setCloudResources(MockData.MOCK_CLOUD_RESOURCES || []);
            setSecurityIncidents(MockData.MOCK_SECURITY_INCIDENTS || []);
            setCicdPipelines(MockData.MOCK_CICD_PIPELINES || []);
            setFeatureFlags(MockData.MOCK_FEATURE_FLAGS || []);
            setSystemHealthMetrics(MockData.MOCK_SYSTEM_HEALTH_METRICS || []);
            setResourceUtilization(MockData.MOCK_RESOURCE_UTILIZATION || []);
            setServiceLevelAgreements(MockData.MOCK_SERVICE_LEVEL_AGREEMENTS || []);
            setErrorRateTrends(MockData.MOCK_ERROR_RATE_TRENDS || []);
            setLatencyReports(MockData.MOCK_LATENCY_REPORTS || []);
            setThroughputMetrics(MockData.MOCK_THROUGHPUT_METRICS || []);
            setCostOptimizationReports(MockData.MOCK_COST_OPTIMIZATION_REPORTS || []);
            setBlockchainTransactions(MockData.MOCK_BLOCKCHAIN_TRANSACTIONS || []);
            setSmartContracts(MockData.MOCK_SMART_CONTRACTS || []);
            setWalletConnectSessions(MockData.MOCK_WALLET_CONNECT_SESSIONS || []);
            setWeb3GasPrices(MockData.MOCK_WEB3_GAS_PRICES || null);
            setDexSwaps(MockData.MOCK_DEX_SWAPS || []);
            setBridgeTransactions(MockData.MOCK_BRIDGE_TRANSACTIONS || []);
            setDecentralizedIDs(MockData.MOCK_DECENTRALIZED_IDS || []);
            setNftCollections(MockData.MOCK_NFT_COLLECTIONS || []);
            setAssetTokenizationRecords(MockData.MOCK_ASSET_TOKENIZATION_RECORDS || []);
            setMetaverseIdentities(MockData.MOCK_METAVERSE_IDENTITIES || []);
            setDecentralizedStorageFiles(MockData.MOCK_DECENTRALIZED_STORAGE_FILES || []);
            setIpfsHashes(MockData.MOCK_IPFS_HASHES || []);
            setWeb3Domains(MockData.MOCK_WEB3_DOMAINS || []);
            setWalletActivityLogs(MockData.MOCK_WALLET_ACTIVITY_LOGS || []);
            setSmartContractInteractions(MockData.MOCK_SMART_CONTRACT_INTERACTIONS || []);
            setGasFeePredictions(MockData.MOCK_GAS_FEE_PREDICTIONS || null);
            setLayer2Solutions(MockData.MOCK_LAYER2_SOLUTIONS || []);
            setRollupStatus(MockData.MOCK_ROLLUP_STATUS || []);
            setOracleFeeds(MockData.MOCK_ORACLE_FEEDS || []);
            setTokenomicsModels(MockData.MOCK_TOKENOMICS_MODELS || []);
            setStakingPools(MockData.MOCK_STAKING_POOLS || []);
            setLiquidityPools(MockData.MOCK_LIQUIDITY_POOLS || []);
            setYieldFarmingStrategies(MockData.MOCK_YIELD_FARMING_STRATEGIES || []);
            setInsuranceProtocolClaims(MockData.MOCK_INSURANCE_PROTOCOL_CLAIMS || []);
            setDecentralizedExchangeOrders(MockData.MOCK_DECENTRALIZED_EXCHANGE_ORDERS || []);
            setCrossChainBridges(MockData.MOCK_CROSS_CHAIN_BRIDGES || []);
            setInteroperabilityStandards(MockData.MOCK_INTEROPERABILITY_STANDARDS || []);
            setIdentityVerificationProviders(MockData.MOCK_IDENTITY_VERIFICATION_PROVIDERS || []);
            setReputationScores(MockData.MOCK_REPUTATION_SCORES || []);
            setVerifiableCredentials(MockData.MOCK_VERIFIABLE_CREDENTIALS || []);
            setDidDocuments(MockData.MOCK_DID_DOCUMENTS || []);
            setKeyManagementSystems(MockData.MOCK_KEY_MANAGEMENT_SYSTEMS || []);
            setHardwareWalletIntegrations(MockData.MOCK_HARDWARE_WALLET_INTEGRATIONS || []);
            setMultiSigWalletConfigs(MockData.MOCK_MULTI_SIG_WALLET_CONFIGS || []);
            setSocialRecoveryMethods(MockData.MOCK_SOCIAL_RECOVERY_METHODS || []);
            setSelfSovereignIdentityFlows(MockData.MOCK_SELF_SOVEREIGN_IDENTITY_FLOWS || []);
            setDataPortabilityRequests(MockData.MOCK_DATA_PORTABILITY_REQUESTS || []);
            setPersonalDataVaults(MockData.MOCK_PERSONAL_DATA_VAULTS || []);
            setDataMonetizationOptIns(MockData.MOCK_DATA_MONETIZATION_OPT_INS || []);
            setCarbonFootprintReports(MockData.MOCK_CARBON_FOOTPRINT_REPORTS || []);
            setSdgImpactProjects(MockData.MOCK_SDG_IMPACT_PROJECTS || []);
            setImpactReports(MockData.MOCK_IMPACT_REPORTS || []);
            setCarbonCreditBalance(MockData.MOCK_CARBON_CREDIT_BALANCE || []);
            setRenewableEnergyCertificates(MockData.MOCK_RENEWABLE_ENERGY_CERTIFICATES || []);
            setEnergyEfficiencyScores(MockData.MOCK_ENERGY_EFFICIENCY_SCORES || []);
            setSustainableCodingPractices(MockData.MOCK_SUSTAINABLE_CODING_PRACTICES || []);
            setGreenITReports(MockData.MOCK_GREEN_IT_REPORTS || []);
            setCircularEconomyMetrics(MockData.MOCK_CIRCULAR_ECONOMY_METRICS || []);
            setRecyclingPrograms(MockData.MOCK_RECYCLING_PROGRAMS || []);
            setWasteReductionTargets(MockData.MOCK_WASTE_REDUCTION_TARGETS || []);
            setEthicalSupplyChainAudits(MockData.MOCK_ETHICAL_SUPPLY_CHAIN_AUDITS || []);
            setLaborPracticeReports(MockData.MOCK_LABOR_PRACTICE_REPORTS || []);
            setDiversityInclusionMetrics(MockData.MOCK_DIVERSITY_INCLUSION_METRICS || []);
            setSocialImpactScores(MockData.MOCK_SOCIAL_IMPACT_SCORES || []);
            setCommunityInvestments(MockData.MOCK_COMMUNITY_INVESTMENTS || []);
            setVolunteerHours(MockData.MOCK_VOLUNTEER_HOURS || []);
            setPhilanthropicDonations(MockData.MOCK_PHILANTHROPIC_DONATIONS || []);
            setGrantFunding(MockData.MOCK_GRANT_FUNDING || []);
            setImpactInvestmentFunds(MockData.MOCK_IMPACT_INVESTMENT_FUNDS || []);
            setMicrofinanceInitiatives(MockData.MOCK_MICROFINANCE_INITIATIVES || []);
            setSocialEnterpriseKPIs(MockData.MOCK_SOCIAL_ENTERPRISE_KPIS || []);
            setNonProfitGovernance(MockData.MOCK_NON_PROFIT_GOVERNANCE || []);
            setFundraisingCampaigns(MockData.MOCK_FUNDRAISING_CAMPAIGNS || []);
            setDonorRelationManagement(MockData.MOCK_DONOR_RELATION_MANAGEMENT || []);
            setEndowmentFunds(MockData.MOCK_ENDOWMENT_FUNDS || []);
            setScholarshipPrograms(MockData.MOCK_SCHOLARSHIP_PROGRAMS || []);
            setResearchGrants(MockData.MOCK_RESEARCH_GRANTS || []);
            setPublicFundingApplications(MockData.MOCK_PUBLIC_FUNDING_APPLICATIONS || []);
            setPoliticalLobbyingSpend(MockData.MOCK_POLITICAL_LOBBYING_SPEND || []);
            setRegulatoryAdvocacy(MockData.MOCK_REGULATORY_ADVOCACY || []);
            setPolicyImpactAnalyses(MockData.MOCK_POLICY_IMPACT_ANALYSES || []);
            setSmartCityInvestments(MockData.MOCK_SMART_CITY_INVESTMENTS || []);
            setInfrastructureProjects(MockData.MOCK_INFRASTRUCTURE_PROJECTS || []);
            setPublicPrivatePartnerships(MockData.MOCK_PUBLIC_PRIVATE_PARTNERSHIPS || []);
            setSocialImpactBonds(MockData.MOCK_SOCIAL_IMPACT_BONDS || []);
            setGreenBonds(MockData.MOCK_GREEN_BONDS || []);
            setMicrogridInvestments(MockData.MOCK_MICROGRID_INVESTMENTS || []);
            setMultiCurrencyAccounts(MockData.MOCK_MULTI_CURRENCY_ACCOUNTS || []);
            setFxHedges(MockData.MOCK_FX_HEDGES || []);
            setPlanetaryResourceTracker(MockData.MOCK_PLANETARY_RESOURCE_TRACKER || null);
            setSpaceEconomyInvestments(MockData.MOCK_SPACE_ECONOMY_INVESTMENTS || []);
            setAsteroidMiningClaims(MockData.MOCK_ASTEROID_MINING_CLAIMS || []);
            setLunarRealEstateDeeds(MockData.MOCK_LUNAR_REAL_ESTATE_DEEDS || []);
            setOrbitalDebrisTracker(MockData.MOCK_ORBITAL_DEBRIS_TRACKER || null);
            setSpaceTravelInsurance(MockData.MOCK_SPACE_TRAVEL_INSURANCE || []);
            setAlienContactProtocolFunding(MockData.MOCK_ALIEN_CONTACT_PROTOCOL_FUNDING || []);
            setFinancialEducationModules(MockData.MOCK_FINANCIAL_EDUCATION_MODULES || []);
            setSocialFinanceChallenges(MockData.MOCK_SOCIAL_FINANCE_CHALLENGES || []);
            setBehavioralNudges(MockData.MOCK_BEHAVIORAL_NUDGES || []);
            setSubscriptionUsages(MockData.MOCK_SUBSCRIPTION_USAGES || []);
            setSubscriptionTiers(MockData.MOCK_SUBSCRIPTION_TIERS || []);
            setCustomReports(MockData.MOCK_CUSTOM_REPORTS || []);
            setBiReportConfigs(MockData.MOCK_BI_REPORT_CONFIGS || []);
            setRiskAssessments(MockData.MOCK_RISK_ASSESSMENTS || []);
            setPlaidWebhooks(MockData.MOCK_PLAID_WEBHOOKS || []);
            // --- END NEW EXPANSION DATA LOADING ---


        } catch (err: any) {
            console.error("Failed to load data:", err);
            setError(err.message || "Could not load data. Please refresh.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const addTransaction = useCallback(async (tx: Omit<Transaction, 'id'>) => {
        const newTx = { ...tx, id: `txn_${Date.now()}` };
        setTransactions(prev => [newTx, ...prev]);
        // Simulate updating budget
        setBudgets(prev => prev.map(b => b.name.toLowerCase() === tx.category.toLowerCase() ? { ...b, spent: b.spent + tx.amount } : b));
    }, []);

    const addProductToTransactions = useCallback((product: MarketplaceProduct) => {
        const newTx: Omit<Transaction, 'id'> = { type: 'expense', category: 'Shopping', description: product.name, amount: product.price, date: new Date().toISOString().split('T')[0] };
        addTransaction(newTx);
    }, [addTransaction]);
    
    const addBudget = useCallback((budget: Omit<BudgetCategory, 'id'|'spent'|'color'>) => {
        const newBudget: BudgetCategory = { ...budget, id: `budget_${Date.now()}`, spent: 0, color: '#8b5cf6' };
        setBudgets(prev => [...prev, newBudget]);
    }, []);

    const unlinkAccount = useCallback((accountId: string) => setLinkedAccounts(prev => prev.filter(acc => acc.id !== accountId)), []);

    const handlePlaidSuccess = useCallback(async (publicToken: string, metadata: any) => {
        setIsImportingData(true);
        await new Promise(res => setTimeout(res, 2000)); 
        await fetchData();
        setIsImportingData(false);
    }, [fetchData]);

    const markNotificationRead = useCallback((notificationId: string) => setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n)), []);
    
    const redeemReward = useCallback((item: RewardItem) => {
        if (rewardPoints && rewardPoints.balance >= item.cost) {
            setRewardPoints(prev => prev ? ({ ...prev, balance: prev.balance - item.cost }) : null);
            return true;
        }
        return false;
    }, [rewardPoints]);

    const updatePaymentOrderStatus = useCallback((orderId: string, status: PaymentOrderStatus) => setPaymentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o)), []);
    const updateAnomalyStatus = useCallback((anomalyId: string, status: AnomalyStatus) => setFinancialAnomalies(prev => prev.map(a => a.id === anomalyId ? { ...a, status } : a)), []);
    const connectWallet = useCallback(() => setWalletInfo({ address: '0x1234...abcd', balance: 1.25 }), []);
    const issueCard = useCallback(() => setVirtualCard({ cardNumber: '**** **** **** 1234', cvv: '123', expiry: '12/28', holderName: 'The Visionary' }), []);
    const buyCrypto = useCallback((amount: number, currency: string) => addTransaction({ type: 'expense', category: 'Investments', description: `Buy ${currency}`, amount: amount, date: new Date().toISOString().split('T')[0] }), [addTransaction]);
    const mintNFT = useCallback((name: string, imageUrl: string) => setNftAssets(prev => [...prev, { id: `nft_${Date.now()}`, name, imageUrl, contractAddress: '0xabcd...1234' }]), []);
    const addFinancialGoal = useCallback((goal: Omit<FinancialGoal, 'id' | 'currentAmount' | 'plan' | 'progressHistory'>) => setFinancialGoals(prev => [...prev, { ...goal, id: `goal_${Date.now()}`, currentAmount: 0, plan: null }]), []);
    const generateGoalPlan = useCallback(async (goalId: string) => {
        const goal = financialGoals.find(g => g.id === goalId);
        if (!goal) return;
        await new Promise(res => setTimeout(res, 1500));
        const mockPlan: AIGoalPlan = { feasibilitySummary: "This goal is achievable.", monthlyContribution: (goal.targetAmount - goal.currentAmount) / 36, steps: [] };
        setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, plan: mockPlan } : g));
    }, [financialGoals]);
    
    const retrainMlModel = useCallback((modelId: string) => {
        setMlModels(prev => prev.map(m => m.id === modelId ? {...m, status: 'Training'} : m));
        setTimeout(() => setMlModels(prev => prev.map(m => m.id === modelId ? {...m, status: 'Production', accuracy: m.accuracy + 0.1} : m)), 3000);
    }, []);
    const updateFraudCaseStatus = useCallback((caseId: string, status: FraudCase['status']) => setFraudCases(prev => prev.map(c => c.id === caseId ? {...c, status} : c)), []);
    const toggleCorporateCardFreeze = useCallback((cardId: string) => setCorporateCards(prev => prev.map(c => c.id === cardId ? {...c, frozen: !c.frozen} : c)), []);
    const updateCorporateCardControls = useCallback((cardId: string, controls: CorporateCardControls) => setCorporateCards(prev => prev.map(c => c.id === cardId ? {...c, controls} : c)), []);
    const generateDashboardInsights = useCallback(async () => {}, []);

    const fetchMarketplaceProducts = useCallback(async () => {
        if (transactions.length === 0) return;
        setIsMarketplaceLoading(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const transactionSummary = transactions.slice(0, 10).map(t => t.description).join(', ');
            const prompt = `Based on these recent purchases (${transactionSummary}), generate 5 diverse, compelling product recommendations. Provide a short, one-sentence justification for each.`;
            const responseSchema = { type: Type.OBJECT, properties: { products: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, price: { type: Type.NUMBER }, category: { type: Type.STRING }, aiJustification: { type: Type.STRING } } } } } };
            // Simulate AI response
            // const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: responseSchema }});
            // const parsed = JSON.parse(response.text);
            const mockProducts = [
                { name: 'Eco-Friendly Smart Garden', price: 149.99, category: 'Home', aiJustification: 'Your recent grocery spending suggests an interest in fresh produce; this garden allows you to grow your own sustainably.' },
                { name: 'Personalized Financial Literacy Course', price: 99.00, category: 'Education', aiJustification: 'Analyzing your savings goals, this course provides tailored strategies to achieve them faster.' },
                { name: 'Subscription Box for Artisanal Coffee', price: 25.00, category: 'Food & Drink', aiJustification: 'Given your frequent cafe visits, this offers a premium experience at home and potential savings.' },
                { name: 'AI-Powered Resume Builder & Career Coach', price: 49.99, category: 'Career', aiJustification: 'To support your professional growth, this tool can help you identify new opportunities.' },
                { name: 'Smart Home Energy Monitor', price: 79.99, category: 'Utilities', aiJustification: 'Consistent utility expenses suggest a desire for efficiency; this device helps optimize energy use.' },
            ];
            const productsWithIds = mockProducts.map((p: any, i: number) => ({ ...p, id: `prod_${Date.now()}_${i}`, imageUrl: `https://source.unsplash.com/random/400x300?${p.name.split(' ').join(',')}` }));
            setMarketplaceProducts(productsWithIds);
        } catch (error) {
            console.error("Error fetching marketplace products:", error);
            setError("Plato AI encountered an error while curating your products.");
        } finally {
            setIsMarketplaceLoading(false);
        }
    }, [transactions]);

    const getNexusData = useCallback((): NexusGraphData => {
        const nodes: NexusNode[] = [];
        const links: NexusLink[] = [];
        if (!transactions || !financialGoals || !budgets) return { nodes, links };
        nodes.push({ id: 'visionary', label: 'The Visionary', type: 'User', value: 30, color: '#facc15' });
        financialGoals.forEach(goal => {
            nodes.push({ id: goal.id, label: goal.name, type: 'Goal', value: 20, color: '#6366f1' });
            links.push({ source: 'visionary', target: goal.id, relationship: 'has' });
        });
        const recentTx = transactions.slice(0, 3);
        recentTx.forEach(tx => {
            nodes.push({ id: tx.id, label: tx.description, type: 'Transaction', value: 12, color: tx.type === 'income' ? '#22c55e' : '#ef4444' });
            links.push({ source: 'visionary', target: tx.id, relationship: 'performed' });
            const relevantBudget = budgets.find(b => b.name.toLowerCase() === tx.category.toLowerCase());
            if (relevantBudget) {
                if (!nodes.some(n => n.id === relevantBudget.id)) {
                    nodes.push({ id: relevantBudget.id, label: `${relevantBudget.name} Budget`, type: 'Budget', value: 15, color: '#f59e0b' });
                    links.push({ source: 'visionary', target: relevantBudget.id, relationship: 'manages' });
                }
                links.push({ source: tx.id, target: relevantBudget.id, relationship: 'affects' });
            }
        });
        const uniqueNodes = Array.from(new Map(nodes.map(node => [node.id, node])).values());
        return { nodes: uniqueNodes, links };
    }, [transactions, financialGoals, budgets]);

    const unlockFeature = useCallback((view: View) => {
      setUnlockedFeatures(prev => new Set(prev).add(view));
    }, []);
    
    const addDynamicKpi = (kpi: DynamicKpi) => setDynamicKpis(prev => [...prev, kpi]);
    const setCustomBackgroundUrl = (url: string) => {
        localStorage.setItem('customBackgroundUrl', url);
        setCustomBackgroundUrlState(url);
        localStorage.setItem('activeIllusion', 'none');
        setActiveIllusionState('none');
    };
    const setActiveIllusion = (illusion: IllusionType) => {
        localStorage.setItem('activeIllusion', illusion);
        setActiveIllusionState(illusion);
        if (illusion !== 'none') {
          localStorage.removeItem('customBackgroundUrl');
          setCustomBackgroundUrlState(null);
        }
    };
  
    // FIX: Add a mock implementation for the missing generateApiKey function.
    const generateApiKey = useCallback(async () => {
        console.warn("generateApiKey is a mock. In a real app, this would securely fetch and handle an API key.");
        // This function is called by a component that expects a state change to unmount it.
        // As we don't have the parent component's state management, we can't trigger that.
        // This mock prevents the app from crashing due to the missing function.
        await new Promise(res => setTimeout(res, 1000));
    }, []);

    // --- START NEW EXPANSION FUNCTIONS ---
    const addRealEstateAsset = useCallback(async (asset: Omit<RealEstateAsset, 'id'>) => {
        const newAsset = { ...asset, id: `re_${Date.now()}` };
        setRealEstateAssets(prev => [...prev, newAsset]);
    }, []);

    const applyForLoan = useCallback(async (loanDetails: Omit<LoanAccount, 'id' | 'status' | 'balance'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newLoan: LoanAccount = { ...loanDetails, id: `loan_${Date.now()}`, status: 'Pending', balance: loanDetails.amount };
        setLoanAccounts(prev => [...prev, newLoan]);
    }, []);

    const fileInsuranceClaim = useCallback(async (policyId: string, details: string) => {
        await new Promise(res => setTimeout(res, 1000));
        setInsurancePolicies(prev => prev.map(p => p.id === policyId ? { ...p, claims: [...(p.claims || []), { id: `claim_${Date.now()}`, details, status: 'Submitted' }] } : p));
    }, []);

    const generateTaxReport = useCallback(async (year: number) => {
        await new Promise(res => setTimeout(res, 2000));
        const newReport: TaxFiling = { id: `tax_${year}`, year, status: 'Generated', reportUrl: `/reports/tax_${year}.pdf`, calculatedAmount: 15000 };
        setTaxFilings(prev => [...prev, newReport]);
        return newReport;
    }, []);

    const updateEstatePlan = useCallback(async (plan: EstatePlan) => {
        await new Promise(res => setTimeout(res, 1000));
        setEstatePlan(plan);
    }, []);

    const offerMicroLoan = useCallback(async (loan: Omit<MicroLoan, 'id' | 'status' | 'repaidAmount'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newLoan: MicroLoan = { ...loan, id: `microloan_${Date.now()}`, status: 'Active', repaidAmount: 0 };
        setMicroLoans(prev => [...prev, newLoan]);
    }, []);

    const createFamilyBudget = useCallback(async (budget: Omit<FamilyBudget, 'id' | 'members' | 'spent'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newBudget: FamilyBudget = { ...budget, id: `familybudget_${Date.now()}`, members: ['The Visionary'], spent: 0 };
        setFamilyBudgets(prev => [...prev, newBudget]);
    }, []);

    const runFinancialScenario = useCallback(async (scenarioConfig: any) => {
        await new Promise(res => setTimeout(res, 2000));
        const newScenario: ScenarioAnalysis = { id: `scenario_${Date.now()}`, name: scenarioConfig.name || 'Untitled Scenario', config: scenarioConfig, result: { successProbability: 0.75, projectedOutcome: 1000000 }, date: new Date().toISOString() };
        setScenarioAnalyses(prev => [...prev, newScenario]);
        return newScenario;
    }, []);

    const executeTrade = useCallback(async (investment: Omit<AdvancedInvestment, 'id'>) => {
        await new Promise(res => setTimeout(res, 500));
        const newInvestment: AdvancedInvestment = { ...investment, id: `trade_${Date.now()}` };
        setAdvancedInvestments(prev => [...prev, newInvestment]);
    }, []);

    const deployAlgorithmicStrategy = useCallback(async (strategy: AlgorithmicStrategy) => {
        await new Promise(res => setTimeout(res, 1500));
        setAlgorithmicStrategies(prev => [...prev, { ...strategy, id: `algo_${Date.now()}`, status: 'Active' }]);
    }, []);

    const getESGScore = useCallback(async (assetId: string) => {
        await new Promise(res => setTimeout(res, 800));
        const score: ESGScore = { id: `esg_${assetId}`, assetId, environmental: 0.8, social: 0.7, governance: 0.9, date: new Date().toISOString() };
        setEsgScores(prev => [...prev, score]);
        return score;
    }, []);

    const investInAlternativeAsset = useCallback(async (asset: Omit<AlternativeAsset, 'id'>) => {
        await new Promise(res => setTimeout(res, 1200));
        const newAsset: AlternativeAsset = { ...asset, id: `altasset_${Date.now()}` };
        setAlternativeAssets(prev => [...prev, newAsset]);
    }, []);

    const fetchMarketSentiment = useCallback(async () => {
        await new Promise(res => setTimeout(res, 700));
        const sentiment: MarketSentiment = { id: 'sentiment_live', score: 0.65, analysis: 'Slightly bullish on tech, neutral on energy.', timestamp: new Date().toISOString() };
        setMarketSentiment(sentiment);
    }, []);

    const optimizeAIModel = useCallback(async (modelId: string) => {
        await new Promise(res => setTimeout(res, 3000));
        setAiModelPerformances(prev => prev.map(m => m.modelId === modelId ? { ...m, optimizationStatus: 'Completed', accuracyImprovement: 0.05 } : m));
    }, []);

    const detectDataStreamAnomalies = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1500));
        const newAnomaly: DataStreamAnomaly = { id: `anomaly_${Date.now()}`, streamName: 'Transaction_Feed', type: 'UnusualSpendingPattern', timestamp: new Date().toISOString(), severity: 'High' };
        setDataStreamAnomalies(prev => [...prev, newAnomaly]);
    }, []);

    const generateBiasDetectionReport = useCallback(async (modelId: string) => {
        await new Promise(res => setTimeout(res, 2500));
        const report: BiasDetectionReport = { id: `bias_report_${Date.now()}`, modelId, metrics: { genderBias: 0.1, ageBias: 0.05 }, recommendations: ['Adjust training data weighting for feature X'], timestamp: new Date().toISOString() };
        setBiasDetectionReports(prev => [...prev, report]);
        return report;
    }, []);

    const getExplainabilityReport = useCallback(async (modelId: string, insightId: string) => {
        await new Promise(res => setTimeout(res, 1800));
        const report: ExplainabilityReport = { id: `xai_report_${Date.now()}`, modelId, insightId, explanation: 'Decision based primarily on income stability and credit history length.', featureImportance: { income: 0.4, creditHistory: 0.3, debtToIncome: 0.2 }, timestamp: new Date().toISOString() };
        setExplainabilityReports(prev => [...prev, report]);
        return report;
    }, []);

    const conductFinancialModelAudit = useCallback(async (modelId: string) => {
        await new Promise(res => setTimeout(res, 3000));
        const audit: FinancialModelAudit = { id: `audit_${Date.now()}`, modelId, findings: 'Model exhibits minor overfitting in Q1 2023 data.', recommendations: ['Retrain with regularization.'], status: 'Completed', timestamp: new Date().toISOString() };
        setFinancialModelAudits(prev => [...prev, audit]);
        return audit;
    }, []);

    const generateSyntheticData = useCallback(async (config: SyntheticDataConfig) => {
        await new Promise(res => setTimeout(res, 2000));
        const syntheticData: SyntheticDataConfig = { ...config, id: `synthetic_data_${Date.now()}`, status: 'Generated', downloadLink: `/data/synthetic_${Date.now()}.zip` };
        setSyntheticDataConfigs(prev => [...prev, syntheticData]);
        return syntheticData;
    }, []);

    const initiateFederatedLearning = useCallback(async (roundConfig: any) => {
        await new Promise(res => setTimeout(res, 4000));
        const newRound: FederatedLearningRound = { id: `fl_round_${Date.now()}`, config: roundConfig, status: 'Completed', modelUpdateApplied: true, timestamp: new Date().toISOString() };
        setFederatedLearningRounds(prev => [...prev, newRound]);
        return newRound;
    }, []);

    const processVoiceCommand = useCallback(async (command: string) => {
        await new Promise(res => setTimeout(res, 800));
        const newLog: AIAssistantLog = { id: `vcmd_${Date.now()}`, command, response: `Understood: "${command}". Processing...`, timestamp: new Date().toISOString() };
        setAiAssistantLogs(prev => [...prev, newLog]);
        return newLog;
    }, []);

    const generateTreasuryForecast = useCallback(async (period: string) => {
        await new Promise(res => setTimeout(res, 1500));
        const forecast: TreasuryForecast = { id: `forecast_${Date.now()}`, period, cashInflow: 1200000, cashOutflow: 800000, netPosition: 400000, timestamp: new Date().toISOString() };
        setTreasuryForecasts(prev => [...prev, forecast]);
        return forecast;
    }, []);

    const processSupplyChainInvoice = useCallback(async (invoice: Omit<SupplyChainInvoice, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newInvoice: SupplyChainInvoice = { ...invoice, id: `scinv_${Date.now()}`, status: 'Processed' };
        setSupplyChainInvoices(prev => [...prev, newInvoice]);
    }, []);

    const fetchRegulatoryAlerts = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1000));
        const newAlert: RegulatoryAlert = { id: `regalert_${Date.now()}`, region: 'EU', type: 'New Data Privacy Law', description: 'GDPR v2.0 update incoming.', severity: 'High', timestamp: new Date().toISOString() };
        setRegulatoryAlerts(prev => [...prev, newAlert]);
    }, []);

    const initiateGlobalPayrollRun = useCallback(async (runDetails: Omit<GlobalPayrollRun, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 2500));
        const newRun: GlobalPayrollRun = { ...runDetails, id: `globalpayroll_${Date.now()}`, status: 'Completed' };
        setGlobalPayrollRuns(prev => [...prev, newRun]);
    }, []);

    const submitExpenseReport = useCallback(async (report: Omit<ExpenseReport, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 800));
        const newReport: ExpenseReport = { ...report, id: `exp_${Date.now()}`, status: 'Submitted' };
        setExpenseReports(prev => [...prev, newReport]);
    }, []);

    const reviewVendorContract = useCallback(async (contractId: string) => {
        await new Promise(res => setTimeout(res, 1200));
        setVendorContracts(prev => prev.map(c => c.id === contractId ? { ...c, status: 'Reviewed', lastReviewDate: new Date().toISOString() } : c));
    }, []);

    const generateRevenueForecast = useCallback(async (period: string) => {
        await new Promise(res => setTimeout(res, 1500));
        const forecast: RevenueForecast = { id: `revforecast_${Date.now()}`, period, projectedRevenue: 5000000, confidence: 0.85, timestamp: new Date().toISOString() };
        setRevenueForecasts(prev => [...prev, forecast]);
        return forecast;
    }, []);

    const fetchAuditLogs = useCallback(async (filters: any) => {
        await new Promise(res => setTimeout(res, 1000));
        const logs: AuditLog[] = [{ id: `auditlog_${Date.now()}`, userId: 'user123', action: 'Login', timestamp: new Date().toISOString(), details: `User logged in from IP ${filters.ip || '192.168.1.1'}` }];
        setAuditLogs(prev => [...prev, ...logs]);
        return logs;
    }, []);

    const addComplianceRule = useCallback(async (rule: Omit<ComplianceRule, 'id'>) => {
        await new Promise(res => setTimeout(res, 700));
        const newRule: ComplianceRule = { ...rule, id: `comprule_${Date.now()}` };
        setComplianceRules(prev => [...prev, newRule]);
    }, []);

    const updateDataRetentionPolicy = useCallback(async (policy: DataRetentionPolicy) => {
        await new Promise(res => setTimeout(res, 800));
        setDataRetentionPolicies(prev => prev.map(p => p.id === policy.id ? policy : p));
    }, []);

    const updateHRPolicy = useCallback(async (policy: HRPolicy) => {
        await new Promise(res => setTimeout(res, 700));
        setHrPolicies(prev => prev.map(p => p.id === policy.id ? policy : p));
    }, []);

    const addCRMLead = useCallback(async (lead: Omit<CRMLead, 'id'>) => {
        await new Promise(res => setTimeout(res, 600));
        const newLead: CRMLead = { ...lead, id: `crmlead_${Date.now()}` };
        setCrmLeads(prev => [...prev, newLead]);
    }, []);

    const updateCRMContact = useCallback(async (contact: CRMContact) => {
        await new Promise(res => setTimeout(res, 600));
        setCrmContacts(prev => prev.map(c => c.id === contact.id ? contact : c));
    }, []);

    const syncERPDocument = useCallback(async (doc: ERPDocument) => {
        await new Promise(res => setTimeout(res, 1000));
        setErpDocuments(prev => [...prev, { ...doc, id: `erpdoc_${Date.now()}` }]);
    }, []);

    const openLegalCase = useCallback(async (caseDetails: Omit<LegalCase, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1200));
        const newCase: LegalCase = { ...caseDetails, id: `legalcase_${Date.now()}`, status: 'Open' };
        setLegalCases(prev => [...prev, newCase]);
    }, []);

    const submitGrantApplication = useCallback(async (application: Omit<GrantApplication, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newApp: GrantApplication = { ...application, id: `grantapp_${Date.now()}`, status: 'Submitted' };
        setGrantApplications(prev => [...prev, newApp]);
    }, []);

    const registerIoTDevice = useCallback(async (device: Omit<IoTDevice, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 700));
        const newDevice: IoTDevice = { ...device, id: `iot_${Date.now()}`, status: 'Active' };
        setIotDevices(prev => [...prev, newDevice]);
    }, []);

    const acknowledgeMaintenanceAlert = useCallback(async (alertId: string) => {
        await new Promise(res => setTimeout(res, 500));
        setPredictiveMaintenanceAlerts(prev => prev.filter(a => a.id !== alertId)); // Remove on ack
    }, []);

    const trackEnergyConsumption = useCallback(async (data: EnergyConsumptionData) => {
        await new Promise(res => setTimeout(res, 300));
        setEnergyConsumptionData(prev => [...prev, { ...data, id: `energy_${Date.now()}` }]);
    }, []);

    const recordSupplyChainProvenance = useCallback(async (data: SupplyChainProvenance) => {
        await new Promise(res => setTimeout(res, 800));
        setSupplyChainProvenances(prev => [...prev, { ...data, id: `provenance_${Date.now()}` }]);
    }, []);

    const updateGeospatialAsset = useCallback(async (asset: GeospatialAsset) => {
        await new Promise(res => setTimeout(res, 700));
        setGeospatialAssets(prev => prev.map(a => a.id === asset.id ? asset : a));
    }, []);

    const assessWeatherImpact = useCallback(async (location: string) => {
        await new Promise(res => setTimeout(res, 1500));
        const assessment: WeatherImpactAssessment = { id: `weatherimpact_${Date.now()}`, location, impactScore: 0.7, forecast: 'Heavy rain expected, potential supply chain disruption.', timestamp: new Date().toISOString() };
        setWeatherImpactAssessments(prev => [...prev, assessment]);
        return assessment;
    }, []);

    const activateDisasterRecoveryPlan = useCallback(async (planId: string) => {
        await new Promise(res => setTimeout(res, 3000));
        setDisasterRecoveryPlans(prev => prev.map(p => p.id === planId ? { ...p, status: 'Active', activationDate: new Date().toISOString() } : p));
    }, []);

    const reportCyberSecurityThreat = useCallback(async (threat: Omit<CyberSecurityThreat, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 900));
        const newThreat: CyberSecurityThreat = { ...threat, id: `threat_${Date.now()}`, status: 'New' };
        setCyberSecurityThreats(prev => [...prev, newThreat]);
    }, []);

    const runVulnerabilityScan = useCallback(async (target: string) => {
        await new Promise(res => setTimeout(res, 2000));
        const result: VulnerabilityScanResult = { id: `vulnscan_${Date.now()}`, target, vulnerabilitiesFound: 3, severity: 'Medium', reportUrl: `/vulnscan/${Date.now()}.pdf`, timestamp: new Date().toISOString() };
        setVulnerabilityScanResults(prev => [...prev, result]);
        return result;
    }, []);

    const requestPenTest = useCallback(async (scope: string) => {
        await new Promise(res => setTimeout(res, 1500));
        const report: PenetrationTestReport = { id: `pentest_${Date.now()}`, scope, status: 'Requested', timestamp: new Date().toISOString() };
        setPenetrationTestReports(prev => [...prev, report]);
        return report;
    }, []);

    const fetchSecurityAuditLogs = useCallback(async (filters: any) => {
        await new Promise(res => setTimeout(res, 1000));
        const logs: SecurityAuditLog[] = [{ id: `seclog_${Date.now()}`, event: 'Failed login attempt', userId: 'unknown', ipAddress: '203.0.113.45', timestamp: new Date().toISOString() }];
        setSecurityAuditLogs(prev => [...prev, ...logs]);
        return logs;
    }, []);

    const generateComplianceDashboard = useCallback(async (dashboardId: string) => {
        await new Promise(res => setTimeout(res, 2000));
        const dashboard: ComplianceDashboard = { id: dashboardId, name: 'Q4 2024 Compliance Overview', status: 'Generated', complianceScore: 92, violations: 1, timestamp: new Date().toISOString() };
        setComplianceDashboards(prev => [...prev, dashboard]);
        return dashboard;
    }, []);

    const addRegulatoryDeadline = useCallback(async (deadline: Omit<RegulatoryDeadline, 'id'>) => {
        await new Promise(res => setTimeout(res, 500));
        const newDeadline: RegulatoryDeadline = { ...deadline, id: `deadline_${Date.now()}` };
        setRegulatoryDeadlines(prev => [...prev, newDeadline]);
    }, []);

    const initiateLegalHold = useCallback(async (caseId: string, scope: string) => {
        await new Promise(res => setTimeout(res, 1000));
        const newHold: LegalHold = { id: `legalhold_${Date.now()}`, caseId, scope, status: 'Active', timestamp: new Date().toISOString() };
        setLegalHolds(prev => [...prev, newHold]);
    }, []);

    const respondToDiscoveryRequest = useCallback(async (requestId: string) => {
        await new Promise(res => setTimeout(res, 1500));
        setDiscoveryRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Responded', responseDate: new Date().toISOString() } : r));
    }, []);

    const conductLegalResearch = useCallback(async (query: string) => {
        await new Promise(res => setTimeout(res, 2000));
        const result: LegalResearchResult = { id: `legalres_${Date.now()}`, query, summary: 'Key precedents found for X case.', relevantCases: ['Case A', 'Case B'], timestamp: new Date().toISOString() };
        setLegalResearchResults(prev => [...prev, result]);
        return result;
    }, []);

    const filePatentApplication = useCallback(async (app: Omit<PatentApplication, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1800));
        const newApp: PatentApplication = { ...app, id: `patent_${Date.now()}`, status: 'Filed' };
        setPatentApplications(prev => [...prev, newApp]);
    }, []);

    const registerTrademark = useCallback(async (reg: Omit<TrademarkRegistration, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1200));
        const newReg: TrademarkRegistration = { ...reg, id: `trademark_${Date.now()}`, status: 'Registered' };
        setTrademarkRegistrations(prev => [...prev, newReg]);
    }, []);

    const registerCopyright = useCallback(async (asset: Omit<CopyrightAsset, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newAsset: CopyrightAsset = { ...asset, id: `copyright_${Date.now()}`, status: 'Registered' };
        setCopyrightAssets(prev => [...prev, newAsset]);
    }, []);

    const updatePrivacyPolicy = useCallback(async (policy: Omit<PrivacyPolicyVersion, 'id' | 'version'>) => {
        await new Promise(res => setTimeout(res, 800));
        const newPolicy: PrivacyPolicyVersion = { ...policy, id: `pp_${Date.now()}`, version: (privacyPolicyVersions.length + 1).toString(), publishDate: new Date().toISOString() };
        setPrivacyPolicyVersions(prev => [...prev, newPolicy]);
    }, [privacyPolicyVersions]);

    const generateDPA = useCallback(async (parties: string[]) => {
        await new Promise(res => setTimeout(res, 1500));
        const newDPA: DataProcessingAgreement = { id: `dpa_${Date.now()}`, parties, documentUrl: `/docs/dpa_${Date.now()}.pdf`, timestamp: new Date().toISOString() };
        setDataProcessingAgreements(prev => [...prev, newDPA]);
        return newDPA;
    }, []);

    const createConsentFormTemplate = useCallback(async (template: Omit<ConsentFormTemplate, 'id'>) => {
        await new Promise(res => setTimeout(res, 700));
        const newTemplate: ConsentFormTemplate = { ...template, id: `consent_template_${Date.now()}` };
        setConsentFormTemplates(prev => [...prev, newTemplate]);
    }, []);

    const processPersonalDataRequest = useCallback(async (requestId: string) => {
        await new Promise(res => setTimeout(res, 1000));
        setPersonalDataRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Processed', completionDate: new Date().toISOString() } : r));
    }, []);

    const fetchGlobalTaxTreaties = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1200));
        const treaties: GlobalTaxTreaty[] = [{ id: 'us_uk_treaty', countries: ['US', 'UK'], type: 'Double Taxation', effectiveDate: '2020-01-01' }];
        setGlobalTaxTreaties(prev => [...prev, ...treaties]);
        return treaties;
    }, []);

    const fetchJurisdictionProfile = useCallback(async (countryCode: string) => {
        await new Promise(res => setTimeout(res, 800));
        const profile: JurisdictionProfile = { id: `profile_${countryCode}`, countryCode, regulatoryBodies: ['FCA', 'PRA'], commonLaws: ['Contract Law', 'Tax Law'] };
        setJurisdictionProfiles(prev => [...prev, profile]);
        return profile;
    }, []);

    const generateLocalizedContent = useCallback(async (contentId: string, language: string) => {
        await new Promise(res => setTimeout(res, 1500));
        const newContent: LocalizedContent = { id: `${contentId}_${language}`, originalContentId: contentId, language, content: `Localized version of ${contentId} in ${language}`, timestamp: new Date().toISOString() };
        setLocalizedContent(prev => [...prev, newContent]);
        return newContent;
    }, []);

    const bidGovernmentContract = useCallback(async (contract: Omit<GovernmentContract, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 2000));
        const newContract: GovernmentContract = { ...contract, id: `govcontract_${Date.now()}`, status: 'Submitted' };
        setGovernmentContracts(prev => [...prev, newContract]);
    }, []);

    const deployPKI = useCallback(async (config: any) => {
        await new Promise(res => setTimeout(res, 2500));
        const newPKI: PublicKeyInfrastructure = { id: `pki_${Date.now()}`, config, status: 'Deployed', timestamp: new Date().toISOString() };
        setPublicKeyInfrastructures(prev => [...prev, newPKI]);
        return newPKI;
    }, []);

    const monitorDigitalVoting = useCallback(async (systemId: string) => {
        await new Promise(res => setTimeout(res, 1000));
        setDigitalVotingSystems(prev => prev.map(s => s.id === systemId ? { ...s, monitoringStatus: 'Active', lastCheck: new Date().toISOString() } : s));
    }, []);

    const issueTokenizedIdentity = useCallback(async (userId: string) => {
        await new Promise(res => setTimeout(res, 1200));
        const newId: TokenizedIdentity = { id: `tokenid_${Date.now()}`, userId, tokenAddress: `0xTI${Date.now()}`, timestamp: new Date().toISOString() };
        setTokenizedIdentities(prev => [...prev, newId]);
        return newId;
    }, []);

    const registerBiometricProfile = useCallback(async (userId: string, data: any) => {
        await new Promise(res => setTimeout(res, 1000));
        const newProfile: BiometricProfile = { id: `bio_${Date.now()}`, userId, type: 'Fingerprint', dataHash: 'abcd123xyz', enrollmentDate: new Date().toISOString() };
        setBiometricProfiles(prev => [...prev, newProfile]);
        return newProfile;
    }, []);

    const generateQuantumKey = useCallback(async () => {
        await new Promise(res => setTimeout(res, 3000));
        const newKey: QuantumKey = { id: `qkey_${Date.now()}`, keyMaterial: 'QWANTUMKEYMATERIAL', timestamp: new Date().toISOString() };
        setQuantumKeys(prev => [...prev, newKey]);
        return newKey;
    }, []);

    const generateZeroKnowledgeProof = useCallback(async (data: any) => {
        await new Promise(res => setTimeout(res, 2000));
        const newProof: ZeroKnowledgeProof = { id: `zkp_${Date.now()}`, proof: '0xZKPPROOFDATA', statement: 'Balance is positive without revealing amount.', timestamp: new Date().toISOString() };
        setZeroKnowledgeProofs(prev => [...prev, newProof]);
        return newProof;
    }, []);

    const verifyDigitalIdentity = useCallback(async (did: string) => {
        await new Promise(res => setTimeout(res, 800));
        return true; // Mock success
    }, []);

    const createDigitalTwin = useCallback(async (assetId: string, model: any) => {
        await new Promise(res => setTimeout(res, 2000));
        const newTwin: DigitalTwinModel = { id: `dtwin_${assetId}`, assetId, modelConfig: model, status: 'Active', lastSync: new Date().toISOString() };
        setDigitalTwinModels(prev => [...prev, newTwin]);
        return newTwin;
    }, []);

    const encryptDataHomomorphically = useCallback(async (data: any) => {
        await new Promise(res => setTimeout(res, 3000));
        const encrypted: HomomorphicEncryptedData = { id: `homoenc_${Date.now()}`, originalHash: 'originalhash', encryptedData: 'ENCRYPTEDHOMOMORPHICDATA', timestamp: new Date().toISOString() };
        setHomomorphicEncryptedData(prev => [...prev, encrypted]);
        return encrypted;
    }, []);

    const checkPostQuantumCryptoStatus = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1000));
        const status: PostQuantumCryptoStatus = { id: `pq_status_${Date.now()}`, status: 'Transitioning', recommendedAlgorithms: ['Dilithium', 'Kyber'], timestamp: new Date().toISOString() };
        setPostQuantumCryptoStatus(prev => [...prev, status]);
        return status;
    }, []);

    const runQuantumSimulation = useCallback(async (config: any) => {
        await new Promise(res => setTimeout(res, 5000));
        const result: QuantumSimulationResult = { id: `qsim_${Date.now()}`, config, resultData: { 'q_value': 0.123 }, runtime: 4500, timestamp: new Date().toISOString() };
        setQuantumSimulationResults(prev => [...prev, result]);
        return result;
    }, []);

    const deployAIAgent = useCallback(async (agent: Omit<AIAgent, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1500));
        const newAgent: AIAgent = { ...agent, id: `aiagent_${Date.now()}`, status: 'Deployed' };
        setAiAgents(prev => [...prev, newAgent]);
        return newAgent;
    }, []);

    const requestLegalAIReview = useCallback(async (documentId: string) => {
        await new Promise(res => setTimeout(res, 2000));
        const review: LegalAIReview = { id: `laireview_${Date.now()}`, documentId, findings: 'Contract clause 3.2 is ambiguous.', riskLevel: 'Medium', timestamp: new Date().toISOString() };
        setLegalAIReviews(prev => [...prev, review]);
        return review;
    }, []);

    const renderARVRFinancialScene = useCallback(async (sceneConfig: any) => {
        await new Promise(res => setTimeout(res, 2500));
        const scene: ARVRFinancialScene = { id: `arvr_scene_${Date.now()}`, config: sceneConfig, sceneUrl: `/arvr/scene_${Date.now()}`, timestamp: new Date().toISOString() };
        setArvrFinancialScenes(prev => [...prev, scene]);
        return scene;
    }, []);

    const configureAPIGatewayRoute = useCallback(async (route: Omit<APIGatewayRoute, 'id'>) => {
        await new Promise(res => setTimeout(res, 800));
        const newRoute: APIGatewayRoute = { ...route, id: `apiroute_${Date.now()}` };
        setApiGatewayRoutes(prev => [...prev, newRoute]);
    }, []);

    const optimizeCloudResources = useCallback(async () => {
        await new Promise(res => setTimeout(res, 3000));
        const newResource: CloudResource = { id: `cloudres_${Date.now()}`, name: 'Optimized DB instance', type: 'Database', costReduction: 0.15, timestamp: new Date().toISOString() };
        setCloudResources(prev => [...prev, newResource]);
        return newResource;
    }, []);

    const resolveSecurityIncident = useCallback(async (incidentId: string) => {
        await new Promise(res => setTimeout(res, 1500));
        setSecurityIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, status: 'Resolved', resolutionDate: new Date().toISOString() } : i));
    }, []);

    const triggerCICDPipeline = useCallback(async (pipelineId: string) => {
        await new Promise(res => setTimeout(res, 1000));
        setCicdPipelines(prev => prev.map(p => p.id === pipelineId ? { ...p, status: 'Running', lastRun: new Date().toISOString() } : p));
    }, []);

    const toggleFeatureFlag = useCallback(async (flagId: string, enabled: boolean) => {
        await new Promise(res => setTimeout(res, 300));
        setFeatureFlags(prev => prev.map(f => f.id === flagId ? { ...f, enabled } : f));
    }, []);

    const fetchSystemHealthMetrics = useCallback(async () => {
        await new Promise(res => setTimeout(res, 700));
        const metrics: SystemHealthMetric[] = [{ id: `health_${Date.now()}`, component: 'API Gateway', status: 'Operational', latency: 50, timestamp: new Date().toISOString() }];
        setSystemHealthMetrics(prev => [...prev, ...metrics]);
        return metrics;
    }, []);

    const getRecentResourceUtilization = useCallback(async () => {
        await new Promise(res => setTimeout(res, 600));
        const utilization: ResourceUtilization[] = [{ id: `util_${Date.now()}`, resource: 'CPU', percentage: 45, timestamp: new Date().toISOString() }];
        setResourceUtilization(prev => [...prev, ...utilization]);
        return utilization;
    }, []);

    const defineSLA = useCallback(async (sla: Omit<ServiceLevelAgreement, 'id'>) => {
        await new Promise(res => setTimeout(res, 800));
        const newSLA: ServiceLevelAgreement = { ...sla, id: `sla_${Date.now()}` };
        setServiceLevelAgreements(prev => [...prev, newSLA]);
    }, []);

    const getDailyErrorRateTrend = useCallback(async () => {
        await new Promise(res => setTimeout(res, 700));
        const trend: ErrorRateTrend[] = [{ id: `error_trend_${Date.now()}`, date: new Date().toISOString().split('T')[0], errorRate: 0.015, timestamp: new Date().toISOString() }];
        setErrorRateTrends(prev => [...prev, ...trend]);
        return trend;
    }, []);

    const getAverageLatencyReport = useCallback(async () => {
        await new Promise(res => setTimeout(res, 600));
        const report: LatencyReport = { id: `latency_report_${Date.now()}`, averageLatencyMs: 120, maxLatencyMs: 500, timestamp: new Date().toISOString() };
        setLatencyReports(prev => [...prev, report]);
        return report;
    }, []);

    const getHourlyThroughputMetrics = useCallback(async () => {
        await new Promise(res => setTimeout(res, 500));
        const metrics: ThroughputMetric[] = [{ id: `throughput_${Date.now()}`, requestsPerSecond: 1500, timestamp: new Date().toISOString() }];
        setThroughputMetrics(prev => [...prev, ...metrics]);
        return metrics;
    }, []);

    const generateCostOptimizationReport = useCallback(async (period: string) => {
        await new Promise(res => setTimeout(res, 2000));
        const report: CostOptimizationReport = { id: `cost_opt_${Date.now()}`, period, savingsIdentified: 10000, recommendations: ['Migrate unused resources', 'Optimize database queries'], timestamp: new Date().toISOString() };
        setCostOptimizationReports(prev => [...prev, report]);
        return report;
    }, []);

    const broadcastBlockchainTransaction = useCallback(async (tx: Omit<BlockchainTransaction, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1500));
        const newTx: BlockchainTransaction = { ...tx, id: `blocktx_${Date.now()}`, status: 'Confirmed' };
        setBlockchainTransactions(prev => [...prev, newTx]);
    }, []);

    const deploySmartContract = useCallback(async (code: string) => {
        await new Promise(res => setTimeout(res, 2500));
        const newContract: SmartContract = { id: `contract_${Date.now()}`, address: `0xSC${Date.now()}`, codeHash: '0xCODEHASH', status: 'Deployed' };
        setSmartContracts(prev => [...prev, newContract]);
        return newContract;
    }, []);

    const initiateWalletConnectSession = useCallback(async (dappUrl: string) => {
        await new Promise(res => setTimeout(res, 1000));
        const newSession: WalletConnectSession = { id: `wc_${Date.now()}`, dappUrl, status: 'Connected', timestamp: new Date().toISOString() };
        setWalletConnectSessions(prev => [...prev, newSession]);
        return newSession;
    }, []);

    const fetchWeb3GasPrices = useCallback(async () => {
        await new Promise(res => setTimeout(res, 500));
        const prices: Web3GasPrice = { id: `gas_${Date.now()}`, fast: 50, standard: 30, slow: 10, timestamp: new Date().toISOString() };
        setWeb3GasPrices(prices);
    }, []);

    const executeDEXSwap = useCallback(async (swap: Omit<DEXSwap, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 2000));
        const newSwap: DEXSwap = { ...swap, id: `dexswap_${Date.now()}`, status: 'Completed' };
        setDexSwaps(prev => [...prev, newSwap]);
    }, []);

    const initiateBridgeTransaction = useCallback(async (tx: Omit<BridgeTransaction, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 2500));
        const newTx: BridgeTransaction = { ...tx, id: `bridgetx_${Date.now()}`, status: 'Pending' };
        setBridgeTransactions(prev => [...prev, newTx]);
    }, []);

    const createDecentralizedID = useCallback(async (publicKey: string) => {
        await new Promise(res => setTimeout(res, 1200));
        const newDID: DecentralizedID = { id: `did_${Date.now()}`, did: `did:ethr:0x${publicKey.slice(0, 10)}`, publicKey, timestamp: new Date().toISOString() };
        setDecentralizedIDs(prev => [...prev, newDID]);
        return newDID;
    }, []);

    const createNFTCollection = useCallback(async (name: string, symbol: string) => {
        await new Promise(res => setTimeout(res, 1500));
        const newCollection: NFTCollection = { id: `nftcoll_${Date.now()}`, name, symbol, contractAddress: `0xNFTC${Date.now()}` };
        setNftCollections(prev => [...prev, newCollection]);
        return newCollection;
    }, []);

    const tokenizeAsset = useCallback(async (asset: any) => {
        await new Promise(res => setTimeout(res, 1800));
        const newToken: AssetTokenizationRecord = { id: `token_${Date.now()}`, assetId: asset.id || `asset_${Date.now()}`, tokenAddress: `0xAT${Date.now()}`, timestamp: new Date().toISOString() };
        setAssetTokenizationRecords(prev => [...prev, newToken]);
        return newToken;
    }, []);

    const createMetaverseIdentity = useCallback(async (avatarDetails: any) => {
        await new Promise(res => setTimeout(res, 1000));
        const newIdentity: MetaverseIdentity = { id: `metaid_${Date.now()}`, userId: 'user123', avatarConfig: avatarDetails, timestamp: new Date().toISOString() };
        setMetaverseIdentities(prev => [...prev, newIdentity]);
        return newIdentity;
    }, []);

    const uploadToDecentralizedStorage = useCallback(async (file: any) => {
        await new Promise(res => setTimeout(res, 1500));
        const newFile: DecentralizedStorageFile = { id: `dsfile_${Date.now()}`, fileName: file.name, ipfsHash: `Qm${Date.now()}`, storageProvider: 'IPFS', timestamp: new Date().toISOString() };
        setDecentralizedStorageFiles(prev => [...prev, newFile]);
        return newFile;
    }, []);

    const resolveIPFSHash = useCallback(async (hash: string) => {
        await new Promise(res => setTimeout(res, 800));
        return { content: `Content for hash ${hash}`, timestamp: new Date().toISOString() };
    }, []);

    const registerWeb3Domain = useCallback(async (name: string) => {
        await new Promise(res => setTimeout(res, 1000));
        const newDomain: Web3Domain = { id: `w3dom_${Date.now()}`, name, resolverAddress: `0xW3D${Date.now()}`, timestamp: new Date().toISOString() };
        setWeb3Domains(prev => [...prev, newDomain]);
        return newDomain;
    }, []);

    const fetchWalletActivityLogs = useCallback(async (address: string) => {
        await new Promise(res => setTimeout(res, 900));
        const logs: WalletActivityLog[] = [{ id: `walletlog_${Date.now()}`, walletAddress: address, activity: 'Sent 0.1 ETH', timestamp: new Date().toISOString() }];
        setWalletActivityLogs(prev => [...prev, ...logs]);
        return logs;
    }, []);

    const executeSmartContractInteraction = useCallback(async (interaction: Omit<SmartContractInteraction, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1800));
        const newInteraction: SmartContractInteraction = { ...interaction, id: `scint_${Date.now()}`, status: 'Completed' };
        setSmartContractInteractions(prev => [...prev, newInteraction]);
    }, []);

    const fetchGasFeePredictions = useCallback(async () => {
        await new Promise(res => setTimeout(res, 600));
        const prediction: GasFeePrediction = { id: `gasp_${Date.now()}`, baseFee: 25, priorityFee: 5, timestamp: new Date().toISOString() };
        setGasFeePredictions(prediction);
    }, []);

    const onboardToLayer2Solution = useCallback(async (solutionId: string) => {
        await new Promise(res => setTimeout(res, 1500));
        const newL2: Layer2Solution = { id: solutionId, name: 'Optimism', status: 'Onboarded', timestamp: new Date().toISOString() };
        setLayer2Solutions(prev => [...prev, newL2]);
    }, []);

    const getRollupStatus = useCallback(async (rollupId: string) => {
        await new Promise(res => setTimeout(res, 700));
        const status: RollupStatus = { id: `rollup_${rollupId}`, rollupId, latestBlock: 12345, transactionThroughput: 1000, timestamp: new Date().toISOString() };
        setRollupStatus(prev => [...prev, status]);
        return status;
    }, []);

    const subscribeToOracleFeed = useCallback(async (feedId: string) => {
        await new Promise(res => setTimeout(res, 900));
        const newFeed: OracleFeed = { id: feedId, name: 'ETH/USD Price', status: 'Active', lastUpdate: new Date().toISOString() };
        setOracleFeeds(prev => [...prev, newFeed]);
    }, []);

    const simulateTokenomicsModel = useCallback(async (model: any) => {
        await new Promise(res => setTimeout(res, 3000));
        const result: TokenomicsModel = { id: `tokenmodel_${Date.now()}`, config: model, simulationResult: { priceProjection: 1.5, inflationRate: 0.02 }, timestamp: new Date().toISOString() };
        setTokenomicsModels(prev => [...prev, result]);
        return result;
    }, []);

    const joinStakingPool = useCallback(async (poolId: string, amount: number) => {
        await new Promise(res => setTimeout(res, 1200));
        const newPool: StakingPool = { id: poolId, asset: 'ETH', stakedAmount: amount, apr: 0.05, timestamp: new Date().toISOString() };
        setStakingPools(prev => [...prev, newPool]);
    }, []);

    const addLiquidity = useCallback(async (poolId: string, amountA: number, amountB: number) => {
        await new Promise(res => setTimeout(res, 1500));
        const newPool: LiquidityPool = { id: poolId, tokenA: 'USDC', tokenB: 'ETH', providedAmountA: amountA, providedAmountB: amountB, timestamp: new Date().toISOString() };
        setLiquidityPools(prev => [...prev, newPool]);
    }, []);

    const deployYieldFarmingStrategy = useCallback(async (strategy: Omit<YieldFarmingStrategy, 'id'>) => {
        await new Promise(res => setTimeout(res, 2000));
        const newStrategy: YieldFarmingStrategy = { ...strategy, id: `yfs_${Date.now()}`, status: 'Active' };
        setYieldFarmingStrategies(prev => [...prev, newStrategy]);
    }, []);

    const fileInsuranceProtocolClaim = useCallback(async (claim: Omit<InsuranceProtocolClaim, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1800));
        const newClaim: InsuranceProtocolClaim = { ...claim, id: `insclaim_${Date.now()}`, status: 'Pending' };
        setInsuranceProtocolClaims(prev => [...prev, newClaim]);
    }, []);

    const placeDEXOrder = useCallback(async (order: Omit<DecentralizedExchangeOrder, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newOrder: DecentralizedExchangeOrder = { ...order, id: `dexorder_${Date.now()}`, status: 'Filled' };
        setDecentralizedExchangeOrders(prev => [...prev, newOrder]);
    }, []);

    const initiateCrossChainBridge = useCallback(async (bridge: Omit<CrossChainBridge, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 2200));
        const newBridge: CrossChainBridge = { ...bridge, id: `ccbridge_${Date.now()}`, status: 'Pending' };
        setCrossChainBridges(prev => [...prev, newBridge]);
    }, []);

    const adoptInteroperabilityStandard = useCallback(async (standardId: string) => {
        await new Promise(res => setTimeout(res, 800));
        const newStandard: InteroperabilityStandard = { id: standardId, name: 'ERC-20', status: 'Adopted', timestamp: new Date().toISOString() };
        setInteroperabilityStandards(prev => [...prev, newStandard]);
    }, []);

    const integrateIdentityVerificationProvider = useCallback(async (providerId: string) => {
        await new Promise(res => setTimeout(res, 1000));
        const newProvider: IdentityVerificationProvider = { id: providerId, name: 'World ID', status: 'Integrated', timestamp: new Date().toISOString() };
        setIdentityVerificationProviders(prev => [...prev, newProvider]);
    }, []);

    const fetchReputationScore = useCallback(async (entityId: string) => {
        await new Promise(res => setTimeout(res, 700));
        const score: ReputationScore = { id: `repscore_${entityId}`, entityId, score: 0.85, timestamp: new Date().toISOString() };
        setReputationScores(prev => [...prev, score]);
        return score;
    }, []);

    const issueVerifiableCredential = useCallback(async (credential: Omit<VerifiableCredential, 'id'>) => {
        await new Promise(res => setTimeout(res, 1200));
        const newCredential: VerifiableCredential = { ...credential, id: `vc_${Date.now()}`, issuedDate: new Date().toISOString() };
        setVerifiableCredentials(prev => [...prev, newCredential]);
        return newCredential;
    }, []);

    const publishDIDDocument = useCallback(async (doc: Omit<DIDDocument, 'id'>) => {
        await new Promise(res => setTimeout(res, 1500));
        const newDoc: DIDDocument = { ...doc, id: `diddoc_${Date.now()}`, publishedDate: new Date().toISOString() };
        setDidDocuments(prev => [...prev, newDoc]);
        return newDoc;
    }, []);

    const integrateKMS = useCallback(async (kmsConfig: any) => {
        await new Promise(res => setTimeout(res, 1000));
        const newKMS: KeyManagementSystem = { id: `kms_${Date.now()}`, config: kmsConfig, status: 'Integrated', timestamp: new Date().toISOString() };
        setKeyManagementSystems(prev => [...prev, newKMS]);
    }, []);

    const connectHardwareWallet = useCallback(async (device: string) => {
        await new Promise(res => setTimeout(res, 800));
        const newHW: HardwareWalletIntegration = { id: `hw_${Date.now()}`, device, status: 'Connected', timestamp: new Date().toISOString() };
        setHardwareWalletIntegrations(prev => [...prev, newHW]);
    }, []);

    const createMultiSigWallet = useCallback(async (config: Omit<MultiSigWalletConfig, 'id'>) => {
        await new Promise(res => setTimeout(res, 1500));
        const newMSW: MultiSigWalletConfig = { ...config, id: `msw_${Date.now()}`, address: `0xMSW${Date.now()}` };
        setMultiSigWalletConfigs(prev => [...prev, newMSW]);
        return newMSW;
    }, []);

    const configureSocialRecovery = useCallback(async (method: Omit<SocialRecoveryMethod, 'id'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newMethod: SocialRecoveryMethod = { ...method, id: `sr_${Date.now()}` };
        setSocialRecoveryMethods(prev => [...prev, newMethod]);
    }, []);

    const initiateSSIOnboarding = useCallback(async (flowConfig: any) => {
        await new Promise(res => setTimeout(res, 1800));
        const newFlow: SelfSovereignIdentityFlow = { id: `ssi_flow_${Date.now()}`, config: flowConfig, status: 'Started', timestamp: new Date().toISOString() };
        setSelfSovereignIdentityFlows(prev => [...prev, newFlow]);
        return newFlow;
    }, []);

    const processDataPortabilityRequest = useCallback(async (requestId: string) => {
        await new Promise(res => setTimeout(res, 1500));
        setDataPortabilityRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Completed', completionDate: new Date().toISOString() } : r));
    }, []);

    const createPersonalDataVault = useCallback(async (userId: string) => {
        await new Promise(res => setTimeout(res, 1200));
        const newVault: PersonalDataVault = { id: `pdv_${Date.now()}`, userId, storageUrl: `/vaults/${userId}`, timestamp: new Date().toISOString() };
        setPersonalDataVaults(prev => [...prev, newVault]);
        return newVault;
    }, []);

    const toggleDataMonetizationOptIn = useCallback(async (userId: string, optIn: boolean) => {
        await new Promise(res => setTimeout(res, 500));
        const newOptIn: DataMonetizationOptIn = { id: `dmo_${Date.now()}`, userId, optInStatus: optIn, timestamp: new Date().toISOString() };
        setDataMonetizationOptIns(prev => prev.map(o => o.userId === userId ? newOptIn : o));
    }, []);

    const generateCarbonFootprintReport = useCallback(async (scope: string) => {
        await new Promise(res => setTimeout(res, 2000));
        const report: CarbonFootprintReport = { id: `cfp_report_${Date.now()}`, scope, footprintValue: 1200, unit: 'tCO2e', timestamp: new Date().toISOString() };
        setCarbonFootprintReports(prev => [...prev, report]);
        return report;
    }, []);

    const investInSDGProject = useCallback(async (projectId: string, amount: number) => {
        await new Promise(res => setTimeout(res, 1000));
        const project: SDGImpactProject = { id: projectId, name: 'Clean Water Initiative', sdg: 'SDG6', investment: amount, impactMetrics: { peopleReached: 1000 }, timestamp: new Date().toISOString() };
        setSdgImpactProjects(prev => [...prev, project]);
    }, []);

    const generateImpactReport = useCallback(async (period: string) => {
        await new Promise(res => setTimeout(res, 2500));
        const report: ImpactReport = { id: `impact_report_${Date.now()}`, period, totalImpactScore: 0.75, summary: 'Positive environmental and social impact.', timestamp: new Date().toISOString() };
        setImpactReports(prev => [...prev, report]);
        return report;
    }, []);

    const purchaseCarbonCredits = useCallback(async (amount: number, type: string) => {
        await new Promise(res => setTimeout(res, 1000));
        const newCredit: CarbonCredit = { id: `cc_${Date.now()}`, amount, type, unit: 'tCO2e', purchaseDate: new Date().toISOString() };
        setCarbonCreditBalance(prev => [...prev, newCredit]);
    }, []);

    const redeemRenewableEnergyCertificate = useCallback(async (certId: string) => {
        await new Promise(res => setTimeout(res, 800));
        const redeemedCert: RenewableEnergyCertificate = { id: certId, amount: 1000, unit: 'kWh', redeemedDate: new Date().toISOString() };
        setRenewableEnergyCertificates(prev => [...prev, redeemedCert]);
    }, []);

    const assessEnergyEfficiency = useCallback(async (assetId: string) => {
        await new Promise(res => setTimeout(res, 1200));
        const score: EnergyEfficiencyScore = { id: `eescore_${assetId}`, assetId, score: 85, recommendations: ['Upgrade lighting to LED'], timestamp: new Date().toISOString() };
        setEnergyEfficiencyScores(prev => [...prev, score]);
        return score;
    }, []);

    const implementSustainableCodingPractice = useCallback(async (practice: Omit<SustainableCodingPractice, 'id'>) => {
        await new Promise(res => setTimeout(res, 700));
        const newPractice: SustainableCodingPractice = { ...practice, id: `scp_${Date.now()}` };
        setSustainableCodingPractices(prev => [...prev, newPractice]);
    }, []);

    const generateGreenITReport = useCallback(async (scope: string) => {
        await new Promise(res => setTimeout(res, 2000));
        const report: GreenITReport = { id: `greenit_report_${Date.now()}`, scope, energySavings: 0.1, carbonReduction: 50, timestamp: new Date().toISOString() };
        setGreenITReports(prev => [...prev, report]);
        return report;
    }, []);

    const trackCircularEconomyMetric = useCallback(async (metric: Omit<CircularEconomyMetric, 'id'>) => {
        await new Promise(res => setTimeout(res, 600));
        const newMetric: CircularEconomyMetric = { ...metric, id: `cem_${Date.now()}` };
        setCircularEconomyMetrics(prev => [...prev, newMetric]);
    }, []);

    const launchRecyclingProgram = useCallback(async (program: Omit<RecyclingProgram, 'id'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newProgram: RecyclingProgram = { ...program, id: `recycle_prog_${Date.now()}` };
        setRecyclingPrograms(prev => [...prev, newProgram]);
    }, []);

    const setWasteReductionTarget = useCallback(async (target: Omit<WasteReductionTarget, 'id'>) => {
        await new Promise(res => setTimeout(res, 700));
        const newTarget: WasteReductionTarget = { ...target, id: `wr_target_${Date.now()}` };
        setWasteReductionTargets(prev => [...prev, newTarget]);
    }, []);

    const conductEthicalSupplyChainAudit = useCallback(async (supplierId: string) => {
        await new Promise(res => setTimeout(res, 1800));
        const audit: EthicalSupplyChainAudit = { id: `esca_${Date.now()}`, supplierId, findings: 'No major ethical violations found.', rating: 'Good', timestamp: new Date().toISOString() };
        setEthicalSupplyChainAudits(prev => [...prev, audit]);
        return audit;
    }, []);

    const generateLaborPracticeReport = useCallback(async (region: string) => {
        await new Promise(res => setTimeout(res, 1500));
        const report: LaborPracticeReport = { id: `lpr_${Date.now()}`, region, complianceScore: 0.9, timestamp: new Date().toISOString() };
        setLaborPracticeReports(prev => [...prev, report]);
        return report;
    }, []);

    const trackDiversityInclusionMetrics = useCallback(async (data: Omit<DiversityInclusionMetric, 'id'>) => {
        await new Promise(res => setTimeout(res, 600));
        const newMetric: DiversityInclusionMetric = { ...data, id: `di_metric_${Date.now()}` };
        setDiversityInclusionMetrics(prev => [...prev, newMetric]);
    }, []);

    const calculateSocialImpactScore = useCallback(async (entityId: string) => {
        await new Promise(res => setTimeout(res, 1200));
        const score: SocialImpactScore = { id: `sis_${entityId}`, entityId, score: 0.8, timestamp: new Date().toISOString() };
        setSocialImpactScores(prev => [...prev, score]);
        return score;
    }, []);

    const makeCommunityInvestment = useCallback(async (investment: Omit<CommunityInvestment, 'id'>) => {
        await new Promise(res => setTimeout(res, 900));
        const newInvestment: CommunityInvestment = { ...investment, id: `ci_${Date.now()}` };
        setCommunityInvestments(prev => [...prev, newInvestment]);
    }, []);

    const logVolunteerHours = useCallback(async (log: Omit<VolunteerHours, 'id'>) => {
        await new Promise(res => setTimeout(res, 500));
        const newLog: VolunteerHours = { ...log, id: `vh_${Date.now()}` };
        setVolunteerHours(prev => [...prev, newLog]);
    }, []);

    const makePhilanthropicDonation = useCallback(async (donation: Omit<PhilanthropicDonation, 'id'>) => {
        await new Promise(res => setTimeout(res, 800));
        const newDonation: PhilanthropicDonation = { ...donation, id: `pd_${Date.now()}` };
        setPhilanthropicDonations(prev => [...prev, newDonation]);
    }, []);

    const applyForGrantFunding = useCallback(async (grant: Omit<GrantFunding, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1500));
        const newGrant: GrantFunding = { ...grant, id: `gf_${Date.now()}`, status: 'Pending' };
        setGrantFunding(prev => [...prev, newGrant]);
    }, []);

    const createImpactInvestmentFund = useCallback(async (fund: Omit<ImpactInvestmentFund, 'id'>) => {
        await new Promise(res => setTimeout(res, 1800));
        const newFund: ImpactInvestmentFund = { ...fund, id: `iif_${Date.now()}` };
        setImpactInvestmentFunds(prev => [...prev, newFund]);
    }, []);

    const launchMicrofinanceInitiative = useCallback(async (initiative: Omit<MicrofinanceInitiative, 'id'>) => {
        await new Promise(res => setTimeout(res, 1200));
        const newInitiative: MicrofinanceInitiative = { ...initiative, id: `mfi_${Date.now()}` };
        setMicrofinanceInitiatives(prev => [...prev, newInitiative]);
    }, []);

    const trackSocialEnterpriseKPI = useCallback(async (kpi: Omit<SocialEnterpriseKPI, 'id'>) => {
        await new Promise(res => setTimeout(res, 600));
        const newKpi: SocialEnterpriseKPI = { ...kpi, id: `sekpi_${Date.now()}` };
        setSocialEnterpriseKPIs(prev => [...prev, newKpi]);
    }, []);

    const updateNonProfitGovernance = useCallback(async (governance: NonProfitGovernance) => {
        await new Promise(res => setTimeout(res, 800));
        setNonProfitGovernance(prev => prev.map(g => g.id === governance.id ? governance : g));
    }, []);

    const launchFundraisingCampaign = useCallback(async (campaign: Omit<FundraisingCampaign, 'id' | 'raisedAmount'>) => {
        await new Promise(res => setTimeout(res, 1500));
        const newCampaign: FundraisingCampaign = { ...campaign, id: `fsc_${Date.now()}`, raisedAmount: 0 };
        setFundraisingCampaigns(prev => [...prev, newCampaign]);
    }, []);

    const logDonorInteraction = useCallback(async (interaction: Omit<DonorRelationManagement, 'id'>) => {
        await new Promise(res => setTimeout(res, 500));
        const newInteraction: DonorRelationManagement = { ...interaction, id: `drm_${Date.now()}` };
        setDonorRelationManagement(prev => [...prev, newInteraction]);
    }, []);

    const createEndowmentFund = useCallback(async (fund: Omit<EndowmentFund, 'id'>) => {
        await new Promise(res => setTimeout(res, 1800));
        const newFund: EndowmentFund = { ...fund, id: `ef_${Date.now()}` };
        setEndowmentFunds(prev => [...prev, newFund]);
    }, []);

    const launchScholarshipProgram = useCallback(async (program: Omit<ScholarshipProgram, 'id' | 'awardedAmount'>) => {
        await new Promise(res => setTimeout(res, 1200));
        const newProgram: ScholarshipProgram = { ...program, id: `sp_${Date.now()}`, awardedAmount: 0 };
        setScholarshipPrograms(prev => [...prev, newProgram]);
    }, []);

    const applyForResearchGrant = useCallback(async (grant: Omit<ResearchGrant, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1500));
        const newGrant: ResearchGrant = { ...grant, id: `rg_${Date.now()}`, status: 'Pending' };
        setResearchGrants(prev => [...prev, newGrant]);
    }, []);

    const submitPublicFundingApplication = useCallback(async (app: Omit<PublicFundingApplication, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newApp: PublicFundingApplication = { ...app, id: `pfa_${Date.now()}`, status: 'Submitted' };
        setPublicFundingApplications(prev => [...prev, newApp]);
    }, []);

    const recordLobbyingSpend = useCallback(async (spend: Omit<PoliticalLobbyingSpend, 'id'>) => {
        await new Promise(res => setTimeout(res, 700));
        const newSpend: PoliticalLobbyingSpend = { ...spend, id: `pls_${Date.now()}` };
        setPoliticalLobbyingSpend(prev => [...prev, newSpend]);
    }, []);

    const engageInRegulatoryAdvocacy = useCallback(async (advocacy: Omit<RegulatoryAdvocacy, 'id'>) => {
        await new Promise(res => setTimeout(res, 800));
        const newAdvocacy: RegulatoryAdvocacy = { ...advocacy, id: `ra_${Date.now()}` };
        setRegulatoryAdvocacy(prev => [...prev, newAdvocacy]);
    }, []);

    const conductPolicyImpactAnalysis = useCallback(async (policy: any) => {
        await new Promise(res => setTimeout(res, 2000));
        const analysis: PolicyImpactAnalysis = { id: `pia_${Date.now()}`, policyName: policy.name, impactScore: 0.65, timestamp: new Date().toISOString() };
        setPolicyImpactAnalyses(prev => [...prev, analysis]);
        return analysis;
    }, []);

    const makeSmartCityInvestment = useCallback(async (investment: Omit<SmartCityInvestment, 'id'>) => {
        await new Promise(res => setTimeout(res, 1500));
        const newInvestment: SmartCityInvestment = { ...investment, id: `sci_${Date.now()}` };
        setSmartCityInvestments(prev => [...prev, newInvestment]);
    }, []);

    const fundInfrastructureProject = useCallback(async (project: Omit<InfrastructureProject, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 2000));
        const newProject: InfrastructureProject = { ...project, id: `infrap_${Date.now()}`, status: 'Funded' };
        setInfrastructureProjects(prev => [...prev, newProject]);
    }, []);

    const formPublicPrivatePartnership = useCallback(async (partnership: Omit<PublicPrivatePartnership, 'id'>) => {
        await new Promise(res => setTimeout(res, 1800));
        const newPartnership: PublicPrivatePartnership = { ...partnership, id: `ppp_${Date.now()}` };
        setPublicPrivatePartnerships(prev => [...prev, newPartnership]);
    }, []);

    const investInSocialImpactBond = useCallback(async (bond: Omit<SocialImpactBond, 'id'>) => {
        await new Promise(res => setTimeout(res, 1200));
        const newBond: SocialImpactBond = { ...bond, id: `sib_${Date.now()}` };
        setSocialImpactBonds(prev => [...prev, newBond]);
    }, []);

    const issueGreenBond = useCallback(async (bond: Omit<GreenBond, 'id'>) => {
        await new Promise(res => setTimeout(res, 1500));
        const newBond: GreenBond = { ...bond, id: `gb_${Date.now()}` };
        setGreenBonds(prev => [...prev, newBond]);
    }, []);

    const investInMicrogrid = useCallback(async (investment: Omit<MicrogridInvestment, 'id'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newInvestment: MicrogridInvestment = { ...investment, id: `mginv_${Date.now()}` };
        setMicrogridInvestments(prev => [...prev, newInvestment]);
    }, []);

    const openMultiCurrencyAccount = useCallback(async (currency: string) => {
        await new Promise(res => setTimeout(res, 800));
        const newAccount: MultiCurrencyAccount = { id: `mca_${Date.now()}`, currency, balance: 0 };
        setMultiCurrencyAccounts(prev => [...prev, newAccount]);
    }, []);

    const createFXHedge = useCallback(async (hedge: Omit<FXHedge, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1200));
        const newHedge: FXHedge = { ...hedge, id: `fxh_${Date.now()}`, status: 'Active' };
        setFxHedges(prev => [...prev, newHedge]);
    }, []);

    const fetchPlanetaryResourceData = useCallback(async () => {
        await new Promise(res => setTimeout(res, 2000));
        const data: PlanetaryResourceTracker = { id: `prt_${Date.now()}`, resource: 'Helium-3', quantity: 100000, location: 'Lunar South Pole', timestamp: new Date().toISOString() };
        setPlanetaryResourceTracker(data);
    }, []);

    const investInSpaceEconomy = useCallback(async (investment: Omit<SpaceEconomyInvestment, 'id'>) => {
        await new Promise(res => setTimeout(res, 1500));
        const newInvestment: SpaceEconomyInvestment = { ...investment, id: `seinv_${Date.now()}` };
        setSpaceEconomyInvestments(prev => [...prev, newInvestment]);
    }, []);

    const fileAsteroidMiningClaim = useCallback(async (claim: Omit<AsteroidMiningClaim, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 2500));
        const newClaim: AsteroidMiningClaim = { ...claim, id: `amc_${Date.now()}`, status: 'Pending' };
        setAsteroidMiningClaims(prev => [...prev, newClaim]);
    }, []);

    const purchaseLunarRealEstate = useCallback(async (deed: Omit<LunarRealEstateDeed, 'id' | 'owner'>) => {
        await new Promise(res => setTimeout(res, 2000));
        const newDeed: LunarRealEstateDeed = { ...deed, id: `lre_${Date.now()}`, owner: 'The Visionary' };
        setLunarRealEstateDeeds(prev => [...prev, newDeed]);
    }, []);

    const fetchOrbitalDebrisData = useCallback(async () => {
        await new Promise(res => setTimeout(res, 1800));
        const data: OrbitalDebrisTracker = { id: `odt_${Date.now()}`, count: 25000, riskLevel: 'Medium', timestamp: new Date().toISOString() };
        setOrbitalDebrisTracker(data);
    }, []);

    const buySpaceTravelInsurance = useCallback(async (policy: Omit<SpaceTravelInsurance, 'id' | 'status'>) => {
        await new Promise(res => setTimeout(res, 1000));
        const newPolicy: SpaceTravelInsurance = { ...policy, id: `sti_${Date.now()}`, status: 'Active' };
        setSpaceTravelInsurance(prev => [...prev, newPolicy]);
    }, []);

    const fundAlienContactProtocol = useCallback(async (funding: Omit<AlienContactProtocolFunding, 'id'>) => {
        await new Promise(res => setTimeout(res, 3000));
        const newFunding: AlienContactProtocolFunding = { ...funding, id: `acpf_${Date.now()}` };
        setAlienContactProtocolFunding(prev => [...prev, newFunding]);
    }, []);

    const completeFinancialEducationModule = useCallback(async (moduleId: string) => {
        await new Promise(res => setTimeout(res, 1000));
        setFinancialEducationModules(prev => prev.map(m => m.id === moduleId ? { ...m, status: 'Completed', completionDate: new Date().toISOString() } : m));
    }, []);

    const joinSocialFinanceChallenge = useCallback(async (challengeId: string) => {
        await new Promise(res => setTimeout(res, 800));
        const challenge: SocialFinanceChallenge = { id: challengeId, name: 'Save 5k in 60 days', participants: ['Visionary', 'Friend1'], status: 'Active' };
        setSocialFinanceChallenges(prev => [...prev, challenge]);
    }, []);

    const applyBehavioralNudge = useCallback(async (nudgeType: string) => {
        await new Promise(res => setTimeout(res, 300));
        const nudge: BehavioralNudge = { id: `nudge_${Date.now()}`, type: nudgeType, effect: 'Increased savings intention', timestamp: new Date().toISOString() };
        setBehavioralNudges(prev => [...prev, nudge]);
    }, []);

    const trackSubscriptionUsage = useCallback(async (usage: Omit<SubscriptionUsage, 'id'>) => {
        await new Promise(res => setTimeout(res, 500));
        const newUsage: SubscriptionUsage = { ...usage, id: `sub_usage_${Date.now()}` };
        setSubscriptionUsages(prev => [...prev, newUsage]);
    }, []);

    const upgradeSubscriptionTier = useCallback(async (tierId: string) => {
        await new Promise(res => setTimeout(res, 1000));
        setSubscriptionTiers(prev => prev.map(t => t.id === tierId ? { ...t, current: true } : { ...t, current: false }));
    }, []);

    const generateCustomReport = useCallback(async (config: BIReportConfig) => {
        await new Promise(res => setTimeout(res, 2000));
        const report: CustomReport = { id: `creport_${Date.now()}`, configId: config.id, reportUrl: `/reports/custom_${Date.now()}.pdf`, timestamp: new Date().toISOString() };
        setCustomReports(prev => [...prev, report]);
        return report;
    }, []);

    const createBIReportConfig = useCallback(async (config: Omit<BIReportConfig, 'id'>) => {
        await new Promise(res => setTimeout(res, 800));
        const newConfig: BIReportConfig = { ...config, id: `biconfig_${Date.now()}` };
        setBiReportConfigs(prev => [...prev, newConfig]);
        return newConfig;
    }, []);

    const conductRiskAssessment = useCallback(async (entityId: string) => {
        await new Promise(res => setTimeout(res, 1500));
        const assessment: RiskAssessment = { id: `risk_assess_${Date.now()}`, entityId, score: 'Medium', mitigationPlan: 'Implement multi-factor authentication', timestamp: new Date().toISOString() };
        setRiskAssessments(prev => [...prev, assessment]);
        return assessment;
    }, []);

    const processPlaidWebhook = useCallback(async (webhook: PlaidWebhook) => {
        await new Promise(res => setTimeout(res, 700));
        // In a real app, this would process the webhook, update relevant data.
        setPlaidWebhooks(prev => [...prev, { ...webhook, id: `plaidwh_${Date.now()}` }]);
    }, []);
    // --- END NEW EXPANSION FUNCTIONS ---

    const value: IDataContext = {
        isLoading, error, refetchData: fetchData,
        transactions, addTransaction, assets, portfolioAssets, impactInvestments, budgets, addBudget, 
        financialGoals, addFinancialGoal, generateGoalPlan, subscriptions, upcomingBills, savingsGoals, gamification, 
        rewardPoints, rewardItems, redeemReward, creditScore, creditFactors, customBackgroundUrl, 
        setCustomBackgroundUrl, activeIllusion, setActiveIllusion, aiInsights, 
        isInsightsLoading, generateDashboardInsights, marketplaceProducts, 
        isMarketplaceLoading, fetchMarketplaceProducts, addProductToTransactions, dynamicKpis, addDynamicKpi, getNexusData,
        cryptoAssets, nftAssets, paymentOperations, walletInfo, connectWallet, virtualCard, issueCard, buyCrypto, mintNFT,
        corporateCards, corporateTransactions, paymentOrders, updatePaymentOrderStatus, invoices, complianceCases,
        financialAnomalies, updateAnomalyStatus, counterparties, toggleCorporateCardFreeze, updateCorporateCardControls, payRuns,
        projects, courses, employees,
        accessLogs, fraudCases, updateFraudCaseStatus, mlModels, retrainMlModel,
        loanApplications, mortgageAssets, threatIntelBriefs, insuranceClaims,
        riskProfiles, dataCatalogItems, dataLakeStats, salesDeals, marketingCampaigns,
        growthMetrics, competitors, benchmarks, licenses, disclosures, legalDocs,
        sandboxExperiments, consentRecords, containerImages, apiUsage, incidents, backupJobs,
        impactData, linkedAccounts, isImportingData, handlePlaidSuccess, unlinkAccount, marketMovers, notifications, markNotificationRead, apiStatus,
        unlockedFeatures, unlockFeature,
        generateApiKey,

        // --- START NEW EXPANSION VALUES ---
        realEstateAssets, addRealEstateAsset,
        loanAccounts, applyForLoan,
        insurancePolicies, fileInsuranceClaim,
        taxFilings, generateTaxReport,
        estatePlan, updateEstatePlan,
        microLoans, offerMicroLoan,
        familyBudgets, createFamilyBudget,
        scenarioAnalyses, runFinancialScenario,
        advancedInvestments, executeTrade,
        algorithmicStrategies, deployAlgorithmicStrategy,
        esgScores, getESGScore,
        alternativeAssets, investInAlternativeAsset,
        marketSentiment, fetchMarketSentiment,
        aiModelPerformances, optimizeAIModel,
        dataStreamAnomalies, detectDataStreamAnomalies,
        ethicalAIGuidelines, // State only
        biasDetectionReports, generateBiasDetectionReport,
        fairnessMetrics, // State only
        explainabilityReports, getExplainabilityReport,
        financialModelAudits, conductFinancialModelAudit,
        modelDriftAlerts, // State only
        syntheticDataConfigs, generateSyntheticData,
        federatedLearningRounds, initiateFederatedLearning,
        aiAssistantLogs, processVoiceCommand,
        treasuryForecasts, generateTreasuryForecast,
        supplyChainInvoices, processSupplyChainInvoice,
        regulatoryAlerts, fetchRegulatoryAlerts,
        globalPayrollRuns, initiateGlobalPayrollRun,
        expenseReports, submitExpenseReport,
        vendorContracts, reviewVendorContract,
        revenueForecasts, generateRevenueForecast,
        auditLogs, fetchAuditLogs,
        complianceRules, addComplianceRule,
        dataRetentionPolicies, updateDataRetentionPolicy,
        hrPolicies, updateHRPolicy,
        recruitmentPipelines, // State only
        onboardingFlows, // State only
        offboardingChecklists, // State only
        crmLeads, addCRMLead,
        crmContacts, updateCRMContact,
        erpDocuments, syncERPDocument,
        legalCases, openLegalCase,
        grantApplications, submitGrantApplication,
        iotDevices, registerIoTDevice,
        predictiveMaintenanceAlerts, acknowledgeMaintenanceAlert,
        energyConsumptionData, trackEnergyConsumption,
        supplyChainProvenances, recordSupplyChainProvenance,
        geospatialAssets, updateGeospatialAsset,
        weatherImpactAssessments, assessWeatherImpact,
        disasterRecoveryPlans, activateDisasterRecoveryPlan,
        cyberSecurityThreats, reportCyberSecurityThreat,
        vulnerabilityScanResults, runVulnerabilityScan,
        penetrationTestReports, requestPenTest,
        securityAuditLogs, fetchSecurityAuditLogs,
        complianceDashboards, generateComplianceDashboard,
        regulatoryDeadlines, addRegulatoryDeadline,
        legalHolds, initiateLegalHold,
        discoveryRequests, respondToDiscoveryRequest,
        legalResearchResults, conductLegalResearch,
        patentApplications, filePatentApplication,
        trademarkRegistrations, registerTrademark,
        copyrightAssets, registerCopyright,
        privacyPolicyVersions, updatePrivacyPolicy,
        dataProcessingAgreements, generateDPA,
        consentFormTemplates, createConsentFormTemplate,
        personalDataRequests, processPersonalDataRequest,
        globalTaxTreaties, fetchGlobalTaxTreaties,
        jurisdictionProfiles, fetchJurisdictionProfile,
        localizedContent, generateLocalizedContent,
        governmentContracts, bidGovernmentContract,
        publicKeyInfrastructures, deployPKI,
        digitalVotingSystems, monitorDigitalVoting,
        tokenizedIdentities, issueTokenizedIdentity,
        biometricProfiles, registerBiometricProfile,
        quantumKeys, generateQuantumKey,
        zeroKnowledgeProofs, generateZeroKnowledgeProof,
        digitalIdentities, verifyDigitalIdentity,
        digitalTwinModels, createDigitalTwin,
        homomorphicEncryptedData, encryptDataHomomorphically,
        postQuantumCryptoStatus, checkPostQuantumCryptoStatus,
        quantumSimulationResults, runQuantumSimulation,
        aiAgents, deployAIAgent,
        legalAIReviews, requestLegalAIReview,
        arvrFinancialScenes, renderARVRFinancialScene,
        apiGatewayRoutes, configureAPIGatewayRoute,
        cloudResources, optimizeCloudResources,
        securityIncidents, resolveSecurityIncident,
        cicdPipelines, triggerCICDPipeline,
        featureFlags, toggleFeatureFlag,
        systemHealthMetrics, fetchSystemHealthMetrics,
        resourceUtilization, getRecentResourceUtilization,
        serviceLevelAgreements, defineSLA,
        errorRateTrends, getDailyErrorRateTrend,
        latencyReports, getAverageLatencyReport,
        throughputMetrics, getHourlyThroughputMetrics,
        costOptimizationReports, generateCostOptimizationReport,
        blockchainTransactions, broadcastBlockchainTransaction,
        smartContracts, deploySmartContract,
        walletConnectSessions, initiateWalletConnectSession,
        web3GasPrices, fetchWeb3GasPrices,
        dexSwaps, executeDEXSwap,
        bridgeTransactions, initiateBridgeTransaction,
        decentralizedIDs, createDecentralizedID,
        nftCollections, createNFTCollection,
        assetTokenizationRecords, tokenizeAsset,
        metaverseIdentities, createMetaverseIdentity,
        decentralizedStorageFiles, uploadToDecentralizedStorage,
        ipfsHashes, resolveIPFSHash,
        web3Domains, registerWeb3Domain,
        walletActivityLogs, fetchWalletActivityLogs,
        smartContractInteractions, executeSmartContractInteraction,
        gasFeePredictions, fetchGasFeePredictions,
        layer2Solutions, onboardToLayer2Solution,
        rollupStatus, getRollupStatus,
        oracleFeeds, subscribeToOracleFeed,
        tokenomicsModels, simulateTokenomicsModel,
        stakingPools, joinStakingPool,
        liquidityPools, addLiquidity,
        yieldFarmingStrategies, deployYieldFarmingStrategy,
        insuranceProtocolClaims, fileInsuranceProtocolClaim,
        decentralizedExchangeOrders, placeDEXOrder,
        crossChainBridges, initiateCrossChainBridge,
        interoperabilityStandards, adoptInteroperabilityStandard,
        identityVerificationProviders, integrateIdentityVerificationProvider,
        reputationScores, fetchReputationScore,
        verifiableCredentials, issueVerifiableCredential,
        didDocuments, publishDIDDocument,
        keyManagementSystems, integrateKMS,
        hardwareWalletIntegrations, connectHardwareWallet,
        multiSigWalletConfigs, createMultiSigWallet,
        socialRecoveryMethods, configureSocialRecovery,
        selfSovereignIdentityFlows, initiateSSIOnboarding,
        dataPortabilityRequests, processDataPortabilityRequest,
        personalDataVaults, createPersonalDataVault,
        dataMonetizationOptIns, toggleDataMonetizationOptIn,
        carbonFootprintReports, generateCarbonFootprintReport,
        sdgImpactProjects, investInSDGProject,
        impactReports, generateImpactReport,
        carbonCreditBalance, purchaseCarbonCredits,
        renewableEnergyCertificates, redeemRenewableEnergyCertificate,
        energyEfficiencyScores, assessEnergyEfficiency,
        sustainableCodingPractices, implementSustainableCodingPractice,
        greenITReports, generateGreenITReport,
        circularEconomyMetrics, trackCircularEconomyMetric,
        recyclingPrograms, launchRecyclingProgram,
        wasteReductionTargets, setWasteReductionTarget,
        ethicalSupplyChainAudits, conductEthicalSupplyChainAudit,
        laborPracticeReports, generateLaborPracticeReport,
        diversityInclusionMetrics, trackDiversityInclusionMetrics,
        socialImpactScores, calculateSocialImpactScore,
        communityInvestments, makeCommunityInvestment,
        volunteerHours, logVolunteerHours,
        philanthropicDonations, makePhilanthropicDonation,
        grantFunding, applyForGrantFunding,
        impactInvestmentFunds, createImpactInvestmentFund,
        microfinanceInitiatives, launchMicrofinanceInitiative,
        socialEnterpriseKPIs, trackSocialEnterpriseKPI,
        nonProfitGovernance, updateNonProfitGovernance,
        fundraisingCampaigns, launchFundraisingCampaign,
        donorRelationManagement, logDonorInteraction,
        endowmentFunds, createEndowmentFund,
        scholarshipPrograms, launchScholarshipProgram,
        researchGrants, applyForResearchGrant,
        publicFundingApplications, submitPublicFundingApplication,
        politicalLobbyingSpend, recordLobbyingSpend,
        regulatoryAdvocacy, engageInRegulatoryAdvocacy,
        policyImpactAnalyses, conductPolicyImpactAnalysis,
        smartCityInvestments, makeSmartCityInvestment,
        infrastructureProjects, fundInfrastructureProject,
        publicPrivatePartnerships, formPublicPrivatePartnership,
        socialImpactBonds, investInSocialImpactBond,
        greenBonds, issueGreenBond,
        microgridInvestments, investInMicrogrid,
        multiCurrencyAccounts, openMultiCurrencyAccount,
        fxHedges, createFXHedge,
        planetaryResourceTracker, fetchPlanetaryResourceData,
        spaceEconomyInvestments, investInSpaceEconomy,
        asteroidMiningClaims, fileAsteroidMiningClaim,
        lunarRealEstateDeeds, purchaseLunarRealEstate,
        orbitalDebrisTracker, fetchOrbitalDebrisData,
        spaceTravelInsurance, buySpaceTravelInsurance,
        alienContactProtocolFunding, fundAlienContactProtocol,
        financialEducationModules, completeFinancialEducationModule,
        socialFinanceChallenges, joinSocialFinanceChallenge,
        behavioralNudges, applyBehavioralNudge,
        subscriptionUsages, trackSubscriptionUsage,
        subscriptionTiers, upgradeSubscriptionTier,
        customReports, generateCustomReport,
        biReportConfigs, createBIReportConfig,
        riskAssessments, conductRiskAssessment,
        plaidWebhooks, processPlaidWebhook
        // --- END NEW EXPANSION VALUES ---
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/context/DataContext.tsx
================================================================================

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Transaction, PortfolioAsset, UserProfile, 
  AppView, View, Notification, InternalAccount,
  AIInsight, BudgetCategory, RewardItem, APIStatus,
  Pipeline, InboundBlob, FundFlow, AuthorizedApp,
  CreditScore, CreditFactor, FinancialGoal, RewardPoints,
  PaymentOrder, Invoice, ComplianceCase, CorporateTransaction,
  EIP6963ProviderDetail, MarqetaCardProduct, SecurityScoreMetric,
  AuditLogEntry, ThreatAlert, DataSharingPolicy, APIKey,
  TrustedContact, SecurityAwarenessModule, TransactionRule
} from '../types';
import { 
  MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_BUDGETS, 
  MOCK_REWARD_ITEMS, MOCK_API_STATUS, MOCK_NOTIFICATIONS,
  MOCK_CREDIT_SCORE, MOCK_CREDIT_FACTORS, MOCK_FINANCIAL_GOALS,
  MOCK_REWARD_POINTS,
  MOCK_SECURITY_METRICS, MOCK_AUDIT_LOGS, MOCK_THREAT_ALERTS,
  MOCK_DATA_SHARING_POLICIES, MOCK_API_KEYS, MOCK_TRUSTED_CONTACTS,
  MOCK_SECURITY_AWARENESS, MOCK_TRANSACTION_RULES
} from '../data/mockData';

export interface ApiEndpoints {
    quantumFinancial: string;
    plaid: string;
    stripe: string;
    modernTreasury: string;
    gemini: string;
    gein: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
}

interface IDataContext {
  view: AppView; activeView: View; setView: (view: AppView) => void;
  setActiveView: (view: View) => void; userProfile: UserProfile; user: UserProfile; 
  creator: { name: string; title: string }; transactions: Transaction[]; assets: PortfolioAsset[];
  internalAccounts: InternalAccount[]; notifications: Notification[]; aiInsights: AIInsight[];
  insights: AIInsight[]; budgets: BudgetCategory[]; rewardItems: RewardItem[]; apiStatus: APIStatus[];
  pipelines: Pipeline[]; inboundBlobs: InboundBlob[]; fundFlows: FundFlow[]; authorizedApps: AuthorizedApp[];
  geminiApiKey: string | null; setGeminiApiKey: (key: string) => void;
  modernTreasuryApiKey: string | null; setModernTreasuryApiKey: (key: string) => void;
  modernTreasuryOrganizationId: string | null; setModernTreasuryOrganizationId: (id: string) => void;
  setTransactions: (txs: Transaction[]) => void; updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void; setAssets: (assets: PortfolioAsset[]) => void;
  setInternalAccounts: (accounts: InternalAccount[]) => void;
  showNotification: (message: string, severity: Notification['severity']) => void;
  markNotificationRead: (id: string) => void; authorizeApp: (app: Partial<AuthorizedApp>) => void;
  revokeApp: (id: string) => void; redeemReward: (item: RewardItem) => boolean;
  askSovereignAI: (prompt: string, modelName?: string) => Promise<string>;
  simulationData: { time: string; value: number }[]; isImportingData: boolean; treesPlanted: number;
  spendingForNextTree: number; linkedAccounts: any[]; unlinkAccount: (id: string) => void;
  paymentOrders: PaymentOrder[]; invoices: Invoice[]; complianceCases: ComplianceCase[];
  corporateTransactions: CorporateTransaction[]; creditScore: CreditScore; creditFactors: CreditFactor[];
  financialGoals: FinancialGoal[]; addFinancialGoal: (goal: Partial<FinancialGoal>) => void;
  generateGoalPlan: (id: string) => Promise<void>; addContributionToGoal: (id: string, amount: number) => void;
  addRecurringContributionToGoal: (id: string, contrib: any) => void;
  updateRecurringContributionInGoal: (gid: string, cid: string, updates: any) => void;
  deleteRecurringContributionFromGoal: (gid: string, cid: string) => void;
  updateFinancialGoal: (id: string, updates: any) => void; linkGoals: (s: string, t: string, type: any, amt?: number) => void;
  unlinkGoals: (s: string, t: string) => void; isWalletConnectModalOpen: boolean;
  setWalletConnectModalOpen: (open: boolean) => void; detectedProviders: EIP6963ProviderDetail[];
  connectWallet: (provider: EIP6963ProviderDetail) => void; rewardPoints: RewardPoints;
  apiEndpoints: ApiEndpoints; updateEndpoint: (key: keyof ApiEndpoints, value: string) => void;
  sovereignCredits: number; deductCredits: (amount: number) => boolean; isProductionApproved: boolean;
  plaidProducts: string[]; addTransaction: (tx: Transaction) => void;
  isLoading: boolean; error: string | null; broadcastEvent: (type: string, data: any) => void;
  githubRepoFiles: GitHubFile[]; fetchRepo: () => Promise<void>; fetchDirectory: (path: string) => Promise<void>; isRepoLoading: boolean;
  addBudget: (name: string, limit: number) => void; stripeApiKey: string | null;
  marqetaCardProducts: MarqetaCardProduct[]; fetchMarqetaProducts: () => Promise<void>;
  isMarqetaLoading: boolean; marqetaApiToken: string | null; marqetaApiSecret: string | null;
  setMarqetaCredentials: (token: string, secret: string) => void; plaidApiKey: string | null;
  dbConfig: any; updateDbConfig: (updates: any) => void; connectDatabase: () => Promise<void>;
  webDriverStatus: any; launchWebDriver: (task: string) => Promise<void>;
  showSystemAlert: (message: string, severity: Notification['severity']) => void;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  securityMetrics: SecurityScoreMetric[]; auditLogs: AuditLogEntry[];
  threatAlerts: ThreatAlert[]; dataSharingPolicies: DataSharingPolicy[];
  apiKeys: APIKey[]; trustedContacts: TrustedContact[];
  securityAwarenessModules: SecurityAwarenessModule[]; transactionRules: TransactionRule[];
  initiateWireTransfer: (details: any) => Promise<void>;
  initiateACHTransfer: (details: any) => Promise<void>;
  logAuditAction: (action: string, details: any) => void;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

const STORAGE_KEY = 'QUANTUM_FINANCIAL_STATE_V1';
const GITHUB_STORAGE_KEY = 'QUANTUM_GITHUB_REPO_V1';
const GITHUB_OWNER = 'jocall3';
const GITHUB_REPO = 'jocall3';

const MOCK_INBOUND_BLOBS: InboundBlob[] = [
    { id: 'b-1', filePath: 's3://nexus/ingest/quantum_q4_raw.csv', status: 'IMPORTED', vendorName: 'Quantum Financial', interfaceType: 'SFTP', createdAt: '2024-11-15T09:00:00Z' }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>(View.Dashboard);
  const [transactions, setTransactionsState] = useState<Transaction[]>(MOCK_TRANSACTIONS as any);
  const [assets, setAssetsState] = useState<PortfolioAsset[]>(MOCK_ASSETS as any);
  const [internalAccounts, setInternalAccountsState] = useState<InternalAccount[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS as any);
  const [simulationData, setSimulationData] = useState<{ time: string; value: number }[]>([]);
  const [isImportingData, setIsImportingData] = useState(false);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(MOCK_FINANCIAL_GOALS as any);
  const [isWalletConnectModalOpen, setWalletConnectModalOpen] = useState(false);
  const [detectedProviders, setDetectedProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([
    { id: 'acc_01', name: 'Quantum Elite Checking', mask: '9981', balance: 8500000, institutionId: 'quantum_intl' },
    { id: 'acc_02', name: 'Global Treasury Savings', mask: '1102', balance: 25000000, institutionId: 'quantum_intl' }
  ]);
  const [authorizedApps, setAuthorizedApps] = useState<AuthorizedApp[]>([
    { id: 'app-1', name: 'Quantum Nexus ERP', description: 'Enterprise Resource Planning', status: 'active', authorizedAt: '2024-10-01T08:00:00Z' }
  ]);
  
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key'));
  const [modernTreasuryApiKey, setModernTreasuryApiKey] = useState<string | null>(localStorage.getItem('mt_api_key'));
  const [modernTreasuryOrganizationId, setModernTreasuryOrganizationId] = useState<string | null>(localStorage.getItem('mt_org_id'));

  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoints>({
      quantumFinancial: 'https://api.quantumfinancial.io/v1',
      plaid: 'https://production.plaid.com',
      stripe: 'https://api.stripe.com/v1',
      modernTreasury: 'https://app.moderntreasury.com/api',
      gemini: 'https://generativelanguage.googleapis.com',
      gein: 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io'
  });

  const [sovereignCredits, setSovereignCredits] = useState(500000);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(MOCK_BUDGETS as any);
  const [marqetaCardProducts, setMarqetaCardProducts] = useState<MarqetaCardProduct[]>([]);
  const [isMarqetaLoading, setIsMarqetaLoading] = useState(false);
  const [marqetaApiToken, setMarqetaApiToken] = useState<string | null>(localStorage.getItem('marqeta_token'));
  const [marqetaApiSecret, setMarqetaApiSecret] = useState<string | null>(localStorage.getItem('marqeta_secret'));
  
  const [dbConfig, setDbConfig] = useState({
      host: 'quantum-db-cluster.aws.internal',
      port: '5432',
      username: 'quantum_admin',
      password: '',
      databaseName: 'quantum_ledger_prod',
      connectionStatus: 'disconnected' as 'connected' | 'disconnected' | 'connecting',
      sslMode: 'require'
  });

  const updateDbConfig = useCallback((updates: any) => {
    setDbConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const [webDriverStatus, setWebDriverStatus] = useState({
      status: 'idle' as 'idle' | 'running' | 'error',
      logs: [] as string[]
  });

  const [githubRepoFiles, setGithubRepoFiles] = useState<GitHubFile[]>([]);
  const [isRepoLoading, setIsRepoLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS as any);

  const logAuditAction = useCallback((action: string, details: any) => {
    const entry: AuditLogEntry = {
      id: `AUDIT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details: JSON.stringify(details),
      user: 'James Burvel oCallaghan III',
      ipAddress: '10.0.0.42',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [entry, ...prev]);
    console.log(`[QUANTUM_AUDIT] ${action}`, details);
  }, []);

  const showNotification = useCallback((message: string, severity: Notification['severity']) => {
    setNotifications(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: 'Just Now',
      read: false,
      severity: severity || 'info'
    }, ...prev].slice(0, 20));
  }, []);

  const initiateWireTransfer = useCallback(async (details: any) => {
    logAuditAction('WIRE_TRANSFER_INITIATED', details);
    showNotification('MFA Challenge Issued: Please verify on your Quantum Secure Key.', 'info');
    await new Promise(r => setTimeout(r, 2000));
    showNotification('Fraud Monitoring: Transaction cleared heuristic analysis.', 'success');
    showNotification(`Wire Transfer of ${details.amount} to ${details.recipient} successful.`, 'success');
    logAuditAction('WIRE_TRANSFER_COMPLETED', { ...details, status: 'SETTLED' });
  }, [logAuditAction, showNotification]);

  const initiateACHTransfer = useCallback(async (details: any) => {
    logAuditAction('ACH_TRANSFER_INITIATED', details);
    showNotification('Processing ACH Batch...', 'info');
    await new Promise(r => setTimeout(r, 1500));
    showNotification(`ACH Transfer to ${details.recipient} queued for next window.`, 'success');
    logAuditAction('ACH_TRANSFER_QUEUED', details);
  }, [logAuditAction, showNotification]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.transactions) setTransactionsState(parsed.transactions);
        if (parsed.assets) setAssetsState(parsed.assets);
        if (parsed.internalAccounts) setInternalAccountsState(parsed.internalAccounts);
        if (parsed.financialGoals) setFinancialGoals(parsed.financialGoals);
        if (parsed.linkedAccounts) setLinkedAccounts(parsed.linkedAccounts);
      } catch (e) { console.error("State hydration failed", e); }
    }
    
    const savedGithub = localStorage.getItem(GITHUB_STORAGE_KEY);
    if (savedGithub) {
        try { setGithubRepoFiles(JSON.parse(savedGithub)); } catch (e) { console.error('Failed to parse cached GitHub repo', e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      transactions, assets, internalAccounts, financialGoals, linkedAccounts
    }));
  }, [transactions, assets, internalAccounts, financialGoals, linkedAccounts]);

  useEffect(() => {
    const interval = setInterval(() => {
      const totalWealth = assets.reduce((sum, a) => sum + a.value, 0) + 24500000;
      setSimulationData(prev => {
        const newData = [...prev, { 
          time: new Date().toLocaleTimeString(), 
          value: totalWealth + (Math.random() - 0.5) * 50000 
        }].slice(-30);
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [assets]);

  const askSovereignAI = useCallback(async (prompt: string, modelName = 'gemini-1.5-pro') => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const model = ai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, topP: 0.95 }
        });
        return result.response.text();
    } catch (e) {
        return "Quantum AI Core synchronization interrupted. Re-establishing secure link...";
    }
  }, []);

  const broadcastEvent = useCallback((type: string, data: any) => {
      logAuditAction(`SYSTEM_EVENT_${type}`, data);
      showNotification(`System Event: ${type.replace(/_/g, ' ')}`, 'info');
  }, [showNotification, logAuditAction]);

  const fetchDirectoryContents = useCallback(async (path: string): Promise<GitHubFile[]> => {
    setIsRepoLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
      let data: GitHubFile[] = await res.json();
      return data.map(item => ({ ...item, path: item.path || `${path}/${item.name}`.replace(/\/\//g, '/') }));
    } catch (e) {
      showNotification(`Repo Error: Could not load ${path}`, 'error');
      return [];
    } finally { setIsRepoLoading(false); }
  }, [showNotification]);

  const fetchRepo = useCallback(async () => {
    setIsRepoLoading(true);
    const rootFiles = await fetchDirectoryContents(''); 
    setGithubRepoFiles(rootFiles);
    setIsRepoLoading(false);
    showNotification('Quantum Repository structure synchronized.', 'success');
    localStorage.setItem(GITHUB_STORAGE_KEY, JSON.stringify(rootFiles));
  }, [fetchDirectoryContents, showNotification]);

  const connectDatabase = useCallback(async () => {
      updateDbConfig({ connectionStatus: 'connecting' });
      await new Promise(r => setTimeout(r, 1500));
      updateDbConfig({ connectionStatus: 'connected' });
      logAuditAction('DATABASE_CONNECTED', { host: dbConfig.host });
      showNotification("Quantum Database nexus synchronized.", "success");
  }, [updateDbConfig, showNotification, logAuditAction, dbConfig.host]);

  const value: IDataContext = useMemo(() => ({
    view, activeView: view as View, setView, setActiveView: setView as (view: View) => void,
    userProfile: { id: 'USR-77-X-ALPHA', name: 'James Burvel oCallaghan III', title: 'Sovereign Architect', email: 'james@quantum.io', phone: '+1 (555) 942-0123', loyaltyTier: 'OMEGA', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', usdBalance: 2450000000, fiatBalance: 2450000000, cryptoBalance: 14200.55 },
    user: { id: 'USR-77-X-ALPHA', name: 'James Burvel oCallaghan III', title: 'Sovereign Architect', email: 'james@quantum.io', phone: '+1 (555) 942-0123', loyaltyTier: 'OMEGA', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', usdBalance: 2450000000, fiatBalance: 2450000000, cryptoBalance: 14200.55 },
    creator: { name: 'James Burvel oCallaghan III', title: 'Grand Architect of Quantum AI' },
    transactions, assets, internalAccounts, notifications, aiInsights: [], insights: [],
    budgets, rewardItems: MOCK_REWARD_ITEMS as any, apiStatus: MOCK_API_STATUS as any,
    pipelines: [
      { id: 'p-1', name: 'Quantum Ledger Sync', pipelineName: 'NEXUS_TX_FEED', status: 'SUCCESS', prettyDuration: '1.2s' },
      { id: 'p-2', name: 'Risk Vector Audit', pipelineName: 'HEURISTIC_RISK', status: 'RUNNING', prettyDuration: '240ms' }
    ],
    inboundBlobs: MOCK_INBOUND_BLOBS, 
    fundFlows: [{ id: 'f-1', name: 'Reserve Accumulation', ledgerId: 'L-771', postedTxCount: 1242, pendingTxCount: 12 }],
    authorizedApps, simulationData, geminiApiKey,
    setGeminiApiKey: (key) => { setGeminiApiKey(key); localStorage.setItem('gemini_api_key', key); },
    modernTreasuryApiKey,
    setModernTreasuryApiKey: (key) => { setModernTreasuryApiKey(key); localStorage.setItem('mt_api_key', key); },
    modernTreasuryOrganizationId,
    setModernTreasuryOrganizationId: (id) => { setModernTreasuryOrganizationId(id); localStorage.setItem('mt_org_id', id); },
    setTransactions: setTransactionsState,
    updateTransaction: (id, updates) => setTransactionsState(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)),
    deleteTransaction: (id) => setTransactionsState(prev => prev.filter(t => t.id !== id)),
    addTransaction: (tx) => setTransactionsState(prev => [tx, ...prev]),
    setAssets: setAssetsState,
    setInternalAccounts: setInternalAccountsState,
    showNotification,
    markNotificationRead: (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)),
    authorizeApp: (app) => setAuthorizedApps(prev => [...prev, { id: app.id || `app-${Date.now()}`, name: app.name || 'Unknown', description: app.description || '', status: 'active', authorizedAt: new Date().toISOString(), scopes: app.scopes }]),
    revokeApp: (id) => setAuthorizedApps(prev => prev.map(a => a.id === id ? { ...a, status: 'revoked' } : a)),
    redeemReward: (item) => { showNotification(`Redeemed ${item.name}`, 'success'); return true; },
    rewardPoints: MOCK_REWARD_POINTS,
    askSovereignAI,
    isImportingData,
    treesPlanted: 142,
    spendingForNextTree: 120,
    linkedAccounts,
    unlinkAccount: (id) => { setLinkedAccounts(prev => prev.filter(a => a.id !== id)); showNotification("Institutional link severed.", "warning"); },
    paymentOrders: [], invoices: [], complianceCases: [], corporateTransactions: [],
    creditScore: MOCK_CREDIT_SCORE,
    creditFactors: MOCK_CREDIT_FACTORS,
    financialGoals,
    addFinancialGoal: (goal) => setFinancialGoals(prev => [...prev, { id: `goal-${Date.now()}`, name: goal.name || 'New Goal', targetAmount: goal.targetAmount || 0, currentAmount: 0, targetDate: goal.targetDate || new Date().toISOString(), iconName: goal.iconName || 'default', plan: null, startDate: new Date().toISOString(), contributions: [], status: 'on_track' }]),
    generateGoalPlan: async (id) => { showNotification("Neural strategist is mapping your trajectory...", "info"); await new Promise(r => setTimeout(r, 2000)); showNotification("Strategic roadmap synthesized.", "success"); },
    addContributionToGoal: (id, amount) => setFinancialGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g)),
    addRecurringContributionToGoal: () => {},
    updateRecurringContributionInGoal: () => {},
    deleteRecurringContributionFromGoal: () => {},
    updateFinancialGoal: (id, updates) => setFinancialGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g)),
    linkGoals: () => {},
    unlinkGoals: () => {},
    isWalletConnectModalOpen,
    setWalletConnectModalOpen,
    detectedProviders,
    connectWallet: (provider) => showNotification(`Synchronized with ${provider.info.name}`, "success"),
    apiEndpoints,
    updateEndpoint: (key, value) => setApiEndpoints(prev => ({ ...prev, [key]: value })),
    sovereignCredits,
    deductCredits: (amount) => { if (sovereignCredits >= amount) { setSovereignCredits(prev => prev - amount); return true; } return false; },
    isProductionApproved: true,
    plaidProducts: ['auth', 'transactions', 'identity', 'balance'],
    isLoading: false,
    error: null,
    broadcastEvent,
    addBudget: (name, limit) => setBudgets(prev => [...prev, { id: `b-${Date.now()}`, name, limit, spent: 0, color: '#06b6d4', remaining: limit, category: name, alerts: [] }]),
    stripeApiKey: process.env.STRIPE_SECRET_KEY || null,
    marqetaCardProducts,
    fetchMarqetaProducts: async () => { setIsMarqetaLoading(true); await new Promise(r => setTimeout(r, 1000)); setMarqetaCardProducts([{ token: 'cp-1', name: 'Quantum Black', active: true, start_date: '2024-01-01', config: { fulfillment: { bin_prefix: '424242' }, poi: { other: {} } } } as any]); setIsMarqetaLoading(false); },
    isMarqetaLoading,
    marqetaApiToken,
    marqetaApiSecret,
    setMarqetaCredentials: (token, secret) => { setMarqetaApiToken(token); setMarqetaApiSecret(secret); localStorage.setItem('marqeta_token', token); localStorage.setItem('marqeta_secret', secret); },
    plaidApiKey: process.env.PLAID_SECRET || null,
    dbConfig,
    updateDbConfig,
    connectDatabase,
    webDriverStatus,
    launchWebDriver: async (task) => { setWebDriverStatus(prev => ({ ...prev, status: 'running', logs: [...prev.logs, `Starting task: ${task}`] })); await new Promise(r => setTimeout(r, 2000)); setWebDriverStatus(prev => ({ ...prev, status: 'idle', logs: [...prev.logs, `Task completed: ${task}`] })); },
    showSystemAlert: (msg, sev) => showNotification(msg, sev),
    handlePlaidSuccess: (token, meta) => showNotification(`Account linked: ${meta.institution.name}`, "success"),
    securityMetrics: MOCK_SECURITY_METRICS,
    auditLogs,
    threatAlerts: MOCK_THREAT_ALERTS,
    dataSharingPolicies: MOCK_DATA_SHARING_POLICIES,
    apiKeys: MOCK_API_KEYS,
    trustedContacts: MOCK_TRUSTED_CONTACTS,
    securityAwarenessModules: MOCK_SECURITY_AWARENESS,
    transactionRules: MOCK_TRANSACTION_RULES,
    githubRepoFiles,
    fetchRepo,
    fetchDirectory: async () => {},
    isRepoLoading,
    initiateWireTransfer,
    initiateACHTransfer,
    logAuditAction,
  }), [
    view, transactions, assets, internalAccounts, notifications, simulationData, isImportingData, financialGoals, isWalletConnectModalOpen, detectedProviders, linkedAccounts, authorizedApps, 
    geminiApiKey, modernTreasuryApiKey, modernTreasuryOrganizationId, budgets, sovereignCredits, 
    marqetaCardProducts, isMarqetaLoading, marqetaApiToken, marqetaApiSecret, 
    dbConfig, webDriverStatus, githubRepoFiles, isRepoLoading, auditLogs,
    showNotification, askSovereignAI, broadcastEvent, connectDatabase, initiateWireTransfer, initiateACHTransfer, logAuditAction, fetchRepo, updateDbConfig
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/context/DataContext.tsx
================================================================================

import React, { createContext, useState, ReactNode } from 'react';
import { View } from '../types';

interface DataContextType {
  customBackgroundUrl: string | null;
  setCustomBackgroundUrl: (url: string | null) => void;
  activeIllusion: string | null;
  setActiveIllusion: (illusion: string | null) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string | null>(null);
  const [activeIllusion, setActiveIllusion] = useState<string | null>('aurora');

  return (
    <DataContext.Provider value={{ 
      customBackgroundUrl, 
      setCustomBackgroundUrl, 
      activeIllusion, 
      setActiveIllusion 
    }}>
      {children}
    </DataContext.Provider>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/context/DataContext.tsx
================================================================================

import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { 
    Transaction, Asset, BudgetCategory, GamificationState, View, Notification, 
    PaymentOrder, Invoice, ComplianceCase, CorporateTransaction, DatabaseConfig, WebDriverStatus,
    FinancialGoal, AIGoalPlan, RecurringContribution, LinkedGoal, Contribution,
    CreditScore, UpcomingBill, SavingsGoal, MarketMover, APIStatus, Subscription,
    DataSharingPolicy, APIKey, TrustedContact, SecurityAwarenessModule, ThreatAlert, AuditLogEntry, SecurityScoreMetric,
    MarqetaCardProduct, TransactionRule
} from '../types';
import {
    MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_BUDGETS, MOCK_CREDIT_SCORE,
    MOCK_UPCOMING_BILLS, MOCK_SAVINGS_GOALS, MOCK_MARKET_MOVERS,
    MOCK_NOTIFICATIONS, MOCK_API_STATUS,
    MOCK_PAYMENT_ORDERS, MOCK_INVOICES, MOCK_COMPLIANCE_CASES,
    MOCK_CORPORATE_TRANSACTIONS, MOCK_SUBSCRIPTIONS
} from '../data/mockData';

// --- Citibankdemobusinessinc Ecosystem ---
// This file is part of the Citibankdemobusinessinc ecosystem, a unified platform
// designed to drive open banking adoption in the US. It provides the central
// data context for all applications within the ecosystem.

// --- DataContextType Definition ---
interface DataContextType {
    // --- App State ---
    isLoading: boolean;
    error: string | null;

    // --- Navigation & UI ---
    activeView: View;
    setActiveView: (view: View) => void;
    
    // --- Financial Data ---
    transactions: Transaction[];
    assets: Asset[];
    budgets: BudgetCategory[];
    creditScore: any;
    upcomingBills: any[];
    savingsGoals: any[];
    financialGoals: FinancialGoal[];
    marketMovers: MarketMover[];
    linkedAccounts: any[];
    notifications: Notification[];
    subscriptions: Subscription[];
    
    // --- Corporate & Treasury ---
    paymentOrders: PaymentOrder[];
    invoices: Invoice[];
    complianceCases: ComplianceCase[];
    corporateTransactions: CorporateTransaction[];
    
    // --- Crypto & Web3 ---
    cryptoAssets: any[];
    walletInfo: any;
    virtualCard: any;
    nftAssets: any[];
    connectWallet: (provider: any) => void;
    disconnectWallet: () => void;
    detectedProviders: any[];
    issueCard: () => void;
    buyCrypto: (amount: number, currency: string) => void;

    // --- Integrations & Config ---
    plaidApiKey: string | null;
    plaidClientId: string | null;
    stripeApiKey: string | null;
    geminiApiKey: string | null;
    marqetaApiToken: string | null;
    marqetaApiSecret: string | null;
    modernTreasuryApiKey: string | null;
    modernTreasuryOrganizationId: string | null;
    
    // --- Marqeta ---
    marqetaCardProducts: MarqetaCardProduct[];
    fetchMarqetaProducts: () => void;
    isMarqetaLoading: boolean;

    // --- Database & Infrastructure ---
    dbConfig: DatabaseConfig;
    updateDbConfig: (config: Partial<DatabaseConfig>) => void;
    connectDatabase: () => Promise<void>;
    
    // --- Web Driver / Automation ---
    webDriverStatus: WebDriverStatus;
    launchWebDriver: (taskName: string) => Promise<void>;

    // --- Security & Compliance ---
    showSystemAlert: (message: string, type: string) => void;
    unlinkAccount: (id: string) => void;
    securityMetrics: SecurityScoreMetric[];
    auditLogs: AuditLogEntry[];
    threatAlerts: ThreatAlert[];
    dataSharingPolicies: DataSharingPolicy[];
    apiKeys: APIKey[];
    trustedContacts: TrustedContact[];
    securityAwarenessModules: SecurityAwarenessModule[];
    transactionRules: TransactionRule[];

    // --- Actions ---
    addTransaction: (transaction: Transaction) => void;
    updateBudget: (id: string, spent: number) => void;
    addBudget: (name: string, limit: number) => void;
    markNotificationRead: (id: string) => void;
    setGeminiApiKey: (key: string) => void;
    setModernTreasuryApiKey: (key: string) => void;
    setModernTreasuryOrganizationId: (id: string) => void;
    setMarqetaCredentials: (token: string, secret: string) => void;
    addFinancialGoal: (goalData: Omit<FinancialGoal, 'id' | 'currentAmount' | 'plan' | 'contributions' | 'recurringContributions' | 'linkedGoals' | 'status'>) => void;
    generateGoalPlan: (goalId: string) => Promise<void>;
    addContributionToGoal: (goalId: string, amount: number) => void;
    addRecurringContributionToGoal: (goalId: string, contribution: Omit<RecurringContribution, 'id'>) => void;
    updateRecurringContributionInGoal: (goalId: string, contributionId: string, updates: Partial<RecurringContribution>) => void;
    deleteRecurringContributionFromGoal: (goalId: string, contributionId: string) => void;
    updateFinancialGoal: (goalId: string, updates: Partial<FinancialGoal>) => void;
    linkGoals: (sourceGoalId: string, targetGoalId: string, relationshipType: LinkedGoal['relationshipType'], triggerAmount?: number) => void;
    unlinkGoals: (sourceGoalId: string, targetGoalId: string) => void;
    
    // --- Other ---
    impactData: { treesPlanted: number; progressToNextTree: number };
    gamification: GamificationState;
    rewardPoints: { balance: number; lastEarned: number; lastRedeemed: number; currency: string };
    creditFactors: any[];
    apiStatus: APIStatus[];
    
    // --- Legacy / Helpers ---
    handlePlaidSuccess: (publicToken: string, metadata: any) => void;
    isImportingData: boolean;
    userProfile: any;
    askSovereignAI: (prompt: string) => Promise<string>;
    broadcastEvent: (eventType: string, payload: any) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- App State ---
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Navigation ---
    const [activeView, setActiveView] = useState<View>(View.Dashboard);

    // --- Financial Data State ---
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
    const [creditScore, setCreditScore] = useState<CreditScore>({ score: 0, change: 0, rating: '---' });
    const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>([]);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
    const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
    const [marketMovers, setMarketMovers] = useState<MarketMover[]>([]);
    const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    
    // --- Corporate State ---
    const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [complianceCases, setComplianceCases] = useState<ComplianceCase[]>([]);
    const [corporateTransactions, setCorporateTransactions] = useState<CorporateTransaction[]>([]);
    
    // --- API Status ---
    const [apiStatus, setApiStatus] = useState<APIStatus[]>([]);
    
    // --- API Keys & Config ---
    const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(process.env.GEMINI_API_KEY || null);
    const [stripeApiKey, setStripeApiKey] = useState<string | null>(process.env.STRIPE_SECRET_KEY || null);
    const [plaidClientId] = useState<string | null>(process.env.PLAID_CLIENT_ID || null);
    const [plaidApiKey] = useState<string | null>(process.env.PLAID_SECRET || null);
    const [marqetaApiToken, setMarqetaApiToken] = useState<string | null>(null);
    const [marqetaApiSecret, setMarqetaApiSecret] = useState<string | null>(null);
    const [modernTreasuryApiKey, setModernTreasuryApiKey] = useState<string | null>(null);
    const [modernTreasuryOrgId, setModernTreasuryOrgId] = useState<string | null>(null);

    // --- Crypto State ---
    const [cryptoAssets, setCryptoAssets] = useState<any[]>([]);
    const [walletInfo, setWalletInfo] = useState<any>(null);
    const [virtualCard, setVirtualCard] = useState<any>(null);
    const [nftAssets, setNftAssets] = useState<any[]>([]);
    const [detectedProviders, setDetectedProviders] = useState<any[]>([]);

    // --- Security State ---
    const [securityMetrics, setSecurityMetrics] = useState<SecurityScoreMetric[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [threatAlerts, setThreatAlerts] = useState<ThreatAlert[]>([]);
    const [dataSharingPolicies, setDataSharingPolicies] = useState<DataSharingPolicy[]>([]);
    const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
    const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
    const [securityAwarenessModules, setSecurityAwarenessModules] = useState<SecurityAwarenessModule[]>([]);
    const [transactionRules, setTransactionRules] = useState<TransactionRule[]>([]);

    // --- Marqeta State ---
    const [marqetaCardProducts, setMarqetaCardProducts] = useState<MarqetaCardProduct[]>([]);
    const [isMarqetaLoading, setIsMarqetaLoading] = useState(false);

    // --- Database Configuration ---
    const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        databaseName: process.env.DB_NAME || 'sovereign_bank',
        sslMode: 'require',
        connectionStatus: 'disconnected'
    });

    // --- Web Driver Status ---
    const [webDriverStatus, setWebDriverStatus] = useState<WebDriverStatus>({
        status: 'idle',
        activeTask: null,
        logs: []
    });
    
    const [isImportingData, setIsImportingData] = useState(false);

    // --- AI-Powered Mock Data Generation ---
    useEffect(() => {
        const generateInitialData = async () => {
            const loadFallbackData = () => {
                console.warn("Using static fallback data for initialization.");
                setTransactions(MOCK_TRANSACTIONS);
                setAssets(MOCK_ASSETS);
                setBudgets(MOCK_BUDGETS);
                setCreditScore(MOCK_CREDIT_SCORE);
                setUpcomingBills(MOCK_UPCOMING_BILLS);
                setSavingsGoals(MOCK_SAVINGS_GOALS);
                setMarketMovers(MOCK_MARKET_MOVERS);
                setNotifications(MOCK_NOTIFICATIONS);
                setPaymentOrders(MOCK_PAYMENT_ORDERS);
                setInvoices(MOCK_INVOICES);
                setComplianceCases(MOCK_COMPLIANCE_CASES);
                setCorporateTransactions(MOCK_CORPORATE_TRANSACTIONS);
                setApiStatus(MOCK_API_STATUS);
                setSubscriptions(MOCK_SUBSCRIPTIONS);
                
                if (financialGoals.length === 0) {
                     setFinancialGoals([]);
                }
            };

            if (!geminiApiKey) {
                console.log("No Gemini API Key found. Loading fallback data.");
                loadFallbackData();
                initializeStaticData();
                setIsLoading(false);
                return;
            }

            try {
                const ai = new GoogleGenAI({ apiKey: geminiApiKey });
                
                const mockDataSchema = {
                    type: Type.OBJECT,
                    properties: {
                        transactions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING }, type: { type: Type.STRING }, category: { type: Type.STRING },
                                    description: { type: Type.STRING }, amount: { type: Type.NUMBER }, date: { type: Type.STRING },
                                    carbonFootprint: { type: Type.NUMBER },
                                }
                            }
                        },
                        assets: {
                            type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER }, color: { type: Type.STRING }, performanceYTD: { type: Type.NUMBER } } }
                        },
                        budgets: {
                            type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, limit: { type: Type.NUMBER }, spent: { type: Type.NUMBER }, color: { type: Type.STRING } } }
                        },
                        creditScore: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, change: { type: Type.INTEGER }, rating: { type: Type.STRING } } },
                        upcomingBills: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, amount: { type: Type.NUMBER }, dueDate: { type: Type.STRING } } } },
                        savingsGoals: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, target: { type: Type.NUMBER }, saved: { type: Type.NUMBER }, iconName: { type: Type.STRING } } } },
                        marketMovers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { ticker: { type: Type.STRING }, name: { type: Type.STRING }, price: { type: Type.NUMBER }, change: { type: Type.NUMBER } } } },
                        financialGoals: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING }, name: { type: Type.STRING }, targetAmount: { type: Type.NUMBER }, targetDate: { type: Type.STRING },
                                    currentAmount: { type: Type.NUMBER }, iconName: { type: Type.STRING }, startDate: { type: Type.STRING }, status: { type: Type.STRING }
                                }
                            }
                        },
                        notifications: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, message: { type: Type.STRING }, timestamp: { type: Type.STRING }, read: { type: Type.BOOLEAN }, view: { type: Type.STRING } } } },
                        apiStatus: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { provider: { type: Type.STRING }, status: { type: Type.STRING }, responseTime: { type: Type.NUMBER } } } },
                        paymentOrders: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, counterpartyName: { type: Type.STRING }, amount: { type: Type.NUMBER }, currency: { type: Type.STRING }, direction: { type: Type.STRING }, status: { type: Type.STRING }, date: { type: Type.STRING }, type: { type: Type.STRING } } } },
                        invoices: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, invoiceNumber: { type: Type.STRING }, counterpartyName: { type: Type.STRING }, dueDate: { type: Type.STRING }, amount: { type: Type.NUMBER }, status: { type: Type.STRING } } } },
                        complianceCases: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, reason: { type: Type.STRING }, entityType: { type: Type.STRING }, entityId: { type: Type.STRING }, status: { type: Type.STRING }, openedDate: { type: Type.STRING } } } },
                        corporateTransactions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, cardId: { type: Type.STRING }, holderName: { type: Type.STRING }, merchant: { type: Type.STRING }, amount: { type: Type.NUMBER }, status: { type: Type.STRING }, timestamp: { type: Type.STRING }, date: { type: Type.STRING } } } },
                        subscriptions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, amount: { type: Type.NUMBER }, nextPayment: { type: Type.STRING }, iconName: { type: Type.STRING } } } },
                    }
                };

                const prompt = `Generate a cohesive and realistic set of mock financial data for a visionary fintech user named "James B. O'Callaghan III". The data should populate a next-generation banking dashboard. It should reflect the activities of a high-net-worth, tech-savvy individual involved in personal finance, investments, and corporate treasury operations. The data must be internally consistent (e.g., transaction amounts relate to budget spending) and adhere strictly to the provided JSON schema. Generate a rich and interesting dataset including about 15 transactions over the last few months, 4 asset classes, 4 budget categories, a few financial goals, some corporate transactions, and other relevant data points to create a compelling demo.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: mockDataSchema
                    }
                });

                const data = JSON.parse(response.text);

                setTransactions(data.transactions || []);
                setAssets(data.assets || []);
                setBudgets(data.budgets || []);
                setCreditScore(data.creditScore || { score: 780, change: 5, rating: 'Excellent' });
                setUpcomingBills(data.upcomingBills || []);
                setSavingsGoals(data.savingsGoals || []);
                setFinancialGoals((data.financialGoals || []).map((g: any) => ({...g, plan: null, contributions: [], recurringContributions: [], linkedGoals: [], status: 'on_track' })));
                setMarketMovers(data.marketMovers || []);
                setNotifications(data.notifications || []);
                setPaymentOrders(data.paymentOrders || []);
                setInvoices(data.invoices || []);
                setComplianceCases(data.complianceCases || []);
                setCorporateTransactions(data.corporateTransactions || []);
                setApiStatus(data.apiStatus || []);
                setSubscriptions(data.subscriptions || []);
                
                initializeStaticData();

            } catch (e) {
                console.error("Failed to generate initial mock data via AI:", e);
                loadFallbackData();
                initializeStaticData();
            } finally {
                setIsLoading(false);
            }
        };
        
        const initializeStaticData = () => {
             setSecurityMetrics([{ metricName: 'OverallSecurityScore', currentValue: '0.85' }]);
             setAuditLogs([{ id: 'log-1', timestamp: new Date().toISOString(), userId: 'user-1', action: 'LOGIN', targetResource: 'System', success: true }]);
             setThreatAlerts([]);
             setDataSharingPolicies([{ policyId: 'pol-1', policyName: 'Default Privacy', scope: 'Global', isActive: true, lastReviewed: new Date().toISOString() }]);
             setApiKeys([{ id: 'key-1', keyName: 'Default Key', creationDate: new Date().toISOString(), scopes: ['read'] }]);
             setTrustedContacts([]);
             setSecurityAwarenessModules([]);
             setTransactionRules([]);

             setCryptoAssets([{ ticker: 'BTC', name: 'Bitcoin', value: 45000, amount: 1.5, color: '#F7931A' }]);
             setNftAssets([]);
             setWalletInfo({ balance: 1.5, address: '0x123...abc' });
        }

        generateInitialData();
    }, [geminiApiKey]);


    // --- Database Logic ---
    const updateDbConfig = useCallback((config: Partial<DatabaseConfig>) => {
        setDbConfig(prev => ({ ...prev, ...config }));
    }, []);

    const connectDatabase = useCallback(async () => {
        setDbConfig(prev => ({ ...prev, connectionStatus: 'connecting' }));
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const isSuccess = Math.random() > 0.1; 
            if (isSuccess) {
                setDbConfig(prev => ({ ...prev, connectionStatus: 'connected' }));
            } else {
                throw new Error("Connection timeout");
            }
        } catch (e) {
            setDbConfig(prev => ({ ...prev, connectionStatus: 'error' }));
        }
    }, []);

    // --- Web Driver Logic ---
    const launchWebDriver = useCallback(async (taskName: string) => {
        setWebDriverStatus({ status: 'running', activeTask: taskName, logs: [`Initializing WebDriver for task: ${taskName}...`] });
        const steps = ["Launching browser...", "Navigating...", "Injecting tokens...", "Scraping data...", "Standardizing format...", "Closing session."];
        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 1200));
            setWebDriverStatus(prev => ({ ...prev, logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${step}`] }));
        }
        setWebDriverStatus(prev => ({ ...prev, status: 'completed', logs: [...prev.logs, "Task completed successfully."] }));
        setTimeout(() => setWebDriverStatus(prev => ({ ...prev, status: 'idle', activeTask: null })), 5000);
    }, []);

    // --- Actions ---
    const addTransaction = (transaction: Transaction) => setTransactions(prev => [transaction, ...prev]);
    const updateBudget = (id: string, spent: number) => setBudgets(prev => prev.map(b => b.id === id ? { ...b, spent } : b));
    const addBudget = (name: string, limit: number) => setBudgets(prev => [...prev, { id: uuidv4(), name, limit, spent: 0, color: '#3b82f6' }]);
    const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const handlePlaidSuccess = (publicToken: string, metadata: any) => {
        setIsImportingData(true);
        setTimeout(() => {
            setLinkedAccounts(prev => [...prev, { id: metadata.institution.institution_id, name: metadata.institution.name, mask: '****', type: 'linked' }]);
            setIsImportingData(false);
            setTransactions(prev => [...prev, { id: `new-${Date.now()}`, type: 'expense', category: 'Transfer', description: `Import from ${metadata.institution.name}`, amount: 0, date: new Date().toISOString().split('T')[0] }]);
        }, 3000);
    };

    const setGeminiApiKey = (key: string) => setGeminiApiKeyState(key);
    const setMarqetaCredentials = (token: string, secret: string) => { setMarqetaApiToken(token); setMarqetaApiSecret(secret); };

    const askSovereignAI = async (prompt: string): Promise<string> => {
        if (!geminiApiKey) return "AI Offline. Please configure API Key.";
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            return response.text;
        } catch (e) {
            console.error("AI Processing Error:", e);
            return "AI Processing Error.";
        }
    };
    
    const addFinancialGoal = (goalData: Omit<FinancialGoal, 'id' | 'currentAmount' | 'plan' | 'contributions' | 'recurringContributions' | 'linkedGoals' | 'status'>) => {
        const newGoal: FinancialGoal = { ...goalData, id: uuidv4(), currentAmount: 0, plan: null, contributions: [], recurringContributions: [], linkedGoals: [], status: 'on_track' };
        setFinancialGoals(prev => [...prev, newGoal]);
    };

    const updateFinancialGoal = (goalId: string, updates: Partial<FinancialGoal>) => setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...updates } : g));

    const generateGoalPlan = async (goalId: string) => {
        const goal = financialGoals.find(g => g.id === goalId);
        if (!goal || !geminiApiKey) return;
        const prompt = `Based on the financial goal "${goal.name}" to save $${goal.targetAmount} by ${goal.targetDate}, create a concise, actionable plan. Current amount is $${goal.currentAmount}. Provide a JSON response with: "summary" (string), "monthlyContribution" (number), and "actionableSteps" (array of 3 strings).`;
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json" } });
            const planData = JSON.parse(response.text);
            const newPlan: AIGoalPlan = {
                summary: planData.summary, monthlyContribution: planData.monthlyContribution, actionableSteps: planData.actionableSteps,
                feasibilitySummary: '', steps: planData.actionableSteps.map((step: string) => ({ title: step.split(' ')[0], description: step, category: 'General' }))
            };
            updateFinancialGoal(goalId, { plan: newPlan });
        } catch (error) {
            console.error("Error generating goal plan:", error);
            updateFinancialGoal(goalId, { plan: { summary: "Error generating plan.", monthlyContribution: 0, actionableSteps: [], feasibilitySummary: '', steps: [] } });
        }
    };
    
    const addContributionToGoal = (goalId: string, amount: number) => {
        const newContribution: Contribution = { id: uuidv4(), amount, date: new Date().toISOString().split('T')[0], type: 'manual' };
        setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount, contributions: [newContribution, ...g.contributions] } : g));
    };

    const addRecurringContributionToGoal = (goalId: string, contribution: Omit<RecurringContribution, 'id'>) => {
        const newRecurring: RecurringContribution = { ...contribution, id: uuidv4() };
        setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, recurringContributions: [...(g.recurringContributions || []), newRecurring] } : g));
    };
    
    const updateRecurringContributionInGoal = (goalId: string, contributionId: string, updates: Partial<RecurringContribution>) => {
        setFinancialGoals(prev => prev.map(g => g.id !== goalId ? g : { ...g, recurringContributions: (g.recurringContributions || []).map(rc => rc.id === contributionId ? { ...rc, ...updates } : rc) }));
    };
    
    const deleteRecurringContributionFromGoal = (goalId: string, contributionId: string) => {
         setFinancialGoals(prev => prev.map(g => g.id !== goalId ? g : { ...g, recurringContributions: (g.recurringContributions || []).filter(rc => rc.id !== contributionId) }));
    };
    
    const linkGoals = (sourceGoalId: string, targetGoalId: string, relationshipType: LinkedGoal['relationshipType'], triggerAmount?: number) => {
        const newLink: LinkedGoal = { id: targetGoalId, relationshipType, triggerAmount };
        setFinancialGoals(prev => prev.map(g => g.id === sourceGoalId ? { ...g, linkedGoals: [...(g.linkedGoals || []), newLink] } : g));
    };
    
    const unlinkGoals = (sourceGoalId: string, targetGoalId: string) => {
        setFinancialGoals(prev => prev.map(g => g.id === sourceGoalId ? { ...g, linkedGoals: (g.linkedGoals || []).filter(l => l.id !== targetGoalId) } : g));
    };

    const broadcastEvent = (eventType: string, payload: any) => console.log(`[EventBus] ${eventType}:`, payload);

    // --- Crypto Mock Actions ---
    const connectWallet = (provider: any) => { console.log("Connected wallet", provider); setWalletInfo({ address: '0x123...', balance: 10 }); };
    const disconnectWallet = () => { setWalletInfo(null); };
    const issueCard = () => { setVirtualCard({ cardNumber: '4242 4242 4242 4242', holderName: 'J. Doe', expiry: '12/25' }); };
    const buyCrypto = (amount: number, currency: string) => { console.log(`Bought ${amount} ${currency}`); };

    // --- Security Mock Actions ---
    const showSystemAlert = (message: string, type: string) => console.log(`ALERT [${type}]: ${message}`);
    const unlinkAccount = (id: string) => setLinkedAccounts(prev => prev.filter(a => a.id !== id));
    
    // --- Marqeta Mock Actions ---
    const fetchMarqetaProducts = () => {
        setIsMarqetaLoading(true);
        setTimeout(() => {
            setMarqetaCardProducts([
                { token: 'mq_1', name: 'Standard Debit', active: true, start_date: '2023-01-01', config: { fulfillment: { bin_prefix: '123456', fulfillment_provider: 'arrow', payment_instrument: 'physical' }, poi: { other: { allow: true } }, jit_funding: { program_funding_source: { enabled: true } } } },
                { token: 'mq_2', name: 'Virtual Rewards', active: true, start_date: '2023-05-01', config: { fulfillment: { bin_prefix: '654321', fulfillment_provider: 'virtual', payment_instrument: 'virtual' }, poi: { other: { allow: false } }, jit_funding: { program_funding_source: { enabled: true } } } },
            ]);
            setIsMarqetaLoading(false);
        }, 1000);
    };


    const contextValue: DataContextType = {
        isLoading,
        error,
        activeView,
        setActiveView,
        transactions,
        assets,
        budgets,
        creditScore,
        upcomingBills,
        savingsGoals,
        financialGoals,
        marketMovers,
        linkedAccounts,
        notifications,
        subscriptions,
        paymentOrders,
        invoices,
        complianceCases,
        corporateTransactions,
        plaidApiKey,
        plaidClientId,
        stripeApiKey,
        geminiApiKey,
        marqetaApiToken,
        marqetaApiSecret,
        modernTreasuryApiKey,
        modernTreasuryOrganizationId: modernTreasuryOrgId,
        dbConfig,
        updateDbConfig,
        connectDatabase,
        webDriverStatus,
        launchWebDriver,
        addTransaction,
        updateBudget,
        addBudget,
        markNotificationRead,
        setGeminiApiKey,
        setModernTreasuryApiKey,
        setModernTreasuryOrganizationId: setModernTreasuryOrgId,
        setMarqetaCredentials,
        addFinancialGoal,
        generateGoalPlan,
        addContributionToGoal,
        addRecurringContributionToGoal,
        updateRecurringContributionInGoal,
        deleteRecurringContributionFromGoal,
        updateFinancialGoal,
        linkGoals,
        unlinkGoals,
        impactData: { treesPlanted: 124, progressToNextTree: 65 },
        gamification: { score: 1250, level: 5, levelName: "Financial Architect", progress: 45, credits: 500 },
        rewardPoints: { balance: 45200, lastEarned: 150, lastRedeemed: 0, currency: "PTS" },
        creditFactors: [{ name: "Payment History", status: 'Good', description: "On time" }, { name: "Utilization", status: 'Excellent', description: "Low usage" }],
        apiStatus,
        handlePlaidSuccess,
        isImportingData,
        userProfile: { name: "James B. O'Callaghan III", email: "visionary@idgaf.ai" },
        askSovereignAI,
        broadcastEvent,
        
        // Crypto
        cryptoAssets,
        walletInfo,
        virtualCard,
        nftAssets,
        connectWallet,
        disconnectWallet,
        detectedProviders,
        issueCard,
        buyCrypto,

        // Security
        showSystemAlert,
        unlinkAccount,
        securityMetrics,
        auditLogs,
        threatAlerts,
        dataSharingPolicies,
        apiKeys,
        trustedContacts,
        securityAwarenessModules,
        transactionRules,

        // Marqeta
        marqetaCardProducts,
        fetchMarqetaProducts,
        isMarqetaLoading
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/context/DataContext.tsx
================================================================================

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Transaction, PortfolioAsset, UserProfile, 
  AppView, View, Notification, InternalAccount,
  AIInsight, BudgetCategory, RewardItem, APIStatus,
  Pipeline, InboundBlob, FundFlow, AuthorizedApp,
  CreditScore, CreditFactor, FinancialGoal, RewardPoints,
  PaymentOrder, Invoice, ComplianceCase, CorporateTransaction,
  EIP6963ProviderDetail, MarqetaCardProduct, SecurityScoreMetric,
  AuditLogEntry, ThreatAlert, DataSharingPolicy, APIKey,
  TrustedContact, SecurityAwarenessModule, TransactionRule
} from '../types';
import { 
  MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_BUDGETS, 
  MOCK_REWARD_ITEMS, MOCK_API_STATUS, MOCK_NOTIFICATIONS,
  MOCK_CREDIT_SCORE, MOCK_CREDIT_FACTORS, MOCK_FINANCIAL_GOALS,
  MOCK_REWARD_POINTS,
  MOCK_SECURITY_METRICS, MOCK_AUDIT_LOGS, MOCK_THREAT_ALERTS,
  MOCK_DATA_SHARING_POLICIES, MOCK_API_KEYS, MOCK_TRUSTED_CONTACTS,
  MOCK_SECURITY_AWARENESS, MOCK_TRANSACTION_RULES
} from '../data/mockData';

export interface ApiEndpoints {
    quantumFinancial: string;
    plaid: string;
    stripe: string;
    modernTreasury: string;
    gemini: string;
    gein: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
}

interface IDataContext {
  view: AppView; activeView: View; setView: (view: AppView) => void;
  setActiveView: (view: View) => void; userProfile: UserProfile; user: UserProfile; 
  creator: { name: string; title: string }; transactions: Transaction[]; assets: PortfolioAsset[];
  internalAccounts: InternalAccount[]; notifications: Notification[]; aiInsights: AIInsight[];
  insights: AIInsight[]; budgets: BudgetCategory[]; rewardItems: RewardItem[]; apiStatus: APIStatus[];
  pipelines: Pipeline[]; inboundBlobs: InboundBlob[]; fundFlows: FundFlow[]; authorizedApps: AuthorizedApp[];
  geminiApiKey: string | null; setGeminiApiKey: (key: string) => void;
  modernTreasuryApiKey: string | null; setModernTreasuryApiKey: (key: string) => void;
  modernTreasuryOrganizationId: string | null; setModernTreasuryOrganizationId: (id: string) => void;
  setTransactions: (txs: Transaction[]) => void; updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void; setAssets: (assets: PortfolioAsset[]) => void;
  setInternalAccounts: (accounts: InternalAccount[]) => void;
  showNotification: (message: string, severity: Notification['severity']) => void;
  markNotificationRead: (id: string) => void; authorizeApp: (app: Partial<AuthorizedApp>) => void;
  revokeApp: (id: string) => void; redeemReward: (item: RewardItem) => boolean;
  askSovereignAI: (prompt: string, modelName?: string) => Promise<string>;
  simulationData: { time: string; value: number }[]; isImportingData: boolean; treesPlanted: number;
  spendingForNextTree: number; linkedAccounts: any[]; unlinkAccount: (id: string) => void;
  paymentOrders: PaymentOrder[]; invoices: Invoice[]; complianceCases: ComplianceCase[];
  corporateTransactions: CorporateTransaction[]; creditScore: CreditScore; creditFactors: CreditFactor[];
  financialGoals: FinancialGoal[]; addFinancialGoal: (goal: Partial<FinancialGoal>) => void;
  generateGoalPlan: (id: string) => Promise<void>; addContributionToGoal: (id: string, amount: number) => void;
  addRecurringContributionToGoal: (id: string, contrib: any) => void;
  updateRecurringContributionInGoal: (gid: string, cid: string, updates: any) => void;
  deleteRecurringContributionFromGoal: (gid: string, cid: string) => void;
  updateFinancialGoal: (id: string, updates: any) => void; linkGoals: (s: string, t: string, type: any, amt?: number) => void;
  unlinkGoals: (s: string, t: string) => void; isWalletConnectModalOpen: boolean;
  setWalletConnectModalOpen: (open: boolean) => void; detectedProviders: EIP6963ProviderDetail[];
  connectWallet: (provider: EIP6963ProviderDetail) => void; rewardPoints: RewardPoints;
  apiEndpoints: ApiEndpoints; updateEndpoint: (key: keyof ApiEndpoints, value: string) => void;
  sovereignCredits: number; deductCredits: (amount: number) => boolean; isProductionApproved: boolean;
  plaidProducts: string[]; addTransaction: (tx: Transaction) => void;
  isLoading: boolean; error: string | null; broadcastEvent: (type: string, data: any) => void;
  githubRepoFiles: GitHubFile[]; fetchRepo: () => Promise<void>; fetchDirectory: (path: string) => Promise<void>; isRepoLoading: boolean;
  addBudget: (name: string, limit: number) => void; stripeApiKey: string | null;
  marqetaCardProducts: MarqetaCardProduct[]; fetchMarqetaProducts: () => Promise<void>;
  isMarqetaLoading: boolean; marqetaApiToken: string | null; marqetaApiSecret: string | null;
  setMarqetaCredentials: (token: string, secret: string) => void; plaidApiKey: string | null;
  dbConfig: any; updateDbConfig: (updates: any) => void; connectDatabase: () => Promise<void>;
  webDriverStatus: any; launchWebDriver: (task: string) => Promise<void>;
  showSystemAlert: (message: string, severity: Notification['severity']) => void;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  securityMetrics: SecurityScoreMetric[]; auditLogs: AuditLogEntry[];
  threatAlerts: ThreatAlert[]; dataSharingPolicies: DataSharingPolicy[];
  apiKeys: APIKey[]; trustedContacts: TrustedContact[];
  securityAwarenessModules: SecurityAwarenessModule[]; transactionRules: TransactionRule[];
  initiateWireTransfer: (details: any) => Promise<void>;
  initiateACHTransfer: (details: any) => Promise<void>;
  logAuditAction: (action: string, details: any) => void;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

const STORAGE_KEY = 'QUANTUM_FINANCIAL_STATE_V1';
const GITHUB_STORAGE_KEY = 'QUANTUM_GITHUB_REPO_V1';
const GITHUB_OWNER = 'jocall3';
const GITHUB_REPO = 'jocall3';

const MOCK_INBOUND_BLOBS: InboundBlob[] = [
    { id: 'b-1', filePath: 's3://nexus/ingest/quantum_q4_raw.csv', status: 'IMPORTED', vendorName: 'Quantum Financial', interfaceType: 'SFTP', createdAt: '2024-11-15T09:00:00Z' }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>(View.Dashboard);
  const [transactions, setTransactionsState] = useState<Transaction[]>(MOCK_TRANSACTIONS as any);
  const [assets, setAssetsState] = useState<PortfolioAsset[]>(MOCK_ASSETS as any);
  const [internalAccounts, setInternalAccountsState] = useState<InternalAccount[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS as any);
  const [simulationData, setSimulationData] = useState<{ time: string; value: number }[]>([]);
  const [isImportingData, setIsImportingData] = useState(false);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(MOCK_FINANCIAL_GOALS as any);
  const [isWalletConnectModalOpen, setWalletConnectModalOpen] = useState(false);
  const [detectedProviders, setDetectedProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([
    { id: 'acc_01', name: 'Quantum Elite Checking', mask: '9981', balance: 8500000, institutionId: 'quantum_intl' },
    { id: 'acc_02', name: 'Global Treasury Savings', mask: '1102', balance: 25000000, institutionId: 'quantum_intl' }
  ]);
  const [authorizedApps, setAuthorizedApps] = useState<AuthorizedApp[]>([
    { id: 'app-1', name: 'Quantum Nexus ERP', description: 'Enterprise Resource Planning', status: 'active', authorizedAt: '2024-10-01T08:00:00Z' }
  ]);
  
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key'));
  const [modernTreasuryApiKey, setModernTreasuryApiKey] = useState<string | null>(localStorage.getItem('mt_api_key'));
  const [modernTreasuryOrganizationId, setModernTreasuryOrganizationId] = useState<string | null>(localStorage.getItem('mt_org_id'));

  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoints>({
      quantumFinancial: 'https://api.quantumfinancial.io/v1',
      plaid: 'https://production.plaid.com',
      stripe: 'https://api.stripe.com/v1',
      modernTreasury: 'https://app.moderntreasury.com/api',
      gemini: 'https://generativelanguage.googleapis.com',
      gein: 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io'
  });

  const [sovereignCredits, setSovereignCredits] = useState(500000);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(MOCK_BUDGETS as any);
  const [marqetaCardProducts, setMarqetaCardProducts] = useState<MarqetaCardProduct[]>([]);
  const [isMarqetaLoading, setIsMarqetaLoading] = useState(false);
  const [marqetaApiToken, setMarqetaApiToken] = useState<string | null>(localStorage.getItem('marqeta_token'));
  const [marqetaApiSecret, setMarqetaApiSecret] = useState<string | null>(localStorage.getItem('marqeta_secret'));
  
  const [dbConfig, setDbConfig] = useState({
      host: 'quantum-db-cluster.aws.internal',
      port: '5432',
      username: 'quantum_admin',
      password: '',
      databaseName: 'quantum_ledger_prod',
      connectionStatus: 'disconnected' as 'connected' | 'disconnected' | 'connecting',
      sslMode: 'require'
  });

  const updateDbConfig = useCallback((updates: any) => {
    setDbConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const [webDriverStatus, setWebDriverStatus] = useState({
      status: 'idle' as 'idle' | 'running' | 'error',
      logs: [] as string[]
  });

  const [githubRepoFiles, setGithubRepoFiles] = useState<GitHubFile[]>([]);
  const [isRepoLoading, setIsRepoLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS as any);

  const logAuditAction = useCallback((action: string, details: any) => {
    const entry: AuditLogEntry = {
      id: `AUDIT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details: JSON.stringify(details),
      user: 'James Burvel oCallaghan III',
      ipAddress: '10.0.0.42',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [entry, ...prev]);
    console.log(`[QUANTUM_AUDIT] ${action}`, details);
  }, []);

  const showNotification = useCallback((message: string, severity: Notification['severity']) => {
    setNotifications(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: 'Just Now',
      read: false,
      severity: severity || 'info'
    }, ...prev].slice(0, 20));
  }, []);

  const initiateWireTransfer = useCallback(async (details: any) => {
    logAuditAction('WIRE_TRANSFER_INITIATED', details);
    showNotification('MFA Challenge Issued: Please verify on your Quantum Secure Key.', 'info');
    await new Promise(r => setTimeout(r, 2000));
    showNotification('Fraud Monitoring: Transaction cleared heuristic analysis.', 'success');
    showNotification(`Wire Transfer of ${details.amount} to ${details.recipient} successful.`, 'success');
    logAuditAction('WIRE_TRANSFER_COMPLETED', { ...details, status: 'SETTLED' });
  }, [logAuditAction, showNotification]);

  const initiateACHTransfer = useCallback(async (details: any) => {
    logAuditAction('ACH_TRANSFER_INITIATED', details);
    showNotification('Processing ACH Batch...', 'info');
    await new Promise(r => setTimeout(r, 1500));
    showNotification(`ACH Transfer to ${details.recipient} queued for next window.`, 'success');
    logAuditAction('ACH_TRANSFER_QUEUED', details);
  }, [logAuditAction, showNotification]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.transactions) setTransactionsState(parsed.transactions);
        if (parsed.assets) setAssetsState(parsed.assets);
        if (parsed.internalAccounts) setInternalAccountsState(parsed.internalAccounts);
        if (parsed.financialGoals) setFinancialGoals(parsed.financialGoals);
        if (parsed.linkedAccounts) setLinkedAccounts(parsed.linkedAccounts);
      } catch (e) { console.error("State hydration failed", e); }
    }
    
    const savedGithub = localStorage.getItem(GITHUB_STORAGE_KEY);
    if (savedGithub) {
        try { setGithubRepoFiles(JSON.parse(savedGithub)); } catch (e) { console.error('Failed to parse cached GitHub repo', e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      transactions, assets, internalAccounts, financialGoals, linkedAccounts
    }));
  }, [transactions, assets, internalAccounts, financialGoals, linkedAccounts]);

  useEffect(() => {
    const interval = setInterval(() => {
      const totalWealth = assets.reduce((sum, a) => sum + a.value, 0) + 24500000;
      setSimulationData(prev => {
        const newData = [...prev, { 
          time: new Date().toLocaleTimeString(), 
          value: totalWealth + (Math.random() - 0.5) * 50000 
        }].slice(-30);
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [assets]);

  const askSovereignAI = useCallback(async (prompt: string, modelName = 'gemini-1.5-pro') => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const model = ai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, topP: 0.95 }
        });
        return result.response.text();
    } catch (e) {
        return "Quantum AI Core synchronization interrupted. Re-establishing secure link...";
    }
  }, []);

  const broadcastEvent = useCallback((type: string, data: any) => {
      logAuditAction(`SYSTEM_EVENT_${type}`, data);
      showNotification(`System Event: ${type.replace(/_/g, ' ')}`, 'info');
  }, [showNotification, logAuditAction]);

  const fetchDirectoryContents = useCallback(async (path: string): Promise<GitHubFile[]> => {
    setIsRepoLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
      let data: GitHubFile[] = await res.json();
      return data.map(item => ({ ...item, path: item.path || `${path}/${item.name}`.replace(/\/\//g, '/') }));
    } catch (e) {
      showNotification(`Repo Error: Could not load ${path}`, 'error');
      return [];
    } finally { setIsRepoLoading(false); }
  }, [showNotification]);

  const fetchRepo = useCallback(async () => {
    setIsRepoLoading(true);
    const rootFiles = await fetchDirectoryContents(''); 
    setGithubRepoFiles(rootFiles);
    setIsRepoLoading(false);
    showNotification('Quantum Repository structure synchronized.', 'success');
    localStorage.setItem(GITHUB_STORAGE_KEY, JSON.stringify(rootFiles));
  }, [fetchDirectoryContents, showNotification]);

  const connectDatabase = useCallback(async () => {
      updateDbConfig({ connectionStatus: 'connecting' });
      await new Promise(r => setTimeout(r, 1500));
      updateDbConfig({ connectionStatus: 'connected' });
      logAuditAction('DATABASE_CONNECTED', { host: dbConfig.host });
      showNotification("Quantum Database nexus synchronized.", "success");
  }, [updateDbConfig, showNotification, logAuditAction, dbConfig.host]);

  const value: IDataContext = useMemo(() => ({
    view, activeView: view as View, setView, setActiveView: setView as (view: View) => void,
    userProfile: { id: 'USR-77-X-ALPHA', name: 'James Burvel oCallaghan III', title: 'Sovereign Architect', email: 'james@quantum.io', phone: '+1 (555) 942-0123', loyaltyTier: 'OMEGA', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', usdBalance: 2450000000, fiatBalance: 2450000000, cryptoBalance: 14200.55 },
    user: { id: 'USR-77-X-ALPHA', name: 'James Burvel oCallaghan III', title: 'Sovereign Architect', email: 'james@quantum.io', phone: '+1 (555) 942-0123', loyaltyTier: 'OMEGA', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', usdBalance: 2450000000, fiatBalance: 2450000000, cryptoBalance: 14200.55 },
    creator: { name: 'James Burvel oCallaghan III', title: 'Grand Architect of Quantum AI' },
    transactions, assets, internalAccounts, notifications, aiInsights: [], insights: [],
    budgets, rewardItems: MOCK_REWARD_ITEMS as any, apiStatus: MOCK_API_STATUS as any,
    pipelines: [
      { id: 'p-1', name: 'Quantum Ledger Sync', pipelineName: 'NEXUS_TX_FEED', status: 'SUCCESS', prettyDuration: '1.2s' },
      { id: 'p-2', name: 'Risk Vector Audit', pipelineName: 'HEURISTIC_RISK', status: 'RUNNING', prettyDuration: '240ms' }
    ],
    inboundBlobs: MOCK_INBOUND_BLOBS, 
    fundFlows: [{ id: 'f-1', name: 'Reserve Accumulation', ledgerId: 'L-771', postedTxCount: 1242, pendingTxCount: 12 }],
    authorizedApps, simulationData, geminiApiKey,
    setGeminiApiKey: (key) => { setGeminiApiKey(key); localStorage.setItem('gemini_api_key', key); },
    modernTreasuryApiKey,
    setModernTreasuryApiKey: (key) => { setModernTreasuryApiKey(key); localStorage.setItem('mt_api_key', key); },
    modernTreasuryOrganizationId,
    setModernTreasuryOrganizationId: (id) => { setModernTreasuryOrganizationId(id); localStorage.setItem('mt_org_id', id); },
    setTransactions: setTransactionsState,
    updateTransaction: (id, updates) => setTransactionsState(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)),
    deleteTransaction: (id) => setTransactionsState(prev => prev.filter(t => t.id !== id)),
    addTransaction: (tx) => setTransactionsState(prev => [tx, ...prev]),
    setAssets: setAssetsState,
    setInternalAccounts: setInternalAccountsState,
    showNotification,
    markNotificationRead: (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)),
    authorizeApp: (app) => setAuthorizedApps(prev => [...prev, { id: app.id || `app-${Date.now()}`, name: app.name || 'Unknown', description: app.description || '', status: 'active', authorizedAt: new Date().toISOString(), scopes: app.scopes }]),
    revokeApp: (id) => setAuthorizedApps(prev => prev.map(a => a.id === id ? { ...a, status: 'revoked' } : a)),
    redeemReward: (item) => { showNotification(`Redeemed ${item.name}`, 'success'); return true; },
    rewardPoints: MOCK_REWARD_POINTS,
    askSovereignAI,
    isImportingData,
    treesPlanted: 142,
    spendingForNextTree: 120,
    linkedAccounts,
    unlinkAccount: (id) => { setLinkedAccounts(prev => prev.filter(a => a.id !== id)); showNotification("Institutional link severed.", "warning"); },
    paymentOrders: [], invoices: [], complianceCases: [], corporateTransactions: [],
    creditScore: MOCK_CREDIT_SCORE,
    creditFactors: MOCK_CREDIT_FACTORS,
    financialGoals,
    addFinancialGoal: (goal) => setFinancialGoals(prev => [...prev, { id: `goal-${Date.now()}`, name: goal.name || 'New Goal', targetAmount: goal.targetAmount || 0, currentAmount: 0, targetDate: goal.targetDate || new Date().toISOString(), iconName: goal.iconName || 'default', plan: null, startDate: new Date().toISOString(), contributions: [], status: 'on_track' }]),
    generateGoalPlan: async (id) => { showNotification("Neural strategist is mapping your trajectory...", "info"); await new Promise(r => setTimeout(r, 2000)); showNotification("Strategic roadmap synthesized.", "success"); },
    addContributionToGoal: (id, amount) => setFinancialGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g)),
    addRecurringContributionToGoal: () => {},
    updateRecurringContributionInGoal: () => {},
    deleteRecurringContributionFromGoal: () => {},
    updateFinancialGoal: (id, updates) => setFinancialGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g)),
    linkGoals: () => {},
    unlinkGoals: () => {},
    isWalletConnectModalOpen,
    setWalletConnectModalOpen,
    detectedProviders,
    connectWallet: (provider) => showNotification(`Synchronized with ${provider.info.name}`, "success"),
    apiEndpoints,
    updateEndpoint: (key, value) => setApiEndpoints(prev => ({ ...prev, [key]: value })),
    sovereignCredits,
    deductCredits: (amount) => { if (sovereignCredits >= amount) { setSovereignCredits(prev => prev - amount); return true; } return false; },
    isProductionApproved: true,
    plaidProducts: ['auth', 'transactions', 'identity', 'balance'],
    isLoading: false,
    error: null,
    broadcastEvent,
    addBudget: (name, limit) => setBudgets(prev => [...prev, { id: `b-${Date.now()}`, name, limit, spent: 0, color: '#06b6d4', remaining: limit, category: name, alerts: [] }]),
    stripeApiKey: process.env.STRIPE_SECRET_KEY || null,
    marqetaCardProducts,
    fetchMarqetaProducts: async () => { setIsMarqetaLoading(true); await new Promise(r => setTimeout(r, 1000)); setMarqetaCardProducts([{ token: 'cp-1', name: 'Quantum Black', active: true, start_date: '2024-01-01', config: { fulfillment: { bin_prefix: '424242' }, poi: { other: {} } } } as any]); setIsMarqetaLoading(false); },
    isMarqetaLoading,
    marqetaApiToken,
    marqetaApiSecret,
    setMarqetaCredentials: (token, secret) => { setMarqetaApiToken(token); setMarqetaApiSecret(secret); localStorage.setItem('marqeta_token', token); localStorage.setItem('marqeta_secret', secret); },
    plaidApiKey: process.env.PLAID_SECRET || null,
    dbConfig,
    updateDbConfig,
    connectDatabase,
    webDriverStatus,
    launchWebDriver: async (task) => { setWebDriverStatus(prev => ({ ...prev, status: 'running', logs: [...prev.logs, `Starting task: ${task}`] })); await new Promise(r => setTimeout(r, 2000)); setWebDriverStatus(prev => ({ ...prev, status: 'idle', logs: [...prev.logs, `Task completed: ${task}`] })); },
    showSystemAlert: (msg, sev) => showNotification(msg, sev),
    handlePlaidSuccess: (token, meta) => showNotification(`Account linked: ${meta.institution.name}`, "success"),
    securityMetrics: MOCK_SECURITY_METRICS,
    auditLogs,
    threatAlerts: MOCK_THREAT_ALERTS,
    dataSharingPolicies: MOCK_DATA_SHARING_POLICIES,
    apiKeys: MOCK_API_KEYS,
    trustedContacts: MOCK_TRUSTED_CONTACTS,
    securityAwarenessModules: MOCK_SECURITY_AWARENESS,
    transactionRules: MOCK_TRANSACTION_RULES,
    githubRepoFiles,
    fetchRepo,
    fetchDirectory: async () => {},
    isRepoLoading,
    initiateWireTransfer,
    initiateACHTransfer,
    logAuditAction,
  }), [
    view, transactions, assets, internalAccounts, notifications, simulationData, isImportingData, financialGoals, isWalletConnectModalOpen, detectedProviders, linkedAccounts, authorizedApps, 
    geminiApiKey, modernTreasuryApiKey, modernTreasuryOrganizationId, budgets, sovereignCredits, 
    marqetaCardProducts, isMarqetaLoading, marqetaApiToken, marqetaApiSecret, 
    dbConfig, webDriverStatus, githubRepoFiles, isRepoLoading, auditLogs,
    showNotification, askSovereignAI, broadcastEvent, connectDatabase, initiateWireTransfer, initiateACHTransfer, logAuditAction, fetchRepo, updateDbConfig
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};