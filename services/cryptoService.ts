// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/services/cryptoService.ts
================================================================================


import { CoinMarketData, CoinDetail, GlobalData, TrendingCoin, SearchResult } from '../types/index.ts';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export interface MarketChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

const MOCK_MARKETS: CoinMarketData[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 64231.50, market_cap: 1260000000000, market_cap_rank: 1, fully_diluted_valuation: 1350000000000, total_volume: 35000000000, high_24h: 65000, low_24h: 63000, price_change_24h: 1231, price_change_percentage_24h: 1.95, market_cap_change_24h: 24000000000, market_cap_change_percentage_24h: 1.9, circulating_supply: 19600000, total_supply: 21000000, max_supply: 21000000, ath: 73000, ath_change_percentage: -12, ath_date: '2024-03-14', atl: 67, atl_change_percentage: 95000, atl_date: '2013-07-06', roi: null, last_updated: new Date().toISOString(), sparkline_in_7d: { price: [63000, 63500, 64000, 63800, 64500, 65000, 64231] } },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3450.20, market_cap: 415000000000, market_cap_rank: 2, fully_diluted_valuation: 415000000000, total_volume: 15000000000, high_24h: 3550, low_24h: 3350, price_change_24h: 50, price_change_percentage_24h: 1.45, market_cap_change_24h: 5000000000, market_cap_change_percentage_24h: 1.4, circulating_supply: 120000000, total_supply: 120000000, max_supply: null, ath: 4878, ath_change_percentage: -29, ath_date: '2021-11-10', atl: 0.42, atl_change_percentage: 820000, atl_date: '2015-10-20', roi: null, last_updated: new Date().toISOString(), sparkline_in_7d: { price: [3300, 3350, 3400, 3380, 3450, 3500, 3450] } },
  { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 145.50, market_cap: 65000000000, market_cap_rank: 5, fully_diluted_valuation: 82000000000, total_volume: 4000000000, high_24h: 155, low_24h: 140, price_change_24h: -5, price_change_percentage_24h: -3.2, market_cap_change_24h: -2000000000, market_cap_change_percentage_24h: -3.1, circulating_supply: 445000000, total_supply: 570000000, max_supply: null, ath: 259, ath_change_percentage: -44, ath_date: '2021-11-06', atl: 0.50, atl_change_percentage: 29000, atl_date: '2020-05-11', roi: null, last_updated: new Date().toISOString(), sparkline_in_7d: { price: [150, 155, 152, 148, 145, 146, 145] } }
];

