// REPOSITORY SOURCE: diplomat-bit/ai-banking-swarm-roster | PATH: diplomat-bit-ai-banking-swarm-roster-20297ff/services/githubService.ts
================================================================================

import { GithubRepo, GitTreeItem, FileNode, DirNode, Branch, PullRequest, Workflow, WorkflowRun } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

async function githubFetch<T,>(url: string, token: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    // For raw text responses (like logs), we can't parse JSON.
    if (response.headers.get('content-type')?.includes('text/plain')) {
        const text = await response.text();
        throw new Error(`GitHub API Error: ${response.status} ${text}`);
    }
    const errorData = await response.json();
    throw new Error(`GitHub API Error: ${response.status} ${errorData.message || ''}`);
  }

  // Handle '204 No Content' responses
  if (response.status === 204 || response.status === 201 && !response.body) {
    return null as T;
  }
  
  if (options.headers && (options.headers as any).Accept === 'application/vnd.github.v3.raw') {
    return response.text() as unknown as T;
  }
  return response.json();
}

export async function fetchAllRepos(token: string): Promise<GithubRepo[]> {
  let allRepos: GithubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const repos = await githubFetch<GithubRepo[]>(`/user/repos?type=owner&per_page=${perPage}&page=${page}`, token);
    allRepos = allRepos.concat(repos);
    if (repos.length < perPage) {
      break;
    }
    page++;
  }
  return allRepos;
}

const buildTreeStructure = (items: GitTreeItem[]): (DirNode | FileNode)[] => {
  // Use a temporary type for building, where children is a map for efficient lookups.
  type TempDirNode = { type: 'dir'; path: string; name: string; children: { [key: string]: TempDirNode | FileNode } };
  const root: { children: { [key: string]: TempDirNode | FileNode } } = { children: {} };

  items.forEach(item => {
    if (item.type !== 'blob') return; // Only process files (blobs)
    const parts = item.path.split('/');
    let currentLevel = root.children;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const currentPath = parts.slice(0, index + 1).join('/');

      if (isFile) {
        if (!currentLevel[part]) {
          currentLevel[part] = { type: 'file', path: item.path, name: part };
        }
      } else {
        if (!currentLevel[part]) {
          currentLevel[part] = { type: 'dir', path: currentPath, name: part, children: {} };
        }
        // Now we are sure currentLevel[part] is a directory node in our temporary structure
        currentLevel = (currentLevel[part] as TempDirNode).children;
      }
    });
  });

  // Recursive function to convert the temp structure (with object children) to the final one (with array children).
  const convertToArrayAndSort = (level: { [key: string]: TempDirNode | FileNode }): (DirNode | FileNode)[] => {
    const nodes = Object.values(level).map(node => {
      if (node.type === 'dir') {
        const childrenArray = convertToArrayAndSort((node as TempDirNode).children);
        return { ...node, children: childrenArray } as DirNode;
      }
      return node as FileNode;
    });

    // Sort nodes: directories first, then files, all alphabetically.
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    return nodes;
  };

  return convertToArrayAndSort(root.children);
};


export async function fetchRepoTree(token: string, owner: string, repo: string, branch: string): Promise<(DirNode | FileNode)[]> {
  const { tree } = await githubFetch<{ tree: GitTreeItem[] }>(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, token);
  return buildTreeStructure(tree);
}


export async function getFileContent(token: string, owner: string, repo: string, path: string, branch?: string): Promise<{ path: string; content: string; sha: string }> {
  const url = branch ? `/repos/${owner}/${repo}/contents/${path}?ref=${branch}` : `/repos/${owner}/${repo}/contents/${path}`;
  const data = await githubFetch<{ path: string, content: string, sha: string }>(url, token);
  return {
    ...data,
    content: atob(data.content), // GitHub API returns content base64 encoded
  };
}

export async function getRepoBranches(token: string, owner: string, repo: string): Promise<Branch[]> {
  return githubFetch<Branch[]>(`/repos/${owner}/${repo}/branches?per_page=100`, token);
}

