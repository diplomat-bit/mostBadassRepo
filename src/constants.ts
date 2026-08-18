// REPOSITORY SOURCE: diplomat-bit/aibankingnew | PATH: diplomat-bit-aibankingnew-a0c4868/src/constants.ts
================================================================================

import { Account, Transaction, ApiDefinition } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'Main Checking', balance: 12450.85, type: 'checking', accountNumber: '**** 4582' },
  { id: '2', name: 'Emergency Fund', balance: 45000.00, type: 'savings', accountNumber: '**** 9102' },
  { id: '3', name: 'Tech Portfolio', balance: 8520.40, type: 'investment', accountNumber: '**** 3321' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-03-15', amount: 120.50, category: 'Dining', description: 'The Green Bistro', type: 'expense', status: 'completed' },
  { id: 't2', date: '2024-03-14', amount: 2500.00, category: 'Salary', description: 'TechCorp Monthly Pay', type: 'income', status: 'completed' },
  { id: 't3', date: '2024-03-13', amount: 45.00, category: 'Transport', description: 'Uber Trip', type: 'expense', status: 'completed' },
  { id: 't4', date: '2024-03-12', amount: 89.99, category: 'Shopping', description: 'Amazon.com', type: 'expense', status: 'completed' },
  { id: 't5', date: '2024-03-11', amount: 15.00, category: 'Entertainment', description: 'Netflix Subscription', type: 'expense', status: 'completed' },
  { id: 't6', date: '2024-03-10', amount: 350.00, category: 'Utilities', description: 'City Power & Water', type: 'expense', status: 'pending' },
];

export const MOCK_APIS: ApiDefinition[] = [
  { id: 'api-repeating-terminate', name: 'Repeating Payments Termination', version: '1.0.1', status: 'active', endpoints: 1, lastSync: '2024-03-15 16:00' },
  { id: 'api-sepa', name: 'SEPA Transfer Confirmation', version: '1.0.0', status: 'active', endpoints: 1, lastSync: '2024-03-15 16:10' },
  { id: 'api-payee-eligibility', name: 'Payee Eligibility Retrieval', version: '1.16.0', status: 'active', endpoints: 1, lastSync: '2024-03-15 16:20' },
  { id: 'api-repeating-inquiry', name: 'Repeating Payments Management', version: '1.2.0', status: 'active', endpoints: 4, lastSync: '2024-03-15 16:30' },
  { id: 'api-adhoc-transfers', name: 'Adhoc Multiple Transfers', version: '1.4.0', status: 'active', endpoints: 2, lastSync: '2024-03-15 16:40' },
  { id: 'api-client-reg', name: 'Client Registration Management', version: '1.0.0', status: 'active', endpoints: 4, lastSync: '2024-03-15 15:00' },
  { id: 'api-token-mgmt', name: 'Partner OAuth2 Management', version: '1.3.0', status: 'active', endpoints: 4, lastSync: '2024-03-15 15:10' },
  { id: 'api-outage', name: 'Outage Maintenance', version: '1.0.0', status: 'active', endpoints: 1, lastSync: '2024-03-15 14:00' },
  { id: 'api-clear-data', name: 'Clear Data Retrieval', version: '1.0.1', status: 'active', endpoints: 1, lastSync: '2024-03-15 14:10' },
  { id: 'api-demographics', name: 'Customer Demographics', version: '1.0.0', status: 'active', endpoints: 1, lastSync: '2024-03-15 14:20' },
  { id: 'api-investments', name: 'Investment Transactions', version: '1.60.0', status: 'active', endpoints: 2, lastSync: '2024-03-15 13:00' },
  { id: 'api-transactions', name: 'Account Transactions & Details', version: '1.3.0', status: 'active', endpoints: 2, lastSync: '2024-03-15 12:00' },
  { id: 'api-balance-check', name: 'Balance Sufficiency Check', version: '1.0.0', status: 'active', endpoints: 1, lastSync: '2024-03-15 11:00' },
  { id: 'api-accounts', name: 'Account Listing & Details', version: '1.39.0', status: 'active', endpoints: 2, lastSync: '2024-03-15 10:00' },
  { id: 'api1', name: 'Plaid Core API', version: 'v2.1', status: 'active', endpoints: 24, lastSync: '2024-03-15 09:00' },
  { id: 'api2', name: 'Stripe Payments', version: 'v3.0', status: 'active', endpoints: 12, lastSync: '2024-03-14 15:30' },
  { id: 'api3', name: 'Coinbase Exchange', version: 'v1.5', status: 'inactive', endpoints: 8, lastSync: '2024-03-10 11:20' },
  { id: 'api-cards', name: 'Card Management API', version: '1.0.0', status: 'active', endpoints: 6, lastSync: '2024-03-15 17:00' },
  { id: 'api-profile', name: 'User Profile API', version: '1.2.0', status: 'active', endpoints: 4, lastSync: '2024-03-15 17:10' },
  { id: 'api-security', name: 'Security & Compliance', version: '2.0.0', status: 'active', endpoints: 10, lastSync: '2024-03-15 17:20' },
];


