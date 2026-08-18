// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/profile/ApiKeysManagement.tsx
================================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Tooltip,
  useToast,
  Divider,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  Spinner,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { CopyIcon, ViewIcon, ViewOffIcon, AddIcon, DeleteIcon, SettingsIcon, WarningIcon } from '@chakra-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext for user info
import {
  generateApiKey as apiGenerateApiKey,
  getApiKeys as apiGetApiKeys,
  revokeApiKey as apiRevokeApiKey,
  updateApiKey as apiUpdateApiKey,
  ApiKey,
  ApiKeyScope,
  ApiKeyStatus,
  generateGoogleCloudApiKey,
  generateOpenAIApiKey,
  generateLinkedInApiKey,
  verifyGoogleCloudApiKey,
  verifyOpenAIApiKey,
  verifyLinkedInApiKey,
} from '../../services/apiService'; // Your API service
import { useAIContext } from '../../context/AIContext'; // For AI-powered suggestions
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Define the schema for API key creation
const apiKeySchema = z.object({
  name: z.string().min(3, 'API Key name must be at least 3 characters long'),
  expiresAt: z.preprocess((arg) => (arg === '' ? null : new Date(arg as string)), z.union([z.date(), z.null()])).optional(),
  scopes: z.array(z.nativeEnum(ApiKeyScope)).optional(),
});

type ApiKeyFormData = z.infer<typeof apiKeySchema>;

const ALL_SCOPES = Object.values(ApiKeyScope);