export async function getBranch(token: string, owner: string, repo: string, branch: string): Promise<Branch> {
    return githubFetch<Branch>(`/repos/${owner}/${repo}/branches/${branch}`, token);
}

export async function createBranch(token: string, owner: string, repo: string, newBranchName: string, baseSha: string): Promise<any> {
  const data = {
    ref: `refs/heads/${newBranchName}`,
    sha: baseSha,
  };
  return githubFetch(`/repos/${owner}/${repo}/git/refs`, token, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

interface CreateRepoParams {
  token: string;
  name: string;
  description: string;
  isPrivate: boolean;
}

export async function createRepo({ token, name, description, isPrivate }: CreateRepoParams): Promise<GithubRepo> {
  const repoData = {
    name,
    description,
    private: isPrivate,
    auto_init: true, // Auto-initialize with a README to avoid empty repo issues
  };
  return githubFetch<GithubRepo>('/user/repos', token, {
    method: 'POST',
    body: JSON.stringify(repoData),
    headers: { 'Content-Type': 'application/json' },
  });
}

interface CommitFileParams {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  content: string;
  message: string;
  sha?: string; // The blob SHA of the file being replaced. Optional for new files.
}

/**
 * Encodes a UTF-8 string to Base64.
 * This is necessary because the standard `btoa` function can throw an error
 * if the string contains characters outside the Latin-1 range.
 * @param str The string to encode.
 * @returns The Base64 encoded string.
 */
function utf8_to_b64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}


export async function commitFile({ token, owner, repo, branch, path, content, message, sha }: CommitFileParams): Promise<string> {
    const commitData = {
        message,
        content: utf8_to_b64(content), // base64 encode the content, supporting UTF-8
        ...(sha && { sha }),
        branch,
    };

    const result = await githubFetch<{ content: { sha: string } }>(`/repos/${owner}/${repo}/contents/${path}`, token, {
        method: 'PUT',
        body: JSON.stringify(commitData),
        headers: { 'Content-Type': 'application/json' },
    });
    
    return result.content.sha;
}


interface CreatePullRequestParams {
  token: string;
  owner: string;
  repo: string;
  title: string;
  body: string;
  head: string; // The name of the branch where your changes are implemented.
  base: string; // The name of the branch you want the changes pulled into.
}

export async function createPullRequest({ token, owner, repo, title, body, head, base }: CreatePullRequestParams): Promise<PullRequest> {
  const prData = {
    title,
    body,
    head,
    base,
  };
  return githubFetch<PullRequest>(`/repos/${owner}/${repo}/pulls`, token, {
    method: 'POST',
    body: JSON.stringify(prData),
    headers: { 'Content-Type': 'application/json' },
  });
}

// --- GitHub Actions API Functions ---

export async function getRepoWorkflows(token: string, owner: string, repo: string): Promise<{total_count: number, workflows: Workflow[]}> {
    return githubFetch<{total_count: number, workflows: Workflow[]}>(`/repos/${owner}/${repo}/actions/workflows`, token);
}

export async function triggerWorkflow(token: string, owner: string, repo: string, workflow_id: string | number, branch: string): Promise<null> {
    const data = { ref: branch };
    return githubFetch<null>(`/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`, token, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function getWorkflowRuns(token: string, owner: string, repo: string, workflow_id: string | number, branch: string): Promise<{ total_count: number, workflow_runs: WorkflowRun[] }> {
    return githubFetch<{ total_count: number, workflow_runs: WorkflowRun[] }>(`/repos/${owner}/${repo}/actions/workflows/${workflow_id}/runs?branch=${encodeURIComponent(branch)}`, token);
}

export async function getWorkflowRun(token: string, owner: string, repo: string, run_id: number): Promise<WorkflowRun> {
    return githubFetch<WorkflowRun>(`/repos/${owner}/${repo}/actions/runs/${run_id}`, token);
}

export async function getWorkflowRunLogs(token: string, owner: string, repo: string, run_id: number): Promise<string> {
    const jobsResponse = await githubFetch<{ jobs: { id: number, conclusion: string }[] }>(`/repos/${owner}/${repo}/actions/runs/${run_id}/jobs`, token);
    
    // Prioritize logs from failed jobs, but get all if none failed (e.g., cancelled).
    const failedJobs = jobsResponse.jobs.filter(job => job.conclusion === 'failure');
    const jobsToLog = failedJobs.length > 0 ? failedJobs : jobsResponse.jobs;

    let allLogs = '';
    for (const job of jobsToLog) {
        try {
            const log = await githubFetch<string>(`/repos/${owner}/${repo}/actions/jobs/${job.id}/logs`, token, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            });
            allLogs += `\n\n--- LOGS FOR JOB ${job.id} (Conclusion: ${job.conclusion}) ---\n\n${log}`;
        } catch (error) {
            console.error(`Could not fetch logs for job ${job.id}`, error);
            allLogs += `\n\n--- FAILED TO FETCH LOGS FOR JOB ${job.id} ---`;
        }
    }

    return allLogs;
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/ai-powe3red-chromos-file-manager- | ORIGINAL PATH: diplomat-bit-ai-powe3red-chromos-file-manager--4e3b7ea/services/githubService.ts
================================================================================


import { FileItem, FileType } from "../types";

const GITHUB_API = "https://api.github.com";

export async function fetchUserRepos(username: string): Promise<any[]> {
  try {
    const response = await fetch(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=30`);
    if (!response.ok) throw new Error("User not found");
    return await response.json();
  } catch (error) {
    console.error("GitHub fetch error:", error);
    return [];
  }
}

export async function fetchRepoContents(owner: string, repo: string, path: string = ""): Promise<any[]> {
  try {
    const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("GitHub contents fetch error:", error);
    return [];
  }
}

export async function fetchRawGithubContent(downloadUrl: string): Promise<string> {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) return "Error fetching content.";
    return await response.text();
  } catch (error) {
    return "Failed to load file content.";
  }
}

export function mapGithubToFiles(
  ghItems: any[], 
  parentId: string, 
  owner: string, 
  repoName: string
): FileItem[] {
  return ghItems.map(item => {
    const isRepo = !!item.full_name; // Repos have full_name, contents don't
    const type = (isRepo || item.type === 'dir') ? FileType.FOLDER : FileType.DOCUMENT;
    
    return {
      id: isRepo ? `repo-${item.id}` : `gh-${item.sha || Math.random().toString(36).substr(2, 9)}`,
      name: item.name,
      type: type,
      size: item.size || null,
      lastModified: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : new Date().toLocaleDateString(),
      parentId,
      source: 'github',
      githubOwner: owner,
      githubRepo: isRepo ? item.name : repoName,
      githubUrl: item.html_url,
      content: item.download_url, // Use this to fetch actual text later
      extension: item.name.split('.').pop(),
      mimeType: (isRepo || item.type === 'dir') ? undefined : 'text/plain'
    };
  });
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/autoomousai | ORIGINAL PATH: diplomat-bit-autoomousai-f4d320c/services/githubService.ts
================================================================================

import { GithubRepo, GitTreeItem, FileNode, DirNode, Branch, PullRequest, Workflow, WorkflowRun } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

async function githubFetch<T,>(url: string, token: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    // For raw text responses (like logs), we can't parse JSON.
    if (response.headers.get('content-type')?.includes('text/plain')) {
        const text = await response.text();
        throw new Error(`GitHub API Error: ${response.status} ${text}`);
    }
    const errorData = await response.json();
    throw new Error(`GitHub API Error: ${response.status} ${errorData.message || ''}`);
  }

  // Handle '204 No Content' responses
  if (response.status === 204 || response.status === 201 && !response.body) {
    return null as T;
  }
  
  if (options.headers && (options.headers as any).Accept === 'application/vnd.github.v3.raw') {
    return response.text() as unknown as T;
  }
  return response.json();
}

export async function fetchAllRepos(token: string): Promise<GithubRepo[]> {
  let allRepos: GithubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const repos = await githubFetch<GithubRepo[]>(`/user/repos?type=owner&per_page=${perPage}&page=${page}`, token);
    allRepos = allRepos.concat(repos);
    if (repos.length < perPage) {
      break;
    }
    page++;
  }
  return allRepos;
}

const buildTreeStructure = (items: GitTreeItem[]): (DirNode | FileNode)[] => {
  // Use a temporary type for building, where children is a map for efficient lookups.
  type TempDirNode = { type: 'dir'; path: string; name: string; children: { [key: string]: TempDirNode | FileNode } };
  const root: { children: { [key: string]: TempDirNode | FileNode } } = { children: {} };

  items.forEach(item => {
    if (item.type !== 'blob') return; // Only process files (blobs)
    const parts = item.path.split('/');
    let currentLevel = root.children;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const currentPath = parts.slice(0, index + 1).join('/');

      if (isFile) {
        if (!currentLevel[part]) {
          currentLevel[part] = { type: 'file', path: item.path, name: part };
        }
      } else {
        if (!currentLevel[part]) {
          currentLevel[part] = { type: 'dir', path: currentPath, name: part, children: {} };
        }
        // Now we are sure currentLevel[part] is a directory node in our temporary structure
        currentLevel = (currentLevel[part] as TempDirNode).children;
      }
    });
  });

  // Recursive function to convert the temp structure (with object children) to the final one (with array children).
  const convertToArrayAndSort = (level: { [key: string]: TempDirNode | FileNode }): (DirNode | FileNode)[] => {
    const nodes = Object.values(level).map(node => {
      if (node.type === 'dir') {
        const childrenArray = convertToArrayAndSort((node as TempDirNode).children);
        return { ...node, children: childrenArray } as DirNode;
      }
      return node as FileNode;
    });

    // Sort nodes: directories first, then files, all alphabetically.
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    return nodes;
  };

  return convertToArrayAndSort(root.children);
};


export async function fetchRepoTree(token: string, owner: string, repo: string, branch: string): Promise<(DirNode | FileNode)[]> {
  const { tree } = await githubFetch<{ tree: GitTreeItem[] }>(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, token);
  return buildTreeStructure(tree);
}


export async function getFileContent(token: string, owner: string, repo: string, path: string, branch?: string): Promise<{ path: string; content: string; sha: string }> {
  const url = branch ? `/repos/${owner}/${repo}/contents/${path}?ref=${branch}` : `/repos/${owner}/${repo}/contents/${path}`;
  const data = await githubFetch<{ path: string, content: string, sha: string }>(url, token);
  return {
    ...data,
    content: atob(data.content), // GitHub API returns content base64 encoded
  };
}

export async function getRepoBranches(token: string, owner: string, repo: string): Promise<Branch[]> {
  return githubFetch<Branch[]>(`/repos/${owner}/${repo}/branches?per_page=100`, token);
}

export async function getBranch(token: string, owner: string, repo: string, branch: string): Promise<Branch> {
    return githubFetch<Branch>(`/repos/${owner}/${repo}/branches/${branch}`, token);
}

export async function createBranch(token: string, owner: string, repo: string, newBranchName: string, baseSha: string): Promise<any> {
  const data = {
    ref: `refs/heads/${newBranchName}`,
    sha: baseSha,
  };
  return githubFetch(`/repos/${owner}/${repo}/git/refs`, token, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

interface CreateRepoParams {
  token: string;
  name: string;
  description: string;
  isPrivate: boolean;
}

export async function createRepo({ token, name, description, isPrivate }: CreateRepoParams): Promise<GithubRepo> {
  const repoData = {
    name,
    description,
    private: isPrivate,
    auto_init: true, // Auto-initialize with a README to avoid empty repo issues
  };
  return githubFetch<GithubRepo>('/user/repos', token, {
    method: 'POST',
    body: JSON.stringify(repoData),
    headers: { 'Content-Type': 'application/json' },
  });
}

interface CommitFileParams {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  content: string;
  message: string;
  sha?: string; // The blob SHA of the file being replaced. Optional for new files.
}

/**
 * Encodes a UTF-8 string to Base64.
 * This is necessary because the standard `btoa` function can throw an error
 * if the string contains characters outside the Latin-1 range.
 * @param str The string to encode.
 * @returns The Base64 encoded string.
 */
function utf8_to_b64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}


export async function commitFile({ token, owner, repo, branch, path, content, message, sha }: CommitFileParams): Promise<string> {
    const commitData = {
        message,
        content: utf8_to_b64(content), // base64 encode the content, supporting UTF-8
        ...(sha && { sha }),
        branch,
    };

    const result = await githubFetch<{ content: { sha: string } }>(`/repos/${owner}/${repo}/contents/${path}`, token, {
        method: 'PUT',
        body: JSON.stringify(commitData),
        headers: { 'Content-Type': 'application/json' },
    });
    
    return result.content.sha;
}


interface CreatePullRequestParams {
  token: string;
  owner: string;
  repo: string;
  title: string;
  body: string;
  head: string; // The name of the branch where your changes are implemented.
  base: string; // The name of the branch you want the changes pulled into.
}

export async function createPullRequest({ token, owner, repo, title, body, head, base }: CreatePullRequestParams): Promise<PullRequest> {
  const prData = {
    title,
    body,
    head,
    base,
  };
  return githubFetch<PullRequest>(`/repos/${owner}/${repo}/pulls`, token, {
    method: 'POST',
    body: JSON.stringify(prData),
    headers: { 'Content-Type': 'application/json' },
  });
}

// --- GitHub Actions API Functions ---

export async function getRepoWorkflows(token: string, owner: string, repo: string): Promise<{total_count: number, workflows: Workflow[]}> {
    return githubFetch<{total_count: number, workflows: Workflow[]}>(`/repos/${owner}/${repo}/actions/workflows`, token);
}

export async function triggerWorkflow(token: string, owner: string, repo: string, workflow_id: string | number, branch: string): Promise<null> {
    const data = { ref: branch };
    return githubFetch<null>(`/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`, token, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function getWorkflowRuns(token: string, owner: string, repo: string, workflow_id: string | number, branch: string): Promise<{ total_count: number, workflow_runs: WorkflowRun[] }> {
    return githubFetch<{ total_count: number, workflow_runs: WorkflowRun[] }>(`/repos/${owner}/${repo}/actions/workflows/${workflow_id}/runs?branch=${encodeURIComponent(branch)}`, token);
}

export async function getWorkflowRun(token: string, owner: string, repo: string, run_id: number): Promise<WorkflowRun> {
    return githubFetch<WorkflowRun>(`/repos/${owner}/${repo}/actions/runs/${run_id}`, token);
}

export async function getWorkflowRunLogs(token: string, owner: string, repo: string, run_id: number): Promise<string> {
    const jobsResponse = await githubFetch<{ jobs: { id: number, conclusion: string }[] }>(`/repos/${owner}/${repo}/actions/runs/${run_id}/jobs`, token);
    
    // Prioritize logs from failed jobs, but get all if none failed (e.g., cancelled).
    const failedJobs = jobsResponse.jobs.filter(job => job.conclusion === 'failure');
    const jobsToLog = failedJobs.length > 0 ? failedJobs : jobsResponse.jobs;

    let allLogs = '';
    for (const job of jobsToLog) {
        try {
            const log = await githubFetch<string>(`/repos/${owner}/${repo}/actions/jobs/${job.id}/logs`, token, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            });
            allLogs += `\n\n--- LOGS FOR JOB ${job.id} (Conclusion: ${job.conclusion}) ---\n\n${log}`;
        } catch (error) {
            console.error(`Could not fetch logs for job ${job.id}`, error);
            allLogs += `\n\n--- FAILED TO FETCH LOGS FOR JOB ${job.id} ---`;
        }
    }

    return allLogs;
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-custom-GitHub-repo-transformer-into-New-York-times-best-seller | ORIGINAL PATH: diplomat-bit-jocall3-custom-GitHub-repo-transformer-into-New-York-times-best-seller-5617407/services/githubService.ts
================================================================================


import { GithubRepo, GithubFile } from '../types';

const BASE_URL = 'https://api.github.com';
const RAW_URL = 'https://raw.githubusercontent.com';
const DEFAULT_USERNAME = 'jocall3';

export const githubService = {
  async getUserRepos(username: string = DEFAULT_USERNAME): Promise<GithubRepo[]> {
    try {
      let allRepos: GithubRepo[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=100&page=${page}`);
        if (response.status === 403) {
            throw new Error("GitHub API Rate Limit Exceeded. Please try again later or use a token.");
        }
        if (!response.ok) {
          throw new Error(`GitHub Error: ${response.status}`);
        }
        const data: GithubRepo[] = await response.json();
        if (data.length === 0) {
          hasMore = false;
        } else {
          allRepos = [...allRepos, ...data];
          page++;
        }
        if (page > 10) break; 
      }
      return allRepos;
    } catch (e: any) {
      console.error("GitHub fetch failed", e);
      throw e;
    }
  },

  async getRepoDetails(repoName: string, username: string = DEFAULT_USERNAME): Promise<any> {
    const response = await fetch(`${BASE_URL}/repos/${username}/${repoName}`);
    if (!response.ok) throw new Error('Failed to fetch repo details');
    return response.json();
  },

  async getAllRepoFilesRecursively(repoName: string, path: string = '', username: string = DEFAULT_USERNAME): Promise<GithubFile[]> {
    try {
      const repoData = await this.getRepoDetails(repoName, username);
      const branch = repoData.default_branch || 'main';
      const response = await fetch(`${BASE_URL}/repos/${username}/${repoName}/git/trees/${branch}?recursive=1`);
      
      if (!response.ok) return this.getRepoContents(repoName, path, username);

      const data = await response.json();
      return data.tree
        .filter((item: any) => item.type === 'blob')
        .filter((item: any) => {
          const skip = /\.(png|jpg|jpeg|gif|ico|pdf|zip|exe|dll|woff|woff2|ttf|mp4|mov|avi|pyc|o|a)$/i.test(item.path);
          return !skip;
        })
        .map((item: any) => ({
          name: item.path.split('/').pop(),
          path: item.path,
          type: 'file',
          download_url: `${RAW_URL}/${username}/${repoName}/${branch}/${item.path}`,
          size: item.size || 0
        }));
    } catch (e) {
      return [];
    }
  },

  async getRepoContents(repoName: string, path: string = '', username: string = DEFAULT_USERNAME): Promise<GithubFile[]> {
    const response = await fetch(`${BASE_URL}/repos/${username}/${repoName}/contents/${path}`);
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    return response.json();
  },

  async getFileContent(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) return "Error: Failed to fetch content.";
      return response.text();
    } catch (e) {
      return "Error: Network failure.";
    }
  }
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/usa | ORIGINAL PATH: diplomat-bit-usa-d72fd59/services/githubService.ts
================================================================================

