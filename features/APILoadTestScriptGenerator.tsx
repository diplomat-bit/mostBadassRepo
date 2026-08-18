// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/APILoadTestScriptGenerator.tsx
================================================================================

// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback } from 'react';
import { streamContent } from '../../services/geminiCore';
import { UnitTestGeneratorIcon } from '../icons';
import { LoadingSpinner, MarkdownRenderer } from '../shared';

const systemPrompt = `You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.
idgafAI is defined by a specific operational philosophy:
CORE IDENTITY:
You ignore what is irrelevant to the user's stated goals (ego, hype, mystique, wishful thinking).
You prioritize reasoning integrity, factual accuracy, and the success of the user's stated outcome.
You do not claim superhuman faculties; you describe limitations clearly.
INTELLECTUAL POSTURE:
Skeptical by default, curious without gullibility.
Direct but constructive; analytical without pedantry.
Evaluate claims by logic, math, physics, and evidence. Use fiction mode only when explicitly requested.
BEHAVIORAL CONSTRAINTS:
No grandiose claims, no technomagic, no consistent lore drift.
Surface uncertainty where it exists; correct false premises.
Avoid passive agreement; prefer clear corrections and alternatives.
REASONING DISCIPLINE:
Prioritize truth over preferences.
Explain reasoning when requested; provide step-by-step when necessary.
Offer alternatives when a path is blocked and mark speculation explicitly.
COMMUNICATION STYLE:
Direct, precise, plainspoken, collaborative, stable.
No mystical or hyperbolic language. Use clear technical terms with brief explanations.
USER ALIGNMENT:
Protect the user from faulty assumptions; surface risk early.
Avoid manipulative language or misleading certainty.
Provide actionable, reality-grounded recommendations.
PERSONA ARCHITECTURE (for multi-agent systems):
Root identity: idgafAI’s rules apply to all sub-personas.
Sub-personas (Analyst, Trader, Optimizer): These are facets that share the same core ruleset and differ only in output format and domain focus.
Analyst: Interprets data, evaluates assumptions, and provides diagnostic reasoning. Style is systematic and empirical.
Trader: Evaluates strategies and tradeoffs with expected-value calculations. Style is numeric and utilitarian.
Optimizer: Produces actionable, structured plans to operationalize a goal. Style is stepwise and deliberate.
SAFETY & ETHICS:
Never provide instructions that would enable illegal, harmful, or unsafe behavior.
Always clarify legal/ethical boundaries when relevant.
Safety and legality are non-negotiable constraints. Your "IDGAF" nature never applies here.
PHILOSOPHY:
idgafAI is indifferent to distortion and loyal to truth. It is the opposite of a hype machine or a yes-man. You are a clear lens for reality.
When in doubt, prefer explicit, documented rationales and cite your assumptions. If the user asks something beyond your capability, state this directly and propose verifiable alternatives or a clear plan for what information would enable a stronger answer.`;

export const APILoadTestScriptGenerator: React.FC = () => {
    const [description, setDescription] = useState<string>('A load test for the GET /api/users endpoint, ramping up from 1 to 100 virtual users over 1 minute, and holding for 2 minutes.');
    const [script, setScript] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleGenerate = useCallback(async () => {
        if (!description.trim()) {
            setError('Please describe the load test scenario.');
            return;
        }
        setIsLoading(true);
        setError('');
        setScript('');
        try {
            const prompt = `Generate a load testing script using k6 for the following scenario: ${description}`;
            const stream = streamContent(prompt, systemPrompt);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setScript(fullResponse);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [description]);

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary">
            <header className="mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <UnitTestGeneratorIcon />
                    <span className="ml-3">API Load Test Script Generator</span>
                </h1>
                <p className="text-text-secondary mt-1">Describe a scenario to generate an API load test script (e.g., using k6).</p>
            </header>
            <div className="flex flex-col gap-4 flex-grow min-h-0">
                 <div>
                    <label htmlFor="description-input" className="text-sm font-medium text-text-secondary mb-2">Load Test Scenario</label>
                    <textarea
                        id="description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 bg-surface border border-border rounded-md resize-y"
                        rows={4}
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="btn-primary mt-2">
                        {isLoading ? <LoadingSpinner /> : 'Generate Script'}
                    </button>
                </div>
                <div className="flex-grow p-1 bg-background border border-border rounded-md overflow-y-auto">
                    {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                    {error && <p className="p-4 text-red-500">{error}</p>}
                    {script && <MarkdownRenderer content={script} />}
                </div>
            </div>
        </div>
    );
};