const ApiKeysManagement: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const { aiAssistant } = useAIContext(); // Use AI context for suggestions

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      scopes: [],
    },
  });

  const fetchApiKeys = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const keys = await apiGetApiKeys(user.id);
      setApiKeys(keys);
    } catch (error) {
      toast({
        title: 'Error fetching API keys',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const handleGenerateApiKey = async (data: ApiKeyFormData) => {
    if (!user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'User not authenticated.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setIsGenerating(true);
    try {
      const newKey = await apiGenerateApiKey(user.id, data.name, data.expiresAt, data.scopes);
      setApiKeys((prev) => [...prev, newKey]);
      toast({
        title: 'API Key Generated',
        description: `Your new API key "${newKey.name}" has been created. Please copy it now, as it will not be shown again.`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      reset(); // Clear form
      onModalClose(); // Close modal after generation
    } catch (error) {
      toast({
        title: 'Error generating API key',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    if (!user?.id) return;
    try {
      await apiRevokeApiKey(user.id, keyId);
      setApiKeys((prev) => prev.filter((key) => key.id !== keyId));
      toast({
        title: 'API Key Revoked',
        description: 'The API key has been successfully revoked.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error revoking API key',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateApiKey = async (keyId: string, data: ApiKeyFormData) => {
    if (!user?.id) return;
    setEditLoading(true);
    try {
      const updatedKey = await apiUpdateApiKey(user.id, keyId, data.name, data.expiresAt, data.scopes);
      setApiKeys((prev) => prev.map((key) => (key.id === keyId ? updatedKey : key)));
      toast({
        title: 'API Key Updated',
        description: 'The API key has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onModalClose();
    } catch (error) {
      toast({
        title: 'Error updating API key',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleShowKey = (keyId: string) => {
    setShowKey((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const openEditModal = (key: ApiKey) => {
    setSelectedApiKey(key);
    reset({
      name: key.name,
      expiresAt: key.expiresAt ? new Date(key.expiresAt).toISOString().split('T')[0] : '',
      scopes: key.scopes,
    });
    onModalOpen();
  };

  // AI-powered suggestions for API key scope
  const getAIScopeSuggestions = async (keyName: string, currentScopes: ApiKeyScope[]) => {
    if (!aiAssistant) return;
    try {
      const prompt = `Based on the API key name "${keyName}" and existing scopes [${currentScopes.join(', ')}], suggest additional relevant API scopes from the following list: ${ALL_SCOPES.join(', ')}. Provide the suggestions as a comma-separated list of scopes, e.g., "READ_DATA,WRITE_ASSETS". If no additional suggestions, return an empty string.`;
      const response = await aiAssistant.generateContent(prompt);
      const suggestions = response?.text?.split(',').map((s) => s.trim()) || [];
      const validSuggestions = suggestions.filter((s) => ALL_SCOPES.includes(s as ApiKeyScope));
      return validSuggestions.filter((s) => !currentScopes.includes(s as ApiKeyScope));
    } catch (error) {
      console.error('Error getting AI scope suggestions:', error);
      return [];
    }
  };

  // Integrations for Fortune 500 company APIs (example with Google, OpenAI, LinkedIn)
  const handleGenerateExternalApiKey = async (service: 'google-cloud' | 'openai' | 'linkedin') => {
    if (!user?.id) {
      toast({ title: 'Auth Error', description: 'User not authenticated.', status: 'error' });
      return;
    }
    setIsGenerating(true);
    try {
      let newKey: ApiKey | null = null;
      let generatedKeyValue: string = '';

      switch (service) {
        case 'google-cloud':
          // For Google Cloud, you'd typically manage this through GCP IAM and service accounts.
          // This is a simplified representation.
          generatedKeyValue = await generateGoogleCloudApiKey(user.id, 'Google Cloud API Key');
          newKey = {
            id: `gcp-${Date.now()}`,
            userId: user.id,
            name: 'Google Cloud Integration Key',
            key: generatedKeyValue,
            status: ApiKeyStatus.Active,
            createdAt: new Date(),
            scopes: [ApiKeyScope.ACCESS_GCP_RESOURCES],
          };
          // In a real scenario, you'd store the key securely, not directly in this list for display.
          // And also call your backend to save this integration.
          break;
        case 'openai':
          generatedKeyValue = await generateOpenAIApiKey(user.id, 'OpenAI API Key');
          newKey = {
            id: `openai-${Date.now()}`,
            userId: user.id,
            name: 'OpenAI Integration Key',
            key: generatedKeyValue,
            status: ApiKeyStatus.Active,
            createdAt: new Date(),
            scopes: [ApiKeyScope.ACCESS_AI_SERVICES],
          };
          break;
        case 'linkedin':
          generatedKeyValue = await generateLinkedInApiKey(user.id, 'LinkedIn API Key');
          newKey = {
            id: `linkedin-${Date.now()}`,
            userId: user.id,
            name: 'LinkedIn Integration Key',
            key: generatedKeyValue,
            status: ApiKeyStatus.Active,
            createdAt: new Date(),
            scopes: [ApiKeyScope.ACCESS_LINKEDIN_DATA],
          };
          break;
        default:
          throw new Error('Unsupported external API service.');
      }

      if (newKey) {
        setApiKeys((prev) => [...prev, { ...newKey, key: 'sk_***********' }]); // Mask the key for display
        toast({
          title: `External ${service} API Key Generated`,
          description: `Your new ${service} API key has been generated and securely stored.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        // You might want to display the actual key in a one-time modal for the user to copy.
        // For security, avoid storing it in local state or displaying it persistently.
      }
    } catch (error) {
      toast({
        title: `Error generating ${service} API key`,
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerifyExternalApiKey = async (service: 'google-cloud' | 'openai' | 'linkedin', key: string) => {
    if (!user?.id) {
      toast({ title: 'Auth Error', description: 'User not authenticated.', status: 'error' });
      return;
    }
    try {
      let isValid = false;
      switch (service) {
        case 'google-cloud':
          isValid = await verifyGoogleCloudApiKey(user.id, key);
          break;
        case 'openai':
          isValid = await verifyOpenAIApiKey(user.id, key);
          break;
        case 'linkedin':
          isValid = await verifyLinkedInApiKey(user.id, key);
          break;
        default:
          throw new Error('Unsupported external API service.');
      }

      if (isValid) {
        toast({
          title: `External ${service} API Key Verified`,
          description: `The provided ${service} API key is valid.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: `External ${service} API Key Invalid`,
          description: `The provided ${service} API key is invalid or lacks necessary permissions.`,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: `Error verifying ${service} API key`,
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} maxWidth="1200px" mx="auto">
      <Heading as="h1" size="xl" mb={6}>
        API Key Management
      </Heading>

      <Text mb={6}>
        Here you can manage your personal API keys to securely access platform resources and integrate with external Fortune 500 company APIs.
      </Text>

      <VStack spacing={8} align="stretch">
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <HStack justify="space-between" mb={4}>
            <Heading as="h2" size="lg">
              Your API Keys
            </Heading>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => {
              setSelectedApiKey(null);
              reset({ name: '', expiresAt: '', scopes: [] });
              onModalOpen();
            }}>
              Create New API Key
            </Button>
          </HStack>

          {isLoading ? (
            <HStack justifyContent="center" py={10}>
              <Spinner size="xl" />
              <Text>Loading API keys...</Text>
            </HStack>
          ) : apiKeys.length === 0 ? (
            <Text textAlign="center" py={10} color="gray.500">
              You haven't created any API keys yet. Click "Create New API Key" to get started.
            </Text>
          ) : (
            <VStack divider={<Divider />} spacing={4} align="stretch">
              {apiKeys.map((key) => (
                <Box key={key.id} p={3} borderWidth="1px" borderRadius="md" _hover={{ shadow: 'sm' }}>
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{key.name}</Text>
                      <HStack>
                        <Input
                          type={showKey[key.id] ? 'text' : 'password'}
                          value={key.key}
                          isReadOnly
                          width="300px"
                          fontFamily="monospace"
                        />
                        <Tooltip label={showKey[key.id] ? 'Hide Key' : 'Show Key'}>
                          <IconButton
                            aria-label={showKey[key.id] ? 'Hide Key' : 'Show Key'}
                            icon={showKey[key.id] ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => toggleShowKey(key.id)}
                          />
                        </Tooltip>
                        <Tooltip label="Copy Key">
                          <IconButton
                            aria-label="Copy Key"
                            icon={<CopyIcon />}
                            onClick={() => handleCopyToClipboard(key.key)}
                          />
                        </Tooltip>
                      </HStack>
                      <HStack spacing={2} pt={2}>
                        <Text fontSize="sm" color="gray.500">
                          Status:{' '}
                          <Tag size="sm" colorScheme={key.status === ApiKeyStatus.Active ? 'green' : 'red'}>
                            {key.status}
                          </Tag>
                        </Text>
                        {key.expiresAt && (
                          <Text fontSize="sm" color="gray.500">
                            Expires:{' '}
                            <Tag size="sm" colorScheme={new Date(key.expiresAt) < new Date() ? 'red' : 'orange'}>
                              {new Date(key.expiresAt).toLocaleDateString()}
                            </Tag>
                          </Text>
                        )}
                        <Text fontSize="sm" color="gray.500">
                          Created: {new Date(key.createdAt).toLocaleDateString()}
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack spacing={2}>
                      <Tooltip label="Edit Key">
                        <IconButton
                          aria-label="Edit Key"
                          icon={<SettingsIcon />}
                          onClick={() => openEditModal(key)}
                        />
                      </Tooltip>
                      <Tooltip label="Revoke Key">
                        <IconButton
                          aria-label="Revoke Key"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => handleRevokeApiKey(key.id)}
                        />
                      </Tooltip>
                    </HStack>
                  </HStack>
                  {key.scopes && key.scopes.length > 0 && (
                    <Box mt={3}>
                      <Text fontSize="sm" fontWeight="semibold" mb={1}>
                        Scopes:
                      </Text>
                      <Wrap spacing={2}>
                        {key.scopes.map((scope) => (
                          <Tag size="sm" key={scope} colorScheme="purple">
                            {scope}
                          </Tag>
                        ))}
                      </Wrap>
                    </Box>
                  )}
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Heading as="h2" size="lg" mb={4}>
            Integrate External APIs
          </Heading>
          <Text mb={4}>
            Connect with leading Fortune 500 company APIs to enhance your platform's capabilities.
            We provide secure ways to manage your API keys for services like Google Cloud, OpenAI, and LinkedIn.
          </Text>

          <VStack spacing={4} align="stretch">
            <Box p={4} borderWidth="1px" borderRadius="md">
              <HStack justifyContent="space-between" mb={2}>
                <Text fontWeight="bold">Google Cloud Platform</Text>
                <Button
                  size="sm"
                  colorScheme="green"
                  isLoading={isGenerating}
                  onClick={() => handleGenerateExternalApiKey('google-cloud')}
                >
                  Generate Key
                </Button>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                Integrate with Google Cloud services like AI/ML, Storage, and Compute.
              </Text>
              <FormControl mt={2}>
                <FormLabel htmlFor="gcp-verify-key" fontSize="sm">Verify GCP Key (Optional)</FormLabel>
                <HStack>
                  <Input id="gcp-verify-key" placeholder="Paste your GCP API Key here" size="sm" />
                  <Button size="sm" onClick={() => handleVerifyExternalApiKey('google-cloud', (document.getElementById('gcp-verify-key') as HTMLInputElement).value)}>Verify</Button>
                </HStack>
              </FormControl>
            </Box>

            <Box p={4} borderWidth="1px" borderRadius="md">
              <HStack justifyContent="space-between" mb={2}>
                <Text fontWeight="bold">OpenAI</Text>
                <Button
                  size="sm"
                  colorScheme="green"
                  isLoading={isGenerating}
                  onClick={() => handleGenerateExternalApiKey('openai')}
                >
                  Generate Key
                </Button>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                Leverage advanced AI models from OpenAI for various generative tasks.
              </Text>
              <FormControl mt={2}>
                <FormLabel htmlFor="openai-verify-key" fontSize="sm">Verify OpenAI Key (Optional)</FormLabel>
                <HStack>
                  <Input id="openai-verify-key" placeholder="Paste your OpenAI API Key here" size="sm" />
                  <Button size="sm" onClick={() => handleVerifyExternalApiKey('openai', (document.getElementById('openai-verify-key') as HTMLInputElement).value)}>Verify</Button>
                </HStack>
              </FormControl>
            </Box>

            <Box p={4} borderWidth="1px" borderRadius="md">
              <HStack justifyContent="space-between" mb={2}>
                <Text fontWeight="bold">LinkedIn</Text>
                <Button
                  size="sm"
                  colorScheme="green"
                  isLoading={isGenerating}
                  onClick={() => handleGenerateExternalApiKey('linkedin')}
                >
                  Generate Key
                </Button>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                Access LinkedIn data for professional networking and business insights.
              </Text>
              <FormControl mt={2}>
                <FormLabel htmlFor="linkedin-verify-key" fontSize="sm">Verify LinkedIn Key (Optional)</FormLabel>
                <HStack>
                  <Input id="linkedin-verify-key" placeholder="Paste your LinkedIn API Key here" size="sm" />
                  <Button size="sm" onClick={() => handleVerifyExternalApiKey('linkedin', (document.getElementById('linkedin-verify-key') as HTMLInputElement).value)}>Verify</Button>
                </HStack>
              </FormControl>
            </Box>
          </VStack>
        </Box>
      </VStack>

      <Modal isOpen={isModalOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedApiKey ? 'Edit API Key' : 'Create New API Key'}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(selectedApiKey ? (data) => handleUpdateApiKey(selectedApiKey.id, data) : handleGenerateApiKey)}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel htmlFor="name">API Key Name</FormLabel>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., My Frontend App Key"
                  />
                  <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.expiresAt}>
                  <FormLabel htmlFor="expiresAt">Expiration Date (Optional)</FormLabel>
                  <Input
                    id="expiresAt"
                    type="date"
                    {...register('expiresAt')}
                    min={new Date().toISOString().split('T')[0]} // Cannot set expiration in the past
                  />
                  <FormErrorMessage>{errors.expiresAt && errors.expiresAt.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.scopes}>
                  <FormLabel htmlFor="scopes">Scopes (Permissions)</FormLabel>
                  <Controller
                    name="scopes"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        id="scopes"
                        placeholder="Select scopes"
                        multiple
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
                          field.onChange(selectedOptions);
                        }}
                        value={field.value || []}
                      >
                        {ALL_SCOPES.map((scope) => (
                          <option key={scope} value={scope}>
                            {scope}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Control which actions your API key is allowed to perform.
                  </Text>
                  <FormErrorMessage>{errors.scopes && errors.scopes.message}</FormErrorMessage>
                  {selectedApiKey && (
                    <Wrap mt={2}>
                      {selectedApiKey.scopes.map((scope) => (
                        <Tag
                          key={scope}
                          size="md"
                          colorScheme="purple"
                          borderRadius="full"
                        >
                          <TagLabel>{scope}</TagLabel>
                          {/* Optionally allow removal of scopes directly from tag,
                          but it's better to manage via the select for clarity */}
                        </Tag>
                      ))}
                    </Wrap>
                  )}
                </FormControl>

                {aiAssistant && (
                  <Button
                    size="sm"
                    leftIcon={<WarningIcon />}
                    onClick={async () => {
                      const currentName = watch('name');
                      const currentScopes = watch('scopes') || [];
                      if (currentName) {
                        const suggestions = await getAIScopeSuggestions(currentName, currentScopes as ApiKeyScope[]);
                        if (suggestions.length > 0) {
                          const newScopes = [...new Set([...currentScopes, ...suggestions])];
                          setValue('scopes', newScopes);
                          toast({
                            title: 'AI Suggestions Added',
                            description: `AI suggested adding: ${suggestions.join(', ')}`,
                            status: 'info',
                            duration: 5000,
                            isClosable: true,
                          });
                        } else {
                          toast({
                            title: 'No new AI suggestions',
                            description: 'The AI did not find additional relevant scopes based on the name.',
                            status: 'info',
                            duration: 3000,
                            isClosable: true,
                          });
                        }
                      } else {
                        toast({
                          title: 'Enter API Key Name',
                          description: 'Please enter a name for the API key to get AI scope suggestions.',
                          status: 'warning',
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                    }}
                  >
                    Get AI Scope Suggestions
                  </Button>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onModalClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit" isLoading={isGenerating || editLoading}>
                {selectedApiKey ? 'Update API Key' : 'Generate API Key'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ApiKeysManagement;