export const cryptoService = {
  ping: async () => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/ping`, { mode: 'cors' });
      return res.ok;
    } catch {
      return false;
    }
  },

  getMarkets: async (vsCurrency: string = 'usd', perPage: number = 10, page: number = 1): Promise<CoinMarketData[]> => {
    try {
      const res = await fetch(
        `${COINGECKO_BASE}/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h,7d`,
        { mode: 'cors' }
      );
      if (!res.ok) throw new Error('Market data fetch failed');
      return await res.json();
    } catch (error) {
      console.warn("Crypto API unavailable, using simulated node data", error);
      return MOCK_MARKETS.slice(0, perPage);
    }
  },

  getCoinById: async (id: string): Promise<CoinDetail | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/coins/${id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`, { mode: 'cors' });
      if (!res.ok) throw new Error('Coin details fetch failed');
      return await res.json();
    } catch (error) {
      console.warn(`Details for ${id} unavailable`, error);
      const mock = MOCK_MARKETS.find(m => m.id === id) as any;
      if (mock) {
        return {
          ...mock,
          description: { en: `Institutional-grade ledger summary for ${mock.name}. Handshake verified.` },
          links: { homepage: ['#'], blockchain_site: ['#'], official_forum_url: [], chat_url: [], announcement_url: [], twitter_screen_name: '', facebook_username: '', bitcointalk_thread_identifier: null, telegram_channel_identifier: '', subreddit_url: '', repos_url: { github: [], bitbucket: [] } },
          genesis_date: '2009-01-03',
          sentiment_votes_up_percentage: 85,
          sentiment_votes_down_percentage: 15
        };
      }
      return null;
    }
  },

  getMarketChart: async (id: string, days: string = '7', vsCurrency: string = 'usd'): Promise<MarketChartData | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=${vsCurrency}&days=${days}`, { mode: 'cors' });
      if (!res.ok) throw new Error('Market chart fetch failed');
      return await res.json();
    } catch (error) {
      console.warn(`Chart data for ${id} unavailable`, error);
      const mock = MOCK_MARKETS.find(m => m.id === id);
      if (mock) {
        const now = Date.now();
        const prices: [number, number][] = mock.sparkline_in_7d!.price.map((p, i) => [now - (7 - i) * 86400000, p]);
        return { prices, market_caps: [], total_volumes: [] };
      }
      return null;
    }
  },

  getGlobal: async (): Promise<GlobalData | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/global`, { mode: 'cors' });
      if (!res.ok) throw new Error('Global data fetch failed');
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.warn("Global market metrics unavailable", error);
      return {
        active_cryptocurrencies: 12400,
        upcoming_icos: 0,
        ongoing_icos: 42,
        ended_icos: 3401,
        markets: 900,
        total_market_cap: { usd: 2400000000000 },
        total_volume: { usd: 85000000000 },
        market_cap_percentage: { btc: 52.1, eth: 17.2 },
        market_cap_change_percentage_24h_usd: 1.2,
        updated_at: Date.now() / 1000
      };
    }
  },

  getTrending: async (): Promise<TrendingCoin[]> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/search/trending`, { mode: 'cors' });
      if (!res.ok) throw new Error('Trending fetch failed');
      const data = await res.json();
      return data.coins;
    } catch (error) {
      console.warn("Trending data unavailable", error);
      return MOCK_MARKETS.map((m, i) => ({
        item: {
          id: m.id,
          coin_id: i,
          name: m.name,
          symbol: m.symbol,
          market_cap_rank: m.market_cap_rank,
          thumb: m.image,
          small: m.image,
          large: m.image,
          slug: m.id,
          price_btc: 1,
          score: i,
          data: {
            price: m.current_price,
            price_btc: '1',
            price_change_percentage_24h: { usd: m.price_change_percentage_24h },
            market_cap: m.market_cap.toString(),
            total_volume: m.total_volume.toString(),
            sparkline: ''
          }
        }
      }));
    }
  },

  search: async (query: string): Promise<SearchResult | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/search?query=${query}`, { mode: 'cors' });
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    } catch (error) {
      console.warn(`Search for ${query} unavailable`, error);
      return {
        coins: MOCK_MARKETS.filter(m => m.name.toLowerCase().includes(query.toLowerCase())).map(m => ({
          id: m.id,
          name: m.name,
          api_symbol: m.symbol,
          symbol: m.symbol,
          market_cap_rank: m.market_cap_rank,
          thumb: m.image,
          large: m.image
        })),
        exchanges: [],
        nfts: [],
        categories: []
      };
    }
  }
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/services/cryptoService.ts
================================================================================


import { CoinMarketData, CoinDetail, GlobalData, TrendingCoin, SearchResult } from '../types/index.ts';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export interface MarketChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

const MOCK_MARKETS: CoinMarketData[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 64231.50, market_cap: 1260000000000, market_cap_rank: 1, fully_diluted_valuation: 1350000000000, total_volume: 35000000000, high_24h: 65000, low_24h: 63000, price_change_24h: 1231, price_change_percentage_24h: 1.95, market_cap_change_24h: 24000000000, market_cap_change_percentage_24h: 1.9, circulating_supply: 19600000, total_supply: 21000000, max_supply: 21000000, ath: 73000, ath_change_percentage: -12, ath_date: '2024-03-14', atl: 67, atl_change_percentage: 95000, atl_date: '2013-07-06', roi: null, last_updated: new Date().toISOString(), sparkline_in_7d: { price: [63000, 63500, 64000, 63800, 64500, 65000, 64231] } },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3450.20, market_cap: 415000000000, market_cap_rank: 2, fully_diluted_valuation: 415000000000, total_volume: 15000000000, high_24h: 3550, low_24h: 3350, price_change_24h: 50, price_change_percentage_24h: 1.45, market_cap_change_24h: 5000000000, market_cap_change_percentage_24h: 1.4, circulating_supply: 120000000, total_supply: 120000000, max_supply: null, ath: 4878, ath_change_percentage: -29, ath_date: '2021-11-10', atl: 0.42, atl_change_percentage: 820000, atl_date: '2015-10-20', roi: null, last_updated: new Date().toISOString(), sparkline_in_7d: { price: [3300, 3350, 3400, 3380, 3450, 3500, 3450] } },
  { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 145.50, market_cap: 65000000000, market_cap_rank: 5, fully_diluted_valuation: 82000000000, total_volume: 4000000000, high_24h: 155, low_24h: 140, price_change_24h: -5, price_change_percentage_24h: -3.2, market_cap_change_24h: -2000000000, market_cap_change_percentage_24h: -3.1, circulating_supply: 445000000, total_supply: 570000000, max_supply: null, ath: 259, ath_change_percentage: -44, ath_date: '2021-11-06', atl: 0.50, atl_change_percentage: 29000, atl_date: '2020-05-11', roi: null, last_updated: new Date().toISOString(), sparkline_in_7d: { price: [150, 155, 152, 148, 145, 146, 145] } }
];