import { GithubRepo, GitTreeItem, FileNode, DirNode, Branch, PullRequest, Workflow, WorkflowRun } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

async function githubFetch<T,>(url: string, token: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    let errorMessage = '';
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorMessage = 'Failed to parse JSON error response';
      }
    } else {
      try {
        errorMessage = await response.text();
      } catch (e) {
        errorMessage = `HTTP error ${response.status}`;
      }
    }
    throw new Error(`GitHub API Error: ${response.status} ${errorMessage}`);
  }

  // Handle '204 No Content' responses
  if (response.status === 204 || response.status === 201 && !response.body) {
    return null as T;
  }
  
  if (options.headers && (options.headers as any).Accept === 'application/vnd.github.v3.raw') {
    return response.text() as unknown as T;
  }
  return response.json();
}

export async function fetchAllRepos(token: string): Promise<GithubRepo[]> {
  let allRepos: GithubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    let repos: GithubRepo[];
    try {
      repos = await githubFetch<GithubRepo[]>(`/user/repos?type=all&per_page=${perPage}&page=${page}`, token);
    } catch (err: any) {
      if (allRepos.length > 0) {
        console.warn('Failed to fetch a page of repos but had previous pages:', err);
        break; // Return whatever we managed to fetch so far instead of failing completely!
      }
      throw err;
    }

    if (!repos || !Array.isArray(repos)) {
      break;
    }
    allRepos = allRepos.concat(repos);
    if (repos.length < perPage) {
      break;
    }
    page++;
  }
  return allRepos;
}

