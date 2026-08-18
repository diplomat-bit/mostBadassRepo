// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/AutomatedSweepRules (1).tsx
================================================================================

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberInputStepperProps,
  Switch,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { Plus as AddIcon, Trash2 as DeleteIcon } from 'lucide-react';

// Define TypeScript types based on the ISO 20022 schema structure, focusing on relevant codes for sweep rules
// These are placeholders derived from the available External codes, assuming some relate to 'Purpose' or 'BalanceType'

type SweepRule = {
  id: number;
  purposeCode: string; // Corresponds to ExternalPurpose1Code (e.g., ZABA, SWEP, TOPG)
  balanceTypeCode: string; // Corresponds to ExternalBalanceType1Code or ExternalSystemBalanceType1Code
  threshold: number;
  currency: string;
  isActive: boolean;
};

// Mock data and code lists derived/inferred from the schema for UI
const MOCK_PURPOSE_CODES = [
  { value: 'ZABA', label: 'Zero Balance Account (ZABA)' },
  { value: 'SWEP', label: 'Sweep (SWEP)' },
  { value: 'TOPG', label: 'Top Up (TOPG)' },
  { value: 'CASH', label: 'Cash Management (CASH)' },
];

const MOCK_BALANCE_TYPE_CODES = [
  { value: 'CLAV', label: 'Closing Available Balance (CLAV)' },
  { value: 'OPAV', label: 'Opening Available Balance (OPAV)' },
  { value: 'ITAV', label: 'Interim Available Balance (ITAV)' },
];

const MOCK_INITIAL_RULES: SweepRule[] = [
  {
    id: 1,
    purposeCode: 'SWEP',
    balanceTypeCode: 'CLAV',
    threshold: 10000,
    currency: 'EUR',
    isActive: true,
  },
  {
    id: 2,
    purposeCode: 'TOPG',
    balanceTypeCode: 'OPAV',
    threshold: 50000,
    currency: 'USD',
    isActive: false,
  },
];

