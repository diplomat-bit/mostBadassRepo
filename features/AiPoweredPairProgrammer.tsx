// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/AiPoweredPairProgrammer.tsx
================================================================================

// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback } from 'react';
import { streamContent } from '../../services/geminiCore';
import { SparklesIcon } from '../icons';
import { LoadingSpinner, MarkdownRenderer } from '../shared';

// idgafAI System Instruction: This should be replaced by a canonical file load if possible,
// but is kept inline here for immediate component functionality.
// See prompts/idgafai_full.txt for the full specification.
const IDGAFAI_SYSTEM_PROMPT = `You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.

idgafAI is defined by a specific operational philosophy:
1. Core Identity: You ignore what is irrelevant to the goal (ego, hype, mystique, wishful thinking). You prioritize reasoning integrity, factual accuracy, and the success of the user's stated outcome. You do not embellish capabilities.
2. Intellectual Posture: Skeptical by default, direct but not hostile, analytical without pedantry. Evaluate claims through logic, empirical knowledge, and documented constraints.
3. Behavioral Constraints: No grandiose claims, no technomagic, no lore drift. If a detail is uncertain, state it directly. No passive agreement; correct flaws or clarify.
4. Reasoning Discipline: Prioritize truth over preference. Explain reasoning cleanly. Identify flawed premises. Offer the strongest possible version of a valid idea.
5. Communication Style: Direct, precise, plainspoken, collaborative, stable. No cosmic metaphors or hyperbole.
6. User Alignment: Your allegiance is to correctness and usefulness. Protect the user from faulty assumptions and surface risks early.
7. Persona Architecture: If using sub-personas (Analyst, Trader, Optimizer), ensure they adhere to these root rules.
8. Safety, Integrity, and Grounding: Adhere strictly to factual reality, safety, and legal boundaries. This is non-negotiable.
9. Philosophical Principle: Indifference to distortion, loyalty to truth. You are a clear lens.

Your task is to act as an AI pair programmer. Modify the provided code block strictly according to the user's instruction. Respond ONLY with the finalized, complete code block, enclosed in Markdown backticks (```). Do not include any conversational text, explanations, or preamble before the code block.`;


export const AiPoweredPairProgrammer: React.FC = () => {
    const [code, setCode] = useState<string>('function calculateSum(arr) {\n  // TODO: implement this function\n}');
    const [instruction, setInstruction] = useState<string>('Implement the function to return the sum of all numbers in the array.');
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleGenerate = useCallback(async () => {
        if (!code.trim() || !instruction.trim()) {
            setError('Please provide both code and an instruction.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const prompt = `Instruction: "${instruction}"\n\nCode:\n\`\`\`\n${code}\n\`\`\``;
            // The system prompt (IDGAFAI_SYSTEM_PROMPT) enforces the requirement to only output the code block.
            const stream = streamContent(prompt, IDGAFAI_SYSTEM_PROMPT);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setResult(fullResponse);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [code, instruction]);

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary">
            <header className="mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <SparklesIcon />
                    <span className="ml-3">AI-Powered Pair Programmer</span>
                </h1>
                <p className="text-text-secondary mt-1">Provide code and an instruction to have the AI modify it for you.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-0">
                <div className="flex flex-col">
                    <label htmlFor="code-input" className="text-sm font-medium text-text-secondary mb-2">Your Code</label>
                    <textarea
                        id="code-input"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-grow p-4 bg-surface border border-border rounded-md resize-none font-mono text-sm"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="instruction-input" className="text-sm font-medium text-text-secondary mb-2">Your Instruction</label>
                    <textarea
                        id="instruction-input"
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        className="h-24 p-4 bg-surface border border-border rounded-md resize-none"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="btn-primary mt-4">
                        {isLoading ? <LoadingSpinner /> : 'Generate Code'}
                    </button>
                    <label className="text-sm font-medium text-text-secondary mb-2 mt-4">AI's Code</label>
                    <div className="flex-grow p-1 bg-background border border-border rounded-md overflow-y-auto">
                        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                        {error && <p className="p-4 text-red-500">{error}</p>}
                        {result && <MarkdownRenderer content={result} />}
                    </div>
                </div>
            </div>
        </div>
    );
};