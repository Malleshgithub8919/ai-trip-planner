import React, { useState, useEffect } from 'react'
import TravelPlan from '../components/TravelPlan';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import GooglePlacesAutocomplete from '../components/custom/GooglePlacesAutocomplete'
import { Input } from '../components/ui/input'
import { SelectBudgetOptions, SelectTravelesList, AI_PROMPT } from '../components/constants/options'
import { toast } from 'sonner'
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../service/firebaseConfig';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { generateTravelPlan } from '../service/AIModel'
import { GoogleLogin } from '@react-oauth/google'
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '../components/ui/button'
import { getTripsByUser } from '../service/firebaseService';

function CreateTrip() {
  const navigate = useNavigate();
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDailog, setOpenDailog] = useState(false);
  const [travelPlan, setTravelPlan] = useState(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (process.env.NODE_ENV === 'development') {
      console.log('Google Client ID:', clientId ? 'Present' : 'Missing');
      if (clientId) {
        console.log('Client ID length:', clientId.length);
        console.log('Ends with .apps.googleusercontent.com:', clientId.endsWith('.apps.googleusercontent.com'));
        
        if (!clientId.endsWith('.apps.googleusercontent.com')) {
          console.error('❌ Invalid Google Client ID format. Should end with .apps.googleusercontent.com');
        }
      }
    }
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handlePlaceSelect = (place) => {
    setDestination(place.formatted_address)
    setSelectedPlace(place)
    handleInputChange('destination', place.formatted_address)
  }

  useEffect(() => {
    console.log(formData);
  }, [formData])

  const OnGenerateTrip = async () => {
    toast.info('OnGenerateTrip called');
    console.log('OnGenerateTrip called');
    
    // Check localStorage user first
    const user = localStorage.getItem('user');
    
    console.log('localStorage user:', user ? 'exists' : 'missing');
    
    // If no user at all, show login dialog
    if (!user) {
      console.log('No user found, opening login dialog');
      setOpenDailog(true);
      return;
    }
    if (formData?.noOfDays > 5) {
      toast("Please select travel days 5 or less")
      return;
    }
    
    if (!formData?.destination || !formData?.budget || !formData?.traveler) {
      toast("Please fill all the details")
      return;
    }
    
    setLoading(true);
    
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.destination)
      .replace('{budget}', formData?.budget)
      .replace('{people}', formData?.traveler)
      .replace('{days}', formData?.noOfDays)
    
    try {
      const result = await generateTravelPlan(FINAL_PROMPT);
      console.log("Generated travel plan:", result);
      let parsedPlan = result;
      
      // If result is a string, extract only the JSON part
      if (typeof result === 'string') {
        try {
          let cleaned = result.trim();
          
          // First, try to extract JSON from markdown code blocks
          const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (codeBlockMatch) {
            cleaned = codeBlockMatch[1].trim();
          }
          
          // Remove any remaining markdown formatting
          cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          
          // Find the first '{' and last '}' to extract JSON
          const firstCurly = cleaned.indexOf('{');
          const lastCurly = cleaned.lastIndexOf('}');
          
          if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
            cleaned = cleaned.substring(firstCurly, lastCurly + 1);
            parsedPlan = JSON.parse(cleaned);
            console.log("✅ Successfully parsed JSON from AI response");
          } else {
            // If no JSON structure found, try to parse the entire string
            parsedPlan = JSON.parse(cleaned);
            console.log("✅ Successfully parsed JSON from cleaned string");
          }
        } catch (parseError) {
          console.error('❌ Failed to parse JSON:', parseError);
          console.error('❌ Raw response was:', result);
          toast.error('Failed to parse travel plan. Please try again.');
          return;
        }
      }
      setTravelPlan(parsedPlan);
      localStorage.setItem('travelPlan', JSON.stringify(parsedPlan));
      await SaveTrip(parsedPlan);
      toast.success("Trip generated successfully! Redirecting to showcase...");
      console.log('Navigating to /showcase');
      try {
        navigate('/showcase'); // Redirect to the beautiful showcase page
      } catch (navErr) {
        window.location.href = '/showcase'; // Fallback for navigation issues
      }
    } catch (error) {
      toast.error('Error in OnGenerateTrip: ' + (error.message || error));
      console.error("Error generating trip:", error);
    } finally {
      setLoading(false);
    }
  }
  const SaveTrip = async (TripData) => { 
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        console.error('No user found in localStorage');
        toast.error('User not found. Please sign in again.');
        return;
      }
      
      const docId = Date.now().toString();
      
      // For now, just save to localStorage instead of Firestore
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      const newTrip = {
        userSelection: formData,
        tripData: TripData,
        userEmail: user?.email,
        id: docId,
        createdAt: new Date().toISOString()
      };
      
      savedTrips.push(newTrip);
      localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
      
      console.log('✅ Trip saved successfully to localStorage');
      setLoading(false);
      // Do not navigate here; navigation to /showcase happens after trip generation
    } catch (error) {
      console.error('❌ Error saving trip:', error);
      toast.error('Failed to save trip. Please try again.');
      setLoading(false);
    }
  }

    
          

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'Application/json'
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log('Login response:', credentialResponse);
      
      if (!credentialResponse?.credential) {
        toast.error("Authentication failed. No credential received.");
        return;
      }
      
      // Decode the JWT token for user info
      const responsePayload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      console.log("User Info:", responsePayload);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture,
        sub: responsePayload.sub
      }));
      
      setOpenDailog(false);
      toast.success(`Welcome ${responsePayload.name}!`);
      
      // Try to generate trip immediately if form is filled
      if (formData?.destination && formData?.budget && formData?.traveler && formData?.noOfDays) {
        console.log('Form is filled, attempting to generate trip after login');
        setTimeout(() => OnGenerateTrip(), 1000); // Small delay to ensure auth is set
      }
      
    } catch (error) {
      console.error('Error processing login:', error);
      toast.error("Login processing failed. Please try again.");
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google Login Error:', error);
    
    // Handle specific error types
    if (error === 'popup_closed_by_user') {
      toast.error("Login cancelled by user.");
    } else if (error === 'access_blocked') {
      toast.error("Access blocked. Please contact support.");
    } else if (error === 'invalid_client') {
      toast.error("Invalid client configuration. Please check your Google OAuth setup.");
    } else {
      toast.error("Login failed. Please try again.");
    }
  };

  const loadUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email) {
      try {
        const trips = await getTripsByUser(user.email);
        console.log('User trips:', trips);
        // You can set this to state if needed
      } catch (error) {
        console.error('Error loading trips:', error);
      }
    }
  };

  useEffect(() => {
    loadUserTrips();
    
    // Check authentication status on mount
    const localStorageUser = localStorage.getItem('user');
    if (localStorageUser) {
      console.log('✅ User found in localStorage');
    } else {
      console.log('❌ No user found in localStorage');
    }
  }, []);

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>

      
      <h2 className='font-bold text-3xl'>Tell us your travel preferences🏕️🌴</h2>
      <p className='mt-3text-black-500 text-xl'>Just provide some basic information, and our trip planner will do the rest</p>

      <div className="text-2xl my-6 font-semibold text-gray-800">
  <h3 className="mb-4">🌍 What is your destination of choice?</h3>

  <div className="bg-blue-50 p-4 rounded-xl shadow-lg border border-black-200">
    <GooglePlacesAutocomplete
      apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
      onPlaceSelect={handlePlaceSelect}
      placeholder="e.g., Paris, Tokyo, New York"
      className="w-full text-base"
    />
    
    {selectedPlace && (
      <p className="mt-3 text-sm text-green-700 font-medium bg-green-50 p-2 rounded-lg">
        ✈️ Selected: {destination}
      </p>
    )}
  </div>
