// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/types/index.ts
================================================================================


// --- Authentication & Identity ---
export interface UserSession {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  lastLogin: string;
}

export interface AuthResponse {
  isAuthenticated: boolean;
  user: UserSession | null;
}

export interface ClientRegisterRequest {
  client_name: string;
  redirect_uris: string[];
  scope: string[];
  appId?: string;
  description?: string;
}

export interface ClientRegisterResponse extends ClientRegisterRequest {
  client_id: string;
  client_secret: string;
  clientDisplayName?: string;
  grant_types?: string[];
  token_endpoint_auth_method?: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  middleName?: string;
  title?: string;
  suffix?: string;
  companyName?: string;
}

export interface CustomerAddress {
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  type: 'BUSINESS' | 'DELIVERY' | 'HOME' | 'MAILING';
}

export interface TelephoneNumber {
  type: 'BUSINESS' | 'CELL' | 'FAX' | 'HOME';
  country: string;
  number: string;
}

export interface CustomerProfileResponse {
  customer: Customer;
  contacts: {
    emails: string[];
    addresses: CustomerAddress[];
    phones: TelephoneNumber[];
  };
}

// --- Banking & Treasury (Citi/FDX compliant) ---
export type AccountGroup = 'CHECKING' | 'SAVINGS' | 'CREDITCARD' | 'LOAN' | 'LINEOFCREDIT' | 'BROKERAGE' | 'RETIREMENT';

export interface GroupBalance {
  localCurrencyCode: string;
  localCurrencyBalanceAmount: number;
}

export interface InternalAccount {
  id: string;
  productName: string;
  accountName?: string;
  accountNickname?: string;
  displayAccountNumber: string;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance: number;
  availableBalance: number;
  institutionName: string;
  connectionId: string;
}

export interface CheckingAccountDetails {
  productName: string;
  accountNickname?: string;
  accountDescription: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance: number;
  availableBalance: number;
}

export interface CreditCardAccountDetails {
  productName: string;
  accountDescription: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  availableCredit?: number;
  creditLimit?: number;
  currentBalance: number;
}

export interface AccountGroupDetails {
  accountGroup: AccountGroup;
  checkingAccountsDetails?: CheckingAccountDetails[];
  savingsAccountsDetails?: CheckingAccountDetails[];
  creditCardAccountsDetails?: CreditCardAccountDetails[];
  totalCurrentBalance?: GroupBalance;
  totalAvailableBalance?: GroupBalance;
}

export interface AccountsGroupDetailsList {
  accountGroupDetails: AccountGroupDetails[];
  customer?: { customerId: string };
}

export interface CitiTransaction {
  accountId: string;
  currencyCode: string;
  transactionAmount: number;
  transactionDate: string;
  transactionDescription: string;
  transactionId: string;
  transactionStatus: string;
  transactionType: string;
  displayAccountNumber: string;
}

export interface GetAccountTransactionsResp {
  checkingAccountTransactions?: CitiTransaction[];
  savingsAccountTransactions?: CitiTransaction[];
  creditCardAccountTransactions?: CitiTransaction[];
  loanAccountTransactions?: CitiTransaction[];
  lineOfCreditAccountTransactions?: CitiTransaction[];
  brokerageAccountTransactions?: CitiTransaction[];
}

export interface VirtualAccount {
  id: string;
  object?: string;
  live_mode?: boolean;
  created_at: string;
  updated_at?: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED';
  internal_account_id: string;
  counterparty_id?: string | null;
  account_details?: any[];
  routing_details?: any[];
}

export interface Counterparty {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  createdAt: string;
  accounts?: Array<{
    id: string;
    accountType: string;
    accountNumber: string;
  }>;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  itemizable_id?: string;
  itemizable_type?: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

// --- Intelligence & Oracle ---
export interface AIInsight {
  id: string;
  title?: string;
  description?: string;
  severity?: 'INFO' | 'CRITICAL';
  type?: 'opportunity' | 'warning' | 'neutral' | 'alpha' | string;
  message?: string;
  confidence?: number;
  timestamp?: string;
  actionable?: boolean;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

// --- Crypto & Decentralized Assets ---

/* fix: expanded CoinMarketData to include all properties used in cryptoService.ts */
export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any | null;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

/* fix: added CoinDetail interface missing from types/index.ts but used in cryptoService.ts */
export interface CoinDetail extends CoinMarketData {
  description: { [key: string]: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: any;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: any[];
    };
  };
  genesis_date: string | null;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
}

/* fix: added TrendingCoin interface missing from types/index.ts but used in cryptoService.ts */
export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data: {
      price: number;
      price_btc: string;
      price_change_percentage_24h: { [key: string]: number };
      market_cap: string;
      total_volume: string;
      sparkline: string;
    };
  };
}

