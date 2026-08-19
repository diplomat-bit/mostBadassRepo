/**
 * @file services/githubService.ts
 * @description Enterprise-grade, resilient GitHub API Service Client and Toolkit.
 * Provides unified abstractions for Git Trees, Content Management, Branching, Pull Requests,
 * GitHub Actions Workflows, Issue Tracking, Releases, Repository Search, and Blob Processing.
 * Features automated rate-limit mitigation with exponential jitter backoff, streaming logs,
 * UTF-8/Unicode Base64 transcoding, in-memory caching with TTL, and async iteration.
 * @version 3.0.0
 */

// ============================================================================
// SECTION 1: CORE DOMAIN ENUMS, TYPES, AND INTERFACES
// ============================================================================

export enum FileType {
  FILE = 'file',
  DIRECTORY = 'dir',
  FOLDER = 'folder',
  DOCUMENT = 'document',
  SYMLINK = 'symlink',
  SUBMODULE = 'submodule',
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number | null;
  lastModified: string;
  parentId: string;
  source: 'github';
  githubOwner: string;
  githubRepo: string;
  githubUrl: string;
  content?: string;
  extension?: string;
  mimeType?: string;
  sha?: string;
  downloadUrl?: string;
}

export interface FileNode {
  type: 'file';
  path: string;
  name: string;
  sha?: string;
  size?: number;
  mode?: string;
  url?: string;
}

export interface DirNode {
  type: 'dir';
  path: string;
  name: string;
  sha?: string;
  children: (DirNode | FileNode)[];
}

export type RepoTreeNode = DirNode | FileNode;

export interface GitTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree' | 'commit';
  sha: string;
  size?: number;
  url: string;
}

export interface GitTreeResponse {
  sha: string;
  url: string;
  tree: GitTreeItem[];
  truncated: boolean;
}

export interface GithubRepoOwner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  type: 'User' | 'Organization';
  site_admin: boolean;
}

export interface RepositoryPermissions {
  admin: boolean;
  maintain?: boolean;
  push: boolean;
  triage?: boolean;
  pull: boolean;
}

export interface GithubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GithubRepoOwner;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions?: boolean;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string | null;
    url: string | null;
    node_id: string;
  } | null;
  allow_forking?: boolean;
  is_template?: boolean;
  topics?: string[];
  visibility?: 'public' | 'private' | 'internal';
  default_branch: string;
  permissions?: RepositoryPermissions;
}

export interface GithubFile {
  name: string;
  path: string;
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  download_url: string | null;
  size: number;
  sha?: string;
  content?: string;
  encoding?: string;
  url?: string;
  git_url?: string;
  html_url?: string;
}

export interface BranchCommitReference {
  sha: string;
  url: string;
}

export interface BranchProtection {
  enabled: boolean;
  required_status_checks?: {
    enforcement_level: string;
    contexts: string[];
    checks: Array<{ context: string; app_id: number | null }>;
  };
}

export interface Branch {
  name: string;
  commit: BranchCommitReference;
  protected: boolean;
  protection?: BranchProtection;
  protection_url?: string;
}

export interface PullRequestUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
}

export interface PullRequestBranchMarker {
  label: string;
  ref: string;
  sha: string;
  user: PullRequestUser;
  repo: GithubRepo | null;
}

export interface PullRequest {
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: 'open' | 'closed';
  locked: boolean;
  title: string;
  user: PullRequestUser;
  body: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  assignee: PullRequestUser | null;
  assignees: PullRequestUser[];
  head: PullRequestBranchMarker;
  base: PullRequestBranchMarker;
  author_association: string;
  draft?: boolean;
  merged?: boolean;
  mergeable?: boolean | null;
  rebaseable?: boolean | null;
  mergeable_state?: string;
  comments?: number;
  review_comments?: number;
  commits?: number;
  additions?: number;
  deletions?: number;
  changed_files?: number;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: 'active' | 'deleted' | 'disabled_fork' | 'disabled_inactivity' | 'disabled_manually';
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
}

export interface WorkflowRunHeadCommitAuthor {
  name: string;
  email: string;
}

export interface WorkflowRunHeadCommit {
  id: string;
  tree_id: string;
  message: string;
  timestamp: string;
  author: WorkflowRunHeadCommitAuthor;
  committer: WorkflowRunHeadCommitAuthor;
}

export interface WorkflowRun {
  id: number;
  name: string;
  node_id: string;
  head_branch: string;
  head_sha: string;
  path?: string;
  run_number: number;
  event: string;
  status: 'queued' | 'in_progress' | 'completed' | 'waiting' | 'requested' | 'pending';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required' | 'stale' | 'skipped' | null;
  workflow_id: number;
  url: string;
  html_url: string;
  pull_requests: Array<{
    id: number;
    number: number;
    url: string;
    head: { sha: string; ref: string };
    base: { sha: string; ref: string };
  }>;
  created_at: string;
  updated_at: string;
  actor: PullRequestUser;
  triggering_actor?: PullRequestUser;
  run_attempt?: number;
  head_commit: WorkflowRunHeadCommit;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: GithubRepoOwner;
  };
}

export interface WorkflowJobStep {
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | null;
  number: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface WorkflowJob {
  id: number;
  run_id: number;
  run_url: string;
  node_id: string;
  head_sha: string;
  url: string;
  html_url: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required' | 'skipped' | null;
  created_at: string;
  started_at: string;
  completed_at: string | null;
  name: string;
  steps: WorkflowJobStep[];
  check_run_url: string;
  labels: string[];
  runner_id: number | null;
  runner_name: string | null;
  runner_group_id: number | null;
  runner_group_name: string | null;
}

export interface WorkflowArtifact {
  id: number;
  node_id: string;
  name: string;
  size_in_bytes: number;
  url: string;
  archive_download_url: string;
  expired: boolean;
  created_at: string;
  expires_at: string;
  updated_at: string;
}

export interface CommitAuthorSignature {
  name: string;
  email: string;
  date: string;
}

export interface CommitItem {
  sha: string;
  node_id: string;
  commit: {
    author: CommitAuthorSignature;
    committer: CommitAuthorSignature;
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification?: {
      verified: boolean;
      reason: string;
      signature: string | null;
      payload: string | null;
    };
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: GithubRepoOwner | null;
  committer: GithubRepoOwner | null;
  parents: Array<{
    sha: string;
    url: string;
    html_url?: string;
  }>;
  stats?: {
    total: number;
    additions: number;
    deletions: number;
  };
  files?: Array<{
    sha: string;
    filename: string;
    status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
    previous_filename?: string;
  }>;
}

export interface GitReference {
  ref: string;
  node_id: string;
  url: string;
  object: {
    sha: string;
    type: 'commit' | 'tag' | 'blob' | 'tree';
    url: string;
  };
}

export interface GitTag {
  node_id: string;
  tag: string;
  sha: string;
  url: string;
  message: string;
  tagger: CommitAuthorSignature;
  object: {
    sha: string;
    type: 'commit' | 'tree' | 'blob';
    url: string;
  };
}

export interface GitBlob {
  content: string;
  encoding: 'base64' | 'utf-8';
  url: string;
  sha: string;
  size: number;
  node_id: string;
}

export interface IssueLabel {
  id: number;
  node_id: string;
  url: string;
  name: string;
  description: string | null;
  color: string;
  default: boolean;
}

export interface IssueMilestone {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  description: string | null;
  creator: GithubRepoOwner;
  open_issues: number;
  closed_issues: number;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  due_on: string | null;
  closed_at: string | null;
}

export interface Issue {
  id: number;
  node_id: string;
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  number: number;
  state: 'open' | 'closed';
  state_reason?: 'completed' | 'reopened' | 'not_planned' | null;
  title: string;
  body: string | null;
  user: GithubRepoOwner;
  labels: (string | IssueLabel)[];
  assignee: GithubRepoOwner | null;
  assignees: GithubRepoOwner[];
  milestone: IssueMilestone | null;
  locked: boolean;
  active_lock_reason?: string | null;
  comments: number;
  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
  };
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  author_association: string;
}

export interface IssueComment {
  id: number;
  node_id: string;
  url: string;
  html_url: string;
  body: string;
  user: GithubRepoOwner;
  created_at: string;
  updated_at: string;
  issue_url: string;
  author_association: string;
}

export interface ReleaseAsset {
  url: string;
  browser_download_url: string;
  id: number;
  node_id: string;
  name: string;
  label: string | null;
  state: 'uploaded' | 'open';
  content_type: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  uploader: GithubRepoOwner;
}

export interface Release {
  url: string;
  html_url: string;
  assets_url: string;
  upload_url: string;
  tarball_url: string | null;
  zipball_url: string | null;
  id: number;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string | null;
  author: GithubRepoOwner;
  assets: ReleaseAsset[];
}

export interface RateLimitResource {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
  resource: string;
}

export interface RateLimitInfo {
  resources: {
    core: RateLimitResource;
    search: RateLimitResource;
    graphql?: RateLimitResource;
    integration_manifest?: RateLimitResource;
    source_import?: RateLimitResource;
    code_scanning_upload?: RateLimitResource;
    actions_runner_registration?: RateLimitResource;
    scim?: RateLimitResource;
    dependency_snapshots?: RateLimitResource;
  };
  rate: RateLimitResource;
}

// ============================================================================
// SECTION 2: PARAMETER & CONFIGURATION INTERFACES
// ============================================================================

export interface GitHubApiConfig {
  baseUrl?: string;
  rawUrl?: string;
  apiVersion?: string;
  userAgent?: string;
  timeoutMs?: number;
  maxRetries?: number;
  retryBaseDelayMs?: number;
  retryMaxDelayMs?: number;
  rateLimitSafetyBuffer?: number;
  enableCache?: boolean;
  defaultCacheTtlMs?: number;
  customHeaders?: Record<string, string>;
  debugLogging?: boolean;
}

export interface RequestOptions extends Omit<RequestInit, 'headers'> {
  token?: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
  retryCount?: number;
  skipCache?: boolean;
  cacheTtlMs?: number;
  accept?: string;
  queryParams?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
}

export interface PaginationOptions {
  page?: number;
  per_page?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface CreateRepoParams {
  token: string;
  name: string;
  description?: string;
  isPrivate?: boolean;
  autoInit?: boolean;
  gitignoreTemplate?: string;
  licenseTemplate?: string;
  homepage?: string;
  hasIssues?: boolean;
  hasProjects?: boolean;
  hasWiki?: boolean;
  org?: string;
}

export interface ForkRepoParams {
  token: string;
  owner: string;
  repo: string;
  organization?: string;
  name?: string;
  defaultBranchOnly?: boolean;
}

export interface CommitFileParams {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  content: string;
  message: string;
  sha?: string;
  committer?: { name: string; email: string };
  author?: { name: string; email: string };
}

export interface BatchFileEntry {
  path: string;
  content: string;
  mode?: '100644' | '100755' | '040000' | '160000' | '120000';
  type?: 'blob' | 'tree' | 'commit';
}

export interface BatchCommitFilesParams {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  message: string;
  files: BatchFileEntry[];
  deletedPaths?: string[];
  author?: { name: string; email: string };
  committer?: { name: string; email: string };
}

export interface CreateBranchParams {
  token: string;
  owner: string;
  repo: string;
  newBranchName: string;
  baseSha: string;
}

export interface CreatePullRequestParams {
  token: string;
  owner: string;
  repo: string;
  title: string;
  body: string;
  head: string;
  base: string;
  draft?: boolean;
  maintainerCanModify?: boolean;
}

export interface MergePullRequestParams {
  token: string;
  owner: string;
  repo: string;
  pullNumber: number;
  commitTitle?: string;
  commitMessage?: string;
  sha?: string;
  mergeMethod?: 'merge' | 'squash' | 'rebase';
}

export interface CreateIssueParams {
  token: string;
  owner: string;
  repo: string;
  title: string;
  body?: string;
  assignees?: string[];
  milestone?: number;
  labels?: string[];
}

export interface CreateReleaseParams {
  token: string;
  owner: string;
  repo: string;
  tagName: string;
  targetCommitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  generateReleaseNotes?: boolean;
}

export interface SearchRepositoriesParams extends PaginationOptions {
  query: string;
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'asc' | 'desc';
}

export interface SearchCodeParams extends PaginationOptions {
  query: string;
  sort?: 'indexed';
  order?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

// ============================================================================
// SECTION 3: ERROR HANDLING & CUSTOM EXCEPTION HIERARCHY
// ============================================================================

export class GitHubServiceError extends Error {
  public readonly isGitHubServiceError = true;
  public readonly timestamp: string;

  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = 'GitHubServiceError';
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class GitHubApiError extends GitHubServiceError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly responseBody?: unknown,
    public readonly rateLimit?: Partial<RateLimitResource>,
    context?: Record<string, unknown>
  ) {
    super(`GitHub API [${status}]: ${message}`, context);
    this.name = 'GitHubApiError';
  }
}

export class GitHubAuthenticationError extends GitHubApiError {
  constructor(message = 'GitHub authentication failed or token expired', context?: Record<string, unknown>) {
    super(message, 401, null, undefined, context);
    this.name = 'GitHubAuthenticationError';
  }
}

export class GitHubNotFoundError extends GitHubApiError {
  constructor(message = 'Requested GitHub resource was not found', context?: Record<string, unknown>) {
    super(message, 404, null, undefined, context);
    this.name = 'GitHubNotFoundError';
  }
}

export class GitHubRateLimitError extends GitHubApiError {
  public readonly resetEpochSeconds: number;
  public readonly waitTimeMs: number;

