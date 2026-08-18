// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/types/models.ts
================================================================================


export interface CurrencyBasedValue {
  alternateAmount?: number;
  baseAmount?: number;
}

export interface CurrencyCurrentValue {
  alternateAmountValue?: string[];
  baseAmountValue?: string[];
}

export interface Balances {
  marketValue?: { currencyBasedValue: CurrencyBasedValue };
  currentValue?: { currencyCurrentValue: CurrencyCurrentValue };
  availableBalance?: { currencyBasedValue: CurrencyBasedValue };
  accruedInterest?: { currencyBasedValue: CurrencyBasedValue };
  unrealisedGainLoss?: { currencyBasedValue: CurrencyBasedValue };
  totalBasis?: { currencyBasedValue: CurrencyBasedValue };
  yearToDateIncome?: { currencyBasedValue: CurrencyBasedValue };
  ytdRealizedGainLoss?: { currencyBasedValue: CurrencyBasedValue };
  estimatedAnnualIncome?: { currencyBasedValue: CurrencyBasedValue };
}

export interface BasicAccountDetails {
  displayAccountNumber: string;
  accountId: string;
  accountOpenDate: string;
  relationshipId: string;
  accountType: string;
  accountAlternateCurrencyCode: string;
  accountBaseCurrencyCode: string;
  productCode: string;
  subProductCode: string;
  accountName: string;
  accountNickname: string;
  accountDescription: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  accountGroupId: string;
  accountGroupTitle: string;
  accountGroupStatus: string;
  balances: Balances;
}

// --- Citi OpenAPI v2.0.0 Interfaces ---

export type AccountGroup = 'CHECKING' | 'SAVINGS' | 'CREDITCARD' | 'LOAN' | 'LINEOFCREDIT' | 'BROKERAGE' | 'RETIREMENT';

