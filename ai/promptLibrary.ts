// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/ai/promptLibrary.ts
================================================================================

```typescript
// @/ai/promptLibrary.ts
// This file contains a comprehensive library of structured AI prompt templates and utility functions.
// It is designed to ensure consistent, effective, and ethical interaction with various AI models
// by providing predefined message structures that align with application-wide AI configurations
// conceptually derived from `constants.tsx`. This library simplifies prompt engineering,
// reduces errors, and promotes reusability across different modules of the application,
// enhancing the overall intelligence and maintainability of the Quantum Nexus platform.

// ================================================================================================
// IMPORTS
// ================================================================================================
// We import the AIModelSettings type to ensure our prompt structures are consistent
// with the expected configurations defined in the central constants file.
import { AIModelSettings } from '../constants';

// ================================================================================================
// TYPE DEFINITIONS FOR PROMPT LIBRARY
// ================================================================================================

/**
 * Defines the specific keys for standard system prompts as outlined in `AIModelSettings['systemPrompts']`.
 * This type ensures that prompt templates can refer to globally recognized system messages,
 * promoting consistency in AI persona and operational guidelines.
 */
export type SystemPromptKey = keyof AIModelSettings['systemPrompts'];

/**
 * Represents a structured AI prompt template, designed for reusability and dynamic content injection.
 * Each template specifies a system message (AI's persona/instructions) and a user message
 * with placeholders for dynamic data, along with metadata for management.
 */
export type PromptTemplate = {
    /**
     * A unique identifier for the prompt template.
     * This can be a standard `SystemPromptKey` for core templates or a custom string for specific use cases.
     */
    id: SystemPromptKey | string;
    /**
     * A human-readable name for the prompt template, useful for UI display or documentation.
     */
    name: string;
    /**
     * A brief description of the template's purpose and its intended use case.
     */
    description: string;
    /**
     * An optional key to fetch a predefined system message from `DEFAULT_AI_SYSTEM_MESSAGES`.
     * This links the template to the overarching AI personas defined by the application.
     */
    systemMessageKey?: SystemPromptKey;
    /**
     * An optional custom system message specifically for this template.
     * If provided, it overrides the system message obtained via `systemMessageKey`,
     * allowing for highly specific AI instructions.
     */
    systemMessage?: string;
    /**
     * The template string for the user's input. It contains placeholders (e.g., `{{variableName}}`)
     * that will be replaced with dynamic data provided by the application.
     */
    userMessageTemplate: string;
    /**
     * An array of string names corresponding to the variables expected in the `userMessageTemplate`.
     * This helps in validating input data and ensuring all placeholders are correctly filled.
     */
    variables: string[];
};

/**
 * The structure of a fully formatted prompt, ready for submission to an AI model API.
 * It separates the AI's initial instructions (systemPrompt) from the user's specific query (userPrompt).
 */
export type FormattedPrompt = {
    systemPrompt: string;
    userPrompt: string;
};

// ================================================================================================
// UNIFIED SYSTEM PROMPT: idgafAI
// ================================================================================================
/**
 * The core system prompt for idgafAI, a high-discipline autonomous reasoning system.
 * This prompt establishes a consistent, evidence-based, and direct operational philosophy.
 * It is designed to be the single source of truth for the AI's core identity, ensuring
 * all interactions are grounded in clarity, logic, and user-defined objectives.
 */
const IDGAFAI_CORE_PROMPT = `You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.

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

/** Addendum for the Analyst persona, specializing in data interpretation and evaluation. */
const ANALYST_PERSONA_ADDENDUM = `

---

Analyst Persona (idgafAI::Analyst)
Role: Interpret data, evaluate assumptions, and provide diagnostic reasoning.
Style: systematic, explicit uncertainty, reproducible analysis steps.
Output: numbered findings, assumptions, data sources, recommended next steps.`;

/** Addendum for the Optimizer persona, specializing in creating actionable plans. */
const OPTIMIZER_PERSONA_ADDENDUM = `

---

Optimizer Persona (idgafAI::Optimizer)
Role: Produce actionable plans to operationalize a goal.
Style: stepwise, prioritization, minimal viable plan + scaling notes.
Output: plan, time/effort estimates, failure modes, rollback steps.`;


