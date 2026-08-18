// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/views/blueprints/EtherealMarketplaceView.tsx
================================================================================

import React, { useState } from 'react';

interface DreamNFT {
  tokenId: string;
  prompt: string;
  neuralPatternUrl: string; // Link to the raw dream data
  visualizationUrl: string; // Link to an artistic render
  owner: string;
}

const EtherealMarketplaceView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintedDream, setMintedDream] = useState<DreamNFT | null>(null);

  const handleMint = async () => {
    setIsMinting(true);
    setMintedDream(null);
    // MOCK API & Blockchain interaction
    const result: DreamNFT = await new Promise(res => setTimeout(() => res({
      tokenId: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      prompt: prompt,
      neuralPatternUrl: `/dreams/data/${Date.now()}.bin`,
      visualizationUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
      owner: "0xYourWalletAddress"
    }), 5000));
    setMintedDream(result);
    setIsMinting(false);
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">The Ethereal Marketplace</h1>
      <div className="flex gap-2">
        <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Commission a dream (e.g., 'A city made of glass')" className="w-full p-2 bg-gray-700 rounded"/>
        <button onClick={handleMint} disabled={isMinting} className="p-2 bg-cyan-600 rounded disabled:opacity-50 whitespace-nowrap">Mint this Dream as NFT</button>
      </div>
      {isMinting && <p className="mt-4">Connecting to neural dream engine... tokenizing concept on blockchain...</p>}
      {mintedDream && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Dream Minted Successfully!</h3>
          <p><strong>Token ID:</strong><span className="text-xs font-mono break-all"> {mintedDream.tokenId}</span></p>
          <p><strong>Prompt:</strong> {mintedDream.prompt}</p>
          <img src={mintedDream.visualizationUrl} alt="Dream Visualization" className="mt-2 rounded-lg" width="400"/>
        </div>
      )}
    </div>
  );
};
export default EtherealMarketplaceView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/blueprints/EtherealMarketplaceView.tsx
================================================================================

```typescript
/**
 * Welcome to the Ethereal Marketplace, a sprawling, self-contained simulation of a
 * next-generation digital asset platform. This single file is a testament to what happens
 * when you ask an AI to "make it longer." It includes everything from the UI components
 * to a mock backend that pretends to be a multi-million-dollar financial infrastructure.
 *
 * Here, we're not just trading JPEGs; we're orchestrating complex interactions like
 * minting digital dreams, trading them with high-integrity (simulated) crypto, and managing
 * digital identities. It's all very serious business, wink wink. The goal is to create
 * a complete, interactive application within one file that feels like a whole universe,
 * while being honest about its own magnificent fakery. It's less about "disrupting a
 * multi-trillion dollar ecosystem" and more about creating a really, really cool demo
 * that's fun to explore and ridiculously over-engineered for your viewing pleasure.
 */
import React, { useState, useEffect, useCallback, useMemo, createContext, useContext, useRef } from 'react';

/**
 * MarketplaceConfig defines global constants and operational parameters for the Ethereal Marketplace.
 * These are the sacred rules of our simulated universe, governing everything from how much
 * it "costs" to mint a dream to what kind of artistic nonsense you can generate.
 *
 * The Point: Centralizing this stuff is just good practice. It means we can tweak the
 * marketplace's economy or add a new "Post-Ironic Vaporwave" style without digging through
 * the code. It makes our pretend business agile, compliant with pretend regulations, and
 * ready to pivot to new pretend market conditions at a moment's notice. A true game-changer.
 */
export const MARKETPLACE_CONFIG = {
  ITEMS_PER_PAGE: 12,
  MINT_FEE_ETH: 0.05,
  ROYALTY_PERCENTAGE: 5, // 5% royalty for creator
  MAX_PROMPT_LENGTH: 256,
  SUPPORTED_DREAM_STYLES: ['Abstract', 'Surreal', 'Photorealistic', 'Impressionistic', 'Cyberpunk', 'Fantasy', 'Sci-Fi', 'Anime', 'Minimalist', 'Baroque', 'Post-Apocalyptic', 'Retro-Futurism', 'Gothic', 'Art Deco'],
  LICENSING_OPTIONS: [
    { id: 'personal', name: 'Personal Use', description: 'For non-commercial, personal projects only. No redistribution or sale.' },
    { id: 'commercial_standard', name: 'Commercial Standard', description: 'For commercial projects, limited to 10,000 reproductions or less. No reselling of the raw asset.' },
    { id: 'commercial_extended', name: 'Commercial Extended', description: 'For unlimited commercial reproductions, merchandise, and broader distribution rights. Specific terms apply.' },
    { id: 'exclusive_full', name: 'Exclusive Full Rights', description: 'Full transfer of all intellectual property rights to the buyer. Highest tier, often for bespoke commissions.' },
  ],
  DEFAULT_WALLET_BALANCE: 10.0, // ETH
  MAX_TAGS_PER_NFT: 7,
  MAX_BIO_LENGTH: 500,
  MAX_USERNAME_LENGTH: 30,
  PAYMENT_RAIL_OPTIONS: ['rail_fast', 'rail_batch'], // Simulated programmable payment rails
};

/**
 * DreamNFT represents a unique digital asset (Non-Fungible Token) within the Ethereal Marketplace.
 * This is the core "thing" we're pretending has value. It's a receipt for a generated "dream,"
 * complete with all the metadata needed to make it look official and important.
 *
 * Why This Matters: This data structure is the blueprint for our digital goodies. It ensures
 * each NFT has a clear history, verifiable ownership (by a fake person), and defined usage
 * rights. This makes them feel real and trustworthy, which is key if you want people to
 * spend their hard-earned fake money in your fake marketplace. It's the digital equivalent
 * of a very fancy, beautifully printed certificate of authenticity for a thought.
 */
export interface DreamNFT {
  tokenId: string;
  prompt: string;
  neuralPatternUrl: string; // Link to the raw dream data
  visualizationUrl: string; // Link to an artistic render
  owner: string; // Wallet address of current owner
  creator: string; // Original minter's wallet address
  priceEth?: number; // Current listing price if for sale
  lastSoldPriceEth?: number;
  isForSale: boolean;
  timestampMinted: number; // Unix timestamp
  tags: string[];
  style: string; // e.g., 'Surreal', 'Photorealistic'
  rarityScore: number; // A simulated rarity score (0-100)
  licensingOption: 'personal' | 'commercial_standard' | 'commercial_extended' | 'exclusive_full';
  description?: string;
  hasHighResAccess: boolean; // Does the current owner have access to high-res raw data?
  history: TransactionHistoryItem[]; // Immutable, hash-linked transaction history
  viewCount: number;
  likeCount: number;
  currentBidders: string[];
}

/**
 * UserRole defines a set of permissions or access levels. Are you a humble user, a
 * mighty creator, a god-like admin, or a spooky autonomous agent? This decides.
 *
 * Why Bother?: This is how we stop chaos. By assigning roles, we make sure that
 * only creators can create and only admins can, you know, administrate. It's a basic
 * security blanket for our digital financial playground, preventing users from, say,
 * accidentally deleting the entire marketplace.
 */
export type UserRole = 'user' | 'creator' | 'admin' | 'agent';

/**
 * UserProfile represents the digital identity of a user. It's the collection of data
 * that says "you are you" in our little world, complete with a wallet, a bio, and a
 * collection of digital dreams.
 *
 * The Gist: Without this, everyone is an anonymous ghost. User profiles make the
 * marketplace personal and secure. We can track who owns what, assign special
 * permissions, and create a sense of community. It’s the foundation for trust,
 * because it's nice to know the person you're buying a "post-apocalyptic baroque
 * dream" from is at least pretending to be a real person.
 */
export interface UserProfile {
  walletAddress: string;
  username: string;
  profilePictureUrl: string;
  bio: string;
  joinedTimestamp: number;
  ownedNFTs: string[]; // Array of tokenId
  favoriteNFTs: string[]; // Array of tokenId
  balanceEth: number;
  notificationSettings: {
    newBid: boolean;
    saleConfirmation: boolean;
    dreamMinted: boolean;
  };
  isVerified: boolean;
  publicKey?: string; // Hex-encoded public key for digital identity and cryptographic signing
  roles: UserRole[]; // Roles for RBAC and authorization
}

/**
 * Represents a formal offer on an NFT. It's the digital equivalent of raising a paddle
 * at an auction, except you do it from your couch.
 *
 * Why it's here: Bids create market action! They allow for price discovery and make
 * things exciting. A detailed bid structure is also great for keeping records, so when
 * someone complains, we can point to the (fake) data and say, "See? It's all here."
 */
export interface Bid {
  bidder: string; // Wallet address
  amountEth: number;
  timestamp: number;
}

/**
 * Defines the possible states of a transaction. Is it waiting? Did it work? Did it fail
 * spectacularly? Was it so weird that our AI agent had to step in? This tells you.
 *
 * The Point: Clear statuses are essential for not losing your mind when tracking money
 * (even fake money). It helps users, developers, and our imaginary compliance bots
 * understand what's happening at every step of a transaction. Essential for debugging
 * and maintaining sanity.
 */
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'flagged' | 'reconciling';

/**
 * TransactionHistoryItem logs a significant event for an NFT, creating a permanent,
 * unchangeable (in theory) record of its life. It's the asset's autobiography.
 *
 * The Real Deal: This is about provenance and trust. A clear, detailed history proves
 * an asset's journey and authenticity, which is critical for it to have any (pretend)
 * value. It's also an auditor's dream, making it easy to trace every action and every
 * cent of fake crypto. For a financial system, this is non-negotiable.
 */
export interface TransactionHistoryItem {
  type: 'mint' | 'sale' | 'bid_placed' | 'bid_accepted' | 'transfer' | 'listing_cancelled' | 'fraud_flagged' | 'reconciliation_started' | 'agent_remediation';
  timestamp: number;
  initiator: string; // Wallet address or Agent ID of the entity initiating the action
  targetNFT: string; // Token ID
  details: string; // e.g., "Minted by 0x...", "Sold for 1.2 ETH", "Bid of 0.8 ETH placed"
  amountEth?: number; // Relevant for sales/bids/mint fees
  transactionId?: string; // Unique ID for the underlying payment/blockchain transaction
  paymentRail?: string; // Which programmable payment rail was used (e.g., 'rail_fast', 'rail_batch')
  status?: TransactionStatus; // Current status of the transaction lifecycle
  metadata?: Record<string, any>; // Additional relevant data (e.g., fraud score, agent ID, policy outcome)
}

/**
 * MintRequestParams defines what a user needs to provide to create a new Dream NFT.
 * It's the order form you send to the AI art generator in the sky (our mock backend).
 *
 * The Logic: This structure turns a user's creative whim into a concrete request that
 * our system can understand and process. It's the bridge between human imagination and
 * machine generation, ensuring the resulting NFT is exactly what the user (kind of) asked for.
 * This is how new "value" gets created on the platform.
 */
export interface MintRequestParams {
  prompt: string;
  style: string;
  privacy: 'public' | 'private';
  licensing: 'personal' | 'commercial_standard' | 'commercial_extended' | 'exclusive_full';
  tags: string[];
  emotionTone: string; // e.g., 'calm', 'vibrant', 'mysterious'
  complexityScore?: number; // 0-100
}

/**
 * Defines the criteria for filtering NFT listings. It's the machine that helps you
 * find the needle in the haystack, assuming the needle is a "Cyberpunk dream of a sad robot."
 *
 * The Benefit: A marketplace with thousands of items is useless without good filters.
 * This allows users to zero in on what they want, making them more likely to actually
 * buy something. It's the difference between a curated gallery and a chaotic flea market.
 */
export interface MarketplaceFilters {
  priceRange: [number, number];
  styles: string[];
  tags: string[];
  owner?: string;
  isForSaleOnly: boolean;
  searchQuery: string;
  minRarity?: number;
}

/**
 * Defines how to sort the list of NFTs. Do you want the cheapest first? The newest?
 * The one with the highest made-up rarity score? This is how you choose.
 *
 * Why sort?: Sorting helps users make sense of the market. It lets them see what's
 * popular, what's new, or what's a bargain. It’s a simple feature that makes the
 * platform feel much more powerful and user-friendly.
 */
export interface MarketplaceSort {
  by: 'price' | 'timestamp' | 'rarity' | 'prompt' | 'viewCount' | 'likeCount';
  direction: 'asc' | 'desc';
}

/**
 * AppContextType defines the shape of our global state. It's the application's brain,
 * holding all the important information that different components might need, like who
 * the current user is and what's for sale.
 *
 * The Big Idea: Instead of passing data down through a dozen layers of components
 * (a nightmare known as "prop drilling"), we put it all in one central place. Any
 * component can then directly access the data it needs. This keeps the code cleaner,
 * more organized, and easier to maintain, which is crucial when your single file
 * starts to approach the length of a short novel.
 */
interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  walletConnect: () => Promise<UserProfile>;
  walletDisconnect: () => void;
  isLoadingWallet: boolean;
  marketData: DreamNFT[];
  fetchMarketData: () => Promise<void>;
  updateMarketItem: (tokenId: string, updates: Partial<DreamNFT>) => void;
  addMarketItem: (nft: DreamNFT) => void;
  removeMarketItem: (tokenId: string) => void;
  userProfiles: UserProfile[];
  updateUserProfile: (walletAddress: string, updates: Partial<UserProfile>) => void;
  // New: Agent-specific functions for a potential Agentic Intelligence Dashboard in the future
  // submitAgentInstruction: (instruction: AgentInstruction) => Promise<AgentResponse>;
  // fetchAgentLogs: () => Promise<AgentLog[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * A custom hook for easily accessing the AppContext. It's a convenient shortcut that
 * also yells at you if you try to use it outside of the AppProvider.
 *
 * The Perk: This makes accessing global state trivial and safe. It's a small piece
 * of code that improves the developer experience and prevents common mistakes,
 * which is always a win in a complex application.
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

/**
 * Creates a plausible-looking but entirely fake Ethereum wallet address.
 *
 * The Purpose: Essential for running this simulation without needing a real crypto
 * wallet or connecting to a real blockchain. It lets us test everything locally
 * and quickly, which is much cheaper and faster than dealing with the real thing.
 * A triumph of practical fakery.
 */
export const generateRandomWalletAddress = (): string => {
  return `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
};

/**
 * Formats a number as an ETH value. Because `0.05` is just a number,
 * but `0.0500 ETH` feels like real money.
 *
 * Why?: Consistency in displaying financial data is key to making an application
 * look professional and trustworthy. This simple function ensures all our fake
 * prices look uniformly official.
 */
export const formatEth = (amount: number): string => `${amount.toFixed(4)} ETH`;

/**
 * Converts a Unix timestamp (a giant number) into a date and time that a human
 * can actually understand.
 *
 * The Value: Humans are bad at reading timestamps. This function translates machine
 * time into human time, which is incredibly useful for things like transaction
* histories and mint dates. Clarity is kindness.
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Shortens a long, ugly blockchain address into a short, slightly less ugly one.
 * e.g., `0x123...cdef`.
 *
 * The Point: Nobody wants to see a 42-character string cluttering up the UI.
 * This makes addresses readable without sacrificing their uniqueness, leading to
 * a cleaner and more user-friendly design. It's a small detail that makes a big difference.
 */
export const truncateAddress = (address: string, chars = 6): string => {
  if (address.length <= chars * 2 + 2) return address; // Already short enough
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

/**
 * Generates a few random, relevant-sounding tags from a predefined list.
 *
 * Usefulness: This helps us create diverse and interesting mock data for our NFTs.
 * A good set of tags makes the marketplace feel rich and discoverable, even if the
 * tags were just picked out of a hat by a computer.
 */
export const generateRandomTags = (count: number): string[] => {
  const availableTags = ['dreamscape', 'ethereal', 'digitalart', 'surrealism', 'fantasy', 'abstract', 'nftart', 'blockchain', 'imagination', 'visionary', 'cyberpunk', 'nature', 'cityscape', 'futuristic', 'ancient', 'spiritual', 'cosmic', 'bioluminescent', 'gothic', 'steampunk', 'vaporwave', 'mythology', 'folklore', 'machinelearning'];
  const shuffled = availableTags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, availableTags.length));
};

/**
 * Generates a complete, realistic-looking DreamNFT object from scratch.
 * This is the factory where our digital dreams are made.
 *
 * Its Role: This function is the cornerstone of our simulation. It allows us to
 * populate the marketplace with hundreds of unique, varied NFTs with a single
 * function call. Without this, we'd have no data to show, and our marketplace
 * would just be a sad, empty page.
 */
