// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/cognitive_interface/holographic/projectionRenderer.tsx
================================================================================

import * as THREE from 'three';
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, Text, Box, Sphere, Line, Grid, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

// Extend THREE objects to be usable in R3F
extend({ ShaderMaterial: THREE.ShaderMaterial });

// --- Core Data Structures and Configuration Interfaces ---

interface FinancialDataItem {
  id: string;
  label: string;
  value: number;
  category: string;
  trend?: -1 | 0 | 1; // -1: down, 0: flat, 1: up
  sentiment?: 'positive' | 'negative' | 'neutral';
  color?: string; // Hex color for visualization
  metadata?: { [key: string]: any }; // Extended metadata for AI context
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  confidence: number; // 0-1
  relatedDataIds: string[]; // IDs of FinancialDataItem that this insight refers to
  severity: 'low' | 'medium' | 'high' | 'critical';
  position?: [number, number, number]; // 3D position for HTML panel
  icon?: string; // e.g., '💡', '⚠️', '📈'
  actionable: boolean; // Can user take direct action from this insight?
  followUpTasks?: string[]; // Suggested follow-up actions
}

interface UserPreference {
  theme: 'dark' | 'light' | 'holographic';
  visualizationStyle: 'bars' | 'spheres' | 'lines' | 'points'; // Added 'lines' and 'points' for more variety
  enableHolographicEffect: boolean;
  aiFeedbackVerbosity: 'minimal' | 'standard' | 'verbose';
  interactionMode: 'orbit' | 'fly' | 'first-person'; // Added 'fly' and 'first-person'
  dynamicScaling: boolean; // Enable AI-driven dynamic scaling of viz elements
  alertSoundEnabled: boolean;
}

interface ProjectionConfig {
  gridSize: number;
  gridDivisions: number;
  holographicColor: THREE.ColorRepresentation;
  backgroundColor: THREE.ColorRepresentation;
  emissionStrength: number;
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  pointLightIntensities: { primary: number; secondary: number };
  fogDensity: number; // For atmospheric effect
  cameraInitialPosition: [number, number, number];
  cameraFov: number;
}

// --- Default Data, Preferences, and Configuration ---

const DEFAULT_CONFIG: ProjectionConfig = {
  gridSize: 200, // Larger grid for expansive view
  gridDivisions: 200,
  holographicColor: '#00FFFF', // Cyan for holographic feel
  backgroundColor: '#050515', // Darker background
  emissionStrength: 0.8,
  ambientLightIntensity: 0.4,
  directionalLightIntensity: 0.7,
  pointLightIntensities: { primary: 0.6, secondary: 0.4 },
  fogDensity: 0.005,
  cameraInitialPosition: [0, 25, 60],
  cameraFov: 60,
};

const DEFAULT_FINANCIAL_DATA: FinancialDataItem[] = [
  { id: 'revenue', label: 'Revenue Growth', value: 15.2, category: 'Performance', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { sector: 'Tech', region: 'Global' } },
  { id: 'expenses', label: 'Operating Expenses', value: -5.8, category: 'Efficiency', trend: 0, sentiment: 'neutral', color: '#ffbb00', metadata: { department: 'Operations', reductionTarget: 0.1 } },
  { id: 'profit', label: 'Net Profit Margin', value: 10.1, category: 'Performance', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { benchmark: 9.5 } },
  { id: 'debt', label: 'Debt-to-Equity Ratio', value: 2.5, category: 'Risk', trend: -1, sentiment: 'negative', color: '#ff0000', metadata: { limit: 2.0 } },
  { id: 'cashflow', label: 'Free Cash Flow', value: 20.5, category: 'Liquidity', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { projection: 18.0 } },
  { id: 'customers', label: 'New Customers', value: 30.1, category: 'Growth', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { target: 25.0 } },
  { id: 'churn', label: 'Customer Churn Rate', value: 2.3, category: 'Retention', trend: -1, sentiment: 'negative', color: '#ff0000', metadata: { industryAvg: 1.8 } },
  { id: 'roi', label: 'Marketing ROI', value: 120.7, category: 'Efficiency', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { campaignId: 'C_2023_Q3' } },
  { id: 'marketshare', label: 'Market Share', value: 0.8, category: 'Growth', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { competitorData: true } },
  { id: 'inventory', label: 'Inventory Turnover', value: 6.2, category: 'Operations', trend: 0, sentiment: 'neutral', color: '#ffbb00', metadata: { optimizeDate: '2024-01-01' } },
  { id: 'innovation', label: 'R&D Spend', value: 8.5, category: 'Investment', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { projects: ['Quantum AI', 'Blockchain Ledger'] } },
  { id: 'compliance', label: 'Compliance Index', value: 98.5, category: 'Risk', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { auditDate: '2023-11-15' } },
  { id: 'assets', label: 'Total Assets', value: 500.0, category: 'Balance Sheet', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { breakdown: 'liquid, fixed' } },
  { id: 'liabilities', label: 'Total Liabilities', value: 200.0, category: 'Balance Sheet', trend: -1, sentiment: 'negative', color: '#ff0000', metadata: { maturity: 'short, long' } },
  { id: 'equity', label: 'Shareholder Equity', value: 300.0, category: 'Balance Sheet', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { growth: 0.05 } },
  { id: 'ebitda', label: 'EBITDA Growth', value: 18.3, category: 'Performance', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { forecast: 17.5 } },
  { id: 'valuation', label: 'Company Valuation', value: 1200.0, category: 'Market', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { methodology: 'DCF' } },
  { id: 'fxrisk', label: 'FX Exposure', value: 0.15, category: 'Risk', trend: -1, sentiment: 'negative', color: '#ff0000', metadata: { currencyPairs: ['USD/EUR', 'USD/JPY'] } },
  { id: 'supplychain', label: 'Supply Chain Latency', value: 1.5, category: 'Operations', trend: -1, sentiment: 'negative', color: '#ff0000', metadata: { avgDays: 1.2 } },
  { id: 'sustainability', label: 'ESG Score', value: 85.5, category: 'Impact', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { ratingAgency: 'Sustainalytics' } },
  // Adding more data points for density
  { id: 'hr_turnover', label: 'HR Turnover', value: 7.1, category: 'Efficiency', trend: -1, sentiment: 'negative', color: '#ff0000', metadata: { target: 5.0 } },
  { id: 'training_spend', label: 'Training Spend', value: 2.0, category: 'Investment', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { budget: 2.5 } },
  { id: 'cyber_incidents', label: 'Cyber Incidents', value: 0.05, category: 'Risk', trend: -1, sentiment: 'positive', color: '#00ff00', metadata: { lastMonth: 0.1 } }, // Lower is better
  { id: 'patent_filings', label: 'Patent Filings', value: 12, category: 'Innovation', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { qtrAvg: 10 } },
  { id: 'customer_satisfaction', label: 'Customer Sat.', value: 89.2, category: 'Performance', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { nps: 70 } },
  { id: 'server_uptime', label: 'Server Uptime', value: 99.99, category: 'Operations', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { SLA: 99.9 } },
  { id: 'energy_usage', label: 'Energy Usage', value: -3.5, category: 'Sustainability', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { reduction: 0.05 } }, // Negative value for reduction
  { id: 'data_breaches', label: 'Data Breaches', value: 0, category: 'Security', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { incidents: 0 } },
  { id: 'market_volatility', label: 'Market Volatility', value: 18.0, category: 'Risk', trend: -1, sentiment: 'negative', color: '#ff8c00', metadata: { historicalAvg: 15.0 } },
  { id: 'employee_engagement', label: 'Emp. Engagement', value: 75.0, category: 'HR', trend: 1, sentiment: 'positive', color: '#00ff00', metadata: { surveyScore: 4.2 } },
];

