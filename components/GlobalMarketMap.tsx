// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/GlobalMarketMap.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/GlobalMarketMap (3).tsx
================================================================================

import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/GlobalMarketMap (2).tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';
// Standardizing on @heroicons/react for icons, aligning with Tailwind UI.
import {
  HomeIcon,
  GlobeAltIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  BellIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  TriangleExclamationIcon,
} from '@heroicons/react/24/outline';

// -----------------------------------------------------------------------------
// --- THEME & CONSTANTS (Standardized) ---
// Replacing "HOBBYIST BIOS: VARIABLES & DISARRAY" with a clear, standardized section.
// -----------------------------------------------------------------------------

const THEME = {
  primary: '#EAB308', // Yellow-500 (Used purple previously, now aligning with the UI's yellow accent)
  secondary: '#3B82F6', // Blue-500
  danger: '#EF4444', // Red-500
  success: '#10B981', // Emerald-500
  background: '#020617', // Slate-950
  surface: '#0F172A', // Slate-900
  border: '#1E293B', // Slate-800
  textMain: '#F8FAFC', // White
  textMuted: '#94A3B8', // Slate-400
};

const REGIONS = ['NA', 'EU', 'APAC', 'LATAM', 'MENA', 'AFRICA'] as const;
const SECTORS = ['FinTech', 'HealthTech', 'Energy', 'Quantum', 'Logistics', 'Defense', 'AgriTech'];
const AI_MODELS = ['Alpha-Predict', 'Beta-Sentiment', 'Gamma-Risk', 'Omega-Exec'];

// -----------------------------------------------------------------------------
// --- DATA MODELS (Type Definitions) ---
// Replacing "CHAOS BLOBS & UNTYPED VOID" with clear, well-defined TypeScript interfaces.
// -----------------------------------------------------------------------------

/**
 * Represents a single market entity (e.g., a company stock, commodity, or crypto asset).
 */
interface MarketEntity {
  id: string;
  name: string;
  ticker: string;
  region: typeof REGIONS[number];
  sector: string;
  price: number;
  change: number; // Percentage change
  marketCap: number; // In billions
  volatility: number; // 0-1 range
  sentimentScore: number; // 0-100 score
  aiPrediction: 'BUY' | 'SELL' | 'HOLD';
  riskFactor: number; // 0-10 scale
  history: { time: number; value: number }[]; // Price history
}

/**
 * Represents a system-generated notification or alert.
 */
interface SystemNotification {
  id: string;
  timestamp: number;
  level: 'INFO' | 'WARNING' | 'CRITICAL' | 'AI_INSIGHT';
  message: string;
  source: string; // e.g., 'SYS_KERNEL', 'AI_CORE', 'PREDICT_ENGINE'
}

/**
 * Represents a message within the AI chat interface.
 */
interface AIChatMessage {
  id: string;
  sender: 'USER' | 'SYSTEM_AI';
  text: string;
  timestamp: number;
  intent?: 'ANALYSIS' | 'EXECUTION' | 'GENERAL'; // Optional intent classification
}

/**
 * Represents the current user's profile information and preferences.
 * This structure would typically be fetched from a secure authentication service.
 */
interface UserProfile {
  name: string;
  role: string;
  clearanceLevel: number;
  activeSessionId: string;
  preferences: {
    theme: 'DARK' | 'LIGHT';
    notifications: boolean;
    autoTrade: boolean;
    riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

// -----------------------------------------------------------------------------
// --- MOCK API / DATA GENERATION (Cleaned and Standardized) ---
// Replacing "REAL DATA DESTRUCTION BRAKES" with structured mock API functions.
// These functions simulate asynchronous data fetching for development purposes.
// In a production system, these would be replaced by actual API calls, likely
// managed by a unified API connector pattern (React Query, SWR, etc.).
// -----------------------------------------------------------------------------

const COMPANY_PREFIXES = ['Global', 'Nexus', 'Quantum', 'Apex', 'Stellar', 'Cyber', 'Eco', 'Fusion', 'Hyper', 'Omni'];
const COMPANY_SUFFIXES = ['Corp', 'Systems', 'Dynamics', 'Holdings', 'Ventures', 'Technologies', 'Industries', 'Group', 'Labs', 'Network'];

const generateEntityName = (i: number) => {
  const pre = COMPANY_PREFIXES[i % COMPANY_PREFIXES.length];
  const suf = COMPANY_SUFFIXES[(i * 3) % COMPANY_SUFFIXES.length];
  return `${pre}${suf} ${String.fromCharCode(65 + (i % 26))}`;
};

/**
 * Simulates fetching initial market data.
 * @param count Number of entities to generate.
 * @returns A promise resolving with an array of MarketEntity.
 */
const mockApiFetchMarketData = (count: number): Promise<MarketEntity[]> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate network latency
      const data = Array.from({ length: count }).map((_, i) => {
        const basePrice = 50 + Math.random() * 950;
        return {
          id: `ENT-${10000 + i}`,
          name: generateEntityName(i),
          ticker: `TKR${i}`,
          region: REGIONS[i % REGIONS.length],
          sector: SECTORS[i % SECTORS.length],
          price: parseFloat(basePrice.toFixed(2)),
          change: parseFloat(((Math.random() - 0.5) * 5).toFixed(2)),
          marketCap: parseFloat((1 + Math.random() * 500).toFixed(2)), // In billions
          volatility: parseFloat(Math.random().toFixed(2)), // 0-1
          sentimentScore: parseFloat((30 + Math.random() * 70).toFixed(1)), // 30-100
          aiPrediction: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'HOLD' : 'SELL',
          riskFactor: parseFloat((Math.random() * 10).toFixed(1)), // 0-10
          history: Array.from({ length: 20 }).map((__, h) => ({
            time: Date.now() - (19 - h) * 60 * 1000, // Last 20 minutes
            value: parseFloat((basePrice * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2)),
          })),
        };
      });
      resolve(data);
    }, 500);
  });
};

/**
 * Simulates fetching AI insights.
 * @param entities Current market entities to base insights on.
 * @returns A promise resolving with an AI insight message.
 */
const mockApiFetchAIInsight = (entities: MarketEntity[]): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate AI processing time
      const templates = [
        "AI Model detected arbitrage opportunity in {REGION} sector.",
        "Volatility index for {SECTOR} exceeds safety thresholds. Recommendation: Hedge.",
        "Sentiment analysis for {NAME} indicates a high probability of bullish breakout.",
        "Supply chain disruption predicted in {REGION} due to algorithmic weather modeling.",
        "Quantum liquidity pools are rebalancing. Expect minor turbulence in {SECTOR}.",
        "Anomaly detected in {NAME} - price divergence from sector trend.",
        "Increased trading volume in {SECTOR} suggests market attention.",
      ];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const entity = entities[Math.floor(Math.random() * entities.length)];
      const insight = template
        .replace('{REGION}', entity.region)
        .replace('{SECTOR}', entity.sector)
        .replace('{NAME}', entity.name);
      resolve(insight);
    }, 1500);
  });
};

/**
 * Simulates updating market data for real-time changes.
 * @param prevData Previous market data.
 * @returns A promise resolving with the updated market data.
 */
const mockApiUpdateMarketData = (prevData: MarketEntity[]): Promise<MarketEntity[]> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate network/data update frequency
      const updatedData = prevData.map(entity => {
        const volatilityFactor = entity.volatility * 0.05;
        const changeAmount = (Math.random() - 0.5) * volatilityFactor * entity.price;
        const newPrice = Math.max(0.1, parseFloat((entity.price + changeAmount).toFixed(2)));

        const newHistory = [...entity.history.slice(1), { time: Date.now(), value: newPrice }];

        // Simulate AI prediction changes (less frequent and with a clear rationale)
        let newPrediction = entity.aiPrediction;
        if (Math.random() > 0.98) { // Only 2% chance of prediction change per update
          newPrediction = ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any;
        }

        return {
          ...entity,
          price: newPrice,
          change: parseFloat((((newPrice - entity.price) / entity.price) * 100).toFixed(2)),
          history: newHistory,
          aiPrediction: newPrediction,
        };
      });
      resolve(updatedData);
    }, 2000);
  });
};

// -----------------------------------------------------------------------------
// --- REUSABLE UI COMPONENTS (Standardized using Tailwind CSS) ---
// Replacing "SUPER-MONOLITHS" with modular, well-defined components.
// -----------------------------------------------------------------------------

const Card: React.FC<{ children: React.ReactNode; title?: string; className?: string; action?: React.ReactNode }> = ({ children, title, className = '', action }) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col ${className}`}>
    {(title || action) && (
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
        {title && <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
          {title}
        </h3>}
        {action}
      </div>
    )}
    <div className="p-4 flex-1 overflow-auto relative">
      {children}
    </div>
  </div>
);

const MetricBadge: React.FC<{ label: string; value: string | number; trend?: 'up' | 'down' | 'neutral'; color?: string }> = ({ label, value, trend, color }) => {
  const TrendIcon = trend === 'up' ? ArrowUpIcon : trend === 'down' ? ArrowDownIcon : MinusIcon;
  const trendColorClass = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';

  return (
    <div className="flex flex-col bg-slate-950/30 p-2 rounded border border-slate-800/50">
      <span className="text-[10px] text-slate-500 uppercase font-semibold">{label}</span>
      <div className="flex items-end gap-2">
        <span className="text-lg font-mono font-bold text-slate-100" style={{ color }}>{value}</span>
        {trend && (
          <TrendIcon className={`w-4 h-4 mb-1 ${trendColorClass}`} />
        )}
      </div>
    </div>
  );
};

const AIStatusIndicator: React.FC<{ status: 'IDLE' | 'PROCESSING' | 'ANALYZING' | 'LOCKED' }> = ({ status }) => {
  const colors = {
    IDLE: 'bg-slate-500',
    PROCESSING: 'bg-blue-500',
    ANALYZING: 'bg-purple-500',
    LOCKED: 'bg-red-500',
  };
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
      <div className={`w-2 h-2 rounded-full ${colors[status]} ${status !== 'IDLE' ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-mono text-slate-300">{status} CORE ACTIVE</span>
    </div>
  );
};

// -----------------------------------------------------------------------------
// --- CHART WRAPPERS (Cleaned and Typed) ---
// Removing "UNWRAPPERS FOR TEXT TO MIX TYPES" for clearer component definitions.
// -----------------------------------------------------------------------------

const ScatterChartWrapper = React.memo(({ data }: { data: any[] }) => (
  <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
    <XAxis type="number" dataKey="x" name="Region Index" stroke={THEME.textMuted} tick={false} label={{ value: 'Geographic Distribution', position: 'bottom', fill: THEME.textMuted }} />
    <YAxis type="number" dataKey="y" name="Price" stroke={THEME.textMuted} label={{ value: 'Asset Price', angle: -90, position: 'left', fill: THEME.textMuted }} />
    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border, color: THEME.textMain }} formatter={(value: number, name: string, props: any) => {
        if (props.payload) {
            const d = props.payload;
            if (name === 'Price') return [`$${value.toFixed(2)}`, name];
            if (name === 'Market Cap') return [`$${d.z.toFixed(1)}B`, name];
        }
        return value;
    }} />
    <Scatter name="Companies" data={data} fill={THEME.secondary}>
      {data.map((entry, index) => (
        <cell key={`cell-${index}`} fill={entry.trend === 'up' ? THEME.success : THEME.danger} />
      ))}
    </Scatter>
  </ComposedChart>
));

const LineChartWrapper = React.memo(({ data }: { data: MarketEntity[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
      <XAxis dataKey="history.time" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString()} stroke={THEME.textMuted} tick={{fontSize: 10}} />
      <YAxis stroke={THEME.textMuted} tick={{fontSize: 10}} />
      <Tooltip contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border }} />
      <Line type="monotone" dataKey="price" stroke={THEME.primary} strokeWidth={2} dot={false} name="Price" />
      {/* Assuming sentimentScore is also part of the history, or needs aggregation */}
      <Line type="monotone" dataKey="sentimentScore" stroke={THEME.secondary} strokeWidth={1} dot={false} name="Sentiment" />
    </ComposedChart>
  </ResponsiveContainer>
));


// -----------------------------------------------------------------------------
// --- GLOBAL MARKET MAP COMPONENT (Refactored for Stability) ---
// Replacing "MINOR USERLAND FRAGMENT", "STATELESS NEGLECT", "TERMINATION & REALITY STRAIGHT LINES",
// "IGNORERS", "PARSING HINDRANCES", "BLIND LOGIC", "LEAF PARSE" with a cohesive structure.
// This component aggregates various dashboard views and manages their state and data.
// -----------------------------------------------------------------------------

