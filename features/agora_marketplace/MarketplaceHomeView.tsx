// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/agora_marketplace/MarketplaceHomeView.tsx
================================================================================

import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Rocket, Star, DollarSign, Zap, Aperture, Settings, Cpu, Layers, X } from 'lucide-react';

// --- Type Definitions ---
interface MarketplaceItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Risk' | 'Finance Ops' | 'Compliance' | 'Developer Tools' | 'Strategy' | 'Marketing';
  provider: string; // e.g., 'Internal Quantum Unit', 'Gemini Enterprise', 'Third-Party'
  priceModel: 'Subscription' | 'Per-Use' | 'Free' | 'Tiered';
  rating: number; // 0.0 - 5.0
  kpiImpact: string[]; // e.g., ["Strategic Alignment Score", "Investment ROI", "Market Volatility Exposure"]
  integrationApis: string[]; // e.g., ["Salesforce", "Plaid", "Bloomberg API"]
  isFeatured: boolean;
  deploymentStatus: 'Available' | 'Beta' | 'Coming Soon';
  aiModelUsed: string;
  version: string;
}

// --- Mock Data: High-fidelity corporate/financial agents ---
const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'ai-001',
    name: 'Hyper-Personalized Economic Governor',
    tagline: 'Predicts micro-economic shifts based on real-time corporate ledger data.',
    description: 'Leverages the proprietary Hyper-Personalized Economic Governance API to simulate market outcomes, providing real-time strategic recommendations for asset allocation, risk hedging, and capital deployment. Crucial for optimizing decentralized treasury operations.',
    category: 'Strategy',
    provider: 'Internal Quantum Unit',
    priceModel: 'Tiered',
    rating: 4.92,
    kpiImpact: ['Strategic Alignment Score', 'Investment ROI', 'Market Volatility Exposure (MVE)', 'Decentralized Treasury Yield'],
    integrationApis: ['Bloomberg Data License', 'Refinitiv Eikon', 'Internal Ledger Service', 'SWIFT API'],
    isFeatured: true,
    deploymentStatus: 'Available',
    aiModelUsed: 'Gemini Advanced 5.0 / Qiskit Hybrid Solver',
    version: '1.2.0'
  },
  {
    id: 'ai-002',
    name: 'Quantum Compliance Shield',
    tagline: 'Automates regulatory reporting and detects potential compliance breaches using ZKP.',
    description: 'Uses zero-knowledge proofs (ZKP) and deep learning to monitor transactions against global regulatory frameworks (AML, KYC, MiFID II, GDPR). Reduces manual audit time by up to 85% and minimizes regulatory fine exposure.',
    category: 'Compliance',
    provider: 'RegTech Solutions Inc.',
    priceModel: 'Subscription',
    rating: 4.55,
    kpiImpact: ['Regulatory Fine Reduction', 'Audit Cycle Time', 'Compliance Score (CR)', 'Transaction Screening Velocity'],
    integrationApis: ['Internal Audit Logs', 'Fedwire API', 'Blockchain Monitoring Services', 'OFAC Watchlist API'],
    isFeatured: true,
    deploymentStatus: 'Available',
    aiModelUsed: 'Custom Compliance LLM (Fine-tuned Llama 3)',
    version: '2.1.5'
  },
  {
    id: 'ai-003',
    name: 'Sentient Asset Manager',
    tagline: 'AI agent managing corporate liquid assets and optimizing working capital.',
    description: 'A fully autonomous agent forecasting short-term cash flow with nanosecond precision. It dynamically repositions funds to optimize yield while strictly adhering to defined liquidity and counterparty risk limits. Interfaces with major corporate banking and FX platforms.',
    category: 'Finance Ops',
    provider: 'Internal Allocatra Engine',
    priceModel: 'Per-Use',
    rating: 4.80,
    kpiImpact: ['Working Capital Efficiency', 'Cash Conversion Cycle (CCC)', 'Liquidity Ratio', 'FX Hedging Accuracy'],
    integrationApis: ['JPMorgan Chase API', 'Visa B2B Connect', 'SAP ERP', 'Treasury Management System (TMS)'],
    isFeatured: false,
    deploymentStatus: 'Available',
    aiModelUsed: 'AI Sentient Asset Management Model (Proprietary)',
    version: '3.0.1'
  },
  {
    id: 'ai-004',
    name: 'Multiverse Financial Projection',
    tagline: 'Runs 10,000 parallel financial scenarios for extreme stress testing.',
    description: 'Utilizes quantum-inspired algorithms to model extreme financial conditions (black swan events, geopolitical shifts), offering robust stress testing capabilities far beyond traditional Monte Carlo simulations. Provides actionable advice for capital reserves planning.',
    category: 'Risk',
    provider: 'Google AI / Quant Division',
    priceModel: 'Subscription',
    rating: 4.70,
    kpiImpact: ['Stress Test Resilience Index', 'Scenario Coverage Index', 'Value at Risk (VaR) Reduction', 'Capital Adequacy Ratio'],
    integrationApis: ['FRED API', 'World Bank API', 'Internal Portfolio Data', 'Macro Economic Indicators'],
    isFeatured: true,
    deploymentStatus: 'Available',
    aiModelUsed: 'Multiverse Projection Engine (QPU-enabled)',
    version: '1.0.3'
  },
  {
    id: 'ai-005',
    name: 'Generative Code Archeologist',
    tagline: 'Refactors COBOL and legacy systems into modern, secure code.',
    description: 'Essential developer tool that analyzes monolithic legacy systems (including COBOL and Fortran) and intelligently generates modular, modern code (TypeScript/Rust/Go) while maintaining 100% functional parity. Reduces technical debt and migration risk significantly.',
    category: 'Developer Tools',
    provider: 'OpenAI Enterprise Services',
    priceModel: 'Per-Use',
    rating: 4.23,
    kpiImpact: ['Technical Debt Score Reduction', 'Development Velocity', 'Maintenance Cost Reduction', 'Security Vulnerability Count'],
    integrationApis: ['GitHub API', 'JIRA', 'Internal Code Repository', 'Sonarqube'],
    isFeatured: false,
    deploymentStatus: 'Beta',
    aiModelUsed: 'Code Llama 70B / GPT-4 Refactoring Agents',
    version: '0.9.5'
  },
  {
    id: 'ai-006',
    name: 'Strategic Goal Roadmap Planner',
    tagline: 'AI-driven strategic planning assistant for leadership teams.',
    description: 'Analyzes organizational capacity, market trends, and historical performance to construct optimized strategic roadmaps. Identifies potential resource bottlenecks before they occur.',
    category: 'Strategy',
    provider: 'Internal Management Consulting AI',
    priceModel: 'Subscription',
    rating: 4.60,
    kpiImpact: ['Project Success Rate', 'Resource Allocation Efficiency', 'Time-to-Market'],
    integrationApis: ['Project Management Tools', 'HRIS Data', 'Salesforce'],
    isFeatured: false,
    deploymentStatus: 'Coming Soon',
    aiModelUsed: 'Claude 3 Opus / Internal Planning Model',
    version: '1.0.0'
  }
];

