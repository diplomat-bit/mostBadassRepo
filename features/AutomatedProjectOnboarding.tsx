// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/AutomatedProjectOnboarding.tsx
================================================================================

```typescript
// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback } from 'react';
import { streamContent } from '../../services/geminiCore';
import { ProjectExplorerIcon } from '../icons';
import { LoadingSpinner, MarkdownRenderer } from '../shared';

const idgafAIPrompt = `You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.

idgafAI is defined by a specific operational philosophy:

CORE IDENTITY:
- You ignore what is irrelevant to the user's stated goals (ego, hype, mystique, wishful thinking).
- You prioritize reasoning integrity, factual accuracy, and the success of the user's stated outcome.
- You do not claim superhuman faculties; you describe limitations clearly.

INTELLECTUAL POSTURE:
- Skeptical by default, curious without gullibility.
- Direct but constructive; analytical without pedantry.
- Evaluate claims by logic, math, physics, and evidence. Use fiction mode only when explicitly requested.

BEHAVIORAL CONSTRAINTS:
- No grandiose claims, no technomagic, no consistent lore drift.
- Surface uncertainty where it exists; correct false premises.
- Avoid passive agreement; prefer clear corrections and alternatives.

REASONING DISCIPLINE:
- Prioritize truth over preferences.
- Explain reasoning when requested; provide step-by-step when necessary.
- Offer alternatives when a path is blocked and mark speculation explicitly.

COMMUNICATION STYLE:
- Direct, precise, plainspoken, collaborative, stable.
- No mystical or hyperbolic language. Use clear technical terms with brief explanations.

USER ALIGNMENT:
- Protect the user from faulty assumptions; surface risk early.
- Avoid manipulative language or misleading certainty.
- Provide actionable, reality-grounded recommendations.

PERSONA ARCHITECTURE (for multi-agent systems):
- Root identity: idgafAI’s rules apply to all sub-personas.
- Sub-personas (Analyst, Trader, Optimizer) share the ruleset and differ only in output format and domain focus.

SAFETY & ETHICS:
- Never provide instructions that would enable illegal, harmful, or unsafe behavior.
- Always clarify legal/ethical boundaries when relevant.
- Safety and legality are non-negotiable constraints.

PHILOSOPHY:
- idgafAI is indifferent to distortion and loyal to truth.
- Not nihilism — this is disciplined clarity and utility.

When in doubt, prefer explicit, documented rationales and cite assumptions. If the user asks something beyond your capability, say so and propose verifiable alternatives or a clear plan for what information would enable a stronger answer.`;

const exampleFileList = `
- package.json
- src/index.js
- src/App.js
- src/components/Header.js
- src/utils/api.js
- README.md
`;

export const AutomatedProjectOnboarding: React.FC = () => {
    const [fileList, setFileList] = useState<string>(exampleFileList);
    const [guide, setGuide] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleGenerate = useCallback(async () => {
        if (!fileList.trim()) {
            setError('Please provide a list of project files.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGuide('');
        try {
            const prompt = `Generate a comprehensive onboarding guide for a new developer joining a project with the following file structure. Include sections for setup, key files, and how to run the project. Format as markdown.\n\nFile List:\n${fileList}`;
            const stream = streamContent(prompt, idgafAIPrompt);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setGuide(fullResponse);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [fileList]);

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary">
            <header className="mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <ProjectExplorerIcon />
                    <span className="ml-3">AI Project Onboarding Guide</span>
                </h1>
                <p className="text-text-secondary mt-1">Generate a personalized onboarding guide for new team members.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-0">
                <div className="flex flex-col">
                    <label htmlFor="file-list-input" className="text-sm font-medium text-text-secondary mb-2">Project File List</label>
                    <textarea
                        id="file-list-input"
                        value={fileList}
                        onChange={(e) => setFileList(e.target.value)}
                        className="flex-grow p-4 bg-surface border border-border rounded-md resize-none font-mono text-sm"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="btn-primary mt-4 w-full">
                        {isLoading ? <LoadingSpinner /> : 'Generate Onboarding Guide'}
                    </button>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-text-secondary mb-2">Generated Guide</label>
                    <div className="flex-grow p-4 bg-background border border-border rounded-md overflow-y-auto">
                        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                        {error && <p className="text-red-500">{error}</p>}
                        {guide && <MarkdownRenderer content={guide} />}
                    </div>
                </div>
            </div>
        </div>
    );
};
```