================================================================================
// APPENDED FROM REPO: diplomat-bit/gameover | ORIGINAL PATH: diplomat-bit-gameover-da1da3c/src/constants.ts
================================================================================

import { Account, Transaction, ApiDefinition } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'Main Checking', balance: 12450.85, type: 'checking', accountNumber: '**** 4582' },
  { id: '2', name: 'Emergency Fund', balance: 45000.00, type: 'savings', accountNumber: '**** 9102' },
  { id: '3', name: 'Tech Portfolio', balance: 8520.40, type: 'investment', accountNumber: '**** 3321' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-03-15', amount: 120.50, category: 'Dining', description: 'The Green Bistro', type: 'expense', status: 'completed' },
  { id: 't2', date: '2024-03-14', amount: 2500.00, category: 'Salary', description: 'TechCorp Monthly Pay', type: 'income', status: 'completed' },
  { id: 't3', date: '2024-03-13', amount: 45.00, category: 'Transport', description: 'Uber Trip', type: 'expense', status: 'completed' },
  { id: 't4', date: '2024-03-12', amount: 89.99, category: 'Shopping', description: 'Amazon.com', type: 'expense', status: 'completed' },
  { id: 't5', date: '2024-03-11', amount: 15.00, category: 'Entertainment', description: 'Netflix Subscription', type: 'expense', status: 'completed' },
  { id: 't6', date: '2024-03-10', amount: 350.00, category: 'Utilities', description: 'City Power & Water', type: 'expense', status: 'pending' },
];

export const MOCK_APIS: ApiDefinition[] = [
  { id: 'api-repeating-terminate', name: 'Repeating Payments Termination', version: '1.0.1', status: 'active', endpoints: 1, lastSync: '2024-03-15 16:00' },
  { id: 'api-sepa', name: 'SEPA Transfer Confirmation', version: '1.0.0', status: 'active', endpoints: 1, lastSync: '2024-03-15 16:10' },
  { id: 'api-payee-eligibility', name: 'Payee Eligibility Retrieval', version: '1.16.0', status: 'active', endpoints: 1, lastSync: '2024-03-15 16:20' },
  { id: 'api-repeating-inquiry', name: 'Repeating Payments Management', version: '1.2.0', status: 'active', endpoints: 4, lastSync: '2024-03-15 16:30' },
  { id: 'api-adhoc-transfers', name: 'Adhoc Multiple Transfers', version: '1.4.0', status: 'active', endpoints: 2, lastSync: '2024-03-15 16:40' },
  { id: 'api-client-reg', name: 'Client Registration Management', version: '1.0.0', status: 'active', endpoints: 4, lastSync: '2024-03-15 15:00' },
  { id: 'api-token-mgmt', name: 'Partner OAuth2 Management', version: '1.3.0', status: 'active', endpoints: 4, lastSync: '2024-03-15 15:10' },
  { id: 'api-outage', name: 'Outage Maintenance', version: '1.0.0', status: 'active', endpoints: 1, lastSync: '2024-03-15 14:00' },
  { id: 'api-clear-data', name: 'Clear Data Retrieval', version: '1.0.1', status: 'active', endpoints: 1, lastSync: '2024-03-15 14:10' },
  { id: 'api-demographics', name: 'Customer Demographics', version: '1.0.0', status: 'active', endpoints: 1, lastSync: '2024-03-15 14:20' },
  { id: 'api-investments', name: 'Investment Transactions', version: '1.60.0', status: 'active', endpoints: 2, lastSync: '2024-03-15 13:00' },
  { id: 'api-transactions', name: 'Account Transactions & Details', version: '1.3.0', status: 'active', endpoints: 2, lastSync: '2024-03-15 12:00' },
  { id: 'api-balance-check', name: 'Balance Sufficiency Check', version: '1.0.0', status: 'active', endpoints: 1, lastSync: '2024-03-15 11:00' },
  { id: 'api-accounts', name: 'Account Listing & Details', version: '1.39.0', status: 'active', endpoints: 2, lastSync: '2024-03-15 10:00' },
  { id: 'api1', name: 'Plaid Core API', version: 'v2.1', status: 'active', endpoints: 24, lastSync: '2024-03-15 09:00' },
  { id: 'api2', name: 'Stripe Payments', version: 'v3.0', status: 'active', endpoints: 12, lastSync: '2024-03-14 15:30' },
  { id: 'api3', name: 'Coinbase Exchange', version: 'v1.5', status: 'inactive', endpoints: 8, lastSync: '2024-03-10 11:20' },
  { id: 'api-cards', name: 'Card Management API', version: '1.0.0', status: 'active', endpoints: 6, lastSync: '2024-03-15 17:00' },
  { id: 'api-profile', name: 'User Profile API', version: '1.2.0', status: 'active', endpoints: 4, lastSync: '2024-03-15 17:10' },
  { id: 'api-security', name: 'Security & Compliance', version: '2.0.0', status: 'active', endpoints: 10, lastSync: '2024-03-15 17:20' },
];


