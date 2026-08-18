// REPOSITORY SOURCE: diplomat-bit/ai-banking-swarm-roster | PATH: diplomat-bit-ai-banking-swarm-roster-20297ff/components/FileExplorer.tsx
================================================================================


import React, { useState, useEffect, useRef } from 'react';
import { UnifiedFileTree, DirNode, FileNode, GithubRepo } from '../types';
import { FolderIcon, FolderOpenIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';
import { BotIcon } from './icons/BotIcon';
import { getAllFilePaths } from '../utils';
import { PlusIcon } from './icons/PlusIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface FileExplorerProps {
  fileTree: UnifiedFileTree;
  onFileSelect: (repoFullName: string, path: string) => void;
  onStartMultiEdit: () => void;
  onStartNewProject: () => void;
  onStartProjectExpansion: () => void;
  onStartJellyfish: (repoFullName: string) => void;
  selectedFilePath?: string | null;
  selectedRepo?: string | null;
  selectedFiles: Set<string>;
  onFileSelection: (fileKey: string, isSelected: boolean) => void;
  onDirectorySelection: (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => void;
}

interface TreeNodeProps {
    node: DirNode | FileNode;
    repoFullName: string;
    onFileClick: (repoFullName: string, path: string) => void;
    selectedFilePath?: string | null;
    selectedRepo?: string | null;
    selectedFiles: Set<string>;
    onFileSelection: (fileKey: string, isSelected: boolean) => void;
    onDirectorySelection: (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, repoFullName, onFileClick, selectedFilePath, selectedRepo, selectedFiles, onFileSelection, onDirectorySelection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const checkboxRef = useRef<HTMLInputElement>(null);
    const isDir = node.type === 'dir';

    useEffect(() => {
        if (isDir && checkboxRef.current) {
            const descendantFiles = getAllFilePaths(node.children).map(p => `${repoFullName}::${p}`);
            if (descendantFiles.length === 0) {
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = false;
                return;
            }
            const selectedCount = descendantFiles.filter(key => selectedFiles.has(key)).length;
            
            if (selectedCount > 0 && selectedCount < descendantFiles.length) {
                checkboxRef.current.indeterminate = true;
            } else {
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = selectedCount === descendantFiles.length;
            }
        }
    }, [selectedFiles, node, isDir, repoFullName]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isDir) {
            onDirectorySelection(node.children, repoFullName, e.target.checked);
        } else {
            const fileKey = `${repoFullName}::${node.path}`;
            onFileSelection(fileKey, e.target.checked);
        }
    };

    if (isDir) {
        return (
            <div>
                <div className="flex items-center p-1.5 hover:bg-gray-700 rounded-md group">
                    <input type="checkbox" ref={checkboxRef} onChange={handleCheckboxChange} className="mr-2 h-4 w-4 rounded bg-gray-800 border-gray-600 text-amber-500 focus:ring-amber-600" />
                    <div 
                        className="flex items-center cursor-pointer flex-grow"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FolderOpenIcon className="w-5 h-5 mr-2 text-indigo-400" /> : <FolderIcon className="w-5 h-5 mr-2 text-indigo-400" />}
                        <span>{node.name}</span>
                    </div>
                </div>
                {isOpen && (
                    <div className="pl-6 border-l border-gray-700 ml-4">
                        {node.children.map(child => (
                            <TreeNode 
                                key={child.path} 
                                node={child} 
                                repoFullName={repoFullName} 
                                onFileClick={onFileClick} 
                                selectedFilePath={selectedFilePath}
                                selectedRepo={selectedRepo}
                                selectedFiles={selectedFiles}
                                onFileSelection={onFileSelection}
                                onDirectorySelection={onDirectorySelection}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const isSelectedForEditing = selectedFiles.has(`${repoFullName}::${node.path}`);
    const isActiveFile = selectedRepo === repoFullName && selectedFilePath === node.path;
    return (
        <div
            className={`flex items-center p-1.5 group rounded-md ${isActiveFile ? 'bg-indigo-900 bg-opacity-50' : 'hover:bg-gray-700'}`}
        >
            <input type="checkbox" checked={isSelectedForEditing} onChange={handleCheckboxChange} className="mr-2 h-4 w-4 rounded bg-gray-800 border-gray-600 text-amber-500 focus:ring-amber-600" />
            <div className="flex items-center cursor-pointer flex-grow" onClick={() => onFileClick(repoFullName, node.path)}>
                <FileIcon className="w-5 h-5 mr-2 text-gray-400" />
                <span className={isActiveFile ? 'text-white' : 'text-gray-300'}>{node.name}</span>
            </div>
        </div>
    );
};

const RepoNode: React.FC<{
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
    onFileClick: (repoFullName: string, path: string) => void;
    onStartJellyfish: (repoFullName: string) => void;
    selectedFilePath?: string | null;
    selectedRepo?: string | null;
    selectedFiles: Set<string>;
    onFileSelection: (fileKey: string, isSelected: boolean) => void;
    onDirectorySelection: (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => void;
}> = (props) => {
    const { repo, tree, onFileClick, onStartJellyfish, selectedFilePath, selectedRepo, selectedFiles, onFileSelection, onDirectorySelection } = props;
    const isRepoSelected = repo.full_name === selectedRepo;
    const [isOpen, setIsOpen] = useState(isRepoSelected);

    useEffect(() => {
        if(isRepoSelected && !isOpen) {
            setIsOpen(true);
        }
    }, [isRepoSelected, isOpen]);

    return (
        <div className="mb-2">
            <div className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-md group">
                <h3 
                    className="text-lg font-semibold cursor-pointer flex items-center flex-grow"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FolderOpenIcon className="w-5 h-5 mr-2" /> : <FolderIcon className="w-5 h-5 mr-2" />}
                    {repo.full_name}
                </h3>
                <button 
                    onClick={(e) => { e.stopPropagation(); onStartJellyfish(repo.full_name); }}
                    className="opacity-0 group-hover:opacity-100 p-1 bg-pink-600 rounded hover:bg-pink-500 transition-opacity"
                    title="Start Jellyfish Swarm (Repository Overhaul)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className="pl-4 border-l border-gray-700 ml-2">
                    {tree.map(node => (
                        <TreeNode 
                            key={node.path} 
                            node={node} 
                            repoFullName={repo.full_name} 
                            onFileClick={onFileClick} 
                            selectedFilePath={selectedFilePath}
                            selectedRepo={selectedRepo}
                            selectedFiles={selectedFiles}
                            onFileSelection={onFileSelection}
                            onDirectorySelection={onDirectorySelection} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
    fileTree, 
    onFileSelect, 
    onStartMultiEdit,
    onStartNewProject,
    onStartProjectExpansion,
    onStartJellyfish,
    selectedFilePath, 
    selectedRepo,
    selectedFiles,
    onFileSelection,
    onDirectorySelection
}) => {
  return (
    <div className="p-4 text-gray-300 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2 flex-shrink-0">
        <h2 className="text-xl font-bold">Repositories</h2>
        <button 
            onClick={onStartNewProject} 
            className="flex items-center gap-2 text-sm bg-indigo-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
            title="Generate a new project with AI"
        >
            <PlusIcon className="w-4 h-4" />
            New AI Project
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {selectedFiles.size > 0 && (
            <div className="mb-4 sticky top-0 bg-gray-900 py-2 z-10 space-y-2">
                <button
                    onClick={onStartMultiEdit}
                    className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-colors"
                >
                    <BotIcon className="w-5 h-5" />
                    AI Edit {selectedFiles.size} Selected File{selectedFiles.size > 1 ? 's' : ''}
                </button>
                 <button
                    onClick={onStartProjectExpansion}
                    disabled={selectedFiles.size !== 1}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    title={selectedFiles.size !== 1 ? 'You must select exactly 1 file to use this feature.' : 'Expand the project based on this seed file.'}
                >
                    <MagicWandIcon className="w-5 h-5" />
                    Expand Project (Seed)
                </button>
            </div>
        )}

        {Object.keys(fileTree).sort().map(repoFullName => (
            <RepoNode 
                key={repoFullName} 
                repo={fileTree[repoFullName].repo}
                tree={fileTree[repoFullName].tree}
                onFileClick={onFileSelect}
                onStartJellyfish={onStartJellyfish}
                selectedFilePath={selectedFilePath}
                selectedRepo={selectedRepo}
                selectedFiles={selectedFiles}
                onFileSelection={onFileSelection}
                onDirectorySelection={onDirectorySelection}
            />
        ))}
      </div>
    </div>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/autoomousai | ORIGINAL PATH: diplomat-bit-autoomousai-f4d320c/components/FileExplorer.tsx
================================================================================

import React, { useState, useEffect, useRef } from 'react';
import { UnifiedFileTree, DirNode, FileNode, GithubRepo } from '../types';
import { FolderIcon, FolderOpenIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';
import { BotIcon } from './icons/BotIcon';
import { getAllFilePaths } from '../utils';
import { PlusIcon } from './icons/PlusIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface FileExplorerProps {
  fileTree: UnifiedFileTree;
  onFileSelect: (repoFullName: string, path: string) => void;
  onStartMultiEdit: () => void;
  onStartNewProject: () => void;
  onStartProjectExpansion: () => void;
  selectedFilePath?: string | null;
  selectedRepo?: string | null;
  selectedFiles: Set<string>;
  onFileSelection: (fileKey: string, isSelected: boolean) => void;
  onDirectorySelection: (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => void;
}

interface TreeNodeProps {
    node: DirNode | FileNode;
    repoFullName: string;
    onFileClick: (repoFullName: string, path: string) => void;
    selectedFilePath?: string | null;
    selectedRepo?: string | null;
    selectedFiles: Set<string>;
    onFileSelection: (fileKey: string, isSelected: boolean) => void;
    onDirectorySelection: (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, repoFullName, onFileClick, selectedFilePath, selectedRepo, selectedFiles, onFileSelection, onDirectorySelection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const checkboxRef = useRef<HTMLInputElement>(null);
    const isDir = node.type === 'dir';

    useEffect(() => {
        if (isDir && checkboxRef.current) {
            const descendantFiles = getAllFilePaths(node.children).map(p => `${repoFullName}::${p}`);
            if (descendantFiles.length === 0) {
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = false;
                return;
            }
            const selectedCount = descendantFiles.filter(key => selectedFiles.has(key)).length;
            
            if (selectedCount > 0 && selectedCount < descendantFiles.length) {
                checkboxRef.current.indeterminate = true;
            } else {
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = selectedCount === descendantFiles.length;
            }
        }
    }, [selectedFiles, node, isDir, repoFullName]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isDir) {
            onDirectorySelection(node.children, repoFullName, e.target.checked);
        } else {
            const fileKey = `${repoFullName}::${node.path}`;
            onFileSelection(fileKey, e.target.checked);
        }
    };

    if (isDir) {
        return (
            <div>
                <div className="flex items-center p-1.5 hover:bg-gray-700 rounded-md group">
                    <input type="checkbox" ref={checkboxRef} onChange={handleCheckboxChange} className="mr-2 h-4 w-4 rounded bg-gray-800 border-gray-600 text-amber-500 focus:ring-amber-600" />
                    <div 
                        className="flex items-center cursor-pointer flex-grow"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FolderOpenIcon className="w-5 h-5 mr-2 text-indigo-400" /> : <FolderIcon className="w-5 h-5 mr-2 text-indigo-400" />}
                        <span>{node.name}</span>
                    </div>
                </div>
                {isOpen && (
                    <div className="pl-6 border-l border-gray-700 ml-4">
                        {node.children.map(child => (
                            <TreeNode 
                                key={child.path} 
                                node={child} 
                                repoFullName={repoFullName} 
                                onFileClick={onFileClick} 
                                selectedFilePath={selectedFilePath}
                                selectedRepo={selectedRepo}
                                selectedFiles={selectedFiles}
                                onFileSelection={onFileSelection}
                                onDirectorySelection={onDirectorySelection}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const isSelectedForEditing = selectedFiles.has(`${repoFullName}::${node.path}`);
    const isActiveFile = selectedRepo === repoFullName && selectedFilePath === node.path;
    return (
        <div
            className={`flex items-center p-1.5 group rounded-md ${isActiveFile ? 'bg-indigo-900 bg-opacity-50' : 'hover:bg-gray-700'}`}
        >
            <input type="checkbox" checked={isSelectedForEditing} onChange={handleCheckboxChange} className="mr-2 h-4 w-4 rounded bg-gray-800 border-gray-600 text-amber-500 focus:ring-amber-600" />
            <div className="flex items-center cursor-pointer flex-grow" onClick={() => onFileClick(repoFullName, node.path)}>
                <FileIcon className="w-5 h-5 mr-2 text-gray-400" />
                <span className={isActiveFile ? 'text-white' : 'text-gray-300'}>{node.name}</span>
            </div>
        </div>
    );
};

const RepoNode: React.FC<{
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
    onFileClick: (repoFullName: string, path: string) => void;
    selectedFilePath?: string | null;
    selectedRepo?: string | null;
    selectedFiles: Set<string>;
    onFileSelection: (fileKey: string, isSelected: boolean) => void;
    onDirectorySelection: (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => void;
}> = (props) => {
    const { repo, tree, onFileClick, selectedFilePath, selectedRepo, selectedFiles, onFileSelection, onDirectorySelection } = props;
    const isRepoSelected = repo.full_name === selectedRepo;
    const [isOpen, setIsOpen] = useState(isRepoSelected);

    useEffect(() => {
        if(isRepoSelected && !isOpen) {
            setIsOpen(true);
        }
    }, [isRepoSelected, isOpen]);

    return (
        <div className="mb-2">
            <div className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-md group">
                <h3 
                    className="text-lg font-semibold cursor-pointer flex items-center flex-grow"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FolderOpenIcon className="w-5 h-5 mr-2" /> : <FolderIcon className="w-5 h-5 mr-2" />}
                    {repo.full_name}
                </h3>
            </div>
            {isOpen && (
                <div className="pl-4 border-l border-gray-700 ml-2">
                    {tree.map(node => (
                        <TreeNode 
                            key={node.path} 
                            node={node} 
                            repoFullName={repo.full_name} 
                            onFileClick={onFileClick} 
                            selectedFilePath={selectedFilePath}
                            selectedRepo={selectedRepo}
                            selectedFiles={selectedFiles}
                            onFileSelection={onFileSelection}
                            onDirectorySelection={onDirectorySelection} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
    fileTree, 
    onFileSelect, 
    onStartMultiEdit,
    onStartNewProject,
    onStartProjectExpansion,
    selectedFilePath, 
    selectedRepo,
    selectedFiles,
    onFileSelection,
    onDirectorySelection
}) => {
  return (
    <div className="p-4 text-gray-300 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2 flex-shrink-0">
        <h2 className="text-xl font-bold">Repositories</h2>
        <button 
            onClick={onStartNewProject} 
            className="flex items-center gap-2 text-sm bg-indigo-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
            title="Generate a new project with AI"
        >
            <PlusIcon className="w-4 h-4" />
            New AI Project
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {selectedFiles.size > 0 && (
            <div className="mb-4 sticky top-0 bg-gray-900 py-2 z-10 space-y-2">
                <button
                    onClick={onStartMultiEdit}
                    className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-colors"
                >
                    <BotIcon className="w-5 h-5" />
                    AI Edit {selectedFiles.size} Selected File{selectedFiles.size > 1 ? 's' : ''}
                </button>
                 <button
                    onClick={onStartProjectExpansion}
                    disabled={selectedFiles.size !== 1}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    title={selectedFiles.size !== 1 ? 'You must select exactly 1 file to use this feature.' : 'Expand the project based on this seed file.'}
                >
                    <MagicWandIcon className="w-5 h-5" />
                    Expand Project (Seed)
                </button>
            </div>
        )}

        {Object.keys(fileTree).sort().map(repoFullName => (
            <RepoNode 
                key={repoFullName} 
                repo={fileTree[repoFullName].repo}
                tree={fileTree[repoFullName].tree}
                onFileClick={onFileSelect}
                selectedFilePath={selectedFilePath}
                selectedRepo={selectedRepo}
                selectedFiles={selectedFiles}
                onFileSelection={onFileSelection}
                onDirectorySelection={onDirectorySelection}
            />
        ))}
      </div>
    </div>
  );
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/usa | ORIGINAL PATH: diplomat-bit-usa-d72fd59/components/FileExplorer.tsx
================================================================================

import React, { useState, useEffect, useRef } from 'react';
import { UnifiedFileTree, DirNode, FileNode, GithubRepo } from '../types';
import { FolderIcon, FolderOpenIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';
import { BotIcon } from './icons/BotIcon';
import { getAllFilePaths } from '../utils';
import { PlusIcon } from './icons/PlusIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface FileExplorerProps {
  fileTree: UnifiedFileTree;
  onFileSelect: (repoFullName: string, path: string) => void;
  onStartMultiEdit: () => void;
  onStartNewProject: () => void;
  onStartProjectExpansion: () => void;
  selectedFilePath?: string | null;
  selectedRepo?: string | null;
  selectedFiles: Set<string>;
  onFileSelection: (fileKey: string, isSelected: boolean) => void;
  onDirectorySelection: (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => void;
  onRepoExpand?: (repoFullName: string) => void;
  loadingRepos?: Record<string, boolean>;
  repoErrors?: Record<string, string | null>;
}

interface TreeNodeProps {
    node: DirNode | FileNode;
    repoFullName: string;
    onFileClick: (repoFullName: string, path: string) => void;
    selectedFilePath?: string | null;
    selectedRepo?: string | null;
    selectedFiles: Set<string>;
    onFileSelection: (fileKey: string, isSelected: boolean) => void;
    onDirectorySelection: (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, repoFullName, onFileClick, selectedFilePath, selectedRepo, selectedFiles, onFileSelection, onDirectorySelection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const checkboxRef = useRef<HTMLInputElement>(null);
    const isDir = node.type === 'dir';

    useEffect(() => {
        if (isDir && checkboxRef.current) {
            const descendantFiles = getAllFilePaths(node.children).map(p => `${repoFullName}::${p}`);
            if (descendantFiles.length === 0) {
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = false;
                return;
            }
            const selectedCount = descendantFiles.filter(key => selectedFiles.has(key)).length;
            
            if (selectedCount > 0 && selectedCount < descendantFiles.length) {
                checkboxRef.current.indeterminate = true;
            } else {
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = selectedCount === descendantFiles.length;
            }
        }
    }, [selectedFiles, node, isDir, repoFullName]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isDir) {
            onDirectorySelection(node.children, repoFullName, e.target.checked);
        } else {
            const fileKey = `${repoFullName}::${node.path}`;
            onFileSelection(fileKey, e.target.checked);
        }
    };

    if (isDir) {
        return (
            <div>
                <div className="flex items-center p-1.5 hover:bg-gray-700 rounded-md group">
                    <input type="checkbox" ref={checkboxRef} onChange={handleCheckboxChange} className="mr-2 h-4 w-4 rounded bg-gray-800 border-gray-600 text-amber-500 focus:ring-amber-600" />
                    <div 
                        className="flex items-center cursor-pointer flex-grow"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FolderOpenIcon className="w-5 h-5 mr-2 text-indigo-400" /> : <FolderIcon className="w-5 h-5 mr-2 text-indigo-400" />}
                        <span>{node.name}</span>
                    </div>
                </div>
                {isOpen && (
                    <div className="pl-6 border-l border-gray-700 ml-4">
                        {node.children.map(child => (
                            <TreeNode 
                                key={child.path} 
                                node={child} 
                                repoFullName={repoFullName} 
                                onFileClick={onFileClick} 
                                selectedFilePath={selectedFilePath}
                                selectedRepo={selectedRepo}
                                selectedFiles={selectedFiles}
                                onFileSelection={onFileSelection}
                                onDirectorySelection={onDirectorySelection}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const isSelectedForEditing = selectedFiles.has(`${repoFullName}::${node.path}`);
    const isActiveFile = selectedRepo === repoFullName && selectedFilePath === node.path;
    return (
        <div
            className={`flex items-center p-1.5 group rounded-md ${isActiveFile ? 'bg-indigo-900 bg-opacity-50' : 'hover:bg-gray-700'}`}
        >
            <input type="checkbox" checked={isSelectedForEditing} onChange={handleCheckboxChange} className="mr-2 h-4 w-4 rounded bg-gray-800 border-gray-600 text-amber-500 focus:ring-amber-600" />
            <div className="flex items-center cursor-pointer flex-grow" onClick={() => onFileClick(repoFullName, node.path)}>
                <FileIcon className="w-5 h-5 mr-2 text-gray-400" />
                <span className={isActiveFile ? 'text-white' : 'text-gray-300'}>{node.name}</span>
            </div>
        </div>
    );
};

const RepoNode: React.FC<{
    repo: GithubRepo;
    tree: (DirNode | FileNode)[];
    onFileClick: (repoFullName: string, path: string) => void;
    selectedFilePath?: string | null;
    selectedRepo?: string | null;
    selectedFiles: Set<string>;
    onFileSelection: (fileKey: string, isSelected: boolean) => void;
    onDirectorySelection: (nodes: (DirNode | FileNode)[], repoFullName: string, shouldSelect: boolean) => void;
    onRepoExpand?: (repoFullName: string) => void;
    isLoading?: boolean;
    error?: string | null;
}> = (props) => {
    const { repo, tree, onFileClick, selectedFilePath, selectedRepo, selectedFiles, onFileSelection, onDirectorySelection, onRepoExpand, isLoading, error } = props;
    const isRepoSelected = repo.full_name === selectedRepo;
    const [isOpen, setIsOpen] = useState(isRepoSelected);
    const checkboxRef = useRef<HTMLInputElement>(null);

    const handleExpandToggle = () => {
        const nextOpen = !isOpen;
        setIsOpen(nextOpen);
        if (nextOpen && onRepoExpand) {
            onRepoExpand(repo.full_name);
        }
    };

    useEffect(() => {
        if(isRepoSelected && !isOpen) {
            setIsOpen(true);
            if (onRepoExpand) {
                onRepoExpand(repo.full_name);
            }
        }
    }, [isRepoSelected, isOpen, repo.full_name, onRepoExpand]);

    useEffect(() => {
        if (checkboxRef.current) {
            const descendantFiles = getAllFilePaths(tree).map(p => `${repo.full_name}::${p}`);
            if (descendantFiles.length === 0) {
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = false;
                return;
            }
            const selectedCount = descendantFiles.filter(key => selectedFiles.has(key)).length;
            
            if (selectedCount > 0 && selectedCount < descendantFiles.length) {
                checkboxRef.current.indeterminate = true;
            } else {
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = selectedCount === descendantFiles.length;
            }
        }
    }, [selectedFiles, tree, repo.full_name]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDirectorySelection(tree, repo.full_name, e.target.checked);
    };

    return (
        <div className="mb-2">
            <div className="flex items-center p-2 hover:bg-gray-700 rounded-md group">
                <input 
                    type="checkbox" 
                    ref={checkboxRef} 
                    onChange={handleCheckboxChange} 
                    className="mr-2 h-4 w-4 rounded bg-gray-800 border-gray-600 text-amber-500 focus:ring-amber-600" 
                    onClick={(e) => e.stopPropagation()}
                />
                <h3 
                    className="text-lg font-semibold cursor-pointer flex items-center flex-grow"
                    onClick={handleExpandToggle}
                >
                    {isOpen ? <FolderOpenIcon className="w-5 h-5 mr-2" /> : <FolderIcon className="w-5 h-5 mr-2" />}
                    {repo.full_name}
                </h3>
            </div>
            {isOpen && (
                <div className="pl-4 border-l border-gray-700 ml-2">
                    {isLoading ? (
                        <div className="text-sm text-gray-500 py-1.5 flex items-center gap-2">
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"></span>
                            Loading contents...
                        </div>
                    ) : error ? (
                        <div className="text-sm text-red-400 py-1.5">{error}</div>
                    ) : tree.length === 0 ? (
                        <div className="text-sm text-gray-500 py-1.5">Empty repository</div>
                    ) : (
                        tree.map(node => (
                            <TreeNode 
                                key={node.path} 
                                node={node} 
                                repoFullName={repo.full_name} 
                                onFileClick={onFileClick} 
                                selectedFilePath={selectedFilePath}
                                selectedRepo={selectedRepo}
                                selectedFiles={selectedFiles}
                                onFileSelection={onFileSelection}
                                onDirectorySelection={onDirectorySelection} 
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
    fileTree, 
    onFileSelect, 
    onStartMultiEdit,
    onStartNewProject,
    onStartProjectExpansion,
    selectedFilePath, 
    selectedRepo,
    selectedFiles,
    onFileSelection,
    onDirectorySelection,
    onRepoExpand,
    loadingRepos,
    repoErrors
}) => {
  return (
    <div className="p-4 text-gray-300 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2 flex-shrink-0">
        <h2 className="text-xl font-bold">Repositories</h2>
        <button 
            onClick={onStartNewProject} 
            className="flex items-center gap-2 text-sm bg-indigo-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
            title="Generate a new project with AI"
        >
            <PlusIcon className="w-4 h-4" />
            New AI Project
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {selectedFiles.size > 0 && (
            <div className="mb-4 sticky top-0 bg-gray-900 py-2 z-10 space-y-2">
                <button
                    onClick={onStartMultiEdit}
                    className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-colors"
                >
                    <BotIcon className="w-5 h-5" />
                    AI Edit {selectedFiles.size} Selected File{selectedFiles.size > 1 ? 's' : ''}
                </button>
                 <button
                    onClick={onStartProjectExpansion}
                    disabled={selectedFiles.size === 0}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    title={selectedFiles.size === 0 ? 'Select seed files to expand from.' : 'Expand the project based on selected seed files.'}
                >
                    <MagicWandIcon className="w-5 h-5" />
                    Expand Project (Seeds)
                </button>
            </div>
        )}

        {Object.keys(fileTree).sort().map(repoFullName => (
            <RepoNode 
                key={repoFullName} 
                repo={fileTree[repoFullName].repo}
                tree={fileTree[repoFullName].tree}
                onFileClick={onFileSelect}
                selectedFilePath={selectedFilePath}
                selectedRepo={selectedRepo}
                selectedFiles={selectedFiles}
                onFileSelection={onFileSelection}
                onDirectorySelection={onDirectorySelection}
                onRepoExpand={onRepoExpand}
                isLoading={loadingRepos?.[repoFullName]}
                error={repoErrors?.[repoFullName]}
            />
        ))}
      </div>
    </div>
  );
};