// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/routes.ts
================================================================================


import React from 'react';
import { 
  LayoutDashboard, Building2, Users, Database, ShieldCheck, Cpu, Key, 
  ArrowLeftRight, CreditCard, FileText, Leaf, MessageSquare, 
  Settings as SettingsIcon, Network, Zap, ShieldAlert, Bitcoin, 
  Hammer, FileLock2, BookOpen, Radio, Gift, Code, BrainCircuit, Image as ImageIcon, 
  FileJson, Box, Activity, Gavel, Map
} from 'lucide-react';

import Overview from './Overview';
import InternalAccounts from './InternalAccounts';
import Counterparties from './Counterparties';
import Connectivity from './Connectivity';
import Documents from './Documents';
import Simulation from './Simulation';
import DCRManagement from './DCRManagement';
import Payments from './Payments';
import Cards from './Cards';
import AnalyticsReport from './AnalyticsReport';
import Sustainability from './Sustainability';
import Advisor from './Advisor';
import Settings from './Settings';
import VirtualAccounts from './VirtualAccounts';
import Flows from './Flows';
import Validations from './Validations';
import CryptoTerminal from './CryptoTerminal';
import CryptView from './CryptView';
import PrivacyPolicy from './PrivacyPolicy';
import Documentation from './Documentation';
import Airdrop from './Airdrop';
import Broadcast from './Broadcast';
import TechnicalDeepDive from './TechnicalDeepDive';
import Gallery from './Gallery';
import ApiReference from './ApiReference';
import InstitutionalApps from './InstitutionalApps';
import ApiStatus from './ApiStatus';
import AppNodeRunner from './AppNodeRunner';
import PolicyManager from './PolicyManager';
import AppFactory from './AppFactory';
import AppMeshMap from './AppMeshMap';

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  label: string;
  icon: any;
  showInSidebar: boolean;
  category: 'core' | 'registry' | 'system' | 'intelligence' | 'finance' | 'admin' | 'technical';
}

