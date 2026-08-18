// REPOSITORY SOURCE: diplomat-bit/ai-banking-swarm-roster | PATH: diplomat-bit-ai-banking-swarm-roster-20297ff/components/AdvancedEditProgress.tsx
================================================================================

import React from 'react';
import { AdvancedEditJob, AdvancedEditPhase } from '../types';
import { Spinner } from './Spinner';
import { BotIcon } from './icons/BotIcon';

const StatusIcon: React.FC<{ status: AdvancedEditJob['status'] }> = ({ status }) => {
    switch (status) {
        case 'planning':
        case 'editing':
            return <Spinner className="w-4 h-4 text-blue-400" />;
        case 'verifying':
            return <Spinner className="w-4 h-4 text-yellow-400" />;
        case 'committing':
            return <Spinner className="w-4 h-4 text-orange-400" />;
        case 'success': 
            return <div title="Success" className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>;
        case 'failed': 
            return <div title="Failed" className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">!</div>;
        default: 
             return <div title="Pending" className="w-4 h-4 rounded-full bg-gray-600 flex-shrink-0"></div>;
    }
};

const PhaseIndicator: React.FC<{title: string, isActive: boolean, isComplete: boolean}> = ({ title, isActive, isComplete }) => (
    <div className="flex items-center gap-2">
        {isActive && <Spinner className="h-4 w-4" />}
        {isComplete && <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>}
        <span className={isActive ? "text-indigo-300" : isComplete ? "text-gray-300" : "text-gray-500"}>{title}</span>
    </div>
);

interface AdvancedEditProgressProps {
  jobs: AdvancedEditJob[];
  phase: AdvancedEditPhase;
  verificationAttempt: number;
  buildLogs: string | null;
  workflowRunUrl: string | null;
  aiThought: string | null;
  deploymentUrl: string | null;
  onClose: () => void;
  isComplete: boolean;
}