/* fix: added SearchResult interface missing from types/index.ts but used in cryptoService.ts */
export interface SearchResult {
  coins: Array<{
    id: string;
    name: string;
    api_symbol: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
  }>;
  exchanges: any[];
  nfts: any[];
  categories: any[];
}

/* fix: expanded GlobalData to include all properties used in cryptoService.ts */
export interface GlobalData {
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
  markets: number;
  total_market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

export interface AITradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'error';
  pnl: number;
  uptime: string;
}

export interface GeneratedNFT {
  name: string;
  description: string;
  imageUrl: string;
  traits: Array<{ trait_type: string; value: string | number }>;
}

// --- System & Connectivity ---
export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface AccountCollectionFlow {
  id: string;
  object: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  client_token: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  counterparty_id: string;
  external_account_id: string | null;
  payment_types: string[];
}

export interface PaymentFlow {
  id: string;
  object: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  client_token: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  amount: number;
  currency: string;
  direction: 'debit';
  counterparty_id: string | null;
  receiving_account_id: string | null;
  originating_account_id: string | null;
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/types/index.ts
================================================================================


// --- Authentication & Identity ---
export interface UserSession {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  lastLogin: string;
}

export interface AuthResponse {
  isAuthenticated: boolean;
  user: UserSession | null;
}

export interface ClientRegisterRequest {
  client_name: string;
  redirect_uris: string[];
  scope: string[];
  appId?: string;
  description?: string;
}

export interface ClientRegisterResponse extends ClientRegisterRequest {
  client_id: string;
  client_secret: string;
  clientDisplayName?: string;
  grant_types?: string[];
  token_endpoint_auth_method?: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  middleName?: string;
  title?: string;
  suffix?: string;
  companyName?: string;
}

export interface CustomerAddress {
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  type: 'BUSINESS' | 'DELIVERY' | 'HOME' | 'MAILING';
}

export interface TelephoneNumber {
  type: 'BUSINESS' | 'CELL' | 'FAX' | 'HOME';
  country: string;
  number: string;
}

export interface CustomerProfileResponse {
  customer: Customer;
  contacts: {
    emails: string[];
    addresses: CustomerAddress[];
    phones: TelephoneNumber[];
  };
}

// --- Banking & Treasury (Citi/FDX compliant) ---
export type AccountGroup = 'CHECKING' | 'SAVINGS' | 'CREDITCARD' | 'LOAN' | 'LINEOFCREDIT' | 'BROKERAGE' | 'RETIREMENT';

export interface GroupBalance {
  localCurrencyCode: string;
  localCurrencyBalanceAmount: number;
}

export interface InternalAccount {
  id: string;
  productName: string;
  accountName?: string;
  accountNickname?: string;
  displayAccountNumber: string;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance: number;
  availableBalance: number;
  institutionName: string;
  connectionId: string;
}

export interface CheckingAccountDetails {
  productName: string;
  accountNickname?: string;
  accountDescription: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance: number;
  availableBalance: number;
}

export interface CreditCardAccountDetails {
  productName: string;
  accountDescription: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  availableCredit?: number;
  creditLimit?: number;
  currentBalance: number;
}

export interface AccountGroupDetails {
  accountGroup: AccountGroup;
  checkingAccountsDetails?: CheckingAccountDetails[];
  savingsAccountsDetails?: CheckingAccountDetails[];
  creditCardAccountsDetails?: CreditCardAccountDetails[];
  totalCurrentBalance?: GroupBalance;
  totalAvailableBalance?: GroupBalance;
}

export interface AccountsGroupDetailsList {
  accountGroupDetails: AccountGroupDetails[];
  customer?: { customerId: string };
}

export interface CitiTransaction {
  accountId: string;
  currencyCode: string;
  transactionAmount: number;
  transactionDate: string;
  transactionDescription: string;
  transactionId: string;
  transactionStatus: string;
  transactionType: string;
  displayAccountNumber: string;
}

export interface GetAccountTransactionsResp {
  checkingAccountTransactions?: CitiTransaction[];
  savingsAccountTransactions?: CitiTransaction[];
  creditCardAccountTransactions?: CitiTransaction[];
  loanAccountTransactions?: CitiTransaction[];
  lineOfCreditAccountTransactions?: CitiTransaction[];
  brokerageAccountTransactions?: CitiTransaction[];
}

export interface VirtualAccount {
  id: string;
  object?: string;
  live_mode?: boolean;
  created_at: string;
  updated_at?: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED';
  internal_account_id: string;
  counterparty_id?: string | null;
  account_details?: any[];
  routing_details?: any[];
}

export interface Counterparty {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  createdAt: string;
  accounts?: Array<{
    id: string;
    accountType: string;
    accountNumber: string;
  }>;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  itemizable_id?: string;
  itemizable_type?: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

// --- Intelligence & Oracle ---
export interface AIInsight {
  id: string;
  title?: string;
  description?: string;
  severity?: 'INFO' | 'CRITICAL';
  type?: 'opportunity' | 'warning' | 'neutral' | 'alpha' | string;
  message?: string;
  confidence?: number;
  timestamp?: string;
  actionable?: boolean;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

// --- Crypto & Decentralized Assets ---

/* fix: expanded CoinMarketData to include all properties used in cryptoService.ts */
export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any | null;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

/* fix: added CoinDetail interface missing from types/index.ts but used in cryptoService.ts */
export interface CoinDetail extends CoinMarketData {
  description: { [key: string]: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: any;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: any[];
    };
  };
  genesis_date: string | null;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
}

/* fix: added TrendingCoin interface missing from types/index.ts but used in cryptoService.ts */
export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data: {
      price: number;
      price_btc: string;
      price_change_percentage_24h: { [key: string]: number };
      market_cap: string;
      total_volume: string;
      sparkline: string;
    };
  };
}

