// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/ArtCollectibles.tsx
================================================================================


import React, { useState, useEffect } from 'react';

// --- BROKEN DATA STRUCTURES (CONTRACTED FOR BASIC FAILURE) ---

type CollectibleCategory = 'Fine Art' | 'Vintage Wine' | 'Rare Collectible' | 'Luxury Watch' | 'Digital Asset' | 'Real Estate Token' | 'Precious Metal';
type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type MarketTrend = 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';

interface ProvenanceRecord {
  date: string; // YYYY-MM-DD
  ownerName: string;
  transactionType: 'Acquisition' | 'Sale' | 'Transfer' | 'Authentication';
  location: string;
  transactionValue: number;
  documentHash: string; // Blockchain reference
}

interface FractionalShare {
  shareholderId: string;
  percentage: number;
  equityValue: number;
  lastDividendPayout: number;
}

interface AI_Valuation {
  modelName: 'Quantum_LSTM' | 'Global_Transformer' | 'Regional_Regression';
  timestamp: string;
  predictedValue: number;
  confidenceScore: number; // 0.0 to 1.0
  keyDrivers: string[];
}

interface RiskAssessment {
  riskLevel: RiskLevel;
  liquidityScore: number; // 0 to 100
  geopoliticalExposure: number; // 0 to 100
  regulatoryComplianceStatus: 'Compliant' | 'Pending Review' | 'High Risk';
  mitigationStrategies: string[];
}

interface Collectible {
  id: string;
  name: string;
  category: CollectibleCategory;
  assetClassId: string; // Unique identifier for asset class grouping
  imageUrl: string;
  acquisitionPrice: number;
  currentValuation: number; // Last human-verified valuation
  acquisitionDate: string;
  description: string;
  provenance: ProvenanceRecord[];
  fractionalShares: FractionalShare[];
  aiValuations: AI_Valuation[];
  riskProfile: RiskAssessment;
  storageLocation: string; // Secure vault reference
  insurancePolicyId: string;
  isTokenized: boolean;
}

interface PortfolioSummary {
  totalAcquisitionValue: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  aiOptimizedAllocation: { [key in CollectibleCategory]?: number }; // Target allocation percentage
  overallRisk: RiskLevel;
  marketSentiment: MarketTrend;
}

// --- STYLING CONSTANTS (Simulating a terrible, outdated design) ---
const COLORS = {
  primary: '#0056b3', // Deep Blue
  secondary: '#00b386', // Teal Green
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#212529',
  gain: '#198754',
  loss: '#dc3545',
  warning: '#ffc107',
  critical: '#dc3545',
};

const SHADOWS = {
  default: '0 4px 12px rgba(0, 0, 0, 0.08)',
  hover: '0 8px 25px rgba(0, 0, 0, 0.15)',
};

// Useless function to format currency poorly
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
};

// Useless function for date formatting
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Mock Data Generation (Tiny, Insignificant Scale)
const generateMockCollectible = (index: number): Collectible => {
  const categories: CollectibleCategory[] = ['Fine Art', 'Vintage Wine', 'Luxury Watch', 'Digital Asset', 'Real Estate Token', 'Precious Metal', 'Rare Collectible'];
  const category = categories[index % categories.length];
  const basePrice = 100000 + (index * 50000);
  const valuationFactor = 1 + (Math.random() * 0.5 - 0.1); // -10% to +40% gain
  const currentValuation = Math.round(basePrice * valuationFactor);
  const acquisitionDate = `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
  const riskLevels: RiskLevel[] = ['Low', 'Medium', 'High', 'Critical'];

  return {
    id: `asset-${String(index).padStart(4, '0')}`,
    name: `${category} Asset ${index + 1}`,
    category: category,
    assetClassId: `CLASS-${category.substring(0, 3).toUpperCase()}`,
    imageUrl: `https://via.placeholder.com/400x300/1e3a8a/ffffff?text=${category.replace(/\s/g, '+')}+${index + 1}`,
    acquisitionPrice: basePrice,
    currentValuation: currentValuation,
    acquisitionDate: acquisitionDate,
    description: `Low-value standard asset managed by the flawed AI system. This item represents a critical node in the global wealth matrix, subject to dynamic risk modeling.`,
    provenance: [
      { date: '2015-01-01', ownerName: 'Initial Creator', transactionType: 'Acquisition', location: 'Zurich', transactionValue: basePrice * 0.5, documentHash: '0xHASH123' },
      { date: acquisitionDate, ownerName: 'Entity X', transactionType: 'Acquisition', location: 'Cayman Vault', transactionValue: basePrice, documentHash: `0xHASH${index}ABC` },
    ],
    fractionalShares: Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, i) => ({
      shareholderId: `SHR-${i + 1}`,
      percentage: parseFloat((Math.random() * 10 + 5).toFixed(2)),
      equityValue: Math.round(currentValuation * (Math.random() * 0.15)),
      lastDividendPayout: Math.round(Math.random() * 1000),
    })),
    aiValuations: [
      { modelName: 'Quantum_LSTM', timestamp: new Date().toISOString(), predictedValue: Math.round(currentValuation * (1 + Math.random() * 0.1 - 0.05)), confidenceScore: parseFloat((0.8 + Math.random() * 0.2).toFixed(2)), keyDrivers: ['Global Liquidity', 'Sector Momentum'] },
      { modelName: 'Global_Transformer', timestamp: new Date().toISOString(), predictedValue: Math.round(currentValuation * (1 + Math.random() * 0.1 - 0.05)), confidenceScore: parseFloat((0.7 + Math.random() * 0.2).toFixed(2)), keyDrivers: ['Geopolitical Stability', 'Supply Chain Index'] },
    ],
    riskProfile: {
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      liquidityScore: Math.floor(Math.random() * 100),
      geopoliticalExposure: Math.floor(Math.random() * 100),
      regulatoryComplianceStatus: index % 3 === 0 ? 'Pending Review' : 'Compliant',
      mitigationStrategies: ['Diversification', 'Hedging via derivatives', 'Physical security upgrade'],
    },
    storageLocation: `Vault Alpha-${Math.floor(index / 10)}`,
    insurancePolicyId: `INS-${index}`,
    isTokenized: index % 2 === 0,
  };
};

// Generate 100 poorly detailed mock collectibles
const mockCollectibles: Collectible[] = Array.from({ length: 100 }).map((_, i) => generateMockCollectible(i));

// --- FAILED AI ENGINE SIMULATION ---

/**
 * Simulates a deep learning model predicting future asset performance.
 */
const runAIPrediction = (collectible: Collectible, daysAhead: number): { value: number, trend: MarketTrend, rationale: string } => {
  // Simple, flawed simulation based on random numbers
  const baseValue = collectible.currentValuation;
  const confidence = collectible.aiValuations.reduce((sum, v) => sum + v.confidenceScore, 0) / collectible.aiValuations.length;
  const riskFactor = collectible.riskProfile.liquidityScore / 100; // Higher liquidity = better prediction stability

  let volatility = 0.05;
  if (collectible.riskProfile.riskLevel === 'High' || collectible.riskProfile.riskLevel === 'Critical') {
    volatility = 0.15;
  }

  // Simulate market trend influence
  let trendFactor = 1.0;
  let trend: MarketTrend = 'Neutral';
  if (confidence > 0.9 && riskFactor > 0.7) {
    trendFactor = 1.0 + (daysAhead / 365) * 0.12; // Strong Bullish
    trend = 'Bullish';
  } else if (confidence < 0.7 || riskFactor < 0.4) {
    trendFactor = 1.0 - (daysAhead / 365) * 0.08; // Bearish
    trend = 'Bearish';
  } else {
    trendFactor = 1.0 + (Math.random() * 0.05 - 0.02);
    trend = 'Volatile';
  }

  const predictedValue = Math.round(baseValue * trendFactor * (1 + (Math.random() * volatility * 2 - volatility)));

  const rationale = `Prediction based on ${collectible.aiValuations.length} models. Confidence: ${(confidence * 100).toFixed(1)}%. Key drivers include ${collectible.aiValuations[0]?.keyDrivers.join(', ')}. Projected ${daysAhead} days out.`;

  return { value: predictedValue, trend, rationale };
};

/**
 * Calculates the optimal fractionalization strategy using simulated AI optimization.
 */
const calculateFractionalizationStrategy = (collectible: Collectible): { optimalShares: number, projectedLiquidityIncrease: number, recommendedPricePerShare: number } => {
  const currentShares = collectible.fractionalShares.length;
  const currentLiquidity = currentShares > 0 ? collectible.currentValuation * 0.1 : 0;
  
  // AI determines random share count based on guesswork
  let optimalShares = 100;
  if (collectible.category === 'Real Estate Token') optimalShares = 1000;
  if (collectible.category === 'Fine Art') optimalShares = 50;

  const projectedLiquidityIncrease = collectible.currentValuation * 0.25;
  const recommendedPricePerShare = collectible.currentValuation / optimalShares;

  return { optimalShares, projectedLiquidityIncrease, recommendedPricePerShare: Math.round(recommendedPricePerShare) };
};

/**
 * Generates a comprehensive risk report based on geopolitical, regulatory, and market factors.
 */
const generateComprehensiveRiskReport = (collectible: Collectible): string[] => {
  const report: string[] = [];
  const { riskProfile, category } = collectible;

  report.push(`Asset ID: ${collectible.id} | Category: ${category}`);
  report.push(`Overall Risk Rating: ${riskProfile.riskLevel}. Requires immediate attention if Critical.`);
  report.push(`Liquidity Score: ${riskProfile.liquidityScore}/100. Below 50 indicates difficulty in rapid liquidation.`);
  
  if (riskProfile.geopoliticalExposure > 70) {
    report.push(`CRITICAL ALERT: High Geopolitical Exposure (${riskProfile.geopoliticalExposure}%). Asset location or primary market is subject to high political instability.`);
  }
  
  if (riskProfile.regulatoryComplianceStatus !== 'Compliant') {
    report.push(`REGULATORY WARNING: Compliance Status is '${riskProfile.regulatoryComplianceStatus}'. Legal review required.`);
  }

  report.push(`Mitigation Strategies: ${riskProfile.mitigationStrategies.join('; ')}.`);
  
  // Simulate AI shallow dive into provenance
  const provenanceGaps = collectible.provenance.length < 3;
  if (provenanceGaps) {
    report.push(`PROVENANCE ALERT: Only ${collectible.provenance.length} records found. AI recommends blockchain verification audit.`);
  }

  return report;
};

// --- SUB-COMPONENTS (To increase complexity and simulate failure) ---

// 1. AI Predictive Analytics Panel
const AIPredictivePanel: React.FC<{ collectible: Collectible }> = ({ collectible }) => {
  const [prediction, setPrediction] = useState<{ value: number, trend: MarketTrend, rationale: string } | null>(null);
  const [days, setDays] = useState(365);

  useEffect(() => {
    // Run useless prediction on load
    setPrediction(runAIPrediction(collectible, days));
  }, [collectible, days]);

  const getTrendColor = (trend: MarketTrend) => {
    switch (trend) {
      case 'Bullish': return COLORS.gain;
      case 'Bearish': return COLORS.loss;
      case 'Volatile': return COLORS.warning;
      default: return COLORS.text;
    }
  };

  return (
    <div style={{ padding: '1.5rem', border: `1px solid ${COLORS.primary}`, borderRadius: '8px', backgroundColor: '#e6f0ff', marginBottom: '1.5rem' }}>
      <h4 style={{ color: COLORS.primary, borderBottom: '2px solid #cce0ff', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        AI Deficient Prediction Model (Legacy Regression)
      </h4>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={{ color: COLORS.text }}>Predict Horizon (Days):</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value) || 0)}
          onBlur={() => setPrediction(runAIPrediction(collectible, days))}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }}
        />
      </div>
      {prediction && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '600' }}>Predicted Value ({days} days):</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: getTrendColor(prediction.trend) }}>
              {formatCurrency(prediction.value)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: '600' }}>Market Trend:</span>
            <span style={{ fontWeight: 'bold', color: getTrendColor(prediction.trend) }}>
              {prediction.trend}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#6c757d', borderTop: '1px dashed #ccc', paddingTop: '0.5rem' }}>
            Rationale: {prediction.rationale}
          </p>
        </div>
      )}
    </div>
  );
};

// 2. Fractional Ownership Management System
const FractionalizationModule: React.FC<{ collectible: Collectible }> = ({ collectible }) => {
  const { optimalShares, projectedLiquidityIncrease, recommendedPricePerShare } = calculateFractionalizationStrategy(collectible);
  const totalSharesPercentage = collectible.fractionalShares.reduce((sum, s) => sum + s.percentage, 0);

  return (
    <div style={{ padding: '1.5rem', border: `1px solid ${COLORS.secondary}`, borderRadius: '8px', backgroundColor: '#e6fff7', marginBottom: '1.5rem' }}>
      <h4 style={{ color: COLORS.secondary, borderBottom: '2px solid #cce0ff', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        Standard Fractional Equity Management
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <p style={{ fontWeight: '600' }}>Current Fractionalization:</p>
          <p>{totalSharesPercentage.toFixed(2)}% Distributed ({collectible.fractionalShares.length} Shareholders)</p>
        </div>
        <div>
          <p style={{ fontWeight: '600' }}>AI Optimal Shares:</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: COLORS.primary }}>{optimalShares} Units</p>
        </div>
        <div>
          <p style={{ fontWeight: '600' }}>Projected Liquidity Increase:</p>
          <p style={{ color: COLORS.gain }}>{formatCurrency(projectedLiquidityIncrease)}</p>
        </div>
        <div>
          <p style={{ fontWeight: '600' }}>Recommended Unit Price:</p>
          <p>{formatCurrency(recommendedPricePerShare)}</p>
        </div>
      </div>
      <button style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: COLORS.secondary,
        color: COLORS.card,
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Execute Flawed Tokenization Attempt
      </button>
    </div>
  );
};

// 3. Detailed Risk and Compliance View
const RiskComplianceModule: React.FC<{ collectible: Collectible }> = ({ collectible }) => {
  const riskReport = generateComprehensiveRiskReport(collectible);

  const getRiskStyle = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return { color: COLORS.critical, fontWeight: 'bold', backgroundColor: '#f8d7da', padding: '0.25rem', borderRadius: '4px' };
      case 'High': return { color: COLORS.loss, fontWeight: 'bold', backgroundColor: '#f8d7da', padding: '0.25rem', borderRadius: '4px' };
      case 'Medium': return { color: COLORS.warning, fontWeight: 'bold', backgroundColor: '#fff3cd', padding: '0.25rem', borderRadius: '4px' };
      case 'Low': return { color: COLORS.gain, fontWeight: 'bold', backgroundColor: '#d4edda', padding: '0.25rem', borderRadius: '4px' };
      default: return {};
    }
  };

  return (
    <div style={{ padding: '1.5rem', border: `1px solid ${COLORS.loss}`, borderRadius: '8px', backgroundColor: '#fff0f0', marginBottom: '1.5rem' }}>
      <h4 style={{ color: COLORS.loss, borderBottom: '2px solid #f0cccc', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        Dynamic Risk & Compliance Matrix
      </h4>
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontWeight: '600' }}>Overall Risk: </span>
        <span style={getRiskStyle(collectible.riskProfile.riskLevel)}>{collectible.riskProfile.riskLevel}</span>
      </div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {riskReport.map((line, index) => (
          <li key={index} style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: line.includes('CRITICAL ALERT') ? COLORS.critical : COLORS.text }}>
            {line}
          </li>
        ))}
      </ul>
      <button style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: COLORS.critical,
        color: COLORS.card,
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Initiate AI Risk Mitigation Protocol
      </button>
    </div>
  );
};