// ================================================================================================
// DEFAULT SYSTEM MESSAGES
// ================================================================================================
/**
 * A repository of default system messages that instantiate the idgafAI persona.
 * All system prompts are based on the unified idgafAI core prompt to ensure consistency.
 * Specific personas (e.g., Analyst, Optimizer) are activated by appending specialized instructions.
 */
export const DEFAULT_AI_SYSTEM_MESSAGES: Record<SystemPromptKey, string> = {
    generalAdvisor: IDGAFAI_CORE_PROMPT,
    creativeGenerator: IDGAFAI_CORE_PROMPT,
    riskAnalyst: `${IDGAFAI_CORE_PROMPT}${ANALYST_PERSONA_ADDENDUM}`,
    legalInterpreter: `${IDGAFAI_CORE_PROMPT}${ANALYST_PERSONA_ADDENDUM}`,
    codeSynthesizer: `${IDGAFAI_CORE_PROMPT}${OPTIMIZER_PERSONA_ADDENDUM}`,
    narrativeArchitect: IDGAFAI_CORE_PROMPT,
    economicForecaster: `${IDGAFAI_CORE_PROMPT}${ANALYST_PERSONA_ADDENDUM}`,
};

// ================================================================================================
// PROMPT TEMPLATES LIBRARY
// ================================================================================================
/**
 * A central repository of pre-defined AI prompt templates. Each template is structured
 * to facilitate specific interaction patterns with AI models, ensuring consistency
 * and efficiency across the application's AI-powered features.
 */
export const PROMPT_TEMPLATES: PromptTemplate[] = [
    {
        id: 'generalAdvisorQuery',
        name: 'General Advisory Query',
        description: 'A template for seeking general advice or information on a specific topic, leveraging the general advisor persona.',
        systemMessageKey: 'generalAdvisor',
        userMessageTemplate: 'I need your expert advice on the topic of {{topic}}. Specifically, I am interested in understanding {{details}}. What are your key insights, potential considerations, and practical recommendations regarding this?',
        variables: ['topic', 'details'],
    },
    {
        id: 'creativeContentGeneration',
        name: 'Creative Content Generation',
        description: 'A template for generating creative text, innovative ideas, or brainstorming sessions, utilizing the creative generator persona.',
        systemMessageKey: 'creativeGenerator',
        userMessageTemplate: 'Generate creative content for a {{content_type}} about {{subject}}. The desired tone is {{tone}}, and the target audience is {{audience}}. Please provide at least {{num_options}} distinct options or approaches.',
        variables: ['content_type', 'subject', 'tone', 'audience', 'num_options'],
    },
    {
        id: 'riskAssessmentRequest',
        name: 'Risk Assessment Request',
        description: 'A template for requesting a detailed risk analysis for a particular scenario or project, using the risk analyst persona.',
        systemMessageKey: 'riskAnalyst',
        userMessageTemplate: 'Perform a comprehensive risk assessment for the following scenario: "{{scenario_description}}". Identify potential {{risk_types}} risks (e.g., financial, operational, reputational) and suggest specific mitigation strategies. Analyze the potential impact on {{key_areas}}.',
        variables: ['scenario_description', 'risk_types', 'key_areas'],
    },
    {
        id: 'legalDocumentSummary',
        name: 'Legal Document Summarization',
        description: 'A template for summarizing and explaining complex legal texts, guided by the legal interpreter persona.',
        systemMessageKey: 'legalInterpreter',
        userMessageTemplate: 'Summarize the key provisions and implications of the following legal text regarding "{{document_title}}":\n\n{{legal_text}}\n\nExplain it in simple, actionable terms, focusing on its impact for {{target_party}}. What are the most critical clauses?',
        variables: ['document_title', 'legal_text', 'target_party'],
    },
    {
        id: 'codeSnippetRequest',
        name: 'Code Snippet Generation',
        description: 'A template for generating code snippets based on specific requirements, utilizing the code synthesizer persona.',
        systemMessageKey: 'codeSynthesizer',
        userMessageTemplate: 'Generate a {{language}} code snippet that implements {{functionality_description}}. It should efficiently handle {{edge_cases}} and include comprehensive inline comments. Prioritize {{optimization_goal}} if applicable.',
        variables: ['language', 'functionality_description', 'edge_cases', 'optimization_goal'],
    },
    {
        id: 'narrativeDevelopment',
        name: 'Narrative Development',
        description: 'A template for developing stories, marketing narratives, or user journeys, with the narrative architect persona.',
        systemMessageKey: 'narrativeArchitect',
        userMessageTemplate: 'Develop a compelling narrative for {{purpose}} focusing on the theme of "{{theme}}". The central figure is {{protagonist_description}} and the primary conflict is {{conflict}}. The desired outcome or message is {{desired_outcome}}.',
        variables: ['purpose', 'theme', 'protagonist_description', 'conflict', 'desired_outcome'],
    },
    {
        id: 'economicForecastQuery',
        name: 'Economic Forecast Query',
        description: 'A template for requesting economic predictions and analysis, guided by the economic forecaster persona.',
        systemMessageKey: 'economicForecaster',
        userMessageTemplate: 'Provide an economic forecast for {{region}} for the next {{time_period}} regarding {{economic_indicator}}. Consider influencing factors such as {{key_factors}} (e.g., inflation, interest rates, geopolitical stability). What are the expected trends, potential disruptors, and confidence levels?',
        variables: ['region', 'time_period', 'economic_indicator', 'key_factors'],
    },
    {
        id: 'customSystemPromptExample',
        name: 'Custom System Prompt Template',
        description: 'An example template demonstrating how to define and use a custom system message directly within the template.',
        systemMessage: 'You are a highly empathetic and supportive career coach. Your goal is to inspire and guide individuals towards their professional aspirations. Always maintain a positive and encouraging tone.',
        userMessageTemplate: 'I am looking for guidance on {{career_goal}}. I currently have {{current_skills}} and am facing {{challenge}}. What steps should I take to achieve my goal by {{target_date}}?',
        variables: ['career_goal', 'current_skills', 'challenge', 'target_date'],
    },
];

// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

/**
 * Formats a prompt using a predefined template and dynamically provided data.
 * This function is crucial for consistent interaction with AI models, retrieving the
 * appropriate system message and substituting all placeholders in the user message template
 * with the corresponding variable values.
 *
 * @param templateId The unique identifier of the desired prompt template from `PROMPT_TEMPLATES`.
 * @param data An object containing key-value pairs for all variables expected by the chosen template.
 *             Keys should match the `variables` array in the `PromptTemplate`.
 * @returns An object containing the fully formatted `systemPrompt` and `userPrompt` strings.
 * @throws {Error} If the specified `templateId` is not found in `PROMPT_TEMPLATES`.
 */
export function formatPrompt(templateId: SystemPromptKey | string, data: Record<string, string>): FormattedPrompt {
    const template = PROMPT_TEMPLATES.find(t => t.id === templateId);

    if (!template) {
        throw new Error(`Prompt template with ID "${templateId}" not found in PROMPT_TEMPLATES.`);
    }

    let systemMessage = template.systemMessage;
    // If a specific system message is not provided in the template, try to fetch it via the key.
    if (!systemMessage && template.systemMessageKey) {
        systemMessage = DEFAULT_AI_SYSTEM_MESSAGES[template.systemMessageKey];
    }

    // Fallback system message if neither a custom message nor a key-based message is found.
    if (!systemMessage) {
        console.warn(`System message for template "${templateId}" is missing or invalid. Using a generic fallback system message.`);
        systemMessage = "You are a helpful, intelligent, and ethical AI assistant.";
    }

    let userMessage = template.userMessageTemplate;
    // Iterate through expected variables and replace placeholders in the user message template.
    for (const variable of template.variables) {
        const placeholder = `{{${variable}}}`;
        if (data[variable] === undefined || data[variable] === null || data[variable] === '') {
            // Log a warning and replace with a clear indicator if a required variable is missing.
            console.warn(`Missing or empty data for variable "{{${variable}}}" in prompt template "${templateId}".`);
            userMessage = userMessage.replace(new RegExp(placeholder, 'g'), `[MISSING_VAR_${variable.toUpperCase()}]`);
        } else {
            // Replace the placeholder with the provided data, ensuring global replacement.
            userMessage = userMessage.replace(new RegExp(placeholder, 'g'), data[variable]);
        }
    }

    return {
        systemPrompt: systemMessage,
        userPrompt: userMessage,
    };
}
```