/* fix: added SearchResult interface missing from types/index.ts but used in cryptoService.ts */
export interface SearchResult {
  coins: Array<{
    id: string;
    name: string;
    api_symbol: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
  }>;
  exchanges: any[];
  nfts: any[];
  categories: any[];
}

/* fix: expanded GlobalData to include all properties used in cryptoService.ts */
export interface GlobalData {
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
  markets: number;
  total_market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

export interface AITradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'error';
  pnl: number;
  uptime: string;
}

export interface GeneratedNFT {
  name: string;
  description: string;
  imageUrl: string;
  traits: Array<{ trait_type: string; value: string | number }>;
}

// --- System & Connectivity ---
export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface AccountCollectionFlow {
  id: string;
  object: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  client_token: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  counterparty_id: string;
  external_account_id: string | null;
  payment_types: string[];
}

export interface PaymentFlow {
  id: string;
  object: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  client_token: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  amount: number;
  currency: string;
  direction: 'debit';
  counterparty_id: string | null;
  receiving_account_id: string | null;
  originating_account_id: string | null;
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/types/index.ts
================================================================================


// --- Authentication & Identity ---
export interface UserSession {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  lastLogin: string;
}

export interface AuthResponse {
  isAuthenticated: boolean;
  user: UserSession | null;
}

export interface ClientRegisterRequest {
  client_name: string;
  redirect_uris: string[];
  scope: string[];
  appId?: string;
  description?: string;
}

export interface ClientRegisterResponse extends ClientRegisterRequest {
  client_id: string;
  client_secret: string;
  clientDisplayName?: string;
  grant_types?: string[];
  token_endpoint_auth_method?: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  middleName?: string;
  title?: string;
  suffix?: string;
  companyName?: string;
}

export interface CustomerAddress {
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  type: 'BUSINESS' | 'DELIVERY' | 'HOME' | 'MAILING';
}

export interface TelephoneNumber {
  type: 'BUSINESS' | 'CELL' | 'FAX' | 'HOME';
  country: string;
  number: string;
}

export interface CustomerProfileResponse {
  customer: Customer;
  contacts: {
    emails: string[];
    addresses: CustomerAddress[];
    phones: TelephoneNumber[];
  };
}

// --- Banking & Treasury (Citi/FDX compliant) ---
export type AccountGroup = 'CHECKING' | 'SAVINGS' | 'CREDITCARD' | 'LOAN' | 'LINEOFCREDIT' | 'BROKERAGE' | 'RETIREMENT';

export interface GroupBalance {
  localCurrencyCode: string;
  localCurrencyBalanceAmount: number;
}

export interface InternalAccount {
  id: string;
  productName: string;
  accountName?: string;
  accountNickname?: string;
  displayAccountNumber: string;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance: number;
  availableBalance: number;
  institutionName: string;
  connectionId: string;
}

export interface CheckingAccountDetails {
  productName: string;
  accountNickname?: string;
  accountDescription: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  currentBalance: number;
  availableBalance: number;
}

export interface CreditCardAccountDetails {
  productName: string;
  accountDescription: string;
  balanceType: 'ASSET' | 'LIABILITY';
  displayAccountNumber: string;
  accountId: string;
  currencyCode: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  availableCredit?: number;
  creditLimit?: number;
  currentBalance: number;
}

export interface AccountGroupDetails {
  accountGroup: AccountGroup;
  checkingAccountsDetails?: CheckingAccountDetails[];
  savingsAccountsDetails?: CheckingAccountDetails[];
  creditCardAccountsDetails?: CreditCardAccountDetails[];
  totalCurrentBalance?: GroupBalance;
  totalAvailableBalance?: GroupBalance;
}

export interface AccountsGroupDetailsList {
  accountGroupDetails: AccountGroupDetails[];
  customer?: { customerId: string };
}

export interface CitiTransaction {
  accountId: string;
  currencyCode: string;
  transactionAmount: number;
  transactionDate: string;
  transactionDescription: string;
  transactionId: string;
  transactionStatus: string;
  transactionType: string;
  displayAccountNumber: string;
}

export interface GetAccountTransactionsResp {
  checkingAccountTransactions?: CitiTransaction[];
  savingsAccountTransactions?: CitiTransaction[];
  creditCardAccountTransactions?: CitiTransaction[];
  loanAccountTransactions?: CitiTransaction[];
  lineOfCreditAccountTransactions?: CitiTransaction[];
  brokerageAccountTransactions?: CitiTransaction[];
}

export interface VirtualAccount {
  id: string;
  object?: string;
  live_mode?: boolean;
  created_at: string;
  updated_at?: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED';
  internal_account_id: string;
  counterparty_id?: string | null;
  account_details?: any[];
  routing_details?: any[];
}

export interface Counterparty {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  createdAt: string;
  accounts?: Array<{
    id: string;
    accountType: string;
    accountNumber: string;
  }>;
}

export interface LineItem {
  id: string;
  amount: number;
  currency: string;
  description: string;
  ledger_account_id: string;
  itemizable_id?: string;
  itemizable_type?: string;
  createdAt: string;
}

export interface LineItemUpdateRequest {
  description?: string;
  metadata?: Record<string, any>;
}

// --- Intelligence & Oracle ---
export interface AIInsight {
  id: string;
  title?: string;
  description?: string;
  severity?: 'INFO' | 'CRITICAL';
  type?: 'opportunity' | 'warning' | 'neutral' | 'alpha' | string;
  message?: string;
  confidence?: number;
  timestamp?: string;
  actionable?: boolean;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

// --- Crypto & Decentralized Assets ---

/* fix: expanded CoinMarketData to include all properties used in cryptoService.ts */
export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any | null;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

/* fix: added CoinDetail interface missing from types/index.ts but used in cryptoService.ts */
export interface CoinDetail extends CoinMarketData {
  description: { [key: string]: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: any;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: any[];
    };
  };
  genesis_date: string | null;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
}

/* fix: added TrendingCoin interface missing from types/index.ts but used in cryptoService.ts */
export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data: {
      price: number;
      price_btc: string;
      price_change_percentage_24h: { [key: string]: number };
      market_cap: string;
      total_volume: string;
      sparkline: string;
    };
  };
}

