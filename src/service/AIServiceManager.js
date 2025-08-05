// Backup AI service using OpenAI as fallback
export class AIServiceManager {
  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
    this.geminiBackupKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Try maps key as backup
    this.currentService = 'gemini';
  }

  async testApiKey(apiKey) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Test with a simple prompt
      const result = await model.generateContent("Hello");
      await result.response;
      return true;
    } catch (error) {
      console.log(`API key test failed: ${error.message}`);
      return false;
    }
  }

  async generateWithGemini(prompt, apiKey) {
    const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = await import("@google/generative-ai");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"];
    
    for (const modelName of models) {
      try {
        console.log(`🤖 Trying ${modelName} with API key ending in ...${apiKey.slice(-4)}`);
        
        const model = genAI.getGenerativeModel({
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ Success with ${modelName}`);
        return text;
        
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message}`);
        
        // If it's not a 503 error, try next model
        if (!error.message?.includes("503") && !error.message?.includes("overloaded")) {
          continue;
        }
        
        // For 503 errors, wait a bit then try next model
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    throw new Error("All Gemini models failed");
  }

  async generateTravelPlan(prompt) {
    console.log("🚀 Starting AI travel plan generation...");
    
    // Try primary Gemini API key
    if (this.geminiApiKey) {
      try {
        console.log("🔑 Trying primary Gemini API key...");
        const result = await this.generateWithGemini(prompt, this.geminiApiKey);
        return this.parseResponse(result);
      } catch (error) {
        console.log(`❌ Primary key failed: ${error.message}`);
      }
    }

    // Try backup API key (Maps key might work for Gemini too)
    if (this.geminiBackupKey && this.geminiBackupKey !== this.geminiApiKey) {
      try {
        console.log("🔑 Trying backup API key...");
        const result = await this.generateWithGemini(prompt, this.geminiBackupKey);
        return this.parseResponse(result);
      } catch (error) {
        console.log(`❌ Backup key failed: ${error.message}`);
      }
    }

    // If both fail, provide a mock response for development
    console.log("⚠️ All AI services failed, using mock data for development");
    return this.getMockTravelPlan();
  }

  parseResponse(text) {
    try {
      const jsonResponse = JSON.parse(text);
      console.log("✅ Successfully parsed JSON response");
      return jsonResponse;
    } catch (parseError) {
      console.log("⚠️ JSON parsing failed, trying to extract JSON from text");
      
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.log("Failed to parse extracted JSON");
        }
      }
      
      // Return raw text if JSON parsing fails
      return text;
    }
  }

  getMockTravelPlan() {
    return {
      tripData: {
        location: "Sample Destination",
        totalDays: 3,
        budget: "Moderate",
        traveler: "Solo",
        hotels: [
          {
            Name: "Sample Hotel",
            address: "123 Sample Street",
            price: "$100-150/night",
            imageUrl: "/placeholder.jpg",
            geoCoordinates: { lat: 40.7128, lng: -74.0060 },
            rating: 4.5,
            description: "A comfortable hotel for your stay"
          }
        ],
        itinerary: [
          {
            day: 1,
            plan: [
              {
                placeName: "Sample Attraction",
                placeDetails: "A beautiful place to visit",
                placeImageUrl: "/placeholder.jpg",
                geoCoordinates: { lat: 40.7128, lng: -74.0060 },
                ticketPricing: "$20",
                timeTravel: "2 hours"
              }
            ]
          }
        ]
      }
    };
  }
}

export const aiService = new AIServiceManager();