export const cryptoService = {
  ping: async () => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/ping`, { mode: 'cors' });
      return res.ok;
    } catch {
      return false;
    }
  },

  getMarkets: async (vsCurrency: string = 'usd', perPage: number = 10, page: number = 1): Promise<CoinMarketData[]> => {
    try {
      const res = await fetch(
        `${COINGECKO_BASE}/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h,7d`,
        { mode: 'cors' }
      );
      if (!res.ok) throw new Error('Market data fetch failed');
      return await res.json();
    } catch (error) {
      console.warn("Crypto API unavailable, using simulated node data", error);
      return MOCK_MARKETS.slice(0, perPage);
    }
  },

  getCoinById: async (id: string): Promise<CoinDetail | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/coins/${id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`, { mode: 'cors' });
      if (!res.ok) throw new Error('Coin details fetch failed');
      return await res.json();
    } catch (error) {
      console.warn(`Details for ${id} unavailable`, error);
      const mock = MOCK_MARKETS.find(m => m.id === id) as any;
      if (mock) {
        return {
          ...mock,
          description: { en: `Institutional-grade ledger summary for ${mock.name}. Handshake verified.` },
          links: { homepage: ['#'], blockchain_site: ['#'], official_forum_url: [], chat_url: [], announcement_url: [], twitter_screen_name: '', facebook_username: '', bitcointalk_thread_identifier: null, telegram_channel_identifier: '', subreddit_url: '', repos_url: { github: [], bitbucket: [] } },
          genesis_date: '2009-01-03',
          sentiment_votes_up_percentage: 85,
          sentiment_votes_down_percentage: 15
        };
      }
      return null;
    }
  },

  getMarketChart: async (id: string, days: string = '7', vsCurrency: string = 'usd'): Promise<MarketChartData | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=${vsCurrency}&days=${days}`, { mode: 'cors' });
      if (!res.ok) throw new Error('Market chart fetch failed');
      return await res.json();
    } catch (error) {
      console.warn(`Chart data for ${id} unavailable`, error);
      const mock = MOCK_MARKETS.find(m => m.id === id);
      if (mock) {
        const now = Date.now();
        const prices: [number, number][] = mock.sparkline_in_7d!.price.map((p, i) => [now - (7 - i) * 86400000, p]);
        return { prices, market_caps: [], total_volumes: [] };
      }
      return null;
    }
  },

  getGlobal: async (): Promise<GlobalData | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/global`, { mode: 'cors' });
      if (!res.ok) throw new Error('Global data fetch failed');
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.warn("Global market metrics unavailable", error);
      return {
        active_cryptocurrencies: 12400,
        upcoming_icos: 0,
        ongoing_icos: 42,
        ended_icos: 3401,
        markets: 900,
        total_market_cap: { usd: 2400000000000 },
        total_volume: { usd: 85000000000 },
        market_cap_percentage: { btc: 52.1, eth: 17.2 },
        market_cap_change_percentage_24h_usd: 1.2,
        updated_at: Date.now() / 1000
      };
    }
  },

  getTrending: async (): Promise<TrendingCoin[]> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/search/trending`, { mode: 'cors' });
      if (!res.ok) throw new Error('Trending fetch failed');
      const data = await res.json();
      return data.coins;
    } catch (error) {
      console.warn("Trending data unavailable", error);
      return MOCK_MARKETS.map((m, i) => ({
        item: {
          id: m.id,
          coin_id: i,
          name: m.name,
          symbol: m.symbol,
          market_cap_rank: m.market_cap_rank,
          thumb: m.image,
          small: m.image,
          large: m.image,
          slug: m.id,
          price_btc: 1,
          score: i,
          data: {
            price: m.current_price,
            price_btc: '1',
            price_change_percentage_24h: { usd: m.price_change_percentage_24h },
            market_cap: m.market_cap.toString(),
            total_volume: m.total_volume.toString(),
            sparkline: ''
          }
        }
      }));
    }
  },

  search: async (query: string): Promise<SearchResult | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/search?query=${query}`, { mode: 'cors' });
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    } catch (error) {
      console.warn(`Search for ${query} unavailable`, error);
      return {
        coins: MOCK_MARKETS.filter(m => m.name.toLowerCase().includes(query.toLowerCase())).map(m => ({
          id: m.id,
          name: m.name,
          api_symbol: m.symbol,
          symbol: m.symbol,
          market_cap_rank: m.market_cap_rank,
          thumb: m.image,
          large: m.image
        })),
        exchanges: [],
        nfts: [],
        categories: []
      };
    }
  }
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/services/cryptoService.ts
================================================================================