const AutomatedSweepRules: React.FC = () => {
  const [rules, setRules] = useState<SweepRule[]>(MOCK_INITIAL_RULES);
  const [newRule, setNewRule] = useState<Omit<SweepRule, 'id' | 'isActive'>>({
    purposeCode: MOCK_PURPOSE_CODES[0].value,
    balanceTypeCode: MOCK_BALANCE_TYPE_CODES[0].value,
    threshold: 0,
    currency: 'EUR',
  });
  const [isNewRuleActive, setIsNewRuleActive] = useState(true);

  const toast = useToast();
  const nextId = useMemo(() => rules.reduce((max, rule) => Math.max(max, rule.id), 0) + 1, [rules]);

  const handleNewRuleChange = useCallback((key: keyof typeof newRule, value: any) => {
    setNewRule((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAddRule = useCallback(() => {
    if (newRule.threshold <= 0) {
      toast({
        title: 'Invalid Threshold',
        description: 'Threshold must be greater than zero.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const ruleToAdd: SweepRule = {
      ...newRule,
      id: nextId,
      isActive: isNewRuleActive,
    };

    setRules((prevRules) => [...prevRules, ruleToAdd]);
    toast({
      title: 'Rule Added',
      description: `Sweep rule for ${ruleToAdd.purposeCode} added successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    // Reset new rule state (keeping currency for convenience)
    setNewRule((prev) => ({ ...prev, threshold: 0, balanceTypeCode: MOCK_BALANCE_TYPE_CODES[0].value }));
  }, [newRule, nextId, isNewRuleActive, toast]);

  const handleDeleteRule = useCallback((id: number) => {
    setRules((prevRules) => prevRules.filter((rule) => rule.id !== id));
    toast({
      title: 'Rule Deleted',
      description: `Sweep rule ID ${id} has been removed.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  const handleToggleActive = useCallback((id: number) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
    toast({
        title: 'Rule Updated',
        description: `Rule ID ${id} active status toggled.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
    });
  }, [toast]);

  const renderRuleRow = (rule: SweepRule) => (
    <Tr key={rule.id} opacity={rule.isActive ? 1 : 0.5}>
      <Td>{rule.id}</Td>
      <Td>{rule.purposeCode}</Td>
      <Td>{rule.balanceTypeCode}</Td>
      <Td>{rule.currency}</Td>
      <Td isNumeric>{rule.threshold.toLocaleString()}</Td>
      <Td>
        <Switch
          isChecked={rule.isActive}
          onChange={() => handleToggleActive(rule.id)}
          colorScheme="green"
        />
      </Td>
      <Td>
        <IconButton
          aria-label="Delete rule"
          icon={<DeleteIcon size={16} />}
          size="sm"
          colorScheme="red"
          onClick={() => handleDeleteRule(rule.id)}
        />
      </Td>
    </Tr>
  );

  const renderNewRuleForm = () => (
    <VStack spacing={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
      <Text fontSize="lg" fontWeight="bold">Add New Sweep Rule</Text>
      <HStack w="100%" spacing={4}>
        <FormControl id="new-purpose" isRequired>
          <FormLabel>Purpose</FormLabel>
          <Select
            value={newRule.purposeCode}
            onChange={(e) => handleNewRuleChange('purposeCode', e.target.value)}
          >
            {MOCK_PURPOSE_CODES.map(code => (
              <option key={code.value} value={code.value}>{code.label}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="new-balance-type" isRequired>
          <FormLabel>Balance Type</FormLabel>
          <Select
            value={newRule.balanceTypeCode}
            onChange={(e) => handleNewRuleChange('balanceTypeCode', e.target.value)}
          >
            {MOCK_BALANCE_TYPE_CODES.map(code => (
              <option key={code.value} value={code.value}>{code.label}</option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <HStack w="100%" spacing={4}>
        <FormControl id="new-threshold" isRequired>
          <FormLabel>Threshold Amount</FormLabel>
          <NumberInput
            value={newRule.threshold}
            onChange={(value) => handleNewRuleChange('threshold', parseFloat(value) || 0)}
            min={0}
            precision={2}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl id="new-currency" isRequired>
          <FormLabel>Currency</FormLabel>
          <Input
            value={newRule.currency}
            onChange={(e) => handleNewRuleChange('currency', e.target.value.toUpperCase())}
            maxLength={3}
          />
        </FormControl>
      </HStack>

      <HStack w="100%" justifyContent="space-between" pt={2}>
        <FormControl display="flex" alignItems="center" w="auto">
          <FormLabel htmlFor="new-active-switch" mb="0">Active?</FormLabel>
          <Switch
            id="new-active-switch"
            isChecked={isNewRuleActive}
            onChange={() => setIsNewRuleActive((prev) => !prev)}
            colorScheme="green"
          />
        </FormControl>
        <Button
          leftIcon={<AddIcon size={16} />}
          colorScheme="blue"
          onClick={handleAddRule}
        >
          Add Rule
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <Box p={8} maxW="5xl" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>Automated Sweep Rules Configuration</Text>

      {/* New Rule Entry */}
      {renderNewRuleForm()}

      <VStack spacing={4} mt={8} align="stretch">
        <Text fontSize="xl" fontWeight="semibold">Configured Sweep Rules</Text>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr bg="gray.100">
                <Th>ID</Th>
                <Th>Purpose Code (ExternalPurpose1Code)</Th>
                <Th>Balance Type (ExternalBalanceType1Code)</Th>
                <Th>Currency</Th>
                <Th isNumeric>Threshold Amount</Th>
                <Th>Active</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rules.length > 0 ? (
                rules.map(renderRuleRow)
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center" color="gray.500">
                    No sweep rules configured yet.
                  </Td>
                </Tr>
              )}
            </Tbody>
            <Tfoot>
                {/* Optional: Summary Tfoot */}
            </Tfoot>
          </Table>
        </Box>
      </VStack>

      <Flex justifyContent="flex-end" mt={6}>
        <Button colorScheme="green" size="lg">
          Save Configuration
        </Button>
      </Flex>
    </Box>
  );
};

export default AutomatedSweepRules;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/AutomatedSweepRules (2).tsx
================================================================================

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  IconButton,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Heading,
  Grid,
  GridItem,
  SimpleGrid,
  Container,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Stack,
  Center,
  Square,
  Circle,
  Image,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Progress,
  Spinner,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  AspectRatio,
  Tag,
  TagLabel,
  TagCloseButton,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  useBreakpointValue,
  ButtonGroup,
  Link,
} from '@chakra-ui/react';
import { CheckIcon, WarningTwoIcon, AddIcon, DeleteIcon, EditIcon, InfoIcon, ExternalLinkIcon, QuestionIcon } from '@chakra-ui/icons';

// The James Burvel O'Callaghan III Code - Automated Sweep Rules Component

// A. Company Definition
const CompanyA = {
  name: "JBO3 Financial Solutions",
  description: "Providing cutting-edge automated financial solutions for businesses worldwide.",
  domain: "jbo3financial.com",
  services: ["Automated Sweep Rules", "Intelligent Cash Management", "Risk Assessment"],
  headquarters: "New York, NY"
};

// B. Type Definitions
type SweepRuleB = {
  id: number;
  purposeCode: string;
  balanceTypeCode: string;
  threshold: number;
  currency: string;
  isActive: boolean;
  company: string;
  description: string;
  lastUpdated: string;
  createdBy: string;
};

// C. Mock Data
const MOCK_PURPOSE_CODES_C = [
  { value: 'ZABA', label: 'Zero Balance Account (ZABA)' },
  { value: 'SWEP', label: 'Sweep (SWEP)' },
  { value: 'TOPG', label: 'Top Up (TOPG)' },
  { value: 'CASH', label: 'Cash Management (CASH)' },
  { value: 'INV', label: 'Investment (INV)' },
  { value: 'LOAN', label: 'Loan Payment (LOAN)' },
  { value: 'TAX', label: 'Tax Payment (TAX)' },
  { value: 'DIV', label: 'Dividend Distribution (DIV)' },
  { value: 'EXP', label: 'Expense Management (EXP)' },
  { value: 'WAGE', label: 'Wage Payment (WAGE)' },
];

const MOCK_BALANCE_TYPE_CODES_C = [
  { value: 'CLAV', label: 'Closing Available Balance (CLAV)' },
  { value: 'OPAV', label: 'Opening Available Balance (OPAV)' },
  { value: 'ITAV', label: 'Interim Available Balance (ITAV)' },
  { value: 'BOOK', label: 'Book Balance (BOOK)' },
  { value: 'COLL', label: 'Collected Balance (COLL)' },
  { value: 'LEDG', label: 'Ledger Balance (LEDG)' },
  { value: 'AVAIL', label: 'Available Balance (AVAIL)' },
  { value: 'FLOAT', label: 'Float Balance (FLOAT)' },
  { value: 'TODAY', label: 'Today\'s Balance (TODAY)' },
  { value: 'PROJECTED', label: 'Projected Balance (PROJECTED)' },
];

const MOCK_INITIAL_RULES_C: SweepRuleB[] = [
  { id: 1, purposeCode: 'SWEP', balanceTypeCode: 'CLAV', threshold: 10000, currency: 'EUR', isActive: true, company: "JBO3 Financial Solutions", description: "Automatically sweeps excess funds to a central account.", lastUpdated: "2024-01-01", createdBy: "System" },
  { id: 2, purposeCode: 'TOPG', balanceTypeCode: 'OPAV', threshold: 50000, currency: 'USD', isActive: false, company: "JBO3 Financial Solutions", description: "Tops up account balance from a reserve fund.", lastUpdated: "2024-01-05", createdBy: "User1" },
  { id: 3, purposeCode: 'CASH', balanceTypeCode: 'ITAV', threshold: 25000, currency: 'GBP', isActive: true, company: "JBO3 Financial Solutions", description: "Manages cash flow by transferring funds.", lastUpdated: "2024-01-10", createdBy: "System" },
  { id: 4, purposeCode: 'INV', balanceTypeCode: 'CLAV', threshold: 75000, currency: 'JPY', isActive: false, company: "JBO3 Financial Solutions", description: "Invests surplus funds in short-term securities.", lastUpdated: "2024-01-15", createdBy: "User2" },
  { id: 5, purposeCode: 'LOAN', balanceTypeCode: 'OPAV', threshold: 100000, currency: 'CAD', isActive: true, company: "JBO3 Financial Solutions", description: "Automatically pays loan installments.", lastUpdated: "2024-01-20", createdBy: "System" },
];

// D. Utility Functions
const formatCurrencyD = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

const formatDateD = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// E. AutomatedSweepRules Component
const AutomatedSweepRules: React.FC = () => {
  const [rules, setRules] = useState<SweepRuleB[]>(MOCK_INITIAL_RULES_C);
  const [newRule, setNewRule] = useState<Omit<SweepRuleB, 'id' | 'isActive' | 'company' | 'description' | 'lastUpdated' | 'createdBy'>>({
    purposeCode: MOCK_PURPOSE_CODES_C[0].value,
    balanceTypeCode: MOCK_BALANCE_TYPE_CODES_C[0].value,
    threshold: 0,
    currency: 'USD',
  });
  const [isNewRuleActive, setIsNewRuleActive] = useState(true);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [selectedRuleDescription, setSelectedRuleDescription] = useState('');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const nextId = useMemo(() => rules.reduce((max, r) => Math.max(max, r.id), 0) + 1, [rules]);

  const handleNewRuleChange = useCallback((key: keyof typeof newRule, value: any) => {
    setNewRule(prev => ({ ...prev, [key]: value }));
  }, []);

    const handleOpenDescriptionModal = useCallback((description: string) => {
        setSelectedRuleDescription(description);
        setIsDescriptionModalOpen(true);
    }, []);

    const handleCloseDescriptionModal = useCallback(() => {
        setIsDescriptionModalOpen(false);
        setSelectedRuleDescription('');
    }, []);

  const handleAddRule = useCallback(() => {
    if (newRule.threshold <= 0) {
      toast({
        title: 'Invalid Threshold',
        description: 'Threshold must be greater than zero.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const ruleToAdd: SweepRuleB = {
      ...newRule,
      id: nextId,
      isActive: isNewRuleActive,
      company: CompanyA.name,
      description: `Automated rule created on ${new Date().toLocaleDateString()} for ${newRule.purposeCode}.`,
      lastUpdated: new Date().toISOString(),
      createdBy: "User",
    };

    setRules(prev => [...prev, ruleToAdd]);
    toast({
      title: 'Sweep Rule Added',
      description: `Rule ID ${nextId} added successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setNewRule({
      purposeCode: MOCK_PURPOSE_CODES_C[0].value,
      balanceTypeCode: MOCK_BALANCE_TYPE_CODES_C[0].value,
      threshold: 0,
      currency: 'USD',
    });
    setIsNewRuleActive(true);
  }, [newRule, nextId, isNewRuleActive, toast]);

  const handleDeleteRule = useCallback((id: number) => {
    setRules(prev => prev.filter(r => r.id !== id));
    toast({
      title: 'Sweep Rule Deleted',
      description: `Rule ID ${id} deleted successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  const handleToggleActive = useCallback((id: number) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive, lastUpdated: new Date().toISOString() } : r));
    toast({
      title: 'Sweep Rule Updated',
      description: `Rule ID ${id} activity toggled.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

    const handleShowDetails = useCallback((rule: SweepRuleB) => {
        setSelectedRuleDescription(rule.description);
        onOpen();
    }, [onOpen]);

    const renderRuleRow = (rule: SweepRuleB) => (
        <Tr key={rule.id} opacity={rule.isActive ? 1 : 0.5}>
            <Td>{rule.id}</Td>
            <Td>{rule.purposeCode}</Td>
            <Td>{rule.balanceTypeCode}</Td>
            <Td>{rule.currency}</Td>
            <Td isNumeric>{formatCurrencyD(rule.threshold, rule.currency)}</Td>
            <Td>{formatDateD(rule.lastUpdated)}</Td>
            <Td>
                <Switch
                    isChecked={rule.isActive}
                    onChange={() => handleToggleActive(rule.id)}
                    colorScheme="green"
                />
            </Td>
            <Td>
                <ButtonGroup spacing="2">
                    <IconButton
                        aria-label="Details"
                        icon={<InfoIcon />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleShowDetails(rule)}
                    />
                    <IconButton
                        aria-label="Delete rule"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteRule(rule.id)}
                    />
                </ButtonGroup>
            </Td>
        </Tr>
    );

  const A_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a = () => console.log('A function with over 1000 chars');
  const B_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_b_

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/AutomatedSweepRules (1).tsx
================================================================================

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberInputStepperProps,
  Switch,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { Plus as AddIcon, Trash2 as DeleteIcon } from 'lucide-react';

// Define TypeScript types based on the ISO 20022 schema structure, focusing on relevant codes for sweep rules
// These are placeholders derived from the available External codes, assuming some relate to 'Purpose' or 'BalanceType'

type SweepRule = {
  id: number;
  purposeCode: string; // Corresponds to ExternalPurpose1Code (e.g., ZABA, SWEP, TOPG)
  balanceTypeCode: string; // Corresponds to ExternalBalanceType1Code or ExternalSystemBalanceType1Code
  threshold: number;
  currency: string;
  isActive: boolean;
};

// Mock data and code lists derived/inferred from the schema for UI
const MOCK_PURPOSE_CODES = [
  { value: 'ZABA', label: 'Zero Balance Account (ZABA)' },
  { value: 'SWEP', label: 'Sweep (SWEP)' },
  { value: 'TOPG', label: 'Top Up (TOPG)' },
  { value: 'CASH', label: 'Cash Management (CASH)' },
];

const MOCK_BALANCE_TYPE_CODES = [
  { value: 'CLAV', label: 'Closing Available Balance (CLAV)' },
  { value: 'OPAV', label: 'Opening Available Balance (OPAV)' },
  { value: 'ITAV', label: 'Interim Available Balance (ITAV)' },
];

const MOCK_INITIAL_RULES: SweepRule[] = [
  {
    id: 1,
    purposeCode: 'SWEP',
    balanceTypeCode: 'CLAV',
    threshold: 10000,
    currency: 'EUR',
    isActive: true,
  },
  {
    id: 2,
    purposeCode: 'TOPG',
    balanceTypeCode: 'OPAV',
    threshold: 50000,
    currency: 'USD',
    isActive: false,
  },
];

const AutomatedSweepRules: React.FC = () => {
  const [rules, setRules] = useState<SweepRule[]>(MOCK_INITIAL_RULES);
  const [newRule, setNewRule] = useState<Omit<SweepRule, 'id' | 'isActive'>>({
    purposeCode: MOCK_PURPOSE_CODES[0].value,
    balanceTypeCode: MOCK_BALANCE_TYPE_CODES[0].value,
    threshold: 0,
    currency: 'EUR',
  });
  const [isNewRuleActive, setIsNewRuleActive] = useState(true);

  const toast = useToast();
  const nextId = useMemo(() => rules.reduce((max, rule) => Math.max(max, rule.id), 0) + 1, [rules]);

  const handleNewRuleChange = useCallback((key: keyof typeof newRule, value: any) => {
    setNewRule((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAddRule = useCallback(() => {
    if (newRule.threshold <= 0) {
      toast({
        title: 'Invalid Threshold',
        description: 'Threshold must be greater than zero.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const ruleToAdd: SweepRule = {
      ...newRule,
      id: nextId,
      isActive: isNewRuleActive,
    };

    setRules((prevRules) => [...prevRules, ruleToAdd]);
    toast({
      title: 'Rule Added',
      description: `Sweep rule for ${ruleToAdd.purposeCode} added successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    // Reset new rule state (keeping currency for convenience)
    setNewRule((prev) => ({ ...prev, threshold: 0, balanceTypeCode: MOCK_BALANCE_TYPE_CODES[0].value }));
  }, [newRule, nextId, isNewRuleActive, toast]);

  const handleDeleteRule = useCallback((id: number) => {
    setRules((prevRules) => prevRules.filter((rule) => rule.id !== id));
    toast({
      title: 'Rule Deleted',
      description: `Sweep rule ID ${id} has been removed.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  const handleToggleActive = useCallback((id: number) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
    toast({
        title: 'Rule Updated',
        description: `Rule ID ${id} active status toggled.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
    });
  }, [toast]);

  const renderRuleRow = (rule: SweepRule) => (
    <Tr key={rule.id} opacity={rule.isActive ? 1 : 0.5}>
      <Td>{rule.id}</Td>
      <Td>{rule.purposeCode}</Td>
      <Td>{rule.balanceTypeCode}</Td>
      <Td>{rule.currency}</Td>
      <Td isNumeric>{rule.threshold.toLocaleString()}</Td>
      <Td>
        <Switch
          isChecked={rule.isActive}
          onChange={() => handleToggleActive(rule.id)}
          colorScheme="green"
        />
      </Td>
      <Td>
        <IconButton
          aria-label="Delete rule"
          icon={<DeleteIcon size={16} />}
          size="sm"
          colorScheme="red"
          onClick={() => handleDeleteRule(rule.id)}
        />
      </Td>
    </Tr>
  );

  const renderNewRuleForm = () => (
    <VStack spacing={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
      <Text fontSize="lg" fontWeight="bold">Add New Sweep Rule</Text>
      <HStack w="100%" spacing={4}>
        <FormControl id="new-purpose" isRequired>
          <FormLabel>Purpose</FormLabel>
          <Select
            value={newRule.purposeCode}
            onChange={(e) => handleNewRuleChange('purposeCode', e.target.value)}
          >
            {MOCK_PURPOSE_CODES.map(code => (
              <option key={code.value} value={code.value}>{code.label}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="new-balance-type" isRequired>
          <FormLabel>Balance Type</FormLabel>
          <Select
            value={newRule.balanceTypeCode}
            onChange={(e) => handleNewRuleChange('balanceTypeCode', e.target.value)}
          >
            {MOCK_BALANCE_TYPE_CODES.map(code => (
              <option key={code.value} value={code.value}>{code.label}</option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <HStack w="100%" spacing={4}>
        <FormControl id="new-threshold" isRequired>
          <FormLabel>Threshold Amount</FormLabel>
          <NumberInput
            value={newRule.threshold}
            onChange={(value) => handleNewRuleChange('threshold', parseFloat(value) || 0)}
            min={0}
            precision={2}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl id="new-currency" isRequired>
          <FormLabel>Currency</FormLabel>
          <Input
            value={newRule.currency}
            onChange={(e) => handleNewRuleChange('currency', e.target.value.toUpperCase())}
            maxLength={3}
          />
        </FormControl>
      </HStack>

      <HStack w="100%" justifyContent="space-between" pt={2}>
        <FormControl display="flex" alignItems="center" w="auto">
          <FormLabel htmlFor="new-active-switch" mb="0">Active?</FormLabel>
          <Switch
            id="new-active-switch"
            isChecked={isNewRuleActive}
            onChange={() => setIsNewRuleActive((prev) => !prev)}
            colorScheme="green"
          />
        </FormControl>
        <Button
          leftIcon={<AddIcon size={16} />}
          colorScheme="blue"
          onClick={handleAddRule}
        >
          Add Rule
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <Box p={8} maxW="5xl" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>Automated Sweep Rules Configuration</Text>

      {/* New Rule Entry */}
      {renderNewRuleForm()}

      <VStack spacing={4} mt={8} align="stretch">
        <Text fontSize="xl" fontWeight="semibold">Configured Sweep Rules</Text>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr bg="gray.100">
                <Th>ID</Th>
                <Th>Purpose Code (ExternalPurpose1Code)</Th>
                <Th>Balance Type (ExternalBalanceType1Code)</Th>
                <Th>Currency</Th>
                <Th isNumeric>Threshold Amount</Th>
                <Th>Active</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rules.length > 0 ? (
                rules.map(renderRuleRow)
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center" color="gray.500">
                    No sweep rules configured yet.
                  </Td>
                </Tr>
              )}
            </Tbody>
            <Tfoot>
                {/* Optional: Summary Tfoot */}
            </Tfoot>
          </Table>
        </Box>
      </VStack>

      <Flex justifyContent="flex-end" mt={6}>
        <Button colorScheme="green" size="lg">
          Save Configuration
        </Button>
      </Flex>
    </Box>
  );
};

export default AutomatedSweepRules;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/AutomatedSweepRules_1.tsx
================================================================================

import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { RefreshCw, Play, Settings2, ShieldCheck, Zap, Trash2 } from 'lucide-react';

const AutomatedSweepRules: React.FC = () => {
  const context = useContext(DataContext);
  const [isRunning, setIsRunning] = useState(false);

  const mockRules = [
    { id: '1', name: 'Liquidity Anchor', target: 'Capital Savings', threshold: 50000, status: 'ACTIVE', lastRun: '2h ago' },
    { id: '2', name: 'Opex Buffer', target: 'Elite Checking', threshold: 12000, status: 'STANDBY', lastRun: '1d ago' },
    { id: '3', name: 'Tax Reserve Sweep', target: 'Tax Vault', threshold: 0, status: 'ACTIVE', lastRun: '6h ago' }
  ];

  const handleRunManual = () => {
    setIsRunning(true);
    setTimeout(() => {
        setIsRunning(false);
        context?.showNotification("Sweep sequence completed. Capital optimized.", "success");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card title="System Sweep Protocol" headerActions={[
          { id: 'add', icon: <Settings2 />, label: 'Add Rule', onClick: () => {} }
      ]}>
        <div className="space-y-4 pt-2">
            <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mb-6">
                Deterministic capital routing. Rules automatically shift surplus liquidity between nodes based on your defined thresholds. 
                <span className="text-cyan-400 font-bold ml-1">Z-Zero balance logic enabled.</span>
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono">
                    <thead className="text-[10px] text-gray-600 uppercase tracking-widest border-b border-gray-800">
                        <tr>
                            <th className="pb-4">Logic Designation</th>
                            <th className="pb-4">Target Node</th>
                            <th className="pb-4">Trigger Limit</th>
                            <th className="pb-4">Status</th>
                            <th className="pb-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {mockRules.map(rule => (
                            <tr key={rule.id} className="group hover:bg-white/5 transition-colors">
                                <td className="py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                                        <span className="text-sm font-bold text-white">{rule.name}</span>
                                    </div>
                                </td>
                                <td className="py-5 text-xs text-gray-400">{rule.target}</td>
                                <td className="py-5 text-sm text-white font-black">${rule.threshold.toLocaleString()}</td>
                                <td className="py-5">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${
                                        rule.status === 'ACTIVE' ? 'border-green-500/30 text-green-400 bg-green-500/5' : 'border-gray-700 text-gray-500'
                                    }`}>{rule.status}</span>
                                </td>
                                <td className="py-5 text-right">
                                    <button className="p-2 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-cyan-400" size={18} />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">All sweep events are signed by the Sovereign HSM.</span>
                </div>
                <button 
                    onClick={handleRunManual}
                    disabled={isRunning}
                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 uppercase tracking-widest text-xs"
                >
                    {isRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                    Initialize Manual Re-balance
                </button>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default AutomatedSweepRules;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/AutomatedSweepRules (1).tsx
================================================================================

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberInputStepperProps,
  Switch,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { Plus as AddIcon, Trash2 as DeleteIcon } from 'lucide-react';

// Define TypeScript types based on the ISO 20022 schema structure, focusing on relevant codes for sweep rules
// These are placeholders derived from the available External codes, assuming some relate to 'Purpose' or 'BalanceType'

type SweepRule = {
  id: number;
  purposeCode: string; // Corresponds to ExternalPurpose1Code (e.g., ZABA, SWEP, TOPG)
  balanceTypeCode: string; // Corresponds to ExternalBalanceType1Code or ExternalSystemBalanceType1Code
  threshold: number;
  currency: string;
  isActive: boolean;
};

// Mock data and code lists derived/inferred from the schema for UI
const MOCK_PURPOSE_CODES = [
  { value: 'ZABA', label: 'Zero Balance Account (ZABA)' },
  { value: 'SWEP', label: 'Sweep (SWEP)' },
  { value: 'TOPG', label: 'Top Up (TOPG)' },
  { value: 'CASH', label: 'Cash Management (CASH)' },
];

const MOCK_BALANCE_TYPE_CODES = [
  { value: 'CLAV', label: 'Closing Available Balance (CLAV)' },
  { value: 'OPAV', label: 'Opening Available Balance (OPAV)' },
  { value: 'ITAV', label: 'Interim Available Balance (ITAV)' },
];

const MOCK_INITIAL_RULES: SweepRule[] = [
  {
    id: 1,
    purposeCode: 'SWEP',
    balanceTypeCode: 'CLAV',
    threshold: 10000,
    currency: 'EUR',
    isActive: true,
  },
  {
    id: 2,
    purposeCode: 'TOPG',
    balanceTypeCode: 'OPAV',
    threshold: 50000,
    currency: 'USD',
    isActive: false,
  },
];

const AutomatedSweepRules: React.FC = () => {
  const [rules, setRules] = useState<SweepRule[]>(MOCK_INITIAL_RULES);
  const [newRule, setNewRule] = useState<Omit<SweepRule, 'id' | 'isActive'>>({
    purposeCode: MOCK_PURPOSE_CODES[0].value,
    balanceTypeCode: MOCK_BALANCE_TYPE_CODES[0].value,
    threshold: 0,
    currency: 'EUR',
  });
  const [isNewRuleActive, setIsNewRuleActive] = useState(true);

  const toast = useToast();
  const nextId = useMemo(() => rules.reduce((max, rule) => Math.max(max, rule.id), 0) + 1, [rules]);

  const handleNewRuleChange = useCallback((key: keyof typeof newRule, value: any) => {
    setNewRule((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAddRule = useCallback(() => {
    if (newRule.threshold <= 0) {
      toast({
        title: 'Invalid Threshold',
        description: 'Threshold must be greater than zero.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const ruleToAdd: SweepRule = {
      ...newRule,
      id: nextId,
      isActive: isNewRuleActive,
    };

    setRules((prevRules) => [...prevRules, ruleToAdd]);
    toast({
      title: 'Rule Added',
      description: `Sweep rule for ${ruleToAdd.purposeCode} added successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    // Reset new rule state (keeping currency for convenience)
    setNewRule((prev) => ({ ...prev, threshold: 0, balanceTypeCode: MOCK_BALANCE_TYPE_CODES[0].value }));
  }, [newRule, nextId, isNewRuleActive, toast]);

  const handleDeleteRule = useCallback((id: number) => {
    setRules((prevRules) => prevRules.filter((rule) => rule.id !== id));
    toast({
      title: 'Rule Deleted',
      description: `Sweep rule ID ${id} has been removed.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  const handleToggleActive = useCallback((id: number) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
    toast({
        title: 'Rule Updated',
        description: `Rule ID ${id} active status toggled.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
    });
  }, [toast]);

  const renderRuleRow = (rule: SweepRule) => (
    <Tr key={rule.id} opacity={rule.isActive ? 1 : 0.5}>
      <Td>{rule.id}</Td>
      <Td>{rule.purposeCode}</Td>
      <Td>{rule.balanceTypeCode}</Td>
      <Td>{rule.currency}</Td>
      <Td isNumeric>{rule.threshold.toLocaleString()}</Td>
      <Td>
        <Switch
          isChecked={rule.isActive}
          onChange={() => handleToggleActive(rule.id)}
          colorScheme="green"
        />
      </Td>
      <Td>
        <IconButton
          aria-label="Delete rule"
          icon={<DeleteIcon size={16} />}
          size="sm"
          colorScheme="red"
          onClick={() => handleDeleteRule(rule.id)}
        />
      </Td>
    </Tr>
  );

  const renderNewRuleForm = () => (
    <VStack spacing={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
      <Text fontSize="lg" fontWeight="bold">Add New Sweep Rule</Text>
      <HStack w="100%" spacing={4}>
        <FormControl id="new-purpose" isRequired>
          <FormLabel>Purpose</FormLabel>
          <Select
            value={newRule.purposeCode}
            onChange={(e) => handleNewRuleChange('purposeCode', e.target.value)}
          >
            {MOCK_PURPOSE_CODES.map(code => (
              <option key={code.value} value={code.value}>{code.label}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="new-balance-type" isRequired>
          <FormLabel>Balance Type</FormLabel>
          <Select
            value={newRule.balanceTypeCode}
            onChange={(e) => handleNewRuleChange('balanceTypeCode', e.target.value)}
          >
            {MOCK_BALANCE_TYPE_CODES.map(code => (
              <option key={code.value} value={code.value}>{code.label}</option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <HStack w="100%" spacing={4}>
        <FormControl id="new-threshold" isRequired>
          <FormLabel>Threshold Amount</FormLabel>
          <NumberInput
            value={newRule.threshold}
            onChange={(value) => handleNewRuleChange('threshold', parseFloat(value) || 0)}
            min={0}
            precision={2}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl id="new-currency" isRequired>
          <FormLabel>Currency</FormLabel>
          <Input
            value={newRule.currency}
            onChange={(e) => handleNewRuleChange('currency', e.target.value.toUpperCase())}
            maxLength={3}
          />
        </FormControl>
      </HStack>

      <HStack w="100%" justifyContent="space-between" pt={2}>
        <FormControl display="flex" alignItems="center" w="auto">
          <FormLabel htmlFor="new-active-switch" mb="0">Active?</FormLabel>
          <Switch
            id="new-active-switch"
            isChecked={isNewRuleActive}
            onChange={() => setIsNewRuleActive((prev) => !prev)}
            colorScheme="green"
          />
        </FormControl>
        <Button
          leftIcon={<AddIcon size={16} />}
          colorScheme="blue"
          onClick={handleAddRule}
        >
          Add Rule
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <Box p={8} maxW="5xl" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>Automated Sweep Rules Configuration</Text>

      {/* New Rule Entry */}
      {renderNewRuleForm()}

      <VStack spacing={4} mt={8} align="stretch">
        <Text fontSize="xl" fontWeight="semibold">Configured Sweep Rules</Text>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr bg="gray.100">
                <Th>ID</Th>
                <Th>Purpose Code (ExternalPurpose1Code)</Th>
                <Th>Balance Type (ExternalBalanceType1Code)</Th>
                <Th>Currency</Th>
                <Th isNumeric>Threshold Amount</Th>
                <Th>Active</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rules.length > 0 ? (
                rules.map(renderRuleRow)
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center" color="gray.500">
                    No sweep rules configured yet.
                  </Td>
                </Tr>
              )}
            </Tbody>
            <Tfoot>
                {/* Optional: Summary Tfoot */}
            </Tfoot>
          </Table>
        </Box>
      </VStack>

      <Flex justifyContent="flex-end" mt={6}>
        <Button colorScheme="green" size="lg">
          Save Configuration
        </Button>
      </Flex>
    </Box>
  );
};

export default AutomatedSweepRules;
