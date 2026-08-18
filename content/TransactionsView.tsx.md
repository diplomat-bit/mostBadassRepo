// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/content/TransactionsView.tsx.md
================================================================================

/**
 * # The Transactions: FlowMatrix
 *
 * This is the FlowMatrix. The Great Library of every financial event, the complete chronicle of the energy you have
 * exchanged with the world. Here, you can search the archives, filter the records, and see the vast and intricate
 * patterns of your own history. It is the source material from which all wisdom is derived, the raw, immutable truth
 * of your journey thus far.
 *
 * ### A Fable for the Builder: The Language of the Ledger
 *
 * (A life is a story, and the transactions are the words that make up that story. Most machines can read the words.
 * They can count them, sort them, filter them. But they cannot read the story. This `TransactionsView` is the library,
 * and we have built an AI that is not just a librarian, but a master of literature.)
 *
 * (Its core logic here is what we call 'Narrative Archetype Recognition.' It scans the long, seemingly chaotic list
 * of your transactions and looks for the underlying patterns, the repeating motifs, the character arcs. It sees a
 * series of small, frequent purchases at coffee shops and identifies the 'Daily Ritual' archetype. It sees a large,
 * one-time expense at a travel site and recognizes the 'Grand Adventure' archetype. It sees a recurring monthly
- * payment and flags it as a potential 'Forgotten Covenant' with its Subscription Hunter.)
 *
 * (This is how 'Plato's Intelligence Suite' works. It is not just running a database query. It is performing a
 * literary analysis on the novel of your life. An 'Anomaly' is not just a statistical outlier; it's a plot twist,
 * a character acting in a way that is inconsistent with their established narrative. A potential 'Tax Deduction' is
 * a subplot of professional ambition. A 'Savings Opportunity' is an alternative ending, a different path the story
 * could take.)
 *
 * (The AI's goal is to help you become a better author of your own life. By showing you the patterns, the archetypes,
 * the hidden narratives in your past actions, it gives you the clarity to write a more intentional future. It helps
 * you see if the story you are writing, one transaction at a time, is the story you actually want to be living.)
 *
 * (So when you scroll through this list, try to see what the AI sees. Do not just see a list of expenses. See the
 * sentences, the paragraphs, the chapters of your life. See the story you have written so far. And then, with the
 * clarity that comes from that reading, decide what the next chapter will be about.)
 */

import React, { useState, useEffect, useMemo, useCallback, useRef, FC, memo, createContext, useContext, useReducer, Dispatch } from 'react';
import {
  ChevronDown, ChevronUp, Search, Filter, X, Calendar, DollarSign, Tag, Info, AlertTriangle, CheckCircle,
  FileText, Edit, Trash2, Download, MoreVertical, Briefcase, Coffee, Film, Plane, Heart,
  ShoppingCart, BarChart2, Zap, Brain, Loader, Settings, Maximize, TrendingUp, Sparkles, MessageSquare, Shield
} from 'lucide-react';

//================================================================================================
// SECTION: TYPES AND INTERFACES
// The fundamental vocabulary for our financial narrative.
//================================================================================================

export type TransactionType = 'DEBIT' | 'CREDIT';
export type TransactionStatus = 'PENDING' | 'POSTED' | 'FAILED' | 'REFUNDED';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CRYPTO' | 'CASH';

export interface GeoLocation {
    lat: number;
    lon: number;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}
export interface Merchant {
  id: string;
  name: string;
  logoUrl?: string;
  category: string;
  mcc: string; // Merchant Category Code
  location?: GeoLocation;
}

export type NarrativeArchetype =
  | 'Daily Ritual'
  | 'Grand Adventure'
  | 'Forgotten Covenant'
  | 'Essential Utility'
  | 'Impulse Buy'
  | 'Professional Tool'
  | 'Health & Wellness'
  | 'Gift & Giving'
  | 'Routine Maintenance'
  | 'Investment'
  | 'Income Source'
  | 'Uncategorized';

export type InsightType =
  | 'Anomaly'
  | 'SavingsOpportunity'
  | 'TaxDeduction'
  | 'SubscriptionReview'
  | 'SpendingPattern'
  | 'IncomeSpike'
  | 'BudgetWarning'
  | 'CashflowAlert';

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  relatedTransactionIds: string[];
  suggestedActions?: { text: string; action: () => void }[];
}

export interface Transaction {
  id: string;
  date: string; // ISO 8601 format
  merchant: Merchant;
  amount: number;
  currency: CurrencyCode;
  type: TransactionType;
  status: TransactionStatus;
  category: string;
  userDescription?: string;
  notes?: string;
  receiptUrl?: string;
  tags: string[];
  paymentMethod: PaymentMethod;
  // Plato's Intelligence Suite Fields
  narrativeArchetype?: NarrativeArchetype;
  insights: AIInsight[];
  isAnomaly: boolean;
  potentialTaxDeduction: boolean;
  // Audit & Context fields
  deviceId: string;
  ipAddress: string;
  isRecurring: boolean;
}

export interface PaginatedTransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SortField = 'date' | 'merchant.name' | 'amount' | 'category';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  dateRange: { start?: string; end?: string };
  amountRange: { min?: number; max?: number };
  categories: string[];
  merchants: string[];
  types: TransactionType[];
  statuses: TransactionStatus[];
  narrativeArchetypes: NarrativeArchetype[];
  hasInsights: boolean;
  isAnomaly: boolean;
  potentialTaxDeduction: boolean;
}

export interface TransactionsViewState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  filters: FilterState;
  searchTerm: string;
  sort: SortState;
  selectedTransactionIds: Set<string>;
  activeTransactionId: string | null; // For modal/detail view
  allCategories: string[];
  allMerchants: string[];
  allNarrativeArchetypes: NarrativeArchetype[];
  globalInsights: AIInsight[];
}

//================================================================================================
// SECTION: MOCK DATA GENERATION
// Crafting a believable world. Every great story needs a rich setting.
// This is the genesis block of our financial universe, now expanded for greater fidelity.
//================================================================================================

const MOCK_MERCHANTS: Omit<Merchant, 'id' | 'location'>[] = [
    { name: 'Starbucks', category: 'Food & Drink', mcc: '5812', logoUrl: '/logos/starbucks.png' },
    { name: 'Amazon.com', category: 'Shopping', mcc: '5311', logoUrl: '/logos/amazon.png' },
    { name: 'Netflix', category: 'Entertainment', mcc: '5815', logoUrl: '/logos/netflix.png' },
    { name: 'Delta Airlines', category: 'Travel', mcc: '3001', logoUrl: '/logos/delta.png' },
    { name: 'Con Edison', category: 'Utilities', mcc: '4900', logoUrl: '/logos/conedison.png' },
    { name: 'Whole Foods Market', category: 'Groceries', mcc: '5411', logoUrl: '/logos/wholefoods.png' },
    { name: 'Uber', category: 'Transportation', mcc: '4121', logoUrl: '/logos/uber.png' },
    { name: 'Apple.com', category: 'Electronics', mcc: '5732', logoUrl: '/logos/apple.png' },
    { name: 'Equinox Gym', category: 'Health & Wellness', mcc: '7991', logoUrl: '/logos/equinox.png' },
    { name: 'The Home Depot', category: 'Home Improvement', mcc: '5200', logoUrl: '/logos/homedepot.png' },
    { name: 'AT&T', category: 'Bills & Utilities', mcc: '4814' },
    { name: 'Spotify', category: 'Entertainment', mcc: '5815' },
    { name: 'Seamless', category: 'Food