import { CoinMarketData, CoinDetail, GlobalData, TrendingCoin, SearchResult } from '../types/index.ts';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export interface MarketChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

const MOCK_MARKETS: CoinMarketData[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 64231.50, market_cap: 1260000000000, market_cap_rank: 1, fully_diluted_valuation: 1350000000000, total_volume: 35000000000, high_24h: 65000, low_24h: 63000, price_change_24h: 1231, price_change_percentage_24h: 1.95, market_cap_change_24h: 24000000000, market_cap_change_percentage_24h: 1.9, circulating_supply: 19600000, total_supply: 21000000, max_supply: 21000000, ath: 73000, ath_change_percentage: -12, ath_date: '2024-03-14', atl: 67, atl_change_percentage: 95000, atl_date: '2013-07-06', roi: null, last_updated: new Date().toISOString(), sparkline_in_7d: { price: [63000, 63500, 64000, 63800, 64500, 65000, 64231] } },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3450.20, market_cap: 415000000000, market_cap_rank: 2, fully_diluted_valuation: 415000000000, total_volume: 15000000000, high_24h: 3550, low_24h: 3350, price_change_24h: 50, price_change_percentage_24h: 1.45, market_cap_change_24h: 5000000000, market_cap_change_percentage_24h: 1.4, circulating_supply: 120000000, total_supply: 120000000, max_supply: null, ath: 4878, ath_change_percentage: -29, ath_date: '2021-11-10', atl: 0.42, atl_change_percentage: 820000, atl_date: '2015-10-20', roi: null, last_updated: new Date().toISOString(), sparkline_in_7d: { price: [3300, 3350, 3400, 3380, 3450, 3500, 3450] } },
  { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 145.50, market_cap: 65000000000, market_cap_rank: 5, fully_diluted_valuation: 82000000000, total_volume: 4000000000, high_24h: 155, low_24h: 140, price_change_24h: -5, price_change_percentage_24h: -3.2, market_cap_change_24h: -2000000000, market_cap_change_percentage_24h: -3.1, circulating_supply: 445000000, total_supply: 570000000, max_supply: null, ath: 259, ath_change_percentage: -44, ath_date: '2021-11-06', atl: 0.50, atl_change_percentage: 29000, atl_date: '2020-05-11', roi: null, last_updated: new Date().toISOString(), sparkline_in_7d: { price: [150, 155, 152, 148, 145, 146, 145] } }
];