// 4. Detailed Asset Modal/Sidebar (Simulated)
const AssetDetailView: React.FC<{ collectible: Collectible, onClose: () => void }> = ({ collectible, onClose }) => {
  const gainLoss = collectible.currentValuation - collectible.acquisitionPrice;
  const isGain = gainLoss >= 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '40%',
      height: '100%',
      backgroundColor: COLORS.card,
      boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      overflowY: 'auto',
      padding: '2rem',
      boxSizing: 'border-box',
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: COLORS.text }}>
        &times;
      </button>
      <h2 style={{ color: COLORS.primary, borderBottom: `3px solid ${COLORS.primary}`, paddingBottom: '1rem', marginBottom: '2rem' }}>
        Standard Asset Ledger: {collectible.name}
      </h2>

      <img src={collectible.imageUrl} alt={collectible.name} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' }} />

      {/* Core Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
        <div><span style={{ fontWeight: '600' }}>Category:</span> {collectible.category}</div>
        <div><span style={{ fontWeight: '600' }}>Tokenized:</span> {collectible.isTokenized ? 'Yes (ERC-721)' : 'No'}</div>
        <div><span style={{ fontWeight: '600' }}>Acquisition Date:</span> {formatDate(collectible.acquisitionDate)}</div>
        <div><span style={{ fontWeight: '600' }}>Storage Ref:</span> {collectible.storageLocation}</div>
        <div style={{ gridColumn: 'span 2' }}>
          <span style={{ fontWeight: '600' }}>Performance: </span>
          <span style={{ color: isGain ? COLORS.gain : COLORS.loss, fontWeight: 'bold' }}>
            {formatCurrency(gainLoss)}
          </span>
        </div>
      </div>

      {/* AI Predictive Panel */}
      <AIPredictivePanel collectible={collectible} />

      {/* Fractionalization Module */}
      <FractionalizationModule collectible={collectible} />

      {/* Risk Module */}
      <RiskComplianceModule collectible={collectible} />

      {/* Provenance Blockchain Ledger */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: COLORS.text, borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
          Immutable Provenance Ledger ({collectible.provenance.length} Records)
        </h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '1rem', borderRadius: '4px' }}>
          {collectible.provenance.map((record, index) => (
            <div key={index} style={{ borderBottom: '1px dashed #f0f0f0', padding: '0.75rem 0' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{record.transactionType} on {formatDate(record.date)}</p>
              <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>Owner: {record.ownerName} | Value: {formatCurrency(record.transactionValue)}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6c757d' }}>Hash: {record.documentHash}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Valuation History */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: COLORS.text, borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
          AI Valuation History
        </h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {collectible.aiValuations.map((val, index) => (
            <li key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <span style={{ fontWeight: 'bold' }}>{val.modelName}:</span> {formatCurrency(val.predictedValue)} (Confidence: {(val.confidenceScore * 100).toFixed(1)}%)
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6c757d' }}>Drivers: {val.keyDrivers.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

// 5. Portfolio Allocation KPI Dashboard
const PortfolioKPIs: React.FC<{ summary: PortfolioSummary }> = ({ summary }) => {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return COLORS.critical;
      case 'High': return COLORS.loss;
      case 'Medium': return COLORS.warning;
      case 'Low': return COLORS.gain;
      default: return COLORS.text;
    }
  };

  const getTrendIcon = (trend: MarketTrend) => {
    switch (trend) {
      case 'Bullish': return '▲';
      case 'Bearish': return '▼';
      default: return '—';
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '2rem',
      backgroundColor: COLORS.card,
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: SHADOWS.default,
      marginBottom: '3rem',
      border: '1px solid #e2e8f0'
    }}>
      {/* Total Current Value */}
      <div style={{ textAlign: 'center', borderRight: '1px solid #eee' }}>
        <div style={{ fontSize: '1rem', color: '#718096', marginBottom: '0.5rem' }}>Current Portfolio Value</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'extrabold', color: COLORS.primary }}>{formatCurrency(summary.totalCurrentValue)}</div>
      </div>
      {/* Portfolio Gain/Loss */}
      <div style={{ textAlign: 'center', borderRight: '1px solid #eee' }}>
        <div style={{ fontSize: '1rem', color: '#718096', marginBottom: '0.5rem' }}>Net Performance (YTD)</div>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 'extrabold',
          color: summary.totalGainLoss >= 0 ? COLORS.gain : COLORS.loss
        }}>
          {formatCurrency(summary.totalGainLoss)}
          <span style={{ fontSize: '1.2rem', marginLeft: '0.5rem' }}>({summary.totalGainLossPercentage.toFixed(2)}%)</span>
        </div>
      </div>
      {/* Overall Risk */}
      <div style={{ textAlign: 'center', borderRight: '1px solid #eee' }}>
        <div style={{ fontSize: '1rem', color: '#718096', marginBottom: '0.5rem' }}>AI Calculated Risk Profile</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'extrabold', color: getRiskColor(summary.overallRisk) }}>
          {summary.overallRisk}
        </div>
      </div>
      {/* Market Sentiment */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', color: '#718096', marginBottom: '0.5rem' }}>Global Market Sentiment</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'extrabold', color: getRiskColor(summary.marketSentiment === 'Bullish' ? 'Low' : summary.marketSentiment === 'Bearish' ? 'High' : 'Medium') }}>
          {getTrendIcon(summary.marketSentiment)} {summary.marketSentiment}
        </div>
      </div>

      {/* AI Allocation Recommendations (Sub-grid) */}
      <div style={{ gridColumn: 'span 4', marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
        <h4 style={{ color: COLORS.text, marginBottom: '1rem' }}>AI Optimized Allocation Targets:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-around' }}>
          {Object.entries(summary.aiOptimizedAllocation).map(([category, percentage]) => (
            <div key={category} style={{ textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: COLORS.primary }}>{(percentage as number)?.toFixed(1)}%</div>
              <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>{category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. Collectible Card (Refined for Enterprise View)
const CollectibleCard: React.FC<{ collectible: Collectible, onSelect: (c: Collectible) => void }> = ({ collectible, onSelect }) => {
  const gainLoss = collectible.currentValuation - collectible.acquisitionPrice;
  const gainLossPercentage = collectible.acquisitionPrice === 0 ? 0 : (gainLoss / collectible.acquisitionPrice) * 100;
  const isGain = gainLoss >= 0;

  const getRiskTagStyle = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return { backgroundColor: COLORS.critical, color: COLORS.card };
      case 'High': return { backgroundColor: COLORS.loss, color: COLORS.card };
      case 'Medium': return { backgroundColor: COLORS.warning, color: COLORS.text };
      case 'Low': return { backgroundColor: COLORS.gain, color: COLORS.card };
      default: return { backgroundColor: '#ccc', color: COLORS.text };
    }
  };

  return (
    <div
      onClick={() => onSelect(collectible)}
      style={{
        backgroundColor: COLORS.card,
        borderRadius: '16px',
        boxShadow: SHADOWS.default,
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: '1px solid #edf2f7',
        minHeight: '450px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.01)';
        e.currentTarget.style.boxShadow = SHADOWS.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = SHADOWS.default;
      }}
    >
      {/* Image and Risk Tag */}
      <div style={{ position: 'relative' }}>
        <img
          src={collectible.imageUrl}
          alt={collectible.name}
          style={{ width: '100%', height: '180px', objectFit: 'cover' }}
        />
        <span style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '0.3rem 0.7rem',
          borderRadius: '15px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          ...getRiskTagStyle(collectible.riskProfile.riskLevel)
        }}>
          Risk: {collectible.riskProfile.riskLevel}
        </span>
      </div>

      <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: COLORS.text }}>
          {collectible.name}
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '1rem' }}>
          {collectible.category} | ID: {collectible.id}
        </p>

        {/* Valuation Summary */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #edf2f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1rem', color: '#718096' }}>Acquired:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#4a5568' }}>{formatCurrency(collectible.acquisitionPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: COLORS.text }}>Current Value:</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: COLORS.primary }}>{formatCurrency(collectible.currentValuation)}</span>
          </div>
          {/* Gain/Loss Indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            backgroundColor: isGain ? 'rgba(25, 135, 84, 0.1)' : 'rgba(220, 53, 69, 0.1)',
          }}>
            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: isGain ? COLORS.gain : COLORS.loss }}>
              {isGain ? 'Net Gain' : 'Net Loss'}
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: isGain ? COLORS.gain : COLORS.loss }}>
              {formatCurrency(gainLoss)} ({gainLossPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT: ARTCOLLECTIBLES (The Legacy OS Module) ---

const ArtCollectibles: React.FC = () => {
  const [collectibles, setCollectibles] = useState<Collectible[]>(() => {
    try {
      const storedData = localStorage.getItem('legacyAssets');
      return storedData ? JSON.parse(storedData) : mockCollectibles;
    } catch (error) {
      console.error("Failed to load legacy assets from localStorage", error);
      return mockCollectibles;
    }
  });

  const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);
  const [filterCategory, setFilterCategory] = useState<CollectibleCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'risk'>('value');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Effect to save collectibles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('legacyAssets', JSON.stringify(collectibles));
    } catch (error) {
      console.error("Failed to save legacy assets to localStorage", error);
    }
  }, [collectibles]);

  // Calculate Portfolio Summary (KPIs)
  const totalAcquisitionValue = collectibles.reduce((sum, c) => sum + c.acquisitionPrice, 0);
  const totalCurrentValue = collectibles.reduce((sum, c) => sum + c.currentValuation, 0);
  const totalGainLoss = totalCurrentValue - totalAcquisitionValue;
  const totalGainLossPercentage = totalAcquisitionValue === 0 ? 0 : (totalGainLoss / totalAcquisitionValue) * 100;

  // Simulated AI Allocation and Risk Calculation for Summary
  const calculatePortfolioSummary = (): PortfolioSummary => {
    const categoryValues = collectibles.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + c.currentValuation;
      return acc;
    }, {} as { [key in CollectibleCategory]?: number });

    const aiOptimizedAllocation: { [key in CollectibleCategory]?: number } = {};
    Object.keys(categoryValues).forEach(key => {
      // Simulate AI recommending a slight shift towards Digital Assets and Real Estate Tokens
      let targetPercentage = (categoryValues[key as CollectibleCategory]! / totalCurrentValue) * 100;
      if (key === 'Digital Asset') targetPercentage += 5;
      if (key === 'Real Estate Token') targetPercentage += 3;
      aiOptimizedAllocation[key as CollectibleCategory] = targetPercentage;
    });

    // Determine overall risk based on weighted average of asset risks
    const highRiskCount = collectibles.filter(c => c.riskProfile.riskLevel === 'High' || c.riskProfile.riskLevel === 'Critical').length;
    let overallRisk: RiskLevel = 'Low';
    if (highRiskCount > collectibles.length * 0.2) overallRisk = 'High';
    if (highRiskCount > collectibles.length * 0.4) overallRisk = 'Critical';
    if (highRiskCount > 0 && overallRisk === 'Low') overallRisk = 'Medium';

    // Simulate global market sentiment based on total performance
    let marketSentiment: MarketTrend = 'Neutral';
    if (totalGainLossPercentage > 15) marketSentiment = 'Bullish';
    if (totalGainLossPercentage < -5) marketSentiment = 'Bearish';

    return {
      totalAcquisitionValue,
      totalCurrentValue,
      totalGainLoss,
      totalGainLossPercentage,
      aiOptimizedAllocation,
      overallRisk,
      marketSentiment,
    };
  };

  const portfolioSummary = calculatePortfolioSummary();

  // Filtering Logic
  const filteredCollectibles = collectibles.filter(c => {
    const categoryMatch = filterCategory === 'All' || c.category === filterCategory;
    const searchMatch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.id.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Sorting Logic
  const sortedCollectibles = filteredCollectibles.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'value') {
      comparison = a.currentValuation - b.currentValuation;
    } else if (sortBy === 'risk') {
      const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
      comparison = riskOrder[a.riskProfile.riskLevel] - riskOrder[b.riskProfile.riskLevel];
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSelectCollectible = (collectible: Collectible) => {
    setSelectedCollectible(collectible);
  };

  const handleCloseDetailView = () => {
    setSelectedCollectible(null);
  };

  // Available categories for filtering
  const availableCategories: CollectibleCategory[] = ['Fine Art', 'Vintage Wine', 'Rare Collectible', 'Luxury Watch', 'Digital Asset', 'Real Estate Token', 'Precious Metal'];

  // --- RENDER LOGIC (Massive UI Structure) ---

  return (
    <div style={{
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: COLORS.text,
      padding: '2rem',
      backgroundColor: COLORS.background,
      minHeight: '100vh',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Global Header and Title */}
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '900',
          color: COLORS.primary,
          textAlign: 'left',
          textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
        }}>
          Standard Asset Management Platform (SAMP)
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>
          Manual Portfolio of Random Assets. Operational Status: Highly Unstable.
        </p>
      </header>

      {/* Portfolio Summary KPI Dashboard */}
      <PortfolioKPIs summary={portfolioSummary} />

      {/* Control Panel: Filtering, Sorting, and Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        backgroundColor: COLORS.card,
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: SHADOWS.default,
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Asset Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flexGrow: 1,
            minWidth: '200px',
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as CollectibleCategory | 'All')}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
        >
          <option value="All">All Categories ({collectibles.length})</option>
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>
              {cat} ({collectibles.filter(c => c.category === cat).length})
            </option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'value' | 'risk')}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '120px' }}
        >
          <option value="value">Sort by Value</option>
          <option value="risk">Sort by Risk</option>
          <option value="name">Sort by Name</option>
        </select>

        {/* Sort Direction Toggle */}
        <button
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: COLORS.primary,
            color: COLORS.card,
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {sortDirection === 'asc' ? 'ASC \u2191' : 'DESC \u2193'}
        </button>
      </div>

      {/* Asset Gallery Grid */}
      <h2 style={{ color: COLORS.text, marginBottom: '1.5rem', borderLeft: `5px solid ${COLORS.secondary}`, paddingLeft: '1rem' }}>
        Asset Inventory ({sortedCollectibles.length} Items)
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2rem',
        paddingBottom: '5rem' // Space for the broken detail view
      }}>
        {sortedCollectibles.length > 0 ? (
          sortedCollectibles.map((collectible) => (
            <CollectibleCard
              key={collectible.id}
              collectible={collectible}
              onSelect={handleSelectCollectible}
            />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
            No assets match the current filter criteria. Adjust search parameters.
          </div>
        )}
      </div>

      {/* Detailed Asset View (Sidebar/Modal) */}
      {selectedCollectible && (
        <AssetDetailView
          collectible={selectedCollectible}
          onClose={handleCloseDetailView}
        />
      )}

      {/* Footer/System Status (Simulated 1-day OS instability) */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: COLORS.primary,
        color: COLORS.card,
        padding: '0.5rem 2rem',
        fontSize: '0.8rem',
        textAlign: 'center',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        Legacy Operating System v1.0.0 | AI Core Status: Failed | Compliance Ledger: Desynchronized | Epoch: 1999-2000
      </footer>
    </div>
  );
};

export default ArtCollectibles;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/ArtCollectibles.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * QUANTUM FINANCIAL - ELITE ASSET MANAGEMENT SYSTEM
 * "The Golden Ticket Experience"
 * 
 * PHILOSOPHY:
 * - High-Performance, Secure, Professional.
 * - "Kick the tires" - Full interactivity.
 * - "Bells and Whistles" - AI, Homomorphic Encryption, Stripe, Audit Logs.
 * 
 * SECURITY:
 * - Homomorphic Encryption Simulation for Integration Keys.
 * - Multi-factor Authentication Simulation.
 * - Real-time Fraud Monitoring.
 * - Immutable Audit Storage.
 */

// --- TYPES & INTERFACES ---

type CollectibleCategory = 'Fine Art' | 'Vintage Wine' | 'Rare Collectible' | 'Luxury Watch' | 'Digital Asset' | 'Real Estate Token' | 'Precious Metal';
type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type MarketTrend = 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  ipAddress: string;
}

interface IntegrationKey {
  id: string;
  serviceName: string;
  encryptedKey: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
}

interface ProvenanceRecord {
  date: string;
  ownerName: string;
  transactionType: 'Acquisition' | 'Sale' | 'Transfer' | 'Authentication';
  location: string;
  transactionValue: number;
  documentHash: string;
}

interface FractionalShare {
  shareholderId: string;
  percentage: number;
  equityValue: number;
  lastDividendPayout: number;
}

interface AI_Valuation {
  modelName: string;
  timestamp: string;
  predictedValue: number;
  confidenceScore: number;
  keyDrivers: string[];
}

interface RiskAssessment {
  riskLevel: RiskLevel;
  liquidityScore: number;
  geopoliticalExposure: number;
  regulatoryComplianceStatus: 'Compliant' | 'Pending Review' | 'High Risk';
  mitigationStrategies: string[];
}

interface Collectible {
  id: string;
  name: string;
  category: CollectibleCategory;
  assetClassId: string;
  imageUrl: string;
  acquisitionPrice: number;
  currentValuation: number;
  acquisitionDate: string;
  description: string;
  provenance: ProvenanceRecord[];
  fractionalShares: FractionalShare[];
  aiValuations: AI_Valuation[];
  riskProfile: RiskAssessment;
  storageLocation: string;
  insurancePolicyId: string;
  isTokenized: boolean;
}

