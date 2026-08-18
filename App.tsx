// REPOSITORY SOURCE: diplomat-bit/ai-banking-swarm-roster | PATH: diplomat-bit-ai-banking-swarm-roster-20297ff/App.tsx
================================================================================


import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AuthModal } from './components/AuthModal';
import { FileExplorer } from './components/FileExplorer';
import { EditorCanvas } from './components/EditorCanvas';
import { fetchAllRepos, fetchRepoTree, getFileContent, commitFile, getRepoBranches, createBranch, createPullRequest, createRepo, triggerWorkflow, getWorkflowRuns, getWorkflowRun, getWorkflowRunLogs } from './services/githubService';
import { primaryModels, fallbackModels, planRepositoryEdit, bulkEditFileWithAI, generateProjectPlan, generateFileContent, planProjectExpansionEdits, modelsToUse, streamSingleFileEdit, cleanAiCodeResponse, correctCodeFromBuildError, streamRepositoryFileEdit, setGeminiApiKey, planJellyfishOverhaul, generateWithCritiqueLoop } from './services/geminiService';
import { GithubRepo, UnifiedFileTree, SelectedFile, Alert, Branch, FileNode, DirNode, BulkEditJob, ProjectGenerationJob, ProjectExpansionJob, ProjectExpansionPhase, ProjectPlan, AdvancedEditJob, AdvancedEditPhase, WorkflowRun, AdvancedEditJobStatus, RepositoryEditPlan, ProjectExpansionPlan, JellyfishJob, JellyfishPhase, AuditEntry } from './types';
import { Spinner } from './components/Spinner';
import { AlertPopup } from './components/AlertPopup';
import { MultiFileAiEditModal } from './components/BulkAiEditModal';
import { BulkEditProgress } from './components/BulkEditProgress';
import { NewProjectModal } from './components/NewProjectModal';
import { ProjectGenerationProgress } from './components/ProjectGenerationProgress';
import { ProjectExpansionModal } from './components/ProjectExpansionModal';
import { ProjectExpansionProgress } from './components/ProjectExpansionProgress';
import { AdvancedAiEditModal } from './components/AdvancedAiEditModal';
import { AdvancedEditProgress } from './components/AdvancedEditProgress';
import { AiChatModal } from './components/AiChatModal';
import { JellyfishModal } from './components/JellyfishModal';
import { JellyfishProgress } from './components/JellyfishProgress';
import { getAllFilePaths } from './utils';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<UnifiedFileTree>({});
  
  const [openFiles, setOpenFiles] = useState<SelectedFile[]>([]);
  const [activeFileKey, setActiveFileKey] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [alert, setAlert] = useState<Alert | null>(null);
  
  // AUDIT STORAGE STATE
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  
  const addAuditEntry = (action: string, details: string, status: 'success' | 'warning' | 'error' = 'success') => {
      const newEntry: AuditEntry = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          action,
          details,
          status
      };
      setAuditLog(prev => [newEntry, ...prev]);
  };

  const [branchesByRepo, setBranchesByRepo] = useState<Record<string, Branch[]>>({});
  const [currentBranchByRepo, setCurrentBranchByRepo] = useState<Record<string, string>>({});

  const [isMultiEditModalOpen, setMultiEditModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkEditJobs, setBulkEditJobs] = useState<BulkEditJob[]>([]);
  
  const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [projectGenerationJobs, setProjectGenerationJobs] = useState<ProjectGenerationJob[]>([]);
  const [projectGenerationStatus, setProjectGenerationStatus] = useState('');
  
  const [isExpansionModalOpen, setExpansionModalOpen] = useState(false);
  const [isExpandingProject, setIsExpandingProject] = useState(false);
  const [expansionJobs, setExpansionJobs] = useState<ProjectExpansionJob[]>([]);
  const [expansionPhase, setExpansionPhase] = useState<ProjectExpansionPhase>('idle');
  
  // State for the new Advanced AI Edit feature
  const [isAdvancedEditModalOpen, setAdvancedEditModalOpen] = useState(false);
  const [isAdvancedEditing, setIsAdvancedEditing] = useState(false);
  const [advancedEditJobs, setAdvancedEditJobs] = useState<AdvancedEditJob[]>([]);
  const [advancedEditPhase, setAdvancedEditPhase] = useState<AdvancedEditPhase>('idle');
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [advancedEditBuildLogs, setAdvancedEditBuildLogs] = useState<string | null>(null);
  const [workflowRunUrl, setWorkflowRunUrl] = useState<string | null>(null);
  const [aiThought, setAiThought] = useState<string | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);

  // State for simple AI Edit
  const [isAiChatModalOpen, setAiChatModalOpen] = useState(false);

  // State for JELLYFISH Mode
  const [isJellyfishModalOpen, setJellyfishModalOpen] = useState(false);
  const [selectedJellyfishRepo, setSelectedJellyfishRepo] = useState<string | null>(null);
  const [isJellyfishRunning, setIsJellyfishRunning] = useState(false);
  const [jellyfishJobs, setJellyfishJobs] = useState<JellyfishJob[]>([]);
  const [jellyfishPhase, setJellyfishPhase] = useState<JellyfishPhase>('idle');


  const activeFile = openFiles.find(f => (f.repoFullName + '::' + f.path) === activeFileKey);
  const currentBranch = activeFile ? currentBranchByRepo[activeFile.repoFullName] : null;
  const branches = activeFile ? branchesByRepo[activeFile.repoFullName] || [] : [];

  const handleTokenSubmit = useCallback(async (credentials: { githubToken: string; geminiKey?: string }) => {
    if (!credentials.githubToken) return;
    
    if (credentials.geminiKey) {
        setGeminiApiKey(credentials.geminiKey);
        addAuditEntry("System Init", "Gemini API Key Configured via Secret Manager", 'success');
    }

    setToken(credentials.githubToken);
    setIsLoading(true);
    setLoadingMessage('Fetching repositories...');
    try {
      const repos: GithubRepo[] = await fetchAllRepos(credentials.githubToken);
      const newFileTree: UnifiedFileTree = {};
      
      const repoPromises = repos.map(async (repo) => {
        setLoadingMessage(`Processing ${repo.owner.login}/${repo.name}...`);
        try {
          newFileTree[repo.full_name] = { repo, tree: [] };
          // Fetch default branch tree
           const tree = await fetchRepoTree(credentials.githubToken, repo.owner.login, repo.name, repo.default_branch);
           newFileTree[repo.full_name].tree = tree;

           // Also fetch branches
           const repoBranches = await getRepoBranches(credentials.githubToken, repo.owner.login, repo.name);
           setBranchesByRepo(prev => ({ ...prev, [repo.full_name]: repoBranches }));
           setCurrentBranchByRepo(prev => ({ ...prev, [repo.full_name]: repo.default_branch }));

        } catch (e) {
          console.error(`Failed to fetch tree for ${repo.full_name}`, e);
          addAuditEntry("Repo Fetch Error", `Failed to load ${repo.full_name}`, 'warning');
        }
      });

      await Promise.all(repoPromises);
      setFileTree(newFileTree);
      addAuditEntry("System Ready", `Loaded ${repos.length} repositories.`, 'success');
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Failed to load repositories. Check your token.' });
      setToken(null);
      addAuditEntry("System Error", "Failed to authenticate with GitHub", 'error');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleFileSelect = async (repoFullName: string, path: string) => {
    const fileKey = repoFullName + '::' + path;
    const existingFile = openFiles.find(f => (f.repoFullName + '::' + f.path) === fileKey);
    
    if (existingFile) {
      setActiveFileKey(fileKey);
      return;
    }

    if (!token) return;

    setIsLoading(true);
    setLoadingMessage(`Opening ${path}...`);
    try {
        const repo = fileTree[repoFullName]?.repo;
        if (!repo) throw new Error("Repo not found");
        
        const branch = currentBranchByRepo[repoFullName] || repo.default_branch;

        const { content, sha } = await getFileContent(token, repo.owner.login, repo.name, path, branch);
        
        const newFile: SelectedFile = {
            repoFullName,
            path,
            content,
            editedContent: content,
            sha,
            defaultBranch: repo.default_branch
        };

        setOpenFiles(prev => [...prev, newFile]);
        setActiveFileKey(fileKey);
        addAuditEntry("File Access", `Accessed ${path} in ${repoFullName}`, 'success');
    } catch (error) {
        console.error(error);
        setAlert({ type: 'error', message: `Failed to open file: ${path}` });
        addAuditEntry("File Access Error", `Failed to read ${path}`, 'error');
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };

  const handleCloseFile = (fileKey: string) => {
    setOpenFiles(prev => prev.filter(f => (f.repoFullName + '::' + f.path) !== fileKey));
    if (activeFileKey === fileKey) {
      setActiveFileKey(null);
    }
  };

  const handleFileContentChange = (fileKey: string, newContent: string) => {
    setOpenFiles(prev => prev.map(f => {
      if ((f.repoFullName + '::' + f.path) === fileKey) {
        return { ...f, editedContent: newContent };
      }
      return f;
    }));
  };

  const handleSetActiveFile = (fileKey: string) => {
    setActiveFileKey(fileKey);
  };

  const handleCommit = async (commitMessage: string) => {
    if (!activeFile || !token) return;
    setIsLoading(true);
    setLoadingMessage('Committing changes...');
    try {
        const [owner, repoName] = activeFile.repoFullName.split('/');
        const branch = currentBranchByRepo[activeFile.repoFullName] || activeFile.defaultBranch;

        const newSha = await commitFile({
            token,
            owner,
            repo: repoName,
            branch,
            path: activeFile.path,
            content: activeFile.editedContent,
            message: commitMessage,
            sha: activeFile.sha
        });

        // Update local state
        setOpenFiles(prev => prev.map(f => {
            if ((f.repoFullName + '::' + f.path) === activeFileKey) {
                return { ...f, content: f.editedContent, sha: newSha };
            }
            return f;
        }));
        
        setAlert({ type: 'success', message: 'Changes committed successfully!' });
        addAuditEntry("Commit Success", `Committed ${activeFile.path}: ${commitMessage}`, 'success');

    } catch (error) {
        console.error(error);
        setAlert({ type: 'error', message: 'Failed to commit changes.' });
        addAuditEntry("Commit Error", `Failed to commit ${activeFile.path}`, 'error');
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };

  const handleBranchChange = async (newBranch: string) => {
      if (!activeFile || !token) return;
      const repoFullName = activeFile.repoFullName;
      setCurrentBranchByRepo(prev => ({ ...prev, [repoFullName]: newBranch }));
      
      setIsLoading(true);
      try {
          const [owner, repoName] = repoFullName.split('/');
          const { content, sha } = await getFileContent(token, owner, repoName, activeFile.path, newBranch);
           setOpenFiles(prev => prev.map(f => {
            if ((f.repoFullName + '::' + f.path) === activeFileKey) {
                return { ...f, content, editedContent: content, sha };
            }
            return f;
        }));
        const tree = await fetchRepoTree(token, owner, repoName, newBranch);
        setFileTree(prev => ({
            ...prev,
            [repoFullName]: { ...prev[repoFullName], tree }
        }));
        addAuditEntry("Branch Switch", `Switched to branch ${newBranch}`, 'success');

      } catch (e) {
          console.error("Error switching branch", e);
          setAlert({ type: 'error', message: "Failed to switch branch/reload file."});
          addAuditEntry("Branch Switch Error", `Failed to switch to ${newBranch}`, 'error');
      } finally {
          setIsLoading(false);
      }
  };

  const handleCreateBranch = async (newBranchName: string) => {
      if (!activeFile || !token) return;
      setIsLoading(true);
      try {
          const [owner, repoName] = activeFile.repoFullName.split('/');
          const currentBranchName = currentBranchByRepo[activeFile.repoFullName] || activeFile.defaultBranch;
          
          const branchData = await getRepoBranches(token, owner, repoName);
          const currentBranchData = branchData.find(b => b.name === currentBranchName);
          
          if (!currentBranchData) throw new Error("Could not find current branch tip SHA");

          await createBranch(token, owner, repoName, newBranchName, currentBranchData.commit.sha);
          
          const newBranches = await getRepoBranches(token, owner, repoName);
          setBranchesByRepo(prev => ({...prev, [activeFile.repoFullName]: newBranches}));
          
          handleBranchChange(newBranchName);
          setAlert({ type: 'success', message: `Branch ${newBranchName} created and active.`});
          addAuditEntry("Branch Created", `Created branch ${newBranchName}`, 'success');

      } catch (e) {
          console.error(e);
          setAlert({ type: 'error', message: 'Failed to create branch.' });
          addAuditEntry("Branch Create Error", `Failed to create ${newBranchName}`, 'error');
      } finally {
          setIsLoading(false);
      }
  };

  const handleCreatePullRequest = async (title: string, body: string) => {
      if (!activeFile || !token) return;
      setIsLoading(true);
      try {
          const [owner, repoName] = activeFile.repoFullName.split('/');
          const head = currentBranchByRepo[activeFile.repoFullName];
          const base = activeFile.defaultBranch;
          
          const pr = await createPullRequest({
              token, owner, repo: repoName, title, body, head, base
          });
          setAlert({ type: 'success', message: `Pull Request #${pr.number} created: ${pr.html_url}` });
          addAuditEntry("PR Created", `PR #${pr.number}: ${title}`, 'success');
      } catch (e) {
           console.error(e);
           setAlert({ type: 'error', message: 'Failed to create Pull Request.' });
           addAuditEntry("PR Error", `Failed to create PR: ${title}`, 'error');
      } finally {
          setIsLoading(false);
      }
  };


  const toggleFileSelection = (fileKey: string, isSelected: boolean) => {
      const newSelection = new Set(selectedFiles);
      if (isSelected) {
          newSelection.add(fileKey);
      } else {
          newSelection.delete(fileKey);
      }
      setSelectedFiles(newSelection);
  };

  const toggleDirectorySelection = (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => {
      const paths = getAllFilePaths(nodes);
      const newSelection = new Set(selectedFiles);
      paths.forEach(p => {
          const key = `${repoFullName}::${p}`;
          if (shouldSelect) newSelection.add(key);
          else newSelection.delete(key);
      });
      setSelectedFiles(newSelection);
  };

  // --- Bulk Edit Logic ---

  const handleStartBulkEdit = () => {
      if (selectedFiles.size === 0) return;
      setMultiEditModalOpen(true);
  };

  const handleBulkEditSubmit = async (instruction: string) => {
      setMultiEditModalOpen(false);
      setIsBulkEditing(true);
      addAuditEntry("Bulk Edit Started", `Instruction: ${instruction.slice(0,50)}...`, 'success');
      
      const jobs: BulkEditJob[] = Array.from(selectedFiles).map((key: string) => {
          const [repoFullName, ...pathParts] = key.split('::');
          return {
              id: key,
              repoFullName,
              path: pathParts.join('::'), // Rejoin just in case path had ::
              status: 'queued',
              content: '',
              error: null
          };
      });
      setBulkEditJobs(jobs);

      // Simple concurrency queue
      const processJob = async (job: BulkEditJob) => {
         if (!token) return;
         setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'processing' } : j));
         
         try {
             const [owner, repo] = job.repoFullName.split('/');
             // Fetch original content
             const { content: originalContent, sha } = await getFileContent(token, owner, repo, job.path, currentBranchByRepo[job.repoFullName]); // Use current branch
             
             let finalContent = '';
             
             // Retry loop with model fallback
             for (const model of modelsToUse) {
                 try {
                     if (model !== modelsToUse[0]) {
                          setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'retrying', error: `Retrying with ${model}...` } : j));
                     }
                     
                     await bulkEditFileWithAI(
                         originalContent,
                         instruction,
                         job.path,
                         (chunk) => {
                             // Stream update
                             finalContent += chunk;
                             setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { ...j, content: finalContent } : j));
                         },
                         () => finalContent,
                         model
                     );
                     
                     const cleanedContent = cleanAiCodeResponse(finalContent);
                     
                     // If we get here, generation was successful (didn't throw).
                     // Commit.
                     await commitFile({
                         token,
                         owner,
                         repo,
                         branch: currentBranchByRepo[job.repoFullName] || 'main', // fallback to main if undefined
                         path: job.path,
                         content: cleanedContent,
                         message: `AI Edit: ${instruction.slice(0, 50)}...`,
                         sha
                     });
                     
                     setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'success' } : j));
                     return; // Success, exit retry loop

                 } catch (aiError) {
                     console.warn(`Model ${model} failed for ${job.path}:`, aiError);
                     finalContent = ''; // Reset for next attempt
                     // Continue to next model
                 }
             }
             // If loop finishes without return, all models failed
             throw new Error("All AI models failed to generate valid code.");

         } catch (e: any) {
             setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'failed', error: e.message } : j));
             addAuditEntry("Bulk Edit Failure", `File: ${job.path}, Error: ${e.message}`, 'error');
         }
      };

      // Run with limited concurrency (e.g., 4)
      const CONCURRENCY = 4;
      let currentIndex = 0;
      
      const runNext = () => {
          if (currentIndex >= jobs.length) return;
          const job = jobs[currentIndex++];
          processJob(job).finally(() => runNext());
      };

      for (let i = 0; i < CONCURRENCY; i++) {
          runNext();
      }
  };

  // --- New Project Generation Logic ---
  
  const handleStartNewProject = () => {
      setNewProjectModalOpen(true);
  };

  const handleProjectGenerationSubmit = async (repoName: string, prompt: string, isPrivate: boolean) => {
      if (!token) return;
      setNewProjectModalOpen(false);
      setIsGeneratingProject(true);
      setProjectGenerationStatus('Initializing repository...');
      setProjectGenerationJobs([]);
      addAuditEntry("New Project Init", `Creating ${repoName}: ${prompt.slice(0,50)}...`, 'success');

      try {
          // 1. Create Repo
          const repo = await createRepo({ token, name: repoName, description: `AI Generated: ${prompt.slice(0, 50)}...`, isPrivate });
          setProjectGenerationStatus(`Repository ${repo.full_name} created. Planning structure...`);

          // 2. Generate Plan
          // Retry logic for plan generation
          let plan: ProjectPlan | null = null;
          for (const model of modelsToUse) {
              try {
                  plan = await generateProjectPlan(prompt, model);
                  break; 
              } catch (e) { console.warn("Plan generation failed", e); }
          }
          if (!plan) throw new Error("Failed to generate project plan.");

          const jobs: ProjectGenerationJob[] = plan.files.map(f => ({
              id: f.path,
              path: f.path,
              description: f.description,
              status: 'queued',
              content: '',
              error: null
          }));
          setProjectGenerationJobs(jobs);
          setProjectGenerationStatus('Generating files...');

          // 3. Generate & Commit Files Concurrently
           const processJob = async (job: ProjectGenerationJob) => {
                setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'generating' } : j));
                let finalContent = '';
                try {
                     // Retry loop for file generation
                     for (const model of modelsToUse) {
                         try {
                             if (model !== modelsToUse[0]) {
                                  setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'retrying', error: `Retrying with ${model}...` } : j));
                             }
                             
                             await generateFileContent(
                                 prompt,
                                 job.path,
                                 job.description,
                                 (chunk) => {
                                     finalContent += chunk;
                                     setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, content: finalContent } : j));
                                 },
                                 () => finalContent,
                                 model
                             );
                             
                             const cleanedContent = cleanAiCodeResponse(finalContent);
                             
                             setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'committing' } : j));
                             
                             await commitFile({
                                 token,
                                 owner: repo.owner.login,
                                 repo: repo.name,
                                 branch: repo.default_branch,
                                 path: job.path,
                                 content: cleanedContent,
                                 message: `AI Create: ${job.path}`,
                                 // No sha needed for new files
                             });
                             
                             setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'success' } : j));
                             addAuditEntry("File Generated", `Created ${job.path} in ${repoName}`, 'success');
                             return;

                         } catch (aiError) {
                             console.warn(`Model ${model} failed for ${job.path}:`, aiError);
                             finalContent = '';
                         }
                     }
                     throw new Error("All AI models failed.");
                } catch (e: any) {
                    setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'failed', error: e.message } : j));
                    addAuditEntry("Generation Failed", `File: ${job.path}, Error: ${e.message}`, 'error');
                }
           };

            const CONCURRENCY = 4;
            let currentIndex = 0;
            const runNext = () => {
                if (currentIndex >= jobs.length) return;
                const job = jobs[currentIndex++];
                processJob(job).finally(() => runNext());
            };

            for (let i = 0; i < CONCURRENCY; i++) runNext();
      } catch (error: any) {
          setProjectGenerationStatus(`Error: ${error.message}`);
          addAuditEntry("Project Init Failed", error.message, 'error');
      }
  };

  // --- Project Expansion Logic ---
  
  const handleStartProjectExpansion = () => {
      setExpansionModalOpen(true);
  };

  const handleExpansionSubmit = async (prompt: string) => {
      setExpansionModalOpen(false);
      setIsExpandingProject(true);
      setExpansionPhase('planning');
      setExpansionJobs([]);
      addAuditEntry("Expansion Started", `Prompt: ${prompt.slice(0,50)}...`, 'success');

      if (!token || selectedFiles.size !== 1) {
          setAlert({ type: 'error', message: 'Please select exactly one seed file.' });
          setIsExpandingProject(false);
          return;
      }
      
      const seedFileKey = Array.from(selectedFiles)[0] as string;
      const [repoFullName, ...pathParts] = seedFileKey.split('::');
      const seedFilePath = pathParts.join('::');
      const [owner, repo] = repoFullName.split('/');
      
      try {
          const { content: seedContent } = await getFileContent(token, owner, repo, seedFilePath, currentBranchByRepo[repoFullName]);

          // 1. Plan
          let plan: ProjectExpansionPlan | null = null;
          
          for (const model of modelsToUse) {
              try {
                  const result = await planProjectExpansionEdits([{ path: seedFilePath, content: seedContent }], prompt, model);
                  plan = result; 
                  break;
              } catch (e) { console.warn("Expansion planning failed", e); }
          }
          if (!plan) throw new Error("Failed to plan expansion.");

          const jobs: ProjectExpansionJob[] = plan.filesToCreate.map(f => ({
              id: f.path,
              path: f.path,
              type: 'create',
              description: f.description,
              agentIndex: f.agentIndex,
              status: 'queued',
              content: '',
              error: null
          }));
          
          setExpansionJobs(jobs);
          setExpansionPhase('generating');

          // 2. Execute
           const processJob = async (job: ProjectExpansionJob) => {
                setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'generating' } : j));
                let finalContent = '';
                try {
                     for (const model of modelsToUse) {
                         try {
                             if (model !== modelsToUse[0]) {
                                  setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'retrying', error: `Retrying with ${model}...` } : j));
                             }
                             
                             await generateFileContent(
                                 prompt,
                                 job.path,
                                 job.description,
                                 (chunk) => {
                                     finalContent += chunk;
                                     setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, content: finalContent } : j));
                                 },
                                 () => finalContent,
                                 model
                             );
                             
                             const cleanedContent = cleanAiCodeResponse(finalContent);
                             setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'committing' } : j));
                             
                             // Try to check if file exists to get SHA, otherwise it's a new file
                             let currentSha: string | undefined;
                             try {
                                const existing = await getFileContent(token, owner, repo, job.path, currentBranchByRepo[repoFullName]);
                                currentSha = existing.sha;
                             } catch(e) {}

                             await commitFile({
                                 token: token!,
                                 owner,
                                 repo,
                                 branch: currentBranchByRepo[repoFullName] || 'main',
                                 path: job.path,
                                 content: cleanedContent,
                                 message: `AI Expansion: ${job.path}`,
                                 sha: currentSha
                             });
                             
                             setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'success' } : j));
                             addAuditEntry("Agent Deployed", `Agent ${job.agentIndex} created ${job.path}`, 'success');
                             return;

                         } catch (aiError) {
                             console.warn(`Model ${model} failed for ${job.path}:`, aiError);
                             finalContent = '';
                         }
                     }
                     throw new Error("All AI models failed.");
                } catch (e: any) {
                    setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'failed', error: e.message } : j));
                }
           };

            const CONCURRENCY = 8; // High concurrency for expansion
            let currentIndex = 0;
            const runNext = () => {
                if (currentIndex >= jobs.length) return;
                const job = jobs[currentIndex++];
                processJob(job).finally(() => runNext());
            };

            for (let i = 0; i < CONCURRENCY; i++) runNext();

            // Monitor completion
            const checkCompletion = setInterval(() => {
                const pending = jobs.filter(j => j.status === 'queued' || j.status === 'generating' || j.status === 'committing' || j.status === 'retrying').length;
                if (pending === 0 && currentIndex >= jobs.length) {
                    setExpansionPhase('complete');
                    clearInterval(checkCompletion);
                    addAuditEntry("Expansion Complete", "All agents reported success.", 'success');
                }
            }, 1000);

      } catch (error: any) {
          console.error(error);
          setAlert({ type: 'error', message: `Expansion failed: ${error.message}` });
          setExpansionPhase('complete'); // Stop spinner
          addAuditEntry("Expansion Failed", error.message, 'error');
      }
  };

  // --- Advanced AI Edit (Agentic Loop) ---

  const handleStartAdvancedEdit = () => {
      setAdvancedEditModalOpen(true);
  };

  const handleAdvancedEditSubmit = async (instruction: string, workflowId: string) => {
      setAdvancedEditModalOpen(false);
      setIsAdvancedEditing(true);
      setAdvancedEditPhase('analyzing');
      setAdvancedEditJobs([]);
      setVerificationAttempt(1);
      setAdvancedEditBuildLogs(null);
      setWorkflowRunUrl(null);
      setAiThought(null);
      setDeploymentUrl(null);
      addAuditEntry("Advanced Edit Init", "Starting Agentic Loop with CI Verification", 'success');
      
      if (!token || !activeFile) return;

      const [owner, repo] = activeFile.repoFullName.split('/');
      const branch = currentBranchByRepo[activeFile.repoFullName] || activeFile.defaultBranch;
      
      // Helper to fetch all file contents for context
      const getRepositoryContext = async () => {
          return openFiles.map(f => ({ path: f.path, content: f.content, sha: f.sha }));
      };

      try {
          let currentFiles = await getRepositoryContext();
          let currentPhaseInstruction = instruction;
          let attempt = 1;
          const MAX_ATTEMPTS = 3;

          while (attempt <= MAX_ATTEMPTS) {
              setVerificationAttempt(attempt);
              
              // 1. Plan
              let plan: RepositoryEditPlan | null = null;
              if (attempt === 1) {
                  setAdvancedEditPhase('planning');
                  plan = await planRepositoryEdit(instruction, activeFile.path, currentFiles, modelsToUse[0]);
              } else {
                  setAdvancedEditPhase('analyzing_failure');
                  if (!advancedEditBuildLogs) throw new Error("No build logs available for retry");
                  plan = await correctCodeFromBuildError(instruction, currentFiles, [], advancedEditBuildLogs, modelsToUse[0]);
              }

              if (!plan) throw new Error("Failed to generate edit plan");
              setAiThought(plan.reasoning);
              addAuditEntry("AI Plan Generated", plan.reasoning.slice(0, 100), 'success');

              const jobs: AdvancedEditJob[] = plan.filesToEdit.map(f => ({
                  id: f.path,
                  path: f.path,
                  status: 'planning',
                  content: '',
                  error: null
              }));
              setAdvancedEditJobs(jobs);

              // 2. Edit
              setAdvancedEditPhase('editing');
              // Execute edits sequentially or parallel
              for (const fileEdit of plan.filesToEdit) {
                  // Find original content
                  // We might need to fetch it if not in `currentFiles`
                  let originalContent = '';
                  let currentSha: string | undefined;

                  const existingFile = currentFiles.find(f => f.path === fileEdit.path);
                  if (existingFile) {
                      originalContent = existingFile.content;
                      currentSha = existingFile.sha;
                  } else {
                      // Try fetch
                      try {
                          const fileData = await getFileContent(token, owner, repo, fileEdit.path, branch);
                          originalContent = fileData.content;
                          currentSha = fileData.sha;
                      } catch (e) {
                          console.warn("Could not fetch content for", fileEdit.path);
                      }
                  }

                  // Update job status
                  setAdvancedEditJobs(prev => prev.map(j => j.path === fileEdit.path ? { ...j, status: 'editing' } : j));
                  
                  let newContent = '';
                  await streamRepositoryFileEdit(
                      originalContent,
                      fileEdit.changes,
                      fileEdit.path,
                      (chunk) => {
                          newContent += chunk;
                          setAdvancedEditJobs(prev => prev.map(j => j.path === fileEdit.path ? { ...j, content: newContent } : j));
                      },
                      modelsToUse[0]
                  );
                  newContent = cleanAiCodeResponse(newContent);
                  
                  setAdvancedEditJobs(prev => prev.map(j => j.path === fileEdit.path ? { ...j, status: 'committing' } : j));

                  // Commit
                   const committedSha = await commitFile({
                         token,
                         owner,
                         repo,
                         branch,
                         path: fileEdit.path,
                         content: newContent,
                         message: `AI Advanced Edit: ${fileEdit.path} (Attempt ${attempt})`,
                         sha: currentSha
                     });
                   
                   // Update currentFiles for next iteration/verification context
                   const existingFileIndex = currentFiles.findIndex(f => f.path === fileEdit.path);
                   if (existingFileIndex >= 0) {
                       currentFiles[existingFileIndex].content = newContent;
                       currentFiles[existingFileIndex].sha = committedSha;
                   } else {
                       currentFiles.push({ path: fileEdit.path, content: newContent, sha: committedSha });
                   }

                   setAdvancedEditJobs(prev => prev.map(j => j.path === fileEdit.path ? { ...j, status: 'success' } : j));
              }

              // 3. Trigger Workflow
              setAdvancedEditPhase('triggering_workflow');
              await triggerWorkflow(token, owner, repo, workflowId, branch);
              addAuditEntry("CI Triggered", `Workflow ID: ${workflowId}`, 'success');
              
              // 4. Wait for Workflow
              setAdvancedEditPhase('waiting_for_workflow');
              // Wait a bit for run to start
              await new Promise(r => setTimeout(r, 5000));
              
              // Poll for run
              let run: WorkflowRun | null = null;
              // Simple polling logic
              for (let i = 0; i < 20; i++) { // 20 * 5s = 100s timeout for start?
                   const runs = await getWorkflowRuns(token, owner, repo, workflowId, branch);
                   // Get latest run
                   if (runs.workflow_runs.length > 0) {
                       run = runs.workflow_runs[0];
                       if (run.status === 'in_progress' || run.status === 'queued') {
                           setWorkflowRunUrl(run.html_url);
                           break;
                       }
                   }
                   await new Promise(r => setTimeout(r, 3000));
              }

              if (!run) throw new Error("Workflow run not found");

              // Poll for completion
              while (run.status === 'in_progress' || run.status === 'queued') {
                  await new Promise(r => setTimeout(r, 5000));
                  run = await getWorkflowRun(token, owner, repo, run.id);
              }

              if (run.conclusion === 'success') {
                  setAdvancedEditPhase('complete');
                  addAuditEntry("CI Passed", "Automated tests verified changes.", 'success');
                  return; 
              } else {
                  // Failed
                  setAdvancedEditBuildLogs("Fetching logs...");
                  const logs = await getWorkflowRunLogs(token, owner, repo, run.id);
                  setAdvancedEditBuildLogs(logs);
                  addAuditEntry("CI Failed", `Attempt ${attempt} failed. Retrying...`, 'warning');
                  attempt++;
              }
          }
          throw new Error("Maximum attempts reached. Build failed.");

      } catch (e: any) {
          console.error(e);
          setAlert({ type: 'error', message: e.message });
          setAdvancedEditPhase('complete'); // Or error state
          addAuditEntry("Advanced Edit Failed", e.message, 'error');
      }
  };

  const handleSimpleAiEditRequest = () => {
      setAiChatModalOpen(true);
  };

  const handleSimpleAiEditSubmit = async (instruction: string) => {
      setAiChatModalOpen(false);
      if (!activeFile) return;
      
      setIsLoading(true);
      setLoadingMessage("AI is rewriting file...");
      try {
          let newContent = '';
           await streamSingleFileEdit(
              activeFile.content,
              instruction,
              activeFile.path,
              (chunk) => {
                  newContent += chunk;
                  handleFileContentChange(activeFileKey!, newContent); // Live update editor
              },
              modelsToUse[0]
           );
           
           // Clean
           newContent = cleanAiCodeResponse(newContent);
           handleFileContentChange(activeFileKey!, newContent);
           
           setAlert({ type: 'success', message: 'AI rewrite complete. Please review and commit.'});
           addAuditEntry("AI Rewrite", `Rewrote ${activeFile.path}`, 'success');

      } catch (e: any) {
          setAlert({ type: 'error', message: e.message });
      } finally {
          setIsLoading(false);
          setLoadingMessage('');
      }
  };
  
  const handleJellyfishStart = (repoFullName: string) => {
      setSelectedJellyfishRepo(repoFullName);
      setJellyfishModalOpen(true);
  };

  const handleJellyfishSubmit = async (prompt: string) => {
      setJellyfishModalOpen(false);
      if (!selectedJellyfishRepo) return;
      setIsJellyfishRunning(true);
      setJellyfishPhase('planning');
      setJellyfishJobs([]);
      addAuditEntry("Jellyfish Swarm", "Deploying 8 concurrent agents...", 'success');
      
      const [owner, repo] = selectedJellyfishRepo.split('/');
      
      try {
          // 1. Get existing structure
          // We can use fileTree
          const tree = fileTree[selectedJellyfishRepo]?.tree || [];
          const paths = getAllFilePaths(tree);
          
          // 2. Plan
          const plan = await planJellyfishOverhaul(prompt, paths, modelsToUse[0]);
          
          const jobs: JellyfishJob[] = plan.files.map(f => ({
              id: f.path,
              path: f.path,
              description: f.description,
              status: 'queued',
              currentContent: '',
              critiqueCount: 0,
              lastCritique: null
          }));
          setJellyfishJobs(jobs);
          setJellyfishPhase('swarming');
          
          // 3. Swarm Execution
          // Limit concurrency to 8
          const CONCURRENCY = 8;
          let jobIndex = 0;
          
          const processJob = async (job: JellyfishJob) => {
             // Fetch context (truncated)
             const context = openFiles.map(f => `// ${f.path}\n${f.content}`).join('\n');
             
             // Get original content if exists
             let originalContent = '';
             let currentSha: string | undefined;
             try {
                 const fileData = await getFileContent(token!, owner, repo, job.path, currentBranchByRepo[selectedJellyfishRepo] || 'main');
                 originalContent = fileData.content;
                 currentSha = fileData.sha;
             } catch (e) {}

             await generateWithCritiqueLoop(
                 job.path, 
                 job.description, 
                 originalContent, 
                 context, 
                 modelsToUse[jobIndex % modelsToUse.length], // Round robin models
                 (status, content) => {
                     setJellyfishJobs(prev => prev.map(j => j.id === job.id ? { ...j, status, currentContent: content || j.currentContent } : j));
                 }
             ).then(async (finalContent) => {
                 setJellyfishJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'finalizing', currentContent: finalContent } : j));
                 
                 await commitFile({
                     token: token!,
                     owner,
                     repo,
                     branch: currentBranchByRepo[selectedJellyfishRepo] || 'main',
                     path: job.path,
                     content: finalContent,
                     message: `Jellyfish Swarm: ${job.path}`,
                     sha: currentSha
                 });
                 
                 setJellyfishJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'success' } : j));
                 addAuditEntry("Agent Success", `Committed ${job.path} (3-Cycle Verification)`, 'success');
             }).catch(e => {
                 console.error(e);
                 setJellyfishJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'failed', currentContent: e.message } : j));
             });
          };

          const runNext = () => {
              if (jobIndex >= jobs.length) return;
              const job = jobs[jobIndex++];
              processJob(job).finally(() => runNext());
          };

          for (let i = 0; i < CONCURRENCY; i++) runNext();

          // Monitor
           const checkCompletion = setInterval(() => {
                const isAllDone = jobs.every(j => j.status === 'success' || j.status === 'failed');
                if (isAllDone && jobIndex >= jobs.length) {
                    setJellyfishPhase('complete');
                    clearInterval(checkCompletion);
                    addAuditEntry("Mission Complete", "Jellyfish Swarm Operations Concluded.", 'success');
                }
            }, 1000);

      } catch (e: any) {
          console.error(e);
          setAlert({ type: 'error', message: e.message });
          addAuditEntry("Jellyfish Failure", e.message, 'error');
      }
  };
  
  const handleMonolithStart = () => {
      // Trigger the Monolith (Bank Demo) generation directly using the Jellyfish logic
      // But we will pre-fill the prompt via a specific instruction
      if(!activeFile) {
          setAlert({ type: 'error', message: 'Open a repository first to deploy the Monolith.' });
          return;
      }
      setSelectedJellyfishRepo(activeFile.repoFullName);
      // Directly call the handler with the Monolith Trigger word
      handleJellyfishSubmit("The Monolith. Build the Bank Demo. Kick the tires.");
  };


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden font-sans">
      <AlertPopup alert={alert} onClose={() => setAlert(null)} />
      
      {!token ? (
        <AuthModal onSubmit={handleTokenSubmit} isLoading={isLoading} />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 bg-gray-800 border-r border-gray-700 flex-shrink-0 flex flex-col">
            <FileExplorer 
                fileTree={fileTree} 
                onFileSelect={handleFileSelect} 
                onStartMultiEdit={handleStartBulkEdit}
                onStartNewProject={handleStartNewProject}
                onStartProjectExpansion={handleStartProjectExpansion}
                onStartJellyfish={handleJellyfishStart}
                selectedFilePath={activeFile ? activeFile.path : null}
                selectedRepo={activeFile ? activeFile.repoFullName : null}
                selectedFiles={selectedFiles}
                onFileSelection={toggleFileSelection}
                onDirectorySelection={toggleDirectorySelection}
            />
            {/* AUDIT LOG PANEL */}
            <div className="flex-shrink-0 h-48 border-t border-gray-700 bg-black p-2 overflow-y-auto font-mono text-xs">
                <div className="flex justify-between items-center mb-1 text-gray-500 uppercase tracking-widest font-bold text-[10px]">
                    <span>Audit Storage</span>
                    <span className="text-green-500 animate-pulse">● Live</span>
                </div>
                <div className="space-y-1">
                    {auditLog.map(entry => (
                        <div key={entry.id} className="flex gap-2 text-gray-400">
                            <span className="text-gray-600">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                            <span className={entry.status === 'error' ? 'text-red-400' : entry.status === 'warning' ? 'text-yellow-400' : 'text-cyan-400'}>
                                {entry.action}:
                            </span>
                            <span className="text-gray-300 truncate">{entry.details}</span>
                        </div>
                    ))}
                    {auditLog.length === 0 && <span className="text-gray-700 italic">System Idle...</span>}
                </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col min-w-0 bg-gray-900 relative">
             {/* Main Editor Area */}
             <EditorCanvas 
                 openFiles={openFiles}
                 activeFile={activeFile || null}
                 onCommit={handleCommit}
                 onAdvancedAiEdit={handleStartAdvancedEdit}
                 onSimpleAiEditRequest={handleSimpleAiEditRequest}
                 onFileContentChange={handleFileContentChange}
                 onCloseFile={handleCloseFile}
                 onSetActiveFile={handleSetActiveFile}
                 isLoading={isLoading}
                 branches={branches}
                 currentBranch={currentBranch}
                 onBranchChange={handleBranchChange}
                 onCreateBranch={handleCreateBranch}
                 onCreatePullRequest={handleCreatePullRequest}
             />
             
             {/* THE MONOLITH BUTTON */}
             {activeFile && (
                 <button
                    onClick={handleMonolithStart}
                    className="absolute bottom-6 left-6 z-20 bg-gradient-to-r from-yellow-600 to-amber-700 text-white font-bold py-3 px-6 rounded shadow-2xl hover:scale-105 transition-transform border border-amber-500/50"
                    title="Deploy Business Demo (The Monolith)"
                 >
                    DEPLOY MONOLITH
                 </button>
             )}
          </div>
        </div>
      )}

      {/* Loading Overlay for main operations */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-gray-800 p-4 rounded-lg flex items-center shadow-lg">
                <Spinner className="mr-3 h-6 w-6" />
                <span className="text-lg font-medium text-gray-200">{loadingMessage}</span>
            </div>
        </div>
      )}

      {/* Modals & Overlays */}
      {isMultiEditModalOpen && (
          <MultiFileAiEditModal 
              fileCount={selectedFiles.size} 
              onClose={() => setMultiEditModalOpen(false)} 
              onSubmit={handleBulkEditSubmit} 
          />
      )}
      
      {isBulkEditing && (
          <BulkEditProgress 
              jobs={bulkEditJobs} 
              onClose={() => setIsBulkEditing(false)} 
              isComplete={bulkEditJobs.every(j => j.status === 'success' || j.status === 'failed' || j.status === 'skipped')} 
          />
      )}

      {isNewProjectModalOpen && (
          <NewProjectModal 
              onClose={() => setNewProjectModalOpen(false)} 
              onSubmit={handleProjectGenerationSubmit} 
          />
      )}

      {isGeneratingProject && (
          <ProjectGenerationProgress 
              jobs={projectGenerationJobs} 
              statusMessage={projectGenerationStatus}
              onClose={() => setIsGeneratingProject(false)} 
              isComplete={projectGenerationJobs.length > 0 && projectGenerationJobs.every(j => j.status === 'success' || j.status === 'failed')} 
          />
      )}

      {isExpansionModalOpen && (
          <ProjectExpansionModal 
              onClose={() => setExpansionModalOpen(false)} 
              onSubmit={handleExpansionSubmit} 
          />
      )}

      {isExpandingProject && (
          <ProjectExpansionProgress 
              jobs={expansionJobs} 
              phase={expansionPhase} 
              onClose={() => setIsExpandingProject(false)} 
              isComplete={expansionPhase === 'complete'} 
          />
      )}

      {isAdvancedEditModalOpen && activeFile && (
          <AdvancedAiEditModal 
              onClose={() => setAdvancedEditModalOpen(false)} 
              onSubmit={handleAdvancedEditSubmit} 
              token={token} 
              repoFullName={activeFile.repoFullName}
          />
      )}

      {isAdvancedEditing && (
          <AdvancedEditProgress 
              jobs={advancedEditJobs} 
              phase={advancedEditPhase} 
              verificationAttempt={verificationAttempt}
              buildLogs={advancedEditBuildLogs}
              workflowRunUrl={workflowRunUrl}
              aiThought={aiThought}
              deploymentUrl={deploymentUrl}
              onClose={() => setIsAdvancedEditing(false)} 
              isComplete={advancedEditPhase === 'complete'} 
          />
      )}
      
      {isAiChatModalOpen && (
          <AiChatModal 
              onClose={() => setAiChatModalOpen(false)} 
              onSubmit={handleSimpleAiEditSubmit} 
          />
      )}

      {isJellyfishModalOpen && selectedJellyfishRepo && (
          <JellyfishModal 
              onClose={() => setJellyfishModalOpen(false)} 
              onSubmit={handleJellyfishSubmit} 
              repoName={selectedJellyfishRepo}
          />
      )}

      {isJellyfishRunning && (
          <JellyfishProgress 
              jobs={jellyfishJobs} 
              phase={jellyfishPhase} 
              onClose={() => setIsJellyfishRunning(false)} 
              isComplete={jellyfishPhase === 'complete'} 
          />
      )}

    </div>
  );
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/ai-executive-magazine-maker | ORIGINAL PATH: diplomat-bit-ai-executive-magazine-maker-45e4d2f/App.tsx
================================================================================

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { TOTAL_PAGES, INITIAL_PAGES, LOCATIONS, STYLES, LookPage, SceneDesc, Asset } from './types';
import { Setup } from './Setup';
import { Book } from './Book';


// --- Constants ---
const MODEL_IMAGE_GEN_NAME = "gemini-2.5-flash-image";
const MODEL_TEXT_NAME = "gemini-2.5-flash";
const MODEL_VEO_NAME = "veo-3.1-fast-generate-preview";

const App: React.FC = () => {
  // --- State ---
  const [person, setPerson] = useState<Asset | null>(null);
  const [brand, setBrand] = useState<Asset | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  
  const [pages, setPages] = useState<LookPage[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [showSetup, setShowSetup] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- AI Helpers ---
  const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePersonUpload = async (file: File) => {
       try { const base64 = await fileToBase64(file); setPerson({ base64, desc: "The Executive" }); } catch (e) { alert("Upload failed"); }
  };
  const handleBrandUpload = async (file: File) => {
       try { const base64 = await fileToBase64(file); setBrand({ base64, desc: "Brand Logo" }); } catch (e) { alert("Upload failed"); }
  };

  const updatePageState = (id: string, updates: Partial<LookPage>) => {
      setPages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const generateSceneList = async (): Promise<SceneDesc[]> => {
      const ai = getAI();
      const prompt = `
      Create a list of ${TOTAL_PAGES} distinct luxury fashion photography scenes for a corporate executive lookbook.
      THEME: ${selectedLocation}.
      STYLE: ${selectedStyle}.
      
      Each scene must be in a different setting within the theme (e.g., if Airport: Check-in, Lounge, Tarmac, In-flight seat, Meeting room).
      The 'outfit' should be high-end corporate wear.
      The 'caption' should be short, punchy marketing copy (max 10 words) describing the lifestyle.

      OUTPUT JSON ARRAY:
      [
        { "setting": "Boardroom Table", "outfit": "Navy pinstripe suit", "caption": "Command the room." },
        ...
      ]
      `;
      
      try {
          const res = await ai.models.generateContent({
              model: MODEL_TEXT_NAME,
              contents: prompt,
              config: { responseMimeType: 'application/json' }
          });
          const text = res.text?.replace(/```json/g, '').replace(/```/g, '').trim() || "[]";
          return JSON.parse(text);
      } catch (e) {
          console.error("Scene Gen Error", e);
          // Fallback scenes
          return Array(TOTAL_PAGES).fill(0).map((_, i) => ({
              setting: `Luxury Scene ${i+1}`,
              outfit: "Corporate Suit",
              caption: "Success is a mindset."
          }));
      }
  };

  const generateImage = async (scene: SceneDesc, isCover: boolean): Promise<string> => {
      if (!person) return "";
      
      const contents: any[] = [];
      
      // Add Person Reference
      contents.push({ text: "REFERENCE 1 (THE MODEL):" });
      contents.push({ inlineData: { mimeType: 'image/jpeg', data: person.base64 } });

      // Add Brand Reference if exists
      if (brand) {
          contents.push({ text: "REFERENCE 2 (THE BRAND/DESIGN):" });
          contents.push({ inlineData: { mimeType: 'image/jpeg', data: brand.base64 } });
      }

      let prompt = `Fashion photography. High-end Magazine Quality. 8k resolution.
      SUBJECT: The person in REFERENCE 1. Maintain facial likeness strictly.
      SETTING: ${scene.setting} in ${selectedLocation}. Expensive, cinematic lighting.
      ATTIRE: ${scene.outfit}. Expensive fabric, perfect fit.
      `;

      if (brand) {
          prompt += `BRANDING: The clothing MUST feature the design from REFERENCE 2. 
          If it's a suit, place it as a lapel pin or subtle pattern. 
          If it's casual/streetwear, place it clearly on the chest. 
          Integrate REFERENCE 2 naturally into the fabric.`;
      }

      if (isCover) {
          prompt += ` COMPOSITION: Magazine Cover shot. Powerful gaze at camera. Bold, confident pose.`;
      } else {
          prompt += ` COMPOSITION: Lifestyle editorial. Candid or posed. Show the environment.`;
      }

      contents.push({ text: prompt });

      try {
          const ai = getAI();
          const res = await ai.models.generateContent({
              model: MODEL_IMAGE_GEN_NAME,
              contents: contents,
              config: { imageConfig: { aspectRatio: '3:4' } }
          });
          const part = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          return part?.inlineData?.data ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : '';
      } catch (e) {
          console.error("Image Gen Error", e);
          return "";
      }
  };

  const generateVideo = async (pageId: string) => {
      const page = pages.find(p => p.id === pageId);
      if (!page || !page.imageUrl) return;

      updatePageState(pageId, { isAnimating: true });

      try {
          const ai = getAI();
          const imageBase64 = page.imageUrl.split(',')[1];
          
          let operation = await ai.models.generateVideos({
              model: MODEL_VEO_NAME,
              image: {
                  imageBytes: imageBase64,
                  mimeType: 'image/jpeg',
              },
              prompt: `Slow motion cinematic fashion shot. ${page.sceneDesc?.setting}. Subtle movement of fabric and hair. Professional lighting.`,
              config: {
                  numberOfVideos: 1,
                  resolution: '720p',
                  aspectRatio: '9:16' 
              }
          });

          // Polling
          while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 5000));
              operation = await ai.operations.getVideosOperation({operation: operation});
          }
          
          const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
          if (videoUri) {
              const vidRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
              const blob = await vidRes.blob();
              const url = URL.createObjectURL(blob);
              updatePageState(pageId, { videoUrl: url });
          }
      } catch (e) {
          console.error("Video Gen Error", e);
      } finally {
          updatePageState(pageId, { isAnimating: false });
      }
  };

  const launchCatalogue = async () => {
      setIsTransitioning(true);
      
      // Initialize Pages
      const initialPages: LookPage[] = [];
      // Cover
      initialPages.push({ id: 'cover', type: 'cover', isLoading: true, pageIndex: 0 });
      // Story Pages
      for (let i = 1; i <= TOTAL_PAGES; i++) {
          initialPages.push({ id: `page-${i}`, type: 'look', isLoading: true, pageIndex: i });
      }
      setPages(initialPages);

      // 1. Generate Scene List
      const scenes = await generateSceneList();
      
      // 2. Generate Cover Immediately
      const coverScene: SceneDesc = { setting: "Abstract Luxury Background", outfit: selectedStyle, caption: "THE ISSUE" };
      generateImage(coverScene, true).then(url => updatePageState('cover', { imageUrl: url, isLoading: false }));

      setTimeout(() => {
          setShowSetup(false);
          setIsTransitioning(false);
          
          // 3. Generate pages in background
          scenes.forEach((scene, index) => {
              if (index >= TOTAL_PAGES) return;
              const pageId = `page-${index + 1}`;
              updatePageState(pageId, { sceneDesc: scene });
              generateImage(scene, false).then(url => updatePageState(pageId, { imageUrl: url, isLoading: false }));
          });

      }, 1500);
  };

  const handleSheetClick = (index: number) => {
      if (index === 0 && currentSheetIndex === 0) return; // Must use button to open cover
      if (index < currentSheetIndex) setCurrentSheetIndex(index);
      else if (index === currentSheetIndex) setCurrentSheetIndex(prev => prev + 1);
  };

  return (
    <div className="lookbook-scene">
      <Setup 
          show={showSetup} 
          isTransitioning={isTransitioning}
          person={person}
          brand={brand}
          selectedLocation={selectedLocation}
          selectedStyle={selectedStyle}
          onPersonUpload={handlePersonUpload}
          onBrandUpload={handleBrandUpload}
          onLocationChange={setSelectedLocation}
          onStyleChange={setSelectedStyle}
          onLaunch={launchCatalogue}
      />
      
      <Book 
          pages={pages}
          currentSheetIndex={currentSheetIndex}
          onSheetClick={handleSheetClick}
          onOpenBook={() => setCurrentSheetIndex(1)}
          onGenerateVideo={generateVideo}
      />
    </div>
  );
};

export default App;

================================================================================
// APPENDED FROM REPO: diplomat-bit/ai-news | ORIGINAL PATH: diplomat-bit-ai-news-cd09a75/App.tsx
================================================================================


import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import NewsCard from './components/NewsCard';
import ChatInterface from './components/ChatInterface';
import { fetchNewsByTopic, getTopicInsights, discoverEmergingTopics } from './services/geminiService';
import { NewsArticle, StaticCategory, FeedPage, LogEntry } from './types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const App: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(Object.values(StaticCategory));
  const [activeCategory, setActiveCategory] = useState<string>(StaticCategory.TOP_STORIES);
  const [pages, setPages] = useState<Record<string, FeedPage>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const initialized = useRef(false);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10));
  };

  const syncCategory = useCallback(async (cat: string) => {
    setLoading(true);
    addLog(`Initiating autonomous catalog for: ${cat}`, 'ai');
    
    const articles = await fetchNewsByTopic(cat);
    addLog(`Acquired ${articles.length} verified signals for ${cat}`, 'success');
    
    const insights = await getTopicInsights(cat, articles);
    addLog(`Synthesized strategic overview for ${cat}`, 'ai');
    
    const newPage: FeedPage = {
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      title: cat,
      description: `Autonomous analysis for ${cat}`,
      articles,
      lastUpdated: new Date().toISOString(),
      aiInsights: insights
    };

    setPages(prev => ({ ...prev, [cat]: newPage }));
    setLoading(false);
  }, []);

  // Initial Discovery
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const startup = async () => {
      addLog("Nexus Core Booting...", "info");
      addLog("Scanning global information sphere for emerging clusters...", "ai");
      
      const emerging = await discoverEmergingTopics();
      if (emerging.length > 0) {
        setCategories(prev => [...prev, ...emerging]);
        addLog(`Discovered and generated ${emerging.length} new Nexus pages.`, 'success');
      }
      
      syncCategory(StaticCategory.TOP_STORIES);
    };

    startup();
  }, [syncCategory]);

  useEffect(() => {
    if (!pages[activeCategory] && !loading) {
      syncCategory(activeCategory);
    }
  }, [activeCategory, pages, loading, syncCategory]);

  const handleGlobalSync = async () => {
    setSyncing(true);
    await syncCategory(activeCategory);
    setSyncing(false);
  };

  const currentPage = pages[activeCategory];

  const sentimentData = currentPage?.articles.reduce((acc: any[], curr) => {
    const name = curr.sentiment.charAt(0).toUpperCase() + curr.sentiment.slice(1);
    const entry = acc.find(a => a.name === name);
    if (entry) { entry.value++; }
    else { acc.push({ name, value: 1 }); }
    return acc;
  }, []) || [];

  const COLORS: Record<string, string> = {
    Positive: '#10b981',
    Neutral: '#3b82f6',
    Negative: '#f43f5e'
  };

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <Sidebar 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory}
        categories={categories}
      />

      <main className="flex-1 ml-64 p-8 lg:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/5 pb-8 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                {activeCategory}
              </h2>
              {loading && (
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mono">
                {currentPage ? `Synchronization Cycle Complete [${new Date(currentPage.lastUpdated).toLocaleTimeString()}]` : 'Awaiting signal synchronization...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={handleGlobalSync}
              disabled={syncing || loading}
              className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/60 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all uppercase tracking-widest mono disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Signal
            </button>
          </div>
        </header>

        {loading && !currentPage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 bg-white/5 rounded-2xl border border-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8 space-y-10">
              {currentPage?.aiInsights && (
                <section className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-2xl"></div>
                  <div className="relative border border-white/10 p-8 rounded-2xl bg-black/40 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95V4.69A6.18 6.18 0 0115 10a6.18 6.18 0 01-2.803 5.31v2.653a1 1 0 01-.897.95 1 1 0 01-1.103-.95v-2.653A6.18 6.18 0 018 10a6.18 6.18 0 012.803-5.31V1.997a1 1 0 011.103-.95zM10 8a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mono">Nexus Executive Summary</h3>
                    </div>
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light italic">
                      {currentPage.aiInsights}
                    </p>
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentPage?.articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            <aside className="col-span-12 lg:col-span-4 space-y-10">
              <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-8 sticky top-8">
                <div className="mb-8">
                  <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mono mb-6">Sentiment Spectrum</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mono mb-6">Information Vectors</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(currentPage?.articles.flatMap(a => a.tags))).map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] mono text-white/50 uppercase tracking-tight hover:border-cyan-500/30 hover:text-cyan-400 transition-colors cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mono mb-6">System Log Feed</h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scroll">
                    {logs.map((log) => (
                      <div key={log.id} className="flex gap-4 text-[10px] mono leading-tight">
                        <span className="text-white/20 whitespace-nowrap">[{log.timestamp}]</span>
                        <span className={`
                          ${log.type === 'ai' ? 'text-cyan-400' : ''}
                          ${log.type === 'success' ? 'text-emerald-400' : ''}
                          ${log.type === 'warning' ? 'text-amber-400' : ''}
                          ${log.type === 'info' ? 'text-white/40' : ''}
                        `}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <ChatInterface articles={currentPage?.articles || []} />
    </div>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ai-powe3red-chromos-file-manager- | ORIGINAL PATH: diplomat-bit-ai-powe3red-chromos-file-manager--4e3b7ea/App.tsx
================================================================================


import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, RotateCw, LayoutGrid, List, MoreVertical, ChevronRight, 
  ArrowLeft, X, Plus, Folder, Brain, MessageSquare, FileUp, Sparkles, 
  Loader2, FolderPlus, Share2, Trash2, Download, Github, Palette,
  Globe, UserPlus, Image as ImageIcon, HardDrive, Eye, Maximize2, Terminal,
  Cloud, LogIn, CloudOff, Star, Shield, Info, Lock, Mail, User, CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FileItem, FileType, FileSource } from './types';
import { NAV_ITEMS, getFileIcon, formatSize } from './constants';
import { smartSearch, indexFile, queryKnowledgeBase, generateAIImage } from './services/geminiService';
import { fetchUserRepos, mapGithubToFiles, fetchRepoContents, fetchRawGithubContent } from './services/githubService';
import { fetchDriveFiles, mapDriveToFiles, fetchDriveFileContent } from './services/googleDriveService';
import { str } from './lib/loadTimeData';

export default function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentNav, setCurrentNav] = useState('root');
  const [path, setPath] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'gallery'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResults, setAiResults] = useState<string[] | null>(null);
  
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [githubUsers, setGithubUsers] = useState<string[]>(['jocall3']);
  const [driveToken, setDriveToken] = useState<string | null>("demo-token");

  // UI Panels
  const [isBrainOpen, setIsBrainOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  // AI State
  const [brainChat, setBrainChat] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [brainInput, setBrainInput] = useState('');
  const [isBrainThinking, setIsBrainThinking] = useState(false);
  const [studioPrompt, setStudioPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFolderId = path.length > 0 ? path[path.length - 1] : currentNav;

  const selectedFile = useMemo(() => {
    if (selectedIds.length !== 1) return null;
    return files.find(f => f.id === selectedIds[0]) || null;
  }, [selectedIds, files]);

  // Initial Data Load
  useEffect(() => {
    githubUsers.forEach(user => syncUserRepos(user));
    syncDriveRoot("demo-token");
  }, []);

  const filteredFiles = useMemo(() => {
    let base = files;
    if (aiResults) base = files.filter(f => aiResults.includes(f.id));
    else if (searchQuery && !isSearching) {
      base = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      base = files.filter(f => f.parentId === currentFolderId);
    }
    
    if (currentNav === 'starred') base = files.filter(f => f.aiKeywords?.includes('starred'));
    if (viewMode === 'gallery') base = base.filter(f => f.type === FileType.IMAGE);
    
    return base;
  }, [files, currentFolderId, searchQuery, aiResults, isSearching, viewMode, currentNav]);



  const syncDriveRoot = async (token: string) => {
    setIsLoadingContent(true);
    try {
      const driveItems = await fetchDriveFiles(token);
      const mapped = mapDriveToFiles(driveItems, 'drive');
      setFiles(prev => {
        const others = prev.filter(f => f.source !== 'google-drive');
        return [...others, ...mapped];
      });
    } finally {
      setIsLoadingContent(false);
    }
  };

  const syncUserRepos = async (username: string) => {
    setIsLoadingContent(true);
    const repos = await fetchUserRepos(username);
    const mapped = mapGithubToFiles(repos, `gh-${username}`, username, "Repositories");
    const userFolder: FileItem = {
      id: `gh-${username}`,
      name: `${username} (GitHub)`,
      type: FileType.FOLDER,
      size: null,
      lastModified: new Date().toLocaleDateString(),
      parentId: 'root',
      source: 'github',
      githubOwner: username
    };
    setFiles(prev => {
      const others = prev.filter(f => !(f.source === 'github' && f.githubOwner === username));
      return [...others, userFolder, ...mapped];
    });
    setIsLoadingContent(false);
  };

  const handleFolderClick = async (file: FileItem) => {
    if (file.type !== FileType.FOLDER) return;
    
    if (file.source === 'github' && file.githubOwner && file.githubRepo) {
      const existingChildren = files.some(f => f.parentId === file.id);
      if (!existingChildren) {
        setIsLoadingContent(true);
        const ghContents = await fetchRepoContents(file.githubOwner, file.githubRepo, file.name === file.githubRepo ? "" : file.name);
        const mapped = mapGithubToFiles(ghContents, file.id, file.githubOwner, file.githubRepo);
        setFiles(prev => [...prev, ...mapped]);
        setIsLoadingContent(false);
      }
    }

    if (file.source === 'google-drive' && driveToken && file.driveFileId) {
      const existingChildren = files.some(f => f.parentId === file.id);
      if (!existingChildren) {
        setIsLoadingContent(true);
        try {
          const driveItems = await fetchDriveFiles(driveToken, file.driveFileId);
          const mapped = mapDriveToFiles(driveItems, file.id);
          setFiles(prev => [...prev, ...mapped]);
        } finally {
          setIsLoadingContent(false);
        }
      }
    }

    setPath([...path, file.id]);
    setSelectedIds([]);
  };

  const openFileViewer = async (file: FileItem) => {
    setPreviewFile(file);
    setPreviewContent(null);
    setIsLoadingContent(true);

    if (file.type === FileType.IMAGE && file.source !== 'google-drive') {
      setPreviewContent(file.content || "");
    } else if (file.source === 'github' && file.content) {
      const text = await fetchRawGithubContent(file.content);
      setPreviewContent(text);
      if (!file.aiSummary) indexExistingFile(file, text);
    } else if (file.source === 'google-drive' && driveToken && file.driveFileId) {
      const text = await fetchDriveFileContent(driveToken, file.driveFileId);
      setPreviewContent(text);
      if (!file.aiSummary) indexExistingFile(file, text);
    } else if (file.source === 'local' && file.content) {
      setPreviewContent(file.content);
    } else {
      setPreviewContent("Content unavailable for direct preview. Source: " + file.source);
    }
    setIsLoadingContent(false);
  };

  const indexExistingFile = async (file: FileItem, actualContent: string) => {
    const res = await indexFile({ ...file, content: actualContent });
    setFiles(p => p.map(f => f.id === file.id ? { ...f, aiSummary: res.summary, aiKeywords: res.keywords } : f));
  };

  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) { setAiResults(null); return; }
    setIsSearching(true);
    try {
      const results = await smartSearch(searchQuery, files);
      setAiResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBrainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brainInput.trim()) return;
    const msg = brainInput;
    setBrainInput('');
    setBrainChat(prev => [...prev, { role: 'user', text: msg }]);
    setIsBrainThinking(true);
    try {
      const res = await queryKnowledgeBase(msg, files);
      setBrainChat(prev => [...prev, { role: 'ai', text: res }]);
    } finally {
      setIsBrainThinking(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateAIImage(studioPrompt);
      const newFile: FileItem = {
        id: `ai-${Date.now()}`,
        name: `Studio_${Math.floor(Math.random()*1000)}.png`,
        type: FileType.IMAGE,
        size: result.dataUrl.length,
        lastModified: new Date().toLocaleDateString(),
        parentId: 'ai-gallery',
        source: 'ai',
        content: result.dataUrl,
        mimeType: 'image/png',
        aiSummary: studioPrompt,
      };
      setFiles(prev => [...prev, newFile]);
      setStudioPrompt('');
      setIsStudioOpen(false);
      setCurrentNav('ai-gallery');
      setPath([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const loadedFiles = e.target.files;
    if (!loadedFiles) return;
    Array.from(loadedFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        const newFile: FileItem = {
          id: Math.random().toString(36).substring(2, 11),
          name: file.name,
          type: file.type.startsWith('image/') ? FileType.IMAGE : FileType.DOCUMENT,
          size: file.size,
          lastModified: new Date().toLocaleDateString(),
          parentId: currentFolderId,
          source: 'local',
          content,
          mimeType: file.type
        };
        setFiles(prev => [...prev, newFile]);
        const indexRes = await indexFile(newFile);
        setFiles(p => p.map(f => f.id === newFile.id ? { ...f, aiSummary: indexRes.summary, aiKeywords: indexRes.keywords } : f));
      };
      file.type.startsWith('text/') ? reader.readAsText(file) : reader.readAsDataURL(file);
    });
  };



  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] select-none overflow-hidden relative font-sans text-[#3c4043]">
      <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
      
      <aside className="w-72 border-r border-gray-200 flex flex-col bg-white z-10 shrink-0">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
              <HardDrive size={24} />
            </div>
            <div>
              <div className="font-black text-2xl tracking-tighter text-gray-900 leading-none">OMNI</div>
              <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Next-Gen Manager</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
          <div className="space-y-1">
            <div className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Workspace</div>
            {NAV_ITEMS.filter(i => ['root', 'recent', 'starred'].includes(i.id)).map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentNav(item.id); setPath([]); setAiResults(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${currentNav === item.id && path.length === 0 ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
            <button
                onClick={() => { setCurrentNav('drive'); setPath([]); setAiResults(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${currentNav === 'drive' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <Cloud size={18} /> My Google Drive
                <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full shadow-sm"></div>
            </button>
            <button
                onClick={() => { setCurrentNav('ai-gallery'); setPath([]); setAiResults(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${currentNav === 'ai-gallery' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <Palette size={18} /> AI Studio Art
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex justify-between items-center">
              <span>GitHub Hub</span>
              <button onClick={() => {
                const u = prompt("Sync external repository (User):");
                if(u) { setGithubUsers([...githubUsers, u]); syncUserRepos(u); }
              }} className="p-1 hover:bg-indigo-50 rounded-lg text-indigo-600"><UserPlus size={14}/></button>
            </div>
            {githubUsers.map(user => (
              <button
                key={user}
                onClick={() => { setCurrentNav(`gh-${user}`); setPath([]); setAiResults(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${currentNav === `gh-${user}` ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <Github size={18}/> {user}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 pt-4 border-t border-gray-100 bg-gray-50/30">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-600 text-white shadow-lg shadow-indigo-100`}>
                   <User size={18}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-900 truncate">OMNI User</div>
                  <div className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 size={8}/> Dynamic Session
                  </div>
                </div>
                <div className="p-2 text-gray-300 hover:text-indigo-500 transition-colors" title="Settings"><Palette size={14}/></div>
             </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-white shadow-2xl relative z-0">
        <header className="h-24 flex items-center justify-between px-10 border-b border-gray-100 bg-white/90 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-6 min-w-0">
            {path.length > 0 && (
              <button onClick={() => setPath(path.slice(0, -1))} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400">
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="font-black text-2xl text-gray-900 tracking-tight">
                {NAV_ITEMS.find(n => n.id === currentNav)?.label || currentNav.replace('gh-', '')}
              </span>
              {path.map((folderId) => {
                const folderName = files.find(f => f.id === folderId)?.name || 'Folder';
                return (
                  <React.Fragment key={folderId}>
                    <ChevronRight size={20} className="text-gray-200 shrink-0" />
                    <span className="font-bold text-gray-400 text-lg whitespace-nowrap truncate max-w-[150px]">{folderName}</span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-[28px] px-7 py-3.5 w-[450px] focus-within:bg-white focus-within:ring-[10px] focus-within:ring-indigo-50/50 transition-all border border-transparent focus-within:border-indigo-100 group shadow-inner">
              <Search size={18} className="text-gray-400 mr-4 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text"
                placeholder="Ask OMNI about your cloud documents..."
                className="bg-transparent border-none outline-none text-sm w-full font-bold text-gray-700 placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
              />
              <Sparkles size={16} className={`ml-3 transition-all ${isSearching ? 'text-indigo-500 animate-spin-slow' : 'text-gray-300'}`} />
            </div>
            <button 
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : viewMode === 'grid' ? 'gallery' : 'list')}
              className="p-3.5 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 transition-all font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 border border-transparent hover:border-gray-200"
            >
              {viewMode === 'list' ? <List size={18}/> : viewMode === 'grid' ? <LayoutGrid size={18}/> : <ImageIcon size={18}/>}
              <span className="hidden lg:inline">{viewMode}</span>
            </button>
          </div>
        </header>

        {selectedFile && (
          <div className="mx-10 mt-6 p-6 rounded-[36px] bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 text-white flex items-center gap-10 animate-in slide-in-from-top-6 duration-700 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[28px] flex items-center justify-center text-white shrink-0 shadow-lg border border-white/20">
              {React.cloneElement(getFileIcon(selectedFile.type, false) as React.ReactElement, { size: 40 })}
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-3 mb-2">
                 <span className="text-[10px] font-black uppercase text-indigo-100 tracking-widest px-3 py-1 bg-white/20 rounded-full border border-white/10 flex items-center gap-2">
                   {selectedFile.source === 'google-drive' ? <Cloud size={10}/> : selectedFile.source === 'github' ? <Github size={10}/> : <HardDrive size={10}/>}
                   {selectedFile.source} Content
                 </span>
                 <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{formatSize(selectedFile.size)}</span>
               </div>
               <h3 className="font-black text-2xl text-white truncate drop-shadow-sm">{selectedFile.name}</h3>
               <p className="text-sm text-indigo-100/80 mt-2 line-clamp-1 italic font-medium">
                 {selectedFile.aiSummary || "OMNI Brain is distilling the essence of this file..."}
               </p>
            </div>
            <div className="flex gap-4 relative z-10">
               <button onClick={() => openFileViewer(selectedFile)} className="px-8 py-4 bg-white text-indigo-600 rounded-3xl font-black text-xs uppercase tracking-[0.1em] shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                 <Eye size={18}/> Insight Preview
               </button>
               <button onClick={() => setSelectedIds([])} className="p-4 bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-full transition-colors hover:bg-white/20"><X size={20}/></button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-10 scroll-smooth">
          {filteredFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 bg-gray-50 rounded-[60px] flex items-center justify-center mb-10 border border-gray-100/50 shadow-inner">
                <Globe size={80} className="text-gray-200" />
              </div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">Cloud region empty</h2>
              <p className="text-base text-gray-400 mt-4 max-w-sm font-medium leading-relaxed italic">Upload local work or sync your cloud hubs to manifest data here.</p>
            </div>
          ) : (
            <div className={`grid gap-10 ${
              viewMode === 'list' ? 'grid-cols-1' : 
              viewMode === 'gallery' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
              'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'
            }`}>
              {filteredFiles.map(file => (
                <div 
                  key={file.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if(e.ctrlKey || e.metaKey) setSelectedIds(prev => prev.includes(file.id) ? prev.filter(i => i !== file.id) : [...prev, file.id]);
                    else setSelectedIds([file.id]);
                  }}
                  onDoubleClick={() => file.type === FileType.FOLDER ? handleFolderClick(file) : openFileViewer(file)}
                  className={`group relative flex flex-col p-6 rounded-[40px] border-2 transition-all cursor-pointer ${
                    selectedIds.includes(file.id) 
                    ? 'bg-white border-indigo-600 ring-[12px] ring-indigo-50/50 scale-105 shadow-2xl z-10' 
                    : 'bg-white border-transparent hover:border-gray-100 hover:shadow-xl'
                  }`}
                >
                  <div className="absolute top-5 right-5 flex gap-2">
                    {file.source === 'google-drive' && <Cloud size={14} className="text-blue-400 drop-shadow-sm"/>}
                    {file.source === 'github' && <Github size={14} className="text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"/>}
                    {file.source === 'ai' && <Sparkles size={14} className="text-purple-500 animate-pulse"/>}
                  </div>
                  
                  <div className={`flex-1 mb-6 rounded-[30px] flex items-center justify-center transition-transform group-hover:scale-110 overflow-hidden bg-gray-50 aspect-square shadow-inner`}>
                    {file.type === FileType.IMAGE && file.content ? (
                      <img src={file.content} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      React.cloneElement(getFileIcon(file.type) as React.ReactElement, { size: 56 })
                    )}
                  </div>
                  
                  <div className="px-1">
                    <span className="text-sm font-black text-gray-900 truncate block text-center leading-tight">{file.name}</span>
                    <div className="flex items-center justify-center gap-2 mt-2">
                       <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                         {file.type === FileType.FOLDER ? 'Folder' : formatSize(file.size)}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="h-32 px-12 border-t border-gray-100 bg-white/90 backdrop-blur-2xl flex items-center justify-between z-30">
           <div className="flex gap-5">
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="flex items-center gap-4 px-10 py-5 bg-gray-900 text-white rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
             >
               <FileUp size={22}/> Local Files
             </button>
             <button onClick={() => setIsStudioOpen(true)} className="px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-[32px] font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
               <Palette size={22}/> Creative Studio
             </button>
           </div>
           
           <div className="flex items-center gap-5">
             <button 
               onClick={() => setIsBrainOpen(true)}
               className="p-5 bg-white border border-gray-100 text-indigo-600 rounded-full shadow-lg hover:bg-indigo-50 hover:border-indigo-200 transition-all active:scale-90"
             >
               <Brain size={28} className="animate-pulse" />
             </button>
             <button className={`px-16 py-5 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 ${
               selectedIds.length > 0 ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-110 active:scale-100' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
             }`} disabled={selectedIds.length === 0}>
               Analyze Hub
             </button>
           </div>
        </footer>
      </main>

      {previewFile && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-[300] flex items-stretch p-12 animate-in fade-in duration-500">
           <div className="bg-white rounded-[60px] shadow-2xl w-full flex overflow-hidden border border-white/10">
              <div className="flex-1 flex flex-col min-w-0">
                <div className="h-28 px-12 border-b border-gray-100 flex items-center justify-between bg-white relative">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-gray-50 rounded-3xl shadow-inner">{getFileIcon(previewFile.type)}</div>
                    <div>
                      <h2 className="font-black text-3xl text-gray-900 leading-tight tracking-tight">{previewFile.name}</h2>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">{previewFile.source} Connection</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatSize(previewFile.size)}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setPreviewFile(null)} className="p-5 bg-red-500 text-white rounded-3xl hover:bg-red-600 transition-all shadow-xl shadow-red-100 active:scale-90 ml-6"><X size={28}/></button>
                </div>
                
                <div className="flex-1 overflow-auto bg-gray-50 p-16 relative">
                  {isLoadingContent ? (
                    <div className="h-full flex items-center justify-center flex-col gap-8">
                      <div className="relative">
                        <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <Brain size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-pulse" />
                      </div>
                      <span className="text-sm font-black uppercase text-indigo-600 tracking-[0.3em] animate-pulse">Retrieving Data...</span>
                    </div>
                  ) : previewFile.type === FileType.IMAGE ? (
                    <div className="h-full flex items-center justify-center">
                      <img src={previewContent || ""} className="max-w-full max-h-[70vh] object-contain rounded-[40px] shadow-2xl border-[16px] border-white" />
                    </div>
                  ) : (
                    <div className="max-w-5xl mx-auto bg-white rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 h-full flex flex-col">
                      <div className="h-16 px-10 bg-[#1e1e2e] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                          <span className="text-[11px] font-black text-[#6272a4] uppercase tracking-[0.2em] ml-6 font-mono">Stream.log</span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto bg-[#282a36] p-12 text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {previewContent || "// Content stream initiated. Analyzing..."}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-[480px] border-l border-gray-100 bg-white flex flex-col shrink-0">
                <div className="p-12 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-4 text-indigo-600 mb-10">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-indigo-50"><Brain size={32}/></div>
                    <span className="font-black text-xl uppercase tracking-tighter text-gray-900">Semantic Insight</span>
                  </div>
                  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                    <h4 className="font-black text-xs text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles size={14}/> Gemini Summary
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      {previewFile.aiSummary || "OMNI is analyzing this document context. Semantic data will appear shortly..."}
                    </p>
                  </div>
                </div>
                <div className="flex-1 p-12 overflow-y-auto">
                   <div className="text-center py-10 space-y-8">
                      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-200">
                        <MessageSquare size={32}/>
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">Ask specific questions about this document in the OMNI Brain.</p>
                      <button onClick={() => setIsBrainOpen(true)} className="px-8 py-4 bg-indigo-50 text-indigo-600 rounded-3xl font-black text-xs uppercase tracking-widest border border-indigo-100">Launch Brain</button>
                   </div>
                </div>
                <div className="p-12 border-t border-gray-100">
                   <button className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest">Share Cloud Link</button>
                </div>
              </div>
           </div>
        </div>
      )}

      {isStudioOpen && (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-2xl z-[500] flex items-center justify-center p-8 animate-in fade-in">
           <div className="bg-white rounded-[64px] shadow-2xl w-full max-w-3xl overflow-hidden">
              <div className="p-14 bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 text-white relative">
                <div className="flex items-center gap-8">
                  <div className="p-6 bg-white/10 rounded-[36px] backdrop-blur-3xl border border-white/20 shadow-2xl"><Palette size={56}/></div>
                  <div>
                    <h2 className="text-5xl font-black tracking-tighter">AI Studio</h2>
                    <p className="text-xs text-white/50 font-black uppercase tracking-[0.4em] mt-3">Synthesizing Imagery</p>
                  </div>
                </div>
                <button onClick={() => setIsStudioOpen(false)} className="absolute top-10 right-10 p-4 hover:bg-white/10 rounded-full transition-all active:scale-90"><X size={36}/></button>
              </div>
              <div className="p-16">
                <form onSubmit={handleGenerateImage} className="space-y-12">
                   <textarea 
                     value={studioPrompt}
                     onChange={(e) => setStudioPrompt(e.target.value)}
                     placeholder="Describe your creative vision..."
                     className="w-full h-56 p-10 bg-gray-50 rounded-[48px] border-none outline-none text-gray-800 placeholder:text-gray-300 font-black text-2xl resize-none shadow-inner focus:ring-[20px] focus:ring-indigo-50 transition-all leading-tight"
                   />
                   <button disabled={isGenerating || !studioPrompt.trim()} className="w-full py-8 bg-indigo-600 text-white rounded-[40px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-6">
                     {isGenerating ? <Loader2 className="animate-spin" size={32}/> : <Sparkles size={32}/>} 
                     {isGenerating ? "Manifesting..." : "Generate Masterpiece"}
                   </button>
                </form>
              </div>
           </div>
        </div>
      )}

      <div className={`fixed right-0 top-0 h-full w-[550px] bg-white border-l border-gray-100 shadow-[0_0_120px_rgba(0,0,0,0.15)] transition-transform duration-700 z-[400] flex flex-col ${isBrainOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-12 border-b border-gray-100 bg-[#fbfbfb] flex items-center justify-between">
          <div className="flex items-center gap-6 text-indigo-600">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-indigo-50"><Brain size={36}/></div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 leading-none">OMNI BRAIN</h2>
              <p className="text-[10px] text-indigo-500 uppercase font-black tracking-widest mt-2">Unified Neural IQ</p>
            </div>
          </div>
          <button onClick={() => setIsBrainOpen(false)} className="p-5 hover:bg-gray-200 rounded-full text-gray-400 transition-all"><X size={32}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-12 space-y-10 bg-white">
          {brainChat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[90%] px-10 py-6 rounded-[40px] text-sm leading-relaxed shadow-sm border font-medium ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none border-transparent' : 'bg-gray-50 text-gray-800 rounded-tl-none border-gray-100'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isBrainThinking && (
            <div className="flex justify-start">
              <div className="bg-gray-50 px-10 py-6 rounded-[40px] rounded-tl-none border border-gray-100 flex gap-4">
                <div className="w-3 h-3 bg-indigo-200 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleBrainSubmit} className="p-12 bg-white border-t border-gray-100">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Inquire about your unified workspace..."
              className="w-full bg-gray-50 border-none outline-none py-7 px-10 rounded-[36px] text-base font-bold text-gray-800 focus:bg-white focus:ring-[14px] focus:ring-indigo-50/50 transition-all pr-24 shadow-inner"
              value={brainInput}
              onChange={(e) => setBrainInput(e.target.value)}
            />
            <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 p-5 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all active:scale-90">
              <ArrowLeft className="rotate-180" size={28}/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-demai-jocalll3 | ORIGINAL PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/App.tsx
================================================================================

import React, { useState, useContext, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import InvestmentsView from './components/InvestmentsView';
import AIAdvisorView from './components/AIAdvisorView';
import SecurityView from './components/SecurityView';
import BudgetsView from './components/BudgetsView';
import VoiceControl from './components/VoiceControl';
import QuantumWeaverView from './components/QuantumWeaverView';
import AgentMarketplaceView from './components/MarketplaceView';
import { View, IllusionType, FinancialGoal, AIGoalPlan, CryptoAsset, VirtualCard, PaymentOperation, CorporateCard, CorporateTransaction, NFTAsset, RewardItem, APIStatus } from './types';
import { DataProvider, DataContext } from './context/DataContext';
import { GoogleGenAI, Modality, Type } from "@google/genai";
import Card from './components/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, AreaChart, Area } from 'recharts';
import CorporateCommandView from './components/CorporateCommandView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import CryptoView from './components/CryptoView';
import FinancialGoalsView from './components/FinancialGoalsView';


const TheVisionView: React.FC = () => (
    <div className="space-y-8 text-gray-300 max-w-4xl mx-auto">
        <div className="text-center">
            <h1 className="text-5xl font-bold text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">The Winning Vision</h1>
            <p className="mt-4 text-lg text-gray-400">This is not a bank. It is a financial co-pilot.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Card variant="outline"><h3 className="text-xl font-semibold text-cyan-300">Hyper-Personalized</h3><p className="mt-2 text-sm">Every pixel, insight, and recommendation is tailored to your unique financial journey.</p></Card>
            <Card variant="outline"><h3 className="text-xl font-semibold text-cyan-300">Proactive & Predictive</h3><p className="mt-2 text-sm">We don't just show you the past; our AI anticipates your needs and guides your future.</p></Card>
            <Card variant="outline"><h3 className="text-xl font-semibold text-cyan-300">Platform for Growth</h3><p className="mt-2 text-sm">A suite of tools for creators, founders, and businesses to build their visions upon.</p></Card>
        </div>

        <div>
            <h2 className="text-3xl font-semibold text-white mb-4">Core Tenets</h2>
            <ul className="space-y-4">
                <li className="p-4 bg-gray-800/50 rounded-lg"><strong className="text-cyan-400">The AI is a Partner, Not Just a Tool:</strong> Our integration with Google's Gemini API is designed for collaboration. From co-creating your bank card's design to generating a business plan, the AI is a creative and strategic partner.</li>
                <li className="p-4 bg-gray-800/50 rounded-lg"><strong className="text-cyan-400">Seamless Integration is Reality:</strong> We demonstrate enterprise-grade readiness with high-fidelity simulations of Plaid, Stripe, Marqeta, and Modern Treasury. This isn't a concept; it's a blueprint for a fully operational financial ecosystem.</li>
                <li className="p-4 bg-gray-800/50 rounded-lg"><strong className="text-cyan-400">Finance is a Gateway, Not a Gatekeeper:</strong> Features like the Quantum Weaver Incubator and the AI Ad Studio are designed to empower creation. We provide not just the capital, but the tools to build, market, and grow.</li>
                <li className="p-4 bg-gray-800/50 rounded-lg"><strong className="text-cyan-400">The Future is Multi-Rail:</strong> Our platform is fluent in both traditional finance (ISO 20022) and the decentralized future (Web3). The Crypto & Corporate hubs are designed to manage value, no matter how it's represented.</li>
            </ul>
        </div>
    </div>
);

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

const APIIntegrationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("APIIntegrationView must be within a DataProvider.");
    const { apiStatus, geminiApiKey, setGeminiApiKey } = context;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');

    const handleSaveKey = () => {
        setGeminiApiKey(apiKeyInput);
        setIsModalOpen(false);
    };

    const StatusIndicator: React.FC<{ status: APIStatus['status'] }> = ({ status }) => {
        const colors = {
            'Operational': { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400' },
            'Degraded Performance': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-400' },
            'Partial Outage': { bg: 'bg-orange-500/20', text: 'text-orange-300', dot: 'bg-orange-400' },
            'Major Outage': { bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
        };
        const style = colors[status];
        return (
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                {status}
            </div>
        );
    };

    return (
        <>
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">Configure Google Gemini API Key</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-400">Enter your API key to enable all AI features. Your key is stored locally in your browser and is not sent to our servers.</p>
                            <input
                                type="password"
                                value={apiKeyInput}
                                onChange={(e) => setApiKeyInput(e.target.value)}
                                placeholder="Enter your Gemini API Key"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                            <button onClick={handleSaveKey} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Save Key</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">System & API Status</h2>
                <Card>
                    <div className="space-y-3">
                        {apiStatus.map(api => (
                            <div key={api.provider} className="flex flex-col sm:flex-row justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                                <h4 className="font-semibold text-lg text-white mb-2 sm:mb-0">{api.provider}</h4>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-400 font-mono">{api.responseTime}ms</p>
                                    <StatusIndicator status={api.status} />
                                    {api.provider === 'Google Gemini' && (
                                        <button onClick={() => { setApiKeyInput(geminiApiKey || ''); setIsModalOpen(true); }} className="text-gray-400 hover:text-white">
                                            <SettingsIcon className="h-5 w-5"/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Simulated Live API Traffic">
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={Array.from({length: 20}, (_, i) => ({name: i, calls: 50 + Math.random() * 50}))}>
                                <defs><linearGradient id="apiColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                <Area type="monotone" dataKey="calls" stroke="#06b6d4" fill="url(#apiColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </>
    );
};

const RewardsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("RewardsView must be within a DataProvider.");
    const { rewardPoints, gamification, rewardItems, redeemReward } = context;

    const [message, setMessage] = useState('');

    const handleRedeem = (item: RewardItem) => {
        const success = redeemReward(item);
        setMessage(success ? `Successfully redeemed ${item.name}!` : `Not enough points for ${item.name}.`);
        setTimeout(() => setMessage(''), 3000);
    };
    
    const REWARD_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
        cash: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        gift: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4H5z" /></svg>,
        leaf: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 3.5a1.5 1.5 0 011.5 1.5v.92l5.06 4.69a1.5 1.5 0 01-.18 2.4l-3.38 1.95a1.5 1.5 0 01-1.5-.26L10 12.43l-1.5 2.25a1.5 1.5 0 01-1.5.26l-3.38-1.95a1.5 1.5 0 01-.18-2.4l5.06-4.69V5A1.5 1.5 0 0110 3.5z" /></svg>,
    };

    return (
        <div className="space-y-6">
             <h2 className="text-3xl font-bold text-white tracking-wider">Rewards Hub</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Your Points" className="md:col-span-1">
                     <div className="text-center">
                        <p className="text-5xl font-bold text-cyan-300">{rewardPoints.balance.toLocaleString()}</p>
                        <p className="text-gray-400">{rewardPoints.currency}</p>
                     </div>
                </Card>
                 <Card title="Your Level" className="md:col-span-2">
                     <div className="flex items-center gap-6">
                         <h3 className="text-2xl font-semibold text-white flex-1">{gamification.levelName} <span className="text-base text-gray-400">(Level {gamification.level})</span></h3>
                         <div className="w-full max-w-xs">
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${gamification.progress}%` }}></div>
                            </div>
                         </div>
                     </div>
                 </Card>
             </div>
             <Card title="Redeem Your Points">
                 {message && <p className="text-center mb-4 text-cyan-200">{message}</p>}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {rewardItems.map(item => {
                         const Icon = REWARD_ICONS[item.iconName];
                         return (
                            <div key={item.id} className="p-4 bg-gray-800/50 rounded-lg flex flex-col">
                                 <Icon className="w-8 h-8 text-cyan-400 mb-2" />
                                 <h4 className="font-semibold text-white flex-grow">{item.name}</h4>
                                 <p className="text-xs text-gray-400 my-2">{item.description}</p>
                                 <div className="flex justify-between items-center mt-auto">
                                     <p className="font-mono text-cyan-300">{item.cost.toLocaleString()} pts</p>
                                     <button onClick={() => handleRedeem(item)} disabled={rewardPoints.balance < item.cost} className="px-3 py-1 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-xs disabled:opacity-50">Redeem</button>
                                 </div>
                            </div>
                         );
                     })}
                 </div>
             </Card>
        </div>
    );
};

const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CreditHealthView must be within a DataProvider.");
    const { creditScore, creditFactors, geminiApiKey } = context;

    const [insight, setInsight] = useState('');
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);

    const getAIInsight = async () => {
        setIsLoadingInsight(true);
        if (!geminiApiKey) {
            setInsight("Please set your Gemini API key in the API Status view to get insights.");
            setIsLoadingInsight(false);
            return;
        }
        try {
            const ai = new GoogleGenAI({apiKey: geminiApiKey});
            const prompt = `A user has a credit score of ${creditScore.score}. Their credit factors are: ${creditFactors.map(f => `${f.name}: ${f.status}`).join(', ')}. Provide one concise, actionable tip to help them improve their score.`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setInsight(response.text);
        } catch (err) {
            console.error("Error getting credit insight:", err);
            setInsight("Could not generate a personalized tip at this time.");
        } finally {
            setIsLoadingInsight(false);
        }
    };
    
    useEffect(() => { getAIInsight() }, [geminiApiKey]);

    const StatusIndicator: React.FC<{ status: 'Excellent' | 'Good' | 'Fair' | 'Poor' }> = ({ status }) => {
        const colors = { Excellent: 'bg-green-500', Good: 'bg-cyan-500', Fair: 'bg-yellow-500', Poor: 'bg-red-500' };
        return <div className={`w-3 h-3 rounded-full ${colors[status]}`}></div>
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Credit Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Your Credit Score" subtitle={`Rating: ${creditScore.rating}`}>
                     <p className="text-7xl font-bold text-center text-white my-8">{creditScore.score}</p>
                </Card>
                <Card title="AI-Powered Tip">
                     <div className="flex flex-col justify-center items-center h-full text-center">
                         {isLoadingInsight ? <p>Analyzing...</p> : <p className="text-gray-300 italic">"{insight}"</p>}
                     </div>
                </Card>
            </div>
            <Card title="Factors Impacting Your Score">
                <div className="space-y-3">
                    {creditFactors.map(factor => (
                        <div key={factor.name} className="p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-white">{factor.name}</h4>
                                <div className="flex items-center gap-2"><StatusIndicator status={factor.status} /><span className="text-sm text-gray-300">{factor.status}</span></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{factor.description}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const SettingsView: React.FC = () => (
     <div className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white tracking-wider">Settings</h2>
         <Card title="Profile">
            <p className="text-gray-400">Name: <span className="text-white">The Visionary</span></p>
            <p className="text-gray-400">Email: <span className="text-white">visionary@demobank.com</span></p>
         </Card>
         <Card title="Notification Preferences">
             <div className="flex justify-between items-center"><p>Large Transaction Alerts</p><input type="checkbox" className="toggle toggle-sm toggle-cyan" defaultChecked /></div>
             <div className="flex justify-between items-center"><p>Budget Warnings</p><input type="checkbox" className="toggle toggle-sm toggle-cyan" defaultChecked /></div>
             <div className="flex justify-between items-center"><p>AI Insight Notifications</p><input type="checkbox" className="toggle toggle-sm toggle-cyan" /></div>
         </Card>
         <Card title="Theme">
             <p className="text-sm text-gray-400">Theme settings are managed in the <span className="font-semibold text-cyan-300">Personalization</span> view.</p>
         </Card>
    </div>
);

const PersonalizationView: React.FC = () => {
    const context = useContext(DataContext);
    const [prompt, setPrompt] = useState('An isolated lighthouse on a stormy sea, with a powerful beam of light cutting through the darkness.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestedTheme, setSuggestedTheme] = useState<{ name: string, justification: string, type: IllusionType | 'image', url?: string } | null>(null);


    if (!context) {
        throw new Error("PersonalizationView must be within a DataProvider.");
    }
    const { setCustomBackgroundUrl, setActiveIllusion, activeIllusion, geminiApiKey } = context;

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError('');
        if (!geminiApiKey) {
            setError("Please set your Gemini API key in the API Status view to generate images.");
            setIsLoading(false);
            return;
        }
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            });
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setCustomBackgroundUrl(imageUrl);
        } catch (err) {
            console.error("Image generation error:", err);
            setError("Sorry, I couldn't generate the image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const illusionOptions: { id: IllusionType, name: string }[] = [
        { id: 'none', name: 'None' },
        { id: 'aurora', name: 'Aurora' },
    ];
    
    const handleSuggestion = () => {
        setSuggestedTheme({
            name: "Tropical Sunset",
            justification: "Your 'Cyberpunk Vacation' savings goal inspired me to find a theme that matches your dream destination.",
            type: 'image',
            url: '/IMG_5610.webp' // Using a preloaded image for the suggestion
        });
    }
    
    const applySuggestion = () => {
        if (suggestedTheme) {
            if (suggestedTheme.type === 'image' && suggestedTheme.url) {
                setCustomBackgroundUrl(suggestedTheme.url);
            } else if (suggestedTheme.type === 'aurora' || suggestedTheme.type === 'none') {
                 setActiveIllusion(suggestedTheme.type);
            }
        }
    }


    return (
        <div className="space-y-6">
            <Card title="Heuristic API Theme Suggestions">
                <div className="flex flex-col items-center text-center">
                    {!suggestedTheme ? (
                        <>
                         <p className="text-gray-400 mb-4">Let the Heuristic API suggest a personalized theme based on your financial goals and activity.</p>
                         <button onClick={handleSuggestion} className="px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-sm">Suggest a Theme</button>
                        </>
                    ) : (
                        <div>
                             <h4 className="font-semibold text-cyan-300">Theme Suggestion: {suggestedTheme.name}</h4>
                             <p className="text-sm text-gray-400 italic my-2">"{suggestedTheme.justification}"</p>
                             <button onClick={applySuggestion} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm">Apply Theme</button>
                        </div>
                    )}
                </div>
            </Card>
            <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-lg p-6`}>
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Generate App Background</h3>
                <p className="text-gray-400 mb-4">Describe the background you want to see, and let AI create it for you. This will disable any active dynamic visual.</p>
                <div className="space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A calm zen garden with a flowing river"
                        className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate Background'}
                    </button>
                    {error && <p className="text-red-400 text-center">{error}</p>}
                </div>
            </div>
             <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-lg p-6`}>
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Dynamic Visuals</h3>
                <p className="text-gray-400 mb-4">Choose a dynamic, reality-bending background for the app. This will override any generated background image.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {illusionOptions.map(option => (
                        <button 
                            key={option.id}
                            onClick={() => setActiveIllusion(option.id)}
                            className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500
                                ${activeIllusion === option.id 
                                    ? 'bg-cyan-600 text-white shadow-lg' 
                                    : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                                }`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CardCustomizationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("CardCustomizationView must be within a DataProvider.");
    }
    const { geminiApiKey } = context;
    
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('Add a phoenix rising from the center, with its wings made of glowing data streams.');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [cardStory, setCardStory] = useState('');
    const [isStoryLoading, setIsStoryLoading] = useState(false);

    // New states for interactive effects
    const [metallic, setMetallic] = useState(50); // 0-100
    const [holo, setHolo] = useState(false);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setBaseImage(`data:${file.type};base64,${base64}`);
            setGeneratedImage(null); // Clear previous generation
        }
    };

    const handleGenerate = async () => {
        if (!baseImage || !prompt) return;
        setIsLoading(true);
        setError('');
        setGeneratedImage(null);
        if (!geminiApiKey) {
            setError("Please set your Gemini API key in the API Status view to edit images.");
            setIsLoading(false);
            return;
        }
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const base64Data = baseImage.split(',')[1];
            const mimeType = baseImage.match(/:(.*?);/)?.[1] || 'image/jpeg';
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: mimeType } },
                        { text: prompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
            if (imagePart?.inlineData) {
                const newBase64 = imagePart.inlineData.data;
                setGeneratedImage(`data:${imagePart.inlineData.mimeType};base64,${newBase64}`);
            } else {
                 setError("The AI didn't return an image. Try a different prompt.");
            }
        } catch (err) {
            console.error("Image editing error:", err);
            setError("Sorry, I couldn't edit the image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

     const generateCardStory = async () => {
        setIsStoryLoading(true);
        setCardStory('');
         if (!geminiApiKey) {
            setCardStory("Please set your Gemini API key in the API Status view to generate stories.");
            setIsStoryLoading(false);
            return;
        }
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const storyPrompt = `Based on this generative AI prompt for a credit card design, write a short, inspiring "Card Story" (2-3 sentences) about what this card represents.
Prompt: "${prompt}"
Effects: ${metallic > 0 ? 'Metallic sheen, ' : ''}${holo ? 'Holographic effect' : ''}`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: storyPrompt
            });
            setCardStory(response.text);
        } catch (err) {
            console.error("Card story generation error:", err);
            setCardStory("Could not generate a story for this design.");
        } finally {
            setIsStoryLoading(false);
        }
    };


    const displayImage = generatedImage || baseImage;
    const cardStyle: React.CSSProperties = {
        '--metallic-sheen': `${metallic}%`,
    } as React.CSSProperties;

    return (
        <div className="space-y-6">
             <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-lg p-6`}>
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Design Your Card</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div>
                         <p className="text-gray-400 mb-4">Upload a base image, describe your changes, and add physical effects.</p>
                         <div className="space-y-4">
                             <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600/50 file:text-cyan-200 hover:file:bg-cyan-600"/>
                             <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Make this image look like a watercolor painting"
                                className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                disabled={isLoading || !baseImage}
                            />
                             <button
                                onClick={handleGenerate}
                                disabled={isLoading || !baseImage || !prompt}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Generating...' : 'Generate Image'}
                            </button>
                            {error && <p className="text-red-400 text-center">{error}</p>}
                         </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-gray-400 mb-2">Card Preview</p>
                        <div style={cardStyle} className={`w-full max-w-sm aspect-[85.6/54] rounded-xl bg-gray-900/50 overflow-hidden shadow-2xl border border-gray-600 flex items-center justify-center relative ${holo ? 'holo-effect' : ''}`}>
                            <div className="absolute inset-0 metallic-overlay" style={{ opacity: metallic / 200 }}></div>
                            {isLoading && <div className="text-cyan-300">Generating...</div>}
                            {!isLoading && displayImage && <img src={displayImage} alt="Card Preview" className="w-full h-full object-cover"/>}
                            {!isLoading && !displayImage && <div className="text-gray-500">Upload an image to start</div>}
                        </div>
                    </div>
                </div>
            </div>
             <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-lg p-6`}>
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Add Physical Effects</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-gray-300">Metallic Sheen: {metallic}%</label>
                        <input type="range" min="0" max="100" value={metallic} onChange={e => setMetallic(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between">
                         <label className="text-gray-300">Holographic Effect</label>
                         <input type="checkbox" checked={holo} onChange={e => setHolo(e.target.checked)} className="toggle toggle-sm toggle-cyan" />
                    </div>
                </div>
            </div>
             <Card title="AI-Generated Card Story">
                {isStoryLoading ? <p>Generating story...</p> : cardStory ? <p className="text-gray-300 italic">"{cardStory}"</p> : <p className="text-gray-400">Generate a story for your unique card design.</p>}
                 <button onClick={generateCardStory} disabled={isStoryLoading} className="mt-4 px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg text-sm">
                    {isStoryLoading ? 'Writing...' : 'Generate Story'}
                </button>
             </Card>
            <style>{`
                .toggle-cyan:checked { background-color: #06b6d4; }
                .metallic-overlay {
                    background: linear-gradient(110deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%);
                    mix-blend-mode: overlay;
                    pointer-events: none;
                }
                .holo-effect {
                    position: relative;
                    overflow: hidden;
                }
                .holo-effect::before {
                    content: '';
                    position: absolute;
                    top: -50%; left: -50%;
                    width: 200%; height: 200%;
                    background: linear-gradient(110deg, transparent 20%, #ff00ff, #00ffff, #ffff00, #ff00ff, transparent 80%);
                    animation: holo-spin 8s linear infinite;
                    opacity: 0.2;
                    mix-blend-mode: screen;
                }
                @keyframes holo-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const App: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("App must be used within a DataProvider.");
    }

    const { customBackgroundUrl, activeIllusion } = context;
    const [activeView, _setActiveView] = useState<View>(View.Dashboard);
    const [previousView, setPreviousView] = useState<View | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const setActiveView = (view: View) => {
        if (view !== activeView) {
            setPreviousView(activeView);
        }
        _setActiveView(view);
    };

    const renderActiveView = () => {
        switch (activeView) {
            case View.Dashboard: return <Dashboard setActiveView={setActiveView} />;
            case View.Transactions: return <TransactionsView />;
            case View.SendMoney: return <SendMoneyView setActiveView={setActiveView} />;
            case View.Budgets: return <BudgetsView />;
            case View.Investments: return <InvestmentsView />;
            case View.AIAdvisor: return <AIAdvisorView previousView={previousView} />;
            case View.QuantumWeaver: return <QuantumWeaverView />;
            case View.AIAdStudio: return <AIAdStudioView />;
            case View.Marketplace: return <AgentMarketplaceView />;
            case View.Personalization: return <PersonalizationView />;
            case View.CardCustomization: return <CardCustomizationView />;
            case View.Security: return <SecurityView />;
            case View.Goals: return <FinancialGoalsView />;
            case View.Crypto: return <CryptoView />;
            case View.CorporateCommand: return <CorporateCommandView />;
            case View.SASPlatforms: return <TheVisionView />;
            case View.APIIntegration: return <APIIntegrationView />;
            case View.OpenBanking: return <OpenBankingView />;
            case View.Rewards: return <RewardsView />;
            case View.CreditHealth: return <CreditHealthView />;
            case View.Settings: return <SettingsView />;
            case View.FinancialDemocracy: return <FinancialDemocracyView />;
            default: return <Dashboard setActiveView={setActiveView} />;
        }
    };

    const backgroundStyle: React.CSSProperties = customBackgroundUrl ? { backgroundImage: `url(${customBackgroundUrl})` } : {};

    return (
        <div id="app-container" style={backgroundStyle} className={`bg-cover bg-center bg-fixed ${activeIllusion === 'aurora' ? 'aurora-bg' : ''}`}>
             <div className={`flex h-screen bg-gray-950/80 text-gray-200 backdrop-blur-xl`}>
                <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header onMenuClick={() => setIsSidebarOpen(prev => !prev)} setActiveView={setActiveView} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 relative">
                        {renderActiveView()}
                    </main>
                </div>
                <VoiceControl setActiveView={setActiveView} />
            </div>
             {/* Simple CSS for aurora effect */}
            {activeIllusion === 'aurora' && <style>{`
                .aurora-bg {
                    background: #030712;
                    position: relative;
                    overflow: hidden;
                }
                .aurora-bg::before, .aurora-bg::after {
                    content: '';
                    position: absolute;
                    width: 800px;
                    height: 800px;
                    border-radius: 50%;
                    filter: blur(150px);
                    opacity: 0.3;
                    mix-blend-mode: screen;
                    animation: aurora-flow 20s infinite linear;
                }
                .aurora-bg::before {
                    background: radial-gradient(circle, #06b6d4, transparent);
                    top: -20%; left: -20%;
                }
                .aurora-bg::after {
                    background: radial-gradient(circle, #4f46e5, transparent);
                    bottom: -20%; right: -20%;
                    animation-delay: -10s;
                }
                @keyframes aurora-flow {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(100px, 100px) rotate(180deg); }
                    100% { transform: translate(0, 0) rotate(360deg); }
                }
            `}</style>}</div>
    );
};

export default App;

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3 | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-91b6490/App.tsx
================================================================================

import React, { useState } from 'react';
import { 
  Activity, Settings2, Layers, 
  CreditCard, Landmark, Scale, Terminal, Book
} from 'lucide-react';
import { 
  FlowStep, PlaidCredentials, ConnectedItem, 
  UCCFiling, MarqetaCredentials, ModernTreasuryCredentials
} from './types';
import { CredentialsForm } from './components/CredentialsForm';
import { Dashboard } from './components/Dashboard';
import { UCCFilingCenter } from './components/UCCFilingCenter';
import { ModernTreasuryNode } from './components/ModernTreasuryNode';
import { TaxonomyExplorer } from './components/TaxonomyExplorer';

const App: React.FC = () => {
  const [step, setStep] = useState<FlowStep>(FlowStep.CREDENTIALS);
  const [plaidCreds, setPlaidCreds] = useState<PlaidCredentials | null>(null);
  const [marqetaCreds, setMarqetaCreds] = useState<MarqetaCredentials | null>(null);
  const [mtCreds, setMtCreds] = useState<ModernTreasuryCredentials | null>(null);
  
  const [connectedItems, setConnectedItems] = useState<ConnectedItem[]>([]);
  const [uccFilings, setUccFilings] = useState<UCCFiling[]>([]);
  const [logs, setLogs] = useState<{msg: string; type: 'req' | 'res' | 'err'; timestamp: string}[]>([]);
  const [proxyUrl] = useState('https://corsproxy.io/?url=');

  const addLog = (msg: any, type: 'req' | 'res' | 'err' = 'res') => {
    const stringified = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2);
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [{ msg: stringified, type: type, timestamp: timestamp }, ...prev].slice(0, 50));
  };

  const nexusFetch = async (url: string, options: RequestInit = {}) => {
    const proxiedUrl = `${proxyUrl}${encodeURIComponent(url)}`;
    addLog(`[PROXY] Calling: ${url}`, 'req');
    
    try {
      const response = await fetch(proxiedUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(data.error_message || data.message || `HTTP ${response.status}`);
      }
      
      addLog(`[PROXY] Success: ${url}`, 'res');
      addLog(data, 'res');
      return data;
    } catch (err: any) {
      addLog(`[PROXY] Error calling ${url}: ${err.message}`, 'err');
      throw err;
    }
  };

  const handlePlaidSubmit = async (creds: PlaidCredentials) => {
    setPlaidCreds(creds);
    addLog("[PLAID] Initializing Link Handshake...", 'req');
    
    try {
      await nexusFetch('https://sandbox.plaid.com/link/token/create', {
        method: 'POST',
        body: JSON.stringify({
          client_id: creds.clientId,
          secret: creds.secret,
          user: { client_user_id: 'nexus_user_001' },
          client_name: 'Nexus Terminal',
          products: ['transactions'],
          country_codes: ['US'],
          language: 'en'
        })
      });
    } catch (e) {
      addLog("[PLAID] Link Token Handshake failed. Fallback active.", 'err');
    }

    const demoItems: ConnectedItem[] = [
      {
        institutionId: "ins_1",
        institutionName: "Nexus Reserve Bank",
        accessToken: "access-sandbox-123",
        itemId: "item_nexus_001",
        accounts: [
          { id: "acc_1", name: "Corporate Operating", mask: "4422", type: "depository", subtype: "checking", balance: { current: 125400.50, available: 125000, limit: null, currency: "USD" } }
        ],
        transactions: [
          { id: "tx_101", date: new Date().toISOString().split('T')[0], name: "AMAZON WEB SERVICES", amount: -4500.00, category: ["Service"], pending: false },
          { id: "tx_102", date: new Date().toISOString().split('T')[0], name: "STRIPE PAYOUT", amount: 12400.00, category: ["Income"], pending: false }
        ],
        metadata: { linked_at: new Date().toISOString(), node_priority: 1, mesh_protocol: 'NEXUS-V3', routing_hops: ['NODE-01'] }
      },
      {
        institutionId: "ins_2",
        institutionName: "Capital Vault",
        accessToken: "access-sandbox-456",
        itemId: "item_nexus_002",
        accounts: [
          { id: "acc_2", name: "Investment Holdings", mask: "9912", type: "depository", subtype: "savings", balance: { current: 450000.00, available: 450000, limit: null, currency: "USD" } }
        ],
        transactions: [
          { id: "tx_201", date: new Date().toISOString().split('T')[0], name: "STRIPE PAYOUT", amount: -12400.00, category: ["Transfer"], pending: false }
        ],
        metadata: { linked_at: new Date().toISOString(), node_priority: 2, mesh_protocol: 'NEXUS-V3', routing_hops: ['NODE-02'] }
      }
    ];
    setConnectedItems(demoItems);
    setStep(FlowStep.DASHBOARD);
  };

  const handleMarqetaSubmit = async (creds: MarqetaCredentials) => {
    setMarqetaCreds(creds);
    addLog("[MARQETA] Authenticating Node...", 'req');
    try {
      const auth = btoa(`${creds.app_token}:${creds.admin_token}`);
      await nexusFetch(`${creds.base_url}/users`, {
        headers: { 'Authorization': `Basic ${auth}` }
      });
    } catch (e) {
      addLog("[MARQETA] Auth failed.", 'err');
    }
    setStep(FlowStep.MARQETA_NODE);
  };

  const handleMTSubmit = async (creds: ModernTreasuryCredentials) => {
    setMtCreds(creds);
    addLog(`[MODERN_TREASURY] Syncing with OrgID: ${creds.orgId}...`, 'req');
    try {
      const auth = btoa(`${creds.orgId}:${creds.apiKey}`);
      await nexusFetch(`https://app.moderntreasury.com/api/ledgers`, {
        headers: { 
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {
      addLog("[MODERN_TREASURY] Auth Error.", 'err');
    }
    setStep(FlowStep.MODERN_TREASURY_NODE);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-blue-500/30">
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl sticky top-0 z-50 h-24">
        <div className="max-w-[1600px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg shadow-blue-500/20" onClick={() => setStep(FlowStep.DASHBOARD)}>
              <Layers className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">Nexus<span className="text-blue-500">Terminal</span></h1>
              <div className="flex gap-3 mt-1">
                <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded border border-white/5 text-slate-700">POLKA-V3</span>
                <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded border border-blue-500/20 text-blue-500">TAXONOMY-BLUEPRINT</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => setStep(FlowStep.DASHBOARD)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${step === FlowStep.DASHBOARD ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              <Activity size={14} /> Overview
            </button>
            <button onClick={() => setStep(FlowStep.TAXONOMY_REGISTRY)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${step === FlowStep.TAXONOMY_REGISTRY ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <Book size={14} /> Registry
            </button>
            <button onClick={() => setStep(FlowStep.MARQETA_NODE)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${step === FlowStep.MARQETA_NODE ? 'bg-teal-600/20 text-teal-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <CreditCard size={14} /> Marqeta
            </button>
            <button onClick={() => setStep(FlowStep.MODERN_TREASURY_NODE)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${step === FlowStep.MODERN_TREASURY_NODE ? 'bg-purple-600/20 text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <Landmark size={14} /> Treasury
            </button>
            <button onClick={() => setStep(FlowStep.UCC_CENTER)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${step === FlowStep.UCC_CENTER ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <Scale size={14} /> UCC Center
            </button>
          </nav>

          <button onClick={() => setStep(FlowStep.CREDENTIALS)} className="p-3 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
            <Settings2 size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-8 lg:p-12 flex flex-col xl:flex-row gap-12">
        <div className="flex-1 min-w-0">
          {step === FlowStep.CREDENTIALS && (
            <CredentialsForm 
              onPlaidSubmit={handlePlaidSubmit} 
              onMarqetaSubmit={handleMarqetaSubmit} 
              onMTSubmit={handleMTSubmit} 
            />
          )}
          
          {step === FlowStep.DASHBOARD && (
            <Dashboard 
              items={connectedItems} 
              credentials={plaidCreds || { clientId: 'DEMO', secret: '', environment: 'sandbox' }} 
              proxy={proxyUrl} 
              onAddCompany={() => setStep(FlowStep.CREDENTIALS)} 
              addLog={addLog} 
              uccFilings={uccFilings} 
              marqetaActive={!!marqetaCreds}
              mtActive={!!mtCreds}
            />
          )}

          {step === FlowStep.TAXONOMY_REGISTRY && (
            <TaxonomyExplorer />
          )}
          
          {step === FlowStep.MARQETA_NODE && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/40 p-16 rounded-[3rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                <CreditCard size={80} className="mx-auto text-teal-500 mb-8" />
                <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter mb-4">Marqeta Card Node</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  {['User Provisioning', 'Auth Controls', 'Program Funding'].map(label => (
                    <div key={label} className="p-10 rounded-[2rem] bg-teal-500/5 border border-teal-500/10 transition-all group">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-slate-500">{label}</p>
                      <p className="text-xl font-black italic text-white uppercase">{marqetaCreds ? 'Ready' : 'Pending'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === FlowStep.MODERN_TREASURY_NODE && mtCreds && (
            <ModernTreasuryNode 
              creds={mtCreds} 
              connectedItems={connectedItems} 
              addLog={addLog} 
              proxy={proxyUrl} 
            />
          )}

          {step === FlowStep.MODERN_TREASURY_NODE && !mtCreds && (
             <div className="text-center py-32 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5">
                <Landmark size={64} className="mx-auto text-slate-700 mb-6" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Auth Required</p>
                <button onClick={() => setStep(FlowStep.CREDENTIALS)} className="mt-8 px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl">Setup Node</button>
             </div>
          )}

          {step === FlowStep.UCC_CENTER && (
            <UCCFilingCenter filings={uccFilings} onUpdateFilings={setUccFilings} proxy={proxyUrl} addLog={addLog} items={connectedItems} />
          )}
        </div>

        <aside className="xl:w-[400px] space-y-8">
          <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] flex flex-col h-[780px] overflow-hidden shadow-2xl sticky top-32">
            <div className="p-6 border-b border-white/5 bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Universal Console</span>
              </div>
              <button onClick={() => setLogs([])} className="text-[10px] text-slate-500 hover:text-white uppercase font-black">Flush</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-[10px]">
              {logs.map((log, i) => (
                <div key={i} className={`p-4 rounded-xl border ${log.type === 'req' ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : log.type === 'res' ? 'bg-slate-900/80 border-white/5 text-slate-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                  <div className="flex justify-between mb-2 opacity-40 text-[8px] font-bold"><span>{log.timestamp}</span><span>{log.type.toUpperCase()}</span></div>
                  <pre className="whitespace-pre-wrap break-all leading-relaxed">{log.msg}</pre>
                </div>
              ))}
              {logs.length === 0 && <div className="text-center py-20 opacity-10 italic">Awaiting Nexus Handshake...</div>}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/App.tsx
================================================================================


import React, { useState, useContext, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Cpu, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { Auth0Provider } from '@auth0/auth0-react';
import { datadogLogs } from '@datadog/browser-logs';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider, DataContext } from './context/DataContext';
import { StripeDataProvider } from './components/StripeDataContext';
import { MoneyMovementProvider } from './components/MoneyMovementContext';

// Layout & Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { View } from './types';

// Views & Components
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import BudgetsView from './components/BudgetsView';
import FinancialGoalsView from './components/FinancialGoalsView';
import CreditHealthView from './components/CreditHealthView';
import PersonalizationView from './components/PersonalizationView';
import AccountsView from './components/AccountsView';
import InvestmentsView from './components/InvestmentsView';
import CryptoView from './components/CryptoView';
import AlgoTradingLab from './components/AlgoTradingLab';
import ForexArena from './components/ForexArena';
import CommoditiesExchange from './components/CommoditiesExchange';
import RealEstateEmpire from './components/RealEstateEmpire';
import ArtCollectibles from './components/ArtCollectibles';
import DerivativesDesk from './components/DerivativesDesk';
import VentureCapitalDesk from './components/VentureCapitalDesk';
import PrivateEquityLounge from './components/PrivateEquityLounge';
import TaxOptimizationChamber from './components/TaxOptimizationChamber';
import LegacyBuilder from './components/LegacyBuilder';
import CorporateCommandView from './components/CorporateCommandView';
import ModernTreasuryView from './components/ModernTreasuryView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import QuantumWeaverView from './components/QuantumWeaverView';
import AgentMarketplaceView from './components/MarketplaceView';
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import ConciergeService from './components/ConciergeService';
import SovereignWealth from './components/SovereignWealth';
import PhilanthropyHub from './components/PhilanthropyHub';
import TheVisionView from './components/TheVisionView';
import AIAdvisorView from './components/AIAdvisorView';
import { AIInsights } from './components/AIInsights';
import SecurityView from './components/SecurityView';
import ComplianceOracleView from './components/ComplianceOracleView';
import GlobalPositionMap from './components/GlobalPositionMap';
import GlobalSsiHubView from './components/GlobalSsiHubView';
import CustomerDashboard from './components/CustomerDashboard';
import VerificationReportsView from './components/VerificationReportsView';
import FinancialReportingView from './components/FinancialReportingView';
import StripeNexusDashboard from './components/StripeNexusDashboard';
import TheBookView from './components/TheBookView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import VoiceControl from './components/VoiceControl';
import LandingPage from './components/LandingPage';
import QuantumAssets from './components/QuantumAssets';
import CitibankAccountsView from './components/CitibankAccountsView';
import CitibankAccountProxyView from './components/CitibankAccountProxyView';
import CitibankBillPayView from './components/CitibankBillPayView';
import CitibankCrossBorderView from './components/CitibankCrossBorderView';
import CitibankPayeeManagementView from './components/CitibankPayeeManagementView';
import CitibankStandingInstructionsView from './components/CitibankStandingInstructionsView';
import CitibankDeveloperToolsView from './components/CitibankDeveloperToolsView';
import CitibankEligibilityView from './components/CitibankEligibilityView';
import CitibankUnmaskedDataView from './components/CitibankUnmaskedDataView';
import PlaidIdentityView from './components/PlaidIdentityView';
import PlaidCRAMonitoringView from './components/PlaidCRAMonitoringView';
import { PlaidInstitutionsExplorer } from './components/PlaidInstitutionsExplorer';
import { PlaidItemManagementView } from './components/PlaidItemManagementView';
import PlaidMainDashboard from './components/PlaidMainDashboard';
import StripeNexusView from './components/StripeNexusView';
import CounterpartyDashboardView from './components/CounterpartyDashboardView';
import VirtualAccountsDashboard from './components/VirtualAccountsDashboard';
import CorporateActionsNexusView from './components/CorporateActionsNexusView';
import { CreditNoteLedger } from './components/CreditNoteLedger';
import ReconciliationHubView from './components/ReconciliationHubView';
import GEINDashboard from './components/GEIN_DashboardView';
import CardholderManagement from './components/CardholderManagement';
import UniversalObjectInspector from './components/UniversalObjectInspector';
import { LoginView } from './components/LoginView';
import { PlaidClient } from './lib/plaidClient';
import DeveloperHubView from './components/DeveloperHubView';
import ApiPlaygroundView from './components/ApiPlaygroundView';

// --- ALL COMPONENT IMPORTS FOR DIRECT ACCESS ---
import AccountDetails from './components/AccountDetails';
import AccountList from './components/AccountList';
import AccountsDashboardView from './components/AccountsDashboardView';
import AccountStatementGrid from './components/AccountStatementGrid';
import { AccountVerificationModal } from './components/AccountVerificationModal';
import ACHDetailsDisplay from './components/ACHDetailsDisplay';
import AICommandLog from './components/AICommandLog';
import AIPredictionWidget from './components/AIPredictionWidget';
import AssetCatalog from './components/AssetCatalog';
import AutomatedSweepRules from './components/AutomatedSweepRules';
import BalanceReportChart from './components/BalanceReportChart';
import BalanceTransactionTable from './components/BalanceTransactionTable';
import CardDesignVisualizer from './components/CardDesignVisualizer';
import { ChargeDetailModal } from './components/ChargeDetailModal';
import ChargeList from './components/ChargeList';
import ConductorConfigurationView from './components/ConductorConfigurationView';
import CounterpartyDetails from './components/CounterpartyDetails';
import { CounterpartyForm } from './components/CounterpartyForm';
import DisruptionIndexMeter from './components/DisruptionIndexMeter';
import DocumentUploader from './components/DocumentUploader';
import { DownloadLink } from './components/DownloadLink';
import EarlyFraudWarningFeed from './components/EarlyFraudWarningFeed';
import ElectionChoiceForm from './components/ElectionChoiceForm';
import EventNotificationCard from './components/EventNotificationCard';
import ExpectedPaymentsTable from './components/ExpectedPaymentsTable';
import ExternalAccountCard from './components/ExternalAccountCard';
import ExternalAccountForm from './components/ExternalAccountForm';
import ExternalAccountTable from './components/ExternalAccountsTable';
import { FinancialAccountCard } from './components/FinancialAccountCard';
import IncomingPaymentDetailList from './components/IncomingPaymentDetailList';
import { InvestmentForm } from './components/InvestmentForm';
import InvoiceFinancingRequest from './components/InvoiceFinancingRequest';
import PaymentInitiationForm from './components/PaymentInitiationForm';
import PaymentMethodDetails from './components/PaymentMethodDetails';
import PaymentOrderForm from './components/PaymentOrderForm';
import PayoutsDashboard from './components/PayoutsDashboard';
import PnLChart from './components/PnLChart';
import RefundForm from './components/RefundForm';
import RemittanceInfoEditor from './components/RemittanceInfoEditor';
import ReportingView from './components/ReportingView';
import { ReportRunGenerator } from './components/ReportRunGenerator';
import ReportStatusIndicator from './components/ReportStatusIndicator';
import ResourceGraphView from './components/ResourceGraphView';
import SchemaExplorer from './components/SchemaExplorer';
import SecurityComplianceView from './components/SecurityComplianceView';
import SsiEditorForm from './components/SsiEditorForm';
import StripeStatusBadge from './components/StripeStatusBadge';
import StructuredPurposeInput from './components/StructuredPurposeInput';
import SubscriptionList from './components/SubscriptionList';
import TimeSeriesChart from './components/TimeSeriesChart';
import TradeConfirmationModal from './components/TradeConfirmationModal';
import TransactionFilter from './components/TransactionFilter';
import TransactionList from './components/TransactionList';
import { TreasuryTransactionList } from './components/TreasuryTransactionList';
import TreasuryView from './components/TreasuryView';
import VentureCapitalDeskView from './components/VentureCapitalDeskView';
import VirtualAccountForm from './components/VirtualAccountForm';
import VirtualAccountsTable from './components/VirtualAccountsTable';
import WebhookSimulator from './components/WebhookSimulator';

// --- Wrapper Components for Props ---
const Wrapper = (Component: React.FC<any>, props: any = {}) => {
  const WrappedComponent = () => <Component {...props} />;
  return <WrappedComponent />;
};
const ModalWrapper = (Component: React.FC<any>, props: any = {}) => {
    const [isOpen, setIsOpen] = useState(true);
    const WrappedComponent = () => <Component isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} />;
    return <WrappedComponent />;
};
const DataContextWrapper = (Component: React.FC<any>, extraProps: any = {}) => {
    const dataContext = useContext(DataContext);
    const mockContext = { 
        setActiveView: () => {}, 
        impactData: { treesPlanted: 0, progressToNextTree: 0 },
    };
    const props = { ...(dataContext || mockContext), ...extraProps };
    const WrappedComponent = () => <Component {...props} />;
    return <WrappedComponent />;
};

const AIIntentStub: React.FC<{ view: View }> = ({ view }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in duration-700 bg-gray-950/50 rounded-3xl border border-gray-800">
            <div className="w-24 h-24 bg-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                <Sparkles className="text-cyan-400 w-12 h-12 animate-pulse" />
            </div>
            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-mono">Module Ingress: {view.replace(/-/g, '_').toUpperCase()}</h2>
                <p className="text-gray-400 text-sm leading-relaxed font-mono">
                    The Sovereign AI Core is compiling the high-frequency logic for this specific subsystem. 
                    Targeting zero-latency node deployment in the next epoch.
                </p>
            </div>
            <div className="flex gap-4">
                <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    <Terminal size={14} /> STATUS: COMPILING_INTENT
                </div>
                <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                    <ShieldAlert size={14} /> AUTH: VERIFIED
                </div>
            </div>
        </div>
    );
};

const MonetizationOverlay = () => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { sovereignCredits } = context;
    return (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sovereign Balance:</span>
            <span className="text-cyan-400 font-mono text-lg font-bold tracking-tighter">
                {sovereignCredits.toLocaleString()} SC
            </span>
        </div>
    );
};

const SAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);

  if (!dataContext || !authContext) return null;
  const { isAuthenticated, isLoading: authLoading } = authContext;
  const { isLoading: dataLoading, activeView, setActiveView } = dataContext;

  useEffect(() => {
    // Send a test log to Datadog on mount
    datadogLogs.logger.info('App View Loaded', { name: 'SovereignNexus', id: 'init_view' });
  }, []);

  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-6">
            <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />
            <h1 className="text-3xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase font-mono">Nexus OS // Syncing</h1>
            <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 animate-progress-flow"></div>
            </div>
            <style>{`
                @keyframes flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
                .animate-progress-flow { animation: flow 2s linear infinite; width: 50%; }
            `}</style>
        </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const renderView = () => {
    switch (activeView) {
        // --- Core Views ---
        case View.Dashboard: return <Dashboard />;
        case View.Transactions: return <TransactionsView />;
        case View.SendMoney: return <SendMoneyView />;
        case View.Budgets: return <BudgetsView />;
        case View.FinancialGoals: return <FinancialGoalsView />;
        case View.CreditHealth: return <CreditHealthView />;
        case View.Personalization: return <PersonalizationView />;
        case View.Accounts: return <AccountsView />;
        case View.Investments: return <InvestmentsView />;
        case View.CryptoWeb3: return <CryptoView />;
        case View.AlgoTradingLab: return <AlgoTradingLab />;
        case View.ForexArena: return <ForexArena />;
        case View.CommoditiesExchange: return <CommoditiesExchange />;
        case View.RealEstateEmpire: return <RealEstateEmpire />;
        case View.ArtCollectibles: return <ArtCollectibles />;
        case View.DerivativesDesk: return <DerivativesDesk />;
        case View.VentureCapital: return <VentureCapitalDesk />;
        case View.PrivateEquity: return <PrivateEquityLounge />;
        case View.TaxOptimization: return <TaxOptimizationChamber />;
        case View.LegacyBuilder: return <LegacyBuilder />;
        case View.CorporateCommand: return <CorporateCommandView setActiveView={setActiveView} />;
        case View.ModernTreasury: return <ModernTreasuryView />;
        case View.OpenBanking: return <OpenBankingView />;
        case View.FinancialDemocracy: return <FinancialDemocracyView />;
        case View.AIAdStudio: return <AIAdStudioView />;
        case View.QuantumWeaver: return <QuantumWeaverView />;
        case View.AgentMarketplace: return <AgentMarketplaceView />;
        case View.APIStatus: return <APIIntegrationView />;
        case View.Settings: return <SettingsView />;
        case View.QuantumAssets: return <QuantumAssets />;
        case View.SovereignWealth: return <SovereignWealth />;
        case View.Philanthropy: return <PhilanthropyHub />;
        case View.TheVision: return <TheVisionView />;
        case View.AIAdvisor: return <AIAdvisorView />;
        case View.AIInsights: return <AIInsights />;
        case View.SecurityCenter: return <SecurityView />;
        case View.ComplianceOracle: return <ComplianceOracleView />;
        case View.GlobalPositionMap: return <GlobalPositionMap />;
        case View.GlobalSsiHub: return <GlobalSsiHubView />;
        case View.CustomerDashboard: return <CustomerDashboard />;
        case View.VerificationReports: return <VerificationReportsView customerId="c1" />;
        case View.FinancialReporting: return <FinancialReportingView />;
        case View.StripeNexusDashboard: return <StripeNexusDashboard />;
        case View.TheBook: return <TheBookView />;
        case View.KnowledgeBase: return <KnowledgeBaseView />;
        
        // --- Integration Specific Views ---
        case View.CitibankAccounts: return <CitibankAccountsView />;
        case View.CitibankAccountProxy: return <CitibankAccountProxyView />;
        case View.CitibankBillPay: return <CitibankBillPayView />;
        case View.CitibankCrossBorder: return <CitibankCrossBorderView />;
        case View.CitibankPayeeManagement: return <CitibankPayeeManagementView />;
        case View.CitibankStandingInstructions: return <CitibankStandingInstructionsView />;
        case View.CitibankDeveloperTools: return <CitibankDeveloperToolsView />;
        case View.CitibankEligibility: return <CitibankEligibilityView />;
        case View.CitibankUnmaskedData: return <CitibankUnmaskedDataView accountIdsToUnmask={['acc_1']} />;
        case View.PlaidMainDashboard: return <PlaidMainDashboard />;
        case View.PlaidIdentity: return <PlaidIdentityView />;
        case View.PlaidCRAMonitoring: return <PlaidCRAMonitoringView />;
        case View.PlaidInstitutions: return <PlaidInstitutionsExplorer client={new PlaidClient()} />;
        case View.PlaidItemManagement: return <PlaidItemManagementView accessToken="mock_token" />;
        case View.StripeNexus: return <StripeNexusView />;
        case View.CounterpartyDashboard: return <CounterpartyDashboardView />;
        case View.VirtualAccounts: return <VirtualAccountsDashboard />;
        case View.CorporateActions: return <CorporateActionsNexusView />;
        case View.CreditNoteLedger: return <CreditNoteLedger />;
        case View.ReconciliationHub: return <ReconciliationHubView />;
        case View.GEINDashboard: return <GEINDashboard />;
        case View.CardholderManagement: return <CardholderManagement />;
        case View.SecurityCompliance: return <SecurityComplianceView />;
        case View.DeveloperHub: return <DeveloperHubView />;
        case View.SchemaExplorer: return <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} />;
        case View.ResourceGraph: return <ResourceGraphView />;
        case View.ApiPlayground: return <ApiPlaygroundView />;
        case View.VentureCapitalDeskView: return <VentureCapitalDeskView />;

        // --- Direct Component Access Wrappers ---
        case View.AccountDetails: return Wrapper(AccountDetails, { accountId: '1', customerId: 'c1' });
        case View.AccountList: return Wrapper(AccountList, { accounts: [] });
        case View.AccountStatementGrid: return Wrapper(AccountStatementGrid, { statementLines: [] });
        case View.AccountsView: return <AccountsView />;
        case View.AccountVerificationModal: return ModalWrapper(AccountVerificationModal, { externalAccount: {id: '1', verification_status: 'unverified' }, onSuccess: () => {}});
        case View.ACHDetailsDisplay: return Wrapper(ACHDetailsDisplay, { details: { routingNumber: '123', realAccountNumber: '456' } });
        case View.AICommandLog: return <AICommandLog />;
        case View.AIPredictionWidget: return <AIPredictionWidget />;
        case View.AssetCatalog: return Wrapper(AssetCatalog, { assets: [], onAssetSelected: () => {}, getAssetDetails: async () => ({}) });
        case View.AutomatedSweepRules: return <AutomatedSweepRules />;
        case View.BalanceReportChart: return Wrapper(BalanceReportChart, { data: [] });
        case View.BalanceTransactionTable: return Wrapper(BalanceTransactionTable, { balanceTransactions: [] });
        case View.CardDesignVisualizer: return Wrapper(CardDesignVisualizer, { design: { id: 'd_1', physical_bundle: { features: {} } } });
        case View.ChargeDetailModal: return ModalWrapper(ChargeDetailModal, { charge: {id: 'ch_1'}, onClose: () => {}});
        case View.ChargeList: return <ChargeList />;
        case View.ConductorConfigurationView: return <ConductorConfigurationView />;
        case View.CounterpartyDetails: return Wrapper(CounterpartyDetails, { counterpartyId: 'cp_1' });
        case View.CounterpartyForm: return Wrapper(CounterpartyForm, { counterparties: [], onSubmit: () => {}, onCancel: () => {} });
        case View.DisruptionIndexMeter: return Wrapper(DisruptionIndexMeter, { indexValue: 50 });
        case View.DocumentUploader: return Wrapper(DocumentUploader, { documentableType: 'test', documentableId: '1' });
        case View.DownloadLink: return Wrapper(DownloadLink, { url: '#', filename: 'test.pdf' });
        case View.EarlyFraudWarningFeed: return <EarlyFraudWarningFeed />;
        case View.ElectionChoiceForm: return Wrapper(ElectionChoiceForm, { availableChoices: {}, onSubmit: () => {}, onCancel: () => {} });
        case View.EventNotificationCard: return Wrapper(EventNotificationCard, { event: {} });
        case View.ExpectedPaymentsTable: return <ExpectedPaymentsTable />;
        case View.ExternalAccountCard: return Wrapper(ExternalAccountCard, { account: {id: '1', account_details: [], routing_details: []}});
        case View.ExternalAccountForm: return Wrapper(ExternalAccountForm, { counterparties: [], onSubmit: () => {}, onCancel: () => {} });
        case View.ExternalAccountsTable: return Wrapper(ExternalAccountTable, { accounts: [] });
        case View.FinancialAccountCard: return Wrapper(FinancialAccountCard, { financialAccount: {id: 'fa_1', balance: { cash: {}}, supported_currencies: []}});
        case View.IncomingPaymentDetailList: return <IncomingPaymentDetailList />;
        case View.InvoiceFinancingRequest: return Wrapper(InvoiceFinancingRequest, { onSubmit: () => {} });
        case View.PaymentInitiationForm: return <PaymentInitiationForm />;
        case View.PaymentMethodDetails: return Wrapper(PaymentMethodDetails, { details: { type: 'card', card: {} }});
        case View.PaymentOrderForm: return Wrapper(PaymentOrderForm, { internalAccounts: [], externalAccounts: [], onSubmit: () => {}, onCancel: () => {} });
        case View.PayoutsDashboard: return <PayoutsDashboard />;
        case View.PnLChart: return Wrapper(PnLChart, { data: [], algorithmName: 'Test' });
        case View.RefundForm: return <RefundForm />;
        case View.RemittanceInfoEditor: return Wrapper(RemittanceInfoEditor, { onChange: () => {} });
        case View.ReportingView: return <ReportingView />;
        case View.ReportRunGenerator: return <ReportRunGenerator />;
        case View.ReportStatusIndicator: return Wrapper(ReportStatusIndicator, { status: 'success' });
        case View.SsiEditorForm: return Wrapper(SsiEditorForm, { onSubmit: () => {}, onCancel: () => {} });
        case View.StripeStatusBadge: return Wrapper(StripeStatusBadge, { status: 'succeeded', objectType: 'charge' });
        case View.StructuredPurposeInput: return Wrapper(StructuredPurposeInput, { onChange: () => {}, value: null });
        case View.SubscriptionList: return Wrapper(SubscriptionList, { subscriptions: [] });
        case View.TimeSeriesChart: return Wrapper(TimeSeriesChart, { data: { labels: [], datasets: [] } });
        case View.TradeConfirmationModal: return ModalWrapper(TradeConfirmationModal, { settlementInstruction: { messageId: '1' } });
        case View.TransactionFilter: return Wrapper(TransactionFilter, { onApplyFilters: () => {} });
        case View.TransactionList: return Wrapper(TransactionList, { transactions: [] });
        case View.TreasuryTransactionList: return Wrapper(TreasuryTransactionList, { transactions: [] });
        case View.TreasuryView: return <TreasuryView />;
        case View.UniversalObjectInspector: return Wrapper(UniversalObjectInspector, { data: { status: "Nominal", uptime: "99.999%", load: "Balanced" } });
        case View.VirtualAccountForm: return Wrapper(VirtualAccountForm, { onSubmit: () => {}, isSubmitting: false });
        case View.VirtualAccountsTable: return Wrapper(VirtualAccountsTable, { onEdit: () => {}, onDelete: () => {} });
        // Cast VoiceControl to any to bypass strict type check for now, as it's a wrapper
        case View.VoiceControl: return DataContextWrapper(VoiceControl as any);
        case View.WebhookSimulator: return Wrapper(WebhookSimulator, { stripeAccountId: 'acct_mock' });

        default: return <AIIntentStub view={activeView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="relative flex flex-col flex-1 min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,#111,transparent)]">
            <div className="max-w-[1600px] mx-auto h-full min-h-0">
                {renderView()}
            </div>
        </main>
        <MonetizationOverlay />
      </div>
      {/* Explicitly call VoiceControl wrapper outside main render loop to satisfy component requirements if needed, or rely on View state */}
    </div>
  );
};

const theme = createTheme({ palette: { mode: 'dark' } });

function App() {
  return (
    <Auth0Provider
        domain="aibankinguniversity.us.auth0.com"
        clientId="fOkKYLJUrLnv7hInn8CVi3cHpjF7xPRp"
        authorizationParams={{ redirect_uri: window.location.origin }}
    >
        <AuthProvider>
            <DataProvider>
                <MoneyMovementProvider>
                    <StripeDataProvider>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <Router>
                                <Routes>
                                    <Route path="/" element={<LandingPage />} />
                                    <Route path="/login" element={<LoginView />} />
                                    <Route path="*" element={<SAppLayout />} />
                                </Routes>
                            </Router>
                        </ThemeProvider>
                    </StripeDataProvider>
                </MoneyMovementProvider>
            </DataProvider>
        </AuthProvider>
    </Auth0Provider>
  );
}

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/App.tsx
================================================================================

import React, { useState, useContext, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Cpu, ShieldAlert, Sparkles, Terminal, ArrowLeft, ExternalLink, Grid } from 'lucide-react';
import { Auth0Provider } from '@auth0/auth0-react';
import { Analytics } from '@vercel/analytics/react';
import { datadogLogs } from '@datadog/browser-logs'; // Assuming you have this installed

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider, DataContext } from './context/DataContext';

// Layout & Components (assuming these are in src/components, create minimal versions if missing)
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SApp from './components/SApp'; // Placeholder
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { LoginView } from './components/LoginView'; // Your LoginView
import AIIntentStub from './components/AIIntentStub'; // Placeholder
import AIModuleCard from './components/AIModuleCard'; // For ExternalIframeCollection
import ExternalIframeCollection from './components/ExternalIframeCollection'; // For modules route

// --- Mock/Placeholder Components for compilation ---
const StripeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
const MoneyMovementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
const PlaidClient: any = function() {}; // Mock client

// Example for all the other views you imported, minimal placeholders
const TransactionsView = () => <AIIntentStub view={View.Transactions} />;
const SendMoneyView = () => <AIIntentStub view={View.SendMoney} />;
const BudgetsView = () => <AIIntentStub view={View.Budgets} />;
const FinancialGoalsView = () => <AIIntentStub view={View.FinancialGoals} />;
const CreditHealthView = () => <AIIntentStub view={View.CreditHealth} />;
const PersonalizationView = () => <AIIntentStub view={View.Personalization} />;
const AccountsView = () => <AIIntentStub view={View.Accounts} />;
const InvestmentsView = () => <AIIntentStub view={View.Investments} />;
const CryptoView = () => <AIIntentStub view={View.CryptoWeb3} />;
const AlgoTradingLab = () => <AIIntentStub view={View.AlgoTradingLab} />;
const ForexArena = () => <AIIntentStub view={View.ForexArena} />;
const CommoditiesExchange = () => <AIIntentStub view={View.CommoditiesExchange} />;
const RealEstateEmpire = () => <AIIntentStub view={View.RealEstateEmpire} />;
const ArtCollectibles = () => <AIIntentStub view={View.ArtCollectibles} />;
const DerivativesDesk = () => <AIIntentStub view={View.DerivativesDesk} />;
const VentureCapitalDesk = () => <AIIntentStub view={View.VentureCapital} />;
const PrivateEquityLounge = () => <AIIntentStub view={View.PrivateEquity} />;
const TaxOptimizationChamber = () => <AIIntentStub view={View.TaxOptimization} />;
const LegacyBuilder = () => <AIIntentStub view={View.LegacyBuilder} />;
const CorporateCommandView: React.FC<{ setActiveView: (view: View) => void }> = ({ setActiveView }) => <AIIntentStub view={View.CorporateCommand} />;
const ModernTreasuryView = () => <AIIntentStub view={View.ModernTreasury} />;
const OpenBankingView = () => <AIIntentStub view={View.OpenBanking} />;
const FinancialDemocracyView = () => <AIIntentStub view={View.FinancialDemocracy} />;
const AIAdStudioView = () => <AIIntentStub view={View.AIAdStudio} />;
const QuantumWeaverView = () => <AIIntentStub view={View.QuantumWeaver} />;
const AgentMarketplaceView = () => <AIIntentStub view={View.AgentMarketplace} />;
const APIIntegrationView = () => <AIIntentStub view={View.APIStatus} />;
const SettingsView = () => <AIIntentStub view={View.Settings} />;
const PlaidDashboardView = () => <AIIntentStub view={View.PlaidMainDashboard} />; // Placeholder
const StripeDashboardView = () => <AIIntentStub view={View.StripeNexus} />; // Placeholder
const MarqetaDashboardView = () => <AIIntentStub view={View.CardholderManagement} />; // Placeholder
const SSOView = () => <AIIntentStub view={View.SSOView} />; // Placeholder
const ConciergeService = () => <AIIntentStub view={View.ConciergeService} />; // Placeholder
const SovereignWealth = () => <AIIntentStub view={View.SovereignWealth} />;
const PhilanthropyHub = () => <AIIntentStub view={View.Philanthropy} />;
const TheVisionView = () => <AIIntentStub view={View.TheVision} />;
const AIAdvisorView = () => <AIIntentStub view={View.AIAdvisor} />;
const AIInsights = () => <AIIntentStub view={View.AIInsights} />;
const SecurityView = () => <AIIntentStub view={View.SecurityCenter} />;
const ComplianceOracleView = () => <AIIntentStub view={View.ComplianceOracle} />;
const GlobalPositionMap = () => <AIIntentStub view={View.GlobalPositionMap} />;
const GlobalSsiHubView = () => <AIIntentStub view={View.GlobalSsiHub} />;
const CustomerDashboard = () => <AIIntentStub view={View.CustomerDashboard} />;
const VerificationReportsView: React.FC<{ customerId: string }> = ({ customerId }) => <AIIntentStub view={View.VerificationReports} />;
const FinancialReportingView = () => <AIIntentStub view={View.FinancialReporting} />;
const TheBookView = () => <AIIntentStub view={View.TheBook} />;
const KnowledgeBaseView = () => <AIIntentStub view={View.KnowledgeBase} />;
const VoiceControl = () => <AIIntentStub view={View.VoiceControl} />;
const QuantumAssets = () => <AIIntentStub view={View.QuantumAssets} />;
const CitibankAccountsView = () => <AIIntentStub view={View.CitibankAccounts} />;
const CitibankAccountProxyView = () => <AIIntentStub view={View.CitibankAccountProxy} />;
const CitibankBillPayView = () => <AIIntentStub view={View.CitibankBillPay} />;
const CitibankCrossBorderView = () => <AIIntentStub view={View.CitibankCrossBorder} />;
const CitibankPayeeManagementView = () => <AIIntentStub view={View.CitibankPayeeManagement} />;
const CitibankStandingInstructionsView = () => <AIIntentStub view={View.CitibankStandingInstructions} />;
const CitibankDeveloperToolsView = () => <AIIntentStub view={View.CitibankDeveloperTools} />;
const CitibankEligibilityView = () => <AIIntentStub view={View.CitibankEligibility} />;
const CitibankUnmaskedDataView: React.FC<{ accountIdsToUnmask: string[] }> = ({ accountIdsToUnmask }) => <AIIntentStub view={View.CitibankUnmaskedData} />;
const PlaidIdentityView = () => <AIIntentStub view={View.PlaidIdentity} />;
const PlaidCRAMonitoringView = () => <AIIntentStub view={View.PlaidCRAMonitoring} />;
const PlaidInstitutionsExplorer: React.FC<{ client: any }> = ({ client }) => <AIIntentStub view={View.PlaidInstitutions} />;
const PlaidItemManagementView: React.FC<{ accessToken: string }> = ({ accessToken }) => <AIIntentStub view={View.PlaidItemManagement} />;
const PlaidMainDashboard = () => <AIIntentStub view={View.PlaidMainDashboard} />;
const StripeNexusView = () => <AIIntentStub view={View.StripeNexus} />;
const CounterpartyDashboardView = () => <AIIntentStub view={View.CounterpartyDashboard} />;
const VirtualAccountsDashboard = () => <AIIntentStub view={View.VirtualAccounts} />;
const CorporateActionsNexusView = () => <AIIntentStub view={View.CorporateActions} />;
const CreditNoteLedger = () => <AIIntentStub view={View.CreditNoteLedger} />;
const ReconciliationHubView = () => <AIIntentStub view={View.ReconciliationHub} />;
const GEINDashboard = () => <AIIntentStub view={View.GEINDashboard} />;
const CardholderManagement = () => <AIIntentStub view={View.CardholderManagement} />;
const UniversalObjectInspector: React.FC<{ data: any }> = ({ data }) => <AIIntentStub view={View.UniversalObjectInspector} />;
const DeveloperHubView = () => <AIIntentStub view={View.DeveloperHub} />;
const ApiPlaygroundView = () => <AIIntentStub view={View.ApiPlayground} />;
const BusinessDemoView = () => <AIIntentStub view={View.BusinessDemoView} />;
const SecurityComplianceView = () => <AIIntentStub view={View.SecurityCompliance} />;
const SchemaExplorer: React.FC<{ schemaData: any }> = ({ schemaData }) => <AIIntentStub view={View.SchemaExplorer} />;
const ResourceGraphView = () => <AIIntentStub view={View.ResourceGraph} />;
const VentureCapitalDeskView = () => <AIIntentStub view={View.VentureCapitalDeskView} />;

// Direct component access mocks
const AccountDetails: React.FC<any> = (props) => <AIIntentStub view={View.AccountDetails} />;
const AccountList: React.FC<any> = (props) => <AIIntentStub view={View.AccountList} />;
const AccountStatementGrid: React.FC<any> = (props) => <AIIntentStub view={View.AccountStatementGrid} />;
const AccountVerificationModal: React.FC<any> = (props) => <AIIntentStub view={View.AccountVerificationModal} />;
const ACHDetailsDisplay: React.FC<any> = (props) => <AIIntentStub view={View.ACHDetailsDisplay} />;
const AICommandLog: React.FC<any> = (props) => <AIIntentStub view={View.AICommandLog} />;
const AIPredictionWidget: React.FC<any> = (props) => <AIIntentStub view={View.AIPredictionWidget} />;
const AssetCatalog: React.FC<any> = (props) => <AIIntentStub view={View.AssetCatalog} />;
const AutomatedSweepRules: React.FC<any> = (props) => <AIIntentStub view={View.AutomatedSweepRules} />;
const BalanceReportChart: React.FC<any> = (props) => <AIIntentStub view={View.BalanceReportChart} />;
const BalanceTransactionTable: React.FC<any> = (props) => <AIIntentStub view={View.BalanceTransactionTable} />;
const CardDesignVisualizer: React.FC<any> = (props) => <AIIntentStub view={View.CardDesignVisualizer} />;
const ChargeDetailModal: React.FC<any> = (props) => <AIIntentStub view={View.ChargeDetailModal} />;
const ChargeList: React.FC<any> = (props) => <AIIntentStub view={View.ChargeList} />;
const ConductorConfigurationView: React.FC<any> = (props) => <AIIntentStub view={View.ConductorConfigurationView} />;
const CounterpartyDetails: React.FC<any> = (props) => <AIIntentStub view={View.CounterpartyDetails} />;
const CounterpartyForm: React.FC<any> = (props) => <AIIntentStub view={View.CounterpartyForm} />;
const DisruptionIndexMeter: React.FC<any> = (props) => <AIIntentStub view={View.DisruptionIndexMeter} />;
const DocumentUploader: React.FC<any> = (props) => <AIIntentStub view={View.DocumentUploader} />;
const DownloadLink: React.FC<any> = (props) => <AIIntentStub view={View.DownloadLink} />;
const EarlyFraudWarningFeed: React.FC<any> = (props) => <AIIntentStub view={View.EarlyFraudWarningFeed} />;
const ElectionChoiceForm: React.FC<any> = (props) => <AIIntentStub view={View.ElectionChoiceForm} />;
const EventNotificationCard: React.FC<any> = (props) => <AIIntentStub view={View.EventNotificationCard} />;
const ExpectedPaymentsTable: React.FC<any> = (props) => <AIIntentStub view={View.ExpectedPaymentsTable} />;
const ExternalAccountCard: React.FC<any> = (props) => <AIIntentStub view={View.ExternalAccountCard} />;
const ExternalAccountForm: React.FC<any> = (props) => <AIIntentStub view={View.ExternalAccountForm} />;
const ExternalAccountTable: React.FC<any> = (props) => <AIIntentStub view={View.ExternalAccountsTable} />;
const FinancialAccountCard: React.FC<any> = (props) => <AIIntentStub view={View.FinancialAccountCard} />;
const IncomingPaymentDetailList: React.FC<any> = (props) => <AIIntentStub view={View.IncomingPaymentDetailList} />;
const InvestmentForm: React.FC<any> = (props) => <AIIntentStub view={View.InvestmentForm} />;
const InvoiceFinancingRequest: React.FC<any> = (props) => <AIIntentStub view={View.InvoiceFinancingRequest} />;
const PaymentInitiationForm: React.FC<any> = (props) => <AIIntentStub view={View.PaymentInitiationForm} />;
const PaymentMethodDetails: React.FC<any> = (props) => <AIIntentStub view={View.PaymentMethodDetails} />;
const PaymentOrderForm: React.FC<any> = (props) => <AIIntentStub view={View.PaymentOrderForm} />;
const PayoutsDashboard: React.FC<any> = (props) => <AIIntentStub view={View.PayoutsDashboard} />;
const PnLChart: React.FC<any> = (props) => <AIIntentStub view={View.PnLChart} />;
const RefundForm: React.FC<any> = (props) => <AIIntentStub view={View.RefundForm} />;
const RemittanceInfoEditor: React.FC<any> = (props) => <AIIntentStub view={View.RemittanceInfoEditor} />;
const ReportingView: React.FC<any> = (props) => <AIIntentStub view={View.ReportingView} />;
const ReportRunGenerator: React.FC<any> = (props) => <AIIntentStub view={View.ReportRunGenerator} />;
const ReportStatusIndicator: React.FC<any> = (props) => <AIIntentStub view={View.ReportStatusIndicator} />;
const SsiEditorForm: React.FC<any> = (props) => <AIIntentStub view={View.SsiEditorForm} />;
const StripeStatusBadge: React.FC<any> = (props) => <AIIntentStub view={View.StripeStatusBadge} />;
const StructuredPurposeInput: React.FC<any> = (props) => <AIIntentStub view={View.StructuredPurposeInput} />;
const SubscriptionList: React.FC<any> = (props) => <AIIntentStub view={View.SubscriptionList} />;
const TimeSeriesChart: React.FC<any> = (props) => <AIIntentStub view={View.TimeSeriesChart} />;
const TradeConfirmationModal: React.FC<any> = (props) => <AIIntentStub view={View.TradeConfirmationModal} />;
const TransactionFilter: React.FC<any> = (props) => <AIIntentStub view={View.TransactionFilter} />;
const TransactionList: React.FC<any> = (props) => <AIIntentStub view={View.TransactionList} />;
const TreasuryTransactionList: React.FC<any> = (props) => <AIIntentStub view={View.TreasuryTransactionList} />;
const TreasuryView: React.FC<any> = (props) => <AIIntentStub view={View.TreasuryView} />;
const VirtualAccountForm: React.FC<any> = (props) => <AIIntentStub view={View.VirtualAccountForm} />;
const VirtualAccountsTable: React.FC<any> = (props) => <AIIntentStub view={View.VirtualAccountsTable} />;
const WebhookSimulator: React.FC<any> = (props) => <AIIntentStub view={View.WebhookSimulator} />;


type WrapperProps = {
  Component: React.FC<any>;
  props?: any;
};

const Wrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  return <Component {...props} />;
};

const ModalWrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Component
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      {...props}
    />
  );
};

const DataContextWrapper: React.FC<{ Component: React.FC<any>; extraProps?: any }> = ({ Component, extraProps = {} }) => {
  const dataContext = useContext(DataContext);
  const mockContext = {
    setActiveView: () => {},
    impactData: { treesPlanted: 0, progressToNextTree: 0 },
  };
  const props = { ...(dataContext || mockContext), ...extraProps };
  return <Component {...props} />;
};


// --- Enums ---
export enum View {
  Dashboard = 'dashboard',
  Transactions = 'transactions',
  SendMoney = 'send-money',
  Budgets = 'budgets',
  FinancialGoals = 'financial-goals',
  CreditHealth = 'credit-health',
  Personalization = 'personalization',
  Accounts = 'accounts',
  Investments = 'investments',
  CryptoWeb3 = 'crypto-web3',
  AlgoTradingLab = 'algo-trading-lab',
  ForexArena = 'forex-arena',
  CommoditiesExchange = 'commodities-exchange',
  RealEstateEmpire = 'real-estate-empire',
  ArtCollectibles = 'art-collectibles',
  DerivativesDesk = 'derivatives-desk',
  VentureCapital = 'venture-capital',
  PrivateEquity = 'private-equity',
  TaxOptimization = 'tax-optimization',
  LegacyBuilder = 'legacy-builder',
  CorporateCommand = 'corporate-command',
  ModernTreasury = 'modern-treasury',
  OpenBanking = 'open-banking',
  FinancialDemocracy = 'financial-democracy',
  AIAdStudio = 'ai-ad-studio',
  QuantumWeaver = 'quantum-weaver',
  AgentMarketplace = 'agent-marketplace',
  APIStatus = 'api-status',
  Settings = 'settings',
  QuantumAssets = 'quantum-assets',
  SovereignWealth = 'sovereign-wealth',
  Philanthropy = 'philanthropy',
  TheVision = 'the-vision',
  AIAdvisor = 'ai-advisor',
  AIInsights = 'ai-insights',
  SecurityCenter = 'security-center',
  ComplianceOracle = 'compliance-oracle',
  GlobalPositionMap = 'global-position-map',
  GlobalSsiHub = 'global-ssi-hub',
  CustomerDashboard = 'customer-dashboard',
  VerificationReports = 'verification-reports',
  FinancialReporting = 'financial-reporting',
  TheBook = 'the-book',
  KnowledgeBase = 'knowledge-base',
  CitibankAccounts = 'citibank-accounts',
  CitibankAccountProxy = 'citibank-account-proxy',
  CitibankBillPay = 'citibank-bill-pay',
  CitibankCrossBorder = 'citibank-cross-border',
  CitibankPayeeManagement = 'citibank-payee-management',
  CitibankStandingInstructions = 'citibank-standing-instructions',
  CitibankDeveloperTools = 'citibank-developer-tools',
  CitibankEligibility = 'citibank-eligibility',
  CitibankUnmaskedData = 'citibank-unmasked-data',
  PlaidMainDashboard = 'plaid-main-dashboard',
  PlaidIdentity = 'plaid-identity',
  PlaidCRAMonitoring = 'plaid-cra-monitoring',
  PlaidInstitutions = 'plaid-institutions',
  PlaidItemManagement = 'plaid-item-management',
  StripeNexus = 'stripe-nexus',
  CounterpartyDashboard = 'counterparty-dashboard',
  VirtualAccounts = 'virtual-accounts',
  SApp = 'sapp',
  CorporateActions = 'corporate-actions',
  CreditNoteLedger = 'credit-note-ledger',
  ReconciliationHub = 'reconciliation-hub',
  GEINDashboard = 'gein-dashboard',
  CardholderManagement = 'cardholder-management',
  SecurityCompliance = 'security-compliance',
  DeveloperHub = 'developer-hub',
  SchemaExplorer = 'schema-explorer',
  ResourceGraph = 'resource-graph',
  ApiPlayground = 'api-playground',
  VentureCapitalDeskView = 'venture-capital-desk-view', // Note: This seems like a duplicate of VentureCapital enum
  BusinessDemoView = 'business-demo-view',

  // Direct Component Access (add all your direct component View enums here)
  AccountDetails = 'account-details',
  AccountList = 'account-list',
  AccountStatementGrid = 'account-statement-grid',
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
  InvestmentForm = 'investment-form',
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
  StripeStatusBadge = 'stripe-status-badge',
  StructuredPurposeInput = 'structured-purpose-input',
  SubscriptionList = 'subscription-list',
  TimeSeriesChart = 'time-series-chart',
  TradeConfirmationModal = 'trade-confirmation-modal',
  TransactionFilter = 'transaction-filter',
  TransactionList = 'transaction-list',
  TreasuryTransactionList = 'treasury-transaction-list',
  TreasuryView = 'treasury-view',
  UniversalObjectInspector = 'universal-object-inspector',
  VirtualAccountForm = 'virtual-account-form',
  VirtualAccountsTable = 'virtual-accounts-table',
  VoiceControl = 'voice-control',
  WebhookSimulator = 'webhook-simulator'
}


const MonetizationOverlay = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { sovereignCredits } = context;
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sovereign Balance:</span>
      <span className="text-cyan-400 font-mono text-lg font-bold tracking-tighter">
        {sovereignCredits.toLocaleString()} SC
      </span>
    </div>
  );
};

const SAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    datadogLogs.logger.info('App View Loaded', { name: 'SovereignNexus', id: 'init_view' });
  }, []);

  if (!dataContext || !authContext) return null;
  const { isAuthenticated, isLoading: authLoading } = authContext;
  const { isLoading: dataLoading, activeView, setActiveView } = dataContext;

  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-6">
        <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />
        <h1 className="text-3xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase font-mono">
          Nexus OS // Syncing
        </h1>
        <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-progress-flow"></div>
        </div>
        <style>{`
          @keyframes flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          .animate-progress-flow { animation: flow 2s linear infinite; width: 50%; }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const renderView = () => {
    switch (activeView) {
      case View.Dashboard: return <Dashboard />;
      case View.Transactions: return <TransactionsView />;
      case View.SendMoney: return <SendMoneyView />;
      case View.Budgets: return <BudgetsView />;
      case View.FinancialGoals: return <FinancialGoalsView />;
      case View.CreditHealth: return <CreditHealthView />;
      case View.Personalization: return <PersonalizationView />;
      case View.Accounts: return <AccountsView />;
      case View.Investments: return <InvestmentsView />;
      case View.CryptoWeb3: return <CryptoView />;
      case View.AlgoTradingLab: return <AlgoTradingLab />;
      case View.ForexArena: return <ForexArena />;
      case View.CommoditiesExchange: return <CommoditiesExchange />;
      case View.RealEstateEmpire: return <RealEstateEmpire />;
      case View.ArtCollectibles: return <ArtCollectibles />;
      case View.DerivativesDesk: return <DerivativesDesk />;
      case View.VentureCapital: return <VentureCapitalDesk />;
      case View.PrivateEquity: return <PrivateEquityLounge />;
      case View.TaxOptimization: return <TaxOptimizationChamber />;
      case View.LegacyBuilder: return <LegacyBuilder />;
      case View.CorporateCommand: return <CorporateCommandView setActiveView={setActiveView} />;
      case View.ModernTreasury: return <ModernTreasuryView />;
      case View.OpenBanking: return <OpenBankingView />;
      case View.FinancialDemocracy: return <FinancialDemocracyView />;
      case View.AIAdStudio: return <AIAdStudioView />;
      case View.QuantumWeaver: return <QuantumWeaverView />;
      case View.AgentMarketplace: return <AgentMarketplaceView />;
      case View.APIStatus: return <APIIntegrationView />;
      case View.Settings: return <SettingsView />;
      case View.QuantumAssets: return <QuantumAssets />;
      case View.SovereignWealth: return <SovereignWealth />;
      case View.Philanthropy: return <PhilanthropyHub />;
      case View.TheVision: return <TheVisionView />;
      case View.AIAdvisor: return <AIAdvisorView />;
      case View.AIInsights: return <AIInsights />;
      case View.SecurityCenter: return <SecurityView />;
      case View.ComplianceOracle: return <ComplianceOracleView />;
      case View.GlobalPositionMap: return <GlobalPositionMap />;
      case View.GlobalSsiHub: return <GlobalSsiHubView />;
      case View.CustomerDashboard: return <CustomerDashboard />;
      case View.VerificationReports: return <VerificationReportsView customerId="c1" />;
      case View.FinancialReporting: return <FinancialReportingView />;
      case View.TheBook: return <TheBookView />;
      case View.KnowledgeBase: return <KnowledgeBaseView />;
      case View.CitibankAccounts: return <CitibankAccountsView />;
      case View.CitibankAccountProxy: return <CitibankAccountProxyView />;
      case View.CitibankBillPay: return <CitibankBillPayView />;
      case View.CitibankCrossBorder: return <CitibankCrossBorderView />;
      case View.CitibankPayeeManagement: return <CitibankPayeeManagementView />;
      case View.CitibankStandingInstructions: return <CitibankStandingInstructionsView />;
      case View.CitibankDeveloperTools: return <CitibankDeveloperToolsView />;
      case View.CitibankEligibility: return <CitibankEligibilityView />;
      case View.CitibankUnmaskedData: return <CitibankUnmaskedDataView accountIdsToUnmask={['acc_1']} />;
      case View.PlaidMainDashboard: return <PlaidMainDashboard />;
      case View.PlaidIdentity: return <PlaidIdentityView />;
      case View.PlaidCRAMonitoring: return <PlaidCRAMonitoringView />;
      case View.PlaidInstitutions: return <PlaidInstitutionsExplorer client={new PlaidClient()} />;
      case View.PlaidItemManagement: return <PlaidItemManagementView accessToken="mock_token" />;
      case View.StripeNexus: return <StripeNexusView />;
      case View.CounterpartyDashboard: return <CounterpartyDashboardView />;
      case View.VirtualAccounts: return <VirtualAccountsDashboard />;
      case View.SApp: return <SApp />;
      case View.CorporateActions: return <CorporateActionsNexusView />;
      case View.CreditNoteLedger: return <CreditNoteLedger />;
      case View.ReconciliationHub: return <ReconciliationHubView />;
      case View.GEINDashboard: return <GEINDashboard />;
      case View.CardholderManagement: return <CardholderManagement />;
      case View.SecurityCompliance: return <SecurityComplianceView />;
      case View.DeveloperHub: return <DeveloperHubView />;
      case View.SchemaExplorer: return <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} />;
      case View.ResourceGraph: return <ResourceGraphView />;
      case View.ApiPlayground: return <ApiPlaygroundView />;
      case View.VentureCapitalDeskView: return <VentureCapitalDeskView />;
      case View.BusinessDemoView: return <BusinessDemoView />;

      // --- Direct Component Access ---
      case View.AccountDetails:
        return <Wrapper Component={AccountDetails} props={{ accountId: '1', customerId: 'c1' }} />;
      case View.AccountList:
        return <Wrapper Component={AccountList} props={{ accounts: [] }} />;
      case View.AccountStatementGrid:
        return <Wrapper Component={AccountStatementGrid} props={{ statementLines: [] }} />;
      case View.AccountVerificationModal:
        return <ModalWrapper Component={AccountVerificationModal} props={{ externalAccount: {id: '1', verification_status: 'unverified' }, onSuccess: () => {}}} />;
      case View.ACHDetailsDisplay:
        return <Wrapper Component={ACHDetailsDisplay} props={{ details: { routingNumber: '123', realAccountNumber: '456' } }} />;
      case View.AICommandLog:
        return <AICommandLog />;
      case View.AIPredictionWidget:
        return <AIPredictionWidget />;
      case View.AssetCatalog:
        return <Wrapper Component={AssetCatalog} props={{ assets: [], onAssetSelected: () => {}, getAssetDetails: async () => ({}) }} />;
      case View.AutomatedSweepRules:
        return <AutomatedSweepRules />;
      case View.BalanceReportChart:
        return <Wrapper Component={BalanceReportChart} props={{ data: [] }} />;
      case View.BalanceTransactionTable:
        return <Wrapper Component={BalanceTransactionTable} props={{ balanceTransactions: [] }} />;
      case View.CardDesignVisualizer:
        return <Wrapper Component={CardDesignVisualizer} props={{ design: { id: 'd_1', physical_bundle: { features: {} } } }} />;
      case View.ChargeDetailModal:
        return <ModalWrapper Component={ChargeDetailModal} props={{ charge: {id: 'ch_1', amount: 50000, currency: 'USD', status: 'succeeded'}, onClose: () => {}}} />;
      case View.ChargeList:
        return <ChargeList />;
      case View.ConductorConfigurationView:
        return <ConductorConfigurationView />;
      case View.CounterpartyDetails:
        return <Wrapper Component={CounterpartyDetails} props={{ counterpartyId: 'cp_1' }} />;
      case View.CounterpartyForm:
        return <Wrapper Component={CounterpartyForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.DisruptionIndexMeter:
        return <Wrapper Component={DisruptionIndexMeter} props={{ indexValue: 50 }} />;
      case View.DocumentUploader:
        return <Wrapper Component={DocumentUploader} props={{ documentableType: 'test', documentableId: '1' }} />;
      case View.DownloadLink:
        return <Wrapper Component={DownloadLink} props={{ url: '#', filename: 'test.pdf' }} />;
      case View.EarlyFraudWarningFeed:
        return <EarlyFraudWarningFeed />;
      case View.ElectionChoiceForm:
        return <Wrapper Component={ElectionChoiceForm} props={{ availableChoices: {}, onSubmit: () => {}, onCancel: () => {} }} />;
      case View.EventNotificationCard:
        return <Wrapper Component={EventNotificationCard} props={{ event: {} }} />;
      case View.ExpectedPaymentsTable:
        return <ExpectedPaymentsTable />;
      case View.ExternalAccountCard:
        return <Wrapper Component={ExternalAccountCard} props={{ account: {id: '1', account_details: [], routing_details: []}}} />;
      case View.ExternalAccountForm:
        return <Wrapper Component={ExternalAccountForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.ExternalAccountsTable:
        return <Wrapper Component={ExternalAccountTable} props={{ accounts: [] }} />;
      case View.FinancialAccountCard:
        return <Wrapper Component={FinancialAccountCard} props={{ financialAccount: {id: 'fa_1', balance: { cash: {}}, supported_currencies: []}}} />;
      case View.IncomingPaymentDetailList:
        return <IncomingPaymentDetailList />;
      case View.InvoiceFinancingRequest:
        return <Wrapper Component={InvoiceFinancingRequest} props={{ onSubmit: () => {} }} />;
      case View.PaymentInitiationForm:
        return <PaymentInitiationForm />;
      case View.PaymentMethodDetails:
        return <Wrapper Component={PaymentMethodDetails} props={{ details: { type: 'card', card: {} }}} />;
      case View.PaymentOrderForm:
        return <Wrapper Component={PaymentOrderForm} props={{ internalAccounts: [], externalAccounts: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.PayoutsDashboard:
        return <PayoutsDashboard />;
      case View.PnLChart:
        return <Wrapper Component={PnLChart} props={{ data: [], algorithmName: 'Test' }} />;
      case View.RefundForm:
        return <RefundForm />;
      case View.RemittanceInfoEditor:
        return <Wrapper Component={RemittanceInfoEditor} props={{ onChange: () => {} }} />;
      case View.ReportingView:
        return <ReportingView />;
      case View.ReportRunGenerator:
        return <ReportRunGenerator />;
      case View.ReportStatusIndicator:
        return <Wrapper Component={ReportStatusIndicator} props={{ status: 'success' }} />;
      case View.SsiEditorForm:
        return <Wrapper Component={SsiEditorForm} props={{ onSubmit: () => {}, onCancel: () => {} }} />;
      case View.StripeStatusBadge:
        return <Wrapper Component={StripeStatusBadge} props={{ status: 'succeeded', objectType: 'charge' }} />;
      case View.StructuredPurposeInput:
        return <Wrapper Component={StructuredPurposeInput} props={{ onChange: () => {}, value: null }} />;
      case View.SubscriptionList:
        return <Wrapper Component={SubscriptionList} props={{ subscriptions: [] }} />;
      case View.TimeSeriesChart:
        return <Wrapper Component={TimeSeriesChart} props={{ data: { labels: [], datasets: [] } }} />;
      case View.TradeConfirmationModal:
        return (
          <ModalWrapper
            Component={TradeConfirmationModal}
            props={{
              settlementInstruction: {
                messageId: 'NEX-INST-99281-Z',
                totalAmount: 12500000, // 125k
                currency: 'USD',
                creationDateTime: Date.now(),
                settlementDate: '2024-12-15',
                numberOfTransactions: 1,
                purpose: 'TREA'
              }
            }}
          />
        );
      case View.TransactionFilter:
        return <Wrapper Component={TransactionFilter} props={{ onApplyFilters: () => {} }} />;
      case View.TransactionList:
        return <Wrapper Component={TransactionList} props={{ transactions: [] }} />;
      case View.TreasuryTransactionList:
        return <Wrapper Component={TreasuryTransactionList} props={{ transactions: [] }} />;
      case View.TreasuryView:
        return <TreasuryView />;
      case View.UniversalObjectInspector:
        return <Wrapper Component={UniversalObjectInspector} props={{ data: { status: "Nominal", uptime: "99.999%", load: "Balanced" } }} />;
      case View.VirtualAccountForm:
        return <Wrapper Component={VirtualAccountForm} props={{ onSubmit: () => {}, isSubmitting: false }} />;
      case View.VirtualAccountsTable:
        return <Wrapper Component={VirtualAccountsTable} props={{ onEdit: () => {}, onDelete: () => {} }} />;
      case View.VoiceControl:
        return <DataContextWrapper Component={VoiceControl} />;
      case View.WebhookSimulator:
        return <Wrapper Component={WebhookSimulator} props={{ stripeAccountId: 'acct_mock' }} />;

      default: return <AIIntentStub view={activeView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="relative flex flex-col flex-1 min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,#111,transparent)]">
          <div className="max-w-[1600px] mx-auto h-full min-h-0">
            {renderView()}
          </div>
        </main>
        <MonetizationOverlay />
        <Link
          to="/modules"
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] group"
          title="Open AI Nexus"
        >
          <Grid size={20} className="group-hover:animate-spin-slow" />
        </Link>
      </div>
    </div>
  );
};
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  // Proper redirect callback without hash-based routing
  const onRedirectCallback = (appState: any) => {
    const egressTarget = appState?.returnTo || '/dashboard';
    window.location.replace(egressTarget);
  };

  return (
    <Auth0Provider
  domain={import.meta.env.REACT_APP_AUTH0_DOMAIN || 'auth.aibanking.dev'}
  clientId={import.meta.env.REACT_APP_AUTH0_CLIENT_ID || 'zt6OsWvRgUtQsISRILfGFr7XhxwC6JgY'}
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: import.meta.env.REACT_APP_API_AUDIENCE || 'https://auth.aibanking.dev/api',
    scope: 'openid profile email offline_access'
  }}
  useRefreshTokens={true}
  cacheLocation="localstorage"
  usePushedAuthorizationRequests={true} // <-- NEW
>
      <AuthProvider>
        <DataProvider>
          <MoneyMovementProvider>
            <StripeDataProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                  <Routes>
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/modules" element={<ExternalIframeCollection />} />
                    <Route path="/business-demo" element={<BusinessDemoView />} />
                    <Route path="/dashboard" element={<SAppLayout />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Router>
              </ThemeProvider>
            </StripeDataProvider>
          </MoneyMovementProvider>
        </DataProvider>
      </AuthProvider>
      <Analytics />
    </Auth0Provider>
  );
}

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/autoomousai | ORIGINAL PATH: diplomat-bit-autoomousai-f4d320c/App.tsx
================================================================================


import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AuthModal } from './components/AuthModal';
import { FileExplorer } from './components/FileExplorer';
import { EditorCanvas } from './components/EditorCanvas';
import { fetchAllRepos, fetchRepoTree, getFileContent, commitFile, getRepoBranches, createBranch, createPullRequest, createRepo, triggerWorkflow, getWorkflowRuns, getWorkflowRun, getWorkflowRunLogs } from './services/githubService';
import { primaryModels, fallbackModels, planRepositoryEdit, bulkEditFileWithAI, generateProjectPlan, generateFileContent, planProjectExpansionEdits, modelsToUse, streamSingleFileEdit, cleanAiCodeResponse, correctCodeFromBuildError, streamRepositoryFileEdit, setGeminiApiKey } from './services/geminiService';
import { GithubRepo, UnifiedFileTree, SelectedFile, Alert, Branch, FileNode, DirNode, BulkEditJob, ProjectGenerationJob, ProjectExpansionJob, ProjectExpansionPhase, ProjectPlan, AdvancedEditJob, AdvancedEditPhase, WorkflowRun, AdvancedEditJobStatus, RepositoryEditPlan, ProjectExpansionPlan, EditCheckpoint } from './types';
import { Spinner } from './components/Spinner';
import { AlertPopup } from './components/AlertPopup';
import { MultiFileAiEditModal } from './components/BulkAiEditModal';
import { BulkEditProgress } from './components/BulkEditProgress';
import { NewProjectModal } from './components/NewProjectModal';
import { ProjectGenerationProgress } from './components/ProjectGenerationProgress';
import { ProjectExpansionModal } from './components/ProjectExpansionModal';
import { ProjectExpansionProgress } from './components/ProjectExpansionProgress';
import { AdvancedAiEditModal } from './components/AdvancedAiEditModal';
import { AdvancedEditProgress } from './components/AdvancedEditProgress';
import { AiChatModal } from './components/AiChatModal';
import { getAllFilePaths } from './utils';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<UnifiedFileTree>({});
  
  const [openFiles, setOpenFiles] = useState<SelectedFile[]>([]);
  const [activeFileKey, setActiveFileKey] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [alert, setAlert] = useState<Alert | null>(null);
  
  const [branchesByRepo, setBranchesByRepo] = useState<Record<string, Branch[]>>({});
  const [currentBranchByRepo, setCurrentBranchByRepo] = useState<Record<string, string>>({});

  const [isMultiEditModalOpen, setMultiEditModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkEditJobs, setBulkEditJobs] = useState<BulkEditJob[]>([]);
  
  const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [projectGenerationJobs, setProjectGenerationJobs] = useState<ProjectGenerationJob[]>([]);
  const [projectGenerationStatus, setProjectGenerationStatus] = useState('');
  
  const [isExpansionModalOpen, setExpansionModalOpen] = useState(false);
  const [isExpandingProject, setIsExpandingProject] = useState(false);
  const [expansionJobs, setExpansionJobs] = useState<ProjectExpansionJob[]>([]);
  const [expansionPhase, setExpansionPhase] = useState<ProjectExpansionPhase>('idle');
  
  const [isAdvancedEditModalOpen, setAdvancedEditModalOpen] = useState(false);
  const [isAdvancedEditing, setIsAdvancedEditing] = useState(false);
  const [advancedEditJobs, setAdvancedEditJobs] = useState<AdvancedEditJob[]>([]);
  const [advancedEditPhase, setAdvancedEditPhase] = useState<AdvancedEditPhase>('idle');
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [advancedEditBuildLogs, setAdvancedEditBuildLogs] = useState<string | null>(null);
  const [workflowRunUrl, setWorkflowRunUrl] = useState<string | null>(null);
  const [aiThought, setAiThought] = useState<string | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);

  const [isAiChatModalOpen, setAiChatModalOpen] = useState(false);

  const activeFile = openFiles.find(f => (f.repoFullName + '::' + f.path) === activeFileKey);
  const currentBranch = activeFile ? currentBranchByRepo[activeFile.repoFullName] : null;
  const branches = activeFile ? branchesByRepo[activeFile.repoFullName] || [] : [];

  const handleTokenSubmit = useCallback(async (credentials: { githubToken: string; geminiKey?: string }) => {
    if (!credentials.githubToken) return;
    if (credentials.geminiKey) setGeminiApiKey(credentials.geminiKey);
    setToken(credentials.githubToken);
    setIsLoading(true);
    setLoadingMessage('Fetching repositories...');
    try {
      const repos: GithubRepo[] = await fetchAllRepos(credentials.githubToken);
      const newFileTree: UnifiedFileTree = {};
      const repoPromises = repos.map(async (repo) => {
        try {
          newFileTree[repo.full_name] = { repo, tree: [] };
          const tree = await fetchRepoTree(credentials.githubToken, repo.owner.login, repo.name, repo.default_branch);
          newFileTree[repo.full_name].tree = tree;
          const repoBranches = await getRepoBranches(credentials.githubToken, repo.owner.login, repo.name);
          setBranchesByRepo(prev => ({ ...prev, [repo.full_name]: repoBranches }));
          setCurrentBranchByRepo(prev => ({ ...prev, [repo.full_name]: repo.default_branch }));
        } catch (e) {
          console.error(`Failed to fetch tree for ${repo.full_name}`, e);
        }
      });
      await Promise.all(repoPromises);
      setFileTree(newFileTree);
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Failed to load repositories. Check your token.' });
      setToken(null);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleFileSelect = async (repoFullName: string, path: string) => {
    const fileKey = repoFullName + '::' + path;
    const existingFile = openFiles.find(f => (f.repoFullName + '::' + f.path) === fileKey);
    if (existingFile) { setActiveFileKey(fileKey); return; }
    if (!token) return;
    setIsLoading(true);
    setLoadingMessage(`Opening ${path}...`);
    try {
        const repo = fileTree[repoFullName]?.repo;
        if (!repo) throw new Error("Repo not found");
        const branch = currentBranchByRepo[repoFullName] || repo.default_branch;
        const { content, sha } = await getFileContent(token, repo.owner.login, repo.name, path, branch);
        const newFile: SelectedFile = { repoFullName, path, content, editedContent: content, sha, defaultBranch: repo.default_branch };
        setOpenFiles(prev => [...prev, newFile]);
        setActiveFileKey(fileKey);
    } catch (error) {
        setAlert({ type: 'error', message: `Failed to open file: ${path}` });
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };

  const handleCloseFile = (fileKey: string) => {
    setOpenFiles(prev => prev.filter(f => (f.repoFullName + '::' + f.path) !== fileKey));
    if (activeFileKey === fileKey) setActiveFileKey(null);
  };

  const handleFileContentChange = (fileKey: string, newContent: string) => {
    setOpenFiles(prev => prev.map(f => {
      if ((f.repoFullName + '::' + f.path) === fileKey) return { ...f, editedContent: newContent };
      return f;
    }));
  };

  const handleSetActiveFile = (fileKey: string) => setActiveFileKey(fileKey);

  const handleCommit = async (commitMessage: string) => {
    if (!activeFile || !token) return;
    setIsLoading(true);
    setLoadingMessage('Committing changes...');
    try {
        const [owner, repoName] = activeFile.repoFullName.split('/');
        const branch = currentBranchByRepo[activeFile.repoFullName] || activeFile.defaultBranch;
        const newSha = await commitFile({ token, owner, repo: repoName, branch, path: activeFile.path, content: activeFile.editedContent, message: commitMessage, sha: activeFile.sha });
        setOpenFiles(prev => prev.map(f => {
            if ((f.repoFullName + '::' + f.path) === activeFileKey) return { ...f, content: f.editedContent, sha: newSha };
            return f;
        }));
        setAlert({ type: 'success', message: 'Changes committed successfully!' });
    } catch (error) {
        setAlert({ type: 'error', message: 'Failed to commit changes.' });
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };

  const handleBranchChange = async (newBranch: string) => {
      if (!activeFile || !token) return;
      const repoFullName = activeFile.repoFullName;
      setCurrentBranchByRepo(prev => ({ ...prev, [repoFullName]: newBranch }));
      setIsLoading(true);
      try {
          const [owner, repoName] = repoFullName.split('/');
          const { content, sha } = await getFileContent(token, owner, repoName, activeFile.path, newBranch);
           setOpenFiles(prev => prev.map(f => {
            if ((f.repoFullName + '::' + f.path) === activeFileKey) return { ...f, content, editedContent: content, sha };
            return f;
        }));
        const tree = await fetchRepoTree(token, owner, repoName, newBranch);
        setFileTree(prev => ({ ...prev, [repoFullName]: { ...prev[repoFullName], tree } }));
      } catch (e) {
          setAlert({ type: 'error', message: "Failed to switch branch/reload file."});
      } finally {
          setIsLoading(false);
      }
  };

  const handleCreateBranch = async (newBranchName: string) => {
      if (!activeFile || !token) return;
      setIsLoading(true);
      try {
          const [owner, repoName] = activeFile.repoFullName.split('/');
          const currentBranchName = currentBranchByRepo[activeFile.repoFullName] || activeFile.defaultBranch;
          const branchData = await getRepoBranches(token, owner, repoName);
          const currentBranchData = branchData.find(b => b.name === currentBranchName);
          if (!currentBranchData) throw new Error("Could not find current branch tip SHA");
          await createBranch(token, owner, repoName, newBranchName, currentBranchData.commit.sha);
          const newBranches = await getRepoBranches(token, owner, repoName);
          setBranchesByRepo(prev => ({...prev, [activeFile.repoFullName]: newBranches}));
          handleBranchChange(newBranchName);
          setAlert({ type: 'success', message: `Branch ${newBranchName} created and active.`});
      } catch (e) {
          setAlert({ type: 'error', message: 'Failed to create branch.' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleCreatePullRequest = async (title: string, body: string) => {
      if (!activeFile || !token) return;
      setIsLoading(true);
      try {
          const [owner, repoName] = activeFile.repoFullName.split('/');
          const head = currentBranchByRepo[activeFile.repoFullName];
          const base = activeFile.defaultBranch;
          const pr = await createPullRequest({ token, owner, repo: repoName, title, body, head, base });
          setAlert({ type: 'success', message: `Pull Request #${pr.number} created: ${pr.html_url}` });
      } catch (e) {
           setAlert({ type: 'error', message: 'Failed to create Pull Request.' });
      } finally {
          setIsLoading(false);
      }
  };

  const toggleFileSelection = (fileKey: string, isSelected: boolean) => {
      const newSelection = new Set(selectedFiles);
      if (isSelected) newSelection.add(fileKey); else newSelection.delete(fileKey);
      setSelectedFiles(newSelection);
  };

  const toggleDirectorySelection = (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => {
      const paths = getAllFilePaths(nodes);
      const newSelection = new Set(selectedFiles);
      paths.forEach(p => {
          const key = `${repoFullName}::${p}`;
          if (shouldSelect) newSelection.add(key); else newSelection.delete(key);
      });
      setSelectedFiles(newSelection);
  };

  const handleStartBulkEdit = () => {
      if (selectedFiles.size === 0) return;
      setMultiEditModalOpen(true);
  };

  const handleBulkEditSubmit = async (instruction: string) => {
      setMultiEditModalOpen(false);
      setIsBulkEditing(true);
      const jobs: BulkEditJob[] = Array.from(selectedFiles).map((key: string) => {
          const [repoFullName, ...pathParts] = key.split('::');
          return { id: key, repoFullName, path: pathParts.join('::'), status: 'queued', content: '', error: null };
      });
      setBulkEditJobs(jobs);

      const processJob = async (job: BulkEditJob) => {
         if (!token) return;
         setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'planning' } : j));
         try {
             const [owner, repo] = job.repoFullName.split('/');
             const { content: originalContent, sha } = await getFileContent(token, owner, repo, job.path, currentBranchByRepo[job.repoFullName]);
             const finalContent = await bulkEditFileWithAI(
                 originalContent,
                 instruction,
                 job.path,
                 (checkpoints, currentContent) => {
                     setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { 
                         ...j, 
                         status: 'processing',
                         checkpoints, 
                         content: currentContent,
                         currentCheckpointId: checkpoints.find(c => c.status === 'active')?.id || j.currentCheckpointId
                     } : j));
                 },
                 "gemini-3-flash-preview" // Faster model for execution
             );
             await commitFile({ token, owner, repo, branch: currentBranchByRepo[job.repoFullName] || 'main', path: job.path, content: finalContent, message: `AI Iterative Edit: ${instruction.slice(0, 50)}...`, sha });
             setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'success' } : j));
         } catch (e: any) {
             setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'failed', error: e.message } : j));
         }
      };

      const CONCURRENCY = 5; // Aggressive concurrency
      let currentIndex = 0;
      const runNext = () => {
          if (currentIndex >= jobs.length) return;
          const job = jobs[currentIndex++];
          processJob(job).finally(() => runNext());
      };
      for (let i = 0; i < Math.min(CONCURRENCY, jobs.length); i++) runNext();
  };

  const handleStartNewProject = () => setNewProjectModalOpen(true);

  const handleProjectGenerationSubmit = async (repoName: string, prompt: string, isPrivate: boolean) => {
      if (!token) return;
      setNewProjectModalOpen(false);
      setIsGeneratingProject(true);
      setProjectGenerationStatus('Initializing repository...');
      setProjectGenerationJobs([]);
      try {
          const repo = await createRepo({ token, name: repoName, description: `AI Generated: ${prompt.slice(0, 50)}...`, isPrivate });
          setProjectGenerationStatus(`Repository ${repo.full_name} created. Planning structure...`);
          const plan = await generateProjectPlan(prompt, "gemini-3-flash-preview");
          
          const jobs: ProjectGenerationJob[] = plan.files.map(f => ({ id: f.path, path: f.path, description: f.description, status: 'queued', content: '', error: null }));
          setProjectGenerationJobs(jobs);
          setProjectGenerationStatus('Generating files...');
          
           const processJob = async (job: ProjectGenerationJob) => {
                setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'generating' } : j));
                let finalContent = '';
                try {
                     await generateFileContent(prompt, job.path, job.description, (chunk) => {
                             finalContent += chunk;
                             setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, content: finalContent } : j));
                         }, () => finalContent, "gemini-3-flash-preview" );
                     
                     const cleanedContent = cleanAiCodeResponse(finalContent);
                     setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'committing' } : j));
                     await commitFile({ token, owner: repo.owner.login, repo: repo.name, branch: repo.default_branch, path: job.path, content: cleanedContent, message: `AI Create: ${job.path}` });
                     setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'success' } : j));
                } catch (e: any) {
                    setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'failed', error: e.message } : j));
                }
           };
            const CONCURRENCY = 8;
            let currentIndex = 0;
            const runNext = () => { if (currentIndex >= jobs.length) return; const job = jobs[currentIndex++]; processJob(job).finally(() => runNext()); };
            for (let i = 0; i < Math.min(CONCURRENCY, jobs.length); i++) runNext();
      } catch (error: any) { setProjectGenerationStatus(`Error: ${error.message}`); }
  };

  const handleStartProjectExpansion = () => setExpansionModalOpen(true);

  const handleExpansionSubmit = async (prompt: string) => {
      setExpansionModalOpen(false);
      setIsExpandingProject(true);
      setExpansionPhase('planning');
      setExpansionJobs([]);
      if (!token || selectedFiles.size !== 1) { setAlert({ type: 'error', message: 'Please select exactly one seed file.' }); setIsExpandingProject(false); return; }
      const seedFileKey = Array.from(selectedFiles)[0] as string;
      const [repoFullName, ...pathParts] = seedFileKey.split('::');
      const seedFilePath = pathParts.join('::');
      const [owner, repo] = repoFullName.split('/');
      try {
          const { content: seedContent } = await getFileContent(token, owner, repo, seedFilePath, currentBranchByRepo[repoFullName]);
          const plan = await planProjectExpansionEdits([{ path: seedFilePath, content: seedContent }], prompt, "gemini-3-flash-preview");
          
          const jobs: ProjectExpansionJob[] = plan.filesToCreate.map(f => ({ id: f.path, path: f.path, type: 'create', description: f.description, agentIndex: f.agentIndex, status: 'queued', content: '', error: null }));
          setExpansionJobs(jobs);
          setExpansionPhase('generating');
           const processJob = async (job: ProjectExpansionJob) => {
                setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'generating' } : j));
                let finalContent = '';
                try {
                     await generateFileContent(prompt, job.path, job.description, (chunk) => {
                             finalContent += chunk;
                             setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, content: finalContent } : j));
                         }, () => finalContent, "gemini-3-flash-preview" );
                     const cleanedContent = cleanAiCodeResponse(finalContent);
                     setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'committing' } : j));
                     await commitFile({ token: token!, owner, repo, branch: currentBranchByRepo[repoFullName] || 'main', path: job.path, content: cleanedContent, message: `AI Expansion: ${job.path}` });
                     setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'success' } : j));
                } catch (e: any) {
                    setExpansionJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'failed', error: e.message } : j));
                }
           };
            const CONCURRENCY = 10;
            let currentIndex = 0;
            const runNext = () => { if (currentIndex >= jobs.length) return; const job = jobs[currentIndex++]; processJob(job).finally(() => runNext()); };
            for (let i = 0; i < Math.min(CONCURRENCY, jobs.length); i++) runNext();
            const checkCompletion = setInterval(() => {
                const pending = jobs.filter(j => ['queued', 'generating', 'committing', 'retrying'].includes(j.status)).length;
                if (pending === 0 && currentIndex >= jobs.length) { setExpansionPhase('complete'); clearInterval(checkCompletion); }
            }, 1000);
      } catch (error: any) {
          setAlert({ type: 'error', message: `Expansion failed: ${error.message}` });
          setExpansionPhase('complete');
      }
  };

  const handleStartAdvancedEdit = () => setAdvancedEditModalOpen(true);

  const handleAdvancedEditSubmit = async (instruction: string, workflowId: string) => {
      setAdvancedEditModalOpen(false);
      setIsAdvancedEditing(true);
      setAdvancedEditPhase('analyzing');
      setAdvancedEditJobs([]);
      setVerificationAttempt(1);
      setAdvancedEditBuildLogs(null);
      setWorkflowRunUrl(null);
      setAiThought(null);
      setDeploymentUrl(null);
      if (!token || !activeFile) return;
      const [owner, repo] = activeFile.repoFullName.split('/');
      const branch = currentBranchByRepo[activeFile.repoFullName] || activeFile.defaultBranch;
      const getRepositoryContext = async () => openFiles.map(f => ({ path: f.path, content: f.content, sha: f.sha }));
      try {
          let currentFiles = await getRepositoryContext();
          let currentPhaseInstruction = instruction;
          let attempt = 1;
          const MAX_ATTEMPTS = 3;
          while (attempt <= MAX_ATTEMPTS) {
              setVerificationAttempt(attempt);
              if (attempt === 1) setAdvancedEditPhase('planning'); else setAdvancedEditPhase('analyzing_failure');
              const plan = attempt === 1 
                ? await planRepositoryEdit(currentPhaseInstruction, activeFile.path, currentFiles, "gemini-3-flash-preview")
                : await correctCodeFromBuildError(instruction, currentFiles, [], advancedEditBuildLogs || '', "gemini-3-flash-preview");
              
              if (!plan) throw new Error("Failed to generate edit plan.");
              setAiThought(plan.reasoning);
              const jobs: AdvancedEditJob[] = plan.filesToEdit.map(f => ({ id: f.path, path: f.path, status: 'planning', content: '', error: null }));
              setAdvancedEditJobs(jobs);
              setAdvancedEditPhase('editing');
              for (const fileEdit of plan.filesToEdit) {
                  const jobIndex = jobs.findIndex(j => j.path === fileEdit.path);
                  if (jobIndex === -1) continue;
                  setAdvancedEditJobs(prev => prev.map((j, i) => i === jobIndex ? { ...j, status: 'editing' } : j));
                  let originalContent = currentFiles.find(f => f.path === fileEdit.path)?.content || '';
                  if (!originalContent) { try { const f = await getFileContent(token, owner, repo, fileEdit.path, branch); originalContent = f.content; } catch (e) { } }
                  const finalContent = await streamRepositoryFileEdit(originalContent, fileEdit.changes, fileEdit.path, (checkpoints, currentContent) => {
                      setAdvancedEditJobs(prev => prev.map((j, i) => i === jobIndex ? { 
                          ...j, 
                          checkpoints, 
                          content: currentContent,
                          currentCheckpointId: checkpoints.find(c => c.status === 'active')?.id || j.currentCheckpointId
                      } : j));
                  }, "gemini-3-flash-preview");
                  setAdvancedEditPhase('committing');
                  setAdvancedEditJobs(prev => prev.map((j, i) => i === jobIndex ? { ...j, status: 'committing' } : j));
                   await commitFile({ token, owner, repo, branch, path: fileEdit.path, content: finalContent, message: `AI Advanced Edit (Attempt ${attempt}): ${fileEdit.path}`, sha: currentFiles.find(f => f.path === fileEdit.path)?.sha });
                  setAdvancedEditJobs(prev => prev.map((j, i) => i === jobIndex ? { ...j, status: 'success' } : j));
              }
              setAdvancedEditPhase('triggering_workflow');
              await triggerWorkflow(token, owner, repo, workflowId, branch);
              setAdvancedEditPhase('waiting_for_workflow');
              await new Promise(r => setTimeout(r, 5000));
              let run: WorkflowRun | null = null;
              while (true) {
                  const runs = await getWorkflowRuns(token, owner, repo, workflowId, branch);
                  if (runs.workflow_runs.length > 0) { run = runs.workflow_runs[0]; setWorkflowRunUrl(run.html_url); if (run.status === 'completed') break; }
                  await new Promise(r => setTimeout(r, 5000));
              }
              if (run && run.conclusion === 'success') { setAdvancedEditPhase('complete'); setDeploymentUrl(`https://${owner}.github.io/${repo}/`); return; } else {
                  setAdvancedEditPhase('analyzing_failure');
                  const logs = await getWorkflowRunLogs(token, owner, repo, run!.id);
                  setAdvancedEditBuildLogs(logs);
                  attempt++;
              }
          }
          setAlert({ type: 'error', message: 'Max verification attempts reached. Build still failing.' });
          setAdvancedEditPhase('complete');
      } catch (error: any) {
          setAlert({ type: 'error', message: `Advanced edit failed: ${error.message}` });
          setAdvancedEditPhase('complete');
      }
  };

  const handleStartSimpleAiEdit = () => setAiChatModalOpen(true);
  
  const handleSimpleAiEditSubmit = async (instruction: string) => {
      setAiChatModalOpen(false);
      if (!activeFile || !token) return;
      const fileKey = activeFileKey!;
      try {
          const finalContent = await streamSingleFileEdit(
              activeFile.editedContent, 
              instruction, 
              activeFile.path, 
              (checkpoints, currentContent) => {
                  handleFileContentChange(fileKey, currentContent);
              },
              "gemini-3-flash-preview"
          );
          handleFileContentChange(fileKey, finalContent);
      } catch (e) {
          setAlert({ type: 'error', message: "AI Edit failed."});
      }
  };

  if (!token) return <AuthModal onSubmit={handleTokenSubmit} isLoading={isLoading} />;

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200 font-sans">
      <div className="w-80 border-r border-gray-700 flex flex-col">
        <FileExplorer fileTree={fileTree} onFileSelect={handleFileSelect} onStartMultiEdit={handleStartBulkEdit} onStartNewProject={handleStartNewProject} onStartProjectExpansion={handleStartProjectExpansion} selectedFilePath={activeFile?.path} selectedRepo={activeFile?.repoFullName} selectedFiles={selectedFiles} onFileSelection={toggleFileSelection} onDirectorySelection={toggleDirectorySelection} />
      </div>
      <div className="flex-grow flex flex-col relative">
        <EditorCanvas openFiles={openFiles} activeFile={activeFile || null} onCommit={handleCommit} onAdvancedAiEdit={handleStartAdvancedEdit} onSimpleAiEditRequest={handleStartSimpleAiEdit} onFileContentChange={handleFileContentChange} onCloseFile={handleCloseFile} onSetActiveFile={handleSetActiveFile} isLoading={isLoading} branches={branches} currentBranch={currentBranch} onBranchChange={handleBranchChange} onCreateBranch={handleCreateBranch} onCreatePullRequest={handleCreatePullRequest} />
        {isLoading && loadingMessage && (
            <div className="absolute inset-0 bg-gray-950 bg-opacity-50 flex items-center justify-center z-20">
                <div className="bg-gray-850 p-4 rounded-lg shadow-lg flex items-center gap-3 border border-gray-700">
                    <Spinner />
                    <span>{loadingMessage}</span>
                </div>
            </div>
        )}
      </div>
      <AlertPopup alert={alert} onClose={() => setAlert(null)} />
      {isMultiEditModalOpen && <MultiFileAiEditModal fileCount={selectedFiles.size} onClose={() => setMultiEditModalOpen(false)} onSubmit={handleBulkEditSubmit} />}
      {isBulkEditing && <BulkEditProgress jobs={bulkEditJobs} onClose={() => setIsBulkEditing(false)} isComplete={bulkEditJobs.every(j => ['success', 'failed', 'skipped'].includes(j.status))} />}
      {isNewProjectModalOpen && <NewProjectModal onClose={() => setNewProjectModalOpen(false)} onSubmit={handleProjectGenerationSubmit} />}
      {isGeneratingProject && <ProjectGenerationProgress jobs={projectGenerationJobs} statusMessage={projectGenerationStatus} onClose={() => setIsGeneratingProject(false)} isComplete={projectGenerationJobs.length > 0 && projectGenerationJobs.every(j => ['success', 'failed'].includes(j.status))} />}
      {isExpansionModalOpen && <ProjectExpansionModal onClose={() => setExpansionModalOpen(false)} onSubmit={handleExpansionSubmit} />}
      {isExpandingProject && <ProjectExpansionProgress jobs={expansionJobs} phase={expansionPhase} onClose={() => setIsExpandingProject(false)} isComplete={expansionPhase === 'complete'} />}
      {isAdvancedEditModalOpen && activeFile && <AdvancedAiEditModal onClose={() => setAdvancedEditModalOpen(false)} onSubmit={handleAdvancedEditSubmit} token={token} repoFullName={activeFile.repoFullName} />}
      {isAdvancedEditing && <AdvancedEditProgress jobs={advancedEditJobs} phase={advancedEditPhase} verificationAttempt={verificationAttempt} buildLogs={advancedEditBuildLogs} workflowRunUrl={workflowRunUrl} aiThought={aiThought} deploymentUrl={deploymentUrl} onClose={() => setIsAdvancedEditing(false)} isComplete={advancedEditPhase === 'complete'} />}
      {isAiChatModalOpen && <AiChatModal onClose={() => setAiChatModalOpen(false)} onSubmit={handleSimpleAiEditSubmit} />}
    </div>
  );
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/book-writer-think-As-for-everyone | ORIGINAL PATH: diplomat-bit-book-writer-think-As-for-everyone-3ab455c/App.tsx
================================================================================


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FloatingMenu } from './components/FloatingMenu';
import { transformText, chatWithArchitect } from './services/geminiService';
import { FileText, Send, MessageSquare, X, ChevronRight, Briefcase, User, Info, Printer } from 'lucide-react';

const STORAGE_KEY = 'notepad_storage_v1';
const INITIAL_TEXT = `The Iron Vault of Midas was a structure that shouldn't exist—a cathedral of capital carved from the very bedrock of the global economy. Kai stood before the Grand Chancellor, a man whose eyes were cold as coin and sharp as industrial diamonds.

'We have a void in our architecture,' the Chancellor whispered, the sound echoing through the gilded chamber. 'A leak in the soul of the bank. Build us a bridge over the Zero-Sum Abyss, Kai. Build us the Aethelred Network—an unbreakable bastion of logic—or see your entire lineage erased from the ledgers of time. We do not negotiate with entropy.'

Kai retreated to his sanctuary, the weight of the world's wealth crushing his spirit. Sleep was his only escape, but it offered no peace. It was a revelation. 

In a fever dream of liquid gold and screaming binary, the solution crystallized. He saw the code—not as characters on a screen, but as a living, breathing god. A hundred adversaries rose to challenge him in the digital arena, their voices a choir of dissent and chaos. 

'I will build it,' Kai screamed into the void of his own subconscious. 'I will build the vault that holds the soul of the machine.'

When he woke, the mechanical box from his grandfather sat on the desk, glowing with a soft, predatory amber light. The 'right kind of thought' was no longer a mystery. It was a challenge from the shadows of high finance, forged in a dream, and destined to rewrite the future of every living creature on the planet. 

He pulled his keyboard closer, the clack of the mechanical keys a sharp counterpoint to the silence of the Iron Vault. A blank terminal stared back at him. With a few swift strokes, a new directory was born: /ai/bank/midas-prime/genesis. 

It was a promise of epic ruin and divine rebirth.`;

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const App: React.FC = () => {
  const [content, setContent] = useState<string>(INITIAL_TEXT);
  const [selection, setSelection] = useState<string>("");
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [lineCount, setLineCount] = useState(1);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const lastRange = useRef<Range | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContent(saved);
      if (editorRef.current) {
        editorRef.current.innerHTML = saved;
      }
    } else {
      setContent(INITIAL_TEXT);
      if (editorRef.current) {
        editorRef.current.innerText = INITIAL_TEXT;
      }
    }
  }, []);

  useEffect(() => {
    updateLineCount();
  }, [content]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateLineCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      const lines = text.split('\n');
      setLineCount(Math.max(1, lines.length));
    }
  };

  const saveContent = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      localStorage.setItem(STORAGE_KEY, newContent);
      setContent(newContent);
      updateLineCount();
    }
  }, []);

  const handleExport = () => {
    window.print();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    sel.removeAllRanges();
    sel.addRange(range);
    saveContent();
  };

  const handleMouseUp = useCallback(() => {
    setTimeout(() => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && sel.toString().trim().length > 0) {
        const range = sel.getRangeAt(0);
        if (editorRef.current?.contains(range.commonAncestorContainer)) {
          const rect = range.getBoundingClientRect();
          lastRange.current = range.cloneRange();
          setSelection(sel.toString());
          setMenuPos({ x: rect.left + rect.width / 2, y: rect.top });
        }
      } else {
        setMenuPos(null);
        setSelection("");
      }
    }, 10);
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isProcessing) return;
    
    const userMsg = chatInput;
    setChatInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsProcessing(true);

    try {
      const currentFullText = editorRef.current?.innerText || "";
      const result = await chatWithArchitect(currentFullText, userMsg, messages);
      
      setMessages(prev => [...prev, { role: 'bot', text: result.reply }]);
      
      if (result.updatedDoc && result.updatedDoc !== "UNCHANGED") {
        if (editorRef.current) {
          editorRef.current.innerText = result.updatedDoc;
          saveContent();
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Service temporary unavailable. Please verify network credentials." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAIAction = async (action: string) => {
    if (isProcessing || !selection || !lastRange.current) return;

    if (action === 'STYLIZED') {
      const span = document.createElement('span');
      span.className = 'epic-script';
      span.textContent = selection;
      lastRange.current.deleteContents();
      lastRange.current.insertNode(span);
      saveContent();
      setMenuPos(null);
      return;
    }

    setIsProcessing(true);
    setMenuPos(null);

    try {
      const fullText = editorRef.current?.innerText || "";
      const result = await transformText(fullText, selection, action);
      if (result && lastRange.current) {
        lastRange.current.deleteContents();
        const textNode = document.createTextNode(result);
        lastRange.current.insertNode(textNode);
        saveContent();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      setSelection("");
    }
  };

  return (
    <div className="flex h-screen bg-[#050a14] font-ui text-slate-300 overflow-hidden">
      {/* Sidebar Chat */}
      <div className={`no-print transition-all duration-500 bg-[#0a1120] border-r border-slate-800 flex flex-col shadow-2xl ${isChatOpen ? 'w-96' : 'w-0 overflow-hidden'}`}>
        <div className="p-5 bg-[#0f172a] border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Briefcase size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">AI Architect</h2>
              <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest">Enterprise Edition</p>
            </div>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded"><X size={18} /></button>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <div className="flex gap-3 p-4 bg-blue-950/20 border border-blue-900/30 rounded-lg">
            <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-blue-200/80">
              Operational Interface active. Issue directives or apply styles via selection.
            </p>
          </div>
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-xl text-[12px] leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none border border-blue-500' 
                  : 'bg-[#1e293b] text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {msg.text}
              </div>
              <div className="flex items-center gap-2 mt-2 px-1">
                {msg.role === 'bot' ? <Briefcase size={10} className="text-blue-500" /> : <User size={10} className="text-slate-500" />}
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                  {msg.role === 'user' ? 'Client' : 'Architect'}
                </span>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3 text-blue-500 text-[11px] font-bold tracking-widest px-1">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
              PROCESSING DIRECTIVE...
            </div>
          )}
          <div ref={scrollAnchorRef} />
        </div>

        <form onSubmit={handleChatSubmit} className="p-6 border-t border-slate-800 bg-[#0f172a] shrink-0">
          <div className="relative group">
            <input 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Send instruction..."
              className="w-full bg-[#050a14] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-12"
              disabled={isProcessing}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 h-9 w-9 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-all disabled:opacity-30"
              disabled={isProcessing}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 relative flex flex-col bg-[#050a14] min-w-0 p-6 md:p-10">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="no-print fixed top-8 left-8 z-50 bg-blue-600 p-4 rounded-xl text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <MessageSquare size={22} />
          </button>
        )}

        <header className="mb-8 flex justify-between items-end shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em]">Encrypted Session</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tighter">Aethelgard Codex <span className="text-slate-600 font-light">| v3.1</span></h1>
          </div>
          
          <button 
            onClick={handleExport} 
            className="no-print flex items-center gap-3 bg-white text-slate-900 hover:bg-slate-100 transition-all text-[11px] font-bold uppercase px-6 py-3 rounded-lg shadow-xl border border-white"
          >
            <Printer size={16} />
            <span>Epic Export</span>
          </button>
        </header>

        {/* Editor Wrapper with fixed height to allow scrolling */}
        <div className="flex-1 relative min-h-0 min-w-0">
          <div className="h-full premium-container flex custom-scrollbar">
            {/* Line Numbers column */}
            <div className="no-print line-numbers pt-[10px] w-14 flex-shrink-0">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="leading-[1.7] h-[22.1pt] flex items-center justify-end px-3">{i + 1}</div>
              ))}
            </div>

            {/* Editable Content */}
            <div className="flex-1 relative min-w-0 bg-white min-h-full">
              <div 
                ref={editorRef}
                contentEditable
                onInput={saveContent}
                onPaste={handlePaste}
                onMouseUp={handleMouseUp}
                className="font-readable w-full outline-none relative z-10 min-h-full py-[10px]"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
        
        <footer className="mt-4 flex justify-between items-center px-2 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Words</span>
              <span className="text-xs text-slate-300 font-mono">{(editorRef.current?.innerText.match(/\S+/g) || []).length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Lines</span>
              <span className="text-xs text-slate-300 font-mono">{lineCount}</span>
            </div>
          </div>
          <p className="text-[9px] text-slate-600 font-medium uppercase tracking-widest">© 2025 Aethelgard Financial Systems</p>
        </footer>
      </div>

      <FloatingMenu selection={selection} onAction={handleAIAction} position={menuPos} />
    </div>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprises | ORIGINAL PATH: diplomat-bit-ci-connect-enterprises-4cf6219/App.tsx
================================================================================


import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
// fix: Ensured all v6 exports are explicitly listed to resolve missing member errors
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  Bell, LogOut, Activity, ChevronRight, Cpu, Settings as SettingsIcon, Terminal, Loader2, Key,
  ShieldCheck, Zap, ArrowRight, ShieldAlert, Globe, Lock, Database, Shield, ZapOff, Fingerprint, Code,
  Server, Layers, Network, BookOpen, MessageSquare, Briefcase, Landmark, Star, Crown, Info, X, 
  Command, HelpCircle, Keyboard, User
} from 'lucide-react';
import { routes } from './views/routes';
import Login from './views/Login';
import Landing from './views/Landing';
import PrivacyPolicy from './views/PrivacyPolicy';
import Documentation from './views/Documentation';
import Airdrop from './views/Airdrop';
import TechnicalDeepDive from './views/TechnicalDeepDive';
// fix: Imported LineItems view which was missing from App.tsx imports
import LineItems from './views/LineItems';
import { apiClient } from './services/api';
import { UserSession } from './types/index';
import NeuralBackground from './components/NeuralBackground';
import VoiceConcierge from './components/VoiceConcierge';

type AppTier = 'STANDARD' | 'ENTERPRISE';

interface AppState {
  tier: AppTier;
  setTier: (tier: AppTier) => void;
}

const AppContext = createContext<AppState>({ tier: 'STANDARD', setTier: () => {} });
export const useAppTier = () => useContext(AppContext);

const SidebarItem: React.FC<{ icon: any, label: string, path: string, active: boolean, restricted?: boolean }> = ({ icon: Icon, label, path, active, restricted }) => {
  const { tier } = useAppTier();
  const isLocked = restricted && tier === 'STANDARD';

  return (
    <Link 
      to={isLocked ? '#' : path}
      className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
        active 
          ? 'bg-white/10 text-white shadow-2xl' 
          : 'text-zinc-500 hover:bg-white/5 hover:text-white'
      } ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} className={active ? 'text-blue-500' : 'text-zinc-600 group-hover:text-blue-400 transition-colors'} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {isLocked && <Lock size={12} className="text-zinc-600" />}
      {active && !isLocked && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>}
    </Link>
  );
};

const HelpOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 animate-in fade-in duration-300">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <HelpCircle size={240} className="text-blue-500" />
        </div>
        
        <div className="relative z-10 space-y-12">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                <Keyboard size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">System <span className="text-blue-500 not-italic">Help</span></h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Protocol Command Interface</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 text-zinc-600 hover:text-white bg-zinc-900 rounded-2xl transition-colors"><X size={24} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Hotkeys</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-black border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Show Help</span>
                  <div className="flex gap-2">
                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-white font-mono text-xs">H</kbd>
                    <span className="text-zinc-600 font-black">+</span>
                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-white font-mono text-xs">Enter</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-black border border-zinc-800 rounded-2xl opacity-50">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fast Sync</span>
                  <kbd className="px-2 py-1 bg-zinc-800 rounded text-white font-mono text-xs">S</kbd>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">System Status</h4>
              <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Parity: 100%</span>
                </div>
                <p className="text-[9px] text-zinc-600 font-mono leading-relaxed">
                  GATEWAY: GLOBAL_MESH_01<br />
                  AUTH: RSA-OAEP-4096<br />
                  CLIENT: LUMINA_NEXUS_v1.4
                </p>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-zinc-200 shadow-2xl">
            Resume Operations
          </button>
        </div>
      </div>
    </div>
  );
};

const PrivateTerminal = ({ user, onLogout }: { user: UserSession, onLogout: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tier } = useAppTier();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        lastKeyRef.current = 'h';
      } else if (e.key === 'Enter' && lastKeyRef.current === 'h') {
        setIsHelpOpen(true);
        lastKeyRef.current = null;
      } else {
        lastKeyRef.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTerminate = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen text-zinc-400 antialiased font-sans relative">
      <NeuralBackground />
      <VoiceConcierge />
      <HelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      <aside className="w-80 fixed h-full bg-black/40 backdrop-blur-3xl border-r border-white/5 p-8 flex flex-col z-50">
        <div className="mb-14 px-4 flex flex-col gap-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
              <Landmark size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black italic tracking-tighter text-white uppercase leading-none">
                Nexus <span className="text-blue-500 not-italic">Core</span>
              </h1>
              <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-600 mt-1">Institutional Mesh</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border flex items-center justify-between ${tier === 'ENTERPRISE' ? 'bg-blue-600/10 border-blue-500/30' : 'bg-zinc-900/50 border-zinc-800'}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <User size={14} className="text-zinc-500 shrink-0" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest truncate">{user.name}</span>
            </div>
            <button onClick={handleTerminate} className="text-zinc-600 hover:text-rose-500 transition-colors ml-2">
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 custom-scrollbar overflow-y-auto pr-2">
          {routes.filter(r => r.showInSidebar).map(route => (
            <SidebarItem 
              key={route.path}
              icon={route.icon}
              label={route.label}
              path={route.path}
              active={location.pathname === route.path}
              restricted={route.category === 'intelligence' || route.category === 'system' || route.category === 'registry'}
            />
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
          <Link to="/settings" className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${location.pathname === '/settings' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>
            <SettingsIcon size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
          </Link>
          <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
            <div className="flex items-center gap-3 mb-3">
              <Activity size={14} className="text-blue-500" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Node Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600">
                <span>Parity</span>
                <span className="text-emerald-500">100%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 shadow-[0_0_8px_#3b82f6]" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-80 p-12 relative z-10 overflow-x-hidden">
        <header className="flex justify-between items-center mb-16">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Nexus_OS v1.4.2</p>
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
              {routes.find(r => r.path === location.pathname)?.label || 'System Core'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Node: {user.id}</span>
             </div>
             <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]"></span>
             </button>
          </div>
        </header>

        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={<route.component />} />
          ))}
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/line-items/:type/:id" element={<LineItems />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<AppTier>('STANDARD');

  const checkAuth = useCallback(async () => {
    try {
      const { isAuthenticated, user: sessionUser } = await apiClient.auth.me();
      if (isAuthenticated && sessionUser) {
        setUser(sessionUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener('auth-update', checkAuth);
    return () => window.removeEventListener('auth-update', checkAuth);
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={40} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ tier, setTier }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/overview" replace /> : <Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/airdrop" element={<Airdrop />} />
          <Route path="/protocol/:slug" element={<TechnicalDeepDive />} />
          <Route path="/institutional/:slug" element={<TechnicalDeepDive />} />
          <Route path="/intelligence/:slug" element={<TechnicalDeepDive />} />
          <Route path="/network/:slug" element={<TechnicalDeepDive />} />
          <Route path="*" element={user ? <PrivateTerminal user={user} onLogout={apiClient.auth.logout} /> : <Landing />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/App.tsx
================================================================================


import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
// fix: Ensured all v6 exports are explicitly listed to resolve missing member errors
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  Bell, LogOut, Activity, ChevronRight, Cpu, Settings as SettingsIcon, Terminal, Loader2, Key,
  ShieldCheck, Zap, ArrowRight, ShieldAlert, Globe, Lock, Database, Shield, ZapOff, Fingerprint, Code,
  Server, Layers, Network, BookOpen, MessageSquare, Briefcase, Landmark, Star, Crown, Info, X, 
  Command, HelpCircle, Keyboard, User
} from 'lucide-react';
import { routes } from './views/routes';
import Login from './views/Login';
import Landing from './views/Landing';
import PrivacyPolicy from './views/PrivacyPolicy';
import Documentation from './views/Documentation';
import Airdrop from './views/Airdrop';
import TechnicalDeepDive from './views/TechnicalDeepDive';
// fix: Imported LineItems view which was missing from App.tsx imports
import LineItems from './views/LineItems';
import { apiClient } from './services/api';
import { UserSession } from './types/index';
import NeuralBackground from './components/NeuralBackground';
import VoiceConcierge from './components/VoiceConcierge';

type AppTier = 'STANDARD' | 'ENTERPRISE';

interface AppState {
  tier: AppTier;
  setTier: (tier: AppTier) => void;
}

const AppContext = createContext<AppState>({ tier: 'STANDARD', setTier: () => {} });
export const useAppTier = () => useContext(AppContext);

const SidebarItem: React.FC<{ icon: any, label: string, path: string, active: boolean, restricted?: boolean }> = ({ icon: Icon, label, path, active, restricted }) => {
  const { tier } = useAppTier();
  const isLocked = restricted && tier === 'STANDARD';

  return (
    <Link 
      to={isLocked ? '#' : path}
      className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
        active 
          ? 'bg-white/10 text-white shadow-2xl' 
          : 'text-zinc-500 hover:bg-white/5 hover:text-white'
      } ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} className={active ? 'text-blue-500' : 'text-zinc-600 group-hover:text-blue-400 transition-colors'} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {isLocked && <Lock size={12} className="text-zinc-600" />}
      {active && !isLocked && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>}
    </Link>
  );
};

const HelpOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 animate-in fade-in duration-300">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <HelpCircle size={240} className="text-blue-500" />
        </div>
        
        <div className="relative z-10 space-y-12">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                <Keyboard size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">System <span className="text-blue-500 not-italic">Help</span></h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Protocol Command Interface</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 text-zinc-600 hover:text-white bg-zinc-900 rounded-2xl transition-colors"><X size={24} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Hotkeys</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-black border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Show Help</span>
                  <div className="flex gap-2">
                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-white font-mono text-xs">H</kbd>
                    <span className="text-zinc-600 font-black">+</span>
                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-white font-mono text-xs">Enter</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-black border border-zinc-800 rounded-2xl opacity-50">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fast Sync</span>
                  <kbd className="px-2 py-1 bg-zinc-800 rounded text-white font-mono text-xs">S</kbd>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">System Status</h4>
              <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Parity: 100%</span>
                </div>
                <p className="text-[9px] text-zinc-600 font-mono leading-relaxed">
                  GATEWAY: GLOBAL_MESH_01<br />
                  AUTH: RSA-OAEP-4096<br />
                  CLIENT: LUMINA_NEXUS_v1.4
                </p>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-zinc-200 shadow-2xl">
            Resume Operations
          </button>
        </div>
      </div>
    </div>
  );
};

const PrivateTerminal = ({ user, onLogout }: { user: UserSession, onLogout: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tier } = useAppTier();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        lastKeyRef.current = 'h';
      } else if (e.key === 'Enter' && lastKeyRef.current === 'h') {
        setIsHelpOpen(true);
        lastKeyRef.current = null;
      } else {
        lastKeyRef.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTerminate = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen text-zinc-400 antialiased font-sans relative">
      <NeuralBackground />
      <VoiceConcierge />
      <HelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      <aside className="w-80 fixed h-full bg-black/40 backdrop-blur-3xl border-r border-white/5 p-8 flex flex-col z-50">
        <div className="mb-14 px-4 flex flex-col gap-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
              <Landmark size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black italic tracking-tighter text-white uppercase leading-none">
                Nexus <span className="text-blue-500 not-italic">Core</span>
              </h1>
              <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-600 mt-1">Institutional Mesh</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border flex items-center justify-between ${tier === 'ENTERPRISE' ? 'bg-blue-600/10 border-blue-500/30' : 'bg-zinc-900/50 border-zinc-800'}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <User size={14} className="text-zinc-500 shrink-0" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest truncate">{user.name}</span>
            </div>
            <button onClick={handleTerminate} className="text-zinc-600 hover:text-rose-500 transition-colors ml-2">
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 custom-scrollbar overflow-y-auto pr-2">
          {routes.filter(r => r.showInSidebar).map(route => (
            <SidebarItem 
              key={route.path}
              icon={route.icon}
              label={route.label}
              path={route.path}
              active={location.pathname === route.path}
              restricted={route.category === 'intelligence' || route.category === 'system' || route.category === 'registry'}
            />
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
          <Link to="/settings" className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${location.pathname === '/settings' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>
            <SettingsIcon size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
          </Link>
          <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
            <div className="flex items-center gap-3 mb-3">
              <Activity size={14} className="text-blue-500" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Node Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600">
                <span>Parity</span>
                <span className="text-emerald-500">100%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 shadow-[0_0_8px_#3b82f6]" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-80 p-12 relative z-10 overflow-x-hidden">
        <header className="flex justify-between items-center mb-16">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Nexus_OS v1.4.2</p>
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
              {routes.find(r => r.path === location.pathname)?.label || 'System Core'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Node: {user.id}</span>
             </div>
             <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]"></span>
             </button>
          </div>
        </header>

        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={<route.component />} />
          ))}
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/line-items/:type/:id" element={<LineItems />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<AppTier>('STANDARD');

  const checkAuth = useCallback(async () => {
    try {
      const { isAuthenticated, user: sessionUser } = await apiClient.auth.me();
      if (isAuthenticated && sessionUser) {
        setUser(sessionUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener('auth-update', checkAuth);
    return () => window.removeEventListener('auth-update', checkAuth);
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={40} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ tier, setTier }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/overview" replace /> : <Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/airdrop" element={<Airdrop />} />
          <Route path="/protocol/:slug" element={<TechnicalDeepDive />} />
          <Route path="/institutional/:slug" element={<TechnicalDeepDive />} />
          <Route path="/intelligence/:slug" element={<TechnicalDeepDive />} />
          <Route path="/network/:slug" element={<TechnicalDeepDive />} />
          <Route path="*" element={user ? <PrivateTerminal user={user} onLogout={apiClient.auth.logout} /> : <Landing />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/App.tsx
================================================================================


import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
// fix: Ensured all v6 exports are explicitly listed to resolve missing member errors
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  Bell, LogOut, Activity, ChevronRight, Cpu, Settings as SettingsIcon, Terminal, Loader2, Key,
  ShieldCheck, Zap, ArrowRight, ShieldAlert, Globe, Lock, Database, Shield, ZapOff, Fingerprint, Code,
  Server, Layers, Network, BookOpen, MessageSquare, Briefcase, Landmark, Star, Crown, Info, X, 
  Command, HelpCircle, Keyboard, User
} from 'lucide-react';
import { routes } from './views/routes';
import Login from './views/Login';
import Landing from './views/Landing';
import PrivacyPolicy from './views/PrivacyPolicy';
import Documentation from './views/Documentation';
import Airdrop from './views/Airdrop';
import TechnicalDeepDive from './views/TechnicalDeepDive';
// fix: Imported LineItems view which was missing from App.tsx imports
import LineItems from './views/LineItems';
import { apiClient } from './services/api';
import { UserSession } from './types/index';
import NeuralBackground from './components/NeuralBackground';
import VoiceConcierge from './components/VoiceConcierge';

type AppTier = 'STANDARD' | 'ENTERPRISE';

interface AppState {
  tier: AppTier;
  setTier: (tier: AppTier) => void;
}

const AppContext = createContext<AppState>({ tier: 'STANDARD', setTier: () => {} });
export const useAppTier = () => useContext(AppContext);

const SidebarItem: React.FC<{ icon: any, label: string, path: string, active: boolean, restricted?: boolean }> = ({ icon: Icon, label, path, active, restricted }) => {
  const { tier } = useAppTier();
  const isLocked = restricted && tier === 'STANDARD';

  return (
    <Link 
      to={isLocked ? '#' : path}
      className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
        active 
          ? 'bg-white/10 text-white shadow-2xl' 
          : 'text-zinc-500 hover:bg-white/5 hover:text-white'
      } ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} className={active ? 'text-blue-500' : 'text-zinc-600 group-hover:text-blue-400 transition-colors'} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {isLocked && <Lock size={12} className="text-zinc-600" />}
      {active && !isLocked && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>}
    </Link>
  );
};

const HelpOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 animate-in fade-in duration-300">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <HelpCircle size={240} className="text-blue-500" />
        </div>
        
        <div className="relative z-10 space-y-12">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-3xl flex items-center justify-center">
                <Keyboard size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">System <span className="text-blue-500 not-italic">Help</span></h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Protocol Command Interface</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 text-zinc-600 hover:text-white bg-zinc-900 rounded-2xl transition-colors"><X size={24} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Hotkeys</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-black border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Show Help</span>
                  <div className="flex gap-2">
                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-white font-mono text-xs">H</kbd>
                    <span className="text-zinc-600 font-black">+</span>
                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-white font-mono text-xs">Enter</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-black border border-zinc-800 rounded-2xl opacity-50">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fast Sync</span>
                  <kbd className="px-2 py-1 bg-zinc-800 rounded text-white font-mono text-xs">S</kbd>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">System Status</h4>
              <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Parity: 100%</span>
                </div>
                <p className="text-[9px] text-zinc-600 font-mono leading-relaxed">
                  GATEWAY: GLOBAL_MESH_01<br />
                  AUTH: RSA-OAEP-4096<br />
                  CLIENT: LUMINA_NEXUS_v1.4
                </p>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-zinc-200 shadow-2xl">
            Resume Operations
          </button>
        </div>
      </div>
    </div>
  );
};

const PrivateTerminal = ({ user, onLogout }: { user: UserSession, onLogout: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tier } = useAppTier();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        lastKeyRef.current = 'h';
      } else if (e.key === 'Enter' && lastKeyRef.current === 'h') {
        setIsHelpOpen(true);
        lastKeyRef.current = null;
      } else {
        lastKeyRef.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTerminate = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen text-zinc-400 antialiased font-sans relative">
      <NeuralBackground />
      <VoiceConcierge />
      <HelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      <aside className="w-80 fixed h-full bg-black/40 backdrop-blur-3xl border-r border-white/5 p-8 flex flex-col z-50">
        <div className="mb-14 px-4 flex flex-col gap-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl ${tier === 'ENTERPRISE' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
              <Landmark size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black italic tracking-tighter text-white uppercase leading-none">
                Nexus <span className="text-blue-500 not-italic">Core</span>
              </h1>
              <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-600 mt-1">Institutional Mesh</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border flex items-center justify-between ${tier === 'ENTERPRISE' ? 'bg-blue-600/10 border-blue-500/30' : 'bg-zinc-900/50 border-zinc-800'}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <User size={14} className="text-zinc-500 shrink-0" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest truncate">{user.name}</span>
            </div>
            <button onClick={handleTerminate} className="text-zinc-600 hover:text-rose-500 transition-colors ml-2">
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 custom-scrollbar overflow-y-auto pr-2">
          {routes.filter(r => r.showInSidebar).map(route => (
            <SidebarItem 
              key={route.path}
              icon={route.icon}
              label={route.label}
              path={route.path}
              active={location.pathname === route.path}
              restricted={route.category === 'intelligence' || route.category === 'system' || route.category === 'registry'}
            />
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
          <Link to="/settings" className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${location.pathname === '/settings' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>
            <SettingsIcon size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
          </Link>
          <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
            <div className="flex items-center gap-3 mb-3">
              <Activity size={14} className="text-blue-500" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Node Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600">
                <span>Parity</span>
                <span className="text-emerald-500">100%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 shadow-[0_0_8px_#3b82f6]" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-80 p-12 relative z-10 overflow-x-hidden">
        <header className="flex justify-between items-center mb-16">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Nexus_OS v1.4.2</p>
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
              {routes.find(r => r.path === location.pathname)?.label || 'System Core'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Node: {user.id}</span>
             </div>
             <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]"></span>
             </button>
          </div>
        </header>

        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={<route.component />} />
          ))}
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/line-items/:type/:id" element={<LineItems />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<AppTier>('STANDARD');

  const checkAuth = useCallback(async () => {
    try {
      const { isAuthenticated, user: sessionUser } = await apiClient.auth.me();
      if (isAuthenticated && sessionUser) {
        setUser(sessionUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener('auth-update', checkAuth);
    return () => window.removeEventListener('auth-update', checkAuth);
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={40} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ tier, setTier }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/overview" replace /> : <Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/airdrop" element={<Airdrop />} />
          <Route path="/protocol/:slug" element={<TechnicalDeepDive />} />
          <Route path="/institutional/:slug" element={<TechnicalDeepDive />} />
          <Route path="/intelligence/:slug" element={<TechnicalDeepDive />} />
          <Route path="/network/:slug" element={<TechnicalDeepDive />} />
          <Route path="*" element={user ? <PrivateTerminal user={user} onLogout={apiClient.auth.logout} /> : <Landing />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/App.tsx
================================================================================

import React, { useState, useContext, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { View } from './types';
import { DataContext } from './context/DataContext';
import FeatureGuard from './components/FeatureGuard';
import MetaDashboardView from './components/views/platform/MetaDashboardView';
import { ModalView } from './components/ModalView';

// --- NEW FRAMEWORK VIEWS ---
import AgentMarketplaceView from './components/views/platform/AgentMarketplaceView';
import OrchestrationView from './components/views/platform/OrchestrationView';
import DataMeshView from './components/views/platform/DataMeshView';
import DataCommonsView from './components/views/platform/DataCommonsView';
import MainframeView from './components/views/platform/MainframeView';
import AIGovernanceView from './components/views/platform/AIGovernanceView';
import AIRiskRegistryView from './components/views/platform/AIRiskRegistryView';
import OSPOView from './components/views/platform/OSPOView';
import CiCdView from './components/views/platform/CiCdView';
import InventionsView from './components/views/platform/InventionsView';
import RoadmapView from './components/views/platform/RoadmapView';
import ConnectView from './components/views/platform/DemoBankConnectView';
import EconomicSynthesisEngineView from './components/views/platform/EconomicSynthesisEngineView';
import TaskMatrixView from './components/views/productivity/TaskMatrixView';
import LedgerExplorerView from './components/views/platform/LedgerExplorerView';

// --- EXPANDED AI & COGNITIVE INFRASTRUCTURE VIEWS ---
import CognitiveServicesHubView from './components/views/platform/CognitiveServicesHubView';
import NeuroLinguisticCompilerView from './components/views/platform/NeuroLinguisticCompilerView';
import SelfOptimizingNetworkView from './components/views/platform/SelfOptimizingNetworkView';
import FederatedLearningView from './components/views/platform/FederatedLearningView';
import HyperpersonalizationEngineView from './components/views/platform/HyperpersonalizationEngineView';
import PredictiveAnalyticsSuiteView from './components/views/platform/PredictiveAnalyticsSuiteView';
import GenerativeAIStudioView from './components/views/platform/GenerativeAIStudioView';
import AIResourceOrchestratorView from './components/views/platform/AIResourceOrchestratorView';
import QuantumMachineLearningView from './components/views/platform/QuantumMachineLearningView';
import SemanticSearchEngineView from './components/views/platform/SemanticSearchEngineView';
import EthicalAIAuditTrailView from './components/views/platform/EthicalAIAuditTrailView';
import ExplainableAIInsightView from './components/views/platform/ExplainableAIInsightView';
import DigitalTwinManagementView from './components/views/platform/DigitalTwinManagementView';
import HumanAILoopOrchestratorView from './components/views/platform/HumanAILoopOrchestratorView';
import AutonomousAgentFrameworkView from './components/views/platform/AutonomousAgentFrameworkView';
import AIWorkloadSchedulerView from './components/views/platform/AIWorkloadSchedulerView';
import IntelligentAutomationCenterView from './components/views/platform/IntelligentAutomationCenterView';
import AIModelGovernanceView from './components/views/platform/AIModelGovernanceView';
import ReinforcementLearningLabView from './components/views/platform/ReinforcementLearningLabView';
import CognitiveDecisionSupportView from './components/views/platform/CognitiveDecisionSupportView';

// --- QUANTUM & ADVANCED COMPUTING VIEWS ---
import QuantumSimulationLabView from './components/views/platform/QuantumSimulationLabView';
import EntanglementFabricView from './components/views/platform/EntanglementFabricView';
import TopologicalQuantumComputingView from './components/views/platform/TopologicalQuantumComputingView';
import PhotonicQuantumNetworkView from './components/views/platform/PhotonicQuantumNetworkView';
import NeuromorphicComputingHubView from './components/views/platform/NeuromorphicComputingHubView';
import BiocomputingInterfaceView from './components/views/platform/BiocomputingInterfaceView';

// --- DECENTRALIZED & WEB3 ENTERPRISE VIEWS ---
import DecentralizedIdentityView from './components/views/platform/DecentralizedIdentityView';
import TokenomicsDesignStudioView from './components/views/platform/TokenomicsDesignStudioView';
import DAOOperatingSystemView from './components/views/platform/DAOOperatingSystemView';
import SmartContractAuditorView from './components/views/platform/SmartContractAuditorView';
import InterchainConnectivityView from './components/views/platform/InterchainConnectivityView';
import VerifiableCredentialsView from './components/views/platform/VerifiableCredentialsView';
import DecentralizedStorageGridView from './components/views/platform/DecentralizedStorageGridView';
import NFTFractionalizationView from './components/views/platform/NFTFractionalizationView';

// --- GLOBAL ECONOMIC & FINANCIAL STRATEGY VIEWS ---
import GeopoliticalRiskEngineView from './components/views/platform/GeopoliticalRiskEngineView';
import GlobalTradeOptimizerView from './components/views/platform/GlobalTradeOptimizerView';
import CarbonCreditExchangeView from './components/views/platform/CarbonCreditExchangeView';
import SovereignWealthAllocatorView from './components/views/platform/SovereignWealthAllocatorView';
import MacroEconomicSimulatorView from './components/views/platform/MacroEconomicSimulatorView';
import ResourceAllocationMatrixView from './components/views/platform/ResourceAllocationMatrixView';

// --- FOUNDATIONAL & LEGACY VIEWS ---
// Personal Finance Views
import DashboardView from './components/views/personal/DashboardView';
import TransactionsView from './components/views/personal/TransactionsView';
import SendMoneyView from './components/views/personal/SendMoneyView';
import BudgetsView from './components/views/personal/BudgetsView';
import InvestmentsView from './components/InvestmentsView';
import PortfolioExplorerView from './components/views/personal/PortfolioExplorerView';
import CryptoView from './components/views/personal/CryptoView';
import FinancialGoalsView from './components/views/personal/FinancialGoalsView';
import MarketplaceView from './components/views/personal/MarketplaceView';
import PersonalizationView from './components/views/personal/PersonalizationView';
import CardCustomizationView from './components/views/personal/CardCustomizationView';
import RewardsHubView from './components/views/personal/RewardsHubView';
import CreditHealthView from './components/views/personal/CreditHealthView';
import SecurityView from './components/views/personal/SecurityView';
import OpenBankingView from './components/views/personal/OpenBankingView';
import SettingsView from './components/views/personal/SettingsView';
import WellnessFinanceView from './components/views/personal/WellnessFinanceView';
import GenerationalWealthView from './components/views/personal/GenerationalWealthView';
import SustainableInvestmentsView from './components/views/personal/SustainableInvestmentsView';
import MicroLendingView from './components/views/personal/MicroLendingView';
import HyperPersonalBudgetView from './components/views/personal/HyperPersonalBudgetView';

// AI & Platform Views
import AIAdvisorView from './components/views/platform/AIAdvisorView';
import QuantumWeaverView from './components/views/platform/QuantumWeaverView';
import QuantumOracleView from './components/views/platform/QuantumOracleView';
import AIAdStudioView from './components/views/platform/AIAdStudioView';
import TheVisionView from './components/views/platform/TheVisionView';
import APIStatusView from './components/views/platform/APIStatusView';
import TheNexusView from './components/views/platform/TheNexusView'; // The 27th Module
import ConstitutionalArticleView from './components/views/platform/ConstitutionalArticleView';
import TheCharterView from './components/views/platform/TheCharterView';
import FractionalReserveView from './components/views/platform/FractionalReserveView';
import FinancialInstrumentForgeView from './components/views/platform/TheAssemblyView';

// Corporate Finance Views
import CorporateDashboardView from './components/views/corporate/CorporateDashboardView';
import PaymentOrdersView from './components/views/corporate/PaymentOrdersView';
import CounterpartiesView from './components/views/corporate/CounterpartiesView';
import InvoicesView from './components/views/corporate/InvoicesView';
import ComplianceView from './components/views/corporate/ComplianceView';
import AnomalyDetectionView from './components/views/corporate/AnomalyDetectionView';
import PayrollView from './components/views/corporate/PayrollView';
import SupplyChainFinanceView from './components/views/corporate/SupplyChainFinanceView';
import TreasuryOptimizationView from './components/views/corporate/TreasuryOptimizationView';
import AlgorithmicTradingView from './components/views/corporate/AlgorithmicTradingView';
import CorporateVenturesView from './components/views/corporate/CorporateVenturesView';
import PredictiveCashFlowView from './components/views/corporate/PredictiveCashFlowView';
import ESGReportingView from './components/views/corporate/ESGReportingView';

// Demo Bank Platform Views
import DemoBankSocialView from './components/views/platform/DemoBankSocialView';
import DemoBankERPView from './components/views/platform/DemoBankERPView';
import DemoBankCRMView from './components/views/platform/DemoBankCRMView';
import DemoBankAPIGatewayView from './components/views/platform/DemoBankAPIGatewayView';
import DemoBankGraphExplorerView from './components/views/platform/DemoBankGraphExplorerView';
import DemoBankDBQLView from './components/views/platform/DemoBankDBQLView';
import DemoBankCloudView from './components/views/platform/DemoBankCloudView';
import DemoBankIdentityView from './components/views/platform/DemoBankIdentityView';
import DemoBankStorageView from './components/views/platform/DemoBankStorageView';
import DemoBankComputerView from './components/views/platform/DemoBankComputerView';
import DemoBankAIPlatformView from './components/views/platform/DemoBankAIPlatformView';
import DemoBankMachineLearningView from './components/views/platform/DemoBankMachineLearningView';
import DemoBankDevOpsView from './components/views/platform/DemoBankDevOpsView';
import DemoBankSecurityCenterView from './components/views/platform/DemoBankSecurityCenterView';
import DemoBankComplianceHubView from './components/views/platform/DemoBankComplianceHubView';
import DemoBankAppMarketplaceView from './components/views/platform/DemoBankAppMarketplaceView';
import DemoBankEventsView from './components/views/platform/DemoBankEventsView';
import DemoBankLogicAppsView from './components/views/platform/DemoBankLogicAppsView';
import DemoBankFunctionsView from './components/views/platform/DemoBankFunctionsView';
import DemoBankDataFactoryView from './components/views/platform/DemoBankDataFactoryView';
import DemoBankAnalyticsView from './components/views/platform/DemoBankAnalyticsView';
import DemoBankBIView from './components/views/platform/DemoBankBIView';
import DemoBankIoTHubView from './components/views/platform/DemoBankIoTHubView';
import DemoBankMapsView from './components/views/platform/DemoBankMapsView';
import DemoBankCommunicationsView from './components/views/platform/DemoBankCommunicationsView';
import DemoBankCommerceView from './components/views/platform/DemoBankCommerceView';
import DemoBankTeamsView from './components/views/platform/DemoBankTeamsView';
import DemoBankCMSView from './components/views/platform/DemoBankCMSView';
import DemoBankLMSView from './components/views/platform/DemoBankLMSView';
import DemoBankHRISView from './components/views/platform/DemoBankHRISView';
import DemoBankProjectsView from './components/views/platform/DemoBankProjectsView';
import DemoBankLegalSuiteView from './components/views/platform/DemoBankLegalSuiteView';
import DemoBankSupplyChainView from './components/views/platform/DemoBankSupplyChainView';
import DemoBankPropTechView from './components/views/platform/DemoBankPropTechView';
import DemoBankGamingServicesView from './components/views/platform/DemoBankGamingServicesView';
import DemoBankBookingsView from './components/views/platform/DemoBankBookingsView';
import DemoBankCDPView from './components/views/platform/DemoBankCDPView';
import DemoBankQuantumServicesView from './components/views/platform/DemoBankQuantumServicesView';
import DemoBankBlockchainView from './components/views/platform/DemoBankBlockchainView';
import DemoBankGISView from './components/views/platform/DemoBankGISView';
import DemoBankRoboticsView from './components/views/platform/DemoBankRoboticsView';
import DemoBankSimulationsView from './components/views/platform/DemoBankSimulationsView';
import DemoBankVoiceServicesView from './components/views/platform/DemoBankVoiceServicesView';
import DemoBankSearchSuiteView from './components/views/platform/DemoBankSearchSuiteView';
import DemoBankDigitalTwinView from './components/views/platform/DemoBankDigitalTwinView';
import DemoBankWorkflowEngineView from './components/views/platform/DemoBankWorkflowEngineView';
import DemoBankObservabilityPlatformView from './components/views/platform/DemoBankObservabilityPlatformView';
import DemoBankFeatureManagementView from './components/views/platform/DemoBankFeatureManagementView';
import DemoBankExperimentationPlatformView from './components/views/platform/DemoBankExperimentationPlatformView';
import DemoBankLocalizationPlatformView from './components/views/platform/DemoBankLocalizationPlatformView';
import DemoBankFleetManagementView from './components/views/platform/DemoBankFleetManagementView';
import DemoBankKnowledgeBaseView from './components/views/platform/DemoBankKnowledgeBaseView';
import DemoBankMediaServicesView from './components/views/platform/DemoBankMediaServicesView';
import DemoBankEventGridView from './components/views/platform/DemoBankEventGridView';
import DemoBankApiManagementView from './components/views/platform/DemoBankApiManagementView';

// --- EXPANDED DEMO BANK PLATFORM SERVICES ---
import DemoBankHyperledgerFabricView from './components/views/platform/DemoBankHyperledgerFabricView';
import DemoBankFederatedIdentityView from './components/views/platform/DemoBankFederatedIdentityView';
import DemoBankAIEthicsMonitorView from './components/views/platform/DemoBankAIEthicsMonitorView';
import DemoBankGenerativeDataSuiteView from './components/views/platform/DemoBankGenerativeDataSuiteView';
import DemoBankQuantumSafeSecurityView from './components/views/platform/DemoBankQuantumSafeSecurityView';
import DemoBankEcosystemConnectorsView from './components/views/platform/DemoBankEcosystemConnectorsView';
import DemoBankRegulatorySandboxEnvView from './components/views/platform/DemoBankRegulatorySandboxEnvView';
import DemoBankPredictiveMaintenanceView from './components/views/platform/DemoBankPredictiveMaintenanceView';
import DemoBankCognitiveProcessAutomationView from './components/views/platform/DemoBankCognitiveProcessAutomationView';
import DemoBankSpatialComputingView from './components/views/platform/DemoBankSpatialComputingView';
import DemoBankBiometricAuthView from './components/views/platform/DemoBankBiometricAuthView';
import DemoBankNeuromorphicAnalyticsView from './components/views/platform/DemoBankNeuromorphicAnalyticsView';
import DemoBankDeFiIntegrationView from './components/views/platform/DemoBankDeFiIntegrationView';
import DemoBankCentralBankDigitalCurrencyView from './components/views/platform/DemoBankCentralBankDigitalCurrencyView';
import DemoBankUniversalBasicIncomeView from './components/views/platform/DemoBankUniversalBasicIncomeView';
import DemoBankDynamicPricingEngineView from './components/views/platform/DemoBankDynamicPricingEngineView';
import DemoBankSustainableFinanceView from './components/views/platform/DemoBankSustainableFinanceView';
import DemoBankImpactInvestmentView from './components/views/platform/DemoBankImpactInvestmentView';
import DemoBankMicroservicesOrchestrationView from './components/views/platform/DemoBankMicroservicesOrchestrationView';
import DemoBankEdgeComputingView from './components/views/platform/DemoBankEdgeComputingView';
import DemoBankAIOpsView from './components/views/platform/DemoBankAIOpsView';
import DemoBankChaosEngineeringView from './components/views/platform/DemoBankChaosEngineeringView';

// Mega Dashboard Views (no change, just for completeness)
import AccessControlsView from './components/views/megadashboard/security/AccessControlsView';
import RoleManagementView from './components/views/megadashboard/security/RoleManagementView';
import AuditLogsView from './components/views/megadashboard/security/AuditLogsView';
import FraudDetectionView from './components/views/megadashboard/security/FraudDetectionView';
import ThreatIntelligenceView from './components/views/megadashboard/security/ThreatIntelligenceView';
import CardManagementView from './components/views/megadashboard/finance/CardManagementView';
import LoanApplicationsView from './components/views/megadashboard/finance/LoanApplicationsView';
import MortgagesView from './components/views/megadashboard/finance/MortgagesView';
import InsuranceHubView from './components/views/megadashboard/finance/InsuranceHubView';
import TaxCenterView from './components/views/megadashboard/finance/TaxCenterView';
import PredictiveModelsView from './components/views/megadashboard/analytics/PredictiveModelsView';
import RiskScoringView from './components/views/megadashboard/analytics/RiskScoringView';
import SentimentAnalysisView from './components/views/megadashboard/analytics/SentimentAnalysisView';
import DataLakesView from './components/views/megadashboard/analytics/DataLakesView';
import DataCatalogView from './components/views/megadashboard/analytics/DataCatalogView';
import ClientOnboardingView from './components/views/megadashboard/userclient/ClientOnboardingView';
import KycAmlView from './components/views/megadashboard/userclient/KycAmlView';
import UserInsightsView from './components/views/megadashboard/userclient/UserInsightsView';
import FeedbackHubView from './components/views/megadashboard/userclient/FeedbackHubView';
import SupportDeskView from './components/views/megadashboard/userclient/SupportDeskView';
import SandboxView from './components/views/megadashboard/developer/SandboxView';
import SdkDownloadsView from './components/views/megadashboard/developer/SdkDownloadsView';
import WebhooksView from './components/views/megadashboard/developer/WebhooksView';
import CliToolsView from './components/views/megadashboard/developer/CliToolsView';
import ExtensionsView from './components/views/megadashboard/developer/ExtensionsView';
import ApiKeysView from './components/views/megadashboard/developer/ApiKeysView';
import ApiContractsView from './components/views/developer/ApiContractsView';
import PartnerHubView from './components/views/megadashboard/ecosystem/PartnerHubView';
import AffiliatesView from './components/views/megadashboard/ecosystem/AffiliatesView';
import IntegrationsMarketplaceView from './components/views/megadashboard/ecosystem/IntegrationsMarketplaceView';
import CrossBorderPaymentsView from './components/views/megadashboard/ecosystem/CrossBorderPaymentsView';
import MultiCurrencyView from './components/views/megadashboard/ecosystem/MultiCurrencyView';
import NftVaultView from './components/views/megadashboard/digitalassets/NftVaultView';
import TokenIssuanceView from './components/views/megadashboard/digitalassets/TokenIssuanceView';
import SmartContractsView from './components/views/megadashboard/digitalassets/SmartContractsView';
import DaoGovernanceView from './components/views/megadashboard/digitalassets/DaoGovernanceView';
import OnChainAnalyticsView from './components/views/megadashboard/digitalassets/OnChainAnalyticsView';
import SalesPipelineView from './components/views/megadashboard/business/SalesPipelineView';
import MarketingAutomationView from './components/views/megadashboard/business/MarketingAutomationView';
import GrowthInsightsView from './components/views/megadashboard/business/GrowthInsightsView';
import CompetitiveIntelligenceView from './components/views/megadashboard/business/CompetitiveIntelligenceView';
import BenchmarkingView from './components/views/megadashboard/business/BenchmarkingView';
import LicensingView from './components/views/megadashboard/regulation/LicensingView';
import DisclosuresView from './components/views/megadashboard/regulation/DisclosuresView';
import LegalDocsView from './components/views/megadashboard/regulation/LegalDocsView';
import RegulatorySandboxView from './components/views/megadashboard/regulation/RegulatorySandboxView';
import ConsentManagementView from './components/views/megadashboard/regulation/ConsentManagementView';
import ContainerRegistryView from './components/views/megadashboard/infra/ContainerRegistryView';
import ApiThrottlingView from './components/views/megadashboard/infra/ApiThrottlingView';
import ObservabilityView from './components/views/megadashboard/infra/ObservabilityView';
import IncidentResponseView from './components/views/megadashboard/infra/IncidentResponseView';
import BackupRecoveryView from './components/views/megadashboard/infra/BackupRecoveryView';

// --- EXPANDED MEGA DASHBOARD VIEWS ---
// Security & Identity Deep Dive
import ThreatModelingView from './components/views/megadashboard/security/ThreatModelingView';
import IdentityGovernanceView from './components/views/megadashboard/security/IdentityGovernanceView';
import QuantumSafeCryptoView from './components/views/megadashboard/security/QuantumSafeCryptoView';
import BiometricAuthenticationView from './components/views/megadashboard/security/BiometricAuthenticationView';
import SecurityScorecardView from './components/views/megadashboard/security/SecurityScorecardView';

// Finance & Banking Advanced Services
import StructuredFinanceView from './components/views/megadashboard/finance/StructuredFinanceView';
import DerivativeMarketView from './components/views/megadashboard/finance/DerivativeMarketView';
import AlternativeInvestmentsView from './components/views/megadashboard/finance/AlternativeInvestmentsView';
import PrivateEquityView from './components/views/megadashboard/finance/PrivateEquityView';
import RealEstateFinanceView from './components/views/megadashboard/finance/RealEstateFinanceView';

// Advanced Analytics & AI Insights
import CausalInferenceEngineView from './components/views/megadashboard/analytics/CausalInferenceEngineView';
import CounterfactualSimulatorView from './components/views/megadashboard/analytics/CounterfactualSimulatorView';
import GraphAnalyticsView from './components/views/megadashboard/analytics/GraphAnalyticsView';
import TimeSeriesForecastingView from './components/views/megadashboard/analytics/TimeSeriesForecastingView';
import ExplainableAIView from './components/views/megadashboard/analytics/ExplainableAIView';

// User & Client Engagement
import JourneyOrchestrationView from './components/views/megadashboard/userclient/JourneyOrchestrationView';
import CustomerLifetimeValueView from './components/views/megadashboard/userclient/CustomerLifetimeValueView';
import VoiceOfCustomerView from './components/views/megadashboard/userclient/VoiceOfCustomerView';
import CommunityManagementView from './components/views/megadashboard/userclient/CommunityManagementView';
import PredictiveSupportView from './components/views/megadashboard/userclient/PredictiveSupportView';

// Developer & Ecosystem Empowerment
import APIVersioningView from './components/views/megadashboard/developer/APIVersioningView';
import DevPortalAnalyticsView from './components/views/megadashboard/developer/DevPortalAnalyticsView';
import SDKGeneratorView from './components/views/megadashboard/developer/SDKGeneratorView';
import LowCodeNoCodeStudioView from './components/views/megadashboard/developer/LowCodeNoCodeStudioView';
import BountyProgramView from './components/views/megadashboard/developer/BountyProgramView';

// Ecosystem & Connectivity Evolution
import OpenBankingAPIManagerView from './components/views/megadashboard/ecosystem/OpenBankingAPIManagerView';
import PartnerOnboardingView from './components/views/megadashboard/ecosystem/PartnerOnboardingView';
import SupplyChainTraceabilityView from './components/views/megadashboard/ecosystem/SupplyChainTraceabilityView';
import GlobalPaymentsNetworkView from './components/views/megadashboard/ecosystem/GlobalPaymentsNetworkView';
import DigitalIdentityFederationView from './components/views/megadashboard/ecosystem/DigitalIdentityFederationView';

// Digital Assets & Web3 Advanced
import CentralBankDigitalCurrencySimulatorView from './components/views/megadashboard/digitalassets/CentralBankDigitalCurrencySimulatorView';
import MetaverseAssetRegistryView from './components/views/megadashboard/digitalassets/MetaverseAssetRegistryView';
import TokenizedRealWorldAssetsView from './components/views/megadashboard/digitalassets/TokenizedRealWorldAssetsView';
import Web3AnalyticsPlatformView from './components/views/megadashboard/digitalassets/Web3AnalyticsPlatformView';
import CrossChainInteroperabilityView from './components/views/megadashboard/digitalassets/CrossChainInteroperabilityView';

// Business & Growth Acceleration
import MarketSegmentationAIView from './components/views/megadashboard/business/MarketSegmentationAIView';
import ProductLedGrowthView from './components/views/megadashboard/business/ProductLedGrowthView';
import PricingStrategyEngineView from './components/views/megadashboard/business/PricingStrategyEngineView';
import AcquisitionChannelOptimizerView from './components/views/megadashboard/business/AcquisitionChannelOptimizerView';
import RetentionDynamicsView from './components/views/megadashboard/business/RetentionDynamicsView';

// Regulation & Legal Intelligence
import AIComplianceEngineView from './components/views/megadashboard/regulation/AIComplianceEngineView';
import GlobalRegulatoryWatchView from './components/views/megadashboard/regulation/GlobalRegulatoryWatchView';
import LegalContractAutomationView from './components/views/megadashboard/regulation/LegalContractAutomationView';
import EthicalAIReviewBoardView from './components/views/megadashboard/regulation/EthicalAIReviewBoardView';
import DataPrivacyManagementView from './components/views/megadashboard/regulation/DataPrivacyManagementView';

// Infra & Ops Resilience
import SiteReliabilityEngineeringView from './components/views/megadashboard/infra/SiteReliabilityEngineeringView';
import FinOpsCostOptimizationView from './components/views/megadashboard/infra/FinOpsCostOptimizationView';
import GreenCloudDashboardView from './components/views/megadashboard/infra/GreenCloudDashboardView';
import PredictiveScalingView from './components/views/megadashboard/infra/PredictiveScalingView';
import ResilienceEngineeringView from './components/views/megadashboard/infra/ResilienceEngineeringView';

// Blueprint imports
import CrisisAIManagerView from './components/views/blueprints/CrisisAIManagerView';
import CognitiveLoadBalancerView from './components/views/blueprints/CognitiveLoadBalancerView';
import HolographicMeetingScribeView from './components/views/blueprints/HolographicMeetingScribeView';
import QuantumProofEncryptorView from './components/views/blueprints/QuantumProofEncryptorView';
import EtherealMarketplaceView from './components/views/blueprints/EtherealMarketplaceView';
import AdaptiveUITailorView from './components/views/blueprints/AdaptiveUITailorView';
import UrbanSymphonyPlannerView from './components/views/blueprints/UrbanSymphonyPlannerView';
import PersonalHistorianAIView from './components/views/blueprints/PersonalHistorianAIView';
import DebateAdversaryView from './components/views/blueprints/DebateAdversaryView';
import CulturalAssimilationAdvisorView from './components/views/blueprints/CulturalAssimilationAdvisorView';
import DynamicSoundscapeGeneratorView from './components/views/blueprints/DynamicSoundscapeGeneratorView';
import EmergentStrategyWargamerView from './components/views/blueprints/EmergentStrategyWargamerView';
import EthicalGovernorView from './components/views/blueprints/EthicalGovernorView';
import QuantumEntanglementDebuggerView from './components/views/blueprints/QuantumEntanglementDebuggerView';
import LinguisticFossilFinderView from './components/views/blueprints/LinguisticFossilFinderView';
import ChaosTheoristView from './components/views/blueprints/ChaosTheoristView';
import SelfRewritingCodebaseView from './components/views/blueprints/SelfRewritingCodebaseView';

// Visionary Blueprint Imports
import GenerativeJurisprudenceView from './components/views/blueprints/GenerativeJurisprudenceView';
import AestheticEngineView from './components/views/blueprints/AestheticEngineView';
import NarrativeForgeView from './components/views/blueprints/NarrativeForgeView';
import WorldBuilderView from './components/views/blueprints/WorldBuilderView';
import SonicAlchemyView from './components/views/blueprints/SonicAlchemyView';
import AutonomousScientistView from './components/views/blueprints/AutonomousScientistView';
import ZeitgeistEngineView from './components/views/blueprints/ZeitgeistEngineView';
import CareerTrajectoryView from './components/views/blueprints/CareerTrajectoryView';
import LudicBalancerView from './components/views/blueprints/LudicBalancerView';
import HypothesisEngineView from './components/views/blueprints/HypothesisEngineView';
import LexiconClarifierView from './components/views/blueprints/LexiconClarifierView';
import CodeArcheologistView from './components/views/blueprints/CodeArcheologistView';

// --- HYPER-VISIONARY BLUEPRINT IMPORTS ---
import UniversalTranslatorView from './components/views/blueprints/UniversalTranslatorView';
import DreamSynthesizerView from './components/views/blueprints/DreamSynthesizerView';
import ChronosTemporalPredictorView from './components/views/blueprints/ChronosTemporalPredictorView';
import SentientInterfaceDesignerView from './components/views/blueprints/SentientInterfaceDesignerView';
import EcologicalNetworkBalancerView from './components/views/blueprints/EcologicalNetworkBalancerView';
import MultiverseExplorerView from './components/views/blueprints/MultiverseExplorerView';
import MetaCognitiveDebuggerView from './components/views/blueprints/MetaCognitiveDebuggerView';
import CollectiveConsciousnessAmplifierView from './components/views/blueprints/CollectiveConsciousnessAmplifierView';
import ExistentialRiskMitigatorView from './components/views/blueprints/ExistentialRiskMitigatorView';
import HyperdimensionalDataMapperView from './components/views/blueprints/HyperdimensionalDataMapperView';
import SelfEvolvingSystemArchitectView from './components/views/blueprints/SelfEvolvingSystemArchitectView';
import AlgorithmicMythosCreatorView from './components/views/blueprints/AlgorithmicMythosCreatorView';
import BioIntegratedFinanceView from './components/views/blueprints/BioIntegratedFinanceView';
import PlanetaryResourceAllocatorView from './components/views/blueprints/PlatentaryResourceAllocatorView';
import EmpathicAICompanionView from './components/views/blueprints/EmpathicAICompanionView';
import NeuralNetworkGardenerView from './components/views/blueprints/NeuralNetworkGardenerView';
import RealityComposerView from './components/views/blueprints/RealityComposerView';
import PredictiveGovernanceEngineView from './components/views/blueprints/PredictiveGovernanceEngineView';

// Global Components
import VoiceControl from './components/VoiceControl';
import GlobalChatbot from './components/GlobalChatbot';
import { useFeatureFlagContext } from './context/FeatureFlagContext'; // Assuming this new context exists or will be created
import GlobalNotificationCenter from './components/GlobalNotificationCenter'; // New global component
import UserSessionManager from './components/UserSessionManager'; // New global component

/**
 * @description The root component of the application.
 * It acts as a controller or router, managing the active view and rendering the
 * appropriate child component. It also orchestrates the main layout, including
 * the Sidebar, Header, and main content area. This application is designed
 * as a comprehensive, commercial-grade platform, integrating advanced AI,
 * blockchain, and future-forward financial and operational capabilities.
 * It emphasizes dynamic content delivery, feature control, and an intuitive,
 * powerful user experience suitable for a publisher edition.
 */
const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>(View.MetaDashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [previousView, setPreviousView] = useState<View | null>(null);
    const dataContext = useContext(DataContext);
    // Assuming a FeatureFlagContext exists for dynamic feature enablement
    const { isFeatureEnabled } = useFeatureFlagContext(); // Use the assumed feature flag context

    const [modalView, setModalView] = useState<View | null>(null);
    const [modalPreviousView, setModalPreviousView] = useState<View | null>(null);

    const openModal = (view: View) => {
        setModalPreviousView(activeView); // The view we are coming from
        setModalView(view);
    };

    const closeModal = () => {
        setModalView(null);
    };

    if (!dataContext) {
        throw new Error("App must be used within a DataProvider");
    }

    const { customBackgroundUrl, activeIllusion, isLoading, error } = dataContext;

    const handleSetView = (view: View) => {
        if (view !== activeView) {
            setPreviousView(activeView);
            setActiveView(view);
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        }
    };
    
    if (error) {
        return (
           <div className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center p-4">
               <div className="bg-gray-900 border border-red-700 rounded-xl p-8 max-w-lg text-center">
                   <h1 className="text-2xl font-bold text-red-400 mb-4">Connection Error</h1>
                   <p className="text-gray-400 mb-6">{error}</p>
                   <p className="text-xs text-gray-500">Please ensure the backend server is running. You may need to refresh the page after starting the server.</p>
               </div>
           </div>
       );
   }
    
    /**
     * @description The main view renderer. It uses a switch statement to determine
     * which page component to render based on the `activeView` state. This acts as
     * a sophisticated client-side router, dynamically loading and guarding access
     * to commercial-grade features.
     * @returns {React.ReactElement} The component for the currently active view.
     */
    const renderView = () => {
        if (isLoading && dataContext.transactions.length === 0) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-dashed rounded-full animate-spin"></div>
                    <p className="ml-4 text-cyan-400 text-lg font-semibold">Synthesizing reality...</p>
                </div>
            );
        }

        if (activeView.startsWith('article-')) {
            const articleNumber = parseInt(activeView.replace('article-', ''), 10);
            return <FeatureGuard view={activeView}><ConstitutionalArticleView articleNumber={articleNumber} /></FeatureGuard>;
        }
        
        switch (activeView) {
            // --- META & NEW FRAMEWORK VIEWS ---
            case View.MetaDashboard: return <MetaDashboardView openModal={openModal} />;
            case View.AgentMarketplace: return <FeatureGuard view={View.AgentMarketplace}><AgentMarketplaceView /></FeatureGuard>;
            case View.Orchestration: return <FeatureGuard view={View.Orchestration}><OrchestrationView /></FeatureGuard>;
            case View.DataMesh: return <FeatureGuard view={View.DataMesh}><DataMeshView /></FeatureGuard>;
            case View.DataCommons: return <FeatureGuard view={View.DataCommons}><DataCommonsView /></FeatureGuard>;
            case View.Mainframe: return <FeatureGuard view={View.Mainframe}><MainframeView /></FeatureGuard>;
            case View.AIGovernance: return <FeatureGuard view={View.AIGovernance}><AIGovernanceView /></FeatureGuard>;
            case View.AIRiskRegistry: return <FeatureGuard view={View.AIRiskRegistry}><AIRiskRegistryView /></FeatureGuard>;
            case View.OSPO: return <FeatureGuard view={View.OSPO}><OSPOView /></FeatureGuard>;
            case View.CiCd: return <FeatureGuard view={View.CiCd}><CiCdView /></FeatureGuard>;
            case View.Inventions: return <FeatureGuard view={View.Inventions}><InventionsView /></FeatureGuard>;
            case View.Roadmap: return <FeatureGuard view={View.Roadmap}><RoadmapView /></FeatureGuard>;
            case View.Connect: return <FeatureGuard view={View.Connect}><ConnectView /></FeatureGuard>;
            case View.EconomicSynthesisEngine: return <FeatureGuard view={View.EconomicSynthesisEngine}><EconomicSynthesisEngineView /></FeatureGuard>;
            case View.TaskMatrix: return <FeatureGuard view={View.TaskMatrix}><TaskMatrixView /></FeatureGuard>;
            case View.LedgerExplorer: return <FeatureGuard view={View.LedgerExplorer}><LedgerExplorerView /></FeatureGuard>;

            // --- EXPANDED AI & COGNITIVE INFRASTRUCTURE VIEWS ---
            case View.CognitiveServicesHub: return <FeatureGuard view={View.CognitiveServicesHub}><CognitiveServicesHubView /></FeatureGuard>;
            case View.NeuroLinguisticCompiler: return <FeatureGuard view={View.NeuroLinguisticCompiler}><NeuroLinguisticCompilerView /></FeatureGuard>;
            case View.SelfOptimizingNetwork: return <FeatureGuard view={View.SelfOptimizingNetwork}><SelfOptimizingNetworkView /></FeatureGuard>;
            case View.FederatedLearning: return <FeatureGuard view={View.FederatedLearning}><FederatedLearningView /></FeatureGuard>;
            case View.HyperpersonalizationEngine: return <FeatureGuard view={View.HyperpersonalizationEngine}><HyperpersonalizationEngineView /></FeatureGuard>;
            case View.PredictiveAnalyticsSuite: return <FeatureGuard view={View.PredictiveAnalyticsSuite}><PredictiveAnalyticsSuiteView /></FeatureGuard>;
            case View.GenerativeAIStudio: return <FeatureGuard view={View.GenerativeAIStudio}><GenerativeAIStudioView /></FeatureGuard>;
            case View.AIResourceOrchestrator: return <FeatureGuard view={View.AIResourceOrchestrator}><AIResourceOrchestratorView /></FeatureGuard>;
            case View.QuantumMachineLearning: return <FeatureGuard view={View.QuantumMachineLearning}><QuantumMachineLearningView /></FeatureGuard>;
            case View.SemanticSearchEngine: return <FeatureGuard view={View.SemanticSearchEngine}><SemanticSearchEngineView /></FeatureGuard>;
            case View.EthicalAIAuditTrail: return <FeatureGuard view={View.EthicalAIAuditTrail}><EthicalAIAuditTrailView /></FeatureGuard>;
            case View.ExplainableAIInsight: return <FeatureGuard view={View.ExplainableAIInsight}><ExplainableAIInsightView /></FeatureGuard>;
            case View.DigitalTwinManagement: return <FeatureGuard view={View.DigitalTwinManagement}><DigitalTwinManagementView /></FeatureGuard>;
            case View.HumanAILoopOrchestrator: return <FeatureGuard view={View.HumanAILoopOrchestrator}><HumanAILoopOrchestratorView /></FeatureGuard>;
            case View.AutonomousAgentFramework: return <FeatureGuard view={View.AutonomousAgentFramework}><AutonomousAgentFrameworkView /></FeatureGuard>;
            case View.AIWorkloadScheduler: return <FeatureGuard view={View.AIWorkloadScheduler}><AIWorkloadSchedulerView /></FeatureGuard>;
            case View.IntelligentAutomationCenter: return <FeatureGuard view={View.IntelligentAutomationCenter}><IntelligentAutomationCenterView /></FeatureGuard>;
            case View.AIModelGovernance: return <FeatureGuard view={View.AIModelGovernance}><AIModelGovernanceView /></FeatureGuard>;
            case View.ReinforcementLearningLab: return <FeatureGuard view={View.ReinforcementLearningLab}><ReinforcementLearningLabView /></FeatureGuard>;
            case View.CognitiveDecisionSupport: return <FeatureGuard view={View.CognitiveDecisionSupport}><CognitiveDecisionSupportView /></FeatureGuard>;

            // --- QUANTUM & ADVANCED COMPUTING VIEWS ---
            case View.QuantumSimulationLab: return <FeatureGuard view={View.QuantumSimulationLab}><QuantumSimulationLabView /></FeatureGuard>;
            case View.EntanglementFabric: return <FeatureGuard view={View.EntanglementFabric}><EntanglementFabricView /></FeatureGuard>;
            case View.TopologicalQuantumComputing: return <FeatureGuard view={View.TopologicalQuantumComputing}><TopologicalQuantumComputingView /></FeatureGuard>;
            case View.PhotonicQuantumNetwork: return <FeatureGuard view={View.PhotonicQuantumNetwork}><PhotonicQuantumNetworkView /></FeatureGuard>;
            case View.NeuromorphicComputingHub: return <FeatureGuard view={View.NeuromorphicComputingHub}><NeuromorphicComputingHubView /></FeatureGuard>;
            case View.BiocomputingInterface: return <FeatureGuard view={View.BiocomputingInterface}><BiocomputingInterfaceView /></FeatureGuard>;
            
            // --- DECENTRALIZED & WEB3 ENTERPRISE VIEWS ---
            case View.DecentralizedIdentity: return <FeatureGuard view={View.DecentralizedIdentity}><DecentralizedIdentityView /></FeatureGuard>;
            case View.TokenomicsDesignStudio: return <FeatureGuard view={View.TokenomicsDesignStudio}><TokenomicsDesignStudioView /></FeatureGuard>;
            case View.DAOOperatingSystem: return <FeatureGuard view={View.DAOOperatingSystem}><DAOOperatingSystemView /></FeatureGuard>;
            case View.SmartContractAuditor: return <FeatureGuard view={View.SmartContractAuditor}><SmartContractAuditorView /></FeatureGuard>;
            case View.InterchainConnectivity: return <FeatureGuard view={View.InterchainConnectivity}><InterchainConnectivityView /></FeatureGuard>;
            case View.VerifiableCredentials: return <FeatureGuard view={View.VerifiableCredentials}><VerifiableCredentialsView /></FeatureGuard>;
            case View.DecentralizedStorageGrid: return <FeatureGuard view={View.DecentralizedStorageGrid}><DecentralizedStorageGridView /></FeatureGuard>;
            case View.NFTFractionalization: return <FeatureGuard view={View.NFTFractionalization}><NFTFractionalizationView /></FeatureGuard>;

            // --- GLOBAL ECONOMIC & FINANCIAL STRATEGY VIEWS ---
            case View.GeopoliticalRiskEngine: return <FeatureGuard view={View.GeopoliticalRiskEngine}><GeopoliticalRiskEngineView /></FeatureGuard>;
            case View.GlobalTradeOptimizer: return <FeatureGuard view={View.GlobalTradeOptimizer}><GlobalTradeOptimizerView /></FeatureGuard>;
            case View.CarbonCreditExchange: return <FeatureGuard view={View.CarbonCreditExchange}><CarbonCreditExchangeView /></FeatureGuard>;
            case View.SovereignWealthAllocator: return <FeatureGuard view={View.SovereignWealthAllocator}><SovereignWealthAllocatorView /></FeatureGuard>;
            case View.MacroEconomicSimulator: return <FeatureGuard view={View.MacroEconomicSimulator}><MacroEconomicSimulatorView /></FeatureGuard>;
            case View.ResourceAllocationMatrix: return <FeatureGuard view={View.ResourceAllocationMatrix}><ResourceAllocationMatrixView /></FeatureGuard>;


            // --- FOUNDATIONAL & LEGACY VIEWS ---
            // Personal Finance
            case View.Dashboard: return <FeatureGuard view={View.Dashboard}><DashboardView setActiveView={handleSetView}/></FeatureGuard>;
            case View.Transactions: return <FeatureGuard view={View.Transactions}><TransactionsView /></FeatureGuard>;
            case View.SendMoney: return <FeatureGuard view={View.SendMoney}><SendMoneyView setActiveView={handleSetView} /></FeatureGuard>;
            case View.Budgets: return <FeatureGuard view={View.Budgets}><BudgetsView /></FeatureGuard>;
            case View.Investments: return <FeatureGuard view={View.Investments}><InvestmentsView /></FeatureGuard>;
            case View.PortfolioExplorer: return <FeatureGuard view={View.PortfolioExplorer}><PortfolioExplorerView /></FeatureGuard>;
            case View.Crypto: return <FeatureGuard view={View.Crypto}><CryptoView /></FeatureGuard>;
            case View.FinancialGoals: return <FeatureGuard view={View.FinancialGoals}><FinancialGoalsView /></FeatureGuard>;
            case View.Marketplace: return <FeatureGuard view={View.Marketplace}><MarketplaceView /></FeatureGuard>;
            case View.Personalization: return <FeatureGuard view={View.Personalization}><PersonalizationView /></FeatureGuard>;
            case View.CardCustomization: return <FeatureGuard view={View.CardCustomization}><CardCustomizationView /></FeatureGuard>;
            case View.RewardsHub: return <FeatureGuard view={View.RewardsHub}><RewardsHubView /></FeatureGuard>;
            case View.CreditHealth: return <FeatureGuard view={View.CreditHealth}><CreditHealthView /></FeatureGuard>;
            case View.Security: return <FeatureGuard view={View.Security}><SecurityView /></FeatureGuard>;
            case View.OpenBanking: return <FeatureGuard view={View.OpenBanking}><OpenBankingView /></FeatureGuard>;
            case View.Settings: return <FeatureGuard view={View.Settings}><SettingsView /></FeatureGuard>;
            case View.WellnessFinance: return <FeatureGuard view={View.WellnessFinance}><WellnessFinanceView /></FeatureGuard>;
            case View.GenerationalWealth: return <FeatureGuard view={View.GenerationalWealth}><GenerationalWealthView /></FeatureGuard>;
            case View.SustainableInvestments: return <FeatureGuard view={View.SustainableInvestments}><SustainableInvestmentsView /></FeatureGuard>;
            case View.MicroLending: return <FeatureGuard view={View.MicroLending}><MicroLendingView /></FeatureGuard>;
            case View.HyperPersonalBudget: return <FeatureGuard view={View.HyperPersonalBudget}><HyperPersonalBudgetView /></FeatureGuard>;
            
            // AI & Platform
            case View.TheNexus: return <FeatureGuard view={View.TheNexus}><TheNexusView /></FeatureGuard>;
            case View.AIAdvisor: return <FeatureGuard view={View.AIAdvisor}><AIAdvisorView previousView={previousView} /></FeatureGuard>;
            case View.QuantumWeaver: return <FeatureGuard view={View.QuantumWeaver}><QuantumWeaverView /></FeatureGuard>;
            case View.QuantumOracle: return <FeatureGuard view={View.QuantumOracle}><QuantumOracleView /></FeatureGuard>;
            case View.AIAdStudio: return <FeatureGuard view={View.AIAdStudio}><AIAdStudioView /></FeatureGuard>;
            case View.TheWinningVision: return <FeatureGuard view={View.TheWinningVision}><TheVisionView /></FeatureGuard>;
            case View.APIStatus: return <FeatureGuard view={View.APIStatus}><APIStatusView /></FeatureGuard>;
            
            // Corporate Finance
            case View.CorporateDashboard: return <FeatureGuard view={View.CorporateDashboard}><CorporateDashboardView setActiveView={handleSetView} /></FeatureGuard>;
            case View.PaymentOrders: return <FeatureGuard view={View.PaymentOrders}><PaymentOrdersView /></FeatureGuard>;
            case View.Counterparties: return <FeatureGuard view={View.Counterparties}><CounterpartiesView /></FeatureGuard>;
            case View.Invoices: return <FeatureGuard view={View.Invoices}><InvoicesView /></FeatureGuard>;
            case View.Compliance: return <FeatureGuard view={View.Compliance}><ComplianceView /></FeatureGuard>;
            case View.AnomalyDetection: return <FeatureGuard view={View.AnomalyDetection}><AnomalyDetectionView /></FeatureGuard>;
            case View.Payroll: return <FeatureGuard view={View.Payroll}><PayrollView /></FeatureGuard>;
            case View.SupplyChainFinance: return <FeatureGuard view={View.SupplyChainFinance}><SupplyChainFinanceView /></FeatureGuard>;
            case View.TreasuryOptimization: return <FeatureGuard view={View.TreasuryOptimization}><TreasuryOptimizationView /></FeatureGuard>;
            case View.AlgorithmicTrading: return <FeatureGuard view={View.AlgorithmicTrading}><AlgorithmicTradingView /></FeatureGuard>;
            case View.CorporateVentures: return <FeatureGuard view={View.CorporateVentures}><CorporateVenturesView /></FeatureGuard>;
            case View.PredictiveCashFlow: return <FeatureGuard view={View.PredictiveCashFlow}><PredictiveCashFlowView /></FeatureGuard>;
            case View.ESGReporting: return <FeatureGuard view={View.ESGReporting}><ESGReportingView /></FeatureGuard>;

            // Demo Bank Platform
            case View.DemoBankSocial: return <FeatureGuard view={View.DemoBankSocial}><DemoBankSocialView /></FeatureGuard>;
            case View.DemoBankERP: return <FeatureGuard view={View.DemoBankERP}><DemoBankERPView /></FeatureGuard>;
            case View.DemoBankCRM: return <FeatureGuard view={View.DemoBankCRM}><DemoBankCRMView /></FeatureGuard>;
            case View.DemoBankAPIGateway: return <FeatureGuard view={View.DemoBankAPIGateway}><DemoBankAPIGatewayView /></FeatureGuard>;
            case View.DemoBankGraphExplorer: return <FeatureGuard view={View.DemoBankGraphExplorer}><DemoBankGraphExplorerView /></FeatureGuard>;
            case View.DemoBankDBQL: return <FeatureGuard view={View.DemoBankDBQL}><DemoBankDBQLView /></FeatureGuard>;
            case View.DemoBankCloud: return <FeatureGuard view={View.DemoBankCloud}><DemoBankCloudView /></FeatureGuard>;
            case View.DemoBankIdentity: return <FeatureGuard view={View.DemoBankIdentity}><DemoBankIdentityView /></FeatureGuard>;
            case View.DemoBankStorage: return <FeatureGuard view={View.DemoBankStorage}><DemoBankStorageView /></FeatureGuard>;
            case View.DemoBankCompute: return <FeatureGuard view={View.DemoBankCompute}><DemoBankComputerView /></FeatureGuard>;
            case View.DemoBankAIPlatform: return <FeatureGuard view={View.DemoBankAIPlatform}><DemoBankAIPlatformView /></FeatureGuard>;
            case View.DemoBankMachineLearning: return <FeatureGuard view={View.DemoBankMachineLearning}><DemoBankMachineLearningView /></FeatureGuard>;
            case View.DemoBankDevOps: return <FeatureGuard view={View.DemoBankDevOps}><DemoBankDevOpsView /></FeatureGuard>;
            case View.DemoBankSecurityCenter: return <FeatureGuard view={View.DemoBankSecurityCenter}><DemoBankSecurityCenterView /></FeatureGuard>;
            case View.DemoBankComplianceHub: return <FeatureGuard view={View.DemoBankComplianceHub}><DemoBankComplianceHubView /></FeatureGuard>;
            case View.DemoBankAppMarketplace: return <FeatureGuard view={View.DemoBankAppMarketplace}><DemoBankAppMarketplaceView /></FeatureGuard>;
            case View.DemoBankEvents: return <FeatureGuard view={View.DemoBankEvents}><DemoBankEventsView /></FeatureGuard>;
            case View.DemoBankLogicApps: return <FeatureGuard view={View.DemoBankLogicApps}><DemoBankLogicAppsView /></FeatureGuard>;
            case View.DemoBankFunctions: return <FeatureGuard view={View.DemoBankFunctions}><DemoBankFunctionsView /></FeatureGuard>;
            case View.DemoBankDataFactory: return <FeatureGuard view={View.DemoBankDataFactory}><DemoBankDataFactoryView /></FeatureGuard>;
            case View.DemoBankAnalytics: return <FeatureGuard view={View.DemoBankAnalytics}><DemoBankAnalyticsView /></FeatureGuard>;
            case View.DemoBankBI: return <FeatureGuard view={View.DemoBankBI}><DemoBankBIView /></FeatureGuard>;
            case View.DemoBankIoTHub: return <FeatureGuard view={View.DemoBankIoTHub}><DemoBankIoTHubView /></FeatureGuard>;
            case View.DemoBankMaps: return <FeatureGuard view={View.DemoBankMaps}><DemoBankMapsView /></FeatureGuard>;
            case View.DemoBankCommunications: return <FeatureGuard view={View.DemoBankCommunications}><DemoBankCommunicationsView /></FeatureGuard>;
            case View.DemoBankCommerce: return <FeatureGuard view={View.DemoBankCommerce}><DemoBankCommerceView /></FeatureGuard>;
            case View.DemoBankTeams: return <FeatureGuard view={View.DemoBankTeams}><DemoBankTeamsView /></FeatureGuard>;
            case View.DemoBankCMS: return <FeatureGuard view={View.DemoBankCMS}><DemoBankCMSView /></FeatureGuard>;
            case View.DemoBankLMS: return <FeatureGuard view={View.DemoBankLMS}><DemoBankLMSView /></FeatureGuard>;
            case View.DemoBankHRIS: return <FeatureGuard view={View.DemoBankHRIS}><DemoBankHRISView /></FeatureGuard>;
            case View.DemoBankProjects: return <FeatureGuard view={View.DemoBankProjects}><DemoBankProjectsView /></FeatureGuard>;
            case View.DemoBankLegalSuite: return <FeatureGuard view={View.DemoBankLegalSuite}><DemoBankLegalSuiteView /></FeatureGuard>;
            case View.DemoBankSupplyChain: return <FeatureGuard view={View.DemoBankSupplyChain}><DemoBankSupplyChainView /></FeatureGuard>;
            case View.DemoBankPropTech: return <FeatureGuard view={View.DemoBankPropTech}><DemoBankPropTechView /></FeatureGuard>;
            case View.DemoBankGamingServices: return <FeatureGuard view={View.DemoBankGamingServices}><DemoBankGamingServicesView /></FeatureGuard>;
            case View.DemoBankBookings: return <FeatureGuard view={View.DemoBankBookings}><DemoBankBookingsView /></FeatureGuard>;
            case View.DemoBankCDP: return <FeatureGuard view={View.DemoBankCDP}><DemoBankCDPView /></FeatureGuard>;
            case View.DemoBankQuantumServices: return <FeatureGuard view={View.DemoBankQuantumServices}><DemoBankQuantumServicesView /></FeatureGuard>;
            case View.DemoBankBlockchain: return <FeatureGuard view={View.DemoBankBlockchain}><DemoBankBlockchainView /></FeatureGuard>;
            case View.DemoBankGIS: return <FeatureGuard view={View.DemoBankGIS}><DemoBankGISView /></FeatureGuard>;
            case View.DemoBankRobotics: return <FeatureGuard view={View.DemoBankRobotics}><DemoBankRoboticsView /></FeatureGuard>;
            case View.DemoBankSimulations: return <FeatureGuard view={View.DemoBankSimulations}><DemoBankSimulationsView /></FeatureGuard>;
            case View.DemoBankVoiceServices: return <FeatureGuard view={View.DemoBankVoiceServices}><DemoBankVoiceServicesView /></FeatureGuard>;
            case View.DemoBankSearchSuite: return <FeatureGuard view={View.DemoBankSearchSuite}><DemoBankSearchSuiteView /></FeatureGuard>;
            case View.DemoBankDigitalTwin: return <FeatureGuard view={View.DemoBankDigitalTwin}><DemoBankDigitalTwinView /></FeatureGuard>;
            case View.DemoBankWorkflowEngine: return <FeatureGuard view={View.DemoBankWorkflowEngine}><DemoBankWorkflowEngineView /></FeatureGuard>;
            case View.DemoBankObservabilityPlatform: return <FeatureGuard view={View.DemoBankObservabilityPlatform}><DemoBankObservabilityPlatformView /></FeatureGuard>;
            case View.DemoBankFeatureManagement: return <FeatureGuard view={View.DemoBankFeatureManagement}><DemoBankFeatureManagementView /></FeatureGuard>;
            case View.DemoBankExperimentationPlatform: return <FeatureGuard view={View.DemoBankExperimentationPlatform}><DemoBankExperimentationPlatformView /></FeatureGuard>;
            case View.DemoBankLocalizationPlatform: return <FeatureGuard view={View.DemoBankLocalizationPlatform}><DemoBankLocalizationPlatformView /></FeatureGuard>;
            case View.DemoBankFleetManagement: return <FeatureGuard view={View.DemoBankFleetManagement}><DemoBankFleetManagementView /></FeatureGuard>;
            case View.DemoBankKnowledgeBase: return <FeatureGuard view={View.DemoBankKnowledgeBase}><DemoBankKnowledgeBaseView /></FeatureGuard>;
            case View.DemoBankMediaServices: return <FeatureGuard view={View.DemoBankMediaServices}><DemoBankMediaServicesView /></FeatureGuard>;
            case View.DemoBankEventGrid: return <FeatureGuard view={View.DemoBankEventGrid}><DemoBankEventGridView /></FeatureGuard>;
            case View.DemoBankApiManagement: return <FeatureGuard view={View.DemoBankApiManagement}><DemoBankApiManagementView /></FeatureGuard>;

            // --- EXPANDED DEMO BANK PLATFORM SERVICES ---
            case View.DemoBankHyperledgerFabric: return <FeatureGuard view={View.DemoBankHyperledgerFabric}><DemoBankHyperledgerFabricView /></FeatureGuard>;
            case View.DemoBankFederatedIdentity: return <FeatureGuard view={View.DemoBankFederatedIdentity}><DemoBankFederatedIdentityView /></FeatureGuard>;
            case View.DemoBankAIEthicsMonitor: return <FeatureGuard view={View.DemoBankAIEthicsMonitor}><DemoBankAIEthicsMonitorView /></FeatureGuard>;
            case View.DemoBankGenerativeDataSuite: return <FeatureGuard view={View.DemoBankGenerativeDataSuite}><DemoBankGenerativeDataSuiteView /></FeatureGuard>;
            case View.DemoBankQuantumSafeSecurity: return <FeatureGuard view={View.DemoBankQuantumSafeSecurity}><DemoBankQuantumSafeSecurityView /></FeatureGuard>;
            case View.DemoBankEcosystemConnectors: return <FeatureGuard view={View.DemoBankEcosystemConnectors}><DemoBankEcosystemConnectorsView /></FeatureGuard>;
            case View.DemoBankRegulatorySandboxEnv: return <FeatureGuard view={View.DemoBankRegulatorySandboxEnv}><DemoBankRegulatorySandboxEnvView /></FeatureGuard>;
            case View.DemoBankPredictiveMaintenance: return <FeatureGuard view={View.DemoBankPredictiveMaintenance}><DemoBankPredictiveMaintenanceView /></FeatureGuard>;
            case View.DemoBankCognitiveProcessAutomation: return <FeatureGuard view={View.DemoBankCognitiveProcessAutomation}><DemoBankCognitiveProcessAutomationView /></FeatureGuard>;
            case View.DemoBankSpatialComputing: return <FeatureGuard view={View.DemoBankSpatialComputing}><DemoBankSpatialComputingView /></FeatureGuard>;
            case View.DemoBankBiometricAuth: return <FeatureGuard view={View.DemoBankBiometricAuth}><DemoBankBiometricAuthView /></FeatureGuard>;
            case View.DemoBankNeuromorphicAnalytics: return <FeatureGuard view={View.DemoBankNeuromorphicAnalytics}><DemoBankNeuromorphicAnalyticsView /></FeatureGuard>;
            case View.DemoBankDeFiIntegration: return <FeatureGuard view={View.DemoBankDeFiIntegration}><DemoBankDeFiIntegrationView /></FeatureGuard>;
            case View.DemoBankCentralBankDigitalCurrency: return <FeatureGuard view={View.DemoBankCentralBankDigitalCurrency}><DemoBankCentralBankDigitalCurrencyView /></FeatureGuard>;
            case View.DemoBankUniversalBasicIncome: return <FeatureGuard view={View.DemoBankUniversalBasicIncome}><DemoBankUniversalBasicIncomeView /></FeatureGuard>;
            case View.DemoBankDynamicPricingEngine: return <FeatureGuard view={View.DemoBankDynamicPricingEngine}><DemoBankDynamicPricingEngineView /></FeatureGuard>;
            case View.DemoBankSustainableFinance: return <FeatureGuard view={View.DemoBankSustainableFinance}><DemoBankSustainableFinanceView /></FeatureGuard>;
            case View.DemoBankImpactInvestment: return <FeatureGuard view={View.DemoBankImpactInvestment}><DemoBankImpactInvestmentView /></FeatureGuard>;
            case View.DemoBankMicroservicesOrchestration: return <FeatureGuard view={View.DemoBankMicroservicesOrchestration}><DemoBankMicroservicesOrchestrationView /></FeatureGuard>;
            case View.DemoBankEdgeComputing: return <FeatureGuard view={View.DemoBankEdgeComputing}><DemoBankEdgeComputingView /></FeatureGuard>;
            case View.DemoBankAIOps: return <FeatureGuard view={View.DemoBankAIOps}><DemoBankAIOpsView /></FeatureGuard>;
            case View.DemoBankChaosEngineering: return <FeatureGuard view={View.DemoBankChaosEngineering}><DemoBankChaosEngineeringView /></FeatureGuard>;


            // Mega Dashboard - Security & Identity
            case View.SecurityAccessControls: return <FeatureGuard view={View.SecurityAccessControls}><AccessControlsView /></FeatureGuard>;
            case View.SecurityRoleManagement: return <FeatureGuard view={View.SecurityRoleManagement}><RoleManagementView /></FeatureGuard>;
            case View.SecurityAuditLogs: return <FeatureGuard view={View.SecurityAuditLogs}><AuditLogsView /></FeatureGuard>;
            case View.SecurityFraudDetection: return <FeatureGuard view={View.SecurityFraudDetection}><FraudDetectionView /></FeatureGuard>;
            case View.SecurityThreatIntelligence: return <FeatureGuard view={View.SecurityThreatIntelligence}><ThreatIntelligenceView /></FeatureGuard>;
            case View.SecurityThreatModeling: return <FeatureGuard view={View.SecurityThreatModeling}><ThreatModelingView /></FeatureGuard>;
            case View.SecurityIdentityGovernance: return <FeatureGuard view={View.SecurityIdentityGovernance}><IdentityGovernanceView /></FeatureGuard>;
            case View.SecurityQuantumSafeCrypto: return <FeatureGuard view={View.SecurityQuantumSafeCrypto}><QuantumSafeCryptoView /></FeatureGuard>;
            case View.SecurityBiometricAuthentication: return <FeatureGuard view={View.SecurityBiometricAuthentication}><BiometricAuthenticationView /></FeatureGuard>;
            case View.SecurityScorecard: return <FeatureGuard view={View.SecurityScorecard}><SecurityScorecardView /></FeatureGuard>;

            // Mega Dashboard - Finance & Banking
            case View.FinanceCardManagement: return <FeatureGuard view={View.FinanceCardManagement}><CardManagementView /></FeatureGuard>;
            case View.FinanceLoanApplications: return <FeatureGuard view={View.FinanceLoanApplications}><LoanApplicationsView /></FeatureGuard>;
            case View.FinanceMortgages: return <FeatureGuard view={View.FinanceMortgages}><MortgagesView /></FeatureGuard>;
            case View.FinanceInsuranceHub: return <FeatureGuard view={View.FinanceInsuranceHub}><InsuranceHubView /></FeatureGuard>;
            case View.FinanceTaxCenter: return <FeatureGuard view={View.FinanceTaxCenter}><TaxCenterView /></FeatureGuard>;
            case View.FinanceStructuredFinance: return <FeatureGuard view={View.FinanceStructuredFinance}><StructuredFinanceView /></FeatureGuard>;
            case View.FinanceDerivativeMarket: return <FeatureGuard view={View.FinanceDerivativeMarket}><DerivativeMarketView /></FeatureGuard>;
            case View.FinanceAlternativeInvestments: return <FeatureGuard view={View.FinanceAlternativeInvestments}><AlternativeInvestmentsView /></FeatureGuard>;
            case View.FinancePrivateEquity: return <FeatureGuard view={View.FinancePrivateEquity}><PrivateEquityView /></FeatureGuard>;
            case View.FinanceRealEstateFinance: return <FeatureGuard view={View.FinanceRealEstateFinance}><RealEstateFinanceView /></FeatureGuard>;

            // Mega Dashboard - Advanced Analytics
            case View.AnalyticsPredictiveModels: return <FeatureGuard view={View.AnalyticsPredictiveModels}><PredictiveModelsView /></FeatureGuard>;
            case View.AnalyticsRiskScoring: return <FeatureGuard view={View.AnalyticsRiskScoring}><RiskScoringView /></FeatureGuard>;
            case View.AnalyticsSentimentAnalysis: return <FeatureGuard view={View.AnalyticsSentimentAnalysis}><SentimentAnalysisView /></FeatureGuard>;
            case View.AnalyticsDataLakes: return <FeatureGuard view={View.AnalyticsDataLakes}><DataLakesView /></FeatureGuard>;
            case View.AnalyticsDataCatalog: return <FeatureGuard view={View.AnalyticsDataCatalog}><DataCatalogView /></FeatureGuard>;
            case View.AnalyticsCausalInferenceEngine: return <FeatureGuard view={View.AnalyticsCausalInferenceEngine}><CausalInferenceEngineView /></FeatureGuard>;
            case View.AnalyticsCounterfactualSimulator: return <FeatureGuard view={View.AnalyticsCounterfactualSimulator}><CounterfactualSimulatorView /></FeatureGuard>;
            case View.AnalyticsGraphAnalytics: return <FeatureGuard view={View.AnalyticsGraphAnalytics}><GraphAnalyticsView /></FeatureGuard>;
            case View.AnalyticsTimeSeriesForecasting: return <FeatureGuard view={View.AnalyticsTimeSeriesForecasting}><TimeSeriesForecastingView /></FeatureGuard>;
            case View.AnalyticsExplainableAI: return <FeatureGuard view={View.AnalyticsExplainableAI}><ExplainableAIView /></FeatureGuard>;

            // Mega Dashboard - User & Client Tools
            case View.UserClientOnboarding: return <FeatureGuard view={View.UserClientOnboarding}><ClientOnboardingView /></FeatureGuard>;
            case View.UserClientKycAml: return <FeatureGuard view={View.UserClientKycAml}><KycAmlView /></FeatureGuard>;
            case View.UserClientUserInsights: return <FeatureGuard view={View.UserClientUserInsights}><UserInsightsView /></FeatureGuard>;
            case View.UserClientFeedbackHub: return <FeatureGuard view={View.UserClientFeedbackHub}><FeedbackHubView /></FeatureGuard>;
            case View.UserClientSupportDesk: return <FeatureGuard view={View.UserClientSupportDesk}><SupportDeskView /></FeatureGuard>;
            case View.UserClientJourneyOrchestration: return <FeatureGuard view={View.UserClientJourneyOrchestration}><JourneyOrchestrationView /></FeatureGuard>;
            case View.UserClientCustomerLifetimeValue: return <FeatureGuard view={View.UserClientCustomerLifetimeValue}><CustomerLifetimeValueView /></FeatureGuard>;
            case View.UserClientVoiceOfCustomer: return <FeatureGuard view={View.UserClientVoiceOfCustomer}><VoiceOfCustomerView /></FeatureGuard>;
            case View.UserClientCommunityManagement: return <FeatureGuard view={View.UserClientCommunityManagement}><CommunityManagementView /></FeatureGuard>;
            case View.UserClientPredictiveSupport: return <FeatureGuard view={View.UserClientPredictiveSupport}><PredictiveSupportView /></FeatureGuard>;

            // Mega Dashboard - Developer & Integration
            case View.DeveloperSandbox: return <FeatureGuard view={View.DeveloperSandbox}><SandboxView /></FeatureGuard>;
            case View.DeveloperSdkDownloads: return <FeatureGuard view={View.DeveloperSdkDownloads}><SdkDownloadsView /></FeatureGuard>;
            case View.DeveloperWebhooks: return <FeatureGuard view={View.DeveloperWebhooks}><WebhooksView /></FeatureGuard>;
            case View.DeveloperCliTools: return <FeatureGuard view={View.DeveloperCliTools}><CliToolsView /></FeatureGuard>;
            case View.DeveloperExtensions: return <FeatureGuard view={View.DeveloperExtensions}><ExtensionsView /></FeatureGuard>;
            case View.DeveloperApiKeys: return <FeatureGuard view={View.DeveloperApiKeys}><ApiKeysView /></FeatureGuard>;
            case View.DeveloperApiContracts: return <FeatureGuard view={View.DeveloperApiContracts}><ApiContractsView /></FeatureGuard>;
            case View.DeveloperAPIVersioning: return <FeatureGuard view={View.DeveloperAPIVersioning}><APIVersioningView /></FeatureGuard>;
            case View.DeveloperDevPortalAnalytics: return <FeatureGuard view={View.DeveloperDevPortalAnalytics}><DevPortalAnalyticsView /></FeatureGuard>;
            case View.DeveloperSDKGenerator: return <FeatureGuard view={View.DeveloperSDKGenerator}><SDKGeneratorView /></FeatureGuard>;
            case View.DeveloperLowCodeNoCodeStudio: return <FeatureGuard view={View.DeveloperLowCodeNoCodeStudio}><LowCodeNoCodeStudioView /></FeatureGuard>;
            case View.DeveloperBountyProgram: return <FeatureGuard view={View.DeveloperBountyProgram}><BountyProgramView /></FeatureGuard>;

            // Mega Dashboard - Ecosystem & Connectivity
            case View.EcosystemPartnerHub: return <FeatureGuard view={View.EcosystemPartnerHub}><PartnerHubView /></FeatureGuard>;
            case View.EcosystemAffiliates: return <FeatureGuard view={View.EcosystemAffiliates}><AffiliatesView /></FeatureGuard>;
            case View.EcosystemIntegrationsMarketplace: return <FeatureGuard view={View.EcosystemIntegrationsMarketplace}><IntegrationsMarketplaceView /></FeatureGuard>;
            case View.EcosystemCrossBorderPayments: return <FeatureGuard view={View.EcosystemCrossBorderPayments}><CrossBorderPaymentsView /></FeatureGuard>;
            case View.EcosystemMultiCurrency: return <FeatureGuard view={View.EcosystemMultiCurrency}><MultiCurrencyView /></FeatureGuard>;
            case View.EcosystemOpenBankingAPIManager: return <FeatureGuard view={View.EcosystemOpenBankingAPIManager}><OpenBankingAPIManagerView /></FeatureGuard>;
            case View.EcosystemPartnerOnboarding: return <FeatureGuard view={View.EcosystemPartnerOnboarding}><PartnerOnboardingView /></FeatureGuard>;
            case View.EcosystemSupplyChainTraceability: return <FeatureGuard view={View.EcosystemSupplyChainTraceability}><SupplyChainTraceabilityView /></FeatureGuard>;
            case View.EcosystemGlobalPaymentsNetwork: return <FeatureGuard view={View.EcosystemGlobalPaymentsNetwork}><GlobalPaymentsNetworkView /></FeatureGuard>;
            case View.EcosystemDigitalIdentityFederation: return <FeatureGuard view={View.EcosystemDigitalIdentityFederation}><DigitalIdentityFederationView /></FeatureGuard>;

            // Mega Dashboard - Digital Assets & Web3
            case View.DigitalAssetsNftVault: return <FeatureGuard view={View.DigitalAssetsNftVault}><NftVaultView /></FeatureGuard>;
            case View.DigitalAssetsTokenIssuance: return <FeatureGuard view={View.DigitalAssetsTokenIssuance}><TokenIssuanceView /></FeatureGuard>;
            case View.DigitalAssetsSmartContracts: return <FeatureGuard view={View.DigitalAssetsSmartContracts}><SmartContractsView /></FeatureGuard>;
            case View.DigitalAssetsDaoGovernance: return <FeatureGuard view={View.DigitalAssetsDaoGovernance}><DaoGovernanceView /></FeatureGuard>;
            case View.DigitalAssetsOnChainAnalytics: return <FeatureGuard view={View.DigitalAssetsOnChainAnalytics}><OnChainAnalyticsView /></FeatureGuard>;
            case View.DigitalAssetsCentralBankDigitalCurrencySimulator: return <FeatureGuard view={View.DigitalAssetsCentralBankDigitalCurrencySimulator}><CentralBankDigitalCurrencySimulatorView /></FeatureGuard>;
            case View.DigitalAssetsMetaverseAssetRegistry: return <FeatureGuard view={View.DigitalAssetsMetaverseAssetRegistry}><MetaverseAssetRegistryView /></FeatureGuard>;
            case View.DigitalAssetsTokenizedRealWorldAssets: return <FeatureGuard view={View.DigitalAssetsTokenizedRealWorldAssets}><TokenizedRealWorldAssetsView /></FeatureGuard>;
            case View.DigitalAssetsWeb3AnalyticsPlatform: return <FeatureGuard view={View.DigitalAssetsWeb3AnalyticsPlatform}><Web3AnalyticsPlatformView /></FeatureGuard>;
            case View.DigitalAssetsCrossChainInteroperability: return <FeatureGuard view={View.DigitalAssetsCrossChainInteroperability}><CrossChainInteroperabilityView /></FeatureGuard>;

            // Mega Dashboard - Business & Growth
            case View.BusinessSalesPipeline: return <FeatureGuard view={View.BusinessSalesPipeline}><SalesPipelineView /></FeatureGuard>;
            case View.BusinessMarketingAutomation: return <FeatureGuard view={View.BusinessMarketingAutomation}><MarketingAutomationView /></FeatureGuard>;
            case View.BusinessGrowthInsights: return <FeatureGuard view={View.BusinessGrowthInsights}><GrowthInsightsView /></FeatureGuard>;
            case View.BusinessCompetitiveIntelligence: return <FeatureGuard view={View.BusinessCompetitiveIntelligence}><CompetitiveIntelligenceView /></FeatureGuard>;
            case View.BusinessBenchmarking: return <FeatureGuard view={View.BusinessBenchmarking}><BenchmarkingView /></FeatureGuard>;
            case View.BusinessMarketSegmentationAI: return <FeatureGuard view={View.BusinessMarketSegmentationAI}><MarketSegmentationAIView /></FeatureGuard>;
            case View.BusinessProductLedGrowth: return <FeatureGuard view={View.BusinessProductLedGrowth}><ProductLedGrowthView /></FeatureGuard>;
            case View.BusinessPricingStrategyEngine: return <FeatureGuard view={View.BusinessPricingStrategyEngine}><PricingStrategyEngineView /></FeatureGuard>;
            case View.BusinessAcquisitionChannelOptimizer: return <FeatureGuard view={View.BusinessAcquisitionChannelOptimizer}><AcquisitionChannelOptimizerView /></FeatureGuard>;
            case View.BusinessRetentionDynamics: return <FeatureGuard view={View.BusinessRetentionDynamics}><RetentionDynamicsView /></FeatureGuard>;

            // Mega Dashboard - Regulation & Legal
            case View.RegulationLicensing: return <FeatureGuard view={View.RegulationLicensing}><LicensingView /></FeatureGuard>;
            case View.RegulationDisclosures: return <FeatureGuard view={View.RegulationDisclosures}><DisclosuresView /></FeatureGuard>;
            case View.RegulationLegalDocs: return <FeatureGuard view={View.RegulationLegalDocs}><LegalDocsView /></FeatureGuard>;
            case View.RegulationRegulatorySandbox: return <FeatureGuard view={View.RegulationRegulatorySandbox}><RegulatorySandboxView /></FeatureGuard>;
            case View.RegulationConsentManagement: return <FeatureGuard view={View.RegulationConsentManagement}><ConsentManagementView /></FeatureGuard>;
            case View.RegulationAIComplianceEngine: return <FeatureGuard view={View.RegulationAIComplianceEngine}><AIComplianceEngineView /></FeatureGuard>;
            case View.RegulationGlobalRegulatoryWatch: return <FeatureGuard view={View.RegulationGlobalRegulatoryWatch}><GlobalRegulatoryWatchView /></FeatureGuard>;
            case View.RegulationLegalContractAutomation: return <FeatureGuard view={View.RegulationLegalContractAutomation}><LegalContractAutomationView /></FeatureGuard>;
            case View.RegulationEthicalAIReviewBoard: return <FeatureGuard view={View.RegulationEthicalAIReviewBoard}><EthicalAIReviewBoardView /></FeatureGuard>;
            case View.RegulationDataPrivacyManagement: return <FeatureGuard view={View.RegulationDataPrivacyManagement}><DataPrivacyManagementView /></FeatureGuard>;

            // Mega Dashboard - Infra & Ops
            case View.InfraContainerRegistry: return <FeatureGuard view={View.InfraContainerRegistry}><ContainerRegistryView /></FeatureGuard>;
            case View.InfraApiThrottling: return <FeatureGuard view={View.InfraApiThrottling}><ApiThrottlingView /></FeatureGuard>;
            case View.InfraObservability: return <FeatureGuard view={View.InfraObservability}><ObservabilityView /></FeatureGuard>;
            case View.InfraIncidentResponse: return <FeatureGuard view={View.InfraIncidentResponse}><IncidentResponseView /></FeatureGuard>;
            case View.InfraBackupRecovery: return <FeatureGuard view={View.InfraBackupRecovery}><BackupRecoveryView /></FeatureGuard>;
            case View.InfraSiteReliabilityEngineering: return <FeatureGuard view={View.InfraSiteReliabilityEngineering}><SiteReliabilityEngineeringView /></FeatureGuard>;
            case View.InfraFinOpsCostOptimization: return <FeatureGuard view={View.InfraFinOpsCostOptimization}><FinOpsCostOptimizationView /></FeatureGuard>;
            case View.InfraGreenCloudDashboard: return <FeatureGuard view={View.InfraGreenCloudDashboard}><GreenCloudDashboardView /></FeatureGuard>;
            case View.InfraPredictiveScaling: return <FeatureGuard view={View.InfraPredictiveScaling}><PredictiveScalingView /></FeatureGuard>;
            case View.InfraResilienceEngineering: return <FeatureGuard view={View.InfraResilienceEngineering}><ResilienceEngineeringView /></FeatureGuard>;


            // Blueprints
            case View.CrisisAIManager: return <FeatureGuard view={View.CrisisAIManager}><CrisisAIManagerView /></FeatureGuard>;
            case View.CognitiveLoadBalancer: return <FeatureGuard view={View.CognitiveLoadBalancer}><CognitiveLoadBalancerView /></FeatureGuard>;
            case View.HolographicMeetingScribe: return <FeatureGuard view={View.HolographicMeetingScribe}><HolographicMeetingScribeView /></FeatureGuard>;
            case View.QuantumProofEncryptor: return <FeatureGuard view={View.QuantumProofEncryptor}><QuantumProofEncryptorView /></FeatureGuard>;
            case View.EtherealMarketplace: return <FeatureGuard view={View.EtherealMarketplace}><EtherealMarketplaceView /></FeatureGuard>;
            case View.AdaptiveUITailor: return <FeatureGuard view={View.AdaptiveUITailor}><AdaptiveUITailorView /></FeatureGuard>;
            case View.UrbanSymphonyPlanner: return <FeatureGuard view={View.UrbanSymphonyPlanner}><UrbanSymphonyPlannerView /></FeatureGuard>;
            case View.PersonalHistorianAI: return <FeatureGuard view={View.PersonalHistorianAI}><PersonalHistorianAIView /></FeatureGuard>;
            case View.DebateAdversary: return <FeatureGuard view={View.DebateAdversary}><DebateAdversaryView /></FeatureGuard>;
            case View.CulturalAssimilationAdvisor: return <FeatureGuard view={View.CulturalAssimilationAdvisor}><CulturalAssimilationAdvisorView /></FeatureGuard>;
            case View.DynamicSoundscapeGenerator: return <FeatureGuard view={View.DynamicSoundscapeGenerator}><DynamicSoundscapeGeneratorView /></FeatureGuard>;
            case View.EmergentStrategyWargamer: return <FeatureGuard view={View.EmergentStrategyWargamer}><EmergentStrategyWargamerView /></FeatureGuard>;
            case View.EthicalGovernor: return <FeatureGuard view={View.EthicalGovernor}><EthicalGovernorView /></FeatureGuard>;
            case View.QuantumEntanglementDebugger: return <FeatureGuard view={View.QuantumEntanglementDebugger}><QuantumEntanglementDebuggerView /></FeatureGuard>;
            case View.LinguisticFossilFinder: return <FeatureGuard view={View.LinguisticFossilFinder}><LinguisticFossilFinderView /></FeatureGuard>;
            case View.ChaosTheorist: return <FeatureGuard view={View.ChaosTheorist}><ChaosTheoristView /></FeatureGuard>;
            case View.SelfRewritingCodebase: return <FeatureGuard view={View.SelfRewritingCodebase}><SelfRewritingCodebaseView /></FeatureGuard>;
            
             // Visionary Blueprints
            case View.GenerativeJurisprudence: return <FeatureGuard view={View.GenerativeJurisprudence}><GenerativeJurisprudenceView /></FeatureGuard>;
            case View.AestheticEngine: return <FeatureGuard view={View.AestheticEngine}><AestheticEngineView /></FeatureGuard>;
            case View.NarrativeForge: return <FeatureGuard view={View.NarrativeForge}><NarrativeForgeView /></FeatureGuard>;
            case View.WorldBuilder: return <FeatureGuard view={View.WorldBuilder}><WorldBuilderView /></FeatureGuard>;
            case View.SonicAlchemy: return <FeatureGuard view={View.SonicAlchemy}><SonicAlchemyView /></FeatureGuard>;
            case View.AutonomousScientist: return <FeatureGuard view={View.AutonomousScientist}><AutonomousScientistView /></FeatureGuard>;
            case View.ZeitgeistEngine: return <FeatureGuard view={View.ZeitgeistEngine}><ZeitgeistEngineView /></FeatureGuard>;
            case View.CareerTrajectory: return <FeatureGuard view={View.CareerTrajectory}><CareerTrajectoryView /></FeatureGuard>;
            case View.LudicBalancer: return <FeatureGuard view={View.LudicBalancer}><LudicBalancerView /></FeatureGuard>;
            case View.HypothesisEngine: return <FeatureGuard view={View.HypothesisEngine}><HypothesisEngineView /></FeatureGuard>;
            case View.LexiconClarifier: return <FeatureGuard view={View.LexiconClarifier}><LexiconClarifierView /></FeatureGuard>;
            case View.CodeArcheologist: return <FeatureGuard view={View.CodeArcheologist}><CodeArcheologistView /></FeatureGuard>;

            // --- HYPER-VISIONARY BLUEPRINT VIEWS ---
            case View.UniversalTranslator: return <FeatureGuard view={View.UniversalTranslator}><UniversalTranslatorView /></FeatureGuard>;
            case View.DreamSynthesizer: return <FeatureGuard view={View.DreamSynthesizer}><DreamSynthesizerView /></FeatureGuard>;
            case View.ChronosTemporalPredictor: return <FeatureGuard view={View.ChronosTemporalPredictor}><ChronosTemporalPredictorView /></FeatureGuard>;
            case View.SentientInterfaceDesigner: return <FeatureGuard view={View.SentientInterfaceDesigner}><SentientInterfaceDesignerView /></FeatureGuard>;
            case View.EcologicalNetworkBalancer: return <FeatureGuard view={View.EcologicalNetworkBalancer}><EcologicalNetworkBalancerView /></FeatureGuard>;
            case View.MultiverseExplorer: return <FeatureGuard view={View.MultiverseExplorer}><MultiverseExplorerView /></FeatureGuard>;
            case View.MetaCognitiveDebugger: return <FeatureGuard view={View.MetaCognitiveDebugger}><MetaCognitiveDebuggerView /></FeatureGuard>;
            case View.CollectiveConsciousnessAmplifier: return <FeatureGuard view={View.CollectiveConsciousnessAmplifier}><CollectiveConsciousnessAmplifierView /></FeatureGuard>;
            case View.ExistentialRiskMitigator: return <FeatureGuard view={View.ExistentialRiskMitigator}><ExistentialRiskMitigatorView /></FeatureGuard>;
            case View.HyperdimensionalDataMapper: return <FeatureGuard view={View.HyperdimensionalDataMapper}><HyperdimensionalDataMapperView /></FeatureGuard>;
            case View.SelfEvolvingSystemArchitect: return <FeatureGuard view={View.SelfEvolvingSystemArchitect}><SelfEvolvingSystemArchitectView /></FeatureGuard>;
            case View.AlgorithmicMythosCreator: return <FeatureGuard view={View.AlgorithmicMythosCreator}><AlgorithmicMythosCreatorView /></FeatureGuard>;
            case View.BioIntegratedFinance: return <FeatureGuard view={View.BioIntegratedFinance}><BioIntegratedFinanceView /></FeatureGuard>;
            case View.PlanetaryResourceAllocator: return <FeatureGuard view={View.PlanetaryResourceAllocator}><PlatentaryResourceAllocatorView /></FeatureGuard>;
            case View.EmpathicAICompanion: return <FeatureGuard view={View.EmpathicAICompanion}><EmpathicAICompanionView /></FeatureGuard>;
            case View.NeuralNetworkGardener: return <FeatureGuard view={View.NeuralNetworkGardener}><NeuralNetworkGardenerView /></FeatureGuard>;
            case View.RealityComposer: return <FeatureGuard view={View.RealityComposer}><RealityComposerView /></FeatureGuard>;
            case View.PredictiveGovernanceEngine: return <FeatureGuard view={View.PredictiveGovernanceEngine}><PredictiveGovernanceEngineView /></FeatureGuard>;

            // Constitutional
            case View.TheCharter: return <FeatureGuard view={View.TheCharter}><TheCharterView /></FeatureGuard>;
            case View.FractionalReserve: return <FeatureGuard view={View.FractionalReserve}><FractionalReserveView /></FeatureGuard>;
            case View.FinancialInstrumentForge: return <FeatureGuard view={View.FinancialInstrumentForge}><FinancialInstrumentForgeView /></FeatureGuard>;

            default: return <MetaDashboardView openModal={openModal} />;
        }
    };

    const backgroundStyle = {
        backgroundImage: customBackgroundUrl ? `url(${customBackgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    };

    const IllusionLayer = () => {
        if (!activeIllusion || activeIllusion === 'none') return null;
        return <div className={`absolute inset-0 z-0 ${activeIllusion}-illusion`}></div>
    };

    return (
        <div className="relative min-h-screen bg-gray-950 text-gray-300 font-sans" style={backgroundStyle}>
            <IllusionLayer />
             <div className="relative z-10 flex min-h-screen bg-transparent">
                <Sidebar activeView={activeView} setActiveView={handleSetView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col lg:ml-64">
                    <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} setActiveView={handleSetView} />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        {renderView()}
                    </main>
                </div>
                {/* Global AI-powered components and system managers */}
                <VoiceControl setActiveView={handleSetView} />
                <GlobalChatbot />
                <GlobalNotificationCenter /> {/* New global notification system */}
                <UserSessionManager /> {/* Enhanced session management for premium features */}

                {modalView && (
                    <ModalView 
                        activeView={modalView}
                        previousView={modalPreviousView}
                        closeModal={closeModal}
                        openModal={openModal}
                    />
                )}
            </div>
        </div>
    );
};

export default App;

================================================================================
// APPENDED FROM REPO: diplomat-bit/connect-api | ORIGINAL PATH: diplomat-bit-connect-api-352979a/App.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  Terminal, Shield, Key, Link as LinkIcon, Database, 
  LayoutDashboard, Activity, AlertCircle, RefreshCcw, 
  ArrowRight, Globe, Settings2, ChevronRight, Terminal as TerminalIcon
} from 'lucide-react';
import { FlowStep, PlaidCredentials, PlaidTokenState, MarqetaCredentials, ModernTreasuryCredentials } from './types';
import { CredentialsForm } from './components/CredentialsForm';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [step, setStep] = useState<FlowStep>(FlowStep.CREDENTIALS);
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [credentials, setCredentials] = useState<PlaidCredentials | null>(null);
  const [marqetaCreds, setMarqetaCreds] = useState<MarqetaCredentials | null>(null);
  const [mtCreds, setMtCreds] = useState<ModernTreasuryCredentials | null>(null);
  const [tokens, setTokens] = useState<PlaidTokenState>({
    linkToken: null,
    publicToken: null,
    accessToken: null
  });
  const [logs, setLogs] = useState<{msg: string, type: 'req' | 'res' | 'err', timestamp: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [proxyUrl, setProxyUrl] = useState('https://corsproxy.io/?url=');
  const [useProxy, setUseProxy] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let checkInterval: number;
    const checkPlaid = () => {
      if ((window as any).Plaid) {
        setSdkStatus('ready');
        clearInterval(checkInterval);
      } else if ((window as any).PLAID_LOAD_ERROR) {
        setSdkStatus('error');
        clearInterval(checkInterval);
      }
    };
    checkInterval = window.setInterval(checkPlaid, 500);
    return () => clearInterval(checkInterval);
  }, []);

  const addLog = (msg: any, type: 'req' | 'res' | 'err' = 'res') => {
    const stringified = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2);
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 } as any);
    setLogs(prev => [{ msg: stringified, type, timestamp }, ...prev].slice(0, 50));
  };

  const handleCredentialsSubmit = (plaid: PlaidCredentials, marqeta: MarqetaCredentials, mt: ModernTreasuryCredentials) => {
    setCredentials(plaid);
    setMarqetaCreds(marqeta);
    setMtCreds(mt);
    setStep(FlowStep.LINK_TOKEN);
    addLog("Stack credentials initialized.", 'res');
  };

  const createLinkToken = async () => {
    setIsLoading(true);
    try {
      const targetUrl = `https://${credentials?.environment}.plaid.com/link/token/create`;
      const finalUrl = useProxy ? `${proxyUrl}${encodeURIComponent(targetUrl)}` : targetUrl;
      const res = await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: credentials?.clientId,
          secret: credentials?.secret,
          user: { client_user_id: 'nexus_' + Date.now() },
          client_name: 'Nexus Terminal',
          products: ['auth', 'transactions'],
          country_codes: ['US'],
          language: 'en'
        })
      }).then(r => r.json());
      
      if (res.error_message) throw new Error(res.error_message);
      setTokens(prev => ({ ...prev, linkToken: res.link_token }));
      setStep(FlowStep.LINK_UI);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openLink = () => {
    if (!tokens.linkToken) return;
    (window as any).Plaid.create({
      token: tokens.linkToken,
      onSuccess: (public_token: string) => {
        setTokens(prev => ({ ...prev, publicToken: public_token }));
        setStep(FlowStep.EXCHANGE);
      },
      onExit: (err: any) => err && setError(err.message)
    }).open();
  };

  const exchangeToken = async () => {
    setIsLoading(true);
    try {
      const targetUrl = `https://${credentials?.environment}.plaid.com/item/public_token/exchange`;
      const finalUrl = useProxy ? `${proxyUrl}${encodeURIComponent(targetUrl)}` : targetUrl;
      const res = await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: credentials?.clientId,
          secret: credentials?.secret,
          public_token: tokens.publicToken
        })
      }).then(r => r.json());
      
      if (res.error_message) throw new Error(res.error_message);
      setTokens(prev => ({ ...prev, accessToken: res.access_token }));
      setStep(FlowStep.DASHBOARD);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl sticky top-0 z-50 h-24 flex items-center">
        <div className="max-w-[1600px] mx-auto px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Activity className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">Nexus<span className="text-blue-500">Terminal</span></h1>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="p-3.5 rounded-2xl border border-white/5 text-slate-400">
            <Settings2 size={22} />
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="bg-blue-600 p-[1px] z-40">
           <div className="bg-[#020617] p-8 flex items-center gap-6">
              <input type="text" value={proxyUrl} onChange={(e) => setProxyUrl(e.target.value)} className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-blue-400" />
           </div>
        </div>
      )}

      <main className="flex-1 flex flex-col xl:flex-row max-w-[1600px] mx-auto w-full p-8 lg:p-12 gap-12 relative z-10">
        <div className="flex-1 space-y-12">
          {step === FlowStep.CREDENTIALS && <CredentialsForm onSubmit={handleCredentialsSubmit} />}
          {step === FlowStep.LINK_TOKEN && (
            <div className="text-center p-20 bg-slate-900/30 rounded-[3rem] border border-white/5 space-y-8">
              <Key size={56} className="mx-auto text-blue-500" />
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Plaid Handshake</h2>
              <button onClick={createLinkToken} disabled={isLoading} className="bg-blue-600 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm">
                {isLoading ? <RefreshCcw className="animate-spin" /> : 'Request Link Token'}
              </button>
            </div>
          )}
          {step === FlowStep.LINK_UI && (
            <div className="text-center p-20 bg-slate-900/30 rounded-[3rem] border border-white/5 space-y-8">
              <LinkIcon size={56} className="mx-auto text-emerald-500" />
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Bank Linkage</h2>
              <button onClick={openLink} className="bg-white text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm">Launch Link UI</button>
            </div>
          )}
          {step === FlowStep.EXCHANGE && (
            <div className="text-center p-20 bg-slate-900/30 rounded-[3rem] border border-white/5 space-y-8">
              <Database size={56} className="mx-auto text-purple-500" />
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Auth Exchange</h2>
              <button onClick={exchangeToken} disabled={isLoading} className="bg-purple-600 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm">Finalize Node</button>
            </div>
          )}
          {step === FlowStep.DASHBOARD && credentials && tokens.accessToken && marqetaCreds && mtCreds && (
            <Dashboard 
              accessToken={tokens.accessToken} 
              credentials={credentials} 
              marqetaCreds={marqetaCreds}
              mtCreds={mtCreds}
              proxy={useProxy ? proxyUrl : ''}
              addLog={addLog}
            />
          )}
        </div>

        <aside className="w-full xl:w-[450px]">
          <div className="bg-slate-950/80 rounded-[2.5rem] border border-white/5 flex flex-col h-[700px] overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="p-7 border-b border-white/5 bg-slate-900/40 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">System_Traffic</span>
              <button onClick={() => setLogs([])} className="text-[10px] font-black text-slate-600">Flush</button>
            </div>
            <div className="flex-1 overflow-y-auto p-7 space-y-5 font-mono text-[11px]">
              {logs.map((log, i) => (
                <div key={i} className={`p-4 rounded-xl border ${log.type === 'req' ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : log.type === 'err' ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-slate-900/60 border-white/5 text-slate-400'}`}>
                  <div className="flex justify-between mb-2 opacity-50 text-[9px]">
                    <span className="uppercase">{log.type}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <pre className="whitespace-pre-wrap break-all">{log.msg}</pre>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/diplomat-bit-book-icewall | ORIGINAL PATH: diplomat-bit-diplomat-bit-book-icewall-23638b5/App.tsx
================================================================================


import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { LoadingOverlay } from './components/LoadingOverlay';
import { INITIAL_BOOK_DATA } from './constants';
import { generateSectionPageTitles, generateChapterContent, playExecutiveSummary } from './services/geminiService';
import { downloadBookAsHtml } from './utils/downloadHelper';
import { SparklesIcon, DownloadIcon } from './components/IconComponents';
import type { Book, Section, Chapter, Page } from './types';

const LOCAL_STORAGE_KEY = 'ice-wall-expedition-v1';

const App: React.FC = () => {
  const [bookData, setBookData] = useState<Book>(() => {
    const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_BOOK_DATA;
  });

  const [selectedPath, setSelectedPath] = useState<string>('0-0');
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [genProgress, setGenProgress] = useState({ pillar: '', domain: '', step: 0 });

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookData));
  }, [bookData]);

  const { sectionIndex, chapterIndex, pageIndex } = useMemo(() => {
    const [sec, chap, page] = selectedPath.split('-').map(Number);
    return { sectionIndex: sec, chapterIndex: chap, pageIndex: page };
  }, [selectedPath]);

  const selectedSection: Section | undefined = bookData[sectionIndex];
  const selectedChapter: Chapter | undefined = selectedSection?.chapters[chapterIndex];
  const selectedPage: Page | undefined = !isNaN(pageIndex) ? selectedChapter?.pages[pageIndex] : undefined;

  const handleGenerateAll = async () => {
    setIsGeneratingAll(true);
    setError(null);
    let currentBook = JSON.parse(JSON.stringify(bookData));

    try {
      // Parallelize Pillars at the start
      const sectionPromises = currentBook.map(async (section: Section, sIdx: number) => {
        setGenProgress(prev => ({ ...prev, pillar: `Architecting: ${section.title}`, step: sIdx + 1 }));
        
        // Stage 1: The Brains maps the section
        const titlesData = await generateSectionPageTitles(section.title, section.chapters.map(c => c.title));
        
        // Process chapters sequentially within the pillar to maintain flow, 
        // but pillars themselves run in parallel
        for (let c = 0; c < section.chapters.length; c++) {
          const chapter = section.chapters[c];
          setGenProgress(prev => ({ ...prev, domain: `Narrating: ${chapter.title}` }));
          
          const match = titlesData.find(t => t.chapterTitle === chapter.title);
          if (match) {
            chapter.pages = match.titles.map(t => ({ title: t, content: '' }));
          }

          const content = await generateChapterContent(section.title, chapter.title, chapter.pages.map(p => p.title));
          chapter.pages.forEach(p => {
            const cMatch = content.find(lc => lc.title === p.title);
            if (cMatch) p.content = cMatch.content;
          });

          // Sync local state copy
          setBookData(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            next[sIdx].chapters[c] = chapter;
            return next;
          });
        }
      });

      await Promise.all(sectionPromises);
    } catch (err: any) {
      setError(`Expedition Aborted: ${err.message}`);
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const handlePlayAudio = () => {
    if (selectedPage?.content) {
      playExecutiveSummary(selectedPage.content);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex selection:bg-sky-500/30 selection:text-white relative">
      {isGeneratingAll && (
        <LoadingOverlay message={`${genProgress.pillar} — ${genProgress.domain}`} />
      )}
      
      <Sidebar
        book={bookData}
        selectedPath={selectedPath}
        onSelectPath={setSelectedPath}
        onDownload={() => downloadBookAsHtml(bookData)}
      />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <header className="flex justify-between items-center mb-8 glass-card p-5 rounded-2xl border-sky-500/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"></div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-sky-500/10 border border-sky-400/20 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-900/20">
              <SparklesIcon className="w-8 h-8 text-sky-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
                Ice Wall Expedition
              </h1>
              <p className="text-[10px] font-mono-tech text-sky-400/60 uppercase tracking-[0.4em] mt-2">Archetype Synchronization Protocol v5.0</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleGenerateAll}
              disabled={isGeneratingAll}
              className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all frost-glow disabled:opacity-50 disabled:cursor-not-allowed border border-sky-400/50"
            >
              {isGeneratingAll ? 'BREACHING...' : 'UNCOVER THE FORGOTTEN'}
            </button>
            <button 
              onClick={() => downloadBookAsHtml(bookData)}
              className="px-6 py-3 bg-slate-900/50 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-slate-700 hover:border-sky-500/30"
            >
              <DownloadIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {error && (
            <div className="absolute top-0 left-0 right-0 z-50 p-5 bg-red-950/80 border border-red-500/50 text-red-200 rounded-2xl backdrop-blur-xl animate-pulse shadow-2xl flex items-center gap-4">
              <div className="bg-red-500 text-white p-2 rounded-lg font-black text-xs uppercase">Crit</div>
              <span className="font-semibold text-sm">{error}</span>
            </div>
          )}
          
          <div className="h-full">
            {selectedChapter ? (
              <Editor
                section={selectedSection}
                chapter={selectedChapter}
                page={selectedPage}
                sectionNumber={sectionIndex + 1}
                chapterNumber={chapterIndex + 1}
                pageNumber={!isNaN(pageIndex) ? pageIndex + 1 : undefined}
                error={null}
                onPageContentChange={(content) => {
                   setBookData(prev => {
                     const next = JSON.parse(JSON.stringify(prev));
                     next[sectionIndex].chapters[chapterIndex].pages[pageIndex].content = content;
                     return next;
                   });
                }}
                onSelectPage={(idx) => setSelectedPath(`${sectionIndex}-${chapterIndex}-${idx}`)}
                onAutoGenerateChapter={async () => {
                   setError(null);
                   try {
                     const content = await generateChapterContent(selectedSection.title, selectedChapter.title, selectedChapter.pages.map(p => p.title));
                     setBookData(prev => {
                       const next = JSON.parse(JSON.stringify(prev));
                       next[sectionIndex].chapters[chapterIndex].pages = content;
                       return next;
                     });
                   } catch (e: any) {
                     setError(e.message);
                   }
                }}
                chapterGenerationStatus={{ active: false, message: '' }}
                onAudioSummary={handlePlayAudio}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-700 font-mono-tech uppercase tracking-widest opacity-30">
                <div className="w-32 h-1 bg-sky-900 mb-6 animate-pulse"></div>
                Initializing Expedition HUD
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/App.tsx
================================================================================

import React, { useState, useContext, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Cpu, ShieldAlert, Sparkles, Terminal, ArrowLeft, ExternalLink, Grid } from 'lucide-react';
import { Auth0Provider } from '@auth0/auth0-react';
import { datadogLogs } from '@datadog/browser-logs';
import { Analytics } from '@vercel/analytics/react';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider, DataContext } from './context/DataContext';
import { StripeDataProvider } from './components/StripeDataProvider';
import { MoneyMovementProvider } from './components/MoneyMovementContext';

// Layout & Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SApp from './components/SApp';
import { View } from './types';
import Paywall from './components/Paywall';

// Views & Components
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import BudgetsView from './components/BudgetsView';
import FinancialGoalsView from './components/FinancialGoalsView';
import CreditHealthView from './components/CreditHealthView';
import PersonalizationView from './components/PersonalizationView';
import AccountsView from './components/AccountsView';
import InvestmentsView from './components/InvestmentsView';
import CryptoView from './components/CryptoView';
import AlgoTradingLab from './components/AlgoTradingLab';
import ForexArena from './components/ForexArena';
import CommoditiesExchange from './components/CommoditiesExchange';
import RealEstateEmpire from './components/RealEstateEmpire';
import ArtCollectibles from './components/ArtCollectibles';
import DerivativesDesk from './components/DerivativesDesk';
import VentureCapitalDesk from './components/VentureCapitalDesk';
import PrivateEquityLounge from './components/PrivateEquityLounge';
import TaxOptimizationChamber from './components/TaxOptimizationChamber';
import LegacyBuilder from './components/LegacyBuilder';
import CorporateCommandView from './components/CorporateCommandView';
import ModernTreasuryView from './components/ModernTreasuryView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import QuantumWeaverView from './components/QuantumWeaverView';
import AgentMarketplaceView from './components/MarketplaceView';
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import ConciergeService from './components/ConciergeService';
import SovereignWealth from './components/SovereignWealth';
import PhilanthropyHub from './components/PhilanthropyHub';
import TheVisionView from './components/TheVisionView';
import AIAdvisorView from './components/AIAdvisorView';
import { AIInsights } from './components/AIInsights';
import SecurityView from './components/SecurityView';
import ComplianceOracleView from './components/ComplianceOracleView';
import GlobalPositionMap from './components/GlobalPositionMap';
import GlobalSsiHubView from './components/GlobalSsiHubView';
import CustomerDashboard from './components/CustomerDashboard';
import VerificationReportsView from './components/VerificationReportsView';
import FinancialReportingView from './components/FinancialReportingView';
import TheBookView from './components/TheBookView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import VoiceControl from './components/VoiceControl';
import LandingPage from './components/LandingPage';
import QuantumAssets from './components/QuantumAssets';
import CitibankAccountsView from './components/CitibankAccountsView';
import CitibankAccountProxyView from './components/CitibankAccountProxyView';
import CitibankBillPayView from './components/CitibankBillPayView';
import CitibankCrossBorderView from './components/CitibankCrossBorderView';
import CitibankPayeeManagementView from './components/CitibankPayeeManagementView';
import CitibankStandingInstructionsView from './components/CitibankStandingInstructionsView';
import CitibankDeveloperToolsView from './components/CitibankDeveloperToolsView';
import CitibankEligibilityView from './components/CitibankEligibilityView';
import CitibankUnmaskedDataView from './components/CitibankUnmaskedDataView';
import PlaidIdentityView from './components/PlaidIdentityView';
import PlaidCRAMonitoringView from './components/PlaidCRAMonitoringView';
import { PlaidInstitutionsExplorer } from './components/PlaidInstitutionsExplorer';
import { PlaidItemManagementView } from './components/PlaidItemManagementView';
import PlaidMainDashboard from './components/PlaidMainDashboard';
import StripeNexusView from './components/StripeNexusView';
import CounterpartyDashboardView from './components/CounterpartyDashboardView';
import VirtualAccountsDashboard from './components/VirtualAccountsDashboard';
import CorporateActionsNexusView from './components/CorporateActionsNexusView';
import { CreditNoteLedger } from './components/CreditNoteLedger';
import ReconciliationHubView from './components/ReconciliationHubView';
import GEINDashboard from './components/GEIN_DashboardView';
import CardholderManagement from './components/CardholderManagement';
import UniversalObjectInspector from './components/UniversalObjectInspector';
import { LoginView } from './components/LoginView';
import { PlaidClient } from './lib/plaidClient';
import DeveloperHubView from './components/DeveloperHubView';
import ApiPlaygroundView from './components/ApiPlaygroundView';
import BusinessDemoView from './components/BusinessDemoView';

// --- ALL COMPONENT IMPORTS FOR DIRECT ACCESS ---
import AccountDetails from './components/AccountDetails';
import AccountList from './components/AccountList';
import AccountStatementGrid from './components/AccountStatementGrid';
import { AccountVerificationModal } from './components/AccountVerificationModal';
import ACHDetailsDisplay from './components/ACHDetailsDisplay';
import AICommandLog from './components/AICommandLog';
import AIPredictionWidget from './components/AIPredictionWidget';
import AssetCatalog from './components/AssetCatalog';
import AutomatedSweepRules from './components/AutomatedSweepRules';
import BalanceReportChart from './components/BalanceReportChart';
import BalanceTransactionTable from './components/BalanceTransactionTable';
import CardDesignVisualizer from './components/CardDesignVisualizer';
import { ChargeDetailModal } from './components/ChargeDetailModal';
import ChargeList from './components/ChargeList';
import ConductorConfigurationView from './components/ConductorConfigurationView';
import CounterpartyDetails from './components/CounterpartyDetails';
import { CounterpartyForm } from './components/CounterpartyForm';
import DisruptionIndexMeter from './components/DisruptionIndexMeter';
import DocumentUploader from './components/DocumentUploader';
import { DownloadLink } from './components/DownloadLink';
import EarlyFraudWarningFeed from './components/EarlyFraudWarningFeed';
import ElectionChoiceForm from './components/ElectionChoiceForm';
import EventNotificationCard from './components/EventNotificationCard';
import ExpectedPaymentsTable from './components/ExpectedPaymentsTable';
import ExternalAccountCard from './components/ExternalAccountCard';
import ExternalAccountForm from './components/ExternalAccountForm';
import ExternalAccountTable from './components/ExternalAccountsTable';
import { FinancialAccountCard } from './components/FinancialAccountCard';
import IncomingPaymentDetailList from './components/IncomingPaymentDetailList';
import { InvestmentForm } from './components/InvestmentForm';
import InvoiceFinancingRequest from './components/InvoiceFinancingRequest';
import PaymentInitiationForm from './components/PaymentInitiationForm';
import PaymentMethodDetails from './components/PaymentMethodDetails';
import PaymentOrderForm from './components/PaymentOrderForm';
import PayoutsDashboard from './components/PayoutsDashboard';
import PnLChart from './components/PnLChart';
import RefundForm from './components/RefundForm';
import RemittanceInfoEditor from './components/RemittanceInfoEditor';
import ReportingView from './components/ReportingView';
import { ReportRunGenerator } from './components/ReportRunGenerator';
import ReportStatusIndicator from './components/ReportStatusIndicator';
import ResourceGraphView from './components/ResourceGraphView';
import SchemaExplorer from './components/SchemaExplorer';
import SecurityComplianceView from './components/SecurityComplianceView';
import SsiEditorForm from './components/SsiEditorForm';
import StripeStatusBadge from './components/StripeStatusBadge';
import StructuredPurposeInput from './components/StructuredPurposeInput';
import SubscriptionList from './components/SubscriptionList';
import TimeSeriesChart from './components/TimeSeriesChart';
import TradeConfirmationModal from './components/TradeConfirmationModal';
import TransactionFilter from './components/TransactionFilter';
import TransactionList from './components/TransactionList';
import { TreasuryTransactionList } from './components/TreasuryTransactionList';
import TreasuryView from './components/TreasuryView';
import VentureCapitalDeskView from './components/VentureCapitalDeskView';
import VirtualAccountForm from './components/VirtualAccountForm';
import VirtualAccountsTable from './components/VirtualAccountsTable';
import WebhookSimulator from './components/WebhookSimulator';

// --- FIXED Wrapper Components ---
type WrapperProps = {
  Component: React.ComponentType<any>;
  props?: any;
};

const Wrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  return <Component {...props} />;
};

const ModalWrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Component
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      {...props}
    />
  );
};

const DataContextWrapper: React.FC<{ Component: React.ComponentType<any>; extraProps?: any }> = ({ Component, extraProps = {} }) => {
  const dataContext = useContext(DataContext);
  const mockContext = {
    setActiveView: () => {},
    impactData: { treesPlanted: 0, progressToNextTree: 0 },
  };
  const props = { ...(dataContext || mockContext), ...extraProps };
  return <Component {...props} />;
};

const AIIntentStub: React.FC<{ view: View }> = ({ view }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in duration-700 bg-gray-950/50 rounded-3xl border border-gray-800">
      <div className="w-24 h-24 bg-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        <Sparkles className="text-cyan-400 w-12 h-12 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-mono">
          Module Ingress: {view.replace(/-/g, '_').toUpperCase()}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed font-mono">
          The Sovereign AI Core is compiling the high-frequency logic for this specific subsystem. Targeting zero-latency node deployment in the next epoch.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
          <Terminal size={14} /> STATUS: COMPILING_INTENT
        </div>
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
          <ShieldAlert size={14} /> AUTH: VERIFIED
        </div>
      </div>
    </div>
  );
};

const MonetizationOverlay = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { sovereignCredits } = context;
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sovereign Balance:</span>
      <span className="text-cyan-400 font-mono text-lg font-bold tracking-tighter">
        {typeof sovereignCredits === 'number' ? sovereignCredits.toLocaleString() : '0'} SC
      </span>
    </div>
  );
};

const SAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (datadogLogs && datadogLogs.logger) {
      datadogLogs.logger.info('App View Loaded', { name: 'SovereignNexus', id: 'init_view' });
    }
  }, []);

  if (!dataContext || !authContext) return null;
  const { isAuthenticated, isLoading: authLoading } = authContext;
  const { isLoading: dataLoading, activeView, setActiveView, isSubscribed } = dataContext;

  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-6">
        <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />
        <h1 className="text-3xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase font-mono">
          Nexus OS // Syncing
        </h1>
        <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-progress-flow"></div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          .animate-progress-flow { animation: flow 2s linear infinite; width: 50%; }
        ` }} />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const renderView = () => {
    if (!isSubscribed) {
      return <Paywall />;
    }
    switch (activeView) {
      case View.Dashboard: return <Dashboard />;
      case View.Transactions: return <TransactionsView />;
      case View.SendMoney: return <SendMoneyView />;
      case View.Budgets: return <BudgetsView />;
      case View.FinancialGoals: return <FinancialGoalsView />;
      case View.CreditHealth: return <CreditHealthView />;
      case View.Personalization: return <PersonalizationView />;
      case View.Accounts: return <AccountsView />;
      case View.Investments: return <InvestmentsView />;
      case View.CryptoWeb3: return <CryptoView />;
      case View.AlgoTradingLab: return <AlgoTradingLab />;
      case View.ForexArena: return <ForexArena />;
      case View.CommoditiesExchange: return <CommoditiesExchange />;
      case View.RealEstateEmpire: return <RealEstateEmpire />;
      case View.ArtCollectibles: return <ArtCollectibles />;
      case View.DerivativesDesk: return <DerivativesDesk />;
      case View.VentureCapital: return <VentureCapitalDesk />;
      case View.PrivateEquity: return <PrivateEquityLounge />;
      case View.TaxOptimization: return <TaxOptimizationChamber />;
      case View.LegacyBuilder: return <LegacyBuilder />;
      case View.CorporateCommand: return <CorporateCommandView setActiveView={setActiveView} />;
      case View.ModernTreasury: return <ModernTreasuryView />;
      case View.OpenBanking: return <OpenBankingView />;
      case View.FinancialDemocracy: return <FinancialDemocracyView />;
      case View.AIAdStudio: return <AIAdStudioView />;
      case View.QuantumWeaver: return <QuantumWeaverView />;
      case View.AgentMarketplace: return <AgentMarketplaceView />;
      case View.APIStatus: return <APIIntegrationView />;
      case View.Settings: return <SettingsView />;
      case View.QuantumAssets: return <QuantumAssets />;
      case View.SovereignWealth: return <SovereignWealth />;
      case View.Philanthropy: return <PhilanthropyHub />;
      case View.TheVision: return <TheVisionView />;
      case View.AIAdvisor: return <AIAdvisorView />;
      case View.AIInsights: return <AIInsights />;
      case View.SecurityCenter: return <SecurityView />;
      case View.ComplianceOracle: return <ComplianceOracleView />;
      case View.GlobalPositionMap: return <GlobalPositionMap />;
      case View.GlobalSsiHub: return <GlobalSsiHubView />;
      case View.CustomerDashboard: return <CustomerDashboard />;
      case View.VerificationReports: return <VerificationReportsView customerId="c1" />;
      case View.FinancialReporting: return <FinancialReportingView />;
      case View.TheBook: return <TheBookView />;
      case View.KnowledgeBase: return <KnowledgeBaseView />;
      case View.CitibankAccounts: return <CitibankAccountsView />;
      case View.CitibankAccountProxy: return <CitibankAccountProxyView />;
      case View.CitibankBillPay: return <CitibankBillPayView />;
      case View.CitibankCrossBorder: return <CitibankCrossBorderView />;
      case View.CitibankPayeeManagement: return <CitibankPayeeManagementView />;
      case View.CitibankStandingInstructions: return <CitibankStandingInstructionsView />;
      case View.CitibankDeveloperTools: return <CitibankDeveloperToolsView />;
      case View.CitibankEligibility: return <CitibankEligibilityView />;
      case View.CitibankUnmaskedData: return <CitibankUnmaskedDataView accountIdsToUnmask={['acc_1']} />;
      case View.PlaidMainDashboard: return <PlaidMainDashboard />;
      case View.PlaidIdentity: return <PlaidIdentityView />;
      case View.PlaidCRAMonitoring: return <PlaidCRAMonitoringView />;
      case View.PlaidInstitutions: return <PlaidInstitutionsExplorer client={new PlaidClient()} />;
      case View.PlaidItemManagement: return <PlaidItemManagementView accessToken="mock_token" />;
      case View.StripeNexus: return <StripeNexusView />;
      case View.CounterpartyDashboard: return <CounterpartyDashboardView />;
      case View.VirtualAccounts: return <VirtualAccountsDashboard />;
      case View.SApp: return <SApp />;
      case View.CorporateActions: return <CorporateActionsNexusView />;
      case View.CreditNoteLedger: return <CreditNoteLedger />;
      case View.ReconciliationHub: return <ReconciliationHubView />;
      case View.GEINDashboard: return <GEINDashboard />;
      case View.CardholderManagement: return <CardholderManagement />;
      case View.SecurityCompliance: return <SecurityComplianceView />;
      case View.DeveloperHub: return <DeveloperHubView />;
      case View.SchemaExplorer: return <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} />;
      case View.ResourceGraph: return <ResourceGraphView />;
      case View.ApiPlayground: return <ApiPlaygroundView />;
      case View.VentureCapitalDeskView: return <VentureCapitalDeskView />;

      // --- Direct Component Access ---
      case View.AccountDetails: 
        return <Wrapper Component={AccountDetails} props={{ accountId: '1', customerId: 'c1' }} />;
      case View.AccountList: 
        return <Wrapper Component={AccountList} props={{ accounts: [] }} />;
      case View.AccountStatementGrid: 
        return <Wrapper Component={AccountStatementGrid} props={{ statementLines: [] }} />;
      case View.AccountVerificationModal: 
        return <ModalWrapper Component={AccountVerificationModal} props={{ externalAccount: {id: '1', verification_status: 'unverified' }, onSuccess: () => {}}} />;
      case View.ACHDetailsDisplay: 
        return <Wrapper Component={ACHDetailsDisplay} props={{ details: { routingNumber: '123', realAccountNumber: '456' } }} />;
      case View.AICommandLog: 
        return <AICommandLog />;
      case View.AIPredictionWidget: 
        return <AIPredictionWidget />;
      case View.AssetCatalog: 
        return <Wrapper Component={AssetCatalog} props={{ assets: [], onAssetSelected: () => {}, getAssetDetails: async () => ({}) }} />;
      case View.AutomatedSweepRules: 
        return <AutomatedSweepRules />;
      case View.BalanceReportChart: 
        return <Wrapper Component={BalanceReportChart} props={{ data: [] }} />;
      case View.BalanceTransactionTable: 
        return <Wrapper Component={BalanceTransactionTable} props={{ balanceTransactions: [] }} />;
      case View.CardDesignVisualizer: 
        return <Wrapper Component={CardDesignVisualizer} props={{ design: { id: 'd_1', physical_bundle: { features: {} } } }} />;
      case View.ChargeDetailModal: 
        return <ModalWrapper Component={ChargeDetailModal} props={{ charge: {id: 'ch_1', amount: 50000, currency: 'USD', status: 'succeeded'}, onClose: () => {}}} />;
      case View.ChargeList: 
        return <ChargeList />;
      case View.ConductorConfigurationView: 
        return <ConductorConfigurationView />;
      case View.CounterpartyDetails: 
        return <Wrapper Component={CounterpartyDetails} props={{ counterpartyId: 'cp_1' }} />;
      case View.CounterpartyForm: 
        return <Wrapper Component={CounterpartyForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.DisruptionIndexMeter: 
        return <Wrapper Component={DisruptionIndexMeter} props={{ indexValue: 50 }} />;
      case View.DocumentUploader: 
        return <Wrapper Component={DocumentUploader} props={{ documentableType: 'test', documentableId: '1' }} />;
      case View.DownloadLink: 
        return <Wrapper Component={DownloadLink} props={{ url: '#', filename: 'test.pdf' }} />;
      case View.EarlyFraudWarningFeed: 
        return <EarlyFraudWarningFeed />;
      case View.ElectionChoiceForm: 
        return <Wrapper Component={ElectionChoiceForm} props={{ availableChoices: {}, onSubmit: () => {}, onCancel: () => {} }} />;
      case View.EventNotificationCard: 
        return <Wrapper Component={EventNotificationCard} props={{ event: {} }} />;
      case View.ExpectedPaymentsTable: 
        return <ExpectedPaymentsTable />;
      case View.ExternalAccountCard: 
        return <Wrapper Component={ExternalAccountCard} props={{ account: {id: '1', account_details: [], routing_details: []}}} />;
      case View.ExternalAccountForm: 
        return <Wrapper Component={ExternalAccountForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.ExternalAccountsTable: 
        return <Wrapper Component={ExternalAccountTable} props={{ accounts: [] }} />;
      case View.FinancialAccountCard: 
        return <Wrapper Component={FinancialAccountCard} props={{ financialAccount: {id: 'fa_1', balance: { cash: {}}, supported_currencies: []}}} />;
      case View.IncomingPaymentDetailList: 
        return <IncomingPaymentDetailList />;
      case View.InvoiceFinancingRequest: 
        return <Wrapper Component={InvoiceFinancingRequest} props={{ onSubmit: () => {} }} />;
      case View.PaymentInitiationForm: 
        return <PaymentInitiationForm />;
      case View.PaymentMethodDetails: 
        return <Wrapper Component={PaymentMethodDetails} props={{ details: { type: 'card', card: {} }}} />;
      case View.PaymentOrderForm: 
        return <Wrapper Component={PaymentOrderForm} props={{ internalAccounts: [], externalAccounts: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.PayoutsDashboard: 
        return <PayoutsDashboard />;
      case View.PnLChart: 
        return <Wrapper Component={PnLChart} props={{ data: [], algorithmName: 'Test' }} />;
      case View.RefundForm: 
        return <RefundForm />;
      case View.RemittanceInfoEditor: 
        return <Wrapper Component={RemittanceInfoEditor} props={{ onChange: () => {} }} />;
      case View.ReportingView: 
        return <ReportingView />;
      case View.ReportRunGenerator: 
        return <ReportRunGenerator />;
      case View.ReportStatusIndicator: 
        return <Wrapper Component={ReportStatusIndicator} props={{ status: 'success' }} />;
      case View.SsiEditorForm: 
        return <Wrapper Component={SsiEditorForm} props={{ onSubmit: () => {}, onCancel: () => {} }} />;
      case View.StripeStatusBadge: 
        return <Wrapper Component={StripeStatusBadge} props={{ status: 'succeeded', objectType: 'charge' }} />;
      case View.StructuredPurposeInput: 
        return <Wrapper Component={StructuredPurposeInput} props={{ onChange: () => {}, value: null }} />;
      case View.SubscriptionList: 
        return <Wrapper Component={SubscriptionList} props={{ subscriptions: [] }} />;
      case View.TimeSeriesChart: 
        return <Wrapper Component={TimeSeriesChart} props={{ data: { labels: [], datasets: [] } }} />;
      case View.TradeConfirmationModal: 
        return (
          <ModalWrapper 
            Component={TradeConfirmationModal} 
            props={{ 
              settlementInstruction: { 
                messageId: 'NEX-INST-99281-Z',
                totalAmount: 12500000, // 125k
                currency: 'USD',
                creationDateTime: Date.now(),
                settlementDate: '2024-12-15',
                numberOfTransactions: 1,
                purpose: 'TREA'
              } 
            }} 
          />
        );
      case View.TransactionFilter: 
        return <Wrapper Component={TransactionFilter} props={{ onApplyFilters: () => {} }} />;
      case View.TransactionList: 
        return <Wrapper Component={TransactionList} props={{ transactions: [] }} />;
      case View.TreasuryTransactionList: 
        return <Wrapper Component={TreasuryTransactionList} props={{ transactions: [] }} />;
      case View.TreasuryView: 
        return <TreasuryView />;
      case View.UniversalObjectInspector: 
        return <Wrapper Component={UniversalObjectInspector} props={{ data: { status: "Nominal", uptime: "99.999%", load: "Balanced" } }} />;
      case View.VirtualAccountForm: 
        return <Wrapper Component={VirtualAccountForm} props={{ onSubmit: () => {}, isSubmitting: false }} />;
      case View.VirtualAccountsTable: 
        return <Wrapper Component={VirtualAccountsTable} props={{ onEdit: () => {}, onDelete: () => {} }} />;
      case View.VoiceControl: 
        return <DataContextWrapper Component={VoiceControl} />;
      case View.WebhookSimulator: 
        return <Wrapper Component={WebhookSimulator} props={{ stripeAccountId: 'acct_mock' }} />;

      default: return <AIIntentStub view={activeView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="relative flex flex-col flex-1 min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,#111,transparent)]">
          <div className="max-w-[1600px] mx-auto h-full min-h-0">
            {renderView()}
          </div>
        </main>
        <MonetizationOverlay />
        <Link 
          to="/modules"
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] group"
          title="Open AI Nexus"
        >
          <Grid size={20} className="group-hover:animate-spin-slow" />
        </Link>
      </div>
    </div>
  );
};

const AI_MODULES = [
  "https://admin08077-openapi.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-ai-ban-king-demo.static.hf.space",
  "https://admin08077-1233.static.hf.space",
  "https://admin08077-inventions.static.hf.space",
  "https://admin08077-gemini-app-citibank-demo-business-inc-google.static.hf.space",
  "https://admin08077-aibankdemo2.static.hf.space",
  "https://admin08077-airenderer.static.hf.space",
  "https://admin08077-book.static.hf.space",
  "https://admin08077-merrychristmas.static.hf.space",
  "https://admin08077-apiai.static.hf.space",
  "https://admin08077-projectatlas.static.hf.space",
  "https://admin08077-jocall3.static.hf.space",
  "https://admin08077-demob.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-static.static.hf.space",
  "https://admin08077-demoo.static.hf.space",
  "https://admin08077-webgenai.static.hf.space",
  "https://admin08077-aiab.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-app.static.hf.space",
  "https://admin08077-aib8nking.static.hf.space",
  "https://admin08077-bb.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-apps.static.hf.space",
  "https://admin08077-newwa.static.hf.space",
  "https://admin08077-jamesocallaghanprivatebank.hf.space",
  "https://admin08077-drip-faucet.static.hf.space",
  "https://admin08077-transactpro.hf.space",
  "https://admin08077-quantumbank.hf.space",
  "https://admin08077-test.hf.space"
];

const getModuleTitle = (url: string) => {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    // Remove .hf.space or .static.hf.space
    hostname = hostname.replace('.static.hf.space', '').replace('.hf.space', '');
    // Remove admin08077- prefix
    hostname = hostname.replace(/^admin\d+-/, '');
    // Replace hyphens with spaces
    const title = hostname.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return title || 'AI Module';
  } catch (e) {
    return 'AI Module';
  }
};

const AIModuleCard = ({ url, className }: { url: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const title = getModuleTitle(url);

  return (
    <div className={`flex flex-col w-full bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 group ${className || 'h-[500px]'}`}>
      <div className="px-4 py-3 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-sm font-mono font-bold text-gray-300 group-hover:text-cyan-400 transition-colors truncate max-w-[300px]">
            {title}
          </span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-white transition-colors">
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="relative flex-1 bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/20 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title={title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

const ExternalIframeCollection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % AI_MODULES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + AI_MODULES.length) % AI_MODULES.length);
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} transition-all duration-300 border-r border-gray-800 bg-gray-950 flex flex-col fixed md:relative z-20 h-full`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="font-mono font-bold text-gray-200 tracking-wider">MODULES</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white">
            <ArrowLeft size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {AI_MODULES.map((url, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-mono transition-all duration-200 flex items-center gap-3 ${
                activeIndex === index
                  ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300 border border-transparent'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeIndex === index ? 'bg-cyan-400 animate-pulse' : 'bg-gray-700'}`} />
              <span className="truncate">{getModuleTitle(url)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative">
        {/* Top Bar */}
        <div className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Terminal size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <div className="p-1.5 rounded-md bg-gray-900 group-hover:bg-gray-800 border border-gray-800 group-hover:border-gray-700">
                <ArrowLeft size={14} />
              </div>
              <span className="text-xs font-mono tracking-widest">RETURN TO OS</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-mono text-gray-400">
               MODULE {activeIndex + 1} / {AI_MODULES.length}
             </div>
          </div>
        </div>

        {/* Card Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center overflow-hidden relative">
           {/* Navigation Buttons (Desktop) */}
           <button 
             onClick={handlePrev}
             className="absolute left-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           </button>

           <button 
             onClick={handleNext}
             className="absolute right-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="rotate-180 group-hover:translate-x-1 transition-transform" />
           </button>

           {/* The Card */}
           <div className="w-full h-full max-w-[1400px] relative flex flex-col">
             <div className="flex-1 relative animate-in fade-in zoom-in-95 duration-500">
               <AIModuleCard 
                 key={activeIndex} 
                 url={AI_MODULES[activeIndex]} 
                 className="h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-gray-800" 
               />
             </div>
             
             {/* Mobile Nav */}
             <div className="flex md:hidden items-center justify-between mt-4 gap-4">
               <button onClick={handlePrev} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Prev</button>
               <button onClick={handleNext} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Next</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const theme = createTheme({ palette: { mode: 'dark' } });

function App() {
  return (
    <Auth0Provider
      domain="aibankinguniversity.us.auth0.com"
      clientId="fOkKYLJUrLnv7hInn8CVi3cHpjF7xPRp"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <AuthProvider>
        <DataProvider>
          <MoneyMovementProvider>
            <StripeDataProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/modules" element={<ExternalIframeCollection />} />
                    <Route path="/business-demo" element={<BusinessDemoView />} />
                    <Route path="*" element={<SAppLayout />} />
                  </Routes>
                </Router>
              </ThemeProvider>
            </StripeDataProvider>
          </MoneyMovementProvider>
        </DataProvider>
      </AuthProvider>
      <Analytics />
    </Auth0Provider>
  );
}

export default App;

================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/App.tsx
================================================================================

import React, { useState, useContext } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import InvestmentsView from './components/InvestmentsView';
import AIAdvisorView from './components/AIAdvisorView';
import SecurityView from './components/SecurityView';
import BudgetsView from './components/BudgetsView';
import VoiceControl from './components/VoiceControl';
import QuantumWeaverView from './components/QuantumWeaverView';
import AgentMarketplaceView from './components/MarketplaceView';
import { View } from './types';
import { DataContext } from './context/DataContext';
import CorporateCommandView from './components/CorporateCommandView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import AIImageStudioView from './components/AIImageStudioView';
import CashManagementView from './components/CashManagementView';
import CryptoView from './components/CryptoView';
import FinancialGoalsView from './components/FinancialGoalsView';
import TheVisionView from './components/TheVisionView';
import APIIntegrationView from './components/APIIntegrationView';
import RewardsView from './components/RewardsView';
import CreditHealthView from './components/CreditHealthView';
import SettingsView from './components/SettingsView';
import PersonalizationView from './components/PersonalizationView';
import CardCustomizationView from './components/CardCustomizationView';

const App: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("App must be used within a DataProvider.");
    }

    const { customBackgroundUrl, activeIllusion } = context;
    const [activeView, _setActiveView] = useState<View>(View.Dashboard);
    const [previousView, setPreviousView] = useState<View | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const setActiveView = (view: View) => {
        if (view !== activeView) {
            setPreviousView(activeView);
        }
        _setActiveView(view);
    };

    const renderActiveView = () => {
        switch (activeView) {
            case View.Dashboard: return <Dashboard setActiveView={setActiveView} />;
            case View.Transactions: return <TransactionsView />;
            case View.CashManagement: return <CashManagementView />;
            case View.SendMoney: return <SendMoneyView setActiveView={setActiveView} />;
            case View.Budgets: return <BudgetsView />;
            case View.Investments: return <InvestmentsView />;
            case View.AIAdvisor: return <AIAdvisorView previousView={previousView} />;
            case View.QuantumWeaver: return <QuantumWeaverView />;
            case View.AIAdStudio: return <AIAdStudioView />;
            case View.AIImageStudio: return <AIImageStudioView />;
            case View.Marketplace: return <AgentMarketplaceView />;
            case View.Personalization: return <PersonalizationView />;
            case View.CardCustomization: return <CardCustomizationView />;
            case View.Security: return <SecurityView />;
            case View.Goals: return <FinancialGoalsView />;
            case View.Crypto: return <CryptoView />;
            case View.CorporateCommand: return <CorporateCommandView />;
            case View.SASPlatforms: return <TheVisionView />;
            case View.APIIntegration: return <APIIntegrationView />;
            case View.OpenBanking: return <OpenBankingView />;
            case View.Rewards: return <RewardsView />;
            case View.CreditHealth: return <CreditHealthView />;
            case View.Settings: return <SettingsView />;
            case View.FinancialDemocracy: return <FinancialDemocracyView />;
            default: return <Dashboard setActiveView={setActiveView} />;
        }
    };

    const backgroundStyle: React.CSSProperties = customBackgroundUrl ? { backgroundImage: `url(${customBackgroundUrl})` } : {};

    return (
        <div id="app-container" style={backgroundStyle} className={`bg-cover bg-center bg-fixed ${activeIllusion === 'aurora' ? 'aurora-bg' : ''}`}>
             <div className={`flex h-screen bg-gray-950/80 text-gray-200 backdrop-blur-xl`}>
                <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden text-gray-200">
                    <Header onMenuClick={() => setIsSidebarOpen(prev => !prev)} setActiveView={setActiveView} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 relative custom-scrollbar">
                        {renderActiveView()}
                    </main>
                </div>
                <VoiceControl setActiveView={setActiveView} />
            </div>
             {/* Simple CSS for aurora effect */}
            {activeIllusion === 'aurora' && <style>{`
                .aurora-bg {
                    background: #030712;
                    position: relative;
                    overflow: hidden;
                }
                .aurora-bg::before, .aurora-bg::after {
                    content: '';
                    position: absolute;
                    width: 800px;
                    height: 800px;
                    border-radius: 50%;
                    filter: blur(150px);
                    opacity: 0.3;
                    mix-blend-mode: screen;
                    animation: aurora-flow 20s infinite linear;
                }
                .aurora-bg::before {
                    background: radial-gradient(circle, #06b6d4, transparent);
                    top: -20%; left: -20%;
                }
                .aurora-bg::after {
                    background: radial-gradient(circle, #4f46e5, transparent);
                    bottom: -20%; right: -20%;
                    animation-delay: -10s;
                }
                @keyframes aurora-flow {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(100px, 100px) rotate(180deg); }
                    100% { transform: translate(0, 0) rotate(360deg); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
            `}</style>}</div>
    );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/gatekeeper-bank-verification-ModernTreasury | ORIGINAL PATH: diplomat-bit-gatekeeper-bank-verification-ModernTreasury-c0701fa/App.tsx
================================================================================

import React, { useState } from 'react';
import { Input, Select } from './components/Input';
import { verifyExternalAccount } from './services/api';
import { ExternalAccount } from './types';
import { Shield, ArrowRight, Wallet, Banknote, Code2, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { StatusBadge } from './components/StatusBadge';

const App: React.FC = () => {
  // Form State
  const [authToken, setAuthToken] = useState('');
  const [externalAccountId, setExternalAccountId] = useState('');
  const [originatingAccountId, setOriginatingAccountId] = useState('');
  const [paymentType, setPaymentType] = useState<'ach' | 'eft' | 'rtp'>('ach');
  const [currency, setCurrency] = useState('USD');

  // UI State
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ExternalAccount | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await verifyExternalAccount({
        externalAccountId,
        originatingAccountId,
        paymentType,
        currency,
        authToken
      });
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during verification initialization.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">
              Gatekeeper <span className="text-slate-500 font-normal">| Bank Verification</span>
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM OPERATIONAL
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
              <div className="mb-6 border-b border-slate-800 pb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-blue-500" />
                  Verification Config
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Initiate a micro-deposit verification for an external account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Auth Section */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/60 space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Credentials
                  </h3>
                  <Input
                    label="Basic Auth Token"
                    subLabel="Base64 Encoded (ID:Key)"
                    type="password"
                    placeholder="ui=="
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    required
                  />
                </div>

                {/* Path Params */}
                <div className="space-y-4">
                  <Input
                    label="External Account ID"
                    placeholder="e.g. 182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e"
                    value={externalAccountId}
                    onChange={(e) => setExternalAccountId(e.target.value)}
                    required
                  />
                  
                  <Input
                    label="Originating Account ID"
                    placeholder="e.g. 9182bd5e-6e1a-4fe4-a799-aa6d9a6ab26e"
                    value={originatingAccountId}
                    onChange={(e) => setOriginatingAccountId(e.target.value)}
                    required
                  />
                </div>

                {/* Body Params */}
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Payment Type"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as any)}
                  >
                    <option value="ach">ACH</option>
                    <option value="eft">EFT</option>
                    <option value="rtp">RTP</option>
                  </Select>

                  <Input
                    label="Currency"
                    placeholder="USD"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-900/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Initiating...
                      </>
                    ) : (
                      <>
                        Initiate Verification
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Output / Console */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Context Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-500" />
                Response Console
              </h2>
              {response && (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                  POST 200 OK
                </span>
              )}
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-400">Request Failed</h4>
                  <p className="text-sm text-red-300/80 mt-1 font-mono">{error}</p>
                </div>
              </div>
            )}

            {/* Success State */}
            {response ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                
                {/* High Level Info Card */}
                <div className="p-6 border-b border-slate-800 bg-slate-800/20">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {response.party_name || 'Unknown Party'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400 font-mono">
                         ID: {response.id}
                         <button onClick={() => copyToClipboard(response.id)} className="hover:text-blue-400 transition-colors">
                            <Copy className="w-3 h-3" />
                         </button>
                      </div>
                    </div>
                    <StatusBadge status={response.verification_status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Bank Name</div>
                      <div className="font-medium flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-slate-400" />
                        {response.routing_details?.[0]?.bank_name || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Account Info</div>
                      <div className="font-medium font-mono text-slate-300">
                        •••• {response.account_details?.[0]?.account_number_safe || '????'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Raw JSON View */}
                <div className="p-0 bg-[#0d1117]">
                  <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <span className="text-xs font-mono text-slate-500">Payload Preview</span>
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs font-mono text-blue-100/90 leading-relaxed max-h-[400px]">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-600 bg-slate-900/30">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                  <Code2 className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-sm font-medium">Awaiting Request</p>
                <p className="text-xs max-w-xs text-center mt-2 opacity-60">
                  Fill out the parameters on the left to trigger a real API call to Modern Treasury.
                </p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

================================================================================
// APPENDED FROM REPO: diplomat-bit/illi | ORIGINAL PATH: diplomat-bit-illi-d81a5ee/App.tsx
================================================================================


import React, { useState, useMemo, useEffect, useRef } from 'react';
import { performRitual, RitualStep, quickExpand } from './services/geminiService';
import { TriangularChart } from './components/TriangularChart';

// Large subset of the registry to demonstrate the "loop through all" request
const RAW_DATA = `id,displayName,appId,homepage,createdDateTime,state,certificateExpiryStatus,activeCertificateExpiryDate,appStatus,appVisibility,appProxy,identifierUri
00a67483-ea0d-4bfa-a19b-17ae35e97fe3,ADP,3f18b202-a866-4c1f-b9c0-6598390a2092,https://fed.adp.com/affwebservices/public/saml2assertionconsumer?metadata=etime.adp|ISV9.2|primary|z,05/04/2022,Activated,,,Enabled,Visible,No,3f18b202-a866-4c1f-b9c0-6598390a2092
00b4db41-9f4b-4f95-96df-8a8436aee693,Terraform Enterprise,fd681d32-9e97-4876-a58f-05269cf838e4,https://TFE_HOSTNAME.com/users/saml/auth?metadata=terraformenterprise|ISV9.2|primary|z,05/04/2022,Activated,,,Enabled,Visible,No,fd681d32-9e97-4876-a58f-05269cf838e4
00f21adf-4610-4184-b930-c5c5b0bd5f8a,jocall3-13-325f9500-3bd3-48fe-b130-806f56e2e7cc,2e8265ff-5066-4e5d-ae61-dbcc32816115,https://jocall3-13-325f9500-3bd3-48fe-b130-806f56e2e7cc,04/10/2022,Activated,,,Enabled,Visible,No,2e8265ff-5066-4e5d-ae61-dbcc32816115
012b9292-17c5-4ed1-a899-e831b1088a22,Microsoft Substrate Management,98db8bd6-0cc0-4e67-9de5-f187f1cd1b41,,04/13/2022,Activated,,,Enabled,Visible,No,98db8bd6-0cc0-4e67-9de5-f187f1cd1b41
0174c5a1-66f3-4929-913b-dfb7afe762ab,Azure Data Factory,0947a342-ab4a-43be-93b3-b8243fc161e5,,04/15/2022,Activated,,,Enabled,Visible,No,0947a342-ab4a-43be-93b3-b8243fc161e5
0208605f-08b1-492b-a0fd-ac6294e14b1f,Azure Machine Learning Singularity,607ece82-f922-494f-88b8-30effaf12214,,03/28/2022,Activated,,,Enabled,Visible,No,607ece82-f922-494f-88b8-30effaf12214
0249afa8-c384-4bbd-ba62-51be0d7cce63,HealthBot-RP,6db4d6bb-6649-4dc2-84b7-0b5c6894031e,,04/15/2022,Activated,,,Enabled,Visible,No,6db4d6bb-6649-4dc2-84b7-0b5c6894031e
028daf06-3ca2-4f3f-8b6e-442b8d945daf,Microsoft.MileIQ.RESTService,b692184e-b47f-4706-b352-84b288d2d9ee,,04/13/2022,Deactivated,,,Disabled,Visible,No,b692184e-b47f-4706-b352-84b288d2d9ee
029bfbeb-281e-43ea-8755-73fa84943a44,Microsoft Mobile Application Management Backend,354b5b6d-abd6-4736-9f51-1be80049b91f,,04/13/2022,Deactivated,,,Disabled,Visible,No,354b5b6d-abd6-4736-9f51-1be80049b91f
038cb5e8-15d7-4f48-9004-e6d59f9c5dd7,AzureDatabricks,2ff814a6-3304-4ab8-85cb-cd0e6f879c1d,,04/07/2022,Activated,,,Enabled,Visible,No,2ff814a6-3304-4ab8-85cb-cd0e6f879c1d
039d6906-ed43-42ca-bbf4-ee91e85b4bf8,Azure Machine Learning Services,18a66f5f-dbdf-4c17-9dd7-1634712a9cbe,,03/28/2022,Activated,,,Enabled,Visible,No,18a66f5f-dbdf-4c17-9dd7-1634712a9cbe
03d41fe2-06b6-43d4-b181-af146f8e3e7f,Azure Notification Service,b503eb83-1222-4dcc-b116-b98ed5216e05,,03/28/2022,Activated,,,Enabled,Visible,No,b503eb83-1222-4dcc-b116-b98ed5216e05
043d80c6-801d-40db-bc46-b570b9787d6e,Application Insights API,f5c26e74-f226-4ae8-85f0-b4af0080ac9e,,03/28/2022,Activated,,,Enabled,Visible,No,f5c26e74-f226-4ae8-85f0-b4af0080ac9e`;

interface EntityExpansion {
  app: any;
  steps: RitualStep[];
  complete: boolean;
  id: string;
}

const App: React.FC = () => {
  const [expansions, setExpansions] = useState<EntityExpansion[]>([]);
  const [isTranscending, setIsTranscending] = useState(false);
  const [currentAppIdx, setCurrentAppIdx] = useState(-1);
  const [flashMsg, setFlashMsg] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const apps = useMemo(() => {
    const lines = RAW_DATA.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const obj: any = {};
      headers.forEach((h, i) => {
        let val = values[i] || "";
        if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
        obj[h] = val;
      });
      return obj;
    });
  }, []);

  const transcendAll = async () => {
    if (isTranscending) return;
    setIsTranscending(true);
    setExpansions([]);
    setFlashMsg("THE VEIL IS DISSOLVING...");

    for (let i = 0; i < apps.length; i++) {
      const app = apps[i];
      setCurrentAppIdx(i);
      
      const newExpansion: EntityExpansion = { app, steps: [], complete: false, id: app.id || Math.random().toString() };
      setExpansions(prev => [...prev, newExpansion]);

      try {
        await performRitual(app, (step) => {
          setExpansions(prev => {
            const next = [...prev];
            const target = next.find(e => e.id === newExpansion.id);
            if (target) target.steps = [...target.steps, step];
            return next;
          });
        });
        
        setExpansions(prev => {
          const next = [...prev];
          const target = next.find(e => e.id === newExpansion.id);
          if (target) target.complete = true;
          return next;
        });

        // Occasional flavor text
        if (i % 3 === 0) {
          const tip = await quickExpand(app.displayName);
          setFlashMsg(tip || "");
        }

      } catch (err: any) {
        setExpansions(prev => {
          const next = [...prev];
          const target = next.find(e => e.id === newExpansion.id);
          if (target) {
             target.steps.push({ 
               stage: 6, title: "Paradox Encountered", 
               vision: `Critical logic collapse: ${err.message}`, 
               model: "Void", type: 'text' 
             });
             target.complete = true;
          }
          return next;
        });
      }
      
      // Auto-scroll to latest
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      await new Promise(r => setTimeout(r, 500));
    }
    setIsTranscending(false);
    setFlashMsg("EXPANSION TOTAL.");
  };

  return (
    <div className="min-h-screen p-4 md:p-12 flex flex-col gap-12 trip-bg overflow-x-hidden selection:bg-fuchsia-500 selection:text-white">
      
      {/* HUD */}
      <header className="glass rounded-[4rem] p-12 flex flex-col md:flex-row justify-between items-center gap-8 border-white/20 shadow-[0_0_100px_rgba(0,255,255,0.1)] relative">
        <div className="z-10 text-center md:text-left">
          <h1 className="text-8xl font-black italic tracking-tighter liquid-text leading-none mb-4 uppercase">
            Hyper<br/>Loop
          </h1>
          <div className="flex items-center gap-4 text-cyan-400 font-bold uppercase tracking-[0.4em] text-[10px]">
            <span>Registry Batch: {apps.length} Entities</span>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-6 z-10">
          {flashMsg && (
            <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 px-6 py-3 rounded-full text-sm font-black italic text-fuchsia-300 animate-bounce shadow-[0_0_30px_rgba(255,0,255,0.2)] max-w-xs text-center">
              "{flashMsg}"
            </div>
          )}
          <button 
            onClick={transcendAll}
            disabled={isTranscending}
            className={`group relative glass melt px-12 py-5 rounded-full text-sm font-black uppercase tracking-[0.5em] transition-all overflow-hidden ${
              isTranscending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-fuchsia-600/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 text-white drop-shadow-md">
              {isTranscending ? 'Expanding...' : 'Break the Veil'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Hallucination Feed */}
      <main className="flex-1 flex flex-col gap-12">
        {expansions.length === 0 && !isTranscending && (
          <div className="flex-1 glass rounded-[5rem] flex flex-col items-center justify-center text-center p-24 group min-h-[60vh]">
            <i className="fa-solid fa-bahai text-[12rem] text-white/5 group-hover:text-cyan-500/20 transition-all duration-[2000ms] group-hover:rotate-[360deg] animate-spin-slow"></i>
            <h3 className="mt-12 text-4xl font-black text-white/10 uppercase tracking-[1em]">Empty Space</h3>
            <p className="text-white/5 italic mt-4 text-xl tracking-widest">Click the button to feed the machine elves</p>
          </div>
        )}

        <div className="space-y-24 pb-32">
          {expansions.map((ex, idx) => (
            <article key={ex.id} className="animate-in fade-in zoom-in duration-1000 relative">
              {/* Entity Context Header */}
              <div className="glass rounded-[3rem] p-10 mb-8 border-l-[20px] border-cyan-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[10px] font-black text-cyan-400 tracking-[0.5em] uppercase mb-2 block">Source #{idx + 1}</span>
                    <h2 className="text-6xl font-black text-white italic tracking-tighter liquid-text">{ex.app.displayName}</h2>
                    <p className="font-mono text-xs text-white/30 mt-2 uppercase tracking-widest">{ex.app.appId}</p>
                  </div>
                  {!ex.complete && (
                    <div className="animate-spin text-4xl text-fuchsia-500 opacity-50">
                      <i className="fa-solid fa-dharmachakra"></i>
                    </div>
                  )}
                </div>
              </div>

              {/* Ritual Steps Column */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {ex.steps.map((step, sIdx) => (
                  <div key={sIdx} className="glass rounded-[2.5rem] p-8 animate-in slide-in-from-bottom-8 duration-700 hover:border-white/30 transition-all group overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-black text-fuchsia-400 group-hover:scale-125 transition-transform">
                        {step.stage}
                      </div>
                      <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{step.title}</h4>
                    </div>

                    {step.type === 'image' ? (
                      <div className="relative group/img rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-fuchsia-500/20">
                        {step.imageData ? (
                          <img src={step.imageData} alt="Expansion" className="w-full h-auto filter saturate-150 contrast-125 melt group-hover/img:scale-110 transition-transform duration-[3000ms]" />
                        ) : (
                          <div className="aspect-square bg-white/5 flex items-center justify-center">
                            <i className="fa-solid fa-palette text-4xl text-white/10 animate-pulse"></i>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className={`italic text-white/80 leading-relaxed font-medium ${step.stage === 5 ? 'text-2xl text-yellow-300' : 'text-lg'}`}>
                        "{step.vision}"
                      </p>
                    )}

                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-30">
                       <span className="text-[8px] font-mono uppercase tracking-tighter">Layer: {step.model}</span>
                       <i className="fa-solid fa-wave-square text-[8px] text-cyan-500"></i>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connector Line */}
              <div className="absolute -bottom-16 left-1/2 w-px h-16 bg-gradient-to-b from-white/20 to-transparent"></div>
            </article>
          ))}
          <div ref={endRef} />
        </div>
      </main>

      {/* Persistent Background Geometry */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 pointer-events-none opacity-10 z-0">
        <TriangularChart n={20} />
      </div>

      <footer className="mt-auto text-center p-20 border-t border-white/5 opacity-40">
        <div className="liquid-text font-black text-[12px] uppercase tracking-[1.5em] mb-4">The Collective Hallucination Persistent Log</div>
        <p className="text-[10px] text-white/20 font-mono tracking-widest">
          Every loop is a circle. Every circle is a sphere. Every sphere is a bit.<br/>
          © 2024 Hyperspace Registry Logic
        </p>
      </footer>
    </div>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/App.tsx
================================================================================

import React, { useState, useContext, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Outlet, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Cpu, AlertTriangle } from 'lucide-react';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider, DataContext } from './context/DataContext';
import { StripeDataProvider } from './components/StripeDataContext';
import { MoneyMovementProvider } from './components/MoneyMovementContext';

// Layout
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { View } from './types';
import { PlaidClient } from './lib/plaidClient';

// --- ALL VIEW COMPONENTS ---
import AccountDetails from './components/AccountDetails';
import AccountList from './components/AccountList';
import AccountsDashboardView from './components/AccountsDashboardView';
import Dashboard from './components/Dashboard';
import { LoginView } from './components/LoginView';
import SSOView from './components/SSOView';
import CitiAuthGate from './components/CitiAuthGate';
import ResourceGraphView from './components/ResourceGraphView';
import ComplianceOracleView from './components/ComplianceOracleView';

// --- Component Registry & Dynamic Loading ---
const modules = import.meta.glob('./components/*.tsx', { eager: true });

const getComponentForView = (view: string) => {
    // 1. Manual Overrides
    const overrides: Record<string, string> = {
        [View.CardPrograms]: 'MarqetaDashboardView',
        [View.Payments]: 'StripeDashboardView',
        [View.StripeNexus]: 'StripeNexusView',
        [View.VentureCapital]: 'VentureCapitalDesk',
        [View.PrivateEquity]: 'PrivateEquityLounge',
        [View.TaxOptimization]: 'TaxOptimizationChamber',
        [View.CryptoWeb3]: 'CryptoView',
        [View.Crypto]: 'CryptoView',
        [View.AgentMarketplace]: 'MarketplaceView',
        [View.APIStatus]: 'APIIntegrationView',
        [View.Philanthropy]: 'PhilanthropyHub',
        [View.Personalization]: 'PersonalizationView',
        [View.TheVision]: 'TheVisionView',
        [View.SecurityCenter]: 'SecurityView',
        [View.Security]: 'SecurityView',
        [View.GlobalPositionMap]: 'GlobalPositionMap',
        [View.GlobalSsiHub]: 'GlobalSsiHubView',
        [View.PlaidMainDashboard]: 'PlaidDashboardView',
        [View.DataNetwork]: 'PlaidDashboardView',
        [View.CorporateActions]: 'CorporateActionsNexusView',
        [View.GEINDashboard]: 'GEIN_DashboardView',
        [View.PlaidInstitutions]: 'PlaidInstitutionsExplorer',
        [View.PlaidItemManagement]: 'PlaidItemManagementView',
        [View.VerificationReports]: 'VerificationReportsView',
        [View.CitibankUnmaskedData]: 'CitibankUnmaskedDataView',
        [View.SchemaExplorer]: 'SchemaExplorer',
        [View.KnowledgeBase]: 'KnowledgeBaseView',
        [View.TheBook]: 'TheBookView',
        [View.FinancialReporting]: 'FinancialReportingView',
        [View.StripeNexusDashboard]: 'StripeNexusDashboard',
        [View.CustomerDashboard]: 'CustomerDashboard',
        [View.OpenBanking]: 'OpenBankingView',
        [View.FinancialDemocracy]: 'FinancialDemocracyView',
        [View.ComplianceOracle]: 'ComplianceOracleView',
        [View.ApiPlayground]: 'ApiPlaygroundView',
        [View.ResourceGraph]: 'ResourceGraphView',
        [View.DeveloperHub]: 'DeveloperHubView',
        [View.SecurityCompliance]: 'SecurityComplianceView',
        [View.AIInsights]: 'AIInsights',
        [View.AIAdvisor]: 'AIAdvisorView',
        [View.ConciergeService]: 'ConciergeService',
        [View.QuantumWeaver]: 'QuantumWeaverView',
        [View.AIAdStudio]: 'AIAdStudioView',
        [View.VentureCapitalDeskView]: 'VentureCapitalDeskView',
        [View.CardholderManagement]: 'CardholderManagement',
        [View.ReconciliationHub]: 'ReconciliationHubView',
        [View.CreditNoteLedger]: 'CreditNoteLedger',
        [View.VirtualAccounts]: 'VirtualAccountsDashboard',
        [View.CounterpartyDashboard]: 'CounterpartyDashboardView',
        [View.ModernTreasury]: 'ModernTreasuryView',
        [View.Treasury]: 'TreasuryView',
        [View.CorporateCommand]: 'CorporateCommandView',
        [View.PlaidCRAMonitoring]: 'PlaidCRAMonitoringView',
        [View.PlaidIdentity]: 'PlaidIdentityView',
        [View.CitibankEligibility]: 'CitibankEligibilityView',
        [View.CitibankDeveloperTools]: 'CitibankDeveloperToolsView',
        [View.CitibankStandingInstructions]: 'CitibankStandingInstructionsView',
        [View.CitibankPayeeManagement]: 'CitibankPayeeManagementView',
        [View.CitibankCrossBorder]: 'CitibankCrossBorderView',
        [View.CitibankBillPay]: 'CitibankBillPayView',
        [View.CitibankAccountProxy]: 'CitibankAccountProxyView',
        [View.CitibankAccounts]: 'CitibankAccountsView',
        [View.QuantumAssets]: 'QuantumAssets',
        [View.LegacyBuilder]: 'LegacyBuilder',
        [View.DerivativesDesk]: 'DerivativesDesk',
        [View.ArtCollectibles]: 'ArtCollectibles',
        [View.RealEstateEmpire]: 'RealEstateEmpire',
        [View.CommoditiesExchange]: 'CommoditiesExchange',
        [View.ForexArena]: 'ForexArena',
        [View.AlgoTradingLab]: 'AlgoTradingLab',
        [View.Investments]: 'InvestmentsView',
        [View.CreditHealth]: 'CreditHealthView',
        [View.FinancialGoals]: 'FinancialGoalsView',
        [View.Budgets]: 'BudgetsView',
        [View.SendMoney]: 'SendMoneyView',
        [View.Transactions]: 'TransactionsView',
        [View.Accounts]: 'AccountsView',
        [View.Dashboard]: 'Dashboard',
        [View.AccountDetails]: 'AccountDetails',
        [View.AccountList]: 'AccountList',
        [View.AccountsDashboardView]: 'AccountsDashboardView',
    };

    const componentName = overrides[view] || view;

    // 2. Auto-Resolution
    let Component = null;
    const lowerComponentName = componentName.toLowerCase();

    for (const path in modules) {
        const pathParts = path.split('/');
        const fileNameWithExt = pathParts[pathParts.length - 1];
        const lowerFileName = fileNameWithExt.toLowerCase().replace('.tsx', '');

        const possibleFileNames = [
            lowerComponentName,
            `${lowerComponentName}view`,
            `${lowerComponentName}dashboard`,
            `${lowerComponentName}dashboardview`
        ];

        if (possibleFileNames.includes(lowerFileName)) {
            Component = (modules[path] as any).default;
            break;
        }
    }

    // 3. Props Injection
    let props: any = {};
    if (view === View.PlaidInstitutions) props = { client: new PlaidClient() };
    if (view === View.VerificationReports) props = { customerId: "cust_1" };
    if (view === View.PlaidItemManagement) props = { accessToken: 'access-sandbox-xxx' };
    if (view === View.CitibankUnmaskedData) props = { accountIdsToUnmask: [] };
    if (view === View.SchemaExplorer) props = { schemaData: { definitions: {}, properties: {} } };

    return { Component, props };
};

// --- Error Boundary ---
interface ErrorBoundaryProps { children: React.ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  
  constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) { console.error("ErrorBoundary caught:", error); return { hasError: true }; }
  
  render() { return this.state.hasError ? <h1>Something went wrong.</h1> : this.props.children; }
}

// --- Protected Route ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext)!;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// --- Enhanced Landing Page ---
const EnhancedLandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext)!;

    const features = [
        {
            icon: <Cpu className="w-8 h-8 text-cyan-400" />,
            title: "Interactive AI Modules",
            description: "Learn complex topics like algorithmic trading, DeFi, and risk modeling through hands-on, AI-guided simulations.",
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
            title: "Your Personal AI Tutor",
            description: "Our AI adapts to your learning style, explaining concepts from basic budgeting to quantum financial modeling.",
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M2 8c0-2.2.7-4.3 2-6"></path><path d="M22 8c0-2.2-.7-4.3-2-6"></path></svg>,
            title: "Real-World Application",
            description: "Connect what you learn to real-time market data and see how AI-driven decisions impact financial outcomes.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center relative overflow-hidden p-4">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '2rem 2rem',
            }}></div>
            
            {/* Animated Gradient Blobs */}
            <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="z-10 text-center max-w-5xl flex flex-col items-center">
                <Cpu className="w-20 h-20 md:w-24 md:h-24 text-cyan-400 mb-6 animate-pulse" />
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    AI Banking University
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                    Master the future of finance. A learning experience more powerful than any classroom.
                </p>
                
                {isAuthenticated ? (
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
                    >
                        Enter Dashboard
                    </button>
                ) : (
                    <button 
                        onClick={() => navigate('/login')}
                        className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
                    >
                        Start Your Journey
                    </button>
                )}

                {/* Feature Highlights */}
                <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 flex flex-col items-center text-center transform transition-all hover:scale-105 hover:border-cyan-400/50">
                            <div className="mb-4 p-3 bg-gray-800 rounded-full">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: -2s;
                }
                .animation-delay-4000 {
                    animation-delay: -4s;
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
            `}</style>
        </div>
    );
};

const UnderConstructionView = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-800/20 rounded-lg border-2 border-dashed border-gray-700 p-8">
            <Cpu className="w-16 h-16 mb-4 animate-pulse text-cyan-500" />
            <h1 className="text-2xl font-bold text-gray-300 mb-2">Module Under Construction</h1>
            <p className="text-center max-w-md">
                Our top engineers are currently building this feature.
            </p>
            <p className="text-center max-w-md mt-1">
                Please check back later for updates.
            </p>
        </div>
    );
};

const DynamicView = () => {
    const { viewName } = useParams<{ viewName: string }>();
    if (!viewName) {
        return <UnderConstructionView />;
    }
    const { Component, props } = getComponentForView(viewName);

    if (Component) {
        return <Component {...props} />;
    }

    return <UnderConstructionView />;
};

// --- Layout ---
const SAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useContext(DataContext);
  const { isAuthenticated, logout } = useContext(AuthContext)!;

  if (!dataContext) {
    return <div>Error: DataContext not found.</div>;
  }

  const { isLoading, error } = dataContext;

  if (isLoading) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-950 text-white gap-4">
            <Cpu className="w-16 h-16 text-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-wider">AWAKENING ANCIENT WISDOM...</h1>
            <p className="text-gray-400 font-mono">Preparing Your Journey...</p>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
                <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse-fast-x"></div>
            </div>
            <style>{`
                .animate-pulse-fast-x {
                    animation: pulse-x 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse-x {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
  }

  if (error) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-red-950 text-red-300 gap-4 p-8">
            <AlertTriangle className="w-16 h-16 text-red-500" />
            <h1 className="text-3xl font-bold">SYSTEM INITIALIZATION FAILURE</h1>
            <p className="text-red-400 max-w-md text-center bg-red-500/10 p-4 rounded-lg border border-red-500/30">
                A critical error occurred while generating the initial simulation state from the AI core.
            </p>
            <p className="text-sm font-mono text-gray-500 max-w-xl text-center break-words">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">REINITIALIZE</button>
        </div>
      );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden font-sans">
      <button 
        onClick={logout} 
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-lg transition-colors"
      >
        Log Out
      </button>

      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="w-full flex-grow p-6">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

// --- Wrapper Components for Props ---
const Wrapper = ({ Component, ...props }: { Component: React.FC<any>; [key: string]: any }) => {
    return <Component {...props} />;
};

const theme = createTheme({ palette: { mode: 'dark' } });

// --- Main App Component ---
function SApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <MoneyMovementProvider>
            <StripeDataProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                  <Routes>
                    <Route path="/" element={<EnhancedLandingPage />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/sso" element={<SSOView />} />
                    
                    {/* Protected Routes Wrapper */}
                    <Route element={
                        <ProtectedRoute>
                            <SAppLayout />
                        </ProtectedRoute>
                    }>
                      {/* The Dashboard is the default view for the app layout */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* Dynamically Generated Routes */}
                      <Route path="/account-details" element={<Wrapper Component={AccountDetails} accountId='1' customerId='c1' />} />
                      <Route path="/account-list" element={<Wrapper Component={AccountList} accounts={[]} />} />
                      <Route path="/accounts-dashboard" element={<AccountsDashboardView />} />
                      
                      <Route path="/resource-graph" element={<ResourceGraphView />} />
                      <Route path="/compliance-oracle" element={<ComplianceOracleView />} />

                      <Route path="/view/:viewName" element={<DynamicView />} />

                      <Route path="*" element={<Dashboard />} />
                    </Route>
                  </Routes>
                </Router>
              </ThemeProvider>
            </StripeDataProvider>
          </MoneyMovementProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default SApp;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-custom-GitHub-repo-transformer-into-New-York-times-best-seller | ORIGINAL PATH: diplomat-bit-jocall3-custom-GitHub-repo-transformer-into-New-York-times-best-seller-5617407/App.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { GithubRepo, SelectedContext, Manuscript, RepoSession } from './types';
import { githubService } from './services/githubService';
import { geminiService } from './services/geminiService';
import { exportService } from './services/exportService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PortfolioGrid from './components/PortfolioGrid';
import StoryReader from './components/StoryReader';

const App: React.FC = () => {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [repoSessions, setRepoSessions] = useState<Record<number, RepoSession>>({});
  const [selectedContext, setSelectedContext] = useState<SelectedContext>({
    repo: null, manuscript: null, chatHistory: [], isGenerating: false, status: 'IDLE'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => { loadInitialData(); }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const data = await githubService.getUserRepos();
      setRepos(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRepo = (repo: GithubRepo) => {
    const session = repoSessions[repo.id] || { repoId: repo.id, manuscript: null, chatHistory: [] };
    setSelectedContext({ 
      repo, 
      manuscript: session.manuscript, 
      chatHistory: session.chatHistory,
      isGenerating: false,
      status: 'READY'
    });
  };

  const handleGoHome = () => {
    setSelectedContext({ repo: null, manuscript: null, chatHistory: [], isGenerating: false, status: 'IDLE' });
  };

  const handleGenerateStory = async () => {
    if (!selectedContext.repo) return;
    setSelectedContext(prev => ({ ...prev, isGenerating: true, status: 'INITIALIZING_NEURAL_SWARM' }));
    
    try {
      const allFiles = await githubService.getAllRepoFilesRecursively(selectedContext.repo.name);
      
      // Batch download the most important files for analysis (top 30 to stay within context limits while being deep)
      const fileContents = await Promise.all(
        allFiles.slice(0, 30).map(async f => ({
          path: f.path,
          content: f.download_url ? await githubService.getFileContent(f.download_url) : ''
        }))
      );

      const manuscript = await geminiService.weaveManuscript(
        selectedContext.repo.name, 
        fileContents, 
        (status) => setSelectedContext(prev => ({ ...prev, status }))
      );

      setRepoSessions(prev => ({
        ...prev,
        [selectedContext.repo!.id]: { ...prev[selectedContext.repo!.id], manuscript }
      }));
      setSelectedContext(prev => ({ ...prev, manuscript, isGenerating: false, status: 'COMPLETE' }));
    } catch (e) {
      console.error(e);
      setSelectedContext(prev => ({ ...prev, isGenerating: false, status: 'NEURAL_FAULT: RESOURCE_EXHAUSTED' }));
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-black text-white font-mono uppercase tracking-widest text-xs animate-pulse">Accessing Registry...</div>;

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-slate-200">
      <Sidebar 
        repos={repos} 
        selectedRepo={selectedContext.repo} 
        onSelectRepo={handleSelectRepo} 
        onAnalyzeRepo={handleGenerateStory}
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        knowledgeBase={[]} auditQueue={[]} onSelectFile={() => {}} onToggleKnowledge={() => {}} onToggleAudit={() => {}}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header 
          repo={selectedContext.repo} 
          file={null} 
          toggleAI={() => {}} 
          isAIPanelOpen={false} 
          isSidebarOpen={isSidebarOpen}
          auditCount={0}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onGoHome={handleGoHome}
        />
        
        <main className="flex-1 overflow-hidden relative">
          {selectedContext.isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center space-y-12 p-20 text-center bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)]">
              <div className="relative">
                <div className="w-48 h-48 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-b-2 border-amber-500/30 rounded-full animate-spin-slow"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-brain text-5xl text-indigo-400 animate-pulse"></i>
                </div>
              </div>
              <div className="max-w-md">
                <h2 className="text-3xl font-header tracking-[0.4em] uppercase mb-4 text-white">Parallel Neural Synthesis</h2>
                <p className="text-slate-500 font-serif italic mb-8">Coordinating multiple AI scribes to weave your architectural odyssey into a cohesive manuscript...</p>
                <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-500/5 px-8 py-3 rounded-full border border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.1)]">
                  &gt; {selectedContext.status}
                </div>
              </div>
            </div>
          ) : selectedContext.manuscript ? (
            <StoryReader 
              manuscript={selectedContext.manuscript} 
              onExport={() => exportService.downloadManuscript(selectedContext.manuscript!)} 
            />
          ) : selectedContext.repo ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 p-12 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.03)_0%,_transparent_70%)]">
               <div className="max-w-xl text-center">
                  <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-indigo-500/20">
                    <i className="fas fa-scroll text-2xl text-indigo-400"></i>
                  </div>
                  <h2 className="text-5xl font-sacred mb-6 tracking-widest">Manuscript Ready</h2>
                  <p className="text-slate-500 font-serif text-xl mb-12 leading-relaxed italic px-10">
                    The architectural data for "{selectedContext.repo.name}" is staged. Initiate the Neural Swarm to produce a high-fidelity digital book of its design.
                  </p>
                  <button 
                    onClick={handleGenerateStory}
                    className="px-16 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-[0.5em] text-xs rounded-full shadow-[0_0_60px_rgba(79,70,229,0.3)] transition-all hover:scale-110 active:scale-95 border border-indigo-400/30"
                  >
                    Weave Magnum Opus
                  </button>
               </div>
            </div>
          ) : (
            <PortfolioGrid repos={repos} onSelectRepo={handleSelectRepo} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-plaid-marqeta-modern-Treasury-aibanking.dev- | ORIGINAL PATH: diplomat-bit-jocall3-plaid-marqeta-modern-Treasury-aibanking.dev--44f28d7/App.tsx
================================================================================


import React, { useState, useEffect } from 'react';
import { 
  Terminal, Shield, Key, Link as LinkIcon, Database, 
  LayoutDashboard, Activity, AlertCircle, RefreshCcw, 
  ArrowRight, Globe, Settings2, ChevronRight, Terminal as TerminalIcon
} from 'lucide-react';
import { FlowStep, PlaidCredentials, PlaidTokenState, MarqetaCredentials, ModernTreasuryCredentials } from './types';
import { CredentialsForm } from './components/CredentialsForm';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [step, setStep] = useState<FlowStep>(FlowStep.CREDENTIALS);
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [credentials, setCredentials] = useState<PlaidCredentials | null>(null);
  const [marqetaCreds, setMarqetaCreds] = useState<MarqetaCredentials | null>(null);
  const [mtCreds, setMtCreds] = useState<ModernTreasuryCredentials | null>(null);
  const [tokens, setTokens] = useState<PlaidTokenState>({
    linkToken: null,
    publicToken: null,
    accessToken: null
  });
  const [logs, setLogs] = useState<{msg: string, type: 'req' | 'res' | 'err', timestamp: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [proxyUrl, setProxyUrl] = useState('https://corsproxy.io/?url=');
  const [useProxy, setUseProxy] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let checkInterval: number;
    const checkPlaid = () => {
      if ((window as any).Plaid) {
        setSdkStatus('ready');
        clearInterval(checkInterval);
      } else if ((window as any).PLAID_LOAD_ERROR) {
        setSdkStatus('error');
        clearInterval(checkInterval);
      }
    };
    checkInterval = window.setInterval(checkPlaid, 500);
    return () => clearInterval(checkInterval);
  }, []);

  const addLog = (msg: any, type: 'req' | 'res' | 'err' = 'res') => {
    const stringified = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2);
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 } as any);
    setLogs(prev => [{ msg: stringified, type, timestamp }, ...prev].slice(0, 50));
  };

  const handleCredentialsSubmit = (plaid: PlaidCredentials, marqeta: MarqetaCredentials, mt: ModernTreasuryCredentials) => {
    setCredentials(plaid);
    setMarqetaCreds(marqeta);
    setMtCreds(mt);
    setStep(FlowStep.LINK_TOKEN);
    addLog("Stack credentials initialized.", 'res');
  };

  const createLinkToken = async () => {
    setIsLoading(true);
    try {
      const targetUrl = `https://${credentials?.environment}.plaid.com/link/token/create`;
      const finalUrl = useProxy ? `${proxyUrl}${encodeURIComponent(targetUrl)}` : targetUrl;
      const res = await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: credentials?.clientId,
          secret: credentials?.secret,
          user: { client_user_id: 'nexus_' + Date.now() },
          client_name: 'Nexus Terminal',
          products: ['auth', 'transactions'],
          country_codes: ['US'],
          language: 'en'
        })
      }).then(r => r.json());
      
      if (res.error_message) throw new Error(res.error_message);
      setTokens(prev => ({ ...prev, linkToken: res.link_token }));
      setStep(FlowStep.LINK_UI);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openLink = () => {
    if (!tokens.linkToken) return;
    (window as any).Plaid.create({
      token: tokens.linkToken,
      onSuccess: (public_token: string) => {
        setTokens(prev => ({ ...prev, publicToken: public_token }));
        setStep(FlowStep.EXCHANGE);
      },
      onExit: (err: any) => err && setError(err.message)
    }).open();
  };

  const exchangeToken = async () => {
    setIsLoading(true);
    try {
      const targetUrl = `https://${credentials?.environment}.plaid.com/item/public_token/exchange`;
      const finalUrl = useProxy ? `${proxyUrl}${encodeURIComponent(targetUrl)}` : targetUrl;
      const res = await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: credentials?.clientId,
          secret: credentials?.secret,
          public_token: tokens.publicToken
        })
      }).then(r => r.json());
      
      if (res.error_message) throw new Error(res.error_message);
      setTokens(prev => ({ ...prev, accessToken: res.access_token }));
      setStep(FlowStep.DASHBOARD);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl sticky top-0 z-50 h-24 flex items-center">
        <div className="max-w-[1600px] mx-auto px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Activity className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">Nexus<span className="text-blue-500">Terminal</span></h1>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="p-3.5 rounded-2xl border border-white/5 text-slate-400">
            <Settings2 size={22} />
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="bg-blue-600 p-[1px] z-40">
           <div className="bg-[#020617] p-8 flex items-center gap-6">
              <input type="text" value={proxyUrl} onChange={(e) => setProxyUrl(e.target.value)} className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-blue-400" />
           </div>
        </div>
      )}

      <main className="flex-1 flex flex-col xl:flex-row max-w-[1600px] mx-auto w-full p-8 lg:p-12 gap-12 relative z-10">
        <div className="flex-1 space-y-12">
          {step === FlowStep.CREDENTIALS && <CredentialsForm onSubmit={handleCredentialsSubmit} />}
          {step === FlowStep.LINK_TOKEN && (
            <div className="text-center p-20 bg-slate-900/30 rounded-[3rem] border border-white/5 space-y-8">
              <Key size={56} className="mx-auto text-blue-500" />
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Plaid Handshake</h2>
              <button onClick={createLinkToken} disabled={isLoading} className="bg-blue-600 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm">
                {isLoading ? <RefreshCcw className="animate-spin" /> : 'Request Link Token'}
              </button>
            </div>
          )}
          {step === FlowStep.LINK_UI && (
            <div className="text-center p-20 bg-slate-900/30 rounded-[3rem] border border-white/5 space-y-8">
              <LinkIcon size={56} className="mx-auto text-emerald-500" />
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Bank Linkage</h2>
              <button onClick={openLink} className="bg-white text-slate-950 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm">Launch Link UI</button>
            </div>
          )}
          {step === FlowStep.EXCHANGE && (
            <div className="text-center p-20 bg-slate-900/30 rounded-[3rem] border border-white/5 space-y-8">
              <Database size={56} className="mx-auto text-purple-500" />
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Auth Exchange</h2>
              <button onClick={exchangeToken} disabled={isLoading} className="bg-purple-600 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm">Finalize Node</button>
            </div>
          )}
          {step === FlowStep.DASHBOARD && credentials && tokens.accessToken && marqetaCreds && mtCreds && (
            <Dashboard 
              accessToken={tokens.accessToken} 
              credentials={credentials} 
              marqetaCreds={marqetaCreds}
              mtCreds={mtCreds}
              proxy={useProxy ? proxyUrl : ''}
              addLog={addLog}
            />
          )}
        </div>

        <aside className="w-full xl:w-[450px]">
          <div className="bg-slate-950/80 rounded-[2.5rem] border border-white/5 flex flex-col h-[700px] overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="p-7 border-b border-white/5 bg-slate-900/40 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">System_Traffic</span>
              <button onClick={() => setLogs([])} className="text-[10px] font-black text-slate-600">Flush</button>
            </div>
            <div className="flex-1 overflow-y-auto p-7 space-y-5 font-mono text-[11px]">
              {logs.map((log, i) => (
                <div key={i} className={`p-4 rounded-xl border ${log.type === 'req' ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : log.type === 'err' ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-slate-900/60 border-white/5 text-slate-400'}`}>
                  <div className="flex justify-between mb-2 opacity-50 text-[9px]">
                    <span className="uppercase">{log.type}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <pre className="whitespace-pre-wrap break-all">{log.msg}</pre>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/App.tsx
================================================================================

import React, { useState, useContext, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Cpu, ShieldAlert, Sparkles, Terminal, ArrowLeft, ExternalLink, Grid } from 'lucide-react';
import { Auth0Provider } from '@auth0/auth0-react';
import { datadogLogs } from '@datadog/browser-logs';
import { Analytics } from '@vercel/analytics/react';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider, DataContext } from './context/DataContext';
import { StripeDataProvider } from './components/StripeDataProvider';
import { MoneyMovementProvider } from './components/MoneyMovementContext';

// Layout & Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SApp from './components/SApp';
import { View } from './types';
import Paywall from './components/Paywall';

// Views & Components
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import BudgetsView from './components/BudgetsView';
import FinancialGoalsView from './components/FinancialGoalsView';
import CreditHealthView from './components/CreditHealthView';
import PersonalizationView from './components/PersonalizationView';
import AccountsView from './components/AccountsView';
import InvestmentsView from './components/InvestmentsView';
import CryptoView from './components/CryptoView';
import AlgoTradingLab from './components/AlgoTradingLab';
import ForexArena from './components/ForexArena';
import CommoditiesExchange from './components/CommoditiesExchange';
import RealEstateEmpire from './components/RealEstateEmpire';
import ArtCollectibles from './components/ArtCollectibles';
import DerivativesDesk from './components/DerivativesDesk';
import VentureCapitalDesk from './components/VentureCapitalDesk';
import PrivateEquityLounge from './components/PrivateEquityLounge';
import TaxOptimizationChamber from './components/TaxOptimizationChamber';
import LegacyBuilder from './components/LegacyBuilder';
import CorporateCommandView from './components/CorporateCommandView';
import ModernTreasuryView from './components/ModernTreasuryView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import QuantumWeaverView from './components/QuantumWeaverView';
import AgentMarketplaceView from './components/MarketplaceView';
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import ConciergeService from './components/ConciergeService';
import SovereignWealth from './components/SovereignWealth';
import PhilanthropyHub from './components/PhilanthropyHub';
import TheVisionView from './components/TheVisionView';
import AIAdvisorView from './components/AIAdvisorView';
import { AIInsights } from './components/AIInsights';
import SecurityView from './components/SecurityView';
import ComplianceOracleView from './components/ComplianceOracleView';
import GlobalPositionMap from './components/GlobalPositionMap';
import GlobalSsiHubView from './components/GlobalSsiHubView';
import CustomerDashboard from './components/CustomerDashboard';
import VerificationReportsView from './components/VerificationReportsView';
import FinancialReportingView from './components/FinancialReportingView';
import TheBookView from './components/TheBookView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import VoiceControl from './components/VoiceControl';
import LandingPage from './components/LandingPage';
import QuantumAssets from './components/QuantumAssets';
import CitibankAccountsView from './components/CitibankAccountsView';
import CitibankAccountProxyView from './components/CitibankAccountProxyView';
import CitibankBillPayView from './components/CitibankBillPayView';
import CitibankCrossBorderView from './components/CitibankCrossBorderView';
import CitibankPayeeManagementView from './components/CitibankPayeeManagementView';
import CitibankStandingInstructionsView from './components/CitibankStandingInstructionsView';
import CitibankDeveloperToolsView from './components/CitibankDeveloperToolsView';
import CitibankEligibilityView from './components/CitibankEligibilityView';
import CitibankUnmaskedDataView from './components/CitibankUnmaskedDataView';
import PlaidIdentityView from './components/PlaidIdentityView';
import PlaidCRAMonitoringView from './components/PlaidCRAMonitoringView';
import { PlaidInstitutionsExplorer } from './components/PlaidInstitutionsExplorer';
import { PlaidItemManagementView } from './components/PlaidItemManagementView';
import PlaidMainDashboard from './components/PlaidMainDashboard';
import StripeNexusView from './components/StripeNexusView';
import CounterpartyDashboardView from './components/CounterpartyDashboardView';
import VirtualAccountsDashboard from './components/VirtualAccountsDashboard';
import CorporateActionsNexusView from './components/CorporateActionsNexusView';
import { CreditNoteLedger } from './components/CreditNoteLedger';
import ReconciliationHubView from './components/ReconciliationHubView';
import GEINDashboard from './components/GEIN_DashboardView';
import CardholderManagement from './components/CardholderManagement';
import UniversalObjectInspector from './components/UniversalObjectInspector';
import { LoginView } from './components/LoginView';
import { PlaidClient } from './lib/plaidClient';
import DeveloperHubView from './components/DeveloperHubView';
import ApiPlaygroundView from './components/ApiPlaygroundView';
import BusinessDemoView from './components/BusinessDemoView';

// --- ALL COMPONENT IMPORTS FOR DIRECT ACCESS ---
import AccountDetails from './components/AccountDetails';
import AccountList from './components/AccountList';
import AccountStatementGrid from './components/AccountStatementGrid';
import { AccountVerificationModal } from './components/AccountVerificationModal';
import ACHDetailsDisplay from './components/ACHDetailsDisplay';
import AICommandLog from './components/AICommandLog';
import AIPredictionWidget from './components/AIPredictionWidget';
import AssetCatalog from './components/AssetCatalog';
import AutomatedSweepRules from './components/AutomatedSweepRules';
import BalanceReportChart from './components/BalanceReportChart';
import BalanceTransactionTable from './components/BalanceTransactionTable';
import CardDesignVisualizer from './components/CardDesignVisualizer';
import { ChargeDetailModal } from './components/ChargeDetailModal';
import ChargeList from './components/ChargeList';
import ConductorConfigurationView from './components/ConductorConfigurationView';
import CounterpartyDetails from './components/CounterpartyDetails';
import { CounterpartyForm } from './components/CounterpartyForm';
import DisruptionIndexMeter from './components/DisruptionIndexMeter';
import DocumentUploader from './components/DocumentUploader';
import { DownloadLink } from './components/DownloadLink';
import EarlyFraudWarningFeed from './components/EarlyFraudWarningFeed';
import ElectionChoiceForm from './components/ElectionChoiceForm';
import EventNotificationCard from './components/EventNotificationCard';
import ExpectedPaymentsTable from './components/ExpectedPaymentsTable';
import ExternalAccountCard from './components/ExternalAccountCard';
import ExternalAccountForm from './components/ExternalAccountForm';
import ExternalAccountTable from './components/ExternalAccountsTable';
import { FinancialAccountCard } from './components/FinancialAccountCard';
import IncomingPaymentDetailList from './components/IncomingPaymentDetailList';
import { InvestmentForm } from './components/InvestmentForm';
import InvoiceFinancingRequest from './components/InvoiceFinancingRequest';
import PaymentInitiationForm from './components/PaymentInitiationForm';
import PaymentMethodDetails from './components/PaymentMethodDetails';
import PaymentOrderForm from './components/PaymentOrderForm';
import PayoutsDashboard from './components/PayoutsDashboard';
import PnLChart from './components/PnLChart';
import RefundForm from './components/RefundForm';
import RemittanceInfoEditor from './components/RemittanceInfoEditor';
import ReportingView from './components/ReportingView';
import { ReportRunGenerator } from './components/ReportRunGenerator';
import ReportStatusIndicator from './components/ReportStatusIndicator';
import ResourceGraphView from './components/ResourceGraphView';
import SchemaExplorer from './components/SchemaExplorer';
import SecurityComplianceView from './components/SecurityComplianceView';
import SsiEditorForm from './components/SsiEditorForm';
import StripeStatusBadge from './components/StripeStatusBadge';
import StructuredPurposeInput from './components/StructuredPurposeInput';
import SubscriptionList from './components/SubscriptionList';
import TimeSeriesChart from './components/TimeSeriesChart';
import TradeConfirmationModal from './components/TradeConfirmationModal';
import TransactionFilter from './components/TransactionFilter';
import TransactionList from './components/TransactionList';
import { TreasuryTransactionList } from './components/TreasuryTransactionList';
import TreasuryView from './components/TreasuryView';
import VentureCapitalDeskView from './components/VentureCapitalDeskView';
import VirtualAccountForm from './components/VirtualAccountForm';
import VirtualAccountsTable from './components/VirtualAccountsTable';
import WebhookSimulator from './components/WebhookSimulator';

// --- FIXED Wrapper Components ---
type WrapperProps = {
  Component: React.ComponentType<any>;
  props?: any;
};

const Wrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  return <Component {...props} />;
};

const ModalWrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Component
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      {...props}
    />
  );
};

const DataContextWrapper: React.FC<{ Component: React.ComponentType<any>; extraProps?: any }> = ({ Component, extraProps = {} }) => {
  const dataContext = useContext(DataContext);
  const mockContext = {
    setActiveView: () => {},
    impactData: { treesPlanted: 0, progressToNextTree: 0 },
  };
  const props = { ...(dataContext || mockContext), ...extraProps };
  return <Component {...props} />;
};

const AIIntentStub: React.FC<{ view: View }> = ({ view }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in duration-700 bg-gray-950/50 rounded-3xl border border-gray-800">
      <div className="w-24 h-24 bg-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        <Sparkles className="text-cyan-400 w-12 h-12 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-mono">
          Module Ingress: {view.replace(/-/g, '_').toUpperCase()}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed font-mono">
          The Sovereign AI Core is compiling the high-frequency logic for this specific subsystem. Targeting zero-latency node deployment in the next epoch.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
          <Terminal size={14} /> STATUS: COMPILING_INTENT
        </div>
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
          <ShieldAlert size={14} /> AUTH: VERIFIED
        </div>
      </div>
    </div>
  );
};

const MonetizationOverlay = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { sovereignCredits } = context;
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sovereign Balance:</span>
      <span className="text-cyan-400 font-mono text-lg font-bold tracking-tighter">
        {typeof sovereignCredits === 'number' ? sovereignCredits.toLocaleString() : '0'} SC
      </span>
    </div>
  );
};

const SAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (datadogLogs && datadogLogs.logger) {
      datadogLogs.logger.info('App View Loaded', { name: 'SovereignNexus', id: 'init_view' });
    }
  }, []);

  if (!dataContext || !authContext) return null;
  const { isAuthenticated, isLoading: authLoading } = authContext;
  const { isLoading: dataLoading, activeView, setActiveView, isSubscribed } = dataContext;

  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-6">
        <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />
        <h1 className="text-3xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase font-mono">
          Nexus OS // Syncing
        </h1>
        <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-progress-flow"></div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          .animate-progress-flow { animation: flow 2s linear infinite; width: 50%; }
        ` }} />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const renderView = () => {
    if (!isSubscribed) {
      return <Paywall />;
    }
    switch (activeView) {
      case View.Dashboard: return <Dashboard />;
      case View.Transactions: return <TransactionsView />;
      case View.SendMoney: return <SendMoneyView />;
      case View.Budgets: return <BudgetsView />;
      case View.FinancialGoals: return <FinancialGoalsView />;
      case View.CreditHealth: return <CreditHealthView />;
      case View.Personalization: return <PersonalizationView />;
      case View.Accounts: return <AccountsView />;
      case View.Investments: return <InvestmentsView />;
      case View.CryptoWeb3: return <CryptoView />;
      case View.AlgoTradingLab: return <AlgoTradingLab />;
      case View.ForexArena: return <ForexArena />;
      case View.CommoditiesExchange: return <CommoditiesExchange />;
      case View.RealEstateEmpire: return <RealEstateEmpire />;
      case View.ArtCollectibles: return <ArtCollectibles />;
      case View.DerivativesDesk: return <DerivativesDesk />;
      case View.VentureCapital: return <VentureCapitalDesk />;
      case View.PrivateEquity: return <PrivateEquityLounge />;
      case View.TaxOptimization: return <TaxOptimizationChamber />;
      case View.LegacyBuilder: return <LegacyBuilder />;
      case View.CorporateCommand: return <CorporateCommandView setActiveView={setActiveView} />;
      case View.ModernTreasury: return <ModernTreasuryView />;
      case View.OpenBanking: return <OpenBankingView />;
      case View.FinancialDemocracy: return <FinancialDemocracyView />;
      case View.AIAdStudio: return <AIAdStudioView />;
      case View.QuantumWeaver: return <QuantumWeaverView />;
      case View.AgentMarketplace: return <AgentMarketplaceView />;
      case View.APIStatus: return <APIIntegrationView />;
      case View.Settings: return <SettingsView />;
      case View.QuantumAssets: return <QuantumAssets />;
      case View.SovereignWealth: return <SovereignWealth />;
      case View.Philanthropy: return <PhilanthropyHub />;
      case View.TheVision: return <TheVisionView />;
      case View.AIAdvisor: return <AIAdvisorView />;
      case View.AIInsights: return <AIInsights />;
      case View.SecurityCenter: return <SecurityView />;
      case View.ComplianceOracle: return <ComplianceOracleView />;
      case View.GlobalPositionMap: return <GlobalPositionMap />;
      case View.GlobalSsiHub: return <GlobalSsiHubView />;
      case View.CustomerDashboard: return <CustomerDashboard />;
      case View.VerificationReports: return <VerificationReportsView customerId="c1" />;
      case View.FinancialReporting: return <FinancialReportingView />;
      case View.TheBook: return <TheBookView />;
      case View.KnowledgeBase: return <KnowledgeBaseView />;
      case View.CitibankAccounts: return <CitibankAccountsView />;
      case View.CitibankAccountProxy: return <CitibankAccountProxyView />;
      case View.CitibankBillPay: return <CitibankBillPayView />;
      case View.CitibankCrossBorder: return <CitibankCrossBorderView />;
      case View.CitibankPayeeManagement: return <CitibankPayeeManagementView />;
      case View.CitibankStandingInstructions: return <CitibankStandingInstructionsView />;
      case View.CitibankDeveloperTools: return <CitibankDeveloperToolsView />;
      case View.CitibankEligibility: return <CitibankEligibilityView />;
      case View.CitibankUnmaskedData: return <CitibankUnmaskedDataView accountIdsToUnmask={['acc_1']} />;
      case View.PlaidMainDashboard: return <PlaidMainDashboard />;
      case View.PlaidIdentity: return <PlaidIdentityView />;
      case View.PlaidCRAMonitoring: return <PlaidCRAMonitoringView />;
      case View.PlaidInstitutions: return <PlaidInstitutionsExplorer client={new PlaidClient()} />;
      case View.PlaidItemManagement: return <PlaidItemManagementView accessToken="mock_token" />;
      case View.StripeNexus: return <StripeNexusView />;
      case View.CounterpartyDashboard: return <CounterpartyDashboardView />;
      case View.VirtualAccounts: return <VirtualAccountsDashboard />;
      case View.SApp: return <SApp />;
      case View.CorporateActions: return <CorporateActionsNexusView />;
      case View.CreditNoteLedger: return <CreditNoteLedger />;
      case View.ReconciliationHub: return <ReconciliationHubView />;
      case View.GEINDashboard: return <GEINDashboard />;
      case View.CardholderManagement: return <CardholderManagement />;
      case View.SecurityCompliance: return <SecurityComplianceView />;
      case View.DeveloperHub: return <DeveloperHubView />;
      case View.SchemaExplorer: return <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} />;
      case View.ResourceGraph: return <ResourceGraphView />;
      case View.ApiPlayground: return <ApiPlaygroundView />;
      case View.VentureCapitalDeskView: return <VentureCapitalDeskView />;

      // --- Direct Component Access ---
      case View.AccountDetails: 
        return <Wrapper Component={AccountDetails} props={{ accountId: '1', customerId: 'c1' }} />;
      case View.AccountList: 
        return <Wrapper Component={AccountList} props={{ accounts: [] }} />;
      case View.AccountStatementGrid: 
        return <Wrapper Component={AccountStatementGrid} props={{ statementLines: [] }} />;
      case View.AccountVerificationModal: 
        return <ModalWrapper Component={AccountVerificationModal} props={{ externalAccount: {id: '1', verification_status: 'unverified' }, onSuccess: () => {}}} />;
      case View.ACHDetailsDisplay: 
        return <Wrapper Component={ACHDetailsDisplay} props={{ details: { routingNumber: '123', realAccountNumber: '456' } }} />;
      case View.AICommandLog: 
        return <AICommandLog />;
      case View.AIPredictionWidget: 
        return <AIPredictionWidget />;
      case View.AssetCatalog: 
        return <Wrapper Component={AssetCatalog} props={{ assets: [], onAssetSelected: () => {}, getAssetDetails: async () => ({}) }} />;
      case View.AutomatedSweepRules: 
        return <AutomatedSweepRules />;
      case View.BalanceReportChart: 
        return <Wrapper Component={BalanceReportChart} props={{ data: [] }} />;
      case View.BalanceTransactionTable: 
        return <Wrapper Component={BalanceTransactionTable} props={{ balanceTransactions: [] }} />;
      case View.CardDesignVisualizer: 
        return <Wrapper Component={CardDesignVisualizer} props={{ design: { id: 'd_1', physical_bundle: { features: {} } } }} />;
      case View.ChargeDetailModal: 
        return <ModalWrapper Component={ChargeDetailModal} props={{ charge: {id: 'ch_1', amount: 50000, currency: 'USD', status: 'succeeded'}, onClose: () => {}}} />;
      case View.ChargeList: 
        return <ChargeList />;
      case View.ConductorConfigurationView: 
        return <ConductorConfigurationView />;
      case View.CounterpartyDetails: 
        return <Wrapper Component={CounterpartyDetails} props={{ counterpartyId: 'cp_1' }} />;
      case View.CounterpartyForm: 
        return <Wrapper Component={CounterpartyForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.DisruptionIndexMeter: 
        return <Wrapper Component={DisruptionIndexMeter} props={{ indexValue: 50 }} />;
      case View.DocumentUploader: 
        return <Wrapper Component={DocumentUploader} props={{ documentableType: 'test', documentableId: '1' }} />;
      case View.DownloadLink: 
        return <Wrapper Component={DownloadLink} props={{ url: '#', filename: 'test.pdf' }} />;
      case View.EarlyFraudWarningFeed: 
        return <EarlyFraudWarningFeed />;
      case View.ElectionChoiceForm: 
        return <Wrapper Component={ElectionChoiceForm} props={{ availableChoices: {}, onSubmit: () => {}, onCancel: () => {} }} />;
      case View.EventNotificationCard: 
        return <Wrapper Component={EventNotificationCard} props={{ event: {} }} />;
      case View.ExpectedPaymentsTable: 
        return <ExpectedPaymentsTable />;
      case View.ExternalAccountCard: 
        return <Wrapper Component={ExternalAccountCard} props={{ account: {id: '1', account_details: [], routing_details: []}}} />;
      case View.ExternalAccountForm: 
        return <Wrapper Component={ExternalAccountForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.ExternalAccountsTable: 
        return <Wrapper Component={ExternalAccountTable} props={{ accounts: [] }} />;
      case View.FinancialAccountCard: 
        return <Wrapper Component={FinancialAccountCard} props={{ financialAccount: {id: 'fa_1', balance: { cash: {}}, supported_currencies: []}}} />;
      case View.IncomingPaymentDetailList: 
        return <IncomingPaymentDetailList />;
      case View.InvoiceFinancingRequest: 
        return <Wrapper Component={InvoiceFinancingRequest} props={{ onSubmit: () => {} }} />;
      case View.PaymentInitiationForm: 
        return <PaymentInitiationForm />;
      case View.PaymentMethodDetails: 
        return <Wrapper Component={PaymentMethodDetails} props={{ details: { type: 'card', card: {} }}} />;
      case View.PaymentOrderForm: 
        return <Wrapper Component={PaymentOrderForm} props={{ internalAccounts: [], externalAccounts: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.PayoutsDashboard: 
        return <PayoutsDashboard />;
      case View.PnLChart: 
        return <Wrapper Component={PnLChart} props={{ data: [], algorithmName: 'Test' }} />;
      case View.RefundForm: 
        return <RefundForm />;
      case View.RemittanceInfoEditor: 
        return <Wrapper Component={RemittanceInfoEditor} props={{ onChange: () => {} }} />;
      case View.ReportingView: 
        return <ReportingView />;
      case View.ReportRunGenerator: 
        return <ReportRunGenerator />;
      case View.ReportStatusIndicator: 
        return <Wrapper Component={ReportStatusIndicator} props={{ status: 'success' }} />;
      case View.SsiEditorForm: 
        return <Wrapper Component={SsiEditorForm} props={{ onSubmit: () => {}, onCancel: () => {} }} />;
      case View.StripeStatusBadge: 
        return <Wrapper Component={StripeStatusBadge} props={{ status: 'succeeded', objectType: 'charge' }} />;
      case View.StructuredPurposeInput: 
        return <Wrapper Component={StructuredPurposeInput} props={{ onChange: () => {}, value: null }} />;
      case View.SubscriptionList: 
        return <Wrapper Component={SubscriptionList} props={{ subscriptions: [] }} />;
      case View.TimeSeriesChart: 
        return <Wrapper Component={TimeSeriesChart} props={{ data: { labels: [], datasets: [] } }} />;
      case View.TradeConfirmationModal: 
        return (
          <ModalWrapper 
            Component={TradeConfirmationModal} 
            props={{ 
              settlementInstruction: { 
                messageId: 'NEX-INST-99281-Z',
                totalAmount: 12500000, // 125k
                currency: 'USD',
                creationDateTime: Date.now(),
                settlementDate: '2024-12-15',
                numberOfTransactions: 1,
                purpose: 'TREA'
              } 
            }} 
          />
        );
      case View.TransactionFilter: 
        return <Wrapper Component={TransactionFilter} props={{ onApplyFilters: () => {} }} />;
      case View.TransactionList: 
        return <Wrapper Component={TransactionList} props={{ transactions: [] }} />;
      case View.TreasuryTransactionList: 
        return <Wrapper Component={TreasuryTransactionList} props={{ transactions: [] }} />;
      case View.TreasuryView: 
        return <TreasuryView />;
      case View.UniversalObjectInspector: 
        return <Wrapper Component={UniversalObjectInspector} props={{ data: { status: "Nominal", uptime: "99.999%", load: "Balanced" } }} />;
      case View.VirtualAccountForm: 
        return <Wrapper Component={VirtualAccountForm} props={{ onSubmit: () => {}, isSubmitting: false }} />;
      case View.VirtualAccountsTable: 
        return <Wrapper Component={VirtualAccountsTable} props={{ onEdit: () => {}, onDelete: () => {} }} />;
      case View.VoiceControl: 
        return <DataContextWrapper Component={VoiceControl} />;
      case View.WebhookSimulator: 
        return <Wrapper Component={WebhookSimulator} props={{ stripeAccountId: 'acct_mock' }} />;

      default: return <AIIntentStub view={activeView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="relative flex flex-col flex-1 min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,#111,transparent)]">
          <div className="max-w-[1600px] mx-auto h-full min-h-0">
            {renderView()}
          </div>
        </main>
        <MonetizationOverlay />
        <Link 
          to="/modules"
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] group"
          title="Open AI Nexus"
        >
          <Grid size={20} className="group-hover:animate-spin-slow" />
        </Link>
      </div>
    </div>
  );
};

const AI_MODULES = [
  "https://admin08077-openapi.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-ai-ban-king-demo.static.hf.space",
  "https://admin08077-1233.static.hf.space",
  "https://admin08077-inventions.static.hf.space",
  "https://admin08077-gemini-app-citibank-demo-business-inc-google.static.hf.space",
  "https://admin08077-aibankdemo2.static.hf.space",
  "https://admin08077-airenderer.static.hf.space",
  "https://admin08077-book.static.hf.space",
  "https://admin08077-merrychristmas.static.hf.space",
  "https://admin08077-apiai.static.hf.space",
  "https://admin08077-projectatlas.static.hf.space",
  "https://admin08077-jocall3.static.hf.space",
  "https://admin08077-demob.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-static.static.hf.space",
  "https://admin08077-demoo.static.hf.space",
  "https://admin08077-webgenai.static.hf.space",
  "https://admin08077-aiab.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-app.static.hf.space",
  "https://admin08077-aib8nking.static.hf.space",
  "https://admin08077-bb.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-apps.static.hf.space",
  "https://admin08077-newwa.static.hf.space",
  "https://admin08077-jamesocallaghanprivatebank.hf.space",
  "https://admin08077-drip-faucet.static.hf.space",
  "https://admin08077-transactpro.hf.space",
  "https://admin08077-quantumbank.hf.space",
  "https://admin08077-test.hf.space"
];

const getModuleTitle = (url: string) => {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    // Remove .hf.space or .static.hf.space
    hostname = hostname.replace('.static.hf.space', '').replace('.hf.space', '');
    // Remove admin08077- prefix
    hostname = hostname.replace(/^admin\d+-/, '');
    // Replace hyphens with spaces
    const title = hostname.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return title || 'AI Module';
  } catch (e) {
    return 'AI Module';
  }
};

const AIModuleCard = ({ url, className }: { url: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const title = getModuleTitle(url);

  return (
    <div className={`flex flex-col w-full bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 group ${className || 'h-[500px]'}`}>
      <div className="px-4 py-3 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-sm font-mono font-bold text-gray-300 group-hover:text-cyan-400 transition-colors truncate max-w-[300px]">
            {title}
          </span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-white transition-colors">
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="relative flex-1 bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/20 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title={title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

const ExternalIframeCollection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % AI_MODULES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + AI_MODULES.length) % AI_MODULES.length);
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} transition-all duration-300 border-r border-gray-800 bg-gray-950 flex flex-col fixed md:relative z-20 h-full`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="font-mono font-bold text-gray-200 tracking-wider">MODULES</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white">
            <ArrowLeft size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {AI_MODULES.map((url, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-mono transition-all duration-200 flex items-center gap-3 ${
                activeIndex === index
                  ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300 border border-transparent'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeIndex === index ? 'bg-cyan-400 animate-pulse' : 'bg-gray-700'}`} />
              <span className="truncate">{getModuleTitle(url)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative">
        {/* Top Bar */}
        <div className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Terminal size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <div className="p-1.5 rounded-md bg-gray-900 group-hover:bg-gray-800 border border-gray-800 group-hover:border-gray-700">
                <ArrowLeft size={14} />
              </div>
              <span className="text-xs font-mono tracking-widest">RETURN TO OS</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-mono text-gray-400">
               MODULE {activeIndex + 1} / {AI_MODULES.length}
             </div>
          </div>
        </div>

        {/* Card Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center overflow-hidden relative">
           {/* Navigation Buttons (Desktop) */}
           <button 
             onClick={handlePrev}
             className="absolute left-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           </button>

           <button 
             onClick={handleNext}
             className="absolute right-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="rotate-180 group-hover:translate-x-1 transition-transform" />
           </button>

           {/* The Card */}
           <div className="w-full h-full max-w-[1400px] relative flex flex-col">
             <div className="flex-1 relative animate-in fade-in zoom-in-95 duration-500">
               <AIModuleCard 
                 key={activeIndex} 
                 url={AI_MODULES[activeIndex]} 
                 className="h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-gray-800" 
               />
             </div>
             
             {/* Mobile Nav */}
             <div className="flex md:hidden items-center justify-between mt-4 gap-4">
               <button onClick={handlePrev} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Prev</button>
               <button onClick={handleNext} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Next</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const theme = createTheme({ palette: { mode: 'dark' } });

function App() {
  return (
    <Auth0Provider
      domain="aibankinguniversity.us.auth0.com"
      clientId="fOkKYLJUrLnv7hInn8CVi3cHpjF7xPRp"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <AuthProvider>
        <DataProvider>
          <MoneyMovementProvider>
            <StripeDataProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/modules" element={<ExternalIframeCollection />} />
                    <Route path="/business-demo" element={<BusinessDemoView />} />
                    <Route path="*" element={<SAppLayout />} />
                  </Routes>
                </Router>
              </ThemeProvider>
            </StripeDataProvider>
          </MoneyMovementProvider>
        </DataProvider>
      </AuthProvider>
      <Analytics />
    </Auth0Provider>
  );
}

export default App;

================================================================================
// APPENDED FROM REPO: diplomat-bit/my-appaibanking | ORIGINAL PATH: diplomat-bit-my-appaibanking-43962ef/App.tsx
================================================================================



================================================================================
// APPENDED FROM REPO: diplomat-bit/tts-ai-book-reader-it-can-read-entire-books | ORIGINAL PATH: diplomat-bit-tts-ai-book-reader-it-can-read-entire-books-128ebf1/App.tsx
================================================================================


import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Play, Square, Loader2, History, Volume2, 
  Trash2, CreditCard, CheckCircle2, Lock, 
  BookOpen, Crown, X, Headphones, Settings,
  AlertTriangle
} from 'lucide-react';
import { VOICE_OPTIONS } from './constants';
import { VoiceName, SpeechHistoryItem } from './types';
import { generateSpeech } from './services/geminiService';
import { decodeBase64, decodeAudioData } from './utils/audioUtils';
import { splitTextIntoChunks } from './utils/textUtils';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Kore');
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [history, setHistory] = useState<SpeechHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const currentSessionIdRef = useRef<string>("");
  const chunkCacheRef = useRef<Map<number, AudioBuffer>>(new Map());

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const stopAudio = useCallback(() => {
    currentSessionIdRef.current = ""; // Invalidate session
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current.clear();
    chunkCacheRef.current.clear();
    nextStartTimeRef.current = 0;
    setIsLoading(false);
    setProgress({ current: 0, total: 0 });
  }, []);

  const handleStripeCheckout = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsPremium(true);
      setIsProcessingPayment(false);
      setShowStripe(false);
    }, 2000);
  };

  const fetchChunk = async (chunkText: string, index: number, sessionId: string) => {
    try {
      const base64Audio = await generateSpeech(chunkText, selectedVoice);
      if (currentSessionIdRef.current !== sessionId) return null;
      
      const audioBytes = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current!);
      return audioBuffer;
    } catch (err) {
      console.error(`Error fetching chunk ${index}:`, err);
      return null;
    }
  };

  const handleSpeak = async (overrideText?: string) => {
    const textToSpeak = overrideText || text;
    if (!textToSpeak.trim()) return;

    if (textToSpeak.length > 3000 && !isPremium) {
      setShowStripe(true);
      return;
    }

    const sessionId = Math.random().toString(36);
    currentSessionIdRef.current = sessionId;
    
    setIsLoading(true);
    setError(null);
    stopAudio();
    currentSessionIdRef.current = sessionId; // Reset after stopAudio cleared it
    
    initAudioContext();
    nextStartTimeRef.current = audioContextRef.current!.currentTime;

    const chunks = splitTextIntoChunks(textToSpeak);
    setProgress({ current: 0, total: chunks.length });

    if (!overrideText) {
      const newItem: SpeechHistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        text: textToSpeak.substring(0, 200) + (textToSpeak.length > 200 ? '...' : ''),
        voice: selectedVoice,
        timestamp: Date.now(),
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10));
    }

    // PIPELINED PLAYBACK ENGINE
    let playIndex = 0;
    let fetchIndex = 0;
    const MAX_LOOKAHEAD = 3;

    try {
      // Start initial batch of fetches
      const fetchNext = async () => {
        if (fetchIndex >= chunks.length || currentSessionIdRef.current !== sessionId) return;
        const idx = fetchIndex++;
        const buffer = await fetchChunk(chunks[idx], idx, sessionId);
        if (buffer && currentSessionIdRef.current === sessionId) {
          chunkCacheRef.current.set(idx, buffer);
        }
      };

      // Initial fill
      for (let i = 0; i < MAX_LOOKAHEAD; i++) await fetchNext();

      while (playIndex < chunks.length) {
        if (currentSessionIdRef.current !== sessionId) return;

        const buffer = chunkCacheRef.current.get(playIndex);
        
        if (!buffer) {
          // Wait for buffer if it's not ready
          await new Promise(r => setTimeout(r, 200));
          continue;
        }

        const source = audioContextRef.current!.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current!.destination);
        
        const startTime = Math.max(nextStartTimeRef.current, audioContextRef.current!.currentTime);
        source.start(startTime);
        
        activeSourcesRef.current.add(source);
        nextStartTimeRef.current = startTime + buffer.duration;

        source.onended = () => {
          activeSourcesRef.current.delete(source);
        };

        // Clear cache and trigger next fetch
        chunkCacheRef.current.delete(playIndex);
        playIndex++;
        setProgress(p => ({ ...p, current: playIndex }));
        
        await fetchNext();

        // Control playback speed vs fetch speed
        const timeRemaining = nextStartTimeRef.current - audioContextRef.current!.currentTime;
        if (timeRemaining > 20) {
           // We have plenty of audio scheduled, slow down the loop
           await new Promise(r => setTimeout(r, 5000));
        }
      }
    } catch (err: any) {
      if (currentSessionIdRef.current === sessionId) {
        setError("Playback interrupted. The book might be too long or network is unstable.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-full h-full bg-indigo-600/5 blur-[160px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-full h-full bg-purple-600/5 blur-[160px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls & Voices */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tighter">VOXGEMINI</h1>
            </div>

            <div className="glass rounded-3xl p-5 border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Narrator</span>
                <Settings className="w-3 h-3 text-slate-500" />
              </div>
              <div className="space-y-2">
                {VOICE_OPTIONS.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all border flex items-center justify-between group ${
                      selectedVoice === voice.id
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold">{voice.name}</p>
                      <p className={`text-[10px] ${selectedVoice === voice.id ? 'text-indigo-200' : 'text-slate-500'}`}>{voice.gender}</p>
                    </div>
                    {selectedVoice === voice.id && <div className="w-2 h-2 bg-white rounded-full animate-ping" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-5 border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Crown className={`w-4 h-4 ${isPremium ? 'text-yellow-400' : 'text-slate-500'}`} />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Membership</h3>
              </div>
              {isPremium ? (
                <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-xl">
                  <p className="text-[10px] font-black text-yellow-400 uppercase tracking-tighter mb-1">PRO SUBSCRIBER</p>
                  <p className="text-[10px] text-slate-400 leading-tight">Unlimited book reading enabled.</p>
                </div>
              ) : (
                <button 
                  onClick={() => setShowStripe(true)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/20"
                >
                  Unlock Book Mode
                </button>
              )}
            </div>

            <div className="hidden lg:block">
              <div className="flex items-center gap-2 mb-4 px-1">
                <History className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Library</span>
              </div>
              <div className="space-y-2">
                {history.map((item) => (
                  <button key={item.id} onClick={() => {setText(item.text); handleSpeak(item.text);}} className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group">
                    <p className="text-[10px] text-slate-400 line-clamp-1 italic">"{item.text}"</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Reader */}
          <div className="lg:col-span-9 space-y-6">
            <div className="relative glass rounded-[2.5rem] border-white/5 p-8 md:p-12 shadow-2xl min-h-[70vh] flex flex-col">
              
              {/* Progress Indicator */}
              {progress.total > 0 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(99,102,241,0.5)]" 
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              )}

              {error && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your 200-page book here and hit Read..."
                className="flex-1 w-full bg-transparent text-slate-200 placeholder-slate-800 focus:outline-none transition-all resize-none text-2xl font-light leading-relaxed scrollbar-hide"
                spellCheck={false}
              />

              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  {isLoading ? (
                    <div className="flex items-center gap-4 text-indigo-400">
                      <div className="flex gap-1 items-end h-4">
                        {[0,1,2,3].map(i => (
                          <div key={i} className="w-1 bg-current rounded-full animate-bounce" style={{animationDelay: `${i * 0.1}s`, height: `${40 + Math.random() * 60}%`}} />
                        ))}
                      </div>
                      <span className="text-sm font-black uppercase tracking-tighter">
                        Reading Page {progress.current} of {progress.total}
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-500 text-xs font-medium">
                      {text.length.toLocaleString()} characters detected • {Math.ceil(text.length / 1000)} minute read
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {isLoading ? (
                    <button
                      onClick={stopAudio}
                      className="flex-1 md:w-32 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 text-slate-100 font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Square className="w-4 h-4 fill-current" /> Stop
                    </button>
                  ) : (
                    <button
                      disabled={!text.trim()}
                      onClick={() => handleSpeak()}
                      className={`flex-1 md:w-56 h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl ${
                        !text.trim()
                          ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5'
                          : 'bg-white text-black hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      <Play className="w-5 h-5 fill-current" /> START READING
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Checkout Simulator */}
      {showStripe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#635bff] rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">Stripe Checkout</span>
              </div>
              <button onClick={() => setShowStripe(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-10">
              <div className="mb-10">
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Subscribe to VoxGemini Pro</p>
                <h3 className="text-5xl font-black text-slate-900 mb-2">$19.00<span className="text-xl text-slate-400 font-medium">/mo</span></h3>
                <p className="text-slate-500">Unlocks AI Narrative Mode for long-form books and documents.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Card Details</label>
                  <div className="h-14 border-2 border-slate-200 focus-within:border-[#635bff] rounded-2xl flex items-center px-5 gap-3 bg-slate-50 transition-all">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="4242 4242 4242 4242" className="flex-1 bg-transparent outline-none font-medium text-lg" disabled />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-14 border-2 border-slate-200 rounded-2xl flex items-center px-5 bg-slate-50">
                    <input type="text" placeholder="MM / YY" className="w-full bg-transparent outline-none font-medium" disabled />
                  </div>
                  <div className="h-14 border-2 border-slate-200 rounded-2xl flex items-center px-5 bg-slate-50">
                    <input type="text" placeholder="CVC" className="w-full bg-transparent outline-none font-medium" disabled />
                  </div>
                </div>

                <button 
                  onClick={handleStripeCheckout}
                  disabled={isProcessingPayment}
                  className={`w-full h-16 mt-4 bg-[#635bff] hover:bg-[#5349e0] text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 transition-all ${isProcessingPayment ? 'opacity-70 scale-95' : ''}`}
                >
                  {isProcessingPayment ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-5 h-5" /> Subscribe Now
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4">
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Secure</div>
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Encrypted</div>
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Cancel Anytime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;


================================================================================
// APPENDED FROM REPO: diplomat-bit/usa | ORIGINAL PATH: diplomat-bit-usa-d72fd59/App.tsx
================================================================================

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AuthModal } from './components/AuthModal';
import { FileExplorer } from './components/FileExplorer';
import { EditorCanvas } from './components/EditorCanvas';
import { fetchAllRepos, fetchRepoTree, fetchFlatRepoTree, getFileContent, commitFile, getRepoBranches, createBranch, createPullRequest, createRepo, triggerWorkflow, getWorkflowRuns, getWorkflowRun, getWorkflowRunLogs } from './services/githubService';
import { primaryModels, fallbackModels, planRepositoryEdit, bulkEditFileWithAI, generateProjectPlan, generateFileContent, planProjectExpansionEdits, generateMultipleFilesContent, modelsToUse, streamSingleFileEdit, cleanAiCodeResponse, correctCodeFromBuildError, streamRepositoryFileEdit, setGeminiApiKey, executeSequentialSwarm, runWithConcurrencyLimit } from './services/geminiService';
import { GithubRepo, UnifiedFileTree, SelectedFile, Alert, Branch, FileNode, DirNode, BulkEditJob, ProjectGenerationJob, ProjectExpansionJob, ProjectExpansionPhase, ProjectPlan, AdvancedEditJob, AdvancedEditPhase, WorkflowRun, AdvancedEditJobStatus, RepositoryEditPlan, ProjectExpansionPlan } from './types';
import { Spinner } from './components/Spinner';
import { AlertPopup } from './components/AlertPopup';
import { MultiFileAiEditModal } from './components/BulkAiEditModal';
import { BulkEditProgress } from './components/BulkEditProgress';
import { NewProjectModal } from './components/NewProjectModal';
import { ProjectGenerationProgress } from './components/ProjectGenerationProgress';
import { ProjectExpansionModal } from './components/ProjectExpansionModal';
import { ProjectExpansionProgress } from './components/ProjectExpansionProgress';
import { AdvancedAiEditModal } from './components/AdvancedAiEditModal';
import { AdvancedEditProgress } from './components/AdvancedEditProgress';
import { AiChatModal } from './components/AiChatModal';
import { getAllFilePaths, getRandomElements } from './utils';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<UnifiedFileTree>({});
  
  const [openFiles, setOpenFiles] = useState<SelectedFile[]>([]);
  const [activeFileKey, setActiveFileKey] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [alert, setAlert] = useState<Alert | null>(null);
  
  const [branchesByRepo, setBranchesByRepo] = useState<Record<string, Branch[]>>({});
  const [currentBranchByRepo, setCurrentBranchByRepo] = useState<Record<string, string>>({});

  const [isMultiEditModalOpen, setMultiEditModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkEditJobs, setBulkEditJobs] = useState<BulkEditJob[]>([]);
  
  const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [projectGenerationJobs, setProjectGenerationJobs] = useState<ProjectGenerationJob[]>([]);
  const [projectGenerationStatus, setProjectGenerationStatus] = useState('');
  
  const [isExpansionModalOpen, setExpansionModalOpen] = useState(false);
  const [isExpandingProject, setIsExpandingProject] = useState(false);
  const [expansionJobs, setExpansionJobs] = useState<ProjectExpansionJob[]>([]);
  const [expansionPhase, setExpansionPhase] = useState<ProjectExpansionPhase>('idle');
  const [expansionReasonings, setExpansionReasonings] = useState<string[]>([]);
  
  // State for the new Advanced AI Edit feature
  const [isAdvancedEditModalOpen, setAdvancedEditModalOpen] = useState(false);
  const [isAdvancedEditing, setIsAdvancedEditing] = useState(false);
  const [advancedEditJobs, setAdvancedEditJobs] = useState<AdvancedEditJob[]>([]);
  const advancedEditJobsRef = useRef<AdvancedEditJob[]>([]);
  useEffect(() => {
    advancedEditJobsRef.current = advancedEditJobs;
  }, [advancedEditJobs]);
  const [advancedEditPhase, setAdvancedEditPhase] = useState<AdvancedEditPhase>('idle');
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [advancedEditBuildLogs, setAdvancedEditBuildLogs] = useState<string | null>(null);
  const [workflowRunUrl, setWorkflowRunUrl] = useState<string | null>(null);
  const [aiThought, setAiThought] = useState<string | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [lastInstruction, setLastInstruction] = useState<string>('');
  const [isSwarmModeActive, setIsSwarmModeActive] = useState(false);
  const swarmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const openingFilesRef = useRef<Set<string>>(new Set());

  const [isAiChatModalOpen, setAiChatModalOpen] = useState(false);
  const modelLastUsedRef = useRef<Record<string, number>>({});
  const commitChainRef = useRef<Promise<any>>(Promise.resolve());

  const [loadingRepos, setLoadingRepos] = useState<Record<string, boolean>>({});
  const [repoErrors, setRepoErrors] = useState<Record<string, string | null>>({});

  const fetchRepoData = useCallback(async (repoFullName: string, forceToken?: string) => {
    const activeToken = forceToken || token;
    if (!activeToken) return;

    if (loadingRepos[repoFullName]) return;

    setLoadingRepos(prev => ({ ...prev, [repoFullName]: true }));
    setRepoErrors(prev => ({ ...prev, [repoFullName]: null }));

    try {
      setFileTree(currentTree => {
        const repoEntry = currentTree[repoFullName];
        if (!repoEntry) return currentTree;
        
        const { repo } = repoEntry;

        (async () => {
          try {
            const tree = await fetchRepoTree(activeToken, repo.owner.login, repo.name, repo.default_branch);
            const repoBranches = await getRepoBranches(activeToken, repo.owner.login, repo.name);

            setFileTree(prev => {
              if (!prev[repoFullName]) return prev;
              return {
                ...prev,
                [repoFullName]: {
                  ...prev[repoFullName],
                  tree
                }
              };
            });
            setBranchesByRepo(prev => ({ ...prev, [repoFullName]: repoBranches }));
            setCurrentBranchByRepo(prev => ({ ...prev, [repoFullName]: repo.default_branch }));
          } catch (e: any) {
            console.error(`Failed to fetch tree for ${repoFullName}`, e);
            if (e.message?.includes('409') || e.message?.includes('Git Repository is empty')) {
              setFileTree(prev => {
                if (!prev[repoFullName]) return prev;
                return {
                  ...prev,
                  [repoFullName]: {
                    ...prev[repoFullName],
                    tree: []
                  }
                };
              });
            } else {
              setRepoErrors(prev => ({ ...prev, [repoFullName]: e.message || 'Failed to load' }));
            }
          } finally {
            setLoadingRepos(prev => ({ ...prev, [repoFullName]: false }));
          }
        })();

        return currentTree;
      });
    } catch (e: any) {
      console.error(e);
      setRepoErrors(prev => ({ ...prev, [repoFullName]: e.message || 'Failed to load' }));
      setLoadingRepos(prev => ({ ...prev, [repoFullName]: false }));
    }
  }, [token, loadingRepos]);

  const activeFile = openFiles.find(f => (f.repoFullName + '::' + f.path) === activeFileKey);
  const currentBranch = activeFile ? currentBranchByRepo[activeFile.repoFullName] : null;
  const branches = activeFile ? branchesByRepo[activeFile.repoFullName] || [] : [];

  const handleTokenSubmit = useCallback(async (credentials: { githubToken: string; geminiKey?: string }) => {
    if (!credentials.githubToken) return;
    
    if (credentials.geminiKey) {
        setGeminiApiKey(credentials.geminiKey);
    }

    setToken(credentials.githubToken);
    setIsLoading(true);
    setLoadingMessage('Fetching repositories...');
    try {
      const repos: GithubRepo[] = await fetchAllRepos(credentials.githubToken);
      const newFileTree: UnifiedFileTree = {};
      
      repos.forEach((repo) => {
        newFileTree[repo.full_name] = { repo, tree: [] };
      });
      setFileTree(newFileTree);

      if (repos.length > 0) {
        const firstRepoName = repos[0].full_name;
        setTimeout(() => {
          fetchRepoData(firstRepoName, credentials.githubToken);
        }, 100);
      }
    } catch (error: any) {
      console.error(error);
      setAlert({ type: 'error', message: `Failed to load repositories: ${error.message || 'Check your token.'}` });
      setToken(null);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [fetchRepoData]);

  const handleFileSelect = async (repoFullName: string, path: string) => {
    const fileKey = repoFullName + '::' + path;
    
    // 1. Sync check against current state
    if (openFiles.some(f => (f.repoFullName + '::' + f.path) === fileKey)) {
        setActiveFileKey(fileKey);
        return;
    }

    // 2. Race condition guard
    if (openingFilesRef.current.has(fileKey)) {
        return;
    }
    openingFilesRef.current.add(fileKey);

    if (!token) {
        openingFilesRef.current.delete(fileKey);
        return;
    }

    setIsLoading(true);
    setLoadingMessage(`Opening ${path}...`);
    try {
        // Find repo to get owner/name
        const repo = fileTree[repoFullName]?.repo;
        if (!repo) throw new Error("Repo not found");
        
        const branch = currentBranchByRepo[repoFullName] || repo.default_branch;

        const { content, sha } = await getFileContent(token, repo.owner.login, repo.name, path, branch);
        
        const newFile: SelectedFile = {
            repoFullName,
            path,
            content,
            editedContent: content,
            sha,
            defaultBranch: repo.default_branch
        };

        setOpenFiles(prev => {
            const exists = prev.some(f => (f.repoFullName + '::' + f.path) === fileKey);
            if (exists) return prev;
            return [...prev, newFile];
        });
        setActiveFileKey(fileKey);
    } catch (error) {
        console.error(error);
        setAlert({ type: 'error', message: `Failed to open file: ${path}` });
    } finally {
        openingFilesRef.current.delete(fileKey);
        setIsLoading(false);
        setLoadingMessage('');
    }
  };

  const handleCloseFile = (fileKey: string) => {
    setOpenFiles(prev => prev.filter(f => (f.repoFullName + '::' + f.path) !== fileKey));
    if (activeFileKey === fileKey) {
      setActiveFileKey(null);
    }
  };

  const handleFileContentChange = (fileKey: string, newContent: string) => {
    setOpenFiles(prev => prev.map(f => {
      if ((f.repoFullName + '::' + f.path) === fileKey) {
        return { ...f, editedContent: newContent };
      }
      return f;
    }));
  };

  const handleSetActiveFile = (fileKey: string) => {
    setActiveFileKey(fileKey);
  };

  const handleCommit = async (commitMessage: string) => {
    if (!activeFile || !token) return;
    setIsLoading(true);
    setLoadingMessage('Committing changes...');
    try {
        const [owner, repoName] = activeFile.repoFullName.split('/');
        const branch = currentBranchByRepo[activeFile.repoFullName] || activeFile.defaultBranch;

        const newSha = await commitFile({
            token,
            owner,
            repo: repoName,
            branch,
            path: activeFile.path,
            content: activeFile.editedContent,
            message: commitMessage,
            sha: activeFile.sha
        });

        // Update local state
        setOpenFiles(prev => prev.map(f => {
            if ((f.repoFullName + '::' + f.path) === activeFileKey) {
                return { ...f, content: f.editedContent, sha: newSha };
            }
            return f;
        }));
        
        setAlert({ type: 'success', message: 'Changes committed successfully!' });

    } catch (error) {
        console.error(error);
        setAlert({ type: 'error', message: 'Failed to commit changes.' });
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };

  const handleBranchChange = async (newBranch: string) => {
      if (!activeFile || !token) return;
      const repoFullName = activeFile.repoFullName;
      setCurrentBranchByRepo(prev => ({ ...prev, [repoFullName]: newBranch }));
      
      // Reload active file content for the new branch
      setIsLoading(true);
      try {
          const [owner, repoName] = repoFullName.split('/');
          const { content, sha } = await getFileContent(token, owner, repoName, activeFile.path, newBranch);
           setOpenFiles(prev => prev.map(f => {
            if ((f.repoFullName + '::' + f.path) === activeFileKey) {
                return { ...f, content, editedContent: content, sha };
            }
            return f;
        }));
        // Also need to refresh file tree for the new branch
        const tree = await fetchRepoTree(token, owner, repoName, newBranch);
        setFileTree(prev => ({
            ...prev,
            [repoFullName]: { ...prev[repoFullName], tree }
        }));

      } catch (e) {
          console.error("Error switching branch", e);
          setAlert({ type: 'error', message: "Failed to switch branch/reload file."});
      } finally {
          setIsLoading(false);
      }
  };

  const handleCreateBranch = async (newBranchName: string) => {
      if (!activeFile || !token) return;
      setIsLoading(true);
      try {
          const [owner, repoName] = activeFile.repoFullName.split('/');
          const currentBranchName = currentBranchByRepo[activeFile.repoFullName] || activeFile.defaultBranch;
          
          // Get the SHA of the current branch head to base new branch off
          const branchData = await getRepoBranches(token, owner, repoName);
          const currentBranchData = branchData.find(b => b.name === currentBranchName);
          
          if (!currentBranchData) throw new Error("Could not find current branch tip SHA");

          await createBranch(token, owner, repoName, newBranchName, currentBranchData.commit.sha);
          
          // Refresh branches list
          const newBranches = await getRepoBranches(token, owner, repoName);
          setBranchesByRepo(prev => ({...prev, [activeFile.repoFullName]: newBranches}));
          
          // Switch to new branch
          handleBranchChange(newBranchName);
          setAlert({ type: 'success', message: `Branch ${newBranchName} created and active.`});

      } catch (e) {
          console.error(e);
          setAlert({ type: 'error', message: 'Failed to create branch.' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleCreatePullRequest = async (title: string, body: string) => {
      if (!activeFile || !token) return;
      setIsLoading(true);
      try {
          const [owner, repoName] = activeFile.repoFullName.split('/');
          const head = currentBranchByRepo[activeFile.repoFullName];
          const base = activeFile.defaultBranch;
          
          const pr = await createPullRequest({
              token, owner, repo: repoName, title, body, head, base
          });
          setAlert({ type: 'success', message: `Pull Request #${pr.number} created: ${pr.html_url}` });
      } catch (e) {
           console.error(e);
           setAlert({ type: 'error', message: 'Failed to create Pull Request.' });
      } finally {
          setIsLoading(false);
      }
  };


  const toggleFileSelection = (fileKey: string, isSelected: boolean) => {
      const newSelection = new Set(selectedFiles);
      if (isSelected) {
          newSelection.add(fileKey);
      } else {
          newSelection.delete(fileKey);
      }
      setSelectedFiles(newSelection);
  };

  const toggleDirectorySelection = (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => {
      const paths = getAllFilePaths(nodes);
      const newSelection = new Set(selectedFiles);
      paths.forEach(p => {
          const key = `${repoFullName}::${p}`;
          if (shouldSelect) newSelection.add(key);
          else newSelection.delete(key);
      });
      setSelectedFiles(newSelection);
  };

  // --- Bulk Edit Logic ---

  const handleStartBulkEdit = () => {
      if (selectedFiles.size === 0) return;
      setMultiEditModalOpen(true);
  };

  const handleBulkEditSubmit = async (instruction: string) => {
      setMultiEditModalOpen(false);
      setIsBulkEditing(true);
      
      const jobList: BulkEditJob[] = Array.from(selectedFiles).map((key: string) => {
          const [repoFullName, ...pathParts] = key.split('::');
          return {
              id: key,
              repoFullName,
              path: pathParts.join('::'), 
              status: 'queued',
              content: '',
              error: null,
              workers: [],
              attempts: 0
          };
      });
      setBulkEditJobs(jobList);

      const jobQueue = [...jobList];

      const processJob = async (job: BulkEditJob, model: string) => {
         if (!token) return;
         setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { 
             ...j, 
             status: 'processing',
             workers: [{ model, status: 'working', content: '' }]
         } : j));
         
         const [owner, repo] = job.repoFullName.split('/');
         const { content: originalContent, sha } = await getFileContent(token, owner, repo, job.path, currentBranchByRepo[job.repoFullName]);
         
         let finalContent = '';
         await bulkEditFileWithAI(
             originalContent,
             instruction,
             job.path,
             (chunk) => {
                 finalContent += chunk;
                 setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { 
                     ...j, 
                     content: finalContent,
                     workers: [{ model, status: 'working', content: finalContent }]
                 } : j));
             },
             () => finalContent,
             model
         );
         
         const cleanedContent = cleanAiCodeResponse(finalContent);
         
         await (commitChainRef.current = commitChainRef.current.then(async () => {
             // JIT fetch SHA inside the serial lock
             let currentSha = sha;
             try {
                 const f = await getFileContent(token, owner, repo, job.path, currentBranchByRepo[job.repoFullName]);
                 currentSha = f.sha;
             } catch (e) {}

             return commitFile({
                 token, owner, repo,
                 branch: currentBranchByRepo[job.repoFullName] || 'main',
                 path: job.path,
                 content: cleanedContent,
                 message: `AI Swarm Edit (${model}): ${instruction.slice(0, 50)}...`,
                 sha: currentSha
             });
         }));
         
         setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { 
             ...j, 
             status: 'success',
             workers: [{ model, status: 'finished', content: finalContent }]
         } : j));
      };

      const startWorker = async (model: string) => {
          while (jobQueue.length > 0) {
              const job = jobQueue.shift();
              if (!job) break;

              // 30s Cooldown
              const now = Date.now();
              const lastUsed = modelLastUsedRef.current[model] || 0;
              const wait = Math.max(0, 30500 - (now - lastUsed));
              if (wait > 0) await new Promise(r => setTimeout(r, wait));
              modelLastUsedRef.current[model] = Date.now();

              try {
                  await processJob(job, model);
              } catch (e: any) {
                  console.error(`Model ${model} failed for ${job.path}`, e);
                  job.attempts = (job.attempts || 0) + 1;
                  
                  if (job.attempts < 3) {
                      setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { 
                          ...j, 
                          status: 'retrying',
                          error: `Retrying (${job.attempts}/3)...` 
                      } : j));
                      jobQueue.push(job); // Put back in queue for another model
                  } else {
                      setBulkEditJobs(prev => prev.map(j => j.id === job.id ? { 
                          ...j, 
                          status: 'failed', 
                          error: e.message || 'Exhausted retries',
                          workers: [{ model, status: 'failed', content: '' }]
                      } : j));
                  }
              }
          }
      };

      // Start all workers
      primaryModels.forEach(model => startWorker(model));
  };

  // --- New Project Generation Logic ---
  
  const handleStartNewProject = () => {
      setNewProjectModalOpen(true);
  };

  const handleProjectGenerationSubmit = async (repoName: string, prompt: string, isPrivate: boolean) => {
      if (!token) return;
      setNewProjectModalOpen(false);
      setIsGeneratingProject(true);
      setProjectGenerationStatus('Initializing repository...');
      setProjectGenerationJobs([]);

      try {
          // 1. Create Repo
          const repo = await createRepo({ token, name: repoName, description: `AI Generated: ${prompt.slice(0, 50)}...`, isPrivate });
          setProjectGenerationStatus(`Repository ${repo.full_name} created. Planning structure...`);

          // Sequential-paired Priority Swarm Project Generation Planning (Prevents Rate-Limiting)
          const plan = await executeSequentialSwarm(primaryModels, (model) => 
              generateProjectPlan(prompt, model)
          );
          if (!plan) throw new Error("Failed to generate project plan.");

          const jobList: ProjectGenerationJob[] = plan.files.map((f, idx) => ({
              id: `${repoName}::${f.path}::${idx}`,
              path: f.path,
              description: f.description,
              status: 'queued',
              content: '',
              error: null,
              workers: [],
              attempts: 0
          }));
          setProjectGenerationJobs(jobList);
          setProjectGenerationStatus('Generating files...');

          const jobQueue = [...jobList];

          const processJob = async (job: ProjectGenerationJob, model: string) => {
                setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { 
                    ...j, 
                    status: 'generating',
                    workers: [{ model, status: 'working', content: '' }]
                } : j));
                
                let agentContent = '';
                await generateFileContent(
                    prompt,
                    job.path,
                    job.description,
                    (chunk) => {
                        agentContent += chunk;
                        setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { 
                            ...j, 
                            content: agentContent,
                            workers: [{ model, status: 'working', content: agentContent }]
                        } : j));
                    },
                    () => agentContent,
                    model
                );
                
                const cleanedContent = cleanAiCodeResponse(agentContent);
                setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'committing' } : j));
                
                await (commitChainRef.current = commitChainRef.current.then(async () => {
                    // JIT fetch SHA inside the serial lock
                    let currentSha: string | undefined = undefined;
                    try {
                        const f = await getFileContent(token, repo.owner.login, repo.name, job.path, repo.default_branch);
                        currentSha = f.sha;
                    } catch (e) {}

                    return commitFile({
                        token,
                        owner: repo.owner.login,
                        repo: repo.name,
                        branch: repo.default_branch,
                        path: job.path,
                        content: cleanedContent,
                        message: `AI Create Swarm (${model}): ${job.path}`,
                        sha: currentSha
                    });
                }));
                
                setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { 
                    ...j, 
                    status: 'success',
                    workers: [{ model, status: 'finished', content: agentContent }]
                } : j));
           };

           const startWorker = async (model: string) => {
               while (jobQueue.length > 0) {
                   const job = jobQueue.shift();
                   if (!job) break;

                   const now = Date.now();
                   const lastUsed = modelLastUsedRef.current[model] || 0;
                   const wait = Math.max(0, 30500 - (now - lastUsed));
                   if (wait > 0) await new Promise(r => setTimeout(r, wait));
                   modelLastUsedRef.current[model] = Date.now();

                   try {
                       await processJob(job, model);
                   } catch (e: any) {
                       console.error(`Model ${model} failed for ${job.path}`, e);
                       job.attempts = (job.attempts || 0) + 1;
                       if (job.attempts < 3) {
                           setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { 
                               ...j, 
                               status: 'retrying',
                               error: `Retrying (${job.attempts}/3)...`
                           } : j));
                           jobQueue.push(job);
                       } else {
                           setProjectGenerationJobs(prev => prev.map(j => j.id === job.id ? { 
                               ...j, 
                               status: 'failed', 
                               error: e.message || 'Worker failed',
                               workers: [{ model, status: 'failed', content: '' }]
                           } : j));
                       }
                   }
               }
           };

           primaryModels.forEach(model => startWorker(model));
            
            // Wait for all to finish (approximate check in UI)

            // Refresh Repo List
            const repos = await fetchAllRepos(token);
            // This part is a bit tricky since we need to update the file tree in the background
            // But the user might be watching the progress modal.
            // We'll leave the refresh manual or rely on the user reloading for now, 
            // or just add it to the tree if we want to be fancy.
      } catch (error: any) {
          setProjectGenerationStatus(`Error: ${error.message}`);
      }
  };

  // --- Project Expansion Logic ---
  
  const handleStartProjectExpansion = () => {
      setExpansionModalOpen(true);
  };

  const handleExpansionSubmit = async (prompt: string) => {
      setExpansionModalOpen(false);
      setIsExpandingProject(true);
      setExpansionPhase('planning');
      setExpansionJobs([]);
      setExpansionReasonings([]);

      if (!token || selectedFiles.size === 0) {
          setAlert({ type: 'error', message: 'Please select at least one seed file.' });
          setIsExpandingProject(false);
          return;
      }
      
      try {
          const selectedFileKeys = Array.from(selectedFiles) as string[];
          const repoFullName = selectedFileKeys[0].split('::')[0];
          const [owner, repo] = repoFullName.split('/');
          
          // Stage 1: Gather Seed Files (with a safety cap on total content size)
          let totalSeedCharCount = 0;
          const MAX_SEED_CHARS = 2000000; // 2M chars for seeds
          
          const seedFiles = await Promise.all(selectedFileKeys.map(async key => {
               const pathParts = key.split('::').slice(1);
               const path = pathParts.join('::');
               if (totalSeedCharCount > MAX_SEED_CHARS) return { path, content: "[Omitted: Context Limit Reached]" };
               
               try {
                   const { content } = await getFileContent(token, owner, repo, path, currentBranchByRepo[repoFullName]);
                   totalSeedCharCount += content.length;
                   return { path, content };
               } catch (e) {
                   return { path, content: "[Error fetching content]" };
               }
          }));

          // Stage 2: Gather 50 Random Files for Context
          const allRepoPaths = getAllFilePaths(fileTree[repoFullName]?.tree || []);
          const otherPaths = allRepoPaths.filter(p => !seedFiles.some(s => s.path === p));
          const randomPaths = getRandomElements(otherPaths, 50);
          
          const randomFiles = await Promise.all(randomPaths.map(async path => {
               try {
                   const { content } = await getFileContent(token, owner, repo, path, currentBranchByRepo[repoFullName]);
                   return { path, content };
               } catch (e) { return null; }
          })).then(results => results.filter((r): r is {path: string, content: string} => r !== null));

          // Stage 3: Planning Swarm with Multi-Focus Agents
          const focusAreas = [
              "Core Business Logic & Domain Entities",
              "UI Infrastructure, Design System & Layouts",
              "Data Persistence, API Integration & State Management",
              "Security, Middleware, Error Handling & Logging",
              "Advanced Feature Implementation & Vertical Slices",
              "Comprehensive Testing Suite & QA Layer",
              "Developer Experience, Documentation & Automation",
              "Integration Tier, Third-party SDKs & Webhooks",
              "Cross-Cutting Concerns & Architectural Refinement"
          ];

          const modelsToPlanWith = [...primaryModels, ...fallbackModels];
          // Use our concurrency limited runner (concurrency = 2) to stagger and prevent 429 rate leaks
          const results = await runWithConcurrencyLimit(
              modelsToPlanWith,
              2,
              (model, idx) => planProjectExpansionEdits(seedFiles, randomFiles, prompt, model, focusAreas[idx % focusAreas.length])
          );
          const successfulPlans = results
              .filter((r): r is PromiseFulfilledResult<ProjectExpansionPlan> => r.status === 'fulfilled')
              .map(r => r.value);

          if (successfulPlans.length === 0) throw new Error("Failed to plan expansion with any agent.");

          // Capture all reasonings
          setExpansionReasonings(successfulPlans.map(p => p.reasoning));

          // Merge batches from all successful plans
          // We filter out identical batches or paths here if needed, but for volume 
          // we'll just merge and let workers handle overlaps if they occur.
          const allBatches = successfulPlans.flatMap(p => p.batches);

          const jobList: ProjectExpansionJob[] = allBatches.map((batch, idx) => ({
              id: `${repoFullName}::batch::${idx}::${Date.now()}::${Math.floor(Math.random() * 10000)}`,
              type: 'create',
              batch,
              status: 'queued',
              content: '',
              generatedFiles: [],
              error: null,
              workers: [],
              attempts: 0
          }));
          
          setExpansionJobs(jobList);
          setExpansionPhase('generating');

          const jobQueue = [...jobList];

          const processJob = async (job: ProjectExpansionJob, model: string) => {
                setExpansionJobs(prev => prev.map(j => j.id === job.id ? { 
                    ...j, 
                    status: 'generating',
                    workers: [{ model, status: 'working', content: '' }]
                } : j));
                
                const result = await generateMultipleFilesContent(
                    prompt,
                    job.batch.files,
                    (chunk) => {
                        setExpansionJobs(prev => prev.map(j => j.id === job.id ? { 
                            ...j, 
                            content: chunk,
                            workers: [{ model, status: 'working', content: chunk }]
                        } : j));
                    },
                    model
                );
                
                setExpansionJobs(prev => prev.map(j => j.id === job.id ? { 
                    ...j, 
                    status: 'committing', 
                    generatedFiles: result.files,
                    thought: result.explanation 
                } : j));
                
                // Process each file in the batch sequentially
                for (const file of result.files) {
                   await (commitChainRef.current = commitChainRef.current.then(async () => {
                       let currentSha: string | undefined = undefined;
                       try {
                           const f = await getFileContent(token!, owner, repo, file.path, currentBranchByRepo[repoFullName] || 'main');
                           currentSha = f.sha;
                       } catch (e) {}

                       return commitFile({
                           token: token!,
                           owner,
                           repo,
                           branch: currentBranchByRepo[repoFullName] || 'main',
                           path: file.path,
                           content: file.content,
                           message: `AI Expansion Swarm (${model}): ${file.path}`,
                           sha: currentSha
                       });
                   }));
                }
                
                setExpansionJobs(prev => prev.map(j => j.id === job.id ? { 
                    ...j, 
                    status: 'success',
                    workers: [{ model, status: 'finished', content: 'Batch complete.' }]
                } : j));
           };

           const startWorker = async (model: string) => {
               while (jobQueue.length > 0) {
                   const job = jobQueue.shift();
                   if (!job) break;

                   const now = Date.now();
                   const lastUsed = modelLastUsedRef.current[model] || 0;
                   const wait = Math.max(0, 30500 - (now - lastUsed));
                   if (wait > 0) await new Promise(r => setTimeout(r, wait));
                   modelLastUsedRef.current[model] = Date.now();

                   try {
                       await processJob(job, model);
                   } catch (e: any) {
                       console.error(`Model ${model} failed for expansion batch ${job.id}`, e);
                       job.attempts = (job.attempts || 0) + 1;
                       if (job.attempts < 3) {
                           setExpansionJobs(prev => prev.map(j => j.id === job.id ? { 
                               ...j, 
                               status: 'retrying',
                               error: `Retrying (${job.attempts}/3)...`
                           } : j));
                           jobQueue.push(job);
                       } else {
                           setExpansionJobs(prev => prev.map(j => j.id === job.id ? { 
                               ...j, 
                               status: 'failed', 
                               error: e.message || 'Worker failed',
                               workers: [{ model, status: 'failed', content: '' }]
                           } : j));
                       }
                   }
               }
           };

           const workersToUse = [...primaryModels, ...fallbackModels];
           workersToUse.forEach(model => startWorker(model));

           const checkCompletion = setInterval(() => {
                const pending = jobQueue.length > 0 || jobList.some(j => j.status === 'queued' || j.status === 'generating' || j.status === 'committing' || j.status === 'retrying');
                if (!pending) {
                    setExpansionPhase('complete');
                    clearInterval(checkCompletion);
                }
            }, 1000);

      } catch (error: any) {
          console.error(error);
          setAlert({ type: 'error', message: `Expansion failed: ${error.message}` });
          setExpansionPhase('complete'); // Stop spinner
      }
  };

  // --- Advanced AI Edit (Agentic Loop) ---

  const handleStartAdvancedEdit = () => {
      setAdvancedEditModalOpen(true);
  };

  const handleAdvancedEditSubmit = async (instruction: string, workflowId: string) => {
      setLastInstruction(instruction);
      setAdvancedEditModalOpen(false);
      setIsAdvancedEditing(true);
      setAdvancedEditPhase('analyzing');
      setAdvancedEditJobs([]);
      setVerificationAttempt(1);
      setAdvancedEditBuildLogs(null);
      setWorkflowRunUrl(null);
      setAiThought(null);
      setDeploymentUrl(null);
      
      if (!token || !activeFile) return;

      const [owner, repo] = activeFile.repoFullName.split('/');
      const branch = currentBranchByRepo[activeFile.repoFullName] || activeFile.defaultBranch;
      
      const executeSwarm = async (currentInstruction: string) => {
          try {
              let currentFiles = await openFiles.map(f => ({ path: f.path, content: f.content, sha: f.sha }));
              let attempt = 1;
              const MAX_ATTEMPTS = 3;

              while (attempt <= MAX_ATTEMPTS) {
                  setVerificationAttempt(attempt);
                  
                  // Refresh current files from the actual repo before planning a fix
                  try {
                      const flatTree = await fetchFlatRepoTree(token, owner, repo, branch);
                      const fullFiles = await Promise.all(flatTree.filter(node => node.type === 'blob').map(async node => {
                          try {
                              const content = await getFileContent(token, owner, repo, node.path, branch);
                              return { path: node.path, content: content.content, sha: content.sha };
                          } catch (e) {
                              return null;
                          }
                      }));
                      currentFiles = fullFiles.filter(f => f !== null) as { path: string, content: string, sha: string }[];
                  } catch (e) {
                      console.error("Failed to refresh files during advanced edit loop", e);
                  }

                  if (attempt === 1) setAdvancedEditPhase('planning');
                  else setAdvancedEditPhase('analyzing_failure');

                  // Sequential-paired Priority Swarm Advanced Edit Planning (Prevents Rate-Limiting)
                  const plan = await executeSequentialSwarm(primaryModels, (model) => 
                      attempt === 1 ? 
                      planRepositoryEdit(currentInstruction, activeFile.path, currentFiles, model) :
                      correctCodeFromBuildError(currentInstruction, currentFiles, [], advancedEditBuildLogs || '', model)
                  );
                  
                  if (!plan) throw new Error("Failed to generate edit plan.");
                  setAiThought(plan.reasoning);

                  const jobs: AdvancedEditJob[] = plan.filesToEdit.map((f, idx) => ({
                      id: `${activeFile.repoFullName}::${f.path}::${idx}`,
                      path: f.path,
                      status: 'planning',
                      content: '',
                      error: null,
                      workers: primaryModels.map(m => ({ model: m, status: 'idle', content: '' }))
                  }));
                  setAdvancedEditJobs(jobs);
                  
                  setAdvancedEditPhase('editing');
                  
                  const queue = plan.filesToEdit.map(f => ({ ...f, attempts: 0 }));

                  const processEdit = async (fileEdit: { path: string, changes: string }, model: string) => {
                      const jobIndex = jobs.findIndex(j => j.path === fileEdit.path);
                      if (jobIndex === -1) return;
                      
                      setAdvancedEditJobs(prev => prev.map((j, i) => i === jobIndex ? { 
                          ...j, 
                          status: 'editing',
                          workers: [{ model, status: 'working', content: '' }]
                      } : j));
                      
                      let originalContent = currentFiles.find(f => f.path === fileEdit.path)?.content || '';
                      if (!originalContent) {
                          try {
                              const f = await getFileContent(token, owner, repo, fileEdit.path, branch);
                              originalContent = f.content;
                          } catch (e) { }
                      }

                      let agentContent = '';
                      await streamRepositoryFileEdit(originalContent, fileEdit.changes, fileEdit.path, (chunk) => {
                          agentContent += chunk;
                          setAdvancedEditJobs(prev => prev.map((j, i) => i === jobIndex ? { 
                              ...j, 
                              content: agentContent,
                              workers: [{ model, status: 'working', content: agentContent }]
                          } : j));
                      }, model);
                      
                      const cleanedContent = cleanAiCodeResponse(agentContent);
                      
                      setAdvancedEditPhase('committing');
                      setAdvancedEditJobs(prev => prev.map((j, i) => i === jobIndex ? { ...j, status: 'committing' } : j));

                      await (commitChainRef.current = commitChainRef.current.then(async () => {
                          // JIT fetch SHA inside the serial lock
                          let currentSha: string | undefined = undefined;
                          try {
                              const f = await getFileContent(token, owner, repo, fileEdit.path, branch);
                              currentSha = f.sha;
                          } catch (e) {}

                          return commitFile({
                              token, owner, repo, branch,
                              path: fileEdit.path,
                              content: cleanedContent,
                              message: `AI Swarm Edit (${model}) (Attempt ${attempt}): ${fileEdit.path}`,
                              sha: currentSha
                          });
                      }).catch(e => {
                          console.error("Serial commit failed, advancing chain anyway", e);
                          throw e; // still throw so the job can retry
                      }));

                      setAdvancedEditJobs(prev => prev.map((j, i) => i === jobIndex ? { 
                          ...j, 
                          status: 'success',
                          workers: [{ model, status: 'finished', content: agentContent }]
                      } : j));
                  };

                  const runWorker = async (model: string) => {
                      while (queue.length > 0) {
                          const item = queue.shift();
                          if (!item) break;

                          const now = Date.now();
                          const lastUsed = modelLastUsedRef.current[model] || 0;
                          const wait = Math.max(0, 30500 - (now - lastUsed));
                          if (wait > 0) await new Promise(r => setTimeout(r, wait));
                          modelLastUsedRef.current[model] = Date.now();

                          try {
                              await processEdit(item, model);
                          } catch (e: any) {
                              console.error(`Model ${model} failed for advanced edit ${item.path}`, e);
                              item.attempts = (item.attempts || 0) + 1;
                              if (item.attempts < 3) {
                                  setAdvancedEditJobs(prev => prev.map(j => j.id === item.path ? { 
                                      ...j, 
                                      status: 'planning', 
                                      error: `Retrying (${item.attempts}/3)...` 
                                  } : j));
                                  queue.push(item);
                              } else {
                                  setAdvancedEditJobs(prev => prev.map(j => j.id === item.path ? { 
                                      ...j, 
                                      status: 'failed',
                                      error: e.message || 'Worker failed',
                                      workers: [{ model, status: 'failed', content: '' }]
                                  } : j));
                              }
                          }
                      }
                  };

                  // Re-run workers until everything in queue is finished or failed
                  const runAllWorkers = async () => {
                      while (true) {
                          const currentJobs = advancedEditJobsRef.current;
                          const pendingInQueue = queue.length > 0;
                          const activeJobs = currentJobs.filter(j => j.status === 'planning' || j.status === 'editing' || j.status === 'committing').length;
                          
                          if (!pendingInQueue && activeJobs === 0) break;
                          
                          if (pendingInQueue) {
                              await Promise.all(primaryModels.map(model => runWorker(model)));
                          } else {
                              await new Promise(r => setTimeout(r, 1000));
                          }
                      }
                  };

                  await runAllWorkers();

                  setAdvancedEditPhase('triggering_workflow');
                  // Capture previous runs before triggering the workflow dispatch
                  let runsBefore: { total_count: number; workflow_runs: WorkflowRun[] } | null = null;
                  try {
                      runsBefore = await getWorkflowRuns(token, owner, repo, workflowId, branch);
                  } catch (e) {
                      console.error("Failed to query workflow runs before trigger:", e);
                  }
                  const existingRunIds = new Set(runsBefore?.workflow_runs.map(r => r.id) || []);

                  await triggerWorkflow(token, owner, repo, workflowId, branch);
                  
                  setAdvancedEditPhase('waiting_for_workflow');
                  await new Promise(r => setTimeout(r, 5000));
                  
                  let run: WorkflowRun | null = null;
                  const startTime = Date.now();
                  while (true) {
                      try {
                          const runs = await getWorkflowRuns(token, owner, repo, workflowId, branch);
                          // Look for a brand new run id that was not present before we triggered it
                          const newestUnseenRun = runs.workflow_runs.find(r => !existingRunIds.has(r.id));
                          
                          if (newestUnseenRun) {
                              run = newestUnseenRun;
                              setWorkflowRunUrl(run.html_url);
                              if (run.status === 'completed') {
                                  console.log("Workflow run completed:", run.id, run.conclusion);
                                  break;
                              }
                          } else if (runs.workflow_runs.length > 0) {
                              // Fallback: If 60 seconds pass and no newer run ID appears, 
                              // check if the most recent run was created after we started.
                              const mostRecent = runs.workflow_runs[0];
                              const runCreatedAt = new Date(mostRecent.created_at).getTime();
                              
                              if (runCreatedAt > startTime - 10000) { // allowance for clock skew
                                  run = mostRecent;
                                  setWorkflowRunUrl(run.html_url);
                                  if (run.status === 'completed') {
                                      console.log("Fallback: Workflow run completed:", run.id, run.conclusion);
                                      break;
                                  }
                              } else if (Date.now() - startTime > 90000) {
                                  // Truly stuck waiting for a run to even appear
                                  console.warn("No new workflow run appeared after 90 seconds.");
                                  // We'll keep waiting, but maybe the user can see the link if we guessed the most recent one is it
                                  setWorkflowRunUrl(mostRecent.html_url); 
                              }
                          }
                      } catch (e) {
                          console.error("Error polling workflow runs:", e);
                      }
                      await new Promise(r => setTimeout(r, 5000));
                  }

                  if (run && run.conclusion === 'success') {
                      setAdvancedEditPhase('complete');
                      setDeploymentUrl(`https://${owner}.github.io/${repo}/`); 
                      return true; 
                  } else {
                      setAdvancedEditPhase('analyzing_failure');
                      const logs = await getWorkflowRunLogs(token, owner, repo, run!.id);
                      setAdvancedEditBuildLogs(logs);
                      attempt++;
                  }
              }
              return false;
          } catch (e) {
              console.error(e);
              return false;
          }
      };

      const success = await executeSwarm(instruction);

      // Swarm mode logic
      if (isSwarmModeActive) {
          swarmIntervalRef.current = setTimeout(() => {
              handleAdvancedEditSubmit(instruction, workflowId);
          }, 30000);
      }
  };

  const toggleSwarmMode = () => {
      setIsSwarmModeActive(prev => {
          const next = !prev;
          if (!next && swarmIntervalRef.current) {
              clearTimeout(swarmIntervalRef.current);
          }
          return next;
      });
  };

  // --- Simple AI Edit ---
  const handleStartSimpleAiEdit = () => {
    setAiChatModalOpen(true);
  };
  
  const handleSimpleAiEditSubmit = async (instruction: string) => {
      setAiChatModalOpen(false);
      if (!activeFile || !token) return;
      
      const fileKey = activeFileKey!;
      // Optimistic update with "Processing..." or similar could go here, 
      // but we stream directly into the editor so it's visible.
      
      try {
          let finalContent = '';
          await streamSingleFileEdit(
              activeFile.editedContent, 
              instruction, 
              activeFile.path, 
              (chunk) => {
                  finalContent += chunk;
                  handleFileContentChange(fileKey, finalContent);
              },
              modelsToUse[0]
          );
           // Final cleanup
           handleFileContentChange(fileKey, cleanAiCodeResponse(finalContent));
      } catch (e) {
          console.error(e);
          setAlert({ type: 'error', message: "AI Edit failed."});
      }
  };


  if (!token) {
    return <AuthModal onSubmit={handleTokenSubmit} isLoading={isLoading} />;
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200 font-sans">
      <div className="w-80 border-r border-gray-700 flex flex-col">
        <FileExplorer 
            fileTree={fileTree} 
            onFileSelect={handleFileSelect} 
            onStartMultiEdit={handleStartBulkEdit}
            onStartNewProject={handleStartNewProject}
            onStartProjectExpansion={handleStartProjectExpansion}
            selectedFilePath={activeFile?.path}
            selectedRepo={activeFile?.repoFullName}
            selectedFiles={selectedFiles}
            onFileSelection={toggleFileSelection}
            onDirectorySelection={toggleDirectorySelection}
            onRepoExpand={fetchRepoData}
            loadingRepos={loadingRepos}
            repoErrors={repoErrors}
        />
      </div>
      <div className="flex-grow flex flex-col relative">
        <EditorCanvas
          openFiles={openFiles}
          activeFile={activeFile || null}
          onCommit={handleCommit}
          onAdvancedAiEdit={handleStartAdvancedEdit}
          onSimpleAiEditRequest={handleStartSimpleAiEdit}
          onFileContentChange={handleFileContentChange}
          onCloseFile={handleCloseFile}
          onSetActiveFile={handleSetActiveFile}
          isLoading={isLoading}
          branches={branches}
          currentBranch={currentBranch}
          onBranchChange={handleBranchChange}
          onCreateBranch={handleCreateBranch}
          onCreatePullRequest={handleCreatePullRequest}
          isSwarmModeActive={isSwarmModeActive}
          onToggleSwarmMode={toggleSwarmMode}
        />
        {isLoading && loadingMessage && (
            <div className="absolute inset-0 bg-gray-950 bg-opacity-50 flex items-center justify-center z-20">
                <div className="bg-gray-850 p-4 rounded-lg shadow-lg flex items-center gap-3 border border-gray-700">
                    <Spinner />
                    <span>{loadingMessage}</span>
                </div>
            </div>
        )}
      </div>

      <AlertPopup alert={alert} onClose={() => setAlert(null)} />
      
      {isMultiEditModalOpen && (
          <MultiFileAiEditModal 
            fileCount={selectedFiles.size} 
            onClose={() => setMultiEditModalOpen(false)} 
            onSubmit={handleBulkEditSubmit} 
          />
      )}
      
      {isBulkEditing && (
          <BulkEditProgress 
            jobs={bulkEditJobs} 
            onClose={() => setIsBulkEditing(false)} 
            isComplete={bulkEditJobs.every(j => j.status === 'success' || j.status === 'failed' || j.status === 'skipped')} 
          />
      )}
      
      {isNewProjectModalOpen && (
          <NewProjectModal onClose={() => setNewProjectModalOpen(false)} onSubmit={handleProjectGenerationSubmit} />
      )}
      
      {isGeneratingProject && (
          <ProjectGenerationProgress 
            jobs={projectGenerationJobs} 
            statusMessage={projectGenerationStatus}
            onClose={() => setIsGeneratingProject(false)}
            isComplete={projectGenerationJobs.length > 0 && projectGenerationJobs.every(j => ['success', 'failed'].includes(j.status))}
          />
      )}
      
      {isExpansionModalOpen && (
          <ProjectExpansionModal onClose={() => setExpansionModalOpen(false)} onSubmit={handleExpansionSubmit} />
      )}

      {isExpandingProject && (
          <ProjectExpansionProgress
            jobs={expansionJobs}
            phase={expansionPhase}
            reasonings={expansionReasonings}
            onClose={() => setIsExpandingProject(false)}
            isComplete={expansionPhase === 'complete'}
          />
      )}
      
      {isAdvancedEditModalOpen && activeFile && (
          <AdvancedAiEditModal 
            onClose={() => setAdvancedEditModalOpen(false)} 
            onSubmit={handleAdvancedEditSubmit}
            token={token}
            repoFullName={activeFile.repoFullName}
          />
      )}
      
      {isAdvancedEditing && (
          <AdvancedEditProgress
            jobs={advancedEditJobs}
            phase={advancedEditPhase}
            verificationAttempt={verificationAttempt}
            buildLogs={advancedEditBuildLogs}
            workflowRunUrl={workflowRunUrl}
            aiThought={aiThought}
            deploymentUrl={deploymentUrl}
            onClose={() => setIsAdvancedEditing(false)}
            isComplete={advancedEditPhase === 'complete'}
          />
      )}

      {isAiChatModalOpen && (
        <AiChatModal onClose={() => setAiChatModalOpen(false)} onSubmit={handleSimpleAiEditSubmit} />
      )}

    </div>
  );
}