  constructor(
    message = 'GitHub API rate limit exceeded',
    resetEpochSeconds: number = Math.floor(Date.now() / 1000) + 60,
    context?: Record<string, unknown>
  ) {
    super(message, 403, null, undefined, context);
    this.name = 'GitHubRateLimitError';
    this.resetEpochSeconds = resetEpochSeconds;
    const computedWait = Math.max(0, (resetEpochSeconds * 1000) - Date.now());
    this.waitTimeMs = computedWait;
  }
}

export class GitHubConflictError extends GitHubApiError {
  constructor(message = 'GitHub resource conflict or out-of-date SHA reference', context?: Record<string, unknown>) {
    super(message, 409, null, undefined, context);
    this.name = 'GitHubConflictError';
  }
}

export class GitHubValidationError extends GitHubApiError {
  constructor(message = 'GitHub API validation failed', public readonly errors?: unknown[], context?: Record<string, unknown>) {
    super(message, 422, errors, undefined, context);
    this.name = 'GitHubValidationError';
  }
}

export class GitHubNetworkError extends GitHubServiceError {
  constructor(message = 'Network error during GitHub API communication', public readonly originalError?: Error) {
    super(message, { originalMessage: originalError?.message });
    this.name = 'GitHubNetworkError';
  }
}

export class GitHubTimeoutError extends GitHubServiceError {
  constructor(message = 'GitHub API request timed out', public readonly timeoutMs?: number) {
    super(message, { timeoutMs });
    this.name = 'GitHubTimeoutError';
  }
}

// ============================================================================
// SECTION 4: UNICODE STRING TRANSCODING & UTILITIES
// ============================================================================

/**
 * Encodes a UTF-8 string to base64, preserving code points across all Unicode blocks.
 * Safe for surrogate pairs, emojis, CJK, and binary-like strings.
 */
export function utf8ToBase64(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected string input for utf8ToBase64, received ${typeof str}`);
  }
  if (typeof TextEncoder !== 'undefined' && typeof btoa !== 'undefined') {
    const encoder = new TextEncoder();
    const u8 = encoder.encode(str);
    let binary = '';
    const chunkSize = 0x8000; // 32KB chunking to prevent max call stack size errors
    for (let i = 0; i < u8.length; i += chunkSize) {
      const chunk = u8.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
    }
    return btoa(binary);
  }
  
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64');
  }

  // Fallback for legacy environments
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
}

/**
 * Decodes a base64 string back into a UTF-8 string, correctly resolving multi-byte sequences.
 */
export function base64ToUtf8(b64: string): string {
  if (typeof b64 !== 'string') {
    throw new TypeError(`Expected string input for base64ToUtf8, received ${typeof b64}`);
  }
  const cleanB64 = b64.replace(/[\r\n\s]/g, '');
  
  if (typeof TextDecoder !== 'undefined' && typeof atob !== 'undefined') {
    const binary = atob(cleanB64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8', { fatal: false, ignoreBOM: true });
    return decoder.decode(bytes);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(cleanB64, 'base64').toString('utf-8');
  }

  // Fallback
  return decodeURIComponent(
    atob(cleanB64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

/**
 * Normalizes a repository file or directory path, stripping leading and duplicate slashes.
 */
export function normalizeRepoPath(path: string): string {
  if (!path) return '';
  return path
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .replace(/\/+/g, '/');
}

/**
 * Splits a file path into its parent directory path and base file name.
 */
export function splitPath(path: string): { dir: string; name: string } {
  const normalized = normalizeRepoPath(path);
  const lastSlashIndex = normalized.lastIndexOf('/');
  if (lastSlashIndex === -1) {
    return { dir: '', name: normalized };
  }
  return {
    dir: normalized.slice(0, lastSlashIndex),
    name: normalized.slice(lastSlashIndex + 1),
  };
}

/**
 * Detects if a file path is a known binary or media asset based on extension.
 */
export function isBinaryPath(path: string): boolean {
  const binaryExtensions = new Set([
    'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'webp', 'tiff', 'svgz',
    'pdf', 'zip', 'tar', 'gz', 'bz2', 'xz', '7z', 'rar', 'dmg', 'iso',
    'exe', 'dll', 'so', 'dylib', 'bin', 'dat', 'db', 'sqlite', 'sqlite3',
    'woff', 'woff2', 'ttf', 'eot', 'otf',
    'mp4', 'webm', 'ogv', 'mov', 'avi', 'mkv', 'flv',
    'mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac',
    'pyc', 'pyo', 'pyd', 'class', 'o', 'obj', 'wasm'
  ]);
  const parts = path.split('.');
  if (parts.length <= 1) return false;
  const ext = parts[parts.length - 1].toLowerCase();
  return binaryExtensions.has(ext);
}

/**
 * Determines MIME type from a given file path extension.
 */
export function inferMimeType(filePath: string): string {
  const parts = filePath.split('.');
  if (parts.length <= 1) return 'application/octet-stream';
  const ext = parts[parts.length - 1].toLowerCase();

  const mimeMap: Record<string, string> = {
    txt: 'text/plain',
    md: 'text/markdown',
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    mjs: 'application/javascript',
    cjs: 'application/javascript',
    ts: 'application/typescript',
    tsx: 'text/typescript-jsx',
    jsx: 'text/jsx',
    json: 'application/json',
    jsonld: 'application/ld+json',
    xml: 'application/xml',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    ico: 'image/x-icon',
    pdf: 'application/pdf',
    zip: 'application/zip',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    toml: 'text/toml',
    sh: 'application/x-sh',
    py: 'text/x-python',
    rb: 'text/x-ruby',
    java: 'text/x-java-source',
    c: 'text/x-c',
    cpp: 'text/x-c++',
    go: 'text/x-go',
    rs: 'text/x-rust',
    sql: 'application/sql',
    graphql: 'application/graphql',
    env: 'text/plain',
  };

  return mimeMap[ext] || 'text/plain';
}

// ============================================================================
// SECTION 5: TREE ALGORITHMS & GRAPH CONVERTERS
// ============================================================================

/**
 * Builds a structured, recursive directory hierarchy from flat Git tree items.
 */
export function buildTreeStructure(items: GitTreeItem[]): (DirNode | FileNode)[] {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  type TempDir = {
    type: 'dir';
    path: string;
    name: string;
    sha?: string;
    children: Map<string, TempDir | FileNode>;
  };

  const rootChildren = new Map<string, TempDir | FileNode>();

  for (const item of items) {
    if (!item.path) continue;
    const normalized = normalizeRepoPath(item.path);
    if (!normalized) continue;

    const segments = normalized.split('/');
    let currentMap = rootChildren;
    let accumulatedPath = '';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;
      accumulatedPath = accumulatedPath ? `${accumulatedPath}/${segment}` : segment;

      if (isLast) {
        if (item.type === 'blob') {
          currentMap.set(segment, {
            type: 'file',
            path: item.path,
            name: segment,
            sha: item.sha,
            size: item.size,
            mode: item.mode,
            url: item.url,
          });
        } else if (item.type === 'tree') {
          if (!currentMap.has(segment)) {
            currentMap.set(segment, {
              type: 'dir',
              path: accumulatedPath,
              name: segment,
              sha: item.sha,
              children: new Map(),
            });
          } else {
            const existing = currentMap.get(segment);
            if (existing && existing.type === 'dir') {
              existing.sha = item.sha;
            }
          }
        }
      } else {
        let existingDir = currentMap.get(segment);
        if (!existingDir || existingDir.type !== 'dir') {
          existingDir = {
            type: 'dir',
            path: accumulatedPath,
            name: segment,
            children: new Map(),
          };
          currentMap.set(segment, existingDir);
        }
        currentMap = existingDir.children;
      }
    }
  }

  function finalize(map: Map<string, TempDir | FileNode>): (DirNode | FileNode)[] {
    const list: (DirNode | FileNode)[] = [];

    for (const node of map.values()) {
      if (node.type === 'dir') {
        list.push({
          type: 'dir',
          path: node.path,
          name: node.name,
          sha: node.sha,
          children: finalize(node.children),
        });
      } else {
        list.push(node);
      }
    }

    list.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    return list;
  }

  return finalize(rootChildren);
}

/**
 * Flattens a recursive tree node array back into a flat list of FileNodes.
 */
export function flattenTreeNodes(nodes: (DirNode | FileNode)[]): FileNode[] {
  const result: FileNode[] = [];
  function traverse(list: (DirNode | FileNode)[]) {
    for (const item of list) {
      if (item.type === 'file') {
        result.push(item);
      } else if (item.type === 'dir' && Array.isArray(item.children)) {
        traverse(item.children);
      }
    }
  }
  traverse(nodes);
  return result;
}

/**
 * Finds a specific node in a hierarchical directory tree by relative path.
 */
export function findNodeInTree(nodes: (DirNode | FileNode)[], targetPath: string): RepoTreeNode | null {
  const normalizedTarget = normalizeRepoPath(targetPath);
  for (const node of nodes) {
    if (normalizeRepoPath(node.path) === normalizedTarget) {
      return node;
    }
    if (node.type === 'dir' && node.children.length > 0) {
      const found = findNodeInTree(node.children, targetPath);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Maps raw GitHub items to generic FileItem domain models.
 */
export function mapGithubToFiles(
  ghItems: any[],
  parentId: string,
  owner: string,
  repoName: string
): FileItem[] {
  if (!Array.isArray(ghItems)) return [];

  return ghItems.map((item) => {
    const isRepo = Boolean(item.full_name);
    const isDir = item.type === 'dir';
    const type = (isRepo || isDir) ? FileType.FOLDER : FileType.DOCUMENT;
    const name = item.name || '';
    const extension = name.includes('.') ? name.split('.').pop() : undefined;
    const mime = (isRepo || isDir) ? undefined : inferMimeType(name);

    return {
      id: isRepo ? `repo-${item.id}` : `gh-${item.sha || Math.random().toString(36).slice(2, 11)}`,
      name,
      type,
      size: item.size ?? null,
      lastModified: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : new Date().toLocaleDateString(),
      parentId,
      source: 'github',
      githubOwner: owner,
      githubRepo: isRepo ? item.name : repoName,
      githubUrl: item.html_url || '',
      content: item.download_url || undefined,
      downloadUrl: item.download_url || undefined,
      extension,
      mimeType: mime,
      sha: item.sha,
    };
  });
}

// ============================================================================
// SECTION 6: RATE LIMITING & IN-MEMORY CACHE INFRASTRUCTURE
// ============================================================================

export class RateLimitTracker {
  private coreLimit: RateLimitResource = {
    limit: 5000,
    remaining: 5000,
    reset: Math.floor(Date.now() / 1000) + 3600,
    used: 0,
    resource: 'core',
  };

  private searchLimit: RateLimitResource = {
    limit: 30,
    remaining: 30,
    reset: Math.floor(Date.now() / 1000) + 60,
    used: 0,
    resource: 'search',
  };

  public updateFromHeaders(headers: Headers): void {
    const limitHeader = headers.get('x-ratelimit-limit');
    const remainingHeader = headers.get('x-ratelimit-remaining');
    const resetHeader = headers.get('x-ratelimit-reset');
    const usedHeader = headers.get('x-ratelimit-used');
    const resourceHeader = headers.get('x-ratelimit-resource') || 'core';

    if (limitHeader && remainingHeader && resetHeader) {
      const resourceData: RateLimitResource = {
        limit: parseInt(limitHeader, 10),
        remaining: parseInt(remainingHeader, 10),
        reset: parseInt(resetHeader, 10),
        used: usedHeader ? parseInt(usedHeader, 10) : 0,
        resource: resourceHeader,
      };

      if (resourceHeader === 'search') {
        this.searchLimit = resourceData;
      } else {
        this.coreLimit = resourceData;
      }
    }
  }

  public getStatus(resource: 'core' | 'search' = 'core'): RateLimitResource {
    return resource === 'search' ? { ...this.searchLimit } : { ...this.coreLimit };
  }

  public isThrottled(resource: 'core' | 'search' = 'core', buffer = 2): boolean {
    const status = this.getStatus(resource);
    const now = Math.floor(Date.now() / 1000);
    if (status.reset <= now) {
      return false; // Reset window has passed
    }
    return status.remaining <= buffer;
  }

  public getTimeUntilResetMs(resource: 'core' | 'search' = 'core'): number {
    const status = this.getStatus(resource);
    const nowMs = Date.now();
    const resetMs = status.reset * 1000;
    return Math.max(0, resetMs - nowMs);
  }
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  etag?: string | null;
}

export class InMemoryCache {
  private readonly store = new Map<string, CacheEntry<unknown>>();
  private readonly maxEntries: number;

  constructor(maxEntries = 500) {
    this.maxEntries = maxEntries;
  }

  public get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlMs: number, etag?: string | null): void {
    if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
      etag,
    });
  }

  public delete(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }

  public prune(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

// Global singletons for cross-call resilience
export const globalRateLimiter = new RateLimitTracker();
export const globalRequestCache = new InMemoryCache(1000);

// ============================================================================
// SECTION 7: HTTP CLIENT WITH EXPONENTIAL JITTER & RESILIENCE
// ============================================================================

export const DEFAULT_GITHUB_CONFIG: Required<GitHubApiConfig> = {
  baseUrl: 'https://api.github.com',
  rawUrl: 'https://raw.githubusercontent.com',
  apiVersion: '2022-11-28',
  userAgent: 'Enterprise-GitHub-Service-Client/3.0.0',
  timeoutMs: 30000,
  maxRetries: 3,
  retryBaseDelayMs: 1000,
  retryMaxDelayMs: 15000,
  rateLimitSafetyBuffer: 5,
  enableCache: true,
  defaultCacheTtlMs: 60000, // 1 minute default
  customHeaders: {},
  debugLogging: false,
};

/**
 * Calculates exponential backoff with full randomized jitter.
 */
export function calculateBackoffWithJitter(attempt: number, baseMs: number, maxMs: number): number {
  const exponential = Math.min(maxMs, baseMs * Math.pow(2, attempt));
  return Math.floor(Math.random() * exponential);
}

/**
 * Helper to pause execution for a given duration.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Core resilient HTTP client for interacting with the GitHub REST API.
 */
export async function githubFetch<T>(
  endpoint: string,
  token?: string,
  options: RequestOptions = {},
  config: GitHubApiConfig = {}
): Promise<T> {
  const mergedConfig: Required<GitHubApiConfig> = {
    ...DEFAULT_GITHUB_CONFIG,
    ...config,
  };

  const isFullUrl = endpoint.startsWith('http://') || endpoint.startsWith('https://');
  const baseUrl = mergedConfig.baseUrl.replace(/\/+$/, '');
  const urlPath = isFullUrl ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Build query string
  let finalUrl = urlPath;
  if (options.queryParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.queryParams)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }
    const queryString = params.toString();
    if (queryString) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString;
    }
  }

  const method = (options.method || 'GET').toUpperCase();
  const isCacheable = method === 'GET' && mergedConfig.enableCache && !options.skipCache;
  const cacheKey = `${token ? 'auth' : 'anon'}:${finalUrl}:${options.accept || 'default'}`;

  if (isCacheable) {
    const cached = globalRequestCache.get<T>(cacheKey);
    if (cached !== null) {
      if (mergedConfig.debugLogging) {
        console.debug(`[githubService:cache-hit] ${finalUrl}`);
      }
      return cached;
    }
  }

  // Pre-flight Rate Limit Throttling check
  const isSearch = finalUrl.includes('/search/');
  const resourceType = isSearch ? 'search' : 'core';
  if (globalRateLimiter.isThrottled(resourceType, mergedConfig.rateLimitSafetyBuffer)) {
    const waitMs = globalRateLimiter.getTimeUntilResetMs(resourceType);
    if (waitMs > 0 && waitMs <= 10000) {
      if (mergedConfig.debugLogging) {
        console.warn(`[githubService:throttle] Pre-flight delay of ${waitMs}ms before hitting ${finalUrl}`);
      }
      await sleep(waitMs + 100);
    }
  }

  let attempt = 0;
  const maxRetries = options.retryCount ?? mergedConfig.maxRetries;

  while (attempt <= maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timeoutDuration = options.timeoutMs || mergedConfig.timeoutMs;
    const timeoutTimer = setTimeout(() => controller.abort(), timeoutDuration);

    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    const headers: Record<string, string> = {
      Accept: options.accept || 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': mergedConfig.apiVersion,
      'User-Agent': mergedConfig.userAgent,
      ...mergedConfig.customHeaders,
      ...options.headers,
    };

    if (token) {
      headers.Authorization = token.startsWith('Bearer ') || token.startsWith('token ') ? token : `Bearer ${token}`;
    }

    try {
      if (mergedConfig.debugLogging) {
        console.debug(`[githubService:fetch] ${method} ${finalUrl} (attempt ${attempt}/${maxRetries + 1})`);
      }

      const response = await fetch(finalUrl, {
        ...options,
        method,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutTimer);
      globalRateLimiter.updateFromHeaders(response.headers);

      // Handle 204 No Content & 201 Created without body
      if (response.status === 204 || (response.status === 201 && response.headers.get('content-length') === '0')) {
        return null as unknown as T;
      }

      // Handle raw string payloads
      const acceptHeader = headers.Accept || '';
      const isRawRequest = acceptHeader.includes('application/vnd.github.v3.raw') ||
                           acceptHeader.includes('application/vnd.github.raw') ||
                           acceptHeader.includes('text/plain');

      if (!response.ok) {
        let errorData: any = null;
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: 'Unable to parse JSON error payload' };
          }
        } else {
          try {
            const rawText = await response.text();
            errorData = { message: rawText };
          } catch {
            errorData = { message: `HTTP Error ${response.status}` };
          }
        }

        const errorMessage = errorData?.message || `GitHub request failed with HTTP ${response.status}`;

        // Specialized Error Dispatch
        if (response.status === 401 || response.status === 403 && errorMessage.toLowerCase().includes('bad credentials')) {
          throw new GitHubAuthenticationError(errorMessage, { endpoint: finalUrl, status: response.status });
        }

        if (response.status === 404) {
          throw new GitHubNotFoundError(errorMessage, { endpoint: finalUrl, status: 404 });
        }

        if (response.status === 409) {
          throw new GitHubConflictError(errorMessage, { endpoint: finalUrl, status: 409 });
        }

        if (response.status === 422) {
          throw new GitHubValidationError(errorMessage, errorData?.errors, { endpoint: finalUrl, status: 422 });
        }

        if (response.status === 403 || response.status === 429) {
          const resetHeader = response.headers.get('x-ratelimit-reset');
          const resetEpoch = resetHeader ? parseInt(resetHeader, 10) : Math.floor(Date.now() / 1000) + 60;
          const isRateLimit = response.headers.get('x-ratelimit-remaining') === '0' ||
                              errorMessage.toLowerCase().includes('rate limit') ||
                              errorMessage.toLowerCase().includes('secondary rate limit');

          if (isRateLimit) {
            if (attempt <= maxRetries) {
              const retryAfterHeader = response.headers.get('retry-after');
              const waitMs = retryAfterHeader
                ? parseInt(retryAfterHeader, 10) * 1000
                : calculateBackoffWithJitter(attempt, mergedConfig.retryBaseDelayMs * 2, mergedConfig.retryMaxDelayMs);

              if (mergedConfig.debugLogging) {
                console.warn(`[githubService:rate-limit-retry] Backing off for ${waitMs}ms before retrying...`);
              }
              await sleep(waitMs);
              continue;
            }
            throw new GitHubRateLimitError(errorMessage, resetEpoch, { endpoint: finalUrl });
          }
        }

        // Retry on 5xx Server Errors
        if (response.status >= 500 && attempt <= maxRetries) {
          const waitMs = calculateBackoffWithJitter(attempt, mergedConfig.retryBaseDelayMs, mergedConfig.retryMaxDelayMs);
          if (mergedConfig.debugLogging) {
            console.warn(`[githubService:server-error-retry] HTTP ${response.status}, retrying in ${waitMs}ms...`);
          }
          await sleep(waitMs);
          continue;
        }

        throw new GitHubApiError(errorMessage, response.status, errorData, undefined, { endpoint: finalUrl });
      }

      let parsedData: T;
      if (isRawRequest) {
        parsedData = (await response.text()) as unknown as T;
      } else {
        const ct = response.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          parsedData = (await response.json()) as T;
        } else {
          parsedData = (await response.text()) as unknown as T;
        }
      }

      if (isCacheable) {
        const ttl = options.cacheTtlMs ?? mergedConfig.defaultCacheTtlMs;
        const etag = response.headers.get('etag');
        globalRequestCache.set(cacheKey, parsedData, ttl, etag);
      }

      return parsedData;
    } catch (err: any) {
      clearTimeout(timeoutTimer);

      if (err instanceof GitHubServiceError) {
        throw err;
      }

      if (err.name === 'AbortError') {
        if (options.signal?.aborted) {
          throw new GitHubServiceError('GitHub request was explicitly aborted', { endpoint: finalUrl });
        }
        if (attempt <= maxRetries) {
          const waitMs = calculateBackoffWithJitter(attempt, mergedConfig.retryBaseDelayMs, mergedConfig.retryMaxDelayMs);
          await sleep(waitMs);
          continue;
        }
        throw new GitHubTimeoutError(`GitHub request timed out after ${timeoutDuration}ms`, timeoutDuration);
      }

      // Retry network-level exceptions
      if (attempt <= maxRetries) {
        const waitMs = calculateBackoffWithJitter(attempt, mergedConfig.retryBaseDelayMs, mergedConfig.retryMaxDelayMs);
        if (mergedConfig.debugLogging) {
          console.warn(`[githubService:network-retry] ${err.message || 'Network failure'}, retrying in ${waitMs}ms...`);
        }
        await sleep(waitMs);
        continue;
      }

      throw new GitHubNetworkError(`GitHub network request failed: ${err.message || 'Unknown network error'}`, err);
    }
  }

  throw new GitHubServiceError(`GitHub request exceeded maximum retry attempts (${maxRetries})`);
}

// ============================================================================
// SECTION 8: PAGINATION ENGINE & ASYNC ITERATORS
// ============================================================================

/**
 * Automatically pages through GitHub paginated endpoints until all records are collected.
 */
export async function fetchAllPages<T>(
  endpoint: string,
  token?: string,
  options: RequestOptions = {},
  maxTotalItems = 5000
): Promise<T[]> {
  const perPage = options.queryParams?.per_page ? Number(options.queryParams.per_page) : 100;
  let page = options.queryParams?.page ? Number(options.queryParams.page) : 1;
  const results: T[] = [];

  while (results.length < maxTotalItems) {
    const pageParams = {
      ...options.queryParams,
      per_page: perPage,
      page,
    };

    let pageData: T[];
    try {
      pageData = await githubFetch<T[]>(endpoint, token, {
        ...options,
        queryParams: pageParams,
      });
    } catch (error: any) {
      if (results.length > 0) {
        console.warn(`[githubService:fetchAllPages] Partial fetch stopped on page ${page}:`, error.message);
        break;
      }
      throw error;
    }

    if (!Array.isArray(pageData) || pageData.length === 0) {
      break;
    }

    results.push(...pageData);

    if (pageData.length < perPage) {
      break;
    }

    page++;
  }

  return results.slice(0, maxTotalItems);
}

/**
 * Async generator that yields pages on-demand for memory-efficient processing of huge datasets.
 */
export async function* paginateGenerator<T>(
  endpoint: string,
  token?: string,
  options: RequestOptions = {}
): AsyncGenerator<T[], void, unknown> {
  const perPage = options.queryParams?.per_page ? Number(options.queryParams.per_page) : 100;
  let page = options.queryParams?.page ? Number(options.queryParams.page) : 1;

  while (true) {
    const pageParams = {
      ...options.queryParams,
      per_page: perPage,
      page,
    };

    const pageData = await githubFetch<T[]>(endpoint, token, {
      ...options,
      queryParams: pageParams,
    });

    if (!Array.isArray(pageData) || pageData.length === 0) {
      return;
    }

    yield pageData;

    if (pageData.length < perPage) {
      return;
    }

    page++;
  }
}// ============================================================================
// SECTION 9: REPOSITORY OPERATIONS & LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Fetches all repositories accessible to the authenticated user or public profile.
 * Supports filtering by repository affiliation and sorting metrics.
 *
 * @param token - Optional GitHub personal access token or fine-grained PAT.
 * @param type - Affiliation filter: 'all' (default), 'owner', 'public', 'private', or 'member'.
 * @param sort - Sorting order: 'created', 'updated' (default), 'pushed', or 'full_name'.
 * @param direction - Direction of sorting: 'asc' or 'desc'.
 * @returns Array of repository domain objects.
 */
export async function fetchAllRepos(
  token?: string,
  type: 'all' | 'owner' | 'public' | 'private' | 'member' = 'owner',
  sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'updated',
  direction: 'asc' | 'desc' = 'desc'
): Promise<GithubRepo[]> {
  const endpoint = token ? '/user/repos' : '/repositories';
  return fetchAllPages<GithubRepo>(
    endpoint,
    token,
    {
      queryParams: {
        type: token ? type : undefined,
        sort,
        direction,
        per_page: 100,
      },
    },
    2000
  );
}

/**
 * Fetches publicly available repositories owned by a specific username.
 *
 * @param username - GitHub login username.
 * @param sort - Sorting criteria ('created', 'updated', 'pushed', 'full_name').
 * @param perPage - Items per page request.
 * @returns Array of repository metadata objects.
 */
export async function fetchUserRepos(
  username: string,
  sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'updated',
  perPage = 100
): Promise<GithubRepo[]> {
  if (!username || typeof username !== 'string') {
    throw new GitHubValidationError('Invalid username parameter provided to fetchUserRepos');
  }

  const cleanUsername = encodeURIComponent(username.trim());
  return fetchAllPages<GithubRepo>(
    `/users/${cleanUsername}/repos`,
    undefined,
    {
      queryParams: {
        sort,
        direction: 'desc',
        per_page: Math.min(100, Math.max(1, perPage)),
      },
    },
    1000
  );
}

/**
 * Fetches all repositories owned by a specified GitHub Organization.
 *
 * @param org - GitHub organization name.
 * @param token - Optional authentication token.
 * @param type - Org repo category filter ('all', 'public', 'private', 'forks', 'sources', 'member').
 * @returns Array of organization repositories.
 */
export async function fetchOrgRepos(
  org: string,
  token?: string,
  type: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member' = 'all'
): Promise<GithubRepo[]> {
  if (!org || typeof org !== 'string') {
    throw new GitHubValidationError('Invalid organization parameter provided to fetchOrgRepos');
  }

  const cleanOrg = encodeURIComponent(org.trim());
  return fetchAllPages<GithubRepo>(
    `/orgs/${cleanOrg}/repos`,
    token,
    {
      queryParams: {
        type,
        per_page: 100,
      },
    },
    2000
  );
}

/**
 * Retrieves comprehensive metadata for a specific repository.
 *
 * @param owner - Repository owner login handle.
 * @param repo - Repository slug identifier.
 * @param token - Optional authentication token.
 * @returns Full GitHubRepo domain representation.
 */
export async function getRepoDetails(
  owner: string,
  repo: string,
  token?: string
): Promise<GithubRepo> {
  if (!owner || !repo) {
    throw new GitHubValidationError('Repository owner and repo name are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<GithubRepo>(`/repos/${cleanOwner}/${cleanRepo}`, token, {
    cacheTtlMs: 60000,
  });
}

/**
 * Creates a brand new GitHub repository for the authenticated user or an organization.
 * Automatically handles initializing with a default README and template settings.
 *
 * @param params - Configuration parameters for creating the repository.
 * @returns The newly provisioned GitHubRepo entity.
 */
export async function createRepo({
  token,
  name,
  description = '',
  isPrivate = false,
  autoInit = true,
  gitignoreTemplate,
  licenseTemplate,
  homepage,
  hasIssues = true,
  hasProjects = true,
  hasWiki = true,
  org,
}: CreateRepoParams): Promise<GithubRepo> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a repository');
  }
  if (!name || typeof name !== 'string') {
    throw new GitHubValidationError('A valid repository name is required');
  }

  const payload: Record<string, unknown> = {
    name: name.trim(),
    description: description.trim(),
    private: Boolean(isPrivate),
    auto_init: Boolean(autoInit),
    has_issues: Boolean(hasIssues),
    has_projects: Boolean(hasProjects),
    has_wiki: Boolean(hasWiki),
  };

  if (gitignoreTemplate) payload.gitignore_template = gitignoreTemplate;
  if (licenseTemplate) payload.license_template = licenseTemplate;
  if (homepage) payload.homepage = homepage;

  const endpoint = org ? `/orgs/${encodeURIComponent(org.trim())}/repos` : '/user/repos';

  return githubFetch<GithubRepo>(endpoint, token, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Updates settings and metadata for an existing repository.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param updates - Partial fields to update on the repository.
 * @param token - GitHub authentication token with administration privileges.
 * @returns Updated GitHubRepo instance.
 */
export async function updateRepo(
  owner: string,
  repo: string,
  updates: Partial<{
    name: string;
    description: string;
    homepage: string;
    private: boolean;
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    default_branch: string;
    allow_squash_merge: boolean;
    allow_merge_commit: boolean;
    allow_rebase_merge: boolean;
    allow_auto_merge: boolean;
    delete_branch_on_merge: boolean;
    archived: boolean;
  }>,
  token: string
): Promise<GithubRepo> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update repository settings');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<GithubRepo>(`/repos/${cleanOwner}/${cleanRepo}`, token, {
    method: 'PATCH',
    body: JSON.stringify(updates),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Permanently deletes a repository. Requires admin authorization.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param token - GitHub authentication token with 'delete_repo' scope.
 */
export async function deleteRepo(
  owner: string,
  repo: string,
  token: string
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a repository');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(`/repos/${cleanOwner}/${cleanRepo}`, token, {
    method: 'DELETE',
  });
}

/**
 * Creates a fork of a given repository into the authenticated user's namespace or organization.
 *
 * @param params - Fork configuration parameters.
 * @returns The newly spawned fork GitHubRepo entity.
 */
export async function forkRepo({
  token,
  owner,
  repo,
  organization,
  name,
  defaultBranchOnly = false,
}: ForkRepoParams): Promise<GithubRepo> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to fork a repository');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const payload: Record<string, unknown> = {
    default_branch_only: defaultBranchOnly,
  };

  if (organization) payload.organization = organization.trim();
  if (name) payload.name = name.trim();

  return githubFetch<GithubRepo>(`/repos/${cleanOwner}/${cleanRepo}/forks`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Lists all active forks of a repository.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param token - Optional authentication token.
 * @returns Array of fork repositories.
 */
export async function listForks(
  owner: string,
  repo: string,
  token?: string
): Promise<GithubRepo[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<GithubRepo>(`/repos/${cleanOwner}/${cleanRepo}/forks`, token, {
    queryParams: { per_page: 100 },
  });
}

/**
 * Checks whether a specific user is an active collaborator on a repository.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param username - Username to verify.
 * @param token - GitHub authentication token with push/admin rights.
 * @returns Boolean representing collaboration status.
 */
export async function checkRepoCollaborator(
  owner: string,
  repo: string,
  username: string,
  token: string
): Promise<boolean> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanUser = encodeURIComponent(username.trim());

  try {
    await githubFetch<null>(`/repos/${cleanOwner}/${cleanRepo}/collaborators/${cleanUser}`, token, {
      method: 'GET',
    });
    return true;
  } catch (error) {
    if (error instanceof GitHubNotFoundError) {
      return false;
    }
    throw error;
  }
}

/**
 * Retrieves the topic tags associated with a repository.
 *
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param token - Optional authentication token.
 * @returns Array of topic strings.
 */
export async function getRepoTopics(
  owner: string,
  repo: string,
  token?: string
): Promise<string[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const response = await githubFetch<{ names: string[] }>(
    `/repos/${cleanOwner}/${cleanRepo}/topics`,
    token,
    {
      accept: 'application/vnd.github.mercy-preview+json',
      cacheTtlMs: 120000,
    }
  );

  return response?.names || [];
}

/**
 * Updates or replaces the complete list of repository topic tags.
 *
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param topics - Array of topic string tags (must be lowercase alphanumeric + hyphen).
 * @param token - GitHub authentication token.
 * @returns Updated array of topic tags.
 */
export async function setRepoTopics(
  owner: string,
  repo: string,
  topics: string[],
  token: string
): Promise<string[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to set repository topics');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const sanitizedTopics = topics.map((t) => t.toLowerCase().trim().replace(/[^a-z0-9-]/g, ''));

  const response = await githubFetch<{ names: string[] }>(
    `/repos/${cleanOwner}/${cleanRepo}/topics`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify({ names: sanitizedTopics }),
      headers: {
        'Content-Type': 'application/json',
      },
      accept: 'application/vnd.github.mercy-preview+json',
    }
  );

  return response?.names || [];
}

/**
 * Retrieves programming language distribution statistics for a repository.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param token - Optional authentication token.
 * @returns Mapping of language names to code byte counts.
 */
export async function getRepoLanguages(
  owner: string,
  repo: string,
  token?: string
): Promise<Record<string, number>> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<Record<string, number>>(`/repos/${cleanOwner}/${cleanRepo}/languages`, token, {
    cacheTtlMs: 300000,
  });
}

/**
 * Retrieves and automatically decodes the repository README file.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param branch - Optional specific branch or ref to pull README from.
 * @param token - Optional authentication token.
 * @returns Object with parsed UTF-8 content, path, and commit SHA.
 */
export async function getRepoReadme(
  owner: string,
  repo: string,
  branch?: string,
  token?: string
): Promise<{ content: string; path: string; sha: string }> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const queryParams: Record<string, string> = {};
  if (branch) queryParams.ref = branch;

  const data = await githubFetch<{
    name: string;
    path: string;
    sha: string;
    content?: string;
    encoding?: string;
  }>(`/repos/${cleanOwner}/${cleanRepo}/readme`, token, {
    queryParams,
  });

  let decodedContent = '';
  if (data.content) {
    decodedContent = data.encoding === 'base64' ? base64ToUtf8(data.content) : data.content;
  }

  return {
    content: decodedContent,
    path: data.path,
    sha: data.sha,
  };
}

// ============================================================================
// SECTION 10: GIT TREES, BLOB ENGINE & CONTENT RETRIEVAL
// ============================================================================

/**
 * Fetches the flat Git tree array for a repository at a specific branch or commit SHA.
 * By default requests recursive trees to capture complete directory hierarchies in a single HTTP call.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param branchOrSha - Branch name, tag, or full commit SHA.
 * @param recursive - Whether to recursively resolve child trees. Defaults to true.
 * @returns Array of flat GitTreeItem records.
 */
export async function fetchFlatRepoTree(
  token: string | undefined,
  owner: string,
  repo: string,
  branchOrSha: string,
  recursive = true
): Promise<GitTreeItem[]> {
  if (!owner || !repo || !branchOrSha) {
    throw new GitHubValidationError('Owner, repo, and branchOrSha parameters are mandatory');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanRef = encodeURIComponent(branchOrSha.trim());

  const queryParams: Record<string, string | number> = {};
  if (recursive) {
    queryParams.recursive = 1;
  }

  const response = await githubFetch<GitTreeResponse>(
    `/repos/${cleanOwner}/${cleanRepo}/git/trees/${cleanRef}`,
    token,
    {
      queryParams,
      cacheTtlMs: 30000,
    }
  );

  if (!response || !Array.isArray(response.tree)) {
    return [];
  }

  return response.tree;
}

/**
 * Fetches the Git Tree and converts it directly into a structured, sorted hierarchical node tree.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param branchOrSha - Branch name, tag, or commit SHA.
 * @returns Sorted nested directory and file structure.
 */
export async function fetchRepoTree(
  token: string | undefined,
  owner: string,
  repo: string,
  branchOrSha: string
): Promise<(DirNode | FileNode)[]> {
  const flatItems = await fetchFlatRepoTree(token, owner, repo, branchOrSha, true);
  return buildTreeStructure(flatItems);
}

/**
 * Retrieves raw metadata and/or direct contents of a specific file or directory.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param path - Relative repository file or directory path.
 * @param branch - Optional branch/ref.
 * @param token - Optional authentication token.
 * @returns GithubFile or Array of GithubFiles if target is a directory.
 */
export async function getRepoContents(
  owner: string,
  repo: string,
  path = '',
  branch?: string,
  token?: string
): Promise<GithubFile | GithubFile[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanPath = normalizeRepoPath(path);

  const queryParams: Record<string, string> = {};
  if (branch) queryParams.ref = branch;

  return githubFetch<GithubFile | GithubFile[]>(
    `/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}`,
    token,
    {
      queryParams,
      cacheTtlMs: 20000,
    }
  );
}

/**
 * Recursively scans a repository and returns an array of all code/document files,
 * filtering out large binaries and media files by default.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param branch - Target branch (defaults to default branch or 'main').
 * @param token - Optional authentication token.
 * @param filterBinary - Whether to exclude binary assets. Defaults to true.
 * @returns Array of flat GithubFile descriptors.
 */
export async function getAllRepoFilesRecursively(
  owner: string,
  repo: string,
  branch?: string,
  token?: string,
  filterBinary = true
): Promise<GithubFile[]> {
  try {
    let targetBranch = branch;
    if (!targetBranch) {
      const details = await getRepoDetails(owner, repo, token);
      targetBranch = details.default_branch || 'main';
    }

    const flatTree = await fetchFlatRepoTree(token, owner, repo, targetBranch, true);
    const rawUrlBase = DEFAULT_GITHUB_CONFIG.rawUrl;

    const filesOnly = flatTree.filter((item) => item.type === 'blob');
    const eligibleFiles = filterBinary
      ? filesOnly.filter((item) => !isBinaryPath(item.path))
      : filesOnly;

    return eligibleFiles.map((item) => {
      const { name } = splitPath(item.path);
      return {
        name,
        path: item.path,
        type: 'file' as const,
        download_url: `${rawUrlBase}/${owner}/${repo}/${targetBranch}/${item.path}`,
        size: item.size || 0,
        sha: item.sha,
        git_url: item.url,
      };
    });
  } catch (error) {
    console.warn(`[githubService:getAllRepoFilesRecursively] Fallback to contents API due to:`, error);
    const contents = await getRepoContents(owner, repo, '', branch, token);
    return Array.isArray(contents) ? contents : [contents];
  }
}

/**
 * Fetches a single file's content by path and decodes it safely from Base64 into a UTF-8 string.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param path - Relative repository file path.
 * @param branch - Branch or commit SHA reference.
 * @returns Object containing decoded text content, SHA, size, and encoding.
 */
export async function getFileContent(
  token: string | undefined,
  owner: string,
  repo: string,
  path: string,
  branch?: string
): Promise<{ path: string; content: string; sha: string; size: number; encoding: string }> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanPath = normalizeRepoPath(path);

  const queryParams: Record<string, string> = {};
  if (branch) queryParams.ref = branch;

  const data = await githubFetch<{
    path: string;
    content?: string;
    encoding?: string;
    sha: string;
    size: number;
    download_url?: string;
  }>(`/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}`, token, {
    queryParams,
  });

  let decodedContent = '';
  if (data.content) {
    decodedContent = data.encoding === 'base64' ? base64ToUtf8(data.content) : data.content;
  } else if (data.download_url) {
    decodedContent = await getRawFileContent(data.download_url, token);
  }

  return {
    path: data.path || cleanPath,
    content: decodedContent,
    sha: data.sha,
    size: data.size || 0,
    encoding: data.encoding || 'utf-8',
  };
}

/**
 * Fetches raw plain-text content from any raw GitHub URL or raw endpoint.
 *
 * @param downloadUrlOrRawUrl - Full URL string targeting raw content.
 * @param token - Optional authentication token for private repositories.
 * @returns Textual content of the file.
 */
export async function getRawFileContent(
  downloadUrlOrRawUrl: string,
  token?: string
): Promise<string> {
  if (!downloadUrlOrRawUrl) return '';

  return githubFetch<string>(downloadUrlOrRawUrl, token, {
    accept: 'application/vnd.github.v3.raw, text/plain, */*',
  });
}

/**
 * Compatibility alias for getRawFileContent.
 */
export async function fetchRawGithubContent(downloadUrl: string): Promise<string> {
  try {
    return await getRawFileContent(downloadUrl);
  } catch {
    return 'Failed to load file content.';
  }
}

/**
 * Fetches a raw Git Blob by its Git SHA hash from the Git Database API.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param fileSha - The 40-character SHA of the blob.
 * @param token - Optional authentication token.
 * @returns GitBlob object with Base64 payload.
 */
export async function getBlob(
  owner: string,
  repo: string,
  fileSha: string,
  token?: string
): Promise<GitBlob> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanSha = encodeURIComponent(fileSha.trim());

  return githubFetch<GitBlob>(
    `/repos/${cleanOwner}/${cleanRepo}/git/blobs/${cleanSha}`,
    token,
    {
      cacheTtlMs: 300000,
    }
  );
}

/**
 * Creates a new Git Blob on the GitHub Git Database without modifying any trees or references.
 *
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param content - String content to store in the blob.
 * @param encoding - 'utf-8' or 'base64'.
 * @param token - Authentication token with write access.
 * @returns Object with the newly computed blob SHA and URL.
 */
export async function createBlob(
  owner: string,
  repo: string,
  content: string,
  encoding: 'utf-8' | 'base64' = 'utf-8',
  token: string
): Promise<{ sha: string; url: string }> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a Git blob');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const encodedContent = encoding === 'utf-8' ? utf8ToBase64(content) : content;

  return githubFetch<{ sha: string; url: string }>(
    `/repos/${cleanOwner}/${cleanRepo}/git/blobs`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        content: encodedContent,
        encoding: 'base64',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}// ============================================================================
// SECTION 11: BRANCHING, GIT REFERENCES & TAG MANAGEMENT
// ============================================================================

/**
 * Retrieves all branches for a given repository with pagination support.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param protectedOnly - Whether to filter for protected branches only.
 * @returns Array of Branch domain models.
 */
export async function getRepoBranches(
  token: string | undefined,
  owner: string,
  repo: string,
  protectedOnly = false
): Promise<Branch[]> {
  if (!owner || !repo) {
    throw new GitHubValidationError('Owner and repo are required to list branches');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<Branch>(
    `/repos/${cleanOwner}/${cleanRepo}/branches`,
    token,
    {
      queryParams: {
        protected: protectedOnly ? 'true' : undefined,
        per_page: 100,
      },
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Fetches comprehensive branch metadata including latest commit SHA and branch protection rules.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param branch - Branch name identifier.
 * @returns Branch metadata details.
 */
export async function getBranch(
  token: string | undefined,
  owner: string,
  repo: string,
  branch: string
): Promise<Branch> {
  if (!owner || !repo || !branch) {
    throw new GitHubValidationError('Owner, repo, and branch parameters are mandatory');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanBranch = encodeURIComponent(branch.trim());

  return githubFetch<Branch>(
    `/repos/${cleanOwner}/${cleanRepo}/branches/${cleanBranch}`,
    token,
    {
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Creates a new branch reference in the target repository pointing to a base commit SHA.
 *
 * @param params - Configuration parameters for branch creation.
 * @returns The newly created GitReference entity.
 */
export async function createBranch({
  token,
  owner,
  repo,
  newBranchName,
  baseSha,
}: CreateBranchParams): Promise<GitReference> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a branch');
  }
  if (!owner || !repo || !newBranchName || !baseSha) {
    throw new GitHubValidationError('Missing required parameters for createBranch');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const sanitizedBranch = newBranchName.trim().replace(/^refs\/heads\//, '');

  const payload = {
    ref: `refs/heads/${sanitizedBranch}`,
    sha: baseSha.trim(),
  };

  return githubFetch<GitReference>(
    `/repos/${cleanOwner}/${cleanRepo}/git/refs`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Deletes a branch reference from the target repository.
 *
 * @param token - Authentication token with write access.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param branch - Branch name to delete.
 */
export async function deleteBranch(
  token: string,
  owner: string,
  repo: string,
  branch: string
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a branch');
  }
  if (!owner || !repo || !branch) {
    throw new GitHubValidationError('Owner, repo, and branch parameters are mandatory for deleteBranch');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const sanitizedBranch = encodeURIComponent(branch.trim().replace(/^heads\//, '').replace(/^refs\/heads\//, ''));

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/git/refs/heads/${sanitizedBranch}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Retrieves a Git Reference by its full reference path (e.g. "heads/main" or "tags/v1.0.0").
 *
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param ref - Ref path starting after "refs/".
 * @param token - Optional authentication token.
 * @returns GitReference domain representation.
 */
export async function getGitReference(
  owner: string,
  repo: string,
  ref: string,
  token?: string
): Promise<GitReference> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanRef = ref.trim().replace(/^refs\//, '');

  return githubFetch<GitReference>(
    `/repos/${cleanOwner}/${cleanRepo}/git/ref/${cleanRef}`,
    token,
    {
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Updates an existing Git reference to point to a new commit SHA, with optional forced update.
 *
 * @param token - Authentication token with write access.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param ref - Ref path (e.g. "heads/main").
 * @param newSha - The 40-character target commit SHA.
 * @param force - Whether to force the ref update (force-push semantics).
 * @returns Updated GitReference record.
 */
export async function updateGitReference(
  token: string,
  owner: string,
  repo: string,
  ref: string,
  newSha: string,
  force = false
): Promise<GitReference> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update a reference');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanRef = ref.trim().replace(/^refs\//, '');

  return githubFetch<GitReference>(
    `/repos/${cleanOwner}/${cleanRepo}/git/refs/${cleanRef}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify({
        sha: newSha.trim(),
        force,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Lists all git tags for a repository.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param token - Optional authentication token.
 * @returns Array of tag references.
 */
export async function listTags(
  owner: string,
  repo: string,
  token?: string
): Promise<Array<{ name: string; commit: { sha: string; url: string }; zipball_url: string; tarball_url: string; node_id: string }>> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages(
    `/repos/${cleanOwner}/${cleanRepo}/tags`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 60000,
    }
  );
}

/**
 * Creates an annotated Git Tag object in the Git database and sets the ref pointer.
 *
 * @param token - Authentication token with write permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param tag - Tag name string (e.g., 'v1.0.0').
 * @param message - Annotation message.
 * @param objectSha - Target commit SHA being tagged.
 * @param tagger - Optional author signature details.
 * @returns Created GitTag domain record.
 */
export async function createAnnotatedTag(
  token: string,
  owner: string,
  repo: string,
  tag: string,
  message: string,
  objectSha: string,
  tagger?: { name: string; email: string; date?: string }
): Promise<GitTag> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a Git tag');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const tagPayload = {
    tag: tag.trim(),
    message: message.trim(),
    object: objectSha.trim(),
    type: 'commit',
    tagger: tagger ? {
      name: tagger.name,
      email: tagger.email,
      date: tagger.date || new Date().toISOString(),
    } : undefined,
  };

  const createdTag = await githubFetch<GitTag>(
    `/repos/${cleanOwner}/${cleanRepo}/git/tags`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(tagPayload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  // Create the tag reference pointer refs/tags/<tagName>
  await githubFetch<GitReference>(
    `/repos/${cleanOwner}/${cleanRepo}/git/refs`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/tags/${tag.trim()}`,
        sha: createdTag.sha,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return createdTag;
}

// ============================================================================
// SECTION 12: COMMIT MUTATIONS, HISTORY & BATCH TRANSACTIONS
// ============================================================================

/**
 * Commits a single file directly via the GitHub Contents API with automated Base64 encoding.
 * Automatically fetches the latest file SHA to avoid conflict if not explicitly provided.
 *
 * @param params - File commit details and optional previous blob SHA.
 * @returns The SHA of the newly created or updated file commit.
 */
export async function commitFile({
  token,
  owner,
  repo,
  branch,
  path,
  content,
  message,
  sha,
  committer,
  author,
}: CommitFileParams): Promise<string> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to commit a file');
  }
  if (!owner || !repo || !branch || !path) {
    throw new GitHubValidationError('Owner, repo, branch, and path are required to commit a file');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanPath = normalizeRepoPath(path);

  let targetSha = sha;
  if (!targetSha) {
    try {
      const existing = await getFileContent(token, owner, repo, cleanPath, branch);
      if (existing && existing.sha) {
        targetSha = existing.sha;
      }
    } catch (error) {
      if (!(error instanceof GitHubNotFoundError)) {
        console.warn(`[githubService:commitFile] Could not query existing file SHA:`, error);
      }
    }
  }

  const payload: Record<string, unknown> = {
    message: message || `Update ${cleanPath}`,
    content: utf8ToBase64(content),
    branch: branch.trim(),
  };

  if (targetSha) {
    payload.sha = targetSha;
  }
  if (committer) {
    payload.committer = committer;
  }
  if (author) {
    payload.author = author;
  }

  const result = await githubFetch<{
    content: { sha: string; path: string };
    commit: { sha: string; message: string };
  }>(`/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return result.content?.sha || result.commit?.sha;
}

/**
 * Deletes a single file from a repository branch via the Contents API.
 *
 * @param token - Authentication token with write access.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param path - Relative repository file path.
 * @param message - Commit message for the deletion.
 * @param branch - Target branch name.
 * @param sha - Optional SHA of the file to delete (will be resolved if omitted).
 * @returns The SHA of the deletion commit.
 */
export async function deleteFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  message: string,
  branch: string,
  sha?: string
): Promise<string> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a file');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanPath = normalizeRepoPath(path);

  let targetSha = sha;
  if (!targetSha) {
    const existing = await getFileContent(token, owner, repo, cleanPath, branch);
    targetSha = existing.sha;
  }

  const payload = {
    message: message || `Delete ${cleanPath}`,
    sha: targetSha,
    branch: branch.trim(),
  };

  const result = await githubFetch<{ commit: { sha: string } }>(
    `/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}`,
    token,
    {
      method: 'DELETE',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return result.commit.sha;
}

/**
 * High-performance, atomic batch file committer using the low-level Git Data API.
 * Modifies, adds, and removes multiple files across deep directories in a single atomic Git commit,
 * completely avoiding race conditions and intermediate broken commit states.
 *
 * @param params - Batch files, deletions, branch, and commit author specifications.
 * @returns The SHA of the new atomic commit.
 */
export async function batchCommitFiles({
  token,
  owner,
  repo,
  branch,
  message,
  files,
  deletedPaths = [],
  author,
  committer,
}: BatchCommitFilesParams): Promise<string> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to execute batch commits');
  }
  if (!files || (files.length === 0 && deletedPaths.length === 0)) {
    throw new GitHubValidationError('No file additions, updates, or deletions provided for batch commit');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanBranch = branch.trim().replace(/^refs\/heads\//, '');

  // 1. Fetch current branch reference to obtain head commit SHA
  const branchRef = await getGitReference(owner, repo, `heads/${cleanBranch}`, token);
  const parentCommitSha = branchRef.object.sha;

  // 2. Fetch parent commit to extract its base tree SHA
  const parentCommit = await githubFetch<{ tree: { sha: string } }>(
    `/repos/${cleanOwner}/${cleanRepo}/git/commits/${parentCommitSha}`,
    token
  );
  const baseTreeSha = parentCommit.tree.sha;

  // 3. Create Git Blobs concurrently for all updated or newly added files
  const treeEntries: Array<{
    path: string;
    mode: '100644' | '100755' | '040000' | '160000' | '120000';
    type: 'blob' | 'tree' | 'commit';
    sha: string | null;
  }> = [];

  const blobCreationPromises = files.map(async (file) => {
    const cleanFilePath = normalizeRepoPath(file.path);
    const blobResult = await createBlob(owner, repo, file.content, 'utf-8', token);
    return {
      path: cleanFilePath,
      mode: file.mode || ('100644' as const),
      type: file.type || ('blob' as const),
      sha: blobResult.sha,
    };
  });

  const createdBlobs = await Promise.all(blobCreationPromises);
  treeEntries.push(...createdBlobs);

  // 4. Register deletion entries (setting sha to null in the tree payload deletes the node in Git Data API)
  for (const delPath of deletedPaths) {
    const cleanDelPath = normalizeRepoPath(delPath);
    treeEntries.push({
      path: cleanDelPath,
      mode: '100644',
      type: 'blob',
      sha: null,
    });
  }

  // 5. Build new Git Tree with base_tree reference
  const newTree = await githubFetch<{ sha: string }>(
    `/repos/${cleanOwner}/${cleanRepo}/git/trees`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeEntries,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  // 6. Create the atomic Git commit referencing parent commit and new tree
  const commitPayload: Record<string, unknown> = {
    message: message.trim(),
    tree: newTree.sha,
    parents: [parentCommitSha],
  };

  if (author) {
    commitPayload.author = {
      name: author.name,
      email: author.email,
      date: new Date().toISOString(),
    };
  }
  if (committer) {
    commitPayload.committer = {
      name: committer.name,
      email: committer.email,
      date: new Date().toISOString(),
    };
  }

  const newCommit = await githubFetch<{ sha: string }>(
    `/repos/${cleanOwner}/${cleanRepo}/git/commits`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(commitPayload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  // 7. Update branch HEAD reference to point to the newly minted commit
  await updateGitReference(token, owner, repo, `heads/${cleanBranch}`, newCommit.sha, false);

  return newCommit.sha;
}

/**
 * Retrieves commit history for a repository or specific file path with pagination.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param branchOrSha - Branch, tag, or SHA to query commits from.
 * @param path - Optional file path to restrict commit history to.
 * @param token - Optional authentication token.
 * @param limit - Maximum total commits to retrieve (defaults to 100).
 * @returns Array of detailed CommitItem records.
 */
export async function listCommits(
  owner: string,
  repo: string,
  branchOrSha?: string,
  path?: string,
  token?: string,
  limit = 100
): Promise<CommitItem[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const queryParams: Record<string, string | number> = {
    per_page: Math.min(100, limit),
  };

  if (branchOrSha) queryParams.sha = branchOrSha.trim();
  if (path) queryParams.path = normalizeRepoPath(path);

  return fetchAllPages<CommitItem>(
    `/repos/${cleanOwner}/${cleanRepo}/commits`,
    token,
    {
      queryParams,
      cacheTtlMs: 30000,
    },
    limit
  );
}

/**
 * Fetches details, statistics, and file patches for a specific commit SHA.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param commitSha - The commit SHA hash.
 * @param token - Optional authentication token.
 * @returns Full CommitItem record with diff statistics.
 */
export async function getCommitDetails(
  owner: string,
  repo: string,
  commitSha: string,
  token?: string
): Promise<CommitItem> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanSha = encodeURIComponent(commitSha.trim());

  return githubFetch<CommitItem>(
    `/repos/${cleanOwner}/${cleanRepo}/commits/${cleanSha}`,
    token,
    {
      cacheTtlMs: 60000,
    }
  );
}

/**
 * Compares two commits, branches, or tags and returns the diff, ahead/behind status, and changed files.
 *
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param base - Base commit SHA or branch name.
 * @param head - Head commit SHA or branch name.
 * @param token - Optional authentication token.
 * @returns Comparison data payload including file patches.
 */
export async function compareCommits(
  owner: string,
  repo: string,
  base: string,
  head: string,
  token?: string
): Promise<{
  url: string;
  html_url: string;
  status: 'diverged' | 'ahead' | 'behind' | 'identical';
  ahead_by: number;
  behind_by: number;
  total_commits: number;
  commits: CommitItem[];
  files: Array<{
    sha: string;
    filename: string;
    status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
  }>;
}> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanBase = encodeURIComponent(base.trim());
  const cleanHead = encodeURIComponent(head.trim());

  return githubFetch(
    `/repos/${cleanOwner}/${cleanRepo}/compare/${cleanBase}...${cleanHead}`,
    token,
    {
      cacheTtlMs: 30000,
    }
  );
}// ============================================================================
// SECTION 13: PULL REQUESTS, REVIEWS & MERGE AUTOMATION
// ============================================================================

export interface ListPullRequestsOptions extends PaginationOptions {
  state?: 'open' | 'closed' | 'all';
  head?: string;
  base?: string;
  sort?: 'created' | 'updated' | 'popularity' | 'long-running';
  direction?: 'asc' | 'desc';
}

export interface UpdatePullRequestParams {
  token: string;
  owner: string;
  repo: string;
  pullNumber: number;
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  base?: string;
  maintainerCanModify?: boolean;
}

export interface PullRequestReviewParams {
  token: string;
  owner: string;
  repo: string;
  pullNumber: number;
  event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
  body?: string;
  comments?: Array<{
    path: string;
    position?: number;
    line?: number;
    side?: 'LEFT' | 'RIGHT';
    start_line?: number;
    start_side?: 'LEFT' | 'RIGHT';
    body: string;
  }>;
}

export interface PullRequestReview {
  id: number;
  node_id: string;
  user: PullRequestUser;
  body: string | null;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING';
  html_url: string;
  pull_request_url: string;
  author_association: string;
  submitted_at: string;
  commit_id: string;
}

export interface PullRequestFileChange {
  sha: string;
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch?: string;
  previous_filename?: string;
}

export interface PullRequestMergeResult {
  sha: string;
  merged: boolean;
  message: string;
}

/**
 * Lists pull requests for a repository with flexible filtering and sorting.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param options - Pull request list options and filters.
 * @returns Array of PullRequest records.
 */
export async function listPullRequests(
  token: string | undefined,
  owner: string,
  repo: string,
  options: ListPullRequestsOptions = {}
): Promise<PullRequest[]> {
  if (!owner || !repo) {
    throw new GitHubValidationError('Owner and repo are required to list pull requests');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const queryParams: Record<string, string | number | undefined> = {
    state: options.state || 'open',
    sort: options.sort || 'created',
    direction: options.direction || 'desc',
    per_page: options.per_page || 100,
    page: options.page,
  };

  if (options.head) queryParams.head = options.head.trim();
  if (options.base) queryParams.base = options.base.trim();

  return fetchAllPages<PullRequest>(
    `/repos/${cleanOwner}/${cleanRepo}/pulls`,
    token,
    {
      queryParams,
      cacheTtlMs: 20000,
    },
    1000
  );
}

/**
 * Retrieves full details for a specific pull request by number.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param pullNumber - Pull request sequence number.
 * @returns Complete PullRequest object.
 */
export async function getPullRequest(
  token: string | undefined,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<PullRequest> {
  if (!owner || !repo || !pullNumber) {
    throw new GitHubValidationError('Owner, repo, and pullNumber are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<PullRequest>(
    `/repos/${cleanOwner}/${cleanRepo}/pulls/${pullNumber}`,
    token,
    {
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Creates a new Pull Request.
 *
 * @param params - Pull request creation parameters.
 * @returns The newly created PullRequest representation.
 */
export async function createPullRequest({
  token,
  owner,
  repo,
  title,
  body,
  head,
  base,
  draft = false,
  maintainerCanModify = true,
}: CreatePullRequestParams): Promise<PullRequest> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a pull request');
  }
  if (!owner || !repo || !title || !head || !base) {
    throw new GitHubValidationError('Owner, repo, title, head branch, and base branch are mandatory');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload = {
    title: title.trim(),
    body: body ? body.trim() : '',
    head: head.trim(),
    base: base.trim(),
    draft: Boolean(draft),
    maintainer_can_modify: Boolean(maintainerCanModify),
  };

  return githubFetch<PullRequest>(
    `/repos/${cleanOwner}/${cleanRepo}/pulls`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Updates an existing Pull Request's metadata, title, body, state, or target base branch.
 *
 * @param params - Update parameters for the target pull request.
 * @returns Updated PullRequest object.
 */
export async function updatePullRequest({
  token,
  owner,
  repo,
  pullNumber,
  title,
  body,
  state,
  base,
  maintainerCanModify,
}: UpdatePullRequestParams): Promise<PullRequest> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update a pull request');
  }
  if (!owner || !repo || !pullNumber) {
    throw new GitHubValidationError('Owner, repo, and pullNumber are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {};
  if (title !== undefined) payload.title = title.trim();
  if (body !== undefined) payload.body = body;
  if (state !== undefined) payload.state = state;
  if (base !== undefined) payload.base = base.trim();
  if (maintainerCanModify !== undefined) payload.maintainer_can_modify = maintainerCanModify;

  return githubFetch<PullRequest>(
    `/repos/${cleanOwner}/${cleanRepo}/pulls/${pullNumber}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Merges a Pull Request using merge commit, squash, or rebase strategy.
 *
 * @param params - Configuration parameters for the merge operation.
 * @returns Merge outcome including commit SHA and status.
 */
export async function mergePullRequest({
  token,
  owner,
  repo,
  pullNumber,
  commitTitle,
  commitMessage,
  sha,
  mergeMethod = 'merge',
}: MergePullRequestParams): Promise<PullRequestMergeResult> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to merge a pull request');
  }
  if (!owner || !repo || !pullNumber) {
    throw new GitHubValidationError('Owner, repo, and pullNumber are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {
    merge_method: mergeMethod,
  };

  if (commitTitle) payload.commit_title = commitTitle.trim();
  if (commitMessage) payload.commit_message = commitMessage.trim();
  if (sha) payload.sha = sha.trim();

  return githubFetch<PullRequestMergeResult>(
    `/repos/${cleanOwner}/${cleanRepo}/pulls/${pullNumber}/merge`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Checks whether a Pull Request is cleanly mergeable without conflicts.
 * Retries with exponential backoff if GitHub's background mergeability calculation is pending (null).
 *
 * @param token - Authentication token.
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param pullNumber - Pull request number.
 * @param maxPollAttempts - Maximum background poll attempts (defaults to 5).
 * @returns Object with mergeable boolean flag and mergeable_state indicator.
 */
export async function checkPullRequestMergeability(
  token: string | undefined,
  owner: string,
  repo: string,
  pullNumber: number,
  maxPollAttempts = 5
): Promise<{ mergeable: boolean; mergeableState: string }> {
  for (let attempt = 1; attempt <= maxPollAttempts; attempt++) {
    const pr = await getPullRequest(token, owner, repo, pullNumber);

    if (pr.mergeable !== null && pr.mergeable !== undefined) {
      return {
        mergeable: Boolean(pr.mergeable),
        mergeableState: pr.mergeable_state || 'unknown',
      };
    }

    if (attempt < maxPollAttempts) {
      const waitTime = Math.min(3000, 500 * Math.pow(2, attempt - 1));
      await sleep(waitTime);
    }
  }

  return {
    mergeable: false,
    mergeableState: 'pending_timeout',
  };
}

/**
 * Lists all commits associated with a given Pull Request.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param pullNumber - Pull request sequence number.
 * @returns Array of commit items included in the pull request.
 */
export async function listPullRequestCommits(
  token: string | undefined,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<CommitItem[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<CommitItem>(
    `/repos/${cleanOwner}/${cleanRepo}/pulls/${pullNumber}/commits`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 30000,
    },
    500
  );
}

/**
 * Lists all modified, added, or deleted files with diff statistics for a pull request.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param pullNumber - Pull request sequence number.
 * @returns Array of modified file descriptors and diff patches.
 */
export async function listPullRequestFiles(
  token: string | undefined,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<PullRequestFileChange[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<PullRequestFileChange>(
    `/repos/${cleanOwner}/${cleanRepo}/pulls/${pullNumber}/files`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 30000,
    },
    1000
  );
}

/**
 * Creates a formal Pull Request Review (Approval, Changes Requested, or Line-level Comments).
 *
 * @param params - Review submission parameters.
 * @returns The created PullRequestReview entity.
 */
export async function createPullRequestReview({
  token,
  owner,
  repo,
  pullNumber,
  event,
  body = '',
  comments = [],
}: PullRequestReviewParams): Promise<PullRequestReview> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to submit a review');
  }
  if (!owner || !repo || !pullNumber || !event) {
    throw new GitHubValidationError('Owner, repo, pullNumber, and event type are required for review');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {
    event,
    body: body.trim(),
  };

  if (comments.length > 0) {
    payload.comments = comments;
  }

  return githubFetch<PullRequestReview>(
    `/repos/${cleanOwner}/${cleanRepo}/pulls/${pullNumber}/reviews`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Lists all reviews submitted for a given Pull Request.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param pullNumber - Pull request sequence number.
 * @returns Array of pull request reviews.
 */
export async function listPullRequestReviews(
  token: string | undefined,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<PullRequestReview[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<PullRequestReview>(
    `/repos/${cleanOwner}/${cleanRepo}/pulls/${pullNumber}/reviews`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 15000,
    }
  );
}

// ============================================================================
// SECTION 14: GITHUB ACTIONS & WORKFLOW AUTOMATION ENGINE
// ============================================================================

export interface WorkflowDispatchParams {
  token: string;
  owner: string;
  repo: string;
  workflowId: string | number;
  ref: string;
  inputs?: Record<string, string | number | boolean>;
}

export interface ListWorkflowRunsOptions extends PaginationOptions {
  actor?: string;
  branch?: string;
  event?: string;
  status?: 'completed' | 'action_required' | 'cancelled' | 'failure' | 'neutral' | 'skipped' | 'stale' | 'success' | 'timed_out' | 'in_progress' | 'queued' | 'requested' | 'waiting' | 'pending';
  created?: string;
  head_sha?: string;
  exclude_pull_requests?: boolean;
  check_suite_id?: number;
}

/**
 * Retrieves all declared GitHub Actions workflows for a repository.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Object with total count and array of Workflow objects.
 */
export async function getRepoWorkflows(
  token: string | undefined,
  owner: string,
  repo: string
): Promise<{ total_count: number; workflows: Workflow[] }> {
  if (!owner || !repo) {
    throw new GitHubValidationError('Owner and repo are required to fetch workflows');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<{ total_count: number; workflows: Workflow[] }>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/workflows`,
    token,
    {
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Fetches metadata for a single specific workflow by file name or numerical ID.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param workflowId - Workflow file name (e.g. 'main.yml') or numerical workflow ID.
 * @returns Detailed Workflow domain object.
 */
export async function getWorkflowDetails(
  token: string | undefined,
  owner: string,
  repo: string,
  workflowId: string | number
): Promise<Workflow> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanWorkflow = encodeURIComponent(String(workflowId).trim());

  return githubFetch<Workflow>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/workflows/${cleanWorkflow}`,
    token,
    {
      cacheTtlMs: 60000,
    }
  );
}

/**
 * Triggers a manual `workflow_dispatch` event for a GitHub Actions workflow with optional key-value inputs.
 *
 * @param params - Trigger parameters including workflow target and branch/ref.
 */
export async function triggerWorkflow({
  token,
  owner,
  repo,
  workflowId,
  ref,
  inputs,
}: WorkflowDispatchParams): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to trigger a workflow dispatch');
  }
  if (!owner || !repo || !workflowId || !ref) {
    throw new GitHubValidationError('Owner, repo, workflowId, and ref are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanWorkflow = encodeURIComponent(String(workflowId).trim());

  const payload: Record<string, unknown> = {
    ref: ref.trim(),
  };

  if (inputs && Object.keys(inputs).length > 0) {
    payload.inputs = inputs;
  }

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/workflows/${cleanWorkflow}/dispatches`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Retrieves paginated workflow runs for a repository or specific workflow.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param workflowId - Optional workflow ID or file name to restrict runs to.
 * @param options - Filter options (branch, status, actor, pagination).
 * @returns Object with total run count and list of WorkflowRun records.
 */
export async function getWorkflowRuns(
  token: string | undefined,
  owner: string,
  repo: string,
  workflowId?: string | number,
  options: ListWorkflowRunsOptions = {}
): Promise<{ total_count: number; workflow_runs: WorkflowRun[] }> {
  if (!owner || !repo) {
    throw new GitHubValidationError('Owner and repo are required to list workflow runs');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const endpoint = workflowId
    ? `/repos/${cleanOwner}/${cleanRepo}/actions/workflows/${encodeURIComponent(String(workflowId).trim())}/runs`
    : `/repos/${cleanOwner}/${cleanRepo}/actions/runs`;

  const queryParams: Record<string, string | number | boolean | undefined> = {
    per_page: options.per_page || 30,
    page: options.page || 1,
    actor: options.actor,
    branch: options.branch,
    event: options.event,
    status: options.status,
    created: options.created,
    head_sha: options.head_sha,
    exclude_pull_requests: options.exclude_pull_requests,
    check_suite_id: options.check_suite_id,
  };

  return githubFetch<{ total_count: number; workflow_runs: WorkflowRun[] }>(
    endpoint,
    token,
    {
      queryParams,
      cacheTtlMs: 10000,
    }
  );
}

/**
 * Retrieves full telemetry, status, and conclusion for an individual workflow run.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param runId - Numerical identifier of the workflow run.
 * @returns WorkflowRun domain representation.
 */
export async function getWorkflowRun(
  token: string | undefined,
  owner: string,
  repo: string,
  runId: number
): Promise<WorkflowRun> {
  if (!owner || !repo || !runId) {
    throw new GitHubValidationError('Owner, repo, and runId are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<WorkflowRun>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/runs/${runId}`,
    token,
    {
      cacheTtlMs: 5000,
    }
  );
}

/**
 * Cancels an in-progress or queued workflow run.
 *
 * @param token - Authentication token with write access.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param runId - Workflow run numerical ID.
 */
export async function cancelWorkflowRun(
  token: string,
  owner: string,
  repo: string,
  runId: number
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to cancel a workflow run');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/runs/${runId}/cancel`,
    token,
    {
      method: 'POST',
    }
  );
}

/**
 * Re-runs an entire workflow run or re-runs failed jobs only.
 *
 * @param token - Authentication token with write access.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param runId - Workflow run numerical ID.
 * @param failedOnly - Whether to only re-run failed jobs. Defaults to false.
 */
export async function rerunWorkflowRun(
  token: string,
  owner: string,
  repo: string,
  runId: number,
  failedOnly = false
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to re-run a workflow');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const action = failedOnly ? 'rerun-failed-jobs' : 'rerun';

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/runs/${runId}/${action}`,
    token,
    {
      method: 'POST',
    }
  );
}

/**
 * Fetches all jobs and steps associated with a workflow run.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param runId - Workflow run numerical ID.
 * @returns List of workflow jobs with nested step metrics.
 */
export async function getWorkflowRunJobs(
  token: string | undefined,
  owner: string,
  repo: string,
  runId: number
): Promise<WorkflowJob[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const response = await githubFetch<{ total_count: number; jobs: WorkflowJob[] }>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/runs/${runId}/jobs`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 5000,
    }
  );

  return response?.jobs || [];
}

/**
 * Downloads raw plain-text logs for an individual workflow job.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param jobId - Numerical ID of the job.
 * @returns Raw text logs string.
 */
export async function getWorkflowJobLogs(
  token: string,
  owner: string,
  repo: string,
  jobId: number
): Promise<string> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to fetch job logs');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  try {
    return await githubFetch<string>(
      `/repos/${cleanOwner}/${cleanRepo}/actions/jobs/${jobId}/logs`,
      token,
      {
        accept: 'application/vnd.github.v3.raw, text/plain, */*',
        skipCache: true,
      }
    );
  } catch (error: any) {
    return `[githubService:getWorkflowJobLogs] Failed to fetch logs for job ${jobId}: ${error.message}`;
  }
}

/**
 * Aggregates and returns composite diagnostic logs for an entire workflow run.
 * Intelligently prioritizes and highlights failed jobs and their individual step failures.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param runId - Numerical identifier of the workflow run.
 * @returns Unified formatted string containing logs across all run jobs.
 */
export async function getWorkflowRunLogs(
  token: string,
  owner: string,
  repo: string,
  runId: number
): Promise<string> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to stream workflow logs');
  }

  const jobs = await getWorkflowRunJobs(token, owner, repo, runId);
  if (!jobs || jobs.length === 0) {
    return `No jobs found for workflow run #${runId}`;
  }

  // Prioritize failed jobs; if none failed, retrieve logs for all executed jobs
  const failedJobs = jobs.filter((j) => j.conclusion === 'failure');
  const targetJobs = failedJobs.length > 0 ? failedJobs : jobs;

  let combinedLogs = `=== WORKFLOW RUN #${runId} DIAGNOSTIC LOGS ===\n`;
  combinedLogs += `Total Jobs: ${jobs.length} | Target Failed/Active Jobs: ${targetJobs.length}\n`;
  combinedLogs += `Timestamp: ${new Date().toISOString()}\n\n`;

  for (const job of targetJobs) {
    const banner = `--------------------------------------------------------------------------------\n` +
                   `JOB [${job.id}] ${job.name} (Status: ${job.status}, Conclusion: ${job.conclusion || 'pending'})\n` +
                   `Runner: ${job.runner_name || 'hosted'} | Started: ${job.started_at || 'n/a'}\n` +
                   `--------------------------------------------------------------------------------\n`;
    combinedLogs += banner;

    try {
      const rawJobLog = await getWorkflowJobLogs(token, owner, repo, job.id);
      combinedLogs += `${rawJobLog}\n\n`;
    } catch (err: any) {
      combinedLogs += `[ERROR RETRIEVING LOGS FOR JOB ${job.id}]: ${err.message}\n\n`;
    }
  }

  return combinedLogs;
}

/**
 * Lists all generated build artifacts for a repository or specific workflow run.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param runId - Optional workflow run ID to restrict artifacts to.
 * @returns Array of WorkflowArtifact objects.
 */
export async function listWorkflowArtifacts(
  token: string | undefined,
  owner: string,
  repo: string,
  runId?: number
): Promise<WorkflowArtifact[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const endpoint = runId
    ? `/repos/${cleanOwner}/${cleanRepo}/actions/runs/${runId}/artifacts`
    : `/repos/${cleanOwner}/${cleanRepo}/actions/artifacts`;

  const response = await githubFetch<{ total_count: number; artifacts: WorkflowArtifact[] }>(
    endpoint,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 30000,
    }
  );

  return response?.artifacts || [];
}

/**
 * Deletes a workflow run record and its associated logs/artifacts from the repository history.
 *
 * @param token - Authentication token with administration/write permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param runId - Workflow run numerical ID to delete.
 */
export async function deleteWorkflowRun(
  token: string,
  owner: string,
  repo: string,
  runId: number
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a workflow run');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/runs/${runId}`,
    token,
    {
      method: 'DELETE',
    }
  );
}// ============================================================================
// SECTION 15: ISSUE TRACKING, COMMENTS, LABELS & MILESTONES
// ============================================================================

export interface ListIssuesOptions extends PaginationOptions {
  milestone?: string | number;
  state?: 'open' | 'closed' | 'all';
  assignee?: string;
  creator?: string;
  mentioned?: string;
  labels?: string | string[];
  sort?: 'created' | 'updated' | 'comments';
  direction?: 'asc' | 'desc';
  since?: string;
}

export interface UpdateIssueParams {
  token: string;
  owner: string;
  repo: string;
  issueNumber: number;
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  stateReason?: 'completed' | 'not_planned' | 'reopened';
  assignees?: string[];
  milestone?: number | null;
  labels?: string[];
}

export interface CreateCommentParams {
  token: string;
  owner: string;
  repo: string;
  issueNumber: number;
  body: string;
}

export interface UpdateCommentParams {
  token: string;
  owner: string;
  repo: string;
  commentId: number;
  body: string;
}

export interface CreateLabelParams {
  token: string;
  owner: string;
  repo: string;
  name: string;
  color: string;
  description?: string;
}

export interface CreateMilestoneParams {
  token: string;
  owner: string;
  repo: string;
  title: string;
  state?: 'open' | 'closed';
  description?: string;
  dueOn?: string;
}

/**
 * Retrieves a paginated list of issues for a specified repository.
 * Filters out pull requests by default if pull_request key is present.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param options - Filtering and pagination options.
 * @param includePullRequests - Whether to include PRs returned by the Issues endpoint. Defaults to false.
 * @returns Array of Issue domain objects.
 */
export async function listIssues(
  token: string | undefined,
  owner: string,
  repo: string,
  options: ListIssuesOptions = {},
  includePullRequests = false
): Promise<Issue[]> {
  if (!owner || !repo) {
    throw new GitHubValidationError('Owner and repo parameters are mandatory for listIssues');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const labelParam = Array.isArray(options.labels) ? options.labels.join(',') : options.labels;

  const queryParams: Record<string, string | number | undefined> = {
    milestone: options.milestone !== undefined ? String(options.milestone) : undefined,
    state: options.state || 'open',
    assignee: options.assignee,
    creator: options.creator,
    mentioned: options.mentioned,
    labels: labelParam,
    sort: options.sort || 'created',
    direction: options.direction || 'desc',
    since: options.since,
    per_page: options.per_page || 100,
    page: options.page,
  };

  const rawIssues = await fetchAllPages<Issue>(
    `/repos/${cleanOwner}/${cleanRepo}/issues`,
    token,
    {
      queryParams,
      cacheTtlMs: 20000,
    },
    1000
  );

  if (includePullRequests) {
    return rawIssues;
  }

  return rawIssues.filter((item) => !item.pull_request);
}

/**
 * Retrieves full details for a single issue by number.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param issueNumber - Numerical issue sequence number.
 * @returns Issue domain object.
 */
export async function getIssue(
  token: string | undefined,
  owner: string,
  repo: string,
  issueNumber: number
): Promise<Issue> {
  if (!owner || !repo || !issueNumber) {
    throw new GitHubValidationError('Owner, repo, and issueNumber parameters are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<Issue>(
    `/repos/${cleanOwner}/${cleanRepo}/issues/${issueNumber}`,
    token,
    {
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Creates a new Issue in the target repository.
 *
 * @param params - Issue creation payload parameters.
 * @returns Newly created Issue domain object.
 */
export async function createIssue({
  token,
  owner,
  repo,
  title,
  body = '',
  assignees,
  milestone,
  labels,
}: CreateIssueParams): Promise<Issue> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create an issue');
  }
  if (!owner || !repo || !title) {
    throw new GitHubValidationError('Owner, repo, and title are required to create an issue');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {
    title: title.trim(),
    body: body.trim(),
  };

  if (assignees && assignees.length > 0) payload.assignees = assignees;
  if (milestone !== undefined) payload.milestone = milestone;
  if (labels && labels.length > 0) payload.labels = labels;

  return githubFetch<Issue>(
    `/repos/${cleanOwner}/${cleanRepo}/issues`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Updates an existing issue's title, body, state, labels, assignees, or milestone.
 *
 * @param params - Issue update fields and identifiers.
 * @returns Updated Issue domain object.
 */
export async function updateIssue({
  token,
  owner,
  repo,
  issueNumber,
  title,
  body,
  state,
  stateReason,
  assignees,
  milestone,
  labels,
}: UpdateIssueParams): Promise<Issue> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update an issue');
  }
  if (!owner || !repo || !issueNumber) {
    throw new GitHubValidationError('Owner, repo, and issueNumber are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {};
  if (title !== undefined) payload.title = title.trim();
  if (body !== undefined) payload.body = body;
  if (state !== undefined) payload.state = state;
  if (stateReason !== undefined) payload.state_reason = stateReason;
  if (assignees !== undefined) payload.assignees = assignees;
  if (milestone !== undefined) payload.milestone = milestone;
  if (labels !== undefined) payload.labels = labels;

  return githubFetch<Issue>(
    `/repos/${cleanOwner}/${cleanRepo}/issues/${issueNumber}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Locks an issue to prevent further conversation.
 *
 * @param token - Authentication token with write permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param issueNumber - Numerical issue sequence number.
 * @param lockReason - Reason for lock ('off-topic', 'too heated', 'resolved', 'spam').
 */
export async function lockIssue(
  token: string,
  owner: string,
  repo: string,
  issueNumber: number,
  lockReason: 'off-topic' | 'too heated' | 'resolved' | 'spam' = 'resolved'
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to lock an issue');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/issues/${issueNumber}/lock`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify({ lock_reason: lockReason }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Unlocks a previously locked issue.
 *
 * @param token - Authentication token with write permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param issueNumber - Numerical issue sequence number.
 */
export async function unlockIssue(
  token: string,
  owner: string,
  repo: string,
  issueNumber: number
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to unlock an issue');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/issues/${issueNumber}/lock`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Lists all comments posted to a specific issue or pull request.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param issueNumber - Numerical issue or PR sequence number.
 * @param since - ISO 8601 timestamp string to filter comments updated after.
 * @returns Array of IssueComment records.
 */
export async function listIssueComments(
  token: string | undefined,
  owner: string,
  repo: string,
  issueNumber: number,
  since?: string
): Promise<IssueComment[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const queryParams: Record<string, string | number | undefined> = {
    per_page: 100,
    since,
  };

  return fetchAllPages<IssueComment>(
    `/repos/${cleanOwner}/${cleanRepo}/issues/${issueNumber}/comments`,
    token,
    {
      queryParams,
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Posts a new markdown comment to an issue or pull request.
 *
 * @param params - Comment payload parameters.
 * @returns Newly created IssueComment domain object.
 */
export async function createIssueComment({
  token,
  owner,
  repo,
  issueNumber,
  body,
}: CreateCommentParams): Promise<IssueComment> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to comment on an issue');
  }
  if (!owner || !repo || !issueNumber || !body) {
    throw new GitHubValidationError('Owner, repo, issueNumber, and comment body are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<IssueComment>(
    `/repos/${cleanOwner}/${cleanRepo}/issues/${issueNumber}/comments`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({ body: body.trim() }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Updates the text body of an existing issue comment.
 *
 * @param params - Comment update parameters.
 * @returns Updated IssueComment record.
 */
export async function updateIssueComment({
  token,
  owner,
  repo,
  commentId,
  body,
}: UpdateCommentParams): Promise<IssueComment> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update an issue comment');
  }
  if (!owner || !repo || !commentId || !body) {
    throw new GitHubValidationError('Owner, repo, commentId, and body are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<IssueComment>(
    `/repos/${cleanOwner}/${cleanRepo}/issues/comments/${commentId}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify({ body: body.trim() }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Deletes a comment from an issue or pull request.
 *
 * @param token - Authentication token with write permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param commentId - Numerical comment identifier.
 */
export async function deleteIssueComment(
  token: string,
  owner: string,
  repo: string,
  commentId: number
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete an issue comment');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/issues/comments/${commentId}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Retrieves all labels configured for a repository.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of IssueLabel domain objects.
 */
export async function listRepoLabels(
  token: string | undefined,
  owner: string,
  repo: string
): Promise<IssueLabel[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<IssueLabel>(
    `/repos/${cleanOwner}/${cleanRepo}/labels`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 60000,
    }
  );
}

/**
 * Creates a new label in the repository.
 *
 * @param params - Label parameters (name, hex color without #, description).
 * @returns The newly created IssueLabel representation.
 */
export async function createLabel({
  token,
  owner,
  repo,
  name,
  color,
  description = '',
}: CreateLabelParams): Promise<IssueLabel> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a label');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanColor = color.replace(/^#/, '').trim();

  return githubFetch<IssueLabel>(
    `/repos/${cleanOwner}/${cleanRepo}/labels`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        color: cleanColor,
        description: description.trim(),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Lists all milestones defined in a repository.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param state - Milestone state filter ('open', 'closed', 'all').
 * @param sort - Sorting criteria ('due_on', 'completeness').
 * @returns Array of IssueMilestone objects.
 */
export async function listMilestones(
  token: string | undefined,
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'open',
  sort: 'due_on' | 'completeness' = 'due_on'
): Promise<IssueMilestone[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<IssueMilestone>(
    `/repos/${cleanOwner}/${cleanRepo}/milestones`,
    token,
    {
      queryParams: {
        state,
        sort,
        direction: 'asc',
        per_page: 100,
      },
      cacheTtlMs: 60000,
    }
  );
}

/**
 * Creates a new milestone for tracking issue batches and deadlines.
 *
 * @param params - Milestone creation options.
 * @returns Created IssueMilestone instance.
 */
export async function createMilestone({
  token,
  owner,
  repo,
  title,
  state = 'open',
  description = '',
  dueOn,
}: CreateMilestoneParams): Promise<IssueMilestone> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a milestone');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {
    title: title.trim(),
    state,
    description: description.trim(),
  };

  if (dueOn) payload.due_on = dueOn;

  return githubFetch<IssueMilestone>(
    `/repos/${cleanOwner}/${cleanRepo}/milestones`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// ============================================================================
// SECTION 16: RELEASES, ASSETS & TAGGED DEPLOYMENTS
// ============================================================================

export interface UpdateReleaseParams {
  token: string;
  owner: string;
  repo: string;
  releaseId: number;
  tagName?: string;
  targetCommitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
}

export interface UploadReleaseAssetParams {
  token: string;
  owner: string;
  repo: string;
  releaseId: number;
  name: string;
  label?: string;
  contentType: string;
  data: ArrayBuffer | Blob | Uint8Array | string;
}

/**
 * Lists all official releases created for a repository.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of Release domain representations.
 */
export async function listReleases(
  token: string | undefined,
  owner: string,
  repo: string
): Promise<Release[]> {
  if (!owner || !repo) {
    throw new GitHubValidationError('Owner and repo are required to list releases');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<Release>(
    `/repos/${cleanOwner}/${cleanRepo}/releases`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Retrieves details for the latest published release in a repository.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns The latest published Release.
 */
export async function getLatestRelease(
  token: string | undefined,
  owner: string,
  repo: string
): Promise<Release> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<Release>(
    `/repos/${cleanOwner}/${cleanRepo}/releases/latest`,
    token,
    {
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Retrieves a release by its exact git tag name.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param tag - Tag name string (e.g. 'v2.1.0').
 * @returns Release representation for the specified tag.
 */
export async function getReleaseByTag(
  token: string | undefined,
  owner: string,
  repo: string,
  tag: string
): Promise<Release> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanTag = encodeURIComponent(tag.trim());

  return githubFetch<Release>(
    `/repos/${cleanOwner}/${cleanRepo}/releases/tags/${cleanTag}`,
    token,
    {
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Creates a new GitHub Release with optional automatic changelog generation.
 *
 * @param params - Release creation parameters.
 * @returns The newly published Release domain object.
 */
export async function createRelease({
  token,
  owner,
  repo,
  tagName,
  targetCommitish,
  name,
  body = '',
  draft = false,
  prerelease = false,
  generateReleaseNotes = false,
}: CreateReleaseParams): Promise<Release> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to publish a release');
  }
  if (!owner || !repo || !tagName) {
    throw new GitHubValidationError('Owner, repo, and tagName are required to create a release');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {
    tag_name: tagName.trim(),
    draft: Boolean(draft),
    prerelease: Boolean(prerelease),
    generate_release_notes: Boolean(generateReleaseNotes),
  };

  if (targetCommitish) payload.target_commitish = targetCommitish.trim();
  if (name) payload.name = name.trim();
  if (body) payload.body = body.trim();

  return githubFetch<Release>(
    `/repos/${cleanOwner}/${cleanRepo}/releases`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Updates an existing release's metadata, release notes, or draft status.
 *
 * @param params - Updated release parameters.
 * @returns Updated Release domain representation.
 */
export async function updateRelease({
  token,
  owner,
  repo,
  releaseId,
  tagName,
  targetCommitish,
  name,
  body,
  draft,
  prerelease,
}: UpdateReleaseParams): Promise<Release> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update a release');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {};
  if (tagName !== undefined) payload.tag_name = tagName.trim();
  if (targetCommitish !== undefined) payload.target_commitish = targetCommitish.trim();
  if (name !== undefined) payload.name = name.trim();
  if (body !== undefined) payload.body = body;
  if (draft !== undefined) payload.draft = draft;
  if (prerelease !== undefined) payload.prerelease = prerelease;

  return githubFetch<Release>(
    `/repos/${cleanOwner}/${cleanRepo}/releases/${releaseId}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Permanently deletes a release from a repository.
 *
 * @param token - Authentication token with write permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param releaseId - Numerical release identifier.
 */
export async function deleteRelease(
  token: string,
  owner: string,
  repo: string,
  releaseId: number
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a release');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/releases/${releaseId}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Uploads a binary asset or package to a specific GitHub release.
 *
 * @param params - Asset binary data, content type, and target release information.
 * @returns Uploaded ReleaseAsset domain representation.
 */
export async function uploadReleaseAsset({
  token,
  owner,
  repo,
  releaseId,
  name,
  label,
  contentType,
  data,
}: UploadReleaseAssetParams): Promise<ReleaseAsset> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to upload release assets');
  }
  if (!name || !contentType || !data) {
    throw new GitHubValidationError('Asset name, contentType, and binary data are mandatory');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanName = encodeURIComponent(name.trim());

  let uploadEndpoint = `https://uploads.github.com/repos/${cleanOwner}/${cleanRepo}/releases/${releaseId}/assets?name=${cleanName}`;
  if (label) {
    uploadEndpoint += `&label=${encodeURIComponent(label.trim())}`;
  }

  return githubFetch<ReleaseAsset>(uploadEndpoint, token, {
    method: 'POST',
    body: data as BodyInit,
    headers: {
      'Content-Type': contentType,
    },
    timeoutMs: 120000,
  });
}

/**
 * Deletes an uploaded binary asset from a release.
 *
 * @param token - Authentication token with write permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param assetId - Numerical asset ID to delete.
 */
export async function deleteReleaseAsset(
  token: string,
  owner: string,
  repo: string,
  assetId: number
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a release asset');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/releases/assets/${assetId}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

// ============================================================================
// SECTION 17: SEARCH ENGINE (REPOSITORIES, CODE, COMMITS & ISSUES)
// ============================================================================

export interface CodeSearchItem {
  name: string;
  path: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  repository: GithubRepo;
  score: number;
  text_matches?: Array<{
    object_url: string;
    object_type: string;
    property: string;
    fragment: string;
    matches: Array<{ text: string; indices: [number, number] }>;
  }>;
}

export interface CommitSearchItem {
  url: string;
  sha: string;
  node_id: string;
  html_url: string;
  comments_url: string;
  commit: CommitItem['commit'];
  author: GithubRepoOwner | null;
  committer: GithubRepoOwner | null;
  parents: CommitItem['parents'];
  repository: GithubRepo;
  score: number;
}

/**
 * Searches across all accessible GitHub repositories using qualifiers and query filters.
 *
 * @param params - Search query terms, sort criteria, order, and pagination parameters.
 * @param token - Optional authentication token to increase rate limit thresholds.
 * @returns SearchResult containing matching repositories and aggregate counts.
 */
export async function searchRepositories(
  { query, sort, order = 'desc', page = 1, per_page = 30 }: SearchRepositoriesParams,
  token?: string
): Promise<SearchResult<GithubRepo>> {
  if (!query || !query.trim()) {
    throw new GitHubValidationError('A non-empty search query is required');
  }

  const queryParams: Record<string, string | number | undefined> = {
    q: query.trim(),
    sort,
    order,
    page,
    per_page: Math.min(100, Math.max(1, per_page)),
  };

  return githubFetch<SearchResult<GithubRepo>>('/search/repositories', token, {
    queryParams,
    cacheTtlMs: 30000,
  });
}

/**
 * Searches for code files matching a query across repositories or within an organization/repository.
 *
 * @param params - Code search query string, sort criteria, order, and pagination limits.
 * @param token - Authentication token (recommended as unauthenticated code search is heavily throttled).
 * @param enableTextMatches - Whether to request text match fragments in search results.
 * @returns SearchResult containing matching code files.
 */
export async function searchCode(
  { query, sort, order = 'desc', page = 1, per_page = 30 }: SearchCodeParams,
  token?: string,
  enableTextMatches = false
): Promise<SearchResult<CodeSearchItem>> {
  if (!query || !query.trim()) {
    throw new GitHubValidationError('A non-empty code search query is required');
  }

  const queryParams: Record<string, string | number | undefined> = {
    q: query.trim(),
    sort,
    order,
    page,
    per_page: Math.min(100, Math.max(1, per_page)),
  };

  const acceptHeader = enableTextMatches
    ? 'application/vnd.github.text-match+json'
    : 'application/vnd.github.v3+json';

  return githubFetch<SearchResult<CodeSearchItem>>('/search/code', token, {
    queryParams,
    accept: acceptHeader,
    cacheTtlMs: 30000,
  });
}

/**
 * Searches commits across repositories by message, author, or commit hash.
 *
 * @param query - Commit search query (e.g. 'fix memory leak repo:owner/name').
 * @param token - Optional authentication token.
 * @param page - Page sequence number.
 * @param perPage - Items per search page.
 * @returns SearchResult containing matching CommitSearchItem items.
 */
export async function searchCommits(
  query: string,
  token?: string,
  page = 1,
  perPage = 30
): Promise<SearchResult<CommitSearchItem>> {
  if (!query || !query.trim()) {
    throw new GitHubValidationError('Search query string is required for commit search');
  }

  const queryParams: Record<string, string | number> = {
    q: query.trim(),
    page,
    per_page: Math.min(100, Math.max(1, perPage)),
  };

  return githubFetch<SearchResult<CommitSearchItem>>('/search/commits', token, {
    queryParams,
    accept: 'application/vnd.github.cloak-preview+json',
    cacheTtlMs: 30000,
  });
}

/**
 * Searches issues and pull requests across all of GitHub with qualifiers.
 *
 * @param query - Issue search syntax (e.g. 'type:issue is:open label:bug repo:owner/name').
 * @param token - Optional authentication token.
 * @param sort - Sorting criteria ('comments', 'reactions', 'created', 'updated').
 * @param order - Direction of sorting ('asc' or 'desc').
 * @param page - Page index.
 * @param perPage - Page size.
 * @returns SearchResult containing matching Issue items.
 */
export async function searchIssues(
  query: string,
  token?: string,
  sort?: 'comments' | 'reactions' | 'created' | 'updated',
  order: 'asc' | 'desc' = 'desc',
  page = 1,
  perPage = 30
): Promise<SearchResult<Issue>> {
  if (!query || !query.trim()) {
    throw new GitHubValidationError('A non-empty issue search query is required');
  }

  const queryParams: Record<string, string | number | undefined> = {
    q: query.trim(),
    sort,
    order,
    page,
    per_page: Math.min(100, Math.max(1, perPage)),
  };

  return githubFetch<SearchResult<Issue>>('/search/issues', token, {
    queryParams,
    cacheTtlMs: 30000,
  });
}

/**
 * Searches users and organizations across GitHub.
 *
 * @param query - User search query string (e.g. 'tom location:san-francisco').
 * @param token - Optional authentication token.
 * @param page - Page index.
 * @param perPage - Page size.
 * @returns SearchResult of GitHubRepoOwner user records.
 */
export async function searchUsers(
  query: string,
  token?: string,
  page = 1,
  perPage = 30
): Promise<SearchResult<GithubRepoOwner>> {
  if (!query || !query.trim()) {
    throw new GitHubValidationError('A non-empty user search query is required');
  }

  const queryParams: Record<string, string | number> = {
    q: query.trim(),
    page,
    per_page: Math.min(100, Math.max(1, perPage)),
  };

  return githubFetch<SearchResult<GithubRepoOwner>>('/search/users', token, {
    queryParams,
    cacheTtlMs: 60000,
  });
}// ============================================================================
// SECTION 18: GITHUB GISTS API & SNIPPET MANAGEMENT
// ============================================================================

export interface GistFile {
  filename?: string;
  type?: string;
  language?: string;
  raw_url?: string;
  size?: number;
  truncated?: boolean;
  content?: string;
}

export interface Gist {
  url: string;
  forks_url: string;
  commits_url: string;
  id: string;
  node_id: string;
  git_pull_url: string;
  git_push_url: string;
  html_url: string;
  files: Record<string, GistFile>;
  public: boolean;
  created_at: string;
  updated_at: string;
  description: string | null;
  comments: number;
  user: GithubRepoOwner | null;
  comments_url: string;
  owner?: GithubRepoOwner;
  truncated?: boolean;
}

export interface GistComment {
  id: number;
  node_id: string;
  url: string;
  body: string;
  user: GithubRepoOwner;
  created_at: string;
  updated_at: string;
  author_association: string;
}

export interface CreateGistParams {
  token: string;
  description?: string;
  isPublic?: boolean;
  files: Record<string, { content: string; filename?: string }>;
}

export interface UpdateGistParams {
  token: string;
  gistId: string;
  description?: string;
  files?: Record<string, { content?: string; filename?: string | null }>;
}

/**
 * Lists public gists or gists created by the authenticated user.
 *
 * @param token - Optional authentication token.
 * @param since - ISO 8601 timestamp string to filter by updated date.
 * @param page - Page sequence index.
 * @param perPage - Items per page.
 * @returns Array of Gist domain objects.
 */
export async function listGists(
  token?: string,
  since?: string,
  page = 1,
  perPage = 30
): Promise<Gist[]> {
  const endpoint = token ? '/gists' : '/gists/public';
  const queryParams: Record<string, string | number | undefined> = {
    since,
    page,
    per_page: Math.min(100, Math.max(1, perPage)),
  };

  return fetchAllPages<Gist>(
    endpoint,
    token,
    {
      queryParams,
      cacheTtlMs: 30000,
    },
    500
  );
}

/**
 * Lists all gists created by a specific GitHub username.
 *
 * @param username - GitHub user handle.
 * @param token - Optional authentication token.
 * @param since - Optional ISO 8601 update filter.
 * @returns Array of Gist domain representations.
 */
export async function listUserGists(
  username: string,
  token?: string,
  since?: string
): Promise<Gist[]> {
  if (!username || !username.trim()) {
    throw new GitHubValidationError('Username is required to fetch user gists');
  }

  const cleanUser = encodeURIComponent(username.trim());
  const queryParams: Record<string, string | undefined> = { since };

  return fetchAllPages<Gist>(
    `/users/${cleanUser}/gists`,
    token,
    {
      queryParams,
      cacheTtlMs: 30000,
    },
    500
  );
}

/**
 * Retrieves full details and raw contents for a specific Gist by its identifier.
 *
 * @param gistId - The unique 32-character hexadecimal Gist ID.
 * @param token - Optional authentication token.
 * @returns Complete Gist entity.
 */
export async function getGist(gistId: string, token?: string): Promise<Gist> {
  if (!gistId || !gistId.trim()) {
    throw new GitHubValidationError('Gist ID is mandatory');
  }

  const cleanGistId = encodeURIComponent(gistId.trim());

  return githubFetch<Gist>(`/gists/${cleanGistId}`, token, {
    cacheTtlMs: 20000,
  });
}

/**
 * Creates a new GitHub Gist with multiple code files.
 *
 * @param params - Gist configuration parameters.
 * @returns The newly created Gist.
 */
export async function createGist({
  token,
  description = '',
  isPublic = false,
  files,
}: CreateGistParams): Promise<Gist> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a Gist');
  }
  if (!files || Object.keys(files).length === 0) {
    throw new GitHubValidationError('At least one file must be provided to create a Gist');
  }

  const payload = {
    description: description.trim(),
    public: Boolean(isPublic),
    files,
  };

  return githubFetch<Gist>('/gists', token, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Updates or adds files in an existing Gist, or alters its description.
 *
 * @param params - Updated file definitions and metadata.
 * @returns Updated Gist record.
 */
export async function updateGist({
  token,
  gistId,
  description,
  files,
}: UpdateGistParams): Promise<Gist> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update a Gist');
  }
  if (!gistId || !gistId.trim()) {
    throw new GitHubValidationError('Gist ID is required to update');
  }

  const cleanGistId = encodeURIComponent(gistId.trim());
  const payload: Record<string, unknown> = {};

  if (description !== undefined) payload.description = description.trim();
  if (files && Object.keys(files).length > 0) payload.files = files;

  return githubFetch<Gist>(`/gists/${cleanGistId}`, token, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Permanently deletes a Gist.
 *
 * @param token - Authentication token with gist permissions.
 * @param gistId - Unique Gist ID.
 */
export async function deleteGist(token: string, gistId: string): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a Gist');
  }
  if (!gistId || !gistId.trim()) {
    throw new GitHubValidationError('Gist ID is mandatory for deletion');
  }

  const cleanGistId = encodeURIComponent(gistId.trim());

  await githubFetch<null>(`/gists/${cleanGistId}`, token, {
    method: 'DELETE',
  });
}

/**
 * Forks an existing Gist into the authenticated user's account.
 *
 * @param token - Authentication token.
 * @param gistId - Source Gist identifier.
 * @returns Forked Gist domain object.
 */
export async function forkGist(token: string, gistId: string): Promise<Gist> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to fork a Gist');
  }
  if (!gistId || !gistId.trim()) {
    throw new GitHubValidationError('Gist ID is mandatory for forking');
  }

  const cleanGistId = encodeURIComponent(gistId.trim());

  return githubFetch<Gist>(`/gists/${cleanGistId}/forks`, token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Stars a Gist for the authenticated user.
 *
 * @param token - Authentication token.
 * @param gistId - Unique Gist ID.
 */
export async function starGist(token: string, gistId: string): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to star a Gist');
  }

  const cleanGistId = encodeURIComponent(gistId.trim());

  await githubFetch<null>(`/gists/${cleanGistId}/star`, token, {
    method: 'PUT',
    headers: {
      'Content-Length': '0',
    },
  });
}

/**
 * Removes star from a Gist for the authenticated user.
 *
 * @param token - Authentication token.
 * @param gistId - Unique Gist ID.
 */
export async function unstarGist(token: string, gistId: string): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to unstar a Gist');
  }

  const cleanGistId = encodeURIComponent(gistId.trim());

  await githubFetch<null>(`/gists/${cleanGistId}/star`, token, {
    method: 'DELETE',
  });
}

/**
 * Checks whether a Gist has been starred by the authenticated user.
 *
 * @param token - Authentication token.
 * @param gistId - Unique Gist ID.
 * @returns True if starred, false otherwise.
 */
export async function isGistStarred(token: string, gistId: string): Promise<boolean> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to check Gist star status');
  }

  const cleanGistId = encodeURIComponent(gistId.trim());

  try {
    await githubFetch<null>(`/gists/${cleanGistId}/star`, token, {
      method: 'GET',
    });
    return true;
  } catch (error) {
    if (error instanceof GitHubNotFoundError) {
      return false;
    }
    throw error;
  }
}

/**
 * Lists all comments posted on a Gist.
 *
 * @param gistId - Unique Gist ID.
 * @param token - Optional authentication token.
 * @returns Array of GistComment domain records.
 */
export async function listGistComments(gistId: string, token?: string): Promise<GistComment[]> {
  const cleanGistId = encodeURIComponent(gistId.trim());

  return fetchAllPages<GistComment>(
    `/gists/${cleanGistId}/comments`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Adds a new comment to a Gist.
 *
 * @param token - Authentication token.
 * @param gistId - Target Gist ID.
 * @param body - Markdown text body.
 * @returns Newly created GistComment.
 */
export async function createGistComment(
  token: string,
  gistId: string,
  body: string
): Promise<GistComment> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to comment on a Gist');
  }
  if (!gistId || !body || !body.trim()) {
    throw new GitHubValidationError('Gist ID and non-empty comment body are required');
  }

  const cleanGistId = encodeURIComponent(gistId.trim());

  return githubFetch<GistComment>(`/gists/${cleanGistId}/comments`, token, {
    method: 'POST',
    body: JSON.stringify({ body: body.trim() }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// ============================================================================
// SECTION 19: REPOSITORY WEBHOOKS & EVENT HOOK MANAGEMENT
// ============================================================================

export interface WebhookConfig {
  url: string;
  content_type?: 'json' | 'form';
  secret?: string;
  insecure_ssl?: '0' | '1' | string;
}

export interface WebhookHook {
  type: string;
  id: number;
  name: string;
  active: boolean;
  events: string[];
  config: WebhookConfig;
  updated_at: string;
  created_at: string;
  url: string;
  test_url: string;
  ping_url: string;
  deliveries_url: string;
  last_response?: {
    code: number | null;
    status: string | null;
    message: string | null;
  };
}

export interface WebhookDeliveryItem {
  id: number;
  guid: string;
  delivered_at: string;
  redelivery: boolean;
  duration: number;
  status: string;
  status_code: number;
  event: string;
  action: string | null;
  installation_id: number | null;
  repository_id: number | null;
}

export interface CreateWebhookParams {
  token: string;
  owner: string;
  repo: string;
  url: string;
  contentType?: 'json' | 'form';
  secret?: string;
  events?: string[];
  active?: boolean;
  insecureSsl?: boolean;
}

export interface UpdateWebhookParams {
  token: string;
  owner: string;
  repo: string;
  hookId: number;
  url?: string;
  contentType?: 'json' | 'form';
  secret?: string;
  events?: string[];
  active?: boolean;
  insecureSsl?: boolean;
}

/**
 * Lists all webhooks registered on a repository.
 *
 * @param token - Authentication token with admin repository privileges.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of WebhookHook domain objects.
 */
export async function listRepoWebhooks(
  token: string,
  owner: string,
  repo: string
): Promise<WebhookHook[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list webhooks');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<WebhookHook>(
    `/repos/${cleanOwner}/${cleanRepo}/hooks`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Retrieves details for a specific repository webhook.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param hookId - Numerical webhook ID.
 * @returns WebhookHook entity.
 */
export async function getRepoWebhook(
  token: string,
  owner: string,
  repo: string,
  hookId: number
): Promise<WebhookHook> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to get webhook details');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<WebhookHook>(
    `/repos/${cleanOwner}/${cleanRepo}/hooks/${hookId}`,
    token,
    {
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Creates a new incoming or outgoing webhook on a repository.
 *
 * @param params - Webhook setup parameters.
 * @returns Newly created WebhookHook domain record.
 */
export async function createRepoWebhook({
  token,
  owner,
  repo,
  url,
  contentType = 'json',
  secret,
  events = ['push'],
  active = true,
  insecureSsl = false,
}: CreateWebhookParams): Promise<WebhookHook> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a webhook');
  }
  if (!owner || !repo || !url) {
    throw new GitHubValidationError('Owner, repo, and endpoint URL are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const configPayload: Record<string, string> = {
    url: url.trim(),
    content_type: contentType,
    insecure_ssl: insecureSsl ? '1' : '0',
  };

  if (secret) {
    configPayload.secret = secret;
  }

  const payload = {
    name: 'web',
    active,
    events,
    config: configPayload,
  };

  return githubFetch<WebhookHook>(
    `/repos/${cleanOwner}/${cleanRepo}/hooks`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Updates an existing repository webhook configuration.
 *
 * @param params - Updated configuration options.
 * @returns Updated WebhookHook record.
 */
export async function updateRepoWebhook({
  token,
  owner,
  repo,
  hookId,
  url,
  contentType,
  secret,
  events,
  active,
  insecureSsl,
}: UpdateWebhookParams): Promise<WebhookHook> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update a webhook');
  }
  if (!owner || !repo || !hookId) {
    throw new GitHubValidationError('Owner, repo, and hookId are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {};
  if (active !== undefined) payload.active = active;
  if (events !== undefined) payload.events = events;

  const configUpdates: Record<string, string> = {};
  if (url !== undefined) configUpdates.url = url.trim();
  if (contentType !== undefined) configUpdates.content_type = contentType;
  if (secret !== undefined) configUpdates.secret = secret;
  if (insecureSsl !== undefined) configUpdates.insecure_ssl = insecureSsl ? '1' : '0';

  if (Object.keys(configUpdates).length > 0) {
    payload.config = configUpdates;
  }

  return githubFetch<WebhookHook>(
    `/repos/${cleanOwner}/${cleanRepo}/hooks/${hookId}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Deletes a repository webhook.
 *
 * @param token - Authentication token with admin permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param hookId - Numerical webhook ID to delete.
 */
export async function deleteRepoWebhook(
  token: string,
  owner: string,
  repo: string,
  hookId: number
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a webhook');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/hooks/${hookId}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Sends a synthetic ping event to test connectivity with a webhook target server.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param hookId - Numerical webhook ID.
 */
export async function pingRepoWebhook(
  token: string,
  owner: string,
  repo: string,
  hookId: number
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to ping a webhook');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/hooks/${hookId}/pings`,
    token,
    {
      method: 'POST',
    }
  );
}

/**
 * Lists the delivery logs and payloads for a specific repository webhook.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param hookId - Webhook ID.
 * @param perPage - Maximum deliveries per page.
 * @returns Array of WebhookDeliveryItem entries.
 */
export async function listWebhookDeliveries(
  token: string,
  owner: string,
  repo: string,
  hookId: number,
  perPage = 30
): Promise<WebhookDeliveryItem[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to fetch webhook deliveries');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<WebhookDeliveryItem>(
    `/repos/${cleanOwner}/${cleanRepo}/hooks/${hookId}/deliveries`,
    token,
    {
      queryParams: { per_page: Math.min(100, Math.max(1, perPage)) },
      cacheTtlMs: 10000,
    },
    100
  );
}

// ============================================================================
// SECTION 20: COMMIT STATUSES & CHECK RUNS / CHECK SUITES API
// ============================================================================

export type CommitStatusState = 'error' | 'failure' | 'pending' | 'success';

export interface CommitStatus {
  url: string;
  avatar_url: string;
  id: number;
  node_id: string;
  state: CommitStatusState;
  description: string | null;
  target_url: string | null;
  context: string;
  created_at: string;
  updated_at: string;
  creator: GithubRepoOwner;
}

export interface CombinedCommitStatus {
  state: CommitStatusState;
  statuses: CommitStatus[];
  sha: string;
  total_count: number;
  repository: GithubRepo;
  commit_url: string;
  url: string;
}

export interface CreateCommitStatusParams {
  token: string;
  owner: string;
  repo: string;
  sha: string;
  state: CommitStatusState;
  targetUrl?: string;
  description?: string;
  context?: string;
}

export interface CheckRunOutput {
  title: string;
  summary: string;
  text?: string;
  annotations?: Array<{
    path: string;
    start_line: number;
    end_line: number;
    start_column?: number;
    end_column?: number;
    annotation_level: 'notice' | 'warning' | 'failure';
    message: string;
    title?: string;
    raw_details?: string;
  }>;
  images?: Array<{
    alt: string;
    image_url: string;
    caption?: string;
  }>;
}

export interface CheckRun {
  id: number;
  head_sha: string;
  node_id: string;
  external_id: string;
  url: string;
  html_url: string;
  details_url: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required' | 'skipped' | null;
  started_at: string | null;
  completed_at: string | null;
  output: CheckRunOutput;
  name: string;
  check_suite: { id: number };
  app: {
    id: number;
    slug: string;
    name: string;
  };
}

export interface CreateCheckRunParams {
  token: string;
  owner: string;
  repo: string;
  name: string;
  headSha: string;
  detailsUrl?: string;
  externalId?: string;
  status?: 'queued' | 'in_progress' | 'completed';
  startedAt?: string;
  conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required' | 'skipped';
  completedAt?: string;
  output?: CheckRunOutput;
}

export interface UpdateCheckRunParams {
  token: string;
  owner: string;
  repo: string;
  checkRunId: number;
  name?: string;
  detailsUrl?: string;
  externalId?: string;
  status?: 'queued' | 'in_progress' | 'completed';
  startedAt?: string;
  conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required' | 'skipped';
  completedAt?: string;
  output?: CheckRunOutput;
}

/**
 * Creates a new commit status indicator on a commit SHA.
 *
 * @param params - Status configuration parameters.
 * @returns Created CommitStatus domain record.
 */
export async function createCommitStatus({
  token,
  owner,
  repo,
  sha,
  state,
  targetUrl,
  description,
  context = 'default',
}: CreateCommitStatusParams): Promise<CommitStatus> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a commit status');
  }
  if (!owner || !repo || !sha || !state) {
    throw new GitHubValidationError('Owner, repo, sha, and status state are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanSha = encodeURIComponent(sha.trim());

  const payload: Record<string, unknown> = {
    state,
    context: context.trim(),
  };

  if (targetUrl) payload.target_url = targetUrl.trim();
  if (description) payload.description = description.trim();

  return githubFetch<CommitStatus>(
    `/repos/${cleanOwner}/${cleanRepo}/statuses/${cleanSha}`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Retrieves the composite combined status for a specific commit ref or SHA.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param ref - Branch, tag, or 40-character commit SHA.
 * @returns CombinedCommitStatus domain object.
 */
export async function getCombinedCommitStatus(
  token: string | undefined,
  owner: string,
  repo: string,
  ref: string
): Promise<CombinedCommitStatus> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanRef = encodeURIComponent(ref.trim());

  return githubFetch<CombinedCommitStatus>(
    `/repos/${cleanOwner}/${cleanRepo}/commits/${cleanRef}/status`,
    token,
    {
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Lists all individual statuses associated with a specific ref or SHA.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param ref - Branch name or commit SHA.
 * @returns Array of CommitStatus records.
 */
export async function listCommitStatuses(
  token: string | undefined,
  owner: string,
  repo: string,
  ref: string
): Promise<CommitStatus[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanRef = encodeURIComponent(ref.trim());

  return fetchAllPages<CommitStatus>(
    `/repos/${cleanOwner}/${cleanRepo}/commits/${cleanRef}/statuses`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Creates a new Check Run for a commit in the repository.
 *
 * @param params - Check run payload options.
 * @returns Created CheckRun representation.
 */
export async function createCheckRun({
  token,
  owner,
  repo,
  name,
  headSha,
  detailsUrl,
  externalId,
  status = 'queued',
  startedAt,
  conclusion,
  completedAt,
  output,
}: CreateCheckRunParams): Promise<CheckRun> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a check run');
  }
  if (!owner || !repo || !name || !headSha) {
    throw new GitHubValidationError('Owner, repo, name, and headSha are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {
    name: name.trim(),
    head_sha: headSha.trim(),
    status,
  };

  if (detailsUrl) payload.details_url = detailsUrl.trim();
  if (externalId) payload.external_id = externalId.trim();
  if (startedAt) payload.started_at = startedAt;
  if (conclusion) payload.conclusion = conclusion;
  if (completedAt) payload.completed_at = completedAt;
  if (output) payload.output = output;

  return githubFetch<CheckRun>(
    `/repos/${cleanOwner}/${cleanRepo}/check-runs`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
      accept: 'application/vnd.github.v3+json',
    }
  );
}

/**
 * Updates an existing Check Run with progress, logs, annotations, or final conclusion.
 *
 * @param params - Check run update fields.
 * @returns Updated CheckRun object.
 */
export async function updateCheckRun({
  token,
  owner,
  repo,
  checkRunId,
  name,
  detailsUrl,
  externalId,
  status,
  startedAt,
  conclusion,
  completedAt,
  output,
}: UpdateCheckRunParams): Promise<CheckRun> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update a check run');
  }
  if (!owner || !repo || !checkRunId) {
    throw new GitHubValidationError('Owner, repo, and checkRunId are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {};
  if (name !== undefined) payload.name = name.trim();
  if (detailsUrl !== undefined) payload.details_url = detailsUrl.trim();
  if (externalId !== undefined) payload.external_id = externalId.trim();
  if (status !== undefined) payload.status = status;
  if (startedAt !== undefined) payload.started_at = startedAt;
  if (conclusion !== undefined) payload.conclusion = conclusion;
  if (completedAt !== undefined) payload.completed_at = completedAt;
  if (output !== undefined) payload.output = output;

  return githubFetch<CheckRun>(
    `/repos/${cleanOwner}/${cleanRepo}/check-runs/${checkRunId}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
      accept: 'application/vnd.github.v3+json',
    }
  );
}

/**
 * Lists all Check Runs for a specific commit reference.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param ref - Branch, tag, or commit SHA.
 * @param checkName - Optional check name filter.
 * @param status - Optional check status filter.
 * @returns Array of CheckRun entities.
 */
export async function listCheckRunsForRef(
  token: string | undefined,
  owner: string,
  repo: string,
  ref: string,
  checkName?: string,
  status?: 'queued' | 'in_progress' | 'completed'
): Promise<CheckRun[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanRef = encodeURIComponent(ref.trim());

  const queryParams: Record<string, string | number | undefined> = {
    check_name: checkName,
    status,
    per_page: 100,
  };

  const response = await githubFetch<{ total_count: number; check_runs: CheckRun[] }>(
    `/repos/${cleanOwner}/${cleanRepo}/commits/${cleanRef}/check-runs`,
    token,
    {
      queryParams,
      cacheTtlMs: 15000,
      accept: 'application/vnd.github.v3+json',
    }
  );

  return response?.check_runs || [];
}

// ============================================================================
// SECTION 21: GITHUB PACKAGES & REGISTRY ARTIFACT CLIENT
// ============================================================================

export interface PackageVersion {
  id: number;
  name: string;
  url: string;
  package_html_url: string;
  created_at: string;
  updated_at: string;
  html_url?: string;
  metadata?: {
    package_type: 'npm' | 'maven' | 'rubygems' | 'docker' | 'nuget' | 'container';
    container?: { tags: string[] };
    docker?: { tag: string[] };
  };
}

export interface Package {
  id: number;
  name: string;
  package_type: 'npm' | 'maven' | 'rubygems' | 'docker' | 'nuget' | 'container';
  owner: GithubRepoOwner;
  version_count: number;
  visibility: 'public' | 'private';
  url: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  repository?: GithubRepo;
}

/**
 * Lists all packages published by an organization.
 *
 * @param token - Authentication token with read:packages scope.
 * @param org - GitHub organization login name.
 * @param packageType - Package ecosystem filter.
 * @returns Array of Package domain objects.
 */
export async function listOrgPackages(
  token: string,
  org: string,
  packageType: 'npm' | 'maven' | 'rubygems' | 'docker' | 'nuget' | 'container' = 'container'
): Promise<Package[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list organization packages');
  }

  const cleanOrg = encodeURIComponent(org.trim());

  return fetchAllPages<Package>(
    `/orgs/${cleanOrg}/packages`,
    token,
    {
      queryParams: {
        package_type: packageType,
        per_page: 100,
      },
      cacheTtlMs: 60000,
    }
  );
}

/**
 * Lists all packages published under the authenticated user's account.
 *
 * @param token - Authentication token with read:packages scope.
 * @param packageType - Package ecosystem filter.
 * @returns Array of Package items.
 */
export async function listUserPackages(
  token: string,
  packageType: 'npm' | 'maven' | 'rubygems' | 'docker' | 'nuget' | 'container' = 'container'
): Promise<Package[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list user packages');
  }

  return fetchAllPages<Package>(
    '/user/packages',
    token,
    {
      queryParams: {
        package_type: packageType,
        per_page: 100,
      },
      cacheTtlMs: 60000,
    }
  );
}

/**
 * Lists all versions published for a specific package.
 *
 * @param token - Authentication token.
 * @param packageType - Package ecosystem type.
 * @param packageName - Package slug identifier.
 * @param org - Optional organization name (if user package, leaves undefined).
 * @returns Array of PackageVersion records.
 */
export async function listPackageVersions(
  token: string,
  packageType: 'npm' | 'maven' | 'rubygems' | 'docker' | 'nuget' | 'container',
  packageName: string,
  org?: string
): Promise<PackageVersion[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list package versions');
  }

  const cleanPkg = encodeURIComponent(packageName.trim());
  const endpoint = org
    ? `/orgs/${encodeURIComponent(org.trim())}/packages/${packageType}/${cleanPkg}/versions`
    : `/user/packages/${packageType}/${cleanPkg}/versions`;

  return fetchAllPages<PackageVersion>(
    endpoint,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Deletes an entire package from GitHub Packages registry.
 *
 * @param token - Authentication token with delete:packages scope.
 * @param packageType - Package ecosystem.
 * @param packageName - Package name.
 * @param org - Optional organization handle.
 */
export async function deletePackage(
  token: string,
  packageType: 'npm' | 'maven' | 'rubygems' | 'docker' | 'nuget' | 'container',
  packageName: string,
  org?: string
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a package');
  }

  const cleanPkg = encodeURIComponent(packageName.trim());
  const endpoint = org
    ? `/orgs/${encodeURIComponent(org.trim())}/packages/${packageType}/${cleanPkg}`
    : `/user/packages/${packageType}/${cleanPkg}`;

  await githubFetch<null>(endpoint, token, {
    method: 'DELETE',
  });
}// ============================================================================
// SECTION 22: GITHUB DISCUSSIONS & COMMUNITY FORUM API
// ============================================================================

export interface DiscussionCategory {
  id: string;
  node_id: string;
  repository_id: number;
  name: string;
  description: string;
  emoji: string;
  created_at: string;
  updated_at: string;
  is_answerable: boolean;
}

export interface DiscussionAuthor {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface DiscussionComment {
  id: number;
  node_id: string;
  html_url: string;
  parent_id: number | null;
  user: DiscussionAuthor;
  created_at: string;
  updated_at: string;
  author_association: string;
  body: string;
  reactions?: {
    url: string;
    total_count: number;
    plus_one: number;
    minus_one: number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
}

export interface Discussion {
  id: number;
  node_id: string;
  repository_url: string;
  category: DiscussionCategory;
  answer_html_url: string | null;
  answer_chosen_at: string | null;
  answer_chosen_by: DiscussionAuthor | null;
  html_url: string;
  number: number;
  title: string;
  user: DiscussionAuthor;
  state: 'open' | 'closed' | 'locked';
  locked: boolean;
  comments: number;
  created_at: string;
  updated_at: string;
  author_association: string;
  active_lock_reason: string | null;
  body: string;
}

export interface ListDiscussionsOptions extends PaginationOptions {
  categoryId?: string | number;
  pinned?: boolean;
  state?: 'open' | 'closed' | 'all';
}

export interface CreateDiscussionParams {
  token: string;
  owner: string;
  repo: string;
  title: string;
  body: string;
  categoryId: string | number;
}

export interface UpdateDiscussionParams {
  token: string;
  owner: string;
  repo: string;
  discussionNumber: number;
  title?: string;
  body?: string;
  categoryId?: string | number;
}

export interface CreateDiscussionCommentParams {
  token: string;
  owner: string;
  repo: string;
  discussionNumber: number;
  body: string;
  replyToCommentId?: number;
}

/**
 * Lists discussion categories available in a repository.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of DiscussionCategory objects.
 */
export async function listDiscussionCategories(
  token: string | undefined,
  owner: string,
  repo: string
): Promise<DiscussionCategory[]> {
  if (!owner || !repo) {
    throw new GitHubValidationError('Owner and repo parameters are mandatory for listDiscussionCategories');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<DiscussionCategory>(
    `/repos/${cleanOwner}/${cleanRepo}/discussions/categories`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 60000,
    }
  );
}

/**
 * Retrieves paginated discussions from a repository.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param options - Filtering and pagination options.
 * @returns Array of Discussion domain objects.
 */
export async function listDiscussions(
  token: string | undefined,
  owner: string,
  repo: string,
  options: ListDiscussionsOptions = {}
): Promise<Discussion[]> {
  if (!owner || !repo) {
    throw new GitHubValidationError('Owner and repo parameters are mandatory for listDiscussions');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const queryParams: Record<string, string | number | boolean | undefined> = {
    category_id: options.categoryId,
    pinned: options.pinned,
    state: options.state || 'open',
    per_page: options.per_page || 30,
    page: options.page,
  };

  return fetchAllPages<Discussion>(
    `/repos/${cleanOwner}/${cleanRepo}/discussions`,
    token,
    {
      queryParams,
      cacheTtlMs: 20000,
    },
    500
  );
}

/**
 * Retrieves details for a specific discussion.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param discussionNumber - Numerical discussion number.
 * @returns Complete Discussion domain object.
 */
export async function getDiscussion(
  token: string | undefined,
  owner: string,
  repo: string,
  discussionNumber: number
): Promise<Discussion> {
  if (!owner || !repo || !discussionNumber) {
    throw new GitHubValidationError('Owner, repo, and discussionNumber are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<Discussion>(
    `/repos/${cleanOwner}/${cleanRepo}/discussions/${discussionNumber}`,
    token,
    {
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Creates a new discussion in a repository.
 *
 * @param params - Discussion creation payload.
 * @returns Newly created Discussion object.
 */
export async function createDiscussion({
  token,
  owner,
  repo,
  title,
  body,
  categoryId,
}: CreateDiscussionParams): Promise<Discussion> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a discussion');
  }
  if (!owner || !repo || !title || !body || !categoryId) {
    throw new GitHubValidationError('Owner, repo, title, body, and categoryId are required to create a discussion');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload = {
    title: title.trim(),
    body: body.trim(),
    category_id: categoryId,
  };

  return githubFetch<Discussion>(
    `/repos/${cleanOwner}/${cleanRepo}/discussions`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Updates an existing discussion title, body, or category.
 *
 * @param params - Update discussion parameters.
 * @returns Updated Discussion domain entity.
 */
export async function updateDiscussion({
  token,
  owner,
  repo,
  discussionNumber,
  title,
  body,
  categoryId,
}: UpdateDiscussionParams): Promise<Discussion> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update a discussion');
  }
  if (!owner || !repo || !discussionNumber) {
    throw new GitHubValidationError('Owner, repo, and discussionNumber are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {};
  if (title !== undefined) payload.title = title.trim();
  if (body !== undefined) payload.body = body.trim();
  if (categoryId !== undefined) payload.category_id = categoryId;

  return githubFetch<Discussion>(
    `/repos/${cleanOwner}/${cleanRepo}/discussions/${discussionNumber}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Deletes a discussion from the repository.
 *
 * @param token - Authentication token with discussion admin permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param discussionNumber - Numerical discussion identifier.
 */
export async function deleteDiscussion(
  token: string,
  owner: string,
  repo: string,
  discussionNumber: number
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a discussion');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/discussions/${discussionNumber}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Lists all comments posted within a repository discussion.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param discussionNumber - Numerical discussion sequence number.
 * @returns Array of DiscussionComment records.
 */
export async function listDiscussionComments(
  token: string | undefined,
  owner: string,
  repo: string,
  discussionNumber: number
): Promise<DiscussionComment[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<DiscussionComment>(
    `/repos/${cleanOwner}/${cleanRepo}/discussions/${discussionNumber}/comments`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Adds a new comment or reply to an ongoing discussion.
 *
 * @param params - Comment payload parameters.
 * @returns Created DiscussionComment domain object.
 */
export async function createDiscussionComment({
  token,
  owner,
  repo,
  discussionNumber,
  body,
  replyToCommentId,
}: CreateDiscussionCommentParams): Promise<DiscussionComment> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to comment on a discussion');
  }
  if (!owner || !repo || !discussionNumber || !body) {
    throw new GitHubValidationError('Owner, repo, discussionNumber, and comment body are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {
    body: body.trim(),
  };

  if (replyToCommentId) {
    payload.reply_to_comment_id = replyToCommentId;
  }

  return githubFetch<DiscussionComment>(
    `/repos/${cleanOwner}/${cleanRepo}/discussions/${discussionNumber}/comments`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// ============================================================================
// SECTION 23: CODE SCANNING, SECRET SCANNING & DEPENDABOT SECURITY APIS
// ============================================================================

export interface CodeScanningAlertInstance {
  ref: string;
  analysis_key: string;
  environment: string;
  category?: string;
  state: 'open' | 'dismissed' | 'fixed';
  commit_sha?: string;
  message: { text: string };
  location: {
    path: string;
    start_line: number;
    end_line: number;
    start_column: number;
    end_column: number;
  };
  classifications?: string[];
}

export interface CodeScanningAlert {
  number: number;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  state: 'open' | 'dismissed' | 'fixed';
  fixed_at: string | null;
  dismissed_by: GithubRepoOwner | null;
  dismissed_at: string | null;
  dismissed_reason: 'false positive' | "won't fix" | 'used in tests' | null;
  dismissed_comment: string | null;
  rule: {
    id: string;
    severity: 'none' | 'note' | 'warning' | 'error' | null;
    description: string;
    name: string;
    tags?: string[];
    security_severity_level?: 'low' | 'medium' | 'high' | 'critical' | null;
  };
  tool: {
    name: string;
    guid?: string | null;
    version?: string | null;
  };
  most_recent_instance: CodeScanningAlertInstance;
  instances_url: string;
}

export interface SecretScanningAlert {
  number: number;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  locations_url: string;
  state: 'open' | 'resolved';
  resolution: 'false_positive' | 'wont_fix' | 'revoked' | 'used_in_tests' | null;
  resolved_at: string | null;
  resolved_by: GithubRepoOwner | null;
  resolution_comment: string | null;
  secret_type: string;
  secret_type_display_name: string;
  secret: string;
  push_protection_bypassed?: boolean;
  push_protection_bypassed_by?: GithubRepoOwner | null;
  push_protection_bypassed_at?: string | null;
}

export interface DependabotAlertSecurityAdvisory {
  ghsa_id: string;
  cve_id: string | null;
  summary: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvss: {
    score: number;
    vector_string: string | null;
  };
  cwes: Array<{ cwe_id: string; name: string }>;
  published_at: string;
  updated_at: string;
  withdrawn_at: string | null;
}

export interface DependabotAlertDependency {
  package: {
    ecosystem: string;
    name: string;
  };
  manifest_path: string;
  scope: 'development' | 'runtime' | null;
}

export interface DependabotAlert {
  number: number;
  state: 'auto_dismissed' | 'dismissed' | 'fixed' | 'open';
  dependency: DependabotAlertDependency;
  security_advisory: DependabotAlertSecurityAdvisory;
  security_vulnerability: {
    package: { ecosystem: string; name: string };
    severity: 'low' | 'medium' | 'high' | 'critical';
    vulnerable_version_range: string;
    first_patched_version: { identifier: string } | null;
  };
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  dismissed_at: string | null;
  dismissed_by: GithubRepoOwner | null;
  dismissed_reason: 'fix_started' | 'inaccurate' | 'no_bandwidth' | 'not_used' | 'tolerable_risk' | null;
  dismissed_comment: string | null;
  fixed_at: string | null;
}

/**
 * Lists code scanning alerts raised by CodeQL or 3rd-party static analysis engines.
 *
 * @param token - Authentication token with security_events scope.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param state - Filter by state ('open', 'closed', 'dismissed', 'fixed').
 * @param ref - Git branch or ref identifier.
 * @returns Array of CodeScanningAlert domain objects.
 */
export async function listCodeScanningAlerts(
  token: string,
  owner: string,
  repo: string,
  state?: 'open' | 'closed' | 'dismissed' | 'fixed',
  ref?: string
): Promise<CodeScanningAlert[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list code scanning alerts');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const queryParams: Record<string, string | number | undefined> = {
    state,
    ref,
    per_page: 100,
  };

  return fetchAllPages<CodeScanningAlert>(
    `/repos/${cleanOwner}/${cleanRepo}/code-scanning/alerts`,
    token,
    {
      queryParams,
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Retrieves details for a specific code scanning alert.
 *
 * @param token - Authentication token with security_events scope.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param alertNumber - Numerical alert identifier.
 * @returns Complete CodeScanningAlert object.
 */
export async function getCodeScanningAlert(
  token: string,
  owner: string,
  repo: string,
  alertNumber: number
): Promise<CodeScanningAlert> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to get code scanning alert');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<CodeScanningAlert>(
    `/repos/${cleanOwner}/${cleanRepo}/code-scanning/alerts/${alertNumber}`,
    token,
    {
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Updates the resolution state or dismissal reason of a code scanning alert.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param alertNumber - Alert number.
 * @param state - Target alert state ('open' or 'dismissed').
 * @param dismissedReason - Reason why the alert is dismissed.
 * @param dismissedComment - Optional dismissal note.
 * @returns Updated CodeScanningAlert representation.
 */
export async function updateCodeScanningAlert(
  token: string,
  owner: string,
  repo: string,
  alertNumber: number,
  state: 'open' | 'dismissed',
  dismissedReason?: 'false positive' | "won't fix" | 'used in tests',
  dismissedComment?: string
): Promise<CodeScanningAlert> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update alert status');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = { state };
  if (state === 'dismissed' && dismissedReason) {
    payload.dismissed_reason = dismissedReason;
    if (dismissedComment) payload.dismissed_comment = dismissedComment.trim();
  }

  return githubFetch<CodeScanningAlert>(
    `/repos/${cleanOwner}/${cleanRepo}/code-scanning/alerts/${alertNumber}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Lists all secret scanning alerts detected in the repository history.
 *
 * @param token - Authentication token with repo / security_events scopes.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param state - Filter by 'open' or 'resolved'.
 * @returns Array of SecretScanningAlert records.
 */
export async function listSecretScanningAlerts(
  token: string,
  owner: string,
  repo: string,
  state?: 'open' | 'resolved'
): Promise<SecretScanningAlert[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list secret scanning alerts');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<SecretScanningAlert>(
    `/repos/${cleanOwner}/${cleanRepo}/secret-scanning/alerts`,
    token,
    {
      queryParams: {
        state,
        per_page: 100,
      },
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Updates state and resolution for a secret scanning alert.
 *
 * @param token - Authentication token with write permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param alertNumber - Alert number.
 * @param state - 'open' or 'resolved'.
 * @param resolution - 'false_positive' | 'wont_fix' | 'revoked' | 'used_in_tests'.
 * @param resolutionComment - Optional comment string explaining resolution.
 * @returns Updated SecretScanningAlert representation.
 */
export async function updateSecretScanningAlert(
  token: string,
  owner: string,
  repo: string,
  alertNumber: number,
  state: 'open' | 'resolved',
  resolution?: 'false_positive' | 'wont_fix' | 'revoked' | 'used_in_tests',
  resolutionComment?: string
): Promise<SecretScanningAlert> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update secret scanning alert');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = { state };
  if (state === 'resolved' && resolution) {
    payload.resolution = resolution;
    if (resolutionComment) payload.resolution_comment = resolutionComment.trim();
  }

  return githubFetch<SecretScanningAlert>(
    `/repos/${cleanOwner}/${cleanRepo}/secret-scanning/alerts/${alertNumber}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Lists Dependabot vulnerability alerts for a repository.
 *
 * @param token - Authentication token with security_events / repo scope.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param state - Filter ('auto_dismissed', 'dismissed', 'fixed', 'open').
 * @param severity - Severity filter ('low', 'medium', 'high', 'critical').
 * @param ecosystem - Target ecosystem ('npm', 'pip', 'maven', 'nuget', 'composer', 'cargo', etc.).
 * @returns Array of DependabotAlert records.
 */
export async function listDependabotAlerts(
  token: string,
  owner: string,
  repo: string,
  state?: 'auto_dismissed' | 'dismissed' | 'fixed' | 'open',
  severity?: 'low' | 'medium' | 'high' | 'critical',
  ecosystem?: string
): Promise<DependabotAlert[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list Dependabot alerts');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<DependabotAlert>(
    `/repos/${cleanOwner}/${cleanRepo}/dependabot/alerts`,
    token,
    {
      queryParams: {
        state,
        severity,
        ecosystem,
        per_page: 100,
      },
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Updates Dependabot vulnerability alert status (dismissing or reopening).
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param alertNumber - Alert number.
 * @param state - 'dismissed' | 'open'.
 * @param dismissedReason - Dismissal reason.
 * @param dismissedComment - Optional comment explaining dismissal.
 * @returns Updated DependabotAlert record.
 */
export async function updateDependabotAlert(
  token: string,
  owner: string,
  repo: string,
  alertNumber: number,
  state: 'dismissed' | 'open',
  dismissedReason?: 'fix_started' | 'inaccurate' | 'no_bandwidth' | 'not_used' | 'tolerable_risk',
  dismissedComment?: string
): Promise<DependabotAlert> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update Dependabot alert');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = { state };
  if (state === 'dismissed' && dismissedReason) {
    payload.dismissed_reason = dismissedReason;
    if (dismissedComment) payload.dismissed_comment = dismissedComment.trim();
  }

  return githubFetch<DependabotAlert>(
    `/repos/${cleanOwner}/${cleanRepo}/dependabot/alerts/${alertNumber}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// ============================================================================
// SECTION 24: ACTIONS SECRETS & REPOSITORY VARIABLES MANAGEMENT
// ============================================================================

export interface ActionsPublicKey {
  key_id: string;
  key: string;
}

export interface ActionsSecretItem {
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ActionsVariableItem {
  name: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface SetActionsSecretParams {
  token: string;
  owner: string;
  repo: string;
  secretName: string;
  encryptedValue: string;
  keyId: string;
}

export interface SetActionsVariableParams {
  token: string;
  owner: string;
  repo: string;
  variableName: string;
  value: string;
}

/**
 * Retrieves the public encryption key for GitHub Actions secrets in a repository.
 *
 * @param token - Authentication token with repo administration scope.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns ActionsPublicKey object containing the Base64 public key and key_id.
 */
export async function getRepoActionsPublicKey(
  token: string,
  owner: string,
  repo: string
): Promise<ActionsPublicKey> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to get Actions public key');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<ActionsPublicKey>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/secrets/public-key`,
    token,
    {
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Lists the names and timestamps of all GitHub Actions secrets configured for a repository.
 * (Note: GitHub API never returns plaintext or encrypted secret values for security).
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of ActionsSecretItem metadata descriptors.
 */
export async function listRepoActionsSecrets(
  token: string,
  owner: string,
  repo: string
): Promise<ActionsSecretItem[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list Actions secrets');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const response = await githubFetch<{ total_count: number; secrets: ActionsSecretItem[] }>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/secrets`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 30000,
    }
  );

  return response?.secrets || [];
}

/**
 * Sets or updates an encrypted GitHub Actions secret for a repository.
 *
 * @param params - Secret name, sealed box encrypted value, and public key ID.
 */
export async function setRepoActionsSecret({
  token,
  owner,
  repo,
  secretName,
  encryptedValue,
  keyId,
}: SetActionsSecretParams): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create or update an Actions secret');
  }
  if (!owner || !repo || !secretName || !encryptedValue || !keyId) {
    throw new GitHubValidationError('Owner, repo, secretName, encryptedValue, and keyId are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanSecretName = encodeURIComponent(secretName.trim());

  const payload = {
    encrypted_value: encryptedValue.trim(),
    key_id: keyId.trim(),
  };

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/secrets/${cleanSecretName}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Deletes an Actions secret from a repository.
 *
 * @param token - Authentication token with admin repository privileges.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param secretName - Name of the secret to delete.
 */
export async function deleteRepoActionsSecret(
  token: string,
  owner: string,
  repo: string,
  secretName: string
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete an Actions secret');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanSecretName = encodeURIComponent(secretName.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/secrets/${cleanSecretName}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Lists all plain-text configuration variables declared for GitHub Actions.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of ActionsVariableItem objects.
 */
export async function listRepoActionsVariables(
  token: string,
  owner: string,
  repo: string
): Promise<ActionsVariableItem[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list Actions variables');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const response = await githubFetch<{ total_count: number; variables: ActionsVariableItem[] }>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/variables`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 30000,
    }
  );

  return response?.variables || [];
}

/**
 * Creates a new GitHub Actions configuration variable.
 *
 * @param params - Variable name and plain text value.
 */
export async function createRepoActionsVariable({
  token,
  owner,
  repo,
  variableName,
  value,
}: SetActionsVariableParams): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create an Actions variable');
  }
  if (!owner || !repo || !variableName) {
    throw new GitHubValidationError('Owner, repo, and variableName are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload = {
    name: variableName.trim(),
    value: String(value),
  };

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/variables`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Updates the value of an existing GitHub Actions configuration variable.
 *
 * @param params - Variable identifier and updated value.
 */
export async function updateRepoActionsVariable({
  token,
  owner,
  repo,
  variableName,
  value,
}: SetActionsVariableParams): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update an Actions variable');
  }
  if (!owner || !repo || !variableName) {
    throw new GitHubValidationError('Owner, repo, and variableName are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanVarName = encodeURIComponent(variableName.trim());

  const payload = {
    name: variableName.trim(),
    value: String(value),
  };

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/variables/${cleanVarName}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Deletes a GitHub Actions variable from a repository.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param variableName - Name of the variable to delete.
 */
export async function deleteRepoActionsVariable(
  token: string,
  owner: string,
  repo: string,
  variableName: string
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete an Actions variable');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanVarName = encodeURIComponent(variableName.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/actions/variables/${cleanVarName}`,
    token,
    {
      method: 'DELETE',
    }
  );
}// ============================================================================
// SECTION 25: GITHUB CODESPACES & REMOTE ENVIRONMENTS API
// ============================================================================

export interface CodespaceMachine {
  name: string;
  display_name: string;
  cpus: number;
  memory_in_bytes: number;
  storage_in_bytes: number;
  operating_system: string;
}

export interface CodespaceGitStatus {
  ahead: number;
  behind: number;
  has_unpushed_changes: boolean;
  has_uncommitted_changes: boolean;
  ref: string;
}

export interface Codespace {
  id: number;
  name: string;
  environment_id: string;
  owner: GithubRepoOwner;
  billable_owner: GithubRepoOwner;
  repository: GithubRepo;
  machine: CodespaceMachine;
  devcontainer_path: string | null;
  prebuild: boolean;
  created_at: string;
  updated_at: string;
  last_used_at: string;
  state: 'Unknown' | 'Created' | 'Queued' | 'Provisioning' | 'Available' | 'Awaiting' | 'Rebuilding' | 'Updating' | 'Rebuilding' | 'Failed' | 'Exporting' | 'Updating' | 'Rebuilding' | 'Shutdown' | 'Archived' | 'Starting' | 'Stopping';
  url: string;
  git_status: CodespaceGitStatus;
  location: string;
  idle_timeout_minutes: number;
  web_url: string;
  machines_url: string;
  start_url: string;
  stop_url: string;
  pull_request?: PullRequest;
  pending_operation?: boolean;
  pending_operation_disabled_reason?: string;
  idle_timeout_notice?: string;
  retention_period_minutes?: number;
  retention_expires_at?: string;
}

export interface CreateCodespaceParams {
  token: string;
  owner: string;
  repo: string;
  ref?: string;
  location?: string;
  machine?: string;
  devcontainerPath?: string;
  workingDirectory?: string;
  idleTimeoutMinutes?: number;
  retentionPeriodMinutes?: number;
}

export interface ExportCodespaceParams {
  token: string;
  codespaceName: string;
}

export interface CodespaceExportStatus {
  state: 'exporting' | 'completed' | 'failed' | null;
  completed_at: string | null;
  branch: string | null;
  sha: string | null;
}

/**
 * Lists all active and stopped Codespaces for the authenticated user or an organization repository.
 *
 * @param token - Authentication token with codespace scope.
 * @param org - Optional organization filter.
 * @param repo - Optional repository name filter.
 * @returns Array of Codespace records.
 */
export async function listCodespaces(
  token: string,
  org?: string,
  repo?: string
): Promise<Codespace[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list Codespaces');
  }

  let endpoint = '/user/codespaces';
  if (org && repo) {
    endpoint = `/repos/${encodeURIComponent(org.trim())}/${encodeURIComponent(repo.trim())}/codespaces`;
  }

  const response = await githubFetch<{ total_count: number; codespaces: Codespace[] }>(
    endpoint,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 15000,
    }
  );

  return response?.codespaces || [];
}

/**
 * Retrieves details for a specific Codespace by its unique name string.
 *
 * @param token - Authentication token.
 * @param codespaceName - The unique string identifier of the Codespace (e.g. 'octocat-hello-world-1234abcd').
 * @returns Codespace domain object.
 */
export async function getCodespace(
  token: string,
  codespaceName: string
): Promise<Codespace> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to get Codespace');
  }
  if (!codespaceName || !codespaceName.trim()) {
    throw new GitHubValidationError('Codespace name is required');
  }

  const cleanName = encodeURIComponent(codespaceName.trim());

  return githubFetch<Codespace>(
    `/user/codespaces/${cleanName}`,
    token,
    {
      cacheTtlMs: 10000,
    }
  );
}

/**
 * Provisions and launches a new cloud Codespace instance for a repository branch.
 *
 * @param params - Provisioning options including machine specifications and devcontainer location.
 * @returns The newly allocated Codespace entity.
 */
export async function createCodespace({
  token,
  owner,
  repo,
  ref,
  location,
  machine,
  devcontainerPath,
  workingDirectory,
  idleTimeoutMinutes,
  retentionPeriodMinutes,
}: CreateCodespaceParams): Promise<Codespace> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a Codespace');
  }
  if (!owner || !repo) {
    throw new GitHubValidationError('Owner and repo parameters are mandatory to provision a Codespace');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {};
  if (ref) payload.ref = ref.trim();
  if (location) payload.location = location.trim();
  if (machine) payload.machine = machine.trim();
  if (devcontainerPath) payload.devcontainer_path = devcontainerPath.trim();
  if (workingDirectory) payload.working_directory = workingDirectory.trim();
  if (idleTimeoutMinutes) payload.idle_timeout_minutes = idleTimeoutMinutes;
  if (retentionPeriodMinutes) payload.retention_period_minutes = retentionPeriodMinutes;

  return githubFetch<Codespace>(
    `/repos/${cleanOwner}/${cleanRepo}/codespaces`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Starts a suspended or stopped Codespace.
 *
 * @param token - Authentication token.
 * @param codespaceName - Unique Codespace identifier.
 * @returns Updated Codespace domain object in starting state.
 */
export async function startCodespace(
  token: string,
  codespaceName: string
): Promise<Codespace> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to start a Codespace');
  }
  if (!codespaceName || !codespaceName.trim()) {
    throw new GitHubValidationError('Codespace name is required');
  }

  const cleanName = encodeURIComponent(codespaceName.trim());

  return githubFetch<Codespace>(
    `/user/codespaces/${cleanName}/start`,
    token,
    {
      method: 'POST',
    }
  );
}

/**
 * Stops an active Codespace to prevent unneeded compute credit consumption.
 *
 * @param token - Authentication token.
 * @param codespaceName - Unique Codespace identifier.
 * @returns Updated Codespace domain object in stopping state.
 */
export async function stopCodespace(
  token: string,
  codespaceName: string
): Promise<Codespace> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to stop a Codespace');
  }
  if (!codespaceName || !codespaceName.trim()) {
    throw new GitHubValidationError('Codespace name is required');
  }

  const cleanName = encodeURIComponent(codespaceName.trim());

  return githubFetch<Codespace>(
    `/user/codespaces/${cleanName}/stop`,
    token,
    {
      method: 'POST',
    }
  );
}

/**
 * Permanently deletes a Codespace instance and frees attached storage.
 *
 * @param token - Authentication token.
 * @param codespaceName - Unique Codespace identifier.
 */
export async function deleteCodespace(
  token: string,
  codespaceName: string
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete a Codespace');
  }
  if (!codespaceName || !codespaceName.trim()) {
    throw new GitHubValidationError('Codespace name is required');
  }

  const cleanName = encodeURIComponent(codespaceName.trim());

  await githubFetch<null>(
    `/user/codespaces/${cleanName}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Lists available machine types and compute tiers for a repository.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param branch - Optional branch name.
 * @param location - Optional geographic datacenter location.
 * @returns Array of CodespaceMachine configurations.
 */
export async function listCodespaceMachines(
  token: string,
  owner: string,
  repo: string,
  branch?: string,
  location?: string
): Promise<CodespaceMachine[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to query Codespace machines');
  }
  if (!owner || !repo) {
    throw new GitHubValidationError('Owner and repo parameters are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const queryParams: Record<string, string | undefined> = {
    ref: branch ? branch.trim() : undefined,
    location: location ? location.trim() : undefined,
  };

  const response = await githubFetch<{ total_count: number; machines: CodespaceMachine[] }>(
    `/repos/${cleanOwner}/${cleanRepo}/codespaces/machines`,
    token,
    {
      queryParams,
      cacheTtlMs: 60000,
    }
  );

  return response?.machines || [];
}

/**
 * Exports uncommitted changes and branch states from a Codespace into a new Git branch.
 *
 * @param params - Codespace export parameter payload.
 * @returns Export operation tracking status.
 */
export async function exportCodespace({
  token,
  codespaceName,
}: ExportCodespaceParams): Promise<CodespaceExportStatus> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to export Codespace changes');
  }
  if (!codespaceName || !codespaceName.trim()) {
    throw new GitHubValidationError('Codespace name is required for export');
  }

  const cleanName = encodeURIComponent(codespaceName.trim());

  return githubFetch<CodespaceExportStatus>(
    `/user/codespaces/${cleanName}/exports`,
    token,
    {
      method: 'POST',
    }
  );
}

// ============================================================================
// SECTION 26: GITHUB COPILOT METRICS & SEAT MANAGEMENT
// ============================================================================

export interface CopilotSeatAllocation {
  created_at: string;
  updated_at: string;
  pending_cancellation_date: string | null;
  last_activity_at: string | null;
  last_activity_editor: string | null;
  plan_type: 'business' | 'enterprise';
  assignee: GithubRepoOwner;
  assigning_team?: {
    id: number;
    node_id: string;
    name: string;
    slug: string;
  };
}

export interface CopilotUsageBreakdownLanguage {
  name: string;
  total_engaged_users: number;
  total_code_suggestions: number;
  total_code_acceptances: number;
  total_code_lines_suggested: number;
  total_code_lines_accepted: number;
}

export interface CopilotUsageBreakdownEditor {
  name: string;
  total_engaged_users: number;
  models: Array<{
    name: string;
    is_custom_model: boolean;
    custom_model_training_date: string | null;
    total_engaged_users: number;
    languages: CopilotUsageBreakdownLanguage[];
  }>;
}

export interface CopilotUsageDay {
  day: string;
  total_suggestions_count: number;
  total_acceptances_count: number;
  total_lines_suggested: number;
  total_lines_accepted: number;
  total_active_users: number;
  total_chat_acceptances?: number;
  total_chat_turns?: number;
  total_active_chat_users?: number;
  breakdown: CopilotUsageBreakdownEditor[];
}

export interface AssignCopilotSeatParams {
  token: string;
  org: string;
  selectedUsernames: string[];
}

/**
 * Retrieves the high-level Copilot for Business billing and seat count summary for an organization.
 *
 * @param token - Authentication token with manage_billing:copilot or admin:org scope.
 * @param org - GitHub organization slug.
 * @returns Summary of seat totals and billing configuration.
 */
export async function getOrgCopilotBilling(
  token: string,
  org: string
): Promise<{
  seat_breakdown: {
    total: number;
    added_this_cycle: number;
    pending_invitation: number;
    pending_cancellation: number;
    active_this_cycle: number;
    inactive_this_cycle: number;
  };
  seat_management_setting: 'assign_all' | 'assign_selected' | 'disabled';
  public_code_suggestions: 'allow' | 'block' | 'unconfigured';
  ide_chat?: 'enabled' | 'disabled' | 'unconfigured';
  cli?: 'enabled' | 'disabled' | 'unconfigured';
}> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to get Copilot billing info');
  }

  const cleanOrg = encodeURIComponent(org.trim());

  return githubFetch(
    `/orgs/${cleanOrg}/copilot/billing`,
    token,
    {
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Lists all active Copilot seat allocations and assigned developers in an organization.
 *
 * @param token - Authentication token.
 * @param org - GitHub organization slug.
 * @param page - Page number.
 * @param perPage - Maximum results per page.
 * @returns Array of CopilotSeatAllocation items.
 */
export async function listOrgCopilotSeats(
  token: string,
  org: string,
  page = 1,
  perPage = 50
): Promise<CopilotSeatAllocation[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list Copilot seats');
  }

  const cleanOrg = encodeURIComponent(org.trim());

  const response = await githubFetch<{ total_seats: number; seats: CopilotSeatAllocation[] }>(
    `/orgs/${cleanOrg}/copilot/billing/seats`,
    token,
    {
      queryParams: {
        page,
        per_page: Math.min(100, Math.max(1, perPage)),
      },
      cacheTtlMs: 30000,
    }
  );

  return response?.seats || [];
}

/**
 * Assigns Copilot seats to one or more organization members.
 *
 * @param params - Organization handle and array of usernames to assign.
 * @returns Summary of newly assigned seats.
 */
export async function assignCopilotSeats({
  token,
  org,
  selectedUsernames,
}: AssignCopilotSeatParams): Promise<{ seats_created: number }> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to assign Copilot seats');
  }
  if (!org || !selectedUsernames || selectedUsernames.length === 0) {
    throw new GitHubValidationError('Organization and selected usernames are required');
  }

  const cleanOrg = encodeURIComponent(org.trim());

  return githubFetch<{ seats_created: number }>(
    `/orgs/${cleanOrg}/copilot/billing/selected_users`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        selected_usernames: selectedUsernames.map((u) => u.trim()),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Cancels or unassigns Copilot seats for specified users in an organization.
 *
 * @param token - Authentication token.
 * @param org - GitHub organization handle.
 * @param usernames - List of usernames whose seats should be revoked.
 * @returns Number of seats cancelled.
 */
export async function cancelCopilotSeats(
  token: string,
  org: string,
  usernames: string[]
): Promise<{ seats_cancelled: number }> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to revoke Copilot seats');
  }
  if (!org || !usernames || usernames.length === 0) {
    throw new GitHubValidationError('Organization and usernames are required');
  }

  const cleanOrg = encodeURIComponent(org.trim());

  return githubFetch<{ seats_cancelled: number }>(
    `/orgs/${cleanOrg}/copilot/billing/selected_users`,
    token,
    {
      method: 'DELETE',
      body: JSON.stringify({
        selected_usernames: usernames.map((u) => u.trim()),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Retrieves granular aggregated Copilot code completion and chat usage metrics for an organization.
 *
 * @param token - Authentication token with copilot scope.
 * @param org - GitHub organization name.
 * @param since - Optional start date ISO 8601 string (YYYY-MM-DD).
 * @param until - Optional end date ISO 8601 string (YYYY-MM-DD).
 * @returns Array of Copilot daily usage metric entries.
 */
export async function getOrgCopilotUsageMetrics(
  token: string,
  org: string,
  since?: string,
  until?: string
): Promise<CopilotUsageDay[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to query Copilot usage metrics');
  }

  const cleanOrg = encodeURIComponent(org.trim());
  const queryParams: Record<string, string | undefined> = {
    since,
    until,
  };

  return githubFetch<CopilotUsageDay[]>(
    `/orgs/${cleanOrg}/copilot/usage`,
    token,
    {
      queryParams,
      cacheTtlMs: 60000,
    }
  );
}

// ============================================================================
// SECTION 27: REPOSITORY COLLABORATORS, TEAMS & ACCESS CONTROL / PERMISSIONS
// ============================================================================

export interface RepositoryCollaborator extends GithubRepoOwner {
  permissions: RepositoryPermissions;
  role_name: string;
}

export interface RepositoryInvitation {
  id: number;
  repository: GithubRepo;
  invitee: GithubRepoOwner | null;
  inviter: GithubRepoOwner;
  permissions: 'read' | 'write' | 'admin' | 'triage' | 'maintain';
  created_at: string;
  url: string;
  html_url: string;
}

export interface Team {
  id: number;
  node_id: string;
  name: string;
  slug: string;
  description: string | null;
  privacy: 'secret' | 'closed';
  permission: string;
  url: string;
  html_url: string;
  members_url: string;
  repositories_url: string;
}

export interface AddCollaboratorParams {
  token: string;
  owner: string;
  repo: string;
  username: string;
  permission?: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
}

/**
 * Lists all collaborators assigned directly or via teams to a repository.
 *
 * @param token - Authentication token with push/admin rights.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param affiliation - Filter collaborators: 'outside', 'direct', or 'all' (default).
 * @returns Array of RepositoryCollaborator records.
 */
export async function listRepoCollaborators(
  token: string,
  owner: string,
  repo: string,
  affiliation: 'outside' | 'direct' | 'all' = 'all'
): Promise<RepositoryCollaborator[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list collaborators');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<RepositoryCollaborator>(
    `/repos/${cleanOwner}/${cleanRepo}/collaborators`,
    token,
    {
      queryParams: {
        affiliation,
        per_page: 100,
      },
      cacheTtlMs: 30000,
    }
  );
}

/**
 * Invites a user to collaborate on a repository with specified permission levels.
 *
 * @param params - Collaborator invitation parameters.
 * @returns Created RepositoryInvitation object or null if existing collaborator.
 */
export async function addRepoCollaborator({
  token,
  owner,
  repo,
  username,
  permission = 'push',
}: AddCollaboratorParams): Promise<RepositoryInvitation | null> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to add collaborator');
  }
  if (!owner || !repo || !username) {
    throw new GitHubValidationError('Owner, repo, and username are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanUser = encodeURIComponent(username.trim());

  return githubFetch<RepositoryInvitation | null>(
    `/repos/${cleanOwner}/${cleanRepo}/collaborators/${cleanUser}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify({ permission }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Removes a collaborator from a repository.
 *
 * @param token - Authentication token with admin scope.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param username - Username of collaborator to remove.
 */
export async function removeRepoCollaborator(
  token: string,
  owner: string,
  repo: string,
  username: string
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to remove collaborator');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanUser = encodeURIComponent(username.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/collaborators/${cleanUser}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Checks a user's exact permission level on a given repository.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param username - Username to verify.
 * @returns Permission object and permission role string.
 */
export async function getRepoPermissionForUser(
  token: string,
  owner: string,
  repo: string,
  username: string
): Promise<{ permission: string; role_name: string; user: GithubRepoOwner }> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to inspect user permissions');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanUser = encodeURIComponent(username.trim());

  return githubFetch(
    `/repos/${cleanOwner}/${cleanRepo}/collaborators/${cleanUser}/permission`,
    token,
    {
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Lists pending collaboration invitations for a repository.
 *
 * @param token - Authentication token with admin rights.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of RepositoryInvitation records.
 */
export async function listRepoInvitations(
  token: string,
  owner: string,
  repo: string
): Promise<RepositoryInvitation[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list repository invitations');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<RepositoryInvitation>(
    `/repos/${cleanOwner}/${cleanRepo}/invitations`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 15000,
    }
  );
}

/**
 * Cancels or deletes a pending repository invitation.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param invitationId - Numerical invitation ID.
 */
export async function deleteRepoInvitation(
  token: string,
  owner: string,
  repo: string,
  invitationId: number
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete repository invitation');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/invitations/${invitationId}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Lists all teams belonging to an organization.
 *
 * @param token - Authentication token with read:org scope.
 * @param org - GitHub organization name.
 * @returns Array of Team domain objects.
 */
export async function listOrgTeams(
  token: string,
  org: string
): Promise<Team[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list organization teams');
  }

  const cleanOrg = encodeURIComponent(org.trim());

  return fetchAllPages<Team>(
    `/orgs/${cleanOrg}/teams`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 60000,
    }
  );
}

/**
 * Checks team repository permissions or sets team access to a repository.
 *
 * @param token - Authentication token.
 * @param org - Organization login slug.
 * @param teamSlug - Team identifier slug.
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param permission - Permission level ('pull', 'push', 'admin', 'maintain', 'triage').
 */
export async function addTeamRepoPermission(
  token: string,
  org: string,
  teamSlug: string,
  owner: string,
  repo: string,
  permission: 'pull' | 'push' | 'admin' | 'maintain' | 'triage' = 'push'
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to grant team permissions');
  }

  const cleanOrg = encodeURIComponent(org.trim());
  const cleanTeam = encodeURIComponent(teamSlug.trim());
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/orgs/${cleanOrg}/teams/${cleanTeam}/repos/${cleanOwner}/${cleanRepo}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify({ permission }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Removes a team's access to a repository.
 *
 * @param token - Authentication token with admin permissions.
 * @param org - Organization slug.
 * @param teamSlug - Team slug.
 * @param owner - Repository owner.
 * @param repo - Repository name.
 */
export async function removeTeamFromRepo(
  token: string,
  org: string,
  teamSlug: string,
  owner: string,
  repo: string
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to remove team from repo');
  }

  const cleanOrg = encodeURIComponent(org.trim());
  const cleanTeam = encodeURIComponent(teamSlug.trim());
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/orgs/${cleanOrg}/teams/${cleanTeam}/repos/${cleanOwner}/${cleanRepo}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

// ============================================================================
// SECTION 28: REPOSITORY TRAFFIC, CLONES, VIEWS & ANALYTICS
// ============================================================================

export interface TrafficDataPoint {
  timestamp: string;
  count: number;
  uniques: number;
}

export interface RepositoryViewTraffic {
  count: number;
  uniques: number;
  views: TrafficDataPoint[];
}

export interface RepositoryCloneTraffic {
  count: number;
  uniques: number;
  clones: TrafficDataPoint[];
}

export interface ReferrerTraffic {
  referrer: string;
  count: number;
  uniques: number;
}

export interface PopularPathTraffic {
  path: string;
  title: string;
  count: number;
  uniques: number;
}

/**
 * Retrieves daily or weekly view count statistics and unique visitor telemetry for a repository.
 *
 * @param token - Authentication token with push access to the repository.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param per - Time granularity ('day' or 'week'). Defaults to 'day'.
 * @returns RepositoryViewTraffic analytics object.
 */
export async function getRepoViews(
  token: string,
  owner: string,
  repo: string,
  per: 'day' | 'week' = 'day'
): Promise<RepositoryViewTraffic> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to fetch repository view analytics');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<RepositoryViewTraffic>(
    `/repos/${cleanOwner}/${cleanRepo}/traffic/views`,
    token,
    {
      queryParams: { per },
      cacheTtlMs: 300000, // 5 minutes cache for analytics
    }
  );
}

/**
 * Retrieves git clone traffic and unique cloner counts for a repository.
 *
 * @param token - Authentication token with push access.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param per - Time bucket interval ('day' or 'week').
 * @returns RepositoryCloneTraffic record.
 */
export async function getRepoClones(
  token: string,
  owner: string,
  repo: string,
  per: 'day' | 'week' = 'day'
): Promise<RepositoryCloneTraffic> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to fetch repository clone analytics');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<RepositoryCloneTraffic>(
    `/repos/${cleanOwner}/${cleanRepo}/traffic/clones`,
    token,
    {
      queryParams: { per },
      cacheTtlMs: 300000,
    }
  );
}

/**
 * Retrieves the top referring domains and external sites that directed traffic to the repository.
 *
 * @param token - Authentication token with push permissions.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of ReferrerTraffic objects.
 */
export async function getTopReferrers(
  token: string,
  owner: string,
  repo: string
): Promise<ReferrerTraffic[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to fetch top referrers');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<ReferrerTraffic[]>(
    `/repos/${cleanOwner}/${cleanRepo}/traffic/popular/referrers`,
    token,
    {
      cacheTtlMs: 300000,
    }
  );
}

/**
 * Retrieves the top 10 most popular content paths and files viewed in the repository over the last 14 days.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of PopularPathTraffic items.
 */
export async function getTopPaths(
  token: string,
  owner: string,
  repo: string
): Promise<PopularPathTraffic[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to fetch top popular paths');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return githubFetch<PopularPathTraffic[]>(
    `/repos/${cleanOwner}/${cleanRepo}/traffic/popular/paths`,
    token,
    {
      cacheTtlMs: 300000,
    }
  );
}

/**
 * Lists all users who have starred a repository, optionally including timestamps with star creation dates.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param detailed - When true, returns objects with starred_at timestamps.
 * @returns Array of GitHubRepoOwner user records or starred timestamp objects.
 */
export async function listStargazers(
  token: string | undefined,
  owner: string,
  repo: string,
  detailed = false
): Promise<Array<GithubRepoOwner | { starred_at: string; user: GithubRepoOwner }>> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const acceptHeader = detailed
    ? 'application/vnd.github.star+json'
    : 'application/vnd.github.v3+json';

  return fetchAllPages(
    `/repos/${cleanOwner}/${cleanRepo}/stargazers`,
    token,
    {
      queryParams: { per_page: 100 },
      accept: acceptHeader,
      cacheTtlMs: 60000,
    },
    2000
  );
}

/**
 * Lists all users watching/subscribed to notifications for a repository.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of GithubRepoOwner user accounts.
 */
export async function listWatchers(
  token: string | undefined,
  owner: string,
  repo: string
): Promise<GithubRepoOwner[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  return fetchAllPages<GithubRepoOwner>(
    `/repos/${cleanOwner}/${cleanRepo}/subscribers`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 60000,
    },
    2000
  );
}// ============================================================================
// SECTION 29: GITHUB GRAPHQL API CLIENT & GRAPH QUERY ENGINE
// ============================================================================

export interface GraphQLErrorLocation {
  line: number;
  column: number;
}

export interface GraphQLErrorItem {
  message: string;
  type?: string;
  path?: (string | number)[];
  locations?: GraphQLErrorLocation[];
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLErrorItem[];
  extensions?: {
    warnings?: Array<{ message: string; type: string }>;
    rateLimit?: {
      limit: number;
      cost: number;
      remaining: number;
      resetAt: string;
    };
  };
}

export interface GraphQLRequestOptions {
  variables?: Record<string, unknown>;
  operationName?: string;
  timeoutMs?: number;
  skipCache?: boolean;
  cacheTtlMs?: number;
}

export class GitHubGraphQLError extends GitHubServiceError {
  constructor(
    message: string,
    public readonly errors: GraphQLErrorItem[],
    public readonly partialData?: unknown
  ) {
    super(`GitHub GraphQL Error: ${message}`, { errors, partialData });
    this.name = 'GitHubGraphQLError';
  }
}

/**
 * High-performance GraphQL query and mutation client for GitHub API v4.
 * Handles rate-limit cost tracking, query execution, variable serialization, and error decomposition.
 *
 * @param query - The GraphQL query or mutation string.
 * @param token - Authentication token with appropriate scopes.
 * @param options - Variables, operation name, timeout, and caching options.
 * @param config - Global GitHub API configuration overrides.
 * @returns Parsed GraphQL payload data.
 */
export async function githubGraphQL<T>(
  query: string,
  token: string,
  options: GraphQLRequestOptions = {},
  config: GitHubApiConfig = {}
): Promise<T> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required for GitHub GraphQL operations');
  }
  if (!query || !query.trim()) {
    throw new GitHubValidationError('A non-empty GraphQL query string is required');
  }

  const mergedConfig: Required<GitHubApiConfig> = {
    ...DEFAULT_GITHUB_CONFIG,
    ...config,
  };

  const endpoint = `${mergedConfig.baseUrl.replace(/\/+$/, '')}/graphql`;
  const bodyPayload = JSON.stringify({
    query: query.trim(),
    variables: options.variables || {},
    operationName: options.operationName,
  });

  const cacheKey = `graphql:${token.slice(-8)}:${bodyPayload}`;
  if (mergedConfig.enableCache && !options.skipCache && !query.trim().startsWith('mutation')) {
    const cached = globalRequestCache.get<T>(cacheKey);
    if (cached !== null) {
      if (mergedConfig.debugLogging) {
        console.debug(`[githubService:graphql-cache-hit] ${options.operationName || 'Anonymous Query'}`);
      }
      return cached;
    }
  }

  const response = await githubFetch<GraphQLResponse<T>>(
    endpoint,
    token,
    {
      method: 'POST',
      body: bodyPayload,
      headers: {
        'Content-Type': 'application/json',
      },
      timeoutMs: options.timeoutMs || mergedConfig.timeoutMs,
      skipCache: true,
    },
    config
  );

  if (response.extensions?.rateLimit) {
    const rl = response.extensions.rateLimit;
    if (mergedConfig.debugLogging) {
      console.debug(`[githubService:graphql-rate-limit] Cost: ${rl.cost}, Remaining: ${rl.remaining}/${rl.limit}`);
    }
  }

  if (response.errors && response.errors.length > 0) {
    const primaryErrorMsg = response.errors.map((e) => e.message).join(' | ');
    throw new GitHubGraphQLError(primaryErrorMsg, response.errors, response.data);
  }

  if (!response.data) {
    throw new GitHubServiceError('GraphQL query completed with empty data payload');
  }

  if (mergedConfig.enableCache && !options.skipCache && !query.trim().startsWith('mutation')) {
    const ttl = options.cacheTtlMs ?? mergedConfig.defaultCacheTtlMs;
    globalRequestCache.set(cacheKey, response.data, ttl);
  }

  return response.data;
}

/**
 * GraphQL query helper to fetch full repository overview including discussions,
 * vulnerability alerts, and branch protection metrics in a single network roundtrip.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner login.
 * @param repo - Repository name.
 * @returns Deep repository GraphQL domain model.
 */
export async function fetchRepositoryDeepGraphQL(
  token: string,
  owner: string,
  repo: string
): Promise<{
  repository: {
    id: string;
    name: string;
    description: string | null;
    stargazerCount: number;
    forkCount: number;
    isPrivate: boolean;
    defaultBranchRef: {
      name: string;
      target: {
        oid: string;
        message?: string;
      };
    } | null;
    diskUsage: number;
    primaryLanguage: { name: string; color: string } | null;
    openIssues: { totalCount: number };
    openPullRequests: { totalCount: number };
    releases: {
      totalCount: number;
      nodes: Array<{ tagName: string; publishedAt: string; name: string }>;
    };
  };
}> {
  const query = `
    query GetRepoDeepInfo($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        name
        description
        stargazerCount
        forkCount
        isPrivate
        diskUsage
        primaryLanguage {
          name
          color
        }
        defaultBranchRef {
          name
          target {
            oid
            ... on Commit {
              message
            }
          }
        }
        openIssues: issues(states: OPEN) {
          totalCount
        }
        openPullRequests: pullRequests(states: OPEN) {
          totalCount
        }
        releases(first: 5, orderBy: { field: CREATED_AT, direction: DESC }) {
          totalCount
          nodes {
            tagName
            publishedAt
            name
          }
        }
      }
    }
  `;

  return githubGraphQL(query, token, {
    variables: {
      owner: owner.trim(),
      name: repo.trim(),
    },
    operationName: 'GetRepoDeepInfo',
    cacheTtlMs: 30000,
  });
}

// ============================================================================
// SECTION 30: REPOSITORY DISPATCH, ENVIRONMENTS & DEPLOYMENTS API
// ============================================================================

export interface EnvironmentProtectionRule {
  id: number;
  node_id: string;
  type: 'wait_timer' | 'required_reviewers' | 'branch_policy';
  wait_timer?: number;
  reviewers?: Array<{
    type: 'User' | 'Team';
    reviewer: GithubRepoOwner | Team;
  }>;
}

export interface DeploymentEnvironment {
  id: number;
  node_id: string;
  name: string;
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  protection_rules: EnvironmentProtectionRule[];
  deployment_branch_policy?: {
    protected_branches: boolean;
    custom_branch_policies: boolean;
  };
}

export interface CreateDeploymentParams {
  token: string;
  owner: string;
  repo: string;
  ref: string;
  task?: string;
  autoMerge?: boolean;
  requiredContexts?: string[];
  payload?: Record<string, unknown>;
  environment?: string;
  description?: string;
  transientEnvironment?: boolean;
  productionEnvironment?: boolean;
}

export interface Deployment {
  url: string;
  id: number;
  node_id: string;
  sha: string;
  ref: string;
  task: string;
  payload: Record<string, unknown>;
  original_environment: string;
  environment: string;
  description: string | null;
  creator: GithubRepoOwner;
  created_at: string;
  updated_at: string;
  statuses_url: string;
  repository_url: string;
  transient_environment: boolean;
  production_environment: boolean;
}

export interface DeploymentStatus {
  url: string;
  id: number;
  node_id: string;
  state: 'error' | 'failure' | 'inactive' | 'in_progress' | 'queued' | 'pending' | 'success';
  creator: GithubRepoOwner;
  description: string | null;
  environment: string;
  target_url: string | null;
  created_at: string;
  updated_at: string;
  deployment_url: string;
  repository_url: string;
  environment_url?: string;
  log_url?: string;
}

export interface CreateDeploymentStatusParams {
  token: string;
  owner: string;
  repo: string;
  deploymentId: number;
  state: 'error' | 'failure' | 'inactive' | 'in_progress' | 'queued' | 'pending' | 'success';
  targetUrl?: string;
  logUrl?: string;
  description?: string;
  environment?: string;
  environmentUrl?: string;
  autoInactive?: boolean;
}

export interface TriggerRepoDispatchParams {
  token: string;
  owner: string;
  repo: string;
  eventType: string;
  clientPayload?: Record<string, unknown>;
}

/**
 * Triggers a custom `repository_dispatch` webhook event for GitHub Actions workflows.
 *
 * @param params - Custom event type slug and arbitrary JSON payload dictionary.
 */
export async function triggerRepositoryDispatch({
  token,
  owner,
  repo,
  eventType,
  clientPayload = {},
}: TriggerRepoDispatchParams): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to trigger repository dispatch');
  }
  if (!owner || !repo || !eventType) {
    throw new GitHubValidationError('Owner, repo, and eventType are mandatory for repository dispatch');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/dispatches`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        event_type: eventType.trim(),
        client_payload: clientPayload,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Lists all deployment environments defined in a repository.
 *
 * @param token - Authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @returns Array of DeploymentEnvironment objects.
 */
export async function listEnvironments(
  token: string,
  owner: string,
  repo: string
): Promise<DeploymentEnvironment[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list deployment environments');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const response = await githubFetch<{ total_count: number; environments: DeploymentEnvironment[] }>(
    `/repos/${cleanOwner}/${cleanRepo}/environments`,
    token,
    {
      queryParams: { per_page: 100 },
      cacheTtlMs: 30000,
    }
  );

  return response?.environments || [];
}

/**
 * Creates or updates a deployment environment with protection rules.
 *
 * @param token - Authentication token with admin repository privileges.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param environmentName - Name of the environment (e.g. 'production', 'staging').
 * @param waitTimer - Optional delay in minutes before deployment executes.
 * @param preventSelfReview - Whether creator can approve their own deployment.
 * @returns Created or updated DeploymentEnvironment entity.
 */
export async function createOrUpdateEnvironment(
  token: string,
  owner: string,
  repo: string,
  environmentName: string,
  waitTimer?: number,
  preventSelfReview = false
): Promise<DeploymentEnvironment> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to configure environment');
  }
  if (!owner || !repo || !environmentName) {
    throw new GitHubValidationError('Owner, repo, and environmentName are required');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanEnv = encodeURIComponent(environmentName.trim());

  const payload: Record<string, unknown> = {
    prevent_self_review: preventSelfReview,
  };

  if (waitTimer !== undefined) {
    payload.wait_timer = Math.max(0, waitTimer);
  }

  return githubFetch<DeploymentEnvironment>(
    `/repos/${cleanOwner}/${cleanRepo}/environments/${cleanEnv}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Deletes a deployment environment from a repository.
 *
 * @param token - Authentication token with repo administration rights.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param environmentName - Name of the environment to destroy.
 */
export async function deleteEnvironment(
  token: string,
  owner: string,
  repo: string,
  environmentName: string
): Promise<void> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to delete environment');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());
  const cleanEnv = encodeURIComponent(environmentName.trim());

  await githubFetch<null>(
    `/repos/${cleanOwner}/${cleanRepo}/environments/${cleanEnv}`,
    token,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Creates a new Deployment event targeting an environment.
 *
 * @param params - Deployment parameters including target ref and payload.
 * @returns The newly created Deployment domain representation.
 */
export async function createDeployment({
  token,
  owner,
  repo,
  ref,
  task = 'deploy',
  autoMerge = false,
  requiredContexts = [],
  payload = {},
  environment = 'production',
  description = '',
  transientEnvironment = false,
  productionEnvironment = true,
}: CreateDeploymentParams): Promise<Deployment> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to create a deployment');
  }
  if (!owner || !repo || !ref) {
    throw new GitHubValidationError('Owner, repo, and ref are required to create a deployment');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const body = {
    ref: ref.trim(),
    task: task.trim(),
    auto_merge: autoMerge,
    required_contexts: requiredContexts,
    payload,
    environment: environment.trim(),
    description: description.trim(),
    transient_environment: transientEnvironment,
    production_environment: productionEnvironment,
  };

  return githubFetch<Deployment>(
    `/repos/${cleanOwner}/${cleanRepo}/deployments`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Lists deployments for a repository with filtering options.
 *
 * @param token - Optional authentication token.
 * @param owner - Repository owner username.
 * @param repo - Repository name.
 * @param environment - Optional environment filter.
 * @param ref - Optional git ref filter.
 * @returns Array of Deployment domain records.
 */
export async function listDeployments(
  token: string | undefined,
  owner: string,
  repo: string,
  environment?: string,
  ref?: string
): Promise<Deployment[]> {
  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const queryParams: Record<string, string | number | undefined> = {
    environment,
    ref,
    per_page: 100,
  };

  return fetchAllPages<Deployment>(
    `/repos/${cleanOwner}/${cleanRepo}/deployments`,
    token,
    {
      queryParams,
      cacheTtlMs: 20000,
    }
  );
}

/**
 * Creates a status update on an active Deployment.
 *
 * @param params - Status progress and telemetry payload.
 * @returns Created DeploymentStatus domain object.
 */
export async function createDeploymentStatus({
  token,
  owner,
  repo,
  deploymentId,
  state,
  targetUrl,
  logUrl,
  description,
  environment,
  environmentUrl,
  autoInactive = true,
}: CreateDeploymentStatusParams): Promise<DeploymentStatus> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to update deployment status');
  }
  if (!owner || !repo || !deploymentId || !state) {
    throw new GitHubValidationError('Owner, repo, deploymentId, and state are mandatory');
  }

  const cleanOwner = encodeURIComponent(owner.trim());
  const cleanRepo = encodeURIComponent(repo.trim());

  const payload: Record<string, unknown> = {
    state,
    auto_inactive: autoInactive,
  };

  if (targetUrl) payload.target_url = targetUrl.trim();
  if (logUrl) payload.log_url = logUrl.trim();
  if (description) payload.description = description.trim();
  if (environment) payload.environment = environment.trim();
  if (environmentUrl) payload.environment_url = environmentUrl.trim();

  return githubFetch<DeploymentStatus>(
    `/repos/${cleanOwner}/${cleanRepo}/deployments/${deploymentId}/statuses`,
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
      accept: 'application/vnd.github.flash-preview+json, application/vnd.github.ant-man-preview+json',
    }
  );
}

// ============================================================================
// SECTION 31: AUTHENTICATED USER IDENTITY, ORGS & CODEOWNERS ENGINE
// ============================================================================

export interface AuthenticatedUser extends GithubRepoOwner {
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  two_factor_authentication?: boolean;
  plan?: {
    name: string;
    space: number;
    collaborators: number;
    private_repos: number;
  };
}

export interface UserEmailEntry {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: 'public' | 'private' | null;
}

export interface OrganizationMembership {
  url: string;
  state: 'active' | 'pending';
  role: 'admin' | 'member';
  organization_url: string;
  organization: GithubRepoOwner;
  user: GithubRepoOwner;
}

export interface CodeownersRule {
  pattern: string;
  owners: string[];
  lineNumber: number;
  rawLine: string;
}

export interface CodeownersParseResult {
  rules: CodeownersRule[];
  errors: Array<{ line: number; message: string }>;
}

/**
 * Retrieves full user profile information for the authenticated token owner.
 *
 * @param token - GitHub authentication token.
 * @returns Detailed AuthenticatedUser object.
 */
export async function getAuthenticatedUser(token: string): Promise<AuthenticatedUser> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to fetch user identity');
  }

  return githubFetch<AuthenticatedUser>('/user', token, {
    cacheTtlMs: 60000,
  });
}

/**
 * Retrieves all verified and unverified email addresses for the authenticated user.
 *
 * @param token - Authentication token with user:email scope.
 * @returns Array of UserEmailEntry objects.
 */
export async function getUserEmails(token: string): Promise<UserEmailEntry[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to query user emails');
  }

  return githubFetch<UserEmailEntry[]>('/user/emails', token, {
    cacheTtlMs: 60000,
  });
}

/**
 * Retrieves all organizations the authenticated user belongs to.
 *
 * @param token - Authentication token.
 * @returns Array of GithubRepoOwner organization accounts.
 */
export async function getUserOrgs(token: string): Promise<GithubRepoOwner[]> {
  if (!token) {
    throw new GitHubAuthenticationError('Authentication token is required to list organizations');
  }

  return fetchAllPages<GithubRepoOwner>('/user/orgs', token, {
    queryParams: { per_page: 100 },
    cacheTtlMs: 60000,
  });
}

/**
 * Parses and validates GitHub CODEOWNERS syntax from string content or repository file.
 * Supports standard glob patterns, username handlers, team handles, and email addresses.
 *
 * @param rawContent - The plain text contents of a CODEOWNERS file.
 * @returns Structured CodeownersParseResult with resolved rules and syntax error warnings.
 */
export function parseCodeownersContent(rawContent: string): CodeownersParseResult {
  if (!rawContent || typeof rawContent !== 'string') {
    return { rules: [], errors: [] };
  }

  const lines = rawContent.split(/\r?\n/);
  const rules: CodeownersRule[] = [];
  const errors: Array<{ line: number; message: string }> = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const lineNumber = idx + 1;
    const rawLine = lines[idx];
    const trimmed = rawLine.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const tokens = trimmed.split(/\s+/).filter(Boolean);
    if (tokens.length < 2) {
      errors.push({
        line: lineNumber,
        message: `Line must specify at least one owner following the pattern: "${trimmed}"`,
      });
      continue;
    }

    const pattern = tokens[0];
    const owners = tokens.slice(1);

    // Validate owner identifiers (@user, @org/team, or email address)
    const validOwners: string[] = [];
    for (const owner of owners) {
      if (owner.startsWith('@') || owner.includes('@')) {
        validOwners.push(owner);
      } else {
        errors.push({
          line: lineNumber,
          message: `Invalid owner format "${owner}". Expected @username, @org/team, or email.`,
        });
      }
    }

    if (validOwners.length > 0) {
      rules.push({
        pattern,
        owners: validOwners,
        lineNumber,
        rawLine,
      });
    }
  }

  return { rules, errors };
}

/**
 * Resolves the assigned code owners for a specific relative file path given CODEOWNERS rules.
 * Follows GitHub's precedence rules (last matching pattern in the file wins).
 *
 * @param filePath - The relative file path to test (e.g. 'src/services/auth.ts').
 * @param rules - Array of parsed CodeownersRule entities.
 * @returns Array of owner identifier strings.
 */
export function resolveCodeownersForPath(filePath: string, rules: CodeownersRule[]): string[] {
  const normalizedPath = normalizeRepoPath(filePath);
  let matchedOwners: string[] = [];

  for (const rule of rules) {
    let pattern = rule.pattern.replace(/^\//, ''); // Strip leading slash

    // Exact file match
    if (pattern === normalizedPath) {
      matchedOwners = rule.owners;
      continue;
    }

    // Directory wildcard match
    if (pattern.endsWith('/')) {
      if (normalizedPath.startsWith(pattern) || normalizedPath.startsWith(pattern.slice(0, -1))) {
        matchedOwners = rule.owners;
        continue;
      }
    }

    // Universal catch-all
    if (pattern === '*') {
      matchedOwners = rule.owners;
      continue;
    }

    // Extension wildcard match (e.g. *.ts or src/**/*.js)
    if (pattern.includes('*')) {
      const regexPattern = '^' + pattern
        .replace(/\./g, '\\.')
        .replace(/\*\*/g, '.*')
        .replace(/\*(?!\*)/g, '[^/]*')
        .replace(/\/$/, '') + '.*$';

      try {
        const regex = new RegExp(regexPattern);
        if (regex.test(normalizedPath)) {
          matchedOwners = rule.owners;
        }
      } catch {
        // Fallback for pattern parsing
      }
    }
  }

  return matchedOwners;
}

// ============================================================================
// SECTION 32: GIT DIFF & UNIFIED PATCH MANIPULATION ENGINE
// ============================================================================

export interface DiffHunkLine {
  type: 'add' | 'delete' | 'context';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface DiffHunk {
  header: string;
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffHunkLine[];
}

export interface ParsedFileDiff {
  oldPath: string;
  newPath: string;
  isNew: boolean;
  isDeleted: boolean;
  isRenamed: boolean;
  hunks: DiffHunk[];
  additions: number;
  deletions: number;
}

/**
 * Parses raw unified diff string output into a structured semantic model of changes and hunks.
 *
 * @param rawDiff - Unified Git diff text.
 * @returns Array of ParsedFileDiff structures.
 */
export function parseUnifiedDiff(rawDiff: string): ParsedFileDiff[] {
  if (!rawDiff || typeof rawDiff !== 'string') {
    return [];
  }

  const files: ParsedFileDiff[] = [];
  const lines = rawDiff.split('\n');

  let currentFile: ParsedFileDiff | null = null;
  let currentHunk: DiffHunk | null = null;
  let oldLineCounter = 0;
  let newLineCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('diff --git')) {
      if (currentFile) {
        if (currentHunk) currentFile.hunks.push(currentHunk);
        files.push(currentFile);
      }
      currentHunk = null;

      const headerMatch = line.match(/^diff --git a\/(.*) b\/(.*)$/);
      const oldPath = headerMatch ? headerMatch[1] : '';
      const newPath = headerMatch ? headerMatch[2] : '';

      currentFile = {
        oldPath,
        newPath,
        isNew: false,
        isDeleted: false,
        isRenamed: false,
        hunks: [],
        additions: 0,
        deletions: 0,
      };
      continue;
    }

    if (!currentFile) continue;

    if (line.startsWith('new file mode')) {
      currentFile.isNew = true;
      continue;
    }
    if (line.startsWith('deleted file mode')) {
      currentFile.isDeleted = true;
      continue;
    }
    if (line.startsWith('rename from')) {
      currentFile.isRenamed = true;
      continue;
    }

    // Hunk Header: @@ -oldStart,oldLines +newStart,newLines @@
    if (line.startsWith('@@ ')) {
      if (currentHunk) {
        currentFile.hunks.push(currentHunk);
      }

      const hunkMatch = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)$/);
      if (hunkMatch) {
        const oldStart = parseInt(hunkMatch[1], 10);
        const oldLines = hunkMatch[2] !== undefined ? parseInt(hunkMatch[2], 10) : 1;
        const newStart = parseInt(hunkMatch[3], 10);
        const newLines = hunkMatch[4] !== undefined ? parseInt(hunkMatch[4], 10) : 1;

        oldLineCounter = oldStart;
        newLineCounter = newStart;

        currentHunk = {
          header: line,
          oldStart,
          oldLines,
          newStart,
          newLines,
          lines: [],
        };
      }
      continue;
    }

    if (currentHunk) {
      if (line.startsWith('+')) {
        currentFile.additions++;
        currentHunk.lines.push({
          type: 'add',
          newLineNumber: newLineCounter++,
          content: line.substring(1),
        });
      } else if (line.startsWith('-')) {
        currentFile.deletions++;
        currentHunk.lines.push({
          type: 'delete',
          oldLineNumber: oldLineCounter++,
          content: line.substring(1),
        });
      } else if (line.startsWith(' ') || line === '') {
        currentHunk.lines.push({
          type: 'context',
          oldLineNumber: oldLineCounter++,
          newLineNumber: newLineCounter++,
          content: line.startsWith(' ') ? line.substring(1) : line,
        });
      }
    }
  }

  if (currentFile) {
    if (currentHunk) currentFile.hunks.push(currentHunk);
    files.push(currentFile);
  }

  return files;
}

/**
 * Computes standard Git SHA-1 hash for a given string content using browser Crypto API or Node crypto fallback.
 * Follows exact Git blob format: "blob <size>\0<content>".
 *
 * @param content - Plain text or binary-safe string content.
 * @returns 40-character hexadecimal Git SHA-1 hash.
 */
export async function calculateGitBlobSha(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const contentBytes = encoder.encode(content);
  const header = `blob ${contentBytes.byteLength}\0`;
  const headerBytes = encoder.encode(header);

  const totalBytes = new Uint8Array(headerBytes.byteLength + contentBytes.byteLength);
  totalBytes.set(headerBytes, 0);
  totalBytes.set(contentBytes, headerBytes.byteLength);

  if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
    const hashBuffer = await crypto.subtle.digest('SHA-1', totalBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for Node environments if global crypto is absent
  if (typeof require !== 'undefined') {
    try {
      const nodeCrypto = require('crypto');
      const hash = nodeCrypto.createHash('sha1');
      hash.update(header);
      hash.update(content);
      return hash.digest('hex');
    } catch {
      // ignore
    }
  }

  throw new GitHubServiceError('SHA-1 cryptographic hashing is not supported in the current runtime environment');
}
// ============================================================================
// SECTION 33: COMPREHENSIVE GITHUB CLIENT FACADE INSTANCE (SINGLETON & CONSTRUCTOR)
// ============================================================================

/**
 * Factory and stateful client class providing a complete object-oriented interface
 * across all GitHub REST API and GraphQL subsystems.
 */
export class GitHubServiceClient {
  private token?: string;
  private config: Required<GitHubApiConfig>;

  constructor(token?: string, config: GitHubApiConfig = {}) {
    this.token = token;
    this.config = {
      ...DEFAULT_GITHUB_CONFIG,
      ...config,
    };
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public getToken(): string | undefined {
    return this.token;
  }

  public updateConfig(config: Partial<GitHubApiConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  // Repository Operations
  public async getRepos(type?: 'all' | 'owner' | 'public' | 'private' | 'member', sort?: 'created' | 'updated' | 'pushed' | 'full_name', direction?: 'asc' | 'desc'): Promise<GithubRepo[]> {
    return fetchAllRepos(this.token, type, sort, direction);
  }

  public async getUserRepos(username: string, sort?: 'created' | 'updated' | 'pushed' | 'full_name'): Promise<GithubRepo[]> {
    return fetchUserRepos(username, sort);
  }

  public async getOrgRepos(org: string, type?: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member'): Promise<GithubRepo[]> {
    return fetchOrgRepos(org, this.token, type);
  }

  public async getRepoDetails(owner: string, repo: string): Promise<GithubRepo> {
    return getRepoDetails(owner, repo, this.token);
  }

  public async createRepo(params: Omit<CreateRepoParams, 'token'>): Promise<GithubRepo> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for createRepo');
    return createRepo({ ...params, token: this.token });
  }

  public async updateRepo(owner: string, repo: string, updates: Parameters<typeof updateRepo>[2]): Promise<GithubRepo> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for updateRepo');
    return updateRepo(owner, repo, updates, this.token);
  }

  public async deleteRepo(owner: string, repo: string): Promise<void> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for deleteRepo');
    return deleteRepo(owner, repo, this.token);
  }

  public async forkRepo(owner: string, repo: string, organization?: string, name?: string): Promise<GithubRepo> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for forkRepo');
    return forkRepo({ token: this.token, owner, repo, organization, name });
  }

  public async getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    return getRepoLanguages(owner, repo, this.token);
  }

  public async getReadme(owner: string, repo: string, branch?: string): Promise<{ content: string; path: string; sha: string }> {
    return getRepoReadme(owner, repo, branch, this.token);
  }

  // Trees and Content
  public async getTree(owner: string, repo: string, branchOrSha: string): Promise<(DirNode | FileNode)[]> {
    return fetchRepoTree(this.token, owner, repo, branchOrSha);
  }

  public async getFlatTree(owner: string, repo: string, branchOrSha: string, recursive = true): Promise<GitTreeItem[]> {
    return fetchFlatRepoTree(this.token, owner, repo, branchOrSha, recursive);
  }

  public async getContents(owner: string, repo: string, path = '', branch?: string): Promise<GithubFile | GithubFile[]> {
    return getRepoContents(owner, repo, path, branch, this.token);
  }

  public async getAllFiles(owner: string, repo: string, branch?: string, filterBinary = true): Promise<GithubFile[]> {
    return getAllRepoFilesRecursively(owner, repo, branch, this.token, filterBinary);
  }

  public async getFile(owner: string, repo: string, path: string, branch?: string): Promise<{ path: string; content: string; sha: string; size: number; encoding: string }> {
    return getFileContent(this.token, owner, repo, path, branch);
  }

  public async commit(owner: string, repo: string, branch: string, path: string, content: string, message: string, sha?: string): Promise<string> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for commit');
    return commitFile({ token: this.token, owner, repo, branch, path, content, message, sha });
  }

  public async batchCommit(owner: string, repo: string, branch: string, message: string, files: BatchFileEntry[], deletedPaths?: string[]): Promise<string> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for batchCommit');
    return batchCommitFiles({ token: this.token, owner, repo, branch, message, files, deletedPaths });
  }

  public async deleteFile(owner: string, repo: string, path: string, message: string, branch: string, sha?: string): Promise<string> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for deleteFile');
    return deleteFile(this.token, owner, repo, path, message, branch, sha);
  }

  // Branching & Commits
  public async getBranches(owner: string, repo: string, protectedOnly = false): Promise<Branch[]> {
    return getRepoBranches(this.token, owner, repo, protectedOnly);
  }

  public async getBranch(owner: string, repo: string, branch: string): Promise<Branch> {
    return getBranch(this.token, owner, repo, branch);
  }

  public async createBranch(owner: string, repo: string, newBranchName: string, baseSha: string): Promise<GitReference> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for createBranch');
    return createBranch({ token: this.token, owner, repo, newBranchName, baseSha });
  }

  public async deleteBranch(owner: string, repo: string, branch: string): Promise<void> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for deleteBranch');
    return deleteBranch(this.token, owner, repo, branch);
  }

  public async listCommits(owner: string, repo: string, branchOrSha?: string, path?: string, limit = 100): Promise<CommitItem[]> {
    return listCommits(owner, repo, branchOrSha, path, this.token, limit);
  }

  public async getCommit(owner: string, repo: string, commitSha: string): Promise<CommitItem> {
    return getCommitDetails(owner, repo, commitSha, this.token);
  }

  public async compare(owner: string, repo: string, base: string, head: string): ReturnType<typeof compareCommits> {
    return compareCommits(owner, repo, base, head, this.token);
  }

  // Pull Requests
  public async listPRs(owner: string, repo: string, options?: ListPullRequestsOptions): Promise<PullRequest[]> {
    return listPullRequests(this.token, owner, repo, options);
  }

  public async getPR(owner: string, repo: string, pullNumber: number): Promise<PullRequest> {
    return getPullRequest(this.token, owner, repo, pullNumber);
  }

  public async createPR(owner: string, repo: string, title: string, body: string, head: string, base: string, draft = false): Promise<PullRequest> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for createPR');
    return createPullRequest({ token: this.token, owner, repo, title, body, head, base, draft });
  }

  public async mergePR(owner: string, repo: string, pullNumber: number, method: 'merge' | 'squash' | 'rebase' = 'merge', commitTitle?: string, commitMessage?: string): Promise<PullRequestMergeResult> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for mergePR');
    return mergePullRequest({ token: this.token, owner, repo, pullNumber, mergeMethod: method, commitTitle, commitMessage });
  }

  // GitHub Actions
  public async getWorkflows(owner: string, repo: string): Promise<{ total_count: number; workflows: Workflow[] }> {
    return getRepoWorkflows(this.token, owner, repo);
  }

  public async triggerWorkflow(owner: string, repo: string, workflowId: string | number, ref: string, inputs?: Record<string, string | number | boolean>): Promise<void> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for triggerWorkflow');
    return triggerWorkflow({ token: this.token, owner, repo, workflowId, ref, inputs });
  }

  public async getRuns(owner: string, repo: string, workflowId?: string | number, options?: ListWorkflowRunsOptions): Promise<{ total_count: number; workflow_runs: WorkflowRun[] }> {
    return getWorkflowRuns(this.token, owner, repo, workflowId, options);
  }

  public async getRunLogs(owner: string, repo: string, runId: number): Promise<string> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for getRunLogs');
    return getWorkflowRunLogs(this.token, owner, repo, runId);
  }

  // Issues & Discussions
  public async listIssues(owner: string, repo: string, options?: ListIssuesOptions): Promise<Issue[]> {
    return listIssues(this.token, owner, repo, options);
  }

  public async getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    return getIssue(this.token, owner, repo, issueNumber);
  }

  public async createIssue(owner: string, repo: string, title: string, body?: string, assignees?: string[], labels?: string[]): Promise<Issue> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for createIssue');
    return createIssue({ token: this.token, owner, repo, title, body, assignees, labels });
  }

  public async createIssueComment(owner: string, repo: string, issueNumber: number, body: string): Promise<IssueComment> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for createIssueComment');
    return createIssueComment({ token: this.token, owner, repo, issueNumber, body });
  }

  // Releases
  public async getReleases(owner: string, repo: string): Promise<Release[]> {
    return listReleases(this.token, owner, repo);
  }

  public async getLatestRelease(owner: string, repo: string): Promise<Release> {
    return getLatestRelease(this.token, owner, repo);
  }

  public async createRelease(params: Omit<CreateReleaseParams, 'token'>): Promise<Release> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for createRelease');
    return createRelease({ ...params, token: this.token });
  }

  // Search Engine
  public async searchRepos(query: string, sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated', order?: 'asc' | 'desc', page = 1, per_page = 30): Promise<SearchResult<GithubRepo>> {
    return searchRepositories({ query, sort, order, page, per_page }, this.token);
  }

  public async searchCode(query: string, sort?: 'indexed', order?: 'asc' | 'desc', page = 1, per_page = 30): Promise<SearchResult<CodeSearchItem>> {
    return searchCode({ query, sort, order, page, per_page }, this.token);
  }

  public async searchIssues(query: string, sort?: 'comments' | 'reactions' | 'created' | 'updated', order?: 'asc' | 'desc', page = 1, per_page = 30): Promise<SearchResult<Issue>> {
    return searchIssues(query, this.token, sort, order, page, per_page);
  }

  // GraphQL
  public async graphql<T>(query: string, variables?: Record<string, unknown>, operationName?: string): Promise<T> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for GraphQL queries');
    return githubGraphQL<T>(query, this.token, { variables, operationName });
  }

  // User Profile
  public async getProfile(): Promise<AuthenticatedUser> {
    if (!this.token) throw new GitHubAuthenticationError('Token required for getProfile');
    return getAuthenticatedUser(this.token);
  }
}