export interface GroupBalance {
  localCurrencyCode: string;
  localCurrencyBalanceAmount: number;
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

export interface CitiCustomer {
  customerId: string;
}

export interface AccountsGroupDetailsList {
  accountGroupDetails: AccountGroupDetails[];
  customer?: CitiCustomer;
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

// --- End Citi Interfaces ---

export interface AccountSummary {
  accountGroup: string;
  checking?: BasicAccountDetails[];
  savings?: BasicAccountDetails[];
  deposits?: BasicAccountDetails[];
  securitydeposits?: BasicAccountDetails[];
  timedeposits?: BasicAccountDetails[];
  investments?: BasicAccountDetails[];
  trust?: BasicAccountDetails[];
  custody?: BasicAccountDetails[];
  creditcards?: BasicAccountDetails[];
  loans?: BasicAccountDetails[];
  escrow?: BasicAccountDetails[];
}

export interface TransactionList {
  transactionDateTime: string;
  transactionId: string;
  transactionReferenceNumber: string;
  transactionStatus: string;
  transactionType: string;
  transactionDescription: string;
  alternateCurrencyTransactionAmount: number;
  baseCurrencyTransactionAmount: number;
  transactionQuantity: number;
  alternateCurrencyCode: string;
  baseCurrencyCode: string;
  cusipNumber?: string;
  tickerSymbol?: string;
  assetClass?: string;
}

export interface RetrieveAccountSummaryResponse {
  accountSummary: AccountSummary[];
}

export interface RetrieveTransactionDetailsResponse {
  transactionlist: TransactionList[];
  accountId: string;
  accountName: string;
  accountType: string;
  displayAccountNumber: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface CustomerProfileResponse {
  customer: {
    firstName: string;
    lastName: string;
    middleName?: string;
    title?: string;
    suffix?: string;
    companyName?: string;
  };
  contacts: {
    emails: string[];
    addresses: Array<{
      addressLine1: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
      type: string;
    }>;
    phones: Array<{
      type: string;
      country: string;
      number: string;
    }>;
  };
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

export interface VirtualAccount {
  id: string;
  object: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  counterparty_id: string | null;
  internal_account_id: string;
  account_details: any[];
  routing_details: any[];
  status?: 'ACTIVE' | 'PENDING' | 'CLOSED';
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

export interface AITradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'error';
  pnl: number;
  uptime: string;
}

export interface AIInsight {
  id: string;
  type: string;
  message: string;
  confidence: number;
  timestamp: string;
  actionable: boolean;
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
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

export interface Counterparty {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  createdAt: string;
  metadata?: Record<string, any>;
  accounts?: Array<{
    id: string;
    accountType: string;
    accountNumber: string;
  }>;
}

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

export interface HFTOrder {
  id: string;
  pair: string;
  type: 'LIMIT' | 'MARKET';
  side: 'BUY' | 'SELL';
  price: number;
  amount: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  timestamp: string;
}

export interface GovernanceProposal {
  id: string;
  protocol: string;
  protocolIcon: string;
  title: string;
  status: 'active' | 'passed' | 'failed';
  userVote?: 'for' | 'against' | 'abstain';
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/types/models.ts
================================================================================


export interface CurrencyBasedValue {
  alternateAmount?: number;
  baseAmount?: number;
}

export interface CurrencyCurrentValue {
  alternateAmountValue?: string[];
  baseAmountValue?: string[];
}

export interface Balances {
  marketValue?: { currencyBasedValue: CurrencyBasedValue };
  currentValue?: { currencyCurrentValue: CurrencyCurrentValue };
  availableBalance?: { currencyBasedValue: CurrencyBasedValue };
  accruedInterest?: { currencyBasedValue: CurrencyBasedValue };
  unrealisedGainLoss?: { currencyBasedValue: CurrencyBasedValue };
  totalBasis?: { currencyBasedValue: CurrencyBasedValue };
  yearToDateIncome?: { currencyBasedValue: CurrencyBasedValue };
  ytdRealizedGainLoss?: { currencyBasedValue: CurrencyBasedValue };
  estimatedAnnualIncome?: { currencyBasedValue: CurrencyBasedValue };
}

export interface BasicAccountDetails {
  displayAccountNumber: string;
  accountId: string;
  accountOpenDate: string;
  relationshipId: string;
  accountType: string;
  accountAlternateCurrencyCode: string;
  accountBaseCurrencyCode: string;
  productCode: string;
  subProductCode: string;
  accountName: string;
  accountNickname: string;
  accountDescription: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  accountGroupId: string;
  accountGroupTitle: string;
  accountGroupStatus: string;
  balances: Balances;
}

// --- Citi OpenAPI v2.0.0 Interfaces ---

export type AccountGroup = 'CHECKING' | 'SAVINGS' | 'CREDITCARD' | 'LOAN' | 'LINEOFCREDIT' | 'BROKERAGE' | 'RETIREMENT';

export interface GroupBalance {
  localCurrencyCode: string;
  localCurrencyBalanceAmount: number;
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

export interface CitiCustomer {
  customerId: string;
}

export interface AccountsGroupDetailsList {
  accountGroupDetails: AccountGroupDetails[];
  customer?: CitiCustomer;
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

// --- End Citi Interfaces ---

export interface AccountSummary {
  accountGroup: string;
  checking?: BasicAccountDetails[];
  savings?: BasicAccountDetails[];
  deposits?: BasicAccountDetails[];
  securitydeposits?: BasicAccountDetails[];
  timedeposits?: BasicAccountDetails[];
  investments?: BasicAccountDetails[];
  trust?: BasicAccountDetails[];
  custody?: BasicAccountDetails[];
  creditcards?: BasicAccountDetails[];
  loans?: BasicAccountDetails[];
  escrow?: BasicAccountDetails[];
}

export interface TransactionList {
  transactionDateTime: string;
  transactionId: string;
  transactionReferenceNumber: string;
  transactionStatus: string;
  transactionType: string;
  transactionDescription: string;
  alternateCurrencyTransactionAmount: number;
  baseCurrencyTransactionAmount: number;
  transactionQuantity: number;
  alternateCurrencyCode: string;
  baseCurrencyCode: string;
  cusipNumber?: string;
  tickerSymbol?: string;
  assetClass?: string;
}

export interface RetrieveAccountSummaryResponse {
  accountSummary: AccountSummary[];
}

export interface RetrieveTransactionDetailsResponse {
  transactionlist: TransactionList[];
  accountId: string;
  accountName: string;
  accountType: string;
  displayAccountNumber: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface CustomerProfileResponse {
  customer: {
    firstName: string;
    lastName: string;
    middleName?: string;
    title?: string;
    suffix?: string;
    companyName?: string;
  };
  contacts: {
    emails: string[];
    addresses: Array<{
      addressLine1: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
      type: string;
    }>;
    phones: Array<{
      type: string;
      country: string;
      number: string;
    }>;
  };
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

export interface VirtualAccount {
  id: string;
  object: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  counterparty_id: string | null;
  internal_account_id: string;
  account_details: any[];
  routing_details: any[];
  status?: 'ACTIVE' | 'PENDING' | 'CLOSED';
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

export interface AITradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'error';
  pnl: number;
  uptime: string;
}

export interface AIInsight {
  id: string;
  type: string;
  message: string;
  confidence: number;
  timestamp: string;
  actionable: boolean;
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
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

export interface Counterparty {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  createdAt: string;
  metadata?: Record<string, any>;
  accounts?: Array<{
    id: string;
    accountType: string;
    accountNumber: string;
  }>;
}

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

export interface HFTOrder {
  id: string;
  pair: string;
  type: 'LIMIT' | 'MARKET';
  side: 'BUY' | 'SELL';
  price: number;
  amount: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  timestamp: string;
}

export interface GovernanceProposal {
  id: string;
  protocol: string;
  protocolIcon: string;
  title: string;
  status: 'active' | 'passed' | 'failed';
  userVote?: 'for' | 'against' | 'abstain';
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/types/models.ts
================================================================================


export interface CurrencyBasedValue {
  alternateAmount?: number;
  baseAmount?: number;
}

export interface CurrencyCurrentValue {
  alternateAmountValue?: string[];
  baseAmountValue?: string[];
}

export interface Balances {
  marketValue?: { currencyBasedValue: CurrencyBasedValue };
  currentValue?: { currencyCurrentValue: CurrencyCurrentValue };
  availableBalance?: { currencyBasedValue: CurrencyBasedValue };
  accruedInterest?: { currencyBasedValue: CurrencyBasedValue };
  unrealisedGainLoss?: { currencyBasedValue: CurrencyBasedValue };
  totalBasis?: { currencyBasedValue: CurrencyBasedValue };
  yearToDateIncome?: { currencyBasedValue: CurrencyBasedValue };
  ytdRealizedGainLoss?: { currencyBasedValue: CurrencyBasedValue };
  estimatedAnnualIncome?: { currencyBasedValue: CurrencyBasedValue };
}

export interface BasicAccountDetails {
  displayAccountNumber: string;
  accountId: string;
  accountOpenDate: string;
  relationshipId: string;
  accountType: string;
  accountAlternateCurrencyCode: string;
  accountBaseCurrencyCode: string;
  productCode: string;
  subProductCode: string;
  accountName: string;
  accountNickname: string;
  accountDescription: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  accountGroupId: string;
  accountGroupTitle: string;
  accountGroupStatus: string;
  balances: Balances;
}

// --- Citi OpenAPI v2.0.0 Interfaces ---

export type AccountGroup = 'CHECKING' | 'SAVINGS' | 'CREDITCARD' | 'LOAN' | 'LINEOFCREDIT' | 'BROKERAGE' | 'RETIREMENT';

export interface GroupBalance {
  localCurrencyCode: string;
  localCurrencyBalanceAmount: number;
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

export interface CitiCustomer {
  customerId: string;
}

export interface AccountsGroupDetailsList {
  accountGroupDetails: AccountGroupDetails[];
  customer?: CitiCustomer;
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

// --- End Citi Interfaces ---

export interface AccountSummary {
  accountGroup: string;
  checking?: BasicAccountDetails[];
  savings?: BasicAccountDetails[];
  deposits?: BasicAccountDetails[];
  securitydeposits?: BasicAccountDetails[];
  timedeposits?: BasicAccountDetails[];
  investments?: BasicAccountDetails[];
  trust?: BasicAccountDetails[];
  custody?: BasicAccountDetails[];
  creditcards?: BasicAccountDetails[];
  loans?: BasicAccountDetails[];
  escrow?: BasicAccountDetails[];
}

export interface TransactionList {
  transactionDateTime: string;
  transactionId: string;
  transactionReferenceNumber: string;
  transactionStatus: string;
  transactionType: string;
  transactionDescription: string;
  alternateCurrencyTransactionAmount: number;
  baseCurrencyTransactionAmount: number;
  transactionQuantity: number;
  alternateCurrencyCode: string;
  baseCurrencyCode: string;
  cusipNumber?: string;
  tickerSymbol?: string;
  assetClass?: string;
}

export interface RetrieveAccountSummaryResponse {
  accountSummary: AccountSummary[];
}

export interface RetrieveTransactionDetailsResponse {
  transactionlist: TransactionList[];
  accountId: string;
  accountName: string;
  accountType: string;
  displayAccountNumber: string;
}

export interface SimulationResult {
  outcomeNarrative: string;
  projectedValue: number;
  confidenceScore: number;
  status: string;
  simulationId: string;
  keyRisks?: string[];
}

export interface Connection {
  id: string;
  vendorCustomerId: string;
  entity: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncedAt: string;
}

export interface CustomerProfileResponse {
  customer: {
    firstName: string;
    lastName: string;
    middleName?: string;
    title?: string;
    suffix?: string;
    companyName?: string;
  };
  contacts: {
    emails: string[];
    addresses: Array<{
      addressLine1: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
      type: string;
    }>;
    phones: Array<{
      type: string;
      country: string;
      number: string;
    }>;
  };
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

export interface VirtualAccount {
  id: string;
  object: string;
  live_mode: boolean;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  counterparty_id: string | null;
  internal_account_id: string;
  account_details: any[];
  routing_details: any[];
  status?: 'ACTIVE' | 'PENDING' | 'CLOSED';
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

export interface AITradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'error';
  pnl: number;
  uptime: string;
}

export interface AIInsight {
  id: string;
  type: string;
  message: string;
  confidence: number;
  timestamp: string;
  actionable: boolean;
}

export interface Payee {
  payeeId: string;
  displayName: string;
  merchantName: string;
  status: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

export interface Payment {
  paymentId: string;
  amount: number;
  status: string;
  dueDate: string;
  toPayeeId: string;
  fromAccountId: string;
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

export interface Counterparty {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  createdAt: string;
  metadata?: Record<string, any>;
  accounts?: Array<{
    id: string;
    accountType: string;
    accountNumber: string;
  }>;
}

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

export interface HFTOrder {
  id: string;
  pair: string;
  type: 'LIMIT' | 'MARKET';
  side: 'BUY' | 'SELL';
  price: number;
  amount: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  timestamp: string;
}

export interface GovernanceProposal {
  id: string;
  protocol: string;
  protocolIcon: string;
  title: string;
  status: 'active' | 'passed' | 'failed';
  userVote?: 'for' | 'against' | 'abstain';
}
