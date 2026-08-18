// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/dashboard/widgets/FinancialOverviewWidget.tsx
================================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Briefcase, 
  AlertCircle, 
  Activity,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

// --- Types & Interfaces ---

interface FinancialDataPoint {
  date: string;
  netWorth: number;
  assets: number;
  liabilities: number;
}

interface AccountGroup {
  id: string;
  name: string;
  type: 'asset' | 'liability';
  balance: number;
  changePercent: number; // Month over month
}

interface SpendingCategory {
  category: string;
  amount: number;
  budget: number;
  color: string;
}

interface FinancialOverviewProps {
  userId?: string;
  onNavigateToFullView?: () => void;
}

// --- Mock Data Generators (Simulating Backend/AI Service) ---

const generateHistoricalData = (months: number): FinancialDataPoint[] => {
  const data: FinancialDataPoint[] = [];
  let currentNetWorth = 125000;
  let currentAssets = 150000;
  let currentLiabilities = 25000;

  for (let i = months; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    // Simulate fluctuation
    const volatility = (Math.random() - 0.4) * 2000;
    currentAssets += (volatility + 1500); // General upward trend
    currentLiabilities -= (Math.random() * 500); // Paying off debt slowly
    
    data.push({
      date: dateStr,
      netWorth: currentAssets - currentLiabilities,
      assets: currentAssets,
      liabilities: currentLiabilities,
    });
  }
  return data;
};

const mockAccounts: AccountGroup[] = [
  { id: '1', name: 'Total Cash & Checking', type: 'asset', balance: 24500.45, changePercent: 2.5 },
  { id: '2', name: 'Investment Portfolio', type: 'asset', balance: 145230.10, changePercent: 5.8 },
  { id: '3', name: 'Credit Cards', type: 'liability', balance: 3420.50, changePercent: -1.2 },
  { id: '4', name: 'Mortgage / Loans', type: 'liability', balance: 210000.00, changePercent: -0.5 },
];

const mockSpending: SpendingCategory[] = [
  { category: 'Housing', amount: 2400, budget: 2500, color: '#6366f1' },
  { category: 'Food & Dining', amount: 850, budget: 600, color: '#ec4899' },
  { category: 'Transportation', amount: 420, budget: 500, color: '#10b981' },
  { category: 'Entertainment', amount: 300, budget: 400, color: '#f59e0b' },
];

// --- Helper Functions ---

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const calculateTotalNetWorth = (accounts: AccountGroup[]) => {
  return accounts.reduce((acc, item) => {
    return item.type === 'asset' ? acc + item.balance : acc - item.balance;
  }, 0);
};

// --- Components ---

