// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/utils/ai/SentimentFormatter.ts
================================================================================

import { SentimentResult, SentimentCategory } from '../../types/ai/sentimentTypes'; // Assuming these types exist

/**
 * @interface SentimentDisplayConfig
 * @description Defines the configuration for displaying different sentiment categories.
 * @property {string} color - The CSS color string for the sentiment.
 * @property {string} icon - The name of an icon (e.g., from a UI icon library) representing the sentiment.
 * @property {string} label - A human-readable label for the sentiment category.
 */
interface SentimentDisplayConfig {
  color: string;
  icon: string;
  label: string;
}

/**
 * @constant SENTIMENT_CONFIG
 * @description A mapping from SentimentCategory to its display configuration.
 */
const SENTIMENT_CONFIG: Record<SentimentCategory, SentimentDisplayConfig> = {
  [SentimentCategory.POSITIVE]: {
    color: 'var(--color-sentiment-positive, #4CAF50)', // Green
    icon: 'sentiment_satisfied_alt', // Material icon name
    label: 'Positive',
  },
  [SentimentCategory.NEUTRAL]: {
    color: 'var(--color-sentiment-neutral, #FFC107)', // Amber
    icon: 'sentiment_neutral',
    label: 'Neutral',
  },
  [SentimentCategory.NEGATIVE]: {
    color: 'var(--color-sentiment-negative, #F44336)', // Red
    icon: 'sentiment_dissatisfied',
    label: 'Negative',
  },
  [SentimentCategory.MIXED]: {
    color: 'var(--color-sentiment-mixed, #2196F3)', // Blue
    icon: 'sentiment_mixed', // Placeholder, ideally a mixed icon
    label: 'Mixed',
  },
  [SentimentCategory.UNKNOWN]: {
    color: 'var(--color-sentiment-unknown, #9E9E9E)', // Grey
    icon: 'sentiment_very_dissatisfied', // Or help_outline
    label: 'Unknown',
  },
};

/**
 * @function formatSentimentForDisplay
 * @description Takes a sentiment analysis result and formats it for UI display,
 *              providing color, icon, and a human-readable label based on predefined configurations.
 * @param {SentimentResult} sentimentResult - The raw sentiment analysis result from the AI.
 * @returns {SentimentDisplayConfig} An object containing display properties for the sentiment.
 */
export const formatSentimentForDisplay = (sentimentResult: SentimentResult): SentimentDisplayConfig => {
  const { category } = sentimentResult;

  if (SENTIMENT_CONFIG[category]) {
    return SENTIMENT_CONFIG[category];
  }

  // Fallback for unexpected categories
  console.warn(`Unknown sentiment category received: ${category}. Falling back to UNKNOWN config.`);
  return SENTIMENT_CONFIG[SentimentCategory.UNKNOWN];
};

/**
 * @function getSentimentColor
 * @description Retrieves only the color for a given sentiment category.
 * @param {SentimentCategory} category - The sentiment category.
 * @returns {string} The CSS color string.
 */
export const getSentimentColor = (category: SentimentCategory): string => {
  return SENTIMENT_CONFIG[category]?.color || SENTIMENT_CONFIG[SentimentCategory.UNKNOWN].color;
};

/**
 * @function getSentimentIcon
 * @description Retrieves only the icon name for a given sentiment category.
 * @param {SentimentCategory} category - The sentiment category.
 * @returns {string} The icon name.
 */
export const getSentimentIcon = (category: SentimentCategory): string => {
  return SENTIMENT_CONFIG[category]?.icon || SENTIMENT_CONFIG[SentimentCategory.UNKNOWN].icon;
};

/**
 * @function getSentimentLabel
 * @description Retrieves only the human-readable label for a given sentiment category.
 * @param {SentimentCategory} category - The sentiment category.
 * @returns {string} The label string.
 */
export const getSentimentLabel = (category: SentimentCategory): string => {
  return SENTIMENT_CONFIG[category]?.label || SENTIMENT_CONFIG[SentimentCategory.UNKNOWN].label;
};

// Example Usage (for testing/demonstration, not part of the utility itself)
/*
import { SentimentResult, SentimentCategory } from './types/ai/sentimentTypes';

const examplePositiveSentiment: SentimentResult = {
  score: 0.9,
  category: SentimentCategory.POSITIVE,
  magnitude: 0.8
};

const exampleNegativeSentiment: SentimentResult = {
  score: -0.7,
  category: SentimentCategory.NEGATIVE,
  magnitude: 0.9
};

const exampleNeutralSentiment: SentimentResult = {
  score: 0.1,
  category: SentimentCategory.NEUTRAL,
  magnitude: 0.2
};

const exampleMixedSentiment: SentimentResult = {
  score: 0,
  category: SentimentCategory.MIXED,
  magnitude: 1.0
};

const displayPositive = formatSentimentForDisplay(examplePositiveSentiment);
console.log('Positive:', displayPositive); // { color: '#4CAF50', icon: 'sentiment_satisfied_alt', label: 'Positive' }

const displayNegative = formatSentimentForDisplay(exampleNegativeSentiment);
console.log('Negative:', displayNegative); // { color: '#F44336', icon: 'sentiment_dissatisfied', label: 'Negative' }

const neutralColor = getSentimentColor(SentimentCategory.NEUTRAL);
console.log('Neutral Color:', neutralColor); // #FFC107
*/