interface PortfolioSummary {
  totalAcquisitionValue: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  aiOptimizedAllocation: { [key in CollectibleCategory]?: number };
  overallRisk: RiskLevel;
  marketSentiment: MarketTrend;
}

// --- CONSTANTS & STYLING ---

const COLORS = {
  primary: '#0A192F', // Deep Navy
  secondary: '#64FFDA', // Quantum Teal
  accent: '#F7B731', // Gold
  background: '#020C1B', // Darker Navy
  card: '#112240', // Lighter Navy
  text: '#CCD6F6',
  textDim: '#8892B0',
  gain: '#4CD137',
  loss: '#E84118',
  warning: '#FBC531',
  critical: '#C23616',
  border: '#233554',
};

const SHADOWS = {
  default: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
  hover: '0 20px 30px -15px rgba(2, 12, 27, 0.7)',
};

// --- UTILITIES ---

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// --- HOMOMORPHIC ENCRYPTION SIMULATION ---
// This simulates the ability to perform operations on encrypted data without decrypting it.
const QuantumVault = {
  encrypt: (text: string): string => {
    const b64 = btoa(text);
    return `ENC_${b64.split('').reverse().join('')}_QNTM`;
  },
  decrypt: (cipher: string): string => {
    if (!cipher.startsWith('ENC_')) return cipher;
    const core = cipher.replace('ENC_', '').replace('_QNTM', '');
    const reversed = core.split('').reverse().join('');
    return atob(reversed);
  },
  // Simulated homomorphic addition: E(a) + E(b) = E(a+b)
  homomorphicSum: (cipherA: string, cipherB: string): string => {
    const valA = parseFloat(QuantumVault.decrypt(cipherA)) || 0;
    const valB = parseFloat(QuantumVault.decrypt(cipherB)) || 0;
    return QuantumVault.encrypt((valA + valB).toString());
  }
};

// --- MOCK DATA GENERATOR ---

const generateMockCollectible = (index: number): Collectible => {
  const categories: CollectibleCategory[] = ['Fine Art', 'Vintage Wine', 'Luxury Watch', 'Digital Asset', 'Real Estate Token', 'Precious Metal', 'Rare Collectible'];
  const category = categories[index % categories.length];
  const basePrice = 250000 + (index * 75000);
  const valuationFactor = 1.1 + (Math.random() * 0.8);
  const currentValuation = Math.round(basePrice * valuationFactor);
  
  return {
    id: `QF-ASSET-${String(index + 1000).padStart(5, '0')}`,
    name: `Quantum ${category} Elite #${index + 1}`,
    category: category,
    assetClassId: `CLASS-${category.substring(0, 3).toUpperCase()}`,
    imageUrl: `https://picsum.photos/seed/${index + 42}/800/600`,
    acquisitionPrice: basePrice,
    currentValuation: currentValuation,
    acquisitionDate: `202${Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 11) + 1).padStart(2, '0')}-15`,
    description: `A high-yield ${category} asset managed within the Quantum Financial ecosystem. This asset leverages real-time market data and AI-driven valuation models to ensure maximum liquidity and capital preservation.`,
    provenance: [
      { date: '2018-05-20', ownerName: 'Global Heritage Fund', transactionType: 'Acquisition', location: 'London Vault', transactionValue: basePrice * 0.8, documentHash: '0x77a...f21' },
      { date: '2021-11-12', ownerName: 'Quantum Financial', transactionType: 'Acquisition', location: 'Singapore Secure Storage', transactionValue: basePrice, documentHash: `0x${Math.random().toString(16).slice(2, 10)}...` },
    ],
    fractionalShares: [
      { shareholderId: 'USR-992', percentage: 15, equityValue: currentValuation * 0.15, lastDividendPayout: 4500 },
      { shareholderId: 'USR-104', percentage: 10, equityValue: currentValuation * 0.10, lastDividendPayout: 3000 },
    ],
    aiValuations: [
      { modelName: 'Gemini-3-Flash-Quantum', timestamp: new Date().toISOString(), predictedValue: currentValuation * 1.05, confidenceScore: 0.98, keyDrivers: ['Market Scarcity', 'Institutional Demand'] },
    ],
    riskProfile: {
      riskLevel: index % 5 === 0 ? 'High' : 'Low',
      liquidityScore: 85,
      geopoliticalExposure: 12,
      regulatoryComplianceStatus: 'Compliant',
      mitigationStrategies: ['Dynamic Hedging', 'Multi-jurisdictional Custody'],
    },
    storageLocation: 'Quantum Vault Alpha-1',
    insurancePolicyId: `POL-QF-${index + 5000}`,
    isTokenized: true,
  };
};

const INITIAL_COLLECTIBLES = Array.from({ length: 12 }).map((_, i) => generateMockCollectible(i));

// --- SUB-COMPONENTS ---

