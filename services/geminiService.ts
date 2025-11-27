import { GoogleGenAI, Type } from "@google/genai";
import { ComponentType, BuildState, UserPreferences, Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using a slightly more capable model for reasoning about compatibility
const MODEL_NAME = "gemini-2.5-flash"; 

interface RecommendationResponse {
  products: Product[];
}

export const fetchRecommendations = async (
  step: ComponentType,
  currentBuild: BuildState,
  prefs: UserPreferences
): Promise<Product[]> => {
  
  // Construct a context-aware prompt
  const builtSoFar = Object.entries(currentBuild)
    .map(([key, val]) => `${key}: ${val?.name}`)
    .join(", ");

  const context = builtSoFar ? `Current Build Parts: ${builtSoFar}.` : "Starting a new build.";

  const prompt = `
    You are an expert PC Builder in India. 
    The user wants to build a PC for "${prefs.usage}" with a budget tier of "${prefs.budgetRange}".
    
    ${context}
    
    Task: Recommend 4 specific "${step}" products available on Amazon India right now that are strictly compatible with the current build parts listed above.
    If selecting a Motherboard, ensure it matches the CPU socket.
    If selecting RAM, ensure it matches the Motherboard type (DDR4/DDR5).
    If selecting a PSU, estimate the wattage needed.
    
    Provide the price in Indian Rupees (INR) as a number (approximate market price).
    Provide a short "reason" why this specific part is a good choice for this build/budget.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            products: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Full product name as listed on Amazon India" },
                  price: { type: Type.NUMBER, description: "Price in INR (numeric only)" },
                  features: { type: Type.STRING, description: "Key technical specs (e.g., 'AM5, 6 Cores', '850W Gold')" },
                  rating: { type: Type.NUMBER, description: "Estimated star rating 1-5" },
                  reason: { type: Type.STRING, description: "Compatibility or value reason" }
                },
                required: ["name", "price", "features", "rating", "reason"]
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    const parsed = JSON.parse(jsonText) as RecommendationResponse;
    return parsed.products;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return empty array to let UI handle error state
    return [];
  }
};