/**
 * Global default client instance for application-wide reuse.
 */
export const defaultGitHubClient = new GitHubServiceClient();// ============================================================================
// SECTION 34: COMPREHENSIVE BACKWARD COMPATIBILITY & LEGACY EXPORT INTERFACES
// ============================================================================

/**
 * Legacy compatibility object export preserving the exact function signature
 * expectations of all historical repositories and client integrations.
 */
export const githubService = {
  /**
   * Fetches repositories for a user with automatic pagination up to 10 pages.
   */
  async getUserRepos(username = 'jocall3'): Promise<GithubRepo[]> {
    return fetchUserRepos(username, 'updated', 100);
  },

  /**
   * Retrieves repository metadata details.
   */
  async getRepoDetails(repoName: string, username = 'jocall3'): Promise<GithubRepo> {
    return getRepoDetails(username, repoName);
  },

  /**
   * Recursively scans and collects code and document files within a repository.
   */
  async getAllRepoFilesRecursively(
    repoName: string,
    path = '',
    username = 'jocall3'
  ): Promise<GithubFile[]> {
    return getAllRepoFilesRecursively(username, repoName, undefined, undefined, true);
  },

  /**
   * Retrieves contents of a directory or file.
   */
  async getRepoContents(
    repoName: string,
    path = '',
    username = 'jocall3'
  ): Promise<GithubFile | GithubFile[]> {
    return getRepoContents(username, repoName, path);
  },

  /**
   * Fetches raw string text content from a direct download or raw blob URL.
   */
  async getFileContent(url: string): Promise<string> {
    return fetchRawGithubContent(url);
  },

  /**
   * Top-level reference to the core fetch engine for custom REST invocations.
   */
  fetch: githubFetch,

  /**
   * Top-level reference to GraphQL engine.
   */
  graphql: githubGraphQL,

  /**
   * Access to active cache and rate limiting metrics.
   */
  getRateLimitStatus(resource: 'core' | 'search' = 'core') {
    return globalRateLimiter.getStatus(resource);
  },

  /**
   * Clears in-memory HTTP response cache.
   */
  clearCache() {
    globalRequestCache.clear();
  },
};

/**
 * Compatibility alias for fetching directory contents in legacy workflows.
 */
export async function fetchRepoContents(
  owner: string,
  repo: string,
  path = ''
): Promise<any[]> {
  try {
    const res = await getRepoContents(owner, repo, path);
    return Array.isArray(res) ? res : [res];
  } catch (error) {
    console.error('GitHub contents fetch error:', error);
    return [];
  }
}

/**
 * Standard default export providing direct access to the GitHubServiceClient singleton.
 */
export default defaultGitHubClient;