const buildTreeStructure = (items: GitTreeItem[]): (DirNode | FileNode)[] => {
  // Use a temporary type for building, where children is a map for efficient lookups.
  type TempDirNode = { type: 'dir'; path: string; name: string; children: { [key: string]: TempDirNode | FileNode } };
  const root: { children: { [key: string]: TempDirNode | FileNode } } = { children: {} };

  items.forEach(item => {
    if (item.type !== 'blob') return; // Only process files (blobs)
    const parts = item.path.split('/');
    let currentLevel = root.children;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const currentPath = parts.slice(0, index + 1).join('/');

      if (isFile) {
        if (!currentLevel[part]) {
          currentLevel[part] = { type: 'file', path: item.path, name: part };
        }
      } else {
        if (!currentLevel[part]) {
          currentLevel[part] = { type: 'dir', path: currentPath, name: part, children: {} };
        }
        // Now we are sure currentLevel[part] is a directory node in our temporary structure
        currentLevel = (currentLevel[part] as TempDirNode).children;
      }
    });
  });

  // Recursive function to convert the temp structure (with object children) to the final one (with array children).
  const convertToArrayAndSort = (level: { [key: string]: TempDirNode | FileNode }): (DirNode | FileNode)[] => {
    const nodes = Object.values(level).map(node => {
      if (node.type === 'dir') {
        const childrenArray = convertToArrayAndSort((node as TempDirNode).children);
        return { ...node, children: childrenArray } as DirNode;
      }
      return node as FileNode;
    });

    // Sort nodes: directories first, then files, all alphabetically.
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    return nodes;
  };

  return convertToArrayAndSort(root.children);
};


