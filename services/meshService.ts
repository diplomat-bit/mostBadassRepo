// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/services/meshService.ts
================================================================================


import { callGemini } from "./geminiService";

export interface BankingNode {
  id: string;
  name: string;
  category: 'Treasury' | 'Liquidity' | 'Foundry' | 'Oracle' | 'Registry' | 'Vault';
  status: 'ACTIVE' | 'SYNCING' | 'DORMANT' | 'ERROR';
  load: number;
  region: string;
  parity: number;
}

const REGIONS = ['US-EAST-1', 'EU-WEST-2', 'AP-SOUTH-1', 'SA-EAST-1', 'AF-SOUTH-1', 'GLOBAL-EDGE'];
const CATEGORIES: BankingNode['category'][] = ['Treasury', 'Liquidity', 'Foundry', 'Oracle', 'Registry', 'Vault'];

export const meshService = {
  /**
   * Generates a batch of simulated nodes for the 999 expansion
   */
  generateNodes: (count: number, startIndex: number = 0): BankingNode[] => {
    return Array.from({ length: count }, (_, i) => {
      const idx = startIndex + i + 1;
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      return {
        id: `LQI-NODE-${idx.toString().padStart(3, '0')}`,
        name: `${category} Node ${idx}`,
        category,
        status: Math.random() > 0.1 ? 'ACTIVE' : 'SYNCING',
        load: Math.floor(Math.random() * 100),
        region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
        parity: 99 + Math.random()
      };
    });
  },

  /**
   * Uses Gemini to generate thematic names for a specific batch of nodes
   */
  thematizeNodes: async (category: string, count: number) => {
    try {
      const response = await callGemini(
        'gemini-3-flash-preview',
        `Generate ${count} unique, futuristic, and high-end names for banking apps specialized in "${category}". 
         Style: One word or technical designation (e.g. Aether, CryoSync, Nexus-9). 
         Return ONLY a comma-separated list.`,
      );
      return (response.text || "").split(',').map(s => s.trim());
    } catch {
      return Array.from({ length: count }, (_, i) => `${category} Node Alpha-${i}`);
    }
  }
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/services/meshService.ts
================================================================================


import { callGemini } from "./geminiService";

export interface BankingNode {
  id: string;
  name: string;
  category: 'Treasury' | 'Liquidity' | 'Foundry' | 'Oracle' | 'Registry' | 'Vault';
  status: 'ACTIVE' | 'SYNCING' | 'DORMANT' | 'ERROR';
  load: number;
  region: string;
  parity: number;
}

const REGIONS = ['US-EAST-1', 'EU-WEST-2', 'AP-SOUTH-1', 'SA-EAST-1', 'AF-SOUTH-1', 'GLOBAL-EDGE'];
const CATEGORIES: BankingNode['category'][] = ['Treasury', 'Liquidity', 'Foundry', 'Oracle', 'Registry', 'Vault'];

export const meshService = {
  /**
   * Generates a batch of simulated nodes for the 999 expansion
   */
  generateNodes: (count: number, startIndex: number = 0): BankingNode[] => {
    return Array.from({ length: count }, (_, i) => {
      const idx = startIndex + i + 1;
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      return {
        id: `LQI-NODE-${idx.toString().padStart(3, '0')}`,
        name: `${category} Node ${idx}`,
        category,
        status: Math.random() > 0.1 ? 'ACTIVE' : 'SYNCING',
        load: Math.floor(Math.random() * 100),
        region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
        parity: 99 + Math.random()
      };
    });
  },

  /**
   * Uses Gemini to generate thematic names for a specific batch of nodes
   */
  thematizeNodes: async (category: string, count: number) => {
    try {
      const response = await callGemini(
        'gemini-3-flash-preview',
        `Generate ${count} unique, futuristic, and high-end names for banking apps specialized in "${category}". 
         Style: One word or technical designation (e.g. Aether, CryoSync, Nexus-9). 
         Return ONLY a comma-separated list.`,
      );
      return (response.text || "").split(',').map(s => s.trim());
    } catch {
      return Array.from({ length: count }, (_, i) => `${category} Node Alpha-${i}`);
    }
  }
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/services/meshService.ts
================================================================================


import { callGemini } from "./geminiService";

export interface BankingNode {
  id: string;
  name: string;
  category: 'Treasury' | 'Liquidity' | 'Foundry' | 'Oracle' | 'Registry' | 'Vault';
  status: 'ACTIVE' | 'SYNCING' | 'DORMANT' | 'ERROR';
  load: number;
  region: string;
  parity: number;
}

const REGIONS = ['US-EAST-1', 'EU-WEST-2', 'AP-SOUTH-1', 'SA-EAST-1', 'AF-SOUTH-1', 'GLOBAL-EDGE'];
const CATEGORIES: BankingNode['category'][] = ['Treasury', 'Liquidity', 'Foundry', 'Oracle', 'Registry', 'Vault'];

export const meshService = {
  /**
   * Generates a batch of simulated nodes for the 999 expansion
   */
  generateNodes: (count: number, startIndex: number = 0): BankingNode[] => {
    return Array.from({ length: count }, (_, i) => {
      const idx = startIndex + i + 1;
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      return {
        id: `LQI-NODE-${idx.toString().padStart(3, '0')}`,
        name: `${category} Node ${idx}`,
        category,
        status: Math.random() > 0.1 ? 'ACTIVE' : 'SYNCING',
        load: Math.floor(Math.random() * 100),
        region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
        parity: 99 + Math.random()
      };
    });
  },

  /**
   * Uses Gemini to generate thematic names for a specific batch of nodes
   */
  thematizeNodes: async (category: string, count: number) => {
    try {
      const response = await callGemini(
        'gemini-3-flash-preview',
        `Generate ${count} unique, futuristic, and high-end names for banking apps specialized in "${category}". 
         Style: One word or technical designation (e.g. Aether, CryoSync, Nexus-9). 
         Return ONLY a comma-separated list.`,
      );
      return (response.text || "").split(',').map(s => s.trim());
    } catch {
      return Array.from({ length: count }, (_, i) => `${category} Node Alpha-${i}`);
    }
  }
};