const StripeTerminal: React.FC<{ amount: number; onPaymentSuccess: () => void; onCancel: () => void }> = ({ amount, onPaymentSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  const handlePay = async () => {
    setIsProcessing(true);
    setStep('processing');
    // Simulate Stripe API call
    await new Promise(r => setTimeout(r, 2500));
    setStep('success');
    setTimeout(() => {
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: COLORS.card, padding: '2.5rem', borderRadius: '12px',
      boxShadow: '0 0 100px rgba(0,0,0,0.8)', zIndex: 2000, width: '400px',
      border: `1px solid ${COLORS.secondary}`, textAlign: 'center'
    }}>
      {step === 'form' && (
        <>
          <h2 style={{ color: COLORS.secondary, marginBottom: '1rem' }}>Quantum Pay Terminal</h2>
          <p style={{ color: COLORS.textDim, marginBottom: '2rem' }}>Secure Transaction for {formatCurrency(amount)}</p>
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: COLORS.text, fontSize: '0.8rem', marginBottom: '0.5rem' }}>CARD NUMBER</label>
            <div style={{ padding: '1rem', backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '4px', color: COLORS.text }}>
              **** **** **** 4242
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ display: 'block', color: COLORS.text, fontSize: '0.8rem', marginBottom: '0.5rem' }}>EXPIRY</label>
              <input type="text" defaultValue="12/28" style={{ width: '100%', padding: '1rem', backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '4px', color: COLORS.text }} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ display: 'block', color: COLORS.text, fontSize: '0.8rem', marginBottom: '0.5rem' }}>CVC</label>
              <input type="text" defaultValue="***" style={{ width: '100%', padding: '1rem', backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '4px', color: COLORS.text }} />
            </div>
          </div>
          <button onClick={handlePay} style={{
            width: '100%', padding: '1rem', backgroundColor: COLORS.secondary, color: COLORS.primary,
            border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem'
          }}>
            CONFIRM PAYMENT
          </button>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer' }}>Cancel</button>
        </>
      )}
      {step === 'processing' && (
        <div style={{ padding: '3rem 0' }}>
          <div className="spinner" style={{
            width: '50px', height: '50px', border: `5px solid ${COLORS.border}`,
            borderTop: `5px solid ${COLORS.secondary}`, borderRadius: '50%',
            margin: '0 auto 2rem', animation: 'spin 1s linear infinite'
          }} />
          <h3 style={{ color: COLORS.text }}>Verifying with Stripe...</h3>
          <p style={{ color: COLORS.textDim }}>Quantum Encryption in Progress</p>
        </div>
      )}
      {step === 'success' && (
        <div style={{ padding: '3rem 0' }}>
          <div style={{ fontSize: '4rem', color: COLORS.gain, marginBottom: '1rem' }}>✓</div>
          <h3 style={{ color: COLORS.text }}>Payment Successful</h3>
          <p style={{ color: COLORS.textDim }}>Transaction ID: QF-STRIPE-{Math.random().toString(36).toUpperCase().slice(2, 10)}</p>
        </div>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const QuantumAIChat: React.FC<{ onAction: (cmd: string, payload: any) => void }> = ({ onAction }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Welcome to the Quantum Financial Golden Ticket experience. I am your AI Concierge. I can help you 'kick the tires' of our asset engine. Want to create a new Fine Art asset or simulate a market crash?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are the Quantum Financial AI Concierge. 
        The user is in a business demo. 
        You can perform actions by returning a JSON object at the end of your message.
        Available Actions:
        - CREATE_ASSET: { "category": "Fine Art", "name": "AI Masterpiece" }
        - SIMULATE_MARKET: { "trend": "Bullish" }
        - GENERATE_REPORT: { "type": "Risk" }
        
        User said: "${userText}"
        Respond professionally and elite. If they want to create something, include the JSON.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse for JSON commands
      const jsonMatch = text.match(/\{.*\}/s);
      if (jsonMatch) {
        try {
          const cmd = JSON.parse(jsonMatch[0]);
          if (cmd.category) onAction('CREATE_ASSET', cmd);
          if (cmd.trend) onAction('SIMULATE_MARKET', cmd);
        } catch (e) { console.error("AI Command Parse Error", e); }
      }

      setMessages(prev => [...prev, { role: 'ai', text: text.replace(/\{.*\}/s, '').trim() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "I apologize, but my quantum link is currently saturated. Please try again shortly." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      width: '350px', height: '500px', backgroundColor: COLORS.card,
      border: `1px solid ${COLORS.border}`, borderRadius: '12px',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      boxShadow: SHADOWS.default, position: 'fixed', bottom: '80px', right: '20px', zIndex: 1000
    }}>
      <div style={{ padding: '1rem', backgroundColor: COLORS.primary, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS.secondary }} />
        <span style={{ color: COLORS.secondary, fontWeight: 'bold', fontSize: '0.9rem' }}>QUANTUM AI CONCIERGE</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%', padding: '0.75rem', borderRadius: '8px',
            backgroundColor: m.role === 'user' ? COLORS.secondary : COLORS.background,
            color: m.role === 'user' ? COLORS.primary : COLORS.text,
            fontSize: '0.85rem', lineHeight: '1.4'
          }}>
            {m.text}
          </div>
        ))}
        {isTyping && <div style={{ color: COLORS.textDim, fontSize: '0.7rem' }}>AI is calculating...</div>}
        <div ref={chatEndRef} />
      </div>
      <div style={{ padding: '1rem', borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Quantum AI..."
          style={{
            flex: 1, backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`,
            borderRadius: '4px', padding: '0.5rem', color: COLORS.text, outline: 'none'
          }}
        />
        <button onClick={handleSend} style={{
          backgroundColor: COLORS.secondary, color: COLORS.primary, border: 'none',
          borderRadius: '4px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer'
        }}>
          SEND
        </button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const ArtCollectibles: React.FC = () => {
  const [collectibles, setCollectibles] = useState<Collectible[]>(INITIAL_COLLECTIBLES);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [integrationKeys, setIntegrationKeys] = useState<IntegrationKey[]>([
    { id: 'K-1', serviceName: 'SAP ERP', encryptedKey: QuantumVault.encrypt('SAP-SECRET-9921'), lastUsed: '2023-10-24', status: 'Active' },
    { id: 'K-2', serviceName: 'Bloomberg Terminal', encryptedKey: QuantumVault.encrypt('BB-API-KEY-X'), lastUsed: '2023-10-25', status: 'Active' }
  ]);
  const [selectedAsset, setSelectedAsset] = useState<Collectible | null>(null);
  const [showStripe, setShowStripe] = useState<{ active: boolean, amount: number }>({ active: false, amount: 0 });
  const [view, setView] = useState<'inventory' | 'analytics' | 'vault' | 'audit'>('inventory');

  // --- LOGGING SYSTEM ---
  const logAction = useCallback((action: string, details: string, severity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO') => {
    const newLog: AuditEntry = {
      id: `LOG-${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
      timestamp: new Date().toISOString(),
      action,
      user: 'DEMO_USER_GOLDEN_TICKET',
      details,
      severity,
      ipAddress: '192.168.1.104'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  useEffect(() => {
    logAction('SYSTEM_BOOT', 'Quantum Financial Asset Management System Initialized');
  }, [logAction]);

  // --- AI ACTION HANDLER ---
  const handleAIAction = (cmd: string, payload: any) => {
    if (cmd === 'CREATE_ASSET') {
      const newAsset = generateMockCollectible(collectibles.length);
      newAsset.name = payload.name || newAsset.name;
      newAsset.category = payload.category || newAsset.category;
      setCollectibles(prev => [newAsset, ...prev]);
      logAction('AI_ASSET_CREATION', `AI created new asset: ${newAsset.name}`);
    } else if (cmd === 'SIMULATE_MARKET') {
      const factor = payload.trend === 'Bullish' ? 1.1 : 0.9;
      setCollectibles(prev => prev.map(c => ({ ...c, currentValuation: Math.round(c.currentValuation * factor) })));
      logAction('AI_MARKET_SIMULATION', `AI simulated a ${payload.trend} market shift`);
    }
  };

  // --- ANALYTICS CALCULATIONS ---
  const portfolioSummary = useMemo((): PortfolioSummary => {
    const totalAcquisitionValue = collectibles.reduce((sum, c) => sum + c.acquisitionPrice, 0);
    const totalCurrentValue = collectibles.reduce((sum, c) => sum + c.currentValuation, 0);
    const totalGainLoss = totalCurrentValue - totalAcquisitionValue;
    const totalGainLossPercentage = (totalGainLoss / totalAcquisitionValue) * 100;

    return {
      totalAcquisitionValue,
      totalCurrentValue,
      totalGainLoss,
      totalGainLossPercentage,
      aiOptimizedAllocation: { 'Fine Art': 30, 'Digital Asset': 20, 'Luxury Watch': 15 },
      overallRisk: 'Low',
      marketSentiment: 'Bullish'
    };
  }, [collectibles]);

  // --- RENDER HELPERS ---

  const renderInventory = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
      {collectibles.map(asset => (
        <div key={asset.id} 
          onClick={() => setSelectedAsset(asset)}
          style={{
            backgroundColor: COLORS.card, borderRadius: '12px', overflow: 'hidden',
            border: `1px solid ${COLORS.border}`, cursor: 'pointer', transition: 'all 0.3s ease',
            boxShadow: SHADOWS.default
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = COLORS.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = COLORS.border;
          }}
        >
          <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
            <img src={asset.imageUrl} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', top: '10px', right: '10px', padding: '0.4rem 0.8rem',
              backgroundColor: asset.riskProfile.riskLevel === 'Low' ? COLORS.gain : COLORS.loss,
              color: COLORS.primary, borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold'
            }}>
              {asset.riskProfile.riskLevel} RISK
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: COLORS.text, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{asset.name}</h3>
            <p style={{ color: COLORS.textDim, fontSize: '0.8rem', marginBottom: '1rem' }}>{asset.category} • {asset.id}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: COLORS.textDim, fontSize: '0.7rem' }}>CURRENT VALUATION</p>
                <p style={{ color: COLORS.secondary, fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCurrency(asset.currentValuation)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: COLORS.textDim, fontSize: '0.7rem' }}>PERFORMANCE</p>
                <p style={{ color: asset.currentValuation > asset.acquisitionPrice ? COLORS.gain : COLORS.loss, fontWeight: 'bold' }}>
                  {((asset.currentValuation - asset.acquisitionPrice) / asset.acquisitionPrice * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ color: COLORS.secondary, marginBottom: '1.5rem' }}>Portfolio Performance</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <p style={{ color: COLORS.textDim, fontSize: '0.9rem' }}>Total Assets Under Management</p>
            <p style={{ color: COLORS.text, fontSize: '2.5rem', fontWeight: 'bold' }}>{formatCurrency(portfolioSummary.totalCurrentValue)}</p>
          </div>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            {[40, 65, 55, 80, 95, 75, 100].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: COLORS.secondary, borderRadius: '4px 4px 0 0', opacity: 0.7 }} />
            ))}
          </div>
          <p style={{ color: COLORS.textDim, fontSize: '0.8rem', textAlign: 'center' }}>7-Day Quantum Market Trend</p>
        </div>
      </div>
      <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ color: COLORS.secondary, marginBottom: '1.5rem' }}>AI Allocation Targets</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(portfolioSummary.aiOptimizedAllocation).map(([cat, val]) => (
            <div key={cat}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: COLORS.text, fontSize: '0.9rem' }}>{cat}</span>
                <span style={{ color: COLORS.secondary, fontSize: '0.9rem' }}>{val}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: COLORS.background, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${val}%`, height: '100%', backgroundColor: COLORS.secondary }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVault = () => (
    <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: COLORS.secondary }}>Quantum Homomorphic Vault</h3>
        <button style={{
          padding: '0.5rem 1rem', backgroundColor: COLORS.secondary, color: COLORS.primary,
          border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
        }}>
          + ADD INTEGRATION
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: `1px solid ${COLORS.border}` }}>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>SERVICE</th>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>ENCRYPTED KEY (HOMOMORPHIC)</th>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>STATUS</th>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {integrationKeys.map(key => (
            <tr key={key.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <td style={{ padding: '1rem', color: COLORS.text, fontWeight: 'bold' }}>{key.serviceName}</td>
              <td style={{ padding: '1rem', color: COLORS.textDim, fontFamily: 'monospace', fontSize: '0.8rem' }}>{key.encryptedKey}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ padding: '0.2rem 0.5rem', backgroundColor: COLORS.gain, color: COLORS.primary, borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {key.status}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <button 
                  onClick={() => {
                    const decrypted = QuantumVault.decrypt(key.encryptedKey);
                    alert(`DEMO ONLY: Decrypted Key: ${decrypted}`);
                    logAction('VAULT_KEY_DECRYPTION', `User manually decrypted key for ${key.serviceName}`, 'WARN');
                  }}
                  style={{ background: 'none', border: `1px solid ${COLORS.secondary}`, color: COLORS.secondary, padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
                  REVEAL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAudit = () => (
    <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
      <h3 style={{ color: COLORS.secondary, marginBottom: '1.5rem' }}>Immutable Audit Ledger</h3>
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {auditLogs.map(log => (
          <div key={log.id} style={{
            padding: '1rem', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', gap: '1.5rem',
            backgroundColor: log.severity === 'CRITICAL' ? 'rgba(194, 54, 22, 0.1)' : 'transparent'
          }}>
            <div style={{ color: COLORS.textDim, fontSize: '0.75rem', minWidth: '150px' }}>{new Date(log.timestamp).toLocaleString()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: log.severity === 'CRITICAL' ? COLORS.critical : COLORS.secondary, fontWeight: 'bold', fontSize: '0.9rem' }}>{log.action}</div>
              <div style={{ color: COLORS.text, fontSize: '0.85rem' }}>{log.details}</div>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: '0.75rem' }}>{log.ipAddress}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: COLORS.background, color: COLORS.text, minHeight: '100vh',
      fontFamily: "'Inter', sans-serif", padding: '0 0 100px 0'
    }}>
      {/* TOP NAVIGATION */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.5rem 3rem', backgroundColor: COLORS.primary, borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: COLORS.secondary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: COLORS.primary, fontSize: '1.5rem' }}>Q</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px', color: COLORS.text }}>QUANTUM <span style={{ color: COLORS.secondary }}>FINANCIAL</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['inventory', 'analytics', 'vault', 'audit'].map(v => (
            <button key={v} 
              onClick={() => setView(v as any)}
              style={{
                background: 'none', border: 'none', color: view === v ? COLORS.secondary : COLORS.textDim,
                fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', textTransform: 'uppercase',
                borderBottom: view === v ? `2px solid ${COLORS.secondary}` : '2px solid transparent',
                paddingBottom: '0.5rem', transition: 'all 0.3s'
              }}>
              {v}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: COLORS.textDim }}>SECURE SESSION</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: COLORS.gain }}>ACTIVE</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.border, border: `2px solid ${COLORS.secondary}` }} />
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={{ padding: '3rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: COLORS.text, marginBottom: '0.5rem' }}>
            {view === 'inventory' && "Global Asset Inventory"}
            {view === 'analytics' && "Quantum Intelligence Dashboard"}
            {view === 'vault' && "Secure Integration Vault"}
            {view === 'audit' && "Compliance & Audit Trail"}
          </h2>
          <p style={{ color: COLORS.textDim, fontSize: '1.1rem' }}>
            Welcome to your Golden Ticket experience. Kick the tires of the world's most advanced financial engine.
          </p>
        </header>

        {view === 'inventory' && renderInventory()}
        {view === 'analytics' && renderAnalytics()}
        {view === 'vault' && renderVault()}
        {view === 'audit' && renderAudit()}
      </main>

      {/* ASSET DETAIL MODAL */}
      {selectedAsset && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(2, 12, 27, 0.95)', zIndex: 1500, display: 'flex',
          justifyContent: 'center', alignItems: 'center', padding: '2rem'
        }}>
          <div style={{
            backgroundColor: COLORS.card, width: '1000px', maxHeight: '90vh',
            borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden',
            display: 'flex', boxShadow: '0 0 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <img src={selectedAsset.imageUrl} alt={selectedAsset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setSelectedAsset(null)} style={{
                position: 'absolute', top: '20px', left: '20px', backgroundColor: COLORS.primary,
                color: COLORS.text, border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                cursor: 'pointer', fontSize: '1.2rem'
              }}>✕</button>
            </div>
            <div style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
              <h2 style={{ color: COLORS.secondary, fontSize: '2rem', marginBottom: '1rem' }}>{selectedAsset.name}</h2>
              <p style={{ color: COLORS.textDim, marginBottom: '2rem', lineHeight: '1.6' }}>{selectedAsset.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <p style={{ color: COLORS.textDim, fontSize: '0.8rem' }}>ACQUISITION PRICE</p>
                  <p style={{ color: COLORS.text, fontSize: '1.2rem', fontWeight: 'bold' }}>{formatCurrency(selectedAsset.acquisitionPrice)}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.textDim, fontSize: '0.8rem' }}>CURRENT VALUATION</p>
                  <p style={{ color: COLORS.secondary, fontSize: '1.2rem', fontWeight: 'bold' }}>{formatCurrency(selectedAsset.currentValuation)}</p>
                </div>
              </div>

              <div style={{ backgroundColor: COLORS.background, padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h4 style={{ color: COLORS.text, marginBottom: '1rem', fontSize: '0.9rem' }}>AI VALUATION INSIGHT</h4>
                <p style={{ color: COLORS.textDim, fontSize: '0.85rem' }}>
                  Model: {selectedAsset.aiValuations[0].modelName}<br/>
                  Confidence: {(selectedAsset.aiValuations[0].confidenceScore * 100).toFixed(1)}%<br/>
                  Drivers: {selectedAsset.aiValuations[0].keyDrivers.join(', ')}
                </p>
              </div>

              <button 
                onClick={() => {
                  setShowStripe({ active: true, amount: selectedAsset.currentValuation });
                  logAction('STRIPE_CHECKOUT_INITIATED', `User initiated purchase for ${selectedAsset.name}`);
                }}
                style={{
                  width: '100%', padding: '1.2rem', backgroundColor: COLORS.secondary, color: COLORS.primary,
                  border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer'
                }}>
                ACQUIRE ADDITIONAL SHARES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRIPE MODAL */}
      {showStripe.active && (
        <StripeTerminal 
          amount={showStripe.amount} 
          onPaymentSuccess={() => {
            setShowStripe({ active: false, amount: 0 });
            logAction('STRIPE_PAYMENT_COMPLETED', `Successfully processed payment for ${formatCurrency(showStripe.amount)}`);
          }}
          onCancel={() => setShowStripe({ active: false, amount: 0 })}
        />
      )}

      {/* AI CHATBOT */}
      <QuantumAIChat onAction={handleAIAction} />

      {/* FOOTER STATUS BAR */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%',
        backgroundColor: COLORS.primary, borderTop: `1px solid ${COLORS.border}`,
        padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontSize: '0.75rem', color: COLORS.textDim, zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span>SYSTEM: <span style={{ color: COLORS.gain }}>OPTIMAL</span></span>
          <span>ENCRYPTION: <span style={{ color: COLORS.secondary }}>QUANTUM-HOMOMORPHIC</span></span>
          <span>AUDIT STORAGE: <span style={{ color: COLORS.secondary }}>IMMUTABLE</span></span>
        </div>
        <div>
          © 2024 QUANTUM FINANCIAL GROUP • GLOBAL ASSET DEMO v4.2.0
        </div>
      </footer>
    </div>
  );
};

export default ArtCollectibles;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/ArtCollectibles.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * QUANTUM FINANCIAL - ELITE ASSET MANAGEMENT SYSTEM
 * "The Golden Ticket Experience"
 * 
 * PHILOSOPHY:
 * - High-Performance, Secure, Professional.
 * - "Kick the tires" - Full interactivity.
 * - "Bells and Whistles" - AI, Homomorphic Encryption, Stripe, Audit Logs.
 * 
 * SECURITY:
 * - Homomorphic Encryption Simulation for Integration Keys.
 * - Multi-factor Authentication Simulation.
 * - Real-time Fraud Monitoring.
 * - Immutable Audit Storage.
 */

// --- TYPES & INTERFACES ---

type CollectibleCategory = 'Fine Art' | 'Vintage Wine' | 'Rare Collectible' | 'Luxury Watch' | 'Digital Asset' | 'Real Estate Token' | 'Precious Metal';
type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type MarketTrend = 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  ipAddress: string;
}

interface IntegrationKey {
  id: string;
  serviceName: string;
  encryptedKey: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
}

interface ProvenanceRecord {
  date: string;
  ownerName: string;
  transactionType: 'Acquisition' | 'Sale' | 'Transfer' | 'Authentication';
  location: string;
  transactionValue: number;
  documentHash: string;
}

interface FractionalShare {
  shareholderId: string;
  percentage: number;
  equityValue: number;
  lastDividendPayout: number;
}

interface AI_Valuation {
  modelName: string;
  timestamp: string;
  predictedValue: number;
  confidenceScore: number;
  keyDrivers: string[];
}

interface RiskAssessment {
  riskLevel: RiskLevel;
  liquidityScore: number;
  geopoliticalExposure: number;
  regulatoryComplianceStatus: 'Compliant' | 'Pending Review' | 'High Risk';
  mitigationStrategies: string[];
}

interface Collectible {
  id: string;
  name: string;
  category: CollectibleCategory;
  assetClassId: string;
  imageUrl: string;
  acquisitionPrice: number;
  currentValuation: number;
  acquisitionDate: string;
  description: string;
  provenance: ProvenanceRecord[];
  fractionalShares: FractionalShare[];
  aiValuations: AI_Valuation[];
  riskProfile: RiskAssessment;
  storageLocation: string;
  insurancePolicyId: string;
  isTokenized: boolean;
}

interface PortfolioSummary {
  totalAcquisitionValue: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  aiOptimizedAllocation: { [key in CollectibleCategory]?: number };
  overallRisk: RiskLevel;
  marketSentiment: MarketTrend;
}

// --- CONSTANTS & STYLING ---

const COLORS = {
  primary: '#0A192F', // Deep Navy
  secondary: '#64FFDA', // Quantum Teal
  accent: '#F7B731', // Gold
  background: '#020C1B', // Darker Navy
  card: '#112240', // Lighter Navy
  text: '#CCD6F6',
  textDim: '#8892B0',
  gain: '#4CD137',
  loss: '#E84118',
  warning: '#FBC531',
  critical: '#C23616',
  border: '#233554',
};

const SHADOWS = {
  default: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
  hover: '0 20px 30px -15px rgba(2, 12, 27, 0.7)',
};

// --- UTILITIES ---

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// --- HOMOMORPHIC ENCRYPTION SIMULATION ---
// This simulates the ability to perform operations on encrypted data without decrypting it.
const QuantumVault = {
  encrypt: (text: string): string => {
    const b64 = btoa(text);
    return `ENC_${b64.split('').reverse().join('')}_QNTM`;
  },
  decrypt: (cipher: string): string => {
    if (!cipher.startsWith('ENC_')) return cipher;
    const core = cipher.replace('ENC_', '').replace('_QNTM', '');
    const reversed = core.split('').reverse().join('');
    return atob(reversed);
  },
  // Simulated homomorphic addition: E(a) + E(b) = E(a+b)
  homomorphicSum: (cipherA: string, cipherB: string): string => {
    const valA = parseFloat(QuantumVault.decrypt(cipherA)) || 0;
    const valB = parseFloat(QuantumVault.decrypt(cipherB)) || 0;
    return QuantumVault.encrypt((valA + valB).toString());
  }
};

// --- MOCK DATA GENERATOR ---

const generateMockCollectible = (index: number): Collectible => {
  const categories: CollectibleCategory[] = ['Fine Art', 'Vintage Wine', 'Luxury Watch', 'Digital Asset', 'Real Estate Token', 'Precious Metal', 'Rare Collectible'];
  const category = categories[index % categories.length];
  const basePrice = 250000 + (index * 75000);
  const valuationFactor = 1.1 + (Math.random() * 0.8);
  const currentValuation = Math.round(basePrice * valuationFactor);
  
  return {
    id: `QF-ASSET-${String(index + 1000).padStart(5, '0')}`,
    name: `Quantum ${category} Elite #${index + 1}`,
    category: category,
    assetClassId: `CLASS-${category.substring(0, 3).toUpperCase()}`,
    imageUrl: `https://picsum.photos/seed/${index + 42}/800/600`,
    acquisitionPrice: basePrice,
    currentValuation: currentValuation,
    acquisitionDate: `202${Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 11) + 1).padStart(2, '0')}-15`,
    description: `A high-yield ${category} asset managed within the Quantum Financial ecosystem. This asset leverages real-time market data and AI-driven valuation models to ensure maximum liquidity and capital preservation.`,
    provenance: [
      { date: '2018-05-20', ownerName: 'Global Heritage Fund', transactionType: 'Acquisition', location: 'London Vault', transactionValue: basePrice * 0.8, documentHash: '0x77a...f21' },
      { date: '2021-11-12', ownerName: 'Quantum Financial', transactionType: 'Acquisition', location: 'Singapore Secure Storage', transactionValue: basePrice, documentHash: `0x${Math.random().toString(16).slice(2, 10)}...` },
    ],
    fractionalShares: [
      { shareholderId: 'USR-992', percentage: 15, equityValue: currentValuation * 0.15, lastDividendPayout: 4500 },
      { shareholderId: 'USR-104', percentage: 10, equityValue: currentValuation * 0.10, lastDividendPayout: 3000 },
    ],
    aiValuations: [
      { modelName: 'Gemini-3-Flash-Quantum', timestamp: new Date().toISOString(), predictedValue: currentValuation * 1.05, confidenceScore: 0.98, keyDrivers: ['Market Scarcity', 'Institutional Demand'] },
    ],
    riskProfile: {
      riskLevel: index % 5 === 0 ? 'High' : 'Low',
      liquidityScore: 85,
      geopoliticalExposure: 12,
      regulatoryComplianceStatus: 'Compliant',
      mitigationStrategies: ['Dynamic Hedging', 'Multi-jurisdictional Custody'],
    },
    storageLocation: 'Quantum Vault Alpha-1',
    insurancePolicyId: `POL-QF-${index + 5000}`,
    isTokenized: true,
  };
};

const INITIAL_COLLECTIBLES = Array.from({ length: 12 }).map((_, i) => generateMockCollectible(i));

// --- SUB-COMPONENTS ---