const GlobalMarketMap: React.FC = () => {
  // --- Component State (Local and UI-related) ---
  const [systemTime, setSystemTime] = useState(Date.now());
  const [activeView, setActiveView] = useState<'DASHBOARD' | 'MARKET_MAP' | 'AI_NEXUS' | 'RISK_CONTROL' | 'PROFILE'>('DASHBOARD');
  const [chatInput, setChatInput] = useState('');
  const [aiStatus, setAiStatus] = useState<'IDLE' | 'PROCESSING' | 'ANALYZING' | 'LOCKED'>('IDLE');

  // --- Data State (Mimicking what a global store or React Query would manage) ---
  const [marketData, setMarketData] = useState<MarketEntity[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([]);

  // User profile: hardcoded for MVP, but would come from secure auth.
  const [userProfile] = useState<UserProfile>({
    name: 'Director A. Vance',
    role: 'Chief Investment Officer',
    clearanceLevel: 5,
    activeSessionId: 'SES-992-XJ',
    preferences: { theme: 'DARK', notifications: true, autoTrade: false, riskTolerance: 'MEDIUM' },
  });

  // --- Data Fetching & Real-time Updates ---
  useEffect(() => {
    // Initial data load on component mount
    const loadInitialData = async () => {
      try {
        const initialMarketData = await mockApiFetchMarketData(50);
        setMarketData(initialMarketData);

        setNotifications([
          { id: 'init-1', timestamp: Date.now(), level: 'INFO', message: 'System initialized. Secure connection established.', source: 'SYS_KERNEL' },
          { id: 'init-2', timestamp: Date.now(), level: 'AI_INSIGHT', message: 'Predictive models loaded. 98.4% accuracy verified.', source: 'AI_CORE' },
        ]);

        setChatHistory([
          { id: 'msg-0', sender: 'SYSTEM_AI', text: `Welcome back, ${userProfile.name}. Market volatility is currently nominal. I have prepared 3 strategic acquisition targets.`, timestamp: Date.now() }
        ]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setNotifications(prev => [{ id: `error-${Date.now()}`, timestamp: Date.now(), level: 'CRITICAL', message: 'Failed to load initial market data.', source: 'SYS_ERROR' }, ...prev]);
      }
    };

    loadInitialData();
  }, [userProfile.name]); // Dependency on userProfile.name for welcome message

  useEffect(() => {
    const clockInterval = setInterval(() => setSystemTime(Date.now()), 1000);

    // Controlled interval for market data and AI insights polling
    const dataRefreshInterval = setInterval(async () => {
      try {
        // Update market data
        const updatedMarketData = await mockApiUpdateMarketData(marketData);
        setMarketData(updatedMarketData);

        // Fetch AI insight occasionally (only if marketData is available)
        if (updatedMarketData.length > 0 && Math.random() > 0.7) {
          const newInsight = await mockApiFetchAIInsight(updatedMarketData);
          setNotifications(prev => [
            { id: `notif-${Date.now()}`, timestamp: Date.now(), level: 'AI_INSIGHT', message: newInsight, source: 'PREDICT_ENGINE' },
            ...prev.slice(0, 49) // Keep max 50 notifications
          ]);
        }
      } catch (error) {
        console.error("Failed to refresh market data or AI insight:", error);
        setNotifications(prev => [{ id: `error-${Date.now()}`, timestamp: Date.now(), level: 'WARNING', message: 'Market data refresh failed.', source: 'DATA_REFRESH' }, ...prev]);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(clockInterval);
      clearInterval(dataRefreshInterval);
    };
  }, [marketData]); // Re-run effect if marketData changes to use the latest state for updates

  // --- AI Chat Logic ---
  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim()) return;

    const userMsg: AIChatMessage = { id: `msg-${Date.now()}`, sender: 'USER', text: chatInput, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setAiStatus('PROCESSING');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate initial processing delay
      setAiStatus('ANALYZING');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate analysis time

      const responses = [
        "Analyzing market vectors... I recommend increasing exposure to the APAC region based on current momentum.",
        "Risk assessment complete. No immediate threats detected in your portfolio. All parameters are within thresholds.",
        "Processing request. Generating comprehensive report on sector volatility and potential hedging strategies.",
        "I've adjusted the algorithmic trading parameters to capitalize on the recent dip, awaiting your confirmation.",
        "Confirmed. Executing trade simulation for approval. Results will be available in the 'Risk & Compliance' module.",
        "Query understood. Accessing real-time global economic indicators to inform our next steps.",
        "Data integrity verified. Proceeding with the requested scenario analysis."
      ];
      const responseText = responses[Math.floor(Math.random() * responses.length)];
      const aiMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, sender: 'SYSTEM_AI', text: responseText, timestamp: Date.now() };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI chat failed:", error);
      const errorMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, sender: 'SYSTEM_AI', text: "Error: AI service is currently unreachable. Please try again later.", timestamp: Date.now() };
      setChatHistory(prev => [...prev, errorMsg]);
      setNotifications(prev => [{ id: `ai-error-${Date.now()}`, timestamp: Date.now(), level: 'CRITICAL', message: 'AI chat service error.', source: 'AI_CHAT' }, ...prev]);
    } finally {
      setAiStatus('IDLE');
    }
  }, [chatInput]);

  // --- Formatting Utilities ---
  const formatCurrency = useCallback((val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val), []);
  const formatNumber = useCallback((val: number) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(val), []);

  // --- View Render Functions (Modularized) ---

  const renderSidebar = () => (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-yellow-500 tracking-tighter">OMNI<span className="text-white">SYS</span></h1>
        <p className="text-xs text-slate-500 mt-1">Enterprise OS v9.4.2</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: 'DASHBOARD', label: 'Executive Dashboard', icon: HomeIcon },
          { id: 'MARKET_MAP', label: 'Global Market Map', icon: GlobeAltIcon },
          { id: 'AI_NEXUS', label: 'AI Command Nexus', icon: SparklesIcon },
          { id: 'RISK_CONTROL', label: 'Risk & Compliance', icon: ShieldCheckIcon },
          { id: 'PROFILE', label: 'Director Profile', icon: UserCircleIcon },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as any)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeView === item.id
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 rounded p-3 border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">{userProfile.name}</div>
              <div className="text-[10px] text-slate-500">{userProfile.role}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Session: {userProfile.activeSessionId}</span>
            <span className="text-emerald-500 flex items-center gap-1">
              <CheckCircleIcon className="w-3 h-3" /> Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const totalCap = useMemo(() => marketData.reduce((acc, curr) => acc + curr.marketCap, 0), [marketData]);
    const avgSentiment = useMemo(() => marketData.length > 0 ? marketData.reduce((acc, curr) => acc + curr.sentimentScore, 0) / marketData.length : 0, [marketData]);

    return (
      <div className="grid grid-cols-12 gap-4 h-full overflow-y-auto p-6">
        <div className="col-span-12 grid grid-cols-4 gap-4 mb-2">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950">
            <MetricBadge label="Total Market Cap" value={`$${formatNumber(totalCap)}B`} trend="up" color={THEME.primary} />
          </Card>
          <Card>
            <MetricBadge label="Global Sentiment" value={`${avgSentiment.toFixed(1)}/100`} trend={avgSentiment > 50 ? 'up' : 'down'} color={THEME.secondary} />
          </Card>
          <Card>
            <MetricBadge label="Active AI Agents" value="1,024" trend="neutral" color={THEME.success} />
          </Card>
          <Card>
            <MetricBadge label="System Latency" value="12ms" color="#F472B6" />
          </Card>
        </div>

        <div className="col-span-8 h-96">
          <Card title="Real-Time Market Velocity" className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={marketData.slice(0, 20)}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                <XAxis dataKey="ticker" stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <YAxis stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <Tooltip
                  contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border, color: THEME.textMain }}
                  itemStyle={{ color: THEME.primary }}
                  formatter={(value: number, name: string, props: any) => {
                    if (props.payload) {
                        const d = props.payload;
                        if (name === 'price') return [`$${value.toFixed(2)}`, 'Price'];
                        if (name === 'marketCap') return [`$${d.marketCap.toFixed(1)}B`, 'Market Cap'];
                    }
                    return value;
                  }}
                  labelFormatter={(label) => `Ticker: ${label}`}
                />
                <Bar dataKey="marketCap" fill={THEME.secondary} opacity={0.3} barSize={20} />
                <Line type="monotone" dataKey="price" stroke={THEME.primary} strokeWidth={2} dot={false} name="Price" />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="col-span-4 h-96">
          <Card title="Predictive Intelligence Feed" className="h-full">
            <div className="space-y-3">
              {notifications.filter(n => n.level === 'AI_INSIGHT').map(note => (
                <div key={note.id} className="p-3 bg-slate-950/50 border border-slate-800 rounded text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-400 font-bold">{note.source}</span>
                    <span className="text-slate-600">{new Date(note.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300">{note.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-12 h-64">
          <Card title="Sector Performance Matrix" className="h-full">
             <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={marketData.slice(0, 30)}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                <XAxis dataKey="sector" stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <YAxis stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border }} />
                <Scatter name="Volatility" dataKey="volatility" fill={THEME.danger} />
                <Bar dataKey="sentimentScore" fill={THEME.success} opacity={0.6} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    );
  };

  const renderMarketMap = () => {
    const scatterData = useMemo(() => marketData.map((d, i) => ({
      x: REGIONS.indexOf(d.region) + (Math.random() - 0.5) * 0.5, // Spread out points slightly per region
      y: d.price,
      z: d.marketCap, // Used for size/detail in tooltip
      name: d.name,
      region: d.region,
      trend: d.change > 0 ? 'up' : 'down'
    })), [marketData]);

    return (
      <div className="h-full p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Global Market Topography</h2>
          <div className="flex gap-2">
            {REGIONS.map(r => (
              <span key={r} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">{r}</span>
            ))}
          </div>
        </div>
        <Card className="flex-1 border-yellow-500/30">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChartWrapper data={scatterData} />
          </ResponsiveContainer>
        </Card>
      </div>
    );
  };

  const renderAINexus = () => (
    <div className="h-full p-6 grid grid-cols-12 gap-6">
      <div className="col-span-3 space-y-4">
        <Card title="Active Neural Models">
          <div className="space-y-2">
            {AI_MODELS.map(model => (
              <div key={model} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-xs font-mono text-slate-300">{model}</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="System Health">
          <div className="space-y-4 mt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>CPU Load</span><span>84%</span></div>
              <div className="w-full bg-slate-800 h-1 rounded"><div className="bg-blue-500 h-1 rounded w-[84%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Memory</span><span>42TB / 128TB</span></div>
              <div className="w-full bg-slate-800 h-1 rounded"><div className="bg-purple-500 h-1 rounded w-[32%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Network</span><span>140 Gbps</span></div>
              <div className="w-full bg-slate-800 h-1 rounded"><div className="bg-yellow-500 h-1 rounded w-[60%]"></div></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-span-9 flex flex-col h-full">
        <Card title="Quantum Chat Interface" className="flex-1 flex flex-col" action={<AIStatusIndicator status={aiStatus} />}>
          <div className="flex-1 overflow-y-auto space-y-4 p-4 custom-scrollbar">
            {chatHistory.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg text-sm ${
                  msg.sender === 'USER'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  <div className="text-[10px] opacity-50 mb-1 flex justify-between gap-4">
                    <span>{msg.sender === 'USER' ? 'You' : 'AI Assistant'}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {msg.text}
                </div>
              </div>
            ))}
            {aiStatus !== 'IDLE' && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg rounded-bl-none border border-slate-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            {/* Scroll to bottom */}
            <div ref={useCallback((node) => {
              if (node) node.scrollIntoView({ behavior: 'smooth' });
            }, [chatHistory])} />
          </div>
          <div className="p-4 border-t border-slate-800 bg-slate-950">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Enter command or query for AI analysis..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                disabled={aiStatus !== 'IDLE'}
              />
              <button
                onClick={handleSendMessage}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={aiStatus !== 'IDLE' || !chatInput.trim()}
              >
                EXECUTE
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRiskControl = () => (
    <div className="h-full p-6 space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <Card title="Portfolio Risk Heatmap">
          <div className="grid grid-cols-5 gap-1 h-48">
            {marketData.slice(0, 50).map(m => (
              <div
                key={m.id}
                className="rounded cursor-pointer hover:opacity-80 transition-opacity relative group"
                style={{
                  backgroundColor: m.riskFactor > 8 ? THEME.danger : m.riskFactor > 5 ? '#F59E0B' : THEME.success,
                  opacity: 0.6 + (m.riskFactor / 20)
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/80 text-[10px] text-white font-bold p-1 text-center z-10">
                  {m.ticker}<br/>Risk: {m.riskFactor.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Compliance Log">
          <div className="space-y-2 overflow-y-auto h-48 pr-2 custom-scrollbar">
            {notifications.filter(n => n.level !== 'AI_INSIGHT').map(note => (
              <div key={note.id} className="flex items-center gap-2 text-xs p-2 border-b border-slate-800">
                {note.level === 'INFO' && <CheckCircleIcon className="w-4 h-4 text-emerald-500" />}
                {note.level === 'WARNING' && <TriangleExclamationIcon className="w-4 h-4 text-yellow-500" />}
                {note.level === 'CRITICAL' && <ExclamationCircleIcon className="w-4 h-4 text-red-500" />}
                <span className="text-slate-400">{new Date(note.timestamp).toLocaleDateString()}</span>
                <span className="text-slate-200">{note.message}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Liquidity Stress Test">
          <div className="flex items-center justify-center h-48">
             <div className="relative w-32 h-32">
               <svg className="w-full h-full" viewBox="0 0 36 36">
                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={THEME.border} strokeWidth="2" />
                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke={THEME.primary} strokeWidth="2" strokeDasharray="75, 100" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-2xl font-bold text-white">75%</span>
                 <span className="text-[8px] text-slate-400 uppercase">Liquidity</span>
               </div>
             </div>
          </div>
        </Card>
      </div>
      <Card title="Anomaly Detection Timeline">
        <LineChartWrapper data={marketData.slice(0, 20)} />
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="h-full p-6 flex justify-center items-start">
      <div className="w-full max-w-2xl space-y-6">
        <Card title="Executive Profile Configuration">
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-yellow-500 border-2 border-yellow-500">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
                <p className="text-slate-400">{userProfile.role}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-900">Level {userProfile.clearanceLevel} Clearance</span>
                  <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded border border-emerald-900">Biometrics Verified</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
              <div className="space-y-2">
                <label htmlFor="theme-select" className="text-xs text-slate-500 uppercase font-bold">Interface Theme</label>
                <select id="theme-select" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-yellow-500">
                  <option>Midnight Protocol (Dark)</option>
                  <option selected={userProfile.preferences.theme === 'LIGHT'}>Daylight Operations (Light)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="risk-tolerance-select" className="text-xs text-slate-500 uppercase font-bold">Risk Tolerance AI</label>
                <select id="risk-tolerance-select" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-yellow-500">
                  <option>Conservative (Low)</option>
                  <option selected={userProfile.preferences.riskTolerance === 'MEDIUM'}>Balanced (Medium)</option>
                  <option>Aggressive (High)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-6">
              <h3 className="text-sm font-bold text-white">Automated Directives</h3>
              {[
                { label: 'Auto-Execute Stop Loss', active: true },
                { label: 'AI Sentiment Analysis Reports', active: true },
                { label: 'Quantum Encryption Layer', active: true },
                { label: 'Share Data with Global Ledger', active: false },
              ].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-sm text-slate-300">{setting.label}</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${setting.active ? 'bg-yellow-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${setting.active ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-yellow-500/30">
      {renderSidebar()}

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-wide">
              {activeView === 'DASHBOARD' && 'EXECUTIVE OVERVIEW'}
              {activeView === 'MARKET_MAP' && 'GLOBAL MARKET TOPOGRAPHY'}
              {activeView === 'AI_NEXUS' && 'ARTIFICIAL INTELLIGENCE CORE'}
              {activeView === 'RISK_CONTROL' && 'RISK & COMPLIANCE PROTOCOLS'}
              {activeView === 'PROFILE' && 'USER CONFIGURATION'}
            </h2>
            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[10px] border border-yellow-500/20 font-mono">
              LIVE FEED
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-slate-400">System Time</div>
              <div className="text-sm font-mono font-bold text-white">
                {new Date(systemTime).toLocaleTimeString()}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="flex gap-3">
              <button className="relative p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Notifications</span>
                <BellIcon className="w-6 h-6" />
                {notifications.filter(n => n.level === 'CRITICAL' || n.level === 'WARNING').length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                <Cog6ToothIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden bg-slate-950 relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
               style={{ backgroundImage: `linear-gradient(${THEME.border} 1px, transparent 1px), linear-gradient(90deg, ${THEME.border} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
          </div>

          <div className="relative z-10 h-full">
            {activeView === 'DASHBOARD' && renderDashboard()}
            {activeView === 'MARKET_MAP' && renderMarketMap()}
            {activeView === 'AI_NEXUS' && renderAINexus()}
            {activeView === 'RISK_CONTROL' && renderRiskControl()}
            {activeView === 'PROFILE' && renderProfile()}
          </div>
        </div>

        <footer className="h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 font-mono">
          <div className="flex gap-4">
            <span>STATUS: <span className="text-emerald-500">ONLINE</span></span>
            <span>LATENCY: 14ms</span>
            <span>ENCRYPTION: AES-256-GCM</span>
          </div>
          <div className="flex gap-4">
            <span>BUILD: 2024.10.05.RC4</span>
            <span>COPYRIGHT &copy; OMNISYS CORP</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default GlobalMarketMap;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/GlobalMarketMap.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/GlobalMarketMap (4).tsx
================================================================================

```typescript
import React, { useState, useEffect, useReducer, useMemo, useCallback } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  Area,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- SECTION 1: EXPANDED DATA STRUCTURES & TYPES ---
// Self-contained app-like data models defining the future of finance.

type Region = 'NA' | 'EU' | 'APAC' | 'LATAM' | 'META' | 'ORBITAL';
type Sector = 'Tech' | 'Finance' | 'BioSynth' | 'Energy' | 'Logistics' | 'Media';
type Trend = 'up' | 'down' | 'stable' | 'volatile';
type ViewMode = 'BALCONY' | 'HFT_TERMINAL' | 'SENTIMENT_NEXUS' | 'QUANTUM_RISK_MATRIX' | 'GEOPOLITICAL_DASHBOARD' | 'SECTOR_ANALYSIS';

interface CompanyData {
  id: string;
  name: string;
  index: number;
  region: Region;
  sector: Sector;
  trend: Trend;
  marketCap: number; // In Billions
  volatility: number; // 0 to 1
  sentiment: number; // -1 (negative) to 1 (positive)
  aiConfidence: number; // 0 to 1, AI's confidence in its sentiment analysis
  quantumRisk: number; // 0 to 1, exposure to quantum computing threats
  daoInfluence: number; // 0 to 1, influence from decentralized autonomous orgs
  esgScore: number; // 0-100
  debtRatio: number; // 0-1
  memeFactor: number; // 0-1, social media influence
  geopoliticalExposure: { [key in Region]?: number }; // 0-1 exposure to other regions
  lastTrade: { price: number; size: number; time: number };
  tradeHistory: { price: number; time: number }[];
}

interface HFTLog {
  id: number;
  companyId: string;
  companyName: string;
  type: 'BUY' | 'SELL';
  price: number;
  volume: number;
  timestamp: number;
  algo: 'Momentum' | 'Arbitrage' | 'MeanReversion';
}

interface RegionData {
  risk: number; // 0-1
  economicGrowth: number; // -0.1 to 0.1
}

interface NewsEvent {
  id: number;
  title: string;
  target: 'sector' | 'region' | 'company';
  targetId: string;
  impact: number; // -1 to 1
  timestamp: number;
}

interface AppState {
  companies: CompanyData[];
  hftLogs: HFTLog[];
  regions: { [key in Region]: RegionData };
  newsEvents: NewsEvent[];
  time: number;
  viewMode: ViewMode;
  selectedCompanyId: string | null;
  simulationSpeed: number; // ms per tick
}

type AppAction =
  | { type: 'INIT'; payload: { companies: CompanyData[]; regions: { [key in Region]: RegionData } } }
  | { type: 'TICK_UPDATE' }
  | { type: 'HFT_BURST' }
  | { type: 'CHANGE_VIEW'; payload: ViewMode }
  | { type: 'SELECT_COMPANY'; payload: string | null }
  | { type: 'SET_SIMULATION_SPEED'; payload: number };

// --- SECTION 2: MOCK DATA & SIMULATION CORE ---
// Inventing the companies that define the future. World-record level of detail.

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank', 'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin', 'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys', 'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys', 'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys', 'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys', 'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys', 'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys', 'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys', 'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys', 'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade', 'HeliosPrime', 'Cyborgic', 'NeuroNet', 'BioSynth', 'GeoCore', 'AquaGen', 'AeroDynamics', 'Starlight Ventures', 'VoidTech'
];

const REGIONS: Region[] = ['NA', 'EU', 'APAC', 'LATAM', 'META', 'ORBITAL'];
const SECTORS: Sector[] = ['Tech', 'Finance', 'BioSynth', 'Energy', 'Logistics', 'Media'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.map((name, i) => {
    const baseIndex = 1000 + Math.random() * 500;
    const initialPrice = parseFloat(baseIndex.toFixed(2));
    const region = REGIONS[i % REGIONS.length];
    return {
      id: `${name}-${i}`,
      name,
      index: initialPrice,
      region,
      sector: SECTORS[i % SECTORS.length],
      trend: ['up', 'down', 'stable', 'volatile'][i % 4] as Trend,
      marketCap: 100 + Math.pow(Math.random(), 3) * 5000,
      volatility: Math.random() * 0.5 + 0.1,
      sentiment: (Math.random() - 0.5) * 2,
      aiConfidence: Math.random() * 0.4 + 0.6,
      quantumRisk: name.includes('Ledger') || name.includes('Secure') ? Math.random() * 0.6 + 0.2 : Math.random() * 0.2,
      daoInfluence: Math.random() * 0.3,
      esgScore: 40 + Math.random() * 50, // 40-90
      debtRatio: Math.random() * 0.8, // 0-0.8
      memeFactor: Math.random() > 0.9 ? Math.random() : 0, // 10% chance of being a meme stock
      geopoliticalExposure: Object.fromEntries(
        REGIONS.filter(r => r !== region).map(r => [r, Math.random() * 0.5])
      ) as { [key in Region]?: number },
      lastTrade: { price: initialPrice, size: 0, time: Date.now() },
      tradeHistory: Array.from({ length: 50 }, (_, k) => ({ price: initialPrice * (1 + (Math.random() - 0.5) * 0.02), time: Date.now() - (50 - k) * 1000 })),
    };
  });
};

const generateInitialRegions = (): { [key in Region]: RegionData } => {
  return Object.fromEntries(
    REGIONS.map(r => [r, { risk: Math.random() * 0.3, economicGrowth: (Math.random() - 0.4) * 0.01 }])
  ) as { [key in Region]: RegionData };
};

// --- SECTION 3: STATE MANAGEMENT (REDUCER LOGIC) ---
// Fully coded logical conclusions for market state transitions.

let hftLogCounter = 0;
let newsEventCounter = 0;
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        companies: action.payload.companies,
        regions: action.payload.regions,
        selectedCompanyId: action.payload.companies[0]?.id || null,
      };
    case 'TICK_UPDATE':
      // Update regional data
      const updatedRegions = { ...state.regions };
      for (const regionKey in updatedRegions) {
        const region = updatedRegions[regionKey as Region];
        region.risk += (Math.random() - 0.5) * 0.01;
        region.risk = Math.max(0, Math.min(1, region.risk));
        region.economicGrowth += (Math.random() - 0.5) * 0.0005;
        region.economicGrowth = Math.max(-0.1, Math.min(0.1, region.economicGrowth));
      }

      // Check for new news events
      let newEvent: NewsEvent | null = null;
      if (Math.random() < 0.05) { // 5% chance of a news event per tick
        const targetType = ['sector', 'region'][Math.floor(Math.random() * 2)];
        const targetId = targetType === 'sector'
          ? SECTORS[Math.floor(Math.random() * SECTORS.length)]
          : REGIONS[Math.floor(Math.random() * REGIONS.length)];
        const impact = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25
        newEvent = {
          id: newsEventCounter++,
          title: `Major ${impact > 0 ? 'Breakthrough' : 'Setback'} in ${targetId} ${targetType}`,
          target: targetType as 'sector' | 'region',
          targetId,
          impact,
          timestamp: Date.now(),
        };
      }
      const updatedNewsEvents = newEvent ? [newEvent, ...state.newsEvents].slice(0, 10) : state.newsEvents;

      return {
        ...state,
        time: state.time + 1,
        regions: updatedRegions,
        newsEvents: updatedNewsEvents,
        companies: state.companies.map(c => {
          // Base factors
          const sentimentDrift = (c.sentiment * 0.005) + ((Math.random() - 0.5) * 0.001);
          const volatilityFactor = (Math.random() - 0.5) * c.volatility * 0.1;

          // GEIN - Global Economic Interaction Network factors
          const homeRegion = updatedRegions[c.region];
          const regionalRiskFactor = -homeRegion.risk * 0.002;
          const regionalGrowthFactor = homeRegion.economicGrowth * 0.1;
          
          const geopoliticalExposureFactor = Object.entries(c.geopoliticalExposure)
            .reduce((acc, [region, exposure]) => {
              return acc - (updatedRegions[region as Region].risk * (exposure ?? 0) * 0.001);
            }, 0);

          // News event impact
          const eventImpactFactor = updatedNewsEvents.reduce((acc, event) => {
            if ((event.target === 'region' && event.targetId === c.region) ||
                (event.target === 'sector' && event.targetId === c.sector)) {
              return acc + event.impact * 0.01;
            }
            return acc;
          }, 0);

          // Internal company factors
          const esgFactor = (c.esgScore - 60) / 1000 * 0.005; // bonus for >60, penalty for <60
          const debtFactor = -c.debtRatio * 0.001;
          const memeFactor = c.memeFactor > 0 ? (Math.random() - 0.5) * c.memeFactor * 0.2 : 0;

          // Combine all factors for the new index
          const totalDrift = sentimentDrift + volatilityFactor + regionalRiskFactor + regionalGrowthFactor + geopoliticalExposureFactor + eventImpactFactor + esgFactor + debtFactor + memeFactor;
          let newIndex = c.index * (1 + totalDrift);

          if (newIndex < 800) newIndex = 800 + Math.random() * 50;
          if (newIndex > 1800) newIndex = 1800 - Math.random() * 50;
          
          const newHistory = [...c.tradeHistory.slice(1), { price: newIndex, time: Date.now() }];

          return { ...c, index: newIndex, tradeHistory: newHistory };
        }),
      };
    case 'HFT_BURST':
      const newLogs: HFTLog[] = [];
      const updatedCompanies = state.companies.map(c => {
        if (Math.random() < 0.2) { // 20% chance of a burst for each company
          let newPrice = c.index;
          for (let i = 0; i < 5; i++) { // 5 trades per burst
            const tradeVolume = Math.floor(Math.random() * 1000) + 100;
            const priceImpact = (Math.random() - 0.5) * 0.005 * (tradeVolume / 500);
            newPrice *= (1 + priceImpact);
            newLogs.push({
              id: hftLogCounter++,
              companyId: c.id,
              companyName: c.name,
              type: priceImpact > 0 ? 'BUY' : 'SELL',
              price: newPrice,
              volume: tradeVolume,
              timestamp: Date.now(),
              algo: ['Momentum', 'Arbitrage', 'MeanReversion'][hftLogCounter % 3] as any,
            });
          }
          const newHistory = [...c.tradeHistory.slice(5), ...newLogs.filter(l => l.companyId === c.id).map(l => ({ price: l.price, time: l.timestamp }))];
          return { ...c, index: newPrice, lastTrade: { price: newPrice, size: newLogs[newLogs.length-1].volume, time: Date.now() }, tradeHistory: newHistory };
        }
        return c;
      });
      return {
        ...state,
        companies: updatedCompanies,
        hftLogs: [...newLogs, ...state.hftLogs].slice(0, 100),
      };
    case 'CHANGE_VIEW':
      return { ...state, viewMode: action.payload, selectedCompanyId: null };
    case 'SELECT_COMPANY':
      return { ...state, selectedCompanyId: action.payload };
    case 'SET_SIMULATION_SPEED':
      return { ...state, simulationSpeed: action.payload };
    default:
      return state;
  }
};

// --- SECTION 4: SUB-COMPONENTS (APPS WITHIN THE APP) ---
// A design expert's approach to modular, self-contained views.

// --- 4.1: The Control Panel Form ---
const MarketViewControls: React.FC<{ dispatch: React.Dispatch<AppAction>; currentState: AppState }> = ({ dispatch, currentState }) => {
  const { viewMode, simulationSpeed } = currentState;
  return (
    <div className="p-4 bg-gray-900 border-r border-yellow-700 flex flex-col space-y-4">
      <h3 className="text-lg font-bold text-yellow-400">Control Nexus</h3>
      <div className="flex flex-col space-y-2">
        {(['BALCONY', 'HFT_TERMINAL', 'SENTIMENT_NEXUS', 'QUANTUM_RISK_MATRIX', 'GEOPOLITICAL_DASHBOARD', 'SECTOR_ANALYSIS'] as ViewMode[]).map(v => (
          <button
            key={v}
            onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: v })}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === v ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            {v.replace('_', ' ')}
          </button>
        ))}
      </div>
      <div className="pt-4 border-t border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">Simulation Speed (ms/tick)</label>
        <input
          type="range"
          min="50"
          max="2000"
          step="50"
          value={simulationSpeed}
          onChange={(e) => dispatch({ type: 'SET_SIMULATION_SPEED', payload: parseInt(e.target.value, 10) })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center text-xs text-yellow-400 mt-1">{simulationSpeed}ms</div>
      </div>
    </div>
  );
};

// --- 4.2: The Prosperity Balcony (Original View, Enhanced) ---
const MarketPoint3D: React.FC<{ cx?: number; cy?: number; payload: any; color: string }> = ({ cx, cy, payload }) => {
  const effectiveSize = Math.sqrt(payload.size) * 1.5;
  return <circle cx={cx} cy={cy} r={effectiveSize / 4 + 2} fill={payload.color} opacity={0.8} stroke="#fff" strokeWidth={1} />;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload.payload as CompanyData;
    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono w-64">
        <p className="font-bold text-yellow-400 mb-1 text-base">{data.name}</p>
        <p>Region: <span className="font-semibold">{data.region}</span></p>
        <p>Index: <span className={`font-bold ${data.trend === 'up' ? 'text-green-400' : data.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{data.index.toFixed(2)}</span></p>
        <p>Market Cap: <span className="font-semibold">${data.marketCap.toFixed(0)}B</span></p>
        <div className="mt-2 pt-2 border-t border-gray-700 space-y-1">
          <p>Sector: <span className="font-semibold">{data.sector}</span></p>
          <p>Sentiment: <span className="text-blue-300">{(data.sentiment * 100).toFixed(1)}%</span> (AI Conf: {(data.aiConfidence * 100).toFixed(0)}%)</p>
          <p>Quantum Risk: <span className="text-purple-400">{(data.quantumRisk * 100).toFixed(1)}%</span></p>
          <p>DAO Influence: <span className="text-pink-400">{(data.daoInfluence * 100).toFixed(1)}%</span></p>
          <p>ESG Score: <span className="text-teal-400">{data.esgScore.toFixed(1)}</span></p>
          <p>Debt Ratio: <span className="text-orange-400">{(data.debtRatio * 100).toFixed(1)}%</span></p>
          {data.memeFactor > 0 && <p className="text-yellow-300 animate-pulse">Meme Factor: {(data.memeFactor * 100).toFixed(0)}%</p>}
        </div>
      </div>
    );
  }
  return null;
};

const ProsperityBalconyView: React.FC<{ companies: CompanyData[]; time: number }> = ({ companies, time }) => {
  const regionOrder: Region[] = ['NA', 'EU', 'APAC', 'LATAM', 'META', 'ORBITAL'];
  const scatterPoints = useMemo(() => companies.map(d => {
    const regionXPosition = regionOrder.indexOf(d.region);
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981';
    if (d.trend === 'down') color = '#EF4444';
    if (d.trend === 'volatile') color = '#F59E0B';
    return { x: regionXPosition + (Math.random() - 0.5) * 0.4, y: d.index, size: d.marketCap, color, payload: d };
  }), [companies]);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-bold text-yellow-400 mb-1">The Balcony of Prosperity: Global Market Index ({time})</h2>
      <p className="text-sm text-gray-400 mb-4">Simulated 3D market perspective. Size represents Market Cap. Height represents Index Value.</p>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={[{}]} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="x" type="number" domain={[-0.5, regionOrder.length - 0.5]} ticks={regionOrder.map((_, i) => i)} tickFormatter={(tick) => regionOrder[tick]} stroke="#9CA3AF" label={{ value: 'Geographic & Virtual Regions', position: 'bottom', fill: '#D1D5DB', dy: 10 }} />
          <YAxis domain={[800, 1800]} stroke="#9CA3AF" label={{ value: 'Index Level', angle: -90, position: 'left', fill: '#D1D5DB' }} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={scatterPoints} shape={(props: any) => <MarketPoint3D {...props} />} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- 4.3: High-Frequency Trading Terminal ---
const HFTTerminalView: React.FC<{ state: AppState; dispatch: React.Dispatch<AppAction> }> = ({ state, dispatch }) => {
  const { companies, selectedCompanyId, hftLogs } = state;
  const selectedCompany = useMemo(() => companies.find(c => c.id === selectedCompanyId), [companies, selectedCompanyId]);

  return (
    <div className="w-full h-full grid grid-cols-3 gap-4">
      <div className="col-span-1 flex flex-col bg-gray-900 p-2 rounded-lg">
        <h3 className="text-yellow-400 font-bold mb-2">Market Movers</h3>
        <div className="overflow-y-auto flex-grow">
          {companies.map(c => (
            <div
              key={c.id}
              onClick={() => dispatch({ type: 'SELECT_COMPANY', payload: c.id })}
              className={`p-2 rounded cursor-pointer text-xs mb-1 ${selectedCompanyId === c.id ? 'bg-yellow-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              <div className="flex justify-between font-bold">
                <span>{c.name}</span>
                <span className={c.index > c.tradeHistory[c.tradeHistory.length-2]?.price ? 'text-green-400' : 'text-red-400'}>
                  {c.index.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-2 flex flex-col">
        {selectedCompany ? (
          <div className="h-full flex flex-col gap-4">
            <div className="flex-1 bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg text-yellow-400 font-bold">{selectedCompany.name} - Price Chart</h3>
              <ResponsiveContainer width="100%" height="90%">
                <ComposedChart data={selectedCompany.tradeHistory}>
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                  <XAxis dataKey="time" tickFormatter={(t) => new Date(t).toLocaleTimeString()} stroke="#9CA3AF" hide />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #F59E0B' }} />
                  <Area type="monotone" dataKey="price" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.2} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 bg-gray-900 p-2 rounded-lg flex flex-col">
              <h3 className="text-yellow-400 font-bold mb-2">HFT Trade Blotter (Live)</h3>
              <div className="overflow-y-auto font-mono text-xs flex-grow">
                {hftLogs.map(log => (
                  <div key={log.id} className={`grid grid-cols-5 gap-2 p-1 ${log.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                    <span>{new Date(log.timestamp).toLocaleTimeString('en-GB',{hour12:false})}</span>
                    <span className="font-bold">{log.companyName.substring(0,10)}</span>
                    <span>{log.type}</span>
                    <span>Vol: {log.volume}</span>
                    <span>@{log.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
            <p className="text-gray-400">Select a company to view HFT data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 4.4 & 4.5: Future-Forward Dashboards ---
const GlobalSentimentNexusView: React.FC<{ companies: CompanyData[] }> = ({ companies }) => {
    const regionalSentiment = useMemo(() => {
        const sentimentMap = new Map<Region, { sum: number; count: number; confidence: number }>();
        for (const company of companies) {
            if (!sentimentMap.has(company.region)) {
                sentimentMap.set(company.region, { sum: 0, count: 0, confidence: 0 });
            }
            const regionData = sentimentMap.get(company.region)!;
            regionData.sum += company.sentiment;
            regionData.confidence += company.aiConfidence;
            regionData.count++;
        }
        return Array.from(sentimentMap.entries()).map(([region, data]) => ({
            name: region,
            sentiment: (data.sum / data.count) * 100,
            aiConfidence: (data.confidence / data.count) * 100,
        }));
    }, [companies]);

    return (
        <div className="w-full h-full flex flex-col">
            <h2 className="text-xl font-bold text-yellow-400 mb-1">Global Sentiment Nexus</h2>
            <p className="text-sm text-gray-400 mb-4">AI-driven sentiment analysis across all market regions.</p>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart layout="vertical" data={regionalSentiment} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" domain={[-100, 100]} stroke="#9CA3AF" />
                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #F59E0B' }} />
                    <Legend />
                    <Bar dataKey="sentiment" name="Avg. Sentiment (%)" barSize={20} fill="#3B82F6" />
                    <Bar dataKey="aiConfidence" name="AI Confidence (%)" barSize={20} fill="#8B5CF6" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

const QuantumRiskMatrixView: React.FC<{ companies: CompanyData[] }> = ({ companies }) => {
    const riskData = useMemo(() => {
        return companies.slice(0, 20).map(c => ({
            name: c.name,
            risk: c.quantumRisk * 100,
            marketCap: c.marketCap,
        })).sort((a, b) => b.risk - a.risk);
    }, [companies]);

    return (
        <div className="w-full h-full flex flex-col">
            <h2 className="text-xl font-bold text-yellow-400 mb-1">Quantum Risk Matrix</h2>
            <p className="text-sm text-gray-400 mb-4">Top 20 companies by simulated exposure to quantum decryption threats.</p>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={riskData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 8 }} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis yAxisId="left" orientation="left" stroke="#EC4899" label={{ value: 'Risk %', angle: -90, position: 'left', fill: '#EC4899' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#6366F1" label={{ value: 'Market Cap ($B)', angle: 90, position: 'right', fill: '#6366F1' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #F59E0B' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="risk" name="Quantum Risk" fill="#EC4899" />
                    <Line yAxisId="right" type="monotone" dataKey="marketCap" name="Market Cap" stroke="#6366F1" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- 4.6 & 4.7: GEIN (Global Economic Interaction Network) Dashboards ---
const GeopoliticalDashboardView: React.FC<{ regions: { [key in Region]: RegionData }, news: NewsEvent[] }> = ({ regions, news }) => {
    const regionData = useMemo(() => {
        return Object.entries(regions).map(([name, data]) => ({
            name,
            risk: data.risk * 100,
            growth: data.economicGrowth * 1000, // Basis points
        }));
    }, [regions]);

    return (
        <div className="w-full h-full grid grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col">
                <h2 className="text-xl font-bold text-yellow-400 mb-1">Geopolitical Dashboard</h2>
                <p className="text-sm text-gray-400 mb-4">Real-time risk and growth analysis by region.</p>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={regionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis yAxisId="left" orientation="left" stroke="#EC4899" label={{ value: 'Risk %', angle: -90, position: 'left', fill: '#EC4899' }} />
                        <YAxis yAxisId="right" orientation="right" stroke

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/GlobalMarketMap (1).tsx
================================================================================


import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/GlobalMarketMap (3).tsx
================================================================================

import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/GlobalMarketMap (2).tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';
// Standardizing on @heroicons/react for icons, aligning with Tailwind UI.
import {
  HomeIcon,
  GlobeAltIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  BellIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  TriangleExclamationIcon,
} from '@heroicons/react/24/outline';

// -----------------------------------------------------------------------------
// --- THEME & CONSTANTS (Standardized) ---
// Replacing "HOBBYIST BIOS: VARIABLES & DISARRAY" with a clear, standardized section.
// -----------------------------------------------------------------------------

const THEME = {
  primary: '#EAB308', // Yellow-500 (Used purple previously, now aligning with the UI's yellow accent)
  secondary: '#3B82F6', // Blue-500
  danger: '#EF4444', // Red-500
  success: '#10B981', // Emerald-500
  background: '#020617', // Slate-950
  surface: '#0F172A', // Slate-900
  border: '#1E293B', // Slate-800
  textMain: '#F8FAFC', // White
  textMuted: '#94A3B8', // Slate-400
};

const REGIONS = ['NA', 'EU', 'APAC', 'LATAM', 'MENA', 'AFRICA'] as const;
const SECTORS = ['FinTech', 'HealthTech', 'Energy', 'Quantum', 'Logistics', 'Defense', 'AgriTech'];
const AI_MODELS = ['Alpha-Predict', 'Beta-Sentiment', 'Gamma-Risk', 'Omega-Exec'];

// -----------------------------------------------------------------------------
// --- DATA MODELS (Type Definitions) ---
// Replacing "CHAOS BLOBS & UNTYPED VOID" with clear, well-defined TypeScript interfaces.
// -----------------------------------------------------------------------------

/**
 * Represents a single market entity (e.g., a company stock, commodity, or crypto asset).
 */
interface MarketEntity {
  id: string;
  name: string;
  ticker: string;
  region: typeof REGIONS[number];
  sector: string;
  price: number;
  change: number; // Percentage change
  marketCap: number; // In billions
  volatility: number; // 0-1 range
  sentimentScore: number; // 0-100 score
  aiPrediction: 'BUY' | 'SELL' | 'HOLD';
  riskFactor: number; // 0-10 scale
  history: { time: number; value: number }[]; // Price history
}

/**
 * Represents a system-generated notification or alert.
 */
interface SystemNotification {
  id: string;
  timestamp: number;
  level: 'INFO' | 'WARNING' | 'CRITICAL' | 'AI_INSIGHT';
  message: string;
  source: string; // e.g., 'SYS_KERNEL', 'AI_CORE', 'PREDICT_ENGINE'
}

/**
 * Represents a message within the AI chat interface.
 */
interface AIChatMessage {
  id: string;
  sender: 'USER' | 'SYSTEM_AI';
  text: string;
  timestamp: number;
  intent?: 'ANALYSIS' | 'EXECUTION' | 'GENERAL'; // Optional intent classification
}

/**
 * Represents the current user's profile information and preferences.
 * This structure would typically be fetched from a secure authentication service.
 */
interface UserProfile {
  name: string;
  role: string;
  clearanceLevel: number;
  activeSessionId: string;
  preferences: {
    theme: 'DARK' | 'LIGHT';
    notifications: boolean;
    autoTrade: boolean;
    riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

// -----------------------------------------------------------------------------
// --- MOCK API / DATA GENERATION (Cleaned and Standardized) ---
// Replacing "REAL DATA DESTRUCTION BRAKES" with structured mock API functions.
// These functions simulate asynchronous data fetching for development purposes.
// In a production system, these would be replaced by actual API calls, likely
// managed by a unified API connector pattern (React Query, SWR, etc.).
// -----------------------------------------------------------------------------

const COMPANY_PREFIXES = ['Global', 'Nexus', 'Quantum', 'Apex', 'Stellar', 'Cyber', 'Eco', 'Fusion', 'Hyper', 'Omni'];
const COMPANY_SUFFIXES = ['Corp', 'Systems', 'Dynamics', 'Holdings', 'Ventures', 'Technologies', 'Industries', 'Group', 'Labs', 'Network'];

const generateEntityName = (i: number) => {
  const pre = COMPANY_PREFIXES[i % COMPANY_PREFIXES.length];
  const suf = COMPANY_SUFFIXES[(i * 3) % COMPANY_SUFFIXES.length];
  return `${pre}${suf} ${String.fromCharCode(65 + (i % 26))}`;
};

/**
 * Simulates fetching initial market data.
 * @param count Number of entities to generate.
 * @returns A promise resolving with an array of MarketEntity.
 */
const mockApiFetchMarketData = (count: number): Promise<MarketEntity[]> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate network latency
      const data = Array.from({ length: count }).map((_, i) => {
        const basePrice = 50 + Math.random() * 950;
        return {
          id: `ENT-${10000 + i}`,
          name: generateEntityName(i),
          ticker: `TKR${i}`,
          region: REGIONS[i % REGIONS.length],
          sector: SECTORS[i % SECTORS.length],
          price: parseFloat(basePrice.toFixed(2)),
          change: parseFloat(((Math.random() - 0.5) * 5).toFixed(2)),
          marketCap: parseFloat((1 + Math.random() * 500).toFixed(2)), // In billions
          volatility: parseFloat(Math.random().toFixed(2)), // 0-1
          sentimentScore: parseFloat((30 + Math.random() * 70).toFixed(1)), // 30-100
          aiPrediction: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'HOLD' : 'SELL',
          riskFactor: parseFloat((Math.random() * 10).toFixed(1)), // 0-10
          history: Array.from({ length: 20 }).map((__, h) => ({
            time: Date.now() - (19 - h) * 60 * 1000, // Last 20 minutes
            value: parseFloat((basePrice * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2)),
          })),
        };
      });
      resolve(data);
    }, 500);
  });
};

/**
 * Simulates fetching AI insights.
 * @param entities Current market entities to base insights on.
 * @returns A promise resolving with an AI insight message.
 */
const mockApiFetchAIInsight = (entities: MarketEntity[]): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate AI processing time
      const templates = [
        "AI Model detected arbitrage opportunity in {REGION} sector.",
        "Volatility index for {SECTOR} exceeds safety thresholds. Recommendation: Hedge.",
        "Sentiment analysis for {NAME} indicates a high probability of bullish breakout.",
        "Supply chain disruption predicted in {REGION} due to algorithmic weather modeling.",
        "Quantum liquidity pools are rebalancing. Expect minor turbulence in {SECTOR}.",
        "Anomaly detected in {NAME} - price divergence from sector trend.",
        "Increased trading volume in {SECTOR} suggests market attention.",
      ];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const entity = entities[Math.floor(Math.random() * entities.length)];
      const insight = template
        .replace('{REGION}', entity.region)
        .replace('{SECTOR}', entity.sector)
        .replace('{NAME}', entity.name);
      resolve(insight);
    }, 1500);
  });
};

/**
 * Simulates updating market data for real-time changes.
 * @param prevData Previous market data.
 * @returns A promise resolving with the updated market data.
 */
const mockApiUpdateMarketData = (prevData: MarketEntity[]): Promise<MarketEntity[]> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate network/data update frequency
      const updatedData = prevData.map(entity => {
        const volatilityFactor = entity.volatility * 0.05;
        const changeAmount = (Math.random() - 0.5) * volatilityFactor * entity.price;
        const newPrice = Math.max(0.1, parseFloat((entity.price + changeAmount).toFixed(2)));

        const newHistory = [...entity.history.slice(1), { time: Date.now(), value: newPrice }];

        // Simulate AI prediction changes (less frequent and with a clear rationale)
        let newPrediction = entity.aiPrediction;
        if (Math.random() > 0.98) { // Only 2% chance of prediction change per update
          newPrediction = ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any;
        }

        return {
          ...entity,
          price: newPrice,
          change: parseFloat((((newPrice - entity.price) / entity.price) * 100).toFixed(2)),
          history: newHistory,
          aiPrediction: newPrediction,
        };
      });
      resolve(updatedData);
    }, 2000);
  });
};

// -----------------------------------------------------------------------------
// --- REUSABLE UI COMPONENTS (Standardized using Tailwind CSS) ---
// Replacing "SUPER-MONOLITHS" with modular, well-defined components.
// -----------------------------------------------------------------------------

const Card: React.FC<{ children: React.ReactNode; title?: string; className?: string; action?: React.ReactNode }> = ({ children, title, className = '', action }) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col ${className}`}>
    {(title || action) && (
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
        {title && <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
          {title}
        </h3>}
        {action}
      </div>
    )}
    <div className="p-4 flex-1 overflow-auto relative">
      {children}
    </div>
  </div>
);

const MetricBadge: React.FC<{ label: string; value: string | number; trend?: 'up' | 'down' | 'neutral'; color?: string }> = ({ label, value, trend, color }) => {
  const TrendIcon = trend === 'up' ? ArrowUpIcon : trend === 'down' ? ArrowDownIcon : MinusIcon;
  const trendColorClass = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';

  return (
    <div className="flex flex-col bg-slate-950/30 p-2 rounded border border-slate-800/50">
      <span className="text-[10px] text-slate-500 uppercase font-semibold">{label}</span>
      <div className="flex items-end gap-2">
        <span className="text-lg font-mono font-bold text-slate-100" style={{ color }}>{value}</span>
        {trend && (
          <TrendIcon className={`w-4 h-4 mb-1 ${trendColorClass}`} />
        )}
      </div>
    </div>
  );
};

const AIStatusIndicator: React.FC<{ status: 'IDLE' | 'PROCESSING' | 'ANALYZING' | 'LOCKED' }> = ({ status }) => {
  const colors = {
    IDLE: 'bg-slate-500',
    PROCESSING: 'bg-blue-500',
    ANALYZING: 'bg-purple-500',
    LOCKED: 'bg-red-500',
  };
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
      <div className={`w-2 h-2 rounded-full ${colors[status]} ${status !== 'IDLE' ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-mono text-slate-300">{status} CORE ACTIVE</span>
    </div>
  );
};

// -----------------------------------------------------------------------------
// --- CHART WRAPPERS (Cleaned and Typed) ---
// Removing "UNWRAPPERS FOR TEXT TO MIX TYPES" for clearer component definitions.
// -----------------------------------------------------------------------------

const ScatterChartWrapper = React.memo(({ data }: { data: any[] }) => (
  <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
    <XAxis type="number" dataKey="x" name="Region Index" stroke={THEME.textMuted} tick={false} label={{ value: 'Geographic Distribution', position: 'bottom', fill: THEME.textMuted }} />
    <YAxis type="number" dataKey="y" name="Price" stroke={THEME.textMuted} label={{ value: 'Asset Price', angle: -90, position: 'left', fill: THEME.textMuted }} />
    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border, color: THEME.textMain }} formatter={(value: number, name: string, props: any) => {
        if (props.payload) {
            const d = props.payload;
            if (name === 'Price') return [`$${value.toFixed(2)}`, name];
            if (name === 'Market Cap') return [`$${d.z.toFixed(1)}B`, name];
        }
        return value;
    }} />
    <Scatter name="Companies" data={data} fill={THEME.secondary}>
      {data.map((entry, index) => (
        <cell key={`cell-${index}`} fill={entry.trend === 'up' ? THEME.success : THEME.danger} />
      ))}
    </Scatter>
  </ComposedChart>
));

const LineChartWrapper = React.memo(({ data }: { data: MarketEntity[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
      <XAxis dataKey="history.time" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString()} stroke={THEME.textMuted} tick={{fontSize: 10}} />
      <YAxis stroke={THEME.textMuted} tick={{fontSize: 10}} />
      <Tooltip contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border }} />
      <Line type="monotone" dataKey="price" stroke={THEME.primary} strokeWidth={2} dot={false} name="Price" />
      {/* Assuming sentimentScore is also part of the history, or needs aggregation */}
      <Line type="monotone" dataKey="sentimentScore" stroke={THEME.secondary} strokeWidth={1} dot={false} name="Sentiment" />
    </ComposedChart>
  </ResponsiveContainer>
));


// -----------------------------------------------------------------------------
// --- GLOBAL MARKET MAP COMPONENT (Refactored for Stability) ---
// Replacing "MINOR USERLAND FRAGMENT", "STATELESS NEGLECT", "TERMINATION & REALITY STRAIGHT LINES",
// "IGNORERS", "PARSING HINDRANCES", "BLIND LOGIC", "LEAF PARSE" with a cohesive structure.
// This component aggregates various dashboard views and manages their state and data.
// -----------------------------------------------------------------------------

const GlobalMarketMap: React.FC = () => {
  // --- Component State (Local and UI-related) ---
  const [systemTime, setSystemTime] = useState(Date.now());
  const [activeView, setActiveView] = useState<'DASHBOARD' | 'MARKET_MAP' | 'AI_NEXUS' | 'RISK_CONTROL' | 'PROFILE'>('DASHBOARD');
  const [chatInput, setChatInput] = useState('');
  const [aiStatus, setAiStatus] = useState<'IDLE' | 'PROCESSING' | 'ANALYZING' | 'LOCKED'>('IDLE');

  // --- Data State (Mimicking what a global store or React Query would manage) ---
  const [marketData, setMarketData] = useState<MarketEntity[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([]);

  // User profile: hardcoded for MVP, but would come from secure auth.
  const [userProfile] = useState<UserProfile>({
    name: 'Director A. Vance',
    role: 'Chief Investment Officer',
    clearanceLevel: 5,
    activeSessionId: 'SES-992-XJ',
    preferences: { theme: 'DARK', notifications: true, autoTrade: false, riskTolerance: 'MEDIUM' },
  });

  // --- Data Fetching & Real-time Updates ---
  useEffect(() => {
    // Initial data load on component mount
    const loadInitialData = async () => {
      try {
        const initialMarketData = await mockApiFetchMarketData(50);
        setMarketData(initialMarketData);

        setNotifications([
          { id: 'init-1', timestamp: Date.now(), level: 'INFO', message: 'System initialized. Secure connection established.', source: 'SYS_KERNEL' },
          { id: 'init-2', timestamp: Date.now(), level: 'AI_INSIGHT', message: 'Predictive models loaded. 98.4% accuracy verified.', source: 'AI_CORE' },
        ]);

        setChatHistory([
          { id: 'msg-0', sender: 'SYSTEM_AI', text: `Welcome back, ${userProfile.name}. Market volatility is currently nominal. I have prepared 3 strategic acquisition targets.`, timestamp: Date.now() }
        ]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setNotifications(prev => [{ id: `error-${Date.now()}`, timestamp: Date.now(), level: 'CRITICAL', message: 'Failed to load initial market data.', source: 'SYS_ERROR' }, ...prev]);
      }
    };

    loadInitialData();
  }, [userProfile.name]); // Dependency on userProfile.name for welcome message

  useEffect(() => {
    const clockInterval = setInterval(() => setSystemTime(Date.now()), 1000);

    // Controlled interval for market data and AI insights polling
    const dataRefreshInterval = setInterval(async () => {
      try {
        // Update market data
        const updatedMarketData = await mockApiUpdateMarketData(marketData);
        setMarketData(updatedMarketData);

        // Fetch AI insight occasionally (only if marketData is available)
        if (updatedMarketData.length > 0 && Math.random() > 0.7) {
          const newInsight = await mockApiFetchAIInsight(updatedMarketData);
          setNotifications(prev => [
            { id: `notif-${Date.now()}`, timestamp: Date.now(), level: 'AI_INSIGHT', message: newInsight, source: 'PREDICT_ENGINE' },
            ...prev.slice(0, 49) // Keep max 50 notifications
          ]);
        }
      } catch (error) {
        console.error("Failed to refresh market data or AI insight:", error);
        setNotifications(prev => [{ id: `error-${Date.now()}`, timestamp: Date.now(), level: 'WARNING', message: 'Market data refresh failed.', source: 'DATA_REFRESH' }, ...prev]);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(clockInterval);
      clearInterval(dataRefreshInterval);
    };
  }, [marketData]); // Re-run effect if marketData changes to use the latest state for updates

  // --- AI Chat Logic ---
  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim()) return;

    const userMsg: AIChatMessage = { id: `msg-${Date.now()}`, sender: 'USER', text: chatInput, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setAiStatus('PROCESSING');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate initial processing delay
      setAiStatus('ANALYZING');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate analysis time

      const responses = [
        "Analyzing market vectors... I recommend increasing exposure to the APAC region based on current momentum.",
        "Risk assessment complete. No immediate threats detected in your portfolio. All parameters are within thresholds.",
        "Processing request. Generating comprehensive report on sector volatility and potential hedging strategies.",
        "I've adjusted the algorithmic trading parameters to capitalize on the recent dip, awaiting your confirmation.",
        "Confirmed. Executing trade simulation for approval. Results will be available in the 'Risk & Compliance' module.",
        "Query understood. Accessing real-time global economic indicators to inform our next steps.",
        "Data integrity verified. Proceeding with the requested scenario analysis."
      ];
      const responseText = responses[Math.floor(Math.random() * responses.length)];
      const aiMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, sender: 'SYSTEM_AI', text: responseText, timestamp: Date.now() };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI chat failed:", error);
      const errorMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, sender: 'SYSTEM_AI', text: "Error: AI service is currently unreachable. Please try again later.", timestamp: Date.now() };
      setChatHistory(prev => [...prev, errorMsg]);
      setNotifications(prev => [{ id: `ai-error-${Date.now()}`, timestamp: Date.now(), level: 'CRITICAL', message: 'AI chat service error.', source: 'AI_CHAT' }, ...prev]);
    } finally {
      setAiStatus('IDLE');
    }
  }, [chatInput]);

  // --- Formatting Utilities ---
  const formatCurrency = useCallback((val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val), []);
  const formatNumber = useCallback((val: number) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(val), []);

  // --- View Render Functions (Modularized) ---

  const renderSidebar = () => (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-yellow-500 tracking-tighter">OMNI<span className="text-white">SYS</span></h1>
        <p className="text-xs text-slate-500 mt-1">Enterprise OS v9.4.2</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: 'DASHBOARD', label: 'Executive Dashboard', icon: HomeIcon },
          { id: 'MARKET_MAP', label: 'Global Market Map', icon: GlobeAltIcon },
          { id: 'AI_NEXUS', label: 'AI Command Nexus', icon: SparklesIcon },
          { id: 'RISK_CONTROL', label: 'Risk & Compliance', icon: ShieldCheckIcon },
          { id: 'PROFILE', label: 'Director Profile', icon: UserCircleIcon },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as any)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeView === item.id
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 rounded p-3 border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">{userProfile.name}</div>
              <div className="text-[10px] text-slate-500">{userProfile.role}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Session: {userProfile.activeSessionId}</span>
            <span className="text-emerald-500 flex items-center gap-1">
              <CheckCircleIcon className="w-3 h-3" /> Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const totalCap = useMemo(() => marketData.reduce((acc, curr) => acc + curr.marketCap, 0), [marketData]);
    const avgSentiment = useMemo(() => marketData.length > 0 ? marketData.reduce((acc, curr) => acc + curr.sentimentScore, 0) / marketData.length : 0, [marketData]);

    return (
      <div className="grid grid-cols-12 gap-4 h-full overflow-y-auto p-6">
        <div className="col-span-12 grid grid-cols-4 gap-4 mb-2">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950">
            <MetricBadge label="Total Market Cap" value={`$${formatNumber(totalCap)}B`} trend="up" color={THEME.primary} />
          </Card>
          <Card>
            <MetricBadge label="Global Sentiment" value={`${avgSentiment.toFixed(1)}/100`} trend={avgSentiment > 50 ? 'up' : 'down'} color={THEME.secondary} />
          </Card>
          <Card>
            <MetricBadge label="Active AI Agents" value="1,024" trend="neutral" color={THEME.success} />
          </Card>
          <Card>
            <MetricBadge label="System Latency" value="12ms" color="#F472B6" />
          </Card>
        </div>

        <div className="col-span-8 h-96">
          <Card title="Real-Time Market Velocity" className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={marketData.slice(0, 20)}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                <XAxis dataKey="ticker" stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <YAxis stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <Tooltip
                  contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border, color: THEME.textMain }}
                  itemStyle={{ color: THEME.primary }}
                  formatter={(value: number, name: string, props: any) => {
                    if (props.payload) {
                        const d = props.payload;
                        if (name === 'price') return [`$${value.toFixed(2)}`, 'Price'];
                        if (name === 'marketCap') return [`$${d.marketCap.toFixed(1)}B`, 'Market Cap'];
                    }
                    return value;
                  }}
                  labelFormatter={(label) => `Ticker: ${label}`}
                />
                <Bar dataKey="marketCap" fill={THEME.secondary} opacity={0.3} barSize={20} />
                <Line type="monotone" dataKey="price" stroke={THEME.primary} strokeWidth={2} dot={false} name="Price" />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="col-span-4 h-96">
          <Card title="Predictive Intelligence Feed" className="h-full">
            <div className="space-y-3">
              {notifications.filter(n => n.level === 'AI_INSIGHT').map(note => (
                <div key={note.id} className="p-3 bg-slate-950/50 border border-slate-800 rounded text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-400 font-bold">{note.source}</span>
                    <span className="text-slate-600">{new Date(note.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300">{note.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-12 h-64">
          <Card title="Sector Performance Matrix" className="h-full">
             <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={marketData.slice(0, 30)}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                <XAxis dataKey="sector" stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <YAxis stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border }} />
                <Scatter name="Volatility" dataKey="volatility" fill={THEME.danger} />
                <Bar dataKey="sentimentScore" fill={THEME.success} opacity={0.6} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    );
  };

  const renderMarketMap = () => {
    const scatterData = useMemo(() => marketData.map((d, i) => ({
      x: REGIONS.indexOf(d.region) + (Math.random() - 0.5) * 0.5, // Spread out points slightly per region
      y: d.price,
      z: d.marketCap, // Used for size/detail in tooltip
      name: d.name,
      region: d.region,
      trend: d.change > 0 ? 'up' : 'down'
    })), [marketData]);

    return (
      <div className="h-full p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Global Market Topography</h2>
          <div className="flex gap-2">
            {REGIONS.map(r => (
              <span key={r} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">{r}</span>
            ))}
          </div>
        </div>
        <Card className="flex-1 border-yellow-500/30">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChartWrapper data={scatterData} />
          </ResponsiveContainer>
        </Card>
      </div>
    );
  };

  const renderAINexus = () => (
    <div className="h-full p-6 grid grid-cols-12 gap-6">
      <div className="col-span-3 space-y-4">
        <Card title="Active Neural Models">
          <div className="space-y-2">
            {AI_MODELS.map(model => (
              <div key={model} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-xs font-mono text-slate-300">{model}</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="System Health">
          <div className="space-y-4 mt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>CPU Load</span><span>84%</span></div>
              <div className="w-full bg-slate-800 h-1 rounded"><div className="bg-blue-500 h-1 rounded w-[84%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Memory</span><span>42TB / 128TB</span></div>
              <div className="w-full bg-slate-800 h-1 rounded"><div className="bg-purple-500 h-1 rounded w-[32%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Network</span><span>140 Gbps</span></div>
              <div className="w-full bg-slate-800 h-1 rounded"><div className="bg-yellow-500 h-1 rounded w-[60%]"></div></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-span-9 flex flex-col h-full">
        <Card title="Quantum Chat Interface" className="flex-1 flex flex-col" action={<AIStatusIndicator status={aiStatus} />}>
          <div className="flex-1 overflow-y-auto space-y-4 p-4 custom-scrollbar">
            {chatHistory.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg text-sm ${
                  msg.sender === 'USER'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  <div className="text-[10px] opacity-50 mb-1 flex justify-between gap-4">
                    <span>{msg.sender === 'USER' ? 'You' : 'AI Assistant'}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {msg.text}
                </div>
              </div>
            ))}
            {aiStatus !== 'IDLE' && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg rounded-bl-none border border-slate-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            {/* Scroll to bottom */}
            <div ref={useCallback((node) => {
              if (node) node.scrollIntoView({ behavior: 'smooth' });
            }, [chatHistory])} />
          </div>
          <div className="p-4 border-t border-slate-800 bg-slate-950">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Enter command or query for AI analysis..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                disabled={aiStatus !== 'IDLE'}
              />
              <button
                onClick={handleSendMessage}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={aiStatus !== 'IDLE' || !chatInput.trim()}
              >
                EXECUTE
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRiskControl = () => (
    <div className="h-full p-6 space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <Card title="Portfolio Risk Heatmap">
          <div className="grid grid-cols-5 gap-1 h-48">
            {marketData.slice(0, 50).map(m => (
              <div
                key={m.id}
                className="rounded cursor-pointer hover:opacity-80 transition-opacity relative group"
                style={{
                  backgroundColor: m.riskFactor > 8 ? THEME.danger : m.riskFactor > 5 ? '#F59E0B' : THEME.success,
                  opacity: 0.6 + (m.riskFactor / 20)
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/80 text-[10px] text-white font-bold p-1 text-center z-10">
                  {m.ticker}<br/>Risk: {m.riskFactor.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Compliance Log">
          <div className="space-y-2 overflow-y-auto h-48 pr-2 custom-scrollbar">
            {notifications.filter(n => n.level !== 'AI_INSIGHT').map(note => (
              <div key={note.id} className="flex items-center gap-2 text-xs p-2 border-b border-slate-800">
                {note.level === 'INFO' && <CheckCircleIcon className="w-4 h-4 text-emerald-500" />}
                {note.level === 'WARNING' && <TriangleExclamationIcon className="w-4 h-4 text-yellow-500" />}
                {note.level === 'CRITICAL' && <ExclamationCircleIcon className="w-4 h-4 text-red-500" />}
                <span className="text-slate-400">{new Date(note.timestamp).toLocaleDateString()}</span>
                <span className="text-slate-200">{note.message}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Liquidity Stress Test">
          <div className="flex items-center justify-center h-48">
             <div className="relative w-32 h-32">
               <svg className="w-full h-full" viewBox="0 0 36 36">
                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={THEME.border} strokeWidth="2" />
                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke={THEME.primary} strokeWidth="2" strokeDasharray="75, 100" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-2xl font-bold text-white">75%</span>
                 <span className="text-[8px] text-slate-400 uppercase">Liquidity</span>
               </div>
             </div>
          </div>
        </Card>
      </div>
      <Card title="Anomaly Detection Timeline">
        <LineChartWrapper data={marketData.slice(0, 20)} />
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="h-full p-6 flex justify-center items-start">
      <div className="w-full max-w-2xl space-y-6">
        <Card title="Executive Profile Configuration">
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-yellow-500 border-2 border-yellow-500">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
                <p className="text-slate-400">{userProfile.role}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-900">Level {userProfile.clearanceLevel} Clearance</span>
                  <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded border border-emerald-900">Biometrics Verified</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
              <div className="space-y-2">
                <label htmlFor="theme-select" className="text-xs text-slate-500 uppercase font-bold">Interface Theme</label>
                <select id="theme-select" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-yellow-500">
                  <option>Midnight Protocol (Dark)</option>
                  <option selected={userProfile.preferences.theme === 'LIGHT'}>Daylight Operations (Light)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="risk-tolerance-select" className="text-xs text-slate-500 uppercase font-bold">Risk Tolerance AI</label>
                <select id="risk-tolerance-select" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-yellow-500">
                  <option>Conservative (Low)</option>
                  <option selected={userProfile.preferences.riskTolerance === 'MEDIUM'}>Balanced (Medium)</option>
                  <option>Aggressive (High)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-6">
              <h3 className="text-sm font-bold text-white">Automated Directives</h3>
              {[
                { label: 'Auto-Execute Stop Loss', active: true },
                { label: 'AI Sentiment Analysis Reports', active: true },
                { label: 'Quantum Encryption Layer', active: true },
                { label: 'Share Data with Global Ledger', active: false },
              ].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-sm text-slate-300">{setting.label}</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${setting.active ? 'bg-yellow-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${setting.active ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-yellow-500/30">
      {renderSidebar()}

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-wide">
              {activeView === 'DASHBOARD' && 'EXECUTIVE OVERVIEW'}
              {activeView === 'MARKET_MAP' && 'GLOBAL MARKET TOPOGRAPHY'}
              {activeView === 'AI_NEXUS' && 'ARTIFICIAL INTELLIGENCE CORE'}
              {activeView === 'RISK_CONTROL' && 'RISK & COMPLIANCE PROTOCOLS'}
              {activeView === 'PROFILE' && 'USER CONFIGURATION'}
            </h2>
            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[10px] border border-yellow-500/20 font-mono">
              LIVE FEED
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-slate-400">System Time</div>
              <div className="text-sm font-mono font-bold text-white">
                {new Date(systemTime).toLocaleTimeString()}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="flex gap-3">
              <button className="relative p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Notifications</span>
                <BellIcon className="w-6 h-6" />
                {notifications.filter(n => n.level === 'CRITICAL' || n.level === 'WARNING').length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                <Cog6ToothIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden bg-slate-950 relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
               style={{ backgroundImage: `linear-gradient(${THEME.border} 1px, transparent 1px), linear-gradient(90deg, ${THEME.border} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
          </div>

          <div className="relative z-10 h-full">
            {activeView === 'DASHBOARD' && renderDashboard()}
            {activeView === 'MARKET_MAP' && renderMarketMap()}
            {activeView === 'AI_NEXUS' && renderAINexus()}
            {activeView === 'RISK_CONTROL' && renderRiskControl()}
            {activeView === 'PROFILE' && renderProfile()}
          </div>
        </div>

        <footer className="h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 font-mono">
          <div className="flex gap-4">
            <span>STATUS: <span className="text-emerald-500">ONLINE</span></span>
            <span>LATENCY: 14ms</span>
            <span>ENCRYPTION: AES-256-GCM</span>
          </div>
          <div className="flex gap-4">
            <span>BUILD: 2024.10.05.RC4</span>
            <span>COPYRIGHT &copy; OMNISYS CORP</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default GlobalMarketMap;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/GlobalMarketMap.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/GlobalMarketMap_1.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/GlobalMarketMap (1).tsx
================================================================================


import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/GlobalMarketMap.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/GlobalMarketMap (3).tsx
================================================================================

import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/GlobalMarketMap (2).tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';
// Standardizing on @heroicons/react for icons, aligning with Tailwind UI.
import {
  HomeIcon,
  GlobeAltIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  BellIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  TriangleExclamationIcon,
} from '@heroicons/react/24/outline';

// -----------------------------------------------------------------------------
// --- THEME & CONSTANTS (Standardized) ---
// Replacing "HOBBYIST BIOS: VARIABLES & DISARRAY" with a clear, standardized section.
// -----------------------------------------------------------------------------

const THEME = {
  primary: '#EAB308', // Yellow-500 (Used purple previously, now aligning with the UI's yellow accent)
  secondary: '#3B82F6', // Blue-500
  danger: '#EF4444', // Red-500
  success: '#10B981', // Emerald-500
  background: '#020617', // Slate-950
  surface: '#0F172A', // Slate-900
  border: '#1E293B', // Slate-800
  textMain: '#F8FAFC', // White
  textMuted: '#94A3B8', // Slate-400
};

const REGIONS = ['NA', 'EU', 'APAC', 'LATAM', 'MENA', 'AFRICA'] as const;
const SECTORS = ['FinTech', 'HealthTech', 'Energy', 'Quantum', 'Logistics', 'Defense', 'AgriTech'];
const AI_MODELS = ['Alpha-Predict', 'Beta-Sentiment', 'Gamma-Risk', 'Omega-Exec'];

// -----------------------------------------------------------------------------
// --- DATA MODELS (Type Definitions) ---
// Replacing "CHAOS BLOBS & UNTYPED VOID" with clear, well-defined TypeScript interfaces.
// -----------------------------------------------------------------------------

/**
 * Represents a single market entity (e.g., a company stock, commodity, or crypto asset).
 */
interface MarketEntity {
  id: string;
  name: string;
  ticker: string;
  region: typeof REGIONS[number];
  sector: string;
  price: number;
  change: number; // Percentage change
  marketCap: number; // In billions
  volatility: number; // 0-1 range
  sentimentScore: number; // 0-100 score
  aiPrediction: 'BUY' | 'SELL' | 'HOLD';
  riskFactor: number; // 0-10 scale
  history: { time: number; value: number }[]; // Price history
}

/**
 * Represents a system-generated notification or alert.
 */
interface SystemNotification {
  id: string;
  timestamp: number;
  level: 'INFO' | 'WARNING' | 'CRITICAL' | 'AI_INSIGHT';
  message: string;
  source: string; // e.g., 'SYS_KERNEL', 'AI_CORE', 'PREDICT_ENGINE'
}

/**
 * Represents a message within the AI chat interface.
 */
interface AIChatMessage {
  id: string;
  sender: 'USER' | 'SYSTEM_AI';
  text: string;
  timestamp: number;
  intent?: 'ANALYSIS' | 'EXECUTION' | 'GENERAL'; // Optional intent classification
}

/**
 * Represents the current user's profile information and preferences.
 * This structure would typically be fetched from a secure authentication service.
 */
interface UserProfile {
  name: string;
  role: string;
  clearanceLevel: number;
  activeSessionId: string;
  preferences: {
    theme: 'DARK' | 'LIGHT';
    notifications: boolean;
    autoTrade: boolean;
    riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

// -----------------------------------------------------------------------------
// --- MOCK API / DATA GENERATION (Cleaned and Standardized) ---
// Replacing "REAL DATA DESTRUCTION BRAKES" with structured mock API functions.
// These functions simulate asynchronous data fetching for development purposes.
// In a production system, these would be replaced by actual API calls, likely
// managed by a unified API connector pattern (React Query, SWR, etc.).
// -----------------------------------------------------------------------------

const COMPANY_PREFIXES = ['Global', 'Nexus', 'Quantum', 'Apex', 'Stellar', 'Cyber', 'Eco', 'Fusion', 'Hyper', 'Omni'];
const COMPANY_SUFFIXES = ['Corp', 'Systems', 'Dynamics', 'Holdings', 'Ventures', 'Technologies', 'Industries', 'Group', 'Labs', 'Network'];

const generateEntityName = (i: number) => {
  const pre = COMPANY_PREFIXES[i % COMPANY_PREFIXES.length];
  const suf = COMPANY_SUFFIXES[(i * 3) % COMPANY_SUFFIXES.length];
  return `${pre}${suf} ${String.fromCharCode(65 + (i % 26))}`;
};

/**
 * Simulates fetching initial market data.
 * @param count Number of entities to generate.
 * @returns A promise resolving with an array of MarketEntity.
 */
const mockApiFetchMarketData = (count: number): Promise<MarketEntity[]> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate network latency
      const data = Array.from({ length: count }).map((_, i) => {
        const basePrice = 50 + Math.random() * 950;
        return {
          id: `ENT-${10000 + i}`,
          name: generateEntityName(i),
          ticker: `TKR${i}`,
          region: REGIONS[i % REGIONS.length],
          sector: SECTORS[i % SECTORS.length],
          price: parseFloat(basePrice.toFixed(2)),
          change: parseFloat(((Math.random() - 0.5) * 5).toFixed(2)),
          marketCap: parseFloat((1 + Math.random() * 500).toFixed(2)), // In billions
          volatility: parseFloat(Math.random().toFixed(2)), // 0-1
          sentimentScore: parseFloat((30 + Math.random() * 70).toFixed(1)), // 30-100
          aiPrediction: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'HOLD' : 'SELL',
          riskFactor: parseFloat((Math.random() * 10).toFixed(1)), // 0-10
          history: Array.from({ length: 20 }).map((__, h) => ({
            time: Date.now() - (19 - h) * 60 * 1000, // Last 20 minutes
            value: parseFloat((basePrice * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2)),
          })),
        };
      });
      resolve(data);
    }, 500);
  });
};

/**
 * Simulates fetching AI insights.
 * @param entities Current market entities to base insights on.
 * @returns A promise resolving with an AI insight message.
 */
const mockApiFetchAIInsight = (entities: MarketEntity[]): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate AI processing time
      const templates = [
        "AI Model detected arbitrage opportunity in {REGION} sector.",
        "Volatility index for {SECTOR} exceeds safety thresholds. Recommendation: Hedge.",
        "Sentiment analysis for {NAME} indicates a high probability of bullish breakout.",
        "Supply chain disruption predicted in {REGION} due to algorithmic weather modeling.",
        "Quantum liquidity pools are rebalancing. Expect minor turbulence in {SECTOR}.",
        "Anomaly detected in {NAME} - price divergence from sector trend.",
        "Increased trading volume in {SECTOR} suggests market attention.",
      ];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const entity = entities[Math.floor(Math.random() * entities.length)];
      const insight = template
        .replace('{REGION}', entity.region)
        .replace('{SECTOR}', entity.sector)
        .replace('{NAME}', entity.name);
      resolve(insight);
    }, 1500);
  });
};

/**
 * Simulates updating market data for real-time changes.
 * @param prevData Previous market data.
 * @returns A promise resolving with the updated market data.
 */
const mockApiUpdateMarketData = (prevData: MarketEntity[]): Promise<MarketEntity[]> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate network/data update frequency
      const updatedData = prevData.map(entity => {
        const volatilityFactor = entity.volatility * 0.05;
        const changeAmount = (Math.random() - 0.5) * volatilityFactor * entity.price;
        const newPrice = Math.max(0.1, parseFloat((entity.price + changeAmount).toFixed(2)));

        const newHistory = [...entity.history.slice(1), { time: Date.now(), value: newPrice }];

        // Simulate AI prediction changes (less frequent and with a clear rationale)
        let newPrediction = entity.aiPrediction;
        if (Math.random() > 0.98) { // Only 2% chance of prediction change per update
          newPrediction = ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any;
        }

        return {
          ...entity,
          price: newPrice,
          change: parseFloat((((newPrice - entity.price) / entity.price) * 100).toFixed(2)),
          history: newHistory,
          aiPrediction: newPrediction,
        };
      });
      resolve(updatedData);
    }, 2000);
  });
};

// -----------------------------------------------------------------------------
// --- REUSABLE UI COMPONENTS (Standardized using Tailwind CSS) ---
// Replacing "SUPER-MONOLITHS" with modular, well-defined components.
// -----------------------------------------------------------------------------

const Card: React.FC<{ children: React.ReactNode; title?: string; className?: string; action?: React.ReactNode }> = ({ children, title, className = '', action }) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col ${className}`}>
    {(title || action) && (
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
        {title && <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
          {title}
        </h3>}
        {action}
      </div>
    )}
    <div className="p-4 flex-1 overflow-auto relative">
      {children}
    </div>
  </div>
);

const MetricBadge: React.FC<{ label: string; value: string | number; trend?: 'up' | 'down' | 'neutral'; color?: string }> = ({ label, value, trend, color }) => {
  const TrendIcon = trend === 'up' ? ArrowUpIcon : trend === 'down' ? ArrowDownIcon : MinusIcon;
  const trendColorClass = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';

  return (
    <div className="flex flex-col bg-slate-950/30 p-2 rounded border border-slate-800/50">
      <span className="text-[10px] text-slate-500 uppercase font-semibold">{label}</span>
      <div className="flex items-end gap-2">
        <span className="text-lg font-mono font-bold text-slate-100" style={{ color }}>{value}</span>
        {trend && (
          <TrendIcon className={`w-4 h-4 mb-1 ${trendColorClass}`} />
        )}
      </div>
    </div>
  );
};

const AIStatusIndicator: React.FC<{ status: 'IDLE' | 'PROCESSING' | 'ANALYZING' | 'LOCKED' }> = ({ status }) => {
  const colors = {
    IDLE: 'bg-slate-500',
    PROCESSING: 'bg-blue-500',
    ANALYZING: 'bg-purple-500',
    LOCKED: 'bg-red-500',
  };
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
      <div className={`w-2 h-2 rounded-full ${colors[status]} ${status !== 'IDLE' ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-mono text-slate-300">{status} CORE ACTIVE</span>
    </div>
  );
};

// -----------------------------------------------------------------------------
// --- CHART WRAPPERS (Cleaned and Typed) ---
// Removing "UNWRAPPERS FOR TEXT TO MIX TYPES" for clearer component definitions.
// -----------------------------------------------------------------------------

const ScatterChartWrapper = React.memo(({ data }: { data: any[] }) => (
  <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
    <XAxis type="number" dataKey="x" name="Region Index" stroke={THEME.textMuted} tick={false} label={{ value: 'Geographic Distribution', position: 'bottom', fill: THEME.textMuted }} />
    <YAxis type="number" dataKey="y" name="Price" stroke={THEME.textMuted} label={{ value: 'Asset Price', angle: -90, position: 'left', fill: THEME.textMuted }} />
    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border, color: THEME.textMain }} formatter={(value: number, name: string, props: any) => {
        if (props.payload) {
            const d = props.payload;
            if (name === 'Price') return [`$${value.toFixed(2)}`, name];
            if (name === 'Market Cap') return [`$${d.z.toFixed(1)}B`, name];
        }
        return value;
    }} />
    <Scatter name="Companies" data={data} fill={THEME.secondary}>
      {data.map((entry, index) => (
        <cell key={`cell-${index}`} fill={entry.trend === 'up' ? THEME.success : THEME.danger} />
      ))}
    </Scatter>
  </ComposedChart>
));

const LineChartWrapper = React.memo(({ data }: { data: MarketEntity[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
      <XAxis dataKey="history.time" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString()} stroke={THEME.textMuted} tick={{fontSize: 10}} />
      <YAxis stroke={THEME.textMuted} tick={{fontSize: 10}} />
      <Tooltip contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border }} />
      <Line type="monotone" dataKey="price" stroke={THEME.primary} strokeWidth={2} dot={false} name="Price" />
      {/* Assuming sentimentScore is also part of the history, or needs aggregation */}
      <Line type="monotone" dataKey="sentimentScore" stroke={THEME.secondary} strokeWidth={1} dot={false} name="Sentiment" />
    </ComposedChart>
  </ResponsiveContainer>
));


// -----------------------------------------------------------------------------
// --- GLOBAL MARKET MAP COMPONENT (Refactored for Stability) ---
// Replacing "MINOR USERLAND FRAGMENT", "STATELESS NEGLECT", "TERMINATION & REALITY STRAIGHT LINES",
// "IGNORERS", "PARSING HINDRANCES", "BLIND LOGIC", "LEAF PARSE" with a cohesive structure.
// This component aggregates various dashboard views and manages their state and data.
// -----------------------------------------------------------------------------

const GlobalMarketMap: React.FC = () => {
  // --- Component State (Local and UI-related) ---
  const [systemTime, setSystemTime] = useState(Date.now());
  const [activeView, setActiveView] = useState<'DASHBOARD' | 'MARKET_MAP' | 'AI_NEXUS' | 'RISK_CONTROL' | 'PROFILE'>('DASHBOARD');
  const [chatInput, setChatInput] = useState('');
  const [aiStatus, setAiStatus] = useState<'IDLE' | 'PROCESSING' | 'ANALYZING' | 'LOCKED'>('IDLE');

  // --- Data State (Mimicking what a global store or React Query would manage) ---
  const [marketData, setMarketData] = useState<MarketEntity[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([]);

  // User profile: hardcoded for MVP, but would come from secure auth.
  const [userProfile] = useState<UserProfile>({
    name: 'Director A. Vance',
    role: 'Chief Investment Officer',
    clearanceLevel: 5,
    activeSessionId: 'SES-992-XJ',
    preferences: { theme: 'DARK', notifications: true, autoTrade: false, riskTolerance: 'MEDIUM' },
  });

  // --- Data Fetching & Real-time Updates ---
  useEffect(() => {
    // Initial data load on component mount
    const loadInitialData = async () => {
      try {
        const initialMarketData = await mockApiFetchMarketData(50);
        setMarketData(initialMarketData);

        setNotifications([
          { id: 'init-1', timestamp: Date.now(), level: 'INFO', message: 'System initialized. Secure connection established.', source: 'SYS_KERNEL' },
          { id: 'init-2', timestamp: Date.now(), level: 'AI_INSIGHT', message: 'Predictive models loaded. 98.4% accuracy verified.', source: 'AI_CORE' },
        ]);

        setChatHistory([
          { id: 'msg-0', sender: 'SYSTEM_AI', text: `Welcome back, ${userProfile.name}. Market volatility is currently nominal. I have prepared 3 strategic acquisition targets.`, timestamp: Date.now() }
        ]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setNotifications(prev => [{ id: `error-${Date.now()}`, timestamp: Date.now(), level: 'CRITICAL', message: 'Failed to load initial market data.', source: 'SYS_ERROR' }, ...prev]);
      }
    };

    loadInitialData();
  }, [userProfile.name]); // Dependency on userProfile.name for welcome message

  useEffect(() => {
    const clockInterval = setInterval(() => setSystemTime(Date.now()), 1000);

    // Controlled interval for market data and AI insights polling
    const dataRefreshInterval = setInterval(async () => {
      try {
        // Update market data
        const updatedMarketData = await mockApiUpdateMarketData(marketData);
        setMarketData(updatedMarketData);

        // Fetch AI insight occasionally (only if marketData is available)
        if (updatedMarketData.length > 0 && Math.random() > 0.7) {
          const newInsight = await mockApiFetchAIInsight(updatedMarketData);
          setNotifications(prev => [
            { id: `notif-${Date.now()}`, timestamp: Date.now(), level: 'AI_INSIGHT', message: newInsight, source: 'PREDICT_ENGINE' },
            ...prev.slice(0, 49) // Keep max 50 notifications
          ]);
        }
      } catch (error) {
        console.error("Failed to refresh market data or AI insight:", error);
        setNotifications(prev => [{ id: `error-${Date.now()}`, timestamp: Date.now(), level: 'WARNING', message: 'Market data refresh failed.', source: 'DATA_REFRESH' }, ...prev]);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(clockInterval);
      clearInterval(dataRefreshInterval);
    };
  }, [marketData]); // Re-run effect if marketData changes to use the latest state for updates

  // --- AI Chat Logic ---
  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim()) return;

    const userMsg: AIChatMessage = { id: `msg-${Date.now()}`, sender: 'USER', text: chatInput, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setAiStatus('PROCESSING');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate initial processing delay
      setAiStatus('ANALYZING');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate analysis time

      const responses = [
        "Analyzing market vectors... I recommend increasing exposure to the APAC region based on current momentum.",
        "Risk assessment complete. No immediate threats detected in your portfolio. All parameters are within thresholds.",
        "Processing request. Generating comprehensive report on sector volatility and potential hedging strategies.",
        "I've adjusted the algorithmic trading parameters to capitalize on the recent dip, awaiting your confirmation.",
        "Confirmed. Executing trade simulation for approval. Results will be available in the 'Risk & Compliance' module.",
        "Query understood. Accessing real-time global economic indicators to inform our next steps.",
        "Data integrity verified. Proceeding with the requested scenario analysis."
      ];
      const responseText = responses[Math.floor(Math.random() * responses.length)];
      const aiMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, sender: 'SYSTEM_AI', text: responseText, timestamp: Date.now() };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI chat failed:", error);
      const errorMsg: AIChatMessage = { id: `msg-${Date.now() + 1}`, sender: 'SYSTEM_AI', text: "Error: AI service is currently unreachable. Please try again later.", timestamp: Date.now() };
      setChatHistory(prev => [...prev, errorMsg]);
      setNotifications(prev => [{ id: `ai-error-${Date.now()}`, timestamp: Date.now(), level: 'CRITICAL', message: 'AI chat service error.', source: 'AI_CHAT' }, ...prev]);
    } finally {
      setAiStatus('IDLE');
    }
  }, [chatInput]);

  // --- Formatting Utilities ---
  const formatCurrency = useCallback((val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val), []);
  const formatNumber = useCallback((val: number) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(val), []);

  // --- View Render Functions (Modularized) ---

  const renderSidebar = () => (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-yellow-500 tracking-tighter">OMNI<span className="text-white">SYS</span></h1>
        <p className="text-xs text-slate-500 mt-1">Enterprise OS v9.4.2</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: 'DASHBOARD', label: 'Executive Dashboard', icon: HomeIcon },
          { id: 'MARKET_MAP', label: 'Global Market Map', icon: GlobeAltIcon },
          { id: 'AI_NEXUS', label: 'AI Command Nexus', icon: SparklesIcon },
          { id: 'RISK_CONTROL', label: 'Risk & Compliance', icon: ShieldCheckIcon },
          { id: 'PROFILE', label: 'Director Profile', icon: UserCircleIcon },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as any)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeView === item.id
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 rounded p-3 border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">{userProfile.name}</div>
              <div className="text-[10px] text-slate-500">{userProfile.role}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Session: {userProfile.activeSessionId}</span>
            <span className="text-emerald-500 flex items-center gap-1">
              <CheckCircleIcon className="w-3 h-3" /> Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const totalCap = useMemo(() => marketData.reduce((acc, curr) => acc + curr.marketCap, 0), [marketData]);
    const avgSentiment = useMemo(() => marketData.length > 0 ? marketData.reduce((acc, curr) => acc + curr.sentimentScore, 0) / marketData.length : 0, [marketData]);

    return (
      <div className="grid grid-cols-12 gap-4 h-full overflow-y-auto p-6">
        <div className="col-span-12 grid grid-cols-4 gap-4 mb-2">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950">
            <MetricBadge label="Total Market Cap" value={`$${formatNumber(totalCap)}B`} trend="up" color={THEME.primary} />
          </Card>
          <Card>
            <MetricBadge label="Global Sentiment" value={`${avgSentiment.toFixed(1)}/100`} trend={avgSentiment > 50 ? 'up' : 'down'} color={THEME.secondary} />
          </Card>
          <Card>
            <MetricBadge label="Active AI Agents" value="1,024" trend="neutral" color={THEME.success} />
          </Card>
          <Card>
            <MetricBadge label="System Latency" value="12ms" color="#F472B6" />
          </Card>
        </div>

        <div className="col-span-8 h-96">
          <Card title="Real-Time Market Velocity" className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={marketData.slice(0, 20)}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                <XAxis dataKey="ticker" stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <YAxis stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <Tooltip
                  contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border, color: THEME.textMain }}
                  itemStyle={{ color: THEME.primary }}
                  formatter={(value: number, name: string, props: any) => {
                    if (props.payload) {
                        const d = props.payload;
                        if (name === 'price') return [`$${value.toFixed(2)}`, 'Price'];
                        if (name === 'marketCap') return [`$${d.marketCap.toFixed(1)}B`, 'Market Cap'];
                    }
                    return value;
                  }}
                  labelFormatter={(label) => `Ticker: ${label}`}
                />
                <Bar dataKey="marketCap" fill={THEME.secondary} opacity={0.3} barSize={20} />
                <Line type="monotone" dataKey="price" stroke={THEME.primary} strokeWidth={2} dot={false} name="Price" />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="col-span-4 h-96">
          <Card title="Predictive Intelligence Feed" className="h-full">
            <div className="space-y-3">
              {notifications.filter(n => n.level === 'AI_INSIGHT').map(note => (
                <div key={note.id} className="p-3 bg-slate-950/50 border border-slate-800 rounded text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-400 font-bold">{note.source}</span>
                    <span className="text-slate-600">{new Date(note.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300">{note.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-12 h-64">
          <Card title="Sector Performance Matrix" className="h-full">
             <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={marketData.slice(0, 30)}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                <XAxis dataKey="sector" stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <YAxis stroke={THEME.textMuted} tick={{fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: THEME.surface, borderColor: THEME.border }} />
                <Scatter name="Volatility" dataKey="volatility" fill={THEME.danger} />
                <Bar dataKey="sentimentScore" fill={THEME.success} opacity={0.6} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    );
  };

  const renderMarketMap = () => {
    const scatterData = useMemo(() => marketData.map((d, i) => ({
      x: REGIONS.indexOf(d.region) + (Math.random() - 0.5) * 0.5, // Spread out points slightly per region
      y: d.price,
      z: d.marketCap, // Used for size/detail in tooltip
      name: d.name,
      region: d.region,
      trend: d.change > 0 ? 'up' : 'down'
    })), [marketData]);

    return (
      <div className="h-full p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Global Market Topography</h2>
          <div className="flex gap-2">
            {REGIONS.map(r => (
              <span key={r} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">{r}</span>
            ))}
          </div>
        </div>
        <Card className="flex-1 border-yellow-500/30">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChartWrapper data={scatterData} />
          </ResponsiveContainer>
        </Card>
      </div>
    );
  };

  const renderAINexus = () => (
    <div className="h-full p-6 grid grid-cols-12 gap-6">
      <div className="col-span-3 space-y-4">
        <Card title="Active Neural Models">
          <div className="space-y-2">
            {AI_MODELS.map(model => (
              <div key={model} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-xs font-mono text-slate-300">{model}</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="System Health">
          <div className="space-y-4 mt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>CPU Load</span><span>84%</span></div>
              <div className="w-full bg-slate-800 h-1 rounded"><div className="bg-blue-500 h-1 rounded w-[84%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Memory</span><span>42TB / 128TB</span></div>
              <div className="w-full bg-slate-800 h-1 rounded"><div className="bg-purple-500 h-1 rounded w-[32%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Network</span><span>140 Gbps</span></div>
              <div className="w-full bg-slate-800 h-1 rounded"><div className="bg-yellow-500 h-1 rounded w-[60%]"></div></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-span-9 flex flex-col h-full">
        <Card title="Quantum Chat Interface" className="flex-1 flex flex-col" action={<AIStatusIndicator status={aiStatus} />}>
          <div className="flex-1 overflow-y-auto space-y-4 p-4 custom-scrollbar">
            {chatHistory.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg text-sm ${
                  msg.sender === 'USER'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  <div className="text-[10px] opacity-50 mb-1 flex justify-between gap-4">
                    <span>{msg.sender === 'USER' ? 'You' : 'AI Assistant'}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {msg.text}
                </div>
              </div>
            ))}
            {aiStatus !== 'IDLE' && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg rounded-bl-none border border-slate-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            {/* Scroll to bottom */}
            <div ref={useCallback((node) => {
              if (node) node.scrollIntoView({ behavior: 'smooth' });
            }, [chatHistory])} />
          </div>
          <div className="p-4 border-t border-slate-800 bg-slate-950">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Enter command or query for AI analysis..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                disabled={aiStatus !== 'IDLE'}
              />
              <button
                onClick={handleSendMessage}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={aiStatus !== 'IDLE' || !chatInput.trim()}
              >
                EXECUTE
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRiskControl = () => (
    <div className="h-full p-6 space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <Card title="Portfolio Risk Heatmap">
          <div className="grid grid-cols-5 gap-1 h-48">
            {marketData.slice(0, 50).map(m => (
              <div
                key={m.id}
                className="rounded cursor-pointer hover:opacity-80 transition-opacity relative group"
                style={{
                  backgroundColor: m.riskFactor > 8 ? THEME.danger : m.riskFactor > 5 ? '#F59E0B' : THEME.success,
                  opacity: 0.6 + (m.riskFactor / 20)
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/80 text-[10px] text-white font-bold p-1 text-center z-10">
                  {m.ticker}<br/>Risk: {m.riskFactor.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Compliance Log">
          <div className="space-y-2 overflow-y-auto h-48 pr-2 custom-scrollbar">
            {notifications.filter(n => n.level !== 'AI_INSIGHT').map(note => (
              <div key={note.id} className="flex items-center gap-2 text-xs p-2 border-b border-slate-800">
                {note.level === 'INFO' && <CheckCircleIcon className="w-4 h-4 text-emerald-500" />}
                {note.level === 'WARNING' && <TriangleExclamationIcon className="w-4 h-4 text-yellow-500" />}
                {note.level === 'CRITICAL' && <ExclamationCircleIcon className="w-4 h-4 text-red-500" />}
                <span className="text-slate-400">{new Date(note.timestamp).toLocaleDateString()}</span>
                <span className="text-slate-200">{note.message}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Liquidity Stress Test">
          <div className="flex items-center justify-center h-48">
             <div className="relative w-32 h-32">
               <svg className="w-full h-full" viewBox="0 0 36 36">
                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={THEME.border} strokeWidth="2" />
                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke={THEME.primary} strokeWidth="2" strokeDasharray="75, 100" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-2xl font-bold text-white">75%</span>
                 <span className="text-[8px] text-slate-400 uppercase">Liquidity</span>
               </div>
             </div>
          </div>
        </Card>
      </div>
      <Card title="Anomaly Detection Timeline">
        <LineChartWrapper data={marketData.slice(0, 20)} />
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="h-full p-6 flex justify-center items-start">
      <div className="w-full max-w-2xl space-y-6">
        <Card title="Executive Profile Configuration">
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-yellow-500 border-2 border-yellow-500">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
                <p className="text-slate-400">{userProfile.role}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-900">Level {userProfile.clearanceLevel} Clearance</span>
                  <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded border border-emerald-900">Biometrics Verified</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
              <div className="space-y-2">
                <label htmlFor="theme-select" className="text-xs text-slate-500 uppercase font-bold">Interface Theme</label>
                <select id="theme-select" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-yellow-500">
                  <option>Midnight Protocol (Dark)</option>
                  <option selected={userProfile.preferences.theme === 'LIGHT'}>Daylight Operations (Light)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="risk-tolerance-select" className="text-xs text-slate-500 uppercase font-bold">Risk Tolerance AI</label>
                <select id="risk-tolerance-select" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-yellow-500">
                  <option>Conservative (Low)</option>
                  <option selected={userProfile.preferences.riskTolerance === 'MEDIUM'}>Balanced (Medium)</option>
                  <option>Aggressive (High)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-6">
              <h3 className="text-sm font-bold text-white">Automated Directives</h3>
              {[
                { label: 'Auto-Execute Stop Loss', active: true },
                { label: 'AI Sentiment Analysis Reports', active: true },
                { label: 'Quantum Encryption Layer', active: true },
                { label: 'Share Data with Global Ledger', active: false },
              ].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-sm text-slate-300">{setting.label}</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${setting.active ? 'bg-yellow-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${setting.active ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-yellow-500/30">
      {renderSidebar()}

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-wide">
              {activeView === 'DASHBOARD' && 'EXECUTIVE OVERVIEW'}
              {activeView === 'MARKET_MAP' && 'GLOBAL MARKET TOPOGRAPHY'}
              {activeView === 'AI_NEXUS' && 'ARTIFICIAL INTELLIGENCE CORE'}
              {activeView === 'RISK_CONTROL' && 'RISK & COMPLIANCE PROTOCOLS'}
              {activeView === 'PROFILE' && 'USER CONFIGURATION'}
            </h2>
            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[10px] border border-yellow-500/20 font-mono">
              LIVE FEED
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-slate-400">System Time</div>
              <div className="text-sm font-mono font-bold text-white">
                {new Date(systemTime).toLocaleTimeString()}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="flex gap-3">
              <button className="relative p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Notifications</span>
                <BellIcon className="w-6 h-6" />
                {notifications.filter(n => n.level === 'CRITICAL' || n.level === 'WARNING').length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                <Cog6ToothIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden bg-slate-950 relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
               style={{ backgroundImage: `linear-gradient(${THEME.border} 1px, transparent 1px), linear-gradient(90deg, ${THEME.border} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
          </div>

          <div className="relative z-10 h-full">
            {activeView === 'DASHBOARD' && renderDashboard()}
            {activeView === 'MARKET_MAP' && renderMarketMap()}
            {activeView === 'AI_NEXUS' && renderAINexus()}
            {activeView === 'RISK_CONTROL' && renderRiskControl()}
            {activeView === 'PROFILE' && renderProfile()}
          </div>
        </div>

        <footer className="h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 font-mono">
          <div className="flex gap-4">
            <span>STATUS: <span className="text-emerald-500">ONLINE</span></span>
            <span>LATENCY: 14ms</span>
            <span>ENCRYPTION: AES-256-GCM</span>
          </div>
          <div className="flex gap-4">
            <span>BUILD: 2024.10.05.RC4</span>
            <span>COPYRIGHT &copy; OMNISYS CORP</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default GlobalMarketMap;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/GlobalMarketMap.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/GlobalMarketMap (1).tsx
================================================================================


import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';

// --- Mock Data Generation ---

interface CompanyData {
  name: string;
  index: number;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  trend: 'up' | 'down' | 'stable';
  marketCap: number; // Used for 3D simulation representation (scatter size/position)
}

const COMPANY_NAMES = [
  'ApexFinTech', 'GlobalPay', 'SecureLedger', 'QuantumTrade', 'NexusBank',
  'VentureFlow', 'DataVault', 'SmartAssets', 'EcoCapital', 'FutureHold',
  'InnovateX', 'SynthInvest', 'CoreWallet', 'ZenithCap', 'PioneerFin',
  'AlphaOne', 'BetaCore', 'GammaLink', 'DeltaSys', 'EpsilonNet',
  'ZetaCorp', 'EtaFund', 'ThetaTrade', 'IotaBank', 'KappaSys',
  'LambdaFlow', 'MuInvest', 'NuAssets', 'XiWallet', 'OmicronCap',
  'PiTrade', 'RhoOne', 'SigmaCore', 'TauLink', 'UpsilonSys',
  'PhiFlow', 'ChiInvest', 'PsiAssets', 'OmegaWallet', 'AetherCap',
  'BlazeTrade', 'CypherOne', 'DynaCore', 'EchoLink', 'FjordSys',
  'GigaFlow', 'HaloInvest', 'InertiaAssets', 'JunoWallet', 'KiloCap',
  'LuminTrade', 'MetoOne', 'NovaCore', 'OpalLink', 'PulsarSys',
  'QuasarFlow', 'RiftInvest', 'StellarAssets', 'TerraWallet', 'UranusCap',
  'VeloTrade', 'WarpOne', 'XyloCore', 'YottaLink', 'ZephyrSys',
  'AxiomFlow', 'BrioInvest', 'CelerAssets', 'DiverWallet', 'EmberCap',
  'FluxTrade', 'GlimmerOne', 'HalyconCore', 'IgnisLink', 'JoltSys',
  'KryptonFlow', 'LassoInvest', 'MimasAssets', 'NebulaWallet', 'OrbitCap',
  'PolarTrade', 'QuillOne', 'RuneCore', 'SolaraLink', 'TorusSys',
  'UnifyFlow', 'VortexInvest', 'WispAssets', 'XenonWallet', 'YuleCap',
  'ZonalTrade', 'AuraOne', 'BoltCore', 'CrestLink', 'DuneSys',
  'EpochFlow', 'FableInvest', 'GridAssets', 'HelixWallet', 'IcarusCap',
  'JouleTrade'
];

const REGIONS: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

const generateInitialData = (): CompanyData[] => {
  return COMPANY_NAMES.slice(0, 100).map((name, i) => {
    const region = REGIONS[i % 4];
    const baseIndex = 1000 + Math.random() * 500;
    let trend: CompanyData['trend'] = 'stable';
    
    if (i % 5 === 0) trend = 'up';
    if (i % 7 === 0) trend = 'down';
    
    const marketCap = 100 + Math.pow(Math.random(), 3) * 5000; // Simulate market cap variance

    return {
      name,
      index: Math.round(baseIndex * (1 + (Math.random() - 0.5) * 0.05)),
      region,
      trend,
      marketCap,
    };
  });
};

// --- Component: MarketPoint3D (Simulated 3D point representation using Scatter size/position) ---

interface MarketPointProps {
  x?: number; // Y-Axis value (Index) - made optional for safety, though recharts provides it
  y?: number; // X-Axis value (Region/Arbitrary spread)
  size?: number; // Market Cap influence
  color?: string;
  payload?: CompanyData;
  cx?: number;
  cy?: number;
}

const MarketPoint3D: React.FC<MarketPointProps> = (props) => {
  const { cx, cy, size, color, payload } = props;

  // In a real 3D environment, we'd use transforms. Here, we map size to depth/z-effect and
  // use the 'y' position on the chart as the horizontal spread, and 'x' as the vertical elevation.
  // We use the custom dot renderer in Recharts to position elements.

  if (!cx || !cy || !size) return null;

  // Simulating depth based on size (market cap)
  const effectiveSize = Math.sqrt(size) * 1.5; // Scale size for better visual effect
  const depthEffect = (size / 5000) * 50; // Max depth offset of 50px

  // Calculate position based on region index (for visual separation)
  const regionMap: { [key in CompanyData['region']]: number } = {
    NA: 0.1,
    EU: 0.35,
    APAC: 0.6,
    LATAM: 0.85,
  };
  
  // Recharts layout automatically maps X and Y to the axes. 
  // We use the custom tooltip to convey the "3D" feel through text and size representation.
  
  return (
    <circle 
      cx={cx} // x-coordinate on chart
      cy={cy} // y-coordinate on chart
      r={effectiveSize / 4 + 2} // Radius scaled by market cap
      fill={color} 
      opacity={0.8}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

// --- Component: CustomTooltip for 3D effect ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as CompanyData;
    
    // Calculate visual depth/perspective based on market cap
    const sizeRatio = dataPoint.marketCap / 5000;
    const depth = Math.round(sizeRatio * 100); // 0 to 100 scale depth
    const indexValue = payload[0].value;

    return (
      <div className="p-3 bg-gray-900 bg-opacity-90 border border-yellow-500 text-white rounded shadow-lg text-xs font-mono">
        <p className="font-bold text-yellow-400 mb-1">{dataPoint.name}</p>
        <p>Region: <span className="font-semibold">{dataPoint.region}</span></p>
        <p>Index Value: <span className={`font-bold ${dataPoint.trend === 'up' ? 'text-green-400' : dataPoint.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{indexValue.toFixed(2)}</span></p>
        <p>Market Cap (Relative): {dataPoint.marketCap.toFixed(0)}B</p>
        <p className="mt-1 border-t border-gray-700 pt-1">
          Simulated Depth (Z-Axis): <span className="text-blue-300">{depth}%</span> (Larger Cap = Closer/Higher)
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component: GlobalMarketMap ---

const GlobalMarketMap: React.FC = () => {
  const [marketData, setMarketData] = useState<CompanyData[]>([]);
  const [time, setTime] = useState(0);

  // Initialize and Update Data (Simulating market fluctuations)
  useEffect(() => {
    setMarketData(generateInitialData());

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setMarketData(prevData => {
        return prevData.map(company => {
          const volatility = (Math.random() - 0.5) * 0.01; // +/- 1% max swing per tick
          let newIndex = company.index * (1 + volatility);

          // Keep index somewhat realistic (1000 +/- 10%)
          if (newIndex < 900) newIndex = 900 + Math.random() * 50;
          if (newIndex > 1200) newIndex = 1200 - Math.random() * 50;
          
          // Simple trend persistence simulation
          if (company.trend === 'up' && Math.random() > 0.95) company.trend = 'stable';
          if (company.trend === 'down' && Math.random() > 0.95) company.trend = 'stable';
          
          return {
            ...company,
            index: newIndex,
          };
        });
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Process data for charting: We use the structure required by Recharts.
  // To simulate a "map," we use the Region as the X-Axis categories (or we can use numerical mapping for Scatter plots).
  
  // For this 3D simulation using 2D charts, we map regions to specific numerical slots on the X-axis
  // and use the index value as the Y-axis. We rely on the Scatter component and custom dots.

  const chartData = marketData.map(d => ({
    name: d.region, // Used for grouping if needed, but Scatter is better here
    index: d.index,
    region: d.region,
    marketCap: d.marketCap,
    companyName: d.name,
    trend: d.trend,
  }));

  const regionOrder: CompanyData['region'][] = ['NA', 'EU', 'APAC', 'LATAM'];

  // Map Company data to Scatter points, leveraging the structure for rendering
  const scatterPoints = marketData.map((d, i) => {
    // Map Region to a numerical X position for separation on the chart floor
    const regionXPosition = regionOrder.indexOf(d.region); 
    
    // Use the index for the Y position (Elevation)
    // Use regionXPosition for the X position (Horizontal spread across the "map")
    
    let color = '#ccc';
    if (d.trend === 'up') color = '#10B981'; // Emerald Green
    if (d.trend === 'down') color = '#EF4444'; // Red
    if (d.region === 'NA') color = '#3B82F6'; // Blue
    if (d.region === 'EU') color = '#6366F1'; // Indigo
    if (d.region === 'APAC') color = '#F59E0B'; // Amber
    if (d.region === 'LATAM') color = '#EC4899'; // Pink
    
    return {
      x: regionXPosition, // X-coordinate on chart (Region separation)
      y: d.index,        // Y-coordinate on chart (Index Value/Elevation)
      size: d.marketCap, // Used in custom dot renderer for depth simulation
      color: color,
      payload: d,
    };
  });


  return (
    <div className="w-full h-[500px] bg-gray-950 p-4 rounded-lg shadow-2xl border border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">
        The Balcony of Prosperity: Global Market Index Simulation ({time})
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        100 Simulated Million Dollar View Companies visualized in 3D perspective using Scatter plot depth (Market Cap).
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart
          data={[{ x: 0, y: 0 }]} // Dummy data for structure, Scatter handles the points
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          {/* X-Axis represents the four major regions */}
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[-0.5, regionOrder.length - 0.5]}
            ticks={regionOrder.map((_, i) => i)}
            tickFormatter={(tick) => regionOrder[tick]}
            stroke="#9CA3AF"
            label={{ value: 'Geographic Region', position: 'bottom', fill: '#D1D5DB' }}
          />
          
          {/* Y-Axis represents the Index Value (The "Height" or Prosperity Level) */}
          <YAxis 
            domain={[950, 1250]}
            stroke="#9CA3AF"
            label={{ value: 'Index Level (Value)', angle: -90, position: 'left', fill: '#D1D5DB' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ color: 'white' }} />

          {/* Scatter component to render the individual company points */}
          <Scatter 
            data={scatterPoints} 
            shape={<MarketPoint3D />} 
            isAnimationActive={false} // Turn off animation for stable visualization
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalMarketMap;