================================================================================
// APPENDED FROM REPO: diplomat-bit/partnerportal-microsoft | ORIGINAL PATH: diplomat-bit-partnerportal-microsoft-81d9840/src/constants.ts
================================================================================

import { TransactionEntry, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'accounts',
    label: 'Accounts',
    icon: 'Wallet',
    children: [
      { id: 'checking', label: 'Checking Account' },
      { id: 'savings', label: 'Savings Account' },
      { id: 'credit-cards', label: 'Credit Cards' },
    ],
  },
  {
    id: 'payments',
    label: 'Payments & Transfers',
    icon: 'Send',
    children: [
      { id: 'transfer', label: 'Internal Transfer' },
      { id: 'bill-pay', label: 'Bill Pay' },
      { id: 'wire', label: 'Wire Transfer' },
    ],
  },
  {
    id: 'investments',
    label: 'Investments',
    icon: 'TrendingUp',
    children: [
      { id: 'portfolio', label: 'Portfolio Overview' },
      { id: 'trading', label: 'Trading' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
  },
];

export const MOCK_TRANSACTIONS: TransactionEntry[] = [
  {
    id: '1',
    date: '3/21/2026, 10:15:00 AM',
    description: 'Starbucks Coffee',
    category: 'Food & Drink',
    amount: -5.75,
    currency: 'USD',
    status: 'Completed',
    account: 'Checking (...4421)',
    merchant: 'Starbucks #1234',
    reference: 'TXN-99283-A'
  },
  {
    id: '2',
    date: '3/21/2026, 09:30:00 AM',
    description: 'Salary Deposit',
    category: 'Income',
    amount: 4500.00,
    currency: 'USD',
    status: 'Completed',
    account: 'Checking (...4421)',
    merchant: 'Acme Corp Payroll',
    reference: 'TXN-99284-B'
  },
  {
    id: '3',
    date: '3/20/2026, 06:45:00 PM',
    description: 'Amazon.com Order',
    category: 'Shopping',
    amount: -124.99,
    currency: 'USD',
    status: 'Pending',
    account: 'Credit Card (...8821)',
    merchant: 'Amazon.com',
    reference: 'TXN-99285-C'
  },
  {
    id: '4',
    date: '3/20/2026, 12:00:00 PM',
    description: 'Monthly Rent',
    category: 'Housing',
    amount: -1800.00,
    currency: 'USD',
    status: 'Completed',
    account: 'Checking (...4421)',
    merchant: 'City Property Mgmt',
    reference: 'TXN-99286-D'
  },
  {
    id: '5',
    date: '3/19/2026, 02:15:00 PM',
    description: 'Netflix Subscription',
    category: 'Entertainment',
    amount: -15.99,
    currency: 'USD',
    status: 'Completed',
    account: 'Credit Card (...8821)',
    merchant: 'Netflix.com',
    reference: 'TXN-99287-E'
  },
  {
    id: '6',
    date: '3/19/2026, 08:00:00 AM',
    description: 'Internal Transfer to Savings',
    category: 'Transfer',
    amount: -500.00,
    currency: 'USD',
    status: 'Completed',
    account: 'Checking (...4421)',
    merchant: 'Self',
    reference: 'TXN-99288-F'
  }
];