export const cryptoService = {
  ping: async () => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/ping`, { mode: 'cors' });
      return res.ok;
    } catch {
      return false;
    }
  },

  getMarkets: async (vsCurrency: string = 'usd', perPage: number = 10, page: number = 1): Promise<CoinMarketData[]> => {
    try {
      const res = await fetch(
        `${COINGECKO_BASE}/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h,7d`,
        { mode: 'cors' }
      );
      if (!res.ok) throw new Error('Market data fetch failed');
      return await res.json();
    } catch (error) {
      console.warn("Crypto API unavailable, using simulated node data", error);
      return MOCK_MARKETS.slice(0, perPage);
    }
  },

  getCoinById: async (id: string): Promise<CoinDetail | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/coins/${id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`, { mode: 'cors' });
      if (!res.ok) throw new Error('Coin details fetch failed');
      return await res.json();
    } catch (error) {
      console.warn(`Details for ${id} unavailable`, error);
      const mock = MOCK_MARKETS.find(m => m.id === id) as any;
      if (mock) {
        return {
          ...mock,
          description: { en: `Institutional-grade ledger summary for ${mock.name}. Handshake verified.` },
          links: { homepage: ['#'], blockchain_site: ['#'], official_forum_url: [], chat_url: [], announcement_url: [], twitter_screen_name: '', facebook_username: '', bitcointalk_thread_identifier: null, telegram_channel_identifier: '', subreddit_url: '', repos_url: { github: [], bitbucket: [] } },
          genesis_date: '2009-01-03',
          sentiment_votes_up_percentage: 85,
          sentiment_votes_down_percentage: 15
        };
      }
      return null;
    }
  },

  getMarketChart: async (id: string, days: string = '7', vsCurrency: string = 'usd'): Promise<MarketChartData | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=${vsCurrency}&days=${days}`, { mode: 'cors' });
      if (!res.ok) throw new Error('Market chart fetch failed');
      return await res.json();
    } catch (error) {
      console.warn(`Chart data for ${id} unavailable`, error);
      const mock = MOCK_MARKETS.find(m => m.id === id);
      if (mock) {
        const now = Date.now();
        const prices: [number, number][] = mock.sparkline_in_7d!.price.map((p, i) => [now - (7 - i) * 86400000, p]);
        return { prices, market_caps: [], total_volumes: [] };
      }
      return null;
    }
  },

  getGlobal: async (): Promise<GlobalData | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/global`, { mode: 'cors' });
      if (!res.ok) throw new Error('Global data fetch failed');
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.warn("Global market metrics unavailable", error);
      return {
        active_cryptocurrencies: 12400,
        upcoming_icos: 0,
        ongoing_icos: 42,
        ended_icos: 3401,
        markets: 900,
        total_market_cap: { usd: 2400000000000 },
        total_volume: { usd: 85000000000 },
        market_cap_percentage: { btc: 52.1, eth: 17.2 },
        market_cap_change_percentage_24h_usd: 1.2,
        updated_at: Date.now() / 1000
      };
    }
  },

  getTrending: async (): Promise<TrendingCoin[]> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/search/trending`, { mode: 'cors' });
      if (!res.ok) throw new Error('Trending fetch failed');
      const data = await res.json();
      return data.coins;
    } catch (error) {
      console.warn("Trending data unavailable", error);
      return MOCK_MARKETS.map((m, i) => ({
        item: {
          id: m.id,
          coin_id: i,
          name: m.name,
          symbol: m.symbol,
          market_cap_rank: m.market_cap_rank,
          thumb: m.image,
          small: m.image,
          large: m.image,
          slug: m.id,
          price_btc: 1,
          score: i,
          data: {
            price: m.current_price,
            price_btc: '1',
            price_change_percentage_24h: { usd: m.price_change_percentage_24h },
            market_cap: m.market_cap.toString(),
            total_volume: m.total_volume.toString(),
            sparkline: ''
          }
        }
      }));
    }
  },

  search: async (query: string): Promise<SearchResult | null> => {
    try {
      const res = await fetch(`${COINGECKO_BASE}/search?query=${query}`, { mode: 'cors' });
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    } catch (error) {
      console.warn(`Search for ${query} unavailable`, error);
      return {
        coins: MOCK_MARKETS.filter(m => m.name.toLowerCase().includes(query.toLowerCase())).map(m => ({
          id: m.id,
          name: m.name,
          api_symbol: m.symbol,
          symbol: m.symbol,
          market_cap_rank: m.market_cap_rank,
          thumb: m.image,
          large: m.image
        })),
        exchanges: [],
        nfts: [],
        categories: []
      };
    }
  }
};