export const routes: RouteConfig[] = [
  // Core App
  { path: '/overview', component: Overview, label: 'Overview', icon: LayoutDashboard, showInSidebar: true, category: 'core' },
  { path: '/broadcast', component: Broadcast, label: 'Global Node', icon: Radio, showInSidebar: true, category: 'core' },
  { path: '/gallery', component: Gallery, label: 'Artifact Archive', icon: ImageIcon, showInSidebar: true, category: 'core' },
  { path: '/registry', component: InternalAccounts, label: 'Bank Registry', icon: Building2, showInSidebar: true, category: 'registry' },
  { path: '/app-factory', component: AppFactory, label: '999 Protocol', icon: Hammer, showInSidebar: true, category: 'registry' },
  { path: '/app-mesh', component: AppMeshMap, label: 'Mesh Map', icon: Map, showInSidebar: true, category: 'registry' },
  { path: '/institutional-apps', component: InstitutionalApps, label: 'App Nodes', icon: Box, showInSidebar: true, category: 'registry' },
  { path: '/app-node/:id', component: AppNodeRunner, label: 'Node Runtime', icon: Cpu, showInSidebar: false, category: 'registry' },
  { path: '/virtual-nodes', component: VirtualAccounts, label: 'Virtual Nodes', icon: Network, showInSidebar: true, category: 'registry' },
  { path: '/crypto', component: CryptoTerminal, label: 'Asset Terminal', icon: Bitcoin, showInSidebar: true, category: 'finance' },
  { path: '/crypt', component: CryptView, label: 'Foundry', icon: Hammer, showInSidebar: true, category: 'finance' },
  { path: '/partners', component: Counterparties, label: 'Partner CRM', icon: Users, showInSidebar: true, category: 'registry' },
  { path: '/connectivity', component: Connectivity, label: 'System Fabric', icon: Database, showInSidebar: true, category: 'system' },
  { path: '/vault', component: Documents, label: 'Record Vault', icon: ShieldCheck, showInSidebar: true, category: 'system' },
  { path: '/api-reference', component: ApiReference, label: 'API Reference', icon: FileJson, showInSidebar: true, category: 'system' },
  { path: '/api-status', component: ApiStatus, label: 'System Status', icon: Activity, showInSidebar: true, category: 'system' },
  { path: '/oracle', component: Simulation, label: 'Quantum Oracle', icon: Cpu, showInSidebar: true, category: 'intelligence' },
  { path: '/flows', component: Flows, label: 'Onboarding Flows', icon: Zap, showInSidebar: true, category: 'intelligence' },
  { path: '/dcr', component: DCRManagement, label: 'DCR Registry', icon: Key, showInSidebar: true, category: 'intelligence' },
  { path: '/validator', component: Validations, label: 'Registry Validator', icon: ShieldAlert, showInSidebar: true, category: 'intelligence' },
  { path: '/payments', component: Payments, label: 'Disbursements', icon: ArrowLeftRight, showInSidebar: true, category: 'finance' },
  { path: '/cards', component: Cards, label: 'Elite Cards', icon: CreditCard, showInSidebar: true, category: 'finance' },
  { path: '/analytics', component: AnalyticsReport, label: 'Statements', icon: FileText, showInSidebar: true, category: 'finance' },
  { path: '/sustainability', component: Sustainability, label: 'Carbon Audit', icon: Leaf, showInSidebar: true, category: 'finance' },
  { path: '/advisor', component: Advisor, label: 'AI Terminal', icon: MessageSquare, showInSidebar: true, category: 'intelligence' },
  { path: '/airdrop', component: Airdrop, label: 'jocall3 Airdrop', icon: Gift, showInSidebar: true, category: 'finance' },
  { path: '/policies', component: PolicyManager, label: 'Auth Policies', icon: Gavel, showInSidebar: true, category: 'admin' },
  { path: '/manifesto', component: PrivacyPolicy, label: 'Privacy Manifesto', icon: FileLock2, showInSidebar: true, category: 'admin' },
  { path: '/documentation', component: Documentation, label: 'Documentation Core', icon: BookOpen, showInSidebar: true, category: 'admin' },
  { path: '/settings', component: Settings, label: 'System Config', icon: SettingsIcon, showInSidebar: false, category: 'admin' },

  // Technical Deep Dives (The 50 Views)
  { path: '/protocol/:slug', component: TechnicalDeepDive, label: 'Protocol Detail', icon: Code, showInSidebar: false, category: 'technical' },
  { path: '/institutional/:slug', component: TechnicalDeepDive, label: 'Institutional Spec', icon: Building2, showInSidebar: false, category: 'technical' },
  { path: '/intelligence/:slug', component: TechnicalDeepDive, label: 'Intelligence Log', icon: BrainCircuit, showInSidebar: false, category: 'technical' },
  { path: '/technical-status/:slug', component: TechnicalDeepDive, label: 'Network Node', icon: Network, showInSidebar: false, category: 'technical' }
];


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/routes.ts
================================================================================


import React from 'react';
import { 
  LayoutDashboard, Building2, Users, Database, ShieldCheck, Cpu, Key, 
  ArrowLeftRight, CreditCard, FileText, Leaf, MessageSquare, 
  Settings as SettingsIcon, Network, Zap, ShieldAlert, Bitcoin, 
  Hammer, FileLock2, BookOpen, Radio, Gift, Code, BrainCircuit, Image as ImageIcon, 
  FileJson, Box, Activity, Gavel, Map
} from 'lucide-react';

import Overview from './Overview';
import InternalAccounts from './InternalAccounts';
import Counterparties from './Counterparties';
import Connectivity from './Connectivity';
import Documents from './Documents';
import Simulation from './Simulation';
import DCRManagement from './DCRManagement';
import Payments from './Payments';
import Cards from './Cards';
import AnalyticsReport from './AnalyticsReport';
import Sustainability from './Sustainability';
import Advisor from './Advisor';
import Settings from './Settings';
import VirtualAccounts from './VirtualAccounts';
import Flows from './Flows';
import Validations from './Validations';
import CryptoTerminal from './CryptoTerminal';
import CryptView from './CryptView';
import PrivacyPolicy from './PrivacyPolicy';
import Documentation from './Documentation';
import Airdrop from './Airdrop';
import Broadcast from './Broadcast';
import TechnicalDeepDive from './TechnicalDeepDive';
import Gallery from './Gallery';
import ApiReference from './ApiReference';
import InstitutionalApps from './InstitutionalApps';
import ApiStatus from './ApiStatus';
import AppNodeRunner from './AppNodeRunner';
import PolicyManager from './PolicyManager';
import AppFactory from './AppFactory';
import AppMeshMap from './AppMeshMap';

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  label: string;
  icon: any;
  showInSidebar: boolean;
  category: 'core' | 'registry' | 'system' | 'intelligence' | 'finance' | 'admin' | 'technical';
}

