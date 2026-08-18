// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/types/models.tsx
================================================================================


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

export interface InternalAccount {
  id: string;
  productName: string;
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

// --- FDX v6 Customer Profile Types ---
export interface CustomerAddress {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
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

export interface ContactsResponse {
  emails: string[];
  addresses: CustomerAddress[];
  phones: TelephoneNumber[];
}

export interface Customer {
  firstName: string;
  lastName: string;
  middleName?: string;
  title?: string;
  suffix?: string;
  companyName?: string;
}

export interface CustomerProfileResponse {
  customer: Customer;
  contacts: ContactsResponse;
}

// --- Terminal Specific Types ---
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

export interface AITradingBot {
  id: string;
  name: string;
  strategy: 'Arbitrage' | 'Momentum' | 'Mean Reversion';
  status: 'active' | 'paused' | 'error';
  pnl: number;
  uptime: string;
}

export interface GovernanceProposal {
  id: string;
  protocol: string;
  protocolIcon: string;
  title: string;
  status: 'active' | 'passed' | 'failed';
  userVote?: 'for' | 'against' | 'abstain';
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'neutral' | 'alpha';
  message: string;
  confidence: number;
  timestamp: string;
  actionable: boolean;
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/types/models.tsx
================================================================================


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

export interface InternalAccount {
  id: string;
  productName: string;
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

// --- FDX v6 Customer Profile Types ---
export interface CustomerAddress {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
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

export interface ContactsResponse {
  emails: string[];
  addresses: CustomerAddress[];
  phones: TelephoneNumber[];
}

export interface Customer {
  firstName: string;
  lastName: string;
  middleName?: string;
  title?: string;
  suffix?: string;
  companyName?: string;
}

export interface CustomerProfileResponse {
  customer: Customer;
  contacts: ContactsResponse;
}

// --- Terminal Specific Types ---
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

export interface AITradingBot {
  id: string;
  name: string;
  strategy: 'Arbitrage' | 'Momentum' | 'Mean Reversion';
  status: 'active' | 'paused' | 'error';
  pnl: number;
  uptime: string;
}

export interface GovernanceProposal {
  id: string;
  protocol: string;
  protocolIcon: string;
  title: string;
  status: 'active' | 'passed' | 'failed';
  userVote?: 'for' | 'against' | 'abstain';
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'neutral' | 'alpha';
  message: string;
  confidence: number;
  timestamp: string;
  actionable: boolean;
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/types/models.tsx
================================================================================


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

export interface InternalAccount {
  id: string;
  productName: string;
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

// --- FDX v6 Customer Profile Types ---
export interface CustomerAddress {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
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

export interface ContactsResponse {
  emails: string[];
  addresses: CustomerAddress[];
  phones: TelephoneNumber[];
}

export interface Customer {
  firstName: string;
  lastName: string;
  middleName?: string;
  title?: string;
  suffix?: string;
  companyName?: string;
}

export interface CustomerProfileResponse {
  customer: Customer;
  contacts: ContactsResponse;
}

// --- Terminal Specific Types ---
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

export interface AITradingBot {
  id: string;
  name: string;
  strategy: 'Arbitrage' | 'Momentum' | 'Mean Reversion';
  status: 'active' | 'paused' | 'error';
  pnl: number;
  uptime: string;
}

export interface GovernanceProposal {
  id: string;
  protocol: string;
  protocolIcon: string;
  title: string;
  status: 'active' | 'passed' | 'failed';
  userVote?: 'for' | 'against' | 'abstain';
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'neutral' | 'alpha';
  message: string;
  confidence: number;
  timestamp: string;
  actionable: boolean;
}