export const AdvancedEditProgress: React.FC<AdvancedEditProgressProps> = ({ jobs, phase, verificationAttempt, buildLogs, workflowRunUrl, aiThought, deploymentUrl, onClose, isComplete }) => {
  const completedCount = jobs.filter(j => j.status === 'success').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;
  
  const getStatusMessage = () => {
    switch(phase) {
        case 'analyzing': return 'Analyzing repository context...';
        case 'planning': return 'AI is creating an edit plan...';
        case 'editing': return `AI is editing ${jobs.length} file(s)...`;
        case 'committing': return 'Committing changes to trigger workflow...';
        case 'triggering_workflow': return 'Triggering GitHub Actions workflow...';
        case 'waiting_for_workflow': return `Running CI build (Attempt ${verificationAttempt})...`;
        case 'analyzing_failure': return `Build failed (Attempt ${verificationAttempt}). Analyzing logs for correction...`;
        case 'complete': return 'Advanced edit complete and verified!';
        default: return 'Initializing...';
    }
  };

  const currentFocusJob = jobs.find(job => job.status === 'editing') || jobs.find(job => job.status === 'committing') || jobs[jobs.length - 1];

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-850 p-6 rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col border border-gray-700">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-indigo-400">Advanced AI Edit & Test</h2>
                {workflowRunUrl && (
                    <a href={workflowRunUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline">
                        View Workflow Run
                    </a>
                )}
            </div>
            {isComplete && (
              <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700">
                Close
              </button>
            )}
        </div>
        
        <div className="mb-4 flex-shrink-0 space-y-3">
            <div className="grid grid-cols-5 items-center justify-around p-2 bg-gray-900 rounded-md text-sm">
                <PhaseIndicator title="1. Plan" isActive={phase === 'analyzing' || phase === 'planning'} isComplete={!['idle', 'analyzing', 'planning'].includes(phase)} />
                <div className="flex-grow h-px bg-gray-700 mx-2"></div>
                <PhaseIndicator title="2. Edit" isActive={phase === 'editing'} isComplete={!['idle', 'analyzing', 'planning', 'editing'].includes(phase)} />
                <div className="flex-grow h-px bg-gray-700 mx-2"></div>
                <PhaseIndicator title="3. Commit" isActive={phase === 'committing'} isComplete={!['idle', 'analyzing', 'planning', 'editing', 'committing'].includes(phase)} />
                <div className="flex-grow h-px bg-gray-700 mx-2"></div>
                <PhaseIndicator title="4. Verify (CI)" isActive={phase === 'triggering_workflow' || phase === 'waiting_for_workflow' || phase === 'analyzing_failure'} isComplete={phase === 'complete'} />
                <div className="flex-grow h-px bg-gray-700 mx-2"></div>
                 <PhaseIndicator title="5. Done" isActive={false} isComplete={phase === 'complete'} />
            </div>
             <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span className="flex items-center gap-2">{getStatusMessage()}</span>
                <span>{`${completedCount} / ${jobs.length} files committed`}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        
        {aiThought && (
            <div className="mb-4 p-4 bg-gray-900 rounded-md border border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center gap-2">
                    <BotIcon className="w-5 h-5" />
                    AI Thought Process
                </h3>
                <p className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{aiThought}</p>
            </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 flex-grow min-h-0">
            <div className="bg-gray-900 rounded-md p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Affected Files ({jobs.length})</h3>
                <ul className="space-y-1 overflow-y-auto">
                    {jobs.map(job => (
                        <li key={job.id} className="flex items-center justify-between text-sm p-1.5 bg-gray-800 rounded">
                           <div className="flex items-center gap-3 overflow-hidden">
                               <StatusIcon status={job.status} />
                               <span className="truncate" title={job.path}>{job.path}</span>
                           </div>
                           {job.error && <span className="text-yellow-400 text-xs truncate ml-2 cursor-pointer" title={job.error}>{job.error}</span>}
                        </li>
                    ))}
                 </ul>
            </div>
            <div className="bg-gray-900 rounded-md p-4 flex flex-col">
                { isComplete && deploymentUrl ? (
                    <>
                        <h3 className="text-lg font-semibold mb-2 text-green-400">Live Deployment Preview</h3>
                        <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 p-3 rounded-md mb-4 text-sm">
                            <p>
                                GitHub Pages may prevent embedding. If the panel below is blank, please use the direct link.
                            </p>
                            <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-semibold mt-2 inline-block">
                                Open Live Site in New Tab &rarr;
                            </a>
                        </div>
                        <div className="flex-grow bg-white rounded-md overflow-hidden border-4 border-gray-700">
                            <iframe
                                src={deploymentUrl}
                                title="Live Deployment"
                                className="w-full h-full border-0"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        </div>
                    </>
                ) : phase === 'analyzing_failure' && buildLogs ? (
                    <>
                        <h3 className="text-lg font-semibold mb-2 text-red-400">Build Failure Logs</h3>
                        <div className="bg-black rounded p-2 flex-grow overflow-y-auto">
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words font-mono">
                                {/* FIX: Corrected a typo in the code tag from `code>` to `<code>`. */}
                                <code>{buildLogs}</code>
                            </pre>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold mb-2 text-gray-200">Live Code Generation</h3>
                        {currentFocusJob ? (
                             <div className="flex-grow flex flex-col min-h-0 bg-gray-850 rounded-lg p-2">
                                <p className="text-blue-300 font-mono text-xs mb-2 truncate" title={currentFocusJob.path}>
                                Current focus: <span className="font-bold">{currentFocusJob.path}</span>
                                </p>
                                <div className="bg-gray-950 rounded p-2 flex-grow overflow-y-auto">
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words">
                                        <code>{currentFocusJob.content}</code>
                                    </pre>
                                </div>
                            </div>
                        ) : (
                             <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Waiting for plan...</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/autoomousai | ORIGINAL PATH: diplomat-bit-autoomousai-f4d320c/components/AdvancedEditProgress.tsx
================================================================================


import React from 'react';
import { AdvancedEditJob, AdvancedEditPhase } from '../types';
import { Spinner } from './Spinner';
import { BotIcon } from './icons/BotIcon';

const StatusIcon: React.FC<{ status: AdvancedEditJob['status'] }> = ({ status }) => {
    switch (status) {
        case 'planning':
        case 'editing':
            return <Spinner className="w-4 h-4 text-blue-400" />;
        case 'verifying':
            return <Spinner className="w-4 h-4 text-yellow-400" />;
        case 'committing':
            return <Spinner className="w-4 h-4 text-orange-400" />;
        case 'success': 
            return <div title="Success" className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>;
        case 'failed': 
            return <div title="Failed" className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">!</div>;
        default: 
             return <div title="Pending" className="w-4 h-4 rounded-full bg-gray-600 flex-shrink-0"></div>;
    }
};

const PhaseIndicator: React.FC<{title: string, isActive: boolean, isComplete: boolean}> = ({ title, isActive, isComplete }) => (
    <div className="flex items-center gap-2">
        {isActive && <Spinner className="h-4 w-4" />}
        {isComplete && <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>}
        <span className={isActive ? "text-indigo-300" : isComplete ? "text-gray-300" : "text-gray-500"}>{title}</span>
    </div>
);

interface AdvancedEditProgressProps {
  jobs: AdvancedEditJob[];
  phase: AdvancedEditPhase;
  verificationAttempt: number;
  buildLogs: string | null;
  workflowRunUrl: string | null;
  aiThought: string | null;
  deploymentUrl: string | null;
  onClose: () => void;
  isComplete: boolean;
}

export const AdvancedEditProgress: React.FC<AdvancedEditProgressProps> = ({ jobs, phase, verificationAttempt, buildLogs, workflowRunUrl, aiThought, deploymentUrl, onClose, isComplete }) => {
  const completedCount = jobs.filter(j => j.status === 'success').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;
  
  const getStatusMessage = () => {
    switch(phase) {
        case 'analyzing': return 'Analyzing repository context...';
        case 'planning': return 'AI is creating an edit plan...';
        case 'editing': return `AI is performing iterative edits on ${jobs.length} file(s)...`;
        case 'committing': return 'Committing all changes to trigger workflow...';
        case 'triggering_workflow': return 'Triggering GitHub Actions workflow...';
        case 'waiting_for_workflow': return `Running CI build (Attempt ${verificationAttempt})...`;
        case 'analyzing_failure': return `Build failed (Attempt ${verificationAttempt}). Analyzing logs for correction...`;
        case 'complete': return 'Advanced edit complete and verified!';
        default: return 'Initializing...';
    }
  };

  const currentFocusJob = jobs.find(job => job.status === 'editing') || jobs.find(job => job.status === 'committing') || jobs[jobs.length - 1];

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-850 p-6 rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col border border-gray-700">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-indigo-400">Advanced AI Iterative Edit</h2>
                {workflowRunUrl && (
                    <a href={workflowRunUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline">
                        View Workflow Run
                    </a>
                )}
            </div>
            {isComplete && (
              <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700">
                Close
              </button>
            )}
        </div>
        
        <div className="mb-4 flex-shrink-0 space-y-3">
            <div className="grid grid-cols-5 items-center justify-around p-2 bg-gray-900 rounded-md text-sm">
                <PhaseIndicator title="1. Plan" isActive={phase === 'analyzing' || phase === 'planning'} isComplete={!['idle', 'analyzing', 'planning'].includes(phase)} />
                <div className="flex-grow h-px bg-gray-700 mx-2"></div>
                <PhaseIndicator title="2. Iterative Edit" isActive={phase === 'editing'} isComplete={!['idle', 'analyzing', 'planning', 'editing'].includes(phase)} />
                <div className="flex-grow h-px bg-gray-700 mx-2"></div>
                <PhaseIndicator title="3. Commit" isActive={phase === 'committing'} isComplete={!['idle', 'analyzing', 'planning', 'editing', 'committing'].includes(phase)} />
                <div className="flex-grow h-px bg-gray-700 mx-2"></div>
                <PhaseIndicator title="4. Verify (CI)" isActive={phase === 'triggering_workflow' || phase === 'waiting_for_workflow' || phase === 'analyzing_failure'} isComplete={phase === 'complete'} />
                <div className="flex-grow h-px bg-gray-700 mx-2"></div>
                 <PhaseIndicator title="5. Done" isActive={false} isComplete={phase === 'complete'} />
            </div>
             <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span className="flex items-center gap-2">{getStatusMessage()}</span>
                <span>{`${completedCount} / ${jobs.length} files committed`}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        
        {aiThought && (
            <div className="mb-4 p-4 bg-gray-900 rounded-md border border-gray-700 overflow-y-auto max-h-32">
                <h3 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center gap-2">
                    <BotIcon className="w-5 h-5" />
                    Architectural Strategy
                </h3>
                <p className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{aiThought}</p>
            </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 flex-grow min-h-0">
            <div className="bg-gray-900 rounded-md p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Execution Plan ({jobs.length})</h3>
                <ul className="space-y-2 overflow-y-auto">
                    {jobs.map(job => (
                        <li key={job.id} className="flex flex-col text-sm p-2 bg-gray-800 rounded border border-gray-700">
                           <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3 overflow-hidden">
                                   <StatusIcon status={job.status} />
                                   <span className="truncate font-semibold" title={job.path}>{job.path}</span>
                               </div>
                           </div>
                           {job.checkpoints && job.checkpoints.length > 0 && (
                               <div className="mt-2 pl-7 space-y-1">
                                   {job.checkpoints.map(cp => (
                                       <div key={cp.id} className={`flex items-center gap-2 text-xs ${cp.status === 'completed' ? 'text-green-400' : cp.status === 'active' ? 'text-blue-400 font-bold' : 'text-gray-500'}`}>
                                           <div className={`w-1.5 h-1.5 rounded-full ${cp.status === 'completed' ? 'bg-green-400' : cp.status === 'active' ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></div>
                                           <span className="truncate">{cp.title}</span>
                                       </div>
                                   ))}
                               </div>
                           )}
                        </li>
                    ))}
                 </ul>
            </div>
            <div className="bg-gray-900 rounded-md p-4 flex flex-col">
                { isComplete && deploymentUrl ? (
                    <>
                        <h3 className="text-lg font-semibold mb-2 text-green-400">Live Deployment Preview</h3>
                        <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 p-3 rounded-md mb-4 text-sm">
                            <p>GitHub Pages may prevent embedding. If the panel below is blank, please use the direct link.</p>
                            <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-semibold mt-2 inline-block">Open Live Site &rarr;</a>
                        </div>
                        <div className="flex-grow bg-white rounded-md overflow-hidden border-4 border-gray-700">
                            <iframe src={deploymentUrl} title="Live Deployment" className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin" />
                        </div>
                    </>
                ) : phase === 'analyzing_failure' && buildLogs ? (
                    <>
                        <h3 className="text-lg font-semibold mb-2 text-red-400">Build Failure Logs</h3>
                        <div className="bg-black rounded p-2 flex-grow overflow-y-auto">
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words font-mono">
                                <code>{buildLogs}</code>
                            </pre>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold mb-2 text-gray-200">Current Iteration Output</h3>
                        {currentFocusJob ? (
                             <div className="flex-grow flex flex-col min-h-0 bg-gray-850 rounded-lg p-2 border border-blue-900">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-blue-300 font-mono text-xs truncate" title={currentFocusJob.path}>
                                        {currentFocusJob.path.split('/').pop()}
                                    </p>
                                    <span className="text-[10px] bg-blue-900 px-1 rounded text-blue-100 font-mono">
                                        {currentFocusJob.checkpoints?.find(c => c.status === 'active')?.title || 'Processing'}
                                    </span>
                                </div>
                                <div className="bg-gray-950 rounded p-2 flex-grow overflow-y-auto">
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words">
                                        <code>{currentFocusJob.content}</code>
                                    </pre>
                                </div>
                            </div>
                        ) : (
                             <div className="flex items-center justify-center h-full text-gray-500 font-mono">
                                <p>&gt; Waiting for architectural plan...</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/usa | ORIGINAL PATH: diplomat-bit-usa-d72fd59/components/AdvancedEditProgress.tsx
================================================================================

import React from 'react';
import { AdvancedEditJob, AdvancedEditPhase, AIWorkerStatus } from '../types';
import { Spinner } from './Spinner';
import { BotIcon } from './icons/BotIcon';

const StatusIcon: React.FC<{ status: AdvancedEditJob['status'] }> = ({ status }) => {
    switch (status) {
        case 'planning':
        case 'editing':
            return <Spinner className="w-4 h-4 text-blue-400" />;
        case 'verifying':
            return <Spinner className="w-4 h-4 text-yellow-400" />;
        case 'committing':
            return <Spinner className="w-4 h-4 text-orange-400" />;
        case 'success': 
            return <div title="Success" className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>;
        case 'failed': 
            return <div title="Failed" className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">!</div>;
        default: 
             return <div title="Pending" className="w-4 h-4 rounded-full bg-gray-600 flex-shrink-0"></div>;
    }
};

const WorkerGrid: React.FC<{ workers?: AIWorkerStatus[] }> = ({ workers }) => {
    if (!workers) return null;
    return (
        <div className="grid grid-cols-12 md:grid-cols-23 gap-0.5 mt-1">
            {workers.map((w, i) => (
                <div 
                    key={i} 
                    title={`${w.model}: ${w.status}`}
                    className={`w-1.5 h-3 rounded-full transition-all duration-300 ${
                        w.status === 'working' ? 'bg-cyan-500 animate-pulse' :
                        w.status === 'finished' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] scale-110' :
                        w.status === 'failed' ? 'bg-red-900 border border-red-500' :
                        'bg-gray-800'
                    }`}
                />
            ))}
        </div>
    );
};

const PhaseIndicator: React.FC<{title: string, isActive: boolean, isComplete: boolean}> = ({ title, isActive, isComplete }) => (
    <div className="flex flex-col items-center gap-1 group">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isActive ? "bg-indigo-600 ring-4 ring-indigo-900 shadow-lg shadow-indigo-500/50" : 
            isComplete ? "bg-green-600" : "bg-gray-800"
        }`}>
            {isActive ? <Spinner className="h-5 w-5 text-white" /> : 
             isComplete ? <span className="text-white text-sm font-bold">✓</span> : 
             <div className="w-2 h-2 rounded-full bg-gray-600"></div>}
        </div>
        <span className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${isActive ? "text-indigo-400" : isComplete ? "text-green-400" : "text-gray-600"}`}>
            {title}
        </span>
    </div>
);

interface AdvancedEditProgressProps {
  jobs: AdvancedEditJob[];
  phase: AdvancedEditPhase;
  verificationAttempt: number;
  buildLogs: string | null;
  workflowRunUrl: string | null;
  aiThought: string | null;
  deploymentUrl: string | null;
  onClose: () => void;
  isComplete: boolean;
}

export const AdvancedEditProgress: React.FC<AdvancedEditProgressProps> = ({ jobs, phase, verificationAttempt, buildLogs, workflowRunUrl, aiThought, deploymentUrl, onClose, isComplete }) => {
  const completedCount = jobs.filter(j => j.status === 'success').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;
  
  const getStatusMessage = () => {
    switch(phase) {
        case 'analyzing': return 'Neural Context Injection...';
        case 'planning': return 'Architecting Global Edit Plan...';
        case 'editing': return `Synchronizing ${jobs.length} neural buffers...`;
        case 'committing': return 'Persisting swarm state to GitHub...';
        case 'triggering_workflow': return 'Firing CI Validation Swarm...';
        case 'waiting_for_workflow': return `Observing CI Environment (Cycle ${verificationAttempt})...`;
        case 'analyzing_failure': return `Anomalies detected in Cycle ${verificationAttempt}. Correcting...`;
        case 'complete': return 'Evolution complete. Verified state achieved.';
        default: return 'Waking neural interface...';
    }
  };

  const currentFocusJob = jobs.find(job => job.status === 'editing') || jobs.find(job => job.status === 'committing') || jobs[jobs.length - 1];

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-6 rounded-2xl shadow-[0_0_50px_rgba(79,70,229,0.15)] w-full max-w-7xl h-full max-h-[95vh] flex flex-col border border-gray-800 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[100px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/5 blur-[100px] -z-10 rounded-full"></div>

        <div className="flex justify-between items-center mb-8 flex-shrink-0">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 animate-pulse"></div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-400 via-white to-cyan-400 bg-clip-text text-transparent uppercase tracking-tighter">
                        Swarm Prime Edits
                    </h2>
                </div>
                <div className="flex items-center gap-3 bg-gray-950 px-4 py-1.5 rounded-full border border-gray-800 shadow-inner">
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                        <div className="w-1 h-3 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                        <div className="w-1 h-3 bg-indigo-300 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                    </div>
                    <span className="text-[10px] font-mono font-black text-indigo-400 tracking-[0.2em] uppercase">Phase Multiplier: x23</span>
                </div>
                {workflowRunUrl && (
                    <a href={workflowRunUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                        <div className="text-xs font-mono text-cyan-500 hover:text-cyan-300 transition-colors uppercase tracking-widest border-b border-cyan-800">
                            Satellite CI Stream
                        </div>
                        <svg className="w-3 h-3 text-cyan-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                )}
            </div>
            {isComplete && (
              <button 
                onClick={onClose} 
                className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95"
              >
                CLOSE CONSOLE
              </button>
            )}
        </div>
        
        <div className="mb-8 flex-shrink-0">
            <div className="flex items-center justify-between mb-6">
                <PhaseIndicator title="Analyze" isActive={phase === 'analyzing'} isComplete={!['idle', 'analyzing'].includes(phase)} />
                <div className={`flex-grow h-0.5 mx-4 ${!['idle', 'analyzing', 'planning'].includes(phase) ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-gray-800'}`}></div>
                <PhaseIndicator title="Plan" isActive={phase === 'planning'} isComplete={!['idle', 'analyzing', 'planning'].includes(phase)} />
                <div className={`flex-grow h-0.5 mx-4 ${!['idle', 'analyzing', 'planning', 'editing'].includes(phase) ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-gray-800'}`}></div>
                <PhaseIndicator title="Swarm Edit" isActive={phase === 'editing'} isComplete={!['idle', 'analyzing', 'planning', 'editing', 'committing'].includes(phase)} />
                <div className={`flex-grow h-0.5 mx-4 ${!['idle', 'analyzing', 'planning', 'editing', 'committing'].includes(phase) ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-gray-800'}`}></div>
                <PhaseIndicator title="Persist" isActive={phase === 'committing' || phase === 'triggering_workflow'} isComplete={!['idle', 'analyzing', 'planning', 'editing', 'committing', 'triggering_workflow'].includes(phase)} />
                <div className={`flex-grow h-0.5 mx-4 ${phase === 'complete' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-gray-800'}`}></div>
                <PhaseIndicator title="Verify CI" isActive={phase === 'waiting_for_workflow' || phase === 'analyzing_failure'} isComplete={phase === 'complete'} />
            </div>
             <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-mono font-bold text-gray-400 group flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    {getStatusMessage()}
                </span>
                <span className="text-xs font-mono text-indigo-400">{`${completedCount} / ${jobs.length} NODES VERIFIED`}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 via-white to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        
        <div className="grid grid-cols-12 gap-8 flex-grow min-h-0">
            <div className="col-span-4 flex flex-col min-h-0 gap-4">
                {aiThought && (
                    <div className="bg-gray-950/50 rounded-2xl border border-gray-800 p-4 flex flex-col min-h-0 shadow-inner">
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <BotIcon className="w-4 h-4" />
                            Core Reasoning Engine
                        </h3>
                        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                            <p className="text-gray-400 text-xs leading-relaxed font-mono italic">
                                "{aiThought}"
                            </p>
                        </div>
                    </div>
                )}
                
                <div className="bg-gray-950/80 rounded-2xl border border-gray-800 p-4 flex flex-col flex-grow min-h-0">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 border-b border-gray-900 pb-2">
                        Target Cluster ({jobs.length})
                    </h3>
                    <ul className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {jobs.map(job => (
                            <li key={job.id} className={`flex flex-col gap-1.5 p-3 rounded-xl border transition-all ${
                                job.status === 'editing' ? 'bg-indigo-900/20 border-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.1)]' : 
                                job.status === 'success' ? 'bg-green-950/20 border-green-900/50 opacity-80' :
                                'bg-gray-900/50 border-gray-800'
                            }`}>
                               <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-3 overflow-hidden">
                                       <StatusIcon status={job.status} />
                                       <span className="truncate text-xs font-mono font-bold text-gray-300" title={job.path}>{job.path.split('/').pop()}</span>
                                   </div>
                               </div>
                               <WorkerGrid workers={job.workers} />
                               {job.error && <span className="text-red-400 text-[10px] font-mono mt-1 break-words">{job.error}</span>}
                            </li>
                        ))}
                     </ul>
                </div>
            </div>

            <div className="col-span-8 bg-gray-950/80 rounded-3xl border border-gray-800 flex flex-col min-h-0 shadow-2xl relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <svg className="w-64 h-64 text-indigo-500" fill="currentColor" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                </div>

                { isComplete && deploymentUrl ? (
                    <div className="h-full flex flex-col p-6 animate-in fade-in zoom-in-95 duration-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-green-400 uppercase tracking-tighter">Verified Artifact View</h3>
                            <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white px-4 py-1.5 rounded-full transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                                OPEN EXTERNAL PORT &rarr;
                            </a>
                        </div>
                        <div className="flex-grow bg-white rounded-2xl overflow-hidden border border-gray-800 shadow-inner group">
                            <iframe
                                src={deploymentUrl}
                                title="Live Deployment"
                                className="w-full h-full border-0"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        </div>
                    </div>
                ) : phase === 'analyzing_failure' && buildLogs ? (
                    <div className="h-full flex flex-col p-6 animate-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-lg font-black text-red-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            Cycle Synchronization Failure
                        </h3>
                        <div className="bg-black/80 rounded-2xl p-6 flex-grow overflow-y-auto border border-red-900/30 custom-scrollbar-red">
                            <pre className="text-xs text-red-200/80 whitespace-pre-wrap font-mono leading-relaxed">
                                <code>{buildLogs}</code>
                            </pre>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col p-6">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">
                            Live Stream Buffer: {currentFocusJob?.path || 'IDLE'}
                        </h3>
                        {currentFocusJob ? (
                             <div className="flex-grow flex flex-col min-h-0 bg-black/40 rounded-2xl border border-gray-800 overflow-hidden">
                                <div className="p-6 flex-grow font-mono overflow-y-auto custom-scrollbar-indigo">
                                    <pre className="text-[11px] text-indigo-100/90 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-300">
                                        <code>{currentFocusJob.content || "Opening neural stream..."}</code>
                                    </pre>
                                </div>
                                {currentFocusJob.workers && (
                                    <div className="bg-gray-900/50 p-4 border-t border-gray-800">
                                        <div className="text-[9px] font-mono text-gray-600 mb-2 uppercase tracking-wide">Swarm Consensus Mapping:</div>
                                        <WorkerGrid workers={currentFocusJob.workers} />
                                    </div>
                                )}
                            </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center h-full text-gray-700 gap-4">
                                <Spinner className="w-12 h-12 text-indigo-500/20" />
                                <p className="font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Initializing neural collective...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
