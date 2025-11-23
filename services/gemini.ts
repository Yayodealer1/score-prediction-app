import { GoogleGenAI } from "@google/genai";
import { PredictionResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPredictionsForLeague = async (leagueName: string): Promise<PredictionResult> => {
  const modelId = "gemini-2.5-flash"; // Using flash for speed + search capability

  const prompt = `
    I need a comprehensive football prediction analysis for the top 3 teams currently in the ${leagueName}.
    
    Step 1: Use Google Search to find the current top 3 teams in the league table right now.
    Step 2: For each of these 3 teams, find their very next upcoming match opponent.
    Step 3: Analyze the match considering these specific factors:
      - **Current Form**: Last 5 games for both teams.
      - **Head-to-Head (H2H)**: History of the last 5 meetings between these two specific clubs. Note who usually wins.
      - **Home vs Away**: Compare the home team's performance at home vs the away team's performance away. This is critical.
      - **Squad News**: Key injuries or suspensions.
    Step 4: Predict the final score and identify 2 likely goal scorers based on player form.

    Format the output clearly. Use the delimiter "---MATCH_ANALYSIS---" between each of the 3 matches so I can split them later.
    
    For each match, structure the text exactly like this (keep the headers exactly as written):
    **Match:** [Home Team] vs [Away Team]
    **Current Standings:** [Brief context on positions]
    **H2H & Form:** [Discuss recent form and H2H history]
    **Home/Away Advantage:** [Analyze home strength vs away weakness]
    **Key News:** [Important injuries/suspensions]
    **Likely Scorers:** [List 1-2 probable scorers]
    **Prediction:** [Home Score] - [Away Score]
    **Reasoning:** [Summary of analysis]
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