export const routes: RouteConfig[] = [
  // Core App
  { path: '/overview', component: Overview, label: 'Overview', icon: LayoutDashboard, showInSidebar: true, category: 'core' },
  { path: '/broadcast', component: Broadcast, label: 'Global Node', icon: Radio, showInSidebar: true, category: 'core' },
  { path: '/gallery', component: Gallery, label: 'Artifact Archive', icon: ImageIcon, showInSidebar: true, category: 'core' },
  { path: '/registry', component: InternalAccounts, label: 'Bank Registry', icon: Building2, showInSidebar: true, category: 'registry' },
  { path: '/app-factory', component: AppFactory, label: '999 Protocol', icon: Hammer, showInSidebar: true, category: 'registry' },
  { path: '/app-mesh', component: AppMeshMap, label: 'Mesh Map', icon: Map, showInSidebar: true, category: 'registry' },
  { path: '/institutional-apps', component: InstitutionalApps, label: 'App Nodes', icon: Box, showInSidebar: true, category: 'registry' },
  { path: '/app-node/:id', component: AppNodeRunner, label: 'Node Runtime', icon: Cpu, showInSidebar: false, category: 'registry' },
  { path: '/virtual-nodes', component: VirtualAccounts, label: 'Virtual Nodes', icon: Network, showInSidebar: true, category: 'registry' },
  { path: '/crypto', component: CryptoTerminal, label: 'Asset Terminal', icon: Bitcoin, showInSidebar: true, category: 'finance' },
  { path: '/crypt', component: CryptView, label: 'Foundry', icon: Hammer, showInSidebar: true, category: 'finance' },
  { path: '/partners', component: Counterparties, label: 'Partner CRM', icon: Users, showInSidebar: true, category: 'registry' },
  { path: '/connectivity', component: Connectivity, label: 'System Fabric', icon: Database, showInSidebar: true, category: 'system' },
  { path: '/vault', component: Documents, label: 'Record Vault', icon: ShieldCheck, showInSidebar: true, category: 'system' },
  { path: '/api-reference', component: ApiReference, label: 'API Reference', icon: FileJson, showInSidebar: true, category: 'system' },
  { path: '/api-status', component: ApiStatus, label: 'System Status', icon: Activity, showInSidebar: true, category: 'system' },
  { path: '/oracle', component: Simulation, label: 'Quantum Oracle', icon: Cpu, showInSidebar: true, category: 'intelligence' },
  { path: '/flows', component: Flows, label: 'Onboarding Flows', icon: Zap, showInSidebar: true, category: 'intelligence' },
  { path: '/dcr', component: DCRManagement, label: 'DCR Registry', icon: Key, showInSidebar: true, category: 'intelligence' },
  { path: '/validator', component: Validations, label: 'Registry Validator', icon: ShieldAlert, showInSidebar: true, category: 'intelligence' },
  { path: '/payments', component: Payments, label: 'Disbursements', icon: ArrowLeftRight, showInSidebar: true, category: 'finance' },
  { path: '/cards', component: Cards, label: 'Elite Cards', icon: CreditCard, showInSidebar: true, category: 'finance' },
  { path: '/analytics', component: AnalyticsReport, label: 'Statements', icon: FileText, showInSidebar: true, category: 'finance' },
  { path: '/sustainability', component: Sustainability, label: 'Carbon Audit', icon: Leaf, showInSidebar: true, category: 'finance' },
  { path: '/advisor', component: Advisor, label: 'AI Terminal', icon: MessageSquare, showInSidebar: true, category: 'intelligence' },
  { path: '/airdrop', component: Airdrop, label: 'jocall3 Airdrop', icon: Gift, showInSidebar: true, category: 'finance' },
  { path: '/policies', component: PolicyManager, label: 'Auth Policies', icon: Gavel, showInSidebar: true, category: 'admin' },
  { path: '/manifesto', component: PrivacyPolicy, label: 'Privacy Manifesto', icon: FileLock2, showInSidebar: true, category: 'admin' },
  { path: '/documentation', component: Documentation, label: 'Documentation Core', icon: BookOpen, showInSidebar: true, category: 'admin' },
  { path: '/settings', component: Settings, label: 'System Config', icon: SettingsIcon, showInSidebar: false, category: 'admin' },

  // Technical Deep Dives (The 50 Views)
  { path: '/protocol/:slug', component: TechnicalDeepDive, label: 'Protocol Detail', icon: Code, showInSidebar: false, category: 'technical' },
  { path: '/institutional/:slug', component: TechnicalDeepDive, label: 'Institutional Spec', icon: Building2, showInSidebar: false, category: 'technical' },
  { path: '/intelligence/:slug', component: TechnicalDeepDive, label: 'Intelligence Log', icon: BrainCircuit, showInSidebar: false, category: 'technical' },
  { path: '/technical-status/:slug', component: TechnicalDeepDive, label: 'Network Node', icon: Network, showInSidebar: false, category: 'technical' }
];


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/routes.ts
================================================================================


