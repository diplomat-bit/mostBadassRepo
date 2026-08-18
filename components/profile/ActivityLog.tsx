// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/profile/ActivityLog.tsx
================================================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  Divider,
  Icon,
  Collapse,
  IconButton,
  Tooltip,
  useToast,
  Badge,
} from '@chakra-ui/react';
import {
  FiClock,
  FiUserCheck,
  FiFileText,
  FiServer,
  FiChevronDown,
  FiChevronUp,
  FiAlertTriangle,
  FiLock,
  FiKey,
  FiDatabase,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

// --- Types for Activity Log Entries ---
interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'authentication' | 'data' | 'system' | 'security' | 'user_profile';
  details: Record<string, any>;
  userId?: string;
  ipAddress?: string;
  device?: string;
  status: 'success' | 'failure' | 'info' | 'warning';
}

// --- Mock Data Service (Replace with actual API call) ---
const fetchActivityLog = async (userId: string, limit: number = 10): Promise<ActivityLogEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: ActivityLogEntry[] = [
        {
          id: 'log-001',
          timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), // 2 hours ago
          action: 'User Login',
          category: 'authentication',
          details: { method: 'password', status: 'success' },
          userId: 'user-johndoe',
          ipAddress: '203.0.113.45',
          device: 'Chrome on Windows',
          status: 'success',
        },
        {
          id: 'log-002',
          timestamp: new Date(Date.now() - 3600 * 1000 * 1.5).toISOString(), // 1.5 hours ago
          action: 'Profile Update',
          category: 'user_profile',
          details: { field: 'email', oldValue: 'john@example.com', newValue: 'john.doe@example.com' },
          userId: 'user-johndoe',
          ipAddress: '203.0.113.45',
          device: 'Chrome on Windows',
          status: 'info',
        },
        {
          id: 'log-003',
          timestamp: new Date(Date.now() - 3600 * 1000 * 1).toISOString(), // 1 hour ago
          action: 'Failed Login Attempt',
          category: 'authentication',
          details: { method: 'password', reason: 'incorrect password' },
          userId: 'user-johndoe',
          ipAddress: '198.51.100.10',
          device: 'Safari on macOS',
          status: 'failure',
        },
        {
          id: 'log-004',
          timestamp: new Date(Date.now() - 3600 * 1000 * 0.5).toISOString(), // 30 mins ago
          action: 'Data Export',
          category: 'data',
          details: { dataType: 'transactions', format: 'CSV', recordsCount: 1500 },
          userId: 'user-johndoe',
          ipAddress: '203.0.113.45',
          device: 'Chrome on Windows',
          status: 'success',
        },
        {
          id: 'log-005',
          timestamp: new Date(Date.now() - 3600 * 1000 * 0.2).toISOString(), // 12 mins ago
          action: 'Password Change',
          category: 'security',
          details: { complexityScore: 90 },
          userId: 'user-johndoe',
          ipAddress: '203.0.113.45',
          device: 'Mobile App (iOS)',
          status: 'success',
        },
        {
          id: 'log-006',
          timestamp: new Date(Date.now() - 3600 * 1000 * 0.1).toISOString(), // 6 mins ago
          action: 'API Key Generation',
          category: 'security',
          details: { keyId: 'api-key-abc123', scope: ['read:data', 'write:transactions'] },
          userId: 'user-johndoe',
          ipAddress: '203.0.113.45',
          device: 'Chrome on Windows',
          status: 'info',
        },
        {
          id: 'log-007',
          timestamp: new Date(Date.now() - 3600 * 1000 * 0.05).toISOString(), // 3 mins ago
          action: 'Suspicious Activity Alert',
          category: 'security',
          details: { ruleTriggered: 'Login from new Geo-location', location: 'Brazil' },
          userId: 'user-johndoe',
          ipAddress: '177.100.20.5',
          device: 'Unknown',
          status: 'warning',
        },
        {
          id: 'log-008',
          timestamp: new Date(Date.now()).toISOString(), // Just now
          action: 'Dashboard Access',
          category: 'system',
          details: { dashboard: 'Personal Dashboard' },
          userId: 'user-johndoe',
          ipAddress: '203.0.113.45',
          device: 'Chrome on Windows',
          status: 'info',
        },
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort newest first
      resolve(mockData.slice(0, limit));
    }, 500);
  });
};

const getActivityIcon = (category: ActivityLogEntry['category']) => {
  switch (category) {
    case 'authentication':
      return FiUserCheck;
    case 'data':
      return FiFileText;
    case 'system':
      return FiServer;
    case 'security':
      return FiLock;
    case 'user_profile':
      return FiDatabase;
    default:
      return FiClock;
  }
};

const getStatusColor = (status: ActivityLogEntry['status']) => {
  switch (status) {
    case 'success':
      return 'green';
    case 'failure':
      return 'red';
    case 'warning':
      return 'orange';
    case 'info':
      return 'blue';
    default:
      return 'gray';
  }
};

const getStatusIcon = (status: ActivityLogEntry['status']) => {
  switch (status) {
    case 'success':
      return null; // Often implicit or a checkmark
    case 'failure':
      return FiAlertTriangle;
    case 'warning':
      return FiAlertTriangle;
    case 'info':
      return null;
    default:
      return null;
  }
};