const CATEGORIES: MarketplaceItem['category'][] = ['Strategy', 'Compliance', 'Finance Ops', 'Risk', 'Developer Tools', 'Marketing'];

// --- Utility Component: Star Rating ---
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest half
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    let iconClass = "w-4 h-4";
    if (i <= roundedRating) {
      iconClass += " text-yellow-400 fill-yellow-400"; // Full star
    } else if (i - 0.5 === roundedRating) {
      iconClass += " text-yellow-400 fill-yellow-200 dark:fill-yellow-600"; // Half star visual simulation
    } else {
      iconClass += " text-gray-300 dark:text-gray-600"; // Empty star
    }
    stars.push(<Star key={i} className={iconClass} />);
  }
  return <div className="flex items-center space-x-0.5">{stars} ({rating.toFixed(2)})</div>;
};

// --- AgentCard Component ---
const AgentCard: React.FC<{ item: MarketplaceItem; onSelect: (item: MarketplaceItem) => void }> = ({ item, onSelect }) => {
  const IconMap = {
    'Risk': Zap,
    'Compliance': Settings,
    'Strategy': Rocket,
    'Finance Ops': DollarSign,
    'Developer Tools': Cpu,
    'Marketing': Aperture,
  };
  const ItemIcon = IconMap[item.category] || Layers;

  const getDeploymentStatusClasses = (status: MarketplaceItem['deploymentStatus']) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Beta': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Coming Soon': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Convert KPI names to acronyms for badges
  const getKpiAcronym = (kpi: string): string => {
    const acronyms: { [key: string]: string } = {
        'Investment ROI': 'ROI',
        'Working Capital Efficiency': 'WCE',
        'Regulatory Fine Reduction': 'RFR',
        'Technical Debt Score Reduction': 'TDSR',
        'Market Volatility Exposure (MVE)': 'MVE',
        'Stress Test Resilience Index': 'STRI',
        'Cash Conversion Cycle (CCC)': 'CCC'
    };
    return acronyms[kpi] || kpi.split(' ').map(w => w[0]).join('').toUpperCase();
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg transition duration-300 p-6 flex flex-col cursor-pointer hover:shadow-2xl hover:border-indigo-500/50"
      onClick={() => onSelect(item)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/50">
            <ItemIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{item.tagline}</p>

      <div className="mt-3 text-sm">
        <StarRating rating={item.rating} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getDeploymentStatusClasses(item.deploymentStatus)}`}>
            {item.deploymentStatus}
        </span>
        <span className="text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-full">
            {item.category}
        </span>
        {item.kpiImpact.slice(0, 2).map(kpi => (
          <span key={kpi} className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
            KPI: {getKpiAcronym(kpi)}
          </span>
        ))}
      </div>
    </div>
  );
};

// --- AI Insights Banner Component ---
// This simulates fetching a real-time, personalized recommendation from an AI agent 
// based on user activity or corporate KPIs (e.g., from components/AIInsights.tsx or services/ai)
const AIInsightsBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-4 mb-6 bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500 rounded-lg shadow-inner flex items-center space-x-3 transition duration-500 hover:shadow-md">
    <Aperture className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 animate-pulse" />
    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
      <span className="font-bold text-purple-700 dark:text-purple-300">Sentient Advisor Insight:</span> {message}
    </p>
  </div>
);

// --- Agent Detail Modal Component (Leveraging components/ModalView structure) ---
const AgentDetailModal: React.FC<{ item: MarketplaceItem; onClose: () => void }> = ({ item, onClose }) => {
  const handleInstallation = () => {
    // Commercial grade deployment logic:
    // 1. Check user permissions via Auth service
    // 2. Call AITaskManagerService (services/ai/AITaskManagerService.ts) to provision infrastructure (cloud/terraform)
    // 3. Update IntegrationCodex status
    console.log(`Initiating secure provisioning for Agent: ${item.name} (v${item.version})`);
    alert(`Installation initiated for ${item.name}! Check the Integration Codex for deployment status.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-8 transform transition-all duration-300 scale-100">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-4 dark:border-gray-700">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{item.name}</h2>
            <p className="text-lg text-indigo-600 dark:text-indigo-400 mt-1">{item.tagline}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300 text-md leading-relaxed">{item.description}</p>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-700">
              <DetailBox title="AI Model" value={item.aiModelUsed} />
              <DetailBox title="Provider" value={item.provider} />
              <DetailBox title="Version" value={`v${item.version}`} />
              <DetailBox title="Rating" value={<StarRating rating={item.rating} />} isComponent={true} />
          </div>

          {/* KPI Impact */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white border-b border-indigo-200 dark:border-indigo-900/30 pb-1">
                Strategic KPI Impact
            </h3>
            <div className="flex flex-wrap gap-2">
                {item.kpiImpact.map(kpi => (
                    <span key={kpi} className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg shadow-sm">
                        {kpi}
                    </span>
                ))}
            </div>
          </div>

          {/* Integrations */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white border-b border-indigo-200 dark:border-indigo-900/30 pb-1">
                Required / Supported Integrations
            </h3>
            <div className="flex flex-wrap gap-2">
                {item.integrationApis.map(api => (
                    <span key={api} className="px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full border dark:border-gray-600">
                        {api}
                    </span>
                ))}
            </div>
          </div>
        </div>
        
        {/* Action Footer */}
        <div className="flex justify-end space-x-4 pt-6 mt-6 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleInstallation}
            disabled={item.deploymentStatus !== 'Available'}
            className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
              item.deploymentStatus === 'Available'
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/50'
                : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            }`}
          >
            {item.deploymentStatus === 'Available' ? `Deploy ${item.priceModel} Model` : `Waitlist / Request Access`}
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailBox: React.FC<{ title: string; value: string | JSX.Element; isComponent?: boolean }> = ({ title, value, isComponent = false }) => (
    <div>
        <h4 className="font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">{title}</h4>
        {isComponent ? (
            <div className="text-gray-900 dark:text-white font-medium mt-1">{value}</div>
        ) : (
            <p className="text-gray-900 dark:text-white font-medium mt-1 text-base">{value}</p>
        )}
    </div>
);


// --- Main View Component ---
const MarketplaceHomeView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceItem['category'] | 'All'>('All');
  const [activeItem, setActiveItem] = useState<MarketplaceItem | null>(null);

  // Simulated AI recommendation, mimicking output from useAIInsightManagement or similar hook
  const aiRecommendationInsight = "Based on your Q3 Risk Score volatility (current STRI: 65%), the 'Multiverse Financial Projection' tool is highly recommended for proactive scenario planning and optimizing capital reserves.";

  const filteredItems = useMemo(() => {
    let items = MOCK_MARKETPLACE_ITEMS;

    if (selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(lowerCaseSearch) ||
        item.description.toLowerCase().includes(lowerCaseSearch) ||
        item.tagline.toLowerCase().includes(lowerCaseSearch) ||
        item.aiModelUsed.toLowerCase().includes(lowerCaseSearch) ||
        item.kpiImpact.some(kpi => kpi.toLowerCase().includes(lowerCaseSearch))
      );
    }

    // Sort: Featured first, then by rating
    return items.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.rating - a.rating;
    });
  }, [searchTerm, selectedCategory]);

  const handleCategorySelect = useCallback((category: MarketplaceItem['category'] | 'All') => {
    setSelectedCategory(category);
  }, []);

  const handleItemSelect = useCallback((item: MarketplaceItem) => {
    setActiveItem(item);
  }, []);

  const closeModal = useCallback(() => {
    setActiveItem(null);
  }, []);

  const featuredItems = MOCK_MARKETPLACE_ITEMS.filter(i => i.isFeatured);

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center">
          <Aperture className="w-10 h-10 mr-3 text-indigo-600" />
          Agora AI Marketplace: Sentient Agents
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Explore and provision high-assurance AI agents for strategic, financial, and regulatory operations.
        </p>
      </header>

      {/* AI Recommendation Section */}
      <AIInsightsBanner message={aiRecommendationInsight} />

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents, KPIs (e.g., ROI, MVE), or AI models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-base shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value as MarketplaceItem['category'] | 'All')}
            className="py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white appearance-none text-base shadow-sm hover:border-indigo-500 transition"
          >
            <option value="All">All Categories ({MOCK_MARKETPLACE_ITEMS.length})</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category} ({MOCK_MARKETPLACE_ITEMS.filter(i => i.category === category).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured Agents Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 border-b border-gray-200 dark:border-gray-700 pb-2">
          🔥 High-Impact Agents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.slice(0, 4).map(item => (
            <AgentCard key={item.id} item={item} onSelect={handleItemSelect} />
          ))}
        </div>
      </section>

      {/* All Marketplace Listings */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 border-b border-gray-200 dark:border-gray-700 pb-2">
          Comprehensive Catalog ({filteredItems.length} Agents Found)
        </h2>
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <AgentCard key={item.id} item={item} onSelect={handleItemSelect} />
            ))}
          </div>
        ) : (
          <div className="text-center p-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <Layers className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              No matching sentient agents found.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Try adjusting your category filter or search terms for broader results.
            </p>
          </div>
        )}
      </section>

      {/* Agent Detail Modal */}
      {activeItem && <AgentDetailModal item={activeItem} onClose={closeModal} />}
    </div>
  );
};

export default MarketplaceHomeView;