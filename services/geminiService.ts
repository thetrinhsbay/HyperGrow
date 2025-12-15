// src/services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";

// ============ GEMINI CLIENT ============
let ai: GoogleGenAI | null = null;

function getGeminiClient() {
  if (ai) return ai;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("Gemini API key missing");
    return null;
  }

  ai = new GoogleGenAI({ apiKey });
  return ai;
}

/**
 * Standard content generation for quick tasks (Content, Basic Chat)
 */
export const generateFastContent = async (
  prompt: string,
  modelName: string = "gemini-2.5-flash"
): Promise<string> => {
  const client = getGeminiClient();
  if (!client) return "Gemini is not configured.";

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Fast generation error:", error);
    return "Error generating content.";
  }
};

/**
 * DEEP THINKING MODE: Uses gemini-3-pro-preview with high thinking budget.
 * Used for Complex Strategy, Deep Analysis, and Coaching.
 */
export const generateDeepStrategy = async (
  prompt: string
): Promise<string> => {
  const client = getGeminiClient();
  if (!client) return "Gemini is not configured.";

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768,
        },
      },
    });
    return response.text || "I couldn't generate a deep strategy.";
  } catch (error) {
    console.error("Thinking mode error:", error);
    return "The strategy engine encountered an error.";
  }
};

/**
 * DEEP THINKING: Analytics & Insight Generation
 */
export const generateDeepAnalysis = async (
  dataContext: string
): Promise<string> => {
  const client = getGeminiClient();
  if (!client) return "Gemini is not configured.";

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a deep analysis on the following business data. Identify hidden patterns, anomalies, and provide 3 strategic recommendations based on the numbers.\n\nData Context: ${dataContext}`,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768,
        },
      },
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Analysis error:", error);
    return "Could not perform deep analysis.";
  }
};

/**
 * SPIDER WEB SYSTEM ANALYSIS
 * Analyzes the interconnected state of the entire app.
 */
export const analyzeEcosystem = async (
  systemStateJSON: string
): Promise<string> => {
  const client = getGeminiClient();
  if (!client) return "Gemini is not configured.";

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are the Master System Architect of a "Spider Web" business ecosystem.
Analyze the following system state containing Leads, User Performance (KPI), and Interactions.

System State:
${systemStateJSON}`,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768,
        },
      },
    });
    return response.text || "Ecosystem analysis failed.";
  } catch (error) {
    console.error("Ecosystem analysis error:", error);
    return "Could not analyze ecosystem.";
  }
};


export const searchBusinessLeadsViaPlaces = async (
  term: string,
  location: string
): Promise<Lead[]> => {
  const apiKey =
    import.meta.env.VITE_GOOGLE_PLACES_API_KEY ||
    import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing Google Places API key");
    return [];
  }

  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.nationalPhoneNumber,places.googleMapsUri,places.addressComponents",
      },
      body: JSON.stringify({
        textQuery: `${term} ${location}`.trim(),
        pageSize: 8,
      }),
    }
  );

  if (!res.ok) {
    console.error("Places API error:", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  const places = (data.places ?? []) as any[];

  // Map JSON Places -> Lead để App.tsx hiển thị được luôn
  const leads: Lead[] = places.map((p, index) => {
    const address =
      (p.addressComponents ?? [])
        .map((c: any) => c.longText)
        .join(", ") || "";

    return {
      id: p.id ?? p.googleMapsUri ?? `place-${index}`,
      name: p.displayName?.text ?? "Unknown place",
      phone: p.nationalPhoneNumber ?? "",
      location: address, // dùng cho dòng phụ dưới tên
      // dùng notes để lưu link Google Maps như code App.tsx đang dùng
      notes: p.googleMapsUri ? `Google Maps: ${p.googleMapsUri}` : "",
    };
  });

  return leads;
};

// ============ CODE ANALYSIS ============
/**
 * DEEP THINKING: Code Analysis & Auto-Fix
 * Upgraded to gemini-3-pro-preview for complex code reasoning.
 */
export const analyzeAndFixCode = async (
  codeSnippet: string
): Promise<string> => {
  const client = getGeminiClient();
  if (!client) return "Gemini is not configured.";

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyze this code/structure for errors, performance issues, accessibility, and clean code practices. Provide a corrected version and a brief explanation of the fixes.\n\nCode Snippet:\n${codeSnippet}`,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768,
        },
      },
    });
    return response.text || "No fixes needed.";
  } catch (error) {
    console.error("Code analysis error:", error);
    return "Could not analyze code.";
  }
};
