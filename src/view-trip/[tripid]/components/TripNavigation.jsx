import React from 'react';
import { useNavigate } from 'react-router-dom';

function TripNavigation({ tripData }) {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/my-trips');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and trip info */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Trips
            </button>
            
            {tripData && (
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-800">
                  {tripData.location || 'Trip Details'}
                </h1>
                <p className="text-sm text-gray-500">
                  {tripData.totalDays} days • {tripData.budget} budget • {tripData.traveler}
                </p>
              </div>
            )}
          </div>

          {/* Right side - Navigation links */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleHome}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Home
            </button>
            
            <button
              onClick={() => navigate('/create-trip')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Plan New Trip
            </button>
          </div>
        </div>
        
        {/* Mobile trip info */}
        {tripData && (
          <div className="md:hidden mt-2 pt-2 border-t">
            <h1 className="text-lg font-semibold text-gray-800">
              {tripData.location || 'Trip Details'}
            </h1>
            <p className="text-sm text-gray-500">
              {tripData.totalDays} days • {tripData.budget} budget • {tripData.traveler}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripNavigation;