import React from 'react';
import { 
  LayoutDashboard, Building2, Users, Database, ShieldCheck, Cpu, Key, 
  ArrowLeftRight, CreditCard, FileText, Leaf, MessageSquare, 
  Settings as SettingsIcon, Network, Zap, ShieldAlert, Bitcoin, 
  Hammer, FileLock2, BookOpen, Radio, Gift, Code, BrainCircuit, Image as ImageIcon, 
  FileJson, Box, Activity, Gavel, Map
} from 'lucide-react';

import Overview from './Overview';
import InternalAccounts from './InternalAccounts';
import Counterparties from './Counterparties';
import Connectivity from './Connectivity';
import Documents from './Documents';
import Simulation from './Simulation';
import DCRManagement from './DCRManagement';
import Payments from './Payments';
import Cards from './Cards';
import AnalyticsReport from './AnalyticsReport';
import Sustainability from './Sustainability';
import Advisor from './Advisor';
import Settings from './Settings';
import VirtualAccounts from './VirtualAccounts';
import Flows from './Flows';
import Validations from './Validations';
import CryptoTerminal from './CryptoTerminal';
import CryptView from './CryptView';
import PrivacyPolicy from './PrivacyPolicy';
import Documentation from './Documentation';
import Airdrop from './Airdrop';
import Broadcast from './Broadcast';
import TechnicalDeepDive from './TechnicalDeepDive';
import Gallery from './Gallery';
import ApiReference from './ApiReference';
import InstitutionalApps from './InstitutionalApps';
import ApiStatus from './ApiStatus';
import AppNodeRunner from './AppNodeRunner';
import PolicyManager from './PolicyManager';
import AppFactory from './AppFactory';
import AppMeshMap from './AppMeshMap';

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  label: string;
  icon: any;
  showInSidebar: boolean;
  category: 'core' | 'registry' | 'system' | 'intelligence' | 'finance' | 'admin' | 'technical';
}

