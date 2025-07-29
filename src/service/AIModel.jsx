import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

if (!apiKey) {
  console.error("❌ Gemini API key is missing. Please check your .env.local file");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

export async function generateTravelPlan(prompt) {
  try {
    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }

    console.log("🚀 Sending request to Gemini AI...");
    console.log("Prompt:", prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ Raw response from Gemini AI:", text);
    
    // Try to parse JSON response directly
    try {
      const jsonResponse = JSON.parse(text);
      console.log("✅ Successfully parsed JSON response directly");
      return jsonResponse;
    } catch (parseError) {
      console.log("⚠️ Direct JSON parsing failed, response may contain markdown formatting");
      console.log("⚠️ Parse error:", parseError.message);
      console.log("⚠️ Returning raw text for further processing");
      return text;
    }
    
  } catch (err) {
    console.error("❌ Error generating travel plan:", err);
    
    if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("Invalid API key")) {
      throw new Error("Invalid API key. Please check your Gemini API key.");
    } else if (err.message?.includes("QUOTA_EXCEEDED")) {
      throw new Error("API quota exceeded. Please try again later.");
    } else if (err.message?.includes("SAFETY")) {
      throw new Error("Content was blocked by safety filters. Please try a different destination.");
    } else {
      throw new Error(`Failed to generate travel plan: ${err.message}`);
    }
  }
}   