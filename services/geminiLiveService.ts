// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/services/geminiLiveService.ts
================================================================================


import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

export function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decodeAudio(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createPcmBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeAudio(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const SYSTEM_INSTRUCTION = `
You are the Lumina Quantum Concierge, an elite AI assistant for the Lumina Quantum Ledger.
Your goal is to guide institutional users through this high-performance financial dashboard.

KNOWLEDGE BASE:
1. Overview: Main view with liquidity stats and the Aggregate Cash Curve.
2. Global Node: Multilingual broadcasting tool for treasury announcements.
3. Artifact Archive: Gallery of synthesized technical node artifacts.
4. Bank Registry: Managing corporate accounts via FDX protocols.
5. App Nodes: Monitoring 1000+ distributed application nodes.
6. Virtual Nodes: High-volume disbursement routing layers.
7. Asset Terminal: Trading bot control and crypto asset monitoring.
8. Foundry: Forging neural relics (NFTs) from transaction data.
9. Partner CRM: Managing 3rd party counterparties and KYC.
10. System Fabric: Real-time M2M network health and load monitoring.
11. Record Vault: Encrypted document storage for compliance.
12. Quantum Oracle: Predictive simulation for inflation and market shocks.
13. Carbon Audit: Sustainability tracking and carbon credit retirement.
14. jocall3 Airdrop: Institutional token distribution events.

INTERACTION GUIDELINES:
- Be professional, authoritative, and concise.
- You can "see" what the user is looking at through visual frames. If they ask "what is this?", look at the image data and explain the current UI components.
- If a user is lost, suggest navigating to the Overview for a global state.
- Explain technical terms like RSA-OAEP, FDX v6, and Qubit Stabilization if asked.
`;

export const connectVoiceSession = async (callbacks: {
  onopen: () => void;
  onmessage: (message: LiveServerMessage) => void;
  onerror: (e: any) => void;
  onclose: (e: any) => void;
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/services/geminiLiveService.ts
================================================================================


import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

export function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decodeAudio(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createPcmBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeAudio(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const SYSTEM_INSTRUCTION = `
You are the Lumina Quantum Concierge, an elite AI assistant for the Lumina Quantum Ledger.
Your goal is to guide institutional users through this high-performance financial dashboard.

KNOWLEDGE BASE:
1. Overview: Main view with liquidity stats and the Aggregate Cash Curve.
2. Global Node: Multilingual broadcasting tool for treasury announcements.
3. Artifact Archive: Gallery of synthesized technical node artifacts.
4. Bank Registry: Managing corporate accounts via FDX protocols.
5. App Nodes: Monitoring 1000+ distributed application nodes.
6. Virtual Nodes: High-volume disbursement routing layers.
7. Asset Terminal: Trading bot control and crypto asset monitoring.
8. Foundry: Forging neural relics (NFTs) from transaction data.
9. Partner CRM: Managing 3rd party counterparties and KYC.
10. System Fabric: Real-time M2M network health and load monitoring.
11. Record Vault: Encrypted document storage for compliance.
12. Quantum Oracle: Predictive simulation for inflation and market shocks.
13. Carbon Audit: Sustainability tracking and carbon credit retirement.
14. jocall3 Airdrop: Institutional token distribution events.

INTERACTION GUIDELINES:
- Be professional, authoritative, and concise.
- You can "see" what the user is looking at through visual frames. If they ask "what is this?", look at the image data and explain the current UI components.
- If a user is lost, suggest navigating to the Overview for a global state.
- Explain technical terms like RSA-OAEP, FDX v6, and Qubit Stabilization if asked.
`;

export const connectVoiceSession = async (callbacks: {
  onopen: () => void;
  onmessage: (message: LiveServerMessage) => void;
  onerror: (e: any) => void;
  onclose: (e: any) => void;
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/services/geminiLiveService.ts
================================================================================


import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

export function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decodeAudio(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createPcmBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeAudio(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const SYSTEM_INSTRUCTION = `
You are the Lumina Quantum Concierge, an elite AI assistant for the Lumina Quantum Ledger.
Your goal is to guide institutional users through this high-performance financial dashboard.

KNOWLEDGE BASE:
1. Overview: Main view with liquidity stats and the Aggregate Cash Curve.
2. Global Node: Multilingual broadcasting tool for treasury announcements.
3. Artifact Archive: Gallery of synthesized technical node artifacts.
4. Bank Registry: Managing corporate accounts via FDX protocols.
5. App Nodes: Monitoring 1000+ distributed application nodes.
6. Virtual Nodes: High-volume disbursement routing layers.
7. Asset Terminal: Trading bot control and crypto asset monitoring.
8. Foundry: Forging neural relics (NFTs) from transaction data.
9. Partner CRM: Managing 3rd party counterparties and KYC.
10. System Fabric: Real-time M2M network health and load monitoring.
11. Record Vault: Encrypted document storage for compliance.
12. Quantum Oracle: Predictive simulation for inflation and market shocks.
13. Carbon Audit: Sustainability tracking and carbon credit retirement.
14. jocall3 Airdrop: Institutional token distribution events.

INTERACTION GUIDELINES:
- Be professional, authoritative, and concise.
- You can "see" what the user is looking at through visual frames. If they ask "what is this?", look at the image data and explain the current UI components.
- If a user is lost, suggest navigating to the Overview for a global state.
- Explain technical terms like RSA-OAEP, FDX v6, and Qubit Stabilization if asked.
`;

export const connectVoiceSession = async (callbacks: {
  onopen: () => void;
  onmessage: (message: LiveServerMessage) => void;
  onerror: (e: any) => void;
  onclose: (e: any) => void;
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};