export const routes: RouteConfig[] = [
  // Core App
  { path: '/overview', component: Overview, label: 'Overview', icon: LayoutDashboard, showInSidebar: true, category: 'core' },
  { path: '/broadcast', component: Broadcast, label: 'Global Node', icon: Radio, showInSidebar: true, category: 'core' },
  { path: '/gallery', component: Gallery, label: 'Artifact Archive', icon: ImageIcon, showInSidebar: true, category: 'core' },
  { path: '/registry', component: InternalAccounts, label: 'Bank Registry', icon: Building2, showInSidebar: true, category: 'registry' },
  { path: '/app-factory', component: AppFactory, label: '999 Protocol', icon: Hammer, showInSidebar: true, category: 'registry' },
  { path: '/app-mesh', component: AppMeshMap, label: 'Mesh Map', icon: Map, showInSidebar: true, category: 'registry' },
  { path: '/institutional-apps', component: InstitutionalApps, label: 'App Nodes', icon: Box, showInSidebar: true, category: 'registry' },
  { path: '/app-node/:id', component: AppNodeRunner, label: 'Node Runtime', icon: Cpu, showInSidebar: false, category: 'registry' },
  { path: '/virtual-nodes', component: VirtualAccounts, label: 'Virtual Nodes', icon: Network, showInSidebar: true, category: 'registry' },
  { path: '/crypto', component: CryptoTerminal, label: 'Asset Terminal', icon: Bitcoin, showInSidebar: true, category: 'finance' },
  { path: '/crypt', component: CryptView, label: 'Foundry', icon: Hammer, showInSidebar: true, category: 'finance' },
  { path: '/partners', component: Counterparties, label: 'Partner CRM', icon: Users, showInSidebar: true, category: 'registry' },
  { path: '/connectivity', component: Connectivity, label: 'System Fabric', icon: Database, showInSidebar: true, category: 'system' },
  { path: '/vault', component: Documents, label: 'Record Vault', icon: ShieldCheck, showInSidebar: true, category: 'system' },
  { path: '/api-reference', component: ApiReference, label: 'API Reference', icon: FileJson, showInSidebar: true, category: 'system' },
  { path: '/api-status', component: ApiStatus, label: 'System Status', icon: Activity, showInSidebar: true, category: 'system' },
  { path: '/oracle', component: Simulation, label: 'Quantum Oracle', icon: Cpu, showInSidebar: true, category: 'intelligence' },
  { path: '/flows', component: Flows, label: 'Onboarding Flows', icon: Zap, showInSidebar: true, category: 'intelligence' },
  { path: '/dcr', component: DCRManagement, label: 'DCR Registry', icon: Key, showInSidebar: true, category: 'intelligence' },
  { path: '/validator', component: Validations, label: 'Registry Validator', icon: ShieldAlert, showInSidebar: true, category: 'intelligence' },
  { path: '/payments', component: Payments, label: 'Disbursements', icon: ArrowLeftRight, showInSidebar: true, category: 'finance' },
  { path: '/cards', component: Cards, label: 'Elite Cards', icon: CreditCard, showInSidebar: true, category: 'finance' },
  { path: '/analytics', component: AnalyticsReport, label: 'Statements', icon: FileText, showInSidebar: true, category: 'finance' },
  { path: '/sustainability', component: Sustainability, label: 'Carbon Audit', icon: Leaf, showInSidebar: true, category: 'finance' },
  { path: '/advisor', component: Advisor, label: 'AI Terminal', icon: MessageSquare, showInSidebar: true, category: 'intelligence' },
  { path: '/airdrop', component: Airdrop, label: 'jocall3 Airdrop', icon: Gift, showInSidebar: true, category: 'finance' },
  { path: '/policies', component: PolicyManager, label: 'Auth Policies', icon: Gavel, showInSidebar: true, category: 'admin' },
  { path: '/manifesto', component: PrivacyPolicy, label: 'Privacy Manifesto', icon: FileLock2, showInSidebar: true, category: 'admin' },
  { path: '/documentation', component: Documentation, label: 'Documentation Core', icon: BookOpen, showInSidebar: true, category: 'admin' },
  { path: '/settings', component: Settings, label: 'System Config', icon: SettingsIcon, showInSidebar: false, category: 'admin' },

  // Technical Deep Dives (The 50 Views)
  { path: '/protocol/:slug', component: TechnicalDeepDive, label: 'Protocol Detail', icon: Code, showInSidebar: false, category: 'technical' },
  { path: '/institutional/:slug', component: TechnicalDeepDive, label: 'Institutional Spec', icon: Building2, showInSidebar: false, category: 'technical' },
  { path: '/intelligence/:slug', component: TechnicalDeepDive, label: 'Intelligence Log', icon: BrainCircuit, showInSidebar: false, category: 'technical' },
  { path: '/technical-status/:slug', component: TechnicalDeepDive, label: 'Network Node', icon: Network, showInSidebar: false, category: 'technical' }
];