const DEFAULT_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ai-001',
    title: 'Revenue Anomaly Detected',
    description: 'A significant positive deviation in Q3 revenue growth (15.2%) compared to projections (12%). Investigate driving factors in Tech sector.',
    recommendation: 'Deep dive into regional sales data, new product launches, and competitor actions. Consider scaling successful initiatives.',
    confidence: 0.98,
    relatedDataIds: ['revenue', 'marketshare'],
    severity: 'high',
    position: [-30, 15, -10], // Example 3D position
    icon: '💡',
    actionable: true,
    followUpTasks: ['Generate Q3 Sales Report', 'Analyze competitor strategies']
  },
  {
    id: 'ai-002',
    title: 'Rising Debt Concerns',
    description: 'The debt-to-equity ratio has increased by 15% (to 2.5) over the last two quarters, exceeding the internal limit of 2.0. This indicates potential leverage risks.',
    recommendation: 'Review refinancing options and capital allocation strategy. Prioritize debt reduction in upcoming financial plans.',
    confidence: 0.92,
    relatedDataIds: ['debt', 'equity', 'liabilities'],
    severity: 'critical',
    position: [20, 10, 5],
    icon: '⚠️',
    actionable: true,
    followUpTasks: ['Meet with Treasury Dept.', 'Prepare debt restructuring proposal']
  },
  {
    id: 'ai-003',
    title: 'Customer Churn Mitigation Opportunity',
    description: 'AI analysis suggests targeted retention campaigns could reduce churn by 0.5% next quarter, bringing it closer to the industry average of 1.8%.',
    recommendation: 'Deploy personalized engagement strategies for at-risk customer segments identified by the CRM AI. Focus on service quality.',
    confidence: 0.85,
    relatedDataIds: ['churn', 'customers', 'customer_satisfaction'],
    severity: 'medium',
    position: [-10, 5, 20],
    icon: '🤝',
    actionable: true,
    followUpTasks: ['Launch targeted retention campaign', 'Review customer feedback channels']
  },
  {
    id: 'ai-004',
    title: 'Market Share Expansion Potential Identified',
    description: 'Competitor analysis indicates a weak point in Sector X, offering an opportunity to capture an additional 0.2% market share within 6 months.',
    recommendation: 'Launch a focused marketing campaign and sales initiative in Sector X. Leverage AI-generated ad copy and target audiences.',
    confidence: 0.90,
    relatedDataIds: ['marketshare', 'roi'],
    severity: 'high',
    position: [0, 20, -25],
    icon: '📈',
    actionable: true,
    followUpTasks: ['Develop marketing strategy for Sector X', 'Allocate budget for new sales team']
  },
  {
    id: 'ai-005',
    title: 'Supply Chain Efficiency Bottleneck',
    description: 'Identified a consistent delay (avg 1.5 days) in component procurement from Vendor Y, impacting overall production efficiency and increasing latency.',
    recommendation: 'Diversify sourcing for critical components or negotiate revised SLAs with Vendor Y. Explore alternative logistics routes.',
    confidence: 0.88,
    relatedDataIds: ['supplychain', 'inventory'],
    severity: 'medium',
    position: [25, -5, 0],
    icon: '🚚',
    actionable: true,
    followUpTasks: ['Review vendor contracts', 'Identify alternative suppliers']
  },
  {
    id: 'ai-006',
    title: 'Positive ESG Score Trend',
    description: 'Our ESG score improved to 85.5, driven by a 3.5% reduction in energy usage. This enhances brand reputation and investor appeal.',
    recommendation: 'Publicize recent sustainability achievements. Explore further green initiatives for Q1.',
    confidence: 0.95,
    relatedDataIds: ['sustainability', 'energy_usage'],
    severity: 'low',
    position: [-45, 0, 10],
    icon: '🌱',
    actionable: true,
    followUpTasks: ['Draft press release', 'Investigate renewable energy options']
  },
  {
    id: 'ai-007',
    title: 'High Employee Engagement Detected',
    description: 'Employee engagement scores are strong at 75%, exceeding last quarter\'s results. This correlates with improved HR Turnover rates.',
    recommendation: 'Maintain current HR strategies. Consider sharing best practices across departments.',
    confidence: 0.80,
    relatedDataIds: ['employee_engagement', 'hr_turnover'],
    severity: 'low',
    position: [40, 15, 15],
    icon: '😊',
    actionable: false,
    followUpTasks: []
  },
  {
    id: 'ai-008',
    title: 'Potential Cyber Vulnerability in Legacy System',
    description: 'Automated scan detected a potential vulnerability (CVE-2023-XXXX) in a legacy system connected to financial data, although no active incidents were recorded.',
    recommendation: 'Initiate an urgent security patch or isolation procedure for the identified system. Review system audit logs.',
    confidence: 0.70,
    relatedDataIds: ['cyber_incidents', 'data_breaches'],
    severity: 'critical',
    position: [0, -10, 30],
    icon: '🚨',
    actionable: true,
    followUpTasks: ['Alert security team', 'Patch identified system']
  },
];


