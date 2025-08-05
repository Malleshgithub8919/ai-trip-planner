# API Setup Instructions

## The 503 errors for multiple days suggest API configuration issues. Here's how to fix:

### 1. Enable Required APIs in Google Cloud Console

Go to [Google Cloud Console](https://console.cloud.google.com/apis/library) and make sure these APIs are enabled for project `smart-trip-466602`:

**Required APIs:**
- ✅ **Generative Language API** (for Gemini AI)
- ✅ **Maps JavaScript API** (for Google Maps)  
- ✅ **Places API** (for place autocomplete)
- ✅ **Geocoding API** (for location data)

### 2. Check API Key Restrictions

1. Go to [API Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your API key: `AIzaSyC7Sx6g2LmX7ByoX-fGhixDHelRCb3-Lxs`
3. Under "API restrictions":
   - Either select "Don't restrict key" (for testing)
   - Or ensure these APIs are allowed:
     - Generative Language API
     - Maps JavaScript API
     - Places API

### 3. Check Billing

Gemini AI requires a billing account:
1. Go to [Billing](https://console.cloud.google.com/billing)
2. Make sure your project has billing enabled
3. Check if you have any quota limits reached

### 4. Test API Key

Run this in your browser console on any page:
```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC7Sx6g2LmX7ByoX-fGhixDHelRCb3-Lxs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contents: [{
      parts: [{
        text: "Hello"
      }]
    }]
  })
})
.then(r => r.json())
.then(console.log);
```

### 5. Alternative: Get New API Key

If current key has issues, create a new one:
1. Go to [API Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "API Key"
3. Copy the new key and update your `.env.local`

### 6. Verify Project Quotas

Check [Quotas page](https://console.cloud.google.com/iam-admin/quotas) for:
- Generative Language API quotas
- Daily request limits
- Any exceeded quotas
