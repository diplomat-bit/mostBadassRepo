// REPOSITORY SOURCE: diplomat-bit/ai-banking-swarm-roster | PATH: diplomat-bit-ai-banking-swarm-roster-20297ff/components/JellyfishModal.tsx
================================================================================


import React, { useState } from 'react';
import { Spinner } from './Spinner';

interface JellyfishModalProps {
  onClose: () => void;
  onSubmit: (prompt: string) => Promise<void>;
  repoName: string;
}

export const JellyfishModal: React.FC<JellyfishModalProps> = ({ onClose, onSubmit, repoName }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    await onSubmit(prompt);
  };

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-850 p-6 rounded-lg shadow-2xl w-full max-w-4xl border border-gray-700" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-pink-500">Jellyfish Swarm Mode</h2>
            <span className="text-gray-500 text-sm">Target: {repoName}</span>
        </div>
        
        <div className="bg-pink-900/30 border border-pink-700/50 text-pink-100 p-4 rounded-md mb-6 text-sm">
            <h3 className="font-bold mb-2">Instructions:</h3>
            <p className="mb-2">You can execute a massive, repository-wide overhaul here.</p>
            <ul className="list-disc list-inside space-y-1 text-pink-200">
                <li><strong>Paste a File Tree:</strong> If you have a specific structure in mind, paste it below. The swarm will build it.</li>
                <li><strong>"Link it all together":</strong> Describe how files should interact. The agents will hop around the code to ensure imports are correct.</li>
                <li><strong>Double & Triple Check:</strong> 8 Agents will work in parallel. Each agent will critique its own code and rewrite it until it's perfect.</li>
            </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              Paste Tree / Instructions
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 
              
src/
  components/
    Header.tsx
    Footer.tsx
  utils/
    api.ts

Instruction: Create these files. Ensure Header uses the api.ts to fetch user data. Link everything together."
              className="w-full h-64 bg-gray-900 p-3 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono resize-none"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="px-6 py-2 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[150px]"
            >
              {isLoading ? <Spinner /> : 'Deploy 8 Agents'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