export const FinancialOverviewWidget: React.FC<FinancialOverviewProps> = ({ 
  userId = 'default_user', 
  onNavigateToFullView 
}) => {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FinancialDataPoint[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("");

  // Simulate data fetching and AI analysis
  useEffect(() => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      let months = 6;
      switch (timeRange) {
        case '1M': months = 1; break;
        case '3M': months = 3; break;
        case '6M': months = 6; break;
        case '1Y': months = 12; break;
        case 'ALL': months = 24; break;
      }
      const fetchedData = generateHistoricalData(months);
      setData(fetchedData);
      
      // Simulate AI Insight Generation based on data
      const lastPoint = fetchedData[fetchedData.length - 1];
      const firstPoint = fetchedData[0];
      const growth = ((lastPoint.netWorth - firstPoint.netWorth) / firstPoint.netWorth) * 100;
      
      let insight = "";
      if (growth > 5) {
        insight = `Gemini Analysis: Your net worth has grown by ${growth.toFixed(1)}% over the selected period. Asset appreciation in your investment portfolio is the primary driver. Recommendation: Consider rebalancing to lock in gains.`;
      } else if (growth > 0) {
        insight = `Gemini Analysis: Stable growth of ${growth.toFixed(1)}% observed. Spending in 'Food & Dining' is 41% above peer benchmarks, slightly offsetting asset gains.`;
      } else {
        insight = `Gemini Analysis: Net worth has decreased by ${Math.abs(growth).toFixed(1)}%. Market volatility and increased liability accumulation are contributing factors. Suggested action: Review recurring subscriptions.`;
      }
      setAiInsight(insight);
      setLoading(false);
    }, 800);
  }, [timeRange]);

  const currentNetWorth = useMemo(() => calculateTotalNetWorth(mockAccounts), []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full w-full transition-all duration-300 hover:shadow-xl">
      
      {/* Header Section */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Financial Overview
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time aggregation of your financial multiverse.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                timeRange === range
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Net Worth Chart */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Net Worth</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {formatCurrency(currentNetWorth)}
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+4.2%</span>
                <span className="text-slate-400 dark:text-slate-500 ml-1">vs last month</span>
              </div>
            </div>

            <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Assets</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {formatCurrency(mockAccounts.filter(a => a.type === 'asset').reduce((s, a) => s + a.balance, 0))}
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+1.8%</span>
                <span className="text-slate-400 dark:text-slate-500 ml-1">appreciation</span>
              </div>
            </div>

            <div className="bg-rose-50/50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800">
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Liabilities</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {formatCurrency(mockAccounts.filter(a => a.type === 'liability').reduce((s, a) => s + a.balance, 0))}
              </div>
              <div className="flex items-center mt-2 text-sm text-rose-600 dark:text-rose-400">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span>-0.5%</span>
                <span className="text-slate-400 dark:text-slate-500 ml-1">reduction</span>
              </div>
            </div>
          </div>

          {/* Main Chart Area */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 min-h-[300px] relative">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            )}
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Net Worth Trend</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    dy={10}
                  />
                  <YAxis 
                    hide={false}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="netWorth" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorNetWorth)" 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Net Worth"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insight Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  AI Financial Guardian
                  <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full border border-white/20">BETA</span>
                </h3>
                <p className="mt-2 text-indigo-50 text-sm leading-relaxed">
                  {loading ? "Analyzing ecosystem metrics..." : aiInsight}
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="text-xs bg-white text-indigo-600 font-semibold px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                    View Detailed Report
                  </button>
                  <button className="text-xs bg-indigo-700/50 text-white font-medium px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors border border-indigo-500/30">
                    Ask Gemini
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown & Spending */}
        <div className="flex flex-col gap-6">
          
          {/* Account Balances List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wide">
              Liquid & Debt
            </h3>
            <div className="space-y-4">
              {mockAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${account.type === 'asset' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {account.type === 'asset' ? <DollarSign className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{account.name}</div>
                      <div className="text-xs text-slate-500">{account.type === 'asset' ? 'Asset' : 'Liability'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(account.balance)}</div>
                    <div className={`text-xs font-medium ${account.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {account.changePercent > 0 ? '+' : ''}{account.changePercent}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="w-full mt-4 py-2 text-xs font-medium text-slate-500 hover:text-indigo-600 border border-dashed border-slate-300 rounded-lg hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
              onClick={onNavigateToFullView}
            >
              Connect New Account
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Recent Spending Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5 flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wide flex justify-between items-center">
              <span>Category Spend (30d)</span>
              <AlertCircle className="w-4 h-4 text-amber-500 cursor-help" title="Based on AI categorization of recent transactions" />
            </h3>
            
            <div className="flex-1 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSpending} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }} barSize={12}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="category" width={100} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-xl">
                            <p className="font-bold">{data.category}</p>
                            <p>Spent: {formatCurrency(data.amount)}</p>
                            <p>Budget: {formatCurrency(data.budget)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]} background={{ fill: '#f1f5f9' }}>
                    {mockSpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.amount > entry.budget ? '#ef4444' : entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-3">
              {mockSpending.slice(0, 3).map((item) => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600 dark:text-slate-400">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span>
                    <span className="text-slate-400">/ {formatCurrency(item.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinancialOverviewWidget;