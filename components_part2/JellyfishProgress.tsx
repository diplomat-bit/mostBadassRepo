// REPOSITORY SOURCE: diplomat-bit/ai-banking-swarm-roster | PATH: diplomat-bit-ai-banking-swarm-roster-20297ff/components/JellyfishProgress.tsx
================================================================================


import React from 'react';
import { JellyfishJob, JellyfishPhase } from '../types';
import { Spinner } from './Spinner';

interface JellyfishProgressProps {
  jobs: JellyfishJob[];
  phase: JellyfishPhase;
  onClose: () => void;
  isComplete: boolean;
}

const JobCard: React.FC<{ job: JellyfishJob }> = ({ job }) => {
    let statusColor = "bg-gray-800 border-gray-700";
    let statusText = "Queued";
    
    if (job.status === 'drafting') { statusColor = "bg-blue-900/30 border-blue-500/50"; statusText = "Drafting..."; }
    else if (job.status === 'critiquing') { statusColor = "bg-yellow-900/30 border-yellow-500/50"; statusText = "Critiquing..."; }
    else if (job.status === 'refining') { statusColor = "bg-purple-900/30 border-purple-500/50"; statusText = "Refining..."; }
    else if (job.status === 'finalizing') { statusColor = "bg-green-900/30 border-green-500/50"; statusText = "Committing..."; }
    else if (job.status === 'success') { statusColor = "bg-green-900/20 border-green-800"; statusText = "Done"; }
    else if (job.status === 'failed') { statusColor = "bg-red-900/20 border-red-800"; statusText = "Failed"; }

    return (
        <div className={`p-3 rounded border ${statusColor} flex flex-col h-40 transition-all duration-300`}>
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-xs text-gray-300 truncate w-3/4" title={job.path}>{job.path}</span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${job.status === 'success' ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                    {statusText}
                </span>
            </div>
            
            <div className="flex-grow overflow-hidden relative bg-gray-950 rounded p-1 mb-2">
                 <pre className="text-[8px] text-gray-500 font-mono leading-tight whitespace-pre-wrap break-all opacity-50">
                    {job.currentContent || "// Waiting for agent..."}
                 </pre>
                 {job.status === 'critiquing' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                         <span className="text-yellow-400 text-xs font-bold animate-pulse">Reviewing...</span>
                     </div>
                 )}
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-500">
                <span>Cycles: {job.status === 'success' || job.status === 'refining' ? '2-3' : '1'}</span>
                {job.status === 'refining' && <span className="text-purple-400">Fixing bugs...</span>}
            </div>
        </div>
    );
};

export const JellyfishProgress: React.FC<JellyfishProgressProps> = ({ jobs, phase, onClose, isComplete }) => {
  const completedCount = jobs.filter(j => j.status === 'success' || j.status === 'failed').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;
  
  // Sort jobs so active ones are first, then queued, then done
  const sortedJobs = [...jobs].sort((a, b) => {
      const score = (status: string) => {
          if (['drafting', 'critiquing', 'refining'].includes(status)) return 0;
          if (status === 'queued') return 1;
          return 2;
      };
      return score(a.status) - score(b.status);
  });

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col border border-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                    Jellyfish Swarm
                </h2>
                <p className="text-gray-400 text-sm">
                    {phase === 'planning' ? "Planning massive overhaul..." : `Swarm Active: ${8} Concurrent Agents`}
                </p>
            </div>
            {isComplete && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 border border-gray-600"
              >
                Close Mission
              </button>
            )}
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6 flex-shrink-0">
             <div className="flex justify-between text-xs text-gray-400 mb-1 uppercase tracking-wider">
                <span>Total Progress</span>
                <span>{`${completedCount} / ${jobs.length}`} Files</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700">
                <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

        {/* Content Area */}
        {phase === 'planning' ? (
             <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                 <div className="relative">
                    <div className="absolute inset-0 bg-pink-500 blur-xl opacity-20 animate-pulse"></div>
                    <Spinner className="h-12 w-12 text-pink-500 relative z-10" />
                 </div>
                 <p className="text-pink-200 text-lg animate-pulse">Master Intelligence is analyzing repository structure...</p>
             </div>
        ) : (
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {sortedJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
