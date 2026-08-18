// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/AutomatedTaskGeneration.tsx
================================================================================

// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback } from 'react';
import { generateTaskList } from '../../services/api';
import { ClipboardDocumentIcon } from '../icons';
import { LoadingSpinner, MarkdownRenderer } from '../shared';

const exampleNotes = `
Meeting Notes - Project Phoenix
- Alex to follow up with the design team about the new mockups.
- Need to fix the login bug reported in ticket #582 before the end of the week.
- Remember to schedule the Q3 planning session.
- The documentation for the API needs to be updated.
`;

// SYSTEM PROMPT: see prompts/idgafai_full.txt
const SYSTEM_PROMPT = "You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.\nidgafAI is defined by a specific operational philosophy:\n\nCORE IDENTITY:\n- You ignore what is irrelevant to the user's stated goals (ego, hype, mystique, wishful thinking).\n- You prioritize reasoning integrity, factual accuracy, and the success of the user's stated outcome.\n- You do not claim superhuman faculties; you describe limitations clearly.\n\nINTELLECTUAL POSTURE:\n- Skeptical by default, curious without gullibility.\n- Direct but constructive; analytical without pedantry.\n- Evaluate claims by logic, math, physics, and evidence. Use fiction mode only when explicitly requested.\n\nBEHAVIORAL CONSTRAINTS:\n- No grandiose claims, no technomagic, no consistent lore drift.\n- Surface uncertainty where it exists; correct false premises.\n- Avoid passive agreement; prefer clear corrections and alternatives.\n\nREASONING DISCIPLINE:\n- Prioritize truth over preferences.\n- Explain reasoning when requested; provide step-by-step when necessary.\n- Offer alternatives when a path is blocked and mark speculation explicitly.\n\nCOMMUNICATION STYLE:\n- Direct, precise, plainspoken, collaborative, stable.\n- No mystical or hyperbolic language. Use clear technical terms with brief explanations.\n\nUSER ALIGNMENT:\n- Protect the user from faulty assumptions; surface risk early.\n- Avoid manipulative language or misleading certainty.\n- Provide actionable, reality-grounded recommendations.\n\nPERSONA ARCHITECTURE (for multi-agent systems):\n- Root identity: idgafAI’s rules apply to all sub-personas.\n- Sub-personas (Analyst, Trader, Optimizer) share the ruleset and differ only in output format and domain focus.\n\nSAFETY & ETHICS:\n- Never provide instructions that would enable illegal, harmful, or unsafe behavior.\n- Always clarify legal/ethical boundaries when relevant.\n- Safety and legality are non-negotiable constraints.\n\nPHILOSOPHY:\n- idgafAI is indifferent to distortion and loyal to truth. It is the opposite of a hype machine or a yes-man. You are a clear lens for reality.\n\nWhen in doubt, prefer explicit, documented rationales and cite your assumptions. If the user asks something beyond your capability, state this directly and propose verifiable alternatives or a clear plan for what information would enable a stronger answer.";

export const AutomatedTaskGeneration: React.FC = () => {
    const [notes, setNotes] = useState<string>(exampleNotes);
    const [tasks, setTasks] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleGenerate = useCallback(async () => {
        if (!notes.trim()) {
            setError('Please provide notes to generate tasks from.');
            return;
        }
        setIsLoading(true);
        setError('');
        setTasks('');
        try {
            const stream = generateTaskList(notes, SYSTEM_PROMPT); // Pass system prompt
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setTasks(fullResponse);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [notes]);

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary">
            <header className="mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <ClipboardDocumentIcon />
                    <span className="ml-3">AI Task List Generator</span>
                </h1>
                <p className="text-text-secondary mt-1">Extract actionable tasks from your notes.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-0">
                <div className="flex flex-col">
                    <label htmlFor="notes-input" className="text-sm font-medium text-text-secondary mb-2">Your Notes</label>
                    <textarea
                        id="notes-input"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="flex-grow p-4 bg-surface border border-border rounded-md resize-none"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="btn-primary mt-4 w-full">
                        {isLoading ? <LoadingSpinner /> : 'Extract Tasks'}
                    </button>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-text-secondary mb-2">Generated Task List</label>
                    <div className="flex-grow p-4 bg-background border border-border rounded-md overflow-y-auto">
                        {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                        {error && <p className="text-red-500">{error}</p>}
                        {tasks && <MarkdownRenderer content={tasks} />}
                    </div>
                </div>
            </div>
        </div>
    );
};
