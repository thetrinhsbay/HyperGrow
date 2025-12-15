
import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Standard content generation for quick tasks (Content, Basic Chat)
 */
export const generateFastContent = async (prompt: string, modelName: string = 'gemini-2.5-flash'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Fast generation error:", error);
    return "Error generating content. Please check API key.";
  }
};

/**
 * DEEP THINKING MODE: Uses gemini-3-pro-preview with high thinking budget.
 * Used for Complex Strategy, Deep Analysis, and Coaching.
 */
export const generateDeepStrategy = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768, // MAX Thinking Budget
        },
        // DO NOT set maxOutputTokens here to allow full reasoning output
      },
    });
    return response.text || "I couldn't generate a deep strategy.";
  } catch (error) {
    console.error("Thinking mode error:", error);
    return "The strategy engine encountered an error. Please try again.";
  }
};

/**
 * DEEP THINKING: Analytics & Insight Generation
 */
export const generateDeepAnalysis = async (dataContext: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep analysis on the following business data. Identify hidden patterns, anomalies, and provide 3 strategic recommendations based on the numbers.\n\nData Context: ${dataContext}`,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768, // MAX Thinking Budget for deep analysis
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
export const analyzeEcosystem = async (systemStateJSON: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the Master System Architect of a "Spider Web" business ecosystem. 
      Analyze the following system state containing Leads, User Performance (KPI), and Interactions.
      
      Your Goal:
      1. Identify bottlenecks in the flow (e.g., Leads not being called).
      2. Evaluate Employee Performance based on the Scoring Matrix.
      3. Suggest specific cross-module actions (e.g., "Trigger Marketing for Segment B").
      
      System State:
      ${systemStateJSON}`,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768, // MAX Thinking Budget
        },
      },
    });
    return response.text || "Ecosystem analysis failed.";
  } catch (error) {
    console.error("Ecosystem analysis error:", error);
    return "Could not analyze ecosystem.";
  }
};

/**
 * REAL GOOGLE PLACES API SEARCH
 * Searches for businesses using the Places API v1
 */
export const searchBusinessLeadsViaPlaces = async (term: string, location: string): Promise<Lead[]> => {
  const apiKey = process.env.API_KEY;
  const url = "https://places.googleapis.com/v1/places:searchText";
  const textQuery = `${term} in ${location}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey || "",
        // Requested FieldMask
        "X-Goog-FieldMask": "places.displayName,places.nationalPhoneNumber,places.googleMapsUri,places.addressComponents,places.formattedAddress" 
      },
      body: JSON.stringify({
        textQuery: textQuery,
        pageSize: 8 // As requested
      })
    });

    if (!response.ok) {
      console.error("Places API Error:", response.status, await response.text());
      return [];
    }

    const data = await response.json();
    
    if (!data.places || data.places.length === 0) {
      return [];
    }

    // Map Places API response to our Lead interface
    const leads: Lead[] = data.places.map((place: any, index: number) => {
      // Construct a readable address from components if formattedAddress is missing
      let addressStr = place.formattedAddress;
      if (!addressStr && place.addressComponents) {
         addressStr = place.addressComponents.map((c: any) => c.shortText).join(', ');
      }

      return {
        id: `place_${Date.now()}_${index}`,
        name: place.displayName?.text || "Unknown Business",
        company: place.displayName?.text || "Unknown Company",
        location: addressStr || location,
        phone: place.nationalPhoneNumber || "", // Empty string if no phone found
        email: "", // Places API doesn't return email publicly usually
        source: 'google_places',
        status: 'new',
        score: place.nationalPhoneNumber ? 80 : 40, // Higher score if phone exists
        notes: `Google Maps: ${place.googleMapsUri || 'N/A'}`,
        createdAt: Date.now()
      };
    });

    return leads;

  } catch (error) {
    console.error("Search fetch error:", error);
    return [];
  }
};

/**
 * DEEP THINKING: Code Analysis & Auto-Fix
 * Upgraded to gemini-3-pro-preview for complex code reasoning.
 */
export const analyzeAndFixCode = async (codeSnippet: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this code/structure for errors, performance issues, accessibility, and clean code practices. Provide a corrected version and a brief explanation of the fixes.\n\nCode Snippet:\n${codeSnippet}`,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768, // MAX Thinking Budget for code logic
        },
      },
    });
    return response.text || "No fixes needed.";
  } catch (error) {
    return "Could not analyze code.";
  }
};
