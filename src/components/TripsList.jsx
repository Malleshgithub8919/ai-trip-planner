import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TripsList = ({ showAllTrips = false }) => {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Load trips from localStorage
  useEffect(() => {
    const loadTrips = () => {
      try {
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
        
        if (showAllTrips) {
          // Show all trips
          setTrips(savedTrips);
        } else {
          // Show only user's trips
          const userTrips = savedTrips.filter(trip => trip.userEmail === user?.email);
          setTrips(userTrips);
        }
      } catch (error) {
        console.error('Error loading trips:', error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadTrips();
    } else {
      setLoading(false);
    }
  }, [user, showAllTrips]);

  const isLoading = loading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading trips...</span>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium text-gray-900">No trips found</h3>
        <p className="text-gray-500">
          {showAllTrips ? 'No trips have been created yet.' : 'You haven\'t created any trips yet.'}
        </p>
        <Link
          to="/create-trip"
          className="inline-block mt-4 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800"
        >
          Create Your First Trip
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className='p-3 shadow-sm flex justify-between items-center px-5 bg-white'>
        <img src='/logo.svg' alt="AI Travel Planner" className="h-12" />
        <Link
          to="/create-trip"
          className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800"
        >
          Create New Trip
        </Link>
      </div>

      {/* Main Content */}
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
        <h2 className="text-3xl font-bold mb-8">
          {showAllTrips ? 'All Trips' : 'My Trips'}
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TripCard = ({ trip }) => {
  const formatDate = (timestamp) => {
    if (trip.createdAt) {
      return new Date(trip.createdAt).toLocaleDateString();
    }
    return new Date(parseInt(trip.id)).toLocaleDateString();
  };

  const handleViewTrip = () => {
    // Save the trip data to localStorage for the showcase to read
    localStorage.setItem('travelPlan', JSON.stringify(trip.tripData));
    // Navigate to showcase
    window.location.href = '/showcase';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {trip.tripData?.destination || trip.userSelection?.destination || 'Unknown Destination'}
        </h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {formatDate(trip.id)}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <span className="text-gray-700"><strong>Duration:</strong> {trip.tripData?.duration || trip.userSelection?.noOfDays || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">💰</span>
          <span className="text-gray-700"><strong>Budget:</strong> {trip.tripData?.budget || trip.userSelection?.budget || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <span className="text-gray-700"><strong>Travelers:</strong> {trip.tripData?.travelers || trip.userSelection?.traveler || 'N/A'}</span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button 
          onClick={handleViewTrip}
          className="w-full bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          View Full Plan →
        </button>
      </div>
    </div>
  );
};

export default TripsList;