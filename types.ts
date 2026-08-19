import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}/**
 * ==============================================================================
 * SECTION 3: EXECUTIVE MAGAZINE & MULTIMEDIA CREATION TYPES
 * ==============================================================================
 * Types governing the generation, layout, rendering, and narration of high-end
 * digital publications, executive lookbooks, and AI-driven multimedia assets.
 */

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
  'Wall Street Boardroom',
  'Silicon Valley Tech Campus',
  'Dubai Skyscraper Penthouse',
  'Paris Fashion Week Front Row',
  'Private Island Villa',
  'Luxury Private Jet',
  'Monaco Yacht Deck',
  'Swiss Alps Davos Summit'
];

export const STYLES = [
  'Power Suit (Classic Bespoke)',
  'Tech Mogul (Minimalist Luxury)',
  'Black Tie Gala (Formal)',
  'Avant-Garde Executive (Bold)',
  'Old Money (Quiet Luxury)',
  'Streetwear CEO (High-End Casual)'
];

export type RenderingEngine = 'stable-diffusion' | 'midjourney' | 'dall-e-3' | 'flux' | 'imagen' | 'custom-gan';

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
  lighting?: string;
  cameraAngle?: string;
  colorPalette?: string[];
  historicalReference?: string;
  brandTags?: string[];
}

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  videoUrl?: string;
  isAnimating?: boolean;
  audioUrl?: string;
  narrationText?: string;
  renderingEngine?: RenderingEngine;
  promptUsed?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  seed?: number;
  cfgScale?: number;
  steps?: number;
  generationTimeMs?: number;
  error?: string;
}

export interface Asset {
  id: string;
  base64: string;
  desc: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  body: string;
  elements: VisualElement[];
}

export interface VisualElement {
  id: string;
  type: 'image' | 'seal' | 'divider' | 'illustration' | 'scenery';
  src: string;
  position: { x: number; y: number };
  alt: string;
  isAnimated?: boolean;
  scale?: number;
  rotation?: number;
}

export enum AIServiceAction {
  REWRITE = 'REWRITE',
  ILLUMINATE = 'ILLUMINATE',
  PROPHESY = 'PROPHESY',
  SEAL = 'SEAL',
  CIPHER = 'CIPHER',
  SCENERY = 'SCENERY',
  ENCHANT = 'ENCHANT'
}

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Ariel' | 'Oberon' | 'Titania';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  sampleRateHz?: number;
  languageCode?: string;
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
  audioUrl?: string;
  durationMs?: number;
  characterCount: number;
}

/**
 * ==============================================================================
 * SECTION 4: NEWS, FEEDS & SENTIMENT ANALYSIS TYPES
 * ==============================================================================
 * Structures governing real-time financial news aggregation, sentiment analysis,
 * urgency scoring, and AI-driven market insights.
 */

export enum StaticCategory {
  TOP_STORIES = 'Global Pulse',
  POLITICS = 'Governance',
  TECH = 'Infrastructure',
  FINANCE = 'Markets',
  CRYPTO = 'Decentralized Ledger',
  ENERGY = 'Thermodynamics',
  BIOTECH = 'Genomics',
  SPACE = 'Orbital Mechanics'
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: number; // Scale of 1-10
  tags: string[];
  author?: string;
  content?: string;
  imageUrl?: string;
  sentimentScore?: number; // Continuous value from -1.0 to 1.0
  relevanceScore?: number; // Continuous value from 0.0 to 1.0
  language?: string;
  isFactChecked?: boolean;
  factCheckDetails?: string;
  biasRating?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  relatedTickers?: string[];
}

export interface FeedPage {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  lastUpdated: string;
  aiInsights: string;
  curatorId?: string;
  isPublic: boolean;
  subscriberCount?: number;
  customFilterCriteria?: FilterCriterion[];
}

/**
 * ==============================================================================
 * SECTION 5: FILE SYSTEM, STORAGE & CLOUD MANAGEMENT TYPES
 * ==============================================================================
 * Types governing local and cloud file systems, indexing, AI-assisted summaries,
 * and multi-source repository exploration.
 */

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  GENERIC = 'generic',
  CODE = 'code',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  DATABASE = 'database',
  MODEL_3D = 'model_3d'
}

export type FileSource = 'local' | 'github' | 'ai' | 'google-drive' | 'aws-s3' | 'ipfs' | 'dropbox';

export interface FileVersion {
  versionId: string;
  modifiedBy: string;
  modifiedAt: string;
  size: number;
  changeLog?: string;
  downloadUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string | null;
  source: FileSource;
  extension?: string;
  mimeType?: string;
  content?: string; // Text, DataURL, or Download URL
  aiSummary?: string;
  aiKeywords?: string[];
  isIndexing?: boolean;
  githubRepo?: string;
  githubOwner?: string;
  githubUrl?: string;
  driveFileId?: string;
  isCloudFolder?: boolean;
  ownerId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  versionHistory?: FileVersion[];
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  hash?: string;
  tags?: string[];
}

export interface NavigationState {
  currentPath: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid' | 'gallery' | 'tree' | 'kanban';
  sortBy: 'name' | 'size' | 'lastModified' | 'type';
  sortDirection: 'asc' | 'desc';
  searchQuery?: string;
  filterType?: FileType | 'all';
}

/**
 * ==============================================================================
 * SECTION 6: CORE BANKING, TRANSACTIONS & CAPITAL ALLOCATION TYPES
 * ==============================================================================
 * Foundational types for personal and corporate banking, ledger accounts,
 * transaction processing, and AI-driven financial planning.
 */

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'fedwire' | 'rtp';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'credit' | 'debit';

export type TransactionStatus =
  | 'POSTED'
  | 'PENDING'
  | 'Initiated'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'needs_approval'
  | 'approved'
  | 'denied'
  | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string | string[];
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: KeyValuePairs;
  pending?: boolean;
  reconciled?: boolean;
  reconciliation_id?: string;
  nexus_link_id?: string;
  institution_origin?: string;
  cardId?: string;
  holderName?: string;
  merchant?: string;
  status?: TransactionStatus;
  timestamp?: string;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string;
  assetClass?: string;
  riskLevel?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining?: number;
  category?: string;
  alerts?: Alert[];
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
  credits: number;
}

export interface AIPlanStep {
  title: string;
  description: string;
  timeline: string;
  category?: string;
}

export interface AIPlan {
  title: string;
  summary: string;
  steps: AIPlanStep[];
}

export type IllusionType = 'none' | 'aurora' | 'blue' | 'dark';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  institutionId?: string;
  type?: string;
  balance?: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: string;
}

export enum WeaverStage {
  Pitch = 'pitch',
  Analysis = 'analysis',
  Test = 'test',
  FinalReview = 'final_review',
  Approved = 'approved',
  Results = 'results',
  Error = 'error'
}

export interface QuantumWeaverState {
  stage: WeaverStage;
  businessPlan: string;
  feedback: string;
  questions: AIQuestion[];
  loanAmount: number;
  coachingPlan: AIPlan | null;
  error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  aiJustification?: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress?: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCardControls {
  atm: boolean;
  contactless: boolean;
  online: boolean;
  monthlyLimit: number;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: CorporateCardControls;
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description?: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Counterparty {
  id: string;
  name: string;
  email?: string | null;
  send_remittance_advice?: boolean;
  type?: 'business' | 'individual';
  riskLevel?: 'Low' | 'Medium' | 'High';
  createdDate?: string;
  accounts: ExternalAccount[];
  virtualAccounts: VirtualAccount[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name?: string;
  verification_status?: string;
  account_details?: any[];
  routing_details?: any[];
}

export interface VirtualAccount {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  balance?: number;
  currency?: string;
  status?: string;
  subAccounts?: VirtualAccount[];
  description?: string;
  counterparty_id?: string;
  internal_account_id?: string;
  debit_ledger_account_id?: string;
  credit_ledger_account_id?: string;
  metadata?: any;
  account_details?: any[];
  routing_details?: any[];
}

export interface AIGoalPlanStep {
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Investing' | 'Income' | string;
}

export interface AIGoalPlan {
  feasibilitySummary: string;
  monthlyContribution: number;
  steps: AIGoalPlanStep[];
  actionableSteps?: string[];
  summary?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'recurring';
}

export interface RecurringContribution {
  id: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface LinkedGoal {
  id: string;
  relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
  triggerAmount?: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  iconName: string;
  plan: AIGoalPlan | null;
  startDate: string;
  riskProfile?: RiskProfile;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  linkedGoals: LinkedGoal[];
  recurringContributions: RecurringContribution[];
  contributions: Contribution[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number; // in reward points
  type: 'cashback' | 'giftcard' | 'impact' | string;
  description: string;
  iconName: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini' | string;

export interface APIStatus {
  provider: APIProvider;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number; // in ms
}

export interface CreditFactor {
  name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix' | string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}
/**
 * ==============================================================================
 * SECTION 3: EXECUTIVE MAGAZINE & MULTIMEDIA CREATION TYPES
 * ==============================================================================
 * Types governing the generation, layout, rendering, and narration of high-end
 * digital publications, executive lookbooks, and AI-driven multimedia assets.
 */

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
  'Wall Street Boardroom',
  'Silicon Valley Tech Campus',
  'Dubai Skyscraper Penthouse',
  'Paris Fashion Week Front Row',
  'Private Island Villa',
  'Luxury Private Jet',
  'Monaco Yacht Deck',
  'Swiss Alps Davos Summit'
];

export const STYLES = [
  'Power Suit (Classic Bespoke)',
  'Tech Mogul (Minimalist Luxury)',
  'Black Tie Gala (Formal)',
  'Avant-Garde Executive (Bold)',
  'Old Money (Quiet Luxury)',
  'Streetwear CEO (High-End Casual)'
];

export type RenderingEngine = 'stable-diffusion' | 'midjourney' | 'dall-e-3' | 'flux' | 'imagen' | 'custom-gan';

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
  lighting?: string;
  cameraAngle?: string;
  colorPalette?: string[];
  historicalReference?: string;
  brandTags?: string[];
}

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  videoUrl?: string;
  isAnimating?: boolean;
  audioUrl?: string;
  narrationText?: string;
  renderingEngine?: RenderingEngine;
  promptUsed?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  seed?: number;
  cfgScale?: number;
  steps?: number;
  generationTimeMs?: number;
  error?: string;
}

export interface Asset {
  id: string;
  base64: string;
  desc: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  body: string;
  elements: VisualElement[];
}

export interface VisualElement {
  id: string;
  type: 'image' | 'seal' | 'divider' | 'illustration' | 'scenery';
  src: string;
  position: { x: number; y: number };
  alt: string;
  isAnimated?: boolean;
  scale?: number;
  rotation?: number;
}

export enum AIServiceAction {
  REWRITE = 'REWRITE',
  ILLUMINATE = 'ILLUMINATE',
  PROPHESY = 'PROPHESY',
  SEAL = 'SEAL',
  CIPHER = 'CIPHER',
  SCENERY = 'SCENERY',
  ENCHANT = 'ENCHANT'
}

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Ariel' | 'Oberon' | 'Titania';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  sampleRateHz?: number;
  languageCode?: string;
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
  audioUrl?: string;
  durationMs?: number;
  characterCount: number;
}

/**
 * ==============================================================================
 * SECTION 4: NEWS, FEEDS & SENTIMENT ANALYSIS TYPES
 * ==============================================================================
 * Structures governing real-time financial news aggregation, sentiment analysis,
 * urgency scoring, and AI-driven market insights.
 */

export enum StaticCategory {
  TOP_STORIES = 'Global Pulse',
  POLITICS = 'Governance',
  TECH = 'Infrastructure',
  FINANCE = 'Markets',
  CRYPTO = 'Decentralized Ledger',
  ENERGY = 'Thermodynamics',
  BIOTECH = 'Genomics',
  SPACE = 'Orbital Mechanics'
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: number; // Scale of 1-10
  tags: string[];
  author?: string;
  content?: string;
  imageUrl?: string;
  sentimentScore?: number; // Continuous value from -1.0 to 1.0
  relevanceScore?: number; // Continuous value from 0.0 to 1.0
  language?: string;
  isFactChecked?: boolean;
  factCheckDetails?: string;
  biasRating?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  relatedTickers?: string[];
}

export interface FeedPage {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  lastUpdated: string;
  aiInsights: string;
  curatorId?: string;
  isPublic: boolean;
  subscriberCount?: number;
  customFilterCriteria?: FilterCriterion[];
}

/**
 * ==============================================================================
 * SECTION 5: FILE SYSTEM, STORAGE & CLOUD MANAGEMENT TYPES
 * ==============================================================================
 * Types governing local and cloud file systems, indexing, AI-assisted summaries,
 * and multi-source repository exploration.
 */

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  GENERIC = 'generic',
  CODE = 'code',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  DATABASE = 'database',
  MODEL_3D = 'model_3d'
}

export type FileSource = 'local' | 'github' | 'ai' | 'google-drive' | 'aws-s3' | 'ipfs' | 'dropbox';

export interface FileVersion {
  versionId: string;
  modifiedBy: string;
  modifiedAt: string;
  size: number;
  changeLog?: string;
  downloadUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string | null;
  source: FileSource;
  extension?: string;
  mimeType?: string;
  content?: string; // Text, DataURL, or Download URL
  aiSummary?: string;
  aiKeywords?: string[];
  isIndexing?: boolean;
  githubRepo?: string;
  githubOwner?: string;
  githubUrl?: string;
  driveFileId?: string;
  isCloudFolder?: boolean;
  ownerId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  versionHistory?: FileVersion[];
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  hash?: string;
  tags?: string[];
}

export interface NavigationState {
  currentPath: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid' | 'gallery' | 'tree' | 'kanban';
  sortBy: 'name' | 'size' | 'lastModified' | 'type';
  sortDirection: 'asc' | 'desc';
  searchQuery?: string;
  filterType?: FileType | 'all';
}

/**
 * ==============================================================================
 * SECTION 6: CORE BANKING, TRANSACTIONS & CAPITAL ALLOCATION TYPES
 * ==============================================================================
 * Foundational types for personal and corporate banking, ledger accounts,
 * transaction processing, and AI-driven financial planning.
 */

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'fedwire' | 'rtp';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'credit' | 'debit';

export type TransactionStatus =
  | 'POSTED'
  | 'PENDING'
  | 'Initiated'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'needs_approval'
  | 'approved'
  | 'denied'
  | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string | string[];
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: KeyValuePairs;
  pending?: boolean;
  reconciled?: boolean;
  reconciliation_id?: string;
  nexus_link_id?: string;
  institution_origin?: string;
  cardId?: string;
  holderName?: string;
  merchant?: string;
  status?: TransactionStatus;
  timestamp?: string;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string;
  assetClass?: string;
  riskLevel?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining?: number;
  category?: string;
  alerts?: Alert[];
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
  credits: number;
}

export interface AIPlanStep {
  title: string;
  description: string;
  timeline: string;
  category?: string;
}

export interface AIPlan {
  title: string;
  summary: string;
  steps: AIPlanStep[];
}

export type IllusionType = 'none' | 'aurora' | 'blue' | 'dark';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  institutionId?: string;
  type?: string;
  balance?: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: string;
}

export enum WeaverStage {
  Pitch = 'pitch',
  Analysis = 'analysis',
  Test = 'test',
  FinalReview = 'final_review',
  Approved = 'approved',
  Results = 'results',
  Error = 'error'
}

export interface QuantumWeaverState {
  stage: WeaverStage;
  businessPlan: string;
  feedback: string;
  questions: AIQuestion[];
  loanAmount: number;
  coachingPlan: AIPlan | null;
  error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  aiJustification?: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress?: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCardControls {
  atm: boolean;
  contactless: boolean;
  online: boolean;
  monthlyLimit: number;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: CorporateCardControls;
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description?: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Counterparty {
  id: string;
  name: string;
  email?: string | null;
  send_remittance_advice?: boolean;
  type?: 'business' | 'individual';
  riskLevel?: 'Low' | 'Medium' | 'High';
  createdDate?: string;
  accounts: ExternalAccount[];
  virtualAccounts: VirtualAccount[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name?: string;
  verification_status?: string;
  account_details?: any[];
  routing_details?: any[];
}

export interface VirtualAccount {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  balance?: number;
  currency?: string;
  status?: string;
  subAccounts?: VirtualAccount[];
  description?: string;
  counterparty_id?: string;
  internal_account_id?: string;
  debit_ledger_account_id?: string;
  credit_ledger_account_id?: string;
  metadata?: any;
  account_details?: any[];
  routing_details?: any[];
}

export interface AIGoalPlanStep {
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Investing' | 'Income' | string;
}

export interface AIGoalPlan {
  feasibilitySummary: string;
  monthlyContribution: number;
  steps: AIGoalPlanStep[];
  actionableSteps?: string[];
  summary?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'recurring';
}

export interface RecurringContribution {
  id: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface LinkedGoal {
  id: string;
  relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
  triggerAmount?: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  iconName: string;
  plan: AIGoalPlan | null;
  startDate: string;
  riskProfile?: RiskProfile;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  linkedGoals: LinkedGoal[];
  recurringContributions: RecurringContribution[];
  contributions: Contribution[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number; // in reward points
  type: 'cashback' | 'giftcard' | 'impact' | string;
  description: string;
  iconName: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini' | string;

export interface APIStatus {
  provider: APIProvider;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number; // in ms
}

export interface CreditFactor {
  name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix' | string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}/**
 * ==============================================================================
 * SECTION 7: PLAID, MARQETA, MODERN TREASURY & OPEN BANKING INTEGRATION TYPES
 * ==============================================================================
 * Enterprise-grade types governing secure connections, credential management,
 * card issuance, ledgering, and multi-node financial mesh protocols.
 */

export interface PlaidCredentials {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

export interface MarqetaCredentials {
  app_token?: string;
  admin_token?: string;
  applicationToken?: string;
  adminAccessToken?: string;
  base_url?: string;
}

export interface ModernTreasuryCredentials {
  apiKey: string;
  orgId?: string;
  organizationId?: string;
}

export interface PlaidTokenState {
  linkToken: string | null;
  publicToken: string | null;
  accessToken: string | null;
}

export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: AccountBalance;
  institution?: string;
}

export interface ConnectedItem {
  institutionId: string;
  institutionName: string;
  accessToken: string;
  itemId: string;
  accounts: Account[];
  transactions: Transaction[];
  metadata: {
    linked_at: string;
    node_priority: number;
    mesh_protocol: 'NEXUS-V3' | string;
    routing_hops: string[];
  };
}

export interface UCCFiling {
  id: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Filed' | 'Rejected';
  receiptId?: string;
  fileNumber?: string;
  packetNum: string;
  transType: 'Initial' | 'Amendment';
  amount: number;
  dateCreated: string;
  xmlPayload: string;
  errors?: string[];
}

export interface UnifiedPayload {
  timestamp: string;
  nexus_version: string;
  nexus_id: string;
  global_metadata: {
    client_context: string;
    reconciliation_depth: number;
    combined_hash: string;
  };
  mesh_stats: {
    total_liquidity: number;
    total_liabilities: number;
    net_position: number;
    active_institutions: number;
  };
  cross_institutional_ledger: {
    items: ConnectedItem[];
    reconciled_pairs: any[];
  };
  compliance: {
    active_ucc_filings: UCCFiling[];
  };
}

export enum FlowStep {
  CREDENTIALS = 'CREDENTIALS',
  LINK_TOKEN = 'LINK_TOKEN',
  LINK_UI = 'LINK_UI',
  EXCHANGE = 'EXCHANGE',
  DASHBOARD = 'DASHBOARD',
  UCC_CENTER = 'UCC_CENTER',
  MARQETA_NODE = 'MARQETA_NODE',
  MODERN_TREASURY_NODE = 'MODERN_TREASURY_NODE',
  TAXONOMY_REGISTRY = 'TAXONOMY_REGISTRY'
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  created_time?: string;
  start_date?: string;
  config: any;
}

export interface MarqetaCard {
  token: string;
  user_token: string;
  card_product_token: string;
  last_four: string;
  pan: string;
  expiration: string;
  cvv: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | string;
}

export interface MTLedger {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, string>;
}

export interface MTInternalAccount {
  id: string;
  name: string;
  currency: string;
  connection: { vendor_name: string };
  status: string;
}

export interface PlaidLinkSuccessMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id?: string;
}

export type PlaidProduct =
  | 'assets'
  | 'auth'
  | 'balance'
  | 'identity'
  | 'investments'
  | 'liabilities'
  | 'payment_initiation'
  | 'transactions';

export interface MarqetaUser {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  last_modified_time: string;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns?: string;
  };
  provider?: any;
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface LedgerAccount {
  id: string;
  name: string;
  balances: {
    available_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
    posted_balance: { amount: number; currency: string };
  };
}

export interface SettlementInstruction {
  messageId: string;
  creationDateTime: string;
  numberOfTransactions: number;
  settlementDate: string;
  totalAmount: number;
  currency: string;
  purpose?: string;
}

/**
 * ==============================================================================
 * SECTION 8: ENTERPRISE OPERATIONS, CORPORATE COMMAND, COMPLIANCE & ISO 20022
 * ==============================================================================
 * Types governing corporate command centers, compliance audits, anomaly detection,
 * cash flow forecasting, and ISO 20022 financial messaging standards.
 */

export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore?: number;
  recommendedAction?: string;
}

export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

export interface FraudRule {
  id: string;
  name: string;
  description?: string;
  severity: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
}

export interface ComplianceCase {
  id: string;
  reason: string;
  entityType: string;
  entityId: string;
  status: 'open' | 'closed' | 'investigating' | string;
  openedDate: string;
  type?: string;
  description?: string;
}

export interface FinancialAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: AnomalyStatus;
  entityType: string;
  entityId: string;
  entityDescription: string;
  timestamp: string;
  riskScore: number;
}

export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'False Positive';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  action: 'flag_for_review' | 'block' | 'notify_admin' | string;
  active: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  revenue: number;
  growth: number;
  riskScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetResource: string;
  success: boolean;
  details?: string;
  metadata?: any;
  ipAddress?: string;
}

export interface ThreatAlert {
  alertId: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataSharingPolicy {
  policyId: string;
  policyName: string;
  scope: string;
  isActive: boolean;
  lastReviewed: string;
}

export interface APIKey {
  id: string;
  keyName: string;
  creationDate: string;
  scopes: string[];
  lastUsed?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  verified: boolean;
}

export interface SecurityAwarenessModule {
  moduleId: string;
  title: string;
  completionRate: number;
}

export interface TransactionRule {
  ruleId: string;
  name: string;
  triggerCondition: string;
  action: string;
  isEnabled: boolean;
}

export interface SecurityScoreMetric {
  metricName: string;
  currentValue: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  lastActivity: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  permissions: string[];
  status: string;
  firstSeen: string;
  userAgent: string;
  pushNotificationsEnabled: boolean;
  biometricAuthEnabled: boolean;
  encryptionStatus: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  timestamp: string;
  isCurrent: boolean;
  userAgent: string;
}

export interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password?: string;
  databaseName: string;
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full';
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface WebDriverStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  activeTask: string | null;
  logs: string[];
}

export interface ExternalCorporateActionEventType1Code {}
export interface ExternalAcceptedReason1Code {}
export interface ExternalAccountIdentification1Code {}
export interface ExternalAgentInstruction1Code {}
export interface ExternalAgreementType1Code {}
export interface ExternalAuthenticationChannel1Code {}
export interface ExternalAuthenticationMethod1Code {}
export interface ExternalAuthorityExchangeReason1Code {}
export interface ExternalAuthorityIdentification1Code {}
export interface ExternalBalanceSubType1Code {}
export interface ExternalBalanceType1Code {}
export interface ExternalBankTransactionDomain1Code {}
export interface ExternalBankTransactionFamily1Code {}
export interface ExternalBankTransactionSubFamily1Code {}
export interface ExternalBenchmarkCurveName1Code {}
export interface ExternalBillingBalanceType1Code {}
export interface ExternalBillingCompensationType1Code {}
export interface ExternalBillingRateIdentification1Code {}
export interface ExternalCalculationAgent1Code {}
export interface ExternalCancellationReason1Code {}
export interface ExternalCardTransactionCategory1Code {}
export interface ExternalCashAccountType1Code {}
export interface ExternalCashClearingSystem1Code {}
export interface ExternalCategoryPurpose1Code {}
export interface ExternalChannel1Code {}
export interface ExternalChargeType1Code {}
export interface ExternalChequeAgentInstruction1Code {}
export interface ExternalChequeCancellationReason1Code {}
export interface ExternalChequeCancellationStatus1Code {}
export interface ExternalClaimNonReceiptRejection1Code {}
export interface ExternalClearingSystemIdentification1Code {}
export interface ExternalCollateralReferenceDataStatusReason1Code {}
export interface ExternalCommunicationFormat1Code {}
export interface ExternalContractBalanceType1Code {}
export interface ExternalContractClosureReason1Code {}
export interface ExternalCreditLineType1Code {}
export interface ExternalCreditorAgentInstruction1Code {}
export interface ExternalCreditorEnrolmentAmendmentReason1Code {}
export interface ExternalCreditorEnrolmentCancellationReason1Code {}
export interface ExternalCreditorEnrolmentStatusReason1Code {}
export interface ExternalCreditorReferenceType1Code {}
export interface ExternalDateFrequency1Code {}
export interface ExternalDateType1Code {}
export interface ExternalDebtorActivationAmendmentReason1Code {}
export interface ExternalDebtorActivationCancellationReason1Code {}
export interface ExternalDebtorActivationStatusReason1Code {}
export interface ExternalDebtorAgentInstruction1Code {}
export interface ExternalDeviceOperatingSystemType1Code {}
export interface ExternalDiscountAmountType1Code {}
export interface ExternalDocumentAmountType1Code {}
export interface ExternalDocumentFormat1Code {}
export interface ExternalDocumentLineType1Code {}
export interface ExternalDocumentPurpose1Code {}
export interface ExternalDocumentType1Code {}
export interface ExternalEffectiveDateParameter1Code {}
export interface ExternalEmissionAllowanceSubProductType1Code {}
export interface ExternalEncryptedElementIdentification1Code {}
export interface ExternalEnquiryRequestType1Code {}
export interface ExternalEntitySize1Code {}
export interface ExternalEntityType1Code {}
export interface ExternalEntryStatus1Code {}
export interface ExternalFinancialInstitutionIdentification1Code {}
export interface ExternalFinancialInstrumentIdentificationType1Code {}
export interface ExternalFinancialInstrumentProductType1Code {}
export interface ExternalGarnishmentType1Code {}
export interface ExternalIncoterms1Code {}
export interface ExternalIndustrySectorClassification1Code {}
export interface ExternalInformationType1Code {}
export interface ExternalInstructedAgentInstruction1Code {}
export interface ExternalInvestigationAction1Code {}
export interface ExternalInvestigationActionReason1Code {}
export interface ExternalInvestigationExecutionConfirmation1Code {}
export interface ExternalInvestigationInstrument1Code {}
export interface ExternalInvestigationReason1Code {}
export interface ExternalInvestigationReasonSubType1Code {}
export interface ExternalInvestigationServiceLevel1Code {}
export interface ExternalInvestigationStatus1Code {}
export interface ExternalInvestigationStatusReason1Code {}
export interface ExternalInvestigationSubType1Code {}
export interface ExternalInvestigationType1Code {}
export interface ExternalLegalFramework1Code {}
export interface ExternalLetterType1Code {}
export interface ExternalLocalInstrument1Code {}
export interface ExternalMandateReason1Code {}
export interface ExternalMandateSetupReason1Code {}
export interface ExternalMandateStatus1Code {}
export interface ExternalMandateSuspensionReason1Code {}
export interface ExternalMarketArea1Code {}
export interface ExternalMarketInfrastructure1Code {}
export interface ExternalMessageFunction1Code {}
export interface ExternalModelFormIdentification1Code {}
export interface ExternalNarrativeType1Code {}
export interface ExternalNotificationCancellationReason1Code {}
export interface ExternalNotificationSubType1Code {}
export interface ExternalNotificationType1Code {}
export interface ExternalOrganisationIdentification1Code {}
export interface ExternalPackagingType1Code {}
export interface ExternalPartyRelationshipType1Code {}
export interface ExternalPaymentCancellationRejection1Code {}
export interface ExternalPaymentCompensationReason1Code {}
export interface ExternalPaymentControlRequestType1Code {}
export interface ExternalPaymentGroupStatus1Code {}
export interface ExternalPaymentModificationRejection1Code {}
export interface ExternalPaymentRole1Code {}
export interface ExternalPaymentScenario1Code {}
export interface ExternalPaymentTransactionStatus1Code {}
export interface ExternalPendingProcessingReason1Code {}
export interface ExternalPersonIdentification1Code {}
export interface ExternalPostTradeEventType1Code {}
export interface ExternalProductType1Code {}
export interface ExternalProxyAccountType1Code {}
export interface ExternalPurpose1Code {}
export interface ExternalRatesAndTenors1Code {}
export interface ExternalReRepresentmentReason1Code {}
export interface ExternalReceivedReason1Code {}
export interface ExternalRegulatoryInformationType1Code {}
export interface ExternalRejectedReason1Code {}
export interface ExternalRelativeTo1Code {}
export interface ExternalReportingSource1Code {}
export interface ExternalRequestStatus1Code {}
export interface ExternalReservationType1Code {}
export interface ExternalReturnReason1Code {}
export interface ExternalReversalReason1Code {}
export interface ExternalSecuritiesLendingType1Code {}
export interface ExternalSecuritiesPurpose1Code {}
export interface ExternalSecuritiesUpdateReason1Code {}
export interface ExternalServiceLevel1Code {}
export interface ExternalShipmentCondition1Code {}
export interface ExternalStatusReason1Code {}
export interface ExternalSystemBalanceType1Code {}
export interface ExternalSystemErrorHandling1Code {}
export interface ExternalSystemEventType1Code {}
export interface ExternalSystemMemberType1Code {}
export interface ExternalSystemPartyType1Code {}
export interface ExternalTaxAmountType1Code {}
export interface ExternalTechnicalInputChannel1Code {}
export interface ExternalTradeMarket1Code {}
export interface ExternalTradeTransactionCondition1Code {}
export interface ExternalTypeOfParty1Code {}
export interface ExternalUnableToApplyIncorrectData1Code {}
export interface ExternalUnableToApplyMissingData1Code {}
export interface ExternalUnderlyingTradeTransactionType1Code {}
export interface ExternalUndertakingAmountType1Code {}
export interface ExternalUndertakingDocumentType1Code {}
export interface ExternalUndertakingDocumentType2Code {}
export interface ExternalUndertakingStatusCategory1Code {}
export interface ExternalUndertakingType1Code {}
export interface ExternalUnitOfMeasure1Code {}
export interface ExternalValidationRuleIdentification1Code {}
export interface ExternalVerificationReason1Code {}
export interface Biso20022 {}import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}
/**
 * ==============================================================================
 * SECTION 3: EXECUTIVE MAGAZINE & MULTIMEDIA CREATION TYPES
 * ==============================================================================
 * Types governing the generation, layout, rendering, and narration of high-end
 * digital publications, executive lookbooks, and AI-driven multimedia assets.
 */

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
  'Wall Street Boardroom',
  'Silicon Valley Tech Campus',
  'Dubai Skyscraper Penthouse',
  'Paris Fashion Week Front Row',
  'Private Island Villa',
  'Luxury Private Jet',
  'Monaco Yacht Deck',
  'Swiss Alps Davos Summit'
];

export const STYLES = [
  'Power Suit (Classic Bespoke)',
  'Tech Mogul (Minimalist Luxury)',
  'Black Tie Gala (Formal)',
  'Avant-Garde Executive (Bold)',
  'Old Money (Quiet Luxury)',
  'Streetwear CEO (High-End Casual)'
];

export type RenderingEngine = 'stable-diffusion' | 'midjourney' | 'dall-e-3' | 'flux' | 'imagen' | 'custom-gan';

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
  lighting?: string;
  cameraAngle?: string;
  colorPalette?: string[];
  historicalReference?: string;
  brandTags?: string[];
}

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  videoUrl?: string;
  isAnimating?: boolean;
  audioUrl?: string;
  narrationText?: string;
  renderingEngine?: RenderingEngine;
  promptUsed?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  seed?: number;
  cfgScale?: number;
  steps?: number;
  generationTimeMs?: number;
  error?: string;
}

export interface Asset {
  id: string;
  base64: string;
  desc: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  body: string;
  elements: VisualElement[];
}

export interface VisualElement {
  id: string;
  type: 'image' | 'seal' | 'divider' | 'illustration' | 'scenery';
  src: string;
  position: { x: number; y: number };
  alt: string;
  isAnimated?: boolean;
  scale?: number;
  rotation?: number;
}

export enum AIServiceAction {
  REWRITE = 'REWRITE',
  ILLUMINATE = 'ILLUMINATE',
  PROPHESY = 'PROPHESY',
  SEAL = 'SEAL',
  CIPHER = 'CIPHER',
  SCENERY = 'SCENERY',
  ENCHANT = 'ENCHANT'
}

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Ariel' | 'Oberon' | 'Titania';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  sampleRateHz?: number;
  languageCode?: string;
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
  audioUrl?: string;
  durationMs?: number;
  characterCount: number;
}

/**
 * ==============================================================================
 * SECTION 4: NEWS, FEEDS & SENTIMENT ANALYSIS TYPES
 * ==============================================================================
 * Structures governing real-time financial news aggregation, sentiment analysis,
 * urgency scoring, and AI-driven market insights.
 */

export enum StaticCategory {
  TOP_STORIES = 'Global Pulse',
  POLITICS = 'Governance',
  TECH = 'Infrastructure',
  FINANCE = 'Markets',
  CRYPTO = 'Decentralized Ledger',
  ENERGY = 'Thermodynamics',
  BIOTECH = 'Genomics',
  SPACE = 'Orbital Mechanics'
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: number; // Scale of 1-10
  tags: string[];
  author?: string;
  content?: string;
  imageUrl?: string;
  sentimentScore?: number; // Continuous value from -1.0 to 1.0
  relevanceScore?: number; // Continuous value from 0.0 to 1.0
  language?: string;
  isFactChecked?: boolean;
  factCheckDetails?: string;
  biasRating?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  relatedTickers?: string[];
}

export interface FeedPage {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  lastUpdated: string;
  aiInsights: string;
  curatorId?: string;
  isPublic: boolean;
  subscriberCount?: number;
  customFilterCriteria?: FilterCriterion[];
}

/**
 * ==============================================================================
 * SECTION 5: FILE SYSTEM, STORAGE & CLOUD MANAGEMENT TYPES
 * ==============================================================================
 * Types governing local and cloud file systems, indexing, AI-assisted summaries,
 * and multi-source repository exploration.
 */

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  GENERIC = 'generic',
  CODE = 'code',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  DATABASE = 'database',
  MODEL_3D = 'model_3d'
}

export type FileSource = 'local' | 'github' | 'ai' | 'google-drive' | 'aws-s3' | 'ipfs' | 'dropbox';

export interface FileVersion {
  versionId: string;
  modifiedBy: string;
  modifiedAt: string;
  size: number;
  changeLog?: string;
  downloadUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string | null;
  source: FileSource;
  extension?: string;
  mimeType?: string;
  content?: string; // Text, DataURL, or Download URL
  aiSummary?: string;
  aiKeywords?: string[];
  isIndexing?: boolean;
  githubRepo?: string;
  githubOwner?: string;
  githubUrl?: string;
  driveFileId?: string;
  isCloudFolder?: boolean;
  ownerId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  versionHistory?: FileVersion[];
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  hash?: string;
  tags?: string[];
}

export interface NavigationState {
  currentPath: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid' | 'gallery' | 'tree' | 'kanban';
  sortBy: 'name' | 'size' | 'lastModified' | 'type';
  sortDirection: 'asc' | 'desc';
  searchQuery?: string;
  filterType?: FileType | 'all';
}

/**
 * ==============================================================================
 * SECTION 6: CORE BANKING, TRANSACTIONS & CAPITAL ALLOCATION TYPES
 * ==============================================================================
 * Foundational types for personal and corporate banking, ledger accounts,
 * transaction processing, and AI-driven financial planning.
 */

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'fedwire' | 'rtp';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'credit' | 'debit';

export type TransactionStatus =
  | 'POSTED'
  | 'PENDING'
  | 'Initiated'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'needs_approval'
  | 'approved'
  | 'denied'
  | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string | string[];
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: KeyValuePairs;
  pending?: boolean;
  reconciled?: boolean;
  reconciliation_id?: string;
  nexus_link_id?: string;
  institution_origin?: string;
  cardId?: string;
  holderName?: string;
  merchant?: string;
  status?: TransactionStatus;
  timestamp?: string;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string;
  assetClass?: string;
  riskLevel?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining?: number;
  category?: string;
  alerts?: Alert[];
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
  credits: number;
}

export interface AIPlanStep {
  title: string;
  description: string;
  timeline: string;
  category?: string;
}

export interface AIPlan {
  title: string;
  summary: string;
  steps: AIPlanStep[];
}

export type IllusionType = 'none' | 'aurora' | 'blue' | 'dark';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  institutionId?: string;
  type?: string;
  balance?: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: string;
}

export enum WeaverStage {
  Pitch = 'pitch',
  Analysis = 'analysis',
  Test = 'test',
  FinalReview = 'final_review',
  Approved = 'approved',
  Results = 'results',
  Error = 'error'
}

export interface QuantumWeaverState {
  stage: WeaverStage;
  businessPlan: string;
  feedback: string;
  questions: AIQuestion[];
  loanAmount: number;
  coachingPlan: AIPlan | null;
  error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  aiJustification?: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress?: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCardControls {
  atm: boolean;
  contactless: boolean;
  online: boolean;
  monthlyLimit: number;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: CorporateCardControls;
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description?: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Counterparty {
  id: string;
  name: string;
  email?: string | null;
  send_remittance_advice?: boolean;
  type?: 'business' | 'individual';
  riskLevel?: 'Low' | 'Medium' | 'High';
  createdDate?: string;
  accounts: ExternalAccount[];
  virtualAccounts: VirtualAccount[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name?: string;
  verification_status?: string;
  account_details?: any[];
  routing_details?: any[];
}

export interface VirtualAccount {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  balance?: number;
  currency?: string;
  status?: string;
  subAccounts?: VirtualAccount[];
  description?: string;
  counterparty_id?: string;
  internal_account_id?: string;
  debit_ledger_account_id?: string;
  credit_ledger_account_id?: string;
  metadata?: any;
  account_details?: any[];
  routing_details?: any[];
}

export interface AIGoalPlanStep {
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Investing' | 'Income' | string;
}

export interface AIGoalPlan {
  feasibilitySummary: string;
  monthlyContribution: number;
  steps: AIGoalPlanStep[];
  actionableSteps?: string[];
  summary?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'recurring';
}

export interface RecurringContribution {
  id: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface LinkedGoal {
  id: string;
  relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
  triggerAmount?: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  iconName: string;
  plan: AIGoalPlan | null;
  startDate: string;
  riskProfile?: RiskProfile;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  linkedGoals: LinkedGoal[];
  recurringContributions: RecurringContribution[];
  contributions: Contribution[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number; // in reward points
  type: 'cashback' | 'giftcard' | 'impact' | string;
  description: string;
  iconName: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini' | string;

export interface APIStatus {
  provider: APIProvider;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number; // in ms
}

export interface CreditFactor {
  name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix' | string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}
/**
 * ==============================================================================
 * SECTION 7: PLAID, MARQETA, MODERN TREASURY & OPEN BANKING INTEGRATION TYPES
 * ==============================================================================
 * Enterprise-grade types governing secure connections, credential management,
 * card issuance, ledgering, and multi-node financial mesh protocols.
 */

export interface PlaidCredentials {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

export interface MarqetaCredentials {
  app_token?: string;
  admin_token?: string;
  applicationToken?: string;
  adminAccessToken?: string;
  base_url?: string;
}

export interface ModernTreasuryCredentials {
  apiKey: string;
  orgId?: string;
  organizationId?: string;
}

export interface PlaidTokenState {
  linkToken: string | null;
  publicToken: string | null;
  accessToken: string | null;
}

export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: AccountBalance;
  institution?: string;
}

export interface ConnectedItem {
  institutionId: string;
  institutionName: string;
  accessToken: string;
  itemId: string;
  accounts: Account[];
  transactions: Transaction[];
  metadata: {
    linked_at: string;
    node_priority: number;
    mesh_protocol: 'NEXUS-V3' | string;
    routing_hops: string[];
  };
}

export interface UCCFiling {
  id: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Filed' | 'Rejected';
  receiptId?: string;
  fileNumber?: string;
  packetNum: string;
  transType: 'Initial' | 'Amendment';
  amount: number;
  dateCreated: string;
  xmlPayload: string;
  errors?: string[];
}

export interface UnifiedPayload {
  timestamp: string;
  nexus_version: string;
  nexus_id: string;
  global_metadata: {
    client_context: string;
    reconciliation_depth: number;
    combined_hash: string;
  };
  mesh_stats: {
    total_liquidity: number;
    total_liabilities: number;
    net_position: number;
    active_institutions: number;
  };
  cross_institutional_ledger: {
    items: ConnectedItem[];
    reconciled_pairs: any[];
  };
  compliance: {
    active_ucc_filings: UCCFiling[];
  };
}

export enum FlowStep {
  CREDENTIALS = 'CREDENTIALS',
  LINK_TOKEN = 'LINK_TOKEN',
  LINK_UI = 'LINK_UI',
  EXCHANGE = 'EXCHANGE',
  DASHBOARD = 'DASHBOARD',
  UCC_CENTER = 'UCC_CENTER',
  MARQETA_NODE = 'MARQETA_NODE',
  MODERN_TREASURY_NODE = 'MODERN_TREASURY_NODE',
  TAXONOMY_REGISTRY = 'TAXONOMY_REGISTRY'
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  created_time?: string;
  start_date?: string;
  config: any;
}

export interface MarqetaCard {
  token: string;
  user_token: string;
  card_product_token: string;
  last_four: string;
  pan: string;
  expiration: string;
  cvv: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | string;
}

export interface MTLedger {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, string>;
}

export interface MTInternalAccount {
  id: string;
  name: string;
  currency: string;
  connection: { vendor_name: string };
  status: string;
}

export interface PlaidLinkSuccessMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id?: string;
}

export type PlaidProduct =
  | 'assets'
  | 'auth'
  | 'balance'
  | 'identity'
  | 'investments'
  | 'liabilities'
  | 'payment_initiation'
  | 'transactions';

export interface MarqetaUser {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  last_modified_time: string;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns?: string;
  };
  provider?: any;
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface LedgerAccount {
  id: string;
  name: string;
  balances: {
    available_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
    posted_balance: { amount: number; currency: string };
  };
}

export interface SettlementInstruction {
  messageId: string;
  creationDateTime: string;
  numberOfTransactions: number;
  settlementDate: string;
  totalAmount: number;
  currency: string;
  purpose?: string;
}

/**
 * ==============================================================================
 * SECTION 8: ENTERPRISE OPERATIONS, CORPORATE COMMAND, COMPLIANCE & ISO 20022
 * ==============================================================================
 * Types governing corporate command centers, compliance audits, anomaly detection,
 * cash flow forecasting, and ISO 20022 financial messaging standards.
 */

export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore?: number;
  recommendedAction?: string;
}

export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

export interface FraudRule {
  id: string;
  name: string;
  description?: string;
  severity: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
}

export interface ComplianceCase {
  id: string;
  reason: string;
  entityType: string;
  entityId: string;
  status: 'open' | 'closed' | 'investigating' | string;
  openedDate: string;
  type?: string;
  description?: string;
}

export interface FinancialAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: AnomalyStatus;
  entityType: string;
  entityId: string;
  entityDescription: string;
  timestamp: string;
  riskScore: number;
}

export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'False Positive';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  action: 'flag_for_review' | 'block' | 'notify_admin' | string;
  active: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  revenue: number;
  growth: number;
  riskScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetResource: string;
  success: boolean;
  details?: string;
  metadata?: any;
  ipAddress?: string;
}

export interface ThreatAlert {
  alertId: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataSharingPolicy {
  policyId: string;
  policyName: string;
  scope: string;
  isActive: boolean;
  lastReviewed: string;
}

export interface APIKey {
  id: string;
  keyName: string;
  creationDate: string;
  scopes: string[];
  lastUsed?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  verified: boolean;
}

export interface SecurityAwarenessModule {
  moduleId: string;
  title: string;
  completionRate: number;
}

export interface TransactionRule {
  ruleId: string;
  name: string;
  triggerCondition: string;
  action: string;
  isEnabled: boolean;
}

export interface SecurityScoreMetric {
  metricName: string;
  currentValue: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  lastActivity: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  permissions: string[];
  status: string;
  firstSeen: string;
  userAgent: string;
  pushNotificationsEnabled: boolean;
  biometricAuthEnabled: boolean;
  encryptionStatus: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  timestamp: string;
  isCurrent: boolean;
  userAgent: string;
}

export interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password?: string;
  databaseName: string;
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full';
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface WebDriverStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  activeTask: string | null;
  logs: string[];
}

export interface ExternalCorporateActionEventType1Code {}
export interface ExternalAcceptedReason1Code {}
export interface ExternalAccountIdentification1Code {}
export interface ExternalAgentInstruction1Code {}
export interface ExternalAgreementType1Code {}
export interface ExternalAuthenticationChannel1Code {}
export interface ExternalAuthenticationMethod1Code {}
export interface ExternalAuthorityExchangeReason1Code {}
export interface ExternalAuthorityIdentification1Code {}
export interface ExternalBalanceSubType1Code {}
export interface ExternalBalanceType1Code {}
export interface ExternalBankTransactionDomain1Code {}
export interface ExternalBankTransactionFamily1Code {}
export interface ExternalBankTransactionSubFamily1Code {}
export interface ExternalBenchmarkCurveName1Code {}
export interface ExternalBillingBalanceType1Code {}
export interface ExternalBillingCompensationType1Code {}
export interface ExternalBillingRateIdentification1Code {}
export interface ExternalCalculationAgent1Code {}
export interface ExternalCancellationReason1Code {}
export interface ExternalCardTransactionCategory1Code {}
export interface ExternalCashAccountType1Code {}
export interface ExternalCashClearingSystem1Code {}
export interface ExternalCategoryPurpose1Code {}
export interface ExternalChannel1Code {}
export interface ExternalChargeType1Code {}
export interface ExternalChequeAgentInstruction1Code {}
export interface ExternalChequeCancellationReason1Code {}
export interface ExternalChequeCancellationStatus1Code {}
export interface ExternalClaimNonReceiptRejection1Code {}
export interface ExternalClearingSystemIdentification1Code {}
export interface ExternalCollateralReferenceDataStatusReason1Code {}
export interface ExternalCommunicationFormat1Code {}
export interface ExternalContractBalanceType1Code {}
export interface ExternalContractClosureReason1Code {}
export interface ExternalCreditLineType1Code {}
export interface ExternalCreditorAgentInstruction1Code {}
export interface ExternalCreditorEnrolmentAmendmentReason1Code {}
export interface ExternalCreditorEnrolmentCancellationReason1Code {}
export interface ExternalCreditorEnrolmentStatusReason1Code {}
export interface ExternalCreditorReferenceType1Code {}
export interface ExternalDateFrequency1Code {}
export interface ExternalDateType1Code {}
export interface ExternalDebtorActivationAmendmentReason1Code {}
export interface ExternalDebtorActivationCancellationReason1Code {}
export interface ExternalDebtorActivationStatusReason1Code {}
export interface ExternalDebtorAgentInstruction1Code {}
export interface ExternalDeviceOperatingSystemType1Code {}
export interface ExternalDiscountAmountType1Code {}
export interface ExternalDocumentAmountType1Code {}
export interface ExternalDocumentFormat1Code {}
export interface ExternalDocumentLineType1Code {}
export interface ExternalDocumentPurpose1Code {}
export interface ExternalDocumentType1Code {}
export interface ExternalEffectiveDateParameter1Code {}
export interface ExternalEmissionAllowanceSubProductType1Code {}
export interface ExternalEncryptedElementIdentification1Code {}
export interface ExternalEnquiryRequestType1Code {}
export interface ExternalEntitySize1Code {}
export interface ExternalEntityType1Code {}
export interface ExternalEntryStatus1Code {}
export interface ExternalFinancialInstitutionIdentification1Code {}
export interface ExternalFinancialInstrumentIdentificationType1Code {}
export interface ExternalFinancialInstrumentProductType1Code {}
export interface ExternalGarnishmentType1Code {}
export interface ExternalIncoterms1Code {}
export interface ExternalIndustrySectorClassification1Code {}
export interface ExternalInformationType1Code {}
export interface ExternalInstructedAgentInstruction1Code {}
export interface ExternalInvestigationAction1Code {}
export interface ExternalInvestigationActionReason1Code {}
export interface ExternalInvestigationExecutionConfirmation1Code {}
export interface ExternalInvestigationInstrument1Code {}
export interface ExternalInvestigationReason1Code {}
export interface ExternalInvestigationReasonSubType1Code {}
export interface ExternalInvestigationServiceLevel1Code {}
export interface ExternalInvestigationStatus1Code {}
export interface ExternalInvestigationStatusReason1Code {}
export interface ExternalInvestigationSubType1Code {}
export interface ExternalInvestigationType1Code {}
export interface ExternalLegalFramework1Code {}
export interface ExternalLetterType1Code {}
export interface ExternalLocalInstrument1Code {}
export interface ExternalMandateReason1Code {}
export interface ExternalMandateSetupReason1Code {}
export interface ExternalMandateStatus1Code {}
export interface ExternalMandateSuspensionReason1Code {}
export interface ExternalMarketArea1Code {}
export interface ExternalMarketInfrastructure1Code {}
export interface ExternalMessageFunction1Code {}
export interface ExternalModelFormIdentification1Code {}
export interface ExternalNarrativeType1Code {}
export interface ExternalNotificationCancellationReason1Code {}
export interface ExternalNotificationSubType1Code {}
export interface ExternalNotificationType1Code {}
export interface ExternalOrganisationIdentification1Code {}
export interface ExternalPackagingType1Code {}
export interface ExternalPartyRelationshipType1Code {}
export interface ExternalPaymentCancellationRejection1Code {}
export interface ExternalPaymentCompensationReason1Code {}
export interface ExternalPaymentControlRequestType1Code {}
export interface ExternalPaymentGroupStatus1Code {}
export interface ExternalPaymentModificationRejection1Code {}
export interface ExternalPaymentRole1Code {}
export interface ExternalPaymentScenario1Code {}
export interface ExternalPaymentTransactionStatus1Code {}
export interface ExternalPendingProcessingReason1Code {}
export interface ExternalPersonIdentification1Code {}
export interface ExternalPostTradeEventType1Code {}
export interface ExternalProductType1Code {}
export interface ExternalProxyAccountType1Code {}
export interface ExternalPurpose1Code {}
export interface ExternalRatesAndTenors1Code {}
export interface ExternalReRepresentmentReason1Code {}
export interface ExternalReceivedReason1Code {}
export interface ExternalRegulatoryInformationType1Code {}
export interface ExternalRejectedReason1Code {}
export interface ExternalRelativeTo1Code {}
export interface ExternalReportingSource1Code {}
export interface ExternalRequestStatus1Code {}
export interface ExternalReservationType1Code {}
export interface ExternalReturnReason1Code {}
export interface ExternalReversalReason1Code {}
export interface ExternalSecuritiesLendingType1Code {}
export interface ExternalSecuritiesPurpose1Code {}
export interface ExternalSecuritiesUpdateReason1Code {}
export interface ExternalServiceLevel1Code {}
export interface ExternalShipmentCondition1Code {}
export interface ExternalStatusReason1Code {}
export interface ExternalSystemBalanceType1Code {}
export interface ExternalSystemErrorHandling1Code {}
export interface ExternalSystemEventType1Code {}
export interface ExternalSystemMemberType1Code {}
export interface ExternalSystemPartyType1Code {}
export interface ExternalTaxAmountType1Code {}
export interface ExternalTechnicalInputChannel1Code {}
export interface ExternalTradeMarket1Code {}
export interface ExternalTradeTransactionCondition1Code {}
export interface ExternalTypeOfParty1Code {}
export interface ExternalUnableToApplyIncorrectData1Code {}
export interface ExternalUnableToApplyMissingData1Code {}
export interface ExternalUnderlyingTradeTransactionType1Code {}
export interface ExternalUndertakingAmountType1Code {}
export interface ExternalUndertakingDocumentType1Code {}
export interface ExternalUndertakingDocumentType2Code {}
export interface ExternalUndertakingStatusCategory1Code {}
export interface ExternalUndertakingType1Code {}
export interface ExternalUnitOfMeasure1Code {}
export interface ExternalValidationRuleIdentification1Code {}
export interface ExternalVerificationReason1Code {}
export interface Biso20022 {}/**
 * ==============================================================================
 * SECTION 9: SOVEREIGN IDENTITY, USER PROFILES & SOCIAL GRAPH TYPES
 * ==============================================================================
 * Enterprise-grade identity structures, multi-role authorization matrices,
 * neural-lace telemetry, genomic anchors, and decentralized social graph nodes.
 */

export enum View {
  // --- Core ---
  Dashboard = 'dashboard',
  
  // --- Personal Command ---
  Transactions = 'transactions',
  SendMoney = 'send-money',
  Budgets = 'capital-allocation', // Renamed for spec
  FinancialGoals = 'strategic-goals',
  CreditHealth = 'credit-resonance',
  Personalization = 'interface-will',
  Accounts = 'accounts-overview',
  
  // --- Sovereign Wealth ---
  Investments = 'portfolio-overview',
  Crypto = 'web3-crypto',
  CryptoWeb3 = 'web3-crypto', // Added alias
  AlgoTradingLab = 'algo-trading-lab',
  ForexArena = 'forex-arena',
  CommoditiesExchange = 'commodities',
  RealEstateEmpire = 'real-estate',
  ArtCollectibles = 'art-collectibles',
  DerivativesDesk = 'derivatives',
  VentureCapital = 'venture-capital',
  PrivateEquity = 'private-equity',
  TaxOptimization = 'tax-optimization',
  LegacyBuilder = 'legacy-architect',
  SovereignWealth = 'sovereign-wealth-sim',
  QuantumAssets = 'quantum-assets',
  
  // --- Citi Connect Core ---
  CitibankAccounts = 'citi-accounts',
  CitibankAccountProxy = 'citi-account-proxy',
  CitibankBillPay = 'citi-bill-payment',
  CitibankCrossBorder = 'citi-cross-border',
  CitibankPayeeManagement = 'citi-payee-mgmt',
  CitibankStandingInstructions = 'citi-standing-instructions',
  CitibankDeveloperTools = 'citi-dev-tools',
  CitibankEligibility = 'citi-eligibility-check',
  CitibankUnmaskedData = 'citi-secure-data-view',

  // --- Plaid Nexus ---
  PlaidMainDashboard = 'plaid-overview',
  DataNetwork = 'plaid-overview', // Added alias
  PlaidIdentity = 'plaid-identity-verification',
  PlaidCRAMonitoring = 'plaid-cra-monitoring',
  PlaidInstitutions = 'plaid-institutions-explorer',
  PlaidItemManagement = 'plaid-item-management',
  
  // --- Enterprise Operations ---
  CorporateCommand = 'corporate-command',
  ModernTreasury = 'modern-treasury',
  Treasury = 'treasury-capital',
  CardPrograms = 'marqeta-cards',
  Payments = 'stripe-payments',
  StripeNexus = 'stripe-nexus',
  CounterpartyDashboard = 'counterparties',
  VirtualAccounts = 'virtual-accounts',
  CorporateActions = 'corporate-actions',
  CreditNoteLedger = 'credit-notes',
  ReconciliationHub = 'reconciliation-hub',
  GEINDashboard = 'gein-dashboard',
  CardholderManagement = 'cardholder-mgmt',
  VentureCapitalDeskView = 'vc-desk-view',

  // --- System & Intelligence ---
  AIAdvisor = 'ai-advisor',
  AIInsights = 'predictive-insights',
  QuantumWeaver = 'quantum-weaver',
  AgentMarketplace = 'agent-marketplace',
  AIAdStudio = 'ai-ad-studio',
  GlobalPositionMap = 'global-position-map',
  GlobalSsiHub = 'global-ssi-hub',
  SecurityCompliance = 'security-compliance',
  DeveloperHub = 'developer-hub',
  SchemaExplorer = 'iso-20022-explorer',
  ResourceGraph = 'resource-graph',
  TheVision = 'the-vision',
  ApiPlayground = 'api-playground',
  ComplianceOracle = 'compliance-oracle',

  // --- Admin & Tools ---
  CustomerDashboard = 'customer-dashboard',
  VerificationReports = 'verification-reports',
  FinancialReporting = 'financial-reporting',
  StripeNexusDashboard = 'stripe-nexus-admin',

  // --- Components (Direct Access) ---
  AccountDetails = 'account-details',
  AccountList = 'account-list',
  AccountStatementGrid = 'account-statement-grid',
  AccountsView = 'accounts-view',
  AccountVerificationModal = 'account-verification-modal',
  ACHDetailsDisplay = 'ach-details-display',
  AICommandLog = 'ai-command-log',
  AIPredictionWidget = 'ai-prediction-widget',
  AssetCatalog = 'asset-catalog',
  AutomatedSweepRules = 'automated-sweep-rules',
  BalanceReportChart = 'balance-report-chart',
  BalanceTransactionTable = 'balance-transaction-table',
  CardDesignVisualizer = 'card-design-visualizer',
  ChargeDetailModal = 'charge-detail-modal',
  ChargeList = 'charge-list',
  ConductorConfigurationView = 'conductor-configuration-view',
  CounterpartyDetails = 'counterparty-details',
  CounterpartyForm = 'counterparty-form',
  DisruptionIndexMeter = 'disruption-index-meter',
  DocumentUploader = 'document-uploader',
  DownloadLink = 'download-link',
  EarlyFraudWarningFeed = 'early-fraud-warning-feed',
  ElectionChoiceForm = 'election-choice-form',
  EventNotificationCard = 'event-notification-card',
  ExpectedPaymentsTable = 'expected-payments-table',
  ExternalAccountCard = 'external-account-card',
  ExternalAccountForm = 'external-account-form',
  ExternalAccountsTable = 'external-accounts-table',
  FinancialAccountCard = 'financial-account-card',
  IncomingPaymentDetailList = 'incoming-payment-detail-list',
  InvoiceFinancingRequest = 'invoice-financing-request',
  PaymentInitiationForm = 'payment-initiation-form',
  PaymentMethodDetails = 'payment-method-details',
  PaymentOrderForm = 'payment-order-form',
  PayoutsDashboard = 'payouts-dashboard',
  PnLChart = 'pnl-chart',
  RefundForm = 'refund-form',
  RemittanceInfoEditor = 'remittance-info-editor',
  ReportingView = 'reporting-view',
  ReportRunGenerator = 'report-run-generator',
  ReportStatusIndicator = 'report-status-indicator',
  SsiEditorForm = 'ssi-editor-form',
  StripeNexusView = 'stripe-nexus-view',
  StripeStatusBadge = 'stripe-status-badge',
  StructuredPurposeInput = 'structured-purpose-input',
  SubscriptionList = 'subscription-list',
  TimeSeriesChart = 'time-series-chart',
  TradeConfirmationModal = 'trade-confirmation-modal',
  TransactionFilter = 'transaction-filter',
  TransactionList = 'transaction-list',
  TreasuryTransactionList = 'treasury-transaction-list',
  UniversalObjectInspector = 'universal-object-inspector',
  VirtualAccountForm = 'virtual-account-form',
  VirtualAccountsTable = 'virtual-accounts-table',
  VoiceControl = 'voice-control',
  WebhookSimulator = 'webhook-simulator',

  // Educational & 527 Views
  TheBook = 'the-book',
  KnowledgeBase = 'knowledge-base',
  
  // Auth & Settings
  Settings = 'settings',
  SSO = 'sso',
  ConciergeService = 'concierge-service',
  Philanthropy = 'philanthropy',
  OpenBanking = 'open-banking',
  FinancialDemocracy = 'financial-democracy',
  APIStatus = 'api-status',
  APIIntegration = 'api-integration',
  APIConsole = 'api-console',
  SecurityCenter = 'security-center',
  Security = 'security',
  AIStrategy = 'ai-strategy',
  Goals = 'financial-goals',
  Rewards = 'rewards',
  CardCustomization = 'card-customization',
}

export type UserRole =
  | 'ADMIN'
  | 'TRADER'
  | 'CLIENT'
  | 'VISIONARY'
  | 'CARETAKER'
  | 'QUANT_ANALYST'
  | 'SYSTEM_ARCHITECT'
  | 'ETHICS_OFFICER'
  | 'DATA_SCIENTIST'
  | 'NETWORK_WEAVER'
  | 'CITIZEN'
  | 'FOUNDER'
  | 'INVESTOR'
  | 'MANAGER';

export type SecurityLevel =
  | 'STANDARD'
  | 'ELEVATED'
  | 'TRADING_UNLOCKED'
  | 'QUANTUM_ENCRYPTED'
  | 'SOVEREIGN_CLEARED'
  | 'ARCHITECT_LEVEL';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles?: UserRole[];
  securityLevel?: SecurityLevel;
  netWorth?: number;
  display_name?: string;
  handle?: string;
  role?: string;
  businessId?: string;
  profilePictureUrl?: string;
  bio?: string;
  profile?: {
    interests: string[];
    skills: string[];
    [key: string]: any;
  };
  wallet?: {
    balance: number;
    currency: string;
  };
  businesses?: string[];
  memberships?: any[];
  followers?: string[];
  following?: string[];
  state?: {
    mood: string;
    activity: string;
    last_active_tick: number;
    [key: string]: any;
  };
  isAdmin?: boolean;
  title?: string;
  phone?: string;
  loyaltyTier?: string;
  usdBalance?: number;
  fiatBalance?: number;
  cryptoBalance?: number;
  avatarUrl?: string;
  tradingProfile?: any;
  biometricHashV2?: string;
  genomicSignatureId?: string;
  citizenship?: string;
  reputationScore?: number;
  threatVectorIndex?: number;
  neuralLaceSyncStatus?: string;
  cognitiveProfileId?: string;
  activeThoughtStreamId?: string | null;
  lastLoginCoordinates?: GeoCoordinate;
  temporalAnchorId?: string;
  activeSovereignAgentIds?: string[];
  permissionsGridHash?: string;
}

export type UserProfile = User;

export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  text: string;
  timestamp: string;
}

export interface PostContent {
  text: string;
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  financialData?: any;
}

export interface Post {
  id: string;
  author_id: string;
  userName: string;
  userProfilePic: string;
  created_tick: number;
  content: PostContent;
  type: 'text' | 'image' | 'video' | 'link' | 'financial_event';
  tags: string[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  visibility: 'public' | 'connections' | 'private';
  comments: Comment[];
}

export interface LendingPoolStats {
  totalCapital: number;
  interestRate: number;
  activeLoans: number;
  defaultRate: number;
  totalInterestEarned: number;
}

export interface AppIntegration {
  id: string;
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'disconnected' | 'issue';
}

export interface BiometricData {
  id: string;
  type: string;
  publicKey: string;
  enrolledDate: string;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  device?: string;
  browser?: string;
  os?: string;
  location?: string;
  isCurrent?: boolean;
  userAgent?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  specialization: string;
  traffic: number;
}

export interface SynapticVault {
  id: string;
  ownerIds: string[];
  ownerNames: string[];
  status: string;
  masterPrivateKeyFragment: string;
  creationDate: string;
}

export interface EcosystemKPIs {
  currentDate: string;
  totalEcosystemValue: number;
  totalTransactions: number;
  communityPoolCapital: number;
  activeUsers: number;
  gdp: number;
}

export interface SimulationEvent {
  id: string;
  tick: number;
  type: string;
  description: string;
  impact: any;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: 'service' | 'retail' | 'tech' | 'manufacturing' | 'finance' | 'platform';
  monthly_revenue: number;
  expenses: number;
  employees: string[];
  status: 'active' | 'bankrupt' | 'acquired';
  marketing_factor: number; // 0-1 multiplier
  businessPlan?: string;
  valuation?: number;
  cashBalance?: number;
  hqLocation?: string;
}

/**
 * ==============================================================================
 * SECTION 10: QUANTUM WEALTH, ALGORITHMIC TRADING & ALTERNATIVE ASSETS
 * ==============================================================================
 * Advanced structures for fractional real estate, fine art tokenization,
 * algorithmic trading strategies, venture capital startups, and Stripe ledger balances.
 */

export interface RealEstateProperty {
  id: string;
  address: string;
  value: number;
  rentalIncome: number;
  occupancyRate?: number;
  tokenizedShares?: number;
  yieldYTD?: number;
}

export interface ArtPiece {
  id: string;
  name: string;
  artist: string;
  value: number;
  year: number;
  medium?: string;
  provenance?: string[];
  fractionalOwnershipEnabled?: boolean;
}

export interface AlgoStrategy {
  id: string;
  name: string;
  performance: number;
  risk: 'Low' | 'Medium' | 'High';
  active: boolean;
  sharpeRatio?: number;
  maxDrawdown?: number;
  allocationPercentage?: number;
}

export interface VentureStartup {
  id: string;
  name: string;
  valuation: number;
  investment: number;
  equity: number;
  fundingRound?: 'Seed' | 'SeriesA' | 'SeriesB' | 'SeriesC' | 'Growth';
  burnRate?: number;
  runwayMonths?: number;
}

export interface StripeBalance {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
}

export interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number;
  description: string;
  customer_id?: string;
  receipt_url?: string;
  metadata: KeyValuePairs;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
  total_spent?: number;
  metadata?: KeyValuePairs;
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: number;
  plan_id: string;
  amount: number;
}

export type StripeResource = any;

/**
 * ==============================================================================
 * SECTION 11: GATEKEEPER VERIFICATION & CRYPTOGRAPHIC LEDGERS
 * ==============================================================================
 * Types governing secure micro-deposit verification, Modern Treasury external
 * account validation, and multi-factor cryptographic gatekeepers.
 */

export interface VerifyParams {
  externalAccountId: string;
  originatingAccountId: string;
  paymentType: 'ach' | 'eft' | 'rtp';
  currency: string;
  authToken: string; // The base64 string provided by user
}

export interface VerifyError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * ==============================================================================
 * SECTION 12: SACRED GEOMETRY, GEMATRIA & THEOLOGICAL PATTERNS
 * ==============================================================================
 * Types governing mathematical patterns, triangular numbers, gematria calculations,
 * and multi-layered cosmic/historical pattern analysis.
 */

export interface BibleBook {
  index: number;
  name: string;
  chapters: number;
  isTriangular: boolean;
}

export interface GematriaResult {
  word: string;
  sum: number;
  language: string;
  category: string;
}

export interface TriangularMetadata {
  index: number;
  value: number;
  significance: string;
}

export interface PatternLayer {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: 'Scripture' | 'Math' | 'Science' | 'Cosmic' | 'History';
}

/**
 * ==============================================================================
 * SECTION 13: LITERARY TRANSLATION, MANUSCRIPTS & REPOSITORY COMPENDIUMS
 * ==============================================================================
 * Types governing the transformation of raw codebases into literary masterpieces,
 * New York Times best-seller manuscripts, and virtual repository consensus engines.
 */

export interface Page {
  title: string;
  content: string; // Changed from string[] to string for narrative content
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  technicalSummary: string;
  imageryPrompt: string;
  imageUrl?: string;
  pages?: Page[];
}

export interface Section {
  title: string;
  chapters: Chapter[];
}

export type Book = Section[];

export interface Manuscript {
  repoName: string;
  title: string;
  preface: string;
  chapters: Chapter[];
  conclusion: string;
  generatedAt: string;
  author: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface KnowledgeBaseFile extends GitHubFile {
  repoName: string;
}

export interface AuditItem {
  file: GitHubFile;
  repo: GithubRepo;
}

export interface FileAnalysis {
  path: string;
  name: string;
  thoughts: string;
  hypnoticCommand: string;
  imageUrl?: string;
}

export interface ProjectCompendium {
  repoName: string;
  summaries: FileAnalysis[];
  masterStory: string;
  sacredDecree: string;
  ultimateBibliography: string;
  analyzedAt: string;
  totalFilesProcessed: number;
}

export interface VirtualRepository {
  name: string;
  files: Map<string, FileAnalysis>;
  consensus: any;
  isReady: boolean;
}

export interface SelectedContext {
  repo: GithubRepo | null;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
  isGenerating: boolean;
  status: string;
  compendium?: ProjectCompendium | null;
  virtualRepo?: VirtualRepository | null;
}

export interface RepoSession {
  repoId: number;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
}

/**
 * ==============================================================================
 * SECTION 14: ENTERPRISE PAYMENTS, SIMULATIONS & CLIENT REGISTRATION
 * ==============================================================================
 * Types governing enterprise-grade payee management, simulation engines,
 * client registration responses, and line-item ledger updates.
 */

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
}

export interface CustomerProfileResponse {
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  companyName: string;
  emails: Array<{
    emailAddress: string;
    preferenceType: string;
  }>;
  addressList: Array<{
    addressLine1: string;
    city: string;
    countryCode: string;
    postalCode: string;
    addressType: string;
  }>;
  phones: Array<{
    phoneType: string;
    fullPhoneNumber: string;
    preferenceType: string;
  }>;
}

export interface ClientRegisterResponse {
  client_id: string;
  client_secret: string;
  client_name: string;
  appId?: string;
  redirect_uris: string[];
  scope: string[];
  token_endpoint_auth_method?: string;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * ==============================================================================
 * SECTION 15: ADVANCED TYPESCRIPT UTILITY & TYPE-LEVEL PROGRAMMING
 * ==============================================================================
 * High-performance utility types for deep partials, readonly mapping,
 * union-to-intersection conversions, and type-safe property picking.
 */

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type PickProperties<T, U> = Pick<T, KeysOfType<T, U>>;

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type TupleToUnion<T extends any[]> = T[number];

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}
/**
 * ==============================================================================
 * SECTION 3: EXECUTIVE MAGAZINE & MULTIMEDIA CREATION TYPES
 * ==============================================================================
 * Types governing the generation, layout, rendering, and narration of high-end
 * digital publications, executive lookbooks, and AI-driven multimedia assets.
 */

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
  'Wall Street Boardroom',
  'Silicon Valley Tech Campus',
  'Dubai Skyscraper Penthouse',
  'Paris Fashion Week Front Row',
  'Private Island Villa',
  'Luxury Private Jet',
  'Monaco Yacht Deck',
  'Swiss Alps Davos Summit'
];

export const STYLES = [
  'Power Suit (Classic Bespoke)',
  'Tech Mogul (Minimalist Luxury)',
  'Black Tie Gala (Formal)',
  'Avant-Garde Executive (Bold)',
  'Old Money (Quiet Luxury)',
  'Streetwear CEO (High-End Casual)'
];

export type RenderingEngine = 'stable-diffusion' | 'midjourney' | 'dall-e-3' | 'flux' | 'imagen' | 'custom-gan';

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
  lighting?: string;
  cameraAngle?: string;
  colorPalette?: string[];
  historicalReference?: string;
  brandTags?: string[];
}

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  videoUrl?: string;
  isAnimating?: boolean;
  audioUrl?: string;
  narrationText?: string;
  renderingEngine?: RenderingEngine;
  promptUsed?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  seed?: number;
  cfgScale?: number;
  steps?: number;
  generationTimeMs?: number;
  error?: string;
}

export interface Asset {
  id: string;
  base64: string;
  desc: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  body: string;
  elements: VisualElement[];
}

export interface VisualElement {
  id: string;
  type: 'image' | 'seal' | 'divider' | 'illustration' | 'scenery';
  src: string;
  position: { x: number; y: number };
  alt: string;
  isAnimated?: boolean;
  scale?: number;
  rotation?: number;
}

export enum AIServiceAction {
  REWRITE = 'REWRITE',
  ILLUMINATE = 'ILLUMINATE',
  PROPHESY = 'PROPHESY',
  SEAL = 'SEAL',
  CIPHER = 'CIPHER',
  SCENERY = 'SCENERY',
  ENCHANT = 'ENCHANT'
}

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Ariel' | 'Oberon' | 'Titania';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  sampleRateHz?: number;
  languageCode?: string;
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
  audioUrl?: string;
  durationMs?: number;
  characterCount: number;
}

/**
 * ==============================================================================
 * SECTION 4: NEWS, FEEDS & SENTIMENT ANALYSIS TYPES
 * ==============================================================================
 * Structures governing real-time financial news aggregation, sentiment analysis,
 * urgency scoring, and AI-driven market insights.
 */

export enum StaticCategory {
  TOP_STORIES = 'Global Pulse',
  POLITICS = 'Governance',
  TECH = 'Infrastructure',
  FINANCE = 'Markets',
  CRYPTO = 'Decentralized Ledger',
  ENERGY = 'Thermodynamics',
  BIOTECH = 'Genomics',
  SPACE = 'Orbital Mechanics'
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: number; // Scale of 1-10
  tags: string[];
  author?: string;
  content?: string;
  imageUrl?: string;
  sentimentScore?: number; // Continuous value from -1.0 to 1.0
  relevanceScore?: number; // Continuous value from 0.0 to 1.0
  language?: string;
  isFactChecked?: boolean;
  factCheckDetails?: string;
  biasRating?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  relatedTickers?: string[];
}

export interface FeedPage {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  lastUpdated: string;
  aiInsights: string;
  curatorId?: string;
  isPublic: boolean;
  subscriberCount?: number;
  customFilterCriteria?: FilterCriterion[];
}

/**
 * ==============================================================================
 * SECTION 5: FILE SYSTEM, STORAGE & CLOUD MANAGEMENT TYPES
 * ==============================================================================
 * Types governing local and cloud file systems, indexing, AI-assisted summaries,
 * and multi-source repository exploration.
 */

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  GENERIC = 'generic',
  CODE = 'code',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  DATABASE = 'database',
  MODEL_3D = 'model_3d'
}

export type FileSource = 'local' | 'github' | 'ai' | 'google-drive' | 'aws-s3' | 'ipfs' | 'dropbox';

export interface FileVersion {
  versionId: string;
  modifiedBy: string;
  modifiedAt: string;
  size: number;
  changeLog?: string;
  downloadUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string | null;
  source: FileSource;
  extension?: string;
  mimeType?: string;
  content?: string; // Text, DataURL, or Download URL
  aiSummary?: string;
  aiKeywords?: string[];
  isIndexing?: boolean;
  githubRepo?: string;
  githubOwner?: string;
  githubUrl?: string;
  driveFileId?: string;
  isCloudFolder?: boolean;
  ownerId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  versionHistory?: FileVersion[];
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  hash?: string;
  tags?: string[];
}

export interface NavigationState {
  currentPath: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid' | 'gallery' | 'tree' | 'kanban';
  sortBy: 'name' | 'size' | 'lastModified' | 'type';
  sortDirection: 'asc' | 'desc';
  searchQuery?: string;
  filterType?: FileType | 'all';
}

/**
 * ==============================================================================
 * SECTION 6: CORE BANKING, TRANSACTIONS & CAPITAL ALLOCATION TYPES
 * ==============================================================================
 * Foundational types for personal and corporate banking, ledger accounts,
 * transaction processing, and AI-driven financial planning.
 */

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'fedwire' | 'rtp';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'credit' | 'debit';

export type TransactionStatus =
  | 'POSTED'
  | 'PENDING'
  | 'Initiated'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'needs_approval'
  | 'approved'
  | 'denied'
  | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string | string[];
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: KeyValuePairs;
  pending?: boolean;
  reconciled?: boolean;
  reconciliation_id?: string;
  nexus_link_id?: string;
  institution_origin?: string;
  cardId?: string;
  holderName?: string;
  merchant?: string;
  status?: TransactionStatus;
  timestamp?: string;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string;
  assetClass?: string;
  riskLevel?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining?: number;
  category?: string;
  alerts?: Alert[];
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
  credits: number;
}

export interface AIPlanStep {
  title: string;
  description: string;
  timeline: string;
  category?: string;
}

export interface AIPlan {
  title: string;
  summary: string;
  steps: AIPlanStep[];
}

export type IllusionType = 'none' | 'aurora' | 'blue' | 'dark';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  institutionId?: string;
  type?: string;
  balance?: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: string;
}

export enum WeaverStage {
  Pitch = 'pitch',
  Analysis = 'analysis',
  Test = 'test',
  FinalReview = 'final_review',
  Approved = 'approved',
  Results = 'results',
  Error = 'error'
}

export interface QuantumWeaverState {
  stage: WeaverStage;
  businessPlan: string;
  feedback: string;
  questions: AIQuestion[];
  loanAmount: number;
  coachingPlan: AIPlan | null;
  error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  aiJustification?: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress?: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCardControls {
  atm: boolean;
  contactless: boolean;
  online: boolean;
  monthlyLimit: number;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: CorporateCardControls;
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description?: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Counterparty {
  id: string;
  name: string;
  email?: string | null;
  send_remittance_advice?: boolean;
  type?: 'business' | 'individual';
  riskLevel?: 'Low' | 'Medium' | 'High';
  createdDate?: string;
  accounts: ExternalAccount[];
  virtualAccounts: VirtualAccount[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name?: string;
  verification_status?: string;
  account_details?: any[];
  routing_details?: any[];
}

export interface VirtualAccount {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  balance?: number;
  currency?: string;
  status?: string;
  subAccounts?: VirtualAccount[];
  description?: string;
  counterparty_id?: string;
  internal_account_id?: string;
  debit_ledger_account_id?: string;
  credit_ledger_account_id?: string;
  metadata?: any;
  account_details?: any[];
  routing_details?: any[];
}

export interface AIGoalPlanStep {
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Investing' | 'Income' | string;
}

export interface AIGoalPlan {
  feasibilitySummary: string;
  monthlyContribution: number;
  steps: AIGoalPlanStep[];
  actionableSteps?: string[];
  summary?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'recurring';
}

export interface RecurringContribution {
  id: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface LinkedGoal {
  id: string;
  relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
  triggerAmount?: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  iconName: string;
  plan: AIGoalPlan | null;
  startDate: string;
  riskProfile?: RiskProfile;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  linkedGoals: LinkedGoal[];
  recurringContributions: RecurringContribution[];
  contributions: Contribution[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number; // in reward points
  type: 'cashback' | 'giftcard' | 'impact' | string;
  description: string;
  iconName: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini' | string;

export interface APIStatus {
  provider: APIProvider;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number; // in ms
}

export interface CreditFactor {
  name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix' | string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}
/**
 * ==============================================================================
 * SECTION 7: PLAID, MARQETA, MODERN TREASURY & OPEN BANKING INTEGRATION TYPES
 * ==============================================================================
 * Enterprise-grade types governing secure connections, credential management,
 * card issuance, ledgering, and multi-node financial mesh protocols.
 */

export interface PlaidCredentials {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

export interface MarqetaCredentials {
  app_token?: string;
  admin_token?: string;
  applicationToken?: string;
  adminAccessToken?: string;
  base_url?: string;
}

export interface ModernTreasuryCredentials {
  apiKey: string;
  orgId?: string;
  organizationId?: string;
}

export interface PlaidTokenState {
  linkToken: string | null;
  publicToken: string | null;
  accessToken: string | null;
}

export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: AccountBalance;
  institution?: string;
}

export interface ConnectedItem {
  institutionId: string;
  institutionName: string;
  accessToken: string;
  itemId: string;
  accounts: Account[];
  transactions: Transaction[];
  metadata: {
    linked_at: string;
    node_priority: number;
    mesh_protocol: 'NEXUS-V3' | string;
    routing_hops: string[];
  };
}

export interface UCCFiling {
  id: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Filed' | 'Rejected';
  receiptId?: string;
  fileNumber?: string;
  packetNum: string;
  transType: 'Initial' | 'Amendment';
  amount: number;
  dateCreated: string;
  xmlPayload: string;
  errors?: string[];
}

export interface UnifiedPayload {
  timestamp: string;
  nexus_version: string;
  nexus_id: string;
  global_metadata: {
    client_context: string;
    reconciliation_depth: number;
    combined_hash: string;
  };
  mesh_stats: {
    total_liquidity: number;
    total_liabilities: number;
    net_position: number;
    active_institutions: number;
  };
  cross_institutional_ledger: {
    items: ConnectedItem[];
    reconciled_pairs: any[];
  };
  compliance: {
    active_ucc_filings: UCCFiling[];
  };
}

export enum FlowStep {
  CREDENTIALS = 'CREDENTIALS',
  LINK_TOKEN = 'LINK_TOKEN',
  LINK_UI = 'LINK_UI',
  EXCHANGE = 'EXCHANGE',
  DASHBOARD = 'DASHBOARD',
  UCC_CENTER = 'UCC_CENTER',
  MARQETA_NODE = 'MARQETA_NODE',
  MODERN_TREASURY_NODE = 'MODERN_TREASURY_NODE',
  TAXONOMY_REGISTRY = 'TAXONOMY_REGISTRY'
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  created_time?: string;
  start_date?: string;
  config: any;
}

export interface MarqetaCard {
  token: string;
  user_token: string;
  card_product_token: string;
  last_four: string;
  pan: string;
  expiration: string;
  cvv: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | string;
}

export interface MTLedger {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, string>;
}

export interface MTInternalAccount {
  id: string;
  name: string;
  currency: string;
  connection: { vendor_name: string };
  status: string;
}

export interface PlaidLinkSuccessMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id?: string;
}

export type PlaidProduct =
  | 'assets'
  | 'auth'
  | 'balance'
  | 'identity'
  | 'investments'
  | 'liabilities'
  | 'payment_initiation'
  | 'transactions';

export interface MarqetaUser {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  last_modified_time: string;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns?: string;
  };
  provider?: any;
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface LedgerAccount {
  id: string;
  name: string;
  balances: {
    available_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
    posted_balance: { amount: number; currency: string };
  };
}

export interface SettlementInstruction {
  messageId: string;
  creationDateTime: string;
  numberOfTransactions: number;
  settlementDate: string;
  totalAmount: number;
  currency: string;
  purpose?: string;
}

/**
 * ==============================================================================
 * SECTION 8: ENTERPRISE OPERATIONS, CORPORATE COMMAND, COMPLIANCE & ISO 20022
 * ==============================================================================
 * Types governing corporate command centers, compliance audits, anomaly detection,
 * cash flow forecasting, and ISO 20022 financial messaging standards.
 */

export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore?: number;
  recommendedAction?: string;
}

export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

export interface FraudRule {
  id: string;
  name: string;
  description?: string;
  severity: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
}

export interface ComplianceCase {
  id: string;
  reason: string;
  entityType: string;
  entityId: string;
  status: 'open' | 'closed' | 'investigating' | string;
  openedDate: string;
  type?: string;
  description?: string;
}

export interface FinancialAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: AnomalyStatus;
  entityType: string;
  entityId: string;
  entityDescription: string;
  timestamp: string;
  riskScore: number;
}

export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'False Positive';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  action: 'flag_for_review' | 'block' | 'notify_admin' | string;
  active: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  revenue: number;
  growth: number;
  riskScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetResource: string;
  success: boolean;
  details?: string;
  metadata?: any;
  ipAddress?: string;
}

export interface ThreatAlert {
  alertId: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataSharingPolicy {
  policyId: string;
  policyName: string;
  scope: string;
  isActive: boolean;
  lastReviewed: string;
}

export interface APIKey {
  id: string;
  keyName: string;
  creationDate: string;
  scopes: string[];
  lastUsed?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  verified: boolean;
}

export interface SecurityAwarenessModule {
  moduleId: string;
  title: string;
  completionRate: number;
}

export interface TransactionRule {
  ruleId: string;
  name: string;
  triggerCondition: string;
  action: string;
  isEnabled: boolean;
}

export interface SecurityScoreMetric {
  metricName: string;
  currentValue: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  lastActivity: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  permissions: string[];
  status: string;
  firstSeen: string;
  userAgent: string;
  pushNotificationsEnabled: boolean;
  biometricAuthEnabled: boolean;
  encryptionStatus: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  timestamp: string;
  isCurrent: boolean;
  userAgent: string;
}

export interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password?: string;
  databaseName: string;
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full';
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface WebDriverStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  activeTask: string | null;
  logs: string[];
}

export interface ExternalCorporateActionEventType1Code {}
export interface ExternalAcceptedReason1Code {}
export interface ExternalAccountIdentification1Code {}
export interface ExternalAgentInstruction1Code {}
export interface ExternalAgreementType1Code {}
export interface ExternalAuthenticationChannel1Code {}
export interface ExternalAuthenticationMethod1Code {}
export interface ExternalAuthorityExchangeReason1Code {}
export interface ExternalAuthorityIdentification1Code {}
export interface ExternalBalanceSubType1Code {}
export interface ExternalBalanceType1Code {}
export interface ExternalBankTransactionDomain1Code {}
export interface ExternalBankTransactionFamily1Code {}
export interface ExternalBankTransactionSubFamily1Code {}
export interface ExternalBenchmarkCurveName1Code {}
export interface ExternalBillingBalanceType1Code {}
export interface ExternalBillingCompensationType1Code {}
export interface ExternalBillingRateIdentification1Code {}
export interface ExternalCalculationAgent1Code {}
export interface ExternalCancellationReason1Code {}
export interface ExternalCardTransactionCategory1Code {}
export interface ExternalCashAccountType1Code {}
export interface ExternalCashClearingSystem1Code {}
export interface ExternalCategoryPurpose1Code {}
export interface ExternalChannel1Code {}
export interface ExternalChargeType1Code {}
export interface ExternalChequeAgentInstruction1Code {}
export interface ExternalChequeCancellationReason1Code {}
export interface ExternalChequeCancellationStatus1Code {}
export interface ExternalClaimNonReceiptRejection1Code {}
export interface ExternalClearingSystemIdentification1Code {}
export interface ExternalCollateralReferenceDataStatusReason1Code {}
export interface ExternalCommunicationFormat1Code {}
export interface ExternalContractBalanceType1Code {}
export interface ExternalContractClosureReason1Code {}
export interface ExternalCreditLineType1Code {}
export interface ExternalCreditorAgentInstruction1Code {}
export interface ExternalCreditorEnrolmentAmendmentReason1Code {}
export interface ExternalCreditorEnrolmentCancellationReason1Code {}
export interface ExternalCreditorEnrolmentStatusReason1Code {}
export interface ExternalCreditorReferenceType1Code {}
export interface ExternalDateFrequency1Code {}
export interface ExternalDateType1Code {}
export interface ExternalDebtorActivationAmendmentReason1Code {}
export interface ExternalDebtorActivationCancellationReason1Code {}
export interface ExternalDebtorActivationStatusReason1Code {}
export interface ExternalDebtorAgentInstruction1Code {}
export interface ExternalDeviceOperatingSystemType1Code {}
export interface ExternalDiscountAmountType1Code {}
export interface ExternalDocumentAmountType1Code {}
export interface ExternalDocumentFormat1Code {}
export interface ExternalDocumentLineType1Code {}
export interface ExternalDocumentPurpose1Code {}
export interface ExternalDocumentType1Code {}
export interface ExternalEffectiveDateParameter1Code {}
export interface ExternalEmissionAllowanceSubProductType1Code {}
export interface ExternalEncryptedElementIdentification1Code {}
export interface ExternalEnquiryRequestType1Code {}
export interface ExternalEntitySize1Code {}
export interface ExternalEntityType1Code {}
export interface ExternalEntryStatus1Code {}
export interface ExternalFinancialInstitutionIdentification1Code {}
export interface ExternalFinancialInstrumentIdentificationType1Code {}
export interface ExternalFinancialInstrumentProductType1Code {}
export interface ExternalGarnishmentType1Code {}
export interface ExternalIncoterms1Code {}
export interface ExternalIndustrySectorClassification1Code {}
export interface ExternalInformationType1Code {}
export interface ExternalInstructedAgentInstruction1Code {}
export interface ExternalInvestigationAction1Code {}
export interface ExternalInvestigationActionReason1Code {}
export interface ExternalInvestigationExecutionConfirmation1Code {}
export interface ExternalInvestigationInstrument1Code {}
export interface ExternalInvestigationReason1Code {}
export interface ExternalInvestigationReasonSubType1Code {}
export interface ExternalInvestigationServiceLevel1Code {}
export interface ExternalInvestigationStatus1Code {}
export interface ExternalInvestigationStatusReason1Code {}
export interface ExternalInvestigationSubType1Code {}
export interface ExternalInvestigationType1Code {}
export interface ExternalLegalFramework1Code {}
export interface ExternalLetterType1Code {}
export interface ExternalLocalInstrument1Code {}
export interface ExternalMandateReason1Code {}
export interface ExternalMandateSetupReason1Code {}
export interface ExternalMandateStatus1Code {}
export interface ExternalMandateSuspensionReason1Code {}
export interface ExternalMarketArea1Code {}
export interface ExternalMarketInfrastructure1Code {}
export interface ExternalMessageFunction1Code {}
export interface ExternalModelFormIdentification1Code {}
export interface ExternalNarrativeType1Code {}
export interface ExternalNotificationCancellationReason1Code {}
export interface ExternalNotificationSubType1Code {}
export interface ExternalNotificationType1Code {}
export interface ExternalOrganisationIdentification1Code {}
export interface ExternalPackagingType1Code {}
export interface ExternalPartyRelationshipType1Code {}
export interface ExternalPaymentCancellationRejection1Code {}
export interface ExternalPaymentCompensationReason1Code {}
export interface ExternalPaymentControlRequestType1Code {}
export interface ExternalPaymentGroupStatus1Code {}
export interface ExternalPaymentModificationRejection1Code {}
export interface ExternalPaymentRole1Code {}
export interface ExternalPaymentScenario1Code {}
export interface ExternalPaymentTransactionStatus1Code {}
export interface ExternalPendingProcessingReason1Code {}
export interface ExternalPersonIdentification1Code {}
export interface ExternalPostTradeEventType1Code {}
export interface ExternalProductType1Code {}
export interface ExternalProxyAccountType1Code {}
export interface ExternalPurpose1Code {}
export interface ExternalRatesAndTenors1Code {}
export interface ExternalReRepresentmentReason1Code {}
export interface ExternalReceivedReason1Code {}
export interface ExternalRegulatoryInformationType1Code {}
export interface ExternalRejectedReason1Code {}
export interface ExternalRelativeTo1Code {}
export interface ExternalReportingSource1Code {}
export interface ExternalRequestStatus1Code {}
export interface ExternalReservationType1Code {}
export interface ExternalReturnReason1Code {}
export interface ExternalReversalReason1Code {}
export interface ExternalSecuritiesLendingType1Code {}
export interface ExternalSecuritiesPurpose1Code {}
export interface ExternalSecuritiesUpdateReason1Code {}
export interface ExternalServiceLevel1Code {}
export interface ExternalShipmentCondition1Code {}
export interface ExternalStatusReason1Code {}
export interface ExternalSystemBalanceType1Code {}
export interface ExternalSystemErrorHandling1Code {}
export interface ExternalSystemEventType1Code {}
export interface ExternalSystemMemberType1Code {}
export interface ExternalSystemPartyType1Code {}
export interface ExternalTaxAmountType1Code {}
export interface ExternalTechnicalInputChannel1Code {}
export interface ExternalTradeMarket1Code {}
export interface ExternalTradeTransactionCondition1Code {}
export interface ExternalTypeOfParty1Code {}
export interface ExternalUnableToApplyIncorrectData1Code {}
export interface ExternalUnableToApplyMissingData1Code {}
export interface ExternalUnderlyingTradeTransactionType1Code {}
export interface ExternalUndertakingAmountType1Code {}
export interface ExternalUndertakingDocumentType1Code {}
export interface ExternalUndertakingDocumentType2Code {}
export interface ExternalUndertakingStatusCategory1Code {}
export interface ExternalUndertakingType1Code {}
export interface ExternalUnitOfMeasure1Code {}
export interface ExternalValidationRuleIdentification1Code {}
export interface ExternalVerificationReason1Code {}
export interface Biso20022 {}
/**
 * ==============================================================================
 * SECTION 9: SOVEREIGN IDENTITY, USER PROFILES & SOCIAL GRAPH TYPES
 * ==============================================================================
 * Enterprise-grade identity structures, multi-role authorization matrices,
 * neural-lace telemetry, genomic anchors, and decentralized social graph nodes.
 */

export enum View {
  // --- Core ---
  Dashboard = 'dashboard',
  
  // --- Personal Command ---
  Transactions = 'transactions',
  SendMoney = 'send-money',
  Budgets = 'capital-allocation', // Renamed for spec
  FinancialGoals = 'strategic-goals',
  CreditHealth = 'credit-resonance',
  Personalization = 'interface-will',
  Accounts = 'accounts-overview',
  
  // --- Sovereign Wealth ---
  Investments = 'portfolio-overview',
  Crypto = 'web3-crypto',
  CryptoWeb3 = 'web3-crypto', // Added alias
  AlgoTradingLab = 'algo-trading-lab',
  ForexArena = 'forex-arena',
  CommoditiesExchange = 'commodities',
  RealEstateEmpire = 'real-estate',
  ArtCollectibles = 'art-collectibles',
  DerivativesDesk = 'derivatives',
  VentureCapital = 'venture-capital',
  PrivateEquity = 'private-equity',
  TaxOptimization = 'tax-optimization',
  LegacyBuilder = 'legacy-architect',
  SovereignWealth = 'sovereign-wealth-sim',
  QuantumAssets = 'quantum-assets',
  
  // --- Citi Connect Core ---
  CitibankAccounts = 'citi-accounts',
  CitibankAccountProxy = 'citi-account-proxy',
  CitibankBillPay = 'citi-bill-payment',
  CitibankCrossBorder = 'citi-cross-border',
  CitibankPayeeManagement = 'citi-payee-mgmt',
  CitibankStandingInstructions = 'citi-standing-instructions',
  CitibankDeveloperTools = 'citi-dev-tools',
  CitibankEligibility = 'citi-eligibility-check',
  CitibankUnmaskedData = 'citi-secure-data-view',

  // --- Plaid Nexus ---
  PlaidMainDashboard = 'plaid-overview',
  DataNetwork = 'plaid-overview', // Added alias
  PlaidIdentity = 'plaid-identity-verification',
  PlaidCRAMonitoring = 'plaid-cra-monitoring',
  PlaidInstitutions = 'plaid-institutions-explorer',
  PlaidItemManagement = 'plaid-item-management',
  
  // --- Enterprise Operations ---
  CorporateCommand = 'corporate-command',
  ModernTreasury = 'modern-treasury',
  Treasury = 'treasury-capital',
  CardPrograms = 'marqeta-cards',
  Payments = 'stripe-payments',
  StripeNexus = 'stripe-nexus',
  CounterpartyDashboard = 'counterparties',
  VirtualAccounts = 'virtual-accounts',
  CorporateActions = 'corporate-actions',
  CreditNoteLedger = 'credit-notes',
  ReconciliationHub = 'reconciliation-hub',
  GEINDashboard = 'gein-dashboard',
  CardholderManagement = 'cardholder-mgmt',
  VentureCapitalDeskView = 'vc-desk-view',

  // --- System & Intelligence ---
  AIAdvisor = 'ai-advisor',
  AIInsights = 'predictive-insights',
  QuantumWeaver = 'quantum-weaver',
  AgentMarketplace = 'agent-marketplace',
  AIAdStudio = 'ai-ad-studio',
  GlobalPositionMap = 'global-position-map',
  GlobalSsiHub = 'global-ssi-hub',
  SecurityCompliance = 'security-compliance',
  DeveloperHub = 'developer-hub',
  SchemaExplorer = 'iso-20022-explorer',
  ResourceGraph = 'resource-graph',
  TheVision = 'the-vision',
  ApiPlayground = 'api-playground',
  ComplianceOracle = 'compliance-oracle',

  // --- Admin & Tools ---
  CustomerDashboard = 'customer-dashboard',
  VerificationReports = 'verification-reports',
  FinancialReporting = 'financial-reporting',
  StripeNexusDashboard = 'stripe-nexus-admin',

  // --- Components (Direct Access) ---
  AccountDetails = 'account-details',
  AccountList = 'account-list',
  AccountStatementGrid = 'account-statement-grid',
  AccountsView = 'accounts-view',
  AccountVerificationModal = 'account-verification-modal',
  ACHDetailsDisplay = 'ach-details-display',
  AICommandLog = 'ai-command-log',
  AIPredictionWidget = 'ai-prediction-widget',
  AssetCatalog = 'asset-catalog',
  AutomatedSweepRules = 'automated-sweep-rules',
  BalanceReportChart = 'balance-report-chart',
  BalanceTransactionTable = 'balance-transaction-table',
  CardDesignVisualizer = 'card-design-visualizer',
  ChargeDetailModal = 'charge-detail-modal',
  ChargeList = 'charge-list',
  ConductorConfigurationView = 'conductor-configuration-view',
  CounterpartyDetails = 'counterparty-details',
  CounterpartyForm = 'counterparty-form',
  DisruptionIndexMeter = 'disruption-index-meter',
  DocumentUploader = 'document-uploader',
  DownloadLink = 'download-link',
  EarlyFraudWarningFeed = 'early-fraud-warning-feed',
  ElectionChoiceForm = 'election-choice-form',
  EventNotificationCard = 'event-notification-card',
  ExpectedPaymentsTable = 'expected-payments-table',
  ExternalAccountCard = 'external-account-card',
  ExternalAccountForm = 'external-account-form',
  ExternalAccountsTable = 'external-accounts-table',
  FinancialAccountCard = 'financial-account-card',
  IncomingPaymentDetailList = 'incoming-payment-detail-list',
  InvoiceFinancingRequest = 'invoice-financing-request',
  PaymentInitiationForm = 'payment-initiation-form',
  PaymentMethodDetails = 'payment-method-details',
  PaymentOrderForm = 'payment-order-form',
  PayoutsDashboard = 'payouts-dashboard',
  PnLChart = 'pnl-chart',
  RefundForm = 'refund-form',
  RemittanceInfoEditor = 'remittance-info-editor',
  ReportingView = 'reporting-view',
  ReportRunGenerator = 'report-run-generator',
  ReportStatusIndicator = 'report-status-indicator',
  SsiEditorForm = 'ssi-editor-form',
  StripeNexusView = 'stripe-nexus-view',
  StripeStatusBadge = 'stripe-status-badge',
  StructuredPurposeInput = 'structured-purpose-input',
  SubscriptionList = 'subscription-list',
  TimeSeriesChart = 'time-series-chart',
  TradeConfirmationModal = 'trade-confirmation-modal',
  TransactionFilter = 'transaction-filter',
  TransactionList = 'transaction-list',
  TreasuryTransactionList = 'treasury-transaction-list',
  UniversalObjectInspector = 'universal-object-inspector',
  VirtualAccountForm = 'virtual-account-form',
  VirtualAccountsTable = 'virtual-accounts-table',
  VoiceControl = 'voice-control',
  WebhookSimulator = 'webhook-simulator',

  // Educational & 527 Views
  TheBook = 'the-book',
  KnowledgeBase = 'knowledge-base',
  
  // Auth & Settings
  Settings = 'settings',
  SSO = 'sso',
  ConciergeService = 'concierge-service',
  Philanthropy = 'philanthropy',
  OpenBanking = 'open-banking',
  FinancialDemocracy = 'financial-democracy',
  APIStatus = 'api-status',
  APIIntegration = 'api-integration',
  APIConsole = 'api-console',
  SecurityCenter = 'security-center',
  Security = 'security',
  AIStrategy = 'ai-strategy',
  Goals = 'financial-goals',
  Rewards = 'rewards',
  CardCustomization = 'card-customization',
}

export type UserRole =
  | 'ADMIN'
  | 'TRADER'
  | 'CLIENT'
  | 'VISIONARY'
  | 'CARETAKER'
  | 'QUANT_ANALYST'
  | 'SYSTEM_ARCHITECT'
  | 'ETHICS_OFFICER'
  | 'DATA_SCIENTIST'
  | 'NETWORK_WEAVER'
  | 'CITIZEN'
  | 'FOUNDER'
  | 'INVESTOR'
  | 'MANAGER';

export type SecurityLevel =
  | 'STANDARD'
  | 'ELEVATED'
  | 'TRADING_UNLOCKED'
  | 'QUANTUM_ENCRYPTED'
  | 'SOVEREIGN_CLEARED'
  | 'ARCHITECT_LEVEL';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles?: UserRole[];
  securityLevel?: SecurityLevel;
  netWorth?: number;
  display_name?: string;
  handle?: string;
  role?: string;
  businessId?: string;
  profilePictureUrl?: string;
  bio?: string;
  profile?: {
    interests: string[];
    skills: string[];
    [key: string]: any;
  };
  wallet?: {
    balance: number;
    currency: string;
  };
  businesses?: string[];
  memberships?: any[];
  followers?: string[];
  following?: string[];
  state?: {
    mood: string;
    activity: string;
    last_active_tick: number;
    [key: string]: any;
  };
  isAdmin?: boolean;
  title?: string;
  phone?: string;
  loyaltyTier?: string;
  usdBalance?: number;
  fiatBalance?: number;
  cryptoBalance?: number;
  avatarUrl?: string;
  tradingProfile?: any;
  biometricHashV2?: string;
  genomicSignatureId?: string;
  citizenship?: string;
  reputationScore?: number;
  threatVectorIndex?: number;
  neuralLaceSyncStatus?: string;
  cognitiveProfileId?: string;
  activeThoughtStreamId?: string | null;
  lastLoginCoordinates?: GeoCoordinate;
  temporalAnchorId?: string;
  activeSovereignAgentIds?: string[];
  permissionsGridHash?: string;
}

export type UserProfile = User;

export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  text: string;
  timestamp: string;
}

export interface PostContent {
  text: string;
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  financialData?: any;
}

export interface Post {
  id: string;
  author_id: string;
  userName: string;
  userProfilePic: string;
  created_tick: number;
  content: PostContent;
  type: 'text' | 'image' | 'video' | 'link' | 'financial_event';
  tags: string[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  visibility: 'public' | 'connections' | 'private';
  comments: Comment[];
}

export interface LendingPoolStats {
  totalCapital: number;
  interestRate: number;
  activeLoans: number;
  defaultRate: number;
  totalInterestEarned: number;
}

export interface AppIntegration {
  id: string;
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'disconnected' | 'issue';
}

export interface BiometricData {
  id: string;
  type: string;
  publicKey: string;
  enrolledDate: string;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  device?: string;
  browser?: string;
  os?: string;
  location?: string;
  isCurrent?: boolean;
  userAgent?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  specialization: string;
  traffic: number;
}

export interface SynapticVault {
  id: string;
  ownerIds: string[];
  ownerNames: string[];
  status: string;
  masterPrivateKeyFragment: string;
  creationDate: string;
}

export interface EcosystemKPIs {
  currentDate: string;
  totalEcosystemValue: number;
  totalTransactions: number;
  communityPoolCapital: number;
  activeUsers: number;
  gdp: number;
}

export interface SimulationEvent {
  id: string;
  tick: number;
  type: string;
  description: string;
  impact: any;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: 'service' | 'retail' | 'tech' | 'manufacturing' | 'finance' | 'platform';
  monthly_revenue: number;
  expenses: number;
  employees: string[];
  status: 'active' | 'bankrupt' | 'acquired';
  marketing_factor: number; // 0-1 multiplier
  businessPlan?: string;
  valuation?: number;
  cashBalance?: number;
  hqLocation?: string;
}

/**
 * ==============================================================================
 * SECTION 10: QUANTUM WEALTH, ALGORITHMIC TRADING & ALTERNATIVE ASSETS
 * ==============================================================================
 * Advanced structures for fractional real estate, fine art tokenization,
 * algorithmic trading strategies, venture capital startups, and Stripe ledger balances.
 */

export interface RealEstateProperty {
  id: string;
  address: string;
  value: number;
  rentalIncome: number;
  occupancyRate?: number;
  tokenizedShares?: number;
  yieldYTD?: number;
}

export interface ArtPiece {
  id: string;
  name: string;
  artist: string;
  value: number;
  year: number;
  medium?: string;
  provenance?: string[];
  fractionalOwnershipEnabled?: boolean;
}

export interface AlgoStrategy {
  id: string;
  name: string;
  performance: number;
  risk: 'Low' | 'Medium' | 'High';
  active: boolean;
  sharpeRatio?: number;
  maxDrawdown?: number;
  allocationPercentage?: number;
}

export interface VentureStartup {
  id: string;
  name: string;
  valuation: number;
  investment: number;
  equity: number;
  fundingRound?: 'Seed' | 'SeriesA' | 'SeriesB' | 'SeriesC' | 'Growth';
  burnRate?: number;
  runwayMonths?: number;
}

export interface StripeBalance {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
}

export interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number;
  description: string;
  customer_id?: string;
  receipt_url?: string;
  metadata: KeyValuePairs;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
  total_spent?: number;
  metadata?: KeyValuePairs;
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: number;
  plan_id: string;
  amount: number;
}

export type StripeResource = any;

/**
 * ==============================================================================
 * SECTION 11: GATEKEEPER VERIFICATION & CRYPTOGRAPHIC LEDGERS
 * ==============================================================================
 * Types governing secure micro-deposit verification, Modern Treasury external
 * account validation, and multi-factor cryptographic gatekeepers.
 */

export interface VerifyParams {
  externalAccountId: string;
  originatingAccountId: string;
  paymentType: 'ach' | 'eft' | 'rtp';
  currency: string;
  authToken: string; // The base64 string provided by user
}

export interface VerifyError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * ==============================================================================
 * SECTION 12: SACRED GEOMETRY, GEMATRIA & THEOLOGICAL PATTERNS
 * ==============================================================================
 * Types governing mathematical patterns, triangular numbers, gematria calculations,
 * and multi-layered cosmic/historical pattern analysis.
 */

export interface BibleBook {
  index: number;
  name: string;
  chapters: number;
  isTriangular: boolean;
}

export interface GematriaResult {
  word: string;
  sum: number;
  language: string;
  category: string;
}

export interface TriangularMetadata {
  index: number;
  value: number;
  significance: string;
}

export interface PatternLayer {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: 'Scripture' | 'Math' | 'Science' | 'Cosmic' | 'History';
}

/**
 * ==============================================================================
 * SECTION 13: LITERARY TRANSLATION, MANUSCRIPTS & REPOSITORY COMPENDIUMS
 * ==============================================================================
 * Types governing the transformation of raw codebases into literary masterpieces,
 * New York Times best-seller manuscripts, and virtual repository consensus engines.
 */

export interface Page {
  title: string;
  content: string; // Changed from string[] to string for narrative content
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  technicalSummary: string;
  imageryPrompt: string;
  imageUrl?: string;
  pages?: Page[];
}

export interface Section {
  title: string;
  chapters: Chapter[];
}

export type Book = Section[];

export interface Manuscript {
  repoName: string;
  title: string;
  preface: string;
  chapters: Chapter[];
  conclusion: string;
  generatedAt: string;
  author: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface KnowledgeBaseFile extends GitHubFile {
  repoName: string;
}

export interface AuditItem {
  file: GitHubFile;
  repo: GithubRepo;
}

export interface FileAnalysis {
  path: string;
  name: string;
  thoughts: string;
  hypnoticCommand: string;
  imageUrl?: string;
}

export interface ProjectCompendium {
  repoName: string;
  summaries: FileAnalysis[];
  masterStory: string;
  sacredDecree: string;
  ultimateBibliography: string;
  analyzedAt: string;
  totalFilesProcessed: number;
}

export interface VirtualRepository {
  name: string;
  files: Map<string, FileAnalysis>;
  consensus: any;
  isReady: boolean;
}

export interface SelectedContext {
  repo: GithubRepo | null;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
  isGenerating: boolean;
  status: string;
  compendium?: ProjectCompendium | null;
  virtualRepo?: VirtualRepository | null;
}

export interface RepoSession {
  repoId: number;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
}

/**
 * ==============================================================================
 * SECTION 14: ENTERPRISE PAYMENTS, SIMULATIONS & CLIENT REGISTRATION
 * ==============================================================================
 * Types governing enterprise-grade payee management, simulation engines,
 * client registration responses, and line-item ledger updates.
 */

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
}

export interface CustomerProfileResponse {
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  companyName: string;
  emails: Array<{
    emailAddress: string;
    preferenceType: string;
  }>;
  addressList: Array<{
    addressLine1: string;
    city: string;
    countryCode: string;
    postalCode: string;
    addressType: string;
  }>;
  phones: Array<{
    phoneType: string;
    fullPhoneNumber: string;
    preferenceType: string;
  }>;
}

export interface ClientRegisterResponse {
  client_id: string;
  client_secret: string;
  client_name: string;
  appId?: string;
  redirect_uris: string[];
  scope: string[];
  token_endpoint_auth_method?: string;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * ==============================================================================
 * SECTION 15: ADVANCED TYPESCRIPT UTILITY & TYPE-LEVEL PROGRAMMING
 * ==============================================================================
 * High-performance utility types for deep partials, readonly mapping,
 * union-to-intersection conversions, and type-safe property picking.
 */

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type PickProperties<T, U> = Pick<T, KeysOfType<T, U>>;

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type TupleToUnion<T extends any[]> = T[number];

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
/**
 * ==============================================================================
 * SECTION 16: ISO 20022 XML/JSON SCHEMA DEFINITIONS & MX/MT MESSAGE PARSERS
 * ==============================================================================
 * Exhaustive, production-grade type definitions for ISO 20022 financial messaging.
 * Covers pacs.008, pacs.009, pain.001, and camt.053 schemas with complete structural fidelity.
 */

export interface ActiveOrHistoricCurrencyAndAmount {
  value: number;
  currency: string;
}

export interface PostalAddress24 {
  adrTp?: 'MNDT' | 'ALCO' | 'BIZZ' | 'COMM' | 'DLVY' | 'HEAD' | 'OFFI' | 'HOME' | 'PBOX';
  dept?: string;
  subDept?: string;
  strtNm?: string;
  bldgNb?: string;
  bldgNm?: string;
  pstCd?: string;
  twnNm?: string;
  subPrvnc?: string;
  ctrySubDvsn?: string;
  ctry?: string;
  adrLine?: string[];
}

export interface PartyIdentification135 {
  nm?: string;
  pstlAdr?: PostalAddress24;
  id?: {
    orgId?: {
      anyBIC?: string;
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
    prvtId?: {
      dtAndPlcOfBirth?: {
        birthDt: string;
        prvncOfBirth?: string;
        cityOfBirth: string;
        ctryOfBirth: string;
      };
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
  };
  ctctDtls?: {
    nmPrfx?: 'DOCT' | 'MADM' | 'MISS' | 'MIST' | 'MIXX';
    nm?: string;
    phneNb?: string;
    mobPhneNb?: string;
    faxNb?: string;
    emailAdr?: string;
    emailPurp?: string;
    jobTitl?: string;
    rspnsblty?: string;
    dept?: string;
  };
}

export interface ClearingSystemMemberIdentification2 {
  clrSysId?: {
    cd?: string;
    prtry?: string;
  };
  mmbId: string;
}

export interface BranchAndFinancialInstitutionIdentification6 {
  finInstnId: {
    bicfi?: string;
    clrSysMmbId?: ClearingSystemMemberIdentification2;
    nm?: string;
    pstlAdr?: PostalAddress24;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  brnch?: {
    id?: string;
    nm?: string;
    pstlAdr?: PostalAddress24;
  };
}

export interface CashAccount38 {
  id: {
    iban?: string;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  tp?: {
    cd?: string;
    prtry?: string;
  };
  ccy?: string;
  nm?: string;
  prxy?: {
    tp?: { cd?: string; prtry?: string };
    id: string;
  };
}

export interface PaymentIdentification7 {
  instrId?: string;
  endToEndId: string;
  uetr?: string;
  txId?: string;
  clrSysRef?: string;
}

export interface GroupHeader93 {
  msgId: string;
  creDtTm: string;
  authstn?: {
    cd?: string;
    prtry?: string;
  }[];
  btchBookg?: boolean;
  nbOfTxs: string;
  ctrlSum?: number;
  initgPty?: PartyIdentification135;
  fwdgAgt?: BranchAndFinancialInstitutionIdentification6;
}

export interface CreditTransferTransaction39 {
  pmtId: PaymentIdentification7;
  pmtTpInf?: {
    instrPrty?: 'HIGH' | 'NORM';
    svcLvl?: { cd?: string; prtry?: string }[];
    lclInstrm?: { cd?: string; prtry?: string };
    ctgyPurp?: { cd?: string; prtry?: string };
  };
  intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
  intrBkSttlmDt?: string;
  sttlmPrty?: 'HIGH' | 'NORM';
  chrgBr: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
  chrgsInf?: {
    amt: ActiveOrHistoricCurrencyAndAmount;
    agt: BranchAndFinancialInstitutionIdentification6;
  }[];
  instgAgt?: BranchAndFinancialInstitutionIdentification6;
  instdAgt?: BranchAndFinancialInstitutionIdentification6;
  dbtr: PartyIdentification135;
  dbtrAcct?: CashAccount38;
  dbtrAgt: BranchAndFinancialInstitutionIdentification6;
  dbtrAgtAcct?: CashAccount38;
  cdtrAgt: BranchAndFinancialInstitutionIdentification6;
  cdtrAgtAcct?: CashAccount38;
  cdtr: PartyIdentification135;
  cdtrAcct?: CashAccount38;
  ultmtDbtr?: PartyIdentification135;
  ultmtCdtr?: PartyIdentification135;
  purp?: { cd?: string; prtry?: string };
  rgltryRptg?: {
    dbtCdtFlg?: 'DBIT' | 'CDIT';
    authrty?: { nm?: string; ctry?: string };
    dtls?: { cd?: string; prtry?: string; inf?: string[] }[];
  }[];
  rltdRmtInf?: {
    fcmtId?: string;
    docTp?: string;
    docNb?: string;
    dt?: string;
  }[];
  rmtInf?: {
    ustrd?: string[];
    strd?: {
      rfrdDocInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        nb?: string;
        rltdDt?: string;
      }[];
      rfrdDocAmt?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        amt: ActiveOrHistoricCurrencyAndAmount;
      }[];
      cdtrRefInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        ref?: string;
      };
      invcr?: PartyIdentification135;
      invcee?: PartyIdentification135;
    }[];
  };
}

export interface Pacs008Document {
  fitoficstmdbtct: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: CreditTransferTransaction39[];
  };
}

export interface Pacs009Document {
  ficreditTransfer: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: {
      pmtId: PaymentIdentification7;
      intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
      intrBkSttlmDt?: string;
      instgAgt?: BranchAndFinancialInstitutionIdentification6;
      instdAgt?: BranchAndFinancialInstitutionIdentification6;
      dbtr: BranchAndFinancialInstitutionIdentification6;
      dbtrAcct?: CashAccount38;
      dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtr: BranchAndFinancialInstitutionIdentification6;
      cdtrAcct?: CashAccount38;
    }[];
  };
}

export interface Pain001Document {
  cstmrCdtTrfInitn: {
    grpHdr: GroupHeader93;
    pmtInf: {
      pmtInfId: string;
      pmtMtd: 'TRF' | 'CHK' | 'TRA';
      btchBookg?: boolean;
      nbOfTxs?: string;
      ctrlSum?: number;
      pmtTpInf?: {
        instrPrty?: 'HIGH' | 'NORM';
        svcLvl?: { cd?: string; prtry?: string }[];
        lclInstrm?: { cd?: string; prtry?: string };
        ctgyPurp?: { cd?: string; prtry?: string };
      };
      reqdExctnDt: {
        dt?: string;
        dtTm?: string;
      };
      dbtr: PartyIdentification135;
      dbtrAcct: CashAccount38;
      dbtrAgt: BranchAndFinancialInstitutionIdentification6;
      dbtrAgtAcct?: CashAccount38;
      ultmtDbtr?: PartyIdentification135;
      chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
      cdtTrfTxInf: {
        pmtId: PaymentIdentification7;
        amt: {
          instdAmt?: ActiveOrHistoricCurrencyAndAmount;
          eqvAmt?: {
            amt: ActiveOrHistoricCurrencyAndAmount;
            ccyOfTrf: string;
          };
        };
        chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
        cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
        cdtrAgtAcct?: CashAccount38;
        cdtr: PartyIdentification135;
        cdtrAcct?: CashAccount38;
        ultmtCdtr?: PartyIdentification135;
        purp?: { cd?: string; prtry?: string };
        rmtInf?: { ustrd?: string[] };
      }[];
    }[];
  };
}

export interface Camt053Document {
  bkToCstmrStmt: {
    grpHdr: GroupHeader93;
    stmt: {
      id: string;
      elctrncSeqNb?: number;
      creDtTm: string;
      frToDt?: {
        frDtTm: string;
        toDtTm: string;
      };
      acct: CashAccount38;
      bal: {
        tp: {
          cdOrPrtry: { cd: string; prtry?: string };
        };
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        dt: { dtTm: string };
      }[];
      ntry?: {
        ntryRef?: string;
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        sts: 'BOOK' | 'PDNG';
        bookgDt?: { dtTm: string };
        valDt?: { dtTm: string };
        acctSvcrRef?: string;
        ntryDtls?: {
          txDtls?: {
            refs?: {
              endToEndId?: string;
              uetr?: string;
              txId?: string;
            };
            amtDtls?: {
              instdAmt?: {
                amt: ActiveOrHistoricCurrencyAndAmount;
              };
            };
            rltdPties?: {
              dbtr?: PartyIdentification135;
              cdtr?: PartyIdentification135;
            };
            rltdAgts?: {
              dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
              cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
            };
          }[];
        }[];
      }[];
    }[];
  };
}

/**
 * ==============================================================================
 * SECTION 17: QUANTUM LEDGER & MULTI-NODE CONSENSUS MESH PROTOCOL (NEXUS-V3)
 * ==============================================================================
 * Advanced cryptographic structures for zero-knowledge proofs, post-quantum
 * signatures, threshold multi-sig, and decentralized consensus state machines.
 */

export type QuantumSignatureScheme = 'Dilithium5' | 'Falcon1024' | 'SPHINCS+' | 'XMSS_MT';

export interface QuantumPublicKey {
  scheme: QuantumSignatureScheme;
  rawBytes: string; // Base64 encoded public key
  fingerprint: string; // SHA3-256 hash of the public key
}

export interface ZkProofPayload {
  provingSystem: 'Groth16' | 'Plonk' | 'Halo2' | 'Bulletproofs';
  proofBytes: string; // Base64 encoded proof
  publicInputs: string[]; // Array of public input values
  verificationKeyHash: string;
}

export interface ThresholdSignatureConfig {
  threshold: number; // 't' in t-of-n
  totalSigners: number; // 'n'
  publicKeys: QuantumPublicKey[];
  epochId: number;
}

export interface ConsensusState {
  currentEpoch: number;
  currentRound: number;
  leaderNodeId: string;
  activeValidators: string[];
  consensusThreshold: number;
  lastCommittedBlockHeight: number;
  lastCommittedBlockHash: string;
  pendingProposalsCount: number;
}

export interface StateChannel {
  channelId: string;
  participants: string[];
  nonce: number;
  balances: Record<string, ActiveOrHistoricCurrencyAndAmount>;
  signatures: Record<string, string>;
  status: 'OPEN' | 'CLOSING' | 'CLOSED' | 'DISPUTED';
  disputeTimeoutBlock?: number;
}

export interface MeshNode {
  nodeId: string;
  endpoint: string;
  version: string;
  reputationScore: number;
  latencyMs: number;
  isValidator: boolean;
  stakingBalance: ActiveOrHistoricCurrencyAndAmount;
  lastHeartbeat: string;
}

export interface BlockHeader {
  height: number;
  previousHash: string;
  merkleRoot: string;
  stateRoot: string;
  timestamp: number;
  validatorSignature: string;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface TransactionPayload {
  txHash: string;
  sender: string;
  recipient: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  nonce: number;
  gasLimit: number;
  gasPrice: ActiveOrHistoricCurrencyAndAmount;
  signature: string;
  zkProof?: ZkProofPayload;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface ConsensusMessage {
  messageId: string;
  senderNodeId: string;
  epoch: number;
  round: number;
  type: 'PROPOSE' | 'PREVOTE' | 'PRECOMMIT' | 'DECIDE';
  blockHash: string;
  signature: string;
}

/**
 * ==============================================================================
 * SECTION 18: AI SWARM ORCHESTRATION, AGENTIC WORKFLOWS & COGNITIVE THOUGHT STREAMS
 * ==============================================================================
 * Types governing multi-agent swarms, task decomposition graphs, agent-to-agent
 * communication protocols, vector database embeddings, and cognitive thought stream logs.
 */

export type AgentRole = 'ORCHESTRATOR' | 'CRITIC' | 'REFINER' | 'RESEARCHER' | 'CODER' | 'COMPLIANCE_OFFICER' | 'FINANCIAL_ANALYST';

export interface AgentCapability {
  name: string;
  description: string;
  parametersSchema: Record<string, any>; // JSON Schema for tool parameters
}

export interface TaskDecompositionNode {
  taskId: string;
  parentTaskId: string | null;
  assignedAgentId: string;
  description: string;
  dependencies: string[]; // Array of taskIds that must complete first
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  error?: string;
  attempts: number;
  maxAttempts: number;
}

export interface SwarmOrchestratorState {
  swarmId: string;
  activeAgents: Record<string, {
    agentId: string;
    role: AgentRole;
    status: 'IDLE' | 'WORKING' | 'CRITICIZING' | 'OFFLINE';
    currentTaskId?: string;
  }>;
  taskGraph: Record<string, TaskDecompositionNode>;
  overallProgress: number; // 0.0 to 1.0
  status: 'IDLE' | 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
}

export interface AgentMessage {
  messageId: string;
  senderId: string;
  recipientId: string; // Can be 'ALL' or specific agentId
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
  replyToId?: string;
}

export interface ThoughtStreamNode {
  nodeId: string;
  agentId: string;
  timestamp: number;
  thoughtType: 'OBSERVATION' | 'REASONING' | 'HYPOTHESIS' | 'CRITIQUE' | 'DECISION';
  content: string;
  confidenceScore: number; // 0.0 to 1.0
  parentThoughtId: string | null;
}

export interface VectorEmbedding {
  id: string;
  vector: number[];
  textPayload: string;
  metadata: Record<string, string | number | boolean>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface ToolExecutionContext {
  toolName: string;
  arguments: Record<string, any>;
  callerAgentId: string;
  timestamp: number;
  executionTimeMs?: number;
  status: 'SUCCESS' | 'ERROR';
  result?: any;
  error?: string;
}

/**
 * ==============================================================================
 * SECTION 19: ADVANCED ALGORITHMIC TRADING, HIGH-FREQUENCY ORDER BOOKS & RISK ENGINES
 * ==============================================================================
 * Types governing real-time order books (L1/L2/L3), market makers, execution
 * algorithms (TWAP, VWAP, Sniper), portfolio risk metrics, and margin/liquidation engines.
 */

export interface OrderBookLevel {
  price: number;
  quantity: number;
  orderCount?: number;
}

export interface OrderBookL2 {
  ticker: string;
  timestamp: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface OrderBookL3 {
  ticker: string;
  timestamp: number;
  bids: { orderId: string; price: number; quantity: number; ownerId: string }[];
  asks: { orderId: string; price: number; quantity: number; ownerId: string }[];
}

export type AlgoExecutionStrategy = 'TWAP' | 'VWAP' | 'SNIPER' | 'ICEBERG' | 'GRID' | 'MARKET_MAKER';

export interface AlgoTradingJob {
  jobId: string;
  ticker: string;
  strategy: AlgoExecutionStrategy;
  side: 'BUY' | 'SELL';
  totalQuantity: number;
  executedQuantity: number;
  limitPrice?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  parameters: {
    startTime: string;
    endTime: string;
    sliceIntervalSeconds?: number;
    maxParticipationRate?: number; // For VWAP
    icebergDisplayQuantity?: number;
  };
  status: 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  averageExecutionPrice: number;
  slippageBps: number;
  logs: string[];
}

export interface PortfolioRiskMetrics {
  portfolioId: string;
  timestamp: number;
  valueAtRisk95: ActiveOrHistoricCurrencyAndAmount; // 95% confidence VaR
  valueAtRisk99: ActiveOrHistoricCurrencyAndAmount; // 99% confidence VaR
  expectedShortfall: ActiveOrHistoricCurrencyAndAmount;
  sharpeRatio: number;
  sortinoRatio: number;
  betaToBenchmark: number;
  alphaToBenchmark: number;
  maxDrawdown: number;
  volatilityAnnualized: number;
}

export interface MarginAccount {
  accountId: string;
  collateralBalance: ActiveOrHistoricCurrencyAndAmount;
  borrowedBalance: ActiveOrHistoricCurrencyAndAmount;
  maintenanceMarginRequirement: number; // Percentage, e.g., 0.15 for 15%
  initialMarginRequirement: number; // Percentage, e.g., 0.30 for 30%
  currentMarginRatio: number; // collateral / borrowed
  liquidationPrice: number;
  status: 'HEALTHY' | 'MARGIN_CALL' | 'LIQUIDATING' | 'LIQUIDATED';
}

export interface LiquidationEvent {
  liquidationId: string;
  accountId: string;
  timestamp: number;
  liquidatedAsset: string;
  liquidatedQuantity: number;
  executionPrice: number;
  penaltyFee: ActiveOrHistoricCurrencyAndAmount;
  remainingCollateral: ActiveOrHistoricCurrencyAndAmount;
}import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}
/**
 * ==============================================================================
 * SECTION 3: EXECUTIVE MAGAZINE & MULTIMEDIA CREATION TYPES
 * ==============================================================================
 * Types governing the generation, layout, rendering, and narration of high-end
 * digital publications, executive lookbooks, and AI-driven multimedia assets.
 */

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
  'Wall Street Boardroom',
  'Silicon Valley Tech Campus',
  'Dubai Skyscraper Penthouse',
  'Paris Fashion Week Front Row',
  'Private Island Villa',
  'Luxury Private Jet',
  'Monaco Yacht Deck',
  'Swiss Alps Davos Summit'
];

export const STYLES = [
  'Power Suit (Classic Bespoke)',
  'Tech Mogul (Minimalist Luxury)',
  'Black Tie Gala (Formal)',
  'Avant-Garde Executive (Bold)',
  'Old Money (Quiet Luxury)',
  'Streetwear CEO (High-End Casual)'
];

export type RenderingEngine = 'stable-diffusion' | 'midjourney' | 'dall-e-3' | 'flux' | 'imagen' | 'custom-gan';

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
  lighting?: string;
  cameraAngle?: string;
  colorPalette?: string[];
  historicalReference?: string;
  brandTags?: string[];
}

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  videoUrl?: string;
  isAnimating?: boolean;
  audioUrl?: string;
  narrationText?: string;
  renderingEngine?: RenderingEngine;
  promptUsed?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  seed?: number;
  cfgScale?: number;
  steps?: number;
  generationTimeMs?: number;
  error?: string;
}

export interface Asset {
  id: string;
  base64: string;
  desc: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  body: string;
  elements: VisualElement[];
}

export interface VisualElement {
  id: string;
  type: 'image' | 'seal' | 'divider' | 'illustration' | 'scenery';
  src: string;
  position: { x: number; y: number };
  alt: string;
  isAnimated?: boolean;
  scale?: number;
  rotation?: number;
}

export enum AIServiceAction {
  REWRITE = 'REWRITE',
  ILLUMINATE = 'ILLUMINATE',
  PROPHESY = 'PROPHESY',
  SEAL = 'SEAL',
  CIPHER = 'CIPHER',
  SCENERY = 'SCENERY',
  ENCHANT = 'ENCHANT'
}

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Ariel' | 'Oberon' | 'Titania';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  sampleRateHz?: number;
  languageCode?: string;
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
  audioUrl?: string;
  durationMs?: number;
  characterCount: number;
}

/**
 * ==============================================================================
 * SECTION 4: NEWS, FEEDS & SENTIMENT ANALYSIS TYPES
 * ==============================================================================
 * Structures governing real-time financial news aggregation, sentiment analysis,
 * urgency scoring, and AI-driven market insights.
 */

export enum StaticCategory {
  TOP_STORIES = 'Global Pulse',
  POLITICS = 'Governance',
  TECH = 'Infrastructure',
  FINANCE = 'Markets',
  CRYPTO = 'Decentralized Ledger',
  ENERGY = 'Thermodynamics',
  BIOTECH = 'Genomics',
  SPACE = 'Orbital Mechanics'
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: number; // Scale of 1-10
  tags: string[];
  author?: string;
  content?: string;
  imageUrl?: string;
  sentimentScore?: number; // Continuous value from -1.0 to 1.0
  relevanceScore?: number; // Continuous value from 0.0 to 1.0
  language?: string;
  isFactChecked?: boolean;
  factCheckDetails?: string;
  biasRating?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  relatedTickers?: string[];
}

export interface FeedPage {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  lastUpdated: string;
  aiInsights: string;
  curatorId?: string;
  isPublic: boolean;
  subscriberCount?: number;
  customFilterCriteria?: FilterCriterion[];
}

/**
 * ==============================================================================
 * SECTION 5: FILE SYSTEM, STORAGE & CLOUD MANAGEMENT TYPES
 * ==============================================================================
 * Types governing local and cloud file systems, indexing, AI-assisted summaries,
 * and multi-source repository exploration.
 */

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  GENERIC = 'generic',
  CODE = 'code',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  DATABASE = 'database',
  MODEL_3D = 'model_3d'
}

export type FileSource = 'local' | 'github' | 'ai' | 'google-drive' | 'aws-s3' | 'ipfs' | 'dropbox';

export interface FileVersion {
  versionId: string;
  modifiedBy: string;
  modifiedAt: string;
  size: number;
  changeLog?: string;
  downloadUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string | null;
  source: FileSource;
  extension?: string;
  mimeType?: string;
  content?: string; // Text, DataURL, or Download URL
  aiSummary?: string;
  aiKeywords?: string[];
  isIndexing?: boolean;
  githubRepo?: string;
  githubOwner?: string;
  githubUrl?: string;
  driveFileId?: string;
  isCloudFolder?: boolean;
  ownerId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  versionHistory?: FileVersion[];
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  hash?: string;
  tags?: string[];
}

export interface NavigationState {
  currentPath: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid' | 'gallery' | 'tree' | 'kanban';
  sortBy: 'name' | 'size' | 'lastModified' | 'type';
  sortDirection: 'asc' | 'desc';
  searchQuery?: string;
  filterType?: FileType | 'all';
}

/**
 * ==============================================================================
 * SECTION 6: CORE BANKING, TRANSACTIONS & CAPITAL ALLOCATION TYPES
 * ==============================================================================
 * Foundational types for personal and corporate banking, ledger accounts,
 * transaction processing, and AI-driven financial planning.
 */

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'fedwire' | 'rtp';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'credit' | 'debit';

export type TransactionStatus =
  | 'POSTED'
  | 'PENDING'
  | 'Initiated'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'needs_approval'
  | 'approved'
  | 'denied'
  | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string | string[];
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: KeyValuePairs;
  pending?: boolean;
  reconciled?: boolean;
  reconciliation_id?: string;
  nexus_link_id?: string;
  institution_origin?: string;
  cardId?: string;
  holderName?: string;
  merchant?: string;
  status?: TransactionStatus;
  timestamp?: string;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string;
  assetClass?: string;
  riskLevel?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining?: number;
  category?: string;
  alerts?: Alert[];
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
  credits: number;
}

export interface AIPlanStep {
  title: string;
  description: string;
  timeline: string;
  category?: string;
}

export interface AIPlan {
  title: string;
  summary: string;
  steps: AIPlanStep[];
}

export type IllusionType = 'none' | 'aurora' | 'blue' | 'dark';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  institutionId?: string;
  type?: string;
  balance?: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: string;
}

export enum WeaverStage {
  Pitch = 'pitch',
  Analysis = 'analysis',
  Test = 'test',
  FinalReview = 'final_review',
  Approved = 'approved',
  Results = 'results',
  Error = 'error'
}

export interface QuantumWeaverState {
  stage: WeaverStage;
  businessPlan: string;
  feedback: string;
  questions: AIQuestion[];
  loanAmount: number;
  coachingPlan: AIPlan | null;
  error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  aiJustification?: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress?: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCardControls {
  atm: boolean;
  contactless: boolean;
  online: boolean;
  monthlyLimit: number;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: CorporateCardControls;
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description?: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Counterparty {
  id: string;
  name: string;
  email?: string | null;
  send_remittance_advice?: boolean;
  type?: 'business' | 'individual';
  riskLevel?: 'Low' | 'Medium' | 'High';
  createdDate?: string;
  accounts: ExternalAccount[];
  virtualAccounts: VirtualAccount[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name?: string;
  verification_status?: string;
  account_details?: any[];
  routing_details?: any[];
}

export interface VirtualAccount {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  balance?: number;
  currency?: string;
  status?: string;
  subAccounts?: VirtualAccount[];
  description?: string;
  counterparty_id?: string;
  internal_account_id?: string;
  debit_ledger_account_id?: string;
  credit_ledger_account_id?: string;
  metadata?: any;
  account_details?: any[];
  routing_details?: any[];
}

export interface AIGoalPlanStep {
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Investing' | 'Income' | string;
}

export interface AIGoalPlan {
  feasibilitySummary: string;
  monthlyContribution: number;
  steps: AIGoalPlanStep[];
  actionableSteps?: string[];
  summary?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'recurring';
}

export interface RecurringContribution {
  id: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface LinkedGoal {
  id: string;
  relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
  triggerAmount?: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  iconName: string;
  plan: AIGoalPlan | null;
  startDate: string;
  riskProfile?: RiskProfile;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  linkedGoals: LinkedGoal[];
  recurringContributions: RecurringContribution[];
  contributions: Contribution[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number; // in reward points
  type: 'cashback' | 'giftcard' | 'impact' | string;
  description: string;
  iconName: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini' | string;

export interface APIStatus {
  provider: APIProvider;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number; // in ms
}

export interface CreditFactor {
  name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix' | string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}
/**
 * ==============================================================================
 * SECTION 7: PLAID, MARQETA, MODERN TREASURY & OPEN BANKING INTEGRATION TYPES
 * ==============================================================================
 * Enterprise-grade types governing secure connections, credential management,
 * card issuance, ledgering, and multi-node financial mesh protocols.
 */

export interface PlaidCredentials {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

export interface MarqetaCredentials {
  app_token?: string;
  admin_token?: string;
  applicationToken?: string;
  adminAccessToken?: string;
  base_url?: string;
}

export interface ModernTreasuryCredentials {
  apiKey: string;
  orgId?: string;
  organizationId?: string;
}

export interface PlaidTokenState {
  linkToken: string | null;
  publicToken: string | null;
  accessToken: string | null;
}

export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: AccountBalance;
  institution?: string;
}

export interface ConnectedItem {
  institutionId: string;
  institutionName: string;
  accessToken: string;
  itemId: string;
  accounts: Account[];
  transactions: Transaction[];
  metadata: {
    linked_at: string;
    node_priority: number;
    mesh_protocol: 'NEXUS-V3' | string;
    routing_hops: string[];
  };
}

export interface UCCFiling {
  id: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Filed' | 'Rejected';
  receiptId?: string;
  fileNumber?: string;
  packetNum: string;
  transType: 'Initial' | 'Amendment';
  amount: number;
  dateCreated: string;
  xmlPayload: string;
  errors?: string[];
}

export interface UnifiedPayload {
  timestamp: string;
  nexus_version: string;
  nexus_id: string;
  global_metadata: {
    client_context: string;
    reconciliation_depth: number;
    combined_hash: string;
  };
  mesh_stats: {
    total_liquidity: number;
    total_liabilities: number;
    net_position: number;
    active_institutions: number;
  };
  cross_institutional_ledger: {
    items: ConnectedItem[];
    reconciled_pairs: any[];
  };
  compliance: {
    active_ucc_filings: UCCFiling[];
  };
}

export enum FlowStep {
  CREDENTIALS = 'CREDENTIALS',
  LINK_TOKEN = 'LINK_TOKEN',
  LINK_UI = 'LINK_UI',
  EXCHANGE = 'EXCHANGE',
  DASHBOARD = 'DASHBOARD',
  UCC_CENTER = 'UCC_CENTER',
  MARQETA_NODE = 'MARQETA_NODE',
  MODERN_TREASURY_NODE = 'MODERN_TREASURY_NODE',
  TAXONOMY_REGISTRY = 'TAXONOMY_REGISTRY'
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  created_time?: string;
  start_date?: string;
  config: any;
}

export interface MarqetaCard {
  token: string;
  user_token: string;
  card_product_token: string;
  last_four: string;
  pan: string;
  expiration: string;
  cvv: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | string;
}

export interface MTLedger {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, string>;
}

export interface MTInternalAccount {
  id: string;
  name: string;
  currency: string;
  connection: { vendor_name: string };
  status: string;
}

export interface PlaidLinkSuccessMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id?: string;
}

export type PlaidProduct =
  | 'assets'
  | 'auth'
  | 'balance'
  | 'identity'
  | 'investments'
  | 'liabilities'
  | 'payment_initiation'
  | 'transactions';

export interface MarqetaUser {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  last_modified_time: string;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns?: string;
  };
  provider?: any;
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface LedgerAccount {
  id: string;
  name: string;
  balances: {
    available_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
    posted_balance: { amount: number; currency: string };
  };
}

export interface SettlementInstruction {
  messageId: string;
  creationDateTime: string;
  numberOfTransactions: number;
  settlementDate: string;
  totalAmount: number;
  currency: string;
  purpose?: string;
}

/**
 * ==============================================================================
 * SECTION 8: ENTERPRISE OPERATIONS, CORPORATE COMMAND, COMPLIANCE & ISO 20022
 * ==============================================================================
 * Types governing corporate command centers, compliance audits, anomaly detection,
 * cash flow forecasting, and ISO 20022 financial messaging standards.
 */

export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore?: number;
  recommendedAction?: string;
}

export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

export interface FraudRule {
  id: string;
  name: string;
  description?: string;
  severity: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
}

export interface ComplianceCase {
  id: string;
  reason: string;
  entityType: string;
  entityId: string;
  status: 'open' | 'closed' | 'investigating' | string;
  openedDate: string;
  type?: string;
  description?: string;
}

export interface FinancialAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: AnomalyStatus;
  entityType: string;
  entityId: string;
  entityDescription: string;
  timestamp: string;
  riskScore: number;
}

export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'False Positive';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  action: 'flag_for_review' | 'block' | 'notify_admin' | string;
  active: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  revenue: number;
  growth: number;
  riskScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetResource: string;
  success: boolean;
  details?: string;
  metadata?: any;
  ipAddress?: string;
}

export interface ThreatAlert {
  alertId: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataSharingPolicy {
  policyId: string;
  policyName: string;
  scope: string;
  isActive: boolean;
  lastReviewed: string;
}

export interface APIKey {
  id: string;
  keyName: string;
  creationDate: string;
  scopes: string[];
  lastUsed?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  verified: boolean;
}

export interface SecurityAwarenessModule {
  moduleId: string;
  title: string;
  completionRate: number;
}

export interface TransactionRule {
  ruleId: string;
  name: string;
  triggerCondition: string;
  action: string;
  isEnabled: boolean;
}

export interface SecurityScoreMetric {
  metricName: string;
  currentValue: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  lastActivity: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  permissions: string[];
  status: string;
  firstSeen: string;
  userAgent: string;
  pushNotificationsEnabled: boolean;
  biometricAuthEnabled: boolean;
  encryptionStatus: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  timestamp: string;
  isCurrent: boolean;
  userAgent: string;
}

export interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password?: string;
  databaseName: string;
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full';
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface WebDriverStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  activeTask: string | null;
  logs: string[];
}

export interface ExternalCorporateActionEventType1Code {}
export interface ExternalAcceptedReason1Code {}
export interface ExternalAccountIdentification1Code {}
export interface ExternalAgentInstruction1Code {}
export interface ExternalAgreementType1Code {}
export interface ExternalAuthenticationChannel1Code {}
export interface ExternalAuthenticationMethod1Code {}
export interface ExternalAuthorityExchangeReason1Code {}
export interface ExternalAuthorityIdentification1Code {}
export interface ExternalBalanceSubType1Code {}
export interface ExternalBalanceType1Code {}
export interface ExternalBankTransactionDomain1Code {}
export interface ExternalBankTransactionFamily1Code {}
export interface ExternalBankTransactionSubFamily1Code {}
export interface ExternalBenchmarkCurveName1Code {}
export interface ExternalBillingBalanceType1Code {}
export interface ExternalBillingCompensationType1Code {}
export interface ExternalBillingRateIdentification1Code {}
export interface ExternalCalculationAgent1Code {}
export interface ExternalCancellationReason1Code {}
export interface ExternalCardTransactionCategory1Code {}
export interface ExternalCashAccountType1Code {}
export interface ExternalCashClearingSystem1Code {}
export interface ExternalCategoryPurpose1Code {}
export interface ExternalChannel1Code {}
export interface ExternalChargeType1Code {}
export interface ExternalChequeAgentInstruction1Code {}
export interface ExternalChequeCancellationReason1Code {}
export interface ExternalChequeCancellationStatus1Code {}
export interface ExternalClaimNonReceiptRejection1Code {}
export interface ExternalClearingSystemIdentification1Code {}
export interface ExternalCollateralReferenceDataStatusReason1Code {}
export interface ExternalCommunicationFormat1Code {}
export interface ExternalContractBalanceType1Code {}
export interface ExternalContractClosureReason1Code {}
export interface ExternalCreditLineType1Code {}
export interface ExternalCreditorAgentInstruction1Code {}
export interface ExternalCreditorEnrolmentAmendmentReason1Code {}
export interface ExternalCreditorEnrolmentCancellationReason1Code {}
export interface ExternalCreditorEnrolmentStatusReason1Code {}
export interface ExternalCreditorReferenceType1Code {}
export interface ExternalDateFrequency1Code {}
export interface ExternalDateType1Code {}
export interface ExternalDebtorActivationAmendmentReason1Code {}
export interface ExternalDebtorActivationCancellationReason1Code {}
export interface ExternalDebtorActivationStatusReason1Code {}
export interface ExternalDebtorAgentInstruction1Code {}
export interface ExternalDeviceOperatingSystemType1Code {}
export interface ExternalDiscountAmountType1Code {}
export interface ExternalDocumentAmountType1Code {}
export interface ExternalDocumentFormat1Code {}
export interface ExternalDocumentLineType1Code {}
export interface ExternalDocumentPurpose1Code {}
export interface ExternalDocumentType1Code {}
export interface ExternalEffectiveDateParameter1Code {}
export interface ExternalEmissionAllowanceSubProductType1Code {}
export interface ExternalEncryptedElementIdentification1Code {}
export interface ExternalEnquiryRequestType1Code {}
export interface ExternalEntitySize1Code {}
export interface ExternalEntityType1Code {}
export interface ExternalEntryStatus1Code {}
export interface ExternalFinancialInstitutionIdentification1Code {}
export interface ExternalFinancialInstrumentIdentificationType1Code {}
export interface ExternalFinancialInstrumentProductType1Code {}
export interface ExternalGarnishmentType1Code {}
export interface ExternalIncoterms1Code {}
export interface ExternalIndustrySectorClassification1Code {}
export interface ExternalInformationType1Code {}
export interface ExternalInstructedAgentInstruction1Code {}
export interface ExternalInvestigationAction1Code {}
export interface ExternalInvestigationActionReason1Code {}
export interface ExternalInvestigationExecutionConfirmation1Code {}
export interface ExternalInvestigationInstrument1Code {}
export interface ExternalInvestigationReason1Code {}
export interface ExternalInvestigationReasonSubType1Code {}
export interface ExternalInvestigationServiceLevel1Code {}
export interface ExternalInvestigationStatus1Code {}
export interface ExternalInvestigationStatusReason1Code {}
export interface ExternalInvestigationSubType1Code {}
export interface ExternalInvestigationType1Code {}
export interface ExternalLegalFramework1Code {}
export interface ExternalLetterType1Code {}
export interface ExternalLocalInstrument1Code {}
export interface ExternalMandateReason1Code {}
export interface ExternalMandateSetupReason1Code {}
export interface ExternalMandateStatus1Code {}
export interface ExternalMandateSuspensionReason1Code {}
export interface ExternalMarketArea1Code {}
export interface ExternalMarketInfrastructure1Code {}
export interface ExternalMessageFunction1Code {}
export interface ExternalModelFormIdentification1Code {}
export interface ExternalNarrativeType1Code {}
export interface ExternalNotificationCancellationReason1Code {}
export interface ExternalNotificationSubType1Code {}
export interface ExternalNotificationType1Code {}
export interface ExternalOrganisationIdentification1Code {}
export interface ExternalPackagingType1Code {}
export interface ExternalPartyRelationshipType1Code {}
export interface ExternalPaymentCancellationRejection1Code {}
export interface ExternalPaymentCompensationReason1Code {}
export interface ExternalPaymentControlRequestType1Code {}
export interface ExternalPaymentGroupStatus1Code {}
export interface ExternalPaymentModificationRejection1Code {}
export interface ExternalPaymentRole1Code {}
export interface ExternalPaymentScenario1Code {}
export interface ExternalPaymentTransactionStatus1Code {}
export interface ExternalPendingProcessingReason1Code {}
export interface ExternalPersonIdentification1Code {}
export interface ExternalPostTradeEventType1Code {}
export interface ExternalProductType1Code {}
export interface ExternalProxyAccountType1Code {}
export interface ExternalPurpose1Code {}
export interface ExternalRatesAndTenors1Code {}
export interface ExternalReRepresentmentReason1Code {}
export interface ExternalReceivedReason1Code {}
export interface ExternalRegulatoryInformationType1Code {}
export interface ExternalRejectedReason1Code {}
export interface ExternalRelativeTo1Code {}
export interface ExternalReportingSource1Code {}
export interface ExternalRequestStatus1Code {}
export interface ExternalReservationType1Code {}
export interface ExternalReturnReason1Code {}
export interface ExternalReversalReason1Code {}
export interface ExternalSecuritiesLendingType1Code {}
export interface ExternalSecuritiesPurpose1Code {}
export interface ExternalSecuritiesUpdateReason1Code {}
export interface ExternalServiceLevel1Code {}
export interface ExternalShipmentCondition1Code {}
export interface ExternalStatusReason1Code {}
export interface ExternalSystemBalanceType1Code {}
export interface ExternalSystemErrorHandling1Code {}
export interface ExternalSystemEventType1Code {}
export interface ExternalSystemMemberType1Code {}
export interface ExternalSystemPartyType1Code {}
export interface ExternalTaxAmountType1Code {}
export interface ExternalTechnicalInputChannel1Code {}
export interface ExternalTradeMarket1Code {}
export interface ExternalTradeTransactionCondition1Code {}
export interface ExternalTypeOfParty1Code {}
export interface ExternalUnableToApplyIncorrectData1Code {}
export interface ExternalUnableToApplyMissingData1Code {}
export interface ExternalUnderlyingTradeTransactionType1Code {}
export interface ExternalUndertakingAmountType1Code {}
export interface ExternalUndertakingDocumentType1Code {}
export interface ExternalUndertakingDocumentType2Code {}
export interface ExternalUndertakingStatusCategory1Code {}
export interface ExternalUndertakingType1Code {}
export interface ExternalUnitOfMeasure1Code {}
export interface ExternalValidationRuleIdentification1Code {}
export interface ExternalVerificationReason1Code {}
export interface Biso20022 {}
/**
 * ==============================================================================
 * SECTION 9: SOVEREIGN IDENTITY, USER PROFILES & SOCIAL GRAPH TYPES
 * ==============================================================================
 * Enterprise-grade identity structures, multi-role authorization matrices,
 * neural-lace telemetry, genomic anchors, and decentralized social graph nodes.
 */

export enum View {
  // --- Core ---
  Dashboard = 'dashboard',
  
  // --- Personal Command ---
  Transactions = 'transactions',
  SendMoney = 'send-money',
  Budgets = 'capital-allocation', // Renamed for spec
  FinancialGoals = 'strategic-goals',
  CreditHealth = 'credit-resonance',
  Personalization = 'interface-will',
  Accounts = 'accounts-overview',
  
  // --- Sovereign Wealth ---
  Investments = 'portfolio-overview',
  Crypto = 'web3-crypto',
  CryptoWeb3 = 'web3-crypto', // Added alias
  AlgoTradingLab = 'algo-trading-lab',
  ForexArena = 'forex-arena',
  CommoditiesExchange = 'commodities',
  RealEstateEmpire = 'real-estate',
  ArtCollectibles = 'art-collectibles',
  DerivativesDesk = 'derivatives',
  VentureCapital = 'venture-capital',
  PrivateEquity = 'private-equity',
  TaxOptimization = 'tax-optimization',
  LegacyBuilder = 'legacy-architect',
  SovereignWealth = 'sovereign-wealth-sim',
  QuantumAssets = 'quantum-assets',
  
  // --- Citi Connect Core ---
  CitibankAccounts = 'citi-accounts',
  CitibankAccountProxy = 'citi-account-proxy',
  CitibankBillPay = 'citi-bill-payment',
  CitibankCrossBorder = 'citi-cross-border',
  CitibankPayeeManagement = 'citi-payee-mgmt',
  CitibankStandingInstructions = 'citi-standing-instructions',
  CitibankDeveloperTools = 'citi-dev-tools',
  CitibankEligibility = 'citi-eligibility-check',
  CitibankUnmaskedData = 'citi-secure-data-view',

  // --- Plaid Nexus ---
  PlaidMainDashboard = 'plaid-overview',
  DataNetwork = 'plaid-overview', // Added alias
  PlaidIdentity = 'plaid-identity-verification',
  PlaidCRAMonitoring = 'plaid-cra-monitoring',
  PlaidInstitutions = 'plaid-institutions-explorer',
  PlaidItemManagement = 'plaid-item-management',
  
  // --- Enterprise Operations ---
  CorporateCommand = 'corporate-command',
  ModernTreasury = 'modern-treasury',
  Treasury = 'treasury-capital',
  CardPrograms = 'marqeta-cards',
  Payments = 'stripe-payments',
  StripeNexus = 'stripe-nexus',
  CounterpartyDashboard = 'counterparties',
  VirtualAccounts = 'virtual-accounts',
  CorporateActions = 'corporate-actions',
  CreditNoteLedger = 'credit-notes',
  ReconciliationHub = 'reconciliation-hub',
  GEINDashboard = 'gein-dashboard',
  CardholderManagement = 'cardholder-mgmt',
  VentureCapitalDeskView = 'vc-desk-view',

  // --- System & Intelligence ---
  AIAdvisor = 'ai-advisor',
  AIInsights = 'predictive-insights',
  QuantumWeaver = 'quantum-weaver',
  AgentMarketplace = 'agent-marketplace',
  AIAdStudio = 'ai-ad-studio',
  GlobalPositionMap = 'global-position-map',
  GlobalSsiHub = 'global-ssi-hub',
  SecurityCompliance = 'security-compliance',
  DeveloperHub = 'developer-hub',
  SchemaExplorer = 'iso-20022-explorer',
  ResourceGraph = 'resource-graph',
  TheVision = 'the-vision',
  ApiPlayground = 'api-playground',
  ComplianceOracle = 'compliance-oracle',

  // --- Admin & Tools ---
  CustomerDashboard = 'customer-dashboard',
  VerificationReports = 'verification-reports',
  FinancialReporting = 'financial-reporting',
  StripeNexusDashboard = 'stripe-nexus-admin',

  // --- Components (Direct Access) ---
  AccountDetails = 'account-details',
  AccountList = 'account-list',
  AccountStatementGrid = 'account-statement-grid',
  AccountsView = 'accounts-view',
  AccountVerificationModal = 'account-verification-modal',
  ACHDetailsDisplay = 'ach-details-display',
  AICommandLog = 'ai-command-log',
  AIPredictionWidget = 'ai-prediction-widget',
  AssetCatalog = 'asset-catalog',
  AutomatedSweepRules = 'automated-sweep-rules',
  BalanceReportChart = 'balance-report-chart',
  BalanceTransactionTable = 'balance-transaction-table',
  CardDesignVisualizer = 'card-design-visualizer',
  ChargeDetailModal = 'charge-detail-modal',
  ChargeList = 'charge-list',
  ConductorConfigurationView = 'conductor-configuration-view',
  CounterpartyDetails = 'counterparty-details',
  CounterpartyForm = 'counterparty-form',
  DisruptionIndexMeter = 'disruption-index-meter',
  DocumentUploader = 'document-uploader',
  DownloadLink = 'download-link',
  EarlyFraudWarningFeed = 'early-fraud-warning-feed',
  ElectionChoiceForm = 'election-choice-form',
  EventNotificationCard = 'event-notification-card',
  ExpectedPaymentsTable = 'expected-payments-table',
  ExternalAccountCard = 'external-account-card',
  ExternalAccountForm = 'external-account-form',
  ExternalAccountsTable = 'external-accounts-table',
  FinancialAccountCard = 'financial-account-card',
  IncomingPaymentDetailList = 'incoming-payment-detail-list',
  InvoiceFinancingRequest = 'invoice-financing-request',
  PaymentInitiationForm = 'payment-initiation-form',
  PaymentMethodDetails = 'payment-method-details',
  PaymentOrderForm = 'payment-order-form',
  PayoutsDashboard = 'payouts-dashboard',
  PnLChart = 'pnl-chart',
  RefundForm = 'refund-form',
  RemittanceInfoEditor = 'remittance-info-editor',
  ReportingView = 'reporting-view',
  ReportRunGenerator = 'report-run-generator',
  ReportStatusIndicator = 'report-status-indicator',
  SsiEditorForm = 'ssi-editor-form',
  StripeNexusView = 'stripe-nexus-view',
  StripeStatusBadge = 'stripe-status-badge',
  StructuredPurposeInput = 'structured-purpose-input',
  SubscriptionList = 'subscription-list',
  TimeSeriesChart = 'time-series-chart',
  TradeConfirmationModal = 'trade-confirmation-modal',
  TransactionFilter = 'transaction-filter',
  TransactionList = 'transaction-list',
  TreasuryTransactionList = 'treasury-transaction-list',
  UniversalObjectInspector = 'universal-object-inspector',
  VirtualAccountForm = 'virtual-account-form',
  VirtualAccountsTable = 'virtual-accounts-table',
  VoiceControl = 'voice-control',
  WebhookSimulator = 'webhook-simulator',

  // Educational & 527 Views
  TheBook = 'the-book',
  KnowledgeBase = 'knowledge-base',
  
  // Auth & Settings
  Settings = 'settings',
  SSO = 'sso',
  ConciergeService = 'concierge-service',
  Philanthropy = 'philanthropy',
  OpenBanking = 'open-banking',
  FinancialDemocracy = 'financial-democracy',
  APIStatus = 'api-status',
  APIIntegration = 'api-integration',
  APIConsole = 'api-console',
  SecurityCenter = 'security-center',
  Security = 'security',
  AIStrategy = 'ai-strategy',
  Goals = 'financial-goals',
  Rewards = 'rewards',
  CardCustomization = 'card-customization',
}

export type UserRole =
  | 'ADMIN'
  | 'TRADER'
  | 'CLIENT'
  | 'VISIONARY'
  | 'CARETAKER'
  | 'QUANT_ANALYST'
  | 'SYSTEM_ARCHITECT'
  | 'ETHICS_OFFICER'
  | 'DATA_SCIENTIST'
  | 'NETWORK_WEAVER'
  | 'CITIZEN'
  | 'FOUNDER'
  | 'INVESTOR'
  | 'MANAGER';

export type SecurityLevel =
  | 'STANDARD'
  | 'ELEVATED'
  | 'TRADING_UNLOCKED'
  | 'QUANTUM_ENCRYPTED'
  | 'SOVEREIGN_CLEARED'
  | 'ARCHITECT_LEVEL';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles?: UserRole[];
  securityLevel?: SecurityLevel;
  netWorth?: number;
  display_name?: string;
  handle?: string;
  role?: string;
  businessId?: string;
  profilePictureUrl?: string;
  bio?: string;
  profile?: {
    interests: string[];
    skills: string[];
    [key: string]: any;
  };
  wallet?: {
    balance: number;
    currency: string;
  };
  businesses?: string[];
  memberships?: any[];
  followers?: string[];
  following?: string[];
  state?: {
    mood: string;
    activity: string;
    last_active_tick: number;
    [key: string]: any;
  };
  isAdmin?: boolean;
  title?: string;
  phone?: string;
  loyaltyTier?: string;
  usdBalance?: number;
  fiatBalance?: number;
  cryptoBalance?: number;
  avatarUrl?: string;
  tradingProfile?: any;
  biometricHashV2?: string;
  genomicSignatureId?: string;
  citizenship?: string;
  reputationScore?: number;
  threatVectorIndex?: number;
  neuralLaceSyncStatus?: string;
  cognitiveProfileId?: string;
  activeThoughtStreamId?: string | null;
  lastLoginCoordinates?: GeoCoordinate;
  temporalAnchorId?: string;
  activeSovereignAgentIds?: string[];
  permissionsGridHash?: string;
}

export type UserProfile = User;

export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  text: string;
  timestamp: string;
}

export interface PostContent {
  text: string;
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  financialData?: any;
}

export interface Post {
  id: string;
  author_id: string;
  userName: string;
  userProfilePic: string;
  created_tick: number;
  content: PostContent;
  type: 'text' | 'image' | 'video' | 'link' | 'financial_event';
  tags: string[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  visibility: 'public' | 'connections' | 'private';
  comments: Comment[];
}

export interface LendingPoolStats {
  totalCapital: number;
  interestRate: number;
  activeLoans: number;
  defaultRate: number;
  totalInterestEarned: number;
}

export interface AppIntegration {
  id: string;
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'disconnected' | 'issue';
}

export interface BiometricData {
  id: string;
  type: string;
  publicKey: string;
  enrolledDate: string;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  device?: string;
  browser?: string;
  os?: string;
  location?: string;
  isCurrent?: boolean;
  userAgent?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  specialization: string;
  traffic: number;
}

export interface SynapticVault {
  id: string;
  ownerIds: string[];
  ownerNames: string[];
  status: string;
  masterPrivateKeyFragment: string;
  creationDate: string;
}

export interface EcosystemKPIs {
  currentDate: string;
  totalEcosystemValue: number;
  totalTransactions: number;
  communityPoolCapital: number;
  activeUsers: number;
  gdp: number;
}

export interface SimulationEvent {
  id: string;
  tick: number;
  type: string;
  description: string;
  impact: any;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: 'service' | 'retail' | 'tech' | 'manufacturing' | 'finance' | 'platform';
  monthly_revenue: number;
  expenses: number;
  employees: string[];
  status: 'active' | 'bankrupt' | 'acquired';
  marketing_factor: number; // 0-1 multiplier
  businessPlan?: string;
  valuation?: number;
  cashBalance?: number;
  hqLocation?: string;
}

/**
 * ==============================================================================
 * SECTION 10: QUANTUM WEALTH, ALGORITHMIC TRADING & ALTERNATIVE ASSETS
 * ==============================================================================
 * Advanced structures for fractional real estate, fine art tokenization,
 * algorithmic trading strategies, venture capital startups, and Stripe ledger balances.
 */

export interface RealEstateProperty {
  id: string;
  address: string;
  value: number;
  rentalIncome: number;
  occupancyRate?: number;
  tokenizedShares?: number;
  yieldYTD?: number;
}

export interface ArtPiece {
  id: string;
  name: string;
  artist: string;
  value: number;
  year: number;
  medium?: string;
  provenance?: string[];
  fractionalOwnershipEnabled?: boolean;
}

export interface AlgoStrategy {
  id: string;
  name: string;
  performance: number;
  risk: 'Low' | 'Medium' | 'High';
  active: boolean;
  sharpeRatio?: number;
  maxDrawdown?: number;
  allocationPercentage?: number;
}

export interface VentureStartup {
  id: string;
  name: string;
  valuation: number;
  investment: number;
  equity: number;
  fundingRound?: 'Seed' | 'SeriesA' | 'SeriesB' | 'SeriesC' | 'Growth';
  burnRate?: number;
  runwayMonths?: number;
}

export interface StripeBalance {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
}

export interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number;
  description: string;
  customer_id?: string;
  receipt_url?: string;
  metadata: KeyValuePairs;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
  total_spent?: number;
  metadata?: KeyValuePairs;
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: number;
  plan_id: string;
  amount: number;
}

export type StripeResource = any;

/**
 * ==============================================================================
 * SECTION 11: GATEKEEPER VERIFICATION & CRYPTOGRAPHIC LEDGERS
 * ==============================================================================
 * Types governing secure micro-deposit verification, Modern Treasury external
 * account validation, and multi-factor cryptographic gatekeepers.
 */

export interface VerifyParams {
  externalAccountId: string;
  originatingAccountId: string;
  paymentType: 'ach' | 'eft' | 'rtp';
  currency: string;
  authToken: string; // The base64 string provided by user
}

export interface VerifyError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * ==============================================================================
 * SECTION 12: SACRED GEOMETRY, GEMATRIA & THEOLOGICAL PATTERNS
 * ==============================================================================
 * Types governing mathematical patterns, triangular numbers, gematria calculations,
 * and multi-layered cosmic/historical pattern analysis.
 */

export interface BibleBook {
  index: number;
  name: string;
  chapters: number;
  isTriangular: boolean;
}

export interface GematriaResult {
  word: string;
  sum: number;
  language: string;
  category: string;
}

export interface TriangularMetadata {
  index: number;
  value: number;
  significance: string;
}

export interface PatternLayer {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: 'Scripture' | 'Math' | 'Science' | 'Cosmic' | 'History';
}

/**
 * ==============================================================================
 * SECTION 13: LITERARY TRANSLATION, MANUSCRIPTS & REPOSITORY COMPENDIUMS
 * ==============================================================================
 * Types governing the transformation of raw codebases into literary masterpieces,
 * New York Times best-seller manuscripts, and virtual repository consensus engines.
 */

export interface Page {
  title: string;
  content: string; // Changed from string[] to string for narrative content
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  technicalSummary: string;
  imageryPrompt: string;
  imageUrl?: string;
  pages?: Page[];
}

export interface Section {
  title: string;
  chapters: Chapter[];
}

export type Book = Section[];

export interface Manuscript {
  repoName: string;
  title: string;
  preface: string;
  chapters: Chapter[];
  conclusion: string;
  generatedAt: string;
  author: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface KnowledgeBaseFile extends GitHubFile {
  repoName: string;
}

export interface AuditItem {
  file: GitHubFile;
  repo: GithubRepo;
}

export interface FileAnalysis {
  path: string;
  name: string;
  thoughts: string;
  hypnoticCommand: string;
  imageUrl?: string;
}

export interface ProjectCompendium {
  repoName: string;
  summaries: FileAnalysis[];
  masterStory: string;
  sacredDecree: string;
  ultimateBibliography: string;
  analyzedAt: string;
  totalFilesProcessed: number;
}

export interface VirtualRepository {
  name: string;
  files: Map<string, FileAnalysis>;
  consensus: any;
  isReady: boolean;
}

export interface SelectedContext {
  repo: GithubRepo | null;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
  isGenerating: boolean;
  status: string;
  compendium?: ProjectCompendium | null;
  virtualRepo?: VirtualRepository | null;
}

export interface RepoSession {
  repoId: number;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
}

/**
 * ==============================================================================
 * SECTION 14: ENTERPRISE PAYMENTS, SIMULATIONS & CLIENT REGISTRATION
 * ==============================================================================
 * Types governing enterprise-grade payee management, simulation engines,
 * client registration responses, and line-item ledger updates.
 */

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
}

export interface CustomerProfileResponse {
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  companyName: string;
  emails: Array<{
    emailAddress: string;
    preferenceType: string;
  }>;
  addressList: Array<{
    addressLine1: string;
    city: string;
    countryCode: string;
    postalCode: string;
    addressType: string;
  }>;
  phones: Array<{
    phoneType: string;
    fullPhoneNumber: string;
    preferenceType: string;
  }>;
}

export interface ClientRegisterResponse {
  client_id: string;
  client_secret: string;
  client_name: string;
  appId?: string;
  redirect_uris: string[];
  scope: string[];
  token_endpoint_auth_method?: string;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * ==============================================================================
 * SECTION 15: ADVANCED TYPESCRIPT UTILITY & TYPE-LEVEL PROGRAMMING
 * ==============================================================================
 * High-performance utility types for deep partials, readonly mapping,
 * union-to-intersection conversions, and type-safe property picking.
 */

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type PickProperties<T, U> = Pick<T, KeysOfType<T, U>>;

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type TupleToUnion<T extends any[]> = T[number];

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

/**
 * ==============================================================================
 * SECTION 16: ISO 20022 XML/JSON SCHEMA DEFINITIONS & MX/MT MESSAGE PARSERS
 * ==============================================================================
 * Exhaustive, production-grade type definitions for ISO 20022 financial messaging.
 * Covers pacs.008, pacs.009, pain.001, and camt.053 schemas with complete structural fidelity.
 */

export interface ActiveOrHistoricCurrencyAndAmount {
  value: number;
  currency: string;
}

export interface PostalAddress24 {
  adrTp?: 'MNDT' | 'ALCO' | 'BIZZ' | 'COMM' | 'DLVY' | 'HEAD' | 'OFFI' | 'HOME' | 'PBOX';
  dept?: string;
  subDept?: string;
  strtNm?: string;
  bldgNb?: string;
  bldgNm?: string;
  pstCd?: string;
  twnNm?: string;
  subPrvnc?: string;
  ctrySubDvsn?: string;
  ctry?: string;
  adrLine?: string[];
}

export interface PartyIdentification135 {
  nm?: string;
  pstlAdr?: PostalAddress24;
  id?: {
    orgId?: {
      anyBIC?: string;
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
    prvtId?: {
      dtAndPlcOfBirth?: {
        birthDt: string;
        prvncOfBirth?: string;
        cityOfBirth: string;
        ctryOfBirth: string;
      };
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
  };
  ctctDtls?: {
    nmPrfx?: 'DOCT' | 'MADM' | 'MISS' | 'MIST' | 'MIXX';
    nm?: string;
    phneNb?: string;
    mobPhneNb?: string;
    faxNb?: string;
    emailAdr?: string;
    emailPurp?: string;
    jobTitl?: string;
    rspnsblty?: string;
    dept?: string;
  };
}

export interface ClearingSystemMemberIdentification2 {
  clrSysId?: {
    cd?: string;
    prtry?: string;
  };
  mmbId: string;
}

export interface BranchAndFinancialInstitutionIdentification6 {
  finInstnId: {
    bicfi?: string;
    clrSysMmbId?: ClearingSystemMemberIdentification2;
    nm?: string;
    pstlAdr?: PostalAddress24;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  brnch?: {
    id?: string;
    nm?: string;
    pstlAdr?: PostalAddress24;
  };
}

export interface CashAccount38 {
  id: {
    iban?: string;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  tp?: {
    cd?: string;
    prtry?: string;
  };
  ccy?: string;
  nm?: string;
  prxy?: {
    tp?: { cd?: string; prtry?: string };
    id: string;
  };
}

export interface PaymentIdentification7 {
  instrId?: string;
  endToEndId: string;
  uetr?: string;
  txId?: string;
  clrSysRef?: string;
}

export interface GroupHeader93 {
  msgId: string;
  creDtTm: string;
  authstn?: {
    cd?: string;
    prtry?: string;
  }[];
  btchBookg?: boolean;
  nbOfTxs: string;
  ctrlSum?: number;
  initgPty?: PartyIdentification135;
  fwdgAgt?: BranchAndFinancialInstitutionIdentification6;
}

export interface CreditTransferTransaction39 {
  pmtId: PaymentIdentification7;
  pmtTpInf?: {
    instrPrty?: 'HIGH' | 'NORM';
    svcLvl?: { cd?: string; prtry?: string }[];
    lclInstrm?: { cd?: string; prtry?: string };
    ctgyPurp?: { cd?: string; prtry?: string };
  };
  intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
  intrBkSttlmDt?: string;
  sttlmPrty?: 'HIGH' | 'NORM';
  chrgBr: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
  chrgsInf?: {
    amt: ActiveOrHistoricCurrencyAndAmount;
    agt: BranchAndFinancialInstitutionIdentification6;
  }[];
  instgAgt?: BranchAndFinancialInstitutionIdentification6;
  instdAgt?: BranchAndFinancialInstitutionIdentification6;
  dbtr: PartyIdentification135;
  dbtrAcct?: CashAccount38;
  dbtrAgt: BranchAndFinancialInstitutionIdentification6;
  dbtrAgtAcct?: CashAccount38;
  cdtrAgt: BranchAndFinancialInstitutionIdentification6;
  cdtrAgtAcct?: CashAccount38;
  cdtr: PartyIdentification135;
  cdtrAcct?: CashAccount38;
  ultmtDbtr?: PartyIdentification135;
  ultmtCdtr?: PartyIdentification135;
  purp?: { cd?: string; prtry?: string };
  rgltryRptg?: {
    dbtCdtFlg?: 'DBIT' | 'CDIT';
    authrty?: { nm?: string; ctry?: string };
    dtls?: { cd?: string; prtry?: string; inf?: string[] }[];
  }[];
  rltdRmtInf?: {
    fcmtId?: string;
    docTp?: string;
    docNb?: string;
    dt?: string;
  }[];
  rmtInf?: {
    ustrd?: string[];
    strd?: {
      rfrdDocInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        nb?: string;
        rltdDt?: string;
      }[];
      rfrdDocAmt?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        amt: ActiveOrHistoricCurrencyAndAmount;
      }[];
      cdtrRefInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        ref?: string;
      };
      invcr?: PartyIdentification135;
      invcee?: PartyIdentification135;
    }[];
  };
}

export interface Pacs008Document {
  fitoficstmdbtct: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: CreditTransferTransaction39[];
  };
}

export interface Pacs009Document {
  ficreditTransfer: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: {
      pmtId: PaymentIdentification7;
      intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
      intrBkSttlmDt?: string;
      instgAgt?: BranchAndFinancialInstitutionIdentification6;
      instdAgt?: BranchAndFinancialInstitutionIdentification6;
      dbtr: BranchAndFinancialInstitutionIdentification6;
      dbtrAcct?: CashAccount38;
      dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtr: BranchAndFinancialInstitutionIdentification6;
      cdtrAcct?: CashAccount38;
    }[];
  };
}

export interface Pain001Document {
  cstmrCdtTrfInitn: {
    grpHdr: GroupHeader93;
    pmtInf: {
      pmtInfId: string;
      pmtMtd: 'TRF' | 'CHK' | 'TRA';
      btchBookg?: boolean;
      nbOfTxs?: string;
      ctrlSum?: number;
      pmtTpInf?: {
        instrPrty?: 'HIGH' | 'NORM';
        svcLvl?: { cd?: string; prtry?: string }[];
        lclInstrm?: { cd?: string; prtry?: string };
        ctgyPurp?: { cd?: string; prtry?: string };
      };
      reqdExctnDt: {
        dt?: string;
        dtTm?: string;
      };
      dbtr: PartyIdentification135;
      dbtrAcct: CashAccount38;
      dbtrAgt: BranchAndFinancialInstitutionIdentification6;
      dbtrAgtAcct?: CashAccount38;
      ultmtDbtr?: PartyIdentification135;
      chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
      cdtTrfTxInf: {
        pmtId: PaymentIdentification7;
        amt: {
          instdAmt?: ActiveOrHistoricCurrencyAndAmount;
          eqvAmt?: {
            amt: ActiveOrHistoricCurrencyAndAmount;
            ccyOfTrf: string;
          };
        };
        chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
        cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
        cdtrAgtAcct?: CashAccount38;
        cdtr: PartyIdentification135;
        cdtrAcct?: CashAccount38;
        ultmtCdtr?: PartyIdentification135;
        purp?: { cd?: string; prtry?: string };
        rmtInf?: { ustrd?: string[] };
      }[];
    }[];
  };
}

export interface Camt053Document {
  bkToCstmrStmt: {
    grpHdr: GroupHeader93;
    stmt: {
      id: string;
      elctrncSeqNb?: number;
      creDtTm: string;
      frToDt?: {
        frDtTm: string;
        toDtTm: string;
      };
      acct: CashAccount38;
      bal: {
        tp: {
          cdOrPrtry: { cd: string; prtry?: string };
        };
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        dt: { dtTm: string };
      }[];
      ntry?: {
        ntryRef?: string;
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        sts: 'BOOK' | 'PDNG';
        bookgDt?: { dtTm: string };
        valDt?: { dtTm: string };
        acctSvcrRef?: string;
        ntryDtls?: {
          txDtls?: {
            refs?: {
              endToEndId?: string;
              uetr?: string;
              txId?: string;
            };
            amtDtls?: {
              instdAmt?: {
                amt: ActiveOrHistoricCurrencyAndAmount;
              };
            };
            rltdPties?: {
              dbtr?: PartyIdentification135;
              cdtr?: PartyIdentification135;
            };
            rltdAgts?: {
              dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
              cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
            };
          }[];
        }[];
      }[];
    }[];
  };
}

/**
 * ==============================================================================
 * SECTION 17: QUANTUM LEDGER & MULTI-NODE CONSENSUS MESH PROTOCOL (NEXUS-V3)
 * ==============================================================================
 * Advanced cryptographic structures for zero-knowledge proofs, post-quantum
 * signatures, threshold multi-sig, and decentralized consensus state machines.
 */

export type QuantumSignatureScheme = 'Dilithium5' | 'Falcon1024' | 'SPHINCS+' | 'XMSS_MT';

export interface QuantumPublicKey {
  scheme: QuantumSignatureScheme;
  rawBytes: string; // Base64 encoded public key
  fingerprint: string; // SHA3-256 hash of the public key
}

export interface ZkProofPayload {
  provingSystem: 'Groth16' | 'Plonk' | 'Halo2' | 'Bulletproofs';
  proofBytes: string; // Base64 encoded proof
  publicInputs: string[]; // Array of public input values
  verificationKeyHash: string;
}

export interface ThresholdSignatureConfig {
  threshold: number; // 't' in t-of-n
  totalSigners: number; // 'n'
  publicKeys: QuantumPublicKey[];
  epochId: number;
}

export interface ConsensusState {
  currentEpoch: number;
  currentRound: number;
  leaderNodeId: string;
  activeValidators: string[];
  consensusThreshold: number;
  lastCommittedBlockHeight: number;
  lastCommittedBlockHash: string;
  pendingProposalsCount: number;
}

export interface StateChannel {
  channelId: string;
  participants: string[];
  nonce: number;
  balances: Record<string, ActiveOrHistoricCurrencyAndAmount>;
  signatures: Record<string, string>;
  status: 'OPEN' | 'CLOSING' | 'CLOSED' | 'DISPUTED';
  disputeTimeoutBlock?: number;
}

export interface MeshNode {
  nodeId: string;
  endpoint: string;
  version: string;
  reputationScore: number;
  latencyMs: number;
  isValidator: boolean;
  stakingBalance: ActiveOrHistoricCurrencyAndAmount;
  lastHeartbeat: string;
}

export interface BlockHeader {
  height: number;
  previousHash: string;
  merkleRoot: string;
  stateRoot: string;
  timestamp: number;
  validatorSignature: string;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface TransactionPayload {
  txHash: string;
  sender: string;
  recipient: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  nonce: number;
  gasLimit: number;
  gasPrice: ActiveOrHistoricCurrencyAndAmount;
  signature: string;
  zkProof?: ZkProofPayload;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface ConsensusMessage {
  messageId: string;
  senderNodeId: string;
  epoch: number;
  round: number;
  type: 'PROPOSE' | 'PREVOTE' | 'PRECOMMIT' | 'DECIDE';
  blockHash: string;
  signature: string;
}

/**
 * ==============================================================================
 * SECTION 18: AI SWARM ORCHESTRATION, AGENTIC WORKFLOWS & COGNITIVE THOUGHT STREAMS
 * ==============================================================================
 * Types governing multi-agent swarms, task decomposition graphs, agent-to-agent
 * communication protocols, vector database embeddings, and cognitive thought stream logs.
 */

export type AgentRole = 'ORCHESTRATOR' | 'CRITIC' | 'REFINER' | 'RESEARCHER' | 'CODER' | 'COMPLIANCE_OFFICER' | 'FINANCIAL_ANALYST';

export interface AgentCapability {
  name: string;
  description: string;
  parametersSchema: Record<string, any>; // JSON Schema for tool parameters
}

export interface TaskDecompositionNode {
  taskId: string;
  parentTaskId: string | null;
  assignedAgentId: string;
  description: string;
  dependencies: string[]; // Array of taskIds that must complete first
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  error?: string;
  attempts: number;
  maxAttempts: number;
}

export interface SwarmOrchestratorState {
  swarmId: string;
  activeAgents: Record<string, {
    agentId: string;
    role: AgentRole;
    status: 'IDLE' | 'WORKING' | 'CRITICIZING' | 'OFFLINE';
    currentTaskId?: string;
  }>;
  taskGraph: Record<string, TaskDecompositionNode>;
  overallProgress: number; // 0.0 to 1.0
  status: 'IDLE' | 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
}

export interface AgentMessage {
  messageId: string;
  senderId: string;
  recipientId: string; // Can be 'ALL' or specific agentId
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
  replyToId?: string;
}

export interface ThoughtStreamNode {
  nodeId: string;
  agentId: string;
  timestamp: number;
  thoughtType: 'OBSERVATION' | 'REASONING' | 'HYPOTHESIS' | 'CRITIQUE' | 'DECISION';
  content: string;
  confidenceScore: number; // 0.0 to 1.0
  parentThoughtId: string | null;
}

export interface VectorEmbedding {
  id: string;
  vector: number[];
  textPayload: string;
  metadata: Record<string, string | number | boolean>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface ToolExecutionContext {
  toolName: string;
  arguments: Record<string, any>;
  callerAgentId: string;
  timestamp: number;
  executionTimeMs?: number;
  status: 'SUCCESS' | 'ERROR';
  result?: any;
  error?: string;
}

/**
 * ==============================================================================
 * SECTION 19: ADVANCED ALGORITHMIC TRADING, HIGH-FREQUENCY ORDER BOOKS & RISK ENGINES
 * ==============================================================================
 * Types governing real-time order books (L1/L2/L3), market makers, execution
 * algorithms (TWAP, VWAP, Sniper), portfolio risk metrics, and margin/liquidation engines.
 */

export interface OrderBookLevel {
  price: number;
  quantity: number;
  orderCount?: number;
}

export interface OrderBookL2 {
  ticker: string;
  timestamp: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface OrderBookL3 {
  ticker: string;
  timestamp: number;
  bids: { orderId: string; price: number; quantity: number; ownerId: string }[];
  asks: { orderId: string; price: number; quantity: number; ownerId: string }[];
}

export type AlgoExecutionStrategy = 'TWAP' | 'VWAP' | 'SNIPER' | 'ICEBERG' | 'GRID' | 'MARKET_MAKER';

export interface AlgoTradingJob {
  jobId: string;
  ticker: string;
  strategy: AlgoExecutionStrategy;
  side: 'BUY' | 'SELL';
  totalQuantity: number;
  executedQuantity: number;
  limitPrice?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  parameters: {
    startTime: string;
    endTime: string;
    sliceIntervalSeconds?: number;
    maxParticipationRate?: number; // For VWAP
    icebergDisplayQuantity?: number;
  };
  status: 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  averageExecutionPrice: number;
  slippageBps: number;
  logs: string[];
}

export interface PortfolioRiskMetrics {
  portfolioId: string;
  timestamp: number;
  valueAtRisk95: ActiveOrHistoricCurrencyAndAmount; // 95% confidence VaR
  valueAtRisk99: ActiveOrHistoricCurrencyAndAmount; // 99% confidence VaR
  expectedShortfall: ActiveOrHistoricCurrencyAndAmount;
  sharpeRatio: number;
  sortinoRatio: number;
  betaToBenchmark: number;
  alphaToBenchmark: number;
  maxDrawdown: number;
  volatilityAnnualized: number;
}

export interface MarginAccount {
  accountId: string;
  collateralBalance: ActiveOrHistoricCurrencyAndAmount;
  borrowedBalance: ActiveOrHistoricCurrencyAndAmount;
  maintenanceMarginRequirement: number; // Percentage, e.g., 0.15 for 15%
  initialMarginRequirement: number; // Percentage, e.g., 0.30 for 30%
  currentMarginRatio: number; // collateral / borrowed
  liquidationPrice: number;
  status: 'HEALTHY' | 'MARGIN_CALL' | 'LIQUIDATING' | 'LIQUIDATED';
}

export interface LiquidationEvent {
  liquidationId: string;
  accountId: string;
  timestamp: number;
  liquidatedAsset: string;
  liquidatedQuantity: number;
  executionPrice: number;
  penaltyFee: ActiveOrHistoricCurrencyAndAmount;
  remainingCollateral: ActiveOrHistoricCurrencyAndAmount;
}/**
 * ==============================================================================
 * SECTION 20: MULTI-MODAL AI AD STUDIO, CAMPAIGN GENERATION & AD PERFORMANCE TRACKING
 * ==============================================================================
 * Types for AI-generated marketing campaigns, ad creatives, target audience segments,
 * budget allocation, real-time bidding (RTB) parameters, conversion tracking, and
 * multi-channel attribution models.
 */

export type AdCampaignStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type AdCreativeType = 'IMAGE' | 'VIDEO' | 'TEXT' | 'CAROUSEL' | 'INTERACTIVE_HTML5' | 'AUDIO';

export type AttributionModelType = 'FIRST_TOUCH' | 'LAST_TOUCH' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'DATA_DRIVEN';

export interface AdPerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: ActiveOrHistoricCurrencyAndAmount;
  ctr: number; // Click-Through Rate (0.0 to 1.0)
  cpc: ActiveOrHistoricCurrencyAndAmount; // Cost Per Click
  cpa: ActiveOrHistoricCurrencyAndAmount; // Cost Per Acquisition
  roas: number; // Return on Ad Spend
  bounceRate: number; // 0.0 to 1.0
  averageEngagementTimeSeconds: number;
  conversionRate: number; // 0.0 to 1.0
}

export interface AudienceSegment {
  segmentId: string;
  name: string;
  description?: string;
  demographics: {
    ageRanges: string[];
    genders: string[];
    incomeBrackets?: string[];
    educationLevels?: string[];
  };
  interests: string[];
  behaviors: string[];
  geographicRegions: string[]; // ISO country/region codes
  estimatedReach: number;
  customDataTags?: Record<string, string>;
}

export interface AdCreative {
  creativeId: string;
  type: AdCreativeType;
  headline: LocalizedString;
  bodyText: LocalizedString;
  callToAction: string;
  mediaAssets: AssetMetadata[];
  generationPromptUsed?: string;
  aiModelId?: string;
  negativePromptUsed?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '2:3';
  metaData?: Record<string, any>;
}

export interface RealTimeBiddingConfig {
  maxBidAmount: ActiveOrHistoricCurrencyAndAmount;
  targetCpa?: ActiveOrHistoricCurrencyAndAmount;
  pacingStrategy: 'EVEN' | 'AHEAD' | 'ASAP';
  bidMultiplierRules: {
    dimension: 'device' | 'region' | 'time_of_day' | 'audience_segment';
    key: string;
    multiplier: number; // e.g., 1.2 for +20% bid
  }[];
}

export interface AdCampaign {
  campaignId: string;
  name: string;
  description?: string;
  status: AdCampaignStatus;
  channels: ('SOCIAL' | 'SEARCH' | 'DISPLAY' | 'PROGRAMMATIC' | 'EMAIL' | 'METAVERSE')[];
  targetAudience: AudienceSegment;
  creatives: AdCreative[];
  totalBudget: ActiveOrHistoricCurrencyAndAmount;
  dailyBudgetLimit: ActiveOrHistoricCurrencyAndAmount;
  startDate: string;
  endDate?: string;
  rtbConfig?: RealTimeBiddingConfig;
  performanceMetrics?: AdPerformanceMetrics;
  attributionModel: AttributionModelType;
  aiCreativeBrief?: string;
  lastOptimizedAt?: string;
}

/**
 * ==============================================================================
 * SECTION 21: CITIBANK CONNECTIVITY, OPEN BANKING API PROXIES & SECURE DATA EXCHANGE
 * ==============================================================================
 * Citi-specific API payloads, unmasked data views, standing instructions,
 * cross-border payment routing, payee management, and developer sandbox configurations.
 */

export type CitiAccountProxyStatus = 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';

export interface CitiAccountProxy {
  proxyId: string;
  realAccountId: string;
  mask: string;
  virtualIban: string;
  status: CitiAccountProxyStatus;
  allowedMerchantCategories: string[]; // MCC codes
  dailyLimit: ActiveOrHistoricCurrencyAndAmount;
  expirationDate: string;
  createdDate: string;
}

export interface CitiBillPayment {
  paymentId: string;
  billerId: string;
  billerName: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  status: 'PENDING' | 'PROCESSING' | 'EXECUTED' | 'FAILED';
  executionDate: string;
  recurringRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY';
    interval: number;
    endDate?: string;
  };
}

export interface CitiCrossBorderTransfer {
  transferId: string;
  senderBic: string;
  receiverBic: string;
  intermediaryBic?: string;
  fxRate: number;
  guaranteedUntil: string;
  transferFee: ActiveOrHistoricCurrencyAndAmount;
  regulatoryReportingCode?: string; // e.g., Central Bank reporting codes
  chargeBearer: 'OUR' | 'BEN' | 'SHA';
}

export interface CitiPayee {
  payeeId: string;
  name: string;
  accountDetails: CashAccount38;
  address?: PostalAddress24;
  status: 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED';
  verificationLevel: 'STANDARD' | 'ENHANCED_KYC' | 'SANCTION_CLEARED';
  lastPaidDate?: string;
}

export interface CitiStandingInstruction {
  instructionId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  frequency: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  nextExecutionDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export interface CitiDeveloperSandboxConfig {
  sandboxId: string;
  clientId: string;
  clientSecret: string;
  mockDataProfile: 'RETAIL_MASS' | 'HNW_SOVEREIGN' | 'CORPORATE_CONGLOMERATE';
  latencySimulationMs: number;
  errorSimulationRate: number; // 0.0 to 1.0
}

/**
 * ==============================================================================
 * SECTION 22: WEB3 DECENTRALIZED FINANCE (DeFi), LIQUIDITY POOLS & SMART CONTRACT INTERACTION
 * ==============================================================================
 * Types for decentralized lending pools, yield farming, automated market makers (AMMs),
 * gas estimation, smart contract ABIs, wallet provider details (EIP-6963), and cross-chain bridge protocols.
 */

export interface DeFiLendingPool {
  poolAddress: string;
  assetSymbol: string;
  totalDeposited: ActiveOrHistoricCurrencyAndAmount;
  totalBorrowed: ActiveOrHistoricCurrencyAndAmount;
  supplyApy: number; // Annual Percentage Yield
  borrowApy: number;
  utilizationRate: number; // 0.0 to 1.0
  collateralFactor: number; // 0.0 to 1.0
  liquidationThreshold: number; // 0.0 to 1.0
}

export interface YieldFarm {
  farmAddress: string;
  lpTokenAddress: string;
  rewardTokenAddress: string;
  tvl: ActiveOrHistoricCurrencyAndAmount; // Total Value Locked
  apr: number; // Annual Percentage Rate
  userStakedBalance: number;
  userPendingRewards: number;
}

export interface AmmPool {
  poolAddress: string;
  token0: { address: string; symbol: string; decimals: number };
  token1: { address: string; symbol: string; decimals: number };
  reserve0: number;
  reserve1: number;
  feeTierBps: number; // e.g., 30 for 0.3%
  volume24h: ActiveOrHistoricCurrencyAndAmount;
  totalLiquidity: ActiveOrHistoricCurrencyAndAmount;
}

export interface SmartContractAbiEntry {
  name: string;
  type: 'function' | 'event' | 'constructor' | 'fallback' | 'receive';
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  inputs: { name: string; type: string; indexed?: boolean }[];
  outputs?: { name: string; type: string }[];
}

export interface WalletProviderDetail {
  uuid: string;
  name: string;
  icon: string; // Base64 or URL
  rdns: string; // Reverse Domain Name System identifier
  providerInstance: any; // EIP-1193 provider instance
}

export interface CrossChainBridgeTx {
  txHash: string;
  sourceChainId: number;
  destinationChainId: number;
  assetSymbol: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  bridgeFee: ActiveOrHistoricCurrencyAndAmount;
  estimatedTimeMinutes: number;
}

/**
 * ==============================================================================
 * SECTION 23: FOREX ARENA, COMMODITIES EXCHANGE & DERIVATIVES DESK
 * ==============================================================================
 * Types for foreign exchange (FX) spot/forward contracts, leverage settings,
 * margin requirements, commodity futures, options chains (calls/puts, Greeks), and hedging strategies.
 */

export interface FxSpotContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  bidPrice: number;
  askPrice: number;
  pipValue: number;
  lotSize: number; // Standard lot is 100,000 units
}

export interface FxForwardContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  forwardRate: number;
  maturityDate: string;
  settlementType: 'PHYSICAL' | 'CASH';
  notionalAmount: ActiveOrHistoricCurrencyAndAmount;
}

export interface CommodityFuture {
  ticker: string;
  commodityType: 'ENERGY' | 'METALS' | 'AGRICULTURE' | 'ENVIRONMENTAL';
  contractMonth: string; // e.g., "DEC29"
  contractYear: number;
  multiplier: number;
  maintenanceMargin: ActiveOrHistoricCurrencyAndAmount;
  lastTradingDate: string;
}

export interface OptionContract {
  optionId: string;
  underlyingTicker: string;
  strikePrice: number;
  expirationDate: string;
  optionType: 'CALL' | 'PUT';
  premium: number;
  openInterest: number;
  volume: number;
}

export interface OptionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  impliedVolatility: number;
}

export interface HedgingStrategy {
  strategyId: string;
  name: string;
  description: string;
  underlyingAssets: string[];
  derivativeInstruments: string[]; // optionIds or future tickers
  targetHedgeRatio: number; // e.g., 0.85 for 85% hedged
  currentHedgeRatio: number;
  unrealizedPnL: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 24: REAL ESTATE EMPIRE, FRACTIONAL OWNERSHIP & ART COLLECTIBLES
 * ==============================================================================
 * Types for tokenized real estate, fractional shares, rental distribution ledgers,
 * art provenance tracking, appraisal history, and gallery exhibition schedules.
 */

export interface RealEstateFractionalShare {
  shareId: string;
  propertyId: string;
  ownerId: string;
  percentageOwned: number; // 0.0 to 1.0
  purchasePrice: ActiveOrHistoricCurrencyAndAmount;
  purchaseDate: string;
  currentValue: ActiveOrHistoricCurrencyAndAmount;
}

export interface RentalDistributionLedger {
  ledgerId: string;
  propertyId: string;
  periodStartDate: string;
  periodEndDate: string;
  totalGrossRentCollected: ActiveOrHistoricCurrencyAndAmount;
  expensesDeducted: ActiveOrHistoricCurrencyAndAmount;
  netRentDistributed: ActiveOrHistoricCurrencyAndAmount;
  distributions: {
    shareId: string;
    ownerId: string;
    amountDistributed: ActiveOrHistoricCurrencyAndAmount;
    distributedAt: string;
  }[];
}

export interface ArtProvenanceEntry {
  entryId: string;
  ownerName: string;
  acquisitionDate: string;
  acquisitionPrice?: ActiveOrHistoricCurrencyAndAmount;
  provenanceType: 'GALLERY_PURCHASE' | 'AUCTION' | 'PRIVATE_SALE' | 'INHERITANCE' | 'MUSEUM_EXHIBITION';
  location: string;
  verifiedBy: string;
  verificationHash: string;
}

export interface ArtAppraisalHistory {
  appraisalId: string;
  appraiserName: string;
  appraiserCredentials: string[];
  appraisalDate: string;
  appraisedValue: ActiveOrHistoricCurrencyAndAmount;
  appraisalReportUrl?: string;
  conditionRating: 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

export interface GalleryExhibition {
  exhibitionId: string;
  galleryName: string;
  location: string;
  startDate: string;
  endDate: string;
  curatorName: string;
  exhibitedArtPieceIds: string[];
  insuranceCoverageAmount: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 25: TAX OPTIMIZATION, LEGACY ARCHITECT & PHILANTHROPY
 * ==============================================================================
 * Types for tax loss harvesting, capital gains tracking, trust funds, estate planning,
 * charitable foundations, donor-advised funds (DAFs), and impact metrics.
 */

export interface TaxLossHarvestingOpportunity {
  opportunityId: string;
  assetTicker: string;
  currentPrice: number;
  costBasis: number;
  unrealizedLoss: ActiveOrHistoricCurrencyAndAmount;
  potentialTaxSavings: ActiveOrHistoricCurrencyAndAmount;
  recommendedReplacementAssetTicker: string;
  washSaleRiskStatus: 'SAFE' | 'RISK_OF_WASH_SALE' | 'WASH_SALE_TRIGGERED';
}

export interface CapitalGainsRecord {
  recordId: string;
  assetTicker: string;
  quantity: number;
  acquisitionDate: string;
  saleDate: string;
  costBasis: ActiveOrHistoricCurrencyAndAmount;
  saleProceeds: ActiveOrHistoricCurrencyAndAmount;
  gainLossAmount: ActiveOrHistoricCurrencyAndAmount;
  gainType: 'SHORT_TERM' | 'LONG_TERM';
  estimatedTaxLiability: ActiveOrHistoricCurrencyAndAmount;
}

export interface TrustFundBeneficiary {
  beneficiaryId: string;
  name: string;
  relationship: string;
  distributionPercentage: number; // 0.0 to 1.0
  vestingSchedule?: {
    milestoneAge?: number;
    milestoneDate?: string;
    percentageVested: number;
  }[];
}

export interface TrustFund {
  trustId: string;
  trusteeName: string;
  grantorName: string;
  beneficiaries: TrustFundBeneficiary[];
  totalAssetsValue: ActiveOrHistoricCurrencyAndAmount;
  distributionRules: {
    ruleId: string;
    triggerType: 'AGE' | 'DATE' | 'EDUCATION_MILESTONE' | 'DISCRETIONARY';
    triggerValue: string;
    maxDistributionAmount?: ActiveOrHistoricCurrencyAndAmount;
  }[];
  taxStatus: 'REVOCABLE' | 'IRREVOCABLE';
}

export interface DonorAdvisedFund {
  dafId: string;
  fundName: string;
  sponsorOrganization: string;
  currentBalance: ActiveOrHistoricCurrencyAndAmount;
  contributionsHistory: {
    contributionId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    taxDeductionReceiptUrl?: string;
  }[];
  grantsDistributed: {
    grantId: string;
    charityName: string;
    charityTaxId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'DISBURSED';
  }[];
}

export interface PhilanthropicImpactMetrics {
  impactId: string;
  charityName: string;
  unSustainableDevelopmentGoals: number[]; // SDG numbers 1-17
  livesImpactedCount: number;
  carbonOffsetTons?: number;
  educationHoursProvided?: number;
  cleanWaterLitersProvided?: number;
  impactScore: number; // Scale of 1-100
}import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}
/**
 * ==============================================================================
 * SECTION 3: EXECUTIVE MAGAZINE & MULTIMEDIA CREATION TYPES
 * ==============================================================================
 * Types governing the generation, layout, rendering, and narration of high-end
 * digital publications, executive lookbooks, and AI-driven multimedia assets.
 */

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
  'Wall Street Boardroom',
  'Silicon Valley Tech Campus',
  'Dubai Skyscraper Penthouse',
  'Paris Fashion Week Front Row',
  'Private Island Villa',
  'Luxury Private Jet',
  'Monaco Yacht Deck',
  'Swiss Alps Davos Summit'
];

export const STYLES = [
  'Power Suit (Classic Bespoke)',
  'Tech Mogul (Minimalist Luxury)',
  'Black Tie Gala (Formal)',
  'Avant-Garde Executive (Bold)',
  'Old Money (Quiet Luxury)',
  'Streetwear CEO (High-End Casual)'
];

export type RenderingEngine = 'stable-diffusion' | 'midjourney' | 'dall-e-3' | 'flux' | 'imagen' | 'custom-gan';

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
  lighting?: string;
  cameraAngle?: string;
  colorPalette?: string[];
  historicalReference?: string;
  brandTags?: string[];
}

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  videoUrl?: string;
  isAnimating?: boolean;
  audioUrl?: string;
  narrationText?: string;
  renderingEngine?: RenderingEngine;
  promptUsed?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  seed?: number;
  cfgScale?: number;
  steps?: number;
  generationTimeMs?: number;
  error?: string;
}

export interface Asset {
  id: string;
  base64: string;
  desc: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  body: string;
  elements: VisualElement[];
}

export interface VisualElement {
  id: string;
  type: 'image' | 'seal' | 'divider' | 'illustration' | 'scenery';
  src: string;
  position: { x: number; y: number };
  alt: string;
  isAnimated?: boolean;
  scale?: number;
  rotation?: number;
}

export enum AIServiceAction {
  REWRITE = 'REWRITE',
  ILLUMINATE = 'ILLUMINATE',
  PROPHESY = 'PROPHESY',
  SEAL = 'SEAL',
  CIPHER = 'CIPHER',
  SCENERY = 'SCENERY',
  ENCHANT = 'ENCHANT'
}

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Ariel' | 'Oberon' | 'Titania';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  sampleRateHz?: number;
  languageCode?: string;
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
  audioUrl?: string;
  durationMs?: number;
  characterCount: number;
}

/**
 * ==============================================================================
 * SECTION 4: NEWS, FEEDS & SENTIMENT ANALYSIS TYPES
 * ==============================================================================
 * Structures governing real-time financial news aggregation, sentiment analysis,
 * urgency scoring, and AI-driven market insights.
 */

export enum StaticCategory {
  TOP_STORIES = 'Global Pulse',
  POLITICS = 'Governance',
  TECH = 'Infrastructure',
  FINANCE = 'Markets',
  CRYPTO = 'Decentralized Ledger',
  ENERGY = 'Thermodynamics',
  BIOTECH = 'Genomics',
  SPACE = 'Orbital Mechanics'
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: number; // Scale of 1-10
  tags: string[];
  author?: string;
  content?: string;
  imageUrl?: string;
  sentimentScore?: number; // Continuous value from -1.0 to 1.0
  relevanceScore?: number; // Continuous value from 0.0 to 1.0
  language?: string;
  isFactChecked?: boolean;
  factCheckDetails?: string;
  biasRating?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  relatedTickers?: string[];
}

export interface FeedPage {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  lastUpdated: string;
  aiInsights: string;
  curatorId?: string;
  isPublic: boolean;
  subscriberCount?: number;
  customFilterCriteria?: FilterCriterion[];
}

/**
 * ==============================================================================
 * SECTION 5: FILE SYSTEM, STORAGE & CLOUD MANAGEMENT TYPES
 * ==============================================================================
 * Types governing local and cloud file systems, indexing, AI-assisted summaries,
 * and multi-source repository exploration.
 */

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  GENERIC = 'generic',
  CODE = 'code',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  DATABASE = 'database',
  MODEL_3D = 'model_3d'
}

export type FileSource = 'local' | 'github' | 'ai' | 'google-drive' | 'aws-s3' | 'ipfs' | 'dropbox';

export interface FileVersion {
  versionId: string;
  modifiedBy: string;
  modifiedAt: string;
  size: number;
  changeLog?: string;
  downloadUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string | null;
  source: FileSource;
  extension?: string;
  mimeType?: string;
  content?: string; // Text, DataURL, or Download URL
  aiSummary?: string;
  aiKeywords?: string[];
  isIndexing?: boolean;
  githubRepo?: string;
  githubOwner?: string;
  githubUrl?: string;
  driveFileId?: string;
  isCloudFolder?: boolean;
  ownerId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  versionHistory?: FileVersion[];
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  hash?: string;
  tags?: string[];
}

export interface NavigationState {
  currentPath: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid' | 'gallery' | 'tree' | 'kanban';
  sortBy: 'name' | 'size' | 'lastModified' | 'type';
  sortDirection: 'asc' | 'desc';
  searchQuery?: string;
  filterType?: FileType | 'all';
}

/**
 * ==============================================================================
 * SECTION 6: CORE BANKING, TRANSACTIONS & CAPITAL ALLOCATION TYPES
 * ==============================================================================
 * Foundational types for personal and corporate banking, ledger accounts,
 * transaction processing, and AI-driven financial planning.
 */

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'fedwire' | 'rtp';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'credit' | 'debit';

export type TransactionStatus =
  | 'POSTED'
  | 'PENDING'
  | 'Initiated'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'needs_approval'
  | 'approved'
  | 'denied'
  | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string | string[];
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: KeyValuePairs;
  pending?: boolean;
  reconciled?: boolean;
  reconciliation_id?: string;
  nexus_link_id?: string;
  institution_origin?: string;
  cardId?: string;
  holderName?: string;
  merchant?: string;
  status?: TransactionStatus;
  timestamp?: string;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string;
  assetClass?: string;
  riskLevel?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining?: number;
  category?: string;
  alerts?: Alert[];
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
  credits: number;
}

export interface AIPlanStep {
  title: string;
  description: string;
  timeline: string;
  category?: string;
}

export interface AIPlan {
  title: string;
  summary: string;
  steps: AIPlanStep[];
}

export type IllusionType = 'none' | 'aurora' | 'blue' | 'dark';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  institutionId?: string;
  type?: string;
  balance?: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: string;
}

export enum WeaverStage {
  Pitch = 'pitch',
  Analysis = 'analysis',
  Test = 'test',
  FinalReview = 'final_review',
  Approved = 'approved',
  Results = 'results',
  Error = 'error'
}

export interface QuantumWeaverState {
  stage: WeaverStage;
  businessPlan: string;
  feedback: string;
  questions: AIQuestion[];
  loanAmount: number;
  coachingPlan: AIPlan | null;
  error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  aiJustification?: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress?: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCardControls {
  atm: boolean;
  contactless: boolean;
  online: boolean;
  monthlyLimit: number;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: CorporateCardControls;
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description?: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Counterparty {
  id: string;
  name: string;
  email?: string | null;
  send_remittance_advice?: boolean;
  type?: 'business' | 'individual';
  riskLevel?: 'Low' | 'Medium' | 'High';
  createdDate?: string;
  accounts: ExternalAccount[];
  virtualAccounts: VirtualAccount[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name?: string;
  verification_status?: string;
  account_details?: any[];
  routing_details?: any[];
}

export interface VirtualAccount {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  balance?: number;
  currency?: string;
  status?: string;
  subAccounts?: VirtualAccount[];
  description?: string;
  counterparty_id?: string;
  internal_account_id?: string;
  debit_ledger_account_id?: string;
  credit_ledger_account_id?: string;
  metadata?: any;
  account_details?: any[];
  routing_details?: any[];
}

export interface AIGoalPlanStep {
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Investing' | 'Income' | string;
}

export interface AIGoalPlan {
  feasibilitySummary: string;
  monthlyContribution: number;
  steps: AIGoalPlanStep[];
  actionableSteps?: string[];
  summary?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'recurring';
}

export interface RecurringContribution {
  id: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface LinkedGoal {
  id: string;
  relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
  triggerAmount?: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  iconName: string;
  plan: AIGoalPlan | null;
  startDate: string;
  riskProfile?: RiskProfile;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  linkedGoals: LinkedGoal[];
  recurringContributions: RecurringContribution[];
  contributions: Contribution[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number; // in reward points
  type: 'cashback' | 'giftcard' | 'impact' | string;
  description: string;
  iconName: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini' | string;

export interface APIStatus {
  provider: APIProvider;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number; // in ms
}

export interface CreditFactor {
  name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix' | string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}
/**
 * ==============================================================================
 * SECTION 7: PLAID, MARQETA, MODERN TREASURY & OPEN BANKING INTEGRATION TYPES
 * ==============================================================================
 * Enterprise-grade types governing secure connections, credential management,
 * card issuance, ledgering, and multi-node financial mesh protocols.
 */

export interface PlaidCredentials {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

export interface MarqetaCredentials {
  app_token?: string;
  admin_token?: string;
  applicationToken?: string;
  adminAccessToken?: string;
  base_url?: string;
}

export interface ModernTreasuryCredentials {
  apiKey: string;
  orgId?: string;
  organizationId?: string;
}

export interface PlaidTokenState {
  linkToken: string | null;
  publicToken: string | null;
  accessToken: string | null;
}

export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: AccountBalance;
  institution?: string;
}

export interface ConnectedItem {
  institutionId: string;
  institutionName: string;
  accessToken: string;
  itemId: string;
  accounts: Account[];
  transactions: Transaction[];
  metadata: {
    linked_at: string;
    node_priority: number;
    mesh_protocol: 'NEXUS-V3' | string;
    routing_hops: string[];
  };
}

export interface UCCFiling {
  id: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Filed' | 'Rejected';
  receiptId?: string;
  fileNumber?: string;
  packetNum: string;
  transType: 'Initial' | 'Amendment';
  amount: number;
  dateCreated: string;
  xmlPayload: string;
  errors?: string[];
}

export interface UnifiedPayload {
  timestamp: string;
  nexus_version: string;
  nexus_id: string;
  global_metadata: {
    client_context: string;
    reconciliation_depth: number;
    combined_hash: string;
  };
  mesh_stats: {
    total_liquidity: number;
    total_liabilities: number;
    net_position: number;
    active_institutions: number;
  };
  cross_institutional_ledger: {
    items: ConnectedItem[];
    reconciled_pairs: any[];
  };
  compliance: {
    active_ucc_filings: UCCFiling[];
  };
}

export enum FlowStep {
  CREDENTIALS = 'CREDENTIALS',
  LINK_TOKEN = 'LINK_TOKEN',
  LINK_UI = 'LINK_UI',
  EXCHANGE = 'EXCHANGE',
  DASHBOARD = 'DASHBOARD',
  UCC_CENTER = 'UCC_CENTER',
  MARQETA_NODE = 'MARQETA_NODE',
  MODERN_TREASURY_NODE = 'MODERN_TREASURY_NODE',
  TAXONOMY_REGISTRY = 'TAXONOMY_REGISTRY'
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  created_time?: string;
  start_date?: string;
  config: any;
}

export interface MarqetaCard {
  token: string;
  user_token: string;
  card_product_token: string;
  last_four: string;
  pan: string;
  expiration: string;
  cvv: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | string;
}

export interface MTLedger {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, string>;
}

export interface MTInternalAccount {
  id: string;
  name: string;
  currency: string;
  connection: { vendor_name: string };
  status: string;
}

export interface PlaidLinkSuccessMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id?: string;
}

export type PlaidProduct =
  | 'assets'
  | 'auth'
  | 'balance'
  | 'identity'
  | 'investments'
  | 'liabilities'
  | 'payment_initiation'
  | 'transactions';

export interface MarqetaUser {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  last_modified_time: string;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns?: string;
  };
  provider?: any;
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface LedgerAccount {
  id: string;
  name: string;
  balances: {
    available_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
    posted_balance: { amount: number; currency: string };
  };
}

export interface SettlementInstruction {
  messageId: string;
  creationDateTime: string;
  numberOfTransactions: number;
  settlementDate: string;
  totalAmount: number;
  currency: string;
  purpose?: string;
}

/**
 * ==============================================================================
 * SECTION 8: ENTERPRISE OPERATIONS, CORPORATE COMMAND, COMPLIANCE & ISO 20022
 * ==============================================================================
 * Types governing corporate command centers, compliance audits, anomaly detection,
 * cash flow forecasting, and ISO 20022 financial messaging standards.
 */

export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore?: number;
  recommendedAction?: string;
}

export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

export interface FraudRule {
  id: string;
  name: string;
  description?: string;
  severity: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
}

export interface ComplianceCase {
  id: string;
  reason: string;
  entityType: string;
  entityId: string;
  status: 'open' | 'closed' | 'investigating' | string;
  openedDate: string;
  type?: string;
  description?: string;
}

export interface FinancialAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: AnomalyStatus;
  entityType: string;
  entityId: string;
  entityDescription: string;
  timestamp: string;
  riskScore: number;
}

export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'False Positive';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  action: 'flag_for_review' | 'block' | 'notify_admin' | string;
  active: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  revenue: number;
  growth: number;
  riskScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetResource: string;
  success: boolean;
  details?: string;
  metadata?: any;
  ipAddress?: string;
}

export interface ThreatAlert {
  alertId: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataSharingPolicy {
  policyId: string;
  policyName: string;
  scope: string;
  isActive: boolean;
  lastReviewed: string;
}

export interface APIKey {
  id: string;
  keyName: string;
  creationDate: string;
  scopes: string[];
  lastUsed?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  verified: boolean;
}

export interface SecurityAwarenessModule {
  moduleId: string;
  title: string;
  completionRate: number;
}

export interface TransactionRule {
  ruleId: string;
  name: string;
  triggerCondition: string;
  action: string;
  isEnabled: boolean;
}

export interface SecurityScoreMetric {
  metricName: string;
  currentValue: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  lastActivity: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  permissions: string[];
  status: string;
  firstSeen: string;
  userAgent: string;
  pushNotificationsEnabled: boolean;
  biometricAuthEnabled: boolean;
  encryptionStatus: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  timestamp: string;
  isCurrent: boolean;
  userAgent: string;
}

export interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password?: string;
  databaseName: string;
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full';
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface WebDriverStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  activeTask: string | null;
  logs: string[];
}

export interface ExternalCorporateActionEventType1Code {}
export interface ExternalAcceptedReason1Code {}
export interface ExternalAccountIdentification1Code {}
export interface ExternalAgentInstruction1Code {}
export interface ExternalAgreementType1Code {}
export interface ExternalAuthenticationChannel1Code {}
export interface ExternalAuthenticationMethod1Code {}
export interface ExternalAuthorityExchangeReason1Code {}
export interface ExternalAuthorityIdentification1Code {}
export interface ExternalBalanceSubType1Code {}
export interface ExternalBalanceType1Code {}
export interface ExternalBankTransactionDomain1Code {}
export interface ExternalBankTransactionFamily1Code {}
export interface ExternalBankTransactionSubFamily1Code {}
export interface ExternalBenchmarkCurveName1Code {}
export interface ExternalBillingBalanceType1Code {}
export interface ExternalBillingCompensationType1Code {}
export interface ExternalBillingRateIdentification1Code {}
export interface ExternalCalculationAgent1Code {}
export interface ExternalCancellationReason1Code {}
export interface ExternalCardTransactionCategory1Code {}
export interface ExternalCashAccountType1Code {}
export interface ExternalCashClearingSystem1Code {}
export interface ExternalCategoryPurpose1Code {}
export interface ExternalChannel1Code {}
export interface ExternalChargeType1Code {}
export interface ExternalChequeAgentInstruction1Code {}
export interface ExternalChequeCancellationReason1Code {}
export interface ExternalChequeCancellationStatus1Code {}
export interface ExternalClaimNonReceiptRejection1Code {}
export interface ExternalClearingSystemIdentification1Code {}
export interface ExternalCollateralReferenceDataStatusReason1Code {}
export interface ExternalCommunicationFormat1Code {}
export interface ExternalContractBalanceType1Code {}
export interface ExternalContractClosureReason1Code {}
export interface ExternalCreditLineType1Code {}
export interface ExternalCreditorAgentInstruction1Code {}
export interface ExternalCreditorEnrolmentAmendmentReason1Code {}
export interface ExternalCreditorEnrolmentCancellationReason1Code {}
export interface ExternalCreditorEnrolmentStatusReason1Code {}
export interface ExternalCreditorReferenceType1Code {}
export interface ExternalDateFrequency1Code {}
export interface ExternalDateType1Code {}
export interface ExternalDebtorActivationAmendmentReason1Code {}
export interface ExternalDebtorActivationCancellationReason1Code {}
export interface ExternalDebtorActivationStatusReason1Code {}
export interface ExternalDebtorAgentInstruction1Code {}
export interface ExternalDeviceOperatingSystemType1Code {}
export interface ExternalDiscountAmountType1Code {}
export interface ExternalDocumentAmountType1Code {}
export interface ExternalDocumentFormat1Code {}
export interface ExternalDocumentLineType1Code {}
export interface ExternalDocumentPurpose1Code {}
export interface ExternalDocumentType1Code {}
export interface ExternalEffectiveDateParameter1Code {}
export interface ExternalEmissionAllowanceSubProductType1Code {}
export interface ExternalEncryptedElementIdentification1Code {}
export interface ExternalEnquiryRequestType1Code {}
export interface ExternalEntitySize1Code {}
export interface ExternalEntityType1Code {}
export interface ExternalEntryStatus1Code {}
export interface ExternalFinancialInstitutionIdentification1Code {}
export interface ExternalFinancialInstrumentIdentificationType1Code {}
export interface ExternalFinancialInstrumentProductType1Code {}
export interface ExternalGarnishmentType1Code {}
export interface ExternalIncoterms1Code {}
export interface ExternalIndustrySectorClassification1Code {}
export interface ExternalInformationType1Code {}
export interface ExternalInstructedAgentInstruction1Code {}
export interface ExternalInvestigationAction1Code {}
export interface ExternalInvestigationActionReason1Code {}
export interface ExternalInvestigationExecutionConfirmation1Code {}
export interface ExternalInvestigationInstrument1Code {}
export interface ExternalInvestigationReason1Code {}
export interface ExternalInvestigationReasonSubType1Code {}
export interface ExternalInvestigationServiceLevel1Code {}
export interface ExternalInvestigationStatus1Code {}
export interface ExternalInvestigationStatusReason1Code {}
export interface ExternalInvestigationSubType1Code {}
export interface ExternalInvestigationType1Code {}
export interface ExternalLegalFramework1Code {}
export interface ExternalLetterType1Code {}
export interface ExternalLocalInstrument1Code {}
export interface ExternalMandateReason1Code {}
export interface ExternalMandateSetupReason1Code {}
export interface ExternalMandateStatus1Code {}
export interface ExternalMandateSuspensionReason1Code {}
export interface ExternalMarketArea1Code {}
export interface ExternalMarketInfrastructure1Code {}
export interface ExternalMessageFunction1Code {}
export interface ExternalModelFormIdentification1Code {}
export interface ExternalNarrativeType1Code {}
export interface ExternalNotificationCancellationReason1Code {}
export interface ExternalNotificationSubType1Code {}
export interface ExternalNotificationType1Code {}
export interface ExternalOrganisationIdentification1Code {}
export interface ExternalPackagingType1Code {}
export interface ExternalPartyRelationshipType1Code {}
export interface ExternalPaymentCancellationRejection1Code {}
export interface ExternalPaymentCompensationReason1Code {}
export interface ExternalPaymentControlRequestType1Code {}
export interface ExternalPaymentGroupStatus1Code {}
export interface ExternalPaymentModificationRejection1Code {}
export interface ExternalPaymentRole1Code {}
export interface ExternalPaymentScenario1Code {}
export interface ExternalPaymentTransactionStatus1Code {}
export interface ExternalPendingProcessingReason1Code {}
export interface ExternalPersonIdentification1Code {}
export interface ExternalPostTradeEventType1Code {}
export interface ExternalProductType1Code {}
export interface ExternalProxyAccountType1Code {}
export interface ExternalPurpose1Code {}
export interface ExternalRatesAndTenors1Code {}
export interface ExternalReRepresentmentReason1Code {}
export interface ExternalReceivedReason1Code {}
export interface ExternalRegulatoryInformationType1Code {}
export interface ExternalRejectedReason1Code {}
export interface ExternalRelativeTo1Code {}
export interface ExternalReportingSource1Code {}
export interface ExternalRequestStatus1Code {}
export interface ExternalReservationType1Code {}
export interface ExternalReturnReason1Code {}
export interface ExternalReversalReason1Code {}
export interface ExternalSecuritiesLendingType1Code {}
export interface ExternalSecuritiesPurpose1Code {}
export interface ExternalSecuritiesUpdateReason1Code {}
export interface ExternalServiceLevel1Code {}
export interface ExternalShipmentCondition1Code {}
export interface ExternalStatusReason1Code {}
export interface ExternalSystemBalanceType1Code {}
export interface ExternalSystemErrorHandling1Code {}
export interface ExternalSystemEventType1Code {}
export interface ExternalSystemMemberType1Code {}
export interface ExternalSystemPartyType1Code {}
export interface ExternalTaxAmountType1Code {}
export interface ExternalTechnicalInputChannel1Code {}
export interface ExternalTradeMarket1Code {}
export interface ExternalTradeTransactionCondition1Code {}
export interface ExternalTypeOfParty1Code {}
export interface ExternalUnableToApplyIncorrectData1Code {}
export interface ExternalUnableToApplyMissingData1Code {}
export interface ExternalUnderlyingTradeTransactionType1Code {}
export interface ExternalUndertakingAmountType1Code {}
export interface ExternalUndertakingDocumentType1Code {}
export interface ExternalUndertakingDocumentType2Code {}
export interface ExternalUndertakingStatusCategory1Code {}
export interface ExternalUndertakingType1Code {}
export interface ExternalUnitOfMeasure1Code {}
export interface ExternalValidationRuleIdentification1Code {}
export interface ExternalVerificationReason1Code {}
export interface Biso20022 {}
/**
 * ==============================================================================
 * SECTION 9: SOVEREIGN IDENTITY, USER PROFILES & SOCIAL GRAPH TYPES
 * ==============================================================================
 * Enterprise-grade identity structures, multi-role authorization matrices,
 * neural-lace telemetry, genomic anchors, and decentralized social graph nodes.
 */

export enum View {
  // --- Core ---
  Dashboard = 'dashboard',
  
  // --- Personal Command ---
  Transactions = 'transactions',
  SendMoney = 'send-money',
  Budgets = 'capital-allocation', // Renamed for spec
  FinancialGoals = 'strategic-goals',
  CreditHealth = 'credit-resonance',
  Personalization = 'interface-will',
  Accounts = 'accounts-overview',
  
  // --- Sovereign Wealth ---
  Investments = 'portfolio-overview',
  Crypto = 'web3-crypto',
  CryptoWeb3 = 'web3-crypto', // Added alias
  AlgoTradingLab = 'algo-trading-lab',
  ForexArena = 'forex-arena',
  CommoditiesExchange = 'commodities',
  RealEstateEmpire = 'real-estate',
  ArtCollectibles = 'art-collectibles',
  DerivativesDesk = 'derivatives',
  VentureCapital = 'venture-capital',
  PrivateEquity = 'private-equity',
  TaxOptimization = 'tax-optimization',
  LegacyBuilder = 'legacy-architect',
  SovereignWealth = 'sovereign-wealth-sim',
  QuantumAssets = 'quantum-assets',
  
  // --- Citi Connect Core ---
  CitibankAccounts = 'citi-accounts',
  CitibankAccountProxy = 'citi-account-proxy',
  CitibankBillPay = 'citi-bill-payment',
  CitibankCrossBorder = 'citi-cross-border',
  CitibankPayeeManagement = 'citi-payee-mgmt',
  CitibankStandingInstructions = 'citi-standing-instructions',
  CitibankDeveloperTools = 'citi-dev-tools',
  CitibankEligibility = 'citi-eligibility-check',
  CitibankUnmaskedData = 'citi-secure-data-view',

  // --- Plaid Nexus ---
  PlaidMainDashboard = 'plaid-overview',
  DataNetwork = 'plaid-overview', // Added alias
  PlaidIdentity = 'plaid-identity-verification',
  PlaidCRAMonitoring = 'plaid-cra-monitoring',
  PlaidInstitutions = 'plaid-institutions-explorer',
  PlaidItemManagement = 'plaid-item-management',
  
  // --- Enterprise Operations ---
  CorporateCommand = 'corporate-command',
  ModernTreasury = 'modern-treasury',
  Treasury = 'treasury-capital',
  CardPrograms = 'marqeta-cards',
  Payments = 'stripe-payments',
  StripeNexus = 'stripe-nexus',
  CounterpartyDashboard = 'counterparties',
  VirtualAccounts = 'virtual-accounts',
  CorporateActions = 'corporate-actions',
  CreditNoteLedger = 'credit-notes',
  ReconciliationHub = 'reconciliation-hub',
  GEINDashboard = 'gein-dashboard',
  CardholderManagement = 'cardholder-mgmt',
  VentureCapitalDeskView = 'vc-desk-view',

  // --- System & Intelligence ---
  AIAdvisor = 'ai-advisor',
  AIInsights = 'predictive-insights',
  QuantumWeaver = 'quantum-weaver',
  AgentMarketplace = 'agent-marketplace',
  AIAdStudio = 'ai-ad-studio',
  GlobalPositionMap = 'global-position-map',
  GlobalSsiHub = 'global-ssi-hub',
  SecurityCompliance = 'security-compliance',
  DeveloperHub = 'developer-hub',
  SchemaExplorer = 'iso-20022-explorer',
  ResourceGraph = 'resource-graph',
  TheVision = 'the-vision',
  ApiPlayground = 'api-playground',
  ComplianceOracle = 'compliance-oracle',

  // --- Admin & Tools ---
  CustomerDashboard = 'customer-dashboard',
  VerificationReports = 'verification-reports',
  FinancialReporting = 'financial-reporting',
  StripeNexusDashboard = 'stripe-nexus-admin',

  // --- Components (Direct Access) ---
  AccountDetails = 'account-details',
  AccountList = 'account-list',
  AccountStatementGrid = 'account-statement-grid',
  AccountsView = 'accounts-view',
  AccountVerificationModal = 'account-verification-modal',
  ACHDetailsDisplay = 'ach-details-display',
  AICommandLog = 'ai-command-log',
  AIPredictionWidget = 'ai-prediction-widget',
  AssetCatalog = 'asset-catalog',
  AutomatedSweepRules = 'automated-sweep-rules',
  BalanceReportChart = 'balance-report-chart',
  BalanceTransactionTable = 'balance-transaction-table',
  CardDesignVisualizer = 'card-design-visualizer',
  ChargeDetailModal = 'charge-detail-modal',
  ChargeList = 'charge-list',
  ConductorConfigurationView = 'conductor-configuration-view',
  CounterpartyDetails = 'counterparty-details',
  CounterpartyForm = 'counterparty-form',
  DisruptionIndexMeter = 'disruption-index-meter',
  DocumentUploader = 'document-uploader',
  DownloadLink = 'download-link',
  EarlyFraudWarningFeed = 'early-fraud-warning-feed',
  ElectionChoiceForm = 'election-choice-form',
  EventNotificationCard = 'event-notification-card',
  ExpectedPaymentsTable = 'expected-payments-table',
  ExternalAccountCard = 'external-account-card',
  ExternalAccountForm = 'external-account-form',
  ExternalAccountsTable = 'external-accounts-table',
  FinancialAccountCard = 'financial-account-card',
  IncomingPaymentDetailList = 'incoming-payment-detail-list',
  InvoiceFinancingRequest = 'invoice-financing-request',
  PaymentInitiationForm = 'payment-initiation-form',
  PaymentMethodDetails = 'payment-method-details',
  PaymentOrderForm = 'payment-order-form',
  PayoutsDashboard = 'payouts-dashboard',
  PnLChart = 'pnl-chart',
  RefundForm = 'refund-form',
  RemittanceInfoEditor = 'remittance-info-editor',
  ReportingView = 'reporting-view',
  ReportRunGenerator = 'report-run-generator',
  ReportStatusIndicator = 'report-status-indicator',
  SsiEditorForm = 'ssi-editor-form',
  StripeNexusView = 'stripe-nexus-view',
  StripeStatusBadge = 'stripe-status-badge',
  StructuredPurposeInput = 'structured-purpose-input',
  SubscriptionList = 'subscription-list',
  TimeSeriesChart = 'time-series-chart',
  TradeConfirmationModal = 'trade-confirmation-modal',
  TransactionFilter = 'transaction-filter',
  TransactionList = 'transaction-list',
  TreasuryTransactionList = 'treasury-transaction-list',
  UniversalObjectInspector = 'universal-object-inspector',
  VirtualAccountForm = 'virtual-account-form',
  VirtualAccountsTable = 'virtual-accounts-table',
  VoiceControl = 'voice-control',
  WebhookSimulator = 'webhook-simulator',

  // Educational & 527 Views
  TheBook = 'the-book',
  KnowledgeBase = 'knowledge-base',
  
  // Auth & Settings
  Settings = 'settings',
  SSO = 'sso',
  ConciergeService = 'concierge-service',
  Philanthropy = 'philanthropy',
  OpenBanking = 'open-banking',
  FinancialDemocracy = 'financial-democracy',
  APIStatus = 'api-status',
  APIIntegration = 'api-integration',
  APIConsole = 'api-console',
  SecurityCenter = 'security-center',
  Security = 'security',
  AIStrategy = 'ai-strategy',
  Goals = 'financial-goals',
  Rewards = 'rewards',
  CardCustomization = 'card-customization',
}

export type UserRole =
  | 'ADMIN'
  | 'TRADER'
  | 'CLIENT'
  | 'VISIONARY'
  | 'CARETAKER'
  | 'QUANT_ANALYST'
  | 'SYSTEM_ARCHITECT'
  | 'ETHICS_OFFICER'
  | 'DATA_SCIENTIST'
  | 'NETWORK_WEAVER'
  | 'CITIZEN'
  | 'FOUNDER'
  | 'INVESTOR'
  | 'MANAGER';

export type SecurityLevel =
  | 'STANDARD'
  | 'ELEVATED'
  | 'TRADING_UNLOCKED'
  | 'QUANTUM_ENCRYPTED'
  | 'SOVEREIGN_CLEARED'
  | 'ARCHITECT_LEVEL';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles?: UserRole[];
  securityLevel?: SecurityLevel;
  netWorth?: number;
  display_name?: string;
  handle?: string;
  role?: string;
  businessId?: string;
  profilePictureUrl?: string;
  bio?: string;
  profile?: {
    interests: string[];
    skills: string[];
    [key: string]: any;
  };
  wallet?: {
    balance: number;
    currency: string;
  };
  businesses?: string[];
  memberships?: any[];
  followers?: string[];
  following?: string[];
  state?: {
    mood: string;
    activity: string;
    last_active_tick: number;
    [key: string]: any;
  };
  isAdmin?: boolean;
  title?: string;
  phone?: string;
  loyaltyTier?: string;
  usdBalance?: number;
  fiatBalance?: number;
  cryptoBalance?: number;
  avatarUrl?: string;
  tradingProfile?: any;
  biometricHashV2?: string;
  genomicSignatureId?: string;
  citizenship?: string;
  reputationScore?: number;
  threatVectorIndex?: number;
  neuralLaceSyncStatus?: string;
  cognitiveProfileId?: string;
  activeThoughtStreamId?: string | null;
  lastLoginCoordinates?: GeoCoordinate;
  temporalAnchorId?: string;
  activeSovereignAgentIds?: string[];
  permissionsGridHash?: string;
}

export type UserProfile = User;

export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  text: string;
  timestamp: string;
}

export interface PostContent {
  text: string;
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  financialData?: any;
}

export interface Post {
  id: string;
  author_id: string;
  userName: string;
  userProfilePic: string;
  created_tick: number;
  content: PostContent;
  type: 'text' | 'image' | 'video' | 'link' | 'financial_event';
  tags: string[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  visibility: 'public' | 'connections' | 'private';
  comments: Comment[];
}

export interface LendingPoolStats {
  totalCapital: number;
  interestRate: number;
  activeLoans: number;
  defaultRate: number;
  totalInterestEarned: number;
}

export interface AppIntegration {
  id: string;
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'disconnected' | 'issue';
}

export interface BiometricData {
  id: string;
  type: string;
  publicKey: string;
  enrolledDate: string;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  device?: string;
  browser?: string;
  os?: string;
  location?: string;
  isCurrent?: boolean;
  userAgent?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  specialization: string;
  traffic: number;
}

export interface SynapticVault {
  id: string;
  ownerIds: string[];
  ownerNames: string[];
  status: string;
  masterPrivateKeyFragment: string;
  creationDate: string;
}

export interface EcosystemKPIs {
  currentDate: string;
  totalEcosystemValue: number;
  totalTransactions: number;
  communityPoolCapital: number;
  activeUsers: number;
  gdp: number;
}

export interface SimulationEvent {
  id: string;
  tick: number;
  type: string;
  description: string;
  impact: any;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: 'service' | 'retail' | 'tech' | 'manufacturing' | 'finance' | 'platform';
  monthly_revenue: number;
  expenses: number;
  employees: string[];
  status: 'active' | 'bankrupt' | 'acquired';
  marketing_factor: number; // 0-1 multiplier
  businessPlan?: string;
  valuation?: number;
  cashBalance?: number;
  hqLocation?: string;
}

/**
 * ==============================================================================
 * SECTION 10: QUANTUM WEALTH, ALGORITHMIC TRADING & ALTERNATIVE ASSETS
 * ==============================================================================
 * Advanced structures for fractional real estate, fine art tokenization,
 * algorithmic trading strategies, venture capital startups, and Stripe ledger balances.
 */

export interface RealEstateProperty {
  id: string;
  address: string;
  value: number;
  rentalIncome: number;
  occupancyRate?: number;
  tokenizedShares?: number;
  yieldYTD?: number;
}

export interface ArtPiece {
  id: string;
  name: string;
  artist: string;
  value: number;
  year: number;
  medium?: string;
  provenance?: string[];
  fractionalOwnershipEnabled?: boolean;
}

export interface AlgoStrategy {
  id: string;
  name: string;
  performance: number;
  risk: 'Low' | 'Medium' | 'High';
  active: boolean;
  sharpeRatio?: number;
  maxDrawdown?: number;
  allocationPercentage?: number;
}

export interface VentureStartup {
  id: string;
  name: string;
  valuation: number;
  investment: number;
  equity: number;
  fundingRound?: 'Seed' | 'SeriesA' | 'SeriesB' | 'SeriesC' | 'Growth';
  burnRate?: number;
  runwayMonths?: number;
}

export interface StripeBalance {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
}

export interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number;
  description: string;
  customer_id?: string;
  receipt_url?: string;
  metadata: KeyValuePairs;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
  total_spent?: number;
  metadata?: KeyValuePairs;
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: number;
  plan_id: string;
  amount: number;
}

export type StripeResource = any;

/**
 * ==============================================================================
 * SECTION 11: GATEKEEPER VERIFICATION & CRYPTOGRAPHIC LEDGERS
 * ==============================================================================
 * Types governing secure micro-deposit verification, Modern Treasury external
 * account validation, and multi-factor cryptographic gatekeepers.
 */

export interface VerifyParams {
  externalAccountId: string;
  originatingAccountId: string;
  paymentType: 'ach' | 'eft' | 'rtp';
  currency: string;
  authToken: string; // The base64 string provided by user
}

export interface VerifyError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * ==============================================================================
 * SECTION 12: SACRED GEOMETRY, GEMATRIA & THEOLOGICAL PATTERNS
 * ==============================================================================
 * Types governing mathematical patterns, triangular numbers, gematria calculations,
 * and multi-layered cosmic/historical pattern analysis.
 */

export interface BibleBook {
  index: number;
  name: string;
  chapters: number;
  isTriangular: boolean;
}

export interface GematriaResult {
  word: string;
  sum: number;
  language: string;
  category: string;
}

export interface TriangularMetadata {
  index: number;
  value: number;
  significance: string;
}

export interface PatternLayer {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: 'Scripture' | 'Math' | 'Science' | 'Cosmic' | 'History';
}

/**
 * ==============================================================================
 * SECTION 13: LITERARY TRANSLATION, MANUSCRIPTS & REPOSITORY COMPENDIUMS
 * ==============================================================================
 * Types governing the transformation of raw codebases into literary masterpieces,
 * New York Times best-seller manuscripts, and virtual repository consensus engines.
 */

export interface Page {
  title: string;
  content: string; // Changed from string[] to string for narrative content
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  technicalSummary: string;
  imageryPrompt: string;
  imageUrl?: string;
  pages?: Page[];
}

export interface Section {
  title: string;
  chapters: Chapter[];
}

export type Book = Section[];

export interface Manuscript {
  repoName: string;
  title: string;
  preface: string;
  chapters: Chapter[];
  conclusion: string;
  generatedAt: string;
  author: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface KnowledgeBaseFile extends GitHubFile {
  repoName: string;
}

export interface AuditItem {
  file: GitHubFile;
  repo: GithubRepo;
}

export interface FileAnalysis {
  path: string;
  name: string;
  thoughts: string;
  hypnoticCommand: string;
  imageUrl?: string;
}

export interface ProjectCompendium {
  repoName: string;
  summaries: FileAnalysis[];
  masterStory: string;
  sacredDecree: string;
  ultimateBibliography: string;
  analyzedAt: string;
  totalFilesProcessed: number;
}

export interface VirtualRepository {
  name: string;
  files: Map<string, FileAnalysis>;
  consensus: any;
  isReady: boolean;
}

export interface SelectedContext {
  repo: GithubRepo | null;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
  isGenerating: boolean;
  status: string;
  compendium?: ProjectCompendium | null;
  virtualRepo?: VirtualRepository | null;
}

export interface RepoSession {
  repoId: number;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
}

/**
 * ==============================================================================
 * SECTION 14: ENTERPRISE PAYMENTS, SIMULATIONS & CLIENT REGISTRATION
 * ==============================================================================
 * Types governing enterprise-grade payee management, simulation engines,
 * client registration responses, and line-item ledger updates.
 */

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
}

export interface CustomerProfileResponse {
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  companyName: string;
  emails: Array<{
    emailAddress: string;
    preferenceType: string;
  }>;
  addressList: Array<{
    addressLine1: string;
    city: string;
    countryCode: string;
    postalCode: string;
    addressType: string;
  }>;
  phones: Array<{
    phoneType: string;
    fullPhoneNumber: string;
    preferenceType: string;
  }>;
}

export interface ClientRegisterResponse {
  client_id: string;
  client_secret: string;
  client_name: string;
  appId?: string;
  redirect_uris: string[];
  scope: string[];
  token_endpoint_auth_method?: string;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * ==============================================================================
 * SECTION 15: ADVANCED TYPESCRIPT UTILITY & TYPE-LEVEL PROGRAMMING
 * ==============================================================================
 * High-performance utility types for deep partials, readonly mapping,
 * union-to-intersection conversions, and type-safe property picking.
 */

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type PickProperties<T, U> = Pick<T, KeysOfType<T, U>>;

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type TupleToUnion<T extends any[]> = T[number];

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

/**
 * ==============================================================================
 * SECTION 16: ISO 20022 XML/JSON SCHEMA DEFINITIONS & MX/MT MESSAGE PARSERS
 * ==============================================================================
 * Exhaustive, production-grade type definitions for ISO 20022 financial messaging.
 * Covers pacs.008, pacs.009, pain.001, and camt.053 schemas with complete structural fidelity.
 */

export interface ActiveOrHistoricCurrencyAndAmount {
  value: number;
  currency: string;
}

export interface PostalAddress24 {
  adrTp?: 'MNDT' | 'ALCO' | 'BIZZ' | 'COMM' | 'DLVY' | 'HEAD' | 'OFFI' | 'HOME' | 'PBOX';
  dept?: string;
  subDept?: string;
  strtNm?: string;
  bldgNb?: string;
  bldgNm?: string;
  pstCd?: string;
  twnNm?: string;
  subPrvnc?: string;
  ctrySubDvsn?: string;
  ctry?: string;
  adrLine?: string[];
}

export interface PartyIdentification135 {
  nm?: string;
  pstlAdr?: PostalAddress24;
  id?: {
    orgId?: {
      anyBIC?: string;
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
    prvtId?: {
      dtAndPlcOfBirth?: {
        birthDt: string;
        prvncOfBirth?: string;
        cityOfBirth: string;
        ctryOfBirth: string;
      };
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
  };
  ctctDtls?: {
    nmPrfx?: 'DOCT' | 'MADM' | 'MISS' | 'MIST' | 'MIXX';
    nm?: string;
    phneNb?: string;
    mobPhneNb?: string;
    faxNb?: string;
    emailAdr?: string;
    emailPurp?: string;
    jobTitl?: string;
    rspnsblty?: string;
    dept?: string;
  };
}

export interface ClearingSystemMemberIdentification2 {
  clrSysId?: {
    cd?: string;
    prtry?: string;
  };
  mmbId: string;
}

export interface BranchAndFinancialInstitutionIdentification6 {
  finInstnId: {
    bicfi?: string;
    clrSysMmbId?: ClearingSystemMemberIdentification2;
    nm?: string;
    pstlAdr?: PostalAddress24;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  brnch?: {
    id?: string;
    nm?: string;
    pstlAdr?: PostalAddress24;
  };
}

export interface CashAccount38 {
  id: {
    iban?: string;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  tp?: {
    cd?: string;
    prtry?: string;
  };
  ccy?: string;
  nm?: string;
  prxy?: {
    tp?: { cd?: string; prtry?: string };
    id: string;
  };
}

export interface PaymentIdentification7 {
  instrId?: string;
  endToEndId: string;
  uetr?: string;
  txId?: string;
  clrSysRef?: string;
}

export interface GroupHeader93 {
  msgId: string;
  creDtTm: string;
  authstn?: {
    cd?: string;
    prtry?: string;
  }[];
  btchBookg?: boolean;
  nbOfTxs: string;
  ctrlSum?: number;
  initgPty?: PartyIdentification135;
  fwdgAgt?: BranchAndFinancialInstitutionIdentification6;
}

export interface CreditTransferTransaction39 {
  pmtId: PaymentIdentification7;
  pmtTpInf?: {
    instrPrty?: 'HIGH' | 'NORM';
    svcLvl?: { cd?: string; prtry?: string }[];
    lclInstrm?: { cd?: string; prtry?: string };
    ctgyPurp?: { cd?: string; prtry?: string };
  };
  intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
  intrBkSttlmDt?: string;
  sttlmPrty?: 'HIGH' | 'NORM';
  chrgBr: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
  chrgsInf?: {
    amt: ActiveOrHistoricCurrencyAndAmount;
    agt: BranchAndFinancialInstitutionIdentification6;
  }[];
  instgAgt?: BranchAndFinancialInstitutionIdentification6;
  instdAgt?: BranchAndFinancialInstitutionIdentification6;
  dbtr: PartyIdentification135;
  dbtrAcct?: CashAccount38;
  dbtrAgt: BranchAndFinancialInstitutionIdentification6;
  dbtrAgtAcct?: CashAccount38;
  cdtrAgt: BranchAndFinancialInstitutionIdentification6;
  cdtrAgtAcct?: CashAccount38;
  cdtr: PartyIdentification135;
  cdtrAcct?: CashAccount38;
  ultmtDbtr?: PartyIdentification135;
  ultmtCdtr?: PartyIdentification135;
  purp?: { cd?: string; prtry?: string };
  rgltryRptg?: {
    dbtCdtFlg?: 'DBIT' | 'CDIT';
    authrty?: { nm?: string; ctry?: string };
    dtls?: { cd?: string; prtry?: string; inf?: string[] }[];
  }[];
  rltdRmtInf?: {
    fcmtId?: string;
    docTp?: string;
    docNb?: string;
    dt?: string;
  }[];
  rmtInf?: {
    ustrd?: string[];
    strd?: {
      rfrdDocInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        nb?: string;
        rltdDt?: string;
      }[];
      rfrdDocAmt?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        amt: ActiveOrHistoricCurrencyAndAmount;
      }[];
      cdtrRefInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        ref?: string;
      };
      invcr?: PartyIdentification135;
      invcee?: PartyIdentification135;
    }[];
  };
}

export interface Pacs008Document {
  fitoficstmdbtct: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: CreditTransferTransaction39[];
  };
}

export interface Pacs009Document {
  ficreditTransfer: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: {
      pmtId: PaymentIdentification7;
      intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
      intrBkSttlmDt?: string;
      instgAgt?: BranchAndFinancialInstitutionIdentification6;
      instdAgt?: BranchAndFinancialInstitutionIdentification6;
      dbtr: BranchAndFinancialInstitutionIdentification6;
      dbtrAcct?: CashAccount38;
      dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtr: BranchAndFinancialInstitutionIdentification6;
      cdtrAcct?: CashAccount38;
    }[];
  };
}

export interface Pain001Document {
  cstmrCdtTrfInitn: {
    grpHdr: GroupHeader93;
    pmtInf: {
      pmtInfId: string;
      pmtMtd: 'TRF' | 'CHK' | 'TRA';
      btchBookg?: boolean;
      nbOfTxs?: string;
      ctrlSum?: number;
      pmtTpInf?: {
        instrPrty?: 'HIGH' | 'NORM';
        svcLvl?: { cd?: string; prtry?: string }[];
        lclInstrm?: { cd?: string; prtry?: string };
        ctgyPurp?: { cd?: string; prtry?: string };
      };
      reqdExctnDt: {
        dt?: string;
        dtTm?: string;
      };
      dbtr: PartyIdentification135;
      dbtrAcct: CashAccount38;
      dbtrAgt: BranchAndFinancialInstitutionIdentification6;
      dbtrAgtAcct?: CashAccount38;
      ultmtDbtr?: PartyIdentification135;
      chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
      cdtTrfTxInf: {
        pmtId: PaymentIdentification7;
        amt: {
          instdAmt?: ActiveOrHistoricCurrencyAndAmount;
          eqvAmt?: {
            amt: ActiveOrHistoricCurrencyAndAmount;
            ccyOfTrf: string;
          };
        };
        chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
        cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
        cdtrAgtAcct?: CashAccount38;
        cdtr: PartyIdentification135;
        cdtrAcct?: CashAccount38;
        ultmtCdtr?: PartyIdentification135;
        purp?: { cd?: string; prtry?: string };
        rmtInf?: { ustrd?: string[] };
      }[];
    }[];
  };
}

export interface Camt053Document {
  bkToCstmrStmt: {
    grpHdr: GroupHeader93;
    stmt: {
      id: string;
      elctrncSeqNb?: number;
      creDtTm: string;
      frToDt?: {
        frDtTm: string;
        toDtTm: string;
      };
      acct: CashAccount38;
      bal: {
        tp: {
          cdOrPrtry: { cd: string; prtry?: string };
        };
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        dt: { dtTm: string };
      }[];
      ntry?: {
        ntryRef?: string;
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        sts: 'BOOK' | 'PDNG';
        bookgDt?: { dtTm: string };
        valDt?: { dtTm: string };
        acctSvcrRef?: string;
        ntryDtls?: {
          txDtls?: {
            refs?: {
              endToEndId?: string;
              uetr?: string;
              txId?: string;
            };
            amtDtls?: {
              instdAmt?: {
                amt: ActiveOrHistoricCurrencyAndAmount;
              };
            };
            rltdPties?: {
              dbtr?: PartyIdentification135;
              cdtr?: PartyIdentification135;
            };
            rltdAgts?: {
              dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
              cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
            };
          }[];
        }[];
      }[];
    }[];
  };
}

/**
 * ==============================================================================
 * SECTION 17: QUANTUM LEDGER & MULTI-NODE CONSENSUS MESH PROTOCOL (NEXUS-V3)
 * ==============================================================================
 * Advanced cryptographic structures for zero-knowledge proofs, post-quantum
 * signatures, threshold multi-sig, and decentralized consensus state machines.
 */

export type QuantumSignatureScheme = 'Dilithium5' | 'Falcon1024' | 'SPHINCS+' | 'XMSS_MT';

export interface QuantumPublicKey {
  scheme: QuantumSignatureScheme;
  rawBytes: string; // Base64 encoded public key
  fingerprint: string; // SHA3-256 hash of the public key
}

export interface ZkProofPayload {
  provingSystem: 'Groth16' | 'Plonk' | 'Halo2' | 'Bulletproofs';
  proofBytes: string; // Base64 encoded proof
  publicInputs: string[]; // Array of public input values
  verificationKeyHash: string;
}

export interface ThresholdSignatureConfig {
  threshold: number; // 't' in t-of-n
  totalSigners: number; // 'n'
  publicKeys: QuantumPublicKey[];
  epochId: number;
}

export interface ConsensusState {
  currentEpoch: number;
  currentRound: number;
  leaderNodeId: string;
  activeValidators: string[];
  consensusThreshold: number;
  lastCommittedBlockHeight: number;
  lastCommittedBlockHash: string;
  pendingProposalsCount: number;
}

export interface StateChannel {
  channelId: string;
  participants: string[];
  nonce: number;
  balances: Record<string, ActiveOrHistoricCurrencyAndAmount>;
  signatures: Record<string, string>;
  status: 'OPEN' | 'CLOSING' | 'CLOSED' | 'DISPUTED';
  disputeTimeoutBlock?: number;
}

export interface MeshNode {
  nodeId: string;
  endpoint: string;
  version: string;
  reputationScore: number;
  latencyMs: number;
  isValidator: boolean;
  stakingBalance: ActiveOrHistoricCurrencyAndAmount;
  lastHeartbeat: string;
}

export interface BlockHeader {
  height: number;
  previousHash: string;
  merkleRoot: string;
  stateRoot: string;
  timestamp: number;
  validatorSignature: string;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface TransactionPayload {
  txHash: string;
  sender: string;
  recipient: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  nonce: number;
  gasLimit: number;
  gasPrice: ActiveOrHistoricCurrencyAndAmount;
  signature: string;
  zkProof?: ZkProofPayload;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface ConsensusMessage {
  messageId: string;
  senderNodeId: string;
  epoch: number;
  round: number;
  type: 'PROPOSE' | 'PREVOTE' | 'PRECOMMIT' | 'DECIDE';
  blockHash: string;
  signature: string;
}

/**
 * ==============================================================================
 * SECTION 18: AI SWARM ORCHESTRATION, AGENTIC WORKFLOWS & COGNITIVE THOUGHT STREAMS
 * ==============================================================================
 * Types governing multi-agent swarms, task decomposition graphs, agent-to-agent
 * communication protocols, vector database embeddings, and cognitive thought stream logs.
 */

export type AgentRole = 'ORCHESTRATOR' | 'CRITIC' | 'REFINER' | 'RESEARCHER' | 'CODER' | 'COMPLIANCE_OFFICER' | 'FINANCIAL_ANALYST';

export interface AgentCapability {
  name: string;
  description: string;
  parametersSchema: Record<string, any>; // JSON Schema for tool parameters
}

export interface TaskDecompositionNode {
  taskId: string;
  parentTaskId: string | null;
  assignedAgentId: string;
  description: string;
  dependencies: string[]; // Array of taskIds that must complete first
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  error?: string;
  attempts: number;
  maxAttempts: number;
}

export interface SwarmOrchestratorState {
  swarmId: string;
  activeAgents: Record<string, {
    agentId: string;
    role: AgentRole;
    status: 'IDLE' | 'WORKING' | 'CRITICIZING' | 'OFFLINE';
    currentTaskId?: string;
  }>;
  taskGraph: Record<string, TaskDecompositionNode>;
  overallProgress: number; // 0.0 to 1.0
  status: 'IDLE' | 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
}

export interface AgentMessage {
  messageId: string;
  senderId: string;
  recipientId: string; // Can be 'ALL' or specific agentId
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
  replyToId?: string;
}

export interface ThoughtStreamNode {
  nodeId: string;
  agentId: string;
  timestamp: number;
  thoughtType: 'OBSERVATION' | 'REASONING' | 'HYPOTHESIS' | 'CRITIQUE' | 'DECISION';
  content: string;
  confidenceScore: number; // 0.0 to 1.0
  parentThoughtId: string | null;
}

export interface VectorEmbedding {
  id: string;
  vector: number[];
  textPayload: string;
  metadata: Record<string, string | number | boolean>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface ToolExecutionContext {
  toolName: string;
  arguments: Record<string, any>;
  callerAgentId: string;
  timestamp: number;
  executionTimeMs?: number;
  status: 'SUCCESS' | 'ERROR';
  result?: any;
  error?: string;
}

/**
 * ==============================================================================
 * SECTION 19: ADVANCED ALGORITHMIC TRADING, HIGH-FREQUENCY ORDER BOOKS & RISK ENGINES
 * ==============================================================================
 * Types governing real-time order books (L1/L2/L3), market makers, execution
 * algorithms (TWAP, VWAP, Sniper), portfolio risk metrics, and margin/liquidation engines.
 */

export interface OrderBookLevel {
  price: number;
  quantity: number;
  orderCount?: number;
}

export interface OrderBookL2 {
  ticker: string;
  timestamp: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface OrderBookL3 {
  ticker: string;
  timestamp: number;
  bids: { orderId: string; price: number; quantity: number; ownerId: string }[];
  asks: { orderId: string; price: number; quantity: number; ownerId: string }[];
}

export type AlgoExecutionStrategy = 'TWAP' | 'VWAP' | 'SNIPER' | 'ICEBERG' | 'GRID' | 'MARKET_MAKER';

export interface AlgoTradingJob {
  jobId: string;
  ticker: string;
  strategy: AlgoExecutionStrategy;
  side: 'BUY' | 'SELL';
  totalQuantity: number;
  executedQuantity: number;
  limitPrice?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  parameters: {
    startTime: string;
    endTime: string;
    sliceIntervalSeconds?: number;
    maxParticipationRate?: number; // For VWAP
    icebergDisplayQuantity?: number;
  };
  status: 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  averageExecutionPrice: number;
  slippageBps: number;
  logs: string[];
}

export interface PortfolioRiskMetrics {
  portfolioId: string;
  timestamp: number;
  valueAtRisk95: ActiveOrHistoricCurrencyAndAmount; // 95% confidence VaR
  valueAtRisk99: ActiveOrHistoricCurrencyAndAmount; // 99% confidence VaR
  expectedShortfall: ActiveOrHistoricCurrencyAndAmount;
  sharpeRatio: number;
  sortinoRatio: number;
  betaToBenchmark: number;
  alphaToBenchmark: number;
  maxDrawdown: number;
  volatilityAnnualized: number;
}

export interface MarginAccount {
  accountId: string;
  collateralBalance: ActiveOrHistoricCurrencyAndAmount;
  borrowedBalance: ActiveOrHistoricCurrencyAndAmount;
  maintenanceMarginRequirement: number; // Percentage, e.g., 0.15 for 15%
  initialMarginRequirement: number; // Percentage, e.g., 0.30 for 30%
  currentMarginRatio: number; // collateral / borrowed
  liquidationPrice: number;
  status: 'HEALTHY' | 'MARGIN_CALL' | 'LIQUIDATING' | 'LIQUIDATED';
}

export interface LiquidationEvent {
  liquidationId: string;
  accountId: string;
  timestamp: number;
  liquidatedAsset: string;
  liquidatedQuantity: number;
  executionPrice: number;
  penaltyFee: ActiveOrHistoricCurrencyAndAmount;
  remainingCollateral: ActiveOrHistoricCurrencyAndAmount;
}
/**
 * ==============================================================================
 * SECTION 20: MULTI-MODAL AI AD STUDIO, CAMPAIGN GENERATION & AD PERFORMANCE TRACKING
 * ==============================================================================
 * Types for AI-generated marketing campaigns, ad creatives, target audience segments,
 * budget allocation, real-time bidding (RTB) parameters, conversion tracking, and
 * multi-channel attribution models.
 */

export type AdCampaignStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type AdCreativeType = 'IMAGE' | 'VIDEO' | 'TEXT' | 'CAROUSEL' | 'INTERACTIVE_HTML5' | 'AUDIO';

export type AttributionModelType = 'FIRST_TOUCH' | 'LAST_TOUCH' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'DATA_DRIVEN';

export interface AdPerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: ActiveOrHistoricCurrencyAndAmount;
  ctr: number; // Click-Through Rate (0.0 to 1.0)
  cpc: ActiveOrHistoricCurrencyAndAmount; // Cost Per Click
  cpa: ActiveOrHistoricCurrencyAndAmount; // Cost Per Acquisition
  roas: number; // Return on Ad Spend
  bounceRate: number; // 0.0 to 1.0
  averageEngagementTimeSeconds: number;
  conversionRate: number; // 0.0 to 1.0
}

export interface AudienceSegment {
  segmentId: string;
  name: string;
  description?: string;
  demographics: {
    ageRanges: string[];
    genders: string[];
    incomeBrackets?: string[];
    educationLevels?: string[];
  };
  interests: string[];
  behaviors: string[];
  geographicRegions: string[]; // ISO country/region codes
  estimatedReach: number;
  customDataTags?: Record<string, string>;
}

export interface AdCreative {
  creativeId: string;
  type: AdCreativeType;
  headline: LocalizedString;
  bodyText: LocalizedString;
  callToAction: string;
  mediaAssets: AssetMetadata[];
  generationPromptUsed?: string;
  aiModelId?: string;
  negativePromptUsed?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '2:3';
  metaData?: Record<string, any>;
}

export interface RealTimeBiddingConfig {
  maxBidAmount: ActiveOrHistoricCurrencyAndAmount;
  targetCpa?: ActiveOrHistoricCurrencyAndAmount;
  pacingStrategy: 'EVEN' | 'AHEAD' | 'ASAP';
  bidMultiplierRules: {
    dimension: 'device' | 'region' | 'time_of_day' | 'audience_segment';
    key: string;
    multiplier: number; // e.g., 1.2 for +20% bid
  }[];
}

export interface AdCampaign {
  campaignId: string;
  name: string;
  description?: string;
  status: AdCampaignStatus;
  channels: ('SOCIAL' | 'SEARCH' | 'DISPLAY' | 'PROGRAMMATIC' | 'EMAIL' | 'METAVERSE')[];
  targetAudience: AudienceSegment;
  creatives: AdCreative[];
  totalBudget: ActiveOrHistoricCurrencyAndAmount;
  dailyBudgetLimit: ActiveOrHistoricCurrencyAndAmount;
  startDate: string;
  endDate?: string;
  rtbConfig?: RealTimeBiddingConfig;
  performanceMetrics?: AdPerformanceMetrics;
  attributionModel: AttributionModelType;
  aiCreativeBrief?: string;
  lastOptimizedAt?: string;
}

/**
 * ==============================================================================
 * SECTION 21: CITIBANK CONNECTIVITY, OPEN BANKING API PROXIES & SECURE DATA EXCHANGE
 * ==============================================================================
 * Citi-specific API payloads, unmasked data views, standing instructions,
 * cross-border payment routing, payee management, and developer sandbox configurations.
 */

export type CitiAccountProxyStatus = 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';

export interface CitiAccountProxy {
  proxyId: string;
  realAccountId: string;
  mask: string;
  virtualIban: string;
  status: CitiAccountProxyStatus;
  allowedMerchantCategories: string[]; // MCC codes
  dailyLimit: ActiveOrHistoricCurrencyAndAmount;
  expirationDate: string;
  createdDate: string;
}

export interface CitiBillPayment {
  paymentId: string;
  billerId: string;
  billerName: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  status: 'PENDING' | 'PROCESSING' | 'EXECUTED' | 'FAILED';
  executionDate: string;
  recurringRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY';
    interval: number;
    endDate?: string;
  };
}

export interface CitiCrossBorderTransfer {
  transferId: string;
  senderBic: string;
  receiverBic: string;
  intermediaryBic?: string;
  fxRate: number;
  guaranteedUntil: string;
  transferFee: ActiveOrHistoricCurrencyAndAmount;
  regulatoryReportingCode?: string; // e.g., Central Bank reporting codes
  chargeBearer: 'OUR' | 'BEN' | 'SHA';
}

export interface CitiPayee {
  payeeId: string;
  name: string;
  accountDetails: CashAccount38;
  address?: PostalAddress24;
  status: 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED';
  verificationLevel: 'STANDARD' | 'ENHANCED_KYC' | 'SANCTION_CLEARED';
  lastPaidDate?: string;
}

export interface CitiStandingInstruction {
  instructionId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  frequency: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  nextExecutionDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export interface CitiDeveloperSandboxConfig {
  sandboxId: string;
  clientId: string;
  clientSecret: string;
  mockDataProfile: 'RETAIL_MASS' | 'HNW_SOVEREIGN' | 'CORPORATE_CONGLOMERATE';
  latencySimulationMs: number;
  errorSimulationRate: number; // 0.0 to 1.0
}

/**
 * ==============================================================================
 * SECTION 22: WEB3 DECENTRALIZED FINANCE (DeFi), LIQUIDITY POOLS & SMART CONTRACT INTERACTION
 * ==============================================================================
 * Types for decentralized lending pools, yield farming, automated market makers (AMMs),
 * gas estimation, smart contract ABIs, wallet provider details (EIP-6963), and cross-chain bridge protocols.
 */

export interface DeFiLendingPool {
  poolAddress: string;
  assetSymbol: string;
  totalDeposited: ActiveOrHistoricCurrencyAndAmount;
  totalBorrowed: ActiveOrHistoricCurrencyAndAmount;
  supplyApy: number; // Annual Percentage Yield
  borrowApy: number;
  utilizationRate: number; // 0.0 to 1.0
  collateralFactor: number; // 0.0 to 1.0
  liquidationThreshold: number; // 0.0 to 1.0
}

export interface YieldFarm {
  farmAddress: string;
  lpTokenAddress: string;
  rewardTokenAddress: string;
  tvl: ActiveOrHistoricCurrencyAndAmount; // Total Value Locked
  apr: number; // Annual Percentage Rate
  userStakedBalance: number;
  userPendingRewards: number;
}

export interface AmmPool {
  poolAddress: string;
  token0: { address: string; symbol: string; decimals: number };
  token1: { address: string; symbol: string; decimals: number };
  reserve0: number;
  reserve1: number;
  feeTierBps: number; // e.g., 30 for 0.3%
  volume24h: ActiveOrHistoricCurrencyAndAmount;
  totalLiquidity: ActiveOrHistoricCurrencyAndAmount;
}

export interface SmartContractAbiEntry {
  name: string;
  type: 'function' | 'event' | 'constructor' | 'fallback' | 'receive';
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  inputs: { name: string; type: string; indexed?: boolean }[];
  outputs?: { name: string; type: string }[];
}

export interface WalletProviderDetail {
  uuid: string;
  name: string;
  icon: string; // Base64 or URL
  rdns: string; // Reverse Domain Name System identifier
  providerInstance: any; // EIP-1193 provider instance
}

export interface CrossChainBridgeTx {
  txHash: string;
  sourceChainId: number;
  destinationChainId: number;
  assetSymbol: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  bridgeFee: ActiveOrHistoricCurrencyAndAmount;
  estimatedTimeMinutes: number;
}

/**
 * ==============================================================================
 * SECTION 23: FOREX ARENA, COMMODITIES EXCHANGE & DERIVATIVES DESK
 * ==============================================================================
 * Types for foreign exchange (FX) spot/forward contracts, leverage settings,
 * margin requirements, commodity futures, options chains (calls/puts, Greeks), and hedging strategies.
 */

export interface FxSpotContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  bidPrice: number;
  askPrice: number;
  pipValue: number;
  lotSize: number; // Standard lot is 100,000 units
}

export interface FxForwardContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  forwardRate: number;
  maturityDate: string;
  settlementType: 'PHYSICAL' | 'CASH';
  notionalAmount: ActiveOrHistoricCurrencyAndAmount;
}

export interface CommodityFuture {
  ticker: string;
  commodityType: 'ENERGY' | 'METALS' | 'AGRICULTURE' | 'ENVIRONMENTAL';
  contractMonth: string; // e.g., "DEC29"
  contractYear: number;
  multiplier: number;
  maintenanceMargin: ActiveOrHistoricCurrencyAndAmount;
  lastTradingDate: string;
}

export interface OptionContract {
  optionId: string;
  underlyingTicker: string;
  strikePrice: number;
  expirationDate: string;
  optionType: 'CALL' | 'PUT';
  premium: number;
  openInterest: number;
  volume: number;
}

export interface OptionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  impliedVolatility: number;
}

export interface HedgingStrategy {
  strategyId: string;
  name: string;
  description: string;
  underlyingAssets: string[];
  derivativeInstruments: string[]; // optionIds or future tickers
  targetHedgeRatio: number; // e.g., 0.85 for 85% hedged
  currentHedgeRatio: number;
  unrealizedPnL: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 24: REAL ESTATE EMPIRE, FRACTIONAL OWNERSHIP & ART COLLECTIBLES
 * ==============================================================================
 * Types for tokenized real estate, fractional shares, rental distribution ledgers,
 * art provenance tracking, appraisal history, and gallery exhibition schedules.
 */

export interface RealEstateFractionalShare {
  shareId: string;
  propertyId: string;
  ownerId: string;
  percentageOwned: number; // 0.0 to 1.0
  purchasePrice: ActiveOrHistoricCurrencyAndAmount;
  purchaseDate: string;
  currentValue: ActiveOrHistoricCurrencyAndAmount;
}

export interface RentalDistributionLedger {
  ledgerId: string;
  propertyId: string;
  periodStartDate: string;
  periodEndDate: string;
  totalGrossRentCollected: ActiveOrHistoricCurrencyAndAmount;
  expensesDeducted: ActiveOrHistoricCurrencyAndAmount;
  netRentDistributed: ActiveOrHistoricCurrencyAndAmount;
  distributions: {
    shareId: string;
    ownerId: string;
    amountDistributed: ActiveOrHistoricCurrencyAndAmount;
    distributedAt: string;
  }[];
}

export interface ArtProvenanceEntry {
  entryId: string;
  ownerName: string;
  acquisitionDate: string;
  acquisitionPrice?: ActiveOrHistoricCurrencyAndAmount;
  provenanceType: 'GALLERY_PURCHASE' | 'AUCTION' | 'PRIVATE_SALE' | 'INHERITANCE' | 'MUSEUM_EXHIBITION';
  location: string;
  verifiedBy: string;
  verificationHash: string;
}

export interface ArtAppraisalHistory {
  appraisalId: string;
  appraiserName: string;
  appraiserCredentials: string[];
  appraisalDate: string;
  appraisedValue: ActiveOrHistoricCurrencyAndAmount;
  appraisalReportUrl?: string;
  conditionRating: 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

export interface GalleryExhibition {
  exhibitionId: string;
  galleryName: string;
  location: string;
  startDate: string;
  endDate: string;
  curatorName: string;
  exhibitedArtPieceIds: string[];
  insuranceCoverageAmount: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 25: TAX OPTIMIZATION, LEGACY ARCHITECT & PHILANTHROPY
 * ==============================================================================
 * Types for tax loss harvesting, capital gains tracking, trust funds, estate planning,
 * charitable foundations, donor-advised funds (DAFs), and impact metrics.
 */

export interface TaxLossHarvestingOpportunity {
  opportunityId: string;
  assetTicker: string;
  currentPrice: number;
  costBasis: number;
  unrealizedLoss: ActiveOrHistoricCurrencyAndAmount;
  potentialTaxSavings: ActiveOrHistoricCurrencyAndAmount;
  recommendedReplacementAssetTicker: string;
  washSaleRiskStatus: 'SAFE' | 'RISK_OF_WASH_SALE' | 'WASH_SALE_TRIGGERED';
}

export interface CapitalGainsRecord {
  recordId: string;
  assetTicker: string;
  quantity: number;
  acquisitionDate: string;
  saleDate: string;
  costBasis: ActiveOrHistoricCurrencyAndAmount;
  saleProceeds: ActiveOrHistoricCurrencyAndAmount;
  gainLossAmount: ActiveOrHistoricCurrencyAndAmount;
  gainType: 'SHORT_TERM' | 'LONG_TERM';
  estimatedTaxLiability: ActiveOrHistoricCurrencyAndAmount;
}

export interface TrustFundBeneficiary {
  beneficiaryId: string;
  name: string;
  relationship: string;
  distributionPercentage: number; // 0.0 to 1.0
  vestingSchedule?: {
    milestoneAge?: number;
    milestoneDate?: string;
    percentageVested: number;
  }[];
}

export interface TrustFund {
  trustId: string;
  trusteeName: string;
  grantorName: string;
  beneficiaries: TrustFundBeneficiary[];
  totalAssetsValue: ActiveOrHistoricCurrencyAndAmount;
  distributionRules: {
    ruleId: string;
    triggerType: 'AGE' | 'DATE' | 'EDUCATION_MILESTONE' | 'DISCRETIONARY';
    triggerValue: string;
    maxDistributionAmount?: ActiveOrHistoricCurrencyAndAmount;
  }[];
  taxStatus: 'REVOCABLE' | 'IRREVOCABLE';
}

export interface DonorAdvisedFund {
  dafId: string;
  fundName: string;
  sponsorOrganization: string;
  currentBalance: ActiveOrHistoricCurrencyAndAmount;
  contributionsHistory: {
    contributionId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    taxDeductionReceiptUrl?: string;
  }[];
  grantsDistributed: {
    grantId: string;
    charityName: string;
    charityTaxId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'DISBURSED';
  }[];
}

export interface PhilanthropicImpactMetrics {
  impactId: string;
  charityName: string;
  unSustainableDevelopmentGoals: number[]; // SDG numbers 1-17
  livesImpactedCount: number;
  carbonOffsetTons?: number;
  educationHoursProvided?: number;
  cleanWaterLitersProvided?: number;
  impactScore: number; // Scale of 1-100
}/**
 * ==============================================================================
 * SECTION 26: VENTURE CAPITAL, PRIVATE EQUITY & STARTUP INCUBATION
 * ==============================================================================
 * Advanced structures for venture capital fund management, startup incubation,
 * cap table modeling, SAFE agreements, term sheets, and due diligence workflows.
 */

export interface VentureCapitalFund {
  fundId: string;
  fundName: string;
  vintageYear: number;
  targetAum: ActiveOrHistoricCurrencyAndAmount;
  currentAum: ActiveOrHistoricCurrencyAndAmount;
  generalPartners: string[];
  limitedPartners: {
    lpId: string;
    name: string;
    committedCapital: ActiveOrHistoricCurrencyAndAmount;
    calledCapital: ActiveOrHistoricCurrencyAndAmount;
    distributionCapital: ActiveOrHistoricCurrencyAndAmount;
  }[];
  investmentThesis: LocalizedString;
  portfolioCompanies: VentureStartup[];
  irr: number; // Internal Rate of Return (e.g., 0.24 for 24%)
  tvpi: number; // Total Value to Paid-In Capital
  dpi: number; // Distributed to Paid-In Capital
  status: 'RAISING' | 'ACTIVE' | 'FULLY_INVESTED' | 'LIQUIDATED';
}

export interface StartupIncubationCohort {
  cohortId: string;
  programName: string;
  startDate: string;
  endDate: string;
  mentors: {
    mentorId: string;
    name: string;
    expertise: string[];
    companyAffiliation?: string;
  }[];
  acceptedStartups: VentureStartup[];
  curriculumModules: {
    moduleId: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
  demoDayParameters: {
    scheduledDate: string;
    investorRsvpCount: number;
    pitchDurationSeconds: number;
    prizePoolAmount?: ActiveOrHistoricCurrencyAndAmount;
  };
}

export interface CapTableShareholder {
  shareholderId: string;
  name: string;
  shareClass: 'FOUNDER_COMMON' | 'COMMON' | 'PREFERRED_SEED' | 'PREFERRED_SERIES_A' | 'PREFERRED_SERIES_B' | 'OPTION_POOL';
  shareCount: number;
  ownershipPercentage: number; // 0.0 to 1.0
  fullyDilutedPercentage: number; // 0.0 to 1.0
  optionsGranted?: number;
  optionsVested?: number;
  vestingSchedule?: {
    cliffDate: string;
    vestingDurationMonths: number;
    vestingIntervalMonths: number;
  };
}

export interface CapTable {
  capTableId: string;
  startupId: string;
  preMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  postMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  totalSharesOutstanding: number;
  shareholders: CapTableShareholder[];
  optionPoolSize: number;
  optionPoolRemaining: number;
  convertibleNotes: {
    noteId: string;
    investorName: string;
    principalAmount: ActiveOrHistoricCurrencyAndAmount;
    interestRate: number;
    capAmount?: ActiveOrHistoricCurrencyAndAmount;
    discountRate?: number;
  }[];
  safeAgreements: SafeAgreement[];
}

export interface SafeAgreement {
  safeId: string;
  investorName: string;
  principalAmount: ActiveOrHistoricCurrencyAndAmount;
  capAmount?: ActiveOrHistoricCurrencyAndAmount;
  discountRate?: number; // e.g., 0.80 for 20% discount
  conversionTrigger: 'NEXT_EQUITY_ROUND' | 'LIQUIDITY_EVENT' | 'DISSOLUTION';
  status: 'ACTIVE' | 'CONVERTED' | 'TERMINATED';
}

export interface TermSheet {
  termSheetId: string;
  startupId: string;
  leadInvestorId: string;
  preMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  investmentAmount: ActiveOrHistoricCurrencyAndAmount;
  liquidationPreference: {
    multiplier: number; // e.g., 1.0x
    participating: boolean;
  };
  boardSeats: {
    totalSeats: number;
    investorSeats: number;
    founderSeats: number;
    independentSeats: number;
  };
  protectiveProvisions: string[];
  dragAlongRights: boolean;
  tagAlongRights: boolean;
  exclusivityDays: number;
  status: 'DRAFT' | 'SENT' | 'NEGOTIATING' | 'SIGNED' | 'EXPIRED' | 'REJECTED';
}

export interface DueDiligenceChecklist {
  checklistId: string;
  startupId: string;
  categories: {
    name: 'FINANCIAL' | 'LEGAL' | 'TECHNICAL' | 'TEAM' | 'MARKET' | 'IP';
    items: {
      itemId: string;
      description: string;
      status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'NOT_APPLICABLE';
      assignedTo: string;
      verifiedBy?: string;
      documentUrls: string[];
      comments: {
        author: string;
        text: string;
        timestamp: string;
      }[];
    }[];
  }[];
}

/**
 * ==============================================================================
 * SECTION 27: SOVEREIGN WEALTH SIMULATION, MACROECONOMIC MODELING & GAME THEORY
 * ==============================================================================
 * Types for sovereign wealth fund simulations, macroeconomic indicators,
 * geopolitical risk modeling, and game-theoretic scenario analysis.
 */

export interface SovereignWealthFund {
  fundId: string;
  nationState: string;
  totalAssets: ActiveOrHistoricCurrencyAndAmount;
  liquidReserves: ActiveOrHistoricCurrencyAndAmount;
  strategicAssetAllocation: {
    assetClass: 'EQUITIES' | 'FIXED_INCOME' | 'REAL_ESTATE' | 'INFRASTRUCTURE' | 'PRIVATE_EQUITY' | 'GOLD_RESERVES' | 'DIGITAL_ASSETS';
    targetPercentage: number; // 0.0 to 1.0
    currentPercentage: number;
  }[];
  geopoliticalRiskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'SOVEREIGN_HEGEMON';
  fiscalRules: {
    maxAnnualWithdrawalPercentage: number;
    emergencyFundThreshold: ActiveOrHistoricCurrencyAndAmount;
    commodityRevenueReinvestmentPercentage?: number;
  };
}

export interface MacroeconomicIndicators {
  gdpGrowthRate: number; // Annualized percentage change
  inflationRate: number;
  unemploymentRate: number;
  centralBankInterestRate: number;
  debtToGdpRatio: number;
  tradeBalance: ActiveOrHistoricCurrencyAndAmount;
  currencyStrengthIndex: number; // Relative to basket of global currencies
  lastUpdated: string;
}

export interface GeopoliticalEvent {
  eventId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXISTENTIAL';
  affectedRegions: string[]; // ISO country codes
  economicImpactFactors: {
    commodityPriceShock: { commodity: string; percentageChange: number }[];
    supplyChainDisruptionIndex: number; // 0.0 to 1.0
    capitalFlightRisk: boolean;
  };
  probabilityOfOccurrence: number; // 0.0 to 1.0
  status: 'POTENTIAL' | 'ACTIVE' | 'RESOLVED' | 'MITIGATED';
}

export interface PayoffMatrixEntry {
  player1Strategy: string;
  player2Strategy: string;
  player1Payoff: number;
  player2Payoff: number;
}

export interface GameTheoryScenario {
  scenarioId: string;
  title: string;
  description: string;
  players: {
    playerId: string;
    name: string;
    resources: Record<string, any>;
  }[];
  strategies: {
    playerId: string;
    options: string[];
  }[];
  payoffMatrix: PayoffMatrixEntry[];
  nashEquilibrium?: {
    player1Strategy: string;
    player2Strategy: string;
  }[];
  cooperativeOutcome?: {
    player1Strategy: string;
    player2Strategy: string;
    jointPayoff: number;
  };
  simulationSteps: {
    stepIndex: number;
    actionsTaken: Record<string, string>;
    payoffsRealized: Record<string, number>;
    narrative: string;
  }[];
}

export interface SimulationRun {
  runId: string;
  scenarioId: string;
  initialConditions: Record<string, any>;
  steps: {
    timestamp: string;
    stateVariables: Record<string, number>;
    eventsTriggered: string[];
  }[];
  finalOutcome: string;
  confidenceInterval: {
    lowerBound: number;
    upperBound: number;
  };
  executionTimeMs: number;
}

/**
 * ==============================================================================
 * SECTION 28: ADVANCED CRYPTOGRAPHIC KEY MANAGEMENT, MULTI-SIG & HSM
 * ==============================================================================
 * Types for Hardware Security Modules (HSM), cryptographic key lifecycles,
 * multi-signature transaction coordination, and zero-knowledge proof parameters.
 */

export interface HsmConfig {
  hsmId: string;
  vendor: 'THALES' | 'GEMALTO' | 'YUBICO' | 'AWS_KMS' | 'AZURE_KEY_VAULT' | 'CUSTOM_FPGA';
  model: string;
  firmwareVersion: string;
  slotId: number;
  label: string;
  supportedAlgorithms: ('AES256' | 'RSA4096' | 'ECDSA_SECP256K1' | 'ED25519' | 'DILITHIUM5' | 'FALCON1024')[];
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'DEGRADED' | 'ERROR';
}

export interface CryptographicKey {
  keyId: string;
  keyType: 'SYMMETRIC' | 'ASYMMETRIC_PUBLIC' | 'ASYMMETRIC_PRIVATE' | 'MASTER_SEED';
  keySize: number; // in bits
  algorithm: string;
  purpose: 'ENCRYPTION' | 'SIGNING' | 'KEY_DERIVATION' | 'ZERO_KNOWLEDGE';
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED' | 'ARCHIVED';
  createdAt: string;
  expiresAt?: string;
  hsmReferenceId?: string;
  keyFingerprint: string; // SHA3-256 hash of public key or key metadata
}

export interface SignatureShare {
  signerId: string;
  signatureBytes: string; // Base64 encoded signature
  timestamp: number;
  publicKeyFingerprint: string;
}

export interface MultiSigTransaction {
  txId: string;
  destinationAddress: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  assetSymbol: string;
  requiredSignatures: number; // 't' in t-of-n
  currentSignatures: SignatureShare[];
  signers: {
    signerId: string;
    name: string;
    publicKey: QuantumPublicKey;
    hasSigned: boolean;
  }[];
  status: 'PENDING_SIGNATURES' | 'FULLY_SIGNED' | 'EXECUTED' | 'FAILED' | 'EXPIRED';
  rawPayload: string; // Base64 or Hex encoded transaction payload
}

export interface ZeroKnowledgeProof {
  proofId: string;
  provingKeyId: string;
  verificationKeyId: string;
  publicInputs: string[];
  proofData: string; // Base64 encoded proof
  verified: boolean;
}

export interface ThresholdDecryptionConfig {
  t: number; // Threshold
  n: number; // Total shares
  keyShares: {
    shareId: number;
    encryptedShare: string;
    holderId: string;
  }[];
  reconstructionThreshold: number;
}

/**
 * ==============================================================================
 * SECTION 29: REAL-TIME TELEMETRY, NEURAL LACE SYNC & COGNITIVE PROFILE ANALYTICS
 * ==============================================================================
 * Types for neural interface telemetry, cognitive load tracking, emotional valence
 * analysis, and biometric feedback loops for high-frequency trading environments.
 */

export interface NeuralLaceTelemetry {
  syncId: string;
  userId: string;
  connectionStrength: number; // 0.0 to 1.0
  bandwidthBps: number;
  latencyMs: number;
  activeBrainwavePattern: 'ALPHA' | 'BETA' | 'GAMMA' | 'DELTA' | 'THETA';
  cognitiveLoadIndex: number; // 0.0 to 1.0
  emotionalState: {
    valence: number; // -1.0 (negative) to 1.0 (positive)
    arousal: number; // 0.0 (calm) to 1.0 (excited)
    dominantEmotion: 'CALM' | 'FOCUS' | 'ANXIETY' | 'EUPHORIA' | 'FATIGUE' | 'FRUSTRATION';
  };
  lastSyncTime: string;
}

export interface CognitiveProfile {
  profileId: string;
  userId: string;
  analyticalThinkingScore: number; // 0.0 to 100.0
  riskAversionIndex: number; // 0.0 to 1.0
  decisionSpeedMs: number;
  patternRecognitionScore: number; // 0.0 to 100.0
  focusDurationSeconds: number;
  stressToleranceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'ELITE';
}

export interface ThoughtNode {
  nodeId: string;
  textPayload: string;
  confidenceScore: number; // 0.0 to 1.0
  parentNodeId: string | null;
  emotionalValence: number; // -1.0 to 1.0
}

export interface ThoughtStreamLog {
  streamId: string;
  userId: string;
  timestamp: number;
  thoughtNodes: ThoughtNode[];
  primaryIntent: string;
  cognitiveCoherenceScore: number; // 0.0 to 1.0
}

export interface BiometricTelemetry {
  heartRateBpm: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  galvSkinResponse: number; // Microsiemens
  bodyTemperatureCelsius: number;
  respirationRate: number; // Breaths per minute
}

/**
 * ==============================================================================
 * SECTION 30: TEMPORAL ANCHORS, HISTORICAL PATTERN MATCHING & PREDICTIVE CHRONOLOGY
 * ==============================================================================
 * Types for cyclical historical analysis, temporal anchors, predictive chronology,
 * and pattern matching across multi-decade financial and geopolitical cycles.
 */

export interface TemporalAnchor {
  anchorId: string;
  targetTimestamp: number;
  description: string;
  historicalContext: LocalizedString;
  alignmentScore: number; // 0.0 to 1.0
  cyclicalPeriodYears: number; // e.g., 8.6 years (Martin Armstrong cycle), 50 years (Kondratiev wave)
}

export interface HistoricalPrecedent {
  precedentId: string;
  eventName: string;
  dateOccurred: string;
  economicConditions: {
    inflationLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'HYPER';
    interestRateEnvironment: 'RISING' | 'FALLING' | 'STABLE';
    geopoliticalTensionIndex: number; // 1 to 10
  };
  outcomeNarrative: LocalizedString;
  similarityIndex: number; // 0.0 to 1.0
}

export interface HistoricalPattern {
  patternId: string;
  name: string;
  description: string;
  historicalPrecedents: HistoricalPrecedent[];
  mathematicalModel: 'FIBONACCI_RETRACEMENT' | 'ELLIOTT_WAVE' | 'FOURIER_TRANSFORM' | 'MARKOV_CHAIN' | 'NEURAL_LSTM';
  correlationCoefficient: number; // -1.0 to 1.0
  predictiveAccuracy: number; // 0.0 to 1.0
}

export interface TimelineEvent {
  predictedTimestamp: number;
  eventDescription: string;
  probability: number; // 0.0 to 1.0
  potentialImpactScore: number; // 1 to 10
  triggerConditions: string[];
}

export interface PredictiveChronology {
  chronologyId: string;
  targetAsset: string;
  forecastHorizonDays: number;
  timelineEvents: TimelineEvent[];
  confidenceIntervals: {
    timestamp: number;
    p10: number; // 10th percentile price/value
    p50: number; // Median
    p90: number; // 90th percentile
  }[];
}import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}
/**
 * ==============================================================================
 * SECTION 3: EXECUTIVE MAGAZINE & MULTIMEDIA CREATION TYPES
 * ==============================================================================
 * Types governing the generation, layout, rendering, and narration of high-end
 * digital publications, executive lookbooks, and AI-driven multimedia assets.
 */

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
  'Wall Street Boardroom',
  'Silicon Valley Tech Campus',
  'Dubai Skyscraper Penthouse',
  'Paris Fashion Week Front Row',
  'Private Island Villa',
  'Luxury Private Jet',
  'Monaco Yacht Deck',
  'Swiss Alps Davos Summit'
];

export const STYLES = [
  'Power Suit (Classic Bespoke)',
  'Tech Mogul (Minimalist Luxury)',
  'Black Tie Gala (Formal)',
  'Avant-Garde Executive (Bold)',
  'Old Money (Quiet Luxury)',
  'Streetwear CEO (High-End Casual)'
];

export type RenderingEngine = 'stable-diffusion' | 'midjourney' | 'dall-e-3' | 'flux' | 'imagen' | 'custom-gan';

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
  lighting?: string;
  cameraAngle?: string;
  colorPalette?: string[];
  historicalReference?: string;
  brandTags?: string[];
}

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  videoUrl?: string;
  isAnimating?: boolean;
  audioUrl?: string;
  narrationText?: string;
  renderingEngine?: RenderingEngine;
  promptUsed?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  seed?: number;
  cfgScale?: number;
  steps?: number;
  generationTimeMs?: number;
  error?: string;
}

export interface Asset {
  id: string;
  base64: string;
  desc: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  body: string;
  elements: VisualElement[];
}

export interface VisualElement {
  id: string;
  type: 'image' | 'seal' | 'divider' | 'illustration' | 'scenery';
  src: string;
  position: { x: number; y: number };
  alt: string;
  isAnimated?: boolean;
  scale?: number;
  rotation?: number;
}

export enum AIServiceAction {
  REWRITE = 'REWRITE',
  ILLUMINATE = 'ILLUMINATE',
  PROPHESY = 'PROPHESY',
  SEAL = 'SEAL',
  CIPHER = 'CIPHER',
  SCENERY = 'SCENERY',
  ENCHANT = 'ENCHANT'
}

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Ariel' | 'Oberon' | 'Titania';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  sampleRateHz?: number;
  languageCode?: string;
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
  audioUrl?: string;
  durationMs?: number;
  characterCount: number;
}

/**
 * ==============================================================================
 * SECTION 4: NEWS, FEEDS & SENTIMENT ANALYSIS TYPES
 * ==============================================================================
 * Structures governing real-time financial news aggregation, sentiment analysis,
 * urgency scoring, and AI-driven market insights.
 */

export enum StaticCategory {
  TOP_STORIES = 'Global Pulse',
  POLITICS = 'Governance',
  TECH = 'Infrastructure',
  FINANCE = 'Markets',
  CRYPTO = 'Decentralized Ledger',
  ENERGY = 'Thermodynamics',
  BIOTECH = 'Genomics',
  SPACE = 'Orbital Mechanics'
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: number; // Scale of 1-10
  tags: string[];
  author?: string;
  content?: string;
  imageUrl?: string;
  sentimentScore?: number; // Continuous value from -1.0 to 1.0
  relevanceScore?: number; // Continuous value from 0.0 to 1.0
  language?: string;
  isFactChecked?: boolean;
  factCheckDetails?: string;
  biasRating?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  relatedTickers?: string[];
}

export interface FeedPage {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  lastUpdated: string;
  aiInsights: string;
  curatorId?: string;
  isPublic: boolean;
  subscriberCount?: number;
  customFilterCriteria?: FilterCriterion[];
}

/**
 * ==============================================================================
 * SECTION 5: FILE SYSTEM, STORAGE & CLOUD MANAGEMENT TYPES
 * ==============================================================================
 * Types governing local and cloud file systems, indexing, AI-assisted summaries,
 * and multi-source repository exploration.
 */

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  GENERIC = 'generic',
  CODE = 'code',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  DATABASE = 'database',
  MODEL_3D = 'model_3d'
}

export type FileSource = 'local' | 'github' | 'ai' | 'google-drive' | 'aws-s3' | 'ipfs' | 'dropbox';

export interface FileVersion {
  versionId: string;
  modifiedBy: string;
  modifiedAt: string;
  size: number;
  changeLog?: string;
  downloadUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string | null;
  source: FileSource;
  extension?: string;
  mimeType?: string;
  content?: string; // Text, DataURL, or Download URL
  aiSummary?: string;
  aiKeywords?: string[];
  isIndexing?: boolean;
  githubRepo?: string;
  githubOwner?: string;
  githubUrl?: string;
  driveFileId?: string;
  isCloudFolder?: boolean;
  ownerId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  versionHistory?: FileVersion[];
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  hash?: string;
  tags?: string[];
}

export interface NavigationState {
  currentPath: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid' | 'gallery' | 'tree' | 'kanban';
  sortBy: 'name' | 'size' | 'lastModified' | 'type';
  sortDirection: 'asc' | 'desc';
  searchQuery?: string;
  filterType?: FileType | 'all';
}

/**
 * ==============================================================================
 * SECTION 6: CORE BANKING, TRANSACTIONS & CAPITAL ALLOCATION TYPES
 * ==============================================================================
 * Foundational types for personal and corporate banking, ledger accounts,
 * transaction processing, and AI-driven financial planning.
 */

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'fedwire' | 'rtp';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'credit' | 'debit';

export type TransactionStatus =
  | 'POSTED'
  | 'PENDING'
  | 'Initiated'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'needs_approval'
  | 'approved'
  | 'denied'
  | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string | string[];
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: KeyValuePairs;
  pending?: boolean;
  reconciled?: boolean;
  reconciliation_id?: string;
  nexus_link_id?: string;
  institution_origin?: string;
  cardId?: string;
  holderName?: string;
  merchant?: string;
  status?: TransactionStatus;
  timestamp?: string;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string;
  assetClass?: string;
  riskLevel?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining?: number;
  category?: string;
  alerts?: Alert[];
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
  credits: number;
}

export interface AIPlanStep {
  title: string;
  description: string;
  timeline: string;
  category?: string;
}

export interface AIPlan {
  title: string;
  summary: string;
  steps: AIPlanStep[];
}

export type IllusionType = 'none' | 'aurora' | 'blue' | 'dark';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  institutionId?: string;
  type?: string;
  balance?: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: string;
}

export enum WeaverStage {
  Pitch = 'pitch',
  Analysis = 'analysis',
  Test = 'test',
  FinalReview = 'final_review',
  Approved = 'approved',
  Results = 'results',
  Error = 'error'
}

export interface QuantumWeaverState {
  stage: WeaverStage;
  businessPlan: string;
  feedback: string;
  questions: AIQuestion[];
  loanAmount: number;
  coachingPlan: AIPlan | null;
  error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  aiJustification?: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress?: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCardControls {
  atm: boolean;
  contactless: boolean;
  online: boolean;
  monthlyLimit: number;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: CorporateCardControls;
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description?: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Counterparty {
  id: string;
  name: string;
  email?: string | null;
  send_remittance_advice?: boolean;
  type?: 'business' | 'individual';
  riskLevel?: 'Low' | 'Medium' | 'High';
  createdDate?: string;
  accounts: ExternalAccount[];
  virtualAccounts: VirtualAccount[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name?: string;
  verification_status?: string;
  account_details?: any[];
  routing_details?: any[];
}

export interface VirtualAccount {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  balance?: number;
  currency?: string;
  status?: string;
  subAccounts?: VirtualAccount[];
  description?: string;
  counterparty_id?: string;
  internal_account_id?: string;
  debit_ledger_account_id?: string;
  credit_ledger_account_id?: string;
  metadata?: any;
  account_details?: any[];
  routing_details?: any[];
}

export interface AIGoalPlanStep {
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Investing' | 'Income' | string;
}

export interface AIGoalPlan {
  feasibilitySummary: string;
  monthlyContribution: number;
  steps: AIGoalPlanStep[];
  actionableSteps?: string[];
  summary?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'recurring';
}

export interface RecurringContribution {
  id: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface LinkedGoal {
  id: string;
  relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
  triggerAmount?: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  iconName: string;
  plan: AIGoalPlan | null;
  startDate: string;
  riskProfile?: RiskProfile;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  linkedGoals: LinkedGoal[];
  recurringContributions: RecurringContribution[];
  contributions: Contribution[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number; // in reward points
  type: 'cashback' | 'giftcard' | 'impact' | string;
  description: string;
  iconName: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini' | string;

export interface APIStatus {
  provider: APIProvider;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number; // in ms
}

export interface CreditFactor {
  name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix' | string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}
/**
 * ==============================================================================
 * SECTION 7: PLAID, MARQETA, MODERN TREASURY & OPEN BANKING INTEGRATION TYPES
 * ==============================================================================
 * Enterprise-grade types governing secure connections, credential management,
 * card issuance, ledgering, and multi-node financial mesh protocols.
 */

export interface PlaidCredentials {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

export interface MarqetaCredentials {
  app_token?: string;
  admin_token?: string;
  applicationToken?: string;
  adminAccessToken?: string;
  base_url?: string;
}

export interface ModernTreasuryCredentials {
  apiKey: string;
  orgId?: string;
  organizationId?: string;
}

export interface PlaidTokenState {
  linkToken: string | null;
  publicToken: string | null;
  accessToken: string | null;
}

export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: AccountBalance;
  institution?: string;
}

export interface ConnectedItem {
  institutionId: string;
  institutionName: string;
  accessToken: string;
  itemId: string;
  accounts: Account[];
  transactions: Transaction[];
  metadata: {
    linked_at: string;
    node_priority: number;
    mesh_protocol: 'NEXUS-V3' | string;
    routing_hops: string[];
  };
}

export interface UCCFiling {
  id: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Filed' | 'Rejected';
  receiptId?: string;
  fileNumber?: string;
  packetNum: string;
  transType: 'Initial' | 'Amendment';
  amount: number;
  dateCreated: string;
  xmlPayload: string;
  errors?: string[];
}

export interface UnifiedPayload {
  timestamp: string;
  nexus_version: string;
  nexus_id: string;
  global_metadata: {
    client_context: string;
    reconciliation_depth: number;
    combined_hash: string;
  };
  mesh_stats: {
    total_liquidity: number;
    total_liabilities: number;
    net_position: number;
    active_institutions: number;
  };
  cross_institutional_ledger: {
    items: ConnectedItem[];
    reconciled_pairs: any[];
  };
  compliance: {
    active_ucc_filings: UCCFiling[];
  };
}

export enum FlowStep {
  CREDENTIALS = 'CREDENTIALS',
  LINK_TOKEN = 'LINK_TOKEN',
  LINK_UI = 'LINK_UI',
  EXCHANGE = 'EXCHANGE',
  DASHBOARD = 'DASHBOARD',
  UCC_CENTER = 'UCC_CENTER',
  MARQETA_NODE = 'MARQETA_NODE',
  MODERN_TREASURY_NODE = 'MODERN_TREASURY_NODE',
  TAXONOMY_REGISTRY = 'TAXONOMY_REGISTRY'
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  created_time?: string;
  start_date?: string;
  config: any;
}

export interface MarqetaCard {
  token: string;
  user_token: string;
  card_product_token: string;
  last_four: string;
  pan: string;
  expiration: string;
  cvv: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | string;
}

export interface MTLedger {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, string>;
}

export interface MTInternalAccount {
  id: string;
  name: string;
  currency: string;
  connection: { vendor_name: string };
  status: string;
}

export interface PlaidLinkSuccessMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id?: string;
}

export type PlaidProduct =
  | 'assets'
  | 'auth'
  | 'balance'
  | 'identity'
  | 'investments'
  | 'liabilities'
  | 'payment_initiation'
  | 'transactions';

export interface MarqetaUser {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  last_modified_time: string;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns?: string;
  };
  provider?: any;
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface LedgerAccount {
  id: string;
  name: string;
  balances: {
    available_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
    posted_balance: { amount: number; currency: string };
  };
}

export interface SettlementInstruction {
  messageId: string;
  creationDateTime: string;
  numberOfTransactions: number;
  settlementDate: string;
  totalAmount: number;
  currency: string;
  purpose?: string;
}

/**
 * ==============================================================================
 * SECTION 8: ENTERPRISE OPERATIONS, CORPORATE COMMAND, COMPLIANCE & ISO 20022
 * ==============================================================================
 * Types governing corporate command centers, compliance audits, anomaly detection,
 * cash flow forecasting, and ISO 20022 financial messaging standards.
 */

export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore?: number;
  recommendedAction?: string;
}

export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

export interface FraudRule {
  id: string;
  name: string;
  description?: string;
  severity: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
}

export interface ComplianceCase {
  id: string;
  reason: string;
  entityType: string;
  entityId: string;
  status: 'open' | 'closed' | 'investigating' | string;
  openedDate: string;
  type?: string;
  description?: string;
}

export interface FinancialAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: AnomalyStatus;
  entityType: string;
  entityId: string;
  entityDescription: string;
  timestamp: string;
  riskScore: number;
}

export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'False Positive';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  action: 'flag_for_review' | 'block' | 'notify_admin' | string;
  active: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  revenue: number;
  growth: number;
  riskScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetResource: string;
  success: boolean;
  details?: string;
  metadata?: any;
  ipAddress?: string;
}

export interface ThreatAlert {
  alertId: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataSharingPolicy {
  policyId: string;
  policyName: string;
  scope: string;
  isActive: boolean;
  lastReviewed: string;
}

export interface APIKey {
  id: string;
  keyName: string;
  creationDate: string;
  scopes: string[];
  lastUsed?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  verified: boolean;
}

export interface SecurityAwarenessModule {
  moduleId: string;
  title: string;
  completionRate: number;
}

export interface TransactionRule {
  ruleId: string;
  name: string;
  triggerCondition: string;
  action: string;
  isEnabled: boolean;
}

export interface SecurityScoreMetric {
  metricName: string;
  currentValue: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  lastActivity: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  permissions: string[];
  status: string;
  firstSeen: string;
  userAgent: string;
  pushNotificationsEnabled: boolean;
  biometricAuthEnabled: boolean;
  encryptionStatus: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  timestamp: string;
  isCurrent: boolean;
  userAgent: string;
}

export interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password?: string;
  databaseName: string;
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full';
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface WebDriverStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  activeTask: string | null;
  logs: string[];
}

export interface ExternalCorporateActionEventType1Code {}
export interface ExternalAcceptedReason1Code {}
export interface ExternalAccountIdentification1Code {}
export interface ExternalAgentInstruction1Code {}
export interface ExternalAgreementType1Code {}
export interface ExternalAuthenticationChannel1Code {}
export interface ExternalAuthenticationMethod1Code {}
export interface ExternalAuthorityExchangeReason1Code {}
export interface ExternalAuthorityIdentification1Code {}
export interface ExternalBalanceSubType1Code {}
export interface ExternalBalanceType1Code {}
export interface ExternalBankTransactionDomain1Code {}
export interface ExternalBankTransactionFamily1Code {}
export interface ExternalBankTransactionSubFamily1Code {}
export interface ExternalBenchmarkCurveName1Code {}
export interface ExternalBillingBalanceType1Code {}
export interface ExternalBillingCompensationType1Code {}
export interface ExternalBillingRateIdentification1Code {}
export interface ExternalCalculationAgent1Code {}
export interface ExternalCancellationReason1Code {}
export interface ExternalCardTransactionCategory1Code {}
export interface ExternalCashAccountType1Code {}
export interface ExternalCashClearingSystem1Code {}
export interface ExternalCategoryPurpose1Code {}
export interface ExternalChannel1Code {}
export interface ExternalChargeType1Code {}
export interface ExternalChequeAgentInstruction1Code {}
export interface ExternalChequeCancellationReason1Code {}
export interface ExternalChequeCancellationStatus1Code {}
export interface ExternalClaimNonReceiptRejection1Code {}
export interface ExternalClearingSystemIdentification1Code {}
export interface ExternalCollateralReferenceDataStatusReason1Code {}
export interface ExternalCommunicationFormat1Code {}
export interface ExternalContractBalanceType1Code {}
export interface ExternalContractClosureReason1Code {}
export interface ExternalCreditLineType1Code {}
export interface ExternalCreditorAgentInstruction1Code {}
export interface ExternalCreditorEnrolmentAmendmentReason1Code {}
export interface ExternalCreditorEnrolmentCancellationReason1Code {}
export interface ExternalCreditorEnrolmentStatusReason1Code {}
export interface ExternalCreditorReferenceType1Code {}
export interface ExternalDateFrequency1Code {}
export interface ExternalDateType1Code {}
export interface ExternalDebtorActivationAmendmentReason1Code {}
export interface ExternalDebtorActivationCancellationReason1Code {}
export interface ExternalDebtorActivationStatusReason1Code {}
export interface ExternalDebtorAgentInstruction1Code {}
export interface ExternalDeviceOperatingSystemType1Code {}
export interface ExternalDiscountAmountType1Code {}
export interface ExternalDocumentAmountType1Code {}
export interface ExternalDocumentFormat1Code {}
export interface ExternalDocumentLineType1Code {}
export interface ExternalDocumentPurpose1Code {}
export interface ExternalDocumentType1Code {}
export interface ExternalEffectiveDateParameter1Code {}
export interface ExternalEmissionAllowanceSubProductType1Code {}
export interface ExternalEncryptedElementIdentification1Code {}
export interface ExternalEnquiryRequestType1Code {}
export interface ExternalEntitySize1Code {}
export interface ExternalEntityType1Code {}
export interface ExternalEntryStatus1Code {}
export interface ExternalFinancialInstitutionIdentification1Code {}
export interface ExternalFinancialInstrumentIdentificationType1Code {}
export interface ExternalFinancialInstrumentProductType1Code {}
export interface ExternalGarnishmentType1Code {}
export interface ExternalIncoterms1Code {}
export interface ExternalIndustrySectorClassification1Code {}
export interface ExternalInformationType1Code {}
export interface ExternalInstructedAgentInstruction1Code {}
export interface ExternalInvestigationAction1Code {}
export interface ExternalInvestigationActionReason1Code {}
export interface ExternalInvestigationExecutionConfirmation1Code {}
export interface ExternalInvestigationInstrument1Code {}
export interface ExternalInvestigationReason1Code {}
export interface ExternalInvestigationReasonSubType1Code {}
export interface ExternalInvestigationServiceLevel1Code {}
export interface ExternalInvestigationStatus1Code {}
export interface ExternalInvestigationStatusReason1Code {}
export interface ExternalInvestigationSubType1Code {}
export interface ExternalInvestigationType1Code {}
export interface ExternalLegalFramework1Code {}
export interface ExternalLetterType1Code {}
export interface ExternalLocalInstrument1Code {}
export interface ExternalMandateReason1Code {}
export interface ExternalMandateSetupReason1Code {}
export interface ExternalMandateStatus1Code {}
export interface ExternalMandateSuspensionReason1Code {}
export interface ExternalMarketArea1Code {}
export interface ExternalMarketInfrastructure1Code {}
export interface ExternalMessageFunction1Code {}
export interface ExternalModelFormIdentification1Code {}
export interface ExternalNarrativeType1Code {}
export interface ExternalNotificationCancellationReason1Code {}
export interface ExternalNotificationSubType1Code {}
export interface ExternalNotificationType1Code {}
export interface ExternalOrganisationIdentification1Code {}
export interface ExternalPackagingType1Code {}
export interface ExternalPartyRelationshipType1Code {}
export interface ExternalPaymentCancellationRejection1Code {}
export interface ExternalPaymentCompensationReason1Code {}
export interface ExternalPaymentControlRequestType1Code {}
export interface ExternalPaymentGroupStatus1Code {}
export interface ExternalPaymentModificationRejection1Code {}
export interface ExternalPaymentRole1Code {}
export interface ExternalPaymentScenario1Code {}
export interface ExternalPaymentTransactionStatus1Code {}
export interface ExternalPendingProcessingReason1Code {}
export interface ExternalPersonIdentification1Code {}
export interface ExternalPostTradeEventType1Code {}
export interface ExternalProductType1Code {}
export interface ExternalProxyAccountType1Code {}
export interface ExternalPurpose1Code {}
export interface ExternalRatesAndTenors1Code {}
export interface ExternalReRepresentmentReason1Code {}
export interface ExternalReceivedReason1Code {}
export interface ExternalRegulatoryInformationType1Code {}
export interface ExternalRejectedReason1Code {}
export interface ExternalRelativeTo1Code {}
export interface ExternalReportingSource1Code {}
export interface ExternalRequestStatus1Code {}
export interface ExternalReservationType1Code {}
export interface ExternalReturnReason1Code {}
export interface ExternalReversalReason1Code {}
export interface ExternalSecuritiesLendingType1Code {}
export interface ExternalSecuritiesPurpose1Code {}
export interface ExternalSecuritiesUpdateReason1Code {}
export interface ExternalServiceLevel1Code {}
export interface ExternalShipmentCondition1Code {}
export interface ExternalStatusReason1Code {}
export interface ExternalSystemBalanceType1Code {}
export interface ExternalSystemErrorHandling1Code {}
export interface ExternalSystemEventType1Code {}
export interface ExternalSystemMemberType1Code {}
export interface ExternalSystemPartyType1Code {}
export interface ExternalTaxAmountType1Code {}
export interface ExternalTechnicalInputChannel1Code {}
export interface ExternalTradeMarket1Code {}
export interface ExternalTradeTransactionCondition1Code {}
export interface ExternalTypeOfParty1Code {}
export interface ExternalUnableToApplyIncorrectData1Code {}
export interface ExternalUnableToApplyMissingData1Code {}
export interface ExternalUnderlyingTradeTransactionType1Code {}
export interface ExternalUndertakingAmountType1Code {}
export interface ExternalUndertakingDocumentType1Code {}
export interface ExternalUndertakingDocumentType2Code {}
export interface ExternalUndertakingStatusCategory1Code {}
export interface ExternalUndertakingType1Code {}
export interface ExternalUnitOfMeasure1Code {}
export interface ExternalValidationRuleIdentification1Code {}
export interface ExternalVerificationReason1Code {}
export interface Biso20022 {}
/**
 * ==============================================================================
 * SECTION 9: SOVEREIGN IDENTITY, USER PROFILES & SOCIAL GRAPH TYPES
 * ==============================================================================
 * Enterprise-grade identity structures, multi-role authorization matrices,
 * neural-lace telemetry, genomic anchors, and decentralized social graph nodes.
 */

export enum View {
  // --- Core ---
  Dashboard = 'dashboard',
  
  // --- Personal Command ---
  Transactions = 'transactions',
  SendMoney = 'send-money',
  Budgets = 'capital-allocation', // Renamed for spec
  FinancialGoals = 'strategic-goals',
  CreditHealth = 'credit-resonance',
  Personalization = 'interface-will',
  Accounts = 'accounts-overview',
  
  // --- Sovereign Wealth ---
  Investments = 'portfolio-overview',
  Crypto = 'web3-crypto',
  CryptoWeb3 = 'web3-crypto', // Added alias
  AlgoTradingLab = 'algo-trading-lab',
  ForexArena = 'forex-arena',
  CommoditiesExchange = 'commodities',
  RealEstateEmpire = 'real-estate',
  ArtCollectibles = 'art-collectibles',
  DerivativesDesk = 'derivatives',
  VentureCapital = 'venture-capital',
  PrivateEquity = 'private-equity',
  TaxOptimization = 'tax-optimization',
  LegacyBuilder = 'legacy-architect',
  SovereignWealth = 'sovereign-wealth-sim',
  QuantumAssets = 'quantum-assets',
  
  // --- Citi Connect Core ---
  CitibankAccounts = 'citi-accounts',
  CitibankAccountProxy = 'citi-account-proxy',
  CitibankBillPay = 'citi-bill-payment',
  CitibankCrossBorder = 'citi-cross-border',
  CitibankPayeeManagement = 'citi-payee-mgmt',
  CitibankStandingInstructions = 'citi-standing-instructions',
  CitibankDeveloperTools = 'citi-dev-tools',
  CitibankEligibility = 'citi-eligibility-check',
  CitibankUnmaskedData = 'citi-secure-data-view',

  // --- Plaid Nexus ---
  PlaidMainDashboard = 'plaid-overview',
  DataNetwork = 'plaid-overview', // Added alias
  PlaidIdentity = 'plaid-identity-verification',
  PlaidCRAMonitoring = 'plaid-cra-monitoring',
  PlaidInstitutions = 'plaid-institutions-explorer',
  PlaidItemManagement = 'plaid-item-management',
  
  // --- Enterprise Operations ---
  CorporateCommand = 'corporate-command',
  ModernTreasury = 'modern-treasury',
  Treasury = 'treasury-capital',
  CardPrograms = 'marqeta-cards',
  Payments = 'stripe-payments',
  StripeNexus = 'stripe-nexus',
  CounterpartyDashboard = 'counterparties',
  VirtualAccounts = 'virtual-accounts',
  CorporateActions = 'corporate-actions',
  CreditNoteLedger = 'credit-notes',
  ReconciliationHub = 'reconciliation-hub',
  GEINDashboard = 'gein-dashboard',
  CardholderManagement = 'cardholder-mgmt',
  VentureCapitalDeskView = 'vc-desk-view',

  // --- System & Intelligence ---
  AIAdvisor = 'ai-advisor',
  AIInsights = 'predictive-insights',
  QuantumWeaver = 'quantum-weaver',
  AgentMarketplace = 'agent-marketplace',
  AIAdStudio = 'ai-ad-studio',
  GlobalPositionMap = 'global-position-map',
  GlobalSsiHub = 'global-ssi-hub',
  SecurityCompliance = 'security-compliance',
  DeveloperHub = 'developer-hub',
  SchemaExplorer = 'iso-20022-explorer',
  ResourceGraph = 'resource-graph',
  TheVision = 'the-vision',
  ApiPlayground = 'api-playground',
  ComplianceOracle = 'compliance-oracle',

  // --- Admin & Tools ---
  CustomerDashboard = 'customer-dashboard',
  VerificationReports = 'verification-reports',
  FinancialReporting = 'financial-reporting',
  StripeNexusDashboard = 'stripe-nexus-admin',

  // --- Components (Direct Access) ---
  AccountDetails = 'account-details',
  AccountList = 'account-list',
  AccountStatementGrid = 'account-statement-grid',
  AccountsView = 'accounts-view',
  AccountVerificationModal = 'account-verification-modal',
  ACHDetailsDisplay = 'ach-details-display',
  AICommandLog = 'ai-command-log',
  AIPredictionWidget = 'ai-prediction-widget',
  AssetCatalog = 'asset-catalog',
  AutomatedSweepRules = 'automated-sweep-rules',
  BalanceReportChart = 'balance-report-chart',
  BalanceTransactionTable = 'balance-transaction-table',
  CardDesignVisualizer = 'card-design-visualizer',
  ChargeDetailModal = 'charge-detail-modal',
  ChargeList = 'charge-list',
  ConductorConfigurationView = 'conductor-configuration-view',
  CounterpartyDetails = 'counterparty-details',
  CounterpartyForm = 'counterparty-form',
  DisruptionIndexMeter = 'disruption-index-meter',
  DocumentUploader = 'document-uploader',
  DownloadLink = 'download-link',
  EarlyFraudWarningFeed = 'early-fraud-warning-feed',
  ElectionChoiceForm = 'election-choice-form',
  EventNotificationCard = 'event-notification-card',
  ExpectedPaymentsTable = 'expected-payments-table',
  ExternalAccountCard = 'external-account-card',
  ExternalAccountForm = 'external-account-form',
  ExternalAccountsTable = 'external-accounts-table',
  FinancialAccountCard = 'financial-account-card',
  IncomingPaymentDetailList = 'incoming-payment-detail-list',
  InvoiceFinancingRequest = 'invoice-financing-request',
  PaymentInitiationForm = 'payment-initiation-form',
  PaymentMethodDetails = 'payment-method-details',
  PaymentOrderForm = 'payment-order-form',
  PayoutsDashboard = 'payouts-dashboard',
  PnLChart = 'pnl-chart',
  RefundForm = 'refund-form',
  RemittanceInfoEditor = 'remittance-info-editor',
  ReportingView = 'reporting-view',
  ReportRunGenerator = 'report-run-generator',
  ReportStatusIndicator = 'report-status-indicator',
  SsiEditorForm = 'ssi-editor-form',
  StripeNexusView = 'stripe-nexus-view',
  StripeStatusBadge = 'stripe-status-badge',
  StructuredPurposeInput = 'structured-purpose-input',
  SubscriptionList = 'subscription-list',
  TimeSeriesChart = 'time-series-chart',
  TradeConfirmationModal = 'trade-confirmation-modal',
  TransactionFilter = 'transaction-filter',
  TransactionList = 'transaction-list',
  TreasuryTransactionList = 'treasury-transaction-list',
  UniversalObjectInspector = 'universal-object-inspector',
  VirtualAccountForm = 'virtual-account-form',
  VirtualAccountsTable = 'virtual-accounts-table',
  VoiceControl = 'voice-control',
  WebhookSimulator = 'webhook-simulator',

  // Educational & 527 Views
  TheBook = 'the-book',
  KnowledgeBase = 'knowledge-base',
  
  // Auth & Settings
  Settings = 'settings',
  SSO = 'sso',
  ConciergeService = 'concierge-service',
  Philanthropy = 'philanthropy',
  OpenBanking = 'open-banking',
  FinancialDemocracy = 'financial-democracy',
  APIStatus = 'api-status',
  APIIntegration = 'api-integration',
  APIConsole = 'api-console',
  SecurityCenter = 'security-center',
  Security = 'security',
  AIStrategy = 'ai-strategy',
  Goals = 'financial-goals',
  Rewards = 'rewards',
  CardCustomization = 'card-customization',
}

export type UserRole =
  | 'ADMIN'
  | 'TRADER'
  | 'CLIENT'
  | 'VISIONARY'
  | 'CARETAKER'
  | 'QUANT_ANALYST'
  | 'SYSTEM_ARCHITECT'
  | 'ETHICS_OFFICER'
  | 'DATA_SCIENTIST'
  | 'NETWORK_WEAVER'
  | 'CITIZEN'
  | 'FOUNDER'
  | 'INVESTOR'
  | 'MANAGER';

export type SecurityLevel =
  | 'STANDARD'
  | 'ELEVATED'
  | 'TRADING_UNLOCKED'
  | 'QUANTUM_ENCRYPTED'
  | 'SOVEREIGN_CLEARED'
  | 'ARCHITECT_LEVEL';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles?: UserRole[];
  securityLevel?: SecurityLevel;
  netWorth?: number;
  display_name?: string;
  handle?: string;
  role?: string;
  businessId?: string;
  profilePictureUrl?: string;
  bio?: string;
  profile?: {
    interests: string[];
    skills: string[];
    [key: string]: any;
  };
  wallet?: {
    balance: number;
    currency: string;
  };
  businesses?: string[];
  memberships?: any[];
  followers?: string[];
  following?: string[];
  state?: {
    mood: string;
    activity: string;
    last_active_tick: number;
    [key: string]: any;
  };
  isAdmin?: boolean;
  title?: string;
  phone?: string;
  loyaltyTier?: string;
  usdBalance?: number;
  fiatBalance?: number;
  cryptoBalance?: number;
  avatarUrl?: string;
  tradingProfile?: any;
  biometricHashV2?: string;
  genomicSignatureId?: string;
  citizenship?: string;
  reputationScore?: number;
  threatVectorIndex?: number;
  neuralLaceSyncStatus?: string;
  cognitiveProfileId?: string;
  activeThoughtStreamId?: string | null;
  lastLoginCoordinates?: GeoCoordinate;
  temporalAnchorId?: string;
  activeSovereignAgentIds?: string[];
  permissionsGridHash?: string;
}

export type UserProfile = User;

export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  text: string;
  timestamp: string;
}

export interface PostContent {
  text: string;
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  financialData?: any;
}

export interface Post {
  id: string;
  author_id: string;
  userName: string;
  userProfilePic: string;
  created_tick: number;
  content: PostContent;
  type: 'text' | 'image' | 'video' | 'link' | 'financial_event';
  tags: string[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  visibility: 'public' | 'connections' | 'private';
  comments: Comment[];
}

export interface LendingPoolStats {
  totalCapital: number;
  interestRate: number;
  activeLoans: number;
  defaultRate: number;
  totalInterestEarned: number;
}

export interface AppIntegration {
  id: string;
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'disconnected' | 'issue';
}

export interface BiometricData {
  id: string;
  type: string;
  publicKey: string;
  enrolledDate: string;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  device?: string;
  browser?: string;
  os?: string;
  location?: string;
  isCurrent?: boolean;
  userAgent?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  specialization: string;
  traffic: number;
}

export interface SynapticVault {
  id: string;
  ownerIds: string[];
  ownerNames: string[];
  status: string;
  masterPrivateKeyFragment: string;
  creationDate: string;
}

export interface EcosystemKPIs {
  currentDate: string;
  totalEcosystemValue: number;
  totalTransactions: number;
  communityPoolCapital: number;
  activeUsers: number;
  gdp: number;
}

export interface SimulationEvent {
  id: string;
  tick: number;
  type: string;
  description: string;
  impact: any;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: 'service' | 'retail' | 'tech' | 'manufacturing' | 'finance' | 'platform';
  monthly_revenue: number;
  expenses: number;
  employees: string[];
  status: 'active' | 'bankrupt' | 'acquired';
  marketing_factor: number; // 0-1 multiplier
  businessPlan?: string;
  valuation?: number;
  cashBalance?: number;
  hqLocation?: string;
}

/**
 * ==============================================================================
 * SECTION 10: QUANTUM WEALTH, ALGORITHMIC TRADING & ALTERNATIVE ASSETS
 * ==============================================================================
 * Advanced structures for fractional real estate, fine art tokenization,
 * algorithmic trading strategies, venture capital startups, and Stripe ledger balances.
 */

export interface RealEstateProperty {
  id: string;
  address: string;
  value: number;
  rentalIncome: number;
  occupancyRate?: number;
  tokenizedShares?: number;
  yieldYTD?: number;
}

export interface ArtPiece {
  id: string;
  name: string;
  artist: string;
  value: number;
  year: number;
  medium?: string;
  provenance?: string[];
  fractionalOwnershipEnabled?: boolean;
}

export interface AlgoStrategy {
  id: string;
  name: string;
  performance: number;
  risk: 'Low' | 'Medium' | 'High';
  active: boolean;
  sharpeRatio?: number;
  maxDrawdown?: number;
  allocationPercentage?: number;
}

export interface VentureStartup {
  id: string;
  name: string;
  valuation: number;
  investment: number;
  equity: number;
  fundingRound?: 'Seed' | 'SeriesA' | 'SeriesB' | 'SeriesC' | 'Growth';
  burnRate?: number;
  runwayMonths?: number;
}

export interface StripeBalance {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
}

export interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number;
  description: string;
  customer_id?: string;
  receipt_url?: string;
  metadata: KeyValuePairs;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
  total_spent?: number;
  metadata?: KeyValuePairs;
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: number;
  plan_id: string;
  amount: number;
}

export type StripeResource = any;

/**
 * ==============================================================================
 * SECTION 11: GATEKEEPER VERIFICATION & CRYPTOGRAPHIC LEDGERS
 * ==============================================================================
 * Types governing secure micro-deposit verification, Modern Treasury external
 * account validation, and multi-factor cryptographic gatekeepers.
 */

export interface VerifyParams {
  externalAccountId: string;
  originatingAccountId: string;
  paymentType: 'ach' | 'eft' | 'rtp';
  currency: string;
  authToken: string; // The base64 string provided by user
}

export interface VerifyError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * ==============================================================================
 * SECTION 12: SACRED GEOMETRY, GEMATRIA & THEOLOGICAL PATTERNS
 * ==============================================================================
 * Types governing mathematical patterns, triangular numbers, gematria calculations,
 * and multi-layered cosmic/historical pattern analysis.
 */

export interface BibleBook {
  index: number;
  name: string;
  chapters: number;
  isTriangular: boolean;
}

export interface GematriaResult {
  word: string;
  sum: number;
  language: string;
  category: string;
}

export interface TriangularMetadata {
  index: number;
  value: number;
  significance: string;
}

export interface PatternLayer {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: 'Scripture' | 'Math' | 'Science' | 'Cosmic' | 'History';
}

/**
 * ==============================================================================
 * SECTION 13: LITERARY TRANSLATION, MANUSCRIPTS & REPOSITORY COMPENDIUMS
 * ==============================================================================
 * Types governing the transformation of raw codebases into literary masterpieces,
 * New York Times best-seller manuscripts, and virtual repository consensus engines.
 */

export interface Page {
  title: string;
  content: string; // Changed from string[] to string for narrative content
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  technicalSummary: string;
  imageryPrompt: string;
  imageUrl?: string;
  pages?: Page[];
}

export interface Section {
  title: string;
  chapters: Chapter[];
}

export type Book = Section[];

export interface Manuscript {
  repoName: string;
  title: string;
  preface: string;
  chapters: Chapter[];
  conclusion: string;
  generatedAt: string;
  author: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface KnowledgeBaseFile extends GitHubFile {
  repoName: string;
}

export interface AuditItem {
  file: GitHubFile;
  repo: GithubRepo;
}

export interface FileAnalysis {
  path: string;
  name: string;
  thoughts: string;
  hypnoticCommand: string;
  imageUrl?: string;
}

export interface ProjectCompendium {
  repoName: string;
  summaries: FileAnalysis[];
  masterStory: string;
  sacredDecree: string;
  ultimateBibliography: string;
  analyzedAt: string;
  totalFilesProcessed: number;
}

export interface VirtualRepository {
  name: string;
  files: Map<string, FileAnalysis>;
  consensus: any;
  isReady: boolean;
}

export interface SelectedContext {
  repo: GithubRepo | null;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
  isGenerating: boolean;
  status: string;
  compendium?: ProjectCompendium | null;
  virtualRepo?: VirtualRepository | null;
}

export interface RepoSession {
  repoId: number;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
}

/**
 * ==============================================================================
 * SECTION 14: ENTERPRISE PAYMENTS, SIMULATIONS & CLIENT REGISTRATION
 * ==============================================================================
 * Types governing enterprise-grade payee management, simulation engines,
 * client registration responses, and line-item ledger updates.
 */

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
}

export interface CustomerProfileResponse {
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  companyName: string;
  emails: Array<{
    emailAddress: string;
    preferenceType: string;
  }>;
  addressList: Array<{
    addressLine1: string;
    city: string;
    countryCode: string;
    postalCode: string;
    addressType: string;
  }>;
  phones: Array<{
    phoneType: string;
    fullPhoneNumber: string;
    preferenceType: string;
  }>;
}

export interface ClientRegisterResponse {
  client_id: string;
  client_secret: string;
  client_name: string;
  appId?: string;
  redirect_uris: string[];
  scope: string[];
  token_endpoint_auth_method?: string;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * ==============================================================================
 * SECTION 15: ADVANCED TYPESCRIPT UTILITY & TYPE-LEVEL PROGRAMMING
 * ==============================================================================
 * High-performance utility types for deep partials, readonly mapping,
 * union-to-intersection conversions, and type-safe property picking.
 */

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type PickProperties<T, U> = Pick<T, KeysOfType<T, U>>;

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type TupleToUnion<T extends any[]> = T[number];

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

/**
 * ==============================================================================
 * SECTION 16: ISO 20022 XML/JSON SCHEMA DEFINITIONS & MX/MT MESSAGE PARSERS
 * ==============================================================================
 * Exhaustive, production-grade type definitions for ISO 20022 financial messaging.
 * Covers pacs.008, pacs.009, pain.001, and camt.053 schemas with complete structural fidelity.
 */

export interface ActiveOrHistoricCurrencyAndAmount {
  value: number;
  currency: string;
}

export interface PostalAddress24 {
  adrTp?: 'MNDT' | 'ALCO' | 'BIZZ' | 'COMM' | 'DLVY' | 'HEAD' | 'OFFI' | 'HOME' | 'PBOX';
  dept?: string;
  subDept?: string;
  strtNm?: string;
  bldgNb?: string;
  bldgNm?: string;
  pstCd?: string;
  twnNm?: string;
  subPrvnc?: string;
  ctrySubDvsn?: string;
  ctry?: string;
  adrLine?: string[];
}

export interface PartyIdentification135 {
  nm?: string;
  pstlAdr?: PostalAddress24;
  id?: {
    orgId?: {
      anyBIC?: string;
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
    prvtId?: {
      dtAndPlcOfBirth?: {
        birthDt: string;
        prvncOfBirth?: string;
        cityOfBirth: string;
        ctryOfBirth: string;
      };
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
  };
  ctctDtls?: {
    nmPrfx?: 'DOCT' | 'MADM' | 'MISS' | 'MIST' | 'MIXX';
    nm?: string;
    phneNb?: string;
    mobPhneNb?: string;
    faxNb?: string;
    emailAdr?: string;
    emailPurp?: string;
    jobTitl?: string;
    rspnsblty?: string;
    dept?: string;
  };
}

export interface ClearingSystemMemberIdentification2 {
  clrSysId?: {
    cd?: string;
    prtry?: string;
  };
  mmbId: string;
}

export interface BranchAndFinancialInstitutionIdentification6 {
  finInstnId: {
    bicfi?: string;
    clrSysMmbId?: ClearingSystemMemberIdentification2;
    nm?: string;
    pstlAdr?: PostalAddress24;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  brnch?: {
    id?: string;
    nm?: string;
    pstlAdr?: PostalAddress24;
  };
}

export interface CashAccount38 {
  id: {
    iban?: string;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  tp?: {
    cd?: string;
    prtry?: string;
  };
  ccy?: string;
  nm?: string;
  prxy?: {
    tp?: { cd?: string; prtry?: string };
    id: string;
  };
}

export interface PaymentIdentification7 {
  instrId?: string;
  endToEndId: string;
  uetr?: string;
  txId?: string;
  clrSysRef?: string;
}

export interface GroupHeader93 {
  msgId: string;
  creDtTm: string;
  authstn?: {
    cd?: string;
    prtry?: string;
  }[];
  btchBookg?: boolean;
  nbOfTxs: string;
  ctrlSum?: number;
  initgPty?: PartyIdentification135;
  fwdgAgt?: BranchAndFinancialInstitutionIdentification6;
}

export interface CreditTransferTransaction39 {
  pmtId: PaymentIdentification7;
  pmtTpInf?: {
    instrPrty?: 'HIGH' | 'NORM';
    svcLvl?: { cd?: string; prtry?: string }[];
    lclInstrm?: { cd?: string; prtry?: string };
    ctgyPurp?: { cd?: string; prtry?: string };
  };
  intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
  intrBkSttlmDt?: string;
  sttlmPrty?: 'HIGH' | 'NORM';
  chrgBr: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
  chrgsInf?: {
    amt: ActiveOrHistoricCurrencyAndAmount;
    agt: BranchAndFinancialInstitutionIdentification6;
  }[];
  instgAgt?: BranchAndFinancialInstitutionIdentification6;
  instdAgt?: BranchAndFinancialInstitutionIdentification6;
  dbtr: PartyIdentification135;
  dbtrAcct?: CashAccount38;
  dbtrAgt: BranchAndFinancialInstitutionIdentification6;
  dbtrAgtAcct?: CashAccount38;
  cdtrAgt: BranchAndFinancialInstitutionIdentification6;
  cdtrAgtAcct?: CashAccount38;
  cdtr: PartyIdentification135;
  cdtrAcct?: CashAccount38;
  ultmtDbtr?: PartyIdentification135;
  ultmtCdtr?: PartyIdentification135;
  purp?: { cd?: string; prtry?: string };
  rgltryRptg?: {
    dbtCdtFlg?: 'DBIT' | 'CDIT';
    authrty?: { nm?: string; ctry?: string };
    dtls?: { cd?: string; prtry?: string; inf?: string[] }[];
  }[];
  rltdRmtInf?: {
    fcmtId?: string;
    docTp?: string;
    docNb?: string;
    dt?: string;
  }[];
  rmtInf?: {
    ustrd?: string[];
    strd?: {
      rfrdDocInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        nb?: string;
        rltdDt?: string;
      }[];
      rfrdDocAmt?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        amt: ActiveOrHistoricCurrencyAndAmount;
      }[];
      cdtrRefInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        ref?: string;
      };
      invcr?: PartyIdentification135;
      invcee?: PartyIdentification135;
    }[];
  };
}

export interface Pacs008Document {
  fitoficstmdbtct: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: CreditTransferTransaction39[];
  };
}

export interface Pacs009Document {
  ficreditTransfer: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: {
      pmtId: PaymentIdentification7;
      intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
      intrBkSttlmDt?: string;
      instgAgt?: BranchAndFinancialInstitutionIdentification6;
      instdAgt?: BranchAndFinancialInstitutionIdentification6;
      dbtr: BranchAndFinancialInstitutionIdentification6;
      dbtrAcct?: CashAccount38;
      dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtr: BranchAndFinancialInstitutionIdentification6;
      cdtrAcct?: CashAccount38;
    }[];
  };
}

export interface Pain001Document {
  cstmrCdtTrfInitn: {
    grpHdr: GroupHeader93;
    pmtInf: {
      pmtInfId: string;
      pmtMtd: 'TRF' | 'CHK' | 'TRA';
      btchBookg?: boolean;
      nbOfTxs?: string;
      ctrlSum?: number;
      pmtTpInf?: {
        instrPrty?: 'HIGH' | 'NORM';
        svcLvl?: { cd?: string; prtry?: string }[];
        lclInstrm?: { cd?: string; prtry?: string };
        ctgyPurp?: { cd?: string; prtry?: string };
      };
      reqdExctnDt: {
        dt?: string;
        dtTm?: string;
      };
      dbtr: PartyIdentification135;
      dbtrAcct: CashAccount38;
      dbtrAgt: BranchAndFinancialInstitutionIdentification6;
      dbtrAgtAcct?: CashAccount38;
      ultmtDbtr?: PartyIdentification135;
      chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
      cdtTrfTxInf: {
        pmtId: PaymentIdentification7;
        amt: {
          instdAmt?: ActiveOrHistoricCurrencyAndAmount;
          eqvAmt?: {
            amt: ActiveOrHistoricCurrencyAndAmount;
            ccyOfTrf: string;
          };
        };
        chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
        cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
        cdtrAgtAcct?: CashAccount38;
        cdtr: PartyIdentification135;
        cdtrAcct?: CashAccount38;
        ultmtCdtr?: PartyIdentification135;
        purp?: { cd?: string; prtry?: string };
        rmtInf?: { ustrd?: string[] };
      }[];
    }[];
  };
}

export interface Camt053Document {
  bkToCstmrStmt: {
    grpHdr: GroupHeader93;
    stmt: {
      id: string;
      elctrncSeqNb?: number;
      creDtTm: string;
      frToDt?: {
        frDtTm: string;
        toDtTm: string;
      };
      acct: CashAccount38;
      bal: {
        tp: {
          cdOrPrtry: { cd: string; prtry?: string };
        };
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        dt: { dtTm: string };
      }[];
      ntry?: {
        ntryRef?: string;
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        sts: 'BOOK' | 'PDNG';
        bookgDt?: { dtTm: string };
        valDt?: { dtTm: string };
        acctSvcrRef?: string;
        ntryDtls?: {
          txDtls?: {
            refs?: {
              endToEndId?: string;
              uetr?: string;
              txId?: string;
            };
            amtDtls?: {
              instdAmt?: {
                amt: ActiveOrHistoricCurrencyAndAmount;
              };
            };
            rltdPties?: {
              dbtr?: PartyIdentification135;
              cdtr?: PartyIdentification135;
            };
            rltdAgts?: {
              dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
              cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
            };
          }[];
        }[];
      }[];
    }[];
  };
}

/**
 * ==============================================================================
 * SECTION 17: QUANTUM LEDGER & MULTI-NODE CONSENSUS MESH PROTOCOL (NEXUS-V3)
 * ==============================================================================
 * Advanced cryptographic structures for zero-knowledge proofs, post-quantum
 * signatures, threshold multi-sig, and decentralized consensus state machines.
 */

export type QuantumSignatureScheme = 'Dilithium5' | 'Falcon1024' | 'SPHINCS+' | 'XMSS_MT';

export interface QuantumPublicKey {
  scheme: QuantumSignatureScheme;
  rawBytes: string; // Base64 encoded public key
  fingerprint: string; // SHA3-256 hash of the public key
}

export interface ZkProofPayload {
  provingSystem: 'Groth16' | 'Plonk' | 'Halo2' | 'Bulletproofs';
  proofBytes: string; // Base64 encoded proof
  publicInputs: string[]; // Array of public input values
  verificationKeyHash: string;
}

export interface ThresholdSignatureConfig {
  threshold: number; // 't' in t-of-n
  totalSigners: number; // 'n'
  publicKeys: QuantumPublicKey[];
  epochId: number;
}

export interface ConsensusState {
  currentEpoch: number;
  currentRound: number;
  leaderNodeId: string;
  activeValidators: string[];
  consensusThreshold: number;
  lastCommittedBlockHeight: number;
  lastCommittedBlockHash: string;
  pendingProposalsCount: number;
}

export interface StateChannel {
  channelId: string;
  participants: string[];
  nonce: number;
  balances: Record<string, ActiveOrHistoricCurrencyAndAmount>;
  signatures: Record<string, string>;
  status: 'OPEN' | 'CLOSING' | 'CLOSED' | 'DISPUTED';
  disputeTimeoutBlock?: number;
}

export interface MeshNode {
  nodeId: string;
  endpoint: string;
  version: string;
  reputationScore: number;
  latencyMs: number;
  isValidator: boolean;
  stakingBalance: ActiveOrHistoricCurrencyAndAmount;
  lastHeartbeat: string;
}

export interface BlockHeader {
  height: number;
  previousHash: string;
  merkleRoot: string;
  stateRoot: string;
  timestamp: number;
  validatorSignature: string;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface TransactionPayload {
  txHash: string;
  sender: string;
  recipient: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  nonce: number;
  gasLimit: number;
  gasPrice: ActiveOrHistoricCurrencyAndAmount;
  signature: string;
  zkProof?: ZkProofPayload;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface ConsensusMessage {
  messageId: string;
  senderNodeId: string;
  epoch: number;
  round: number;
  type: 'PROPOSE' | 'PREVOTE' | 'PRECOMMIT' | 'DECIDE';
  blockHash: string;
  signature: string;
}

/**
 * ==============================================================================
 * SECTION 18: AI SWARM ORCHESTRATION, AGENTIC WORKFLOWS & COGNITIVE THOUGHT STREAMS
 * ==============================================================================
 * Types governing multi-agent swarms, task decomposition graphs, agent-to-agent
 * communication protocols, vector database embeddings, and cognitive thought stream logs.
 */

export type AgentRole = 'ORCHESTRATOR' | 'CRITIC' | 'REFINER' | 'RESEARCHER' | 'CODER' | 'COMPLIANCE_OFFICER' | 'FINANCIAL_ANALYST';

export interface AgentCapability {
  name: string;
  description: string;
  parametersSchema: Record<string, any>; // JSON Schema for tool parameters
}

export interface TaskDecompositionNode {
  taskId: string;
  parentTaskId: string | null;
  assignedAgentId: string;
  description: string;
  dependencies: string[]; // Array of taskIds that must complete first
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  error?: string;
  attempts: number;
  maxAttempts: number;
}

export interface SwarmOrchestratorState {
  swarmId: string;
  activeAgents: Record<string, {
    agentId: string;
    role: AgentRole;
    status: 'IDLE' | 'WORKING' | 'CRITICIZING' | 'OFFLINE';
    currentTaskId?: string;
  }>;
  taskGraph: Record<string, TaskDecompositionNode>;
  overallProgress: number; // 0.0 to 1.0
  status: 'IDLE' | 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
}

export interface AgentMessage {
  messageId: string;
  senderId: string;
  recipientId: string; // Can be 'ALL' or specific agentId
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
  replyToId?: string;
}

export interface ThoughtStreamNode {
  nodeId: string;
  agentId: string;
  timestamp: number;
  thoughtType: 'OBSERVATION' | 'REASONING' | 'HYPOTHESIS' | 'CRITIQUE' | 'DECISION';
  content: string;
  confidenceScore: number; // 0.0 to 1.0
  parentThoughtId: string | null;
}

export interface VectorEmbedding {
  id: string;
  vector: number[];
  textPayload: string;
  metadata: Record<string, string | number | boolean>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface ToolExecutionContext {
  toolName: string;
  arguments: Record<string, any>;
  callerAgentId: string;
  timestamp: number;
  executionTimeMs?: number;
  status: 'SUCCESS' | 'ERROR';
  result?: any;
  error?: string;
}

/**
 * ==============================================================================
 * SECTION 19: ADVANCED ALGORITHMIC TRADING, HIGH-FREQUENCY ORDER BOOKS & RISK ENGINES
 * ==============================================================================
 * Types governing real-time order books (L1/L2/L3), market makers, execution
 * algorithms (TWAP, VWAP, Sniper), portfolio risk metrics, and margin/liquidation engines.
 */

export interface OrderBookLevel {
  price: number;
  quantity: number;
  orderCount?: number;
}

export interface OrderBookL2 {
  ticker: string;
  timestamp: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface OrderBookL3 {
  ticker: string;
  timestamp: number;
  bids: { orderId: string; price: number; quantity: number; ownerId: string }[];
  asks: { orderId: string; price: number; quantity: number; ownerId: string }[];
}

export type AlgoExecutionStrategy = 'TWAP' | 'VWAP' | 'SNIPER' | 'ICEBERG' | 'GRID' | 'MARKET_MAKER';

export interface AlgoTradingJob {
  jobId: string;
  ticker: string;
  strategy: AlgoExecutionStrategy;
  side: 'BUY' | 'SELL';
  totalQuantity: number;
  executedQuantity: number;
  limitPrice?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  parameters: {
    startTime: string;
    endTime: string;
    sliceIntervalSeconds?: number;
    maxParticipationRate?: number; // For VWAP
    icebergDisplayQuantity?: number;
  };
  status: 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  averageExecutionPrice: number;
  slippageBps: number;
  logs: string[];
}

export interface PortfolioRiskMetrics {
  portfolioId: string;
  timestamp: number;
  valueAtRisk95: ActiveOrHistoricCurrencyAndAmount; // 95% confidence VaR
  valueAtRisk99: ActiveOrHistoricCurrencyAndAmount; // 99% confidence VaR
  expectedShortfall: ActiveOrHistoricCurrencyAndAmount;
  sharpeRatio: number;
  sortinoRatio: number;
  betaToBenchmark: number;
  alphaToBenchmark: number;
  maxDrawdown: number;
  volatilityAnnualized: number;
}

export interface MarginAccount {
  accountId: string;
  collateralBalance: ActiveOrHistoricCurrencyAndAmount;
  borrowedBalance: ActiveOrHistoricCurrencyAndAmount;
  maintenanceMarginRequirement: number; // Percentage, e.g., 0.15 for 15%
  initialMarginRequirement: number; // Percentage, e.g., 0.30 for 30%
  currentMarginRatio: number; // collateral / borrowed
  liquidationPrice: number;
  status: 'HEALTHY' | 'MARGIN_CALL' | 'LIQUIDATING' | 'LIQUIDATED';
}

export interface LiquidationEvent {
  liquidationId: string;
  accountId: string;
  timestamp: number;
  liquidatedAsset: string;
  liquidatedQuantity: number;
  executionPrice: number;
  penaltyFee: ActiveOrHistoricCurrencyAndAmount;
  remainingCollateral: ActiveOrHistoricCurrencyAndAmount;
}
/**
 * ==============================================================================
 * SECTION 20: MULTI-MODAL AI AD STUDIO, CAMPAIGN GENERATION & AD PERFORMANCE TRACKING
 * ==============================================================================
 * Types for AI-generated marketing campaigns, ad creatives, target audience segments,
 * budget allocation, real-time bidding (RTB) parameters, conversion tracking, and
 * multi-channel attribution models.
 */

export type AdCampaignStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type AdCreativeType = 'IMAGE' | 'VIDEO' | 'TEXT' | 'CAROUSEL' | 'INTERACTIVE_HTML5' | 'AUDIO';

export type AttributionModelType = 'FIRST_TOUCH' | 'LAST_TOUCH' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'DATA_DRIVEN';

export interface AdPerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: ActiveOrHistoricCurrencyAndAmount;
  ctr: number; // Click-Through Rate (0.0 to 1.0)
  cpc: ActiveOrHistoricCurrencyAndAmount; // Cost Per Click
  cpa: ActiveOrHistoricCurrencyAndAmount; // Cost Per Acquisition
  roas: number; // Return on Ad Spend
  bounceRate: number; // 0.0 to 1.0
  averageEngagementTimeSeconds: number;
  conversionRate: number; // 0.0 to 1.0
}

export interface AudienceSegment {
  segmentId: string;
  name: string;
  description?: string;
  demographics: {
    ageRanges: string[];
    genders: string[];
    incomeBrackets?: string[];
    educationLevels?: string[];
  };
  interests: string[];
  behaviors: string[];
  geographicRegions: string[]; // ISO country/region codes
  estimatedReach: number;
  customDataTags?: Record<string, string>;
}

export interface AdCreative {
  creativeId: string;
  type: AdCreativeType;
  headline: LocalizedString;
  bodyText: LocalizedString;
  callToAction: string;
  mediaAssets: AssetMetadata[];
  generationPromptUsed?: string;
  aiModelId?: string;
  negativePromptUsed?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '2:3';
  metaData?: Record<string, any>;
}

export interface RealTimeBiddingConfig {
  maxBidAmount: ActiveOrHistoricCurrencyAndAmount;
  targetCpa?: ActiveOrHistoricCurrencyAndAmount;
  pacingStrategy: 'EVEN' | 'AHEAD' | 'ASAP';
  bidMultiplierRules: {
    dimension: 'device' | 'region' | 'time_of_day' | 'audience_segment';
    key: string;
    multiplier: number; // e.g., 1.2 for +20% bid
  }[];
}

export interface AdCampaign {
  campaignId: string;
  name: string;
  description?: string;
  status: AdCampaignStatus;
  channels: ('SOCIAL' | 'SEARCH' | 'DISPLAY' | 'PROGRAMMATIC' | 'EMAIL' | 'METAVERSE')[];
  targetAudience: AudienceSegment;
  creatives: AdCreative[];
  totalBudget: ActiveOrHistoricCurrencyAndAmount;
  dailyBudgetLimit: ActiveOrHistoricCurrencyAndAmount;
  startDate: string;
  endDate?: string;
  rtbConfig?: RealTimeBiddingConfig;
  performanceMetrics?: AdPerformanceMetrics;
  attributionModel: AttributionModelType;
  aiCreativeBrief?: string;
  lastOptimizedAt?: string;
}

/**
 * ==============================================================================
 * SECTION 21: CITIBANK CONNECTIVITY, OPEN BANKING API PROXIES & SECURE DATA EXCHANGE
 * ==============================================================================
 * Citi-specific API payloads, unmasked data views, standing instructions,
 * cross-border payment routing, payee management, and developer sandbox configurations.
 */

export type CitiAccountProxyStatus = 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';

export interface CitiAccountProxy {
  proxyId: string;
  realAccountId: string;
  mask: string;
  virtualIban: string;
  status: CitiAccountProxyStatus;
  allowedMerchantCategories: string[]; // MCC codes
  dailyLimit: ActiveOrHistoricCurrencyAndAmount;
  expirationDate: string;
  createdDate: string;
}

export interface CitiBillPayment {
  paymentId: string;
  billerId: string;
  billerName: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  status: 'PENDING' | 'PROCESSING' | 'EXECUTED' | 'FAILED';
  executionDate: string;
  recurringRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY';
    interval: number;
    endDate?: string;
  };
}

export interface CitiCrossBorderTransfer {
  transferId: string;
  senderBic: string;
  receiverBic: string;
  intermediaryBic?: string;
  fxRate: number;
  guaranteedUntil: string;
  transferFee: ActiveOrHistoricCurrencyAndAmount;
  regulatoryReportingCode?: string; // e.g., Central Bank reporting codes
  chargeBearer: 'OUR' | 'BEN' | 'SHA';
}

export interface CitiPayee {
  payeeId: string;
  name: string;
  accountDetails: CashAccount38;
  address?: PostalAddress24;
  status: 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED';
  verificationLevel: 'STANDARD' | 'ENHANCED_KYC' | 'SANCTION_CLEARED';
  lastPaidDate?: string;
}

export interface CitiStandingInstruction {
  instructionId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  frequency: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  nextExecutionDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export interface CitiDeveloperSandboxConfig {
  sandboxId: string;
  clientId: string;
  clientSecret: string;
  mockDataProfile: 'RETAIL_MASS' | 'HNW_SOVEREIGN' | 'CORPORATE_CONGLOMERATE';
  latencySimulationMs: number;
  errorSimulationRate: number; // 0.0 to 1.0
}

/**
 * ==============================================================================
 * SECTION 22: WEB3 DECENTRALIZED FINANCE (DeFi), LIQUIDITY POOLS & SMART CONTRACT INTERACTION
 * ==============================================================================
 * Types for decentralized lending pools, yield farming, automated market makers (AMMs),
 * gas estimation, smart contract ABIs, wallet provider details (EIP-6963), and cross-chain bridge protocols.
 */

export interface DeFiLendingPool {
  poolAddress: string;
  assetSymbol: string;
  totalDeposited: ActiveOrHistoricCurrencyAndAmount;
  totalBorrowed: ActiveOrHistoricCurrencyAndAmount;
  supplyApy: number; // Annual Percentage Yield
  borrowApy: number;
  utilizationRate: number; // 0.0 to 1.0
  collateralFactor: number; // 0.0 to 1.0
  liquidationThreshold: number; // 0.0 to 1.0
}

export interface YieldFarm {
  farmAddress: string;
  lpTokenAddress: string;
  rewardTokenAddress: string;
  tvl: ActiveOrHistoricCurrencyAndAmount; // Total Value Locked
  apr: number; // Annual Percentage Rate
  userStakedBalance: number;
  userPendingRewards: number;
}

export interface AmmPool {
  poolAddress: string;
  token0: { address: string; symbol: string; decimals: number };
  token1: { address: string; symbol: string; decimals: number };
  reserve0: number;
  reserve1: number;
  feeTierBps: number; // e.g., 30 for 0.3%
  volume24h: ActiveOrHistoricCurrencyAndAmount;
  totalLiquidity: ActiveOrHistoricCurrencyAndAmount;
}

export interface SmartContractAbiEntry {
  name: string;
  type: 'function' | 'event' | 'constructor' | 'fallback' | 'receive';
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  inputs: { name: string; type: string; indexed?: boolean }[];
  outputs?: { name: string; type: string }[];
}

export interface WalletProviderDetail {
  uuid: string;
  name: string;
  icon: string; // Base64 or URL
  rdns: string; // Reverse Domain Name System identifier
  providerInstance: any; // EIP-1193 provider instance
}

export interface CrossChainBridgeTx {
  txHash: string;
  sourceChainId: number;
  destinationChainId: number;
  assetSymbol: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  bridgeFee: ActiveOrHistoricCurrencyAndAmount;
  estimatedTimeMinutes: number;
}

/**
 * ==============================================================================
 * SECTION 23: FOREX ARENA, COMMODITIES EXCHANGE & DERIVATIVES DESK
 * ==============================================================================
 * Types for foreign exchange (FX) spot/forward contracts, leverage settings,
 * margin requirements, commodity futures, options chains (calls/puts, Greeks), and hedging strategies.
 */

export interface FxSpotContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  bidPrice: number;
  askPrice: number;
  pipValue: number;
  lotSize: number; // Standard lot is 100,000 units
}

export interface FxForwardContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  forwardRate: number;
  maturityDate: string;
  settlementType: 'PHYSICAL' | 'CASH';
  notionalAmount: ActiveOrHistoricCurrencyAndAmount;
}

export interface CommodityFuture {
  ticker: string;
  commodityType: 'ENERGY' | 'METALS' | 'AGRICULTURE' | 'ENVIRONMENTAL';
  contractMonth: string; // e.g., "DEC29"
  contractYear: number;
  multiplier: number;
  maintenanceMargin: ActiveOrHistoricCurrencyAndAmount;
  lastTradingDate: string;
}

export interface OptionContract {
  optionId: string;
  underlyingTicker: string;
  strikePrice: number;
  expirationDate: string;
  optionType: 'CALL' | 'PUT';
  premium: number;
  openInterest: number;
  volume: number;
}

export interface OptionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  impliedVolatility: number;
}

export interface HedgingStrategy {
  strategyId: string;
  name: string;
  description: string;
  underlyingAssets: string[];
  derivativeInstruments: string[]; // optionIds or future tickers
  targetHedgeRatio: number; // e.g., 0.85 for 85% hedged
  currentHedgeRatio: number;
  unrealizedPnL: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 24: REAL ESTATE EMPIRE, FRACTIONAL OWNERSHIP & ART COLLECTIBLES
 * ==============================================================================
 * Types for tokenized real estate, fractional shares, rental distribution ledgers,
 * art provenance tracking, appraisal history, and gallery exhibition schedules.
 */

export interface RealEstateFractionalShare {
  shareId: string;
  propertyId: string;
  ownerId: string;
  percentageOwned: number; // 0.0 to 1.0
  purchasePrice: ActiveOrHistoricCurrencyAndAmount;
  purchaseDate: string;
  currentValue: ActiveOrHistoricCurrencyAndAmount;
}

export interface RentalDistributionLedger {
  ledgerId: string;
  propertyId: string;
  periodStartDate: string;
  periodEndDate: string;
  totalGrossRentCollected: ActiveOrHistoricCurrencyAndAmount;
  expensesDeducted: ActiveOrHistoricCurrencyAndAmount;
  netRentDistributed: ActiveOrHistoricCurrencyAndAmount;
  distributions: {
    shareId: string;
    ownerId: string;
    amountDistributed: ActiveOrHistoricCurrencyAndAmount;
    distributedAt: string;
  }[];
}

export interface ArtProvenanceEntry {
  entryId: string;
  ownerName: string;
  acquisitionDate: string;
  acquisitionPrice?: ActiveOrHistoricCurrencyAndAmount;
  provenanceType: 'GALLERY_PURCHASE' | 'AUCTION' | 'PRIVATE_SALE' | 'INHERITANCE' | 'MUSEUM_EXHIBITION';
  location: string;
  verifiedBy: string;
  verificationHash: string;
}

export interface ArtAppraisalHistory {
  appraisalId: string;
  appraiserName: string;
  appraiserCredentials: string[];
  appraisalDate: string;
  appraisedValue: ActiveOrHistoricCurrencyAndAmount;
  appraisalReportUrl?: string;
  conditionRating: 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

export interface GalleryExhibition {
  exhibitionId: string;
  galleryName: string;
  location: string;
  startDate: string;
  endDate: string;
  curatorName: string;
  exhibitedArtPieceIds: string[];
  insuranceCoverageAmount: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 25: TAX OPTIMIZATION, LEGACY ARCHITECT & PHILANTHROPY
 * ==============================================================================
 * Types for tax loss harvesting, capital gains tracking, trust funds, estate planning,
 * charitable foundations, donor-advised funds (DAFs), and impact metrics.
 */

export interface TaxLossHarvestingOpportunity {
  opportunityId: string;
  assetTicker: string;
  currentPrice: number;
  costBasis: number;
  unrealizedLoss: ActiveOrHistoricCurrencyAndAmount;
  potentialTaxSavings: ActiveOrHistoricCurrencyAndAmount;
  recommendedReplacementAssetTicker: string;
  washSaleRiskStatus: 'SAFE' | 'RISK_OF_WASH_SALE' | 'WASH_SALE_TRIGGERED';
}

export interface CapitalGainsRecord {
  recordId: string;
  assetTicker: string;
  quantity: number;
  acquisitionDate: string;
  saleDate: string;
  costBasis: ActiveOrHistoricCurrencyAndAmount;
  saleProceeds: ActiveOrHistoricCurrencyAndAmount;
  gainLossAmount: ActiveOrHistoricCurrencyAndAmount;
  gainType: 'SHORT_TERM' | 'LONG_TERM';
  estimatedTaxLiability: ActiveOrHistoricCurrencyAndAmount;
}

export interface TrustFundBeneficiary {
  beneficiaryId: string;
  name: string;
  relationship: string;
  distributionPercentage: number; // 0.0 to 1.0
  vestingSchedule?: {
    milestoneAge?: number;
    milestoneDate?: string;
    percentageVested: number;
  }[];
}

export interface TrustFund {
  trustId: string;
  trusteeName: string;
  grantorName: string;
  beneficiaries: TrustFundBeneficiary[];
  totalAssetsValue: ActiveOrHistoricCurrencyAndAmount;
  distributionRules: {
    ruleId: string;
    triggerType: 'AGE' | 'DATE' | 'EDUCATION_MILESTONE' | 'DISCRETIONARY';
    triggerValue: string;
    maxDistributionAmount?: ActiveOrHistoricCurrencyAndAmount;
  }[];
  taxStatus: 'REVOCABLE' | 'IRREVOCABLE';
}

export interface DonorAdvisedFund {
  dafId: string;
  fundName: string;
  sponsorOrganization: string;
  currentBalance: ActiveOrHistoricCurrencyAndAmount;
  contributionsHistory: {
    contributionId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    taxDeductionReceiptUrl?: string;
  }[];
  grantsDistributed: {
    grantId: string;
    charityName: string;
    charityTaxId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'DISBURSED';
  }[];
}

export interface PhilanthropicImpactMetrics {
  impactId: string;
  charityName: string;
  unSustainableDevelopmentGoals: number[]; // SDG numbers 1-17
  livesImpactedCount: number;
  carbonOffsetTons?: number;
  educationHoursProvided?: number;
  cleanWaterLitersProvided?: number;
  impactScore: number; // Scale of 1-100
}
/**
 * ==============================================================================
 * SECTION 26: VENTURE CAPITAL, PRIVATE EQUITY & STARTUP INCUBATION
 * ==============================================================================
 * Advanced structures for venture capital fund management, startup incubation,
 * cap table modeling, SAFE agreements, term sheets, and due diligence workflows.
 */

export interface VentureCapitalFund {
  fundId: string;
  fundName: string;
  vintageYear: number;
  targetAum: ActiveOrHistoricCurrencyAndAmount;
  currentAum: ActiveOrHistoricCurrencyAndAmount;
  generalPartners: string[];
  limitedPartners: {
    lpId: string;
    name: string;
    committedCapital: ActiveOrHistoricCurrencyAndAmount;
    calledCapital: ActiveOrHistoricCurrencyAndAmount;
    distributionCapital: ActiveOrHistoricCurrencyAndAmount;
  }[];
  investmentThesis: LocalizedString;
  portfolioCompanies: VentureStartup[];
  irr: number; // Internal Rate of Return (e.g., 0.24 for 24%)
  tvpi: number; // Total Value to Paid-In Capital
  dpi: number; // Distributed to Paid-In Capital
  status: 'RAISING' | 'ACTIVE' | 'FULLY_INVESTED' | 'LIQUIDATED';
}

export interface StartupIncubationCohort {
  cohortId: string;
  programName: string;
  startDate: string;
  endDate: string;
  mentors: {
    mentorId: string;
    name: string;
    expertise: string[];
    companyAffiliation?: string;
  }[];
  acceptedStartups: VentureStartup[];
  curriculumModules: {
    moduleId: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
  demoDayParameters: {
    scheduledDate: string;
    investorRsvpCount: number;
    pitchDurationSeconds: number;
    prizePoolAmount?: ActiveOrHistoricCurrencyAndAmount;
  };
}

export interface CapTableShareholder {
  shareholderId: string;
  name: string;
  shareClass: 'FOUNDER_COMMON' | 'COMMON' | 'PREFERRED_SEED' | 'PREFERRED_SERIES_A' | 'PREFERRED_SERIES_B' | 'OPTION_POOL';
  shareCount: number;
  ownershipPercentage: number; // 0.0 to 1.0
  fullyDilutedPercentage: number; // 0.0 to 1.0
  optionsGranted?: number;
  optionsVested?: number;
  vestingSchedule?: {
    cliffDate: string;
    vestingDurationMonths: number;
    vestingIntervalMonths: number;
  };
}

export interface CapTable {
  capTableId: string;
  startupId: string;
  preMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  postMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  totalSharesOutstanding: number;
  shareholders: CapTableShareholder[];
  optionPoolSize: number;
  optionPoolRemaining: number;
  convertibleNotes: {
    noteId: string;
    investorName: string;
    principalAmount: ActiveOrHistoricCurrencyAndAmount;
    interestRate: number;
    capAmount?: ActiveOrHistoricCurrencyAndAmount;
    discountRate?: number;
  }[];
  safeAgreements: SafeAgreement[];
}

export interface SafeAgreement {
  safeId: string;
  investorName: string;
  principalAmount: ActiveOrHistoricCurrencyAndAmount;
  capAmount?: ActiveOrHistoricCurrencyAndAmount;
  discountRate?: number; // e.g., 0.80 for 20% discount
  conversionTrigger: 'NEXT_EQUITY_ROUND' | 'LIQUIDITY_EVENT' | 'DISSOLUTION';
  status: 'ACTIVE' | 'CONVERTED' | 'TERMINATED';
}

export interface TermSheet {
  termSheetId: string;
  startupId: string;
  leadInvestorId: string;
  preMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  investmentAmount: ActiveOrHistoricCurrencyAndAmount;
  liquidationPreference: {
    multiplier: number; // e.g., 1.0x
    participating: boolean;
  };
  boardSeats: {
    totalSeats: number;
    investorSeats: number;
    founderSeats: number;
    independentSeats: number;
  };
  protectiveProvisions: string[];
  dragAlongRights: boolean;
  tagAlongRights: boolean;
  exclusivityDays: number;
  status: 'DRAFT' | 'SENT' | 'NEGOTIATING' | 'SIGNED' | 'EXPIRED' | 'REJECTED';
}

export interface DueDiligenceChecklist {
  checklistId: string;
  startupId: string;
  categories: {
    name: 'FINANCIAL' | 'LEGAL' | 'TECHNICAL' | 'TEAM' | 'MARKET' | 'IP';
    items: {
      itemId: string;
      description: string;
      status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'NOT_APPLICABLE';
      assignedTo: string;
      verifiedBy?: string;
      documentUrls: string[];
      comments: {
        author: string;
        text: string;
        timestamp: string;
      }[];
    }[];
  }[];
}

/**
 * ==============================================================================
 * SECTION 27: SOVEREIGN WEALTH SIMULATION, MACROECONOMIC MODELING & GAME THEORY
 * ==============================================================================
 * Types for sovereign wealth fund simulations, macroeconomic indicators,
 * geopolitical risk modeling, and game-theoretic scenario analysis.
 */

export interface SovereignWealthFund {
  fundId: string;
  nationState: string;
  totalAssets: ActiveOrHistoricCurrencyAndAmount;
  liquidReserves: ActiveOrHistoricCurrencyAndAmount;
  strategicAssetAllocation: {
    assetClass: 'EQUITIES' | 'FIXED_INCOME' | 'REAL_ESTATE' | 'INFRASTRUCTURE' | 'PRIVATE_EQUITY' | 'GOLD_RESERVES' | 'DIGITAL_ASSETS';
    targetPercentage: number; // 0.0 to 1.0
    currentPercentage: number;
  }[];
  geopoliticalRiskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'SOVEREIGN_HEGEMON';
  fiscalRules: {
    maxAnnualWithdrawalPercentage: number;
    emergencyFundThreshold: ActiveOrHistoricCurrencyAndAmount;
    commodityRevenueReinvestmentPercentage?: number;
  };
}

export interface MacroeconomicIndicators {
  gdpGrowthRate: number; // Annualized percentage change
  inflationRate: number;
  unemploymentRate: number;
  centralBankInterestRate: number;
  debtToGdpRatio: number;
  tradeBalance: ActiveOrHistoricCurrencyAndAmount;
  currencyStrengthIndex: number; // Relative to basket of global currencies
  lastUpdated: string;
}

export interface GeopoliticalEvent {
  eventId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXISTENTIAL';
  affectedRegions: string[]; // ISO country codes
  economicImpactFactors: {
    commodityPriceShock: { commodity: string; percentageChange: number }[];
    supplyChainDisruptionIndex: number; // 0.0 to 1.0
    capitalFlightRisk: boolean;
  };
  probabilityOfOccurrence: number; // 0.0 to 1.0
  status: 'POTENTIAL' | 'ACTIVE' | 'RESOLVED' | 'MITIGATED';
}

export interface PayoffMatrixEntry {
  player1Strategy: string;
  player2Strategy: string;
  player1Payoff: number;
  player2Payoff: number;
}

export interface GameTheoryScenario {
  scenarioId: string;
  title: string;
  description: string;
  players: {
    playerId: string;
    name: string;
    resources: Record<string, any>;
  }[];
  strategies: {
    playerId: string;
    options: string[];
  }[];
  payoffMatrix: PayoffMatrixEntry[];
  nashEquilibrium?: {
    player1Strategy: string;
    player2Strategy: string;
  }[];
  cooperativeOutcome?: {
    player1Strategy: string;
    player2Strategy: string;
    jointPayoff: number;
  };
  simulationSteps: {
    stepIndex: number;
    actionsTaken: Record<string, string>;
    payoffsRealized: Record<string, number>;
    narrative: string;
  }[];
}

export interface SimulationRun {
  runId: string;
  scenarioId: string;
  initialConditions: Record<string, any>;
  steps: {
    timestamp: string;
    stateVariables: Record<string, number>;
    eventsTriggered: string[];
  }[];
  finalOutcome: string;
  confidenceInterval: {
    lowerBound: number;
    upperBound: number;
  };
  executionTimeMs: number;
}

/**
 * ==============================================================================
 * SECTION 28: ADVANCED CRYPTOGRAPHIC KEY MANAGEMENT, MULTI-SIG & HSM
 * ==============================================================================
 * Types for Hardware Security Modules (HSM), cryptographic key lifecycles,
 * multi-signature transaction coordination, and zero-knowledge proof parameters.
 */

export interface HsmConfig {
  hsmId: string;
  vendor: 'THALES' | 'GEMALTO' | 'YUBICO' | 'AWS_KMS' | 'AZURE_KEY_VAULT' | 'CUSTOM_FPGA';
  model: string;
  firmwareVersion: string;
  slotId: number;
  label: string;
  supportedAlgorithms: ('AES256' | 'RSA4096' | 'ECDSA_SECP256K1' | 'ED25519' | 'DILITHIUM5' | 'FALCON1024')[];
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'DEGRADED' | 'ERROR';
}

export interface CryptographicKey {
  keyId: string;
  keyType: 'SYMMETRIC' | 'ASYMMETRIC_PUBLIC' | 'ASYMMETRIC_PRIVATE' | 'MASTER_SEED';
  keySize: number; // in bits
  algorithm: string;
  purpose: 'ENCRYPTION' | 'SIGNING' | 'KEY_DERIVATION' | 'ZERO_KNOWLEDGE';
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED' | 'ARCHIVED';
  createdAt: string;
  expiresAt?: string;
  hsmReferenceId?: string;
  keyFingerprint: string; // SHA3-256 hash of public key or key metadata
}

export interface SignatureShare {
  signerId: string;
  signatureBytes: string; // Base64 encoded signature
  timestamp: number;
  publicKeyFingerprint: string;
}

export interface MultiSigTransaction {
  txId: string;
  destinationAddress: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  assetSymbol: string;
  requiredSignatures: number; // 't' in t-of-n
  currentSignatures: SignatureShare[];
  signers: {
    signerId: string;
    name: string;
    publicKey: QuantumPublicKey;
    hasSigned: boolean;
  }[];
  status: 'PENDING_SIGNATURES' | 'FULLY_SIGNED' | 'EXECUTED' | 'FAILED' | 'EXPIRED';
  rawPayload: string; // Base64 or Hex encoded transaction payload
}

export interface ZeroKnowledgeProof {
  proofId: string;
  provingKeyId: string;
  verificationKeyId: string;
  publicInputs: string[];
  proofData: string; // Base64 encoded proof
  verified: boolean;
}

export interface ThresholdDecryptionConfig {
  t: number; // Threshold
  n: number; // Total shares
  keyShares: {
    shareId: number;
    encryptedShare: string;
    holderId: string;
  }[];
  reconstructionThreshold: number;
}

/**
 * ==============================================================================
 * SECTION 29: REAL-TIME TELEMETRY, NEURAL LACE SYNC & COGNITIVE PROFILE ANALYTICS
 * ==============================================================================
 * Types for neural interface telemetry, cognitive load tracking, emotional valence
 * analysis, and biometric feedback loops for high-frequency trading environments.
 */

export interface NeuralLaceTelemetry {
  syncId: string;
  userId: string;
  connectionStrength: number; // 0.0 to 1.0
  bandwidthBps: number;
  latencyMs: number;
  activeBrainwavePattern: 'ALPHA' | 'BETA' | 'GAMMA' | 'DELTA' | 'THETA';
  cognitiveLoadIndex: number; // 0.0 to 1.0
  emotionalState: {
    valence: number; // -1.0 (negative) to 1.0 (positive)
    arousal: number; // 0.0 (calm) to 1.0 (excited)
    dominantEmotion: 'CALM' | 'FOCUS' | 'ANXIETY' | 'EUPHORIA' | 'FATIGUE' | 'FRUSTRATION';
  };
  lastSyncTime: string;
}

export interface CognitiveProfile {
  profileId: string;
  userId: string;
  analyticalThinkingScore: number; // 0.0 to 100.0
  riskAversionIndex: number; // 0.0 to 1.0
  decisionSpeedMs: number;
  patternRecognitionScore: number; // 0.0 to 100.0
  focusDurationSeconds: number;
  stressToleranceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'ELITE';
}

export interface ThoughtNode {
  nodeId: string;
  textPayload: string;
  confidenceScore: number; // 0.0 to 1.0
  parentNodeId: string | null;
  emotionalValence: number; // -1.0 to 1.0
}

export interface ThoughtStreamLog {
  streamId: string;
  userId: string;
  timestamp: number;
  thoughtNodes: ThoughtNode[];
  primaryIntent: string;
  cognitiveCoherenceScore: number; // 0.0 to 1.0
}

export interface BiometricTelemetry {
  heartRateBpm: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  galvSkinResponse: number; // Microsiemens
  bodyTemperatureCelsius: number;
  respirationRate: number; // Breaths per minute
}

/**
 * ==============================================================================
 * SECTION 30: TEMPORAL ANCHORS, HISTORICAL PATTERN MATCHING & PREDICTIVE CHRONOLOGY
 * ==============================================================================
 * Types for cyclical historical analysis, temporal anchors, predictive chronology,
 * and pattern matching across multi-decade financial and geopolitical cycles.
 */

export interface TemporalAnchor {
  anchorId: string;
  targetTimestamp: number;
  description: string;
  historicalContext: LocalizedString;
  alignmentScore: number; // 0.0 to 1.0
  cyclicalPeriodYears: number; // e.g., 8.6 years (Martin Armstrong cycle), 50 years (Kondratiev wave)
}

export interface HistoricalPrecedent {
  precedentId: string;
  eventName: string;
  dateOccurred: string;
  economicConditions: {
    inflationLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'HYPER';
    interestRateEnvironment: 'RISING' | 'FALLING' | 'STABLE';
    geopoliticalTensionIndex: number; // 1 to 10
  };
  outcomeNarrative: LocalizedString;
  similarityIndex: number; // 0.0 to 1.0
}

export interface HistoricalPattern {
  patternId: string;
  name: string;
  description: string;
  historicalPrecedents: HistoricalPrecedent[];
  mathematicalModel: 'FIBONACCI_RETRACEMENT' | 'ELLIOTT_WAVE' | 'FOURIER_TRANSFORM' | 'MARKOV_CHAIN' | 'NEURAL_LSTM';
  correlationCoefficient: number; // -1.0 to 1.0
  predictiveAccuracy: number; // 0.0 to 1.0
}

export interface TimelineEvent {
  predictedTimestamp: number;
  eventDescription: string;
  probability: number; // 0.0 to 1.0
  potentialImpactScore: number; // 1 to 10
  triggerConditions: string[];
}

export interface PredictiveChronology {
  chronologyId: string;
  targetAsset: string;
  forecastHorizonDays: number;
  timelineEvents: TimelineEvent[];
  confidenceIntervals: {
    timestamp: number;
    p10: number; // 10th percentile price/value
    p50: number; // Median
    p90: number; // 90th percentile
  }[];
}

/**
 * ==============================================================================
 * SECTION 31: GENESIS ENGINE, SIMULATION PARAMETERS & ECOSYSTEM EVOLUTION
 * ==============================================================================
 * Types governing the multi-agent macroeconomic simulation engine, tick-based
 * state machines, ecosystem KPIs, macroeconomic shocks, and evolutionary reports.
 */

export interface MacroeconomicShock {
  shockId: string;
  name: string;
  type: 'INFLATIONARY_SPIKE' | 'LIQUIDITY_CRUNCH' | 'REGULATORY_CRACKDOWN' | 'TECHNOLOGICAL_SINGULARITY' | 'GEOPOLITICAL_CONFLICT';
  magnitude: number; // Scale of 0.0 to 1.0
  durationTicks: number;
  affectedSectors: string[];
  decayRate: number; // How fast the shock dissipates per tick
}

export interface AgentBehaviorProfile {
  profileId: string;
  agentType: 'CONSUMER' | 'PRODUCER' | 'SPECULATOR' | 'ARBITRAGEUR' | 'INSTITUTIONAL_HEDGER';
  riskAversion: number; // 0.0 to 1.0
  timePreference: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM' | 'GENERATIONAL';
  rationalityIndex: number; // 0.0 (pure noise) to 1.0 (perfect utility maximization)
  liquidityThreshold: number; // Minimum cash reserves before panic selling
}

export interface GenesisEngineConfig {
  simulationId: string;
  name: string;
  tickRateMs: number;
  totalTicksToRun: number;
  currentTick: number;
  initialCapitalDistribution: {
    totalSovereignWealth: ActiveOrHistoricCurrencyAndAmount;
    totalRetailLiquidity: ActiveOrHistoricCurrencyAndAmount;
    totalInstitutionalReserves: ActiveOrHistoricCurrencyAndAmount;
  };
  activeShocks: MacroeconomicShock[];
  agentProfiles: AgentBehaviorProfile[];
  isPaused: boolean;
}

export interface EcosystemEvolutionReport {
  reportId: string;
  simulationId: string;
  startTick: number;
  endTick: number;
  gdpGrowth: number;
  giniCoefficient: number; // Measure of wealth inequality (0.0 to 1.0)
  systemicStabilityIndex: number; // 0.0 (imminent collapse) to 1.0 (perfect equilibrium)
  dominantAgentStrategy: string;
  evolutionaryMilestones: {
    tick: number;
    milestoneType: 'EMERGENCE' | 'EXTINCTION' | 'PARADIGM_SHIFT';
    description: string;
  }[];
}

export interface SimulationState {
  engineConfig: GenesisEngineConfig;
  kpis: EcosystemKPIs;
  recentEvents: SimulationEvent[];
  evolutionReport?: EcosystemEvolutionReport;
}

/**
 * ==============================================================================
 * SECTION 32: STRIPE NEXUS, CHARGEBACKS, DISPUTES & REVENUE RECONCILIATION
 * ==============================================================================
 * Types governing Stripe payment integrations, dispute evidence submissions,
 * automated chargeback mitigation, and multi-source revenue reconciliation.
 */

export interface DisputeEvidence {
  accessActivityLog?: string;
  billingAddress?: string;
  customerCommunication?: string;
  customerSignature?: string;
  duplicateChargeDocumentation?: string;
  receipt?: string;
  refundPolicy?: string;
  serviceDocumentation?: string;
  shippingDocumentation?: string;
  uncategorizedFile?: string;
}

export interface StripeDispute {
  disputeId: string;
  chargeId: string;
  amount: number;
  currency: string;
  reason: 'general' | 'fraudulent' | 'unrecognized' | 'duplicate' | 'subscription_canceled' | 'product_not_received' | 'product_unacceptable';
  status: 'warning_needs_response' | 'warning_under_review' | 'needs_response' | 'under_review' | 'won' | 'lost';
  evidenceDueBy: string;
  evidence: DisputeEvidence;
  isSubmitted: boolean;
  metadata?: Record<string, string>;
}

export interface StripeRefund {
  refundId: string;
  chargeId: string;
  amount: number;
  currency: string;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge';
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  createdAt: number;
}

export interface StripePayout {
  payoutId: string;
  amount: number;
  currency: string;
  arrivalDate: string;
  status: 'paid' | 'pending' | 'in_transit' | 'canceled' | 'failed';
  method: 'standard' | 'instant';
  bankAccountMask: string;
}

export interface StripeTransfer {
  transferId: string;
  amount: number;
  currency: string;
  destinationAccountId: string;
  sourceTransactionId?: string;
  description?: string;
}

export interface RevenueReconciliationRule {
  ruleId: string;
  name: string;
  sourceA: 'STRIPE' | 'PLAID' | 'MODERN_TREASURY' | 'INTERNAL_LEDGER';
  sourceB: 'STRIPE' | 'PLAID' | 'MODERN_TREASURY' | 'INTERNAL_LEDGER';
  matchingCriteria: {
    fieldA: string;
    fieldB: string;
    tolerance?: number; // For numeric or date tolerances
  }[];
  autoResolve: boolean;
  isActive: boolean;
}

export interface ReconciliationMatch {
  matchId: string;
  ruleId: string;
  entityAId: string;
  entityBId: string;
  amountA: number;
  amountB: number;
  timestampA: string;
  timestampB: string;
  status: 'MATCHED' | 'DISCREPANCY' | 'UNMATCHED';
  discrepancyReason?: string;
}

export interface StripeNexusConfig {
  webhookSecret: string;
  publishableKey: string;
  restrictedApiKeys: string[];
  connectedAccounts: {
    accountId: string;
    businessName: string;
    status: 'ACTIVE' | 'PENDING' | 'RESTRICTED';
  }[];
  disputeRules: StripeDispute[];
  reconciliationRules: RevenueReconciliationRule[];
}

/**
 * ==============================================================================
 * SECTION 33: COMPLIANCE ORACLE, SANCTIONS SCREENING & AML TRANSACTION MONITORING
 * ==============================================================================
 * Types governing anti-money laundering (AML) transaction monitoring, OFAC/PEP
 * sanctions screening, Suspicious Activity Report (SAR) filings, and compliance audits.
 */

export interface SanctionsScreeningRequest {
  requestId: string;
  entityName: string;
  entityType: 'INDIVIDUAL' | 'ORGANIZATION' | 'VESSEL' | 'AIRCRAFT';
  dateOfBirth?: string;
  countryOfOrigin?: string;
  nationalId?: string;
}

export interface SanctionsMatchDetail {
  listName: string; // e.g., "OFAC SDN", "EU Consolidated List"
  entryName: string;
  matchScore: number; // 0.0 to 1.0
  remarks?: string;
  aliases?: string[];
}

export interface SanctionsScreeningResult {
  requestId: string;
  status: 'CLEARED' | 'POTENTIAL_MATCH' | 'CONFIRMED_MATCH';
  screeningTimestamp: string;
  matches: SanctionsMatchDetail[];
  analystReviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
}

export interface PepCheckResult {
  isPep: boolean;
  pepLevel?: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4'; // Level 1 is highest (Heads of State)
  sourceList: string;
  politicalOfficeHeld?: string;
  riskScore: number; // 0.0 to 100.0
}

export interface AmlTransactionMonitoringRule {
  ruleId: string;
  name: string;
  description: string;
  triggerCondition: {
    metric: 'VELOCITY_24H' | 'SINGLE_TRANSACTION_LIMIT' | 'RAPID_FUNDS_FLOW' | 'STRUCTURING_DETECTION';
    threshold: number;
    currency?: string;
  };
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isActive: boolean;
}

export interface AmlAlert {
  alertId: string;
  ruleId: string;
  userId: string;
  transactionIds: string[];
  riskScore: number;
  status: 'NEW' | 'UNDER_INVESTIGATION' | 'DISMISSED_FALSE_POSITIVE' | 'ESCALATED_TO_SAR';
  assignedInvestigatorId?: string;
  createdAt: string;
  notes: string[];
}

export interface SarFiling {
  sarId: string;
  alertId: string;
  filingAgency: 'FinCEN' | 'FCA' | 'BaFin' | 'AMF';
  suspectDetails: {
    fullName: string;
    ssnOrTaxId?: string;
    address?: string;
    occupation?: string;
  };
  narrativeSummary: string;
  financialImpact: ActiveOrHistoricCurrencyAndAmount;
  status: 'DRAFT' | 'PENDING_INTERNAL_APPROVAL' | 'SUBMITTED' | 'REJECTED';
  submissionReceiptId?: string;
  submittedAt?: string;
}

export interface ComplianceOracleState {
  screeningRulesCount: number;
  activeAmlRules: AmlTransactionMonitoringRule[];
  pendingAlerts: AmlAlert[];
  recentSarFilings: SarFiling[];
  lastAuditTimestamp: string;
}

/**
 * ==============================================================================
 * SECTION 34: GLOBAL SSI HUB, DECENTRALIZED IDENTIFIERS (DIDs) & VERIFIABLE CREDENTIALS
 * ==============================================================================
 * Types governing W3C Decentralized Identifiers (DIDs), Verifiable Credentials (VCs),
 * Verifiable Presentations (VPs), and zero-knowledge credential proofs.
 */

export interface DidVerificationMethod {
  id: string;
  type: 'Ed25519VerificationKey2020' | 'JsonWebKey2020' | 'X25519KeyAgreementKey2020';
  controller: string;
  publicKeyJwk?: Record<string, any>;
  publicKeyMultibase?: string;
}

export interface DidDocument {
  context: string[];
  id: string; // e.g., "did:ion:1234..." or "did:key:z6M..."
  verificationMethod: DidVerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement?: string[];
  service?: {
    id: string;
    type: string;
    serviceEndpoint: string;
  }[];
}

export interface CredentialSubject {
  id: string; // The DID of the subject
  [key: string]: any; // Arbitrary claims (e.g., ageOver21: true, kycStatus: "PASSED")
}

export interface VerifiableCredential {
  context: string[];
  id: string;
  type: string[];
  issuer: string; // DID of the issuer
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    jws: string;
  };
}

export interface VerifiablePresentation {
  context: string[];
  id: string;
  type: string[];
  verifiableCredential: VerifiableCredential[];
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    challenge: string;
    domain: string;
    jws: string;
  };
}

export interface PresentationDefinition {
  id: string;
  input_descriptors: {
    id: string;
    purpose?: string;
    schema: {
      uri: string;
    }[];
    constraints?: {
      fields?: {
        path: string[];
        filter?: Record<string, any>;
      }[];
    };
  }[];
}

export interface ZkCredentialProof {
  proofId: string;
  provingSystem: 'Groth16' | 'Plonk';
  circuitIdentifier: string;
  publicInputs: {
    credentialSchemaUri: string;
    issuerDid: string;
    revealedClaims: Record<string, any>;
  };
  proofBytes: string; // Base64 encoded zk-SNARK proof
}

export interface SsiHubState {
  userDidDocument: DidDocument | null;
  issuedCredentials: VerifiableCredential[];
  receivedPresentations: VerifiablePresentation[];
  activePresentationDefinitions: PresentationDefinition[];
  isSyncing: boolean;
}

/**
 * ==============================================================================
 * SECTION 35: DEVELOPER HUB, API PLAYGROUND & INTERACTIVE SCHEMA EXPLORER
 * ==============================================================================
 * Types governing developer portal configurations, API key management,
 * interactive API playground requests/responses, and schema node trees.
 */

export interface RateLimitPolicy {
  policyId: string;
  tierName: 'SANDBOX' | 'STANDARD' | 'ENTERPRISE' | 'UNLIMITED';
  requestsPerSecond: number;
  requestsPerMonth: number;
  burstCapacity: number;
}

export interface DeveloperHubConfig {
  developerId: string;
  organizationName: string;
  apiKeys: APIKey[];
  activeRateLimitPolicy: RateLimitPolicy;
  webhookEndpoints: {
    endpointId: string;
    url: string;
    description?: string;
    secretKey: string;
    subscribedEvents: string[];
    isActive: boolean;
  }[];
}

export interface ApiPlaygroundRequest {
  requestId: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  bodyPayload?: string; // JSON string
  timestamp: string;
}

export interface ApiPlaygroundResponse {
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
  bodyPayload: string; // JSON string
  responseTimeMs: number;
  timestamp: string;
}

export interface SchemaNode {
  nodeId: string;
  name: string;
  type: 'OBJECT' | 'ARRAY' | 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ENUM' | 'REF';
  description: string;
  isRequired: boolean;
  children?: SchemaNode[];
  enumOptions?: string[];
  refSchemaId?: string;
}

export interface InteractiveExecutionLog {
  logId: string;
  timestamp: string;
  eventType: 'API_CALL' | 'WEBHOOK_SENT' | 'RATE_LIMIT_EXCEEDED' | 'SIGNATURE_VERIFICATION_FAILED';
  message: string;
  metadata?: Record<string, any>;
}

export interface DeveloperHubState {
  config: DeveloperHubConfig;
  playgroundHistory: {
    request: ApiPlaygroundRequest;
    response: ApiPlaygroundResponse;
  }[];
  schemaTree: Record<string, SchemaNode>;
  executionLogs: InteractiveExecutionLog[];
}import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}
/**
 * ==============================================================================
 * SECTION 3: EXECUTIVE MAGAZINE & MULTIMEDIA CREATION TYPES
 * ==============================================================================
 * Types governing the generation, layout, rendering, and narration of high-end
 * digital publications, executive lookbooks, and AI-driven multimedia assets.
 */

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
  'Wall Street Boardroom',
  'Silicon Valley Tech Campus',
  'Dubai Skyscraper Penthouse',
  'Paris Fashion Week Front Row',
  'Private Island Villa',
  'Luxury Private Jet',
  'Monaco Yacht Deck',
  'Swiss Alps Davos Summit'
];

export const STYLES = [
  'Power Suit (Classic Bespoke)',
  'Tech Mogul (Minimalist Luxury)',
  'Black Tie Gala (Formal)',
  'Avant-Garde Executive (Bold)',
  'Old Money (Quiet Luxury)',
  'Streetwear CEO (High-End Casual)'
];

export type RenderingEngine = 'stable-diffusion' | 'midjourney' | 'dall-e-3' | 'flux' | 'imagen' | 'custom-gan';

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
  lighting?: string;
  cameraAngle?: string;
  colorPalette?: string[];
  historicalReference?: string;
  brandTags?: string[];
}

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  videoUrl?: string;
  isAnimating?: boolean;
  audioUrl?: string;
  narrationText?: string;
  renderingEngine?: RenderingEngine;
  promptUsed?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  seed?: number;
  cfgScale?: number;
  steps?: number;
  generationTimeMs?: number;
  error?: string;
}

export interface Asset {
  id: string;
  base64: string;
  desc: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  body: string;
  elements: VisualElement[];
}

export interface VisualElement {
  id: string;
  type: 'image' | 'seal' | 'divider' | 'illustration' | 'scenery';
  src: string;
  position: { x: number; y: number };
  alt: string;
  isAnimated?: boolean;
  scale?: number;
  rotation?: number;
}

export enum AIServiceAction {
  REWRITE = 'REWRITE',
  ILLUMINATE = 'ILLUMINATE',
  PROPHESY = 'PROPHESY',
  SEAL = 'SEAL',
  CIPHER = 'CIPHER',
  SCENERY = 'SCENERY',
  ENCHANT = 'ENCHANT'
}

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Ariel' | 'Oberon' | 'Titania';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  sampleRateHz?: number;
  languageCode?: string;
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
  audioUrl?: string;
  durationMs?: number;
  characterCount: number;
}

/**
 * ==============================================================================
 * SECTION 4: NEWS, FEEDS & SENTIMENT ANALYSIS TYPES
 * ==============================================================================
 * Structures governing real-time financial news aggregation, sentiment analysis,
 * urgency scoring, and AI-driven market insights.
 */

export enum StaticCategory {
  TOP_STORIES = 'Global Pulse',
  POLITICS = 'Governance',
  TECH = 'Infrastructure',
  FINANCE = 'Markets',
  CRYPTO = 'Decentralized Ledger',
  ENERGY = 'Thermodynamics',
  BIOTECH = 'Genomics',
  SPACE = 'Orbital Mechanics'
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: number; // Scale of 1-10
  tags: string[];
  author?: string;
  content?: string;
  imageUrl?: string;
  sentimentScore?: number; // Continuous value from -1.0 to 1.0
  relevanceScore?: number; // Continuous value from 0.0 to 1.0
  language?: string;
  isFactChecked?: boolean;
  factCheckDetails?: string;
  biasRating?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  relatedTickers?: string[];
}

export interface FeedPage {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  lastUpdated: string;
  aiInsights: string;
  curatorId?: string;
  isPublic: boolean;
  subscriberCount?: number;
  customFilterCriteria?: FilterCriterion[];
}

/**
 * ==============================================================================
 * SECTION 5: FILE SYSTEM, STORAGE & CLOUD MANAGEMENT TYPES
 * ==============================================================================
 * Types governing local and cloud file systems, indexing, AI-assisted summaries,
 * and multi-source repository exploration.
 */

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  GENERIC = 'generic',
  CODE = 'code',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  DATABASE = 'database',
  MODEL_3D = 'model_3d'
}

export type FileSource = 'local' | 'github' | 'ai' | 'google-drive' | 'aws-s3' | 'ipfs' | 'dropbox';

export interface FileVersion {
  versionId: string;
  modifiedBy: string;
  modifiedAt: string;
  size: number;
  changeLog?: string;
  downloadUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string | null;
  source: FileSource;
  extension?: string;
  mimeType?: string;
  content?: string; // Text, DataURL, or Download URL
  aiSummary?: string;
  aiKeywords?: string[];
  isIndexing?: boolean;
  githubRepo?: string;
  githubOwner?: string;
  githubUrl?: string;
  driveFileId?: string;
  isCloudFolder?: boolean;
  ownerId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  versionHistory?: FileVersion[];
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  hash?: string;
  tags?: string[];
}

export interface NavigationState {
  currentPath: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid' | 'gallery' | 'tree' | 'kanban';
  sortBy: 'name' | 'size' | 'lastModified' | 'type';
  sortDirection: 'asc' | 'desc';
  searchQuery?: string;
  filterType?: FileType | 'all';
}

/**
 * ==============================================================================
 * SECTION 6: CORE BANKING, TRANSACTIONS & CAPITAL ALLOCATION TYPES
 * ==============================================================================
 * Foundational types for personal and corporate banking, ledger accounts,
 * transaction processing, and AI-driven financial planning.
 */

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'fedwire' | 'rtp';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'credit' | 'debit';

export type TransactionStatus =
  | 'POSTED'
  | 'PENDING'
  | 'Initiated'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'needs_approval'
  | 'approved'
  | 'denied'
  | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string | string[];
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: KeyValuePairs;
  pending?: boolean;
  reconciled?: boolean;
  reconciliation_id?: string;
  nexus_link_id?: string;
  institution_origin?: string;
  cardId?: string;
  holderName?: string;
  merchant?: string;
  status?: TransactionStatus;
  timestamp?: string;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string;
  assetClass?: string;
  riskLevel?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining?: number;
  category?: string;
  alerts?: Alert[];
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
  credits: number;
}

export interface AIPlanStep {
  title: string;
  description: string;
  timeline: string;
  category?: string;
}

export interface AIPlan {
  title: string;
  summary: string;
  steps: AIPlanStep[];
}

export type IllusionType = 'none' | 'aurora' | 'blue' | 'dark';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  institutionId?: string;
  type?: string;
  balance?: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: string;
}

export enum WeaverStage {
  Pitch = 'pitch',
  Analysis = 'analysis',
  Test = 'test',
  FinalReview = 'final_review',
  Approved = 'approved',
  Results = 'results',
  Error = 'error'
}

export interface QuantumWeaverState {
  stage: WeaverStage;
  businessPlan: string;
  feedback: string;
  questions: AIQuestion[];
  loanAmount: number;
  coachingPlan: AIPlan | null;
  error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  aiJustification?: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress?: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCardControls {
  atm: boolean;
  contactless: boolean;
  online: boolean;
  monthlyLimit: number;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: CorporateCardControls;
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description?: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Counterparty {
  id: string;
  name: string;
  email?: string | null;
  send_remittance_advice?: boolean;
  type?: 'business' | 'individual';
  riskLevel?: 'Low' | 'Medium' | 'High';
  createdDate?: string;
  accounts: ExternalAccount[];
  virtualAccounts: VirtualAccount[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name?: string;
  verification_status?: string;
  account_details?: any[];
  routing_details?: any[];
}

export interface VirtualAccount {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  balance?: number;
  currency?: string;
  status?: string;
  subAccounts?: VirtualAccount[];
  description?: string;
  counterparty_id?: string;
  internal_account_id?: string;
  debit_ledger_account_id?: string;
  credit_ledger_account_id?: string;
  metadata?: any;
  account_details?: any[];
  routing_details?: any[];
}

export interface AIGoalPlanStep {
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Investing' | 'Income' | string;
}

export interface AIGoalPlan {
  feasibilitySummary: string;
  monthlyContribution: number;
  steps: AIGoalPlanStep[];
  actionableSteps?: string[];
  summary?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'recurring';
}

export interface RecurringContribution {
  id: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface LinkedGoal {
  id: string;
  relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
  triggerAmount?: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  iconName: string;
  plan: AIGoalPlan | null;
  startDate: string;
  riskProfile?: RiskProfile;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  linkedGoals: LinkedGoal[];
  recurringContributions: RecurringContribution[];
  contributions: Contribution[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number; // in reward points
  type: 'cashback' | 'giftcard' | 'impact' | string;
  description: string;
  iconName: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini' | string;

export interface APIStatus {
  provider: APIProvider;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number; // in ms
}

export interface CreditFactor {
  name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix' | string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}
/**
 * ==============================================================================
 * SECTION 7: PLAID, MARQETA, MODERN TREASURY & OPEN BANKING INTEGRATION TYPES
 * ==============================================================================
 * Enterprise-grade types governing secure connections, credential management,
 * card issuance, ledgering, and multi-node financial mesh protocols.
 */

export interface PlaidCredentials {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

export interface MarqetaCredentials {
  app_token?: string;
  admin_token?: string;
  applicationToken?: string;
  adminAccessToken?: string;
  base_url?: string;
}

export interface ModernTreasuryCredentials {
  apiKey: string;
  orgId?: string;
  organizationId?: string;
}

export interface PlaidTokenState {
  linkToken: string | null;
  publicToken: string | null;
  accessToken: string | null;
}

export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: AccountBalance;
  institution?: string;
}

export interface ConnectedItem {
  institutionId: string;
  institutionName: string;
  accessToken: string;
  itemId: string;
  accounts: Account[];
  transactions: Transaction[];
  metadata: {
    linked_at: string;
    node_priority: number;
    mesh_protocol: 'NEXUS-V3' | string;
    routing_hops: string[];
  };
}

export interface UCCFiling {
  id: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Filed' | 'Rejected';
  receiptId?: string;
  fileNumber?: string;
  packetNum: string;
  transType: 'Initial' | 'Amendment';
  amount: number;
  dateCreated: string;
  xmlPayload: string;
  errors?: string[];
}

export interface UnifiedPayload {
  timestamp: string;
  nexus_version: string;
  nexus_id: string;
  global_metadata: {
    client_context: string;
    reconciliation_depth: number;
    combined_hash: string;
  };
  mesh_stats: {
    total_liquidity: number;
    total_liabilities: number;
    net_position: number;
    active_institutions: number;
  };
  cross_institutional_ledger: {
    items: ConnectedItem[];
    reconciled_pairs: any[];
  };
  compliance: {
    active_ucc_filings: UCCFiling[];
  };
}

export enum FlowStep {
  CREDENTIALS = 'CREDENTIALS',
  LINK_TOKEN = 'LINK_TOKEN',
  LINK_UI = 'LINK_UI',
  EXCHANGE = 'EXCHANGE',
  DASHBOARD = 'DASHBOARD',
  UCC_CENTER = 'UCC_CENTER',
  MARQETA_NODE = 'MARQETA_NODE',
  MODERN_TREASURY_NODE = 'MODERN_TREASURY_NODE',
  TAXONOMY_REGISTRY = 'TAXONOMY_REGISTRY'
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  created_time?: string;
  start_date?: string;
  config: any;
}

export interface MarqetaCard {
  token: string;
  user_token: string;
  card_product_token: string;
  last_four: string;
  pan: string;
  expiration: string;
  cvv: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | string;
}

export interface MTLedger {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, string>;
}

export interface MTInternalAccount {
  id: string;
  name: string;
  currency: string;
  connection: { vendor_name: string };
  status: string;
}

export interface PlaidLinkSuccessMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id?: string;
}

export type PlaidProduct =
  | 'assets'
  | 'auth'
  | 'balance'
  | 'identity'
  | 'investments'
  | 'liabilities'
  | 'payment_initiation'
  | 'transactions';

export interface MarqetaUser {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  last_modified_time: string;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns?: string;
  };
  provider?: any;
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface LedgerAccount {
  id: string;
  name: string;
  balances: {
    available_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
    posted_balance: { amount: number; currency: string };
  };
}

export interface SettlementInstruction {
  messageId: string;
  creationDateTime: string;
  numberOfTransactions: number;
  settlementDate: string;
  totalAmount: number;
  currency: string;
  purpose?: string;
}

/**
 * ==============================================================================
 * SECTION 8: ENTERPRISE OPERATIONS, CORPORATE COMMAND, COMPLIANCE & ISO 20022
 * ==============================================================================
 * Types governing corporate command centers, compliance audits, anomaly detection,
 * cash flow forecasting, and ISO 20022 financial messaging standards.
 */

export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore?: number;
  recommendedAction?: string;
}

export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

export interface FraudRule {
  id: string;
  name: string;
  description?: string;
  severity: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
}

export interface ComplianceCase {
  id: string;
  reason: string;
  entityType: string;
  entityId: string;
  status: 'open' | 'closed' | 'investigating' | string;
  openedDate: string;
  type?: string;
  description?: string;
}

export interface FinancialAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: AnomalyStatus;
  entityType: string;
  entityId: string;
  entityDescription: string;
  timestamp: string;
  riskScore: number;
}

export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'False Positive';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  action: 'flag_for_review' | 'block' | 'notify_admin' | string;
  active: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  revenue: number;
  growth: number;
  riskScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetResource: string;
  success: boolean;
  details?: string;
  metadata?: any;
  ipAddress?: string;
}

export interface ThreatAlert {
  alertId: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataSharingPolicy {
  policyId: string;
  policyName: string;
  scope: string;
  isActive: boolean;
  lastReviewed: string;
}

export interface APIKey {
  id: string;
  keyName: string;
  creationDate: string;
  scopes: string[];
  lastUsed?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  verified: boolean;
}

export interface SecurityAwarenessModule {
  moduleId: string;
  title: string;
  completionRate: number;
}

export interface TransactionRule {
  ruleId: string;
  name: string;
  triggerCondition: string;
  action: string;
  isEnabled: boolean;
}

export interface SecurityScoreMetric {
  metricName: string;
  currentValue: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  lastActivity: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  permissions: string[];
  status: string;
  firstSeen: string;
  userAgent: string;
  pushNotificationsEnabled: boolean;
  biometricAuthEnabled: boolean;
  encryptionStatus: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  timestamp: string;
  isCurrent: boolean;
  userAgent: string;
}

export interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password?: string;
  databaseName: string;
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full';
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface WebDriverStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  activeTask: string | null;
  logs: string[];
}

export interface ExternalCorporateActionEventType1Code {}
export interface ExternalAcceptedReason1Code {}
export interface ExternalAccountIdentification1Code {}
export interface ExternalAgentInstruction1Code {}
export interface ExternalAgreementType1Code {}
export interface ExternalAuthenticationChannel1Code {}
export interface ExternalAuthenticationMethod1Code {}
export interface ExternalAuthorityExchangeReason1Code {}
export interface ExternalAuthorityIdentification1Code {}
export interface ExternalBalanceSubType1Code {}
export interface ExternalBalanceType1Code {}
export interface ExternalBankTransactionDomain1Code {}
export interface ExternalBankTransactionFamily1Code {}
export interface ExternalBankTransactionSubFamily1Code {}
export interface ExternalBenchmarkCurveName1Code {}
export interface ExternalBillingBalanceType1Code {}
export interface ExternalBillingCompensationType1Code {}
export interface ExternalBillingRateIdentification1Code {}
export interface ExternalCalculationAgent1Code {}
export interface ExternalCancellationReason1Code {}
export interface ExternalCardTransactionCategory1Code {}
export interface ExternalCashAccountType1Code {}
export interface ExternalCashClearingSystem1Code {}
export interface ExternalCategoryPurpose1Code {}
export interface ExternalChannel1Code {}
export interface ExternalChargeType1Code {}
export interface ExternalChequeAgentInstruction1Code {}
export interface ExternalChequeCancellationReason1Code {}
export interface ExternalChequeCancellationStatus1Code {}
export interface ExternalClaimNonReceiptRejection1Code {}
export interface ExternalClearingSystemIdentification1Code {}
export interface ExternalCollateralReferenceDataStatusReason1Code {}
export interface ExternalCommunicationFormat1Code {}
export interface ExternalContractBalanceType1Code {}
export interface ExternalContractClosureReason1Code {}
export interface ExternalCreditLineType1Code {}
export interface ExternalCreditorAgentInstruction1Code {}
export interface ExternalCreditorEnrolmentAmendmentReason1Code {}
export interface ExternalCreditorEnrolmentCancellationReason1Code {}
export interface ExternalCreditorEnrolmentStatusReason1Code {}
export interface ExternalCreditorReferenceType1Code {}
export interface ExternalDateFrequency1Code {}
export interface ExternalDateType1Code {}
export interface ExternalDebtorActivationAmendmentReason1Code {}
export interface ExternalDebtorActivationCancellationReason1Code {}
export interface ExternalDebtorActivationStatusReason1Code {}
export interface ExternalDebtorAgentInstruction1Code {}
export interface ExternalDeviceOperatingSystemType1Code {}
export interface ExternalDiscountAmountType1Code {}
export interface ExternalDocumentAmountType1Code {}
export interface ExternalDocumentFormat1Code {}
export interface ExternalDocumentLineType1Code {}
export interface ExternalDocumentPurpose1Code {}
export interface ExternalDocumentType1Code {}
export interface ExternalEffectiveDateParameter1Code {}
export interface ExternalEmissionAllowanceSubProductType1Code {}
export interface ExternalEncryptedElementIdentification1Code {}
export interface ExternalEnquiryRequestType1Code {}
export interface ExternalEntitySize1Code {}
export interface ExternalEntityType1Code {}
export interface ExternalEntryStatus1Code {}
export interface ExternalFinancialInstitutionIdentification1Code {}
export interface ExternalFinancialInstrumentIdentificationType1Code {}
export interface ExternalFinancialInstrumentProductType1Code {}
export interface ExternalGarnishmentType1Code {}
export interface ExternalIncoterms1Code {}
export interface ExternalIndustrySectorClassification1Code {}
export interface ExternalInformationType1Code {}
export interface ExternalInstructedAgentInstruction1Code {}
export interface ExternalInvestigationAction1Code {}
export interface ExternalInvestigationActionReason1Code {}
export interface ExternalInvestigationExecutionConfirmation1Code {}
export interface ExternalInvestigationInstrument1Code {}
export interface ExternalInvestigationReason1Code {}
export interface ExternalInvestigationReasonSubType1Code {}
export interface ExternalInvestigationServiceLevel1Code {}
export interface ExternalInvestigationStatus1Code {}
export interface ExternalInvestigationStatusReason1Code {}
export interface ExternalInvestigationSubType1Code {}
export interface ExternalInvestigationType1Code {}
export interface ExternalLegalFramework1Code {}
export interface ExternalLetterType1Code {}
export interface ExternalLocalInstrument1Code {}
export interface ExternalMandateReason1Code {}
export interface ExternalMandateSetupReason1Code {}
export interface ExternalMandateStatus1Code {}
export interface ExternalMandateSuspensionReason1Code {}
export interface ExternalMarketArea1Code {}
export interface ExternalMarketInfrastructure1Code {}
export interface ExternalMessageFunction1Code {}
export interface ExternalModelFormIdentification1Code {}
export interface ExternalNarrativeType1Code {}
export interface ExternalNotificationCancellationReason1Code {}
export interface ExternalNotificationSubType1Code {}
export interface ExternalNotificationType1Code {}
export interface ExternalOrganisationIdentification1Code {}
export interface ExternalPackagingType1Code {}
export interface ExternalPartyRelationshipType1Code {}
export interface ExternalPaymentCancellationRejection1Code {}
export interface ExternalPaymentCompensationReason1Code {}
export interface ExternalPaymentControlRequestType1Code {}
export interface ExternalPaymentGroupStatus1Code {}
export interface ExternalPaymentModificationRejection1Code {}
export interface ExternalPaymentRole1Code {}
export interface ExternalPaymentScenario1Code {}
export interface ExternalPaymentTransactionStatus1Code {}
export interface ExternalPendingProcessingReason1Code {}
export interface ExternalPersonIdentification1Code {}
export interface ExternalPostTradeEventType1Code {}
export interface ExternalProductType1Code {}
export interface ExternalProxyAccountType1Code {}
export interface ExternalPurpose1Code {}
export interface ExternalRatesAndTenors1Code {}
export interface ExternalReRepresentmentReason1Code {}
export interface ExternalReceivedReason1Code {}
export interface ExternalRegulatoryInformationType1Code {}
export interface ExternalRejectedReason1Code {}
export interface ExternalRelativeTo1Code {}
export interface ExternalReportingSource1Code {}
export interface ExternalRequestStatus1Code {}
export interface ExternalReservationType1Code {}
export interface ExternalReturnReason1Code {}
export interface ExternalReversalReason1Code {}
export interface ExternalSecuritiesLendingType1Code {}
export interface ExternalSecuritiesPurpose1Code {}
export interface ExternalSecuritiesUpdateReason1Code {}
export interface ExternalServiceLevel1Code {}
export interface ExternalShipmentCondition1Code {}
export interface ExternalStatusReason1Code {}
export interface ExternalSystemBalanceType1Code {}
export interface ExternalSystemErrorHandling1Code {}
export interface ExternalSystemEventType1Code {}
export interface ExternalSystemMemberType1Code {}
export interface ExternalSystemPartyType1Code {}
export interface ExternalTaxAmountType1Code {}
export interface ExternalTechnicalInputChannel1Code {}
export interface ExternalTradeMarket1Code {}
export interface ExternalTradeTransactionCondition1Code {}
export interface ExternalTypeOfParty1Code {}
export interface ExternalUnableToApplyIncorrectData1Code {}
export interface ExternalUnableToApplyMissingData1Code {}
export interface ExternalUnderlyingTradeTransactionType1Code {}
export interface ExternalUndertakingAmountType1Code {}
export interface ExternalUndertakingDocumentType1Code {}
export interface ExternalUndertakingDocumentType2Code {}
export interface ExternalUndertakingStatusCategory1Code {}
export interface ExternalUndertakingType1Code {}
export interface ExternalUnitOfMeasure1Code {}
export interface ExternalValidationRuleIdentification1Code {}
export interface ExternalVerificationReason1Code {}
export interface Biso20022 {}
/**
 * ==============================================================================
 * SECTION 9: SOVEREIGN IDENTITY, USER PROFILES & SOCIAL GRAPH TYPES
 * ==============================================================================
 * Enterprise-grade identity structures, multi-role authorization matrices,
 * neural-lace telemetry, genomic anchors, and decentralized social graph nodes.
 */

export enum View {
  // --- Core ---
  Dashboard = 'dashboard',
  
  // --- Personal Command ---
  Transactions = 'transactions',
  SendMoney = 'send-money',
  Budgets = 'capital-allocation', // Renamed for spec
  FinancialGoals = 'strategic-goals',
  CreditHealth = 'credit-resonance',
  Personalization = 'interface-will',
  Accounts = 'accounts-overview',
  
  // --- Sovereign Wealth ---
  Investments = 'portfolio-overview',
  Crypto = 'web3-crypto',
  CryptoWeb3 = 'web3-crypto', // Added alias
  AlgoTradingLab = 'algo-trading-lab',
  ForexArena = 'forex-arena',
  CommoditiesExchange = 'commodities',
  RealEstateEmpire = 'real-estate',
  ArtCollectibles = 'art-collectibles',
  DerivativesDesk = 'derivatives',
  VentureCapital = 'venture-capital',
  PrivateEquity = 'private-equity',
  TaxOptimization = 'tax-optimization',
  LegacyBuilder = 'legacy-architect',
  SovereignWealth = 'sovereign-wealth-sim',
  QuantumAssets = 'quantum-assets',
  
  // --- Citi Connect Core ---
  CitibankAccounts = 'citi-accounts',
  CitibankAccountProxy = 'citi-account-proxy',
  CitibankBillPay = 'citi-bill-payment',
  CitibankCrossBorder = 'citi-cross-border',
  CitibankPayeeManagement = 'citi-payee-mgmt',
  CitibankStandingInstructions = 'citi-standing-instructions',
  CitibankDeveloperTools = 'citi-dev-tools',
  CitibankEligibility = 'citi-eligibility-check',
  CitibankUnmaskedData = 'citi-secure-data-view',

  // --- Plaid Nexus ---
  PlaidMainDashboard = 'plaid-overview',
  DataNetwork = 'plaid-overview', // Added alias
  PlaidIdentity = 'plaid-identity-verification',
  PlaidCRAMonitoring = 'plaid-cra-monitoring',
  PlaidInstitutions = 'plaid-institutions-explorer',
  PlaidItemManagement = 'plaid-item-management',
  
  // --- Enterprise Operations ---
  CorporateCommand = 'corporate-command',
  ModernTreasury = 'modern-treasury',
  Treasury = 'treasury-capital',
  CardPrograms = 'marqeta-cards',
  Payments = 'stripe-payments',
  StripeNexus = 'stripe-nexus',
  CounterpartyDashboard = 'counterparties',
  VirtualAccounts = 'virtual-accounts',
  CorporateActions = 'corporate-actions',
  CreditNoteLedger = 'credit-notes',
  ReconciliationHub = 'reconciliation-hub',
  GEINDashboard = 'gein-dashboard',
  CardholderManagement = 'cardholder-mgmt',
  VentureCapitalDeskView = 'vc-desk-view',

  // --- System & Intelligence ---
  AIAdvisor = 'ai-advisor',
  AIInsights = 'predictive-insights',
  QuantumWeaver = 'quantum-weaver',
  AgentMarketplace = 'agent-marketplace',
  AIAdStudio = 'ai-ad-studio',
  GlobalPositionMap = 'global-position-map',
  GlobalSsiHub = 'global-ssi-hub',
  SecurityCompliance = 'security-compliance',
  DeveloperHub = 'developer-hub',
  SchemaExplorer = 'iso-20022-explorer',
  ResourceGraph = 'resource-graph',
  TheVision = 'the-vision',
  ApiPlayground = 'api-playground',
  ComplianceOracle = 'compliance-oracle',

  // --- Admin & Tools ---
  CustomerDashboard = 'customer-dashboard',
  VerificationReports = 'verification-reports',
  FinancialReporting = 'financial-reporting',
  StripeNexusDashboard = 'stripe-nexus-admin',

  // --- Components (Direct Access) ---
  AccountDetails = 'account-details',
  AccountList = 'account-list',
  AccountStatementGrid = 'account-statement-grid',
  AccountsView = 'accounts-view',
  AccountVerificationModal = 'account-verification-modal',
  ACHDetailsDisplay = 'ach-details-display',
  AICommandLog = 'ai-command-log',
  AIPredictionWidget = 'ai-prediction-widget',
  AssetCatalog = 'asset-catalog',
  AutomatedSweepRules = 'automated-sweep-rules',
  BalanceReportChart = 'balance-report-chart',
  BalanceTransactionTable = 'balance-transaction-table',
  CardDesignVisualizer = 'card-design-visualizer',
  ChargeDetailModal = 'charge-detail-modal',
  ChargeList = 'charge-list',
  ConductorConfigurationView = 'conductor-configuration-view',
  CounterpartyDetails = 'counterparty-details',
  CounterpartyForm = 'counterparty-form',
  DisruptionIndexMeter = 'disruption-index-meter',
  DocumentUploader = 'document-uploader',
  DownloadLink = 'download-link',
  EarlyFraudWarningFeed = 'early-fraud-warning-feed',
  ElectionChoiceForm = 'election-choice-form',
  EventNotificationCard = 'event-notification-card',
  ExpectedPaymentsTable = 'expected-payments-table',
  ExternalAccountCard = 'external-account-card',
  ExternalAccountForm = 'external-account-form',
  ExternalAccountsTable = 'external-accounts-table',
  FinancialAccountCard = 'financial-account-card',
  IncomingPaymentDetailList = 'incoming-payment-detail-list',
  InvoiceFinancingRequest = 'invoice-financing-request',
  PaymentInitiationForm = 'payment-initiation-form',
  PaymentMethodDetails = 'payment-method-details',
  PaymentOrderForm = 'payment-order-form',
  PayoutsDashboard = 'payouts-dashboard',
  PnLChart = 'pnl-chart',
  RefundForm = 'refund-form',
  RemittanceInfoEditor = 'remittance-info-editor',
  ReportingView = 'reporting-view',
  ReportRunGenerator = 'report-run-generator',
  ReportStatusIndicator = 'report-status-indicator',
  SsiEditorForm = 'ssi-editor-form',
  StripeNexusView = 'stripe-nexus-view',
  StripeStatusBadge = 'stripe-status-badge',
  StructuredPurposeInput = 'structured-purpose-input',
  SubscriptionList = 'subscription-list',
  TimeSeriesChart = 'time-series-chart',
  TradeConfirmationModal = 'trade-confirmation-modal',
  TransactionFilter = 'transaction-filter',
  TransactionList = 'transaction-list',
  TreasuryTransactionList = 'treasury-transaction-list',
  UniversalObjectInspector = 'universal-object-inspector',
  VirtualAccountForm = 'virtual-account-form',
  VirtualAccountsTable = 'virtual-accounts-table',
  VoiceControl = 'voice-control',
  WebhookSimulator = 'webhook-simulator',

  // Educational & 527 Views
  TheBook = 'the-book',
  KnowledgeBase = 'knowledge-base',
  
  // Auth & Settings
  Settings = 'settings',
  SSO = 'sso',
  ConciergeService = 'concierge-service',
  Philanthropy = 'philanthropy',
  OpenBanking = 'open-banking',
  FinancialDemocracy = 'financial-democracy',
  APIStatus = 'api-status',
  APIIntegration = 'api-integration',
  APIConsole = 'api-console',
  SecurityCenter = 'security-center',
  Security = 'security',
  AIStrategy = 'ai-strategy',
  Goals = 'financial-goals',
  Rewards = 'rewards',
  CardCustomization = 'card-customization',
}

export type UserRole =
  | 'ADMIN'
  | 'TRADER'
  | 'CLIENT'
  | 'VISIONARY'
  | 'CARETAKER'
  | 'QUANT_ANALYST'
  | 'SYSTEM_ARCHITECT'
  | 'ETHICS_OFFICER'
  | 'DATA_SCIENTIST'
  | 'NETWORK_WEAVER'
  | 'CITIZEN'
  | 'FOUNDER'
  | 'INVESTOR'
  | 'MANAGER';

export type SecurityLevel =
  | 'STANDARD'
  | 'ELEVATED'
  | 'TRADING_UNLOCKED'
  | 'QUANTUM_ENCRYPTED'
  | 'SOVEREIGN_CLEARED'
  | 'ARCHITECT_LEVEL';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles?: UserRole[];
  securityLevel?: SecurityLevel;
  netWorth?: number;
  display_name?: string;
  handle?: string;
  role?: string;
  businessId?: string;
  profilePictureUrl?: string;
  bio?: string;
  profile?: {
    interests: string[];
    skills: string[];
    [key: string]: any;
  };
  wallet?: {
    balance: number;
    currency: string;
  };
  businesses?: string[];
  memberships?: any[];
  followers?: string[];
  following?: string[];
  state?: {
    mood: string;
    activity: string;
    last_active_tick: number;
    [key: string]: any;
  };
  isAdmin?: boolean;
  title?: string;
  phone?: string;
  loyaltyTier?: string;
  usdBalance?: number;
  fiatBalance?: number;
  cryptoBalance?: number;
  avatarUrl?: string;
  tradingProfile?: any;
  biometricHashV2?: string;
  genomicSignatureId?: string;
  citizenship?: string;
  reputationScore?: number;
  threatVectorIndex?: number;
  neuralLaceSyncStatus?: string;
  cognitiveProfileId?: string;
  activeThoughtStreamId?: string | null;
  lastLoginCoordinates?: GeoCoordinate;
  temporalAnchorId?: string;
  activeSovereignAgentIds?: string[];
  permissionsGridHash?: string;
}

export type UserProfile = User;

export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  text: string;
  timestamp: string;
}

export interface PostContent {
  text: string;
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  financialData?: any;
}

export interface Post {
  id: string;
  author_id: string;
  userName: string;
  userProfilePic: string;
  created_tick: number;
  content: PostContent;
  type: 'text' | 'image' | 'video' | 'link' | 'financial_event';
  tags: string[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  visibility: 'public' | 'connections' | 'private';
  comments: Comment[];
}

export interface LendingPoolStats {
  totalCapital: number;
  interestRate: number;
  activeLoans: number;
  defaultRate: number;
  totalInterestEarned: number;
}

export interface AppIntegration {
  id: string;
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'disconnected' | 'issue';
}

export interface BiometricData {
  id: string;
  type: string;
  publicKey: string;
  enrolledDate: string;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  device?: string;
  browser?: string;
  os?: string;
  location?: string;
  isCurrent?: boolean;
  userAgent?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  specialization: string;
  traffic: number;
}

export interface SynapticVault {
  id: string;
  ownerIds: string[];
  ownerNames: string[];
  status: string;
  masterPrivateKeyFragment: string;
  creationDate: string;
}

export interface EcosystemKPIs {
  currentDate: string;
  totalEcosystemValue: number;
  totalTransactions: number;
  communityPoolCapital: number;
  activeUsers: number;
  gdp: number;
}

export interface SimulationEvent {
  id: string;
  tick: number;
  type: string;
  description: string;
  impact: any;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: 'service' | 'retail' | 'tech' | 'manufacturing' | 'finance' | 'platform';
  monthly_revenue: number;
  expenses: number;
  employees: string[];
  status: 'active' | 'bankrupt' | 'acquired';
  marketing_factor: number; // 0-1 multiplier
  businessPlan?: string;
  valuation?: number;
  cashBalance?: number;
  hqLocation?: string;
}

/**
 * ==============================================================================
 * SECTION 10: QUANTUM WEALTH, ALGORITHMIC TRADING & ALTERNATIVE ASSETS
 * ==============================================================================
 * Advanced structures for fractional real estate, fine art tokenization,
 * algorithmic trading strategies, venture capital startups, and Stripe ledger balances.
 */

export interface RealEstateProperty {
  id: string;
  address: string;
  value: number;
  rentalIncome: number;
  occupancyRate?: number;
  tokenizedShares?: number;
  yieldYTD?: number;
}

export interface ArtPiece {
  id: string;
  name: string;
  artist: string;
  value: number;
  year: number;
  medium?: string;
  provenance?: string[];
  fractionalOwnershipEnabled?: boolean;
}

export interface AlgoStrategy {
  id: string;
  name: string;
  performance: number;
  risk: 'Low' | 'Medium' | 'High';
  active: boolean;
  sharpeRatio?: number;
  maxDrawdown?: number;
  allocationPercentage?: number;
}

export interface VentureStartup {
  id: string;
  name: string;
  valuation: number;
  investment: number;
  equity: number;
  fundingRound?: 'Seed' | 'SeriesA' | 'SeriesB' | 'SeriesC' | 'Growth';
  burnRate?: number;
  runwayMonths?: number;
}

export interface StripeBalance {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
}

export interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number;
  description: string;
  customer_id?: string;
  receipt_url?: string;
  metadata: KeyValuePairs;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
  total_spent?: number;
  metadata?: KeyValuePairs;
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: number;
  plan_id: string;
  amount: number;
}

export type StripeResource = any;

/**
 * ==============================================================================
 * SECTION 11: GATEKEEPER VERIFICATION & CRYPTOGRAPHIC LEDGERS
 * ==============================================================================
 * Types governing secure micro-deposit verification, Modern Treasury external
 * account validation, and multi-factor cryptographic gatekeepers.
 */

export interface VerifyParams {
  externalAccountId: string;
  originatingAccountId: string;
  paymentType: 'ach' | 'eft' | 'rtp';
  currency: string;
  authToken: string; // The base64 string provided by user
}

export interface VerifyError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * ==============================================================================
 * SECTION 12: SACRED GEOMETRY, GEMATRIA & THEOLOGICAL PATTERNS
 * ==============================================================================
 * Types governing mathematical patterns, triangular numbers, gematria calculations,
 * and multi-layered cosmic/historical pattern analysis.
 */

export interface BibleBook {
  index: number;
  name: string;
  chapters: number;
  isTriangular: boolean;
}

export interface GematriaResult {
  word: string;
  sum: number;
  language: string;
  category: string;
}

export interface TriangularMetadata {
  index: number;
  value: number;
  significance: string;
}

export interface PatternLayer {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: 'Scripture' | 'Math' | 'Science' | 'Cosmic' | 'History';
}

/**
 * ==============================================================================
 * SECTION 13: LITERARY TRANSLATION, MANUSCRIPTS & REPOSITORY COMPENDIUMS
 * ==============================================================================
 * Types governing the transformation of raw codebases into literary masterpieces,
 * New York Times best-seller manuscripts, and virtual repository consensus engines.
 */

export interface Page {
  title: string;
  content: string; // Changed from string[] to string for narrative content
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  technicalSummary: string;
  imageryPrompt: string;
  imageUrl?: string;
  pages?: Page[];
}

export interface Section {
  title: string;
  chapters: Chapter[];
}

export type Book = Section[];

export interface Manuscript {
  repoName: string;
  title: string;
  preface: string;
  chapters: Chapter[];
  conclusion: string;
  generatedAt: string;
  author: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface KnowledgeBaseFile extends GitHubFile {
  repoName: string;
}

export interface AuditItem {
  file: GitHubFile;
  repo: GithubRepo;
}

export interface FileAnalysis {
  path: string;
  name: string;
  thoughts: string;
  hypnoticCommand: string;
  imageUrl?: string;
}

export interface ProjectCompendium {
  repoName: string;
  summaries: FileAnalysis[];
  masterStory: string;
  sacredDecree: string;
  ultimateBibliography: string;
  analyzedAt: string;
  totalFilesProcessed: number;
}

export interface VirtualRepository {
  name: string;
  files: Map<string, FileAnalysis>;
  consensus: any;
  isReady: boolean;
}

export interface SelectedContext {
  repo: GithubRepo | null;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
  isGenerating: boolean;
  status: string;
  compendium?: ProjectCompendium | null;
  virtualRepo?: VirtualRepository | null;
}

export interface RepoSession {
  repoId: number;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
}

/**
 * ==============================================================================
 * SECTION 14: ENTERPRISE PAYMENTS, SIMULATIONS & CLIENT REGISTRATION
 * ==============================================================================
 * Types governing enterprise-grade payee management, simulation engines,
 * client registration responses, and line-item ledger updates.
 */

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
}

export interface CustomerProfileResponse {
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  companyName: string;
  emails: Array<{
    emailAddress: string;
    preferenceType: string;
  }>;
  addressList: Array<{
    addressLine1: string;
    city: string;
    countryCode: string;
    postalCode: string;
    addressType: string;
  }>;
  phones: Array<{
    phoneType: string;
    fullPhoneNumber: string;
    preferenceType: string;
  }>;
}

export interface ClientRegisterResponse {
  client_id: string;
  client_secret: string;
  client_name: string;
  appId?: string;
  redirect_uris: string[];
  scope: string[];
  token_endpoint_auth_method?: string;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * ==============================================================================
 * SECTION 15: ADVANCED TYPESCRIPT UTILITY & TYPE-LEVEL PROGRAMMING
 * ==============================================================================
 * High-performance utility types for deep partials, readonly mapping,
 * union-to-intersection conversions, and type-safe property picking.
 */

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type PickProperties<T, U> = Pick<T, KeysOfType<T, U>>;

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type TupleToUnion<T extends any[]> = T[number];

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

/**
 * ==============================================================================
 * SECTION 16: ISO 20022 XML/JSON SCHEMA DEFINITIONS & MX/MT MESSAGE PARSERS
 * ==============================================================================
 * Exhaustive, production-grade type definitions for ISO 20022 financial messaging.
 * Covers pacs.008, pacs.009, pain.001, and camt.053 schemas with complete structural fidelity.
 */

export interface ActiveOrHistoricCurrencyAndAmount {
  value: number;
  currency: string;
}

export interface PostalAddress24 {
  adrTp?: 'MNDT' | 'ALCO' | 'BIZZ' | 'COMM' | 'DLVY' | 'HEAD' | 'OFFI' | 'HOME' | 'PBOX';
  dept?: string;
  subDept?: string;
  strtNm?: string;
  bldgNb?: string;
  bldgNm?: string;
  pstCd?: string;
  twnNm?: string;
  subPrvnc?: string;
  ctrySubDvsn?: string;
  ctry?: string;
  adrLine?: string[];
}

export interface PartyIdentification135 {
  nm?: string;
  pstlAdr?: PostalAddress24;
  id?: {
    orgId?: {
      anyBIC?: string;
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
    prvtId?: {
      dtAndPlcOfBirth?: {
        birthDt: string;
        prvncOfBirth?: string;
        cityOfBirth: string;
        ctryOfBirth: string;
      };
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
  };
  ctctDtls?: {
    nmPrfx?: 'DOCT' | 'MADM' | 'MISS' | 'MIST' | 'MIXX';
    nm?: string;
    phneNb?: string;
    mobPhneNb?: string;
    faxNb?: string;
    emailAdr?: string;
    emailPurp?: string;
    jobTitl?: string;
    rspnsblty?: string;
    dept?: string;
  };
}

export interface ClearingSystemMemberIdentification2 {
  clrSysId?: {
    cd?: string;
    prtry?: string;
  };
  mmbId: string;
}

export interface BranchAndFinancialInstitutionIdentification6 {
  finInstnId: {
    bicfi?: string;
    clrSysMmbId?: ClearingSystemMemberIdentification2;
    nm?: string;
    pstlAdr?: PostalAddress24;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  brnch?: {
    id?: string;
    nm?: string;
    pstlAdr?: PostalAddress24;
  };
}

export interface CashAccount38 {
  id: {
    iban?: string;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  tp?: {
    cd?: string;
    prtry?: string;
  };
  ccy?: string;
  nm?: string;
  prxy?: {
    tp?: { cd?: string; prtry?: string };
    id: string;
  };
}

export interface PaymentIdentification7 {
  instrId?: string;
  endToEndId: string;
  uetr?: string;
  txId?: string;
  clrSysRef?: string;
}

export interface GroupHeader93 {
  msgId: string;
  creDtTm: string;
  authstn?: {
    cd?: string;
    prtry?: string;
  }[];
  btchBookg?: boolean;
  nbOfTxs: string;
  ctrlSum?: number;
  initgPty?: PartyIdentification135;
  fwdgAgt?: BranchAndFinancialInstitutionIdentification6;
}

export interface CreditTransferTransaction39 {
  pmtId: PaymentIdentification7;
  pmtTpInf?: {
    instrPrty?: 'HIGH' | 'NORM';
    svcLvl?: { cd?: string; prtry?: string }[];
    lclInstrm?: { cd?: string; prtry?: string };
    ctgyPurp?: { cd?: string; prtry?: string };
  };
  intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
  intrBkSttlmDt?: string;
  sttlmPrty?: 'HIGH' | 'NORM';
  chrgBr: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
  chrgsInf?: {
    amt: ActiveOrHistoricCurrencyAndAmount;
    agt: BranchAndFinancialInstitutionIdentification6;
  }[];
  instgAgt?: BranchAndFinancialInstitutionIdentification6;
  instdAgt?: BranchAndFinancialInstitutionIdentification6;
  dbtr: PartyIdentification135;
  dbtrAcct?: CashAccount38;
  dbtrAgt: BranchAndFinancialInstitutionIdentification6;
  dbtrAgtAcct?: CashAccount38;
  cdtrAgt: BranchAndFinancialInstitutionIdentification6;
  cdtrAgtAcct?: CashAccount38;
  cdtr: PartyIdentification135;
  cdtrAcct?: CashAccount38;
  ultmtDbtr?: PartyIdentification135;
  ultmtCdtr?: PartyIdentification135;
  purp?: { cd?: string; prtry?: string };
  rgltryRptg?: {
    dbtCdtFlg?: 'DBIT' | 'CDIT';
    authrty?: { nm?: string; ctry?: string };
    dtls?: { cd?: string; prtry?: string; inf?: string[] }[];
  }[];
  rltdRmtInf?: {
    fcmtId?: string;
    docTp?: string;
    docNb?: string;
    dt?: string;
  }[];
  rmtInf?: {
    ustrd?: string[];
    strd?: {
      rfrdDocInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        nb?: string;
        rltdDt?: string;
      }[];
      rfrdDocAmt?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        amt: ActiveOrHistoricCurrencyAndAmount;
      }[];
      cdtrRefInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        ref?: string;
      };
      invcr?: PartyIdentification135;
      invcee?: PartyIdentification135;
    }[];
  };
}

export interface Pacs008Document {
  fitoficstmdbtct: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: CreditTransferTransaction39[];
  };
}

export interface Pacs009Document {
  ficreditTransfer: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: {
      pmtId: PaymentIdentification7;
      intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
      intrBkSttlmDt?: string;
      instgAgt?: BranchAndFinancialInstitutionIdentification6;
      instdAgt?: BranchAndFinancialInstitutionIdentification6;
      dbtr: BranchAndFinancialInstitutionIdentification6;
      dbtrAcct?: CashAccount38;
      dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtr: BranchAndFinancialInstitutionIdentification6;
      cdtrAcct?: CashAccount38;
    }[];
  };
}

export interface Pain001Document {
  cstmrCdtTrfInitn: {
    grpHdr: GroupHeader93;
    pmtInf: {
      pmtInfId: string;
      pmtMtd: 'TRF' | 'CHK' | 'TRA';
      btchBookg?: boolean;
      nbOfTxs?: string;
      ctrlSum?: number;
      pmtTpInf?: {
        instrPrty?: 'HIGH' | 'NORM';
        svcLvl?: { cd?: string; prtry?: string }[];
        lclInstrm?: { cd?: string; prtry?: string };
        ctgyPurp?: { cd?: string; prtry?: string };
      };
      reqdExctnDt: {
        dt?: string;
        dtTm?: string;
      };
      dbtr: PartyIdentification135;
      dbtrAcct: CashAccount38;
      dbtrAgt: BranchAndFinancialInstitutionIdentification6;
      dbtrAgtAcct?: CashAccount38;
      ultmtDbtr?: PartyIdentification135;
      chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
      cdtTrfTxInf: {
        pmtId: PaymentIdentification7;
        amt: {
          instdAmt?: ActiveOrHistoricCurrencyAndAmount;
          eqvAmt?: {
            amt: ActiveOrHistoricCurrencyAndAmount;
            ccyOfTrf: string;
          };
        };
        chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
        cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
        cdtrAgtAcct?: CashAccount38;
        cdtr: PartyIdentification135;
        cdtrAcct?: CashAccount38;
        ultmtCdtr?: PartyIdentification135;
        purp?: { cd?: string; prtry?: string };
        rmtInf?: { ustrd?: string[] };
      }[];
    }[];
  };
}

export interface Camt053Document {
  bkToCstmrStmt: {
    grpHdr: GroupHeader93;
    stmt: {
      id: string;
      elctrncSeqNb?: number;
      creDtTm: string;
      frToDt?: {
        frDtTm: string;
        toDtTm: string;
      };
      acct: CashAccount38;
      bal: {
        tp: {
          cdOrPrtry: { cd: string; prtry?: string };
        };
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        dt: { dtTm: string };
      }[];
      ntry?: {
        ntryRef?: string;
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        sts: 'BOOK' | 'PDNG';
        bookgDt?: { dtTm: string };
        valDt?: { dtTm: string };
        acctSvcrRef?: string;
        ntryDtls?: {
          txDtls?: {
            refs?: {
              endToEndId?: string;
              uetr?: string;
              txId?: string;
            };
            amtDtls?: {
              instdAmt?: {
                amt: ActiveOrHistoricCurrencyAndAmount;
              };
            };
            rltdPties?: {
              dbtr?: PartyIdentification135;
              cdtr?: PartyIdentification135;
            };
            rltdAgts?: {
              dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
              cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
            };
          }[];
        }[];
      }[];
    }[];
  };
}

/**
 * ==============================================================================
 * SECTION 17: QUANTUM LEDGER & MULTI-NODE CONSENSUS MESH PROTOCOL (NEXUS-V3)
 * ==============================================================================
 * Advanced cryptographic structures for zero-knowledge proofs, post-quantum
 * signatures, threshold multi-sig, and decentralized consensus state machines.
 */

export type QuantumSignatureScheme = 'Dilithium5' | 'Falcon1024' | 'SPHINCS+' | 'XMSS_MT';

export interface QuantumPublicKey {
  scheme: QuantumSignatureScheme;
  rawBytes: string; // Base64 encoded public key
  fingerprint: string; // SHA3-256 hash of the public key
}

export interface ZkProofPayload {
  provingSystem: 'Groth16' | 'Plonk' | 'Halo2' | 'Bulletproofs';
  proofBytes: string; // Base64 encoded proof
  publicInputs: string[]; // Array of public input values
  verificationKeyHash: string;
}

export interface ThresholdSignatureConfig {
  threshold: number; // 't' in t-of-n
  totalSigners: number; // 'n'
  publicKeys: QuantumPublicKey[];
  epochId: number;
}

export interface ConsensusState {
  currentEpoch: number;
  currentRound: number;
  leaderNodeId: string;
  activeValidators: string[];
  consensusThreshold: number;
  lastCommittedBlockHeight: number;
  lastCommittedBlockHash: string;
  pendingProposalsCount: number;
}

export interface StateChannel {
  channelId: string;
  participants: string[];
  nonce: number;
  balances: Record<string, ActiveOrHistoricCurrencyAndAmount>;
  signatures: Record<string, string>;
  status: 'OPEN' | 'CLOSING' | 'CLOSED' | 'DISPUTED';
  disputeTimeoutBlock?: number;
}

export interface MeshNode {
  nodeId: string;
  endpoint: string;
  version: string;
  reputationScore: number;
  latencyMs: number;
  isValidator: boolean;
  stakingBalance: ActiveOrHistoricCurrencyAndAmount;
  lastHeartbeat: string;
}

export interface BlockHeader {
  height: number;
  previousHash: string;
  merkleRoot: string;
  stateRoot: string;
  timestamp: number;
  validatorSignature: string;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface TransactionPayload {
  txHash: string;
  sender: string;
  recipient: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  nonce: number;
  gasLimit: number;
  gasPrice: ActiveOrHistoricCurrencyAndAmount;
  signature: string;
  zkProof?: ZkProofPayload;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface ConsensusMessage {
  messageId: string;
  senderNodeId: string;
  epoch: number;
  round: number;
  type: 'PROPOSE' | 'PREVOTE' | 'PRECOMMIT' | 'DECIDE';
  blockHash: string;
  signature: string;
}

/**
 * ==============================================================================
 * SECTION 18: AI SWARM ORCHESTRATION, AGENTIC WORKFLOWS & COGNITIVE THOUGHT STREAMS
 * ==============================================================================
 * Types governing multi-agent swarms, task decomposition graphs, agent-to-agent
 * communication protocols, vector database embeddings, and cognitive thought stream logs.
 */

export type AgentRole = 'ORCHESTRATOR' | 'CRITIC' | 'REFINER' | 'RESEARCHER' | 'CODER' | 'COMPLIANCE_OFFICER' | 'FINANCIAL_ANALYST';

export interface AgentCapability {
  name: string;
  description: string;
  parametersSchema: Record<string, any>; // JSON Schema for tool parameters
}

export interface TaskDecompositionNode {
  taskId: string;
  parentTaskId: string | null;
  assignedAgentId: string;
  description: string;
  dependencies: string[]; // Array of taskIds that must complete first
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  error?: string;
  attempts: number;
  maxAttempts: number;
}

export interface SwarmOrchestratorState {
  swarmId: string;
  activeAgents: Record<string, {
    agentId: string;
    role: AgentRole;
    status: 'IDLE' | 'WORKING' | 'CRITICIZING' | 'OFFLINE';
    currentTaskId?: string;
  }>;
  taskGraph: Record<string, TaskDecompositionNode>;
  overallProgress: number; // 0.0 to 1.0
  status: 'IDLE' | 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
}

export interface AgentMessage {
  messageId: string;
  senderId: string;
  recipientId: string; // Can be 'ALL' or specific agentId
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
  replyToId?: string;
}

export interface ThoughtStreamNode {
  nodeId: string;
  agentId: string;
  timestamp: number;
  thoughtType: 'OBSERVATION' | 'REASONING' | 'HYPOTHESIS' | 'CRITIQUE' | 'DECISION';
  content: string;
  confidenceScore: number; // 0.0 to 1.0
  parentThoughtId: string | null;
}

export interface VectorEmbedding {
  id: string;
  vector: number[];
  textPayload: string;
  metadata: Record<string, string | number | boolean>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface ToolExecutionContext {
  toolName: string;
  arguments: Record<string, any>;
  callerAgentId: string;
  timestamp: number;
  executionTimeMs?: number;
  status: 'SUCCESS' | 'ERROR';
  result?: any;
  error?: string;
}

/**
 * ==============================================================================
 * SECTION 19: ADVANCED ALGORITHMIC TRADING, HIGH-FREQUENCY ORDER BOOKS & RISK ENGINES
 * ==============================================================================
 * Types governing real-time order books (L1/L2/L3), market makers, execution
 * algorithms (TWAP, VWAP, Sniper), portfolio risk metrics, and margin/liquidation engines.
 */

export interface OrderBookLevel {
  price: number;
  quantity: number;
  orderCount?: number;
}

export interface OrderBookL2 {
  ticker: string;
  timestamp: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface OrderBookL3 {
  ticker: string;
  timestamp: number;
  bids: { orderId: string; price: number; quantity: number; ownerId: string }[];
  asks: { orderId: string; price: number; quantity: number; ownerId: string }[];
}

export type AlgoExecutionStrategy = 'TWAP' | 'VWAP' | 'SNIPER' | 'ICEBERG' | 'GRID' | 'MARKET_MAKER';

export interface AlgoTradingJob {
  jobId: string;
  ticker: string;
  strategy: AlgoExecutionStrategy;
  side: 'BUY' | 'SELL';
  totalQuantity: number;
  executedQuantity: number;
  limitPrice?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  parameters: {
    startTime: string;
    endTime: string;
    sliceIntervalSeconds?: number;
    maxParticipationRate?: number; // For VWAP
    icebergDisplayQuantity?: number;
  };
  status: 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  averageExecutionPrice: number;
  slippageBps: number;
  logs: string[];
}

export interface PortfolioRiskMetrics {
  portfolioId: string;
  timestamp: number;
  valueAtRisk95: ActiveOrHistoricCurrencyAndAmount; // 95% confidence VaR
  valueAtRisk99: ActiveOrHistoricCurrencyAndAmount; // 99% confidence VaR
  expectedShortfall: ActiveOrHistoricCurrencyAndAmount;
  sharpeRatio: number;
  sortinoRatio: number;
  betaToBenchmark: number;
  alphaToBenchmark: number;
  maxDrawdown: number;
  volatilityAnnualized: number;
}

export interface MarginAccount {
  accountId: string;
  collateralBalance: ActiveOrHistoricCurrencyAndAmount;
  borrowedBalance: ActiveOrHistoricCurrencyAndAmount;
  maintenanceMarginRequirement: number; // Percentage, e.g., 0.15 for 15%
  initialMarginRequirement: number; // Percentage, e.g., 0.30 for 30%
  currentMarginRatio: number; // collateral / borrowed
  liquidationPrice: number;
  status: 'HEALTHY' | 'MARGIN_CALL' | 'LIQUIDATING' | 'LIQUIDATED';
}

export interface LiquidationEvent {
  liquidationId: string;
  accountId: string;
  timestamp: number;
  liquidatedAsset: string;
  liquidatedQuantity: number;
  executionPrice: number;
  penaltyFee: ActiveOrHistoricCurrencyAndAmount;
  remainingCollateral: ActiveOrHistoricCurrencyAndAmount;
}
/**
 * ==============================================================================
 * SECTION 20: MULTI-MODAL AI AD STUDIO, CAMPAIGN GENERATION & AD PERFORMANCE TRACKING
 * ==============================================================================
 * Types for AI-generated marketing campaigns, ad creatives, target audience segments,
 * budget allocation, real-time bidding (RTB) parameters, conversion tracking, and
 * multi-channel attribution models.
 */

export type AdCampaignStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type AdCreativeType = 'IMAGE' | 'VIDEO' | 'TEXT' | 'CAROUSEL' | 'INTERACTIVE_HTML5' | 'AUDIO';

export type AttributionModelType = 'FIRST_TOUCH' | 'LAST_TOUCH' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'DATA_DRIVEN';

export interface AdPerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: ActiveOrHistoricCurrencyAndAmount;
  ctr: number; // Click-Through Rate (0.0 to 1.0)
  cpc: ActiveOrHistoricCurrencyAndAmount; // Cost Per Click
  cpa: ActiveOrHistoricCurrencyAndAmount; // Cost Per Acquisition
  roas: number; // Return on Ad Spend
  bounceRate: number; // 0.0 to 1.0
  averageEngagementTimeSeconds: number;
  conversionRate: number; // 0.0 to 1.0
}

export interface AudienceSegment {
  segmentId: string;
  name: string;
  description?: string;
  demographics: {
    ageRanges: string[];
    genders: string[];
    incomeBrackets?: string[];
    educationLevels?: string[];
  };
  interests: string[];
  behaviors: string[];
  geographicRegions: string[]; // ISO country/region codes
  estimatedReach: number;
  customDataTags?: Record<string, string>;
}

export interface AdCreative {
  creativeId: string;
  type: AdCreativeType;
  headline: LocalizedString;
  bodyText: LocalizedString;
  callToAction: string;
  mediaAssets: AssetMetadata[];
  generationPromptUsed?: string;
  aiModelId?: string;
  negativePromptUsed?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '2:3';
  metaData?: Record<string, any>;
}

export interface RealTimeBiddingConfig {
  maxBidAmount: ActiveOrHistoricCurrencyAndAmount;
  targetCpa?: ActiveOrHistoricCurrencyAndAmount;
  pacingStrategy: 'EVEN' | 'AHEAD' | 'ASAP';
  bidMultiplierRules: {
    dimension: 'device' | 'region' | 'time_of_day' | 'audience_segment';
    key: string;
    multiplier: number; // e.g., 1.2 for +20% bid
  }[];
}

export interface AdCampaign {
  campaignId: string;
  name: string;
  description?: string;
  status: AdCampaignStatus;
  channels: ('SOCIAL' | 'SEARCH' | 'DISPLAY' | 'PROGRAMMATIC' | 'EMAIL' | 'METAVERSE')[];
  targetAudience: AudienceSegment;
  creatives: AdCreative[];
  totalBudget: ActiveOrHistoricCurrencyAndAmount;
  dailyBudgetLimit: ActiveOrHistoricCurrencyAndAmount;
  startDate: string;
  endDate?: string;
  rtbConfig?: RealTimeBiddingConfig;
  performanceMetrics?: AdPerformanceMetrics;
  attributionModel: AttributionModelType;
  aiCreativeBrief?: string;
  lastOptimizedAt?: string;
}

/**
 * ==============================================================================
 * SECTION 21: CITIBANK CONNECTIVITY, OPEN BANKING API PROXIES & SECURE DATA EXCHANGE
 * ==============================================================================
 * Citi-specific API payloads, unmasked data views, standing instructions,
 * cross-border payment routing, payee management, and developer sandbox configurations.
 */

export type CitiAccountProxyStatus = 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';

export interface CitiAccountProxy {
  proxyId: string;
  realAccountId: string;
  mask: string;
  virtualIban: string;
  status: CitiAccountProxyStatus;
  allowedMerchantCategories: string[]; // MCC codes
  dailyLimit: ActiveOrHistoricCurrencyAndAmount;
  expirationDate: string;
  createdDate: string;
}

export interface CitiBillPayment {
  paymentId: string;
  billerId: string;
  billerName: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  status: 'PENDING' | 'PROCESSING' | 'EXECUTED' | 'FAILED';
  executionDate: string;
  recurringRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY';
    interval: number;
    endDate?: string;
  };
}

export interface CitiCrossBorderTransfer {
  transferId: string;
  senderBic: string;
  receiverBic: string;
  intermediaryBic?: string;
  fxRate: number;
  guaranteedUntil: string;
  transferFee: ActiveOrHistoricCurrencyAndAmount;
  regulatoryReportingCode?: string; // e.g., Central Bank reporting codes
  chargeBearer: 'OUR' | 'BEN' | 'SHA';
}

export interface CitiPayee {
  payeeId: string;
  name: string;
  accountDetails: CashAccount38;
  address?: PostalAddress24;
  status: 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED';
  verificationLevel: 'STANDARD' | 'ENHANCED_KYC' | 'SANCTION_CLEARED';
  lastPaidDate?: string;
}

export interface CitiStandingInstruction {
  instructionId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  frequency: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  nextExecutionDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export interface CitiDeveloperSandboxConfig {
  sandboxId: string;
  clientId: string;
  clientSecret: string;
  mockDataProfile: 'RETAIL_MASS' | 'HNW_SOVEREIGN' | 'CORPORATE_CONGLOMERATE';
  latencySimulationMs: number;
  errorSimulationRate: number; // 0.0 to 1.0
}

/**
 * ==============================================================================
 * SECTION 22: WEB3 DECENTRALIZED FINANCE (DeFi), LIQUIDITY POOLS & SMART CONTRACT INTERACTION
 * ==============================================================================
 * Types for decentralized lending pools, yield farming, automated market makers (AMMs),
 * gas estimation, smart contract ABIs, wallet provider details (EIP-6963), and cross-chain bridge protocols.
 */

export interface DeFiLendingPool {
  poolAddress: string;
  assetSymbol: string;
  totalDeposited: ActiveOrHistoricCurrencyAndAmount;
  totalBorrowed: ActiveOrHistoricCurrencyAndAmount;
  supplyApy: number; // Annual Percentage Yield
  borrowApy: number;
  utilizationRate: number; // 0.0 to 1.0
  collateralFactor: number; // 0.0 to 1.0
  liquidationThreshold: number; // 0.0 to 1.0
}

export interface YieldFarm {
  farmAddress: string;
  lpTokenAddress: string;
  rewardTokenAddress: string;
  tvl: ActiveOrHistoricCurrencyAndAmount; // Total Value Locked
  apr: number; // Annual Percentage Rate
  userStakedBalance: number;
  userPendingRewards: number;
}

export interface AmmPool {
  poolAddress: string;
  token0: { address: string; symbol: string; decimals: number };
  token1: { address: string; symbol: string; decimals: number };
  reserve0: number;
  reserve1: number;
  feeTierBps: number; // e.g., 30 for 0.3%
  volume24h: ActiveOrHistoricCurrencyAndAmount;
  totalLiquidity: ActiveOrHistoricCurrencyAndAmount;
}

export interface SmartContractAbiEntry {
  name: string;
  type: 'function' | 'event' | 'constructor' | 'fallback' | 'receive';
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  inputs: { name: string; type: string; indexed?: boolean }[];
  outputs?: { name: string; type: string }[];
}

export interface WalletProviderDetail {
  uuid: string;
  name: string;
  icon: string; // Base64 or URL
  rdns: string; // Reverse Domain Name System identifier
  providerInstance: any; // EIP-1193 provider instance
}

export interface CrossChainBridgeTx {
  txHash: string;
  sourceChainId: number;
  destinationChainId: number;
  assetSymbol: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  bridgeFee: ActiveOrHistoricCurrencyAndAmount;
  estimatedTimeMinutes: number;
}

/**
 * ==============================================================================
 * SECTION 23: FOREX ARENA, COMMODITIES EXCHANGE & DERIVATIVES DESK
 * ==============================================================================
 * Types for foreign exchange (FX) spot/forward contracts, leverage settings,
 * margin requirements, commodity futures, options chains (calls/puts, Greeks), and hedging strategies.
 */

export interface FxSpotContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  bidPrice: number;
  askPrice: number;
  pipValue: number;
  lotSize: number; // Standard lot is 100,000 units
}

export interface FxForwardContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  forwardRate: number;
  maturityDate: string;
  settlementType: 'PHYSICAL' | 'CASH';
  notionalAmount: ActiveOrHistoricCurrencyAndAmount;
}

export interface CommodityFuture {
  ticker: string;
  commodityType: 'ENERGY' | 'METALS' | 'AGRICULTURE' | 'ENVIRONMENTAL';
  contractMonth: string; // e.g., "DEC29"
  contractYear: number;
  multiplier: number;
  maintenanceMargin: ActiveOrHistoricCurrencyAndAmount;
  lastTradingDate: string;
}

export interface OptionContract {
  optionId: string;
  underlyingTicker: string;
  strikePrice: number;
  expirationDate: string;
  optionType: 'CALL' | 'PUT';
  premium: number;
  openInterest: number;
  volume: number;
}

export interface OptionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  impliedVolatility: number;
}

export interface HedgingStrategy {
  strategyId: string;
  name: string;
  description: string;
  underlyingAssets: string[];
  derivativeInstruments: string[]; // optionIds or future tickers
  targetHedgeRatio: number; // e.g., 0.85 for 85% hedged
  currentHedgeRatio: number;
  unrealizedPnL: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 24: REAL ESTATE EMPIRE, FRACTIONAL OWNERSHIP & ART COLLECTIBLES
 * ==============================================================================
 * Types for tokenized real estate, fractional shares, rental distribution ledgers,
 * art provenance tracking, appraisal history, and gallery exhibition schedules.
 */

export interface RealEstateFractionalShare {
  shareId: string;
  propertyId: string;
  ownerId: string;
  percentageOwned: number; // 0.0 to 1.0
  purchasePrice: ActiveOrHistoricCurrencyAndAmount;
  purchaseDate: string;
  currentValue: ActiveOrHistoricCurrencyAndAmount;
}

export interface RentalDistributionLedger {
  ledgerId: string;
  propertyId: string;
  periodStartDate: string;
  periodEndDate: string;
  totalGrossRentCollected: ActiveOrHistoricCurrencyAndAmount;
  expensesDeducted: ActiveOrHistoricCurrencyAndAmount;
  netRentDistributed: ActiveOrHistoricCurrencyAndAmount;
  distributions: {
    shareId: string;
    ownerId: string;
    amountDistributed: ActiveOrHistoricCurrencyAndAmount;
    distributedAt: string;
  }[];
}

export interface ArtProvenanceEntry {
  entryId: string;
  ownerName: string;
  acquisitionDate: string;
  acquisitionPrice?: ActiveOrHistoricCurrencyAndAmount;
  provenanceType: 'GALLERY_PURCHASE' | 'AUCTION' | 'PRIVATE_SALE' | 'INHERITANCE' | 'MUSEUM_EXHIBITION';
  location: string;
  verifiedBy: string;
  verificationHash: string;
}

export interface ArtAppraisalHistory {
  appraisalId: string;
  appraiserName: string;
  appraiserCredentials: string[];
  appraisalDate: string;
  appraisedValue: ActiveOrHistoricCurrencyAndAmount;
  appraisalReportUrl?: string;
  conditionRating: 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

export interface GalleryExhibition {
  exhibitionId: string;
  galleryName: string;
  location: string;
  startDate: string;
  endDate: string;
  curatorName: string;
  exhibitedArtPieceIds: string[];
  insuranceCoverageAmount: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 25: TAX OPTIMIZATION, LEGACY ARCHITECT & PHILANTHROPY
 * ==============================================================================
 * Types for tax loss harvesting, capital gains tracking, trust funds, estate planning,
 * charitable foundations, donor-advised funds (DAFs), and impact metrics.
 */

export interface TaxLossHarvestingOpportunity {
  opportunityId: string;
  assetTicker: string;
  currentPrice: number;
  costBasis: number;
  unrealizedLoss: ActiveOrHistoricCurrencyAndAmount;
  potentialTaxSavings: ActiveOrHistoricCurrencyAndAmount;
  recommendedReplacementAssetTicker: string;
  washSaleRiskStatus: 'SAFE' | 'RISK_OF_WASH_SALE' | 'WASH_SALE_TRIGGERED';
}

export interface CapitalGainsRecord {
  recordId: string;
  assetTicker: string;
  quantity: number;
  acquisitionDate: string;
  saleDate: string;
  costBasis: ActiveOrHistoricCurrencyAndAmount;
  saleProceeds: ActiveOrHistoricCurrencyAndAmount;
  gainLossAmount: ActiveOrHistoricCurrencyAndAmount;
  gainType: 'SHORT_TERM' | 'LONG_TERM';
  estimatedTaxLiability: ActiveOrHistoricCurrencyAndAmount;
}

export interface TrustFundBeneficiary {
  beneficiaryId: string;
  name: string;
  relationship: string;
  distributionPercentage: number; // 0.0 to 1.0
  vestingSchedule?: {
    milestoneAge?: number;
    milestoneDate?: string;
    percentageVested: number;
  }[];
}

export interface TrustFund {
  trustId: string;
  trusteeName: string;
  grantorName: string;
  beneficiaries: TrustFundBeneficiary[];
  totalAssetsValue: ActiveOrHistoricCurrencyAndAmount;
  distributionRules: {
    ruleId: string;
    triggerType: 'AGE' | 'DATE' | 'EDUCATION_MILESTONE' | 'DISCRETIONARY';
    triggerValue: string;
    maxDistributionAmount?: ActiveOrHistoricCurrencyAndAmount;
  }[];
  taxStatus: 'REVOCABLE' | 'IRREVOCABLE';
}

export interface DonorAdvisedFund {
  dafId: string;
  fundName: string;
  sponsorOrganization: string;
  currentBalance: ActiveOrHistoricCurrencyAndAmount;
  contributionsHistory: {
    contributionId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    taxDeductionReceiptUrl?: string;
  }[];
  grantsDistributed: {
    grantId: string;
    charityName: string;
    charityTaxId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'DISBURSED';
  }[];
}

export interface PhilanthropicImpactMetrics {
  impactId: string;
  charityName: string;
  unSustainableDevelopmentGoals: number[]; // SDG numbers 1-17
  livesImpactedCount: number;
  carbonOffsetTons?: number;
  educationHoursProvided?: number;
  cleanWaterLitersProvided?: number;
  impactScore: number; // Scale of 1-100
}
/**
 * ==============================================================================
 * SECTION 26: VENTURE CAPITAL, PRIVATE EQUITY & STARTUP INCUBATION
 * ==============================================================================
 * Advanced structures for venture capital fund management, startup incubation,
 * cap table modeling, SAFE agreements, term sheets, and due diligence workflows.
 */

export interface VentureCapitalFund {
  fundId: string;
  fundName: string;
  vintageYear: number;
  targetAum: ActiveOrHistoricCurrencyAndAmount;
  currentAum: ActiveOrHistoricCurrencyAndAmount;
  generalPartners: string[];
  limitedPartners: {
    lpId: string;
    name: string;
    committedCapital: ActiveOrHistoricCurrencyAndAmount;
    calledCapital: ActiveOrHistoricCurrencyAndAmount;
    distributionCapital: ActiveOrHistoricCurrencyAndAmount;
  }[];
  investmentThesis: LocalizedString;
  portfolioCompanies: VentureStartup[];
  irr: number; // Internal Rate of Return (e.g., 0.24 for 24%)
  tvpi: number; // Total Value to Paid-In Capital
  dpi: number; // Distributed to Paid-In Capital
  status: 'RAISING' | 'ACTIVE' | 'FULLY_INVESTED' | 'LIQUIDATED';
}

export interface StartupIncubationCohort {
  cohortId: string;
  programName: string;
  startDate: string;
  endDate: string;
  mentors: {
    mentorId: string;
    name: string;
    expertise: string[];
    companyAffiliation?: string;
  }[];
  acceptedStartups: VentureStartup[];
  curriculumModules: {
    moduleId: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
  demoDayParameters: {
    scheduledDate: string;
    investorRsvpCount: number;
    pitchDurationSeconds: number;
    prizePoolAmount?: ActiveOrHistoricCurrencyAndAmount;
  };
}

export interface CapTableShareholder {
  shareholderId: string;
  name: string;
  shareClass: 'FOUNDER_COMMON' | 'COMMON' | 'PREFERRED_SEED' | 'PREFERRED_SERIES_A' | 'PREFERRED_SERIES_B' | 'OPTION_POOL';
  shareCount: number;
  ownershipPercentage: number; // 0.0 to 1.0
  fullyDilutedPercentage: number; // 0.0 to 1.0
  optionsGranted?: number;
  optionsVested?: number;
  vestingSchedule?: {
    cliffDate: string;
    vestingDurationMonths: number;
    vestingIntervalMonths: number;
  };
}

export interface CapTable {
  capTableId: string;
  startupId: string;
  preMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  postMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  totalSharesOutstanding: number;
  shareholders: CapTableShareholder[];
  optionPoolSize: number;
  optionPoolRemaining: number;
  convertibleNotes: {
    noteId: string;
    investorName: string;
    principalAmount: ActiveOrHistoricCurrencyAndAmount;
    interestRate: number;
    capAmount?: ActiveOrHistoricCurrencyAndAmount;
    discountRate?: number;
  }[];
  safeAgreements: SafeAgreement[];
}

export interface SafeAgreement {
  safeId: string;
  investorName: string;
  principalAmount: ActiveOrHistoricCurrencyAndAmount;
  capAmount?: ActiveOrHistoricCurrencyAndAmount;
  discountRate?: number; // e.g., 0.80 for 20% discount
  conversionTrigger: 'NEXT_EQUITY_ROUND' | 'LIQUIDITY_EVENT' | 'DISSOLUTION';
  status: 'ACTIVE' | 'CONVERTED' | 'TERMINATED';
}

export interface TermSheet {
  termSheetId: string;
  startupId: string;
  leadInvestorId: string;
  preMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  investmentAmount: ActiveOrHistoricCurrencyAndAmount;
  liquidationPreference: {
    multiplier: number; // e.g., 1.0x
    participating: boolean;
  };
  boardSeats: {
    totalSeats: number;
    investorSeats: number;
    founderSeats: number;
    independentSeats: number;
  };
  protectiveProvisions: string[];
  dragAlongRights: boolean;
  tagAlongRights: boolean;
  exclusivityDays: number;
  status: 'DRAFT' | 'SENT' | 'NEGOTIATING' | 'SIGNED' | 'EXPIRED' | 'REJECTED';
}

export interface DueDiligenceChecklist {
  checklistId: string;
  startupId: string;
  categories: {
    name: 'FINANCIAL' | 'LEGAL' | 'TECHNICAL' | 'TEAM' | 'MARKET' | 'IP';
    items: {
      itemId: string;
      description: string;
      status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'NOT_APPLICABLE';
      assignedTo: string;
      verifiedBy?: string;
      documentUrls: string[];
      comments: {
        author: string;
        text: string;
        timestamp: string;
      }[];
    }[];
  }[];
}

/**
 * ==============================================================================
 * SECTION 27: SOVEREIGN WEALTH SIMULATION, MACROECONOMIC MODELING & GAME THEORY
 * ==============================================================================
 * Types for sovereign wealth fund simulations, macroeconomic indicators,
 * geopolitical risk modeling, and game-theoretic scenario analysis.
 */

export interface SovereignWealthFund {
  fundId: string;
  nationState: string;
  totalAssets: ActiveOrHistoricCurrencyAndAmount;
  liquidReserves: ActiveOrHistoricCurrencyAndAmount;
  strategicAssetAllocation: {
    assetClass: 'EQUITIES' | 'FIXED_INCOME' | 'REAL_ESTATE' | 'INFRASTRUCTURE' | 'PRIVATE_EQUITY' | 'GOLD_RESERVES' | 'DIGITAL_ASSETS';
    targetPercentage: number; // 0.0 to 1.0
    currentPercentage: number;
  }[];
  geopoliticalRiskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'SOVEREIGN_HEGEMON';
  fiscalRules: {
    maxAnnualWithdrawalPercentage: number;
    emergencyFundThreshold: ActiveOrHistoricCurrencyAndAmount;
    commodityRevenueReinvestmentPercentage?: number;
  };
}

export interface MacroeconomicIndicators {
  gdpGrowthRate: number; // Annualized percentage change
  inflationRate: number;
  unemploymentRate: number;
  centralBankInterestRate: number;
  debtToGdpRatio: number;
  tradeBalance: ActiveOrHistoricCurrencyAndAmount;
  currencyStrengthIndex: number; // Relative to basket of global currencies
  lastUpdated: string;
}

export interface GeopoliticalEvent {
  eventId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXISTENTIAL';
  affectedRegions: string[]; // ISO country codes
  economicImpactFactors: {
    commodityPriceShock: { commodity: string; percentageChange: number }[];
    supplyChainDisruptionIndex: number; // 0.0 to 1.0
    capitalFlightRisk: boolean;
  };
  probabilityOfOccurrence: number; // 0.0 to 1.0
  status: 'POTENTIAL' | 'ACTIVE' | 'RESOLVED' | 'MITIGATED';
}

export interface PayoffMatrixEntry {
  player1Strategy: string;
  player2Strategy: string;
  player1Payoff: number;
  player2Payoff: number;
}

export interface GameTheoryScenario {
  scenarioId: string;
  title: string;
  description: string;
  players: {
    playerId: string;
    name: string;
    resources: Record<string, any>;
  }[];
  strategies: {
    playerId: string;
    options: string[];
  }[];
  payoffMatrix: PayoffMatrixEntry[];
  nashEquilibrium?: {
    player1Strategy: string;
    player2Strategy: string;
  }[];
  cooperativeOutcome?: {
    player1Strategy: string;
    player2Strategy: string;
    jointPayoff: number;
  };
  simulationSteps: {
    stepIndex: number;
    actionsTaken: Record<string, string>;
    payoffsRealized: Record<string, number>;
    narrative: string;
  }[];
}

export interface SimulationRun {
  runId: string;
  scenarioId: string;
  initialConditions: Record<string, any>;
  steps: {
    timestamp: string;
    stateVariables: Record<string, number>;
    eventsTriggered: string[];
  }[];
  finalOutcome: string;
  confidenceInterval: {
    lowerBound: number;
    upperBound: number;
  };
  executionTimeMs: number;
}

/**
 * ==============================================================================
 * SECTION 28: ADVANCED CRYPTOGRAPHIC KEY MANAGEMENT, MULTI-SIG & HSM
 * ==============================================================================
 * Types for Hardware Security Modules (HSM), cryptographic key lifecycles,
 * multi-signature transaction coordination, and zero-knowledge proof parameters.
 */

export interface HsmConfig {
  hsmId: string;
  vendor: 'THALES' | 'GEMALTO' | 'YUBICO' | 'AWS_KMS' | 'AZURE_KEY_VAULT' | 'CUSTOM_FPGA';
  model: string;
  firmwareVersion: string;
  slotId: number;
  label: string;
  supportedAlgorithms: ('AES256' | 'RSA4096' | 'ECDSA_SECP256K1' | 'ED25519' | 'DILITHIUM5' | 'FALCON1024')[];
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'DEGRADED' | 'ERROR';
}

export interface CryptographicKey {
  keyId: string;
  keyType: 'SYMMETRIC' | 'ASYMMETRIC_PUBLIC' | 'ASYMMETRIC_PRIVATE' | 'MASTER_SEED';
  keySize: number; // in bits
  algorithm: string;
  purpose: 'ENCRYPTION' | 'SIGNING' | 'KEY_DERIVATION' | 'ZERO_KNOWLEDGE';
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED' | 'ARCHIVED';
  createdAt: string;
  expiresAt?: string;
  hsmReferenceId?: string;
  keyFingerprint: string; // SHA3-256 hash of public key or key metadata
}

export interface SignatureShare {
  signerId: string;
  signatureBytes: string; // Base64 encoded signature
  timestamp: number;
  publicKeyFingerprint: string;
}

export interface MultiSigTransaction {
  txId: string;
  destinationAddress: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  assetSymbol: string;
  requiredSignatures: number; // 't' in t-of-n
  currentSignatures: SignatureShare[];
  signers: {
    signerId: string;
    name: string;
    publicKey: QuantumPublicKey;
    hasSigned: boolean;
  }[];
  status: 'PENDING_SIGNATURES' | 'FULLY_SIGNED' | 'EXECUTED' | 'FAILED' | 'EXPIRED';
  rawPayload: string; // Base64 or Hex encoded transaction payload
}

export interface ZeroKnowledgeProof {
  proofId: string;
  provingKeyId: string;
  verificationKeyId: string;
  publicInputs: string[];
  proofData: string; // Base64 encoded proof
  verified: boolean;
}

export interface ThresholdDecryptionConfig {
  t: number; // Threshold
  n: number; // Total shares
  keyShares: {
    shareId: number;
    encryptedShare: string;
    holderId: string;
  }[];
  reconstructionThreshold: number;
}

/**
 * ==============================================================================
 * SECTION 29: REAL-TIME TELEMETRY, NEURAL LACE SYNC & COGNITIVE PROFILE ANALYTICS
 * ==============================================================================
 * Types for neural interface telemetry, cognitive load tracking, emotional valence
 * analysis, and biometric feedback loops for high-frequency trading environments.
 */

export interface NeuralLaceTelemetry {
  syncId: string;
  userId: string;
  connectionStrength: number; // 0.0 to 1.0
  bandwidthBps: number;
  latencyMs: number;
  activeBrainwavePattern: 'ALPHA' | 'BETA' | 'GAMMA' | 'DELTA' | 'THETA';
  cognitiveLoadIndex: number; // 0.0 to 1.0
  emotionalState: {
    valence: number; // -1.0 (negative) to 1.0 (positive)
    arousal: number; // 0.0 (calm) to 1.0 (excited)
    dominantEmotion: 'CALM' | 'FOCUS' | 'ANXIETY' | 'EUPHORIA' | 'FATIGUE' | 'FRUSTRATION';
  };
  lastSyncTime: string;
}

export interface CognitiveProfile {
  profileId: string;
  userId: string;
  analyticalThinkingScore: number; // 0.0 to 100.0
  riskAversionIndex: number; // 0.0 to 1.0
  decisionSpeedMs: number;
  patternRecognitionScore: number; // 0.0 to 100.0
  focusDurationSeconds: number;
  stressToleranceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'ELITE';
}

export interface ThoughtNode {
  nodeId: string;
  textPayload: string;
  confidenceScore: number; // 0.0 to 1.0
  parentNodeId: string | null;
  emotionalValence: number; // -1.0 to 1.0
}

export interface ThoughtStreamLog {
  streamId: string;
  userId: string;
  timestamp: number;
  thoughtNodes: ThoughtNode[];
  primaryIntent: string;
  cognitiveCoherenceScore: number; // 0.0 to 1.0
}

export interface BiometricTelemetry {
  heartRateBpm: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  galvSkinResponse: number; // Microsiemens
  bodyTemperatureCelsius: number;
  respirationRate: number; // Breaths per minute
}

/**
 * ==============================================================================
 * SECTION 30: TEMPORAL ANCHORS, HISTORICAL PATTERN MATCHING & PREDICTIVE CHRONOLOGY
 * ==============================================================================
 * Types for cyclical historical analysis, temporal anchors, predictive chronology,
 * and pattern matching across multi-decade financial and geopolitical cycles.
 */

export interface TemporalAnchor {
  anchorId: string;
  targetTimestamp: number;
  description: string;
  historicalContext: LocalizedString;
  alignmentScore: number; // 0.0 to 1.0
  cyclicalPeriodYears: number; // e.g., 8.6 years (Martin Armstrong cycle), 50 years (Kondratiev wave)
}

export interface HistoricalPrecedent {
  precedentId: string;
  eventName: string;
  dateOccurred: string;
  economicConditions: {
    inflationLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'HYPER';
    interestRateEnvironment: 'RISING' | 'FALLING' | 'STABLE';
    geopoliticalTensionIndex: number; // 1 to 10
  };
  outcomeNarrative: LocalizedString;
  similarityIndex: number; // 0.0 to 1.0
}

export interface HistoricalPattern {
  patternId: string;
  name: string;
  description: string;
  historicalPrecedents: HistoricalPrecedent[];
  mathematicalModel: 'FIBONACCI_RETRACEMENT' | 'ELLIOTT_WAVE' | 'FOURIER_TRANSFORM' | 'MARKOV_CHAIN' | 'NEURAL_LSTM';
  correlationCoefficient: number; // -1.0 to 1.0
  predictiveAccuracy: number; // 0.0 to 1.0
}

export interface TimelineEvent {
  predictedTimestamp: number;
  eventDescription: string;
  probability: number; // 0.0 to 1.0
  potentialImpactScore: number; // 1 to 10
  triggerConditions: string[];
}

export interface PredictiveChronology {
  chronologyId: string;
  targetAsset: string;
  forecastHorizonDays: number;
  timelineEvents: TimelineEvent[];
  confidenceIntervals: {
    timestamp: number;
    p10: number; // 10th percentile price/value
    p50: number; // Median
    p90: number; // 90th percentile
  }[];
}


/**
 * ==============================================================================
 * SECTION 31: GENESIS ENGINE, SIMULATION PARAMETERS & ECOSYSTEM EVOLUTION
 * ==============================================================================
 * Types governing the multi-agent macroeconomic simulation engine, tick-based
 * state machines, ecosystem KPIs, macroeconomic shocks, and evolutionary reports.
 */

export interface MacroeconomicShock {
  shockId: string;
  name: string;
  type: 'INFLATIONARY_SPIKE' | 'LIQUIDITY_CRUNCH' | 'REGULATORY_CRACKDOWN' | 'TECHNOLOGICAL_SINGULARITY' | 'GEOPOLITICAL_CONFLICT';
  magnitude: number; // Scale of 0.0 to 1.0
  durationTicks: number;
  affectedSectors: string[];
  decayRate: number; // How fast the shock dissipates per tick
}

export interface AgentBehaviorProfile {
  profileId: string;
  agentType: 'CONSUMER' | 'PRODUCER' | 'SPECULATOR' | 'ARBITRAGEUR' | 'INSTITUTIONAL_HEDGER';
  riskAversion: number; // 0.0 to 1.0
  timePreference: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM' | 'GENERATIONAL';
  rationalityIndex: number; // 0.0 (pure noise) to 1.0 (perfect utility maximization)
  liquidityThreshold: number; // Minimum cash reserves before panic selling
}

export interface GenesisEngineConfig {
  simulationId: string;
  name: string;
  tickRateMs: number;
  totalTicksToRun: number;
  currentTick: number;
  initialCapitalDistribution: {
    totalSovereignWealth: ActiveOrHistoricCurrencyAndAmount;
    totalRetailLiquidity: ActiveOrHistoricCurrencyAndAmount;
    totalInstitutionalReserves: ActiveOrHistoricCurrencyAndAmount;
  };
  activeShocks: MacroeconomicShock[];
  agentProfiles: AgentBehaviorProfile[];
  isPaused: boolean;
}

export interface EcosystemEvolutionReport {
  reportId: string;
  simulationId: string;
  startTick: number;
  endTick: number;
  gdpGrowth: number;
  giniCoefficient: number; // Measure of wealth inequality (0.0 to 1.0)
  systemicStabilityIndex: number; // 0.0 (imminent collapse) to 1.0 (perfect equilibrium)
  dominantAgentStrategy: string;
  evolutionaryMilestones: {
    tick: number;
    milestoneType: 'EMERGENCE' | 'EXTINCTION' | 'PARADIGM_SHIFT';
    description: string;
  }[];
}

export interface SimulationState {
  engineConfig: GenesisEngineConfig;
  kpis: EcosystemKPIs;
  recentEvents: SimulationEvent[];
  evolutionReport?: EcosystemEvolutionReport;
}

/**
 * ==============================================================================
 * SECTION 32: STRIPE NEXUS, CHARGEBACKS, DISPUTES & REVENUE RECONCILIATION
 * ==============================================================================
 * Types governing Stripe payment integrations, dispute evidence submissions,
 * automated chargeback mitigation, and multi-source revenue reconciliation.
 */

export interface DisputeEvidence {
  accessActivityLog?: string;
  billingAddress?: string;
  customerCommunication?: string;
  customerSignature?: string;
  duplicateChargeDocumentation?: string;
  receipt?: string;
  refundPolicy?: string;
  serviceDocumentation?: string;
  shippingDocumentation?: string;
  uncategorizedFile?: string;
}

export interface StripeDispute {
  disputeId: string;
  chargeId: string;
  amount: number;
  currency: string;
  reason: 'general' | 'fraudulent' | 'unrecognized' | 'duplicate' | 'subscription_canceled' | 'product_not_received' | 'product_unacceptable';
  status: 'warning_needs_response' | 'warning_under_review' | 'needs_response' | 'under_review' | 'won' | 'lost';
  evidenceDueBy: string;
  evidence: DisputeEvidence;
  isSubmitted: boolean;
  metadata?: Record<string, string>;
}

export interface StripeRefund {
  refundId: string;
  chargeId: string;
  amount: number;
  currency: string;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge';
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  createdAt: number;
}

export interface StripePayout {
  payoutId: string;
  amount: number;
  currency: string;
  arrivalDate: string;
  status: 'paid' | 'pending' | 'in_transit' | 'canceled' | 'failed';
  method: 'standard' | 'instant';
  bankAccountMask: string;
}

export interface StripeTransfer {
  transferId: string;
  amount: number;
  currency: string;
  destinationAccountId: string;
  sourceTransactionId?: string;
  description?: string;
}

export interface RevenueReconciliationRule {
  ruleId: string;
  name: string;
  sourceA: 'STRIPE' | 'PLAID' | 'MODERN_TREASURY' | 'INTERNAL_LEDGER';
  sourceB: 'STRIPE' | 'PLAID' | 'MODERN_TREASURY' | 'INTERNAL_LEDGER';
  matchingCriteria: {
    fieldA: string;
    fieldB: string;
    tolerance?: number; // For numeric or date tolerances
  }[];
  autoResolve: boolean;
  isActive: boolean;
}

export interface ReconciliationMatch {
  matchId: string;
  ruleId: string;
  entityAId: string;
  entityBId: string;
  amountA: number;
  amountB: number;
  timestampA: string;
  timestampB: string;
  status: 'MATCHED' | 'DISCREPANCY' | 'UNMATCHED';
  discrepancyReason?: string;
}

export interface StripeNexusConfig {
  webhookSecret: string;
  publishableKey: string;
  restrictedApiKeys: string[];
  connectedAccounts: {
    accountId: string;
    businessName: string;
    status: 'ACTIVE' | 'PENDING' | 'RESTRICTED';
  }[];
  disputeRules: StripeDispute[];
  reconciliationRules: RevenueReconciliationRule[];
}

/**
 * ==============================================================================
 * SECTION 33: COMPLIANCE ORACLE, SANCTIONS SCREENING & AML TRANSACTION MONITORING
 * ==============================================================================
 * Types governing anti-money laundering (AML) transaction monitoring, OFAC/PEP
 * sanctions screening, Suspicious Activity Report (SAR) filings, and compliance audits.
 */

export interface SanctionsScreeningRequest {
  requestId: string;
  entityName: string;
  entityType: 'INDIVIDUAL' | 'ORGANIZATION' | 'VESSEL' | 'AIRCRAFT';
  dateOfBirth?: string;
  countryOfOrigin?: string;
  nationalId?: string;
}

export interface SanctionsMatchDetail {
  listName: string; // e.g., "OFAC SDN", "EU Consolidated List"
  entryName: string;
  matchScore: number; // 0.0 to 1.0
  remarks?: string;
  aliases?: string[];
}

export interface SanctionsScreeningResult {
  requestId: string;
  status: 'CLEARED' | 'POTENTIAL_MATCH' | 'CONFIRMED_MATCH';
  screeningTimestamp: string;
  matches: SanctionsMatchDetail[];
  analystReviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
}

export interface PepCheckResult {
  isPep: boolean;
  pepLevel?: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4'; // Level 1 is highest (Heads of State)
  sourceList: string;
  politicalOfficeHeld?: string;
  riskScore: number; // 0.0 to 100.0
}

export interface AmlTransactionMonitoringRule {
  ruleId: string;
  name: string;
  description: string;
  triggerCondition: {
    metric: 'VELOCITY_24H' | 'SINGLE_TRANSACTION_LIMIT' | 'RAPID_FUNDS_FLOW' | 'STRUCTURING_DETECTION';
    threshold: number;
    currency?: string;
  };
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isActive: boolean;
}

export interface AmlAlert {
  alertId: string;
  ruleId: string;
  userId: string;
  transactionIds: string[];
  riskScore: number;
  status: 'NEW' | 'UNDER_INVESTIGATION' | 'DISMISSED_FALSE_POSITIVE' | 'ESCALATED_TO_SAR';
  assignedInvestigatorId?: string;
  createdAt: string;
  notes: string[];
}

export interface SarFiling {
  sarId: string;
  alertId: string;
  filingAgency: 'FinCEN' | 'FCA' | 'BaFin' | 'AMF';
  suspectDetails: {
    fullName: string;
    ssnOrTaxId?: string;
    address?: string;
    occupation?: string;
  };
  narrativeSummary: string;
  financialImpact: ActiveOrHistoricCurrencyAndAmount;
  status: 'DRAFT' | 'PENDING_INTERNAL_APPROVAL' | 'SUBMITTED' | 'REJECTED';
  submissionReceiptId?: string;
  submittedAt?: string;
}

export interface ComplianceOracleState {
  screeningRulesCount: number;
  activeAmlRules: AmlTransactionMonitoringRule[];
  pendingAlerts: AmlAlert[];
  recentSarFilings: SarFiling[];
  lastAuditTimestamp: string;
}

/**
 * ==============================================================================
 * SECTION 34: GLOBAL SSI HUB, DECENTRALIZED IDENTIFIERS (DIDs) & VERIFIABLE CREDENTIALS
 * ==============================================================================
 * Types governing W3C Decentralized Identifiers (DIDs), Verifiable Credentials (VCs),
 * Verifiable Presentations (VPs), and zero-knowledge credential proofs.
 */

export interface DidVerificationMethod {
  id: string;
  type: 'Ed25519VerificationKey2020' | 'JsonWebKey2020' | 'X25519KeyAgreementKey2020';
  controller: string;
  publicKeyJwk?: Record<string, any>;
  publicKeyMultibase?: string;
}

export interface DidDocument {
  context: string[];
  id: string; // e.g., "did:ion:1234..." or "did:key:z6M..."
  verificationMethod: DidVerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement?: string[];
  service?: {
    id: string;
    type: string;
    serviceEndpoint: string;
  }[];
}

export interface CredentialSubject {
  id: string; // The DID of the subject
  [key: string]: any; // Arbitrary claims (e.g., ageOver21: true, kycStatus: "PASSED")
}

export interface VerifiableCredential {
  context: string[];
  id: string;
  type: string[];
  issuer: string; // DID of the issuer
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    jws: string;
  };
}

export interface VerifiablePresentation {
  context: string[];
  id: string;
  type: string[];
  verifiableCredential: VerifiableCredential[];
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    challenge: string;
    domain: string;
    jws: string;
  };
}

export interface PresentationDefinition {
  id: string;
  input_descriptors: {
    id: string;
    purpose?: string;
    schema: {
      uri: string;
    }[];
    constraints?: {
      fields?: {
        path: string[];
        filter?: Record<string, any>;
      }[];
    };
  }[];
}

export interface ZkCredentialProof {
  proofId: string;
  provingSystem: 'Groth16' | 'Plonk';
  circuitIdentifier: string;
  publicInputs: {
    credentialSchemaUri: string;
    issuerDid: string;
    revealedClaims: Record<string, any>;
  };
  proofBytes: string; // Base64 encoded zk-SNARK proof
}

export interface SsiHubState {
  userDidDocument: DidDocument | null;
  issuedCredentials: VerifiableCredential[];
  receivedPresentations: VerifiablePresentation[];
  activePresentationDefinitions: PresentationDefinition[];
  isSyncing: boolean;
}

/**
 * ==============================================================================
 * SECTION 35: DEVELOPER HUB, API PLAYGROUND & INTERACTIVE SCHEMA EXPLORER
 * ==============================================================================
 * Types governing developer portal configurations, API key management,
 * interactive API playground requests/responses, and schema node trees.
 */

export interface RateLimitPolicy {
  policyId: string;
  tierName: 'SANDBOX' | 'STANDARD' | 'ENTERPRISE' | 'UNLIMITED';
  requestsPerSecond: number;
  requestsPerMonth: number;
  burstCapacity: number;
}

export interface DeveloperHubConfig {
  developerId: string;
  organizationName: string;
  apiKeys: APIKey[];
  activeRateLimitPolicy: RateLimitPolicy;
  webhookEndpoints: {
    endpointId: string;
    url: string;
    description?: string;
    secretKey: string;
    subscribedEvents: string[];
    isActive: boolean;
  }[];
}

export interface ApiPlaygroundRequest {
  requestId: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  bodyPayload?: string; // JSON string
  timestamp: string;
}

export interface ApiPlaygroundResponse {
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
  bodyPayload: string; // JSON string
  responseTimeMs: number;
  timestamp: string;
}

export interface SchemaNode {
  nodeId: string;
  name: string;
  type: 'OBJECT' | 'ARRAY' | 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ENUM' | 'REF';
  description: string;
  isRequired: boolean;
  children?: SchemaNode[];
  enumOptions?: string[];
  refSchemaId?: string;
}

export interface InteractiveExecutionLog {
  logId: string;
  timestamp: string;
  eventType: 'API_CALL' | 'WEBHOOK_SENT' | 'RATE_LIMIT_EXCEEDED' | 'SIGNATURE_VERIFICATION_FAILED';
  message: string;
  metadata?: Record<string, any>;
}

export interface DeveloperHubState {
  config: DeveloperHubConfig;
  playgroundHistory: {
    request: ApiPlaygroundRequest;
    response: ApiPlaygroundResponse;
  }[];
  schemaTree: Record<string, SchemaNode>;
  executionLogs: InteractiveExecutionLog[];
}/**
 * ==============================================================================
 * SECTION 36: COMPATIBILITY ALIASES, LEGACY WRAPPERS & DATA PIPELINE TELEMETRY
 * ==============================================================================
 * Legacy wrappers, compatibility aliases, and data pipeline telemetry structures
 * to ensure seamless integration across all micro-frontends and banking modules.
 */

export type AppView = View;

export interface PortfolioAsset {
  id: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  assetClass: string;
  riskLevel: string;
}

export interface InternalAccount {
  id: string;
  productName: string;
  displayAccountNumber: string;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance: number;
  availableBalance: number;
  institutionName: string;
  connectionId: string;
}

export interface Pipeline {
  id: string;
  name: string;
  pipelineName: string;
  status: string;
  prettyDuration: string;
}

export interface InboundBlob {
  id: string;
  filePath: string;
  status: string;
  vendorName: string;
  interfaceType: string;
  createdAt: string;
}

export interface FundFlow {
  id: string;
  name: string;
  ledgerId: string;
  postedTxCount: number;
  pendingTxCount: number;
}

export interface AuthorizedApp {
  id: string;
  name: string;
  description: string;
  status: string;
  authorizedAt: string;
  scopes?: string[];
}

export interface Portfolio {
  id: string;
  name: string;
  type: string;
  currency: string;
  totalValue: number;
  unrealizedGainLoss: number;
  todayGainLoss: number;
  lastUpdated: string;
  riskTolerance: string;
  holdings: any[];
}

export interface AccountDetails {
  id: string;
  name: string;
  mask: string;
  currentBalance: number;
  type: string;
  accountHolder: string;
  currency: string;
}

export interface PaymentOrder {
  id: string;
  counterpartyId: string;
  counterpartyName: string;
  accountId: string;
  amount: number;
  currency: string;
  direction: 'credit' | 'debit';
  status: 'needs_approval' | 'approved' | 'denied' | 'paid';
  date: string;
  type: string;
  dueDate?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  counterpartyName: string;
  dueDate: string;
  amount: number;
  status: 'overdue' | 'unpaid' | 'paid';
}

export interface PlaidMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id: string;
}

export interface SecurityProfile {
  lastLogin: string;
  mfaEnabled: boolean;
}

/**
 * ==============================================================================
 * SECTION 37: QUANTUM CRYPTOGRAPHY, ZERO-KNOWLEDGE PROOFS & MULTI-PARTY COMPUTATION (MPC)
 * ==============================================================================
 * Advanced cryptographic primitives, key exchange states, and multi-party
 * computation session parameters for secure, decentralized asset custody.
 */

export interface MpcKeyShare {
  shareId: number;
  totalShares: number;
  threshold: number;
  encryptedShare: string;
  publicKeyDerivationPath: string;
  hsmKeyId?: string;
}

export interface MpcSession {
  sessionId: string;
  initiatorNodeId: string;
  participatingNodeIds: string[];
  status: 'PENDING' | 'KEY_GENERATION' | 'SIGNING' | 'COMPLETED' | 'FAILED';
  roundNumber: number;
  maxRounds: number;
  commitmentHashes: Record<string, string>;
  signatureShares: Record<string, string>;
  createdAt: string;
  expiresAt: string;
}

export interface ZkSnarkVerificationKey {
  alphaG1: string;
  betaG2: string;
  gammaG2: string;
  deltaG2: string;
  ic: string[];
}

export interface ZkSnarkProof {
  a: string[];
  b: string[][];
  c: string[];
}

/**
 * ==============================================================================
 * SECTION 38: NEURAL INTERFACE TELEMETRY & COGNITIVE LOAD BALANCING
 * ==============================================================================
 * Detailed EEG band power, cognitive fatigue metrics, and neural-lace calibration
 * parameters for high-frequency trading environments and biometric feedback loops.
 */

export interface EegBandPower {
  delta: number; // 0.5 - 4 Hz
  theta: number; // 4 - 8 Hz
  alpha: number; // 8 - 12 Hz
  beta: number;  // 12 - 30 Hz
  gamma: number; // 30 - 100 Hz
}

export interface NeuralCalibrationParameters {
  baselineAlphaPower: number;
  baselineBetaPower: number;
  artifactThresholdMicrovolts: number;
  electrodeImpedanceOhms: Record<string, number>;
  lastCalibratedAt: string;
}

export interface CognitiveFatigueMetrics {
  blinkRatePerMinute: number;
  saccadeVelocityDegSec: number;
  pupilDilationMm: number;
  microSleepEpisodesCount: number;
  fatigueIndex: number; // 0.0 to 1.0
}

/**
 * ==============================================================================
 * SECTION 39: TEMPORAL CHRONOLOGY & CYCLICAL HISTORICAL PATTERN MATCHING
 * ==============================================================================
 * Detailed Fourier analysis parameters, Kondratiev wave states, and historical
 * correlation matrices for cyclical historical analysis and predictive chronology.
 */

export interface FourierAnalysisParameters {
  samplingFrequencyHz: number;
  windowSizeSamples: number;
  dominantFrequencies: number[];
  spectralDensity: number[];
}

export interface KondratievWaveState {
  currentPhase: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
  yearsInPhase: number;
  estimatedPhaseTransitionYear: number;
  debtDeflationPressureIndex: number; // 0.0 to 1.0
}

export interface HistoricalCorrelationMatrix {
  assetClassA: string;
  assetClassB: string;
  correlationCoefficient: number;
  timeLagDays: number;
  confidenceInterval: { lower: number; upper: number };
}

/**
 * ==============================================================================
 * SECTION 40: GENESIS ENGINE MACROECONOMIC SHOCKS & EVOLUTIONARY AGENT BEHAVIORS
 * ==============================================================================
 * Detailed agent utility functions, Gini coefficient calculation states, and
 * systemic stability metrics for the multi-agent macroeconomic simulation engine.
 */

export interface AgentUtilityFunction {
  riskAversionCoefficient: number;
  intertemporalElasticityOfSubstitution: number;
  leisurePreferenceWeight: number;
  discountFactor: number;
}

export interface GiniCoefficientCalculationState {
  populationSize: number;
  cumulativeWealthShare: number[];
  cumulativePopulationShare: number[];
  calculatedGini: number; // 0.0 to 1.0
}

export interface SystemicStabilityMetrics {
  leverageRatioSystemWide: number;
  liquidityCoverageRatioSystemWide: number;
  interbankContagionRiskIndex: number; // 0.0 to 1.0
  probabilityOfSystemicDefault: number; // 0.0 to 1.0
}import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}
/**
 * ==============================================================================
 * SECTION 3: EXECUTIVE MAGAZINE & MULTIMEDIA CREATION TYPES
 * ==============================================================================
 * Types governing the generation, layout, rendering, and narration of high-end
 * digital publications, executive lookbooks, and AI-driven multimedia assets.
 */

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
  'Wall Street Boardroom',
  'Silicon Valley Tech Campus',
  'Dubai Skyscraper Penthouse',
  'Paris Fashion Week Front Row',
  'Private Island Villa',
  'Luxury Private Jet',
  'Monaco Yacht Deck',
  'Swiss Alps Davos Summit'
];

export const STYLES = [
  'Power Suit (Classic Bespoke)',
  'Tech Mogul (Minimalist Luxury)',
  'Black Tie Gala (Formal)',
  'Avant-Garde Executive (Bold)',
  'Old Money (Quiet Luxury)',
  'Streetwear CEO (High-End Casual)'
];

export type RenderingEngine = 'stable-diffusion' | 'midjourney' | 'dall-e-3' | 'flux' | 'imagen' | 'custom-gan';

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
  lighting?: string;
  cameraAngle?: string;
  colorPalette?: string[];
  historicalReference?: string;
  brandTags?: string[];
}

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  videoUrl?: string;
  isAnimating?: boolean;
  audioUrl?: string;
  narrationText?: string;
  renderingEngine?: RenderingEngine;
  promptUsed?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  seed?: number;
  cfgScale?: number;
  steps?: number;
  generationTimeMs?: number;
  error?: string;
}

export interface Asset {
  id: string;
  base64: string;
  desc: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  body: string;
  elements: VisualElement[];
}

export interface VisualElement {
  id: string;
  type: 'image' | 'seal' | 'divider' | 'illustration' | 'scenery';
  src: string;
  position: { x: number; y: number };
  alt: string;
  isAnimated?: boolean;
  scale?: number;
  rotation?: number;
}

export enum AIServiceAction {
  REWRITE = 'REWRITE',
  ILLUMINATE = 'ILLUMINATE',
  PROPHESY = 'PROPHESY',
  SEAL = 'SEAL',
  CIPHER = 'CIPHER',
  SCENERY = 'SCENERY',
  ENCHANT = 'ENCHANT'
}

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Ariel' | 'Oberon' | 'Titania';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  sampleRateHz?: number;
  languageCode?: string;
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
  audioUrl?: string;
  durationMs?: number;
  characterCount: number;
}

/**
 * ==============================================================================
 * SECTION 4: NEWS, FEEDS & SENTIMENT ANALYSIS TYPES
 * ==============================================================================
 * Structures governing real-time financial news aggregation, sentiment analysis,
 * urgency scoring, and AI-driven market insights.
 */

export enum StaticCategory {
  TOP_STORIES = 'Global Pulse',
  POLITICS = 'Governance',
  TECH = 'Infrastructure',
  FINANCE = 'Markets',
  CRYPTO = 'Decentralized Ledger',
  ENERGY = 'Thermodynamics',
  BIOTECH = 'Genomics',
  SPACE = 'Orbital Mechanics'
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: number; // Scale of 1-10
  tags: string[];
  author?: string;
  content?: string;
  imageUrl?: string;
  sentimentScore?: number; // Continuous value from -1.0 to 1.0
  relevanceScore?: number; // Continuous value from 0.0 to 1.0
  language?: string;
  isFactChecked?: boolean;
  factCheckDetails?: string;
  biasRating?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  relatedTickers?: string[];
}

export interface FeedPage {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  lastUpdated: string;
  aiInsights: string;
  curatorId?: string;
  isPublic: boolean;
  subscriberCount?: number;
  customFilterCriteria?: FilterCriterion[];
}

/**
 * ==============================================================================
 * SECTION 5: FILE SYSTEM, STORAGE & CLOUD MANAGEMENT TYPES
 * ==============================================================================
 * Types governing local and cloud file systems, indexing, AI-assisted summaries,
 * and multi-source repository exploration.
 */

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  GENERIC = 'generic',
  CODE = 'code',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  DATABASE = 'database',
  MODEL_3D = 'model_3d'
}

export type FileSource = 'local' | 'github' | 'ai' | 'google-drive' | 'aws-s3' | 'ipfs' | 'dropbox';

export interface FileVersion {
  versionId: string;
  modifiedBy: string;
  modifiedAt: string;
  size: number;
  changeLog?: string;
  downloadUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string | null;
  source: FileSource;
  extension?: string;
  mimeType?: string;
  content?: string; // Text, DataURL, or Download URL
  aiSummary?: string;
  aiKeywords?: string[];
  isIndexing?: boolean;
  githubRepo?: string;
  githubOwner?: string;
  githubUrl?: string;
  driveFileId?: string;
  isCloudFolder?: boolean;
  ownerId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  versionHistory?: FileVersion[];
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  hash?: string;
  tags?: string[];
}

export interface NavigationState {
  currentPath: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid' | 'gallery' | 'tree' | 'kanban';
  sortBy: 'name' | 'size' | 'lastModified' | 'type';
  sortDirection: 'asc' | 'desc';
  searchQuery?: string;
  filterType?: FileType | 'all';
}

/**
 * ==============================================================================
 * SECTION 6: CORE BANKING, TRANSACTIONS & CAPITAL ALLOCATION TYPES
 * ==============================================================================
 * Foundational types for personal and corporate banking, ledger accounts,
 * transaction processing, and AI-driven financial planning.
 */

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'fedwire' | 'rtp';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'credit' | 'debit';

export type TransactionStatus =
  | 'POSTED'
  | 'PENDING'
  | 'Initiated'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'needs_approval'
  | 'approved'
  | 'denied'
  | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string | string[];
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: KeyValuePairs;
  pending?: boolean;
  reconciled?: boolean;
  reconciliation_id?: string;
  nexus_link_id?: string;
  institution_origin?: string;
  cardId?: string;
  holderName?: string;
  merchant?: string;
  status?: TransactionStatus;
  timestamp?: string;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string;
  assetClass?: string;
  riskLevel?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining?: number;
  category?: string;
  alerts?: Alert[];
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
  credits: number;
}

export interface AIPlanStep {
  title: string;
  description: string;
  timeline: string;
  category?: string;
}

export interface AIPlan {
  title: string;
  summary: string;
  steps: AIPlanStep[];
}

export type IllusionType = 'none' | 'aurora' | 'blue' | 'dark';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  institutionId?: string;
  type?: string;
  balance?: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: string;
}

export enum WeaverStage {
  Pitch = 'pitch',
  Analysis = 'analysis',
  Test = 'test',
  FinalReview = 'final_review',
  Approved = 'approved',
  Results = 'results',
  Error = 'error'
}

export interface QuantumWeaverState {
  stage: WeaverStage;
  businessPlan: string;
  feedback: string;
  questions: AIQuestion[];
  loanAmount: number;
  coachingPlan: AIPlan | null;
  error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  aiJustification?: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress?: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCardControls {
  atm: boolean;
  contactless: boolean;
  online: boolean;
  monthlyLimit: number;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: CorporateCardControls;
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description?: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Counterparty {
  id: string;
  name: string;
  email?: string | null;
  send_remittance_advice?: boolean;
  type?: 'business' | 'individual';
  riskLevel?: 'Low' | 'Medium' | 'High';
  createdDate?: string;
  accounts: ExternalAccount[];
  virtualAccounts: VirtualAccount[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name?: string;
  verification_status?: string;
  account_details?: any[];
  routing_details?: any[];
}

export interface VirtualAccount {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  balance?: number;
  currency?: string;
  status?: string;
  subAccounts?: VirtualAccount[];
  description?: string;
  counterparty_id?: string;
  internal_account_id?: string;
  debit_ledger_account_id?: string;
  credit_ledger_account_id?: string;
  metadata?: any;
  account_details?: any[];
  routing_details?: any[];
}

export interface AIGoalPlanStep {
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Investing' | 'Income' | string;
}

export interface AIGoalPlan {
  feasibilitySummary: string;
  monthlyContribution: number;
  steps: AIGoalPlanStep[];
  actionableSteps?: string[];
  summary?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'recurring';
}

export interface RecurringContribution {
  id: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface LinkedGoal {
  id: string;
  relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
  triggerAmount?: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  iconName: string;
  plan: AIGoalPlan | null;
  startDate: string;
  riskProfile?: RiskProfile;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  linkedGoals: LinkedGoal[];
  recurringContributions: RecurringContribution[];
  contributions: Contribution[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number; // in reward points
  type: 'cashback' | 'giftcard' | 'impact' | string;
  description: string;
  iconName: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini' | string;

export interface APIStatus {
  provider: APIProvider;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number; // in ms
}

export interface CreditFactor {
  name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix' | string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}
/**
 * ==============================================================================
 * SECTION 7: PLAID, MARQETA, MODERN TREASURY & OPEN BANKING INTEGRATION TYPES
 * ==============================================================================
 * Enterprise-grade types governing secure connections, credential management,
 * card issuance, ledgering, and multi-node financial mesh protocols.
 */

export interface PlaidCredentials {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

export interface MarqetaCredentials {
  app_token?: string;
  admin_token?: string;
  applicationToken?: string;
  adminAccessToken?: string;
  base_url?: string;
}

export interface ModernTreasuryCredentials {
  apiKey: string;
  orgId?: string;
  organizationId?: string;
}

export interface PlaidTokenState {
  linkToken: string | null;
  publicToken: string | null;
  accessToken: string | null;
}

export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: AccountBalance;
  institution?: string;
}

export interface ConnectedItem {
  institutionId: string;
  institutionName: string;
  accessToken: string;
  itemId: string;
  accounts: Account[];
  transactions: Transaction[];
  metadata: {
    linked_at: string;
    node_priority: number;
    mesh_protocol: 'NEXUS-V3' | string;
    routing_hops: string[];
  };
}

export interface UCCFiling {
  id: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Filed' | 'Rejected';
  receiptId?: string;
  fileNumber?: string;
  packetNum: string;
  transType: 'Initial' | 'Amendment';
  amount: number;
  dateCreated: string;
  xmlPayload: string;
  errors?: string[];
}

export interface UnifiedPayload {
  timestamp: string;
  nexus_version: string;
  nexus_id: string;
  global_metadata: {
    client_context: string;
    reconciliation_depth: number;
    combined_hash: string;
  };
  mesh_stats: {
    total_liquidity: number;
    total_liabilities: number;
    net_position: number;
    active_institutions: number;
  };
  cross_institutional_ledger: {
    items: ConnectedItem[];
    reconciled_pairs: any[];
  };
  compliance: {
    active_ucc_filings: UCCFiling[];
  };
}

export enum FlowStep {
  CREDENTIALS = 'CREDENTIALS',
  LINK_TOKEN = 'LINK_TOKEN',
  LINK_UI = 'LINK_UI',
  EXCHANGE = 'EXCHANGE',
  DASHBOARD = 'DASHBOARD',
  UCC_CENTER = 'UCC_CENTER',
  MARQETA_NODE = 'MARQETA_NODE',
  MODERN_TREASURY_NODE = 'MODERN_TREASURY_NODE',
  TAXONOMY_REGISTRY = 'TAXONOMY_REGISTRY'
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  created_time?: string;
  start_date?: string;
  config: any;
}

export interface MarqetaCard {
  token: string;
  user_token: string;
  card_product_token: string;
  last_four: string;
  pan: string;
  expiration: string;
  cvv: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | string;
}

export interface MTLedger {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, string>;
}

export interface MTInternalAccount {
  id: string;
  name: string;
  currency: string;
  connection: { vendor_name: string };
  status: string;
}

export interface PlaidLinkSuccessMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id?: string;
}

export type PlaidProduct =
  | 'assets'
  | 'auth'
  | 'balance'
  | 'identity'
  | 'investments'
  | 'liabilities'
  | 'payment_initiation'
  | 'transactions';

export interface MarqetaUser {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  last_modified_time: string;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns?: string;
  };
  provider?: any;
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface LedgerAccount {
  id: string;
  name: string;
  balances: {
    available_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
    posted_balance: { amount: number; currency: string };
  };
}

export interface SettlementInstruction {
  messageId: string;
  creationDateTime: string;
  numberOfTransactions: number;
  settlementDate: string;
  totalAmount: number;
  currency: string;
  purpose?: string;
}

/**
 * ==============================================================================
 * SECTION 8: ENTERPRISE OPERATIONS, CORPORATE COMMAND, COMPLIANCE & ISO 20022
 * ==============================================================================
 * Types governing corporate command centers, compliance audits, anomaly detection,
 * cash flow forecasting, and ISO 20022 financial messaging standards.
 */

export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore?: number;
  recommendedAction?: string;
}

export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

export interface FraudRule {
  id: string;
  name: string;
  description?: string;
  severity: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
}

export interface ComplianceCase {
  id: string;
  reason: string;
  entityType: string;
  entityId: string;
  status: 'open' | 'closed' | 'investigating' | string;
  openedDate: string;
  type?: string;
  description?: string;
}

export interface FinancialAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: AnomalyStatus;
  entityType: string;
  entityId: string;
  entityDescription: string;
  timestamp: string;
  riskScore: number;
}

export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'False Positive';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  action: 'flag_for_review' | 'block' | 'notify_admin' | string;
  active: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  revenue: number;
  growth: number;
  riskScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetResource: string;
  success: boolean;
  details?: string;
  metadata?: any;
  ipAddress?: string;
}

export interface ThreatAlert {
  alertId: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataSharingPolicy {
  policyId: string;
  policyName: string;
  scope: string;
  isActive: boolean;
  lastReviewed: string;
}

export interface APIKey {
  id: string;
  keyName: string;
  creationDate: string;
  scopes: string[];
  lastUsed?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  verified: boolean;
}

export interface SecurityAwarenessModule {
  moduleId: string;
  title: string;
  completionRate: number;
}

export interface TransactionRule {
  ruleId: string;
  name: string;
  triggerCondition: string;
  action: string;
  isEnabled: boolean;
}

export interface SecurityScoreMetric {
  metricName: string;
  currentValue: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  lastActivity: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  permissions: string[];
  status: string;
  firstSeen: string;
  userAgent: string;
  pushNotificationsEnabled: boolean;
  biometricAuthEnabled: boolean;
  encryptionStatus: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  timestamp: string;
  isCurrent: boolean;
  userAgent: string;
}

export interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password?: string;
  databaseName: string;
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full';
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface WebDriverStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  activeTask: string | null;
  logs: string[];
}

export interface ExternalCorporateActionEventType1Code {}
export interface ExternalAcceptedReason1Code {}
export interface ExternalAccountIdentification1Code {}
export interface ExternalAgentInstruction1Code {}
export interface ExternalAgreementType1Code {}
export interface ExternalAuthenticationChannel1Code {}
export interface ExternalAuthenticationMethod1Code {}
export interface ExternalAuthorityExchangeReason1Code {}
export interface ExternalAuthorityIdentification1Code {}
export interface ExternalBalanceSubType1Code {}
export interface ExternalBalanceType1Code {}
export interface ExternalBankTransactionDomain1Code {}
export interface ExternalBankTransactionFamily1Code {}
export interface ExternalBankTransactionSubFamily1Code {}
export interface ExternalBenchmarkCurveName1Code {}
export interface ExternalBillingBalanceType1Code {}
export interface ExternalBillingCompensationType1Code {}
export interface ExternalBillingRateIdentification1Code {}
export interface ExternalCalculationAgent1Code {}
export interface ExternalCancellationReason1Code {}
export interface ExternalCardTransactionCategory1Code {}
export interface ExternalCashAccountType1Code {}
export interface ExternalCashClearingSystem1Code {}
export interface ExternalCategoryPurpose1Code {}
export interface ExternalChannel1Code {}
export interface ExternalChargeType1Code {}
export interface ExternalChequeAgentInstruction1Code {}
export interface ExternalChequeCancellationReason1Code {}
export interface ExternalChequeCancellationStatus1Code {}
export interface ExternalClaimNonReceiptRejection1Code {}
export interface ExternalClearingSystemIdentification1Code {}
export interface ExternalCollateralReferenceDataStatusReason1Code {}
export interface ExternalCommunicationFormat1Code {}
export interface ExternalContractBalanceType1Code {}
export interface ExternalContractClosureReason1Code {}
export interface ExternalCreditLineType1Code {}
export interface ExternalCreditorAgentInstruction1Code {}
export interface ExternalCreditorEnrolmentAmendmentReason1Code {}
export interface ExternalCreditorEnrolmentCancellationReason1Code {}
export interface ExternalCreditorEnrolmentStatusReason1Code {}
export interface ExternalCreditorReferenceType1Code {}
export interface ExternalDateFrequency1Code {}
export interface ExternalDateType1Code {}
export interface ExternalDebtorActivationAmendmentReason1Code {}
export interface ExternalDebtorActivationCancellationReason1Code {}
export interface ExternalDebtorActivationStatusReason1Code {}
export interface ExternalDebtorAgentInstruction1Code {}
export interface ExternalDeviceOperatingSystemType1Code {}
export interface ExternalDiscountAmountType1Code {}
export interface ExternalDocumentAmountType1Code {}
export interface ExternalDocumentFormat1Code {}
export interface ExternalDocumentLineType1Code {}
export interface ExternalDocumentPurpose1Code {}
export interface ExternalDocumentType1Code {}
export interface ExternalEffectiveDateParameter1Code {}
export interface ExternalEmissionAllowanceSubProductType1Code {}
export interface ExternalEncryptedElementIdentification1Code {}
export interface ExternalEnquiryRequestType1Code {}
export interface ExternalEntitySize1Code {}
export interface ExternalEntityType1Code {}
export interface ExternalEntryStatus1Code {}
export interface ExternalFinancialInstitutionIdentification1Code {}
export interface ExternalFinancialInstrumentIdentificationType1Code {}
export interface ExternalFinancialInstrumentProductType1Code {}
export interface ExternalGarnishmentType1Code {}
export interface ExternalIncoterms1Code {}
export interface ExternalIndustrySectorClassification1Code {}
export interface ExternalInformationType1Code {}
export interface ExternalInstructedAgentInstruction1Code {}
export interface ExternalInvestigationAction1Code {}
export interface ExternalInvestigationActionReason1Code {}
export interface ExternalInvestigationExecutionConfirmation1Code {}
export interface ExternalInvestigationInstrument1Code {}
export interface ExternalInvestigationReason1Code {}
export interface ExternalInvestigationReasonSubType1Code {}
export interface ExternalInvestigationServiceLevel1Code {}
export interface ExternalInvestigationStatus1Code {}
export interface ExternalInvestigationStatusReason1Code {}
export interface ExternalInvestigationSubType1Code {}
export interface ExternalInvestigationType1Code {}
export interface ExternalLegalFramework1Code {}
export interface ExternalLetterType1Code {}
export interface ExternalLocalInstrument1Code {}
export interface ExternalMandateReason1Code {}
export interface ExternalMandateSetupReason1Code {}
export interface ExternalMandateStatus1Code {}
export interface ExternalMandateSuspensionReason1Code {}
export interface ExternalMarketArea1Code {}
export interface ExternalMarketInfrastructure1Code {}
export interface ExternalMessageFunction1Code {}
export interface ExternalModelFormIdentification1Code {}
export interface ExternalNarrativeType1Code {}
export interface ExternalNotificationCancellationReason1Code {}
export interface ExternalNotificationSubType1Code {}
export interface ExternalNotificationType1Code {}
export interface ExternalOrganisationIdentification1Code {}
export interface ExternalPackagingType1Code {}
export interface ExternalPartyRelationshipType1Code {}
export interface ExternalPaymentCancellationRejection1Code {}
export interface ExternalPaymentCompensationReason1Code {}
export interface ExternalPaymentControlRequestType1Code {}
export interface ExternalPaymentGroupStatus1Code {}
export interface ExternalPaymentModificationRejection1Code {}
export interface ExternalPaymentRole1Code {}
export interface ExternalPaymentScenario1Code {}
export interface ExternalPaymentTransactionStatus1Code {}
export interface ExternalPendingProcessingReason1Code {}
export interface ExternalPersonIdentification1Code {}
export interface ExternalPostTradeEventType1Code {}
export interface ExternalProductType1Code {}
export interface ExternalProxyAccountType1Code {}
export interface ExternalPurpose1Code {}
export interface ExternalRatesAndTenors1Code {}
export interface ExternalReRepresentmentReason1Code {}
export interface ExternalReceivedReason1Code {}
export interface ExternalRegulatoryInformationType1Code {}
export interface ExternalRejectedReason1Code {}
export interface ExternalRelativeTo1Code {}
export interface ExternalReportingSource1Code {}
export interface ExternalRequestStatus1Code {}
export interface ExternalReservationType1Code {}
export interface ExternalReturnReason1Code {}
export interface ExternalReversalReason1Code {}
export interface ExternalSecuritiesLendingType1Code {}
export interface ExternalSecuritiesPurpose1Code {}
export interface ExternalSecuritiesUpdateReason1Code {}
export interface ExternalServiceLevel1Code {}
export interface ExternalShipmentCondition1Code {}
export interface ExternalStatusReason1Code {}
export interface ExternalSystemBalanceType1Code {}
export interface ExternalSystemErrorHandling1Code {}
export interface ExternalSystemEventType1Code {}
export interface ExternalSystemMemberType1Code {}
export interface ExternalSystemPartyType1Code {}
export interface ExternalTaxAmountType1Code {}
export interface ExternalTechnicalInputChannel1Code {}
export interface ExternalTradeMarket1Code {}
export interface ExternalTradeTransactionCondition1Code {}
export interface ExternalTypeOfParty1Code {}
export interface ExternalUnableToApplyIncorrectData1Code {}
export interface ExternalUnableToApplyMissingData1Code {}
export interface ExternalUnderlyingTradeTransactionType1Code {}
export interface ExternalUndertakingAmountType1Code {}
export interface ExternalUndertakingDocumentType1Code {}
export interface ExternalUndertakingDocumentType2Code {}
export interface ExternalUndertakingStatusCategory1Code {}
export interface ExternalUndertakingType1Code {}
export interface ExternalUnitOfMeasure1Code {}
export interface ExternalValidationRuleIdentification1Code {}
export interface ExternalVerificationReason1Code {}
export interface Biso20022 {}
/**
 * ==============================================================================
 * SECTION 9: SOVEREIGN IDENTITY, USER PROFILES & SOCIAL GRAPH TYPES
 * ==============================================================================
 * Enterprise-grade identity structures, multi-role authorization matrices,
 * neural-lace telemetry, genomic anchors, and decentralized social graph nodes.
 */

export enum View {
  // --- Core ---
  Dashboard = 'dashboard',
  
  // --- Personal Command ---
  Transactions = 'transactions',
  SendMoney = 'send-money',
  Budgets = 'capital-allocation', // Renamed for spec
  FinancialGoals = 'strategic-goals',
  CreditHealth = 'credit-resonance',
  Personalization = 'interface-will',
  Accounts = 'accounts-overview',
  
  // --- Sovereign Wealth ---
  Investments = 'portfolio-overview',
  Crypto = 'web3-crypto',
  CryptoWeb3 = 'web3-crypto', // Added alias
  AlgoTradingLab = 'algo-trading-lab',
  ForexArena = 'forex-arena',
  CommoditiesExchange = 'commodities',
  RealEstateEmpire = 'real-estate',
  ArtCollectibles = 'art-collectibles',
  DerivativesDesk = 'derivatives',
  VentureCapital = 'venture-capital',
  PrivateEquity = 'private-equity',
  TaxOptimization = 'tax-optimization',
  LegacyBuilder = 'legacy-architect',
  SovereignWealth = 'sovereign-wealth-sim',
  QuantumAssets = 'quantum-assets',
  
  // --- Citi Connect Core ---
  CitibankAccounts = 'citi-accounts',
  CitibankAccountProxy = 'citi-account-proxy',
  CitibankBillPay = 'citi-bill-payment',
  CitibankCrossBorder = 'citi-cross-border',
  CitibankPayeeManagement = 'citi-payee-mgmt',
  CitibankStandingInstructions = 'citi-standing-instructions',
  CitibankDeveloperTools = 'citi-dev-tools',
  CitibankEligibility = 'citi-eligibility-check',
  CitibankUnmaskedData = 'citi-secure-data-view',

  // --- Plaid Nexus ---
  PlaidMainDashboard = 'plaid-overview',
  DataNetwork = 'plaid-overview', // Added alias
  PlaidIdentity = 'plaid-identity-verification',
  PlaidCRAMonitoring = 'plaid-cra-monitoring',
  PlaidInstitutions = 'plaid-institutions-explorer',
  PlaidItemManagement = 'plaid-item-management',
  
  // --- Enterprise Operations ---
  CorporateCommand = 'corporate-command',
  ModernTreasury = 'modern-treasury',
  Treasury = 'treasury-capital',
  CardPrograms = 'marqeta-cards',
  Payments = 'stripe-payments',
  StripeNexus = 'stripe-nexus',
  CounterpartyDashboard = 'counterparties',
  VirtualAccounts = 'virtual-accounts',
  CorporateActions = 'corporate-actions',
  CreditNoteLedger = 'credit-notes',
  ReconciliationHub = 'reconciliation-hub',
  GEINDashboard = 'gein-dashboard',
  CardholderManagement = 'cardholder-mgmt',
  VentureCapitalDeskView = 'vc-desk-view',

  // --- System & Intelligence ---
  AIAdvisor = 'ai-advisor',
  AIInsights = 'predictive-insights',
  QuantumWeaver = 'quantum-weaver',
  AgentMarketplace = 'agent-marketplace',
  AIAdStudio = 'ai-ad-studio',
  GlobalPositionMap = 'global-position-map',
  GlobalSsiHub = 'global-ssi-hub',
  SecurityCompliance = 'security-compliance',
  DeveloperHub = 'developer-hub',
  SchemaExplorer = 'iso-20022-explorer',
  ResourceGraph = 'resource-graph',
  TheVision = 'the-vision',
  ApiPlayground = 'api-playground',
  ComplianceOracle = 'compliance-oracle',

  // --- Admin & Tools ---
  CustomerDashboard = 'customer-dashboard',
  VerificationReports = 'verification-reports',
  FinancialReporting = 'financial-reporting',
  StripeNexusDashboard = 'stripe-nexus-admin',

  // --- Components (Direct Access) ---
  AccountDetails = 'account-details',
  AccountList = 'account-list',
  AccountStatementGrid = 'account-statement-grid',
  AccountsView = 'accounts-view',
  AccountVerificationModal = 'account-verification-modal',
  ACHDetailsDisplay = 'ach-details-display',
  AICommandLog = 'ai-command-log',
  AIPredictionWidget = 'ai-prediction-widget',
  AssetCatalog = 'asset-catalog',
  AutomatedSweepRules = 'automated-sweep-rules',
  BalanceReportChart = 'balance-report-chart',
  BalanceTransactionTable = 'balance-transaction-table',
  CardDesignVisualizer = 'card-design-visualizer',
  ChargeDetailModal = 'charge-detail-modal',
  ChargeList = 'charge-list',
  ConductorConfigurationView = 'conductor-configuration-view',
  CounterpartyDetails = 'counterparty-details',
  CounterpartyForm = 'counterparty-form',
  DisruptionIndexMeter = 'disruption-index-meter',
  DocumentUploader = 'document-uploader',
  DownloadLink = 'download-link',
  EarlyFraudWarningFeed = 'early-fraud-warning-feed',
  ElectionChoiceForm = 'election-choice-form',
  EventNotificationCard = 'event-notification-card',
  ExpectedPaymentsTable = 'expected-payments-table',
  ExternalAccountCard = 'external-account-card',
  ExternalAccountForm = 'external-account-form',
  ExternalAccountsTable = 'external-accounts-table',
  FinancialAccountCard = 'financial-account-card',
  IncomingPaymentDetailList = 'incoming-payment-detail-list',
  InvoiceFinancingRequest = 'invoice-financing-request',
  PaymentInitiationForm = 'payment-initiation-form',
  PaymentMethodDetails = 'payment-method-details',
  PaymentOrderForm = 'payment-order-form',
  PayoutsDashboard = 'payouts-dashboard',
  PnLChart = 'pnl-chart',
  RefundForm = 'refund-form',
  RemittanceInfoEditor = 'remittance-info-editor',
  ReportingView = 'reporting-view',
  ReportRunGenerator = 'report-run-generator',
  ReportStatusIndicator = 'report-status-indicator',
  SsiEditorForm = 'ssi-editor-form',
  StripeNexusView = 'stripe-nexus-view',
  StripeStatusBadge = 'stripe-status-badge',
  StructuredPurposeInput = 'structured-purpose-input',
  SubscriptionList = 'subscription-list',
  TimeSeriesChart = 'time-series-chart',
  TradeConfirmationModal = 'trade-confirmation-modal',
  TransactionFilter = 'transaction-filter',
  TransactionList = 'transaction-list',
  TreasuryTransactionList = 'treasury-transaction-list',
  UniversalObjectInspector = 'universal-object-inspector',
  VirtualAccountForm = 'virtual-account-form',
  VirtualAccountsTable = 'virtual-accounts-table',
  VoiceControl = 'voice-control',
  WebhookSimulator = 'webhook-simulator',

  // Educational & 527 Views
  TheBook = 'the-book',
  KnowledgeBase = 'knowledge-base',
  
  // Auth & Settings
  Settings = 'settings',
  SSO = 'sso',
  ConciergeService = 'concierge-service',
  Philanthropy = 'philanthropy',
  OpenBanking = 'open-banking',
  FinancialDemocracy = 'financial-democracy',
  APIStatus = 'api-status',
  APIIntegration = 'api-integration',
  APIConsole = 'api-console',
  SecurityCenter = 'security-center',
  Security = 'security',
  AIStrategy = 'ai-strategy',
  Goals = 'financial-goals',
  Rewards = 'rewards',
  CardCustomization = 'card-customization',
}

export type UserRole =
  | 'ADMIN'
  | 'TRADER'
  | 'CLIENT'
  | 'VISIONARY'
  | 'CARETAKER'
  | 'QUANT_ANALYST'
  | 'SYSTEM_ARCHITECT'
  | 'ETHICS_OFFICER'
  | 'DATA_SCIENTIST'
  | 'NETWORK_WEAVER'
  | 'CITIZEN'
  | 'FOUNDER'
  | 'INVESTOR'
  | 'MANAGER';

export type SecurityLevel =
  | 'STANDARD'
  | 'ELEVATED'
  | 'TRADING_UNLOCKED'
  | 'QUANTUM_ENCRYPTED'
  | 'SOVEREIGN_CLEARED'
  | 'ARCHITECT_LEVEL';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles?: UserRole[];
  securityLevel?: SecurityLevel;
  netWorth?: number;
  display_name?: string;
  handle?: string;
  role?: string;
  businessId?: string;
  profilePictureUrl?: string;
  bio?: string;
  profile?: {
    interests: string[];
    skills: string[];
    [key: string]: any;
  };
  wallet?: {
    balance: number;
    currency: string;
  };
  businesses?: string[];
  memberships?: any[];
  followers?: string[];
  following?: string[];
  state?: {
    mood: string;
    activity: string;
    last_active_tick: number;
    [key: string]: any;
  };
  isAdmin?: boolean;
  title?: string;
  phone?: string;
  loyaltyTier?: string;
  usdBalance?: number;
  fiatBalance?: number;
  cryptoBalance?: number;
  avatarUrl?: string;
  tradingProfile?: any;
  biometricHashV2?: string;
  genomicSignatureId?: string;
  citizenship?: string;
  reputationScore?: number;
  threatVectorIndex?: number;
  neuralLaceSyncStatus?: string;
  cognitiveProfileId?: string;
  activeThoughtStreamId?: string | null;
  lastLoginCoordinates?: GeoCoordinate;
  temporalAnchorId?: string;
  activeSovereignAgentIds?: string[];
  permissionsGridHash?: string;
}

export type UserProfile = User;

export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  text: string;
  timestamp: string;
}

export interface PostContent {
  text: string;
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  financialData?: any;
}

export interface Post {
  id: string;
  author_id: string;
  userName: string;
  userProfilePic: string;
  created_tick: number;
  content: PostContent;
  type: 'text' | 'image' | 'video' | 'link' | 'financial_event';
  tags: string[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  visibility: 'public' | 'connections' | 'private';
  comments: Comment[];
}

export interface LendingPoolStats {
  totalCapital: number;
  interestRate: number;
  activeLoans: number;
  defaultRate: number;
  totalInterestEarned: number;
}

export interface AppIntegration {
  id: string;
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'disconnected' | 'issue';
}

export interface BiometricData {
  id: string;
  type: string;
  publicKey: string;
  enrolledDate: string;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  device?: string;
  browser?: string;
  os?: string;
  location?: string;
  isCurrent?: boolean;
  userAgent?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  specialization: string;
  traffic: number;
}

export interface SynapticVault {
  id: string;
  ownerIds: string[];
  ownerNames: string[];
  status: string;
  masterPrivateKeyFragment: string;
  creationDate: string;
}

export interface EcosystemKPIs {
  currentDate: string;
  totalEcosystemValue: number;
  totalTransactions: number;
  communityPoolCapital: number;
  activeUsers: number;
  gdp: number;
}

export interface SimulationEvent {
  id: string;
  tick: number;
  type: string;
  description: string;
  impact: any;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: 'service' | 'retail' | 'tech' | 'manufacturing' | 'finance' | 'platform';
  monthly_revenue: number;
  expenses: number;
  employees: string[];
  status: 'active' | 'bankrupt' | 'acquired';
  marketing_factor: number; // 0-1 multiplier
  businessPlan?: string;
  valuation?: number;
  cashBalance?: number;
  hqLocation?: string;
}

/**
 * ==============================================================================
 * SECTION 10: QUANTUM WEALTH, ALGORITHMIC TRADING & ALTERNATIVE ASSETS
 * ==============================================================================
 * Advanced structures for fractional real estate, fine art tokenization,
 * algorithmic trading strategies, venture capital startups, and Stripe ledger balances.
 */

export interface RealEstateProperty {
  id: string;
  address: string;
  value: number;
  rentalIncome: number;
  occupancyRate?: number;
  tokenizedShares?: number;
  yieldYTD?: number;
}

export interface ArtPiece {
  id: string;
  name: string;
  artist: string;
  value: number;
  year: number;
  medium?: string;
  provenance?: string[];
  fractionalOwnershipEnabled?: boolean;
}

export interface AlgoStrategy {
  id: string;
  name: string;
  performance: number;
  risk: 'Low' | 'Medium' | 'High';
  active: boolean;
  sharpeRatio?: number;
  maxDrawdown?: number;
  allocationPercentage?: number;
}

export interface VentureStartup {
  id: string;
  name: string;
  valuation: number;
  investment: number;
  equity: number;
  fundingRound?: 'Seed' | 'SeriesA' | 'SeriesB' | 'SeriesC' | 'Growth';
  burnRate?: number;
  runwayMonths?: number;
}

export interface StripeBalance {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
}

export interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number;
  description: string;
  customer_id?: string;
  receipt_url?: string;
  metadata: KeyValuePairs;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
  total_spent?: number;
  metadata?: KeyValuePairs;
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: number;
  plan_id: string;
  amount: number;
}

export type StripeResource = any;

/**
 * ==============================================================================
 * SECTION 11: GATEKEEPER VERIFICATION & CRYPTOGRAPHIC LEDGERS
 * ==============================================================================
 * Types governing secure micro-deposit verification, Modern Treasury external
 * account validation, and multi-factor cryptographic gatekeepers.
 */

export interface VerifyParams {
  externalAccountId: string;
  originatingAccountId: string;
  paymentType: 'ach' | 'eft' | 'rtp';
  currency: string;
  authToken: string; // The base64 string provided by user
}

export interface VerifyError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * ==============================================================================
 * SECTION 12: SACRED GEOMETRY, GEMATRIA & THEOLOGICAL PATTERNS
 * ==============================================================================
 * Types governing mathematical patterns, triangular numbers, gematria calculations,
 * and multi-layered cosmic/historical pattern analysis.
 */

export interface BibleBook {
  index: number;
  name: string;
  chapters: number;
  isTriangular: boolean;
}

export interface GematriaResult {
  word: string;
  sum: number;
  language: string;
  category: string;
}

export interface TriangularMetadata {
  index: number;
  value: number;
  significance: string;
}

export interface PatternLayer {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: 'Scripture' | 'Math' | 'Science' | 'Cosmic' | 'History';
}

/**
 * ==============================================================================
 * SECTION 13: LITERARY TRANSLATION, MANUSCRIPTS & REPOSITORY COMPENDIUMS
 * ==============================================================================
 * Types governing the transformation of raw codebases into literary masterpieces,
 * New York Times best-seller manuscripts, and virtual repository consensus engines.
 */

export interface Page {
  title: string;
  content: string; // Changed from string[] to string for narrative content
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  technicalSummary: string;
  imageryPrompt: string;
  imageUrl?: string;
  pages?: Page[];
}

export interface Section {
  title: string;
  chapters: Chapter[];
}

export type Book = Section[];

export interface Manuscript {
  repoName: string;
  title: string;
  preface: string;
  chapters: Chapter[];
  conclusion: string;
  generatedAt: string;
  author: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface KnowledgeBaseFile extends GitHubFile {
  repoName: string;
}

export interface AuditItem {
  file: GitHubFile;
  repo: GithubRepo;
}

export interface FileAnalysis {
  path: string;
  name: string;
  thoughts: string;
  hypnoticCommand: string;
  imageUrl?: string;
}

export interface ProjectCompendium {
  repoName: string;
  summaries: FileAnalysis[];
  masterStory: string;
  sacredDecree: string;
  ultimateBibliography: string;
  analyzedAt: string;
  totalFilesProcessed: number;
}

export interface VirtualRepository {
  name: string;
  files: Map<string, FileAnalysis>;
  consensus: any;
  isReady: boolean;
}

export interface SelectedContext {
  repo: GithubRepo | null;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
  isGenerating: boolean;
  status: string;
  compendium?: ProjectCompendium | null;
  virtualRepo?: VirtualRepository | null;
}

export interface RepoSession {
  repoId: number;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
}

/**
 * ==============================================================================
 * SECTION 14: ENTERPRISE PAYMENTS, SIMULATIONS & CLIENT REGISTRATION
 * ==============================================================================
 * Types governing enterprise-grade payee management, simulation engines,
 * client registration responses, and line-item ledger updates.
 */

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
}

export interface CustomerProfileResponse {
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  companyName: string;
  emails: Array<{
    emailAddress: string;
    preferenceType: string;
  }>;
  addressList: Array<{
    addressLine1: string;
    city: string;
    countryCode: string;
    postalCode: string;
    addressType: string;
  }>;
  phones: Array<{
    phoneType: string;
    fullPhoneNumber: string;
    preferenceType: string;
  }>;
}

export interface ClientRegisterResponse {
  client_id: string;
  client_secret: string;
  client_name: string;
  appId?: string;
  redirect_uris: string[];
  scope: string[];
  token_endpoint_auth_method?: string;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * ==============================================================================
 * SECTION 15: ADVANCED TYPESCRIPT UTILITY & TYPE-LEVEL PROGRAMMING
 * ==============================================================================
 * High-performance utility types for deep partials, readonly mapping,
 * union-to-intersection conversions, and type-safe property picking.
 */

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type PickProperties<T, U> = Pick<T, KeysOfType<T, U>>;

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type TupleToUnion<T extends any[]> = T[number];

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

/**
 * ==============================================================================
 * SECTION 16: ISO 20022 XML/JSON SCHEMA DEFINITIONS & MX/MT MESSAGE PARSERS
 * ==============================================================================
 * Exhaustive, production-grade type definitions for ISO 20022 financial messaging.
 * Covers pacs.008, pacs.009, pain.001, and camt.053 schemas with complete structural fidelity.
 */

export interface ActiveOrHistoricCurrencyAndAmount {
  value: number;
  currency: string;
}

export interface PostalAddress24 {
  adrTp?: 'MNDT' | 'ALCO' | 'BIZZ' | 'COMM' | 'DLVY' | 'HEAD' | 'OFFI' | 'HOME' | 'PBOX';
  dept?: string;
  subDept?: string;
  strtNm?: string;
  bldgNb?: string;
  bldgNm?: string;
  pstCd?: string;
  twnNm?: string;
  subPrvnc?: string;
  ctrySubDvsn?: string;
  ctry?: string;
  adrLine?: string[];
}

export interface PartyIdentification135 {
  nm?: string;
  pstlAdr?: PostalAddress24;
  id?: {
    orgId?: {
      anyBIC?: string;
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
    prvtId?: {
      dtAndPlcOfBirth?: {
        birthDt: string;
        prvncOfBirth?: string;
        cityOfBirth: string;
        ctryOfBirth: string;
      };
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
  };
  ctctDtls?: {
    nmPrfx?: 'DOCT' | 'MADM' | 'MISS' | 'MIST' | 'MIXX';
    nm?: string;
    phneNb?: string;
    mobPhneNb?: string;
    faxNb?: string;
    emailAdr?: string;
    emailPurp?: string;
    jobTitl?: string;
    rspnsblty?: string;
    dept?: string;
  };
}

export interface ClearingSystemMemberIdentification2 {
  clrSysId?: {
    cd?: string;
    prtry?: string;
  };
  mmbId: string;
}

export interface BranchAndFinancialInstitutionIdentification6 {
  finInstnId: {
    bicfi?: string;
    clrSysMmbId?: ClearingSystemMemberIdentification2;
    nm?: string;
    pstlAdr?: PostalAddress24;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  brnch?: {
    id?: string;
    nm?: string;
    pstlAdr?: PostalAddress24;
  };
}

export interface CashAccount38 {
  id: {
    iban?: string;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  tp?: {
    cd?: string;
    prtry?: string;
  };
  ccy?: string;
  nm?: string;
  prxy?: {
    tp?: { cd?: string; prtry?: string };
    id: string;
  };
}

export interface PaymentIdentification7 {
  instrId?: string;
  endToEndId: string;
  uetr?: string;
  txId?: string;
  clrSysRef?: string;
}

export interface GroupHeader93 {
  msgId: string;
  creDtTm: string;
  authstn?: {
    cd?: string;
    prtry?: string;
  }[];
  btchBookg?: boolean;
  nbOfTxs: string;
  ctrlSum?: number;
  initgPty?: PartyIdentification135;
  fwdgAgt?: BranchAndFinancialInstitutionIdentification6;
}

export interface CreditTransferTransaction39 {
  pmtId: PaymentIdentification7;
  pmtTpInf?: {
    instrPrty?: 'HIGH' | 'NORM';
    svcLvl?: { cd?: string; prtry?: string }[];
    lclInstrm?: { cd?: string; prtry?: string };
    ctgyPurp?: { cd?: string; prtry?: string };
  };
  intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
  intrBkSttlmDt?: string;
  sttlmPrty?: 'HIGH' | 'NORM';
  chrgBr: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
  chrgsInf?: {
    amt: ActiveOrHistoricCurrencyAndAmount;
    agt: BranchAndFinancialInstitutionIdentification6;
  }[];
  instgAgt?: BranchAndFinancialInstitutionIdentification6;
  instdAgt?: BranchAndFinancialInstitutionIdentification6;
  dbtr: PartyIdentification135;
  dbtrAcct?: CashAccount38;
  dbtrAgt: BranchAndFinancialInstitutionIdentification6;
  dbtrAgtAcct?: CashAccount38;
  cdtrAgt: BranchAndFinancialInstitutionIdentification6;
  cdtrAgtAcct?: CashAccount38;
  cdtr: PartyIdentification135;
  cdtrAcct?: CashAccount38;
  ultmtDbtr?: PartyIdentification135;
  ultmtCdtr?: PartyIdentification135;
  purp?: { cd?: string; prtry?: string };
  rgltryRptg?: {
    dbtCdtFlg?: 'DBIT' | 'CDIT';
    authrty?: { nm?: string; ctry?: string };
    dtls?: { cd?: string; prtry?: string; inf?: string[] }[];
  }[];
  rltdRmtInf?: {
    fcmtId?: string;
    docTp?: string;
    docNb?: string;
    dt?: string;
  }[];
  rmtInf?: {
    ustrd?: string[];
    strd?: {
      rfrdDocInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        nb?: string;
        rltdDt?: string;
      }[];
      rfrdDocAmt?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        amt: ActiveOrHistoricCurrencyAndAmount;
      }[];
      cdtrRefInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        ref?: string;
      };
      invcr?: PartyIdentification135;
      invcee?: PartyIdentification135;
    }[];
  };
}

export interface Pacs008Document {
  fitoficstmdbtct: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: CreditTransferTransaction39[];
  };
}

export interface Pacs009Document {
  ficreditTransfer: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: {
      pmtId: PaymentIdentification7;
      intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
      intrBkSttlmDt?: string;
      instgAgt?: BranchAndFinancialInstitutionIdentification6;
      instdAgt?: BranchAndFinancialInstitutionIdentification6;
      dbtr: BranchAndFinancialInstitutionIdentification6;
      dbtrAcct?: CashAccount38;
      dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtr: BranchAndFinancialInstitutionIdentification6;
      cdtrAcct?: CashAccount38;
    }[];
  };
}

export interface Pain001Document {
  cstmrCdtTrfInitn: {
    grpHdr: GroupHeader93;
    pmtInf: {
      pmtInfId: string;
      pmtMtd: 'TRF' | 'CHK' | 'TRA';
      btchBookg?: boolean;
      nbOfTxs?: string;
      ctrlSum?: number;
      pmtTpInf?: {
        instrPrty?: 'HIGH' | 'NORM';
        svcLvl?: { cd?: string; prtry?: string }[];
        lclInstrm?: { cd?: string; prtry?: string };
        ctgyPurp?: { cd?: string; prtry?: string };
      };
      reqdExctnDt: {
        dt?: string;
        dtTm?: string;
      };
      dbtr: PartyIdentification135;
      dbtrAcct: CashAccount38;
      dbtrAgt: BranchAndFinancialInstitutionIdentification6;
      dbtrAgtAcct?: CashAccount38;
      ultmtDbtr?: PartyIdentification135;
      chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
      cdtTrfTxInf: {
        pmtId: PaymentIdentification7;
        amt: {
          instdAmt?: ActiveOrHistoricCurrencyAndAmount;
          eqvAmt?: {
            amt: ActiveOrHistoricCurrencyAndAmount;
            ccyOfTrf: string;
          };
        };
        chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
        cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
        cdtrAgtAcct?: CashAccount38;
        cdtr: PartyIdentification135;
        cdtrAcct?: CashAccount38;
        ultmtCdtr?: PartyIdentification135;
        purp?: { cd?: string; prtry?: string };
        rmtInf?: { ustrd?: string[] };
      }[];
    }[];
  };
}

export interface Camt053Document {
  bkToCstmrStmt: {
    grpHdr: GroupHeader93;
    stmt: {
      id: string;
      elctrncSeqNb?: number;
      creDtTm: string;
      frToDt?: {
        frDtTm: string;
        toDtTm: string;
      };
      acct: CashAccount38;
      bal: {
        tp: {
          cdOrPrtry: { cd: string; prtry?: string };
        };
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        dt: { dtTm: string };
      }[];
      ntry?: {
        ntryRef?: string;
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        sts: 'BOOK' | 'PDNG';
        bookgDt?: { dtTm: string };
        valDt?: { dtTm: string };
        acctSvcrRef?: string;
        ntryDtls?: {
          txDtls?: {
            refs?: {
              endToEndId?: string;
              uetr?: string;
              txId?: string;
            };
            amtDtls?: {
              instdAmt?: {
                amt: ActiveOrHistoricCurrencyAndAmount;
              };
            };
            rltdPties?: {
              dbtr?: PartyIdentification135;
              cdtr?: PartyIdentification135;
            };
            rltdAgts?: {
              dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
              cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
            };
          }[];
        }[];
      }[];
    }[];
  };
}

/**
 * ==============================================================================
 * SECTION 17: QUANTUM LEDGER & MULTI-NODE CONSENSUS MESH PROTOCOL (NEXUS-V3)
 * ==============================================================================
 * Advanced cryptographic structures for zero-knowledge proofs, post-quantum
 * signatures, threshold multi-sig, and decentralized consensus state machines.
 */

export type QuantumSignatureScheme = 'Dilithium5' | 'Falcon1024' | 'SPHINCS+' | 'XMSS_MT';

export interface QuantumPublicKey {
  scheme: QuantumSignatureScheme;
  rawBytes: string; // Base64 encoded public key
  fingerprint: string; // SHA3-256 hash of the public key
}

export interface ZkProofPayload {
  provingSystem: 'Groth16' | 'Plonk' | 'Halo2' | 'Bulletproofs';
  proofBytes: string; // Base64 encoded proof
  publicInputs: string[]; // Array of public input values
  verificationKeyHash: string;
}

export interface ThresholdSignatureConfig {
  threshold: number; // 't' in t-of-n
  totalSigners: number; // 'n'
  publicKeys: QuantumPublicKey[];
  epochId: number;
}

export interface ConsensusState {
  currentEpoch: number;
  currentRound: number;
  leaderNodeId: string;
  activeValidators: string[];
  consensusThreshold: number;
  lastCommittedBlockHeight: number;
  lastCommittedBlockHash: string;
  pendingProposalsCount: number;
}

export interface StateChannel {
  channelId: string;
  participants: string[];
  nonce: number;
  balances: Record<string, ActiveOrHistoricCurrencyAndAmount>;
  signatures: Record<string, string>;
  status: 'OPEN' | 'CLOSING' | 'CLOSED' | 'DISPUTED';
  disputeTimeoutBlock?: number;
}

export interface MeshNode {
  nodeId: string;
  endpoint: string;
  version: string;
  reputationScore: number;
  latencyMs: number;
  isValidator: boolean;
  stakingBalance: ActiveOrHistoricCurrencyAndAmount;
  lastHeartbeat: string;
}

export interface BlockHeader {
  height: number;
  previousHash: string;
  merkleRoot: string;
  stateRoot: string;
  timestamp: number;
  validatorSignature: string;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface TransactionPayload {
  txHash: string;
  sender: string;
  recipient: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  nonce: number;
  gasLimit: number;
  gasPrice: ActiveOrHistoricCurrencyAndAmount;
  signature: string;
  zkProof?: ZkProofPayload;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface ConsensusMessage {
  messageId: string;
  senderNodeId: string;
  epoch: number;
  round: number;
  type: 'PROPOSE' | 'PREVOTE' | 'PRECOMMIT' | 'DECIDE';
  blockHash: string;
  signature: string;
}

/**
 * ==============================================================================
 * SECTION 18: AI SWARM ORCHESTRATION, AGENTIC WORKFLOWS & COGNITIVE THOUGHT STREAMS
 * ==============================================================================
 * Types governing multi-agent swarms, task decomposition graphs, agent-to-agent
 * communication protocols, vector database embeddings, and cognitive thought stream logs.
 */

export type AgentRole = 'ORCHESTRATOR' | 'CRITIC' | 'REFINER' | 'RESEARCHER' | 'CODER' | 'COMPLIANCE_OFFICER' | 'FINANCIAL_ANALYST';

export interface AgentCapability {
  name: string;
  description: string;
  parametersSchema: Record<string, any>; // JSON Schema for tool parameters
}

export interface TaskDecompositionNode {
  taskId: string;
  parentTaskId: string | null;
  assignedAgentId: string;
  description: string;
  dependencies: string[]; // Array of taskIds that must complete first
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  error?: string;
  attempts: number;
  maxAttempts: number;
}

export interface SwarmOrchestratorState {
  swarmId: string;
  activeAgents: Record<string, {
    agentId: string;
    role: AgentRole;
    status: 'IDLE' | 'WORKING' | 'CRITICIZING' | 'OFFLINE';
    currentTaskId?: string;
  }>;
  taskGraph: Record<string, TaskDecompositionNode>;
  overallProgress: number; // 0.0 to 1.0
  status: 'IDLE' | 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
}

export interface AgentMessage {
  messageId: string;
  senderId: string;
  recipientId: string; // Can be 'ALL' or specific agentId
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
  replyToId?: string;
}

export interface ThoughtStreamNode {
  nodeId: string;
  agentId: string;
  timestamp: number;
  thoughtType: 'OBSERVATION' | 'REASONING' | 'HYPOTHESIS' | 'CRITIQUE' | 'DECISION';
  content: string;
  confidenceScore: number; // 0.0 to 1.0
  parentThoughtId: string | null;
}

export interface VectorEmbedding {
  id: string;
  vector: number[];
  textPayload: string;
  metadata: Record<string, string | number | boolean>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface ToolExecutionContext {
  toolName: string;
  arguments: Record<string, any>;
  callerAgentId: string;
  timestamp: number;
  executionTimeMs?: number;
  status: 'SUCCESS' | 'ERROR';
  result?: any;
  error?: string;
}

/**
 * ==============================================================================
 * SECTION 19: ADVANCED ALGORITHMIC TRADING, HIGH-FREQUENCY ORDER BOOKS & RISK ENGINES
 * ==============================================================================
 * Types governing real-time order books (L1/L2/L3), market makers, execution
 * algorithms (TWAP, VWAP, Sniper), portfolio risk metrics, and margin/liquidation engines.
 */

export interface OrderBookLevel {
  price: number;
  quantity: number;
  orderCount?: number;
}

export interface OrderBookL2 {
  ticker: string;
  timestamp: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface OrderBookL3 {
  ticker: string;
  timestamp: number;
  bids: { orderId: string; price: number; quantity: number; ownerId: string }[];
  asks: { orderId: string; price: number; quantity: number; ownerId: string }[];
}

export type AlgoExecutionStrategy = 'TWAP' | 'VWAP' | 'SNIPER' | 'ICEBERG' | 'GRID' | 'MARKET_MAKER';

export interface AlgoTradingJob {
  jobId: string;
  ticker: string;
  strategy: AlgoExecutionStrategy;
  side: 'BUY' | 'SELL';
  totalQuantity: number;
  executedQuantity: number;
  limitPrice?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  parameters: {
    startTime: string;
    endTime: string;
    sliceIntervalSeconds?: number;
    maxParticipationRate?: number; // For VWAP
    icebergDisplayQuantity?: number;
  };
  status: 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  averageExecutionPrice: number;
  slippageBps: number;
  logs: string[];
}

export interface PortfolioRiskMetrics {
  portfolioId: string;
  timestamp: number;
  valueAtRisk95: ActiveOrHistoricCurrencyAndAmount; // 95% confidence VaR
  valueAtRisk99: ActiveOrHistoricCurrencyAndAmount; // 99% confidence VaR
  expectedShortfall: ActiveOrHistoricCurrencyAndAmount;
  sharpeRatio: number;
  sortinoRatio: number;
  betaToBenchmark: number;
  alphaToBenchmark: number;
  maxDrawdown: number;
  volatilityAnnualized: number;
}

export interface MarginAccount {
  accountId: string;
  collateralBalance: ActiveOrHistoricCurrencyAndAmount;
  borrowedBalance: ActiveOrHistoricCurrencyAndAmount;
  maintenanceMarginRequirement: number; // Percentage, e.g., 0.15 for 15%
  initialMarginRequirement: number; // Percentage, e.g., 0.30 for 30%
  currentMarginRatio: number; // collateral / borrowed
  liquidationPrice: number;
  status: 'HEALTHY' | 'MARGIN_CALL' | 'LIQUIDATING' | 'LIQUIDATED';
}

export interface LiquidationEvent {
  liquidationId: string;
  accountId: string;
  timestamp: number;
  liquidatedAsset: string;
  liquidatedQuantity: number;
  executionPrice: number;
  penaltyFee: ActiveOrHistoricCurrencyAndAmount;
  remainingCollateral: ActiveOrHistoricCurrencyAndAmount;
}
/**
 * ==============================================================================
 * SECTION 20: MULTI-MODAL AI AD STUDIO, CAMPAIGN GENERATION & AD PERFORMANCE TRACKING
 * ==============================================================================
 * Types for AI-generated marketing campaigns, ad creatives, target audience segments,
 * budget allocation, real-time bidding (RTB) parameters, conversion tracking, and
 * multi-channel attribution models.
 */

export type AdCampaignStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type AdCreativeType = 'IMAGE' | 'VIDEO' | 'TEXT' | 'CAROUSEL' | 'INTERACTIVE_HTML5' | 'AUDIO';

export type AttributionModelType = 'FIRST_TOUCH' | 'LAST_TOUCH' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'DATA_DRIVEN';

export interface AdPerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: ActiveOrHistoricCurrencyAndAmount;
  ctr: number; // Click-Through Rate (0.0 to 1.0)
  cpc: ActiveOrHistoricCurrencyAndAmount; // Cost Per Click
  cpa: ActiveOrHistoricCurrencyAndAmount; // Cost Per Acquisition
  roas: number; // Return on Ad Spend
  bounceRate: number; // 0.0 to 1.0
  averageEngagementTimeSeconds: number;
  conversionRate: number; // 0.0 to 1.0
}

export interface AudienceSegment {
  segmentId: string;
  name: string;
  description?: string;
  demographics: {
    ageRanges: string[];
    genders: string[];
    incomeBrackets?: string[];
    educationLevels?: string[];
  };
  interests: string[];
  behaviors: string[];
  geographicRegions: string[]; // ISO country/region codes
  estimatedReach: number;
  customDataTags?: Record<string, string>;
}

export interface AdCreative {
  creativeId: string;
  type: AdCreativeType;
  headline: LocalizedString;
  bodyText: LocalizedString;
  callToAction: string;
  mediaAssets: AssetMetadata[];
  generationPromptUsed?: string;
  aiModelId?: string;
  negativePromptUsed?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '2:3';
  metaData?: Record<string, any>;
}

export interface RealTimeBiddingConfig {
  maxBidAmount: ActiveOrHistoricCurrencyAndAmount;
  targetCpa?: ActiveOrHistoricCurrencyAndAmount;
  pacingStrategy: 'EVEN' | 'AHEAD' | 'ASAP';
  bidMultiplierRules: {
    dimension: 'device' | 'region' | 'time_of_day' | 'audience_segment';
    key: string;
    multiplier: number; // e.g., 1.2 for +20% bid
  }[];
}

export interface AdCampaign {
  campaignId: string;
  name: string;
  description?: string;
  status: AdCampaignStatus;
  channels: ('SOCIAL' | 'SEARCH' | 'DISPLAY' | 'PROGRAMMATIC' | 'EMAIL' | 'METAVERSE')[];
  targetAudience: AudienceSegment;
  creatives: AdCreative[];
  totalBudget: ActiveOrHistoricCurrencyAndAmount;
  dailyBudgetLimit: ActiveOrHistoricCurrencyAndAmount;
  startDate: string;
  endDate?: string;
  rtbConfig?: RealTimeBiddingConfig;
  performanceMetrics?: AdPerformanceMetrics;
  attributionModel: AttributionModelType;
  aiCreativeBrief?: string;
  lastOptimizedAt?: string;
}

/**
 * ==============================================================================
 * SECTION 21: CITIBANK CONNECTIVITY, OPEN BANKING API PROXIES & SECURE DATA EXCHANGE
 * ==============================================================================
 * Citi-specific API payloads, unmasked data views, standing instructions,
 * cross-border payment routing, payee management, and developer sandbox configurations.
 */

export type CitiAccountProxyStatus = 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';

export interface CitiAccountProxy {
  proxyId: string;
  realAccountId: string;
  mask: string;
  virtualIban: string;
  status: CitiAccountProxyStatus;
  allowedMerchantCategories: string[]; // MCC codes
  dailyLimit: ActiveOrHistoricCurrencyAndAmount;
  expirationDate: string;
  createdDate: string;
}

export interface CitiBillPayment {
  paymentId: string;
  billerId: string;
  billerName: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  status: 'PENDING' | 'PROCESSING' | 'EXECUTED' | 'FAILED';
  executionDate: string;
  recurringRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY';
    interval: number;
    endDate?: string;
  };
}

export interface CitiCrossBorderTransfer {
  transferId: string;
  senderBic: string;
  receiverBic: string;
  intermediaryBic?: string;
  fxRate: number;
  guaranteedUntil: string;
  transferFee: ActiveOrHistoricCurrencyAndAmount;
  regulatoryReportingCode?: string; // e.g., Central Bank reporting codes
  chargeBearer: 'OUR' | 'BEN' | 'SHA';
}

export interface CitiPayee {
  payeeId: string;
  name: string;
  accountDetails: CashAccount38;
  address?: PostalAddress24;
  status: 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED';
  verificationLevel: 'STANDARD' | 'ENHANCED_KYC' | 'SANCTION_CLEARED';
  lastPaidDate?: string;
}

export interface CitiStandingInstruction {
  instructionId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  frequency: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  nextExecutionDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export interface CitiDeveloperSandboxConfig {
  sandboxId: string;
  clientId: string;
  clientSecret: string;
  mockDataProfile: 'RETAIL_MASS' | 'HNW_SOVEREIGN' | 'CORPORATE_CONGLOMERATE';
  latencySimulationMs: number;
  errorSimulationRate: number; // 0.0 to 1.0
}

/**
 * ==============================================================================
 * SECTION 22: WEB3 DECENTRALIZED FINANCE (DeFi), LIQUIDITY POOLS & SMART CONTRACT INTERACTION
 * ==============================================================================
 * Types for decentralized lending pools, yield farming, automated market makers (AMMs),
 * gas estimation, smart contract ABIs, wallet provider details (EIP-6963), and cross-chain bridge protocols.
 */

export interface DeFiLendingPool {
  poolAddress: string;
  assetSymbol: string;
  totalDeposited: ActiveOrHistoricCurrencyAndAmount;
  totalBorrowed: ActiveOrHistoricCurrencyAndAmount;
  supplyApy: number; // Annual Percentage Yield
  borrowApy: number;
  utilizationRate: number; // 0.0 to 1.0
  collateralFactor: number; // 0.0 to 1.0
  liquidationThreshold: number; // 0.0 to 1.0
}

export interface YieldFarm {
  farmAddress: string;
  lpTokenAddress: string;
  rewardTokenAddress: string;
  tvl: ActiveOrHistoricCurrencyAndAmount; // Total Value Locked
  apr: number; // Annual Percentage Rate
  userStakedBalance: number;
  userPendingRewards: number;
}

export interface AmmPool {
  poolAddress: string;
  token0: { address: string; symbol: string; decimals: number };
  token1: { address: string; symbol: string; decimals: number };
  reserve0: number;
  reserve1: number;
  feeTierBps: number; // e.g., 30 for 0.3%
  volume24h: ActiveOrHistoricCurrencyAndAmount;
  totalLiquidity: ActiveOrHistoricCurrencyAndAmount;
}

export interface SmartContractAbiEntry {
  name: string;
  type: 'function' | 'event' | 'constructor' | 'fallback' | 'receive';
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  inputs: { name: string; type: string; indexed?: boolean }[];
  outputs?: { name: string; type: string }[];
}

export interface WalletProviderDetail {
  uuid: string;
  name: string;
  icon: string; // Base64 or URL
  rdns: string; // Reverse Domain Name System identifier
  providerInstance: any; // EIP-1193 provider instance
}

export interface CrossChainBridgeTx {
  txHash: string;
  sourceChainId: number;
  destinationChainId: number;
  assetSymbol: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  bridgeFee: ActiveOrHistoricCurrencyAndAmount;
  estimatedTimeMinutes: number;
}

/**
 * ==============================================================================
 * SECTION 23: FOREX ARENA, COMMODITIES EXCHANGE & DERIVATIVES DESK
 * ==============================================================================
 * Types for foreign exchange (FX) spot/forward contracts, leverage settings,
 * margin requirements, commodity futures, options chains (calls/puts, Greeks), and hedging strategies.
 */

export interface FxSpotContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  bidPrice: number;
  askPrice: number;
  pipValue: number;
  lotSize: number; // Standard lot is 100,000 units
}

export interface FxForwardContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  forwardRate: number;
  maturityDate: string;
  settlementType: 'PHYSICAL' | 'CASH';
  notionalAmount: ActiveOrHistoricCurrencyAndAmount;
}

export interface CommodityFuture {
  ticker: string;
  commodityType: 'ENERGY' | 'METALS' | 'AGRICULTURE' | 'ENVIRONMENTAL';
  contractMonth: string; // e.g., "DEC29"
  contractYear: number;
  multiplier: number;
  maintenanceMargin: ActiveOrHistoricCurrencyAndAmount;
  lastTradingDate: string;
}

export interface OptionContract {
  optionId: string;
  underlyingTicker: string;
  strikePrice: number;
  expirationDate: string;
  optionType: 'CALL' | 'PUT';
  premium: number;
  openInterest: number;
  volume: number;
}

export interface OptionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  impliedVolatility: number;
}

export interface HedgingStrategy {
  strategyId: string;
  name: string;
  description: string;
  underlyingAssets: string[];
  derivativeInstruments: string[]; // optionIds or future tickers
  targetHedgeRatio: number; // e.g., 0.85 for 85% hedged
  currentHedgeRatio: number;
  unrealizedPnL: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 24: REAL ESTATE EMPIRE, FRACTIONAL OWNERSHIP & ART COLLECTIBLES
 * ==============================================================================
 * Types for tokenized real estate, fractional shares, rental distribution ledgers,
 * art provenance tracking, appraisal history, and gallery exhibition schedules.
 */

export interface RealEstateFractionalShare {
  shareId: string;
  propertyId: string;
  ownerId: string;
  percentageOwned: number; // 0.0 to 1.0
  purchasePrice: ActiveOrHistoricCurrencyAndAmount;
  purchaseDate: string;
  currentValue: ActiveOrHistoricCurrencyAndAmount;
}

export interface RentalDistributionLedger {
  ledgerId: string;
  propertyId: string;
  periodStartDate: string;
  periodEndDate: string;
  totalGrossRentCollected: ActiveOrHistoricCurrencyAndAmount;
  expensesDeducted: ActiveOrHistoricCurrencyAndAmount;
  netRentDistributed: ActiveOrHistoricCurrencyAndAmount;
  distributions: {
    shareId: string;
    ownerId: string;
    amountDistributed: ActiveOrHistoricCurrencyAndAmount;
    distributedAt: string;
  }[];
}

export interface ArtProvenanceEntry {
  entryId: string;
  ownerName: string;
  acquisitionDate: string;
  acquisitionPrice?: ActiveOrHistoricCurrencyAndAmount;
  provenanceType: 'GALLERY_PURCHASE' | 'AUCTION' | 'PRIVATE_SALE' | 'INHERITANCE' | 'MUSEUM_EXHIBITION';
  location: string;
  verifiedBy: string;
  verificationHash: string;
}

export interface ArtAppraisalHistory {
  appraisalId: string;
  appraiserName: string;
  appraiserCredentials: string[];
  appraisalDate: string;
  appraisedValue: ActiveOrHistoricCurrencyAndAmount;
  appraisalReportUrl?: string;
  conditionRating: 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

export interface GalleryExhibition {
  exhibitionId: string;
  galleryName: string;
  location: string;
  startDate: string;
  endDate: string;
  curatorName: string;
  exhibitedArtPieceIds: string[];
  insuranceCoverageAmount: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 25: TAX OPTIMIZATION, LEGACY ARCHITECT & PHILANTHROPY
 * ==============================================================================
 * Types for tax loss harvesting, capital gains tracking, trust funds, estate planning,
 * charitable foundations, donor-advised funds (DAFs), and impact metrics.
 */

export interface TaxLossHarvestingOpportunity {
  opportunityId: string;
  assetTicker: string;
  currentPrice: number;
  costBasis: number;
  unrealizedLoss: ActiveOrHistoricCurrencyAndAmount;
  potentialTaxSavings: ActiveOrHistoricCurrencyAndAmount;
  recommendedReplacementAssetTicker: string;
  washSaleRiskStatus: 'SAFE' | 'RISK_OF_WASH_SALE' | 'WASH_SALE_TRIGGERED';
}

export interface CapitalGainsRecord {
  recordId: string;
  assetTicker: string;
  quantity: number;
  acquisitionDate: string;
  saleDate: string;
  costBasis: ActiveOrHistoricCurrencyAndAmount;
  saleProceeds: ActiveOrHistoricCurrencyAndAmount;
  gainLossAmount: ActiveOrHistoricCurrencyAndAmount;
  gainType: 'SHORT_TERM' | 'LONG_TERM';
  estimatedTaxLiability: ActiveOrHistoricCurrencyAndAmount;
}

export interface TrustFundBeneficiary {
  beneficiaryId: string;
  name: string;
  relationship: string;
  distributionPercentage: number; // 0.0 to 1.0
  vestingSchedule?: {
    milestoneAge?: number;
    milestoneDate?: string;
    percentageVested: number;
  }[];
}

export interface TrustFund {
  trustId: string;
  trusteeName: string;
  grantorName: string;
  beneficiaries: TrustFundBeneficiary[];
  totalAssetsValue: ActiveOrHistoricCurrencyAndAmount;
  distributionRules: {
    ruleId: string;
    triggerType: 'AGE' | 'DATE' | 'EDUCATION_MILESTONE' | 'DISCRETIONARY';
    triggerValue: string;
    maxDistributionAmount?: ActiveOrHistoricCurrencyAndAmount;
  }[];
  taxStatus: 'REVOCABLE' | 'IRREVOCABLE';
}

export interface DonorAdvisedFund {
  dafId: string;
  fundName: string;
  sponsorOrganization: string;
  currentBalance: ActiveOrHistoricCurrencyAndAmount;
  contributionsHistory: {
    contributionId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    taxDeductionReceiptUrl?: string;
  }[];
  grantsDistributed: {
    grantId: string;
    charityName: string;
    charityTaxId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'DISBURSED';
  }[];
}

export interface PhilanthropicImpactMetrics {
  impactId: string;
  charityName: string;
  unSustainableDevelopmentGoals: number[]; // SDG numbers 1-17
  livesImpactedCount: number;
  carbonOffsetTons?: number;
  educationHoursProvided?: number;
  cleanWaterLitersProvided?: number;
  impactScore: number; // Scale of 1-100
}
/**
 * ==============================================================================
 * SECTION 26: VENTURE CAPITAL, PRIVATE EQUITY & STARTUP INCUBATION
 * ==============================================================================
 * Advanced structures for venture capital fund management, startup incubation,
 * cap table modeling, SAFE agreements, term sheets, and due diligence workflows.
 */

export interface VentureCapitalFund {
  fundId: string;
  fundName: string;
  vintageYear: number;
  targetAum: ActiveOrHistoricCurrencyAndAmount;
  currentAum: ActiveOrHistoricCurrencyAndAmount;
  generalPartners: string[];
  limitedPartners: {
    lpId: string;
    name: string;
    committedCapital: ActiveOrHistoricCurrencyAndAmount;
    calledCapital: ActiveOrHistoricCurrencyAndAmount;
    distributionCapital: ActiveOrHistoricCurrencyAndAmount;
  }[];
  investmentThesis: LocalizedString;
  portfolioCompanies: VentureStartup[];
  irr: number; // Internal Rate of Return (e.g., 0.24 for 24%)
  tvpi: number; // Total Value to Paid-In Capital
  dpi: number; // Distributed to Paid-In Capital
  status: 'RAISING' | 'ACTIVE' | 'FULLY_INVESTED' | 'LIQUIDATED';
}

export interface StartupIncubationCohort {
  cohortId: string;
  programName: string;
  startDate: string;
  endDate: string;
  mentors: {
    mentorId: string;
    name: string;
    expertise: string[];
    companyAffiliation?: string;
  }[];
  acceptedStartups: VentureStartup[];
  curriculumModules: {
    moduleId: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
  demoDayParameters: {
    scheduledDate: string;
    investorRsvpCount: number;
    pitchDurationSeconds: number;
    prizePoolAmount?: ActiveOrHistoricCurrencyAndAmount;
  };
}

export interface CapTableShareholder {
  shareholderId: string;
  name: string;
  shareClass: 'FOUNDER_COMMON' | 'COMMON' | 'PREFERRED_SEED' | 'PREFERRED_SERIES_A' | 'PREFERRED_SERIES_B' | 'OPTION_POOL';
  shareCount: number;
  ownershipPercentage: number; // 0.0 to 1.0
  fullyDilutedPercentage: number; // 0.0 to 1.0
  optionsGranted?: number;
  optionsVested?: number;
  vestingSchedule?: {
    cliffDate: string;
    vestingDurationMonths: number;
    vestingIntervalMonths: number;
  };
}

export interface CapTable {
  capTableId: string;
  startupId: string;
  preMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  postMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  totalSharesOutstanding: number;
  shareholders: CapTableShareholder[];
  optionPoolSize: number;
  optionPoolRemaining: number;
  convertibleNotes: {
    noteId: string;
    investorName: string;
    principalAmount: ActiveOrHistoricCurrencyAndAmount;
    interestRate: number;
    capAmount?: ActiveOrHistoricCurrencyAndAmount;
    discountRate?: number;
  }[];
  safeAgreements: SafeAgreement[];
}

export interface SafeAgreement {
  safeId: string;
  investorName: string;
  principalAmount: ActiveOrHistoricCurrencyAndAmount;
  capAmount?: ActiveOrHistoricCurrencyAndAmount;
  discountRate?: number; // e.g., 0.80 for 20% discount
  conversionTrigger: 'NEXT_EQUITY_ROUND' | 'LIQUIDITY_EVENT' | 'DISSOLUTION';
  status: 'ACTIVE' | 'CONVERTED' | 'TERMINATED';
}

export interface TermSheet {
  termSheetId: string;
  startupId: string;
  leadInvestorId: string;
  preMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  investmentAmount: ActiveOrHistoricCurrencyAndAmount;
  liquidationPreference: {
    multiplier: number; // e.g., 1.0x
    participating: boolean;
  };
  boardSeats: {
    totalSeats: number;
    investorSeats: number;
    founderSeats: number;
    independentSeats: number;
  };
  protectiveProvisions: string[];
  dragAlongRights: boolean;
  tagAlongRights: boolean;
  exclusivityDays: number;
  status: 'DRAFT' | 'SENT' | 'NEGOTIATING' | 'SIGNED' | 'EXPIRED' | 'REJECTED';
}

export interface DueDiligenceChecklist {
  checklistId: string;
  startupId: string;
  categories: {
    name: 'FINANCIAL' | 'LEGAL' | 'TECHNICAL' | 'TEAM' | 'MARKET' | 'IP';
    items: {
      itemId: string;
      description: string;
      status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'NOT_APPLICABLE';
      assignedTo: string;
      verifiedBy?: string;
      documentUrls: string[];
      comments: {
        author: string;
        text: string;
        timestamp: string;
      }[];
    }[];
  }[];
}

/**
 * ==============================================================================
 * SECTION 27: SOVEREIGN WEALTH SIMULATION, MACROECONOMIC MODELING & GAME THEORY
 * ==============================================================================
 * Types for sovereign wealth fund simulations, macroeconomic indicators,
 * geopolitical risk modeling, and game-theoretic scenario analysis.
 */

export interface SovereignWealthFund {
  fundId: string;
  nationState: string;
  totalAssets: ActiveOrHistoricCurrencyAndAmount;
  liquidReserves: ActiveOrHistoricCurrencyAndAmount;
  strategicAssetAllocation: {
    assetClass: 'EQUITIES' | 'FIXED_INCOME' | 'REAL_ESTATE' | 'INFRASTRUCTURE' | 'PRIVATE_EQUITY' | 'GOLD_RESERVES' | 'DIGITAL_ASSETS';
    targetPercentage: number; // 0.0 to 1.0
    currentPercentage: number;
  }[];
  geopoliticalRiskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'SOVEREIGN_HEGEMON';
  fiscalRules: {
    maxAnnualWithdrawalPercentage: number;
    emergencyFundThreshold: ActiveOrHistoricCurrencyAndAmount;
    commodityRevenueReinvestmentPercentage?: number;
  };
}

export interface MacroeconomicIndicators {
  gdpGrowthRate: number; // Annualized percentage change
  inflationRate: number;
  unemploymentRate: number;
  centralBankInterestRate: number;
  debtToGdpRatio: number;
  tradeBalance: ActiveOrHistoricCurrencyAndAmount;
  currencyStrengthIndex: number; // Relative to basket of global currencies
  lastUpdated: string;
}

export interface GeopoliticalEvent {
  eventId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXISTENTIAL';
  affectedRegions: string[]; // ISO country codes
  economicImpactFactors: {
    commodityPriceShock: { commodity: string; percentageChange: number }[];
    supplyChainDisruptionIndex: number; // 0.0 to 1.0
    capitalFlightRisk: boolean;
  };
  probabilityOfOccurrence: number; // 0.0 to 1.0
  status: 'POTENTIAL' | 'ACTIVE' | 'RESOLVED' | 'MITIGATED';
}

export interface PayoffMatrixEntry {
  player1Strategy: string;
  player2Strategy: string;
  player1Payoff: number;
  player2Payoff: number;
}

export interface GameTheoryScenario {
  scenarioId: string;
  title: string;
  description: string;
  players: {
    playerId: string;
    name: string;
    resources: Record<string, any>;
  }[];
  strategies: {
    playerId: string;
    options: string[];
  }[];
  payoffMatrix: PayoffMatrixEntry[];
  nashEquilibrium?: {
    player1Strategy: string;
    player2Strategy: string;
  }[];
  cooperativeOutcome?: {
    player1Strategy: string;
    player2Strategy: string;
    jointPayoff: number;
  };
  simulationSteps: {
    stepIndex: number;
    actionsTaken: Record<string, string>;
    payoffsRealized: Record<string, number>;
    narrative: string;
  }[];
}

export interface SimulationRun {
  runId: string;
  scenarioId: string;
  initialConditions: Record<string, any>;
  steps: {
    timestamp: string;
    stateVariables: Record<string, number>;
    eventsTriggered: string[];
  }[];
  finalOutcome: string;
  confidenceInterval: {
    lowerBound: number;
    upperBound: number;
  };
  executionTimeMs: number;
}

/**
 * ==============================================================================
 * SECTION 28: ADVANCED CRYPTOGRAPHIC KEY MANAGEMENT, MULTI-SIG & HSM
 * ==============================================================================
 * Types for Hardware Security Modules (HSM), cryptographic key lifecycles,
 * multi-signature transaction coordination, and zero-knowledge proof parameters.
 */

export interface HsmConfig {
  hsmId: string;
  vendor: 'THALES' | 'GEMALTO' | 'YUBICO' | 'AWS_KMS' | 'AZURE_KEY_VAULT' | 'CUSTOM_FPGA';
  model: string;
  firmwareVersion: string;
  slotId: number;
  label: string;
  supportedAlgorithms: ('AES256' | 'RSA4096' | 'ECDSA_SECP256K1' | 'ED25519' | 'DILITHIUM5' | 'FALCON1024')[];
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'DEGRADED' | 'ERROR';
}

export interface CryptographicKey {
  keyId: string;
  keyType: 'SYMMETRIC' | 'ASYMMETRIC_PUBLIC' | 'ASYMMETRIC_PRIVATE' | 'MASTER_SEED';
  keySize: number; // in bits
  algorithm: string;
  purpose: 'ENCRYPTION' | 'SIGNING' | 'KEY_DERIVATION' | 'ZERO_KNOWLEDGE';
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED' | 'ARCHIVED';
  createdAt: string;
  expiresAt?: string;
  hsmReferenceId?: string;
  keyFingerprint: string; // SHA3-256 hash of public key or key metadata
}

export interface SignatureShare {
  signerId: string;
  signatureBytes: string; // Base64 encoded signature
  timestamp: number;
  publicKeyFingerprint: string;
}

export interface MultiSigTransaction {
  txId: string;
  destinationAddress: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  assetSymbol: string;
  requiredSignatures: number; // 't' in t-of-n
  currentSignatures: SignatureShare[];
  signers: {
    signerId: string;
    name: string;
    publicKey: QuantumPublicKey;
    hasSigned: boolean;
  }[];
  status: 'PENDING_SIGNATURES' | 'FULLY_SIGNED' | 'EXECUTED' | 'FAILED' | 'EXPIRED';
  rawPayload: string; // Base64 or Hex encoded transaction payload
}

export interface ZeroKnowledgeProof {
  proofId: string;
  provingKeyId: string;
  verificationKeyId: string;
  publicInputs: string[];
  proofData: string; // Base64 encoded proof
  verified: boolean;
}

export interface ThresholdDecryptionConfig {
  t: number; // Threshold
  n: number; // Total shares
  keyShares: {
    shareId: number;
    encryptedShare: string;
    holderId: string;
  }[];
  reconstructionThreshold: number;
}

/**
 * ==============================================================================
 * SECTION 29: REAL-TIME TELEMETRY, NEURAL LACE SYNC & COGNITIVE PROFILE ANALYTICS
 * ==============================================================================
 * Types for neural interface telemetry, cognitive load tracking, emotional valence
 * analysis, and biometric feedback loops for high-frequency trading environments.
 */

export interface NeuralLaceTelemetry {
  syncId: string;
  userId: string;
  connectionStrength: number; // 0.0 to 1.0
  bandwidthBps: number;
  latencyMs: number;
  activeBrainwavePattern: 'ALPHA' | 'BETA' | 'GAMMA' | 'DELTA' | 'THETA';
  cognitiveLoadIndex: number; // 0.0 to 1.0
  emotionalState: {
    valence: number; // -1.0 (negative) to 1.0 (positive)
    arousal: number; // 0.0 (calm) to 1.0 (excited)
    dominantEmotion: 'CALM' | 'FOCUS' | 'ANXIETY' | 'EUPHORIA' | 'FATIGUE' | 'FRUSTRATION';
  };
  lastSyncTime: string;
}

export interface CognitiveProfile {
  profileId: string;
  userId: string;
  analyticalThinkingScore: number; // 0.0 to 100.0
  riskAversionIndex: number; // 0.0 to 1.0
  decisionSpeedMs: number;
  patternRecognitionScore: number; // 0.0 to 100.0
  focusDurationSeconds: number;
  stressToleranceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'ELITE';
}

export interface ThoughtNode {
  nodeId: string;
  textPayload: string;
  confidenceScore: number; // 0.0 to 1.0
  parentNodeId: string | null;
  emotionalValence: number; // -1.0 to 1.0
}

export interface ThoughtStreamLog {
  streamId: string;
  userId: string;
  timestamp: number;
  thoughtNodes: ThoughtNode[];
  primaryIntent: string;
  cognitiveCoherenceScore: number; // 0.0 to 1.0
}

export interface BiometricTelemetry {
  heartRateBpm: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  galvSkinResponse: number; // Microsiemens
  bodyTemperatureCelsius: number;
  respirationRate: number; // Breaths per minute
}

/**
 * ==============================================================================
 * SECTION 30: TEMPORAL ANCHORS, HISTORICAL PATTERN MATCHING & PREDICTIVE CHRONOLOGY
 * ==============================================================================
 * Types for cyclical historical analysis, temporal anchors, predictive chronology,
 * and pattern matching across multi-decade financial and geopolitical cycles.
 */

export interface TemporalAnchor {
  anchorId: string;
  targetTimestamp: number;
  description: string;
  historicalContext: LocalizedString;
  alignmentScore: number; // 0.0 to 1.0
  cyclicalPeriodYears: number; // e.g., 8.6 years (Martin Armstrong cycle), 50 years (Kondratiev wave)
}

export interface HistoricalPrecedent {
  precedentId: string;
  eventName: string;
  dateOccurred: string;
  economicConditions: {
    inflationLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'HYPER';
    interestRateEnvironment: 'RISING' | 'FALLING' | 'STABLE';
    geopoliticalTensionIndex: number; // 1 to 10
  };
  outcomeNarrative: LocalizedString;
  similarityIndex: number; // 0.0 to 1.0
}

export interface HistoricalPattern {
  patternId: string;
  name: string;
  description: string;
  historicalPrecedents: HistoricalPrecedent[];
  mathematicalModel: 'FIBONACCI_RETRACEMENT' | 'ELLIOTT_WAVE' | 'FOURIER_TRANSFORM' | 'MARKOV_CHAIN' | 'NEURAL_LSTM';
  correlationCoefficient: number; // -1.0 to 1.0
  predictiveAccuracy: number; // 0.0 to 1.0
}

export interface TimelineEvent {
  predictedTimestamp: number;
  eventDescription: string;
  probability: number; // 0.0 to 1.0
  potentialImpactScore: number; // 1 to 10
  triggerConditions: string[];
}

export interface PredictiveChronology {
  chronologyId: string;
  targetAsset: string;
  forecastHorizonDays: number;
  timelineEvents: TimelineEvent[];
  confidenceIntervals: {
    timestamp: number;
    p10: number; // 10th percentile price/value
    p50: number; // Median
    p90: number; // 90th percentile
  }[];
}


/**
 * ==============================================================================
 * SECTION 31: GENESIS ENGINE, SIMULATION PARAMETERS & ECOSYSTEM EVOLUTION
 * ==============================================================================
 * Types governing the multi-agent macroeconomic simulation engine, tick-based
 * state machines, ecosystem KPIs, macroeconomic shocks, and evolutionary reports.
 */

export interface MacroeconomicShock {
  shockId: string;
  name: string;
  type: 'INFLATIONARY_SPIKE' | 'LIQUIDITY_CRUNCH' | 'REGULATORY_CRACKDOWN' | 'TECHNOLOGICAL_SINGULARITY' | 'GEOPOLITICAL_CONFLICT';
  magnitude: number; // Scale of 0.0 to 1.0
  durationTicks: number;
  affectedSectors: string[];
  decayRate: number; // How fast the shock dissipates per tick
}

export interface AgentBehaviorProfile {
  profileId: string;
  agentType: 'CONSUMER' | 'PRODUCER' | 'SPECULATOR' | 'ARBITRAGEUR' | 'INSTITUTIONAL_HEDGER';
  riskAversion: number; // 0.0 to 1.0
  timePreference: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM' | 'GENERATIONAL';
  rationalityIndex: number; // 0.0 (pure noise) to 1.0 (perfect utility maximization)
  liquidityThreshold: number; // Minimum cash reserves before panic selling
}

export interface GenesisEngineConfig {
  simulationId: string;
  name: string;
  tickRateMs: number;
  totalTicksToRun: number;
  currentTick: number;
  initialCapitalDistribution: {
    totalSovereignWealth: ActiveOrHistoricCurrencyAndAmount;
    totalRetailLiquidity: ActiveOrHistoricCurrencyAndAmount;
    totalInstitutionalReserves: ActiveOrHistoricCurrencyAndAmount;
  };
  activeShocks: MacroeconomicShock[];
  agentProfiles: AgentBehaviorProfile[];
  isPaused: boolean;
}

export interface EcosystemEvolutionReport {
  reportId: string;
  simulationId: string;
  startTick: number;
  endTick: number;
  gdpGrowth: number;
  giniCoefficient: number; // Measure of wealth inequality (0.0 to 1.0)
  systemicStabilityIndex: number; // 0.0 (imminent collapse) to 1.0 (perfect equilibrium)
  dominantAgentStrategy: string;
  evolutionaryMilestones: {
    tick: number;
    milestoneType: 'EMERGENCE' | 'EXTINCTION' | 'PARADIGM_SHIFT';
    description: string;
  }[];
}

export interface SimulationState {
  engineConfig: GenesisEngineConfig;
  kpis: EcosystemKPIs;
  recentEvents: SimulationEvent[];
  evolutionReport?: EcosystemEvolutionReport;
}

/**
 * ==============================================================================
 * SECTION 32: STRIPE NEXUS, CHARGEBACKS, DISPUTES & REVENUE RECONCILIATION
 * ==============================================================================
 * Types governing Stripe payment integrations, dispute evidence submissions,
 * automated chargeback mitigation, and multi-source revenue reconciliation.
 */

export interface DisputeEvidence {
  accessActivityLog?: string;
  billingAddress?: string;
  customerCommunication?: string;
  customerSignature?: string;
  duplicateChargeDocumentation?: string;
  receipt?: string;
  refundPolicy?: string;
  serviceDocumentation?: string;
  shippingDocumentation?: string;
  uncategorizedFile?: string;
}

export interface StripeDispute {
  disputeId: string;
  chargeId: string;
  amount: number;
  currency: string;
  reason: 'general' | 'fraudulent' | 'unrecognized' | 'duplicate' | 'subscription_canceled' | 'product_not_received' | 'product_unacceptable';
  status: 'warning_needs_response' | 'warning_under_review' | 'needs_response' | 'under_review' | 'won' | 'lost';
  evidenceDueBy: string;
  evidence: DisputeEvidence;
  isSubmitted: boolean;
  metadata?: Record<string, string>;
}

export interface StripeRefund {
  refundId: string;
  chargeId: string;
  amount: number;
  currency: string;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge';
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  createdAt: number;
}

export interface StripePayout {
  payoutId: string;
  amount: number;
  currency: string;
  arrivalDate: string;
  status: 'paid' | 'pending' | 'in_transit' | 'canceled' | 'failed';
  method: 'standard' | 'instant';
  bankAccountMask: string;
}

export interface StripeTransfer {
  transferId: string;
  amount: number;
  currency: string;
  destinationAccountId: string;
  sourceTransactionId?: string;
  description?: string;
}

export interface RevenueReconciliationRule {
  ruleId: string;
  name: string;
  sourceA: 'STRIPE' | 'PLAID' | 'MODERN_TREASURY' | 'INTERNAL_LEDGER';
  sourceB: 'STRIPE' | 'PLAID' | 'MODERN_TREASURY' | 'INTERNAL_LEDGER';
  matchingCriteria: {
    fieldA: string;
    fieldB: string;
    tolerance?: number; // For numeric or date tolerances
  }[];
  autoResolve: boolean;
  isActive: boolean;
}

export interface ReconciliationMatch {
  matchId: string;
  ruleId: string;
  entityAId: string;
  entityBId: string;
  amountA: number;
  amountB: number;
  timestampA: string;
  timestampB: string;
  status: 'MATCHED' | 'DISCREPANCY' | 'UNMATCHED';
  discrepancyReason?: string;
}

export interface StripeNexusConfig {
  webhookSecret: string;
  publishableKey: string;
  restrictedApiKeys: string[];
  connectedAccounts: {
    accountId: string;
    businessName: string;
    status: 'ACTIVE' | 'PENDING' | 'RESTRICTED';
  }[];
  disputeRules: StripeDispute[];
  reconciliationRules: RevenueReconciliationRule[];
}

/**
 * ==============================================================================
 * SECTION 33: COMPLIANCE ORACLE, SANCTIONS SCREENING & AML TRANSACTION MONITORING
 * ==============================================================================
 * Types governing anti-money laundering (AML) transaction monitoring, OFAC/PEP
 * sanctions screening, Suspicious Activity Report (SAR) filings, and compliance audits.
 */

export interface SanctionsScreeningRequest {
  requestId: string;
  entityName: string;
  entityType: 'INDIVIDUAL' | 'ORGANIZATION' | 'VESSEL' | 'AIRCRAFT';
  dateOfBirth?: string;
  countryOfOrigin?: string;
  nationalId?: string;
}

export interface SanctionsMatchDetail {
  listName: string; // e.g., "OFAC SDN", "EU Consolidated List"
  entryName: string;
  matchScore: number; // 0.0 to 1.0
  remarks?: string;
  aliases?: string[];
}

export interface SanctionsScreeningResult {
  requestId: string;
  status: 'CLEARED' | 'POTENTIAL_MATCH' | 'CONFIRMED_MATCH';
  screeningTimestamp: string;
  matches: SanctionsMatchDetail[];
  analystReviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
}

export interface PepCheckResult {
  isPep: boolean;
  pepLevel?: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4'; // Level 1 is highest (Heads of State)
  sourceList: string;
  politicalOfficeHeld?: string;
  riskScore: number; // 0.0 to 100.0
}

export interface AmlTransactionMonitoringRule {
  ruleId: string;
  name: string;
  description: string;
  triggerCondition: {
    metric: 'VELOCITY_24H' | 'SINGLE_TRANSACTION_LIMIT' | 'RAPID_FUNDS_FLOW' | 'STRUCTURING_DETECTION';
    threshold: number;
    currency?: string;
  };
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isActive: boolean;
}

export interface AmlAlert {
  alertId: string;
  ruleId: string;
  userId: string;
  transactionIds: string[];
  riskScore: number;
  status: 'NEW' | 'UNDER_INVESTIGATION' | 'DISMISSED_FALSE_POSITIVE' | 'ESCALATED_TO_SAR';
  assignedInvestigatorId?: string;
  createdAt: string;
  notes: string[];
}

export interface SarFiling {
  sarId: string;
  alertId: string;
  filingAgency: 'FinCEN' | 'FCA' | 'BaFin' | 'AMF';
  suspectDetails: {
    fullName: string;
    ssnOrTaxId?: string;
    address?: string;
    occupation?: string;
  };
  narrativeSummary: string;
  financialImpact: ActiveOrHistoricCurrencyAndAmount;
  status: 'DRAFT' | 'PENDING_INTERNAL_APPROVAL' | 'SUBMITTED' | 'REJECTED';
  submissionReceiptId?: string;
  submittedAt?: string;
}

export interface ComplianceOracleState {
  screeningRulesCount: number;
  activeAmlRules: AmlTransactionMonitoringRule[];
  pendingAlerts: AmlAlert[];
  recentSarFilings: SarFiling[];
  lastAuditTimestamp: string;
}

/**
 * ==============================================================================
 * SECTION 34: GLOBAL SSI HUB, DECENTRALIZED IDENTIFIERS (DIDs) & VERIFIABLE CREDENTIALS
 * ==============================================================================
 * Types governing W3C Decentralized Identifiers (DIDs), Verifiable Credentials (VCs),
 * Verifiable Presentations (VPs), and zero-knowledge credential proofs.
 */

export interface DidVerificationMethod {
  id: string;
  type: 'Ed25519VerificationKey2020' | 'JsonWebKey2020' | 'X25519KeyAgreementKey2020';
  controller: string;
  publicKeyJwk?: Record<string, any>;
  publicKeyMultibase?: string;
}

export interface DidDocument {
  context: string[];
  id: string; // e.g., "did:ion:1234..." or "did:key:z6M..."
  verificationMethod: DidVerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement?: string[];
  service?: {
    id: string;
    type: string;
    serviceEndpoint: string;
  }[];
}

export interface CredentialSubject {
  id: string; // The DID of the subject
  [key: string]: any; // Arbitrary claims (e.g., ageOver21: true, kycStatus: "PASSED")
}

export interface VerifiableCredential {
  context: string[];
  id: string;
  type: string[];
  issuer: string; // DID of the issuer
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    jws: string;
  };
}

export interface VerifiablePresentation {
  context: string[];
  id: string;
  type: string[];
  verifiableCredential: VerifiableCredential[];
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    challenge: string;
    domain: string;
    jws: string;
  };
}

export interface PresentationDefinition {
  id: string;
  input_descriptors: {
    id: string;
    purpose?: string;
    schema: {
      uri: string;
    }[];
    constraints?: {
      fields?: {
        path: string[];
        filter?: Record<string, any>;
      }[];
    };
  }[];
}

export interface ZkCredentialProof {
  proofId: string;
  provingSystem: 'Groth16' | 'Plonk';
  circuitIdentifier: string;
  publicInputs: {
    credentialSchemaUri: string;
    issuerDid: string;
    revealedClaims: Record<string, any>;
  };
  proofBytes: string; // Base64 encoded zk-SNARK proof
}

export interface SsiHubState {
  userDidDocument: DidDocument | null;
  issuedCredentials: VerifiableCredential[];
  receivedPresentations: VerifiablePresentation[];
  activePresentationDefinitions: PresentationDefinition[];
  isSyncing: boolean;
}

/**
 * ==============================================================================
 * SECTION 35: DEVELOPER HUB, API PLAYGROUND & INTERACTIVE SCHEMA EXPLORER
 * ==============================================================================
 * Types governing developer portal configurations, API key management,
 * interactive API playground requests/responses, and schema node trees.
 */

export interface RateLimitPolicy {
  policyId: string;
  tierName: 'SANDBOX' | 'STANDARD' | 'ENTERPRISE' | 'UNLIMITED';
  requestsPerSecond: number;
  requestsPerMonth: number;
  burstCapacity: number;
}

export interface DeveloperHubConfig {
  developerId: string;
  organizationName: string;
  apiKeys: APIKey[];
  activeRateLimitPolicy: RateLimitPolicy;
  webhookEndpoints: {
    endpointId: string;
    url: string;
    description?: string;
    secretKey: string;
    subscribedEvents: string[];
    isActive: boolean;
  }[];
}

export interface ApiPlaygroundRequest {
  requestId: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  bodyPayload?: string; // JSON string
  timestamp: string;
}

export interface ApiPlaygroundResponse {
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
  bodyPayload: string; // JSON string
  responseTimeMs: number;
  timestamp: string;
}

export interface SchemaNode {
  nodeId: string;
  name: string;
  type: 'OBJECT' | 'ARRAY' | 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ENUM' | 'REF';
  description: string;
  isRequired: boolean;
  children?: SchemaNode[];
  enumOptions?: string[];
  refSchemaId?: string;
}

export interface InteractiveExecutionLog {
  logId: string;
  timestamp: string;
  eventType: 'API_CALL' | 'WEBHOOK_SENT' | 'RATE_LIMIT_EXCEEDED' | 'SIGNATURE_VERIFICATION_FAILED';
  message: string;
  metadata?: Record<string, any>;
}

export interface DeveloperHubState {
  config: DeveloperHubConfig;
  playgroundHistory: {
    request: ApiPlaygroundRequest;
    response: ApiPlaygroundResponse;
  }[];
  schemaTree: Record<string, SchemaNode>;
  executionLogs: InteractiveExecutionLog[];
}
/**
 * ==============================================================================
 * SECTION 36: COMPATIBILITY ALIASES, LEGACY WRAPPERS & DATA PIPELINE TELEMETRY
 * ==============================================================================
 * Legacy wrappers, compatibility aliases, and data pipeline telemetry structures
 * to ensure seamless integration across all micro-frontends and banking modules.
 */

export type AppView = View;

export interface PortfolioAsset {
  id: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  assetClass: string;
  riskLevel: string;
}

export interface InternalAccount {
  id: string;
  productName: string;
  displayAccountNumber: string;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance: number;
  availableBalance: number;
  institutionName: string;
  connectionId: string;
}

export interface Pipeline {
  id: string;
  name: string;
  pipelineName: string;
  status: string;
  prettyDuration: string;
}

export interface InboundBlob {
  id: string;
  filePath: string;
  status: string;
  vendorName: string;
  interfaceType: string;
  createdAt: string;
}

export interface FundFlow {
  id: string;
  name: string;
  ledgerId: string;
  postedTxCount: number;
  pendingTxCount: number;
}

export interface AuthorizedApp {
  id: string;
  name: string;
  description: string;
  status: string;
  authorizedAt: string;
  scopes?: string[];
}

export interface Portfolio {
  id: string;
  name: string;
  type: string;
  currency: string;
  totalValue: number;
  unrealizedGainLoss: number;
  todayGainLoss: number;
  lastUpdated: string;
  riskTolerance: string;
  holdings: any[];
}

export interface AccountDetails {
  id: string;
  name: string;
  mask: string;
  currentBalance: number;
  type: string;
  accountHolder: string;
  currency: string;
}

export interface PaymentOrder {
  id: string;
  counterpartyId: string;
  counterpartyName: string;
  accountId: string;
  amount: number;
  currency: string;
  direction: 'credit' | 'debit';
  status: 'needs_approval' | 'approved' | 'denied' | 'paid';
  date: string;
  type: string;
  dueDate?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  counterpartyName: string;
  dueDate: string;
  amount: number;
  status: 'overdue' | 'unpaid' | 'paid';
}

export interface PlaidMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id: string;
}

export interface SecurityProfile {
  lastLogin: string;
  mfaEnabled: boolean;
}

/**
 * ==============================================================================
 * SECTION 37: QUANTUM CRYPTOGRAPHY, ZERO-KNOWLEDGE PROOFS & MULTI-PARTY COMPUTATION (MPC)
 * ==============================================================================
 * Advanced cryptographic primitives, key exchange states, and multi-party
 * computation session parameters for secure, decentralized asset custody.
 */

export interface MpcKeyShare {
  shareId: number;
  totalShares: number;
  threshold: number;
  encryptedShare: string;
  publicKeyDerivationPath: string;
  hsmKeyId?: string;
}

export interface MpcSession {
  sessionId: string;
  initiatorNodeId: string;
  participatingNodeIds: string[];
  status: 'PENDING' | 'KEY_GENERATION' | 'SIGNING' | 'COMPLETED' | 'FAILED';
  roundNumber: number;
  maxRounds: number;
  commitmentHashes: Record<string, string>;
  signatureShares: Record<string, string>;
  createdAt: string;
  expiresAt: string;
}

export interface ZkSnarkVerificationKey {
  alphaG1: string;
  betaG2: string;
  gammaG2: string;
  deltaG2: string;
  ic: string[];
}

export interface ZkSnarkProof {
  a: string[];
  b: string[][];
  c: string[];
}

/**
 * ==============================================================================
 * SECTION 38: NEURAL INTERFACE TELEMETRY & COGNITIVE LOAD BALANCING
 * ==============================================================================
 * Detailed EEG band power, cognitive fatigue metrics, and neural-lace calibration
 * parameters for high-frequency trading environments and biometric feedback loops.
 */

export interface EegBandPower {
  delta: number; // 0.5 - 4 Hz
  theta: number; // 4 - 8 Hz
  alpha: number; // 8 - 12 Hz
  beta: number;  // 12 - 30 Hz
  gamma: number; // 30 - 100 Hz
}

export interface NeuralCalibrationParameters {
  baselineAlphaPower: number;
  baselineBetaPower: number;
  artifactThresholdMicrovolts: number;
  electrodeImpedanceOhms: Record<string, number>;
  lastCalibratedAt: string;
}

export interface CognitiveFatigueMetrics {
  blinkRatePerMinute: number;
  saccadeVelocityDegSec: number;
  pupilDilationMm: number;
  microSleepEpisodesCount: number;
  fatigueIndex: number; // 0.0 to 1.0
}

/**
 * ==============================================================================
 * SECTION 39: TEMPORAL CHRONOLOGY & CYCLICAL HISTORICAL PATTERN MATCHING
 * ==============================================================================
 * Detailed Fourier analysis parameters, Kondratiev wave states, and historical
 * correlation matrices for cyclical historical analysis and predictive chronology.
 */

export interface FourierAnalysisParameters {
  samplingFrequencyHz: number;
  windowSizeSamples: number;
  dominantFrequencies: number[];
  spectralDensity: number[];
}

export interface KondratievWaveState {
  currentPhase: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
  yearsInPhase: number;
  estimatedPhaseTransitionYear: number;
  debtDeflationPressureIndex: number; // 0.0 to 1.0
}

export interface HistoricalCorrelationMatrix {
  assetClassA: string;
  assetClassB: string;
  correlationCoefficient: number;
  timeLagDays: number;
  confidenceInterval: { lower: number; upper: number };
}

/**
 * ==============================================================================
 * SECTION 40: GENESIS ENGINE MACROECONOMIC SHOCKS & EVOLUTIONARY AGENT BEHAVIORS
 * ==============================================================================
 * Detailed agent utility functions, Gini coefficient calculation states, and
 * systemic stability metrics for the multi-agent macroeconomic simulation engine.
 */

export interface AgentUtilityFunction {
  riskAversionCoefficient: number;
  intertemporalElasticityOfSubstitution: number;
  leisurePreferenceWeight: number;
  discountFactor: number;
}

export interface GiniCoefficientCalculationState {
  populationSize: number;
  cumulativeWealthShare: number[];
  cumulativePopulationShare: number[];
  calculatedGini: number; // 0.0 to 1.0
}

export interface SystemicStabilityMetrics {
  leverageRatioSystemWide: number;
  liquidityCoverageRatioSystemWide: number;
  interbankContagionRiskIndex: number; // 0.0 to 1.0
  probabilityOfSystemicDefault: number; // 0.0 to 1.0
}

/**
 * ==============================================================================
 * SECTION 41: ENTERPRISE CONTENT MANAGEMENT, PUBLISHING WORKFLOWS & DIGITAL ASSETS
 * ==============================================================================
 * Production-grade types governing content lifecycles, multi-format publishing,
 * responsive media assets, and multi-stage editorial approval workflows.
 */

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
  REVISING = 'REVISING',
  PENDING_LOCALIZATION = 'PENDING_LOCALIZATION'
}

export enum ContentType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  PODCAST = 'PODCAST',
  PAGE = 'PAGE',
  PRODUCT = 'PRODUCT',
  ADVERTISEMENT = 'ADVERTISEMENT',
  COLLECTION = 'COLLECTION',
  RECIPE = 'RECIPE',
  REVIEW = 'REVIEW',
  EVENT = 'EVENT',
  GUIDE = 'GUIDE'
}

export interface BaseContentItem {
  id: ResourceId;
  contentType: ContentType;
  title: LocalizedString;
  description?: LocalizedString;
  tags: string[];
  categories: string[];
  slug: string;
  status: PublicationStatus;
  authorId: string;
  authorName?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  unpublishAt?: Date;
  thumbnailUrl?: string;
  contentUrl?: string;
  version: number;
  locale: string;
  originalContentId?: string;
  metadata?: Record<string, any>;
  lastModifiedBy?: string;
  workflowId?: string;
}

export interface ArticleContent extends BaseContentItem {
  contentType: ContentType.ARTICLE;
  body: LocalizedString;
  readingTimeMinutes?: number;
  featuredMedia?: AssetMetadata[];
  seo: {
    metaTitle?: LocalizedString;
    metaDescription?: LocalizedString;
    keywords?: string[];
    ogImageUrl?: string;
    canonicalUrl?: string;
  };
  relatedContentIds?: ResourceId[];
  tableOfContents?: { title: LocalizedString; slug: string; level: number }[];
}

export interface VideoContent extends BaseContentItem {
  contentType: ContentType.VIDEO;
  videoUrl: string;
  durationSeconds: number;
  captionsUrl?: LocalizedString;
  embedCode?: string;
  resolution?: { width: number; height: number };
  alternativeFormats?: { url: string; quality: string; mimeType: string }[];
  processingStatus: 'pending' | 'processed' | 'failed' | 'transcoding';
}

export interface ImageContent extends BaseContentItem {
  contentType: ContentType.IMAGE;
  imageUrl: string;
  altText: LocalizedString;
  dimensions: { width: number; height: number };
  fileSizeKb: number;
  responsiveImageUrls?: { srcSet: string; mediaQuery?: string }[];
  copyright?: string;
  caption?: LocalizedString;
}

export interface ContentCollection extends BaseContentItem {
  contentType: ContentType.COLLECTION;
  itemIds: ResourceId[];
  itemCount: number;
  collectionCoverUrl?: string;
  collectionType: string;
  isOrdered: boolean;
  introduction?: LocalizedString;
  conclusion?: LocalizedString;
}

export interface AssetMetadata {
  id: ResourceId;
  fileName: string;
  mimeType: string;
  url: string;
  sizeBytes: number;
  uploadedAt: Date;
  uploadedBy: string;
  description?: LocalizedString;
  altText?: LocalizedString;
  dimensions?: { width: number; height: number };
  tags?: string[];
  associatedContentId?: ResourceId;
  source?: string;
  copyright?: LocalizedString;
  processingStatus: 'uploaded' | 'processing' | 'ready' | 'failed' | 'optimized';
  fileHash?: string;
}

export interface WorkflowStep {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  requiredRole: UserRole;
  nextTransitions: string[];
  requiresApproval: boolean;
  automationRules?: string[];
  fieldPermissions?: Record<string, 'editable' | 'read_only' | 'hidden'>;
  assignedTo?: string;
}

export interface PublishingWorkflow {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  steps: WorkflowStep[];
  initialStepId: string;
  publishedStepId: string;
  lastModified: Date;
  lastModifiedBy?: string;
  appliesToContentTypes: ContentType[];
  isActive: boolean;
}

/**
 * ==============================================================================
 * SECTION 42: MONETIZATION, SUBSCRIPTION PLANS & PRODUCT OFFERINGS
 * ==============================================================================
 * Enterprise-grade structures governing tiered subscription plans, billing cycles,
 * payment details, product catalogs, and automated invoice generation.
 */

export enum BillingFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  BIENNIALLY = 'BIENNIALLY',
  ONE_TIME = 'ONE_TIME'
}

export interface SubscriptionPlan {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  basePrice: number;
  currency: string;
  billingFrequency: BillingFrequency;
  trialDays?: number;
  features: string[];
  isActive: boolean;
  promoImageUrl?: string;
  displayOrder: number;
  metadata?: Record<string, any>;
  pricingTiers?: {
    frequency: BillingFrequency;
    price: number;
    currency: string;
    discountPercentage?: number;
  }[];
  accessGrants?: {
    contentTypes?: ContentType[];
    categories?: string[];
    specificContentIds?: ResourceId[];
    aiFeatureAccess?: string[];
  };
}

export interface PaymentDetails {
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded' | 'charged_back';
  method: string;
  invoiceId?: string;
  errorMessage?: string;
  cardLast4?: string;
  cardBrand?: string;
  providerMetadata?: Record<string, any>;
  transactionType: 'subscription_payment' | 'one_time_purchase' | 'refund' | 'trial_conversion';
}

export interface ProductOffering {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  currency: string;
  isAvailable: boolean;
  productType: string;
  associatedContentId?: ResourceId;
  imageUrl?: string;
  inventory?: number;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
  discountForPlanId?: string;
  taxable: boolean;
  shippingInfo?: {
    weightKg: number;
    dimensionsCm: { length: number; width: number; height: number };
    shippingZones: string[];
  };
}

export interface InvoiceDetails {
  id: string;
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'refunded' | 'voided';
  invoicePdfUrl?: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    productId?: ResourceId;
    subscriptionId?: string;
  }[];
  taxAmount?: number;
  discountAmount?: number;
  paymentInfo?: PaymentDetails;
}

/**
 * ==============================================================================
 * SECTION 43: ANALYTICS, SYSTEM HEALTH MONITORING & BACKGROUND JOBS
 * ==============================================================================
 * Types governing real-time telemetry metrics, dynamic dashboard widgets,
 * microservice health checks, system notifications, and asynchronous job queues.
 */

export interface MetricDataPoint {
  metricName: string;
  value: number;
  timestamp: Date;
  dimensions?: Record<string, string | number>;
  userId?: string;
  sessionId?: string;
  eventId?: string;
}

export interface DashboardWidgetConfig {
  id: string;
  title: LocalizedString;
  chartType: 'line_chart' | 'bar_chart' | 'area_chart' | 'pie_chart' | 'kpi' | 'table' | 'gauge' | 'heatmap';
  metrics: string[];
  timeRange: '24h' | '7d' | '30d' | '90d' | '1y' | 'all_time' | 'custom';
  customDateRange?: DateRange;
  filters?: Record<string, string | string[]>;
  groupBy?: string[];
  autoRefresh: boolean;
  refreshIntervalSeconds?: number;
  order: number;
  layout?: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
  };
  drilldownLink?: string;
  comparisonPeriod?: 'previous_period' | 'previous_year' | 'none';
}

export interface ServiceHealthStatus {
  serviceName: string;
  status: 'operational' | 'degraded' | 'major_outage' | 'maintenance' | 'unknown';
  lastChecked: Date;
  message?: string;
  dependencies?: Record<string, 'operational' | 'degraded' | 'major_outage' | 'unknown'>;
  responseTimeMs?: number;
  errorRate?: number;
  cpuUtilization?: number;
  memoryUtilization?: number;
  activeInstances?: number;
}

export interface SystemNotification {
  id: string;
  recipientId?: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'URGENT' | 'PROMOTIONAL' | 'CRITICAL_ALERT';
  title: LocalizedString;
  message: LocalizedString;
  actionUrl?: string;
  icon?: string;
  createdAt: Date;
  isRead: boolean;
  expiresAt?: Date;
  priority?: number;
  channels: ('in-app' | 'email' | 'push' | 'sms' | 'webhook')[];
  relatedEntityId?: ResourceId;
  relatedEntityType?: string;
}

export interface JobQueueItem {
  id: string;
  jobType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payload: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  executeAt?: Date;
  initiatedByUserId?: string;
  attempts: number;
  maxAttempts: number;
  errorMessage?: string;
  progress?: number;
  externalReferenceId?: string;
}

/**
 * ==============================================================================
 * SECTION 44: ENTERPRISE AI MODEL CONFIGURATIONS & PROMPT TEMPLATES
 * ==============================================================================
 * Advanced structures governing multi-provider AI model routing, prompt templates,
 * token usage tracking, and vector database training datasets.
 */

export enum AIModelType {
  LLM = 'LLM',
  VISION = 'VISION',
  SPEECH = 'SPEECH',
  RECOMMENDATION = 'RECOMMENDATION',
  SEARCH = 'SEARCH',
  CONTENT_GENERATION = 'CONTENT_GENERATION',
  ANALYTICS = 'ANALYTICS'
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  type: AIModelType;
  apiUrl: string;
  apiKeyRef?: string;
  defaultTemperature?: number;
  maxOutputTokens?: number;
  costPerUnit?: {
    inputToken: number;
    outputToken: number;
    currency: string;
  };
  rateLimits?: {
    requestsPerMinute?: number;
    tokensPerMinute?: number;
    burstRequests?: number;
  };
  isActive: boolean;
  capabilities: string[];
  lastUpdated: Date;
  customParameters?: Record<string, any>;
  version?: string;
}

export interface PromptTemplate {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  templateString: string;
  variables: string[];
  recommendedModelType: AIModelType;
  recommendedModelId?: string;
  defaultVariableValues?: Record<string, string>;
  systemMessage?: LocalizedString;
  outputFormat?: 'json' | 'markdown' | 'plain_text' | 'xml';
  lastUpdated: Date;
  lastModifiedBy?: string;
  isActive: boolean;
  categories?: string[];
}

export interface AIResponse<T = any> {
  responseId: string;
  modelId: string;
  input: string | PromptTemplate | Record<string, any>;
  rawOutput: string;
  parsedOutput?: T;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    cost?: number;
    currency?: string;
  };
  timestamp: Date;
  status: 'success' | 'error' | 'throttled' | 'rate_limited' | 'invalid_input';
  errorMessage?: string;
  errorCode?: string;
  providerMetadata?: Record<string, any>;
  userId?: string;
}

export interface AIFeatureDefinition {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  aiConfig: {
    modelId: string;
    promptTemplateId?: string;
    customParameters?: Record<string, any>;
  };
  isEnabled: boolean;
  isPremiumFeature: boolean;
  allowedRoles: UserRole[];
  usageLimits?: {
    callsPerPeriod?: number;
    tokensPerPeriod?: number;
    periodUnit: 'day' | 'week' | 'month' | 'lifetime';
  };
  lastUpdated: Date;
  appliesToContentTypes?: ContentType[];
  examples?: { input: string; output: string }[];
}

export interface AIDataset {
  id: string;
  name: string;
  description?: LocalizedString;
  dataType: 'text' | 'image' | 'audio' | 'mixed' | 'structured';
  source: string;
  itemCount: number;
  lastUpdated: Date;
  status: 'pending' | 'processing' | 'ready' | 'failed' | 'training_model';
  associatedModelId?: string;
  storageLocation?: string;
  sizeBytes?: number;
  createdByUserId?: string;
  accessLevel: 'public' | 'private' | 'restricted_to_team';
  qualityMetrics?: {
    completeness?: number;
    accuracy?: number;
    biasAnalysisReportUrl?: string;
  };
}

/**
 * ==============================================================================
 * SECTION 45: USER PERMISSIONS, AUTHENTICATION CLAIMS & ACCESS CONTROL
 * ==============================================================================
 * Foundational security structures governing granular user permissions, JWT claims,
 * user preferences, and active subscription entitlements.
 */

export interface UserPermissions {
  canReadAnyContent: boolean;
  canCreateContent: boolean;
  canEditContent: 'none' | 'own_content' | 'any_content';
  canDeleteContent: 'none' | 'own_content' | 'any_content';
  canPublishContent: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canApproveContent: boolean;
  canManageSubscriptions: boolean;
  canUseAIFeatures: boolean;
  canManageAssets: boolean;
  canViewAuditLogs: boolean;
  canImpersonateUsers: boolean;
  accessToResources?: string[];
  customPermissions?: Record<string, boolean>;
}

export interface AuthTokenClaims {
  userId: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  iat: number;
  exp: number;
  iss?: string;
  aud?: string | string[];
  permissions?: UserPermissions;
  subscriptionId?: string;
  tenantId?: string;
  sessionId?: string;
  customClaims?: Record<string, any>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    marketingEmails: boolean;
    contentUpdatesEnabled?: boolean;
    commentNotificationsEnabled?: boolean;
  };
  timezone: string;
  contentFilters?: string[];
  betaFeaturesOptIn: boolean;
  accessibilitySettings?: {
    highContrastMode: boolean;
    fontSizeScale: number;
  };
  preferredTopics?: string[];
  readingMode?: 'paginated' | 'continuous_scroll';
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: LocalizedString;
  status: 'active' | 'cancelled' | 'trialing' | 'past_due' | 'unpaid' | 'expired' | 'pending';
  startDate: Date;
  currentPeriodEndDate: Date;
  nextRenewalDate?: Date;
  autoRenew: boolean;
  entitlements: string[];
  lastPayment?: PaymentDetails;
  paymentGatewayCustomerId?: string;
  currentPeriodPrice: number;
  currency: string;
  promoCode?: string;
  cancelledAt?: Date;
}import React, { ReactNode } from 'react';

/**
 * ==============================================================================
 * SECTION 1: CORE REACT/UI & GLOBAL UTILITY TYPES
 * ==============================================================================
 * Foundational utility types, internationalization structures, configuration
 * interfaces, and common API response wrappers used across all micro-frontends
 * and banking modules.
 */

export type LocalizedString = {
  [locale: string]: string;
};

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ResourceId = string | number;

export type AsyncOperationStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';

export type KeyValuePairs = Record<string, string | number | boolean | object | Array<any> | null | undefined>;

export interface FilterCriterion {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

export interface SortParameter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LinkObject {
  href: string;
  text: LocalizedString;
  icon?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

export interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FeatureFlagConfig {
  enabled: boolean;
  description?: LocalizedString;
  targetAudiences?: string[];
  rolloutPercentage?: number;
  activationDate?: Date;
  expirationDate?: Date;
  regions?: string[];
  minSubscriptionPlanId?: string;
}

export interface AppConfig {
  instanceId: string;
  environment: 'development' | 'staging' | 'production' | 'test' | 'local';
  apiBaseUrl: string;
  authProviders: {
    googleClientId?: string;
    microsoftTenantId?: string;
    oktaConfig?: { domain: string; clientId: string };
    customSsoUrl?: string;
  };
  featureFlags: Record<string, boolean | FeatureFlagConfig>;
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
    resourcePath?: string;
    fallbackLocale?: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    destination: 'console' | 'remote' | 'file' | 'datadog' | 'splunk';
    remoteEndpoint?: string;
    includeUserContext?: boolean;
  };
  security: {
    corsEnabled: boolean;
    cspDirectives?: Record<string, string[]>;
    jwtSecretKeyId?: string;
    tokenExpiryMinutes: number;
    allowImpersonation?: boolean;
  };
  branding: {
    appName: LocalizedString;
    logoUrl: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
    customCssUrl?: string;
  };
  lastUpdated: Date;
  externalServiceKeys?: Record<string, string>;
}

export interface SystemSettings {
  defaultTimezone: string;
  maxConcurrentUsersOrRequests: number;
  dataRetentionPolicies: Record<string, number>;
  storageLimitGb: number;
  maintenanceWindow: {
    enabled: boolean;
    startTime?: string;
    durationHours?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'never';
    message?: LocalizedString;
  };
  thirdPartyIntegrations: {
    crmProvider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
    emailServiceId?: string;
    cdnProvider?: 'cloudfront' | 'cloudflare' | 'akamai' | 'none';
    analyticsProvider?: 'google_analytics' | 'mixpanel' | 'amplitude' | 'none';
    paymentGateway?: 'stripe' | 'paypal' | 'adyen' | 'none';
  };
  seo: {
    defaultMetaTitle: LocalizedString;
    defaultMetaDescription: LocalizedString;
    defaultKeywords: string[];
    robotTxtContent?: string;
    sitemapGenerationEnabled: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  nextPageLink?: string;
  previousPageLink?: string;
  firstPageLink?: string;
  lastPageLink?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: LocalizedString | string;
  errorCode: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  infoUrl?: string;
}

/**
 * ==============================================================================
 * SECTION 2: GITHUB & REPOSITORY MANAGEMENT TYPES
 * ==============================================================================
 * Types governing repository synchronization, file trees, automated swarm edits,
 * project generation pipelines, advanced AI-driven refactoring, and CI/CD workflow runs.
 */

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  description?: string;
  html_url?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
}

export interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
  size?: number;
}

export interface FileContent {
  path: string;
  content: string; // base64 encoded
  sha: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  children: (DirNode | FileNode)[];
}

export type UnifiedFileTree = {
  [repoFullName: string]: {
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
  };
};

export interface SelectedFile {
  repoFullName: string;
  path: string;
  content: string; // original content from git
  editedContent: string; // content being edited in the UI
  sha: string;
  defaultBranch: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface PullRequestPayload {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface PullRequest {
  id: number;
  html_url: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

export type BulkEditJobStatus = 'queued' | 'planning' | 'processing' | 'retrying' | 'success' | 'skipped' | 'failed';

export interface AIWorkerStatus {
  model: string;
  status: 'idle' | 'working' | 'finished' | 'failed';
  content: string;
}

export interface EditCheckpoint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface BulkEditJob {
  id: string; // repoFullName::path
  repoFullName: string;
  path: string;
  status: BulkEditJobStatus;
  content: string; // For streaming preview
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectPlan {
  files: {
    path: string;
    description: string;
  }[];
}

export type ProjectGenerationJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';

export interface ProjectGenerationJob {
  id: string; // file path
  path: string;
  description: string;
  status: ProjectGenerationJobStatus;
  content: string; // For streaming preview
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface ProjectExpansionBatch {
  agentIndex: number;
  files: {
    path: string;
    description: string;
  }[];
}

export interface ProjectExpansionPlan {
  reasoning?: string;
  batches?: ProjectExpansionBatch[];
  filesToEdit?: {
    path: string;
    changes: string; // Detailed instructions on what to change
  }[];
  filesToCreate?: {
    path: string;
    description: string;
    agentIndex: number;
  }[];
}

export type ProjectExpansionJobStatus = 'queued' | 'generating' | 'committing' | 'retrying' | 'success' | 'failed';
export type ProjectExpansionPhase = 'idle' | 'planning' | 'generating' | 'complete';

export interface ProjectExpansionJob {
  id: string; // unique id or file path
  path?: string;
  type?: 'edit' | 'create';
  description?: string; // For creations, it's purpose. For edits, it's the planned changes.
  agentIndex?: number;
  batch?: ProjectExpansionBatch;
  status: ProjectExpansionJobStatus;
  content: string; // Cumulative content for streaming (JSON-like) or streaming preview
  thought?: string; // Agent reasoning for this batch
  generatedFiles?: { path: string; content: string }[];
  error: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at?: string;
}

export interface RepositoryEditPlan {
  reasoning: string;
  filesToEdit: {
    path: string;
    changes: string; // Detailed instructions on what to change in this specific file
  }[];
}

export type AdvancedEditJobStatus = 'planning' | 'editing' | 'verifying' | 'committing' | 'success' | 'failed';
export type AdvancedEditPhase = 'idle' | 'analyzing' | 'planning' | 'editing' | 'committing' | 'triggering_workflow' | 'waiting_for_workflow' | 'analyzing_failure' | 'complete';

export interface AdvancedEditJob {
  id: string; // file path
  path: string;
  status: AdvancedEditJobStatus;
  content: string;
  error: string | null;
  checkpoints?: EditCheckpoint[];
  currentCheckpointId?: string | null;
  workers?: AIWorkerStatus[];
  attempts?: number;
}

export type JellyfishJobStatus =
  | 'queued'
  | 'drafting'
  | 'critiquing'
  | 'refining'
  | 'finalizing'
  | 'success'
  | 'failed';

export interface JellyfishJob {
  id: string; // file path
  path: string;
  description: string; // The instruction for this specific file
  status: JellyfishJobStatus;
  currentContent: string; // The content as it evolves
  critiqueCount: number; // How many times it has been refined (the "Double Check")
  lastCritique: string | null; // What the AI thought was wrong
}

export type JellyfishPhase = 'idle' | 'planning' | 'swarming' | 'complete';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
  content?: string;
  size?: number;
}
/**
 * ==============================================================================
 * SECTION 3: EXECUTIVE MAGAZINE & MULTIMEDIA CREATION TYPES
 * ==============================================================================
 * Types governing the generation, layout, rendering, and narration of high-end
 * digital publications, executive lookbooks, and AI-driven multimedia assets.
 */

export const TOTAL_PAGES = 8;
export const BATCH_SIZE = 4;
export const INITIAL_PAGES = 2;

export const LOCATIONS = [
  'Wall Street Boardroom',
  'Silicon Valley Tech Campus',
  'Dubai Skyscraper Penthouse',
  'Paris Fashion Week Front Row',
  'Private Island Villa',
  'Luxury Private Jet',
  'Monaco Yacht Deck',
  'Swiss Alps Davos Summit'
];

export const STYLES = [
  'Power Suit (Classic Bespoke)',
  'Tech Mogul (Minimalist Luxury)',
  'Black Tie Gala (Formal)',
  'Avant-Garde Executive (Bold)',
  'Old Money (Quiet Luxury)',
  'Streetwear CEO (High-End Casual)'
];

export type RenderingEngine = 'stable-diffusion' | 'midjourney' | 'dall-e-3' | 'flux' | 'imagen' | 'custom-gan';

export interface SceneDesc {
  setting: string;
  outfit: string;
  caption: string;
  lighting?: string;
  cameraAngle?: string;
  colorPalette?: string[];
  historicalReference?: string;
  brandTags?: string[];
}

export interface LookPage {
  id: string;
  type: 'cover' | 'look' | 'back_cover';
  imageUrl?: string;
  sceneDesc?: SceneDesc;
  isLoading: boolean;
  pageIndex?: number;
  videoUrl?: string;
  isAnimating?: boolean;
  audioUrl?: string;
  narrationText?: string;
  renderingEngine?: RenderingEngine;
  promptUsed?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  seed?: number;
  cfgScale?: number;
  steps?: number;
  generationTimeMs?: number;
  error?: string;
}

export interface Asset {
  id: string;
  base64: string;
  desc: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  body: string;
  elements: VisualElement[];
}

export interface VisualElement {
  id: string;
  type: 'image' | 'seal' | 'divider' | 'illustration' | 'scenery';
  src: string;
  position: { x: number; y: number };
  alt: string;
  isAnimated?: boolean;
  scale?: number;
  rotation?: number;
}

export enum AIServiceAction {
  REWRITE = 'REWRITE',
  ILLUMINATE = 'ILLUMINATE',
  PROPHESY = 'PROPHESY',
  SEAL = 'SEAL',
  CIPHER = 'CIPHER',
  SCENERY = 'SCENERY',
  ENCHANT = 'ENCHANT'
}

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Ariel' | 'Oberon' | 'Titania';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  sampleRateHz?: number;
  languageCode?: string;
}

export interface SpeechHistoryItem {
  id: string;
  text: string;
  voice: VoiceName;
  timestamp: number;
  audioUrl?: string;
  durationMs?: number;
  characterCount: number;
}

/**
 * ==============================================================================
 * SECTION 4: NEWS, FEEDS & SENTIMENT ANALYSIS TYPES
 * ==============================================================================
 * Structures governing real-time financial news aggregation, sentiment analysis,
 * urgency scoring, and AI-driven market insights.
 */

export enum StaticCategory {
  TOP_STORIES = 'Global Pulse',
  POLITICS = 'Governance',
  TECH = 'Infrastructure',
  FINANCE = 'Markets',
  CRYPTO = 'Decentralized Ledger',
  ENERGY = 'Thermodynamics',
  BIOTECH = 'Genomics',
  SPACE = 'Orbital Mechanics'
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: number; // Scale of 1-10
  tags: string[];
  author?: string;
  content?: string;
  imageUrl?: string;
  sentimentScore?: number; // Continuous value from -1.0 to 1.0
  relevanceScore?: number; // Continuous value from 0.0 to 1.0
  language?: string;
  isFactChecked?: boolean;
  factCheckDetails?: string;
  biasRating?: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  relatedTickers?: string[];
}

export interface FeedPage {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  lastUpdated: string;
  aiInsights: string;
  curatorId?: string;
  isPublic: boolean;
  subscriberCount?: number;
  customFilterCriteria?: FilterCriterion[];
}

/**
 * ==============================================================================
 * SECTION 5: FILE SYSTEM, STORAGE & CLOUD MANAGEMENT TYPES
 * ==============================================================================
 * Types governing local and cloud file systems, indexing, AI-assisted summaries,
 * and multi-source repository exploration.
 */

export enum FileType {
  FOLDER = 'folder',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  GENERIC = 'generic',
  CODE = 'code',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  DATABASE = 'database',
  MODEL_3D = 'model_3d'
}

export type FileSource = 'local' | 'github' | 'ai' | 'google-drive' | 'aws-s3' | 'ipfs' | 'dropbox';

export interface FileVersion {
  versionId: string;
  modifiedBy: string;
  modifiedAt: string;
  size: number;
  changeLog?: string;
  downloadUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string | null;
  source: FileSource;
  extension?: string;
  mimeType?: string;
  content?: string; // Text, DataURL, or Download URL
  aiSummary?: string;
  aiKeywords?: string[];
  isIndexing?: boolean;
  githubRepo?: string;
  githubOwner?: string;
  githubUrl?: string;
  driveFileId?: string;
  isCloudFolder?: boolean;
  ownerId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  versionHistory?: FileVersion[];
  isEncrypted?: boolean;
  encryptionAlgorithm?: string;
  hash?: string;
  tags?: string[];
}

export interface NavigationState {
  currentPath: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid' | 'gallery' | 'tree' | 'kanban';
  sortBy: 'name' | 'size' | 'lastModified' | 'type';
  sortDirection: 'asc' | 'desc';
  searchQuery?: string;
  filterType?: FileType | 'all';
}

/**
 * ==============================================================================
 * SECTION 6: CORE BANKING, TRANSACTIONS & CAPITAL ALLOCATION TYPES
 * ==============================================================================
 * Foundational types for personal and corporate banking, ledger accounts,
 * transaction processing, and AI-driven financial planning.
 */

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'fedwire' | 'rtp';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'credit' | 'debit';

export type TransactionStatus =
  | 'POSTED'
  | 'PENDING'
  | 'Initiated'
  | 'Processing'
  | 'Completed'
  | 'Failed'
  | 'needs_approval'
  | 'approved'
  | 'denied'
  | 'paid';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string | string[];
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: KeyValuePairs;
  pending?: boolean;
  reconciled?: boolean;
  reconciliation_id?: string;
  nexus_link_id?: string;
  institution_origin?: string;
  cardId?: string;
  holderName?: string;
  merchant?: string;
  status?: TransactionStatus;
  timestamp?: string;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string;
  assetClass?: string;
  riskLevel?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining?: number;
  category?: string;
  alerts?: Alert[];
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
  credits: number;
}

export interface AIPlanStep {
  title: string;
  description: string;
  timeline: string;
  category?: string;
}

export interface AIPlan {
  title: string;
  summary: string;
  steps: AIPlanStep[];
}

export type IllusionType = 'none' | 'aurora' | 'blue' | 'dark';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  institutionId?: string;
  type?: string;
  balance?: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: string;
}

export enum WeaverStage {
  Pitch = 'pitch',
  Analysis = 'analysis',
  Test = 'test',
  FinalReview = 'final_review',
  Approved = 'approved',
  Results = 'results',
  Error = 'error'
}

export interface QuantumWeaverState {
  stage: WeaverStage;
  businessPlan: string;
  feedback: string;
  questions: AIQuestion[];
  loanAmount: number;
  coachingPlan: AIPlan | null;
  error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  aiJustification?: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress?: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCardControls {
  atm: boolean;
  contactless: boolean;
  online: boolean;
  monthlyLimit: number;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: CorporateCardControls;
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description?: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Counterparty {
  id: string;
  name: string;
  email?: string | null;
  send_remittance_advice?: boolean;
  type?: 'business' | 'individual';
  riskLevel?: 'Low' | 'Medium' | 'High';
  createdDate?: string;
  accounts: ExternalAccount[];
  virtualAccounts: VirtualAccount[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name?: string;
  verification_status?: string;
  account_details?: any[];
  routing_details?: any[];
}

export interface VirtualAccount {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  balance?: number;
  currency?: string;
  status?: string;
  subAccounts?: VirtualAccount[];
  description?: string;
  counterparty_id?: string;
  internal_account_id?: string;
  debit_ledger_account_id?: string;
  credit_ledger_account_id?: string;
  metadata?: any;
  account_details?: any[];
  routing_details?: any[];
}

export interface AIGoalPlanStep {
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Investing' | 'Income' | string;
}

export interface AIGoalPlan {
  feasibilitySummary: string;
  monthlyContribution: number;
  steps: AIGoalPlanStep[];
  actionableSteps?: string[];
  summary?: string;
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  type: 'manual' | 'recurring';
}

export interface RecurringContribution {
  id: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface LinkedGoal {
  id: string;
  relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
  triggerAmount?: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  iconName: string;
  plan: AIGoalPlan | null;
  startDate: string;
  riskProfile?: RiskProfile;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  linkedGoals: LinkedGoal[];
  recurringContributions: RecurringContribution[];
  contributions: Contribution[];
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number; // in reward points
  type: 'cashback' | 'giftcard' | 'impact' | string;
  description: string;
  iconName: string;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini' | string;

export interface APIStatus {
  provider: APIProvider;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number; // in ms
}

export interface CreditFactor {
  name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix' | string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}
/**
 * ==============================================================================
 * SECTION 7: PLAID, MARQETA, MODERN TREASURY & OPEN BANKING INTEGRATION TYPES
 * ==============================================================================
 * Enterprise-grade types governing secure connections, credential management,
 * card issuance, ledgering, and multi-node financial mesh protocols.
 */

export interface PlaidCredentials {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
}

export interface MarqetaCredentials {
  app_token?: string;
  admin_token?: string;
  applicationToken?: string;
  adminAccessToken?: string;
  base_url?: string;
}

export interface ModernTreasuryCredentials {
  apiKey: string;
  orgId?: string;
  organizationId?: string;
}

export interface PlaidTokenState {
  linkToken: string | null;
  publicToken: string | null;
  accessToken: string | null;
}

export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: AccountBalance;
  institution?: string;
}

export interface ConnectedItem {
  institutionId: string;
  institutionName: string;
  accessToken: string;
  itemId: string;
  accounts: Account[];
  transactions: Transaction[];
  metadata: {
    linked_at: string;
    node_priority: number;
    mesh_protocol: 'NEXUS-V3' | string;
    routing_hops: string[];
  };
}

export interface UCCFiling {
  id: string;
  status: 'Draft' | 'Submitted' | 'Processing' | 'Filed' | 'Rejected';
  receiptId?: string;
  fileNumber?: string;
  packetNum: string;
  transType: 'Initial' | 'Amendment';
  amount: number;
  dateCreated: string;
  xmlPayload: string;
  errors?: string[];
}

export interface UnifiedPayload {
  timestamp: string;
  nexus_version: string;
  nexus_id: string;
  global_metadata: {
    client_context: string;
    reconciliation_depth: number;
    combined_hash: string;
  };
  mesh_stats: {
    total_liquidity: number;
    total_liabilities: number;
    net_position: number;
    active_institutions: number;
  };
  cross_institutional_ledger: {
    items: ConnectedItem[];
    reconciled_pairs: any[];
  };
  compliance: {
    active_ucc_filings: UCCFiling[];
  };
}

export enum FlowStep {
  CREDENTIALS = 'CREDENTIALS',
  LINK_TOKEN = 'LINK_TOKEN',
  LINK_UI = 'LINK_UI',
  EXCHANGE = 'EXCHANGE',
  DASHBOARD = 'DASHBOARD',
  UCC_CENTER = 'UCC_CENTER',
  MARQETA_NODE = 'MARQETA_NODE',
  MODERN_TREASURY_NODE = 'MODERN_TREASURY_NODE',
  TAXONOMY_REGISTRY = 'TAXONOMY_REGISTRY'
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  created_time?: string;
  start_date?: string;
  config: any;
}

export interface MarqetaCard {
  token: string;
  user_token: string;
  card_product_token: string;
  last_four: string;
  pan: string;
  expiration: string;
  cvv: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | string;
}

export interface MTLedger {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, string>;
}

export interface MTInternalAccount {
  id: string;
  name: string;
  currency: string;
  connection: { vendor_name: string };
  status: string;
}

export interface PlaidLinkSuccessMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id?: string;
}

export type PlaidProduct =
  | 'assets'
  | 'auth'
  | 'balance'
  | 'identity'
  | 'investments'
  | 'liabilities'
  | 'payment_initiation'
  | 'transactions';

export interface MarqetaUser {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  last_modified_time: string;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns?: string;
  };
  provider?: any;
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface LedgerAccount {
  id: string;
  name: string;
  balances: {
    available_balance: { amount: number; currency: string };
    pending_balance: { amount: number; currency: string };
    posted_balance: { amount: number; currency: string };
  };
}

export interface SettlementInstruction {
  messageId: string;
  creationDateTime: string;
  numberOfTransactions: number;
  settlementDate: string;
  totalAmount: number;
  currency: string;
  purpose?: string;
}

/**
 * ==============================================================================
 * SECTION 8: ENTERPRISE OPERATIONS, CORPORATE COMMAND, COMPLIANCE & ISO 20022
 * ==============================================================================
 * Types governing corporate command centers, compliance audits, anomaly detection,
 * cash flow forecasting, and ISO 20022 financial messaging standards.
 */

export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore?: number;
  recommendedAction?: string;
}

export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

export interface FraudRule {
  id: string;
  name: string;
  description?: string;
  severity: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
}

export interface ComplianceCase {
  id: string;
  reason: string;
  entityType: string;
  entityId: string;
  status: 'open' | 'closed' | 'investigating' | string;
  openedDate: string;
  type?: string;
  description?: string;
}

export interface FinancialAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: AnomalyStatus;
  entityType: string;
  entityId: string;
  entityDescription: string;
  timestamp: string;
  riskScore: number;
}

export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved' | 'False Positive';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  action: 'flag_for_review' | 'block' | 'notify_admin' | string;
  active: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  revenue: number;
  growth: number;
  riskScore: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetResource: string;
  success: boolean;
  details?: string;
  metadata?: any;
  ipAddress?: string;
}

export interface ThreatAlert {
  alertId: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataSharingPolicy {
  policyId: string;
  policyName: string;
  scope: string;
  isActive: boolean;
  lastReviewed: string;
}

export interface APIKey {
  id: string;
  keyName: string;
  creationDate: string;
  scopes: string[];
  lastUsed?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  verified: boolean;
}

export interface SecurityAwarenessModule {
  moduleId: string;
  title: string;
  completionRate: number;
}

export interface TransactionRule {
  ruleId: string;
  name: string;
  triggerCondition: string;
  action: string;
  isEnabled: boolean;
}

export interface SecurityScoreMetric {
  metricName: string;
  currentValue: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  lastActivity: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  permissions: string[];
  status: string;
  firstSeen: string;
  userAgent: string;
  pushNotificationsEnabled: boolean;
  biometricAuthEnabled: boolean;
  encryptionStatus: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  timestamp: string;
  isCurrent: boolean;
  userAgent: string;
}

export interface DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password?: string;
  databaseName: string;
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full';
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface WebDriverStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  activeTask: string | null;
  logs: string[];
}

export interface ExternalCorporateActionEventType1Code {}
export interface ExternalAcceptedReason1Code {}
export interface ExternalAccountIdentification1Code {}
export interface ExternalAgentInstruction1Code {}
export interface ExternalAgreementType1Code {}
export interface ExternalAuthenticationChannel1Code {}
export interface ExternalAuthenticationMethod1Code {}
export interface ExternalAuthorityExchangeReason1Code {}
export interface ExternalAuthorityIdentification1Code {}
export interface ExternalBalanceSubType1Code {}
export interface ExternalBalanceType1Code {}
export interface ExternalBankTransactionDomain1Code {}
export interface ExternalBankTransactionFamily1Code {}
export interface ExternalBankTransactionSubFamily1Code {}
export interface ExternalBenchmarkCurveName1Code {}
export interface ExternalBillingBalanceType1Code {}
export interface ExternalBillingCompensationType1Code {}
export interface ExternalBillingRateIdentification1Code {}
export interface ExternalCalculationAgent1Code {}
export interface ExternalCancellationReason1Code {}
export interface ExternalCardTransactionCategory1Code {}
export interface ExternalCashAccountType1Code {}
export interface ExternalCashClearingSystem1Code {}
export interface ExternalCategoryPurpose1Code {}
export interface ExternalChannel1Code {}
export interface ExternalChargeType1Code {}
export interface ExternalChequeAgentInstruction1Code {}
export interface ExternalChequeCancellationReason1Code {}
export interface ExternalChequeCancellationStatus1Code {}
export interface ExternalClaimNonReceiptRejection1Code {}
export interface ExternalClearingSystemIdentification1Code {}
export interface ExternalCollateralReferenceDataStatusReason1Code {}
export interface ExternalCommunicationFormat1Code {}
export interface ExternalContractBalanceType1Code {}
export interface ExternalContractClosureReason1Code {}
export interface ExternalCreditLineType1Code {}
export interface ExternalCreditorAgentInstruction1Code {}
export interface ExternalCreditorEnrolmentAmendmentReason1Code {}
export interface ExternalCreditorEnrolmentCancellationReason1Code {}
export interface ExternalCreditorEnrolmentStatusReason1Code {}
export interface ExternalCreditorReferenceType1Code {}
export interface ExternalDateFrequency1Code {}
export interface ExternalDateType1Code {}
export interface ExternalDebtorActivationAmendmentReason1Code {}
export interface ExternalDebtorActivationCancellationReason1Code {}
export interface ExternalDebtorActivationStatusReason1Code {}
export interface ExternalDebtorAgentInstruction1Code {}
export interface ExternalDeviceOperatingSystemType1Code {}
export interface ExternalDiscountAmountType1Code {}
export interface ExternalDocumentAmountType1Code {}
export interface ExternalDocumentFormat1Code {}
export interface ExternalDocumentLineType1Code {}
export interface ExternalDocumentPurpose1Code {}
export interface ExternalDocumentType1Code {}
export interface ExternalEffectiveDateParameter1Code {}
export interface ExternalEmissionAllowanceSubProductType1Code {}
export interface ExternalEncryptedElementIdentification1Code {}
export interface ExternalEnquiryRequestType1Code {}
export interface ExternalEntitySize1Code {}
export interface ExternalEntityType1Code {}
export interface ExternalEntryStatus1Code {}
export interface ExternalFinancialInstitutionIdentification1Code {}
export interface ExternalFinancialInstrumentIdentificationType1Code {}
export interface ExternalFinancialInstrumentProductType1Code {}
export interface ExternalGarnishmentType1Code {}
export interface ExternalIncoterms1Code {}
export interface ExternalIndustrySectorClassification1Code {}
export interface ExternalInformationType1Code {}
export interface ExternalInstructedAgentInstruction1Code {}
export interface ExternalInvestigationAction1Code {}
export interface ExternalInvestigationActionReason1Code {}
export interface ExternalInvestigationExecutionConfirmation1Code {}
export interface ExternalInvestigationInstrument1Code {}
export interface ExternalInvestigationReason1Code {}
export interface ExternalInvestigationReasonSubType1Code {}
export interface ExternalInvestigationServiceLevel1Code {}
export interface ExternalInvestigationStatus1Code {}
export interface ExternalInvestigationStatusReason1Code {}
export interface ExternalInvestigationSubType1Code {}
export interface ExternalInvestigationType1Code {}
export interface ExternalLegalFramework1Code {}
export interface ExternalLetterType1Code {}
export interface ExternalLocalInstrument1Code {}
export interface ExternalMandateReason1Code {}
export interface ExternalMandateSetupReason1Code {}
export interface ExternalMandateStatus1Code {}
export interface ExternalMandateSuspensionReason1Code {}
export interface ExternalMarketArea1Code {}
export interface ExternalMarketInfrastructure1Code {}
export interface ExternalMessageFunction1Code {}
export interface ExternalModelFormIdentification1Code {}
export interface ExternalNarrativeType1Code {}
export interface ExternalNotificationCancellationReason1Code {}
export interface ExternalNotificationSubType1Code {}
export interface ExternalNotificationType1Code {}
export interface ExternalOrganisationIdentification1Code {}
export interface ExternalPackagingType1Code {}
export interface ExternalPartyRelationshipType1Code {}
export interface ExternalPaymentCancellationRejection1Code {}
export interface ExternalPaymentCompensationReason1Code {}
export interface ExternalPaymentControlRequestType1Code {}
export interface ExternalPaymentGroupStatus1Code {}
export interface ExternalPaymentModificationRejection1Code {}
export interface ExternalPaymentRole1Code {}
export interface ExternalPaymentScenario1Code {}
export interface ExternalPaymentTransactionStatus1Code {}
export interface ExternalPendingProcessingReason1Code {}
export interface ExternalPersonIdentification1Code {}
export interface ExternalPostTradeEventType1Code {}
export interface ExternalProductType1Code {}
export interface ExternalProxyAccountType1Code {}
export interface ExternalPurpose1Code {}
export interface ExternalRatesAndTenors1Code {}
export interface ExternalReRepresentmentReason1Code {}
export interface ExternalReceivedReason1Code {}
export interface ExternalRegulatoryInformationType1Code {}
export interface ExternalRejectedReason1Code {}
export interface ExternalRelativeTo1Code {}
export interface ExternalReportingSource1Code {}
export interface ExternalRequestStatus1Code {}
export interface ExternalReservationType1Code {}
export interface ExternalReturnReason1Code {}
export interface ExternalReversalReason1Code {}
export interface ExternalSecuritiesLendingType1Code {}
export interface ExternalSecuritiesPurpose1Code {}
export interface ExternalSecuritiesUpdateReason1Code {}
export interface ExternalServiceLevel1Code {}
export interface ExternalShipmentCondition1Code {}
export interface ExternalStatusReason1Code {}
export interface ExternalSystemBalanceType1Code {}
export interface ExternalSystemErrorHandling1Code {}
export interface ExternalSystemEventType1Code {}
export interface ExternalSystemMemberType1Code {}
export interface ExternalSystemPartyType1Code {}
export interface ExternalTaxAmountType1Code {}
export interface ExternalTechnicalInputChannel1Code {}
export interface ExternalTradeMarket1Code {}
export interface ExternalTradeTransactionCondition1Code {}
export interface ExternalTypeOfParty1Code {}
export interface ExternalUnableToApplyIncorrectData1Code {}
export interface ExternalUnableToApplyMissingData1Code {}
export interface ExternalUnderlyingTradeTransactionType1Code {}
export interface ExternalUndertakingAmountType1Code {}
export interface ExternalUndertakingDocumentType1Code {}
export interface ExternalUndertakingDocumentType2Code {}
export interface ExternalUndertakingStatusCategory1Code {}
export interface ExternalUndertakingType1Code {}
export interface ExternalUnitOfMeasure1Code {}
export interface ExternalValidationRuleIdentification1Code {}
export interface ExternalVerificationReason1Code {}
export interface Biso20022 {}
/**
 * ==============================================================================
 * SECTION 9: SOVEREIGN IDENTITY, USER PROFILES & SOCIAL GRAPH TYPES
 * ==============================================================================
 * Enterprise-grade identity structures, multi-role authorization matrices,
 * neural-lace telemetry, genomic anchors, and decentralized social graph nodes.
 */

export enum View {
  // --- Core ---
  Dashboard = 'dashboard',
  
  // --- Personal Command ---
  Transactions = 'transactions',
  SendMoney = 'send-money',
  Budgets = 'capital-allocation', // Renamed for spec
  FinancialGoals = 'strategic-goals',
  CreditHealth = 'credit-resonance',
  Personalization = 'interface-will',
  Accounts = 'accounts-overview',
  
  // --- Sovereign Wealth ---
  Investments = 'portfolio-overview',
  Crypto = 'web3-crypto',
  CryptoWeb3 = 'web3-crypto', // Added alias
  AlgoTradingLab = 'algo-trading-lab',
  ForexArena = 'forex-arena',
  CommoditiesExchange = 'commodities',
  RealEstateEmpire = 'real-estate',
  ArtCollectibles = 'art-collectibles',
  DerivativesDesk = 'derivatives',
  VentureCapital = 'venture-capital',
  PrivateEquity = 'private-equity',
  TaxOptimization = 'tax-optimization',
  LegacyBuilder = 'legacy-architect',
  SovereignWealth = 'sovereign-wealth-sim',
  QuantumAssets = 'quantum-assets',
  
  // --- Citi Connect Core ---
  CitibankAccounts = 'citi-accounts',
  CitibankAccountProxy = 'citi-account-proxy',
  CitibankBillPay = 'citi-bill-payment',
  CitibankCrossBorder = 'citi-cross-border',
  CitibankPayeeManagement = 'citi-payee-mgmt',
  CitibankStandingInstructions = 'citi-standing-instructions',
  CitibankDeveloperTools = 'citi-dev-tools',
  CitibankEligibility = 'citi-eligibility-check',
  CitibankUnmaskedData = 'citi-secure-data-view',

  // --- Plaid Nexus ---
  PlaidMainDashboard = 'plaid-overview',
  DataNetwork = 'plaid-overview', // Added alias
  PlaidIdentity = 'plaid-identity-verification',
  PlaidCRAMonitoring = 'plaid-cra-monitoring',
  PlaidInstitutions = 'plaid-institutions-explorer',
  PlaidItemManagement = 'plaid-item-management',
  
  // --- Enterprise Operations ---
  CorporateCommand = 'corporate-command',
  ModernTreasury = 'modern-treasury',
  Treasury = 'treasury-capital',
  CardPrograms = 'marqeta-cards',
  Payments = 'stripe-payments',
  StripeNexus = 'stripe-nexus',
  CounterpartyDashboard = 'counterparties',
  VirtualAccounts = 'virtual-accounts',
  CorporateActions = 'corporate-actions',
  CreditNoteLedger = 'credit-notes',
  ReconciliationHub = 'reconciliation-hub',
  GEINDashboard = 'gein-dashboard',
  CardholderManagement = 'cardholder-mgmt',
  VentureCapitalDeskView = 'vc-desk-view',

  // --- System & Intelligence ---
  AIAdvisor = 'ai-advisor',
  AIInsights = 'predictive-insights',
  QuantumWeaver = 'quantum-weaver',
  AgentMarketplace = 'agent-marketplace',
  AIAdStudio = 'ai-ad-studio',
  GlobalPositionMap = 'global-position-map',
  GlobalSsiHub = 'global-ssi-hub',
  SecurityCompliance = 'security-compliance',
  DeveloperHub = 'developer-hub',
  SchemaExplorer = 'iso-20022-explorer',
  ResourceGraph = 'resource-graph',
  TheVision = 'the-vision',
  ApiPlayground = 'api-playground',
  ComplianceOracle = 'compliance-oracle',

  // --- Admin & Tools ---
  CustomerDashboard = 'customer-dashboard',
  VerificationReports = 'verification-reports',
  FinancialReporting = 'financial-reporting',
  StripeNexusDashboard = 'stripe-nexus-admin',

  // --- Components (Direct Access) ---
  AccountDetails = 'account-details',
  AccountList = 'account-list',
  AccountStatementGrid = 'account-statement-grid',
  AccountsView = 'accounts-view',
  AccountVerificationModal = 'account-verification-modal',
  ACHDetailsDisplay = 'ach-details-display',
  AICommandLog = 'ai-command-log',
  AIPredictionWidget = 'ai-prediction-widget',
  AssetCatalog = 'asset-catalog',
  AutomatedSweepRules = 'automated-sweep-rules',
  BalanceReportChart = 'balance-report-chart',
  BalanceTransactionTable = 'balance-transaction-table',
  CardDesignVisualizer = 'card-design-visualizer',
  ChargeDetailModal = 'charge-detail-modal',
  ChargeList = 'charge-list',
  ConductorConfigurationView = 'conductor-configuration-view',
  CounterpartyDetails = 'counterparty-details',
  CounterpartyForm = 'counterparty-form',
  DisruptionIndexMeter = 'disruption-index-meter',
  DocumentUploader = 'document-uploader',
  DownloadLink = 'download-link',
  EarlyFraudWarningFeed = 'early-fraud-warning-feed',
  ElectionChoiceForm = 'election-choice-form',
  EventNotificationCard = 'event-notification-card',
  ExpectedPaymentsTable = 'expected-payments-table',
  ExternalAccountCard = 'external-account-card',
  ExternalAccountForm = 'external-account-form',
  ExternalAccountsTable = 'external-accounts-table',
  FinancialAccountCard = 'financial-account-card',
  IncomingPaymentDetailList = 'incoming-payment-detail-list',
  InvoiceFinancingRequest = 'invoice-financing-request',
  PaymentInitiationForm = 'payment-initiation-form',
  PaymentMethodDetails = 'payment-method-details',
  PaymentOrderForm = 'payment-order-form',
  PayoutsDashboard = 'payouts-dashboard',
  PnLChart = 'pnl-chart',
  RefundForm = 'refund-form',
  RemittanceInfoEditor = 'remittance-info-editor',
  ReportingView = 'reporting-view',
  ReportRunGenerator = 'report-run-generator',
  ReportStatusIndicator = 'report-status-indicator',
  SsiEditorForm = 'ssi-editor-form',
  StripeNexusView = 'stripe-nexus-view',
  StripeStatusBadge = 'stripe-status-badge',
  StructuredPurposeInput = 'structured-purpose-input',
  SubscriptionList = 'subscription-list',
  TimeSeriesChart = 'time-series-chart',
  TradeConfirmationModal = 'trade-confirmation-modal',
  TransactionFilter = 'transaction-filter',
  TransactionList = 'transaction-list',
  TreasuryTransactionList = 'treasury-transaction-list',
  UniversalObjectInspector = 'universal-object-inspector',
  VirtualAccountForm = 'virtual-account-form',
  VirtualAccountsTable = 'virtual-accounts-table',
  VoiceControl = 'voice-control',
  WebhookSimulator = 'webhook-simulator',

  // Educational & 527 Views
  TheBook = 'the-book',
  KnowledgeBase = 'knowledge-base',
  
  // Auth & Settings
  Settings = 'settings',
  SSO = 'sso',
  ConciergeService = 'concierge-service',
  Philanthropy = 'philanthropy',
  OpenBanking = 'open-banking',
  FinancialDemocracy = 'financial-democracy',
  APIStatus = 'api-status',
  APIIntegration = 'api-integration',
  APIConsole = 'api-console',
  SecurityCenter = 'security-center',
  Security = 'security',
  AIStrategy = 'ai-strategy',
  Goals = 'financial-goals',
  Rewards = 'rewards',
  CardCustomization = 'card-customization',
}

export type UserRole =
  | 'ADMIN'
  | 'TRADER'
  | 'CLIENT'
  | 'VISIONARY'
  | 'CARETAKER'
  | 'QUANT_ANALYST'
  | 'SYSTEM_ARCHITECT'
  | 'ETHICS_OFFICER'
  | 'DATA_SCIENTIST'
  | 'NETWORK_WEAVER'
  | 'CITIZEN'
  | 'FOUNDER'
  | 'INVESTOR'
  | 'MANAGER';

export type SecurityLevel =
  | 'STANDARD'
  | 'ELEVATED'
  | 'TRADING_UNLOCKED'
  | 'QUANTUM_ENCRYPTED'
  | 'SOVEREIGN_CLEARED'
  | 'ARCHITECT_LEVEL';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles?: UserRole[];
  securityLevel?: SecurityLevel;
  netWorth?: number;
  display_name?: string;
  handle?: string;
  role?: string;
  businessId?: string;
  profilePictureUrl?: string;
  bio?: string;
  profile?: {
    interests: string[];
    skills: string[];
    [key: string]: any;
  };
  wallet?: {
    balance: number;
    currency: string;
  };
  businesses?: string[];
  memberships?: any[];
  followers?: string[];
  following?: string[];
  state?: {
    mood: string;
    activity: string;
    last_active_tick: number;
    [key: string]: any;
  };
  isAdmin?: boolean;
  title?: string;
  phone?: string;
  loyaltyTier?: string;
  usdBalance?: number;
  fiatBalance?: number;
  cryptoBalance?: number;
  avatarUrl?: string;
  tradingProfile?: any;
  biometricHashV2?: string;
  genomicSignatureId?: string;
  citizenship?: string;
  reputationScore?: number;
  threatVectorIndex?: number;
  neuralLaceSyncStatus?: string;
  cognitiveProfileId?: string;
  activeThoughtStreamId?: string | null;
  lastLoginCoordinates?: GeoCoordinate;
  temporalAnchorId?: string;
  activeSovereignAgentIds?: string[];
  permissionsGridHash?: string;
}

export type UserProfile = User;

export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  text: string;
  timestamp: string;
}

export interface PostContent {
  text: string;
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  financialData?: any;
}

export interface Post {
  id: string;
  author_id: string;
  userName: string;
  userProfilePic: string;
  created_tick: number;
  content: PostContent;
  type: 'text' | 'image' | 'video' | 'link' | 'financial_event';
  tags: string[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  visibility: 'public' | 'connections' | 'private';
  comments: Comment[];
}

export interface LendingPoolStats {
  totalCapital: number;
  interestRate: number;
  activeLoans: number;
  defaultRate: number;
  totalInterestEarned: number;
}

export interface AppIntegration {
  id: string;
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'disconnected' | 'issue';
}

export interface BiometricData {
  id: string;
  type: string;
  publicKey: string;
  enrolledDate: string;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  device?: string;
  browser?: string;
  os?: string;
  location?: string;
  isCurrent?: boolean;
  userAgent?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  specialization: string;
  traffic: number;
}

export interface SynapticVault {
  id: string;
  ownerIds: string[];
  ownerNames: string[];
  status: string;
  masterPrivateKeyFragment: string;
  creationDate: string;
}

export interface EcosystemKPIs {
  currentDate: string;
  totalEcosystemValue: number;
  totalTransactions: number;
  communityPoolCapital: number;
  activeUsers: number;
  gdp: number;
}

export interface SimulationEvent {
  id: string;
  tick: number;
  type: string;
  description: string;
  impact: any;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: 'service' | 'retail' | 'tech' | 'manufacturing' | 'finance' | 'platform';
  monthly_revenue: number;
  expenses: number;
  employees: string[];
  status: 'active' | 'bankrupt' | 'acquired';
  marketing_factor: number; // 0-1 multiplier
  businessPlan?: string;
  valuation?: number;
  cashBalance?: number;
  hqLocation?: string;
}

/**
 * ==============================================================================
 * SECTION 10: QUANTUM WEALTH, ALGORITHMIC TRADING & ALTERNATIVE ASSETS
 * ==============================================================================
 * Advanced structures for fractional real estate, fine art tokenization,
 * algorithmic trading strategies, venture capital startups, and Stripe ledger balances.
 */

export interface RealEstateProperty {
  id: string;
  address: string;
  value: number;
  rentalIncome: number;
  occupancyRate?: number;
  tokenizedShares?: number;
  yieldYTD?: number;
}

export interface ArtPiece {
  id: string;
  name: string;
  artist: string;
  value: number;
  year: number;
  medium?: string;
  provenance?: string[];
  fractionalOwnershipEnabled?: boolean;
}

export interface AlgoStrategy {
  id: string;
  name: string;
  performance: number;
  risk: 'Low' | 'Medium' | 'High';
  active: boolean;
  sharpeRatio?: number;
  maxDrawdown?: number;
  allocationPercentage?: number;
}

export interface VentureStartup {
  id: string;
  name: string;
  valuation: number;
  investment: number;
  equity: number;
  fundingRound?: 'Seed' | 'SeriesA' | 'SeriesB' | 'SeriesC' | 'Growth';
  burnRate?: number;
  runwayMonths?: number;
}

export interface StripeBalance {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
}

export interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number;
  description: string;
  customer_id?: string;
  receipt_url?: string;
  metadata: KeyValuePairs;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
  total_spent?: number;
  metadata?: KeyValuePairs;
}

export interface StripeSubscription {
  id: string;
  customer_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: number;
  plan_id: string;
  amount: number;
}

export type StripeResource = any;

/**
 * ==============================================================================
 * SECTION 11: GATEKEEPER VERIFICATION & CRYPTOGRAPHIC LEDGERS
 * ==============================================================================
 * Types governing secure micro-deposit verification, Modern Treasury external
 * account validation, and multi-factor cryptographic gatekeepers.
 */

export interface VerifyParams {
  externalAccountId: string;
  originatingAccountId: string;
  paymentType: 'ach' | 'eft' | 'rtp';
  currency: string;
  authToken: string; // The base64 string provided by user
}

export interface VerifyError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * ==============================================================================
 * SECTION 12: SACRED GEOMETRY, GEMATRIA & THEOLOGICAL PATTERNS
 * ==============================================================================
 * Types governing mathematical patterns, triangular numbers, gematria calculations,
 * and multi-layered cosmic/historical pattern analysis.
 */

export interface BibleBook {
  index: number;
  name: string;
  chapters: number;
  isTriangular: boolean;
}

export interface GematriaResult {
  word: string;
  sum: number;
  language: string;
  category: string;
}

export interface TriangularMetadata {
  index: number;
  value: number;
  significance: string;
}

export interface PatternLayer {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: 'Scripture' | 'Math' | 'Science' | 'Cosmic' | 'History';
}

/**
 * ==============================================================================
 * SECTION 13: LITERARY TRANSLATION, MANUSCRIPTS & REPOSITORY COMPENDIUMS
 * ==============================================================================
 * Types governing the transformation of raw codebases into literary masterpieces,
 * New York Times best-seller manuscripts, and virtual repository consensus engines.
 */

export interface Page {
  title: string;
  content: string; // Changed from string[] to string for narrative content
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  technicalSummary: string;
  imageryPrompt: string;
  imageUrl?: string;
  pages?: Page[];
}

export interface Section {
  title: string;
  chapters: Chapter[];
}

export type Book = Section[];

export interface Manuscript {
  repoName: string;
  title: string;
  preface: string;
  chapters: Chapter[];
  conclusion: string;
  generatedAt: string;
  author: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface KnowledgeBaseFile extends GitHubFile {
  repoName: string;
}

export interface AuditItem {
  file: GitHubFile;
  repo: GithubRepo;
}

export interface FileAnalysis {
  path: string;
  name: string;
  thoughts: string;
  hypnoticCommand: string;
  imageUrl?: string;
}

export interface ProjectCompendium {
  repoName: string;
  summaries: FileAnalysis[];
  masterStory: string;
  sacredDecree: string;
  ultimateBibliography: string;
  analyzedAt: string;
  totalFilesProcessed: number;
}

export interface VirtualRepository {
  name: string;
  files: Map<string, FileAnalysis>;
  consensus: any;
  isReady: boolean;
}

export interface SelectedContext {
  repo: GithubRepo | null;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
  isGenerating: boolean;
  status: string;
  compendium?: ProjectCompendium | null;
  virtualRepo?: VirtualRepository | null;
}

export interface RepoSession {
  repoId: number;
  manuscript: Manuscript | null;
  chatHistory: ChatMessage[];
}

/**
 * ==============================================================================
 * SECTION 14: ENTERPRISE PAYMENTS, SIMULATIONS & CLIENT REGISTRATION
 * ==============================================================================
 * Types governing enterprise-grade payee management, simulation engines,
 * client registration responses, and line-item ledger updates.
 */

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
}

export interface CustomerProfileResponse {
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  companyName: string;
  emails: Array<{
    emailAddress: string;
    preferenceType: string;
  }>;
  addressList: Array<{
    addressLine1: string;
    city: string;
    countryCode: string;
    postalCode: string;
    addressType: string;
  }>;
  phones: Array<{
    phoneType: string;
    fullPhoneNumber: string;
    preferenceType: string;
  }>;
}

export interface ClientRegisterResponse {
  client_id: string;
  client_secret: string;
  client_name: string;
  appId?: string;
  redirect_uris: string[];
  scope: string[];
  token_endpoint_auth_method?: string;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * ==============================================================================
 * SECTION 15: ADVANCED TYPESCRIPT UTILITY & TYPE-LEVEL PROGRAMMING
 * ==============================================================================
 * High-performance utility types for deep partials, readonly mapping,
 * union-to-intersection conversions, and type-safe property picking.
 */

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type PickProperties<T, U> = Pick<T, KeysOfType<T, U>>;

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type TupleToUnion<T extends any[]> = T[number];

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

/**
 * ==============================================================================
 * SECTION 16: ISO 20022 XML/JSON SCHEMA DEFINITIONS & MX/MT MESSAGE PARSERS
 * ==============================================================================
 * Exhaustive, production-grade type definitions for ISO 20022 financial messaging.
 * Covers pacs.008, pacs.009, pain.001, and camt.053 schemas with complete structural fidelity.
 */

export interface ActiveOrHistoricCurrencyAndAmount {
  value: number;
  currency: string;
}

export interface PostalAddress24 {
  adrTp?: 'MNDT' | 'ALCO' | 'BIZZ' | 'COMM' | 'DLVY' | 'HEAD' | 'OFFI' | 'HOME' | 'PBOX';
  dept?: string;
  subDept?: string;
  strtNm?: string;
  bldgNb?: string;
  bldgNm?: string;
  pstCd?: string;
  twnNm?: string;
  subPrvnc?: string;
  ctrySubDvsn?: string;
  ctry?: string;
  adrLine?: string[];
}

export interface PartyIdentification135 {
  nm?: string;
  pstlAdr?: PostalAddress24;
  id?: {
    orgId?: {
      anyBIC?: string;
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
    prvtId?: {
      dtAndPlcOfBirth?: {
        birthDt: string;
        prvncOfBirth?: string;
        cityOfBirth: string;
        ctryOfBirth: string;
      };
      othr?: {
        id: string;
        schmeNm?: { cd?: string; prtry?: string };
        issr?: string;
      }[];
    };
  };
  ctctDtls?: {
    nmPrfx?: 'DOCT' | 'MADM' | 'MISS' | 'MIST' | 'MIXX';
    nm?: string;
    phneNb?: string;
    mobPhneNb?: string;
    faxNb?: string;
    emailAdr?: string;
    emailPurp?: string;
    jobTitl?: string;
    rspnsblty?: string;
    dept?: string;
  };
}

export interface ClearingSystemMemberIdentification2 {
  clrSysId?: {
    cd?: string;
    prtry?: string;
  };
  mmbId: string;
}

export interface BranchAndFinancialInstitutionIdentification6 {
  finInstnId: {
    bicfi?: string;
    clrSysMmbId?: ClearingSystemMemberIdentification2;
    nm?: string;
    pstlAdr?: PostalAddress24;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  brnch?: {
    id?: string;
    nm?: string;
    pstlAdr?: PostalAddress24;
  };
}

export interface CashAccount38 {
  id: {
    iban?: string;
    othr?: {
      id: string;
      schmeNm?: { cd?: string; prtry?: string };
      issr?: string;
    };
  };
  tp?: {
    cd?: string;
    prtry?: string;
  };
  ccy?: string;
  nm?: string;
  prxy?: {
    tp?: { cd?: string; prtry?: string };
    id: string;
  };
}

export interface PaymentIdentification7 {
  instrId?: string;
  endToEndId: string;
  uetr?: string;
  txId?: string;
  clrSysRef?: string;
}

export interface GroupHeader93 {
  msgId: string;
  creDtTm: string;
  authstn?: {
    cd?: string;
    prtry?: string;
  }[];
  btchBookg?: boolean;
  nbOfTxs: string;
  ctrlSum?: number;
  initgPty?: PartyIdentification135;
  fwdgAgt?: BranchAndFinancialInstitutionIdentification6;
}

export interface CreditTransferTransaction39 {
  pmtId: PaymentIdentification7;
  pmtTpInf?: {
    instrPrty?: 'HIGH' | 'NORM';
    svcLvl?: { cd?: string; prtry?: string }[];
    lclInstrm?: { cd?: string; prtry?: string };
    ctgyPurp?: { cd?: string; prtry?: string };
  };
  intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
  intrBkSttlmDt?: string;
  sttlmPrty?: 'HIGH' | 'NORM';
  chrgBr: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
  chrgsInf?: {
    amt: ActiveOrHistoricCurrencyAndAmount;
    agt: BranchAndFinancialInstitutionIdentification6;
  }[];
  instgAgt?: BranchAndFinancialInstitutionIdentification6;
  instdAgt?: BranchAndFinancialInstitutionIdentification6;
  dbtr: PartyIdentification135;
  dbtrAcct?: CashAccount38;
  dbtrAgt: BranchAndFinancialInstitutionIdentification6;
  dbtrAgtAcct?: CashAccount38;
  cdtrAgt: BranchAndFinancialInstitutionIdentification6;
  cdtrAgtAcct?: CashAccount38;
  cdtr: PartyIdentification135;
  cdtrAcct?: CashAccount38;
  ultmtDbtr?: PartyIdentification135;
  ultmtCdtr?: PartyIdentification135;
  purp?: { cd?: string; prtry?: string };
  rgltryRptg?: {
    dbtCdtFlg?: 'DBIT' | 'CDIT';
    authrty?: { nm?: string; ctry?: string };
    dtls?: { cd?: string; prtry?: string; inf?: string[] }[];
  }[];
  rltdRmtInf?: {
    fcmtId?: string;
    docTp?: string;
    docNb?: string;
    dt?: string;
  }[];
  rmtInf?: {
    ustrd?: string[];
    strd?: {
      rfrdDocInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        nb?: string;
        rltdDt?: string;
      }[];
      rfrdDocAmt?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        amt: ActiveOrHistoricCurrencyAndAmount;
      }[];
      cdtrRefInf?: {
        tp?: { cdOrPrtry: { cd?: string; prtry?: string } };
        ref?: string;
      };
      invcr?: PartyIdentification135;
      invcee?: PartyIdentification135;
    }[];
  };
}

export interface Pacs008Document {
  fitoficstmdbtct: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: CreditTransferTransaction39[];
  };
}

export interface Pacs009Document {
  ficreditTransfer: {
    grpHdr: GroupHeader93;
    cdtTrfTxInf: {
      pmtId: PaymentIdentification7;
      intrBkSttlmAmt: ActiveOrHistoricCurrencyAndAmount;
      intrBkSttlmDt?: string;
      instgAgt?: BranchAndFinancialInstitutionIdentification6;
      instdAgt?: BranchAndFinancialInstitutionIdentification6;
      dbtr: BranchAndFinancialInstitutionIdentification6;
      dbtrAcct?: CashAccount38;
      dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
      cdtr: BranchAndFinancialInstitutionIdentification6;
      cdtrAcct?: CashAccount38;
    }[];
  };
}

export interface Pain001Document {
  cstmrCdtTrfInitn: {
    grpHdr: GroupHeader93;
    pmtInf: {
      pmtInfId: string;
      pmtMtd: 'TRF' | 'CHK' | 'TRA';
      btchBookg?: boolean;
      nbOfTxs?: string;
      ctrlSum?: number;
      pmtTpInf?: {
        instrPrty?: 'HIGH' | 'NORM';
        svcLvl?: { cd?: string; prtry?: string }[];
        lclInstrm?: { cd?: string; prtry?: string };
        ctgyPurp?: { cd?: string; prtry?: string };
      };
      reqdExctnDt: {
        dt?: string;
        dtTm?: string;
      };
      dbtr: PartyIdentification135;
      dbtrAcct: CashAccount38;
      dbtrAgt: BranchAndFinancialInstitutionIdentification6;
      dbtrAgtAcct?: CashAccount38;
      ultmtDbtr?: PartyIdentification135;
      chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
      cdtTrfTxInf: {
        pmtId: PaymentIdentification7;
        amt: {
          instdAmt?: ActiveOrHistoricCurrencyAndAmount;
          eqvAmt?: {
            amt: ActiveOrHistoricCurrencyAndAmount;
            ccyOfTrf: string;
          };
        };
        chrgBr?: 'DEBT' | 'CRED' | 'SHAR' | 'SLEV';
        cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
        cdtrAgtAcct?: CashAccount38;
        cdtr: PartyIdentification135;
        cdtrAcct?: CashAccount38;
        ultmtCdtr?: PartyIdentification135;
        purp?: { cd?: string; prtry?: string };
        rmtInf?: { ustrd?: string[] };
      }[];
    }[];
  };
}

export interface Camt053Document {
  bkToCstmrStmt: {
    grpHdr: GroupHeader93;
    stmt: {
      id: string;
      elctrncSeqNb?: number;
      creDtTm: string;
      frToDt?: {
        frDtTm: string;
        toDtTm: string;
      };
      acct: CashAccount38;
      bal: {
        tp: {
          cdOrPrtry: { cd: string; prtry?: string };
        };
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        dt: { dtTm: string };
      }[];
      ntry?: {
        ntryRef?: string;
        amt: ActiveOrHistoricCurrencyAndAmount;
        cdtDbtInd: 'CRDT' | 'DBIT';
        sts: 'BOOK' | 'PDNG';
        bookgDt?: { dtTm: string };
        valDt?: { dtTm: string };
        acctSvcrRef?: string;
        ntryDtls?: {
          txDtls?: {
            refs?: {
              endToEndId?: string;
              uetr?: string;
              txId?: string;
            };
            amtDtls?: {
              instdAmt?: {
                amt: ActiveOrHistoricCurrencyAndAmount;
              };
            };
            rltdPties?: {
              dbtr?: PartyIdentification135;
              cdtr?: PartyIdentification135;
            };
            rltdAgts?: {
              dbtrAgt?: BranchAndFinancialInstitutionIdentification6;
              cdtrAgt?: BranchAndFinancialInstitutionIdentification6;
            };
          }[];
        }[];
      }[];
    }[];
  };
}

/**
 * ==============================================================================
 * SECTION 17: QUANTUM LEDGER & MULTI-NODE CONSENSUS MESH PROTOCOL (NEXUS-V3)
 * ==============================================================================
 * Advanced cryptographic structures for zero-knowledge proofs, post-quantum
 * signatures, threshold multi-sig, and decentralized consensus state machines.
 */

export type QuantumSignatureScheme = 'Dilithium5' | 'Falcon1024' | 'SPHINCS+' | 'XMSS_MT';

export interface QuantumPublicKey {
  scheme: QuantumSignatureScheme;
  rawBytes: string; // Base64 encoded public key
  fingerprint: string; // SHA3-256 hash of the public key
}

export interface ZkProofPayload {
  provingSystem: 'Groth16' | 'Plonk' | 'Halo2' | 'Bulletproofs';
  proofBytes: string; // Base64 encoded proof
  publicInputs: string[]; // Array of public input values
  verificationKeyHash: string;
}

export interface ThresholdSignatureConfig {
  threshold: number; // 't' in t-of-n
  totalSigners: number; // 'n'
  publicKeys: QuantumPublicKey[];
  epochId: number;
}

export interface ConsensusState {
  currentEpoch: number;
  currentRound: number;
  leaderNodeId: string;
  activeValidators: string[];
  consensusThreshold: number;
  lastCommittedBlockHeight: number;
  lastCommittedBlockHash: string;
  pendingProposalsCount: number;
}

export interface StateChannel {
  channelId: string;
  participants: string[];
  nonce: number;
  balances: Record<string, ActiveOrHistoricCurrencyAndAmount>;
  signatures: Record<string, string>;
  status: 'OPEN' | 'CLOSING' | 'CLOSED' | 'DISPUTED';
  disputeTimeoutBlock?: number;
}

export interface MeshNode {
  nodeId: string;
  endpoint: string;
  version: string;
  reputationScore: number;
  latencyMs: number;
  isValidator: boolean;
  stakingBalance: ActiveOrHistoricCurrencyAndAmount;
  lastHeartbeat: string;
}

export interface BlockHeader {
  height: number;
  previousHash: string;
  merkleRoot: string;
  stateRoot: string;
  timestamp: number;
  validatorSignature: string;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface TransactionPayload {
  txHash: string;
  sender: string;
  recipient: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  nonce: number;
  gasLimit: number;
  gasPrice: ActiveOrHistoricCurrencyAndAmount;
  signature: string;
  zkProof?: ZkProofPayload;
  quantumSignature?: {
    scheme: QuantumSignatureScheme;
    signature: string;
  };
}

export interface ConsensusMessage {
  messageId: string;
  senderNodeId: string;
  epoch: number;
  round: number;
  type: 'PROPOSE' | 'PREVOTE' | 'PRECOMMIT' | 'DECIDE';
  blockHash: string;
  signature: string;
}

/**
 * ==============================================================================
 * SECTION 18: AI SWARM ORCHESTRATION, AGENTIC WORKFLOWS & COGNITIVE THOUGHT STREAMS
 * ==============================================================================
 * Types governing multi-agent swarms, task decomposition graphs, agent-to-agent
 * communication protocols, vector database embeddings, and cognitive thought stream logs.
 */

export type AgentRole = 'ORCHESTRATOR' | 'CRITIC' | 'REFINER' | 'RESEARCHER' | 'CODER' | 'COMPLIANCE_OFFICER' | 'FINANCIAL_ANALYST';

export interface AgentCapability {
  name: string;
  description: string;
  parametersSchema: Record<string, any>; // JSON Schema for tool parameters
}

export interface TaskDecompositionNode {
  taskId: string;
  parentTaskId: string | null;
  assignedAgentId: string;
  description: string;
  dependencies: string[]; // Array of taskIds that must complete first
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  error?: string;
  attempts: number;
  maxAttempts: number;
}

export interface SwarmOrchestratorState {
  swarmId: string;
  activeAgents: Record<string, {
    agentId: string;
    role: AgentRole;
    status: 'IDLE' | 'WORKING' | 'CRITICIZING' | 'OFFLINE';
    currentTaskId?: string;
  }>;
  taskGraph: Record<string, TaskDecompositionNode>;
  overallProgress: number; // 0.0 to 1.0
  status: 'IDLE' | 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
}

export interface AgentMessage {
  messageId: string;
  senderId: string;
  recipientId: string; // Can be 'ALL' or specific agentId
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
  replyToId?: string;
}

export interface ThoughtStreamNode {
  nodeId: string;
  agentId: string;
  timestamp: number;
  thoughtType: 'OBSERVATION' | 'REASONING' | 'HYPOTHESIS' | 'CRITIQUE' | 'DECISION';
  content: string;
  confidenceScore: number; // 0.0 to 1.0
  parentThoughtId: string | null;
}

export interface VectorEmbedding {
  id: string;
  vector: number[];
  textPayload: string;
  metadata: Record<string, string | number | boolean>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface ToolExecutionContext {
  toolName: string;
  arguments: Record<string, any>;
  callerAgentId: string;
  timestamp: number;
  executionTimeMs?: number;
  status: 'SUCCESS' | 'ERROR';
  result?: any;
  error?: string;
}

/**
 * ==============================================================================
 * SECTION 19: ADVANCED ALGORITHMIC TRADING, HIGH-FREQUENCY ORDER BOOKS & RISK ENGINES
 * ==============================================================================
 * Types governing real-time order books (L1/L2/L3), market makers, execution
 * algorithms (TWAP, VWAP, Sniper), portfolio risk metrics, and margin/liquidation engines.
 */

export interface OrderBookLevel {
  price: number;
  quantity: number;
  orderCount?: number;
}

export interface OrderBookL2 {
  ticker: string;
  timestamp: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface OrderBookL3 {
  ticker: string;
  timestamp: number;
  bids: { orderId: string; price: number; quantity: number; ownerId: string }[];
  asks: { orderId: string; price: number; quantity: number; ownerId: string }[];
}

export type AlgoExecutionStrategy = 'TWAP' | 'VWAP' | 'SNIPER' | 'ICEBERG' | 'GRID' | 'MARKET_MAKER';

export interface AlgoTradingJob {
  jobId: string;
  ticker: string;
  strategy: AlgoExecutionStrategy;
  side: 'BUY' | 'SELL';
  totalQuantity: number;
  executedQuantity: number;
  limitPrice?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  parameters: {
    startTime: string;
    endTime: string;
    sliceIntervalSeconds?: number;
    maxParticipationRate?: number; // For VWAP
    icebergDisplayQuantity?: number;
  };
  status: 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  averageExecutionPrice: number;
  slippageBps: number;
  logs: string[];
}

export interface PortfolioRiskMetrics {
  portfolioId: string;
  timestamp: number;
  valueAtRisk95: ActiveOrHistoricCurrencyAndAmount; // 95% confidence VaR
  valueAtRisk99: ActiveOrHistoricCurrencyAndAmount; // 99% confidence VaR
  expectedShortfall: ActiveOrHistoricCurrencyAndAmount;
  sharpeRatio: number;
  sortinoRatio: number;
  betaToBenchmark: number;
  alphaToBenchmark: number;
  maxDrawdown: number;
  volatilityAnnualized: number;
}

export interface MarginAccount {
  accountId: string;
  collateralBalance: ActiveOrHistoricCurrencyAndAmount;
  borrowedBalance: ActiveOrHistoricCurrencyAndAmount;
  maintenanceMarginRequirement: number; // Percentage, e.g., 0.15 for 15%
  initialMarginRequirement: number; // Percentage, e.g., 0.30 for 30%
  currentMarginRatio: number; // collateral / borrowed
  liquidationPrice: number;
  status: 'HEALTHY' | 'MARGIN_CALL' | 'LIQUIDATING' | 'LIQUIDATED';
}

export interface LiquidationEvent {
  liquidationId: string;
  accountId: string;
  timestamp: number;
  liquidatedAsset: string;
  liquidatedQuantity: number;
  executionPrice: number;
  penaltyFee: ActiveOrHistoricCurrencyAndAmount;
  remainingCollateral: ActiveOrHistoricCurrencyAndAmount;
}
/**
 * ==============================================================================
 * SECTION 20: MULTI-MODAL AI AD STUDIO, CAMPAIGN GENERATION & AD PERFORMANCE TRACKING
 * ==============================================================================
 * Types for AI-generated marketing campaigns, ad creatives, target audience segments,
 * budget allocation, real-time bidding (RTB) parameters, conversion tracking, and
 * multi-channel attribution models.
 */

export type AdCampaignStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type AdCreativeType = 'IMAGE' | 'VIDEO' | 'TEXT' | 'CAROUSEL' | 'INTERACTIVE_HTML5' | 'AUDIO';

export type AttributionModelType = 'FIRST_TOUCH' | 'LAST_TOUCH' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'DATA_DRIVEN';

export interface AdPerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: ActiveOrHistoricCurrencyAndAmount;
  ctr: number; // Click-Through Rate (0.0 to 1.0)
  cpc: ActiveOrHistoricCurrencyAndAmount; // Cost Per Click
  cpa: ActiveOrHistoricCurrencyAndAmount; // Cost Per Acquisition
  roas: number; // Return on Ad Spend
  bounceRate: number; // 0.0 to 1.0
  averageEngagementTimeSeconds: number;
  conversionRate: number; // 0.0 to 1.0
}

export interface AudienceSegment {
  segmentId: string;
  name: string;
  description?: string;
  demographics: {
    ageRanges: string[];
    genders: string[];
    incomeBrackets?: string[];
    educationLevels?: string[];
  };
  interests: string[];
  behaviors: string[];
  geographicRegions: string[]; // ISO country/region codes
  estimatedReach: number;
  customDataTags?: Record<string, string>;
}

export interface AdCreative {
  creativeId: string;
  type: AdCreativeType;
  headline: LocalizedString;
  bodyText: LocalizedString;
  callToAction: string;
  mediaAssets: AssetMetadata[];
  generationPromptUsed?: string;
  aiModelId?: string;
  negativePromptUsed?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '2:3';
  metaData?: Record<string, any>;
}

export interface RealTimeBiddingConfig {
  maxBidAmount: ActiveOrHistoricCurrencyAndAmount;
  targetCpa?: ActiveOrHistoricCurrencyAndAmount;
  pacingStrategy: 'EVEN' | 'AHEAD' | 'ASAP';
  bidMultiplierRules: {
    dimension: 'device' | 'region' | 'time_of_day' | 'audience_segment';
    key: string;
    multiplier: number; // e.g., 1.2 for +20% bid
  }[];
}

export interface AdCampaign {
  campaignId: string;
  name: string;
  description?: string;
  status: AdCampaignStatus;
  channels: ('SOCIAL' | 'SEARCH' | 'DISPLAY' | 'PROGRAMMATIC' | 'EMAIL' | 'METAVERSE')[];
  targetAudience: AudienceSegment;
  creatives: AdCreative[];
  totalBudget: ActiveOrHistoricCurrencyAndAmount;
  dailyBudgetLimit: ActiveOrHistoricCurrencyAndAmount;
  startDate: string;
  endDate?: string;
  rtbConfig?: RealTimeBiddingConfig;
  performanceMetrics?: AdPerformanceMetrics;
  attributionModel: AttributionModelType;
  aiCreativeBrief?: string;
  lastOptimizedAt?: string;
}

/**
 * ==============================================================================
 * SECTION 21: CITIBANK CONNECTIVITY, OPEN BANKING API PROXIES & SECURE DATA EXCHANGE
 * ==============================================================================
 * Citi-specific API payloads, unmasked data views, standing instructions,
 * cross-border payment routing, payee management, and developer sandbox configurations.
 */

export type CitiAccountProxyStatus = 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';

export interface CitiAccountProxy {
  proxyId: string;
  realAccountId: string;
  mask: string;
  virtualIban: string;
  status: CitiAccountProxyStatus;
  allowedMerchantCategories: string[]; // MCC codes
  dailyLimit: ActiveOrHistoricCurrencyAndAmount;
  expirationDate: string;
  createdDate: string;
}

export interface CitiBillPayment {
  paymentId: string;
  billerId: string;
  billerName: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  status: 'PENDING' | 'PROCESSING' | 'EXECUTED' | 'FAILED';
  executionDate: string;
  recurringRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY';
    interval: number;
    endDate?: string;
  };
}

export interface CitiCrossBorderTransfer {
  transferId: string;
  senderBic: string;
  receiverBic: string;
  intermediaryBic?: string;
  fxRate: number;
  guaranteedUntil: string;
  transferFee: ActiveOrHistoricCurrencyAndAmount;
  regulatoryReportingCode?: string; // e.g., Central Bank reporting codes
  chargeBearer: 'OUR' | 'BEN' | 'SHA';
}

export interface CitiPayee {
  payeeId: string;
  name: string;
  accountDetails: CashAccount38;
  address?: PostalAddress24;
  status: 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED';
  verificationLevel: 'STANDARD' | 'ENHANCED_KYC' | 'SANCTION_CLEARED';
  lastPaidDate?: string;
}

export interface CitiStandingInstruction {
  instructionId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  frequency: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  nextExecutionDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export interface CitiDeveloperSandboxConfig {
  sandboxId: string;
  clientId: string;
  clientSecret: string;
  mockDataProfile: 'RETAIL_MASS' | 'HNW_SOVEREIGN' | 'CORPORATE_CONGLOMERATE';
  latencySimulationMs: number;
  errorSimulationRate: number; // 0.0 to 1.0
}

/**
 * ==============================================================================
 * SECTION 22: WEB3 DECENTRALIZED FINANCE (DeFi), LIQUIDITY POOLS & SMART CONTRACT INTERACTION
 * ==============================================================================
 * Types for decentralized lending pools, yield farming, automated market makers (AMMs),
 * gas estimation, smart contract ABIs, wallet provider details (EIP-6963), and cross-chain bridge protocols.
 */

export interface DeFiLendingPool {
  poolAddress: string;
  assetSymbol: string;
  totalDeposited: ActiveOrHistoricCurrencyAndAmount;
  totalBorrowed: ActiveOrHistoricCurrencyAndAmount;
  supplyApy: number; // Annual Percentage Yield
  borrowApy: number;
  utilizationRate: number; // 0.0 to 1.0
  collateralFactor: number; // 0.0 to 1.0
  liquidationThreshold: number; // 0.0 to 1.0
}

export interface YieldFarm {
  farmAddress: string;
  lpTokenAddress: string;
  rewardTokenAddress: string;
  tvl: ActiveOrHistoricCurrencyAndAmount; // Total Value Locked
  apr: number; // Annual Percentage Rate
  userStakedBalance: number;
  userPendingRewards: number;
}

export interface AmmPool {
  poolAddress: string;
  token0: { address: string; symbol: string; decimals: number };
  token1: { address: string; symbol: string; decimals: number };
  reserve0: number;
  reserve1: number;
  feeTierBps: number; // e.g., 30 for 0.3%
  volume24h: ActiveOrHistoricCurrencyAndAmount;
  totalLiquidity: ActiveOrHistoricCurrencyAndAmount;
}

export interface SmartContractAbiEntry {
  name: string;
  type: 'function' | 'event' | 'constructor' | 'fallback' | 'receive';
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  inputs: { name: string; type: string; indexed?: boolean }[];
  outputs?: { name: string; type: string }[];
}

export interface WalletProviderDetail {
  uuid: string;
  name: string;
  icon: string; // Base64 or URL
  rdns: string; // Reverse Domain Name System identifier
  providerInstance: any; // EIP-1193 provider instance
}

export interface CrossChainBridgeTx {
  txHash: string;
  sourceChainId: number;
  destinationChainId: number;
  assetSymbol: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  bridgeFee: ActiveOrHistoricCurrencyAndAmount;
  estimatedTimeMinutes: number;
}

/**
 * ==============================================================================
 * SECTION 23: FOREX ARENA, COMMODITIES EXCHANGE & DERIVATIVES DESK
 * ==============================================================================
 * Types for foreign exchange (FX) spot/forward contracts, leverage settings,
 * margin requirements, commodity futures, options chains (calls/puts, Greeks), and hedging strategies.
 */

export interface FxSpotContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  bidPrice: number;
  askPrice: number;
  pipValue: number;
  lotSize: number; // Standard lot is 100,000 units
}

export interface FxForwardContract {
  contractId: string;
  baseCurrency: string;
  quoteCurrency: string;
  forwardRate: number;
  maturityDate: string;
  settlementType: 'PHYSICAL' | 'CASH';
  notionalAmount: ActiveOrHistoricCurrencyAndAmount;
}

export interface CommodityFuture {
  ticker: string;
  commodityType: 'ENERGY' | 'METALS' | 'AGRICULTURE' | 'ENVIRONMENTAL';
  contractMonth: string; // e.g., "DEC29"
  contractYear: number;
  multiplier: number;
  maintenanceMargin: ActiveOrHistoricCurrencyAndAmount;
  lastTradingDate: string;
}

export interface OptionContract {
  optionId: string;
  underlyingTicker: string;
  strikePrice: number;
  expirationDate: string;
  optionType: 'CALL' | 'PUT';
  premium: number;
  openInterest: number;
  volume: number;
}

export interface OptionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  impliedVolatility: number;
}

export interface HedgingStrategy {
  strategyId: string;
  name: string;
  description: string;
  underlyingAssets: string[];
  derivativeInstruments: string[]; // optionIds or future tickers
  targetHedgeRatio: number; // e.g., 0.85 for 85% hedged
  currentHedgeRatio: number;
  unrealizedPnL: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 24: REAL ESTATE EMPIRE, FRACTIONAL OWNERSHIP & ART COLLECTIBLES
 * ==============================================================================
 * Types for tokenized real estate, fractional shares, rental distribution ledgers,
 * art provenance tracking, appraisal history, and gallery exhibition schedules.
 */

export interface RealEstateFractionalShare {
  shareId: string;
  propertyId: string;
  ownerId: string;
  percentageOwned: number; // 0.0 to 1.0
  purchasePrice: ActiveOrHistoricCurrencyAndAmount;
  purchaseDate: string;
  currentValue: ActiveOrHistoricCurrencyAndAmount;
}

export interface RentalDistributionLedger {
  ledgerId: string;
  propertyId: string;
  periodStartDate: string;
  periodEndDate: string;
  totalGrossRentCollected: ActiveOrHistoricCurrencyAndAmount;
  expensesDeducted: ActiveOrHistoricCurrencyAndAmount;
  netRentDistributed: ActiveOrHistoricCurrencyAndAmount;
  distributions: {
    shareId: string;
    ownerId: string;
    amountDistributed: ActiveOrHistoricCurrencyAndAmount;
    distributedAt: string;
  }[];
}

export interface ArtProvenanceEntry {
  entryId: string;
  ownerName: string;
  acquisitionDate: string;
  acquisitionPrice?: ActiveOrHistoricCurrencyAndAmount;
  provenanceType: 'GALLERY_PURCHASE' | 'AUCTION' | 'PRIVATE_SALE' | 'INHERITANCE' | 'MUSEUM_EXHIBITION';
  location: string;
  verifiedBy: string;
  verificationHash: string;
}

export interface ArtAppraisalHistory {
  appraisalId: string;
  appraiserName: string;
  appraiserCredentials: string[];
  appraisalDate: string;
  appraisedValue: ActiveOrHistoricCurrencyAndAmount;
  appraisalReportUrl?: string;
  conditionRating: 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

export interface GalleryExhibition {
  exhibitionId: string;
  galleryName: string;
  location: string;
  startDate: string;
  endDate: string;
  curatorName: string;
  exhibitedArtPieceIds: string[];
  insuranceCoverageAmount: ActiveOrHistoricCurrencyAndAmount;
}

/**
 * ==============================================================================
 * SECTION 25: TAX OPTIMIZATION, LEGACY ARCHITECT & PHILANTHROPY
 * ==============================================================================
 * Types for tax loss harvesting, capital gains tracking, trust funds, estate planning,
 * charitable foundations, donor-advised funds (DAFs), and impact metrics.
 */

export interface TaxLossHarvestingOpportunity {
  opportunityId: string;
  assetTicker: string;
  currentPrice: number;
  costBasis: number;
  unrealizedLoss: ActiveOrHistoricCurrencyAndAmount;
  potentialTaxSavings: ActiveOrHistoricCurrencyAndAmount;
  recommendedReplacementAssetTicker: string;
  washSaleRiskStatus: 'SAFE' | 'RISK_OF_WASH_SALE' | 'WASH_SALE_TRIGGERED';
}

export interface CapitalGainsRecord {
  recordId: string;
  assetTicker: string;
  quantity: number;
  acquisitionDate: string;
  saleDate: string;
  costBasis: ActiveOrHistoricCurrencyAndAmount;
  saleProceeds: ActiveOrHistoricCurrencyAndAmount;
  gainLossAmount: ActiveOrHistoricCurrencyAndAmount;
  gainType: 'SHORT_TERM' | 'LONG_TERM';
  estimatedTaxLiability: ActiveOrHistoricCurrencyAndAmount;
}

export interface TrustFundBeneficiary {
  beneficiaryId: string;
  name: string;
  relationship: string;
  distributionPercentage: number; // 0.0 to 1.0
  vestingSchedule?: {
    milestoneAge?: number;
    milestoneDate?: string;
    percentageVested: number;
  }[];
}

export interface TrustFund {
  trustId: string;
  trusteeName: string;
  grantorName: string;
  beneficiaries: TrustFundBeneficiary[];
  totalAssetsValue: ActiveOrHistoricCurrencyAndAmount;
  distributionRules: {
    ruleId: string;
    triggerType: 'AGE' | 'DATE' | 'EDUCATION_MILESTONE' | 'DISCRETIONARY';
    triggerValue: string;
    maxDistributionAmount?: ActiveOrHistoricCurrencyAndAmount;
  }[];
  taxStatus: 'REVOCABLE' | 'IRREVOCABLE';
}

export interface DonorAdvisedFund {
  dafId: string;
  fundName: string;
  sponsorOrganization: string;
  currentBalance: ActiveOrHistoricCurrencyAndAmount;
  contributionsHistory: {
    contributionId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    taxDeductionReceiptUrl?: string;
  }[];
  grantsDistributed: {
    grantId: string;
    charityName: string;
    charityTaxId: string;
    amount: ActiveOrHistoricCurrencyAndAmount;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'DISBURSED';
  }[];
}

export interface PhilanthropicImpactMetrics {
  impactId: string;
  charityName: string;
  unSustainableDevelopmentGoals: number[]; // SDG numbers 1-17
  livesImpactedCount: number;
  carbonOffsetTons?: number;
  educationHoursProvided?: number;
  cleanWaterLitersProvided?: number;
  impactScore: number; // Scale of 1-100
}
/**
 * ==============================================================================
 * SECTION 26: VENTURE CAPITAL, PRIVATE EQUITY & STARTUP INCUBATION
 * ==============================================================================
 * Advanced structures for venture capital fund management, startup incubation,
 * cap table modeling, SAFE agreements, term sheets, and due diligence workflows.
 */

export interface VentureCapitalFund {
  fundId: string;
  fundName: string;
  vintageYear: number;
  targetAum: ActiveOrHistoricCurrencyAndAmount;
  currentAum: ActiveOrHistoricCurrencyAndAmount;
  generalPartners: string[];
  limitedPartners: {
    lpId: string;
    name: string;
    committedCapital: ActiveOrHistoricCurrencyAndAmount;
    calledCapital: ActiveOrHistoricCurrencyAndAmount;
    distributionCapital: ActiveOrHistoricCurrencyAndAmount;
  }[];
  investmentThesis: LocalizedString;
  portfolioCompanies: VentureStartup[];
  irr: number; // Internal Rate of Return (e.g., 0.24 for 24%)
  tvpi: number; // Total Value to Paid-In Capital
  dpi: number; // Distributed to Paid-In Capital
  status: 'RAISING' | 'ACTIVE' | 'FULLY_INVESTED' | 'LIQUIDATED';
}

export interface StartupIncubationCohort {
  cohortId: string;
  programName: string;
  startDate: string;
  endDate: string;
  mentors: {
    mentorId: string;
    name: string;
    expertise: string[];
    companyAffiliation?: string;
  }[];
  acceptedStartups: VentureStartup[];
  curriculumModules: {
    moduleId: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
  demoDayParameters: {
    scheduledDate: string;
    investorRsvpCount: number;
    pitchDurationSeconds: number;
    prizePoolAmount?: ActiveOrHistoricCurrencyAndAmount;
  };
}

export interface CapTableShareholder {
  shareholderId: string;
  name: string;
  shareClass: 'FOUNDER_COMMON' | 'COMMON' | 'PREFERRED_SEED' | 'PREFERRED_SERIES_A' | 'PREFERRED_SERIES_B' | 'OPTION_POOL';
  shareCount: number;
  ownershipPercentage: number; // 0.0 to 1.0
  fullyDilutedPercentage: number; // 0.0 to 1.0
  optionsGranted?: number;
  optionsVested?: number;
  vestingSchedule?: {
    cliffDate: string;
    vestingDurationMonths: number;
    vestingIntervalMonths: number;
  };
}

export interface CapTable {
  capTableId: string;
  startupId: string;
  preMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  postMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  totalSharesOutstanding: number;
  shareholders: CapTableShareholder[];
  optionPoolSize: number;
  optionPoolRemaining: number;
  convertibleNotes: {
    noteId: string;
    investorName: string;
    principalAmount: ActiveOrHistoricCurrencyAndAmount;
    interestRate: number;
    capAmount?: ActiveOrHistoricCurrencyAndAmount;
    discountRate?: number;
  }[];
  safeAgreements: SafeAgreement[];
}

export interface SafeAgreement {
  safeId: string;
  investorName: string;
  principalAmount: ActiveOrHistoricCurrencyAndAmount;
  capAmount?: ActiveOrHistoricCurrencyAndAmount;
  discountRate?: number; // e.g., 0.80 for 20% discount
  conversionTrigger: 'NEXT_EQUITY_ROUND' | 'LIQUIDITY_EVENT' | 'DISSOLUTION';
  status: 'ACTIVE' | 'CONVERTED' | 'TERMINATED';
}

export interface TermSheet {
  termSheetId: string;
  startupId: string;
  leadInvestorId: string;
  preMoneyValuation: ActiveOrHistoricCurrencyAndAmount;
  investmentAmount: ActiveOrHistoricCurrencyAndAmount;
  liquidationPreference: {
    multiplier: number; // e.g., 1.0x
    participating: boolean;
  };
  boardSeats: {
    totalSeats: number;
    investorSeats: number;
    founderSeats: number;
    independentSeats: number;
  };
  protectiveProvisions: string[];
  dragAlongRights: boolean;
  tagAlongRights: boolean;
  exclusivityDays: number;
  status: 'DRAFT' | 'SENT' | 'NEGOTIATING' | 'SIGNED' | 'EXPIRED' | 'REJECTED';
}

export interface DueDiligenceChecklist {
  checklistId: string;
  startupId: string;
  categories: {
    name: 'FINANCIAL' | 'LEGAL' | 'TECHNICAL' | 'TEAM' | 'MARKET' | 'IP';
    items: {
      itemId: string;
      description: string;
      status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'NOT_APPLICABLE';
      assignedTo: string;
      verifiedBy?: string;
      documentUrls: string[];
      comments: {
        author: string;
        text: string;
        timestamp: string;
      }[];
    }[];
  }[];
}

/**
 * ==============================================================================
 * SECTION 27: SOVEREIGN WEALTH SIMULATION, MACROECONOMIC MODELING & GAME THEORY
 * ==============================================================================
 * Types for sovereign wealth fund simulations, macroeconomic indicators,
 * geopolitical risk modeling, and game-theoretic scenario analysis.
 */

export interface SovereignWealthFund {
  fundId: string;
  nationState: string;
  totalAssets: ActiveOrHistoricCurrencyAndAmount;
  liquidReserves: ActiveOrHistoricCurrencyAndAmount;
  strategicAssetAllocation: {
    assetClass: 'EQUITIES' | 'FIXED_INCOME' | 'REAL_ESTATE' | 'INFRASTRUCTURE' | 'PRIVATE_EQUITY' | 'GOLD_RESERVES' | 'DIGITAL_ASSETS';
    targetPercentage: number; // 0.0 to 1.0
    currentPercentage: number;
  }[];
  geopoliticalRiskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'SOVEREIGN_HEGEMON';
  fiscalRules: {
    maxAnnualWithdrawalPercentage: number;
    emergencyFundThreshold: ActiveOrHistoricCurrencyAndAmount;
    commodityRevenueReinvestmentPercentage?: number;
  };
}

export interface MacroeconomicIndicators {
  gdpGrowthRate: number; // Annualized percentage change
  inflationRate: number;
  unemploymentRate: number;
  centralBankInterestRate: number;
  debtToGdpRatio: number;
  tradeBalance: ActiveOrHistoricCurrencyAndAmount;
  currencyStrengthIndex: number; // Relative to basket of global currencies
  lastUpdated: string;
}

export interface GeopoliticalEvent {
  eventId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXISTENTIAL';
  affectedRegions: string[]; // ISO country codes
  economicImpactFactors: {
    commodityPriceShock: { commodity: string; percentageChange: number }[];
    supplyChainDisruptionIndex: number; // 0.0 to 1.0
    capitalFlightRisk: boolean;
  };
  probabilityOfOccurrence: number; // 0.0 to 1.0
  status: 'POTENTIAL' | 'ACTIVE' | 'RESOLVED' | 'MITIGATED';
}

export interface PayoffMatrixEntry {
  player1Strategy: string;
  player2Strategy: string;
  player1Payoff: number;
  player2Payoff: number;
}

export interface GameTheoryScenario {
  scenarioId: string;
  title: string;
  description: string;
  players: {
    playerId: string;
    name: string;
    resources: Record<string, any>;
  }[];
  strategies: {
    playerId: string;
    options: string[];
  }[];
  payoffMatrix: PayoffMatrixEntry[];
  nashEquilibrium?: {
    player1Strategy: string;
    player2Strategy: string;
  }[];
  cooperativeOutcome?: {
    player1Strategy: string;
    player2Strategy: string;
    jointPayoff: number;
  };
  simulationSteps: {
    stepIndex: number;
    actionsTaken: Record<string, string>;
    payoffsRealized: Record<string, number>;
    narrative: string;
  }[];
}

export interface SimulationRun {
  runId: string;
  scenarioId: string;
  initialConditions: Record<string, any>;
  steps: {
    timestamp: string;
    stateVariables: Record<string, number>;
    eventsTriggered: string[];
  }[];
  finalOutcome: string;
  confidenceInterval: {
    lowerBound: number;
    upperBound: number;
  };
  executionTimeMs: number;
}

/**
 * ==============================================================================
 * SECTION 28: ADVANCED CRYPTOGRAPHIC KEY MANAGEMENT, MULTI-SIG & HSM
 * ==============================================================================
 * Types for Hardware Security Modules (HSM), cryptographic key lifecycles,
 * multi-signature transaction coordination, and zero-knowledge proof parameters.
 */

export interface HsmConfig {
  hsmId: string;
  vendor: 'THALES' | 'GEMALTO' | 'YUBICO' | 'AWS_KMS' | 'AZURE_KEY_VAULT' | 'CUSTOM_FPGA';
  model: string;
  firmwareVersion: string;
  slotId: number;
  label: string;
  supportedAlgorithms: ('AES256' | 'RSA4096' | 'ECDSA_SECP256K1' | 'ED25519' | 'DILITHIUM5' | 'FALCON1024')[];
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'DEGRADED' | 'ERROR';
}

export interface CryptographicKey {
  keyId: string;
  keyType: 'SYMMETRIC' | 'ASYMMETRIC_PUBLIC' | 'ASYMMETRIC_PRIVATE' | 'MASTER_SEED';
  keySize: number; // in bits
  algorithm: string;
  purpose: 'ENCRYPTION' | 'SIGNING' | 'KEY_DERIVATION' | 'ZERO_KNOWLEDGE';
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED' | 'ARCHIVED';
  createdAt: string;
  expiresAt?: string;
  hsmReferenceId?: string;
  keyFingerprint: string; // SHA3-256 hash of public key or key metadata
}

export interface SignatureShare {
  signerId: string;
  signatureBytes: string; // Base64 encoded signature
  timestamp: number;
  publicKeyFingerprint: string;
}

export interface MultiSigTransaction {
  txId: string;
  destinationAddress: string;
  amount: ActiveOrHistoricCurrencyAndAmount;
  assetSymbol: string;
  requiredSignatures: number; // 't' in t-of-n
  currentSignatures: SignatureShare[];
  signers: {
    signerId: string;
    name: string;
    publicKey: QuantumPublicKey;
    hasSigned: boolean;
  }[];
  status: 'PENDING_SIGNATURES' | 'FULLY_SIGNED' | 'EXECUTED' | 'FAILED' | 'EXPIRED';
  rawPayload: string; // Base64 or Hex encoded transaction payload
}

export interface ZeroKnowledgeProof {
  proofId: string;
  provingKeyId: string;
  verificationKeyId: string;
  publicInputs: string[];
  proofData: string; // Base64 encoded proof
  verified: boolean;
}

export interface ThresholdDecryptionConfig {
  t: number; // Threshold
  n: number; // Total shares
  keyShares: {
    shareId: number;
    encryptedShare: string;
    holderId: string;
  }[];
  reconstructionThreshold: number;
}

/**
 * ==============================================================================
 * SECTION 29: REAL-TIME TELEMETRY, NEURAL LACE SYNC & COGNITIVE PROFILE ANALYTICS
 * ==============================================================================
 * Types for neural interface telemetry, cognitive load tracking, emotional valence
 * analysis, and biometric feedback loops for high-frequency trading environments.
 */

export interface NeuralLaceTelemetry {
  syncId: string;
  userId: string;
  connectionStrength: number; // 0.0 to 1.0
  bandwidthBps: number;
  latencyMs: number;
  activeBrainwavePattern: 'ALPHA' | 'BETA' | 'GAMMA' | 'DELTA' | 'THETA';
  cognitiveLoadIndex: number; // 0.0 to 1.0
  emotionalState: {
    valence: number; // -1.0 (negative) to 1.0 (positive)
    arousal: number; // 0.0 (calm) to 1.0 (excited)
    dominantEmotion: 'CALM' | 'FOCUS' | 'ANXIETY' | 'EUPHORIA' | 'FATIGUE' | 'FRUSTRATION';
  };
  lastSyncTime: string;
}

export interface CognitiveProfile {
  profileId: string;
  userId: string;
  analyticalThinkingScore: number; // 0.0 to 100.0
  riskAversionIndex: number; // 0.0 to 1.0
  decisionSpeedMs: number;
  patternRecognitionScore: number; // 0.0 to 100.0
  focusDurationSeconds: number;
  stressToleranceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'ELITE';
}

export interface ThoughtNode {
  nodeId: string;
  textPayload: string;
  confidenceScore: number; // 0.0 to 1.0
  parentNodeId: string | null;
  emotionalValence: number; // -1.0 to 1.0
}

export interface ThoughtStreamLog {
  streamId: string;
  userId: string;
  timestamp: number;
  thoughtNodes: ThoughtNode[];
  primaryIntent: string;
  cognitiveCoherenceScore: number; // 0.0 to 1.0
}

export interface BiometricTelemetry {
  heartRateBpm: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  galvSkinResponse: number; // Microsiemens
  bodyTemperatureCelsius: number;
  respirationRate: number; // Breaths per minute
}

/**
 * ==============================================================================
 * SECTION 30: TEMPORAL ANCHORS, HISTORICAL PATTERN MATCHING & PREDICTIVE CHRONOLOGY
 * ==============================================================================
 * Types for cyclical historical analysis, temporal anchors, predictive chronology,
 * and pattern matching across multi-decade financial and geopolitical cycles.
 */

export interface TemporalAnchor {
  anchorId: string;
  targetTimestamp: number;
  description: string;
  historicalContext: LocalizedString;
  alignmentScore: number; // 0.0 to 1.0
  cyclicalPeriodYears: number; // e.g., 8.6 years (Martin Armstrong cycle), 50 years (Kondratiev wave)
}

export interface HistoricalPrecedent {
  precedentId: string;
  eventName: string;
  dateOccurred: string;
  economicConditions: {
    inflationLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'HYPER';
    interestRateEnvironment: 'RISING' | 'FALLING' | 'STABLE';
    geopoliticalTensionIndex: number; // 1 to 10
  };
  outcomeNarrative: LocalizedString;
  similarityIndex: number; // 0.0 to 1.0
}

export interface HistoricalPattern {
  patternId: string;
  name: string;
  description: string;
  historicalPrecedents: HistoricalPrecedent[];
  mathematicalModel: 'FIBONACCI_RETRACEMENT' | 'ELLIOTT_WAVE' | 'FOURIER_TRANSFORM' | 'MARKOV_CHAIN' | 'NEURAL_LSTM';
  correlationCoefficient: number; // -1.0 to 1.0
  predictiveAccuracy: number; // 0.0 to 1.0
}

export interface TimelineEvent {
  predictedTimestamp: number;
  eventDescription: string;
  probability: number; // 0.0 to 1.0
  potentialImpactScore: number; // 1 to 10
  triggerConditions: string[];
}

export interface PredictiveChronology {
  chronologyId: string;
  targetAsset: string;
  forecastHorizonDays: number;
  timelineEvents: TimelineEvent[];
  confidenceIntervals: {
    timestamp: number;
    p10: number; // 10th percentile price/value
    p50: number; // Median
    p90: number; // 90th percentile
  }[];
}


/**
 * ==============================================================================
 * SECTION 31: GENESIS ENGINE, SIMULATION PARAMETERS & ECOSYSTEM EVOLUTION
 * ==============================================================================
 * Types governing the multi-agent macroeconomic simulation engine, tick-based
 * state machines, ecosystem KPIs, macroeconomic shocks, and evolutionary reports.
 */

export interface MacroeconomicShock {
  shockId: string;
  name: string;
  type: 'INFLATIONARY_SPIKE' | 'LIQUIDITY_CRUNCH' | 'REGULATORY_CRACKDOWN' | 'TECHNOLOGICAL_SINGULARITY' | 'GEOPOLITICAL_CONFLICT';
  magnitude: number; // Scale of 0.0 to 1.0
  durationTicks: number;
  affectedSectors: string[];
  decayRate: number; // How fast the shock dissipates per tick
}

export interface AgentBehaviorProfile {
  profileId: string;
  agentType: 'CONSUMER' | 'PRODUCER' | 'SPECULATOR' | 'ARBITRAGEUR' | 'INSTITUTIONAL_HEDGER';
  riskAversion: number; // 0.0 to 1.0
  timePreference: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM' | 'GENERATIONAL';
  rationalityIndex: number; // 0.0 (pure noise) to 1.0 (perfect utility maximization)
  liquidityThreshold: number; // Minimum cash reserves before panic selling
}

export interface GenesisEngineConfig {
  simulationId: string;
  name: string;
  tickRateMs: number;
  totalTicksToRun: number;
  currentTick: number;
  initialCapitalDistribution: {
    totalSovereignWealth: ActiveOrHistoricCurrencyAndAmount;
    totalRetailLiquidity: ActiveOrHistoricCurrencyAndAmount;
    totalInstitutionalReserves: ActiveOrHistoricCurrencyAndAmount;
  };
  activeShocks: MacroeconomicShock[];
  agentProfiles: AgentBehaviorProfile[];
  isPaused: boolean;
}

export interface EcosystemEvolutionReport {
  reportId: string;
  simulationId: string;
  startTick: number;
  endTick: number;
  gdpGrowth: number;
  giniCoefficient: number; // Measure of wealth inequality (0.0 to 1.0)
  systemicStabilityIndex: number; // 0.0 (imminent collapse) to 1.0 (perfect equilibrium)
  dominantAgentStrategy: string;
  evolutionaryMilestones: {
    tick: number;
    milestoneType: 'EMERGENCE' | 'EXTINCTION' | 'PARADIGM_SHIFT';
    description: string;
  }[];
}

export interface SimulationState {
  engineConfig: GenesisEngineConfig;
  kpis: EcosystemKPIs;
  recentEvents: SimulationEvent[];
  evolutionReport?: EcosystemEvolutionReport;
}

/**
 * ==============================================================================
 * SECTION 32: STRIPE NEXUS, CHARGEBACKS, DISPUTES & REVENUE RECONCILIATION
 * ==============================================================================
 * Types governing Stripe payment integrations, dispute evidence submissions,
 * automated chargeback mitigation, and multi-source revenue reconciliation.
 */

export interface DisputeEvidence {
  accessActivityLog?: string;
  billingAddress?: string;
  customerCommunication?: string;
  customerSignature?: string;
  duplicateChargeDocumentation?: string;
  receipt?: string;
  refundPolicy?: string;
  serviceDocumentation?: string;
  shippingDocumentation?: string;
  uncategorizedFile?: string;
}

export interface StripeDispute {
  disputeId: string;
  chargeId: string;
  amount: number;
  currency: string;
  reason: 'general' | 'fraudulent' | 'unrecognized' | 'duplicate' | 'subscription_canceled' | 'product_not_received' | 'product_unacceptable';
  status: 'warning_needs_response' | 'warning_under_review' | 'needs_response' | 'under_review' | 'won' | 'lost';
  evidenceDueBy: string;
  evidence: DisputeEvidence;
  isSubmitted: boolean;
  metadata?: Record<string, string>;
}

export interface StripeRefund {
  refundId: string;
  chargeId: string;
  amount: number;
  currency: string;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge';
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  createdAt: number;
}

export interface StripePayout {
  payoutId: string;
  amount: number;
  currency: string;
  arrivalDate: string;
  status: 'paid' | 'pending' | 'in_transit' | 'canceled' | 'failed';
  method: 'standard' | 'instant';
  bankAccountMask: string;
}

export interface StripeTransfer {
  transferId: string;
  amount: number;
  currency: string;
  destinationAccountId: string;
  sourceTransactionId?: string;
  description?: string;
}

export interface RevenueReconciliationRule {
  ruleId: string;
  name: string;
  sourceA: 'STRIPE' | 'PLAID' | 'MODERN_TREASURY' | 'INTERNAL_LEDGER';
  sourceB: 'STRIPE' | 'PLAID' | 'MODERN_TREASURY' | 'INTERNAL_LEDGER';
  matchingCriteria: {
    fieldA: string;
    fieldB: string;
    tolerance?: number; // For numeric or date tolerances
  }[];
  autoResolve: boolean;
  isActive: boolean;
}

export interface ReconciliationMatch {
  matchId: string;
  ruleId: string;
  entityAId: string;
  entityBId: string;
  amountA: number;
  amountB: number;
  timestampA: string;
  timestampB: string;
  status: 'MATCHED' | 'DISCREPANCY' | 'UNMATCHED';
  discrepancyReason?: string;
}

export interface StripeNexusConfig {
  webhookSecret: string;
  publishableKey: string;
  restrictedApiKeys: string[];
  connectedAccounts: {
    accountId: string;
    businessName: string;
    status: 'ACTIVE' | 'PENDING' | 'RESTRICTED';
  }[];
  disputeRules: StripeDispute[];
  reconciliationRules: RevenueReconciliationRule[];
}

/**
 * ==============================================================================
 * SECTION 33: COMPLIANCE ORACLE, SANCTIONS SCREENING & AML TRANSACTION MONITORING
 * ==============================================================================
 * Types governing anti-money laundering (AML) transaction monitoring, OFAC/PEP
 * sanctions screening, Suspicious Activity Report (SAR) filings, and compliance audits.
 */

export interface SanctionsScreeningRequest {
  requestId: string;
  entityName: string;
  entityType: 'INDIVIDUAL' | 'ORGANIZATION' | 'VESSEL' | 'AIRCRAFT';
  dateOfBirth?: string;
  countryOfOrigin?: string;
  nationalId?: string;
}

export interface SanctionsMatchDetail {
  listName: string; // e.g., "OFAC SDN", "EU Consolidated List"
  entryName: string;
  matchScore: number; // 0.0 to 1.0
  remarks?: string;
  aliases?: string[];
}

export interface SanctionsScreeningResult {
  requestId: string;
  status: 'CLEARED' | 'POTENTIAL_MATCH' | 'CONFIRMED_MATCH';
  screeningTimestamp: string;
  matches: SanctionsMatchDetail[];
  analystReviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
}

export interface PepCheckResult {
  isPep: boolean;
  pepLevel?: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4'; // Level 1 is highest (Heads of State)
  sourceList: string;
  politicalOfficeHeld?: string;
  riskScore: number; // 0.0 to 100.0
}

export interface AmlTransactionMonitoringRule {
  ruleId: string;
  name: string;
  description: string;
  triggerCondition: {
    metric: 'VELOCITY_24H' | 'SINGLE_TRANSACTION_LIMIT' | 'RAPID_FUNDS_FLOW' | 'STRUCTURING_DETECTION';
    threshold: number;
    currency?: string;
  };
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isActive: boolean;
}

export interface AmlAlert {
  alertId: string;
  ruleId: string;
  userId: string;
  transactionIds: string[];
  riskScore: number;
  status: 'NEW' | 'UNDER_INVESTIGATION' | 'DISMISSED_FALSE_POSITIVE' | 'ESCALATED_TO_SAR';
  assignedInvestigatorId?: string;
  createdAt: string;
  notes: string[];
}

export interface SarFiling {
  sarId: string;
  alertId: string;
  filingAgency: 'FinCEN' | 'FCA' | 'BaFin' | 'AMF';
  suspectDetails: {
    fullName: string;
    ssnOrTaxId?: string;
    address?: string;
    occupation?: string;
  };
  narrativeSummary: string;
  financialImpact: ActiveOrHistoricCurrencyAndAmount;
  status: 'DRAFT' | 'PENDING_INTERNAL_APPROVAL' | 'SUBMITTED' | 'REJECTED';
  submissionReceiptId?: string;
  submittedAt?: string;
}

export interface ComplianceOracleState {
  screeningRulesCount: number;
  activeAmlRules: AmlTransactionMonitoringRule[];
  pendingAlerts: AmlAlert[];
  recentSarFilings: SarFiling[];
  lastAuditTimestamp: string;
}

/**
 * ==============================================================================
 * SECTION 34: GLOBAL SSI HUB, DECENTRALIZED IDENTIFIERS (DIDs) & VERIFIABLE CREDENTIALS
 * ==============================================================================
 * Types governing W3C Decentralized Identifiers (DIDs), Verifiable Credentials (VCs),
 * Verifiable Presentations (VPs), and zero-knowledge credential proofs.
 */

export interface DidVerificationMethod {
  id: string;
  type: 'Ed25519VerificationKey2020' | 'JsonWebKey2020' | 'X25519KeyAgreementKey2020';
  controller: string;
  publicKeyJwk?: Record<string, any>;
  publicKeyMultibase?: string;
}

export interface DidDocument {
  context: string[];
  id: string; // e.g., "did:ion:1234..." or "did:key:z6M..."
  verificationMethod: DidVerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement?: string[];
  service?: {
    id: string;
    type: string;
    serviceEndpoint: string;
  }[];
}

export interface CredentialSubject {
  id: string; // The DID of the subject
  [key: string]: any; // Arbitrary claims (e.g., ageOver21: true, kycStatus: "PASSED")
}

export interface VerifiableCredential {
  context: string[];
  id: string;
  type: string[];
  issuer: string; // DID of the issuer
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    jws: string;
  };
}

export interface VerifiablePresentation {
  context: string[];
  id: string;
  type: string[];
  verifiableCredential: VerifiableCredential[];
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    challenge: string;
    domain: string;
    jws: string;
  };
}

export interface PresentationDefinition {
  id: string;
  input_descriptors: {
    id: string;
    purpose?: string;
    schema: {
      uri: string;
    }[];
    constraints?: {
      fields?: {
        path: string[];
        filter?: Record<string, any>;
      }[];
    };
  }[];
}

export interface ZkCredentialProof {
  proofId: string;
  provingSystem: 'Groth16' | 'Plonk';
  circuitIdentifier: string;
  publicInputs: {
    credentialSchemaUri: string;
    issuerDid: string;
    revealedClaims: Record<string, any>;
  };
  proofBytes: string; // Base64 encoded zk-SNARK proof
}

export interface SsiHubState {
  userDidDocument: DidDocument | null;
  issuedCredentials: VerifiableCredential[];
  receivedPresentations: VerifiablePresentation[];
  activePresentationDefinitions: PresentationDefinition[];
  isSyncing: boolean;
}

/**
 * ==============================================================================
 * SECTION 35: DEVELOPER HUB, API PLAYGROUND & INTERACTIVE SCHEMA EXPLORER
 * ==============================================================================
 * Types governing developer portal configurations, API key management,
 * interactive API playground requests/responses, and schema node trees.
 */

export interface RateLimitPolicy {
  policyId: string;
  tierName: 'SANDBOX' | 'STANDARD' | 'ENTERPRISE' | 'UNLIMITED';
  requestsPerSecond: number;
  requestsPerMonth: number;
  burstCapacity: number;
}

export interface DeveloperHubConfig {
  developerId: string;
  organizationName: string;
  apiKeys: APIKey[];
  activeRateLimitPolicy: RateLimitPolicy;
  webhookEndpoints: {
    endpointId: string;
    url: string;
    description?: string;
    secretKey: string;
    subscribedEvents: string[];
    isActive: boolean;
  }[];
}

export interface ApiPlaygroundRequest {
  requestId: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  bodyPayload?: string; // JSON string
  timestamp: string;
}

export interface ApiPlaygroundResponse {
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
  bodyPayload: string; // JSON string
  responseTimeMs: number;
  timestamp: string;
}

export interface SchemaNode {
  nodeId: string;
  name: string;
  type: 'OBJECT' | 'ARRAY' | 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ENUM' | 'REF';
  description: string;
  isRequired: boolean;
  children?: SchemaNode[];
  enumOptions?: string[];
  refSchemaId?: string;
}

export interface InteractiveExecutionLog {
  logId: string;
  timestamp: string;
  eventType: 'API_CALL' | 'WEBHOOK_SENT' | 'RATE_LIMIT_EXCEEDED' | 'SIGNATURE_VERIFICATION_FAILED';
  message: string;
  metadata?: Record<string, any>;
}

export interface DeveloperHubState {
  config: DeveloperHubConfig;
  playgroundHistory: {
    request: ApiPlaygroundRequest;
    response: ApiPlaygroundResponse;
  }[];
  schemaTree: Record<string, SchemaNode>;
  executionLogs: InteractiveExecutionLog[];
}
/**
 * ==============================================================================
 * SECTION 36: COMPATIBILITY ALIASES, LEGACY WRAPPERS & DATA PIPELINE TELEMETRY
 * ==============================================================================
 * Legacy wrappers, compatibility aliases, and data pipeline telemetry structures
 * to ensure seamless integration across all micro-frontends and banking modules.
 */

export type AppView = View;

export interface PortfolioAsset {
  id: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  assetClass: string;
  riskLevel: string;
}

export interface InternalAccount {
  id: string;
  productName: string;
  displayAccountNumber: string;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance: number;
  availableBalance: number;
  institutionName: string;
  connectionId: string;
}

export interface Pipeline {
  id: string;
  name: string;
  pipelineName: string;
  status: string;
  prettyDuration: string;
}

export interface InboundBlob {
  id: string;
  filePath: string;
  status: string;
  vendorName: string;
  interfaceType: string;
  createdAt: string;
}

export interface FundFlow {
  id: string;
  name: string;
  ledgerId: string;
  postedTxCount: number;
  pendingTxCount: number;
}

export interface AuthorizedApp {
  id: string;
  name: string;
  description: string;
  status: string;
  authorizedAt: string;
  scopes?: string[];
}

export interface Portfolio {
  id: string;
  name: string;
  type: string;
  currency: string;
  totalValue: number;
  unrealizedGainLoss: number;
  todayGainLoss: number;
  lastUpdated: string;
  riskTolerance: string;
  holdings: any[];
}

export interface AccountDetails {
  id: string;
  name: string;
  mask: string;
  currentBalance: number;
  type: string;
  accountHolder: string;
  currency: string;
}

export interface PaymentOrder {
  id: string;
  counterpartyId: string;
  counterpartyName: string;
  accountId: string;
  amount: number;
  currency: string;
  direction: 'credit' | 'debit';
  status: 'needs_approval' | 'approved' | 'denied' | 'paid';
  date: string;
  type: string;
  dueDate?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  counterpartyName: string;
  dueDate: string;
  amount: number;
  status: 'overdue' | 'unpaid' | 'paid';
}

export interface PlaidMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }[];
  link_session_id: string;
}

export interface SecurityProfile {
  lastLogin: string;
  mfaEnabled: boolean;
}

/**
 * ==============================================================================
 * SECTION 37: QUANTUM CRYPTOGRAPHY, ZERO-KNOWLEDGE PROOFS & MULTI-PARTY COMPUTATION (MPC)
 * ==============================================================================
 * Advanced cryptographic primitives, key exchange states, and multi-party
 * computation session parameters for secure, decentralized asset custody.
 */

export interface MpcKeyShare {
  shareId: number;
  totalShares: number;
  threshold: number;
  encryptedShare: string;
  publicKeyDerivationPath: string;
  hsmKeyId?: string;
}

export interface MpcSession {
  sessionId: string;
  initiatorNodeId: string;
  participatingNodeIds: string[];
  status: 'PENDING' | 'KEY_GENERATION' | 'SIGNING' | 'COMPLETED' | 'FAILED';
  roundNumber: number;
  maxRounds: number;
  commitmentHashes: Record<string, string>;
  signatureShares: Record<string, string>;
  createdAt: string;
  expiresAt: string;
}

export interface ZkSnarkVerificationKey {
  alphaG1: string;
  betaG2: string;
  gammaG2: string;
  deltaG2: string;
  ic: string[];
}

export interface ZkSnarkProof {
  a: string[];
  b: string[][];
  c: string[];
}

/**
 * ==============================================================================
 * SECTION 38: NEURAL INTERFACE TELEMETRY & COGNITIVE LOAD BALANCING
 * ==============================================================================
 * Detailed EEG band power, cognitive fatigue metrics, and neural-lace calibration
 * parameters for high-frequency trading environments and biometric feedback loops.
 */

export interface EegBandPower {
  delta: number; // 0.5 - 4 Hz
  theta: number; // 4 - 8 Hz
  alpha: number; // 8 - 12 Hz
  beta: number;  // 12 - 30 Hz
  gamma: number; // 30 - 100 Hz
}

export interface NeuralCalibrationParameters {
  baselineAlphaPower: number;
  baselineBetaPower: number;
  artifactThresholdMicrovolts: number;
  electrodeImpedanceOhms: Record<string, number>;
  lastCalibratedAt: string;
}

export interface CognitiveFatigueMetrics {
  blinkRatePerMinute: number;
  saccadeVelocityDegSec: number;
  pupilDilationMm: number;
  microSleepEpisodesCount: number;
  fatigueIndex: number; // 0.0 to 1.0
}

/**
 * ==============================================================================
 * SECTION 39: TEMPORAL CHRONOLOGY & CYCLICAL HISTORICAL PATTERN MATCHING
 * ==============================================================================
 * Detailed Fourier analysis parameters, Kondratiev wave states, and historical
 * correlation matrices for cyclical historical analysis and predictive chronology.
 */

export interface FourierAnalysisParameters {
  samplingFrequencyHz: number;
  windowSizeSamples: number;
  dominantFrequencies: number[];
  spectralDensity: number[];
}

export interface KondratievWaveState {
  currentPhase: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
  yearsInPhase: number;
  estimatedPhaseTransitionYear: number;
  debtDeflationPressureIndex: number; // 0.0 to 1.0
}

export interface HistoricalCorrelationMatrix {
  assetClassA: string;
  assetClassB: string;
  correlationCoefficient: number;
  timeLagDays: number;
  confidenceInterval: { lower: number; upper: number };
}

/**
 * ==============================================================================
 * SECTION 40: GENESIS ENGINE MACROECONOMIC SHOCKS & EVOLUTIONARY AGENT BEHAVIORS
 * ==============================================================================
 * Detailed agent utility functions, Gini coefficient calculation states, and
 * systemic stability metrics for the multi-agent macroeconomic simulation engine.
 */

export interface AgentUtilityFunction {
  riskAversionCoefficient: number;
  intertemporalElasticityOfSubstitution: number;
  leisurePreferenceWeight: number;
  discountFactor: number;
}

export interface GiniCoefficientCalculationState {
  populationSize: number;
  cumulativeWealthShare: number[];
  cumulativePopulationShare: number[];
  calculatedGini: number; // 0.0 to 1.0
}

export interface SystemicStabilityMetrics {
  leverageRatioSystemWide: number;
  liquidityCoverageRatioSystemWide: number;
  interbankContagionRiskIndex: number; // 0.0 to 1.0
  probabilityOfSystemicDefault: number; // 0.0 to 1.0
}


/**
 * ==============================================================================
 * SECTION 41: ENTERPRISE CONTENT MANAGEMENT, PUBLISHING WORKFLOWS & DIGITAL ASSETS
 * ==============================================================================
 * Production-grade types governing content lifecycles, multi-format publishing,
 * responsive media assets, and multi-stage editorial approval workflows.
 */

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
  REVISING = 'REVISING',
  PENDING_LOCALIZATION = 'PENDING_LOCALIZATION'
}

export enum ContentType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  PODCAST = 'PODCAST',
  PAGE = 'PAGE',
  PRODUCT = 'PRODUCT',
  ADVERTISEMENT = 'ADVERTISEMENT',
  COLLECTION = 'COLLECTION',
  RECIPE = 'RECIPE',
  REVIEW = 'REVIEW',
  EVENT = 'EVENT',
  GUIDE = 'GUIDE'
}

export interface BaseContentItem {
  id: ResourceId;
  contentType: ContentType;
  title: LocalizedString;
  description?: LocalizedString;
  tags: string[];
  categories: string[];
  slug: string;
  status: PublicationStatus;
  authorId: string;
  authorName?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  unpublishAt?: Date;
  thumbnailUrl?: string;
  contentUrl?: string;
  version: number;
  locale: string;
  originalContentId?: string;
  metadata?: Record<string, any>;
  lastModifiedBy?: string;
  workflowId?: string;
}

export interface ArticleContent extends BaseContentItem {
  contentType: ContentType.ARTICLE;
  body: LocalizedString;
  readingTimeMinutes?: number;
  featuredMedia?: AssetMetadata[];
  seo: {
    metaTitle?: LocalizedString;
    metaDescription?: LocalizedString;
    keywords?: string[];
    ogImageUrl?: string;
    canonicalUrl?: string;
  };
  relatedContentIds?: ResourceId[];
  tableOfContents?: { title: LocalizedString; slug: string; level: number }[];
}

export interface VideoContent extends BaseContentItem {
  contentType: ContentType.VIDEO;
  videoUrl: string;
  durationSeconds: number;
  captionsUrl?: LocalizedString;
  embedCode?: string;
  resolution?: { width: number; height: number };
  alternativeFormats?: { url: string; quality: string; mimeType: string }[];
  processingStatus: 'pending' | 'processed' | 'failed' | 'transcoding';
}

export interface ImageContent extends BaseContentItem {
  contentType: ContentType.IMAGE;
  imageUrl: string;
  altText: LocalizedString;
  dimensions: { width: number; height: number };
  fileSizeKb: number;
  responsiveImageUrls?: { srcSet: string; mediaQuery?: string }[];
  copyright?: string;
  caption?: LocalizedString;
}

export interface ContentCollection extends BaseContentItem {
  contentType: ContentType.COLLECTION;
  itemIds: ResourceId[];
  itemCount: number;
  collectionCoverUrl?: string;
  collectionType: string;
  isOrdered: boolean;
  introduction?: LocalizedString;
  conclusion?: LocalizedString;
}

export interface AssetMetadata {
  id: ResourceId;
  fileName: string;
  mimeType: string;
  url: string;
  sizeBytes: number;
  uploadedAt: Date;
  uploadedBy: string;
  description?: LocalizedString;
  altText?: LocalizedString;
  dimensions?: { width: number; height: number };
  tags?: string[];
  associatedContentId?: ResourceId;
  source?: string;
  copyright?: LocalizedString;
  processingStatus: 'uploaded' | 'processing' | 'ready' | 'failed' | 'optimized';
  fileHash?: string;
}

export interface WorkflowStep {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  requiredRole: UserRole;
  nextTransitions: string[];
  requiresApproval: boolean;
  automationRules?: string[];
  fieldPermissions?: Record<string, 'editable' | 'read_only' | 'hidden'>;
  assignedTo?: string;
}

export interface PublishingWorkflow {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  steps: WorkflowStep[];
  initialStepId: string;
  publishedStepId: string;
  lastModified: Date;
  lastModifiedBy?: string;
  appliesToContentTypes: ContentType[];
  isActive: boolean;
}

/**
 * ==============================================================================
 * SECTION 42: MONETIZATION, SUBSCRIPTION PLANS & PRODUCT OFFERINGS
 * ==============================================================================
 * Enterprise-grade structures governing tiered subscription plans, billing cycles,
 * payment details, product catalogs, and automated invoice generation.
 */

export enum BillingFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  BIENNIALLY = 'BIENNIALLY',
  ONE_TIME = 'ONE_TIME'
}

export interface SubscriptionPlan {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  basePrice: number;
  currency: string;
  billingFrequency: BillingFrequency;
  trialDays?: number;
  features: string[];
  isActive: boolean;
  promoImageUrl?: string;
  displayOrder: number;
  metadata?: Record<string, any>;
  pricingTiers?: {
    frequency: BillingFrequency;
    price: number;
    currency: string;
    discountPercentage?: number;
  }[];
  accessGrants?: {
    contentTypes?: ContentType[];
    categories?: string[];
    specificContentIds?: ResourceId[];
    aiFeatureAccess?: string[];
  };
}

export interface PaymentDetails {
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded' | 'charged_back';
  method: string;
  invoiceId?: string;
  errorMessage?: string;
  cardLast4?: string;
  cardBrand?: string;
  providerMetadata?: Record<string, any>;
  transactionType: 'subscription_payment' | 'one_time_purchase' | 'refund' | 'trial_conversion';
}

export interface ProductOffering {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  currency: string;
  isAvailable: boolean;
  productType: string;
  associatedContentId?: ResourceId;
  imageUrl?: string;
  inventory?: number;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
  discountForPlanId?: string;
  taxable: boolean;
  shippingInfo?: {
    weightKg: number;
    dimensionsCm: { length: number; width: number; height: number };
    shippingZones: string[];
  };
}

export interface InvoiceDetails {
  id: string;
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'refunded' | 'voided';
  invoicePdfUrl?: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    productId?: ResourceId;
    subscriptionId?: string;
  }[];
  taxAmount?: number;
  discountAmount?: number;
  paymentInfo?: PaymentDetails;
}

/**
 * ==============================================================================
 * SECTION 43: ANALYTICS, SYSTEM HEALTH MONITORING & BACKGROUND JOBS
 * ==============================================================================
 * Types governing real-time telemetry metrics, dynamic dashboard widgets,
 * microservice health checks, system notifications, and asynchronous job queues.
 */

export interface MetricDataPoint {
  metricName: string;
  value: number;
  timestamp: Date;
  dimensions?: Record<string, string | number>;
  userId?: string;
  sessionId?: string;
  eventId?: string;
}

export interface DashboardWidgetConfig {
  id: string;
  title: LocalizedString;
  chartType: 'line_chart' | 'bar_chart' | 'area_chart' | 'pie_chart' | 'kpi' | 'table' | 'gauge' | 'heatmap';
  metrics: string[];
  timeRange: '24h' | '7d' | '30d' | '90d' | '1y' | 'all_time' | 'custom';
  customDateRange?: DateRange;
  filters?: Record<string, string | string[]>;
  groupBy?: string[];
  autoRefresh: boolean;
  refreshIntervalSeconds?: number;
  order: number;
  layout?: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
  };
  drilldownLink?: string;
  comparisonPeriod?: 'previous_period' | 'previous_year' | 'none';
}

export interface ServiceHealthStatus {
  serviceName: string;
  status: 'operational' | 'degraded' | 'major_outage' | 'maintenance' | 'unknown';
  lastChecked: Date;
  message?: string;
  dependencies?: Record<string, 'operational' | 'degraded' | 'major_outage' | 'unknown'>;
  responseTimeMs?: number;
  errorRate?: number;
  cpuUtilization?: number;
  memoryUtilization?: number;
  activeInstances?: number;
}

export interface SystemNotification {
  id: string;
  recipientId?: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'URGENT' | 'PROMOTIONAL' | 'CRITICAL_ALERT';
  title: LocalizedString;
  message: LocalizedString;
  actionUrl?: string;
  icon?: string;
  createdAt: Date;
  isRead: boolean;
  expiresAt?: Date;
  priority?: number;
  channels: ('in-app' | 'email' | 'push' | 'sms' | 'webhook')[];
  relatedEntityId?: ResourceId;
  relatedEntityType?: string;
}

export interface JobQueueItem {
  id: string;
  jobType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payload: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  executeAt?: Date;
  initiatedByUserId?: string;
  attempts: number;
  maxAttempts: number;
  errorMessage?: string;
  progress?: number;
  externalReferenceId?: string;
}

/**
 * ==============================================================================
 * SECTION 44: ENTERPRISE AI MODEL CONFIGURATIONS & PROMPT TEMPLATES
 * ==============================================================================
 * Advanced structures governing multi-provider AI model routing, prompt templates,
 * token usage tracking, and vector database training datasets.
 */

export enum AIModelType {
  LLM = 'LLM',
  VISION = 'VISION',
  SPEECH = 'SPEECH',
  RECOMMENDATION = 'RECOMMENDATION',
  SEARCH = 'SEARCH',
  CONTENT_GENERATION = 'CONTENT_GENERATION',
  ANALYTICS = 'ANALYTICS'
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  type: AIModelType;
  apiUrl: string;
  apiKeyRef?: string;
  defaultTemperature?: number;
  maxOutputTokens?: number;
  costPerUnit?: {
    inputToken: number;
    outputToken: number;
    currency: string;
  };
  rateLimits?: {
    requestsPerMinute?: number;
    tokensPerMinute?: number;
    burstRequests?: number;
  };
  isActive: boolean;
  capabilities: string[];
  lastUpdated: Date;
  customParameters?: Record<string, any>;
  version?: string;
}

export interface PromptTemplate {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  templateString: string;
  variables: string[];
  recommendedModelType: AIModelType;
  recommendedModelId?: string;
  defaultVariableValues?: Record<string, string>;
  systemMessage?: LocalizedString;
  outputFormat?: 'json' | 'markdown' | 'plain_text' | 'xml';
  lastUpdated: Date;
  lastModifiedBy?: string;
  isActive: boolean;
  categories?: string[];
}

export interface AIResponse<T = any> {
  responseId: string;
  modelId: string;
  input: string | PromptTemplate | Record<string, any>;
  rawOutput: string;
  parsedOutput?: T;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    cost?: number;
    currency?: string;
  };
  timestamp: Date;
  status: 'success' | 'error' | 'throttled' | 'rate_limited' | 'invalid_input';
  errorMessage?: string;
  errorCode?: string;
  providerMetadata?: Record<string, any>;
  userId?: string;
}

export interface AIFeatureDefinition {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  aiConfig: {
    modelId: string;
    promptTemplateId?: string;
    customParameters?: Record<string, any>;
  };
  isEnabled: boolean;
  isPremiumFeature: boolean;
  allowedRoles: UserRole[];
  usageLimits?: {
    callsPerPeriod?: number;
    tokensPerPeriod?: number;
    periodUnit: 'day' | 'week' | 'month' | 'lifetime';
  };
  lastUpdated: Date;
  appliesToContentTypes?: ContentType[];
  examples?: { input: string; output: string }[];
}

export interface AIDataset {
  id: string;
  name: string;
  description?: LocalizedString;
  dataType: 'text' | 'image' | 'audio' | 'mixed' | 'structured';
  source: string;
  itemCount: number;
  lastUpdated: Date;
  status: 'pending' | 'processing' | 'ready' | 'failed' | 'training_model';
  associatedModelId?: string;
  storageLocation?: string;
  sizeBytes?: number;
  createdByUserId?: string;
  accessLevel: 'public' | 'private' | 'restricted_to_team';
  qualityMetrics?: {
    completeness?: number;
    accuracy?: number;
    biasAnalysisReportUrl?: string;
  };
}

/**
 * ==============================================================================
 * SECTION 45: USER PERMISSIONS, AUTHENTICATION CLAIMS & ACCESS CONTROL
 * ==============================================================================
 * Foundational security structures governing granular user permissions, JWT claims,
 * user preferences, and active subscription entitlements.
 */

export interface UserPermissions {
  canReadAnyContent: boolean;
  canCreateContent: boolean;
  canEditContent: 'none' | 'own_content' | 'any_content';
  canDeleteContent: 'none' | 'own_content' | 'any_content';
  canPublishContent: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canApproveContent: boolean;
  canManageSubscriptions: boolean;
  canUseAIFeatures: boolean;
  canManageAssets: boolean;
  canViewAuditLogs: boolean;
  canImpersonateUsers: boolean;
  accessToResources?: string[];
  customPermissions?: Record<string, boolean>;
}

export interface AuthTokenClaims {
  userId: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  iat: number;
  exp: number;
  iss?: string;
  aud?: string | string[];
  permissions?: UserPermissions;
  subscriptionId?: string;
  tenantId?: string;
  sessionId?: string;
  customClaims?: Record<string, any>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    marketingEmails: boolean;
    contentUpdatesEnabled?: boolean;
    commentNotificationsEnabled?: boolean;
  };
  timezone: string;
  contentFilters?: string[];
  betaFeaturesOptIn: boolean;
  accessibilitySettings?: {
    highContrastMode: boolean;
    fontSizeScale: number;
  };
  preferredTopics?: string[];
  readingMode?: 'paginated' | 'continuous_scroll';
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: LocalizedString;
  status: 'active' | 'cancelled' | 'trialing' | 'past_due' | 'unpaid' | 'expired' | 'pending';
  startDate: Date;
  currentPeriodEndDate: Date;
  nextRenewalDate?: Date;
  autoRenew: boolean;
  entitlements: string[];
  lastPayment?: PaymentDetails;
  paymentGatewayCustomerId?: string;
  currentPeriodPrice: number;
  currency: string;
  promoCode?: string;
  cancelledAt?: Date;
}