/* fix: added SearchResult interface missing from types/index.ts but used in cryptoService.ts */
export interface SearchResult {
  coins: Array<{
    id: string;
    name: string;
    api_symbol: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
  }>;
  exchanges: any[];
  nfts: any[];
  categories: any[];
}

/* fix: expanded GlobalData to include all properties used in cryptoService.ts */
export interface GlobalData {
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
  markets: number;
  total_market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

export interface AITradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'error';
  pnl: number;
  uptime: string;
}

export interface GeneratedNFT {
  name: string;
  description: string;
  imageUrl: string;
  traits: Array<{ trait_type: string; value: string | number }>;
}

// --- System & Connectivity ---
export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface Document {
  id: string;
  documentableId: string;
  documentableType: string;
  documentType: string;
  fileName: string;
  size: number;
  createdAt: string;
  format: string;
}

export interface AccountCollectionFlow {
  id: string;
  object: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  client_token: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  counterparty_id: string;
  external_account_id: string | null;
  payment_types: string[];
}

export interface PaymentFlow {
  id: string;
  object: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  client_token: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  amount: number;
  currency: string;
  direction: 'debit';
  counterparty_id: string | null;
  receiving_account_id: string | null;
  originating_account_id: string | null;
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/index.ts
================================================================================

// types/index.ts
// This file has been refactored to act as a central barrel file.
// It aggregates and exports all type definitions from the new, modularized
// files located in the `/types/models` directory. This approach improves organization
// and maintainability while ensuring that all existing component imports
// continue to work without any changes.

export * from './models';
export * from './models/megadashboard';
export * from './models/integration';