import { GoogleGenAI } from "@google/genai";
import { PredictionResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPredictionsForLeague = async (leagueName: string): Promise<PredictionResult> => {
  const modelId = "gemini-2.5-flash"; // Using flash for speed + search capability

  const prompt = `
    I need a football prediction analysis for the top 3 teams currently in the ${leagueName}.
    
    Step 1: Use Google Search to find the current top 3 teams in the league table right now.
    Step 2: For each of these 3 teams, find their very next upcoming match opponent.
    Step 3: Analyze the match based on:
      - Recent form (last 5 games).
      - Latest news (injuries, suspensions, managerial changes).
      - Head-to-head history if relevant.
    Step 4: Predict the final score.

    Format the output clearly. Use the delimiter "---MATCH_ANALYSIS---" between each of the 3 matches so I can split them later.
    
    For each match, structure the text like this:
    **Match:** [Home Team] vs [Away Team]
    **Current Standings:** [Team] is currently [Position]
    **Form Guide:** [Brief details]
    **Key News:** [Brief details]
    **Prediction:** [Home Score] - [Away Score]
    **Reasoning:** [Your analysis]
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3, // Lower temperature for more analytical/factual responses
      },
    });

    const rawText = response.text || "No analysis generated.";
    
    // Extract grounding chunks for citations
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      rawText,
      groundingChunks
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate predictions. Please try again later.");
  }
};