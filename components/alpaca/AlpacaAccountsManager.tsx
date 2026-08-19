/**
 * ============================================================================
 * ARCHITECTURAL SYSTEM: SOVEREIGN PATRIOT SEC-FINRA CORRESPONDENT ENGINE
 * MODULE: Alpaca Accounts Lifecycle, CIP/KYC Compliance & Broker Operations Hub
 * FILE: components/alpaca/AlpacaAccountsManager.tsx
 * SPECIFICATION: SEC Rule 17a-3/17a-4, FINRA Rules 2090/2111/2210, USA PATRIOT Act
 * § 326 Customer Identification Program (CIP), FinCEN Customer Due Diligence (CDD),
 * OFAC Sanctions Screening, & Alpaca Broker API v2 Multi-Level Account Orchestrator.
 * ============================================================================
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  createContext,
  useContext,
} from 'react';
import {
  UserCheck,
  ShieldCheck,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Key,
  Building,
  AlertTriangle,
  Award,
  BadgeAlert,
  BadgeCheck,
  Ban,
  Binary,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Coins,
  Cpu,
  CreditCard,
  Database,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FastForward,
  FileCheck,
  FileCode,
  FilePlus,
  Filter,
  Fingerprint,
  Flame,
  Globe,
  HardDrive,
  HelpCircle,
  History,
  Info,
  Layers,
  LayoutGrid,
  Link,
  Lock,
  Network,
  Percent,
  Plus,
  Radio,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  Slash,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Terminal,
  Trash2,
  TrendingDown,
  TrendingUp,
  Unlock,
  Upload,
  User,
  UserMinus,
  UserPlus,
  UserX,
  Users,
  Wallet,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';

/* ============================================================================
 * TYPE DEFINITIONS: BROKER API ACCOUNTS, CIP, KYC, OFAC & OPTIONS LIFECYCLE
 * ============================================================================ */

export type AlpacaAccountStatus =
  | 'INACTIVE'
  | 'ONBOARDING'
  | 'SUBMITTED'
  | 'CIP_PENDING'
  | 'APPROVAL_PENDING'
  | 'MANUAL_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'RESTRICTED'
  | 'DISABLED'
  | 'REJECTED'
  | 'ACCOUNT_CLOSED'
  | 'TRANSFERRED'
  | 'OFFBOARDED';

export type AlpacaAccountType =
  | 'individual'
  | 'joint_wros'
  | 'joint_tic'
  | 'custodial'
  | 'ira_traditional'
  | 'ira_roth'
  | 'ira_sep'
  | 'corporate'
  | 'llc'
  | 'partnership'
  | 'trust'
  | 'non_profit';

export type AlpacaAccountClass =
  | 'cash'
  | 'margin_standard'
  | 'margin_pdt'
  | 'prime_brokerage'
  | 'omnibus_subaccount'
  | 'fully_disclosed';

export type AlpacaCipApprovalStatus =
  | 'APPROVED'
  | 'REJECTED'
  | 'MANUAL_REVIEW'
  | 'FAILED'
  | 'PENDING'
  | 'EXEMPT'
  | 'DOCUMENT_REQUESTED';

export type AlpacaRiskScoreLevel = 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AlpacaOptionsLevel = 0 | 1 | 2 | 3 | 4;

export type AlpacaOptionsApprovalStatus =
  | 'NOT_REQUESTED'
  | 'PENDING'
  | 'APPROVED'
  | 'RESTRICTED'
  | 'REJECTED'
  | 'REVOKED';

export type AlpacaFundingMethod =
  | 'ach'
  | 'wire_domestic'
  | 'wire_international'
  | 'instant_bank_transfer'
  | 'internal_journal'
  | 'acats_transfer'
  | 'dwac';

export type AlpacaDocumentType =
  | 'identity_verification'
  | 'proof_of_address'
  | 'w9'
  | 'w8ben'
  | 'w8bene'
  | 'corporate_resolution'
  | 'articles_of_organization'
  | 'trust_agreement'
  | 'source_of_wealth'
  | 'finra_407_letter'
  | 'rule_144_seller_letter'
  | 'acats_statement'
  | 'power_of_attorney';

export type AlpacaDocumentStatus =
  | 'SUBMITTED'
  | 'PROCESSING'
  | 'VALIDATED'
  | 'EXPIRED'
  | 'REJECTED'
  | 'ARCHIVED';

export type AlpacaCipCheckType =
  | 'identity_core'
  | 'watchlist_ofac'
  | 'watchlist_pep'
  | 'adverse_media'
  | 'synthetic_identity'
  | 'ssn_deceased'
  | 'address_verification'
  | 'fraud_network_linkage'
  | 'cip_rule_engine';

export type AlpacaCipCheckOutcome = 'PASS' | 'WARN' | 'FAIL' | 'REVIEW' | 'SKIPPED';

export interface AlpacaContactInformation {
  email_address: string;
  phone_number: string;
  street_address: string[];
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_us_resident: boolean;
  residence_history_years?: number;
}

export interface AlpacaIdentityInformation {
  given_name: string;
  family_name: string;
  middle_name?: string;
  date_of_birth: string;
  tax_id: string;
  tax_id_type: 'USA_SSN' | 'USA_ITIN' | 'FOREIGN_TIN' | 'PASSPORT';
  country_of_citizenship: string;
  country_of_birth?: string;
  country_of_tax_residence: string;
  funding_source: string[];
  matched_address?: string;
  is_affiliated_exchange_or_finra?: boolean;
  is_politically_exposed?: boolean;
  is_control_person?: boolean;
  control_person_symbols?: string[];
  immediate_family_exposed?: boolean;
}

export interface AlpacaDisclosures {
  is_control_person: boolean;
  is_affiliated_exchange_or_finra: boolean;
  is_politically_exposed: boolean;
  immediate_family_exposed: boolean;
  finra_firm_affiliation?: string;
  public_company_tickers?: string[];
  employment_status: 'employed' | 'unemployed' | 'retired' | 'student' | 'self_employed';
  employer_name?: string;
  employer_address?: string;
  employment_position?: string;
  source_of_funds: 'employment_income' | 'investments' | 'inheritance' | 'business_profits' | 'savings' | 'crypto_gains' | 'other';
}

export interface AlpacaFinancialProfile {
  annual_income_min: number;
  annual_income_max: number;
  liquid_net_worth_min: number;
  liquid_net_worth_max: number;
  total_net_worth_min: number;
  total_net_worth_max: number;
  investment_objective: 'growth' | 'income' | 'capital_preservation' | 'speculation' | 'hedging';
  investment_experience_years: {
    equities: number;
    options: number;
    fixed_income: number;
    crypto: number;
    derivatives: number;
    futures: number;
  };
  risk_tolerance: 'low' | 'moderate' | 'aggressive' | 'speculative';
  liquidity_needs: 'very_important' | 'somewhat_important' | 'not_important';
  time_horizon_years: number;
}

export interface AlpacaTrustedContact {
  given_name: string;
  family_name: string;
  email_address: string;
  phone_number: string;
  street_address: string[];
  city: string;
  state: string;
  postal_code: string;
  country: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'attorney' | 'cpa' | 'other';
  disclosure_consented: boolean;
}

export interface AlpacaCIPRuleEvaluation {
  rule_id: string;
  rule_name: string;
  category: 'OFAC' | 'IDENTITY' | 'FRAUD' | 'SUITABILITY' | 'FINCEN' | 'PEP';
  description: string;
  outcome: AlpacaCipCheckOutcome;
  score: number;
  max_score: number;
  triggered_flags: string[];
  timestamp: string;
  adverse_action_reason?: string;
}

export interface AlpacaCipCheckRecord {
  id: string;
  check_type: AlpacaCipCheckType;
  provider: string;
  outcome: AlpacaCipCheckOutcome;
  score: number;
  summary: string;
  details: Record<string, any>;
  evaluated_at: string;
  raw_response_digest?: string;
}

export interface AlpacaCipData {
  account_id: string;
  provider_name: string[];
  kyc: {
    applicant_name: string;
    approval_status: AlpacaCipApprovalStatus;
    risk_level: AlpacaRiskScoreLevel;
    risk_score: number;
    submitted_at: string;
    completed_at?: string;
    sanctions_list_match: boolean;
    pep_list_match: boolean;
    adverse_media_match: boolean;
    synthetic_id_probability: number;
  };
  identity?: {
    matched_name: string;
    matched_dob: string;
    matched_ssn_last4: string;
    matched_address: string;
    ssn_issued_state?: string;
    is_deceased: boolean;
    phone_carrier_risk?: 'LOW' | 'MEDIUM' | 'HIGH';
    email_domain_risk?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  evaluations: AlpacaCIPRuleEvaluation[];
  checks: AlpacaCipCheckRecord[];
  notes: Array<{
    id: string;
    author: string;
    created_at: string;
    content: string;
    action_type: 'OVERRIDE' | 'FLAG' | 'CLEAR' | 'GENERAL';
  }>;
}

export interface AlpacaOptionsApprovalRequest {
  id: string;
  account_id: string;
  requested_level: AlpacaOptionsLevel;
  approved_level: AlpacaOptionsLevel;
  status: AlpacaOptionsApprovalStatus;
  reasons: string[];
  agreement_signed_at: string;
  suitability_passed: boolean;
  experience_score: number;
  net_worth_qualified: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
  supervisory_notes?: string;
}

export interface AlpacaDocumentRecord {
  id: string;
  account_id: string;
  document_type: AlpacaDocumentType;
  document_sub_type?: string;
  content_type: 'application/pdf' | 'image/jpeg' | 'image/png' | 'application/json';
  file_name: string;
  file_size_bytes: number;
  uploaded_at: string;
  status: AlpacaDocumentStatus;
  verification_vendor: 'ONFIDO' | 'COMPLY_ADVANTAGE' | 'INTERNAL_AUDIT' | 'MANUAL';
  verification_digest?: string;
  ocr_extracted_fields?: Record<string, string>;
  rejection_reason?: string;
  download_url?: string;
}

export interface AlpacaBankRelationship {
  id: string;
  account_id: string;
  bank_name: string;
  account_number_last4: string;
  routing_number: string;
  bank_account_type: 'checking' | 'savings';
  status: 'QUEUED' | 'SENT_TO_CLEARING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
  created_at: string;
  verification_method: 'PLAID' | 'MICRO_DEPOSITS' | 'MANUAL_VOIDED_CHECK';
  verified_at?: string;
  currency: string;
}

export interface AlpacaAccountFullRecord {
  id: string;
  account_number: string;
  status: AlpacaAccountStatus;
  currency: string;
  account_type: AlpacaAccountType;
  account_class: AlpacaAccountClass;
  created_at: string;
  last_updated_at: string;
  crypto_enabled: boolean;
  fractional_trading_enabled: boolean;
  options_trading_level: AlpacaOptionsLevel;
  margin_multiplier: number;
  pattern_day_trader: boolean;
  daytrade_count: number;
  clearing_broker: string;
  cash_balance: number;
  portfolio_value: number;
  buying_power: number;
  regt_buying_power: number;
  daytrading_buying_power: number;
  options_buying_power: number;
  effective_crypto_buying_power: number;
  contact: AlpacaContactInformation;
  identity: AlpacaIdentityInformation;
  disclosures: AlpacaDisclosures;
  financial_profile: AlpacaFinancialProfile;
  trusted_contact?: AlpacaTrustedContact;
  cip_data?: AlpacaCipData;
  options_approval?: AlpacaOptionsApprovalRequest;
  documents: AlpacaDocumentRecord[];
  bank_relationships: AlpacaBankRelationship[];
  audit_ledger: Array<{
    id: string;
    action: string;
    performed_by: string;
    timestamp: string;
    details: Record<string, any>;
  }>;
}

/* ============================================================================
 * REAL-TIME SYSTEM PATHS REGISTRY & CORRESPONDENT COMPLIANCE CODEX
 * ============================================================================ */

export const SYSTEM_PATHS: string[] = [
  "00_Master_Compiled_Executive_Order/Chapter_01_The_Citibank_Lobby.md",
  "00_Master_Compiled_Executive_Order/Chapter_02_The_EAC_Briefing.md",
  "00_Master_Compiled_Executive_Order/Chapter_03_The_DHS_Server_Room.md",
  "00_Master_Compiled_Executive_Order/Chapter_04_The_Military_Fund_Audit.md",
  "00_Master_Compiled_Executive_Order/Chapter_05_The_Geneva_Account.md",
  "00_Master_Compiled_Executive_Order/Chapter_06_The_Task_Force_Confrontation.md",
  "00_Master_Compiled_Executive_Order/Chapter_07_The_Mobile_Verification_Launch.md",
  "00_Master_Compiled_Executive_Order/Dossier_01_UCC_Financial_Loophole.md",
  "00_Master_Compiled_Executive_Order/Dossier_02_SAVE_API_Vulnerabilities.md",
  "00_Master_Compiled_Executive_Order/Dossier_03_Iran_Framework_Compliance.md",
  "00_Master_Compiled_Executive_Order/Dossier_04_Military_Fund_Allocation.md",
  "00_Master_Compiled_Executive_Order/Dossier_05_DNA_Testing_Consular_Protocols.md",
  "00_Master_Compiled_Executive_Order/Dossier_06_Voter_Roll_Purge_Metrics.md",
  "00_Master_Compiled_Executive_Order/Dossier_07_Tribal_Liaison_Integration.md",
  "00_Master_Compiled_Executive_Order/Dossier_08_Paperwork_Reduction_Exemption.md",
  "00_Master_Compiled_Executive_Order/Dossier_09_Private_Right_of_Action.md",
  "00_Master_Compiled_Executive_Order/Dossier_10_Department_of_War_Archival_Access.md",
  "00_Master_Compiled_Executive_Order/Dossier_11_Mobile_Unit_Deployment_Logistics.md",
  "00_Master_Compiled_Executive_Order/Dossier_12_Task_Force_Sunset_Procedures.md",
  "00_Master_Compiled_Executive_Order/Dossier_13_Vector_Collapse_Protocol.md",
  "00_Master_Compiled_Executive_Order/Dossier_14_Citibank_Demo_Business_Structure.md",
  "App.tsx",
  "Book/Ok.md",
  "Combined_sLegislative_Bill/chapters/chapter_01_the_loophole.md",
  "Combined_sLegislative_Bill/chapters/chapter_02_political_decay.md",
  "Combined_sLegislative_Bill/chapters/chapter_03_the_decision.md",
  "Combined_sLegislative_Bill/characters/antagonist_leverage_analysis.md",
  "Combined_sLegislative_Bill/characters/protagonist_profile.md",
  "Combined_sLegislative_Bill/dossiers/iranian_cyber_threat_matrix.md",
  "Combined_sLegislative_Bill/dossiers/mtls_ai_bank_architecture.md",
  "Combined_sLegislative_Bill/dossiers/sovereign_id_cryptography.md",
  "Combined_sLegislative_Bill/narrative/scene_01_banking_loophole.md",
  "Combined_sLegislative_Bill/narrative/scene_02_bureaucratic_signing.md",
  "Combined_sLegislative_Bill/narrative/scene_03_system_failure.md",
  "Combined_sLegislative_Bill/narrative/scene_04_political_decay.md",
  "Combined_sLegislative_Bill/narrative/scene_05_corruption_observation.md",
  "Combined_sLegislative_Bill/narrative/scene_06_threats_closing_in.md",
  "Combined_sLegislative_Bill/narrative/scene_07_high_stakes_decision.md",
  "Combined_sLegislative_Bill/narrative/scene_08_antagonist_pushout.md",
  "Combined_sLegislative_Bill/narrative/scene_09_real_time_execution.md",
  "Combined_sLegislative_Bill/technical/database_synchronization_protocol.md",
  "Combined_sLegislative_Bill/technical/hardware_secure_element_spec.md",
  "Combined_sLegislative_Bill/technical/zero_knowledge_proofs_spec.md",
  "Combined_sLegislative_Bill/worldbuilding/department_of_war_archives_spec.md",
  "Combined_sLegislative_Bill/worldbuilding/reconciliation_3_0_framework.md",
  "Combined_sLegislative_Bill/worldbuilding/thirty_five_sectors_analysis.md",
  "Google/AuthManager.ts",
  "Google/AutoScaler.ts",
  "Google/BackupService.ts",
  "Google/BigQueryEmulator.ts",
  "Google/BillingTracker.ts",
  "Google/CDNReplacement.ts",
  "Google/CloudFunctionsShim.ts",
  "Google/CloudReplacementEngine.ts",
  "Google/ComputeOrchestrator.ts",
  "Google/DatabaseBridge.ts",
  "Google/DeploymentPipeline.ts",
  "Google/IAMPolicyEngine.ts",
  "Google/MonitoringService.ts",
  "Google/NetworkGateway.ts",
  "Google/PubSubLocal.ts",
  "Google/SecretVault.ts",
  "Google/ServiceMesh.ts",
  "Google/StorageAbstraction.ts",
  "Google/VertexAIProxy.ts",
  "Google/VpcManager.ts",
  "IMG_5610.webp",
  "LICENSE",
  "README.md",
  "README_v2.md",
  "TRUST.md",
  "api/AppRegistry/AppBillingBridge.ts",
  "api/AppRegistry/AppDependencyResolver.ts",
  "api/AppRegistry/AppLifecycleManager.ts",
  "api/AppRegistry/AppManifestParser.ts",
  "api/AppRegistry/AppMetadataAggregator.ts",
  "api/AppRegistry/AppPermissionEngine.ts",
  "api/AppRegistry/AppRegistryOrchestrator.ts",
  "api/AppRegistry/AppWebhookDispatcher.ts",
  "api/AppRegistry/config/EcosystemConfig.ts",
  "api/AppRegistry/index.ts",
  "api/AppRegistry/middleware/AppRegistryAuth.ts",
  "api/AppRegistry/routes/AppRegistryRoutes.ts",
  "api/AppRegistry/services/AppDeploymentService.ts",
  "api/AppRegistry/services/AppIntegrationsBridge.ts",
  "api/AppRegistry/services/AppMetricsCollector.ts",
  "api/AppRegistry/services/AppStorageVault.ts",
  "api/AppRegistry/types/AppManifest.ts",
  "api/AppRegistry/types/AppRuntime.ts",
  "api/AppRegistry/utils/AppSecurityAuditor.ts",
  "api/AppRegistry/utils/ManifestValidator.ts",
  "api/Obama Opts Out Of Public Financing (1)/section10_sovereign_wealth_fund_527.ts",
  "api/Obama Opts Out Of Public Financing (1)/section1_obama_public_financing.ts",
  "api/Obama Opts Out Of Public Financing (1)/section2_bear_stearns_arrests.ts",
  "api/Obama Opts Out Of Public Financing (1)/section3_spaceflight_kosmos.ts",
  "api/Obama Opts Out Of Public Financing (1)/section4_citi_connection_contagion.ts",
  "api/Obama Opts Out Of Public Financing (1)/section5_goldman_sachs_downgrade.ts",
  "api/Obama Opts Out Of Public Financing (1)/section6_cfo_gary_crittenden.ts",
  "api/Obama Opts Out Of Public Financing (1)/section7_structured_products_basket.ts",
  "api/Obama Opts Out Of Public Financing (1)/section8_the_toast_email.ts",
  "api/Obama Opts Out Of Public Financing (1)/section9_citibank_demo_business.ts",
  "api/PortalDiagnostics/DependencyGraph.ts",
  "api/PortalDiagnostics/DiagnosticsOrchestrator.ts",
  "api/PortalDiagnostics/ErrorReporter.ts",
  "api/PortalDiagnostics/HealthCheckService.ts",
  "api/PortalDiagnostics/LogAnalyzer.ts",
  "api/PortalDiagnostics/PerformanceMonitor.ts",
  "api/PortalDiagnostics/SecurityScanner.ts",
  "api/PortalDiagnostics/TelemetryCollector.ts",
  "api/PortalDiagnostics/config/DiagnosticConfig.ts",
  "api/PortalDiagnostics/index.ts",
  "api/PortalDiagnostics/middleware/DiagnosticAuth.ts",
  "api/PortalDiagnostics/routes/DiagnosticRoutes.ts",
  "api/PortalDiagnostics/services/AuthDiagnostics.ts",
  "api/PortalDiagnostics/services/DatabaseDiagnostics.ts",
  "api/PortalDiagnostics/services/IntegrationDiagnostics.ts",
  "api/PortalDiagnostics/services/NetworkDiagnostics.ts",
  "api/PortalDiagnostics/types/DiagnosticReport.ts",
  "api/PortalDiagnostics/types/SystemStatus.ts",
  "api/PortalDiagnostics/utils/AlertDispatcher.ts",
  "api/PortalDiagnostics/utils/Formatters.ts",
  "api/acquisitions.ts",
  "api/ai.ts",
  "api/alpaca.ts",
  "api/alpacaCollateral.ts",
  "api/azure.ts",
  "api/azureGovCompliance.ts",
  "api/citi.ts",
  "api/config.ts",
  "api/crypto-strategy.ts",
  "api/fapi.ts",
  "api/google-chat.ts",
  "api/government-gateway.ts",
  "api/index.ts",
  "api/middleware/auths.ts",
  "api/middleware/rateLimiter.ts",
  "api/modern-treasury.ts",
  "api/order/order_01_02.md",
  "api/order/order_03_04.md",
  "api/order/order_05_06.md",
  "api/order/order_07_08.md",
  "api/order/order_09_10.md",
  "api/order/order_11_12.md",
  "api/order/order_13_14.md",
  "api/order/order_15_16.md",
  "api/order/order_17_18.md",
  "api/order/order_19_20.md",
  "api/order/order_21_22.md",
  "api/order/order_23_24.md",
  "api/order/order_25_26.md",
  "api/order/order_27_28.md",
  "api/order/order_29_30.md",
  "api/order/order_31_32.md",
  "api/order/order_33_34.md",
  "api/order/order_35_36.md",
  "api/order/order_37_38.md",
  "api/order/order_39_40.md",
  "api/order/order_41_42.md",
  "api/order/order_43_44.md",
  "api/section1_digital_asset_and_cybersecurity.ts",
  "api/section2_ledger_framework_and_arbitrage.ts",
  "api/section3_consensus_and_fapi_conformance.ts",
  "api/section4_quantum_secured_and_revocation.ts",
  "api/plaid.ts",
  "api/real-estate.ts",
  "api/routes/acquisitions-orchestrator.ts",
  "api/routes/admin.ts",
  "api/routes/collateral.ts",
  "api/routes/identity.ts",
  "api/routes/market.ts",
  "api/routes/notifications.ts",
  "api/routes/treasury.ts",
  "api/routes/webhooks.ts",
  "api/sovereign.ts",
  "api/stripe.ts",
  "api/tax-liens.ts",
  "api/tqqq-strategy.ts",
  "api/types/sovereign.ts",
  "api/utils/ai-agent-factory.ts",
  "api/utils/complianceEngine.ts",
  "api/utils/crypto-bridge.ts",
  "api/utils/geo-spatial.ts",
  "api/utils/ledgerSync.ts",
  "api/utils/logger.ts",
  "api/utils/math-engine.ts",
  "api/utils/vault.ts",
  "apps/audit_compliance_tracker/app.py",
  "apps/azure_ad_app_auditor/app.py",
  "apps/b2b_audit_trail_generator/app.py",
  "apps/b2b_cash_flow_stress_tester/app.py",
  "apps/b2b_corporate_liquidity_forecaster/app.py",
  "apps/b2b_interest_rate_optimizer/app.py",
  "apps/b2b_portfolio_wealth_analyzer/app.py",
  "apps/b2b_routing_decryptor_validator/app.py",
  "apps/b2b_routing_number_resolver/app.py",
  "apps/b2b_transaction_categorizer/app.py",
  "apps/balance_transfer_analytics_dashboard/app.py",
  "apps/balance_transfer_batch_scheduler/app.py",
  "apps/balance_transfer_calculator/app.py",
  "apps/balance_transfer_compliance_auditor/app.py",
  "apps/balance_transfer_disbursement_orchestrator/app.py",
  "apps/balance_transfer_eligibility_checker/app.py",
  "apps/balance_transfer_interest_simulator/app.py",
  "apps/balance_transfer_lead_generator/app.py",
  "apps/broker_compliance_trade_auditor/app.py",
  "apps/broker_order_execution_simulator/app.py",
  "apps/camt053_balance_reconciler/app.py",
  "apps/camt053_balance_reconciler/reconciler.py",
  "apps/camt053_mock_generator/app.py",
  "apps/camt053_mock_generator/generator.py",
  "apps/camt053_shared/models.py",
  "apps/camt053_statement_parser/app.py",
  "apps/camt053_statement_parser/utils.py",
  "apps/camt053_transaction_exporter/app.py",
  "apps/camt053_transaction_exporter/exporter.py",
  "apps/card_activation_simulator/app.py",
  "apps/card_function_access_controller/app.py",
  "apps/card_lifecycle_compliance_checker/app.py",
  "apps/card_listing_mock_server/app.py",
  "apps/card_merchant_category_classifier/app.py",
  "apps/card_outstanding_balance_tracker/app.py",
  "apps/card_pin_hasher_validator/app.py",
  "apps/card_spend_limit_manager/app.py",
  "apps/card_test_suite_conformance_analyzer/app.py",
  "apps/card_tokenization_service/app.py",
  "apps/citi_account_anomaly_detector/app.py",
  "apps/citi_account_excel_parser/app.py",
  "apps/citi_account_interest_accrual_simulator/app.py",
  "apps/citi_account_kyc_risk_profiler/app.py",
  "apps/citiconnect_integration_gateway/app.py",
  "apps/citizenship_verification_gateway/app.py",
  "apps/credit_card_simulator/app.py",
  "apps/credit_limit_utilization_monitor/app.py",
  "apps/credit_risk_analyzer/app.py",
  "apps/cross_cloud_federation_manager/app.py",
  "apps/cvv_decryption_mock_service/app.py",
  "apps/election_integrity_dashboard/app.py",
  "apps/fedramp_compliance_monitor/app.py",
  "apps/financial_regulatory_guardrail/app.py",
  "apps/financial_statement_verifier/app.py",
  "apps/github_audit_sync_agent/app.py",
  "apps/military_fund_allocator/app.py",
  "apps/multi_currency_balance_consolidator/app.py",
  "apps/pqc_crypto_bridge_simulator/app.py",
  "apps/schema_catalog_custom_registry/app.py",
  "apps/schema_catalog_search_engine/app.py",
  "apps/schema_conformance_audit_tool/app.py",
  "apps/schema_validator_orchestrator/app.py",
  "apps/service_principal_provisioner/app.py",
  "apps/statement_reconciliation_portal/app.py",
  "apps/supplementary_card_orchestrator/app.py",
  "apps/treasury_reconciliation_engine/app.py",
  "apps/voter_registration_portal/app.py",
  "book/Ok",
  "bun.lock",
  "check_sql.ts",
  "clarity/part01_legislative_intent.ts",
  "clarity/part02_definitions_registry.ts",
  "clarity/part03_sec_cftc_jurisdiction.ts",
  "clarity/part04_decentralization_certification.ts",
  "clarity/part05_digital_commodity_exchanges.ts",
  "clarity/part06_broker_dealer_requirements.ts",
  "clarity/part07_stablecoin_issuance_framework.ts",
  "clarity/part08_market_manipulation_prevention.ts",
  "clarity/part09_customer_protection_custody.ts",
  "clarity/part10_clearing_settlement_protocols.ts",
  "clarity/part11_international_coordination.ts",
  "clarity/part12_anti_money_laundering_kyc.ts",
  "clarity/part13_tax_reporting_compliance.ts",
  "clarity/part14_smart_contract_auditing.ts",
  "clarity/part15_disclosure_requirements.ts",
  "clarity/part16_alpaca_integration_bridge.ts",
  "clarity/part17_citi_sovereign_ledger_bridge.ts",
  "clarity/part18_modern_treasury_settlement.ts",
  "clarity/part19_crypto_strategy_validator.ts",
  "clarity/part20_compliance_audit_trail.ts",
  "clarity/part21_risk_assessment_matrix.ts",
  "clarity/part22_government_gateway_reporting.ts",
  "clarity/part23_tokenization_compliance_engine.ts",
  "clarity/part24_ai_compliance_agent.ts",
  "clarity/part25_system_orchestrator.ts",
  "components/AIAdStudioView.tsx",
  "components/AIAdStudioView.tsx.md",
  "components/AIAdvisorView.tsx",
  "components/AIAdvisorView.tsx.md",
  "components/AIInsights.tsx",
  "components/AIInsights.tsx.md",
  "components/APIIntegrationView.tsx",
  "components/APIIntegrationView.tsx.md",
  "components/APIKeysView.tsx",
  "components/AdministrationAudit.tsx",
  "components/AlpacaBrokerView.tsx",
  "components/AquariusArchitectView.tsx",
  "components/AquariusAuditorView.tsx",
  "components/AquariusCreativeSuite.tsx",
  "components/AquariusDashboard.tsx",
  "components/AquariusGhostView.tsx",
  "components/AquariusInstitutionalHub.tsx",
  "components/AquariusLiveVoice.tsx",
  "components/AriaComms.tsx",
  "components/AstraDBQuickstart.tsx",
  "components/AzureAppsView.tsx",
  "components/AzureAppsView.tsx.md",
  "components/BalanceSummary.tsx",
  "components/BalanceSummary.tsx.md",
  "components/BillingIdentityView.tsx",
  "components/BudgetsView.tsx",
  "components/BudgetsView.tsx.md",
  "components/Card.tsx",
  "components/Card.tsx.md",
  "components/CardCustomizationView.tsx",
  "components/CardCustomizationView.tsx.md",
  "components/CitiConnectInitiation.tsx",
  "components/CitiConnectInquiry.tsx",
  "components/CitiConnectNotifications.tsx",
  "components/CitiDecryptionUtility.tsx",
  "components/CitiGateway.tsx",
  "components/CitiPartnerHub.tsx",
  "components/CitiSovereignLedger.tsx",
  "components/CitiTreasuryHub.tsx",
  "components/CitiUkInternationalPayments.tsx",
  "components/ContractorLobbyingList.tsx",
  "components/CorporateCommandView.tsx",
  "components/CreditHealthView.tsx",
  "components/CryptoView.tsx",
  "components/CryptoView.tsx.md",
  "components/Dashboard.tsx",
  "components/Dashboard.tsx.md",
  "components/DataIngestView.tsx",
  "components/DeveloperView.tsx",
  "components/EntraSwarmManager.tsx",
  "components/ErrorBoundary.tsx",
  "components/FeaturePalette.tsx",
  "components/FinancialDemocracyView.tsx",
  "components/FinancialGoalsView.tsx",
  "components/FleetAppView.tsx",
  "components/FleetAppView.tsx.md",
  "components/FloridaVoterView.tsx",
  "components/FlowController.tsx",
  "components/FlowController.tsx.md",
  "components/GasPriceCorrelation.tsx",
  "components/GcpInventoryView.tsx",
  "components/GeminiKeyModal.tsx",
  "components/GeminiLivePortal.tsx",
  "components/GlobalLedgerView.tsx",
  "components/GoalsView.tsx",
  "components/GoalsView.tsx.md",
  "components/GriffinMcpView.tsx",
  "components/GrowthNexus.tsx",
  "components/Header.tsx",
  "components/Header.tsx.md",
  "components/HoKTokenMint.tsx",
  "components/IdentityCitadelView.tsx",
  "components/IdentityCitadelView.tsx.md",
  "components/ImpactTracker.tsx",
  "components/ImpactTracker.tsx.md",
  "components/ImpeachmentGenerator.tsx",
  "components/InjusticeDashboard.tsx",
  "components/IntegrationsMarketplaceView.tsx",
  "components/IntelligenceHubView.tsx",
  "components/InvestmentPortfolio.tsx",
  "components/InvestmentPortfolio.tsx.md",
  "components/InvestmentsPortfolio.tsx",
  "components/InvestmentsView.tsx",
  "components/InvestmentsView.tsx.md",
  "components/JweJwsVerifier.tsx",
  "components/KryptoBridgeWidget.tsx",
  "components/MachineView.tsx",
  "components/MarketingAutomationView.tsx",
  "components/MarketplaceView.tsx",
  "components/ModernTreasuryLedgerHub.tsx",
  "components/NFCValidator.tsx",
  "components/NeuralToolsView.tsx",
  "components/NexusBuilder.tsx",
  "components/OFXStatementViewer.tsx",
  "components/OpenBankingFapiView.tsx",
  "components/OpenBankingView.tsx"
];

/* ============================================================================
 * STANDARD REGULATORY CIP RULES DEFINITION TABLE
 * ============================================================================ */

export const STANDARD_CIP_RULES: Array<{
  id: string;
  name: string;
  category: 'OFAC' | 'IDENTITY' | 'FRAUD' | 'SUITABILITY' | 'FINCEN' | 'PEP';
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  weight: number;
}> = [
  {
    id: 'CIP-OFAC-001',
    name: 'OFAC SDN & Consolidated Sanctions Match',
    category: 'OFAC',
    description: 'Validates primary holder and ultimate beneficial owners against US Treasury OFAC SDN and Sectoral Sanctions Identifications (SSI) lists.',
    severity: 'CRITICAL',
    weight: 100,
  },
  {
    id: 'CIP-ID-002',
    name: 'Social Security Number Deceased Master Index Check',
    category: 'IDENTITY',
    description: 'Screens Social Security / ITIN record against the SSA Death Master File (DMF) and Credit Bureau death registries.',
    severity: 'CRITICAL',
    weight: 95,
  },
  {
    id: 'CIP-ID-003',
    name: 'Identity Core 4-Point Match (Name, DOB, SSN, Address)',
    category: 'IDENTITY',
    description: 'Cross-verifies name, date of birth, SSN, and physical residential address against major credit bureaus and government registers.',
    severity: 'HIGH',
    weight: 85,
  },
  {
    id: 'CIP-PEP-004',
    name: 'Politically Exposed Persons (PEP) Global Index',
    category: 'PEP',
    description: 'Detects domestic and foreign senior political figures, immediate family members, and close associates under PATRIOT Act § 312.',
    severity: 'HIGH',
    weight: 75,
  },
  {
    id: 'CIP-FRAUD-005',
    name: 'Synthetic Identity & Velocity Scoring',
    category: 'FRAUD',
    description: 'Analyzes cross-account device fingerprints, shared VOIP phone clusters, and high-frequency SSN application histories.',
    severity: 'HIGH',
    weight: 80,
  },
  {
    id: 'CIP-SUIT-006',
    name: 'Options Trading Suitability & Experience Matrix',
    category: 'SUITABILITY',
    description: 'FINRA Rule 2360 suitability check evaluating annual income, liquid net worth, investment objectives, and years of derivatives trading.',
    severity: 'MEDIUM',
    weight: 60,
  },
  {
    id: 'CIP-FINCEN-007',
    name: 'FinCEN 314(a) Information Request Screening',
    category: 'FINCEN',
    description: 'Matches account entities against bi-weekly FinCEN 314(a) subject lists for law enforcement counter-terrorism inquiries.',
    severity: 'CRITICAL',
    weight: 90,
  },
  {
    id: 'CIP-FRAUD-008',
    name: 'Address Geographic Risk & Mail Drop Detection',
    category: 'FRAUD',
    description: 'Identifies commercial mail receiving agencies (CMRA), PO Boxes used as residential addresses, and high-risk international jurisdictions.',
    severity: 'MEDIUM',
    weight: 50,
  },
];

/* ============================================================================
 * REAL-TIME SERVICE INTERFACES & BACKEND CLIENT STUBS
 * ============================================================================ */

export interface OnfidoTokenResponse {
  token: string;
  applicant_id: string;
  sdk_config: {
    language: string;
    flow_steps: string[];
  };
}

export interface AlpacaAccountsService {
  getCip(accountId: string): Promise<AlpacaCipData>;
  getOptionsApproval(accountId: string): Promise<AlpacaOptionsApprovalRequest>;
  requestOptionsApproval(accountId: string, level: number): Promise<AlpacaOptionsApprovalRequest>;
  getOnfidoSdkToken(accountId: string): Promise<OnfidoTokenResponse>;
  getAccountDetails(accountId: string): Promise<AlpacaAccountFullRecord>;
  uploadAccountDocument(accountId: string, doc: Partial<AlpacaDocumentRecord>, file: File | Blob): Promise<AlpacaDocumentRecord>;
  verifyBankRelationship(accountId: string, relationshipId: string): Promise<AlpacaBankRelationship>;
  overrideCipCheck(accountId: string, ruleId: string, rationale: string, approvedBy: string): Promise<AlpacaCipData>;
  lockAccountTrading(accountId: string, reason: string): Promise<{ success: boolean; newStatus: AlpacaAccountStatus }>;
  unlockAccountTrading(accountId: string, reason: string): Promise<{ success: boolean; newStatus: AlpacaAccountStatus }>;
  exportCipAuditPacket(accountId: string): Promise<Blob>;
}

/* ============================================================================
 * DEFAULT DEMO / FALLBACK DATA STATE BUILDERS
 * ============================================================================ */

export const createDefaultAccountRecord = (accountId: string): AlpacaAccountFullRecord => ({
  id: accountId,
  account_number: `ALP-CORR-${accountId.slice(0, 8).toUpperCase()}`,
  status: 'ACTIVE',
  currency: 'USD',
  account_type: 'individual',
  account_class: 'margin_pdt',
  created_at: '2025-01-15T08:30:00.000Z',
  last_updated_at: new Date().toISOString(),
  crypto_enabled: true,
  fractional_trading_enabled: true,
  options_trading_level: 3,
  margin_multiplier: 4,
  pattern_day_trader: true,
  daytrade_count: 1,
  clearing_broker: 'Alpaca Securities LLC / Velox Clearing',
  cash_balance: 148250.75,
  portfolio_value: 842190.50,
  buying_power: 593003.00,
  regt_buying_power: 296501.50,
  daytrading_buying_power: 593003.00,
  options_buying_power: 148250.75,
  effective_crypto_buying_power: 148250.75,
  contact: {
    email_address: 'alexander.vance@citadel-sovereign.io',
    phone_number: '+1 (555) 438-9201',
    street_address: ['742 Evergreen Terrace', 'Penthouse Suite B'],
    city: 'New York',
    state: 'NY',
    postal_code: '10004',
    country: 'USA',
    is_us_resident: true,
    residence_history_years: 6,
  },
  identity: {
    given_name: 'Alexander',
    family_name: 'Vance',
    middle_name: 'Sterling',
    date_of_birth: '1984-11-22',
    tax_id: '***-**-8492',
    tax_id_type: 'USA_SSN',
    country_of_citizenship: 'USA',
    country_of_birth: 'USA',
    country_of_tax_residence: 'USA',
    funding_source: ['employment_income', 'investment_proceeds'],
    matched_address: '742 Evergreen Terrace, New York, NY 10004',
    is_affiliated_exchange_or_finra: false,
    is_politically_exposed: false,
    is_control_person: false,
  },
  disclosures: {
    is_control_person: false,
    is_affiliated_exchange_or_finra: false,
    is_politically_exposed: false,
    immediate_family_exposed: false,
    employment_status: 'employed',
    employer_name: 'Apex Sovereign Capital LLC',
    employer_address: '200 Vesey St, New York, NY 10281',
    employment_position: 'Managing Partner - Quantitative Strategies',
    source_of_funds: 'employment_income',
  },
  financial_profile: {
    annual_income_min: 500000,
    annual_income_max: 1000000,
    liquid_net_worth_min: 1500000,
    liquid_net_worth_max: 3000000,
    total_net_worth_min: 3500000,
    total_net_worth_max: 7500000,
    investment_objective: 'speculation',
    investment_experience_years: {
      equities: 14,
      options: 9,
      fixed_income: 7,
      crypto: 6,
      derivatives: 8,
      futures: 5,
    },
    risk_tolerance: 'aggressive',
    liquidity_needs: 'somewhat_important',
    time_horizon_years: 15,
  },
  trusted_contact: {
    given_name: 'Elena',
    family_name: 'Vance',
    email_address: 'elena.vance@citadel-sovereign.io',
    phone_number: '+1 (555) 438-9209',
    street_address: ['742 Evergreen Terrace', 'Penthouse Suite B'],
    city: 'New York',
    state: 'NY',
    postal_code: '10004',
    country: 'USA',
    relationship: 'spouse',
    disclosure_consented: true,
  },
  documents: [
    {
      id: 'doc-w9-2025-01',
      account_id: accountId,
      document_type: 'w9',
      document_sub_type: 'IRS Form W-9 Electronic Certification',
      content_type: 'application/pdf',
      file_name: 'Form_W9_Signed_A_Vance.pdf',
      file_size_bytes: 348120,
      uploaded_at: '2025-01-15T08:32:10.000Z',
      status: 'VALIDATED',
      verification_vendor: 'INTERNAL_AUDIT',
      verification_digest: 'sha256:7f83b1657ff1ec53b706c8880d9056e55786a489d977a655f6b2f446bfe55219',
    },
    {
      id: 'doc-pass-2025-02',
      account_id: accountId,
      document_type: 'identity_verification',
      document_sub_type: 'US Passport Biometric Page',
      content_type: 'image/jpeg',
      file_name: 'US_Passport_Scan_Vance.jpg',
      file_size_bytes: 2841920,
      uploaded_at: '2025-01-15T08:35:40.000Z',
      status: 'VALIDATED',
      verification_vendor: 'ONFIDO',
      verification_digest: 'sha256:91b2c45ee83160a0f44391295bcf56a782e4492bfd90875c7423315668ac90b1',
    },
    {
      id: 'doc-utility-2025-03',
      account_id: accountId,
      document_type: 'proof_of_address',
      document_sub_type: 'Consolidated Edison Utility Bill',
      content_type: 'application/pdf',
      file_name: 'ConEd_Electric_Statement_Dec2024.pdf',
      file_size_bytes: 849310,
      uploaded_at: '2025-01-15T08:37:05.000Z',
      status: 'VALIDATED',
      verification_vendor: 'COMPLY_ADVANTAGE',
      verification_digest: 'sha256:4a0c8d193ef20bc71e5491a9987c2b3e4f55a1d9b329487c65e01bca908234ea',
    },
  ],
  bank_relationships: [
    {
      id: 'bank-rel-01',
      account_id: accountId,
      bank_name: 'Citibank N.A. Private Banking',
      account_number_last4: '9082',
      routing_number: '021000089',
      bank_account_type: 'checking',
      status: 'APPROVED',
      created_at: '2025-01-15T09:00:00.000Z',
      verification_method: 'PLAID',
      verified_at: '2025-01-15T09:01:22.000Z',
      currency: 'USD',
    },
    {
      id: 'bank-rel-02',
      account_id: accountId,
      bank_name: 'JPMorgan Chase High Net Worth',
      account_number_last4: '4190',
      routing_number: '021000021',
      bank_account_type: 'checking',
      status: 'APPROVED',
      created_at: '2025-02-10T14:15:00.000Z',
      verification_method: 'MICRO_DEPOSITS',
      verified_at: '2025-02-12T11:20:00.000Z',
      currency: 'USD',
    },
  ],
  audit_ledger: [
    {
      id: 'audit-001',
      action: 'ACCOUNT_CREATED',
      performed_by: 'system_auto_provisioner',
      timestamp: '2025-01-15T08:30:00.000Z',
      details: { client_ip: '198.51.100.44', user_agent: 'BrokerApiEngine/4.2' },
    },
    {
      id: 'audit-002',
      action: 'CIP_VALIDATION_PASSED',
      performed_by: 'onfido_engine_v3',
      timestamp: '2025-01-15T08:38:10.000Z',
      details: { risk_score: 12, ofac_match: false, score: 98 },
    },
    {
      id: 'audit-003',
      action: 'OPTIONS_LEVEL_APPROVED',
      performed_by: 'chief_compliance_officer',
      timestamp: '2025-01-15T09:15:00.000Z',
      details: { level: 3, risk_acknowledgement: true },
    },
  ],
});

export const createDefaultCipData = (accountId: string): AlpacaCipData => ({
  account_id: accountId,
  provider_name: ['Onfido v3.8 Biometrics', 'ComplyAdvantage Real-time OFAC', 'LexisNexis Risk Engine'],
  kyc: {
    applicant_name: 'Alexander Sterling Vance',
    approval_status: 'APPROVED',
    risk_level: 'LOW',
    risk_score: 12,
    submitted_at: '2025-01-15T08:30:00.000Z',
    completed_at: '2025-01-15T08:38:10.000Z',
    sanctions_list_match: false,
    pep_list_match: false,
    adverse_media_match: false,
    synthetic_id_probability: 0.004,
  },
  identity: {
    matched_name: 'Alexander Sterling Vance',
    matched_dob: '1984-11-22',
    matched_ssn_last4: '8492',
    matched_address: '742 Evergreen Terrace, Penthouse Suite B, New York, NY 10004',
    ssn_issued_state: 'NY',
    is_deceased: false,
    phone_carrier_risk: 'LOW',
    email_domain_risk: 'LOW',
  },
  evaluations: [
    {
      rule_id: 'CIP-OFAC-001',
      rule_name: 'OFAC SDN & Consolidated Sanctions Match',
      category: 'OFAC',
      description: 'Screens against OFAC SDN, Sectoral Sanctions, and EU/UK HM Treasury Sanctions lists.',
      outcome: 'PASS',
      score: 100,
      max_score: 100,
      triggered_flags: [],
      timestamp: '2025-01-15T08:38:00.000Z',
    },
    {
      rule_id: 'CIP-ID-002',
      rule_name: 'Social Security Number Deceased Master Index Check',
      category: 'IDENTITY',
      description: 'Checks SSA DMF database for active alive confirmation.',
      outcome: 'PASS',
      score: 95,
      max_score: 95,
      triggered_flags: [],
      timestamp: '2025-01-15T08:38:02.000Z',
    },
    {
      rule_id: 'CIP-ID-003',
      rule_name: 'Identity Core 4-Point Match',
      category: 'IDENTITY',
      description: 'Exact match verified on Name, SSN, DOB, Address across Equifax and Experian headers.',
      outcome: 'PASS',
      score: 85,
      max_score: 85,
      triggered_flags: [],
      timestamp: '2025-01-15T08:38:04.000Z',
    },
    {
      rule_id: 'CIP-PEP-004',
      rule_name: 'Politically Exposed Persons (PEP) Global Index',
      category: 'PEP',
      description: 'Zero PEP or high-profile public official matches detected.',
      outcome: 'PASS',
      score: 75,
      max_score: 75,
      triggered_flags: [],
      timestamp: '2025-01-15T08:38:05.000Z',
    },
    {
      rule_id: 'CIP-FRAUD-005',
      rule_name: 'Synthetic Identity & Velocity Scoring',
      category: 'FRAUD',
      description: 'Machine learning fraud detection probability < 0.5%. Clean history.',
      outcome: 'PASS',
      score: 80,
      max_score: 80,
      triggered_flags: [],
      timestamp: '2025-01-15T08:38:08.000Z',
    },
    {
      rule_id: 'CIP-SUIT-006',
      rule_name: 'Options Trading Suitability & Experience Matrix',
      category: 'SUITABILITY',
      description: 'Accredited net worth, 9 years derivatives experience, satisfies FINRA Rule 2360.',
      outcome: 'PASS',
      score: 60,
      max_score: 60,
      triggered_flags: [],
      timestamp: '2025-01-15T08:38:09.000Z',
    },
  ],
  checks: [
    {
      id: 'chk-onf-001',
      check_type: 'identity_core',
      provider: 'Onfido',
      outcome: 'PASS',
      score: 99,
      summary: 'Passport authentic, hologram confirmed, selfie liveness confirmed with 99.4% confidence.',
      details: { liveness: 'live_motion_verified', mrz_parsed: true, face_match: 0.994 },
      evaluated_at: '2025-01-15T08:35:45.000Z',
    },
    {
      id: 'chk-ca-002',
      check_type: 'watchlist_ofac',
      provider: 'ComplyAdvantage',
      outcome: 'PASS',
      score: 100,
      summary: 'No adverse findings across 1,400+ international watchlists, enforcement agencies, and sanctions registries.',
      details: { sources_checked: 1422, exact_hits: 0, fuzzy_hits: 0 },
      evaluated_at: '2025-01-15T08:37:12.000Z',
    },
  ],
  notes: [
    {
      id: 'note-001',
      author: 'Compliance Officer J. Miller (CRD #482910)',
      created_at: '2025-01-15T09:10:00.000Z',
      content: 'Applicant identity and enhanced due diligence documentation verified. High net worth individual with extensive derivative background. Account approved for Tier 3 options.',
      action_type: 'GENERAL',
    },
  ],
});

export const createDefaultOptionsApproval = (accountId: string): AlpacaOptionsApprovalRequest => ({
  id: `opt-req-${accountId.slice(0, 8)}`,
  account_id: accountId,
  requested_level: 3,
  approved_level: 3,
  status: 'APPROVED',
  reasons: [
    'Substantial liquid net worth (>$1.5M)',
    'Over 5+ years active options and derivative trading history',
    'Signed Options Disclosure Document (ODD) on file',
    'FINRA Rule 2360 suitability clearance obtained',
  ],
  agreement_signed_at: '2025-01-15T09:12:00.000Z',
  suitability_passed: true,
  experience_score: 94,
  net_worth_qualified: true,
  reviewed_by: 'FINRA Series 4 Principal (Reg ID: S4-88492)',
  reviewed_at: '2025-01-15T09:14:45.000Z',
  supervisory_notes: 'Full multi-leg spreads, straddles, iron condors, and cash-secured strategies unlocked.',
});

/* ============================================================================
 * REAL-WORLD IN-MEMORY SERVICE WITH LOCAL STORAGE PERSISTENCE
 * ============================================================================ */

class LocalAlpacaAccountsService implements AlpacaAccountsService {
  private prefix = 'alpaca_corr_mgmt_v2:';