export async function fetchFlatRepoTree(token: string, owner: string, repo: string, branch: string): Promise<GitTreeItem[]> {
    const { tree } = await githubFetch<{ tree: GitTreeItem[] }>(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, token);
    return tree;
}

export async function fetchRepoTree(token: string, owner: string, repo: string, branch: string): Promise<(DirNode | FileNode)[]> {
  const tree = await fetchFlatRepoTree(token, owner, repo, branch);
  return buildTreeStructure(tree);
}


/**
 * Decodes a Base64 string to a UTF-8 string.
 * @param str The Base64 encoded string.
 * @returns The decoded UTF-8 string.
 */
function b64_to_utf8(str: string): string {
  return decodeURIComponent(escape(atob(str.replace(/\s/g, ''))));
}

export async function getFileContent(token: string, owner: string, repo: string, path: string, branch?: string): Promise<{ path: string; content: string; sha: string }> {
  const url = branch ? `/repos/${owner}/${repo}/contents/${path}?ref=${branch}` : `/repos/${owner}/${repo}/contents/${path}`;
  const data = await githubFetch<{ path: string, content: string, sha: string }>(url, token);
  return {
    ...data,
    content: b64_to_utf8(data.content), // Correctly decode UTF-8 content
  };
}

export async function getRepoBranches(token: string, owner: string, repo: string): Promise<Branch[]> {
  return githubFetch<Branch[]>(`/repos/${owner}/${repo}/branches?per_page=100`, token);
}