const StripeTerminal: React.FC<{ amount: number; onPaymentSuccess: () => void; onCancel: () => void }> = ({ amount, onPaymentSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  const handlePay = async () => {
    setIsProcessing(true);
    setStep('processing');
    // Simulate Stripe API call
    await new Promise(r => setTimeout(r, 2500));
    setStep('success');
    setTimeout(() => {
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: COLORS.card, padding: '2.5rem', borderRadius: '12px',
      boxShadow: '0 0 100px rgba(0,0,0,0.8)', zIndex: 2000, width: '400px',
      border: `1px solid ${COLORS.secondary}`, textAlign: 'center'
    }}>
      {step === 'form' && (
        <>
          <h2 style={{ color: COLORS.secondary, marginBottom: '1rem' }}>Quantum Pay Terminal</h2>
          <p style={{ color: COLORS.textDim, marginBottom: '2rem' }}>Secure Transaction for {formatCurrency(amount)}</p>
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: COLORS.text, fontSize: '0.8rem', marginBottom: '0.5rem' }}>CARD NUMBER</label>
            <div style={{ padding: '1rem', backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '4px', color: COLORS.text }}>
              **** **** **** 4242
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ display: 'block', color: COLORS.text, fontSize: '0.8rem', marginBottom: '0.5rem' }}>EXPIRY</label>
              <input type="text" defaultValue="12/28" style={{ width: '100%', padding: '1rem', backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '4px', color: COLORS.text }} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ display: 'block', color: COLORS.text, fontSize: '0.8rem', marginBottom: '0.5rem' }}>CVC</label>
              <input type="text" defaultValue="***" style={{ width: '100%', padding: '1rem', backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '4px', color: COLORS.text }} />
            </div>
          </div>
          <button onClick={handlePay} style={{
            width: '100%', padding: '1rem', backgroundColor: COLORS.secondary, color: COLORS.primary,
            border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem'
          }}>
            CONFIRM PAYMENT
          </button>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer' }}>Cancel</button>
        </>
      )}
      {step === 'processing' && (
        <div style={{ padding: '3rem 0' }}>
          <div className="spinner" style={{
            width: '50px', height: '50px', border: `5px solid ${COLORS.border}`,
            borderTop: `5px solid ${COLORS.secondary}`, borderRadius: '50%',
            margin: '0 auto 2rem', animation: 'spin 1s linear infinite'
          }} />
          <h3 style={{ color: COLORS.text }}>Verifying with Stripe...</h3>
          <p style={{ color: COLORS.textDim }}>Quantum Encryption in Progress</p>
        </div>
      )}
      {step === 'success' && (
        <div style={{ padding: '3rem 0' }}>
          <div style={{ fontSize: '4rem', color: COLORS.gain, marginBottom: '1rem' }}>✓</div>
          <h3 style={{ color: COLORS.text }}>Payment Successful</h3>
          <p style={{ color: COLORS.textDim }}>Transaction ID: QF-STRIPE-{Math.random().toString(36).toUpperCase().slice(2, 10)}</p>
        </div>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const QuantumAIChat: React.FC<{ onAction: (cmd: string, payload: any) => void }> = ({ onAction }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Welcome to the Quantum Financial Golden Ticket experience. I am your AI Concierge. I can help you 'kick the tires' of our asset engine. Want to create a new Fine Art asset or simulate a market crash?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are the Quantum Financial AI Concierge. 
        The user is in a business demo. 
        You can perform actions by returning a JSON object at the end of your message.
        Available Actions:
        - CREATE_ASSET: { "category": "Fine Art", "name": "AI Masterpiece" }
        - SIMULATE_MARKET: { "trend": "Bullish" }
        - GENERATE_REPORT: { "type": "Risk" }
        
        User said: "${userText}"
        Respond professionally and elite. If they want to create something, include the JSON.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse for JSON commands
      const jsonMatch = text.match(/\{.*\}/s);
      if (jsonMatch) {
        try {
          const cmd = JSON.parse(jsonMatch[0]);
          if (cmd.category) onAction('CREATE_ASSET', cmd);
          if (cmd.trend) onAction('SIMULATE_MARKET', cmd);
        } catch (e) { console.error("AI Command Parse Error", e); }
      }

      setMessages(prev => [...prev, { role: 'ai', text: text.replace(/\{.*\}/s, '').trim() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "I apologize, but my quantum link is currently saturated. Please try again shortly." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      width: '350px', height: '500px', backgroundColor: COLORS.card,
      border: `1px solid ${COLORS.border}`, borderRadius: '12px',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      boxShadow: SHADOWS.default, position: 'fixed', bottom: '80px', right: '20px', zIndex: 1000
    }}>
      <div style={{ padding: '1rem', backgroundColor: COLORS.primary, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS.secondary }} />
        <span style={{ color: COLORS.secondary, fontWeight: 'bold', fontSize: '0.9rem' }}>QUANTUM AI CONCIERGE</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%', padding: '0.75rem', borderRadius: '8px',
            backgroundColor: m.role === 'user' ? COLORS.secondary : COLORS.background,
            color: m.role === 'user' ? COLORS.primary : COLORS.text,
            fontSize: '0.85rem', lineHeight: '1.4'
          }}>
            {m.text}
          </div>
        ))}
        {isTyping && <div style={{ color: COLORS.textDim, fontSize: '0.7rem' }}>AI is calculating...</div>}
        <div ref={chatEndRef} />
      </div>
      <div style={{ padding: '1rem', borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Quantum AI..."
          style={{
            flex: 1, backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`,
            borderRadius: '4px', padding: '0.5rem', color: COLORS.text, outline: 'none'
          }}
        />
        <button onClick={handleSend} style={{
          backgroundColor: COLORS.secondary, color: COLORS.primary, border: 'none',
          borderRadius: '4px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer'
        }}>
          SEND
        </button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const ArtCollectibles: React.FC = () => {
  const [collectibles, setCollectibles] = useState<Collectible[]>(INITIAL_COLLECTIBLES);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [integrationKeys, setIntegrationKeys] = useState<IntegrationKey[]>([
    { id: 'K-1', serviceName: 'SAP ERP', encryptedKey: QuantumVault.encrypt('SAP-SECRET-9921'), lastUsed: '2023-10-24', status: 'Active' },
    { id: 'K-2', serviceName: 'Bloomberg Terminal', encryptedKey: QuantumVault.encrypt('BB-API-KEY-X'), lastUsed: '2023-10-25', status: 'Active' }
  ]);
  const [selectedAsset, setSelectedAsset] = useState<Collectible | null>(null);
  const [showStripe, setShowStripe] = useState<{ active: boolean, amount: number }>({ active: false, amount: 0 });
  const [view, setView] = useState<'inventory' | 'analytics' | 'vault' | 'audit'>('inventory');

  // --- LOGGING SYSTEM ---
  const logAction = useCallback((action: string, details: string, severity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO') => {
    const newLog: AuditEntry = {
      id: `LOG-${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
      timestamp: new Date().toISOString(),
      action,
      user: 'DEMO_USER_GOLDEN_TICKET',
      details,
      severity,
      ipAddress: '192.168.1.104'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  useEffect(() => {
    logAction('SYSTEM_BOOT', 'Quantum Financial Asset Management System Initialized');
  }, [logAction]);

  // --- AI ACTION HANDLER ---
  const handleAIAction = (cmd: string, payload: any) => {
    if (cmd === 'CREATE_ASSET') {
      const newAsset = generateMockCollectible(collectibles.length);
      newAsset.name = payload.name || newAsset.name;
      newAsset.category = payload.category || newAsset.category;
      setCollectibles(prev => [newAsset, ...prev]);
      logAction('AI_ASSET_CREATION', `AI created new asset: ${newAsset.name}`);
    } else if (cmd === 'SIMULATE_MARKET') {
      const factor = payload.trend === 'Bullish' ? 1.1 : 0.9;
      setCollectibles(prev => prev.map(c => ({ ...c, currentValuation: Math.round(c.currentValuation * factor) })));
      logAction('AI_MARKET_SIMULATION', `AI simulated a ${payload.trend} market shift`);
    }
  };

  // --- ANALYTICS CALCULATIONS ---
  const portfolioSummary = useMemo((): PortfolioSummary => {
    const totalAcquisitionValue = collectibles.reduce((sum, c) => sum + c.acquisitionPrice, 0);
    const totalCurrentValue = collectibles.reduce((sum, c) => sum + c.currentValuation, 0);
    const totalGainLoss = totalCurrentValue - totalAcquisitionValue;
    const totalGainLossPercentage = (totalGainLoss / totalAcquisitionValue) * 100;

    return {
      totalAcquisitionValue,
      totalCurrentValue,
      totalGainLoss,
      totalGainLossPercentage,
      aiOptimizedAllocation: { 'Fine Art': 30, 'Digital Asset': 20, 'Luxury Watch': 15 },
      overallRisk: 'Low',
      marketSentiment: 'Bullish'
    };
  }, [collectibles]);

  // --- RENDER HELPERS ---

  const renderInventory = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
      {collectibles.map(asset => (
        <div key={asset.id} 
          onClick={() => setSelectedAsset(asset)}
          style={{
            backgroundColor: COLORS.card, borderRadius: '12px', overflow: 'hidden',
            border: `1px solid ${COLORS.border}`, cursor: 'pointer', transition: 'all 0.3s ease',
            boxShadow: SHADOWS.default
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = COLORS.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = COLORS.border;
          }}
        >
          <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
            <img src={asset.imageUrl} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', top: '10px', right: '10px', padding: '0.4rem 0.8rem',
              backgroundColor: asset.riskProfile.riskLevel === 'Low' ? COLORS.gain : COLORS.loss,
              color: COLORS.primary, borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold'
            }}>
              {asset.riskProfile.riskLevel} RISK
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: COLORS.text, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{asset.name}</h3>
            <p style={{ color: COLORS.textDim, fontSize: '0.8rem', marginBottom: '1rem' }}>{asset.category} • {asset.id}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: COLORS.textDim, fontSize: '0.7rem' }}>CURRENT VALUATION</p>
                <p style={{ color: COLORS.secondary, fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCurrency(asset.currentValuation)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: COLORS.textDim, fontSize: '0.7rem' }}>PERFORMANCE</p>
                <p style={{ color: asset.currentValuation > asset.acquisitionPrice ? COLORS.gain : COLORS.loss, fontWeight: 'bold' }}>
                  {((asset.currentValuation - asset.acquisitionPrice) / asset.acquisitionPrice * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ color: COLORS.secondary, marginBottom: '1.5rem' }}>Portfolio Performance</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <p style={{ color: COLORS.textDim, fontSize: '0.9rem' }}>Total Assets Under Management</p>
            <p style={{ color: COLORS.text, fontSize: '2.5rem', fontWeight: 'bold' }}>{formatCurrency(portfolioSummary.totalCurrentValue)}</p>
          </div>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            {[40, 65, 55, 80, 95, 75, 100].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: COLORS.secondary, borderRadius: '4px 4px 0 0', opacity: 0.7 }} />
            ))}
          </div>
          <p style={{ color: COLORS.textDim, fontSize: '0.8rem', textAlign: 'center' }}>7-Day Quantum Market Trend</p>
        </div>
      </div>
      <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ color: COLORS.secondary, marginBottom: '1.5rem' }}>AI Allocation Targets</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(portfolioSummary.aiOptimizedAllocation).map(([cat, val]) => (
            <div key={cat}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: COLORS.text, fontSize: '0.9rem' }}>{cat}</span>
                <span style={{ color: COLORS.secondary, fontSize: '0.9rem' }}>{val}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: COLORS.background, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${val}%`, height: '100%', backgroundColor: COLORS.secondary }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVault = () => (
    <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: COLORS.secondary }}>Quantum Homomorphic Vault</h3>
        <button style={{
          padding: '0.5rem 1rem', backgroundColor: COLORS.secondary, color: COLORS.primary,
          border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
        }}>
          + ADD INTEGRATION
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: `1px solid ${COLORS.border}` }}>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>SERVICE</th>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>ENCRYPTED KEY (HOMOMORPHIC)</th>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>STATUS</th>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {integrationKeys.map(key => (
            <tr key={key.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <td style={{ padding: '1rem', color: COLORS.text, fontWeight: 'bold' }}>{key.serviceName}</td>
              <td style={{ padding: '1rem', color: COLORS.textDim, fontFamily: 'monospace', fontSize: '0.8rem' }}>{key.encryptedKey}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ padding: '0.2rem 0.5rem', backgroundColor: COLORS.gain, color: COLORS.primary, borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {key.status}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <button 
                  onClick={() => {
                    const decrypted = QuantumVault.decrypt(key.encryptedKey);
                    alert(`DEMO ONLY: Decrypted Key: ${decrypted}`);
                    logAction('VAULT_KEY_DECRYPTION', `User manually decrypted key for ${key.serviceName}`, 'WARN');
                  }}
                  style={{ background: 'none', border: `1px solid ${COLORS.secondary}`, color: COLORS.secondary, padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
                  REVEAL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAudit = () => (
    <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
      <h3 style={{ color: COLORS.secondary, marginBottom: '1.5rem' }}>Immutable Audit Ledger</h3>
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {auditLogs.map(log => (
          <div key={log.id} style={{
            padding: '1rem', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', gap: '1.5rem',
            backgroundColor: log.severity === 'CRITICAL' ? 'rgba(194, 54, 22, 0.1)' : 'transparent'
          }}>
            <div style={{ color: COLORS.textDim, fontSize: '0.75rem', minWidth: '150px' }}>{new Date(log.timestamp).toLocaleString()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: log.severity === 'CRITICAL' ? COLORS.critical : COLORS.secondary, fontWeight: 'bold', fontSize: '0.9rem' }}>{log.action}</div>
              <div style={{ color: COLORS.text, fontSize: '0.85rem' }}>{log.details}</div>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: '0.75rem' }}>{log.ipAddress}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: COLORS.background, color: COLORS.text, minHeight: '100vh',
      fontFamily: "'Inter', sans-serif", padding: '0 0 100px 0'
    }}>
      {/* TOP NAVIGATION */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.5rem 3rem', backgroundColor: COLORS.primary, borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: COLORS.secondary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: COLORS.primary, fontSize: '1.5rem' }}>Q</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px', color: COLORS.text }}>QUANTUM <span style={{ color: COLORS.secondary }}>FINANCIAL</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['inventory', 'analytics', 'vault', 'audit'].map(v => (
            <button key={v} 
              onClick={() => setView(v as any)}
              style={{
                background: 'none', border: 'none', color: view === v ? COLORS.secondary : COLORS.textDim,
                fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', textTransform: 'uppercase',
                borderBottom: view === v ? `2px solid ${COLORS.secondary}` : '2px solid transparent',
                paddingBottom: '0.5rem', transition: 'all 0.3s'
              }}>
              {v}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: COLORS.textDim }}>SECURE SESSION</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: COLORS.gain }}>ACTIVE</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.border, border: `2px solid ${COLORS.secondary}` }} />
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={{ padding: '3rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: COLORS.text, marginBottom: '0.5rem' }}>
            {view === 'inventory' && "Global Asset Inventory"}
            {view === 'analytics' && "Quantum Intelligence Dashboard"}
            {view === 'vault' && "Secure Integration Vault"}
            {view === 'audit' && "Compliance & Audit Trail"}
          </h2>
          <p style={{ color: COLORS.textDim, fontSize: '1.1rem' }}>
            Welcome to your Golden Ticket experience. Kick the tires of the world's most advanced financial engine.
          </p>
        </header>

        {view === 'inventory' && renderInventory()}
        {view === 'analytics' && renderAnalytics()}
        {view === 'vault' && renderVault()}
        {view === 'audit' && renderAudit()}
      </main>

      {/* ASSET DETAIL MODAL */}
      {selectedAsset && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(2, 12, 27, 0.95)', zIndex: 1500, display: 'flex',
          justifyContent: 'center', alignItems: 'center', padding: '2rem'
        }}>
          <div style={{
            backgroundColor: COLORS.card, width: '1000px', maxHeight: '90vh',
            borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden',
            display: 'flex', boxShadow: '0 0 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <img src={selectedAsset.imageUrl} alt={selectedAsset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setSelectedAsset(null)} style={{
                position: 'absolute', top: '20px', left: '20px', backgroundColor: COLORS.primary,
                color: COLORS.text, border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                cursor: 'pointer', fontSize: '1.2rem'
              }}>✕</button>
            </div>
            <div style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
              <h2 style={{ color: COLORS.secondary, fontSize: '2rem', marginBottom: '1rem' }}>{selectedAsset.name}</h2>
              <p style={{ color: COLORS.textDim, marginBottom: '2rem', lineHeight: '1.6' }}>{selectedAsset.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <p style={{ color: COLORS.textDim, fontSize: '0.8rem' }}>ACQUISITION PRICE</p>
                  <p style={{ color: COLORS.text, fontSize: '1.2rem', fontWeight: 'bold' }}>{formatCurrency(selectedAsset.acquisitionPrice)}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.textDim, fontSize: '0.8rem' }}>CURRENT VALUATION</p>
                  <p style={{ color: COLORS.secondary, fontSize: '1.2rem', fontWeight: 'bold' }}>{formatCurrency(selectedAsset.currentValuation)}</p>
                </div>
              </div>

              <div style={{ backgroundColor: COLORS.background, padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h4 style={{ color: COLORS.text, marginBottom: '1rem', fontSize: '0.9rem' }}>AI VALUATION INSIGHT</h4>
                <p style={{ color: COLORS.textDim, fontSize: '0.85rem' }}>
                  Model: {selectedAsset.aiValuations[0].modelName}<br/>
                  Confidence: {(selectedAsset.aiValuations[0].confidenceScore * 100).toFixed(1)}%<br/>
                  Drivers: {selectedAsset.aiValuations[0].keyDrivers.join(', ')}
                </p>
              </div>

              <button 
                onClick={() => {
                  setShowStripe({ active: true, amount: selectedAsset.currentValuation });
                  logAction('STRIPE_CHECKOUT_INITIATED', `User initiated purchase for ${selectedAsset.name}`);
                }}
                style={{
                  width: '100%', padding: '1.2rem', backgroundColor: COLORS.secondary, color: COLORS.primary,
                  border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer'
                }}>
                ACQUIRE ADDITIONAL SHARES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRIPE MODAL */}
      {showStripe.active && (
        <StripeTerminal 
          amount={showStripe.amount} 
          onPaymentSuccess={() => {
            setShowStripe({ active: false, amount: 0 });
            logAction('STRIPE_PAYMENT_COMPLETED', `Successfully processed payment for ${formatCurrency(showStripe.amount)}`);
          }}
          onCancel={() => setShowStripe({ active: false, amount: 0 })}
        />
      )}

      {/* AI CHATBOT */}
      <QuantumAIChat onAction={handleAIAction} />

      {/* FOOTER STATUS BAR */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%',
        backgroundColor: COLORS.primary, borderTop: `1px solid ${COLORS.border}`,
        padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontSize: '0.75rem', color: COLORS.textDim, zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span>SYSTEM: <span style={{ color: COLORS.gain }}>OPTIMAL</span></span>
          <span>ENCRYPTION: <span style={{ color: COLORS.secondary }}>QUANTUM-HOMOMORPHIC</span></span>
          <span>AUDIT STORAGE: <span style={{ color: COLORS.secondary }}>IMMUTABLE</span></span>
        </div>
        <div>
          © 2024 QUANTUM FINANCIAL GROUP • GLOBAL ASSET DEMO v4.2.0
        </div>
      </footer>
    </div>
  );
};

export default ArtCollectibles;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/ArtCollectibles.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from 'react';

// 5. Generative Data Utilities
export const generativeData = {
    getRandomInt: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
    getRandomElement: <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
    generateUUID: () => `uuid-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`,
    generateDate: (start = new Date(2020, 0, 1), end = new Date()) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
    generateCompanyName: () => {
        const prefixes = ['Quantum', 'Apex', 'Stellar', 'Orion', 'Nexus', 'Vertex'];
        const suffixes = ['Dynamics', 'Ventures', 'Solutions', 'Labs', 'Group', 'Capital'];
        return `${generativeData.getRandomElement(prefixes)} ${generativeData.getRandomElement(suffixes)}`;
    },
};

// ===================================================================================
// CITIBANKDEMOBUSINESSINC - UNIFIED ECOSYSTEM FOR OPEN BANKING & ALTERNATIVE ASSETS
// ===================================================================================
// Mission: To architect the definitive, self-contained financial operating system
// that makes open banking the U.S. standard by tokenizing and unlocking the value
// of all alternative assets. This file represents the entire, self-hosted ecosystem.
// It is engineered for billion-dollar potential across 10 integrated business models.
// All data is internally generated, and there are zero external dependencies.

// --- I. SHARED KERNEL & PRIMITIVES ---
// This section contains all shared logic, types, and services used across all
// business model branches. It is designed to be zero-dependency and self-contained.

namespace CitibankdemobusinessincKernel {
    // 1. Unified Configuration Layer
    export const config = {
        brandName: "Citibankdemobusinessinc",
        version: "1.0.0",
        theme: {
            primary: '#0056b3',
            secondary: '#00b386',
            background: '#f8f9fa',
            card: '#ffffff',
            text: '#212529',
            gain: '#198754',
            loss: '#dc3545',
            warning: '#ffc107',
        },
    };

    // 2. Shared Identity Layer & RBAC
    export type UserRole = 'Analyst' | 'Manager' | 'Compliance' | 'Executive' | 'Admin';
    export interface User {
        id: string;
        name: string;
        role: UserRole;
        permissions: string[];
    }
    const generateUser = (role: UserRole): User => {
        const permissionsMap: Record<UserRole, string[]> = {
            'Analyst': ['read:asset', 'read:valuation'],
            'Manager': ['read:asset', 'write:asset', 'read:portfolio', 'execute:trade'],
            'Compliance': ['read:all', 'run:audit', 'generate:report'],
            'Executive': ['read:all', 'view:dashboard', 'generate:summary'],
            'Admin': ['manage:users', 'manage:system'],
        };
        return {
            id: `user-${Math.random().toString(36).substr(2, 9)}`,
            name: `${role} User`,
            role,
            permissions: permissionsMap[role],
        };
    };
    export const identityLayer = {
        currentUser: generateUser('Executive'),
        login: (role: UserRole) => { identityLayer.currentUser = generateUser(role); },
        hasPermission: (permission: string) => identityLayer.currentUser.permissions.includes(permission),
    };

    // 3. Internal Event Bus
    type EventCallback = (payload?: any) => void;
    const eventBus = {
        events: {} as Record<string, EventCallback[]>,
        subscribe(event: string, callback: EventCallback) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
        },
        publish(event: string, payload?: any) {
            if (this.events[event]) {
                this.events[event].forEach(callback => callback(payload));
            }
        },
    };
    export const useEventBus = () => eventBus;

    // 4. Common Security Primitives
    export const security = {
        // Simple XOR "encryption" for demonstration. NOT FOR PRODUCTION USE.
        encrypt: (text: string): string => {
            const key = 'citibankdemobusinessinc';
            return text.split('').map((char, i) => 
                String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
            ).join('');
        },
        decrypt: (text: string): string => security.encrypt(text), // XOR is symmetric
        hash: async (text: string): Promise<string> => {
            // Basic SHA-256-like hash simulation without crypto libraries
            const textEncoder = new TextEncoder();
            const data = textEncoder.encode(text);
            let hash = 0;
            for (let i = 0; i < data.length; i++) {
                hash = (hash << 5) - hash + data[i];
                hash |= 0; // Convert to 32bit integer
            }
            return `sim_hash_${Math.abs(hash).toString(16)}`;
        },
    };

    // 6. Shared Types
    export type AssetCategory = 'Fine Art' | 'Vintage Wine' | 'Rare Collectible' | 'Luxury Watch' | 'Digital Asset' | 'Real Estate Token' | 'Precious Metal';
    export interface Asset {
        id: string;
        name: string;
        category: AssetCategory;
        value: number;
        provenanceChain: any[];
    }

    // 7. UI Primitives (Self-contained components)
    export const UI = {
        Card: ({ children, title }: { children: React.ReactNode, title: string }) => (
            <div style={{
                backgroundColor: config.theme.card,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                padding: '1.5rem',
                marginBottom: '1rem'
            }}>
                <h3 style={{ color: config.theme.primary, marginTop: 0, borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>{title}</h3>
                {children}
            </div>
        ),
        Button: ({ children, onClick, variant = 'primary' }: { children: React.ReactNode, onClick: () => void, variant?: 'primary' | 'secondary' }) => (
            <button onClick={onClick} style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: variant === 'primary' ? config.theme.primary : config.theme.secondary,
                color: config.theme.card,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
            }}>
                {children}
            </button>
        ),
    };
}

// --- II. BUSINESS MODEL BRANCHES (SELF-CONTAINED APPLICATIONS) ---
// Each of the 10 business models is implemented as a self-contained module.

// 1. Citibankdemobusinessinc.assetflow.provenance
namespace Citibankdemobusinessinc.assetflow {
    export const provenance = {
        missionStatement: "To create an immutable, cryptographically secure, and universally verifiable history for every alternative asset, building the foundation of trust for a tokenized world.",
        monetizationPath: "Transaction fees for recording events, API access for verification services, and premium features for institutional clients.",
        ipMoat: "Proprietary 'Proof-of-State' consensus algorithm that is blockchain-less, offering superior speed and lower costs for asset tracking.",
        
        dataGenerator: {
            createProvenanceRecord: (assetId: string, previousHash: string) => {
                const transactionTypes = ['Acquisition', 'Sale', 'Transfer', 'Authentication', 'Appraisal'];
                const record = {
                    timestamp: generativeData.generateDate().toISOString(),
                    transactionType: generativeData.getRandomElement(transactionTypes),
                    owner: generativeData.generateCompanyName(),
                    location: generativeData.getRandomElement(['Geneva', 'New York', 'Hong Kong', 'London']),
                    value: generativeData.getRandomInt(10000, 1000000),
                    assetId,
                    previousHash,
                };
                return { ...record, currentHash: `hash(${JSON.stringify(record)})` }; // Simplified hash
            },
            generateChain: (assetId: string, length: number = 5) => {
                let chain = [];
                let prevHash = '0'.repeat(64);
                for (let i = 0; i < length; i++) {
                    const record = provenance.dataGenerator.createProvenanceRecord(assetId, prevHash);
                    prevHash = record.currentHash;
                    chain.push(record);
                }
                return chain;
            }
        },

        components: {
            Dashboard: () => {
                const [assetId, setAssetId] = useState('asset-123');
                const [chain, setChain] = useState(() => provenance.dataGenerator.generateChain(assetId));

                const handleGenerate = () => {
                    setChain(provenance.dataGenerator.generateChain(assetId));
                };

                return (
                    <CitibankdemobusinessincKernel.UI.Card title="AssetFlow: Provenance Ledger">
                        <p>{provenance.missionStatement}</p>
                        <input value={assetId} onChange={e => setAssetId(e.target.value)} placeholder="Enter Asset ID" style={{padding: '0.5rem', marginRight: '1rem'}}/>
                        <CitibankdemobusinessincKernel.UI.Button onClick={handleGenerate}>Generate New Chain</CitibankdemobusinessincKernel.UI.Button>
                        <div style={{maxHeight: '400px', overflowY: 'auto', marginTop: '1rem', border: '1px solid #eee', padding: '1rem'}}>
                            {chain.map((record, index) => (
                                <div key={index} style={{borderBottom: '1px dashed #ccc', padding: '0.5rem 0'}}>
                                    <strong>{record.transactionType}</strong> by {record.owner} on {new Date(record.timestamp).toLocaleDateString()}
                                    <br/>
                                    <small style={{color: '#666'}}>Hash: {record.currentHash.substring(0, 20)}...</small>
                                </div>
                            ))}
                        </div>
                    </CitibankdemobusinessincKernel.UI.Card>
                );
            }
        }
    };
}

// 2. Citibankdemobusinessinc.valuengine.predictive
namespace Citibankdemobusinessinc.valuengine {
    export const predictive = {
        missionStatement: "To provide hyper-accurate, real-time valuations for traditionally illiquid assets using a proprietary multi-modal AI, unlocking true market value.",
        monetizationPath: "Valuation-as-a-Service (VaaS) API calls, subscription tiers for continuous monitoring, and revenue sharing on asset sales that outperform predictions.",
        ipMoat: "Self-training AI model ('Quantum_LSTM_v2') that simulates market microstructure and incorporates non-traditional data sources (e.g., social sentiment, satellite imagery).",
        
        logic: {
            runPrediction: (asset: { category: CitibankdemobusinessincKernel.AssetCategory, baseValue: number }) => {
                const volatility: Record<string, number> = { 'Fine Art': 0.1, 'Vintage Wine': 0.15, 'Digital Asset': 0.4, 'Real Estate Token': 0.05 };
                const v = volatility[asset.category] || 0.2;
                const trend = (Math.random() - 0.4); // Slight positive bias
                const predictedValue = asset.baseValue * (1 + trend * v);
                const confidence = 0.75 + Math.random() * 0.24;
                const keyDrivers = ['Global Liquidity Index', 'Sector Momentum', 'Geopolitical Stability Score'];
                return {
                    predictedValue,
                    confidence,
                    keyDrivers: generativeData.getRandomElement(keyDrivers),
                };
            }
        },

        components: {
            Dashboard: () => {
                const categories: CitibankdemobusinessincKernel.AssetCategory[] = ['Fine Art', 'Vintage Wine', 'Digital Asset', 'Real Estate Token'];
                const [category, setCategory] = useState<CitibankdemobusinessincKernel.AssetCategory>('Fine Art');
                const [baseValue, setBaseValue] = useState(1000000);
                const [prediction, setPrediction] = useState(() => predictive.logic.runPrediction({ category, baseValue }));

                const handlePredict = () => {
                    setPrediction(predictive.logic.runPrediction({ category, baseValue }));
                };

                return (
                    <CitibankdemobusinessincKernel.UI.Card title="ValuEngine: Predictive Valuation">
                        <p>{predictive.missionStatement}</p>
                        <div>
                            <select value={category} onChange={e => setCategory(e.target.value as any)} style={{padding: '0.5rem', marginRight: '1rem'}}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input type="number" value={baseValue} onChange={e => setBaseValue(Number(e.target.value))} style={{padding: '0.5rem', marginRight: '1rem'}}/>
                            <CitibankdemobusinessincKernel.UI.Button onClick={handlePredict}>Run Valuation</CitibankdemobusinessincKernel.UI.Button>
                        </div>
                        <div style={{marginTop: '1rem', fontSize: '1.2rem'}}>
                            <p>Predicted Value: <strong>${prediction.predictedValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</strong></p>
                            <p>Confidence Score: <strong>{(prediction.confidence * 100).toFixed(1)}%</strong></p>
                            <p>Key Driver: <strong>{prediction.keyDrivers}</strong></p>
                        </div>
                    </CitibankdemobusinessincKernel.UI.Card>
                );
            }
        }
    };
}

// 3. Citibankdemobusinessinc.fractional.ownership
namespace Citibankdemobusinessinc.fractional {
    export const ownership = {
        missionStatement: "To democratize ownership of high-value assets by enabling compliant, secure, and liquid fractionalization for everyone.",
        components: { Dashboard: () => <CitibankdemobusinessincKernel.UI.Card title="Fractional: Ownership Platform"><p>{ownership.missionStatement}</p><em>(Full implementation for this branch is abstracted for brevity)</em></CitibankdemobusinessincKernel.UI.Card> }
    };
}

// 4. Citibankdemobusinessinc.riskguard.compliance
namespace Citibankdemobusinessinc.riskguard {
    export const compliance = {
        missionStatement: "To automate the entire risk and compliance lifecycle for alternative assets, ensuring regulatory adherence and mitigating material risks proactively.",
        components: { Dashboard: () => <CitibankdemobusinessincKernel.UI.Card title="RiskGuard: Compliance Engine"><p>{compliance.missionStatement}</p><em>(Full implementation for this branch is abstracted for brevity)</em></CitibankdemobusinessincKernel.UI.Card> }
    };
}

// 5. Citibankdemobusinessinc.liquiditybridge.marketmaking
namespace Citibankdemobusinessinc.liquiditybridge {
    export const marketmaking = {
        missionStatement: "To solve the illiquidity problem of alternative assets by creating a decentralized network of automated market makers and synthetic liquidity pools.",
        components: { Dashboard: () => <CitibankdemobusinessincKernel.UI.Card title="LiquidityBridge: Market Making"><p>{marketmaking.missionStatement}</p><em>(Full implementation for this branch is abstracted for brevity)</em></CitibankdemobusinessincKernel.UI.Card> }
    };
}

// 6. Citibankdemobusinessinc.wealthport.aggregator
namespace Citibankdemobusinessinc.wealthport {
    export const aggregator = {
        missionStatement: "To provide a unified, intelligent dashboard for high-net-worth individuals and family offices to track, manage, and optimize their entire alternative asset portfolio.",
        components: { Dashboard: () => <CitibankdemobusinessincKernel.UI.Card title="WealthPort: Portfolio Aggregator"><p>{aggregator.missionStatement}</p><em>(Full implementation for this branch is abstracted for brevity)</em></CitibankdemobusinessincKernel.UI.Card> }
    };
}

// 7. Citibankdemobusinessinc.dynainsure.parametric
namespace Citibankdemobusinessinc.dynainsure {
    export const parametric = {
        missionStatement: "To reinvent asset insurance with data-driven, parametric policies that trigger automatically based on verifiable on-chain events and real-world data feeds.",
        components: { Dashboard: () => <CitibankdemobusinessincKernel.UI.Card title="DynaInsure: Parametric Insurance"><p>{parametric.missionStatement}</p><em>(Full implementation for this branch is abstracted for brevity)</em></CitibankdemobusinessincKernel.UI.Card> }
    };
}

// 8. Citibankdemobusinessinc.capitalplan.strategic
namespace Citibankdemobusinessinc.capitalplan {
    export const strategic = {
        missionStatement: "To empower funds and institutions with AI-driven capital planning, stress testing, and scenario analysis for portfolios heavily weighted in alternative assets.",
        components: { Dashboard: () => <CitibankdemobusinessincKernel.UI.Card title="CapitalPlan: Strategic Planning"><p>{strategic.missionStatement}</p><em>(Full implementation for this branch is abstracted for brevity)</em></CitibankdemobusinessincKernel.UI.Card> }
    };
}

// 9. Citibankdemobusinessinc.opengate.apilayer
namespace Citibankdemobusinessinc.opengate {
    export const apilayer = {
        missionStatement: "To build the definitive open banking API for alternative assets, enabling a new ecosystem of third-party applications and financial innovation.",
        components: { Dashboard: () => <CitibankdemobusinessincKernel.UI.Card title="OpenGate: API Layer"><p>{apilayer.missionStatement}</p><em>(Full implementation for this branch is abstracted for brevity)</em></CitibankdemobusinessincKernel.UI.Card> }
    };
}

// 10. Citibankdemobusinessinc.boardview.governance
namespace Citibankdemobusinessinc.boardview {
    export const governance = {
        missionStatement: "To streamline corporate governance and investor relations by automating the generation of board packs, investor decks, and executive summaries from live portfolio data.",
        logic: {
            generateDeck: () => `## Investor Deck\n- **Problem:** Illiquidity in $10T alternative asset market.\n- **Solution:** Our unified ecosystem.\n- **Traction:** 10 integrated, self-hosted business models.\n- **Ask:** Seed funding to achieve U.S. open banking standard.`
        },
        components: { 
            Dashboard: () => {
                const [deck, setDeck] = useState('');
                return (
                    <CitibankdemobusinessincKernel.UI.Card title="BoardView: Governance Automation">
                        <p>{governance.missionStatement}</p>
                        <CitibankdemobusinessincKernel.UI.Button onClick={() => setDeck(governance.logic.generateDeck())}>Generate Investor Deck</CitibankdemobusinessincKernel.UI.Button>
                        <pre style={{whiteSpace: 'pre-wrap', background: '#eee', padding: '1rem', marginTop: '1rem'}}>{deck}</pre>
                    </CitibankdemobusinessincKernel.UI.Card>
                );
            }
        }
    };
}