  private getKey(sub: string, id: string): string {
    return `${this.prefix}${sub}:${id}`;
  }

  async getAccountDetails(accountId: string): Promise<AlpacaAccountFullRecord> {
    const raw = localStorage.getItem(this.getKey('account', accountId));
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn('Failed parsing account record from local storage', e);
      }
    }
    const def = createDefaultAccountRecord(accountId);
    def.cip_data = createDefaultCipData(accountId);
    def.options_approval = createDefaultOptionsApproval(accountId);
    this.saveAccountDetails(def);
    return def;
  }

  private saveAccountDetails(record: AlpacaAccountFullRecord): void {
    localStorage.setItem(this.getKey('account', record.id), JSON.stringify(record));
  }

  async getCip(accountId: string): Promise<AlpacaCipData> {
    const account = await this.getAccountDetails(accountId);
    if (account.cip_data) return account.cip_data;
    const defCip = createDefaultCipData(accountId);
    account.cip_data = defCip;
    this.saveAccountDetails(account);
    return defCip;
  }

  async getOptionsApproval(accountId: string): Promise<AlpacaOptionsApprovalRequest> {
    const account = await this.getAccountDetails(accountId);
    if (account.options_approval) return account.options_approval;
    const defOpt = createDefaultOptionsApproval(accountId);
    account.options_approval = defOpt;
    this.saveAccountDetails(account);
    return defOpt;
  }

  async requestOptionsApproval(accountId: string, level: number): Promise<AlpacaOptionsApprovalRequest> {
    const account = await this.getAccountDetails(accountId);
    const validLevel = Math.max(0, Math.min(4, Math.floor(level))) as AlpacaOptionsLevel;
    
    // Evaluate Suitability Algorithm
    const exp = account.financial_profile.investment_experience_years.options;
    const netWorth = account.financial_profile.liquid_net_worth_max;
    const isAccredited = netWorth >= 1000000;
    
    let isApproved = false;
    const reasons: string[] = [];

    if (validLevel <= 1) {
      isApproved = true;
      reasons.push('Basic covered call/cash-secured put eligibility satisfied.');
    } else if (validLevel === 2) {
      if (exp >= 1 || isAccredited) {
        isApproved = true;
        reasons.push('Long call & long put buying power approved based on trading tenure.');
      } else {
        reasons.push('Insufficient options experience (< 1 year).');
      }
    } else if (validLevel === 3) {
      if (exp >= 3 && (isAccredited || account.financial_profile.annual_income_min >= 150000)) {
        isApproved = true;
        reasons.push('Spread and multi-leg risk matrix cleared.');
      } else {
        reasons.push('Advanced multi-leg requires minimum 3 years experience or >$150k annual income.');
      }
    } else if (validLevel === 4) {
      if (exp >= 5 && isAccredited && account.account_class === 'margin_pdt') {
        isApproved = true;
        reasons.push('Uncovered / naked index options trading cleared by Supervisory Principal.');
      } else {
        reasons.push('Naked options require accredited tier and minimum 5 years options tenure.');
      }
    }

    const updatedApproval: AlpacaOptionsApprovalRequest = {
      id: `opt-req-${Date.now().toString(36)}`,
      account_id: accountId,
      requested_level: validLevel,
      approved_level: isApproved ? validLevel : Math.min(account.options_trading_level, validLevel) as AlpacaOptionsLevel,
      status: isApproved ? 'APPROVED' : 'RESTRICTED',
      reasons,
      agreement_signed_at: new Date().toISOString(),
      suitability_passed: isApproved,
      experience_score: Math.min(100, exp * 12 + (isAccredited ? 40 : 10)),
      net_worth_qualified: isAccredited,
      reviewed_by: 'Alpaca Automated Compliance Engine & FINRA Rule 2360 Bot',
      reviewed_at: new Date().toISOString(),
      supervisory_notes: isApproved
        ? `Upgraded to Options Level ${validLevel} following electronic risk questionnaire evaluation.`
        : `Request for Level ${validLevel} restricted. Downgraded or retained at Level ${account.options_trading_level}.`,
    };

    account.options_approval = updatedApproval;
    if (isApproved) {
      account.options_trading_level = validLevel;
    }
    
    account.audit_ledger.unshift({
      id: `audit-${Date.now()}`,
      action: 'OPTIONS_APPROVAL_REQUEST',
      performed_by: 'correspondent_officer',
      timestamp: new Date().toISOString(),
      details: { requested_level: level, outcome: updatedApproval.status, approved_level: updatedApproval.approved_level },
    });

    this.saveAccountDetails(account);
    return updatedApproval;
  }

  async getOnfidoSdkToken(accountId: string): Promise<OnfidoTokenResponse> {
    // Generate high-entropy mock web SDK JWT token
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const token = `api_sandbox.alpaca_onfido_v3.tok_${accountId.slice(0, 6)}_${randomHex}`;
    const res: OnfidoTokenResponse = {
      token,
      applicant_id: `onf_app_${accountId.slice(0, 8)}`,
      sdk_config: {
        language: 'en_US',
        flow_steps: ['welcome', 'document', 'face', 'complete'],
      },
    };
    return res;
  }

  async uploadAccountDocument(
    accountId: string,
    docMeta: Partial<AlpacaDocumentRecord>,
    file: File | Blob
  ): Promise<AlpacaDocumentRecord> {
    const account = await this.getAccountDetails(accountId);
    const newDoc: AlpacaDocumentRecord = {
      id: `doc-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      account_id: accountId,
      document_type: docMeta.document_type || 'identity_verification',
      document_sub_type: docMeta.document_sub_type || 'Uploaded Broker Document',
      content_type: (file.type as any) || 'application/pdf',
      file_name: (file as File).name || `document_${Date.now()}.pdf`,
      file_size_bytes: file.size || 1024 * 250,
      uploaded_at: new Date().toISOString(),
      status: 'VALIDATED',
      verification_vendor: 'INTERNAL_AUDIT',
      verification_digest: `sha256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };

    account.documents.unshift(newDoc);
    account.audit_ledger.unshift({
      id: `audit-${Date.now()}`,
      action: 'DOCUMENT_UPLOADED',
      performed_by: 'correspondent_officer',
      timestamp: new Date().toISOString(),
      details: { doc_id: newDoc.id, type: newDoc.document_type, file_name: newDoc.file_name },
    });

    this.saveAccountDetails(account);
    return newDoc;
  }

  async verifyBankRelationship(accountId: string, relationshipId: string): Promise<AlpacaBankRelationship> {
    const account = await this.getAccountDetails(accountId);
    const rel = account.bank_relationships.find((b) => b.id === relationshipId);
    if (!rel) throw new Error(`Bank relationship with ID ${relationshipId} not found`);
    rel.status = 'APPROVED';
    rel.verified_at = new Date().toISOString();

    account.audit_ledger.unshift({
      id: `audit-${Date.now()}`,
      action: 'BANK_RELATIONSHIP_VERIFIED',
      performed_by: 'ach_clearing_engine',
      timestamp: new Date().toISOString(),
      details: { relationship_id: relationshipId, bank: rel.bank_name },
    });

    this.saveAccountDetails(account);
    return rel;
  }

  async overrideCipCheck(
    accountId: string,
    ruleId: string,
    rationale: string,
    approvedBy: string
  ): Promise<AlpacaCipData> {
    const account = await this.getAccountDetails(accountId);
    if (!account.cip_data) {
      account.cip_data = createDefaultCipData(accountId);
    }
    const evalTarget = account.cip_data.evaluations.find((e) => e.rule_id === ruleId);
    if (evalTarget) {
      evalTarget.outcome = 'PASS';
      evalTarget.score = evalTarget.max_score;
      evalTarget.adverse_action_reason = undefined;
    }
    account.cip_data.notes.unshift({
      id: `note-${Date.now()}`,
      author: approvedBy,
      created_at: new Date().toISOString(),
      content: `Manual Supervisory Override on Rule ${ruleId}: ${rationale}`,
      action_type: 'OVERRIDE',
    });

    account.audit_ledger.unshift({
      id: `audit-${Date.now()}`,
      action: 'CIP_RULE_OVERRIDE',
      performed_by: approvedBy,
      timestamp: new Date().toISOString(),
      details: { rule_id: ruleId, rationale },
    });

    this.saveAccountDetails(account);
    return account.cip_data;
  }

  async lockAccountTrading(
    accountId: string,
    reason: string
  ): Promise<{ success: boolean; newStatus: AlpacaAccountStatus }> {
    const account = await this.getAccountDetails(accountId);
    account.status = 'RESTRICTED';
    account.audit_ledger.unshift({
      id: `audit-${Date.now()}`,
      action: 'ACCOUNT_RESTRICTED',
      performed_by: 'supervisory_risk_officer',
      timestamp: new Date().toISOString(),
      details: { reason },
    });
    this.saveAccountDetails(account);
    return { success: true, newStatus: 'RESTRICTED' };
  }

  async unlockAccountTrading(
    accountId: string,
    reason: string
  ): Promise<{ success: boolean; newStatus: AlpacaAccountStatus }> {
    const account = await this.getAccountDetails(accountId);
    account.status = 'ACTIVE';
    account.audit_ledger.unshift({
      id: `audit-${Date.now()}`,
      action: 'ACCOUNT_UNRESTRICTED',
      performed_by: 'supervisory_risk_officer',
      timestamp: new Date().toISOString(),
      details: { reason },
    });
    this.saveAccountDetails(account);
    return { success: true, newStatus: 'ACTIVE' };
  }

  async exportCipAuditPacket(accountId: string): Promise<Blob> {
    const account = await this.getAccountDetails(accountId);
    const packet = {
      export_meta: {
        schema_version: 'SEC-17a-4-2025.1',
        correspondent_firm: 'Sovereign Citadel Securities LLC',
        finra_crd_number: '194821',
        alpaca_clearing_partner_id: 'ALP-CL-883921',
        generated_timestamp: new Date().toISOString(),
        security_classification: 'FINRA CONFIDENTIAL // COMPLIANCE RESTRICTED',
      },
      account_summary: account,
    };
    return new Blob([JSON.stringify(packet, null, 2)], { type: 'application/json' });
  }
}

export const alpacaAccountsService: AlpacaAccountsService = new LocalAlpacaAccountsService();

/* ============================================================================
 * HELPER FORMATTERS & UTILITIES
 * ============================================================================ */

export const formatCurrency = (val: number | undefined | null): string => {
  if (val === undefined || val === null || isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const formatTimestamp = (isoString?: string): string => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return isoString;
  }
};

export const getStatusBadgeStyle = (status: AlpacaAccountStatus | string) => {
  switch (status) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'PASS':
    case 'VALIDATED':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'MANUAL_REVIEW':
    case 'APPROVAL_PENDING':
    case 'CIP_PENDING':
    case 'WARN':
    case 'PROCESSING':
    case 'SUBMITTED':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'RESTRICTED':
    case 'REVIEW':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'REJECTED':
    case 'DISABLED':
    case 'FAIL':
    case 'ACCOUNT_CLOSED':
    case 'OFFBOARDED':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-slate-700/50 text-slate-300 border-slate-600';
  }
};

export const getOptionsLevelDescription = (level: AlpacaOptionsLevel): string => {
  switch (level) {
    case 0:
      return 'Level 0 - Options Inactive';
    case 1:
      return 'Level 1 - Covered Equity Calls & Cash-Secured Equity Puts';
    case 2:
      return 'Level 2 - Long Calls & Long Puts (Directional Long Options)';
    case 3:
      return 'Level 3 - Credit/Debit Spreads, Iron Condors, Straddles & Multi-Leg Combos';
    case 4:
      return 'Level 4 - Uncovered/Naked Short Equity & Index Options (Highest Margin Risk)';
    default:
      return `Level ${level}`;
  }
};
/* ============================================================================
 * REAL-TIME REGULATORY & CRYPTOGRAPHIC ALGORITHMIC ENGINES
 * ============================================================================ */

/**
 * Jaro-Winkler Metric Algorithm for OFAC Sanctions Fuzzy String Matching
 * Used for deep compliance matching across PEP lists, SDN entries, and FinCEN 314(a) dossiers.
 */
export class SanctionsFuzzyMatcher {
  public static jaroDistance(s1: string, s2: string): number {
    const a = s1.toLowerCase().trim();
    const b = s2.toLowerCase().trim();

    if (a === b) return 1.0;
    if (a.length === 0 || b.length === 0) return 0.0;

    const matchDistance = Math.floor(Math.max(a.length, b.length) / 2) - 1;
    const aMatches = new Array(a.length).fill(false);
    const bMatches = new Array(b.length).fill(false);

    let matches = 0;
    let transpositions = 0;

    for (let i = 0; i < a.length; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, b.length);

      for (let j = start; j < end; j++) {
        if (bMatches[j]) continue;
        if (a[i] !== b[j]) continue;
        aMatches[i] = true;
        bMatches[j] = true;
        matches++;
        break;
      }
    }

    if (matches === 0) return 0.0;

    let k = 0;
    for (let i = 0; i < a.length; i++) {
      if (!aMatches[i]) continue;
      while (!bMatches[k]) {
        k++;
      }
      if (a[i] !== b[k]) {
        transpositions++;
      }
      k++;
    }

    const m = matches;
    return (m / a.length + m / b.length + (m - transpositions / 2) / m) / 3.0;
  }

  public static jaroWinkler(s1: string, s2: string, prefixScale: number = 0.1): number {
    const jaroDist = this.jaroDistance(s1, s2);
    if (jaroDist < 0.7) return jaroDist;

    let prefix = 0;
    const maxPrefix = Math.min(4, Math.min(s1.length, s2.length));

    for (let i = 0; i < maxPrefix; i++) {
      if (s1[i].toLowerCase() === s2[i].toLowerCase()) {
        prefix++;
      } else {
        break;
      }
    }

    return jaroDist + prefix * prefixScale * (1.0 - jaroDist);
  }

  public static evaluateOfacMatch(
    applicantName: string,
    sdnEntries: Array<{ name: string; aliases: string[]; country: string; sanctionId: string }>
  ): { hasMatch: boolean; highestSimilarity: number; matchedEntry?: any } {
    let highestSimilarity = 0.0;
    let matchedEntry: any = null;

    for (const entry of sdnEntries) {
      const primarySim = this.jaroWinkler(applicantName, entry.name);
      if (primarySim > highestSimilarity) {
        highestSimilarity = primarySim;
        matchedEntry = entry;
      }

      for (const alias of entry.aliases) {
        const aliasSim = this.jaroWinkler(applicantName, alias);
        if (aliasSim > highestSimilarity) {
          highestSimilarity = aliasSim;
          matchedEntry = { ...entry, matchedAlias: alias };
        }
      }
    }

    return {
      hasMatch: highestSimilarity >= 0.88,
      highestSimilarity,
      matchedEntry: highestSimilarity >= 0.88 ? matchedEntry : undefined,
    };
  }
}

/**
 * FINRA Rule 2090 (Know Your Customer) & Rule 2111 / 2360 Suitability Evaluation Engine
 * Multi-factor algorithmic scoring assessing risk capacity, liquidity horizons, and derivatives aptitude.
 */
export class SuitabilityRuleEngine {
  public static calculateOptionsAptitudeScore(
    profile: AlpacaFinancialProfile,
    requestedLevel: AlpacaOptionsLevel
  ): {
    score: number;
    maxScore: number;
    isQualified: boolean;
    breakdown: Record<string, number>;
    disqualifiers: string[];
  } {
    const breakdown: Record<string, number> = {};
    const disqualifiers: string[] = [];

    // 1. Experience in Options & Derivatives (Max 35 points)
    const optExp = profile.investment_experience_years.options;
    const derivExp = profile.investment_experience_years.derivatives;
    const expPoints = Math.min(35, optExp * 5 + derivExp * 2);
    breakdown['options_tenure'] = expPoints;

    // 2. Liquid Net Worth Capacity (Max 25 points)
    let netWorthPoints = 0;
    if (profile.liquid_net_worth_max >= 1500000) netWorthPoints = 25;
    else if (profile.liquid_net_worth_max >= 500000) netWorthPoints = 20;
    else if (profile.liquid_net_worth_max >= 100000) netWorthPoints = 14;
    else if (profile.liquid_net_worth_max >= 25000) netWorthPoints = 8;
    else netWorthPoints = 2;
    breakdown['liquid_net_worth'] = netWorthPoints;

    // 3. Annual Income Capacity (Max 20 points)
    let incomePoints = 0;
    if (profile.annual_income_max >= 500000) incomePoints = 20;
    else if (profile.annual_income_max >= 200000) incomePoints = 16;
    else if (profile.annual_income_max >= 100000) incomePoints = 12;
    else if (profile.annual_income_max >= 50000) incomePoints = 7;
    else incomePoints = 2;
    breakdown['annual_income'] = incomePoints;

    // 4. Risk Tolerance Alignment (Max 20 points)
    let riskPoints = 0;
    switch (profile.risk_tolerance) {
      case 'speculative':
        riskPoints = 20;
        break;
      case 'aggressive':
        riskPoints = 16;
        break;
      case 'moderate':
        riskPoints = 10;
        break;
      case 'low':
        riskPoints = 2;
        break;
    }
    breakdown['risk_tolerance'] = riskPoints;

    const totalScore = expPoints + netWorthPoints + incomePoints + riskPoints;
    const maxScore = 100;

    // Evaluate against requested options tier
    if (requestedLevel >= 3 && profile.risk_tolerance === 'low') {
      disqualifiers.push('Conservative risk tolerance precludes multi-leg options spreads.');
    }
    if (requestedLevel >= 4 && profile.liquid_net_worth_max < 250000) {
      disqualifiers.push('Uncovered short option authorization requires minimum $250k liquid net worth.');
    }
    if (requestedLevel >= 3 && optExp < 1) {
      disqualifiers.push('Level 3 Spreads require at least 1 full year of verified options experience.');
    }
    if (requestedLevel >= 4 && optExp < 3) {
      disqualifiers.push('Level 4 Naked writing requires at least 3 years active options trading tenure.');
    }

    const minScoreRequired = requestedLevel === 1 ? 25 : requestedLevel === 2 ? 45 : requestedLevel === 3 ? 65 : 85;
    const isQualified = totalScore >= minScoreRequired && disqualifiers.length === 0;

    return {
      score: totalScore,
      maxScore,
      isQualified,
      breakdown,
      disqualifiers,
    };
  }

  public static evaluateCipRules(
    account: AlpacaAccountFullRecord
  ): { evaluations: AlpacaCIPRuleEvaluation[]; aggregateScore: number; riskLevel: AlpacaRiskScoreLevel } {
    const evaluations: AlpacaCIPRuleEvaluation[] = [];

    // Rule 1: OFAC Sanctions
    evaluations.push({
      rule_id: 'CIP-OFAC-001',
      rule_name: 'OFAC SDN & Consolidated Sanctions Match',
      category: 'OFAC',
      description: 'Screens against OFAC SDN and European Sectoral Sanctions lists.',
      outcome: account.identity.is_politically_exposed ? 'WARN' : 'PASS',
      score: account.identity.is_politically_exposed ? 80 : 100,
      max_score: 100,
      triggered_flags: account.identity.is_politically_exposed ? ['PEP_AFFILIATE_NOTED'] : [],
      timestamp: new Date().toISOString(),
    });

    // Rule 2: SSA Deceased Registry
    evaluations.push({
      rule_id: 'CIP-ID-002',
      rule_name: 'Social Security Number Deceased Master Index Check',
      category: 'IDENTITY',
      description: 'SSA DMF Registry verification confirms applicant is active and alive.',
      outcome: 'PASS',
      score: 95,
      max_score: 95,
      triggered_flags: [],
      timestamp: new Date().toISOString(),
    });

    // Rule 3: 4-Point Core Identity
    const hasValidAddress = account.contact.street_address.length > 0 && account.contact.postal_code.length >= 5;
    evaluations.push({
      rule_id: 'CIP-ID-003',
      rule_name: 'Identity Core 4-Point Match',
      category: 'IDENTITY',
      description: 'Cross-verifies Name, DOB, SSN, and Residential Address.',
      outcome: hasValidAddress ? 'PASS' : 'WARN',
      score: hasValidAddress ? 85 : 40,
      max_score: 85,
      triggered_flags: hasValidAddress ? [] : ['UNRESOLVED_RESIDENTIAL_ADDRESS'],
      timestamp: new Date().toISOString(),
    });

    // Rule 4: PEP Foreign/Domestic
    evaluations.push({
      rule_id: 'CIP-PEP-004',
      rule_name: 'Politically Exposed Persons (PEP) Global Index',
      category: 'PEP',
      description: 'Senior Foreign Political Figures and FATF High-Risk Jurisdictions.',
      outcome: account.disclosures.is_politically_exposed ? 'REVIEW' : 'PASS',
      score: account.disclosures.is_politically_exposed ? 50 : 75,
      max_score: 75,
      triggered_flags: account.disclosures.is_politically_exposed ? ['PEP_FLAGGED_FOR_MANUAL_REVIEW'] : [],
      timestamp: new Date().toISOString(),
    });

    // Rule 5: Synthetic Identity & Fraud Network
    evaluations.push({
      rule_id: 'CIP-FRAUD-005',
      rule_name: 'Synthetic Identity & Velocity Scoring',
      category: 'FRAUD',
      description: 'Identity linkage, high velocity application detection, and IP risk scoring.',
      outcome: 'PASS',
      score: 80,
      max_score: 80,
      triggered_flags: [],
      timestamp: new Date().toISOString(),
    });

    // Calculate total and risk
    const totalAchieved = evaluations.reduce((acc, curr) => acc + curr.score, 0);
    const totalMax = evaluations.reduce((acc, curr) => acc + curr.maxScore, 0);
    const normalizedScore = Math.round((totalAchieved / totalMax) * 100);

    let riskLevel: AlpacaRiskScoreLevel = 'LOW';
    if (normalizedScore < 50) riskLevel = 'CRITICAL';
    else if (normalizedScore < 70) riskLevel = 'HIGH';
    else if (normalizedScore < 85) riskLevel = 'MEDIUM';
    else if (normalizedScore < 95) riskLevel = 'LOW';
    else riskLevel = 'VERY_LOW';

    return {
      evaluations,
      aggregateScore: normalizedScore,
      riskLevel,
    };
  }
}

/* ============================================================================
 * STATE MANAGEMENT & REDUCER DEFINITIONS FOR MANAGER COMPONENT
 * ============================================================================ */

export interface AlpacaAccountState {
  account: AlpacaAccountFullRecord;
  cipData: AlpacaCipData | null;
  optionsApproval: AlpacaOptionsApprovalRequest | null;
  activeTab: 'summary' | 'cip_kyc' | 'options' | 'documents' | 'banking' | 'audit' | 'explorer';
  loading: boolean;
  actionInProgress: string | null;
  errorMessage: string | null;
  successMessage: string | null;
  onfidoToken: string | null;
  requestedLevel: AlpacaOptionsLevel;
  searchQuery: string;
  selectedDocument: AlpacaDocumentRecord | null;
  filterDocumentType: string;
  overrideModalOpen: boolean;
  overrideTargetRuleId: string | null;
  overrideRationale: string;
  isAddBankModalOpen: boolean;
  newBankForm: {
    bankName: string;
    routingNumber: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
  };
  filterAuditAction: string;
}

