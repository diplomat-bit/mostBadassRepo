// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/generative_ide/AppWeaverView.tsx
================================================================================

```tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineCode, AiFillSetting } from 'react-icons/ai'; // Example Icons, replace as needed
import { GiRobotGrab } from 'react-icons/gi';
import { MdOutlineIntegrationInstructions } from 'react-icons/md';

import { useAIChatSession } from '../../hooks/useAIChatSession'; // Assuming this hook is available
import { AISettingsModal } from '../../components/AISettingsModal'; // Assuming this component exists
import { AIWrapper } from '../../components/AIWrapper';
import { FeatureGuard } from '../FeatureGuard';
import { usePreferences } from '../../components/preferences/usePreferences';
import { CODE_GENERATION_FEATURE_FLAG } from '../../constants';
import { codeGenerationService } from '../../components/services/codeGeneration/GenerativeAlgorithmEngine';
import { CodeTransformerService } from '../../components/Dashboard/generativeCodeEngine/CodeTransformerService';
import { GenerativeCodeEngineView } from '../../components/views/platform/GenerativeCodeEngineView';
import { CodeArcheologistView } from '../../components/views/blueprints/CodeArcheologistView';
import { useApiKeyManagementService } from '../../hooks/useApiKeyManagementService';


const AppWeaverContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden; // Important for nested scrollable areas
`;

const Header = styled.header`
  background-color: #f0f0f0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden; // Enable scroll within the content
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #e9ecef;
  padding: 1rem;
  border-right: 1px solid #ccc;
  overflow-y: auto; // Add vertical scroll if content overflows
`;

const SidebarSection = styled.div`
  margin-bottom: 1rem;
`;

const SidebarSectionTitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
`;

const SidebarItem = styled.div`
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #d3d3d3;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 1rem;
  overflow-y: auto; // Add vertical scroll if content overflows
`;

const NoAccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
`;

const NoAccessTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const NoAccessDescription = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.5rem;
`;


const AppWeaverView = () => {
    const [activeTool, setActiveTool] = useState('code-generator'); // 'code-generator', 'code-archeologist', 'integration'
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { hasFeature } = usePreferences();
    const apiKeyService = useApiKeyManagementService();

    // Use AI Chat Session - Optional: Include if you want a chat interface.  Adjust prompts as needed for IDE context.
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        clearChat,
        isChatActive,
        setIsChatActive,
    } = useAIChatSession({
        systemPrompt: `You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.

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

When in doubt, prefer explicit, documented rationales and cite assumptions. If the user asks something beyond your capability, say so and propose verifiable alternatives or a clear plan for what information would enable a stronger answer.`,
        model: "gpt-4-turbo", // Or another model from the API, like Gemini
        apiKey: apiKeyService.getApiKey("gemini")
    });


    // Function to render the correct content based on the selected tool
    const renderContent = () => {
        switch (activeTool) {
            case 'code-generator':
                return (
                    <GenerativeCodeEngineView apiKey={apiKeyService.getApiKey("gemini")} />
                );
            case 'code-archeologist':
                return <CodeArcheologistView apiKey={apiKeyService.getApiKey("gemini")} />;
            case 'integration':
                return (
                    <AIWrapper
                        title="Integration Assistant"
                        subtitle="Connect and Integrate with external APIs"
                        description="Leverage AI to connect and integrate with other services."
                        onRegenerate={() => {
                            // Example:  Re-trigger the current AI action.
                            // Possible implementation: Rerun a function that generates integrations.
                            alert("Regenerate Integration Logic Triggered (Not implemented)"); // Replace with proper action
                        }}
                    >
                       <MdOutlineIntegrationInstructions size={24} />  {/* Example Icon */}
                        <p>Use the integration tool to connect to external APIs and services.</p>
                       {/* Add Integration Components and Logic here.  This is a placeholder. */}
                    </AIWrapper>
                );

            default:
                return (
                    <p>Select a tool from the sidebar.</p>
                );
        }
    };


    if (!hasFeature(CODE_GENERATION_FEATURE_FLAG)) {
        return (
            <NoAccessContainer>
                <GiRobotGrab size={64} style={{ marginBottom: '1rem' }} />
                <NoAccessTitle>Feature Unavailable</NoAccessTitle>
                <NoAccessDescription>
                    This feature is not available in your current plan. Please upgrade to access the App Weaver.
                </NoAccessDescription>
                {/* You might also include a button to upgrade here */}
            </NoAccessContainer>
        );
    }

    return (
        <AppWeaverContainer>
            <Header>
                <HeaderTitle>App Weaver</HeaderTitle>
                <ActionsContainer>
                    <ActionButton onClick={() => setIsSettingsOpen(true)}>
                        <AiFillSetting /> Settings
                    </ActionButton>
                </ActionsContainer>
            </Header>

            <MainContent>
                <Sidebar>
                    <SidebarSection>
                        <SidebarSectionTitle>Tools</SidebarSectionTitle>
                        <SidebarItem onClick={() => setActiveTool('code-generator')}>
                            <AiOutlineCode /> Code Generator
                        </SidebarItem>
                        <SidebarItem onClick={() => setActiveTool('code-archeologist')}>
                            <GiRobotGrab /> Code Archeologist
                        </SidebarItem>
                         <SidebarItem onClick={() => setActiveTool('integration')}>
                            <MdOutlineIntegrationInstructions /> Integration Assistant
                        </SidebarItem>
                    </SidebarSection>
                </Sidebar>

                <ContentArea>
                    {renderContent()}
                </ContentArea>
            </MainContent>

            <AISettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </AppWeaverContainer>
    );
};

export default AppWeaverView;
```