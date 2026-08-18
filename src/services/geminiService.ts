// REPOSITORY SOURCE: diplomat-bit/aibankingmtls | PATH: diplomat-bit-aibankingmtls-6a06a68/src/services/geminiService.ts
================================================================================

import { Transaction, Account } from "../types";

export async function getFinancialAdvice(
  userMessage: string,
  transactions: Transaction[],
  accounts: Account[]
) {
  try {
    const response = await fetch('/api/gemini/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage, transactions, accounts })
    });
    const data = await response.json();
    return data.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Proxy Error (getFinancialAdvice):", error);
    return "I'm sorry, I encountered an error while processing your request.";
  }
}

export async function categorizeTransaction(description: string) {
  try {
    const response = await fetch('/api/gemini/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    });
    const data = await response.json();
    return data.category || "Other";
  } catch (error) {
    console.error("Gemini Proxy Error (categorizeTransaction):", error);
    return "Other";
  }
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibankingnew | ORIGINAL PATH: diplomat-bit-aibankingnew-a0c4868/src/services/geminiService.ts
================================================================================

import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 2000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || 
                        error?.message?.includes('429') || 
                        error?.message?.includes('RESOURCE_EXHAUSTED') ||
                        error?.status === 'RESOURCE_EXHAUSTED';
                        
    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit, retrying in ${delayMs}ms... (${retries} retries left)`);
      await delay(delayMs);
      return withRetry(fn, retries - 1, delayMs * 2);
    }
    throw error;
  }
};

export const analyzeFinances = async (transactions: Transaction[], userPrompt: string) => {
  const model = "gemini-3-flash-preview";
  
  const context = `
    You are Nexus AI, a highly sophisticated financial advisor. 
    Here are the user's recent transactions:
    ${JSON.stringify(transactions, null, 2)}
    
    The user is asking: "${userPrompt}"
    
    Provide a professional, helpful, and data-driven response. 
    Focus on budgeting, savings opportunities, and financial health.
    Keep the tone encouraging but realistic.
    Use markdown for formatting.
  `;

  try {
    const response = await withRetry(() => genAI.models.generateContent({
      model,
      contents: context,
    }));
    return response.text || "I'm sorry, I couldn't analyze your finances at this moment.";
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      return "The AI advisor is currently experiencing high demand. Please try again in a few moments.";
    }
    return "Error connecting to AI advisor. Please try again later.";
  }
};

export const forgeApi = async (apiSpec: any, model = "gemini-3.1-pro-preview") => {
  const context = `
    You are the Nexus API Forge Engine. 
    Your task is to take the following OpenAPI specification and "forge" it into a production-grade, FAPI-compliant banking application structure.
    
    API Spec:
    ${JSON.stringify(apiSpec, null, 2)}
    
    Provide a detailed report on:
    1. **FAPI Compliance**: How this API should be secured (mTLS, JWS, OIDC).
    2. **Architecture**: Recommended microservices structure.
    3. **Implementation**: Key code snippets or patterns for a "production-grade" version.
    4. **Banking Logic**: How this functions as part of an AI-driven bank.
    
    Use markdown for formatting. Be technical and professional.
  `;

  try {
    const response = await withRetry(() => genAI.models.generateContent({
      model,
      contents: context,
    }));
    return response.text || "Forge engine failed to process the API.";
  } catch (error: any) {
    console.error("Gemini Forge Error:", error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      return "The Forge Engine is currently experiencing high demand. Please try again in a few moments.";
    }
    return "Error connecting to the Forge Engine.";
  }
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/gameover | ORIGINAL PATH: diplomat-bit-gameover-da1da3c/src/services/geminiService.ts
================================================================================

import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 2000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || 
                        error?.message?.includes('429') || 
                        error?.message?.includes('RESOURCE_EXHAUSTED') ||
                        error?.status === 'RESOURCE_EXHAUSTED';
                        
    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit, retrying in ${delayMs}ms... (${retries} retries left)`);
      await delay(delayMs);
      return withRetry(fn, retries - 1, delayMs * 2);
    }
    throw error;
  }
};

export const analyzeFinances = async (transactions: Transaction[], userPrompt: string) => {
  const model = "gemini-3-flash-preview";
  
  const context = `
    You are Nexus AI, a highly sophisticated financial advisor. 
    Here are the user's recent transactions:
    ${JSON.stringify(transactions, null, 2)}
    
    The user is asking: "${userPrompt}"
    
    Provide a professional, helpful, and data-driven response. 
    Focus on budgeting, savings opportunities, and financial health.
    Keep the tone encouraging but realistic.
    Use markdown for formatting.
  `;

  try {
    const response = await withRetry(() => genAI.models.generateContent({
      model,
      contents: context,
    }));
    return response.text || "I'm sorry, I couldn't analyze your finances at this moment.";
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      return "The AI advisor is currently experiencing high demand. Please try again in a few moments.";
    }
    return "Error connecting to AI advisor. Please try again later.";
  }
};

export const forgeApi = async (apiSpec: any, model = "gemini-3.1-pro-preview") => {
  const context = `
    You are the Nexus API Forge Engine. 
    Your task is to take the following OpenAPI specification and "forge" it into a production-grade, FAPI-compliant banking application structure.
    
    API Spec:
    ${JSON.stringify(apiSpec, null, 2)}
    
    Provide a detailed report on:
    1. **FAPI Compliance**: How this API should be secured (mTLS, JWS, OIDC).
    2. **Architecture**: Recommended microservices structure.
    3. **Implementation**: Key code snippets or patterns for a "production-grade" version.
    4. **Banking Logic**: How this functions as part of an AI-driven bank.
    
    Use markdown for formatting. Be technical and professional.
  `;

  try {
    const response = await withRetry(() => genAI.models.generateContent({
      model,
      contents: context,
    }));
    return response.text || "Forge engine failed to process the API.";
  } catch (error: any) {
    console.error("Gemini Forge Error:", error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      return "The Forge Engine is currently experiencing high demand. Please try again in a few moments.";
    }
    return "Error connecting to the Forge Engine.";
  }
};