const renderDetail = (key: string, value: any) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return `${key}: ${value ? 'Yes' : 'No'}`;
  if (Array.isArray(value)) return `${key}: ${value.join(', ')}`;
  if (typeof value === 'object' && value !== null) {
    return (
      <VStack align="start" spacing={0} pl={2} borderLeft="1px solid" borderColor="gray.200">
        <Text fontWeight="semibold" fontSize="sm">
          {key}:
        </Text>
        {Object.entries(value).map(([subKey, subValue]) => (
          <Text key={subKey} fontSize="xs">
            &bull; {subKey}: {typeof subValue === 'string' ? subValue : JSON.stringify(subValue)}
          </Text>
        ))}
      </VStack>
    );
  }
  return `${key}: ${value}`;
};

interface ActivityLogProps {
  userId: string; // The ID of the user whose activity log is being displayed
  limit?: number; // Number of entries to display initially
}

const ActivityLog: React.FC<ActivityLogProps> = ({ userId, limit = 10 }) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const loadActivityLogs = async () => {
      try {
        setLoading(true);
        const logs = await fetchActivityLog(userId, limit);
        setActivityLogs(logs);
      } catch (err) {
        setError('Failed to load activity logs.');
        toast({
          title: 'Error',
          description: 'Could not fetch activity logs. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadActivityLogs();
  }, [userId, limit, toast]);

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  if (loading) {
    return (
      <Box p={6} bg="white" borderRadius="lg" shadow="md">
        <Text>Loading activity logs...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} bg="white" borderRadius="lg" shadow="md">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (activityLogs.length === 0) {
    return (
      <Box p={6} bg="white" borderRadius="lg" shadow="md">
        <Text>No recent activity found for this user.</Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="md">
      <HStack justifyContent="space-between" mb={6}>
        <Heading size="lg" color="gray.700">
          Activity Log
        </Heading>
        <Tooltip label="Real-time updates powered by AI" placement="left">
          <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
            AI-Powered Insights
          </Badge>
        </Tooltip>
      </HStack>
      <VStack spacing={4} align="stretch">
        {activityLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.200"
              _hover={{ shadow: 'sm' }}
              transition="all 0.2s"
              bg={expandedLogId === log.id ? 'blue.50' : 'white'}
            >
              <HStack justifyContent="space-between" alignItems="flex-start">
                <HStack spacing={3} flex="1">
                  <Icon as={getActivityIcon(log.category)} color="blue.500" boxSize={5} />
                  <VStack align="start" spacing={0}>
                    <HStack>
                      <Text fontWeight="semibold" fontSize="md" color="gray.800">
                        {log.action}
                      </Text>
                      {getStatusIcon(log.status) && (
                        <Icon
                          as={getStatusIcon(log.status)}
                          color={getStatusColor(log.status) + '.500'}
                          boxSize={4}
                          ml={1}
                        />
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {new Date(log.timestamp).toLocaleString()}
                    </Text>
                  </VStack>
                </HStack>
                <HStack spacing={2}>
                  <Tag size="sm" colorScheme={getStatusColor(log.status)} borderRadius="full" px={3}>
                    {log.status.toUpperCase()}
                  </Tag>
                  <Tag size="sm" variant="outline" colorScheme="gray" borderRadius="full">
                    {log.category.replace(/_/g, ' ')}
                  </Tag>
                  <IconButton
                    aria-label={expandedLogId === log.id ? 'Collapse details' : 'Expand details'}
                    icon={expandedLogId === log.id ? <FiChevronUp /> : <FiChevronDown />}
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleExpand(log.id)}
                    color="gray.600"
                    _hover={{ bg: 'gray.100' }}
                  />
                </HStack>
              </HStack>
              <Collapse in={expandedLogId === log.id} animateOpacity>
                <Box mt={4} pl={8} pt={2} borderLeft="2px solid" borderColor="blue.200">
                  <VStack align="start" spacing={1} fontSize="sm" color="gray.700">
                    {log.userId && <Text>User ID: {log.userId}</Text>}
                    {log.ipAddress && <Text>IP Address: {log.ipAddress}</Text>}
                    {log.device && <Text>Device: {log.device}</Text>}
                    {Object.entries(log.details).map(([key, value]) => (
                      <Text key={key}>{renderDetail(key, value)}</Text>
                    ))}
                    {/* Add AI-powered insights here based on log.details */}
                    {log.status === 'warning' && log.category === 'security' && (
                      <Box mt={3} p={3} bg="orange.50" borderRadius="md" borderLeft="3px solid" borderColor="orange.400">
                        <HStack>
                          <Icon as={FiAlertTriangle} color="orange.500" />
                          <Text fontWeight="semibold" color="orange.700">
                            AI Security Alert:
                          </Text>
                        </HStack>
                        <Text fontSize="sm" ml={6} color="orange.600">
                          {log.details.ruleTriggered === 'Login from new Geo-location' && (
                            <>
                              This login from <strong>{log.details.location}</strong> is unusual for your account. Please
                              verify if this was you or contact support if you suspect unauthorized access.
                            </>
                          )}
                          {/* More AI-driven dynamic insights can be added based on different log types */}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </Box>
              </Collapse>
            </Box>
          </motion.div>
        ))}
      </VStack>
      <Divider my={6} />
      <Text fontSize="sm" color="gray.500">
        All times are displayed in your local timezone.
      </Text>
    </Box>
  );
};

export default ActivityLog;