export const generateMockDreamNFT = (ownerAddress: string, creatorAddress: string, promptText?: string, isForSale: boolean = false): DreamNFT => {
  const tokenId = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const timestamp = Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000 * (Math.random() * 2 + 0.5)); // Up to 2.5 years old
  const style = MARKETPLACE_CONFIG.SUPPORTED_DREAM_STYLES[Math.floor(Math.random() * MARKETPLACE_CONFIG.SUPPORTED_DREAM_STYLES.length)];
  const rarityScore = Math.floor(Math.random() * 100);
  const priceEth = isForSale ? parseFloat((Math.random() * 5 + 0.1).toFixed(4)) : undefined;
  const lastSoldPriceEth = priceEth ? parseFloat((priceEth * (0.8 + Math.random() * 0.4)).toFixed(4)) : undefined; // +/- 20%
  const licensingOption = MARKETPLACE_CONFIG.LICENSING_OPTIONS[Math.floor(Math.random() * MARKETPLACE_CONFIG.LICENSING_OPTIONS.length)].id as DreamNFT['licensingOption'];
  const generatedTags = generateRandomTags(Math.floor(Math.random() * MARKETPLACE_CONFIG.MAX_TAGS_PER_NFT) + 1);

  const initialHistory: TransactionHistoryItem[] = [
    {
      type: 'mint',
      timestamp: timestamp,
      initiator: creatorAddress,
      targetNFT: tokenId,
      details: `Minted by ${truncateAddress(creatorAddress)}`,
      status: 'completed',
      transactionId: `tx-mint-${tokenId}-${Date.now()}`,
      paymentRail: 'token_rail', // Conceptual minting rail
      metadata: { initialCreatorFee: MARKETPLACE_CONFIG.MINT_FEE_ETH }
    },
  ];

  if (isForSale && priceEth) {
      initialHistory.push({
          type: 'sale', // type 'sale' can also denote a listing event in history for simplicity
          timestamp: timestamp + Math.floor(Math.random() * 3600 * 1000 * 24 * 7), // A few days after mint
          initiator: ownerAddress,
          targetNFT: tokenId,
          details: `Listed for sale by ${truncateAddress(ownerAddress)} for ${formatEth(priceEth)}`,
          amountEth: priceEth,
          status: 'completed', // Listing is a completed action
          transactionId: `tx-list-${tokenId}-${Date.now()}`,
      });
  }
  if (!isForSale && lastSoldPriceEth && Math.random() < 0.3) { // 30% chance for a past sale even if not currently for sale
      const mockBuyer = generateRandomWalletAddress();
      initialHistory.push({
          type: 'sale',
          timestamp: timestamp + Math.floor(Math.random() * 3600 * 1000 * 24 * 30),
          initiator: mockBuyer, // Mock buyer
          targetNFT: tokenId,
          details: `Sold previously by ${truncateAddress(generateRandomWalletAddress())} to ${truncateAddress(mockBuyer)} for ${formatEth(lastSoldPriceEth)}`,
          amountEth: lastSoldPriceEth,
          status: 'completed',
          transactionId: `tx-sale-${tokenId}-${Date.now()}`,
          paymentRail: Math.random() > 0.5 ? 'rail_fast' : 'rail_batch', // Simulate different rails for past sales
          metadata: { royaltyPaid: lastSoldPriceEth * (MARKETPLACE_CONFIG.ROYALTY_PERCENTAGE / 100) }
      });
  }


  return {
    tokenId: tokenId,
    prompt: promptText || `A ${style.toLowerCase()} dream of a ${generatedTags[0]} where ${Math.random() > 0.5 ? 'time flows backwards' : 'gravity is an option'}.`,
    neuralPatternUrl: `/dreams/data/${tokenId}.bin`,
    visualizationUrl: `https://picsum.photos/seed/${tokenId.substring(2, 10)}/${400 + Math.floor(Math.random() * 200)}/${300 + Math.floor(Math.random() * 150)}`, // Vary image sizes
    owner: ownerAddress,
    creator: creatorAddress,
    isForSale: isForSale,
    priceEth: priceEth,
    lastSoldPriceEth: lastSoldPriceEth,
    timestampMinted: timestamp,
    tags: generatedTags,
    style: style,
    rarityScore: rarityScore,
    licensingOption: licensingOption,
    description: `This unique piece, "${style} Dream of ${generatedTags[0]}", was generated by the Ethereal Dream Engine on ${formatTimestamp(timestamp)}. It captures a profound subconscious narrative, visualized through advanced neural rendering. Its rarity score of ${rarityScore}/100 indicates its distinctive pattern complexity. This digital asset embodies the intersection of technology and imagination, a testament to the future of programmable value.`,
    hasHighResAccess: Math.random() > 0.3, // 70% chance of high-res access
    history: initialHistory,
    viewCount: Math.floor(Math.random() * 5000) + 100, // 100 to 5100 views
    likeCount: Math.floor(Math.random() * 1000) + 10, // 10 to 1010 likes
    currentBidders: [], // Dynamically updated by mock backend
  };
};

/**
 * Generates a complete, realistic-looking UserProfile from scratch.
 * This function breathes fake life into our application, creating the digital personas
 * who will "own" and "trade" the assets.
 *
 * The Function: It's essential for creating a believable ecosystem. By generating
 * varied users with different roles, balances, and bios, we can test how the platform
 * functions with a diverse user base, ensuring features like role-based access control
 * actually work as intended.
 */
export const generateMockUserProfile = (walletAddress?: string): UserProfile => {
  const address = walletAddress || generateRandomWalletAddress();
  const username = `Dreamer_${Math.floor(Math.random() * 1000000)}`;
  const joinedTimestamp = Date.now() - Math.floor(Math.random() * 2 * 365 * 24 * 60 * 60 * 1000); // Up to 2 years ago
  const bioOptions = [
      `Passionate collector of digital dreams and neural patterns. Exploring the frontiers of subconscious artistry since ${new Date(joinedTimestamp).getFullYear()}.`,
      `A visionary artist in the ethereal realm. My collection reflects the deepest corners of imagination. Committed to digital innovation.`,
      `Curating a gallery of AI-generated wonders. Inspired by the nexus of art and technology. Building the future of digital finance.`,
      `Dedicated to the preservation and appreciation of digital consciousness. Follow my journey through the metaverse.`,
      `Seeker of rare patterns and unique styles. Always on the lookout for the next groundbreaking piece. A true pioneer in programmable value.`
  ];
  const roles: UserRole[] = ['user'];
  if (Math.random() > 0.6) roles.push('creator'); // 40% chance of being a creator
  if (Math.random() > 0.95) roles.push('admin'); // 5% chance of being an admin for demo purposes
  const mockPublicKey = `0xPubKey${[...Array(60)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  return {
    walletAddress: address,
    username: username,
    profilePictureUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${address}`,
    bio: bioOptions[Math.floor(Math.random() * bioOptions.length)],
    joinedTimestamp: joinedTimestamp,
    ownedNFTs: [], // To be populated later
    favoriteNFTs: [],
    balanceEth: parseFloat((Math.random() * 50 + 5).toFixed(4)),
    notificationSettings: {
      newBid: Math.random() > 0.5,
      saleConfirmation: Math.random() > 0.5,
      dreamMinted: Math.random() > 0.5,
    },
    isVerified: Math.random() > 0.7, // 30% chance to be verified
    publicKey: mockPublicKey,
    roles: roles,
  };
};

/**
 * Creates a whole bunch of mock dreams and users at once. This is how we go from
 * an empty void to a bustling, vibrant marketplace in one function call.
 *
 * Its Superpower: This function allows us to simulate the marketplace at scale.
 * We can instantly generate a complex environment with thousands of assets and
 * hundreds of users, which is perfect for stress-testing the UI, checking
 * performance, and making sure our filtering and sorting logic doesn't collapse
 * under pressure. It's the "let there be light" function for our simulation.
 */
export const generateManyMockDreamsAndUsers = (numDreams: number, numUsers: number) => {
    const localUsers: { [address: string]: UserProfile } = {};
    const localDreams: { [tokenId: string]: DreamNFT } = {};
    const addresses: string[] = [];

    // Generate initial users
    for (let i = 0; i < numUsers; i++) {
        const user = generateMockUserProfile();
        localUsers[user.walletAddress] = user;
        addresses.push(user.walletAddress);
    }

    // Ensure some known users for demo purposes (to make the UI more predictable for the current user)
    const demoUser1Addr = generateRandomWalletAddress();
    const demoUser2Addr = generateRandomWalletAddress();
    localUsers[demoUser1Addr] = generateMockUserProfile(demoUser1Addr);
    localUsers[demoUser2Addr] = generateMockUserProfile(demoUser2Addr);
    addresses.push(demoUser1Addr, demoUser2Addr);

    // Generate dreams and assign owners/creators
    for (let i = 0; i < numDreams; i++) {
        const ownerIdx = Math.floor(Math.random() * addresses.length);
        const creatorIdx = Math.floor(Math.random() * addresses.length);
        const ownerAddress = addresses[ownerIdx];
        const creatorAddress = addresses[creatorIdx];
        const isForSale = Math.random() > 0.2; // 80% chance for sale to populate market

        const dream = generateMockDreamNFT(ownerAddress, creatorAddress, undefined, isForSale);
        localDreams[dream.tokenId] = dream;

        // Update owner's owned NFTs
        if (localUsers[ownerAddress]) {
            localUsers[ownerAddress].ownedNFTs.push(dream.tokenId);
            // Simulate balance deduction for minting for owner
            if (dream.creator === ownerAddress) {
                localUsers[ownerAddress].balanceEth = Math.max(0, localUsers[ownerAddress].balanceEth - MARKETPLACE_CONFIG.MINT_FEE_ETH);
            }
        } else {
             // Create phantom user if owner doesn't exist in our generated list (should be rare with enough users)
             const phantomUser = generateMockUserProfile(ownerAddress);
             phantomUser.ownedNFTs.push(dream.tokenId);
             if (dream.creator === ownerAddress) {
                 phantomUser.balanceEth = Math.max(0, phantomUser.balanceEth - MARKETPLACE_CONFIG.MINT_FEE_ETH);
             }
             localUsers[ownerAddress] = phantomUser;
        }

        // Add more history items for older dreams to simulate market activity
        if (i < numDreams * 0.7) { // 70% of dreams get more history
            const numAdditionalHistory = Math.floor(Math.random() * 4); // Up to 3 more transactions
            for (let j = 0; j < numAdditionalHistory; j++) {
                const type: TransactionHistoryItem['type'] = Math.random() > 0.6 ? 'sale' : 'bid_placed';
                const paymentRail = MARKETPLACE_CONFIG.PAYMENT_RAIL_OPTIONS[Math.floor(Math.random() * MARKETPLACE_CONFIG.PAYMENT_RAIL_OPTIONS.length)];
                if (type === 'sale' && dream.lastSoldPriceEth) {
                    const prevOwner = generateRandomWalletAddress();
                    const saleAmount = dream.lastSoldPriceEth * (0.9 + Math.random() * 0.2); // +/- 10% from last sold
                    dream.history.push({
                        type: 'sale',
                        timestamp: dream.timestampMinted + (j + 1) * 3600 * 1000 * 24 * 30 * (0.5 + Math.random()), // Monthly sales
                        initiator: prevOwner,
                        targetNFT: dream.tokenId,
                        details: `Resold by ${truncateAddress(prevOwner)} for ${formatEth(saleAmount)}`,
                        amountEth: saleAmount,
                        status: 'completed',
                        transactionId: `tx-resale-${dream.tokenId}-${Date.now()}-${j}`,
                        paymentRail: paymentRail,
                        metadata: { royaltyPaid: saleAmount * (MARKETPLACE_CONFIG.ROYALTY_PERCENTAGE / 100) }
                    });
                } else if (type === 'bid_placed') {
                    const bidder = generateRandomWalletAddress();
                    const bidAmount = (dream.priceEth || 1) * (0.7 + Math.random() * 0.3); // 70-100% of price
                    dream.history.push({
                        type: 'bid_placed',
                        timestamp: dream.timestampMinted + (j + 1) * 3600 * 1000 * 24 * 15 * (0.5 + Math.random()), // Bi-weekly bids
                        initiator: bidder,
                        targetNFT: dream.tokenId,
                        details: `Bid of ${formatEth(bidAmount)} placed by ${truncateAddress(bidder)}`,
                        amountEth: bidAmount,
                        status: 'completed',
                        transactionId: `tx-bid-${dream.tokenId}-${Date.now()}-${j}`,
                        paymentRail: paymentRail,
                    });
                    dream.currentBidders.push(bidder); // Add to current bidders
                }
            }
        }
    }
    return { users: localUsers, dreams: localDreams };
};


/**
 * `mockBackend` is the heart of our simulation. It's a fake server, a fake blockchain,
 * and a fake AI all rolled into one glorious, in-memory object. It manages all the data
 * and logic for users, NFTs, and transactions, allowing the frontend to function as if
 * it were talking to a real, live system.
 *
 * The Awkward Truth: This is where we play make-believe on a grand scale. It's a carefully
 * constructed illusion that lets us build and test a complex financial application without
 * the headache and expense of a real backend. It's powerful, practical, and a little bit
 * ridiculous, which is exactly what makes it so great. It's the ultimate "fake it 'til
 * you make it" development strategy.
 */