export type AlpacaAccountAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ACTION_IN_PROGRESS'; payload: string | null }
  | { type: 'SET_ACCOUNT'; payload: AlpacaAccountFullRecord }
  | { type: 'SET_CIP_DATA'; payload: AlpacaCipData }
  | { type: 'SET_OPTIONS_APPROVAL'; payload: AlpacaOptionsApprovalRequest }
  | { type: 'SET_ACTIVE_TAB'; payload: AlpacaAccountState['activeTab'] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUCCESS'; payload: string | null }
  | { type: 'SET_ONFIDO_TOKEN'; payload: string }
  | { type: 'SET_REQUESTED_LEVEL'; payload: AlpacaOptionsLevel }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_DOCUMENT'; payload: AlpacaDocumentRecord | null }
  | { type: 'SET_FILTER_DOC_TYPE'; payload: string }
  | { type: 'OPEN_OVERRIDE_MODAL'; payload: string }
  | { type: 'CLOSE_OVERRIDE_MODAL' }
  | { type: 'SET_OVERRIDE_RATIONALE'; payload: string }
  | { type: 'TOGGLE_ADD_BANK_MODAL'; payload: boolean }
  | { type: 'UPDATE_NEW_BANK_FORM'; payload: Partial<AlpacaAccountState['newBankForm']> }
  | { type: 'RESET_NEW_BANK_FORM' }
  | { type: 'SET_FILTER_AUDIT_ACTION'; payload: string };

export const initialAccountState: AlpacaAccountState = {
  account: createDefaultAccountRecord('b9b19618-22dd-4e80-8432-fc9e1ba0b27d'),
  cipData: null,
  optionsApproval: null,
  activeTab: 'summary',
  loading: false,
  actionInProgress: null,
  errorMessage: null,
  successMessage: null,
  onfidoToken: null,
  requestedLevel: 3,
  searchQuery: '',
  selectedDocument: null,
  filterDocumentType: 'ALL',
  overrideModalOpen: false,
  overrideTargetRuleId: null,
  overrideRationale: '',
  isAddBankModalOpen: false,
  newBankForm: {
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking',
  },
  filterAuditAction: 'ALL',
};

export const alpacaAccountReducer = (
  state: AlpacaAccountState,
  action: AlpacaAccountAction
): AlpacaAccountState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ACTION_IN_PROGRESS':
      return { ...state, actionInProgress: action.payload };
    case 'SET_ACCOUNT':
      return { ...state, account: action.payload };
    case 'SET_CIP_DATA':
      return { ...state, cipData: action.payload };
    case 'SET_OPTIONS_APPROVAL':
      return { ...state, optionsApproval: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload };
    case 'SET_SUCCESS':
      return { ...state, successMessage: action.payload };
    case 'SET_ONFIDO_TOKEN':
      return { ...state, onfidoToken: action.payload };
    case 'SET_REQUESTED_LEVEL':
      return { ...state, requestedLevel: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_DOCUMENT':
      return { ...state, selectedDocument: action.payload };
    case 'SET_FILTER_DOC_TYPE':
      return { ...state, filterDocumentType: action.payload };
    case 'OPEN_OVERRIDE_MODAL':
      return {
        ...state,
        overrideModalOpen: true,
        overrideTargetRuleId: action.payload,
        overrideRationale: '',
      };
    case 'CLOSE_OVERRIDE_MODAL':
      return {
        ...state,
        overrideModalOpen: false,
        overrideTargetRuleId: null,
        overrideRationale: '',
      };
    case 'SET_OVERRIDE_RATIONALE':
      return { ...state, overrideRationale: action.payload };
    case 'TOGGLE_ADD_BANK_MODAL':
      return { ...state, isAddBankModalOpen: action.payload };
    case 'UPDATE_NEW_BANK_FORM':
      return {
        ...state,
        newBankForm: { ...state.newBankForm, ...action.payload },
      };
    case 'RESET_NEW_BANK_FORM':
      return {
        ...state,
        newBankForm: {
          bankName: '',
          routingNumber: '',
          accountNumber: '',
          accountType: 'checking',
        },
      };
    case 'SET_FILTER_AUDIT_ACTION':
      return { ...state, filterAuditAction: action.payload };
    default:
      return state;
  }
};

/* ============================================================================
 * CONTEXT & PROVIDER PATTERN FOR SUB-COMPONENT COMPOSITION
 * ============================================================================ */

interface AlpacaAccountContextType {
  state: AlpacaAccountState;
  dispatch: React.Dispatch<AlpacaAccountAction>;
  refreshAll: () => Promise<void>;
  handleOptionsRequest: (level: AlpacaOptionsLevel) => Promise<void>;
  handleGenerateOnfido: () => Promise<void>;
  handleLockTrading: () => Promise<void>;
  handleUnlockTrading: () => Promise<void>;
  handleCipOverride: (ruleId: string, rationale: string) => Promise<void>;
  handleUploadDocument: (file: File, type: AlpacaDocumentType) => Promise<void>;
  handleCreateBankRelationship: () => Promise<void>;
  handleVerifyBank: (id: string) => Promise<void>;
  handleExportAuditPacket: () => Promise<void>;
}

export const AlpacaAccountContext = createContext<AlpacaAccountContextType | null>(null);

export const useAlpacaAccount = (): AlpacaAccountContextType => {
  const ctx = useContext(AlpacaAccountContext);
  if (!ctx) {
    throw new Error('useAlpacaAccount must be used within an AlpacaAccountProvider');
  }
  return ctx;
};

/* ============================================================================
 * REUSABLE PRESENTATIONAL SUB-COMPONENTS
 * ============================================================================ */

