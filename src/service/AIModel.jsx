import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { aiService } from './AIServiceManager';

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

if (!apiKey) {
  console.error("❌ Gemini API key is missing. Please check your .env.local file");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",  // Using Pro version which might be less congested
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
  console.log("🚀 Using enhanced AI service manager...");
  
  try {
    // Use the new AI service manager which has better error handling and fallbacks
    return await aiService.generateTravelPlan(prompt);
  } catch (error) {
    console.error("❌ AI Service Manager failed, trying legacy method...");
    
    // Fallback to original method
    return await generateTravelPlanLegacy(prompt);
  }
}

// Keep the original method as fallback
async function generateTravelPlanLegacy(prompt) {
  try {
    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }

    console.log("🚀 Sending request to Gemini AI...");
    console.log("Prompt:", prompt);
    
    // Try different models in order of preference
    const modelsToTry = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"];
    let lastError = null;
    
    for (const modelName of modelsToTry) {
      console.log(`🤖 Trying model: ${modelName}`);
      
      const currentModel = genAI.getGenerativeModel({
        model: modelName,
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
      
      // Retry logic for each model
      const maxRetries = 2;
      const retryDelay = 3000; // 3 seconds
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Attempt ${attempt}/${maxRetries} with ${modelName}...`);
          
          const result = await currentModel.generateContent(prompt);
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
          
        } catch (attemptError) {
          console.log(`❌ Attempt ${attempt} with ${modelName} failed:`, attemptError.message);
          lastError = attemptError;
          
          // Check if it's a server overload (503) error
          if (attemptError.message?.includes("503") || attemptError.message?.includes("overloaded")) {
            if (attempt < maxRetries) {
              console.log(`⏳ Server overloaded, waiting ${retryDelay}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              continue;
            }
            // If all retries failed for this model, try next model
            break;
          }
          
          // For other errors, don't retry this model
          break;
        }
      }
    }
    
    // If we get here, all models failed
    throw lastError || new Error("All models failed to respond");
    
  } catch (err) {
    console.error("❌ Error generating travel plan:", err);
    
    if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("Invalid API key")) {
      throw new Error("Invalid API key. Please check your Gemini API key.");
    } else if (err.message?.includes("QUOTA_EXCEEDED")) {
      throw new Error("API quota exceeded. Please try again later.");
    } else if (err.message?.includes("SAFETY")) {
      throw new Error("Content was blocked by safety filters. Please try a different destination.");
    } else if (err.message?.includes("503") || err.message?.includes("overloaded")) {
      throw new Error("Google AI service is currently experiencing high traffic. Please try again in 5-10 minutes.");
    } else {
      throw new Error(`Failed to generate travel plan: ${err.message}`);
    }
  }
}   