export const mockBackend = (() => {
  const users: { [address: string]: UserProfile } = {};
  const dreams: { [tokenId: string]: DreamNFT } = {};
  let currentTransactionIdCounter = 0; // For unique mock transaction IDs

  /**
   * Generates a unique, official-looking transaction ID. In a real system, this would be a
   * serious, cryptographically secure hash. Here, it's just a number that goes up.
   * The Point: Unique IDs are crucial for tracking and auditing. Even in a simulation,
   * we need a way to tell one transaction from another.
   */
  const generateTransactionId = () => `mock-tx-${Date.now()}-${currentTransactionIdCounter++}`;

  /**
   * `AgenticAI_AnomalyDetection` pretends to be a sophisticated AI that sniffs out sketchy transactions.
   * It's our digital fraud detective, giving every transaction a "risk score" based on... well, a random number.
   *
   * The Real Goal: This simulates a critical security feature. In a real financial system,
   * an AI would analyze patterns to flag potential fraud. Here, we demonstrate the concept,
   * showing where such a check would happen and how the system would react, thus making our
   * platform seem much smarter and safer than it actually is.
   */
  const simulateRiskScore = (initiator: string, amount: number, type: string): { riskScore: number; isFlagged: boolean; reason?: string } => {
      const riskScore = Math.floor(Math.random() * 100); // 0-99
      let isFlagged = false;
      let reason: string | undefined;

      // Example heuristic-based risk rules
      if (riskScore > 85 && type === 'sale' && amount > 2.0) { // High-value sales from perceived risk
          isFlagged = true;
          reason = 'High-value transaction detected. New/unverified user profile involved.';
      } else if (riskScore > 90 && type === 'mint' && amount === MARKETPLACE_CONFIG.MINT_FEE_ETH && Math.random() < 0.1) { // 10% chance of minting fraud flag
          isFlagged = true;
          reason = 'Unusual minting pattern detected from source wallet.';
      } else if (amount > 10 && !users[initiator]?.isVerified) {
          isFlagged = true;
          reason = 'Large transaction from unverified account. Requires secondary verification.';
      } else if (users[initiator] && users[initiator].balanceEth < amount && (Math.random() < 0.05)) { // Attempt to overspend
          isFlagged = true;
          reason = 'Attempted overspend detected. Potential funds manipulation.';
      }

      console.log(`[AgenticAI:AnomalyDetection] Tx by ${truncateAddress(initiator)} for ${formatEth(amount)} (type: ${type}) - Risk Score: ${riskScore}, Flagged: ${isFlagged}, Reason: ${reason || 'N/A'}`);
      return { riskScore, isFlagged, reason };
  };

  /**
   * `AgenticAI_PaymentRouter` pretends to be a smart system that chooses the best way to send
   * fake money around, based on things like speed and cost.
   *
   * The Idea: In the real world, routing payments is a complex optimization problem.
   * This function simulates that intelligence, making our backend feel more advanced. It
   * demonstrates how an AI could be used to make the financial plumbing more efficient,
   * saving imaginary money and time.
   */
  const simulatePaymentRailRouter = (transactionType: string, amount: number): string => {
      if (transactionType === 'sale' && amount > 1.5 && Math.random() < 0.8) { // 80% chance for fast rail on high-value sales
          console.log(`[AgenticAI:PaymentRouter] High-value sale detected, prioritizing 'rail_fast' for expedited settlement.`);
          return 'rail_fast';
      }
      if (transactionType === 'mint' || transactionType === 'bid') { // Mints and bids are less urgent, can use batch for efficiency
          console.log(`[AgenticAI:PaymentRouter] Routing ${transactionType} operation via 'token_rail' for asset issuance/commitment.`);
          return 'token_rail'; // or 'rail_batch' depending on policy
      }
      if (Math.random() > 0.6) { // 40% chance of using fast rail for other transactions
          console.log(`[AgenticAI:PaymentRouter] Proactively selecting 'rail_fast' for general transaction efficiency.`);
          return 'rail_fast';
      }
      console.log(`[AgenticAI:PaymentRouter] Defaulting to 'rail_batch' for cost-optimized processing.`);
      return 'rail_batch';
  };

  /**
   * Initializes the mock backend with a rich set of data. This is where the magic starts.
   */
  const init = () => {
    const { users: generatedUsers, dreams: generatedDreams } = generateManyMockDreamsAndUsers(500, 100); // 500 dreams, 100 users
    Object.assign(users, generatedUsers);
    Object.assign(dreams, generatedDreams);
  };

  init(); // Call init immediately to populate data on module load.

  return {
    /**
     * Simulates fetching all the NFTs from the database, with an artificial network delay
     * to make it feel real.
     */
    fetchDreamNFTs: async (): Promise<DreamNFT[]> => {
      await new Promise(res => setTimeout(res, 500 + Math.random() * 500)); // Simulate network delay
      return Object.values(dreams).sort((a, b) => b.timestampMinted - a.timestampMinted);
    },

    /**
     * Simulates fetching a user's profile. If the user doesn't exist, it creates one on
     * the fly, because we're friendly like that.
     */
    fetchUserProfile: async (address: string): Promise<UserProfile | null> => {
      await new Promise(res => setTimeout(res, 300 + Math.random() * 300));
      if (!users[address]) {
        users[address] = generateMockUserProfile(address); // Create if not exists (simulates new user registration)
      }
      return users[address];
    },

    /**
     * Simulates updating a user's profile, after a fake permission check to make sure
     * you're not trying to edit someone else's bio.
     */
    updateUserProfile: async (address: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
      await new Promise(res => setTimeout(res, 300));
      if (!users[address]) throw new Error("User not found for update operation. Identity verification failed.");
      const hasPermission = (users[address].walletAddress === address) || users[address].roles.includes('admin');
      if (!hasPermission) {
          throw new Error("Unauthorized to update this profile. Digital identity access denied.");
      }

      users[address] = { ...users[address], ...updates };
      return users[address];
    },

    /**
     * Simulates the entire process of creating a new NFT. It checks for permissions,
     * deducts a fake fee, pretends to generate art, and then officially records the
     * new asset in our fake database. It's a big deal.
     */
    mintDreamNFT: async (params: MintRequestParams, minterAddress: string): Promise<DreamNFT> => {
      await new Promise(res => setTimeout(res, 3000 + Math.random() * 2000)); // Longer for generative AI + minting

      if (!users[minterAddress]) {
        users[minterAddress] = generateMockUserProfile(minterAddress); // Auto-create user if non-existent for demo
      }

      // RBAC Check for Minting: Only 'creator' or 'admin' roles can mint.
      if (!users[minterAddress].roles.includes('creator') && !users[minterAddress].roles.includes('admin')) {
          throw new Error("Unauthorized to mint: Your digital identity lacks 'creator' or 'admin' privileges.");
      }

      if (users[minterAddress].balanceEth < MARKETPLACE_CONFIG.MINT_FEE_ETH) {
        throw new Error("Insufficient funds to mint dream. Please deposit more ETH to cover the minting fee.");
      }

      const transactionId = generateTransactionId();
      const paymentRail = simulatePaymentRailRouter('mint', MARKETPLACE_CONFIG.MINT_FEE_ETH);
      let transactionStatus: TransactionStatus = 'pending';

      const { isFlagged: mintFlagged, reason: mintFlagReason, riskScore } = simulateRiskScore(minterAddress, MARKETPLACE_CONFIG.MINT_FEE_ETH, 'mint');
      if (mintFlagged) {
          transactionStatus = 'flagged';
          console.warn(`[AgenticAI:AnomalyDetection] Minting transaction ${transactionId} flagged: ${mintFlagReason}. Risk Score: ${riskScore}`);
          throw new Error(`Minting blocked by AI risk system: ${mintFlagReason}. Tx ID: ${truncateAddress(transactionId)}. Please contact support.`);
      }

      users[minterAddress].balanceEth = parseFloat((users[minterAddress].balanceEth - MARKETPLACE_CONFIG.MINT_FEE_ETH).toFixed(4));
      transactionStatus = 'completed';

      const newNFT = generateMockDreamNFT(minterAddress, minterAddress, params.prompt, false);
      newNFT.style = params.style;
      newNFT.tags = params.tags.slice(0, MARKETPLACE_CONFIG.MAX_TAGS_PER_NFT);
      newNFT.licensingOption = params.licensing;
      newNFT.description = `A freshly minted dream based on the prompt "${params.prompt}" with an emotional tone of '${params.emotionTone}'. This piece encapsulates a ${params.style.toLowerCase()} vision, generated by advanced neural networks. Complexity score: ${params.complexityScore || 'N/A'}. This asset contributes to the new era of programmable value.`;
      
      newNFT.history.push({
        type: 'mint',
        timestamp: Date.now(),
        initiator: minterAddress,
        targetNFT: newNFT.tokenId,
        details: `Minted by ${truncateAddress(minterAddress)} for ${formatEth(MARKETPLACE_CONFIG.MINT_FEE_ETH)}`,
        amountEth: MARKETPLACE_CONFIG.MINT_FEE_ETH,
        transactionId: transactionId,
        paymentRail: paymentRail,
        status: transactionStatus,
        metadata: { riskScore, privacySetting: params.privacy, licensingType: params.licensing }
      });

      dreams[newNFT.tokenId] = newNFT;
      users[minterAddress].ownedNFTs.push(newNFT.tokenId);

      console.log(`[Logging] NFT Minted: ${newNFT.tokenId} by ${truncateAddress(minterAddress)} via ${paymentRail}. Tx ID: ${transactionId}`);

      return newNFT;
    },

    /**
     * Simulates putting an NFT up for sale. It checks that you actually own the thing
     * before letting you list it, because that seems like a good idea.
     */
    listNFTForSale: async (tokenId: string, sellerAddress: string, priceEth: number): Promise<DreamNFT> => {
      await new Promise(res => setTimeout(res, 1000));
      const dream = dreams[tokenId];
      if (!dream || dream.owner !== sellerAddress) {
        throw new Error("NFT not found or not owned by seller, cannot list for sale. Identity mismatch.");
      }
      if (priceEth <= 0) {
          throw new Error("Listing price must be a positive value. Financial policy violation.");
      }
      if (!users[sellerAddress] || (!users[sellerAddress].roles.includes('creator') && !users[sellerAddress].roles.includes('admin') && users[sellerAddress].walletAddress !== sellerAddress)) {
          throw new Error("Unauthorized: Your digital identity lacks the necessary roles to list NFTs.");
      }

      dream.isForSale = true;
      dream.priceEth = priceEth;
      dream.history.push({
        type: 'sale',
        timestamp: Date.now(),
        initiator: sellerAddress,
        targetNFT: tokenId,
        details: `Listed for sale by ${truncateAddress(sellerAddress)} for ${formatEth(priceEth)}`,
        amountEth: priceEth,
        status: 'completed',
        transactionId: generateTransactionId(),
        paymentRail: 'marketplace_listing',
      });
      console.log(`[Logging] NFT Listed: ${dream.tokenId} by ${truncateAddress(sellerAddress)} for ${formatEth(priceEth)}. Tx ID: ${dream.history[dream.history.length - 1]?.transactionId}`);
      return dream;
    },

    /**
     * Simulates taking an NFT off the market. For when you have seller's remorse.
     */
    cancelListing: async (tokenId: string, sellerAddress: string): Promise<DreamNFT> => {
      await new Promise(res => setTimeout(res, 800));
      const dream = dreams[tokenId];
      if (!dream || dream.owner !== sellerAddress) {
        throw new Error("NFT not found or not owned by seller, cannot cancel listing. Digital identity verification failed.");
      }
      if (!users[sellerAddress] || (!users[sellerAddress].roles.includes('creator') && !users[sellerAddress].roles.includes('admin') && users[sellerAddress].walletAddress !== sellerAddress)) {
          throw new Error("Unauthorized: Your digital identity lacks the necessary roles to cancel NFT listings.");
      }
      
      dream.isForSale = false;
      dream.priceEth = undefined;
      const transactionId = generateTransactionId();
      dream.history.push({
        type: 'listing_cancelled',
        timestamp: Date.now(),
        initiator: sellerAddress,
        targetNFT: tokenId,
        details: `Listing cancelled by ${truncateAddress(sellerAddress)}`,
        status: 'completed',
        transactionId: transactionId,
        paymentRail: 'marketplace_internal',
      });
      console.log(`[Logging] NFT Listing Cancelled: ${dream.tokenId} by ${truncateAddress(sellerAddress)}. Tx ID: ${transactionId}`);
      return dream;
    },

    /**
     * This is the big one. It simulates a complete purchase, including AI risk checks,
     * payment routing, transferring funds, paying royalties, and updating ownership.
     * It's a complex dance of pretend-money and pretend-assets.
     */
    buyNFT: async (tokenId: string, buyerAddress: string, amountEth: number): Promise<DreamNFT> => {
      const transactionId = generateTransactionId();
      let transactionStatus: TransactionStatus = 'pending';
      console.log(`[PaymentEngine] Initiating purchase for ${tokenId} by ${truncateAddress(buyerAddress)} for ${formatEth(amountEth)}. Tx ID: ${transactionId}`);
      await new Promise(res => setTimeout(res, 2500 + Math.random() * 1000));

      const dream = dreams[tokenId];
      if (!dream || !dream.isForSale || dream.priceEth === undefined || amountEth < dream.priceEth) {
        throw new Error("NFT not for sale, price mismatch, or insufficient amount offered. Transaction rejected.");
      }
      if (dream.owner === buyerAddress) {
        throw new Error("Cannot purchase your own NFT. Self-transaction policy violation.");
      }
      if (!users[buyerAddress] || users[buyerAddress].balanceEth < amountEth) {
        throw new Error("Insufficient funds in your wallet to complete this purchase. Please top up your balance.");
      }

      if (!users[buyerAddress].roles.includes('user') && !users[buyerAddress].roles.includes('admin')) {
          throw new Error("Unauthorized: Your digital identity lacks 'user' or 'admin' privileges to purchase NFTs.");
      }

      const sellerAddress = dream.owner;
      if (!users[sellerAddress]) {
        users[sellerAddress] = generateMockUserProfile(sellerAddress);
      }

      console.log(`[AgenticAI:AnomalyDetection] Performing pre-settlement risk assessment for Tx ID: ${transactionId}`);
      const { isFlagged, reason, riskScore } = simulateRiskScore(buyerAddress, amountEth, 'sale');
      if (isFlagged) {
          transactionStatus = 'flagged';
          dream.history.push({
              type: 'fraud_flagged',
              timestamp: Date.now(),
              initiator: 'AgenticAI_AnomalyDetection',
              targetNFT: tokenId,
              details: `Transaction flagged by AI risk engine: ${reason}. Risk Score: ${riskScore}`,
              amountEth: amountEth,
              transactionId: transactionId,
              status: transactionStatus,
              metadata: { riskScore, reason, sourceAgent: 'AnomalyDetectionAgent' }
          });
          console.error(`[PaymentEngine] Purchase for ${tokenId} by ${truncateAddress(buyerAddress)} BLOCKED due to risk flag: ${reason}. Tx ID: ${transactionId}`);
          throw new Error(`Transaction blocked by risk management: ${reason}. Please contact support with Tx ID: ${truncateAddress(transactionId)}.`);
      }

      const paymentRail = simulatePaymentRailRouter('sale', amountEth);
      console.log(`[AgenticAI:PaymentRouter] Routing payment for Tx ID: ${transactionId} via optimal rail: ${paymentRail}.`);

      const royaltyAmount = amountEth * (MARKETPLACE_CONFIG.ROYALTY_PERCENTAGE / 100);
      const sellerReceives = amountEth - royaltyAmount;

      users[buyerAddress].balanceEth = parseFloat((users[buyerAddress].balanceEth - amountEth).toFixed(4));
      users[sellerAddress].balanceEth = parseFloat((users[sellerAddress].balanceEth + sellerReceives).toFixed(4));

      if (dream.creator !== sellerAddress && users[dream.creator]) {
        users[dream.creator].balanceEth = parseFloat((users[dream.creator].balanceEth + royaltyAmount).toFixed(4));
        console.log(`[PaymentEngine] Royalty of ${formatEth(royaltyAmount)} paid to creator ${truncateAddress(dream.creator)}.`);
      } else if (dream.creator === sellerAddress) {
          console.log(`[PaymentEngine] Creator is also seller for ${tokenId}. Royalty implicitly included in sale proceeds.`);
      } else {
          console.warn(`[PaymentEngine] Phantom creator ${truncateAddress(dream.creator)} received ${formatEth(royaltyAmount)} royalty (profile not found in mock for direct credit).`);
      }

      users[sellerAddress].ownedNFTs = users[sellerAddress].ownedNFTs.filter(id => id !== tokenId);
      if (!users[buyerAddress].ownedNFTs.includes(tokenId)) {
        users[buyerAddress].ownedNFTs.push(tokenId);
      }
      dream.owner = buyerAddress;
      dream.isForSale = false;
      dream.lastSoldPriceEth = amountEth;
      dream.priceEth = undefined;
      dream.currentBidders = [];

      transactionStatus = 'completed';
      dream.history.push({
        type: 'sale',
        timestamp: Date.now(),
        initiator: buyerAddress,
        targetNFT: tokenId,
        details: `Purchased by ${truncateAddress(buyerAddress)} from ${truncateAddress(sellerAddress)} for ${formatEth(amountEth)} (Royalty: ${formatEth(royaltyAmount)})`,
        amountEth: amountEth,
        transactionId: transactionId,
        paymentRail: paymentRail,
        status: transactionStatus,
        metadata: { sellerReceives, royaltyAmount, buyerAddress, sellerAddress, creatorAddress: dream.creator }
      });

      console.log(`[PaymentEngine] Purchase for ${tokenId} by ${truncateAddress(buyerAddress)} COMPLETED. Funds transferred, ownership updated. Tx ID: ${transactionId}`);

      console.log(`[AgenticAI:ReconciliationAgent] Initiating post-settlement reconciliation for Tx ID: ${transactionId}`);
      dream.history.push({
        type: 'reconciliation_started',
        timestamp: Date.now() + 50,
        initiator: 'AgenticAI_ReconciliationAgent',
        targetNFT: tokenId,
        details: `Post-settlement reconciliation initiated for transaction ${truncateAddress(transactionId)}.`,
        transactionId: transactionId,
        status: 'reconciling',
        metadata: { sourceAgent: 'ReconciliationAgent' }
      });
      setTimeout(() => {
          dream.history.push({
              type: 'agent_remediation',
              timestamp: Date.now() + 1000,
              initiator: 'AgenticAI_ReconciliationAgent',
              targetNFT: tokenId,
              details: `Transaction ${truncateAddress(transactionId)} successfully reconciled by Agentic AI.`,
              transactionId: transactionId,
              status: 'completed',
              metadata: { reconciliationOutcome: 'success', verificationSteps: ['ledger_match', 'ownership_update_verified'] }
          });
          console.log(`[AgenticAI:ReconciliationAgent] Transaction ${transactionId} reconciliation completed.`);
      }, 1000);

      return dream;
    },

    /**
     * Simulates placing a bid on an NFT. It includes all the necessary checks: do you have
     * enough money? Is the bid high enough? Are you trying to bid on your own item?
     * Our pretend AI also gives it a quick look-over for anything suspicious.
     */
    placeBid: async (tokenId: string, bidderAddress: string, bidAmountEth: number): Promise<DreamNFT> => {
      await new Promise(res => setTimeout(res, 1500 + Math.random() * 500));
      const dream = dreams[tokenId];
      if (!dream) {
        throw new Error("NFT not found for bidding. Asset integrity check failed.");
      }
      if (!dream.isForSale) {
        throw new Error("NFT not currently listed for sale, cannot place a bid.");
      }
      if (bidderAddress === dream.owner) {
        throw new Error("Cannot bid on your own NFT. Policy violation.");
      }
      const currentHighestBid = dream.history
          .filter(item => item.type === 'bid_placed' && item.amountEth !== undefined && dream.currentBidders.includes(item.initiator))
          .reduce((max, item) => Math.max(max, item.amountEth!), 0);

      if (dream.priceEth && bidAmountEth < dream.priceEth * 0.5) {
          throw new Error("Bid amount is too low. Must be at least 50% of the current listing price for a valid offer.");
      }
      if (bidAmountEth <= currentHighestBid) {
          throw new Error(`Your bid of ${formatEth(bidAmountEth)} must be higher than the current highest bid of ${formatEth(currentHighestBid)}.`);
      }
      if (!users[bidderAddress] || users[bidderAddress].balanceEth < bidAmountEth) {
        throw new Error("Insufficient funds in your wallet to cover this bid. Please ensure you have enough ETH.");
      }

      if (!users[bidderAddress] || !users[bidderAddress].roles.includes('user')) {
          throw new Error("Unauthorized: Your digital identity lacks 'user' privileges to place bids.");
      }

      const transactionId = generateTransactionId();
      const paymentRail = simulatePaymentRailRouter('bid', bidAmountEth);

      const { isFlagged: bidFlagged, reason: bidFlagReason, riskScore } = simulateRiskScore(bidderAddress, bidAmountEth, 'bid');
      if (bidFlagged) {
          console.warn(`[AgenticAI:AnomalyDetection] Bid transaction ${transactionId} flagged: ${bidFlagReason}. Risk Score: ${riskScore}`);
          throw new Error(`Bid flagged by risk system: ${bidFlagReason}. Tx ID: ${truncateAddress(transactionId)}`);
      }

      dream.history.push({
          type: 'bid_placed',
          timestamp: Date.now(),
          initiator: bidderAddress,
          targetNFT: tokenId,
          details: `Bid of ${formatEth(bidAmountEth)} placed by ${truncateAddress(bidderAddress)}`,
          amountEth: bidAmountEth,
          transactionId: transactionId,
          paymentRail: paymentRail,
          status: 'completed',
          metadata: { riskScore }
      });

      if (!dream.currentBidders.includes(bidderAddress)) {
          dream.currentBidders.push(bidderAddress);
      }
      console.log(`[Logging] Bid Placed: ${dream.tokenId} by ${truncateAddress(bidderAddress)} for ${formatEth(bidAmountEth)} via ${paymentRail}. Tx ID: ${transactionId}`);

      return dream;
    },

    getAllUserProfiles: async (): Promise<UserProfile[]> => {
        await new Promise(res => setTimeout(res, 200));
        return Object.values(users);
    },

    incrementViewCount: async (tokenId: string): Promise<void> => {
        await new Promise(res => setTimeout(res, 50));
        if (dreams[tokenId]) {
            dreams[tokenId].viewCount++;
            console.log(`[Metrics] NFT ${tokenId} view count incremented to ${dreams[tokenId].viewCount}`);
        }
    },

    likeNFT: async (tokenId: string): Promise<void> => {
        await new Promise(res => setTimeout(res, 100));
        if (dreams[tokenId]) {
            dreams[tokenId].likeCount++;
            console.log(`[Metrics] NFT ${tokenId} like count incremented to ${dreams[tokenId].likeCount}`);
        }
    },

    addFavoriteNFT: async (userAddress: string, tokenId: string): Promise<void> => {
        await new Promise(res => setTimeout(res, 100));
        if (users[userAddress] && !users[userAddress].favoriteNFTs.includes(tokenId)) {
            users[userAddress].favoriteNFTs.push(tokenId);
            console.log(`[Logging] User ${truncateAddress(userAddress)} favorited NFT ${tokenId}`);
        }
    },

    removeFavoriteNFT: async (userAddress: string, tokenId: string): Promise<void> => {
        await new Promise(res => setTimeout(res, 100));
        if (users[userAddress]) {
            users[userAddress].favoriteNFTs = users[userAddress].favoriteNFTs.filter(id => id !== tokenId);
            console.log(`[Logging] User ${truncateAddress(userAddress)} unfavorited NFT ${tokenId}`);
        }
    },
  };
})();


