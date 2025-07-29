import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import CreateTrip from './create-trip/index.jsx'
import { Toaster } from './components/ui/sonner.jsx'
import Viewtrip from './view-trip/[tripid]/index.jsx'
import TripsList from './components/TripsList'
import TravelPlanShowcase from './pages/TravelPlanShowcase.jsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  console.error('❌ Google Client ID is missing. Please check your .env file.');
} else {
  console.log('✅ Google Client ID loaded successfully');
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/create-trip',
    element: <CreateTrip />
  },
  {
    path: '/showcase',
    element: <TravelPlanShowcase />
  },
  {
    path: '/view-trip/:tripId',
    element: <Viewtrip />
  },
  {
    path: '/my-trips',
    element: <TripsList />
  }
]);

// Create root only once
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <RouterProvider router={router} />
      <Toaster />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
