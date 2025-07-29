import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import InfoSection from './view-trip/[tripid]/components/infoSection'

function App() {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleGoogleLogin = (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Authentication failed. No credential received.");
        return;
      }
      
      const responsePayload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      const userData = {
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture,
        sub: responsePayload.sub
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setOpenDialog(false);
      toast.success(`Welcome ${responsePayload.name}!`);
      
    } catch (error) {
      console.error('Error processing login:', error);
      toast.error("Login processing failed. Please try again.");
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google Login Error:', error);
    toast.error("Login failed. Please try again.");
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Signed out successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Header */}
          <div className='p-3 shadow-sm flex justify-between items-center px-5 bg-white'>
            <img src='/logo.svg' alt="AI Travel Planner" className="h-12" />
            <div>
              {user ? (
                <div className="flex items-center gap-3">
                  <img 
                    src={user.picture} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{user.name}</span>
                  <button 
                    onClick={handleSignOut}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setOpenDialog(true)}
                  className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-800 mb-6">
                AI Travel Planner 🌍
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Plan your perfect trip with AI assistance
              </p>
              
              <div className="flex justify-center gap-4">
                <Link
                  to="/create-trip"
                  className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  Start Planning
                </Link>
                <Link
                  to="/my-trips"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  My Trips
                </Link>
              </div>
            </div>

            {/* Display InfoSection with placeholder image */}
            <div className="mt-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Discover Amazing Destinations
              </h2>
              <InfoSection trip={{
                userSelection: {
                  destination: {
                    location: {
                      label: "Sample Destination"
                    }
                  },
                  noOfDays: "3",
                  budget: "Moderate",
                  traveler: "2 People"
                }
              }} />
            </div>
          </div>

          {/* Sign In Dialog */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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

export default App





