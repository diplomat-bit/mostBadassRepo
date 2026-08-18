// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/api/gemini.ts
================================================================================

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, sessionId } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    // Initialize Gemini client
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // Generate content
    const result = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    return res.status(200).json({
      text: result.text,
      sessionId,
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return res.status(500).json({
      error: "Quantum AI Core unavailable",
    });
  }
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/api/gemini.ts
================================================================================

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, sessionId } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API configuration error" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return res.status(200).json({
      text: response.text(),
      sessionId,
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return res.status(500).json({
      error: "Quantum AI Core unavailable",
    });
  }
}

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/api/gemini.ts
================================================================================

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, sessionId } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API configuration error" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return res.status(200).json({
      text: response.text(),
      sessionId,
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return res.status(500).json({
      error: "Quantum AI Core unavailable",
    });
  }
}