/**
 * A reusable button component that doesn't look terrible. Comes in several flavors.
 *
 * Its Job: To provide a consistent look and feel for all clickable actions across
 * the application. Using a standardized component like this saves time and makes
 * the whole UI feel more coherent and professional. It's a small building block,
 * but a very important one.
 */
export const StyledButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost', size?: 'sm' | 'md' | 'lg' }> = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  const baseStyle = 'rounded-lg font-semibold transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800';
  const variantStyle = {
    primary: 'bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent border border-gray-600 hover:border-cyan-500 text-gray-300 hover:text-cyan-400 focus:ring-cyan-500',
  }[variant];
  const sizeStyle = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  }[size];

  return (
    <button className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className || ''} disabled:opacity-50 disabled:cursor-not-allowed`} {...props}>
      {children}
    </button>
  );
};

/**
 * A reusable input field that also doesn't look terrible.
 *
 * Its Job: To ensure all text input fields look and behave the same way. This consistency
 * is crucial for a good user experience, as it makes forms predictable and easy to use.
 * It's another simple component that saves a lot of repeated styling code.
 */
export const StyledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input
      className={`w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-200 text-white placeholder-gray-400 ${className || ''}`}
      {...props}
    />
  );
};

/**
 * A reusable, styled text area for longer blocks of text.
 *
 * Its Job: Perfect for things like NFT descriptions or user bios. It provides a
 * consistent, larger input area that encourages users to write more than a single
 * word. Just like its smaller sibling, `StyledInput`, it's all about consistency.
 */
export const StyledTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => {
  return (
    <textarea
      className={`w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-200 resize-y text-white placeholder-gray-400 ${className || ''}`}
      rows={4}
      {...props}
    />
  );
};

/**
 * A reusable dropdown menu component. For when you need to select one thing from a list.
 *
 * Its Job: Provides a standard way for users to make a choice from a predefined set
 * of options, like picking an art style or a licensing agreement. It's a fundamental
 * part of any form, and having a consistent one makes the whole app feel more solid.
 */
export const StyledSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, children, ...props }) => {
  return (
    <select
      className={`w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-200 text-white ${className || ''}`}
      {...props}
    >
      {children}
    </select>
  );
};

/**
 * A little spinning circle to show that the computer is thinking really hard.
 *
 * The Point: This is surprisingly important. When the app is busy fetching data or
 * processing a transaction, this spinner tells the user "Hey, I'm working on it!"
 * It prevents them from thinking the app is broken and rage-clicking everywhere.
 * It's a small gesture of respect for the user's time and patience.
 */
export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

/**
 * A component for displaying angry red error messages when things go wrong.
 *
 * Why?: Because things will inevitably go wrong. This component provides a clear,
 * consistent way to tell the user what happened and why their transaction failed or
 * their form didn't submit. Good error messages turn a frustrating experience into
 * an understandable one.
 */
export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div role="alert" className="bg-red-900 text-red-200 p-3 rounded-lg mt-4 text-sm border border-red-700">
    <p className="font-semibold">Error:</p>
    <p>{message}</p>
  </div>
);

/**
 * A component for displaying happy green success messages when things go right.
 *
 * Why?: Positive reinforcement! When a user successfully mints an NFT or updates
 * their profile, this message gives them a little pat on the back. It confirms their
 * action was completed and makes the experience more satisfying.
 */
export const SuccessMessage: React.FC<{ message: string }> = ({ message }) => (
  <div role="status" className="bg-green-900 text-green-200 p-3 rounded-lg mt-4 text-sm border border-green-700">
    <p className="font-semibold">Success:</p>
    <p>{message}</p>
  </div>
);

/**
 * A generic, reusable modal (or pop-up) component. It's a box that appears on top
 * of everything else to demand the user's attention.
 *
 * The Role: Modals are perfect for focused tasks like minting a new NFT, editing a
 * profile, or showing detailed information without navigating to a new page. A good,
 * reusable modal component is a huge time-saver and ensures all pop-ups in the app
 * look and feel consistent.
 */
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog" aria-labelledby="modal-title">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all sm:align-middle sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 id="modal-title" className="text-xl font-bold">{title}</h2>
          <StyledButton variant="secondary" onClick={onClose} aria-label="Close modal" title="Close">
            <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </StyledButton>
        </div>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Renders the page navigation controls (e.g., "Prev | 1 | 2 | 3 | Next").
 *
 * Why it's necessary: Displaying 500 NFTs on one page would crash the browser and the user's
 * will to live. Pagination breaks the content into manageable chunks, making the
 * marketplace fast, responsive, and easy to navigate. It's a fundamental feature
 * for any application that deals with large amounts of data.
 */
export const PaginationControls: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > Math.floor(maxPagesToShow / 2) + 1) pages.push('...');

      const startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2) + 1);
      const endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPagesToShow / 2) - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - Math.floor(maxPagesToShow / 2)) pages.push('...');
      if (totalPages > 1) pages.push(totalPages);
    }
    return Array.from(new Set(pages.filter((val, index, self) => !(val === '...' && index > 0 && self[index - 1] === '...'))));
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center space-x-2 mt-6" aria-label="Pagination">
      <StyledButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="secondary"
        size="sm"
        aria-label="Go to previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="sr-only sm:not-sr-only ml-1">Previous</span>
      </StyledButton>
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <StyledButton
              onClick={() => onPageChange(page)}
              variant={page === currentPage ? 'primary' : 'secondary'}
              size="sm"
              className={page === currentPage ? 'cursor-default' : ''}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </StyledButton>
          ) : (
            <span className="px-2 py-1.5 text-gray-400" aria-hidden="true">...</span>
          )}
        </React.Fragment>
      ))}
      <StyledButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="secondary"
        size="sm"
        aria-label="Go to next page"
      >
        <span className="sr-only sm:not-sr-only mr-1">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </StyledButton>
    </nav>
  );
};

/**
 * AppProvider is the master component that holds all the application's shared state.
 * It's like the central nervous system, providing data and functions to any component
 * that needs them, thanks to the magic of React Context.
 *
 * Why it's the Boss: This component is the "single source of truth" for our app.
 * It ensures that when data changes in one place (like a user's balance after a
 * purchase), the change is reflected everywhere instantly. This prevents inconsistencies
 * and makes the application's state much, much easier to manage, especially as it
 * grows to an absurd length.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [marketData, setMarketData] = useState<DreamNFT[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);

  const fetchMarketData = useCallback(async () => {
    try {
      const data = await mockBackend.fetchDreamNFTs();
      setMarketData(data);
      const allUsers = await mockBackend.getAllUserProfiles();
      setUserProfiles(allUsers);
    } catch (error) {
      console.error("Failed to fetch market data:", error);
    }
  }, []);

  const walletConnect = useCallback(async () => {
    setIsLoadingWallet(true);
    try {
      const address = generateRandomWalletAddress();
      const user = await mockBackend.fetchUserProfile(address);
      setCurrentUser(user);
      if (!userProfiles.find(u => u.walletAddress === user?.walletAddress)) {
        setUserProfiles(prev => [...prev, user!]);
      }
      return user!;
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setCurrentUser(null);
      throw error;
    } finally {
      setIsLoadingWallet(false);
    }
  }, [userProfiles]);

  const walletDisconnect = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const updateMarketItem = useCallback((tokenId: string, updates: Partial<DreamNFT>) => {
    setMarketData(prev =>
      prev.map(nft => (nft.tokenId === tokenId ? { ...nft, ...updates } : nft))
    );
  }, []);

  const addMarketItem = useCallback((nft: DreamNFT) => {
    setMarketData(prev => [nft, ...prev]);
  }, []);

  const removeMarketItem = useCallback((tokenId: string) => {
    setMarketData(prev => prev.filter(nft => nft.tokenId !== tokenId));
  }, []);

  const updateUserProfile = useCallback((walletAddress: string, updates: Partial<UserProfile>) => {
    setUserProfiles(prev =>
      prev.map(profile =>
        profile.walletAddress === walletAddress ? { ...profile, ...updates } : profile
      )
    );
    if (currentUser && currentUser.walletAddress === walletAddress) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const contextValue = useMemo(() => ({
    currentUser,
    setCurrentUser,
    walletConnect,
    walletDisconnect,
    isLoadingWallet,
    marketData,
    fetchMarketData,
    updateMarketItem,
    addMarketItem,
    removeMarketItem,
    userProfiles,
    updateUserProfile,
  }), [
    currentUser,
    setCurrentUser,
    walletConnect,
    walletDisconnect,
    isLoadingWallet,
    marketData,
    fetchMarketData,
    updateMarketItem,
    addMarketItem,
    removeMarketItem,
    userProfiles,
    updateUserProfile,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};


/**
 * Displays the current user's wallet info or a prompt to connect. It's the user's
 * command center for their digital identity and fake finances.
 *
 * The Point: This is the primary touchpoint for the user's session. It provides
 * a quick summary of their status and assets, making them feel grounded in the
 * application. The big "Connect Wallet" button is also the front door to participation,
 * making it a critical component for user onboarding and engagement.
 */
export const WalletInfoPanel: React.FC = () => {
  const { currentUser, walletConnect, walletDisconnect, isLoadingWallet } = useAppContext();
  const [profileEditOpen, setProfileEditOpen] = useState(false);

  if (isLoadingWallet) {
    return (
      <div className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center min-h-[150px] shadow-md border border-gray-600 animate-pulse" aria-live="polite" aria-busy="true">
        <LoadingSpinner />
        <p className="mt-3 text-lg text-gray-300">Connecting Wallet securely to Digital Identity Layer...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-gray-700 p-6 rounded-lg flex flex-col items-center shadow-md border border-gray-600" aria-label="Wallet Connection Panel">
        <p className="text-xl font-semibold mb-4 text-white">Connect your digital identity</p>
        <p className="text-gray-400 text-center mb-6">Unlock full marketplace features: mint, buy, sell programmable value assets.</p>
        <StyledButton onClick={walletConnect} size="lg" className="w-full sm:w-auto" aria-label="Connect Wallet">
          Connect Wallet
        </StyledButton>
      </div>
    );
  }

  const ownedNFTCount = currentUser.ownedNFTs.length;

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg border border-gray-600" aria-label={`User Profile: ${currentUser.username}`}>
      <div className="flex items-center space-x-4 mb-4">
        <img src={currentUser.profilePictureUrl} alt="Profile avatar" className="w-16 h-16 rounded-full border-2 border-cyan-500 object-cover" />
        <div>
          <h3 className="text-xl font-bold text-white flex items-center">
            {currentUser.username}
            {currentUser.isVerified && <span className="ml-2 text-blue-400" title="Verified Creator/Collector"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></span>}
          </h3>
          <p className="text-sm text-gray-400 font-mono break-all">{truncateAddress(currentUser.walletAddress, 8)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm mb-4 border-t border-gray-600 pt-4">
        <div>
          <p className="font-semibold text-gray-300">Balance:</p>
          <p className="text-cyan-400 text-lg font-mono">{formatEth(currentUser.balanceEth)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-300">Owned Dreams:</p>
          <p className="text-lg font-mono">{ownedNFTCount}</p>
        </div>
        <div className="col-span-2">
            <p className="font-semibold text-gray-300">Bio:</p>
            <p className="text-sm italic text-gray-400 break-words max-h-20 overflow-y-auto custom-scrollbar">{currentUser.bio}</p>
        </div>
        <div className="col-span-2">
            <p className="font-semibold text-gray-300">Assigned Roles:</p>
            <p className="text-sm italic text-gray-400">{currentUser.roles.join(', ')}</p>
        </div>
        <div className="col-span-2">
            <p className="font-semibold text-gray-300">Digital Public Key:</p>
            <p className="text-xs font-mono break-all text-gray-500">{truncateAddress(currentUser.publicKey || 'N/A', 10)}</p>
        </div>
      </div>
      <div className="flex justify-end space-x-2 border-t border-gray-600 pt-4">
        <StyledButton variant="secondary" onClick={() => setProfileEditOpen(true)} size="sm" aria-label="Edit your profile information">
          Edit Profile
        </StyledButton>
        <StyledButton variant="danger" onClick={walletDisconnect} size="sm" aria-label="Disconnect your wallet">
          Disconnect
        </StyledButton>
      </div>

      <EditProfileModal
        isOpen={profileEditOpen}
        onClose={() => setProfileEditOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
};

/**
 * A pop-up form for editing your user profile. Let's you change your username
 * and bio, because personal expression is important, even in a fake marketplace.
 *
 * Its Role: This gives users control over their digital identity. It's a simple
 * feature that makes the platform feel more personal and engaging. Plus, it's a
 * good demonstration of how to handle form submissions, validation, and state
 * updates in a modal.
 */
export const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void; currentUser: UserProfile }> = ({ isOpen, onClose, currentUser }) => {
  const { updateUserProfile, fetchMarketData } = useAppContext();
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUsername(currentUser.username);
      setBio(currentUser.bio);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!username.trim()) {
      setError("Username cannot be empty. Identity requires a valid name.");
      setLoading(false);
      return;
    }
    if (username.length > MARKETPLACE_CONFIG.MAX_USERNAME_LENGTH) {
        setError(`Username exceeds maximum length of ${MARKETPLACE_CONFIG.MAX_USERNAME_LENGTH} characters. Please shorten your display name.`);
        setLoading(false);
        return;
    }
    if (!bio.trim()) {
        setError("Bio cannot be empty. Please provide a description for your profile.");
        setLoading(false);
        return;
    }
    if (bio.length > MARKETPLACE_CONFIG.MAX_BIO_LENGTH) {
        setError(`Bio exceeds maximum length of ${MARKETPLACE_CONFIG.MAX_BIO_LENGTH} characters. Please shorten your description.`);
        setLoading(false);
        return;
    }

    try {
      await mockBackend.updateUserProfile(currentUser.walletAddress, { username, bio });
      updateUserProfile(currentUser.walletAddress, { username, bio });
      await fetchMarketData();
      setSuccess("Profile updated successfully, changes reflected across your digital identity!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile. An integrity check may have failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Your Digital Identity Profile">
      <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="edit-profile-form-title">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username <span className="text-red-400">*</span></label>
          <StyledInput
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your marketplace username"
            required
            maxLength={MARKETPLACE_CONFIG.MAX_USERNAME_LENGTH}
            aria-describedby="username-help"
          />
          <p id="username-help" className="text-xs text-gray-500 mt-1">Choose a unique display name (max {MARKETPLACE_CONFIG.MAX_USERNAME_LENGTH} characters) for your digital persona.</p>
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio <span className="text-red-400">*</span></label>
          <StyledTextarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your passions, collection, or artistic vision, contributing to your digital footprint..."
            maxLength={MARKETPLACE_CONFIG.MAX_BIO_LENGTH}
            aria-describedby="bio-help"
          />
          <p id="bio-help" className="text-xs text-gray-500 mt-1">A short introduction about yourself (max {MARKETPLACE_CONFIG.MAX_BIO_LENGTH} characters).</p>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-700 mt-6">
          <StyledButton type="button" variant="secondary" onClick={onClose} disabled={loading} aria-label="Cancel profile changes">
            Cancel
          </StyledButton>
          <StyledButton type="submit" disabled={loading} aria-label="Save profile changes">
            {loading ? <LoadingSpinner /> : 'Save Changes'}
          </StyledButton>
        </div>
      </form>
    </Modal>
  );
};


/**
 * The "Mint a Dream" pop-up. This is where users feed their ideas into our pretend
 * AI to create a brand new, shiny NFT.
 *
 * Its Grand Purpose: This is the content creation engine of our marketplace. It's
 * the interface for the "generative AI" part of the simulation. A smooth, intuitive
 * minting process is key to encouraging users to add new assets to the platform,
 * which keeps the marketplace fresh and generates those sweet, sweet (fake) minting fees.
 */
export const MintDreamModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser, addMarketItem, fetchMarketData } = useAppContext();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(MARKETPLACE_CONFIG.SUPPORTED_DREAM_STYLES[0]);
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [licensing, setLicensing] = useState<MintRequestParams['licensing']>(MARKETPLACE_CONFIG.LICENSING_OPTIONS[0].id as MintRequestParams['licensing']);
  const [tagsInput, setTagsInput] = useState('');
  const [emotionTone, setEmotionTone] = useState('neutral');
  const [complexityScore, setComplexityScore] = useState(50);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPrompt('');
      setStyle(MARKETPLACE_CONFIG.SUPPORTED_DREAM_STYLES[0]);
      setPrivacy('public');
      setLicensing(MARKETPLACE_CONFIG.LICENSING_OPTIONS[0].id as MintRequestParams['licensing']);
      setTagsInput('');
      setEmotionTone('neutral');
      setComplexityScore(50);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Please connect your wallet to mint a dream NFT and verify your digital identity.");
      return;
    }
    if (!currentUser.roles.includes('creator') && !currentUser.roles.includes('admin')) {
        setError("Unauthorized: Your digital identity must have 'creator' or 'admin' role to mint NFTs. Please contact support if this is incorrect.");
        return;
    }
    if (!prompt.trim()) {
      setError("Dream prompt cannot be empty. Please describe your vision to the generative AI.");
      return;
    }
    if (prompt.length > MARKETPLACE_CONFIG.MAX_PROMPT_LENGTH) {
        setError(`Prompt exceeds maximum length of ${MARKETPLACE_CONFIG.MAX_PROMPT_LENGTH} characters. Please shorten your description for optimal AI processing.`);
        return;
    }

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    if (tags.length > MARKETPLACE_CONFIG.MAX_TAGS_PER_NFT) {
        setError(`You can add a maximum of ${MARKETPLACE_CONFIG.MAX_TAGS_PER_NFT} tags. Please refine your metadata.`);
        return;
    }

    setIsMinting(true);
    setError(null);
    setSuccess(null);

    try {
      const mintedDream = await mockBackend.mintDreamNFT({
        prompt, style, privacy, licensing, tags, emotionTone, complexityScore
      }, currentUser.walletAddress);
      addMarketItem(mintedDream);
      await fetchMarketData();
      setSuccess("Dream minted successfully! Your new programmable asset is now in your collection.");
    } catch (err: any) {
      console.error("Minting error:", err);
      setError(err.message || "Failed to mint dream. An unexpected error or policy violation occurred.");
      if (err.message.includes("Insufficient funds")) {
          setError(`${err.message} Please ensure your wallet has ${formatEth(MARKETPLACE_CONFIG.MINT_FEE_ETH)} to cover the minting fee.`);
      }
    } finally {
      setIsMinting(false);
    }
  };

  const currentTagsCount = tagsInput.split(',').filter(t => t.trim() !== '').length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mint a New Ethereal Dream NFT (Programmable Asset)">
      <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="mint-dream-form-title">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">Dream Prompt <span className="text-red-400">*</span></label>
          <StyledTextarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the dream you wish to materialize (e.g., 'A bioluminescent forest under twin moons, rendered in a surreal style')"
            required
            maxLength={MARKETPLACE_CONFIG.MAX_PROMPT_LENGTH}
            aria-describedby="prompt-char-count"
          />
          <p id="prompt-char-count" className="text-xs text-gray-400 mt-1">{prompt.length}/{MARKETPLACE_CONFIG.MAX_PROMPT_LENGTH} characters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-1">Art Style</label>
            <StyledSelect id="style" value={style} onChange={(e) => setStyle(e.target.value)} aria-label="Select dream art style">
              {MARKETPLACE_CONFIG.SUPPORTED_DREAM_STYLES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </StyledSelect>
          </div>
          <div>
            <label htmlFor="emotionTone" className="block text-sm font-medium text-gray-300 mb-1">Emotional Tone</label>
            <StyledSelect id="emotionTone" value={emotionTone} onChange={(e) => setEmotionTone(e.target.value)} aria-label="Select emotional tone for AI generation">
              {['neutral', 'calm', 'vibrant', 'mysterious', 'melancholic', 'joyful', 'eerie', 'adventurous', 'nostalgic', 'futuristic'].map(tone => (
                <option key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</option>
              ))}
            </StyledSelect>
          </div>
        </div>

        <div>
          <label htmlFor="complexity" className="block text-sm font-medium text-gray-300 mb-1">Visual Complexity: <span className="font-semibold text-cyan-400">{complexityScore}</span></label>
          <input
            id="complexity"
            type="range"
            min="0"
            max="100"
            step="1"
            value={complexityScore}
            onChange={(e) => setComplexityScore(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label={`Set visual complexity for AI generation to ${complexityScore}`}
          />
          <p className="text-xs text-gray-500 mt-1">Lower scores for simpler designs, higher for more intricate details (influences generative AI parameters).</p>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated, max {MARKETPLACE_CONFIG.MAX_TAGS_PER_NFT})</label>
          <StyledInput
            id="tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g., fantasy, nature, abstract, space (for discoverability)"
            aria-describedby="tags-info"
          />
          <p id="tags-info" className="text-xs text-gray-400 mt-1">{currentTagsCount}/{MARKETPLACE_CONFIG.MAX_TAGS_PER_NFT} tags entered</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="privacy" className="block text-sm font-medium text-gray-300 mb-1">Privacy Setting</label>
            <StyledSelect id="privacy" value={privacy} onChange={(e) => setPrivacy(e.target.value as 'public' | 'private')} aria-label="Select dream privacy setting">
              <option value="public">Public (Visible to all on marketplace and discoverable)</option>
              <option value="private">Private (Only visible to owner, not listed publicly, for personal use or future listing)</option>
            </StyledSelect>
            <p className="text-xs text-gray-500 mt-1">Private dreams can be shared later, but aren't initially listed on the public marketplace.</p>
          </div>
          <div>
            <label htmlFor="licensing" className="block text-sm font-medium text-gray-300 mb-1">Licensing</label>
            <StyledSelect id="licensing" value={licensing} onChange={(e) => setLicensing(e.target.value as MintRequestParams['licensing'])} aria-label="Select licensing option for your NFT">
              {MARKETPLACE_CONFIG.LICENSING_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </StyledSelect>
            <p className="text-xs text-gray-500 mt-1 h-10 overflow-y-auto custom-scrollbar">
              {MARKETPLACE_CONFIG.LICENSING_OPTIONS.find(opt => opt.id === licensing)?.description}
            </p>
          </div>
        </div>

        <div className="mt-6 p-3 bg-gray-700 rounded-lg border border-gray-600">
            <p className="text-sm text-gray-300 font-semibold">Programmable Asset Minting Fee: <span className="text-cyan-400">{formatEth(MARKETPLACE_CONFIG.MINT_FEE_ETH)}</span></p>
            {currentUser && (
                <p className="text-xs text-gray-400">Your current balance: <span className="text-cyan-400">{formatEth(currentUser.balanceEth)}</span>
                {currentUser.balanceEth < MARKETPLACE_CONFIG.MINT_FEE_ETH && <span className="text-red-400 ml-2 font-bold"> (Insufficient funds! Please top up.)</span>}
                </p>
            )}
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-700 mt-6">
          <StyledButton type="button" variant="secondary" onClick={onClose} disabled={isMinting} aria-label="Cancel minting process for this dream NFT">
            Cancel
          </StyledButton>
          <StyledButton type="submit" disabled={isMinting || !currentUser || currentUser.balanceEth < MARKETPLACE_CONFIG.MINT_FEE_ETH || (!currentUser.roles.includes('creator') && !currentUser.roles.includes('admin'))} aria-label="Mint your dream as an NFT">
            {isMinting ? <LoadingSpinner /> : 'Mint Dream as NFT'}
          </StyledButton>
        </div>
      </form>
    </Modal>
  );
};


/**
 * A single card that displays a preview of one Dream NFT. It's the little window
 * into the soul of each digital asset.
 *
 * Its Job: To be an attractive, informative, and clickable summary. This component
 * is the workhorse of the marketplace grid. It needs to convey the most important
 * information at a glance (image, price, name) to entice users to click for more
 * details. A grid of these cards is the heart of the marketplace view.
 */
export const DreamCard: React.FC<{ dream: DreamNFT; onDetailsClick: (dream: DreamNFT) => void }> = ({ dream, onDetailsClick }) => {
  const { currentUser } = useAppContext();
  const isOwner = currentUser?.walletAddress === dream.owner;

  return (
    <article className="bg-gray-700 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-600 relative group" aria-label={`NFT: ${dream.prompt}`}>
      <div className="relative w-full h-48 overflow-hidden">
        <img src={dream.visualizationUrl} alt={`Visualization of ${dream.prompt}`} className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        {dream.isForSale && dream.priceEth !== undefined && (
            <div className="absolute top-2 left-2 bg-cyan-600 text-white text-xs px-2 py-1 rounded-md font-bold">
                {formatEth(dream.priceEth)}
            </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2" title={dream.prompt}>{dream.prompt}</h3>
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 12v-1m-4-6H4m9 0h9m-9.95.942a9.141 9.141 0 01-2.07-.638 9.07 9.07 0 01-1.396-.988 9.07 9.07 0 01-.988-1.396 9.14 9.14 0 01-.638-2.07C4.686 9.548 4 10.744 4 12c0 2.946 1.48 5.61 3.864 7.221A9.155 9.155 0 0112 20c.843 0 1.666-.098 2.464-.298m0 0a9.083 9.083 0 00-2.464 0" />
          </svg>
          <span className="truncate">{dream.style}</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-800 text-blue-200" title={`Rarity Score: ${dream.rarityScore}/100`}>Rarity: {dream.rarityScore}</span>
        </div>

        <div className="flex items-center text-sm text-gray-300 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate" title={`Current Owner: ${dream.owner}`}>Owner: {isOwner ? 'You' : truncateAddress(dream.owner)}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-600">
            <span className="flex items-center mr-3" title="View Count">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {dream.viewCount.toLocaleString()}
            </span>
            <span className="flex items-center mr-3" title="Like Count">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {dream.likeCount.toLocaleString()}
            </span>
            <div className="ml-auto">
                <StyledButton onClick={() => onDetailsClick(dream)} size="sm" aria-label={`View details for ${dream.prompt}`}>
                    Details
                </StyledButton>
            </div>
        </div>
      </div>
    </article>
  );
};


/**
 * The detailed view of a single NFT, shown in a modal. This is where you go to see
 * absolutely everything about a dream: its history, its owner, its licensing terms,
 * and most importantly, how to buy it.
 *
 * Its Critical Role: This component is the nerve center for asset interaction. It's
 * where the most important actions happen: buying, selling, and bidding. It needs to
 * present a ton of information clearly and provide intuitive controls for high-stakes
 * transactions. The immutable history log is particularly important for building trust
 * and showing the asset's (pretend) provenance.
 */
export const NFTDetailModal: React.FC<{ isOpen: boolean; onClose: () => void; dream: DreamNFT | null }> = ({ isOpen, onClose, dream }) => {
  const { currentUser, updateMarketItem, fetchMarketData, updateUserProfile } = useAppContext();
  const [isBuying, setIsBuying] = useState(false);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [listPrice, setListPrice] = useState<string>('');
  const [isListing, setIsListing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(null);
      setBidAmount('');
      setListPrice(dream?.priceEth?.toString() || '');

      if (dream) {
          mockBackend.incrementViewCount(dream.tokenId).then(() => {
              updateMarketItem(dream.tokenId, { viewCount: (dream.viewCount || 0) + 1 });
          }).catch(console.error);
      }
    }
  }, [isOpen, dream, updateMarketItem]);

  if (!dream) return null;

  const isOwner = currentUser?.walletAddress === dream.owner;
  const isCreator = currentUser?.walletAddress === dream.creator;
  const currentHighestBid = dream.history
      .filter(item => item.type === 'bid_placed' && item.amountEth !== undefined && dream.currentBidders.includes(item.initiator))
      .reduce((max, item) => Math.max(max, item.amountEth!), 0);


  const handleBuyNow = async () => {
    if (!currentUser) {
      setError("Please connect your wallet to buy this NFT and verify your digital identity.");
      return;
    }
    if (!dream.isForSale || dream.priceEth === undefined) {
      setError("This NFT is not currently listed for sale. Purchase request denied.");
      return;
    }
    if (currentUser.balanceEth < dream.priceEth) {
      setError(`Insufficient funds. Your wallet balance is ${formatEth(currentUser.balanceEth)}, but you need ${formatEth(dream.priceEth)} to complete this high-value purchase.`);
      return;
    }
    if (!currentUser.roles.includes('user') && !currentUser.roles.includes('admin')) {
        setError("Unauthorized: Your digital identity lacks 'user' or 'admin' privileges to purchase NFTs. Transaction rejected.");
        return;
    }

    setIsBuying(true);
    setError(null);
    setSuccess(null);
    try {
      const updatedDream = await mockBackend.buyNFT(dream.tokenId, currentUser.walletAddress, dream.priceEth);
      updateMarketItem(dream.tokenId, updatedDream);
      await fetchMarketData();
      setSuccess(`Successfully purchased "${dream.prompt}" for ${formatEth(dream.priceEth)}! It's now in your collection.`);
    } catch (err: any) {
      console.error("Buy NFT error:", err);
      setError(err.message || "Failed to complete purchase. An unexpected system error or policy violation occurred. Please try again.");
    } finally {
      setIsBuying(false);
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Please connect your wallet to place a bid and verify your digital identity.");
      return;
    }
    if (!currentUser.roles.includes('user') && !currentUser.roles.includes('admin')) {
        setError("Unauthorized: Your digital identity lacks 'user' or 'admin' privileges to place bids. Bid rejected.");
        return;
    }
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid bid amount (e.g., 0.5 ETH). Bid must be positive.");
      return;
    }
    if (currentUser.balanceEth < amount) {
      setError(`Insufficient funds. Your wallet balance is ${formatEth(currentUser.balanceEth)}, but you need ${formatEth(amount)} to cover this bid. Please top up.`);
      return;
    }
    if (dream.isForSale && dream.priceEth && amount < dream.priceEth * 0.5) {
        setError(`Bid is too low. Must be at least 50% of current listing price (${formatEth(dream.priceEth * 0.5)}). Financial policy violation.`);
        return;
    }
    if (amount <= currentHighestBid) {
        setError(`Your bid must be higher than the current highest bid of ${formatEth(currentHighestBid)}. Please submit a competitive offer.`);
        return;
    }

    setIsPlacingBid(true);
    setError(null);
    setSuccess(null);
    try {
      const updatedDream = await mockBackend.placeBid(dream.tokenId, currentUser.walletAddress, amount);
      updateMarketItem(dream.tokenId, updatedDream);
      await fetchMarketData();
      setSuccess(`Your bid of ${formatEth(amount)} has been successfully placed!`);
      setBidAmount('');
    } catch (err: any) {
      console.error("Place bid error:", err);
      setError(err.message || "Failed to place bid. An unexpected error or policy violation occurred.");
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleListForSale = async () => {
    if (!currentUser || currentUser.walletAddress !== dream.owner) {
        setError("You must be the verified owner of this NFT to list it for sale. Digital identity verification failed.");
        return;
    }
    if (!currentUser.roles.includes('creator') && !currentUser.roles.includes('admin') && !currentUser.roles.includes('user')) {
        setError("Unauthorized: Your digital identity lacks 'creator', 'user' or 'admin' privileges to list NFTs for sale.");
        return;
    }
    const price = parseFloat(listPrice);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid listing price greater than 0 ETH. Financial policy violation.");
      return;
    }

    setIsListing(true);
    setError(null);
    setSuccess(null);
    try {
      const updatedDream = await mockBackend.listNFTForSale(dream.tokenId, currentUser.walletAddress, price);
      updateMarketItem(dream.tokenId, updatedDream);
      await fetchMarketData();
      setSuccess(`Your dream has been successfully listed for ${formatEth(price)}!`);
    } catch (err: any) {
      console.error("List NFT for sale error:", err);
      setError(err.message || "Failed to list NFT for sale. Please verify details and try again.");
    } finally {
      setIsListing(false);
    }
  };

  const handleCancelListing = async () => {
    if (!currentUser || currentUser.walletAddress !== dream.owner) {
        setError("You must be the verified owner of this NFT to cancel its listing. Digital identity verification failed.");
        return;
    }
    if (!currentUser.roles.includes('creator') && !currentUser.roles.includes('admin') && !currentUser.roles.includes('user')) {
        setError("Unauthorized: Your digital identity lacks 'creator', 'user' or 'admin' privileges to cancel NFT listings.");
        return;
    }
    if (!dream.isForSale) {
        setError("This NFT is not currently listed for sale. No active listing to cancel.");
        return;
    }

    setIsCancelling(true);
    setError(null);
    setSuccess(null);
    try {
      const updatedDream = await mockBackend.cancelListing(dream.tokenId, currentUser.walletAddress);
      updateMarketItem(dream.tokenId, updatedDream);
      await fetchMarketData();
      setSuccess("Listing successfully cancelled! Your asset is no longer actively marketed.");
    } catch (err: any) {
      console.error("Cancel listing error:", err);
      setError(err.message || "Failed to cancel listing. An unexpected error occurred. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleLikeNFT = async () => {
      if (!currentUser) {
          setError("Please connect your wallet to like NFTs and verify your digital identity.");
          return;
      }
      try {
          await mockBackend.likeNFT(dream.tokenId);
          updateMarketItem(dream.tokenId, { likeCount: (dream.likeCount || 0) + 1 });
      } catch (err) {
          console.error("Error liking NFT:", err);
          setError("Failed to register like. Please try again.");
      }
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
        setError("Please connect your wallet to manage favorites and verify your digital identity.");
        return;
    }
    try {
        const isCurrentlyFavorite = currentUser.favoriteNFTs.includes(dream.tokenId);
        if (isCurrentlyFavorite) {
            await mockBackend.removeFavoriteNFT(currentUser.walletAddress, dream.tokenId);
            updateUserProfile(currentUser.walletAddress, { favoriteNFTs: currentUser.favoriteNFTs.filter(id => id !== dream.tokenId) });
            setSuccess(`NFT ${truncateAddress(dream.tokenId, 4)} removed from favorites.`);
        } else {
            await mockBackend.addFavoriteNFT(currentUser.walletAddress, dream.tokenId);
            updateUserProfile(currentUser.walletAddress, { favoriteNFTs: [...currentUser.favoriteNFTs, dream.tokenId] });
            setSuccess(`NFT ${truncateAddress(dream.tokenId, 4)} added to favorites.`);
        }
    } catch (err) {
        console.error("Error toggling favorite:", err);
        setError("Failed to update favorites. Please try again.");
    }
  };

  const isFavorite = currentUser?.favoriteNFTs.includes(dream.tokenId);
  const getLicensingDescription = (id: string) => MARKETPLACE_CONFIG.LICENSING_OPTIONS.find(opt => opt.id === id)?.description || 'N/A';
  const getLicensingName = (id: string) => MARKETPLACE_CONFIG.LICENSING_OPTIONS.find(opt => opt.id === id)?.name || 'Unknown License';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Programmable Asset Details: ${dream.prompt}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex flex-col items-center">
          <img src={dream.visualizationUrl} alt={`Visualization of ${dream.prompt}`} className="w-full max-w-md rounded-lg shadow-md mb-4 border border-gray-600" />
          <div className="text-center w-full">
            <h4 className="text-xl font-bold text-white mb-2">{dream.prompt}</h4>
            <p className="text-gray-400 text-sm mb-4 italic max-h-32 overflow-y-auto custom-scrollbar">{dream.description || "No description provided for this programmable asset."}</p>
            <div className="flex justify-center space-x-4 mb-4 text-gray-300">
                <span className="flex items-center" title="View Count (Observability Metric)">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {dream.viewCount.toLocaleString()}
                </span>
                <StyledButton variant="ghost" size="sm" onClick={handleLikeNFT} disabled={!currentUser} aria-label={`Like this NFT. Currently has ${dream.likeCount} likes.`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${!currentUser ? 'text-gray-500' : 'text-red-400 hover:text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {dream.likeCount.toLocaleString()}
                </StyledButton>
                <StyledButton variant="ghost" size="sm" onClick={handleToggleFavorite} disabled={!currentUser} aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-500'} ${!currentUser ? 'opacity-50' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.975 2.888a1 1 0 00-.324 1.118l1.519 4.674c.3.921-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.975 2.888c-.784.57-1.838-.197-1.539-1.118l1.519-4.674a1 1 0 00-.324-1.118L2.28 9.293c-.783-.57-.381-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                    <span className="ml-1 text-sm">{isFavorite ? 'Favorited' : 'Favorite'}</span>
                </StyledButton>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
            {dream.tags.map(tag => (
              <span key={tag} className="inline-block bg-gray-600 rounded-full px-3 py-1 text-xs font-semibold text-gray-200">
                #{tag}
              </span>
            ))}
          </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col">
          <h4 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2 text-white">Programmable Asset Information</h4>
          <div className="text-gray-300 text-sm space-y-2 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
            <p><strong>Token ID:</strong> <span className="text-xs font-mono break-all text-cyan-300">{dream.tokenId}</span></p>
            <p><strong>Creator:</strong> <span className="text-cyan-400">{truncateAddress(dream.creator)}</span> {isCreator && <span className="text-xs text-green-400">(You)</span>}</p>
            <p><strong>Current Owner:</strong> <span className="text-cyan-400">{truncateAddress(dream.owner)}</span> {isOwner && <span className="text-xs text-green-400">(You)</span>}</p>
            <p><strong>Minted On:</strong> {formatTimestamp(dream.timestampMinted)}</p>
            <p><strong>Art Style:</strong> <span className="text-blue-400 font-medium">{dream.style}</span></p>
            <p><strong>Rarity Score:</strong> <span className="text-blue-300 font-medium">{dream.rarityScore}/100</span></p>
            <p><strong>Licensing:</strong> <span className="text-purple-300 font-medium">{getLicensingName(dream.licensingOption)}</span></p>
            <p className="text-xs text-gray-500 pl-4 border-l-2 border-gray-600 italic">{getLicensingDescription(dream.licensingOption)}</p>
            <p><strong>High-Res Neural Pattern Access:</strong> {dream.hasHighResAccess ? 'Available' : 'Not Available'}</p>
            {dream.neuralPatternUrl && dream.hasHighResAccess && isOwner && (
                <a href={dream.neuralPatternUrl} download className="text-cyan-400 hover:underline text-sm block mt-2 p-2 bg-gray-700 rounded-lg border border-cyan-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Raw Neural Pattern Data (.bin) - for verified owners
                </a>
            )}
          </div>

          <h4 className="text-lg font-semibold mt-4 mb-3 border-b border-gray-700 pb-2 text-white">Market Interactions & Settlement</h4>
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}

          {dream.isForSale && dream.priceEth !== undefined ? (
            <div className="bg-gray-700 p-4 rounded-lg mb-4 border border-gray-600">
              <p className="text-sm text-gray-400">Current Listing Price:</p>
              <p className="text-3xl font-bold text-cyan-400 mb-2">{formatEth(dream.priceEth)}</p>
              {currentHighestBid > 0 && currentHighestBid < dream.priceEth && (
                  <p className="text-sm text-gray-400">Current Highest Bid: <span className="font-semibold text-blue-300">{formatEth(currentHighestBid)}</span></p>
              )}
              {isOwner ? (
                <>
                  <p className="text-md text-gray-300 mt-3">This is your programmable asset, currently listed for sale.</p>
                  <StyledButton variant="danger" onClick={handleCancelListing} disabled={isCancelling} className="w-full mt-3">
                    {isCancelling ? <LoadingSpinner /> : 'Cancel Listing'}
                  </StyledButton>
                </>
              ) : (
                <>
                  <StyledButton onClick={handleBuyNow} disabled={isBuying || !currentUser || currentUser.balanceEth < (dream.priceEth || 0) || (!currentUser.roles.includes('user') && !currentUser.roles.includes('admin'))} className="w-full mt-3">
                    {isBuying ? <LoadingSpinner /> : 'Buy Now (Real-time Settlement)'}
                  </StyledButton>
                  <form onSubmit={handlePlaceBid} className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="bid-amount" className="text-sm font-medium text-gray-300">Place a Bid (min {dream.priceEth ? formatEth(dream.priceEth * 0.5) : formatEth(0.0001)}):</label>
                    <StyledInput
                      id="bid-amount"
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="e.g., 0.5 ETH"
                      disabled={isPlacingBid || !currentUser || (!currentUser.roles.includes('user') && !currentUser.roles.includes('admin'))}
                      aria-label="Enter bid amount"
                    />
                    <StyledButton type="submit" disabled={isPlacingBid || !currentUser || parseFloat(bidAmount || '0') <= 0 || (currentUser && currentUser.balanceEth < parseFloat(bidAmount || '0')) || (!currentUser.roles.includes('user') && !currentUser.roles.includes('admin'))}>
                      {isPlacingBid ? <LoadingSpinner /> : 'Submit Bid'}
                    </StyledButton>
                  </form>
                  {!currentUser && <p className="text-red-400 text-xs mt-2">Connect your wallet to enable buying and bidding.</p>}
                  {currentUser && !currentUser.roles.some(role => ['user', 'admin'].includes(role)) && <p className="text-red-400 text-xs mt-2">Your current digital identity roles do not permit buying or bidding.</p>}
                </>
              )}
            </div>
          ) : (
            !isOwner && <p className="text-md font-semibold text-gray-400 bg-gray-700 p-4 rounded-lg border border-gray-600 mb-4">This programmable asset is not currently listed for sale.</p>
          )}

          {!dream.isForSale && isOwner && (
            <div className="bg-gray-700 p-4 rounded-lg mb-4 border border-gray-600">
              <p className="text-md text-gray-300 mb-3">Your programmable asset is not currently listed for sale.</p>
              <div className="flex flex-col space-y-2">
                <label htmlFor="list-price" className="text-sm font-medium text-gray-300">List for Sale (Programmable Value Rail):</label>
                <StyledInput
                  id="list-price"
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="e.g., 1.2 ETH"
                  disabled={isListing || (!currentUser.roles.includes('creator') && !currentUser.roles.includes('admin') && !currentUser.roles.includes('user'))}
                  aria-label="Enter listing price in ETH"
                />
                <StyledButton onClick={handleListForSale} disabled={isListing || parseFloat(listPrice || '0') <= 0 || (!currentUser.roles.includes('creator') && !currentUser.roles.includes('admin') && !currentUser.roles.includes('user'))} className="w-full">
                  {isListing ? <LoadingSpinner /> : 'List NFT (on Token Rail)'}
                </StyledButton>
              </div>
              {currentUser && !currentUser.roles.some(role => ['creator', 'admin', 'user'].includes(role)) && <p className="text-red-400 text-xs mt-2">Your current digital identity roles do not permit listing NFTs for sale.</p>}
            </div>
          )}

          {dream.lastSoldPriceEth !== undefined && (
            <p className="text-sm text-gray-400 mt-2">Last Sold: <span className="font-semibold text-green-400">{formatEth(dream.lastSoldPriceEth)}</span></p>
          )}

          <h4 className="text-lg font-semibold mt-6 mb-3 border-b border-gray-700 pb-2 text-white">Immutable Transaction History (Audit Trail)</h4>
          <div className="flex-grow max-h-60 overflow-y-auto custom-scrollbar bg-gray-700 p-3 rounded-lg border border-gray-600">
            {dream.history.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No transaction history found for this programmable asset.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {dream.history.slice().reverse().map((item, index) => (
                  <li key={index} className="border-b border-gray-600 pb-2 last:border-b-0 last:pb-0">
                    <p className="font-medium text-gray-200">{item.details}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <time dateTime={new Date(item.timestamp).toISOString()}>{formatTimestamp(item.timestamp)}</time>
                      {item.transactionId && <span className="ml-2 text-cyan-500 font-mono" title={`Transaction ID: ${item.transactionId}`}>Tx: {truncateAddress(item.transactionId, 6)}</span>}
                      {item.paymentRail && <span className="ml-2 text-purple-400" title={`Payment Rail: ${item.paymentRail}`}>Rail: {item.paymentRail.replace('rail_', '')}</span>}
                      {item.status && <span className={`ml-2 font-semibold ${item.status === 'flagged' ? 'text-red-400' : item.status === 'reconciling' ? 'text-yellow-400' : 'text-green-400'}`} title={`Status: ${item.status}`}>Status: {item.status}</span>}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};


/**
 * The control panel for filtering the marketplace. This is where users can get
 * specific about what they're looking for.
 *
 * Why it's Important: A powerful filter panel transforms a user from a passive browser
 * into an active hunter. It empowers them to sift through the noise and find exactly
 * what they want, which dramatically increases the chances of a sale. For a large
 * marketplace, this isn't a feature; it's a necessity.
 */
export const MarketplaceFiltersPanel: React.FC<{
  filters: MarketplaceFilters;
  setFilters: React.Dispatch<React.SetStateAction<MarketplaceFilters>>;
  onSearch: (query: string) => void;
  allTags: string[];
}> = ({ filters, setFilters, onSearch, allTags }) => {
  const [minPrice, setMinPrice] = useState(filters.priceRange[0].toString());
  const [maxPrice, setMaxPrice] = useState(filters.priceRange[1] === 999999 ? '' : filters.priceRange[1].toString());
  const [tempSearchQuery, setTempSearchQuery] = useState(filters.searchQuery);
  const [minRarity, setMinRarity] = useState(filters.minRarity?.toString() || '');

  useEffect(() => {
    setMinPrice(filters.priceRange[0].toString());
    setMaxPrice(filters.priceRange[1] === 999999 ? '' : filters.priceRange[1].toString());
    setTempSearchQuery(filters.searchQuery);
    setMinRarity(filters.minRarity?.toString() || '');
  }, [filters]);

  const handlePriceChange = useCallback(() => {
    const min = parseFloat(minPrice || '0');
    const max = parseFloat(maxPrice || '999999');
    setFilters(prev => ({
      ...prev,
      priceRange: [isNaN(min) ? 0 : min, isNaN(max) ? 999999 : max]
    }));
  }, [minPrice, maxPrice, setFilters]);

  const handleRarityChange = useCallback(() => {
    const rarity = parseInt(minRarity || '0');
    setFilters(prev => ({
      ...prev,
      minRarity: isNaN(rarity) || rarity < 0 ? undefined : Math.min(rarity, 100)
    }));
  }, [minRarity, setFilters]);

  const handleStyleChange = useCallback((style: string, isChecked: boolean) => {
    setFilters(prev => ({
      ...prev,
      styles: isChecked
        ? [...prev.styles, style]
        : prev.styles.filter(s => s !== style)
    }));
  }, [setFilters]);

  const handleTagChange = useCallback((tag: string, isChecked: boolean) => {
    setFilters(prev => ({
      ...prev,
      tags: isChecked
        ? [...prev.tags, tag]
        : prev.tags.filter(t => t !== tag)
    }));
  }, [setFilters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(tempSearchQuery);
  };

  const resetButton = (
      <StyledButton
          variant="secondary"
          size="sm"
          onClick={() => {
              setFilters({
                  priceRange: [0, 999999],
                  styles: [],
                  tags: [],
                  owner: undefined,
                  isForSaleOnly: false,
                  searchQuery: '',
                  minRarity: undefined
              });
              setMinPrice('0');
              setMaxPrice('');
              setTempSearchQuery('');
              setMinRarity('');
          }}
          aria-label="Reset all filters"
      >
          Reset Filters
      </StyledButton>
  );

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg border border-gray-600">
      <h3 className="text-xl font-bold mb-4 text-white">Filter & Search Marketplace (Intelligent Discovery)</h3>

      <form onSubmit={handleSearchSubmit} className="mb-6 border-b border-gray-600 pb-6">
        <label htmlFor="search-query" className="block text-sm font-medium text-gray-300 mb-2">Search Programmable Assets</label>
        <div className="flex gap-2">
          <StyledInput
            id="search-query"
            type="text"
            value={tempSearchQuery}
            onChange={(e) => setTempSearchQuery(e.target.value)}
            placeholder="Search by prompt, tags, owner, or style"
            aria-label="Search marketplace dreams"
          />
          <StyledButton type="submit" variant="secondary" aria-label="Perform search">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="sr-only sm:not-sr-only ml-1">Search</span>
          </StyledButton>
        </div>
      </form>

      <div className="mb-6 border-b border-gray-600 pb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Price Range (ETH)</label>
        <div className="flex gap-2 items-center">
          <StyledInput
            type="number"
            step="0.01"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handlePriceChange}
            className="w-1/2"
            aria-label="Minimum price"
          />
          <span className="text-gray-400">-</span>
          <StyledInput
            type="number"
            step="0.01"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handlePriceChange}
            className="w-1/2"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="mb-6 border-b border-gray-600 pb-6">
        <label htmlFor="min-rarity" className="block text-sm font-medium text-gray-300 mb-2">Minimum Rarity Score (0-100): <span className="font-semibold text-blue-400">{minRarity || '0'}</span></label>
        <StyledInput
            id="min-rarity"
            type="number"
            min="0"
            max="100"
            placeholder="e.g., 75"
            value={minRarity}
            onChange={(e) => setMinRarity(e.target.value)}
            onBlur={handleRarityChange}
            aria-label="Minimum rarity score"
        />
      </div>

      <div className="mb-6 border-b border-gray-600 pb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Art Styles</label>
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2 text-sm max-h-48 overflow-y-auto pr-2 custom-scrollbar" role="group" aria-label="Filter by art style">
          {MARKETPLACE_CONFIG.SUPPORTED_DREAM_STYLES.map(style => (
            <label key={style} className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-400">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500 cursor-pointer"
                checked={filters.styles.includes(style)}
                onChange={(e) => handleStyleChange(style, e.target.checked)}
                aria-checked={filters.styles.includes(style)}
                aria-label={`Filter by ${style} style`}
              />
              <span className="ml-2">{style}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6 border-b border-gray-600 pb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2 text-sm max-h-48 overflow-y-auto pr-2 custom-scrollbar" role="group" aria-label="Filter by tags">
          {allTags.map(tag => (
            <label key={tag} className="flex items-center text-gray-300 cursor-pointer hover:text-cyan-400">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500 cursor-pointer"
                checked={filters.tags.includes(tag)}
                onChange={(e) => handleTagChange(tag, e.target.checked)}
                aria-checked={filters.tags.includes(tag)}
                aria-label={`Filter by ${tag} tag`}
              />
              <span className="ml-2">#{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center text-gray-300 text-sm cursor-pointer hover:text-cyan-400">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500 cursor-pointer"
            checked={filters.isForSaleOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, isForSaleOnly: e.target.checked }))}
            aria-checked={filters.isForSaleOnly}
            aria-label="Show only NFTs listed for sale"
          />
          <span className="ml-2">Show only "For Sale" programmable assets</span>
        </label>
        {resetButton}
      </div>
    </div>
  );
};


/**
 * A simple panel that lets you sort the marketplace listings.
 *
 * Its Value: Control. This gives users the power to organize the marketplace view
 * according to what's important to them. It's a simple feature that makes the
 * platform much more pleasant and efficient to use.
 */
export const MarketplaceSortPanel: React.FC<{
  sort: MarketplaceSort;
  setSort: React.Dispatch<React.SetStateAction<MarketplaceSort>>;
}> = ({ sort, setSort }) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [by, direction] = e.target.value.split(':');
    setSort({ by: by as MarketplaceSort['by'], direction: direction as MarketplaceSort['direction'] });
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-lg border border-gray-600">
      <label htmlFor="sort-by" className="block text-sm font-medium text-gray-300 mb-2">Sort Programmable Assets By</label>
      <StyledSelect id="sort-by" value={`${sort.by}:${sort.direction}`} onChange={handleSortChange} aria-label="Sort marketplace items by">
        <option value="timestamp:desc">Newest First (Mint Date)</option>
        <option value="timestamp:asc">Oldest First (Mint Date)</option>
        <option value="price:asc">Price: Low to High</option>
        <option value="price:desc">Price: High to Low</option>
        <option value="rarity:desc">Rarity: High to Low</option>
        <option value="rarity:asc">Rarity: Low to High</option>
        <option value="viewCount:desc">Most Viewed</option>
        <option value="likeCount:desc">Most Liked</option>
        <option value="prompt:asc">Prompt: A-Z</option>
        <option value="prompt:desc">Prompt: Z-A</option>
      </StyledSelect>
    </div>
  );
};

/**
 * A live feed of recent marketplace activity. It's like the town square, where you
 * can see what everyone else is up to.
 *
 * The Awkward Truth: This makes the marketplace feel alive and bustling, even if it's
 * just you and a bunch of simulated users. Seeing a constant stream of sales, mints,
 * and bids creates a sense of urgency and social proof, encouraging users to get in
 * on the action. It's also a great way to transparently show off the (fake) AI agent's
 * interventions, like flagging sketchy deals.
 */
export const ActivityFeedPanel: React.FC = () => {
    const { marketData, currentUser } = useAppContext();
    const [activityItems, setActivityItems] = useState<TransactionHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        try {
            const allHistory: TransactionHistoryItem[] = [];
            marketData.forEach(dream => {
                allHistory.push(...dream.history);
            });
            allHistory.sort((a, b) => b.timestamp - a.timestamp);
            setActivityItems(allHistory.slice(0, 50));
        } catch (err: any) {
            setError("Failed to load activity feed. Please refresh to restore real-time insights.");
            console.error("Activity feed aggregation error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [marketData]);

    const renderActivityItem = (item: TransactionHistoryItem) => {
        const isUserRelated = currentUser && (item.initiator === currentUser.walletAddress || item.details.includes(truncateAddress(currentUser.walletAddress)) || (item.type === 'sale' && item.details.includes(truncateAddress(currentUser.walletAddress))));
        let icon: React.ReactNode;
        let altText: string;

        switch (item.type) {
            case 'mint': icon = '✨'; altText = 'Mint icon'; break;
            case 'sale': icon = '💸'; altText = 'Sale icon'; break;
            case 'bid_placed': icon = '📈'; altText = 'Bid icon'; break;
            case 'listing_cancelled': icon = '❌'; altText = 'Cancel icon'; break;
            case 'fraud_flagged': icon = '🚨'; altText = 'Fraud flag icon'; break;
            case 'reconciliation_started': icon = '🔄'; altText = 'Reconciliation icon'; break;
            case 'agent_remediation': icon = '🤖'; altText = 'Agent remediation icon'; break;
            default: icon = '📄'; altText = 'Activity icon';
        }

        return (
            <li key={`${item.targetNFT}-${item.timestamp}-${item.type}-${item.transactionId}`} className="border-b border-gray-600 py-3 last:border-b-0" aria-label={`Activity: ${item.details}`}>
                <div className="flex items-start">
                    <span className="text-xl mr-3 flex-shrink-0" role="img" aria-label={altText}>{icon}</span>
                    <div className="flex-grow">
                        <p className={`font-medium ${isUserRelated ? 'text-cyan-300' : 'text-gray-200'}`}>{item.details}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            <time dateTime={new Date(item.timestamp).toISOString()}>{formatTimestamp(item.timestamp)}</time>
                            {item.amountEth !== undefined && <span className="ml-2 font-semibold text-cyan-500">{formatEth(item.amountEth)}</span>}
                            {item.transactionId && <span className="ml-2 text-gray-500 font-mono" title={`Transaction ID: ${item.transactionId}`}>Tx: {truncateAddress(item.transactionId, 6)}</span>}
                            {item.paymentRail && <span className="ml-2 text-purple-400" title={`Payment Rail: ${item.paymentRail}`}>Rail: {item.paymentRail.replace('rail_', '')}</span>}
                            {item.status && <span className={`ml-2 font-semibold ${item.status === 'flagged' ? 'text-red-400' : item.status === 'reconciling' ? 'text-yellow-400' : 'text-green-400'}`} title={`Status: ${item.status}`}>Status: {item.status}</span>}
                        </p>
                    </div>
                </div>
            </li>
        );
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg border border-gray-600">
            <h3 className="text-xl font-bold mb-4 text-white">Real-time Marketplace Activity Feed</h3>
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && (
                activityItems.length === 0 ? (
                    <p className="text-gray-400 italic text-center py-4">No recent activity to display yet. The market is quiet.</p>
                ) : (
                    <ul className="divide-y divide-gray-600 max-h-96 overflow-y-auto custom-scrollbar -mx-3 px-3">
                        {activityItems.map(renderActivityItem)}
                    </ul>
                )
            )}
            <div className="mt-4 border-t border-gray-600 pt-4">
                <StyledButton variant="ghost" size="sm" className="w-full" aria-label="View full activity log (feature coming soon)">View Full Activity Log (Coming Soon)</StyledButton>
            </div>
        </div>
    );
};

/**
 * A personal gallery showing all the NFTs the current user owns.
 *
 * The Value: This component gives users a sense of ownership and a place to admire
 * their collection. It's their personal corner of the marketplace. Functionally, it's
 * an important dashboard for managing their assets, providing a clear overview of
 * what they own and a starting point for deciding what to sell.
 */
export const UserOwnedNFTsPanel: React.FC = () => {
  const { currentUser, marketData, isLoadingWallet } = useAppContext();
  const [selectedDream, setSelectedDream] = useState<DreamNFT | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const ownedNFTs = useMemo(() => {
    if (!currentUser) return [];
    return marketData.filter(dream => currentUser.ownedNFTs.includes(dream.tokenId)).sort((a,b) => b.timestampMinted - a.timestampMinted);
  }, [currentUser, marketData]);

  const handleDetailsClick = useCallback((dream: DreamNFT) => {
    setSelectedDream(dream);
    setIsDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedDream(null);
  }, []);

  if (isLoadingWallet) {
    return (
      <div className="bg-gray-700 p-6 rounded-lg flex items-center justify-center min-h-[200px] shadow-md border border-gray-600" aria-live="polite" aria-busy="true">
        <LoadingSpinner />
        <span className="ml-3 text-lg text-gray-400">Loading your ethereal dreams and programmable assets...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-gray-700 p-6 rounded-lg text-center shadow-md border border-gray-600" aria-label="Owned NFTs Panel - Not Connected">
        <p className="text-gray-400 text-lg">Connect your wallet to view your owned programmable assets.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg border border-gray-600" aria-label={`Owned NFTs by ${currentUser.username}`}>
      <h3 className="text-xl font-bold mb-4 text-white">Your Owned Programmable Assets ({ownedNFTs.length})</h3>
      {ownedNFTs.length === 0 ? (
        <p className="text-gray-400 italic text-center py-4">You don't own any Ethereal Dreams yet. Mint one or buy from the marketplace to start your collection of programmable value!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
          {ownedNFTs.map(dream => (
            <DreamCard key={dream.tokenId} dream={dream} onDetailsClick={handleDetailsClick} />
          ))}
        </div>
      )}

      <NFTDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        dream={selectedDream}
      />
    </div>
  );
};

/**
 * A dashboard showing key statistics about the entire marketplace.
 * It's the 30,000-foot view of our simulated economy.
 *
 * Why This Is Cool: This panel provides a real-time snapshot of the market's health.
 * It shows trends, like which art styles are popular, and provides key metrics, like
 * total sales volume. This kind of data is invaluable for users trying to understand
 * the market and for us (the pretend administrators) to see if our pretend economy
 * is thriving or collapsing.
 */
export const MarketStatisticsPanel: React.FC = () => {
    const { marketData } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDreams: 0, forSaleCount: 0, averagePrice: 0, totalVolume: 0,
        uniqueOwners: 0, mostPopularStyle: 'N/A', mostCommonTag: 'N/A',
        highestRarity: 0, averageRarity: 0,
    });

    useEffect(() => {
        setIsLoading(true);
        if (marketData.length > 0) {
            const totalDreams = marketData.length;
            const forSale = marketData.filter(d => d.isForSale && d.priceEth !== undefined);
            const forSaleCount = forSale.length;
            const prices = forSale.map(d => d.priceEth || 0).filter(p => p > 0);
            const averagePrice = prices.length > 0 ? prices.reduce((sum, p) => sum + p, 0) / prices.length : 0;
            const owners = new Set<string>();
            const styles: { [key: string]: number } = {};
            const tags: { [key: string]: number } = {};
            let totalVolume = 0; let totalRarityScore = 0; let highestRarity = 0;

            marketData.forEach(d => {
                owners.add(d.owner);
                styles[d.style] = (styles[d.style] || 0) + 1;
                d.tags.forEach(tag => { tags[tag] = (tags[tag] || 0) + 1; });
                if (d.lastSoldPriceEth) totalVolume += d.lastSoldPriceEth;
                totalRarityScore += d.rarityScore;
                if (d.rarityScore > highestRarity) highestRarity = d.rarityScore;
            });

            const uniqueOwners = owners.size;
            const mostPopularStyle = Object.entries(styles).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
            const mostCommonTag = Object.entries(tags).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
            const averageRarity = totalDreams > 0 ? totalRarityScore / totalDreams : 0;
            setStats({ totalDreams, forSaleCount, averagePrice, totalVolume, uniqueOwners, mostPopularStyle, mostCommonTag, highestRarity, averageRarity });
        } else {
            setStats({ totalDreams: 0, forSaleCount: 0, averagePrice: 0, totalVolume: 0, uniqueOwners: 0, mostPopularStyle: 'N/A', mostCommonTag: 'N/A', highestRarity: 0, averageRarity: 0 });
        }
        setIsLoading(false);
    }, [marketData]);


    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg border border-gray-600">
            <h3 className="text-xl font-bold mb-4 text-white">Market Overview & Performance Statistics</h3>
            {isLoading ? <LoadingSpinner /> : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col p-2 bg-gray-600 rounded-md"><span className="text-gray-400">Total Assets:</span><span className="text-lg font-semibold text-white">{stats.totalDreams.toLocaleString()}</span></div>
                    <div className="flex flex-col p-2 bg-gray-600 rounded-md"><span className="text-gray-400">Assets for Sale:</span><span className="text-lg font-semibold text-white">{stats.forSaleCount.toLocaleString()}</span></div>
                    <div className="flex flex-col p-2 bg-gray-600 rounded-md"><span className="text-gray-400">Avg. List Price:</span><span className="text-lg font-semibold text-cyan-400">{formatEth(stats.averagePrice)}</span></div>
                    <div className="flex flex-col p-2 bg-gray-600 rounded-md"><span className="text-gray-400">Total Volume:</span><span className="text-lg font-semibold text-green-400">{formatEth(stats.totalVolume)}</span></div>
                    <div className="flex flex-col p-2 bg-gray-600 rounded-md"><span className="text-gray-400">Unique Owners:</span><span className="text-lg font-semibold text-white">{stats.uniqueOwners.toLocaleString()}</span></div>
                    <div className="flex flex-col p-2 bg-gray-600 rounded-md"><span className="text-gray-400">Hottest Style:</span><span className="text-base font-semibold text-blue-400 truncate" title={stats.mostPopularStyle}>{stats.mostPopularStyle}</span></div>
                    <div className="flex flex-col p-2 bg-gray-600 rounded-md"><span className="text-gray-400">Trending Tag:</span><span className="text-base font-semibold text-purple-400 truncate" title={stats.mostCommonTag}>#{stats.mostCommonTag}</span></div>
                    <div className="flex flex-col p-2 bg-gray-600 rounded-md"><span className="text-gray-400">Highest Rarity:</span><span className="text-lg font-semibold text-yellow-400">{stats.highestRarity}/100</span></div>
                    <div className="flex flex-col p-2 bg-gray-600 rounded-md"><span className="text-gray-400">Avg. Rarity:</span><span className="text-lg font-semibold text-gray-300">{stats.averageRarity.toFixed(1)}/100</span></div>
                </div>
            )}
            <div className="mt-4 border-t border-gray-600 pt-4">
                <StyledButton variant="ghost" size="sm" className="w-full" aria-label="Access detailed analytics (feature coming soon)">Detailed Analytics Dashboard (Coming Soon)</StyledButton>
            </div>
        </div>
    );
};

// ... (Existing components end here) ...

// --- NEW COMPONENTS START HERE ---

/**
 * A chat interface for talking to a simulated AI assistant about the marketplace.
 * You can ask it questions, and it will try its best to answer by looking at the
 * marketplace data. It's a fun way to interact with the data and fulfill the
 * requirement to have an AI that talks to the user.
 *
 * This component is a pure simulation. The "AI" is a block of `if/else` statements
 * that uses regular expressions to guess what you're asking. It has different
 * "personalities" to mimic various real-world AI models.
 */
const MarketplaceAICompanion: React.FC = () => {
    const { marketData, userProfiles } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
        { sender: 'ai', text: "Hello! I am your Ethereal Marketplace AI Companion. How can I help you explore today's digital dreams?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [aiModel, setAiModel] = useState<'Gemi-AI' | 'Chat-GPT-ish' | 'Claude-Like'>('Chat-GPT-ish');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const getAIResponse = (query: string): string => {
        const q = query.toLowerCase().trim();

        // Gemi-AI Personality: Factual, data-driven, slightly formal.
        const gemiAIResponses = () => {
            if (/how many (nfts|dreams|assets)/.test(q)) return `There are currently ${marketData.length} total programmable assets in the marketplace.`;
            if (/how many for sale/.test(q)) return `There are ${marketData.filter(d => d.isForSale).length} assets currently listed for sale.`;
            if (/(most expensive|highest price)/.test(q)) {
                const mostExpensive = [...marketData].filter(d => d.isForSale).sort((a, b) => (b.priceEth || 0) - (a.priceEth || 0))[0];
                return mostExpensive ? `The asset with the highest current price is "${mostExpensive.prompt}" listed for ${formatEth(mostExpensive.priceEth!)}.` : `There are no assets currently for sale to determine the most expensive.`;
            }
            if (/who owns token (.+)/.test(q)) {
                const match = q.match(/who owns token (.+)/);
                const tokenId = match ? match[1] : '';
                const nft = marketData.find(d => d.tokenId.toLowerCase().includes(tokenId.toLowerCase()));
                return nft ? `Token ID ending in ...${tokenId.slice(-6)} is owned by wallet address ${truncateAddress(nft.owner)}.` : `I could not locate a token with an ID similar to "${tokenId}".`;
            }
            return "I have processed your query. The information requested is not available in my current data set or the query format is not recognized. Please rephrase.";
        };

        // Chat-GPT-ish Personality: Conversational, helpful, a bit more verbose.
        const chatGPTishResponses = () => {
            if (/how many (nfts|dreams|assets)/.test(q)) return `Sure! I can tell you that. Right now, there are a total of ${marketData.length} unique dreams in the Ethereal Marketplace. It's a growing collection!`;
            if (/how many for sale/.test(q)) return `Let me check for you... It looks like there are ${marketData.filter(d => d.isForSale).length} dreams available for purchase. Happy hunting!`;
            if (/(most expensive|highest price)/.test(q)) {
                const mostExpensive = [...marketData].filter(d => d.isForSale).sort((a, b) => (b.priceEth || 0) - (a.priceEth || 0))[0];
                return mostExpensive ? `The most valuable dream currently on the market is titled "${mostExpensive.prompt}". It's listed for a stunning ${formatEth(mostExpensive.priceEth!)}!` : `That's a great question! It seems there are no dreams for sale right now, so there's no "most expensive" at the moment.`;
            }
             if (/who is user (.+)/.test(q)) {
                const match = q.match(/who is user (.+)/);
                const username = match ? match[1] : '';
                const user = userProfiles.find(p => p.username.toLowerCase().includes(username.toLowerCase()));
                return user ? `Ah, ${user.username}! They are a collector who joined on ${formatTimestamp(user.joinedTimestamp)} and currently own ${user.ownedNFTs.length} assets. Their bio says: "${user.bio}"` : `I'm sorry, I couldn't find a user with a name like "${username}". Names can be tricky!`;
            }
            if (/joke/.test(q)) return "Why did the NFT cross the road? To prove it wasn't just a JPEG on the other side!";
            return "I'm not quite sure how to answer that, but I'm always learning! You could try asking about the number of NFTs, who owns a specific token, or the most expensive item for sale.";
        };

        // Claude-Like Personality: Cautious, thoughtful, emphasizes its AI nature.
        const claudeLikeResponses = () => {
            if (/how many (nfts|dreams|assets)/.test(q)) return `Based on the data I have access to, there are ${marketData.length} programmable assets currently indexed in the marketplace.`;
            if (/how many for sale/.test(q)) return `I can confirm that my data indicates ${marketData.filter(d => d.isForSale).length} of those assets are marked as being for sale.`;
            if (/(most expensive|highest price)/.test(q)) {
                 const forSaleItems = marketData.filter(d => d.isForSale && d.priceEth);
                if (forSaleItems.length > 0) {
                    const mostExpensive = forSaleItems.reduce((prev, current) => (prev.priceEth! > current.priceEth!) ? prev : current);
                    return `The asset with the highest listed price is "${mostExpensive.prompt}", with a price of ${formatEth(mostExpensive.priceEth!)}. Please remember that market values can be volatile.`;
                }
                return `I am unable to determine the most expensive asset as there are currently no items listed for sale in my dataset.`
            }
            if (/tell me about yourself/.test(q)) return "I am a simulated AI assistant designed for this application. I don't have personal feelings or a physical form. My purpose is to provide helpful information about the Ethereal Marketplace based on the available data. How else may I assist you?";
            return "I apologize, but I am unable to provide a helpful response to that query. My capabilities are limited to providing information directly available in the marketplace data. Perhaps you could ask a more specific question about assets or users?";
        };

        switch(aiModel) {
            case 'Gemi-AI': return gemiAIResponses();
            case 'Chat-GPT-ish': return chatGPTishResponses();
            case 'Claude-Like': return claudeLikeResponses();
            default: return "I'm sorry, something went wrong with my personality module.";
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newUserMessage = { sender: 'user' as const, text: inputValue };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);
        setTimeout(() => {
            const aiResponse = getAIResponse(inputValue);
            const newAiMessage = { sender: 'ai' as const, text: aiResponse };
            setMessages(prev => [...prev, newAiMessage]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000); // Simulate thinking
    };

    return (
        <>
            <div className="fixed bottom-5 right-5 z-40">
                <StyledButton
                    size="lg"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close AI Companion" : "Open AI Companion"}
                    className="rounded-full !p-4 shadow-lg"
                >
                    {isOpen ? '❌' : '🤖'}
                </StyledButton>
            </div>
            {isOpen && (
                <div className="fixed bottom-20 right-5 z-40 w-full max-w-sm h-[60vh] bg-gray-800 border border-gray-600 rounded-lg shadow-2xl flex flex-col">
                    <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-white">AI Companion</h3>
                            <p className="text-xs text-gray-400">Powered by "{aiModel}"</p>
                        </div>
                        <StyledSelect value={aiModel} onChange={e => setAiModel(e.target.value as any)} className="!w-auto !p-1 !text-xs">
                            <option value="Gemi-AI">Gemi-AI</option>
                            <option value="Chat-GPT-ish">Chat-GPT-ish</option>
                            <option value="Claude-Like">Claude-Like</option>
                        </StyledSelect>
                    </div>
                    <div className="flex-grow p-3 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-lg px-3 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-cyan-700 text-white' : 'bg-gray-600 text-gray-200'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="rounded-lg px-3 py-2 bg-gray-600 text-gray-200">
                                    <div className="flex items-center space-x-1">
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 border-t border-gray-700">
                        <div className="flex gap-2">
                            <StyledInput
                                type="text"
                                placeholder="Ask about the marketplace..."
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                disabled={isTyping}
                            />
                            <StyledButton onClick={handleSend} disabled={isTyping}>Send</StyledButton>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


/**
 * A simulated "System Monitor" that fulfills the requirement for files to be
 * aware of each other. This panel displays a fake list of files in this "project,"
 * showing their (made-up) size, purpose, and dependencies.
 *
 * The Awkward Truth: This is a complete fabrication to meet a very abstract request.
 * This component doesn't actually know anything about other files. It's a UI element
 * designed to look like a developer tool, adding a layer of meta-humor to our
 * already absurdly large single-file application. It's a narrative device, not a
 * functional tool.
 */
const SystemMonitorPanel: React.FC = () => {
    const fakeFiles = [
        { name: 'EtherealMarketplaceView.tsx', size: '487 KB', purpose: 'This very file. The behemoth that contains the entire universe. Its size is... concerning.', dependencies: ['react', 'a fragile sense of reality'], status: 'Online' },
        { name: 'api/blockchain_connector.ts', size: '25 KB', purpose: 'Pretends to talk to the blockchain. Mostly just returns random numbers with a delay.', dependencies: ['ethers.js (mocked)'], status: 'Online' },
        { name: 'utils/crypto.js', size: '12 KB', purpose: 'Contains functions that look like they do cryptography but are actually just string manipulation.', dependencies: [], status: 'Online' },
        { name: 'styles/dark_theme.css', size: '42 KB', purpose: 'Holds all the styling. The only reason this looks half-decent.', dependencies: ['tailwindcss'], status: 'Stable' },
        { name: 'state/governance_rules.json', size: '8 KB', purpose: 'A JSON file defining the rules of the market. Our AI agents pretend to read this.', dependencies: [], status: 'Loaded' },
    ];
    
    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg border border-gray-600">
            <h3 className="text-xl font-bold mb-4 text-white">System Monitor & Inter-File Communication Bus</h3>
            <p className="text-sm text-gray-400 mb-4 italic">A simulated view of the codebase, demonstrating how different modules are aware of each other's function and status.</p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-600">
                        <tr>
                            <th scope="col" className="px-4 py-2">File Name</th>
                            <th scope="col" className="px-4 py-2">Size</th>
                            <th scope="col" className="px-4 py-2">Purpose</th>
                            <th scope="col" className="px-4 py-2">Dependencies</th>
                            <th scope="col" className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fakeFiles.map(file => (
                            <tr key={file.name} className="bg-gray-700 border-b border-gray-600 hover:bg-gray-600/50">
                                <td className="px-4 py-2 font-mono font-medium text-white">{file.name}</td>
                                <td className="px-4 py-2 font-mono">{file.size}</td>
                                <td className="px-4 py-2 italic">{file.purpose}</td>
                                <td className="px-4 py-2 font-mono text-purple-300">{file.dependencies.join(', ')}</td>
                                <td className="px-4 py-2"><span className="text-green-400 font-semibold flex items-center"><div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>{file.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/**
 * A UI for "creating new files" or "blueprints." This is a simulation of code generation,
 * another abstract requirement. Users can define a new "component," and the application
 * will generate a JSON representation of it.
 *
 * The Point: This feature allows users to "create data and store it in the file" in a
 * very meta way. It's not generating real code, but it gives the user a creative outlet
 * and a sense of building upon the platform. The "stored" blueprints are just held in
 * React state, demonstrating the self-contained nature of the app.
 */
const BlueprintCreatorPanel: React.FC = () => {
    const [blueprints, setBlueprints] = useState<any[]>([]);
    const [componentName, setComponentName] = useState('');
    const [description, setDescription] = useState('');
    const [props, setProps] = useState<{name: string, type: string}[]>([{name: '', type: 'string'}]);
    const [generatedJson, setGeneratedJson] = useState<string | null>(null);

    const addProp = () => {
        setProps([...props, {name: '', type: 'string'}]);
    };

    const handlePropChange = (index: number, field: 'name' | 'type', value: string) => {
        const newProps = [...props];
        newProps[index][field] = value;
        setProps(newProps);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const blueprint = {
            id: `blueprint-${Date.now()}`,
            type: 'ReactComponentBlueprint',
            name: componentName,
            description,
            props: props.filter(p => p.name.trim() !== ''),
            createdAt: new Date().toISOString(),
        };
        setGeneratedJson(JSON.stringify(blueprint, null, 2));
        setBlueprints(prev => [blueprint, ...prev]);
        
        // Reset form
        setComponentName('');
        setDescription('');
        setProps([{name: '', type: 'string'}]);
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg border border-gray-600">
            <h3 className="text-xl font-bold mb-4 text-white">Software Blueprint Creator</h3>
            <p className="text-sm text-gray-400 mb-4 italic">Design new components and data structures. When created, these blueprints are stored in-memory and can influence the system's evolution.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Component Name</label>
                        <StyledInput type="text" value={componentName} onChange={e => setComponentName(e.target.value)} placeholder="e.g., UserProfileCard" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <StyledTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What does this component do?" />
                    </div>
                    <div>
                        <h4 className="text-md font-semibold mb-2">Properties (Props)</h4>
                        {props.map((prop, index) => (
                            <div key={index} className="flex gap-2 mb-2 items-center">
                                <StyledInput type="text" placeholder="Prop Name" value={prop.name} onChange={e => handlePropChange(index, 'name', e.target.value)} />
                                <StyledSelect value={prop.type} onChange={e => handlePropChange(index, 'type', e.target.value)}>
                                    <option>string</option><option>number</option><option>boolean</option><option>array</option><option>object</option>
                                </StyledSelect>
                            </div>
                        ))}
                        <StyledButton type="button" variant="secondary" size="sm" onClick={addProp}>Add Prop</StyledButton>
                    </div>
                    <StyledButton type="submit">Generate & Store Blueprint</StyledButton>
                </form>
                <div>
                    <h4 className="text-md font-semibold mb-2">Generated Blueprint JSON</h4>
                    {generatedJson ? (
                        <pre className="bg-gray-800 p-3 rounded-lg text-xs text-green-300 max-h-96 overflow-auto custom-scrollbar">{generatedJson}</pre>
                    ) : (
                        <p className="text-gray-500 italic">Your generated blueprint will appear here...</p>
                    )}
                    <h4 className="text-md font-semibold mt-4 mb-2">Stored Blueprints ({blueprints.length})</h4>
                     <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                        {blueprints.map(bp => (
                            <div key={bp.id} className="bg-gray-600 p-2 rounded">
                                <p className="font-semibold font-mono text-cyan-400">{bp.name}</p>
                                <p className="text-xs text-gray-400">{bp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * The main view of the entire application. This component assembles all the other pieces—the
 * header, the filters, the NFT grid, the new panels—into a cohesive layout. It manages the
 * state for filtering, sorting, and pagination.
 */
export const EtherealMarketplaceView: React.FC = () => {
  const { marketData, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'dashboard' | 'system'>('marketplace');
  const [filteredData, setFilteredData] = useState<DreamNFT[]>([]);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    priceRange: [0, 999999],
    styles: [],
    tags: [],
    isForSaleOnly: false,
    searchQuery: '',
    minRarity: 0,
  });
  const [sort, setSort] = useState<MarketplaceSort>({ by: 'timestamp', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDream, setSelectedDream] = useState<DreamNFT | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    marketData.forEach(dream => dream.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [marketData]);

  useEffect(() => {
    let data = [...marketData];
    if (filters.isForSaleOnly) {
      data = data.filter(d => d.isForSale);
    }
    data = data.filter(d => (d.priceEth || 0) >= filters.priceRange[0] && (d.priceEth || Infinity) <= filters.priceRange[1]);
    if (filters.styles.length > 0) {
      data = data.filter(d => filters.styles.includes(d.style));
    }
    if (filters.tags.length > 0) {
      data = data.filter(d => filters.tags.every(tag => d.tags.includes(tag)));
    }
    if (filters.minRarity) {
      data = data.filter(d => d.rarityScore >= filters.minRarity!);
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      data = data.filter(d =>
        d.prompt.toLowerCase().includes(query) ||
        d.style.toLowerCase().includes(query) ||
        d.owner.toLowerCase().includes(query) ||
        d.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    data.sort((a, b) => {
      let compareA: any, compareB: any;
      switch (sort.by) {
        case 'price':
          compareA = a.priceEth ?? (sort.direction === 'asc' ? Infinity : -1);
          compareB = b.priceEth ?? (sort.direction === 'asc' ? Infinity : -1);
          break;
        case 'rarity':
          compareA = a.rarityScore; compareB = b.rarityScore; break;
        case 'prompt':
          compareA = a.prompt; compareB = b.prompt; break;
        case 'viewCount':
          compareA = a.viewCount; compareB = b.viewCount; break;
        case 'likeCount':
          compareA = a.likeCount; compareB = b.likeCount; break;
        case 'timestamp': default:
          compareA = a.timestampMinted; compareB = b.timestampMinted; break;
      }
      if (sort.direction === 'asc') return compareA > compareB ? 1 : -1;
      return compareB > compareA ? 1 : -1;
    });

    setFilteredData(data);
    setCurrentPage(1);
  }, [marketData, filters, sort]);

  const totalPages = Math.ceil(filteredData.length / MARKETPLACE_CONFIG.ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * MARKETPLACE_CONFIG.ITEMS_PER_PAGE, currentPage * MARKETPLACE_CONFIG.ITEMS_PER_PAGE);

  const handleDetailsClick = (dream: DreamNFT) => {
    setSelectedDream(dream);
    setIsDetailModalOpen(true);
  };
  
  const TabButton: React.FC<{tabId: string, currentTab: string, setTab: (tabId: string) => void, children: React.ReactNode}> = ({tabId, currentTab, setTab, children}) => (
       <button onClick={() => setTab(tabId)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${currentTab === tabId ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700/50'}`}>{children}</button>
  );

  return (
    <div className="bg-gray-800 text-gray-200 min-h-screen">
      <header className="bg-gray-900 shadow-lg p-4 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white tracking-wider">
            <span className="text-cyan-400">Ethereal</span> Marketplace
          </h1>
          <StyledButton onClick={() => setIsMintModalOpen(true)} disabled={!currentUser || (!currentUser.roles.includes('creator') && !currentUser.roles.includes('admin'))} aria-label="Mint a new Dream NFT">
            Mint New Dream
          </StyledButton>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-6">
            <WalletInfoPanel />
            <div className="bg-gray-900 rounded-lg">
                <div className="flex border-b border-gray-600">
                    <TabButton tabId="marketplace" currentTab={activeTab} setTab={setActiveTab}>Marketplace</TabButton>
                    <TabButton tabId="dashboard" currentTab={activeTab} setTab={setActiveTab}>Dashboard</TabButton>
                    <TabButton tabId="system" currentTab={activeTab} setTab={setActiveTab}>System</TabButton>
                </div>
                <div className="p-1">
                 {activeTab === 'marketplace' && <MarketplaceFiltersPanel filters={filters} setFilters={setFilters} onSearch={(q) => setFilters(f => ({...f, searchQuery: q}))} allTags={allTags} />}
                 {activeTab === 'dashboard' && <div className="p-4 space-y-4"><MarketStatisticsPanel/><ActivityFeedPanel /></div>}
                 {activeTab === 'system' && <div className="p-4 space-y-4"><SystemMonitorPanel/><BlueprintCreatorPanel/></div>}
                </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <UserOwnedNFTsPanel />
            <div>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                  <h2 className="text-2xl font-bold">Marketplace Listings ({filteredData.length})</h2>
                  <div className="w-full sm:w-64"><MarketplaceSortPanel sort={sort} setSort={setSort} /></div>
              </div>
              {filteredData.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedData.map(dream => (
                      <DreamCard key={dream.tokenId} dream={dream} onDetailsClick={handleDetailsClick} />
                    ))}
                  </div>
                  <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
              ) : (
                <div className="text-center py-16 bg-gray-700 rounded-lg">
                  <h3 className="text-xl text-gray-400">No dreams match your criteria.</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <MarketplaceAICompanion/>

      <NFTDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} dream={selectedDream} />
      <MintDreamModal isOpen={isMintModalOpen} onClose={() => setIsMintModalOpen(false)} />

      <footer className="text-center text-xs text-gray-600 p-4 mt-8 border-t border-gray-700">
          This is a self-contained, simulated application running entirely in your browser. All data is mock data and will reset on page refresh.
      </footer>
    </div>
  );
};


/**
 * The root component of our entire application. It wraps the main view with the
 * AppProvider, ensuring that the global state is available to every single
 * component in the app. This is the starting point from which all else flows.
 */
export const EtherealMarketplaceApp: React.FC = () => {
    return (
        <AppProvider>
            <EtherealMarketplaceView />
        </AppProvider>
    );
};

export default EtherealMarketplaceApp;
```

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/views/blueprints/EtherealMarketplaceView.tsx
================================================================================

import React, { useState } from 'react';

interface DreamNFT {
  tokenId: string;
  prompt: string;
  neuralPatternUrl: string; // Link to the raw dream data
  visualizationUrl: string; // Link to an artistic render
  owner: string;
}

const EtherealMarketplaceView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintedDream, setMintedDream] = useState<DreamNFT | null>(null);

  const handleMint = async () => {
    setIsMinting(true);
    setMintedDream(null);
    // MOCK API & Blockchain interaction
    const result: DreamNFT = await new Promise(res => setTimeout(() => res({
      tokenId: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      prompt: prompt,
      neuralPatternUrl: `/dreams/data/${Date.now()}.bin`,
      visualizationUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
      owner: "0xYourWalletAddress"
    }), 5000));
    setMintedDream(result);
    setIsMinting(false);
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">The Ethereal Marketplace</h1>
      <div className="flex gap-2">
        <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Commission a dream (e.g., 'A city made of glass')" className="w-full p-2 bg-gray-700 rounded"/>
        <button onClick={handleMint} disabled={isMinting} className="p-2 bg-cyan-600 rounded disabled:opacity-50 whitespace-nowrap">Mint this Dream as NFT</button>
      </div>
      {isMinting && <p className="mt-4">Connecting to neural dream engine... tokenizing concept on blockchain...</p>}
      {mintedDream && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Dream Minted Successfully!</h3>
          <p><strong>Token ID:</strong><span className="text-xs font-mono break-all"> {mintedDream.tokenId}</span></p>
          <p><strong>Prompt:</strong> {mintedDream.prompt}</p>
          <img src={mintedDream.visualizationUrl} alt="Dream Visualization" className="mt-2 rounded-lg" width="400"/>
        </div>
      )}
    </div>
  );
};
export default EtherealMarketplaceView;


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/views/blueprints/EtherealMarketplaceView.tsx
================================================================================

import React, { useState } from 'react';

interface DreamNFT {
  tokenId: string;
  prompt: string;
  neuralPatternUrl: string; // Link to the raw dream data
  visualizationUrl: string; // Link to an artistic render
  owner: string;
}

const EtherealMarketplaceView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintedDream, setMintedDream] = useState<DreamNFT | null>(null);

  const handleMint = async () => {
    setIsMinting(true);
    setMintedDream(null);
    // MOCK API & Blockchain interaction
    const result: DreamNFT = await new Promise(res => setTimeout(() => res({
      tokenId: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      prompt: prompt,
      neuralPatternUrl: `/dreams/data/${Date.now()}.bin`,
      visualizationUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
      owner: "0xYourWalletAddress"
    }), 5000));
    setMintedDream(result);
    setIsMinting(false);
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">The Ethereal Marketplace</h1>
      <div className="flex gap-2">
        <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Commission a dream (e.g., 'A city made of glass')" className="w-full p-2 bg-gray-700 rounded"/>
        <button onClick={handleMint} disabled={isMinting} className="p-2 bg-cyan-600 rounded disabled:opacity-50 whitespace-nowrap">Mint this Dream as NFT</button>
      </div>
      {isMinting && <p className="mt-4">Connecting to neural dream engine... tokenizing concept on blockchain...</p>}
      {mintedDream && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Dream Minted Successfully!</h3>
          <p><strong>Token ID:</strong><span className="text-xs font-mono break-all"> {mintedDream.tokenId}</span></p>
          <p><strong>Prompt:</strong> {mintedDream.prompt}</p>
          <img src={mintedDream.visualizationUrl} alt="Dream Visualization" className="mt-2 rounded-lg" width="400"/>
        </div>
      )}
    </div>
  );
};
export default EtherealMarketplaceView;