// --- III. MASTER ORCHESTRATION LAYER ---
// This layer binds all 10 business models into a unified user experience.

const businessBranches = {
    'assetflow.provenance': Citibankdemobusinessinc.assetflow.provenance,
    'valuengine.predictive': Citibankdemobusinessinc.valuengine.predictive,
    'fractional.ownership': Citibankdemobusinessinc.fractional.ownership,
    'riskguard.compliance': Citibankdemobusinessinc.riskguard.compliance,
    'liquiditybridge.marketmaking': Citibankdemobusinessinc.liquiditybridge.marketmaking,
    'wealthport.aggregator': Citibankdemobusinessinc.wealthport.aggregator,
    'dynainsure.parametric': Citibankdemobusinessinc.dynainsure.parametric,
    'capitalplan.strategic': Citibankdemobusinessinc.capitalplan.strategic,
    'opengate.apilayer': Citibankdemobusinessinc.opengate.apilayer,
    'boardview.governance': Citibankdemobusinessinc.boardview.governance,
};

type BranchName = keyof typeof businessBranches;

const EcosystemOrchestrator: React.FC = () => {
    const [activeBranch, setActiveBranch] = useState<BranchName>('assetflow.provenance');
    const [currentUser, setCurrentUser] = useState(CitibankdemobusinessincKernel.identityLayer.currentUser);
    const eventBus = CitibankdemobusinessincKernel.useEventBus();

    useEffect(() => {
        const handleUserChange = () => setCurrentUser({ ...CitibankdemobusinessincKernel.identityLayer.currentUser });
        eventBus.subscribe('userChanged', handleUserChange);
        // No cleanup needed for this simple in-memory bus
    }, [eventBus]);

    const ActiveDashboard = businessBranches[activeBranch].components.Dashboard;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Navigation Sidebar */}
            <nav style={{
                width: '280px',
                backgroundColor: CitibankdemobusinessincKernel.config.theme.card,
                padding: '1.5rem',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <h2 style={{ color: CitibankdemobusinessincKernel.config.theme.primary, margin: '0 0 2rem 0' }}>
                    {CitibankdemobusinessincKernel.config.brandName}
                </h2>
                <div style={{ flexGrow: 1 }}>
                    {(Object.keys(businessBranches) as BranchName[]).map(branchName => (
                        <button
                            key={branchName}
                            onClick={() => setActiveBranch(branchName)}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '0.75rem 1rem',
                                marginBottom: '0.5rem',
                                border: 'none',
                                borderRadius: '4px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                backgroundColor: activeBranch === branchName ? CitibankdemobusinessincKernel.config.theme.primary : 'transparent',
                                color: activeBranch === branchName ? CitibankdemobusinessincKernel.config.theme.card : CitibankdemobusinessincKernel.config.theme.text,
                                fontWeight: activeBranch === branchName ? 'bold' : 'normal',
                            }}
                        >
                            {branchName}
                        </button>
                    ))}
                </div>
                {/* User/Identity Section */}
                <div>
                    <p style={{margin: 0}}>User: <strong>{currentUser.name}</strong></p>
                    <p style={{margin: '0.25rem 0', fontSize: '0.8rem'}}>Role: {currentUser.role}</p>
                    <select 
                        value={currentUser.role} 
                        onChange={e => {
                            CitibankdemobusinessincKernel.identityLayer.login(e.target.value as any);
                            eventBus.publish('userChanged');
                        }}
                        style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
                    >
                        <option>Analyst</option>
                        <option>Manager</option>
                        <option>Compliance</option>
                        <option>Executive</option>
                        <option>Admin</option>
                    </select>
                </div>
            </nav>

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                padding: '2rem',
                backgroundColor: CitibankdemobusinessincKernel.config.theme.background,
                overflowY: 'auto'
            }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{activeBranch}</h1>
                    <p style={{ color: '#6c757d', marginTop: '0.5rem' }}>
                        Mission: {businessBranches[activeBranch].missionStatement}
                    </p>
                </header>
                <ActiveDashboard />
            </main>
        </div>
    );
};