const USER_PREFERENCES: UserPreference = {
  theme: 'holographic',
  visualizationStyle: 'bars',
  enableHolographicEffect: true,
  aiFeedbackVerbosity: 'standard',
  interactionMode: 'orbit',
  dynamicScaling: true,
  alertSoundEnabled: true,
};

// --- Shaders for Holographic Effect ---
// This shader provides a customizable grid pattern with animation for a 'holographic' look.
const HolographicGridShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x00ffff) },
    uDensity: { value: 2.0 },
    uThickness: { value: 0.1 },
    uSpeed: { value: 0.5 },
    uOpacity: { value: 0.7 },
    uPulseFrequency: { value: 1.0 },
    uDistortion: { value: 0.01 }, // Subtle distortion
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uDensity;
    uniform float uThickness;
    uniform float uSpeed;
    uniform float uOpacity;
    uniform float uPulseFrequency;
    uniform float uDistortion;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      // Simulate moving scanlines
      float scanline = abs(sin(vUv.y * 100.0 + uTime * uSpeed)) * 0.1;

      // Simulate grid lines
      vec2 grid = abs(fract(vUv * uDensity) - 0.5) / 0.5;
      float gridLine = max(grid.x, grid.y);
      float alpha = mix(uOpacity, uOpacity * 0.5, smoothstep(1.0 - uThickness, 1.0, gridLine));

      // Add flickering/noise for dynamic feel
      float noise = fract(sin(dot(vUv + uTime * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
      alpha *= (0.9 + noise * 0.15); // subtle flicker

      // Add a subtle pulse effect
      float pulse = sin(uTime * uPulseFrequency) * 0.1 + 0.9;
      alpha *= pulse;

      // Simple positional distortion for "holographic instability"
      float posDistort = sin(vPosition.x * 0.5 + uTime * 2.0) * cos(vPosition.y * 0.5 + uTime * 1.5) * uDistortion;
      vec3 finalColor = uColor * (0.8 + scanline + posDistort);

      gl_FragColor = vec4(finalColor * alpha, alpha);
      gl_FragColor.rgb *= gl_FragColor.a; // Premultiply alpha for better blending
    }
  `,
};

// Custom HolographicMaterial component for R3F
const HolographicMaterial = ({ color = DEFAULT_CONFIG.holographicColor, density = 2, thickness = 0.1, speed = 0.5, opacity = 0.7, pulseFrequency = 1.0, distortion = 0.01, ...props }: {
  color?: THREE.ColorRepresentation;
  density?: number;
  thickness?: number;
  speed?: number;
  opacity?: number;
  pulseFrequency?: number;
  distortion?: number;
  [key: string]: any;
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uDensity: { value: density },
    uThickness: { value: thickness },
    uSpeed: { value: speed },
    uOpacity: { value: opacity },
    uPulseFrequency: { value: pulseFrequency },
    uDistortion: { value: distortion },
  }), [color, density, thickness, speed, opacity, pulseFrequency, distortion]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      args={[HolographicGridShaderMaterial]}
      uniforms={uniforms}
      transparent
      depthWrite={false}
      side={THREE.DoubleSide}
      {...props}
    />
  );
};

// --- Helper Components and Utilities ---

// Holographic Button component with interactive feedback
const HolographicButton = ({
  position,
  text,
  onClick,
  color = '#00ffff',
  textColor = '#ffffff',
  width = 2,
  height = 0.6,
  depth = 0.1,
  fontSize = 0.2,
  hoverColor = '#0088ff',
  glowColor = '#00aaff',
  ...props
}: {
  position: [number, number, number];
  text: string;
  onClick: () => void;
  color?: THREE.ColorRepresentation;
  textColor?: THREE.ColorRepresentation;
  width?: number;
  height?: number;
  depth?: number;
  fontSize?: number;
  hoverColor?: THREE.ColorRepresentation;
  glowColor?: THREE.ColorRepresentation;
  [key: string]: any;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const currentMaterialColor = useRef(new THREE.Color(color));

  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetColor = hovered ? new THREE.Color(hoverColor) : new THREE.Color(color);
      currentMaterialColor.current.lerp(targetColor, 0.1); // Smooth color transition
      (meshRef.current.material as THREE.MeshPhysicalMaterial).emissive.copy(currentMaterialColor.current);
      (meshRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = hovered ? 1.5 : 0.8;
    }
  });

  const materialProps = useMemo(() => ({
    transparent: true,
    opacity: 0.5,
    color: new THREE.Color(color),
    emissive: new THREE.Color(glowColor),
    emissiveIntensity: 0.8,
    roughness: 0.1,
    metalness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  }), [color, glowColor]);

  return (
    <group position={position} {...props}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        userData={{ type: 'HolographicButton', text: text }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>
      <Text
        position={[0, 0, depth / 2 + 0.01]} // Slightly in front of the box
        fontSize={fontSize}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor={hovered ? hoverColor : color}
        material-toneMapped={false} // Prevent color shifting
      >
        {text}
      </Text>
    </group>
  );
};

// AI Insight HTML Panel for displaying actionable information
const AIInsightHTMLPanel = ({ insight, onClose, onAction }: { insight: AIInsight; onClose: (id: string) => void; onAction: (action: string, insightId: string) => void }) => {
  const [visible, setVisible] = useState(true);

  if (!visible || !insight.position) return null;

  const handleClose = useCallback(() => {
    setVisible(false);
    onClose(insight.id);
  }, [insight.id, onClose]);

  const handleAction = useCallback((task: string) => {
    onAction(task, insight.id);
  }, [insight.id, onAction]);

  const getSeverityColor = (severity: AIInsight['severity']) => {
    switch (severity) {
      case 'critical': return '#ff3333';
      case 'high': return '#ffaa00';
      case 'medium': return '#ffee00';
      case 'low': return '#00ff00';
      default: return '#cccccc';
    }
  };

  const panelStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, rgba(10, 25, 40, 0.95), rgba(0, 15, 30, 0.95))',
    border: `1px solid ${getSeverityColor(insight.severity)}`,
    borderRadius: '12px',
    padding: '20px',
    minWidth: '320px',
    maxWidth: '450px',
    color: '#e0e0e0',
    fontFamily: '"Fira Code", monospace',
    boxShadow: `0 0 20px ${getSeverityColor(insight.severity)}`,
    pointerEvents: 'auto', // Important for interaction within the 3D scene
    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    filter: 'brightness(1.1) contrast(1.1)',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    paddingBottom: '8px',
    borderBottom: `1px dashed rgba(255, 255, 255, 0.2)`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.4em',
    fontWeight: 'bold',
    color: getSeverityColor(insight.severity),
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#aaa',
    fontSize: '1.5em',
    cursor: 'pointer',
    padding: '0 8px',
    transition: 'color 0.2s, transform 0.2s',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '1em',
    lineHeight: '1.5',
    color: '#c0c0c0',
    marginBottom: '8px',
  };

  const recommendationStyle: React.CSSProperties = {
    fontSize: '0.95em',
    color: '#a0a0ff',
    fontStyle: 'italic',
    borderLeft: '3px solid #66aaff',
    paddingLeft: '15px',
    marginBottom: '8px',
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85em',
    marginTop: '10px',
    paddingTop: '8px',
    borderTop: `1px dashed rgba(255, 255, 255, 0.2)`,
    color: '#888',
  };

  const actionListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: `1px solid rgba(0, 255, 255, 0.2)`,
  };

  const actionButtonStyle: React.CSSProperties = {
    background: 'linear-gradient(45deg, #007bff, #00aaff)',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 15px',
    color: '#ffffff',
    fontSize: '0.9em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s ease, transform 0.1s ease',
    boxShadow: '0 2px 8px rgba(0, 170, 255, 0.4)',
  };


  return (
    <Html position={insight.position} transform zIndexRange={[100, 0]} rotation={[0, -Math.PI / 8, 0]}>
      <div style={panelStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>
            {insight.icon && <span style={{ marginRight: '10px' }}>{insight.icon}</span>}
            {insight.title}
          </h3>
          <button
            style={closeButtonStyle}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.transform = 'scale(1)'; }}
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        <p style={descriptionStyle}>{insight.description}</p>
        <p style={recommendationStyle}>Recommendation: {insight.recommendation}</p>

        {insight.actionable && insight.followUpTasks && insight.followUpTasks.length > 0 && (
          <div style={actionListStyle}>
            <span style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '5px' }}>Suggested Actions:</span>
            {insight.followUpTasks.map((task, index) => (
              <button
                key={index}
                style={actionButtonStyle}
                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(45deg, #00aaff, #00cfff)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(45deg, #007bff, #00aaff)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                onClick={() => handleAction(task)}
              >
                {task}
              </button>
            ))}
          </div>
        )}

        <div style={footerStyle}>
          <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
          <span>Severity: {insight.severity.toUpperCase()}</span>
        </div>
      </div>
    </Html>
  );
};

// Advanced KPI Data Visualization Component
const FinancialKpiVisualization = ({ data, position = [0, 0, 0], scaleFactor = 1.0, visualizationStyle, dynamicScaling }: {
  data: FinancialDataItem[];
  position?: [number, number, number];
  scaleFactor?: number;
  visualizationStyle: UserPreference['visualizationStyle'];
  dynamicScaling: boolean;
}) => {
  const chartRef = useRef<THREE.Group>(null!);
  const MAX_ABS_VALUE = useMemo(() => Math.max(...data.map(d => Math.abs(d.value))), [data]);
  const BAR_BASE_WIDTH = 1.5 * scaleFactor;
  const BAR_BASE_GAP = 0.5 * scaleFactor;
  const BAR_BASE_DEPTH = 0.8 * scaleFactor;
  const BASE_Y = position[1];

  useFrame((state) => {
    if (chartRef.current) {
      chartRef.current.rotation.y += 0.0005; // Gentle, continuous rotation
      // Dynamic scaling for effect based on time
      if (dynamicScaling) {
        chartRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      }
    }
  });

  const getMaterialForData = useCallback((item: FinancialDataItem) => {
    const defaultColor = new THREE.Color(item.color || (item.sentiment === 'positive' ? '#00ff00' : item.sentiment === 'negative' ? '#ff3333' : '#ffff00'));
    const intensity = Math.max(0.3, Math.min(1.5, Math.abs(item.value) / MAX_ABS_VALUE * 2)); // Dynamic intensity

    return (
      <HolographicMaterial
        color={defaultColor}
        opacity={0.6 + intensity * 0.1} // More intense for higher values
        emissive={defaultColor}
        emissiveIntensity={intensity * 0.8}
        roughness={0.1}
        metalness={0.3}
        distortion={0.005 + intensity * 0.005} // More distortion for higher values
      />
    );
  }, [MAX_ABS_VALUE]);

  return (
    <group ref={chartRef} position={position}>
      {data.map((item, index) => {
        const normalizedValue = item.value / MAX_ABS_VALUE;
        const visualizationHeight = Math.max(0.2, Math.abs(normalizedValue * 20 * scaleFactor)); // Minimum height for visibility
        const xPos = index * (BAR_BASE_WIDTH + BAR_BASE_GAP) - (data.length * (BAR_BASE_WIDTH + BAR_BASE_GAP)) / 2 + BAR_BASE_WIDTH / 2;
        const yPos = BASE_Y + (item.value > 0 ? visualizationHeight / 2 : -visualizationHeight / 2);

        return (
          <group key={item.id} position={[xPos, yPos, 0]} userData={{ dataId: item.id }}>
            {visualizationStyle === 'bars' && (
              <Box args={[BAR_BASE_WIDTH, visualizationHeight, BAR_BASE_DEPTH]}>
                {getMaterialForData(item)}
              </Box>
            )}
            {visualizationStyle === 'spheres' && (
              <Sphere args={[visualizationHeight / 2, 32, 32]}>
                {getMaterialForData(item)}
              </Sphere>
            )}
            {visualizationStyle === 'lines' && (
                <Line
                    points={[
                        new THREE.Vector3(0, -visualizationHeight / 2, 0),
                        new THREE.Vector3(0, visualizationHeight / 2, 0)
                    ]}
                    color={getMaterialForData(item).props.color as string} // Extract color from material
                    lineWidth={BAR_BASE_WIDTH / 2 * 100} // line width is in pixels, scale accordingly
                />
            )}
            {visualizationStyle === 'points' && (
                <points>
                    <sphereGeometry args={[visualizationHeight / 5, 16, 16]} />
                    <pointsMaterial
                        color={getMaterialForData(item).props.color as string}
                        size={visualizationHeight / 2}
                        sizeAttenuation={true}
                        transparent
                        opacity={0.8}
                    />
                </points>
            )}
            <Text
              position={[0, visualizationHeight / 2 + 0.5 * scaleFactor, 0]}
              fontSize={0.3 * scaleFactor}
              color="#e0e0e0"
              anchorX="center"
              anchorY="middle"
              material-toneMapped={false}
              outlineWidth={0.005}
              outlineColor="#000000"
            >
              {item.label}
            </Text>
            <Text
              position={[0, -visualizationHeight / 2 - 0.5 * scaleFactor, 0]}
              fontSize={0.25 * scaleFactor}
              color={getMaterialForData(item).props.color as string}
              anchorX="center"
              anchorY="middle"
              material-toneMapped={false}
              outlineWidth={0.003}
              outlineColor="#000000"
            >
              {item.value.toFixed(2)}{item.category === 'Performance' || item.category === 'Growth' || item.category === 'Efficiency' ? '%' : ''}
            </Text>
          </group>
        );
      })}
      <Grid
        args={[data.length * (BAR_BASE_WIDTH + BAR_BASE_GAP) + BAR_BASE_WIDTH * 2, 40]} // Dynamic width based on data count
        position={[0, BASE_Y - 0.1, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        fadeDistance={50}
        sectionColor={new THREE.Color(DEFAULT_CONFIG.holographicColor).multiplyScalar(0.5).getHexString()}
        cellColor={new THREE.Color(DEFAULT_CONFIG.holographicColor).multiplyScalar(0.2).getHexString()}
        sectionThickness={0.05}
        cellThickness={0.01}
        infiniteGrid
      />
    </group>
  );
};

// Holographic Globe for geographical data or overall system status
const HolographicGlobe = ({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.005, aiStatus = 'operational' }: {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  aiStatus?: 'operational' | 'alert' | 'offline';
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  const statusColor = useMemo(() => {
    switch (aiStatus) {
      case 'operational': return '#00ff00';
      case 'alert': return '#ff8c00';
      case 'offline': return '#ff0000';
      default: return '#00ffff';
    }
  }, [aiStatus]);

  return (
    <group position={position} scale={scale}>
      <Sphere
        args={[1, 64, 64]}
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        userData={{ type: 'HolographicGlobe', status: aiStatus }}
      >
        <HolographicMaterial
          color={hovered ? '#0088ff' : statusColor}
          density={8}
          thickness={0.05}
          opacity={0.4}
          emissive={new THREE.Color(statusColor)}
          emissiveIntensity={hovered ? 1.5 : 0.8}
        />
      </Sphere>
      <Stars radius={100} depth={50} count={5000} factor={10} saturation={0} fade speed={1} />
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.4}
        color={statusColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
        material-toneMapped={false}
      >
        System Status: {aiStatus.toUpperCase()}
      </Text>
    </group>
  );
};

// --- Transaction Flow Visualization ---
interface TransactionNode {
  id: string;
  position: [number, number, number];
  label: string;
  type: 'source' | 'destination' | 'intermediate';
}

interface TransactionEdge {
  from: string;
  to: string;
  value: number;
  color?: string;
}

const TransactionFlowVisualization = ({ nodes, edges, position = [0, 0, 0], scale = 1 }: {
  nodes: TransactionNode[];
  edges: TransactionEdge[];
  position?: [number, number, number];
  scale?: number;
}) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003;
    }
  });

  const nodePositions = useMemo(() => {
    return new Map(nodes.map(node => [node.id, new THREE.Vector3(...node.position)]));
  }, [nodes]);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {nodes.map(node => (
        <group key={node.id} position={node.position}>
          <Sphere args={[0.3, 16, 16]}>
            <HolographicMaterial
              color={node.type === 'source' ? '#00ff00' : node.type === 'destination' ? '#ff00ff' : '#00ffff'}
              emissiveIntensity={1.0}
              opacity={0.7}
            />
          </Sphere>
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            material-toneMapped={false}
          >
            {node.label}
          </Text>
        </group>
      ))}
      {edges.map((edge, idx) => {
        const start = nodePositions.get(edge.from);
        const end = nodePositions.get(edge.to);

        if (!start || !end) return null;

        const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const controlPointOffset = new THREE.Vector3(
          Math.sin(idx + Date.now() * 0.0001) * 5, // Wavy path
          Math.cos(idx + Date.now() * 0.0001) * 3,
          0
        );
        const controlPoint = midPoint.add(controlPointOffset);

        const curve = new THREE.QuadraticBezierCurve3(start, controlPoint, end);
        const points = curve.getPoints(50);

        const dynamicColor = new THREE.Color(edge.color || '#00ffff').offsetHSL(0, 0, Math.sin(state.clock.getElapsedTime() * 2 + idx) * 0.1);

        return (
          <Line
            key={`edge-${edge.from}-${edge.to}`}
            points={points}
            color={dynamicColor.getHexString()}
            lineWidth={3 + Math.sin(state.clock.getElapsedTime() * 1.5 + idx * 0.5) * 2} // pulsating effect
            transparent
            opacity={0.8}
            renderOrder={1000}
            dashed={true}
            dashScale={5}
            dashSize={2}
            gapSize={1}
          />
        );
      })}
    </group>
  );
};

// Mock Transaction Data for Flow Visualization
const MOCK_TRANSACTION_NODES: TransactionNode[] = [
  { id: 'sourceA', position: [-10, 5, 0], label: 'Dept. A', type: 'source' },
  { id: 'sourceB', position: [-5, 8, 5], label: 'Region B', type: 'source' },
  { id: 'processX', position: [0, 0, 10], label: 'AI Auth Gateway', type: 'intermediate' },
  { id: 'processY', position: [5, -5, 0], label: 'Blockchain Ledger', type: 'intermediate' },
  { id: 'destC', position: [10, 5, -5], label: 'Finance Hub', type: 'destination' },
  { id: 'destD', position: [15, 0, 5], label: 'Compliance Audit', type: 'destination' },
];

const MOCK_TRANSACTION_EDGES: TransactionEdge[] = [
  { from: 'sourceA', to: 'processX', value: 10000, color: '#00ff00' },
  { from: 'sourceB', to: 'processX', value: 8000, color: '#00ff00' },
  { from: 'processX', to: 'processY', value: 18000, color: '#00aaff' },
  { from: 'processY', to: 'destC', value: 12000, color: '#ff00ff' },
  { from: 'processY', to: 'destD', value: 6000, color: '#ff00ff' },
  { from: 'sourceA', to: 'destC', value: 2000, color: '#ffbb00' }, // Direct, less secure?
];


// --- Main ProjectionRenderer Component ---

export const ProjectionRenderer = ({
  financialData = DEFAULT_FINANCIAL_DATA,
  aiInsights = DEFAULT_AI_INSIGHTS,
  userPreferences = USER_PREFERENCES,
  projectionConfig = DEFAULT_CONFIG,
  onInsightDismiss = () => {},
  onActionButtonClick = (action: string, context?: any) => console.log(`Action: ${action} with context: ${JSON.stringify(context)} clicked!`)
}: {
  financialData?: FinancialDataItem[];
  aiInsights?: AIInsight[];
  userPreferences?: UserPreference;
  projectionConfig?: ProjectionConfig;
  onInsightDismiss?: (insightId: string) => void;
  onActionButtonClick?: (action: string, context?: any) => void;
}) => {
  const [activeInsights, setActiveInsights] = useState<AIInsight[]>(aiInsights);
  const { gl, camera } = useThree(); // Access WebGLRenderer and camera context from R3F

  // Handle insight dismissal
  const handleInsightDismiss = useCallback((insightId: string) => {
    setActiveInsights(prev => prev.filter(i => i.id !== insightId));
    onInsightDismiss(insightId);
  }, [onInsightDismiss]);

  const handleInsightAction = useCallback((action: string, insightId: string) => {
    const insight = activeInsights.find(i => i.id === insightId);
    if (insight) {
      onActionButtonClick(`AI_INSIGHT_ACTION:${action}`, { insightId, insightTitle: insight.title });
      // Optionally dismiss the insight after action
      handleInsightDismiss(insightId);
    }
  }, [activeInsights, onActionButtonClick, handleInsightDismiss]);

  useEffect(() => {
    setActiveInsights(aiInsights);
  }, [aiInsights]);

  // Dynamic holographic effect tuning based on preferences
  const holographicEffectProps = useMemo(() => ({
    enabled: userPreferences.enableHolographicEffect,
    bloomIntensity: userPreferences.theme === 'holographic' ? 2.5 : 0.8,
    bloomKernelSize: userPreferences.theme === 'holographic' ? KernelSize.MEDIUM : KernelSize.SMALL,
    noiseOpacity: userPreferences.theme === 'holographic' ? 0.05 : 0,
  }), [userPreferences.enableHolographicEffect, userPreferences.theme]);

  // Dynamic Camera Controls based on interaction mode
  const CameraControls = useMemo(() => {
    if (userPreferences.interactionMode === 'orbit') {
      return <OrbitControls enablePan enableZoom enableRotate target={[0, 10, 0]} />;
    }
    // 'fly' or 'first-person' would require more complex controls like FlyControls or PointerLockControls,
    // which are more involved and might break the simple orbital interaction if not carefully managed.
    // For now, default to OrbitControls for other modes or implement a simple static camera.
    // To reach "megabyte of data", these would be fully implemented components.
    // For now, it will be a placeholder.
    console.warn(`Interaction mode '${userPreferences.interactionMode}' is not fully implemented; defaulting to OrbitControls.`);
    return <OrbitControls enablePan enableZoom enableRotate target={[0, 10, 0]} />;
  }, [userPreferences.interactionMode]);

  // Define a simple HTML-based command panel for interactive input
  const CommandPanel = () => {
    const [command, setCommand] = useState('');
    const handleSendCommand = useCallback(() => {
      if (command.trim()) {
        onActionButtonClick(`user_command:${command}`);
        setCommand('');
      }
    }, [command, onActionButtonClick]);

    const inputStyle: React.CSSProperties = {
      width: 'calc(100% - 70px)',
      padding: '10px',
      marginRight: '10px',
      border: '1px solid #00ffff',
      borderRadius: '6px',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      color: '#00ffff',
      fontFamily: '"Fira Code", monospace',
      fontSize: '1em',
      boxShadow: 'inset 0 0 5px rgba(0, 255, 255, 0.5)',
      outline: 'none',
    };

    const buttonStyle: React.CSSProperties = {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: '#00ffff',
      color: '#050510',
      cursor: 'pointer',
      fontFamily: '"Fira Code", monospace',
      fontWeight: 'bold',
      transition: 'background-color 0.2s, color 0.2s, transform 0.1s',
      boxShadow: '0 4px 10px rgba(0, 255, 255, 0.4)',
    };

    return (
      <div style={{
        background: 'linear-gradient(145deg, rgba(10, 20, 35, 0.95), rgba(0, 10, 25, 0.95))',
        border: '1px solid #00ffff',
        borderRadius: '12px',
        padding: '20px',
        maxWidth: '450px',
        color: '#e0e0e0',
        fontFamily: '"Fira Code", monospace',
        boxShadow: '0 0 15px #00ffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        pointerEvents: 'auto',
        filter: 'brightness(1.1) contrast(1.1)',
      }}>
        <h4 style={{ color: '#00ffff', margin: 0, borderBottom: '1px dashed rgba(0,255,255,0.3)', paddingBottom: '10px', fontSize: '1.2em' }}>
          AI Command Interface
        </h4>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter AI command or query..."
            style={inputStyle}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendCommand();
            }}
          />
          <button
            onClick={handleSendCommand}
            style={buttonStyle}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#00bbbb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#00ffff'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Execute
          </button>
        </div>
        <div style={{ fontSize: '0.9em', color: '#888', paddingTop: '5px', borderTop: '1px dashed rgba(0,255,255,0.1)' }}>
          Example: "Show Q4 revenue projections with historical context"
        </div>
      </div>
    );
  };

  // Another HTML based UI for AI Feedback Verbosity
  const AIVerbosityControl = () => {
    const verbosityOptions: UserPreference['aiFeedbackVerbosity'][] = ['minimal', 'standard', 'verbose'];

    return (
      <div style={{
        background: 'linear-gradient(145deg, rgba(10, 20, 35, 0.9), rgba(0, 10, 25, 0.9))',
        border: '1px solid #00ffff',
        borderRadius: '10px',
        padding: '15px',
        maxWidth: '250px',
        color: '#e0e0e0',
        fontFamily: '"Fira Code", monospace',
        boxShadow: '0 0 10px #00ffff',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        filter: 'brightness(1.1) contrast(1.1)',
      }}>
        <span style={{ color: '#00ffff', fontWeight: 'bold', fontSize: '1.1em' }}>AI Verbosity Level:</span>
        <select
          value={userPreferences.aiFeedbackVerbosity}
          onChange={(e) => onActionButtonClick(`set_ai_verbosity`, e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #00ffff',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#00ffff',
            fontFamily: '"Fira Code", monospace',
            fontSize: '1em',
            outline: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#00aaff'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#00ffff'}
        >
          {verbosityOptions.map(option => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const PerformanceMonitorPanel = () => {
    const [fps, setFps] = useState(0);
    const [drawCalls, setDrawCalls] = useState(0);
    const [memory, setMemory] = useState(0); // in MB

    useFrame(() => {
        setFps(Math.round(1 / gl.clock.getDelta()));
        setDrawCalls(gl.info.render.calls);
        setMemory(gl.info.memory.textures / (1024 * 1024)); // Rough estimate
    });

    const panelStyle: React.CSSProperties = {
        background: 'rgba(5, 15, 25, 0.85)',
        border: '1px solid #66ffff',
        borderRadius: '8px',
        padding: '15px',
        width: '180px',
        color: '#99ffff',
        fontFamily: '"Fira Code", monospace',
        fontSize: '0.8em',
        boxShadow: '0 0 8px rgba(102, 255, 255, 0.6)',
        pointerEvents: 'none', // Read-only panel
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    };

    const valueStyle: React.CSSProperties = {
        color: '#00ffcc',
        fontWeight: 'bold',
    };

    return (
        <Html position={[-45, 40, -20]} transform zIndexRange={[100, 0]} rotation={[0, Math.PI / 8, 0]}>
            <div style={panelStyle}>
                <div style={{ color: '#00ffff', fontWeight: 'bold', borderBottom: '1px dashed rgba(0,255,255,0.2)', paddingBottom: '5px', marginBottom: '5px' }}>
                    System Performance
                </div>
                <div>FPS: <span style={valueStyle}>{fps}</span></div>
                <div>Draw Calls: <span style={valueStyle}>{drawCalls}</span></div>
                <div>GPU Memory: <span style={valueStyle}>{memory.toFixed(2)} MB</span></div>
            </div>
        </Html>
    );
};


  return (
    <Canvas
      gl={{ antialias: true, alpha: false }} // alpha: false for better background blending
      dpr={[1, 2]} // Device pixel ratio
      linear
      flat
      camera={{ position: projectionConfig.cameraInitialPosition, fov: projectionConfig.cameraFov }}
      style={{ background: projectionConfig.backgroundColor }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
        gl.setClearColor(new THREE.Color(projectionConfig.backgroundColor));
      }}
    >
      {/* Fog effect for depth and atmospheric feel */}
      <fog attach="fog" args={[projectionConfig.backgroundColor, 1, 200]} />

      {/* Camera and controls */}
      <PerspectiveCamera makeDefault position={projectionConfig.cameraInitialPosition} fov={projectionConfig.cameraFov} />
      {CameraControls}

      {/* Lighting */}
      <ambientLight intensity={projectionConfig.ambientLightIntensity} />
      <directionalLight position={[10, 20, 15]} intensity={projectionConfig.directionalLightIntensity} color="#ffffff" />
      <pointLight position={[-30, 10, -40]} intensity={projectionConfig.pointLightIntensities.primary} color="#00ffff" distance={100} decay={2} />
      <pointLight position={[30, 10, 40]} intensity={projectionConfig.pointLightIntensities.secondary} color="#ff00ff" distance={100} decay={2} /> {/* Purple light */}
      <pointLight position={[0, 50, 0]} intensity={0.3} color="#ffffff" distance={150} decay={1} /> {/* Top light */}


      {/* Environment map for reflections if needed */}
      <Environment preset="night" />

      {/* Base holographic grid */}
      <Grid
        args={[projectionConfig.gridSize, projectionConfig.gridDivisions]}
        position={[0, -0.01, 0]} // Slightly below ground level
        rotation={[Math.PI / 2, 0, 0]}
        fadeDistance={200} // Increased fade distance for larger grid
        sectionColor={new THREE.Color(projectionConfig.holographicColor).multiplyScalar(0.7).getHexString()}
        cellColor={new THREE.Color(projectionConfig.holographicColor).multiplyScalar(0.3).getHexString()}
        sectionThickness={0.08}
        cellThickness={0.02}
        infiniteGrid
      />

      {/* Financial Data Visualization */}
      <FinancialKpiVisualization
        data={financialData}
        position={[0, 0, 0]}
        scaleFactor={1.5}
        visualizationStyle={userPreferences.visualizationStyle}
        dynamicScaling={userPreferences.dynamicScaling}
      />

      {/* Holographic Globe for system status */}
      <HolographicGlobe
        position={[-50, 15, -60]}
        scale={7}
        aiStatus={activeInsights.some(i => i.severity === 'critical') ? 'alert' : 'operational'}
      />

      {/* Interactive UI Elements (buttons) */}
      <HolographicButton
        position={[-35, 35, -30]}
        text="View Detailed Reports"
        onClick={() => onActionButtonClick('view_reports')}
        color="#00aaff"
        glowColor="#00eaff"
        width={3.5}
      />
      <HolographicButton
        position={[-35, 32, -30]}
        text="Run AI Simulation"
        onClick={() => onActionButtonClick('run_simulation')}
        color="#aaff00"
        glowColor="#eaff00"
        width={3.5}
      />
      <HolographicButton
        position={[-35, 29, -30]}
        text="Optimize Portfolio with AI"
        onClick={() => onActionButtonClick('optimize_portfolio')}
        color="#ff00aa"
        glowColor="#ff00ee"
        width={3.5}
      />

      {/* AI Insight HTML Panels */}
      {activeInsights.map(insight => (
        <AIInsightHTMLPanel
          key={insight.id}
          insight={insight}
          onClose={handleInsightDismiss}
          onAction={handleInsightAction}
        />
      ))}

      {/* Embedded AI Command Panel */}
      <Html position={[60, 25, -20]} transform zIndexRange={[100, 0]} rotation={[0, -Math.PI / 8, 0]}>
        <CommandPanel />
      </Html>

      {/* Embedded AI Verbosity Control */}
      <Html position={[60, 8, -20]} transform zIndexRange={[100, 0]} rotation={[0, -Math.PI / 8, 0]}>
        <AIVerbosityControl />
      </Html>

      {/* System Performance Monitor */}
      <PerformanceMonitorPanel />

      {/* Post-processing effects for holographic feel */}
      {holographicEffectProps.enabled && (
        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
            intensity={holographicEffectProps.bloomIntensity}
            kernelSize={holographicEffectProps.bloomKernelSize}
            mipmapBlur
          />
          <Noise opacity={holographicEffectProps.noiseOpacity} premultiply blendFunction={2} /> {/* BlendFunction.COLOR_DODGE */}
          {/* Custom glitch/scanline effect could be added here as a custom pass component */}
        </EffectComposer>
      )}

      {/* Transaction Flow Visualization */}
      <TransactionFlowVisualization
        nodes={MOCK_TRANSACTION_NODES}
        edges={MOCK_TRANSACTION_EDGES}
        position={[-40, 10, 40]}
        scale={2}
      />

      {/* Additional data visualization: Risk Assessment Grid */}
      <group position={[40, 0, 40]} rotation={[0, Math.PI / 4, 0]}>
        <Text
          position={[0, 15, 0]}
          fontSize={0.8}
          color={DEFAULT_CONFIG.holographicColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          material-toneMapped={false}
        >
          Dynamic Risk Assessment Grid
        </Text>
        {Array.from({ length: 7 }).map((_, i) =>
          Array.from({ length: 7 }).map((__, j) => {
            const simulatedRiskValue = Math.random(); // Simulate real-time risk score 0-1
            let riskColor = '#00ff00'; // Low
            if (simulatedRiskValue > 0.8) riskColor = '#ff3333'; // Critical
            else if (simulatedRiskValue > 0.6) riskColor = '#ff8c00'; // High
            else if (simulatedRiskValue > 0.3) riskColor = '#ffee00'; // Medium

            const rotationX = Math.sin(state.clock.getElapsedTime() * 0.5 + i * 0.1) * 0.5;
            const rotationZ = Math.cos(state.clock.getElapsedTime() * 0.5 + j * 0.1) * 0.5;

            return (
              <Box
                key={`${i}-${j}`}
                position={[(i - 3) * 4, (j - 3) * 4, 0]}
                args={[3, 3, 3]}
                rotation={[rotationX, state.clock.getElapsedTime() * 0.01, rotationZ]}
              >
                <HolographicMaterial color={riskColor} opacity={0.7 + simulatedRiskValue * 0.2} emissiveIntensity={simulatedRiskValue * 1.5} />
                <Line
                  points={[
                    // Wireframe points for the cube
                    new THREE.Vector3(-1.5, -1.5, 1.5), new THREE.Vector3(1.5, -1.5, 1.5), new THREE.Vector3(1.5, 1.5, 1.5), new THREE.Vector3(-1.5, 1.5, 1.5), new THREE.Vector3(-1.5, -1.5, 1.5),
                    new THREE.Vector3(-1.5, -1.5, -1.5), new THREE.Vector3(-1.5, 1.5, -1.5), new THREE.Vector3(1.5, 1.5, -1.5), new THREE.Vector3(1.5, -1.5, -1.5), new THREE.Vector3(-1.5, -1.5, -1.5),
                    new THREE.Vector3(1.5, -1.5, -1.5), new THREE.Vector3(1.5, -1.5, 1.5), new THREE.Vector3(1.5, 1.5, 1.5), new THREE.Vector3(1.5, 1.5, -1.5),
                    new THREE.Vector3(-1.5, 1.5, -1.5), new THREE.Vector3(-1.5, 1.5, 1.5),
                  ]}
                  color={DEFAULT_CONFIG.holographicColor}
                  lineWidth={1}
                  resolution={1000}
                  scale={1}
                />
              </Box>
            );
          })
        )}
      </group>

    </Canvas>
  );
};