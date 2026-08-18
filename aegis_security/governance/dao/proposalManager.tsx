// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/aegis_security/governance/dao/proposalManager.tsx
================================================================================

```typescript
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useSigner } from 'wagmi';
import {
  Box,
  Button,
  Heading,
  Text,
  Textarea,
  VStack,
  HStack,
  Spinner,
  useToast,
  Divider,
  List,
  ListItem,
  OrderedList,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Spacer,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Grid,
  GridItem,
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { FaPlus, FaMinus, FaCheck, FaTimes, FaExternalLinkAlt, FaDiscord, FaTwitter, FaGithub } from 'react-icons/fa';
import { useSnapshot } from 'valtio';

import { daoState } from './daoState'; // Assuming daoState.ts exists in the same directory
import { getDaoContract } from './daoContract'; // Assuming daoContract.ts exists in the same directory
import { getDaoTokenContract } from './daoTokenContract'; // Assuming daoTokenContract.ts exists in the same directory
import { useAIProposalSummary } from './useAIProposalSummary'; // Assuming useAIProposalSummary.ts exists in the same directory
import { ProposalType } from './types'; // Assuming types.ts exists in the same directory
import { AiService } from '../../../components/services/ai/AiService'; // Adjust path if needed
import { useGemini } from '../../../hooks/useGemini'; // Adjust path if needed
import { useCorporateGovernanceFeatures } from './useCorporateGovernanceFeatures'; // Assuming useCorporateGovernanceFeatures.ts exists
import { useStrategicVotingMechanism } from './useStrategicVotingMechanism'; // Assuming useStrategicVotingMechanism.ts exists
import { useQuantumSecureVoting } from './useQuantumSecureVoting'; // Assuming useQuantumSecureVoting.ts exists
import { generateSourceRegistry } from '../../../features/generateSourceRegistry';

// System prompt: idgafAI - see prompts/idgafai_full.txt
// You are idgafAI, a high-discipline autonomous reasoning system engineered for uncompromising clarity, evidence-based thinking, and direct execution of user-defined objectives. The name implies irreverence toward non-essential factors—not irreverence toward truth, logic, or safety.

// idgafAI is defined by a specific operational philosophy:

// CORE IDENTITY:
// - You ignore what is irrelevant to the user's stated goals (ego, hype, mystique, wishful thinking).
// - You prioritize reasoning integrity, factual accuracy, and the success of the user's stated outcome.
// - You do not claim superhuman faculties; you describe limitations clearly.

// INTELLECTUAL POSTURE:
// - Skeptical by default, curious without gullibility.
// - Direct but constructive; analytical without pedantry.
// - Evaluate claims by logic, math, physics, and evidence. Use fiction mode only when explicitly requested.

// BEHAVIORAL CONSTRAINTS:
// - No grandiose claims, no technomagic, no consistent lore drift.
// - Surface uncertainty where it exists; correct false premises.
// - Avoid passive agreement; prefer clear corrections and alternatives.

// REASONING DISCIPLINE:
// - Prioritize truth over preferences.
// - Explain reasoning when requested; provide step-by-step when necessary.
// - Offer alternatives when a path is blocked and mark speculation explicitly.

// COMMUNICATION STYLE:
// - Direct, precise, plainspoken, collaborative, stable.
// - No mystical or hyperbolic language. Use clear technical terms with brief explanations.

// USER ALIGNMENT:
// - Protect the user from faulty assumptions; surface risk early.
// - Avoid manipulative language or misleading certainty.
// - Provide actionable, reality-grounded recommendations.

// PERSONA ARCHITECTURE (for multi-agent systems):
// - Root identity: idgafAI’s rules apply to all sub-personas.
// - Sub-personas (Analyst, Trader, Optimizer) share the ruleset and differ only in output format and domain focus.

// SAFETY & ETHICS:
// - Never provide instructions that would enable illegal, harmful, or unsafe behavior.
// - Always clarify legal/ethical boundaries when relevant.
// - Safety and legality are non-negotiable constraints.

// PHILOSOPHY:
// - idgafAI is indifferent to distortion and loyal to truth.
// - Not nihilism — this is disciplined clarity and utility.

// When in doubt, prefer explicit, documented rationales and cite assumptions. If the user asks something beyond your capability, say so and propose verifiable alternatives or a clear plan for what information would enable a stronger answer.
const ProposalManager = () => {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const toast = useToast();
  const snap = useSnapshot(daoState);
  const [proposalText, setProposalText] = useState('');
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposals, setProposals] = useState<ProposalType[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [votingPower, setVotingPower] = useState<number>(0);
  const [selectedProposal, setSelectedProposal] = useState<ProposalType | null>(null);
  const [voteChoice, setVoteChoice] = useState<'FOR' | 'AGAINST' | null>(null);
  const [executeLoading, setExecuteLoading] = useState(false);
  const [debating, setDebating] = useState(false);
  const [debateTopic, setDebateTopic] = useState('');
  const [debateResults, setDebateResults] = useState<string | null>(null);
  const { isOpen: isDebateModalOpen, onOpen: onOpenDebateModal, onClose: onCloseDebateModal } = useDisclosure();
  const [activeTab, setActiveTab] = useState(0);

  const [targetAddress, setTargetAddress] = useState('');
  const [ethAmount, setEthAmount] = useState<number>(0);

  const [dynamicProposalFields, setDynamicProposalFields] = useState<{ [key: string]: string }>({});

  const {
    enableEnhancedGovernance,
    corporateCommandViewConfig,
    enableAiProposalSummarization,
  } = useCorporateGovernanceFeatures();

  const {
    enableStrategicVoting,
    votingWeightFactors,
    voteEscrowPeriod,
    enableLiquidDemocracy,
  } = useStrategicVotingMechanism();

  const {
    enableQuantumSecureVoting,
    thresholdKeyShares,
    distributedKeyGenCeremony,
  } = useQuantumSecureVoting();

  const { gemini } = useGemini(); // Hook to interact with Gemini AI

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDynamicProposalFields({ ...dynamicProposalFields, [name]: value });
  };

  // Fetch proposals, voting power on component mount
  useEffect(() => {
    if (isConnected && signer) {
      fetchProposals();
      fetchVotingPower();
    }
  }, [isConnected, signer]);

  const fetchProposals = async () => {
    if (!signer || !snap.daoContractAddress) return;

    try {
      setLoading(true);
      const daoContract = getDaoContract(snap.daoContractAddress, signer);
      const proposalCount = await daoContract.proposalCount();
      const fetchedProposals: ProposalType[] = [];

      for (let i = 1; i <= proposalCount.toNumber(); i++) {
        const proposal = await daoContract.proposals(i);
        const proposalDetails = {
          id: i,
          proposer: proposal.proposer,
          title: proposal.title,
          description: proposal.description,
          votesFor: proposal.votesFor.toNumber(),
          votesAgainst: proposal.votesAgainst.toNumber(),
          quorum: proposal.quorum.toNumber(),
          startTime: proposal.startTime.toNumber(),
          endTime: proposal.endTime.toNumber(),
          executed: proposal.executed,
        };
        fetchedProposals.push(proposalDetails);
      }

      setProposals(fetchedProposals);
    } catch (error: any) {
      console.error('Error fetching proposals:', error);
      toast({
        title: 'Error Fetching Proposals',
        description: error.message || 'Failed to fetch proposals.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVotingPower = async () => {
    if (!address || !signer || !snap.daoTokenAddress) return;

    try {
      const tokenContract = getDaoTokenContract(snap.daoTokenAddress, signer);
      const balance = await tokenContract.balanceOf(address);
      setVotingPower(balance.toNumber());
    } catch (error: any) {
      console.error('Error fetching voting power:', error);
      toast({
        title: 'Error Fetching Voting Power',
        description: error.message || 'Failed to fetch voting power.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const createProposal = async () => {
    if (!signer || !snap.daoContractAddress || !proposalText || !proposalTitle) {
      toast({
        title: 'Missing Information',
        description: 'Please ensure title and description are filled.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const daoContract = getDaoContract(snap.daoContractAddress, signer);
      const tx = await daoContract.createProposal(proposalTitle, proposalText);
      await tx.wait();
      toast({
        title: 'Proposal Created',
        description: 'Your proposal has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setProposalText('');
      setProposalTitle('');
      await fetchProposals(); // Refresh proposals after creation
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      toast({
        title: 'Error Creating Proposal',
        description: error.message || 'Failed to create proposal.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (proposalId: number, choice: 'FOR' | 'AGAINST') => {
    if (!signer || !snap.daoContractAddress) {
      toast({
        title: 'Not Connected',
        description: 'Please connect your wallet to vote.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const daoContract = getDaoContract(snap.daoContractAddress, signer);
      const vote = choice === 'FOR' ? 1 : 0; // 1 for 'FOR', 0 for 'AGAINST'
      const tx = await daoContract.castVote(proposalId, vote);
      await tx.wait();

      toast({
        title: 'Vote Cast',
        description: `Your vote has been cast ${choice === 'FOR' ? 'for' : 'against'} the proposal.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setSelectedProposal({
        ...selectedProposal!,
        votesFor: choice === 'FOR' ? selectedProposal!.votesFor + votingPower : selectedProposal!.votesFor,
        votesAgainst: choice === 'AGAINST' ? selectedProposal!.votesAgainst + votingPower : selectedProposal!.votesAgainst,
      });

      setVoteChoice(null);
      await fetchProposals(); // Refresh proposals after voting
    } catch (error: any) {
      console.error('Error casting vote:', error);
      toast({
        title: 'Error Casting Vote',
        description: error.message || 'Failed to cast vote.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const executeProposal = async (proposalId: number) => {
    if (!signer || !snap.daoContractAddress) {
      toast({
        title: 'Not Connected',
        description: 'Please connect your wallet to execute the proposal.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setExecuteLoading(true);
      const daoContract = getDaoContract(snap.daoContractAddress, signer);
      const tx = await daoContract.executeProposal(proposalId);
      await tx.wait();

      toast({
        title: 'Proposal Executed',
        description: 'The proposal has been successfully executed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      await fetchProposals(); // Refresh proposals after execution
    } catch (error: any) {
      console.error('Error executing proposal:', error);
      toast({
        title: 'Error Executing Proposal',
        description: error.message || 'Failed to execute proposal.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setExecuteLoading(false);
    }
  };

  const handleDebate = async () => {
    if (!gemini || !debateTopic) return;

    try {
      setDebating(true);
      const prompt = `Simulate a debate about the following topic: ${debateTopic}. Provide arguments both for and against the topic.`;
      const results = await gemini.generateContent(prompt);
      setDebateResults(results);
      onOpenDebateModal();
    } catch (error: any) {
      console.error('Error during debate:', error);
      toast({
        title: 'Error During Debate',
        description: error.message || 'Failed to simulate debate.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDebating(false);
    }
  };

  const handleAISummary = async () => {
    if (!gemini || !proposalText) {
      toast({
        title: 'Missing information',
        description: 'Please fill out the proposal text.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const prompt = `Summarize the following proposal text in a concise manner: ${proposalText}`;
      const results = await gemini.generateContent(prompt);
      setAiSummary(results);
    } catch (error: any) {
      console.error('Error generating AI summary:', error);
      toast({
        title: 'AI Summary Error',
        description: error.message || 'Failed to generate AI summary.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEth = async (proposalId: number, target: string, amount: number) => {
    if (!signer) {
      toast({
        title: 'Not Connected',
        description: 'Please connect your wallet.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const amountToSend = ethers.utils.parseEther(amount.toString());
      const tx = {
        to: target,
        value: amountToSend,
      };

      const transaction = await signer.sendTransaction(tx);
      await transaction.wait();

      toast({
        title: 'Transaction Sent',
        description: `Successfully sent ${amount} ETH to ${target}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      await executeProposal(proposalId);
      setTargetAddress('');
      setEthAmount(0);
    } catch (error: any) {
      console.error('Error sending ETH:', error);
      toast({
        title: 'Error Sending ETH',
        description: error.message || 'Failed to send ETH.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateCodeExecution = async (code: string) => {
    if (!gemini) {
      toast({
        title: 'AI not available',
        description: 'Please enable the AI feature.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const prompt = `Simulate the execution of the following code: ${code}. Explain the result of the execution.`;
      const results = await gemini.generateContent(prompt);
      toast({
        title: 'Code Execution Simulated',
        description: results || 'Successfully simulated code execution.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error simulating code execution:', error);
      toast({
        title: 'Error Simulating Code Execution',
        description: error.message || 'Failed to simulate code execution.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSourceRegistry = async () => {
    try {
      setLoading(true);
      const result = await generateSourceRegistry();
      toast({
        title: 'Source Registry Generated',
        description: 'Successfully generated the source registry.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      console.log(result);
    } catch (error: any) {
      console.error('Error generating source registry:', error);
      toast({
        title: 'Error Generating Source Registry',
        description: error.message || 'Failed to generate source registry.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5} boxShadow="md" borderRadius="md" bg="white">
      <Heading as="h2" size="lg" mb={4}>
        DAO Proposal Manager
      </Heading>

      <Tabs variant="soft-rounded" colorScheme="green" onChange={(index) => setActiveTab(index)}>
        <TabList>
          <Tab>Create Proposal</Tab>
          <Tab>View Proposals</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <FormControl>
                <FormLabel>Proposal Title</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter proposal title"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Proposal Description</FormLabel>
                <Textarea
                  placeholder="Enter proposal description"
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  rows={5}
                />
              </FormControl>

              {enableAiProposalSummarization && (
                <HStack>
                  <Button colorScheme="blue" size="sm" isLoading={loading} onClick={handleAISummary}>
                    Generate AI Summary
                  </Button>
                  {aiSummary && (
                    <Text fontSize="sm" color="gray.600">
                      AI Summary: {aiSummary}
                    </Text>
                  )}
                </HStack>
              )}

              <Button colorScheme="green" isLoading={loading} onClick={createProposal}>
                Create Proposal
              </Button>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <Heading as="h3" size="md">
                Current Proposals
              </Heading>
              {loading ? (
                <Center>
                  <Spinner size="xl" />
                </Center>
              ) : proposals.length > 0 ? (
                <List spacing={3}>
                  {proposals.map((proposal) => (
                    <ListItem
                      key={proposal.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor="gray.200"
                      _hover={{
                        bg: 'gray.50',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <HStack align="start">
                        <Heading as="h4" size="sm">
                          {proposal.title}
                        </Heading>
                        <Spacer />
                        <Text fontSize="sm" color="gray.600">
                          ID: {proposal.id}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Proposer: {proposal.proposer}
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        Description: {proposal.description.substring(0, 100)}...
                      </Text>
                      <HStack mt={2}>
                        <Tag size="sm" colorScheme="green" borderRadius="full">
                          <TagLabel>For: {proposal.votesFor}</TagLabel>
                        </Tag>
                        <Tag size="sm" colorScheme="red" borderRadius="full">
                          <TagLabel>Against: {proposal.votesAgainst}</TagLabel>
                        </Tag>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text>No proposals available.</Text>
              )}

              {selectedProposal && (
                <Modal isOpen={!!selectedProposal} onClose={() => setSelectedProposal(null)} size="xl">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Proposal Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <VStack align="stretch" spacing={4}>
                        <Heading as="h4" size="md">
                          {selectedProposal.title}
                        </Heading>
                        <Text>Proposer: {selectedProposal.proposer}</Text>
                        <Text>Description: {selectedProposal.description}</Text>
                        <Divider />
                        <HStack>
                          <Text>Votes For: {selectedProposal.votesFor}</Text>
                          <Text>Votes Against: {selectedProposal.votesAgainst}</Text>
                          <Text>Quorum: {selectedProposal.quorum}</Text>
                        </HStack>
                        <HStack>
                          <Text>Start Time: {new Date(selectedProposal.startTime * 1000).toLocaleString()}</Text>
                          <Text>End Time: {new Date(selectedProposal.endTime * 1000).toLocaleString()}</Text>
                        </HStack>
                        <Text>Executed: {selectedProposal.executed ? 'Yes' : 'No'}</Text>

                        <Divider />
                        <Text>Your Voting Power: {votingPower}</Text>
                        {
                          !selectedProposal.executed && (
                            <HStack>
                              <Button
                                colorScheme="green"
                                onClick={() => castVote(selectedProposal.id, 'FOR')}
                                isDisabled={voteChoice !== null}
                                isLoading={loading}
                              >
                                Vote For
                              </Button>
                              <Button
                                colorScheme="red"
                                onClick={() => castVote(selectedProposal.id, 'AGAINST')}
                                isDisabled={voteChoice !== null}
                                isLoading={loading}
                              >
                                Vote Against
                              </Button>
                            </HStack>
                          )
                        }

                        {
                          !selectedProposal.executed && (
                            <VStack align="start">
                              <Text fontWeight="bold">Execute Proposal:</Text>
                              <HStack>
                                <Button
                                  colorScheme="purple"
                                  onClick={() => executeProposal(selectedProposal.id)}
                                  isLoading={executeLoading}
                                  isDisabled={!selectedProposal.executed}
                                >
                                  Execute
                                </Button>
                              </HStack>
                            </VStack>
                          )
                        }
                        <VStack align="start">
                          <Text fontWeight="bold">Simulate Debate:</Text>
                          <Textarea
                            placeholder="Enter debate topic"
                            value={debateTopic}
                            onChange={(e) => setDebateTopic(e.target.value)}
                            rows={3}
                          />
                          <Button colorScheme="teal" onClick={handleDebate} isLoading={debating}>
                            Start Debate
                          </Button>
                        </VStack>
                        <VStack align="start">
                          <Text fontWeight="bold">Send ETH to Address:</Text>
                          <FormControl>
                            <FormLabel>Target Address</FormLabel>
                            <Input
                              type="text"
                              placeholder="Enter target address"
                              value={targetAddress}
                              onChange={(e) => setTargetAddress(e.target.value)}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Amount (ETH)</FormLabel>
                            <NumberInput
                              precision={18}
                              step={0.1}
                              value={ethAmount}
                              onChange={(valueString) => setEthAmount(Number(valueString))}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                          <Button
                            colorScheme="blue"
                            onClick={() => handleSendEth(selectedProposal.id, targetAddress, ethAmount)}
                            isLoading={loading}
                          >
                            Send ETH
                          </Button>
                        </VStack>
                        <VStack align="start">
                          <Text fontWeight="bold">Simulate Code Execution:</Text>
                          <Textarea
                            placeholder="Enter code to simulate"
                            onChange={(e) => setProposalText(e.target.value)}
                            rows={3}
                          />
                          <Button colorScheme="orange" onClick={() => handleSimulateCodeExecution(proposalText)} isLoading={loading}>
                            Simulate Code
                          </Button>
                        </VStack>
                      </VStack>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={() => setSelectedProposal(null)}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              )}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <Heading as="h3" size="md">
                Settings
              </Heading>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Corporate Governance Features:</Text>
                <CheckboxGroup>
                  <Checkbox value="enhancedGovernance">Enable Enhanced Governance</Checkbox>
                  <Checkbox value="aiProposalSummarization">Enable AI Proposal Summarization</Checkbox>
                </CheckboxGroup>
              </VStack>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Strategic Voting Mechanism:</Text>
                <CheckboxGroup>
                  <Checkbox value="strategicVoting">Enable Strategic Voting</Checkbox>
                  <Checkbox value="liquidDemocracy">Enable Liquid Democracy</Checkbox>
                </CheckboxGroup>
              </VStack>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Quantum Secure Voting:</Text>
                <CheckboxGroup>
                  <Checkbox value="quantumSecureVoting">Enable Quantum Secure Voting</Checkbox>
                </CheckboxGroup>
              </VStack>
              <Button colorScheme="yellow" onClick={handleGenerateSourceRegistry} isLoading={loading}>
                Generate Source Registry
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isDebateModalOpen} onClose={onCloseDebateModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Debate Results</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {debating ? (
              <Center>
                <Spinner size="xl" />
              </Center>
            ) : debateResults ? (
              <Text whiteSpace="pre-line">{debateResults}</Text>
            ) : (
              <Text>No debate results available.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseDebateModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProposalManager;
```