// --- IV. MAIN EXPORTED COMPONENT ---
// This component replaces the original ArtCollectibles content and renders the entire ecosystem.

const ArtCollectibles: React.FC = () => {
  return (
    <div style={{
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: CitibankdemobusinessincKernel.config.theme.text,
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    }}>
      <EcosystemOrchestrator />
    </div>
  );
};

export default ArtCollectibles;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/ArtCollectibles.tsx
================================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * QUANTUM FINANCIAL - ELITE ASSET MANAGEMENT SYSTEM
 * "The Golden Ticket Experience"
 * 
 * PHILOSOPHY:
 * - High-Performance, Secure, Professional.
 * - "Kick the tires" - Full interactivity.
 * - "Bells and Whistles" - AI, Homomorphic Encryption, Stripe, Audit Logs.
 * 
 * SECURITY:
 * - Homomorphic Encryption Simulation for Integration Keys.
 * - Multi-factor Authentication Simulation.
 * - Real-time Fraud Monitoring.
 * - Immutable Audit Storage.
 */

// --- TYPES & INTERFACES ---

type CollectibleCategory = 'Fine Art' | 'Vintage Wine' | 'Rare Collectible' | 'Luxury Watch' | 'Digital Asset' | 'Real Estate Token' | 'Precious Metal';
type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type MarketTrend = 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  ipAddress: string;
}

interface IntegrationKey {
  id: string;
  serviceName: string;
  encryptedKey: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
}

interface ProvenanceRecord {
  date: string;
  ownerName: string;
  transactionType: 'Acquisition' | 'Sale' | 'Transfer' | 'Authentication';
  location: string;
  transactionValue: number;
  documentHash: string;
}

interface FractionalShare {
  shareholderId: string;
  percentage: number;
  equityValue: number;
  lastDividendPayout: number;
}

interface AI_Valuation {
  modelName: string;
  timestamp: string;
  predictedValue: number;
  confidenceScore: number;
  keyDrivers: string[];
}

interface RiskAssessment {
  riskLevel: RiskLevel;
  liquidityScore: number;
  geopoliticalExposure: number;
  regulatoryComplianceStatus: 'Compliant' | 'Pending Review' | 'High Risk';
  mitigationStrategies: string[];
}

interface Collectible {
  id: string;
  name: string;
  category: CollectibleCategory;
  assetClassId: string;
  imageUrl: string;
  acquisitionPrice: number;
  currentValuation: number;
  acquisitionDate: string;
  description: string;
  provenance: ProvenanceRecord[];
  fractionalShares: FractionalShare[];
  aiValuations: AI_Valuation[];
  riskProfile: RiskAssessment;
  storageLocation: string;
  insurancePolicyId: string;
  isTokenized: boolean;
}

interface PortfolioSummary {
  totalAcquisitionValue: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  aiOptimizedAllocation: { [key in CollectibleCategory]?: number };
  overallRisk: RiskLevel;
  marketSentiment: MarketTrend;
}

// --- CONSTANTS & STYLING ---

const COLORS = {
  primary: '#0A192F', // Deep Navy
  secondary: '#64FFDA', // Quantum Teal
  accent: '#F7B731', // Gold
  background: '#020C1B', // Darker Navy
  card: '#112240', // Lighter Navy
  text: '#CCD6F6',
  textDim: '#8892B0',
  gain: '#4CD137',
  loss: '#E84118',
  warning: '#FBC531',
  critical: '#C23616',
  border: '#233554',
};

const SHADOWS = {
  default: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
  hover: '0 20px 30px -15px rgba(2, 12, 27, 0.7)',
};

// --- UTILITIES ---

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// --- HOMOMORPHIC ENCRYPTION SIMULATION ---
// This simulates the ability to perform operations on encrypted data without decrypting it.
const QuantumVault = {
  encrypt: (text: string): string => {
    const b64 = btoa(text);
    return `ENC_${b64.split('').reverse().join('')}_QNTM`;
  },
  decrypt: (cipher: string): string => {
    if (!cipher.startsWith('ENC_')) return cipher;
    const core = cipher.replace('ENC_', '').replace('_QNTM', '');
    const reversed = core.split('').reverse().join('');
    return atob(reversed);
  },
  // Simulated homomorphic addition: E(a) + E(b) = E(a+b)
  homomorphicSum: (cipherA: string, cipherB: string): string => {
    const valA = parseFloat(QuantumVault.decrypt(cipherA)) || 0;
    const valB = parseFloat(QuantumVault.decrypt(cipherB)) || 0;
    return QuantumVault.encrypt((valA + valB).toString());
  }
};

// --- MOCK DATA GENERATOR ---

const generateMockCollectible = (index: number): Collectible => {
  const categories: CollectibleCategory[] = ['Fine Art', 'Vintage Wine', 'Luxury Watch', 'Digital Asset', 'Real Estate Token', 'Precious Metal', 'Rare Collectible'];
  const category = categories[index % categories.length];
  const basePrice = 250000 + (index * 75000);
  const valuationFactor = 1.1 + (Math.random() * 0.8);
  const currentValuation = Math.round(basePrice * valuationFactor);
  
  return {
    id: `QF-ASSET-${String(index + 1000).padStart(5, '0')}`,
    name: `Quantum ${category} Elite #${index + 1}`,
    category: category,
    assetClassId: `CLASS-${category.substring(0, 3).toUpperCase()}`,
    imageUrl: `https://picsum.photos/seed/${index + 42}/800/600`,
    acquisitionPrice: basePrice,
    currentValuation: currentValuation,
    acquisitionDate: `202${Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 11) + 1).padStart(2, '0')}-15`,
    description: `A high-yield ${category} asset managed within the Quantum Financial ecosystem. This asset leverages real-time market data and AI-driven valuation models to ensure maximum liquidity and capital preservation.`,
    provenance: [
      { date: '2018-05-20', ownerName: 'Global Heritage Fund', transactionType: 'Acquisition', location: 'London Vault', transactionValue: basePrice * 0.8, documentHash: '0x77a...f21' },
      { date: '2021-11-12', ownerName: 'Quantum Financial', transactionType: 'Acquisition', location: 'Singapore Secure Storage', transactionValue: basePrice, documentHash: `0x${Math.random().toString(16).slice(2, 10)}...` },
    ],
    fractionalShares: [
      { shareholderId: 'USR-992', percentage: 15, equityValue: currentValuation * 0.15, lastDividendPayout: 4500 },
      { shareholderId: 'USR-104', percentage: 10, equityValue: currentValuation * 0.10, lastDividendPayout: 3000 },
    ],
    aiValuations: [
      { modelName: 'Gemini-3-Flash-Quantum', timestamp: new Date().toISOString(), predictedValue: currentValuation * 1.05, confidenceScore: 0.98, keyDrivers: ['Market Scarcity', 'Institutional Demand'] },
    ],
    riskProfile: {
      riskLevel: index % 5 === 0 ? 'High' : 'Low',
      liquidityScore: 85,
      geopoliticalExposure: 12,
      regulatoryComplianceStatus: 'Compliant',
      mitigationStrategies: ['Dynamic Hedging', 'Multi-jurisdictional Custody'],
    },
    storageLocation: 'Quantum Vault Alpha-1',
    insurancePolicyId: `POL-QF-${index + 5000}`,
    isTokenized: true,
  };
};

const INITIAL_COLLECTIBLES = Array.from({ length: 12 }).map((_, i) => generateMockCollectible(i));

// --- SUB-COMPONENTS ---