export async function getBranch(token: string, owner: string, repo: string, branch: string): Promise<Branch> {
    return githubFetch<Branch>(`/repos/${owner}/${repo}/branches/${branch}`, token);
}

export async function createBranch(token: string, owner: string, repo: string, newBranchName: string, baseSha: string): Promise<any> {
  const data = {
    ref: `refs/heads/${newBranchName}`,
    sha: baseSha,
  };
  return githubFetch(`/repos/${owner}/${repo}/git/refs`, token, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

interface CreateRepoParams {
  token: string;
  name: string;
  description: string;
  isPrivate: boolean;
}

export async function createRepo({ token, name, description, isPrivate }: CreateRepoParams): Promise<GithubRepo> {
  const repoData = {
    name,
    description,
    private: isPrivate,
    auto_init: true, // Auto-initialize with a README to avoid empty repo issues
  };
  return githubFetch<GithubRepo>('/user/repos', token, {
    method: 'POST',
    body: JSON.stringify(repoData),
    headers: { 'Content-Type': 'application/json' },
  });
}

interface CommitFileParams {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  content: string;
  message: string;
  sha?: string; // The blob SHA of the file being replaced. Optional for new files.
}

/**
 * Encodes a UTF-8 string to Base64.
 * This is necessary because the standard `btoa` function can throw an error
 * if the string contains characters outside the Latin-1 range.
 * @param str The string to encode.
 * @returns The Base64 encoded string.
 */
function utf8_to_b64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}


export async function commitFile({ token, owner, repo, branch, path, content, message, sha }: CommitFileParams): Promise<string> {
    const commitData = {
        message,
        content: utf8_to_b64(content), // base64 encode the content, supporting UTF-8
        ...(sha && { sha }),
        branch,
    };

    const result = await githubFetch<{ content: { sha: string } }>(`/repos/${owner}/${repo}/contents/${path}`, token, {
        method: 'PUT',
        body: JSON.stringify(commitData),
        headers: { 'Content-Type': 'application/json' },
    });
    
    return result.content.sha;
}


interface CreatePullRequestParams {
  token: string;
  owner: string;
  repo: string;
  title: string;
  body: string;
  head: string; // The name of the branch where your changes are implemented.
  base: string; // The name of the branch you want the changes pulled into.
}

export async function createPullRequest({ token, owner, repo, title, body, head, base }: CreatePullRequestParams): Promise<PullRequest> {
  const prData = {
    title,
    body,
    head,
    base,
  };
  return githubFetch<PullRequest>(`/repos/${owner}/${repo}/pulls`, token, {
    method: 'POST',
    body: JSON.stringify(prData),
    headers: { 'Content-Type': 'application/json' },
  });
}

// --- GitHub Actions API Functions ---

export async function getRepoWorkflows(token: string, owner: string, repo: string): Promise<{total_count: number, workflows: Workflow[]}> {
    return githubFetch<{total_count: number, workflows: Workflow[]}>(`/repos/${owner}/${repo}/actions/workflows`, token);
}

export async function triggerWorkflow(token: string, owner: string, repo: string, workflow_id: string | number, branch: string): Promise<null> {
    const data = { ref: branch };
    return githubFetch<null>(`/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`, token, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function getWorkflowRuns(token: string, owner: string, repo: string, workflow_id: string | number, branch: string): Promise<{ total_count: number, workflow_runs: WorkflowRun[] }> {
    return githubFetch<{ total_count: number, workflow_runs: WorkflowRun[] }>(`/repos/${owner}/${repo}/actions/workflows/${workflow_id}/runs?branch=${encodeURIComponent(branch)}`, token);
}

export async function getWorkflowRun(token: string, owner: string, repo: string, run_id: number): Promise<WorkflowRun> {
    return githubFetch<WorkflowRun>(`/repos/${owner}/${repo}/actions/runs/${run_id}`, token);
}

export async function getWorkflowRunLogs(token: string, owner: string, repo: string, run_id: number): Promise<string> {
    const jobsResponse = await githubFetch<{ jobs: { id: number, conclusion: string }[] }>(`/repos/${owner}/${repo}/actions/runs/${run_id}/jobs`, token);
    
    // Prioritize logs from failed jobs, but get all if none failed (e.g., cancelled).
    const failedJobs = jobsResponse.jobs.filter(job => job.conclusion === 'failure');
    const jobsToLog = failedJobs.length > 0 ? failedJobs : jobsResponse.jobs;

    let allLogs = '';
    for (const job of jobsToLog) {
        try {
            const log = await githubFetch<string>(`/repos/${owner}/${repo}/actions/jobs/${job.id}/logs`, token, {
                headers: { 'Accept': 'application/vnd.github.v3.raw' }
            });
            allLogs += `\n\n--- LOGS FOR JOB ${job.id} (Conclusion: ${job.conclusion}) ---\n\n${log}`;
        } catch (error) {
            console.error(`Could not fetch logs for job ${job.id}`, error);
            allLogs += `\n\n--- FAILED TO FETCH LOGS FOR JOB ${job.id} ---`;
        }
    }

    return allLogs;
}