</div>


      <div className='mt-8'>
        <div>
          <h2 className='text-3xl my-3 font-medium'>How many days are you planning to stay?</h2>
          <Input 
            placeholder={'Ex.3'} 
            type="number"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className='text-3xl my-3 font-medium'>What is your budget?</h2>
      </div>
      
      <div className='grid grid-cols-3 gap-5 mt-5'>
        {SelectBudgetOptions.map((item, index) => (
          <div key={index} 
            onClick={() => handleInputChange('budget', item.title)}
            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${formData?.budget === item.title ? 'shadow-lg border-black' : ''}`}>
            <h2 className='text-4xl'>{item.icon}</h2>
            <h2 className='font-bold text-lg'>{item.title}</h2>
            <h2>{item.desc}</h2>
          </div>
        ))}
      </div>
      
      <div>
        <h2 className='text-3xl my-3 font-medium'>Who do you plan on traveling with?</h2>
      </div>
      
      <div className='grid grid-cols-3 gap-5 mt-5'>
        {SelectTravelesList.map((item, index) => (
          <div key={index} 
            onClick={() => handleInputChange('traveler', item.people)}
            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${formData?.traveler === item.people ? 'shadow-lg border-black' : ''}`}>
            <h2 className='text-4xl'>{item.icon}</h2>
            <h2 className='font-bold text-lg'>{item.title}</h2>
            <h2>{item.desc}</h2>
          </div>
        ))}
      </div>

      <div className='my-10 justify-end flex gap-4'>
        {/* Debug button - remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('savedTrips');
              toast.info('Cleared authentication. Please sign in again.');
            }}
            className="bg-gray-500 text-white p-3 rounded-lg font-bold hover:bg-gray-600"
          >
            Clear Auth (Debug)
          </button>
        )}
        
        <button 
          onClick={OnGenerateTrip} 
          disabled={loading}
          className={`bg-black text-white p-3 rounded-lg font-bold ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />
              Generating...
            </>
          ) : (
            'Generate Trip'
          )}
        </button>
      </div>
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-lg mt-7 text-center">
              Sign in with Google
            </DialogTitle>
            <DialogDescription>
              Sign in to the App with Google authentication securely
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="AI Travel Planner" className="h-16 w-auto" />
          </div>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
              useOneTap={false}
              auto_select={false}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              cancel_on_tap_outside={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>

  )
}

export default CreateTrip





