const StripeTerminal: React.FC<{ amount: number; onPaymentSuccess: () => void; onCancel: () => void }> = ({ amount, onPaymentSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  const handlePay = async () => {
    setIsProcessing(true);
    setStep('processing');
    // Simulate Stripe API call
    await new Promise(r => setTimeout(r, 2500));
    setStep('success');
    setTimeout(() => {
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: COLORS.card, padding: '2.5rem', borderRadius: '12px',
      boxShadow: '0 0 100px rgba(0,0,0,0.8)', zIndex: 2000, width: '400px',
      border: `1px solid ${COLORS.secondary}`, textAlign: 'center'
    }}>
      {step === 'form' && (
        <>
          <h2 style={{ color: COLORS.secondary, marginBottom: '1rem' }}>Quantum Pay Terminal</h2>
          <p style={{ color: COLORS.textDim, marginBottom: '2rem' }}>Secure Transaction for {formatCurrency(amount)}</p>
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: COLORS.text, fontSize: '0.8rem', marginBottom: '0.5rem' }}>CARD NUMBER</label>
            <div style={{ padding: '1rem', backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '4px', color: COLORS.text }}>
              **** **** **** 4242
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ display: 'block', color: COLORS.text, fontSize: '0.8rem', marginBottom: '0.5rem' }}>EXPIRY</label>
              <input type="text" defaultValue="12/28" style={{ width: '100%', padding: '1rem', backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '4px', color: COLORS.text }} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ display: 'block', color: COLORS.text, fontSize: '0.8rem', marginBottom: '0.5rem' }}>CVC</label>
              <input type="text" defaultValue="***" style={{ width: '100%', padding: '1rem', backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '4px', color: COLORS.text }} />
            </div>
          </div>
          <button onClick={handlePay} style={{
            width: '100%', padding: '1rem', backgroundColor: COLORS.secondary, color: COLORS.primary,
            border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem'
          }}>
            CONFIRM PAYMENT
          </button>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer' }}>Cancel</button>
        </>
      )}
      {step === 'processing' && (
        <div style={{ padding: '3rem 0' }}>
          <div className="spinner" style={{
            width: '50px', height: '50px', border: `5px solid ${COLORS.border}`,
            borderTop: `5px solid ${COLORS.secondary}`, borderRadius: '50%',
            margin: '0 auto 2rem', animation: 'spin 1s linear infinite'
          }} />
          <h3 style={{ color: COLORS.text }}>Verifying with Stripe...</h3>
          <p style={{ color: COLORS.textDim }}>Quantum Encryption in Progress</p>
        </div>
      )}
      {step === 'success' && (
        <div style={{ padding: '3rem 0' }}>
          <div style={{ fontSize: '4rem', color: COLORS.gain, marginBottom: '1rem' }}>✓</div>
          <h3 style={{ color: COLORS.text }}>Payment Successful</h3>
          <p style={{ color: COLORS.textDim }}>Transaction ID: QF-STRIPE-{Math.random().toString(36).toUpperCase().slice(2, 10)}</p>
        </div>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const QuantumAIChat: React.FC<{ onAction: (cmd: string, payload: any) => void }> = ({ onAction }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Welcome to the Quantum Financial Golden Ticket experience. I am your AI Concierge. I can help you 'kick the tires' of our asset engine. Want to create a new Fine Art asset or simulate a market crash?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are the Quantum Financial AI Concierge. 
        The user is in a business demo. 
        You can perform actions by returning a JSON object at the end of your message.
        Available Actions:
        - CREATE_ASSET: { "category": "Fine Art", "name": "AI Masterpiece" }
        - SIMULATE_MARKET: { "trend": "Bullish" }
        - GENERATE_REPORT: { "type": "Risk" }
        
        User said: "${userText}"
        Respond professionally and elite. If they want to create something, include the JSON.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse for JSON commands
      const jsonMatch = text.match(/\{.*\}/s);
      if (jsonMatch) {
        try {
          const cmd = JSON.parse(jsonMatch[0]);
          if (cmd.category) onAction('CREATE_ASSET', cmd);
          if (cmd.trend) onAction('SIMULATE_MARKET', cmd);
        } catch (e) { console.error("AI Command Parse Error", e); }
      }

      setMessages(prev => [...prev, { role: 'ai', text: text.replace(/\{.*\}/s, '').trim() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "I apologize, but my quantum link is currently saturated. Please try again shortly." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      width: '350px', height: '500px', backgroundColor: COLORS.card,
      border: `1px solid ${COLORS.border}`, borderRadius: '12px',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      boxShadow: SHADOWS.default, position: 'fixed', bottom: '80px', right: '20px', zIndex: 1000
    }}>
      <div style={{ padding: '1rem', backgroundColor: COLORS.primary, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS.secondary }} />
        <span style={{ color: COLORS.secondary, fontWeight: 'bold', fontSize: '0.9rem' }}>QUANTUM AI CONCIERGE</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%', padding: '0.75rem', borderRadius: '8px',
            backgroundColor: m.role === 'user' ? COLORS.secondary : COLORS.background,
            color: m.role === 'user' ? COLORS.primary : COLORS.text,
            fontSize: '0.85rem', lineHeight: '1.4'
          }}>
            {m.text}
          </div>
        ))}
        {isTyping && <div style={{ color: COLORS.textDim, fontSize: '0.7rem' }}>AI is calculating...</div>}
        <div ref={chatEndRef} />
      </div>
      <div style={{ padding: '1rem', borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Quantum AI..."
          style={{
            flex: 1, backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`,
            borderRadius: '4px', padding: '0.5rem', color: COLORS.text, outline: 'none'
          }}
        />
        <button onClick={handleSend} style={{
          backgroundColor: COLORS.secondary, color: COLORS.primary, border: 'none',
          borderRadius: '4px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer'
        }}>
          SEND
        </button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const ArtCollectibles: React.FC = () => {
  const [collectibles, setCollectibles] = useState<Collectible[]>(INITIAL_COLLECTIBLES);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [integrationKeys, setIntegrationKeys] = useState<IntegrationKey[]>([
    { id: 'K-1', serviceName: 'SAP ERP', encryptedKey: QuantumVault.encrypt('SAP-SECRET-9921'), lastUsed: '2023-10-24', status: 'Active' },
    { id: 'K-2', serviceName: 'Bloomberg Terminal', encryptedKey: QuantumVault.encrypt('BB-API-KEY-X'), lastUsed: '2023-10-25', status: 'Active' }
  ]);
  const [selectedAsset, setSelectedAsset] = useState<Collectible | null>(null);
  const [showStripe, setShowStripe] = useState<{ active: boolean, amount: number }>({ active: false, amount: 0 });
  const [view, setView] = useState<'inventory' | 'analytics' | 'vault' | 'audit'>('inventory');

  // --- LOGGING SYSTEM ---
  const logAction = useCallback((action: string, details: string, severity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO') => {
    const newLog: AuditEntry = {
      id: `LOG-${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
      timestamp: new Date().toISOString(),
      action,
      user: 'DEMO_USER_GOLDEN_TICKET',
      details,
      severity,
      ipAddress: '192.168.1.104'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  useEffect(() => {
    logAction('SYSTEM_BOOT', 'Quantum Financial Asset Management System Initialized');
  }, [logAction]);

  // --- AI ACTION HANDLER ---
  const handleAIAction = (cmd: string, payload: any) => {
    if (cmd === 'CREATE_ASSET') {
      const newAsset = generateMockCollectible(collectibles.length);
      newAsset.name = payload.name || newAsset.name;
      newAsset.category = payload.category || newAsset.category;
      setCollectibles(prev => [newAsset, ...prev]);
      logAction('AI_ASSET_CREATION', `AI created new asset: ${newAsset.name}`);
    } else if (cmd === 'SIMULATE_MARKET') {
      const factor = payload.trend === 'Bullish' ? 1.1 : 0.9;
      setCollectibles(prev => prev.map(c => ({ ...c, currentValuation: Math.round(c.currentValuation * factor) })));
      logAction('AI_MARKET_SIMULATION', `AI simulated a ${payload.trend} market shift`);
    }
  };

  // --- ANALYTICS CALCULATIONS ---
  const portfolioSummary = useMemo((): PortfolioSummary => {
    const totalAcquisitionValue = collectibles.reduce((sum, c) => sum + c.acquisitionPrice, 0);
    const totalCurrentValue = collectibles.reduce((sum, c) => sum + c.currentValuation, 0);
    const totalGainLoss = totalCurrentValue - totalAcquisitionValue;
    const totalGainLossPercentage = (totalGainLoss / totalAcquisitionValue) * 100;

    return {
      totalAcquisitionValue,
      totalCurrentValue,
      totalGainLoss,
      totalGainLossPercentage,
      aiOptimizedAllocation: { 'Fine Art': 30, 'Digital Asset': 20, 'Luxury Watch': 15 },
      overallRisk: 'Low',
      marketSentiment: 'Bullish'
    };
  }, [collectibles]);

  // --- RENDER HELPERS ---

  const renderInventory = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
      {collectibles.map(asset => (
        <div key={asset.id} 
          onClick={() => setSelectedAsset(asset)}
          style={{
            backgroundColor: COLORS.card, borderRadius: '12px', overflow: 'hidden',
            border: `1px solid ${COLORS.border}`, cursor: 'pointer', transition: 'all 0.3s ease',
            boxShadow: SHADOWS.default
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = COLORS.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = COLORS.border;
          }}
        >
          <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
            <img src={asset.imageUrl} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', top: '10px', right: '10px', padding: '0.4rem 0.8rem',
              backgroundColor: asset.riskProfile.riskLevel === 'Low' ? COLORS.gain : COLORS.loss,
              color: COLORS.primary, borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold'
            }}>
              {asset.riskProfile.riskLevel} RISK
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: COLORS.text, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{asset.name}</h3>
            <p style={{ color: COLORS.textDim, fontSize: '0.8rem', marginBottom: '1rem' }}>{asset.category} • {asset.id}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: COLORS.textDim, fontSize: '0.7rem' }}>CURRENT VALUATION</p>
                <p style={{ color: COLORS.secondary, fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCurrency(asset.currentValuation)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: COLORS.textDim, fontSize: '0.7rem' }}>PERFORMANCE</p>
                <p style={{ color: asset.currentValuation > asset.acquisitionPrice ? COLORS.gain : COLORS.loss, fontWeight: 'bold' }}>
                  {((asset.currentValuation - asset.acquisitionPrice) / asset.acquisitionPrice * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ color: COLORS.secondary, marginBottom: '1.5rem' }}>Portfolio Performance</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <p style={{ color: COLORS.textDim, fontSize: '0.9rem' }}>Total Assets Under Management</p>
            <p style={{ color: COLORS.text, fontSize: '2.5rem', fontWeight: 'bold' }}>{formatCurrency(portfolioSummary.totalCurrentValue)}</p>
          </div>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            {[40, 65, 55, 80, 95, 75, 100].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: COLORS.secondary, borderRadius: '4px 4px 0 0', opacity: 0.7 }} />
            ))}
          </div>
          <p style={{ color: COLORS.textDim, fontSize: '0.8rem', textAlign: 'center' }}>7-Day Quantum Market Trend</p>
        </div>
      </div>
      <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ color: COLORS.secondary, marginBottom: '1.5rem' }}>AI Allocation Targets</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(portfolioSummary.aiOptimizedAllocation).map(([cat, val]) => (
            <div key={cat}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: COLORS.text, fontSize: '0.9rem' }}>{cat}</span>
                <span style={{ color: COLORS.secondary, fontSize: '0.9rem' }}>{val}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: COLORS.background, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${val}%`, height: '100%', backgroundColor: COLORS.secondary }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVault = () => (
    <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: COLORS.secondary }}>Quantum Homomorphic Vault</h3>
        <button style={{
          padding: '0.5rem 1rem', backgroundColor: COLORS.secondary, color: COLORS.primary,
          border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
        }}>
          + ADD INTEGRATION
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: `1px solid ${COLORS.border}` }}>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>SERVICE</th>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>ENCRYPTED KEY (HOMOMORPHIC)</th>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>STATUS</th>
            <th style={{ padding: '1rem', color: COLORS.textDim }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {integrationKeys.map(key => (
            <tr key={key.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <td style={{ padding: '1rem', color: COLORS.text, fontWeight: 'bold' }}>{key.serviceName}</td>
              <td style={{ padding: '1rem', color: COLORS.textDim, fontFamily: 'monospace', fontSize: '0.8rem' }}>{key.encryptedKey}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ padding: '0.2rem 0.5rem', backgroundColor: COLORS.gain, color: COLORS.primary, borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {key.status}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <button 
                  onClick={() => {
                    const decrypted = QuantumVault.decrypt(key.encryptedKey);
                    alert(`DEMO ONLY: Decrypted Key: ${decrypted}`);
                    logAction('VAULT_KEY_DECRYPTION', `User manually decrypted key for ${key.serviceName}`, 'WARN');
                  }}
                  style={{ background: 'none', border: `1px solid ${COLORS.secondary}`, color: COLORS.secondary, padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
                  REVEAL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAudit = () => (
    <div style={{ backgroundColor: COLORS.card, padding: '2rem', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
      <h3 style={{ color: COLORS.secondary, marginBottom: '1.5rem' }}>Immutable Audit Ledger</h3>
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {auditLogs.map(log => (
          <div key={log.id} style={{
            padding: '1rem', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', gap: '1.5rem',
            backgroundColor: log.severity === 'CRITICAL' ? 'rgba(194, 54, 22, 0.1)' : 'transparent'
          }}>
            <div style={{ color: COLORS.textDim, fontSize: '0.75rem', minWidth: '150px' }}>{new Date(log.timestamp).toLocaleString()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: log.severity === 'CRITICAL' ? COLORS.critical : COLORS.secondary, fontWeight: 'bold', fontSize: '0.9rem' }}>{log.action}</div>
              <div style={{ color: COLORS.text, fontSize: '0.85rem' }}>{log.details}</div>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: '0.75rem' }}>{log.ipAddress}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: COLORS.background, color: COLORS.text, minHeight: '100vh',
      fontFamily: "'Inter', sans-serif", padding: '0 0 100px 0'
    }}>
      {/* TOP NAVIGATION */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.5rem 3rem', backgroundColor: COLORS.primary, borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: COLORS.secondary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: COLORS.primary, fontSize: '1.5rem' }}>Q</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px', color: COLORS.text }}>QUANTUM <span style={{ color: COLORS.secondary }}>FINANCIAL</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['inventory', 'analytics', 'vault', 'audit'].map(v => (
            <button key={v} 
              onClick={() => setView(v as any)}
              style={{
                background: 'none', border: 'none', color: view === v ? COLORS.secondary : COLORS.textDim,
                fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', textTransform: 'uppercase',
                borderBottom: view === v ? `2px solid ${COLORS.secondary}` : '2px solid transparent',
                paddingBottom: '0.5rem', transition: 'all 0.3s'
              }}>
              {v}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: COLORS.textDim }}>SECURE SESSION</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: COLORS.gain }}>ACTIVE</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.border, border: `2px solid ${COLORS.secondary}` }} />
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={{ padding: '3rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: COLORS.text, marginBottom: '0.5rem' }}>
            {view === 'inventory' && "Global Asset Inventory"}
            {view === 'analytics' && "Quantum Intelligence Dashboard"}
            {view === 'vault' && "Secure Integration Vault"}
            {view === 'audit' && "Compliance & Audit Trail"}
          </h2>
          <p style={{ color: COLORS.textDim, fontSize: '1.1rem' }}>
            Welcome to your Golden Ticket experience. Kick the tires of the world's most advanced financial engine.
          </p>
        </header>

        {view === 'inventory' && renderInventory()}
        {view === 'analytics' && renderAnalytics()}
        {view === 'vault' && renderVault()}
        {view === 'audit' && renderAudit()}
      </main>

      {/* ASSET DETAIL MODAL */}
      {selectedAsset && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(2, 12, 27, 0.95)', zIndex: 1500, display: 'flex',
          justifyContent: 'center', alignItems: 'center', padding: '2rem'
        }}>
          <div style={{
            backgroundColor: COLORS.card, width: '1000px', maxHeight: '90vh',
            borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden',
            display: 'flex', boxShadow: '0 0 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <img src={selectedAsset.imageUrl} alt={selectedAsset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setSelectedAsset(null)} style={{
                position: 'absolute', top: '20px', left: '20px', backgroundColor: COLORS.primary,
                color: COLORS.text, border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                cursor: 'pointer', fontSize: '1.2rem'
              }}>✕</button>
            </div>
            <div style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
              <h2 style={{ color: COLORS.secondary, fontSize: '2rem', marginBottom: '1rem' }}>{selectedAsset.name}</h2>
              <p style={{ color: COLORS.textDim, marginBottom: '2rem', lineHeight: '1.6' }}>{selectedAsset.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <p style={{ color: COLORS.textDim, fontSize: '0.8rem' }}>ACQUISITION PRICE</p>
                  <p style={{ color: COLORS.text, fontSize: '1.2rem', fontWeight: 'bold' }}>{formatCurrency(selectedAsset.acquisitionPrice)}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.textDim, fontSize: '0.8rem' }}>CURRENT VALUATION</p>
                  <p style={{ color: COLORS.secondary, fontSize: '1.2rem', fontWeight: 'bold' }}>{formatCurrency(selectedAsset.currentValuation)}</p>
                </div>
              </div>

              <div style={{ backgroundColor: COLORS.background, padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h4 style={{ color: COLORS.text, marginBottom: '1rem', fontSize: '0.9rem' }}>AI VALUATION INSIGHT</h4>
                <p style={{ color: COLORS.textDim, fontSize: '0.85rem' }}>
                  Model: {selectedAsset.aiValuations[0].modelName}<br/>
                  Confidence: {(selectedAsset.aiValuations[0].confidenceScore * 100).toFixed(1)}%<br/>
                  Drivers: {selectedAsset.aiValuations[0].keyDrivers.join(', ')}
                </p>
              </div>

              <button 
                onClick={() => {
                  setShowStripe({ active: true, amount: selectedAsset.currentValuation });
                  logAction('STRIPE_CHECKOUT_INITIATED', `User initiated purchase for ${selectedAsset.name}`);
                }}
                style={{
                  width: '100%', padding: '1.2rem', backgroundColor: COLORS.secondary, color: COLORS.primary,
                  border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer'
                }}>
                ACQUIRE ADDITIONAL SHARES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRIPE MODAL */}
      {showStripe.active && (
        <StripeTerminal 
          amount={showStripe.amount} 
          onPaymentSuccess={() => {
            setShowStripe({ active: false, amount: 0 });
            logAction('STRIPE_PAYMENT_COMPLETED', `Successfully processed payment for ${formatCurrency(showStripe.amount)}`);
          }}
          onCancel={() => setShowStripe({ active: false, amount: 0 })}
        />
      )}

      {/* AI CHATBOT */}
      <QuantumAIChat onAction={handleAIAction} />

      {/* FOOTER STATUS BAR */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%',
        backgroundColor: COLORS.primary, borderTop: `1px solid ${COLORS.border}`,
        padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontSize: '0.75rem', color: COLORS.textDim, zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span>SYSTEM: <span style={{ color: COLORS.gain }}>OPTIMAL</span></span>
          <span>ENCRYPTION: <span style={{ color: COLORS.secondary }}>QUANTUM-HOMOMORPHIC</span></span>
          <span>AUDIT STORAGE: <span style={{ color: COLORS.secondary }}>IMMUTABLE</span></span>
        </div>
        <div>
          © 2024 QUANTUM FINANCIAL GROUP • GLOBAL ASSET DEMO v4.2.0
        </div>
      </footer>
    </div>
  );
};

export default ArtCollectibles;