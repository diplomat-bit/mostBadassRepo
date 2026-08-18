// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/profile/SubscriptionTierBadge.tsx
================================================================================

import React from 'react';
import { Box, Text, Badge, Button, VStack, Heading, List, ListItem, ListIcon, useColorModeValue } from '@chakra-ui/react';
import { FaCheckCircle, FaStar, FaCrown } from 'react-icons/fa';
import { MdOutlineArrowForward } from 'react-icons/md';
import { motion } from 'framer-motion';

// Mock data for subscription tiers and features
interface Feature {
  id: string;
  text: string;
}

interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  features: Feature[];
  badgeColor: string;
  icon: React.ElementType;
  description: string;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0/month',
    features: [
      { id: 'basic_auth', text: 'Basic Authentication' },
      { id: 'basic_dashboard', text: 'Basic Dashboard Access' },
      { id: '5_ai_queries', text: '5 AI Queries per day' },
      { id: 'community_support', text: 'Community Support' },
    ],
    badgeColor: 'gray',
    icon: FaCheckCircle,
    description: 'Perfect for getting started with essential features.',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99/month',
    features: [
      { id: 'all_free', text: 'All Free Features' },
      { id: 'advanced_analytics', text: 'Advanced Analytics' },
      { id: '50_ai_queries', text: '50 AI Queries per day' },
      { id: 'priority_support', text: 'Priority Email Support' },
      { id: 'custom_reports', text: 'Customizable Reports' },
    ],
    badgeColor: 'blue',
    icon: FaStar,
    description: 'Unlock more power with advanced tools and increased AI access.',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Contact Us',
    features: [
      { id: 'all_premium', text: 'All Premium Features' },
      { id: 'unlimited_ai_queries', text: 'Unlimited AI Queries' },
      { id: 'dedicated_account_manager', text: 'Dedicated Account Manager' },
      { id: 'sla_guarantees', text: 'SLA Guarantees' },
      { id: 'custom_integrations', text: 'Custom Integrations & APIs' },
      { id: 'on_premise_deployment', text: 'On-premise Deployment Options' },
    ],
    badgeColor: 'purple',
    icon: FaCrown,
    description: 'Tailored solutions for large-scale operations and comprehensive needs.',
  },
];

interface SubscriptionTierBadgeProps {
  currentTierId: string;
  onUpgradeClick: (tierId: string) => void;
  isLoading?: boolean;
}

const SubscriptionTierBadge: React.FC<SubscriptionTierBadgeProps> = ({ currentTierId, onUpgradeClick, isLoading }) => {
  const currentTier = subscriptionTiers.find(tier => tier.id === currentTierId);
  const nextTier = subscriptionTiers[subscriptionTiers.indexOf(currentTier!) + 1];
  const isHighestTier = !nextTier;

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { type: 'spring', stiffness: 300 } },
  };

  if (!currentTier) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" bg={bg} shadow="md">
        <Text color="red.500">Error: Subscription tier not found.</Text>
      </Box>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
    >
      <Box
        p={6}
        borderWidth="1px"
        borderRadius="xl"
        borderColor={borderColor}
        bg={bg}
        shadow="xl"
        textAlign="center"
        position="relative"
        overflow="hidden"
        _hover={{ shadow: '2xl' }}
        transition="all 0.3s ease-in-out"
      >
        <Badge
          colorScheme={currentTier.badgeColor}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="sm"
          textTransform="uppercase"
          fontWeight="bold"
          mb={4}
          display="inline-flex"
          alignItems="center"
        >
          <ListIcon as={currentTier.icon} color="white" mr={1} />
          {currentTier.name} Tier
        </Badge>
        <Heading as="h3" size="lg" mb={2} color={textColor}>
          {currentTier.name}
        </Heading>
        <Text fontSize="md" color="gray.500" mb={4}>
          {currentTier.description}
        </Text>

        <VStack spacing={3} align="start" mb={6} maxW="300px" mx="auto">
          {currentTier.features.map(feature => (
            <ListItem key={feature.id} display="flex" alignItems="center" color={textColor}>
              <ListIcon as={FaCheckCircle} color="green.500" />
              <Text fontSize="md">{feature.text}</Text>
            </ListItem>
          ))}
        </VStack>

        {!isHighestTier && (
          <Box mt={6} pt={6} borderTop="1px solid" borderColor={borderColor}>
            <Text fontSize="lg" fontWeight="bold" mb={3} color={textColor}>
              Ready for more? Upgrade to {nextTier?.name}!
            </Text>
            <Text fontSize="sm" color="gray.500" mb={4}>
              Access even more powerful features and capabilities.
            </Text>
            <Button
              colorScheme={nextTier?.badgeColor}
              size="lg"
              onClick={() => onUpgradeClick(nextTier!.id)}
              isLoading={isLoading}
              rightIcon={<MdOutlineArrowForward />}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s ease-in-out"
            >
              Upgrade to {nextTier?.name} - {nextTier?.price}
            </Button>
            <Box mt={4}>
              <Text fontSize="sm" color="gray.500" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
                View all {nextTier?.name} features
              </Text>
            </Box>
          </Box>
        )}

        {isHighestTier && (
          <Box mt={6} pt={6} borderTop="1px solid" borderColor={borderColor}>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              You're on the highest tier!
            </Text>
            <Text fontSize="md" color="gray.500" mt={2}>
              Enjoy all the premium features and dedicated support.
            </Text>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default SubscriptionTierBadge;