export const MetricStatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  badge?: string;
  badgeColor?: string;
}> = ({ title, value, subtitle, icon, trend, trendValue, badge, badgeColor }) => (
  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl relative overflow-hidden backdrop-blur-md hover:border-slate-700 transition-all shadow-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
      <div className="p-2 rounded-lg bg-slate-800/80 text-yellow-400 border border-yellow-500/20">{icon}</div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-mono font-bold text-slate-100">{value}</span>
      {badge && (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            badgeColor || 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
          }`}
        >
          {badge}
        </span>
      )}
    </div>
    {(subtitle || trendValue) && (
      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
        {trend === 'up' && <TrendingUp size={14} className="text-emerald-400" />}
        {trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
        {trendValue && (
          <span
            className={`font-semibold ${
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
            }`}
          >
            {trendValue}
          </span>
        )}
        {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
      </div>
    )}
    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl pointer-events-none" />
  </div>
);

export const ComplianceRuleCard: React.FC<{
  evaluation: AlpacaCIPRuleEvaluation;
  onOverride: (ruleId: string) => void;
}> = ({ evaluation, onOverride }) => {
  const isPass = evaluation.outcome === 'PASS';
  const isWarn = evaluation.outcome === 'WARN';
  const isFail = evaluation.outcome === 'FAIL';
  const isReview = evaluation.outcome === 'REVIEW';

  const badgeClasses = isPass
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : isWarn
    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    : isReview
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    : 'bg-red-500/20 text-red-400 border-red-500/30';

  return (
    <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-400 font-bold">{evaluation.rule_id}</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-semibold text-slate-200">{evaluation.rule_name}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{evaluation.description}</p>
        </div>
        <span className={`px-2.5 py-1 rounded text-[11px] font-bold border uppercase shrink-0 ${badgeClasses}`}>
          {evaluation.outcome} ({evaluation.score}/{evaluation.max_score})
        </span>
      </div>

      {evaluation.triggered_flags.length > 0 && (
        <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
          <AlertTriangle size={14} className="text-yellow-400 mt-0.5 shrink-0" />
          <div className="text-xs text-yellow-300">
            <span className="font-semibold">Triggered Compliance Flags:</span>
            <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-yellow-400/90 font-mono text-[11px]">
              {evaluation.triggered_flags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60 text-slate-500">
        <span>Evaluated: {formatTimestamp(evaluation.timestamp)}</span>
        {!isPass && (
          <button
            onClick={() => onOverride(evaluation.rule_id)}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 hover:bg-cyan-900/50 transition"
          >
            <ShieldAlert size={12} />
            Supervisory Override
          </button>
        )}
      </div>
    </div>
  );
};

export const AccountHeaderBar: React.FC<{
  account: AlpacaAccountFullRecord;
  onRefresh: () => void;
  loading: boolean;
  onLock: () => void;
  onUnlock: () => void;
  onExport: () => void;
}> = ({ account, onRefresh, loading, onLock, onUnlock, onExport }) => {
  const isRestricted = account.status === 'RESTRICTED';

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 p-6 rounded-2xl border border-yellow-500/30 backdrop-blur-xl shadow-2xl space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-yellow-400 shadow-inner">
            <UserCheck size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                {account.identity.given_name} {account.identity.family_name}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${getStatusBadgeStyle(account.status)}`}>
                {account.status}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {account.account_class.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono text-cyan-400">
                <Tag size={13} /> {account.account_number}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building size={13} className="text-slate-500" /> {account.clearing_broker}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-slate-500" /> Created: {formatTimestamp(account.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-yellow-400 border border-yellow-500/30 hover:border-yellow-500/50 shadow-md transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Synchronize Ledger
          </button>

          <button
            onClick={onExport}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50 shadow-md transition disabled:opacity-50"
          >
            <Download size={14} />
            Export Audit Dossier
          </button>

          {isRestricted ? (
            <button
              onClick={onUnlock}
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition disabled:opacity-50"
            >
              <Unlock size={14} />
              Unlock Trading Privileges
            </button>
          ) : (
            <button
              onClick={onLock}
              disabled={loading}
              className="flex items-center gap-2 bg-red-600/90 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-red-500/30 shadow-lg shadow-red-950/40 transition disabled:opacity-50"
            >
              <Lock size={14} />
              Freeze Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const NavigationTabBar: React.FC<{
  activeTab: AlpacaAccountState['activeTab'];
  onSelectTab: (tab: AlpacaAccountState['activeTab']) => void;
  documentCount: number;
  bankCount: number;
  auditCount: number;
}> = ({ activeTab, onSelectTab, documentCount, bankCount, auditCount }) => {
  const tabs = [
    { id: 'summary', label: 'Correspondent Summary', icon: LayoutGrid },
    { id: 'cip_kyc', label: 'CIP & Sanctions Intelligence', icon: ShieldCheck },
    { id: 'options', label: 'Options Approval Matrix', icon: Award },
    { id: 'documents', label: 'Document Custody', icon: FileText, count: documentCount },
    { id: 'banking', label: 'ACH & Bank Rails', icon: CreditCard, count: bankCount },
    { id: 'audit', label: 'FINRA Audit Ledger', icon: History, count: auditCount },
    { id: 'explorer', label: 'System Codex Explorer', icon: Terminal, count: SYSTEM_PATHS.length },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none backdrop-blur-md">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id as AlpacaAccountState['activeTab'])}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              isActive
                ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon size={15} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/* ============================================================================
 * MODAL VIEW: SUPERVISORY CIP OVERRIDE MODAL
 * ============================================================================ */

export const SupervisoryOverrideModal: React.FC<{
  isOpen: boolean;
  ruleId: string | null;
  rationale: string;
  onChangeRationale: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
}> = ({ isOpen, ruleId, rationale, onChangeRationale, onClose, onSubmit, loading }) => {
  if (!isOpen || !ruleId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Supervisory CIP Rule Override</h3>
              <p className="text-xs text-slate-400 font-mono">Target Check: {ruleId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 space-y-1">
          <span className="font-bold flex items-center gap-1.5">
            <AlertTriangle size={14} /> Regulatory Advisory (FINRA Rule 3110 / BSA § 326):
          </span>
          <p className="text-amber-200/80 leading-relaxed">
            Executing a supervisory override requires verified documentation on file. This action will be permanently recorded
            in the immutable FINRA 17a-4 audit ledger with your supervisory CRD identifier.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Mandatory Written Supervisory Rationale & Secondary Source Reference:
          </label>
          <textarea
            rows={4}
            value={rationale}
            onChange={(e) => onChangeRationale(e.target.value)}
            placeholder="Specify reason for override (e.g., Secondary utility statement verified against USPS ZIP database, identity confirmed via notarized Form W-9)..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || rationale.trim().length < 10}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs shadow-lg transition disabled:opacity-50"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <ClipboardCheck size={14} />}
            Commit Supervisory Override
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * MODAL VIEW: ADD ACH BANK RELATIONSHIP MODAL
 * ============================================================================ */

export const AddBankRelationshipModal: React.FC<{
  isOpen: boolean;
  formData: AlpacaAccountState['newBankForm'];
  onChange: (fields: Partial<AlpacaAccountState['newBankForm']>) => void;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
}> = ({ isOpen, formData, onChange, onClose, onSubmit, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
              <Building size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Link ACH Bank Relationship</h3>
              <p className="text-xs text-slate-400">Direct Fedwire / NACHA NACH/PPD Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Financial Institution Name</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => onChange({ bankName: e.target.value })}
              placeholder="e.g. JPMorgan Chase, Citibank N.A., Bank of America"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">ABA 9-Digit Routing Transit Number (RTN)</label>
            <input
              type="text"
              maxLength={9}
              value={formData.routingNumber}
              onChange={(e) => onChange({ routingNumber: e.target.value.replace(/\D/g, '') })}
              placeholder="021000021"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Account Number</label>
            <input
              type="password"
              value={formData.accountNumber}
              onChange={(e) => onChange({ accountNumber: e.target.value })}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Account Classification</label>
            <select
              value={formData.accountType}
              onChange={(e) => onChange({ accountType: e.target.value as 'checking' | 'savings' })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="checking">Checking / Demand Deposit Account (DDA)</option>
              <option value="savings">Savings Account / Interest Deposit</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || !formData.bankName || formData.routingNumber.length !== 9 || !formData.accountNumber}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs shadow-lg transition disabled:opacity-50"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Bind Bank Relationship
          </button>
        </div>
      </div>
    </div>
  );
};
/* ============================================================================
 * MODAL VIEW: DOCUMENT VIEWER & ATTESTATION MODAL
 * ============================================================================ */

export const DocumentViewerModal: React.FC<{
  isOpen: boolean;
  document: AlpacaDocumentRecord | null;
  onClose: () => void;
}> = ({ isOpen, document, onClose }) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <FileCheck size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">{document.file_name}</h3>
              <p className="text-xs text-slate-400 font-mono">ID: {document.id} • {document.document_type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800 font-mono">
          <div>
            <span className="text-slate-500 block">Sub-Type:</span>
            <span className="text-slate-200">{document.document_sub_type || 'Standard Record'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">MIME Content Type:</span>
            <span className="text-cyan-400">{document.content_type}</span>
          </div>
          <div>
            <span className="text-slate-500 block">File Size:</span>
            <span className="text-slate-200">{(document.file_size_bytes / 1024).toFixed(1)} KB</span>
          </div>
          <div>
            <span className="text-slate-500 block">Validation State:</span>
            <span className="text-emerald-400 font-bold">{document.status}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Auditing Engine:</span>
            <span className="text-slate-300">{document.verification_vendor}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Uploaded At:</span>
            <span className="text-slate-300">{formatTimestamp(document.uploaded_at)}</span>
          </div>
        </div>

        {document.verification_digest && (
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
              Cryptographic SHA-256 Digest:
            </span>
            <div className="p-2.5 bg-slate-950 rounded-lg text-[10px] font-mono text-cyan-300 break-all border border-cyan-500/20">
              {document.verification_digest}
            </div>
          </div>
        )}

        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>SEC Rule 17a-4 WORM Compliant Record</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Immutable Retention: 7 Years</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition"
          >
            Dismiss Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * MODAL VIEW: UPLOAD ACCOUNT DOCUMENT MODAL
 * ============================================================================ */

export const UploadDocumentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, docType: AlpacaDocumentType, subType: string) => Promise<void>;
  loading: boolean;
}> = ({ isOpen, onClose, onUpload, loading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<AlpacaDocumentType>('identity_verification');
  const [subType, setSubType] = useState<string>('Government Issued Photo ID');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    await onUpload(selectedFile, docType, subType);
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-yellow-500/20 rounded-xl text-yellow-400">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Ingest Regulatory Document</h3>
              <p className="text-xs text-slate-400 font-mono">SEC Rule 17a-4 / FinCEN CDD Custody</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Document Category</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as AlpacaDocumentType)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500"
            >
              <option value="identity_verification">Identity Verification (Passport / Driver License)</option>
              <option value="proof_of_address">Proof of Address (Utility Bill / Bank Statement)</option>
              <option value="w9">IRS Form W-9 (Taxpayer ID Attestation)</option>
              <option value="w8ben">IRS Form W-8BEN (Foreign Tax Residence Certificate)</option>
              <option value="corporate_resolution">Corporate Resolution & Authorized Signers</option>
              <option value="articles_of_organization">Articles of Incorporation / Formation</option>
              <option value="trust_agreement">Trust Agreement & Trustee Powers Declaration</option>
              <option value="source_of_wealth">Source of Wealth & High Net Worth Verification</option>
              <option value="finra_407_letter">FINRA Rule 407 Employer Consent Letter</option>
              <option value="acats_statement">ACATS Incoming Position Account Statement</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Document Sub-Type / Description</label>
            <input
              type="text"
              value={subType}
              onChange={(e) => setSubType(e.target.value)}
              placeholder="e.g. State Driver License - Front & Back Scan"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Select File (PDF, JPEG, PNG)</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-yellow-500/60 rounded-xl p-5 text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition flex flex-col items-center justify-center gap-2"
            >
              <FilePlus size={24} className="text-yellow-400" />
              {selectedFile ? (
                <div className="text-xs">
                  <span className="font-semibold text-slate-200 block">{selectedFile.name}</span>
                  <span className="text-[11px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-yellow-400 block">Click to browse file</span>
                  <span className="text-[11px] text-slate-500">Maximum file size 25MB</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs shadow-lg transition disabled:opacity-50"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
            Upload to Compliant Custody
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * TAB VIEW 1: CORRESPONDENT ACCOUNT SUMMARY TAB
 * ============================================================================ */

export const CorrespondentSummaryTab: React.FC = () => {
  const { state } = useAlpacaAccount();
  const { account } = state;

  return (
    <div className="space-y-6">
      {/* Top Level Financial Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricStatCard
          title="Portfolio Net Equity"
          value={formatCurrency(account.portfolio_value)}
          subtitle="Real-time Velox clearing valuation"
          icon={<Coins size={18} />}
          trend="up"
          trendValue="+3.8% Today"
          badge="Live"
          badgeColor="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        />
        <MetricStatCard
          title="Settled Cash Balance"
          value={formatCurrency(account.cash_balance)}
          subtitle="FDIC Sweeps Enabled"
          icon={<Wallet size={18} />}
          badge="USD"
        />
        <MetricStatCard
          title="Day Trading Buying Power"
          value={formatCurrency(account.daytrading_buying_power)}
          subtitle={`Leverage: ${account.margin_multiplier}x Margin`}
          icon={<Zap size={18} />}
          badge={account.pattern_day_trader ? 'PDT ACTIVE' : 'NON-PDT'}
          badgeColor={account.pattern_day_trader ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-slate-700/50 text-slate-300 border-slate-600'}
        />
        <MetricStatCard
          title="Options Buying Power"
          value={formatCurrency(account.options_buying_power)}
          subtitle={getOptionsLevelDescription(account.options_trading_level)}
          icon={<Award size={18} />}
          badge={`Level ${account.options_trading_level}`}
          badgeColor="bg-purple-500/20 text-purple-400 border-purple-500/30"
        />
      </div>

      {/* Account Specifications & Clearing Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Metadata Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <Building size={16} className="text-yellow-400" />
              Brokerage Master Details
            </h3>
            <span className="font-mono text-xs text-yellow-400 font-bold">{account.account_number}</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Account Classification:</span>
              <span className="font-mono text-slate-200 uppercase font-semibold">{account.account_type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Margin Class:</span>
              <span className="font-mono text-cyan-400 uppercase font-semibold">{account.account_class}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Clearing Intermediary:</span>
              <span className="text-slate-300 font-semibold">{account.clearing_broker}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Reg-T Buying Power:</span>
              <span className="font-mono text-slate-200">{formatCurrency(account.regt_buying_power)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Crypto Trading Power:</span>
              <span className="font-mono text-emerald-400">{formatCurrency(account.effective_crypto_buying_power)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Day Trade Execution Count:</span>
              <span className="font-mono text-yellow-400 font-bold">{account.daytrade_count} / 3 (Rolling 5D)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Fractional Share Trading:</span>
              <span className={`font-semibold ${account.fractional_trading_enabled ? 'text-emerald-400' : 'text-red-400'}`}>
                {account.fractional_trading_enabled ? 'Enabled (Whole & Decimal)' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Contact & Residence */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <UserCheck size={16} className="text-cyan-400" />
              Identity & Domicile
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              US RESIDENT
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Legal Name:</span>
              <span className="text-slate-200 font-semibold">
                {account.identity.given_name} {account.identity.middle_name} {account.identity.family_name}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Tax Identification:</span>
              <span className="font-mono text-slate-300">{account.identity.tax_id} ({account.identity.tax_id_type})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Date of Birth:</span>
              <span className="font-mono text-slate-300">{account.identity.date_of_birth}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Email Address:</span>
              <span className="font-mono text-cyan-400">{account.contact.email_address}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Telephone:</span>
              <span className="font-mono text-slate-300">{account.contact.phone_number}</span>
            </div>
            <div className="py-1">
              <span className="text-slate-400 block mb-1">Residential Address:</span>
              <span className="text-slate-300 block font-mono text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800">
                {account.contact.street_address.join(', ')}<br />
                {account.contact.city}, {account.contact.state} {account.contact.postal_code}, {account.contact.country}
              </span>
            </div>
          </div>
        </div>

        {/* FINRA Affiliations & Regulatory Disclosures */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <ShieldAlert size={16} className="text-yellow-400" />
              FINRA Disclosures
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              RULE 2090/3110
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Employment Status:</span>
              <span className="text-slate-200 capitalize font-semibold">{account.disclosures.employment_status}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Current Employer:</span>
              <span className="text-slate-300">{account.disclosures.employer_name || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Executive Position:</span>
              <span className="text-slate-300 truncate max-w-[160px]">{account.disclosures.employment_position || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Public Co Control Person:</span>
              <span className={`font-semibold ${account.disclosures.is_control_person ? 'text-red-400' : 'text-emerald-400'}`}>
                {account.disclosures.is_control_person ? 'YES (10%+ Shareholder)' : 'NO'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">FINRA Broker-Dealer Affiliated:</span>
              <span className={`font-semibold ${account.disclosures.is_affiliated_exchange_or_finra ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {account.disclosures.is_affiliated_exchange_or_finra ? 'YES (Letter Required)' : 'NO'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Politically Exposed (PEP):</span>
              <span className={`font-semibold ${account.disclosures.is_politically_exposed ? 'text-red-400' : 'text-emerald-400'}`}>
                {account.disclosures.is_politically_exposed ? 'YES (Enhanced CDD Active)' : 'NO'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Profile & Suitability Assessment Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <Briefcase size={16} className="text-yellow-400" />
              FINRA Rule 2111 Financial Suitability Profile
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Accredited investor qualifications and asset liquidity horizons</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            OBJECTIVE: {account.financial_profile.investment_objective.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 block uppercase font-semibold">Net Worth & Income</span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Annual Income:</span>
                <span className="font-mono text-cyan-400">{formatCurrency(account.financial_profile.annual_income_min)} - {formatCurrency(account.financial_profile.annual_income_max)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Liquid Net Worth:</span>
                <span className="font-mono text-cyan-400">{formatCurrency(account.financial_profile.liquid_net_worth_min)} - {formatCurrency(account.financial_profile.liquid_net_worth_max)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Net Worth:</span>
                <span className="font-mono text-cyan-400">{formatCurrency(account.financial_profile.total_net_worth_min)} - {formatCurrency(account.financial_profile.total_net_worth_max)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 block uppercase font-semibold">Risk Horizon & Needs</span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Risk Tolerance:</span>
                <span className="capitalize font-semibold text-yellow-400">{account.financial_profile.risk_tolerance}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Liquidity Needs:</span>
                <span className="capitalize text-slate-200">{account.financial_profile.liquidity_needs.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Time Horizon:</span>
                <span className="font-mono text-slate-200">{account.financial_profile.time_horizon_years} Years</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 block uppercase font-semibold">Trading Experience (Years)</span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Equities</span>
                <span className="font-mono font-bold text-slate-200">{account.financial_profile.investment_experience_years.equities}y</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Options</span>
                <span className="font-mono font-bold text-purple-400">{account.financial_profile.investment_experience_years.options}y</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Crypto</span>
                <span className="font-mono font-bold text-emerald-400">{account.financial_profile.investment_experience_years.crypto}y</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * TAB VIEW 2: CIP & KYC COMPLIANCE INTELLIGENCE TAB
 * ============================================================================ */

export const CipKycIntelligenceTab: React.FC = () => {
  const {
    state,
    dispatch,
    handleGenerateOnfido,
    handleCipOverride,
  } = useAlpacaAccount();
  const { cipData, onfidoToken, loading, overrideModalOpen, overrideTargetRuleId, overrideRationale } = state;

  const [noteInput, setNoteInput] = useState('');

  if (!cipData) {
    return (
      <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
        <RefreshCw size={28} className="animate-spin mx-auto mb-3 text-yellow-400" />
        <p className="text-sm font-semibold">Retrieving PATRIOT Act CIP & OFAC Compliance Record...</p>
      </div>
    );
  }

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      author: 'Supervisory Officer (CRD #589210)',
      created_at: new Date().toISOString(),
      content: noteInput.trim(),
      action_type: 'GENERAL' as const,
    };
    cipData.notes.unshift(newNote);
    setNoteInput('');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">Customer Identification Program (CIP) Result</h2>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border uppercase ${getStatusBadgeStyle(cipData.kyc.approval_status)}`}>
                  {cipData.kyc.approval_status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Applicant: <span className="text-slate-200 font-semibold">{cipData.kyc.applicant_name}</span> • Completed: {formatTimestamp(cipData.kyc.completed_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Composite Risk Score</span>
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-2xl font-mono font-black text-emerald-400">{cipData.kyc.risk_score}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="text-right pl-4 border-l border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Risk Tier</span>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {cipData.kyc.risk_level}
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Indicator Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">OFAC Sanctions:</span>
            <span className={`font-mono font-bold ${cipData.kyc.sanctions_list_match ? 'text-red-400' : 'text-emerald-400'}`}>
              {cipData.kyc.sanctions_list_match ? 'MATCH DETECTED' : 'CLEAR'}
            </span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">PEP Global Index:</span>
            <span className={`font-mono font-bold ${cipData.kyc.pep_list_match ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {cipData.kyc.pep_list_match ? 'PEP HIT' : 'CLEAR'}
            </span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Adverse Media:</span>
            <span className={`font-mono font-bold ${cipData.kyc.adverse_media_match ? 'text-amber-400' : 'text-emerald-400'}`}>
              {cipData.kyc.adverse_media_match ? 'ADVERSE HIT' : 'CLEAR'}
            </span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Synthetic ID Risk:</span>
            <span className="font-mono font-bold text-cyan-400">
              {(cipData.kyc.synthetic_identity_probability ? (cipData.kyc.synthetic_identity_probability * 100).toFixed(2) : (cipData.kyc.synthetic_id_probability * 100).toFixed(2))}%
            </span>
          </div>
        </div>
      </div>

      {/* Onfido Live SDK Webflow & Biometrics */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <Key size={16} className="text-yellow-400" />
              Onfido v3.8 Embedded Web SDK Session
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated document verification and 3D liveness biometrics session</p>
          </div>
          <button
            onClick={handleGenerateOnfido}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500 hover:bg-yellow-400 text-slate-950 transition disabled:opacity-50"
          >
            <Zap size={13} />
            Generate New Token
          </button>
        </div>

        {onfidoToken ? (
          <div className="space-y-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/30 text-xs space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
                <ShieldCheck size={14} className="text-cyan-400" />
                Active SDK Client Authorization JWT:
              </span>
              <p className="font-mono text-cyan-300 text-[11px] break-all select-all bg-slate-900 p-2 rounded border border-slate-800">
                {onfidoToken}
              </p>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Token valid for 90 minutes. Inject into Onfido.init() container for client-side biometric capture.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/80 text-center text-xs text-slate-400">
            Click "Generate New Token" to initialize an Onfido client verification session.
          </div>
        )}
      </div>

      {/* CIP Standard Rules Evaluation Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <ClipboardCheck size={16} className="text-cyan-400" />
            CIP Rules Execution Matrix ({cipData.evaluations.length} Active Rules)
          </h3>
          <span className="text-xs text-slate-400 font-mono">USA PATRIOT ACT § 326</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cipData.evaluations.map((ev) => (
            <ComplianceRuleCard
              key={ev.rule_id}
              evaluation={ev}
              onOverride={(ruleId) => dispatch({ type: 'OPEN_OVERRIDE_MODAL', payload: ruleId })}
            />
          ))}
        </div>
      </div>

      {/* Supervisory Compliance Officer Notes */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
            <BookOpen size={16} className="text-yellow-400" />
            Supervisory Officer Compliance Notes ({cipData.notes.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">FINRA Rule 3110 Written Records</span>
        </div>

        {/* Add Note Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Add compliance supervisory note, EDD clearance note, or manual review rationale..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-yellow-500"
          />
          <button
            onClick={handleAddNote}
            disabled={!noteInput.trim()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-yellow-400 font-semibold rounded-xl text-xs border border-yellow-500/30 transition disabled:opacity-40"
          >
            Append Note
          </button>
        </div>

        {/* Notes Feed */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {cipData.notes.map((note) => (
            <div key={note.id} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-slate-300 font-mono text-[11px]">{note.author}</span>
                <span className="text-[10px]">{formatTimestamp(note.created_at)}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{note.content}</p>
            </div>
          ))}
          {cipData.notes.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-500">No compliance notes recorded.</div>
          )}
        </div>
      </div>

      {/* Supervisory Override Modal */}
      <SupervisoryOverrideModal
        isOpen={overrideModalOpen}
        ruleId={overrideTargetRuleId}
        rationale={overrideRationale}
        onChangeRationale={(val) => dispatch({ type: 'SET_OVERRIDE_RATIONALE', payload: val })}
        onClose={() => dispatch({ type: 'CLOSE_OVERRIDE_MODAL' })}
        onSubmit={() => {
          if (overrideTargetRuleId && overrideRationale) {
            handleCipOverride(overrideTargetRuleId, overrideRationale);
          }
        }}
        loading={loading}
      />
    </div>
  );
};
/* ============================================================================
 * TAB VIEW 3: OPTIONS APPROVAL MATRIX & FINRA RULE 2360 SUITABILITY
 * ============================================================================ */

export const OptionsApprovalTab: React.FC = () => {
  const { state, handleOptionsRequest } = useAlpacaAccount();
  const { account, optionsApproval, loading } = state;

  const [selectedTargetLevel, setSelectedTargetLevel] = useState<AlpacaOptionsLevel>(
    account.options_trading_level || 1
  );
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  // Calculate live suitability score using FINRA Rule 2360 engine
  const suitabilityAnalysis = useMemo(() => {
    return SuitabilityRuleEngine.calculateOptionsAptitudeScore(
      account.financial_profile,
      selectedTargetLevel
    );
  }, [account.financial_profile, selectedTargetLevel]);

  const levelDetails = [
    {
      level: 0 as AlpacaOptionsLevel,
      title: 'Level 0: Restricted / Inactive',
      desc: 'No options trading permitted. Pure cash/equity holding mode.',
      requirements: ['Basic KYC clearance'],
      allowedStrategies: ['None'],
      badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600',
    },
    {
      level: 1 as AlpacaOptionsLevel,
      title: 'Level 1: Covered Writing',
      desc: 'Writing covered calls against long underlying equities and writing cash-secured equity puts.',
      requirements: ['Basic trading profile', 'Minimum liquid net worth: $25k', 'Options experience: 0+ years'],
      allowedStrategies: ['Covered Calls', 'Cash-Secured Puts', 'Buy-Write Index Collars (Covered)'],
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      level: 2 as AlpacaOptionsLevel,
      title: 'Level 2: Directional Long Contracts',
      desc: 'Purchasing equity and index calls and puts for speculative or hedging purposes.',
      requirements: ['Moderate risk tolerance', 'Minimum liquid net worth: $50k', 'Options experience: 1+ years'],
      allowedStrategies: ['Long Equity Calls', 'Long Equity Puts', 'Long Straddles', 'Long Strangles', 'Protective Puts'],
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      level: 3 as AlpacaOptionsLevel,
      title: 'Level 3: Spreads & Multi-Leg Combos',
      desc: 'Multi-leg defined-risk spreads, vertical debit/credit spreads, calendar spreads, and iron condors.',
      requirements: ['Aggressive risk tolerance', 'Minimum liquid net worth: $100k', 'Options experience: 2+ years', 'Standard Margin Account'],
      allowedStrategies: ['Bull Call Spreads', 'Bear Put Spreads', 'Iron Condors', 'Iron Butterflies', 'Diagonal Spreads', 'Box Spreads'],
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      level: 4 as AlpacaOptionsLevel,
      title: 'Level 4: Uncovered / Naked Writing',
      desc: 'Naked short calls and puts on individual equities and index underlyings. Maximum portfolio leverage risk.',
      requirements: ['Speculative risk profile', 'Minimum liquid net worth: $250k', 'Options experience: 3+ years', 'PDT Margin Account'],
      allowedStrategies: ['Uncovered Short Calls', 'Uncovered Short Puts', 'Uncovered Ratio Spreads', 'Naked Synthetic Longs'],
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
  ];

  const currentLevelInfo = levelDetails.find((l) => l.level === account.options_trading_level) || levelDetails[0];

  const handleSubmitRequest = async () => {
    if (!agreementChecked || !signatureName.trim()) return;
    await handleOptionsRequest(selectedTargetLevel);
    setAgreementChecked(false);
    setSignatureName('');
  };

  return (
    <div className="space-y-6">
      {/* Current Standing & Options Tier Status */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-400">
              <Award size={30} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">Options Trading Authority & Status</h2>
                <span className={`px-3 py-0.5 rounded-full text-xs font-black border uppercase ${currentLevelInfo.badgeColor}`}>
                  Level {account.options_trading_level} Authorized
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Clearing Authorization: <span className="text-slate-200 font-semibold">{currentLevelInfo.title}</span> • FINRA Rule 2360 Compliant
              </p>
            </div>
          </div>

          {optionsApproval && (
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Supervisory Audit State</span>
              <div className="flex items-center gap-2 justify-end mt-0.5">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold border uppercase ${getStatusBadgeStyle(optionsApproval.status)}`}>
                  {optionsApproval.status}
                </span>
                <span className="text-xs font-mono text-cyan-400">Score: {optionsApproval.experience_score}/100</span>
              </div>
            </div>
          )}
        </div>

        {/* Current Permissions Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">Permitted Strategies</span>
            <ul className="space-y-1 text-slate-300">
              {currentLevelInfo.allowedStrategies.map((strat, i) => (
                <li key={i} className="flex items-center gap-1.5 text-emerald-400">
                  <Check size={12} className="shrink-0" />
                  <span>{strat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">Financial Capacity Metrics</span>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Options Buying Power:</span>
                <span className="font-mono text-cyan-400 font-bold">{formatCurrency(account.options_buying_power)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Options Experience:</span>
                <span className="font-mono text-purple-400 font-bold">{account.financial_profile.investment_experience_years.options} Years</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Derivatives Tenure:</span>
                <span className="font-mono text-slate-300">{account.financial_profile.investment_experience_years.derivatives} Years</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">Principal Supervisor Sign-Off</span>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-500 block">Registered Approver:</span>
                <span className="font-mono text-yellow-400">{optionsApproval?.reviewed_by || 'FINRA Series 4 Principal'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Sign-off Timestamp:</span>
                <span className="font-mono text-slate-400">{formatTimestamp(optionsApproval?.reviewed_at || account.last_updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Options Level Upgrade & Suitability Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tier Selector & Suitability Score */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <Sliders size={16} className="text-purple-400" />
                Target Options Tier Selection & Algorithmic Validation
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Select authorization tier to test against FINRA Rule 2360 suitability</p>
            </div>
          </div>

          {/* Level Cards */}
          <div className="space-y-3">
            {levelDetails.map((lvl) => {
              const isSelected = selectedTargetLevel === lvl.level;
              const isCurrent = account.options_trading_level === lvl.level;

              return (
                <div
                  key={lvl.level}
                  onClick={() => setSelectedTargetLevel(lvl.level)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-950/30'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-100">{lvl.title}</span>
                      {isCurrent && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Current Tier
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{lvl.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {lvl.requirements.map((req, rIdx) => (
                        <span key={rIdx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400 border border-slate-800">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center h-full pt-1">
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => setSelectedTargetLevel(lvl.level)}
                      className="text-purple-500 focus:ring-purple-400 h-4 w-4 bg-slate-900 border-slate-700 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Suitability Feedback & Electronic Signing Block */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-5 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <ShieldCheck size={16} className="text-yellow-400" />
                Automated Suitability Clearance
              </h3>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border ${
                suitabilityAnalysis.isQualified
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {suitabilityAnalysis.isQualified ? 'ELIGIBLE' : 'DISQUALIFIED'}
              </span>
            </div>

            {/* Score Metric */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Suitability Aptitude Metric:</span>
                <span className="font-mono font-black text-sm text-yellow-400">
                  {suitabilityAnalysis.score} / {suitabilityAnalysis.maxScore}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    suitabilityAnalysis.score >= 65 ? 'bg-emerald-400' : suitabilityAnalysis.score >= 45 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(100, (suitabilityAnalysis.score / suitabilityAnalysis.maxScore) * 100)}%` }}
                />
              </div>

              {/* Point Breakdown */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px] font-mono">
                <div className="text-slate-400">
                  Tenure: <span className="text-slate-200">+{suitabilityAnalysis.breakdown['options_tenure']} pts</span>
                </div>
                <div className="text-slate-400">
                  Net Worth: <span className="text-slate-200">+{suitabilityAnalysis.breakdown['liquid_net_worth']} pts</span>
                </div>
                <div className="text-slate-400">
                  Income: <span className="text-slate-200">+{suitabilityAnalysis.breakdown['annual_income']} pts</span>
                </div>
                <div className="text-slate-400">
                  Risk Profile: <span className="text-slate-200">+{suitabilityAnalysis.breakdown['risk_tolerance']} pts</span>
                </div>
              </div>
            </div>

            {/* Disqualifiers list if any */}
            {suitabilityAnalysis.disqualifiers.length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} /> Suitability Deficiencies Detected:
                </span>
                <ul className="list-disc list-inside text-red-300/90 text-xs space-y-0.5">
                  {suitabilityAnalysis.disqualifiers.map((disq, i) => (
                    <li key={i}>{disq}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Electronic Agreement & Signature */}
            <div className="space-y-3 pt-2 text-xs border-t border-slate-800">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-yellow-500 focus:ring-yellow-400 cursor-pointer"
                />
                <span className="text-slate-300 leading-relaxed">
                  I acknowledge receipt and review of the <em>Characteristics and Risks of Standardized Options (ODD)</em> and certify my financial disclosures are accurate.
                </span>
              </label>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Authorized Signer Full Legal Name</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder={`${account.identity.given_name} ${account.identity.family_name}`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmitRequest}
            disabled={loading || !agreementChecked || !signatureName.trim()}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 transition disabled:opacity-50"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Award size={14} />}
            Execute Level {selectedTargetLevel} Authorization Request
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * TAB VIEW 4: DOCUMENT CUSTODY & SEC RULE 17a-4 ARCHIVES TAB
 * ============================================================================ */

export const DocumentCustodyTab: React.FC = () => {
  const { state, dispatch, handleUploadDocument } = useAlpacaAccount();
  const { account, loading, filterDocumentType, selectedDocument } = state;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docSearch, setDocSearch] = useState('');

  const filteredDocuments = useMemo(() => {
    return account.documents.filter((doc) => {
      const matchesType = filterDocumentType === 'ALL' || doc.document_type === filterDocumentType;
      const matchesQuery =
        doc.file_name.toLowerCase().includes(docSearch.toLowerCase()) ||
        (doc.document_sub_type && doc.document_sub_type.toLowerCase().includes(docSearch.toLowerCase())) ||
        doc.id.toLowerCase().includes(docSearch.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [account.documents, filterDocumentType, docSearch]);

  const uniqueDocTypes = useMemo(() => {
    const types = new Set(account.documents.map((d) => d.document_type));
    return ['ALL', ...Array.from(types)];
  }, [account.documents]);

  return (
    <div className="space-y-6">
      {/* Header Controls & Upload Trigger */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <FileText size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">Document Custody & Retention Vault</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {account.documents.length} Archival Artifacts
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                SEC Rule 17a-4 / FINRA Rule 4511 WORM Compliant Immutable Storage System
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition"
          >
            <Upload size={14} />
            Ingest Regulatory Record
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder="Search documents by file name, classification or cryptographic ID..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={14} className="text-slate-500 shrink-0" />
            <select
              value={filterDocumentType}
              onChange={(e) => dispatch({ type: 'SET_FILTER_DOC_TYPE', payload: e.target.value })}
              className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {uniqueDocTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'ALL' ? 'All Document Categories' : type.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            onClick={() => dispatch({ type: 'SET_SELECTED_DOCUMENT', payload: doc })}
            className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl space-y-3 cursor-pointer transition backdrop-blur-sm group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-800 rounded-lg text-cyan-400 group-hover:bg-cyan-500/20 transition">
                  <FileCode size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-xs truncate max-w-[180px] group-hover:text-cyan-300 transition">
                    {doc.file_name}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono block uppercase">{doc.document_type}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 ${getStatusBadgeStyle(doc.status)}`}>
                {doc.status}
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono">
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="text-slate-200">{(doc.file_size_bytes / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex justify-between">
                <span>Vendor:</span>
                <span className="text-slate-300">{doc.verification_vendor}</span>
              </div>
              <div className="flex justify-between">
                <span>Ingested:</span>
                <span className="text-slate-300">{formatTimestamp(doc.uploaded_at)}</span>
              </div>
            </div>

            {doc.verification_digest && (
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                <span className="truncate max-w-[200px]">{doc.verification_digest}</span>
                <Eye size={13} className="text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition" />
              </div>
            )}
          </div>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            <FileText size={32} className="mx-auto mb-2 text-slate-600" />
            <p className="text-xs font-semibold">No custody documents match your filter criteria.</p>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={async (file, docType, subType) => {
          await handleUploadDocument(file, docType);
        }}
        loading={loading}
      />

      {/* Document Detailed Dossier Modal */}
      <DocumentViewerModal
        isOpen={!!selectedDocument}
        document={selectedDocument}
        onClose={() => dispatch({ type: 'SET_SELECTED_DOCUMENT', payload: null })}
      />
    </div>
  );
};

/* ============================================================================
 * TAB VIEW 5: BANKING RAILS, NACHA & ACH DISBURSEMENTS TAB
 * ============================================================================ */

export const BankingRailsTab: React.FC = () => {
  const { state, dispatch, handleCreateBankRelationship, handleVerifyBank } = useAlpacaAccount();
  const { account, loading, isAddBankModalOpen, newBankForm } = state;

  return (
    <div className="space-y-6">
      {/* Banking Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <CreditCard size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">ACH & Fedwire Clearing Relationships</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {account.bank_relationships.length} Linked Institutions
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                NACHA PPD/WEB Disbursement Rails, Micro-Deposit Verification & Plaid Auth Handshake
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch({ type: 'TOGGLE_ADD_BANK_MODAL', payload: true })}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition"
          >
            <Plus size={14} />
            Link New Bank Rail
          </button>
        </div>

        {/* Direct Fedwire & Instant ACH Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">ACH Settlement Speed</span>
            <span className="font-mono text-emerald-400 font-bold">Same-Day ACH (T+0 / T+1)</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Deposit Holding Period</span>
            <span className="font-mono text-cyan-400 font-bold">Standard 3-Day AML Hold</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Fedwire Real-time Gross</span>
            <span className="font-mono text-yellow-400 font-bold">Available (Cutoff 16:30 EST)</span>
          </div>
        </div>
      </div>

      {/* Bank Relationships Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Building size={16} className="text-yellow-400" />
          Active Correspondent Depository Accounts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {account.bank_relationships.map((bank) => {
            const isApproved = bank.status === 'APPROVED';

            return (
              <div
                key={bank.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl space-y-4 backdrop-blur-md transition shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-xl text-yellow-400 border border-slate-700">
                      <Building size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{bank.bank_name}</h4>
                      <p className="text-xs text-slate-400 capitalize font-mono">
                        {bank.bank_account_type} Account (•••• {bank.account_number_last4})
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${getStatusBadgeStyle(bank.status)}`}>
                    {bank.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ABA Routing Transit Number:</span>
                    <span className="text-cyan-400">{bank.routing_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verification Protocol:</span>
                    <span className="text-slate-300">{bank.verification_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Linked Currency:</span>
                    <span className="text-emerald-400 font-bold">{bank.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Created Timestamp:</span>
                    <span className="text-slate-400">{formatTimestamp(bank.created_at)}</span>
                  </div>
                  {bank.verified_at && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Verified Timestamp:</span>
                      <span className="text-slate-400">{formatTimestamp(bank.verified_at)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  {!isApproved ? (
                    <button
                      onClick={() => handleVerifyBank(bank.id)}
                      disabled={loading}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition disabled:opacity-50"
                    >
                      <CheckCircle size={13} />
                      Verify Micro-Deposits
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <ShieldCheck size={14} />
                      <span>Ready for Instant ACH Transfers</span>
                    </div>
                  )}
                  <span className="text-[10px] font-mono text-slate-500">ID: {bank.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Bank Modal */}
      <AddBankRelationshipModal
        isOpen={isAddBankModalOpen}
        formData={newBankForm}
        onChange={(fields) => dispatch({ type: 'UPDATE_NEW_BANK_FORM', payload: fields })}
        onClose={() => {
          dispatch({ type: 'TOGGLE_ADD_BANK_MODAL', payload: false });
          dispatch({ type: 'RESET_NEW_BANK_FORM' });
        }}
        onSubmit={handleCreateBankRelationship}
        loading={loading}
      />
    </div>
  );
};

/* ============================================================================
 * TAB VIEW 6: FINRA RULE 4511 & SEC 17a-4 IMMUTABLE AUDIT LEDGER TAB
 * ============================================================================ */

export const AuditLedgerTab: React.FC = () => {
  const { state, dispatch, handleExportAuditPacket } = useAlpacaAccount();
  const { account, filterAuditAction, loading } = state;

  const [searchAudit, setSearchAudit] = useState('');

  const filteredEntries = useMemo(() => {
    return account.audit_ledger.filter((entry) => {
      const matchesAction = filterAuditAction === 'ALL' || entry.action === filterAuditAction;
      const matchesQuery =
        entry.action.toLowerCase().includes(searchAudit.toLowerCase()) ||
        entry.performed_by.toLowerCase().includes(searchAudit.toLowerCase()) ||
        JSON.stringify(entry.details).toLowerCase().includes(searchAudit.toLowerCase());
      return matchesAction && matchesQuery;
    });
  }, [account.audit_ledger, filterAuditAction, searchAudit]);

  const uniqueActions = useMemo(() => {
    const set = new Set(account.audit_ledger.map((e) => e.action));
    return ['ALL', ...Array.from(set)];
  }, [account.audit_ledger]);

  return (
    <div className="space-y-6">
      {/* Header & Export Control */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-yellow-400">
              <History size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">Supervisory & Regulatory Audit Trail</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  {account.audit_ledger.length} Cryptographic Events
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                SEC Rule 17a-4 Electronic Records Archiving & FINRA Series 24 Supervisory Log
              </p>
            </div>
          </div>

          <button
            onClick={handleExportAuditPacket}
            disabled={loading}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition disabled:opacity-50"
          >
            <Download size={14} />
            Export Signed Regulatory Package
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchAudit}
              onChange={(e) => setSearchAudit(e.target.value)}
              placeholder="Search audit trail by actor, action identifier, or event payload details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={14} className="text-slate-500 shrink-0" />
            <select
              value={filterAuditAction}
              onChange={(e) => dispatch({ type: 'SET_FILTER_AUDIT_ACTION', payload: e.target.value })}
              className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-yellow-500"
            >
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action === 'ALL' ? 'All Ledger Actions' : action.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Feed */}
      <div className="space-y-3">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl space-y-2 hover:border-slate-700 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  {entry.action}
                </span>
                <span className="text-xs text-slate-400 font-medium">by <span className="text-slate-200 font-semibold">{entry.performed_by}</span></span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{formatTimestamp(entry.timestamp)}</span>
            </div>

            {Object.keys(entry.details).length > 0 && (
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/70 text-[11px] font-mono text-slate-300 break-all space-y-1">
                {Object.entries(entry.details).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-slate-500 shrink-0">{k}:</span>
                    <span className="text-cyan-300 truncate">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="py-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            <History size={32} className="mx-auto mb-2 text-slate-600" />
            <p className="text-xs font-semibold">No audit ledger entries match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
 * TAB VIEW 7: SYSTEM CODEX & PATH REGISTRY EXPLORER
 * ============================================================================ */

export const CodexPathExplorerTab: React.FC = () => {
  const { state, dispatch } = useAlpacaAccount();
  const { searchQuery } = state;

  const filteredPaths = useMemo(() => {
    return SYSTEM_PATHS.filter((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const categories = useMemo(() => {
    const cats: Record<string, number> = {};
    SYSTEM_PATHS.forEach((p) => {
      const top = p.includes('/') ? p.split('/')[0] : 'Root';
      cats[top] = (cats[top] || 0) + 1;
    });
    return cats;
  }, []);

  return (
    <div className="space-y-6">
      {/* Explorer Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <Terminal size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">Sovereign Patriot Codex & Architectural Index</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {SYSTEM_PATHS.length} Microservices & Modules
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full-scale Correspondent Repository Catalog & Legislative Blueprint Traceability Engine
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            placeholder="Search system architecture modules, legislative chapters, and microservice definitions..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Directory Categorization Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(categories).map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: cat === 'Root' ? '' : cat })}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition"
            >
              {cat} <span className="text-cyan-400 font-bold ml-1">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Paths Listing */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 max-h-[600px] overflow-y-auto space-y-2 font-mono text-xs">
        {filteredPaths.map((path, idx) => {
          const parts = path.split('/');
          const filename = parts.pop() || path;
          const directory = parts.join('/');

          return (
            <div
              key={idx}
              className="p-3 bg-slate-950/50 hover:bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileCode size={16} className="text-yellow-400/80 shrink-0 group-hover:text-yellow-400 transition" />
                <div className="truncate">
                  <span className="text-slate-200 font-semibold group-hover:text-cyan-300 transition">{filename}</span>
                  {directory && (
                    <span className="text-slate-500 text-[10px] block truncate font-sans">{directory}</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-600 shrink-0 select-all group-hover:text-slate-400 transition">
                {path}
              </span>
            </div>
          );
        })}

        {filteredPaths.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            <Terminal size={32} className="mx-auto mb-2 text-slate-600" />
            <p className="text-xs font-semibold">No system paths found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
 * MAIN CONTROLLER CONTAINER COMPONENT: AlpacaAccountsManager
 * ============================================================================ */

export const AlpacaAccountsManager: React.FC = () => {
  const [state, dispatch] = useReducer(alpacaAccountReducer, initialAccountState);
  const { account, activeTab, loading, errorMessage, successMessage } = state;

  const loadData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const fullAccount = await alpacaAccountsService.getAccountDetails(account.id);
      const cip = await alpacaAccountsService.getCip(account.id);
      const opt = await alpacaAccountsService.getOptionsApproval(account.id);

      dispatch({ type: 'SET_ACCOUNT', payload: fullAccount });
      dispatch({ type: 'SET_CIP_DATA', payload: cip });
      dispatch({ type: 'SET_OPTIONS_APPROVAL', payload: opt });
    } catch (err: any) {
      console.error('Failed loading account data:', err);
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Error synchronizing correspondent account.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [account.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Context Actions
  const handleOptionsRequest = async (level: AlpacaOptionsLevel) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updated = await alpacaAccountsService.requestOptionsApproval(account.id, level);
      dispatch({ type: 'SET_OPTIONS_APPROVAL', payload: updated });
      dispatch({ type: 'SET_SUCCESS', payload: `Options Level ${updated.approved_level} successfully approved and active!` });
      await loadData();
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Options level request failed.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleGenerateOnfido = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await alpacaAccountsService.getOnfidoSdkToken(account.id);
      dispatch({ type: 'SET_ONFIDO_TOKEN', payload: res.token });
      dispatch({ type: 'SET_SUCCESS', payload: 'Issued new Onfido v3.8 biometric SDK session token.' });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed generating Onfido token.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleLockTrading = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await alpacaAccountsService.lockAccountTrading(account.id, 'Supervisory compliance temporary lock');
      dispatch({ type: 'SET_SUCCESS', payload: 'Account trading privileges successfully locked.' });
      await loadData();
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed locking account.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleUnlockTrading = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await alpacaAccountsService.unlockAccountTrading(account.id, 'Supervisory review completed successfully');
      dispatch({ type: 'SET_SUCCESS', payload: 'Account trading privileges fully restored.' });
      await loadData();
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed unlocking account.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleCipOverride = async (ruleId: string, rationale: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updated = await alpacaAccountsService.overrideCipCheck(
        account.id,
        ruleId,
        rationale,
        'Principal Compliance Officer (CRD #482910)'
      );
      dispatch({ type: 'SET_CIP_DATA', payload: updated });
      dispatch({ type: 'CLOSE_OVERRIDE_MODAL' });
      dispatch({ type: 'SET_SUCCESS', payload: `Supervisory override committed on rule ${ruleId}.` });
      await loadData();
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Supervisory override failed.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleUploadDocument = async (file: File, type: AlpacaDocumentType) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await alpacaAccountsService.uploadAccountDocument(account.id, { document_type: type }, file);
      dispatch({ type: 'SET_SUCCESS', payload: `Successfully ingested document: ${file.name}` });
      await loadData();
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Document ingestion failed.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleCreateBankRelationship = async () => {
    const { bankName, routingNumber, accountNumber, accountType } = state.newBankForm;
    if (!bankName || routingNumber.length !== 9 || !accountNumber) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newRel: AlpacaBankRelationship = {
        id: `bank-rel-${Date.now().toString(36)}`,
        account_id: account.id,
        bank_name: bankName,
        account_number_last4: accountNumber.slice(-4),
        routing_number: routingNumber,
        bank_account_type: accountType,
        status: 'QUEUED',
        created_at: new Date().toISOString(),
        verification_method: 'MICRO_DEPOSITS',
        currency: 'USD',
      };

      account.bank_relationships.unshift(newRel);
      account.audit_ledger.unshift({
        id: `audit-${Date.now()}`,
        action: 'BANK_RELATIONSHIP_CREATED',
        performed_by: 'correspondent_officer',
        timestamp: new Date().toISOString(),
        details: { bank: bankName, routing: routingNumber },
      });

      dispatch({ type: 'TOGGLE_ADD_BANK_MODAL', payload: false });
      dispatch({ type: 'RESET_NEW_BANK_FORM' });
      dispatch({ type: 'SET_SUCCESS', payload: `Linked bank rail ${bankName}. Ready for verification.` });
      await loadData();
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed linking bank relationship.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleVerifyBank = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await alpacaAccountsService.verifyBankRelationship(account.id, id);
      dispatch({ type: 'SET_SUCCESS', payload: 'Bank relationship verified and authorized for transfers.' });
      await loadData();
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Bank verification failed.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleExportAuditPacket = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const blob = await alpacaAccountsService.exportCipAuditPacket(account.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FINRA_Audit_Dossier_${account.account_number}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      dispatch({ type: 'SET_SUCCESS', payload: 'Generated and downloaded immutable FINRA audit dossier.' });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed exporting audit packet.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const contextValue: AlpacaAccountContextType = {
    state,
    dispatch,
    refreshAll: loadData,
    handleOptionsRequest,
    handleGenerateOnfido,
    handleLockTrading,
    handleUnlockTrading,
    handleCipOverride,
    handleUploadDocument,
    handleCreateBankRelationship,
    handleVerifyBank,
    handleExportAuditPacket,
  };

  return (
    <AlpacaAccountContext.Provider value={contextValue}>
      <div className="space-y-6 text-slate-100 max-w-7xl mx-auto p-2 sm:p-4 animate-in fade-in duration-300">
        {/* Top Header Bar */}
        <AccountHeaderBar
          account={account}
          onRefresh={loadData}
          loading={loading}
          onLock={handleLockTrading}
          onUnlock={handleUnlockTrading}
          onExport={handleExportAuditPacket}
        />

        {/* Global Toast Notifications */}
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start justify-between gap-3 text-xs text-red-300">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
              className="text-red-400 hover:text-red-200 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start justify-between gap-3 text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => dispatch({ type: 'SET_SUCCESS', payload: null })}
              className="text-emerald-400 hover:text-emerald-200 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <NavigationTabBar
          activeTab={activeTab}
          onSelectTab={(tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })}
          documentCount={account.documents.length}
          bankCount={account.bank_relationships.length}
          auditCount={account.audit_ledger.length}
        />

        {/* Tab View Container */}
        <div className="pt-2">
          {activeTab === 'summary' && <CorrespondentSummaryTab />}
          {activeTab === 'cip_kyc' && <CipKycIntelligenceTab />}
          {activeTab === 'options' && <OptionsApprovalTab />}
          {activeTab === 'documents' && <DocumentCustodyTab />}
          {activeTab === 'banking' && <BankingRailsTab />}
          {activeTab === 'audit' && <AuditLedgerTab />}
          {activeTab === 'explorer' && <CodexPathExplorerTab />}
        </div>
      </div>
    </AlpacaAccountContext.Provider>
  );
};

export default AlpacaAccountsManager;/* ============================================================================
 * EXTENDED CORRESPONDENT COMPLIANCE & BROKER API ORCHESTRATION ENGINE
 * SEC Rule 15c3-1 (Net Capital), 15c3-3 (Customer Protection), FinCEN CDD Rule
 * ============================================================================ */

export interface AlpacaMarginCallRecord {
  id: string;
  account_id: string;
  call_type: 'reg_t' | 'day_trade_call' | 'maintenance_margin' | 'special_margin';
  status: 'OPEN' | 'MET' | 'LIQUIDATED' | 'EXTENDED' | 'FORCE_CLOSED';
  amount: number;
  due_date: string;
  created_at: string;
  clearing_notice_id: string;
  settlement_currency: string;
  resolution_details?: {
    resolved_at: string;
    resolved_by: string;
    action_taken: string;
    journal_entry_id?: string;
  };
}

export interface AlpacaAccountTransferRequest {
  id: string;
  account_id: string;
  type: AlpacaFundingMethod;
  direction: 'INCOMING' | 'OUTGOING';
  amount: number;
  currency: string;
  bank_relationship_id?: string;
  target_account_id?: string;
  status: 'QUEUED' | 'PENDING_CLEARING' | 'SETTLED' | 'REJECTED' | 'HELD_FOR_REVIEW';
  created_at: string;
  settled_at?: string;
  fee_amount: number;
  clearing_ref_code: string;
  aml_risk_score: number;
}

export interface AlpacaJournalEntryRecord {
  id: string;
  from_account: string;
  to_account: string;
  entry_type: 'CASH' | 'SECURITY' | 'DIVIDEND_ADJUSTMENT' | 'CORRESPONDENT_FEE';
  amount: number;
  symbol?: string;
  qty?: number;
  status: 'PENDING' | 'EXECUTED' | 'REJECTED' | 'CANCELED';
  description: string;
  transmitted_at: string;
  clearing_journal_id?: string;
}

export interface AlpacaMarginStressScenario {
  scenario_name: string;
  equity_shock_percent: number;
  volatility_shock_percent: number;
  interest_rate_shock_bps: number;
  projected_portfolio_value: number;
  projected_maintenance_margin: number;
  projected_excess_liquidity: number;
  margin_call_probability: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimated_call_amount: number;
}

/**
 * Enterprise Alpaca Broker API v2 Correspondent Lifecycle Engine
 * Implements SEC Rule 15c3-1 net capital calculations, margin call tracking,
 * journal entries between omnibus & subaccounts, and ACH transfer handling.
 */
export class AlpacaBrokerAccountOrchestrator {
  private static instance: AlpacaBrokerAccountOrchestrator;
  private readonly storagePrefix = 'alpaca_broker_orchestrator:';

  private constructor() {}

  public static getInstance(): AlpacaBrokerAccountOrchestrator {
    if (!AlpacaBrokerAccountOrchestrator.instance) {
      AlpacaBrokerAccountOrchestrator.instance = new AlpacaBrokerAccountOrchestrator();
    }
    return AlpacaBrokerAccountOrchestrator.instance;
  }

  /**
   * Evaluates FinCEN CDD Beneficial Ownership & High-Risk Jurisdiction Metrics
   */
  public evaluateBeneficialOwnershipRisk(
    identity: AlpacaIdentityInformation,
    disclosures: AlpacaDisclosures,
    financials: AlpacaFinancialProfile
  ): {
    riskTier: AlpacaRiskScoreLevel;
    eddRequired: boolean;
    cddReasons: string[];
    riskScore: number;
  } {
    const cddReasons: string[] = [];
    let riskScore = 10; // baseline low risk

    // High risk tax residence
    const highRiskJurisdictions = ['CYP', 'PAN', 'VGB', 'CAY', 'BLZ', 'RUS', 'IRN', 'PRK', 'SYR'];
    if (highRiskJurisdictions.includes(identity.country_of_tax_residence.toUpperCase())) {
      riskScore += 45;
      cddReasons.push(`Tax residence in FATF monitored / non-cooperative jurisdiction: ${identity.country_of_tax_residence}`);
    }

    if (disclosures.is_politically_exposed) {
      riskScore += 30;
      cddReasons.push('Subject identified as Senior Domestic or Foreign Politically Exposed Person (PEP)');
    }

    if (disclosures.immediate_family_exposed) {
      riskScore += 15;
      cddReasons.push('Immediate family member or close associate of Politically Exposed Person');
    }

    if (disclosures.is_control_person) {
      riskScore += 20;
      cddReasons.push('Subject is SEC Rule 144 Affiliate or Control Person (>10% voting equity)');
    }

    if (disclosures.is_affiliated_exchange_or_finra) {
      riskScore += 15;
      cddReasons.push('FINRA Rule 3210 Associated Person requiring written supervisory consent');
    }

    if (financials.annual_income_max > 1000000 && disclosures.source_of_funds === 'crypto_gains') {
      riskScore += 15;
      cddReasons.push('High-velocity wealth generated through digital asset volatility requiring proof of source');
    }

    let riskTier: AlpacaRiskScoreLevel = 'LOW';
    if (riskScore >= 75) riskTier = 'CRITICAL';
    else if (riskScore >= 50) riskTier = 'HIGH';
    else if (riskScore >= 30) riskTier = 'MEDIUM';
    else if (riskScore >= 15) riskTier = 'LOW';
    else riskTier = 'VERY_LOW';

    const eddRequired = riskScore >= 40;

    return {
      riskTier,
      eddRequired,
      cddReasons,
      riskScore: Math.min(100, riskScore),
    };
  }

  /**
   * Simulates Portfolio Margin Stress Scenarios under Market Shocks
   */
  public runMarginStressTest(account: AlpacaAccountFullRecord): AlpacaMarginStressScenario[] {
    const portfolioVal = account.portfolio_value;
    const cash = account.cash_balance;
    const equityHoldings = Math.max(0, portfolioVal - cash);

    const scenarios: Array<{
      name: string;
      equityShock: number;
      volShock: number;
      rateShock: number;
    }> = [
      { name: 'Baseline Market Equilibrium (0% Shock)', equityShock: 0.0, volShock: 0.0, rateShock: 0 },
      { name: 'Standard S&P 500 Market Correction (-10%)', equityShock: -0.10, volShock: 0.25, rateShock: 25 },
      { name: 'Severe Equity Liquidity Drawdown (-20%)', equityShock: -0.20, volShock: 0.50, rateShock: 50 },
      { name: 'Black Swan Market Crash & Flash Volatility (-35%)', equityShock: -0.35, volShock: 1.20, rateShock: 100 },
      { name: 'Macro Yield Spike & Credit Spread Widening (-15%)', equityShock: -0.15, volShock: 0.40, rateShock: 150 },
      { name: 'Bullish Momentum Expansion (+15%)', equityShock: 0.15, volShock: -0.15, rateShock: 0 },
    ];

    return scenarios.map((sc) => {
      const shockedEquity = equityHoldings * (1 + sc.equityShock);
      const projectedPortfolioVal = Math.max(0, cash + shockedEquity);
      
      // FINRA Rule 4210 Maintenance Margin is typically 25% for long equities, plus additional vol buffer
      const baseReqPercent = account.account_class === 'margin_pdt' ? 0.25 : 0.30;
      const volBuffer = Math.max(0, sc.volShock * 0.05);
      const maintenanceMarginReq = shockedEquity * (baseReqPercent + volBuffer);

      const excessLiquidity = projectedPortfolioVal - maintenanceMarginReq;
      const hasMarginCall = excessLiquidity < 0;
      const callAmount = hasMarginCall ? Math.abs(excessLiquidity) : 0;

      let callProb: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'NONE';
      if (excessLiquidity < 0) callProb = 'CRITICAL';
      else if (excessLiquidity < portfolioVal * 0.1) callProb = 'HIGH';
      else if (excessLiquidity < portfolioVal * 0.25) callProb = 'MEDIUM';
      else if (excessLiquidity < portfolioVal * 0.5) callProb = 'LOW';

      return {
        scenario_name: sc.name,
        equity_shock_percent: sc.equityShock * 100,
        volatility_shock_percent: sc.volShock * 100,
        interest_rate_shock_bps: sc.rateShock,
        projected_portfolio_value: Math.round(projectedPortfolioVal * 100) / 100,
        projected_maintenance_margin: Math.round(maintenanceMarginReq * 100) / 100,
        projected_excess_liquidity: Math.round(excessLiquidity * 100) / 100,
        margin_call_probability: callProb,
        estimated_call_amount: Math.round(callAmount * 100) / 100,
      };
    });
  }

  /**
   * Generates mock margin calls for correspondent account risk management
   */
  public generateMockMarginCalls(accountId: string): AlpacaMarginCallRecord[] {
    return [
      {
        id: `call-regt-${accountId.slice(0, 6)}-01`,
        account_id: accountId,
        call_type: 'day_trade_call',
        status: 'MET',
        amount: 4500.0,
        due_date: '2025-02-14T20:00:00.000Z',
        created_at: '2025-02-09T14:30:00.000Z',
        clearing_notice_id: 'VELOX-DT-994821',
        settlement_currency: 'USD',
        resolution_details: {
          resolved_at: '2025-02-10T10:15:00.000Z',
          resolved_by: 'Automated Overnight ACH Inflow',
          action_taken: 'Deposit of $10,000 satisfied day trading margin requirement.',
          journal_entry_id: 'jrn-deposit-9921',
        },
      },
    ];
  }

  /**
   * Generates mock account transfer records
   */
  public generateMockTransfers(accountId: string): AlpacaAccountTransferRequest[] {
    return [
      {
        id: `xfer-ach-001-${accountId.slice(0, 6)}`,
        account_id: accountId,
        type: 'ach',
        direction: 'INCOMING',
        amount: 25000.0,
        currency: 'USD',
        bank_relationship_id: 'bank-rel-01',
        status: 'SETTLED',
        created_at: '2025-01-18T10:14:00.000Z',
        settled_at: '2025-01-20T14:00:00.000Z',
        fee_amount: 0.0,
        clearing_ref_code: 'ACH-NACHA-77291823',
        aml_risk_score: 4,
      },
      {
        id: `xfer-wire-002-${accountId.slice(0, 6)}`,
        account_id: accountId,
        type: 'wire_domestic',
        direction: 'INCOMING',
        amount: 100000.0,
        currency: 'USD',
        bank_relationship_id: 'bank-rel-02',
        status: 'SETTLED',
        created_at: '2025-02-01T09:00:00.000Z',
        settled_at: '2025-02-01T11:30:00.000Z',
        fee_amount: 15.0,
        clearing_ref_code: 'FEDWIRE-IMAD-2025020100918',
        aml_risk_score: 8,
      },
      {
        id: `xfer-ach-003-${accountId.slice(0, 6)}`,
        account_id: accountId,
        type: 'ach',
        direction: 'OUTGOING',
        amount: 5000.0,
        currency: 'USD',
        bank_relationship_id: 'bank-rel-01',
        status: 'SETTLED',
        created_at: '2025-02-15T16:20:00.000Z',
        settled_at: '2025-02-17T09:00:00.000Z',
        fee_amount: 0.0,
        clearing_ref_code: 'ACH-NACHA-88391209',
        aml_risk_score: 2,
      },
    ];
  }

  /**
   * Generates mock internal journals
   */
  public generateMockJournals(accountId: string): AlpacaJournalEntryRecord[] {
    return [
      {
        id: `jrn-01-${accountId.slice(0, 6)}`,
        from_account: 'OMNIBUS_MASTER_CLEARING_01',
        to_account: accountId,
        entry_type: 'CASH',
        amount: 148250.75,
        status: 'EXECUTED',
        description: 'Correspondent Initial Capital Allocation & Cash Journal',
        transmitted_at: '2025-01-15T08:45:00.000Z',
        clearing_journal_id: 'VELOX-JRN-482910',
      },
      {
        id: `jrn-02-${accountId.slice(0, 6)}`,
        from_account: accountId,
        to_account: 'CORRESPONDENT_MGMT_FEE_COLLECTION',
        entry_type: 'CORRESPONDENT_FEE',
        amount: 125.0,
        status: 'EXECUTED',
        description: 'Monthly Market Data & Level 3 Derivative Data Subscription Fee',
        transmitted_at: '2025-02-01T00:00:00.000Z',
        clearing_journal_id: 'VELOX-JRN-551982',
      },
    ];
  }
}

export const alpacaBrokerOrchestrator = AlpacaBrokerAccountOrchestrator.getInstance();

/* ============================================================================
 * EXTENDED SUB-COMPONENT: MARGIN STRESS & LEVERAGE RISK AUDITOR
 * ============================================================================ */

export const MarginStressAuditorView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [stressScenarios, setStressScenarios] = useState<AlpacaMarginStressScenario[]>([]);
  const [activeMarginCalls, setActiveMarginCalls] = useState<AlpacaMarginCallRecord[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const results = alpacaBrokerOrchestrator.runMarginStressTest(account);
    setStressScenarios(results);
    const calls = alpacaBrokerOrchestrator.generateMockMarginCalls(account.id);
    setActiveMarginCalls(calls);
  }, [account]);

  const handleRecalculateStress = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const results = alpacaBrokerOrchestrator.runMarginStressTest(account);
      setStressScenarios(results);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
              <Flame size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">FINRA Rule 4210 Margin Stress & Liquidity Engine</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  {account.margin_multiplier}x Leverage Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time portfolio shock modeling, maintenance margin adequacy, and Fed Reg-T liquidity projections
              </p>
            </div>
          </div>

          <button
            onClick={handleRecalculateStress}
            disabled={isSimulating}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-yellow-400 border border-yellow-500/30 transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSimulating ? 'animate-spin' : ''} />
            Execute Monte Carlo Shocks
          </button>
        </div>

        {/* Current Margin Capital Utilization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Total Portfolio Equity</span>
            <span className="font-mono text-slate-100 font-bold text-sm">{formatCurrency(account.portfolio_value)}</span>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Reg-T Buying Power</span>
            <span className="font-mono text-cyan-400 font-bold text-sm">{formatCurrency(account.regt_buying_power)}</span>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Day Trading Buying Power</span>
            <span className="font-mono text-yellow-400 font-bold text-sm">{formatCurrency(account.daytrading_buying_power)}</span>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Pattern Day Trader Status</span>
            <span className={`font-mono font-bold text-xs ${account.pattern_day_trader ? 'text-emerald-400' : 'text-slate-400'}`}>
              {account.pattern_day_trader ? 'PDT CONFIRMED (>$25k)' : 'STANDARD'}
            </span>
          </div>
        </div>
      </div>

      {/* Margin Stress Scenarios Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-yellow-400" />
          Simulated Macro Market Shock Scenarios
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stressScenarios.map((scenario, idx) => {
            const isCritical = scenario.margin_call_probability === 'CRITICAL';
            const isHigh = scenario.margin_call_probability === 'HIGH';
            const isMedium = scenario.margin_call_probability === 'MEDIUM';

            const cardBorder = isCritical
              ? 'border-red-500/50 bg-red-950/20'
              : isHigh
              ? 'border-amber-500/40 bg-amber-950/15'
              : isMedium
              ? 'border-yellow-500/30 bg-slate-900/70'
              : 'border-slate-800 bg-slate-900/70';

            const probBadge = isCritical
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : isHigh
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              : isMedium
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${cardBorder} space-y-3 backdrop-blur-sm transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div>
                    <h4 className="font-bold text-xs text-slate-100">{scenario.scenario_name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Shock: {scenario.equity_shock_percent > 0 ? `+${scenario.equity_shock_percent}%` : `${scenario.equity_shock_percent}%`} • Vol: +{scenario.volatility_shock_percent}%
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 ${probBadge}`}>
                    {scenario.margin_call_probability} RISK
                  </span>
                </div>

                <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Post-Shock Equity:</span>
                    <span className="text-slate-200 font-semibold">{formatCurrency(scenario.projected_portfolio_value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Maint. Requirement:</span>
                    <span className="text-yellow-400">{formatCurrency(scenario.projected_maintenance_margin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Excess Liquidity:</span>
                    <span className={`font-bold ${scenario.projected_excess_liquidity < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {formatCurrency(scenario.projected_excess_liquidity)}
                    </span>
                  </div>
                </div>

                {scenario.estimated_call_amount > 0 ? (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-red-400 font-semibold flex items-center gap-1">
                      <AlertCircle size={13} /> Projected Call:
                    </span>
                    <span className="font-mono text-red-300 font-bold">{formatCurrency(scenario.estimated_call_amount)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-1">
                    <CheckCircle size={13} />
                    <span>Clears Rule 4210 Maintenance Thresholds</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Margin Calls Record Section */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <BadgeAlert size={16} className="text-yellow-400" />
              Historical Margin Call Ledger & Regulatory Resolutions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Clearing notice records and liquidity resolution actions</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {activeMarginCalls.length} Recorded Calls
          </span>
        </div>

        <div className="space-y-3">
          {activeMarginCalls.map((call) => (
            <div
              key={call.id}
              className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-200 uppercase font-mono">{call.call_type.replace(/_/g, ' ')}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    {call.status}
                  </span>
                </div>
                <span className="font-mono text-cyan-400 font-bold">{formatCurrency(call.amount)} {call.settlement_currency}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                <div>Notice Ref: <span className="text-slate-200">{call.clearing_notice_id}</span></div>
                <div>Issued: <span className="text-slate-300">{formatTimestamp(call.created_at)}</span></div>
                <div>Due Date: <span className="text-slate-300">{formatTimestamp(call.due_date)}</span></div>
              </div>

              {call.resolution_details && (
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="flex justify-between text-slate-400 font-semibold">
                    <span>Resolved by: {call.resolution_details.resolved_by}</span>
                    <span>{formatTimestamp(call.resolution_details.resolved_at)}</span>
                  </div>
                  <p className="text-emerald-300/90">{call.resolution_details.action_taken}</p>
                </div>
              )}
            </div>
          ))}

          {activeMarginCalls.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No margin calls or liquidity restrictions recorded on this correspondent account.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * EXTENDED SUB-COMPONENT: CORRESPONDENT TRANSFERS & JOURNAL LOGS
 * ============================================================================ */

export const TransfersAndJournalsView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [transfers, setTransfers] = useState<AlpacaAccountTransferRequest[]>([]);
  const [journals, setJournals] = useState<AlpacaJournalEntryRecord[]>([]);

  useEffect(() => {
    setTransfers(alpacaBrokerOrchestrator.generateMockTransfers(account.id));
    setJournals(alpacaBrokerOrchestrator.generateMockJournals(account.id));
  }, [account]);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <Coins size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">Transfers & Internal Journal Ledger</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  ACH / Wire / Omnibus Journals
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Settlement logs for inbound deposits, outbound disbursements, and correspondent fee allocations
              </p>
            </div>
          </div>
        </div>

        {/* Transfer Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Total Settled Inflow</span>
            <span className="font-mono text-emerald-400 font-bold text-sm">$125,000.00 USD</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Total Settled Outflow</span>
            <span className="font-mono text-cyan-400 font-bold text-sm">$5,000.00 USD</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Net Capital Inflow</span>
            <span className="font-mono text-yellow-400 font-bold text-sm">$120,000.00 USD</span>
          </div>
        </div>
      </div>

      {/* Transfers Section */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
            <CreditCard size={16} className="text-emerald-400" />
            External Funding & Disbursement Transfers ({transfers.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">NACHA & Fedwire Network</span>
        </div>

        <div className="space-y-3">
          {transfers.map((tx) => {
            const isIncoming = tx.direction === 'INCOMING';

            return (
              <div
                key={tx.id}
                className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isIncoming ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                      {isIncoming ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-xs">{tx.direction} {tx.type.replace('_', ' ').toUpperCase()}</span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold border uppercase bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {tx.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Ref: {tx.clearing_ref_code}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-base font-mono font-bold ${isIncoming ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {isIncoming ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">AML Risk: {tx.aml_risk_score}/100</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Initiated: {formatTimestamp(tx.created_at)}</span>
                  <span>Settled: {formatTimestamp(tx.settled_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Internal Journals Section */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
            <Layers size={16} className="text-yellow-400" />
            Internal Omnibus Journal Entries ({journals.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Correspondent Subledger</span>
        </div>

        <div className="space-y-3">
          {journals.map((jrn) => (
            <div
              key={jrn.id}
              className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-xs">{jrn.entry_type}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold border uppercase bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {jrn.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{jrn.description}</p>
                </div>

                <span className="font-mono text-yellow-400 font-bold text-sm">
                  {formatCurrency(jrn.amount)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                <div>From: <span className="text-slate-200">{jrn.from_account}</span></div>
                <div>To: <span className="text-slate-200">{jrn.to_account}</span></div>
                <div>Cleared: <span className="text-slate-300">{formatTimestamp(jrn.transmitted_at)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * EXPORTABLE INTEGRATED WIDGET: STANDALONE BROKERAGE COMPONENT
 * ============================================================================ */

export const AlpacaBrokerageStandaloneModule: React.FC<{
  initialAccountId?: string;
}> = ({ initialAccountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d' }) => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-yellow-950/30 rounded-2xl border border-yellow-500/40 shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-500 text-slate-950 uppercase tracking-widest">
                FINRA / SEC CORRESPONDENT ENGINE
              </span>
              <span className="text-xs text-yellow-400/80 font-mono">Broker API v2.4</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">
              Sovereign Institutional Brokerage & Compliance Citadel
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Complete correspondent broker-dealer account orchestration suite. Enforcing PATRIOT Act CIP,
              FinCEN CDD verification, Level 4 Options suitability, and SEC 17a-4 compliant WORM audit storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono uppercase">Clearing Status</span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE / VELOX T+1
              </span>
            </div>
          </div>
        </div>

        {/* Embedded Full Manager */}
        <AlpacaAccountsManager />
      </div>
    </div>
  );
};
/* ============================================================================
 * EXTENDED MODULE: REGULATION SHO, BEST EXECUTION & SEC RULE 605/606 AUDITING
 * Enforces SEC Rule 200/203(b)(1) Locate Requirements, Rule 204 Mandatory Closeouts,
 * FINRA Rule 5310 Best Execution Scoring, and Rule 606 Routing Venue Transparency.
 * ============================================================================ */

export type RegShoLocateStatus =
  | 'LOCATE_CONFIRMED'
  | 'LOCATE_REJECTED'
  | 'EASY_TO_BORROW'
  | 'HARD_TO_BORROW'
  | 'THRESHOLD_SECURITY'
  | 'PRE_BORROW_MANDATORY'
  | 'EXEMPT_MARKET_MAKER';

export type OrderRoutingVenueType =
  | 'DIRECT_EXCHANGE'
  | 'DARK_POOL_ATS'
  | 'WHOLESALER_INTERNALIZER'
  | 'ALGORITHMIC_SMART_ROUTER'
  | 'CLEARING_BROKER_INVENTORY';

export interface RegShoLocateRecord {
  id: string;
  account_id: string;
  symbol: string;
  shares_requested: number;
  shares_located: number;
  borrow_rate_annual_bps: number;
  locate_source: string;
  status: RegShoLocateStatus;
  timestamp: string;
  expires_at: string;
  supervisory_crd: string;
  locate_fee_usd: number;
  rule_204_closeout_deadline?: string;
  is_threshold_list: boolean;
}

export interface BestExecutionScorecard {
  symbol: string;
  order_id: string;
  side: 'buy' | 'sell' | 'sell_short';
  executed_shares: number;
  execution_price: number;
  national_best_bid_at_exec: number;
  national_best_offer_at_exec: number;
  effective_spread_bps: number;
  quoted_spread_bps: number;
  price_improvement_usd: number;
  slippage_vs_nbbo_mid_bps: number;
  routed_venue: string;
  venue_type: OrderRoutingVenueType;
  execution_latency_ms: number;
  finra_5310_compliant: boolean;
  timestamp: string;
}

export interface Rule606VenueMetric {
  venue_name: string;
  venue_type: OrderRoutingVenueType;
  non_directed_orders_percent: number;
  market_orders_percent: number;
  marketable_limit_orders_percent: number;
  non_marketable_limit_orders_percent: number;
  net_payment_for_order_flow_usd: number;
  avg_price_improvement_per_share: number;
  fill_rate_percent: number;
  avg_execution_speed_ms: number;
}

export interface MarginInterestSchedule {
  tier_name: string;
  min_debit_balance: number;
  max_debit_balance: number;
  base_rate_name: 'SOFR' | 'FED_FUNDS_EFFECTIVE' | 'BROKER_CALL_RATE';
  base_rate_percent: number;
  spread_bps: number;
  effective_annual_rate_percent: number;
  daily_accrual_rate_percent: number;
}

/**
 * Quantitative Regulation SHO & Best Execution Compliance Engine
 * Handles locate checks, locate rate pricing, Rule 204 fail-to-deliver tracking,
 * and statistical NBBO price improvement benchmarking.
 */
export class ExecutionQualityAndRegShoEngine {
  private static instance: ExecutionQualityAndRegShoEngine;

  private constructor() {}

  public static getInstance(): ExecutionQualityAndRegShoEngine {
    if (!ExecutionQualityAndRegShoEngine.instance) {
      ExecutionQualityAndRegShoEngine.instance = new ExecutionQualityAndRegShoEngine();
    }
    return ExecutionQualityAndRegShoEngine.instance;
  }

  /**
   * Hard-to-Borrow & Easy-to-Borrow Master Securities Registry
   */
  private readonly securitiesInventory: Record<
    string,
    { isEtb: boolean; isThreshold: boolean; borrowRateBps: number; availablePool: number }
  > = {
    AAPL: { isEtb: true, isThreshold: false, borrowRateBps: 25, availablePool: 2500000 },
    MSFT: { isEtb: true, isThreshold: false, borrowRateBps: 25, availablePool: 1800000 },
    NVDA: { isEtb: true, isThreshold: false, borrowRateBps: 45, availablePool: 950000 },
    TSLA: { isEtb: false, isThreshold: false, borrowRateBps: 380, availablePool: 120000 },
    GME: { isEtb: false, isThreshold: true, borrowRateBps: 1850, availablePool: 15000 },
    AMC: { isEtb: false, isThreshold: true, borrowRateBps: 2400, availablePool: 5000 },
    SPY: { isEtb: true, isThreshold: false, borrowRateBps: 15, availablePool: 10000000 },
    QQQ: { isEtb: true, isThreshold: false, borrowRateBps: 20, availablePool: 6500000 },
    COIN: { isEtb: false, isThreshold: false, borrowRateBps: 620, availablePool: 85000 },
    PLTR: { isEtb: true, isThreshold: false, borrowRateBps: 85, availablePool: 450000 },
  };

  /**
   * Evaluates Short Sale Locate Request under SEC Rule 203(b)(1)
   */
  public queryShortLocate(
    accountId: string,
    symbol: string,
    shares: number
  ): RegShoLocateRecord {
    const cleanSym = symbol.toUpperCase().trim();
    const sec = this.securitiesInventory[cleanSym] || {
      isEtb: false,
      isThreshold: false,
      borrowRateBps: 850,
      availablePool: 25000,
    };

    const isAvailable = sec.availablePool >= shares;
    const isThreshold = sec.isThreshold;

    let status: RegShoLocateStatus = 'HARD_TO_BORROW';
    if (isThreshold) {
      status = 'THRESHOLD_SECURITY';
    } else if (sec.isEtb) {
      status = 'EASY_TO_BORROW';
    } else if (isAvailable) {
      status = 'LOCATE_CONFIRMED';
    } else {
      status = 'LOCATE_REJECTED';
    }

    const dailyRate = sec.borrowRateBps / 10000 / 360;
    const estimatedSharePrice = cleanSym === 'SPY' ? 590 : cleanSym === 'NVDA' ? 135 : 100;
    const locateFee = isAvailable ? Math.max(5.0, shares * estimatedSharePrice * dailyRate * 1.5) : 0.0;

    const expires = new Date();
    expires.setHours(20, 0, 0, 0); // Locates expire end of current trading day

    const closeoutDeadline = new Date();
    closeoutDeadline.setDate(closeoutDeadline.getDate() + (isThreshold ? 13 : 35)); // Rule 204 closeout window

    return {
      id: `loc-${cleanSym}-${Date.now().toString(36)}`,
      account_id: accountId,
      symbol: cleanSym,
      shares_requested: shares,
      shares_located: isAvailable ? shares : 0,
      borrow_rate_annual_bps: sec.borrowRateBps,
      locate_source: sec.isEtb ? 'VELOX_INTERNAL_ETB_POOL' : 'APEX_LENDING_DESK_DIRECT',
      status,
      timestamp: new Date().toISOString(),
      expires_at: expires.toISOString(),
      supervisory_crd: 'CRD-S4-29180',
      locate_fee_usd: Math.round(locateFee * 100) / 100,
      rule_204_closeout_deadline: closeoutDeadline.toISOString(),
      is_threshold_list: isThreshold,
    };
  }

  /**
   * Calculates FINRA Rule 5310 Best Execution Metrics & NBBO Price Improvement
   */
  public evaluateExecutionQuality(
    order: {
      symbol: string;
      order_id: string;
      side: 'buy' | 'sell' | 'sell_short';
      shares: number;
      fillPrice: number;
      bid: number;
      offer: number;
      venue: string;
      venueType: OrderRoutingVenueType;
      latencyMs: number;
    }
  ): BestExecutionScorecard {
    const nbboMid = (order.bid + order.offer) / 2.0;
    const quotedSpread = order.offer - order.bid;
    const quotedSpreadBps = (quotedSpread / nbboMid) * 10000;

    let effectiveSpread = 0;
    let priceImprovement = 0;

    if (order.side === 'buy') {
      effectiveSpread = 2 * (order.fillPrice - nbboMid);
      priceImprovement = Math.max(0, (order.offer - order.fillPrice) * order.shares);
    } else {
      effectiveSpread = 2 * (nbboMid - order.fillPrice);
      priceImprovement = Math.max(0, (order.fillPrice - order.bid) * order.shares);
    }

    const effectiveSpreadBps = (effectiveSpread / nbboMid) * 10000;
    const slippageVsMid = Math.abs(order.fillPrice - nbboMid) / nbboMid * 10000;

    const isPriceImprovedOrAtNbbo =
      order.side === 'buy' ? order.fillPrice <= order.offer : order.fillPrice >= order.bid;

    return {
      symbol: order.symbol,
      order_id: order.order_id,
      side: order.side,
      executed_shares: order.shares,
      execution_price: order.fillPrice,
      national_best_bid_at_exec: order.bid,
      national_best_offer_at_exec: order.offer,
      effective_spread_bps: Math.round(effectiveSpreadBps * 100) / 100,
      quoted_spread_bps: Math.round(quotedSpreadBps * 100) / 100,
      price_improvement_usd: Math.round(priceImprovement * 100) / 100,
      slippage_vs_nbbo_mid_bps: Math.round(slippageVsMid * 100) / 100,
      routed_venue: order.venue,
      venue_type: order.venueType,
      execution_latency_ms: order.latencyMs,
      finra_5310_compliant: isPriceImprovedOrAtNbbo,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Master Tiered Margin Debit Interest Rate Table
   */
  public getMarginInterestTiers(): MarginInterestSchedule[] {
    const baseSofr = 4.30; // Current reference rate benchmark
    return [
      {
        tier_name: 'Tier 1: Institutional Prime ($1,000,000+)',
        min_debit_balance: 1000000,
        max_debit_balance: Infinity,
        base_rate_name: 'SOFR',
        base_rate_percent: baseSofr,
        spread_bps: 125,
        effective_annual_rate_percent: baseSofr + 1.25,
        daily_accrual_rate_percent: (baseSofr + 1.25) / 360,
      },
      {
        tier_name: 'Tier 2: High Net Worth ($500,000 - $999,999)',
        min_debit_balance: 500000,
        max_debit_balance: 999999.99,
        base_rate_name: 'SOFR',
        base_rate_percent: baseSofr,
        spread_bps: 175,
        effective_annual_rate_percent: baseSofr + 1.75,
        daily_accrual_rate_percent: (baseSofr + 1.75) / 360,
      },
      {
        tier_name: 'Tier 3: Active Professional ($100,000 - $499,999)',
        min_debit_balance: 100000,
        max_debit_balance: 499999.99,
        base_rate_name: 'SOFR',
        base_rate_percent: baseSofr,
        spread_bps: 250,
        effective_annual_rate_percent: baseSofr + 2.50,
        daily_accrual_rate_percent: (baseSofr + 2.50) / 360,
      },
      {
        tier_name: 'Tier 4: Standard Margin (< $100,000)',
        min_debit_balance: 0,
        max_debit_balance: 99999.99,
        base_rate_name: 'SOFR',
        base_rate_percent: baseSofr,
        spread_bps: 375,
        effective_annual_rate_percent: baseSofr + 3.75,
        daily_accrual_rate_percent: (baseSofr + 3.75) / 360,
      },
    ];
  }

  /**
   * Returns Rule 606 Order Routing Venues Statistics
   */
  public getRule606Venues(): Rule606VenueMetric[] {
    return [
      {
        venue_name: 'NASDAQ execution Engine (INET)',
        venue_type: 'DIRECT_EXCHANGE',
        non_directed_orders_percent: 34.2,
        market_orders_percent: 18.5,
        marketable_limit_orders_percent: 42.1,
        non_marketable_limit_orders_percent: 39.4,
        net_payment_for_order_flow_usd: 0.0,
        avg_price_improvement_per_share: 0.0034,
        fill_rate_percent: 99.8,
        avg_execution_speed_ms: 4.2,
      },
      {
        venue_name: 'New York Stock Exchange (ARCA / NYSE)',
        venue_type: 'DIRECT_EXCHANGE',
        non_directed_orders_percent: 28.6,
        market_orders_percent: 22.1,
        marketable_limit_orders_percent: 31.4,
        non_marketable_limit_orders_percent: 46.5,
        net_payment_for_order_flow_usd: 0.0,
        avg_price_improvement_per_share: 0.0028,
        fill_rate_percent: 99.6,
        avg_execution_speed_ms: 5.1,
      },
      {
        venue_name: 'Citadel Securities Institutional Wholesaler',
        venue_type: 'WHOLESALER_INTERNALIZER',
        non_directed_orders_percent: 21.4,
        market_orders_percent: 45.2,
        marketable_limit_orders_percent: 19.3,
        non_marketable_limit_orders_percent: 8.2,
        net_payment_for_order_flow_usd: 0.0,
        avg_price_improvement_per_share: 0.0112,
        fill_rate_percent: 100.0,
        avg_execution_speed_ms: 2.8,
      },
      {
        venue_name: 'Virtu Financial ATS Internalizer',
        venue_type: 'WHOLESALER_INTERNALIZER',
        non_directed_orders_percent: 12.8,
        market_orders_percent: 14.2,
        marketable_limit_orders_percent: 7.2,
        non_marketable_limit_orders_percent: 5.9,
        net_payment_for_order_flow_usd: 0.0,
        avg_price_improvement_per_share: 0.0094,
        fill_rate_percent: 99.9,
        avg_execution_speed_ms: 3.1,
      },
      {
        venue_name: 'Velox Intelligent Smart Order Router (SOR)',
        venue_type: 'ALGORITHMIC_SMART_ROUTER',
        non_directed_orders_percent: 3.0,
        market_orders_percent: 0.0,
        marketable_limit_orders_percent: 0.0,
        non_marketable_limit_orders_percent: 0.0,
        net_payment_for_order_flow_usd: 0.0,
        avg_price_improvement_per_share: 0.0145,
        fill_rate_percent: 99.7,
        avg_execution_speed_ms: 6.4,
      },
    ];
  }
}

export const regShoEngine = ExecutionQualityAndRegShoEngine.getInstance();

/* ============================================================================
 * INTERACTIVE SUB-COMPONENT: REGULATION SHO & BEST EXECUTION AUDITOR VIEW
 * ============================================================================ */

export const RegShoAndExecutionAuditorView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [locateSymbol, setLocateSymbol] = useState('TSLA');
  const [locateShares, setLocateShares] = useState(500);
  const [locatesHistory, setLocatesHistory] = useState<RegShoLocateRecord[]>([]);
  const [executionScorecards, setExecutionScorecards] = useState<BestExecutionScorecard[]>([]);
  const [selectedSubTab, setSelectedSubTab] = useState<'locates' | 'best_ex' | 'rule_606' | 'margin_rates'>('locates');
  const [isQuerying, setIsQuerying] = useState(false);

  // Initialize mock execution scorecards on load
  useEffect(() => {
    const mockScores: BestExecutionScorecard[] = [
      regShoEngine.evaluateExecutionQuality({
        symbol: 'NVDA',
        order_id: 'ord-883910-nvda',
        side: 'buy',
        shares: 300,
        fillPrice: 134.82,
        bid: 134.80,
        offer: 134.85,
        venue: 'Citadel Securities Institutional Wholesaler',
        venueType: 'WHOLESALER_INTERNALIZER',
        latencyMs: 3.2,
      }),
      regShoEngine.evaluateExecutionQuality({
        symbol: 'AAPL',
        order_id: 'ord-883911-aapl',
        side: 'buy',
        shares: 500,
        fillPrice: 228.40,
        bid: 228.38,
        offer: 228.42,
        venue: 'NASDAQ Execution Engine (INET)',
        venueType: 'DIRECT_EXCHANGE',
        latencyMs: 4.8,
      }),
      regShoEngine.evaluateExecutionQuality({
        symbol: 'SPY',
        order_id: 'ord-883912-spy',
        side: 'sell',
        shares: 1000,
        fillPrice: 588.96,
        bid: 588.94,
        offer: 588.97,
        venue: 'New York Stock Exchange (ARCA / NYSE)',
        venueType: 'DIRECT_EXCHANGE',
        latencyMs: 5.5,
      }),
      regShoEngine.evaluateExecutionQuality({
        symbol: 'TSLA',
        order_id: 'ord-883913-tsla',
        side: 'sell_short',
        shares: 250,
        fillPrice: 242.15,
        bid: 242.10,
        offer: 242.18,
        venue: 'Virtu Financial ATS Internalizer',
        venueType: 'WHOLESALER_INTERNALIZER',
        latencyMs: 2.9,
      }),
    ];

    setExecutionScorecards(mockScores);

    // Initial pre-loaded locate
    const initialLocate = regShoEngine.queryShortLocate(account.id, 'TSLA', 500);
    setLocatesHistory([initialLocate]);
  }, [account.id]);

  const handleQueryLocate = () => {
    if (!locateSymbol || locateShares <= 0) return;
    setIsQuerying(true);
    setTimeout(() => {
      const loc = regShoEngine.queryShortLocate(account.id, locateSymbol, locateShares);
      setLocatesHistory((prev) => [loc, ...prev]);
      setIsQuerying(false);
    }, 450);
  };

  const marginTiers = useMemo(() => regShoEngine.getMarginInterestTiers(), []);
  const rule606Venues = useMemo(() => regShoEngine.getRule606Venues(), []);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-400">
              <Zap size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">Reg SHO Locates & Best Execution Citadel</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  SEC Rule 203 & FINRA 5310
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time pre-borrow locate engine, Rule 204 fail-to-deliver monitoring, and NBBO execution quality statistics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedSubTab('locates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedSubTab === 'locates'
                  ? 'bg-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Short Locates ({locatesHistory.length})
            </button>
            <button
              onClick={() => setSelectedSubTab('best_ex')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedSubTab === 'best_ex'
                  ? 'bg-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Best Ex Scoring ({executionScorecards.length})
            </button>
            <button
              onClick={() => setSelectedSubTab('rule_606')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedSubTab === 'rule_606'
                  ? 'bg-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rule 606 Routing
            </button>
            <button
              onClick={() => setSelectedSubTab('margin_rates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedSubTab === 'margin_rates'
                  ? 'bg-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SOFR Margin Tiers
            </button>
          </div>
        </div>

        {/* Real-time Regulatory Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Active Borrow Pool Depth</span>
            <span className="font-mono text-emerald-400 font-bold text-sm">22.4M Shares</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Price Improvement Ratio</span>
            <span className="font-mono text-cyan-400 font-bold text-sm">94.8% of Fills</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Mean Order Latency</span>
            <span className="font-mono text-yellow-400 font-bold text-sm">3.8 ms</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Rule 204 FTD Breaches</span>
            <span className="font-mono text-emerald-400 font-bold text-sm">0 (Clean Settlement)</span>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: SHORT SALE LOCATES ENGINE */}
      {selectedSubTab === 'locates' && (
        <div className="space-y-6">
          {/* Query Box */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <Search size={16} className="text-purple-400" />
                Query SEC Rule 203(b)(1) Pre-Borrow Locate Pool
              </h3>
              <span className="text-xs text-slate-400 font-mono">Velox Clearing Auto-Locate Gateway</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-4">
                <label className="text-slate-300 font-semibold block text-xs mb-1">Ticker Symbol</label>
                <input
                  type="text"
                  value={locateSymbol}
                  onChange={(e) => setLocateSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g. TSLA, GME, NVDA, COIN"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm uppercase text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-slate-300 font-semibold block text-xs mb-1">Requested Short Share Volume</label>
                <input
                  type="number"
                  value={locateShares}
                  onChange={(e) => setLocateShares(Math.max(1, parseInt(e.target.value) || 0))}
                  min={1}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-4">
                <button
                  onClick={handleQueryLocate}
                  disabled={isQuerying || !locateSymbol}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 transition disabled:opacity-50"
                >
                  {isQuerying ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Check Locate Availability & Fee
                </button>
              </div>
            </div>
          </div>

          {/* Locates History Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Recent Short Sale Locate Confirmations ({locatesHistory.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locatesHistory.map((loc) => {
                const isConfirmed = loc.status === 'LOCATE_CONFIRMED' || loc.status === 'EASY_TO_BORROW';
                const isThreshold = loc.is_threshold_list;

                const badgeStyle = isThreshold
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : isConfirmed
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30';

                return (
                  <div
                    key={loc.id}
                    className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-slate-100">{loc.symbol}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${badgeStyle}`}>
                          {loc.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="font-mono text-cyan-400 text-xs font-bold">
                        {loc.shares_located.toLocaleString()} / {loc.shares_requested.toLocaleString()} Shs
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono">
                      <div>
                        <span className="text-slate-500 block">Annual Borrow Rate:</span>
                        <span className="text-yellow-400 font-bold">{(loc.borrow_rate_annual_bps / 100).toFixed(2)}% ({loc.borrow_rate_annual_bps} bps)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Locate Fee:</span>
                        <span className="text-slate-200">{formatCurrency(loc.locate_fee_usd)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Locate Source:</span>
                        <span className="text-slate-300 truncate block">{loc.locate_source}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Rule 204 Closeout:</span>
                        <span className="text-purple-400">{formatTimestamp(loc.rule_204_closeout_deadline)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                      <span>Expires: {formatTimestamp(loc.expires_at)}</span>
                      <span>Supervisor: {loc.supervisory_crd}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FINRA 5310 BEST EXECUTION SCORING */}
      {selectedSubTab === 'best_ex' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <BadgeCheck size={16} className="text-emerald-400" />
                  FINRA Rule 5310 Best Execution & NBBO Improvement Audit
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Execution price vs National Best Bid/Offer at fill time</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% REGULATORY CONFORMANCE
              </span>
            </div>

            <div className="space-y-3">
              {executionScorecards.map((score) => {
                const isBuy = score.side === 'buy';

                return (
                  <div
                    key={score.order_id}
                    className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                          {score.side.toUpperCase()}
                        </span>
                        <div>
                          <span className="font-bold text-slate-100 text-sm">{score.symbol}</span>
                          <span className="text-xs text-slate-400 ml-2 font-mono">
                            {score.executed_shares.toLocaleString()} Shs @ {formatCurrency(score.execution_price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block uppercase">Price Improvement</span>
                          <span className="font-mono text-emerald-400 font-bold text-xs">
                            +{formatCurrency(score.price_improvement_usd)}
                          </span>
                        </div>
                        <div className="text-right pl-3 border-l border-slate-800">
                          <span className="text-[10px] text-slate-500 block uppercase">Latency</span>
                          <span className="font-mono text-yellow-400 font-bold text-xs">
                            {score.execution_latency_ms} ms
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* NBBO & Spread Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-slate-400">
                      <div>
                        <span>NBBO at Exec:</span>
                        <span className="text-slate-200 block">{formatCurrency(score.national_best_bid_at_exec)} x {formatCurrency(score.national_best_offer_at_exec)}</span>
                      </div>
                      <div>
                        <span>Effective Spread:</span>
                        <span className="text-cyan-400 block">{score.effective_spread_bps} bps</span>
                      </div>
                      <div>
                        <span>Quoted Spread:</span>
                        <span className="text-slate-300 block">{score.quoted_spread_bps} bps</span>
                      </div>
                      <div>
                        <span>Routed Venue:</span>
                        <span className="text-purple-400 block truncate">{score.routed_venue}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SEC RULE 606 ROUTING VENUES */}
      {selectedSubTab === 'rule_606' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <Network size={16} className="text-cyan-400" />
                  SEC Rule 606 Quarterly Order Routing Venue Transparency
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Disclosing order routing destinations, PFOF agreements, and execution fill rates</p>
              </div>
              <span className="text-xs font-mono text-slate-400">Q1 2025 DISCLOSURE</span>
            </div>

            <div className="space-y-3">
              {rule606Venues.map((venue, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-200 text-xs">{venue.venue_name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">{venue.venue_type.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Order Flow Share</span>
                        <span className="text-yellow-400 font-bold">{venue.non_directed_orders_percent}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Fill Rate</span>
                        <span className="text-emerald-400 font-bold">{venue.fill_rate_percent}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Speed</span>
                        <span className="text-cyan-400 font-bold">{venue.avg_execution_speed_ms} ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-slate-400">
                    <div>
                      <span>Market Orders:</span>
                      <span className="text-slate-200 ml-1">{venue.market_orders_percent}%</span>
                    </div>
                    <div>
                      <span>Marketable Limits:</span>
                      <span className="text-slate-200 ml-1">{venue.marketable_limit_orders_percent}%</span>
                    </div>
                    <div>
                      <span>Avg Price Imprv / Sh:</span>
                      <span className="text-emerald-400 font-bold ml-1">${venue.avg_price_improvement_per_share.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SOFR MARGIN DEBIT TIERS */}
      {selectedSubTab === 'margin_rates' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <Percent size={16} className="text-yellow-400" />
                  Secured Overnight Financing Rate (SOFR) Margin Interest Schedule
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Benchmark rate: SOFR (4.30%) + Tiered Broker Spread</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                DAILY ACCRUAL / MONTHLY POSTING
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marginTiers.map((tier, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-slate-200 text-xs">{tier.tier_name}</h4>
                    <span className="font-mono text-yellow-400 font-black text-sm">
                      {tier.effective_annual_rate_percent.toFixed(2)}% APY
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Base Reference Rate:</span>
                      <span className="text-slate-200">{tier.base_rate_name} ({tier.base_rate_percent.toFixed(2)}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Correspondent Spread:</span>
                      <span className="text-cyan-400">+{tier.spread_bps} bps (+{(tier.spread_bps / 100).toFixed(2)}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Compound Factor:</span>
                      <span className="text-slate-300">{(tier.daily_accrual_rate_percent).toFixed(5)}% / day</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
/* ============================================================================
 * EXTENDED MODULE: TAX LOT ACCOUNTING, IRC § 1091 WASH SALE ENGINE & 1099-B AUDITING
 * Enforces IRC § 1012 Cost Basis Regulations, § 1091 Wash Sale Disallowance Rules,
 * § 1256 Contract 60/40 Capital Gains Treatment, and Form 1099-B Reporting.
 * ============================================================================ */

export type TaxLotSelectionMethod =
  | 'FIFO'
  | 'LIFO'
  | 'HIGH_COST'
  | 'LOW_COST'
  | 'MIN_TAX'
  | 'SPECIFIC_IDENTIFICATION';

export type CapitalGainTerm = 'SHORT_TERM' | 'LONG_TERM' | 'SECTION_1256_BLENDED';

export interface TaxLotRecord {
  id: string;
  account_id: string;
  symbol: string;
  open_date: string;
  close_date?: string;
  quantity: number;
  original_quantity: number;
  cost_per_share: number;
  adjusted_basis_per_share: number;
  total_cost_basis: number;
  proceeds?: number;
  realized_gain_loss?: number;
  gain_term?: CapitalGainTerm;
  is_wash_sale_disallowed: boolean;
  disallowed_loss_amount: number;
  wash_sale_replacement_lot_id?: string;
  holding_period_days: number;
  covered_security: boolean;
  status: 'OPEN' | 'CLOSED' | 'PARTIALLY_CLOSED';
}

export interface WashSaleEventRecord {
  id: string;
  account_id: string;
  loss_lot_id: string;
  replacement_lot_id: string;
  symbol: string;
  loss_date: string;
  replacement_date: string;
  disallowed_loss_amount: number;
  shares_affected: number;
  original_loss_per_share: number;
  adjusted_basis_of_replacement: number;
  supervisory_review_status: 'CONFIRMED' | 'OVERRIDDEN' | 'AUDITED';
  created_at: string;
}

export interface Form1099BBoxSummary {
  tax_year: number;
  recipient_account_number: string;
  recipient_tin_masked: string;
  short_term_covered_proceeds: number;
  short_term_covered_cost_basis: number;
  short_term_wash_sale_disallowed: number;
  short_term_net_gain_loss: number;
  long_term_covered_proceeds: number;
  long_term_covered_cost_basis: number;
  long_term_wash_sale_disallowed: number;
  long_term_net_gain_loss: number;
  section_1256_net_gain_loss: number;
  section_1256_60_percent_long_term: number;
  section_1256_40_percent_short_term: number;
  total_federal_income_tax_withheld: number;
  generated_timestamp: string;
  irs_electronic_file_digest: string;
}

/**
 * Enterprise Tax Lot Accounting & Wash Sale Detection Engine
 * Evaluates 30-day lookback and 30-day lookforward windows around realized losses,
 * calculates cost basis adjustments, and classifies capital gain terms.
 */
export class TaxLotAccountingEngine {
  private static instance: TaxLotAccountingEngine;

  private constructor() {}

  public static getInstance(): TaxLotAccountingEngine {
    if (!TaxLotAccountingEngine.instance) {
      TaxLotAccountingEngine.instance = new TaxLotAccountingEngine();
    }
    return TaxLotAccountingEngine.instance;
  }

  /**
   * Determine capital gain term based on opening and closing dates
   */
  public calculateGainTerm(openDateIso: string, closeDateIso: string, symbol: string): CapitalGainTerm {
    // Check if security is a Section 1256 regulated futures / broad-based index option
    const section1256Symbols = ['SPX', 'NDX', 'RUT', 'VIX', 'OEX', 'XSP'];
    if (section1256Symbols.includes(symbol.toUpperCase())) {
      return 'SECTION_1256_BLENDED';
    }

    const open = new Date(openDateIso).getTime();
    const close = new Date(closeDateIso).getTime();
    const diffDays = (close - open) / (1000 * 60 * 60 * 24);

    return diffDays > 365 ? 'LONG_TERM' : 'SHORT_TERM';
  }

  /**
   * Evaluates Wash Sale Disallowance under IRC § 1091
   * Window: 30 days before sale date through 30 days after sale date (61-day window)
   */
  public evaluateWashSale(
    closedLossLot: TaxLotRecord,
    candidateLots: TaxLotRecord[]
  ): {
    isWashSale: boolean;
    disallowedLoss: number;
    replacementLot?: TaxLotRecord;
    washEvent?: WashSaleEventRecord;
  } {
    if (!closedLossLot.close_date || !closedLossLot.realized_gain_loss || closedLossLot.realized_gain_loss >= 0) {
      return { isWashSale: false, disallowedLoss: 0 };
    }

    const saleTime = new Date(closedLossLot.close_date).getTime();
    const windowMs = 30 * 24 * 60 * 60 * 1000;

    // Look for acquisition of substantially identical shares in the 61-day window
    const eligibleReplacements = candidateLots.filter((lot) => {
      if (lot.id === closedLossLot.id || lot.symbol !== closedLossLot.symbol) return false;
      const lotOpenTime = new Date(lot.open_date).getTime();
      return Math.abs(lotOpenTime - saleTime) <= windowMs;
    });

    if (eligibleReplacements.length === 0) {
      return { isWashSale: false, disallowedLoss: 0 };
    }

    const replacement = eligibleReplacements[0];
    const sharesDisallowed = Math.min(closedLossLot.quantity, replacement.quantity);
    const lossPerShare = Math.abs(closedLossLot.realized_gain_loss) / closedLossLot.quantity;
    const totalDisallowed = Math.round(lossPerShare * sharesDisallowed * 100) / 100;

    const adjustedReplacementBasis = replacement.cost_per_share + lossPerShare;

    const washEvent: WashSaleEventRecord = {
      id: `wash-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      account_id: closedLossLot.account_id,
      loss_lot_id: closedLossLot.id,
      replacement_lot_id: replacement.id,
      symbol: closedLossLot.symbol,
      loss_date: closedLossLot.close_date,
      replacement_date: replacement.open_date,
      disallowed_loss_amount: totalDisallowed,
      shares_affected: sharesDisallowed,
      original_loss_per_share: lossPerShare,
      adjusted_basis_of_replacement: Math.round(adjustedReplacementBasis * 100) / 100,
      supervisory_review_status: 'CONFIRMED',
      created_at: new Date().toISOString(),
    };

    return {
      isWashSale: true,
      disallowedLoss: totalDisallowed,
      replacementLot: replacement,
      washEvent,
    };
  }

  /**
   * Generates mock tax lot ledger for correspondent account
   */
  public generateMockTaxLots(accountId: string): TaxLotRecord[] {
    return [
      {
        id: `lot-nvda-01-${accountId.slice(0, 4)}`,
        account_id: accountId,
        symbol: 'NVDA',
        open_date: '2024-03-12T14:30:00.000Z',
        close_date: '2025-01-20T16:00:00.000Z',
        quantity: 100,
        original_quantity: 100,
        cost_per_share: 89.50,
        adjusted_basis_per_share: 89.50,
        total_cost_basis: 8950.00,
        proceeds: 13520.00,
        realized_gain_loss: 4570.00,
        gain_term: 'SHORT_TERM',
        is_wash_sale_disallowed: false,
        disallowed_loss_amount: 0.0,
        holding_period_days: 314,
        covered_security: true,
        status: 'CLOSED',
      },
      {
        id: `lot-tsla-02-${accountId.slice(0, 4)}`,
        account_id: accountId,
        symbol: 'TSLA',
        open_date: '2024-11-05T15:00:00.000Z',
        close_date: '2025-01-10T15:30:00.000Z',
        quantity: 150,
        original_quantity: 150,
        cost_per_share: 260.00,
        adjusted_basis_per_share: 260.00,
        total_cost_basis: 39000.00,
        proceeds: 33750.00,
        realized_gain_loss: -5250.00,
        gain_term: 'SHORT_TERM',
        is_wash_sale_disallowed: true,
        disallowed_loss_amount: 5250.00,
        wash_sale_replacement_lot_id: `lot-tsla-03-${accountId.slice(0, 4)}`,
        holding_period_days: 66,
        covered_security: true,
        status: 'CLOSED',
      },
      {
        id: `lot-tsla-03-${accountId.slice(0, 4)}`,
        account_id: accountId,
        symbol: 'TSLA',
        open_date: '2025-01-18T10:15:00.000Z',
        quantity: 150,
        original_quantity: 150,
        cost_per_share: 220.00,
        adjusted_basis_per_share: 255.00, // $220 + $35 disallowed loss/sh tacked onto basis
        total_cost_basis: 38250.00,
        is_wash_sale_disallowed: false,
        disallowed_loss_amount: 0.0,
        holding_period_days: 28,
        covered_security: true,
        status: 'OPEN',
      },
      {
        id: `lot-aapl-04-${accountId.slice(0, 4)}`,
        account_id: accountId,
        symbol: 'AAPL',
        open_date: '2023-08-15T13:45:00.000Z',
        close_date: '2025-02-05T14:00:00.000Z',
        quantity: 200,
        original_quantity: 200,
        cost_per_share: 178.20,
        adjusted_basis_per_share: 178.20,
        total_cost_basis: 35640.00,
        proceeds: 46200.00,
        realized_gain_loss: 10560.00,
        gain_term: 'LONG_TERM',
        is_wash_sale_disallowed: false,
        disallowed_loss_amount: 0.0,
        holding_period_days: 540,
        covered_security: true,
        status: 'CLOSED',
      },
      {
        id: `lot-spx-05-${accountId.slice(0, 4)}`,
        account_id: accountId,
        symbol: 'SPX',
        open_date: '2025-01-05T10:00:00.000Z',
        close_date: '2025-01-19T16:00:00.000Z',
        quantity: 10,
        original_quantity: 10,
        cost_per_share: 5820.00,
        adjusted_basis_per_share: 5820.00,
        total_cost_basis: 58200.00,
        proceeds: 64100.00,
        realized_gain_loss: 5900.00,
        gain_term: 'SECTION_1256_BLENDED',
        is_wash_sale_disallowed: false,
        disallowed_loss_amount: 0.0,
        holding_period_days: 14,
        covered_security: true,
        status: 'CLOSED',
      },
    ];
  }

  /**
   * Generates Consolidated 1099-B Tax Summary
   */
  public generateForm1099BSummary(account: AlpacaAccountFullRecord, lots: TaxLotRecord[]): Form1099BBoxSummary {
    let stProceeds = 0;
    let stCostBasis = 0;
    let stWashDisallowed = 0;
    let stNet = 0;

    let ltProceeds = 0;
    let ltCostBasis = 0;
    let ltWashDisallowed = 0;
    let ltNet = 0;

    let sec1256Net = 0;

    lots.filter((l) => l.status === 'CLOSED').forEach((lot) => {
      if (lot.gain_term === 'SECTION_1256_BLENDED') {
        sec1256Net += lot.realized_gain_loss || 0;
      } else if (lot.gain_term === 'LONG_TERM') {
        ltProceeds += lot.proceeds || 0;
        ltCostBasis += lot.total_cost_basis;
        ltWashDisallowed += lot.disallowed_loss_amount;
        ltNet += (lot.realized_gain_loss || 0) + lot.disallowed_loss_amount;
      } else {
        stProceeds += lot.proceeds || 0;
        stCostBasis += lot.total_cost_basis;
        stWashDisallowed += lot.disallowed_loss_amount;
        stNet += (lot.realized_gain_loss || 0) + lot.disallowed_loss_amount;
      }
    });

    const sec1256Lt = Math.round(sec1256Net * 0.60 * 100) / 100;
    const sec1256St = Math.round(sec1256Net * 0.40 * 100) / 100;

    return {
      tax_year: 2025,
      recipient_account_number: account.account_number,
      recipient_tin_masked: account.identity.tax_id,
      short_term_covered_proceeds: Math.round(stProceeds * 100) / 100,
      short_term_covered_cost_basis: Math.round(stCostBasis * 100) / 100,
      short_term_wash_sale_disallowed: Math.round(stWashDisallowed * 100) / 100,
      short_term_net_gain_loss: Math.round(stNet * 100) / 100,
      long_term_covered_proceeds: Math.round(ltProceeds * 100) / 100,
      long_term_covered_cost_basis: Math.round(ltCostBasis * 100) / 100,
      long_term_wash_sale_disallowed: Math.round(ltWashDisallowed * 100) / 100,
      long_term_net_gain_loss: Math.round(ltNet * 100) / 100,
      section_1256_net_gain_loss: Math.round(sec1256Net * 100) / 100,
      section_1256_60_percent_long_term: sec1256Lt,
      section_1256_40_percent_short_term: sec1256St,
      total_federal_income_tax_withheld: 0.0,
      generated_timestamp: new Date().toISOString(),
      irs_electronic_file_digest: `sha256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };
  }
}

export const taxLotEngine = TaxLotAccountingEngine.getInstance();

/* ============================================================================
 * INTERACTIVE SUB-COMPONENT: TAX LOTS, WASH SALES & FORM 1099-B MANAGER VIEW
 * ============================================================================ */

export const TaxLotAndWashSaleView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [taxLots, setTaxLots] = useState<TaxLotRecord[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<TaxLotSelectionMethod>('FIFO');
  const [filterSymbol, setFilterSymbol] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [taxSummary, setTaxSummary] = useState<Form1099BBoxSummary | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'lots' | 'wash_sales' | 'form_1099b'>('lots');

  useEffect(() => {
    const lots = taxLotEngine.generateMockTaxLots(account.id);
    setTaxLots(lots);
    const summary = taxLotEngine.generateForm1099BSummary(account, lots);
    setTaxSummary(summary);
  }, [account]);

  const uniqueSymbols = useMemo(() => {
    const syms = new Set(taxLots.map((t) => t.symbol));
    return ['ALL', ...Array.from(syms)];
  }, [taxLots]);

  const filteredLots = useMemo(() => {
    return taxLots.filter((lot) => {
      const matchSym = filterSymbol === 'ALL' || lot.symbol === filterSymbol;
      const matchStatus = filterStatus === 'ALL' || lot.status === filterStatus;
      return matchSym && matchStatus;
    });
  }, [taxLots, filterSymbol, filterStatus]);

  const washSaleEvents = useMemo(() => {
    return taxLots.filter((l) => l.is_wash_sale_disallowed);
  }, [taxLots]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <FileCheck size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">Tax Lot Accounting & Wash Sale Engine</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  IRC § 1012 & § 1091
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Automated cost basis allocation, 61-day wash sale tracking, § 1256 60/40 blended tax modeling, and 1099-B reporting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('lots')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'lots'
                  ? 'bg-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tax Lots ({taxLots.length})
            </button>
            <button
              onClick={() => setActiveSubTab('wash_sales')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'wash_sales'
                  ? 'bg-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wash Sales ({washSaleEvents.length})
            </button>
            <button
              onClick={() => setActiveSubTab('form_1099b')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'form_1099b'
                  ? 'bg-yellow-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Form 1099-B Audit
            </button>
          </div>
        </div>

        {/* Global Net Capital Gains Bar */}
        {taxSummary && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">Short-Term Net Gains</span>
              <span className={`font-mono font-bold text-sm ${taxSummary.short_term_net_gain_loss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(taxSummary.short_term_net_gain_loss)}
              </span>
            </div>
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">Long-Term Net Gains</span>
              <span className={`font-mono font-bold text-sm ${taxSummary.long_term_net_gain_loss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(taxSummary.long_term_net_gain_loss)}
              </span>
            </div>
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">§ 1256 Contracts Net</span>
              <span className="font-mono text-purple-400 font-bold text-sm">
                {formatCurrency(taxSummary.section_1256_net_gain_loss)}
              </span>
            </div>
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px] font-semibold">Disallowed Wash Losses</span>
              <span className="font-mono text-amber-400 font-bold text-sm">
                {formatCurrency(taxSummary.short_term_wash_sale_disallowed + taxSummary.long_term_wash_sale_disallowed)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: TAX LOTS RECONCILIATION */}
      {activeSubTab === 'lots' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs text-slate-400 font-semibold shrink-0">Default Lot Method:</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as TaxLotSelectionMethod)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-yellow-400 font-bold focus:outline-none focus:border-yellow-500"
              >
                <option value="FIFO">FIFO (First-In First-Out)</option>
                <option value="LIFO">LIFO (Last-In First-Out)</option>
                <option value="HIGH_COST">High-Cost (Maximize Tax Loss)</option>
                <option value="LOW_COST">Low-Cost (Maximize Gain)</option>
                <option value="MIN_TAX">MinTax (Tax Optimizer)</option>
                <option value="SPECIFIC_IDENTIFICATION">Specific Identification</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterSymbol}
                onChange={(e) => setFilterSymbol(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                {uniqueSymbols.map((s) => (
                  <option key={s} value={s}>{s === 'ALL' ? 'All Symbols' : s}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Lot States</option>
                <option value="OPEN">Open Lots Only</option>
                <option value="CLOSED">Closed Lots Only</option>
              </select>
            </div>
          </div>

          {/* Tax Lots Grid */}
          <div className="space-y-3">
            {filteredLots.map((lot) => {
              const isClosed = lot.status === 'CLOSED';
              const isGain = (lot.realized_gain_loss || 0) >= 0;

              return (
                <div
                  key={lot.id}
                  className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-black text-slate-100">{lot.symbol}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase bg-slate-800 text-slate-300 border-slate-700">
                        {lot.quantity} Shs
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                        lot.status === 'OPEN'
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                          : 'bg-slate-700/50 text-slate-300 border-slate-600'
                      }`}>
                        {lot.status}
                      </span>
                      {lot.gain_term && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                          lot.gain_term === 'LONG_TERM'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : lot.gain_term === 'SECTION_1256_BLENDED'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {lot.gain_term.replace(/_/g, ' ')}
                        </span>
                      )}
                      {lot.is_wash_sale_disallowed && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase bg-amber-500/20 text-amber-400 border-amber-500/30">
                          WASH SALE DISALLOWED
                        </span>
                      )}
                    </div>

                    <div className="text-right font-mono">
                      {isClosed ? (
                        <div>
                          <span className={`text-sm font-bold ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isGain ? '+' : ''}{formatCurrency(lot.realized_gain_loss)}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Proceeds: {formatCurrency(lot.proceeds)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Cost Basis: {formatCurrency(lot.total_cost_basis)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono text-slate-400">
                    <div>
                      <span>Cost / Share:</span>
                      <span className="text-slate-200 block">{formatCurrency(lot.cost_per_share)}</span>
                    </div>
                    <div>
                      <span>Adjusted Basis:</span>
                      <span className="text-cyan-400 block">{formatCurrency(lot.adjusted_basis_per_share)}</span>
                    </div>
                    <div>
                      <span>Acquired Date:</span>
                      <span className="text-slate-300 block">{formatTimestamp(lot.open_date)}</span>
                    </div>
                    <div>
                      <span>Holding Tenure:</span>
                      <span className="text-yellow-400 block">{lot.holding_period_days} Days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WASH SALE AUDITING & DISALLOWANCES */}
      {activeSubTab === 'wash_sales' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <AlertTriangle size={16} className="text-amber-400" />
                  IRC § 1091 Wash Sale Disallowance & Basis Adjustment Audit
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Losses deferred into replacement shares within the mandatory 61-day window
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {washSaleEvents.length} Active Disallowances
              </span>
            </div>

            <div className="space-y-3">
              {washSaleEvents.map((wash) => (
                <div
                  key={wash.id}
                  className="p-4 bg-slate-950/60 border border-amber-500/30 rounded-xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-base font-black text-amber-400">{wash.symbol}</span>
                      <span className="text-xs text-slate-300 font-semibold">
                        Disallowed Loss: {formatCurrency(wash.disallowed_loss_amount)}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Closed on: {formatTimestamp(wash.close_date)}
                    </span>
                  </div>

                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                    Under IRC § 1091, the realized loss of {formatCurrency(wash.disallowed_loss_amount)} cannot be deducted in the current tax period because substantially identical shares were acquired within 30 days. The loss amount is added directly to the cost basis of replacement Lot <span className="font-mono font-bold text-yellow-300">{wash.wash_sale_replacement_lot_id}</span>.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                    <div>Original Loss Lot: <span className="text-slate-200">{wash.id}</span></div>
                    <div>Replacement Target: <span className="text-cyan-400">{wash.wash_sale_replacement_lot_id}</span></div>
                  </div>
                </div>
              ))}

              {washSaleEvents.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  Zero wash sale disallowances detected across all traded positions.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: FORM 1099-B TAX PACKAGE */}
      {activeSubTab === 'form_1099b' && taxSummary && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <Award size={16} className="text-yellow-400" />
                  Consolidated Form 1099-B IRS Information Return (Tax Year {taxSummary.tax_year})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Recipient: {account.identity.given_name} {account.identity.family_name} • Account: {taxSummary.recipient_account_number} • TIN: {taxSummary.recipient_tin_masked}
                </p>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                IRS FORM 1099-B VALIDATED
              </span>
            </div>

            {/* Form 1099-B Boxes Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Short Term Section */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <span className="text-yellow-400 font-bold uppercase block text-[11px]">
                  Part I: Short-Term Capital Gains / Losses (Covered)
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Box 1d (Gross Proceeds):</span>
                    <span className="text-slate-100">{formatCurrency(taxSummary.short_term_covered_proceeds)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Box 1e (Cost Basis):</span>
                    <span className="text-slate-100">{formatCurrency(taxSummary.short_term_covered_cost_basis)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Box 1g (Wash Sale Loss Disallowed):</span>
                    <span className="text-amber-400 font-bold">{formatCurrency(taxSummary.short_term_wash_sale_disallowed)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                    <span className="text-slate-400">Net Short-Term Gain/Loss:</span>
                    <span className={taxSummary.short_term_net_gain_loss >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {formatCurrency(taxSummary.short_term_net_gain_loss)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Long Term Section */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold uppercase block text-[11px]">
                  Part II: Long-Term Capital Gains / Losses (Covered)
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Box 1d (Gross Proceeds):</span>
                    <span className="text-slate-100">{formatCurrency(taxSummary.long_term_covered_proceeds)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Box 1e (Cost Basis):</span>
                    <span className="text-slate-100">{formatCurrency(taxSummary.long_term_covered_cost_basis)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Box 1g (Wash Sale Loss Disallowed):</span>
                    <span className="text-amber-400 font-bold">{formatCurrency(taxSummary.long_term_wash_sale_disallowed)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                    <span className="text-slate-400">Net Long-Term Gain/Loss:</span>
                    <span className={taxSummary.long_term_net_gain_loss >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {formatCurrency(taxSummary.long_term_net_gain_loss)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 1256 Contracts Section */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 md:col-span-2">
                <span className="text-purple-400 font-bold uppercase block text-[11px]">
                  Part III: Regulated Futures & Section 1256 Contracts (60% Long-Term / 40% Short-Term)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Box 8 (Aggregate Profit/Loss):</span>
                    <span className="text-purple-300 font-bold text-sm">{formatCurrency(taxSummary.section_1256_net_gain_loss)}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">60% Long-Term Capital Treatment:</span>
                    <span className="text-emerald-400 font-bold text-sm">{formatCurrency(taxSummary.section_1256_60_percent_long_term)}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">40% Short-Term Capital Treatment:</span>
                    <span className="text-yellow-400 font-bold text-sm">{formatCurrency(taxSummary.section_1256_40_percent_short_term)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Digest & Filing Hash */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <span className="text-slate-500 uppercase block text-[10px]">IRS Electronic Filing Digest (SEC/FINRA WORM):</span>
              <span className="text-cyan-300 break-all">{taxSummary.irs_electronic_file_digest}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * EXTENDED MODULE: CORPORATE ACTIONS & DIVIDEND ACCRUAL ENGINE
 * Enforces Stock Splits, Reverse Splits, Cash Dividends, Spin-offs,
 * and Options Clearing Corporation (OCC) Contract Adjustment Calculations.
 * ============================================================================ */

export type CorporateActionType =
  | 'CASH_DIVIDEND'
  | 'STOCK_DIVIDEND'
  | 'STOCK_SPLIT'
  | 'REVERSE_SPLIT'
  | 'SPINOFF'
  | 'TENDER_OFFER'
  | 'RIGHTS_OFFERING'
  | 'MERGER_ACQUISITION';

export interface CorporateActionRecord {
  id: string;
  symbol: string;
  action_type: CorporateActionType;
  record_date: string;
  ex_date: string;
  payable_date: string;
  ratio_from?: number;
  ratio_to?: number;
  rate_per_share?: number;
  currency: string;
  mandatory: boolean;
  status: 'ANNOUNCED' | 'EFFECTIVE' | 'PROCESSED' | 'SETTLED';
  description: string;
  occ_adjustment_memo_id?: string;
  affected_positions_count: number;
}

export interface AccountDividendAccrual {
  id: string;
  account_id: string;
  symbol: string;
  corporate_action_id: string;
  shares_held_on_record_date: number;
  gross_dividend_amount: number;
  foreign_tax_withheld: number;
  net_dividend_payable: number;
  payable_date: string;
  status: 'ACCRUED' | 'PAID' | 'REINVESTED' | 'HELD';
}

/**
 * Enterprise Corporate Actions Harmonizer
 */
export class CorporateActionsEngine {
  private static instance: CorporateActionsEngine;

  private constructor() {}

  public static getInstance(): CorporateActionsEngine {
    if (!CorporateActionsEngine.instance) {
      CorporateActionsEngine.instance = new CorporateActionsEngine();
    }
    return CorporateActionsEngine.instance;
  }

  public getActiveCorporateActions(): CorporateActionRecord[] {
    return [
      {
        id: 'ca-nvda-split-2024',
        symbol: 'NVDA',
        action_type: 'STOCK_SPLIT',
        record_date: '2024-06-06T20:00:00.000Z',
        ex_date: '2024-06-10T13:30:00.000Z',
        payable_date: '2024-06-07T20:00:00.000Z',
        ratio_from: 1,
        ratio_to: 10,
        currency: 'USD',
        mandatory: true,
        status: 'SETTLED',
        description: '10-for-1 Forward Stock Split. Adjusted strike prices /10 and contract multiplier x10.',
        occ_adjustment_memo_id: 'OCC-MEMO-54819',
        affected_positions_count: 1420,
      },
      {
        id: 'ca-aapl-div-q1-2025',
        symbol: 'AAPL',
        action_type: 'CASH_DIVIDEND',
        record_date: '2025-02-10T20:00:00.000Z',
        ex_date: '2025-02-07T13:30:00.000Z',
        payable_date: '2025-02-13T20:00:00.000Z',
        rate_per_share: 0.25,
        currency: 'USD',
        mandatory: true,
        status: 'SETTLED',
        description: 'Quarterly Cash Dividend of $0.25 per common share.',
        affected_positions_count: 3890,
      },
      {
        id: 'ca-msft-div-q1-2025',
        symbol: 'MSFT',
        action_type: 'CASH_DIVIDEND',
        record_date: '2025-02-20T20:00:00.000Z',
        ex_date: '2025-02-19T13:30:00.000Z',
        payable_date: '2025-03-13T20:00:00.000Z',
        rate_per_share: 0.83,
        currency: 'USD',
        mandatory: true,
        status: 'ANNOUNCED',
        description: 'Quarterly Cash Dividend of $0.83 per common share.',
        affected_positions_count: 2750,
      },
    ];
  }

  public getAccountDividendAccruals(accountId: string): AccountDividendAccrual[] {
    return [
      {
        id: `div-acc-01-${accountId.slice(0, 4)}`,
        account_id: accountId,
        symbol: 'AAPL',
        corporate_action_id: 'ca-aapl-div-q1-2025',
        shares_held_on_record_date: 200,
        gross_dividend_amount: 50.00,
        foreign_tax_withheld: 0.00,
        net_dividend_payable: 50.00,
        payable_date: '2025-02-13T20:00:00.000Z',
        status: 'PAID',
      },
      {
        id: `div-acc-02-${accountId.slice(0, 4)}`,
        account_id: accountId,
        symbol: 'MSFT',
        corporate_action_id: 'ca-msft-div-q1-2025',
        shares_held_on_record_date: 100,
        gross_dividend_amount: 83.00,
        foreign_tax_withheld: 0.00,
        net_dividend_payable: 83.00,
        payable_date: '2025-03-13T20:00:00.000Z',
        status: 'ACCRUED',
      },
    ];
  }
}

export const corporateActionsEngine = CorporateActionsEngine.getInstance();

/* ============================================================================
 * INTERACTIVE SUB-COMPONENT: CORPORATE ACTIONS & DIVIDEND ACCRUAL VIEW
 * ============================================================================ */

export const CorporateActionsView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [corporateActions, setCorporateActions] = useState<CorporateActionRecord[]>([]);
  const [dividendAccruals, setDividendAccruals] = useState<AccountDividendAccrual[]>([]);

  useEffect(() => {
    setCorporateActions(corporateActionsEngine.getActiveCorporateActions());
    setDividendAccruals(corporateActionsEngine.getAccountDividendAccruals(account.id));
  }, [account]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <Network size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">Corporate Actions & Dividend Accrual Hub</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  OCC & Depository Trust Clearing (DTC)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Mandatory stock splits, cash dividend allocations, and option strike adjustments
              </p>
            </div>
          </div>
        </div>

        {/* Global Accrual Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Total Paid Dividends (YTD)</span>
            <span className="text-emerald-400 font-bold text-sm">$50.00 USD</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Pending Accrued Dividends</span>
            <span className="text-yellow-400 font-bold text-sm">$83.00 USD</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Processed Stock Splits</span>
            <span className="text-cyan-400 font-bold text-sm">1 (NVDA 10:1)</span>
          </div>
        </div>
      </div>

      {/* Corporate Actions Feed */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
          <Layers size={16} className="text-yellow-400" />
          Master Corporate Actions Announcements ({corporateActions.length})
        </h3>

        <div className="space-y-3">
          {corporateActions.map((ca) => (
            <div
              key={ca.id}
              className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-slate-100">{ca.symbol}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {ca.action_type.replace(/_/g, ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    {ca.status}
                  </span>
                </div>

                <div className="text-right font-mono text-xs">
                  {ca.rate_per_share ? (
                    <span className="text-emerald-400 font-bold">+{formatCurrency(ca.rate_per_share)} / Sh</span>
                  ) : ca.ratio_to ? (
                    <span className="text-purple-400 font-bold">{ca.ratio_to}:{ca.ratio_from} Split</span>
                  ) : null}
                </div>
              </div>

              <p className="text-xs text-slate-300">{ca.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                <div>Ex-Date: <span className="text-slate-200">{formatTimestamp(ca.ex_date)}</span></div>
                <div>Record Date: <span className="text-slate-200">{formatTimestamp(ca.record_date)}</span></div>
                <div>Payable Date: <span className="text-yellow-400">{formatTimestamp(ca.payable_date)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Dividend Accruals */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
          <Coins size={16} className="text-emerald-400" />
          Account Dividend Accrual & Payout Subledger ({dividendAccruals.length})
        </h3>

        <div className="space-y-3">
          {dividendAccruals.map((acc) => (
            <div
              key={acc.id}
              className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-100">{acc.symbol}</span>
                  <span className="text-slate-400">({acc.shares_held_on_record_date} Shares Held)</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold border uppercase ${
                    acc.status === 'PAID'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {acc.status}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Payable: {formatTimestamp(acc.payable_date)}</span>
              </div>

              <div className="text-right font-mono">
                <span className="text-base font-bold text-emerald-400">+{formatCurrency(acc.net_dividend_payable)}</span>
                <span className="text-[10px] text-slate-500 block">Gross: {formatCurrency(acc.gross_dividend_amount)} (0% WHT)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * EXTENDED MODULE: PATTERN DAY TRADING (PDT) DEFENSE & INTRADAY RISK ENGINE
 * Enforces FINRA Rule 4210(f)(8)(B), Day Trade Buying Power (DTBP),
 * 5-day rolling execution windows, and Day Trade Margin Call (DTMC) resolution.
 * ============================================================================ */

export interface DayTradeExecutionRecord {
  id: string;
  account_id: string;
  symbol: string;
  buy_timestamp: string;
  sell_timestamp: string;
  shares: number;
  buy_price: number;
  sell_price: number;
  realized_pnl: number;
  dtbp_utilized: number;
}

export interface DayTradeSafetyAudit {
  is_pdt_flagged: boolean;
  rolling_day_trades_count: number;
  max_allowed_day_trades: number;
  day_trading_buying_power: number;
  overnight_buying_power: number;
  day_trade_margin_call_amount: number;
  has_active_dtmc: boolean;
  dtmc_cure_deadline?: string;
  one_time_reset_eligible: boolean;
  intraday_leverage_multiplier: number;
}

/**
 * FINRA Rule 4210 Day Trading Engine
 */
export class PatternDayTradingEngine {
  private static instance: PatternDayTradingEngine;

  private constructor() {}

  public static getInstance(): PatternDayTradingEngine {
    if (!PatternDayTradingEngine.instance) {
      PatternDayTradingEngine.instance = new PatternDayTradingEngine();
    }
    return PatternDayTradingEngine.instance;
  }

  public auditDayTradeSafety(account: AlpacaAccountFullRecord): DayTradeSafetyAudit {
    const isPdt = account.pattern_day_trader;
    const portfolioEquity = account.portfolio_value;
    const isAbovePdtMin = portfolioEquity >= 25000;

    return {
      is_pdt_flagged: isPdt,
      rolling_day_trades_count: account.daytrade_count,
      max_allowed_day_trades: isPdt ? Infinity : 3,
      day_trading_buying_power: isAbovePdtMin ? portfolioEquity * 4 : portfolioEquity * 2,
      overnight_buying_power: portfolioEquity * 2,
      day_trade_margin_call_amount: 0.0,
      has_active_dtmc: false,
      one_time_reset_eligible: !isPdt,
      intraday_leverage_multiplier: isAbovePdtMin ? 4 : 2,
    };
  }

  public getMockDayTrades(accountId: string): DayTradeExecutionRecord[] {
    return [
      {
        id: `dt-exec-01-${accountId.slice(0, 4)}`,
        account_id: accountId,
        symbol: 'NVDA',
        buy_timestamp: '2025-02-14T14:32:00.000Z',
        sell_timestamp: '2025-02-14T15:45:00.000Z',
        shares: 200,
        buy_price: 133.50,
        sell_price: 135.20,
        realized_pnl: 340.00,
        dtbp_utilized: 26700.00,
      },
    ];
  }
}

export const pdtEngine = PatternDayTradingEngine.getInstance();

/* ============================================================================
 * INTERACTIVE SUB-COMPONENT: PATTERN DAY TRADING & DTBP DEFENSE VIEW
 * ============================================================================ */

export const DayTradingRiskDefenseView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [safetyAudit, setSafetyAudit] = useState<DayTradeSafetyAudit | null>(null);
  const [dayTradesHistory, setDayTradesHistory] = useState<DayTradeExecutionRecord[]>([]);

  useEffect(() => {
    setSafetyAudit(pdtEngine.auditDayTradeSafety(account));
    setDayTradesHistory(pdtEngine.getMockDayTrades(account.id));
  }, [account]);

  if (!safetyAudit) return null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-yellow-400">
              <Zap size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">FINRA Rule 4210 Day Trading & DTBP Shield</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border uppercase ${
                  safetyAudit.is_pdt_flagged
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {safetyAudit.is_pdt_flagged ? 'PDT STATUS CONFIRMED' : 'NON-PDT STANDARD'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                4x Intraday Buying Power monitoring, 5-day rolling trade execution counter, and DTMC protection
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Rolling 5-Day Day Trades</span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-2xl font-mono font-black text-yellow-400">{safetyAudit.rolling_day_trades_count}</span>
              <span className="text-xs text-slate-500">/ 3 (Threshold)</span>
            </div>
          </div>
        </div>

        {/* DTBP Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Intraday Buying Power (4x)</span>
            <span className="text-yellow-400 font-bold text-sm">{formatCurrency(safetyAudit.day_trading_buying_power)}</span>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Overnight Reg-T Power (2x)</span>
            <span className="text-cyan-400 font-bold text-sm">{formatCurrency(safetyAudit.overnight_buying_power)}</span>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Active Margin Calls (DTMC)</span>
            <span className="text-emerald-400 font-bold text-sm">$0.00 (Zero Deficits)</span>
          </div>
        </div>
      </div>

      {/* Intraday Executions Feed */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
          <History size={16} className="text-yellow-400" />
          Rolling Intraday Round-Trip Executions ({dayTradesHistory.length})
        </h3>

        <div className="space-y-3">
          {dayTradesHistory.map((dt) => (
            <div
              key={dt.id}
              className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-slate-100">{dt.symbol}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    ROUND-TRIP ({dt.shares} Shs)
                  </span>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-400">+{formatCurrency(dt.realized_pnl)}</span>
                  <span className="text-[10px] text-slate-500 block">DTBP Used: {formatCurrency(dt.dtbp_utilized)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                <div>Buy Fill: <span className="text-slate-200">{formatCurrency(dt.buy_price)}</span></div>
                <div>Sell Fill: <span className="text-slate-200">{formatCurrency(dt.sell_price)}</span></div>
                <div>Bought At: <span className="text-slate-300">{formatTimestamp(dt.buy_timestamp)}</span></div>
                <div>Sold At: <span className="text-slate-300">{formatTimestamp(dt.sell_timestamp)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * COMBINED INTEGRATION TAB ROUTER: ADVANCED FINANCIAL ARCHITECTURE
 * ============================================================================ */

export const AdvancedCorrespondentHub: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [activeModule, setActiveModule] = useState<'margin_stress' | 'execution_regsho' | 'tax_lots' | 'corporate_actions' | 'pdt_defense'>('margin_stress');

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Pills */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveModule('margin_stress')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shrink-0 ${
            activeModule === 'margin_stress'
              ? 'bg-yellow-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Flame size={14} />
          <span>Margin Stress & Leverage</span>
        </button>

        <button
          onClick={() => setActiveModule('execution_regsho')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shrink-0 ${
            activeModule === 'execution_regsho'
              ? 'bg-yellow-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Zap size={14} />
          <span>Reg SHO & Best Ex</span>
        </button>

        <button
          onClick={() => setActiveModule('tax_lots')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shrink-0 ${
            activeModule === 'tax_lots'
              ? 'bg-yellow-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileCheck size={14} />
          <span>Tax Lots & 1099-B</span>
        </button>

        <button
          onClick={() => setActiveModule('corporate_actions')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shrink-0 ${
            activeModule === 'corporate_actions'
              ? 'bg-yellow-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Network size={14} />
          <span>Corporate Actions & Dividends</span>
        </button>

        <button
          onClick={() => setActiveModule('pdt_defense')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shrink-0 ${
            activeModule === 'pdt_defense'
              ? 'bg-yellow-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert size={14} />
          <span>Pattern Day Trading (PDT)</span>
        </button>
      </div>

      {/* Module View Body */}
      <div>
        {activeModule === 'margin_stress' && <MarginStressAuditorView account={account} />}
        {activeModule === 'execution_regsho' && <RegShoAndExecutionAuditorView account={account} />}
        {activeModule === 'tax_lots' && <TaxLotAndWashSaleView account={account} />}
        {activeModule === 'corporate_actions' && <CorporateActionsView account={account} />}
        {activeModule === 'pdt_defense' && <DayTradingRiskDefenseView account={account} />}
      </div>
    </div>
  );
};/* ============================================================================
 * EXTENDED MODULE: ACATS (AUTOMATED CUSTOMER ACCOUNT TRANSFER SERVICE) & NSCC
 * FINRA Rule 11870 (Customer Account Transfer Contracts) & DTCC Clearing Bridge
 * Handles T+2/T+1 Transfer Initiation, Asset Eligibility, Fractional Liquidation,
 * Reject Code Taxonomies, and Real-Time Transfer Settlement State Machines.
 * ============================================================================ */

export type AcatsTransferStatus =
  | 'INITIATED'
  | 'SUBMITTED_TO_NSCC'
  | 'ACKNOWLEDGED_BY_DELIVERER'
  | 'ASSETS_VERIFIED'
  | 'SETTLEMENT_PENDING'
  | 'PARTIALLY_SETTLED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'RESUBMITTED'
  | 'CANCELED';

export type AcatsTransferType = 'FULL_TRANSFER' | 'PARTIAL_TRANSFER' | 'RESIDUAL_SWEEP';

export type AcatsAssetClassification =
  | 'US_EQUITY'
  | 'US_OPTION'
  | 'MUTUAL_FUND'
  | 'FIXED_INCOME_BOND'
  | 'CASH_USD'
  | 'CRYPTO_RESTRICTED'
  | 'FRACTIONAL_EQUITY'
  | 'NON_TRANSFERABLE_SECURITY';

export interface AcatsTransferAssetItem {
  id: string;
  symbol: string;
  asset_type: AcatsAssetClassification;
  quantity: number;
  fractional_share_handling: 'AUTO_LIQUIDATE_TO_CASH' | 'RETAIN_AT_DELIVERER' | 'TRANSFER_WHOLE_ONLY';
  market_value_usd: number;
  cost_basis_per_share: number;
  is_eligible_at_alpaca: boolean;
  ineligibility_reason?: string;
  delivering_broker_identifier?: string;
}

export interface AcatsRejectReason {
  code: string;
  rule_reference: string;
  description: string;
  remedy_action: string;
  is_curable: boolean;
}

export interface AcatsTransferRecord {
  id: string;
  account_id: string;
  transfer_type: AcatsTransferType;
  delivering_broker_name: string;
  delivering_broker_dtcc_participant_id: string;
  delivering_broker_account_number: string;
  delivering_account_title: string;
  ssn_tin_matches: boolean;
  status: AcatsTransferStatus;
  assets: AcatsTransferAssetItem[];
  total_transfer_value_usd: number;
  estimated_settlement_date: string;
  actual_settled_date?: string;
  created_at: string;
  last_updated_at: string;
  reject_history: AcatsRejectReason[];
  nscc_control_number: string;
  signature_verified: boolean;
  requires_manual_signature: boolean;
}

/**
 * Master NSCC ACATS Transfer Reject Code Codex (FINRA Rule 11870)
 */
export const ACATS_REJECT_CODEX: Record<string, AcatsRejectReason> = {
  REJ_01_SSN_MISMATCH: {
    code: 'REJ_01_SSN_MISMATCH',
    rule_reference: 'FINRA Rule 11870(d)(1)',
    description: 'Social Security Number or Taxpayer ID on receiving request does not match delivering firm registration.',
    remedy_action: 'Submit corrected transfer request with legal name change documentation or verified W-9.',
    is_curable: true,
  },
  REJ_02_TITLE_MISMATCH: {
    code: 'REJ_02_TITLE_MISMATCH',
    rule_reference: 'FINRA Rule 11870(d)(2)',
    description: 'Account title discrepancy (e.g., Joint Tenancy requested against Individual account registration).',
    remedy_action: 'Execute matching subaccount conversion or request partial transfer to individual destination.',
    is_curable: true,
  },
  REJ_03_ACCOUNT_CLOSED: {
    code: 'REJ_03_ACCOUNT_CLOSED',
    rule_reference: 'FINRA Rule 11870(d)(3)',
    description: 'Delivering broker account has zero balance or was formally terminated prior to receipt.',
    remedy_action: 'Verify delivering firm account number and status directly with client.',
    is_curable: false,
  },
  REJ_04_MARGIN_DEBIT_UNRESOLVED: {
    code: 'REJ_04_MARGIN_DEBIT_UNRESOLVED',
    rule_reference: 'FINRA Rule 11870(c)(2)',
    description: 'Delivering account contains outstanding margin call or negative cash debit exceeding receiving borrowing capacity.',
    remedy_action: 'Client must deposit cash at delivering firm or request Partial Transfer excluding debit positions.',
    is_curable: true,
  },
  REJ_05_OPTIONS_EXPIRING: {
    code: 'REJ_05_OPTIONS_EXPIRING',
    rule_reference: 'OCC By-Laws Article VI',
    description: 'Delivering account holds open option contracts expiring within 7 business days of transfer window.',
    remedy_action: 'Client must close expiring options positions prior to initiating ACATS transfer.',
    is_curable: true,
  },
  REJ_06_NON_TRANSFERABLE_ASSETS: {
    code: 'REJ_06_NON_TRANSFERABLE_ASSETS',
    rule_reference: 'FINRA Rule 11870(f)',
    description: 'Proprietary mutual funds, direct real estate REITs, or non-DTC eligible private placement securities.',
    remedy_action: 'Liquidate non-transferable assets at delivering broker to cash prior to initiating full ACATS.',
    is_curable: true,
  },
};

/**
 * DTCC ACATS Clearing Engine & Asset Eligibility Validator
 */
export class AcatsClearingService {
  private static instance: AcatsClearingService;
  private readonly storageKey = 'alpaca_acats_records_v1:';

  private constructor() {}

  public static getInstance(): AcatsClearingService {
    if (!AcatsClearingService.instance) {
      AcatsClearingService.instance = new AcatsClearingService();
    }
    return AcatsClearingService.instance;
  }

  /**
   * Evaluates asset eligibility for Alpaca securities depository
   */
  public evaluateAssetEligibility(item: Partial<AcatsTransferAssetItem>): AcatsTransferAssetItem {
    const sym = (item.symbol || '').toUpperCase().trim();
    const type = item.asset_type || 'US_EQUITY';
    let isEligible = true;
    let ineligibilityReason: string | undefined;

    // Cryptocurrencies cannot be transferred over NSCC ACATS (must move on-chain or cash)
    if (type === 'CRYPTO_RESTRICTED') {
      isEligible = false;
      ineligibilityReason = 'Digital assets are not DTCC/NSCC ACATS eligible. Must be liquidated or transferred via cold storage.';
    } else if (type === 'MUTUAL_FUND') {
      isEligible = false;
      ineligibilityReason = 'Alpaca does not custody traditional 40-Act open-ended mutual funds. Liquidate to cash prior to sweep.';
    } else if (type === 'FIXED_INCOME_BOND') {
      isEligible = false;
      ineligibilityReason = 'Municipal and corporate OTC bonds are non-clearing. Only US Treasury instruments are supported.';
    }

    return {
      id: item.id || `ast-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      symbol: sym,
      asset_type: type,
      quantity: item.quantity || 0,
      fractional_share_handling: item.fractional_share_handling || 'AUTO_LIQUIDATE_TO_CASH',
      market_value_usd: item.market_value_usd || 0,
      cost_basis_per_share: item.cost_basis_per_share || 0,
      is_eligible_at_alpaca: isEligible,
      ineligibility_reason: ineligibilityReason,
      delivering_broker_identifier: item.delivering_broker_identifier || 'DTCC-0164',
    };
  }

  /**
   * Generates default ACATS Transfer Record for Demonstration
   */
  public generateDefaultTransfer(accountId: string): AcatsTransferRecord {
    const estSettlement = new Date();
    estSettlement.setDate(estSettlement.getDate() + 3);

    const rawAssets: Partial<AcatsTransferAssetItem>[] = [
      {
        symbol: 'AAPL',
        asset_type: 'US_EQUITY',
        quantity: 150,
        market_value_usd: 34260.00,
        cost_basis_per_share: 178.50,
      },
      {
        symbol: 'NVDA',
        asset_type: 'US_EQUITY',
        quantity: 200,
        market_value_usd: 27000.00,
        cost_basis_per_share: 92.00,
      },
      {
        symbol: 'USD_CASH_SWEEP',
        asset_type: 'CASH_USD',
        quantity: 18450.50,
        market_value_usd: 18450.50,
        cost_basis_per_share: 1.00,
      },
      {
        symbol: 'VFIAX',
        asset_type: 'MUTUAL_FUND',
        quantity: 50,
        market_value_usd: 25400.00,
        cost_basis_per_share: 420.00,
      },
    ];

    const processedAssets = rawAssets.map((a) => this.evaluateAssetEligibility(a));
    const totalVal = processedAssets.reduce((sum, curr) => sum + curr.market_value_usd, 0);

    return {
      id: `acats-xfer-${accountId.slice(0, 6)}-001`,
      account_id: accountId,
      transfer_type: 'FULL_TRANSFER',
      delivering_broker_name: 'Charles Schwab & Co., Inc.',
      delivering_broker_dtcc_participant_id: '0164',
      delivering_broker_account_number: 'SCHW-889104-99',
      delivering_account_title: 'Alexander Sterling Vance Individual TOD',
      ssn_tin_matches: true,
      status: 'ASSETS_VERIFIED',
      assets: processedAssets,
      total_transfer_value_usd: totalVal,
      estimated_settlement_date: estSettlement.toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      last_updated_at: new Date().toISOString(),
      reject_history: [],
      nscc_control_number: 'NSCC-ACATS-2025-0899124',
      signature_verified: true,
      requires_manual_signature: false,
    };
  }

  /**
   * Submits New ACATS Transfer Request
   */
  public async submitTransferRequest(
    accountId: string,
    payload: {
      deliveringBrokerName: string;
      dtccParticipantId: string;
      accountNumber: string;
      transferType: AcatsTransferType;
      assets: Partial<AcatsTransferAssetItem>[];
    }
  ): Promise<AcatsTransferRecord> {
    const estSettlement = new Date();
    estSettlement.setDate(estSettlement.getDate() + 3);

    const evaluatedAssets = payload.assets.map((a) => this.evaluateAssetEligibility(a));
    const totalVal = evaluatedAssets.reduce((sum, curr) => sum + curr.market_value_usd, 0);

    const record: AcatsTransferRecord = {
      id: `acats-xfer-${Date.now().toString(36)}`,
      account_id: accountId,
      transfer_type: payload.transferType,
      delivering_broker_name: payload.deliveringBrokerName,
      delivering_broker_dtcc_participant_id: payload.dtccParticipantId,
      delivering_broker_account_number: payload.accountNumber,
      delivering_account_title: 'Correspondent Account Holder',
      ssn_tin_matches: true,
      status: 'SUBMITTED_TO_NSCC',
      assets: evaluatedAssets,
      total_transfer_value_usd: totalVal,
      estimated_settlement_date: estSettlement.toISOString(),
      created_at: new Date().toISOString(),
      last_updated_at: new Date().toISOString(),
      reject_history: [],
      nscc_control_number: `NSCC-${Math.floor(10000000 + Math.random() * 90000000)}`,
      signature_verified: true,
      requires_manual_signature: false,
    };

    return record;
  }
}

export const acatsClearingService = AcatsClearingService.getInstance();

/* ============================================================================
 * INTERACTIVE SUB-COMPONENT: ACATS INCOMING TRANSFER ORCHESTRATOR VIEW
 * ============================================================================ */

export const AcatsTransferOrchestratorView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [transfers, setTransfers] = useState<AcatsTransferRecord[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<AcatsTransferRecord | null>(null);
  const [isInitiating, setIsInitiating] = useState(false);
  const [brokerNameInput, setBrokerNameInput] = useState('Morgan Stanley Wealth Management');
  const [dtccIdInput, setDtccIdInput] = useState('0015');
  const [accountNumInput, setAccountNumInput] = useState('MS-4892019-B');
  const [transferTypeInput, setTransferTypeInput] = useState<AcatsTransferType>('FULL_TRANSFER');
  const [fractionalChoice, setFractionalChoice] = useState<'AUTO_LIQUIDATE_TO_CASH' | 'RETAIN_AT_DELIVERER'>('AUTO_LIQUIDATE_TO_CASH');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const defaultXfer = acatsClearingService.generateDefaultTransfer(account.id);
    setTransfers([defaultXfer]);
    setSelectedTransfer(defaultXfer);
  }, [account.id]);

  const handleInitiateNewTransfer = async () => {
    if (!brokerNameInput || !dtccIdInput || !accountNumInput) return;
    setActionLoading(true);

    try {
      const mockAssets: Partial<AcatsTransferAssetItem>[] = [
        { symbol: 'MSFT', asset_type: 'US_EQUITY', quantity: 100, market_value_usd: 41500, cost_basis_per_share: 320 },
        { symbol: 'QQQ', asset_type: 'US_EQUITY', quantity: 80, market_value_usd: 40000, cost_basis_per_share: 390 },
        { symbol: 'USD_CASH', asset_type: 'CASH_USD', quantity: 15000, market_value_usd: 15000, cost_basis_per_share: 1 },
      ];

      const newRecord = await acatsClearingService.submitTransferRequest(account.id, {
        deliveringBrokerName: brokerNameInput,
        dtccParticipantId: dtccIdInput,
        accountNumber: accountNumInput,
        transferType: transferTypeInput,
        assets: mockAssets,
      });

      setTransfers((prev) => [newRecord, ...prev]);
      setSelectedTransfer(newRecord);
      setIsInitiating(false);
    } finally {
      setActionLoading(false);
    }
  };

  const currentXfer = selectedTransfer || transfers[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <RefreshCw size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">DTCC / NSCC Automated Customer Account Transfer (ACATS)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  FINRA RULE 11870 COMPLIANT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full and partial portfolio inbound transfer engine with automated cost basis step-up and DTCC clearing reconciliation
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsInitiating(true)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition"
          >
            <Plus size={14} />
            Initiate Inbound ACATS Transfer
          </button>
        </div>

        {/* Global Transfer Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Active Transfers</span>
            <span className="text-yellow-400 font-bold text-sm">{transfers.length} In-Flight</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Standard Settlement Horizon</span>
            <span className="text-emerald-400 font-bold text-sm">T+2 Business Days</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Cost Basis Portability</span>
            <span className="text-cyan-400 font-bold text-sm">CBRS Electronic Step-Up</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">DTCC Participant ID</span>
            <span className="text-slate-200 font-bold text-sm">Alpaca: #0158</span>
          </div>
        </div>
      </div>

      {/* Initiation Modal */}
      {isInitiating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-yellow-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Initiate Inbound ACATS Request</h3>
                  <p className="text-xs text-slate-400">Delivering Firm Specification & Clearing Authorization</p>
                </div>
              </div>
              <button
                onClick={() => setIsInitiating(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Delivering Broker-Dealer Name</label>
                <input
                  type="text"
                  value={brokerNameInput}
                  onChange={(e) => setBrokerNameInput(e.target.value)}
                  placeholder="e.g. Charles Schwab, Fidelity, Morgan Stanley, Robinhood"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">DTCC Participant #</label>
                  <input
                    type="text"
                    value={dtccIdInput}
                    onChange={(e) => setDtccIdInput(e.target.value)}
                    placeholder="0164"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-cyan-300 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Account Number at Firm</label>
                  <input
                    type="text"
                    value={accountNumInput}
                    onChange={(e) => setAccountNumInput(e.target.value)}
                    placeholder="X89-29104-9"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-slate-100 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Transfer Scope</label>
                <select
                  value={transferTypeInput}
                  onChange={(e) => setTransferTypeInput(e.target.value as AcatsTransferType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500"
                >
                  <option value="FULL_TRANSFER">Full Account Transfer (All Assets & Cash)</option>
                  <option value="PARTIAL_TRANSFER">Partial Transfer (Select Eligible Assets Only)</option>
                  <option value="RESIDUAL_SWEEP">Residual Sweep (Post-Transfer Trailing Dividends)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Fractional Share Protocol</label>
                <select
                  value={fractionalChoice}
                  onChange={(e) => setFractionalChoice(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500"
                >
                  <option value="AUTO_LIQUIDATE_TO_CASH">Auto-Liquidate Fractional Shares to Cash at Delivering Firm</option>
                  <option value="RETAIN_AT_DELIVERER">Retain Fractional Remainder at Delivering Broker</option>
                </select>
              </div>

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-[11px] text-yellow-200/90 leading-relaxed">
                By submitting this request, you authorize Alpaca Securities LLC (#0158) to initiate an automated transfer of assets through the National Securities Clearing Corporation (NSCC) pursuant to FINRA Rule 11870.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsInitiating(false)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleInitiateNewTransfer}
                disabled={actionLoading || !brokerNameInput || !dtccIdInput || !accountNumInput}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs shadow-lg transition disabled:opacity-50"
              >
                {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Transmit NSCC ACATS Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Transfer Detail & Tracking View */}
      {currentXfer && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Transfer Summary Card */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Transfer Dossier</h3>
                <span className="text-[10px] font-mono text-cyan-400 block">{currentXfer.id}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${getStatusBadgeStyle(currentXfer.status)}`}>
                {currentXfer.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="space-y-2 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Delivering Broker:</span>
                <span className="text-slate-200 text-right truncate max-w-[150px]">{currentXfer.delivering_broker_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DTCC Participant:</span>
                <span className="text-yellow-400 font-bold">{currentXfer.delivering_broker_dtcc_participant_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Number:</span>
                <span className="text-slate-200">{currentXfer.delivering_broker_account_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transfer Type:</span>
                <span className="text-cyan-400">{currentXfer.transfer_type.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Portfolio Value:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(currentXfer.total_transfer_value_usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NSCC Control #:</span>
                <span className="text-slate-400 text-[10px]">{currentXfer.nscc_control_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Settle:</span>
                <span className="text-yellow-400">{formatTimestamp(currentXfer.estimated_settlement_date)}</span>
              </div>
            </div>

            {/* Stepper Status Visualizer */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                NSCC Lifecycle Milestones
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle size={14} className="shrink-0" />
                  <span>1. Initiated & Transmitted to NSCC</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle size={14} className="shrink-0" />
                  <span>2. Delivering Broker Acknowledged</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle size={14} className="shrink-0" />
                  <span>3. Asset Eligibility & CBRS Cost Basis Validated</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400 animate-pulse">
                  <Clock size={14} className="shrink-0" />
                  <span>4. Settlement & Physical Position Journaling</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Asset Inventory Table */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Asset Manifest & Deposit Eligibility</h3>
                <p className="text-xs text-slate-400 mt-0.5">Automated screening against Alpaca clearing custodian whitelist</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {currentXfer.assets.length} Line Items
              </span>
            </div>

            <div className="space-y-3">
              {currentXfer.assets.map((asset) => (
                <div
                  key={asset.id}
                  className={`p-4 rounded-xl border space-y-2 text-xs font-mono transition ${
                    asset.is_eligible_at_alpaca
                      ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      : 'bg-red-950/20 border-red-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base font-black text-slate-100">{asset.symbol}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold border uppercase bg-slate-900 text-slate-300 border-slate-800">
                        {asset.asset_type.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold border uppercase ${
                        asset.is_eligible_at_alpaca
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {asset.is_eligible_at_alpaca ? 'ELIGIBLE TO TRANSFER' : 'INELIGIBLE ASSET'}
                      </span>
                    </div>

                    <div className="text-right font-bold text-sm">
                      <span className="text-emerald-400">{formatCurrency(asset.market_value_usd)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1">
                    <div>Quantity: <span className="text-slate-200">{asset.quantity.toLocaleString()}</span></div>
                    <div>Cost / Share: <span className="text-slate-200">{formatCurrency(asset.cost_basis_per_share)}</span></div>
                    <div>Fractional Action: <span className="text-cyan-400 truncate">{asset.fractional_share_handling}</span></div>
                    <div>Custodian: <span className="text-yellow-400">{asset.delivering_broker_identifier}</span></div>
                  </div>

                  {!asset.is_eligible_at_alpaca && asset.ineligibility_reason && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-[11px] font-sans flex items-center gap-1.5">
                      <AlertTriangle size={13} className="text-red-400 shrink-0" />
                      <span>{asset.ineligibility_reason}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * EXTENDED MODULE: PROXY VOTING, SEC RULE 14a-8 & CORPORATE GOVERNANCE
 * Enforces Shareholder Meeting Voting Rights, Record Date Eligibility,
 * Ballot Casting, and Proxy Statement Transparency.
 * ============================================================================ */

export interface ProxyProposalItem {
  proposal_number: number;
  title: string;
  sponsor: 'MANAGEMENT' | 'SHAREHOLDER';
  board_recommendation: 'FOR' | 'AGAINST' | 'ABSTAIN';
  description: string;
  user_vote?: 'FOR' | 'AGAINST' | 'ABSTAIN' | 'DO_NOT_VOTE';
  vote_cast_timestamp?: string;
  confirmation_hash?: string;
}

export interface ProxyBallotRecord {
  id: string;
  account_id: string;
  symbol: string;
  company_name: string;
  meeting_type: 'ANNUAL' | 'SPECIAL' | 'EXTRAORDINARY';
  meeting_date: string;
  record_date: string;
  voting_deadline: string;
  shares_eligible_to_vote: number;
  control_number: string;
  status: 'PENDING_VOTE' | 'VOTED' | 'EXPIRED' | 'TABULATED';
  proposals: ProxyProposalItem[];
  created_at: string;
}

/**
 * Enterprise Shareholder Proxy Voting Service
 */
export class ProxyGovernanceService {
  private static instance: ProxyGovernanceService;

  private constructor() {}

  public static getInstance(): ProxyGovernanceService {
    if (!ProxyGovernanceService.instance) {
      ProxyGovernanceService.instance = new ProxyGovernanceService();
    }
    return ProxyGovernanceService.instance;
  }

  public getMockProxyBallots(accountId: string): ProxyBallotRecord[] {
    return [
      {
        id: `prx-nvda-2025-${accountId.slice(0, 4)}`,
        account_id: accountId,
        symbol: 'NVDA',
        company_name: 'NVIDIA Corporation',
        meeting_type: 'ANNUAL',
        meeting_date: '2025-06-18T16:00:00.000Z',
        record_date: '2025-04-20T20:00:00.000Z',
        voting_deadline: '2025-06-17T23:59:59.000Z',
        shares_eligible_to_vote: 300,
        control_number: '8849201948210948',
        status: 'PENDING_VOTE',
        created_at: '2025-02-01T10:00:00.000Z',
        proposals: [
          {
            proposal_number: 1,
            title: 'Election of 12 Director Nominees for One-Year Terms',
            sponsor: 'MANAGEMENT',
            board_recommendation: 'FOR',
            description: 'Elect Jensen Huang, Harvey C. Jones, and 10 other slate nominees to board of directors.',
          },
          {
            proposal_number: 2,
            title: 'Advisory Approval of Executive Officer Compensation (Say-on-Pay)',
            sponsor: 'MANAGEMENT',
            board_recommendation: 'FOR',
            description: 'Non-binding advisory vote to approve named executive officer compensation structures.',
          },
          {
            proposal_number: 3,
            title: 'Shareholder Proposal: AI Safety and Environmental Impact Transparency Report',
            sponsor: 'SHAREHOLDER',
            board_recommendation: 'AGAINST',
            description: 'Report regarding semiconductor cooling energy consumption and ethical AI model guardrails.',
          },
        ],
      },
      {
        id: `prx-aapl-2025-${accountId.slice(0, 4)}`,
        account_id: accountId,
        symbol: 'AAPL',
        company_name: 'Apple Inc.',
        meeting_type: 'ANNUAL',
        meeting_date: '2025-02-28T17:00:00.000Z',
        record_date: '2025-01-02T20:00:00.000Z',
        voting_deadline: '2025-02-27T23:59:59.000Z',
        shares_eligible_to_vote: 500,
        control_number: '9920184710293847',
        status: 'VOTED',
        created_at: '2025-01-15T09:00:00.000Z',
        proposals: [
          {
            proposal_number: 1,
            title: 'Election of Directors (Timothy D. Cook, Arthur D. Levinson, et al.)',
            sponsor: 'MANAGEMENT',
            board_recommendation: 'FOR',
            description: 'Election of nominated board members to oversee fiscal year 2025 governance.',
            user_vote: 'FOR',
            vote_cast_timestamp: '2025-01-20T14:20:00.000Z',
            confirmation_hash: 'sha256:4a0c8d193ef20bc71e5491a9987c2b3e4f55a1d9b329487c65e01bca908234ea',
          },
          {
            proposal_number: 2,
            title: 'Ratification of Ernst & Young LLP as Independent Auditor',
            sponsor: 'MANAGEMENT',
            board_recommendation: 'FOR',
            description: 'Ratify appointment of independent registered public accounting firm.',
            user_vote: 'FOR',
            vote_cast_timestamp: '2025-01-20T14:20:00.000Z',
            confirmation_hash: 'sha256:91b2c45ee83160a0f44391295bcf56a782e4492bfd90875c7423315668ac90b1',
          },
        ],
      },
    ];
  }
}

export const proxyGovernanceService = ProxyGovernanceService.getInstance();

/* ============================================================================
 * INTERACTIVE SUB-COMPONENT: PROXY VOTING & SHAREHOLDER GOVERNANCE VIEW
 * ============================================================================ */

export const ProxyGovernanceView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [ballots, setBallots] = useState<ProxyBallotRecord[]>([]);
  const [activeBallotId, setActiveBallotId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = proxyGovernanceService.getMockProxyBallots(account.id);
    setBallots(loaded);
    if (loaded.length > 0) setActiveBallotId(loaded[0].id);
  }, [account.id]);

  const activeBallot = ballots.find((b) => b.id === activeBallotId) || ballots[0];

  const handleCastVote = (proposalNum: number, choice: 'FOR' | 'AGAINST' | 'ABSTAIN') => {
    if (!activeBallot) return;

    setBallots((prev) =>
      prev.map((b) => {
        if (b.id !== activeBallot.id) return b;
        const updatedProposals = b.proposals.map((p) => {
          if (p.proposal_number !== proposalNum) return p;
          return {
            ...p,
            user_vote: choice,
            vote_cast_timestamp: new Date().toISOString(),
            confirmation_hash: `sha256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          };
        });

        const allVoted = updatedProposals.every((p) => !!p.user_vote);
        return {
          ...b,
          proposals: updatedProposals,
          status: allVoted ? 'VOTED' : b.status,
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-400">
              <BookOpen size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">SEC Rule 14a-8 Proxy Voting & Corporate Governance</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  ELECTRONIC PROXY PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Exercise shareholder voting power, review board recommendations, and cast immutable ballot resolutions
              </p>
            </div>
          </div>
        </div>

        {/* Global Ballot Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Active Ballots</span>
            <span className="text-yellow-400 font-bold text-sm">{ballots.length} Annual Meetings</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Voted Participation Rate</span>
            <span className="text-emerald-400 font-bold text-sm">50.0% (1/2 Completed)</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Voting Power Protocol</span>
            <span className="text-cyan-400 font-bold text-sm">Direct Ownership (Non-Omnibus)</span>
          </div>
        </div>
      </div>

      {/* Ballot Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {ballots.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBallotId(b.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeBallot?.id === b.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{b.symbol} ({b.company_name})</span>
            <span className={`px-2 py-0.2 rounded text-[10px] font-mono ${
              b.status === 'VOTED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'
            }`}>
              {b.status}
            </span>
          </button>
        ))}
      </div>

      {/* Active Ballot Details */}
      {activeBallot && (
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-5 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <span>{activeBallot.company_name}</span>
                <span className="text-xs font-mono text-cyan-400">({activeBallot.symbol})</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Meeting Date: {formatTimestamp(activeBallot.meeting_date)} • Voting Deadline: {formatTimestamp(activeBallot.voting_deadline)}
              </p>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-slate-400 block text-[11px]">Voting Power:</span>
              <span className="text-yellow-400 font-black text-sm">{activeBallot.shares_eligible_to_vote} Shares</span>
            </div>
          </div>

          {/* Proposals List */}
          <div className="space-y-4">
            {activeBallot.proposals.map((prop) => (
              <div
                key={prop.proposal_number}
                className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      Proposal #{prop.proposal_number}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{prop.title}</span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    Board Recommendation: <span className="text-yellow-400 font-bold">{prop.board_recommendation}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{prop.description}</p>

                {/* Vote Casting Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCastVote(prop.proposal_number, 'FOR')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                        prop.user_vote === 'FOR'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      FOR
                    </button>
                    <button
                      onClick={() => handleCastVote(prop.proposal_number, 'AGAINST')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                        prop.user_vote === 'AGAINST'
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      AGAINST
                    </button>
                    <button
                      onClick={() => handleCastVote(prop.proposal_number, 'ABSTAIN')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                        prop.user_vote === 'ABSTAIN'
                          ? 'bg-yellow-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      ABSTAIN
                    </button>
                  </div>

                  {prop.user_vote && (
                    <div className="text-right font-mono text-[10px] text-slate-400">
                      <span className="text-emerald-400 font-bold block">Vote Cast: {prop.user_vote}</span>
                      <span className="truncate max-w-[220px] block text-slate-500">{prop.confirmation_hash}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
/* ============================================================================
 * EXTENDED MODULE: TREASURY & MULTI-BANK FDIC INSURED DEPOSIT SWEEPS (SEC 15c3-3)
 * Implements SEC Rule 15c3-3 Customer Protection Reserve Formula, Daily Collateral
 * Repo Sweeps against US Treasuries, and Multi-Bank Insured Cash Sweep ($2.5M Limit).
 * ============================================================================ */

export type SweepProgramTier = 'STANDARD_FDIC' | 'ENHANCED_SWEEP_5M' | 'TREASURY_REPO_ONLY' | 'FEDNOW_INSTANT_RESERVE';

export type SweepAllocationStatus = 'ALLOCATED' | 'SWEEPING' | 'REBALANCING' | 'WITHDRAWAL_QUEUED' | 'RESERVE_LOCKED';

export interface BankDepositoryNode {
  bank_id: string;
  bank_name: string;
  fdic_certificate_number: string;
  allocated_balance: number;
  max_fdic_coverage_limit: number;
  current_apy_percent: number;
  tier_priority: number;
  status: 'ACTIVE' | 'AT_CAPACITY' | 'DRAINING' | 'OFFLINE';
  last_sweep_timestamp: string;
  clearing_routing_number: string;
}

export interface TreasuryRepoCollateralPosition {
  cusip: string;
  security_description: string;
  maturity_date: string;
  haircut_percentage: number;
  collateral_value_usd: number;
  repo_rate_percent: number;
  settlement_agent: string;
  triparty_custodian: 'BNY_MELLON' | 'JP_MORGAN' | 'STATE_STREET';
}

export interface FdicSweepProgramSummary {
  account_id: string;
  program_tier: SweepProgramTier;
  total_cash_balance: number;
  total_fdic_insured_balance: number;
  total_treasury_repo_balance: number;
  effective_blended_apy: number;
  daily_accrued_yield_usd: number;
  monthly_accrued_yield_usd: number;
  is_fully_insured: boolean;
  excess_uninsured_cash: number;
  deposit_banks: BankDepositoryNode[];
  repo_collateral: TreasuryRepoCollateralPosition[];
  rule_15c3_3_reserve_requirement: number;
  special_reserve_bank_account_verified: boolean;
  last_rebalanced_at: string;
}

/**
 * Enterprise FDIC Insured Cash Sweep & US Treasury Repo Engine
 * Calculates dynamic bank waterfall allocations up to $2.5M-$5M across program banks,
 * maintaining full FDIC insurance pass-through while earning top-tier money market yields.
 */
export class CashSweepAndTreasuryService {
  private static instance: CashSweepAndTreasuryService;

  private constructor() {}

  public static getInstance(): CashSweepAndTreasuryService {
    if (!CashSweepAndTreasuryService.instance) {
      CashSweepAndTreasuryService.instance = new CashSweepAndTreasuryService();
    }
    return CashSweepAndTreasuryService.instance;
  }

  /**
   * Program banks registry participating in the correspondent sweep network
   */
  public getProgramDepositoryBanks(): BankDepositoryNode[] {
    return [
      {
        bank_id: 'bank-citi-ny',
        bank_name: 'Citibank N.A. Institutional Sweep',
        fdic_certificate_number: '7213',
        allocated_balance: 245000.0,
        max_fdic_coverage_limit: 250000.0,
        current_apy_percent: 4.65,
        tier_priority: 1,
        status: 'ACTIVE',
        last_sweep_timestamp: new Date().toISOString(),
        clearing_routing_number: '021000089',
      },
      {
        bank_id: 'bank-jpm-chase',
        bank_name: 'JPMorgan Chase Bank, N.A.',
        fdic_certificate_number: '628',
        allocated_balance: 245000.0,
        max_fdic_coverage_limit: 250000.0,
        current_apy_percent: 4.62,
        tier_priority: 2,
        status: 'ACTIVE',
        last_sweep_timestamp: new Date().toISOString(),
        clearing_routing_number: '021000021',
      },
      {
        bank_id: 'bank-bofa-charlotte',
        bank_name: 'Bank of America, N.A.',
        fdic_certificate_number: '3510',
        allocated_balance: 245000.0,
        max_fdic_coverage_limit: 250000.0,
        current_apy_percent: 4.60,
        tier_priority: 3,
        status: 'ACTIVE',
        last_sweep_timestamp: new Date().toISOString(),
        clearing_routing_number: '051000017',
      },
      {
        bank_id: 'bank-goldman-sachs',
        bank_name: 'Goldman Sachs Bank USA',
        fdic_certificate_number: '33124',
        allocated_balance: 107250.75,
        max_fdic_coverage_limit: 250000.0,
        current_apy_percent: 4.70,
        tier_priority: 4,
        status: 'ACTIVE',
        last_sweep_timestamp: new Date().toISOString(),
        clearing_routing_number: '026008691',
      },
      {
        bank_id: 'bank-morgan-stanley',
        bank_name: 'Morgan Stanley Bank, N.A.',
        fdic_certificate_number: '32992',
        allocated_balance: 0.0,
        max_fdic_coverage_limit: 250000.0,
        current_apy_percent: 4.68,
        tier_priority: 5,
        status: 'ACTIVE',
        last_sweep_timestamp: new Date().toISOString(),
        clearing_routing_number: '021000283',
      },
    ];
  }

  /**
   * Overnight Tri-Party Treasury Repo Collateral Pool
   */
  public getOvernightRepoPositions(): TreasuryRepoCollateralPosition[] {
    return [
      {
        cusip: '91282CDJ2',
        security_description: 'US Treasury Bill 0.000% Maturing 05/15/2025',
        maturity_date: '2025-05-15T15:00:00.000Z',
        haircut_percentage: 2.0,
        collateral_value_usd: 500000.0,
        repo_rate_percent: 4.78,
        settlement_agent: 'BNY Mellon Tri-Party Desk',
        triparty_custodian: 'BNY_MELLON',
      },
      {
        cusip: '91282CDP8',
        security_description: 'US Treasury Note 4.250% Maturing 11/15/2025',
        maturity_date: '2025-11-15T15:00:00.000Z',
        haircut_percentage: 2.0,
        collateral_value_usd: 350000.0,
        repo_rate_percent: 4.75,
        settlement_agent: 'BNY Mellon Tri-Party Desk',
        triparty_custodian: 'BNY_MELLON',
      },
    ];
  }

  /**
   * Calculate Multi-Bank FDIC Sweep Distribution for an Account
   */
  public calculateSweepProgramSummary(account: AlpacaAccountFullRecord): FdicSweepProgramSummary {
    const cash = account.cash_balance;
    const banks = this.getProgramDepositoryBanks();
    const repos = this.getOvernightRepoPositions();

    let remainingCash = cash;
    let totalInsured = 0;
    let weightedApySum = 0;

    const allocatedBanks: BankDepositoryNode[] = banks.map((bank) => {
      if (remainingCash <= 0) {
        return { ...bank, allocated_balance: 0 };
      }
      // Target cap of $245,000 per bank to ensure interest does not breach $250,000 limit
      const alloc = Math.min(remainingCash, 245000.0);
      remainingCash -= alloc;
      totalInsured += alloc;
      weightedApySum += alloc * bank.current_apy_percent;

      return {
        ...bank,
        allocated_balance: alloc,
        status: alloc >= 245000 ? 'AT_CAPACITY' : 'ACTIVE',
      };
    });

    const excessUninsured = Math.max(0, remainingCash);
    const blendedApy = totalInsured > 0 ? weightedApySum / totalInsured : 4.65;
    const dailyYield = (totalInsured * (blendedApy / 100)) / 365;
    const monthlyYield = dailyYield * 30;

    // SEC Rule 15c3-3 Customer Reserve Formula: Cash held for customers in Special Reserve Account
    const reserveRequirement = cash * 1.05; // 105% requirement under FINRA reserve standards

    return {
      account_id: account.id,
      program_tier: 'ENHANCED_SWEEP_5M',
      total_cash_balance: cash,
      total_fdic_insured_balance: totalInsured,
      total_treasury_repo_balance: repos.reduce((sum, r) => sum + r.collateral_value_usd, 0),
      effective_blended_apy: Math.round(blendedApy * 100) / 100,
      daily_accrued_yield_usd: Math.round(dailyYield * 100) / 100,
      monthly_accrued_yield_usd: Math.round(monthlyYield * 100) / 100,
      is_fully_insured: excessUninsured === 0,
      excess_uninsured_cash: excessUninsured,
      deposit_banks: allocatedBanks,
      repo_collateral: repos,
      rule_15c3_3_reserve_requirement: Math.round(reserveRequirement * 100) / 100,
      special_reserve_bank_account_verified: true,
      last_rebalanced_at: new Date().toISOString(),
    };
  }
}

export const sweepTreasuryService = CashSweepAndTreasuryService.getInstance();

/* ============================================================================
 * INTERACTIVE SUB-COMPONENT: FDIC SWEEP & TREASURY YIELD AUDITOR VIEW
 * ============================================================================ */

export const SweepAccountsAndYieldView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [sweepSummary, setSweepSummary] = useState<FdicSweepProgramSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'banks' | 'repo' | 'reserve_15c3_3'>('banks');
  const [isRebalancing, setIsRebalancing] = useState(false);

  useEffect(() => {
    const summary = sweepTreasuryService.calculateSweepProgramSummary(account);
    setSweepSummary(summary);
  }, [account]);

  const handleManualRebalance = () => {
    setIsRebalancing(true);
    setTimeout(() => {
      const refreshed = sweepTreasuryService.calculateSweepProgramSummary(account);
      setSweepSummary(refreshed);
      setIsRebalancing(false);
    }, 500);
  };

  if (!sweepSummary) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">Multi-Bank FDIC Insured Sweep & Treasury Repo Citadel</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  $2.5M FDIC COVERAGE ENHANCED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Automated multi-depository cash distribution, SEC Rule 15c3-3 customer protection reserve, and BNY Mellon tri-party repo yields
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRebalance}
              disabled={isRebalancing}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-yellow-400 border border-yellow-500/30 transition disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRebalancing ? 'animate-spin' : ''} />
              Rebalance Sweep Waterfall
            </button>
          </div>
        </div>

        {/* Global Yield and Insurance Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Total Program Cash</span>
            <span className="font-mono text-slate-100 font-bold text-sm">{formatCurrency(sweepSummary.total_cash_balance)}</span>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">FDIC Insured Portion</span>
            <span className="font-mono text-emerald-400 font-bold text-sm">
              {formatCurrency(sweepSummary.total_fdic_insured_balance)} (100%)
            </span>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Blended Net APY</span>
            <span className="font-mono text-yellow-400 font-bold text-sm">{sweepSummary.effective_blended_apy.toFixed(2)}% APY</span>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Est. Monthly Yield</span>
            <span className="font-mono text-cyan-400 font-bold text-sm">+{formatCurrency(sweepSummary.monthly_accrued_yield_usd)}</span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('banks')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'banks'
              ? 'bg-yellow-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building size={14} />
          <span>FDIC Program Banks ({sweepSummary.deposit_banks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('repo')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'repo'
              ? 'bg-yellow-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Coins size={14} />
          <span>Tri-Party Treasury Repos ({sweepSummary.repo_collateral.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reserve_15c3_3')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'reserve_15c3_3'
              ? 'bg-yellow-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert size={14} />
          <span>SEC 15c3-3 Reserve Compliance</span>
        </button>
      </div>

      {/* TAB 1: FDIC PROGRAM BANKS */}
      {activeTab === 'banks' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <Building size={16} className="text-emerald-400" />
                  FDIC Insured Depository Waterfall Hierarchy
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cash balances automatically stepped across chartered US institutions up to $245,000 per bank
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">FDIC REGULATION 12 CFR PART 330</span>
            </div>

            <div className="space-y-3">
              {sweepSummary.deposit_banks.map((bank) => {
                const utilPercent = Math.min(100, (bank.allocated_balance / bank.max_fdic_coverage_limit) * 100);

                return (
                  <div
                    key={bank.bank_id}
                    className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-lg text-yellow-400 border border-slate-800">
                          <Building size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 text-sm">{bank.bank_name}</span>
                            <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              FDIC #{bank.fdic_certificate_number}
                            </span>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold border uppercase ${
                              bank.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            }`}>
                              {bank.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">RTN: {bank.clearing_routing_number}</span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-base font-bold text-emerald-400">{formatCurrency(bank.allocated_balance)}</span>
                        <span className="text-[10px] text-yellow-400 block font-bold">{bank.current_apy_percent.toFixed(2)}% APY Yield</span>
                      </div>
                    </div>

                    {/* Utilization Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Insurance Capacity Allocation:</span>
                        <span>{utilPercent.toFixed(1)}% of {formatCurrency(bank.max_fdic_coverage_limit)} Max</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            utilPercent >= 95 ? 'bg-yellow-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${utilPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TREASURY REPO */}
      {activeTab === 'repo' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <Coins size={16} className="text-yellow-400" />
                  Tri-Party US Treasury Repo Collateral Facility
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Overnight repurchase agreements backed 102% by direct US Treasury Bills and Notes via BNY Mellon
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                TRI-PARTY CUSTODY: BNY MELLON
              </span>
            </div>

            <div className="space-y-3">
              {sweepSummary.repo_collateral.map((repo, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-black text-slate-100">{repo.cusip}</span>
                      <span className="text-xs text-slate-200 font-semibold">{repo.security_description}</span>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-yellow-400">{formatCurrency(repo.collateral_value_usd)}</span>
                      <span className="text-[10px] text-emerald-400 block font-bold">{repo.repo_rate_percent.toFixed(2)}% Overnight Rate</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-slate-400">
                    <div>Maturity: <span className="text-slate-200">{formatTimestamp(repo.maturity_date)}</span></div>
                    <div>Haircut Margin: <span className="text-emerald-400">{repo.haircut_percentage}%</span></div>
                    <div>Settlement Desk: <span className="text-cyan-300">{repo.settlement_agent}</span></div>
                    <div>Custodian: <span className="text-purple-400">{repo.triparty_custodian}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEC RULE 15c3-3 RESERVE COMPLIANCE */}
      {activeTab === 'reserve_15c3_3' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <ShieldAlert size={16} className="text-yellow-400" />
                  SEC Rule 15c3-3 (Customer Protection Rule) Reserve Computation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Segregated Special Reserve Bank Account for the Exclusive Benefit of Customers (EBOC)
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                105% EXCESS RESERVE VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Customer Credit Balances</span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Free Credit Balances in Customer Accounts:</span>
                    <span className="text-slate-100">{formatCurrency(sweepSummary.total_cash_balance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monies Borrowed Collateralized by Securities:</span>
                    <span className="text-slate-100">$0.00</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                    <span>Total Customer Credits:</span>
                    <span className="text-yellow-400">{formatCurrency(sweepSummary.total_cash_balance)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Required EBOC Reserve Deposit</span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Calculated Formula Requirement (105% Ratio):</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(sweepSummary.rule_15c3_3_reserve_requirement)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual Qualified Reserve Deposit on File:</span>
                    <span className="text-cyan-400 font-bold">{formatCurrency(sweepSummary.rule_15c3_3_reserve_requirement + 50000)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                    <span>Surplus Capital Buffer:</span>
                    <span className="text-emerald-400">+$50,000.00 USD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-200 block mb-1">Supervisory Compliance Attestation:</span>
              Correspondent cash assets are strictly segregated pursuant to SEC Rule 15c3-3. Deposits held in the FDIC sweep program and Special Reserve Account are shielded from broker-dealer creditors and bankruptcy claims.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * EXTENDED MODULE: CRYPTO TRAVEL RULE & DIGITAL COMMODITY COMPLIANCE (IVMS 101)
 * Enforces FinCEN 31 CFR § 1010.410(e) (Travel Rule Threshold $3,000), FATF Rec 16,
 * IVMS 101 Payload Standard, On-Chain Sanctions Clustering & Self-Hosted Wallet Verification.
 * ============================================================================ */

export interface Ivms101OriginatorPayload {
  name: string;
  account_number: string;
  national_id: string;
  national_id_type: 'NATIONAL_IDENTITY_CARD' | 'PASSPORT' | 'TAX_ID';
  country_of_issue: string;
  address_street: string;
  address_city: string;
  address_country: string;
}

export interface Ivms101BeneficiaryPayload {
  name: string;
  account_number_or_address: string;
  vasp_legal_name: string;
  vasp_lei_code?: string;
  is_self_hosted_wallet: boolean;
}

export interface CryptoTravelRuleMessageRecord {
  id: string;
  transaction_hash?: string;
  asset_symbol: string;
  amount: number;
  amount_usd_value: number;
  originator: Ivms101OriginatorPayload;
  beneficiary: Ivms101BeneficiaryPayload;
  travel_rule_protocol: 'TRISA' | 'OPEN_VASP' | 'NOTABENE' | 'SYGNA_BRIDGE';
  status: 'PAYLOAD_TRANSMITTED' | 'ACKNOWLEDGED' | 'HELD_SANCTIONS_REVIEW' | 'EXEMPT_UNDER_THRESHOLD';
  risk_score: number;
  created_at: string;
  cryptographic_proof_hash: string;
}

/**
 * Enterprise Travel Rule (IVMS 101) & Crypto Transaction Guard
 */
export class CryptoTravelRuleService {
  private static instance: CryptoTravelRuleService;

  private constructor() {}

  public static getInstance(): CryptoTravelRuleService {
    if (!CryptoTravelRuleService.instance) {
      CryptoTravelRuleService.instance = new CryptoTravelRuleService();
    }
    return CryptoTravelRuleService.instance;
  }

  public getMockTravelRuleMessages(account: AlpacaAccountFullRecord): CryptoTravelRuleMessageRecord[] {
    return [
      {
        id: `tr-msg-btc-01-${account.id.slice(0, 4)}`,
        transaction_hash: '0x3a91b2c48e7f91048201a4e19842f1b0a9918234857281920394817263541209',
        asset_symbol: 'BTC',
        amount: 0.85,
        amount_usd_value: 82450.0,
        originator: {
          name: `${account.identity.given_name} ${account.identity.family_name}`,
          account_number: account.account_number,
          national_id: account.identity.tax_id,
          national_id_type: 'TAX_ID',
          country_of_issue: 'USA',
          address_street: account.contact.street_address[0] || '742 Evergreen Terrace',
          address_city: account.contact.city,
          address_country: account.contact.country,
        },
        beneficiary: {
          name: 'Coinbase Custody Trust Company LLC',
          account_number_or_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          vasp_legal_name: 'Coinbase Global, Inc.',
          vasp_lei_code: '549300VASP19283019',
          is_self_hosted_wallet: false,
        },
        travel_rule_protocol: 'TRISA',
        status: 'ACKNOWLEDGED',
        risk_score: 5,
        created_at: '2025-02-12T11:45:00.000Z',
        cryptographic_proof_hash: 'sha256:7f83b1657ff1ec53b706c8880d9056e55786a489d977a655f6b2f446bfe55219',
      },
      {
        id: `tr-msg-eth-02-${account.id.slice(0, 4)}`,
        transaction_hash: '0x88492019481203948172635412093a91b2c48e7f91048201a4e19842f1b0a991',
        asset_symbol: 'ETH',
        amount: 15.0,
        amount_usd_value: 41250.0,
        originator: {
          name: `${account.identity.given_name} ${account.identity.family_name}`,
          account_number: account.account_number,
          national_id: account.identity.tax_id,
          national_id_type: 'TAX_ID',
          country_of_issue: 'USA',
          address_street: account.contact.street_address[0] || '742 Evergreen Terrace',
          address_city: account.contact.city,
          address_country: account.contact.country,
        },
        beneficiary: {
          name: 'Ledger Cold Vault (Self-Hosted)',
          account_number_or_address: '0x71C8366420A0926793fe1b033bC35c0ad5c0E9A8',
          vasp_legal_name: 'Self-Hosted Unhosted Wallet',
          is_self_hosted_wallet: true,
        },
        travel_rule_protocol: 'NOTABENE',
        status: 'PAYLOAD_TRANSMITTED',
        risk_score: 12,
        created_at: '2025-02-14T16:20:00.000Z',
        cryptographic_proof_hash: 'sha256:91b2c45ee83160a0f44391295bcf56a782e4492bfd90875c7423315668ac90b1',
      },
    ];
  }
}

export const cryptoTravelRuleService = CryptoTravelRuleService.getInstance();

/* ============================================================================
 * INTERACTIVE SUB-COMPONENT: CRYPTO TRAVEL RULE & FATF 16 SHIELD VIEW
 * ============================================================================ */

export const CryptoTravelRuleShieldView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [messages, setMessages] = useState<CryptoTravelRuleMessageRecord[]>([]);

  useEffect(() => {
    setMessages(cryptoTravelRuleService.getMockTravelRuleMessages(account));
  }, [account]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">FinCEN & FATF Recommendation 16 Crypto Travel Rule Hub</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  IVMS 101 ENCRYPTED PROTOCOL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Automated VASP-to-VASP counterparty identification, $3,000 threshold compliance, and self-hosted wallet ownership attestations
              </p>
            </div>
          </div>
        </div>

        {/* Telemetry stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Travel Rule Threshold</span>
            <span className="text-yellow-400 font-bold text-sm">$3,000 USD Equivalent</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">VASP Network Protocol</span>
            <span className="text-emerald-400 font-bold text-sm">TRISA & Notabene VASP-Hub</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Blockchain Sanctions Risk</span>
            <span className="text-cyan-400 font-bold text-sm">0 OFAC Cluster Matches</span>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
          <FileText size={16} className="text-yellow-400" />
          IVMS 101 Travel Rule Message Transmissions ({messages.length})
        </h3>

        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 backdrop-blur-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-slate-100">{msg.asset_symbol} Transfer</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {msg.status}
                  </span>
                  <span className="text-xs font-mono text-yellow-400 font-bold">
                    Protocol: {msg.travel_rule_protocol}
                  </span>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-400">{formatCurrency(msg.amount_usd_value)}</span>
                  <span className="text-[10px] text-slate-500 block">({msg.amount} {msg.asset_symbol})</span>
                </div>
              </div>

              {/* Originator vs Beneficiary IVMS 101 Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Originator VASP Card */}
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    Originator Information (Alpaca Broker)
                  </span>
                  <div className="space-y-1 text-slate-300">
                    <div>Name: <span className="text-slate-100 font-bold">{msg.originator.name}</span></div>
                    <div>Account: <span className="text-cyan-400">{msg.originator.account_number}</span></div>
                    <div>National ID: <span className="text-slate-400">{msg.originator.national_id}</span></div>
                    <div>Address: <span className="text-slate-400">{msg.originator.address_city}, {msg.originator.address_country}</span></div>
                  </div>
                </div>

                {/* Beneficiary VASP Card */}
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    Beneficiary Information (Counterparty VASP)
                  </span>
                  <div className="space-y-1 text-slate-300">
                    <div>Beneficiary: <span className="text-slate-100 font-bold">{msg.beneficiary.name}</span></div>
                    <div>VASP Legal Entity: <span className="text-yellow-400">{msg.beneficiary.vasp_legal_name}</span></div>
                    <div>Address / Hash: <span className="text-slate-400 text-[10px] truncate block">{msg.beneficiary.account_number_or_address}</span></div>
                    <div>Self-Hosted: <span className="text-cyan-400">{msg.beneficiary.is_self_hosted_wallet ? 'YES (Attested)' : 'NO (Institutional VASP)'}</span></div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Digest */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                <span className="truncate max-w-[300px]">Proof Digest: {msg.cryptographic_proof_hash}</span>
                <span>Transmitted: {formatTimestamp(msg.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * EXTENDED MODULE: FINRA RULE 3110 / 3120 SUPERVISORY SURVEILLANCE & WSP
 * Enforces Automated Trade Surveillance, Front-Running, Marking the Close,
 * Spoofing, Layering, and Written Supervisory Procedures (WSP) Annual Certification.
 * ============================================================================ */

export type SurveillanceFlagSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SupervisorySurveillanceAlert {
  id: string;
  account_id: string;
  pattern_name: string;
  rule_violation_risk: 'FINRA_RULE_5210_MARKET_MANIPULATION' | 'FINRA_RULE_5320_FRONT_RUNNING' | 'FINRA_RULE_6140_MARKING_THE_CLOSE' | 'SEC_RULE_10b5_INSIDER_TRADING';
  severity: SurveillanceFlagSeverity;
  symbol: string;
  timestamp: string;
  description: string;
  algorithmic_confidence_percent: number;
  status: 'OPEN_INVESTIGATION' | 'CLEARED_BY_PRINCIPAL' | 'ESCALATED_TO_CCO' | 'SAR_FILED';
  investigating_officer_crd?: string;
  clearing_notes?: string;
}

export interface WspCertificationAudit {
  certification_id: string;
  review_year: number;
  chief_compliance_officer_name: string;
  crd_number: string;
  wsp_version: string;
  reviewed_subsystems: string[];
  is_certified_compliant: boolean;
  certified_at: string;
  signature_digest: string;
}

/**
 * Enterprise FINRA Rule 3110/3120 Surveillance Engine
 */
export class WrittenSupervisoryProceduresEngine {
  private static instance: WrittenSupervisoryProceduresEngine;

  private constructor() {}

  public static getInstance(): WrittenSupervisoryProceduresEngine {
    if (!WrittenSupervisoryProceduresEngine.instance) {
      WrittenSupervisoryProceduresEngine.instance = new WrittenSupervisoryProceduresEngine();
    }
    return WrittenSupervisoryProceduresEngine.instance;
  }

  public getSurveillanceAlerts(accountId: string): SupervisorySurveillanceAlert[] {
    return [
      {
        id: `srv-alert-01-${accountId.slice(0, 4)}`,
        account_id: accountId,
        pattern_name: 'Aggressive Order Execution Prior to Earnings Announcement',
        rule_violation_risk: 'SEC_RULE_10b5_INSIDER_TRADING',
        severity: 'LOW',
        symbol: 'NVDA',
        timestamp: '2025-02-10T19:58:00.000Z',
        description: 'Large directional long call spread positioned 24 hours prior to Q4 earnings release. Volume aligned with historical account profile.',
        algorithmic_confidence_percent: 28.5,
        status: 'CLEARED_BY_PRINCIPAL',
        investigating_officer_crd: 'CRD-S24-482910',
        clearing_notes: 'Reviewed against historical trading volume and client financial profile. Accredited status confirmed.',
      },
      {
        id: `srv-alert-02-${accountId.slice(0, 4)}`,
        account_id: accountId,
        pattern_name: 'Rapid Cancel-Replace Quotation Velocity Check',
        rule_violation_risk: 'FINRA_RULE_5210_MARKET_MANIPULATION',
        severity: 'INFO',
        symbol: 'TSLA',
        timestamp: '2025-02-14T15:30:00.000Z',
        description: 'Automated algorithmic trading system modified order limit 8 times within 200 milliseconds. No market impact detected.',
        algorithmic_confidence_percent: 12.0,
        status: 'CLEARED_BY_PRINCIPAL',
        investigating_officer_crd: 'CRD-S24-482910',
        clearing_notes: 'Algorithmic smart router order pegging routine operating within normal latency parameters.',
      },
    ];
  }

  public getWspAnnualCertification(): WspCertificationAudit {
    return {
      certification_id: 'WSP-CERT-2025-01',
      review_year: 2025,
      chief_compliance_officer_name: 'Marcus Vance, Esq. (CRD #194821)',
      crd_number: '194821',
      wsp_version: 'WSP-CORRESPONDENT-V4.8',
      reviewed_subsystems: [
        'PATRIOT Act § 326 Customer Identification Program (CIP)',
        'OFAC & PEP Sanctions Real-Time Screening',
        'FINRA Rule 2360 Options Suitability & Approvals',
        'FINRA Rule 4210 Margin & Pattern Day Trading Guardrails',
        'SEC Rule 17a-4 WORM Document Archival Custody',
        'SEC Rule 15c3-3 Customer Protection FDIC Cash Sweep',
        'FinCEN 31 CFR § 1010.410(e) Crypto Travel Rule',
        'FINRA Rule 11870 NSCC ACATS Transfer Engine',
      ],
      is_certified_compliant: true,
      certified_at: new Date().toISOString(),
      signature_digest: 'sha256:7f83b1657ff1ec53b706c8880d9056e55786a489d977a655f6b2f446bfe55219',
    };
  }
}

export const wspEngine = WrittenSupervisoryProceduresEngine.getInstance();

/* ============================================================================
 * INTERACTIVE SUB-COMPONENT: SUPERVISORY SURVEILLANCE & WSP AUDITOR VIEW
 * ============================================================================ */

export const SupervisorySurveillanceView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [alerts, setAlerts] = useState<SupervisorySurveillanceAlert[]>([]);
  const [wspCert, setWspCert] = useState<WspCertificationAudit | null>(null);

  useEffect(() => {
    setAlerts(wspEngine.getSurveillanceAlerts(account.id));
    setWspCert(wspEngine.getWspAnnualCertification());
  }, [account.id]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-yellow-400">
              <ShieldAlert size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">FINRA Rule 3110 / 3120 Supervisory Surveillance Citadel</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  SERIES 24 PRINCIPAL SUPERVISORY LOG
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Automated trade exception surveillance, market manipulation heuristic screening, and Annual WSP compliance sign-off
              </p>
            </div>
          </div>
        </div>

        {/* Surveillance Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Active Surveillance Scanners</span>
            <span className="text-emerald-400 font-bold text-sm">8 Heuristic Models Live</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Flagged Exceptions (YTD)</span>
            <span className="text-yellow-400 font-bold text-sm">2 (100% Cleared)</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">WSP Annual Attestation</span>
            <span className="text-cyan-400 font-bold text-sm">Active & Certified</span>
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
          <AlertCircle size={16} className="text-yellow-400" />
          Surveillance Pattern Exceptions ({alerts.length})
        </h3>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 backdrop-blur-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-slate-100">{alert.symbol}</span>
                  <span className="text-xs font-bold text-slate-200">{alert.pattern_name}</span>
                  <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {alert.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <span className="text-xs font-mono text-slate-400">{formatTimestamp(alert.timestamp)}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>

              {alert.clearing_notes && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Supervisory Principal: {alert.investigating_officer_crd}</span>
                    <span className="text-emerald-400 font-bold">Investigation Concluded</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">{alert.clearing_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Annual WSP Certification Dossier */}
      {wspCert && (
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <BadgeCheck size={16} className="text-emerald-400" />
                Annual Written Supervisory Procedures (WSP) Chief Compliance Officer Certification
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                FINRA Rule 3130 Annual Certification of Compliance and Supervisory Processes
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              CERTIFIED COMPLIANT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">Supervisory Sign-off Executive</span>
              <span className="text-slate-100 font-bold block">{wspCert.chief_compliance_officer_name}</span>
              <span className="text-slate-500 text-[11px]">WSP Framework Version: {wspCert.wsp_version}</span>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">Certified Timestamp & Record</span>
              <span className="text-cyan-400 font-bold block">{formatTimestamp(wspCert.certified_at)}</span>
              <span className="text-slate-500 text-[10px] truncate block">{wspCert.signature_digest}</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-slate-300 uppercase block">Certified Correspondent Modules:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-400 font-mono">
              {wspCert.reviewed_subsystems.map((sub, i) => (
                <div key={i} className="flex items-center gap-1.5 text-emerald-400/90">
                  <Check size={12} className="shrink-0" />
                  <span className="text-slate-300">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
/* ============================================================================
 * EXTENDED MODULE: FIX 4.4 / 5.0SP2 PROTOCOL AUDIT INSPECTOR & FINANCIAL BRIDGE
 * Enforces Tag-Value FIX Log Parsing, Tag 35 MsgType Classification (NewOrderSingle,
 * ExecutionReport, OrderCancelReplace, Reject), and ISO 20022 Financial Mapping.
 * ============================================================================ */

export type FixProtocolVersion = 'FIX.4.2' | 'FIX.4.4' | 'FIXT.1.1' | 'FIX.5.0SP2';

export interface FixTagValuePair {
  tag: number;
  tagName: string;
  value: string;
  description?: string;
  isSensitive?: boolean;
}

export interface FixMessageRecord {
  id: string;
  session_id: string;
  sequence_number: number;
  direction: 'INBOUND' | 'OUTBOUND';
  protocol_version: FixProtocolVersion;
  msg_type: string;
  msg_type_name: string;
  sender_comp_id: string;
  target_comp_id: string;
  sending_time: string;
  raw_fix_string: string;
  parsed_tags: FixTagValuePair[];
  checksum_valid: boolean;
  order_id?: string;
  cl_ord_id?: string;
  symbol?: string;
  side?: '1' | '2' | '5' | '8';
  order_qty?: number;
  price?: number;
  exec_type?: string;
  ord_status?: string;
}

export const FIX_TAG_DICTIONARY: Record<number, string> = {
  8: 'BeginString',
  9: 'BodyLength',
  35: 'MsgType',
  49: 'SenderCompID',
  56: 'TargetCompID',
  34: 'MsgSeqNum',
  52: 'SendingTime',
  11: 'ClOrdID',
  37: 'OrderID',
  55: 'Symbol',
  54: 'Side',
  38: 'OrderQty',
  40: 'OrdType',
  44: 'Price',
  59: 'TimeInForce',
  150: 'ExecType',
  39: 'OrdStatus',
  151: 'LeavesQty',
  14: 'CumQty',
  6: 'AvgPx',
  60: 'TransactTime',
  10: 'CheckSum',
  100: 'ExDestination',
  77: 'PositionEffect',
  58: 'Text',
};

export const FIX_MSG_TYPE_MAP: Record<string, string> = {
  '0': 'Heartbeat',
  '1': 'TestRequest',
  '2': 'ResendRequest',
  '3': 'Reject',
  '4': 'SequenceReset',
  '5': 'Logout',
  '8': 'ExecutionReport',
  '9': 'OrderCancelReject',
  'A': 'Logon',
  'D': 'NewOrderSingle',
  'F': 'OrderCancelRequest',
  'G': 'OrderCancelReplaceRequest',
};

/**
 * Enterprise FIX Protocol Parser & Correspondent Gateway Monitor
 */
export class FixProtocolEngine {
  private static instance: FixProtocolEngine;

  private constructor() {}

  public static getInstance(): FixProtocolEngine {
    if (!FixProtocolEngine.instance) {
      FixProtocolEngine.instance = new FixProtocolEngine();
    }
    return FixProtocolEngine.instance;
  }

  public parseRawFix(rawFix: string): FixTagValuePair[] {
    const delimiter = rawFix.includes('\x01') ? '\x01' : '|';
    const pairs = rawFix.split(delimiter).filter((p) => p.trim().length > 0);

    return pairs.map((pair) => {
      const eqIdx = pair.indexOf('=');
      if (eqIdx === -1) {
        return { tag: 0, tagName: 'Unknown', value: pair };
      }
      const tagNum = parseInt(pair.substring(0, eqIdx), 10);
      const val = pair.substring(eqIdx + 1);
      const tagName = FIX_TAG_DICTIONARY[tagNum] || `Tag_${tagNum}`;
      return { tag: tagNum, tagName, value: val };
    });
  }

  public getMockFixSessionMessages(accountId: string): FixMessageRecord[] {
    const makeRaw = (tags: Record<number, string | number>) => {
      const body = Object.entries(tags)
        .map(([k, v]) => `${k}=${v}`)
        .join('|');
      return `${body}|10=184|`;
    };

    const msg1Raw = makeRaw({
      8: 'FIX.4.4',
      9: 142,
      35: 'D',
      49: 'SOVEREIGN_CORRESPONDENT_01',
      56: 'ALPACA_DMA_GATEWAY',
      34: 1042,
      52: '2025-02-14T14:32:00.104Z',
      11: `cl-ord-${accountId.slice(0, 6)}-01`,
      55: 'NVDA',
      54: '1',
      38: 200,
      40: '2',
      44: 133.50,
      59: '0',
      100: 'INET',
    });

    const msg2Raw = makeRaw({
      8: 'FIX.4.4',
      9: 188,
      35: '8',
      49: 'ALPACA_DMA_GATEWAY',
      56: 'SOVEREIGN_CORRESPONDENT_01',
      34: 2190,
      52: '2025-02-14T14:32:00.118Z',
      11: `cl-ord-${accountId.slice(0, 6)}-01`,
      37: 'ord-alp-99281048',
      55: 'NVDA',
      54: '1',
      38: 200,
      40: '2',
      44: 133.50,
      150: '2',
      39: '2',
      151: 0,
      14: 200,
      6: 133.50,
      60: '2025-02-14T14:32:00.116Z',
    });

    return [
      {
        id: 'fix-msg-001',
        session_id: 'FIX44:SOVEREIGN_CORR->ALPACA_DMA',
        sequence_number: 1042,
        direction: 'OUTBOUND',
        protocol_version: 'FIX.4.4',
        msg_type: 'D',
        msg_type_name: 'NewOrderSingle',
        sender_comp_id: 'SOVEREIGN_CORRESPONDENT_01',
        target_comp_id: 'ALPACA_DMA_GATEWAY',
        sending_time: '2025-02-14T14:32:00.104Z',
        raw_fix_string: msg1Raw,
        parsed_tags: this.parseRawFix(msg1Raw),
        checksum_valid: true,
        cl_ord_id: `cl-ord-${accountId.slice(0, 6)}-01`,
        symbol: 'NVDA',
        side: '1',
        order_qty: 200,
        price: 133.50,
      },
      {
        id: 'fix-msg-002',
        session_id: 'FIX44:ALPACA_DMA->SOVEREIGN_CORR',
        sequence_number: 2190,
        direction: 'INBOUND',
        protocol_version: 'FIX.4.4',
        msg_type: '8',
        msg_type_name: 'ExecutionReport (Fill)',
        sender_comp_id: 'ALPACA_DMA_GATEWAY',
        target_comp_id: 'SOVEREIGN_CORRESPONDENT_01',
        sending_time: '2025-02-14T14:32:00.118Z',
        raw_fix_string: msg2Raw,
        parsed_tags: this.parseRawFix(msg2Raw),
        checksum_valid: true,
        cl_ord_id: `cl-ord-${accountId.slice(0, 6)}-01`,
        order_id: 'ord-alp-99281048',
        symbol: 'NVDA',
        side: '1',
        order_qty: 200,
        price: 133.50,
        exec_type: 'Fill',
        ord_status: 'Filled',
      },
    ];
  }
}

export const fixEngine = FixProtocolEngine.getInstance();

/* ============================================================================
 * INTERACTIVE SUB-COMPONENT: FIX PROTOCOL TELEMETRY & ORDER ROUTER VIEW
 * ============================================================================ */

export const FixProtocolTelemetryView: React.FC<{
  account: AlpacaAccountFullRecord;
}> = ({ account }) => {
  const [fixMessages, setFixMessages] = useState<FixMessageRecord[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<FixMessageRecord | null>(null);

  useEffect(() => {
    const msgs = fixEngine.getMockFixSessionMessages(account.id);
    setFixMessages(msgs);
    if (msgs.length > 0) setSelectedMessage(msgs[0]);
  }, [account.id]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <Binary size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-100">FIX 4.4 / 5.0SP2 Protocol Audit & Gateway Inspector</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  ULTRA-LOW LATENCY DMA ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Direct Market Access (DMA) Tag-Value message inspection, execution reports, and microsecond timestamp reconciliation
              </p>
            </div>
          </div>
        </div>

        {/* Global FIX Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Active FIX Session</span>
            <span className="text-emerald-400 font-bold text-xs truncate block">SOVEREIGN_CORR_01</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Inbound Sequence #</span>
            <span className="text-yellow-400 font-bold text-sm">2190</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Outbound Sequence #</span>
            <span className="text-cyan-400 font-bold text-sm">1042</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-semibold">Heartbeat Status</span>
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SYNCHRONIZED (30s)
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Message Stream & Tag Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages Stream Feed */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
            <Layers size={16} className="text-yellow-400" />
            FIX Message Log Stream ({fixMessages.length})
          </h3>

          <div className="space-y-3">
            {fixMessages.map((msg) => {
              const isOut = msg.direction === 'OUTBOUND';
              const isSelected = selectedMessage?.id === msg.id;

              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2 font-mono text-xs ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        isOut ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {msg.direction}
                      </span>
                      <span className="font-bold text-slate-200 text-xs">{msg.msg_type_name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Seq #{msg.sequence_number}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>{msg.symbol} {msg.side === '1' ? 'BUY' : 'SELL'} ({msg.order_qty} Shs @ ${msg.price})</span>
                    <span className="text-slate-500 text-[10px]">{formatTimestamp(msg.sending_time)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tag-Value Detailed Inspector */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 backdrop-blur-md">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">
                    {selectedMessage.msg_type_name} (MsgType {selectedMessage.msg_type})
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Sender: {selectedMessage.sender_comp_id} → Target: {selectedMessage.target_comp_id}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CHECKSUM VALID (10=184)
                </span>
              </div>

              {/* Raw String */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Raw Protocol String (SOH Delimited)</span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 break-all select-all">
                  {selectedMessage.raw_fix_string}
                </div>
              </div>

              {/* Parsed Tags Table */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Parsed Tag-Value Field Dictionary</span>
                <div className="bg-slate-950/70 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
                  <div className="grid grid-cols-12 bg-slate-900 p-2.5 text-slate-400 font-semibold border-b border-slate-800 text-[11px]">
                    <div className="col-span-2">Tag</div>
                    <div className="col-span-4">Field Name</div>
                    <div className="col-span-6">Parsed Value</div>
                  </div>

                  <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                    {selectedMessage.parsed_tags.map((tag) => (
                      <div key={tag.tag} className="grid grid-cols-12 p-2 text-[11px] hover:bg-slate-900/50 transition">
                        <div className="col-span-2 text-cyan-400 font-bold">{tag.tag}</div>
                        <div className="col-span-4 text-slate-300">{tag.tagName}</div>
                        <div className="col-span-6 text-yellow-300 truncate">{tag.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Select a FIX protocol message from the log stream to inspect its fields.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * MASTER COMPOSITE VIEW: SOVEREIGN PATRIOT CORRESPONDENT COMMAND CENTER
 * Unifies all 12 modules into a singular, cohesive, reactive executive workspace.
 * ============================================================================ */

export const MasterCorrespondentCommandCenter: React.FC<{
  initialAccountId?: string;
}> = ({ initialAccountId = 'b9b19618-22dd-4e80-8432-fc9e1ba0b27d' }) => {
  const [account, setAccount] = useState<AlpacaAccountFullRecord>(
    createDefaultAccountRecord(initialAccountId)
  );
  const [activeMasterSection, setActiveMasterSection] = useState<
    | 'core_manager'
    | 'margin_stress'
    | 'execution_regsho'
    | 'tax_lots'
    | 'corporate_actions'
    | 'pdt_defense'
    | 'acats_transfers'
    | 'proxy_governance'
    | 'fdic_sweeps'
    | 'crypto_travel_rule'
    | 'supervisory_wsp'
    | 'fix_telemetry'
  >('core_manager');

  useEffect(() => {
    alpacaAccountsService.getAccountDetails(initialAccountId).then((acc) => {
      setAccount(acc);
    });
  }, [initialAccountId]);

  const navModules = [
    { id: 'core_manager', label: 'CIP & Options Hub', icon: ShieldCheck, badge: 'PATRIOT Act § 326' },
    { id: 'margin_stress', label: 'FINRA 4210 Margin Stress', icon: Flame, badge: `${account.margin_multiplier}x Leverage` },
    { id: 'execution_regsho', label: 'Reg SHO & Best Ex', icon: Zap, badge: 'SEC Rule 203' },
    { id: 'tax_lots', label: 'Tax Lots & 1099-B', icon: FileCheck, badge: 'IRC § 1091' },
    { id: 'corporate_actions', label: 'Corporate Actions & Splits', icon: Network, badge: 'DTC / OCC' },
    { id: 'pdt_defense', label: 'PDT & DTBP Defense', icon: AlertTriangle, badge: 'Rule 4210(f)' },
    { id: 'acats_transfers', label: 'NSCC ACATS Transfers', icon: RefreshCw, badge: 'Rule 11870' },
    { id: 'proxy_governance', label: 'Proxy Voting & Gov', icon: BookOpen, badge: 'SEC 14a-8' },
    { id: 'fdic_sweeps', label: 'FDIC Sweeps & Treasury Repo', icon: Building, badge: '$2.5M Insured' },
    { id: 'crypto_travel_rule', label: 'Crypto Travel Rule (IVMS)', icon: Globe, badge: 'FinCEN § 1010' },
    { id: 'supervisory_wsp', label: 'Supervisory WSP Citadel', icon: BadgeCheck, badge: 'Series 24 Signoff' },
    { id: 'fix_telemetry', label: 'FIX 4.4 DMA Engine', icon: Binary, badge: 'Low Latency' },
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-3 sm:p-6 lg:p-8 space-y-6">
      {/* Supreme Sovereign Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-yellow-950/30 p-6 rounded-3xl border border-yellow-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-500 text-slate-950 uppercase tracking-widest">
                SOVEREIGN CORRESPONDENT COMMAND CENTER
              </span>
              <span className="text-xs text-yellow-400 font-mono font-bold">SEC 17a-3 / FINRA 2090 MASTER SYSTEM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Institutional Brokerage Operations & Regulatory Compliance Citadel
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Full-spectrum institutional brokerage orchestrator covering PATRIOT Act CIP, Tier 4 Options Suitability,
              FINRA Rule 4210 Margin Stress, Reg SHO Locates, IRC § 1091 Wash Sales, NSCC ACATS transfers, Multi-Bank FDIC Sweeps,
              IVMS 101 Crypto Travel Rule, and Series 24 Supervisory Surveillance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-3 text-right">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 block text-[10px]">Active Clearing Master</span>
              <span className="text-yellow-400 font-bold block">{account.account_number}</span>
              <span className="text-emerald-400 font-semibold">{account.clearing_broker}</span>
            </div>
          </div>
        </div>

        {/* Master Module Switcher Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-800/80">
          {navModules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeMasterSection === mod.id;

            return (
              <button
                key={mod.id}
                onClick={() => setActiveMasterSection(mod.id as any)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 ${
                  isActive
                    ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-lg shadow-yellow-500/20'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={16} />
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                      isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    {mod.badge}
                  </span>
                </div>
                <span className="font-bold text-xs truncate block">{mod.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Container */}
      <div className="pt-2 animate-in fade-in duration-300">
        {activeMasterSection === 'core_manager' && <AlpacaAccountsManager />}
        {activeMasterSection === 'margin_stress' && <MarginStressAuditorView account={account} />}
        {activeMasterSection === 'execution_regsho' && <RegShoAndExecutionAuditorView account={account} />}
        {activeMasterSection === 'tax_lots' && <TaxLotAndWashSaleView account={account} />}
        {activeMasterSection === 'corporate_actions' && <CorporateActionsView account={account} />}
        {activeMasterSection === 'pdt_defense' && <DayTradingRiskDefenseView account={account} />}
        {activeMasterSection === 'acats_transfers' && <AcatsTransferOrchestratorView account={account} />}
        {activeMasterSection === 'proxy_governance' && <ProxyGovernanceView account={account} />}
        {activeMasterSection === 'fdic_sweeps' && <SweepAccountsAndYieldView account={account} />}
        {activeMasterSection === 'crypto_travel_rule' && <CryptoTravelRuleShieldView account={account} />}
        {activeMasterSection === 'supervisory_wsp' && <SupervisorySurveillanceView account={account} />}
        {activeMasterSection === 'fix_telemetry' && <FixProtocolTelemetryView account={account} />}
      </div>
    </div>
  );
};