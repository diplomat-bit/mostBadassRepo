// REPOSITORY SOURCE: diplomat-bit/ai-banking-swarm-roster | PATH: diplomat-bit-ai-banking-swarm-roster-20297ff/components/ProjectGenerationProgress.tsx
================================================================================

import React from 'react';
import { ProjectGenerationJob } from '../types';
import { Spinner } from './Spinner';

const StatusIcon: React.FC<{ status: ProjectGenerationJob['status'] }> = ({ status }) => {
    switch (status) {
        case 'queued': 
            return <div title="Queued" className="w-4 h-4 rounded-full bg-gray-600 flex-shrink-0"></div>;
        case 'generating': 
            return <Spinner className="w-4 h-4 text-blue-400" />;
        case 'committing': 
            return <Spinner className="w-4 h-4 text-yellow-400" />;
        case 'retrying':
            return <Spinner className="w-4 h-4 text-orange-400" />;
        case 'success': 
            return <div title="Success" className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>;
        case 'failed': 
            return <div title="Failed" className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">!</div>;
        default: 
            return null;
    }
};

interface ProjectGenerationProgressProps {
  jobs: ProjectGenerationJob[];
  statusMessage: string;
  onClose: () => void;
  isComplete: boolean;
}

export const ProjectGenerationProgress: React.FC<ProjectGenerationProgressProps> = ({ jobs, statusMessage, onClose, isComplete }) => {
  const completedCount = jobs.filter(j => j.status === 'success' || j.status === 'failed').length;
  const successCount = jobs.filter(j => j.status === 'success').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;
  
  const activeJobs = jobs.filter(j => j.status === 'generating' || j.status === 'committing' || j.status === 'retrying');

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-850 p-6 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-700">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-indigo-400">AI Project Generation</h2>
            {isComplete && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            )}
        </div>
        
        <div className="mb-4 flex-shrink-0">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span className="flex items-center gap-2">
                    {!isComplete && <Spinner className="h-4 w-4" />}
                    {statusMessage}
                </span>
                <span>{`${successCount} / ${jobs.length} files successful`}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 flex-grow min-h-0">
            <div className="col-span-1 bg-gray-900 rounded-md p-4 overflow-y-auto">
                 <h3 className="text-lg font-semibold mb-2 text-gray-200">File Plan</h3>
                 <ul className="space-y-1">
                    {jobs.map(job => (
                        <li key={job.id} className="flex items-center justify-between text-sm p-1.5 bg-gray-800 rounded">
                           <div className="flex items-center gap-3 overflow-hidden">
                               <StatusIcon status={job.status} />
                               <span className="truncate" title={job.path}>{job.path}</span>
                           </div>
                           {(job.status === 'failed' || job.status === 'retrying') && <span className="text-red-400 text-xs truncate ml-2 cursor-pointer" title={job.error || 'Unknown error'}>{job.error}</span>}
                        </li>
                    ))}
                 </ul>
            </div>
            <div className="col-span-2 bg-gray-900 rounded-md p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Live Generation ({activeJobs.length} active)</h3>
                {activeJobs.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-grow min-h-0">
                        {activeJobs.slice(0, 8).map(job => (
                            <div key={job.id} className="flex-grow flex flex-col min-h-0 bg-gray-850 rounded-lg p-2">
                                <p className="text-blue-300 font-mono text-xs mb-2 truncate" title={job.path}>
                                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}: <span className="font-bold">{job.path}</span>
                                </p>
                                <div className="bg-gray-950 rounded p-2 flex-grow overflow-y-auto">
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words">
                                        <code>{job.content}</code>
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        {isComplete ? "All files generated." : "Waiting to generate..."}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/autoomousai | ORIGINAL PATH: diplomat-bit-autoomousai-f4d320c/components/ProjectGenerationProgress.tsx
================================================================================

import React from 'react';
import { ProjectGenerationJob } from '../types';
import { Spinner } from './Spinner';

const StatusIcon: React.FC<{ status: ProjectGenerationJob['status'] }> = ({ status }) => {
    switch (status) {
        case 'queued': 
            return <div title="Queued" className="w-4 h-4 rounded-full bg-gray-600 flex-shrink-0"></div>;
        case 'generating': 
            return <Spinner className="w-4 h-4 text-blue-400" />;
        case 'committing': 
            return <Spinner className="w-4 h-4 text-yellow-400" />;
        case 'retrying':
            return <Spinner className="w-4 h-4 text-orange-400" />;
        case 'success': 
            return <div title="Success" className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>;
        case 'failed': 
            return <div title="Failed" className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">!</div>;
        default: 
            return null;
    }
};

interface ProjectGenerationProgressProps {
  jobs: ProjectGenerationJob[];
  statusMessage: string;
  onClose: () => void;
  isComplete: boolean;
}

export const ProjectGenerationProgress: React.FC<ProjectGenerationProgressProps> = ({ jobs, statusMessage, onClose, isComplete }) => {
  const completedCount = jobs.filter(j => j.status === 'success' || j.status === 'failed').length;
  const successCount = jobs.filter(j => j.status === 'success').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;
  
  const activeJobs = jobs.filter(j => j.status === 'generating' || j.status === 'committing' || j.status === 'retrying');

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-850 p-6 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-700">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-indigo-400">AI Project Generation</h2>
            {isComplete && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            )}
        </div>
        
        <div className="mb-4 flex-shrink-0">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span className="flex items-center gap-2">
                    {!isComplete && <Spinner className="h-4 w-4" />}
                    {statusMessage}
                </span>
                <span>{`${successCount} / ${jobs.length} files successful`}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 flex-grow min-h-0">
            <div className="col-span-1 bg-gray-900 rounded-md p-4 overflow-y-auto">
                 <h3 className="text-lg font-semibold mb-2 text-gray-200">File Plan</h3>
                 <ul className="space-y-1">
                    {jobs.map(job => (
                        <li key={job.id} className="flex items-center justify-between text-sm p-1.5 bg-gray-800 rounded">
                           <div className="flex items-center gap-3 overflow-hidden">
                               <StatusIcon status={job.status} />
                               <span className="truncate" title={job.path}>{job.path}</span>
                           </div>
                           {(job.status === 'failed' || job.status === 'retrying') && <span className="text-red-400 text-xs truncate ml-2 cursor-pointer" title={job.error || 'Unknown error'}>{job.error}</span>}
                        </li>
                    ))}
                 </ul>
            </div>
            <div className="col-span-2 bg-gray-900 rounded-md p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Live Generation ({activeJobs.length} active)</h3>
                {activeJobs.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-grow min-h-0">
                        {activeJobs.slice(0, 8).map(job => (
                            <div key={job.id} className="flex-grow flex flex-col min-h-0 bg-gray-850 rounded-lg p-2">
                                <p className="text-blue-300 font-mono text-xs mb-2 truncate" title={job.path}>
                                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}: <span className="font-bold">{job.path}</span>
                                </p>
                                <div className="bg-gray-950 rounded p-2 flex-grow overflow-y-auto">
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words">
                                        <code>{job.content}</code>
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        {isComplete ? "All files generated." : "Waiting to generate..."}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/usa | ORIGINAL PATH: diplomat-bit-usa-d72fd59/components/ProjectGenerationProgress.tsx
================================================================================

import React from 'react';
import { ProjectGenerationJob, AIWorkerStatus } from '../types';
import { Spinner } from './Spinner';
import { BotIcon } from './icons/BotIcon';

const StatusIcon: React.FC<{ status: ProjectGenerationJob['status'] }> = ({ status }) => {
    switch (status) {
        case 'queued': 
            return <div title="Queued" className="w-4 h-4 rounded-full bg-gray-600 flex-shrink-0"></div>;
        case 'generating': 
            return <Spinner className="w-4 h-4 text-blue-400" />;
        case 'committing': 
            return <Spinner className="w-4 h-4 text-yellow-400" />;
        case 'retrying':
            return <Spinner className="w-4 h-4 text-orange-400" />;
        case 'success': 
            return <div title="Success" className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>;
        case 'failed': 
            return <div title="Failed" className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">!</div>;
        default: 
            return null;
    }
};

const WorkerGrid: React.FC<{ workers?: AIWorkerStatus[] }> = ({ workers }) => {
    if (!workers) return null;
    return (
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 mt-2">
            {workers.map((w, i) => (
                <div 
                    key={i} 
                    title={`${w.model}: ${w.status}`}
                    className={`w-2 h-2 rounded-sm transition-all duration-300 ${
                        w.status === 'working' ? 'bg-blue-500 animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]' :
                        w.status === 'finished' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' :
                        w.status === 'failed' ? 'bg-red-500' :
                        'bg-gray-700'
                    }`}
                />
            ))}
        </div>
    );
};

interface ProjectGenerationProgressProps {
  jobs: ProjectGenerationJob[];
  statusMessage: string;
  onClose: () => void;
  isComplete: boolean;
}

export const ProjectGenerationProgress: React.FC<ProjectGenerationProgressProps> = ({ jobs, statusMessage, onClose, isComplete }) => {
  const completedCount = jobs.filter(j => j.status === 'success' || j.status === 'failed').length;
  const successCount = jobs.filter(j => j.status === 'success').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;
  
  const activeJobs = jobs.filter(j => j.status === 'generating' || j.status === 'committing' || j.status === 'retrying');

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-850 p-6 rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col border border-gray-700">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-indigo-400">AI Swarm Generation</h2>
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">Neural Mass Construct</span>
                </div>
            </div>
            {isComplete && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            )}
        </div>
        
        <div className="mb-4 flex-shrink-0">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span className="flex items-center gap-2 font-mono uppercase tracking-tight">
                    {!isComplete && <Spinner className="h-4 w-4" />}
                    {statusMessage}
                </span>
                <span className="font-mono text-cyan-400">{`${successCount} / ${jobs.length} nodes synthesized`}</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-400 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-6 flex-grow min-h-0">
            <div className="col-span-3 bg-gray-900 rounded-lg p-4 overflow-y-auto border border-gray-800">
                 <h3 className="text-xs font-bold mb-3 text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Manifest</h3>
                 <ul className="space-y-2">
                    {jobs.map(job => (
                        <li key={job.id} className={`flex flex-col gap-1 text-sm p-3 rounded-lg border transition-all ${
                            job.status === 'generating' || job.status === 'committing' || job.status === 'retrying' ? 'bg-cyan-900/20 border-cyan-700/50 scale-[1.02]' : 
                            job.status === 'success' ? 'bg-green-900/10 border-green-700/30' :
                            'bg-gray-850 border-gray-800 opacity-60'
                        }`}>
                           <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3 overflow-hidden">
                                   <StatusIcon status={job.status} />
                                   <span className="truncate font-medium text-gray-200" title={job.path}>{job.path}</span>
                               </div>
                           </div>
                           <WorkerGrid workers={job.workers} />
                           {job.error && <p className="text-red-400 text-[10px] mt-1 break-words leading-tight">{job.error}</p>}
                        </li>
                    ))}
                 </ul>
            </div>
            <div className="col-span-9 bg-gray-900 rounded-lg p-4 flex flex-col border border-gray-800">
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Neural Streams ({activeJobs.length})</h3>
                    <div className="flex gap-4 text-[10px] font-mono">
                        <span className="text-gray-400 tracking-tighter">COORDINATION SCALE: 23-NODES/FILE</span>
                    </div>
                </div>
                {activeJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-grow min-h-0">
                        {activeJobs.slice(0, 9).map(job => (
                            <div key={job.id} className="flex flex-col min-h-0 bg-gray-850 rounded-xl overflow-hidden border border-gray-700/50 group hover:border-cyan-500/50 transition-colors">
                                <div className="bg-gray-800/80 px-3 py-2 flex justify-between items-center border-b border-gray-700 shadow-sm">
                                    <p className="text-cyan-400 font-mono text-[10px] font-bold truncate max-w-[80%]" title={job.path}>
                                      {job.path}
                                    </p>
                                    <StatusIcon status={job.status} />
                                </div>
                                <div className="p-3 bg-gray-950 flex-grow font-mono overflow-y-auto custom-scrollbar">
                                    <pre className="text-[10px] text-cyan-100/90 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-500">
                                        <code>{job.content || "Seeding neural matrix..."}</code>
                                    </pre>
                                </div>
                                {job.workers && (
                                    <div className="bg-gray-800/40 px-3 py-1 border-t border-gray-700">
                                        <WorkerGrid workers={job.workers} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-6">
                        <div className={`p-10 rounded-full bg-gray-850 border border-gray-800 shadow-2xl relative ${isComplete ? 'text-green-500' : 'text-indigo-500'}`}>
                             {!isComplete && <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping"></div>}
                             {isComplete ? <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> : <BotIcon className="w-16 h-16 animate-pulse" />}
                        </div>
                        <div className="text-center">
                            <p className="font-mono text-lg uppercase tracking-widest mb-2 font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                {isComplete ? "CONSTRUCTION TERMINATED" : "ORCHESTRATING NEURAL MASS"}
                            </p>
                            <p className="text-xs text-gray-500 font-mono italic">
                                {isComplete ? "All artifacts persisted to persistent storage." : "Allocating compute resources to target manifests..."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};
