// Google OAuth configuration using environment variables
export const googleAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  projectId: import.meta.env.VITE_GOOGLE_PROJECT_ID,
  authUri: "https://accounts.google.com/o/oauth2/auth",
  tokenUri: "https://oauth2.googleapis.com/token",
  authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
  redirectUris: [
    "https://ai-trip-planner-amber-two.vercel.app",
    "https://ai-trip-planner-malleshgithub8919s-projects.vercel.app",
    "http://localhost:5173" // for local development
  ],
  javascriptOrigins: [
    "https://ai-trip-planner-amber-two.vercel.app",
    "https://ai-trip-planner-malleshgithub8919s-projects.vercel.app",
    "http://localhost:5173"
  ]
};

// Helper function to get client ID (most commonly used)
export const getGoogleClientId = () => {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID;
};

// Validate that required environment variables are present
export const validateGoogleConfig = () => {
  const requiredVars = [
    'VITE_GOOGLE_CLIENT_ID',
    'VITE_GOOGLE_PROJECT_ID'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required Google OAuth environment variables:', missing);
    return false;
  }
  
  return true;
};
